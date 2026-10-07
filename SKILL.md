---
name: agent-devops-suite
description: Agent DevOps Suite — instrument registered end-to-end operations, investigate traces and performance, or open a shared operation catalog for any repository.
---

If Node is not on PATH, use `sh <this-skill>/setup/run.sh trace.mjs <command>`; the launcher finds the bootstrap runtime.

Resolve the target repository. Run `node <this-skill>/trace.mjs <command> --repo <repo>`; pass protected provider configuration with `--config` when querying.

For first use or a dependency/startup failure, read [setup/SKILL.md](setup/SKILL.md).

Read only the capability needed for the task:

- Register or change instrumentation: [instrumentation/SKILL.md](instrumentation/SKILL.md).
- Investigate performance or spans: [analysis/SKILL.md](analysis/SKILL.md).
- Discover, author or execute regression cases and analyze run records: [regression_test/SKILL.md](regression_test/SKILL.md).
- Open the catalog or MCP App: [catalog/SKILL.md](catalog/SKILL.md).

`operations`, `operation_metrics --operation <id>`, `executions --operation <id>`, `performance --operation <id>`, `trace --id <trace-id>`, `prompts --id <trace-id> [--span <span-id>]`, and `source` return JSON. Instrumentation commands are `init`, `check`, and `locator-install --directory <unit-relative-directory>`. The repository supplies its own registry, adapters and protected configuration; never infer a project from this skill's installation path.
