// content/reference/python/stdlib/calendar/calendar-firstweekday.js — Calendar.firstweekday / getfirstweekday / setfirstweekday

export const meta = {
  slug:        'calendar-firstweekday',
  name:        'Calendar.firstweekday',
  signature:   'cal.firstweekday · cal.getfirstweekday() · cal.setfirstweekday(firstweekday)',
  blurb:       'The first weekday of one Calendar object — a property, plus the getter and setter methods it is built from.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'Calendar.firstweekday Calendar.getfirstweekday Calendar.setfirstweekday calendar object first day of week property sunday first per object',
};

export const method = {
  slug:      'calendar-firstweekday',
  name:      'Calendar.firstweekday',
  signature: 'cal.firstweekday · cal.getfirstweekday() · cal.setfirstweekday(firstweekday)',
  returns:   { type: 'int', desc: 'firstweekday and getfirstweekday() return the stored value modulo 7 (0 = Monday … 6 = Sunday); setfirstweekday returns None.' },

  category:    'Calendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Per-object, unlike the module-level setfirstweekday(): changing it affects only this calendar. There is no validation — any int is stored and read back modulo 7.',

  covers: ['Calendar.firstweekday', 'Calendar.getfirstweekday', 'Calendar.setfirstweekday'],

  cheat: {
    commonCall: 'cal.firstweekday = calendar.SUNDAY',
    returns:    'cal.firstweekday is then 6',
    replaces:   'calendar.setfirstweekday() for one object',
    watchOut:   'a property here, but calendar.firstweekday() is a function',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: true, default: null, desc: 'For setfirstweekday / assignment: 0 (Monday) … 6 (Sunday). Not checked; stored as given.' },
  ],

  modes: [
    {
      id: 'set',
      label: 'set and read',
      blurb: 'Set the value on a TextCalendar, read it back both ways and look at the header it produces.',
      params: [{ name: 'value', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' }],
      template: 'import calendar\ncal = calendar.TextCalendar()\ncal.setfirstweekday({$value})\n(cal.firstweekday, cal.getfirstweekday(), cal.formatweekheader(2))',
      cases: [
        { id: 'sun', label: '6',  values: { value: '6' } },
        { id: 'big', label: '9',  values: { value: '9' } },
        { id: 'neg', label: '-1', values: { value: '-1' } },
        { id: 'iso', label: '7',  values: { value: '7' } },
      ],
    },
  ],
  demoExplainer: 'The setter stores the number unchanged and the getter returns it modulo 7, so 9 reads back as 2 (Wednesday), -1 as 6 (Sunday) and 7 as 0 (Monday). Nothing raises — only the module-level calendar.setfirstweekday() rejects values outside 0–6.',

  patterns: [
    {
      name: 'Switch an existing calendar to Sunday-first',
      desc: 'Assignment to the property.',
      code: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.firstweekday = calendar.SUNDAY',
    },
    {
      name: 'Validate before setting',
      desc: 'The object does not check; Day() does.',
      code: 'import calendar\ncal.firstweekday = calendar.Day(user_value)  # ValueError outside 0–6',
    },
    {
      name: 'Copy the module-wide setting into an object',
      desc: 'calendar.firstweekday() is a function.',
      code: 'import calendar\ncal = calendar.TextCalendar(calendar.firstweekday())',
    },
  ],

  examples: [
    { title: 'Assign the property',          code: 'import calendar\ncal = calendar.Calendar()\ncal.firstweekday = calendar.SUNDAY\ncal.firstweekday', returns: '6' },
    { title: 'The getter and setter',        code: 'import calendar\ncal = calendar.Calendar()\ncal.setfirstweekday(3)\ncal.getfirstweekday()', returns: '3' },
    { title: 'Stored modulo 7',              code: 'import calendar\ncal = calendar.Calendar(9)\n(cal.firstweekday, list(cal.iterweekdays())[:3])', returns: '(2, [2, 3, 4])' },
    { title: 'Changes later output',         code: "import calendar\ncal = calendar.TextCalendar()\nbefore = cal.formatweekheader(2)\ncal.firstweekday = calendar.SUNDAY\n(before, cal.formatweekheader(2))", returns: "('Mo Tu We Th Fr Sa Su', 'Su Mo Tu We Th Fr Sa')" },
    { title: 'The module setting is separate', code: 'import calendar\ncal = calendar.Calendar()\ncal.setfirstweekday(calendar.SUNDAY)\n(cal.firstweekday, calendar.firstweekday())', returns: '(6, 0)' },
    { title: 'It is a property',             code: "import calendar\ntype(vars(calendar.Calendar)['firstweekday']).__name__", returns: "'property'" },
  ],

  pitfalls: [
    {
      name: 'Calling the property',
      desc: 'calendar.firstweekday() is a module function, but Calendar.firstweekday is a property that already returns the int.',
      wrong: { label: 'cal.firstweekday()', code: 'import calendar\ncalendar.Calendar().firstweekday()', output: "TypeError: 'int' object is not callable" },
      fix:   { label: 'cal.firstweekday', code: 'import calendar\ncalendar.Calendar().firstweekday', output: '0' },
    },
    {
      name: 'Expecting a bad value to be rejected',
      desc: 'ISO numbering uses 7 for Sunday. The object stores it and reads back 7 % 7 = 0, Monday.',
      wrong: { label: 'setfirstweekday(7)', code: 'import calendar\ncal = calendar.Calendar()\ncal.setfirstweekday(7)\ncal.firstweekday', output: '0' },
      fix:   { label: 'calendar.SUNDAY', code: 'import calendar\ncal = calendar.Calendar()\ncal.setfirstweekday(calendar.SUNDAY)\ncal.firstweekday', output: '6' },
    },
  ],

  when: {
    use: [
      'Changing the week start of an existing Calendar, TextCalendar or HTMLCalendar',
      'Reading which weekday an object starts on',
    ],
    avoid: [
      'Module-level functions (month, monthcalendar …) → calendar.setfirstweekday()',
      'Validation → calendar.Day(value) first',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: getfirstweekday returns self._firstweekday % 7; setfirstweekday stores self._firstweekday = firstweekday; firstweekday = property(getfirstweekday, setfirstweekday)',
    'Module twin': 'The module\'s firstweekday() and setfirstweekday() work on a shared TextCalendar instance; the module setter validates, this one does not',
  },

  related: [
    { name: 'calendar.setfirstweekday', slug: 'setfirstweekday', when: 'The module-wide setting' },
    { name: 'Calendar',     slug: 'calendar-class', when: 'The class' },
    { name: 'Day enum',     slug: 'day-enum',       when: 'Named weekday values' },
    { name: 'iterweekdays', slug: 'itermonthdates', when: 'The column order it produces' },
    { name: 'property()',   slug: 'property',       when: 'How the attribute is built', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I change the first day of the week of a calendar object?',
      a: 'cal.firstweekday = calendar.SUNDAY, or cal.setfirstweekday(calendar.SUNDAY). Or pass it to the constructor: calendar.TextCalendar(calendar.SUNDAY).',
    },
    {
      q: 'What is the difference between Calendar.setfirstweekday and calendar.setfirstweekday?',
      a: 'The method changes one object and accepts any int (used modulo 7). The module function changes the shared object behind month(), calendar(), monthcalendar() and weekheader() for the whole program, and raises IllegalWeekdayError outside 0–6.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Calendar.firstweekday',
    meta:  'Calendar.firstweekday',
  },

};
