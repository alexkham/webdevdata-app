// content/reference/python/stdlib/datetime/combine.js
// datetime.combine, datetime.date(), datetime.time(), datetime.timetz()

export const meta = {
  slug:        'combine',
  name:        'datetime.combine / date() / time() / timetz()',
  signature:   'datetime.combine(date, time, tzinfo=time.tzinfo)',
  blurb:       'Join a date and a time into a datetime (combine), or split a datetime into its date, its time, or its time with tzinfo.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (tzinfo argument 3.6+)',
  searchTerms: 'datetime.combine datetime.date datetime.time datetime.timetz combine date and time split datetime get date from datetime get time from datetime python timetz start of day midnight',
};

export const method = {
  slug:      'combine',
  name:      'datetime.combine / date() / time() / timetz()',
  signature: 'datetime.combine(date, time, tzinfo=time.tzinfo)',
  returns:   { type: 'datetime', desc: 'combine → datetime. dt.date() → date, dt.time() → naive time, dt.timetz() → time with tzinfo.' },

  category:    'datetime method',
  version:     'Python 2.3+ (tzinfo argument 3.6+)',
  hasLiveDemo: true,

  subtitle: 'The glue between the three value types. combine takes the zone from the time unless you pass tzinfo; time() drops the zone, timetz() keeps it.',

  covers: ['datetime.combine', 'datetime.date', 'datetime.time', 'datetime.timetz'],

  cheat: {
    commonCall: 'datetime.combine(d, time(9, 30), tzinfo=UTC)',
    returns:    'datetime.datetime(…, 9, 30, tzinfo=datetime.timezone.utc)',
    replaces:   'datetime(d.year, d.month, d.day, t.hour, t.minute, …)',
    watchOut:   'dt.time() loses tzinfo; use dt.timetz() to keep it',
  },

  parameters: [
    { name: 'date',   type: 'date', required: true,  default: null, desc: 'Supplies year, month, day (a datetime works too; its time part is ignored).' },
    { name: 'time',   type: 'time', required: true,  default: null, desc: 'Supplies hour … microsecond and fold.' },
    { name: 'tzinfo', type: 'tzinfo | None', required: false, default: 'time.tzinfo', desc: 'Overrides the time\'s tzinfo (3.6+); pass None to force a naive result.' },
  ],

  modes: [
    {
      id: 'join',
      label: 'combine',
      blurb: 'A date and a time of day become one datetime.',
      params: [
        { name: 'd', type: 'str', hint: 'YYYY-MM-DD', input: 'text' },
        { name: 't', type: 'str', hint: 'HH:MM[+HH:MM]', input: 'text' },
      ],
      template: 'from datetime import date, datetime, time\ndatetime.combine(date.fromisoformat({$d}), time.fromisoformat({$t}))',
      cases: [
        { id: 'naive', label: 'naive time',   values: { d: '2026-09-29', t: '09:30' } },
        { id: 'aware', label: 'aware time',   values: { d: '2026-09-29', t: '09:30+05:30' } },
        { id: 'bad',   label: 'bad time',     values: { d: '2026-09-29', t: '9:30' } },
      ],
    },
    {
      id: 'split',
      label: 'split',
      blurb: 'Take a datetime apart. Note which part keeps the zone.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndt = datetime.fromisoformat({$when})\n(dt.date(), dt.time(), dt.timetz())',
      cases: [
        { id: 'aware', label: 'aware', values: { when: '2026-09-29T14:30+02:00' } },
        { id: 'naive', label: 'naive', values: { when: '2026-09-29T14:30:05.5' } },
      ],
    },
  ],
  demoExplainer: 'combine copies tzinfo from the time, so 09:30+05:30 gives an aware result. On the way back, time() returns the naive wall-clock time and timetz() the same time with its timezone; for a naive datetime the two are identical.',

  patterns: [
    {
      name: 'Start and end of a day',
      desc: 'time() is midnight; time.max the last microsecond.',
      code: 'from datetime import datetime, time, UTC\nstart = datetime.combine(d, time(), tzinfo=UTC)\nend = datetime.combine(d, time.max, tzinfo=UTC)',
    },
    {
      name: 'Date input + time input from a form',
      desc: 'Two ISO fields, one aware datetime.',
      code: "from datetime import date, datetime, time\nwhen = datetime.combine(date.fromisoformat(form['day']), time.fromisoformat(form['at']), tzinfo=user_tz)",
    },
    {
      name: 'Group events by calendar day',
      desc: '.date() is hashable.',
      code: 'from itertools import groupby\nfor day, items in groupby(sorted(events, key=lambda e: e.at), key=lambda e: e.at.date()):\n    ...',
    },
  ],

  examples: [
    { title: 'Join',                         code: 'from datetime import date, datetime, time\ndatetime.combine(date(2026, 9, 29), time(14, 30))', returns: 'datetime.datetime(2026, 9, 29, 14, 30)' },
    { title: 'Zone from the time',           code: 'from datetime import date, datetime, time, UTC\ndatetime.combine(date(2026, 9, 29), time(14, 30, tzinfo=UTC))', returns: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)' },
    { title: 'Zone as an argument (3.6+)',   code: 'from datetime import date, datetime, time, UTC\ndatetime.combine(date(2026, 9, 29), time(14, 30), tzinfo=UTC)', returns: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)' },
    { title: 'Midnight of a date',           code: 'from datetime import date, datetime, time\ndatetime.combine(date(2026, 9, 29), time())', returns: 'datetime.datetime(2026, 9, 29, 0, 0)' },
    { title: 'Split: date(), time(), timetz()', code: 'from datetime import datetime, timedelta, timezone\ndt = datetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2)))\n(dt.date(), dt.time(), dt.timetz())', returns: '(datetime.date(2026, 9, 29), datetime.time(14, 30), datetime.time(14, 30, tzinfo=datetime.timezone(datetime.timedelta(seconds=7200))))' },
    { title: 'Strings are rejected',         code: "from datetime import datetime, time\ndatetime.combine('2026-09-29', time(14, 30))", returns: 'TypeError: combine() argument 1 must be datetime.date, not str' },
  ],

  pitfalls: [
    {
      name: 'Losing the zone with time()',
      desc: 'dt.time() is always naive. Comparing it with aware times, or combining it back, silently drops the offset.',
      wrong: { label: '.time()', code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30+02:00').time().tzinfo is None", output: 'True' },
      fix:   { label: '.timetz()', code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30+02:00').timetz().tzinfo", output: 'datetime.timezone(datetime.timedelta(seconds=7200))' },
    },
    {
      name: 'Calling date() on the class after from datetime import datetime',
      desc: 'datetime.date is the METHOD here, not the date class, so it needs a datetime instance.',
      wrong: { label: 'datetime.date(…)', code: 'from datetime import datetime\ndatetime.date(2026, 9, 29)', output: "TypeError: descriptor 'date' for 'datetime.datetime' objects doesn't apply to a 'int' object" },
      fix:   { label: 'import date', code: 'from datetime import date\ndate(2026, 9, 29)', output: 'datetime.date(2026, 9, 29)' },
    },
  ],

  when: {
    use: ['Separate date and time inputs (forms, CSV columns)', 'Day boundaries: combine(d, time()) and combine(d, time.max)'],
    avoid: ['Changing only the time of an existing datetime → replace(hour=…)'],
  },

  notes: {
    cpython:    'combine copies fold from the time; date() / time() / timetz() build new objects from the packed fields',
    'Naming':   'With from datetime import datetime, the name datetime.date refers to this method — a frequent source of TypeErrors',
    'tzinfo':   'combine(d, t, tzinfo=None) gives a naive result even when t is aware',
  },

  related: [
    { name: 'replace', slug: 'replace', when: 'Change the time part in place of combining' },
    { name: 'date', slug: 'date', when: 'The date class' },
    { name: 'time', slug: 'time', when: 'The time class' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get just the date from a datetime?',
      a: 'dt.date() returns a date with the same year, month and day. For an aware value those are the local fields; call dt.astimezone(UTC).date() first if you want the UTC date.',
    },
    {
      q: 'How do I combine a date and a time into a datetime?',
      a: 'datetime.combine(d, t). The tzinfo comes from t unless you pass tzinfo=..., which can also be None to get a naive result.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.combine',
    meta:  'datetime.combine',
  },
};
