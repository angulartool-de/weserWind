# Weser-Wind – Standalone (mydevweb.de)

Reine HTML/JS-Webseite (kein Angular) für Windstärke und -richtung an fünf Weser-Pegeln.

## Build & Deploy

```bash
cd mydevweb.de
npm install
npm run build
```

Ergebnis liegt in **`dist/`** — nur diese Dateien auf den Webserver legen:

```
dist/
  index.html
  favicon.ico
  assets/
    index-*.js
    index-*.css
```

Lokal testen: `npm run preview` (serviert `dist/`).

## Entwicklung

```bash
npm run dev
```

## Quellen

| Pfad | Inhalt |
|---|---|
| `src/main.ts` | UI-Rendering, Auto-Refresh, Stale-Fallback |
| `src/styles.css` | Styles |
| `index.dev.html` | HTML-Vorlage (wird für Dev/Build nach `index.html` kopiert) |
| `../src/windApp/` | Gemeinsame Domänenlogik mit Angular-Route `/weser-wind` |

## Verhalten (Stale-Fallback)

Bei API-Fehlern bleiben zuletzt geladene Werte sichtbar (Badge „Stand veraltet“). Fehlt nur der 2‑Stunden-Verlauf: Badge „Verlauf nicht aktualisiert“.
