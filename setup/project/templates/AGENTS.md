# Project regression tests

Cases belong in the directories registered by regression.config.yaml; execution records belong in its regressionDirectory. Do not copy the Trace runtime or dependencies into this repository.

Each .mjs case exports literal USECASE {name,description} and META. Start from cases/_example.mjs. Rename the copy so it is discoverable. Leave run absent until a real implementation is requested; never add a placeholder runner. Active means real execution, assertions and cleanup have been reviewed; a green first run alone does not qualify a script.

For systematic discovery, follow GUI/command entries through their business outcomes, write cases and Module paths as you read, then consolidate the hierarchy. Re-read only unresolved behavior. Describe purpose, preconditions, actions and observable expected results. Distinguish implemented contracts from roadmap proposals.

Use the installed Trace skill's regression_test/cases/SKILL.md to author cases, execution/SKILL.md to implement scripts and record_store/SKILL.md to analyze results. Preview plan before run. Use real isolated fixtures for writes; metadata never creates isolation or authorization. Keep credentials outside tracked files. Do not add arbitrary latency thresholds without a baseline.

For a normal change, select its Module path or explicit case IDs and existing bug cases; use suite metadata to keep installation/login/release acceptance out of unrelated business changes. Query cases with --meta or --modules before opening script files. Use plan --selectedOnly true to avoid loading excluded case descriptions. Append scoped repair rounds to the same Run and inspect record --latest --problems.

Bind reusable read fixtures once through the project environment adapter; read tests consume ctx resources rather than creating their own copies. Mutations own their targets and restore or remove them in finally. Declare shared resources in META.locks, using read: or write: prefixes; offline/restart/account switches write client state. Empty locks means all resources are case-owned; omitted declarations fall back to exclusive execution. Maturity is independent of scheduling. The runner supplies ctx.page in a case-owned tab/context; scripts contain no browser lifecycle boilerplate.
