// content/reference/python/stdlib/datetime/tzinfo.js
// the tzinfo abstract base class, plus tzinfo.fromutc / timezone.fromutc

export const meta = {
  slug:        'tzinfo',
  name:        'datetime.tzinfo',
  signature:   'class MyZone(tzinfo): …',
  blurb:       'The abstract base class for time zone rules. Subclass it and implement utcoffset, dst and tzname; fromutc turns a UTC reading into local time.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'tzinfo abstract base class subclass tzinfo custom timezone python tzinfo.fromutc timezone.fromutc fromutc utcoffset dst tzname a tzinfo subclass must implement utcoffset NotImplementedError dt.tzinfo is not self',
};

export const method = {
  slug:      'tzinfo',
  name:      'datetime.tzinfo',
  signature: 'class MyZone(tzinfo): …',
  returns:   { type: 'tzinfo', desc: 'Instances are passed as tzinfo= to datetime and time; the datetime calls back into them.' },

  category:    'datetime class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'You rarely instantiate tzinfo yourself — timezone and zoneinfo.ZoneInfo are ready-made subclasses. Write one only for rules neither can express. fromutc is the hook astimezone() uses to go from UTC to local time.',

  covers: ['tzinfo', 'tzinfo.fromutc', 'timezone.fromutc'],

  cheat: {
    commonCall: 'tz.fromutc(utc_dt.replace(tzinfo=tz))',
    returns:    'the same instant as local wall time, tzinfo=tz',
    replaces:   'Offset arithmetic scattered through the code',
    watchOut:   'The base methods raise NotImplementedError; fromutc requires dt.tzinfo is self',
  },

  parameters: [
    { name: 'dt', type: 'datetime | None', required: true, default: null, desc: 'utcoffset/dst/tzname receive the datetime being asked about (None when called from a time). fromutc receives a datetime whose fields are UTC and whose tzinfo is self.' },
  ],

  attributes: [
    { name: 'utcoffset(dt)', type: 'timedelta | None', meaning: 'Total offset from UTC, DST included; strictly within ±24 h. None means "unknown" and makes the datetime naive.' },
    { name: 'dst(dt)',       type: 'timedelta | None', meaning: 'The DST part of that offset (timedelta(0) outside DST). Used by timetuple() for tm_isdst and by the default fromutc().' },
    { name: 'tzname(dt)',    type: 'str | None',       meaning: 'A display name such as "CEST" — what %Z prints.' },
    { name: 'fromutc(dt)',   type: 'datetime',         meaning: 'Given dt with UTC fields and tzinfo=self, return the local equivalent. The base version uses utcoffset() and dst(); timezone overrides it with dt + offset.' },
  ],

  modes: [
    {
      id: 'subclass',
      label: 'subclass',
      blurb: 'A minimal fixed-rule tzinfo. The datetime calls utcoffset and tzname on it whenever it needs them.',
      params: [
        { name: 'hours', type: 'int', hint: 'offset in hours', input: 'number' },
        { name: 'name',  type: 'str', hint: 'a zone name',     input: 'text' },
      ],
      template: 'from datetime import datetime, timedelta, timezone, tzinfo\nclass Fixed(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours={$hours})\n    def tzname(self, dt):\n        return {$name}\n    def dst(self, dt):\n        return timedelta(0)\ndt = datetime(2026, 9, 29, 12, tzinfo=Fixed())\n(dt.isoformat(), dt.tzname(), dt.astimezone(timezone.utc).isoformat())',
      cases: [
        { id: 'msk',   label: '+3 MSK',    values: { hours: '3', name: 'MSK' } },
        { id: 'west',  label: '-8 PST',    values: { hours: '-8', name: 'PST' } },
        { id: 'toobig', label: '+30 hours', values: { hours: '30', name: 'XYZ' } },
      ],
    },
    {
      id: 'fromutc',
      label: 'fromutc',
      blurb: 'fromutc reads the fields as UTC and returns local time in the same zone — the second half of astimezone().',
      params: [
        { name: 'when',  type: 'str', hint: 'UTC wall time, no offset', input: 'text' },
        { name: 'hours', type: 'int', hint: 'zone offset in hours',     input: 'number' },
      ],
      template: 'from datetime import datetime, timedelta, timezone\ntz = timezone(timedelta(hours={$hours}))\nutc_fields = datetime.fromisoformat({$when}).replace(tzinfo=tz)\ntz.fromutc(utc_fields).isoformat()',
      cases: [
        { id: 'east',  label: '+2',            values: { when: '2026-09-29T12:00', hours: '2' } },
        { id: 'west',  label: '-5, day before', values: { when: '2026-09-29T02:00', hours: '-5' } },
        { id: 'edge',  label: 'past 9999',     values: { when: '9999-12-31T23:00', hours: '2' } },
      ],
    },
  ],
  demoExplainer: 'Nothing is checked when the datetime is created — the offset is validated when something asks for it (here isoformat()), so +30 hours fails with "offset must be a timedelta strictly between ...". fromutc simply adds the offset for a timezone, which is why 23:00 UTC on 9999-12-31 at +02:00 overflows.',

  patterns: [
    {
      name: 'Minimal fixed-offset subclass',
      desc: 'What timezone does for you — shown for the protocol.',
      code: 'from datetime import timedelta, tzinfo\n\nclass Fixed(tzinfo):\n    def __init__(self, hours, name):\n        self._offset = timedelta(hours=hours)\n        self._name = name\n    def utcoffset(self, dt):\n        return self._offset\n    def dst(self, dt):\n        return timedelta(0)\n    def tzname(self, dt):\n        return self._name',
    },
    {
      name: 'Accept any tzinfo in an API',
      desc: 'timezone, ZoneInfo and custom subclasses are all tzinfo instances.',
      code: 'from datetime import tzinfo\ndef localize(dt, tz):\n    if not isinstance(tz, tzinfo):\n        raise TypeError("tz must be a tzinfo")\n    return dt.astimezone(tz)',
    },
  ],

  examples: [
    { title: 'A custom subclass in use',   code: "from datetime import datetime, timedelta, timezone, tzinfo\nclass Fixed(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours=3)\n    def tzname(self, dt):\n        return 'MSK'\n    def dst(self, dt):\n        return timedelta(0)\ndt = datetime(2026, 9, 29, 12, tzinfo=Fixed())\n(dt.isoformat(), dt.tzname(), dt.astimezone(timezone.utc).isoformat())", returns: "('2026-09-29T12:00:00+03:00', 'MSK', '2026-09-29T09:00:00+00:00')" },
    { title: 'The base class is abstract', code: 'from datetime import tzinfo\ntzinfo().utcoffset(None)', returns: 'NotImplementedError: a tzinfo subclass must implement utcoffset()' },
    { title: 'timezone is a tzinfo',       code: 'from datetime import tzinfo, UTC\nisinstance(UTC, tzinfo)', returns: 'True' },
    { title: 'timezone.fromutc adds the offset', code: "from datetime import datetime, timedelta, timezone\ntz = timezone(timedelta(hours=2))\ntz.fromutc(datetime(2026, 9, 29, 12, tzinfo=tz))", returns: 'datetime.datetime(2026, 9, 29, 14, 0, tzinfo=datetime.timezone(datetime.timedelta(seconds=7200)))' },
    { title: 'fromutc insists on its own tzinfo', code: 'from datetime import datetime, timedelta, timezone\ntz = timezone(timedelta(hours=2))\ntz.fromutc(datetime(2026, 9, 29, 12))', returns: 'ValueError: fromutc: dt.tzinfo is not self' },
    { title: 'Bad return types are caught', code: 'from datetime import datetime, tzinfo\nclass Broken(tzinfo):\n    def utcoffset(self, dt):\n        return 3\ndatetime(2026, 9, 29, tzinfo=Broken()).utcoffset()', returns: "TypeError: tzinfo.utcoffset() must return None or timedelta, not 'int'" },
  ],

  pitfalls: [
    {
      name: 'Calling fromutc with another instance',
      desc: 'The check is identity (is), not equality: a second Fixed() is a different object.',
      wrong: { label: 'new instance', code: 'from datetime import datetime, timedelta, tzinfo\nclass Fixed(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours=3)\n    def dst(self, dt):\n        return timedelta(0)\nFixed().fromutc(datetime(2026, 9, 29, 9, tzinfo=Fixed()))', output: 'ValueError: fromutc: dt.tzinfo is not self' },
      fix:   { label: 'same object', code: 'from datetime import datetime, timedelta, tzinfo\nclass Fixed(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours=3)\n    def dst(self, dt):\n        return timedelta(0)\ntz = Fixed()\ntz.fromutc(datetime(2026, 9, 29, 9, tzinfo=tz)).hour', output: '12' },
    },
    {
      name: 'Leaving dst() unimplemented',
      desc: 'timetuple() — and therefore strftime() — asks for dst(). Implement all three methods even if dst is always timedelta(0).',
      wrong: { label: 'no dst()', code: "from datetime import datetime, timedelta, tzinfo\nclass Half(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours=1)\n    def tzname(self, dt):\n        return 'X'\ndatetime(2026, 9, 29, tzinfo=Half()).strftime('%Z')", output: 'NotImplementedError: a tzinfo subclass must implement dst()' },
      fix:   { label: 'with dst()', code: "from datetime import datetime, timedelta, tzinfo\nclass Whole(tzinfo):\n    def utcoffset(self, dt):\n        return timedelta(hours=1)\n    def tzname(self, dt):\n        return 'X'\n    def dst(self, dt):\n        return timedelta(0)\ndatetime(2026, 9, 29, tzinfo=Whole()).strftime('%Z')", output: "'X'" },
    },
  ],

  when: {
    use: [
      'Type hints and isinstance checks for "any time zone object"',
      'Rules neither timezone (fixed) nor zoneinfo (IANA database) can express',
    ],
    avoid: [
      'Fixed offsets → timezone',
      'Real-world regions → zoneinfo.ZoneInfo',
      'Writing your own DST rules for real regions — they change by law; use the tz database',
    ],
  },

  notes: {
    cpython:      'tzinfo is a C type in Modules/_datetimemodule.c; its utcoffset/dst/tzname raise NotImplementedError, fromutc implements the documented algorithm',
    'Validation': 'utcoffset() and dst() results are checked each time they are used: None or a timedelta strictly within ±24 h',
    'Identity':   'astimezone(tz) returns self unchanged when self.tzinfo is tz; fromutc requires dt.tzinfo is self',
    'Pickling':   'A subclass needs an __init__ that can be called with no arguments (or a __reduce__) to be picklable',
  },

  related: [
    { name: 'timezone', slug: 'timezone', when: 'The built-in fixed-offset subclass' },
    { name: 'utcoffset / tzname / dst', slug: 'utcoffset-tzname-dst', when: 'The same methods called on a datetime' },
    { name: 'astimezone', slug: 'astimezone', when: 'Uses fromutc under the hood' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'What the abstract methods raise', category: 'exceptions' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I create a custom timezone in Python?',
      a: 'For a fixed offset use timezone(timedelta(hours=...), name) — no subclass needed. For a region use zoneinfo.ZoneInfo("Europe/Berlin"). Subclass tzinfo only for custom rules, implementing utcoffset, dst and tzname.',
    },
    {
      q: 'What does fromutc do?',
      a: 'It converts a datetime whose fields hold UTC time (and whose tzinfo is this zone) into the zone\'s local time. astimezone(tz) calls it after moving the value to UTC; you rarely call it directly.',
    },
    {
      q: 'Why does my tzinfo subclass raise NotImplementedError?',
      a: 'A method you did not override was called: the base tzinfo implements none of utcoffset, dst and tzname. strftime and timetuple call dst(), isoformat calls utcoffset(), %Z calls tzname().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#tzinfo-objects',
    meta:  'tzinfo objects',
  },
};
