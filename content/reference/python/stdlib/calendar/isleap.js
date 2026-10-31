// content/reference/python/stdlib/calendar/isleap.js

export const meta = {
  slug:        'isleap',
  name:        'calendar.isleap',
  signature:   'calendar.isleap(year)',
  blurb:       'True if the year is a leap year in the Gregorian calendar: divisible by 4, except centuries that are not divisible by 400.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar isleap python leap year check is leap year gregorian divisible by 4 100 400 february 29 days 366 days century rule',
};

export const method = {
  slug:      'isleap',
  name:      'calendar.isleap',
  signature: 'calendar.isleap(year)',
  returns:   { type: 'bool', desc: 'True for a leap year, False otherwise.' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The full Gregorian rule in one call — 2024 yes, 1900 no, 2000 yes. Pure arithmetic on the number you pass, so it works for any integer year, including 0 and negative years.',

  covers: ['isleap'],

  cheat: {
    commonCall: 'calendar.isleap(2024)',
    returns:    'True',
    replaces:   'year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)',
    watchOut:   'pass the year, not a date object',
  },

  parameters: [
    { name: 'year', type: 'int', required: true, default: null, desc: 'Any integer year. Year 0 is 1 BC, -1 is 2 BC (the proleptic Gregorian calendar used by the whole module).' },
  ],

  modes: [
    {
      id: 'check',
      label: 'one year',
      blurb: 'Type a year. The century rule makes 1900 and 2100 ordinary years.',
      params: [{ name: 'year', type: 'int', hint: 'any integer', input: 'number' }],
      template: 'import calendar\ncalendar.isleap({$year})',
      cases: [
        { id: 'y2024', label: '2024', values: { year: '2024' } },
        { id: 'y1900', label: '1900', values: { year: '1900' } },
        { id: 'y2000', label: '2000', values: { year: '2000' } },
        { id: 'y2026', label: '2026', values: { year: '2026' } },
      ],
    },
    {
      id: 'list',
      label: 'leap years in a range',
      blurb: 'Every leap year from start up to (not including) stop.',
      params: [
        { name: 'start', type: 'int', hint: 'first year', input: 'number' },
        { name: 'stop',  type: 'int', hint: 'stop before', input: 'number' },
      ],
      template: 'import calendar\n[y for y in range({$start}, {$stop}) if calendar.isleap(y)]',
      cases: [
        { id: 'now',     label: '2020–2040', values: { start: '2020', stop: '2041' } },
        { id: 'century', label: 'around 1900', values: { start: '1890', stop: '1911' } },
        { id: 'bc',      label: 'around year 0', values: { start: '-8', stop: '9' } },
      ],
    },
  ],
  demoExplainer: 'Around 1900 the list jumps from 1896 to 1904: 1900 is divisible by 4 and by 100 but not by 400, so it is not a leap year. Around year 0 the rule keeps working on plain integers — year 0 (1 BC in the proleptic calendar) and -4 are leap years.',

  patterns: [
    {
      name: 'Days in a year',
      desc: 'True counts as 1 in arithmetic.',
      code: 'import calendar\ndays = 365 + calendar.isleap(year)',
    },
    {
      name: 'Validate a 29 February',
      desc: 'Before building a date from user input.',
      code: 'import calendar\nif month == 2 and day == 29 and not calendar.isleap(year):\n    raise ValueError(f"{year} has no 29 February")',
    },
    {
      name: 'Next leap year',
      desc: 'Walk forward until isleap is true.',
      code: 'import calendar, itertools\nnext_leap = next(y for y in itertools.count(year + 1) if calendar.isleap(y))',
    },
  ],

  examples: [
    { title: 'A leap year and an ordinary one', code: 'import calendar\n(calendar.isleap(2024), calendar.isleap(2023))', returns: '(True, False)' },
    { title: 'The century rule',          code: 'import calendar\n[calendar.isleap(y) for y in (1900, 2000, 2100)]', returns: '[False, True, False]' },
    { title: 'Leap years in a range',     code: 'import calendar\n[y for y in range(2020, 2041) if calendar.isleap(y)]', returns: '[2020, 2024, 2028, 2032, 2036, 2040]' },
    { title: 'Year 0 and negative years', code: 'import calendar\n(calendar.isleap(0), calendar.isleap(-4), calendar.isleap(-100))', returns: '(True, True, False)' },
    { title: 'Days in February',          code: 'import calendar\n28 + calendar.isleap(2024)', returns: '29' },
    { title: 'It returns a real bool',    code: 'import calendar\ntype(calendar.isleap(2024))', returns: "<class 'bool'>" },
  ],

  pitfalls: [
    {
      name: 'Checking only year % 4',
      desc: 'Divisible by 4 is not enough: century years are leap years only when divisible by 400.',
      wrong: { label: 'year % 4 == 0', code: 'year = 1900\nyear % 4 == 0', output: 'True' },
      fix:   { label: 'calendar.isleap', code: 'import calendar\ncalendar.isleap(1900)', output: 'False' },
    },
    {
      name: 'Passing a date instead of a year',
      desc: 'isleap does arithmetic on its argument, so a date object fails inside it. Pass d.year.',
      wrong: { label: 'isleap(date)', code: 'import calendar, datetime\ncalendar.isleap(datetime.date(2024, 5, 1))', output: "TypeError: unsupported operand type(s) for %: 'datetime.date' and 'int'" },
      fix:   { label: 'isleap(date.year)', code: 'import calendar, datetime\ncalendar.isleap(datetime.date(2024, 5, 1).year)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Validating 29 February before building a date',
      'Counting days in a year or in February',
      'Any year, including years datetime cannot represent (0, negative, beyond 9999)',
    ],
    avoid: [
      'Counting leap years in a range → calendar.leapdays (no loop)',
      'Days in a given month → calendar.monthrange(year, month)[1]',
    ],
  },

  notes: {
    cpython:    'Lib/calendar.py: return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)',
    'Calendar': 'Proleptic Gregorian — the 1582 switch from the Julian calendar is ignored, so years before it follow the Gregorian rule too',
    'Types':    'Anything that supports % with ints works; a float year gives a bool as well, a date object raises TypeError',
  },

  related: [
    { name: 'leapdays',   slug: 'leapdays',   when: 'Count leap years between two years' },
    { name: 'monthrange', slug: 'monthrange', when: 'Days in a month, leap Februaries included' },
    { name: 'weekday',    slug: 'weekday',    when: 'Day of the week of a date' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
    { name: 'datetime module', slug: 'datetime', when: 'Dates that know their own length', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a year is a leap year in Python?',
      a: 'import calendar; calendar.isleap(year). It applies the full Gregorian rule: divisible by 4, except century years, which must be divisible by 400.',
    },
    {
      q: 'Why is 1900 not a leap year?',
      a: 'It is divisible by 100 but not by 400. The Gregorian calendar drops three leap days every 400 years (1700, 1800, 1900), keeping 2000. calendar.isleap(1900) is False and isleap(2000) is True.',
    },
    {
      q: 'Does calendar.isleap work for years before 1582?',
      a: 'It answers with the Gregorian rule for any integer — the module uses the proleptic Gregorian calendar and ignores the historical Julian calendar. For historical Julian dates, 1500 would be a leap year; isleap(1500) is False.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.isleap',
    meta:  'calendar.isleap',
  },

};
