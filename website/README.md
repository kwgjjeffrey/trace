# Agent Dev Suite website

Standalone static product website. Design follows the Agent Colab family: dark green, lime, purple, generous typography and a reduced-motion-aware breathing workflow. Example run evidence is clearly labelled as an illustration.

Preview: `python3 -m http.server 5191 --bind 127.0.0.1 --directory website` from the repository root. No build or dependency install is required. Hosting can serve these four static assets; the website is excluded from suite archives. Installation and source links deliberately use the current compatible `kwgjjeffrey/trace` channel.

Publish using the installed Wrangler version: `WRANGLER_BIN=/path/to/project/node_modules/.bin/wrangler sh website/publish.sh`. The script stages only public assets. Target: `agent-devops-suite-website`, custom domain `agent-devops.zhiyuanwangluo.online`.

Hero narrative: Before Agent (1×), With Agent (100× development / 2× verification with idle capacity), With Dev Suite (100× both). Multipliers are conceptual, not benchmarks. The longer development stage and verification cadence allow steady baseline flow; downstream backpressure controls admission in the Agent case. Animation pauses in background tabs and respects reduced motion. Evaluation is explicitly planned, not shipped. Performance has its own end-to-end quality-validation narrative.
