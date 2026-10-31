// content/reference/python/stdlib/calendar/monthrange.js

export const meta = {
  slug:        'monthrange',
  name:        'calendar.monthrange',
  signature:   'calendar.monthrange(year, month)',
  blurb:       'A pair for one month: the weekday of its first day and its number of days (28–31, leap years included).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar monthrange python number of days in month days in a month last day of month first weekday of month february 28 29 leap year month length',
};

export const method = {
  slug:      'monthrange',
  name:      'calendar.monthrange',
  signature: 'calendar.monthrange(year, month)',
  returns:   { type: 'tuple[calendar.Day, int]', desc: '(weekday of the 1st as a Day member, number of days in the month).' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The standard answer to "how many days are in this month?" — it is the second item. The first item is the weekday the month starts on, which is what you need to lay a month out in a grid.',

  covers: ['monthrange'],

  cheat: {
    commonCall: 'calendar.monthrange(2024, 2)[1]',
    returns:    '29 — the whole pair is (calendar.THURSDAY, 29)',
    replaces:   'a hand-written month-length table with a leap-year special case',
    watchOut:   '[0] is the weekday, [1] is the number of days',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'Any integer year (leap years decide February).' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1–12; anything else raises calendar.IllegalMonthError.' },
  ],

  modes: [
    {
      id: 'range',
      label: 'monthrange',
      blurb: 'Weekday of the 1st and the number of days.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.monthrange({$year}, {$month})',
      cases: [
        { id: 'feb24', label: 'Feb 2024', values: { year: '2024', month: '2' } },
        { id: 'feb00', label: 'Feb 1900', values: { year: '1900', month: '2' } },
        { id: 'oct26', label: 'Oct 2026', values: { year: '2026', month: '10' } },
        { id: 'bad',   label: 'month 13', values: { year: '2026', month: '13' } },
      ],
    },
    {
      id: 'last',
      label: 'last day as a date',
      blurb: 'The day count as the day of a datetime.date — the last day of the month.',
      params: [
        { name: 'year',  type: 'int', hint: '1–9999', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',   input: 'number' },
      ],
      template: 'import calendar, datetime\ndatetime.date({$year}, {$month}, calendar.monthrange({$year}, {$month})[1])',
      cases: [
        { id: 'feb24', label: 'Feb 2024', values: { year: '2024', month: '2' } },
        { id: 'apr',   label: 'Apr 2026', values: { year: '2026', month: '4' } },
        { id: 'y0',    label: 'year 0',   values: { year: '0', month: '1' } },
      ],
    },
  ],
  demoExplainer: '1900 is divisible by 100 but not by 400, so its February has 28 days. Month 13 is rejected by monthrange itself with calendar.IllegalMonthError. In the second tab, year 0 passes monthrange (the calendar functions accept any integer year) and only fails when datetime.date is built: datetime years run from 1 to 9999.',

  patterns: [
    {
      name: 'Days in a month',
      desc: 'The second item.',
      code: 'import calendar\ndays = calendar.monthrange(year, month)[1]',
    },
    {
      name: 'Unpack both values',
      desc: 'Start weekday and length together, e.g. to draw a grid.',
      code: 'import calendar\nfirst_weekday, days = calendar.monthrange(year, month)',
    },
    {
      name: 'Last day of the month',
      desc: 'As a date; replace(day=...) works on an existing date too.',
      code: 'import calendar, datetime\nlast = d.replace(day=calendar.monthrange(d.year, d.month)[1])',
    },
  ],

  examples: [
    { title: 'Weekday of the 1st, number of days', code: 'import calendar\ncalendar.monthrange(2024, 2)', returns: '(calendar.THURSDAY, 29)' },
    { title: 'Only the number of days',   code: 'import calendar\ncalendar.monthrange(2023, 2)[1]', returns: '28' },
    { title: 'Unpack the pair',           code: 'import calendar\nfirst, days = calendar.monthrange(2026, 10)\n(first.name, days)', returns: "('THURSDAY', 31)" },
    { title: 'Every month of a year',     code: 'import calendar\n[calendar.monthrange(2026, m)[1] for m in range(1, 13)]', returns: '[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]' },
    { title: 'Last day as a date',        code: 'import calendar, datetime\ndatetime.date(2026, 2, calendar.monthrange(2026, 2)[1])', returns: 'datetime.date(2026, 2, 28)' },
    { title: 'A month that does not exist', code: 'import calendar\ncalendar.monthrange(2026, 0)', returns: 'calendar.IllegalMonthError: bad month number 0; must be 1-12' },
  ],

  pitfalls: [
    {
      name: 'Taking [0] as the number of days',
      desc: 'The first item is the weekday of the 1st. For February 2026 that is Sunday — 6 — which looks like a plausible small number.',
      wrong: { label: 'monthrange(...)[0]', code: 'import calendar\ncalendar.monthrange(2026, 2)[0]', output: 'calendar.SUNDAY' },
      fix:   { label: 'monthrange(...)[1]', code: 'import calendar\ncalendar.monthrange(2026, 2)[1]', output: '28' },
    },
    {
      name: 'A month-length table without leap years',
      desc: 'A fixed list says February has 28 days in 2024 too.',
      wrong: { label: 'fixed table', code: 'DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\nDAYS[2 - 1]', output: '28' },
      fix:   { label: 'monthrange', code: 'import calendar\ncalendar.monthrange(2024, 2)[1]', output: '29' },
    },
  ],

  when: {
    use: [
      'Number of days in a month, February included',
      'Last day of a month for billing periods and date ranges',
      'Where a month starts in a 7-column grid',
    ],
    avoid: [
      'Only leap or not → calendar.isleap',
      'The whole month as weeks → calendar.monthcalendar',
    ],
  },

  notes: {
    cpython:     'Lib/calendar.py: _validate_month(month); day1 = weekday(year, month, 1); ndays = mdays[month] + (month == FEBRUARY and isleap(year))',
    'First item': 'A calendar.Day member (3.12+), equal to 0–6 with Monday = 0',
    'Errors':    'Month outside 1–12 → calendar.IllegalMonthError: bad month number N; must be 1-12',
  },

  related: [
    { name: 'monthcalendar', slug: 'monthcalendar', when: 'The month as a list of weeks' },
    { name: 'isleap',        slug: 'isleap',        when: 'Leap-year test' },
    { name: 'weekday',       slug: 'weekday',       when: 'Weekday of any day' },
    { name: 'IllegalMonthError', slug: 'illegalmontherror', when: 'What a bad month raises' },
    { name: 'date.replace',  slug: 'replace',       when: 'Jump to the last day of a date\'s month', category: 'stdlib/datetime' },
    { name: 'calendar module', slug: 'calendar',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the number of days in a month in Python?',
      a: 'calendar.monthrange(year, month)[1]. It handles leap years: monthrange(2024, 2)[1] is 29 and monthrange(2023, 2)[1] is 28.',
    },
    {
      q: 'How do I get the last day of the month?',
      a: 'datetime.date(year, month, calendar.monthrange(year, month)[1]), or d.replace(day=calendar.monthrange(d.year, d.month)[1]) for an existing date.',
    },
    {
      q: 'What is the first value monthrange returns?',
      a: 'The weekday of the first day of the month, Monday = 0 … Sunday = 6, as a calendar.Day member since Python 3.12. monthrange(2026, 10) is (calendar.THURSDAY, 31): October 2026 starts on a Thursday.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.monthrange',
    meta:  'calendar.monthrange',
  },

};
