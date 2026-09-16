# Instrukcja dla Asystenta AI (Claude / Antigravity) w projekcie HappyBirth

Witaj! Ten plik zawiera kluczowe zasady, architekturę i wytyczne współpracy zespołowej nad projektem **HappyBirth**.
Projekt jest rozwijany równolegle przez:
- **Michała** (wspieranego przez Google Antigravity)
- **Macieja** (wspieranego przez Anthropic Claude / Claude Code / Claude Work)

---

## 1. Żelazne Zasady Git i Współpracy (AI Guardrails)

1. **BEZWZGLĘDNY ZAKAZ PUSHOWANIA DO `main`**:
   - Nigdy nie wykonuj `git push origin main`. Gałąź `main` jest chronioną gałęzią produkcyjną.
2. **Praca na gałęziach (Feature Branches)**:
   - Maciej / Claude tworzy gałęzie: `feature/maciej-<opis>` lub `fix/maciej-<opis>`.
   - Michał / Antigravity tworzy gałęzie: `feature/michal-<opis>` lub `fix/michal-<opis>`.
3. **Zasada nowego zadania**:
   - Zawsze przed rozpoczęciem nowej pracy przełącz się na `main` i pobierz najnowsze zmiany:
     ```bash
     git checkout main
     git pull origin main
     git checkout -b feature/maciej-nowa-funkcja
     ```
4. **Weryfikacja przed pushem**:
   - Przed wysłaniem kodu ZAWSZE uruchom `npm run build` (sprawdza typy TS i linter).
   - Jeśli build zgłasza błąd, popraw go przed pushem.
5. **Wysyłanie zmian**:
   - Po zakończeniu zadania wypchnij gałąź na GitHuba:
     ```bash
     git push -u origin feature/maciej-nowa-funkcja
     ```
   - Następnie utwórz Pull Request (PR) na GitHubie, aby drugi deweloper mógł zweryfikować lub scalić kod.
6. **Bezpieczeństwo danych (Sekrety)**:
   - Nigdy nie commituj plików `.env`, `.env.local`, `.wrangler/`, certyfikatów ani tokenów API.
   - Zmienne środowiskowe konfigurujemy lokalnie w oparciu o `.env.example`.

---

## 2. Stack Technologiczny i Architektura

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Język**: TypeScript (ścisła kontrola typów)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React
- **Wideo**: Cloudflare Stream Player (`components/cloudflare-player.tsx`)
- **Baza Danych**: Cloudflare D1 (Serverless SQLite) sterowane przez REST API / Wrangler bindings (`lib/d1.ts`, `wrangler.toml`, `d1-schema.sql`)
- **Autoryzacja**: Bezstanowe sesje oparte o podpisane ciasteczka HTTP-only (`lib/auth.ts`, `app/api/auth/*`)
- **Płatności**: Stripe Checkout & Webhook (`lib/stripe.ts`, `app/api/stripe/*`)
- **Mailing**: Resend (`lib/auth.ts` / mailing transactional)

---

## 3. Struktura Katalogów

```
app/
├── api/                   # Endpointy API (auth, stripe, progress)
├── auth/callback/         # Callback logowania / weryfikacji magic link
├── marketing/             # Strony lądowania, prezentacja oferty
├── strefa/                # Strefa kursantki po zalogowaniu
│   ├── apteczka/          # Narzędziownik porodowy / apteczka
│   ├── lekcja/[id]/       # Odtwarzacz lekcji i materiały wideo
│   ├── lekcje/            # Spis lekcji i modułów
│   ├── licznik/           # Licznik skurczów porodowych
│   ├── login/             # Ekran logowania (magic link / kod)
│   ├── partner/           # Moduł dedykowany partnerowi
│   └── standard-medyczny/ # Standard opieki okołoporodowej
components/                # Komponenty UI (player wideo, navbar, przyciski)
lib/                       # Logika biznesowa (auth, d1, stripe, progress)
public/                    # Statyczne assety, ikony, grafiki
d1-schema.sql              # Schemat bazy danych D1
wrangler.toml              # Konfiguracja środowiska Cloudflare
.env.example               # Wzór zmiennych środowiskowych
```

---

## 4. Przydatne Polecenia

- `npm run dev` – Uruchomienie lokalnego serwera deweloperskiego na `http://localhost:3000`
- `npm run build` – Kompilacja produkcyjna i test typów
- `npm run lint` – Sprawdzenie reguł lintera
- `npx wrangler d1 execute happybirth-db --local --file=./d1-schema.sql` – Inicjalizacja lokalnej bazy D1
