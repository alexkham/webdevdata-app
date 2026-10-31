// content/reference/python/stdlib/calendar/htmlcalendar-formatmonth.js

export const meta = {
  slug:        'htmlcalendar-formatmonth',
  name:        'HTMLCalendar.formatmonth',
  signature:   'cal.formatmonth(theyear, themonth, withyear=True)',
  blurb:       'One month as an HTML <table>: a title row, a weekday header row and one row per week.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'HTMLCalendar.formatmonth formatmonth html month table python calendar html month withyear noday css class highlight today subclass',
};

export const method = {
  slug:      'htmlcalendar-formatmonth',
  name:      'HTMLCalendar.formatmonth',
  signature: 'cal.formatmonth(theyear, themonth, withyear=True)',
  returns:   { type: 'str', desc: 'A <table class="month"> … </table> string ending in a newline, one table row per line.' },

  category:    'HTMLCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The HTML counterpart of TextCalendar.formatmonth — but its third argument is withyear, not a column width. Pass withyear=False when the year is already shown elsewhere (formatyear does).',

  covers: ['HTMLCalendar.formatmonth'],

  cheat: {
    commonCall: 'calendar.HTMLCalendar(calendar.SUNDAY).formatmonth(2026, 10)',
    returns:    '\'<table border="0" cellpadding="0" cellspacing="0" class="month">\\n<tr><th colspan="7" …\'',
    replaces:   'a hand-written table loop in a template',
    watchOut:   'no w / l arguments — the third positional argument is withyear',
  },

  parameters: [
    { name: 'theyear',  type: 'int',  required: true,  default: null,   desc: 'Any integer year (shown with str() in the title).' },
    { name: 'themonth', type: 'int',  required: true,  default: null,   desc: '1–12; anything else raises calendar.IllegalMonthError.' },
    { name: 'withyear', type: 'bool', required: false, default: 'True', desc: 'Include the year in the title row.' },
  ],

  modes: [
    {
      id: 'month',
      label: 'formatmonth',
      blurb: 'The table, one line per list item.',
      params: [
        { name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',                input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                    input: 'number' },
      ],
      template: 'import calendar\ncalendar.HTMLCalendar({$first}).formatmonth({$year}, {$month}).splitlines()',
      cases: [
        { id: 'oct', label: 'Oct 2026',         values: { first: '0', year: '2026', month: '10' } },
        { id: 'sun', label: 'Oct 2026, Sunday', values: { first: '6', year: '2026', month: '10' } },
      ],
    },
    {
      id: 'title',
      label: 'title row',
      blurb: 'Just the title row, with and without the year.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncal = calendar.HTMLCalendar()\n(cal.formatmonth({$year}, {$month}).splitlines()[1], cal.formatmonth({$year}, {$month}, withyear=False).splitlines()[1])',
      cases: [
        { id: 'oct', label: 'Oct 2026',  values: { year: '2026', month: '10' } },
        { id: 'bc',  label: 'year -44',  values: { year: '-44', month: '3' } },
        { id: 'bad', label: 'month 0',   values: { year: '2026', month: '0' } },
      ],
    },
  ],
  demoExplainer: 'Each week is one <tr> on its own line; cells of other months get class "noday" and hold only a non-breaking-space entity, and the others carry the weekday class (mon … sun) whatever the first weekday is. The title uses str(year), so a negative year appears as written.',

  patterns: [
    {
      name: 'Highlight one date',
      desc: 'formatday gets only (day, weekday), so remember the month in formatmonth.',
      code: "import calendar\n\nclass Highlight(calendar.HTMLCalendar):\n    def __init__(self, date, firstweekday=0):\n        super().__init__(firstweekday)\n        self.date = date\n\n    def formatmonth(self, theyear, themonth, withyear=True):\n        self.current = (theyear, themonth)\n        return super().formatmonth(theyear, themonth, withyear)\n\n    def formatday(self, day, weekday):\n        cell = super().formatday(day, weekday)\n        if (*self.current, day) == (self.date.year, self.date.month, self.date.day):\n            cell = cell.replace('<td class=\"', '<td class=\"today ')\n        return cell",
    },
    {
      name: 'Render in a Jinja/Django template',
      desc: 'Mark the string as safe markup; it contains no user data.',
      code: "import calendar\nfrom markupsafe import Markup\ncontext = {'month_table': Markup(calendar.HTMLCalendar().formatmonth(2026, 10))}",
    },
  ],

  examples: [
    { title: 'Rows of the table',         code: "import calendar\n[line[:20] for line in calendar.HTMLCalendar().formatmonth(2026, 2).splitlines()]", returns: "['<table border=\"0\" ce', '<tr><th colspan=\"7\" ', '<tr><th class=\"mon\">', '<tr><td class=\"noday', '<tr><td class=\"mon\">', '<tr><td class=\"mon\">', '<tr><td class=\"mon\">', '<tr><td class=\"mon\">', '</table>']" },
    { title: 'Without the year',          code: 'import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 10, withyear=False).splitlines()[1]', returns: "'<tr><th colspan=\"7\" class=\"month\">October</th></tr>'" },
    { title: 'Number of rows',            code: "import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 2).count('<tr>')", returns: '7' },
    { title: 'Ends with a newline',       code: "import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 2)[-9:]", returns: "'</table>\\n'" },
    { title: 'A bad month',               code: 'import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 13)', returns: 'calendar.IllegalMonthError: bad month number 13; must be 1-12' },
  ],

  pitfalls: [
    {
      name: 'Passing TextCalendar\'s w and l',
      desc: 'HTMLCalendar.formatmonth has no width arguments; its only optional argument is withyear.',
      wrong: { label: 'formatmonth(y, m, 2, 1)', code: 'import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 10, 2, 1)', output: 'TypeError: HTMLCalendar.formatmonth() takes from 3 to 4 positional arguments but 5 were given' },
      fix:   { label: 'formatmonth(y, m)', code: "import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 10).count('<td')", output: '35' },
    },
    {
      name: 'Highlighting by day number alone',
      desc: 'formatday only knows the day and weekday, so a check on day == 25 fires in every month of formatyear. Track the month in formatmonth.',
      wrong: { label: 'day only', code: "import calendar\n\nclass Mark(calendar.HTMLCalendar):\n    def formatday(self, day, weekday):\n        cell = super().formatday(day, weekday)\n        return cell.replace('<td class=\"', '<td class=\"today ') if day == 25 else cell\n\nMark().formatyear(2026).count('today')", output: '12' },
      fix:   { label: 'remember the month', code: "import calendar, datetime\n\nclass Mark(calendar.HTMLCalendar):\n    def __init__(self, date):\n        super().__init__()\n        self.date = date\n\n    def formatmonth(self, theyear, themonth, withyear=True):\n        self.current = (theyear, themonth)\n        return super().formatmonth(theyear, themonth, withyear)\n\n    def formatday(self, day, weekday):\n        cell = super().formatday(day, weekday)\n        if (*self.current, day) == (self.date.year, self.date.month, self.date.day):\n            cell = cell.replace('<td class=\"', '<td class=\"today ')\n        return cell\n\nMark(datetime.date(2026, 10, 25)).formatyear(2026).count('today')", output: '1' },
    },
  ],

  when: {
    use: [
      'A month table in a server-rendered page or an HTML email',
      'A base for event calendars via a formatday override',
    ],
    avoid: [
      'A whole year → formatyear / formatyearpage',
      'Markup you fully control → iterate monthdatescalendar in the template',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: the <table> line, formatmonthname(withyear=withyear), formatweekheader(), then formatweek(week) for each week of monthdays2calendar — each followed by "\\n" — and "</table>\\n"',
    'Errors':  'A month outside 1–12 raises IllegalMonthError from formatmonthname (3.12.8+ / 3.13.1+; earlier releases raised IndexError for 13 and above)',
  },

  related: [
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'The class' },
    { name: 'formatday / formatweek …', slug: 'htmlcalendar-formatday', when: 'The rows and cells it is made of' },
    { name: 'CSS class attributes', slug: 'htmlcalendar-cssclasses', when: 'Change the class names' },
    { name: 'HTMLCalendar.formatyear / formatyearpage', slug: 'htmlcalendar-formatyear', when: 'A whole year' },
    { name: 'TextCalendar.formatmonth', slug: 'textcalendar-formatmonth', when: 'The plain-text version' },
  ],

  faq: [
    {
      q: 'How do I create an HTML table for a month in Python?',
      a: 'calendar.HTMLCalendar().formatmonth(year, month). Pass a first weekday to the constructor for Sunday-first tables and withyear=False to leave the year out of the title.',
    },
    {
      q: 'How do I mark today in an HTMLCalendar?',
      a: 'Subclass it, store the year and month in an overridden formatmonth, and compare them with the date in formatday — day alone is not enough because formatday is called for every month.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.HTMLCalendar.formatmonth',
    meta:  'HTMLCalendar.formatmonth',
  },

};
