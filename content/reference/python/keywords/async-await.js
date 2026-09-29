// content/reference/python/keywords/async-await.js

export const meta = {
  slug:        'async-await',
  name:        'async / await',
  signature:   'async def name(params):',
  blurb:       'Define coroutines with async def and pause them with await — plus async for and async with — run by an event loop such as asyncio.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'async await async def coroutine asyncio asyncio.run gather async for async with event loop concurrency never awaited await outside async function keyword',
};

export const method = {
  slug:      'async-await',
  name:      'async / await',
  signature: 'async def name(params):',

  category:    'Functions',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'Calling an async def function does not run it — it creates a coroutine. await runs a coroutine to completion, letting the event loop run other tasks whenever it has to wait.',

  covers: ['async', 'await'],

  syntax: [
    { label: 'async def / await', code: 'async def main():\n    result = await coro()' },
    { label: 'run it', code: 'asyncio.run(main())' },
    { label: 'async for', code: 'async for item in aiter_obj:\n    ...' },
    { label: 'async with', code: 'async with lock:\n    ...' },
  ],

  cheat: {
    useFor:    'Many concurrent waits (network, sockets, subprocesses) in one thread',
    result:    'async def → a coroutine function; await x → the result of the awaitable x',
    pairsWith: 'asyncio.run(), asyncio.gather(), asyncio.create_task(), async for, async with',
    watchOut:  'forgetting await gives you a coroutine object, not a result (and a "never awaited" warning)',
  },

  parameters: [
    { name: 'async def',  type: 'definition', required: true,  default: null, desc: 'Defines a coroutine function. await, async for and async with are only allowed inside one.' },
    { name: 'await expr', type: 'expression', required: false, default: null, desc: 'expr must be awaitable (coroutine, Task, Future). Suspends this coroutine until the result is ready.' },
    { name: 'async for',  type: 'statement',  required: false, default: null, desc: 'Loops over an asynchronous iterable (__aiter__ / __anext__), e.g. an async generator.' },
    { name: 'async with', type: 'statement',  required: false, default: null, desc: 'Uses an asynchronous context manager (__aenter__ / __aexit__), e.g. asyncio.Lock or an HTTP session.' },
  ],

  modes: [
    {
      id: 'await',
      label: 'await in turn',
      blurb: 'Two awaits one after the other: b does not start until a has finished, even though a keeps yielding to the loop.',
      params: [
        { name: 'xs', type: 'list', hint: "a's items", input: 'csv-num' },
        { name: 'ys', type: 'list', hint: "b's items", input: 'csv-num' },
      ],
      template: "import asyncio\nxs = {$xs}\nys = {$ys}\nlog = []\nasync def worker(name, items):\n    for x in items:\n        log.append(f'{name}{x}')\n        await asyncio.sleep(0)\nasync def main():\n    await worker('a', xs)\n    await worker('b', ys)\nasyncio.run(main())\nlog",
      cases: [
        { id: 'two',   label: 'three + two', values: { xs: '1, 2, 3', ys: '4, 5' } },
        { id: 'empty', label: 'a is empty',  values: { xs: '', ys: '4, 5' } },
      ],
    },
    {
      id: 'gather',
      label: 'gather',
      blurb: 'gather() runs both as tasks. Each await asyncio.sleep(0) hands control back to the loop, so the steps interleave.',
      params: [
        { name: 'xs', type: 'list', hint: "a's items", input: 'csv-num' },
        { name: 'ys', type: 'list', hint: "b's items", input: 'csv-num' },
      ],
      template: "import asyncio\nxs = {$xs}\nys = {$ys}\nlog = []\nasync def worker(name, items):\n    for x in items:\n        log.append(f'{name}{x}')\n        await asyncio.sleep(0)\nasync def main():\n    await asyncio.gather(worker('a', xs), worker('b', ys))\nasyncio.run(main())\nlog",
      cases: [
        { id: 'two',     label: 'three + two', values: { xs: '1, 2, 3', ys: '4, 5' } },
        { id: 'uneven',  label: 'one + four',  values: { xs: '1', ys: '6, 7, 8, 9' } },
        { id: 'empty',   label: 'a is empty',  values: { xs: '', ys: '4, 5' } },
      ],
    },
    {
      id: 'asyncfor',
      label: 'async for',
      blurb: 'An async generator yields values between awaits; async for (here inside a comprehension) consumes it.',
      params: [{ name: 'nums', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'import asyncio\nasync def ticker(items):\n    for x in items:\n        await asyncio.sleep(0)\n        yield x\nasync def main():\n    return [x async for x in ticker({$nums}) if x > 0]\nasyncio.run(main())',
      cases: [
        { id: 'mixed', label: 'mixed signs', values: { nums: '3, -1, 0, 2.5' } },
        { id: 'empty', label: 'empty list',  values: { nums: '' } },
      ],
    },
  ],
  demoExplainer: 'Compare the first two tabs with the same inputs. Plain sequential awaits give all of a, then all of b. With gather, both workers are tasks on the event loop and each await asyncio.sleep(0) lets the other one take a step, so the log alternates a, b, a, b until the shorter one runs out. That order is deterministic: the loop runs ready tasks first in, first out.',

  patterns: [
    {
      name: 'Entry point',
      desc: 'One asyncio.run() at the top; everything below it is async.',
      code: 'import asyncio\n\nasync def main():\n    ...\n\nif __name__ == "__main__":\n    asyncio.run(main())',
    },
    {
      name: 'Run several things concurrently',
      desc: 'gather returns results in argument order, whatever finished first.',
      code: 'async def main():\n    results = await asyncio.gather(fetch(a), fetch(b), fetch(c))',
    },
    {
      name: 'TaskGroup (3.11+)',
      desc: 'Structured concurrency: if one task fails, the others are cancelled.',
      code: 'async def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(fetch(a))\n        t2 = tg.create_task(fetch(b))\n    print(t1.result(), t2.result())',
    },
    {
      name: 'Timeout (3.11+)',
      desc: 'Give up on a slow await.',
      code: 'async def load(url):\n    async with asyncio.timeout(5):\n        return await fetch(url)',
    },
  ],

  examples: [
    { title: 'Run a coroutine',             code: 'import asyncio\nasync def add(a, b):\n    return a + b\nasyncio.run(add(2, 3))', returns: '5' },
    { title: 'Calling it only creates a coroutine', code: 'async def f():\n    return 1\nc = f()\nname = type(c).__name__\nc.close()\nname', returns: "'coroutine'" },
    { title: 'gather keeps argument order', code: 'import asyncio\nasync def double(x):\n    await asyncio.sleep(0)\n    return x * 2\nasync def main():\n    return await asyncio.gather(double(1), double(5))\nasyncio.run(main())', returns: '[2, 10]' },
    { title: 'async with',                  code: "import asyncio\nasync def main():\n    lock = asyncio.Lock()\n    async with lock:\n        inside = lock.locked()\n    return inside, lock.locked()\nasyncio.run(main())", returns: '(True, False)' },
    { title: 'async for over an async generator', code: 'import asyncio\nasync def countdown(n):\n    while n:\n        yield n\n        n -= 1\nasync def main():\n    return [x async for x in countdown(3)]\nasyncio.run(main())', returns: '[3, 2, 1]' },
    { title: 'await outside async def',     code: "compile('def f():\\n    await g()', '<demo>', 'exec')", returns: "SyntaxError: 'await' outside async function" },
    { title: 'Is it a coroutine function?', code: 'import inspect\nasync def f():\n    pass\ninspect.iscoroutinefunction(f)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Forgetting await',
      desc: 'Without await you get a coroutine object, not its result — and Python later warns "coroutine ... was never awaited".',
      wrong: { label: 'no await', code: 'import asyncio\nasync def get():\n    return 41\nasync def main():\n    c = get()\n    try:\n        return c + 1\n    finally:\n        c.close()\nasyncio.run(main())', output: "TypeError: unsupported operand type(s) for +: 'coroutine' and 'int'" },
      fix:   { label: 'await it', code: 'import asyncio\nasync def get():\n    return 41\nasync def main():\n    return await get() + 1\nasyncio.run(main())', output: '42' },
    },
    {
      name: 'Calling asyncio.run() inside async code',
      desc: 'asyncio.run() starts an event loop; inside a coroutine one is already running. Just await the coroutine.',
      wrong: { label: 'nested run', code: 'import asyncio\nasync def inner():\n    return 1\nasync def main():\n    c = inner()\n    try:\n        return asyncio.run(c)\n    finally:\n        c.close()\nasyncio.run(main())', output: 'RuntimeError: asyncio.run() cannot be called from a running event loop' },
      fix:   { label: 'await', code: 'import asyncio\nasync def inner():\n    return 1\nasync def main():\n    return await inner()\nasyncio.run(main())', output: '1' },
    },
    {
      name: 'Sequential awaits when you wanted concurrency',
      desc: 'await a(); await b() waits for a before b even starts. Start both and gather them.',
      wrong: { label: 'one by one', code: "import asyncio\nlog = []\nasync def job(name):\n    log.append(name + ' start')\n    await asyncio.sleep(0)\n    log.append(name + ' end')\nasync def main():\n    await job('a')\n    await job('b')\nasyncio.run(main())\nlog", output: "['a start', 'a end', 'b start', 'b end']" },
      fix:   { label: 'gather', code: "import asyncio\nlog = []\nasync def job(name):\n    log.append(name + ' start')\n    await asyncio.sleep(0)\n    log.append(name + ' end')\nasync def main():\n    await asyncio.gather(job('a'), job('b'))\nasyncio.run(main())\nlog", output: "['a start', 'b start', 'a end', 'b end']" },
    },
  ],

  when: {
    use: [
      'Waiting on many network or I/O operations at once (HTTP clients, websockets, database drivers with async APIs)',
      'Servers handling many connections in one thread',
      'Timeouts and cancellation of waits',
    ],
    avoid: [
      'CPU-heavy work → multiprocessing or concurrent.futures (async does not add CPU parallelism)',
      'Libraries with only blocking APIs → threads, or asyncio.to_thread()',
      'A short script that does one thing at a time → plain synchronous code',
    ],
  },

  notes: {
    cpython:        'A coroutine is a suspended frame, like a generator; await delegates to the awaitable much like yield from',
    'Event loop':   'Nothing runs a coroutine except an event loop (asyncio.run) or another coroutine that awaits it',
    'Blocking':     'time.sleep() or a blocking call inside a coroutine freezes every task on the loop — use the async equivalent',
  },

  related: [
    { name: 'def',   slug: 'def',   when: 'Plain function definitions' },
    { name: 'yield', slug: 'yield', when: 'Generators — the machinery coroutines grew from' },
    { name: 'for',   slug: 'for',   when: 'The synchronous loop that async for mirrors' },
    { name: 'with',  slug: 'with',  when: 'The synchronous form of async with' },
    { name: 'anext()', slug: 'anext', when: 'Next item of an async iterator', category: 'functions' },
    { name: 'aiter()', slug: 'aiter', when: 'Async iterator from an async iterable', category: 'functions' },
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'asyncio.run() inside a running loop', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "coroutine was never awaited" mean?',
      a: "You called an async def function but never awaited the coroutine it returned, so its body never ran. Python emits RuntimeWarning: coroutine 'name' was never awaited when the unused coroutine is garbage-collected. Add await (or pass it to asyncio.run / create_task / gather).",
    },
    {
      q: 'Why is await outside an async function a SyntaxError?',
      a: "await is only valid inside async def. In a regular function you get SyntaxError: 'await' outside async function; at module level, 'await' outside function. From synchronous code, start the coroutine with asyncio.run(). (The interactive python -m asyncio REPL allows top-level await.)",
    },
    {
      q: 'Does async make my code run in parallel?',
      a: 'No. Coroutines run in one thread and take turns; a coroutine only gives up control at an await. That helps when most time is spent waiting on I/O, not when it is spent computing.',
    },
    {
      q: 'What is the difference between await and asyncio.gather?',
      a: 'await coro() runs one coroutine to completion before the next line. gather(a(), b()) wraps them in tasks that run concurrently and returns their results as a list, in argument order.',
    },
  ],

  history: [
    { version: '3.5', note: 'async def, await, async for and async with added (PEP 492).' },
    { version: '3.6', note: 'Asynchronous generators and asynchronous comprehensions introduced.' },
    { version: '3.7', note: 'await and async are now keywords; previously they were only treated as such inside the body of a coroutine function.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#coroutines',
    meta:  'Coroutines',
  },
};
