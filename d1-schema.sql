-- ==============================================================================
-- BAZA DANYCH CLOUDFLARE D1 (SQLITE) DLA PLATFORMY HAPPYBIRTH
-- Zgodna ze Skonsolidowanym Planem Wykonawczym (27.10.2026 r.)
-- Operator prawny: KLARSOLUTIONS Sp. z o.o. (KRS: 0001268396, NIP: 7812118273)
-- ==============================================================================

-- 1. TABELA UŻYTKOWNIKÓW / KURSANTEK
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    auth_provider TEXT DEFAULT 'email', -- 'email', 'google', 'apple'
    google_id TEXT UNIQUE,
    apple_id TEXT UNIQUE,
    due_date TEXT, -- YYYY-MM-DD (przetwarzane wyłącznie za wyraźną zgodą RODO)
    due_date_source TEXT DEFAULT 'usg', -- 'usg', 'om', 'gestational_week'
    lmp_date TEXT, -- YYYY-MM-DD
    baby_name TEXT,
    baby_gender TEXT DEFAULT 'surprise', -- 'girl', 'boy', 'surprise', 'twins'
    partner_name TEXT,
    parity TEXT DEFAULT 'first_baby', -- 'first_baby', 'subsequent_baby'
    planned_birth_type TEXT DEFAULT 'natural', -- 'natural', 'cesarean', 'vbac', 'undecided'
    city TEXT,
    hospital TEXT,
    referral_code TEXT UNIQUE, -- Indywidualny kod polecający kursantki np. MAMA-XXXX ([C4])
    rodo_consent INTEGER DEFAULT 1,
    marketing_consent INTEGER DEFAULT 0,
    role TEXT DEFAULT 'student', -- 'student', 'partner', 'admin', 'lead'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple ON users(apple_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- 2. TABELA DOSTĘPÓW / ENROLLMENTS ([C1] 18-Month Access Guard / 548 dni od zakupu)
CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'refunded'
    order_bump_included INTEGER NOT NULL DEFAULT 0, -- [B3] Dodatek +49,00 zł
    granted_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL DEFAULT (datetime('now', '+548 days')), -- Standardowo 18 miesięcy (548 dni) od zakupu
    first_content_accessed_at TEXT, -- [C1]/[E1]/[D2a] Znacznik pierwszego otwarcia lekcji VOD
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_stripe_session ON enrollments(stripe_session_id);

-- 3. REJESTR DOWODOWY ZAMÓWIEŃ I TARCZY PRAWNEJ ([E1] Art. 38 ust. 1 pkt 13 u.p.k.)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    stripe_session_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    amount_total INTEGER NOT NULL DEFAULT 48900, -- w groszach (domyślnie 48900 = 489,00 zł brutto)
    currency TEXT NOT NULL DEFAULT 'PLN',
    order_bump_included INTEGER NOT NULL DEFAULT 0, -- 1 jeśli dokupiono pakiet +49,00 zł
    order_bump_refunded INTEGER NOT NULL DEFAULT 0,
    promo_code TEXT,
    affiliate_id TEXT,
    referrer_user_id TEXT,
    waiver_art38_accepted INTEGER NOT NULL DEFAULT 1, -- 1 = wyraźna zgoda konsumenta
    waiver_art38_timestamp TEXT NOT NULL, -- dokładny czas UTC zaznaczenia checkboxa
    buyer_ip TEXT, -- adres IP kupującego w chwili zamówienia
    waiver_checkbox_text TEXT NOT NULL, -- dosłowna treść zaznaczonego checkboxa Art. 38 pkt 13
    terms_sha256 TEXT NOT NULL, -- suma kontrolna SHA-256 wersji Regulaminu
    durable_medium_sent_at TEXT, -- czas wysyłki potwierdzenia na trwałym nośniku (e-mail + PDF)
    first_content_accessed_at TEXT, -- moment rozpoczęcia korzystania z kursu
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'refunded', 'partially_refunded'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- 4. ZGŁOSZENIA ODSTĄPIENIA OD UMOWY ([E2] Wymóg od 19.06.2026 r. zsynchronizowany z [E1])
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    order_number TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT 'full_order', -- 'full_order' lub 'order_bump_only'
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'received', -- 'received', 'auto_rejected_art38', 'approved_for_refund'
    auto_rejected_due_to_art38 INTEGER NOT NULL DEFAULT 0,
    decision_explanation TEXT,
    confirmation_email_sent_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_email ON withdrawal_requests(email);
CREATE INDEX IF NOT EXISTS idx_withdrawals_order_num ON withdrawal_requests(order_number);

-- 5. POSTĘP W LEKCJACH (52 FILMY VOD + [C2] Auto-Resume co 15s)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0, -- 0 = w toku, 1 = ukończona
    last_position_seconds INTEGER DEFAULT 0, -- sekunda wznawiania Auto-Resume
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);

-- 6. IMIEŃNE CERTYFIKATY UKOŃCZENIA KURSU ([C3] Test końcowy min. 80%)
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT UNIQUE NOT NULL,
    user_id TEXT,
    full_name TEXT NOT NULL,
    email TEXT,
    quiz_score INTEGER NOT NULL, -- wynik procentowy (np. 90)
    correct_answers INTEGER NOT NULL, -- np. 9 (na 10)
    issued_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);

-- 7. PROGRAM POLECEŃ KURSANTEK — „PREZENT ZA POLECENIE” ([C4] Przepisy na Obiad PDF)
CREATE TABLE IF NOT EXISTS student_referrals (
    id TEXT PRIMARY KEY,
    referrer_user_id TEXT NOT NULL,
    referrer_code TEXT NOT NULL, -- np. MAMA-KASIA
    referred_email TEXT,
    stripe_session_id TEXT UNIQUE,
    reward_unlocked INTEGER NOT NULL DEFAULT 1, -- odblokowane natychmiast (0 dni czekania) po opłaceniu
    reward_slug TEXT NOT NULL DEFAULT 'ebook-obiady-15min-pdf',
    unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_referrals_referrer ON student_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_student_referrals_code ON student_referrals(referrer_code);

-- 8. PARTNERZY AFILIACYJNI ([D1b] Model 2-Tier Capped CPA: 20%/25%/30% + 5% Broker Override)
CREATE TABLE IF NOT EXISTS affiliates (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role_category TEXT NOT NULL DEFAULT 'midwife_physio', -- 'midwife_physio' (30%), 'creator_publisher' (25%), 'standard' (20%)
    specialization TEXT,
    profile_or_practice_url TEXT,
    promo_code TEXT UNIQUE NOT NULL, -- kod dający klientce -10% (440,10 zł brutto)
    ref_slug TEXT UNIQUE NOT NULL, -- parametr ?ref= (30 dni okno atrybucji)
    tier1_rate REAL NOT NULL DEFAULT 0.30, -- 0.20, 0.25 lub 0.30
    referred_by_broker_id TEXT, -- ID partnera nadrzędnego (Poziom 2 Broker, twarda blokada powyżej 2. poziomu)
    tier2_override_rate REAL NOT NULL DEFAULT 0.05, -- 5% dla Brokera
    status TEXT NOT NULL DEFAULT 'active', -- 'pending', 'active', 'blocked'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (referred_by_broker_id) REFERENCES affiliates(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(promo_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_ref ON affiliates(ref_slug);

-- 9. ROZLICZENIA PROWIZJI AFILIACYJNYCH ([D2] + [D2a] Synchronizacja z Art. 38 pkt 13)
CREATE TABLE IF NOT EXISTS affiliate_commissions (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    stripe_session_id TEXT UNIQUE NOT NULL,
    affiliate_id TEXT NOT NULL,
    broker_id TEXT,
    attribution_source TEXT NOT NULL, -- 'promo_code' (nadrzędny) lub 'ref_cookie' (30 dni)
    paid_amount_gross INTEGER NOT NULL, -- kwota opłacona przez klientkę za kurs w groszach (np. 44010 = 440,10 zł)
    tier1_rate REAL NOT NULL,
    tier1_commission_gross INTEGER NOT NULL, -- np. 8802 gr (88,02 zł), 11003 gr (110,03 zł) lub 13203 gr (132,03 zł)
    tier2_commission_gross INTEGER NOT NULL DEFAULT 0, -- np. 2200 gr (22,00 zł) lub 2445 gr (24,45 zł)
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' -> 'ELIGIBLE' (po otwarciu lekcji + bufor) -> 'PAID' / 'CANCELLED'
    first_content_accessed_at TEXT,
    eligible_at TEXT,
    paid_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_broker ON affiliate_commissions(broker_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON affiliate_commissions(status);

-- 10. ZGŁOSZENIA WSPÓŁPRACY Z PODSTRON /AFILIACJA ORAZ /PARTNERZY ([D4a-1] & [D4a-2])
CREATE TABLE IF NOT EXISTS partnership_inquiries (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL, -- 'afiliacja' (D4a-1) lub 'partnerzy_b2b' (D4a-2)
    full_name TEXT NOT NULL,
    company_or_brand TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    role_or_area TEXT NOT NULL,
    profile_url TEXT,
    message TEXT,
    rodo_consent INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 11. JEDNORAZOWE TOKENY LOGOWANIA (MAGIC LINK / BEZHASŁOWY AUTH)
CREATE TABLE IF NOT EXISTS auth_tokens (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_email ON auth_tokens(email);

-- 12. LICZNIK SKURCZÓW PORODOWYCH SOS (POMIAR EDUKACYJNY)
CREATE TABLE IF NOT EXISTS contraction_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    contractions_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
