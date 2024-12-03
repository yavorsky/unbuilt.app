export const swc = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Core SWC markers
      /__swc_helpers__/,
      /_swc_/,
      /\/\*\s*SWC_[A-Z_]+\s*\*\//,
    ],
  },
  {
    name: 'class-transforms' as const,
    score: 0.9,
    runtime: [
      // SWC's unique class implementation
      /_class_private_field_loose_key/,
      /_class_private_field_loose_base/,
      /_class_private_method_init/,
      /_class_static_private_field_spec_get/,
      /_class_static_private_field_spec_set/,
    ],
  },
  {
    name: 'helpers' as const,
    score: 0.8,
    runtime: [
      // SWC-specific helper functions
      /_create_for_of_iterator_helper_loose/,
      /_object_spread_props/,
      /_ts_spread_array/,
      /_ts_decorate/,
      /_ts_metadata/,
    ],
  },
  {
    name: 'variable-patterns' as const,
    score: 0.7,
    runtime: [
      // SWC's unique variable naming patterns
      /\$[a-zA-Z0-9]+\$[0-9]+/,
    ],
  },
];
