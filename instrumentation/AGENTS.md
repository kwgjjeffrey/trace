# Instrumentation development

Own registry parsing, reference traversal and scaffold assets. Keep operation definitions in target repos. Test duplicate IDs/cycles, safe paths and cross-clock behavior. Consumer procedures belong in SKILL.md; design rationale and iteration notes belong here or code comments.

2026-10-05 retrofit findings (ongoing): first-token CLI naming loses nested command semantics; registry loading alone cannot audit coverage; GUI wrappers must bind a scoped fetch closure and mark swallowed errors; service span definitions must be consumed from unit registries, not copied source metadata at each call site. Broad source reads were inefficient and truncated; inspect owned capability/handlers in bounded slices. AST-aware transformations preserve handler semantics better than text matching, but type-check after each capability and never treat mechanical insertion as acceptance. Persist context atomically with queued commands; restore the whole invocation rather than only provider execution. Final prompt auditing needs preview/dispatch distinction and capability redaction. Release only after target project acceptance, as requested.

Retrospective — Agent Colab retrofit:
- Effective: derive CLI leaves from the real parser; audit GUI request boundaries by capability; consume unit-owned registries unchanged; validate real cloud parent chains and actual prompt bytes. Keep these as separate evidence gates.
- Inefficient: whole-file dumps and bulk regex edits obscure handler behavior. Use bounded source reads and AST-aware edits, then type-check each capability.
- Incorrect: an old WebSocket error was interpreted as a current failure. Check log timestamps, process state and request ownership before changing infrastructure; distinguish a busy runtime from an unavailable runtime.
- Add: preserve context across process boundaries using per-invocation W3C environment fields attached to concrete command lines. Never mutate a shared Agent thread environment for queued turns. Capture the final prompt after inserting that context.
- Add: register the provider synchronously before asynchronous calibration; mark initial clock quality honestly. Preserve durable context atomically and restore ACK, execution, receipt and terminal presentation.
- Remove: treating registry counts, emitted HTTP spans or passing tests alone as end-to-end acceptance. Preserve separate static coverage and representative live acceptance.
- Release: immutable artifact versions must not collide with concurrent publishers. Finish promotion before invoking consumer upgrade, and verify the installed versions. Development source stays separate from installed artifacts.

Enabled-path regression: a mechanical edit accidentally passed a root-only `parent` variable to HTTP child creation. Offline parser tests missed it because telemetry was disabled. Add an enabled request-span regression and require a live Agent-issued CLI invocation before release; type/syntax checks do not catch Python runtime name resolution.

Live delivery findings: GUI batches can saturate a serial best-effort proxy, losing an entire coarse Core batch. Intake acceptance must expose queued/delivered/rejected evidence; account for queue rejection as a drop, bound memory and delivery concurrency, and verify causal parent completeness after realistic GUI/Agent traffic. Avoid declaring chain success from UI state alone.
