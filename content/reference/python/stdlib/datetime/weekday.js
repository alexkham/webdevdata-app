// content/reference/python/stdlib/datetime/weekday.js — date.weekday / date.isoweekday

export const meta = {
  slug:        'weekday',
  name:        'date.weekday / isoweekday',
  signature:   'd.weekday()',
  blurb:       'The day of the week as a number: weekday() gives Monday = 0 … Sunday = 6, isoweekday() gives Monday = 1 … Sunday = 7.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date.weekday date.isoweekday weekday isoweekday day of week python monday 0 sunday 6 is weekend day name get day of week from date',
};

export const method = {
  slug:      'weekday',
  name:      'date.weekday / isoweekday',
  signature: 'd.weekday()',
  returns:   { type: 'int', desc: 'weekday(): 0..6 from Monday. isoweekday(): 1..7 from Monday.' },

  category:    'date method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Both count from Monday; they differ only by one. Neither matches strftime %w, which counts from Sunday = 0.',

  covers: ['date.weekday', 'date.isoweekday'],

  cheat: {
    commonCall: 'd.weekday() >= 5  # weekend',
    returns:    'True on Saturday and Sunday',
    replaces:   'calendar.weekday(y, m, d)',
    watchOut:   'weekday() is a method (parentheses), unlike year/month/day',
  },

  parameters: [],

  modes: [
    {
      id: 'numbers',
      label: 'numbering',
      blurb: 'The same day through all four conventions.',
      params: [{ name: 'when', type: 'str', hint: 'YYYY-MM-DD', input: 'text' }],
      template: "from datetime import date\nd = date.fromisoformat({$when})\n(d.weekday(), d.isoweekday(), d.strftime('%w'), d.strftime('%A'))",
      cases: [
        { id: 'tue', label: 'a Tuesday', values: { when: '2026-09-29' } },
        { id: 'sun', label: 'a Sunday',  values: { when: '2026-09-27' } },
        { id: 'mon', label: 'a Monday',  values: { when: '2026-09-28' } },
      ],
    },
  ],
  demoExplainer: 'Sunday is the case where they disagree most: weekday() 6, isoweekday() 7, and strftime("%w") "0" — a string, counting from Sunday.',

  patterns: [
    {
      name: 'Is it a weekend?',
      desc: 'Saturday and Sunday are 5 and 6.',
      code: 'is_weekend = d.weekday() >= 5',
    },
    {
      name: 'Monday of the same week',
      desc: 'Subtract the weekday.',
      code: 'from datetime import timedelta\nmonday = d - timedelta(days=d.weekday())',
    },
    {
      name: 'Next Friday (or today if Friday)',
      desc: 'Modular arithmetic on weekday().',
      code: 'from datetime import timedelta\nfriday = d + timedelta(days=(4 - d.weekday()) % 7)',
    },
  ],

  examples: [
    { title: 'A Tuesday',          code: 'from datetime import date\nd = date(2026, 9, 29)\n(d.weekday(), d.isoweekday())', returns: '(1, 2)' },
    { title: 'A Sunday',           code: 'from datetime import date\nd = date(2026, 9, 27)\n(d.weekday(), d.isoweekday())', returns: '(6, 7)' },
    { title: 'Weekend test',       code: 'from datetime import date\ndate(2026, 9, 27).weekday() >= 5', returns: 'True' },
    { title: 'Monday of the week', code: 'from datetime import date, timedelta\nd = date(2026, 9, 29)\nd - timedelta(days=d.weekday())', returns: 'datetime.date(2026, 9, 28)' },
    { title: 'The day name',       code: "from datetime import date\ndate(2026, 9, 29).strftime('%A')", returns: "'Tuesday'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the parentheses',
      desc: 'weekday is a method; without () you get the bound method, which is never equal to a number.',
      wrong: { label: 'd.weekday == 1', code: 'from datetime import date\ndate(2026, 9, 29).weekday == 1', output: 'False' },
      fix:   { label: 'd.weekday() == 1', code: 'from datetime import date\ndate(2026, 9, 29).weekday() == 1', output: 'True' },
    },
    {
      name: 'Mixing up the conventions',
      desc: 'Indexing a Sunday-first list with weekday() is off by one day. Match the list to the method.',
      wrong: { label: 'Sunday-first list', code: "from datetime import date\n['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date(2026, 9, 29).weekday()]", output: "'Mon'" },
      fix:   { label: 'Monday-first list', code: "from datetime import date\n['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date(2026, 9, 29).weekday()]", output: "'Tue'" },
    },
  ],

  when: {
    use: ['Weekend/business-day logic', 'Jumping to the start of a week'],
    avoid: ['Day names for display → strftime("%A") (locale-aware)', 'ISO week numbers → isocalendar()'],
  },

  notes: {
    cpython:       'weekday() is (toordinal() + 6) % 7; isoweekday() adds 1',
    'Conventions': 'weekday 0–6 Mon–Sun · isoweekday 1–7 Mon–Sun · strftime %w 0–6 Sun–Sat · %u 1–7 Mon–Sun',
    'Also on':     'datetime inherits both',
  },

  related: [
    { name: 'isocalendar', slug: 'isocalendar', when: 'ISO year, week and weekday together' },
    { name: 'strftime', slug: 'strftime-strptime', when: '%A, %a, %w, %u' },
    { name: 'toordinal', slug: 'toordinal', when: 'How weekday is computed' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the day of the week from a date in Python?',
      a: 'd.weekday() returns 0 for Monday up to 6 for Sunday; d.isoweekday() returns 1 to 7. For the name use d.strftime("%A").',
    },
    {
      q: 'What is the difference between weekday() and isoweekday()?',
      a: 'Only the starting number: both begin on Monday, weekday() at 0, isoweekday() at 1 (the ISO 8601 convention, also used by isocalendar()).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.date.weekday',
    meta:  'date.weekday',
  },
};
