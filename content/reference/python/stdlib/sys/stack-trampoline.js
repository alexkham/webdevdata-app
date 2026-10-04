// content/reference/python/stdlib/sys/stack-trampoline.js — Linux perf support

export const meta = {
  slug:        'stack-trampoline',
  name:        'sys.activate_stack_trampoline / deactivate / is_active',
  signature:   'sys.activate_stack_trampoline(backend, /) · sys.deactivate_stack_trampoline() · sys.is_stack_trampoline_active()',
  blurb:       'Switch on the "perf trampoline" so the Linux perf profiler can show Python function names in native stack traces. Availability: Linux (3.12+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.12+ · Linux only',
  searchTerms: 'sys.activate_stack_trampoline activate_stack_trampoline sys.deactivate_stack_trampoline deactivate_stack_trampoline sys.is_stack_trampoline_active is_stack_trampoline_active perf profiler linux python -X perf PYTHONPERFSUPPORT perf trampoline not available flame graph',
};

export const method = {
  slug:      'stack-trampoline',
  name:      'sys.activate_stack_trampoline / deactivate / is_active',
  signature: 'sys.activate_stack_trampoline(backend, /) · sys.deactivate_stack_trampoline() · sys.is_stack_trampoline_active()',
  returns:   { type: 'None · None · bool', desc: 'is_stack_trampoline_active() tells whether a backend is active.' },

  category:    'sys function',
  version:     'Python 3.12+ · Linux only',
  hasLiveDemo: false,

  subtitle: 'perf sees only C frames, so normally every Python function appears as the same interpreter function. With the trampoline active, each Python function gets a small compiled entry point that perf can name. The functions exist on every platform, but activation works only where perf support was built in (Linux on x86-64 and AArch64): elsewhere it raises ValueError, while -X perf silently does nothing.',

  covers: ['activate_stack_trampoline', 'deactivate_stack_trampoline', 'is_stack_trampoline_active'],

  cheat: {
    commonCall: "sys.activate_stack_trampoline('perf')",
    returns:    'None',
    replaces:   'Starting the whole program with -X perf',
    watchOut:   "'perf' is the only backend; on Windows and macOS activation raises ValueError",
  },

  parameters: [
    { name: 'backend', type: 'str', required: true, default: null, desc: "The trampoline backend. The only supported value is 'perf'." },
  ],

  patterns: [
    {
      name: 'Profile only one part of a program',
      desc: 'Activate around the code of interest, then record with perf from outside.',
      code: "import sys\nsys.activate_stack_trampoline('perf')\ntry:\n    hot_path()\nfinally:\n    sys.deactivate_stack_trampoline()",
    },
    {
      name: 'Profile the whole run',
      desc: 'Enable at startup instead (Linux).',
      code: '# shell:\n# perf record -F 9999 -g -o perf.data python -X perf my_script.py\n# perf report -g -i perf.data',
    },
    {
      name: 'Guard for portability',
      desc: 'Only try where the platform supports it.',
      code: "import sys\nif sys.platform == 'linux':\n    try:\n        sys.activate_stack_trampoline('perf')\n    except ValueError:\n        pass  # Python built without perf support",
    },
  ],

  examples: [
    { title: 'Off by default',               code: 'import sys\nsys.is_stack_trampoline_active()', returns: 'False' },
    { title: 'Deactivating when inactive is a no-op', code: 'import sys\n(sys.deactivate_stack_trampoline(), sys.is_stack_trampoline_active())', returns: '(None, False)' },
    { title: 'The backend must be a string', code: 'import sys\nsys.activate_stack_trampoline(1)', returns: 'TypeError: activate_stack_trampoline() argument must be str, not int' },
    { title: 'Present on every platform (3.12+)', code: "import sys\nall(hasattr(sys, n) for n in ('activate_stack_trampoline', 'deactivate_stack_trampoline', 'is_stack_trampoline_active'))", returns: 'True' },
    { title: 'Positional-only argument',     code: "import sys\nsys.activate_stack_trampoline(backend='perf')", returns: 'TypeError: sys.activate_stack_trampoline() takes no keyword arguments' },
  ],

  pitfalls: [
    {
      name: 'Passing the backend as a keyword',
      desc: "The parameter is positional-only. Pass 'perf' positionally — and, for portable code, catch the ValueError that builds without perf support raise.",
      wrong: { label: "backend='perf'", code: "import sys\nsys.activate_stack_trampoline(backend='perf')", output: 'TypeError: sys.activate_stack_trampoline() takes no keyword arguments' },
      fix:   { label: 'positional, guarded', code: "import sys\ntry:\n    sys.activate_stack_trampoline('perf')\nexcept ValueError:\n    pass  # this build has no perf support\nfinally:\n    sys.deactivate_stack_trampoline()\nsys.is_stack_trampoline_active()", output: 'False' },
    },
    {
      name: 'Treating hasattr as a feature check',
      desc: 'The three functions exist on every platform since 3.12, so hasattr is True even where activation can only fail. The real condition is a Linux x86-64 or AArch64 build.',
      wrong: { label: 'hasattr', code: "platform = 'darwin'  # e.g. macOS\nhas_function = True  # hasattr(sys, 'activate_stack_trampoline') on 3.12+, any OS\nhas_function", output: 'True' },
      fix:   { label: 'platform check', code: "platform = 'darwin'\nplatform == 'linux'", output: 'False' },
    },
  ],

  when: {
    use: [
      'Profiling Python code with Linux perf (flame graphs mixing Python and C frames)',
    ],
    avoid: [
      'Pure-Python profiling → cProfile, or a sampling profiler such as py-spy',
      'Windows and macOS → not available',
    ],
  },

  notes: {
    cpython:          'Python/perf_trampoline.c: gives each code object its own copy of a small assembly trampoline and lists them in /tmp/perf-<pid>.map so perf can resolve the names',
    'Availability':   'Linux (docs.python.org). CPython enables it only for x86_64-linux-gnu and aarch64-linux-gnu builds (configure.ac); everywhere else activation raises ValueError("perf trampoline not available")',
    'Backends':       "'perf' is the documented backend; 3.13's implementation also accepts 'perf_jit' (the -X perf_jit mode) and rejects other names with ValueError: invalid backend",
    'Startup options': '-X perf or PYTHONPERFSUPPORT=1 (3.12+); -X perf_jit / PYTHON_PERF_JIT_SUPPORT for DWARF-based unwinding (3.13+)',
  },

  related: [
    { name: 'sys.settrace / setprofile', slug: 'settrace', when: 'Pure-Python profiling hooks' },
    { name: 'sys.platform', slug: 'platform', when: 'Check for Linux first' },
    { name: 'sys.flags',    slug: 'flags',    when: 'Other -X options' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why do I get "ValueError: perf trampoline not available"?',
      a: 'The interpreter was built without perf trampoline support — always the case on Windows and macOS, and possible for some Linux builds. The feature only works with Linux perf.',
    },
    {
      q: 'Does sys.activate_stack_trampoline work on Windows or macOS?',
      a: 'No. The function exists there (3.12+) but always raises ValueError: perf trampoline not available. CPython builds the trampoline only for Linux on x86-64 and AArch64.',
    },
    {
      q: 'How do I profile Python with perf?',
      a: 'Run python -X perf script.py under perf record (or call sys.activate_stack_trampoline("perf") at run time), then perf report shows Python function names. See "Python support for the Linux perf profiler" in the Python docs.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.activate_stack_trampoline',
    meta:  'sys.activate_stack_trampoline',
  },
};
