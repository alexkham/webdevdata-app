// content/reference/javascript/methods/date-toisostring.js
//
// toJSON is consolidated here: it calls toISOString, which is why a Date
// inside JSON.stringify comes out as an ISO string.

export const meta = {
  slug:        'date-toisostring',
  name:        'Date.prototype.toISOString',
  signature:   'date.toISOString()',
  blurb:       'The only format you should store or transmit — always UTC, always the same shape.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Date toISOString toJSON ISO 8601 UTC serialise store transmit RangeError invalid date JSON.stringify javascript',
};

export const method = {
  slug:      'date-toisostring',
  name:      'Date.prototype.toISOString',
  signature: 'date.toISOString()',
  returns:   { type: 'string', desc: 'The date in ISO 8601 extended format, always in UTC and always ending in Z. THROWS RangeError for an invalid Date, unlike every other to* method.' },

  category:    'Date method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The one Date format with a single unambiguous meaning. It is also what toJSON returns, which is why a Date passed to JSON.stringify becomes an ISO string.',

  cheat: {
    commonCall: 'd.toISOString()',
    returns:    "'2026-03-15T12:00:00.000Z'",
    replaces:   'manual zero-padded formatting',
    watchOut:   'THROWS on an invalid Date — the only to* method that does',
  },

  parameters: [],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'a date string to parse', input: 'text' },
  ],
  demoTemplate: 'new Date({iso}).toISOString()',
  cases: [
    { id: 'full',    label: 'full timestamp',           values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'dateonly',label: 'date only → UTC midnight', values: { iso: '2026-03-15' } },
    { id: 'nozone',  label: 'no Z → LOCAL time (!)',    values: { iso: '2026-03-15T00:00' } },
    { id: 'words',   label: 'a written date',           values: { iso: 'March 15, 2026 12:00 UTC' } },
    { id: 'invalid', label: 'invalid → THROWS (!)',     values: { iso: 'nonsense' } },
  ],
  demoExplainer: "Every valid result has the same shape and ends in Z, which is what makes this format safe to store and compare as text. The second and third cases are the trap worth memorising: a DATE-ONLY string is parsed as UTC midnight, but a date-TIME string without a zone is parsed as LOCAL — so '2026-03-15' and '2026-03-15T00:00' are different instants, and the second one can land on the previous day once converted back to UTC. The last case is the other surprise: an invalid Date makes this method THROW, where toString would have returned 'Invalid Date'.",

  patterns: [
    {
      name: 'Store and transmit',
      desc: 'The default choice for any persisted date.',
      code: 'await save({createdAt: new Date().toISOString()});',
    },
    {
      name: 'JSON does it for you',
      desc: 'toJSON delegates to toISOString.',
      code: 'JSON.stringify({at: new Date()});',
    },
    {
      name: 'Just the date part',
      desc: 'The format is fixed, so slicing is safe.',
      code: 'const day = d.toISOString().slice(0, 10);',
    },
  ],

  examples: [
    { title: 'Full timestamp',    code: "new Date('2026-03-15T12:00:00Z').toISOString()", returns: "'2026-03-15T12:00:00.000Z'" },
    { title: 'Date-only is UTC',  code: "new Date('2026-03-15').toISOString()",           returns: "'2026-03-15T00:00:00.000Z'" },
    { title: 'No zone is local',  code: "new Date('2026-03-15T00:00').toISOString()",      returns: 'the previous day, east of UTC' },
    { title: 'JSON uses it',      code: "JSON.stringify({at: new Date('2026-03-15T12:00:00Z')})", returns: '\'{"at":"2026-03-15T12:00:00.000Z"}\'' },
    { title: 'Invalid throws',    code: "new Date('nonsense').toISOString()",              returns: 'RangeError: Invalid time value' },
    { title: 'But toString does not', code: "new Date('nonsense').toString()",             returns: "'Invalid Date'" },
  ],

  pitfalls: [
    {
      name: 'It throws on an invalid Date',
      desc: 'Every other formatting method returns "Invalid Date" as a string. This one throws RangeError, so serialising a date that came from user input or a failed parse can crash a request handler rather than producing bad output.',
      wrong: { label: 'Throws', code: "new Date(userInput).toISOString()", output: 'RangeError: Invalid time value' },
      fix:   { label: 'Validate first', code: 'const d = new Date(userInput);\nif (Number.isNaN(d.getTime())) reject();\nd.toISOString();', output: 'safe' },
    },
    {
      name: 'Date-only and date-time strings parse differently',
      desc: 'The specification treats a bare date as UTC and a date with a time but no offset as LOCAL. So "2026-03-15" and "2026-03-15T00:00" are different instants, and the off-by-one-day bug that follows is the most-reported Date issue there is.',
      wrong: { label: 'Local, may shift a day', code: "new Date('2026-03-15T00:00').toISOString().slice(0, 10)", output: "'2026-03-14' east of UTC" },
      fix:   { label: 'Be explicit',            code: "new Date('2026-03-15T00:00Z').toISOString().slice(0, 10)", output: "'2026-03-15'" },
    },
    {
      name: 'It always converts to UTC',
      desc: 'That is the point, and it means the date part may not be the local date. Slicing the first ten characters to get "today" gives the wrong day for anyone whose local date differs from the UTC date at that moment.',
      wrong: { label: 'UTC day, not local', code: 'new Date().toISOString().slice(0, 10)', output: 'may be yesterday or tomorrow locally' },
      fix:   { label: 'Local day',          code: "new Date().toLocaleDateString('sv-SE')", output: 'local YYYY-MM-DD' },
    },
    {
      name: 'Years outside four digits use the extended form',
      desc: 'Before year 0 or after 9999 the output switches to a six-digit signed year with a leading plus or minus. Code that slices fixed offsets, or a database column sized for 24 characters, breaks on those.',
      wrong: { label: 'Different length', code: 'new Date(Date.UTC(10000, 0, 1)).toISOString()', output: "'+010000-01-01T00:00:00.000Z'" },
      fix:   { label: 'Parse, do not slice', code: 'new Date(s).getUTCFullYear()', output: '10000' },
    },
  ],

  when: {
    use: [
      'Storing a date in a database or a file',
      'Sending a date over an API',
      'Logging, where a sortable unambiguous format matters',
      'Comparing dates as strings — ISO sorts correctly as text',
    ],
    avoid: [
      'Showing a date to a person → toLocaleDateString',
      'The Date may be invalid → check getTime first, or it throws',
      'You need the local calendar day → a locale format, not a slice',
      'You need a zone-aware wall-clock time → store the zone separately',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string, always 24 characters for four-digit years',
    cpython:    'V8: Builtins-date-toisostring',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date.parse',                        slug: 'date-parse',          when: 'Reading an ISO string back' },
    { name: 'Date.prototype.toUTCString',        slug: 'date-tostring',       when: 'The older HTTP-style UTC format' },
    { name: 'Date.prototype.toLocaleDateString', slug: 'date-tolocalestring', when: 'Formatting for a reader instead' },
    { name: 'Date UTC methods',                  slug: 'date-utc-methods',    when: 'Reading components on the same basis' },
  ],

  faq: [
    {
      q: 'Why does my date come out a day early?',
      a: 'Almost always because a date-time string without an offset was parsed as local time and then converted back to UTC. Append a Z if the input was meant to be UTC, or use a date-only string, which is parsed as UTC already.',
      code: "new Date('2026-03-15T00:00');    // local\nnew Date('2026-03-15T00:00Z');   // UTC\nnew Date('2026-03-15');          // UTC",
    },
    {
      q: 'Is toJSON the same thing?',
      a: 'It calls toISOString, with one difference: toJSON returns null for an invalid Date instead of throwing. That is why JSON.stringify never crashes on a bad Date while a direct toISOString call does.',
      code: "new Date('nonsense').toJSON();        // null\nnew Date('nonsense').toISOString();   // RangeError",
    },
    {
      q: 'Can I sort ISO strings as text?',
      a: 'Yes, for four-digit years in UTC — the format is designed so lexicographic order matches chronological order. That breaks for the extended year form and for strings with different offsets, so only rely on it for output from this method.',
    },
    {
      q: 'How do I get just the date?',
      a: 'Slice the first ten characters — but remember that is the UTC date, which may not be the reader local date. For a local calendar day, use a locale format with the sv-SE locale, which happens to produce ISO-like output.',
      code: "d.toISOString().slice(0, 10);          // UTC day\nd.toLocaleDateString('sv-SE');         // local day",
    },
  ],

  history: [
    { version: 'ES5',    note: 'toISOString and toJSON added, along with ISO 8601 parsing in Date.parse.' },
    { version: 'ES2016', note: 'Parsing rules clarified: date-only strings are UTC, date-time strings without an offset are local.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString',
    meta:  'Date.prototype.toISOString',
  },

};
