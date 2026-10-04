# Analysis development

Own provider adapters and trace interpretation. Require explicit protected config; no project-specific paths, tenants or defaults. Preserve read-only behavior, bounded queries, truthful sample scope and revision checks. Consumer procedures belong in SKILL.md.

Prompt review lists metadata by default and retrieves content only for a selected span, reducing unnecessary context load. Catalog renders payload as textContent in an expandable panel, never innerHTML. Capture validation must compare the assembled command with trace readback, not just assert a tag exists.

Trace chain queries omit prompt bodies by default. Prompt inventory and selected-body retrieval share one backend query path; GUI retrieves a body only when expanded. This prevents broad trace exploration from flooding the consuming Agent context. Performance samples use backend trace-envelope duration, not exclusive CPU or entry-root latency.
