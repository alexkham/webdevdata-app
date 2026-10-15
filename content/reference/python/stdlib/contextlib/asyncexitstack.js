// content/reference/python/stdlib/contextlib/asyncexitstack.js — contextlib.AsyncExitStack

export const meta = {
  slug:        'asyncexitstack',
  name:        'contextlib.AsyncExitStack',
  signature:   'contextlib.AsyncExitStack()',
  blurb:       'ExitStack for async code: combines asynchronous and ordinary context managers and coroutine callbacks, and unwinds them in reverse order at the end of an async with block or on aclose().',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'contextlib AsyncExitStack python AsyncExitStack.enter_async_context AsyncExitStack.push_async_exit AsyncExitStack.push_async_callback AsyncExitStack.aclose async with multiple async context managers asyncio cleanup stack',
};

export const method = {
  slug:      'asyncexitstack',
  name:      'contextlib.AsyncExitStack',
  signature: 'contextlib.AsyncExitStack()',
  returns:   { type: 'AsyncExitStack', desc: 'An empty stack; use it with async with (await stack.__aenter__() returns the stack itself).' },

  category:    'contextlib class',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Everything ExitStack does (enter_context, callback, push, pop_all) plus the async versions: await enter_async_context(cm), push_async_exit, push_async_callback and await aclose(). There is no close() and no plain with support.',

  covers: ['AsyncExitStack', 'AsyncExitStack.enter_async_context', 'AsyncExitStack.push_async_exit', 'AsyncExitStack.push_async_callback', 'AsyncExitStack.aclose'],

  cheat: {
    commonCall: 'async with AsyncExitStack() as stack:\n    conns = [await stack.enter_async_context(connect(u)) for u in urls]',
    returns:    'all connections released in reverse order at the end',
    replaces:   'nested async with statements of unknown depth',
    watchOut:   'push_async_callback needs a coroutine function, not a plain one',
  },

  parameters: [],

  attributes: [
    { name: 'await enter_async_context(cm)', type: 'coroutine', meaning: 'Awaits cm.__aenter__(), pushes cm.__aexit__, returns the __aenter__ result. TypeError (3.11+) if cm is not an asynchronous context manager.' },
    { name: 'push_async_exit(exit)',         type: 'method',    meaning: 'Pushes a coroutine function with the __aexit__ signature, or the __aexit__ of an object; a true result suppresses the exception.' },
    { name: 'push_async_callback(fn, /, *args, **kwds)', type: 'method', meaning: 'Pushes a coroutine function to be awaited as fn(*args, **kwds); it cannot suppress exceptions. Returns fn.' },
    { name: 'await aclose()',                type: 'coroutine', meaning: 'Unwinds the stack immediately (the async counterpart of ExitStack.close).' },
    { name: 'enter_context / callback / push / pop_all', type: 'method', meaning: 'Inherited from the shared base class: synchronous context managers and callbacks can be mixed in.' },
  ],

  modes: [
    {
      id: 'callbacks',
      label: 'push_async_callback',
      blurb: 'One async release per name, awaited in reverse order when the block ends.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated names', input: 'csv' }],
      template: "import asyncio\nfrom contextlib import AsyncExitStack\nlog = []\nasync def release(name):\n    log.append('release ' + name)\nasync def main():\n    async with AsyncExitStack() as stack:\n        for name in {$names}:\n            log.append('acquire ' + name)\n            stack.push_async_callback(release, name)\n        log.append('work')\nasyncio.run(main())\nlog",
      cases: [
        { id: 'three', label: 'a, b, c', values: { names: 'a, b, c' } },
        { id: 'none',  label: 'empty',   values: { names: '' } },
      ],
    },
    {
      id: 'mixed',
      label: 'sync + async',
      blurb: 'A synchronous lock (enter_context) and an async connection (enter_async_context) per name, on one stack.',
      params: [{ name: 'names', type: 'list[str]', hint: 'comma-separated names', input: 'csv' }],
      template: "import asyncio\nfrom contextlib import AsyncExitStack, asynccontextmanager, contextmanager\nlog = []\n@contextmanager\ndef lock(name):\n    log.append('lock ' + name)\n    yield\n    log.append('unlock ' + name)\n@asynccontextmanager\nasync def connect(name):\n    log.append('connect ' + name)\n    yield name\n    log.append('disconnect ' + name)\nasync def main():\n    async with AsyncExitStack() as stack:\n        for name in {$names}:\n            stack.enter_context(lock(name))\n            await stack.enter_async_context(connect(name))\n        log.append('work')\nasyncio.run(main())\nlog",
      cases: [
        { id: 'two', label: 'x, y', values: { names: 'x, y' } },
      ],
    },
  ],
  demoExplainer: "The stack does not care whether an entry is synchronous or asynchronous: it unwinds strictly in reverse, so for x, y the order is disconnect y, unlock y, disconnect x, unlock x.",

  patterns: [
    {
      name: 'Open many async resources',
      desc: 'Every connection opened so far is released if a later one fails.',
      code: 'from contextlib import AsyncExitStack\n\nasync def query_all(pool):\n    async with AsyncExitStack() as stack:\n        conns = [await stack.enter_async_context(pool.connection()) for _ in range(5)]\n        return await run_queries(conns)',
    },
    {
      name: 'Async cleanup without a context manager',
      desc: 'Any coroutine function can be scheduled.',
      code: 'from contextlib import AsyncExitStack\n\nasync def fetch(url):\n    async with AsyncExitStack() as stack:\n        client = await make_client()\n        stack.push_async_callback(client.aclose)\n        return await client.fetch(url)',
    },
    {
      name: 'Keep resources open beyond the block',
      desc: 'pop_all() transfers the callbacks; aclose() the new stack later.',
      code: 'from contextlib import AsyncExitStack\n\nasync def open_both():\n    async with AsyncExitStack() as stack:\n        a = await stack.enter_async_context(open_a())\n        b = await stack.enter_async_context(open_b())\n        keep = stack.pop_all()\n    return a, b, keep  # later: await keep.aclose()',
    },
  ],

  examples: [
    { title: 'Async callbacks in reverse order', code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def release(name):\n    print('release', name)\nasync def main():\n    async with AsyncExitStack() as stack:\n        for name in ['a', 'b']:\n            stack.push_async_callback(release, name)\n        print('work')\nasyncio.run(main())", returns: 'work\nrelease b\nrelease a' },
    { title: 'enter_async_context',             code: "import asyncio\nfrom contextlib import AsyncExitStack, asynccontextmanager\n@asynccontextmanager\nasync def connect(name):\n    print('connect', name)\n    yield name\n    print('disconnect', name)\nasync def main():\n    async with AsyncExitStack() as stack:\n        conns = [await stack.enter_async_context(connect(n)) for n in ['x', 'y']]\n        print(conns)\nasyncio.run(main())", returns: "connect x\nconnect y\n['x', 'y']\ndisconnect y\ndisconnect x" },
    { title: 'push_async_exit can suppress',    code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def exit_cb(exc_type, exc, tb):\n    print('async exit sees', exc_type.__name__)\n    return True\nasync def main():\n    async with AsyncExitStack() as stack:\n        stack.push_async_exit(exit_cb)\n        raise ValueError('x')\n    return 'suppressed'\nasyncio.run(main())", returns: "async exit sees ValueError\n'suppressed'" },
    { title: 'aclose() and sync callbacks',     code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    stack = AsyncExitStack()\n    stack.callback(print, 'sync callback')\n    await stack.aclose()\nasyncio.run(main())", returns: 'sync callback' },
    { title: 'There is no close()',             code: 'import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    stack = AsyncExitStack()\n    stack.close()\nasyncio.run(main())', returns: "AttributeError: 'AsyncExitStack' object has no attribute 'close'. Did you mean: 'aclose'?" },
    { title: 'A sync context manager is rejected by enter_async_context', code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    async with AsyncExitStack() as stack:\n        await stack.enter_async_context(open('x.txt', 'w'))\nasyncio.run(main())", returns: "TypeError: '_io.TextIOWrapper' object does not support the asynchronous context manager protocol" },
  ],

  pitfalls: [
    {
      name: 'A plain function as an async callback',
      desc: 'push_async_callback awaits what the function returns. A normal function runs, returns None, and the await fails. Use callback() for synchronous cleanup.',
      wrong: { label: 'push_async_callback(print)', code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    async with AsyncExitStack() as stack:\n        stack.push_async_callback(print, 'not a coroutine')\nasyncio.run(main())", output: "not a coroutine\nTypeError: object NoneType can't be used in 'await' expression" },
      fix:   { label: 'callback(print)', code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    async with AsyncExitStack() as stack:\n        stack.callback(print, 'sync is fine here')\nasyncio.run(main())", output: 'sync is fine here' },
    },
    {
      name: 'Using it with a plain with statement',
      desc: 'AsyncExitStack has only __aenter__ / __aexit__.',
      wrong: { label: 'with', code: 'from contextlib import AsyncExitStack\ndef main():\n    with AsyncExitStack():\n        pass\nmain()', output: "TypeError: 'AsyncExitStack' object does not support the context manager protocol" },
      fix:   { label: 'async with', code: "import asyncio\nfrom contextlib import AsyncExitStack\nasync def main():\n    async with AsyncExitStack() as stack:\n        return type(stack).__name__\nasyncio.run(main())", output: "'AsyncExitStack'" },
    },
  ],

  when: {
    use: [
      'A run-time number of async resources — connections, sessions, subscriptions',
      'Mixing sync and async cleanup in one ordered stack',
    ],
    avoid: [
      'Purely synchronous code → contextlib.ExitStack',
      'A fixed set of async resources → async with a(), b():',
    ],
  },

  notes: {
    cpython:      'Lib/contextlib.py: callbacks are stored with an is_sync flag; __aexit__ calls the sync ones and awaits the async ones, newest first, with the same exception-chaining logic as ExitStack.__exit__',
    'Own methods': 'enter_async_context, push_async_exit, push_async_callback and aclose are defined on AsyncExitStack; the synchronous methods come from the shared base class',
  },

  related: [
    { name: 'ExitStack', slug: 'exitstack', when: 'The synchronous version, with the shared methods' },
    { name: 'contextlib.asynccontextmanager', slug: 'asynccontextmanager', when: 'Async context managers to enter' },
    { name: 'contextlib.aclosing', slug: 'closing', when: 'Just aclose() one async generator' },
    { name: 'async / await', slug: 'async-await', when: 'Coroutines and async with', category: 'keywords' },
    { name: 'contextlib module', slug: 'contextlib', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between ExitStack and AsyncExitStack?',
      a: 'AsyncExitStack is used with async with and can also hold asynchronous context managers (enter_async_context) and coroutine callbacks (push_async_callback, push_async_exit). It unwinds with await aclose() instead of close().',
    },
    {
      q: 'Can AsyncExitStack hold normal (synchronous) context managers?',
      a: 'Yes. enter_context, callback, push and pop_all work as in ExitStack, and sync and async entries are unwound together in reverse order.',
    },
    {
      q: 'Why does push_async_callback fail with "can\'t be used in \'await\' expression"?',
      a: 'The function you passed is not a coroutine function, so calling it does not return something awaitable. Pass an async def function, or register synchronous cleanup with stack.callback().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.AsyncExitStack',
    meta:  'contextlib.AsyncExitStack',
  },
};
