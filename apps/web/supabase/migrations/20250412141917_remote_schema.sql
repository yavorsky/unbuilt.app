create type "public"."error_tracking_type" as enum ('sentry', 'datadog', 'rollbar', 'raygun');

alter table "public"."tech_stack_analysis" add column "error_tracking" error_tracking_type;

alter table "public"."tech_stack_analysis" add column "error_tracking_confidence" double precision;

CREATE INDEX idx_tech_error_tracking ON public.tech_stack_analysis USING btree (error_tracking, error_tracking_confidence);

alter table "public"."tech_stack_analysis" add constraint "tech_stack_analysis_error_tracking_confidence_check" CHECK (((error_tracking_confidence >= (0)::double precision) AND (error_tracking_confidence <= (10)::double precision))) not valid;

alter table "public"."tech_stack_analysis" validate constraint "tech_stack_analysis_error_tracking_confidence_check";


