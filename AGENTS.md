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

---

## 5. Żelazne Zasady Marketingu, Ochrony Kapitału i AdOps (Zero-Burn Guardrails)

Każdy asystent AI (Antigravity / Claude) pracujący nad integracjami marketingowymi, lejkami, analityką i reklamami HappyBirth MUSI bezwzględnie przestrzegać poniższych reguł:

1. **Kategoryczny Zakaz Ślepego „Advantage+”**:
   - Nigdy nie uruchamiaj kampanii Meta Ads bez twardych kagańców demograficznych (`enable_audience_expansion: false`, płeć: kobiety, wiek: ściśle 22–37 lat).
   - Budżety WYŁĄCZNIE na poziomie zestawu (ABO) w mikropakietach (max 30–50 zł/dzień na test).
2. **Bezpiecznik Bilingowy i Hardware Kill-Switch**:
   - Wszystkie konta reklamowe muszą być powiązane wyłącznie z kartami wirtualnymi o twardym limicie dziennym (np. subkonto Revolut Business max 150–200 zł).
3. **Automatyczny Strażnik Kosztu Pozyskania (CPA Circuit Breaker)**:
   - Zestaw wydał 70 zł bez ani jednego `InitiateCheckout` lub 105 zł (1.5x limit) bez `Purchase` ze Stripe -> natychmiastowy status `PAUSED`.
   - Wykrycie wyświetleń dla grupy 45+ w metrykach breakdown -> natychmiastowe ubicie zestawu.
4. **Ochrona przed Oflagowaniem i Cenzurą (Policy & Anti-Ban)**:
   - **Sterylna Śluza Treści Medycznych**: Publiczne strony lądowania z reklam nie mogą zawierać inwazyjnego języka medycznego (krocze, nacięcie, krew, oksytocyna, cesarka). Pełne narzędzia (np. Plan Porodu) udostępniane są wyłącznie w zamkniętej strefie po podaniu maila.
   - **Wizyjny Filtr Kreacji Wideo**: Zakaz używania w reklamach ujęć nagości (karmienie piersią z widoczną brodawką), ran pooperacyjnych czy procedur szpitalnych. Używamy kadrów z ekspertkami mówiącymi do kamery, partnerem ćwiczącym w ubraniu oraz organizacją wyprawki.
5. **Separacja Danych Medycznych od Piksela Mety**:
   - Skrypty Piksela Mety / TikToka mogą być ładowane WYŁĄCZNIE na stronach publicznych (`happybirth.pl`, `/marketing`, checkout).
   - Kategoryczny zakaz instalowania pikseli wewnątrz strefy kursantki (`/strefa/*`), odtwarzacza lekcji czy licznika skurczów (ochrona przed karami RODO i banem Mety za wyciek danych wrażliwych zdrowotnych).
6. **Zgodność Prawna (UOKiK, Prawo Konsumenckie, Omnibus)**:
   - W procesie zakupu Stripe obowiązkowa klauzula z art. 38 pkt 13 Ustawy o prawach konsumenta (wygaśnięcie prawa odstąpienia z chwilą rozpoczęcia świadczenia).
   - Żadnych sztucznych cen przekreślonych – stała cena regularna 349 zł, a rabaty wyłącznie przez indywidualne kody promocyjne w Stripe.

