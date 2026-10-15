// content/reference/python/stdlib/contextlib/contextmanager.js

export const meta = {
  slug:        'contextmanager',
  name:        'contextlib.contextmanager',
  signature:   '@contextlib.contextmanager',
  blurb:       'Decorator that turns a generator function into a context manager factory: code before yield is the setup, the yielded value is bound by "as", code after yield is the cleanup.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: "contextlib contextmanager python @contextmanager decorator generator context manager with statement yield setup teardown try finally generator didn't yield generator didn't stop _GeneratorContextManager",
};

export const method = {
  slug:      'contextmanager',
  name:      'contextlib.contextmanager',
  signature: '@contextlib.contextmanager',
  returns:   { type: 'function', desc: 'A function with the same name and docstring; each call returns a new single-use context manager (_GeneratorContextManager).' },

  category:    'contextlib decorator',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'The generator must yield exactly once. An exception in the with block is re-raised inside the generator at the yield — catch it there to handle or swallow it, and use finally so the cleanup always runs.',

  covers: ['contextmanager'],

  cheat: {
    commonCall: '@contextmanager\ndef opened(path):\n    f = open(path)\n    try:\n        yield f\n    finally:\n        f.close()',
    returns:    'with opened(p) as f: …',
    replaces:   'a class with __enter__ and __exit__',
    watchOut:   'no try/finally around the yield → no cleanup when the block raises',
  },

  parameters: [
    { name: 'func', type: 'generator function', required: true, default: null, desc: 'The decorated function. Called with the arguments given to the factory; must return a generator that yields once.' },
  ],

  modes: [
    {
      id: 'trace',
      label: 'setup / body / teardown',
      blurb: 'The generator catches ZeroDivisionError at its yield. Try n = 0, then a normal number.',
      params: [
        { name: 'name', type: 'str', hint: 'a label', input: 'text' },
        { name: 'n',    type: 'int', hint: 'divisor in the body', input: 'number' },
      ],
      template: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef step(name):\n    log.append('setup ' + name)\n    try:\n        yield name\n    except ZeroDivisionError as e:\n        log.append(f'handled: {e}')\n    finally:\n        log.append('teardown ' + name)\nwith step({$name}) as s:\n    log.append('body ' + s)\n    log.append(100 // {$n})\nlog",
      cases: [
        { id: 'ok',   label: 'n = 7', values: { name: 'job', n: '7' } },
        { id: 'zero', label: 'n = 0', values: { name: 'job', n: '0' } },
      ],
    },
    {
      id: 'yields',
      label: 'yield count',
      blurb: 'A @contextmanager generator must yield exactly once. Try 0, 1 and 2.',
      params: [{ name: 'count', type: 'int', hint: 'how many times to yield', input: 'number' }],
      template: 'from contextlib import contextmanager\n@contextmanager\ndef resource():\n    for i in range({$count}):\n        yield i\nwith resource() as value:\n    pass\nvalue',
      cases: [
        { id: 'one',  label: 'once',   values: { count: '1' } },
        { id: 'none', label: 'never',  values: { count: '0' } },
        { id: 'two',  label: 'twice',  values: { count: '2' } },
      ],
    },
    {
      id: 'nofinally',
      label: 'no try/finally',
      blurb: 'Cleanup written after a bare yield. Try n = 0: teardown is skipped.',
      params: [{ name: 'n', type: 'int', hint: 'divisor in the body', input: 'number' }],
      template: "from contextlib import contextmanager\nlog = []\n@contextmanager\ndef step():\n    log.append('setup')\n    yield\n    log.append('teardown')\ntry:\n    with step():\n        log.append(100 // {$n})\nexcept ZeroDivisionError:\n    log.append('caught outside')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 5', values: { n: '5' } },
        { id: 'zero', label: 'n = 0', values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: "In the first tab the error is caught inside the generator and not re-raised, so the with statement treats it as handled: the log ends with 'teardown job' and no exception escapes. A generator that never yields raises RuntimeError: generator didn't yield on entry; one that yields a second time raises RuntimeError: generator didn't stop on exit. Without try/finally the ZeroDivisionError propagates out of the yield, so 'teardown' is never logged.",

  patterns: [
    {
      name: 'Acquire and release',
      desc: 'The canonical shape: setup, try / yield / finally.',
      code: "from contextlib import contextmanager\n\n@contextmanager\ndef locked(lock):\n    lock.acquire()\n    try:\n        yield\n    finally:\n        lock.release()",
    },
    {
      name: 'Temporarily change, then restore',
      desc: 'Save the old value, set the new one, restore in finally.',
      code: "import os\nfrom contextlib import contextmanager\n\n@contextmanager\ndef env(name, value):\n    old = os.environ.get(name)\n    os.environ[name] = value\n    try:\n        yield\n    finally:\n        if old is None:\n            del os.environ[name]\n        else:\n            os.environ[name] = old",
    },
    {
      name: 'Log an error and re-raise it',
      desc: 'Catch at the yield, do something, then raise — otherwise the error is swallowed.',
      code: "from contextlib import contextmanager\n\n@contextmanager\ndef logged(name):\n    try:\n        yield\n    except Exception:\n        log.exception('%s failed', name)\n        raise",
    },
    {
      name: 'Use it as a decorator',
      desc: 'The same object wraps a whole function; a fresh generator is created for each call.',
      code: "@timed('report')\ndef build_report():\n    ...",
    },
  ],

  examples: [
    { title: 'Setup, body, cleanup',          code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\nwith tag('b'):\n    print('bold')", returns: '<b>\nbold\n</b>' },
    { title: 'The yielded value is bound by as', code: 'from contextlib import contextmanager\n@contextmanager\ndef value():\n    yield 42\nwith value() as v:\n    pass\nv', returns: '42' },
    { title: 'Cleanup in finally closes the file', code: "from contextlib import contextmanager\n@contextmanager\ndef opened(path):\n    f = open(path, 'w')\n    try:\n        yield f\n    finally:\n        f.close()\nwith opened('out.txt') as f:\n    f.write('hi')\nf.closed", returns: 'True' },
    { title: 'Swallowing an error at the yield', code: "from contextlib import contextmanager\n@contextmanager\ndef swallow():\n    try:\n        yield\n    except ValueError as e:\n        print('handled', e)\nwith swallow():\n    raise ValueError('bad input')\n'after the with'", returns: "handled bad input\n'after the with'" },
    { title: 'Log and re-raise',              code: "from contextlib import contextmanager\n@contextmanager\ndef log_errors():\n    try:\n        yield\n    except ValueError as e:\n        print('logging', e)\n        raise\nwith log_errors():\n    raise ValueError('bad input')", returns: 'logging bad input\nValueError: bad input' },
    { title: 'As a decorator',                code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\n@tag('p')\ndef para():\n    print('text')\npara()\npara()", returns: '<p>\ntext\n</p>\n<p>\ntext\n</p>' },
    { title: 'Name and docstring are kept',   code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    '''Wrap output in a tag.'''\n    yield\ntag.__name__, tag.__doc__", returns: "('tag', 'Wrap output in a tag.')" },
    { title: 'Yielding twice',                code: 'from contextlib import contextmanager\n@contextmanager\ndef twice():\n    yield 1\n    yield 2\nwith twice() as v:\n    print(v)', returns: "1\nRuntimeError: generator didn't stop" },
  ],

  pitfalls: [
    {
      name: 'Entering the same object twice',
      desc: 'Each call of the decorated function makes a single-use context manager. Store the function, not its result, and call it for every with.',
      wrong: { label: 'reuse cm', code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\ncm = tag('b')\nwith cm:\n    pass\nwith cm:\n    pass", output: "<b>\n</b>\nAttributeError: '_GeneratorContextManager' object has no attribute 'args'" },
      fix:   { label: 'call again', code: "from contextlib import contextmanager\n@contextmanager\ndef tag(name):\n    print(f'<{name}>')\n    yield\n    print(f'</{name}>')\nwith tag('b'):\n    pass\nwith tag('b'):\n    pass", output: '<b>\n</b>\n<b>\n</b>' },
    },
    {
      name: 'Catching at the yield without re-raising',
      desc: 'If the generator catches the exception and ends normally, the with statement considers it handled. Re-raise when you only wanted to log it.',
      wrong: { label: 'except: print', code: "from contextlib import contextmanager\n@contextmanager\ndef watch():\n    try:\n        yield\n    except ValueError as e:\n        print('saw', e)\nwith watch():\n    raise ValueError('lost')\n'error disappeared'", output: "saw lost\n'error disappeared'" },
      fix:   { label: 'raise', code: "from contextlib import contextmanager\n@contextmanager\ndef watch():\n    try:\n        yield\n    except ValueError as e:\n        print('saw', e)\n        raise\nwith watch():\n    raise ValueError('lost')", output: 'saw lost\nValueError: lost' },
    },
    {
      name: 'A function that is not a generator',
      desc: 'Without a yield the function returns a plain value, and the context manager fails on entry when it calls next() on it.',
      wrong: { label: 'return', code: 'from contextlib import contextmanager\n@contextmanager\ndef broken():\n    return 5\nwith broken():\n    pass', output: "TypeError: 'int' object is not an iterator" },
      fix:   { label: 'yield', code: 'from contextlib import contextmanager\n@contextmanager\ndef fixed():\n    yield 5\nwith fixed() as v:\n    pass\nv', output: '5' },
    },
  ],

  when: {
    use: [
      'Any acquire / release or change / restore pair — locks, connections, temporary settings, timers',
      'Context managers that need no state of their own beyond local variables',
    ],
    avoid: [
      'Reusable or re-entrant context managers → write a class with __enter__ / __exit__',
      'async with → contextlib.asynccontextmanager',
      'Objects that only need close() called → contextlib.closing',
    ],
  },

  notes: {
    cpython:        "Lib/contextlib.py: __enter__ is next(gen) (StopIteration → RuntimeError(\"generator didn't yield\")); __exit__ is next(gen) after a clean exit (another value → \"generator didn't stop\") or gen.throw(exc) after an error",
    'Suppression':  'An exception is suppressed when the generator catches it and returns; it propagates when the generator lets it through or raises it again',
    'StopIteration': 'A StopIteration raised in the with block is not mistaken for the generator finishing — contextmanager checks that the exception that comes back is the one it threw',
    'Decorator':    'Since 3.2 the objects are ContextDecorator instances, so @factory(args) on a function wraps every call in a new with statement',
  },

  related: [
    { name: 'contextlib.asynccontextmanager', slug: 'asynccontextmanager', when: 'The same for async with' },
    { name: 'ContextDecorator', slug: 'contextdecorator', when: 'Why @contextmanager objects also work as decorators' },
    { name: 'contextlib.closing', slug: 'closing', when: 'When the cleanup is just close()' },
    { name: 'with',  slug: 'with',  when: 'The statement that drives __enter__ / __exit__', category: 'keywords' },
    { name: 'yield', slug: 'yield', when: 'Generators in general', category: 'keywords' },
  ],

  faq: [
    {
      q: "What does \"RuntimeError: generator didn't yield\" mean?",
      a: "The @contextmanager generator finished without reaching a yield, so there is no value to enter with — often a yield inside an if or loop that did not run, or an early return. Make sure the generator yields exactly once on every path.",
    },
    {
      q: "What does \"RuntimeError: generator didn't stop\" mean?",
      a: 'After the with block ended, contextmanager resumed the generator expecting it to finish, but it yielded again. A @contextmanager generator must yield exactly once; a yield in a loop is the usual cause.',
    },
    {
      q: 'How do I handle exceptions in a @contextmanager?',
      a: 'Wrap the yield in try. An exception from the with block is raised at the yield: catch it with except to handle it (the with statement then continues after the block), add raise to pass it on, and put cleanup in finally so it runs either way.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.contextmanager',
    meta:  'contextlib.contextmanager',
  },
};
