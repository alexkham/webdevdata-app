// content/reference/python/stdlib/calendar/monthdayscalendar.js — monthdayscalendar / monthdays2calendar / monthdatescalendar

export const meta = {
  slug:        'monthdayscalendar',
  name:        'Calendar.monthdayscalendar / monthdays2calendar / monthdatescalendar',
  signature:   'cal.monthdayscalendar(year, month) · cal.monthdays2calendar(year, month) · cal.monthdatescalendar(year, month)',
  blurb:       'A month as a list of weeks of seven cells: day numbers, (day, weekday) pairs or datetime.date objects.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'Calendar.monthdayscalendar Calendar.monthdays2calendar Calendar.monthdatescalendar monthdayscalendar monthdays2calendar monthdatescalendar month as weeks matrix grid list of lists first weekday',
};

export const method = {
  slug:      'monthdayscalendar',
  name:      'Calendar.monthdayscalendar / monthdays2calendar / monthdatescalendar',
  signature: 'cal.monthdayscalendar(year, month) · cal.monthdays2calendar(year, month) · cal.monthdatescalendar(year, month)',
  returns:   { type: 'list[list[...]]', desc: '4–6 weeks of 7 items: int (0 = other month), (day, weekday) tuples, or datetime.date.' },

  category:    'Calendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The itermonth* generators, cut into weeks. The object\'s own first weekday decides the column order — the per-object version of calendar.monthcalendar().',

  covers: ['Calendar.monthdayscalendar', 'Calendar.monthdays2calendar', 'Calendar.monthdatescalendar'],

  cheat: {
    commonCall: 'calendar.Calendar(calendar.SUNDAY).monthdayscalendar(2026, 10)',
    returns:    '[[0, 0, 0, 0, 1, 2, 3], [4, 5, …], …]',
    replaces:   'calendar.monthcalendar() plus a global setfirstweekday()',
    watchOut:   'column 6 is Sunday only when the week starts on Monday',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'Any integer year (monthdatescalendar: the visible days must lie in 1–9999).' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1–12; anything else raises calendar.IllegalMonthError.' },
  ],

  modes: [
    {
      id: 'days',
      label: 'monthdayscalendar',
      blurb: 'Weeks of day numbers, 0 for the other months.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\ncalendar.Calendar({$first}).monthdayscalendar({$year}, {$month})',
      cases: [
        { id: 'mon', label: 'Oct 2026, Monday', values: { first: '0', year: '2026', month: '10' } },
        { id: 'sun', label: 'Oct 2026, Sunday', values: { first: '6', year: '2026', month: '10' } },
        { id: 'six', label: 'Mar 2026',         values: { first: '0', year: '2026', month: '3' } },
      ],
    },
    {
      id: 'days2',
      label: 'monthdays2calendar',
      blurb: 'The first week as (day, weekday) pairs — the weekday tells you the column\'s day.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\ncalendar.Calendar({$first}).monthdays2calendar({$year}, {$month})[0]',
      cases: [
        { id: 'sun', label: 'Oct 2026, Sunday', values: { first: '6', year: '2026', month: '10' } },
        { id: 'wed', label: 'Oct 2026, Wednesday', values: { first: '2', year: '2026', month: '10' } },
      ],
    },
    {
      id: 'dates',
      label: 'monthdatescalendar',
      blurb: 'Weeks of dates, shown as their .day — the neighbouring months\' real days appear instead of zeros.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: '1–9999',            input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',              input: 'number' },
      ],
      template: 'import calendar\n[[d.day for d in week] for week in calendar.Calendar({$first}).monthdatescalendar({$year}, {$month})]',
      cases: [
        { id: 'oct', label: 'Oct 2026',       values: { first: '0', year: '2026', month: '10' } },
        { id: 'end', label: 'Dec 9999',       values: { first: '0', year: '9999', month: '12' } },
      ],
    },
  ],
  demoExplainer: 'Changing the first weekday moves where 1 October lands: column 3 with Monday first, column 4 with Sunday first. In monthdays2calendar the second number of each pair is the weekday of that column, whatever the first weekday is. December 9999 ends on a Friday, so its last week would need 1 January 10000 — monthdatescalendar cannot build that date and raises ValueError.',

  patterns: [
    {
      name: 'Template-ready weeks',
      desc: 'Real dates for every cell; style other-month days differently.',
      code: "import calendar\nfor week in calendar.Calendar(calendar.SUNDAY).monthdatescalendar(2026, 10):\n    print(' '.join(f'{d.day:2}' if d.month == 10 else ' .' for d in week))",
    },
    {
      name: 'Pick a weekday regardless of first weekday',
      desc: 'Match on the weekday in the pairs instead of a column index.',
      code: 'import calendar\nfridays = [d for week in cal.monthdays2calendar(2026, 10) for d, wd in week if d and wd == calendar.FRIDAY]',
    },
  ],

  examples: [
    { title: 'Monday-first first week',   code: 'import calendar\ncalendar.Calendar().monthdayscalendar(2026, 10)[0]', returns: '[0, 0, 0, 1, 2, 3, 4]' },
    { title: 'Sunday-first first week',   code: 'import calendar\ncalendar.Calendar(calendar.SUNDAY).monthdayscalendar(2026, 10)[0]', returns: '[0, 0, 0, 0, 1, 2, 3]' },
    { title: '(day, weekday) pairs',      code: 'import calendar\ncalendar.Calendar().monthdays2calendar(2026, 10)[0][:4]', returns: '[(0, 0), (0, 1), (0, 2), (1, 3)]' },
    { title: 'Dates, neighbours included', code: 'import calendar\ncalendar.Calendar().monthdatescalendar(2026, 10)[-1][-1]', returns: 'datetime.date(2026, 11, 1)' },
    { title: 'Weekends per week',         code: 'import calendar\n[w[5:] for w in calendar.Calendar().monthdayscalendar(2026, 10)]', returns: '[[3, 4], [10, 11], [17, 18], [24, 25], [31, 0]]' },
    { title: 'Six weeks',                 code: 'import calendar\nlen(calendar.Calendar().monthdayscalendar(2026, 3))', returns: '6' },
  ],

  pitfalls: [
    {
      name: 'Using calendar.SUNDAY as a column index',
      desc: 'Column 6 is Sunday only with Monday first. With Sunday first it is Saturday.',
      wrong: { label: 'week[calendar.SUNDAY]', code: 'import calendar\ncalendar.Calendar(calendar.SUNDAY).monthdayscalendar(2026, 10)[1][calendar.SUNDAY]', output: '10' },
      fix:   { label: 'match the weekday', code: 'import calendar\n[d for d, wd in calendar.Calendar(calendar.SUNDAY).monthdays2calendar(2026, 10)[1] if wd == calendar.SUNDAY]', output: '[4]' },
    },
    {
      name: 'Looking for day numbers among dates',
      desc: 'monthdatescalendar cells are date objects; an int is never equal to one.',
      wrong: { label: '2 in week', code: 'import calendar\n2 in calendar.Calendar().monthdatescalendar(2026, 10)[0]', output: 'False' },
      fix:   { label: 'date in week', code: 'import calendar, datetime\ndatetime.date(2026, 10, 2) in calendar.Calendar().monthdatescalendar(2026, 10)[0]', output: 'True' },
    },
  ],

  when: {
    use: [
      'Grid data for HTML templates, GUIs and reports',
      'A per-object first weekday without global state',
    ],
    avoid: [
      'A whole year at once → yeardayscalendar / yeardays2calendar / yeardatescalendar',
      'A flat stream of cells → itermonthdays / itermonthdates',
    ],
  },

  notes: {
    cpython: 'Lib/calendar.py: each one is list(self.itermonth…(year, month)) sliced into chunks of 7',
    'Same as': 'calendar.monthcalendar(y, m) is the module\'s shared TextCalendar\'s monthdayscalendar',
  },

  related: [
    { name: 'calendar.monthcalendar', slug: 'monthcalendar', when: 'The module-level shortcut' },
    { name: 'itermonthdates / itermonthdays…', slug: 'itermonthdates', when: 'The generators underneath' },
    { name: 'yeardayscalendar …', slug: 'yeardayscalendar', when: 'All twelve months' },
    { name: 'Calendar', slug: 'calendar-class', when: 'The class' },
  ],

  faq: [
    {
      q: 'What is the difference between monthdayscalendar and monthdatescalendar?',
      a: 'monthdayscalendar puts ints in the cells with 0 for days of other months; monthdatescalendar puts datetime.date objects there, using the real dates of the previous and next month.',
    },
    {
      q: 'How do I get the weeks of a month starting on Sunday?',
      a: 'calendar.Calendar(calendar.SUNDAY).monthdayscalendar(year, month). The first weekday belongs to the Calendar object, so nothing else in the program changes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Calendar.monthdayscalendar',
    meta:  'Calendar.monthdayscalendar',
  },

};
