-- ==============================================================================
-- HAPPYBIRTH DATABASE SCHEMA (SUPABASE POSTGRESQL + RLS)
-- Wersja: 2.0 (Rozszerzona o inteligentny profil ciąży i noworodka)
-- ==============================================================================

-- 1. ROZSZERZENIE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABELA PROFILI PODSTAWOWYCH (ROZSZERZENIE AUTH.USERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'partner', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Włączenie RLS dla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownik widzi swój profil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Użytkownik może edytować swój profil" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ==============================================================================
-- 3. TABELA INTELIGENTNYCH DANYCH CIĄŻY I DZIECKA (PREGNANCY_PROFILES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pregnancy_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    due_date DATE NOT NULL, -- Przewidywana data porodu (EDD)
    due_date_source TEXT DEFAULT 'usg' CHECK (due_date_source IN ('usg', 'om', 'gestational_week')),
    lmp_date DATE, -- Data ostatniej miesiączki (LMP / OM)
    baby_name TEXT, -- Imię dziecka (np. Zosia / Janek)
    baby_gender TEXT DEFAULT 'surprise' CHECK (baby_gender IN ('girl', 'boy', 'surprise', 'twins')),
    partner_name TEXT, -- Imię partnera / taty (np. Michał)
    parity TEXT DEFAULT 'first_baby' CHECK (parity IN ('first_baby', 'subsequent_baby')),
    planned_birth_type TEXT DEFAULT 'natural' CHECK (planned_birth_type IN ('natural', 'cesarean', 'vbac', 'undecided')),
    city TEXT, -- Miasto planowanego porodu
    hospital TEXT, -- Wybrany szpital / oddział porodowy
    rodo_consent BOOLEAN DEFAULT true NOT NULL, -- Zgoda na przetwarzanie danych o ciąży (art. 9 RODO)
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Włączenie RLS dla pregnancy_profiles
ALTER TABLE public.pregnancy_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkowniczka widzi wyłącznie swoje dane ciąży" 
    ON public.pregnancy_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Użytkowniczka zarządza swoimi danymi ciąży" 
    ON public.pregnancy_profiles FOR ALL 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. TABELA KURSÓW I MODUŁÓW
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price_cents INTEGER NOT NULL DEFAULT 34900, -- 349.00 PLN
    currency TEXT NOT NULL DEFAULT 'pln',
    stripe_price_id TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kursy są publicznie widoczne" ON public.courses FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Moduły są publicznie widoczne" ON public.modules FOR SELECT USING (true);

-- ==============================================================================
-- 5. TABELA LEKCJI (52 LEKCJE CLOUDFLARE STREAM)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cf_video_uid TEXT NOT NULL, -- Cloudflare Stream Video UID
    duration_seconds INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    recommended_trimester INTEGER DEFAULT 3,
    target_weeks TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lekcje są widoczne dla zalogowanych lub preview" 
    ON public.lessons FOR SELECT 
    USING (is_free_preview = true OR auth.role() = 'authenticated');

-- ==============================================================================
-- 6. TABELA DOSTĘPÓW / ENROLLMENTS (INTEGRACJA STRIPE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'expired')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Użytkownik widzi swoje aktywne zakupy" 
    ON public.enrollments FOR SELECT 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. TABELA POSTĘPÓW OGLĄDANIA (LESSON_PROGRESS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Użytkownik zarządza swoimi postępami" 
    ON public.lesson_progress FOR ALL 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. AUTOMATYCZNY TRIGGER: TWORZENIE PROFILU PRZY REJESTRACJI W SUPABASE AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
