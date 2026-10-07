---
name: trace-regression-cases
description: Author, discover and classify repository-owned regression cases.
---

Register recursive case directories in the project's regression_test/regression.config.yaml. Each .mjs script exports literal USECASE {name,description}, literal META and, when implemented, async function run(ctx). Omit run for a case awaiting script implementation: it remains discoverable and is excluded from execution. Do not add placeholder runners. Usecase description covers preconditions, actions and expected results. Keep the description and executable script together; discovery never executes the script.

Module is a slash-separated business capability path, such as context/sessions/reading. Define the project hierarchy from its cases; parent module filters include descendants. Keep GUI versus Skill in surface, not in the module hierarchy.

META requires id, module, surface(gui|skill|integration), priority(critical|normal|extended), origin(requirement|bug|acceptance-gap), status(trial|active|rotten|obsolete), effects(read-only|isolated-write|external-write), cost(fast|normal|slow). Optional covers, requires and affectedPaths are string arrays; rotten/obsolete cases require statusReason. Additional literal scalar/array metadata is available to filters.

Use cases to discover, source --id to inspect the real file, filter_options to inspect selection values and plan to verify execution scope. New cases start as trial. Normal regression includes trial and active. After a trial execution, whether green or red, inspect the actual actions, observed data, assertion boundaries and cleanup. Only after verifying the script behaves as intended, promote it with status --id <case-id> --status active --reason <review and Run/Round evidence>. A green result alone is not verification; a correctly verified failing script can become active. Review active execution evidence too before interpreting a failure as a product defect. Changed actions or assertions return the script to trial until reviewed.

Use status --id <case-id> --status rotten|obsolete --reason <diagnosis> only after confirming script rot or feature removal. Repair and validate rotten cases explicitly, then present the evidence to the human before restoring active status. Retain prior failures.

For systematic discovery, follow GUI/command entries through business outcomes, write cases and Module paths as you read, then consolidate the hierarchy; revisit only unresolved behavior. Start a case-only file from the project’s cases/_example.mjs, replacing its example values.

Reuse historical execution evidence before rerunning a trial: compare the executed script with current actions/assertions and relevant helper behavior, inspect actual evidence and cleanup, then qualify it with the existing Run/Round reference. Maturity-only metadata changes do not require execution. Rerun only changed behavior, missing evidence or unresolved preconditions; a full regression is the final acceptance step, not a script debugging loop.
