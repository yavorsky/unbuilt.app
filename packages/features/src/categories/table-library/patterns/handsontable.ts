export const handsontable = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/handsontable/, /\bHandsontable\b/],
    filenames: [/handsontable/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    documents: [/class="ht_master"/, /class="htCore"/, /class="handsontable"/],
  },
];
