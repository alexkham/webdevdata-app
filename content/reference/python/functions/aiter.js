// content/reference/python/functions/aiter.js
//
// Doc-only page: async iteration needs a running event loop, which the
// synchronous demo harness cannot provide.

export const meta = {
  slug:        'aiter',
  name:        'aiter',
  signature:   'aiter(async_iterable)',
  blurb:       'The async counterpart of iter — get an async iterator from an async iterable.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 3.10+',
  searchTerms: 'aiter async iterator asynchronous aiter anext await async for coroutine',
};

export const method = {
  slug:      'aiter',
  name:      'aiter',
  signature: 'aiter(async_iterable)',
  returns:   { type: 'async iterator', desc: 'The object returned by async_iterable.__aiter__(). Raises TypeError if the argument does not implement __aiter__.' },

  category:    'Built-in function',
  version:     'Python 3.10+',
  hasLiveDemo: false,

  subtitle: 'Exactly what iter is for ordinary iterables, moved into the async world. Note it is NOT awaited — only anext is.',

  cheat: {
    commonCall: 'it = aiter(stream)',
    returns:    'an async iterator — not a coroutine, so no await here',
    replaces:   'calling stream.__aiter__() by hand',
    watchOut:   'aiter() is sync; anext() is what you await',
  },

  parameters: [
    { name: 'async_iterable', type: 'async iterable', required: true, default: null, desc: 'An object implementing __aiter__ — an async generator, an async stream, or a class defining it.' },
  ],

  examples: [
    { title: 'Get an iterator',   code: 'it = aiter(stream)',                            returns: 'an async iterator' },
    { title: 'Step it manually',  code: 'it = aiter(stream)\nfirst = await anext(it)',   returns: 'the first item' },
    { title: 'No await on aiter', code: 'it = aiter(stream)   # not awaited',            returns: 'returns immediately' },
    { title: 'What async for does',code: 'async for x in stream:\n    ...',              returns: 'calls aiter then anext repeatedly' },
    { title: 'Wrong type',        code: 'aiter([1, 2, 3])',                              returns: "TypeError: 'list' object is not an async iterable" },
    { title: 'Idempotent',        code: 'it = aiter(stream)\naiter(it) is it',           returns: 'True for a well-behaved iterator' },
  ],

  pitfalls: [
    {
      name: 'aiter is not awaited, anext is',
      desc: 'The asymmetry catches almost everyone. __aiter__ returns the iterator synchronously; only __anext__ is a coroutine. Awaiting aiter gives a TypeError about a non-awaitable.',
      wrong: { label: 'Awaited wrongly', code: 'it = await aiter(stream)', output: "TypeError: object async_generator can't be used in 'await' expression" },
      fix:   { label: 'Await only anext', code: 'it = aiter(stream)\nitem = await anext(it)', output: 'correct' },
    },
    {
      name: 'A plain iterable is not an async iterable',
      desc: 'aiter needs __aiter__, which lists, generators and files do not have. There is no automatic bridge — wrap it in an async generator if you need one.',
      wrong: { label: 'Sync list rejected', code: 'aiter([1, 2, 3])', output: "TypeError: 'list' object is not an async iterable" },
      fix:   { label: 'Wrap it', code: 'async def to_async(xs):\n    for x in xs:\n        yield x\n\naiter(to_async([1, 2, 3]))', output: 'an async iterator' },
    },
    {
      name: 'No two-argument form',
      desc: 'iter(callable, sentinel) has a second form; aiter does not. Passing two arguments is a TypeError rather than a sentinel-driven loop.',
      wrong: { label: 'No sentinel form', code: 'aiter(read_chunk, b"")', output: 'TypeError: aiter expected 1 argument, got 2' },
      fix:   { label: 'Loop explicitly',  code: 'while (chunk := await read_chunk()) != b"":\n    ...', output: 'same effect, written out' },
    },
    {
      name: 'Python 3.10 and newer only',
      desc: 'Async iteration itself dates from 3.5, but the aiter and anext builtins only arrived in 3.10. On older versions call the dunder directly.',
      wrong: { label: 'Fails on 3.9', code: 'aiter(stream)', output: "NameError: name 'aiter' is not defined" },
      fix:   { label: 'Call the dunder', code: 'it = stream.__aiter__()', output: 'works from 3.5' },
    },
  ],

  when: {
    use: [
      'Stepping an async stream manually rather than with async for',
      'Writing generic code that must accept any async iterable',
      'Implementing helpers such as an async version of zip or islice',
    ],
    avoid: [
      'A simple loop → async for is clearer and handles the protocol for you',
      'Synchronous iterables → iter',
      'Supporting Python 3.9 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(1) — one call to __aiter__',
    return:     'An async iterator; calling aiter on one should return it unchanged',
    cpython:    'Python/bltinmodule.c :: builtin_aiter',
    memory:     'No allocation beyond whatever __aiter__ creates',
    threadSafe: 'Bound to its event loop — do not share an async iterator across loops',
  },

  related: [
    { name: 'anext',     slug: 'anext',     when: 'Actually advance the async iterator — this one you await' },
    { name: 'iter',      slug: 'iter',      when: 'The synchronous equivalent' },
    { name: 'next',      slug: 'next',      when: 'Advance a synchronous iterator' },
    { name: 'enumerate', slug: 'enumerate', when: 'Counting while looping, for sync iterables' },
  ],

  faq: [
    {
      q: 'Why is aiter not a coroutine?',
      a: 'Because getting an iterator does no I/O — it just hands back an object. Only advancing it can block, which is why __anext__ is the coroutine and __aiter__ is an ordinary method.',
      code: 'it = aiter(stream)          # sync\nitem = await anext(it)      # async',
    },
    {
      q: 'Do I need aiter if I use async for?',
      a: 'No. async for calls aiter once and then anext repeatedly, handling StopAsyncIteration for you. Reach for the builtins only when you want manual control — peeking at the first item, or writing a generic async helper.',
      code: 'async for item in stream:\n    ...',
    },
    {
      q: 'How do I turn a normal iterable into an async one?',
      a: 'Write a small async generator that yields from it. There is no builtin bridge, because the two protocols are deliberately separate.',
      code: 'async def to_async(iterable):\n    for x in iterable:\n        yield x',
    },
  ],

  history: [
    { version: '3.5',  note: 'Async iteration protocol introduced by PEP 492 (__aiter__ and __anext__).' },
    { version: '3.10', note: 'aiter and anext added as builtins, mirroring iter and next.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#aiter',
    meta:  'aiter',
  },

  tryInTool: [],
};
