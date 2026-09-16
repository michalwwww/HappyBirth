-- ==============================================================================
-- BAZA DANYCH CLOUDFLARE D1 (SQLITE) DLA PLATFORMY HAPPYBIRTH
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
    due_date TEXT, -- YYYY-MM-DD
    due_date_source TEXT DEFAULT 'usg', -- 'usg', 'om', 'gestational_week'
    lmp_date TEXT, -- YYYY-MM-DD
    baby_name TEXT,
    baby_gender TEXT DEFAULT 'surprise', -- 'girl', 'boy', 'surprise', 'twins'
    partner_name TEXT,
    parity TEXT DEFAULT 'first_baby', -- 'first_baby', 'subsequent_baby'
    planned_birth_type TEXT DEFAULT 'natural', -- 'natural', 'cesarean', 'vbac', 'undecided'
    city TEXT,
    hospital TEXT,
    rodo_consent INTEGER DEFAULT 1,
    role TEXT DEFAULT 'student', -- 'student', 'partner', 'admin'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple ON users(apple_id);

-- 2. TABELA DOSTĘPÓW / ENROLLMENTS (INTEGRACJA ZE STRIPE)
CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'refunded'
    granted_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT, -- Standardowo 12 miesięcy od przewidywanego terminu porodu lub zakupu
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_stripe_session ON enrollments(stripe_session_id);

-- 3. POSTĘP W LEKCJACH (52 FILMY VOD)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0, -- 0 = w toku, 1 = ukończona
    last_position_seconds INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);

-- 4. JEDNORAZOWE TOKENY LOGOWANIA (MAGIC LINK / BEZHASŁOWY AUTH)
CREATE TABLE IF NOT EXISTS auth_tokens (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_email ON auth_tokens(email);

-- 5. LICZNIK SKURCZÓW PORODOWYCH SOS (REGUŁA 5-1-1)
CREATE TABLE IF NOT EXISTS contraction_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    contractions_json TEXT NOT NULL, -- Zrzut JSON z czasami skurczów i przerw
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
