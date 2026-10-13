---
name: email-deliverability-postmaster
description: >-
  Audytor i strażnik dostarczalności poczty transakcyjnej dla domeny happybirth.pl.
  Wdraża rygorystyczne standardy Google/Yahoo z 2024–2026 r., RFC 8058 (One-Click Unsubscribe),
  konfigurację DNS (MX, SPF, DKIM 2048-bit, DMARC p=quarantine) oraz optymalizację
  szablonów transakcyjnych Resend dla polskich operatorów pocztowych (WP, Onet, Interia).
---

# Email Deliverability & Postmaster Standards (HappyBirth)

## 1. Wymagania Dostarczalności Google & Yahoo (Luty 2024 – 2026)
Wszyscy nadawcy transakcyjni i masowi muszą spełniać kryteria blokujące odrzucanie wiadomości:
1. **DKIM (DomainKeys Identified Mail):** Klucz RSA o długości minimum 2048 bitów powiązany z selektorem wysyłkowym Resend.
2. **SPF (Sender Policy Framework):** Poprawny rekord TXT bez przekroczenia limitu 10 zapytań DNS (DNS Lookup Limit).
3. **DMARC (Domain-based Message Authentication):**
   - Wymóg minimalny: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@happybirth.pl; aspf=r; adkim=r`.
   - Zakaz pozostawania w trybie `p=none` na produkcji – wiadomości podszywające się muszą trafić do kwarantanny.
4. **Wskaźnik spamu (Spam Rate):** Wskaźnik zgłoszeń spamu w Google Postmaster Tools poniżej `0.10%` (nigdy powyżej `0.30%`).

---

## 2. Matryca Rekordów DNS dla Domeny happybirth.pl (Cloudflare DNS)

| Typ | Nazwa rekordu | Wartość docelowa | Cel i Uzasadnienie |
|:---|:---|:---|:---|
| **MX** | `@` | Rekordy MX dostawcy poczty (np. Google Workspace lub Migadu) | Odbiór wiadomości przychodzących na `kontakt@happybirth.pl`. |
| **TXT** | `@` | `v=spf1 include:amazonses.com include:_spf.google.com ~all` | Autoryzacja wysyłki przez silnik Resend oraz pocztę biurową. |
| **CNAME** | `resend._domainkey` | `k1._domainkey.resend.com` (lub wygenerowany klucz 2048-bit) | Kryptograficzny podpis każdej wiadomości wychodzącej. |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@happybirth.pl` | Ochrona reputacji domeny przed spoofingiem i phishingiem. |

---

## 3. Specyfika Polskich Skrzynek Pocztowych (WP.pl, Onet.pl, Interia.pl)
Polscy dostawcy poczty (Wirtualna Polska i Onet) stosują własne, agresywne filtry antyspamowe:
1. **Reverse DNS (PTR):** Adres IP serwera wysyłkowego musi poprawnie rozwiązywać się do nazwy FQDN.
2. **Format wiadomości:**
   - Wyłącznie semantyczny HTML z wersją tekstową (Multi-part MIME: `text/plain` + `text/html`).
   - Brak skracaczy linków (np. bit.ly) – wszystkie odnośniki w mailach transakcyjnych muszą prowadzić bezpośrednio do subdomen `happybirth.pl`.
3. **Załącznik z umową na trwałym nośniku (Art. 38 pkt 13):**
   - Po zakupie generowany jest lekki plik PDF (poniżej 300 KB) zawierający regulamin i potwierdzenie zawarcia umowy z datą i godziną transakcji.
