// content/reference/python/stdlib/time/strftime.js

export const meta = {
  slug:        'strftime',
  name:        'time.strftime',
  signature:   'time.strftime(format[, time_tuple])',
  blurb:       'Format a struct_time or 9-tuple as text with %-directives such as %Y-%m-%d %H:%M:%S; without a tuple it formats the current local time.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.strftime strftime python format time format codes directives %Y %m %d %H %M %S %a %A %b %B %j %U %W %p %I %y %c %x %X %z %Z %G %V timestamp to string date format month out of range Invalid format string strftime requires year in [1; 9999] remove leading zero %-d %#d',
};

export const method = {
  slug:      'strftime',
  name:      'time.strftime',
  signature: 'time.strftime(format[, time_tuple])',
  returns:   { type: 'str', desc: 'The format with every directive replaced; other characters are copied unchanged.' },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'The C strftime() behind a Python call: the portable directives work everywhere, everything else (flags like %-d, %z, %Z, years outside 1-9999) is whatever your platform C library does.',

  covers: ['strftime'],

  cheat: {
    commonCall: "time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts))",
    returns:    "'2026-09-21 14:13:20'",
    replaces:   'Hand-built f-strings with zero padding',
    watchOut:   '%m is month, %M is minute; the tuple must be a tuple or struct_time',
  },

  parameters: [
    { name: 'format',     type: 'str', required: true, default: null, desc: 'Text with %-directives (table below). %% is a literal percent sign.' },
    { name: 'time_tuple', type: 'struct_time | tuple', required: false, default: 'localtime()', desc: 'Nine fields as from gmtime(), localtime() or strptime(). Omitted means the current local time. Fields are range-checked; 0 is accepted for month, day of month and day of year.' },
  ],

  attributes: [
    { name: '%Y / %y',      type: "'2026' / '26'",          meaning: 'Year with / without century.' },
    { name: '%m / %B / %b', type: "'09' / 'September' / 'Sep'", meaning: 'Month number, full name, abbreviated name (English in the default C locale).' },
    { name: '%d',           type: "'29'",                   meaning: 'Day of the month, zero-padded.' },
    { name: '%H / %I / %p', type: "'14' / '02' / 'PM'",     meaning: 'Hour on the 24-hour clock, on the 12-hour clock, AM/PM.' },
    { name: '%M / %S',      type: "'30' / '05'",            meaning: 'Minute and second, zero-padded. Seconds go up to 61 in the tuple.' },
    { name: '%A / %a / %w', type: "'Tuesday' / 'Tue' / '2'", meaning: 'Weekday name, abbreviation, number with Sunday = 0 (the tuple itself counts Monday = 0).' },
    { name: '%j',           type: "'272'",                  meaning: 'Day of the year, 001-366.' },
    { name: '%U / %W',      type: "'39' / '39'",            meaning: 'Week of the year, weeks starting Sunday / Monday; days before the first one are week 00.' },
    { name: '%G / %V / %u', type: "'2026' / '40' / '2'",    meaning: 'ISO 8601 year, week and weekday (Monday = 1).' },
    { name: '%c / %x / %X', type: "'Tue Sep 29 14:30:05 2026' / '09/29/26' / '14:30:05'", meaning: 'Locale date and time, date, time (C locale shown).' },
    { name: '%C %D %e %F %g %h %R %r %T', type: "'20' '09/29/26' '29' '2026-09-29' ...", meaning: 'Accepted by both glibc (Linux) and the Windows C runtime, though not in the documented ANSI C set.' },
    { name: '%z / %Z',      type: 'offset / zone name',     meaning: 'From the C library: Windows always prints the local zone of the machine; Linux reads tm_gmtoff / tm_zone, so a gmtime() struct gives +0000 GMT.' },
    { name: '%-d %_d %5d %k %l %P %s', type: "'5' ' 5' (day 5) ...", meaning:'glibc only. Windows raises ValueError: Invalid format string; its own spelling for "no leading zero" is %#d.' },
    { name: '%%',           type: "'%'",                    meaning: 'A literal percent sign.' },
  ],

  modes: [
    {
      id: 'format',
      label: 'format',
      blurb: 'The tuple is fixed: Tuesday 2026-09-29 14:30:05, day 272 of the year. Change the format.',
      params: [{ name: 'fmt', type: 'str', hint: 'a strftime format', input: 'text' }],
      template: 'import time\ntime.strftime({$fmt}, (2026, 9, 29, 14, 30, 5, 1, 272, 0))',
      cases: [
        { id: 'sortable', label: 'sortable',        values: { fmt: '%Y-%m-%d %H:%M:%S' } },
        { id: 'long',     label: 'long names',      values: { fmt: '%A %d %B %Y, %H:%M' } },
        { id: 'rfc',      label: 'RFC 5322',        values: { fmt: '%a, %d %b %Y %H:%M:%S +0000' } },
        { id: 'ampm',     label: '12-hour',         values: { fmt: '%I:%M %p' } },
        { id: 'weeks',    label: 'day & week',      values: { fmt: 'day %j, week %U (Sun) / %W (Mon), ISO %G-W%V-%u' } },
        { id: 'compact',  label: 'compact',         values: { fmt: '%y%m%d-%H%M%S' } },
        { id: 'locale',   label: '%c %x %X',        values: { fmt: '%c | %x | %X' } },
      ],
    },
    {
      id: 'fields',
      label: 'field checks',
      blurb: 'Now the format is fixed and you type the fields. strftime checks each range - but not whether the day exists in that month.',
      params: [
        { name: 'year',   type: 'int', hint: 'year',  input: 'number' },
        { name: 'month',  type: 'int', hint: '1-12',  input: 'number' },
        { name: 'day',    type: 'int', hint: '1-31',  input: 'number' },
        { name: 'hour',   type: 'int', hint: '0-23',  input: 'number' },
        { name: 'minute', type: 'int', hint: '0-59',  input: 'number' },
        { name: 'second', type: 'int', hint: '0-61',  input: 'number' },
      ],
      template: "import time\ntime.strftime('%Y-%m-%d %H:%M:%S', ({$year}, {$month}, {$day}, {$hour}, {$minute}, {$second}, 0, 1, -1))",
      cases: [
        { id: 'ok',     label: 'valid',          values: { year: '2026', month: '9',  day: '29', hour: '14', minute: '30', second: '5' } },
        { id: 'zeros',  label: 'month/day 0',    values: { year: '2026', month: '0',  day: '0',  hour: '14', minute: '30', second: '5' } },
        { id: 'feb31',  label: '31 February',    values: { year: '2026', month: '2',  day: '31', hour: '14', minute: '30', second: '5' } },
        { id: 'month',  label: 'month 13',       values: { year: '2026', month: '13', day: '1',  hour: '14', minute: '30', second: '5' } },
        { id: 'hour',   label: 'hour 24',        values: { year: '2026', month: '9',  day: '29', hour: '24', minute: '30', second: '5' } },
      ],
    },
  ],
  demoExplainer: 'Month 0 and day 0 are quietly replaced by 1, and 31 February prints as if it existed: strftime only checks each field against its own range (month 1-12, day 1-31, hour 0-23 ...). For directives outside the portable set the demo follows Linux: %-d prints 29 there, while Windows raises ValueError: Invalid format string; %z and %Z are refused because they depend on the machine.',

  patterns: [
    {
      name: 'ISO 8601 in UTC',
      desc: 'Sortable as text, unambiguous, understood by every API.',
      code: "import time\nstamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())",
    },
    {
      name: 'Date-stamped file name',
      desc: 'No spaces or colons, which some file systems reject.',
      code: "import time\nname = time.strftime('backup-%Y%m%d-%H%M%S.tar.gz')",
    },
    {
      name: 'HTTP / email date header',
      desc: 'RFC 5322 style in UTC; the names stay English as long as the program keeps the default C locale.',
      code: "import time\nheader = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime(ts))",
    },
    {
      name: 'Day without a leading zero, portably',
      desc: '%-d is Linux-only and %#d Windows-only; format that field yourself.',
      code: "import time\nst = time.gmtime(ts)\nlabel = f\"{st.tm_mday} {time.strftime('%B %Y', st)}\"",
    },
  ],

  examples: [
    { title: 'RFC 5322 date (docs example)',  code: "import time\ntime.strftime('%a, %d %b %Y %H:%M:%S +0000', time.gmtime(0))", returns: "'Thu, 01 Jan 1970 00:00:00 +0000'" },
    { title: 'ISO 8601 in UTC',              code: "import time\ntime.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(1790000000))", returns: "'2026-09-21T14:13:20Z'" },
    { title: '12-hour clock',                code: "import time\ntime.strftime('%I:%M %p', (2026, 9, 29, 14, 30, 5, 1, 272, 0))", returns: "'02:30 PM'" },
    { title: 'Day of the year and weeks',    code: "import time\ntime.strftime('day %j, week %U (Sun) / %W (Mon)', (2026, 9, 29, 14, 30, 5, 1, 272, 0))", returns: "'day 272, week 39 (Sun) / 39 (Mon)'" },
    { title: 'Zero fields are allowed',      code: "import time\ntime.strftime('%Y-%m-%d', (2026, 0, 0, 0, 0, 0, 0, 0, 0))", returns: "'2026-01-01'" },
    { title: '%% is a literal percent',      code: "import time\ntime.strftime('%%Y prints %Y', (2026, 9, 29, 14, 30, 5, 1, 272, 0))", returns: "'%Y prints 2026'" },
    { title: 'Ranges are checked',           code: "import time\ntime.strftime('%Y-%m-%d', (2026, 13, 1, 0, 0, 0, 0, 1, -1))", returns: 'ValueError: month out of range' },
    { title: 'Nine fields, no fewer',        code: "import time\ntime.strftime('%Y', (2026, 9, 29))", returns: 'TypeError: strftime(): illegal time tuple argument' },
  ],

  pitfalls: [
    {
      name: '%M is minutes, %m is months',
      desc: 'Both are valid, so the mix-up prints a plausible wrong date instead of failing.',
      wrong: { label: '%M', code: "import time\ntime.strftime('%Y-%M-%d', (2026, 9, 29, 14, 5, 0, 1, 272, 0))", output: "'2026-05-29'" },
      fix:   { label: '%m', code: "import time\ntime.strftime('%Y-%m-%d', (2026, 9, 29, 14, 5, 0, 1, 272, 0))", output: "'2026-09-29'" },
    },
    {
      name: 'Passing a datetime',
      desc: 'time.strftime needs a tuple or struct_time. Convert with timetuple() - or simply call the datetime\'s own strftime method.',
      wrong: { label: 'datetime',    code: "import time\nfrom datetime import datetime\ntime.strftime('%Y-%m-%d', datetime(2026, 9, 29))", output: 'TypeError: Tuple or struct_time argument required' },
      fix:   { label: 'timetuple()', code: "import time\nfrom datetime import datetime\ntime.strftime('%Y-%m-%d', datetime(2026, 9, 29).timetuple())", output: "'2026-09-29'" },
    },
    {
      name: 'Passing a list',
      desc: 'Fields collected in a list must become a tuple first.',
      wrong: { label: 'list',  code: "import time\ntime.strftime('%Y-%m-%d', [2026, 9, 29, 0, 0, 0, 1, 272, -1])", output: 'TypeError: Tuple or struct_time argument required' },
      fix:   { label: 'tuple', code: "import time\ntime.strftime('%Y-%m-%d', tuple([2026, 9, 29, 0, 0, 0, 1, 272, -1]))", output: "'2026-09-29'" },
    },
  ],

  when: {
    use: [
      'Turning gmtime() / localtime() / strptime() results into text',
      'File names, log prefixes and report headers',
      'Formatting the current local time in one call: time.strftime(fmt)',
    ],
    avoid: [
      'datetime objects → dt.strftime(fmt), f"{dt:%Y-%m-%d}" or dt.isoformat()',
      'Microseconds (%f) → only datetime.strftime supports them',
      'Portable code with %z / %Z, %-d or years before 1000 → build that part yourself',
    ],
  },

  notes: {
    cpython:        'time_strftime in Modules/timemodule.c: gettmarg() and checktm() validate the tuple, then the C strftime() formats it. Since Python 3.13.1 and 3.12.8 the format goes to the C library in ASCII pieces, so non-ASCII text and NUL characters are copied unchanged; earlier versions raised ValueError: embedded null character for a NUL',
    'Windows':      'Extra rules on Windows: year must be in [1; 9999] (ValueError: strftime() requires year in [1; 9999]), %y needs a year >= 1900, %S rejects 61, years below 1000 are zero-padded by %Y (0999 - Linux prints 999)',
    'Locale':       '%a %A %b %B %c %p %x %X follow LC_TIME; Python starts in the C locale, so they are English until locale.setlocale changes it',
  },

  related: [
    { name: 'time.strptime',   slug: 'strptime',     when: 'The reverse: text → struct_time' },
    { name: 'time.gmtime',     slug: 'gmtime',       when: 'A struct_time in UTC to format' },
    { name: 'asctime / ctime', slug: 'asctime-ctime', when: 'One fixed layout, no format string' },
    { name: 'struct_time',     slug: 'struct-time',  when: 'The tuple strftime formats' },
    { name: 'time module',     slug: 'time',         when: 'Overview', category: 'stdlib' },
    { name: 'datetime.strftime', slug: 'strftime-strptime', when: 'The datetime version, with %f and %:z', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'How do I format the current time in Python?',
      a: "time.strftime('%Y-%m-%d %H:%M:%S') formats the current local time; time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime()) gives UTC. With datetime: datetime.now().strftime(...).",
    },
    {
      q: 'Why do I get ValueError: Invalid format string?',
      a: 'You are on Windows and the format contains a directive or flag its C runtime does not know - typically %-d, %-m, %_d, %k, %l, %P or %s, which are glibc (Linux) extensions. Use the portable directives, or %#d on Windows to drop leading zeros.',
    },
    {
      q: 'How do I remove the leading zero from the day or hour?',
      a: 'On Linux %-d and %-I; on Windows %#d and %#I. Neither works on the other platform, so for portable code insert the number yourself, e.g. f"{st.tm_mday}".',
    },
    {
      q: 'What is the difference between time.strftime and datetime.strftime?',
      a: 'They share the C strftime, but datetime.strftime first expands %f (microseconds), %z, %:z and %Z from the datetime itself, so offsets come out right on every platform. time.strftime passes %z and %Z straight to the C library.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.strftime',
    meta:  'time.strftime',
  },
};
