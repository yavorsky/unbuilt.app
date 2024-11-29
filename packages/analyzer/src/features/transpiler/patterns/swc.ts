export const swc = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core SWC markers and imports
      /@swc\/helpers/,
      /_swc_core/,
      /swc-loader/,
      /swcHelpers/,

      // Class transformations
      /_create_super/,
      /_class_call_check/,
      /_class_private_field_loose_key/,
      /_class_private_field_loose_base/,
      /_class_private_method_init/,
      /_class_private_field_get/,
      /_class_private_field_set/,
      /_class_static_private_field_spec_get/,
      /_class_static_private_field_spec_set/,
      /_define_property/,
      /_object_spread_props/,
      /_ts_decorate/,
      /_ts_metadata/,

      // Async transformations
      /_async_to_generator/,
      /_async_generator/,
      /_await_async_generator/,
      /_wrap_async_generator/,
      /_async_iterator/,
      /_async_to_generator/,

      // Object/Array helpers
      /_object_spread/,
      /_object_without_properties/,
      /_object_without_properties_loose/,
      /_extend/,
      /_to_consumable_array/,
      /_to_array/,
      /_sliced_to_array/,
      /_non_iterable_rest/,
      /_non_iterable_spread/,

      // Module transformations
      /_interop_require_default/,
      /_interop_require_wildcard/,
      /_type_of/,
      /_create_for_of_iterator_helper_loose/,
      /_jsx/,
      /_tagged_template_literal/,
      /_template_object/,
      /_throw/,

      // Common minified patterns
      /__swc_helpers__/,
      /swc_runtime/,
      /_swc_/,
      /\$[a-zA-Z0-9]+\$[0-9]+/,  // SWC's unique variable naming pattern

      // Build comments and sourcemaps
      /\/\*\s*SWC_[A-Z_]+\s*\*\//,
      /\/\/# sourceMappingURL=.*\.map.*swc/,

      // Private class features
      /#[a-zA-Z0-9_]+/,
      /WeakMap\(\)/,
      /WeakSet\(\)/,

      // Decorators
      /_decorate/,
      /_param/,
      /_metadata/,
      /_create_class/,

      // React/JSX specific transforms
      /_jsx_runtime/,
      /_jsxs/,
      /_jsx_dev_runtime/,
      /_fragment/,

      // TypeScript-like transforms
      /_ts_generator/,
      /_ts_values/,
      /_ts_read/,
      /_ts_rest/,
      /_ts_spread/,
      /_ts_spread_array/,

      // Error handling
      /_catch_error/,
      /_construct/,
      /_set/,
      /_set_prototype_of/,

      // Development tools
      /_dev/,
      /_debug/,
      /process\.env\.NODE_ENV/
    ]
  }
]
