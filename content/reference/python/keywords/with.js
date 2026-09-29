// content/reference/python/keywords/with.js

export const meta = {
  slug:        'with',
  name:        'with',
  signature:   'with manager as name:',
  blurb:       'Run a block inside a context manager: setup on entry, guaranteed cleanup on exit — even when the block raises.',
  category:    'errors-context',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'with statement with open context manager __enter__ __exit__ contextlib contextmanager suppress multiple context managers parenthesized with as cleanup close file keyword',
};

export const method = {
  slug:      'with',
  name:      'with',
  signature: 'with manager as name:',

  category:    'Errors & context',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'try/finally in one line: the manager’s __enter__ runs before the block, its __exit__ runs after it — on success, on an exception, on return.',

  covers: ['with'],

  syntax: [
    { label: 'with', code: "with open(path) as f:\n    data = f.read()" },
    { label: 'several managers', code: 'with A() as a, B() as b:\n    body' },
    { label: 'parenthesized (3.10+)', code: 'with (\n    A() as a,\n    B() as b,\n):\n    body' },
    { label: 'what it does', code: 'x = mgr.__enter__()\ntry:\n    body\nfinally:\n    mgr.__exit__(...)' },
  ],

  cheat: {
    useFor:    'files, locks, database transactions, temporary settings — anything that must be closed or undone',
    result:    'a statement; as binds what __enter__ returned (for open(), the file itself)',
    pairsWith: 'open(), contextlib.contextmanager, contextlib.suppress, try / finally',
    watchOut:  '__exit__ returning True swallows the exception; the as name outlives the block',
  },

  parameters: [
    { name: 'manager', type: 'expression', required: true,  default: null, desc: 'Evaluated once. Its type must define __enter__ and __exit__ (a context manager).' },
    { name: 'as name', type: 'name / pattern', required: false, default: null, desc: 'Bound to the return value of __enter__() — not necessarily the manager itself. Still bound after the block.' },
    { name: 'body',    type: 'block', required: true,  default: null, desc: 'Runs between __enter__ and __exit__. However it ends, __exit__ is called.' },
  ],

  modes: [
    {
      id: 'order',
      label: 'enter / exit order',
      blurb: 'Two managers in one with. They are entered left to right and exited in reverse — also when the body raises.',
      params: [{ name: 'n', type: 'int', hint: 'try 0', input: 'number' }],
      template: "log = []\nclass Tag:\n    def __init__(self, name):\n        self.name = name\n    def __enter__(self):\n        log.append('enter ' + self.name)\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        log.append('exit ' + self.name)\ntry:\n    with Tag('outer'), Tag('inner'):\n        log.append(100 // {$n})\nexcept ZeroDivisionError:\n    log.append('caught outside')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 4', values: { n: '4' } },
        { id: 'zero', label: 'n = 0', values: { n: '0' } },
      ],
    },
    {
      id: 'suppress',
      label: '__exit__ returns True',
      blurb: '__exit__ receives the exception. Returning True tells Python it was handled — execution continues after the with.',
      params: [{ name: 'n', type: 'int', hint: 'try 0', input: 'number' }],
      template: "log = []\nclass Ignore:\n    def __enter__(self):\n        log.append('enter')\n    def __exit__(self, exc_type, exc, tb):\n        name = exc_type.__name__ if exc_type else None\n        log.append(f'exit sees {name}')\n        return exc_type is ZeroDivisionError\nwith Ignore():\n    log.append(100 // {$n})\n    log.append('rest of body')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 3', values: { n: '3' } },
        { id: 'zero', label: 'n = 0', values: { n: '0' } },
      ],
    },
    {
      id: 'contextmanager',
      label: '@contextmanager',
      blurb: 'A generator as a context manager: code before yield is __enter__, the finally after it is __exit__.',
      params: [{ name: 'n', type: 'int', hint: 'try 0', input: 'number' }],
      template: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef step():\n    log.append('setup')\n    try:\n        yield\n    finally:\n        log.append('cleanup')\ntry:\n    with step():\n        log.append(100 // {$n})\nexcept ZeroDivisionError as e:\n    log.append(f'error: {e}')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 5', values: { n: '5' } },
        { id: 'zero', label: 'n = 0', values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the order tab, "exit inner" comes before "exit outer" in both cases, and before the outer except sees the error — cleanup happens first, handling after. In the __exit__ returns True tab, n = 0 skips "rest of body" but the program carries on: the ZeroDivisionError was swallowed. Any other exception (a NameError, say) gets False back and escapes. In the @contextmanager tab the try/finally around yield is what makes cleanup run on errors.',

  patterns: [
    {
      name: 'Read a file',
      desc: 'The file is closed when the block ends, even on an exception.',
      code: "with open('config.toml', encoding='utf-8') as f:\n    text = f.read()",
    },
    {
      name: 'Hold a lock',
      desc: 'Acquired on entry, released on exit.',
      code: 'with lock:\n    counter += 1',
    },
    {
      name: 'Ignore one specific error',
      desc: 'contextlib.suppress replaces try / except / pass.',
      code: "from contextlib import suppress\nwith suppress(FileNotFoundError):\n    os.remove('cache.tmp')",
    },
    {
      name: 'Your own context manager',
      desc: 'contextlib.contextmanager turns a generator into one; wrap yield in try/finally.',
      code: "from contextlib import contextmanager\n\n@contextmanager\ndef timer(label):\n    start = time.perf_counter()\n    try:\n        yield\n    finally:\n        print(label, time.perf_counter() - start)",
    },
  ],

  examples: [
    { title: 'The file is closed afterwards', code: "with open('notes.txt', 'w') as f:\n    f.write('hi')\nprint(f.closed)", returns: 'True' },
    { title: 'Several managers in one with',  code: "with open('a.txt', 'w') as a, open('b.txt', 'w') as b:\n    a.write('1')\n    b.write('2')\nprint(a.closed, b.closed)", returns: 'True True' },
    { title: 'Parenthesized form (3.10+)',    code: "with (\n    open('a.txt', 'w') as a,\n    open('b.txt', 'w') as b,\n):\n    pass\nprint(a.closed and b.closed)", returns: 'True' },
    { title: 'as gets what __enter__ returns', code: "class Box:\n    def __enter__(self):\n        return 'from __enter__'\n    def __exit__(self, *exc):\n        return False\nwith Box() as value:\n    print(value)", returns: 'from __enter__' },
    { title: '__exit__ sees the exception',   code: "class Show:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc, tb):\n        print('exit got', exc_type.__name__, exc)\nwith Show():\n    int('x')", returns: "exit got ValueError invalid literal for int() with base 10: 'x'\nValueError: invalid literal for int() with base 10: 'x'" },
    { title: 'contextlib.suppress',           code: "from contextlib import suppress\nwith suppress(KeyError):\n    {}['missing']\n    print('not reached')\nprint('carried on')", returns: 'carried on' },
    { title: 'Not a context manager',         code: 'with 42:\n    pass', returns: "TypeError: 'int' object does not support the context manager protocol" },
  ],

  pitfalls: [
    {
      name: 'Using the file after the with block',
      desc: 'The name f still exists, but the file behind it is closed. Do the work inside the block.',
      wrong: { label: 'read after the block', code: "with open('data.txt', 'w') as f:\n    f.write('abc')\nwith open('data.txt') as f:\n    pass\nf.read()", output: 'ValueError: I/O operation on closed file.' },
      fix:   { label: 'read inside',          code: "with open('data.txt', 'w') as f:\n    f.write('abc')\nwith open('data.txt') as f:\n    text = f.read()\ntext", output: "'abc'" },
    },
    {
      name: '__exit__ that returns True by accident',
      desc: 'Any truthy return from __exit__ suppresses the exception. Return None (just fall off the end) unless swallowing errors is the point.',
      wrong: { label: 'return True', code: "class Timer:\n    def __enter__(self):\n        return self\n    def __exit__(self, *exc):\n        print('timer stopped')\n        return True\nwith Timer():\n    1 / 0\nprint('error vanished')", output: 'timer stopped\nerror vanished' },
      fix:   { label: 'return nothing', code: "class Timer:\n    def __enter__(self):\n        return self\n    def __exit__(self, *exc):\n        print('timer stopped')\nwith Timer():\n    1 / 0\nprint('error vanished')", output: 'timer stopped\nZeroDivisionError: division by zero' },
    },
    {
      name: '@contextmanager without try / finally',
      desc: 'An exception in the with body is re-raised at the yield. Without try/finally, the cleanup after yield never runs.',
      wrong: { label: 'bare yield', code: "from contextlib import contextmanager\n@contextmanager\ndef tag():\n    print('open')\n    yield\n    print('close')\nwith tag():\n    1 / 0", output: 'open\nZeroDivisionError: division by zero' },
      fix:   { label: 'try / finally', code: "from contextlib import contextmanager\n@contextmanager\ndef tag():\n    print('open')\n    try:\n        yield\n    finally:\n        print('close')\nwith tag():\n    1 / 0", output: 'open\nclose\nZeroDivisionError: division by zero' },
    },
  ],

  when: {
    use: [
      'Any resource that must be released: files, sockets, locks, DB connections and transactions',
      'Temporarily changing state and restoring it (decimal.localcontext, unittest.mock.patch, os.chdir helpers)',
      'Ignoring one specific exception (contextlib.suppress)',
    ],
    avoid: [
      'Catching and handling an error → try / except',
      'Objects without __enter__/__exit__ → wrap them with contextlib.closing() or write a small manager',
    ],
  },

  notes: {
    cpython:   'with A() as a, B() as b: is exactly nested with statements — B is entered only if A entered successfully, and exits run innermost first',
    'Scope':   'with does not create a scope: the as name, and anything assigned in the body, stays bound after the block',
    'as':      'The as keyword is shared with import and except; see the import page for its other uses',
    'async':   'async with calls __aenter__ / __aexit__ and is only allowed inside async def',
  },

  related: [
    { name: 'try / finally', slug: 'try',    when: 'What with is shorthand for' },
    { name: 'import (as)',   slug: 'import', when: 'The as keyword is documented with import' },
    { name: 'async / await', slug: 'async-await', when: 'async with for asynchronous managers' },
    { name: 'open()',        slug: 'open',   when: 'The most common context manager', category: 'functions' },
    { name: 'TypeError',     slug: 'typeerror', when: 'with on an object that is not a context manager', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does with open() do in Python?',
      a: 'It opens the file, binds it to the as name, and closes it when the block ends — also if the block raises or returns. It replaces f = open(...); try: ...; finally: f.close().',
    },
    {
      q: 'How do I use multiple context managers in one with?',
      a: 'Separate them with commas: with open(a) as f, open(b) as g:. Since Python 3.10 the list can be wrapped in parentheses and split over several lines. For a variable number of managers use contextlib.ExitStack.',
    },
    {
      q: 'How do I write my own context manager?',
      a: 'Either a class with __enter__ (its return value goes to as) and __exit__(exc_type, exc, tb), or a generator decorated with contextlib.contextmanager: code before yield is setup, code in a finally after it is cleanup.',
    },
    {
      q: 'Is the variable from with … as still available after the block?',
      a: 'Yes, with does not create a scope. The object is still there, but it has been cleaned up — a file is closed, so reading it raises ValueError: I/O operation on closed file.',
    },
  ],

  history: [
    { version: '3.1',  note: 'Several context managers in one with statement.' },
    { version: '3.10', note: 'Parentheses may group the managers across several lines.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-with-statement',
    meta:  'The with statement',
  },
};
