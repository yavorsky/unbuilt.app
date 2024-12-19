export const swc = [
  {
    name: 'core' as const,
    score: 1,
    runtime: [
      // SWC's unique helper namespace
      /@swc\/helpers\//,
      /_swc_core__/,

      // SWC's unique runtime comments
      /\/\*\s*@__PURE__\s*\*\/\s*_swc_/,

      // SWC's specific package identifier
      /"@swc\/helpers":\s*"[^"]+"/,

      // SWC's unique module system marker
      /module\.exports\s*=\s*_swc_core__/,
    ],
  },
  {
    name: 'classFeatures' as const,
    score: 1,
    runtime: [
      // SWC's unique private field implementations
      /function\s*_class_private_field_loose_base\s*\(receiver,\s*privateKey\)\s*\{\s*if\s*\(!Object\.prototype\.hasOwnProperty\.call\s*\(receiver,\s*privateKey\)\)\s*\{\s*throw/,

      // SWC's unique private method initialization
      /function\s*_class_private_method_init\s*\(obj,\s*privateSet\)\s*\{\s*_class_extract_field_descriptor\s*\(obj,\s*privateSet\)/,

      // SWC's specific static private field access
      /function\s*_class_static_private_field_spec\s*\(receiver,\s*descriptor\)\s*\{\s*_class_check_private_static_access\s*\(receiver,\s*descriptor\)/,

      // SWC's unique private field key generation
      /function\s*_class_private_field_loose_key\s*\(name\)\s*\{\s*return\s*"__private_"\s*\+\s*name\s*\}/,
    ],
  },
  {
    name: 'transformFeatures' as const,
    score: 1,
    runtime: [
      // SWC's unique iterator implementation
      /function\s*_create_for_of_iterator_helper_loose\s*\(o\)\s*\{\s*var\s*i\s*=\s*0;\s*if\s*\(typeof\s*Symbol\s*===\s*"undefined"\)/,

      // SWC's specific spread implementation
      /function\s*_object_spread\s*\(target\)\s*\{\s*for\s*\(var\s*i\s*=\s*1;\s*i\s*<\s*arguments\.length;\s*i\+\+\)\s*\{\s*var\s*source\s*=\s*arguments\[i\]\s*!=\s*null\s*\?\s*arguments\[i\]\s*:\s*\{\}/,

      // SWC's unique TypeScript spread array implementation
      /function\s*_ts_spread_array\s*\(to,\s*from,\s*pack\)\s*\{\s*if\s*\(pack\s*\|\|\s*arguments\.length\s*===\s*2\)/,

      // SWC's unique decorator implementation
      /function\s*_ts_decorate\s*\(decorators,\s*target,\s*key,\s*desc\)\s*\{\s*var\s*c\s*=\s*arguments\.length/,
    ],
  },
];
