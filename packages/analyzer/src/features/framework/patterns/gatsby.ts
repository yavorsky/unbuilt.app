import { Pattern } from "../../../types.js";

export const gatsby = [
  {
    score: 0.2,
    name: 'Runtime',
    runtime: [/gatsby-browser/, /gatsby-ssr/, /gatsby-config/, /gatsby-node/, /__GATSBY/],
  },
  {
    score: 0.2,
    name: 'Features',
    runtime: [/gatsby-link/, /StaticQuery/, /StaticImage/, /GatsbyImage/],
  },
  {
    score: 0.2,
    name: 'Markup',
    runtime: [/gatsby-resp-image/, /gatsby-image/],
  },
  {
    score: 0.2,
    name: 'Pages',
    runtime: [/useStaticQuery/, /graphql`/, /pageQuery/],
  },
  {
    score: 0.2,
    name: 'builds',
    runtime: [/\.cache\//, /public\//, /gatsby-config/, /gatsby-node/],
  },
  {
    score: 0.2,
    name: 'builds',
    runtime: [/createPages/, /onCreatePage/, /gatsby-plugin-page-creator/],
  },
  {
    score: 0.2,
    name: 'data',
    runtime: [/createPages/, /sourceNodes/, /createNode/],
  },
  {
    score: 0.2,
    name: 'ssr',
    runtime: [/gatsby-ssr/, /wrapRootElement/, /wrapPageElement/]
  },
];