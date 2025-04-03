alter type "public"."framework_type" rename to "framework_type__old_version_to_be_dropped";

create type "public"."framework_type" as enum ('unknown', 'astro', 'docusaurus', 'storybook', 'sveltekit', 'vitepress', 'vuepress', 'nuxt', 'next', 'remix', 'gatsby', 'tanstackStart');

alter table "public"."tech_stack_analysis" alter column framework type "public"."framework_type" using framework::text::"public"."framework_type";

drop type "public"."framework_type__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_unique_styling_library_websites(styling_library_value text, confidence_threshold double precision, search_term text, page_number integer, items_per_page integer)
 RETURNS TABLE(id uuid, url text, analyzed_at timestamp with time zone, confidence double precision, total_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  query text;
BEGIN
  query := '
    WITH latest_analysis AS (
      SELECT 
        ta.id,
        ta.url,
        ta.analyzed_at,
        ROW_NUMBER() OVER (PARTITION BY ta.url ORDER BY ta.analyzed_at DESC) AS rn
      FROM tech_stack_analysis ta
      WHERE ($3 IS NULL OR ta.url ILIKE ''%'' || $3 || ''%'')
    ),
    matching_styling_libraries AS (
      SELECT 
        la.id,
        la.url,
        la.analyzed_at,
        sl.confidence
      FROM latest_analysis la
      JOIN styling_libraries sl ON la.id = sl.analysis_id
      WHERE 
        la.rn = 1
        AND sl.library::text = $1::text
        AND sl.confidence >= $2
    ),
    filtered_records AS (
      SELECT * FROM matching_styling_libraries
    )
    SELECT 
      fr.id,
      fr.url,
      fr.analyzed_at,
      fr.confidence,
      (SELECT COUNT(*) FROM filtered_records) AS total_count
    FROM filtered_records fr
    ORDER BY fr.analyzed_at DESC
    LIMIT $4
    OFFSET $5';

  RETURN QUERY EXECUTE query
  USING 
    styling_library_value,
    confidence_threshold,
    search_term,
    items_per_page,
    (page_number - 1) * items_per_page;
END;
$function$
;


