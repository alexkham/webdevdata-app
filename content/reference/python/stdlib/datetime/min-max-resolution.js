// content/reference/python/stdlib/datetime/min-max-resolution.js
// min / max / resolution class attributes of date, datetime, time, timedelta (and timezone.min/max)

export const meta = {
  slug:        'min-max-resolution',
  name:        'date.min / max / resolution (and friends)',
  signature:   'date.min · date.max · date.resolution',
  blurb:       'The smallest value, the largest value and the smallest step of each datetime type: date, datetime, time, timedelta — plus timezone.min and timezone.max.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.3+ (timezone 3.2+)',
  searchTerms: 'date.min date.max date.resolution datetime.min datetime.max datetime.resolution time.min time.max time.resolution timedelta.min timedelta.max timedelta.resolution timezone.min timezone.max min max resolution smallest largest datetime python sentinel microsecond',
};

export const method = {
  slug:      'min-max-resolution',
  name:      'date.min / max / resolution (and friends)',
  signature: 'date.min · date.max · date.resolution',
  returns:   { type: 'date | datetime | time | timedelta | timezone', desc: 'min/max are instances of the class; resolution is always a timedelta.' },

  category:    'class attributes',
  version:     'Python 2.3+ (timezone 3.2+)',
  hasLiveDemo: true,

  subtitle: 'Fourteen class attributes, one idea: the edges of each type. min and max make good open-range sentinels; resolution is the smallest difference two values can have — one day for date, one microsecond for everything else.',

  covers: [
    'date.min', 'date.max', 'date.resolution',
    'datetime.min', 'datetime.max', 'datetime.resolution',
    'time.min', 'time.max', 'time.resolution',
    'timedelta.min', 'timedelta.max', 'timedelta.resolution',
    'timezone.min', 'timezone.max',
  ],

  cheat: {
    commonCall: 'valid_until = date.max',
    returns:    'datetime.date(9999, 12, 31)',
    replaces:   'Magic sentinel dates like 9999-12-31 written by hand',
    watchOut:   'datetime.min/max are naive; timedelta.min is not -timedelta.max',
  },

  parameters: [],

  attributes: [
    { name: 'date.min / date.max',         type: 'date',      meaning: '0001-01-01 / 9999-12-31.' },
    { name: 'date.resolution',             type: 'timedelta', meaning: 'timedelta(days=1).' },
    { name: 'datetime.min / datetime.max', type: 'datetime',  meaning: '0001-01-01 00:00 / 9999-12-31 23:59:59.999999, both naive.' },
    { name: 'datetime.resolution',         type: 'timedelta', meaning: 'timedelta(microseconds=1).' },
    { name: 'time.min / time.max',         type: 'time',      meaning: '00:00 / 23:59:59.999999, naive.' },
    { name: 'time.resolution',             type: 'timedelta', meaning: 'timedelta(microseconds=1).' },
    { name: 'timedelta.min / timedelta.max', type: 'timedelta', meaning: '-999999999 days / 999999999 days, 23:59:59.999999.' },
    { name: 'timedelta.resolution',        type: 'timedelta', meaning: 'timedelta(microseconds=1).' },
    { name: 'timezone.min / timezone.max', type: 'timezone',  meaning: 'UTC-23:59 / UTC+23:59. There is no timezone.resolution.' },
  ],

  modes: [
    {
      id: 'edges',
      label: 'edges',
      blurb: 'Step inward from both ends of the date range — or past them.',
      params: [{ name: 'days', type: 'int', hint: 'days to step', input: 'number' }],
      template: 'from datetime import date, timedelta\n(date.min + timedelta(days={$days}), date.max - timedelta(days={$days}))',
      cases: [
        { id: 'in',   label: 'one day in', values: { days: '1' } },
        { id: 'out',  label: 'one day out', values: { days: '-1' } },
        { id: 'span', label: 'whole range', values: { days: '3652058' } },
      ],
    },
    {
      id: 'step',
      label: 'resolution',
      blurb: 'resolution is a timedelta, so it can be multiplied and added.',
      params: [{ name: 'n', type: 'int', hint: 'how many steps', input: 'number' }],
      template: 'from datetime import datetime\ndatetime(2026, 9, 29) + datetime.resolution * {$n}',
      cases: [
        { id: 'one',   label: '1 µs',       values: { n: '1' } },
        { id: 'sec',   label: '1,000,000',  values: { n: '1000000' } },
        { id: 'back',  label: 'negative',   values: { n: '-1' } },
      ],
    },
  ],
  demoExplainer: 'date.min + 3652058 days is exactly date.max: the range holds 3,652,059 days. Stepping outside it by even one day is OverflowError: date value out of range. A million datetime.resolution steps make one second.',

  patterns: [
    {
      name: 'Open-ended ranges',
      desc: 'Use the extremes instead of None when the code compares a lot.',
      code: 'from datetime import date\nstart = row.start or date.min\nend = row.end or date.max\nactive = start <= today <= end',
    },
    {
      name: 'Sort with missing values last',
      desc: 'A key that maps None to the max sentinel.',
      code: 'from datetime import datetime\nitems.sort(key=lambda x: x.due or datetime.max)',
    },
  ],

  examples: [
    { title: 'date limits',                 code: 'from datetime import date\n(date.min, date.max, date.resolution)', returns: '(datetime.date(1, 1, 1), datetime.date(9999, 12, 31), datetime.timedelta(days=1))' },
    { title: 'datetime limits',             code: 'from datetime import datetime\n(datetime.min, datetime.max)', returns: '(datetime.datetime(1, 1, 1, 0, 0), datetime.datetime(9999, 12, 31, 23, 59, 59, 999999))' },
    { title: 'time limits',                 code: 'from datetime import time\n(time.min, time.max, time.resolution)', returns: '(datetime.time(0, 0), datetime.time(23, 59, 59, 999999), datetime.timedelta(microseconds=1))' },
    { title: 'timedelta limits',            code: 'from datetime import timedelta\n(timedelta.min, timedelta.max)', returns: '(datetime.timedelta(days=-999999999), datetime.timedelta(days=999999999, seconds=86399, microseconds=999999))' },
    { title: 'timezone limits',             code: 'from datetime import timezone\n(str(timezone.min), str(timezone.max))', returns: "('UTC-23:59', 'UTC+23:59')" },
    { title: 'The whole datetime range',    code: 'from datetime import datetime\ndatetime.max - datetime.min', returns: 'datetime.timedelta(days=3652058, seconds=86399, microseconds=999999)' },
    { title: 'No timezone.resolution',      code: 'from datetime import timezone\ntimezone.resolution', returns: "AttributeError: type object 'datetime.timezone' has no attribute 'resolution'" },
  ],

  pitfalls: [
    {
      name: 'Negating timedelta.max',
      desc: 'The range is not symmetric: timedelta.max has 23:59:59.999999 on top of its days, so its negation needs one day more than timedelta.min allows.',
      wrong: { label: '-timedelta.max', code: 'from datetime import timedelta\n-timedelta.max', output: 'OverflowError: days=-1000000000; must have magnitude <= 999999999' },
      fix:   { label: 'timedelta.min', code: 'from datetime import timedelta\ntimedelta.min', output: 'datetime.timedelta(days=-999999999)' },
    },
    {
      name: 'Comparing datetime.max with aware values',
      desc: 'datetime.min and datetime.max are naive. For aware comparisons attach a zone first.',
      wrong: { label: 'naive sentinel', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, tzinfo=UTC) < datetime.max', output: "TypeError: can't compare offset-naive and offset-aware datetimes" },
      fix:   { label: 'aware sentinel', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, tzinfo=UTC) < datetime.max.replace(tzinfo=UTC)', output: 'True' },
    },
  ],

  when: {
    use: ['Sentinels for open date ranges and sort keys', 'Tests of edge handling (OverflowError paths)'],
    avoid: ['Sending max to systems with their own limits (databases, other languages) without checking their range'],
  },

  notes: {
    cpython:      'Class attributes created in Modules/_datetimemodule.c when the module is initialised',
    'Naive':       'datetime.min, datetime.max, time.min and time.max have tzinfo=None',
    'Resolution':  'date.resolution is one day; datetime, time and timedelta resolve to one microsecond',
    'Asymmetry':   'timedelta.min == -timedelta(days=999999999) while timedelta.max is 999999999 days + 86399.999999 s',
  },

  related: [
    { name: 'MINYEAR / MAXYEAR', slug: 'minyear-maxyear', when: 'The year bounds behind date.min and date.max' },
    { name: 'timedelta', slug: 'timedelta', when: 'Durations and their limits' },
    { name: 'timezone', slug: 'timezone', when: 'Fixed offsets within ±24 h' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the maximum datetime in Python?',
      a: 'datetime.max is 9999-12-31 23:59:59.999999 (naive). date.max is 9999-12-31 and time.max is 23:59:59.999999.',
    },
    {
      q: 'What is the resolution of datetime?',
      a: 'One microsecond: datetime.resolution == timedelta(microseconds=1). date.resolution is one day. Nanoseconds are not supported.',
    },
    {
      q: 'Why is there no timezone.resolution?',
      a: 'timezone defines only min and max (UTC-23:59 and UTC+23:59). Its offsets are timedeltas, so they can be as fine as a microsecond (3.7+), but the class does not advertise a resolution attribute.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.min',
    meta:  'datetime.min',
  },
};
