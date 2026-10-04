---
name: trace-instrumentation
description: Trace instrumentation workflows for a registered repository.
---

# Instrumentation contract

Use repository `tracing/registry.yaml` schemaVersion 1: project {id}, registries [relative-file-path]. Each referenced unit registry has schemaVersion 1, unit, operations [{id,description,owner,entry,completion,source}]. Entry kind is gui, command or internal. GUI has page,target; command has executable,args; source has repository-relative path,function and optional line. Completion defines success,failure,cancelled where applicable. Set status=candidate until business entry and results are actually bound and verified.

Run init, register each service/artifact in its own tracing/registry.json, and reference those files from the repository tracing/registry.yaml index using paths relative to that index. JSON is readable by the YAML loader and by Python/JavaScript without a code generation step. Run check to validate references and unique operation IDs. Runtime instrumentation reads or imports its own registry; packaging carries that file unchanged at the same relative path. No generated snapshots or source-path replacement. Record the artifact version and actual code revision on spans.

Create one root for one user operation. Preserve W3C traceparent and approved baggage `trace.entry.id` across synchronous calls; record trace.entry.id on every child. Each registered internal step additionally has trace.operation.id. Queue/outbox/WS payloads persist traceparent and entry ID in a versioned envelope; retries are separate attempts under the same business execution, not unrelated roots. Do not propagate arbitrary incoming baggage or payload content.

Every span has code.file.path (relative), code.function.name and code.revision. Automatic HTTP middleware can identify its handler/middleware source; business spans identify the business function. Never invent the business source from a route string.

Finish roots at the registered terminal result (e.g. render commit or CLI JSON+exit). HTTP headers alone are transport coverage. Agent execution/reply is a separate asynchronous completion boundary unless explicitly included.

For clock alignment, use four timestamps, subtract server handling time, take the best of three valid samples. Estimate offset=(t2-t1+t3-t4)/2; uncertainty=max(0,t4-t1-t3+t2)/2 plus upstream uncertainty. Use epoch anchored to monotonic time, keep span duration monotonic, refresh on startup, every five minutes and resume/network restoration. Expire estimates after five minutes or detected suspend/jump; mark uncalibrated and never claim precise cross-host ordering within uncertainty. Verify offset injection and recovery, not just ordinary clock probes.

Use official OTel SDK/exporters for the project's languages. Frontends/CLI submit to an authenticated local or application intake; exporter credentials stay in the server/collector. Bound batch size, queues, retries and quotas; expose delivery counters separately from intake acceptance. Configure OTLP HTTP/protobuf with environment-specific protected configuration. For Grafana, obtain OTLP gateway/tenant and Tempo query endpoint/tenant separately; use trace write/read scopes as required. Never assume they share a tenant ID. Do not modify provider policies without authorization.

The init scaffold includes adapters/otel.mjs for registered spans and adapters/clock.mjs for bounded calibration. Install the official @opentelemetry/api plus language/runtime SDK and OTLP exporter; configure W3C TraceContext and Baggage propagators. Consume the owning unit registry. Call finish only at the completion boundary. The clock probe must have a timeout and identify its reference; register startup/resume/online hooks and stop its timer at teardown. The initial JS adapter is not a substitute for Python/Rust adapters or durable context integration.
