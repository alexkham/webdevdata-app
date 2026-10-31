// content/reference/python/stdlib/calendar/month.js — calendar.month and calendar.prmonth

export const meta = {
  slug:        'month',
  name:        'calendar.month / prmonth',
  signature:   'calendar.month(theyear, themonth, w=0, l=0) · calendar.prmonth(theyear, themonth, w=0, l=0)',
  blurb:       'One month as a text calendar like the Unix cal program: month() returns the multi-line string, prmonth() prints it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar month prmonth python print month calendar text month calendar cal command calendar.month calendar.prmonth column width lines per week',
};

export const method = {
  slug:      'month',
  name:      'calendar.month / prmonth',
  signature: 'calendar.month(theyear, themonth, w=0, l=0) · calendar.prmonth(theyear, themonth, w=0, l=0)',
  returns:   { type: 'str (month) · None (prmonth)', desc: 'A title line, a weekday header and one line per week, each ending in a newline.' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The quickest way to show a month: print(calendar.month(2026, 10)). Both functions are the module\'s shared TextCalendar — so the first weekday is Monday unless setfirstweekday() changed it.',

  covers: ['month', 'prmonth'],

  cheat: {
    commonCall: 'print(calendar.month(2026, 10))',
    returns:    "'    October 2026\\nMo Tu We Th Fr Sa Su\\n …' — ends with a newline",
    replaces:   'running the cal command in a subprocess',
    watchOut:   'prmonth() prints and returns None',
  },

  parameters: [
    { name: 'theyear',  type: 'int', required: true,  default: null, desc: 'Any integer year; it is shown with repr() in the title.' },
    { name: 'themonth', type: 'int', required: true,  default: null, desc: '1–12; anything else raises calendar.IllegalMonthError (before 3.12.8 / 3.13.1, 13 and above raised IndexError).' },
    { name: 'w',        type: 'int', required: false, default: '0',  desc: 'Width of each date column; values below 2 mean 2. Weekday names are cut to w letters, full names from 9.' },
    { name: 'l',        type: 'int', required: false, default: '0',  desc: 'Lines per week; values below 1 mean 1. Extra lines are blank.' },
  ],

  modes: [
    {
      id: 'text',
      label: 'month()',
      blurb: 'The string, one line per list item. Try a wider w or l = 2.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year',            input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                input: 'number' },
        { name: 'w',     type: 'int', hint: 'column width (min 2)', input: 'number' },
        { name: 'l',     type: 'int', hint: 'lines per week (min 1)', input: 'number' },
      ],
      template: 'import calendar\ncalendar.month({$year}, {$month}, w={$w}, l={$l}).splitlines()',
      cases: [
        { id: 'plain', label: 'October 2026', values: { year: '2026', month: '10', w: '0', l: '0' } },
        { id: 'w3',    label: 'w=3',          values: { year: '2026', month: '10', w: '3', l: '0' } },
        { id: 'l2',    label: 'l=2',          values: { year: '2026', month: '2', w: '2', l: '2' } },
        { id: 'w9',    label: 'full names',   values: { year: '2026', month: '10', w: '9', l: '1' } },
      ],
    },
    {
      id: 'raw',
      label: 'the raw string',
      blurb: 'What month() really returns: trailing spaces stripped, every line ends in \\n — including the last.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.month({$year}, {$month})',
      cases: [
        { id: 'oct',  label: 'October 2026', values: { year: '2026', month: '10' } },
        { id: 'bc',   label: 'year -44',     values: { year: '-44', month: '3' } },
        { id: 'bad',  label: 'month 0',      values: { year: '2026', month: '0' } },
      ],
    },
  ],
  demoExplainer: 'w=0 and l=0 are the defaults and are raised to the minimum of 2 and 1. With w=9 the header switches from abbreviations to full day names, centered in 9-character columns. The title centers "October 2026" over the 20-character grid and then loses its trailing spaces. A negative year is fine and the title shows it as written: to find the weekdays, the year is first shifted by whole 400-year cycles into datetime\'s range of 1–9999.',

  patterns: [
    {
      name: 'Print the current month',
      desc: 'today() supplies year and month.',
      code: 'import calendar, datetime\ntoday = datetime.date.today()\ncalendar.prmonth(today.year, today.month)',
    },
    {
      name: 'Without the final blank line',
      desc: 'month() already ends with a newline, and print adds another.',
      code: "import calendar\nprint(calendar.month(2026, 10), end='')",
    },
    {
      name: 'Sunday-first without global state',
      desc: 'A TextCalendar of your own instead of setfirstweekday().',
      code: 'import calendar\nprint(calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10))',
    },
  ],

  examples: [
    { title: 'Print a month',                code: 'import calendar\nprint(calendar.month(2026, 10))', returns: '    October 2026\nMo Tu We Th Fr Sa Su\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31' },
    { title: 'prmonth prints it for you',    code: 'import calendar\ncalendar.prmonth(2026, 10)', returns: '    October 2026\nMo Tu We Th Fr Sa Su\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31' },
    { title: 'The string itself',            code: 'import calendar\ncalendar.month(2026, 10)', returns: "'    October 2026\\nMo Tu We Th Fr Sa Su\\n          1  2  3  4\\n 5  6  7  8  9 10 11\\n12 13 14 15 16 17 18\\n19 20 21 22 23 24 25\\n26 27 28 29 30 31\\n'" },
    { title: 'Wider columns',                code: 'import calendar\ncalendar.month(2026, 10, w=3).splitlines()[:3]', returns: "['        October 2026', 'Mon Tue Wed Thu Fri Sat Sun', '              1   2   3   4']" },
    { title: 'Two lines per week',           code: 'import calendar\ncalendar.month(2026, 10, l=2).splitlines()[:4]', returns: "['    October 2026', '', 'Mo Tu We Th Fr Sa Su', '']" },
    { title: 'A bad month (3.12.8+ / 3.13.1+)',          code: 'import calendar\ncalendar.month(2026, 13)', returns: 'calendar.IllegalMonthError: bad month number 13; must be 1-12' },
  ],

  pitfalls: [
    {
      name: 'Printing the return value of prmonth',
      desc: 'prmonth() writes the month to stdout and returns None, which print() then shows.',
      wrong: { label: 'print(prmonth())', code: 'import calendar\nprint(calendar.prmonth(2026, 10))', output: '    October 2026\nMo Tu We Th Fr Sa Su\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31\nNone' },
      fix:   { label: 'prmonth() alone', code: 'import calendar\ncalendar.prmonth(2026, 10)', output: '    October 2026\nMo Tu We Th Fr Sa Su\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31' },
    },
    {
      name: "Splitting on '\\n'",
      desc: 'The string ends with a newline, so split() leaves an empty last item. splitlines() does not.',
      wrong: { label: "split('\\n')[-1]", code: "import calendar\ncalendar.month(2026, 10).split('\\n')[-1]", output: "''" },
      fix:   { label: 'splitlines()[-1]', code: 'import calendar\ncalendar.month(2026, 10).splitlines()[-1]', output: "'26 27 28 29 30 31'" },
    },
  ],

  when: {
    use: [
      'A month in a terminal, log file or plain-text email',
      'Quick checks while debugging date logic',
    ],
    avoid: [
      'A different first weekday → TextCalendar(firstweekday).formatmonth',
      'Structured data → monthcalendar or Calendar().monthdays2calendar',
      'Web pages → HTMLCalendar().formatmonth',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: month = c.formatmonth and prmonth = c.prmonth, bound methods of the module\'s shared TextCalendar instance c',
    'Layout':     'Title centered over 7 * (w + 1) - 1 columns, then the header and the weeks; every line right-stripped and followed by l newlines',
    'Errors':     'A month outside 1–12 raises calendar.IllegalMonthError (3.12.8+ / 3.13.1+); in earlier releases a month above 12 failed sooner, with IndexError: list index out of range from month_name',
  },

  related: [
    { name: 'TextCalendar.formatmonth', slug: 'textcalendar-formatmonth', when: 'The method behind it, with your own first weekday' },
    { name: 'calendar.calendar / prcal', slug: 'calendar', when: 'A whole year' },
    { name: 'monthcalendar', slug: 'monthcalendar', when: 'The same month as lists of numbers' },
    { name: 'setfirstweekday', slug: 'setfirstweekday', when: 'Change the first column module-wide' },
    { name: 'print()', slug: 'print', when: 'end= to drop the extra newline', category: 'functions' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I print a month calendar in Python?',
      a: 'print(calendar.month(2026, 10)) or calendar.prmonth(2026, 10). From a terminal, python -m calendar 2026 10 prints the same layout.',
    },
    {
      q: 'Why does calendar.prmonth print None?',
      a: 'It doesn\'t — print() does. prmonth returns None after printing, so print(calendar.prmonth(...)) prints the month and then None. Call prmonth on its own, or print(calendar.month(...)).',
    },
    {
      q: 'How do I start the week on Sunday in calendar.month?',
      a: 'calendar.month uses the module-wide setting; calendar.setfirstweekday(calendar.SUNDAY) changes it for the whole program. To leave everything else alone, use calendar.TextCalendar(calendar.SUNDAY).formatmonth(year, month).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.month',
    meta:  'calendar.month',
  },

};
