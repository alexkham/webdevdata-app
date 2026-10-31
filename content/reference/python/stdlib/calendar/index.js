// content/reference/python/stdlib/calendar/index.js — the calendar module hub

export const meta = {
  slug:        'index',
  name:        'calendar',
  signature:   'import calendar',
  blurb:       'Month and year calendars as text or HTML, plus the calendar arithmetic behind them: leap years, days in a month, the weekday of a date and timegm() for UTC timestamps.',
  category:    'dates',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); Day and Month enums 3.12+',
  searchTerms: 'calendar module python calendar print calendar month calendar year calendar text calendar html calendar isleap leap year leapdays monthrange days in month weekday day of week monthcalendar timegm utc timestamp first day of week sunday monday setfirstweekday month_name day_name python -m calendar',
};

export const method = {
  slug: 'index',
  name: 'calendar',

  category:    'Dates & times',
  version:     'Python 3 (all versions); Day and Month enums 3.12+',
  hasLiveDemo: true,

  subtitle: 'Two halves: small functions that answer calendar questions (is it a leap year, how many days in this month, which weekday), and classes that lay a month or year out as text like the Unix cal program, or as an HTML table. Weeks start on Monday unless you say otherwise.',

  coverClasses: ['Calendar', 'TextCalendar', 'HTMLCalendar'],

  imports: ['import calendar', 'from calendar import monthrange, isleap, TextCalendar'],
  facts: [
    { label: 'Questions',  value: 'isleap(y), leapdays(y1, y2), weekday(y, m, d), monthrange(y, m) → (weekday of the 1st, number of days)' },
    { label: 'Layouts',    value: 'month() / calendar() return text; monthcalendar() returns the weeks as lists of day numbers; TextCalendar and HTMLCalendar for full control' },
    { label: 'Week start', value: 'Monday (0) by default, Sunday is 6 — per object with TextCalendar(firstweekday=6), or module-wide with setfirstweekday()' },
    { label: 'Calendar',   value: 'Proleptic Gregorian: the current rules extended forever in both directions; year 0 is 1 BC' },
    { label: 'CLI',        value: 'python -m calendar 2026 10' },
  ],

  modes: [
    {
      id: 'month',
      label: 'month grid',
      blurb: 'TextCalendar.formatmonth lays one month out like the Unix cal program. Shown one line per list item; w is the column width, l the lines per week.',
      params: [
        { name: 'firstweekday', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'year',         type: 'int', hint: 'any year',               input: 'number' },
        { name: 'month',        type: 'int', hint: '1–12',                   input: 'number' },
        { name: 'w',            type: 'int', hint: 'column width (min 2)',   input: 'number' },
        { name: 'l',            type: 'int', hint: 'lines per week (min 1)', input: 'number' },
      ],
      template: 'import calendar\ncal = calendar.TextCalendar(firstweekday={$firstweekday})\ncal.formatmonth({$year}, {$month}, w={$w}, l={$l}).splitlines()',
      cases: [
        { id: 'oct',    label: 'October 2026',  values: { firstweekday: '0', year: '2026', month: '10', w: '2', l: '1' } },
        { id: 'sunday', label: 'Sunday first',  values: { firstweekday: '6', year: '2026', month: '2', w: '2', l: '1' } },
        { id: 'wide',   label: 'w=4',           values: { firstweekday: '0', year: '2024', month: '2', w: '4', l: '1' } },
        { id: 'bad',    label: 'month 13',      values: { firstweekday: '0', year: '2026', month: '13', w: '2', l: '1' } },
      ],
    },
    {
      id: 'facts',
      label: 'month facts',
      blurb: 'The question-answering functions on one date: leap year, weekday of the 1st and length of the month, the weekday of the day, and the leap years counted from 2000.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
        { name: 'day',   type: 'int', hint: '1–31',     input: 'number' },
      ],
      template: "import calendar\n{'isleap': calendar.isleap({$year}),\n 'monthrange': calendar.monthrange({$year}, {$month}),\n 'weekday': calendar.weekday({$year}, {$month}, {$day}),\n 'leapdays from 2000': calendar.leapdays(2000, {$year})}",
      cases: [
        { id: 'leap',   label: '29 Feb 2024', values: { year: '2024', month: '2', day: '29' } },
        { id: 'c1900',  label: '1900',        values: { year: '1900', month: '2', day: '1' } },
        { id: 'today',  label: '25 Oct 2026', values: { year: '2026', month: '10', day: '25' } },
        { id: 'nodate', label: '29 Feb 2023', values: { year: '2023', month: '2', day: '29' } },
      ],
    },
    {
      id: 'timegm',
      label: 'timegm',
      blurb: 'A (year, month, day, hour, minute, second) tuple read as UTC, turned into Unix seconds.',
      params: [
        { name: 'year',   type: 'int', hint: '1–9999', input: 'number' },
        { name: 'month',  type: 'int', hint: '1–12',   input: 'number' },
        { name: 'day',    type: 'int', hint: 'day',    input: 'number' },
        { name: 'hour',   type: 'int', hint: 'hour',   input: 'number' },
        { name: 'minute', type: 'int', hint: 'minute', input: 'number' },
        { name: 'second', type: 'int', hint: 'second', input: 'number' },
      ],
      template: 'import calendar\ncalendar.timegm(({$year}, {$month}, {$day}, {$hour}, {$minute}, {$second}))',
      cases: [
        { id: 'epoch',  label: 'the epoch',     values: { year: '1970', month: '1', day: '1', hour: '0', minute: '0', second: '0' } },
        { id: 'y2024',  label: '2024-01-01',    values: { year: '2024', month: '1', day: '1', hour: '0', minute: '0', second: '0' } },
        { id: 'before', label: 'before 1970',   values: { year: '1969', month: '12', day: '31', hour: '23', minute: '59', second: '59' } },
        { id: 'roll',   label: '32 January',    values: { year: '2024', month: '1', day: '32', hour: '0', minute: '0', second: '0' } },
      ],
    },
  ],
  demoExplainer: 'The month grid is formatmonth\'s string split into lines: trailing spaces are stripped, so a week that ends early is a short line, and a month that starts mid-week gets leading blanks. February 2026 begins on a Sunday, so with firstweekday=6 it fills exactly four rows. In month facts, monthrange gives the weekday of the 1st as a calendar.Day member plus the number of days; 1900 is not a leap year (divisible by 100 but not by 400), and leapdays(2000, 1900) is negative because the range runs backwards. timegm checks only the year and month: day 32 of January simply becomes 1 February (1706745600), and 23:59:59 on 31 December 1969 is -1.',

  patterns: [
    {
      name: 'Days in a month',
      desc: 'monthrange returns (weekday of the 1st, number of days); take the second item.',
      code: 'import calendar\ndays = calendar.monthrange(year, month)[1]',
    },
    {
      name: 'Last day of the month as a date',
      desc: 'Combine monthrange with datetime.date.',
      code: 'import calendar, datetime\nlast = datetime.date(year, month, calendar.monthrange(year, month)[1])',
    },
    {
      name: 'Print a Sunday-first month',
      desc: 'A TextCalendar with its own first weekday leaves the module-wide setting alone.',
      code: 'import calendar\nprint(calendar.TextCalendar(firstweekday=calendar.SUNDAY).formatmonth(2026, 10))',
    },
    {
      name: 'From the shell',
      desc: 'A whole year, one month, Sunday first, or an HTML page.',
      code: '# shell:\n# python -m calendar 2026\n# python -m calendar 2026 10\n# python -m calendar -f 6 2026 10\n# python -m calendar -t html 2026 > 2026.html',
    },
  ],

  examples: [
    { title: 'Leap year?',                 code: 'import calendar\n(calendar.isleap(2024), calendar.isleap(1900), calendar.isleap(2000))', returns: '(True, False, True)' },
    { title: 'Weekday of the 1st, days in the month', code: 'import calendar\ncalendar.monthrange(2026, 2)', returns: '(calendar.SUNDAY, 28)' },
    { title: 'Day of the week',            code: 'import calendar\ncalendar.weekday(2026, 10, 25)', returns: 'calendar.SUNDAY' },
    { title: 'A month as week lists',      code: 'import calendar\ncalendar.monthcalendar(2026, 2)', returns: '[[0, 0, 0, 0, 0, 0, 1], [2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20, 21, 22], [23, 24, 25, 26, 27, 28, 0]]' },
    { title: 'Print a month',              code: 'import calendar\nprint(calendar.month(2026, 2))', returns: '   February 2026\nMo Tu We Th Fr Sa Su\n                   1\n 2  3  4  5  6  7  8\n 9 10 11 12 13 14 15\n16 17 18 19 20 21 22\n23 24 25 26 27 28' },
    { title: 'Sunday as the first column', code: 'import calendar\nprint(calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 2))', returns: '   February 2026\nSu Mo Tu We Th Fr Sa\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28' },
    { title: 'UTC tuple → Unix timestamp', code: 'import calendar\ncalendar.timegm((2024, 1, 1, 0, 0, 0))', returns: '1704067200' },
    { title: 'Month 13',                   code: 'import calendar\ncalendar.monthrange(2026, 13)', returns: 'calendar.IllegalMonthError: bad month number 13; must be 1-12' },
  ],

  pitfalls: [
    {
      name: 'Expecting Sunday in the first column',
      desc: 'Every layout starts weeks on Monday unless told otherwise. 1 February 2026 is a Sunday, so it lands in the last column.',
      wrong: { label: 'monthcalendar', code: 'import calendar\ncalendar.monthcalendar(2026, 2)[0]', output: '[0, 0, 0, 0, 0, 0, 1]' },
      fix:   { label: 'Calendar(SUNDAY)', code: 'import calendar\ncalendar.Calendar(calendar.SUNDAY).monthdayscalendar(2026, 2)[0]', output: '[1, 2, 3, 4, 5, 6, 7]' },
    },
    {
      name: 'Counting months from 0',
      desc: 'month_name and month_abbr are 1-based: index 0 is an empty string, so range(12) drops December.',
      wrong: { label: 'range(12)', code: 'import calendar\n[calendar.month_name[i] for i in range(12)][-2:]', output: "['October', 'November']" },
      fix:   { label: 'skip index 0', code: 'import calendar\nlist(calendar.month_name)[1:][-2:]', output: "['November', 'December']" },
    },
    {
      name: 'Printing what a pr* function returns',
      desc: 'prmonth, prcal and pryear print and return None. Print the string from month() instead, or call prmonth on its own.',
      wrong: { label: 'print(prmonth())', code: 'import calendar\nprint(calendar.prmonth(2026, 2))', output: '   February 2026\nMo Tu We Th Fr Sa Su\n                   1\n 2  3  4  5  6  7  8\n 9 10 11 12 13 14 15\n16 17 18 19 20 21 22\n23 24 25 26 27 28\nNone' },
      fix:   { label: 'print(month())', code: 'import calendar\nprint(calendar.month(2026, 2))', output: '   February 2026\nMo Tu We Th Fr Sa Su\n                   1\n 2  3  4  5  6  7  8\n 9 10 11 12 13 14 15\n16 17 18 19 20 21 22\n23 24 25 26 27 28' },
    },
  ],

  when: {
    use: [
      'Leap years, month lengths and weekdays without building date objects',
      'Printing month or year calendars in a terminal, a log or a text email',
      'Generating a simple HTML month table you style with CSS',
      'Turning a UTC time tuple into a Unix timestamp (timegm)',
    ],
    avoid: [
      'Date arithmetic and formatting → datetime (timedelta, strftime)',
      'Week numbers → date.isocalendar() in datetime',
      'Local-time timestamps → time.mktime (timegm assumes UTC)',
    ],
  },

  notes: {
    cpython:        'Lib/calendar.py, pure Python. Weekdays come from datetime.date, so a year outside 1–9999 is first mapped into the same position of the 400-year Gregorian cycle',
    'Names':        'month_name, day_name and the headers come from strftime in the current LC_TIME locale — English unless the program calls locale.setlocale; LocaleTextCalendar / LocaleHTMLCalendar switch the locale per call',
    'Global state': 'The module functions share one TextCalendar; setfirstweekday() changes the week start for month(), calendar(), monthcalendar() and weekheader() everywhere in the process',
    'Command line': 'python -m calendar [year] [month] prints text (the current year when no year is given); -t html writes a full XHTML page, and a month argument is then an error; -f sets the first weekday (3.13+, not range-checked: -f 9 means Wednesday); -w, -l, -s, -m set column width, lines per week, spacing and months per row; -L/--locale needs -e/--encoding',
  },

  history: [
    { version: '3.7',  note: 'itermonthdays3() and itermonthdays4(); HTMLCalendar CSS class attributes (cssclass_noday, cssclass_month, …)' },
    { version: '3.12', note: 'Day and Month IntEnums; MONDAY … SUNDAY and JANUARY … DECEMBER are their members. weekday() and monthrange() return Day members. The old constants calendar.January and calendar.February are deprecated' },
    { version: '3.12.8 / 3.13.1', note: 'Bugfix releases: the formatmonthname() methods (and so month() and formatmonth()) check the month: 13 and above raise IllegalMonthError instead of IndexError, and IllegalMonthError now also subclasses IndexError so old except clauses keep working (gh-126476)' },
    { version: '3.13', note: 'The command line gained -f / --first-weekday' },
    { version: '3.14', note: 'The command line highlights today\'s date in color (docs.python.org)' },
  ],

  related: [
    { name: 'datetime module', slug: 'datetime', when: 'Date objects, arithmetic and formatting', category: 'stdlib' },
    { name: 'time module',     slug: 'time',     when: 'Clocks, struct_time, gmtime / mktime', category: 'stdlib' },
    { name: 'time.gmtime',     slug: 'gmtime',   when: 'The inverse of timegm', category: 'stdlib/time' },
    { name: 'date.weekday',    slug: 'weekday',  when: 'The weekday of a date object', category: 'stdlib/datetime' },
    { name: 'monthrange',      slug: 'monthrange', when: 'Days in a month' },
    { name: 'TextCalendar',    slug: 'textcalendar', when: 'Text layouts with your own first weekday' },
  ],

  faq: [
    {
      q: 'How do I get the number of days in a month in Python?',
      a: 'calendar.monthrange(year, month)[1]. monthrange returns a pair: the weekday of the 1st and the number of days, with leap years handled — monthrange(2024, 2) is (calendar.THURSDAY, 29).',
    },
    {
      q: 'How do I print a calendar in Python?',
      a: 'print(calendar.month(2026, 10)) for one month, print(calendar.calendar(2026)) for a year — or calendar.prmonth / calendar.prcal, which print directly. From a terminal: python -m calendar 2026 10.',
    },
    {
      q: 'How do I make the week start on Sunday?',
      a: 'Create the calendar object with firstweekday=calendar.SUNDAY (6): calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10). calendar.setfirstweekday(calendar.SUNDAY) does it for the module-level functions, but changes them for the whole program.',
    },
    {
      q: 'What is the difference between calendar.timegm and time.mktime?',
      a: 'Both turn a time tuple into Unix seconds. timegm reads the tuple as UTC and is pure arithmetic; mktime reads it as local time, so its result depends on the machine\'s time zone. timegm is the inverse of time.gmtime.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html',
    meta:  'calendar — General calendar-related functions',
  },

};
