# Capability development

Keep consumer procedures in SKILL.md. Record implementation decisions and invariants here. Business cases and output data remain in the target repository.

2026-10-07 Colab full-suite practice: structured functional assertions use Node isDeepStrictEqual. Strict object identity would reject independently read receipts even when every value matches. Preserve actual/expected snapshots, and keep unequal nested values non-green. Project adapters own selectors, API contracts, resource preparation and isolation; do not move those into the generic worker.

Full-suite reruns exposed two project-script defects: persistent mutation of a common Canvas fixture, and selecting file text that matched both a tree item and a breadcrumb. Consumer guidance now requires repeatable fixture cleanup and request-specific readiness. Keep selectors and fixture repositories in the project; generic tooling only supplies lifecycle/assertion interfaces.

2026-10-08 trajectory audit: bounded scheduler defaults to exclusive execution for undeclared cases. Reviewed cases opt in; locks and the implicit browser lock prevent shared-state races. Worker input/output filenames are case-specific and cancellation terminates every active process group. Keep fixture preparation in the project, never in generic scheduling.

Browser concurrency boundary: profile locking currently serializes GUI workers because each worker owns Chrome connection and shutdown, not because tabs inherently require serialization. A future run-owned browser must lease case-owned tabs and close only those tabs; cookie/localStorage/account, clipboard, focus and native dialogs still require explicit resource ownership. Script maturity and scheduling independence are separate concepts.
