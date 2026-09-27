// content/reference/javascript/methods/date-utc-methods.js
//
// One page for the fifteen getUTC*/setUTC* methods. They mirror the local
// family exactly, so the only thing worth documenting is the difference.

export const meta = {
  slug:        'date-utc-methods',
  name:        'Date UTC methods (getUTCHours, setUTCMonth…)',
  signature:   'date.getUTCHours(), date.getUTCDate(), date.setUTCMonth(m)…',
  blurb:       'The same fifteen methods, on a basis that does not move when your users do.',
  category:    'date',
  type:        'date',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Date getUTCHours getUTCDate getUTCMonth getUTCDay getUTCFullYear getUTCMinutes getUTCSeconds getUTCMilliseconds setUTCMonth setUTCDate setUTCFullYear setUTCHours setUTCMinutes setUTCSeconds setUTCMilliseconds UTC timezone local difference server consistent javascript',
};

export const method = {
  slug:      'date-utc-methods',
  name:      'Date UTC methods (getUTCHours, setUTCMonth…)',
  signature: 'date.getUTCHours(), date.getUTCDate(), date.setUTCMonth(m)…',
  returns:   { type: 'number', desc: 'The same components as the local family, computed in UTC — so the answer is identical everywhere in the world for a given timestamp.' },

  category:    'Date methods',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Fifteen methods that duplicate the local family with UTC as the basis. Reach for these whenever the answer must not depend on where the code happens to run.',

  cheat: {
    commonCall: 'd.getUTCDate()',
    returns:    'the component in UTC',
    replaces:   'the local getters, on a server or in shared data',
    watchOut:   'getUTCMonth is still 0-indexed',
  },

  parameters: [
    { name: 'value', type: 'number', required: false, default: 'none', desc: 'For the setUTC family only. Same rollover behaviour as the local setters — an out-of-range value adjusts the larger components.' },
  ],

  demoParams: [
    { name: 'iso', type: 'string', hint: 'an ISO date, e.g. 2026-03-15T12:00:00Z', input: 'text' },
  ],
  demoTemplate: '(d => [d.getUTCHours(), d.getHours()])(new Date({iso}))',
  cases: [
    { id: 'noon',     label: 'noon UTC',              values: { iso: '2026-03-15T12:00:00Z' } },
    { id: 'midnight', label: 'midnight UTC',          values: { iso: '2026-03-15T00:00:00Z' } },
    { id: 'late',     label: 'late evening UTC (!)',  values: { iso: '2026-03-15T23:00:00Z' } },
    { id: 'early',    label: 'early morning UTC',     values: { iso: '2026-03-15T01:00:00Z' } },
  ],
  demoExplainer: "The pair is [getUTCHours(), getHours()]. The first number is the same for every reader of this page. The second is whatever YOUR timezone makes of that instant — if the two numbers differ, that gap is your UTC offset, and if they happen to match you are reading this from UTC. The third case is the one that causes dated bugs: at 23:00 UTC a reader east of Greenwich is already on the following DAY, so getDate and getUTCDate disagree about the date entirely, not just the hour.",

  patterns: [
    {
      name: 'Consistent date keys',
      desc: 'Group records by UTC day, not the server day.',
      code: 'const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;',
    },
    {
      name: 'Build a UTC date from parts',
      desc: 'Date.UTC avoids the setter dance.',
      code: 'const d = new Date(Date.UTC(2026, 2, 15));',
    },
    {
      name: 'Local time for display only',
      desc: 'Store and compute in UTC, format at the edge.',
      code: "d.toLocaleString(undefined, {timeZone: 'UTC'});",
    },
  ],

  examples: [
    { title: 'UTC hour',             code: "new Date('2026-03-15T12:00:00Z').getUTCHours()", returns: '12' },
    { title: 'UTC month still 0-based', code: "new Date('2026-03-15T12:00:00Z').getUTCMonth()", returns: '2' },
    { title: 'UTC date',             code: "new Date('2026-03-15T23:00:00Z').getUTCDate()", returns: '15' },
    { title: 'Local may differ',     code: "new Date('2026-03-15T23:00:00Z').getDate()", returns: '15 or 16, depending on the runtime' },
    { title: 'setUTCMonth rolls over too', code: "const d = new Date(Date.UTC(2026, 0, 31));\nd.setUTCMonth(1);\nd.toISOString().slice(0, 10)", returns: "'2026-03-03'" },
    { title: 'Date.UTC builds a timestamp', code: 'Date.UTC(2026, 2, 15)', returns: '1773532800000' },
  ],

  pitfalls: [
    {
      name: 'getUTCMonth is still zero-based',
      desc: 'Switching to the UTC family fixes the timezone problem and changes nothing about the indexing. The +1 is still required, and mixing local and UTC methods in one format string is a reliable way to produce a date that is wrong by both a month and a day.',
      wrong: { label: 'Still off by one', code: "`${d.getUTCMonth()}/${d.getUTCDate()}`", output: "'2/15' for 15 March" },
      fix:   { label: 'Add one',          code: "`${d.getUTCMonth() + 1}/${d.getUTCDate()}`", output: "'3/15'" },
    },
    {
      name: 'Mixing local and UTC methods',
      desc: 'Reading the year locally and the month in UTC produces a date that exists in neither basis. Near midnight on 31 December the two disagree about the year, and the result is a full year out.',
      wrong: { label: 'Two bases', code: 'd.getFullYear() + "-" + d.getUTCMonth()', output: 'inconsistent near midnight' },
      fix:   { label: 'Pick one',  code: 'd.getUTCFullYear() + "-" + d.getUTCMonth()', output: 'consistent' },
    },
    {
      name: 'UTC is not the same as "no timezone"',
      desc: 'A timestamp is an instant, and UTC is one way of naming its parts. Storing a wall-clock time that is meant to be local — a 09:00 appointment in Berlin — as UTC loses the intent as soon as daylight saving shifts. For those, store the local time and the timezone name separately.',
      wrong: { label: 'Intent lost', code: 'new Date(Date.UTC(2026, 2, 15, 8))', output: 'an instant, not "09:00 in Berlin"' },
      fix:   { label: 'Store both',  code: "({local: '2026-03-15T09:00', tz: 'Europe/Berlin'})", output: 'intent preserved' },
    },
    {
      name: 'There is no getUTCTimezoneOffset',
      desc: 'It would always be zero, so the method does not exist. getTimezoneOffset is inherently about the runtime, which is why it is the one method with no UTC counterpart.',
      wrong: { label: 'Does not exist', code: 'new Date().getUTCTimezoneOffset()', output: 'TypeError: ...is not a function' },
      fix:   { label: 'It is always 0', code: '0', output: '0' },
    },
  ],

  when: {
    use: [
      'Server-side code, where the machine timezone is an accident',
      'Grouping or bucketing by day across users in different zones',
      'Anything stored, compared or transmitted',
      'Reproducible tests that must not depend on the runner timezone',
    ],
    avoid: [
      'Showing a time to a person → the local getters, or Intl with their timezone',
      'Wall-clock intent that must survive DST → store the zone name too',
      'Formatting → toISOString or toLocaleString',
    ],
  },

  notes: {
    complexity: 'O(1) each, and marginally cheaper than the local family — no timezone lookup',
    return:     'A number from the getters; a timestamp from the setters, which mutate',
    cpython:    'V8: Builtins-date UTC getters and setters',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Date getters',                    slug: 'date-getters',           when: 'The local-time family these mirror' },
    { name: 'Date setters',                    slug: 'date-setters',           when: 'The local setters, with the same rollover' },
    { name: 'Date.UTC',                        slug: 'date-utc',               when: 'Building a UTC timestamp from parts' },
    { name: 'Date.prototype.getTimezoneOffset',slug: 'date-gettimezoneoffset', when: 'The gap between the two bases' },
  ],

  faq: [
    {
      q: 'Should I always use the UTC methods?',
      a: 'On a server, close to it — the machine timezone is usually incidental and letting it leak into stored data causes bugs that only appear after a deployment moves. In the browser, use the local family when showing a time to the person sitting there, and UTC for anything you send or store.',
    },
    {
      q: 'Why is there no getUTCTimezoneOffset?',
      a: 'Because the UTC offset from UTC is zero by definition. getTimezoneOffset is the one method whose entire purpose is to describe the runtime, so it has no UTC counterpart.',
    },
    {
      q: 'Does a Date store a timezone?',
      a: 'No. A Date is a single number — milliseconds since the epoch. There is no timezone inside it. The local getters apply the runtime timezone at the moment you call them, which is why the same Date reports different components on different machines.',
      code: 'new Date().getTime();   // the entire contents of a Date',
    },
  ],

  history: [
    { version: 'ES1', note: 'The UTC getter and setter families present from the first version, mirroring the local ones.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCHours',
    meta:  'Date.prototype.getUTCHours',
  },

  tryInTool: [],
};
