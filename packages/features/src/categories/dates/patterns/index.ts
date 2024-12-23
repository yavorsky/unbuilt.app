import { dateFns } from './date-fns.js';
import { dayJs } from './day-js.js';
import { luxon } from './luxon.js';
import { moment } from './moment.js';

export const patterns = {
  moment,
  dateFns,
  dayJs,
  luxon,
} as const;
