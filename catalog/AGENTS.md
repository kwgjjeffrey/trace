# Catalog development

Own MCP transport, browser transport, frontend and frontend build. Both transports use shared lib/dispatch.mjs. MCP resources use official ext-apps SDK. Browser validation does not prove MCP host rendering. Project locator adapters remain outside this skill. Consumer procedures belong in SKILL.md.

## 2026-10-05 GUI locator validation

Span registration coverage is independent from DOM locator coverage. Audit both; operation ID presence in a span call is not evidence of a visible GUI target. The project adapter must distinguish a business control from the region rendering a background read, and retain explicit prerequisites for resource/permission-dependent targets. Missing controls may reveal the owning region but must report that the specific target was not located. Only declared navigation controls may be clicked by inspection; check/update/restart share a stateful button and must never execute during locating. Validate visible animation in the installed GUI, including cached iframe HTML, clipped outlines, status overlays and narrow preview widths. Source markers consume registered IDs rather than a separately copied operation map.

Browser acceptance must select an entry from the catalog and verify the real GUI and highlight in the same page. A standalone adapter does not prove catalog integration. Command entries must not return GUI URLs.

Human catalog is an operation selector, not a second trace inspector. Left cards show semantic registration, source and provider-computed percentiles; selection shows source/Grafana link and real GUI/command. Never substitute trace-envelope sample percentiles for provider metrics. Keep analysis tools available to agents without adding their output to the human preview. Provider attribute configuration keeps Colab legacy field names out of generic defaults.

Source rendering must preserve registered object/component and function ownership, not only the file path. Multiple operations in one file are valid; inspect actual invocation ownership before changing paths. Anonymous callbacks name their containing hook/event rather than fabricated method names. GUI and source tools consume the same registration fields.

Product copy is English. Registry descriptions and embedded business content retain the project-authored language; never silently translate registry semantics in the viewer.

Shared React/shadcn UI lives in catalog/ui. scripts/workspace.mjs composes tracing dispatch and the regression service; rendering must not own business cases or records. Browser HTTP and MCP use this composition. Script drawers show current source, not an archived historical script; highlight.js escapes source before rendering. Performance statistics remain lazy, provider-computed, bounded to three concurrent queries.
