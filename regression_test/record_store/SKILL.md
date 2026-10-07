---
name: trace-regression-records
description: Inspect project regression history and diagnose non-green case results.
---

Use records for newest-first run history and record --id <run-id> --problems for failures, errors, blockers and cancellations. The target repository's run directory holds regression.yaml and evidence. Case descriptions/metadata/results reflect that run; source --id shows the current script, which may have changed.

Inspect expected/actual assertions, inputs/outputs, execution steps, timing boundaries, errors and screenshots. Follow associated trace IDs through Trace analysis when available; absent trace evidence requires further investigation, not a fabricated success. Distinguish product defects, prerequisite failures, script rot and removed features. Preserve historical runs while fixing causes.

A Run groups execution rounds. Inspect `run_record --id <run-id>` for all rounds and latest selected evidence per case; add `--problems` to filter that latest evidence. Inspect a particular round with `record --id <round-id>`. Start a new Run with `run`; append a scoped repair round with `run --runId <run-id>` and the usual metadata filters (preview those same arguments with `plan`). MCP uses regression_run_record and regression_run with identical arguments.

Excluded cases provide no new evidence. The latest result for an unselected case remains from its earlier round; its round ID and script digest identify that evidence. This aggregation is not a release approval or proof against newer product code. Historical standalone executions remain separate single-round Runs.

Before diagnosing product defects, read the current case maturity from cases. Trial results are provisional: verify actual actions, observations, assertion boundaries and cleanup regardless of outcome, then explicitly promote the reviewed script. Historical run metadata records its state at execution and is not evidence that the script was reviewed. Review active execution evidence too; separate script mistakes, environment contamination and product defects.

Use `record --id <run-id> --latest --problems` for a compact current list of unresolved results across this Run's rounds. Each case uses its most recent terminal result, including blockers/cancellations, with its source round and script digest. Pending, running and excluded rows never overwrite completed evidence. Omit `--problems` to include passing results. HTTP and MCP record queries accept the same latest option; the GUI's Latest round result column uses this same aggregation.

To assess result distribution, add `--groupBy module --moduleDepth 1` (or `--groupBy priority`) to `record --id <run-id> --latest`. Omit moduleDepth for full Module paths. Any recorded metadata field can group results; each group contains case IDs and outcome counts. Counts use all results before the optional problems filter. Array fields place a case in each matching group, so totals can overlap. Use `record --id <round-id>` without latest for one round. These views support a release decision; they do not grant release approval or establish evidence against a newer product revision.
