# Regression performance implementation

This module owns trace execution linkage, root sample selection and deferred performance assertions. Provider transport stays in analysis; operation metadata stays in the host registry; runtime SDK installation stays in host environment bindings. Default vocabulary is provider-neutral Trace attributes. Colab legacy vocabulary belongs in its regression configuration.

The worker observes GUI request context and uses the host's existing CLI propagation parameter. It does not create a second business instrumentation system. Parent context for source CLI tests is a correlation carrier, not a fabricated performance span. Do not infer trace identity from a broad time-window search. Query failures remain diagnostics; declared budgets cannot pass without evidence.

Raw root samples are frozen with the case result. Source queries strip prompt payloads; credentials never enter results. List statistics and budget checks share record_store/performance.mjs. Terminal root duration is not trace-envelope min/max or nested duration sums. Deferred checks must run even after successful functional assertions, and failure evidence must remain immutable.

Real Colab GUI and Skill verification saved 13 samples in Round 20261008T072817Z-90bc1801. The initial source CLI lacked its artifact's OTel dependencies; private dependency binding repaired it without vendoring the skill or changing product instrumentation. Do not assume source and installed artifact dependency environments are equivalent.
