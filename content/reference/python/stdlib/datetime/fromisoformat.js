// content/reference/python/stdlib/datetime/fromisoformat.js
// isoformat() / fromisoformat() of date, datetime and time

export const meta = {
  slug:        'fromisoformat',
  name:        'datetime.fromisoformat / isoformat',
  signature:   'datetime.fromisoformat(date_string)',
  blurb:       'Parse ISO 8601 text into a date, time or datetime (fromisoformat), and write one out as ISO 8601 (isoformat) — the exact, lossless round trip.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.7+ (full ISO 8601 since 3.11)',
  searchTerms: 'fromisoformat isoformat date.fromisoformat datetime.fromisoformat time.fromisoformat date.isoformat datetime.isoformat time.isoformat iso 8601 parse iso string python timespec sep Z suffix utc invalid isoformat string datetime to string json',
};

export const method = {
  slug:      'fromisoformat',
  name:      'datetime.fromisoformat / isoformat',
  signature: 'datetime.fromisoformat(date_string)',
  returns:   { type: 'datetime', desc: 'fromisoformat: a new date / time / datetime (aware when the text has an offset or Z). isoformat: a str.' },

  category:    'datetime method',
  version:     'Python 3.7+ (full ISO 8601 since 3.11)',
  hasLiveDemo: true,

  subtitle: 'The machine-readable pair. isoformat() writes 2026-09-29T14:30:00+02:00, fromisoformat() reads it back unchanged — and since Python 3.11 it also reads Z, basic formats like 20260929T1430 and ISO week dates.',

  covers: ['date.fromisoformat', 'datetime.fromisoformat', 'time.fromisoformat', 'date.isoformat', 'datetime.isoformat', 'time.isoformat'],

  cheat: {
    commonCall: "datetime.fromisoformat('2026-09-29T14:30Z')  ·  dt.isoformat()",
    returns:    'datetime (aware if the text has an offset)  ·  str',
    replaces:   "strptime(s, '%Y-%m-%dT%H:%M:%S%z') and hand-written ISO formatting",
    watchOut:   'Before 3.11 fromisoformat rejected Z and most non-isoformat() text',
  },

  parameters: [
    { name: 'date_string', type: 'str', required: true, default: null, desc: 'ISO 8601 text. date: YYYY-MM-DD, YYYYMMDD, YYYY-Www[-D]. time: HH[:MM[:SS[.ffffff]]] plus an optional offset or Z. datetime: a date, any ONE separator character, a time.' },
    { name: 'sep', type: 'str', required: false, default: "'T'", desc: 'isoformat() on datetime only: the single character between date and time.' },
    { name: 'timespec', type: 'str', required: false, default: "'auto'", desc: "isoformat(): 'auto', 'hours', 'minutes', 'seconds', 'milliseconds' or 'microseconds'. Extra digits are truncated, not rounded." },
  ],

  modes: [
    {
      id: 'parse',
      label: 'fromisoformat',
      blurb: 'Type ISO 8601 text. Offsets become a timezone, Z becomes UTC, missing parts become zero.',
      params: [{ name: 'text', type: 'str', hint: 'ISO 8601 text', input: 'text' }],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$text})',
      cases: [
        { id: 'full',   label: 'with offset',  values: { text: '2026-09-29T14:30:05.123+02:00' } },
        { id: 'zulu',   label: 'Z suffix',     values: { text: '2026-09-29T14:30:00Z' } },
        { id: 'basic',  label: 'basic format', values: { text: '20260929T143005' } },
        { id: 'date',   label: 'date only',    values: { text: '2026-09-29' } },
        { id: 'week',   label: 'ISO week',     values: { text: '2026-W40-2 09:00' } },
        { id: 'slash',  label: 'not ISO',      values: { text: '29/09/2026' } },
        { id: 'nopad',  label: 'no zero pad',  values: { text: '2026-9-29' } },
        { id: 'feb30',  label: '30 February',  values: { text: '2026-02-30T10:00' } },
      ],
    },
    {
      id: 'classes',
      label: 'date vs time',
      blurb: 'date.fromisoformat takes only a date; time.fromisoformat takes only a time (a leading T is allowed).',
      params: [{ name: 'text', type: 'str', hint: 'ISO 8601 text', input: 'text' }],
      template: "from datetime import date, time\ntry:\n    result = date.fromisoformat({$text})\nexcept ValueError:\n    result = time.fromisoformat({$text})\nresult",
      cases: [
        { id: 'date',   label: 'a date',          values: { text: '2026-09-29' } },
        { id: 'time',   label: 'a time',          values: { text: 'T14:30:05+05:30' } },
        { id: 'both',   label: 'date and time',   values: { text: '2026-09-29T14:30' } },
      ],
    },
    {
      id: 'format',
      label: 'isoformat',
      blurb: 'timespec picks the smallest unit written; sep is the character between date and time.',
      params: [
        { name: 'when',     type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'sep',      type: 'str', hint: 'one character', input: 'text' },
        { name: 'timespec', type: 'str', hint: 'auto, hours, minutes, seconds, milliseconds, microseconds', input: 'text' },
      ],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$when}).isoformat({$sep}, {$timespec})',
      cases: [
        { id: 'auto',   label: 'auto',          values: { when: '2026-09-29T14:30:05.123456+02:00', sep: 'T', timespec: 'auto' } },
        { id: 'ms',     label: 'milliseconds',  values: { when: '2026-09-29T14:30:05.123456', sep: 'T', timespec: 'milliseconds' } },
        { id: 'trunc',  label: 'truncates',     values: { when: '2026-09-29T14:30:59.999999', sep: ' ', timespec: 'minutes' } },
        { id: 'utc',    label: 'UTC',           values: { when: '2026-09-29T14:30Z', sep: 'T', timespec: 'seconds' } },
        { id: 'badsep', label: 'two-char sep',  values: { when: '2026-09-29T14:30', sep: ', ', timespec: 'auto' } },
        { id: 'badts',  label: 'bad timespec',  values: { when: '2026-09-29T14:30', sep: 'T', timespec: 'hour' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'isoformat() output always parses back to an equal object — offset and microseconds included.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndt = datetime.fromisoformat({$when})\ntext = dt.isoformat()\n(text, datetime.fromisoformat(text) == dt)',
      cases: [
        { id: 'offset', label: 'offset',        values: { when: '2026-09-29T14:30:05.000123-03:30' } },
        { id: 'basic',  label: 'from basic',    values: { when: '20260929T1430Z' } },
      ],
    },
  ],
  demoExplainer: 'fromisoformat validates twice: the text must be ISO 8601 ("Invalid isoformat string"), and the numbers must make a real date ("day is out of range for month" for 30 February). isoformat never rounds: 14:30:59.999999 with timespec="minutes" is 14:30. UTC is written +00:00, not Z — fromisoformat accepts both.',

  patterns: [
    {
      name: 'datetime to JSON and back',
      desc: 'json cannot serialize datetime; ISO text round-trips exactly.',
      code: "import json\nfrom datetime import datetime\npayload = json.dumps({'at': dt.isoformat()})\nat = datetime.fromisoformat(json.loads(payload)['at'])",
    },
    {
      name: 'Write Z instead of +00:00',
      desc: 'Some APIs insist on the Z suffix; isoformat never writes it.',
      code: "stamp = dt.astimezone(UTC).isoformat().replace('+00:00', 'Z')",
    },
    {
      name: 'Accept a string or a date',
      desc: 'date.fromisoformat for input fields; keep the error message for the user.',
      code: "from datetime import date\ntry:\n    due = date.fromisoformat(form['due'])\nexcept ValueError as e:\n    errors['due'] = str(e)",
    },
  ],

  examples: [
    { title: 'Offset → timezone',          code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30:05.123+02:00')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, 5, 123000, tzinfo=datetime.timezone(datetime.timedelta(seconds=7200)))' },
    { title: 'Z means UTC (3.11+)',        code: "from datetime import datetime\ndatetime.fromisoformat('20260929T143005Z')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, 5, tzinfo=datetime.timezone.utc)' },
    { title: 'Comma as decimal mark',      code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29 14:30:05,5')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, 5, 500000)' },
    { title: 'ISO week date',              code: "from datetime import date\ndate.fromisoformat('2026-W40')", returns: 'datetime.date(2026, 9, 28)' },
    { title: 'time with a leading T',      code: "from datetime import time\ntime.fromisoformat('T143005.5+0530')", returns: 'datetime.time(14, 30, 5, 500000, tzinfo=datetime.timezone(datetime.timedelta(seconds=19800)))' },
    { title: 'isoformat with timespec',    code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5, 123456).isoformat(timespec='milliseconds')", returns: "'2026-09-29T14:30:05.123'" },
    { title: 'str() is isoformat with a space', code: 'from datetime import datetime\nstr(datetime(2026, 9, 29, 14, 30))', returns: "'2026-09-29 14:30:00'" },
    { title: 'Digits past microseconds are dropped', code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30:05.1234567')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, 5, 123456)' },
  ],

  pitfalls: [
    {
      name: 'date.fromisoformat on a timestamp',
      desc: 'date.fromisoformat accepts a date and nothing else. Parse a datetime and take .date().',
      wrong: { label: 'date.fromisoformat', code: "from datetime import date\ndate.fromisoformat('2026-09-29T14:30')", output: "ValueError: Invalid isoformat string: '2026-09-29T14:30'" },
      fix:   { label: '.date()',            code: "from datetime import datetime\ndatetime.fromisoformat('2026-09-29T14:30').date()", output: 'datetime.date(2026, 9, 29)' },
    },
    {
      name: 'Unpadded numbers are not ISO 8601',
      desc: 'ISO requires 2-digit months and days. For loose input use strptime, which accepts 9 for %m.',
      wrong: { label: 'fromisoformat', code: "from datetime import datetime\ndatetime.fromisoformat('2026-9-5')", output: "ValueError: Invalid isoformat string: '2026-9-5'" },
      fix:   { label: 'strptime',      code: "from datetime import datetime\ndatetime.strptime('2026-9-5', '%Y-%m-%d')", output: 'datetime.datetime(2026, 9, 5, 0, 0)' },
    },
    {
      name: 'Expecting isoformat to round',
      desc: 'timespec truncates. 59.999999 seconds with timespec="seconds" stays :59 — round with a timedelta first if you need it.',
      wrong: { label: 'truncated', code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 59, 999999).isoformat(timespec='seconds')", output: "'2026-09-29T14:30:59'" },
      fix:   { label: 'round first', code: "from datetime import datetime, timedelta\ndt = datetime(2026, 9, 29, 14, 30, 59, 999999)\n(dt + timedelta(microseconds=500000)).isoformat(timespec='seconds')", output: "'2026-09-29T14:31:00'" },
    },
  ],

  when: {
    use: [
      'Storing timestamps as text: JSON, CSV, logs, databases without a datetime type',
      'Reading API timestamps (RFC 3339 is a profile of ISO 8601)',
      'Form inputs of type date / time / datetime-local (they send ISO text)',
    ],
    avoid: [
      'Human-facing text → strftime',
      'Arbitrary layouts (29/09/2026) → strptime',
      'ISO durations (P3DT4H) and intervals → not supported; third-party isodate',
    ],
  },

  notes: {
    cpython:        'A hand-written C parser in Modules/_datetimemodule.c (parse_isoformat_date / parse_hh_mm_ss_ff); every syntax error is reported as ValueError: Invalid isoformat string: <repr>',
    'Separator':    'datetime.fromisoformat accepts ANY single character between date and time (T, space, even a letter)',
    'Offsets':      'An offset of zero (+00:00, -00:00, Z) gives timezone.utc itself; others give timezone(timedelta(...)); 24:00 or more is ValueError',
    'Before 3.11':  'Only the formats that isoformat() itself writes were accepted — no Z, no basic format, no week dates',
  },

  related: [
    { name: 'strftime / strptime', slug: 'strftime-strptime', when: 'Any other text layout' },
    { name: 'timezone', slug: 'timezone', when: 'What an offset in the text becomes' },
    { name: 'UTC', slug: 'utc', when: 'What Z becomes' },
    { name: 'isocalendar', slug: 'isocalendar', when: 'ISO week dates' },
    { name: 'json module', slug: 'json', when: 'Serialize datetimes as ISO strings', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I parse an ISO 8601 string with a Z at the end?',
      a: 'On Python 3.11+ datetime.fromisoformat("2026-09-29T14:30:00Z") works directly and returns an aware datetime in UTC. On 3.7–3.10, replace the Z first: fromisoformat(s.replace("Z", "+00:00")).',
    },
    {
      q: 'How do I convert a datetime to an ISO 8601 string?',
      a: 'dt.isoformat() — "2026-09-29T14:30:00" for naive values, with "+02:00" appended for aware ones. Pass timespec="seconds" to drop microseconds, or sep=" " for a space instead of T.',
    },
    {
      q: 'What does "Invalid isoformat string" mean?',
      a: 'The text is not in a form fromisoformat understands: a non-ISO layout like 29/09/2026, unpadded numbers (2026-9-5), a stray space at the end, or a date passed to time.fromisoformat. If it IS valid ISO but an impossible date, you get the date validation error instead ("day is out of range for month").',
    },
    {
      q: 'Is fromisoformat faster than strptime?',
      a: 'Yes, by a wide margin: it is a small C parser, while strptime builds and runs a regular expression in pure Python. It is also stricter and handles offsets without extra directives.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.fromisoformat',
    meta:  'datetime.fromisoformat',
  },
};
