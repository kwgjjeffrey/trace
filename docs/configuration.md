# Provider configuration and data ownership

Nothing in an installation configures or enables an application exporter. Tracing registration and regression execution work without a provider. Query commands fail clearly without explicit configuration.

## Configure queries

Create a private JSON input outside your repository, then pipe it to the setup command. Never put tokens in shell arguments, Git or prompts:

```sh
node <suite>/setup/setup.mjs configure < /private/provider-input.json
```

Input shape (replace all placeholders with your own deployment):

```json
{
  "project": "my-project",
  "queryEndpoint": "https://YOUR-TEMPO-ENDPOINT/tempo",
  "queryInstanceId": "YOUR-QUERY-TENANT",
  "token": "YOUR-QUERY-TOKEN",
  "grafanaUrl": "https://YOUR-GRAFANA",
  "datasourceUid": "YOUR-TEMPO-DATASOURCE",
  "operationAttribute": "trace.entry.id",
  "otlpEndpoint": "https://YOUR-OTLP-COLLECTOR",
  "instanceId": "YOUR-EXPORT-TENANT"
}
```

`queryEndpoint`, `queryInstanceId` and `token` are required. Optional OTLP fields are connection metadata only: configure your application's SDK/exporter separately with a dedicated write credential. Query credentials must not be reused implicitly for export. The current query adapter supports HTTPS Tempo with Basic tenant/token authentication; unauthenticated local Tempo and other auth mechanisms are not implemented by this helper.

The command returns the connection file path, never the token. It writes `connection.json` and a separate `credentials.json` with mode 0600, under a mode-0700 per-project directory at `~/.config/trace/<project>/`. Existing files for that project are replaced only by this explicit configure action. Unique project IDs isolate connection profiles.

```sh
node <suite>/agent-dev.mjs operations --repo /path/to/project
node <suite>/agent-dev.mjs executions --repo /path/to/project --operation example.open --config /private/connection.json
```

Existing `TRACE_CONFIG` remains supported. There is no automatic search for the maintainer's connection profile. For an older integration, set `operationAttribute` (for example, `colab.operation`) explicitly; generic defaults use `trace.entry.id`.

## Configure export in your application

The application owns initialization of its official OpenTelemetry SDK, collector endpoint, export headers, consent, redaction and lifecycle. `instrumentation/assets/otel.mjs` creates spans through the API and contains no exporter or destination. Keep tracing disabled until your project explicitly initializes an exporter. Inject endpoint/write credentials through your deployment's secret manager or ignored local environment configuration. Never copy a case study's provider values.

## Data boundaries

- GitHub is contacted for installation and update metadata/artifacts; Node.js distribution is contacted if runtime bootstrap is needed; npm supplies locked dependencies.
- Your configured Tempo receives query requests and its credentials. The human Grafana browser uses its own login.
- Business regression scripts may perform project-defined external writes; review their environment contract and runner authorization before execution.
- Prompt content can contain sensitive data. Trace listings omit bodies; selected prompt retrieval is explicit. Your project owns capture and redaction policy.
- The website is a static presentation. It does not accept or collect trace data.
