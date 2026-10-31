// content/reference/python/stdlib/calendar/calendar-class.js — the calendar.Calendar base class

export const meta = {
  slug:        'calendar-class',
  name:        'calendar.Calendar',
  signature:   'calendar.Calendar(firstweekday=0)',
  blurb:       'The data half of the module: iterators and nested lists of a month\'s or year\'s days, starting the week on firstweekday. No formatting.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'calendar Calendar class python calendar object firstweekday iterweekdays itermonthdates monthdayscalendar yeardatescalendar month data weeks base class',
};

export const method = {
  slug:      'calendar-class',
  name:      'calendar.Calendar',
  signature: 'calendar.Calendar(firstweekday=0)',
  returns:   { type: 'Calendar', desc: 'An object whose methods return weeks as day numbers, (day, weekday) pairs, tuples or datetime.date objects.' },

  category:    'calendar class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Use it when you want the shape of a month — which days fall in which week — and will do the rendering yourself. TextCalendar and HTMLCalendar are its subclasses and inherit every method.',

  covers: ['Calendar'],

  cheat: {
    commonCall: 'calendar.Calendar(calendar.SUNDAY).monthdayscalendar(2026, 10)',
    returns:    'a list of weeks, each a list of 7 day numbers (0 = not in the month)',
    replaces:   'computing grid offsets from monthrange() by hand',
    watchOut:   'firstweekday is not validated — 7 silently means Monday',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: false, default: '0', desc: 'Weekday that starts each week: 0 = MONDAY … 6 = SUNDAY. Stored as given and used modulo 7.' },
  ],

  modes: [
    {
      id: 'basics',
      label: 'first weekday',
      blurb: 'The stored first weekday, the column order it produces and the first week of a month.',
      params: [
        { name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',                input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                    input: 'number' },
      ],
      template: 'import calendar\ncal = calendar.Calendar(firstweekday={$first})\n(cal.firstweekday, list(cal.iterweekdays()), cal.monthdayscalendar({$year}, {$month})[0])',
      cases: [
        { id: 'mon', label: 'Monday',  values: { first: '0', year: '2026', month: '2' } },
        { id: 'sun', label: 'Sunday',  values: { first: '6', year: '2026', month: '2' } },
        { id: 'big', label: '9',       values: { first: '9', year: '2026', month: '2' } },
      ],
    },
  ],
  demoExplainer: '1 February 2026 is a Sunday: Monday-first puts it in the last column, Sunday-first in the first. The constructor accepts any int and the firstweekday property returns it modulo 7, so 9 behaves like 2 (Wednesday) — unlike calendar.setfirstweekday(), which rejects it.',

  patterns: [
    {
      name: 'Render a month grid yourself',
      desc: 'Weeks of (day, weekday) pairs; day 0 is padding.',
      code: "import calendar\ncal = calendar.Calendar(calendar.SUNDAY)\nfor week in cal.monthdays2calendar(2026, 10):\n    print(' '.join(f'{d:2}' if d else '  ' for d, wd in week))",
    },
    {
      name: 'Every visible date of a month view',
      desc: 'Including the days of neighbouring months that fill the first and last week.',
      code: 'import calendar\ndates = list(calendar.Calendar().itermonthdates(2026, 10))',
    },
    {
      name: 'Subclass for a custom format',
      desc: 'Inherit the data methods, add your own output.',
      code: "import calendar\n\nclass MarkdownCalendar(calendar.Calendar):\n    def formatmonth(self, year, month):\n        rows = [' | '.join(str(d) if d else '' for d in week) for week in self.monthdayscalendar(year, month)]\n        return '\\n'.join(rows)",
    },
  ],

  examples: [
    { title: 'Default: Monday first',      code: 'import calendar\ncalendar.Calendar().firstweekday', returns: '0' },
    { title: 'Column order',               code: 'import calendar\nlist(calendar.Calendar(calendar.SUNDAY).iterweekdays())', returns: '[6, 0, 1, 2, 3, 4, 5]' },
    { title: 'First week as day numbers',  code: 'import calendar\ncalendar.Calendar().monthdayscalendar(2026, 2)[0]', returns: '[0, 0, 0, 0, 0, 0, 1]' },
    { title: 'First week as dates',        code: 'import calendar\ncalendar.Calendar().monthdatescalendar(2026, 2)[0][:2]', returns: '[datetime.date(2026, 1, 26), datetime.date(2026, 1, 27)]' },
    { title: 'Its two formatting subclasses', code: 'import calendar\n[c.__name__ for c in calendar.Calendar.__subclasses__()]', returns: "['TextCalendar', 'HTMLCalendar']" },
    { title: 'Each object has its own setting', code: 'import calendar\n(calendar.Calendar(6).firstweekday, calendar.Calendar().firstweekday, calendar.firstweekday())', returns: '(6, 0, 0)' },
  ],

  pitfalls: [
    {
      name: 'Asking the base class to format',
      desc: 'Calendar only provides data. The format* methods live on TextCalendar and HTMLCalendar.',
      wrong: { label: 'Calendar().formatmonth', code: 'import calendar\ncalendar.Calendar().formatmonth(2026, 2)', output: "AttributeError: 'Calendar' object has no attribute 'formatmonth'" },
      fix:   { label: 'TextCalendar().formatmonth', code: 'import calendar\ncalendar.TextCalendar().formatmonth(2026, 2).splitlines()[0]', output: "'   February 2026'" },
    },
    {
      name: 'ISO 7 for Sunday',
      desc: 'Any int is accepted and taken modulo 7, so 7 quietly becomes Monday.',
      wrong: { label: 'Calendar(7)', code: 'import calendar\ncalendar.Calendar(7).firstweekday', output: '0' },
      fix:   { label: 'Calendar(SUNDAY)', code: 'import calendar\ncalendar.Calendar(calendar.SUNDAY).firstweekday', output: '6' },
    },
  ],

  when: {
    use: [
      'Building a calendar UI, a template or a report from month data',
      'A per-object first weekday, without the module-wide setfirstweekday()',
      'Iterating every day shown in a month view, neighbouring-month days included',
    ],
    avoid: [
      'Ready-made text → TextCalendar',
      'Ready-made HTML table → HTMLCalendar',
      'Just the length of a month → calendar.monthrange',
    ],
  },

  notes: {
    cpython:       'Lib/calendar.py: class Calendar(object) — firstweekday is a property over _firstweekday that returns _firstweekday % 7',
    'Methods':     'getfirstweekday / setfirstweekday / firstweekday; iterweekdays, itermonthdates, itermonthdays … itermonthdays4; monthdatescalendar, monthdays2calendar, monthdayscalendar; yeardatescalendar, yeardays2calendar, yeardayscalendar',
    'Date range':  'Methods that produce datetime.date objects fail for days outside year 1–9999; the day-number and tuple methods do not',
  },

  related: [
    { name: 'Calendar.firstweekday', slug: 'calendar-firstweekday', when: 'Read or change the first weekday' },
    { name: 'itermonthdates / itermonthdays…', slug: 'itermonthdates', when: 'The iterators' },
    { name: 'monthdayscalendar …', slug: 'monthdayscalendar', when: 'A month as weeks' },
    { name: 'yeardayscalendar …', slug: 'yeardayscalendar', when: 'A year as rows of months' },
    { name: 'TextCalendar', slug: 'textcalendar', when: 'Plain-text subclass' },
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'HTML subclass' },
  ],

  faq: [
    {
      q: 'What is the difference between calendar.Calendar and TextCalendar?',
      a: 'Calendar only produces data — weeks of day numbers, tuples or dates. TextCalendar is a subclass that adds formatday … formatyear and the pr* methods to turn that data into plain text; HTMLCalendar does the same for HTML.',
    },
    {
      q: 'How do I get the weeks of a month starting on Sunday?',
      a: 'calendar.Calendar(calendar.SUNDAY).monthdayscalendar(year, month). The setting belongs to that object only.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Calendar',
    meta:  'calendar.Calendar',
  },

};
