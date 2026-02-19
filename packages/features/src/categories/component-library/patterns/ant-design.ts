export const antDesign = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/antd/, /ant-design/],
    filenames: [/antd/, /ant-design/],
    stylesheets: [/antd/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/class="ant-/, /class="ant-btn/, /class="ant-layout/, /class="ant-table/, /class="ant-modal/],
  },
];
