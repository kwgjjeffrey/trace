// Copy into cases/<business/module>/<scenario>.mjs and replace every example value.
// This underscore-prefixed template is not discovered. Omit run until a real script exists.
export const USECASE = {
  name: 'Read a shared document',
  description: `Purpose: verify that an authorized collaborator receives the intended content.
Preconditions: a disposable document and an authorized test account exist.
Actions: open the document through the supported user or command entry.
Expected results: the returned content matches the fixture and identifies its source.`,
};
export const META = {
  id: 'context.documents.read',
  module: 'context/documents/reading', // Business path; parent filters include descendants.
  surface: 'skill', // gui | skill | integration
  priority: 'critical', // critical | normal | extended
  origin: 'requirement', // requirement | bug | acceptance-gap
  status: 'trial', // Promote only after reviewing real execution, assertions and cleanup.
  effects: 'read-only', // isolated-write requires real disposable fixtures and scoped cleanup.
  parallelSafe: false, // Opt in only after reviewing all shared state, caches and cleanup.
  locks: [], // Stable names for shared actors, transport, sources or mutable fixtures.
  cost: 'fast', // Estimate until measured; never invent performance limits.
  covers: [], // Existing operation IDs, when registered; do not invent IDs.
  requires: [], // Match prerequisites explicitly configured in regression.config.yaml.
  affectedPaths: [], // Actual capability-owned repository-relative source paths.
};
