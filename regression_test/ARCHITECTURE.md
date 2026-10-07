# Regression architecture and verified rundown

2026-10-06. Formal workspace: http://127.0.0.1:53481/. GUI preview uses the project adapter at 53480. Prototype services at 53482/53483 are retired. Public GitHub release remains unchanged; local installed skill uses the promoted source.

## Trace source layout

```text
regression_test/
  SKILL.md                    current trial commands and script contract
  AGENTS.md                   engineering boundaries
  cli.mjs                     agent CLI / init / doctor / serve
  cases/catalog.mjs           literal AST discovery, selection, lifecycle edits
  execution/runner.mjs        sequential scheduling, worker timeout/cancel
  execution/worker.mjs        ctx, named assertions/steps, command/GUI execution
  browser/runtime.mjs         dedicated Chrome profile, CDP, run-owned Page
  record_store/store.mjs           atomic YAML writes, record queries, interruption recovery
  lib/service.mjs             common CLI / HTTP / MCP contract
  lib/paths.mjs               repository containment and bounded errors
  catalog/server.mjs         forwards capability CLI to the shared workspace server
  ../catalog/ui/             shared React + official shadcn/ui components
    src/features/            cases, records, structured detail Sheet
    src/components/ui/       CLI-installed Radix shadcn primitives
    src/index.css            shared semantic theme tokens
  catalog/mcp.mjs             eight agent tools using the same service
  setup/install.sh            locked trial dependencies, doctor
  ../package.json            shared dependencies and locked setup
  tests/contracts.test.mjs    isolated discovery/worker/result contract checks
  .runtime/                  ignored process logs and browser screenshots
```

No imports of Colab in the regression core. Browser code follows the reviewed Omni boundary, not its authentication/routing implementation; no unlicensed Omni files copied. Playwright is pinned to 1.58.0. The reused browser architecture is dedicated profile -> DevToolsActivePort -> loopback WebSocket -> default BrowserContext -> run-owned Page. Existing profile cookies are not exported/copied. The Page is foregrounded. Close run-owned Page and disconnect; terminate only a browser launched by this worker.

The shared catalog/scripts/workspace.mjs composes the existing tracing dispatcher and regression service. HTTP and MCP use that same composition; catalog/ui renders all three pages without embedding an old tracing catalog. Provider configuration stays in protected local configuration. The regression worker never imports tracing. A project may optionally supply a telemetryAdapter for provider measurements; this hook is not yet connected in the Colab pilot.

## Target repository layout (Agent Colab pilot)

```text
regression_test/
  registry.yaml
  cases/gui/navigation.mjs
  cases/skill/channels.mjs
  cases/diagnostics/false-positive.mjs
  .runs/<UTC timestamp>-<short ID>/
    regression.yaml
    evidence/*.png            when requested or on GUI failure
```

Index registers directories, result root, target URL, browser profile, readiness selector, named DOM targets and declared prerequisites. Scripts export literal USECASE {name,description}, META, run(ctx), optionally cleanup(ctx). A script contains human-readable use case and executable implementation; no copied registry and no archived scripts. Inputs/outputs are bounded summaries; original script path/digest remains in each result.

These are read-only pilot cases. Test data mutation/cleanup fixtures and automatic prerequisite discovery are not yet validated. Current prerequisite flags declare readiness but do not replace actual business assertions. Running scripts is trusted repository execution, not a security sandbox.

## Rundown

1. Agent creates the project index with init, writes case modules, and checks cases/plan. Static parsing does not import code.
2. GUI lists the same discovered cases; clicking opens description, View script opens a read-only view of the real repository file. Host-editor integration is not implemented in this browser trial.
3. Plan selects active cases using profile/module/surface/IDs and returns exclusion reasons. Rotten/obsolete stay excluded; an explicitly selected rotten case can be run for validation.
4. GUI POST or MCP/CLI run invokes the shared service. Runner creates timestamped regression.yaml and spawns one worker per selected case. GUI/MCP poll by run ID; CLI waits and returns nonzero for non-green selected results.
5. GUI worker connects through CDP; Skill worker runs a real subprocess. ctx logs named operations, targets, evaluated functional assertions, explicit timing scopes and screenshots. No business actions run during inspection.
6. Results persist expected/actual, timing boundaries, status and evidence. Atomic progress becomes a terminal record. Timeout/cancel kills the worker process group; incomplete server runs recover as interrupted.
7. Human inspects the sidebar/detail; agent requests record --problems. Failed historical runs remain intact. Confirmed script rot can be marked with status and reason; business defects must not be labeled rot automatically.

## Verified evidence

- Real Skill-only run: 20261006T003558Z-8edf99cb; one passed case, command exit/JSON assertions and CLI output-to-exit timing limit passed.
- First GUI+Skill run: 20261006T003636Z-81eaa31e; GUI failed while workspace was loading, Skill passed. Screenshot retained.
- Corrected GUI+Skill run: 20261006T003837Z-0c435305; two passed, one inactive fixture excluded, total 4.83 seconds. Real Chrome/CDP drove the GUI; business-landmark wait replaced shell-readiness assumption.
- Negative fixture: 20261006T004238Z-db443bf0; explicit rotten-case validation produced failed actual=false / expected=true assertion; ordinary regression excludes it.
- Browser acceptance: description drawer, real script view, problems filter and result details; performance catalog shows real provider percentiles and nested GUI highlight has computed animationName=trace-breathe.
- MCP stdio lists eight regression tools; regression_cases returns exactly the same three project cases as CLI/GUI.
- Trial tests: six pass (static discovery/no side effects, literal/status filters, real worker pass/fail, prerequisite blocking/path containment, missing telemetry inconclusive, timeout error).
- Existing Trace tests: thirteen pass.

## Remaining before promotion

Automatic GUI/Skill business trace identity propagation and provider readback/per-span limits remain unimplemented. measure is explicit runner scope timing, not provider tracing. GUI step target preview and host-editor opening remain future integrations. Cookie persistence across a protected remote login, reused externally launched profile lifetime, headless CI auth, isolated-write fixtures, and packaged release acceptance remain unverified. The public Trace release is unchanged; do not claim the trial is a distributed complete regression product.

Trial processes are supervised by personal.trace.catalog and personal.trace.locator LaunchAgents. Old prototype LaunchAgents have been removed. Dependency installation contains no bundled node_modules in source commits; generated run outputs/logs are ignored.

## 2026-10-06 interaction rebuild

Replaced the prototype's handwritten HTML/CSS/innerHTML frontend with React and official shadcn/ui (CLI 4.21.2, new-york Radix). Sidebar owns navigation; Select and Field own aligned filters; Table owns case/results lists; Sheet owns detail; Dialog owns execution scope; Badge/Switch/Alert/Skeleton/Empty own feedback. Table rows are clickable and keyboard-accessible; script links stop propagation. Remove machine IDs from list rows and split Module, Entry, Priority, Added for, Duration class, Status into separate columns. Persisted metadata remains unchanged; UI labels map lifecycle codes to Active/Needs repair/Retired and origin codes to Feature/Bug regression/Acceptance gap. Run controls live apart from filters and inactive-only views disable ordinary regression execution.

Results replace button-in-card layouts and raw JSON with an outcome/duration/assertion/reason table, summary values and assertion expected/actual tables. Historical run selection is a flat navigation list. Browser narrow-view navigation uses the mobile Sidebar Sheet and closes after selecting a destination. Script view, named outputs, evidence and the existing monitoring adapter remain available.

Validation: TypeScript check and production Vite build pass; six existing regression tests pass. Browser verified Select option filtering, row-to-Sheet, Sidebar mobile navigation, problems switch, structured assertion details and execution Dialog. New real run 20261006T013521Z-2f26344b was created through the new UI; current Colab session returned HTTP 401 Sign in first, producing one GUI readiness error and one Skill assertion failure with original diagnostics/output/evidence. This run is not claimed to pass business checks. Existing successful historical runs remain intact.

Build: npm run build under the Trace root. setup/install.sh performs locked dependency install and build. Server serves catalog/.runtime/ui assets, which are ignored and regenerated; removed the superseded app.mjs/index.html sources. No formal Trace release or Colab runtime behavior changed by this UI rebuild.

## Ownership and status semantics

Trace owns reusable code: cases/catalog.mjs parses project scripts; record_store/store.mjs saves/reads target-repository records and recovers interrupted runs. Neither directory contains business cases or real regression records. GUI rendering lives in catalog/ui/src/features/cases.tsx and records.tsx. Contract tests create disposable temporary repository fixtures.

The target repository owns registry.yaml, case scripts, .runs/<run-id>/regression.yaml and evidence. recordRoot is resolved from that project's registry and constrained inside the target repository. Trace's ignored .runtime contains build output/logs/development screenshots, not business regression records.

Outcome colors: passed green; running blue; blocked/interrupted amber; failed/error red; pending/excluded/cancelled neutral. Completed scheduling does not imply passing tests: the displayed outcome comes from case results. Text and icons accompany every color.

Validation: semantic status rebuild and TypeScript check pass; six contract tests pass after record_store import migration. No target-project cases or historical run files moved.

## Formal promotion

Generic regression capability moved to regression_test; common React/shadcn pages moved to catalog/ui. Agent Colab owns regression_test/regression.config.yaml, cases and .runs. Five historical records retain their time/outcomes; only relocated source/evidence references were updated. Deleted the obsolete catalog frontend and prototype monitoring iframe adapter. Root setup builds one browser GUI and one self-contained MCP resource from the same source. Distribution allowlist includes source and excludes .runtime, .runs, .trial and node_modules.

Metadata values use Badge in lists/details. View script uses a Sheet, highlight.js JavaScript highlighting and copyable absolute path; no standalone source HTML route. Performance registry shares Sidebar/Badge/Button/Alert theme, registered owner/source, provider percentiles, exact Grafana links and secure GUI locator postMessage. This promotion does not add automatic cloud trace association.

Formal runtime acceptance: run `20261006T025324Z-5d33dbe0` passed GUI and Skill (two passed, one inactive fixture excluded), total 9.19 seconds. Prior run `20261006T025229Z-cd78ee22` remains recorded: GUI readiness matched six tabs and failed strict resolution, Skill passed. Fixed project readySelector to the unique Messages tab; do not weaken runner strictness or discard the prior failure. Desktop and narrow viewport interfaces verified; package dry run has no .trial/.runtime/.runs/node_modules payload.

## Metadata selection and agent guidance

cases/filters.mjs owns shared metadata normalization/matching and available values. CLI, HTTP, MCP and GUI use the same plan/run selection. catalog/ui/src/features/run-regression.tsx owns the human form only. execution/agent-prompt.mjs reads the consumer SKILL.md Run regression section verbatim, then adds repo-specific quoted commands and current filters. There is no separate handwritten GUI agent instruction. Lifecycle validation and external-write authorization are separate from metadata selection.

Consumer guidance: regression_test/SKILL.md routes to cases/SKILL.md (authoring/discovery/lifecycle), execution/SKILL.md (script/context/assertions), record_store/SKILL.md (history/diagnosis). Each has AGENTS.md for development information. Shared setup remains Trace setup; human rendering remains catalog/ui; project scripts and run output remain in the target repository.

Validation: 22 tests, typecheck and build pass. Browser selected Agent command in the multi-value Entry picker, observed one selected case, inspected copied prompt with matching meta JSON and successfully copied it. GUI run 20261006T030547Z-c9d07559 passed the selected Skill case and excluded the GUI/rotten fixture.
