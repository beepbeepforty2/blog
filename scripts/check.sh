#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
bash scripts/zola.sh check --skip-external-links
node scripts/validate-content.mjs
