# From a Simple Python Script to Building My Own Distributed AI Stack

PyMUG Meetup, October 2026 (hosted by Coder Faculty). 29 scenes, about 36 minutes of talk plus 5 minutes of Q&A.

React + TypeScript + Motion, same engine as the ICRAIS deck. The built site is one self-contained file and runs fully offline.

## Commands
```bash
npm install
npm run dev          # develop at http://localhost:5173
npm run build        # -> dist/index.html (single file) and dist/remote.html
npm run show         # preview the build at http://localhost:4173
npm run export:pdf   # -> exports/*.pdf (light, dark, speaker notes + Q&A prep)
npm test             # unit tests: navigation, scene registry and timing, theme contrast
```

## Controls
| Input | Action |
|---|---|
| → Space PgDn ↓ / ← PgUp ↑ | next / previous slide (builds play by themselves; going back shows the earlier slide complete) |
| `S` | switch between automatic builds and manual reveals (`?manual` in the address does the same) |
| `Enter` | replay the current slide's builds |
| Shift + → / ←, or `]` / `[` | next / previous scene |
| `O` overview, `F` fullscreen, `T` theme, `B` black screen, `M` motion, `?` help | |
| Touch: swipe, or tap right side / left third | next / previous slide |

## Where things are
- `src/content/scenes.ts`: scene order, build steps, auto-timing, target seconds
- `src/content/notes.ts`: speaker notes and Q&A prep (only in the notes PDF)
- `src/scenes/Act1..Act6.tsx`: the slides, grouped by section of the talk
- `src/components/`: `Slide` (shell + progress bar), `Code` (typing code panel), `Shot` (screenshot frame), `RingDiagram` (animated cluster)
- `src/assets/`: compressed screenshots. Gateway, Rings and Terminal are redacted (IPs, tailnet host, API key, username) before being committed.

## Phone / watch remote
`npm start` serves `dist` and the remote on port 3022 (`server/server.mjs`); open the slides with `?remote`, the remote at `/remote`.

## Deploy (Ubuntu, nginx, pm2)
Needs Node 20.19+ or 22.12+ on the server (the build runs there; `dist/` is not committed).
```bash
git clone <repo> /var/www/pymug && cd /var/www/pymug
./deploy/update.sh                 # pull, npm ci, build, pm2 start/reload (port 3022)
pm2 startup                        # once, then run the command it prints
sudo cp deploy/nginx.conf /etc/nginx/sites-available/pymug   # edit server_name
sudo ln -s /etc/nginx/sites-available/pymug /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d <your-domain>
```
Later updates: push, then run `./deploy/update.sh` on the server. The remote (`/cmd`) has no password; add `auth_basic` in nginx or `pm2 stop pymug` after the talk.
