import * as cssInJsMeta from './meta/css-in-js/index.js';
import * as preprocessorMeta from './meta/preprocessor/index.js';

// Combine 2 types into 1 for consistency
export const meta = {
  ...cssInJsMeta,
  ...preprocessorMeta,
};

export * from './detect.js';
export * from './meta/css-in-js/index.js';
export * from './meta/preprocessor/index.js';
export * from './patterns/css-in-js/index.js';
export * from './patterns/preprocessor/index.js';
