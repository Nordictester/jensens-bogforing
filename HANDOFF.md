# HANDOFF — Jensens Bogføring

**Sidst:** 2026-07-28 · Cursor

- **Berit-billede (Om mig):** Billedet `onewebmedia/20180908_162855.jpg` er fint på one.com. Fejlen var at siden peget på `assets/berit.jpg` (findes ikke på one.com). `om-mig.html` peget nu på `onewebmedia/20180908_162855.jpg`. Lokal `assets/berit.jpg` er komprimeret backup.
- Forside-hero: AI-GENERERET kontorbillede hvor skærmen viser det RIGTIGE kort → `assets/hero-generated3.png` = `assets/hero.png`
- METODE (VIGTIGT, brugerens ønske): generér et NYT billede og giv AI'en det ægte Google Maps-screenshot (`assets/realmap.png` = Søndermarken 23) som forlæg/reference — IKKE manuelt indklistret/redigeret kort
- Backups: `assets/hero-original.png` (oprindeligt foto), `assets/realmap.png` (ægte kort). `index.html` hero-bg → `assets/hero.png`
- Rettet Om mig-tekst + løntekst (Dataløn); undersider i `tilbud/` (6 stk.)

**Live:** https://jensensbogforing.dk/ (DNS → one.com; GitHub Pages CNAME er sat, men A-record peget stadig på one.com)
**Admin:** https://jensensbogforing.dk/admin.html  
**Repo:** https://github.com/Nordictester/jensens-bogforing

**Næste skridt:** Efter merge: sørg for at `om-mig.html` er opdateret på one.com (eller flyt DNS til GitHub Pages). Berit gennemser live.

**Vigtige filer:** `index.html`, `assets/hero.png`, `om-mig.html`, `jeg-tilbyder.html`, `tilbud/*.html`
