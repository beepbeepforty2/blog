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
    checksum="303b8e1f3251a6250e47f811eda143316f653c22201faa66777d48ac499c0ee3"
    ;;
  Darwin-x86_64)
    archive="zola-v${version}-x86_64-apple-darwin.tar.gz"
    checksum="e79edcba2e8d03d22065c9cb8fa2e3abf07b823ef17f00abdc060188dceabba7"
    ;;
  Linux-x86_64)
    archive="zola-v${version}-x86_64-unknown-linux-gnu.tar.gz"
    checksum="54d1a347781b2f32330914fcc02def81c7e3ddb6111b36d1cc89c06557aed1de"
    ;;
  Linux-aarch64|Linux-arm64)
    archive="zola-v${version}-aarch64-unknown-linux-gnu.tar.gz"
    checksum="21bb37a4f3bbac663cf8f04df9b51ac6bc154acfe2cf2c3e9ea162b4951487b6"
    ;;
  *)
    echo "Unsupported platform: $(uname -s)-$(uname -m)" >&2
    exit 1
    ;;
esac

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
