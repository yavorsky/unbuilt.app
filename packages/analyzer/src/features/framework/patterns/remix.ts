import { Pattern } from '../../../types.js';

export const remix = [
  {
    score: 0.2,
    name: 'Runtime',
    runtime: [
      /@remix-run\/react/,
      /@remix-run\/node/,
      /remix\.config/,
      /entry\.client/,
      /entry\.server/,
    ]
  },
  {
    score: 0.1,
    name: 'Components',
    runtime: [
      /Form|Link|Meta|Links|Scripts|LiveReload/,
      /ScrollRestoration|useSubmit/,
      /Outlet/,
    ]
  },
  {
    score: 0.2,
    name: 'markup',
    runtime: [/data-remix-/, /remix-prefix-/]
  },
  {
    score: 0.2,
    name: 'Features',
    runtime: [/useLoaderData|useActionData/, /useFetcher|useTransition/, /useMatches|useParams/]
  },
  {
    score: 0.2,
    name: 'Builds',
    runtime: [/remix\.config\.js/, /\.cache\/build/, /build\/index\.js/]
  },
  {
    score: 0.2,
    name: 'Routing',
    runtime: [
      /\[\$\w+\]\.tsx?/, // resource routes
      /\[\.\.\.\w+\]\.tsx?/, // catch-all routes
      /\[\w+\]\.tsx?/, // dynamic routes
    ]
  },
  {
    score: 0.2,
    name: 'Data',
    runtime: [/loader|action/, /headers|redirect/, /json|redirect/]
  },
  {
    score: 0.2,
    name: 'ssr',
    runtime: [/entry\.server/, /handleRequest/, /handleDataRequest/]
  },
];