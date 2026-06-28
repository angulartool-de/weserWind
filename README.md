# Weser-Wind – Standalone (mydevweb.de)

Eigenständige Mini-Webseite für Windstärke und -richtung an fünf Weser-Pegeln.

## Build

```bash
cd mydevweb.de
npm install
npm run build
```

Erzeugt `index.html` und gehashte Dateien unter `assets/` (Deploy-Artefakte). Vor dem Build wird `index.dev.html` als Vite-Eingabe verwendet.

## Entwicklung

```bash
npm run dev
```


| Pfad | Inhalt |
|---|---|
| `src/main.ts` | UI-Rendering, Auto-Refresh, Stale-Fallback |
| `src/styles.css` | Styles |
| `index.source.html` | Vite-Eingabe (Dev + Build) |
| `../src/windApp/` | Gemeinsame Domänenlogik mit Angular-Route |

## Verhalten (Stale-Fallback)

Wie die Angular-Route `/weser-wind`: Bei API-Fehlern bleiben zuletzt geladene Werte sichtbar (Badge „Stand veraltet“). Fehlt nur der 2‑Stunden-Verlauf: Badge „Verlauf nicht aktualisiert“.
