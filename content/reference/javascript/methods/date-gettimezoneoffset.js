// content/reference/javascript/methods/date-gettimezoneoffset.js

export const meta = {
  slug:        'date-gettimezoneoffset',
  name:        'Date.prototype.getTimezoneOffset',
  signature:   'date.getTimezoneOffset()',
  blurb:       'Minutes to ADD to local time to reach UTC — so the sign is backwards from how offsets are written.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date getTimezoneOffset timezone offset minutes sign inverted UTC DST daylight saving Intl timeZone javascript',
};

export const method = {
  slug:      'date-gettimezoneoffset',
  name:      'Date.prototype.getTimezoneOffset',
  signature: 'date.getTimezoneOffset()',
  returns:   { type: 'number', desc: 'Minutes that must be ADDED to local time to get UTC. Positive WEST of Greenwich, negative east — the opposite sign to how offsets are conventionally written.' },

  category:    'Date method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The only Date method whose whole purpose is to describe the runtime. Its sign convention is inverted relative to ISO 8601, and its value depends on the date because of daylight saving.',

  cheat: {
    commonCall: 'd.getTimezoneOffset()',
    returns:    'minutes to add to local to get UTC',
    replaces:   'nothing — it is the only way to ask',
    watchOut:   'UTC+2 reports −120, and it CHANGES with the date',
  },

  parameters: [],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'a date — the offset depends on it', input: 'text' },
  ],
  demoTemplate: 'new Date({iso}).getTimezoneOffset()',
  cases: [
    { id: 'summer', label: 'a summer date',   values: { iso: '2026-07-15T12:00:00Z' } },
    { id: 'winter', label: 'a winter date',   values: { iso: '2026-01-15T12:00:00Z' } },
    { id: 'spring', label: 'mid-March',       values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'autumn', label: 'mid-October',     values: { iso: '2026-10-15T12:00:00Z' } },
  ],
  demoExplainer: "This number is YOURS — it describes wherever you are reading this from, so no two readers necessarily see the same output. If you are in UTC it is 0; west of Greenwich it is positive; east it is negative. Compare the summer and winter cases: if they differ, your region observes daylight saving, and the offset is a property of the DATE as much as of the place. That is why caching a single offset and applying it to other dates is wrong.",

  patterns: [
    {
      name: 'Report the offset in ISO form',
      desc: 'Negate it, because the signs are opposite.',
      code: "const o = -d.getTimezoneOffset();\nconst sign = o >= 0 ? '+' : '-';",
    },
    {
      name: 'Name the zone instead',
      desc: 'Far more useful than a number.',
      code: 'Intl.DateTimeFormat().resolvedOptions().timeZone;',
    },
    {
      name: 'Format in a specific zone',
      desc: 'No offset arithmetic at all.',
      code: "d.toLocaleString('en-GB', {timeZone: 'Asia/Tokyo'});",
    },
  ],

  examples: [
    { title: 'UTC',              code: 'new Date().getTimezoneOffset()', returns: '0 in UTC' },
    { title: 'New York in winter',code: 'new Date("2026-01-15").getTimezoneOffset()', returns: '300 there — UTC−5' },
    { title: 'Berlin in summer', code: 'new Date("2026-07-15").getTimezoneOffset()', returns: '−120 there — UTC+2' },
    { title: 'It varies by date',code: 'new Date("2026-01-15").getTimezoneOffset() !== new Date("2026-07-15").getTimezoneOffset()', returns: 'true where DST applies' },
    { title: 'The zone name',    code: 'Intl.DateTimeFormat().resolvedOptions().timeZone', returns: "'Europe/Berlin', for example" },
    { title: 'No UTC variant',   code: 'typeof new Date().getUTCTimezoneOffset', returns: "'undefined'" },
  ],

  pitfalls: [
    {
      name: 'The sign is inverted',
      desc: 'It returns the minutes to ADD to local time to reach UTC, so a zone written as UTC+2 reports −120. Every piece of code that builds an ISO offset string from this value needs a negation, and forgetting it puts the timestamp twice the offset away from where it should be.',
      wrong: { label: 'Backwards', code: 'new Date().getTimezoneOffset()', output: '−120 in a UTC+2 zone' },
      fix:   { label: 'Negate for display', code: '-new Date().getTimezoneOffset()', output: '120, matching UTC+2' },
    },
    {
      name: 'It depends on the date, not just the place',
      desc: 'Daylight saving means one location has two offsets a year. Reading the offset once at startup and applying it to other dates is wrong for half the year, and the bug appears on a schedule nobody is testing against.',
      wrong: { label: 'Cached', code: 'const OFFSET = new Date().getTimezoneOffset();', output: 'wrong after the DST change' },
      fix:   { label: 'Per date', code: 'const offset = someDate.getTimezoneOffset();', output: 'correct for that date' },
    },
    {
      name: 'It is minutes, not hours',
      desc: 'And not always a whole number of hours — India is UTC+5:30 and reports −330, Nepal is UTC+5:45. Dividing by 60 and truncating loses the fraction for hundreds of millions of people.',
      wrong: { label: 'Loses the half hour', code: 'Math.trunc(-330 / 60)', output: '−5' },
      fix:   { label: 'Keep the minutes',    code: '`${Math.trunc(330 / 60)}:${330 % 60}`', output: "'5:30'" },
    },
    {
      name: 'An offset is not a timezone',
      desc: 'Two regions can share an offset today and diverge in a month because their DST rules differ. Storing the offset loses the information needed to render any other date correctly — store the IANA zone name instead.',
      wrong: { label: 'Ambiguous', code: 'save({offset: -120})', output: 'which zone was that?' },
      fix:   { label: 'Store the name', code: "save({tz: Intl.DateTimeFormat().resolvedOptions().timeZone})", output: "'Europe/Berlin'" },
    },
  ],

  when: {
    use: [
      'Reporting or logging the runtime offset for diagnostics',
      'Building an ISO offset suffix, with the sign negated',
      'Detecting whether the runtime is in UTC',
    ],
    avoid: [
      'Converting between timezones → Intl with a timeZone option',
      'Storing a user timezone → the IANA zone name',
      'Assuming whole hours → some zones are offset by 30 or 45 minutes',
      'Caching the value → it changes across DST boundaries',
    ],
  },

  notes: {
    complexity: 'O(1), with a timezone-database lookup',
    return:     'A number of minutes; NaN for an invalid Date',
    cpython:    'V8: Builtins-date-gettimezoneoffset / ICU timezone data',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the value reflects the process timezone setting',
  },

  related: [
    { name: 'Date UTC methods',                  slug: 'date-utc-methods',    when: 'Avoiding local time altogether' },
    { name: 'Date getters',                      slug: 'date-getters',        when: 'The local components this offset explains' },
    { name: 'Date.prototype.toLocaleDateString', slug: 'date-tolocalestring', when: 'Formatting in a named timezone properly' },
    { name: 'Date.prototype.toISOString',        slug: 'date-toisostring',    when: 'The UTC form, free of offsets' },
  ],

  faq: [
    {
      q: 'Why is the sign backwards?',
      a: 'Because the method is defined as the adjustment needed to get from local time TO UTC, not the offset of local time from UTC. Those are opposites. ISO 8601 writes +02:00 for a zone that this method reports as −120.',
      code: 'const isoOffsetMinutes = -d.getTimezoneOffset();',
    },
    {
      q: 'How do I get the user timezone name?',
      a: 'From Intl, not from Date. The resolved options of a DateTimeFormat give the IANA name, which is what you should store — it carries the DST rules that a bare offset does not.',
      code: 'Intl.DateTimeFormat().resolvedOptions().timeZone;   // "Europe/Berlin"',
    },
    {
      q: 'How do I convert a date to another timezone?',
      a: 'Do not do the arithmetic yourself — format it with a timeZone option. Date has no notion of a timezone other than the runtime one, so any manual conversion has to reimplement DST rules.',
      code: "d.toLocaleString('en-GB', {timeZone: 'Asia/Tokyo'});",
    },
    {
      q: 'Why does it change between January and July?',
      a: 'Daylight saving. The offset is a property of an instant in a place, not of the place alone, which is why the method is on a Date instance rather than being a static.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'getTimezoneOffset present from the first version, with the inverted sign convention.' },
    { version: 'ES2012', note: 'ECMA-402 added Intl, giving access to named timezones and making manual offset arithmetic unnecessary.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset',
    meta:  'Date.prototype.getTimezoneOffset',
  },

  tryInTool: [],
};
