---
name: trace-regression-performance
description: Capture registered operation traces, record end-to-end performance and assert explicit budgets during regression.
---

Reuse the project's tracing registry and provider configuration. Configure regression `telemetry.queryConfigParameter` or `queryConfigEnvironment`; credentials remain in the existing private Trace configuration. Supply legacy attribute mappings only when the project differs from `trace.operation.id` / `trace.outcome`. The registered terminal operation span is the entrance-to-return interval; children are diagnostic breakdowns.

GUI traceparent IDs are captured automatically. For command entry points, configure the project's existing propagation environment variable with `commandTraceparentEnvironment` and restrict it through `commandPathPrefix`. Source scripts must have the same SDK dependencies as their deployed artifact; bind required runtime environment through `commandEnvironmentParameters` in the private project environment.

Declare budgets with `await ctx.performance(name,{entryId,maximumMs})`. Checks resolve after execution against captured trace samples, not local timers. Missing matching evidence is blocked/inconclusive. Without an explicit budget, record observations without inventing a quality gate.

Case results preserve entry IDs, Trace IDs, root durations, completion phase, Grafana links and source/span breakdowns. List summaries show each entry's P90 for repeated samples in that case result, or Single for one sample. Drawer and agent records use the same evidence. Do not aggregate different entries, rounds, nested spans or unrelated production-window samples. Inspect telemetryDiagnostics when evidence is unavailable. Existing runs lacking IDs cannot be reliably backfilled by time-window searches.
