// content/reference/python/stdlib/sys/excepthook.js — the interpreter hooks

export const meta = {
  slug:        'excepthook',
  name:        'sys.excepthook / unraisablehook / displayhook / breakpointhook',
  signature:   'sys.excepthook(type, value, traceback) · sys.unraisablehook(unraisable) · sys.displayhook(value) · sys.breakpointhook(*args, **kws)',
  blurb:       'Functions the interpreter calls at key moments — for an uncaught exception, an exception it cannot raise (e.g. in __del__), every value echoed at the >>> prompt, and breakpoint(). Assign your own to change the behaviour.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'excepthook/displayhook all versions · breakpointhook 3.7+ · unraisablehook 3.8+',
  searchTerms: 'sys.excepthook excepthook sys.unraisablehook unraisablehook sys.displayhook displayhook sys.breakpointhook breakpointhook __excepthook__ __displayhook__ __unraisablehook__ __breakpointhook__ global exception handler uncaught exception python log crash exception ignored in __del__ PYTHONBREAKPOINT',
};

export const method = {
  slug:      'excepthook',
  name:      'sys.excepthook / unraisablehook / displayhook / breakpointhook',
  signature: 'sys.excepthook(type, value, traceback) · sys.unraisablehook(unraisable) · sys.displayhook(value) · sys.breakpointhook(*args, **kws)',
  returns:   { type: 'None (breakpointhook: whatever the debugger returns)', desc: 'Hooks are called for their effect; replace them by assignment.' },

  category:    'sys function',
  version:     'excepthook/displayhook all versions · breakpointhook 3.7+ · unraisablehook 3.8+',
  hasLiveDemo: false,

  subtitle: 'Four replaceable callbacks. excepthook prints the traceback of an uncaught exception (SystemExit excepted); unraisablehook prints "Exception ignored in …" for errors Python cannot propagate; displayhook prints REPL results and sets _; breakpointhook starts pdb for breakpoint(). The originals are kept as sys.__excepthook__ and friends.',

  covers: ['excepthook', 'unraisablehook', 'displayhook', 'breakpointhook'],

  cheat: {
    commonCall: 'sys.excepthook = log_uncaught',
    returns:    'None — the hook runs instead of the default printing',
    replaces:   'Wrapping the whole program in try/except just to log crashes',
    watchOut:   'Threads use threading.excepthook, not sys.excepthook',
  },

  parameters: [
    { name: 'type, value, traceback', type: 'excepthook arguments', required: true, default: null, desc: 'The exception class, instance and traceback of the uncaught exception.' },
    { name: 'unraisable', type: 'UnraisableHookArgs', required: true, default: null, desc: 'unraisablehook: has exc_type, exc_value, exc_traceback, err_msg and object.' },
    { name: 'value', type: 'object', required: true, default: null, desc: 'displayhook: the result of an expression at the prompt (None is not displayed).' },
  ],

  patterns: [
    {
      name: 'Log every crash',
      desc: 'Send uncaught exceptions to logging, then let the default printing run too.',
      code: "import logging, sys\n\ndef log_uncaught(exc_type, exc, tb):\n    logging.critical('uncaught exception', exc_info=(exc_type, exc, tb))\n    sys.__excepthook__(exc_type, exc, tb)\n\nsys.excepthook = log_uncaught",
    },
    {
      name: 'Pretty REPL output',
      desc: 'displayhook decides how results are echoed at the >>> prompt.',
      code: 'import sys, pprint\nsys.displayhook = lambda v: None if v is None else pprint.pprint(v)',
    },
    {
      name: 'Choose or disable the debugger for breakpoint()',
      desc: 'PYTHONBREAKPOINT is read by the default breakpointhook.',
      code: '# shell:\n# PYTHONBREAKPOINT=0 python app.py            # breakpoint() does nothing\n# PYTHONBREAKPOINT=ipdb.set_trace python app.py',
    },
  ],

  examples: [
    { title: 'excepthook writes the error to stderr', code: "import io, sys, contextlib\nerr = io.StringIO()\nwith contextlib.redirect_stderr(err):\n    sys.excepthook(ValueError, ValueError('boom'), None)\nerr.getvalue()", returns: "'ValueError: boom\\n'" },
    { title: 'A custom hook replaces the traceback', code: "import subprocess, sys\ncode = \"import sys\\nsys.excepthook = lambda t, v, tb: print('fatal:', v)\\n1 / 0\"\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(p.returncode, p.stdout, p.stderr)", returns: "(1, 'fatal: division by zero\\n', '')" },
    { title: 'Catch errors raised in __del__', code: "import sys\nseen = []\nold = sys.unraisablehook\nsys.unraisablehook = lambda u: seen.append((type(u.exc_value).__name__, str(u.exc_value)))\ntry:\n    class Resource:\n        def __del__(self):\n            raise ValueError('cleanup failed')\n    r = Resource()\n    del r\nfinally:\n    sys.unraisablehook = old\nseen", returns: "[('ValueError', 'cleanup failed')]" },
    { title: 'displayhook prints and stores _', code: "import builtins, io, sys, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    sys.displayhook([1, 2])\n    sys.displayhook(None)\nresult = (buf.getvalue(), builtins._)\ndel builtins._\nresult", returns: "('[1, 2]\\n', [1, 2])" },
    { title: 'breakpoint() calls sys.breakpointhook', code: "import sys\ncalls = []\nold = sys.breakpointhook\nsys.breakpointhook = lambda *a, **k: calls.append((a, k)) or 'hooked'\ntry:\n    r = breakpoint(1, x=2)\nfinally:\n    sys.breakpointhook = old\n(r, calls)", returns: "('hooked', [((1,), {'x': 2})])" },
  ],

  pitfalls: [
    {
      name: 'Expecting sys.excepthook to see thread errors',
      desc: 'An exception that ends a threading.Thread goes to threading.excepthook (3.8+); sys.excepthook is only for the main program.',
      wrong: { label: 'sys.excepthook', code: "import subprocess, sys\ncode = '''import sys, threading\nsys.excepthook = lambda t, v, tb: print('hooked:', v)\ndef work():\n    raise ValueError('boom')\nt = threading.Thread(target=work)\nt.start(); t.join()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stdout", output: "''" },
      fix:   { label: 'threading.excepthook', code: "import subprocess, sys\ncode = '''import threading\nthreading.excepthook = lambda args: print('hooked:', args.exc_value)\ndef work():\n    raise ValueError('boom')\nt = threading.Thread(target=work)\nt.start(); t.join()\n'''\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\np.stdout", output: "'hooked: boom\\n'" },
    },
    {
      name: 'A hook with the wrong signature',
      desc: 'excepthook is called with three arguments. If the hook itself fails, Python prints "Error in sys.excepthook:" and the original traceback.',
      wrong: { label: 'one argument', code: "import subprocess, sys\ncode = 'import sys\\nsys.excepthook = lambda e: print(e)\\n1 / 0'\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(p.stdout, p.stderr.splitlines()[0])", output: "('', 'Error in sys.excepthook:')" },
      fix:   { label: 'three arguments', code: "import subprocess, sys\ncode = 'import sys\\nsys.excepthook = lambda t, v, tb: print(v)\\n1 / 0'\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(p.stdout, p.stderr)", output: "('division by zero\\n', '')" },
    },
  ],

  when: {
    use: [
      'Logging or reporting crashes of command-line programs and services (excepthook)',
      'Turning "Exception ignored in …" noise into logged errors, or failing tests on it (unraisablehook)',
      'Custom REPL display (displayhook) and debugger choice (breakpointhook)',
    ],
    avoid: [
      'Handling errors you can anticipate → try/except at the call site',
      'Worker threads → threading.excepthook',
      'asyncio tasks → loop.set_exception_handler',
    ],
  },

  notes: {
    cpython:          'Defaults are sys.__excepthook__ etc. (Python/sysmodule.c); excepthook is looked up and called by _PyErr_PrintEx (Python/pythonrun.c) when an exception reaches the top level',
    'SystemExit':     'Not passed to excepthook — it ends the process with its exit status instead',
    'unraisable':     'Used for exceptions in __del__, weakref callbacks, garbage collection and similar places where nothing can catch them; the default prints "Exception ignored in: " plus the object (for __del__, the method itself) and the traceback',
    'displayhook':    'Only the interactive prompt (and code.InteractiveInterpreter) calls it; scripts never echo expression values',
  },

  related: [
    { name: 'sys.exception / exc_info', slug: 'exc_info', when: 'The exception being handled right now' },
    { name: 'sys.stderr', slug: 'stdout',     when: 'Where the default hooks write' },
    { name: 'breakpoint()', slug: 'breakpoint', when: 'Calls sys.breakpointhook', category: 'functions' },
    { name: 'SystemExit', slug: 'systemexit', when: 'The one exception excepthook never sees', category: 'exceptions' },
    { name: 'sys module', slug: 'sys',        when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I log all uncaught exceptions in Python?',
      a: 'Assign a function to sys.excepthook that takes (exc_type, exc_value, traceback) and logs them, e.g. logging.critical("…", exc_info=(exc_type, exc_value, traceback)). Add threading.excepthook for threads.',
    },
    {
      q: 'What does "Exception ignored in" mean?',
      a: 'An exception happened where Python could not raise it to any caller — typically inside __del__ or a weakref callback — so sys.unraisablehook printed it and execution continued. Override unraisablehook to log it or to fail tests.',
    },
    {
      q: 'How do I restore the default excepthook?',
      a: 'sys.excepthook = sys.__excepthook__. The same works for displayhook, unraisablehook and breakpointhook.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.excepthook',
    meta:  'sys.excepthook',
  },
};
