// content/reference/python/keywords/return.js

export const meta = {
  slug:        'return',
  name:        'return',
  signature:   'return expression',
  blurb:       'Leave a function and hand a value back to the caller — None if there is none, a tuple if you list several.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'return statement return value return none return multiple values tuple early return finally generator stopiteration value keyword',
};

export const method = {
  slug:      'return',
  name:      'return',
  signature: 'return expression',

  category:    'Functions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'return ends the current call immediately. No return means None; "return a, b" returns one tuple; a return inside finally overrides everything else.',

  covers: ['return'],

  syntax: [
    { label: 'return a value', code: 'return expression' },
    { label: 'bare return', code: 'return        # same as\nreturn None' },
    { label: 'several values', code: 'return a, b   # one tuple' },
  ],

  cheat: {
    useFor:    'Handing a result back; leaving a function early',
    result:    'the call expression evaluates to the returned object (None by default)',
    pairsWith: 'def, if (early exit), tuple unpacking, finally',
    watchOut:  'a return in finally discards the try block’s return value and any exception',
  },

  parameters: [
    { name: 'expression', type: 'expression', required: false, default: 'None', desc: 'Evaluated, then the function exits. A comma-separated list builds a tuple. Omitted → None.' },
  ],

  modes: [
    {
      id: 'none',
      label: 'implicit None',
      blurb: 'return inside the loop exits at the first match. If nothing matches, the function falls off the end and returns None.',
      params: [
        { name: 'items',  type: 'list', hint: 'comma-separated', input: 'csv-num' },
        { name: 'target', type: 'int',  hint: 'value to find',   input: 'number' },
      ],
      template: 'def find(items, target):\n    for i, x in enumerate(items):\n        if x == target:\n            return i\nfind({$items}, {$target})',
      cases: [
        { id: 'found',   label: 'found',     values: { items: '4, 8, 15, 8', target: '8' } },
        { id: 'missing', label: 'not found', values: { items: '4, 8, 15', target: '7' } },
        { id: 'float',   label: '8.0 == 8',  values: { items: '8.0, 8', target: '8' } },
      ],
    },
    {
      id: 'tuple',
      label: 'several values',
      blurb: 'return a, b returns ONE tuple; the caller can unpack it or keep it whole.',
      params: [{ name: 'nums', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'def min_max(nums):\n    return min(nums), max(nums)\nlow, high = min_max({$nums})\n(low, high, min_max({$nums}))',
      cases: [
        { id: 'ints',  label: 'ints',       values: { nums: '3, 9, -2, 5' } },
        { id: 'one',   label: 'one item',   values: { nums: '7' } },
        { id: 'empty', label: 'empty list', values: { nums: '' } },
      ],
    },
    {
      id: 'finally',
      label: 'return + finally',
      blurb: 'finally runs after the return value is computed but before the caller gets it — and also when the division fails.',
      params: [{ name: 'n', type: 'int', hint: 'divisor', input: 'number' }],
      template: "steps = []\ndef div(n):\n    try:\n        steps.append('try')\n        return 100 // n\n    finally:\n        steps.append('finally')\n(div({$n}), steps)",
      cases: [
        { id: 'ok',   label: 'divides', values: { n: '7' } },
        { id: 'neg',  label: 'negative', values: { n: '-7' } },
        { id: 'zero', label: 'zero',    values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the implicit None tab the result box shows None when nothing matched — the function never reached a return. In the finally tab, steps shows the finally block ran even though return came first; with 0 the ZeroDivisionError still escapes (finally runs, then the exception continues).',

  patterns: [
    {
      name: 'Guard clauses',
      desc: 'Return early for the special cases, keep the main path unindented.',
      code: 'def price(order):\n    if order is None:\n        return 0\n    if order.free:\n        return 0\n    return order.qty * order.unit',
    },
    {
      name: 'Return several values',
      desc: 'Return a tuple, unpack at the call site.',
      code: 'def split_name(full):\n    first, _, last = full.partition(" ")\n    return first, last\n\nfirst, last = split_name("Ada Lovelace")',
    },
    {
      name: 'Named results',
      desc: 'Past two or three values, a NamedTuple or dataclass is clearer than a bare tuple.',
      code: 'from typing import NamedTuple\n\nclass Stats(NamedTuple):\n    low: float\n    high: float\n\ndef stats(xs):\n    return Stats(min(xs), max(xs))',
    },
  ],

  examples: [
    { title: 'Return a value',            code: 'def square(x):\n    return x * x\nsquare(7)', returns: '49' },
    { title: 'No return gives None',      code: 'def hello():\n    x = 1\nprint(hello())', returns: 'None' },
    { title: 'Several values are a tuple', code: 'def pair():\n    return 1, 2\npair()', returns: '(1, 2)' },
    { title: 'Code after return never runs', code: "def f():\n    return 'done'\n    print('never')\nf()", returns: "'done'" },
    { title: 'return in a generator sets StopIteration.value', code: "def gen():\n    yield 1\n    return 'finished'\ng = gen()\nnext(g)\ntry:\n    next(g)\nexcept StopIteration as e:\n    print(e.value)", returns: 'finished' },
    { title: 'A return in finally wins',  code: "def f():\n    try:\n        return 'from try'\n    finally:\n        return 'from finally'\nf()", returns: "'from finally'" },
    { title: 'return outside a function', code: "compile('return 1', '<demo>', 'exec')", returns: "SyntaxError: 'return' outside function" },
  ],

  pitfalls: [
    {
      name: 'return inside finally swallows the exception',
      desc: 'A return in finally replaces whatever was in flight — including an exception. The error silently disappears. (Python 3.14 emits a SyntaxWarning for this.)',
      wrong: { label: 'return in finally', code: "def load():\n    try:\n        return 1 / 0\n    finally:\n        return 'ok'\nload()", output: "'ok'" },
      fix:   { label: 'cleanup only',      code: "def load():\n    try:\n        return 1 / 0\n    finally:\n        print('cleanup')\nload()", output: 'cleanup\nZeroDivisionError: division by zero' },
    },
    {
      name: 'return inside the loop too early',
      desc: 'A return inside the loop body ends the whole function on the first pass.',
      wrong: { label: 'returns on item 1', code: 'def total(xs):\n    s = 0\n    for x in xs:\n        s += x\n        return s\ntotal([1, 2, 3])', output: '1' },
      fix:   { label: 'after the loop',    code: 'def total(xs):\n    s = 0\n    for x in xs:\n        s += x\n    return s\ntotal([1, 2, 3])', output: '6' },
    },
    {
      name: 'Printing instead of returning',
      desc: 'print shows a value but the caller still receives None.',
      wrong: { label: 'print', code: 'def double(x):\n    print(x * 2)\nr = double(5)\nr is None', output: '10\nTrue' },
      fix:   { label: 'return', code: 'def double(x):\n    return x * 2\nr = double(5)\nr', output: '10' },
    },
  ],

  when: {
    use: [
      'Every function whose caller needs a result',
      'Early exit once the answer is known (guard clauses, search loops)',
      'Returning several related values as a tuple',
    ],
    avoid: [
      'Producing a sequence of values one at a time → yield',
      'Signalling failure with a special value like -1 → raise an exception',
      'return inside finally — it hides errors',
    ],
  },

  notes: {
    cpython:      'Compiles to RETURN_VALUE (RETURN_CONST for a constant); with a pending finally, the value is kept while the finally block runs',
    'Generators': 'In a generator, return value ends iteration and becomes StopIteration.value — this is what yield from evaluates to',
    'Async generators': "A non-empty return in an async generator is a SyntaxError: 'return' with value in async generator",
  },

  related: [
    { name: 'def',   slug: 'def',   when: 'Define the function that returns' },
    { name: 'yield', slug: 'yield', when: 'Produce many values instead of one' },
    { name: 'try',   slug: 'try',   when: 'finally runs on the way out of a return' },
    { name: 'StopIteration', slug: 'stopiteration', when: 'Carries a generator’s return value', category: 'exceptions' },
    { name: 'SyntaxError',   slug: 'syntaxerror',   when: "'return' outside function", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does a Python function return by default?',
      a: 'None. A function that ends without executing a return statement, or executes a bare return, returns None.',
    },
    {
      q: 'How do I return multiple values from a function?',
      a: 'Write return a, b. The comma builds a single tuple (a, b), and the caller can unpack it: x, y = f(). For many values, return a NamedTuple, dataclass or dict instead.',
    },
    {
      q: 'Does finally run after return?',
      a: 'Yes. The return value is computed, then the finally block runs, then the caller receives the value. If finally itself executes a return, that value replaces the original — and an exception raised in the try block is discarded.',
    },
    {
      q: 'Can a generator use return with a value?',
      a: 'Yes (since 3.3). return value stops the generator and the value is attached to the StopIteration exception as .value; yield from returns it to the delegating generator. A for loop ignores it.',
    },
  ],

  history: [
    { version: '3.3', note: 'Generator functions can return a value; it is carried by StopIteration.value (PEP 380).' },
    { version: '3.14', note: 'The compiler emits a SyntaxWarning when a return, break or continue appears in a finally block.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-return-statement',
    meta:  'The return statement',
  },
};
