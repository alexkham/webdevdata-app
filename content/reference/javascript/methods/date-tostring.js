// content/reference/javascript/methods/date-tostring.js
//
// toString, toDateString, toTimeString, toUTCString and the deprecated
// toGMTString on one page. All produce fixed English formats; only
// toUTCString is reproducible across readers, so the demo uses that.

export const meta = {
  slug:        'date-tostring',
  name:        'Date.prototype.toString, toUTCString, toDateString and toTimeString',
  signature:   'date.toString(), date.toUTCString(), date.toDateString()…',
  blurb:       'Fixed English formats — useful for HTTP headers and logs, wrong for users.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date toString toUTCString toDateString toTimeString toGMTString HTTP header GMT format Invalid Date javascript',
};

export const method = {
  slug:      'date-tostring',
  name:      'Date.prototype.toString, toUTCString, toDateString and toTimeString',
  signature: 'date.toString(), date.toUTCString(), date.toDateString()…',
  returns:   { type: 'string', desc: 'A fixed-format English string. toString and toDateString use local time; toUTCString uses UTC. All return "Invalid Date" rather than throwing.' },

  category:    'Date methods',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Four formats predating Intl, in English regardless of locale. toUTCString still matters — it is the format HTTP dates use — and the rest are mostly what you see when a Date lands in a template literal by accident.',

  cheat: {
    commonCall: 'd.toUTCString()',
    returns:    "'Sun, 15 Mar 2026 12:00:00 GMT'",
    replaces:   'nothing; Intl replaces IT for user-facing output',
    watchOut:   'always English, and toString embeds the local zone',
  },

  parameters: [],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'an ISO date', input: 'text' },
  ],
  demoTemplate: 'new Date({iso}).toUTCString()',
  cases: [
    { id: 'noon',    label: 'a full timestamp',     values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'epoch',   label: 'the epoch',            values: { iso: '1970-01-01T00:00:00Z' } },
    { id: 'newyear', label: 'new year midnight',    values: { iso: '2026-01-01T00:00:00Z' } },
    { id: 'invalid', label: 'invalid → a STRING (!)',values: { iso: 'nonsense' } },
  ],
  demoExplainer: "toUTCString produces the RFC 7231 format that HTTP headers use — always GMT, always English day and month abbreviations, always the same shape. The demo uses it rather than toString because toString embeds the reader local timezone name and would differ for everyone. The last case is worth contrasting with toISOString: an invalid Date formats as the string 'Invalid Date' here, where toISOString throws a RangeError.",

  patterns: [
    {
      name: 'An HTTP date header',
      desc: 'This is the specified format.',
      code: "res.setHeader('Last-Modified', d.toUTCString());",
    },
    {
      name: 'Debug output',
      desc: 'toString is what a template literal gives you.',
      code: 'console.log(`${d}`);   // calls toString',
    },
    {
      name: 'Anything user-facing',
      desc: 'Use a locale format instead.',
      code: "d.toLocaleDateString('en-GB', {dateStyle: 'long'});",
    },
  ],

  examples: [
    { title: 'HTTP format',      code: "new Date('2026-03-15T12:00:00Z').toUTCString()", returns: "'Sun, 15 Mar 2026 12:00:00 GMT'" },
    { title: 'The epoch',        code: "new Date(0).toUTCString()",                      returns: "'Thu, 01 Jan 1970 00:00:00 GMT'" },
    { title: 'Invalid is a string', code: "new Date('nonsense').toString()",             returns: "'Invalid Date'" },
    { title: 'toISOString throws', code: "new Date('nonsense').toISOString()",           returns: 'RangeError: Invalid time value' },
    { title: 'toString is local',code: "new Date('2026-03-15T12:00:00Z').toString()",    returns: "includes the runtime zone, e.g. 'GMT+0200 (…)'" },
    { title: 'toGMTString is an alias', code: 'Date.prototype.toGMTString === Date.prototype.toUTCString', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'They are always English',
      desc: 'Day and month abbreviations are fixed by the specification, so these formats never localise. A date rendered with toDateString shows "Sun 15 Mar 2026" to a German reader too, which looks like a bug in your product.',
      wrong: { label: 'English only', code: "new Date('2026-03-15T12:00:00Z').toDateString()", output: "'Sun Mar 15 2026'" },
      fix:   { label: 'Localised',    code: "new Date('2026-03-15T12:00:00Z').toLocaleDateString('de-DE')", output: "'15.3.2026'" },
    },
    {
      name: 'toString output is not fully specified',
      desc: 'The shape is defined but the trailing timezone name in parentheses is implementation-dependent, and it reflects the runtime zone. Never parse it, and never assert on it in a test.',
      wrong: { label: 'Runtime-dependent', code: 'new Date(0).toString()', output: 'differs by machine' },
      fix:   { label: 'Stable',            code: 'new Date(0).toISOString()', output: "'1970-01-01T00:00:00.000Z'" },
    },
    {
      name: 'This is where [object Date] never appears — but Invalid Date does',
      desc: 'A Date in a template literal calls toString, so an unparseable date renders as the literal text "Invalid Date" in your UI rather than failing loudly. Validate before formatting.',
      wrong: { label: 'Shows in the UI', code: '`Due: ${new Date(userInput)}`', output: "'Due: Invalid Date'" },
      fix:   { label: 'Check first',      code: 'const d = new Date(userInput);\nNumber.isNaN(d.getTime()) ? "—" : `Due: ${d}`', output: "'—'" },
    },
    {
      name: 'toGMTString is the same function as toUTCString',
      desc: 'Not merely similar — Annex B defines it as an alias, so they are one function object under two names. It exists only for old code and should never appear in new.',
      wrong: { label: 'Legacy name', code: 'new Date(0).toGMTString()', output: "works, but Annex B" },
      fix:   { label: 'Standard name', code: 'new Date(0).toUTCString()', output: 'identical output' },
    },
  ],

  when: {
    use: [
      'HTTP date headers, where toUTCString is the required format',
      'Logs and debug output, where a fixed English shape is fine',
      'Quick inspection in a console',
    ],
    avoid: [
      'Anything a user reads → the toLocale* family',
      'Storing or transmitting → toISOString',
      'Parsing back → these formats are not reliably parseable',
      'toGMTString → use toUTCString',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string; the Date is unchanged',
    cpython:    'V8: Builtins-date-tostring',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.prototype.toISOString',        slug: 'date-toisostring',    when: 'The machine-readable format' },
    { name: 'Date.prototype.toLocaleDateString', slug: 'date-tolocalestring', when: 'Formatting for a reader' },
    { name: 'Date.prototype.getTime',            slug: 'date-gettime',        when: 'Validity checking before formatting' },
    { name: 'Object.prototype.toString',         slug: 'object-tostring',     when: 'The generic method Date overrides' },
  ],

  faq: [
    {
      q: 'Which of these should I actually use?',
      a: 'toUTCString for HTTP headers, because that is the format the specification requires. toISOString for storage. The toLocale* family for users. toString only in logs and the console — and it runs implicitly whenever a Date meets a template literal.',
    },
    {
      q: 'Why does my date show as "Invalid Date" in the UI?',
      a: 'Because a Date built from an unparseable string still stringifies — it just stringifies to that text. Check the timestamp with Number.isNaN before rendering.',
      code: 'Number.isNaN(d.getTime());   // true for an invalid Date',
    },
    {
      q: 'What is the difference between toUTCString and toISOString?',
      a: 'Both are UTC. toUTCString is the RFC 7231 format used by HTTP — English abbreviations and a GMT suffix. toISOString is ISO 8601 — numeric, sortable as text, and the right choice for data.',
      code: "d.toUTCString();    // 'Sun, 15 Mar 2026 12:00:00 GMT'\nd.toISOString();    // '2026-03-15T12:00:00.000Z'",
    },
  ],

  history: [
    { version: 'ES1', note: 'toString, toDateString, toTimeString, toUTCString and toGMTString present from the first version.' },
    { version: 'ES5', note: 'toGMTString relegated to Annex B as an alias of toUTCString; toISOString added.' },
    { version: 'ES2018', note: 'The toString format specified precisely, apart from the implementation-dependent timezone name.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString',
    meta:  'Date.prototype.toUTCString',
  },

  tryInTool: [],
};
