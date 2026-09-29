// content/reference/python/exceptions/generatorexit.js

export const meta = {
  slug:        'generatorexit',
  name:        'GeneratorExit',
  signature:   'GeneratorExit(*args)',
  blurb:       'Thrown into a paused generator or coroutine by close(), so its finally blocks run; not an error, and not an Exception subclass.',
  category:    'control',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'generatorexit generator exit close generator.close coroutine close finally cleanup generator ignored generatorexit runtimeerror yield',
};

export const method = {
  slug:      'generatorexit',
  name:      'GeneratorExit',
  signature: 'GeneratorExit(*args)',

  category:    'Control-flow exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'close() throws it into the generator at the paused yield — let it propagate (or return), never yield again.',

  chain: ['BaseException', 'GeneratorExit'],

  cheat: {
    raisedBy: 'gen.close(), garbage collection of a suspended generator, coroutine.close()',
    message:  'empty — you normally never see it',
    quickFix: 'cleanup in finally; after GeneratorExit, return or re-raise',
    watchOut: 'yielding after it → RuntimeError: generator ignored GeneratorExit',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Unused in practice; close() throws it without arguments.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Advance the generator n times, then close() it. GeneratorExit appears at the paused yield — if there is one.',
      params: [{ name: 'n', type: 'int', hint: 'next() calls before close()', input: 'number' }],
      template: "log = []\ndef reader():\n    try:\n        while True:\n            yield 'line'\n    except GeneratorExit:\n        log.append('GeneratorExit received')\n        raise\ng = reader()\nfor _ in range({$n}):\n    next(g)\ng.close()\nlog",
      cases: [
        { id: 'started',   label: 'n = 2', values: { n: '2' } },
        { id: 'unstarted', label: 'n = 0', values: { n: '0' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch GeneratorExit and return: since Python 3.13, close() hands the return value back.',
      params: [{ name: 'lines', type: 'list[str]', hint: 'comma-separated, sent in', input: 'csv' }],
      template: "def collector():\n    lines = []\n    try:\n        while True:\n            lines.append((yield))\n    except GeneratorExit:\n        return lines\ng = collector()\nnext(g)\nfor line in {$lines}:\n    g.send(line)\ng.close()",
      cases: [
        { id: 'some', label: 'three lines', values: { lines: 'alpha, beta, gamma' } },
        { id: 'none', label: 'nothing sent', values: { lines: '' } },
      ],
    },
  ],
  demoExplainer: "With n = 0 the log stays empty: a generator that never started has no paused yield to throw into, so close() just marks it finished. Once started, close() raises GeneratorExit at the yield; the handler re-raises it and close() returns normally. In Handle, returning instead of re-raising is also allowed — and in 3.13+ close() gives you that value.",

  attributes: [
    { name: 'args',          type: 'tuple', meaning: 'Empty when thrown by close().' },
    { name: '__traceback__', type: 'traceback | None', meaning: 'Points at the yield where the generator was paused.' },
  ],

  patterns: [
    {
      name: 'Cleanup belongs in finally',
      desc: 'finally runs on close(), on exhaustion and on errors — except GeneratorExit only on close().',
      code: "def read_rows(path):\n    f = open(path)\n    try:\n        for line in f:\n            yield line.rstrip('\\n')\n    finally:\n        f.close()",
    },
    {
      name: 'Close deterministically',
      desc: 'Do not rely on garbage collection to close a half-consumed generator — contextlib.closing calls close() on exit.',
      code: "from contextlib import closing\nwith closing(read_rows('data.csv')) as rows:\n    header = next(rows)",
    },
    {
      name: 'Return a result when closed (3.13+)',
      desc: 'A generator used as a sink can return its summary; close() returns it.',
      code: "def averager():\n    total = count = 0\n    try:\n        while True:\n            total += yield\n            count += 1\n    except GeneratorExit:\n        return total / count if count else None",
    },
  ],

  examples: [
    { title: 'Not an Exception subclass', code: 'issubclass(GeneratorExit, Exception)', returns: 'False' },
    { title: 'close() runs finally', code: "log = []\ndef gen():\n    try:\n        yield 1\n        yield 2\n    finally:\n        log.append('cleanup')\ng = gen()\nnext(g)\ng.close()\nlog", returns: "['cleanup']" },
    { title: 'except Exception does not intercept it', code: "def gen():\n    while True:\n        try:\n            yield\n        except Exception:\n            pass\ng = gen()\nnext(g)\ng.close()\n'closed cleanly'", returns: "'closed cleanly'" },
    { title: 'Closing an unstarted generator runs nothing', code: "log = []\ndef gen():\n    try:\n        yield 1\n    finally:\n        log.append('cleanup')\ng = gen()\ng.close()\nlog", returns: '[]' },
    { title: 'close() returns the return value (3.13+)', code: "def gen():\n    try:\n        yield\n    except GeneratorExit:\n        return 'cleanup done'\ng = gen()\nnext(g)\ng.close()", returns: "'cleanup done'" },
    { title: 'break closes it (CPython, when freed)', code: "log = []\ndef gen():\n    try:\n        yield from range(10)\n    finally:\n        log.append('closed')\nfor x in gen():\n    if x == 2:\n        break\nlog", returns: "['closed']" },
    { title: 'close() on a finished generator is a no-op', code: "def gen():\n    yield 1\ng = gen()\nlist(g)\ng.close()\n'ok'", returns: "'ok'" },
  ],

  pitfalls: [
    {
      name: 'Swallowing GeneratorExit and yielding again',
      desc: 'If the generator catches GeneratorExit and reaches another yield, close() raises RuntimeError. Return (or re-raise) instead.',
      wrong: { label: 'pass and loop', code: "def ticker():\n    while True:\n        try:\n            yield 'tick'\n        except GeneratorExit:\n            pass\ng = ticker()\nnext(g)\ng.close()", output: 'RuntimeError: generator ignored GeneratorExit' },
      fix:   { label: 'return', code: "def ticker():\n    while True:\n        try:\n            yield 'tick'\n        except GeneratorExit:\n            return\ng = ticker()\nnext(g)\ng.close()\n'closed'", output: "'closed'" },
    },
    {
      name: 'A bare except inside a generator',
      desc: 'except: catches GeneratorExit too, so the loop carries on to the next yield. except Exception lets it through.',
      wrong: { label: 'bare except', code: "def safe_items(items):\n    for x in items:\n        try:\n            yield int(x)\n        except:\n            continue\ng = safe_items(['1', '2', '3'])\nnext(g)\ng.close()", output: 'RuntimeError: generator ignored GeneratorExit' },
      fix:   { label: 'except Exception', code: "def safe_items(items):\n    for x in items:\n        try:\n            yield int(x)\n        except Exception:\n            continue\ng = safe_items(['1', '2', '3'])\nnext(g)\ng.close()\n'closed'", output: "'closed'" },
    },
    {
      name: 'Cleanup only in except GeneratorExit',
      desc: 'That handler runs only on close(). When the generator is consumed to the end, the cleanup never happens.',
      wrong: { label: 'except GeneratorExit', code: "log = []\ndef gen():\n    try:\n        yield 1\n    except GeneratorExit:\n        log.append('cleanup')\n        raise\nlist(gen())\nlog", output: '[]' },
      fix:   { label: 'finally', code: "log = []\ndef gen():\n    try:\n        yield 1\n    finally:\n        log.append('cleanup')\nlist(gen())\nlog", output: "['cleanup']" },
    },
  ],

  when: {
    use: [
      'Knowing why finally blocks in generators run when a loop breaks early',
      'except GeneratorExit: return result — a sink generator that reports on close (3.13+)',
      'Debugging RuntimeError: generator ignored GeneratorExit',
    ],
    avoid: [
      'General cleanup → try/finally or a with block inside the generator',
      'Raising it yourself → call gen.close() instead',
      'Catching it in a bare except → catch Exception',
    ],
  },

  notes: {
    cpython:    'Objects/genobject.c — gen_close() throws GeneratorExit; if the generator yields again it raises RuntimeError("generator ignored GeneratorExit")',
    'Why BaseException': 'The docs: it is technically not an error, so except Exception in generator code must not swallow it',
    'Garbage collection': 'A suspended generator that is garbage-collected is closed; in CPython that happens as soon as the last reference goes away',
    'Coroutines': 'coroutine.close() and async generator aclose() use the same mechanism',
  },

  related: [
    { name: 'StopIteration',     slug: 'stopiteration',     when: 'The normal end-of-iteration signal' },
    { name: 'BaseException',     slug: 'baseexception',     when: 'Why except Exception does not catch it' },
    { name: 'RuntimeError',      slug: 'runtimeerror',      when: 'Raised when GeneratorExit is ignored' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'Another BaseException-only signal' },
    { name: 'next',              slug: 'next',              when: 'Starts the generator so close() has a yield to hit', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does RuntimeError: generator ignored GeneratorExit mean?',
      a: 'The generator caught GeneratorExit (often via a bare except: or except BaseException:) and then yielded another value. A closing generator must finish: re-raise the GeneratorExit, return, or let it propagate. Replace the bare except with except Exception.',
    },
    {
      q: 'When is GeneratorExit raised?',
      a: 'When generator.close() is called on a generator paused at a yield — explicitly, or implicitly when a suspended generator is garbage-collected (for example after breaking out of a for loop over it). It is raised at that yield so try/finally and with blocks inside the generator can clean up.',
    },
    {
      q: 'Why does GeneratorExit not inherit from Exception?',
      a: 'It is a signal, not an error. Generator code commonly uses except Exception to skip bad items; if GeneratorExit were an Exception, those handlers would swallow it and every close() would fail with "generator ignored GeneratorExit".',
    },
    {
      q: 'Should I catch GeneratorExit or use finally?',
      a: 'Use finally for cleanup — it runs on close(), on normal exhaustion and on errors. Catch GeneratorExit only when you need to behave differently on close, such as returning a final value (which close() returns since Python 3.13).',
    },
  ],

  history: [
    { version: '3.13', note: 'If a generator returns a value upon being closed, the value is returned by close().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#GeneratorExit',
    meta:  'Built-in exceptions',
  },
};
