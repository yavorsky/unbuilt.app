export const opentelemetry = [
  {
    name: 'vars' as const,
    score: 1,
    scripts: [
      /OTEL_EXPORTER_OTLP_(?:TRACES_|METRICS_|LOGS_)?ENDPOINT:\s*['"']([^'"']*)['"']/,
      /OTEL_SERVICE_NAME:/,
      /OTEL_PROPAGATORS:/,
      /OTEL_EXPORTER_OTLP_/,
      /OTEL_EXPORTER_ZIPKIN_ENDPOINT:/,
      /OTEL_EXPORTER_JAEGER_/,
      /OTEL_(?:BSP|BLRP)_SCHEDULE_DELAY:/,
    ],
  },
  {
    name: 'errors' as const,
    score: 1,
    scripts: [
      /Error\(['"']@opentelemetry\/api: Attempted duplicate registration of API: ['"']\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\)/,
      /Error\(['"']@opentelemetry\/api: Registration of version v/,
      /['"']@opentelemetry\/api: Registered a global for/,
      /['"']@opentelemetry\/api: Unregistering a global for/,
      /Error\(['"']Cannot use diag as the logger for itself\. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation['"']\)/,
    ],
  },
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      /Symbol\.for\(['"']OpenTelemetry Context Key SPAN['"']\)/,
      /this\._provider\.getDelegateTracer\(this\.name, this\.version, this\.options\)/,
      /\[ATTR_TELEMETRY_SDK_NAME\]:\s*['"']opentelemetry['"']/,
      /this\._meterSharedState\.observableRegistry/,
      /this\._meterSharedState\.registerAsyncMetricStorage/,
      /this\._meterSharedState\.observableRegistry\.addBatchCallback/,
      /INT value type cannot accept a floating-point value for/,
      /this\.metricStorageRegistry\.findOrUpdateCompatibleCollectorStorage/,
      /Reflect\.apply\([a-zA-Z_$][a-zA-Z0-9_$]*\.startActiveSpan, [a-zA-Z_$][a-zA-Z0-9_$]*, arguments\)/,
    ],
  },
  {
    name: 'sources' as const,
    score: 1.2,
    filenames: [/opentelemetry\.js\.api/],
  },
];
