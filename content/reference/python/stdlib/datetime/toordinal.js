// content/reference/python/stdlib/datetime/toordinal.js — date.toordinal / date.fromordinal

export const meta = {
  slug:        'toordinal',
  name:        'date.toordinal / fromordinal',
  signature:   'd.toordinal()',
  blurb:       'Convert a date to its proleptic Gregorian day number (0001-01-01 is day 1) and back.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date.toordinal date.fromordinal toordinal fromordinal ordinal day number proleptic gregorian julian day count date to integer integer to date python ordinal must be >= 1',
};

export const method = {
  slug:      'toordinal',
  name:      'date.toordinal / fromordinal',
  signature: 'd.toordinal()',
  returns:   { type: 'int', desc: 'toordinal: day number, 1 for 0001-01-01. fromordinal(n): the date with that number.' },

  category:    'date method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'A date as one integer: consecutive days get consecutive numbers, so ordinals subtract, sort and store trivially. fromordinal (a class method, also usable on datetime) goes back.',

  covers: ['date.toordinal', 'date.fromordinal'],

  cheat: {
    commonCall: 'date(2026, 9, 29).toordinal()',
    returns:    '739888',
    replaces:   'Home-made day counts from an arbitrary epoch',
    watchOut:   'Not the astronomical Julian Day Number (that starts in 4713 BC)',
  },

  parameters: [
    { name: 'ordinal', type: 'int', required: true, default: null, desc: 'fromordinal only: 1 to 3652059 (date.max). Floats are rejected.' },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'both ways',
      blurb: 'Date → ordinal, then ordinal + n → date.',
      params: [
        { name: 'when', type: 'str', hint: 'YYYY-MM-DD', input: 'text' },
        { name: 'n',    type: 'int', hint: 'days to add to the ordinal', input: 'number' },
      ],
      template: 'from datetime import date\nn = date.fromisoformat({$when}).toordinal()\n(n, date.fromordinal(n + {$n}))',
      cases: [
        { id: 'today', label: '+0',          values: { when: '2026-09-29', n: '0' } },
        { id: 'year',  label: '+365',        values: { when: '2026-09-29', n: '365' } },
        { id: 'first', label: 'day 1 − 1',   values: { when: '0001-01-01', n: '-1' } },
      ],
    },
  ],
  demoExplainer: '0001-01-01 is ordinal 1, so going one day earlier asks for ordinal 0: ValueError: ordinal must be >= 1.',

  patterns: [
    {
      name: 'Store dates as integers',
      desc: 'Compact, sortable and exact.',
      code: 'day_number = d.toordinal()\nd_again = date.fromordinal(day_number)',
    },
    {
      name: 'Days between dates without timedelta',
      desc: 'Plain int subtraction.',
      code: 'gap = b.toordinal() - a.toordinal()',
    },
  ],

  examples: [
    { title: 'To an ordinal',          code: 'from datetime import date\ndate(2026, 9, 29).toordinal()', returns: '739888' },
    { title: 'And back',               code: 'from datetime import date\ndate.fromordinal(739888)', returns: 'datetime.date(2026, 9, 29)' },
    { title: 'Day 1',                  code: 'from datetime import date\ndate.fromordinal(1)', returns: 'datetime.date(1, 1, 1)' },
    { title: 'On datetime: midnight',  code: 'from datetime import datetime\ndatetime.fromordinal(739888)', returns: 'datetime.datetime(2026, 9, 29, 0, 0)' },
    { title: 'The time part is ignored', code: 'from datetime import datetime\ndatetime(2026, 9, 29, 23, 59).toordinal()', returns: '739888' },
    { title: 'Out of range',           code: 'from datetime import date\ndate.fromordinal(3652060)', returns: 'ValueError: year 10000 is out of range' },
  ],

  pitfalls: [
    {
      name: 'Passing a float ordinal',
      desc: 'Ordinals are whole days; a float (from division, or a spreadsheet serial) is rejected. Convert explicitly.',
      wrong: { label: 'float', code: 'from datetime import date\ndate.fromordinal(739888.0)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'int()', code: 'from datetime import date\ndate.fromordinal(int(739888.0))', output: 'datetime.date(2026, 9, 29)' },
    },
    {
      name: 'Treating it as a Julian Day Number',
      desc: 'Astronomical JDN counts from 4713 BC; Python ordinals from 1 AD. The offset is 1721424.5 days — do not mix them.',
      wrong: { label: 'ordinal as JDN', code: 'from datetime import date\ndate(2026, 9, 29).toordinal()', output: '739888' },
      fix:   { label: 'JDN at noon', code: 'from datetime import date\ndate(2026, 9, 29).toordinal() + 1721425', output: '2461313' },
    },
  ],

  when: {
    use: ['Compact integer storage of dates', 'Fast day arithmetic and bucketing'],
    avoid: ['Human-facing output → isoformat', 'Astronomy → a real JDN library'],
  },

  notes: {
    cpython:    'ymd_to_ord / ord_to_ymd in Modules/_datetimemodule.c, the same 400-year-cycle algorithm as Lib/_pydatetime.py',
    'Range':    '1 (0001-01-01) to 3652059 (9999-12-31)',
    'Inherited': 'datetime.fromordinal / datetime.toordinal are the same methods; the datetime result is at midnight',
  },

  related: [
    { name: 'weekday', slug: 'weekday', when: 'weekday() is (ordinal + 6) % 7' },
    { name: 'isocalendar', slug: 'isocalendar', when: 'Another numbering: ISO weeks' },
    { name: 'date', slug: 'date', when: 'The class' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is a proleptic Gregorian ordinal?',
      a: 'The count of days in the Gregorian calendar extended backwards to year 1, with 0001-01-01 as day 1. date.toordinal() returns it and date.fromordinal() reverses it.',
    },
    {
      q: 'How do I convert an Excel serial date?',
      a: 'Excel day 1 is 1900-01-01 (with a fake 29 Feb 1900). For serials after February 1900: date(1899, 12, 30) + timedelta(days=serial) — fromordinal does not apply directly.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.date.toordinal',
    meta:  'date.toordinal',
  },
};
