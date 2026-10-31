// content/reference/python/stdlib/calendar/monthcalendar.js

export const meta = {
  slug:        'monthcalendar',
  name:        'calendar.monthcalendar',
  signature:   'calendar.monthcalendar(year, month)',
  blurb:       'A month as a list of weeks, each a list of seven day numbers; days outside the month are 0.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar monthcalendar python month matrix list of weeks calendar grid nth weekday of month fourth thursday last friday first monday zeros padding',
};

export const method = {
  slug:      'monthcalendar',
  name:      'calendar.monthcalendar',
  signature: 'calendar.monthcalendar(year, month)',
  returns:   { type: 'list[list[int]]', desc: '4 to 6 weeks of 7 ints; 0 marks a day of the previous or next month.' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The month already laid out in rows, ready for a table or for questions like "the fourth Thursday". Weeks start on the module-wide first weekday — Monday unless setfirstweekday() changed it.',

  covers: ['monthcalendar'],

  cheat: {
    commonCall: 'calendar.monthcalendar(2026, 10)',
    returns:    '[[0, 0, 0, 1, 2, 3, 4], [5, 6, …], …, [26, 27, 28, 29, 30, 31, 0]]',
    replaces:   'computing the grid offset from the weekday of the 1st by hand',
    watchOut:   'the zeros are padding — skip them when counting or searching',
  },

  parameters: [
    { name: 'year',  type: 'int', required: true, default: null, desc: 'Any integer year.' },
    { name: 'month', type: 'int', required: true, default: null, desc: '1–12; anything else raises calendar.IllegalMonthError.' },
  ],

  modes: [
    {
      id: 'weeks',
      label: 'weeks',
      blurb: 'The month as rows of seven, Monday first.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.monthcalendar({$year}, {$month})',
      cases: [
        { id: 'oct',  label: 'Oct 2026', values: { year: '2026', month: '10' } },
        { id: 'feb',  label: 'Feb 2027', values: { year: '2027', month: '2' } },
        { id: 'six',  label: 'six weeks', values: { year: '2026', month: '3' } },
      ],
    },
    {
      id: 'nth',
      label: 'nth weekday',
      blurb: 'Pick one column (0 = Monday … 6 = Sunday), drop the zeros, take the n-th. n = 0 means the last one.',
      params: [
        { name: 'year',    type: 'int', hint: 'any year',  input: 'number' },
        { name: 'month',   type: 'int', hint: '1–12',      input: 'number' },
        { name: 'weekday', type: 'int', hint: '0–6',       input: 'number' },
        { name: 'n',       type: 'int', hint: '1 = first', input: 'number' },
      ],
      template: 'import calendar\ndays = [week[{$weekday}] for week in calendar.monthcalendar({$year}, {$month}) if week[{$weekday}]]\ndays[{$n} - 1]',
      cases: [
        { id: 'thanks', label: '4th Thursday of Nov', values: { year: '2026', month: '11', weekday: '3', n: '4' } },
        { id: 'labor',  label: '1st Monday of Sep',   values: { year: '2026', month: '9', weekday: '0', n: '1' } },
        { id: 'last',   label: 'last Friday',         values: { year: '2026', month: '11', weekday: '4', n: '0' } },
        { id: 'fifth',  label: '5th Monday',          values: { year: '2026', month: '9', weekday: '0', n: '5' } },
      ],
    },
  ],
  demoExplainer: 'Months need 4 to 6 rows: February 2027 starts on a Monday and has 28 days, so it fills exactly four weeks with no zeros; March 2026 starts on a Sunday and needs six. In nth weekday, n = 0 indexes days[-1], the last match. September 2026 has only four Mondays, so asking for the fifth is an IndexError.',

  patterns: [
    {
      name: 'n-th weekday of a month',
      desc: 'US Thanksgiving: the fourth Thursday of November.',
      code: 'import calendar\nthursdays = [w[calendar.THURSDAY] for w in calendar.monthcalendar(year, 11) if w[calendar.THURSDAY]]\nthanksgiving = thursdays[3]',
    },
    {
      name: 'Last given weekday',
      desc: 'Filter the zeros, then take [-1].',
      code: 'import calendar\nlast_friday = [w[calendar.FRIDAY] for w in calendar.monthcalendar(year, month) if w[calendar.FRIDAY]][-1]',
    },
    {
      name: 'Render as a table',
      desc: 'Blank cells for the padding days.',
      code: "import calendar\nfor week in calendar.monthcalendar(year, month):\n    print(' '.join(f'{d:2}' if d else '  ' for d in week))",
    },
  ],

  examples: [
    { title: 'October 2026',                code: 'import calendar\ncalendar.monthcalendar(2026, 10)', returns: '[[0, 0, 0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17, 18], [19, 20, 21, 22, 23, 24, 25], [26, 27, 28, 29, 30, 31, 0]]' },
    { title: 'How many rows',               code: 'import calendar\n[len(calendar.monthcalendar(2026, m)) for m in (2, 3, 10)]', returns: '[5, 6, 5]' },
    { title: 'Every Friday of a month',     code: 'import calendar\n[w[calendar.FRIDAY] for w in calendar.monthcalendar(2026, 10) if w[calendar.FRIDAY]]', returns: '[2, 9, 16, 23, 30]' },
    { title: 'The fourth Thursday',         code: 'import calendar\n[w[calendar.THURSDAY] for w in calendar.monthcalendar(2026, 11) if w[calendar.THURSDAY]][3]', returns: '26' },
    { title: 'Sunday-first, restored after', code: 'import calendar\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    first_week = calendar.monthcalendar(2026, 2)[0]\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nfirst_week', returns: '[1, 2, 3, 4, 5, 6, 7]' },
    { title: 'Same as Calendar().monthdayscalendar', code: 'import calendar\ncalendar.monthcalendar(2026, 10) == calendar.Calendar().monthdayscalendar(2026, 10)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Counting the padding',
      desc: 'Every row has seven entries, including the zeros of the neighbouring months.',
      wrong: { label: 'count every cell', code: 'import calendar\nsum(len(w) for w in calendar.monthcalendar(2026, 10))', output: '35' },
      fix:   { label: 'skip the zeros', code: 'import calendar\nsum(1 for w in calendar.monthcalendar(2026, 10) for d in w if d)', output: '31' },
    },
    {
      name: 'Taking the last row for "the last Friday"',
      desc: 'The last row can end before Friday — November 2026 ends on a Monday, so its last row has 0 there.',
      wrong: { label: 'last row', code: 'import calendar\ncalendar.monthcalendar(2026, 11)[-1][calendar.FRIDAY]', output: '0' },
      fix:   { label: 'last non-zero', code: 'import calendar\n[w[calendar.FRIDAY] for w in calendar.monthcalendar(2026, 11) if w[calendar.FRIDAY]][-1]', output: '27' },
    },
  ],

  when: {
    use: [
      'Rendering a month grid in a template, GUI or terminal',
      'Holiday rules: n-th or last weekday of a month',
    ],
    avoid: [
      'Different first weekday without touching global state → calendar.Calendar(firstweekday).monthdayscalendar',
      'You need date objects in the cells → Calendar().monthdatescalendar',
    ],
  },

  notes: {
    cpython:       'Lib/calendar.py: monthcalendar = c.monthdayscalendar, a bound method of the module\'s shared TextCalendar instance',
    'First weekday': 'Follows calendar.setfirstweekday(); the default is Monday',
    'Rows':        '4, 5 or 6 weeks depending on where the month starts and how long it is',
  },

  related: [
    { name: 'Calendar.monthdayscalendar', slug: 'monthdayscalendar', when: 'The same with a per-object first weekday' },
    { name: 'monthrange',  slug: 'monthrange',  when: 'Just the first weekday and length' },
    { name: 'setfirstweekday', slug: 'setfirstweekday', when: 'Change the column order module-wide' },
    { name: 'Day enum',    slug: 'day-enum',    when: 'calendar.THURSDAY as a column index' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I find the nth weekday of a month in Python?',
      a: 'Take that weekday\'s column from calendar.monthcalendar and drop the zeros: [w[calendar.THURSDAY] for w in calendar.monthcalendar(2026, 11) if w[calendar.THURSDAY]][3] is 26, the fourth Thursday.',
    },
    {
      q: 'What do the zeros in calendar.monthcalendar mean?',
      a: 'They are days of the previous or next month that fill the first and last week to seven entries. Calendar().monthdatescalendar gives real dates there instead.',
    },
    {
      q: 'How do I make monthcalendar start the week on Sunday?',
      a: 'calendar.Calendar(calendar.SUNDAY).monthdayscalendar(year, month) gives the same structure with Sunday first and no global change. calendar.setfirstweekday(calendar.SUNDAY) changes monthcalendar itself, for the whole program.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.monthcalendar',
    meta:  'calendar.monthcalendar',
  },

};
