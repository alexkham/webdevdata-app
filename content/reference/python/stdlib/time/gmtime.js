// content/reference/python/stdlib/time/gmtime.js

export const meta = {
  slug:        'gmtime',
  name:        'time.gmtime',
  signature:   'time.gmtime(seconds=None, /)',
  blurb:       'Convert seconds since the epoch to a struct_time in UTC - year, month, day, hour, minute, second, weekday, day of the year. Fractions of a second are dropped.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.gmtime gmtime python epoch to date unix timestamp to utc convert timestamp struct_time utc year 2038 calendar.timegm inverse milliseconds negative timestamp before 1970 OSError Errno 22 Invalid argument',
};

export const method = {
  slug:      'gmtime',
  name:      'time.gmtime',
  signature: 'time.gmtime(seconds=None, /)',
  returns:   { type: 'time.struct_time', desc: 'The UTC calendar fields of that instant; tm_isdst is always 0.' },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Seconds since 1970 in, UTC calendar fields out - the same answer on every machine, whatever its time zone. calendar.timegm() is the inverse.',

  covers: ['gmtime'],

  cheat: {
    commonCall: 'time.gmtime(1790000000)',
    returns:    'time.struct_time(tm_year=2026, tm_mon=9, tm_mday=21, ...)',
    replaces:   'datetime.fromtimestamp(ts, timezone.utc) when you only need fields',
    watchOut:   'the fraction is floored, and milliseconds must be divided by 1000 first',
  },

  parameters: [
    { name: 'seconds', type: 'int | float | None', required: false, default: 'None', desc: 'Seconds since the epoch. Floats are rounded down to whole seconds; None (or no argument) means the current time.' },
  ],

  modes: [
    {
      id: 'struct',
      label: 'seconds → struct_time',
      blurb: 'Type a Unix timestamp; gmtime splits it into UTC fields.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: 'import time\ntime.gmtime({$seconds})',
      cases: [
        { id: 'epoch',  label: '0',             values: { seconds: '0' } },
        { id: 'recent', label: '1790000000',    values: { seconds: '1790000000' } },
        { id: 'floor',  label: '59.999',        values: { seconds: '59.999' } },
        { id: 'y2038',  label: '2**31',         values: { seconds: '2147483648' } },
        { id: 'text',   label: 'with a unit',   values: { seconds: '1790000000s' } },
      ],
    },
    {
      id: 'ms',
      label: 'milliseconds',
      blurb: 'JavaScript, Java and many APIs count milliseconds. Divide by 1000 before calling gmtime.',
      params: [{ name: 'ms', type: 'int', hint: 'milliseconds since the epoch', input: 'auto' }],
      template: "import time\nms = {$ms}  # e.g. JavaScript Date.now()\ntime.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ms / 1000))",
      cases: [
        { id: 'recent', label: '1790000000123', values: { ms: '1790000000123' } },
        { id: 'zero',   label: '0',             values: { ms: '0' } },
        { id: 'second', label: '999',           values: { ms: '999' } },
      ],
    },
    {
      id: 'inverse',
      label: 'round trip',
      blurb: 'calendar.timegm turns UTC fields back into seconds - the exact inverse of gmtime, apart from the dropped fraction.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: 'import calendar, time\ncalendar.timegm(time.gmtime({$seconds}))',
      cases: [
        { id: 'recent',   label: '1790000000',   values: { seconds: '1790000000' } },
        { id: 'fraction', label: '1790000000.9', values: { seconds: '1790000000.9' } },
        { id: 'epoch',    label: '0',            values: { seconds: '0' } },
      ],
    },
  ],
  demoExplainer: '59.999 becomes tm_sec=59: gmtime rounds down, it never rounds to nearest. Input such as 1790000000s is not a number but a str, and gmtime refuses str with TypeError. In the round trip the .9 is lost because gmtime floors it. The demo follows Linux for extreme values; Windows only accepts -43200 to 32536850399 (1969-12-31 12:00 to 3001-01-19 21:59:59 UTC) and raises OSError: [Errno 22] Invalid argument outside that range.',

  patterns: [
    {
      name: 'Timestamp → ISO 8601 UTC text',
      desc: 'A Z suffix marks the text as UTC.',
      code: "import time\niso = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(ts))",
    },
    {
      name: 'Date parts of a timestamp',
      desc: 'Attribute access reads better than indexes.',
      code: 'import time\nst = time.gmtime(ts)\nyear, month, day = st.tm_year, st.tm_mon, st.tm_mday',
    },
    {
      name: 'UTC fields → seconds',
      desc: 'calendar.timegm is the inverse of gmtime (mktime is the inverse of localtime).',
      code: 'import calendar\nts = calendar.timegm((2026, 9, 29, 14, 30, 0, 0, 0, 0))',
    },
    {
      name: 'Same thing with datetime',
      desc: 'When you need arithmetic or isoformat() afterwards.',
      code: 'from datetime import datetime, timezone\ndt = datetime.fromtimestamp(ts, tz=timezone.utc)',
    },
  ],

  examples: [
    { title: 'The first six fields',         code: 'import time\ntime.gmtime(1790000000)[:6]', returns: '(2026, 9, 21, 14, 13, 20)' },
    { title: 'By name',                      code: 'import time\nst = time.gmtime(1790000000)\n(st.tm_year, st.tm_mon, st.tm_mday, st.tm_hour, st.tm_min)', returns: '(2026, 9, 21, 14, 13)' },
    { title: 'The fraction is floored',      code: 'import time\ntime.gmtime(1.999).tm_sec', returns: '1' },
    { title: 'Milliseconds: divide first',   code: 'import time\ntime.gmtime(1790000000123 / 1000)[:6]', returns: '(2026, 9, 21, 14, 13, 20)' },
    { title: 'Inverse: calendar.timegm',     code: 'import calendar, time\ncalendar.timegm(time.gmtime(1790000000.75))', returns: '1790000000' },
    { title: 'NaN is rejected',              code: "import time\ntime.gmtime(float('nan'))", returns: 'ValueError: Invalid value NaN (not a number)' },
    { title: 'Beyond a 64-bit time_t',       code: 'import time\ntime.gmtime(2**63)', returns: 'OverflowError: timestamp out of range for platform time_t' },
  ],

  pitfalls: [
    {
      name: 'Expecting gmtime to round',
      desc: 'Floats are floored, so 59.9 seconds is still second 59. Round first if you want the nearest second.',
      wrong: { label: 'floored',  code: 'import time\ntime.gmtime(59.9).tm_sec', output: '59' },
      fix:   { label: 'round()',  code: 'import time\ntime.gmtime(round(59.9))[4:6]', output: '(1, 0)' },
    },
    {
      name: 'Passing a datetime',
      desc: 'gmtime takes a number. Get the timestamp from an aware datetime first (or call dt.utctimetuple()).',
      wrong: { label: 'datetime',     code: 'import time\nfrom datetime import datetime, timezone\ntime.gmtime(datetime(2026, 9, 29, tzinfo=timezone.utc))', output: "TypeError: 'datetime.datetime' object cannot be interpreted as an integer" },
      fix:   { label: '.timestamp()', code: 'import time\nfrom datetime import datetime, timezone\ntime.gmtime(datetime(2026, 9, 29, tzinfo=timezone.utc).timestamp())[:3]', output: '(2026, 9, 29)' },
    },
  ],

  when: {
    use: [
      'Turning stored Unix timestamps into UTC dates for logs, file names and reports',
      'Reading JWT exp / iat claims and other API timestamps',
      'Anything that must give the same result on every server, whatever its time zone',
    ],
    avoid: [
      "The machine's local time → localtime()",
      'Date arithmetic or ISO 8601 parsing → datetime.fromtimestamp(ts, timezone.utc)',
      'Timestamps before 1970 in code that must also run on Windows → datetime(1970, 1, 1, tzinfo=timezone.utc) + timedelta(seconds=ts)',
    ],
  },

  notes: {
    cpython:      'time_gmtime in Modules/timemodule.c: the argument goes through _PyTime_ObjectToTime_t (floor), then gmtime_r() on Unix or gmtime_s() on Windows',
    'tm_zone':    "The struct_time also carries tm_zone and tm_gmtoff = 0. tm_zone is 'UTC' on Windows but 'GMT' on Linux (glibc)",
    'Range':      'Linux: any year that fits a C int (beyond that OSError: [Errno 75] Value too large for defined data type). Windows: -43200 to 32536850399 only; Python 3.13.3 on Windows also reports tm_wday=3 for the negative seconds it accepts',
    'Errors':     'TypeError for non-numbers (str, datetime, Decimal); ValueError for NaN; OverflowError outside the 64-bit time_t range',
  },

  related: [
    { name: 'struct_time',     slug: 'struct-time',      when: 'What gmtime returns' },
    { name: 'localtime / mktime', slug: 'localtime-mktime', when: 'The local-time version and its inverse' },
    { name: 'time.strftime',   slug: 'strftime',         when: 'struct_time → text' },
    { name: 'asctime / ctime', slug: 'asctime-ctime',    when: 'The fixed "Mon Sep 21 14:13:20 2026" layout' },
    { name: 'time module',     slug: 'time',             when: 'Overview', category: 'stdlib' },
    { name: 'datetime.fromtimestamp', slug: 'fromtimestamp', when: 'The datetime equivalent', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'How do I convert a Unix timestamp to a date in Python?',
      a: "time.gmtime(ts) gives the UTC fields; format them with time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts)). For local time use time.localtime(ts). With datetime: datetime.fromtimestamp(ts, tz=timezone.utc).",
    },
    {
      q: 'What is the inverse of time.gmtime()?',
      a: 'calendar.timegm(struct_time) - it reads the fields as UTC and returns an int. time.mktime() is the inverse of localtime(), not of gmtime(), because it interprets the fields as local time.',
    },
    {
      q: 'Why does time.gmtime() fail for negative timestamps on Windows?',
      a: 'Python calls the C runtime gmtime_s(), which on Windows only accepts values from -43200 (1969-12-31 12:00 UTC) up to 3001-01-19, and raises OSError: [Errno 22] Invalid argument otherwise. Linux handles dates far before 1970. For portable code use datetime with a timedelta from the epoch.',
    },
    {
      q: 'My timestamp has 13 digits - why is the year wrong?',
      a: 'A 13-digit value is in milliseconds. Divide by 1000 first: time.gmtime(ms / 1000). Passed as seconds it lands tens of thousands of years in the future (and Windows rejects it).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.gmtime',
    meta:  'time.gmtime',
  },
};
