// content/reference/python/stdlib/time/get-clock-info.js

export const meta = {
  slug:        'get-clock-info',
  name:        'time.get_clock_info',
  signature:   'time.get_clock_info(name, /)',
  blurb:       'Describe one of the five Python clocks: which C function implements it, whether it is monotonic or adjustable, and its resolution.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'time.get_clock_info get_clock_info clock info resolution monotonic adjustable implementation python clock precision which clock perf_counter monotonic process_time thread_time unknown clock',
};

export const method = {
  slug:      'get-clock-info',
  name:      'time.get_clock_info',
  signature: 'time.get_clock_info(name, /)',
  returns:   { type: 'types.SimpleNamespace', desc: 'A namespace with implementation (str), monotonic (bool), adjustable (bool) and resolution (float seconds).' },

  category:    'time function',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'Ask Python what a clock really is on this machine. The two flags - monotonic and adjustable - are the same everywhere; implementation and resolution depend on the operating system.',

  covers: ['get_clock_info'],

  cheat: {
    commonCall: "time.get_clock_info('perf_counter')",
    returns:    'namespace(implementation=..., monotonic=..., adjustable=..., resolution=...)',
    replaces:   'Guessing a clock\'s precision from documentation',
    watchOut:   'takes the clock NAME as a string, not the function',
  },

  parameters: [
    { name: 'name', type: 'str', required: true, default: null, desc: "One of 'time', 'monotonic', 'perf_counter', 'process_time', 'thread_time'. Anything else raises ValueError: unknown clock." },
  ],

  attributes: [
    { name: 'implementation', type: 'str',   meaning: "The underlying C call, e.g. 'clock_gettime(CLOCK_MONOTONIC)' on Linux or 'QueryPerformanceCounter()' on Windows." },
    { name: 'monotonic',      type: 'bool',  meaning: 'True if the clock cannot go backward. False only for time.' },
    { name: 'adjustable',     type: 'bool',  meaning: 'True if the clock can be set to jump forward or backward (NTP slewing does not count). True only for time.' },
    { name: 'resolution',     type: 'float', meaning: 'The resolution in seconds as reported by the platform, e.g. 1e-09 on Linux and 1e-07 on Windows.' },
  ],

  modes: [
    {
      id: 'info',
      label: 'clock flags',
      blurb: 'The two properties that decide what a clock is good for. They are the same on Linux, macOS and Windows.',
      params: [{ name: 'name', type: 'str', hint: 'a clock name', input: 'text' }],
      template: 'import time\ninfo = time.get_clock_info({$name})\n(info.monotonic, info.adjustable)',
      cases: [
        { id: 'time',    label: 'time',         values: { name: 'time' } },
        { id: 'mono',    label: 'monotonic',    values: { name: 'monotonic' } },
        { id: 'perf',    label: 'perf_counter', values: { name: 'perf_counter' } },
        { id: 'process', label: 'process_time', values: { name: 'process_time' } },
        { id: 'clock',   label: 'clock',        values: { name: 'clock' } },
      ],
    },
  ],
  demoExplainer: 'Only the wall clock time is adjustable and not monotonic, which is exactly why it is a poor stopwatch. The name clock is rejected: time.clock() was removed in Python 3.8. implementation and resolution are left out of the demo because they differ by platform - on Windows perf_counter reports QueryPerformanceCounter() with resolution 1e-07, on Linux clock_gettime(CLOCK_MONOTONIC) with 1e-09.',

  patterns: [
    {
      name: 'Print every clock',
      desc: 'A quick survey of the machine you are on.',
      code: "import time\nfor name in ('time', 'monotonic', 'perf_counter', 'process_time', 'thread_time'):\n    print(name, time.get_clock_info(name))",
    },
    {
      name: 'Choose decimals from the resolution',
      desc: 'Do not print more digits than the clock can deliver.',
      code: "import math, time\nres = time.get_clock_info('perf_counter').resolution\ndigits = max(0, -math.floor(math.log10(res)))\nprint(f\"{elapsed:.{digits}f} s\")",
    },
    {
      name: 'Refuse an adjustable clock',
      desc: 'A guard for code that must never see time go backwards.',
      code: "import time\nassert not time.get_clock_info('monotonic').adjustable",
    },
  ],

  examples: [
    { title: 'The result is a SimpleNamespace',   code: "import time\ntype(time.get_clock_info('time')).__name__", returns: "'SimpleNamespace'" },
    { title: 'Its four attributes',               code: "import time\nsorted(vars(time.get_clock_info('monotonic')))", returns: "['adjustable', 'implementation', 'monotonic', 'resolution']" },
    { title: 'The wall clock is adjustable',      code: "import time\ntime.get_clock_info('time').adjustable", returns: 'True' },
    { title: 'Which clocks are monotonic',        code: "import time\n[name for name in ('time', 'monotonic', 'perf_counter', 'process_time', 'thread_time') if time.get_clock_info(name).monotonic]", returns: "['monotonic', 'perf_counter', 'process_time', 'thread_time']" },
    { title: 'Resolution is a float in seconds',  code: "import time\nisinstance(time.get_clock_info('perf_counter').resolution, float)", returns: 'True' },
    { title: 'time.clock is gone',                code: "import time\ntime.get_clock_info('clock')", returns: 'ValueError: unknown clock' },
  ],

  pitfalls: [
    {
      name: 'Passing the function instead of its name',
      desc: 'get_clock_info wants the clock name as a string.',
      wrong: { label: 'time.monotonic', code: 'import time\ntime.get_clock_info(time.monotonic)', output: 'TypeError: get_clock_info() argument 1 must be str, not builtin_function_or_method' },
      fix:   { label: "'monotonic'",    code: "import time\ntime.get_clock_info('monotonic').monotonic", output: 'True' },
    },
    {
      name: 'Asking about a clock id constant',
      desc: 'Only the five Python clock names are known; the Unix CLOCK_* ids belong to clock_gettime(), not here.',
      wrong: { label: "'CLOCK_MONOTONIC'", code: "import time\ntime.get_clock_info('CLOCK_MONOTONIC')", output: 'ValueError: unknown clock' },
      fix:   { label: "'monotonic'",       code: "import time\ntime.get_clock_info('monotonic').adjustable", output: 'False' },
    },
  ],

  when: {
    use: [
      'Checking that a clock is monotonic before relying on it for timeouts',
      'Knowing how many digits of a measurement are meaningful',
      'Debugging timing differences between Windows, macOS and Linux',
    ],
    avoid: [
      'Reading the time itself → call the clock function',
      'Information about Unix clock ids → clock_getres(CLOCK_...)',
    ],
  },

  notes: {
    cpython:      'time_get_clock_info in Modules/timemodule.c fills a types.SimpleNamespace while reading the clock once',
    'Resolution': 'The reported resolution is what the operating system claims; the true precision of a measurement can be coarser',
    'Names':      "Exactly 'time', 'monotonic', 'perf_counter', 'process_time' and 'thread_time' - case-sensitive, so 'Time' is unknown too",
  },

  related: [
    { name: 'clock functions', slug: 'perf-counter', when: 'perf_counter, monotonic, process_time, thread_time' },
    { name: 'time.time',       slug: 'time',         when: 'The adjustable wall clock' },
    { name: 'CLOCK_* ids',     slug: 'clock-constants', when: 'The Unix clocks underneath' },
    { name: 'time module',     slug: 'time',         when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I find the resolution of time.perf_counter()?',
      a: "time.get_clock_info('perf_counter').resolution - a float in seconds. On a typical Linux machine it reports 1e-09, on Windows 1e-07.",
    },
    {
      q: 'Which Python clocks are monotonic?',
      a: 'monotonic, perf_counter, process_time and thread_time. Only time (the wall clock) is not monotonic, and it is also the only adjustable one.',
    },
    {
      q: 'Why does get_clock_info("clock") raise ValueError?',
      a: 'time.clock() was removed in Python 3.8 (deprecated since 3.3), so it is no longer a known clock name. Use perf_counter or process_time.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/time.html#time.get_clock_info',
    meta:  'time.get_clock_info',
  },
};
