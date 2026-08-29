create type "public"."hosting_type" as enum ('unknown', 'bisup');

alter table "public"."tech_stack_analysis" add column "hosting" "public"."hosting_type";

alter table "public"."tech_stack_analysis" add column "hosting_confidence" double precision;

create index "idx_tech_hosting" on "public"."tech_stack_analysis" using btree ("hosting", "hosting_confidence");

alter table "public"."tech_stack_analysis" add constraint "tech_stack_analysis_hosting_confidence_check" check ((("hosting_confidence" >= (0)::double precision) and ("hosting_confidence" <= (10)::double precision))) not valid;

alter table "public"."tech_stack_analysis" validate constraint "tech_stack_analysis_hosting_confidence_check";
