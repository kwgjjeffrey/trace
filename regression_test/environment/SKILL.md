---
name: trace-regression-environment
description: Bind project test resources, preflight requirements and inspect environment blockers.
---

Register environment.adapter, environment.profiles and an optional default in regression_test/regression.config.yaml; paths are relative to the registry. Profiles contain parameters only. Keep actual local bindings ignored and credentials in the project's existing authentication store.

Use environment_options to discover profile names and environment --environment <name> --params '<JSON>' to resolve bindings. Pass the same environment/params to plan and run; GUI and MCP use identical arguments. A new run rechecks conditions and records its chosen resources. It never silently substitutes a resource mid-run.

Each case may export literal REQUIREMENTS, e.g. {channel:{permission:'read'},agent:{state:'online',capability:'execute'}}. A project adapter exports async resolve({repo,parameters}) returning JSON resources and check({resources,parameters,requirements}) returning nonempty checks with explicit ready booleans and reasons. Both are read-only. Unsupported requirements must block. Scripts use ctx.resources and ctx.parameters; do not read a second config or hardcode resource IDs. Do not return credentials.

Missing or unavailable resources block before script execution. An execution failure after preflight still needs evidence-based diagnosis; never relabel a product failure automatically as an environment blocker. Provider/Agent end-to-end cases require actual execution when their expected outcome includes it.

The adapter resolve hook receives optional `requirements`, the union of resource kinds requested by selected cases. Skip unrelated expensive actor/provider probes when this list is present; standalone environment inspection leaves it undefined for complete discovery. Do not skip the selected resource checks.
