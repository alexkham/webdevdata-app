// content/reference/python/stdlib/time/time.js
// time.time and time.time_ns

export const meta = {
  slug:        'time',
  name:        'time.time',
  signature:   'time.time() / time.time_ns()',
  blurb:       'The current time as seconds since the Unix epoch (1970-01-01 00:00 UTC): a float from time(), an exact int of nanoseconds from time_ns().',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); time_ns 3.7+',
  searchTerms: 'time.time time_ns time.time_ns python unix timestamp current time now epoch seconds since 1970 milliseconds Date.now nanoseconds float precision wall clock',
};

export const method = {
  slug:      'time',
  name:      'time.time',
  signature: 'time.time() / time.time_ns()',
  returns:   { type: 'float | int', desc: 'time(): seconds since the epoch as a float. time_ns(): nanoseconds since the epoch as an int.' },

  category:    'time function',
  version:     'Python 3 (all versions); time_ns 3.7+',
  hasLiveDemo: true,

  subtitle: 'The wall clock as one number - perfect for timestamps, wrong for measuring durations. time_ns() gives the same instant as an exact integer of nanoseconds, without float rounding.',

  covers: ['time', 'time_ns'],

  cheat: {
    commonCall: 'time.time()  ·  time.time_ns()',
    returns:    'float seconds  ·  int nanoseconds, since 1970-01-01 UTC',
    replaces:   'datetime.now(UTC).timestamp() when you only need the number',
    watchOut:   'the system clock can be set back - time durations with perf_counter()',
  },

  modes: [
    {
      id: 'utc',
      label: 'timestamp → UTC',
      blurb: 'Type a reading as time.time() returns it. gmtime turns it into UTC fields, strftime into text.',
      params: [{ name: 'seconds', type: 'float', hint: 'a time.time() reading', input: 'auto' }],
      template: "import time\nnow = {$seconds}  # what time.time() returned\ntime.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(now))",
      cases: [
        { id: 'recent',  label: '1790000000.75',  values: { seconds: '1790000000.75' } },
        { id: 'epoch',   label: '0',              values: { seconds: '0' } },
        { id: 'billion', label: '1e9',            values: { seconds: '1000000000' } },
        { id: 'y2038',   label: '2**31',          values: { seconds: '2147483648' } },
      ],
    },
    {
      id: 'ns',
      label: 'float vs ns',
      blurb: 'Build a time_ns() reading from whole seconds and nanoseconds, turn it into float seconds like time() returns, and see how many nanoseconds the float lost.',
      params: [
        { name: 'seconds', type: 'int', hint: 'whole seconds', input: 'number' },
        { name: 'nanos',   type: 'int', hint: '0 .. 999999999', input: 'number' },
      ],
      template: 'import time\nns = {$seconds} * 10**9 + {$nanos}  # a time.time_ns() reading\nsecs = ns / 10**9  # the same instant as a float\n(secs, round(secs * 10**9) - ns)',
      cases: [
        { id: 'today', label: 'a 2026 reading', values: { seconds: '1790000000', nanos: '123456789' } },
        { id: 'small', label: 'one second in',  values: { seconds: '1', nanos: '123456789' } },
        { id: 'whole', label: 'whole seconds',  values: { seconds: '1790000000', nanos: '0' } },
      ],
    },
  ],
  demoExplainer: 'A float has 53 bits of precision, so near 1.79 billion seconds the gap between neighbouring floats is 2**-22 s, about 238 ns (math.ulp(1_790_000_000.0) shows it). That is why the 2026 reading comes back 21 ns off, while the int from time_ns() is exact. Close to the epoch the float is fine-grained enough to round-trip.',

  patterns: [
    {
      name: 'Whole-second Unix timestamp',
      desc: 'What most APIs, databases and JWT claims (iat, exp) expect.',
      code: 'import time\nnow = int(time.time())',
    },
    {
      name: 'Milliseconds like JavaScript Date.now()',
      desc: 'Integer arithmetic on time_ns() avoids float rounding.',
      code: 'import time\nmillis = time.time_ns() // 1_000_000',
    },
    {
      name: 'Expiry check',
      desc: 'Store an absolute timestamp, compare against time() later - works across processes and restarts.',
      code: 'import time\nexpires_at = time.time() + 3600\n...\nif time.time() >= expires_at:\n    refresh_token()',
    },
    {
      name: 'Readable log time in UTC',
      desc: 'Format the reading through gmtime so it does not depend on the server time zone.',
      code: "import time\nstamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time()))",
    },
  ],

  examples: [
    { title: 'Later than 1.7 billion (14 Nov 2023)', code: 'import time\ntime.time() > 1_700_000_000', returns: 'True' },
    { title: 'time_ns() has 19 digits (until 2286)', code: 'import time\nlen(str(time.time_ns()))', returns: '19' },
    { title: 'Milliseconds have 13 digits',     code: 'import time\nms = time.time_ns() // 1_000_000\nlen(str(ms))', returns: '13' },
    { title: 'Float spacing near today',        code: 'import math\nmath.ulp(1_790_000_000.0)', returns: '2.384185791015625e-07' },
    { title: 'A stored timestamp as UTC text',  code: "import time\ntime.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(1790000000))", returns: "'2026-09-21 14:13:20'" },
    { title: 'No arguments',                    code: 'import time\ntime.time(1)', returns: 'TypeError: time.time() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'Timing code with time()',
      desc: 'time() follows the system clock. If NTP or an administrator sets it while your code runs, the difference of two readings is wrong - it can even be negative. perf_counter() cannot go backwards.',
      wrong: { label: 'time()',         code: "import time\ntime.get_clock_info('time').monotonic", output: 'False' },
      fix:   { label: 'perf_counter()', code: "import time\ntime.get_clock_info('perf_counter').monotonic", output: 'True' },
    },
    {
      name: 'Losing nanoseconds in a float',
      desc: 'Dividing a time_ns() value by 10**9 gives a float that cannot hold every nanosecond of a current timestamp. Keep the int and split it with divmod.',
      wrong: { label: 'ns / 10**9', code: 'ns = 1_790_000_000_123_456_789\nint(ns / 10**9 * 10**9) == ns', output: 'False' },
      fix:   { label: 'divmod',     code: 'ns = 1_790_000_000_123_456_789\ndivmod(ns, 10**9)', output: '(1790000000, 123456789)' },
    },
  ],

  when: {
    use: [
      'Timestamps you store, send or compare later (logs, caches, tokens, file metadata)',
      'An absolute "valid until" moment that must survive restarts',
      'time_ns() when you need exact integer arithmetic or nanosecond resolution',
    ],
    avoid: [
      'Measuring how long something took → perf_counter() or monotonic()',
      'Calendar values (year, month, day) → gmtime(time()) or datetime.now(UTC)',
      'Local wall-clock display → localtime() or datetime.now().astimezone()',
    ],
  },

  notes: {
    cpython:        'time_time / time_time_ns in Modules/timemodule.c over PyTime_Time (Python/pytime.c): clock_gettime(CLOCK_REALTIME) on Linux, GetSystemTimePreciseAsFileTime() on Windows since 3.13',
    'Leap seconds': 'Not counted on POSIX systems and Windows: every day is exactly 86400 seconds of Unix time',
    'Resolution':   'get_clock_info("time").resolution reports what the platform offers; the float itself is limited to about 2**-22 s for current dates',
  },

  related: [
    { name: 'time.perf_counter', slug: 'perf-counter',   when: 'Measure durations instead' },
    { name: 'time.gmtime',       slug: 'gmtime',         when: 'Timestamp → UTC fields' },
    { name: 'time.get_clock_info', slug: 'get-clock-info', when: 'Is the clock adjustable or monotonic?' },
    { name: 'time module',       slug: 'time',           when: 'Overview', category: 'stdlib' },
    { name: 'datetime.timestamp', slug: 'timestamp',     when: 'The same number from a datetime', category: 'stdlib/datetime' },
  ],

  faq: [
    {
      q: 'What does time.time() return?',
      a: 'The number of seconds since the Unix epoch, 1970-01-01 00:00:00 UTC, as a float with a fractional part. It is the same on every machine at the same moment, whatever the local time zone.',
    },
    {
      q: 'What is the difference between time.time() and time.time_ns()?',
      a: 'Same clock, different type. time() returns float seconds, which cannot represent every nanosecond of a current timestamp; time_ns() (Python 3.7+) returns an exact int of nanoseconds. Divide with // or divmod to keep it exact.',
    },
    {
      q: 'How do I get the current time in milliseconds in Python?',
      a: 'time.time_ns() // 1_000_000 gives an int like JavaScript Date.now(). int(time.time() * 1000) also works but goes through a float first.',
    },
    {
      q: 'Can time.time() go backwards?',
      a: 'Yes. It reads the adjustable system clock (get_clock_info("time").adjustable is True), so a clock correction between two calls can make the second reading smaller. Use time.monotonic() or time.perf_counter() for intervals and timeouts.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.time',
    meta:  'time.time / time.time_ns',
  },
};
