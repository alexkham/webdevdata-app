// content/reference/python/stdlib/sys/abiflags.js — Unix-only (and Android-only) names

export const meta = {
  slug:        'abiflags',
  name:        'sys.abiflags / getdlopenflags / setdlopenflags / getandroidapilevel',
  signature:   'sys.abiflags: str · sys.getdlopenflags() · sys.setdlopenflags(n) · sys.getandroidapilevel()',
  blurb:       'Names that exist only on some platforms: the ABI flags of the build and the dlopen() flags used to load extension modules (Unix), and the Android API level the build targets (Android).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'abiflags 3.2+ · dlopen flags 2.2+ · getandroidapilevel 3.7+',
  searchTerms: 'sys.abiflags abiflags sys.getdlopenflags getdlopenflags sys.setdlopenflags setdlopenflags sys.getandroidapilevel getandroidapilevel unix only linux macos android dlopen RTLD_GLOBAL RTLD_NOW RTLD_LAZY extension module symbols abi flags pep 3149 debug build',
};

export const method = {
  slug:      'abiflags',
  name:      'sys.abiflags / getdlopenflags / setdlopenflags / getandroidapilevel',
  signature: 'sys.abiflags: str · sys.getdlopenflags() · sys.setdlopenflags(n) · sys.getandroidapilevel()',
  returns:   { type: 'str · int · None · int', desc: "abiflags: '' on standard builds. getdlopenflags: the RTLD_* bit mask (2 = RTLD_NOW on Linux). getandroidapilevel: the minimum Android API level." },

  category:    'sys function',
  version:     'abiflags 3.2+ · dlopen flags 2.2+ · getandroidapilevel 3.7+',
  hasLiveDemo: false,

  subtitle: 'On Windows none of these exist, so the examples only compare availability with the platform. abiflags and the dlopen flags are "Availability: Unix" (Linux, macOS, the BSDs); getandroidapilevel is "Availability: Android". The values shown in prose were checked on Linux (CPython 3.12).',

  covers: ['abiflags', 'getdlopenflags', 'setdlopenflags', 'getandroidapilevel'],

  cheat: {
    commonCall: 'sys.setdlopenflags(os.RTLD_GLOBAL | os.RTLD_NOW)',
    returns:    'None — affects extension modules imported afterwards',
    replaces:   'Hacks with ctypes.CDLL(..., mode=RTLD_GLOBAL) before imports',
    watchOut:   'Unix only — guard with os.name / sys.platform',
  },

  parameters: [
    { name: 'n', type: 'int', required: true, default: null, desc: 'setdlopenflags: a bit mask of os.RTLD_* constants (RTLD_LAZY, RTLD_NOW, RTLD_GLOBAL, RTLD_LOCAL …).' },
  ],

  patterns: [
    {
      name: 'Share C symbols between extension modules',
      desc: 'Import with RTLD_GLOBAL so a later extension can resolve symbols from an earlier one; restore afterwards.',
      code: "import os, sys\nold = sys.getdlopenflags()\nsys.setdlopenflags(old | os.RTLD_GLOBAL)\ntry:\n    import first_extension\nfinally:\n    sys.setdlopenflags(old)",
    },
    {
      name: 'Debug or free-threaded build?',
      desc: 'Portable checks that do not depend on abiflags existing.',
      code: "import sys, sysconfig\nis_debug = hasattr(sys, 'gettotalrefcount')\nfree_threaded = bool(sysconfig.get_config_var('Py_GIL_DISABLED'))",
    },
    {
      name: 'Android-specific code',
      desc: 'Guard by platform (3.13+ reports android).',
      code: "import sys\nif sys.platform == 'android':\n    min_api = sys.getandroidapilevel()",
    },
  ],

  examples: [
    { title: 'The dlopen functions exist on POSIX only', code: "import os, sys\nall(hasattr(sys, n) == (os.name == 'posix') for n in ('getdlopenflags', 'setdlopenflags'))", returns: 'True' },
    { title: 'So does abiflags',               code: "import os, sys\nhasattr(sys, 'abiflags') == (os.name == 'posix')", returns: 'True' },
    { title: 'The RTLD constants go with them', code: "import os, sys\nhasattr(os, 'RTLD_NOW') == hasattr(sys, 'getdlopenflags')", returns: 'True' },
    { title: 'abiflags is a str where it exists', code: "import sys\nisinstance(getattr(sys, 'abiflags', ''), str)", returns: 'True' },
    { title: 'Not on Windows',                 code: "import sys\nsys.platform != 'win32' or not any(hasattr(sys, n) for n in ('abiflags', 'getdlopenflags', 'setdlopenflags', 'getandroidapilevel'))", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Reading sys.abiflags unguarded',
      desc: 'Windows has no sys.abiflags. Use getattr with a default (or sysconfig.get_config_var("ABIFLAGS")).',
      wrong: { label: 'attribute access', code: "import types\nwin_sys = types.SimpleNamespace(platform='win32')  # stands in for sys on Windows\nwin_sys.abiflags", output: "AttributeError: 'types.SimpleNamespace' object has no attribute 'abiflags'" },
      fix:   { label: 'getattr default', code: "import types\nwin_sys = types.SimpleNamespace(platform='win32')\ngetattr(win_sys, 'abiflags', '')", output: "''" },
    },
    {
      name: 'Changing the dlopen flags for the rest of the program',
      desc: 'The flags apply to every later extension import. Change them around the one import that needs it and restore the old value.',
      wrong: { label: 'set and forget', code: "flags = {'value': 2}  # stands in for sys.getdlopenflags() on Linux (RTLD_NOW)\nRTLD_GLOBAL = 256\nflags['value'] |= RTLD_GLOBAL\nflags['value']  # still 258 for every later import", output: '258' },
      fix:   { label: 'restore', code: "flags = {'value': 2}\nRTLD_GLOBAL = 256\nold = flags['value']\nflags['value'] |= RTLD_GLOBAL\ntry:\n    pass  # import the one extension here\nfinally:\n    flags['value'] = old\nflags['value']", output: '2' },
    },
  ],

  when: {
    use: [
      'Extension modules that must share C symbols (RTLD_GLOBAL), e.g. some MPI or plugin setups',
      'Build diagnostics on POSIX (abiflags) and Android-specific code (getandroidapilevel)',
    ],
    avoid: [
      'Portable build checks → sysconfig.get_config_var(...)',
      'Loading a shared library yourself → ctypes.CDLL(path, mode=os.RTLD_GLOBAL)',
    ],
  },

  notes: {
    cpython:          'Python/sysmodule.c: abiflags from the ABIFLAGS build variable; the dlopen flags are stored per interpreter and used by the extension-module loader (Python/dynload_shlib.c)',
    'abiflags':       "Empty on standard builds since 3.8 (the 'm' pymalloc flag was dropped); 'd' marks a debug build (PEP 3149)",
    'dlopen flags':   'getdlopenflags() returned 2 (os.RTLD_NOW) on Linux; the RTLD_* constants are in the os module',
    'Android':        "getandroidapilevel() is the build-time minimum API level; platform.android_ver() gives the running device's version",
  },

  related: [
    { name: 'getwindowsversion / winver', slug: 'getwindowsversion', when: 'The Windows-only names' },
    { name: 'sys.platform', slug: 'platform', when: 'Guard platform-specific code' },
    { name: 'sys.version_info / implementation', slug: 'version', when: 'Portable build information' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What missing platform names raise', category: 'exceptions' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is sys.abiflags?',
      a: "On POSIX builds, the ABI flags from PEP 3149 that appear in library and executable names, such as 'd' for a debug build. It is an empty string on standard builds since Python 3.8 and does not exist on Windows.",
    },
    {
      q: 'When do I need sys.setdlopenflags?',
      a: 'Rarely: when one C extension must use symbols exported by another one loaded earlier. Setting os.RTLD_GLOBAL before importing the first makes its symbols globally visible. It is available on Unix only.',
    },
    {
      q: 'Why do some sys functions not exist on my system?',
      a: 'sys mirrors the platform: abiflags, getdlopenflags and setdlopenflags exist only on Unix, getandroidapilevel only on Android, getwindowsversion, winver and dllhandle only on Windows. Check sys.platform before using them.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.abiflags',
    meta:  'sys.abiflags',
  },
};
