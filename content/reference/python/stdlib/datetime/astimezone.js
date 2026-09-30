// content/reference/python/stdlib/datetime/astimezone.js — datetime.astimezone

export const meta = {
  slug:        'astimezone',
  name:        'datetime.astimezone',
  signature:   'dt.astimezone(tz=None)',
  blurb:       'Convert an aware datetime to another time zone: same instant, different wall-clock reading. Without tz it converts to the machine\'s local zone.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.3+ (tz optional), naive input 3.6+',
  searchTerms: 'datetime.astimezone astimezone convert timezone python convert utc to local convert between time zones offset conversion local time naive astimezone',
};

export const method = {
  slug:      'astimezone',
  name:      'datetime.astimezone',
  signature: 'dt.astimezone(tz=None)',
  returns:   { type: 'datetime', desc: 'An aware datetime equal to dt (same instant) whose tzinfo is tz.' },

  category:    'datetime method',
  version:     'Python 3.3+ (tz optional), naive input 3.6+',
  hasLiveDemo: true,

  subtitle: 'The converter. It moves the value to UTC using its own offset, then lets tz.fromutc() compute the new local fields — so the result compares equal to the input. On a naive value, or with no tz, the machine\'s local zone gets involved.',

  covers: ['datetime.astimezone'],

  cheat: {
    commonCall: 'dt.astimezone(UTC)',
    returns:    'the same instant expressed in UTC',
    replaces:   'Adding and subtracting offsets by hand',
    watchOut:   'Naive dt is assumed to be LOCAL time, not UTC',
  },

  parameters: [
    { name: 'tz', type: 'tzinfo | None', required: false, default: 'None', desc: 'Target zone: UTC, timezone(offset), ZoneInfo(...). None means the system local zone (a fixed-offset timezone for that moment).' },
  ],

  modes: [
    {
      id: 'convert',
      label: 'convert',
      blurb: 'One instant, shown at another offset. The equality check proves nothing moved.',
      params: [
        { name: 'when',  type: 'str', hint: 'an aware ISO 8601 timestamp', input: 'text' },
        { name: 'hours', type: 'int', hint: 'target offset in hours',      input: 'number' },
      ],
      template: "from datetime import datetime, timedelta, timezone\ndt = datetime.fromisoformat({$when})\nif dt.tzinfo is None:\n    raise ValueError('give the timestamp an offset, e.g. Z or +02:00')\nlocal = dt.astimezone(timezone(timedelta(hours={$hours})))\n(local.isoformat(), local == dt)",
      cases: [
        { id: 'tokyo',  label: 'UTC → +09:00',    values: { when: '2026-09-29T20:00Z', hours: '9' } },
        { id: 'la',     label: '+02:00 → -07:00', values: { when: '2026-09-29T08:00+02:00', hours: '-7' } },
        { id: 'utc',    label: '→ UTC',           values: { when: '2026-09-29T08:00+05:30', hours: '0' } },
        { id: 'naive',  label: 'naive input',     values: { when: '2026-09-29T08:00', hours: '0' } },
      ],
    },
  ],
  demoExplainer: 'Converting can change the date: 20:00 UTC is already 05:00 the next day at +09:00. The == check is True every time because aware datetimes compare by instant. Naive input is stopped by the template: CPython would treat it as the machine\'s local time, which a demo cannot know.',

  patterns: [
    {
      name: 'Store UTC, display local',
      desc: 'Convert at the edge only.',
      code: "from datetime import datetime, UTC\nfrom zoneinfo import ZoneInfo\nstored = datetime.now(UTC)\nshown = stored.astimezone(ZoneInfo('Europe/Paris'))",
    },
    {
      name: 'Normalize mixed offsets',
      desc: 'Aware values from different sources, one zone for comparison and grouping.',
      code: 'from datetime import UTC\nnormalized = [dt.astimezone(UTC) for dt in parsed]',
    },
    {
      name: 'Naive value known to be UTC',
      desc: 'Label it first — astimezone would assume local time.',
      code: 'from datetime import UTC\nlocal = naive_utc.replace(tzinfo=UTC).astimezone(target_tz)',
    },
  ],

  examples: [
    { title: 'To UTC',                     code: 'from datetime import datetime, timedelta, timezone, UTC\ndatetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2))).astimezone(UTC)', returns: 'datetime.datetime(2026, 9, 29, 12, 30, tzinfo=datetime.timezone.utc)' },
    { title: 'Across midnight',            code: 'from datetime import datetime, timedelta, timezone, UTC\ndatetime(2026, 9, 29, 14, 30, tzinfo=UTC).astimezone(timezone(timedelta(hours=14)))', returns: 'datetime.datetime(2026, 9, 30, 4, 30, tzinfo=datetime.timezone(datetime.timedelta(seconds=50400)))' },
    { title: 'Same instant, equal values', code: 'from datetime import datetime, timedelta, timezone\ndt = datetime(2026, 9, 29, 14, 30, tzinfo=timezone(timedelta(hours=2)))\ndt.astimezone(timezone(timedelta(hours=-7))) == dt', returns: 'True' },
    { title: 'Same tzinfo: returns self',  code: 'from datetime import datetime, UTC\ndt = datetime(2026, 9, 29, tzinfo=UTC)\ndt.astimezone(UTC) is dt', returns: 'True' },
    { title: 'Overflow at the edges',      code: 'from datetime import datetime, timedelta, timezone, UTC\ndatetime.max.replace(tzinfo=UTC).astimezone(timezone(timedelta(hours=1)))', returns: 'OverflowError: date value out of range' },
    { title: 'tz must be a tzinfo',        code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, tzinfo=UTC).astimezone(5)', returns: "TypeError: tzinfo argument must be None or of a tzinfo subclass, not type 'int'" },
  ],

  pitfalls: [
    {
      name: 'astimezone to "attach" a zone',
      desc: 'On an aware value astimezone converts; to label a naive value with the zone its fields are already in, use replace(tzinfo=...).',
      wrong: { label: 'astimezone', code: "from datetime import datetime, timedelta, timezone, UTC\ndatetime(2026, 9, 29, 12, tzinfo=UTC).astimezone(timezone(timedelta(hours=2))).hour", output: '14' },
      fix:   { label: 'replace', code: 'from datetime import datetime, timedelta, timezone, UTC\ndatetime(2026, 9, 29, 12, tzinfo=UTC).replace(tzinfo=timezone(timedelta(hours=2))).hour', output: '12' },
    },
    {
      name: 'Converting naive UTC values',
      desc: 'astimezone() reads a naive value as local time, so utcnow()-style values shift by the machine\'s offset. Mark them as UTC first — then the result no longer depends on the machine.',
      wrong: { label: 'naive (local assumed)', code: 'from datetime import datetime\nnaive = datetime(2026, 9, 29, 12)\nnaive.tzinfo is None', output: 'True' },
      fix:   { label: 'replace(tzinfo=UTC) first', code: 'from datetime import datetime, timedelta, timezone, UTC\ndatetime(2026, 9, 29, 12).replace(tzinfo=UTC).astimezone(timezone(timedelta(hours=2))).isoformat()', output: "'2026-09-29T14:00:00+02:00'" },
    },
  ],

  when: {
    use: ['Showing a stored UTC value in a user\'s zone', 'Normalizing aware values from different offsets'],
    avoid: ['Labelling naive values → replace(tzinfo=…)', 'Server code with astimezone() and no argument — the result depends on the machine\'s zone setting'],
  },

  notes: {
    cpython:      'datetime_astimezone: self - utcoffset() → UTC fields, tzinfo set to tz, then tz.fromutc(); returns self when tz is self.tzinfo',
    'No argument': 'astimezone() with no tz returns a fixed-offset timezone for the local zone at that moment (with the local zone name)',
    'Naive input': 'Since 3.6 it can be called on a naive self, which is taken as system local time',
  },

  related: [
    { name: 'timezone', slug: 'timezone', when: 'Fixed offsets to convert to' },
    { name: 'UTC', slug: 'utc', when: 'The usual target' },
    { name: 'replace', slug: 'replace', when: 'Relabel instead of convert' },
    { name: 'tzinfo / fromutc', slug: 'tzinfo', when: 'The hook astimezone calls' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a datetime to another timezone in Python?',
      a: 'Make sure it is aware, then call dt.astimezone(target). For regions use zoneinfo: dt.astimezone(ZoneInfo("America/New_York")); for fixed offsets timezone(timedelta(hours=...)).',
    },
    {
      q: 'How do I convert UTC to local time?',
      a: 'utc_dt.astimezone() with no argument uses the machine\'s local zone. On servers prefer an explicit zone for the user: utc_dt.astimezone(ZoneInfo(user_zone)).',
    },
    {
      q: 'What is the difference between astimezone and replace(tzinfo=...)?',
      a: 'astimezone keeps the instant and recomputes the fields; replace keeps the fields and changes the instant. Use replace only to attach a zone to a naive value whose fields are already in that zone.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.astimezone',
    meta:  'datetime.astimezone',
  },
};
