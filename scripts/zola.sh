#!/usr/bin/env bash
set -euo pipefail

bash scripts/install-zola.sh
exec .tools/zola/0.23.4/zola "$@"
