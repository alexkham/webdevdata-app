// content/reference/javascript/methods/date-gettime.js
//
// valueOf is consolidated here: on a Date the two return the same number,
// and valueOf is what makes date arithmetic and comparison work.

export const meta = {
  slug:        'date-gettime',
  name:        'Date.prototype.getTime',
  signature:   'date.getTime()',
  blurb:       'The entire contents of a Date — one number, and the only safe way to compare two.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date getTime valueOf timestamp epoch milliseconds compare equality subtract difference NaN invalid javascript',
};

export const method = {
  slug:      'date-gettime',
  name:      'Date.prototype.getTime',
  signature: 'date.getTime()',
  returns:   { type: 'number', desc: 'Milliseconds since the epoch, UTC. NaN for an invalid Date — which is the standard validity check. valueOf returns the same number.' },

  category:    'Date method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'A Date contains nothing but this number. Everything else — components, formatting, timezones — is computed from it on demand, which explains most of the API surprises.',

  cheat: {
    commonCall: 'a.getTime() === b.getTime()',
    returns:    'milliseconds since 1970-01-01 UTC',
    replaces:   'comparing Dates with ===, which never works',
    watchOut:   'NaN for an invalid Date — and NaN !== NaN',
  },

  parameters: [],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'a date string', input: 'text' },
  ],
  demoTemplate: 'new Date({iso}).getTime()',
  cases: [
    { id: 'noon',    label: 'a full timestamp',      values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'epoch',   label: 'the epoch → 0',         values: { iso: '1970-01-01T00:00:00Z' } },
    { id: 'before',  label: 'before 1970 → negative',values: { iso: '1969-07-20T20:17:00Z' } },
    { id: 'invalid', label: 'invalid → NaN (!)',     values: { iso: 'nonsense' } },
  ],
  demoExplainer: "One number, counting milliseconds from midnight UTC on 1 January 1970 — so the epoch itself is 0 and anything earlier is negative. That single number IS the Date; there is no timezone stored anywhere in it. The invalid case gives NaN, and because NaN is never equal to itself, the idiomatic validity check is Number.isNaN(d.getTime()) rather than a comparison.",

  patterns: [
    {
      name: 'Compare two dates',
      desc: 'Dates are objects — === compares references.',
      code: 'if (a.getTime() === b.getTime()) { }',
    },
    {
      name: 'Validity check',
      desc: 'The standard way to test a parsed date.',
      code: 'const valid = !Number.isNaN(d.getTime());',
    },
    {
      name: 'Difference in days',
      desc: 'Subtraction coerces via valueOf, so no call is needed.',
      code: 'const days = (b - a) / 86400000;',
    },
  ],

  examples: [
    { title: 'A timestamp',     code: "new Date('2026-03-15T12:00:00Z').getTime()", returns: '1773576000000' },
    { title: 'The epoch',       code: "new Date('1970-01-01T00:00:00Z').getTime()", returns: '0' },
    { title: 'Invalid is NaN',  code: "new Date('nonsense').getTime()",             returns: 'NaN' },
    { title: 'valueOf matches', code: "new Date('2026-03-15T12:00:00Z').valueOf()", returns: '1773576000000' },
    { title: 'Subtraction works', code: "new Date('2026-03-16T12:00:00Z') - new Date('2026-03-15T12:00:00Z')", returns: '86400000' },
    { title: 'But equality does not', code: 'new Date(0) === new Date(0)',          returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'Two Dates are never === even at the same instant',
      desc: 'They are objects, so === compares references. Two Dates built from the same timestamp are different objects and compare unequal, which makes a naive equality check silently always false.',
      wrong: { label: 'Always false', code: 'new Date(0) === new Date(0)', output: 'false' },
      fix:   { label: 'Compare the numbers', code: 'new Date(0).getTime() === new Date(0).getTime()', output: 'true' },
    },
    {
      name: 'But < and > DO work, and == is a special case',
      desc: 'Relational operators coerce via valueOf, so a < b compares instants correctly — which makes the failure of === all the more confusing. Loose == does NOT coerce between two objects, so it behaves like === here.',
      wrong: { label: 'Loose also fails', code: 'new Date(0) == new Date(0)', output: 'false' },
      fix:   { label: 'Relational is fine', code: 'new Date(0) <= new Date(0)', output: 'true' },
    },
    {
      name: 'NaN for an invalid Date propagates silently',
      desc: 'An unparseable date gives NaN here, and NaN flows through arithmetic and comparisons without error. A bad date can be stored and rendered before anyone notices, so check at the point of parsing.',
      wrong: { label: 'Spreads', code: "new Date('nonsense').getTime() + 1000", output: 'NaN' },
      fix:   { label: 'Check first', code: "const t = new Date(s).getTime();\nif (Number.isNaN(t)) reject();", output: 'fails early' },
    },
    {
      name: 'Day arithmetic by dividing is not always right',
      desc: 'Dividing a difference by 86 400 000 assumes every day is 24 hours. Across a daylight-saving boundary a local day can be 23 or 25 hours, so the count comes out fractional and rounding it gives the wrong answer at the edges.',
      wrong: { label: 'Assumes 24h days', code: '(b - a) / 86400000', output: '0.958 across a DST spring-forward' },
      fix:   { label: 'Compare UTC dates', code: 'Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000)', output: 'whole days' },
    },
  ],

  when: {
    use: [
      'Comparing two Dates for equality or ordering',
      'Checking whether a parsed Date is valid',
      'Storing or transmitting a date as a number',
      'Measuring a difference between two instants',
    ],
    avoid: [
      'Comparing Dates with === → it compares references',
      'Counting calendar days across DST → compare UTC date parts',
      'Measuring elapsed code time → performance.now()',
      'Human-readable output → toISOString or a locale format',
    ],
  },

  notes: {
    complexity: 'O(1) — it reads the stored value directly',
    return:     'A number, or NaN; nothing is allocated',
    cpython:    'V8: Builtins-date-gettime',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.now',                   slug: 'date-now',          when: 'The same number for the current instant' },
    { name: 'Date.UTC',                   slug: 'date-utc',          when: 'Building a timestamp from parts' },
    { name: 'Date.prototype.toISOString', slug: 'date-toisostring',  when: 'The text form of the same instant' },
    { name: 'Number.isNaN',               slug: 'number-isnan',      when: 'The validity check this enables' },
  ],

  faq: [
    {
      q: 'Why can I subtract Dates but not compare them with ===?',
      a: 'Because arithmetic and relational operators coerce objects to primitives via valueOf, which returns the timestamp. Strict equality does no coercion at all — it compares object identity. So a - b works, a < b works, and a === b is always false for distinct objects.',
      code: 'b - a;          // milliseconds\na < b;          // correct\na === b;        // false, always\na.getTime() === b.getTime();   // correct',
    },
    {
      q: 'getTime or valueOf?',
      a: 'They return the same number on a Date. getTime says what it means; valueOf is the coercion hook the operators call for you. Use getTime explicitly and let valueOf do its job implicitly.',
    },
    {
      q: 'How do I check whether a Date is valid?',
      a: 'Number.isNaN on the timestamp. There is no isValid method, and comparing the Date to NaN does not work because nothing equals NaN.',
      code: 'const valid = !Number.isNaN(d.getTime());',
    },
    {
      q: 'Does a Date know its timezone?',
      a: 'No. It holds this one UTC-based number and nothing else. The local getters apply the runtime timezone when you call them, which is why the same Date describes itself differently on different machines.',
    },
  ],

  history: [
    { version: 'ES1', note: 'getTime and valueOf present from the first version; the epoch and millisecond basis inherited from Unix.' },
    { version: 'ES5', note: 'Date.now added as a shortcut for the current value.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime',
    meta:  'Date.prototype.getTime',
  },

  tryInTool: [],
};
