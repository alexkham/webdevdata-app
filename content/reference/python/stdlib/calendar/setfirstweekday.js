// content/reference/python/stdlib/calendar/setfirstweekday.js — setfirstweekday() and firstweekday()

export const meta = {
  slug:        'setfirstweekday',
  name:        'calendar.setfirstweekday / firstweekday',
  signature:   'calendar.setfirstweekday(firstweekday) · calendar.firstweekday()',
  blurb:       'Set or read the weekday that starts every week in the module-level functions — month(), calendar(), monthcalendar(), weekheader().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'calendar setfirstweekday firstweekday python week starts on sunday first day of week monday sunday calendar.SUNDAY global setting illegalweekdayerror',
};

export const method = {
  slug:      'setfirstweekday',
  name:      'calendar.setfirstweekday / firstweekday',
  signature: 'calendar.setfirstweekday(firstweekday) · calendar.firstweekday()',
  returns:   { type: 'None · int', desc: 'setfirstweekday returns None; firstweekday() returns the current setting, 0–6.' },

  category:    'calendar function',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'A process-wide switch: it changes the first column for every caller of the module-level functions, including libraries you did not write. To get a Sunday-first calendar in one place, create TextCalendar(calendar.SUNDAY) instead.',

  covers: ['setfirstweekday', 'firstweekday'],

  cheat: {
    commonCall: 'calendar.setfirstweekday(calendar.SUNDAY)',
    returns:    'None; calendar.firstweekday() is then 6',
    replaces:   'rotating weekday lists by hand',
    watchOut:   'global for the whole program; only 0–6 accepted',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: true, default: null, desc: '0 (MONDAY) to 6 (SUNDAY); the Day members work too. Anything else raises calendar.IllegalWeekdayError.' },
  ],

  modes: [
    {
      id: 'set',
      label: 'set, use, restore',
      blurb: 'Change the setting, read it back and look at the first week of February 2026 — then restore Monday.',
      params: [{ name: 'day', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' }],
      template: 'import calendar\ntry:\n    calendar.setfirstweekday({$day})\n    result = (calendar.firstweekday(), calendar.monthcalendar(2026, 2)[0])\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nresult',
      cases: [
        { id: 'sun', label: 'Sunday (6)',  values: { day: '6' } },
        { id: 'mon', label: 'Monday (0)',  values: { day: '0' } },
        { id: 'thu', label: 'Thursday (3)', values: { day: '3' } },
        { id: 'iso', label: '7',           values: { day: '7' } },
      ],
    },
  ],
  demoExplainer: '1 February 2026 is a Sunday. With Sunday first it opens the first row; with the default Monday it sits in the last column after six zeros. 7 — Sunday in ISO numbering — is rejected with calendar.IllegalWeekdayError, and the setting stays as it was.',

  patterns: [
    {
      name: 'Temporarily change it, always restore',
      desc: 'try / finally, so an exception cannot leave the program Sunday-first.',
      code: 'import calendar\nold = calendar.firstweekday()\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    text = calendar.month(2026, 10)\nfinally:\n    calendar.setfirstweekday(old)',
    },
    {
      name: 'No global state at all',
      desc: 'An object with its own first weekday.',
      code: 'import calendar\ncal = calendar.TextCalendar(firstweekday=calendar.SUNDAY)\ntext = cal.formatmonth(2026, 10)',
    },
    {
      name: 'Set it in a script\'s main()',
      desc: 'Fine in a small script that owns the whole process; restoring on the way out keeps the module safe to import.',
      code: "import calendar\n\ndef main():\n    old = calendar.firstweekday()\n    try:\n        calendar.setfirstweekday(calendar.SUNDAY)\n        calendar.prmonth(2026, 10)\n    finally:\n        calendar.setfirstweekday(old)\n\nif __name__ == '__main__':\n    main()",
    },
  ],

  examples: [
    { title: 'The default',               code: 'import calendar\ncalendar.firstweekday()', returns: '0' },
    { title: 'Sunday first, then restore', code: "import calendar\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    seen = (calendar.firstweekday(), calendar.weekheader(2))\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nseen", returns: "(6, 'Su Mo Tu We Th Fr Sa')" },
    { title: 'It returns None',           code: 'import calendar\ntry:\n    result = calendar.setfirstweekday(3)\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nprint(result)', returns: 'None' },
    { title: 'Out of range',              code: 'import calendar\ncalendar.setfirstweekday(7)', returns: 'calendar.IllegalWeekdayError: bad weekday number 7; must be 0 (Monday) to 6 (Sunday)' },
    { title: 'A per-object setting instead', code: 'import calendar\n(calendar.TextCalendar(calendar.SUNDAY).firstweekday, calendar.firstweekday())', returns: '(6, 0)' },
  ],

  pitfalls: [
    {
      name: 'Changing it for code you did not mean to change',
      desc: 'Any other function that calls the module-level functions sees the new setting while it is active.',
      wrong: { label: 'setfirstweekday', code: "import calendar\n\ndef report_header():  # somewhere else in the program\n    return calendar.month(2026, 2).splitlines()[1]\n\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)  # meant only for my table\n    seen = report_header()\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nseen", output: "'Su Mo Tu We Th Fr Sa'" },
      fix:   { label: 'own TextCalendar', code: "import calendar\n\ndef report_header():  # somewhere else in the program\n    return calendar.month(2026, 2).splitlines()[1]\n\nmy_table = calendar.TextCalendar(calendar.SUNDAY).formatmonth(2026, 2)\nreport_header()", output: "'Mo Tu We Th Fr Sa Su'" },
    },
    {
      name: 'Using ISO weekday numbers',
      desc: 'isoweekday() counts Monday = 1 … Sunday = 7; calendar counts Monday = 0 … Sunday = 6. Use the named constants.',
      wrong: { label: '7 for Sunday', code: 'import calendar\ncalendar.setfirstweekday(7)', output: 'calendar.IllegalWeekdayError: bad weekday number 7; must be 0 (Monday) to 6 (Sunday)' },
      fix:   { label: 'calendar.SUNDAY', code: 'import calendar\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    first = calendar.firstweekday()\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nfirst', output: '6' },
    },
  ],

  when: {
    use: [
      'A short script that prints calendars and owns the whole process',
      'Matching a regional convention for every module-level call at once',
    ],
    avoid: [
      'Libraries, web servers, threads — anything shared → TextCalendar(firstweekday) / Calendar(firstweekday)',
      'A one-off Sunday-first layout → pass firstweekday to the object',
    ],
  },

  notes: {
    cpython:       'Lib/calendar.py: setfirstweekday checks MONDAY <= firstweekday <= SUNDAY, then sets c.firstweekday on the shared TextCalendar c; firstweekday = c.getfirstweekday',
    'Affects':     'monthcalendar, month, prmonth, calendar, prcal, weekheader — all bound methods of the same object',
    'Not affected': 'weekday(), monthrange() and isleap() — they do not depend on the first weekday',
    'Validation':  'Only this module function validates; Calendar.setfirstweekday on an object accepts any int and uses it modulo 7',
  },

  related: [
    { name: 'Calendar.firstweekday', slug: 'calendar-firstweekday', when: 'The per-object setting' },
    { name: 'IllegalWeekdayError',   slug: 'illegalweekdayerror',   when: 'What a bad value raises' },
    { name: 'Day enum',              slug: 'day-enum',              when: 'MONDAY … SUNDAY' },
    { name: 'TextCalendar',          slug: 'textcalendar',          when: 'Text calendars with their own first weekday' },
    { name: 'calendar module',       slug: 'calendar',              when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I make Python calendars start on Sunday?',
      a: 'calendar.setfirstweekday(calendar.SUNDAY) for the module-level functions, or calendar.TextCalendar(calendar.SUNDAY) / HTMLCalendar(calendar.SUNDAY) for one object without a global change.',
    },
    {
      q: 'Is calendar.setfirstweekday thread-safe?',
      a: 'It is one shared setting for the whole process, so a thread that changes it changes it for every other thread using the module-level functions. Give each piece of code its own Calendar object instead.',
    },
    {
      q: 'What does calendar.firstweekday() return?',
      a: 'The current setting as an int, 0 (Monday) to 6 (Sunday). It is 0 unless setfirstweekday changed it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.setfirstweekday',
    meta:  'calendar.setfirstweekday',
  },

};
