// content/reference/python/stdlib/datetime/timezone.js — the timezone class

export const meta = {
  slug:        'timezone',
  name:        'datetime.timezone',
  signature:   'timezone(offset, name=None)',
  blurb:       'A fixed UTC offset as a ready-made tzinfo: timezone.utc, timezone(timedelta(hours=5, minutes=30)). Makes datetimes aware and converts between offsets.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'timezone class fixed offset utc offset python timezone timedelta hours convert timezone astimezone tzinfo UTC+05:30 offset must be a timedelta strictly between daylight saving zoneinfo',
};

export const method = {
  slug:      'timezone',
  name:      'datetime.timezone',
  signature: 'timezone(offset, name=None)',
  returns:   { type: 'timezone', desc: 'A tzinfo whose utcoffset() is always `offset` and whose dst() is always None.' },

  category:    'datetime class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The built-in tzinfo for fixed offsets. It knows nothing about daylight saving: +01:00 is +01:00 all year. For real regional zones (Europe/Paris) use the separate zoneinfo module.',

  covers: ['timezone'],

  cheat: {
    commonCall: 'timezone(timedelta(hours=-5))',
    returns:    'datetime.timezone(datetime.timedelta(days=-1, seconds=68400))',
    replaces:   'pytz.FixedOffset and hand-written tzinfo subclasses for offsets',
    watchOut:   'Fixed: no DST. Offsets must be strictly within ±24 h',
  },

  parameters: [
    { name: 'offset', type: 'timedelta', required: true,  default: null,   desc: 'The UTC offset, strictly between -timedelta(hours=24) and timedelta(hours=24). Seconds and microseconds are allowed (3.7+).' },
    { name: 'name',   type: 'str',       required: false, default: 'None', desc: "What tzname() and %Z return. Without it the name is generated: 'UTC+05:30', or 'UTC' for a zero offset." },
  ],

  modes: [
    {
      id: 'offset',
      label: 'build',
      blurb: 'An offset in hours and minutes. repr() shows the normalized timedelta, str() the generated name.',
      params: [
        { name: 'hours',   type: 'int', hint: 'hours',   input: 'number' },
        { name: 'minutes', type: 'int', hint: 'minutes', input: 'number' },
      ],
      template: 'from datetime import timedelta, timezone\ntz = timezone(timedelta(hours={$hours}, minutes={$minutes}))\n(tz, str(tz))',
      cases: [
        { id: 'india', label: '+05:30',     values: { hours: '5', minutes: '30' } },
        { id: 'ny',    label: '-05:00',     values: { hours: '-5', minutes: '0' } },
        { id: 'zero',  label: 'zero → utc', values: { hours: '0', minutes: '0' } },
        { id: 'toobig', label: '24 hours',  values: { hours: '24', minutes: '0' } },
      ],
    },
    {
      id: 'convert',
      label: 'convert',
      blurb: 'Show one instant at another offset. Naive input is labelled UTC first, so the result never depends on the machine.',
      params: [
        { name: 'when',  type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'hours', type: 'int', hint: 'target offset in hours', input: 'number' },
      ],
      template: 'from datetime import datetime, timedelta, timezone\ndt = datetime.fromisoformat({$when})\nif dt.tzinfo is None:\n    dt = dt.replace(tzinfo=timezone.utc)  # treat naive input as UTC\ndt.astimezone(timezone(timedelta(hours={$hours}))).isoformat()',
      cases: [
        { id: 'toeast',  label: 'UTC → +09:00',   values: { when: '2026-09-29T12:00Z', hours: '9' } },
        { id: 'towest',  label: 'crosses midnight', values: { when: '2026-09-29T23:00+00:00', hours: '-7' } },
        { id: 'between', label: '+02:00 → -03:00', values: { when: '2026-09-29T08:30+02:00', hours: '-3' } },
        { id: 'naive',   label: 'naive input',     values: { when: '2026-09-29T12:00', hours: '1' } },
      ],
    },
    {
      id: 'named',
      label: 'name',
      blurb: 'A name only changes tzname() and %Z — not the offset, not equality.',
      params: [
        { name: 'hours', type: 'int', hint: 'offset in hours', input: 'number' },
        { name: 'name',  type: 'str', hint: 'a zone name',     input: 'text' },
      ],
      template: "from datetime import datetime, timedelta, timezone\ntz = timezone(timedelta(hours={$hours}), {$name})\n(datetime(2026, 9, 29, 12, tzinfo=tz).strftime('%H:%M %Z %z'), tz == timezone(timedelta(hours={$hours})))",
      cases: [
        { id: 'cet',   label: 'CET',   values: { hours: '1', name: 'CET' } },
        { id: 'utc',   label: 'UTC',   values: { hours: '0', name: 'UTC' } },
        { id: 'wrong', label: 'a misleading name', values: { hours: '3', name: 'PST' } },
      ],
    },
  ],
  demoExplainer: 'A zero offset with no name gives back the timezone.utc singleton, so its repr is datetime.timezone.utc. Converting keeps the instant: 23:00 UTC shown at -07:00 is 16:00 the same day, at +09:00 it would already be the next day. The name is a free-form label — timezone(timedelta(hours=3), "PST") is accepted and compares equal to any other +03:00.',

  patterns: [
    {
      name: 'Parse, then show in a fixed offset',
      desc: 'Aware input converts directly with astimezone.',
      code: "from datetime import datetime, timedelta, timezone\nist = timezone(timedelta(hours=5, minutes=30), 'IST')\nlocal = datetime.fromisoformat('2026-09-29T12:00Z').astimezone(ist)",
    },
    {
      name: 'Real zones with DST',
      desc: 'zoneinfo (Python 3.9+) gives a tzinfo that knows each region\'s rules.',
      code: "from datetime import datetime\nfrom zoneinfo import ZoneInfo\nparis = datetime(2026, 7, 1, 12, tzinfo=ZoneInfo('Europe/Paris'))",
    },
    {
      name: 'Offset from an integer of minutes',
      desc: 'e.g. a browser getTimezoneOffset() value (note its sign is inverted).',
      code: 'from datetime import timedelta, timezone\ntz = timezone(timedelta(minutes=-js_offset_minutes))',
    },
  ],

  examples: [
    { title: 'A fixed offset',                code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=5, minutes=30))', returns: 'datetime.timezone(datetime.timedelta(seconds=19800))' },
    { title: 'Negative offsets use days=-1',  code: 'from datetime import timedelta, timezone\ntz = timezone(timedelta(hours=-5))\n(tz, str(tz))', returns: "(datetime.timezone(datetime.timedelta(days=-1, seconds=68400)), 'UTC-05:00')" },
    { title: 'A zero offset IS timezone.utc', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(0)) is timezone.utc', returns: 'True' },
    { title: 'Convert with astimezone',       code: "from datetime import datetime, timedelta, timezone, UTC\nist = timezone(timedelta(hours=5, minutes=30), 'IST')\ndatetime(2026, 9, 29, 12, tzinfo=UTC).astimezone(ist)", returns: "datetime.datetime(2026, 9, 29, 17, 30, tzinfo=datetime.timezone(datetime.timedelta(seconds=19800), 'IST'))" },
    { title: 'The name feeds %Z',             code: "from datetime import datetime, timedelta, timezone\nist = timezone(timedelta(hours=5, minutes=30), 'IST')\ndatetime(2026, 9, 29, 12, tzinfo=ist).strftime('%H:%M %Z %z')", returns: "'12:00 IST +0530'" },
    { title: 'Equality ignores the name',     code: "from datetime import timedelta, timezone\ntimezone(timedelta(hours=1)) == timezone(timedelta(hours=1), 'CET')", returns: 'True' },
    { title: 'No DST — dst() is None',        code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=2)).dst(None) is None', returns: 'True' },
    { title: 'Cannot be subclassed',          code: 'from datetime import timezone\nclass MyZone(timezone):\n    pass', returns: "TypeError: type 'datetime.timezone' is not an acceptable base type" },
  ],

  pitfalls: [
    {
      name: 'An int instead of a timedelta',
      desc: 'The offset must be a timedelta, not hours as a number.',
      wrong: { label: 'timezone(-5)', code: 'from datetime import timezone\ntimezone(-5)', output: 'TypeError: timezone() argument 1 must be datetime.timedelta, not int' },
      fix:   { label: 'timedelta(hours=-5)', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=-5))', output: 'datetime.timezone(datetime.timedelta(days=-1, seconds=68400))' },
    },
    {
      name: 'Using a fixed offset for a region with DST',
      desc: 'Paris is +01:00 in winter and +02:00 in summer. A timezone(timedelta(hours=1)) is wrong for half the year — the zoneinfo module knows the rules.',
      wrong: { label: 'fixed +01:00 in July', code: "from datetime import datetime, timedelta, timezone\ndatetime(2026, 7, 1, 12, tzinfo=timezone(timedelta(hours=1))).isoformat()", output: "'2026-07-01T12:00:00+01:00'" },
      fix:   { label: 'the summer offset', code: "from datetime import datetime, timedelta, timezone\ndatetime(2026, 7, 1, 12, tzinfo=timezone(timedelta(hours=2))).isoformat()", output: "'2026-07-01T12:00:00+02:00'" },
    },
    {
      name: 'Offsets of a day or more',
      desc: 'Real offsets run from -12:00 to +14:00; the class allows anything strictly inside ±24 hours.',
      wrong: { label: '24 hours', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=24))', output: 'ValueError: offset must be a timedelta strictly between -timedelta(hours=24) and timedelta(hours=24), not datetime.timedelta(days=1).' },
      fix:   { label: 'within range', code: 'from datetime import timedelta, timezone\ntimezone(timedelta(hours=14))', output: 'datetime.timezone(datetime.timedelta(seconds=50400))' },
    },
  ],

  when: {
    use: [
      'UTC (timezone.utc or its alias UTC) — the right tzinfo for stored timestamps',
      'Offsets that really are fixed: parsed from ISO text, from an API, or a fixed business rule',
    ],
    avoid: [
      'Regions with daylight saving time → zoneinfo.ZoneInfo("Europe/Paris")',
      'Custom rules → subclass tzinfo (timezone itself cannot be subclassed)',
    ],
  },

  notes: {
    cpython:       'PyDateTime_TimeZone in Modules/_datetimemodule.c; timezone(timedelta(0)) without a name returns the timezone.utc singleton',
    'Range':       'timezone.min is -23:59 and timezone.max is +23:59; the constructor accepts anything strictly inside ±24 hours',
    'Methods':     'utcoffset(dt) → offset, dst(dt) → None, tzname(dt) → name or generated UTC±HH:MM, fromutc(dt) → dt + offset',
    'Equality':    'Two timezone objects are equal when their offsets are equal; the name is ignored',
  },

  related: [
    { name: 'UTC / timezone.utc', slug: 'utc', when: 'The zero-offset singleton' },
    { name: 'astimezone', slug: 'astimezone', when: 'Convert a datetime to another offset' },
    { name: 'tzinfo', slug: 'tzinfo', when: 'The abstract base, for custom rules' },
    { name: 'utcoffset / tzname / dst', slug: 'utcoffset-tzname-dst', when: 'Ask a datetime for its offset' },
    { name: 'min / max / resolution', slug: 'min-max-resolution', when: 'timezone.min and timezone.max' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I create a timezone with a UTC offset in Python?',
      a: 'timezone(timedelta(hours=5, minutes=30)) for +05:30, timezone(timedelta(hours=-5)) for -05:00, and timezone.utc (or UTC on 3.11+) for zero. Pass it as tzinfo= when building a datetime, or to astimezone() to convert.',
    },
    {
      q: 'What is the difference between timezone and zoneinfo?',
      a: 'timezone is one fixed offset, forever. zoneinfo.ZoneInfo("America/New_York") is a named region whose offset changes with daylight saving and history, read from the IANA tz database. Both are tzinfo objects and plug into the same datetime methods.',
    },
    {
      q: 'Why is timezone(timedelta(hours=-5)) printed with days=-1?',
      a: 'The offset is a timedelta, and a negative timedelta is normalized as -1 day plus a positive number of seconds: -5 hours = -1 day + 68400 seconds. str(tz) shows the friendly form, UTC-05:00.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#timezone-objects',
    meta:  'timezone objects',
  },
};
