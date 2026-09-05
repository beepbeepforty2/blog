#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
bash scripts/install-zola.sh
exec .tools/zola/0.23.4/zola "$@"
