// content/reference/python/stdlib/time/clock-gettime.js
// the Unix clock_* functions and pthread_getcpuclockid

export const meta = {
  slug:        'clock-gettime',
  name:        'time.clock_gettime',
  signature:   'time.clock_gettime(clk_id, /) / clock_gettime_ns / clock_getres / clock_settime / clock_settime_ns / pthread_getcpuclockid',
  blurb:       'Direct access to the POSIX clocks (Unix only): read any CLOCK_* clock as float seconds or int nanoseconds, ask its resolution, set the real-time clock, and get the CPU clock of a thread.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+; the _ns versions and pthread_getcpuclockid 3.7+',
  searchTerms: 'time.clock_gettime clock_gettime clock_gettime_ns time.clock_getres clock_getres time.clock_settime clock_settime clock_settime_ns time.pthread_getcpuclockid pthread_getcpuclockid python posix clock CLOCK_MONOTONIC CLOCK_REALTIME CLOCK_BOOTTIME unix only nanoseconds thread cpu clock set system time',
};

export const method = {
  slug:      'clock-gettime',
  name:      'time.clock_gettime',
  signature: 'time.clock_gettime(clk_id, /) / clock_gettime_ns / clock_getres / clock_settime / clock_settime_ns / pthread_getcpuclockid',
  returns:   { type: 'float | int | None', desc: 'clock_gettime / clock_getres: float seconds; clock_gettime_ns: int nanoseconds; clock_settime(_ns): None; pthread_getcpuclockid: an int clock id.' },

  category:    'time function',
  version:     'Python 3.3+; the _ns versions and pthread_getcpuclockid 3.7+',
  hasLiveDemo: false,

  subtitle: 'The raw POSIX layer under monotonic(), time() and process_time(). Unix only - none of these functions exist on Windows, so portable code uses the high-level clocks and this page has no live demo.',

  covers: ['clock_gettime', 'clock_gettime_ns', 'clock_getres', 'clock_settime', 'clock_settime_ns', 'pthread_getcpuclockid'],

  cheat: {
    commonCall: 'time.clock_gettime_ns(time.CLOCK_MONOTONIC)',
    returns:    'int nanoseconds of that clock',
    replaces:   'ctypes calls into librt',
    watchOut:   'Unix only; clock_settime needs privileges and accepts only CLOCK_REALTIME',
  },

  parameters: [
    { name: 'clk_id',    type: 'int', required: true,  default: null, desc: 'A clock id: one of the CLOCK_* constants available on the platform, or the result of pthread_getcpuclockid().' },
    { name: 'time',      type: 'float | int', required: true, default: null, desc: 'clock_settime(clk_id, time) takes float seconds, clock_settime_ns(clk_id, time) int nanoseconds.' },
    { name: 'thread_id', type: 'int', required: true,  default: null, desc: 'pthread_getcpuclockid(thread_id): an id from threading.get_ident() or Thread.ident.' },
  ],

  attributes: [
    { name: 'clock_gettime(clk_id)',      type: 'float', meaning: 'Current value of the clock in seconds. Availability: Unix.' },
    { name: 'clock_gettime_ns(clk_id)',   type: 'int',   meaning: 'The same as int nanoseconds, without float rounding. Availability: Unix.' },
    { name: 'clock_getres(clk_id)',       type: 'float', meaning: 'Resolution of the clock in seconds. Availability: Unix.' },
    { name: 'clock_settime(clk_id, t)',   type: 'None',  meaning: 'Set the clock; only CLOCK_REALTIME is accepted, and it needs privileges. Availability: Unix, not Android, not iOS.' },
    { name: 'clock_settime_ns(clk_id, t)', type: 'None', meaning: 'clock_settime with int nanoseconds. Availability: Unix, not Android, not iOS.' },
    { name: 'pthread_getcpuclockid(thread_id)', type: 'int', meaning: 'The clock id of that thread\'s CPU-time clock, for clock_gettime. An invalid or expired id may crash the process. Availability: Unix.' },
  ],

  patterns: [
    {
      name: 'Read a specific clock on Unix',
      desc: 'CLOCK_BOOTTIME (Linux) keeps counting while the machine is suspended, unlike CLOCK_MONOTONIC.',
      code: 'import time\nuptime_ns = time.clock_gettime_ns(time.CLOCK_BOOTTIME)',
    },
    {
      name: 'Portable fallback',
      desc: 'Use the POSIX clock when it exists, the high-level clock otherwise.',
      code: "import time\nclock = getattr(time, 'clock_gettime_ns', None)\nreading = clock(time.CLOCK_MONOTONIC) if clock else time.monotonic_ns()",
    },
    {
      name: 'CPU time of another thread',
      desc: 'thread_time() only measures the calling thread; this reads any thread of the process.',
      code: 'import threading, time\nclk = time.pthread_getcpuclockid(worker.ident)\ncpu_seconds = time.clock_gettime(clk)',
    },
    {
      name: 'Set the system clock (root only)',
      desc: 'Rarely what an application should do - the operating system or NTP owns the clock.',
      code: 'import time\ntime.clock_settime(time.CLOCK_REALTIME, new_epoch_seconds)',
    },
  ],

  examples: [
    { title: 'Unix only: missing on Windows',     code: "import sys, time\nhasattr(time, 'clock_gettime') == (sys.platform != 'win32')", returns: 'True' },
    { title: 'A portable reading',                code: "import time\nclock = getattr(time, 'clock_gettime_ns', None)\nreading = clock(time.CLOCK_MONOTONIC) if clock else time.monotonic_ns()\nisinstance(reading, int)", returns: 'True' },
    { title: 'The high-level clock in ns',        code: 'import time\ntype(time.monotonic_ns()).__name__', returns: "'int'" },
    { title: 'Which clocks never go back',        code: "import time\ntime.get_clock_info('monotonic').monotonic", returns: 'True' },
    { title: 'Thread ids for pthread_getcpuclockid', code: 'import threading\nisinstance(threading.get_ident(), int)', returns: 'True' },
    { title: 'CPU time of this thread, portably', code: 'import time\nns = time.thread_time_ns()\nns >= 0', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Treating a monotonic reading as a timestamp',
      desc: 'CLOCK_MONOTONIC (which time.monotonic() reads on Linux) starts at an unspecified point, typically boot. Only CLOCK_REALTIME / time.time() count from 1970.',
      wrong: { label: 'monotonic', code: 'import time\ntime.monotonic() > 1_700_000_000', output: 'False' },
      fix:   { label: 'time()',    code: 'import time\ntime.time() > 1_700_000_000', output: 'True' },
    },
    {
      name: 'Using the float version for nanoseconds',
      desc: 'clock_gettime returns float seconds; for a CLOCK_REALTIME value the float cannot hold every nanosecond. Use clock_gettime_ns and integer arithmetic.',
      wrong: { label: 'float round trip', code: 'ns = 1_790_000_000_123_456_789  # a CLOCK_REALTIME reading in ns\nround(ns / 1e9, 9) * 10**9 == ns', output: 'False' },
      fix:   { label: 'stay in ints',     code: 'ns = 1_790_000_000_123_456_789\ndivmod(ns, 10**9)', output: '(1790000000, 123456789)' },
    },
  ],

  when: {
    use: [
      'Linux-specific clocks: CLOCK_BOOTTIME, CLOCK_TAI, CLOCK_MONOTONIC_RAW',
      'Per-thread CPU time of other threads (pthread_getcpuclockid)',
      'clock_getres to check what a clock really offers',
    ],
    avoid: [
      'Portable code → time(), monotonic(), perf_counter(), process_time(), thread_time()',
      'Changing the system time from an application → leave it to NTP / the OS',
    ],
  },

  notes: {
    cpython:        'Thin wrappers in Modules/timemodule.c over the POSIX functions of the same names; errors become OSError with the C errno',
    'Availability': 'clock_gettime, clock_gettime_ns, clock_getres, pthread_getcpuclockid: Unix. clock_settime, clock_settime_ns: Unix, not Android, not iOS. None of them exist on Windows (AttributeError)',
    'High level':   'On Linux time.time() reads CLOCK_REALTIME, monotonic() and perf_counter() CLOCK_MONOTONIC, process_time() CLOCK_PROCESS_CPUTIME_ID and thread_time() CLOCK_THREAD_CPUTIME_ID (see get_clock_info)',
    'Warning':      'The docs warn that passing an invalid or expired thread id to pthread_getcpuclockid may cause undefined behaviour such as a segmentation fault',
  },

  related: [
    { name: 'CLOCK_* constants', slug: 'clock-constants', when: 'The clock ids these functions take' },
    { name: 'clock functions',   slug: 'perf-counter',    when: 'The portable clocks' },
    { name: 'time.get_clock_info', slug: 'get-clock-info', when: 'Which POSIX clock backs each Python clock' },
    { name: 'time module',       slug: 'time',            when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'These functions exist only on Unix and return readings of real clocks (or change the system clock), so a live result would differ on every run and every machine. The examples show only what is fixed: availability by platform and the types the portable clocks return.',
    },
    {
      q: 'Why does time.clock_gettime raise AttributeError?',
      a: 'You are on Windows: the clock_* functions and the CLOCK_* constants are Unix only. Use time.monotonic(), time.perf_counter() or time.time(), which work everywhere.',
    },
    {
      q: 'What is the difference between clock_gettime(CLOCK_MONOTONIC) and time.monotonic()?',
      a: 'On Linux, none - get_clock_info("monotonic").implementation is clock_gettime(CLOCK_MONOTONIC). On macOS and Windows monotonic() uses other system calls, which is why it is the portable choice.',
    },
    {
      q: 'How do I measure the CPU time of another thread?',
      a: 'On Unix: time.clock_gettime(time.pthread_getcpuclockid(thread.ident)) while the thread is alive. time.thread_time() only covers the thread that calls it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.clock_gettime',
    meta:  'time.clock_gettime and friends',
  },
};
