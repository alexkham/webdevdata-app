// content/reference/python/stdlib/calendar/textcalendar.js — the calendar.TextCalendar class

export const meta = {
  slug:        'textcalendar',
  name:        'calendar.TextCalendar',
  signature:   'calendar.TextCalendar(firstweekday=0)',
  blurb:       'Plain-text calendars like the Unix cal program, with a first weekday of its own: formatmonth / formatyear return strings, prmonth / pryear print them.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'calendar TextCalendar python text calendar class formatmonth formatyear prmonth pryear sunday first week plain text cal subclass formatday',
};

export const method = {
  slug:      'textcalendar',
  name:      'calendar.TextCalendar',
  signature: 'calendar.TextCalendar(firstweekday=0)',
  returns:   { type: 'TextCalendar', desc: 'A Calendar subclass with format* methods returning str and pr* methods printing them.' },

  category:    'calendar class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'What calendar.month() and calendar.calendar() use behind the scenes — but your own instance, so TextCalendar(calendar.SUNDAY) gives Sunday-first output without touching anything global.',

  covers: ['TextCalendar'],

  cheat: {
    commonCall: 'calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10)',
    returns:    'a multi-line str starting "    October 2026\\nSu Mo Tu We Th Fr Sa\\n"',
    replaces:   'calendar.setfirstweekday() + calendar.month()',
    watchOut:   'a new TextCalendar starts on Monday whatever setfirstweekday() says',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: false, default: '0', desc: '0 = MONDAY … 6 = SUNDAY; not validated, used modulo 7.' },
  ],

  modes: [
    {
      id: 'month',
      label: 'formatmonth',
      blurb: 'One month from a TextCalendar with the first weekday you choose.',
      params: [
        { name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',                input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                    input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar(firstweekday={$first}).formatmonth({$year}, {$month}).splitlines()',
      cases: [
        { id: 'sun', label: 'Sunday first', values: { first: '6', year: '2026', month: '10' } },
        { id: 'mon', label: 'Monday first', values: { first: '0', year: '2026', month: '10' } },
        { id: 'sat', label: 'Saturday first', values: { first: '5', year: '2026', month: '10' } },
      ],
    },
  ],
  demoExplainer: 'October 2026 starts on a Thursday and has 31 days. Sunday first, it fits in five rows ending with a full week 25–31; Monday first, its last row is 26–31; Saturday first, 1 October is the sixth cell of the first row.',

  patterns: [
    {
      name: 'Sunday-first month',
      desc: 'No global state involved.',
      code: 'import calendar\nprint(calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10))',
    },
    {
      name: 'Customise one cell type',
      desc: 'Override formatday — formatweek, formatmonth and formatyear all call it.',
      code: "import calendar\n\nclass NoWeekends(calendar.TextCalendar):\n    def formatday(self, day, weekday, width):\n        if weekday >= calendar.SATURDAY:\n            return ' ' * width\n        return super().formatday(day, weekday, width)",
    },
    {
      name: 'Send it somewhere other than stdout',
      desc: 'Use the format* methods and write the string yourself.',
      code: "import calendar\nwith open('year.txt', 'w', encoding='utf-8') as f:\n    f.write(calendar.TextCalendar().formatyear(2026))",
    },
  ],

  examples: [
    { title: 'Sunday-first month',        code: 'import calendar\nprint(calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10))', returns: '    October 2026\nSu Mo Tu We Th Fr Sa\n             1  2  3\n 4  5  6  7  8  9 10\n11 12 13 14 15 16 17\n18 19 20 21 22 23 24\n25 26 27 28 29 30 31' },
    { title: 'The module functions use one', code: 'import calendar\ncalendar.TextCalendar().formatyear(2026) == calendar.calendar(2026)', returns: 'True' },
    { title: 'A Calendar subclass',       code: 'import calendar\n(issubclass(calendar.TextCalendar, calendar.Calendar), calendar.TextCalendar().monthdayscalendar(2026, 10)[0])', returns: '(True, [0, 0, 0, 1, 2, 3, 4])' },
    { title: 'Header in its order',       code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatweekheader(3)', returns: "'Sun Mon Tue Wed Thu Fri Sat'" },
    { title: 'Subclass: blank weekends',  code: "import calendar\n\nclass NoWeekends(calendar.TextCalendar):\n    def formatday(self, day, weekday, width):\n        if weekday >= calendar.SATURDAY:\n            return ' ' * width\n        return super().formatday(day, weekday, width)\n\nNoWeekends().formatmonth(2026, 10).splitlines()[2:4]", returns: "['          1  2', ' 5  6  7  8  9']" },
  ],

  pitfalls: [
    {
      name: 'Expecting a new TextCalendar to follow setfirstweekday()',
      desc: 'setfirstweekday() changes only the module\'s shared instance. Every TextCalendar you create has its own setting, Monday by default.',
      wrong: { label: 'TextCalendar()', code: 'import calendar\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    header = calendar.TextCalendar().formatweekheader(2)\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nheader', output: "'Mo Tu We Th Fr Sa Su'" },
      fix:   { label: 'TextCalendar(SUNDAY)', code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatweekheader(2)', output: "'Su Mo Tu We Th Fr Sa'" },
    },
    {
      name: 'w=1 for single-letter columns',
      desc: 'formatmonth raises w to at least 2. A one-letter header needs formatweekheader(1) directly.',
      wrong: { label: 'formatmonth(w=1)', code: 'import calendar\ncalendar.TextCalendar().formatmonth(2026, 10, w=1).splitlines()[1]', output: "'Mo Tu We Th Fr Sa Su'" },
      fix:   { label: 'formatweekheader(1)', code: 'import calendar\ncalendar.TextCalendar().formatweekheader(1)', output: "'M T W T F S S'" },
    },
  ],

  when: {
    use: [
      'Text calendars with a non-Monday first weekday',
      'Subclassing to change how days, weeks or names are drawn',
      'Several differently configured calendars in one program',
    ],
    avoid: [
      'Quick Monday-first output → calendar.month / calendar.calendar',
      'HTML → HTMLCalendar',
      'Month and day names in another language → LocaleTextCalendar',
    ],
  },

  notes: {
    cpython:    'Lib/calendar.py: class TextCalendar(Calendar) — formatday, formatweek, formatweekday, formatweekheader, formatmonthname, formatmonth, formatyear, plus prweek, prmonth, pryear that print with end=""',
    'Layering': 'formatyear → formatmonthname / formatweekheader / formatweek → formatday; override the lowest one you need',
    'Module':   'calendar.month, prmonth, calendar, prcal, weekheader and monthcalendar are bound methods of one shared TextCalendar',
  },

  related: [
    { name: 'TextCalendar.formatmonth / prmonth', slug: 'textcalendar-formatmonth', when: 'One month' },
    { name: 'TextCalendar.formatyear / pryear',   slug: 'textcalendar-formatyear',  when: 'A year' },
    { name: 'formatday / formatweek …',           slug: 'textcalendar-formatweek',  when: 'The building blocks' },
    { name: 'Calendar',      slug: 'calendar-class', when: 'The data methods it inherits' },
    { name: 'HTMLCalendar',  slug: 'htmlcalendar',   when: 'The HTML sibling' },
    { name: 'LocaleTextCalendar', slug: 'localetextcalendar', when: 'Localized names' },
  ],

  faq: [
    {
      q: 'How do I print a calendar starting on Sunday in Python?',
      a: 'print(calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 10)) — or .prmonth(2026, 10). The first weekday is stored on the object, so nothing else changes.',
    },
    {
      q: 'What is the difference between calendar.month() and TextCalendar.formatmonth()?',
      a: 'calendar.month is the formatmonth method of a TextCalendar the module creates for you; it uses the module-wide first weekday. Your own TextCalendar has its own.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.TextCalendar',
    meta:  'calendar.TextCalendar',
  },

};
