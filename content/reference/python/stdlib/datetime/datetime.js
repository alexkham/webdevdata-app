// content/reference/python/stdlib/datetime/datetime.js — the datetime class

export const meta = {
  slug:        'datetime',
  name:        'datetime.datetime',
  signature:   'datetime(year, month, day, hour=0, minute=0, second=0, microsecond=0, tzinfo=None, *, fold=0)',
  blurb:       'A date plus a time of day, optionally tied to a UTC offset. Naive without tzinfo, aware with one — and the two do not mix.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'datetime class python datetime object naive aware offset-naive offset-aware can\'t compare offset-naive and offset-aware datetimes can\'t subtract timezone aware datetime constructor',
};

export const method = {
  slug:      'datetime',
  name:      'datetime.datetime',
  signature: 'datetime(year, month, day, hour=0, minute=0, second=0, microsecond=0, tzinfo=None, *, fold=0)',
  returns:   { type: 'datetime', desc: 'An immutable date-and-time value; a subclass of date.' },

  category:    'datetime class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The workhorse class. Every field is validated on construction, every operation returns a new object, and one question decides how it behaves: does it have a tzinfo (aware) or not (naive)?',

  covers: ['datetime'],

  cheat: {
    commonCall: 'datetime(2026, 9, 29, 14, 30, tzinfo=UTC)',
    returns:    'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)',
    replaces:   'Separate date and time variables; epoch integers',
    watchOut:   'naive < aware raises TypeError; naive == aware is just False',
  },

  parameters: [
    { name: 'year',        type: 'int', required: true,  default: null,   desc: 'MINYEAR (1) to MAXYEAR (9999).' },
    { name: 'month',       type: 'int', required: true,  default: null,   desc: '1 to 12.' },
    { name: 'day',         type: 'int', required: true,  default: null,   desc: '1 to the number of days in that month and year.' },
    { name: 'hour',        type: 'int', required: false, default: '0',    desc: '0 to 23.' },
    { name: 'minute',      type: 'int', required: false, default: '0',    desc: '0 to 59.' },
    { name: 'second',      type: 'int', required: false, default: '0',    desc: '0 to 59 — no leap seconds.' },
    { name: 'microsecond', type: 'int', required: false, default: '0',    desc: '0 to 999999.' },
    { name: 'tzinfo',      type: 'tzinfo | None', required: false, default: 'None', desc: 'None makes a naive datetime; timezone.utc, a timezone(offset) or a zoneinfo.ZoneInfo makes it aware.' },
    { name: 'fold',        type: 'int', required: false, default: '0',    desc: 'Keyword-only, 0 or 1: which of two identical wall times during a DST fall-back is meant.' },
  ],

  modes: [
    {
      id: 'construct',
      label: 'construct',
      blurb: 'Every field is range-checked, in order: year, month, day, hour, minute.',
      params: [
        { name: 'year',   type: 'int', hint: 'year',   input: 'number' },
        { name: 'month',  type: 'int', hint: 'month',  input: 'number' },
        { name: 'day',    type: 'int', hint: 'day',    input: 'number' },
        { name: 'hour',   type: 'int', hint: 'hour',   input: 'number' },
        { name: 'minute', type: 'int', hint: 'minute', input: 'number' },
      ],
      template: 'from datetime import datetime\ndatetime({$year}, {$month}, {$day}, {$hour}, {$minute})',
      cases: [
        { id: 'ok',     label: 'valid',        values: { year: '2026', month: '9', day: '29', hour: '14', minute: '30' } },
        { id: 'leap',   label: '29 Feb 2028',  values: { year: '2028', month: '2', day: '29', hour: '0', minute: '0' } },
        { id: 'feb',    label: '29 Feb 2026',  values: { year: '2026', month: '2', day: '29', hour: '0', minute: '0' } },
        { id: 'hour24', label: 'hour 24',      values: { year: '2026', month: '9', day: '29', hour: '24', minute: '0' } },
        { id: 'year0',  label: 'year 0',       values: { year: '0', month: '1', day: '1', hour: '0', minute: '0' } },
      ],
    },
    {
      id: 'compare',
      label: 'naive vs aware',
      blurb: 'Two timestamps: == and <. Leave the offset off one of them to see the difference between equality and ordering.',
      params: [
        { name: 'a', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'b', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
      ],
      template: 'from datetime import datetime\na = datetime.fromisoformat({$a})\nb = datetime.fromisoformat({$b})\n(a == b, a < b)',
      cases: [
        { id: 'same',   label: 'same instant',   values: { a: '2026-09-29T12:00+02:00', b: '2026-09-29T10:00Z' } },
        { id: 'naive',  label: 'both naive',     values: { a: '2026-09-29T12:00', b: '2026-09-29T13:00' } },
        { id: 'mixed',  label: 'naive vs aware', values: { a: '2026-09-29T12:00', b: '2026-09-29T12:00Z' } },
      ],
    },
    {
      id: 'subtract',
      label: 'subtract',
      blurb: 'datetime - datetime is a timedelta. Aware values are compared in UTC; naive and aware cannot be subtracted.',
      params: [
        { name: 'a', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'b', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
      ],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$a}) - datetime.fromisoformat({$b})',
      cases: [
        { id: 'naive',  label: 'naive',            values: { a: '2026-09-29T18:00', b: '2026-09-28T09:15' } },
        { id: 'zones',  label: 'different offsets', values: { a: '2026-09-29T18:00+02:00', b: '2026-09-29T09:00-05:00' } },
        { id: 'mixed',  label: 'naive - aware',     values: { a: '2026-09-29T18:00', b: '2026-09-29T09:00Z' } },
      ],
    },
  ],
  demoExplainer: '12:00+02:00 and 10:00Z are the same instant, so they compare equal even though the fields differ. A naive datetime has no instant at all, so == quietly answers False while < raises TypeError: can\'t compare offset-naive and offset-aware datetimes — the tuple never gets built.',

  patterns: [
    {
      name: 'Aware from the start',
      desc: 'Create datetimes with tzinfo and they compare and subtract correctly everywhere.',
      code: 'from datetime import datetime, UTC\ncreated = datetime.now(UTC)\ndeadline = datetime(2026, 12, 31, 23, 59, tzinfo=UTC)',
    },
    {
      name: 'Label a naive value you know is UTC',
      desc: 'replace(tzinfo=...) attaches a zone without changing the fields.',
      code: 'from datetime import UTC\naware = naive_from_db.replace(tzinfo=UTC)',
    },
    {
      name: 'Is it aware?',
      desc: 'The documented test: tzinfo set AND utcoffset() not None.',
      code: 'def is_aware(dt):\n    return dt.tzinfo is not None and dt.utcoffset() is not None',
    },
  ],

  examples: [
    { title: 'Naive',                          code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30)', returns: 'datetime.datetime(2026, 9, 29, 14, 30)' },
    { title: 'Aware',                          code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 14, 30, tzinfo=UTC)', returns: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)' },
    { title: 'Time fields default to midnight', code: 'from datetime import datetime\ndatetime(2026, 9, 29)', returns: 'datetime.datetime(2026, 9, 29, 0, 0)' },
    { title: 'Day is required',                code: 'from datetime import datetime\ndatetime(2026, 9)', returns: "TypeError: function missing required argument 'day' (pos 3)" },
    { title: 'Same instant, different offsets', code: 'from datetime import datetime, timedelta, timezone, UTC\na = datetime(2026, 9, 29, 12, tzinfo=timezone(timedelta(hours=2)))\nb = datetime(2026, 9, 29, 10, tzinfo=UTC)\n(a == b, a - b, len({a, b}))', returns: '(True, datetime.timedelta(0), 1)' },
    { title: 'A datetime is a date',           code: 'from datetime import date, datetime\nisinstance(datetime(2026, 9, 29), date)', returns: 'True' },
    { title: '...but never equal to one',      code: 'from datetime import date, datetime\ndatetime(2026, 9, 29) == date(2026, 9, 29)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Subtracting naive from aware',
      desc: 'Common when one value comes from datetime.now(UTC) and the other from a database or strptime without %z.',
      wrong: { label: 'naive - aware', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12) - datetime(2026, 9, 29, 12, tzinfo=UTC)', output: "TypeError: can't subtract offset-naive and offset-aware datetimes" },
      fix:   { label: 'attach the zone', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12).replace(tzinfo=UTC) - datetime(2026, 9, 29, 10, tzinfo=UTC)', output: 'datetime.timedelta(seconds=7200)' },
    },
    {
      name: 'Sorting a list that mixes both kinds',
      desc: 'sort() uses <, so one naive value in a list of aware ones breaks the whole sort.',
      wrong: { label: 'mixed list', code: 'from datetime import datetime, UTC\nsorted([datetime(2026, 9, 29, 12, tzinfo=UTC), datetime(2026, 9, 29, 12)])', output: "TypeError: can't compare offset-naive and offset-aware datetimes" },
      fix:   { label: 'normalize first', code: 'from datetime import datetime, UTC\nvalues = [datetime(2026, 9, 29, 12, tzinfo=UTC), datetime(2026, 9, 29, 11)]\nsorted(v if v.tzinfo else v.replace(tzinfo=UTC) for v in values)', output: '[datetime.datetime(2026, 9, 29, 11, 0, tzinfo=datetime.timezone.utc), datetime.datetime(2026, 9, 29, 12, 0, tzinfo=datetime.timezone.utc)]' },
    },
    {
      name: 'Silent False from ==',
      desc: 'Equality between naive and aware never raises — it is simply False, so a lookup or "if a == b" fails quietly.',
      wrong: { label: 'naive == aware', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12) == datetime(2026, 9, 29, 12, tzinfo=UTC)', output: 'False' },
      fix:   { label: 'both aware', code: 'from datetime import datetime, UTC\ndatetime(2026, 9, 29, 12, tzinfo=UTC) == datetime(2026, 9, 29, 12, tzinfo=UTC)', output: 'True' },
    },
  ],

  when: {
    use: [
      'A specific moment: event times, created_at / updated_at, deadlines',
      'Aware datetimes (UTC) for anything stored, compared across systems, or sent over the wire',
      'Naive datetimes only for purely local, single-machine wall-clock values',
    ],
    avoid: [
      'Just a calendar day → date',
      'Just a time of day → time',
      'A length of time → timedelta',
    ],
  },

  notes: {
    cpython:        'PyDateTime_DateTime in Modules/_datetimemodule.c; fields packed into 10 bytes plus the tzinfo pointer and the fold flag',
    'Naive/aware':  'Aware = tzinfo is not None and tzinfo.utcoffset(dt) is not None; everything else is naive',
    'Comparison':   'Aware values compare by instant (UTC); naive by fields; mixing them: == False, != True, < <= > >= TypeError',
    'Hashing':      'Equal aware values hash equally regardless of offset, so a set keeps one of them',
  },

  related: [
    { name: 'timezone', slug: 'timezone', when: 'Fixed-offset tzinfo to make values aware' },
    { name: 'astimezone', slug: 'astimezone', when: 'Convert an aware value to another offset' },
    { name: 'replace', slug: 'replace', when: 'Attach or drop tzinfo' },
    { name: 'today / now', slug: 'today-now', when: 'The current datetime' },
    { name: 'date', slug: 'date', when: 'The base class' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between a naive and an aware datetime?',
      a: 'An aware datetime has a tzinfo that gives a UTC offset, so it names one exact instant. A naive datetime has tzinfo=None: just fields, which your code must interpret (as local time, or UTC by convention). Aware values can be compared across zones; naive ones cannot be compared with aware ones at all.',
    },
    {
      q: "How do I fix \"TypeError: can't compare offset-naive and offset-aware datetimes\"?",
      a: 'Make both sides aware. If the naive value is known to be UTC, use naive.replace(tzinfo=UTC); if it is local time, naive.astimezone() interprets it in the machine\'s zone. Better, produce aware values at the source (datetime.now(UTC), fromisoformat with an offset, strptime with %z).',
    },
    {
      q: 'Should I store datetimes in UTC?',
      a: 'Yes for anything that is stored, logged or exchanged: aware UTC values sort and subtract correctly and survive DST changes. Convert to a local zone only when displaying.',
    },
    {
      q: 'How do I check whether a datetime is aware?',
      a: 'dt.tzinfo is not None and dt.utcoffset() is not None. For timezone and zoneinfo objects the first test is enough, but a custom tzinfo may return None from utcoffset.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime-objects',
    meta:  'datetime objects',
  },
};
