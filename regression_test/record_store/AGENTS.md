# Capability development

Keep consumer procedures in SKILL.md. Record implementation decisions and invariants here. Business cases and output data remain in the target repository.

Run grouping uses execution snapshots' runId and roundNumber. A legacy execution is its own root. Never rewrite old cases/counts while rechecking. run_record returns raw rounds plus latest non-excluded per-case evidence and provenance. No generated Report document: GUI Ask Agent uses the same structured service. Duration in history is cumulative execution time, individual round duration is runner wall time.

History lists use derived summary.json sidecars, bound to each atomically saved YAML by size/mtime/inode. Sidecars contain list metadata only; YAML remains the authoritative execution evidence. Legacy or externally changed records rebuild their summary on demand; list grouping never reparses full case evidence. Detail reads load only the selected Run’s snapshots. Capture the file signature before parsing so a concurrent writer cannot stamp old data as a fresh index.
