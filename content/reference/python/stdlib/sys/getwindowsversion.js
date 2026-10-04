// content/reference/python/stdlib/sys/getwindowsversion.js — Windows-only names

export const meta = {
  slug:        'getwindowsversion',
  name:        'sys.getwindowsversion / winver / dllhandle',
  signature:   'sys.getwindowsversion() · sys.winver: str · sys.dllhandle: int',
  blurb:       'Windows-only: the Windows version as a named tuple (major, minor, build, platform, service_pack …), the Python registry version string (winver), and the handle of the Python DLL. Availability: Windows.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'All versions on Windows (named tuple 3.2+, platform_version 3.6+)',
  searchTerms: 'sys.getwindowsversion getwindowsversion sys.winver winver sys.dllhandle dllhandle windows version python windows 10 windows 11 build number 22000 major minor product_type platform_version registry python dll windows only',
};

export const method = {
  slug:      'getwindowsversion',
  name:      'sys.getwindowsversion / winver / dllhandle',
  signature: 'sys.getwindowsversion() · sys.winver: str · sys.dllhandle: int',
  returns:   { type: 'named tuple · str · int', desc: "getwindowsversion: major, minor, build, platform, service_pack, … platform_version. winver: e.g. '3.13'. dllhandle: the DLL handle as an int." },

  category:    'sys function',
  version:     'All versions on Windows (named tuple 3.2+, platform_version 3.6+)',
  hasLiveDemo: false,

  subtitle: 'These three names exist only on Windows — on Linux and macOS accessing them raises AttributeError, so guard with sys.platform == "win32". Note that Windows 11 still reports major version 10; the build number (22000 and up) is what tells it apart.',

  covers: ['getwindowsversion', 'winver', 'dllhandle'],

  cheat: {
    commonCall: 'sys.getwindowsversion().build',
    returns:    'int — 22000 or higher on Windows 11',
    replaces:   'Calling the Win32 GetVersionEx through ctypes',
    watchOut:   'Windows 11 reports major=10; winver is the Python version, not Windows',
  },

  parameters: [],

  patterns: [
    {
      name: 'Windows 10 or 11?',
      desc: 'Guard first, then use the build number.',
      code: "import sys\nif sys.platform == 'win32':\n    v = sys.getwindowsversion()\n    is_windows_11 = (v.major, v.build) >= (10, 22000)",
    },
    {
      name: 'Human-readable release',
      desc: 'The platform module turns the numbers into names and works everywhere.',
      code: "import platform\nplatform.release()   # '10', '11', … on Windows; the kernel version on Linux",
    },
  ],

  examples: [
    { title: 'Only defined on Windows',          code: "import sys\nall(hasattr(sys, n) == (sys.platform == 'win32') for n in ('getwindowsversion', 'winver', 'dllhandle'))", returns: 'True' },
    { title: 'platform is always 2 (Win32 NT)',   code: "import sys\nsys.platform != 'win32' or sys.getwindowsversion().platform == 2", returns: 'True' },
    { title: 'Five items by index, more by name', code: "import sys\nsys.platform != 'win32' or (len(sys.getwindowsversion()) == 5 and len(sys.getwindowsversion().platform_version) == 3)", returns: 'True' },
    { title: 'winver is the Python version',     code: "import sys\nv = sys.version_info\nsys.platform != 'win32' or sys.winver.startswith(f'{v.major}.{v.minor}')", returns: 'True' },
    { title: 'dllhandle is an int',              code: "import sys\nsys.platform != 'win32' or isinstance(sys.dllhandle, int)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Telling Windows 11 by the major version',
      desc: 'Windows 11 reports major 10, minor 0. Only the build number (22000 or higher) distinguishes it — the platform module uses the same rule.',
      wrong: { label: 'major >= 11', code: "major, build = 10, 26200  # what getwindowsversion() reports on a Windows 11 PC\n'Windows 11' if major >= 11 else 'Windows 10'", output: "'Windows 10'" },
      fix:   { label: 'build >= 22000', code: "major, build = 10, 26200\n'Windows 11' if (major, build) >= (10, 22000) else 'Windows 10'", output: "'Windows 11'" },
    },
    {
      name: 'Calling it without a platform guard',
      desc: 'On Linux and macOS sys has no getwindowsversion, so unguarded code fails there. Check sys.platform first (type checkers understand this check).',
      wrong: { label: 'unguarded', code: "import types\nlinux_sys = types.SimpleNamespace(platform='linux')  # stands in for sys on Linux\nlinux_sys.getwindowsversion()", output: "AttributeError: 'types.SimpleNamespace' object has no attribute 'getwindowsversion'" },
      fix:   { label: "platform == 'win32'", code: "import types\nlinux_sys = types.SimpleNamespace(platform='linux')\nlinux_sys.getwindowsversion().build if linux_sys.platform == 'win32' else 'not Windows'", output: "'not Windows'" },
    },
  ],

  when: {
    use: [
      'Windows-specific code paths that depend on the OS build',
      'Diagnostics on Windows (which Python DLL, which registry key)',
    ],
    avoid: [
      'Cross-platform OS information → platform.system() / platform.release() / platform.version()',
      'Accurate OS version for display → platform.win32_ver() (docs recommend the platform module)',
    ],
  },

  notes: {
    cpython:          'Python/sysmodule.c, compiled only on Windows (MS_WINDOWS): getwindowsversion wraps GetVersionEx; platform_version is read from kernel32.dll\'s version resource',
    'Availability':   'Windows (docs.python.org) — the names do not exist on other platforms',
    'Compatibility':  'Indexing gives only the first five fields (major, minor, build, platform, service_pack); the rest are by name',
    'winver':         "The major.minor used for registry keys, e.g. '3.13', with a suffix on some builds: '3.13-32' (32-bit), '3.13-arm64', '3.13t' (free-threaded). Changing it has no effect",
  },

  related: [
    { name: 'sys.platform', slug: 'platform', when: "Guard with sys.platform == 'win32'" },
    { name: 'Unix-only names', slug: 'abiflags', when: 'The other platform-specific names' },
    { name: 'sys.version_info', slug: 'version', when: 'The Python version itself' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What these raise on Linux and macOS', category: 'exceptions' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the Windows version in Python?',
      a: "sys.getwindowsversion() returns (major, minor, build, platform, service_pack) plus named fields. For a readable name use platform.release() ('10' or '11') or platform.win32_ver().",
    },
    {
      q: 'Why does Python report Windows 10 on Windows 11?',
      a: 'Windows 11 kept version 10.0 — getwindowsversion().major is 10. Windows 11 builds start at 22000, so compare the build number.',
    },
    {
      q: 'Does sys.getwindowsversion work on Linux or macOS?',
      a: 'No. It, sys.winver and sys.dllhandle exist only on Windows; elsewhere they raise AttributeError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.getwindowsversion',
    meta:  'sys.getwindowsversion',
  },
};
