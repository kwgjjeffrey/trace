#!/bin/sh
set -eu
cd "$(dirname "$0")"
mkdir -p public
for file in index.html style.css script.js favicon.svg; do cp "$file" "public/$file"; done
"${WRANGLER_BIN:-wrangler}" deploy --config wrangler.jsonc "$@"
