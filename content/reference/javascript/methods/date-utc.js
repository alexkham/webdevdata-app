// content/reference/javascript/methods/date-utc.js

export const meta = {
  slug:        'date-utc',
  name:        'Date.UTC',
  signature:   'Date.UTC(year, month[, day[, hours[, minutes[, seconds[, ms]]]]])',
  blurb:       'Build a timestamp from parts in UTC — where the constructor would use local time.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date.UTC timestamp from parts year month day constructor local time difference zero indexed month javascript',
};

export const method = {
  slug:      'date-utc',
  name:      'Date.UTC',
  signature: 'Date.UTC(year, month[, day[, hours[, minutes[, seconds[, ms]]]]])',
  returns:   { type: 'number', desc: 'A timestamp in milliseconds — NOT a Date. Wrap it in new Date() if you want an object.' },

  category:    'Date static method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The same argument list as the multi-argument Date constructor, interpreted as UTC instead of local time. That single difference is the whole reason it exists.',

  cheat: {
    commonCall: 'new Date(Date.UTC(2026, 2, 15))',
    returns:    'a timestamp — wrap it for a Date',
    replaces:   'new Date(y, m, d), which uses local time',
    watchOut:   'month is still 0-indexed, and it returns a NUMBER',
  },

  parameters: [
    { name: 'year',  type: 'number', required: true,  default: null, desc: 'The full year. Values 0 to 99 are mapped to 1900–1999, which is a legacy trap.' },
    { name: 'month', type: 'number', required: true,  default: null, desc: 'Zero-based, as everywhere in Date — 0 is January, 11 is December. Out-of-range values roll into the year.' },
    { name: 'day',   type: 'number', required: false, default: '1',  desc: 'One-based day of the month. 0 means the last day of the previous month. Remaining arguments default to 0.' },
  ],

  demoParams: [
    { name: 'year',  type: 'number', hint: 'full year',        input: 'number' },
    { name: 'month', type: 'number', hint: 'month 0–11',       input: 'number' },
    { name: 'day',   type: 'number', hint: 'day of the month', input: 'number' },
  ],
  demoTemplate: 'Date.UTC({year}, {month}, {day})',
  cases: [
    { id: 'march',   label: 'March 15 → month 2 (!)',  values: { year: 2026, month: 2, day: 15 } },
    { id: 'epoch',   label: 'the epoch itself',        values: { year: 1970, month: 0, day: 1 } },
    { id: 'rollover',label: 'month 12 → next year (!)',values: { year: 2026, month: 12, day: 1 } },
    { id: 'dayzero', label: 'day 0 → previous month',  values: { year: 2026, month: 3, day: 0 } },
  ],
  demoExplainer: "The output is a plain number, which is the first thing to notice — Date.UTC does not return a Date. The epoch case gives 0, confirming the reference point. The month argument is zero-based exactly as getMonth is, so 2 means March. Out-of-range values roll rather than fail: month 12 becomes January of the next year, and day 0 becomes the last day of the previous month, which is the standard trick for finding a month length.",

  patterns: [
    {
      name: 'Build a UTC date',
      desc: 'Wrap the timestamp.',
      code: 'const d = new Date(Date.UTC(2026, 2, 15));',
    },
    {
      name: 'Days in a month',
      desc: 'Day 0 of the next month.',
      code: 'const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();',
    },
    {
      name: 'Deterministic tests',
      desc: 'No dependence on the runner timezone.',
      code: 'const fixed = new Date(Date.UTC(2026, 0, 1));',
    },
  ],

  examples: [
    { title: 'A UTC timestamp',   code: 'Date.UTC(2026, 2, 15)',                     returns: '1773532800000' },
    { title: 'The epoch',         code: 'Date.UTC(1970, 0, 1)',                      returns: '0' },
    { title: 'It returns a number',code: 'typeof Date.UTC(2026, 2, 15)',             returns: "'number'" },
    { title: 'One argument is the year', code: 'new Date(Date.UTC(2026)).toISOString()', returns: "'2026-01-01T00:00:00.000Z'" },
    { title: 'Days in March',     code: 'new Date(Date.UTC(2026, 3, 0)).getUTCDate()',returns: '31' },
    { title: 'The constructor is local', code: 'new Date(2026, 2, 15).getTimezoneOffset() !== 0', returns: 'true, outside UTC' },
  ],

  pitfalls: [
    {
      name: 'It returns a number, not a Date',
      desc: 'The most common slip. Calling a Date method on the result fails, because a number has none. Wrap it in new Date() whenever you want an object.',
      wrong: { label: 'Not a Date', code: 'Date.UTC(2026, 2, 15).toISOString()', output: 'TypeError: ...toISOString is not a function' },
      fix:   { label: 'Wrap it',    code: 'new Date(Date.UTC(2026, 2, 15)).toISOString()', output: "'2026-03-15T00:00:00.000Z'" },
    },
    {
      name: 'The month is still zero-based',
      desc: 'Switching from the constructor to Date.UTC fixes the timezone and changes nothing about the indexing. Passing 3 for March produces April, and the date is otherwise perfectly valid.',
      wrong: { label: 'That is April', code: 'new Date(Date.UTC(2026, 3, 15)).toISOString().slice(0, 10)', output: "'2026-04-15'" },
      fix:   { label: 'March is 2',    code: 'new Date(Date.UTC(2026, 2, 15)).toISOString().slice(0, 10)', output: "'2026-03-15'" },
    },
    {
      name: 'Years 0 to 99 mean 1900 to 1999',
      desc: 'A two-digit-year hangover. Date.UTC(26, 0, 1) is 1926, not 2026 and not year 26. Any year value that might legitimately be small needs setUTCFullYear afterwards.',
      wrong: { label: 'Nineteen twenty-six', code: 'new Date(Date.UTC(26, 0, 1)).getUTCFullYear()', output: '1926' },
      fix:   { label: 'Set it explicitly',   code: 'const d = new Date(0);\nd.setUTCFullYear(26);\nd.getUTCFullYear()', output: '26' },
    },
    {
      name: 'The multi-argument constructor is local, this is not',
      desc: 'new Date(2026, 2, 15) is midnight LOCAL; Date.UTC(2026, 2, 15) is midnight UTC. They are different instants everywhere except UTC itself, which is why tests written with the constructor pass in one timezone and fail in another.',
      wrong: { label: 'Local midnight', code: 'new Date(2026, 2, 15).toISOString()', output: 'shifts with the runtime' },
      fix:   { label: 'UTC midnight',   code: 'new Date(Date.UTC(2026, 2, 15)).toISOString()', output: "'2026-03-15T00:00:00.000Z'" },
    },
  ],

  when: {
    use: [
      'Building a date from components without local-time interference',
      'Deterministic fixtures and tests',
      'Finding the number of days in a month, via day 0',
      'Server-side date construction',
    ],
    avoid: [
      'You want a Date object → wrap the result',
      'You have an ISO string → new Date(string) or Date.parse',
      'You mean a local wall-clock time → the multi-argument constructor',
      'Years below 100 → set the year explicitly afterwards',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A number; no Date is allocated',
    cpython:    'V8: Builtins-date-utc',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date UTC methods',           slug: 'date-utc-methods', when: 'Reading the components back' },
    { name: 'Date.parse',                 slug: 'date-parse',       when: 'Building from a string instead of parts' },
    { name: 'Date.now',                   slug: 'date-now',         when: 'The current timestamp' },
    { name: 'Date.prototype.toISOString', slug: 'date-toisostring', when: 'Turning the timestamp into text' },
  ],

  faq: [
    {
      q: 'Why does Date.UTC not return a Date?',
      a: 'Because it predates any convenient way to say so, and it composes with the constructor instead — new Date(Date.UTC(...)). It is a small annoyance that has been in the language since 1997.',
      code: 'new Date(Date.UTC(2026, 2, 15));',
    },
    {
      q: 'How do I get the number of days in a month?',
      a: 'Ask for day 0 of the FOLLOWING month, which resolves to the last day of the one you wanted. Remember the month argument is zero-based, so passing m + 1 asks about the month after m.',
      code: 'const days = new Date(Date.UTC(2026, 3, 0)).getUTCDate();   // March has 31',
    },
    {
      q: 'Which should I use for tests?',
      a: 'Date.UTC, always. The multi-argument constructor uses the runner timezone, so a test that passes on your laptop can fail on CI in a different zone — a genuinely annoying class of flake.',
      code: 'const fixed = new Date(Date.UTC(2026, 0, 1));',
    },
  ],

  history: [
    { version: 'ES1', note: 'Date.UTC present from the first version, alongside the local multi-argument constructor.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC',
    meta:  'Date.UTC',
  },

};
