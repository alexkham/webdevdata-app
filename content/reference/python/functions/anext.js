// content/reference/python/functions/anext.js
//
// Doc-only page: awaiting the next item needs a running event loop, which
// the synchronous demo harness cannot provide.

export const meta = {
  slug:        'anext',
  name:        'anext',
  signature:   'anext(async_iterator[, default])',
  blurb:       'The async counterpart of next — await the next item from an async iterator.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 3.10+',
  searchTerms: 'anext async next await asynchronous iterator StopAsyncIteration default aiter',
};

export const method = {
  slug:      'anext',
  name:      'anext',
  signature: 'anext(async_iterator[, default])',
  returns:   { type: 'awaitable', desc: 'An awaitable yielding the next item. Without a default, exhaustion raises StopAsyncIteration; with one, the default is returned instead.' },

  category:    'Built-in function',
  version:     'Python 3.10+',
  hasLiveDemo: false,

  subtitle: 'The half of the async protocol you actually await. Its optional default turns exhaustion from an exception into a value, exactly like next.',

  cheat: {
    commonCall: 'item = await anext(it)',
    returns:    'the next item — or the default when the iterator is done',
    replaces:   'await it.__anext__() plus a try block',
    watchOut:   'always await it; a bare anext(it) is an un-awaited coroutine',
  },

  parameters: [
    { name: 'async_iterator', type: 'async iterator', required: true,  default: null, desc: 'An object implementing __anext__, usually obtained from aiter or an async generator.' },
    { name: 'default',        type: 'Any',            required: false, default: null, desc: 'Returned instead of raising StopAsyncIteration when the iterator is exhausted.' },
  ],

  examples: [
    { title: 'Next item',        code: 'item = await anext(it)',                  returns: 'the next value' },
    { title: 'With a default',   code: 'item = await anext(it, None)',            returns: 'None when exhausted' },
    { title: 'Exhausted raises', code: 'await anext(empty_it)',                   returns: 'StopAsyncIteration' },
    { title: 'Peek the first',   code: 'it = aiter(stream)\nfirst = await anext(it)', returns: 'first item, rest still available' },
    { title: 'Forgetting await', code: 'item = anext(it)\ntype(item)',            returns: 'a coroutine, not the item' },
    { title: 'The 3.9 form',     code: 'item = await it.__anext__()',             returns: 'same result, older syntax' },
  ],

  pitfalls: [
    {
      name: 'Forgetting the await',
      desc: 'anext returns an awaitable, so without await you get a coroutine object. Python warns that it was never awaited — but only at collection time, far from the line that caused it.',
      wrong: { label: 'A coroutine', code: 'item = anext(it)\nprint(item)', output: '<coroutine object anext at 0x...>' },
      fix:   { label: 'Await it',    code: 'item = await anext(it)', output: 'the actual item' },
    },
    {
      name: 'StopAsyncIteration is not StopIteration',
      desc: 'Async exhaustion raises its own exception type. A handler written for StopIteration does not catch it, and the error escapes as an unhandled exception.',
      wrong: { label: 'Wrong exception', code: 'try:\n    await anext(it)\nexcept StopIteration:\n    ...', output: 'StopAsyncIteration escapes' },
      fix:   { label: 'Catch the right one', code: 'try:\n    await anext(it)\nexcept StopAsyncIteration:\n    ...', output: 'handled' },
    },
    {
      name: 'Never let StopAsyncIteration escape a generator',
      desc: 'Like StopIteration in a sync generator, letting it propagate out of an async generator turns into a RuntimeError rather than ending the loop. Always pass a default or catch it.',
      wrong: { label: 'Leaks out', code: 'async def g(it):\n    while True:\n        yield await anext(it)', output: 'RuntimeError: async generator raised StopAsyncIteration' },
      fix:   { label: 'Use a sentinel', code: 'async def g(it):\n    while (v := await anext(it, _MISSING)) is not _MISSING:\n        yield v', output: 'ends cleanly' },
    },
    {
      name: 'Python 3.10 and newer only',
      desc: 'The protocol has existed since 3.5, but the builtin arrived in 3.10. Older code calls the dunder directly and hand-rolls the default.',
      wrong: { label: 'Fails on 3.9', code: 'await anext(it)', output: "NameError: name 'anext' is not defined" },
      fix:   { label: 'Call the dunder', code: 'await it.__anext__()', output: 'works from 3.5' },
    },
  ],

  when: {
    use: [
      'Taking just the first item from an async stream',
      'Manual stepping where async for would be too rigid',
      'Merging or interleaving several async iterators by hand',
      'Async helpers that need a default instead of an exception',
    ],
    avoid: [
      'Consuming everything in order → async for',
      'Synchronous iterators → next',
      'Supporting Python 3.9 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(1) per call, plus whatever work the iterator does to produce the item',
    return:     'An awaitable; the item only exists once it is awaited',
    cpython:    'Python/bltinmodule.c :: builtin_anext',
    memory:     'Allocates one coroutine per call',
    threadSafe: 'Bound to its event loop — do not advance one iterator from several tasks at once',
  },

  related: [
    { name: 'aiter',     slug: 'aiter',     when: 'Get the async iterator before advancing it' },
    { name: 'next',      slug: 'next',      when: 'The synchronous equivalent, with the same default behaviour' },
    { name: 'iter',      slug: 'iter',      when: 'Get a synchronous iterator' },
    { name: 'enumerate', slug: 'enumerate', when: 'Counting while looping, for sync iterables' },
  ],

  faq: [
    {
      q: 'Why does anext need an await when aiter does not?',
      a: 'Producing the next item may involve real I/O — a network read, a database row — so __anext__ is a coroutine. Getting the iterator does no work at all, so __aiter__ stays an ordinary method.',
      code: 'it = aiter(stream)          # sync\nitem = await anext(it)      # async',
    },
    {
      q: 'How do I take just the first item of an async stream?',
      a: 'Get an iterator with aiter, await anext once, and pass a default if the stream might be empty. Nothing else is consumed, so the rest stays available.',
      code: 'it = aiter(stream)\nfirst = await anext(it, None)',
    },
    {
      q: 'Why do I get "coroutine was never awaited"?',
      a: 'Because anext was called without await, so the coroutine was created and then discarded. The warning appears when it is garbage collected, which is usually nowhere near the offending line — search for bare anext calls.',
      code: 'item = await anext(it)   # not: item = anext(it)',
    },
  ],

  history: [
    { version: '3.5',  note: 'Async iteration protocol introduced by PEP 492 (__aiter__ and __anext__).' },
    { version: '3.10', note: 'anext and aiter added as builtins, mirroring next and iter.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#anext',
    meta:  'anext',
  },

  tryInTool: [],
};
