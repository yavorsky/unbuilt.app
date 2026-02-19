export const agGrid = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/ag-grid-community/, /ag-grid-enterprise/, /ag-grid-react/, /ag-grid-angular/, /ag-grid-vue/],
    filenames: [/ag-grid/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/class="ag-root-wrapper"/, /class="ag-theme-/, /ag-header-cell/, /ag-body-viewport/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.7,
    scripts: [/AgGridReact/, /AgGridVue/, /AgGridAngular/, /gridOptions\s*=/, /columnDefs\s*:/],
  },
];
