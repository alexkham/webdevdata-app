// content/reference/javascript/methods/date-parse.js

export const meta = {
  slug:        'date-parse',
  name:        'Date.parse',
  signature:   'Date.parse(string)',
  blurb:       'Parses ISO reliably and everything else at the engine whim — which is why it bites.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date.parse parse string timestamp ISO 8601 NaN invalid date implementation defined dd/mm ambiguous javascript',
};

export const method = {
  slug:      'date-parse',
  name:      'Date.parse',
  signature: 'Date.parse(string)',
  returns:   { type: 'number', desc: 'Milliseconds since the epoch, or NaN if the string could not be parsed. Never throws — a bad input is silently NaN.' },

  category:    'Date static method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Exactly one input format is specified: ISO 8601. Everything else is implementation-defined, which means it works in your browser and may not in someone else.',

  cheat: {
    commonCall: "Date.parse('2026-03-15T12:00:00Z')",
    returns:    'a timestamp, or NaN',
    replaces:   'nothing — the Date constructor uses it internally',
    watchOut:   'only ISO is portable; NaN is the failure signal',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'A date string. ISO 8601 is specified and reliable. Other formats are accepted at each engine discretion, so results vary between browsers and Node versions.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'a date string to parse', input: 'text' },
  ],
  demoTemplate: 'Date.parse({s})',
  cases: [
    { id: 'iso',      label: 'ISO with a zone',        values: { s: '2026-03-15T12:00:00Z' } },
    { id: 'dateonly', label: 'date only → UTC',        values: { s: '2026-03-15' } },
    { id: 'words',    label: 'a written date',         values: { s: 'March 15, 2026 12:00 UTC' } },
    { id: 'slashes',  label: 'dd/mm/yyyy → NaN (!)',   values: { s: '15/03/2026' } },
    { id: 'junk',     label: 'nonsense → NaN',         values: { s: 'nonsense' } },
  ],
  demoExplainer: "ISO input gives a clean timestamp, and that is the only form the specification guarantees. The written-date case works in every major engine but is not required to. The fourth case is the one that causes real damage: '15/03/2026' is unambiguous to a European reader and simply invalid here — engines try month/day/year first, and 15 is not a month, so you get NaN. Had the day been 12 or less it would have parsed as a DIFFERENT date rather than failing, which is far worse.",

  patterns: [
    {
      name: 'Parse ISO and validate',
      desc: 'NaN is the only failure signal.',
      code: "const t = Date.parse(s);\nif (Number.isNaN(t)) reject('bad date');",
    },
    {
      name: 'Parse a known non-ISO format yourself',
      desc: 'Explicit beats guessing.',
      code: "const [d, m, y] = s.split('/').map(Number);\nconst t = Date.UTC(y, m - 1, d);",
    },
    {
      name: 'The constructor does the same thing',
      desc: 'new Date(string) calls this internally.',
      code: 'const d = new Date(isoString);',
    },
  ],

  examples: [
    { title: 'ISO with a zone',   code: "Date.parse('2026-03-15T12:00:00Z')", returns: '1773576000000' },
    { title: 'Date only is UTC',  code: "Date.parse('2026-03-15')",           returns: '1773532800000' },
    { title: 'Unparseable',       code: "Date.parse('nonsense')",             returns: 'NaN' },
    { title: 'European order fails', code: "Date.parse('15/03/2026')",        returns: 'NaN' },
    { title: 'Never throws',      code: "typeof Date.parse('nonsense')",      returns: "'number'" },
    { title: 'The constructor agrees', code: "new Date('nonsense').toString()", returns: "'Invalid Date'" },
  ],

  pitfalls: [
    {
      name: 'Only ISO 8601 is specified',
      desc: 'Every other format is implementation-defined. A string that parses in Chrome may give NaN in Safari or a different instant in Node — and because failures are NaN rather than exceptions, the problem surfaces as a nonsensical date deep in your data.',
      wrong: { label: 'Engine-dependent', code: "Date.parse('Mar 15 2026 12:00')", output: 'works today, not guaranteed' },
      fix:   { label: 'Use ISO',          code: "Date.parse('2026-03-15T12:00:00Z')", output: '1773576000000' },
    },
    {
      name: 'Ambiguous day/month order parses to the wrong date',
      desc: 'Engines try month/day/year for slash-separated input, so 03/04/2026 is 4 March, not 3 April. When the day exceeds 12 you get NaN and notice; when it does not, you get a silently wrong date six months out. This is the worst failure mode in the whole Date API.',
      wrong: { label: 'Read as month/day', code: "const d = new Date('03/04/2026');\n[d.getMonth(), d.getDate()]", output: '[2, 4]   // 4 March' },
      fix:   { label: 'Parse explicitly',  code: "const [day, mon, yr] = '04/03/2026'.split('/').map(Number);\nconst d = new Date(yr, mon - 1, day);\n[d.getMonth(), d.getDate()]", output: '[2, 4]   // 4 March, as intended' },
    },
    {
      name: 'It returns NaN rather than throwing',
      desc: 'NaN then propagates through arithmetic and comparisons without error, so a bad date can be stored, compared and rendered before anyone notices. Every parse of untrusted input needs an explicit check.',
      wrong: { label: 'Spreads quietly', code: "Date.parse('nonsense') + 86400000", output: 'NaN' },
      fix:   { label: 'Check it',        code: "const t = Date.parse(s);\nif (Number.isNaN(t)) throw new Error('bad date');", output: 'fails early' },
    },
    {
      name: 'A date-time string without an offset is local',
      desc: 'Shared with the constructor and worth repeating: a bare date is UTC, a date with a time but no zone is local. The same calendar day can therefore parse to two different instants depending on which form you used.',
      wrong: { label: 'Local', code: "Date.parse('2026-03-15T00:00') === Date.parse('2026-03-15')", output: 'false, outside UTC' },
      fix:   { label: 'Add the Z', code: "Date.parse('2026-03-15T00:00Z') === Date.parse('2026-03-15')", output: 'true' },
    },
  ],

  when: {
    use: [
      'Parsing ISO 8601 strings from an API or a database',
      'Validating that a string is a usable date, via the NaN check',
      'Comparing two dates as numbers without building Date objects',
    ],
    avoid: [
      'Non-ISO formats → parse the parts yourself, or use a library',
      'User-typed dates → a date input, or an explicit format',
      'You want a Date object → new Date(string), which calls this anyway',
      'Ambiguous day/month order → never rely on the engine guess',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the string',
    return:     'A number, or NaN; nothing is allocated',
    cpython:    'V8: Builtins-date-parse / dateparser.cc',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.prototype.toISOString', slug: 'date-toisostring',  when: 'Producing the format this parses reliably' },
    { name: 'Date.UTC',                   slug: 'date-utc',          when: 'Building a timestamp from parts instead of text' },
    { name: 'Date.now',                   slug: 'date-now',          when: 'The current timestamp' },
    { name: 'Number.isNaN',               slug: 'number-isnan',      when: 'Checking whether the parse failed' },
  ],

  faq: [
    {
      q: 'Which formats can I rely on?',
      a: 'ISO 8601 only — a date, optionally with a time and an offset. Everything else, including the RFC 2822 style that most engines accept, is implementation-defined. If you control the producer, emit toISOString output.',
      code: "Date.parse('2026-03-15');\nDate.parse('2026-03-15T12:00:00Z');\nDate.parse('2026-03-15T12:00:00+02:00');",
    },
    {
      q: 'Why does 03/04/2026 give March?',
      a: 'Because engines interpret slash-separated dates as month/day/year, following US convention. It is not specified — it is just what they all happen to do. For any input a human typed, take the parts separately rather than letting the engine guess.',
    },
    {
      q: 'Date.parse or new Date(string)?',
      a: 'They use the same parser. Date.parse gives you the number, the constructor gives you an object. Use Date.parse when you only need to validate or compare, since it avoids the allocation.',
      code: "Number.isNaN(Date.parse(s));                    // valid?\nNumber.isNaN(new Date(s).getTime());            // the same check",
    },
    {
      q: 'Is there a better option?',
      a: 'The Temporal API, once widely available, replaces all of this with explicit parsing and no implementation-defined behaviour. Until then, ISO plus a NaN check is the portable answer, and a library is worth it for anything else.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'Date.parse present from the first version, with entirely implementation-defined behaviour.' },
    { version: 'ES5',    note: 'ISO 8601 parsing specified, giving one format that is guaranteed.' },
    { version: 'ES2016', note: 'Clarified that date-only strings are UTC and date-time strings without an offset are local.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse',
    meta:  'Date.parse',
  },

  tryInTool: [],
};
