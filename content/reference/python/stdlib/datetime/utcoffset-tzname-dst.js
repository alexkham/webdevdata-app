// content/reference/python/stdlib/datetime/utcoffset-tzname-dst.js
// utcoffset / tzname / dst on datetime, time, timezone and tzinfo

export const meta = {
  slug:        'utcoffset-tzname-dst',
  name:        'datetime.utcoffset / tzname / dst',
  signature:   'dt.utcoffset() · dt.tzname() · dt.dst()',
  blurb:       'Ask an aware value for its UTC offset, its zone name and its daylight-saving component; naive values answer None.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'utcoffset tzname dst datetime.utcoffset datetime.tzname datetime.dst time.utcoffset time.tzname time.dst timezone.utcoffset timezone.tzname timezone.dst tzinfo.utcoffset tzinfo.tzname tzinfo.dst get utc offset of datetime timezone name daylight saving python',
};

export const method = {
  slug:      'utcoffset-tzname-dst',
  name:      'datetime.utcoffset / tzname / dst',
  signature: 'dt.utcoffset() · dt.tzname() · dt.dst()',
  returns:   { type: 'timedelta | str | None', desc: 'utcoffset and dst: a timedelta or None. tzname: a str or None.' },

  category:    'datetime / time / tzinfo method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The same three questions exist on datetime, time, timezone and tzinfo. On a datetime or time they simply forward to tzinfo — passing the datetime itself (or None for a time) — and return None when there is no tzinfo.',

  covers: [
    'datetime.utcoffset', 'datetime.tzname', 'datetime.dst',
    'time.utcoffset', 'time.tzname', 'time.dst',
    'timezone.utcoffset', 'timezone.tzname', 'timezone.dst',
    'tzinfo.utcoffset', 'tzinfo.tzname', 'tzinfo.dst',
  ],

  cheat: {
    commonCall: 'dt.utcoffset()',
    returns:    'datetime.timedelta(seconds=7200) for +02:00; None if naive',
    replaces:   'Parsing "+02:00" out of strings',
    watchOut:   'timezone.dst() is always None — fixed offsets know nothing of DST',
  },

  parameters: [
    { name: 'dt', type: 'datetime | None', required: true, default: null, desc: 'Only on timezone / tzinfo methods: the datetime being asked about. timezone accepts None or a datetime and ignores it.' },
  ],

  attributes: [
    { name: 'utcoffset()', type: 'timedelta | None', meaning: 'Local time minus UTC, DST included: +02:00 → timedelta(seconds=7200), -05:00 → timedelta(days=-1, seconds=68400).' },
    { name: 'tzname()',    type: 'str | None',       meaning: 'timezone: its name, or "UTC±HH:MM" generated from the offset ("UTC" for zero). zoneinfo: abbreviations like "CEST".' },
    { name: 'dst()',       type: 'timedelta | None', meaning: 'How much of the offset is daylight saving. None for timezone objects and naive values.' },
  ],

  modes: [
    {
      id: 'ask',
      label: 'ask',
      blurb: 'All three questions on one parsed timestamp.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndt = datetime.fromisoformat({$when})\n(dt.utcoffset(), dt.tzname(), dt.dst())',
      cases: [
        { id: 'plus',  label: '+02:00', values: { when: '2026-09-29T14:30+02:00' } },
        { id: 'minus', label: '-05:30', values: { when: '2026-09-29T14:30-05:30' } },
        { id: 'z',     label: 'Z',      values: { when: '2026-09-29T14:30Z' } },
        { id: 'naive', label: 'naive',  values: { when: '2026-09-29T14:30' } },
      ],
    },
    {
      id: 'hours',
      label: 'offset in hours',
      blurb: 'utcoffset() is a timedelta; turn it into a number.',
      params: [{ name: 'when', type: 'str', hint: 'an aware ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\noff = datetime.fromisoformat({$when}).utcoffset()\noff.total_seconds() / 3600',
      cases: [
        { id: 'india', label: '+05:30', values: { when: '2026-09-29T14:30+05:30' } },
        { id: 'naive', label: 'naive',  values: { when: '2026-09-29T14:30' } },
      ],
    },
  ],
  demoExplainer: 'Negative offsets are normalized timedeltas (-05:30 is days=-1, seconds=66600) but total_seconds() gives the plain signed value. Naive values return None for all three — and None.total_seconds() is an AttributeError, so check for None first.',

  patterns: [
    {
      name: 'Offset as "+HH:MM" text',
      desc: 'strftime %:z (3.12+) or isoformat already contain it.',
      code: "label = dt.strftime('%:z')  # '+02:00'",
    },
    {
      name: 'Offset in minutes, None-safe',
      desc: 'Guard naive values.',
      code: 'off = dt.utcoffset()\nminutes = None if off is None else off // timedelta(minutes=1)',
    },
    {
      name: 'Is daylight saving in effect?',
      desc: 'Only meaningful with a DST-aware tzinfo such as zoneinfo.',
      code: 'in_dst = bool(dt.dst())',
    },
  ],

  examples: [
    { title: 'An aware datetime',           code: 'from datetime import datetime, timedelta, timezone\ndt = datetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2)))\n(dt.utcoffset(), dt.tzname(), dt.dst())', returns: "(datetime.timedelta(seconds=7200), 'UTC+02:00', None)" },
    { title: 'A naive datetime',            code: 'from datetime import datetime\ndt = datetime(2026, 9, 29)\n(dt.utcoffset(), dt.tzname(), dt.dst())', returns: '(None, None, None)' },
    { title: 'On a time',                   code: "from datetime import time, timedelta, timezone\nt = time(14, tzinfo=timezone(timedelta(hours=-3), 'BRT'))\n(t.utcoffset(), t.tzname())", returns: "(datetime.timedelta(days=-1, seconds=75600), 'BRT')" },
    { title: 'On the timezone itself',      code: 'from datetime import UTC\n(UTC.utcoffset(None), UTC.tzname(None), UTC.dst(None))', returns: "(datetime.timedelta(0), 'UTC', None)" },
    { title: 'The dt argument is required', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=1)).utcoffset()', returns: 'TypeError: timezone.utcoffset() takes exactly one argument (0 given)' },
    { title: 'The abstract base',           code: 'from datetime import tzinfo\ntzinfo().tzname(None)', returns: 'NotImplementedError: a tzinfo subclass must implement tzname()' },
  ],

  pitfalls: [
    {
      name: 'Calling total_seconds() on a naive offset',
      desc: 'Naive datetimes return None, which has no methods.',
      wrong: { label: 'naive', code: 'from datetime import datetime\ndatetime(2026, 9, 29).utcoffset().total_seconds()', output: "AttributeError: 'NoneType' object has no attribute 'total_seconds'" },
      fix:   { label: 'check first', code: 'from datetime import datetime\noff = datetime(2026, 9, 29).utcoffset()\n0.0 if off is None else off.total_seconds()', output: '0.0' },
    },
    {
      name: 'Passing an int to timezone.utcoffset',
      desc: 'The argument is the datetime being asked about (or None), not an hour.',
      wrong: { label: 'utcoffset(5)', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=1)).utcoffset(5)', output: 'TypeError: utcoffset(dt) argument must be a datetime instance or None, not int' },
      fix:   { label: 'utcoffset(None)', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=1)).utcoffset(None)', output: 'datetime.timedelta(seconds=3600)' },
    },
  ],

  when: {
    use: ['Finding out whether and how a value is zoned', 'Displaying or storing the offset separately'],
    avoid: ['Converting between zones → astimezone', 'Deciding DST with a fixed offset — timezone.dst() is always None'],
  },

  notes: {
    cpython:     'datetime/time methods call tzinfo.utcoffset(self) (a time passes None) and validate the result: None or a timedelta strictly within ±24 h',
    'Naive':     'No tzinfo → all three return None',
    'timezone':  'utcoffset → the fixed offset, dst → None, tzname → the name or "UTC±HH:MM[:SS[.ffffff]]"',
  },

  related: [
    { name: 'tzinfo', slug: 'tzinfo', when: 'Implementing these methods' },
    { name: 'timezone', slug: 'timezone', when: 'The built-in implementation' },
    { name: 'hour / … / tzinfo / fold', slug: 'time-attributes', when: 'The tzinfo attribute itself' },
    { name: 'astimezone', slug: 'astimezone', when: 'Change the offset' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the UTC offset of a datetime in Python?',
      a: 'dt.utcoffset() returns a timedelta (None if naive). For hours: dt.utcoffset().total_seconds() / 3600; for text: dt.strftime("%z") or "%:z".',
    },
    {
      q: 'Why does tzname() return "UTC+02:00" instead of a real zone name?',
      a: 'A timezone created without a name generates one from the offset. Pass a name — timezone(timedelta(hours=2), "CEST") — or use zoneinfo, whose tzname() returns the abbreviation in effect at that moment.',
    },
    {
      q: 'Why is dst() None?',
      a: 'The value is naive, or its tzinfo is a fixed timezone, which has no daylight-saving concept. zoneinfo zones return timedelta(0) or the DST amount.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.utcoffset',
    meta:  'datetime.utcoffset',
  },
};
