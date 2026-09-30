// content/reference/python/stdlib/datetime/fromtimestamp.js
// date.fromtimestamp, datetime.fromtimestamp, datetime.utcfromtimestamp (deprecated)

export const meta = {
  slug:        'fromtimestamp',
  name:        'datetime.fromtimestamp / utcfromtimestamp',
  signature:   'datetime.fromtimestamp(timestamp, tz=None)',
  blurb:       'Convert a POSIX timestamp (seconds since 1970-01-01 UTC) into a datetime or date. Pass tz for an aware result; utcfromtimestamp is deprecated.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (utcfromtimestamp deprecated 3.12)',
  searchTerms: 'fromtimestamp utcfromtimestamp date.fromtimestamp datetime.fromtimestamp datetime.utcfromtimestamp unix timestamp to datetime epoch seconds milliseconds convert timestamp python deprecated timestamp out of range for platform time_t',
};

export const method = {
  slug:      'fromtimestamp',
  name:      'datetime.fromtimestamp / utcfromtimestamp',
  signature: 'datetime.fromtimestamp(timestamp, tz=None)',
  returns:   { type: 'datetime', desc: 'Aware in tz when tz is given; otherwise naive local time. date.fromtimestamp returns the local date.' },

  category:    'datetime class method',
  version:     'Python 2.3+ (utcfromtimestamp deprecated 3.12)',
  hasLiveDemo: true,

  subtitle: 'Epoch seconds in, datetime out. With tz=UTC the answer is the same on every machine; without tz it is the machine\'s local time, and date.fromtimestamp is always local.',

  covers: ['date.fromtimestamp', 'datetime.fromtimestamp', 'datetime.utcfromtimestamp'],

  cheat: {
    commonCall: 'datetime.fromtimestamp(ts, UTC)',
    returns:    'datetime.datetime(…, tzinfo=datetime.timezone.utc)',
    replaces:   'datetime.utcfromtimestamp(ts) (naive, deprecated) and time.gmtime(ts)',
    watchOut:   'Milliseconds (JavaScript Date.now()) must be divided by 1000',
  },

  parameters: [
    { name: 'timestamp', type: 'int | float', required: true,  default: null,   desc: 'Seconds since 1970-01-01T00:00:00Z. Fractions become microseconds, rounded half to even.' },
    { name: 'tz',        type: 'tzinfo | None', required: false, default: 'None', desc: 'None: naive local time (depends on the machine). A tzinfo: aware result in that zone. date.fromtimestamp has no tz.' },
  ],

  modes: [
    {
      id: 'convert',
      label: 'to datetime',
      blurb: 'A timestamp shown at a fixed offset. The instant is the same; only the wall-clock reading changes.',
      params: [
        { name: 'ts',    type: 'int', hint: 'seconds since the epoch', input: 'number' },
        { name: 'hours', type: 'int', hint: 'offset in hours',         input: 'number' },
      ],
      template: 'from datetime import datetime, timedelta, timezone\ndatetime.fromtimestamp({$ts}, timezone(timedelta(hours={$hours}))).isoformat()',
      cases: [
        { id: 'epoch',  label: 'the epoch',   values: { ts: '0', hours: '0' } },
        { id: 'now',    label: '2026',        values: { ts: '1790683200', hours: '2' } },
        { id: 'millis', label: 'milliseconds by mistake', values: { ts: '86400000', hours: '0' } },
      ],
    },
  ],
  demoExplainer: '1790683200 is 2026-09-29 12:00 UTC, shown here at +02:00 as 14:00. 86400000 is one day in milliseconds, but read as seconds it is 1000 days: 1972-09-27. Millisecond timestamps of today overflow completely — Linux raises ValueError for the year beyond 9999 (as this demo does), Windows OSError: [Errno 22] Invalid argument.',

  patterns: [
    {
      name: 'Unix timestamp to aware UTC',
      desc: 'Works identically everywhere.',
      code: 'from datetime import datetime, UTC\ndt = datetime.fromtimestamp(ts, UTC)',
    },
    {
      name: 'Milliseconds from JavaScript or Java',
      desc: 'Divide by 1000 first (a float keeps the milliseconds).',
      code: 'from datetime import datetime, UTC\ndt = datetime.fromtimestamp(ms / 1000, UTC)',
    },
    {
      name: 'File modification time',
      desc: 'os.stat gives epoch seconds.',
      code: 'import os\nfrom datetime import datetime, UTC\nmodified = datetime.fromtimestamp(os.stat(path).st_mtime, UTC)',
    },
  ],

  examples: [
    { title: 'The epoch',                    code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(0, UTC)', returns: 'datetime.datetime(1970, 1, 1, 0, 0, tzinfo=datetime.timezone.utc)' },
    { title: 'At a fixed offset',            code: 'from datetime import datetime, timedelta, timezone\ndatetime.fromtimestamp(1790690400, timezone(timedelta(hours=2)))', returns: 'datetime.datetime(2026, 9, 29, 16, 0, tzinfo=datetime.timezone(datetime.timedelta(seconds=7200)))' },
    { title: 'Fractions become microseconds', code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(1790690400.5, UTC)', returns: 'datetime.datetime(2026, 9, 29, 14, 0, 0, 500000, tzinfo=datetime.timezone.utc)' },
    { title: 'Round trip with timestamp()',  code: 'from datetime import datetime, UTC\ndt = datetime(2026, 9, 29, 12, tzinfo=UTC)\ndatetime.fromtimestamp(dt.timestamp(), UTC) == dt', returns: 'True' },
    { title: 'Strings are not accepted',     code: "from datetime import datetime, UTC\ndatetime.fromtimestamp('0', UTC)", returns: "TypeError: 'str' object cannot be interpreted as an integer" },
    { title: 'Beyond time_t',                code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(1e20, UTC)', returns: 'OverflowError: timestamp out of range for platform time_t' },
    { title: 'utcfromtimestamp warns (3.12+)', code: 'import warnings\nfrom datetime import datetime\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter("always")\n    naive = datetime.utcfromtimestamp(0)\n(naive, caught[0].category.__name__)', returns: "(datetime.datetime(1970, 1, 1, 0, 0), 'DeprecationWarning')" },
  ],

  pitfalls: [
    {
      name: 'utcfromtimestamp returns naive UTC',
      desc: 'The fields are UTC but tzinfo is None, so timestamp() on the result would treat them as local time. Deprecated since 3.12.',
      wrong: { label: 'utcfromtimestamp', code: 'import warnings\nfrom datetime import datetime\nwith warnings.catch_warnings():\n    warnings.simplefilter("ignore")\n    dt = datetime.utcfromtimestamp(1790683200)\ndt.tzinfo is None', output: 'True' },
      fix:   { label: 'fromtimestamp(ts, UTC)', code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(1790683200, UTC)', output: 'datetime.datetime(2026, 9, 29, 12, 0, tzinfo=datetime.timezone.utc)' },
    },
    {
      name: 'Milliseconds instead of seconds',
      desc: 'JavaScript, Java and many APIs use milliseconds. Read as seconds the value is 1000 times too far from 1970: one day becomes 1000 days, and current timestamps overflow past year 9999.',
      wrong: { label: 'ms as seconds', code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(86400000, UTC)', output: 'datetime.datetime(1972, 9, 27, 0, 0, tzinfo=datetime.timezone.utc)' },
      fix:   { label: '/ 1000', code: 'from datetime import datetime, UTC\ndatetime.fromtimestamp(86400000 / 1000, UTC)', output: 'datetime.datetime(1970, 1, 2, 0, 0, tzinfo=datetime.timezone.utc)' },
    },
  ],

  when: {
    use: ['Epoch values from databases, logs, os.stat, APIs', 'Always with tz (usually UTC) unless you really want machine-local time'],
    avoid: ['utcfromtimestamp → fromtimestamp(ts, UTC)', 'ISO 8601 text → fromisoformat'],
  },

  notes: {
    cpython:        'The timestamp is split into seconds and microseconds (round half to even), converted with gmtime() when tz is given, then tz.fromutc(); without tz, localtime() is used',
    'Platforms':    'The valid range is the C library\'s: on Windows timestamps before 1969-12-31T12:00Z or after 3001-01-19T21:59:59Z raise OSError: [Errno 22] Invalid argument; Linux accepts the whole 1..9999 range',
    'Deprecation':  'utcfromtimestamp() emits DeprecationWarning since 3.12: "datetime.datetime.utcfromtimestamp() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.fromtimestamp(timestamp, datetime.UTC)."',
  },

  related: [
    { name: 'timestamp', slug: 'timestamp', when: 'The reverse: datetime → epoch seconds' },
    { name: 'UTC', slug: 'utc', when: 'The tz to pass' },
    { name: 'today / now', slug: 'today-now', when: 'The current moment' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a Unix timestamp to a datetime in Python?',
      a: 'datetime.fromtimestamp(ts, UTC) for an aware UTC datetime (use timezone.utc before Python 3.11). Without the tz argument you get naive local time of the machine running the code.',
    },
    {
      q: 'Why is utcfromtimestamp deprecated?',
      a: 'It returns a naive datetime holding UTC fields; the rest of the datetime API treats naive values as local time, which silently shifted results. Since Python 3.12 it emits a DeprecationWarning. Use fromtimestamp(ts, UTC).',
    },
    {
      q: 'How do I convert a timestamp in milliseconds?',
      a: 'Divide by 1000: datetime.fromtimestamp(ms / 1000, UTC). The float division keeps the milliseconds as microseconds.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.fromtimestamp',
    meta:  'datetime.fromtimestamp',
  },
};
