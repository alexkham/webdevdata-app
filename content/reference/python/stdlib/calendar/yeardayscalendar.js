// content/reference/python/stdlib/calendar/yeardayscalendar.js — yeardayscalendar / yeardays2calendar / yeardatescalendar

export const meta = {
  slug:        'yeardayscalendar',
  name:        'Calendar.yeardayscalendar / yeardays2calendar / yeardatescalendar',
  signature:   'cal.yeardayscalendar(year, width=3) · cal.yeardays2calendar(year, width=3) · cal.yeardatescalendar(year, width=3)',
  blurb:       'A whole year as rows of months — width months per row — each month a list of weeks, ready for a multi-column layout.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'Calendar.yeardayscalendar Calendar.yeardays2calendar Calendar.yeardatescalendar yeardayscalendar yeardays2calendar yeardatescalendar year calendar data rows of months width nested lists',
};

export const method = {
  slug:      'yeardayscalendar',
  name:      'Calendar.yeardayscalendar / yeardays2calendar / yeardatescalendar',
  signature: 'cal.yeardayscalendar(year, width=3) · cal.yeardays2calendar(year, width=3) · cal.yeardatescalendar(year, width=3)',
  returns:   { type: 'list[list[list[list[...]]]]', desc: 'rows → months → weeks → 7 cells (int, (day, weekday) or datetime.date).' },

  category:    'Calendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Four levels deep: rows of up to width months, each month the same weeks that month*calendar returns. TextCalendar.formatyear is built on yeardays2calendar.',

  covers: ['Calendar.yeardatescalendar', 'Calendar.yeardays2calendar', 'Calendar.yeardayscalendar'],

  cheat: {
    commonCall: 'calendar.Calendar().yeardayscalendar(2026, width=4)',
    returns:    '3 rows of 4 months, each a list of weeks',
    replaces:   '[cal.monthdayscalendar(y, m) for m in range(1, 13)] plus chunking',
    watchOut:   'index by row and column, not by month number; width=0 raises ValueError',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true,  default: null, desc: 'Any integer year (yeardatescalendar: the visible days must lie in 1–9999).' },
    { name: 'width', type: 'int', required: false, default: '3',  desc: 'Months per row. 12 gives one row; 0 raises ValueError; a negative width gives [].' },
  ],

  modes: [
    {
      id: 'shape',
      label: 'shape',
      blurb: 'Weeks per month, row by row.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'width', type: 'int', hint: 'months per row',    input: 'number' },
      ],
      template: 'import calendar\n[[len(month) for month in row] for row in calendar.Calendar({$first}).yeardayscalendar({$year}, {$width})]',
      cases: [
        { id: 'w3',  label: 'width 3',  values: { first: '0', year: '2026', width: '3' } },
        { id: 'w4',  label: 'width 4',  values: { first: '0', year: '2026', width: '4' } },
        { id: 'sun', label: 'Sunday first', values: { first: '6', year: '2026', width: '6' } },
        { id: 'w0',  label: 'width 0',  values: { first: '0', year: '2026', width: '0' } },
      ],
    },
    {
      id: 'firsts',
      label: 'first weeks',
      blurb: 'The first week of every month, walking the rows in order.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
      ],
      template: 'import calendar\n[month[0] for row in calendar.Calendar({$first}).yeardayscalendar({$year}) for month in row]',
      cases: [
        { id: 'y2026', label: '2026', values: { first: '0', year: '2026' } },
        { id: 'sun',   label: '2026, Sunday first', values: { first: '6', year: '2026' } },
      ],
    },
  ],
  demoExplainer: 'Months take 4, 5 or 6 weeks — in 2026 with Monday first, March, August and November need six. width only regroups the twelve months; the weeks stay the same. width 0 fails in the range(0, 12, width) that cuts the list into rows.',

  patterns: [
    {
      name: 'One month out of the year',
      desc: 'Row and column from the month number.',
      code: 'import calendar\nrows = calendar.Calendar().yeardayscalendar(2026, width=3)\noctober = rows[(10 - 1) // 3][(10 - 1) % 3]',
    },
    {
      name: 'A wall calendar: 4 rows × 3 months',
      desc: 'Iterate rows, then months, then weeks.',
      code: "import calendar\nfor row in calendar.Calendar(calendar.SUNDAY).yeardays2calendar(2026, width=3):\n    for month in row:\n        for week in month:\n            ...",
    },
  ],

  examples: [
    { title: 'Weeks per month, 3 per row', code: 'import calendar\n[[len(m) for m in row] for row in calendar.Calendar().yeardayscalendar(2026)]', returns: '[[5, 5, 6], [5, 5, 5], [5, 6, 5], [5, 6, 5]]' },
    { title: 'width=4 gives three rows',   code: 'import calendar\nlen(calendar.Calendar().yeardayscalendar(2026, width=4))', returns: '3' },
    { title: 'One row of twelve',          code: 'import calendar\nrows = calendar.Calendar().yeardayscalendar(2026, width=12)\n(len(rows), len(rows[0]))', returns: '(1, 12)' },
    { title: 'yeardays2calendar cells',    code: 'import calendar\ncalendar.Calendar().yeardays2calendar(2026)[0][0][0]', returns: '[(0, 0), (0, 1), (0, 2), (1, 3), (2, 4), (3, 5), (4, 6)]' },
    { title: 'yeardatescalendar cells',    code: 'import calendar\ncalendar.Calendar().yeardatescalendar(2026)[3][2][-1][-1]', returns: 'datetime.date(2027, 1, 3)' },
    { title: 'width=0',                    code: 'import calendar\ncalendar.Calendar().yeardayscalendar(2026, 0)', returns: 'ValueError: range() arg 3 must not be zero' },
  ],

  pitfalls: [
    {
      name: 'Indexing by month number',
      desc: 'The outer list holds rows, not months — with width 3 there are only four.',
      wrong: { label: 'rows[10]', code: 'import calendar\ncalendar.Calendar().yeardayscalendar(2026)[10]', output: 'IndexError: list index out of range' },
      fix:   { label: 'rows[row][col]', code: 'import calendar\ncalendar.Calendar().yeardayscalendar(2026)[(10 - 1) // 3][(10 - 1) % 3][0]', output: '[0, 0, 0, 1, 2, 3, 4]' },
    },
    {
      name: 'Dates at the end of the date range',
      desc: 'yeardatescalendar(9999) needs days of January 10000 for the last week; the day-number forms do not.',
      wrong: { label: 'yeardatescalendar(9999)', code: 'import calendar\ncalendar.Calendar().yeardatescalendar(9999)', output: 'ValueError: year 10000 is out of range' },
      fix:   { label: 'yeardays2calendar(9999)', code: 'import calendar\nlen(calendar.Calendar().yeardays2calendar(9999))', output: '4' },
    },
  ],

  when: {
    use: [
      'Your own multi-column year layout (text, HTML, PDF)',
      'A year of month grids in one call',
    ],
    avoid: [
      'Ready-made text → TextCalendar.formatyear / calendar.calendar',
      'Ready-made HTML → HTMLCalendar.formatyear',
      'One month → monthdayscalendar',
    ],
  },

  notes: {
    cpython: 'Lib/calendar.py: months = [self.month…calendar(year, m) for m in Month]; return [months[i:i+width] for i in range(0, len(months), width)]',
    'Cost':  'All twelve months are computed before the rows are cut, so width=0 fails only after that work',
  },

  related: [
    { name: 'monthdayscalendar …', slug: 'monthdayscalendar', when: 'One month' },
    { name: 'TextCalendar.formatyear', slug: 'textcalendar-formatyear', when: 'Text built from yeardays2calendar' },
    { name: 'HTMLCalendar.formatyear', slug: 'htmlcalendar-formatyear', when: 'HTML year table' },
    { name: 'Calendar', slug: 'calendar-class', when: 'The class' },
  ],

  faq: [
    {
      q: 'What does the width argument of yeardayscalendar do?',
      a: 'It is the number of months per row. The default 3 gives 4 rows; width=4 gives 3 rows and width=12 a single row. It does not change the weeks themselves.',
    },
    {
      q: 'How do I get October from yeardayscalendar?',
      a: 'With width w it is rows[(10 - 1) // w][(10 - 1) % w]. For one month alone, monthdayscalendar(year, 10) is simpler.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Calendar.yeardayscalendar',
    meta:  'Calendar.yeardayscalendar',
  },

};
