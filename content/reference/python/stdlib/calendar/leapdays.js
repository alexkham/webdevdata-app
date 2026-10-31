// content/reference/python/stdlib/calendar/leapdays.js

export const meta = {
  slug:        'leapdays',
  name:        'calendar.leapdays',
  signature:   'calendar.leapdays(y1, y2)',
  blurb:       'The number of leap years in the range y1 (inclusive) to y2 (exclusive), computed with a formula instead of a loop.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar leapdays python count leap years between two years number of leap days in range exclusive end',
};

export const method = {
  slug:      'leapdays',
  name:      'calendar.leapdays',
  signature: 'calendar.leapdays(y1, y2)',
  returns:   { type: 'int', desc: 'How many years in range(y1, y2) are leap years — negative when y1 > y2.' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Counts like range(): y1 is included, y2 is not. It is a formula of floor divisions by 4, 100 and 400, so the span can be millions of years — and if you swap the arguments you get the count with a minus sign instead of 0.',

  covers: ['leapdays'],

  cheat: {
    commonCall: 'calendar.leapdays(2000, 2024)',
    returns:    '6 (2000, 2004, … 2020 — not 2024)',
    replaces:   'sum(calendar.isleap(y) for y in range(y1, y2))',
    watchOut:   'y2 is excluded; y1 > y2 gives a negative count',
  },

  parameters: [
    { name: 'y1', type: 'int', required: true, default: null, desc: 'First year of the range, counted.' },
    { name: 'y2', type: 'int', required: true, default: null, desc: 'End of the range, not counted.' },
  ],

  modes: [
    {
      id: 'count',
      label: 'count',
      blurb: 'Leap years from y1 up to, not including, y2.',
      params: [
        { name: 'y1', type: 'int', hint: 'first year (counted)', input: 'number' },
        { name: 'y2', type: 'int', hint: 'end year (not counted)', input: 'number' },
      ],
      template: 'import calendar\ncalendar.leapdays({$y1}, {$y2})',
      cases: [
        { id: 'since2000', label: '2000 → 2024', values: { y1: '2000', y2: '2024' } },
        { id: 'incl',      label: '2000 → 2025', values: { y1: '2000', y2: '2025' } },
        { id: 'century',   label: '1900 → 2000', values: { y1: '1900', y2: '2000' } },
        { id: 'reversed',  label: 'reversed',    values: { y1: '2024', y2: '2000' } },
      ],
    },
    {
      id: 'loop',
      label: 'vs a loop',
      blurb: 'The formula next to counting isleap() year by year.',
      params: [
        { name: 'y1', type: 'int', hint: 'first year', input: 'number' },
        { name: 'y2', type: 'int', hint: 'end year',   input: 'number' },
      ],
      template: 'import calendar\n(calendar.leapdays({$y1}, {$y2}), sum(calendar.isleap(y) for y in range({$y1}, {$y2})))',
      cases: [
        { id: 'same',     label: '1600 → 2026', values: { y1: '1600', y2: '2026' } },
        { id: 'reversed', label: 'reversed',    values: { y1: '2026', y2: '1600' } },
      ],
    },
  ],
  demoExplainer: 'For 2000 → 2024 the answer is 6 (2000, 2004, 2008, 2012, 2016, 2020); moving the end to 2025 brings 2024 in. 1700, 1800 and 1900 are not leap years, so 1600 → 2026 gives 104 both ways. Reversed, the loop over an empty range counts 0 while leapdays returns -104.',

  patterns: [
    {
      name: 'Days between two 1 January dates',
      desc: '365 per year plus one per leap year.',
      code: 'import calendar\ndays = 365 * (y2 - y1) + calendar.leapdays(y1, y2)',
    },
    {
      name: 'Inclusive count',
      desc: 'Add 1 to the end year to include it.',
      code: 'import calendar\nn = calendar.leapdays(first, last + 1)',
    },
    {
      name: 'Order-independent count',
      desc: 'Sort the years first if they can come either way.',
      code: 'import calendar\nn = calendar.leapdays(min(a, b), max(a, b))',
    },
  ],

  examples: [
    { title: 'Leap years since 2000',      code: 'import calendar\ncalendar.leapdays(2000, 2024)', returns: '6' },
    { title: 'The end year is excluded',   code: 'import calendar\n(calendar.leapdays(2000, 2024), calendar.leapdays(2000, 2025))', returns: '(6, 7)' },
    { title: 'A century without 1900',     code: 'import calendar\ncalendar.leapdays(1900, 2000)', returns: '24' },
    { title: 'Swapped arguments',          code: 'import calendar\ncalendar.leapdays(2024, 2000)', returns: '-6' },
    { title: 'Days between 1 January dates', code: 'import calendar, datetime\n(365 * 26 + calendar.leapdays(2000, 2026), (datetime.date(2026, 1, 1) - datetime.date(2000, 1, 1)).days)', returns: '(9497, 9497)' },
    { title: 'No loop, any span',          code: 'import calendar\ncalendar.leapdays(1, 1_000_001)', returns: '242500' },
  ],

  pitfalls: [
    {
      name: 'Expecting the end year to count',
      desc: 'Like range(), the second year is a stop value. 2020 → 2024 counts 2020 only.',
      wrong: { label: 'leapdays(2020, 2024)', code: 'import calendar\ncalendar.leapdays(2020, 2024)', output: '1' },
      fix:   { label: 'leapdays(2020, 2025)', code: 'import calendar\ncalendar.leapdays(2020, 2025)', output: '2' },
    },
    {
      name: 'Arguments in the wrong order',
      desc: 'There is no check that y1 <= y2 (the docstring just assumes it); a backwards range gives a negative number.',
      wrong: { label: 'later year first', code: 'import calendar\ncalendar.leapdays(2026, 2000)', output: '-7' },
      fix:   { label: 'earlier year first', code: 'import calendar\ncalendar.leapdays(2000, 2026)', output: '7' },
    },
  ],

  when: {
    use: [
      'Counting leap days between two years without a loop',
      'Day counts across whole years: 365 * years + leapdays',
    ],
    avoid: [
      'Is one year a leap year → calendar.isleap',
      'Days between two arbitrary dates → subtract datetime.date objects',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: y1 -= 1; y2 -= 1; return (y2//4 - y1//4) - (y2//100 - y1//100) + (y2//400 - y1//400)',
    'Range':   'Half-open [y1, y2) — the same convention as range()',
    'Negative': 'y1 > y2 is not rejected; the result is minus the count for the swapped range',
  },

  related: [
    { name: 'isleap',     slug: 'isleap',     when: 'One year' },
    { name: 'monthrange', slug: 'monthrange', when: 'Days in a month' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
    { name: 'range()',    slug: 'range',      when: 'The same half-open convention', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I count leap years between two years in Python?',
      a: 'calendar.leapdays(y1, y2) counts the leap years from y1 up to but not including y2. Use leapdays(first, last + 1) to include the last year.',
    },
    {
      q: 'Why does calendar.leapdays return a negative number?',
      a: 'The first year was larger than the second. leapdays does not sort its arguments; leapdays(2026, 2000) is -7, the negative of leapdays(2000, 2026).',
    },
    {
      q: 'Is leapdays faster than looping with isleap?',
      a: 'Yes — it is a constant-time formula of floor divisions by 4, 100 and 400, so leapdays(1, 1_000_001) returns 242500 instantly while a loop would test a million years.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.leapdays',
    meta:  'calendar.leapdays',
  },

};
