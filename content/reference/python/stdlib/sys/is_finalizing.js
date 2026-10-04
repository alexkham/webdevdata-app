// content/reference/python/stdlib/sys/is_finalizing.js

export const meta = {
  slug:        'is_finalizing',
  name:        'sys.is_finalizing',
  signature:   'sys.is_finalizing()',
  blurb:       'True while the interpreter is shutting down. Destructors and background code use it to skip work that is no longer possible, such as starting threads.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.5+',
  searchTerms: 'sys.is_finalizing is_finalizing interpreter shutdown python __del__ at exit finalization PythonFinalizationError cannot create new thread at interpreter shutdown atexit',
};

export const method = {
  slug:      'is_finalizing',
  name:      'sys.is_finalizing',
  signature: 'sys.is_finalizing()',
  returns:   { type: 'bool', desc: 'True once the main interpreter has started finalizing, False before.' },

  category:    'sys function',
  version:     'Python 3.5+',
  hasLiveDemo: false,

  subtitle: 'Shutdown happens in stages: non-daemon threads are joined and atexit handlers run while is_finalizing() is still False; then the interpreter finalizes and clears modules, which runs remaining __del__ methods with is_finalizing() True. Some operations, like starting a thread, now raise PythonFinalizationError (3.13).',

  covers: ['is_finalizing'],

  cheat: {
    commonCall: 'if sys.is_finalizing(): return',
    returns:    'bool',
    replaces:   'Catching odd errors from __del__ during shutdown',
    watchOut:   'False inside atexit handlers — they run before finalization',
  },

  parameters: [],

  patterns: [
    {
      name: 'A destructor that is safe at exit',
      desc: 'Skip cleanup that needs threads or other modules once shutdown has begun.',
      code: "import sys\nclass Connection:\n    def __del__(self):\n        if sys.is_finalizing():\n            return\n        self.close()",
    },
    {
      name: 'Prefer explicit cleanup',
      desc: 'Context managers and atexit run while everything still works.',
      code: "import atexit\natexit.register(pool.shutdown)",
    },
  ],

  examples: [
    { title: 'During normal execution',   code: 'import sys\nsys.is_finalizing()', returns: 'False' },
    { title: 'atexit runs before finalization, __del__ during it', code: "import subprocess, sys\ncode = '''import sys, atexit\natexit.register(lambda: print('atexit:', sys.is_finalizing()))\nclass C:\n    def __del__(self):\n        print('__del__:', sys.is_finalizing())\nc = C()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stdout.splitlines()", returns: "['atexit: False', '__del__: True']" },
    { title: 'No new threads at shutdown (3.13)', code: "import subprocess, sys\ncode = '''import threading\nclass C:\n    def __del__(self):\n        try:\n            threading.Thread(target=print).start()\n        except Exception as e:\n            print(type(e).__name__, e)\nc = C()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stdout.strip()", returns: "\"PythonFinalizationError can't create new thread at interpreter shutdown\"" },
    { title: 'PythonFinalizationError is a RuntimeError', code: 'issubclass(PythonFinalizationError, RuntimeError)', returns: 'True' },
    { title: 'It takes no arguments',     code: 'import sys\nsys.is_finalizing(True)', returns: 'TypeError: sys.is_finalizing() takes no arguments (1 given)' },
  ],

  pitfalls: [
    {
      name: 'Starting work from __del__ at shutdown',
      desc: 'A destructor that runs during finalization cannot start threads. Check is_finalizing() first.',
      wrong: { label: 'unconditional', code: "import subprocess, sys\ncode = '''import threading\nclass Job:\n    def __del__(self):\n        threading.Thread(target=print).start()\nj = Job()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n\"can't create new thread at interpreter shutdown\" in p.stderr", output: 'True' },
      fix:   { label: 'check first', code: "import subprocess, sys\ncode = '''import sys, threading\nclass Job:\n    def __del__(self):\n        if sys.is_finalizing():\n            return\n        threading.Thread(target=print).start()\nj = Job()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stderr", output: "''" },
    },
    {
      name: 'Expecting True inside atexit handlers',
      desc: 'atexit callbacks run before finalization starts, so is_finalizing() is False there — they can still use threads and imports.',
      wrong: { label: 'assume True', code: "import subprocess, sys\ncode = \"import atexit, sys\\natexit.register(lambda: print(sys.is_finalizing()))\"\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout.strip() == 'True'", output: 'False' },
      fix:   { label: 'it is False', code: "import subprocess, sys\ncode = \"import atexit, sys\\natexit.register(lambda: print(sys.is_finalizing()))\"\nsubprocess.run([sys.executable, '-c', code], capture_output=True, text=True).stdout.strip()", output: "'False'" },
    },
  ],

  when: {
    use: [
      '__del__ methods and weakref callbacks that may run during interpreter shutdown',
      'Background threads deciding whether to keep going',
    ],
    avoid: [
      'Normal cleanup → with blocks, try/finally, atexit.register',
    ],
  },

  notes: {
    cpython:          'Returns Py_IsFinalizing(): the runtime "finalizing" state that Py_FinalizeEx sets (Python/pylifecycle.c) — about the main interpreter',
    'Order':          'Py_FinalizeEx: wait for non-daemon threads → atexit callbacks → finalizing flag set (is_finalizing() True) → modules cleared, remaining __del__ calls',
    'PythonFinalizationError': 'New in 3.13: raised for operations that are no longer allowed during shutdown, such as creating threads or (on POSIX) os.fork(); it subclasses RuntimeError',
  },

  related: [
    { name: 'sys.exit',     slug: 'exit',        when: 'Starts the shutdown' },
    { name: 'sys.excepthook', slug: 'excepthook', when: 'unraisablehook reports errors from __del__' },
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'Base class of PythonFinalizationError', category: 'exceptions' },
    { name: 'sys module',   slug: 'sys',         when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does sys.is_finalizing() do?',
      a: 'It returns True when the main Python interpreter is shutting down. Code that may run very late — destructors, weakref callbacks, daemon threads — uses it to avoid work that fails during finalization.',
    },
    {
      q: 'What is PythonFinalizationError?',
      a: 'A RuntimeError subclass added in Python 3.13, raised when code tries something that is no longer possible during interpreter shutdown, for example starting a new thread.',
    },
    {
      q: 'Is sys.is_finalizing() True inside atexit handlers?',
      a: 'No. atexit handlers run before finalization begins, while the interpreter is still fully working.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.is_finalizing',
    meta:  'sys.is_finalizing',
  },
};
