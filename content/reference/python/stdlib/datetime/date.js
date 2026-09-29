// content/reference/python/stdlib/datetime/date.js — the date class

export const meta = {
  slug:        'date',
  name:        'datetime.date',
  signature:   'date(year, month, day)',
  blurb:       'A calendar date — year, month, day — with no time and no time zone. Validated on construction; supports date ± timedelta and date - date.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date class python date object create date days between two dates add days to date compare dates day is out of range for month month must be in 1..12 year is out of range',
};

export const method = {
  slug:      'date',
  name:      'datetime.date',
  signature: 'date(year, month, day)',
  returns:   { type: 'date', desc: 'An immutable, hashable calendar date in the proleptic Gregorian calendar.' },

  category:    'datetime class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The simplest of the five types: three validated integers. Dates subtract to a timedelta, add whole days from a timedelta, sort and hash — and never mix with datetime.',

  covers: ['date'],

  cheat: {
    commonCall: 'date(2026, 9, 29)',
    returns:    'datetime.date(2026, 9, 29)',
    replaces:   '(year, month, day) tuples and "YYYY-MM-DD" strings',
    watchOut:   'date + timedelta ignores the hours part',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'MINYEAR (1) to MAXYEAR (9999).' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1 to 12.' },
    { name: 'day',   type: 'int', required: true, default: null, desc: '1 to the number of days in that month (29 February only in leap years).' },
  ],

  modes: [
    {
      id: 'construct',
      label: 'construct',
      blurb: 'Build a date and look at it three ways: repr, ISO text, and the weekday (0 = Monday).',
      params: [
        { name: 'year',  type: 'int', hint: 'year',  input: 'number' },
        { name: 'month', type: 'int', hint: 'month', input: 'number' },
        { name: 'day',   type: 'int', hint: 'day',   input: 'number' },
      ],
      template: "from datetime import date\nd = date({$year}, {$month}, {$day})\n(d, d.isoformat(), d.strftime('%A'))",
      cases: [
        { id: 'ok',    label: 'valid',          values: { year: '2026', month: '9', day: '29' } },
        { id: 'leap',  label: 'leap day',       values: { year: '2028', month: '2', day: '29' } },
        { id: 'noleap', label: 'not a leap year', values: { year: '2100', month: '2', day: '29' } },
        { id: 'month', label: 'month 13',       values: { year: '2026', month: '13', day: '1' } },
        { id: 'year',  label: 'year 10000',     values: { year: '10000', month: '1', day: '1' } },
      ],
    },
    {
      id: 'arith',
      label: 'arithmetic',
      blurb: 'Add days to a date, and measure the gap between two dates.',
      params: [
        { name: 'start', type: 'str', hint: 'YYYY-MM-DD', input: 'text' },
        { name: 'days',  type: 'int', hint: 'days to add', input: 'number' },
      ],
      template: 'from datetime import date, timedelta\nstart = date.fromisoformat({$start})\nend = start + timedelta(days={$days})\n(end, end - start, end > start)',
      cases: [
        { id: 'month', label: 'into next month', values: { start: '2026-09-29', days: '5' } },
        { id: 'year',  label: 'a year back',     values: { start: '2024-02-29', days: '-366' } },
        { id: 'edge',  label: 'past 9999',       values: { start: '9999-12-31', days: '1' } },
      ],
    },
  ],
  demoExplainer: 'The checks run in argument order, so year 10000 reports the year before anything else. 2100 is divisible by 4 but also by 100 and not by 400, so it is not a leap year. Going past 9999-12-31 raises OverflowError: date value out of range.',

  patterns: [
    {
      name: 'Days until an event',
      desc: 'date - date → timedelta; .days is the count.',
      code: 'from datetime import date\ndays_left = (date(2026, 12, 25) - date.today()).days',
    },
    {
      name: 'Iterate over a date range',
      desc: 'timedelta steps; the end is exclusive here.',
      code: 'from datetime import timedelta\nday = start\nwhile day < end:\n    print(day)\n    day += timedelta(days=1)',
    },
    {
      name: 'Dates as dict keys',
      desc: 'Dates are hashable and compare by value.',
      code: 'from collections import Counter\nper_day = Counter(event.at.date() for event in events)',
    },
  ],

  examples: [
    { title: 'Construct',                    code: 'from datetime import date\ndate(2026, 9, 29)', returns: 'datetime.date(2026, 9, 29)' },
    { title: 'Gap between two dates',        code: 'from datetime import date\ndate(2026, 9, 29) - date(2026, 1, 1)', returns: 'datetime.timedelta(days=271)' },
    { title: 'Adding days crosses months',   code: 'from datetime import date, timedelta\ndate(2026, 3, 31) + timedelta(days=30)', returns: 'datetime.date(2026, 4, 30)' },
    { title: 'Only whole days are used',     code: 'from datetime import date, timedelta\ndate(2026, 9, 29) + timedelta(days=1, hours=23)', returns: 'datetime.date(2026, 9, 30)' },
    { title: 'Sorting and max',              code: 'from datetime import date\nsorted([date(2026, 12, 25), date(2026, 1, 1), date(2026, 9, 29)])', returns: '[datetime.date(2026, 1, 1), datetime.date(2026, 9, 29), datetime.date(2026, 12, 25)]' },
    { title: 'str() is ISO',                 code: 'from datetime import date\nstr(date(2026, 9, 29))', returns: "'2026-09-29'" },
    { title: 'A string is not a date',       code: "from datetime import date\ndate('2026-09-29')", returns: "TypeError: 'str' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Adding an int',
      desc: 'Dates do not know what unit an int would be. Say days explicitly.',
      wrong: { label: 'date + 1', code: 'from datetime import date\ndate(2026, 9, 29) + 1', output: "TypeError: unsupported operand type(s) for +: 'datetime.date' and 'int'" },
      fix:   { label: '+ timedelta(days=1)', code: 'from datetime import date, timedelta\ndate(2026, 9, 29) + timedelta(days=1)', output: 'datetime.date(2026, 9, 30)' },
    },
    {
      name: 'Comparing a date with a datetime',
      desc: 'Although datetime subclasses date, ordering them raises TypeError (== is simply False). Convert one side first.',
      wrong: { label: 'date < datetime', code: 'from datetime import date, datetime\ndate(2026, 9, 29) < datetime(2026, 9, 1)', output: "TypeError: '<' not supported between instances of 'datetime.date' and 'datetime.datetime'" },
      fix:   { label: '.date()', code: 'from datetime import date, datetime\ndate(2026, 9, 29) < datetime(2026, 9, 1).date()', output: 'False' },
    },
    {
      name: '"Same date next year" with 365 days',
      desc: 'A year that contains 29 February is 366 days long, so +365 lands a day early. Change the year field instead (and decide what 29 February itself should become).',
      wrong: { label: '+ 365 days', code: 'from datetime import date, timedelta\ndate(2027, 3, 1) + timedelta(days=365)', output: 'datetime.date(2028, 2, 29)' },
      fix:   { label: 'replace(year=…)', code: 'from datetime import date\ndate(2027, 3, 1).replace(year=2028)', output: 'datetime.date(2028, 3, 1)' },
    },
  ],

  when: {
    use: [
      'Birthdays, due dates, holidays, report days — anything without a time of day',
      'Grouping timestamps by day (dt.date())',
    ],
    avoid: [
      'A moment in time → datetime (aware)',
      'Dates before year 1 or after 9999 → store ordinals or use another library',
    ],
  },

  notes: {
    cpython:      'PyDateTime_Date in Modules/_datetimemodule.c — 4 bytes of data plus a cached hash',
    'Calendar':   'Proleptic Gregorian: the Gregorian rules applied backwards to year 1; ordinal 1 is 0001-01-01',
    'Arithmetic': 'date ± timedelta (days only), date - date → timedelta; everything else with an int raises TypeError',
    'Ordering':   'date vs datetime: == is False and < raises TypeError',
  },

  related: [
    { name: 'year / month / day', slug: 'date-attributes', when: 'Read the fields' },
    { name: 'today', slug: 'today-now', when: 'The current local date' },
    { name: 'weekday', slug: 'weekday', when: 'Day of the week' },
    { name: 'replace', slug: 'replace', when: 'Change one field' },
    { name: 'timedelta', slug: 'timedelta', when: 'Add and subtract days' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I calculate the number of days between two dates?',
      a: '(later - earlier).days — subtracting dates gives a timedelta, and .days is the whole-day difference (negative if the first date is earlier).',
    },
    {
      q: 'How do I create a date from a string?',
      a: 'date.fromisoformat("2026-09-29") for ISO text, or datetime.strptime(text, "%d/%m/%Y").date() for any other layout. The date() constructor itself only takes three integers.',
    },
    {
      q: 'What is the difference between date and datetime?',
      a: 'date is year, month, day only. datetime adds hour, minute, second, microsecond and an optional tzinfo. datetime is a subclass of date, but the two cannot be ordered against each other.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#date-objects',
    meta:  'date objects',
  },
};
