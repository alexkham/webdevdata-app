// content/reference/python/stdlib/datetime/index.js — the datetime module hub

export const meta = {
  slug:        'index',
  name:        'datetime',
  signature:   'import datetime',
  blurb:       'Dates, times, durations and UTC offsets: date, time, datetime, timedelta, timezone — parse, format, add, subtract and compare them.',
  category:    'dates',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'datetime module python date time datetime timedelta timezone tzinfo utc now today strftime strptime isoformat fromisoformat naive aware add days difference between dates',
};

export const method = {
  slug: 'index',
  name: 'datetime',

  category:    'Dates & times',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Five value types do the work: date, time, datetime, timedelta and timezone. The traps are naive vs aware datetimes, the formatting directives, and timedelta.seconds not meaning what it says.',

  coverClasses: ['date', 'datetime', 'time', 'timedelta', 'timezone', 'tzinfo'],

  imports: ['import datetime', 'from datetime import date, time, datetime, timedelta, timezone, UTC'],
  facts: [
    { label: 'Public API', value: 'date, time, datetime, timedelta, timezone, tzinfo, MINYEAR, MAXYEAR, UTC' },
    { label: 'Calendar',   value: 'Proleptic Gregorian, years 1..9999, microsecond resolution, no leap seconds' },
    { label: 'Speed',      value: 'C accelerator _datetime (Modules/_datetimemodule.c); pure-Python fallback Lib/_pydatetime.py' },
    { label: 'Time zones', value: 'Fixed offsets built in (timezone); named zones with DST rules are in the zoneinfo module (3.9+)' },
  ],

  modes: [
    {
      id: 'shift',
      label: 'add time',
      blurb: 'Parse an ISO timestamp, add a timedelta, format the result back as ISO 8601.',
      params: [
        { name: 'start', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'days',  type: 'int', hint: 'days to add', input: 'number' },
        { name: 'hours', type: 'int', hint: 'hours to add', input: 'number' },
      ],
      template: 'from datetime import datetime, timedelta\nstart = datetime.fromisoformat({$start})\n(start + timedelta(days={$days}, hours={$hours})).isoformat()',
      cases: [
        { id: 'month',  label: '30 days 12 hours', values: { start: '2026-09-29T14:30', days: '30', hours: '12' } },
        { id: 'aware',  label: 'with an offset',   values: { start: '2026-03-28T12:00+01:00', days: '1', hours: '0' } },
        { id: 'back',   label: 'negative',         values: { start: '2026-01-01T00:00', days: '0', hours: '-1' } },
        { id: 'bad',    label: 'not ISO',          values: { start: '29/09/2026', days: '1', hours: '0' } },
      ],
    },
    {
      id: 'between',
      label: 'days between',
      blurb: 'Subtract two dates: the result is a timedelta.',
      params: [
        { name: 'start', type: 'str', hint: 'YYYY-MM-DD', input: 'text' },
        { name: 'end',   type: 'str', hint: 'YYYY-MM-DD', input: 'text' },
      ],
      template: 'from datetime import date\ndelta = date.fromisoformat({$end}) - date.fromisoformat({$start})\n(delta.days, str(delta))',
      cases: [
        { id: 'xmas', label: 'until Christmas', values: { start: '2026-09-29', end: '2026-12-25' } },
        { id: 'leap', label: 'a leap year',     values: { start: '2028-01-01', end: '2029-01-01' } },
        { id: 'neg',  label: 'end before start', values: { start: '2026-09-29', end: '2026-01-01' } },
      ],
    },
    {
      id: 'format',
      label: 'format',
      blurb: 'strftime turns a datetime into any text layout, one %-directive per field.',
      params: [
        { name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'fmt',  type: 'str', hint: 'a strftime format', input: 'text' },
      ],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$when}).strftime({$fmt})',
      cases: [
        { id: 'long',   label: 'long form',  values: { when: '2026-09-29T14:30', fmt: '%A %d %B %Y, %H:%M' } },
        { id: 'offset', label: 'with %z',    values: { when: '2026-09-29T14:30:05+02:00', fmt: '%Y-%m-%d %H:%M:%S %z' } },
        { id: 'short',  label: 'dd/mm/yy',   values: { when: '2026-09-29T14:30', fmt: '%d/%m/%y' } },
      ],
    },
  ],
  demoExplainer: 'All three tabs start from fromisoformat, the reliable way to get a datetime from text. Adding a timedelta keeps the UTC offset you started with (+01:00 stays +01:00 — a fixed offset never changes for daylight saving), a negative difference prints as "-271 days, 0:00:00" rather than "-271 days", and %z only has something to print when the datetime carries an offset.',

  patterns: [
    {
      name: 'The current time, correctly',
      desc: 'Ask for an aware datetime in UTC; convert to local time only for display.',
      code: 'from datetime import datetime, UTC\nnow = datetime.now(UTC)\nstamp = now.isoformat()  # 2026-09-29T12:00:00.123456+00:00',
    },
    {
      name: 'Parse, shift, format',
      desc: 'fromisoformat → arithmetic with timedelta → strftime or isoformat.',
      code: "from datetime import datetime, timedelta\ndue = datetime.fromisoformat('2026-09-29T09:00') + timedelta(days=14)\nprint(due.strftime('%d %b %Y'))",
    },
    {
      name: 'Age of something in days',
      desc: 'date - date is a timedelta; .days is the whole-day count.',
      code: 'from datetime import date\nage_days = (date.today() - created_on).days',
    },
    {
      name: 'Convert between offsets',
      desc: 'astimezone keeps the instant and changes the wall-clock reading.',
      code: 'from datetime import datetime, timedelta, timezone\nist = timezone(timedelta(hours=5, minutes=30))\nlocal = utc_dt.astimezone(ist)',
    },
  ],

  examples: [
    { title: 'A datetime and its parts',   code: 'from datetime import datetime\ndt = datetime(2026, 9, 29, 14, 30)\n(dt.year, dt.month, dt.day, dt.hour, dt.minute)', returns: '(2026, 9, 29, 14, 30)' },
    { title: 'repr vs str',                 code: 'from datetime import datetime\ndt = datetime(2026, 9, 29, 14, 30)\nprint(dt)\ndt', returns: '2026-09-29 14:30:00\ndatetime.datetime(2026, 9, 29, 14, 30)' },
    { title: 'Add a duration',              code: 'from datetime import date, timedelta\ndate(2026, 9, 29) + timedelta(weeks=2)', returns: 'datetime.date(2026, 10, 13)' },
    { title: 'Difference of two datetimes', code: 'from datetime import datetime\ndatetime(2026, 9, 29, 18, 0) - datetime(2026, 9, 28, 9, 15)', returns: 'datetime.timedelta(days=1, seconds=31500)' },
    { title: 'Parse ISO 8601 text',         code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30:00Z')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)' },
    { title: 'Format with strftime',        code: "from datetime import date\ndate(2026, 9, 29).strftime('%d %B %Y')", returns: "'29 September 2026'" },
    { title: 'Parse with strptime',         code: "from datetime import datetime\ndatetime.strptime('29/09/2026 14:30', '%d/%m/%Y %H:%M')", returns: 'datetime.datetime(2026, 9, 29, 14, 30)' },
    { title: 'Dates are validated',         code: 'from datetime import date\ndate(2026, 2, 29)', returns: 'ValueError: day is out of range for month' },
  ],

  pitfalls: [
    {
      name: 'import datetime vs from datetime import datetime',
      desc: 'The module and its main class share a name. After import datetime, the class is datetime.datetime.',
      wrong: { label: 'module, not class', code: 'import datetime\ndatetime.fromisoformat("2026-09-29")', output: "AttributeError: module 'datetime' has no attribute 'fromisoformat'" },
      fix:   { label: 'the class',          code: 'import datetime\ndatetime.datetime.fromisoformat("2026-09-29")', output: 'datetime.datetime(2026, 9, 29, 0, 0)' },
    },
    {
      name: 'Mixing naive and aware datetimes',
      desc: 'A naive datetime has no offset, so Python refuses to order or subtract it against an aware one. Make both aware.',
      wrong: { label: 'naive < aware', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29) < datetime.now(UTC)', output: "TypeError: can't compare offset-naive and offset-aware datetimes" },
      fix:   { label: 'both aware',     code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, tzinfo=UTC) < datetime(2026, 9, 30, tzinfo=UTC)', output: 'True' },
    },
    {
      name: 'timedelta.seconds is not the total',
      desc: 'A timedelta stores days, seconds (0..86399) and microseconds separately. .seconds drops the days.',
      wrong: { label: '.seconds',          code: 'from datetime import timedelta\ntimedelta(days=2, hours=1).seconds', output: '3600' },
      fix:   { label: '.total_seconds()',  code: 'from datetime import timedelta\ntimedelta(days=2, hours=1).total_seconds()', output: '176400.0' },
    },
  ],

  when: {
    use: [
      'Calendar dates, timestamps and durations in application code',
      'Parsing and producing ISO 8601 text (APIs, logs, JSON)',
      'Date arithmetic: deadlines, ages, "N days from now", differences',
    ],
    avoid: [
      'Named time zones with daylight saving rules → zoneinfo (3.9+)',
      'Monotonic timing of code → time.perf_counter()',
      'Calendars and month-length tables → the calendar module',
      'Adding months or years → there is no timedelta(months=…); use replace() or a third-party library',
    ],
  },

  notes: {
    cpython:      'Modules/_datetimemodule.c, imported by Lib/datetime.py; Lib/_pydatetime.py is the pure-Python fallback (strptime is shared: Lib/_strptime.py)',
    'Naive/aware': 'A datetime or time with tzinfo=None is naive; with a tzinfo whose utcoffset() is not None it is aware',
    'Immutability': 'Every object is immutable and hashable — replace(), astimezone() and arithmetic return new objects',
    'Range':       'date.min is 0001-01-01 and date.max is 9999-12-31; going past either raises OverflowError: date value out of range',
  },

  related: [
    { name: 'datetime', slug: 'datetime', when: 'The class, naive vs aware' },
    { name: 'timedelta', slug: 'timedelta', when: 'Durations and date arithmetic' },
    { name: 'strftime / strptime', slug: 'strftime-strptime', when: 'Format codes table' },
    { name: 'fromisoformat', slug: 'fromisoformat', when: 'Parse ISO 8601 text' },
    { name: 'json module', slug: 'json', when: 'datetime is not JSON serializable — isoformat() it', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between import datetime and from datetime import datetime?',
      a: 'import datetime binds the module, so the class is datetime.datetime and the date class is datetime.date. from datetime import datetime binds the class itself under the same name — after that, datetime.date is the method that extracts the date part, not the date class. Pick one style per file.',
    },
    {
      q: 'How do I get the current date and time in Python?',
      a: 'datetime.now(UTC) (Python 3.11+, or datetime.now(timezone.utc) before that) gives an aware datetime in UTC; date.today() gives the local calendar date. Avoid datetime.utcnow(): it returns a naive value and is deprecated since Python 3.12.',
    },
    {
      q: 'How do I add months to a date?',
      a: 'timedelta has no months or years because their length varies. Use replace() for simple cases (d.replace(year=d.year + 1) fails on 29 February) or compute the target month yourself and clamp the day to the month length (calendar.monthrange gives it).',
    },
    {
      q: 'How do I convert a datetime to a string and back?',
      a: 'For machines use dt.isoformat() and datetime.fromisoformat(text) — they round-trip exactly, offset included. For people use dt.strftime(format) and datetime.strptime(text, format) with the same format string.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html',
    meta:  'datetime — Basic date and time types',
  },
};
