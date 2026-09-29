// content/reference/python/stdlib/datetime/timedelta-total-seconds.js
// timedelta.days / .seconds / .microseconds and timedelta.total_seconds()

export const meta = {
  slug:        'timedelta-total-seconds',
  name:        'timedelta.total_seconds / days / seconds / microseconds',
  signature:   'td.total_seconds()',
  blurb:       'Read a duration back out: the three stored fields days, seconds and microseconds, or the whole length as a float number of seconds.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (total_seconds 3.2+)',
  searchTerms: 'timedelta.total_seconds timedelta.days timedelta.seconds timedelta.microseconds total_seconds days seconds microseconds timedelta to seconds minutes hours python duration in seconds .seconds wrong',
};

export const method = {
  slug:      'timedelta-total-seconds',
  name:      'timedelta.total_seconds / days / seconds / microseconds',
  signature: 'td.total_seconds()',
  returns:   { type: 'float', desc: 'The whole duration in seconds (negative for negative durations). The attributes are ints.' },

  category:    'timedelta method',
  version:     'Python 2.3+ (total_seconds 3.2+)',
  hasLiveDemo: true,

  subtitle: 'days, seconds and microseconds are the three normalized pieces — seconds is always 0–86399 and never includes the days. total_seconds() is the one number you usually want.',

  covers: ['timedelta.days', 'timedelta.seconds', 'timedelta.microseconds', 'timedelta.total_seconds'],

  cheat: {
    commonCall: 'elapsed.total_seconds()',
    returns:    'float — e.g. 90000.0 for 25 hours',
    replaces:   'd.days * 86400 + d.seconds + d.microseconds / 1e6',
    watchOut:   '.seconds ignores the days part',
  },

  parameters: [],

  attributes: [
    { name: 'days',         type: 'int', meaning: 'Whole days, -999999999..999999999. Carries the sign of the duration.' },
    { name: 'seconds',      type: 'int', meaning: 'Seconds within the day, always 0..86399 — NOT the total.' },
    { name: 'microseconds', type: 'int', meaning: 'Microseconds within the second, always 0..999999.' },
    { name: 'total_seconds()', type: 'float', meaning: 'days * 86400 + seconds + microseconds / 10**6, computed exactly then rounded once to a float.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'fields vs total',
      blurb: 'Build a duration from hours and minutes, then read it back both ways.',
      params: [
        { name: 'hours',   type: 'int', hint: 'hours',   input: 'number' },
        { name: 'minutes', type: 'int', hint: 'minutes', input: 'number' },
      ],
      template: 'from datetime import timedelta\nd = timedelta(hours={$hours}, minutes={$minutes})\n(d.days, d.seconds, d.microseconds, d.total_seconds())',
      cases: [
        { id: 'short', label: '90 minutes',   values: { hours: '0', minutes: '90' } },
        { id: 'long',  label: '26 hours',     values: { hours: '26', minutes: '0' } },
        { id: 'neg',   label: 'negative',     values: { hours: '-1', minutes: '-30' } },
      ],
    },
    {
      id: 'elapsed',
      label: 'elapsed',
      blurb: 'The difference between two timestamps in seconds, minutes and hours.',
      params: [
        { name: 'start', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'end',   type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
      ],
      template: 'from datetime import datetime\nd = datetime.fromisoformat({$end}) - datetime.fromisoformat({$start})\ns = d.total_seconds()\n(s, s / 60, s / 3600, d.seconds)',
      cases: [
        { id: 'shift',   label: 'a work day',     values: { start: '2026-09-29T09:15', end: '2026-09-29T18:00' } },
        { id: 'overday', label: 'over a day',     values: { start: '2026-09-29T09:00', end: '2026-09-30T10:00' } },
        { id: 'zones',   label: 'two offsets',    values: { start: '2026-09-29T09:00+02:00', end: '2026-09-29T09:00-04:00' } },
      ],
    },
  ],
  demoExplainer: 'Watch the last value in "over a day": 25 hours apart, yet d.seconds is 3600 because the 24 hours went into d.days. With two different offsets the subtraction happens in UTC, so 09:00+02:00 and 09:00-04:00 are 6 hours apart.',

  patterns: [
    {
      name: 'Elapsed seconds between timestamps',
      desc: 'Subtract, then total_seconds().',
      code: 'from datetime import datetime, UTC\nstarted = datetime.now(UTC)\n...\nelapsed = (datetime.now(UTC) - started).total_seconds()',
    },
    {
      name: 'Whole hours and minutes',
      desc: 'divmod the integer seconds.',
      code: 'hours, rest = divmod(int(d.total_seconds()), 3600)\nminutes = rest // 60',
    },
    {
      name: 'Duration in a unit, without floats',
      desc: 'timedelta // timedelta is an int.',
      code: 'from datetime import timedelta\nfull_hours = d // timedelta(hours=1)',
    },
  ],

  examples: [
    { title: 'The three fields',            code: 'from datetime import timedelta\nd = timedelta(days=2, hours=3, minutes=4, seconds=5, microseconds=6)\n(d.days, d.seconds, d.microseconds)', returns: '(2, 11045, 6)' },
    { title: 'total_seconds() adds them up', code: 'from datetime import timedelta\ntimedelta(days=2, hours=3, minutes=4, seconds=5, microseconds=6).total_seconds()', returns: '183845.000006' },
    { title: 'Negative: only days is negative', code: 'from datetime import timedelta\nd = timedelta(seconds=-1)\n(d.days, d.seconds, d.total_seconds())', returns: '(-1, 86399, -1.0)' },
    { title: 'Minutes as a float',          code: 'from datetime import timedelta\ntimedelta(seconds=3661).total_seconds() / 60', returns: '61.016666666666666' },
    { title: 'Whole hours with //',         code: 'from datetime import timedelta\ntimedelta(minutes=90) // timedelta(hours=1)', returns: '1' },
    { title: 'Read-only',                   code: 'from datetime import timedelta\nd = timedelta(days=1)\nd.days = 2', returns: 'AttributeError: readonly attribute' },
    { title: 'Huge durations lose microseconds', code: 'from datetime import timedelta\ntimedelta.max.total_seconds()', returns: '86400000000000.0' },
  ],

  pitfalls: [
    {
      name: '.seconds for elapsed time',
      desc: 'Works in testing with short intervals, then breaks the first time a run takes over a day.',
      wrong: { label: '.seconds', code: 'from datetime import datetime\n(datetime(2026, 9, 30, 10) - datetime(2026, 9, 29, 9)).seconds', output: '3600' },
      fix:   { label: '.total_seconds()', code: 'from datetime import datetime\n(datetime(2026, 9, 30, 10) - datetime(2026, 9, 29, 9)).total_seconds()', output: '90000.0' },
    },
    {
      name: 'Ignoring .days of a negative duration',
      desc: 'A duration of -1 second has seconds=86399. Always look at .days too, or use total_seconds().',
      wrong: { label: '.seconds', code: 'from datetime import timedelta\ntimedelta(seconds=-1).seconds', output: '86399' },
      fix:   { label: '.total_seconds()', code: 'from datetime import timedelta\ntimedelta(seconds=-1).total_seconds()', output: '-1.0' },
    },
  ],

  when: {
    use: [
      'Converting a duration to a number for storage, metrics or math',
      '.days when you need calendar days between two dates',
    ],
    avoid: [
      '.seconds for anything longer than a day',
      'Exact microsecond counts of very long durations → d // timedelta(microseconds=1) (an exact int)',
    ],
  },

  notes: {
    cpython:      'total_seconds is delta_to_microseconds(self) / 10**6 — an exact integer divided once, so it is correctly rounded',
    'Precision':  'A float has 53 bits: beyond about 270 years (2**33 seconds) it can no longer represent every microsecond, as timedelta.max shows',
    'Attributes': 'days, seconds, microseconds are read-only; build a new timedelta instead',
  },

  related: [
    { name: 'timedelta', slug: 'timedelta', when: 'Construction and arithmetic' },
    { name: 'timestamp', slug: 'timestamp', when: 'Seconds since the epoch of a datetime' },
    { name: 'datetime', slug: 'datetime', when: 'Subtracting datetimes' },
    { name: 'divmod()', slug: 'divmod', when: 'Split seconds into h/m/s', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is timedelta.seconds smaller than I expect?',
      a: 'Because it is only the seconds part below one day. timedelta(hours=26).seconds is 7200 — the other 24 hours are in .days. total_seconds() returns the full 93600.0.',
    },
    {
      q: 'How do I get a timedelta in minutes?',
      a: 'd.total_seconds() / 60 for a float, or d // timedelta(minutes=1) for whole minutes as an int.',
    },
    {
      q: 'Is there a timedelta.hours or .minutes attribute?',
      a: 'No. Only days, seconds and microseconds are stored. Derive hours and minutes from total_seconds() or with // timedelta(hours=1).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.timedelta.total_seconds',
    meta:  'timedelta.total_seconds',
  },
};
