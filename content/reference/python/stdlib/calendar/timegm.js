// content/reference/python/stdlib/calendar/timegm.js

export const meta = {
  slug:        'timegm',
  name:        'calendar.timegm',
  signature:   'calendar.timegm(tuple)',
  blurb:       'Turn a UTC time tuple (year, month, day, hour, minute, second, …) into a Unix timestamp — the inverse of time.gmtime().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'calendar timegm python utc to timestamp struct_time to epoch seconds inverse of gmtime unix timestamp from utc tuple mktime utc',
};

export const method = {
  slug:      'timegm',
  name:      'calendar.timegm',
  signature: 'calendar.timegm(tuple)',
  returns:   { type: 'int', desc: 'Seconds since 1970-01-01 00:00:00 UTC (negative before it); a float if day, hour, minute or second is a float (a float year or month raises TypeError).' },

  category:    'calendar function',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Pure arithmetic on the first six fields, read as UTC — no time zone, no clock, the same result on every machine. It is what time.mktime would be if mktime did not assume local time.',

  covers: ['timegm'],

  cheat: {
    commonCall: 'calendar.timegm(time.gmtime(ts))',
    returns:    'ts again — 1704067200 for (2024, 1, 1, 0, 0, 0)',
    replaces:   'time.mktime() on a UTC tuple (which is off by your UTC offset)',
    watchOut:   'only year and month are validated; day 32 or hour 25 roll over',
  },

  parameters: [
    { name: 'tuple', type: 'tuple | time.struct_time', required: true, default: null, desc: 'At least six items: year (1–9999), month (1–12), day, hour, minute, second. Items after the sixth (weekday, yearday, isdst) are ignored.' },
  ],

  modes: [
    {
      id: 'tuple',
      label: 'tuple → seconds',
      blurb: 'Six numbers, read as a UTC date and time.',
      params: [
        { name: 'year',   type: 'int', hint: '1–9999', input: 'number' },
        { name: 'month',  type: 'int', hint: '1–12',   input: 'number' },
        { name: 'day',    type: 'int', hint: 'day',    input: 'number' },
        { name: 'hour',   type: 'int', hint: 'hour',   input: 'number' },
        { name: 'minute', type: 'int', hint: 'minute', input: 'number' },
        { name: 'second', type: 'int', hint: 'second', input: 'number' },
      ],
      template: 'import calendar\ncalendar.timegm(({$year}, {$month}, {$day}, {$hour}, {$minute}, {$second}))',
      cases: [
        { id: 'epoch', label: 'the epoch',    values: { year: '1970', month: '1', day: '1', hour: '0', minute: '0', second: '0' } },
        { id: 'leap',  label: '29 Feb 2024',  values: { year: '2024', month: '2', day: '29', hour: '12', minute: '30', second: '0' } },
        { id: 'y2038', label: '2038 limit',   values: { year: '2038', month: '1', day: '19', hour: '3', minute: '14', second: '8' } },
        { id: 'month0', label: 'month 0',     values: { year: '2024', month: '0', day: '1', hour: '0', minute: '0', second: '0' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'and back',
      blurb: 'Add the seconds to the epoch with timedelta — the fields come back normalised.',
      params: [
        { name: 'year',   type: 'int', hint: '1–9999', input: 'number' },
        { name: 'month',  type: 'int', hint: '1–12',   input: 'number' },
        { name: 'day',    type: 'int', hint: 'day',    input: 'number' },
        { name: 'hour',   type: 'int', hint: 'hour',   input: 'number' },
        { name: 'minute', type: 'int', hint: 'minute', input: 'number' },
        { name: 'second', type: 'int', hint: 'second', input: 'number' },
      ],
      template: 'import calendar, datetime\nts = calendar.timegm(({$year}, {$month}, {$day}, {$hour}, {$minute}, {$second}))\n(ts, datetime.datetime(1970, 1, 1) + datetime.timedelta(seconds=ts))',
      cases: [
        { id: 'plain',  label: '2024-01-01',   values: { year: '2024', month: '1', day: '1', hour: '0', minute: '0', second: '0' } },
        { id: 'roll',   label: '31 Feb',       values: { year: '2026', month: '2', day: '31', hour: '25', minute: '0', second: '0' } },
        { id: 'before', label: 'before 1970',  values: { year: '1969', month: '12', day: '31', hour: '23', minute: '59', second: '59' } },
        { id: 'neg',    label: 'negative minutes', values: { year: '2026', month: '1', day: '1', hour: '0', minute: '-30', second: '0' } },
      ],
    },
  ],
  demoExplainer: '2038-01-19 03:14:08 UTC is 2147483648, one more than the largest signed 32-bit number — timegm returns a Python int, so there is no overflow. Month 0 is rejected because timegm builds datetime.date(year, month, 1); day, hour, minute and second are never checked: in "31 February 2026, 25:00", day 31 of February is 3 March and hour 25 is 01:00 of the next day, so the round trip comes back as datetime.datetime(2026, 3, 4, 1, 0).',

  patterns: [
    {
      name: 'struct_time in UTC → timestamp',
      desc: 'The inverse of time.gmtime().',
      code: 'import calendar, time\nts = calendar.timegm(time.gmtime(1704067200))',
    },
    {
      name: 'Parse a UTC string to a timestamp',
      desc: 'strptime gives a struct_time; timegm treats it as UTC.',
      code: "import calendar, time\nts = calendar.timegm(time.strptime('2026-10-25 12:00:00', '%Y-%m-%d %H:%M:%S'))",
    },
    {
      name: 'From a naive datetime that holds UTC',
      desc: 'utctimetuple() of a naive datetime keeps its fields unchanged.',
      code: 'import calendar, datetime\nts = calendar.timegm(datetime.datetime(2026, 10, 25, 12, 0).utctimetuple())',
    },
  ],

  examples: [
    { title: 'The epoch is 0',              code: 'import calendar\ncalendar.timegm((1970, 1, 1, 0, 0, 0))', returns: '0' },
    { title: 'A UTC date and time',         code: 'import calendar\ncalendar.timegm((2024, 2, 29, 12, 30, 0))', returns: '1709209800' },
    { title: 'Before 1970 is negative',     code: 'import calendar\ncalendar.timegm((1969, 12, 31, 23, 59, 59))', returns: '-1' },
    { title: 'Inverse of time.gmtime',      code: 'import calendar, time\ncalendar.timegm(time.gmtime(1704067200))', returns: '1704067200' },
    { title: 'Fields roll over',            code: 'import calendar\ncalendar.timegm((2024, 1, 32, 0, 0, 0)) == calendar.timegm((2024, 2, 1, 0, 0, 0))', returns: 'True' },
    { title: 'Only six items are read',     code: 'import calendar\ncalendar.timegm((2024, 1, 1, 0, 0, 0, 99, 99, 99))', returns: '1704067200' },
    { title: 'Fewer than six',              code: 'import calendar\ncalendar.timegm((2024, 1, 1))', returns: 'ValueError: not enough values to unpack (expected 6, got 3)' },
  ],

  pitfalls: [
    {
      name: 'Feeding it timetuple() of a non-UTC datetime',
      desc: 'timetuple() keeps the wall-clock fields of an aware datetime, and timegm reads them as UTC — the result is off by the UTC offset (here +02:00, so 2 hours). utctimetuple() converts to UTC first.',
      wrong: { label: 'timetuple()', code: 'import calendar, datetime\ndt = datetime.datetime(2026, 10, 25, 12, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=2)))\n(calendar.timegm(dt.timetuple()) - dt.timestamp()) / 3600', output: '2.0' },
      fix:   { label: 'utctimetuple()', code: 'import calendar, datetime\ndt = datetime.datetime(2026, 10, 25, 12, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=2)))\n(calendar.timegm(dt.utctimetuple()) - dt.timestamp()) / 3600', output: '0.0' },
    },
    {
      name: 'Expecting invalid days to be rejected',
      desc: 'timegm does not validate day, hour, minute or second; 31 February silently becomes 3 March. Build a datetime first if the input must be a real date.',
      wrong: { label: 'timegm accepts it', code: 'import calendar\ncalendar.timegm((2026, 2, 31, 0, 0, 0)) == calendar.timegm((2026, 3, 3, 0, 0, 0))', output: 'True' },
      fix:   { label: 'validate with datetime', code: 'import calendar, datetime\ncalendar.timegm(datetime.datetime(2026, 2, 31).timetuple())', output: 'ValueError: day is out of range for month' },
    },
  ],

  when: {
    use: [
      'UTC struct_time (from gmtime or strptime) → Unix seconds',
      'Deterministic timestamps in tests — no dependence on the local time zone',
    ],
    avoid: [
      'Local time → time.mktime',
      'Aware datetime objects → dt.timestamp()',
      'Validating user input → construct datetime.datetime first',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: year, month, day, hour, minute, second = tuple[:6]; days = date(year, month, 1).toordinal() - EPOCH_ORD + day - 1; then hours, minutes, seconds by multiplication',
    'Range':      'year 1–9999 and month 1–12 (checked by datetime.date); everything else is plain arithmetic',
    'Floats':     'A float second (e.g. 30.5) makes the result a float',
    'Leap seconds': 'Ignored, like POSIX time: every day has 86400 seconds',
  },

  related: [
    { name: 'time.gmtime',   slug: 'gmtime',   when: 'The inverse: seconds → UTC struct_time', category: 'stdlib/time' },
    { name: 'time.mktime',   slug: 'localtime-mktime', when: 'The local-time version', category: 'stdlib/time' },
    { name: 'datetime.timestamp', slug: 'timestamp', when: 'Seconds from a datetime object', category: 'stdlib/datetime' },
    { name: 'time module',   slug: 'time',     when: 'struct_time and clocks', category: 'stdlib' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a UTC struct_time to a Unix timestamp in Python?',
      a: 'calendar.timegm(t). It reads the first six fields as UTC, so calendar.timegm(time.gmtime(x)) == x for a whole number of seconds x — as far as gmtime itself accepts x (on Windows, gmtime raises OSError for timestamps before -43200, 12:00 on 31 December 1969).',
    },
    {
      q: 'What is the difference between calendar.timegm and time.mktime?',
      a: 'timegm treats the tuple as UTC and is pure arithmetic; mktime treats it as local time using the machine\'s time zone and daylight-saving rules. On a machine set to UTC they agree; elsewhere they differ by the UTC offset.',
    },
    {
      q: 'Why is calendar.timegm in the calendar module and not in time?',
      a: 'It needs only calendar arithmetic — days per month and leap years — which is what the calendar module has; time.mktime, by contrast, calls the C library. The documentation itself calls it "an unrelated but handy function".',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.timegm',
    meta:  'calendar.timegm',
  },

};
