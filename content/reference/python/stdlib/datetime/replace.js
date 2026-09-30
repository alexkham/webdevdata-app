// content/reference/python/stdlib/datetime/replace.js — date.replace / datetime.replace / time.replace

export const meta = {
  slug:        'replace',
  name:        'datetime.replace',
  signature:   'dt.replace(year=…, month=…, day=…, hour=…, minute=…, second=…, microsecond=…, tzinfo=…, *, fold=…)',
  blurb:       'Return a copy with some fields changed — the way to "set" the day, truncate to the minute, or attach and remove a tzinfo.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (fold 3.6+)',
  searchTerms: 'date.replace datetime.replace time.replace replace change day month year set time to midnight truncate seconds remove tzinfo make naive add tzinfo python copy.replace first day of month',
};

export const method = {
  slug:      'replace',
  name:      'datetime.replace',
  signature: 'dt.replace(year=…, month=…, day=…, hour=…, minute=…, second=…, microsecond=…, tzinfo=…, *, fold=…)',
  returns:   { type: 'date | datetime | time', desc: 'A new object of the same type; the original is unchanged.' },

  category:    'date / datetime / time method',
  version:     'Python 2.3+ (fold 3.6+)',
  hasLiveDemo: true,

  subtitle: 'Objects are immutable, so replace() is how you change a field. The result is validated like a fresh constructor call — and replace(tzinfo=...) relabels the zone without converting the time.',

  covers: ['date.replace', 'datetime.replace', 'time.replace'],

  cheat: {
    commonCall: 'dt.replace(second=0, microsecond=0)',
    returns:    'the same datetime truncated to the minute',
    replaces:   'Rebuilding with datetime(dt.year, dt.month, …)',
    watchOut:   'replace(tzinfo=X) keeps the wall time; astimezone(X) keeps the instant',
  },

  parameters: [
    { name: 'year / month / day', type: 'int', required: false, default: 'unchanged', desc: 'date and datetime only. The new combination must be a real date.' },
    { name: 'hour / minute / second / microsecond', type: 'int', required: false, default: 'unchanged', desc: 'datetime and time only.' },
    { name: 'tzinfo', type: 'tzinfo | None', required: false, default: 'unchanged', desc: 'datetime and time only. None makes the result naive.' },
    { name: 'fold', type: 'int', required: false, default: 'unchanged', desc: 'Keyword-only, 0 or 1 (3.6+).' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'change fields',
      blurb: 'Set the day and the hour of a timestamp. The rest is copied.',
      params: [
        { name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'day',  type: 'int', hint: 'new day',  input: 'number' },
        { name: 'hour', type: 'int', hint: 'new hour', input: 'number' },
      ],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$when}).replace(day={$day}, hour={$hour})',
      cases: [
        { id: 'first',  label: 'first of month', values: { when: '2026-09-29T14:30+02:00', day: '1', hour: '0' } },
        { id: 'feb',    label: 'day 30 in February', values: { when: '2026-02-10T09:00', day: '30', hour: '9' } },
        { id: 'hour',   label: 'hour 24', values: { when: '2026-09-29T14:30', day: '29', hour: '24' } },
      ],
    },
    {
      id: 'relabel',
      label: 'replace vs astimezone',
      blurb: 'Two ways to "set" UTC on an aware value. Only one keeps the instant. (Naive input is given +02:00 first, so the result never depends on the machine.)',
      params: [{ name: 'when', type: 'str', hint: 'an aware ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime, timedelta, timezone, UTC\ndt = datetime.fromisoformat({$when})\nif dt.tzinfo is None:\n    dt = dt.replace(tzinfo=timezone(timedelta(hours=2)))\n(dt.replace(tzinfo=UTC).isoformat(), dt.astimezone(UTC).isoformat())',
      cases: [
        { id: 'plus2', label: '+02:00', values: { when: '2026-09-29T14:30+02:00' } },
        { id: 'utc',   label: 'already UTC', values: { when: '2026-09-29T14:30Z' } },
      ],
    },
  ],
  demoExplainer: 'The offset survives replace(day=1, hour=0) because tzinfo was not mentioned. February has no 30th, so the result is rejected with the constructor\'s message. In the second tab replace moves the instant by two hours (14:30 is now UTC), astimezone keeps it (12:30 UTC).',

  patterns: [
    {
      name: 'Truncate to the minute / hour / day',
      desc: 'Zero the smaller fields.',
      code: 'minute = dt.replace(second=0, microsecond=0)\nmidnight = dt.replace(hour=0, minute=0, second=0, microsecond=0)',
    },
    {
      name: 'First day of the month',
      desc: 'Always valid.',
      code: 'first = d.replace(day=1)',
    },
    {
      name: 'Same date next year, 29 February safe',
      desc: 'Fall back to the 28th when the date does not exist.',
      code: 'try:\n    later = d.replace(year=d.year + 1)\nexcept ValueError:\n    later = d.replace(year=d.year + 1, day=28)',
    },
    {
      name: 'Drop the timezone',
      desc: 'tzinfo=None gives the naive wall-clock value.',
      code: 'naive = aware.replace(tzinfo=None)',
    },
  ],

  examples: [
    { title: 'Change one field',            code: 'from datetime import date\ndate(2026, 1, 31).replace(day=1)', returns: 'datetime.date(2026, 1, 1)' },
    { title: 'Truncate a datetime',         code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5, 123).replace(second=0, microsecond=0)', returns: 'datetime.datetime(2026, 9, 29, 14, 30)' },
    { title: 'Attach and remove a zone',    code: 'from datetime import datetime, UTC\naware = datetime(2026, 9, 29, 14, 30).replace(tzinfo=UTC)\n(aware, aware.replace(tzinfo=None))', returns: '(datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc), datetime.datetime(2026, 9, 29, 14, 30))' },
    { title: 'time.replace',                code: 'from datetime import time\ntime(14, 30).replace(hour=15)', returns: 'datetime.time(15, 30)' },
    { title: 'Validated like a constructor', code: 'from datetime import date\ndate(2026, 1, 31).replace(month=2)', returns: 'ValueError: day is out of range for month' },
    { title: 'date has no time fields',     code: 'from datetime import date\ndate(2026, 9, 29).replace(hour=1)', returns: "TypeError: replace() got an unexpected keyword argument 'hour'" },
    { title: 'copy.replace works too (3.13+)', code: 'import copy\nfrom datetime import date\ncopy.replace(date(2026, 1, 31), day=5)', returns: 'datetime.date(2026, 1, 5)' },
  ],

  pitfalls: [
    {
      name: 'Converting zones with replace',
      desc: 'replace(tzinfo=...) only relabels: 14:30+02:00 becomes 14:30 UTC, two hours later. Use astimezone to convert.',
      wrong: { label: 'replace', code: "from datetime import datetime, UTC\ndatetime.fromisoformat('2026-09-29T14:30+02:00').replace(tzinfo=UTC)", output: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone.utc)' },
      fix:   { label: 'astimezone', code: "from datetime import datetime, UTC\ndatetime.fromisoformat('2026-09-29T14:30+02:00').astimezone(UTC)", output: 'datetime.datetime(2026, 9, 29, 12, 30, tzinfo=datetime.timezone.utc)' },
    },
    {
      name: 'Adding a year to 29 February',
      desc: 'The same day does not exist next year. Decide the rule (28 Feb or 1 Mar) and catch the ValueError.',
      wrong: { label: 'replace(year=…)', code: 'from datetime import date\ndate(2024, 2, 29).replace(year=2025)', output: 'ValueError: day is out of range for month' },
      fix:   { label: 'clamp', code: 'from datetime import date\nd = date(2024, 2, 29)\ntry:\n    later = d.replace(year=2025)\nexcept ValueError:\n    later = d.replace(year=2025, day=28)\nlater', output: 'datetime.date(2025, 2, 28)' },
    },
    {
      name: 'Expecting replace to modify in place',
      desc: 'The result must be assigned; the original is untouched.',
      wrong: { label: 'ignored result', code: 'from datetime import date\nd = date(2026, 9, 29)\nd.replace(day=1)\nd', output: 'datetime.date(2026, 9, 29)' },
      fix:   { label: 'assign', code: 'from datetime import date\nd = date(2026, 9, 29)\nd = d.replace(day=1)\nd', output: 'datetime.date(2026, 9, 1)' },
    },
  ],

  when: {
    use: ['Setting or truncating fields', 'Attaching a known zone to a naive value, or dropping tzinfo'],
    avoid: ['Moving an instant to another zone → astimezone', 'Adding durations → + timedelta'],
  },

  notes: {
    cpython:     'Builds a new object through the normal constructor, so every range check applies',
    'Keywords':  'Positional arguments are also accepted in field order (d.replace(2027) sets the year), but keywords are clearer',
    'copy.replace': 'Python 3.13 added copy.replace(obj, **changes), which calls the same __replace__ protocol',
  },

  related: [
    { name: 'astimezone', slug: 'astimezone', when: 'Convert instead of relabel' },
    { name: 'combine', slug: 'combine', when: 'Build a datetime from a date and a time' },
    { name: 'year / month / day', slug: 'date-attributes', when: 'Read the fields' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I change the day or month of a date in Python?',
      a: 'd.replace(day=1) or d.replace(month=10) — it returns a new date. Assign the result; dates cannot be modified in place.',
    },
    {
      q: 'How do I set a datetime to midnight?',
      a: 'dt.replace(hour=0, minute=0, second=0, microsecond=0), or datetime.combine(dt.date(), time()) which drops tzinfo unless you pass it.',
    },
    {
      q: 'How do I make a datetime naive (remove the timezone)?',
      a: 'dt.replace(tzinfo=None) keeps the wall-clock fields. To get naive UTC first convert: dt.astimezone(UTC).replace(tzinfo=None).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.replace',
    meta:  'datetime.replace',
  },
};
