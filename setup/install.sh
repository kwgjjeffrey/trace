#!/bin/sh
# Bootstrap without Node: use an existing compatible runtime or a private official runtime.
set -eu
repo=kwgjjeffrey/trace
install_dir=${TRACE_INSTALL_DIR:-${CODEX_HOME:-$HOME/.codex}/skills/trace}
runtime_dir=${TRACE_RUNTIME_DIR:-$HOME/.local/share/trace/runtime}
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT HUP INT TERM
fetch() { curl --fail --location --silent --show-error --retry 3 --connect-timeout 15 --max-time 180 "$1" -o "$2"; }
hash() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d ' ' -f 1; else shasum -a 256 "$1" | cut -d ' ' -f 1; fi; }
for tool in curl tar; do command -v "$tool" >/dev/null 2>&1 || { echo "Missing $tool; ask your agent to install it and retry." >&2; exit 1; }; done
if ! command -v sha256sum >/dev/null 2>&1 && ! command -v shasum >/dev/null 2>&1; then echo 'A SHA-256 utility is required.' >&2; exit 1; fi
if ! (command -v node >/dev/null 2>&1 && node -e 'process.exit(+process.versions.node.split(".")[0]>=20?0:1)' && command -v npm >/dev/null 2>&1); then
 case $(uname -s) in Darwin) platform=darwin;; Linux) platform=linux;; *) echo 'Use macOS, Linux or WSL for this installer.' >&2; exit 1;; esac
 case $(uname -m) in arm64|aarch64) arch=arm64;; x86_64|amd64) arch=x64;; *) echo 'Unsupported architecture.' >&2; exit 1;; esac
 if ! [ -x "$runtime_dir/bin/node" ]; then
  fetch https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt "$work/node-sums"
  asset=$(awk -v suffix="-$platform-$arch.tar.gz" 'index($2,suffix) && substr($2,length($2)-length(suffix)+1)==suffix {print $2;exit}' "$work/node-sums")
  [ -n "$asset" ] || { echo 'Official Node runtime unavailable.' >&2; exit 1; }
  fetch "https://nodejs.org/dist/latest-v22.x/$asset" "$work/node.tgz"
  expected=$(awk -v name="$asset" '$2==name {print $1}' "$work/node-sums")
  [ "$(hash "$work/node.tgz")" = "$expected" ] || { echo 'Node checksum mismatch.' >&2; exit 1; }
  mkdir -p "$work/runtime"; tar -xzf "$work/node.tgz" -C "$work/runtime" --strip-components=1
  mkdir -p "$(dirname "$runtime_dir")"; mv "$work/runtime" "$runtime_dir"
 fi
 PATH="$runtime_dir/bin:$PATH"; export PATH
fi
fetch "https://api.github.com/repos/$repo/releases/latest" "$work/release.json"
node --input-type=module - "$work" "$repo" <<'JS'
import fs from 'node:fs';
const [dir,repo]=process.argv.slice(2);const r=JSON.parse(fs.readFileSync(dir+'/release.json'));
if(!/^v\d+\.\d+\.\d+$/.test(r.tag_name))throw Error('Invalid release tag');
for(const name of ['trace-release.json',`trace-${r.tag_name.slice(1)}.tgz`]){
 const asset=r.assets.find(a=>a.name===name);if(!asset)throw Error('Release asset missing');
 const url=new URL(asset.browser_download_url);if(url.origin!=='https://github.com'||!url.pathname.startsWith('/'+repo+'/releases/download/'+r.tag_name+'/'))throw Error('Unexpected release URL');
 const api=new URL(asset.url);if(api.origin!=='https://api.github.com'||!new RegExp('^/repos/'+repo+'/releases/assets/[0-9]+$').test(api.pathname))throw Error('Unexpected asset API URL');
 fs.writeFileSync(dir+'/'+(name.endsWith('.tgz')?'archive-url':'manifest-url'),api.href);
}
fs.writeFileSync(dir+'/version',r.tag_name.slice(1));
JS
# Use the same public Asset API as managed upgrades; no GitHub login is needed.
node --input-type=module - "$work" <<'JS'
import fs from 'node:fs';
const dir=process.argv[2];
for(const [input,output] of [['manifest-url','manifest.json'],['archive-url','trace.tgz']]){
 const response=await fetch(fs.readFileSync(dir+'/'+input,'utf8'),{headers:{Accept:'application/octet-stream','User-Agent':'trace-skill'},signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error('Release asset HTTP '+response.status);
 fs.writeFileSync(dir+'/'+output,Buffer.from(await response.arrayBuffer()));
}
JS
fetch "https://api.github.com/repos/$repo/git/ref/tags/v$(cat "$work/version")" "$work/tag.json"
node --input-type=module - "$work" <<'JS'
import fs from 'node:fs';
const dir=process.argv[2],tag=JSON.parse(fs.readFileSync(dir+'/tag.json'));
if(tag.object?.type!=='commit')throw Error('Expected a lightweight release tag');
fs.writeFileSync(dir+'/commit',tag.object.sha);
JS
node --input-type=module - "$work" <<'JS'
import fs from 'node:fs';import crypto from 'node:crypto';
const dir=process.argv[2],m=JSON.parse(fs.readFileSync(dir+'/manifest.json')),data=fs.readFileSync(dir+'/trace.tgz');
if(m.sourceCommit!==fs.readFileSync(dir+'/commit','utf8')||m.version!==fs.readFileSync(dir+'/version','utf8')||m.asset!==`trace-${m.version}.tgz`||m.size!==data.length||m.sha256!==crypto.createHash('sha256').update(data).digest('hex'))throw Error('Release checksum, size or version mismatch');
JS
# Reject paths and archive links before extracting any release files.
tar -tzf "$work/trace.tgz" > "$work/files"
if ! awk '/^package\// && $0 !~ /(^|\/)\.\.(\/|$)/ {next} {bad=1} END {exit bad}' "$work/files"; then echo 'Unsafe archive path.' >&2; exit 1; fi
tar -tvzf "$work/trace.tgz" > "$work/types"
if ! awk 'substr($0,1,1)!="-" && substr($0,1,1)!="d" {bad=1} END {exit bad}' "$work/types"; then echo 'Archive links are not allowed.' >&2; exit 1; fi
tar -xzf "$work/trace.tgz" -C "$work"
if [ -e "$install_dir" ]; then
 [ -f "$install_dir/setup/setup.mjs" ] || { echo 'Destination exists and is not a Trace installation.' >&2; exit 1; }
 [ ! -d "$install_dir/.git" ] || { echo 'Refusing to replace a development checkout.' >&2; exit 1; }
 node "$install_dir/setup/setup.mjs" update --from "$work/package"
else
 node "$work/package/setup/setup.mjs" install
 (cd "$work/package" && npm test)
 mkdir -p "$(dirname "$install_dir")"; mv "$work/package" "$install_dir"
fi
node "$install_dir/setup/setup.mjs" check
echo "Trace installed in $install_dir. Restart your agent to discover the Skill."
