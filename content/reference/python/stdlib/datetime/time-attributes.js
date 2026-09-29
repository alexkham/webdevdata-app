// content/reference/python/stdlib/datetime/time-attributes.js
// hour / minute / second / microsecond / tzinfo / fold on datetime and time

export const meta = {
  slug:        'time-attributes',
  name:        'datetime.hour / minute / second / microsecond / tzinfo / fold',
  signature:   'dt.hour · dt.minute · dt.second · dt.microsecond · dt.tzinfo · dt.fold',
  blurb:       'The read-only time-of-day fields shared by datetime and time: hour, minute, second, microsecond, the tzinfo object and the fold flag.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.3+ (fold 3.6+)',
  searchTerms: 'datetime.hour datetime.minute datetime.second datetime.microsecond datetime.tzinfo datetime.fold time.hour time.minute time.second time.microsecond time.tzinfo time.fold hour minute second microsecond tzinfo fold attribute python get hour from datetime milliseconds pep 495 ambiguous time dst',
};

export const method = {
  slug:      'time-attributes',
  name:      'datetime.hour / minute / second / microsecond / tzinfo / fold',
  signature: 'dt.hour · dt.minute · dt.second · dt.microsecond · dt.tzinfo · dt.fold',
  returns:   { type: 'int | tzinfo | None', desc: 'Ints for the clock fields and fold; the tzinfo object or None.' },

  category:    'datetime / time attributes',
  version:     'Python 2.3+ (fold 3.6+)',
  hasLiveDemo: true,

  subtitle: 'Six read-only attributes, identical on datetime and time. tzinfo is what makes a value aware; fold (0 or 1) picks between the two occurrences of a repeated wall time when clocks go back.',

  covers: [
    'datetime.hour', 'datetime.minute', 'datetime.second', 'datetime.microsecond', 'datetime.tzinfo', 'datetime.fold',
    'time.hour', 'time.minute', 'time.second', 'time.microsecond', 'time.tzinfo', 'time.fold',
  ],

  cheat: {
    commonCall: 'dt.hour, dt.minute',
    returns:    '(14, 30)',
    replaces:   'Slicing "HH:MM" strings',
    watchOut:   'No millisecond attribute: dt.microsecond // 1000',
  },

  parameters: [],

  attributes: [
    { name: 'hour',        type: 'int',           meaning: '0..23.' },
    { name: 'minute',      type: 'int',           meaning: '0..59.' },
    { name: 'second',      type: 'int',           meaning: '0..59 (no leap second 60).' },
    { name: 'microsecond', type: 'int',           meaning: '0..999999. Milliseconds are microsecond // 1000.' },
    { name: 'tzinfo',      type: 'tzinfo | None', meaning: 'The object passed as tzinfo=, or None for naive values. It is the zone object, not an offset — call utcoffset() for the offset.' },
    { name: 'fold',        type: 'int',           meaning: '0 or 1 (3.6+). 1 = the second occurrence of an ambiguous local time. Ignored by comparisons and by fixed-offset zones.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'fields',
      blurb: 'Parse a timestamp and read every time-of-day attribute.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndt = datetime.fromisoformat({$when})\n(dt.hour, dt.minute, dt.second, dt.microsecond, dt.tzinfo, dt.fold)',
      cases: [
        { id: 'naive',  label: 'naive',        values: { when: '2026-09-29T14:30:05.25' } },
        { id: 'aware',  label: 'with offset',  values: { when: '2026-09-29T08:00-04:00' } },
        { id: 'zulu',   label: 'Z',            values: { when: '2026-09-29T23:59:59.999999Z' } },
      ],
    },
    {
      id: 'millis',
      label: 'milliseconds',
      blurb: 'There is no millisecond field; derive it from microsecond.',
      params: [{ name: 't', type: 'str', hint: 'HH:MM:SS.ffffff', input: 'text' }],
      template: 'from datetime import time\nt = time.fromisoformat({$t})\n(t.microsecond, t.microsecond // 1000)',
      cases: [
        { id: 'ms',  label: '.25',     values: { t: '14:30:05.25' } },
        { id: 'us',  label: '.123456', values: { t: '14:30:05.123456' } },
      ],
    },
  ],
  demoExplainer: 'A fractional ".25" is 250000 microseconds (the digits are padded on the right), i.e. 250 milliseconds. tzinfo holds the zone object itself — timezone(timedelta(days=-1, seconds=72000)) for -04:00 — while fold stays 0 for anything parsed from text.',

  patterns: [
    {
      name: 'Minutes since midnight',
      desc: 'A compact sortable key for times of day.',
      code: 'minutes = dt.hour * 60 + dt.minute',
    },
    {
      name: 'Truncate to the minute',
      desc: 'replace() the smaller fields with zero.',
      code: 'minute_start = dt.replace(second=0, microsecond=0)',
    },
    {
      name: 'Aware or naive?',
      desc: 'tzinfo alone is not quite enough; utcoffset() must also be non-None.',
      code: 'aware = dt.tzinfo is not None and dt.utcoffset() is not None',
    },
  ],

  examples: [
    { title: 'The clock fields',            code: 'from datetime import datetime\ndt = datetime(2026, 9, 29, 14, 30, 5, 250)\n(dt.hour, dt.minute, dt.second, dt.microsecond)', returns: '(14, 30, 5, 250)' },
    { title: 'tzinfo of naive and aware',   code: 'from datetime import datetime, UTC\n(datetime(2026, 9, 29).tzinfo, datetime(2026, 9, 29, tzinfo=UTC).tzinfo)', returns: '(None, datetime.timezone.utc)' },
    { title: 'Same on time objects',        code: 'from datetime import time\nt = time(9, 5, 30)\n(t.hour, t.minute, t.second)', returns: '(9, 5, 30)' },
    { title: 'fold is kept but not compared', code: 'from datetime import datetime\na = datetime(2026, 11, 1, 1, 30, fold=1)\n(a.fold, a == a.replace(fold=0))', returns: '(1, True)' },
    { title: 'Read-only',                   code: 'from datetime import datetime\ndt = datetime(2026, 9, 29, 14)\ndt.hour = 15', returns: "AttributeError: attribute 'hour' of 'datetime.datetime' objects is not writable" },
    { title: 'A date has no hour',          code: 'from datetime import date\ndate(2026, 9, 29).hour', returns: "AttributeError: 'datetime.date' object has no attribute 'hour'" },
  ],

  pitfalls: [
    {
      name: 'Using tzinfo as the offset',
      desc: 'tzinfo is the zone object. The offset of this particular datetime comes from utcoffset().',
      wrong: { label: 'dt.tzinfo', code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T08:00-04:00').tzinfo", output: 'datetime.timezone(datetime.timedelta(days=-1, seconds=72000))' },
      fix:   { label: 'dt.utcoffset()', code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T08:00-04:00').utcoffset().total_seconds() / 3600", output: '-4.0' },
    },
    {
      name: 'Looking for a millisecond attribute',
      desc: 'Only microsecond exists. Divide by 1000 — or format with isoformat(timespec="milliseconds").',
      wrong: { label: '.millisecond', code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5, 250000).millisecond', output: "AttributeError: 'datetime.datetime' object has no attribute 'millisecond'" },
      fix:   { label: 'microsecond // 1000', code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5, 250000).microsecond // 1000', output: '250' },
    },
  ],

  when: {
    use: ['Bucketing by hour, business-hours checks, custom labels', 'tzinfo to find out whether and how a value is zoned'],
    avoid: ['Changing a field → replace()', 'Formatting → strftime / isoformat'],
  },

  notes: {
    cpython:   'Read-only getset descriptors; fold is stored separately from the packed time bytes and does not take part in comparisons or hashing',
    'fold':    'Only a tzinfo with DST transitions (zoneinfo) gives fold meaning: 01:30 on a fall-back night happens twice, fold=0 is the first',
    'Also on': 'hour/minute/second/microsecond/tzinfo/fold exist on both datetime and time; date has none of them',
  },

  related: [
    { name: 'year / month / day', slug: 'date-attributes', when: 'The date fields' },
    { name: 'utcoffset / tzname / dst', slug: 'utcoffset-tzname-dst', when: 'What the tzinfo says about this value' },
    { name: 'replace', slug: 'replace', when: 'Change a field, set fold or tzinfo' },
    { name: 'time', slug: 'time', when: 'The time class' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the hour and minute from a datetime?',
      a: 'dt.hour and dt.minute — int attributes without parentheses. For text use dt.strftime("%H:%M").',
    },
    {
      q: 'What is the fold attribute?',
      a: 'Added by PEP 495 in Python 3.6: when clocks go back, a local time like 01:30 happens twice. fold=0 means the first occurrence, fold=1 the second. Only zones with DST rules (such as zoneinfo.ZoneInfo) use it; fixed offsets and naive values ignore it.',
    },
    {
      q: 'How do I get milliseconds from a datetime?',
      a: 'dt.microsecond // 1000. For text, dt.isoformat(timespec="milliseconds") or dt.strftime("%f")[:3].',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.fold',
    meta:  'datetime.fold',
  },
};
