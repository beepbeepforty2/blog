#!/usr/bin/env bash
set -euo pipefail

bash scripts/zola.sh check --skip-external-links
bash scripts/zola.sh build --force
node scripts/render-math.mjs
node scripts/validate-build.mjs
