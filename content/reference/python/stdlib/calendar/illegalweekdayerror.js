// content/reference/python/stdlib/calendar/illegalweekdayerror.js

export const meta = {
  slug:        'illegalweekdayerror',
  name:        'calendar.IllegalWeekdayError',
  signature:   'calendar.IllegalWeekdayError(weekday)',
  blurb:       'Raised by calendar.setfirstweekday() for a weekday outside 0–6: "bad weekday number 7; must be 0 (Monday) to 6 (Sunday)". A ValueError subclass.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar IllegalWeekdayError python bad weekday number must be 0 (Monday) to 6 (Sunday) setfirstweekday 7 sunday iso weekday error invalid weekday valueerror',
};

export const method = {
  slug:      'illegalweekdayerror',
  name:      'calendar.IllegalWeekdayError',
  signature: 'calendar.IllegalWeekdayError(weekday)',

  category:    'calendar exception',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Only one function raises it: the module-level calendar.setfirstweekday(). Calendar objects take any number for their first weekday and use it modulo 7, so 7 there silently means Monday.',

  covers: ['IllegalWeekdayError'],

  chain: ['BaseException', 'Exception', 'ValueError', 'IllegalWeekdayError'],

  cheat: {
    raisedBy: 'calendar.setfirstweekday(n) for n outside 0–6',
    message:  'bad weekday number 7; must be 0 (Monday) to 6 (Sunday)',
    quickFix: 'Use calendar.MONDAY … calendar.SUNDAY, or date.weekday() — not isoweekday(), which gives 7 for Sunday',
    watchOut: 'Calendar(7), TextCalendar(7) and cal.firstweekday = 7 raise nothing',
  },

  parameters: [
    { name: 'weekday', type: 'object', required: true, default: null, desc: 'The rejected value, stored in e.weekday and shown with repr() in the message.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Set the module-wide first weekday and read it back; the finally clause restores Monday either way.',
      params: [{ name: 'day', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' }],
      template: 'import calendar\ntry:\n    calendar.setfirstweekday({$day})\n    result = calendar.firstweekday()\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nresult',
      cases: [
        { id: 'iso',    label: '7 (ISO Sunday)', values: { day: '7' } },
        { id: 'neg',    label: '-1',             values: { day: '-1' } },
        { id: 'sunday', label: '6',              values: { day: '6' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'Catch it and read e.weekday, e.args and the message.',
      params: [{ name: 'day', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' }],
      template: "import calendar\ntry:\n    calendar.setfirstweekday({$day})\nexcept calendar.IllegalWeekdayError as e:\n    result = (e.weekday, e.args, str(e))\nelse:\n    result = 'accepted'\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nresult",
      cases: [
        { id: 'seven', label: '7', values: { day: '7' } },
        { id: 'big',   label: '10', values: { day: '10' } },
        { id: 'ok',    label: '3', values: { day: '3' } },
      ],
    },
  ],
  demoExplainer: 'setfirstweekday tests MONDAY <= firstweekday <= SUNDAY before it changes anything, so after the error the setting is untouched. 7 is the classic mistake: Sunday in ISO numbering (date.isoweekday()), but calendar counts Monday = 0 … Sunday = 6. e.args holds the number itself; the message comes from the class\'s __str__.',

  attributes: [
    { name: 'weekday', type: 'object', meaning: 'The value passed to setfirstweekday(), exactly as given.' },
    { name: 'args',    type: 'tuple',  meaning: 'One item, the same value — the message is built by __str__.' },
  ],

  patterns: [
    {
      name: 'Convert ISO weekdays first',
      desc: 'isoweekday() is 1–7; calendar wants 0–6. Restore the shared setting afterwards.',
      code: 'import calendar\nold = calendar.firstweekday()\ntry:\n    calendar.setfirstweekday(iso_weekday - 1)\n    text = calendar.month(2026, 10)\nfinally:\n    calendar.setfirstweekday(old)',
    },
    {
      name: 'Validate without changing anything',
      desc: 'calendar.Day raises ValueError for anything outside 0–6.',
      code: 'import calendar\nfirst = calendar.Day(user_value)  # ValueError: 7 is not a valid Day',
    },
    {
      name: 'Avoid the global setting',
      desc: 'An object with its own first weekday never raises — so pass a valid constant.',
      code: 'import calendar\ncal = calendar.TextCalendar(calendar.SUNDAY)',
    },
  ],

  examples: [
    { title: '7 is not a weekday here',    code: 'import calendar\ncalendar.setfirstweekday(7)', returns: 'calendar.IllegalWeekdayError: bad weekday number 7; must be 0 (Monday) to 6 (Sunday)' },
    { title: 'The value is kept',          code: 'import calendar\ntry:\n    calendar.setfirstweekday(-1)\nexcept calendar.IllegalWeekdayError as e:\n    info = (e.weekday, e.args, str(e))\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\ninfo', returns: "(-1, (-1,), 'bad weekday number -1; must be 0 (Monday) to 6 (Sunday)')" },
    { title: 'A ValueError, not an IndexError', code: 'import calendar\n(issubclass(calendar.IllegalWeekdayError, ValueError), issubclass(calendar.IllegalWeekdayError, IndexError))', returns: '(True, False)' },
    { title: 'Calendar objects do not check', code: 'import calendar\n(calendar.Calendar(7).firstweekday, calendar.Calendar(-1).firstweekday)', returns: '(0, 6)' },
    { title: 'Not only integers are compared', code: 'import calendar\ntry:\n    calendar.setfirstweekday(6.5)\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)', returns: 'calendar.IllegalWeekdayError: bad weekday number 6.5; must be 0 (Monday) to 6 (Sunday)' },
    { title: 'Validate with Day instead',  code: 'import calendar\ncalendar.Day(7)', returns: 'ValueError: 7 is not a valid Day' },
    { title: 'Its repr',                   code: 'import calendar\nrepr(calendar.IllegalWeekdayError(9))', returns: "'IllegalWeekdayError(9)'" },
  ],

  pitfalls: [
    {
      name: 'Passing isoweekday()',
      desc: 'isoweekday() returns 7 for Sunday. weekday() returns the 0–6 numbers calendar uses.',
      wrong: { label: 'isoweekday()', code: 'import calendar, datetime\ntry:\n    calendar.setfirstweekday(datetime.date(2026, 10, 25).isoweekday())\n    first = calendar.firstweekday()\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nfirst', output: 'calendar.IllegalWeekdayError: bad weekday number 7; must be 0 (Monday) to 6 (Sunday)' },
      fix:   { label: 'weekday()',    code: 'import calendar, datetime\ntry:\n    calendar.setfirstweekday(datetime.date(2026, 10, 25).weekday())\n    first = calendar.firstweekday()\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nfirst', output: '6' },
    },
    {
      name: 'Relying on objects to reject a bad weekday',
      desc: 'Only the module function validates. TextCalendar(7) stores 7, reads it back as 7 % 7 = 0 and quietly starts the week on Monday.',
      wrong: { label: 'TextCalendar(7)', code: 'import calendar\ncalendar.TextCalendar(7).formatweekheader(2)', output: "'Mo Tu We Th Fr Sa Su'" },
      fix:   { label: 'TextCalendar(SUNDAY)', code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatweekheader(2)', output: "'Su Mo Tu We Th Fr Sa'" },
    },
  ],

  when: {
    use: [
      'Catch it (or ValueError) around calendar.setfirstweekday() with a user-supplied number',
    ],
    avoid: [
      'Expecting it from Calendar / TextCalendar / HTMLCalendar — they never raise it',
      'Validating weekdays in your own code → calendar.Day(n) raises ValueError',
    ],
  },

  notes: {
    cpython:     'Lib/calendar.py: class IllegalWeekdayError(ValueError) — __init__ stores self.weekday, __str__ returns "bad weekday number %r; must be 0 (Monday) to 6 (Sunday)" % self.weekday. setfirstweekday() raises it when not MONDAY <= firstweekday <= SUNDAY',
    'Not raised': 'Calendar.setfirstweekday(), the firstweekday property and the constructors store any value and use it modulo 7',
    'Command line': 'python -m calendar -f N sets the first weekday through the method, so it does not check either: -f 9 starts the weeks on Wednesday (9 % 7 = 2), verified on 3.13',
  },

  related: [
    { name: 'setfirstweekday', slug: 'setfirstweekday', when: 'The only function that raises it' },
    { name: 'Calendar.firstweekday', slug: 'calendar-firstweekday', when: 'The per-object setting, unchecked' },
    { name: 'Day enum',      slug: 'day-enum',      when: 'MONDAY … SUNDAY' },
    { name: 'IllegalMonthError', slug: 'illegalmontherror', when: 'The month counterpart' },
    { name: 'ValueError',    slug: 'valueerror',    when: 'Its base class', category: 'exceptions' },
    { name: 'calendar module', slug: 'calendar',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does "bad weekday number 7; must be 0 (Monday) to 6 (Sunday)" mean?',
      a: 'calendar.setfirstweekday() got a number outside 0–6. Most often it is an ISO weekday: isoweekday() returns 1–7, with Sunday = 7. Use calendar.SUNDAY (6) and the other Day constants, or date.weekday().',
    },
    {
      q: 'Why does calendar.TextCalendar(7) not raise IllegalWeekdayError?',
      a: 'The classes do not validate. They store the value and the firstweekday property returns it modulo 7, so 7 behaves like 0 (Monday). Only the module-level setfirstweekday() checks the range.',
    },
    {
      q: 'Should I catch IllegalWeekdayError or ValueError?',
      a: 'Either works: IllegalWeekdayError is a ValueError subclass. Catch the specific class when you want e.weekday for the error message.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.IllegalWeekdayError',
    meta:  'calendar.IllegalWeekdayError',
  },

};
