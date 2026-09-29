// content/reference/python/exceptions/stopiteration.js

export const meta = {
  slug:        'stopiteration',
  name:        'StopIteration',
  signature:   'StopIteration([value])',
  blurb:       'Signals that an iterator has no more items; next() raises it on an exhausted iterator unless you pass a default.',
  category:    'control',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'stopiteration stopasynciteration stop iteration next exhausted iterator generator raised stopiteration runtimeerror pep 479 __next__ anext async iterator default value return value',
};

export const method = {
  slug:      'stopiteration',
  name:      'StopIteration',
  signature: 'StopIteration([value])',

  category:    'Control-flow exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The end-of-iterator signal: for loops absorb it silently, a bare next() lets it escape, and inside a generator it turns into RuntimeError.',

  chain: ['BaseException', 'Exception', 'StopIteration'],

  cheat: {
    raisedBy: 'next(it) on an exhausted iterator, __next__() of your own iterators',
    message:  'usually empty — the traceback ends in a bare StopIteration',
    quickFix: "next(it, default) — or a for loop",
    watchOut: 'inside a generator it becomes RuntimeError: generator raised StopIteration',
  },

  parameters: [
    { name: 'value', type: 'object', required: false, default: 'None', desc: "Stored as e.value (and in e.args). A generator's return value arrives here." },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Two next() calls on an iterator. With fewer than two items the second (or first) call raises.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: 'it = iter({$items})\nfirst = next(it)\nsecond = next(it)\n(first, second)',
      cases: [
        { id: 'two',   label: 'two items', values: { items: 'a, b' } },
        { id: 'one',   label: 'one item',  values: { items: 'a' } },
        { id: 'empty', label: 'empty',     values: { items: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'The same next() calls inside a generator. A StopIteration escaping a generator is converted to RuntimeError (PEP 479).',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: 'def first_two(items):\n    it = iter(items)\n    yield next(it)\n    yield next(it)\nlist(first_two({$items}))',
      cases: [
        { id: 'three', label: 'three items', values: { items: 'a, b, c' } },
        { id: 'one',   label: 'one item',    values: { items: 'a' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'next(it, default) returns the default instead of raising.',
      params: [
        { name: 'items',   type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'default', type: 'str',       hint: 'returned when exhausted', input: 'text' },
      ],
      template: 'it = iter({$items})\n[next(it, {$default}) for _ in range(3)]',
      cases: [
        { id: 'short', label: 'one item', values: { items: 'a', default: 'done' } },
        { id: 'full',  label: 'enough',   values: { items: 'a, b, c, d', default: 'done' } },
      ],
    },
  ],
  demoExplainer: "The traceback of a plain next() on an empty iterator ends in just StopIteration — no message, because iterators raise it with no arguments. Move the same calls into a generator (Raise) and you get RuntimeError: generator raised StopIteration instead: since Python 3.7 a StopIteration may not leak out of a generator, because it would silently end the loop that consumes it.",

  attributes: [
    { name: 'value',     type: 'object', meaning: "The first constructor argument, or None. When a generator executes return x, the StopIteration it raises has value x." },
    { name: 'args',      type: 'tuple', meaning: 'Constructor arguments; empty for iterator exhaustion.' },
    { name: '__cause__', type: 'BaseException | None', meaning: 'On the PEP 479 RuntimeError, __cause__ is the original StopIteration.' },
  ],

  patterns: [
    {
      name: 'First item or a default',
      desc: 'The idiomatic "first match" lookup — no exception handling needed.',
      code: "admin = next((u for u in users if u.is_admin), None)",
    },
    {
      name: 'Writing an iterator class',
      desc: '__next__ signals the end by raising StopIteration; for loops, list() and sum() stop on it.',
      code: "class Countdown:\n    def __init__(self, n):\n        self.n = n\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1",
    },
    {
      name: 'next() inside a generator, safely',
      desc: 'Catch StopIteration and return — never let it escape the generator body.',
      code: "def pairs(items):\n    it = iter(items)\n    while True:\n        try:\n            a, b = next(it), next(it)\n        except StopIteration:\n            return\n        yield a, b",
    },
    {
      name: 'Async iterator end (StopAsyncIteration)',
      desc: '__anext__ of an async iterator signals the end with StopAsyncIteration; async for absorbs it.',
      code: "class Ticker:\n    def __init__(self, n):\n        self.n = n\n    def __aiter__(self):\n        return self\n    async def __anext__(self):\n        if self.n == 0:\n            raise StopAsyncIteration\n        self.n -= 1\n        return self.n",
    },
  ],

  examples: [
    { title: 'next() on an empty iterator', code: 'next(iter([]))', returns: 'StopIteration' },
    { title: 'next() with a default', code: "next(iter([]), 'done')", returns: "'done'" },
    { title: "A generator's return value is e.value", code: "def gen():\n    yield 1\n    return 'finished'\ng = gen()\nnext(g)\ntry:\n    next(g)\nexcept StopIteration as e:\n    r = e.value\nr", returns: "'finished'" },
    { title: 'for loops absorb it', code: "class Countdown:\n    def __init__(self, n):\n        self.n = n\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1\nlist(Countdown(3))", returns: '[3, 2, 1]' },
    { title: 'Inside a generator it becomes RuntimeError', code: "def gen():\n    yield next(iter([]))\ntry:\n    list(gen())\nexcept RuntimeError as e:\n    r = (str(e), type(e.__cause__).__name__)\nr", returns: "('generator raised StopIteration', 'StopIteration')" },
    { title: 'yield from hands back the return value', code: "def inner():\n    yield 1\n    return 'inner done'\ndef outer():\n    result = yield from inner()\n    yield result\nlist(outer())", returns: "[1, 'inner done']" },
    { title: 'StopAsyncIteration from anext()', code: "import asyncio\nasync def agen():\n    yield 1\nasync def main():\n    it = agen()\n    await anext(it)\n    try:\n        await anext(it)\n    except StopAsyncIteration:\n        return 'exhausted'\nasyncio.run(main())", returns: "'exhausted'" },
    { title: 'StopAsyncIteration is not a StopIteration', code: 'issubclass(StopAsyncIteration, StopIteration)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Relying on StopIteration to end a generator',
      desc: 'Before Python 3.7 an unguarded next() inside a generator quietly ended it. Now it is a RuntimeError — old code like this breaks.',
      wrong: { label: 'unguarded next()', code: "def pairs(items):\n    it = iter(items)\n    while True:\n        a = next(it)\n        b = next(it)\n        yield (a, b)\nlist(pairs([1, 2, 3, 4]))", output: 'RuntimeError: generator raised StopIteration' },
      fix:   { label: 'catch and return', code: "def pairs(items):\n    it = iter(items)\n    while True:\n        try:\n            a = next(it)\n            b = next(it)\n        except StopIteration:\n            return\n        yield (a, b)\nlist(pairs([1, 2, 3, 4]))", output: '[(1, 2), (3, 4)]' },
    },
    {
      name: 'Iterators are single-use',
      desc: 'map(), filter(), zip(), generators and file objects are exhausted after one pass. The second consumer finds nothing.',
      wrong: { label: 'reuse a map', code: "nums = map(int, ['1', '2'])\ntotal = sum(nums)\nnext(nums)", output: 'StopIteration' },
      fix:   { label: 'materialise once', code: "nums = list(map(int, ['1', '2']))\ntotal = sum(nums)\n(total, nums[0])", output: '(3, 1)' },
    },
    {
      name: 'next() inside a generator expression',
      desc: 'A generator expression is a generator, so PEP 479 applies there too. Take a bounded slice instead.',
      wrong: { label: 'next() in genexp', code: 'it = iter([1, 2])\nlist(next(it) for _ in range(3))', output: 'RuntimeError: generator raised StopIteration' },
      fix:   { label: 'itertools.islice', code: 'from itertools import islice\nit = iter([1, 2])\nlist(islice(it, 3))', output: '[1, 2]' },
    },
  ],

  when: {
    use: [
      'Ending __next__ in an iterator class you write',
      'Reading a generator\'s return value (e.value) when driving it by hand',
      'try/except StopIteration around next() when the empty case needs its own logic',
    ],
    avoid: [
      'Just need a fallback → next(it, default)',
      'Ending a generator → return (never raise StopIteration inside it)',
      'Looping → a for loop handles the end for you',
    ],
  },

  notes: {
    cpython:    'Python/intrinsics.c — stopiteration_error() converts a StopIteration escaping a generator into RuntimeError, with the original as __cause__',
    'PEP 479':  'Change StopIteration handling inside generators — default since 3.7',
    'Async':    'StopAsyncIteration (3.5+) is the async counterpart, raised by __anext__ and anext(); it is a sibling of StopIteration, not a subclass',
    'Why an Exception': 'It subclasses Exception (unlike GeneratorExit), so a broad except Exception around next() will catch it',
  },

  related: [
    { name: 'next',          slug: 'next',          when: 'Pass a default to avoid the exception', category: 'functions' },
    { name: 'iter',          slug: 'iter',          when: 'Get an iterator; iter(f, sentinel) stops on a value', category: 'functions' },
    { name: 'GeneratorExit', slug: 'generatorexit', when: 'The other generator control exception' },
    { name: 'RuntimeError',  slug: 'runtimeerror',  when: 'What StopIteration becomes inside a generator' },
    { name: 'zip',           slug: 'zip',           when: 'Stops at the shortest iterator — no exception', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does RuntimeError: generator raised StopIteration mean?',
      a: 'A StopIteration escaped from inside a generator function or generator expression — usually from a bare next() call on an exhausted iterator. Since Python 3.7 (PEP 479) this is converted to RuntimeError instead of silently ending the generator. Fix it by catching StopIteration and using return, or by calling next(it, default).',
    },
    {
      q: 'How do I avoid StopIteration when calling next()?',
      a: "Pass a default: next(it, None) returns None when the iterator is exhausted. For a first-match search, next((x for x in items if cond(x)), None) is the idiomatic form.",
    },
    {
      q: 'Why is the StopIteration message empty?',
      a: 'Iterators raise StopIteration with no arguments, so str(e) is empty and the traceback ends in a bare StopIteration line. Only a generator that returns a value sets one: return 5 raises StopIteration(5), available as e.value.',
    },
    {
      q: 'What is StopAsyncIteration?',
      a: 'The async version (Python 3.5+). An asynchronous iterator\'s __anext__() raises it to end iteration, and await anext(ait) raises it on an exhausted async iterator unless you give a default. async for handles it automatically. It is not a subclass of StopIteration, so except StopIteration does not catch it.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added the value attribute and the ability for generator functions to use it to return a value.' },
    { version: '3.5', note: 'RuntimeError transformation available via from __future__ import generator_stop (PEP 479). StopAsyncIteration added.' },
    { version: '3.7', note: 'PEP 479 enabled for all code: a StopIteration raised in a generator is transformed into RuntimeError.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#StopIteration',
    meta:  'Built-in exceptions',
  },
};
