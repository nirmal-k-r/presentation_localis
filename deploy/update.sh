#!/usr/bin/env bash
# Run on the server after pushing:  ./deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
npm ci --no-audit --no-fund
npm run build
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
curl -fsS "http://127.0.0.1:${PORT:-3022}/health" && echo
