// All features we support
export * as bundler from './categories/bundler/index.js';
export * as bundlerMeta from './categories/bundler/meta/index.js';

export * as framework from './categories/framework/index.js';
export * as frameworkMeta from './categories/framework/meta/index.js';

export * as minifier from './categories/minifier/index.js';
export * as minifierMeta from './categories/minifier/meta/index.js';

export * as stylingProcessor from './categories/styling-processor/index.js';
export * as stylingProcessorMeta from './categories/styling-processor/meta/index.js';

export * as modules from './categories/modules/index.js';
export * as modulesMeta from './categories/modules/meta/index.js';

export * as uiLibrary from './categories/ui-library/index.js';
export * as uiLibraryMeta from './categories/ui-library/meta/index.js';

export * as stateManagement from './categories/state-management/index.js';
export * as stateManagementMeta from './categories/state-management/meta/index.js';

export * as httpClient from './categories/http-client/index.js';
export * as httpClientMeta from './categories/http-client/meta/index.js';

export * as router from './categories/router/index.js';
export * as routerMeta from './categories/router/meta/index.js';

export * as translations from './categories/translations/index.js';
export * as translationsMeta from './categories/translations/meta/index.js';

export * as dates from './categories/dates/index.js';
export * as datesMeta from './categories/dates/meta/index.js';

export * as stylingLibraries from './categories/styling-libraries/index.js';
export * as stylingLibrariesMeta from './categories/styling-libraries/meta/index.js';

export * as transpiler from './categories/transpiler/index.js';
export * as transpilerMeta from './categories/transpiler/meta/index.js';

export * as platform from './categories/platform/index.js';
export * as platformMeta from './categories/platform/meta/index.js';

export * as analytics from './categories/analytics/index.js';
export * as analyticsMeta from './categories/analytics/meta/index.js';

export * as errorTracking from './categories/error-tracking/index.js';
export * as errorTrackingMeta from './categories/error-tracking/meta/index.js';

// Utils to calculate results
export * from './detector/index.js';

// Additional metadata we can extract during analysis
export { getStats } from './get-stats.js';
export * from './types/index.js';
