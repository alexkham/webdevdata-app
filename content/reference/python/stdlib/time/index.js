// content/reference/python/stdlib/time/index.js — the time module hub

export const meta = {
  slug:        'index',
  name:        'time',
  signature:   'import time',
  blurb:       'Clocks, pauses and C-style time conversions: time(), perf_counter(), sleep(), gmtime/localtime/mktime, strftime/strptime and the struct_time they share.',
  category:    'dates',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'time module python time time.time time.sleep perf_counter monotonic process_time unix timestamp epoch seconds gmtime localtime mktime strftime strptime struct_time asctime ctime timezone tzname measure elapsed time benchmark',
};

export const method = {
  slug: 'index',
  name: 'time',

  category:    'Dates & times',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Three jobs in one module: read clocks (time() for "now", perf_counter() for measuring), pause (sleep()), and convert between epoch seconds, struct_time and text. Most functions are thin wrappers over the C library, so some results depend on your operating system.',

  coverClasses: ['struct_time'],

  // public names that exist on other platforms but not on Windows (the
  // audit lists dir(time) on Windows): the Linux names from CPython 3.12 on
  // WSL, plus the BSD, macOS and Solaris clock ids from docs.python.org
  platformNames: [
    'CLOCK_BOOTTIME', 'CLOCK_HIGHRES', 'CLOCK_MONOTONIC', 'CLOCK_MONOTONIC_RAW', 'CLOCK_MONOTONIC_RAW_APPROX',
    'CLOCK_PROCESS_CPUTIME_ID', 'CLOCK_PROF', 'CLOCK_REALTIME', 'CLOCK_TAI', 'CLOCK_THREAD_CPUTIME_ID',
    'CLOCK_UPTIME', 'CLOCK_UPTIME_RAW', 'CLOCK_UPTIME_RAW_APPROX',
    'clock_getres', 'clock_gettime', 'clock_gettime_ns', 'clock_settime', 'clock_settime_ns',
    'pthread_getcpuclockid', 'tzset',
  ],

  imports: ['import time', 'from time import perf_counter, sleep, strftime, gmtime'],
  facts: [
    { label: 'Clocks',      value: 'time() / time_ns() for the wall clock; monotonic(), perf_counter(), process_time(), thread_time() for durations; each has an _ns twin that returns int nanoseconds (3.7+)' },
    { label: 'Conversions', value: 'gmtime / localtime: seconds → struct_time; calendar.timegm / mktime: back; strftime / strptime: struct_time ⇄ text; asctime / ctime: fixed text' },
    { label: 'Epoch',       value: 'January 1, 1970, 00:00:00 UTC on all platforms; Windows and POSIX systems do not count leap seconds' },
    { label: 'Source',      value: 'Modules/timemodule.c over the platform C library; strptime is pure Python (Lib/_strptime.py)' },
  ],

  modes: [
    {
      id: 'utc',
      label: 'epoch → UTC',
      blurb: 'A Unix timestamp (seconds since 1970-01-01 UTC) becomes a struct_time with gmtime, then text with strftime.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: "import time\nst = time.gmtime({$seconds})\ntime.strftime('%Y-%m-%d %H:%M:%S UTC', st)",
      cases: [
        { id: 'epoch',    label: 'the epoch',        values: { seconds: '0' } },
        { id: 'recent',   label: '1.79 billion',     values: { seconds: '1790000000' } },
        { id: 'billion',  label: '1 billion',        values: { seconds: '1000000000' } },
        { id: 'y2038',    label: '2**31',            values: { seconds: '2147483648' } },
        { id: 'fraction', label: 'with a fraction',  values: { seconds: '1790000000.999' } },
        { id: 'text',     label: 'not a number',     values: { seconds: 'now' } },
      ],
    },
    {
      id: 'reformat',
      label: 'reformat a date',
      blurb: 'strptime reads text in one layout, strftime writes it in another - the classic "convert this date string" task.',
      params: [
        { name: 'text',      type: 'str', hint: 'the date text',         input: 'text' },
        { name: 'informat',  type: 'str', hint: 'its strptime format',   input: 'text' },
        { name: 'outformat', type: 'str', hint: 'the strftime format',   input: 'text' },
      ],
      template: 'import time\nst = time.strptime({$text}, {$informat})\ntime.strftime({$outformat}, st)',
      cases: [
        { id: 'dmy',      label: 'dd/mm/yyyy → ISO',    values: { text: '29/09/2026', informat: '%d/%m/%Y', outformat: '%Y-%m-%d' } },
        { id: 'ampm',     label: '12-hour → 24-hour',   values: { text: 'Sep 29 2026 2:30PM', informat: '%b %d %Y %I:%M%p', outformat: '%H:%M on %A' } },
        { id: 'mismatch', label: 'wrong format',        values: { text: '2026-09-29', informat: '%d/%m/%Y', outformat: '%Y' } },
        { id: 'feb30',    label: '30 February',         values: { text: '30/02/2026', informat: '%d/%m/%Y', outformat: '%Y-%m-%d' } },
      ],
    },
    {
      id: 'parts',
      label: 'struct_time fields',
      blurb: 'A struct_time is a 9-item tuple with names: year, month, day, hour, minute, second, weekday (Monday = 0), day of the year, DST flag.',
      params: [{ name: 'seconds', type: 'int | float', hint: 'seconds since the epoch', input: 'auto' }],
      template: "import time\nst = time.gmtime({$seconds})\n(st.tm_year, st.tm_yday, ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')[st.tm_wday])",
      cases: [
        { id: 'epoch',  label: 'the epoch',    values: { seconds: '0' } },
        { id: 'recent', label: '1.79 billion', values: { seconds: '1790000000' } },
      ],
    },
  ],
  demoExplainer: 'gmtime drops the fraction of a second (1790000000.999 still prints 14:13:20) and needs a real number - text such as "now" raises TypeError. 2**31 seconds after the epoch is 2038-01-19 03:14:08 UTC, the moment a signed 32-bit time_t overflows; 64-bit Linux and Windows builds of Python use a 64-bit time_t, so it converts fine. In the reformat tab, strptime validates the date, which is why 30 February fails. The demo follows Linux for anything platform-specific (see the gmtime and strftime pages).',

  patterns: [
    {
      name: 'Time a block of code',
      desc: 'perf_counter is monotonic and has the best resolution; only the difference of two readings means anything.',
      code: 'import time\nstart = time.perf_counter()\nresult = do_work()\nelapsed = time.perf_counter() - start\nprint(f"took {elapsed:.3f} s")',
    },
    {
      name: 'Current Unix timestamp',
      desc: 'Seconds since the epoch as an int, or milliseconds like JavaScript Date.now().',
      code: 'import time\nseconds = int(time.time())\nmillis = time.time_ns() // 1_000_000',
    },
    {
      name: 'Timestamp → readable UTC',
      desc: 'gmtime converts in UTC, so the text is the same on every machine.',
      code: "import time\nlabel = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime(ts))",
    },
    {
      name: 'Retry with growing pauses',
      desc: 'sleep between attempts; double the wait each time and cap it.',
      code: 'import time\nfor attempt in range(5):\n    try:\n        fetch()\n        break\n    except ConnectionError:\n        time.sleep(min(2 ** attempt, 30))',
    },
    {
      name: 'Deadline loop',
      desc: 'Use monotonic for timeouts: it cannot jump when someone changes the system clock.',
      code: 'import time\ndeadline = time.monotonic() + 10\nwhile not ready():\n    if time.monotonic() > deadline:\n        raise TimeoutError("not ready after 10 s")\n    time.sleep(0.1)',
    },
  ],

  examples: [
    { title: 'The epoch',                    code: 'import time\ntime.gmtime(0)', returns: 'time.struct_time(tm_year=1970, tm_mon=1, tm_mday=1, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=1, tm_isdst=0)' },
    { title: 'Timestamp → text (UTC)',       code: "import time\ntime.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(1790000000))", returns: "'2026-09-21 14:13:20'" },
    { title: 'And back to seconds',          code: 'import calendar, time\ncalendar.timegm(time.gmtime(1790000000))', returns: '1790000000' },
    { title: 'Text → struct_time',           code: "import time\ntime.strptime('2026-09-29 14:30', '%Y-%m-%d %H:%M')[:6]", returns: '(2026, 9, 29, 14, 30, 0)' },
    { title: 'float seconds or int nanoseconds', code: 'import time\n(type(time.time()).__name__, type(time.time_ns()).__name__)', returns: "('float', 'int')" },
    { title: 'perf_counter never goes back', code: 'import time\na = time.perf_counter()\nb = time.perf_counter()\nb >= a', returns: 'True' },
    { title: 'sleep rejects negative times', code: 'import time\ntime.sleep(-1)', returns: 'ValueError: sleep length must be non-negative' },
  ],

  pitfalls: [
    {
      name: 'Measuring durations with time.time()',
      desc: 'time() is the wall clock: NTP or a user can set it, so the difference of two readings can be wrong or even negative. get_clock_info shows which clocks are adjustable.',
      wrong: { label: 'time()',         code: "import time\ntime.get_clock_info('time').adjustable", output: 'True' },
      fix:   { label: 'perf_counter()', code: "import time\ntime.get_clock_info('perf_counter').adjustable", output: 'False' },
    },
    {
      name: 'Two weekday numberings',
      desc: 'struct_time.tm_wday counts Monday = 0, but the strftime directive %w counts Sunday = 0. The epoch was a Thursday.',
      wrong: { label: 'tm_wday',  code: 'import time\ntime.gmtime(0).tm_wday', output: '3' },
      fix:   { label: '%w and %A', code: "import time\ntime.strftime('%w %A', time.gmtime(0))", output: "'4 Thursday'" },
    },
    {
      name: 'Changing a struct_time field',
      desc: 'struct_time is an immutable tuple. Build a new one from the old values instead.',
      wrong: { label: 'assign',  code: 'import time\nst = time.gmtime(0)\nst.tm_year = 2027', output: 'AttributeError: readonly attribute' },
      fix:   { label: 'rebuild', code: 'import time\nst = time.gmtime(0)\ntime.struct_time((2027,) + tuple(st)[1:])', output: 'time.struct_time(tm_year=2027, tm_mon=1, tm_mday=1, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=1, tm_isdst=0)' },
    },
  ],

  when: {
    use: [
      'Measuring how long code takes → perf_counter() / perf_counter_ns()',
      'Unix timestamps for logs, caches, APIs and JWT claims → time() / time_ns()',
      'Pausing a script, polling, rate limiting and retries → sleep()',
      'Quick formatting or parsing where a struct_time is enough → strftime / strptime',
    ],
    avoid: [
      'Date arithmetic, time zones and ISO 8601 → datetime (and zoneinfo for named zones)',
      'Benchmarking small snippets → timeit, which repeats and disables garbage collection',
      'Waiting inside async code → await asyncio.sleep(), which does not block the event loop',
    ],
  },

  notes: {
    cpython:        'Modules/timemodule.c; time(), monotonic() and perf_counter() read their clocks through Python/pytime.c, process_time() and thread_time() in timemodule.c itself; strptime imports Lib/_strptime.py, the same parser datetime.strptime uses',
    'Platforms':    'gmtime, localtime, mktime and strftime call the C library. On Windows gmtime rejects timestamps before 1969-12-31 12:00 UTC, localtime rejects every negative one, and strftime rejects non-standard directives such as %-d - Linux accepts all three',
    'Time zones':   'Local time comes from the machine (TZ variable, /etc/localtime, Windows settings). timezone, altzone, daylight and tzname describe it; tm_gmtoff and tm_zone of localtime() are more reliable',
    'No months':    'The module has no date arithmetic - adding days means adding 86400 seconds; use datetime.timedelta for anything calendar-aware',
  },

  related: [
    { name: 'time.perf_counter', slug: 'perf-counter', when: 'Measuring durations' },
    { name: 'time.time',         slug: 'time',         when: 'The current Unix timestamp' },
    { name: 'time.strftime',     slug: 'strftime',     when: 'Format codes and platform differences' },
    { name: 'struct_time',       slug: 'struct-time',  when: 'The tuple every conversion uses' },
    { name: 'datetime module',   slug: 'datetime',     when: 'Dates, durations and time zones as objects', category: 'stdlib' },
    { name: 'datetime.fromtimestamp', slug: 'fromtimestamp', when: 'Epoch seconds → datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'How do I get the current Unix timestamp in Python?',
      a: 'time.time() returns seconds since 1970-01-01 UTC as a float; int(time.time()) gives whole seconds and time.time_ns() an exact int of nanoseconds (Python 3.7+). For milliseconds like JavaScript Date.now() use time.time_ns() // 1_000_000.',
    },
    {
      q: 'How do I measure how long my code takes?',
      a: 'Take start = time.perf_counter() before and time.perf_counter() - start after. perf_counter is monotonic, so the result is never distorted by clock changes. Do not use time.time() for this, and use the timeit module when comparing tiny snippets.',
    },
    {
      q: 'What is the difference between the time and datetime modules?',
      a: 'time works with numbers (seconds since the epoch) and the 9-field struct_time, close to the C library. datetime has real objects - date, datetime, timedelta, timezone - with arithmetic, comparisons and ISO 8601 parsing. Use time for clocks and sleeping, datetime for dates.',
    },
    {
      q: 'How do I convert a timestamp to a date string?',
      a: "time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts)) gives UTC; use time.localtime(ts) instead of gmtime for the machine's local time. datetime.fromtimestamp(ts, tz=timezone.utc).isoformat() does the same with datetime.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html',
    meta:  'time — Time access and conversions',
  },
};
