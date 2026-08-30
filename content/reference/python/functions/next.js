// content/reference/python/functions/next.js

export const meta = {
  slug:        'next',
  name:        'next',
  signature:   'next(iterator[, default])',
  blurb:       'Advance an iterator by one — with an optional default to avoid StopIteration.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 2.6+',
  searchTerms: 'next iterator advance stopiteration default first item peek generator',
};

export const method = {
  slug:      'next',
  name:      'next',
  signature: 'next(iterator[, default])',
  returns:   { type: 'Any', desc: 'The next item from the iterator. If the iterator is exhausted: raises StopIteration when default is omitted, or returns default when supplied.' },

  category:    'Built-in function',
  version:     'Python 2.6+',
  hasLiveDemo: false,

  subtitle: 'Advance an iterator by one — with an optional default to fall back on when the iterator is exhausted.',

  cheat: {
    commonCall: 'first = next(iter(items), None)',
    returns:    'the next item, or default if given and iterator is exhausted',
    replaces:   'try/except StopIteration around iterator.__next__()',
    watchOut:   'without a default, StopIteration is raised on exhaustion — catch or default it',
  },

  parameters: [
    { name: 'iterator', type: 'iterator', required: true,  default: null, desc: 'An iterator object (from iter(), map, filter, a generator, ...). Iterables that are NOT iterators (like plain lists) raise TypeError.' },
    { name: 'default',  type: 'Any',      required: false, default: null, desc: 'Value returned when the iterator is exhausted, instead of raising StopIteration. A sentinel object is a common choice.' },
  ],

  demoParams: [
    { name: 'items',   type: 'list', hint: 'comma-separated values',       input: 'csv' },
    { name: 'default', type: 'str',  hint: 'default if exhausted (optional)', input: 'text-or-none' },
  ],
  cases: [
    { id: 'basic',    label: 'first item',        values: { items: 'a,b,c',      default: '' } },
    { id: 'numbers',  label: 'numbers',           values: { items: '10,20,30',   default: '' } },
    { id: 'single',   label: 'single item',       values: { items: 'only',       default: '' } },
    { id: 'empty',    label: 'empty + default',   values: { items: '',           default: 'DONE' } },
    { id: 'empty-no', label: 'empty, no default', values: { items: '',           default: '' } },
  ],
  demoExplainer: 'next() returns ONE item — the next one from the iterator. The demo shows the FIRST item of the iterator over your input (or the default when the input is empty). In real code the same iterator can be called through next() multiple times to step through items one at a time; each call advances the cursor.',

  patterns: [
    {
      name: 'Get the first item with a default',
      desc: 'The idiomatic \"first item if any\" pattern.',
      code: 'first = next(iter(items), None)',
    },
    {
      name: 'Find the first matching item',
      desc: 'Combine with a generator expression for lazy find.',
      code: 'match = next((x for x in items if pred(x)), None)',
    },
    {
      name: 'Consume one to skip',
      desc: 'Skip a known header row or magic byte.',
      code: 'it = iter(lines)\nnext(it, None)   # discard header\nfor line in it:\n    parse(line)',
    },
    {
      name: 'Detect emptiness with a sentinel',
      desc: 'A distinct sentinel object avoids ambiguity when None or "" is a legitimate value.',
      code: '_missing = object()\nfirst = next(iter(items), _missing)\nif first is _missing:\n    raise ValueError("no items")',
    },
  ],

  examples: [
    { title: 'First of a list',       code: 'next(iter([1, 2, 3]))',              returns: '1' },
    { title: 'Iterator preserved',    code: 'it = iter([1,2])\nnext(it); next(it)',   returns: '2  # second call' },
    { title: 'Exhausted with default',code: 'next(iter([]), "done")',              returns: '"done"' },
    { title: 'Empty raises',          code: 'next(iter([]))',                       returns: 'StopIteration' },
    { title: 'First matching',        code: 'next((x for x in [1,2,3] if x > 1), None)', returns: '2' },
    { title: 'No match with default', code: 'next((x for x in [1,2,3] if x > 10), None)', returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Raises StopIteration on empty — without a default',
      desc: 'The single most common next() surprise. In Python 3.7+, StopIteration inside a generator becomes RuntimeError (PEP 479), so a bare next() in a comprehension is now dangerous.',
      wrong: { label: 'Bare next raises', code: 'next(iter([]))', output: 'StopIteration' },
      fix:   { label: 'Provide a default', code: 'next(iter([]), None)', output: 'None' },
    },
    {
      name: 'Only ITERATORS, not iterables',
      desc: 'A list is not an iterator; you cannot call next() on a plain list. You need to wrap in iter() first (or use a generator, map, filter, etc.).',
      wrong: { label: 'List rejected', code: 'next([1, 2, 3])', output: "TypeError: 'list' object is not an iterator" },
      fix:   { label: 'Wrap in iter',   code: 'next(iter([1, 2, 3]))', output: '1' },
    },
    {
      name: 'The iterator ADVANCES — repeated calls give different values',
      desc: 'next() is stateful. Each call moves the cursor. Calling next() twice from the same iterator yields the first and second items, not the first twice.',
      wrong: { label: 'Assumed idempotent', code: 'it = iter([1, 2, 3])\nnext(it); next(it); next(it)', output: '1, 2, 3' },
      fix:   { label: 'Iterator state matters', code: 'it = iter([1, 2, 3])\n[next(it), next(it), next(it)]', output: '[1, 2, 3]' },
    },
    {
      name: 'PEP 479: StopIteration inside a generator becomes RuntimeError',
      desc: 'Since Python 3.7, if a StopIteration leaks out of a generator (from a bare next() inside it), Python raises RuntimeError. Always provide a default for next() inside generator expressions.',
      wrong: { label: 'Leaks in generator', code: 'g = (next(it) for it in iters)   # some it may be empty', output: 'RuntimeError' },
      fix:   { label: 'Default it',         code: 'g = (next(it, None) for it in iters)', output: 'clean' },
    },
  ],

  when: {
    use: [
      'Getting the FIRST item of an iterator — always with a default',
      'Finding the first matching item via a generator expression',
      'Consuming a header or sentinel before a for-loop',
      'Peeking at state during manual iteration',
    ],
    avoid: [
      'Iterating a whole sequence → use a for-loop instead',
      'You need a list of all items → use list()',
      'You need N items → itertools.islice',
      'Bare next() inside a generator — PEP 479 makes this a RuntimeError',
    ],
  },

  notes: {
    complexity: 'O(1) per call — plus whatever the iterator does under the hood',
    return:     'The next item, or the default value',
    cpython:    'Python/bltinmodule.c :: builtin_next — calls the iterator\'s tp_iternext slot',
    memory:     'No allocation beyond the returned value',
    threadSafe: 'Not safe under concurrent advancement of the same iterator',
  },

  related: [
    { name: 'iter',      slug: 'iter',      when: 'Get an iterator from an iterable to feed into next()' },
    { name: 'enumerate', slug: 'enumerate', when: 'When you want both index and value in a for-loop' },
    { name: 'range',     slug: 'range',     when: 'A lazy integer sequence — pairs well with next()' },
  ],

  faq: [
    {
      q: 'Why does next([1, 2, 3]) fail?',
      a: 'Because a list is an ITERABLE, not an ITERATOR. next() only works on iterators. Wrap the list in iter() first: `next(iter([1, 2, 3]))`.',
    },
    {
      q: 'What is the difference between StopIteration and returning the default?',
      a: 'When you omit the default, exhaustion raises StopIteration — an exception you must catch. When you provide a default, exhaustion returns that value cleanly. In modern code, default is almost always the safer choice.',
    },
    {
      q: 'What is the \"sentinel object\" pattern in next() defaults?',
      a: 'When None or "" could be a legitimate value, using them as a default confuses \"exhausted\" with \"got a real None/empty\". Create a unique object() and check with `is` — an unmistakable sentinel.',
    },
  ],

  history: [
    { version: '2.6', note: 'next() builtin introduced. Previously you called iterator.next() directly.' },
    { version: '3.0', note: 'iterator.next() renamed to iterator.__next__(); next() is now the only public interface.' },
    { version: '3.7', note: 'PEP 479 finalized — StopIteration leaking from a generator becomes RuntimeError.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#next',
    meta:  'next',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect iterator output' },
  ],
};