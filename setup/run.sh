#!/bin/sh
# The bootstrap runtime stays private; no shell profile or global Node replacement.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
runtime_dir=${TRACE_RUNTIME_DIR:-$HOME/.local/share/trace/runtime}
if ! (command -v node >/dev/null 2>&1 && node -e 'process.exit(+process.versions.node.split(".")[0]>=20?0:1)'); then
 PATH="$runtime_dir/bin:$PATH"; export PATH
fi
entry=${1:-trace.mjs}; [ "$#" -eq 0 ] || shift
exec node "$root/$entry" "$@"
