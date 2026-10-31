// content/reference/python/stdlib/calendar/calendar.js — calendar.calendar and calendar.prcal

export const meta = {
  slug:        'calendar',
  name:        'calendar.calendar / prcal',
  signature:   'calendar.calendar(theyear, w=2, l=1, c=6, m=3) · calendar.prcal(theyear, w=0, l=0, c=6, m=3)',
  blurb:       'A whole year as a text calendar, three months per row by default: calendar() returns the string, prcal() prints it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'calendar calendar prcal python print year calendar text year calendar 12 months months per row column spacing calendar.calendar calendar.prcal',
};

export const method = {
  slug:      'calendar',
  name:      'calendar.calendar / prcal',
  signature: 'calendar.calendar(theyear, w=2, l=1, c=6, m=3) · calendar.prcal(theyear, w=0, l=0, c=6, m=3)',
  returns:   { type: 'str (calendar) · None (prcal)', desc: 'The centered year, then each row of months: names, weekday headers and the weeks side by side.' },

  category:    'calendar function',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'The module function that shares its name with the module: calendar.calendar(2026) is the text that python -m calendar 2026 prints. m sets the months per row, c the spaces between them.',

  covers: ['calendar', 'prcal'],

  cheat: {
    commonCall: 'print(calendar.calendar(2026))',
    returns:    '36 lines, 72 characters wide at most, for the default layout',
    replaces:   'the cal -y shell command',
    watchOut:   'm=0 raises ValueError; prcal() returns None',
  },

  parameters: [
    { name: 'theyear', type: 'int', required: true,  default: null, desc: 'Any integer year, shown centered at the top.' },
    { name: 'w',       type: 'int', required: false, default: '2',  desc: 'Date column width (minimum 2). prcal\'s default 0 is raised to the same 2.' },
    { name: 'l',       type: 'int', required: false, default: '1',  desc: 'Lines per week (minimum 1). prcal\'s default 0 is raised to 1.' },
    { name: 'c',       type: 'int', required: false, default: '6',  desc: 'Spaces between month columns (minimum 2).' },
    { name: 'm',       type: 'int', required: false, default: '3',  desc: 'Months per row. 12 puts the year on one row; 0 raises ValueError.' },
  ],

  modes: [
    {
      id: 'year',
      label: 'year layout',
      blurb: 'The year text, one line per list item. Change m and c to reshape it.',
      params: [
        { name: 'year', type: 'int', hint: 'any year',            input: 'number' },
        { name: 'w',    type: 'int', hint: 'column width (min 2)', input: 'number' },
        { name: 'l',    type: 'int', hint: 'lines per week',      input: 'number' },
        { name: 'c',    type: 'int', hint: 'spacing (min 2)',     input: 'number' },
        { name: 'm',    type: 'int', hint: 'months per row',      input: 'number' },
      ],
      template: 'import calendar\ncalendar.calendar({$year}, w={$w}, l={$l}, c={$c}, m={$m}).splitlines()',
      cases: [
        { id: 'default', label: '2026',        values: { year: '2026', w: '2', l: '1', c: '6', m: '3' } },
        { id: 'four',    label: 'm=4',         values: { year: '2026', w: '2', l: '1', c: '3', m: '4' } },
        { id: 'two',     label: 'm=2, narrow', values: { year: '2026', w: '2', l: '1', c: '2', m: '2' } },
        { id: 'zero',    label: 'm=0',         values: { year: '2026', w: '2', l: '1', c: '6', m: '0' } },
      ],
    },
  ],
  demoExplainer: 'The default layout is four rows of three months — 36 lines including the title and blank separators. With m=4 the same year needs three rows; a row that runs out of months (m=5 for example) simply has fewer columns. m=0 fails inside yeardays2calendar, which slices the twelve months with range(0, 12, m).',

  patterns: [
    {
      name: 'Print this year',
      desc: 'prcal prints; calendar returns the text.',
      code: 'import calendar, datetime\ncalendar.prcal(datetime.date.today().year)',
    },
    {
      name: 'Write a year to a file',
      desc: 'Plain text, UTF-8.',
      code: "import calendar\nwith open('2026.txt', 'w', encoding='utf-8') as f:\n    f.write(calendar.calendar(2026))",
    },
    {
      name: 'Narrow terminal',
      desc: 'Two months per row, less spacing: 44 columns.',
      code: 'import calendar\nprint(calendar.calendar(2026, m=2, c=4))',
    },
  ],

  examples: [
    { title: 'Number of lines',             code: 'import calendar\nlen(calendar.calendar(2026).splitlines())', returns: '36' },
    { title: 'The top of the layout',       code: 'import calendar\ncalendar.calendar(2026).splitlines()[:4]', returns: "['                                  2026', '', '      January                   February                   March', 'Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su      Mo Tu We Th Fr Sa Su']" },
    { title: 'Four months per row',         code: 'import calendar\nlen(calendar.calendar(2026, m=4).splitlines())', returns: '28' },
    { title: 'prcal prints the same text',  code: 'import calendar, contextlib, io\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    calendar.prcal(2026)\nbuf.getvalue() == calendar.calendar(2026)', returns: 'True' },
    { title: 'Spacing below 2 is ignored',  code: 'import calendar\ncalendar.calendar(2026, c=0) == calendar.calendar(2026, c=2)', returns: 'True' },
    { title: 'm=0',                          code: 'import calendar\ncalendar.calendar(2026, m=0)', returns: 'ValueError: range() arg 3 must not be zero' },
  ],

  pitfalls: [
    {
      name: 'm=0 for "everything in one row"',
      desc: 'm is the number of months per row; 0 is not a special value. Use 12.',
      wrong: { label: 'm=0', code: 'import calendar\nlen(calendar.calendar(2026, m=0).splitlines())', output: 'ValueError: range() arg 3 must not be zero' },
      fix:   { label: 'm=12', code: 'import calendar\nlen(calendar.calendar(2026, m=12).splitlines())', output: '10' },
    },
    {
      name: 'A layout wider than the terminal',
      desc: 'Each month column is 7 * (w + 1) - 1 characters plus c spaces between columns; six months per row need 150 columns.',
      wrong: { label: 'm=6', code: 'import calendar\nmax(len(line) for line in calendar.calendar(2026, m=6).splitlines())', output: '150' },
      fix:   { label: 'm=2, c=4', code: 'import calendar\nmax(len(line) for line in calendar.calendar(2026, m=2, c=4).splitlines())', output: '44' },
    },
  ],

  when: {
    use: [
      'A printable or loggable overview of a whole year',
      'The same output as python -m calendar, from inside a program',
    ],
    avoid: [
      'A single month → calendar.month',
      'Sunday-first without global state → TextCalendar(calendar.SUNDAY).formatyear',
      'HTML → HTMLCalendar().formatyear / formatyearpage',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: calendar = c.formatyear and prcal = c.pryear on the module\'s shared TextCalendar; prcal\'s defaults are w=0, l=0, which formatyear raises to 2 and 1',
    'Width':   'colwidth = 7 * (w + 1) - 1; a full row is m * colwidth + (m - 1) * c characters before trailing spaces are stripped',
    'Name clash': 'calendar.calendar is a function inside the calendar module; from calendar import calendar imports the function, not the module',
  },

  related: [
    { name: 'TextCalendar.formatyear', slug: 'textcalendar-formatyear', when: 'The method behind it' },
    { name: 'calendar.month / prmonth', slug: 'month', when: 'One month' },
    { name: 'HTMLCalendar.formatyear', slug: 'htmlcalendar-formatyear', when: 'A year as HTML' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview and the command line', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I print a full year calendar in Python?',
      a: 'print(calendar.calendar(2026)) or calendar.prcal(2026). From a shell, python -m calendar 2026 prints the same thing.',
    },
    {
      q: 'How do I change the number of months per row?',
      a: 'Pass m: calendar.calendar(2026, m=4) gives three rows of four months, m=12 a single row. c sets the spaces between months (default 6, minimum 2).',
    },
    {
      q: 'Why is calendar.calendar a function and not the module?',
      a: 'The calendar module defines a function with the same name. After import calendar, calendar is the module and calendar.calendar the function; from calendar import calendar binds the function and hides the module name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.calendar',
    meta:  'calendar.calendar',
  },

};
