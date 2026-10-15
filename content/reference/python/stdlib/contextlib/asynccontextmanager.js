// content/reference/python/stdlib/contextlib/asynccontextmanager.js

export const meta = {
  slug:        'asynccontextmanager',
  name:        'contextlib.asynccontextmanager',
  signature:   '@contextlib.asynccontextmanager',
  blurb:       'The async twin of @contextmanager: decorate an async generator function to get an asynchronous context manager for "async with" — and, since 3.10, a decorator for coroutine functions.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'contextlib asynccontextmanager python @asynccontextmanager async with async generator asynchronous context manager asyncio connection pool session aenter aexit _AsyncGeneratorContextManager',
};

export const method = {
  slug:      'asynccontextmanager',
  name:      'contextlib.asynccontextmanager',
  signature: '@contextlib.asynccontextmanager',
  returns:   { type: 'function', desc: 'A function whose calls return single-use asynchronous context managers (_AsyncGeneratorContextManager).' },

  category:    'contextlib decorator',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Write "async def … yield" instead of a class with __aenter__ and __aexit__. The rules are those of @contextmanager — yield exactly once, cleanup in finally — but you can await in the setup and the cleanup, and you must use async with.',

  covers: ['asynccontextmanager'],

  cheat: {
    commonCall: '@asynccontextmanager\nasync def connection():\n    conn = await connect()\n    try:\n        yield conn\n    finally:\n        await conn.close()',
    returns:    'async with connection() as conn: …',
    replaces:   'a class with async __aenter__ / __aexit__',
    watchOut:   'plain "with" on it is a TypeError — it only supports async with',
  },

  parameters: [
    { name: 'func', type: 'async generator function', required: true, default: null, desc: 'An "async def" containing one yield. Called with the factory\'s arguments.' },
  ],

  modes: [
    {
      id: 'trace',
      label: 'async with',
      blurb: 'Same shape as @contextmanager, inside asyncio.run(). Try n = 0.',
      params: [
        { name: 'name', type: 'str', hint: 'resource name', input: 'text' },
        { name: 'n',    type: 'int', hint: 'divisor in the body', input: 'number' },
      ],
      template: "import asyncio\nfrom contextlib import asynccontextmanager\nlog = []\n@asynccontextmanager\nasync def session(name):\n    log.append('open ' + name)\n    try:\n        yield name\n    finally:\n        log.append('close ' + name)\nasync def main():\n    async with session({$name}) as s:\n        log.append('use ' + s)\n        log.append(100 // {$n})\ntry:\n    asyncio.run(main())\nexcept ZeroDivisionError as e:\n    log.append(f'error: {e}')\nlog",
      cases: [
        { id: 'ok',   label: 'n = 3', values: { name: 'db', n: '3' } },
        { id: 'zero', label: 'n = 0', values: { name: 'db', n: '0' } },
      ],
    },
    {
      id: 'yields',
      label: 'yield count',
      blurb: 'Exactly one yield, as with @contextmanager. Try 0, 1 and 2.',
      params: [{ name: 'count', type: 'int', hint: 'how many times to yield', input: 'number' }],
      template: 'import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def resource():\n    for i in range({$count}):\n        yield i\nasync def main():\n    async with resource() as value:\n        return value\nasyncio.run(main())',
      cases: [
        { id: 'one',  label: 'once',  values: { count: '1' } },
        { id: 'none', label: 'never', values: { count: '0' } },
        { id: 'two',  label: 'twice', values: { count: '2' } },
      ],
    },
  ],
  demoExplainer: "With n = 0 the error is thrown into the async generator at its yield, the finally block logs 'close db', and the ZeroDivisionError then leaves asyncio.run() and reaches the except clause. A return inside async with still runs the exit, which is why yielding twice fails with RuntimeError: generator didn't stop even though main() already returned a value; never yielding gives RuntimeError: generator didn't yield.",

  patterns: [
    {
      name: 'Connection that is always released',
      desc: 'await in setup and in cleanup.',
      code: '@asynccontextmanager\nasync def connection(pool):\n    conn = await pool.acquire()\n    try:\n        yield conn\n    finally:\n        await pool.release(conn)',
    },
    {
      name: 'Time an async block',
      desc: 'A monotonic clock around the yield.',
      code: "import time\nfrom contextlib import asynccontextmanager\n\n@asynccontextmanager\nasync def timed(label):\n    start = time.monotonic()\n    try:\n        yield\n    finally:\n        print(label, time.monotonic() - start)",
    },
    {
      name: 'As a decorator (3.10+)',
      desc: 'Wraps every call of a coroutine function.',
      code: "@timed('fetch')\nasync def fetch_all():\n    ...",
    },
  ],

  examples: [
    { title: 'async with',                 code: "import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def session(name):\n    print('open', name)\n    try:\n        yield name\n    finally:\n        print('close', name)\nasync def main():\n    async with session('db') as s:\n        print('use', s)\nasyncio.run(main())", returns: 'open db\nuse db\nclose db' },
    { title: 'Decorating a coroutine function', code: "import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def timer():\n    print('start')\n    yield\n    print('stop')\n@timer()\nasync def job():\n    print('working')\nasyncio.run(job())", returns: 'start\nworking\nstop' },
    { title: 'Handling an error at the yield', code: "import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def guard():\n    try:\n        yield\n    except ValueError as e:\n        print('handled', e)\nasync def main():\n    async with guard():\n        raise ValueError('bad')\n    return 'after'\nasyncio.run(main())", returns: "handled bad\n'after'" },
    { title: 'Never yielding',             code: 'import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def nothing():\n    if False:\n        yield\nasync def main():\n    async with nothing():\n        pass\nasyncio.run(main())', returns: "RuntimeError: generator didn't yield" },
    { title: 'What the factory returns',   code: 'from contextlib import asynccontextmanager\n@asynccontextmanager\nasync def session():\n    yield\ntype(session()).__name__', returns: "'_AsyncGeneratorContextManager'" },
  ],

  pitfalls: [
    {
      name: 'Using plain with',
      desc: 'An asynchronous context manager has __aenter__ / __aexit__ only. It must be entered with async with, inside a coroutine.',
      wrong: { label: 'with', code: "from contextlib import asynccontextmanager\n@asynccontextmanager\nasync def session():\n    yield 'conn'\ndef main():\n    with session() as s:\n        pass\nmain()", output: "TypeError: '_AsyncGeneratorContextManager' object does not support the context manager protocol" },
      fix:   { label: 'async with', code: "import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def session():\n    yield 'conn'\nasync def main():\n    async with session() as s:\n        return s\nasyncio.run(main())", output: "'conn'" },
    },
    {
      name: 'Decorating a regular generator',
      desc: 'asynccontextmanager needs an "async def" generator; a plain generator fails when async with tries to advance it.',
      wrong: { label: 'def', code: 'import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\ndef notasync():\n    yield 1\nasync def main():\n    async with notasync() as v:\n        return v\nasyncio.run(main())', output: "TypeError: 'generator' object is not an async iterator" },
      fix:   { label: 'async def', code: 'import asyncio\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def isasync():\n    yield 1\nasync def main():\n    async with isasync() as v:\n        return v\nasyncio.run(main())', output: '1' },
    },
  ],

  when: {
    use: [
      'Resources that need await to acquire or release — connections, sessions, locks in asyncio code',
      'Wrapping whole coroutine functions with setup and cleanup (as a decorator, 3.10+)',
    ],
    avoid: [
      'Synchronous code → contextlib.contextmanager',
      'Only aclose() to call at the end → contextlib.aclosing',
      'Many async resources chosen at run time → contextlib.AsyncExitStack',
    ],
  },

  notes: {
    cpython:      "Lib/contextlib.py: _AsyncGeneratorContextManager — __aenter__ awaits anext(gen), __aexit__ awaits anext(gen) or gen.athrow(exc); the error messages are the same as for @contextmanager except \"generator didn't stop after athrow()\"",
    'Decorator':  'Since 3.10 the objects are AsyncContextDecorator instances, so @factory() works on coroutine functions; a new async generator is created for each call',
    'Single use': 'Like @contextmanager objects, each one can be entered only once',
  },

  related: [
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'The synchronous version' },
    { name: 'AsyncExitStack', slug: 'asyncexitstack', when: 'Many async context managers at once' },
    { name: 'contextlib.aclosing', slug: 'closing', when: 'Close an async generator early' },
    { name: 'async / await', slug: 'async-await', when: 'Coroutines and async with', category: 'keywords' },
    { name: 'anext()', slug: 'anext', when: 'What __aenter__ uses to start the generator', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between contextmanager and asynccontextmanager?',
      a: 'contextmanager decorates a normal generator and gives an object for "with"; asynccontextmanager decorates an "async def" generator and gives an object for "async with". In the async version the setup and cleanup can await.',
    },
    {
      q: 'Can I use an @asynccontextmanager as a decorator?',
      a: 'Yes, since Python 3.10: @my_cm() on an "async def" function wraps each call in "async with my_cm():". Each call gets a fresh generator, so the one-shot rule does not get in the way.',
    },
    {
      q: 'Why do I get "does not support the context manager protocol" with asynccontextmanager?',
      a: 'You used "with" instead of "async with". The object only has __aenter__ and __aexit__; enter it with async with inside an async def function.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.asynccontextmanager',
    meta:  'contextlib.asynccontextmanager',
  },
};
