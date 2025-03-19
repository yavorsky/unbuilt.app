drop function if exists "public"."get_unique_technologies_count"(confidence_threshold double precision, technology_column text, search_term text);

alter type "public"."state_management_type" rename to "state_management_type__old_version_to_be_dropped";

create type "public"."state_management_type" as enum ('unknown', 'effector', 'jotai', 'mobx', 'ngrx', 'pinia', 'recoil', 'redux', 'valtio', 'zustand', 'xState', 'tanstackQuery');

alter table "public"."tech_stack_analysis" alter column state_management type "public"."state_management_type" using state_management::text::"public"."state_management_type";

drop type "public"."state_management_type__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_technology_trends(technology_column text, start_date timestamp with time zone, end_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP, confidence_threshold double precision DEFAULT 0.5)
 RETURNS TABLE(date text, technologies jsonb, total_analyzed bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  query text;
  date_series record;
  current_date_timestamp timestamp with time zone;
  current_date_string text;
  baseline_data jsonb;
  baseline_total bigint;
  day_entries record;
  tech_counts jsonb;
  tech_rec record;
  result_records text[];
  i integer := 0;
  seen_urls text[];
BEGIN
  -- Initialize seen_urls array to track URLs we've already counted
  seen_urls := ARRAY[]::text[];

  -- Calculate historical baseline (before start_date)
  query := format(
    'WITH ranked_records AS (
      SELECT 
        ta.%I::text AS tech_value,
        ta.%I_confidence AS confidence,
        ta.url,
        ROW_NUMBER() OVER (PARTITION BY ta.url ORDER BY ta.analyzed_at DESC) AS rn
      FROM tech_stack_analysis ta
      WHERE 
        ta.%I_confidence >= $1
        AND ta.analyzed_at < $2
        AND ta.%I != ''unknown''
    ),
    filtered_records AS (
      SELECT * FROM ranked_records WHERE rn = 1
    ),
    tech_counts AS (
      SELECT 
        tech_value,
        COUNT(*) AS count
      FROM filtered_records
      GROUP BY tech_value
    )
    SELECT 
      jsonb_object_agg(tc.tech_value, tc.count) AS tech_counts,
      (SELECT COUNT(*) FROM filtered_records) AS total_count,
      array_agg(fr.url) AS seen_urls
    FROM tech_counts tc
    CROSS JOIN (SELECT DISTINCT url FROM filtered_records) fr',
    technology_column,
    technology_column,
    technology_column,
    technology_column
  );

  EXECUTE query INTO baseline_data, baseline_total, seen_urls
  USING confidence_threshold, start_date;
  
  -- Initialize default values if no historical data
  IF baseline_data IS NULL THEN
    baseline_data := '{}'::jsonb;
    baseline_total := 0;
  END IF;
  
  -- If seen_urls is null, initialize it as empty array
  IF seen_urls IS NULL THEN
    seen_urls := ARRAY[]::text[];
  END IF;

  -- Create arrays to store our result set
  result_records := ARRAY[]::text[];
  
  -- For each day in the date range
  FOR date_series IN 
    SELECT date_trunc('day', dd)::timestamp with time zone AS day
    FROM generate_series(start_date, end_date, '1 day'::interval) dd
  LOOP
    current_date_timestamp := date_series.day;
    current_date_string := to_char(current_date_timestamp, 'YYYY-MM-DD');
    
    -- Get entries for this day, ensuring we only count unique URLs that we haven't seen before
    query := format(
      'WITH ranked_day_entries AS (
        SELECT 
          %I::text AS tech_value,
          url,
          ROW_NUMBER() OVER (PARTITION BY url ORDER BY analyzed_at DESC) AS rn
        FROM tech_stack_analysis
        WHERE analyzed_at >= $1 
          AND analyzed_at < $2
          AND %I_confidence >= $3
          AND %I != ''unknown''
          AND NOT (url = ANY($4))  -- Exclude already seen URLs
      ),
      day_entries AS (
        SELECT tech_value, url
        FROM ranked_day_entries
        WHERE rn = 1
      ),
      tech_counts AS (
        SELECT 
          tech_value,
          COUNT(*) AS count
        FROM day_entries
        GROUP BY tech_value
      )
      SELECT 
        jsonb_object_agg(tc.tech_value, tc.count) AS day_techs,
        (SELECT COUNT(*) FROM day_entries) AS day_count,
        array_agg(de.url) AS new_urls
      FROM tech_counts tc
      CROSS JOIN (SELECT DISTINCT url FROM day_entries) de',
      technology_column,
      technology_column,
      technology_column
    );
    
    EXECUTE query INTO day_entries 
    USING current_date_timestamp, current_date_timestamp + interval '1 day', confidence_threshold, seen_urls;
    
    -- Update running totals
    IF day_entries.day_techs IS NOT NULL THEN
      -- Add new urls to seen_urls array
      IF day_entries.new_urls IS NOT NULL THEN
        seen_urls := array_cat(seen_urls, day_entries.new_urls);
      END IF;
      
      -- For each technology in day's entries, update baseline
      FOR tech_rec IN SELECT key AS tech_name, value AS tech_count FROM jsonb_each_text(day_entries.day_techs)
      LOOP
        IF baseline_data ? tech_rec.tech_name THEN
          baseline_data := jsonb_set(
            baseline_data, 
            ARRAY[tech_rec.tech_name], 
            to_jsonb(COALESCE((baseline_data ->> tech_rec.tech_name)::bigint, 0) + tech_rec.tech_count::bigint)
          );
        ELSE
          baseline_data := baseline_data || jsonb_build_object(tech_rec.tech_name, tech_rec.tech_count);
        END IF;
      END LOOP;
      
      baseline_total := baseline_total + COALESCE(day_entries.day_count, 0);
    END IF;
    
    -- Only add dates after we have data
    IF baseline_total > 0 THEN
      -- Convert counts to percentages
      tech_counts := '{}'::jsonb;
      
      FOR tech_rec IN SELECT key AS tech_name, value AS tech_count FROM jsonb_each_text(baseline_data)
      LOOP
        tech_counts := tech_counts || jsonb_build_object(
          tech_rec.tech_name, 
          jsonb_build_object(
            'count', (baseline_data ->> tech_rec.tech_name)::bigint,
            'percentage', round(((baseline_data ->> tech_rec.tech_name)::numeric / baseline_total::numeric * 100)::numeric, 1)
          )
        );
      END LOOP;
      
      -- Add to our result set
      i := i + 1;
      RETURN QUERY SELECT 
        current_date_string, 
        tech_counts,
        baseline_total;
    END IF;
  END LOOP;

  -- If we didn't return any rows above, return an empty result set
  IF i = 0 THEN
    RETURN;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_unique_technologies_count(confidence_threshold double precision, technology_column text, search_term text DEFAULT NULL::text, start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, end_date timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(technology_value text, count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  query text;
BEGIN
  query := format(
    'WITH ranked_records AS (
      SELECT 
        ta.%I::text AS tech_value,
        ta.%I_confidence AS confidence,
        ta.url,
        ROW_NUMBER() OVER (PARTITION BY ta.url ORDER BY ta.analyzed_at DESC) AS rn
      FROM tech_stack_analysis ta
      WHERE 
        ta.%I_confidence >= $1
        AND ($3 IS NULL OR ta.url ILIKE ''%%'' || $3 || ''%%'')
        AND ($4 IS NULL OR ta.analyzed_at >= $4)
        AND ($5 IS NULL OR ta.analyzed_at < $5)
    ),
    filtered_records AS (
      SELECT * FROM ranked_records WHERE rn = 1
    )
    SELECT 
      fr.tech_value AS technology_value,
      COUNT(*) AS count
    FROM filtered_records fr
    GROUP BY fr.tech_value
    ORDER BY count DESC',
    technology_column,
    technology_column,
    technology_column
  );

  RETURN QUERY EXECUTE query
  USING 
    confidence_threshold,
    technology_column,
    search_term,
    start_date,
    end_date;
END;
$function$
;


