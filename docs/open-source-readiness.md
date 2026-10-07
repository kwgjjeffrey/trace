# Open-source acceptance — 2026-10-07

Product: Agent Dev Suite. Existing Trace distribution identifiers are retained for backward compatibility.

## Verified locally

- Public v0.3.3 bootstrap downloaded official GitHub release metadata, verified tag/source/size/SHA-256, installed dependencies, built the GUI and reported ready in a new isolated temporary directory on macOS arm64, Node 22.23.2. No existing installation or provider profile was changed.
- Live release-check matched v0.3.3 and its source commit/hash.
- Candidate v0.4.0: 38 tests passed, TypeScript check passed, browser/MCP frontend build passed and bootstrap shell syntax passed.
- Isolation tests prove missing config sends no provider request, custom query tenant/attribute is used, embedded URL credentials are rejected and dot/parent project IDs fail before writes.
- Package dry run includes the suite CLI alias and configuration/architecture docs. No node_modules, generated runtime, setup state, website or credential/connection files are included.
- Website inspected at 1280px; 390px layout has document width 390px with no horizontal overflow. Copy action displays success. Static deployment dry run includes only four intentional assets.

## Findings fixed

Trace search used a Colab-specific field while metrics already supported configured attributes. Both now use explicit `operationAttribute`, with generic `trace.entry.id` default. Configuration project IDs cannot select dot/parent paths. Direct query configuration validates endpoints and attributes before credential use. Product identity now describes the full suite, while compatibility identifiers preserve old upgrades.

## Remaining platform limits

Linux/WSL and missing-Node bootstrap were not re-executed in this macOS acceptance. CI defines Linux/macOS Node 22/24 checks; writing that workflow is not evidence of a green remote run. MCP stdio/browser tests do not prove embedded rendering in every agent host. No independent publisher signature is implemented. Activation uses staged validation and source backups, not whole-directory atomic replacement. No generic CI/deploy capability is shipped.

Further release and deployed-site evidence is recorded after publication, not inferred from the local checks above.

## Published acceptance

- v0.4.0 published from source `16d41a17bac343f0302f5155695405aed4ecb06d`, with source archive and checksum manifest.
- Isolated v0.3.3 → v0.4.0 staged source update passed, including build, tests and retained backup. Public artifact upgrade is checked separately.
- Website deployed to `agent-devops.zhiyuanwangluo.online`, Worker version `7a2aab2b-d775-46c6-b706-880033714100`. HTTPS returned 200 and public HTML matched source bytes.
- First remote CI exposed a missing generated MCP resource: tests must follow build in a clean checkout. CI and contribution instructions now build before testing.

- Public GitHub artifact upgrade v0.3.3 → v0.4.0 passed; readiness and release receipt match the published source/hash, and a source backup remains available. Post-upgrade check reports no update available.
- Corrected remote CI succeeded: https://github.com/kwgjjeffrey/trace/actions/runs/37633047092 (Linux/macOS, Node 22/24).
- Dependency audit found one moderate YAML advisory in 2.8.0; v0.4.1 updates to the compatible patched 2.9.1.
