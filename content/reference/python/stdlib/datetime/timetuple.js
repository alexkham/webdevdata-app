// content/reference/python/stdlib/datetime/timetuple.js
// date.timetuple, datetime.timetuple, datetime.utctimetuple

export const meta = {
  slug:        'timetuple',
  name:        'datetime.timetuple / utctimetuple',
  signature:   'dt.timetuple()',
  blurb:       'Convert to a time.struct_time for the time module: timetuple() keeps the local fields, utctimetuple() converts an aware value to UTC first.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date.timetuple datetime.timetuple datetime.utctimetuple timetuple utctimetuple struct_time time module tm_yday day of year tm_isdst calendar.timegm mktime python',
};

export const method = {
  slug:      'timetuple',
  name:      'datetime.timetuple / utctimetuple',
  signature: 'dt.timetuple()',
  returns:   { type: 'time.struct_time', desc: '9 fields: tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec, tm_wday (Monday = 0), tm_yday, tm_isdst.' },

  category:    'date / datetime method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The bridge to the older time module (time.mktime, calendar.timegm, time.strftime). Microseconds and the offset do not survive; tm_isdst says what dst() said.',

  covers: ['date.timetuple', 'datetime.timetuple', 'datetime.utctimetuple'],

  cheat: {
    commonCall: 'dt.timetuple().tm_yday',
    returns:    'day of the year, 1..366',
    replaces:   'Manual day-of-year arithmetic',
    watchOut:   'utctimetuple() on a NAIVE value does no conversion at all',
  },

  parameters: [],

  modes: [
    {
      id: 'tuple',
      label: 'both tuples',
      blurb: 'The local fields and the UTC fields of one timestamp.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndt = datetime.fromisoformat({$when})\nlocal, utc = dt.timetuple(), dt.utctimetuple()\n(local.tm_hour, local.tm_isdst, utc.tm_mday, utc.tm_hour, utc.tm_isdst, local.tm_yday)',
      cases: [
        { id: 'aware', label: '+02:00',       values: { when: '2026-09-29T01:30+02:00' } },
        { id: 'naive', label: 'naive',        values: { when: '2026-09-29T01:30' } },
        { id: 'utc',   label: 'UTC',          values: { when: '2026-12-31T23:00Z' } },
      ],
    },
  ],
  demoExplainer: '01:30+02:00 is 23:30 UTC on the previous day, so the UTC tuple shows day 28, hour 23. For a naive value utctimetuple() just copies the fields. tm_isdst is -1 (unknown) because timezone.dst() returns None, and always 0 in utctimetuple().',

  patterns: [
    {
      name: 'Day of the year',
      desc: 'tm_yday, 1-based.',
      code: 'day_of_year = d.timetuple().tm_yday',
    },
    {
      name: 'UTC epoch seconds via calendar.timegm',
      desc: 'The time-module route; dt.timestamp() is simpler for aware values.',
      code: 'import calendar\nepoch = calendar.timegm(aware_dt.utctimetuple())',
    },
  ],

  examples: [
    { title: 'A date as struct_time',       code: 'from datetime import date\ndate(2026, 9, 29).timetuple()', returns: 'time.struct_time(tm_year=2026, tm_mon=9, tm_mday=29, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=1, tm_yday=272, tm_isdst=-1)' },
    { title: 'Day of the year',             code: 'from datetime import date\ndate(2026, 9, 29).timetuple().tm_yday', returns: '272' },
    { title: 'utctimetuple converts aware values', code: 'from datetime import datetime, timedelta, timezone\ndatetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2))).utctimetuple()', returns: 'time.struct_time(tm_year=2026, tm_mon=9, tm_mday=29, tm_hour=12, tm_min=30, tm_sec=0, tm_wday=1, tm_yday=272, tm_isdst=0)' },
    { title: 'calendar.timegm on it',       code: 'import calendar\nfrom datetime import datetime, timedelta, timezone\ncalendar.timegm(datetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2))).utctimetuple())', returns: '1790685000' },
    { title: 'Indexable like a tuple',      code: 'from datetime import date\ndate(2026, 9, 29).timetuple()[:3]', returns: '(2026, 9, 29)' },
  ],

  pitfalls: [
    {
      name: 'Expecting microseconds',
      desc: 'struct_time has whole seconds only; the fraction is dropped.',
      wrong: { label: 'timetuple()', code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5, 999999).timetuple().tm_sec', output: '5' },
      fix:   { label: 'keep the datetime', code: 'from datetime import datetime\ndt = datetime(2026, 9, 29, 14, 30, 5, 999999)\n(dt.second, dt.microsecond)', output: '(5, 999999)' },
    },
    {
      name: 'tm_wday is Monday = 0, not Sunday = 0',
      desc: 'It follows date.weekday(), unlike C\'s struct tm and strftime %w.',
      wrong: { label: 'assume Sunday-first', code: "from datetime import date\n['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date(2026, 9, 29).timetuple().tm_wday]", output: "'Mon'" },
      fix:   { label: 'Monday-first', code: "from datetime import date\n['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date(2026, 9, 29).timetuple().tm_wday]", output: "'Tue'" },
    },
  ],

  when: {
    use: ['APIs of the time and calendar modules', 'tm_yday for the day of the year'],
    avoid: ['Anything the datetime object can do itself (strftime, timestamp, weekday)'],
  },

  notes: {
    cpython:   'build_struct_time in Modules/_datetimemodule.c; tm_isdst is -1 when dst() is None, 1 when dst() is non-zero, 0 otherwise',
    'utctimetuple': 'Aware: subtracts utcoffset() first (may raise OverflowError at the range edges). Naive: fields unchanged. tm_isdst is always 0',
    'date':    'date.timetuple() has zero time fields and tm_isdst -1',
  },

  related: [
    { name: 'timestamp', slug: 'timestamp', when: 'Epoch seconds without struct_time' },
    { name: 'strftime', slug: 'strftime-strptime', when: 'strftime formats a timetuple internally' },
    { name: 'weekday', slug: 'weekday', when: 'tm_wday numbering' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the day of the year from a date in Python?',
      a: 'd.timetuple().tm_yday (1 for 1 January), or d.strftime("%j") for the zero-padded string. You can also compute d.toordinal() - date(d.year, 1, 1).toordinal() + 1.',
    },
    {
      q: 'What is the difference between timetuple() and utctimetuple()?',
      a: 'timetuple() keeps the datetime\'s own fields. utctimetuple() converts an aware datetime to UTC first and sets tm_isdst to 0; for a naive datetime it does not convert anything.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.timetuple',
    meta:  'datetime.timetuple',
  },
};
