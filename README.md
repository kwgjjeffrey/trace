# Trace

A personal, reusable tracing Skill and MCP App: unit-owned operation registries, end-to-end OpenTelemetry instrumentation, trace analysis and GUI catalog.

## Install from GitHub Releases

Download `trace-<version>.tgz` and `trace-release.json` from Releases. Verify the archive SHA-256 and size against the manifest, extract the `package/` directory into your agent's Skills directory as `trace/`, then run:

```sh
node trace/setup/setup.mjs install
node trace/setup/setup.mjs check
```

Node.js 20+, npm and tar are required. The source package excludes dependencies and generated App bundles. Setup installs locked dependencies and builds locally.

## Use

```sh
node trace/trace.mjs operations --repo /path/to/project
node trace/trace.mjs app --repo /path/to/project --config /private/connection.json
node trace/trace.mjs mcp --repo /path/to/project --config /private/connection.json
node trace/trace.mjs prompts --repo /path/to/project --config /private/connection.json --id <trace-id>
node trace/trace.mjs prompts --repo /path/to/project --config /private/connection.json --id <trace-id> --span <span-id>
```

The project `tracing/registry.yaml` references service/artifact-owned registries. No registry compilation or path replacement. See the capability SKILL.md files for instrumentation, analysis, catalog and setup.

Configure Grafana by piping private JSON to `node trace/setup/setup.mjs configure`. Fields: project, queryEndpoint, queryInstanceId, token, grafanaUrl, datasourceUid; optional otlpEndpoint and instanceId. Config and credentials remain in `~/.config/trace/<project>/`, outside the install and release.

## Updates

```sh
node trace/setup/setup.mjs release-check
node trace/setup/setup.mjs upgrade
```

The App also has Check updates and Upgrade Skill buttons. Upgrades download from this repository's GitHub Releases, verify archive size/hash, stage dependency installation and tests, then activate with source backups and failure recovery. Restart the MCP connection after upgrading. Development Git checkouts reject artifact upgrades; develop in a separate clone and use the release-installed Skill.

## Development

Clone this repository, run setup install and npm test. Capability implementation notes live in AGENTS.md. Keep tokens, private project settings and installed dependencies out of Git. Issues and feedback are welcome.

## Current scope

Grafana/Tempo queries return bounded samples, not population metrics. MCP App host rendering depends on host extension support. GUI navigation requires a project locator adapter. Asynchronous context boundaries and clock behavior need project-specific acceptance tests.

Trace inspection orders spans by parent relationships, reports missing parents and shows inclusive service boundaries without adding nested/parallel durations. Prompt inspection lists assembly metadata first and fetches one selected body; the App uses the same APIs. Every span can resolve a repository source location with an explicit revision-mismatch indication. Instrumentation guidance covers full parser/GUI inventory, durable consumers, per-invocation Agent command context and calibrated monotonic timing.
