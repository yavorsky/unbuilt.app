alter type "public"."analytics_type" rename to "analytics_type__old_version_to_be_dropped";

create type "public"."analytics_type" as enum ('unknown', 'amplitude', 'fathom', 'googleAnalytics', 'matomo', 'mixpanel', 'plausible', 'umami', 'vercelAnalytics', 'clarity', 'hotjar', 'posthog', 'splitbee');

alter table "public"."tech_stack_analysis" alter column analytics type "public"."analytics_type" using analytics::text::"public"."analytics_type";

drop type "public"."analytics_type__old_version_to_be_dropped";


