// content/reference/python/stdlib/typing/generator.js — generator, async and context-manager aliases

export const meta = {
  slug:        'generator',
  name:        'typing.Generator / Coroutine / ContextManager …',
  signature:   'Generator[YieldT, SendT=None, ReturnT=None] · AsyncGenerator[YieldT, SendT=None] · Coroutine[YieldT, SendT, ReturnT] · Awaitable[T] · AsyncIterable[T] · AsyncIterator[T] · ContextManager[T, ExitT=bool | None] · AsyncContextManager[T, ExitT=bool | None]',
  blurb:       'Deprecated aliases for annotating generators, coroutines, async iterators and context managers. Generator[int] is a generator that yields int; since 3.13 the send and return types default to None.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (deprecated since 3.9)',
  searchTerms: 'typing.Generator Generator AsyncGenerator Coroutine Awaitable AsyncIterable AsyncIterator ContextManager AsyncContextManager yield type send type return type annotate generator function async def coroutine type hint context manager with statement contextlib AbstractContextManager',
};

export const method = {
  slug:      'generator',
  name:      'typing.Generator / Coroutine / ContextManager …',
  signature: 'Generator[YieldT, SendT=None, ReturnT=None] · AsyncGenerator[YieldT, SendT=None] · Coroutine[YieldT, SendT, ReturnT] · Awaitable[T] · AsyncIterable[T] · AsyncIterator[T] · ContextManager[T, ExitT=bool | None] · AsyncContextManager[T, ExitT=bool | None]',
  returns:   { type: 'typing._GenericAlias', desc: 'An alias of collections.abc.Generator, Coroutine, … or contextlib.AbstractContextManager / AbstractAsyncContextManager.' },

  category:    'typing deprecated aliases',
  version:     'Python 3.5+ (deprecated since 3.9)',
  hasLiveDemo: true,

  subtitle: 'A generator function is annotated with what calling it returns — a Generator (or simply an Iterator) — not with the type it yields. These typing names are deprecated aliases: import Generator, Coroutine, Awaitable and the async iterators from collections.abc, and the context-manager ABCs from contextlib.',

  covers: ['Generator', 'AsyncGenerator', 'Coroutine', 'Awaitable', 'AsyncIterable', 'AsyncIterator', 'ContextManager', 'AsyncContextManager'],

  cheat: {
    commonCall: 'def count() -> Iterator[int]: ... / def echo() -> Generator[int, str, None]: ...',
    returns:    'Generator[int] → typing.Generator[int, NoneType, NoneType] (defaults filled in, 3.13)',
    replaces:   'collections.abc.Generator / Coroutine / Awaitable / AsyncIterator …, contextlib.AbstractContextManager',
    watchOut:   'Coroutine needs all three arguments; Generator needs at least one',
  },

  parameters: [
    { name: 'YieldT',  type: 'type', required: true,  default: null, desc: 'What the generator yields (and for Coroutine: what it yields to the event loop, usually None).' },
    { name: 'SendT',   type: 'type', required: false, default: 'None', desc: 'What generator.send() accepts. Defaults to None for Generator and AsyncGenerator since 3.13.' },
    { name: 'ReturnT', type: 'type', required: false, default: 'None', desc: 'What the return statement gives back (StopIteration.value, or the result of await for Coroutine).' },
    { name: 'T',       type: 'type', required: true,  default: null, desc: 'Awaitable/async iterators: the awaited or iterated type. Context managers: what __enter__ / __aenter__ returns.' },
    { name: 'ExitT',   type: 'type', required: false, default: 'bool | None', desc: 'Context managers (3.13+): what __exit__ returns — bool if it may swallow exceptions.' },
  ],

  modes: [
    {
      id: 'evaluate',
      label: 'evaluate',
      blurb: 'Type a hint. The typing aliases fill in default arguments (3.13) and count the rest.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nget_type_hints(f)['x']",
      cases: [
        { id: 'gen',   label: 'Generator[int]',       values: { hint: 'Generator[int]' } },
        { id: 'send',  label: 'Generator[int, str]',  values: { hint: 'Generator[int, str]' } },
        { id: 'many',  label: 'four arguments',       values: { hint: 'Generator[int, int, int, int]' } },
        { id: 'coro',  label: 'Coroutine[int]',       values: { hint: 'Coroutine[int]' } },
        { id: 'cm',    label: 'ContextManager[str]',  values: { hint: 'ContextManager[str]' } },
        { id: 'agen',  label: 'AsyncGenerator[bytes]', values: { hint: 'AsyncGenerator[bytes]' } },
      ],
    },
    {
      id: 'originArgs',
      label: 'origin & args',
      blurb: 'get_origin() names the real ABC; get_args() includes the filled-in defaults.',
      params: [{ name: 'hint', type: 'str', hint: 'a type hint', input: 'text' }],
      template: "from typing import *\ndef f(x: {$hint}): pass\nhint = get_type_hints(f)['x']\n(get_origin(hint), get_args(hint))",
      cases: [
        { id: 'gen',  label: 'Generator[int]',            values: { hint: 'Generator[int]' } },
        { id: 'cm',   label: 'ContextManager[int]',       values: { hint: 'ContextManager[int]' } },
        { id: 'coro', label: 'Coroutine[None, None, str]', values: { hint: 'Coroutine[None, None, str]' } },
      ],
    },
  ],
  demoExplainer: 'Generator[int] comes back as typing.Generator[int, NoneType, NoneType]: since 3.13 the send and return types default to None, so one argument is enough — and four arguments fail with "Too many arguments for typing.Generator; actual 4, expected at least 1". Coroutine has no defaults and needs all three. ContextManager[str] gains a second argument, bool | None, the default type of what __exit__ returns.',

  patterns: [
    {
      name: 'A generator that only yields',
      desc: 'Iterator[T] is enough when nobody calls send() and the return value is unused.',
      code: 'from collections.abc import Iterator\n\ndef countdown(n: int) -> Iterator[int]:\n    while n > 0:\n        yield n\n        n -= 1',
    },
    {
      name: 'A generator that receives values',
      desc: 'Generator[YieldT, SendT, ReturnT] when send() and return matter.',
      code: 'from collections.abc import Generator\n\ndef running_total() -> Generator[float, float, str]:\n    total = 0.0\n    while True:\n        x = yield total\n        if x < 0:\n            return "done"\n        total += x',
    },
    {
      name: 'async def: annotate the awaited result',
      desc: 'The coroutine type is implied — write the type await gives you.',
      code: 'async def fetch_count(url: str) -> int:\n    ...',
    },
    {
      name: 'A context-manager function',
      desc: 'contextlib.contextmanager wraps a generator; annotate the generator as Iterator[T].',
      code: 'from collections.abc import Iterator\nfrom contextlib import contextmanager\n\n@contextmanager\ndef opened(path: str) -> Iterator[str]:\n    yield path',
    },
  ],

  examples: [
    { title: 'A generator is a Generator and an Iterator', code: 'from collections.abc import Generator, Iterator\ndef count():\n    yield 1\n(isinstance(count(), Generator), isinstance(count(), Iterator))', returns: '(True, True)' },
    { title: 'typing.Generator fills in the defaults', code: 'from typing import Generator\nGenerator[int]', returns: 'typing.Generator[int, NoneType, NoneType]' },
    { title: 'collections.abc.Generator keeps what you wrote', code: 'import collections.abc\ncollections.abc.Generator[int]', returns: 'collections.abc.Generator[int]' },
    { title: 'Coroutine needs all three arguments', code: 'from typing import Coroutine\nCoroutine[int]', returns: 'TypeError: Too few arguments for typing.Coroutine; actual 1, expected 3' },
    { title: 'Calling an async def gives a Coroutine', code: 'from collections.abc import Awaitable, Coroutine\nasync def fetch():\n    return 1\nc = fetch()\nresult = (isinstance(c, Coroutine), isinstance(c, Awaitable))\nc.close()\nresult', returns: '(True, True)' },
    { title: 'ContextManager has an exit type (3.13)', code: 'from typing import ContextManager\nContextManager[int]', returns: 'typing.ContextManager[int, bool | None]' },
    { title: 'An iterator is not a generator', code: 'from collections.abc import Generator\nisinstance(iter([1, 2]), Generator)', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Annotating a generator function with its item type',
      desc: 'Calling a generator function returns a generator object, never the yielded type. Python runs either version; only the second hint is true.',
      wrong: { label: '-> int', code: 'def numbers() -> int:\n    yield 1\nisinstance(numbers(), int)', output: 'False' },
      fix:   { label: '-> Iterator[int]', code: 'from collections.abc import Iterator\ndef numbers() -> Iterator[int]:\n    yield 1\nisinstance(numbers(), Iterator)', output: 'True' },
    },
    {
      name: 'Using a coroutine without awaiting it',
      desc: 'The hint on async def describes the awaited result. The call itself returns a coroutine object — await it (or run it).',
      wrong: { label: 'call only', code: 'async def fetch() -> int:\n    return 1\nc = fetch()\nresult = isinstance(c, int)\nc.close()\nresult', output: 'False' },
      fix:   { label: 'asyncio.run', code: 'import asyncio\nasync def fetch() -> int:\n    return 1\nasyncio.run(fetch())', output: '1' },
    },
  ],

  when: {
    use: [
      'Generator[Y, S, R] when send() or the return value matter',
      'Coroutine / Awaitable for callables that return awaitables (callbacks, task factories)',
      'AsyncIterator[T] / AsyncIterable[T] for async for loops',
    ],
    avoid: [
      'Importing them from typing in 3.9+ code → collections.abc (Generator, Coroutine, Awaitable, AsyncGenerator, AsyncIterable, AsyncIterator) and contextlib (AbstractContextManager, AbstractAsyncContextManager)',
      'Generator[int, None, None] for a plain generator → Iterator[int]',
      'Annotating async def with Coroutine[...] → annotate the awaited type',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: _SpecialGenericAlias objects over Lib/_collections_abc.py and contextlib; since 3.13 Generator, AsyncGenerator, ContextManager and AsyncContextManager carry default arguments, which is why their errors say "expected at least 1"',
    'Defaults':   'Generator[Y] = Generator[Y, None, None] and AsyncGenerator[Y] = AsyncGenerator[Y, None] (3.13). ContextManager[T] = ContextManager[T, bool | None]',
    'Deprecation': 'Deprecated since 3.9 (PEP 585); no warning is issued',
  },

  related: [
    { name: 'Iterable / Sequence / Mapping …', slug: 'iterable', when: 'The container ABC aliases' },
    { name: 'Callable / Concatenate', slug: 'callable', when: 'Callbacks that return coroutines' },
    { name: 'yield', slug: 'yield', when: 'What makes a function a generator', category: 'keywords' },
    { name: 'async / await', slug: 'async-await', when: 'What makes a function a coroutine', category: 'keywords' },
    { name: 'with', slug: 'with', when: 'Where context managers are used', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I type hint a generator function in Python?',
      a: 'With the type of the object the call returns: Iterator[int] (from collections.abc) for a generator that just yields ints, or Generator[int, SendType, ReturnType] when send() or return values matter. Since Python 3.13 Generator[int] alone means Generator[int, None, None].',
    },
    {
      q: 'How do I annotate an async function?',
      a: 'Annotate the value await produces: async def fetch() -> int. The call itself returns a coroutine object, and type checkers know that awaiting it gives an int. Write Coroutine or Awaitable explicitly only where you pass such objects around, for example as callback parameters.',
    },
    {
      q: 'What is the difference between Iterator and Generator as a return hint?',
      a: 'Generator adds send(), throw() and close() and a return type. If callers only iterate, Iterator[T] is the simpler and more honest hint.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#annotating-generators-and-coroutines',
    meta:  'typing — Annotating generators and coroutines',
  },

};
