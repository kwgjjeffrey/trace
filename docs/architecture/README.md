# Architecture and extension boundaries

The system has three caller surfaces: deterministic CLI, HTTP browser transport and MCP App transport. All invoke shared capability services. Skills are instructions for using these services, not a second implementation. `catalog/scripts/workspace.mjs` composes tracing dispatch (`lib/dispatch.mjs`) and regression service (`regression_test/lib/service.mjs`).

## Tracing path

The repository index references unit-owned registries. Instrumentation consumes registered IDs. The project's SDK propagates context and exports to the project's OTLP collector. Analysis reads an explicitly supplied protected provider profile and queries Tempo. The GUI shows provider metrics and operation bindings; Grafana shows waterfalls. Source resolution stays within the target repository and reports revision mismatch.

## Regression path

Case discovery reads literal metadata through AST parsing without executing it. Planning applies lifecycle and environment filters. Explicit execution imports eligible project scripts through the runner context. Records persist per-round results and aggregate latest terminal evidence per case. CLI/MCP/browser use the same service contract. GUI inspection never runs a business operation implicitly.

## State ownership

| State | Owner | Portable in source release? |
| --- | --- | --- |
| Suite code and dependency lock | Suite | Yes |
| npm dependencies, built GUI, receipts, backups | Local installation | No |
| Operation registry, cases, adapters | Target repository | No |
| Run/Round results | Target record root | No |
| Endpoints and credentials | Explicit private project profile | No |
| Spans and prompt bodies | Project's collector/provider | No |

## Extending the suite

Add an owned capability directory with a service contract and task-facing Skill. Keep business implementation there, shared routing in `lib/`, and rendering in `catalog/ui/`. Expose the same contract through CLI, HTTP and MCP. Declare state ownership, external destinations, cancellation and failure semantics. Ship executable behavior before adding consumer claims. New capabilities use the suite's version until a real independent release boundary is needed.

## Compatibility

Agent DevOps Suite is the product identity. The existing `@personal/trace` package identity, repository URL, `trace.mjs`, `trace_*` tools, `ui://trace/catalog`, environment variables and installation directory remain transport/distribution compatibility identifiers. Renaming them all at once would break installed upgraders and target repositories. The new CLI alias delegates to the existing implementation.

## Limits

The browser server binds to loopback. Host extension support is required for embedded MCP rendering; stdio and browser acceptance cannot prove host rendering. Updates retain source backups but activation is not whole-directory atomic. No hosted suite backend, generic CI provider or release orchestration capability is shipped; those are possible future modules.
