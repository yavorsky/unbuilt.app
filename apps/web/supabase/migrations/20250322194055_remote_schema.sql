create type "public"."analytics_type" as enum ('unknown', 'amplitude', 'fathom', 'googleAnalytics', 'matomo', 'mixpanel', 'plausible', 'umami', 'vercelAnalytics', 'clarity', 'hotjar');

alter table "public"."tech_stack_analysis" add column "analytics" analytics_type;

alter table "public"."tech_stack_analysis" add column "analytics_confidence" double precision;

CREATE INDEX idx_tech_analytics ON public.tech_stack_analysis USING btree (analytics, analytics_confidence);

alter table "public"."tech_stack_analysis" add constraint "tech_stack_analysis_analytics_confidence_check" CHECK (((analytics_confidence >= (0)::double precision) AND (analytics_confidence <= (10)::double precision))) not valid;

alter table "public"."tech_stack_analysis" validate constraint "tech_stack_analysis_analytics_confidence_check";


