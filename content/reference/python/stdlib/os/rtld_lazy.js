// content/reference/python/stdlib/os/rtld_lazy.js

export const meta = {
  slug:        'rtld_lazy',
  name:        'os.RTLD_LAZY',
  signature:   'os.RTLD_LAZY / RTLD_NOW / RTLD_GLOBAL / RTLD_LOCAL / RTLD_NODELETE / RTLD_NOLOAD / RTLD_DEEPBIND',
  blurb:       'dlopen() flags for sys.setdlopenflags() and ctypes: when symbols are resolved (LAZY / NOW), whether they are visible to later libraries (GLOBAL / LOCAL), and the glibc extras NODELETE, NOLOAD and DEEPBIND. Unix only.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'os.RTLD_LAZY RTLD_LAZY os.RTLD_NOW RTLD_NOW os.RTLD_GLOBAL RTLD_GLOBAL os.RTLD_LOCAL RTLD_LOCAL os.RTLD_NODELETE RTLD_NODELETE os.RTLD_NOLOAD RTLD_NOLOAD os.RTLD_DEEPBIND RTLD_DEEPBIND dlopen flags sys.setdlopenflags sys.getdlopenflags ctypes CDLL mode ctypes.RTLD_GLOBAL shared library symbols undefined symbol extension module',
};

export const method = {
  slug:      'rtld_lazy',
  name:      'os.RTLD_LAZY',
  signature: 'os.RTLD_LAZY / RTLD_NOW / RTLD_GLOBAL / RTLD_LOCAL / RTLD_NODELETE / RTLD_NOLOAD / RTLD_DEEPBIND',
  returns:   { type: 'int', desc: 'Bit flags for dlopen(3), combined with |.' },

  category:    'os constants',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'Python loads C extension modules with dlopen(); sys.setdlopenflags() chooses the flags for later imports, and ctypes.CDLL(name, mode=...) takes them per library. The usual reason to touch them: make one extension symbols visible to another with RTLD_GLOBAL. Unix only; the constants do not exist on Windows.',

  covers: ['RTLD_DEEPBIND', 'RTLD_GLOBAL', 'RTLD_LAZY', 'RTLD_LOCAL', 'RTLD_NODELETE', 'RTLD_NOLOAD', 'RTLD_NOW'],

  cheat: {
    commonCall: 'sys.setdlopenflags(os.RTLD_NOW | os.RTLD_GLOBAL)',
    returns:    'None (affects later imports)',
    replaces:   'LD_PRELOAD hacks to share symbols between extensions',
    watchOut:   'Restore the old flags afterwards; RTLD_LOCAL is 0 on Linux, so OR-ing it changes nothing',
  },

  parameters: [],

  patterns: [
    {
      name: 'Import an extension with global symbols, then restore',
      desc: 'Only the imports inside the try see the changed flags.',
      code: 'import os, sys\nold = sys.getdlopenflags()\nsys.setdlopenflags(old | os.RTLD_GLOBAL)\ntry:\n    import some_extension\nfinally:\n    sys.setdlopenflags(old)',
    },
    {
      name: 'Load a library globally with ctypes',
      desc: 'Later libraries can resolve symbols against it.',
      code: "import ctypes, os\nlib = ctypes.CDLL('libfoo.so', mode=os.RTLD_NOW | os.RTLD_GLOBAL)",
    },
    {
      name: 'Is the library already loaded? (glibc)',
      desc: 'RTLD_NOLOAD does not load anything; it fails if the library is not loaded yet.',
      code: "import ctypes, os\ntry:\n    ctypes.CDLL('libssl.so.3', mode=os.RTLD_NOLOAD)\n    loaded = True\nexcept OSError:\n    loaded = False",
    },
  ],

  examples: [
    { title: 'Unix only',                         code: "import os\nall(hasattr(os, n) == (os.name == 'posix') for n in ('RTLD_LAZY', 'RTLD_NOW', 'RTLD_GLOBAL', 'RTLD_LOCAL'))", returns: 'True' },
    { title: 'sys.getdlopenflags exists on Unix only', code: "import sys\nhasattr(sys, 'getdlopenflags') == (sys.platform != 'win32')", returns: 'True' },
    { title: 'Combine flags with | (Linux values)', code: 'RTLD_NOW, RTLD_GLOBAL = 2, 256\nRTLD_NOW | RTLD_GLOBAL', returns: '258' },
    { title: 'Remove a flag with & ~',            code: 'RTLD_NOW, RTLD_GLOBAL = 2, 256\nflags = RTLD_NOW | RTLD_GLOBAL\nflags & ~RTLD_GLOBAL', returns: '2' },
    { title: 'All seven Linux values are distinct', code: "linux = {'RTLD_LAZY': 1, 'RTLD_NOW': 2, 'RTLD_NOLOAD': 4, 'RTLD_DEEPBIND': 8, 'RTLD_GLOBAL': 256, 'RTLD_LOCAL': 0, 'RTLD_NODELETE': 4096}\nlen(set(linux.values()))", returns: '7' },
  ],

  pitfalls: [
    {
      name: 'Expecting RTLD_LOCAL to switch GLOBAL off',
      desc: 'On Linux RTLD_LOCAL is 0, so OR-ing it into flags that already contain RTLD_GLOBAL changes nothing. Clear the GLOBAL bit instead.',
      wrong: { label: 'flags | RTLD_LOCAL', code: 'RTLD_NOW, RTLD_GLOBAL, RTLD_LOCAL = 2, 256, 0\nflags = RTLD_NOW | RTLD_GLOBAL\nflags | RTLD_LOCAL', output: '258' },
      fix:   { label: 'flags & ~RTLD_GLOBAL', code: 'RTLD_NOW, RTLD_GLOBAL, RTLD_LOCAL = 2, 256, 0\nflags = RTLD_NOW | RTLD_GLOBAL\n(flags & ~RTLD_GLOBAL) | RTLD_LOCAL', output: '2' },
    },
    {
      name: 'Setting the flags and never restoring them',
      desc: 'setdlopenflags is process-wide: every extension imported later is loaded the same way. Save the old value and restore it in finally, the same shape as saving any global setting.',
      wrong: { label: 'set and forget', code: "settings = {'dlopenflags': 2}\nsettings['dlopenflags'] = 2 | 256\nsettings['dlopenflags']", output: '258' },
      fix:   { label: 'try / finally', code: "settings = {'dlopenflags': 2}\nold = settings['dlopenflags']\nsettings['dlopenflags'] = old | 256\ntry:\n    pass  # import the extension here\nfinally:\n    settings['dlopenflags'] = old\nsettings['dlopenflags']", output: '2' },
    },
  ],

  when: {
    use: [
      'Two C extensions that must share symbols (RTLD_GLOBAL)',
      'Loading shared libraries with ctypes in a specific mode',
      'Failing early on missing symbols with RTLD_NOW',
    ],
    avoid: [
      'Windows → there is no dlopen; ctypes.WinDLL / CDLL use LoadLibrary (winmode=)',
      'Ordinary Python code → the default flags are right',
    ],
  },

  notes: {
    cpython:        'sys.setdlopenflags(flags) / sys.getdlopenflags() store the flags used by the import machinery when it dlopen()s an extension module; on our Linux check the default was 2 (RTLD_NOW)',
    'Availability': 'Unix only; on our Linux check all seven constants exist, on Windows none do. See the dlopen(3) manual page for the exact meaning; NODELETE, NOLOAD and DEEPBIND are extensions beyond POSIX, so not every Unix defines them',
    'Linux values': 'RTLD_LOCAL 0, RTLD_LAZY 1, RTLD_NOW 2, RTLD_NOLOAD 4, RTLD_DEEPBIND 8, RTLD_GLOBAL 256, RTLD_NODELETE 4096',
    'ctypes':       'ctypes.RTLD_GLOBAL and ctypes.RTLD_LOCAL mirror these (256 and 0 on Linux; both 0 on Windows), so ctypes code can use them without importing os constants that Windows lacks',
  },

  related: [
    { name: 'os.sysconf', slug: 'sysconf', when: 'Other low-level system configuration' },
    { name: 'os.uname', slug: 'uname', when: 'Which kernel / platform you are on' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
    { name: 'ImportError', slug: 'importerror', when: 'What an undefined symbol in an extension raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo, and why do the examples use the Linux numbers?',
      a: 'The RTLD_* constants, sys.setdlopenflags and sys.getdlopenflags exist only on Unix, and changing the flags affects every later import in the process. The examples show the bit arithmetic with the values from Linux.',
    },
    {
      q: 'What is the difference between RTLD_LAZY and RTLD_NOW?',
      a: 'RTLD_LAZY resolves function symbols when they are first called; RTLD_NOW resolves all of them while loading, so a missing symbol fails at import time instead of later.',
    },
    {
      q: 'How do I fix "undefined symbol" between two C extensions?',
      a: 'Import the extension that provides the symbols with RTLD_GLOBAL: save sys.getdlopenflags(), call sys.setdlopenflags(old | os.RTLD_GLOBAL), import it, then restore the old flags.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.RTLD_LAZY',
    meta:  'os.RTLD_* dlopen flags',
  },
};
