alter type "public"."styling_library_type" rename to "styling_library_type__old_version_to_be_dropped";

create type "public"."styling_library_type" as enum ('unknown', 'antDesign', 'bootstrap', 'chakra', 'foundation', 'lucide', 'mui', 'shadcn', 'tailwindCSS', 'radix');

alter table "public"."styling_libraries" alter column library type "public"."styling_library_type" using library::text::"public"."styling_library_type";

drop type "public"."styling_library_type__old_version_to_be_dropped";


