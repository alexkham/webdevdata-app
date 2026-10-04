// content/reference/javascript/methods/date-getters.js
//
// One page for the local-time part getters: getFullYear, getMonth, getDate,
// getDay, getHours, getMinutes, getSeconds, getMilliseconds and the
// deprecated getYear. They are one API with one indexing trap.

export const meta = {
  slug:        'date-getters',
  name:        'Date getters (getMonth, getDate, getDay…)',
  signature:   'date.getFullYear(), date.getMonth(), date.getDate(), date.getDay()…',
  blurb:       'getMonth is 0-indexed and getDate is 1-indexed — in the same object.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date getMonth getDate getDay getFullYear getHours getMinutes getSeconds getMilliseconds getYear zero indexed month local time javascript',
};

export const method = {
  slug:      'date-getters',
  name:      'Date getters (getMonth, getDate, getDay…)',
  signature: 'date.getFullYear(), date.getMonth(), date.getDate(), date.getDay()…',
  returns:   { type: 'number', desc: 'The requested component in the LOCAL timezone of whoever runs the code. NaN for an invalid Date, rather than an error.' },

  category:    'Date methods',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Nine methods that read the parts of a date. Two things to hold onto: months count from zero while days of the month count from one, and every one of these is local time.',

  cheat: {
    commonCall: 'd.getMonth() + 1',
    returns:    'a number, local to the runtime',
    replaces:   'string slicing of a formatted date',
    watchOut:   'getMonth is 0–11; getDate is 1–31; getDay is the WEEKDAY',
  },

  parameters: [],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'an ISO date, e.g. 2026-03-15T12:00:00Z', input: 'text' },
  ],
  demoTemplate: '(d => [d.getFullYear(), d.getMonth(), d.getDate(), d.getDay()])(new Date({iso}))',
  cases: [
    { id: 'march',  label: 'March → month 2 (!)',   values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'jan',    label: 'January → month 0 (!)', values: { iso: '2026-01-01T12:00:00Z' } },
    { id: 'dec',    label: 'December → month 11',   values: { iso: '2026-12-25T12:00:00Z' } },
    { id: 'invalid',label: 'invalid date → NaN',    values: { iso: 'nonsense' } },
  ],
  demoExplainer: "The four numbers are [year, month, date, day]. Look at the first case: a date in MARCH reports month 2, because getMonth counts from zero — while getDate reports 15, counting from one. Two adjacent methods on the same object with different bases, which is why so much date code is off by one month. The fourth number is getDay, the day of the WEEK (0 is Sunday), not the day of the month — another pair of confusingly similar names. An invalid date gives NaN from every getter rather than throwing.",

  patterns: [
    {
      name: 'Format a date manually',
      desc: 'The +1 that every codebase contains.',
      code: "const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;",
    },
    {
      name: 'Name the weekday',
      desc: 'getDay indexes an array of names.',
      code: "const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];\nDAYS[d.getDay()];",
    },
    {
      name: 'Let Intl format it instead',
      desc: 'No arithmetic, and locale-correct.',
      code: "d.toLocaleDateString('en-GB', {month: 'long'});",
    },
  ],

  examples: [
    { title: 'March is 2',        code: "new Date('2026-03-15T12:00:00Z').getUTCMonth()", returns: '2' },
    { title: 'But the date is 15',code: "new Date('2026-03-15T12:00:00Z').getUTCDate()",  returns: '15' },
    { title: 'getDay is the weekday', code: "new Date('2026-03-15T12:00:00Z').getUTCDay()", returns: '0   // Sunday' },
    { title: 'December is 11',    code: "new Date('2026-12-25T12:00:00Z').getUTCMonth()", returns: '11' },
    { title: 'Invalid gives NaN', code: "new Date('nonsense').getMonth()",                returns: 'NaN' },
    { title: 'getYear is year − 1900', code: "new Date('2026-03-15T12:00:00Z').getYear()", returns: '126' },
  ],

  pitfalls: [
    {
      name: 'getMonth is zero-based, getDate is not',
      desc: 'The defining Date bug. Months run 0 to 11 and days of the month run 1 to 31, on the same object. Every manual format needs a +1 on the month and nothing on the date, and forgetting it produces a date one month early that still looks plausible.',
      wrong: { label: 'A month early', code: "`${d.getUTCMonth()}/${d.getUTCDate()}`", output: "'2/15' for 15 March" },
      fix:   { label: 'Add one',       code: "`${d.getUTCMonth() + 1}/${d.getUTCDate()}`", output: "'3/15'" },
    },
    {
      name: 'getDay and getDate are different things',
      desc: 'getDay is the day of the WEEK, 0 for Sunday. getDate is the day of the MONTH. The names are one character apart and both return a small number, so a mix-up type-checks, runs, and gives an answer that is wrong six days out of seven.',
      wrong: { label: 'Weekday, not date', code: "new Date('2026-03-15T12:00:00Z').getUTCDay()", output: '0' },
      fix:   { label: 'Day of the month',  code: "new Date('2026-03-15T12:00:00Z').getUTCDate()", output: '15' },
    },
    {
      name: 'They are all local time',
      desc: 'Every getter here reports the component as seen in the runtime timezone, so the same timestamp gives different numbers on a server in London and a laptop in Tokyo — and can differ by a whole DAY near midnight. Use the getUTC family when the answer must be stable.',
      wrong: { label: 'Reader-dependent', code: "new Date('2026-03-15T23:00:00Z').getDate()", output: '15 or 16, depending on where' },
      fix:   { label: 'Stable',           code: "new Date('2026-03-15T23:00:00Z').getUTCDate()", output: '15 everywhere' },
    },
    {
      name: 'getYear is deprecated and returns year minus 1900',
      desc: 'A survivor of the two-digit-year era. It returns 126 for 2026, which is neither the year nor a two-digit year. It exists only in Annex B — use getFullYear.',
      wrong: { label: 'Not the year', code: "new Date('2026-03-15T12:00:00Z').getYear()", output: '126' },
      fix:   { label: 'getFullYear',  code: "new Date('2026-03-15T12:00:00Z').getFullYear()", output: '2026' },
    },
  ],

  when: {
    use: [
      'Reading a single component for arithmetic or comparison',
      'Building a custom format where Intl options do not fit',
      'Grouping records by local day, month or weekday',
    ],
    avoid: [
      'Formatting for a reader → toLocaleDateString with Intl options',
      'The answer must not depend on the runtime → the getUTC family',
      'Serialising → toISOString',
      'getYear, ever → getFullYear',
    ],
  },

  notes: {
    complexity: 'O(1) each, though local-time conversion consults timezone data',
    return:     'A number, or NaN for an invalid Date',
    cpython:    'V8: Builtins-date getters',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the Date is only read',
  },

  related: [
    { name: 'Date UTC methods',            slug: 'date-utc-methods',   when: 'The same components, timezone-independent' },
    { name: 'Date setters',                slug: 'date-setters',       when: 'Changing a component instead of reading it' },
    { name: 'Date.prototype.getTime',      slug: 'date-gettime',       when: 'The whole timestamp as one number' },
    { name: 'Date.prototype.toLocaleDateString', slug: 'date-tolocalestring', when: 'Formatting without manual arithmetic' },
  ],

  faq: [
    {
      q: 'Why is getMonth zero-based?',
      a: 'Because it was designed to index an array of month names, in an era when that was how you formatted a date. getDate had no such use and stayed one-based. The inconsistency has been in the language since 1997 and cannot be changed.',
      code: "const MONTHS = ['Jan', 'Feb', 'Mar'];\nMONTHS[d.getMonth()];   // the original intent",
    },
    {
      q: 'How do I remember getDay versus getDate?',
      a: 'getDay gives the DAY OF THE WEEK — think "what day is it?", answered with a weekday name. getDate gives the calendar date. If you want a weekday name, prefer toLocaleDateString with weekday options and avoid the question entirely.',
      code: "d.toLocaleDateString('en-GB', {weekday: 'long'});   // 'Sunday'",
    },
    {
      q: 'Should I use these or Intl?',
      a: 'Intl for anything a person reads — it handles month names, weekday names, ordering and locale conventions. The getters for arithmetic, comparison and grouping, where you need the number rather than a label.',
    },
  ],

  history: [
    { version: 'ES1', note: 'The full getter family present from the first version, including the zero-based month and the deprecated getYear.' },
    { version: 'ES5', note: 'getYear and setYear formally relegated to Annex B.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth',
    meta:  'Date.prototype.getMonth',
  },

};
