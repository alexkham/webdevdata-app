// content/reference/python/stdlib/contextlib/index.js — the contextlib module hub

export const meta = {
  slug:        'index',
  name:        'contextlib',
  signature:   'import contextlib',
  blurb:       'Utilities for the with statement: write a context manager as a generator (contextmanager), ignore chosen exceptions (suppress), redirect print output, and manage a variable number of resources (ExitStack).',
  category:    'functional',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'contextlib module python context manager with statement contextmanager decorator generator suppress exceptions redirect_stdout capture print ExitStack closing nullcontext chdir asynccontextmanager AsyncExitStack aclosing ContextDecorator AbstractContextManager',
};

export const method = {
  slug: 'index',
  name: 'contextlib',

  category:    'Functional programming',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Most code needs only two things from contextlib: @contextmanager to turn setup / yield / cleanup into a with-able object, and suppress to ignore an exception you expect. The rest covers stdout redirection, closing(), optional context managers and dynamic stacks of them.',

  // every public name these classes define themselves must have a member page
  coverClasses: ['ExitStack', 'AsyncExitStack'],

  imports: ['from contextlib import contextmanager, suppress', 'import contextlib'],
  facts: [
    { label: 'Public API', value: 'contextmanager, asynccontextmanager, suppress, closing, aclosing, nullcontext, redirect_stdout, redirect_stderr, chdir, ExitStack, AsyncExitStack, ContextDecorator, AbstractContextManager, AbstractAsyncContextManager (and AsyncContextDecorator, outside __all__)' },
    { label: 'Protocol',   value: 'with calls __enter__() (its result is bound by "as"), runs the block, then __exit__(type, value, traceback) — a true return value swallows the exception' },
    { label: 'Source',     value: 'Lib/contextlib.py — pure Python, built on generators, abc and functools.wraps' },
    { label: 'Since',      value: 'Python 2.5 (contextmanager, closing); suppress and redirect_stdout 3.4, ExitStack 3.3, chdir 3.11' },
  ],

  modes: [
    {
      id: 'contextmanager',
      label: '@contextmanager',
      blurb: 'Code before yield runs on entry, the finally block on exit — also when the body fails. Try n = 0.',
      params: [
        { name: 'name', type: 'str', hint: 'resource name', input: 'text' },
        { name: 'n',    type: 'int', hint: 'divisor in the body', input: 'number' },
      ],
      template: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef opened(name):\n    log.append('open ' + name)\n    try:\n        yield name\n    finally:\n        log.append('close ' + name)\ntry:\n    with opened({$name}) as res:\n        log.append('use ' + res)\n        log.append(100 // {$n})\nexcept ZeroDivisionError as e:\n    log.append(f'error: {e}')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 4', values: { name: 'db', n: '4' } },
        { id: 'zero', label: 'n = 0', values: { name: 'db', n: '0' } },
      ],
    },
    {
      id: 'suppress',
      label: 'suppress',
      blurb: 'A missing key raises KeyError inside the block; suppress swallows it and skips the rest of the block.',
      params: [{ name: 'item', type: 'str', hint: 'tea, cake or anything else', input: 'text' }],
      template: "from contextlib import suppress\nprices = {'tea': 3, 'cake': 5}\nprice = None\nwith suppress(KeyError):\n    price = prices[{$item}]\n    print('found it')\nprice",
      cases: [
        { id: 'tea',    label: 'tea',    values: { item: 'tea' } },
        { id: 'coffee', label: 'coffee', values: { item: 'coffee' } },
      ],
    },
  ],
  demoExplainer: "With n = 4 the log reads open, use, 25, close. With n = 0 the ZeroDivisionError is thrown into the generator at the yield, the finally block logs 'close db', and only then does the error reach the except clause — cleanup runs before the caller sees the exception. In the suppress tab a missing item skips print('found it') too: suppress ends the whole with block at the failing line.",

  patterns: [
    {
      name: 'A context manager from a generator',
      desc: 'try / yield / finally is the whole recipe.',
      code: "from contextlib import contextmanager\n\n@contextmanager\ndef connected(url):\n    conn = connect(url)\n    try:\n        yield conn\n    finally:\n        conn.close()",
    },
    {
      name: 'Ignore one expected error',
      desc: 'Clearer than try / except / pass for a single, deliberate case.',
      code: "import os\nfrom contextlib import suppress\nwith suppress(FileNotFoundError):\n    os.remove('cache.tmp')",
    },
    {
      name: 'Capture what a function prints',
      desc: 'redirect_stdout into an io.StringIO.',
      code: 'import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    noisy_function()\noutput = buf.getvalue()',
    },
    {
      name: 'Open a list of files',
      desc: 'ExitStack closes everything opened so far, in reverse order, even if a later open fails.',
      code: 'from contextlib import ExitStack\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(p)) for p in paths]\n    process(files)',
    },
  ],

  examples: [
    { title: '@contextmanager',            code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\nwith tag('b'):\n    print('bold')", returns: '<b>\nbold\n</b>' },
    { title: 'suppress an expected error', code: "import os\nfrom contextlib import suppress\nwith suppress(FileNotFoundError):\n    os.remove('missing.txt')\n'still running'", returns: "'still running'" },
    { title: 'Capture print output',       code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    print('captured')\nbuf.getvalue()", returns: "'captured\\n'" },
    { title: 'ExitStack unwinds in reverse', code: "from contextlib import ExitStack\nwith ExitStack() as stack:\n    for name in ['a', 'b', 'c']:\n        stack.callback(print, 'close', name)\n    print('work')", returns: 'work\nclose c\nclose b\nclose a' },
    { title: 'closing() for objects with close()', code: "from contextlib import closing\nclass Resource:\n    def close(self):\n        print('closed')\nwith closing(Resource()) as r:\n    print('using', type(r).__name__)", returns: 'using Resource\nclosed' },
    { title: 'nullcontext as a stand-in',  code: "from contextlib import nullcontext\nwith nullcontext(5) as x:\n    pass\nx", returns: '5' },
    { title: 'chdir and back (3.11+)',     code: "import os\nfrom contextlib import chdir\nos.mkdir('build')\nwith chdir('build'):\n    inside = os.path.basename(os.getcwd())\ninside, os.path.basename(os.getcwd()) == 'build'", returns: "('build', False)" },
  ],

  pitfalls: [
    {
      name: 'Cleanup after yield without try/finally',
      desc: 'When the with block raises, the exception is thrown into the generator at the yield. Code after a bare yield never runs — put cleanup in finally.',
      wrong: { label: 'bare yield', code: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef step():\n    log.append('setup')\n    yield\n    log.append('teardown')\ntry:\n    with step():\n        1 / 0\nexcept ZeroDivisionError:\n    log.append('caught outside')\nlog", output: "['setup', 'caught outside']" },
      fix:   { label: 'try/finally', code: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef step():\n    log.append('setup')\n    try:\n        yield\n    finally:\n        log.append('teardown')\ntry:\n    with step():\n        1 / 0\nexcept ZeroDivisionError:\n    log.append('caught outside')\nlog", output: "['setup', 'teardown', 'caught outside']" },
    },
    {
      name: 'Forgetting the @contextmanager decorator',
      desc: 'A plain generator function returns a generator, which is not a context manager.',
      wrong: { label: 'no decorator', code: 'def plain():\n    yield\nwith plain():\n    pass', output: "TypeError: 'generator' object does not support the context manager protocol" },
      fix:   { label: '@contextmanager', code: "from contextlib import contextmanager\n@contextmanager\ndef plain():\n    yield 'ready'\nwith plain() as v:\n    pass\nv", output: "'ready'" },
    },
  ],

  when: {
    use: [
      'Writing a context manager without a class — @contextmanager',
      'Ignoring one specific, expected exception — suppress',
      'Capturing or redirecting print() output in scripts and tests — redirect_stdout',
      'A number of resources known only at run time — ExitStack',
    ],
    avoid: [
      'Objects that already support with (files, locks, sockets) — use them directly',
      'Hiding errors you have not thought about — suppress(Exception) silences bugs too',
      'Thread-safe or library code that must not touch global state — redirect_stdout and chdir change it for the whole process',
    ],
  },

  notes: {
    cpython:          'Lib/contextlib.py — pure Python. @contextmanager wraps the generator in _GeneratorContextManager, whose __exit__ throws the block\'s exception into the generator with gen.throw()',
    'Single use':     'A @contextmanager object can be entered only once; call the function again for every with statement (as a decorator it does that for you)',
    'Async variants': 'asynccontextmanager, aclosing, AsyncExitStack and nullcontext work with async with; AbstractAsyncContextManager is the async ABC',
  },

  related: [
    { name: 'with',          slug: 'with',    when: 'The statement all of this plugs into', category: 'keywords' },
    { name: 'yield',         slug: 'yield',   when: 'What @contextmanager generators are built on', category: 'keywords' },
    { name: 'try',           slug: 'try',     when: 'try / finally — what a context manager replaces', category: 'keywords' },
    { name: 'functools module', slug: 'functools', when: 'Other decorators for functions', category: 'stdlib' },
    { name: 'GeneratorExit', slug: 'generatorexit', when: 'What closing a suspended generator raises inside it', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is contextlib used for in Python?',
      a: 'It helps you write and combine context managers — objects used with the with statement. @contextmanager turns a generator into one, suppress ignores chosen exceptions, redirect_stdout captures print output, closing calls close() at the end, and ExitStack manages any number of context managers at once.',
    },
    {
      q: 'How do I write a context manager without a class?',
      a: 'Decorate a generator function with @contextlib.contextmanager. The code before yield runs on entry, the yielded value is bound by "as", and the code after yield runs on exit. Wrap the yield in try / finally so the cleanup also runs when the block raises.',
    },
    {
      q: 'Is contextlib.suppress the same as try/except/pass?',
      a: 'Yes for the listed exceptions: the with block stops at the failing line and execution continues after the with statement. It reads better for one deliberate case, but like except: pass it hides the error, so list only the exact exception types you expect.',
    },
    {
      q: 'How do I enter a variable number of context managers?',
      a: 'Use contextlib.ExitStack: inside "with ExitStack() as stack:" call stack.enter_context(cm) for each one. They are all exited in reverse order when the block ends — also when one of the later ones fails to open.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html',
    meta:  'contextlib — Utilities for with-statement contexts',
  },
};
