// content/reference/python/stdlib/datetime/timestamp.js — datetime.timestamp()

export const meta = {
  slug:        'timestamp',
  name:        'datetime.timestamp',
  signature:   'dt.timestamp()',
  blurb:       'Seconds since 1970-01-01T00:00:00Z as a float — the POSIX timestamp of an aware datetime (naive values are taken as local time).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'datetime.timestamp timestamp unix timestamp epoch seconds datetime to timestamp python milliseconds int timestamp posix naive local time',
};

export const method = {
  slug:      'timestamp',
  name:      'datetime.timestamp',
  signature: 'dt.timestamp()',
  returns:   { type: 'float', desc: 'POSIX seconds, microseconds as the fraction.' },

  category:    'datetime method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'For an aware datetime it is exact arithmetic: (dt - epoch) / 1 second. For a naive one Python asks the operating system what that local time was — so the same naive value gives different timestamps on different machines.',

  covers: ['datetime.timestamp'],

  cheat: {
    commonCall: 'datetime(2026, 9, 29, 12, tzinfo=UTC).timestamp()',
    returns:    '1790683200.0',
    replaces:   'calendar.timegm(dt.utctimetuple()) and time.mktime(dt.timetuple())',
    watchOut:   'Naive values are interpreted as LOCAL time',
  },

  parameters: [],

  modes: [
    {
      id: 'epoch',
      label: 'to epoch seconds',
      blurb: 'Aware input gives the same answer everywhere. Naive input is flagged rather than guessed, because the real answer depends on the machine.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: "from datetime import datetime\ndt = datetime.fromisoformat({$when})\ndt.timestamp() if dt.tzinfo else 'naive: timestamp() would use local time'",
      cases: [
        { id: 'utc',    label: 'UTC',            values: { when: '2026-09-29T12:00Z' } },
        { id: 'offset', label: 'same instant, +02:00', values: { when: '2026-09-29T14:00+02:00' } },
        { id: 'micro',  label: 'microseconds',   values: { when: '2026-09-29T12:00:00.123456Z' } },
        { id: 'naive',  label: 'naive',          values: { when: '2026-09-29T12:00' } },
      ],
    },
  ],
  demoExplainer: '12:00Z and 14:00+02:00 are the same instant, so both give 1790683200.0. Microseconds become the fractional part. A naive value has no offset, and CPython would call the C library\'s mktime() with the machine\'s timezone — the demo refuses to guess.',

  patterns: [
    {
      name: 'Integer seconds',
      desc: 'int() truncates toward zero; fine for positive timestamps.',
      code: 'epoch = int(dt.timestamp())',
    },
    {
      name: 'Milliseconds for JavaScript',
      desc: 'Exact integer milliseconds without float rounding.',
      code: 'from datetime import datetime, timedelta, UTC\nms = (dt - datetime(1970, 1, 1, tzinfo=UTC)) // timedelta(milliseconds=1)',
    },
    {
      name: 'Naive value known to be UTC',
      desc: 'Attach UTC before asking, or the local zone is used.',
      code: 'from datetime import UTC\nts = naive_utc.replace(tzinfo=UTC).timestamp()',
    },
  ],

  examples: [
    { title: 'Aware UTC',                 code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12, tzinfo=UTC).timestamp()', returns: '1790683200.0' },
    { title: 'Offset does not matter',    code: 'from datetime import datetime, timedelta, timezone\ndatetime(2026, 9, 29, 14, tzinfo=timezone(timedelta(hours=2))).timestamp()', returns: '1790683200.0' },
    { title: 'The epoch is zero',         code: 'from datetime import datetime, UTC\ndatetime(1970, 1, 1, tzinfo=UTC).timestamp()', returns: '0.0' },
    { title: 'Microseconds in the fraction', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12, 0, 0, 123456, tzinfo=UTC).timestamp()', returns: '1790683200.123456' },
    { title: 'Before 1970 is negative',   code: 'from datetime import datetime, UTC\ndatetime(1969, 12, 31, 23, 59, tzinfo=UTC).timestamp()', returns: '-60.0' },
    { title: 'Exact integer seconds',     code: 'from datetime import datetime, timedelta, UTC\n(datetime(2026, 9, 29, 12, tzinfo=UTC) - datetime(1970, 1, 1, tzinfo=UTC)) // timedelta(seconds=1)', returns: '1790683200' },
  ],

  pitfalls: [
    {
      name: 'timestamp() of a naive UTC value',
      desc: 'utcnow()-style naive values are read as LOCAL time, so the result is off by the machine\'s UTC offset (right only where local time is UTC). Label the value first — then the answer is the same on every machine.',
      wrong: { label: 'naive (machine-dependent)', code: 'from datetime import datetime\nnaive = datetime(2026, 9, 29, 12)\nnaive.tzinfo is None', output: 'True' },
      fix:   { label: 'replace(tzinfo=UTC)', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12).replace(tzinfo=UTC).timestamp()', output: '1790683200.0' },
    },
    {
      name: 'Calling timestamp() on a date',
      desc: 'Only datetime has it. A date has no time of day or zone — pick midnight in a zone explicitly.',
      wrong: { label: 'date.timestamp()', code: 'from datetime import date\ndate(2026, 9, 29).timestamp()', output: "AttributeError: 'datetime.date' object has no attribute 'timestamp'. Did you mean: 'fromtimestamp'?" },
      fix:   { label: 'combine with midnight UTC', code: 'from datetime import date, datetime, time, UTC\ndatetime.combine(date(2026, 9, 29), time(), UTC).timestamp()', output: '1790640000.0' },
    },
  ],

  when: {
    use: ['Storing or sending instants as numbers', 'Interop with time.time(), JavaScript Date, databases with epoch columns'],
    avoid: ['Human-readable storage → isoformat()', 'Exact integer arithmetic on long spans → subtract datetimes and use timedelta'],
  },

  notes: {
    cpython:    'Aware: (self - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds(). Naive: the local-time conversion of the platform C library (mktime-like), respecting fold',
    'Precision': 'A float carries microseconds exactly only up to about 2**33 seconds from the epoch (year 2242)',
    'Reverse':   'datetime.fromtimestamp(ts, tz) turns the number back into an aware datetime',
  },

  related: [
    { name: 'fromtimestamp', slug: 'fromtimestamp', when: 'The reverse conversion' },
    { name: 'total_seconds', slug: 'timedelta-total-seconds', when: 'What timestamp() computes' },
    { name: 'UTC', slug: 'utc', when: 'Make a naive value aware' },
    { name: 'timetuple', slug: 'timetuple', when: 'struct_time for the time module' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a datetime to a Unix timestamp in Python?',
      a: 'dt.timestamp() on an aware datetime, e.g. datetime(2026, 9, 29, 12, tzinfo=UTC).timestamp() == 1790683200.0. Wrap in int() for whole seconds, or multiply by 1000 for milliseconds.',
    },
    {
      q: 'Why does timestamp() give a different result on another server?',
      a: 'The datetime is naive, so Python interprets it in each machine\'s local zone. Make it aware (replace(tzinfo=UTC) if the fields are UTC) and the answer is the same everywhere.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.timestamp',
    meta:  'datetime.timestamp',
  },
};
