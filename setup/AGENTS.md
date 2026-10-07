# Setup implementation

Own Node runtime checks, locked dependency installation, local App builds and explicit source-directory updates. Do not silently upgrade npm dependencies, download unknown code, register host configuration, change credentials or install project dependencies.

package.json files is the distribution allowlist. Installed node_modules, generated App bundles and setup receipts/backups are local state. Stage source updates and verify them before touching the installed source. Keep future remote artifact verification here, not in consumer SKILL.md. Current backups cover managed source files; updates are not whole-directory atomic and interrupted updates require recovery.

Validated: local install/build/check and an isolated source-directory update passed. npm pack dry run produced about 31 KB with npm-shrinkwrap.json included; dependencies, generated bundles and .setup state excluded. Use npm-shrinkwrap.json because npm excludes package-lock.json from packed distributions.

Bootstrap entry is install.sh: POSIX shell plus curl/tar/SHA-256, then a private verified official Node runtime when required. Do not overwrite global Node or shell profiles. run.sh preserves the same runtime selection for later agent commands. README installation stays ahead of the case study.

Project setup owns only a marked root AGENTS.md dependency block and regression initialization assets. Preflight paths and markers before mutation, preserve existing registries and cases, and exclude the underscore-prefixed example from discovery. Do not copy installed runtime, node_modules, credentials or generic skill code into target repositories. Consumer guidance belongs in the template and SKILL.md; implementation rationale stays here.
