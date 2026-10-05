# Analysis development

Own provider adapters and trace interpretation. Require explicit protected config; no project-specific paths, tenants or defaults. Preserve read-only behavior, bounded queries, truthful sample scope and revision checks. Consumer procedures belong in SKILL.md.

Prompt review lists metadata by default and retrieves content only for a selected span, reducing unnecessary context load. Capture validation must compare the assembled command with trace readback, not just assert a tag exists.

Trace chain queries omit prompt bodies by default. Prompt inventory and selected-body retrieval share one backend query path; Agents retrieve one selected body explicitly; the human catalog leaves trace and prompt detail to Grafana. This prevents broad trace exploration from flooding the consuming Agent context. Performance samples use backend trace-envelope duration, not exclusive CPU or entry-root latency.

Catalog statistics use provider instant TraceQL metrics over matching root spans. Do not calculate GUI percentiles from capped search results. Preserve absent quantiles and provider approximations; datasource, root selector, operation attribute, origin filter and range must agree with the Drilldown URL.
