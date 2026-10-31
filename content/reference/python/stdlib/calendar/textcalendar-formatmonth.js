// content/reference/python/stdlib/calendar/textcalendar-formatmonth.js — TextCalendar.formatmonth and prmonth

export const meta = {
  slug:        'textcalendar-formatmonth',
  name:        'TextCalendar.formatmonth / prmonth',
  signature:   'cal.formatmonth(theyear, themonth, w=0, l=0) · cal.prmonth(theyear, themonth, w=0, l=0)',
  blurb:       'One month as text: formatmonth returns the multi-line string, prmonth prints it. Column width w, lines per week l.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'TextCalendar.formatmonth TextCalendar.prmonth formatmonth prmonth text month calendar column width lines per week print month calendar sunday first',
};

export const method = {
  slug:      'textcalendar-formatmonth',
  name:      'TextCalendar.formatmonth / prmonth',
  signature: 'cal.formatmonth(theyear, themonth, w=0, l=0) · cal.prmonth(theyear, themonth, w=0, l=0)',
  returns:   { type: 'str · None', desc: 'formatmonth: title, header and weeks, each line right-stripped and followed by l newlines. prmonth prints that and returns None.' },

  category:    'TextCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The method behind calendar.month() and calendar.prmonth(), on an object whose first weekday you control. w widens every column (full weekday names from w=9); l repeats each newline.',

  covers: ['TextCalendar.formatmonth', 'TextCalendar.prmonth'],

  cheat: {
    commonCall: 'calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10)',
    returns:    "'    October 2026\\nSu Mo Tu We Th Fr Sa\\n             1  2  3\\n…'",
    replaces:   'calendar.month() with a global setfirstweekday()',
    watchOut:   'lines are right-stripped, so they have different lengths',
  },

  parameters: [
    { name: 'theyear',  type: 'int', required: true,  default: null, desc: 'Any integer year; shown with repr() in the title.' },
    { name: 'themonth', type: 'int', required: true,  default: null, desc: '1–12; anything else raises calendar.IllegalMonthError.' },
    { name: 'w',        type: 'int', required: false, default: '0',  desc: 'Column width, raised to at least 2. The title is centered over 7 * (w + 1) - 1 characters.' },
    { name: 'l',        type: 'int', required: false, default: '0',  desc: 'Newlines after each line, raised to at least 1.' },
  ],

  modes: [
    {
      id: 'month',
      label: 'formatmonth',
      blurb: 'The month string split into lines.',
      params: [
        { name: 'first', type: 'int', hint: 'first weekday 0–6',      input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',               input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                   input: 'number' },
        { name: 'w',     type: 'int', hint: 'column width (min 2)',   input: 'number' },
        { name: 'l',     type: 'int', hint: 'lines per week (min 1)', input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar({$first}).formatmonth({$year}, {$month}, w={$w}, l={$l}).splitlines()',
      cases: [
        { id: 'feb',  label: 'Feb 2027',        values: { first: '0', year: '2027', month: '2', w: '0', l: '0' } },
        { id: 'sun',  label: 'Feb 2027, Sunday', values: { first: '6', year: '2027', month: '2', w: '0', l: '0' } },
        { id: 'w4',   label: 'w=4',             values: { first: '0', year: '2026', month: '10', w: '4', l: '1' } },
        { id: 'l2',   label: 'l=2',             values: { first: '0', year: '2026', month: '10', w: '2', l: '2' } },
      ],
    },
  ],
  demoExplainer: 'February 2027 starts on a Monday and has 28 days, so Monday-first it is exactly four full rows; Sunday-first the same month needs a fifth row for the 28th alone. With w=4 the abbreviations are padded to four characters ("Mon ") and the title is centered over 34 columns. l=2 doubles every newline, which puts a blank line after the title, the header and each week.',

  patterns: [
    {
      name: 'Print a Sunday-first month',
      desc: 'prmonth prints without an extra trailing newline.',
      code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).prmonth(2026, 10)',
    },
    {
      name: 'Two months side by side',
      desc: 'Pad every line to the full width before joining — the lines are right-stripped.',
      code: "import calendar, itertools\ncal = calendar.TextCalendar()\na = cal.formatmonth(2026, 10).splitlines()\nb = cal.formatmonth(2026, 11).splitlines()\nwidth = 20\nfor left, right in itertools.zip_longest(a, b, fillvalue=''):\n    print(left.ljust(width), right)",
    },
  ],

  examples: [
    { title: 'The string',                  code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatmonth(2027, 2)', returns: "'   February 2027\\nSu Mo Tu We Th Fr Sa\\n    1  2  3  4  5  6\\n 7  8  9 10 11 12 13\\n14 15 16 17 18 19 20\\n21 22 23 24 25 26 27\\n28\\n'" },
    { title: 'prmonth prints it',           code: 'import calendar\ncalendar.TextCalendar().prmonth(2027, 2)', returns: '   February 2027\nMo Tu We Th Fr Sa Su\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28' },
    { title: 'Wider columns',               code: 'import calendar\ncalendar.TextCalendar().formatmonth(2026, 10, w=4).splitlines()[:3]', returns: "['           October 2026', 'Mon  Tue  Wed  Thu  Fri  Sat  Sun', '                 1    2    3    4']" },
    { title: 'l=2 doubles the line breaks', code: 'import calendar\nlen(calendar.TextCalendar().formatmonth(2026, 10, l=2).splitlines())', returns: '14' },
    { title: 'Same as calendar.month',      code: 'import calendar\ncalendar.TextCalendar().formatmonth(2026, 10) == calendar.month(2026, 10)', returns: 'True' },
    { title: 'A bad month',                 code: 'import calendar\ncalendar.TextCalendar().formatmonth(2026, 13)', returns: 'calendar.IllegalMonthError: bad month number 13; must be 1-12' },
  ],

  pitfalls: [
    {
      name: 'Assuming every line has the full width',
      desc: 'The title and the last week are right-stripped. Pad with ljust() before placing text next to them.',
      wrong: { label: 'raw lines', code: 'import calendar\n[len(line) for line in calendar.TextCalendar().formatmonth(2026, 10).splitlines()]', output: '[16, 20, 20, 20, 20, 20, 17]' },
      fix:   { label: 'ljust(20)', code: 'import calendar\n[len(line.ljust(20)) for line in calendar.TextCalendar().formatmonth(2026, 10).splitlines()]', output: '[20, 20, 20, 20, 20, 20, 20]' },
    },
    {
      name: 'Printing what prmonth returns',
      desc: 'prmonth prints and returns None.',
      wrong: { label: 'print(cal.prmonth())', code: 'import calendar\nprint(calendar.TextCalendar().prmonth(2027, 2))', output: '   February 2027\nMo Tu We Th Fr Sa Su\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28\nNone' },
      fix:   { label: 'print(cal.formatmonth())', code: 'import calendar\nprint(calendar.TextCalendar().formatmonth(2027, 2))', output: '   February 2027\nMo Tu We Th Fr Sa Su\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28' },
    },
  ],

  when: {
    use: [
      'A text month with a chosen first weekday or column width',
      'Building larger text layouts from month blocks',
    ],
    avoid: [
      'A whole year → formatyear',
      'Data for your own rendering → monthdays2calendar',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: w = max(2, w); l = max(1, l); formatmonthname(…, 7 * (w + 1) - 1).rstrip(), formatweekheader(w).rstrip(), then formatweek(week, w).rstrip() for each week of monthdays2calendar — each followed by "\\n" * l',
    'prmonth': 'print(self.formatmonth(theyear, themonth, w, l), end="")',
    'Errors':  'IllegalMonthError from formatmonthname (3.12.8+ / 3.13.1+). Earlier releases did not check there, so a month above 12 raised IndexError from month_name',
  },

  related: [
    { name: 'calendar.month / prmonth', slug: 'month', when: 'The module-level versions' },
    { name: 'TextCalendar.formatyear / pryear', slug: 'textcalendar-formatyear', when: 'A year' },
    { name: 'formatday / formatweek …', slug: 'textcalendar-formatweek', when: 'The parts it is built from' },
    { name: 'TextCalendar', slug: 'textcalendar', when: 'The class' },
    { name: 'HTMLCalendar.formatmonth', slug: 'htmlcalendar-formatmonth', when: 'The HTML version' },
  ],

  faq: [
    {
      q: 'How do I print a month with Sunday as the first day?',
      a: 'calendar.TextCalendar(calendar.SUNDAY).prmonth(2026, 10), or print(...formatmonth(2026, 10)).',
    },
    {
      q: 'What do the w and l arguments of formatmonth do?',
      a: 'w is the width of each date column (minimum 2; full weekday names appear from 9) and l is the number of line breaks after every line (minimum 1), so l=2 adds a blank line after each week.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.TextCalendar.formatmonth',
    meta:  'TextCalendar.formatmonth',
  },

};
