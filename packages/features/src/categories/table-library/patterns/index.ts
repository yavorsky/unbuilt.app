import { tanstackTable } from './tanstack-table.js';
import { agGrid } from './ag-grid.js';
import { handsontable } from './handsontable.js';
import { reactVirtualized } from './react-virtualized.js';
import { reactWindow } from './react-window.js';
import { tanstackVirtual } from './tanstack-virtual.js';
import { reactVirtuoso } from './react-virtuoso.js';
import { reactTableLegacy } from './react-table-legacy.js';

export const patterns = {
  tanstackTable,
  agGrid,
  handsontable,
  reactVirtualized,
  reactWindow,
  tanstackVirtual,
  reactVirtuoso,
  reactTableLegacy,
} as const;
