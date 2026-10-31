// content/reference/python/stdlib/calendar/day_name.js — day_name and day_abbr

export const meta = {
  slug:        'day_name',
  name:        'calendar.day_name / day_abbr',
  signature:   'calendar.day_name[i] · calendar.day_abbr[i]',
  blurb:       'Weekday names and abbreviations in the current locale, indexed 0 (Monday) to 6 (Sunday).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar day_name day_abbr python weekday name from number list of day names monday mon abbreviation day of week name locale',
};

export const method = {
  slug:      'day_name',
  name:      'calendar.day_name / day_abbr',
  signature: 'calendar.day_name[i] · calendar.day_abbr[i]',
  returns:   { type: 'str', desc: 'One name; list(calendar.day_name) gives all seven.' },

  category:    'calendar constant',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Seven names in Monday-first order, matching the numbers that weekday(), date.weekday() and the Day enum use — so calendar.day_name[d.weekday()] is the name of a date\'s weekday.',

  covers: ['day_name', 'day_abbr'],

  cheat: {
    commonCall: 'calendar.day_name[calendar.weekday(2026, 10, 25)]',
    returns:    "'Sunday'",
    replaces:   'a hand-written list of weekday names',
    watchOut:   'index 0 is Monday, not Sunday',
  },

  parameters: [
    { name: 'i', type: 'int | slice', required: true, default: null, desc: '0 (Monday) to 6 (Sunday); negative indexes and slices work like a list.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'number → name',
      blurb: 'Both sequences at the same index.',
      params: [{ name: 'i', type: 'int', hint: '0–6', input: 'number' }],
      template: 'import calendar\n(calendar.day_name[{$i}], calendar.day_abbr[{$i}])',
      cases: [
        { id: 'mon', label: '0',  values: { i: '0' } },
        { id: 'sun', label: '6',  values: { i: '6' } },
        { id: 'neg', label: '-1', values: { i: '-1' } },
        { id: 'big', label: '7',  values: { i: '7' } },
      ],
    },
    {
      id: 'date',
      label: 'date → name',
      blurb: 'The weekday number of a date indexes the names directly.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
        { name: 'day',   type: 'int', hint: '1–31',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.day_name[calendar.weekday({$year}, {$month}, {$day})]',
      cases: [
        { id: 'today', label: '25 Oct 2026', values: { year: '2026', month: '10', day: '25' } },
        { id: 'moon',  label: '20 Jul 1969', values: { year: '1969', month: '7', day: '20' } },
      ],
    },
  ],
  demoExplainer: 'Index 0 is Monday — the numbering of weekday() and date.weekday(), not of JavaScript\'s getDay() or cron, which start at Sunday. -1 wraps to Sunday like a list index; 7 is past the end.',

  patterns: [
    {
      name: 'Weekday name of a date',
      desc: 'date.weekday() uses the same numbering.',
      code: 'import calendar\nname = calendar.day_name[d.weekday()]',
    },
    {
      name: 'Sunday-first list of names',
      desc: 'Rotate by one.',
      code: 'import calendar\nnames = list(calendar.day_abbr)\nsunday_first = names[-1:] + names[:-1]',
    },
    {
      name: 'Name → number',
      desc: 'The position in the sequence.',
      code: "import calendar\nnumber = list(calendar.day_name).index('Friday')",
    },
  ],

  examples: [
    { title: 'All names',                 code: 'import calendar\nlist(calendar.day_name)', returns: "['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" },
    { title: 'Abbreviations',             code: 'import calendar\nlist(calendar.day_abbr)', returns: "['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" },
    { title: 'Name of a date\'s weekday', code: 'import calendar, datetime\ncalendar.day_name[datetime.date(2026, 10, 25).weekday()]', returns: "'Sunday'" },
    { title: 'Name → number',             code: "import calendar\nlist(calendar.day_name).index('Friday')", returns: '4' },
    { title: 'Indexed by a Day member',   code: 'import calendar\ncalendar.day_abbr[calendar.SATURDAY]', returns: "'Sat'" },
    { title: 'Seven items',               code: 'import calendar\nlen(calendar.day_name)', returns: '7' },
  ],

  pitfalls: [
    {
      name: 'Using isoweekday() as the index',
      desc: 'isoweekday() is 1 (Monday) … 7 (Sunday). As an index it is one day off, and Sunday is out of range.',
      wrong: { label: 'day_name[isoweekday()]', code: 'import calendar, datetime\ncalendar.day_name[datetime.date(2026, 10, 25).isoweekday()]', output: 'IndexError: list index out of range' },
      fix:   { label: 'day_name[weekday()]', code: 'import calendar, datetime\ncalendar.day_name[datetime.date(2026, 10, 25).weekday()]', output: "'Sunday'" },
    },
    {
      name: 'Expecting the member name to be the display name',
      desc: 'The Day enum names are upper-case identifiers; day_name holds the human-readable (and locale-dependent) form.',
      wrong: { label: 'Day.name', code: 'import calendar\ncalendar.weekday(2026, 10, 25).name', output: "'SUNDAY'" },
      fix:   { label: 'day_name[...]', code: 'import calendar\ncalendar.day_name[calendar.weekday(2026, 10, 25)]', output: "'Sunday'" },
    },
  ],

  when: {
    use: [
      'Labelling weekday numbers from weekday(), date.weekday() or the Day enum',
      'Column headers in your own layouts',
    ],
    avoid: [
      'A ready-made header row → calendar.weekheader(width)',
      'Formatting a whole date → date.strftime("%A, %d %B")',
    ],
  },

  notes: {
    cpython: 'Lib/calendar.py: _localized_day calls datetime.date(2001, 1, i + 1).strftime("%A" or "%a") on every access — 1 January 2001 was a Monday',
    'Type':  'Not a list — a small class with __getitem__ and __len__ (7)',
    'Locale': 'English in the default C locale; follows locale.setlocale(locale.LC_TIME, ...) afterwards',
  },

  related: [
    { name: 'Day enum',    slug: 'day-enum',   when: 'MONDAY … SUNDAY as named ints' },
    { name: 'weekday',     slug: 'weekday',    when: 'Weekday number of a date' },
    { name: 'weekheader',  slug: 'weekheader', when: 'A header row of abbreviations' },
    { name: 'month_name / month_abbr', slug: 'month_name', when: 'Month names' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the weekday name of a date in Python?',
      a: 'calendar.day_name[d.weekday()], or d.strftime("%A"). Both use the current locale; in the default locale the result is "Monday" … "Sunday".',
    },
    {
      q: 'Does calendar.day_name start with Sunday or Monday?',
      a: 'Monday. day_name[0] is "Monday" and day_name[6] is "Sunday", matching weekday() — even when setfirstweekday() has made Sunday the first column of the printed calendars.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.day_name',
    meta:  'calendar.day_name',
  },

};
