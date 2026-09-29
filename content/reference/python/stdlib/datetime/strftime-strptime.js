// content/reference/python/stdlib/datetime/strftime-strptime.js
// date.strftime / time.strftime (datetime inherits date's) and datetime.strptime

export const meta = {
  slug:        'strftime-strptime',
  name:        'datetime.strftime / strptime',
  signature:   'dt.strftime(format)',
  blurb:       'Format a date, time or datetime as text with %-directives (strftime), and parse text back into a datetime with the same directives (strptime).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'strftime strptime date.strftime time.strftime datetime.strftime datetime.strptime format codes directives %Y %m %d %H %M %S %f %z %Z %a %A %b %B %j %p python date format string parse date string does not match format unconverted data remains remove leading zero %-d %#d',
};

export const method = {
  slug:      'strftime-strptime',
  name:      'datetime.strftime / strptime',
  signature: 'dt.strftime(format)',
  returns:   { type: 'str', desc: 'strftime: the formatted text. (strptime returns a datetime — naive, or aware when the format has %z.)' },

  category:    'datetime method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'One directive table, two directions: strftime ("format") turns a date into text, strptime ("parse") turns text into a datetime. The C89 directives are portable; flags like %-d depend on your platform.',

  covers: ['date.strftime', 'time.strftime', 'datetime.strptime'],

  cheat: {
    commonCall: "dt.strftime('%Y-%m-%d %H:%M')  ·  datetime.strptime(s, '%d/%m/%Y')",
    returns:    'str  ·  datetime',
    replaces:   'Hand-built f-strings with zero-padding; regex date parsing',
    watchOut:   '%m is month, %M is minute; strptime must match the WHOLE string',
  },

  parameters: [
    { name: 'format', type: 'str', required: true, default: null, desc: 'Text with %-directives (table below). Everything else is copied literally; %% is a literal percent sign.' },
  ],

  attributes: [
    { name: '%a / %A', type: "'Sat' / 'Saturday'", meaning: 'Weekday name, abbreviated / full (locale names; English unless locale.setlocale changed LC_TIME).' },
    { name: '%w',      type: "'6'",         meaning: 'Weekday number, 0 = Sunday … 6 = Saturday.' },
    { name: '%d',      type: "'05'",        meaning: 'Day of the month, zero-padded.' },
    { name: '%b / %B', type: "'Sep' / 'September'", meaning: 'Month name, abbreviated / full (locale).' },
    { name: '%m',      type: "'09'",        meaning: 'Month number, zero-padded.' },
    { name: '%y / %Y', type: "'26' / '2026'", meaning: 'Year without / with century. strptime maps %y 00–68 to 2000–2068 and 69–99 to 1969–1999.' },
    { name: '%H / %I', type: "'14' / '02'", meaning: 'Hour, 24-hour / 12-hour clock, zero-padded.' },
    { name: '%p',      type: "'PM'",        meaning: 'AM/PM (locale). With strptime it only changes the hour when %I is used, not %H.' },
    { name: '%M',      type: "'05'",        meaning: 'Minute, zero-padded.' },
    { name: '%S',      type: "'09'",        meaning: 'Second, zero-padded.' },
    { name: '%f',      type: "'250000'",    meaning: 'Microsecond, 6 digits. strptime accepts 1 to 6 digits. Handled by Python itself, so it works everywhere.' },
    { name: '%z',      type: "'+0200'",     meaning: 'UTC offset; empty for naive objects. strptime also accepts Z, +02:00 and seconds, and returns an aware datetime.' },
    { name: '%:z',     type: "'+02:00'",    meaning: 'UTC offset with colons (Python 3.12+, strftime only).' },
    { name: '%Z',      type: "'UTC+02:00'", meaning: 'tzinfo.tzname(); empty for naive. strptime only accepts UTC, GMT and the local zone names in time.tzname — and the result stays naive.' },
    { name: '%j',      type: "'248'",       meaning: 'Day of the year, 001–366.' },
    { name: '%U / %W', type: "'35' / '35'", meaning: 'Week of the year, weeks starting Sunday / Monday; days before the first one are week 00.' },
    { name: '%G / %V / %u', type: "'2026' / '36' / '6'", meaning: 'ISO 8601 year, week (01–53) and weekday (1 = Monday). In strptime %G and %V need each other plus a weekday directive.' },
    { name: '%c / %x / %X', type: "'Sat Sep  5 14:05:09 2026' / '09/05/26' / '14:05:09'", meaning: 'Locale date+time / date / time. Shown for the C locale; the layout changes with the locale — avoid in data formats.' },
    { name: '%%',      type: "'%'",         meaning: 'A literal percent sign.' },
    { name: '%e %F %T %D %R %C %g', type: "' 5' '2026-09-05' '14:05:09' …", meaning: 'Accepted by strftime on Linux (glibc) and on Windows (UCRT); not in the C89 set Python documents. strptime rejects them.' },
    { name: '%-d %-m %-I', type: "'5' '9' '2'", meaning: 'No zero padding — glibc only. Windows raises ValueError: Invalid format string; its own flag is %#d. strptime rejects both.' },
    { name: '%s',      type: 'seconds since epoch', meaning: 'glibc only, computed as LOCAL time, ignoring tzinfo. Use dt.timestamp() instead.' },
  ],

  modes: [
    {
      id: 'format',
      label: 'strftime',
      blurb: 'Pick a moment (ISO text) and a format string. Directives are replaced, everything else is copied.',
      params: [
        { name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'fmt',  type: 'str', hint: 'a strftime format', input: 'text' },
      ],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$when}).strftime({$fmt})',
      cases: [
        { id: 'sortable', label: 'sortable',        values: { when: '2026-09-05T14:05:09', fmt: '%Y-%m-%d %H:%M:%S' } },
        { id: 'names',    label: 'names',           values: { when: '2026-09-05T14:05:09', fmt: '%A, %d %B %Y' } },
        { id: 'micro',    label: 'microseconds',    values: { when: '2026-09-05T14:05:09.25', fmt: '%H:%M:%S.%f' } },
        { id: 'offset',   label: 'offsets',         values: { when: '2026-09-05T14:05:09+02:00', fmt: '%z | %:z | %Z' } },
        { id: 'naive',    label: '%z when naive',   values: { when: '2026-09-05T14:05:09', fmt: '[%z] [%Z]' } },
        { id: 'weeks',    label: 'day & week',      values: { when: '2026-09-05', fmt: 'day %j, week %W, ISO %G-W%V-%u' } },
        { id: 'mixup',    label: '%M vs %m',        values: { when: '2026-09-05T14:05:09', fmt: '%Y-%M-%d' } },
      ],
    },
    {
      id: 'parse',
      label: 'strptime',
      blurb: 'Text plus the format it was written in. Every character must match, and nothing may be left over.',
      params: [
        { name: 'text', type: 'str', hint: 'the date string to parse', input: 'text' },
        { name: 'fmt',  type: 'str', hint: 'its strptime format', input: 'text' },
      ],
      template: 'from datetime import datetime\ndatetime.strptime({$text}, {$fmt})',
      cases: [
        { id: 'dmy',       label: 'day first',        values: { text: '29/09/2026 14:30', fmt: '%d/%m/%Y %H:%M' } },
        { id: 'names',     label: 'month name',       values: { text: '29 Sep 2026', fmt: '%d %b %Y' } },
        { id: 'offset',    label: 'with %z',          values: { text: '2026-09-29T14:30:00+0530', fmt: '%Y-%m-%dT%H:%M:%S%z' } },
        { id: 'zulu',      label: 'Z suffix',         values: { text: '2026-09-29T14:30:00Z', fmt: '%Y-%m-%dT%H:%M:%S%z' } },
        { id: 'nomatch',   label: 'does not match',   values: { text: '2026-09-29', fmt: '%d/%m/%Y' } },
        { id: 'leftover',  label: 'unconverted data', values: { text: '2026-09-29 14:30', fmt: '%Y-%m-%d' } },
        { id: 'impossible', label: '30 February',     values: { text: '2026-02-30', fmt: '%Y-%m-%d' } },
        { id: 'bad',       label: 'bad directive',    values: { text: '2026-09-29', fmt: '%Y-%m-%Q' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'Format, then parse the text back with the same format. Whatever the format leaves out comes back as a default.',
      params: [
        { name: 'when', type: 'str', hint: 'an ISO 8601 timestamp', input: 'text' },
        { name: 'fmt',  type: 'str', hint: 'a format used both ways', input: 'text' },
      ],
      template: 'from datetime import datetime\ns = datetime.fromisoformat({$when}).strftime({$fmt})\n(s, datetime.strptime(s, {$fmt}))',
      cases: [
        { id: 'full',   label: 'lossless',        values: { when: '2026-09-29T14:30:05', fmt: '%Y-%m-%d %H:%M:%S' } },
        { id: 'date',   label: 'drops the time',  values: { when: '2026-09-29T14:30:05', fmt: '%d %b %Y' } },
        { id: 'time',   label: 'drops the date',  values: { when: '2026-09-29T14:30:05', fmt: '%H:%M' } },
        { id: 'offset', label: 'keeps %z',        values: { when: '2026-09-29T14:30:05-04:00', fmt: '%Y-%m-%d %H:%M:%S%z' } },
      ],
    },
  ],
  demoExplainer: 'strftime directives this page lists as portable give the same text on every platform. For the rest the demo follows Linux (glibc): there %-d gives "5", while Windows raises ValueError: Invalid format string (Windows spells it %#d); %s is refused because it depends on the local timezone. In the round trip, fields missing from the format come back as defaults — 1900-01-01 for the date, 00:00 for the time.',

  patterns: [
    {
      name: 'f-string formatting',
      desc: 'datetime objects implement __format__, so a format spec is a strftime format.',
      code: "from datetime import datetime\nlabel = f\"Saved {datetime(2026, 9, 29, 14, 5):%d %b %Y at %H:%M}\"",
    },
    {
      name: 'Try several input formats',
      desc: 'strptime raises ValueError on a mismatch — loop until one fits.',
      code: "from datetime import datetime\n\ndef parse_any(text, formats=('%Y-%m-%d', '%d/%m/%Y', '%d %b %Y')):\n    for fmt in formats:\n        try:\n            return datetime.strptime(text, fmt)\n        except ValueError:\n            pass\n    raise ValueError(f'unrecognised date: {text!r}')",
    },
    {
      name: 'Parse to a date, not a datetime',
      desc: 'date has no strptime; parse a datetime and take .date().',
      code: "from datetime import datetime\nday = datetime.strptime('29.09.2026', '%d.%m.%Y').date()",
    },
    {
      name: 'Day without a leading zero, portably',
      desc: '%-d is glibc-only and %#d Windows-only; build that field yourself.',
      code: "label = f\"{dt.day} {dt:%B %Y}\"  # '5 September 2026' on every platform",
    },
  ],

  examples: [
    { title: 'Sortable timestamp',            code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 5, 9).strftime('%Y-%m-%d %H:%M:%S')", returns: "'2026-09-29 14:05:09'" },
    { title: 'Same thing in an f-string',     code: "from datetime import datetime\ndt = datetime(2026, 9, 29, 14, 5)\nf'{dt:%Y-%m-%d %H:%M}'", returns: "'2026-09-29 14:05'" },
    { title: 'Microseconds with %f',          code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 5, 9, 250000).strftime('%H:%M:%S.%f')", returns: "'14:05:09.250000'" },
    { title: 'Offsets need an aware value',   code: "from datetime import datetime, timedelta, timezone\ndatetime(2026, 9, 29, tzinfo=timezone(timedelta(hours=-4))).strftime('%z %:z %Z')", returns: "'-0400 -04:00 UTC-04:00'" },
    { title: 'A date has midnight and no zone', code: "from datetime import date\ndate(2026, 9, 29).strftime('%Y-%m-%d %H:%M:%S %z')", returns: "'2026-09-29 00:00:00 '" },
    { title: 'Parse with %z → aware',         code: "from datetime import datetime\ndatetime.strptime('2026-09-29 14:30:00+05:30', '%Y-%m-%d %H:%M:%S%z')", returns: 'datetime.datetime(2026, 9, 29, 14, 30, tzinfo=datetime.timezone(datetime.timedelta(seconds=19800)))' },
    { title: 'Two-digit years pivot at 69',   code: "from datetime import datetime\n(datetime.strptime('68', '%y').year, datetime.strptime('69', '%y').year)", returns: '(2068, 1969)' },
    { title: 'ISO week date',                 code: "from datetime import datetime\ndatetime.strptime('2026-W40-2', '%G-W%V-%u')", returns: 'datetime.datetime(2026, 9, 29, 0, 0)' },
  ],

  pitfalls: [
    {
      name: '%M is minutes, %m is months',
      desc: 'The case matters and both are valid, so the mistake produces a plausible-looking wrong date instead of an error.',
      wrong: { label: '%M', code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 5).strftime('%Y-%M-%d')", output: "'2026-05-29'" },
      fix:   { label: '%m', code: "from datetime import datetime\ndatetime(2026, 9, 29, 14, 5).strftime('%Y-%m-%d')", output: "'2026-09-29'" },
    },
    {
      name: 'Day-first text with a month-first format',
      desc: 'strptime does not guess. 29 cannot be a month, so this fails loudly — but 05/09 would silently parse as 9 May.',
      wrong: { label: '%m/%d/%Y', code: "from datetime import datetime\ndatetime.strptime('29/09/2026', '%m/%d/%Y')", output: "ValueError: time data '29/09/2026' does not match format '%m/%d/%Y'" },
      fix:   { label: '%d/%m/%Y', code: "from datetime import datetime\ndatetime.strptime('29/09/2026', '%d/%m/%Y')", output: 'datetime.datetime(2026, 9, 29, 0, 0)' },
    },
    {
      name: 'Parsing a day and month without a year',
      desc: 'The missing year defaults to 1900, which is not a leap year, so 29 February cannot be built. Python 3.13 also emits a DeprecationWarning for any day-of-month format without a year.',
      wrong: { label: 'no year', code: "from datetime import datetime\ndatetime.strptime('29 Feb', '%d %b')", output: 'ValueError: day is out of range for month' },
      fix:   { label: 'add the year', code: "from datetime import datetime\ndatetime.strptime('29 Feb 2028', '%d %b %Y')", output: 'datetime.datetime(2028, 2, 29, 0, 0)' },
    },
    {
      name: 'Expecting %Z to make the result aware',
      desc: 'strptime matches a zone NAME only against UTC, GMT and the local names, and still returns a naive datetime. Offsets (%z) are what produce tzinfo.',
      wrong: { label: '%Z', code: "from datetime import datetime\ndatetime.strptime('2026-09-29 14:30 UTC', '%Y-%m-%d %H:%M %Z').tzinfo is None", output: 'True' },
      fix:   { label: '%z', code: "from datetime import datetime\ndatetime.strptime('2026-09-29 14:30 +0000', '%Y-%m-%d %H:%M %z').tzinfo", output: 'datetime.timezone.utc' },
    },
  ],

  when: {
    use: [
      'Human-readable output: reports, UI labels, file names',
      'Parsing a known, fixed input layout (CSV exports, log lines)',
    ],
    avoid: [
      'ISO 8601 text → isoformat() / fromisoformat(): faster, exact, offset-aware',
      'Locale-sensitive display for many languages → babel or the platform formatter',
      'Guessing unknown formats → dateutil.parser (third-party)',
    ],
  },

  notes: {
    cpython:       'strftime: Modules/_datetimemodule.c expands %z, %:z, %Z and %f itself, then calls time.strftime (the C library). strptime: pure Python in Lib/_strptime.py, a regex built from the format',
    'Portability':  'The C89 directives in the table behave the same everywhere; anything else is whatever the platform C library does (glibc, BSD/macOS, Windows UCRT differ)',
    'Case':         'strptime matches names case-insensitively: SEP, sep and Sep all parse with %b',
    'Errors':       'strptime raises ValueError: "time data ... does not match format ...", "unconverted data remains: ...", "\'Q\' is a bad directive in format ...", or the date validation message',
  },

  related: [
    { name: 'fromisoformat / isoformat', slug: 'fromisoformat', when: 'The exact, faster choice for ISO 8601 text' },
    { name: 'ctime', slug: 'ctime', when: 'The fixed "Tue Sep 29 14:30:00 2026" layout' },
    { name: 'timetuple', slug: 'timetuple', when: 'The struct strftime formats from' },
    { name: 'datetime', slug: 'datetime', when: 'Naive vs aware results' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
    { name: 'ValueError', slug: 'valueerror', when: 'What a failed parse raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between strftime and strptime?',
      a: 'strftime = "string format time": an object method that turns a date, time or datetime into text. strptime = "string parse time": a datetime class method that turns text into a datetime. Both use the same %-directives, so the format that wrote a string can read it back.',
    },
    {
      q: 'How do I remove the leading zero from the day or hour?',
      a: 'On Linux %-d, %-m and %-I drop the padding; on Windows the same flag raises ValueError: Invalid format string and the Windows spelling is %#d. For portable code format the number yourself: f"{dt.day} {dt:%B}".',
    },
    {
      q: 'What does "ValueError: unconverted data remains" mean?',
      a: 'The format matched the start of the string but characters were left over — usually a time part, fractional seconds or a zone that the format does not mention. Add the missing directives (for example %H:%M or .%f) or cut the string first.',
    },
    {
      q: 'How do I parse an ISO 8601 timestamp?',
      a: 'Use datetime.fromisoformat(text). Since Python 3.11 it accepts almost all ISO 8601 forms, including a trailing Z, and it keeps the offset. strptime with %Y-%m-%dT%H:%M:%S%z works too but breaks on every variation (fractions, missing seconds).',
    },
    {
      q: 'Why does my strptime result have no timezone?',
      a: 'Only %z (a numeric offset or Z) produces an aware datetime. %Z matches a few zone names but the result stays naive. Attach a zone afterwards with replace(tzinfo=...) if you know it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior',
    meta:  'strftime() and strptime() behavior',
  },
};
