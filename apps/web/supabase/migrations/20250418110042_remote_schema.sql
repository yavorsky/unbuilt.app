alter type "public"."error_tracking_type" rename to "error_tracking_type__old_version_to_be_dropped";

create type "public"."error_tracking_type" as enum ('sentry', 'datadog', 'rollbar', 'raygun', 'newrelic', 'airbrake', 'tackjs', 'logrocket', 'bugsnag');

alter table "public"."tech_stack_analysis" alter column error_tracking type "public"."error_tracking_type" using error_tracking::text::"public"."error_tracking_type";

drop type "public"."error_tracking_type__old_version_to_be_dropped";


