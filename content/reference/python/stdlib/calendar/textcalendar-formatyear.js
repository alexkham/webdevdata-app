// content/reference/python/stdlib/calendar/textcalendar-formatyear.js — TextCalendar.formatyear and pryear

export const meta = {
  slug:        'textcalendar-formatyear',
  name:        'TextCalendar.formatyear / pryear',
  signature:   'cal.formatyear(theyear, w=2, l=1, c=6, m=3) · cal.pryear(theyear, w=0, l=0, c=6, m=3)',
  blurb:       'A whole year as text, m months per row: formatyear returns the string, pryear prints it.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'TextCalendar.formatyear TextCalendar.pryear formatyear pryear year calendar text months per row column spacing sunday first year',
};

export const method = {
  slug:      'textcalendar-formatyear',
  name:      'TextCalendar.formatyear / pryear',
  signature: 'cal.formatyear(theyear, w=2, l=1, c=6, m=3) · cal.pryear(theyear, w=0, l=0, c=6, m=3)',
  returns:   { type: 'str · None', desc: 'formatyear: the centered year, then rows of month names, headers and weeks. pryear prints that and returns None.' },

  category:    'TextCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'calendar.calendar() and calendar.prcal() with your own first weekday. Built from yeardays2calendar: each row of m months is printed side by side, c spaces apart.',

  covers: ['TextCalendar.formatyear', 'TextCalendar.pryear'],

  cheat: {
    commonCall: 'calendar.TextCalendar(calendar.SUNDAY).formatyear(2026, m=4)',
    returns:    'a 26-line string for 2026: 3 rows of 4 months',
    replaces:   'calendar.calendar() with a global setfirstweekday()',
    watchOut:   'm=0 raises ValueError; pryear has no file= argument',
  },

  parameters: [
    { name: 'theyear', type: 'int', required: true,  default: null, desc: 'Any integer year, centered at the top.' },
    { name: 'w',       type: 'int', required: false, default: '2',  desc: 'Date column width (minimum 2). pryear defaults to 0, which means the same 2.' },
    { name: 'l',       type: 'int', required: false, default: '1',  desc: 'Lines per week (minimum 1). pryear defaults to 0, i.e. 1.' },
    { name: 'c',       type: 'int', required: false, default: '6',  desc: 'Spaces between month columns (minimum 2).' },
    { name: 'm',       type: 'int', required: false, default: '3',  desc: 'Months per row.' },
  ],

  modes: [
    {
      id: 'year',
      label: 'formatyear',
      blurb: 'A year from a TextCalendar with your first weekday, one line per list item.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',          input: 'number' },
        { name: 'c',     type: 'int', hint: 'spacing (min 2)',   input: 'number' },
        { name: 'm',     type: 'int', hint: 'months per row',    input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar({$first}).formatyear({$year}, c={$c}, m={$m}).splitlines()',
      cases: [
        { id: 'sun',  label: 'Sunday first', values: { first: '6', year: '2026', c: '6', m: '3' } },
        { id: 'four', label: 'm=4, c=2',     values: { first: '0', year: '2026', c: '2', m: '4' } },
        { id: 'one',  label: 'm=1',          values: { first: '0', year: '2027', c: '6', m: '1' } },
      ],
    },
  ],
  demoExplainer: 'With m=1 the year becomes a single column of twelve months, each with its name centered over the 20-character column. c only matters between columns, and values below 2 are raised to 2. The first weekday changes every header and every week, but not which month goes where.',

  patterns: [
    {
      name: 'Sunday-first year to a file',
      desc: 'formatyear returns the text; write it with an explicit encoding.',
      code: "import calendar\ntext = calendar.TextCalendar(calendar.SUNDAY).formatyear(2026)\nwith open('2026.txt', 'w', encoding='utf-8') as f:\n    f.write(text)",
    },
    {
      name: 'Print to stderr or a buffer',
      desc: 'pryear always prints to sys.stdout; use formatyear for anything else.',
      code: 'import calendar, sys\nprint(calendar.TextCalendar().formatyear(2026), file=sys.stderr)',
    },
  ],

  examples: [
    { title: 'Sunday-first headers',       code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatyear(2026).splitlines()[3]', returns: "'Su Mo Tu We Th Fr Sa      Su Mo Tu We Th Fr Sa      Su Mo Tu We Th Fr Sa'" },
    { title: 'pryear prints formatyear',   code: 'import calendar, contextlib, io\ncal = calendar.TextCalendar()\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    cal.pryear(2026)\nbuf.getvalue() == cal.formatyear(2026)', returns: 'True' },
    { title: 'w=0, l=0 mean the defaults', code: 'import calendar\ncalendar.TextCalendar().formatyear(2026, 0, 0) == calendar.TextCalendar().formatyear(2026)', returns: 'True' },
    { title: 'Twelve months in one row',   code: 'import calendar\nlen(calendar.TextCalendar().formatyear(2026, m=12).splitlines())', returns: '10' },
    { title: 'Two per row: 46 columns',    code: 'import calendar\nmax(len(line) for line in calendar.TextCalendar().formatyear(2026, m=2).splitlines())', returns: '46' },
    { title: 'Same as calendar.calendar',  code: 'import calendar\ncalendar.TextCalendar().formatyear(2026) == calendar.calendar(2026)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Comparing the title line directly',
      desc: 'The year is centered over the full width, so the first line starts with spaces.',
      wrong: { label: "== '2026'", code: "import calendar\ncalendar.TextCalendar().formatyear(2026).splitlines()[0] == '2026'", output: 'False' },
      fix:   { label: ".strip() == '2026'", code: "import calendar\ncalendar.TextCalendar().formatyear(2026).splitlines()[0].strip() == '2026'", output: 'True' },
    },
    {
      name: 'Passing file= to pryear',
      desc: 'pryear has no output argument. Write the formatyear() string where you need it.',
      wrong: { label: 'pryear(file=buf)', code: 'import calendar, io\nbuf = io.StringIO()\ncalendar.TextCalendar().pryear(2026, file=buf)', output: "TypeError: TextCalendar.pryear() got an unexpected keyword argument 'file'" },
      fix:   { label: 'buf.write(formatyear())', code: 'import calendar, io\nbuf = io.StringIO()\nbuf.write(calendar.TextCalendar().formatyear(2026))\nlen(buf.getvalue().splitlines())', output: '36' },
    },
  ],

  when: {
    use: [
      'A year overview with a chosen first weekday or layout',
      'Generating printable yearly calendars as text',
    ],
    avoid: [
      'Default Monday-first output → calendar.calendar / calendar.prcal',
      'HTML → HTMLCalendar.formatyear',
    ],
  },

  notes: {
    cpython:  'Lib/calendar.py: colwidth = (w + 1) * 7 - 1; for each row of yeardays2calendar(theyear, m) it joins the month names, the headers and each week with formatstring(cols, colwidth, c)',
    'pryear': 'print(self.formatyear(theyear, w, l, c, m), end="") — its own defaults are w=0, l=0',
  },

  related: [
    { name: 'calendar.calendar / prcal', slug: 'calendar', when: 'The module-level versions' },
    { name: 'TextCalendar.formatmonth / prmonth', slug: 'textcalendar-formatmonth', when: 'One month' },
    { name: 'yeardayscalendar …', slug: 'yeardayscalendar', when: 'The data it is built from' },
    { name: 'TextCalendar', slug: 'textcalendar', when: 'The class' },
  ],

  faq: [
    {
      q: 'How do I print a year calendar starting on Sunday?',
      a: 'calendar.TextCalendar(calendar.SUNDAY).pryear(2026), or print(...formatyear(2026)).',
    },
    {
      q: 'How do I change the number of months per row?',
      a: 'formatyear(2026, m=4) gives four months per row; c sets the spaces between them (default 6, minimum 2).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.TextCalendar.formatyear',
    meta:  'TextCalendar.formatyear',
  },

};
