// content/reference/python/stdlib/sys/index.js — the sys module hub

export const meta = {
  slug:        'index',
  name:        'sys',
  signature:   'import sys',
  blurb:       'The running interpreter itself: command-line arguments, exit codes, the import path, standard streams, version checks, recursion and integer-string limits, and the hooks Python calls on errors.',
  category:    'system',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'sys module python sys argv sys exit sys path sys version_info sys stdout sys stderr sys platform recursion limit int max str digits interpreter command line arguments exit code import path modules',
};

export const method = {
  slug: 'index',
  name: 'sys',

  category:    'System',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'sys is the interpreter talking about itself: what it was started with (argv, flags), where it imports from (path, modules), where output goes (stdout, stderr), which version and platform it is, and the limits and hooks you can change while it runs.',

  // Linux/Unix-only names: the audit computes dir(sys) on Windows, where
  // these do not exist (taken from CPython 3.12 under WSL + the 3.13 docs)
  platformNames: ['abiflags', 'getdlopenflags', 'setdlopenflags', 'getandroidapilevel'],

  imports: ['import sys', 'from sys import argv, exit'],
  facts: [
    { label: 'Public API',   value: 'No __all__: 76 public names on Windows CPython 3.13, plus the Unix-only abiflags, getdlopenflags and setdlopenflags, and Android-only getandroidapilevel' },
    { label: 'Always there', value: 'sys is built into the interpreter (it is in sys.builtin_module_names) — importing it never fails' },
    { label: 'Most used',    value: 'argv, exit, path, stdout/stderr, version_info, platform' },
    { label: 'Varies by machine', value: 'paths, executable, platform, byteorder, maxsize, sizes and encodings describe the interpreter you run — this site prints them only where the value is the same everywhere' },
  ],

  modes: [
    {
      id: 'version',
      label: 'version check',
      blurb: 'version_info is a tuple, so it compares with (major, minor) element by element. The demo runs as Python 3.13.',
      params: [
        { name: 'major', type: 'int', hint: 'major version', input: 'number' },
        { name: 'minor', type: 'int', hint: 'minor version', input: 'number' },
      ],
      template: 'import sys\nsys.version_info >= ({$major}, {$minor})',
      cases: [
        { id: 'py38',  label: '>= 3.8',  values: { major: '3', minor: '8' } },
        { id: 'py313', label: '>= 3.13', values: { major: '3', minor: '13' } },
        { id: 'py27',  label: '>= 2.7',  values: { major: '2', minor: '7' } },
      ],
    },
    {
      id: 'limit',
      label: 'digit limit',
      blurb: 'int() and str() refuse decimal numbers longer than sys.get_int_max_str_digits() digits — 4300 by default.',
      params: [{ name: 'digits', type: 'int', hint: 'number of digits', input: 'number' }],
      template: "import sys\nn = int('9' * {$digits})\nlen(str(n))",
      cases: [
        { id: 'ok',   label: '4300 digits', values: { digits: '4300' } },
        { id: 'over', label: '4301 digits', values: { digits: '4301' } },
        { id: 'zero', label: '0 digits',    values: { digits: '0' } },
      ],
    },
  ],
  demoExplainer: 'version_info is (3, 13, micro, releaselevel, serial) on 3.13, and a longer tuple that starts with the same items compares greater, so (3, 13) is satisfied. The digit limit protects against denial-of-service by huge decimal strings: 4300 digits convert, 4301 raise ValueError and the message names the limit and the actual length. Zero nines is the empty string, which is not a number at all.',

  patterns: [
    {
      name: 'Script with arguments and an exit code',
      desc: 'argv[1:] are the arguments; sys.exit(message) prints to stderr and exits with status 1.',
      code: "import sys\n\ndef main(argv):\n    if len(argv) != 2:\n        sys.exit(f'usage: {argv[0]} FILE')\n    print(open(argv[1], encoding='utf-8').read())\n\nif __name__ == '__main__':\n    main(sys.argv)",
    },
    {
      name: 'Feature check by version',
      desc: 'Compare version_info with a tuple — never compare version strings.',
      code: "import sys\nif sys.version_info >= (3, 11):\n    import tomllib\nelse:\n    import tomli as tomllib",
    },
    {
      name: 'Errors to stderr',
      desc: 'Keep stdout for data so it can be piped; diagnostics go to stderr.',
      code: "import sys\nprint('warning: input has no header', file=sys.stderr)",
    },
    {
      name: 'Platform switch',
      desc: 'sys.platform is fixed when Python is built; startswith keeps older names working.',
      code: "import sys\nif sys.platform == 'win32':\n    ...\nelif sys.platform.startswith('linux'):\n    ...\nelif sys.platform == 'darwin':\n    ...",
    },
  ],

  examples: [
    { title: 'Arguments of a child Python', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv)', 'a', 'b c'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"['-c', 'a', 'b c']\"" },
    { title: 'sys.exit raises SystemExit',  code: "import sys\ntry:\n    sys.exit(2)\nexcept SystemExit as e:\n    result = e.code\nresult", returns: '2' },
    { title: 'Version check',               code: 'import sys\nsys.version_info >= (3, 8)', returns: 'True' },
    { title: 'Is a module in the stdlib?',  code: "import sys\n('json' in sys.stdlib_module_names, 'requests' in sys.stdlib_module_names)", returns: '(True, False)' },
    { title: 'The default recursion limit', code: 'import sys\nsys.getrecursionlimit()', returns: '1000' },
    { title: 'Writing to stdout returns the length', code: "import sys\nsys.stdout.write('hi\\n')", returns: 'hi\n3' },
    { title: 'Too many digits',             code: 'import sys\nstr(10 ** 4300)', returns: 'ValueError: Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit' },
  ],

  pitfalls: [
    {
      name: 'Comparing version strings',
      desc: 'Strings compare character by character, so "3.10" sorts before "3.9". Compare version_info tuples.',
      wrong: { label: 'strings', code: "'3.10' >= '3.9'", output: 'False' },
      fix:   { label: 'tuples',  code: '(3, 10) >= (3, 9)', output: 'True' },
    },
    {
      name: 'except Exception does not stop sys.exit',
      desc: 'SystemExit derives from BaseException, not Exception — so a broad except Exception lets the exit through, while a bare except: swallows it.',
      wrong: { label: 'bare except', code: "import sys\ntry:\n    sys.exit(1)\nexcept:\n    result = 'exit swallowed'\nresult", output: "'exit swallowed'" },
      fix:   { label: 'except Exception', code: "import sys\ntry:\n    try:\n        sys.exit(1)\n    except Exception:\n        result = 'caught'\nexcept SystemExit:\n    result = 'exit passed through'\nresult", output: "'exit passed through'" },
    },
    {
      name: "'win' in sys.platform",
      desc: "A substring test also matches 'darwin' (macOS). Compare with == or use startswith.",
      wrong: { label: "'win' in", code: "platform = 'darwin'  # what macOS reports\n'win' in platform", output: 'True' },
      fix:   { label: "== 'win32'", code: "platform = 'darwin'\nplatform == 'win32'", output: 'False' },
    },
  ],

  when: {
    use: [
      'Small scripts: arguments (argv), exit codes (exit), errors to stderr',
      'Version and platform checks before using newer or OS-specific features',
      'Debugging and tooling: import path, loaded modules, tracing, hooks',
    ],
    avoid: [
      'Real command-line parsing → argparse',
      'Operating-system details (environment, files, processes) → os, platform, subprocess',
      'Changing sys.path to make imports work → install the package (pip install -e .)',
    ],
  },

  notes: {
    cpython:          'Python/sysmodule.c — a built-in module created before anything else is imported; sys.monitoring (3.12+) is a namespace inside it',
    'Read-only?':     'Most data attributes describe the interpreter and should be treated as read-only; path, modules, meta_path, the std streams and the hooks are meant to be replaced or changed',
    'Private names':  'Underscore names such as _getframe, _is_gil_enabled (3.13) and _xoptions are CPython implementation details, documented but not guaranteed in other Pythons',
    'Interactive only': 'ps1, ps2, last_exc (3.12), last_type, last_value and last_traceback exist only after the interactive interpreter sets them, and tracebacklimit only if you set it',
  },

  related: [
    { name: 'SystemExit',     slug: 'systemexit',     when: 'What sys.exit raises',                 category: 'exceptions' },
    { name: 'RecursionError', slug: 'recursionerror', when: 'What the recursion limit raises',      category: 'exceptions' },
    { name: 'print()',        slug: 'print',          when: 'Writes to sys.stdout (file= to change)', category: 'functions' },
    { name: 'input()',        slug: 'input',          when: 'Reads a line from sys.stdin',          category: 'functions' },
    { name: 'pathlib module', slug: 'pathlib',        when: 'Paths for the files your script handles', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the sys module in Python?',
      a: 'A built-in module that exposes the running interpreter: sys.argv (command-line arguments), sys.exit(), sys.path (where imports look), sys.stdout/stderr/stdin, sys.version_info and sys.platform, plus limits (recursion, integer digits) and hooks (excepthook, settrace).',
    },
    {
      q: 'How do I get command-line arguments in Python?',
      a: 'sys.argv is a list of strings: argv[0] is the script name and argv[1:] are the arguments. They are always str — convert with int() or float(). For options and help text use argparse.',
    },
    {
      q: 'How do I check the Python version in code?',
      a: 'Compare sys.version_info with a tuple: sys.version_info >= (3, 11). Do not parse sys.version, and never compare version strings — "3.10" < "3.9" as strings.',
    },
    {
      q: 'What is the difference between sys.exit() and exit()?',
      a: 'Both raise SystemExit. exit() and quit() are added by the site module for the interactive prompt and are missing when Python runs with -S; sys.exit() is always available and is the one to use in programs.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html',
    meta:  'sys — System-specific parameters and functions',
  },
};
