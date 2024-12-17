// All features we support
export * as bundler from './categories/bundler/index.js';
export * as framework from './categories/framework/index.js';
export * as minifier from './categories/minifier/index.js';
export * as stylingProcessor from './categories/styling-processor/index.js';
export * as modules from './categories/modules/index.js';
export * as uiLibrary from './categories/ui-library/index.js';
export * as stateManagement from './categories/state-management/index.js';
export * as httpClient from './categories/http-client/index.js';
export * as router from './categories/router/index.js';
export * as translations from './categories/translations/index.js';
export * as dates from './categories/dates/index.js';
export * as stylingLibraries from './categories/styling-libraries/index.js';
export * as transpiler from './categories/transpiler/index.js';

// Utils to calculate results
export * from './utils/index.js';

// Additional metadata we can extract during analysis
export { getStats } from './get-stats.js';
