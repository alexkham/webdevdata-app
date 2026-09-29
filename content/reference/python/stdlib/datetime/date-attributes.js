// content/reference/python/stdlib/datetime/date-attributes.js — date.year / month / day

export const meta = {
  slug:        'date-attributes',
  name:        'date.year / month / day',
  signature:   'd.year · d.month · d.day',
  blurb:       'The three read-only integer fields of a date — and of a datetime, which inherits them.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date.year date.month date.day year month day attributes python get year from date get month from datetime day of month read only attribute is not writable',
};

export const method = {
  slug:      'date-attributes',
  name:      'date.year / month / day',
  signature: 'd.year · d.month · d.day',
  returns:   { type: 'int', desc: 'year 1..9999, month 1..12, day 1..31.' },

  category:    'date attributes',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Plain ints, already validated. They are attributes, not methods — no parentheses — and they are read-only: build a changed copy with replace().',

  covers: ['date.year', 'date.month', 'date.day'],

  cheat: {
    commonCall: 'd.year, d.month, d.day',
    returns:    '(2026, 9, 29)',
    replaces:   "int(text[:4]) slicing of 'YYYY-MM-DD' strings",
    watchOut:   'd.year = 2027 raises AttributeError — use d.replace(year=2027)',
  },

  parameters: [],

  attributes: [
    { name: 'year',  type: 'int', meaning: 'MINYEAR (1) to MAXYEAR (9999).' },
    { name: 'month', type: 'int', meaning: '1 to 12 — not zero-based.' },
    { name: 'day',   type: 'int', meaning: '1 to the number of days in the month.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'fields',
      blurb: 'Parse a date or a datetime and read its date fields. A datetime has them too (it is a date subclass).',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 date or timestamp', input: 'text' }],
      template: "from datetime import datetime\nd = datetime.fromisoformat({$when})\n(d.year, d.month, d.day, f'{d.day}.{d.month}.{d.year}')",
      cases: [
        { id: 'date', label: 'a date',      values: { when: '2026-09-29' } },
        { id: 'dt',   label: 'a timestamp', values: { when: '2026-01-05T23:59:59+05:00' } },
      ],
    },
  ],
  demoExplainer: 'The fields are the local wall-clock date as written: 2026-01-05T23:59:59+05:00 reports day 5 even though it is already 18:59 UTC — use astimezone(UTC) first if you want the UTC date. The f-string shows the ints without zero padding.',

  patterns: [
    {
      name: 'Group by year and month',
      desc: 'A (year, month) tuple is a natural dict key.',
      code: 'from collections import defaultdict\nby_month = defaultdict(list)\nfor d in dates:\n    by_month[(d.year, d.month)].append(d)',
    },
    {
      name: 'First day of the month',
      desc: 'replace, not assignment.',
      code: 'first = d.replace(day=1)',
    },
    {
      name: 'Quarter from month',
      desc: 'Integer arithmetic on the month field.',
      code: 'quarter = (d.month - 1) // 3 + 1',
    },
  ],

  examples: [
    { title: 'Read the fields',          code: 'from datetime import date\nd = date(2026, 9, 29)\n(d.year, d.month, d.day)', returns: '(2026, 9, 29)' },
    { title: 'Inherited by datetime',    code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30).year', returns: '2026' },
    { title: 'Without zero padding',     code: "from datetime import date\nd = date(2026, 9, 5)\nf'{d.day}/{d.month}/{d.year}'", returns: "'5/9/2026'" },
    { title: 'Quarter of the year',      code: 'from datetime import date\n(date(2026, 9, 29).month - 1) // 3 + 1', returns: '3' },
    { title: 'Read-only',                code: 'from datetime import date\nd = date(2026, 9, 29)\nd.year = 2027', returns: "AttributeError: attribute 'year' of 'datetime.date' objects is not writable" },
  ],

  pitfalls: [
    {
      name: 'Assigning to a field',
      desc: 'Dates are immutable (they are hashable dict keys). replace() returns a new date.',
      wrong: { label: 'd.month = 10', code: 'from datetime import date\nd = date(2026, 9, 29)\nd.month = 10', output: "AttributeError: attribute 'month' of 'datetime.date' objects is not writable" },
      fix:   { label: 'replace(month=10)', code: 'from datetime import date\ndate(2026, 9, 29).replace(month=10)', output: 'datetime.date(2026, 10, 29)' },
    },
    {
      name: 'Calling them like methods',
      desc: 'year, month and day are ints. (weekday() IS a method — the inconsistency trips people up.)',
      wrong: { label: 'd.year()', code: 'from datetime import date\ndate(2026, 9, 29).year()', output: "TypeError: 'int' object is not callable" },
      fix:   { label: 'd.year', code: 'from datetime import date\ndate(2026, 9, 29).year', output: '2026' },
    },
  ],

  when: {
    use: ['Grouping, bucketing and comparing by calendar parts', 'Building custom labels'],
    avoid: ['Formatting whole dates → strftime or isoformat', 'Changing a field → replace()'],
  },

  notes: {
    cpython:    'Read-only getset descriptors on the C type; the values are unpacked from the 4-byte date data',
    'Also on':  'datetime (inherited); time has hour/minute/second instead',
    'Validity': 'Always consistent — the constructor already rejected 31 April or month 13',
  },

  related: [
    { name: 'hour / minute / second …', slug: 'time-attributes', when: 'The time fields' },
    { name: 'replace', slug: 'replace', when: 'Change a field' },
    { name: 'weekday', slug: 'weekday', when: 'The day of the week (a method)' },
    { name: 'date', slug: 'date', when: 'The class' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the year from a date in Python?',
      a: 'd.year — an int attribute, no parentheses. The same works on a datetime. For the current year: date.today().year.',
    },
    {
      q: 'Why can I not change date.month?',
      a: 'date objects are immutable, so their fields are read-only. d.replace(month=10) creates a new date; it raises ValueError if the day does not exist in the new month.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.date.year',
    meta:  'date.year',
  },
};
