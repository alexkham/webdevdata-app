// content/reference/python/stdlib/sys/setswitchinterval.js — thread switch interval (and the GIL)

export const meta = {
  slug:        'setswitchinterval',
  name:        'sys.setswitchinterval / getswitchinterval',
  signature:   'sys.setswitchinterval(interval) · sys.getswitchinterval()',
  blurb:       'How long (in seconds, default 0.005) a thread may hold the GIL before another runnable thread is given a turn. Also on this page: sys._is_gil_enabled() for free-threaded builds (3.13).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.2+ (_is_gil_enabled 3.13+)',
  searchTerms: 'sys.setswitchinterval setswitchinterval sys.getswitchinterval getswitchinterval thread switch interval gil global interpreter lock 0.005 seconds sys._is_gil_enabled _is_gil_enabled free threaded python 3.13t no gil setcheckinterval threads',
};

export const method = {
  slug:      'setswitchinterval',
  name:      'sys.setswitchinterval / getswitchinterval',
  signature: 'sys.setswitchinterval(interval) · sys.getswitchinterval()',
  returns:   { type: 'None · float', desc: 'setswitchinterval returns None; getswitchinterval returns the interval in seconds.' },

  category:    'sys function',
  version:     'Python 3.2+ (_is_gil_enabled 3.13+)',
  hasLiveDemo: false,

  subtitle: 'With the GIL only one thread runs Python bytecode at a time; the switch interval is the time slice after which a waiting thread asks for it. Lower values make threads more responsive at some throughput cost. It does not make CPU-bound threads run in parallel — that needs processes or a free-threaded build.',

  covers: ['setswitchinterval', 'getswitchinterval'],

  cheat: {
    commonCall: 'sys.setswitchinterval(0.001)',
    returns:    'None — applies to all threads',
    replaces:   'sys.setcheckinterval (removed in 3.9)',
    watchOut:   'The unit is seconds: 5 means five seconds, not 5 ms',
  },

  parameters: [
    { name: 'interval', type: 'float', required: true, default: null, desc: 'Seconds, strictly positive. The default is 0.005 (5 ms).' },
  ],

  patterns: [
    {
      name: 'Change it for a block, then restore',
      desc: 'The setting is interpreter-wide.',
      code: 'import sys\nold = sys.getswitchinterval()\nsys.setswitchinterval(0.001)\ntry:\n    run_latency_sensitive_threads()\nfinally:\n    sys.setswitchinterval(old)',
    },
    {
      name: 'Is the GIL on? (3.13+)',
      desc: 'Free-threaded builds can run without it; importing an extension that does not support that may turn it back on.',
      code: "import sys\ngil = getattr(sys, '_is_gil_enabled', lambda: True)()\nprint('GIL enabled' if gil else 'free-threaded')",
    },
  ],

  examples: [
    { title: 'The default: 5 ms',       code: 'import sys\nsys.getswitchinterval()', returns: '0.005' },
    { title: 'Set and restore',         code: 'import sys\nold = sys.getswitchinterval()\nsys.setswitchinterval(0.001)\ntry:\n    result = sys.getswitchinterval()\nfinally:\n    sys.setswitchinterval(old)\nresult', returns: '0.001' },
    { title: 'Zero is rejected',        code: 'import sys\nsys.setswitchinterval(0)', returns: 'ValueError: switch interval must be strictly positive' },
    { title: 'So are negative values',  code: 'import sys\nsys.setswitchinterval(-1)', returns: 'ValueError: switch interval must be strictly positive' },
    { title: 'The GIL on a standard build (3.13+)', code: "import sys\ngetattr(sys, '_is_gil_enabled', lambda: True)()", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Passing milliseconds',
      desc: 'The value is in seconds. 5 gives each thread a 5-second slice.',
      wrong: { label: '5', code: 'import sys\nold = sys.getswitchinterval()\nsys.setswitchinterval(5)\ntry:\n    result = sys.getswitchinterval()\nfinally:\n    sys.setswitchinterval(old)\nresult', output: '5.0' },
      fix:   { label: '0.005', code: 'import sys\nold = sys.getswitchinterval()\nsys.setswitchinterval(0.005)\ntry:\n    result = sys.getswitchinterval()\nfinally:\n    sys.setswitchinterval(old)\nresult', output: '0.005' },
    },
    {
      name: 'Calling the removed setcheckinterval',
      desc: 'Python 2 counted bytecode instructions; Python 3.2 replaced that with a time interval and 3.9 removed the old functions.',
      wrong: { label: 'setcheckinterval', code: 'import sys\nsys.setcheckinterval(100)', output: "AttributeError: module 'sys' has no attribute 'setcheckinterval'. Did you mean: 'setswitchinterval'?" },
      fix:   { label: 'setswitchinterval', code: 'import sys\nold = sys.getswitchinterval()\nsys.setswitchinterval(0.002)\ntry:\n    result = sys.getswitchinterval()\nfinally:\n    sys.setswitchinterval(old)\nresult', output: '0.002' },
    },
  ],

  when: {
    use: [
      'Tuning latency vs throughput of programs with several busy threads',
      'Reproducing thread-scheduling bugs (very small intervals switch more often)',
    ],
    avoid: [
      'Speeding up CPU-bound work → multiprocessing / concurrent.futures.ProcessPoolExecutor',
      'I/O-bound concurrency → threads already release the GIL while waiting; or asyncio',
    ],
  },

  notes: {
    cpython:          'Python/ceval_gil.c: a thread waiting for the GIL sets a drop request after the interval; the holder releases it at the next check',
    'Free threading': 'The free-threaded build (python3.13t, PEP 703) can run without a GIL; PYTHON_GIL=0/1 or -X gil=0/1 choose at startup and sys._is_gil_enabled() reports the current state',
    '_is_gil_enabled': 'A documented CPython implementation detail (leading underscore): added in 3.13 and missing on 3.12 and older, hence the getattr fallback',
  },

  related: [
    { name: 'sys.float_info / thread_info', slug: 'float_info', when: 'Which thread library the build uses' },
    { name: 'sys.settrace', slug: 'settrace', when: 'Per-thread tracing' },
    { name: 'sys.flags',    slug: 'flags',    when: 'flags.gil and other startup options' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does sys.setswitchinterval do?',
      a: 'It sets how often (in seconds) the interpreter lets another thread take the GIL when several threads want to run Python code. The default is 0.005 seconds.',
    },
    {
      q: 'Does a smaller switch interval make threads faster?',
      a: 'No. It makes switching more frequent, which can improve responsiveness but adds overhead. CPU-bound threads still run one at a time under the GIL.',
    },
    {
      q: 'How do I check if the GIL is disabled?',
      a: 'On Python 3.13+, sys._is_gil_enabled() returns False when running free-threaded. It is always True on the standard build and does not exist before 3.13.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.setswitchinterval',
    meta:  'sys.setswitchinterval',
  },
};
