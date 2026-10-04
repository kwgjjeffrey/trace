# Trace skill implementation

Keep SKILL.md and references task-facing. Development rationale, future work and architectural decisions belong here or code comments. The skill is independently installable; no implicit Agent Colab paths, credentials or checkout imports.

Registry is the source of truth. CLI, HTTP App and MCP share dispatch, validation and query implementations. Repository indexes reference unit-owned registries. No registry compilation or copied projections; package unit files unchanged. Compute aggregation digests only for catalog identity. Do not equate successful registry loading with runtime coverage.

MCP UI uses the official ext-apps SDK. A browser fallback is not proof of host-side rendering. Project GUI locator integrations must remain explicit adapters. Provider tokens never enter tool results or HTML. Paths returned by source resolution must remain inside the configured repository; revision mismatch must be reported.

Development source is this Git repository; installed Skill is a separate release consumer. Release artifacts exclude node_modules, generated bundles and private config. Update handlers belong to setup; catalog only invokes shared setup capabilities. GitHub releases are public source packages with size/hash manifests, not vendor credentials.
