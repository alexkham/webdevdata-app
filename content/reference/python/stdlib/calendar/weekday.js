// content/reference/python/stdlib/calendar/weekday.js

export const meta = {
  slug:        'weekday',
  name:        'calendar.weekday',
  signature:   'calendar.weekday(year, month, day)',
  blurb:       'The day of the week of a date as a calendar.Day member: MONDAY (0) to SUNDAY (6).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); returns a Day member since 3.12',
  searchTerms: 'calendar weekday python day of week from date what day is it monday 0 sunday 6 day name calendar.Day weekday number',
};

export const method = {
  slug:      'weekday',
  name:      'calendar.weekday',
  signature: 'calendar.weekday(year, month, day)',
  returns:   { type: 'calendar.Day', desc: 'An IntEnum member, so it compares and indexes like the int 0–6 (Monday = 0).' },

  category:    'calendar function',
  version:     'Python 3 (all versions); returns a Day member since 3.12',
  hasLiveDemo: true,

  subtitle: 'Three ints in, the weekday out — Monday is 0 and Sunday is 6, the same numbering as date.weekday(). Since Python 3.12 the result is a calendar.Day member, which is still an int.',

  covers: ['weekday'],

  cheat: {
    commonCall: 'calendar.weekday(2026, 10, 25)',
    returns:    'calendar.SUNDAY (== 6)',
    replaces:   'datetime.date(y, m, d).weekday() when you only have numbers',
    watchOut:   'Sunday is 6, not 0',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'Any integer year. Years outside 1–9999 are moved into the same place of the 400-year Gregorian cycle first (since 3.7; earlier versions raised ValueError for them).' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1–12. Anything else raises ValueError from datetime: month must be in 1..12.' },
    { name: 'day',   type: 'int', required: true, default: null, desc: 'Day of the month; a day the month does not have raises ValueError: day is out of range for month.' },
  ],

  modes: [
    {
      id: 'day',
      label: 'weekday',
      blurb: 'Type a date. The result prints as a Day member.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
        { name: 'day',   type: 'int', hint: '1–31',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.weekday({$year}, {$month}, {$day})',
      cases: [
        { id: 'today', label: '25 Oct 2026',   values: { year: '2026', month: '10', day: '25' } },
        { id: 'epoch', label: '1 Jan 1970',    values: { year: '1970', month: '1', day: '1' } },
        { id: 'y0',    label: 'year 0',        values: { year: '0', month: '1', day: '1' } },
        { id: 'nope',  label: '29 Feb 2026',   values: { year: '2026', month: '2', day: '29' } },
      ],
    },
    {
      id: 'name',
      label: 'number and name',
      blurb: 'The same result as an int, as the member name, and as the day name for display.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
        { name: 'day',   type: 'int', hint: '1–31',     input: 'number' },
      ],
      template: 'import calendar\nd = calendar.weekday({$year}, {$month}, {$day})\n(int(d), d.name, calendar.day_name[d])',
      cases: [
        { id: 'today', label: '25 Oct 2026', values: { year: '2026', month: '10', day: '25' } },
        { id: 'leap',  label: '29 Feb 2000', values: { year: '2000', month: '2', day: '29' } },
      ],
    },
  ],
  demoExplainer: 'Year 0 is not a valid datetime.date year, yet weekday(0, 1, 1) answers calendar.SATURDAY: years outside 1–9999 are replaced by 2000 + year % 400 before datetime is asked, which lands on the same weekday because the Gregorian calendar repeats every 400 years. A day the month does not have still fails, with datetime\'s ValueError.',

  patterns: [
    {
      name: 'Weekend check',
      desc: 'SATURDAY is 5 and SUNDAY is 6.',
      code: 'import calendar\nis_weekend = calendar.weekday(year, month, day) >= calendar.SATURDAY',
    },
    {
      name: 'Day name for display',
      desc: 'The Day member indexes day_name like an int.',
      code: 'import calendar\nname = calendar.day_name[calendar.weekday(year, month, day)]',
    },
    {
      name: 'Sunday-based number (0 = Sunday)',
      desc: 'For JavaScript getDay() or cron conventions.',
      code: 'import calendar\nsun0 = (calendar.weekday(year, month, day) + 1) % 7',
    },
  ],

  examples: [
    { title: 'Day of the week',            code: 'import calendar\ncalendar.weekday(2026, 10, 25)', returns: 'calendar.SUNDAY' },
    { title: 'It is still an int',         code: 'import calendar\n(calendar.weekday(2026, 10, 25) == 6, isinstance(calendar.weekday(2026, 10, 25), int))', returns: '(True, True)' },
    { title: 'Day name',                   code: 'import calendar\ncalendar.day_name[calendar.weekday(1970, 1, 1)]', returns: "'Thursday'" },
    { title: 'Same numbering as date.weekday()', code: 'import calendar, datetime\n(calendar.weekday(2026, 10, 25), datetime.date(2026, 10, 25).weekday(), datetime.date(2026, 10, 25).isoweekday())', returns: '(calendar.SUNDAY, 6, 7)' },
    { title: 'Beyond datetime\'s years',   code: 'import calendar\n(calendar.weekday(10000, 1, 1), calendar.weekday(2000, 1, 1))', returns: '(calendar.SATURDAY, calendar.SATURDAY)' },
    { title: 'A day that does not exist',  code: 'import calendar\ncalendar.weekday(2026, 2, 29)', returns: 'ValueError: day is out of range for month' },
  ],

  pitfalls: [
    {
      name: 'Assuming Sunday is 0',
      desc: 'JavaScript getDay() and cron count from Sunday; calendar counts from Monday. A Sunday-first list gives the wrong name.',
      wrong: { label: 'Sunday-first list', code: "import calendar\n['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][calendar.weekday(2026, 10, 25)]", output: "'Sat'" },
      fix:   { label: 'calendar.day_abbr', code: 'import calendar\ncalendar.day_abbr[calendar.weekday(2026, 10, 25)]', output: "'Sun'" },
    },
    {
      name: 'Catching IllegalMonthError around weekday()',
      desc: 'weekday() does not check the month itself — datetime.date does, and raises a plain ValueError. Catch ValueError (IllegalMonthError is a subclass, so that also covers monthrange()).',
      wrong: { label: 'except IllegalMonthError', code: "import calendar\ntry:\n    calendar.weekday(2026, 13, 1)\nexcept calendar.IllegalMonthError:\n    result = 'bad month'\nresult", output: 'ValueError: month must be in 1..12' },
      fix:   { label: 'except ValueError', code: "import calendar\ntry:\n    calendar.weekday(2026, 13, 1)\nexcept ValueError:\n    result = 'bad month'\nresult", output: "'bad month'" },
    },
  ],

  when: {
    use: [
      'You have year, month and day as numbers and need the weekday',
      'Years datetime cannot hold (0, negative, after 9999)',
    ],
    avoid: [
      'You already have a date object → d.weekday() or d.isoweekday()',
      'The weekday of the 1st plus the month length → calendar.monthrange',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: if not MINYEAR <= year <= MAXYEAR: year = 2000 + year % 400; return Day(datetime.date(year, month, day).weekday())',
    'Return type': 'calendar.Day member since 3.12 (repr calendar.SUNDAY, str() gives "6"); a plain int before',
    'Validation': 'Month and day are checked by datetime.date, so errors are ValueError: month must be in 1..12 / day is out of range for month',
  },

  related: [
    { name: 'Day enum',    slug: 'day-enum',   when: 'MONDAY … SUNDAY' },
    { name: 'day_name',    slug: 'day_name',   when: 'Turn the number into a name' },
    { name: 'monthrange',  slug: 'monthrange', when: 'Weekday of the 1st and days in the month' },
    { name: 'date.weekday', slug: 'weekday',   when: 'The same on a date object', category: 'stdlib/datetime' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the day of the week from a date in Python?',
      a: 'calendar.weekday(year, month, day) returns 0 for Monday through 6 for Sunday (as a calendar.Day member). With a date object, d.weekday() gives the same number and d.isoweekday() gives 1 (Monday) to 7 (Sunday).',
    },
    {
      q: 'How do I get the weekday name instead of a number?',
      a: 'Index calendar.day_name (or day_abbr) with it: calendar.day_name[calendar.weekday(2026, 10, 25)] is "Sunday". The member name, calendar.weekday(...).name, is the upper-case "SUNDAY".',
    },
    {
      q: 'Why does calendar.weekday return calendar.SUNDAY instead of 6?',
      a: 'Since Python 3.12 it returns a member of the calendar.Day IntEnum. It equals 6, works as a list index and in arithmetic; only its repr changed. int(result) gives the plain number.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.weekday',
    meta:  'calendar.weekday',
  },

};
