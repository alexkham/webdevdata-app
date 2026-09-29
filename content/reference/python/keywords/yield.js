// content/reference/python/keywords/yield.js

export const meta = {
  slug:        'yield',
  name:        'yield',
  signature:   'yield expression',
  blurb:       'Turn a function into a generator: it produces values one at a time, pausing between them, only when asked.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'yield generator generator function yield from lazy iterator next send stopiteration generator expression consumed once keyword',
};

export const method = {
  slug:      'yield',
  name:      'yield',
  signature: 'yield expression',

  category:    'Functions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'A def containing yield returns a generator instead of running. Each next() runs the body up to the following yield — lazily, and exactly once per value.',

  covers: ['yield'],

  syntax: [
    { label: 'yield', code: 'def gen():\n    yield value' },
    { label: 'yield from', code: 'def gen():\n    yield from iterable' },
    { label: 'receive with send()', code: 'received = yield value' },
  ],

  cheat: {
    useFor:    'Streams of values, big or infinite sequences, pipelines over files and data',
    result:    'calling the function returns a generator object; yield evaluates to what send() passed (None for next())',
    pairsWith: 'next(), for, list(), itertools, yield from, return',
    watchOut:  'a generator can be iterated only once — the second pass is empty',
  },

  parameters: [
    { name: 'expression', type: 'expression', required: false, default: 'None', desc: 'The value handed to the consumer of this step. Omitted → None.' },
    { name: 'iterable',   type: 'expression', required: true,  default: null,   desc: 'yield from only: every item is passed through, and the expression evaluates to the sub-generator’s return value.' },
  ],

  modes: [
    {
      id: 'lazy',
      label: 'lazy',
      blurb: 'Ask for one value and look at the log: only one item was made, no matter how big n is.',
      params: [{ name: 'n', type: 'int', hint: 'how many to offer', input: 'number' }],
      template: "log = []\ndef numbers(n):\n    for i in range(n):\n        log.append(f'made {i}')\n        yield i\ng = numbers({$n})\nfirst = next(g)\n(first, log)",
      cases: [
        { id: 'five',  label: 'n = 5',         values: { n: '5' } },
        { id: 'huge',  label: 'n = a billion', values: { n: '1000000000' } },
        { id: 'zero',  label: 'n = 0',         values: { n: '0' } },
      ],
    },
    {
      id: 'once',
      label: 'consumed once',
      blurb: 'The first list() drains the generator; the second finds it exhausted.',
      params: [{ name: 'nums', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'def squares(nums):\n    for n in nums:\n        yield n * n\ng = squares({$nums})\n(list(g), list(g))',
      cases: [
        { id: 'ints',  label: 'ints',       values: { nums: '1, 2, 3' } },
        { id: 'float', label: 'with float', values: { nums: '1.5, -4' } },
        { id: 'empty', label: 'empty list', values: { nums: '' } },
      ],
    },
    {
      id: 'from',
      label: 'yield from',
      blurb: 'yield from passes every item of the inner generator through — then evaluates to its return value.',
      params: [{ name: 'xs', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: "def inner(xs):\n    yield from xs\n    return len(xs)\ndef outer(xs):\n    count = yield from inner(xs)\n    yield f'{count} items'\nlist(outer({$xs}))",
      cases: [
        { id: 'three', label: 'three items', values: { xs: '4, 5, 6' } },
        { id: 'empty', label: 'empty list',  values: { xs: '' } },
      ],
    },
  ],
  demoExplainer: 'In the lazy tab the log has a single entry even for a billion — the rest were never computed. With n = 0 the generator has nothing to give, so next() raises StopIteration. In the consumed once tab, the second list() is always empty: generators do not rewind.',

  patterns: [
    {
      name: 'Stream a file line by line',
      desc: 'Constant memory, however big the file.',
      code: 'def non_blank(path):\n    with open(path) as f:\n        for line in f:\n            if line.strip():\n                yield line.rstrip("\\n")',
    },
    {
      name: 'Pipeline of generators',
      desc: 'Each stage pulls from the previous one, one item at a time.',
      code: 'def parse(lines):\n    for line in lines:\n        yield line.split(",")\n\nrows = parse(non_blank("data.csv"))',
    },
    {
      name: 'Flatten with yield from',
      desc: 'Delegate to a sub-iterable instead of looping and yielding.',
      code: 'def flatten(tree):\n    for node in tree:\n        if isinstance(node, list):\n            yield from flatten(node)\n        else:\n            yield node',
    },
    {
      name: 'Generator expression',
      desc: 'The one-line form for simple cases.',
      code: 'total = sum(x * x for x in numbers)',
    },
  ],

  examples: [
    { title: 'A simple generator',          code: 'def count_up(n):\n    i = 1\n    while i <= n:\n        yield i\n        i += 1\nlist(count_up(3))', returns: '[1, 2, 3]' },
    { title: 'Calling it returns a generator', code: 'def gen():\n    yield 1\ntype(gen()).__name__', returns: "'generator'" },
    { title: 'The body starts at the first next()', code: "def gen():\n    print('started')\n    yield 1\ng = gen()\nprint('created')\nnext(g)", returns: 'created\nstarted\n1' },
    { title: 'Infinite, but lazy',          code: 'from itertools import islice\ndef naturals():\n    n = 0\n    while True:\n        yield n\n        n += 1\nlist(islice(naturals(), 5))', returns: '[0, 1, 2, 3, 4]' },
    { title: 'yield from flattens',         code: 'def flat(lists):\n    for lst in lists:\n        yield from lst\nlist(flat([[1, 2], [3]]))', returns: '[1, 2, 3]' },
    { title: 'send() a value in',           code: "def echo():\n    got = yield 'ready'\n    yield f'got {got}'\ng = echo()\n(next(g), g.send(42))", returns: "('ready', 'got 42')" },
    { title: 'yield outside a function',    code: "compile('yield 1', '<demo>', 'exec')", returns: "SyntaxError: 'yield' outside function" },
  ],

  pitfalls: [
    {
      name: 'Iterating a generator twice',
      desc: 'sum() consumed every value; the generator is now exhausted. Store a list if you need the values again.',
      wrong: { label: 'reuse the generator', code: 'def evens(xs):\n    for x in xs:\n        if x % 2 == 0:\n            yield x\ne = evens([1, 2, 3, 4])\ntotal = sum(e)\n(total, list(e))', output: '(6, [])' },
      fix:   { label: 'materialise once',    code: 'def evens(xs):\n    for x in xs:\n        if x % 2 == 0:\n            yield x\ne = list(evens([1, 2, 3, 4]))\ntotal = sum(e)\n(total, list(e))', output: '(6, [2, 4])' },
    },
    {
      name: 'Treating a generator like a list',
      desc: 'Generators have no length and no indexing — they only know how to produce the next value.',
      wrong: { label: 'len(generator)', code: 'def gen():\n    yield 1\n    yield 2\nlen(gen())', output: "TypeError: object of type 'generator' has no len()" },
      fix:   { label: 'list() first',   code: 'def gen():\n    yield 1\n    yield 2\nlen(list(gen()))', output: '2' },
    },
    {
      name: 'send() before the generator started',
      desc: 'A fresh generator is not paused at a yield yet, so there is nothing to receive the value. Prime it with next() first.',
      wrong: { label: 'send first', code: 'def gen():\n    x = yield\n    yield x * 2\ng = gen()\ng.send(5)', output: "TypeError: can't send non-None value to a just-started generator" },
      fix:   { label: 'next, then send', code: 'def gen():\n    x = yield\n    yield x * 2\ng = gen()\nnext(g)\ng.send(5)', output: '10' },
    },
  ],

  when: {
    use: [
      'Producing a long or unbounded series without building it in memory',
      'Reading files, sockets or paginated APIs item by item',
      'Splitting a loop into stages (produce / filter / transform) that each stay simple',
    ],
    avoid: [
      'You need len(), indexing or several passes → return a list',
      'The values are small and few → a list is simpler to debug',
      'A one-line transformation → a generator expression (x for x in …)',
    ],
  },

  notes: {
    cpython:      'A function containing yield is compiled with the generator flag; calling it creates a generator object holding a suspended frame',
    'Return':     'return value in a generator ends it and sets StopIteration.value — yield from evaluates to it',
    'yield from': 'Added in 3.3 (PEP 380); it also forwards send() and throw() to the sub-generator',
  },

  related: [
    { name: 'def',    slug: 'def',    when: 'Generators are defined with def' },
    { name: 'return', slug: 'return', when: 'Ends a generator; value goes to StopIteration.value' },
    { name: 'for',    slug: 'for',    when: 'The usual way to consume a generator' },
    { name: 'from',   slug: 'import', when: 'The from keyword (also used in yield from)' },
    { name: 'async / await', slug: 'async-await', when: 'async def with yield makes an async generator' },
    { name: 'next()', slug: 'next',   when: 'Pull one value by hand', category: 'functions' },
    { name: 'StopIteration', slug: 'stopiteration', when: 'Raised when a generator is exhausted', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between yield and return?',
      a: 'return ends the function and hands back one value. yield hands back a value and pauses; the function resumes where it left off on the next next() call. A function that contains yield anywhere becomes a generator function.',
    },
    {
      q: 'What does yield from do?',
      a: 'yield from iterable yields every item of the iterable in turn, as if you wrote a for loop with yield. With a sub-generator it also forwards send() and throw(), and the whole expression evaluates to the sub-generator’s return value. It was added in Python 3.3.',
    },
    {
      q: 'Why is my generator empty the second time?',
      a: 'A generator is an iterator: once it has produced its last value it is exhausted and stays that way. Call the generator function again for a fresh one, or store the values in a list.',
    },
    {
      q: 'When does the code in a generator function run?',
      a: 'Not when you call it — the call only creates the generator. The body runs up to the first yield on the first next() (or first loop iteration), then up to the next yield each time after.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added yield from <expr> to delegate control flow to a subiterator.' },
    { version: '3.8', note: 'Yield expressions prohibited in the implicitly nested scopes used to implement comprehensions and generator expressions.' },
    { version: '3.13', note: 'If a generator returns a value upon being closed, the value is returned by close().' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#yield-expressions',
    meta:  'Yield expressions',
  },
};
