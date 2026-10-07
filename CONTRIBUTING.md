# Contributing

Open an issue describing the operation, observed result and reproducible environment. For changes, read root and module AGENTS.md, then run `npm ci --ignore-scripts`, `npm test`, `npm run typecheck` and `npm run build` with Node 20.19+ or 22.12+.

Keep project data and credentials outside the suite. Add meaningful coverage for runtime, configuration, runner or update changes. CLI, HTTP and MCP must use the same services. Do not claim browser checks prove embedded MCP rendering. Preserve existing command and release compatibility, and document new external network destinations.

Development uses a separate Git checkout; do not artifact-upgrade it. Releases are built from a clean tagged source revision. The website is independently served from `website/` and is excluded from runtime archives.
