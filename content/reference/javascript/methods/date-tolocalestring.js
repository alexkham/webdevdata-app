// content/reference/javascript/methods/date-tolocalestring.js
//
// toLocaleString, toLocaleDateString and toLocaleTimeString on one page:
// three entry points to the same Intl.DateTimeFormat machinery.

export const meta = {
  slug:        'date-tolocalestring',
  name:        'Date.prototype.toLocaleDateString, toLocaleTimeString and toLocaleString',
  signature:   'date.toLocaleDateString([locales[, options]])',
  blurb:       'The only correct way to show a date to a person — 03/15 or 15.03 depending on who is reading.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES3 (options since ES2012)',
  searchTerms: 'Date toLocaleDateString toLocaleTimeString toLocaleString Intl DateTimeFormat format locale timeZone options javascript',
};

export const method = {
  slug:      'date-tolocalestring',
  name:      'Date.prototype.toLocaleDateString, toLocaleTimeString and toLocaleString',
  signature: 'date.toLocaleDateString([locales[, options]])',
  returns:   { type: 'string', desc: 'The date formatted for the given locale. toLocaleDateString gives the date part, toLocaleTimeString the time part, toLocaleString both.' },

  category:    'Date methods',
  version:     'ES3 (options since ES2012)',
  hasLiveDemo: true,

  subtitle: 'A full Intl.DateTimeFormat behind three method calls. Every hand-rolled date format is an attempt to reimplement part of this, usually for one locale only.',

  cheat: {
    commonCall: "d.toLocaleDateString('en-GB')",
    returns:    'a formatted string',
    replaces:   'manual getMonth + 1 formatting',
    watchOut:   'the default locale AND timezone come from the runtime',
  },

  parameters: [
    { name: 'locales', type: 'string | string[]', required: false, default: 'host default', desc: 'A BCP 47 tag such as "en-GB" or "de-DE". Omitted, the runtime locale is used — which differs between your machine and your users.' },
    { name: 'options', type: 'object',            required: false, default: '{}',           desc: 'Intl.DateTimeFormat options — dateStyle, timeStyle, weekday, month, day, year, hour, minute, timeZone, hour12. Setting timeZone is what makes output reproducible.' },
  ],

  demoParams: [
    { name: 'iso',    type: 'string', hint: 'an ISO date',        input: 'text' },
    { name: 'locale', type: 'string', hint: 'e.g. en-US, de-DE',  input: 'text' },
  ],
  demoTemplate: "new Date({iso}).toLocaleDateString({locale}, { timeZone: 'UTC' })",
  cases: [
    { id: 'us',  label: 'en-US → month first',    values: { iso: '2026-03-15T12:00:00Z', locale: 'en-US' } },
    { id: 'gb',  label: 'en-GB → day first (!)',  values: { iso: '2026-03-15T12:00:00Z', locale: 'en-GB' } },
    { id: 'de',  label: 'de-DE → dots',           values: { iso: '2026-03-15T12:00:00Z', locale: 'de-DE' } },
    { id: 'ja',  label: 'ja-JP → year first',     values: { iso: '2026-03-15T12:00:00Z', locale: 'ja-JP' } },
    { id: 'sv',  label: 'sv-SE → ISO-like',       values: { iso: '2026-03-15T12:00:00Z', locale: 'sv-SE' } },
  ],
  demoExplainer: "The same instant, five conventions. en-US puts the month first and en-GB the day, which is precisely the ambiguity that makes 03/04 unreadable without knowing the locale — and why hand-rolling a slash format is always wrong for somebody. The sv-SE case is a useful trick: Swedish convention happens to be ISO-like, so it is the shortest way to get a LOCAL calendar date in YYYY-MM-DD form. Note the demo pins timeZone to UTC; without that, the output would also depend on where each reader is sitting.",

  patterns: [
    {
      name: 'A readable date',
      desc: 'dateStyle covers the common cases.',
      code: "d.toLocaleDateString('en-GB', {dateStyle: 'long'});",
    },
    {
      name: 'Local calendar day in ISO form',
      desc: 'The sv-SE trick, avoiding a UTC slice.',
      code: "d.toLocaleDateString('sv-SE');   // '2026-03-15'",
    },
    {
      name: 'Reuse a formatter',
      desc: 'Much faster across many dates.',
      code: "const f = new Intl.DateTimeFormat('en-GB', {dateStyle: 'short'});\nrows.map(r => f.format(r.at));",
    },
  ],

  examples: [
    { title: 'US order',       code: "new Date('2026-03-15T12:00:00Z').toLocaleDateString('en-US', {timeZone: 'UTC'})", returns: "'3/15/2026'" },
    { title: 'British order',  code: "new Date('2026-03-15T12:00:00Z').toLocaleDateString('en-GB', {timeZone: 'UTC'})", returns: "'15/03/2026'" },
    { title: 'German',         code: "new Date('2026-03-15T12:00:00Z').toLocaleDateString('de-DE', {timeZone: 'UTC'})", returns: "'15.3.2026'" },
    { title: 'Swedish is ISO-like', code: "new Date('2026-03-15T12:00:00Z').toLocaleDateString('sv-SE', {timeZone: 'UTC'})", returns: "'2026-03-15'" },
    { title: 'A named timezone', code: "new Date('2026-03-15T12:00:00Z').toLocaleString('en-GB', {timeZone: 'Asia/Tokyo'})", returns: "'15/03/2026, 21:00:00'" },
    { title: 'Invalid does not throw', code: "new Date('nonsense').toLocaleDateString()", returns: "'Invalid Date'" },
  ],

  pitfalls: [
    {
      name: 'The default locale and timezone are the runtime',
      desc: 'Omitting both means output depends on the machine — your laptop, your CI runner, your user browser. Snapshot tests fail for reasons that look random, and a server renders dates in whatever zone it was deployed to.',
      wrong: { label: 'Environment-dependent', code: 'd.toLocaleDateString()', output: 'varies by machine' },
      fix:   { label: 'Pin both',              code: "d.toLocaleDateString('en-GB', {timeZone: 'UTC'})", output: 'reproducible' },
    },
    {
      name: 'The output is not machine-parseable',
      desc: 'It contains locale-specific separators, sometimes non-breaking spaces, and ordering that varies. Date.parse will not reliably read it back. Format only at the edge of your system and keep the Date or ISO string internally.',
      wrong: { label: 'Round trip fails', code: "Date.parse(new Date('2026-03-15T12:00:00Z').toLocaleDateString('de-DE'))", output: 'NaN' },
      fix:   { label: 'Keep ISO',         code: 'const stored = d.toISOString();', output: 'parses reliably' },
    },
    {
      name: 'It is slow in a loop',
      desc: 'Each call may build a formatter from locale data. Rendering a table of thousands of dates this way is measurably slower than constructing one Intl.DateTimeFormat and reusing its format method.',
      wrong: { label: 'Rebuilds each time', code: 'rows.map(r => r.at.toLocaleDateString("en-GB"))', output: 'fine for small lists' },
      fix:   { label: 'Reuse a formatter',  code: 'const f = new Intl.DateTimeFormat("en-GB");\nrows.map(r => f.format(r.at));', output: 'much faster' },
    },
    {
      name: 'Two-digit years and 12-hour clocks surprise people',
      desc: 'Short formats in some locales use a two-digit year, and en-US defaults to a 12-hour clock with AM/PM. If you need a specific shape, set the options explicitly rather than trusting the locale default.',
      wrong: { label: 'Locale default', code: "new Date('2026-03-15T13:00:00Z').toLocaleTimeString('en-US', {timeZone: 'UTC'})", output: "'1:00:00 PM'" },
      fix:   { label: 'Force 24-hour',  code: "new Date('2026-03-15T13:00:00Z').toLocaleTimeString('en-GB', {timeZone: 'UTC', hour12: false})", output: "'13:00:00'" },
    },
  ],

  when: {
    use: [
      'Any date shown to a person',
      'Rendering in a specific named timezone, via the timeZone option',
      'Month and weekday names, without a lookup table',
      'Getting a LOCAL calendar day, via the sv-SE trick',
    ],
    avoid: [
      'Storing or transmitting → toISOString',
      'Formatting many dates → Intl.DateTimeFormat, reused',
      'Output you will parse back → keep the original',
      'Reproducible tests → pin both locale and timeZone',
    ],
  },

  notes: {
    complexity: 'O(1) per call, with substantial constant cost from locale setup',
    return:     'A new string; the Date is unchanged',
    cpython:    'V8: Builtins-date-tolocalestring / ICU',
    memory:     'May allocate a formatter per call unless one is reused',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.prototype.toISOString',      slug: 'date-toisostring',       when: 'The machine-readable form' },
    { name: 'Date.prototype.toUTCString',      slug: 'date-tostring',          when: 'The older fixed-format output' },
    { name: 'Date.prototype.getTimezoneOffset',slug: 'date-gettimezoneoffset', when: 'Why the default timezone matters' },
    { name: 'Number.prototype.toLocaleString', slug: 'number-tolocalestring',  when: 'The same Intl machinery for numbers' },
  ],

  faq: [
    {
      q: 'How do I get YYYY-MM-DD for the LOCAL day?',
      a: 'Use the sv-SE locale, whose convention is ISO-like. Slicing toISOString gives the UTC day, which can be a day out from the reader local date.',
      code: "d.toLocaleDateString('sv-SE');      // local day\nd.toISOString().slice(0, 10);       // UTC day",
    },
    {
      q: 'How do I show a date in a specific timezone?',
      a: 'Pass the IANA zone name in the timeZone option. Never adjust the timestamp by an offset yourself — that reimplements DST rules and gets them wrong.',
      code: "d.toLocaleString('en-GB', {timeZone: 'America/New_York'});",
    },
    {
      q: 'Which options should I use?',
      a: 'dateStyle and timeStyle for the common shapes — short, medium, long, full. Reach for the individual component options only when you need a shape the styles do not provide, and note the two families cannot be mixed.',
      code: "d.toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'});",
    },
    {
      q: 'Why does my test fail on CI?',
      a: 'Because the runner has a different locale or timezone from your machine and you did not pin either. Always pass an explicit locale and a timeZone in tests.',
    },
  ],

  history: [
    { version: 'ES3',    note: 'The three toLocale* methods added with implementation-defined output.' },
    { version: 'ES2012', note: 'ECMA-402 gave them locales and options, tying them to Intl.DateTimeFormat.' },
    { version: 'ES2020', note: 'dateStyle and timeStyle shorthands added.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString',
    meta:  'Date.prototype.toLocaleDateString',
  },

  tryInTool: [],
};
