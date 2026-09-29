// content/reference/python/stdlib/datetime/minyear-maxyear.js — MINYEAR and MAXYEAR

export const meta = {
  slug:        'minyear-maxyear',
  name:        'datetime.MINYEAR / MAXYEAR',
  signature:   'MINYEAR = 1 · MAXYEAR = 9999',
  blurb:       'The smallest and largest year a date or datetime can hold: 1 and 9999.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'MINYEAR MAXYEAR datetime year range python year 0 year 10000 is out of range date value out of range smallest largest year bc dates',
};

export const method = {
  slug:      'minyear-maxyear',
  name:      'datetime.MINYEAR / MAXYEAR',
  signature: 'MINYEAR = 1 · MAXYEAR = 9999',
  returns:   { type: 'int', desc: 'MINYEAR is 1, MAXYEAR is 9999.' },

  category:    'datetime constant',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Four-digit years only: 0001-01-01 to 9999-12-31. Constructing outside that raises ValueError, arithmetic that leaves it raises OverflowError.',

  covers: ['MINYEAR', 'MAXYEAR'],

  cheat: {
    commonCall: 'MINYEAR <= year <= MAXYEAR',
    returns:    'True for every year a date can hold',
    replaces:   'Hard-coded 1 and 9999 in validation code',
    watchOut:   'No year 0 and no BC dates',
  },

  parameters: [],

  modes: [
    {
      id: 'year',
      label: 'year limits',
      blurb: 'Try years around the edges. The error type tells you which check failed.',
      params: [{ name: 'year', type: 'int', hint: 'a year', input: 'number' }],
      template: 'from datetime import date, MINYEAR, MAXYEAR\n(MINYEAR <= {$year} <= MAXYEAR, date({$year}, 1, 1))',
      cases: [
        { id: 'max',   label: '9999',  values: { year: '9999' } },
        { id: 'over',  label: '10000', values: { year: '10000' } },
        { id: 'zero',  label: '0',     values: { year: '0' } },
        { id: 'one',   label: '1',     values: { year: '1' } },
      ],
    },
    {
      id: 'overflow',
      label: 'overflow',
      blurb: 'Arithmetic that leaves the range raises OverflowError instead of ValueError.',
      params: [{ name: 'days', type: 'int', hint: 'days to add to 9999-12-01', input: 'number' }],
      template: 'from datetime import date, timedelta, MAXYEAR\ndate(MAXYEAR, 12, 1) + timedelta(days={$days})',
      cases: [
        { id: 'fits', label: '+30', values: { days: '30' } },
        { id: 'past', label: '+31', values: { days: '31' } },
      ],
    },
  ],
  demoExplainer: 'Construction checks the year first and reports it: "year 10000 is out of range", "year 0 is out of range". Going past the end by arithmetic is a different error — OverflowError: date value out of range.',

  patterns: [
    {
      name: 'Validate user input before constructing',
      desc: 'Give a friendly message instead of the raw ValueError.',
      code: "from datetime import MINYEAR, MAXYEAR\nif not MINYEAR <= year <= MAXYEAR:\n    raise ValueError(f'year must be between {MINYEAR} and {MAXYEAR}')",
    },
    {
      name: 'A far-future sentinel',
      desc: 'For "never expires", prefer date.max over an invented year.',
      code: 'from datetime import date\nexpires = date.max',
    },
  ],

  examples: [
    { title: 'The values',              code: 'from datetime import MINYEAR, MAXYEAR\n(MINYEAR, MAXYEAR)', returns: '(1, 9999)' },
    { title: 'Year 0 does not exist',   code: 'from datetime import date\ndate(0, 1, 1)', returns: 'ValueError: year 0 is out of range' },
    { title: 'Neither does 10000',      code: 'from datetime import date, MAXYEAR\ndate(MAXYEAR + 1, 1, 1)', returns: 'ValueError: year 10000 is out of range' },
    { title: 'Arithmetic overflow',     code: 'from datetime import date, timedelta, MAXYEAR\ndate(MAXYEAR, 12, 31) + timedelta(days=1)', returns: 'OverflowError: date value out of range' },
    { title: 'Ordinal 1 is MINYEAR-01-01', code: 'from datetime import date, MINYEAR\ndate(MINYEAR, 1, 1).toordinal()', returns: '1' },
  ],

  pitfalls: [
    {
      name: 'Using year 0 or 10000 as a placeholder',
      desc: 'Neither is a valid year. Use None for "unknown", or date.min / date.max for open ranges.',
      wrong: { label: 'year 0', code: 'from datetime import date\nunknown = date(0, 1, 1)', output: 'ValueError: year 0 is out of range' },
      fix:   { label: 'date.min', code: 'from datetime import date\nunknown = date.min\nunknown', output: 'datetime.date(1, 1, 1)' },
    },
    {
      name: 'Timestamps near the edge overflow',
      desc: 'Adding an offset or a margin to a max value overflows. Check before adding.',
      wrong: { label: 'max + a day', code: 'from datetime import datetime, timedelta\ndatetime.max + timedelta(days=1)', output: 'OverflowError: date value out of range' },
      fix:   { label: 'guard', code: 'from datetime import datetime, timedelta\nend = datetime.max\nend if end > datetime.max - timedelta(days=1) else end + timedelta(days=1)', output: 'datetime.datetime(9999, 12, 31, 23, 59, 59, 999999)' },
    },
  ],

  when: {
    use: ['Validating year inputs', 'Documenting the supported range of your own API'],
    avoid: ['Historical or astronomical dates outside 1..9999 → another library (e.g. astropy.time)'],
  },

  notes: {
    cpython:   'MINYEAR and MAXYEAR are module-level ints set in Modules/_datetimemodule.c',
    'Errors':  'Constructor: ValueError "year N is out of range". Arithmetic: OverflowError "date value out of range"',
    'Related': 'date.min / date.max / datetime.min / datetime.max are the matching objects',
  },

  related: [
    { name: 'min / max / resolution', slug: 'min-max-resolution', when: 'The boundary objects' },
    { name: 'date', slug: 'date', when: 'Constructor validation' },
    { name: 'OverflowError', slug: 'overflowerror', when: 'What arithmetic past the edge raises', category: 'exceptions' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Can Python datetime represent years before 1 AD or after 9999?',
      a: 'No. MINYEAR is 1 and MAXYEAR is 9999; there is no year 0 and no negative year. Use a specialised library for astronomical or historical ranges.',
    },
    {
      q: 'Why do I get "date value out of range"?',
      a: 'Arithmetic went past 0001-01-01 or 9999-12-31 — often by adding a large timedelta, converting datetime.max to another offset, or subtracting from date.min.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.MINYEAR',
    meta:  'datetime.MINYEAR',
  },
};
