---
name: trace
description: Instrument registered end-to-end operations, investigate traces and performance, or open a shared operation catalog for any repository.
---

Resolve the target repository. Run `node <this-skill>/trace.mjs <command> --repo <repo>`; pass protected provider configuration with `--config` when querying.

For first use or a dependency/startup failure, read [setup/SKILL.md](setup/SKILL.md).

Read only the capability needed for the task:

- Register or change instrumentation: [instrumentation/SKILL.md](instrumentation/SKILL.md).
- Investigate performance or spans: [analysis/SKILL.md](analysis/SKILL.md).
- Open the catalog or MCP App: [catalog/SKILL.md](catalog/SKILL.md).

`operations`, `executions --operation <id>`, `performance --operation <id>`, `trace --id <trace-id>`, `prompts --id <trace-id> [--span <span-id>]`, and `source` return JSON. Instrumentation commands are `init` and `check`. The repository supplies its own registry, adapters and protected configuration; never infer a project from this skill's installation path.
