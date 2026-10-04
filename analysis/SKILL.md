---
name: trace-analysis
description: Trace analysis workflows for a registered repository.
---

# Analysis

Get operations first and select by description and completion boundary. Query executions for the chosen ID and time range, then inspect a concrete trace. Compare root duration, outcome, child paths, retries and return phase; separate missing instrumentation from failed business delivery. Performance output is a bounded sample summary and must not be described as exhaustive p95/p99 or throughput. For production population statistics, configure span-derived metrics and query that backend.

Source locations resolve from span attributes against the configured repo. Check code.revision before applying fixes. Do not silently navigate to current line numbers for an older revision. Legacy spans lacking source or entry IDs are reported as such; operation-level source is a fallback, not exact span attribution.

Respect clock quality/uncertainty. Single-host monotonic durations are reliable; cross-host timestamp gaps within uncertainty cannot establish order or network latency. Use parent relationships to establish causality.

For Honeycomb, use `python analysis/scripts/honeycomb.py --credentials <private-file> context` and then trace/spans or a bounded allowlisted call. Install the official MCP dependency from analysis/scripts/requirements.txt in a dedicated environment. No project or credentials path is inferred.
