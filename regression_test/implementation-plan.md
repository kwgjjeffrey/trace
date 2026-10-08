# Regression test implementation and verification plan

Design completed 2026-10-06. Implemented capability is recorded below; unverified stages remain explicit.

1. Case discovery and planning: add schema validation, JavaScript AST literal extraction, bounded tree reads, source resolution, metadata filters and explicit selection reasons. Verify duplicate IDs, malformed scripts, no import side effects, inactive exclusion and explicit rotten-case validation.
2. Execution and records: managed Node/Playwright setup and extracted generic Chrome/CDP lifecycle, worker/context interfaces, fixture hooks, timeout/cancellation/cleanup, atomic YAML and interrupted-run recovery. Verify GUI and real CLI scripts, failed assertions, prerequisite blocking, execution exceptions, path guards and evidence capture. No archived scripts.
3. Shared service and human pages: implement agent CLI/MCP/HTTP APIs from the same service; add Performance registry, Test cases and Regression records navigation. Verify name versus description, drawer, real script opening/fallback, newest-first run list, elapsed duration and problems-only results. Keep existing monitoring functional.
4. Observation and preview: regression identity intake for project GUI/Skill, business trace association, bounded telemetry wait, single-run/per-layer performance checks and recorded-step target locations. Verify executor overhead excluded, concurrent identities isolated, unavailable targets honest, missing telemetry never green and no business execution during preview.
5. Agent Colab acceptance: agree representative GUI and Skill cases with fixtures and active metadata; validate individual scripts, run a targeted regression, analyze failures with Trace, demonstrate rotten repair/human restoration and an obsolete case. Read Colab engineering/product documents before changing that repository; update its live implementation/validation documents with evidence.
6. Distribution: package module/consumer instructions, fresh-install dependency check, same GUI/agent catalog and results, public upgrade verification. Release only after scoped acceptance; retain remaining limitations explicitly.

For each stage, record verified commands, fixtures and observed results here. Do not convert planned steps into passing status merely because docs/schema exist.

2026-10-06 source inspection: reuse assessment and revised .mjs script contract documented in design.md. Extraction, redistribution basis and fresh browser validation remain pending. No browser automated via shell during this inspection.

2026-10-06 first isolated implementation: `ARCHITECTURE.md` records the actual source/project layout, commands and acceptance evidence. Real Colab GUI+Skill run passed both read-only cases (4.83 s); prior GUI readiness failure retained. Six prototype tests and thirteen existing Trace tests pass. CLI/HTTP/MCP share a service; browser three-page shell and script view verified. Still pending: automatic business trace correlation/provider performance acceptance, fixture writes, protected-login persistence, complete browser lifecycle coverage and packaged distribution. Prototype remains in .trial; no formal module promotion/release.

2026-10-06 UI refinement: prototype frontend rebuilt with React/shadcn Sidebar, Table, Select, Sheet and Dialog; independent metadata columns and structured result/assertion display. Typecheck/build and six regression tests passed. Browser verified filters/navigation/details/run scope. UI-triggered run 20261006T013521Z-2f26344b correctly retained current-session 401 failures; business acceptance is not claimed for this run. Superseded handwritten frontend sources removed; source and build remain in .trial.

2026-10-06 formal promotion: regression capability is now in regression_test, shared GUI in catalog/ui, project pilot in Agent Colab/regression_test. Root dependency/setup/package allowlist includes the module; existing trace.mjs app/mcp expose all three pages/tools using shared composition. Browser validated formal preview URL, messages.send trace-breathe, Grafana operation/origin filters, metadata badges, script Sheet syntax tokens and successful copy-path action. Typecheck/build and 20 tests passed. Historical regression output remains project-owned. No new GitHub release; local source activation only. Automatic business trace correlation and unvalidated browser/fixture cases remain pending.

Formal runtime acceptance: run `20261006T025324Z-5d33dbe0` passed GUI and Skill (two passed, one inactive fixture excluded), total 9.19 seconds. Prior run `20261006T025229Z-cd78ee22` remains recorded: GUI readiness matched six tabs and failed strict resolution, Skill passed. Fixed project readySelector to the unique Messages tab; do not weaken runner strictness or discard the prior failure. Desktop and narrow viewport interfaces verified; package dry run has no .trial/.runtime/.runs/node_modules payload.

2026-10-06 shared selection and agent handoff: plan/run now accept meta JSON with AND across fields, OR within a field and member matching for array metadata. filter_options exposes discovered project values; unknown keys and invalid types fail instead of silently widening scope. Lifecycle and external-write authorization remain separate gates, with normalized CLI/HTTP boolean flags. GUI Run regression uses the same metadata dimensions, profile/changed modules, per-case timeout and run name. agent_prompt extracts the Run regression section verbatim from consumer SKILL.md and appends quoted commands for the configured repository and selection. Consumer module routes to cases, execution and record_store SKILL.md; development notes stay in AGENTS.md. Typecheck/build and 22 tests pass, including selection/lifecycle/write boundaries and prompt provenance. Actual GUI metadata selection status=active,surface=skill run 20261006T030547Z-c9d07559 passed one case, excluded two, and retained those filters in its record. No business trace correlation or new public release claimed.

2026-10-06 script preview: added Wrap lines Switch to the source Sheet. Browser verified pre -> pre-wrap/overflow-wrap:anywhere and long-line horizontal overflow shrinking from 3673 px to the 667 px viewport. Typecheck/build and staged installation checks pass; no new case tests needed for this presentation control.

2026-10-06 prompt reduction: handoff now extracts only the short Run regression instruction and adds one executable command. Removed duplicated repo/index/filter summaries, two equivalent command blocks and default profile/index/timeout flags. Full filtering, lifecycle and transport reference remains in execution/SKILL.md. Existing 22 tests and build/staged activation pass; prompt provenance remains tested.

2026-10-06 agent-first action: footer primary Run via agent opens a shadcn Popover containing the concise scoped prompt and Copy/Copied feedback. Manual execution is the secondary Run button. Removed the top view/copy actions and inline prompt section. Browser verified primary/secondary variants, popover placement and successful copy feedback. Typecheck/build and staged activation pass; no business regression was executed for this presentation change.

2026-10-06: case-only review is supported without executable placeholders; Module subtree filters are shared by CLI/HTTP/MCP and the catalog derives ancestor options from case paths. Verified 24 generic contracts, typecheck and shared build. Agent Colab authors its own case inventory; no product behavior is certified by discovery.

2026-10-07 Run/Round: added schema-v2 execution grouping with backward-compatible single-round legacy records; shared run_record/ask_agent CLI, HTTP and MCP actions; metadata-selected New round dialog, per-case round comparison and Ask Agent copy popover. No Report generator introduced. Historical results remain intact; latest evidence retains round provenance and script digest. Generic checks and UI verification tracked in this change.

Verification: 32 generic tests and typecheck passed; staged installation built shared GUI. Real Colab run 20261007T093625Z-c5da8dfa has two passed scoped rounds. Browser verified round matrix and Ask Agent Copy/Copied feedback. No overall product readiness claim.

2026-10-07: Added executable trial lifecycle, default trial+active selection, trial scaffold template, shared GUI badge/filter support and explicit evidence review guidance. Green runs never auto-promote. 33 contract tests pass, typecheck and catalog build pass; installed consumer and shared App updated locally.

### 2026-10-08 efficiency audit

Implemented filtered case discovery and selected-only plans, conservative bounded scheduling (1–8), explicit reviewed-case opt-in and resource locks, case-specific worker IPC, all-worker cancellation, per-case start/end evidence, and optional selected-resource requirements in environment resolution. Added GUI concurrency control and matching agent-prompt arguments. Project init templates now route from root instructions and teach fixture reuse/scope selection and trial qualification. 48 tests passed; typecheck/build passed. Agent Colab five actual cases passed concurrently in 12.48 s versus 17.21 s serially; this does not claim universal speedup.

Planning now deduplicates identical read-only preflight requirements within its snapshot and caps distinct probes at four; execution deliberately rechecks each case. Contract validation covers both behaviors.

### Run-owned tab lifecycle verified (2026-10-08)

One persistent Chrome window, default-context tabs, parent-owned auxiliary allocation via IPC, per-case finally cleanup and final owned-process shutdown replace per-case context/windows. Repeated headed batches (3 concurrent leases plus auxiliary tab) return to the original blank tab; worker disconnect does not close siblings. Colab real GUI observation at concurrency 3 recorded one window and no monotonically accumulating tabs; the initial Session timeout cause remains unproven; speculative project-wide navigation locks were removed. All 33 regression-tool tests passed.

### Single results selection verified (2026-10-08)

Regression records now use one shadcn Tabs selection: Latest and each historical Round. That selection drives grouped totals and case detail rows, as well as scoped status/duration; there is no separate result-scope dropdown or comparison mode. The route's round parameter is authoritative, including old URLs containing results=latest. Browser UI verification on Run 20261008T035038Z-35e9136d confirmed Latest=6 rows, Round 1=6 rows, Round 2=1 row, reload preserving Round 2, returning to Latest removing round from the URL, and no Compare rounds control. Typecheck, build and 51 tool tests passed; installed skill and local catalog updated.

### Inline round comparison (2026-10-08)

The previous tab selection misinterpreted the requested design and is superseded. Grouped regression results now show Case, Latest, Round 1…N and Script columns directly. Group rows summarize each column; case rows show outcome, script wall time and assertion counts, and historical cells open their own evidence. Missing execution is a dash. Legacy round/result URL parameters no longer restrict the table. Script time is worker elapsed time including setup, actions, waits, assertions and cleanup, not provider trace latency. Browser verification confirmed the repaired onboarding case appears Passed / Error / Passed across Latest / Round 1 / Round 2 and its Round 1 error detail opens. Typecheck passed; installed local catalog updated.

### Group overview and performance evidence (2026-10-08)

Group rows show only latest case counts/outcomes; historical aggregate cells are blank. Expanded case rows retain Latest and round comparison. Results cells and evidence drawers now render stored trace measurements and explicitly distinguish operation timing measured by the runner. No trace evidence is invented when missing: the current Colab runs have no linked provider performance measurements, and GUI explicitly says not collected. Script total duration remains diagnostic evidence, not performance.

### Per-point performance summary (2026-10-08)

Lists summarize comparable samples inside the displayed case result, by performance point and source: nearest-rank P90 for repeated samples; Single for one sample. They never combine unrelated points, sources, or historical rounds. Drawers retain samples. Provider performance assertions require an explicitly declared operation-end-to-end boundary; an arbitrary child-span duration is no longer accepted. Current Colab records still lack linked provider telemetry; operation timing is shown separately. Summary tests verify point/source separation, P90, single labeling and exclusion of unknown-span boundaries.

### Correct performance source (2026-10-08)

Runner/API timing was incorrectly promoted into list performance summaries. It is now excluded and remains diagnostic evidence in the drawer. List summaries accept only registered entry IDs with an explicit operation-end-to-end trace boundary. Regression-to-provider linkage remains incomplete: current Colab records do not capture and resolve their execution trace IDs, so no claim of performance acceptance is valid. Missing trace data is explicitly visible, never filled using unrelated global-window metrics or local API timers.
