// content/reference/python/stdlib/time/clock-constants.js
// the CLOCK_* clock ids for clock_gettime / clock_getres / clock_settime

export const meta = {
  slug:        'clock-constants',
  name:        'time.CLOCK_MONOTONIC',
  signature:   'time.CLOCK_REALTIME · CLOCK_MONOTONIC · CLOCK_BOOTTIME · CLOCK_PROCESS_CPUTIME_ID · ...',
  blurb:       'The clock ids for clock_gettime(), clock_getres() and clock_settime(): CLOCK_REALTIME, CLOCK_MONOTONIC, CLOCK_BOOTTIME, CLOCK_TAI and the other platform-specific POSIX clocks. None of them exist on Windows.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.3+ (individual constants 3.3-3.13, see table)',
  searchTerms: 'time.CLOCK_MONOTONIC CLOCK_MONOTONIC CLOCK_REALTIME CLOCK_BOOTTIME CLOCK_MONOTONIC_RAW CLOCK_MONOTONIC_RAW_APPROX CLOCK_PROCESS_CPUTIME_ID CLOCK_THREAD_CPUTIME_ID CLOCK_TAI CLOCK_HIGHRES CLOCK_PROF CLOCK_UPTIME CLOCK_UPTIME_RAW CLOCK_UPTIME_RAW_APPROX python clock id constants posix clocks linux macos freebsd solaris suspend aware atomic time',
};

export const method = {
  slug:      'clock-constants',
  name:      'time.CLOCK_MONOTONIC',
  signature: 'time.CLOCK_REALTIME · CLOCK_MONOTONIC · CLOCK_BOOTTIME · CLOCK_PROCESS_CPUTIME_ID · ...',
  returns:   { type: 'int', desc: "Each constant is the integer clock id from the operating system's C headers (the Linux values are listed in the notes)." },

  category:    'time constant',
  version:     'Python 3.3+ (individual constants 3.3-3.13, see table)',
  hasLiveDemo: false,

  subtitle: 'Which POSIX clock to read. Every constant exists only where the operating system has that clock - CLOCK_BOOTTIME and CLOCK_TAI on Linux, the *_RAW_APPROX and UPTIME_RAW ones on macOS, CLOCK_HIGHRES on Solaris - and none on Windows.',

  covers: [
    'CLOCK_BOOTTIME', 'CLOCK_HIGHRES', 'CLOCK_MONOTONIC', 'CLOCK_MONOTONIC_RAW', 'CLOCK_MONOTONIC_RAW_APPROX',
    'CLOCK_PROCESS_CPUTIME_ID', 'CLOCK_PROF', 'CLOCK_REALTIME', 'CLOCK_TAI', 'CLOCK_THREAD_CPUTIME_ID',
    'CLOCK_UPTIME', 'CLOCK_UPTIME_RAW', 'CLOCK_UPTIME_RAW_APPROX',
  ],

  cheat: {
    commonCall: 'time.clock_gettime(time.CLOCK_MONOTONIC)',
    returns:    'the clock id is an int (1 on Linux)',
    replaces:   'Hard-coded clock numbers from C headers',
    watchOut:   'check with hasattr() - availability differs per OS',
  },

  attributes: [
    { name: 'CLOCK_REALTIME',            type: 'Unix, 3.3',          meaning: 'The wall clock (what time.time() reads on Linux). The only id clock_settime() accepts; setting it needs privileges.' },
    { name: 'CLOCK_MONOTONIC',           type: 'Unix, 3.3',          meaning: 'Cannot be set; counts from an unspecified starting point.' },
    { name: 'CLOCK_MONOTONIC_RAW',       type: 'Linux >= 2.6.28, macOS >= 10.12, 3.3', meaning: 'Like CLOCK_MONOTONIC but raw hardware time, not subject to NTP adjustments.' },
    { name: 'CLOCK_MONOTONIC_RAW_APPROX', type: 'macOS >= 10.12, 3.13', meaning: 'CLOCK_MONOTONIC_RAW cached at context switches: cheaper, less accurate.' },
    { name: 'CLOCK_BOOTTIME',            type: 'Linux >= 2.6.39, 3.7', meaning: 'Like CLOCK_MONOTONIC but includes time the system spent suspended.' },
    { name: 'CLOCK_PROCESS_CPUTIME_ID',  type: 'Unix, 3.3',          meaning: 'CPU time of the process (what process_time() reads on Linux).' },
    { name: 'CLOCK_THREAD_CPUTIME_ID',   type: 'Unix, 3.3',          meaning: 'CPU time of the calling thread (what thread_time() reads on Linux).' },
    { name: 'CLOCK_TAI',                 type: 'Linux, 3.9',         meaning: 'International Atomic Time; correct only if the system has a current leap-second table.' },
    { name: 'CLOCK_HIGHRES',             type: 'Solaris, 3.3',       meaning: 'Solaris nonadjustable high-resolution clock.' },
    { name: 'CLOCK_PROF',                type: 'FreeBSD, NetBSD >= 7, OpenBSD, 3.7', meaning: 'High-resolution per-process CPU timer.' },
    { name: 'CLOCK_UPTIME',              type: 'FreeBSD, OpenBSD >= 5.5, 3.7', meaning: 'Time the system has been running and not suspended.' },
    { name: 'CLOCK_UPTIME_RAW',          type: 'macOS >= 10.12, 3.8', meaning: 'Monotonic, unaffected by frequency adjustments, stops while the system sleeps.' },
    { name: 'CLOCK_UPTIME_RAW_APPROX',   type: 'macOS >= 10.12, 3.13', meaning: 'CLOCK_UPTIME_RAW cached at context switches.' },
  ],

  patterns: [
    {
      name: 'Prefer a clock, fall back gracefully',
      desc: 'Use CLOCK_BOOTTIME where it exists, CLOCK_MONOTONIC otherwise.',
      code: "import time\nclk = getattr(time, 'CLOCK_BOOTTIME', None) or getattr(time, 'CLOCK_MONOTONIC', None)\nreading = time.clock_gettime(clk) if clk is not None else time.monotonic()",
    },
    {
      name: 'List the clocks of this platform',
      desc: 'dir() shows exactly which constants your Python has.',
      code: "import time\nprint({n: getattr(time, n) for n in dir(time) if n.startswith('CLOCK_')})",
    },
    {
      name: 'Resolution of a clock',
      desc: 'clock_getres takes the same ids.',
      code: 'import time\nprint(time.clock_getres(time.CLOCK_MONOTONIC))',
    },
  ],

  examples: [
    { title: 'Unix only: missing on Windows',      code: "import sys, time\nhasattr(time, 'CLOCK_REALTIME') == (sys.platform != 'win32')", returns: 'True' },
    { title: 'CLOCK_HIGHRES is Solaris only',      code: "import time\ngetattr(time, 'CLOCK_HIGHRES', None) is None", returns: 'True' },
    { title: 'Where it exists, it is an int',      code: "import time\nclock_id = getattr(time, 'CLOCK_MONOTONIC', None)\nclock_id is None or isinstance(clock_id, int)", returns: 'True' },
    { title: 'The portable monotonic clocks',      code: "import time\n[name for name in ('monotonic', 'perf_counter', 'process_time', 'thread_time') if time.get_clock_info(name).monotonic]", returns: "['monotonic', 'perf_counter', 'process_time', 'thread_time']" },
    { title: 'Either none or CLOCK_MONOTONIC too', code: "import time\nsorted(n for n in dir(time) if n.startswith('CLOCK_')) == [] or 'CLOCK_MONOTONIC' in dir(time)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing a clock id to get_clock_info',
      desc: 'get_clock_info knows the five Python clock names, not POSIX ids or their names.',
      wrong: { label: "'CLOCK_MONOTONIC'", code: "import time\ntime.get_clock_info('CLOCK_MONOTONIC')", output: 'ValueError: unknown clock' },
      fix:   { label: "'monotonic'",       code: "import time\ntime.get_clock_info('monotonic').adjustable", output: 'False' },
    },
    {
      name: 'Passing a clock id to monotonic()',
      desc: 'The high-level clocks take no arguments; a clock id is only for clock_gettime and friends.',
      wrong: { label: 'monotonic(id)', code: "import time\ntime.monotonic(getattr(time, 'CLOCK_MONOTONIC', 1))", output: 'TypeError: time.monotonic() takes no arguments (1 given)' },
      fix:   { label: 'monotonic()',   code: 'import time\ntime.monotonic() >= 0', output: 'True' },
    },
  ],

  when: {
    use: [
      'clock_gettime / clock_getres on Unix when you need a specific POSIX clock',
      'Suspend-aware uptime (CLOCK_BOOTTIME) or TAI time on Linux',
    ],
    avoid: [
      'Code that must run on Windows → time.monotonic(), perf_counter(), time(), process_time()',
      'Hard-coding the numbers (CLOCK_MONOTONIC is 1 on Linux) - each OS defines its own values',
    ],
  },

  notes: {
    cpython:        'Added to the module in Modules/timemodule.c only when the C headers define them, so dir(time) lists exactly the clocks of the platform',
    'Linux values': 'On Linux: CLOCK_REALTIME 0, CLOCK_MONOTONIC 1, CLOCK_PROCESS_CPUTIME_ID 2, CLOCK_THREAD_CPUTIME_ID 3, CLOCK_MONOTONIC_RAW 4, CLOCK_BOOTTIME 7, CLOCK_TAI 11',
    'Windows':      'No CLOCK_* constant exists on Windows; the Python clocks use QueryPerformanceCounter(), GetSystemTimePreciseAsFileTime(), GetProcessTimes() and GetThreadTimes() instead',
  },

  related: [
    { name: 'clock_gettime and friends', slug: 'clock-gettime', when: 'The functions that take these ids' },
    { name: 'time.get_clock_info', slug: 'get-clock-info', when: 'Which clock backs each Python clock' },
    { name: 'clock functions',     slug: 'perf-counter',   when: 'The portable clocks' },
    { name: 'time module',         slug: 'time',           when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'Which CLOCK_* constants exist, and their numbers, depend on the operating system - Windows has none at all - and the clocks they name return machine-dependent readings. The examples only check facts that hold on every platform, such as "the constant is an int where it exists".',
    },
    {
      q: 'What is the difference between CLOCK_MONOTONIC and CLOCK_BOOTTIME?',
      a: 'Both never go backwards. CLOCK_MONOTONIC (on Linux) stops while the system is suspended; CLOCK_BOOTTIME keeps counting through suspend, so it measures real elapsed time across sleep. CLOCK_BOOTTIME is Linux only (2.6.39+).',
    },
    {
      q: 'Why is time.CLOCK_MONOTONIC missing?',
      a: 'You are on Windows, which has no POSIX clocks. Use time.monotonic() - it exists on every platform.',
    },
    {
      q: 'Which clock does time.time() use on Linux?',
      a: 'CLOCK_REALTIME: time.get_clock_info("time").implementation is clock_gettime(CLOCK_REALTIME). monotonic() and perf_counter() use CLOCK_MONOTONIC.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#clock-id-constants',
    meta:  'Clock ID constants',
  },
};
