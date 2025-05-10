alter table "public"."tech_stack_analysis" drop constraint "tech_stack_analysis_error_tracking_confidence_check";

drop index if exists "public"."idx_tech_error_tracking";

alter type "public"."monitoring_type" rename to "monitoring_type__old_version_to_be_dropped";

create type "public"."monitoring_type" as enum ('sentry', 'datadog', 'rollbar', 'raygun', 'newrelic', 'trackjs', 'bugsnag', 'logentries', 'airbrake', 'honeybadger', 'loggly', 'dynatrace', 'appoptics', 'atatus', 'elasticapm', 'glitchtip', 'instana', 'stackdriver', 'unknown');

alter table "public"."tech_stack_analysis" alter column monitoring type "public"."monitoring_type" using monitoring::text::"public"."monitoring_type";

drop type "public"."monitoring_type__old_version_to_be_dropped";

alter table "public"."tech_stack_analysis" drop column "error_tracking";

alter table "public"."tech_stack_analysis" drop column "error_tracking_confidence";


