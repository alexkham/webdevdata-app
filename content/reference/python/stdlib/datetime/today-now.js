// content/reference/python/stdlib/datetime/today-now.js
// date.today, datetime.now, datetime.utcnow (deprecated)

export const meta = {
  slug:        'today-now',
  name:        'date.today / datetime.now / utcnow',
  signature:   'datetime.now(tz=None)',
  blurb:       'The current date or date and time: date.today(), datetime.now(tz), and the deprecated naive datetime.utcnow().',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (utcnow deprecated 3.12)',
  searchTerms: 'date.today datetime.now datetime.utcnow today now utcnow current date current time python get current datetime utc now timezone aware now utcnow deprecated DeprecationWarning datetime.today',
};

export const method = {
  slug:      'today-now',
  name:      'date.today / datetime.now / utcnow',
  signature: 'datetime.now(tz=None)',
  returns:   { type: 'datetime', desc: 'now(): naive local time without tz, aware time in tz with it. date.today(): the local date. utcnow(): naive UTC fields.' },

  category:    'datetime class method',
  version:     'Python 2.3+ (utcnow deprecated 3.12)',
  hasLiveDemo: true,

  subtitle: 'Three ways to ask "what time is it?" — only one of them gives an unambiguous answer: datetime.now(UTC). utcnow() returns the same numbers without a tzinfo and has been deprecated since Python 3.12.',

  covers: ['date.today', 'datetime.now', 'datetime.utcnow'],

  cheat: {
    commonCall: 'datetime.now(UTC)',
    returns:    'an aware datetime, tzinfo=datetime.timezone.utc',
    replaces:   'datetime.utcnow() and time.time() for timestamps you keep',
    watchOut:   'now() without tz is naive LOCAL time — machine-dependent',
  },

  parameters: [
    { name: 'tz', type: 'tzinfo | None', required: false, default: 'None', desc: 'None: naive local wall time of the machine. A tzinfo (UTC, timezone(...), ZoneInfo): an aware datetime in that zone.' },
  ],

  modes: [
    {
      id: 'zone',
      label: 'now(tz)',
      blurb: 'The clock reading itself changes every run, so the demo shows only what now(tz) guarantees: the offset and name of the zone you passed.',
      params: [{ name: 'hours', type: 'int', hint: 'offset in hours', input: 'number' }],
      template: 'from datetime import datetime, timedelta, timezone\nnow = datetime.now(timezone(timedelta(hours={$hours})))\n(now.utcoffset(), now.tzname())',
      cases: [
        { id: 'utc',   label: 'UTC',   values: { hours: '0' } },
        { id: 'tokyo', label: '+9',    values: { hours: '9' } },
        { id: 'ny',    label: '-5',    values: { hours: '-5' } },
      ],
    },
  ],
  demoExplainer: 'Whatever the moment, now(tz) is aware and reports the zone it was given; timezone(timedelta(0)) is timezone.utc, named "UTC". The actual time value is left out on purpose: it changes every call and depends on the machine clock.',

  patterns: [
    {
      name: 'Timestamp for storage',
      desc: 'Aware, UTC, ISO text.',
      code: 'from datetime import datetime, UTC\ncreated_at = datetime.now(UTC).isoformat()',
    },
    {
      name: 'Local time for display',
      desc: 'astimezone() with no argument converts to the machine\'s local zone.',
      code: 'from datetime import datetime, UTC\nlocal = datetime.now(UTC).astimezone()',
    },
    {
      name: 'Today in a specific zone',
      desc: 'date.today() uses the machine zone; ask now(tz) and take .date() instead.',
      code: "from datetime import datetime\nfrom zoneinfo import ZoneInfo\ntoday_in_tokyo = datetime.now(ZoneInfo('Asia/Tokyo')).date()",
    },
    {
      name: 'Replacing utcnow()',
      desc: 'Same instant, but aware. Code comparing with naive values must be updated too.',
      code: 'from datetime import datetime, UTC\n# before: datetime.utcnow()\nnow = datetime.now(UTC)',
    },
  ],

  examples: [
    { title: 'now(UTC) is aware',              code: 'from datetime import datetime, UTC\ndatetime.now(UTC).tzinfo', returns: 'datetime.timezone.utc' },
    { title: 'now() is naive',                 code: 'from datetime import datetime\ndatetime.now().tzinfo is None', returns: 'True' },
    { title: 'today() returns a date',         code: 'from datetime import date\ntype(date.today()).__name__', returns: "'date'" },
    { title: 'utcnow() is deprecated (3.12+)', code: 'import warnings\nfrom datetime import datetime\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter("always")\n    datetime.utcnow()\n(caught[0].category.__name__, str(caught[0].message).split(" and ")[0])', returns: "('DeprecationWarning', 'datetime.datetime.utcnow() is deprecated')" },
    { title: 'tz must be a tzinfo',            code: 'from datetime import datetime\ndatetime.now(5)', returns: "TypeError: tzinfo argument must be None or of a tzinfo subclass, not type 'int'" },
    { title: 'date.today() takes no zone',     code: 'from datetime import date, UTC\ndate.today(UTC)', returns: 'TypeError: date.today() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'utcnow() gives a naive value',
      desc: 'The fields are UTC but tzinfo is None, so it compares wrongly (or not at all) against aware values — the reason it was deprecated in 3.12.',
      wrong: { label: 'utcnow()', code: 'import warnings\nfrom datetime import datetime\nwith warnings.catch_warnings():\n    warnings.simplefilter("ignore")\n    now = datetime.utcnow()\nnow.tzinfo is None', output: 'True' },
      fix:   { label: 'now(UTC)', code: 'from datetime import datetime, UTC\ndatetime.now(UTC).tzinfo is UTC', output: 'True' },
    },
    {
      name: 'Comparing now() with an aware value',
      desc: 'now() without tz is naive, so it cannot be ordered against parsed ISO timestamps that carry an offset.',
      wrong: { label: 'naive now()', code: "from datetime import datetime\ndatetime.now() < datetime.fromisoformat('2999-01-01T00:00Z')", output: "TypeError: can't compare offset-naive and offset-aware datetimes" },
      fix:   { label: 'now(UTC)', code: "from datetime import datetime, UTC\ndatetime.now(UTC) < datetime.fromisoformat('2999-01-01T00:00Z')", output: 'True' },
    },
  ],

  when: {
    use: [
      'datetime.now(UTC) for anything stored or compared',
      'date.today() for a local calendar date on a single machine (scripts, reports)',
    ],
    avoid: [
      'utcnow() → now(UTC)',
      'Measuring durations → time.perf_counter() (now() can jump when the clock is adjusted)',
      'Server code that must know the user\'s date → now(user_zone).date(), not date.today()',
    ],
  },

  notes: {
    cpython:        'now() reads the system clock at microsecond resolution and converts it with localtime(), or for a tz with gmtime() followed by tz.fromutc()',
    'Deprecation':  'utcnow() emits DeprecationWarning since 3.12: "datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC)."',
    'today()':      'datetime.today() is the same as datetime.now() without tz; date.today() takes no arguments',
  },

  related: [
    { name: 'UTC', slug: 'utc', when: 'The tz to pass' },
    { name: 'fromtimestamp', slug: 'fromtimestamp', when: 'The same conversion for a stored timestamp' },
    { name: 'astimezone', slug: 'astimezone', when: 'Show now() in another zone' },
    { name: 'datetime', slug: 'datetime', when: 'Naive vs aware' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is datetime.utcnow() deprecated?',
      a: 'It returns a naive datetime whose fields are UTC. Python treats naive values as local time in methods like timestamp() and astimezone(), so utcnow() results were silently misinterpreted. Since 3.12 it emits a DeprecationWarning; use datetime.now(UTC) (or now(timezone.utc) before 3.11).',
    },
    {
      q: 'What is the difference between datetime.now() and datetime.today()?',
      a: 'Called without arguments they return the same thing: the naive local date and time. now() also accepts a tz argument, today() does not.',
    },
    {
      q: 'How do I get today\'s date in Python?',
      a: 'date.today() for the machine\'s local date, or datetime.now(tz).date() for the date in a specific zone — useful on servers, where the machine zone is often UTC while users are elsewhere.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.now',
    meta:  'datetime.now',
  },
};
