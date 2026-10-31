// content/reference/python/stdlib/calendar/itermonthdates.js — Calendar.iterweekdays and the itermonth* generators

export const meta = {
  slug:        'itermonthdates',
  name:        'Calendar.itermonthdates / itermonthdays…',
  signature:   'cal.itermonthdates(year, month) · cal.itermonthdays(year, month) · cal.itermonthdays2/3/4(year, month) · cal.iterweekdays()',
  blurb:       'Generators over every day of a month view — complete weeks, so the days of neighbouring months are included — as dates, day numbers or tuples.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+ (itermonthdays3 / itermonthdays4: 3.7+)',
  searchTerms: 'Calendar.itermonthdates Calendar.itermonthdays Calendar.itermonthdays2 Calendar.itermonthdays3 Calendar.itermonthdays4 Calendar.iterweekdays itermonthdates itermonthdays iterweekdays iterate days of month complete weeks generator',
};

export const method = {
  slug:      'itermonthdates',
  name:      'Calendar.itermonthdates / itermonthdays…',
  signature: 'cal.itermonthdates(year, month) · cal.itermonthdays(year, month) · cal.itermonthdays2/3/4(year, month) · cal.iterweekdays()',
  returns:   { type: 'generator', desc: 'date objects (itermonthdates), ints with 0 for other months (itermonthdays), (day, weekday) (…days2), (year, month, day) (…days3), (year, month, day, weekday) (…days4); iterweekdays yields 7 weekday numbers.' },

  category:    'Calendar method',
  version:     'Python 2.5+ (itermonthdays3 / itermonthdays4: 3.7+)',
  hasLiveDemo: true,

  subtitle: 'The raw material of every layout: one value per cell of a month grid, always a whole number of weeks. Pick the shape you need — the tuple forms work for any year, the date form only within datetime\'s 1–9999.',

  covers: ['Calendar.iterweekdays', 'Calendar.itermonthdates', 'Calendar.itermonthdays', 'Calendar.itermonthdays2', 'Calendar.itermonthdays3', 'Calendar.itermonthdays4'],

  cheat: {
    commonCall: 'list(calendar.Calendar().itermonthdays3(2026, 10))[:4]',
    returns:    '[(2026, 9, 28), (2026, 9, 29), (2026, 9, 30), (2026, 10, 1)]',
    replaces:   'looping over range(1, ndays + 1) and padding the first and last week yourself',
    watchOut:   'generators: no len(), single use',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'Any integer year (itermonthdates: the neighbouring days must still be in 1–9999).' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1–12; anything else raises calendar.IllegalMonthError when iteration starts.' },
  ],

  modes: [
    {
      id: 'days',
      label: 'itermonthdays',
      blurb: 'Day numbers, 0 for the cells that belong to the previous or next month.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\nlist(calendar.Calendar({$first}).itermonthdays({$year}, {$month}))',
      cases: [
        { id: 'feb', label: 'Feb 2026',          values: { first: '0', year: '2026', month: '2' } },
        { id: 'sun', label: 'Feb 2026, Sunday',  values: { first: '6', year: '2026', month: '2' } },
      ],
    },
    {
      id: 'days2',
      label: 'itermonthdays2',
      blurb: '(day, weekday) for the first week.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\nlist(calendar.Calendar({$first}).itermonthdays2({$year}, {$month}))[:7]',
      cases: [
        { id: 'oct', label: 'Oct 2026',         values: { first: '0', year: '2026', month: '10' } },
        { id: 'sun', label: 'Oct 2026, Sunday', values: { first: '6', year: '2026', month: '10' } },
      ],
    },
    {
      id: 'days4',
      label: 'itermonthdays4',
      blurb: '(year, month, day, weekday) for the first week — the neighbouring month\'s days are real dates here.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\nlist(calendar.Calendar({$first}).itermonthdays4({$year}, {$month}))[:7]',
      cases: [
        { id: 'oct', label: 'Oct 2026', values: { first: '6', year: '2026', month: '10' } },
        { id: 'jan', label: 'Jan 2026', values: { first: '0', year: '2026', month: '1' } },
        { id: 'y1',  label: 'Jan of year 1', values: { first: '6', year: '1', month: '1' } },
      ],
    },
    {
      id: 'dates',
      label: 'itermonthdates',
      blurb: 'datetime.date objects for the first three cells.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: '1–9999',            input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\nlist(calendar.Calendar({$first}).itermonthdates({$year}, {$month}))[:3]',
      cases: [
        { id: 'oct', label: 'Oct 2026',      values: { first: '0', year: '2026', month: '10' } },
        { id: 'y1',  label: 'Jan of year 1', values: { first: '6', year: '1', month: '1' } },
      ],
    },
  ],
  demoExplainer: 'In January of year 1 with Sunday first, the grid starts on 31 December of year 0. itermonthdays4 reports it as (0, 12, 31, 6) without complaint, but itermonthdates has to build datetime.date(0, 12, 31) and fails — the docs point out that the tuple forms are "not restricted by the datetime.date range". January 2026 starts on a Thursday, so its first week also begins in December 2025.',

  patterns: [
    {
      name: 'Only the days of the month',
      desc: 'Skip the padding by month (dates) or by 0 (day numbers).',
      code: 'import calendar\ndays = [d for d in calendar.Calendar().itermonthdates(2026, 10) if d.month == 10]',
    },
    {
      name: 'Group into weeks',
      desc: 'monthdays2calendar does this for you, or batch the generator yourself (3.12+).',
      code: 'import calendar, itertools\nweeks = list(itertools.batched(calendar.Calendar().itermonthdays(2026, 10), 7))',
    },
    {
      name: 'Weekday header in calendar order',
      desc: 'iterweekdays follows the object\'s first weekday.',
      code: 'import calendar\nheader = [calendar.day_abbr[i] for i in calendar.Calendar(calendar.SUNDAY).iterweekdays()]',
    },
  ],

  examples: [
    { title: 'iterweekdays',                code: 'import calendar\nlist(calendar.Calendar(calendar.SUNDAY).iterweekdays())', returns: '[6, 0, 1, 2, 3, 4, 5]' },
    { title: 'itermonthdays: 0 is padding', code: 'import calendar\nlist(calendar.Calendar().itermonthdays(2026, 2))[:8]', returns: '[0, 0, 0, 0, 0, 0, 1, 2]' },
    { title: 'itermonthdays2: (day, weekday)', code: 'import calendar\nlist(calendar.Calendar().itermonthdays2(2026, 10))[:5]', returns: '[(0, 0), (0, 1), (0, 2), (1, 3), (2, 4)]' },
    { title: 'itermonthdays3: real neighbour dates', code: 'import calendar\nlist(calendar.Calendar().itermonthdays3(2026, 10))[:4]', returns: '[(2026, 9, 28), (2026, 9, 29), (2026, 9, 30), (2026, 10, 1)]' },
    { title: 'itermonthdays4: with the weekday', code: 'import calendar\nlist(calendar.Calendar().itermonthdays4(2026, 10))[-2:]', returns: '[(2026, 10, 31, 5), (2026, 11, 1, 6)]' },
    { title: 'itermonthdates: date objects', code: 'import calendar\nnext(calendar.Calendar().itermonthdates(2026, 10))', returns: 'datetime.date(2026, 9, 28)' },
    { title: 'Always whole weeks',          code: 'import calendar\nlen(list(calendar.Calendar().itermonthdates(2026, 10)))', returns: '35' },
    { title: 'Before year 1',               code: 'import calendar\nlist(calendar.Calendar(calendar.SUNDAY).itermonthdates(1, 1))', returns: 'ValueError: year 0 is out of range' },
  ],

  pitfalls: [
    {
      name: 'Calling len() on a generator',
      desc: 'The iter* methods are generators; make a list first.',
      wrong: { label: 'len(generator)', code: 'import calendar\nlen(calendar.Calendar().itermonthdays(2026, 10))', output: "TypeError: object of type 'generator' has no len()" },
      fix:   { label: 'len(list(...))', code: 'import calendar\nlen(list(calendar.Calendar().itermonthdays(2026, 10)))', output: '35' },
    },
    {
      name: 'Iterating the same generator twice',
      desc: 'The second pass finds it already exhausted.',
      wrong: { label: 'reuse', code: 'import calendar\ndays = calendar.Calendar().itermonthdays(2026, 10)\nfirst = list(days)\nsecond = list(days)\nlen(second)', output: '0' },
      fix:   { label: 'store a list', code: 'import calendar\ndays = list(calendar.Calendar().itermonthdays(2026, 10))\nfirst = list(days)\nsecond = list(days)\nlen(second)', output: '35' },
    },
    {
      name: 'Counting the neighbour days',
      desc: 'itermonthdates includes the days of the previous and next month that complete the first and last week.',
      wrong: { label: 'count all', code: 'import calendar\nsum(1 for d in calendar.Calendar().itermonthdates(2026, 10))', output: '35' },
      fix:   { label: 'filter by month', code: 'import calendar\nsum(1 for d in calendar.Calendar().itermonthdates(2026, 10) if d.month == 10)', output: '31' },
    },
  ],

  when: {
    use: [
      'Filling a month view cell by cell (templates, GUIs)',
      'Showing the neighbouring months\' days greyed out — itermonthdays3/4 or itermonthdates',
      'Very old or far-future years — the tuple forms have no year limit',
    ],
    avoid: [
      'Weeks as nested lists → monthdayscalendar / monthdays2calendar / monthdatescalendar',
      'Just the month\'s own days → range(1, monthrange(y, m)[1] + 1)',
    ],
  },

  notes: {
    cpython:     'Lib/calendar.py: itermonthdays3 computes the days before and after from monthrange and the first weekday; itermonthdates wraps each tuple in datetime.date; itermonthdays2/4 add (firstweekday + i) % 7',
    'Laziness':  'All are generators: nothing is computed — and a bad month is not reported — until the first value is requested',
    'Weekday numbers': 'The weekday items are plain ints 0–6, not Day members',
  },

  history: [
    { version: '3.7', note: 'itermonthdays3() and itermonthdays4() added' },
  ],

  related: [
    { name: 'monthdayscalendar …', slug: 'monthdayscalendar', when: 'The same data grouped into weeks' },
    { name: 'Calendar', slug: 'calendar-class', when: 'The class' },
    { name: 'Calendar.firstweekday', slug: 'calendar-firstweekday', when: 'Sets where weeks start' },
    { name: 'itertools.batched', slug: 'batched', when: 'Group a flat iterator into weeks', category: 'stdlib/itertools' },
    { name: 'generators', slug: 'yield', when: 'How the iter* methods produce values', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is the difference between itermonthdays and itermonthdates?',
      a: 'itermonthdays yields ints with 0 for cells outside the month; itermonthdates yields datetime.date objects, including the real dates of the neighbouring months. itermonthdays3 gives those as (year, month, day) tuples without the date-range limit.',
    },
    {
      q: 'Why does itermonthdates return days from the previous month?',
      a: 'It always yields complete weeks so the result fills a grid. Filter with d.month == month to keep only the month\'s own days.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Calendar.itermonthdates',
    meta:  'Calendar.itermonthdates',
  },

};
