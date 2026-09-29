// content/reference/python/exceptions/systemerror.js

export const meta = {
  slug:        'systemerror',
  name:        'SystemError',
  signature:   'SystemError(*args)',
  blurb:       'Raised when the interpreter detects an internal error — almost always a bug in CPython or in a C extension, not in your Python code.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'systemerror system error internal error returned null without setting an exception returned a result with an exception set c extension bad argument to internal function',
};

export const method = {
  slug:      'systemerror',
  name:      'SystemError',
  signature: 'SystemError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: 'Pure Python code should never be able to cause it. If you see one, look at the C extensions involved and their versions — and it is not SystemExit.',

  chain: ['BaseException', 'Exception', 'SystemError'],

  cheat: {
    raisedBy: 'C extensions misusing the C API; interpreter bugs',
    message:  'low-level, e.g. "<built-in function x> returned NULL without setting an exception"',
    quickFix: 'upgrade/rebuild the extension for your Python version; report it',
    watchOut: 'not SystemExit — that is what sys.exit() raises',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'A message in low-level terms describing what went wrong inside the interpreter.' },
  ],

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The internal message, e.g. which function returned a bad result.' },
  ],

  patterns: [
    {
      name: 'Collect what the bug report needs',
      desc: 'The docs ask for the interpreter version, the exact message and a way to reproduce.',
      code: "import sys, platform\nprint(sys.version)\nprint(platform.platform())\n# plus: pip freeze, the full traceback, a minimal script",
    },
    {
      name: 'Find the extension involved',
      desc: 'The last frames of the traceback usually name the compiled module; faulthandler shows native crashes too.',
      code: "import faulthandler\nfaulthandler.enable()",
    },
  ],

  examples: [
    { title: 'Raise it (for illustration only)', code: "raise SystemError('bad internal call')", returns: 'SystemError: bad internal call' },
    { title: 'An ordinary Exception subclass', code: 'issubclass(SystemError, Exception), issubclass(SystemError, RuntimeError)', returns: '(True, False)' },
    { title: 'Not related to SystemExit', code: 'issubclass(SystemExit, Exception), issubclass(SystemError, Exception)', returns: '(False, True)' },
    { title: 'Catchable like any Exception', code: "try:\n    raise SystemError('internal')\nexcept Exception as e:\n    kind = type(e).__name__\nkind", returns: "'SystemError'" },
  ],

  pitfalls: [
    {
      name: 'Mixing up SystemError and SystemExit',
      desc: 'sys.exit() raises SystemExit, a BaseException that except Exception does NOT catch. SystemError is an interpreter bug report and IS an Exception.',
      wrong: { label: 'except SystemError', code: "import sys\ntry:\n    sys.exit(2)\nexcept SystemError:\n    status = 'caught'\nexcept SystemExit as e:\n    status = f'exit {e.code} went past except SystemError'\nstatus", output: "'exit 2 went past except SystemError'" },
      fix:   { label: 'except SystemExit', code: "import sys\ntry:\n    sys.exit(2)\nexcept SystemExit as e:\n    status = f'caught exit {e.code}'\nstatus", output: "'caught exit 2'" },
    },
  ],

  when: {
    use: [
      'Raising it from C extension code when an internal invariant of the extension breaks',
    ],
    avoid: [
      'Raising it from Python code — use RuntimeError or a custom exception',
      'Catching and ignoring it — it signals memory or interpreter state may be corrupt',
    ],
  },

  notes: {
    cpython:      'Typical texts: "… returned NULL without setting an exception", "… returned a result with an exception set", "bad argument to internal function"',
    'Usual cause': 'A compiled extension built for a different Python version, or with a C-API bug',
    'Report to':   'the extension maintainer first; CPython (github.com/python/cpython/issues) if pure Python code triggers it',
  },

  related: [
    { name: 'SystemExit',   slug: 'systemexit',   when: 'Raised by sys.exit() — the similar-sounding one' },
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'What your own code should raise for invalid state' },
    { name: 'MemoryError',  slug: 'memoryerror',  when: 'The other low-level failure' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'SystemError signals a bug inside the interpreter or a C extension. Correct Python code has no reliable way to produce one — any snippet that did would be demonstrating a CPython bug that gets fixed. The examples raise it by hand to show its type and hierarchy instead.',
    },
    {
      q: 'How do I fix "SystemError: ... returned NULL without setting an exception"?',
      a: 'A compiled function (from a C extension, or CPython itself) failed without reporting why. Upgrade the package named in the traceback, make sure its wheel matches your Python version (reinstall after upgrading Python), and check its issue tracker. If you can reproduce it with pure Python and no third-party extensions, report it to CPython with sys.version, the exact message and a minimal script.',
    },
    {
      q: 'What is the difference between SystemError and SystemExit?',
      a: 'SystemExit is raised by sys.exit() to end the program; it derives from BaseException so except Exception lets it through. SystemError is an Exception subclass reporting an internal interpreter error. They are unrelated despite the names.',
    },
    {
      q: 'Is it safe to catch SystemError and continue?',
      a: 'The docs describe it as an internal error that does not look serious enough to abandon all hope, so the interpreter keeps running. But the extension that raised it may have left its own state inconsistent. Log it with full details and prefer restarting the affected work rather than carrying on silently.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#SystemError',
    meta:  'Built-in exceptions',
  },
};
