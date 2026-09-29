// content/reference/python/stdlib/datetime/utc.js — datetime.UTC and timezone.utc

export const meta = {
  slug:        'utc',
  name:        'datetime.UTC / timezone.utc',
  signature:   'UTC',
  blurb:       'The UTC time zone object — one singleton with two names: timezone.utc (3.2+) and the module-level alias UTC (3.11+).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.2+ (UTC alias 3.11+)',
  searchTerms: 'UTC timezone.utc datetime.UTC utc timezone python aware utc datetime now utc tzinfo utc singleton Z +00:00',
};

export const method = {
  slug:      'utc',
  name:      'datetime.UTC / timezone.utc',
  signature: 'UTC',
  returns:   { type: 'timezone', desc: 'timezone(timedelta(0)) — the very same object under both names.' },

  category:    'datetime constant',
  version:     'Python 3.2+ (UTC alias 3.11+)',
  hasLiveDemo: true,

  subtitle: 'The tzinfo you should reach for first. UTC is timezone.utc (the same object), its offset is zero, its name is "UTC", and fromisoformat returns it for Z, +00:00 and -00:00.',

  covers: ['UTC', 'timezone.utc'],

  cheat: {
    commonCall: 'datetime.now(UTC)',
    returns:    'an aware datetime with tzinfo=datetime.timezone.utc',
    replaces:   'datetime.utcnow() (naive, deprecated) and pytz.utc',
    watchOut:   'UTC needs Python 3.11+; use timezone.utc for older versions',
  },

  parameters: [],

  modes: [
    {
      id: 'attach',
      label: 'to UTC',
      blurb: 'Parse a timestamp and express it in UTC. Naive input is taken as UTC already (replace), aware input is converted (astimezone).',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime, UTC\ndt = datetime.fromisoformat({$when})\ndt = dt.replace(tzinfo=UTC) if dt.tzinfo is None else dt.astimezone(UTC)\n(dt.isoformat(), dt.tzinfo is UTC)',
      cases: [
        { id: 'offset', label: 'from +05:30',  values: { when: '2026-09-29T17:30+05:30' } },
        { id: 'naive',  label: 'naive',        values: { when: '2026-09-29T12:00' } },
        { id: 'zulu',   label: 'already Z',    values: { when: '2026-09-29T12:00Z' } },
      ],
    },
  ],
  demoExplainer: 'Every path ends at the same singleton, so dt.tzinfo is UTC is True. isoformat writes the zero offset as +00:00, never Z.',

  patterns: [
    {
      name: 'Current time in UTC',
      desc: 'The replacement for utcnow().',
      code: 'from datetime import datetime, UTC\nnow = datetime.now(UTC)',
    },
    {
      name: 'Works on 3.2 through 3.13',
      desc: 'timezone.utc is the same object under its older name.',
      code: 'from datetime import datetime, timezone\nnow = datetime.now(timezone.utc)',
    },
    {
      name: 'Normalize any aware value to UTC for storage',
      desc: 'astimezone(UTC) keeps the instant and makes offsets uniform.',
      code: 'from datetime import UTC\nstored = aware_dt.astimezone(UTC)',
    },
  ],

  examples: [
    { title: 'One object, two names',   code: 'from datetime import UTC, timezone\n(UTC, UTC is timezone.utc)', returns: '(datetime.timezone.utc, True)' },
    { title: 'Name and offset',         code: 'from datetime import UTC\n(str(UTC), UTC.utcoffset(None))', returns: "('UTC', datetime.timedelta(0))" },
    { title: 'An aware UTC datetime',   code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12, tzinfo=UTC).isoformat()', returns: "'2026-09-29T12:00:00+00:00'" },
    { title: 'Z parses to this object', code: "from datetime import datetime, UTC\ndatetime.fromisoformat('2026-09-29T12:00Z').tzinfo is UTC", returns: 'True' },
    { title: 'So does timezone(timedelta(0))', code: 'from datetime import timedelta, timezone, UTC\ntimezone(timedelta(0)) is UTC', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Confusing "UTC fields" with "aware UTC"',
      desc: 'A naive datetime holding UTC numbers is still naive: comparing it with an aware value fails. Attach UTC explicitly.',
      wrong: { label: 'naive', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12) < datetime(2026, 9, 29, 13, tzinfo=UTC)', output: "TypeError: can't compare offset-naive and offset-aware datetimes" },
      fix:   { label: 'replace(tzinfo=UTC)', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12).replace(tzinfo=UTC) < datetime(2026, 9, 29, 13, tzinfo=UTC)', output: 'True' },
    },
    {
      name: 'replace(tzinfo=UTC) on a value from another zone',
      desc: 'replace relabels without converting — the instant moves. For an aware value use astimezone.',
      wrong: { label: 'replace', code: "from datetime import datetime, UTC\ndatetime.fromisoformat('2026-09-29T17:30+05:30').replace(tzinfo=UTC).isoformat()", output: "'2026-09-29T17:30:00+00:00'" },
      fix:   { label: 'astimezone', code: "from datetime import datetime, UTC\ndatetime.fromisoformat('2026-09-29T17:30+05:30').astimezone(UTC).isoformat()", output: "'2026-09-29T12:00:00+00:00'" },
    },
  ],

  when: {
    use: [
      'Timestamps you store, log, compare or send over a network',
      'The tz argument of now(), fromtimestamp() and astimezone()',
    ],
    avoid: [
      'Displaying local time to a user → convert with astimezone(their zone) at the edge',
    ],
  },

  notes: {
    cpython:    'A static singleton created when _datetime is imported; datetime.UTC was added in 3.11 as a plain alias',
    'Identity':  'timezone(timedelta(0)) without a name, and fromisoformat for Z / +00:00 / -00:00, all return this same object',
    'Named zero': 'timezone(timedelta(0), "UTC") is a DIFFERENT object that compares equal',
  },

  related: [
    { name: 'timezone', slug: 'timezone', when: 'Other fixed offsets' },
    { name: 'today / now / utcnow', slug: 'today-now', when: 'datetime.now(UTC)' },
    { name: 'astimezone', slug: 'astimezone', when: 'Convert to and from UTC' },
    { name: 'datetime', slug: 'datetime', when: 'Naive vs aware' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between datetime.UTC and timezone.utc?',
      a: 'None — UTC is an alias added in Python 3.11, and UTC is timezone.utc is True. Use timezone.utc if your code must run on 3.10 or older.',
    },
    {
      q: 'How do I get the current UTC time in Python?',
      a: 'datetime.now(UTC) — an aware datetime. datetime.utcnow() returns the same numbers but naive, and is deprecated since Python 3.12.',
    },
    {
      q: 'Why does isoformat() write +00:00 instead of Z?',
      a: 'isoformat always writes the numeric offset. If you need Z, replace it: dt.isoformat().replace("+00:00", "Z"). fromisoformat reads both on Python 3.11+.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.UTC',
    meta:  'datetime.UTC',
  },
};
