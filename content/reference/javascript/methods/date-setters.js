// content/reference/javascript/methods/date-setters.js
//
// One page for the nine setters: setFullYear, setMonth, setDate, setHours,
// setMinutes, setSeconds, setMilliseconds, setTime and the deprecated
// setYear. They mutate, they return a number, and they silently roll over.

export const meta = {
  slug:        'date-setters',
  name:        'Date setters (setMonth, setDate, setHours…)',
  signature:   'date.setMonth(m), date.setDate(d), date.setFullYear(y)…',
  blurb:       'They MUTATE the date, return a timestamp, and roll overflow into the next month.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date setMonth setDate setFullYear setHours setMinutes setSeconds setMilliseconds setTime setYear mutate rollover overflow Feb 31 end of month javascript',
};

export const method = {
  slug:      'date-setters',
  name:      'Date setters (setMonth, setDate, setHours…)',
  signature: 'date.setMonth(m), date.setDate(d), date.setFullYear(y)…',
  returns:   { type: 'number', desc: 'The new timestamp in milliseconds — NOT the Date object. They mutate the Date in place, so chaining does not work.' },

  category:    'Date methods',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Three surprises in one family: they change the object you called them on, they hand back a number instead of the object, and an out-of-range value rolls over instead of failing.',

  cheat: {
    commonCall: 'd.setMonth(d.getMonth() + 1)',
    returns:    'a timestamp — not the Date',
    replaces:   'reconstructing a Date from parts',
    watchOut:   'MUTATES, and Feb 31 becomes March 3',
  },

  parameters: [
    { name: 'value', type: 'number', required: true, default: null, desc: 'The new component value. Out-of-range values are not rejected — they roll forward or backward, so setMonth(12) advances the year and setDate(0) goes to the last day of the previous month.' },
  ],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'an ISO date',      input: 'text' },
    { name: 'm',   type: 'number', hint: 'month to set (0–11)', input: 'number' },
  ],
  demoTemplate: '(d => { d.setUTCMonth({m}); return d.toISOString(); })(new Date({iso}))',
  cases: [
    { id: 'rollover', label: 'Jan 31 → Feb → MARCH 3 (!)', values: { iso: '2026-01-31T12:00:00Z', m: 1 } },
    { id: 'normal',   label: 'a safe mid-month date',       values: { iso: '2026-03-15T12:00:00Z', m: 5 } },
    { id: 'overflow', label: 'month 12 → next year (!)',    values: { iso: '2026-03-15T12:00:00Z', m: 12 } },
    { id: 'back',     label: 'month 0 → January',           values: { iso: '2026-06-15T12:00:00Z', m: 0 } },
  ],
  demoExplainer: "The first case is the classic month-arithmetic bug. Setting the month of 31 January to February asks for 31 February, which does not exist — so it rolls forward three days to 3 March. Nothing warns you, and the result is a valid date in the wrong month. The third case shows the same mechanism upward: month 12 is out of the 0–11 range, so it becomes January of the following year. That rollover is occasionally useful and far more often the reason a recurring-date calculation drifts.",

  patterns: [
    {
      name: 'Add days safely',
      desc: 'Rollover works in your favour here.',
      code: 'const d = new Date(start);\nd.setDate(d.getDate() + 7);',
    },
    {
      name: 'Add months safely',
      desc: 'Clamp to the end of the target month.',
      code: 'const d = new Date(start);\nconst day = d.getDate();\nd.setDate(1);\nd.setMonth(d.getMonth() + 1);\nd.setDate(Math.min(day, daysInMonth(d)));',
    },
    {
      name: 'Do not chain',
      desc: 'The return value is a number.',
      code: 'const d = new Date();\nd.setHours(0);\nd.setMinutes(0);   // separate statements',
    },
  ],

  examples: [
    { title: 'Feb 31 rolls to March', code: "const d = new Date(Date.UTC(2026, 0, 31));\nd.setUTCMonth(1);\nd.toISOString().slice(0, 10)", returns: "'2026-03-03'" },
    { title: 'Returns a number',      code: 'typeof new Date().setMonth(1)', returns: "'number'" },
    { title: 'It mutates',            code: "const d = new Date('2026-03-15T12:00:00Z');\nd.setUTCMonth(5);\nd.toISOString()", returns: "'2026-06-15T12:00:00.000Z'" },
    { title: 'setDate(0) goes back',  code: "const d = new Date(Date.UTC(2026, 3, 15));\nd.setUTCDate(0);\nd.toISOString().slice(0, 10)", returns: "'2026-03-31'" },
    { title: 'Month 12 is next January', code: 'new Date(2026, 12, 1).getFullYear()', returns: '2027' },
    { title: 'setTime replaces everything', code: "const d = new Date();\nd.setTime(0);\nd.toISOString()", returns: "'1970-01-01T00:00:00.000Z'" },
  ],

  pitfalls: [
    {
      name: 'Month arithmetic silently rolls over',
      desc: 'Adding a month to the 31st of a short-followed month lands in the month after next. Any "same day next month" calculation on month-end dates drifts, and the bug only appears for a few days each month — so it survives testing.',
      wrong: { label: 'Skips February', code: "const d = new Date(Date.UTC(2026, 0, 31));\nd.setUTCMonth(d.getUTCMonth() + 1);\nd.toISOString().slice(0, 10)", output: "'2026-03-03'" },
      fix:   { label: 'Go via day 1',   code: "const d = new Date(Date.UTC(2026, 0, 31));\nd.setUTCDate(1);\nd.setUTCMonth(1);\nd.toISOString().slice(0, 10)", output: "'2026-02-01'" },
    },
    {
      name: 'They return a timestamp, not the Date',
      desc: 'So chaining fails — the second call is made on a number, which has no setMinutes. The error message about a number not having the method is the clue, and it appears one line after the actual mistake.',
      wrong: { label: 'Cannot chain', code: 'new Date().setHours(0).setMinutes(0)', output: 'TypeError: ...setMinutes is not a function' },
      fix:   { label: 'Separate statements', code: 'const d = new Date();\nd.setHours(0);\nd.setMinutes(0);', output: 'works' },
    },
    {
      name: 'They mutate a shared Date',
      desc: 'A Date passed into a function and modified there changes for the caller too. Dates are objects, and there is no non-mutating setter — copy with new Date(d) before adjusting anything you did not create.',
      wrong: { label: 'Caller affected', code: 'function startOfDay(d) { d.setHours(0, 0, 0, 0); return d; }', output: 'the argument is changed' },
      fix:   { label: 'Copy first',      code: 'function startOfDay(d) { const c = new Date(d); c.setHours(0, 0, 0, 0); return c; }', output: 'the argument is safe' },
    },
    {
      name: 'setFullYear on 29 February',
      desc: 'Moving a leap day to a non-leap year rolls it to 1 March. Birthday and anniversary logic hits this once every four years, which is exactly the interval at which nobody is watching.',
      wrong: { label: 'Rolls to March', code: "const d = new Date(Date.UTC(2024, 1, 29));\nd.setUTCFullYear(2026);\nd.toISOString().slice(0, 10)", output: "'2026-03-01'" },
      fix:   { label: 'Clamp the day',  code: 'const d = new Date(Date.UTC(2026, 1, Math.min(29, 28)));', output: "'2026-02-28'" },
    },
  ],

  when: {
    use: [
      'Adding or subtracting days, where rollover is what you want',
      'Zeroing out the time part to get the start of a day',
      'setTime to jump to an absolute timestamp',
    ],
    avoid: [
      'Month arithmetic on month-end dates → clamp explicitly, or use a library',
      'Chaining → each call returns a number',
      'A Date you did not create → copy it first',
      'Anything a library like Temporal or date-fns does immutably',
    ],
  },

  notes: {
    complexity: 'O(1) each',
    return:     'The new timestamp as a number; the Date is mutated in place',
    cpython:    'V8: Builtins-date setters',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the Date is mutated, so shared references see the change',
  },

  related: [
    { name: 'Date getters',             slug: 'date-getters',     when: 'Reading a component before changing it' },
    { name: 'Date UTC methods',         slug: 'date-utc-methods', when: 'The setUTC family, free of local-time surprises' },
    { name: 'Date.prototype.getTime',   slug: 'date-gettime',     when: 'The timestamp these return' },
    { name: 'Date.UTC',                 slug: 'date-utc',         when: 'Building a date from parts instead of mutating' },
  ],

  faq: [
    {
      q: 'How do I add a month reliably?',
      a: 'Set the day to 1 first, change the month, then set the day to the smaller of the original day and the new month length. Without the clamp, month-end dates skip a month. This is the single best argument for a date library.',
      code: 'function addMonth(d) {\n  const day = d.getDate();\n  const c = new Date(d);\n  c.setDate(1);\n  c.setMonth(c.getMonth() + 1);\n  const last = new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate();\n  c.setDate(Math.min(day, last));\n  return c;\n}',
    },
    {
      q: 'Why can I not chain setters?',
      a: 'Because each returns the new timestamp as a number rather than the Date. It is a design choice from ES1, and it means every adjustment is its own statement. Several setters do take multiple arguments, which helps — setHours(0, 0, 0, 0) zeroes the whole time part in one call.',
      code: 'd.setHours(0, 0, 0, 0);   // hours, minutes, seconds, ms',
    },
    {
      q: 'Is rollover ever useful?',
      a: 'Yes, for days. setDate(getDate() + 30) correctly crosses month and year boundaries, which is much simpler than doing the arithmetic yourself. It is only months and years where the behaviour surprises.',
    },
  ],

  history: [
    { version: 'ES1', note: 'The full setter family present from the first version, mutating and returning a timestamp.' },
    { version: 'ES5', note: 'setYear relegated to Annex B alongside getYear.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth',
    meta:  'Date.prototype.setMonth',
  },

};
