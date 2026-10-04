# Setup implementation

Own Node runtime checks, locked dependency installation, local App builds and explicit source-directory updates. Do not silently upgrade npm dependencies, download unknown code, register host configuration, change credentials or install project dependencies.

package.json files is the distribution allowlist. Installed node_modules, generated App bundles and setup receipts/backups are local state. Stage source updates and verify them before touching the installed source. Keep future remote artifact verification here, not in consumer SKILL.md. Current backups cover managed source files; updates are not whole-directory atomic and interrupted updates require recovery.

Validated: local install/build/check and an isolated source-directory update passed. npm pack dry run produced about 31 KB with npm-shrinkwrap.json included; dependencies, generated bundles and .setup state excluded. Use npm-shrinkwrap.json because npm excludes package-lock.json from packed distributions.
