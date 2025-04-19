create type "public"."monitoring_type" as enum ('sentry', 'datadog', 'rollbar', 'raygun', 'newrelic', 'trackjs', 'bugsnag', 'logentries', 'airbrake', 'honeybadger', 'loggly', 'dynatrace', 'appoptics', 'atatus', 'elasticapm', 'glitchtip', 'instana', 'stackdriver');

alter table "public"."tech_stack_analysis" add column "monitoring" monitoring_type;

alter table "public"."tech_stack_analysis" add column "monitoring_confidence" double precision;

CREATE INDEX idx_tech_monitoring ON public.tech_stack_analysis USING btree (monitoring, monitoring_confidence);

alter table "public"."tech_stack_analysis" add constraint "tech_stack_analysis_monitoring_confidence_check" CHECK (((monitoring_confidence >= (0)::double precision) AND (monitoring_confidence <= (10)::double precision))) not valid;

alter table "public"."tech_stack_analysis" validate constraint "tech_stack_analysis_monitoring_confidence_check";


