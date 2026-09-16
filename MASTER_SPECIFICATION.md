# MASTER SPECIFICATION: Platforma Kursu Online „HappyBirth” (Strefa Kursanta)
> **UWAGA ARCHITEKTONICZNA:**  
> Projekt HappyBirth działa w 100% w ekosystemie **Cloudflare** (Cloudflare Pages, Cloudflare D1 SQLite, Cloudflare Stream) oraz Stripe i Resend, zgodnie z instrukcją w pliku `AGENTS.md`.  
> Projekt **nie używa Supabase ani Vimeo**. Aktualna baza danych to Cloudflare D1 (`d1-schema.sql`, `lib/d1.ts`, `wrangler.toml`).

---

## 1. ROLA I ZADANIE AGENTA

Jesteś doświadczonym **Senior Full-Stack Architectem i Developerem Next.js / TypeScript**. Twoim zadaniem jest stworzenie produkcyjnego, bezpiecznego i nowoczesnego portalu kursanta dla platformy **HappyBirth**.

Projekt skupia się na:
1. **Autoryzacji i Zarządzaniu Kursantami** (Supabase Auth: bezhasłowe logowanie Magic Link / Email).
2. **Bazie Danych i Uprawnieniach** (PostgreSQL z Row Level Security – tylko opłaceni użytkownicy mają dostęp do lekcji).
3. **Płatnościach i Automatyzacji Dostępów** (Stripe Checkout z obsługą BLIK + Webhook nadający dostęp natychmiast po transakcji).
4. **Odtwarzaczu Wideo i Śledzeniu Postępów** (Osadzony Vimeo Player z ochroną domenową i automatycznym zapisem postępu lekcji).
5. **Responsywnym Interfejsie Użytkownika** (Mobile-First, elegancki, minimalistyczny UI w Tailwind CSS).

---

## 2. STACK TECHNOLOGICZNY

- **Framework:** Next.js 15 (App Router, React 19, TypeScript).
- **Styling & UI:** Tailwind CSS v4, Lucide React (ikony), opcjonalnie Shadcn UI (komponenty Radix).
- **Baza Danych & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Płatności:** Stripe Node SDK (`stripe`), Stripe Checkout.
- **Odtwarzacz Wideo:** Vimeo Player Embed API (`@vimeo/player`).
- **Narzędzia pomocnicze:** `clsx`, `tailwind-merge`.

---

## 3. SCHEMAT BAZY DANYCH (SUPABASE POSTGRESQL + RLS)

Wykonaj poniższy skrypt migracji SQL w Supabase SQL Editor:

```sql
-- ==============================================================================
-- 1. TABELA PROFILI (ROZSZERZENIE AUTH.USERS)
-- ==============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. TABELA KURSÓW
-- ==============================================================================
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0, -- np. 35000 = 350.00 PLN
    currency TEXT NOT NULL DEFAULT 'pln',
    stripe_price_id TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. TABELA MODUŁÓW
-- ==============================================================================
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. TABELA LEKCJI
-- ==============================================================================
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    vimeo_video_id TEXT NOT NULL, -- Sam identyfikator wideo z Vimeo, np. '892347891'
    duration_seconds INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]'::jsonb, -- Format: [{ "name": "Karty Pracy PDF", "url": "https://...", "size": "2.4 MB" }]
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. TABELA DOSTĘPÓW / ZAKUPÓW (ENROLLMENTS)
-- ==============================================================================
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'refunded'
    granted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- ==============================================================================
-- 6. TABELA POSTĘPU LEKCJI (LESSON PROGRESS)
-- ==============================================================================
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    last_position_seconds INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- ==============================================================================
-- 7. TRIGGER: AUTOMATYCZNE TWORZENIE PROFILU PRZY REJESTRACJI
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) - BEZPIECZEŃSTWO DANYCH
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- 8.1 Profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- 8.2 Courses & Modules (Publiczny odczyt podstawowych informacji o kursach)
CREATE POLICY "Anyone can view published courses" 
  ON public.courses FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Anyone can view modules of published courses" 
  ON public.modules FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = modules.course_id AND c.is_published = true
  ));

-- 8.3 Lessons (Tylko zapisani użytkownicy z aktywnym kursem LUB darmowa lekcja preview)
CREATE POLICY "Users can view lessons if enrolled or free preview" 
  ON public.lessons FOR SELECT 
  TO authenticated 
  USING (
    is_free_preview = true 
    OR EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.modules m ON m.id = lessons.module_id
        WHERE e.course_id = m.course_id 
          AND e.user_id = auth.uid() 
          AND e.status = 'active'
    )
  );

-- 8.4 Enrollments
CREATE POLICY "Users can view own enrollments" 
  ON public.enrollments FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 8.5 Lesson Progress
CREATE POLICY "Users can view and manage own progress" 
  ON public.lesson_progress FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 4. STRUKTURA PROJEKTU (FILE TREE)

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # Ekran logowania (Magic Link / Hasło)
│   │   └── auth/callback/
│   │       └── route.ts             # PKCE Auth Exchange dla Supabase
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Shell panelu kursanta (Top Nav, Profil, Wyloguj)
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Pulpit kursanta (Wykaz kursów, ogólny % ukończenia)
│   │   └── kurs/
│   │       └── [courseSlug]/
│   │           ├── layout.tsx       # Layout kursu z bocznym panelem lekcji (Sidebar)
│   │           ├── page.tsx         # Strona główna kursu (Opis, spis modułów, przycisk Start)
│   │           └── lekcja/
│   │               └── [lessonId]/
│   │                   └── page.tsx # Odtwarzacz wideo, notatki, załączniki PDF, nawigacja
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts         # Endpoint tworzenia sesji płatności Stripe Checkout
│   │   │   └── webhook/
│   │   │       └── route.ts         # Webhook: weryfikacja Stripe, autotworzenie konta, enrollment
│   │   └── progress/
│   │       └── route.ts             # API do oznaczania ukończenia lekcji / timestampu
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── video-player.tsx             # Responsywny player Vimeo (@vimeo/player z auto-complete)
│   ├── course-sidebar.tsx           # Pasek boczny modułów i lekcji z checkmarkami
│   ├── progress-bar.tsx             # Wizualny pasek postępu (%)
│   ├── lesson-navigation.tsx        # Przyciski "Poprzednia" / "Następna lekcja"
│   └── attachments-list.tsx         # Pobieranie materiałów PDF
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # createBrowserClient (dla komponentów klienckich)
│   │   ├── server.ts                # createServerClient (dla Server Components i Server Actions)
│   │   └── admin.ts                 # createClient z SUPABASE_SERVICE_ROLE_KEY (dla Webhooka Stripe)
│   ├── stripe.ts                    # Inicjalizacja klienta Stripe SDK
│   └── types.ts                     # Interfejsy TypeScript (Course, Module, Lesson, Progress)
├── middleware.ts                    # Zabezpieczenie ścieżek: odświeżanie sesji i ochrona /dashboard, /kurs
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 5. KLUCZOWE IMPLEMENTACJE (KOD ŹRÓDŁOWY)

### A. Konfiguracja Klientów Supabase (`lib/supabase/`)

#### `lib/supabase/client.ts` (Przeglądarka)
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### `lib/supabase/server.ts` (Server Components)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorowane w Server Componentach
          }
        },
      },
    }
  );
}
```

#### `lib/supabase/admin.ts` (Service Role dla Webhooków)
```typescript
import { createClient } from '@supabase/supabase-js';

// Klient z uprawnieniami administratora (Bypass RLS) używany WYŁĄCZNIE w API routes (webhook Stripe)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

---

### B. Ochrona Tras (`middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/kurs');

  // Niezalogowany próbuje wejść do strefy kursanta -> przekieruj na /login
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Zalogowany wchodzi na /login -> przekieruj na /dashboard
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/kurs/:path*', '/login'],
};
```

---

### C. Webhook Stripe – Nadawanie Dostępów (`app/api/stripe/webhook/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Obsługa zakończonej sukcesem płatności
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || 'Kursant';
    const courseId = session.metadata?.courseId;

    if (!customerEmail || !courseId) {
      console.error('❌ Missing customerEmail or courseId in metadata');
      return NextResponse.json({ error: 'Incomplete session metadata' }, { status: 400 });
    }

    try {
      // 1. Sprawdź, czy użytkownik już istnieje w bazie Auth
      const { data: usersData, error: userSearchError } = await supabaseAdmin.auth.admin.listUsers();
      let user = usersData?.users.find((u) => u.email?.toLowerCase() === customerEmail.toLowerCase());

      // 2. Jeśli nie istnieje – utwórz konto bezhasłowe
      if (!user) {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
          user_metadata: { full_name: customerName },
        });

        if (createError || !newUser.user) {
          throw new Error(`Failed to create auth user: ${createError?.message}`);
        }
        user = newUser.user;
      }

      // 3. Nadaj dostęp do kursu (Enrollment)
      const { error: enrollError } = await supabaseAdmin
        .from('enrollments')
        .upsert(
          {
            user_id: user.id,
            course_id: courseId,
            stripe_session_id: session.id,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
            status: 'active',
            granted_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,course_id' }
        );

      if (enrollError) {
        throw new Error(`Failed to create enrollment: ${enrollError.message}`);
      }

      // 4. Wygeneruj Magic Link do natychmiastowego logowania
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      });

      console.log(`✅ Sukces! Dostęp nadany dla: ${customerEmail}. Magic Link: ${linkData?.properties?.action_link}`);
      
      // (Opcjonalnie: Tutaj wyślij e-mail z linkiem przez Resend lub własne API transakcyjne)

    } catch (dbErr: any) {
      console.error('❌ Error executing fulfillment:', dbErr.message);
      return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
```

---

### D. Responsywny Odtwarzacz Vimeo (`components/video-player.tsx`)

```tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import { CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  lessonId: string;
  isCompleted?: boolean;
  initialPositionSeconds?: number;
  onLessonComplete?: () => void;
}

export function VideoPlayer({
  videoId,
  lessonId,
  isCompleted = false,
  initialPositionSeconds = 0,
  onLessonComplete,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    // Inicjalizacja odtwarzacza Vimeo
    const player = new Player(containerRef.current, {
      id: parseInt(videoId, 10),
      responsive: true,
      autoplay: false,
      title: false,
      byline: false,
      portrait: false,
      speed: true,
    });

    playerRef.current = player;

    player.ready().then(() => {
      setLoading(false);
      if (initialPositionSeconds > 5) {
        player.setCurrentTime(initialPositionSeconds);
      }
    });

    // Zapisuj postęp co 15 sekund
    player.on('timeupdate', (data) => {
      if (data.seconds % 15 < 1) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            lastPositionSeconds: Math.floor(data.seconds),
          }),
        }).catch(console.error);
      }
    });

    // Automatyczne oznaczanie po obejrzeniu
    player.on('ended', async () => {
      setCompleted(true);
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, isCompleted: true }),
      });
      if (onLessonComplete) onLessonComplete();
    });

    return () => {
      player.destroy().catch(() => {});
    };
  }, [videoId, lessonId]);

  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
      <div className="relative aspect-video w-full flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 text-white z-10">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <span className="ml-3 text-sm font-medium">Ładowanie wideo...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <div className="p-4 bg-neutral-900/90 flex items-center justify-between border-t border-neutral-800">
        <div className="flex items-center space-x-2">
          {completed ? (
            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Ukończono lekcję
            </span>
          ) : (
            <span className="flex items-center text-xs font-medium text-neutral-400">
              <PlayCircle className="w-4 h-4 mr-1.5 text-pink-400" /> W trakcie oglądania
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 6. KONFIGURACJA ZMIENNYCH ŚRODOWISKOWYCH (`.env.example`)

```env
# ==============================================================================
# SUPABASE
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=twoj-secret-service-role-key-do-webhooka

# ==============================================================================
# STRIPE
# ==============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ==============================================================================
# APLIKACJA
# ==============================================================================
NEXT_PUBLIC_APP_URL=https://strefa.happybirth.pl
```

---

## 7. INSTRUKCJA WDROŻENIA I BEZPIECZEŃSTWA (CHECKLISTA)

1. **Vimeo (Ochrona materiałów):**
   - Wejdź w ustawienia wideo na Vimeo $\rightarrow$ *Privacy* $\rightarrow$ Ustaw: **Hide from Vimeo**.
   - W sekcji *Where can this be embedded?* $\rightarrow$ Wybierz **Specific domains** i dodaj swoją domenę produkcyjną oraz lokalną:
     - `strefa.happybirth.pl`
     - `localhost:3000` (na czas testów programistycznych).

2. **Stripe (Płatności):**
   - Skonfiguruj produkt i cenę w panelu Stripe.
   - W sekcji *Developers* $\rightarrow$ *Webhooks* dodaj URL: `https://strefa.happybirth.pl/api/stripe/webhook` z subskrypcją zdarzenia: `checkout.session.completed`.

3. **Supabase:**
   - Wklej kod z sekcji **3. SCHEMAT BAZY DANYCH** do SQL Editora i kliknij **Run**.
   - Włącz w *Authentication $\rightarrow$ Providers* opcję **Email (Magic Link / Password)**.

---

## 8. POLECENIE WYKONAWCZE DLA AGENTA

> Zbuduj cały projekt ściśle według powyższej specyfikacji. Upewnij się, że kod jest pozbawiony błędów typowania TypeScript, interfejs jest w 100% responsywny (Mobile & Desktop), a wszystkie zapytania do bazy danych wykorzystują zalecane podejście Server Components ze wsparciem `@supabase/ssr`.
