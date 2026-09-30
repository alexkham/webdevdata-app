// content/reference/python/stdlib/datetime/isocalendar.js — date.isocalendar / date.fromisocalendar

export const meta = {
  slug:        'isocalendar',
  name:        'date.isocalendar / fromisocalendar',
  signature:   'd.isocalendar()',
  blurb:       'ISO 8601 week dates: isocalendar() gives (year, week, weekday); fromisocalendar(year, week, day) builds the date back.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (named tuple 3.9+, fromisocalendar 3.8+)',
  searchTerms: 'date.isocalendar date.fromisocalendar isocalendar fromisocalendar iso week number python week of year iso year IsoCalendarDate week 53 Invalid week Invalid day',
};

export const method = {
  slug:      'isocalendar',
  name:      'date.isocalendar / fromisocalendar',
  signature: 'd.isocalendar()',
  returns:   { type: 'IsoCalendarDate', desc: 'A named tuple (year, week, weekday) — weekday 1 = Monday. fromisocalendar returns a date.' },

  category:    'date method',
  version:     'Python 2.3+ (named tuple 3.9+, fromisocalendar 3.8+)',
  hasLiveDemo: true,

  subtitle: 'ISO weeks start on Monday, and week 1 is the week containing the year\'s first Thursday. So the ISO year can differ from the calendar year for a few days around New Year.',

  covers: ['date.isocalendar', 'date.fromisocalendar'],

  cheat: {
    commonCall: 'd.isocalendar().week',
    returns:    '40 for 2026-09-29',
    replaces:   "int(d.strftime('%V')) and hand-written week logic",
    watchOut:   'Use .year from isocalendar() with .week, not d.year',
  },

  parameters: [
    { name: 'year', type: 'int', required: true, default: null, desc: 'fromisocalendar: the ISO year, 1..9999.' },
    { name: 'week', type: 'int', required: true, default: null, desc: 'fromisocalendar: 1..52, or 53 in long ISO years.' },
    { name: 'day',  type: 'int', required: true, default: null, desc: 'fromisocalendar: 1 (Monday) .. 7 (Sunday).' },
  ],

  modes: [
    {
      id: 'week',
      label: 'isocalendar',
      blurb: 'Try dates near New Year: the ISO year and the calendar year part ways.',
      params: [{ name: 'when', type: 'str', hint: 'YYYY-MM-DD', input: 'text' }],
      template: 'from datetime import date\nd = date.fromisoformat({$when})\n(d.year, d.isocalendar())',
      cases: [
        { id: 'sep',  label: 'late September', values: { when: '2026-09-29' } },
        { id: 'jan1', label: '1 January 2027', values: { when: '2027-01-01' } },
        { id: 'dec',  label: '29 Dec 2025',    values: { when: '2025-12-29' } },
      ],
    },
    {
      id: 'build',
      label: 'fromisocalendar',
      blurb: 'Build a date from an ISO year, week and weekday.',
      params: [
        { name: 'year', type: 'int', hint: 'ISO year', input: 'number' },
        { name: 'week', type: 'int', hint: 'ISO week', input: 'number' },
        { name: 'day',  type: 'int', hint: 'weekday 1-7', input: 'number' },
      ],
      template: 'from datetime import date\ndate.fromisocalendar({$year}, {$week}, {$day})',
      cases: [
        { id: 'ok',     label: '2026-W40-2', values: { year: '2026', week: '40', day: '2' } },
        { id: 'w53',    label: 'week 53 exists', values: { year: '2026', week: '53', day: '1' } },
        { id: 'no53',   label: 'week 53 missing', values: { year: '2025', week: '53', day: '1' } },
        { id: 'day8',   label: 'day 8',     values: { year: '2026', week: '1', day: '8' } },
      ],
    },
  ],
  demoExplainer: '1 January 2027 is a Friday, so it still belongs to the last ISO week of 2026 (week 53), while Monday 29 December 2025 already starts 2026-W01. 2026 has 53 ISO weeks because it begins on a Thursday; 2025 has only 52.',

  patterns: [
    {
      name: 'Group by ISO week',
      desc: 'Key on (ISO year, week) — never (calendar year, week).',
      code: 'key = d.isocalendar()[:2]  # (year, week)',
    },
    {
      name: 'Monday of an ISO week',
      desc: 'fromisocalendar with day 1.',
      code: 'from datetime import date\nweek_start = date.fromisocalendar(2026, 40, 1)',
    },
  ],

  examples: [
    { title: 'Named tuple (3.9+)',          code: 'from datetime import date\ndate(2026, 9, 29).isocalendar()', returns: 'datetime.IsoCalendarDate(year=2026, week=40, weekday=2)' },
    { title: 'Access by name',              code: 'from datetime import date\ndate(2026, 9, 29).isocalendar().week', returns: '40' },
    { title: 'It is still a tuple',         code: 'from datetime import date\ntuple(date(2026, 9, 29).isocalendar())', returns: '(2026, 40, 2)' },
    { title: 'New Year in the old ISO year', code: 'from datetime import date\ndate(2027, 1, 1).isocalendar()', returns: 'datetime.IsoCalendarDate(year=2026, week=53, weekday=5)' },
    { title: 'Back to a date',              code: 'from datetime import date\ndate.fromisocalendar(2026, 40, 2)', returns: 'datetime.date(2026, 9, 29)' },
    { title: 'Week 1 can start in December', code: 'from datetime import date\ndate.fromisocalendar(2026, 1, 1)', returns: 'datetime.date(2025, 12, 29)' },
    { title: 'Validation',                  code: 'from datetime import date\ndate.fromisocalendar(2025, 53, 1)', returns: 'ValueError: Invalid week: 53' },
  ],

  pitfalls: [
    {
      name: 'Pairing the ISO week with the calendar year',
      desc: 'Around New Year the week belongs to the other year. Take the year from isocalendar() too.',
      wrong: { label: 'd.year + week', code: 'from datetime import date\nd = date(2025, 12, 29)\n(d.year, d.isocalendar().week)', output: '(2025, 1)' },
      fix:   { label: 'ISO year + week', code: 'from datetime import date\nd = date(2025, 12, 29)\nd.isocalendar()[:2]', output: '(2026, 1)' },
    },
    {
      name: 'Zero-based weekday',
      desc: 'fromisocalendar uses ISO weekdays 1..7, not weekday()\'s 0..6.',
      wrong: { label: 'day 0', code: 'from datetime import date\ndate.fromisocalendar(2026, 1, 0)', output: 'ValueError: Invalid day: 0 (range is [1, 7])' },
      fix:   { label: 'day 1 = Monday', code: 'from datetime import date\ndate.fromisocalendar(2026, 1, 1)', output: 'datetime.date(2025, 12, 29)' },
    },
  ],

  when: {
    use: ['Weekly reports, sprints and payroll periods', 'Parsing and writing YYYY-Www-D week dates'],
    avoid: ['US-style weeks starting on Sunday → strftime %U', 'Calendar months → date fields'],
  },

  notes: {
    cpython:     'iso_week1_monday / iso_to_ymd in Modules/_datetimemodule.c; fromisocalendar validates year, then week, then day',
    'Week 53':   'A year has 53 ISO weeks when it starts on a Thursday, or on a Wednesday in a leap year',
    'Inherited': 'datetime.isocalendar and datetime.fromisocalendar (midnight) are the same methods',
    'History':   'isocalendar returned a plain tuple before 3.9; fromisocalendar was added in 3.8',
  },

  related: [
    { name: 'weekday / isoweekday', slug: 'weekday', when: 'Just the day of the week' },
    { name: 'fromisoformat', slug: 'fromisoformat', when: 'Parses 2026-W40-2 text directly (3.11+)' },
    { name: 'strftime', slug: 'strftime-strptime', when: '%G, %V, %u' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the week number of a date in Python?',
      a: 'd.isocalendar().week for the ISO 8601 week (Monday start, week 1 contains the first Thursday). strftime("%U") and "%W" give other, non-ISO week numbers.',
    },
    {
      q: 'Why does 1 January belong to week 52 or 53?',
      a: 'ISO week 1 is the week with the year\'s first Thursday. If 1 January falls on Friday, Saturday or Sunday it is still in the last week of the previous ISO year — so read the ISO year from isocalendar() as well.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.date.isocalendar',
    meta:  'date.isocalendar',
  },
};
