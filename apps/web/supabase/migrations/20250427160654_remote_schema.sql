alter type "public"."monitoring_type" rename to "monitoring_type__old_version_to_be_dropped";

create type "public"."monitoring_type" as enum ('sentry', 'datadog', 'rollbar', 'raygun', 'newrelic', 'trackjs', 'bugsnag', 'logentries', 'airbrake', 'honeybadger', 'loggly', 'dynatrace', 'appoptics', 'atatus', 'elasticapm', 'glitchtip', 'instana', 'stackdriver', 'unknown', 'appdynamics', 'vercelSpeedInsights', 'opentelemetry');

alter type "public"."platform_type" rename to "platform_type__old_version_to_be_dropped";

create type "public"."platform_type" as enum ('unknown', 'shopify', 'squarespace', 'webflow', 'wix', 'wordpress', 'weebly', 'framer', 'webstudio');

alter table "public"."tech_stack_analysis" alter column monitoring type "public"."monitoring_type" using monitoring::text::"public"."monitoring_type";

alter table "public"."tech_stack_analysis" alter column platform type "public"."platform_type" using platform::text::"public"."platform_type";

drop type "public"."monitoring_type__old_version_to_be_dropped";

drop type "public"."platform_type__old_version_to_be_dropped";


