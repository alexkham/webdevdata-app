// content/reference/python/stdlib/time/asctime-ctime.js
// time.asctime and time.ctime - the fixed 24-character C layout

export const meta = {
  slug:        'asctime-ctime',
  name:        'time.asctime / time.ctime',
  signature:   'time.asctime([time_tuple]) / time.ctime(seconds=None, /)',
  blurb:       "Format a time as the fixed C layout 'Tue Sep 29 14:30:05 2026': asctime() from a struct_time or tuple, ctime() from epoch seconds in local time.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.asctime asctime time.ctime ctime python readable time string Tue Sep 29 14:30:05 2026 format timestamp human readable c layout illegal time tuple argument weekday',
};

export const method = {
  slug:      'asctime-ctime',
  name:      'time.asctime / time.ctime',
  signature: 'time.asctime([time_tuple]) / time.ctime(seconds=None, /)',
  returns:   { type: 'str', desc: "Weekday, month, day padded to two characters, HH:MM:SS and the year - e.g. 'Sat Sep  5 08:00:00 2026'. No trailing newline." },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'One fixed, locale-independent layout for logs and quick output. asctime formats a tuple you give it - trusting its weekday field - and ctime(t) is simply asctime(localtime(t)).',

  covers: ['asctime', 'ctime'],

  cheat: {
    commonCall: 'time.asctime(time.gmtime(ts))  ·  time.ctime(ts)',
    returns:    "'Mon Sep 21 14:13:20 2026'",
    replaces:   "strftime('%a %b %d %H:%M:%S %Y') with the day space-padded",
    watchOut:   'asctime prints the weekday field as given - it does not compute it',
  },

  parameters: [
    { name: 'time_tuple', type: 'struct_time | tuple', required: false, default: 'localtime()', desc: 'asctime(): 9 fields as from gmtime or localtime; omitted means the current local time (None is not accepted: TypeError: Tuple or struct_time argument required). Fields are range-checked (month out of range, ...).' },
    { name: 'seconds',    type: 'int | float | None',  required: false, default: 'None', desc: 'ctime(): seconds since the epoch, shown in local time; None or omitted means now.' },
  ],

  modes: [
    {
      id: 'fields',
      label: 'asctime(tuple)',
      blurb: 'Type the fields yourself. asctime checks the ranges, but takes the weekday (Monday = 0) as given.',
      params: [
        { name: 'year',    type: 'int', hint: 'any year',            input: 'number' },
        { name: 'month',   type: 'int', hint: '1-12',                input: 'number' },
        { name: 'day',     type: 'int', hint: '1-31',                input: 'number' },
        { name: 'hour',    type: 'int', hint: '0-23',                input: 'number' },
        { name: 'minute',  type: 'int', hint: '0-59',                input: 'number' },
        { name: 'second',  type: 'int', hint: '0-61',                input: 'number' },
        { name: 'weekday', type: 'int', hint: 'Monday = 0',          input: 'number' },
      ],
      template: 'import time\ntime.asctime(({$year}, {$month}, {$day}, {$hour}, {$minute}, {$second}, {$weekday}, 1, 0))',
      cases: [
        { id: 'right',  label: 'correct weekday', values: { year: '2026', month: '9', day: '29', hour: '14', minute: '30', second: '5', weekday: '1' } },
        { id: 'wrong',  label: 'wrong weekday',   values: { year: '2026', month: '9', day: '29', hour: '14', minute: '30', second: '5', weekday: '4' } },
        { id: 'pad',    label: 'single-digit day', values: { year: '2026', month: '9', day: '5', hour: '8', minute: '0', second: '0', weekday: '5' } },
        { id: 'wrap',   label: 'weekday 7',       values: { year: '2026', month: '9', day: '29', hour: '14', minute: '30', second: '5', weekday: '7' } },
        { id: 'month',  label: 'month 13',        values: { year: '2026', month: '13', day: '29', hour: '14', minute: '30', second: '5', weekday: '1' } },
      ],
    },
    {
      id: 'utc',
      label: 'ctime in UTC',
      blurb: 'ctime(t) depends on your time zone; asctime(gmtime(t)) is the same layout in UTC.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: 'import time\ntime.asctime(time.gmtime({$seconds}))',
      cases: [
        { id: 'epoch',  label: '0',          values: { seconds: '0' } },
        { id: 'recent', label: '1790000000', values: { seconds: '1790000000' } },
      ],
    },
  ],
  demoExplainer: 'asctime looks up the weekday name from the 7th field, so a wrong value prints a wrong day (2026-09-29 is a Tuesday) and 7 wraps around to Monday. The day of the month is right-aligned in two characters, which gives the double space in "Sep  5". Month 13 is caught by the same range check strftime uses.',

  patterns: [
    {
      name: 'Quick log line',
      desc: 'Readable, fixed width, no format string to remember.',
      code: 'import time\nprint(f"[{time.ctime()}] job started")',
    },
    {
      name: 'The same layout in UTC',
      desc: 'Independent of the server time zone.',
      code: 'import time\nprint(time.asctime(time.gmtime()))',
    },
    {
      name: 'Parse it back',
      desc: "strptime's default format is exactly this layout.",
      code: 'import time\nst = time.strptime(time.ctime())',
    },
  ],

  examples: [
    { title: 'A struct_time as text',            code: 'import time\ntime.asctime((2026, 9, 29, 14, 30, 5, 1, 272, 0))', returns: "'Tue Sep 29 14:30:05 2026'" },
    { title: 'Single-digit days are space-padded', code: 'import time\ntime.asctime((2026, 9, 5, 8, 0, 0, 5, 248, 0))', returns: "'Sat Sep  5 08:00:00 2026'" },
    { title: 'The epoch in UTC',                 code: 'import time\ntime.asctime(time.gmtime(0))', returns: "'Thu Jan  1 00:00:00 1970'" },
    { title: 'ctime(t) is asctime(localtime(t))', code: 'import time\ntime.ctime(1790000000) == time.asctime(time.localtime(1790000000))', returns: 'True' },
    { title: 'Always 24 characters (4-digit years)', code: 'import time\nlen(time.ctime())', returns: '24' },
    { title: 'strptime reads it back by default', code: 'import time\ntime.strptime(time.asctime(time.gmtime(0)))[:6]', returns: '(1970, 1, 1, 0, 0, 0)' },
    { title: 'All nine fields are required',     code: 'import time\ntime.asctime((2026, 9, 29))', returns: 'TypeError: asctime(): illegal time tuple argument' },
  ],

  pitfalls: [
    {
      name: 'asctime trusts the weekday field',
      desc: 'Building the tuple by hand with weekday 0 labels every date a Monday. Let Python compute the fields - strptime, gmtime or localtime fill tm_wday correctly.',
      wrong: { label: 'hand-made tuple', code: 'import time\ntime.asctime((2026, 9, 29, 14, 30, 0, 0, 0, 0))', output: "'Mon Sep 29 14:30:00 2026'" },
      fix:   { label: 'strptime',        code: "import time\ntime.asctime(time.strptime('2026-09-29 14:30', '%Y-%m-%d %H:%M'))", output: "'Tue Sep 29 14:30:00 2026'" },
    },
    {
      name: 'Using it where ISO 8601 is expected',
      desc: 'The C layout is for people. APIs, JSON and file names want ISO 8601, which sorts correctly as text.',
      wrong: { label: 'asctime',  code: 'import time\ntime.asctime(time.gmtime(0))', output: "'Thu Jan  1 00:00:00 1970'" },
      fix:   { label: 'strftime', code: "import time\ntime.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(0))", output: "'1970-01-01T00:00:00Z'" },
    },
  ],

  when: {
    use: [
      'Human-readable timestamps in console output and simple logs',
      'Matching the classic C / Unix date layout (ctime, asctime)',
    ],
    avoid: [
      'Machine-readable or sortable text → ISO 8601 via strftime or datetime.isoformat()',
      'Localised month and day names → strftime with the locale, or babel',
      'Server code that must not depend on the host zone → asctime(gmtime(t)), not ctime(t)',
    ],
  },

  notes: {
    cpython:        '_asctime in Modules/timemodule.c builds the text itself with "%s %s%3d %.2d:%.2d:%.2d %d" and English names - the C library and the locale are never consulted, and no newline is added (unlike C asctime)',
    'Checks':       'asctime runs the same checks as strftime: month out of range, day of month out of range, hour/minute/seconds out of range; 0 is accepted for month, day and day of year',
    'Weekday':      'The weekday field is shifted by one and reduced modulo 7 with C remainder rules: 7 prints Mon, -1 prints Sun, -2 raises ValueError: day of week out of range',
    'ctime':        'ctime(t) converts with the local time zone, so the same t prints differently on machines in different zones',
  },

  related: [
    { name: 'time.strftime',   slug: 'strftime',         when: 'Any other layout' },
    { name: 'time.strptime',   slug: 'strptime',         when: 'Parse this layout back' },
    { name: 'localtime / mktime', slug: 'localtime-mktime', when: 'What ctime converts with' },
    { name: 'time.gmtime',     slug: 'gmtime',           when: 'UTC fields for asctime' },
    { name: 'time module',     slug: 'time',             when: 'Overview', category: 'stdlib' },
    { name: 'datetime.ctime',  slug: 'ctime',            when: 'The same layout from a datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'What is the difference between time.ctime() and time.asctime()?',
      a: 'ctime takes seconds since the epoch and converts them to local time first; asctime takes a struct_time or 9-tuple you already have. ctime(t) equals asctime(localtime(t)), and both produce the same 24-character layout.',
    },
    {
      q: 'Why is there a double space in "Sep  5"?',
      a: 'The day of the month is right-aligned in a two-character field, so days 1-9 get a leading space. That keeps the string at a fixed width of 24 characters for four-digit years.',
    },
    {
      q: 'Does time.ctime() depend on the locale?',
      a: 'No. The weekday and month names are always English (Mon, Sep, ...). Use strftime with %a and %b for locale-dependent names.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.asctime',
    meta:  'time.asctime / time.ctime',
  },
};
