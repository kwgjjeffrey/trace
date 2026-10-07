#!/bin/sh
# The bootstrap runtime stays private; no shell profile or global Node replacement.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
runtime_dir=${TRACE_RUNTIME_DIR:-$HOME/.local/share/trace/runtime}
if ! (command -v node >/dev/null 2>&1 && node -e 'const [m,n]=process.versions.node.split(".").map(Number);process.exit(m===20&&n>=19||m===22&&n>=12||m>22?0:1)'); then
 PATH="$runtime_dir/bin:$PATH"; export PATH
fi
entry=${1:-trace.mjs}; [ "$#" -eq 0 ] || shift
exec node "$root/$entry" "$@"
