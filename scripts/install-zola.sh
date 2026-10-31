#!/usr/bin/env bash
set -euo pipefail

version="0.23.4"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target_dir="$repo_root/.tools/zola/$version"
target="$target_dir/zola"

if [[ -x "$target" ]] && [[ "$("$target" --version)" == "zola $version" ]]; then
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64)
    archive="zola-v${version}-aarch64-apple-darwin.tar.gz"
    ;;
  Darwin-x86_64)
    archive="zola-v${version}-x86_64-apple-darwin.tar.gz"
    ;;
  Linux-x86_64)
    archive="zola-v${version}-x86_64-unknown-linux-gnu.tar.gz"
    ;;
  Linux-aarch64|Linux-arm64)
    archive="zola-v${version}-aarch64-unknown-linux-gnu.tar.gz"
    ;;
  *)
    echo "Unsupported platform: $(uname -s)-$(uname -m)" >&2
    exit 1
    ;;
esac

checksum="$(awk -v target="zola/$archive" '$2 == target {print $1}' "$repo_root/vendor/SHA256SUMS")"
if [[ -z "$checksum" ]]; then
  echo "Missing checksum for zola/$archive in vendor/SHA256SUMS" >&2
  exit 1
fi

archive_path="$repo_root/vendor/zola/$archive"
if [[ ! -f "$archive_path" ]]; then
  echo "Missing vendored Zola archive: $archive_path" >&2
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$archive_path" | awk '{print $1}')"
else
  actual="$(shasum -a 256 "$archive_path" | awk '{print $1}')"
fi

if [[ "$actual" != "$checksum" ]]; then
  echo "Zola checksum mismatch: expected $checksum, received $actual" >&2
  exit 1
fi

mkdir -p "$target_dir"
tar -xzf "$archive_path" -C "$target_dir" zola
chmod +x "$target"
