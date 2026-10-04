// content/reference/python/stdlib/sys/platform.js — sys.platform and sys.byteorder

export const meta = {
  slug:        'platform',
  name:        'sys.platform / sys.byteorder',
  signature:   "sys.platform: str  ('linux', 'darwin', 'win32', …) · sys.byteorder: 'little' | 'big'",
  blurb:       "Which OS the interpreter was built for — 'linux', 'darwin' (macOS), 'win32' (also on 64-bit Windows), 'android', 'ios' … — and the native byte order of the CPU.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     "All versions ('android' 3.13+, 'linux' without a number since 3.3)",
  searchTerms: 'sys.platform platform sys.byteorder byteorder detect operating system python win32 linux darwin macos windows check os endianness little endian big endian os.name platform.system',
};

export const method = {
  slug:      'platform',
  name:      'sys.platform / sys.byteorder',
  signature: "sys.platform: str  ('linux', 'darwin', 'win32', …) · sys.byteorder: 'little' | 'big'",
  returns:   { type: 'str · str', desc: "platform: the build platform identifier. byteorder: 'little' or 'big'." },

  category:    'sys attribute',
  version:     "All versions ('android' 3.13+, 'linux' without a number since 3.3)",
  hasLiveDemo: false,

  subtitle: "sys.platform is the cheap, static OS check that type checkers understand. It is fixed when Python is built and names the OS family, not its version: Windows is always 'win32', even 64-bit. The value depends on the reader's machine, so the examples compare it rather than print it.",

  covers: ['platform', 'byteorder'],

  cheat: {
    commonCall: "if sys.platform == 'win32': ...",
    returns:    "'linux', 'darwin', 'win32', 'cygwin', 'emscripten', 'wasi', 'android', 'ios', 'aix', 'sunos5' …",
    replaces:   'platform.system() for the common branch-by-OS case',
    watchOut:   "'win' in sys.platform also matches 'darwin'",
  },

  parameters: [],

  patterns: [
    {
      name: 'Branch by operating system',
      desc: 'Exact comparison for the well-known values, startswith for platforms whose name carries a version.',
      code: "import sys\nif sys.platform == 'win32':\n    config_dir = Path(os.environ['APPDATA'])\nelif sys.platform == 'darwin':\n    config_dir = Path.home() / 'Library' / 'Application Support'\nelse:\n    config_dir = Path.home() / '.config'",
    },
    {
      name: 'Platform-specific imports for type checkers',
      desc: 'mypy and pyright evaluate sys.platform checks and skip the other branch.',
      code: "import sys\nif sys.platform == 'win32':\n    import winreg\nelse:\n    import fcntl",
    },
    {
      name: 'Native-order binary data',
      desc: 'Use byteorder when the bytes stay on this machine; use an explicit order for files and network data.',
      code: "import sys\nraw = n.to_bytes(4, sys.byteorder)          # memory-compatible\nwire = n.to_bytes(4, 'big')                 # portable",
    },
  ],

  examples: [
    { title: 'Consistent with os.name',    code: "import os, sys\n(sys.platform == 'win32') == (os.name == 'nt')", returns: 'True' },
    { title: 'Consistent with platform.system()', code: "import platform, sys\n(sys.platform == 'darwin') == (platform.system() == 'Darwin')", returns: 'True' },
    { title: 'Always lower case',          code: 'import sys\nsys.platform == sys.platform.lower()', returns: 'True' },
    { title: 'byteorder is one of two values', code: "import sys\nsys.byteorder in ('little', 'big')", returns: 'True' },
    { title: 'Native order round trip',    code: 'import sys\nint.from_bytes((513).to_bytes(2, sys.byteorder), sys.byteorder)', returns: '513' },
    { title: 'Matches how array stores numbers', code: "import sys\nfrom array import array\narray('H', [1]).tobytes() == (1).to_bytes(2, sys.byteorder)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: "Testing with 'win' in sys.platform",
      desc: "macOS reports 'darwin', which contains 'win'. Compare with == 'win32' (or startswith('win')).",
      wrong: { label: "'win' in", code: "platform = 'darwin'  # sys.platform on macOS\n'win' in platform", output: 'True' },
      fix:   { label: "== 'win32'", code: "platform = 'darwin'\nplatform == 'win32'", output: 'False' },
    },
    {
      name: "Comparing with 'linux2'",
      desc: "Before Python 3.3 Linux reported 'linux2' (or 'linux3'); since 3.3 it is plain 'linux'. startswith('linux') works with both.",
      wrong: { label: "== 'linux2'", code: "platform = 'linux'  # sys.platform on Linux, 3.3+\nplatform == 'linux2'", output: 'False' },
      fix:   { label: "startswith('linux')", code: "platform = 'linux'\nplatform.startswith('linux')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Branching code and imports by operating system',
      'Choosing native byte order for data that never leaves the machine (byteorder)',
    ],
    avoid: [
      'OS version, release or machine architecture → platform.release(), platform.machine()',
      'Coarse POSIX-vs-Windows split → os.name',
      'File formats and network protocols → an explicit byte order (struct "<" / ">")',
    ],
  },

  notes: {
    cpython:        "Compiled in at build time (Python/getplatform.c returns the PLATFORM macro); byteorder comes from the compiler's endianness",
    'Values':       "aix, android, emscripten, ios, linux, darwin (macOS), win32, cygwin, wasi; other Unixes: uname -s lowercased plus the major release at build time, e.g. sunos5 (FreeBSD drops the number from 3.14)",
    'Changes':      "3.3: 'linux' replaced linux2/linux3. 3.8: 'aix' without a version. 3.13: Android reports 'android' instead of 'linux'",
    'byteorder':    "'little' on x86, x86-64 and (almost always) ARM; 'big' on, e.g., IBM s390x",
  },

  related: [
    { name: 'sys.version_info', slug: 'version', when: 'Which Python version' },
    { name: 'sys.maxsize',      slug: 'maxsize', when: '32-bit or 64-bit build' },
    { name: 'getwindowsversion', slug: 'getwindowsversion', when: 'Windows-only version details' },
    { name: 'int.to_bytes()',   slug: 'int-to_bytes', when: 'Uses a byte order argument', category: 'functions' },
    { name: 'sys module',       slug: 'sys',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I detect the operating system in Python?',
      a: "sys.platform: 'win32' on Windows, 'linux' on Linux, 'darwin' on macOS. For more detail (version, architecture) use the platform module: platform.system(), platform.release(), platform.machine().",
    },
    {
      q: "Why is sys.platform 'win32' on 64-bit Windows?",
      a: "It names the Windows API family (Win32), not the bitness. 64-bit Python on 64-bit Windows still reports 'win32'; check sys.maxsize > 2**32 for a 64-bit build.",
    },
    {
      q: 'What is the difference between sys.platform, os.name and platform.system()?',
      a: "os.name is coarse ('posix' or 'nt'). sys.platform is a build-time identifier ('linux', 'darwin', 'win32' …). platform.system() asks the running OS and returns names like 'Linux', 'Darwin', 'Windows'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.platform',
    meta:  'sys.platform',
  },
};
