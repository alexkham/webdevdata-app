// content/reference/python/stdlib/time/strptime.js

export const meta = {
  slug:        'strptime',
  name:        'time.strptime',
  signature:   "time.strptime(string[, format])",
  blurb:       "Parse text into a struct_time using %-directives; the format defaults to '%a %b %d %H:%M:%S %Y', the layout of ctime().",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.strptime strptime python parse date string to struct_time parse time string format does not match format unconverted data remains bad directive in format %z %Z tm_gmtoff default year 1900 2-digit year %y',
};

export const method = {
  slug:      'strptime',
  name:      'time.strptime',
  signature: "time.strptime(string[, format])",
  returns:   { type: 'time.struct_time', desc: 'The parsed fields; anything the format does not mention defaults to (1900, 1, 1, 0, 0, 0, 0, 1, -1), and weekday and day of the year are computed.' },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The same parser as datetime.strptime (Lib/_strptime.py, pure Python, identical on every platform), returning a struct_time instead of a datetime. The whole string must match the format.',

  covers: ['strptime'],

  cheat: {
    commonCall: "time.strptime('29/09/2026', '%d/%m/%Y')",
    returns:    'time.struct_time(tm_year=2026, tm_mon=9, tm_mday=29, ...)',
    replaces:   'Regular expressions and int() calls for date text',
    watchOut:   'the WHOLE string must match; %z keeps the local hour and stores the offset in tm_gmtoff',
  },

  parameters: [
    { name: 'string', type: 'str', required: true, default: null, desc: 'The text to parse.' },
    { name: 'format', type: 'str', required: false, default: "'%a %b %d %H:%M:%S %Y'", desc: 'The layout, with the same directives as strftime (%Y %m %d %H %M %S %z ...). Names are matched case-insensitively.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'parse',
      blurb: 'Text plus the format it was written in. Every character must match and nothing may be left over.',
      params: [
        { name: 'text', type: 'str', hint: 'the date text',      input: 'text' },
        { name: 'fmt',  type: 'str', hint: 'its strptime format', input: 'text' },
      ],
      template: 'import time\ntime.strptime({$text}, {$fmt})',
      cases: [
        { id: 'names',    label: 'month name',       values: { text: '29 Sep 2026',          fmt: '%d %b %Y' } },
        { id: 'docs',     label: 'two-digit year',   values: { text: '30 Nov 00',            fmt: '%d %b %y' } },
        { id: 'ampm',     label: '12-hour',          values: { text: 'Sep 29 2026 2:30PM',   fmt: '%b %d %Y %I:%M%p' } },
        { id: 'nomatch',  label: 'does not match',   values: { text: '29/09/2026',           fmt: '%m/%d/%Y' } },
        { id: 'leftover', label: 'unconverted data', values: { text: '2026-09-29 14:30',     fmt: '%Y-%m-%d' } },
        { id: 'feb30',    label: '30 February',      values: { text: '2026-02-30',           fmt: '%Y-%m-%d' } },
        { id: 'bad',      label: 'bad directive',    values: { text: '2026-09-29',           fmt: '%Y-%m-%Q' } },
      ],
    },
    {
      id: 'offset',
      label: '%z offset',
      blurb: 'A UTC offset is stored in tm_gmtoff (seconds east of UTC). The hour is NOT converted to UTC, and tm_isdst stays -1.',
      params: [{ name: 'text', type: 'str', hint: 'YYYY-MM-DD HH:MM ±HHMM', input: 'text' }],
      template: "import time\nst = time.strptime({$text}, '%Y-%m-%d %H:%M %z')\n(st.tm_hour, st.tm_gmtoff, st.tm_isdst)",
      cases: [
        { id: 'india',  label: '+0530',       values: { text: '2026-09-29 14:30 +0530' } },
        { id: 'colon',  label: '-04:00',      values: { text: '2026-09-29 14:30 -04:00' } },
        { id: 'zulu',   label: 'Z',           values: { text: '2026-09-29 14:30 Z' } },
        { id: 'name',   label: 'a zone name', values: { text: '2026-09-29 14:30 EST' } },
      ],
    },
    {
      id: 'ctime',
      label: 'default format',
      blurb: "Without a format, strptime expects the ctime() / asctime() layout '%a %b %d %H:%M:%S %Y'.",
      params: [{ name: 'text', type: 'str', hint: "e.g. 'Tue Sep 29 14:30:05 2026'", input: 'text' }],
      template: 'import time\ntime.strptime({$text})',
      cases: [
        { id: 'ctime', label: 'ctime text', values: { text: 'Tue Sep 29 14:30:05 2026' } },
        { id: 'pad',   label: 'padded day', values: { text: 'Sat Sep  5 08:00:00 2026' } },
        { id: 'iso',   label: 'ISO text',   values: { text: '2026-09-29 14:30:05' } },
      ],
    },
  ],
  demoExplainer: 'strptime fills in tm_wday and tm_yday itself (2026-09-29 is a Tuesday, day 272) and leaves tm_isdst at -1 ("unknown") unless %Z matched UTC, GMT or a local zone name. A two-digit year 00-68 becomes 2000-2068 and 69-99 becomes 1969-1999. %z takes only a numeric offset or Z, so EST does not match. Because the parser is pure Python, these results are the same on every platform - except %Z, which also accepts the local zone names of the machine (the demo declines to guess when %Z text does not match).',

  patterns: [
    {
      name: 'Try several formats',
      desc: 'strptime raises ValueError on a mismatch - loop until one fits.',
      code: "import time\n\ndef parse_any(text, formats=('%Y-%m-%d', '%d/%m/%Y', '%d %b %Y')):\n    for fmt in formats:\n        try:\n            return time.strptime(text, fmt)\n        except ValueError:\n            pass\n    raise ValueError(f'unrecognised date: {text!r}')",
    },
    {
      name: 'Parsed text → Unix timestamp',
      desc: 'calendar.timegm if the text was UTC, time.mktime if it was local time.',
      code: "import calendar, time\nts = calendar.timegm(time.strptime('2026-09-29 14:30', '%Y-%m-%d %H:%M'))",
    },
    {
      name: 'Honour a %z offset',
      desc: 'Subtract tm_gmtoff to get the real instant in UTC.',
      code: "import calendar, time\nst = time.strptime(text, '%Y-%m-%dT%H:%M:%S%z')\nts = calendar.timegm(st) - st.tm_gmtoff",
    },
    {
      name: 'Reformat a date string',
      desc: 'Parse one layout, print another.',
      code: "import time\nout = time.strftime('%Y-%m-%d', time.strptime('29/09/2026', '%d/%m/%Y'))",
    },
  ],

  examples: [
    { title: 'Docs example: two-digit year',   code: "import time\ntime.strptime('30 Nov 00', '%d %b %y')", returns: 'time.struct_time(tm_year=2000, tm_mon=11, tm_mday=30, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=335, tm_isdst=-1)' },
    { title: 'Missing fields get defaults',     code: "import time\ntime.strptime('14:30', '%H:%M')[:6]", returns: '(1900, 1, 1, 14, 30, 0)' },
    { title: 'Weekday and day of year are computed', code: "import time\nst = time.strptime('2026-09-29', '%Y-%m-%d')\n(st.tm_wday, st.tm_yday, st.tm_isdst)", returns: '(1, 272, -1)' },
    { title: '%Z with UTC sets tm_isdst to 0',  code: "import time\ntime.strptime('2026-09-29 UTC', '%Y-%m-%d %Z').tm_isdst", returns: '0' },
    { title: 'Default format = ctime layout',   code: "import time\ntime.strptime('Tue Sep 29 14:30:05 2026')[:6]", returns: '(2026, 9, 29, 14, 30, 5)' },
    { title: 'The offset lands in tm_gmtoff',   code: "import time\ntime.strptime('2026-09-29 14:30 +0530', '%Y-%m-%d %H:%M %z').tm_gmtoff", returns: '19800' },
    { title: '29 Feb without a year (3.13 warns)', code: "import time\ntime.strptime('29 Feb', '%d %b')[:3]", returns: '(1900, 2, 29)' },
  ],

  pitfalls: [
    {
      name: 'Day-first text, month-first format',
      desc: 'strptime never guesses. 29 cannot be a month, so this one fails loudly - but 05/09/2026 would silently parse as 9 May.',
      wrong: { label: '%m/%d/%Y', code: "import time\ntime.strptime('29/09/2026', '%m/%d/%Y')", output: "ValueError: time data '29/09/2026' does not match format '%m/%d/%Y'" },
      fix:   { label: '%d/%m/%Y', code: "import time\ntime.strptime('29/09/2026', '%d/%m/%Y')[:3]", output: '(2026, 9, 29)' },
    },
    {
      name: 'Text left over at the end',
      desc: 'The format matched the beginning only. The message shows the leftover text - here " 14:30", with its leading space.',
      wrong: { label: 'date only',  code: "import time\ntime.strptime('2026-09-29 14:30', '%Y-%m-%d')", output: 'ValueError: unconverted data remains:  14:30' },
      fix:   { label: 'add %H:%M', code: "import time\ntime.strptime('2026-09-29 14:30', '%Y-%m-%d %H:%M')[:5]", output: '(2026, 9, 29, 14, 30)' },
    },
    {
      name: 'Expecting %z to convert to UTC',
      desc: 'The fields keep the wall-clock time written in the text. Combine timegm and tm_gmtoff to get the UTC instant.',
      wrong: { label: 'tm_hour',    code: "import time\ntime.strptime('2026-09-29 14:30 +0530', '%Y-%m-%d %H:%M %z').tm_hour", output: '14' },
      fix:   { label: 'to UTC',     code: "import calendar, time\nst = time.strptime('2026-09-29 14:30 +0530', '%Y-%m-%d %H:%M %z')\ntime.gmtime(calendar.timegm(st) - st.tm_gmtoff)[:5]", output: '(2026, 9, 29, 9, 0)' },
    },
  ],

  when: {
    use: [
      'Parsing a known, fixed layout into fields (log lines, CSV exports)',
      'Code already built around struct_time, gmtime and strftime',
    ],
    avoid: [
      'You need a datetime object → datetime.strptime (same directives)',
      'ISO 8601 text → datetime.fromisoformat(), faster and offset-aware',
      'Unknown or human-written formats → dateutil.parser (third-party)',
    ],
  },

  notes: {
    cpython:      'time_strptime imports _strptime._strptime_time from Lib/_strptime.py: a regular expression built from the format, cached for the last few formats',
    'Errors':     "ValueError for: time data ... does not match format ..., unconverted data remains: ..., 'Q' is a bad directive in format ..., and impossible dates (day is out of range for month)",
    'Defaults':   'Missing fields default to (1900, 1, 1, 0, 0, 0, 0, 1, -1); tm_zone and tm_gmtoff are None unless %Z or %z matched',
    'Python 3.13': 'A day of the month without a year (%d without %Y, %y or %G) now emits a DeprecationWarning: the default year 1900 is not a leap year, so 29 February only parses through a special case',
  },

  related: [
    { name: 'time.strftime',   slug: 'strftime',     when: 'The reverse direction, same directives' },
    { name: 'struct_time',     slug: 'struct-time',  when: 'What strptime returns' },
    { name: 'struct_time attributes', slug: 'struct-time-attributes', when: 'tm_gmtoff and tm_zone after %z / %Z' },
    { name: 'asctime / ctime', slug: 'asctime-ctime', when: 'The layout of the default format' },
    { name: 'time module',     slug: 'time',         when: 'Overview', category: 'stdlib' },
    { name: 'datetime.strptime', slug: 'strftime-strptime', when: 'The same parser, returning a datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'What is the difference between time.strptime and datetime.strptime?',
      a: 'Both use Lib/_strptime.py with the same directives. time.strptime returns a struct_time (no microseconds; the %z offset goes to tm_gmtoff); datetime.datetime.strptime returns a datetime, aware when %z is used.',
    },
    {
      q: 'What does "ValueError: unconverted data remains" mean?',
      a: 'The format matched the start of the string but characters were left over - usually a time part, fractional seconds or a zone the format does not mention. Extend the format, or cut the string first.',
    },
    {
      q: 'Which default values does strptime use?',
      a: '(1900, 1, 1, 0, 0, 0, 0, 1, -1) for anything the format does not provide; weekday and day of the year are then computed from the date. A two-digit %y year maps 00-68 to 2000-2068 and 69-99 to 1969-1999.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.strptime',
    meta:  'time.strptime',
  },
};
