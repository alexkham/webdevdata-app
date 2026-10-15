// content/reference/python/stdlib/time/localtime-mktime.js
// time.localtime and its inverse time.mktime

export const meta = {
  slug:        'localtime-mktime',
  name:        'time.localtime / time.mktime',
  signature:   'time.localtime(seconds=None, /) / time.mktime(time_tuple, /)',
  blurb:       "Convert epoch seconds to a struct_time in the machine's local time zone (localtime), and a local struct_time back to epoch seconds (mktime).",
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions)',
  searchTerms: 'time.localtime localtime time.mktime mktime python local time timestamp to local time local struct_time to timestamp inverse of localtime dst tm_isdst -1 tm_gmtoff tm_zone time zone mktime argument out of range',
};

export const method = {
  slug:      'localtime-mktime',
  name:      'time.localtime / time.mktime',
  signature: 'time.localtime(seconds=None, /) / time.mktime(time_tuple, /)',
  returns:   { type: 'time.struct_time | float', desc: 'localtime(): the local calendar fields, with tm_isdst, tm_zone and tm_gmtoff filled in. mktime(): seconds since the epoch as a float.' },

  category:    'time function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: false,

  subtitle: 'The local-time pair: localtime() splits a timestamp using the time zone of the machine running Python, mktime() goes back. Results differ from one machine to the next, which is why this page has no live demo.',

  covers: ['localtime', 'mktime'],

  cheat: {
    commonCall: 'time.localtime(ts)  ·  time.mktime(st)',
    returns:    'struct_time in local time  ·  float seconds',
    replaces:   'Manual offset arithmetic with time.timezone',
    watchOut:   'mktime treats the tuple as LOCAL time - use calendar.timegm for UTC tuples',
  },

  parameters: [
    { name: 'seconds',    type: 'int | float | None', required: false, default: 'None', desc: 'localtime(): seconds since the epoch, floored to whole seconds; None means now.' },
    { name: 'time_tuple', type: 'struct_time | tuple', required: true, default: null, desc: 'mktime(): a struct_time or a 9-tuple of local time. Set the last field (tm_isdst) to -1 to let the C library decide whether DST applies.' },
  ],

  patterns: [
    {
      name: 'Local wall-clock text',
      desc: "What a person at this machine's clock would read.",
      code: "import time\nlabel = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(ts))",
    },
    {
      name: 'Local midnight as a timestamp',
      desc: 'Build the local fields, let mktime work out the offset and DST.',
      code: 'import time\nnow = time.localtime()\nmidnight = time.mktime((now.tm_year, now.tm_mon, now.tm_mday, 0, 0, 0, 0, 0, -1))',
    },
    {
      name: 'The current UTC offset',
      desc: 'tm_gmtoff (seconds east of UTC) and tm_zone are correct for that moment, DST included.',
      code: 'import time\nlt = time.localtime()\nprint(lt.tm_zone, lt.tm_gmtoff / 3600)',
    },
    {
      name: 'Add days in local time',
      desc: 'mktime normalises out-of-range fields, so day + 30 rolls into the next month.',
      code: 'import time\nlt = time.localtime()\nlater = time.mktime((lt.tm_year, lt.tm_mon, lt.tm_mday + 30, lt.tm_hour, lt.tm_min, lt.tm_sec, 0, 0, -1))',
    },
  ],

  examples: [
    { title: 'localtime returns a struct_time',   code: 'import time\ntype(time.localtime()).__name__', returns: "'struct_time'" },
    { title: 'mktime undoes localtime',           code: 'import time\ntime.mktime(time.localtime(1790000000))', returns: '1790000000.0' },
    { title: 'tm_gmtoff links local and UTC',     code: 'import calendar, time\nlt = time.localtime(1790000000)\ncalendar.timegm(lt) - lt.tm_gmtoff', returns: '1790000000' },
    { title: 'tm_isdst is filled in',             code: 'import time\ntime.localtime(1790000000).tm_isdst in (0, 1)', returns: 'True' },
    { title: 'mktime always returns a float',     code: 'import time\nisinstance(time.mktime(time.localtime()), float)', returns: 'True' },
    { title: 'mktime needs all nine fields',      code: 'import time\ntime.mktime((2026, 9, 29))', returns: 'TypeError: mktime(): illegal time tuple argument' },
  ],

  pitfalls: [
    {
      name: 'Out-of-range fields roll over silently',
      desc: 'mktime normalises the fields like the C function does: month 13 of 2026 is January 2027. strftime and asctime validate instead.',
      wrong: { label: 'mktime',   code: 'import time\ntime.mktime((2026, 13, 1, 0, 0, 0, 0, 0, -1)) == time.mktime((2027, 1, 1, 0, 0, 0, 0, 0, -1))', output: 'True' },
      fix:   { label: 'strftime', code: "import time\ntime.strftime('%Y-%m-%d', (2026, 13, 1, 0, 0, 0, 0, 1, -1))", output: 'ValueError: month out of range' },
    },
    {
      name: 'Passing a list',
      desc: 'Like every function that takes a time tuple, mktime accepts only a tuple or a struct_time.',
      wrong: { label: 'list',  code: 'import time\ntime.mktime([2026, 9, 29, 14, 30, 0, 0, 0, -1])', output: 'TypeError: Tuple or struct_time argument required' },
      fix:   { label: 'tuple', code: 'import time\nisinstance(time.mktime((2026, 9, 29, 14, 30, 0, 0, 0, -1)), float)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Showing times in the local zone of a desktop tool or script',
      'Local calendar arithmetic (tomorrow at 09:00) on a single machine',
      'Reading the current UTC offset and zone abbreviation (tm_gmtoff, tm_zone)',
    ],
    avoid: [
      'Servers, logs and stored data → gmtime / UTC, the same on every machine',
      'UTC tuples → calendar.timegm, not mktime',
      'Other people\'s time zones → datetime with zoneinfo.ZoneInfo("Europe/Paris")',
    ],
  },

  notes: {
    cpython:       'time_localtime calls localtime_r() on Unix and localtime_s() on Windows; time_mktime fills a struct tm with gettmarg() and calls the C mktime()',
    'Machine':     'The zone comes from the TZ environment variable, /etc/localtime or the Windows settings - the same code prints different results on different machines',
    'DST flag':    'mktime with tm_isdst = -1 lets the C library pick standard or summer time; 0 or 1 forces one, which shifts the result by the DST difference if it is wrong',
    'Range':       'On Windows localtime() raises OSError: [Errno 22] Invalid argument for any negative timestamp; Linux handles dates far before 1970. mktime raises OverflowError: mktime argument out of range when the C function fails',
    'No checks':   'Unlike strftime and asctime, mktime does not validate the fields (no "month out of range") - the C library normalises them',
  },

  related: [
    { name: 'time.gmtime',     slug: 'gmtime',          when: 'The UTC version' },
    { name: 'timezone / tzname', slug: 'timezone-tzname', when: 'The local zone as module constants' },
    { name: 'struct_time attributes', slug: 'struct-time-attributes', when: 'tm_isdst, tm_zone, tm_gmtoff' },
    { name: 'asctime / ctime', slug: 'asctime-ctime',   when: 'ctime(t) is asctime(localtime(t))' },
    { name: 'time module',     slug: 'time',            when: 'Overview', category: 'stdlib' },
    { name: 'datetime.astimezone', slug: 'astimezone',  when: 'Local time with datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: "localtime() and mktime() convert with the time zone of the machine running Python, so a live result would show our server's zone, not yours; Windows also rejects negative timestamps that Linux accepts. The examples only show results that hold in every zone, such as mktime(localtime(t)) == t.",
    },
    {
      q: 'What is the difference between time.localtime() and time.gmtime()?',
      a: "Both split a timestamp into a struct_time. gmtime uses UTC and gives the same result everywhere; localtime uses the time zone of the machine running Python, including daylight saving time, and fills tm_isdst, tm_zone and tm_gmtoff for it.",
    },
    {
      q: 'How do I convert a struct_time back to a timestamp?',
      a: 'time.mktime(st) if st is local time (from localtime or strptime of a local date); calendar.timegm(st) if st is UTC (from gmtime). Using the wrong one shifts the result by your UTC offset.',
    },
    {
      q: 'What does -1 mean as the last field of the tuple for mktime?',
      a: 'tm_isdst = -1 means "unknown": the C library decides whether daylight saving time applies on that date. Use it whenever you build the tuple yourself.',
    },
    {
      q: 'Why does time.localtime() give OSError for dates before 1970 on Windows?',
      a: 'Python calls the Windows C runtime localtime_s(), which rejects negative timestamps with [Errno 22] Invalid argument. Use datetime arithmetic (an aware epoch plus a timedelta) for older dates in portable code.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.localtime',
    meta:  'time.localtime / time.mktime',
  },
};
