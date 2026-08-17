// content/reference/python/functions/iter.js

export const meta = {
  slug:        'iter',
  name:        'iter',
  signature:   'iter(iterable) / iter(callable, sentinel)',
  blurb:       'Get an iterator from any iterable — the entry point to Python&apos;s iteration protocol.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.5+',
  searchTerms: 'iter iterator iterable protocol next generator stopiteration sentinel callable',
};

export const method = {
  slug:      'iter',
  name:      'iter',
  signature: 'iter(iterable) / iter(callable, sentinel)',
  returns:   { type: 'iterator', desc: 'Single-arg: an iterator over the iterable — calls __iter__() on the object. Two-arg: a &quot;call until sentinel&quot; iterator that invokes callable() repeatedly until it returns the sentinel value.' },

  category:    'Built-in function',
  version:     'Python 1.5+',
  hasLiveDemo: false,

  subtitle: 'Turn any iterable into an iterator you can advance with next() — or wrap a callable in a stop-at-sentinel loop.',

  cheat: {
    commonCall: 'it = iter(items)',
    returns:    'an iterator — call next(it) to advance',
    replaces:   'the internal __iter__() call that a for-loop makes',
    watchOut:   'iterators are ONE-SHOT — once exhausted, iterating again yields nothing',
  },

  parameters: [
    { name: 'iterable', type: 'iterable',         required: true,  default: null, desc: 'Single-arg form: any object with __iter__() (list, tuple, dict, str, generator, ...).' },
    { name: 'callable', type: 'callable',         required: false, default: null, desc: 'Two-arg form: a callable of zero args. Called repeatedly to produce items.' },
    { name: 'sentinel', type: 'Any',              required: false, default: null, desc: 'Two-arg form: iteration stops (WITHOUT yielding) when callable() equals this value.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated values', input: 'csv' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { items: 'a,b,c' } },
    { id: 'numbers',  label: 'numbers',         values: { items: '1,2,3,4,5' } },
    { id: 'single',   label: 'single item',     values: { items: 'only' } },
    { id: 'empty',    label: 'empty',           values: { items: '' } },
    { id: 'dupes',    label: 'has duplicates',  values: { items: 'a,a,b,b,c' } },
  ],
  demoExplainer: 'iter() returns an ITERATOR — a stateful object you advance with next(). The demo shows the values the iterator would yield (in order). Notably iterators PRESERVE duplicates (unlike sets); an iterator over "a,a,b,b,c" yields all five items. The two-arg form (iter(callable, sentinel)) is rare but useful: it wraps a callable into &quot;call until it returns sentinel&quot;, handy for reading a stream until EOF.',

  patterns: [
    {
      name: 'Get an iterator to advance manually',
      desc: 'When you want to consume items one at a time with next().',
      code: 'it = iter(items)\nfirst = next(it)\nsecond = next(it)',
    },
    {
      name: 'Read until a sentinel',
      desc: 'The classic use of the two-arg form — reading a stream in chunks until EOF.',
      code: 'with open("data") as f:\n    for chunk in iter(lambda: f.read(4096), ""):\n        process(chunk)',
    },
    {
      name: 'Skip the first N items',
      desc: 'Consume N items manually, then let a for-loop handle the rest.',
      code: 'it = iter(items)\nfor _ in range(n):\n    next(it, None)\nfor item in it:\n    ...',
    },
    {
      name: 'Detect an empty iterable',
      desc: 'Use next() with a sentinel default to peek.',
      code: 'it = iter(items)\nsentinel = object()\nif next(it, sentinel) is sentinel:\n    ...   # empty',
    },
  ],

  examples: [
    { title: 'From a list',           code: 'it = iter([1, 2, 3])\nnext(it)',      returns: '1' },
    { title: 'From a string',         code: 'it = iter("abc")\nnext(it)',           returns: '"a"' },
    { title: 'From a dict (keys)',    code: 'it = iter({"a": 1, "b": 2})\nnext(it)', returns: '"a"' },
    { title: 'Empty iterator',        code: 'it = iter([])\nnext(it, "done")',      returns: '"done"' },
    { title: 'Two-arg sentinel',      code: 'r = iter(iter([1,2,3]).__next__, 3)\nlist(r)', returns: '[1, 2]  # stops before 3' },
    { title: 'Exhausted iterator',    code: 'it = iter([1])\nnext(it); next(it, "end")', returns: '"end"' },
  ],

  pitfalls: [
    {
      name: 'Iterators are ONE-SHOT',
      desc: 'Once exhausted, an iterator yields nothing. Trying to iterate again gives an empty sequence — a common source of &quot;why is my second loop empty?&quot; bugs.',
      wrong: { label: 'Empty second time', code: 'it = iter([1, 2, 3])\nlist(it)   # [1,2,3]\nlist(it)   # []', output: 'exhausted' },
      fix:   { label: 'Store the source', code: 'items = [1, 2, 3]\nlist(items); list(items)', output: '[1,2,3] both times' },
    },
    {
      name: 'iterable vs iterator confusion',
      desc: 'An ITERABLE can produce iterators (list, dict, str). An ITERATOR is the stateful cursor you actually advance. `iter()` converts iterable → iterator. Once you have an iterator, calling iter() on it returns the same iterator (not a fresh one).',
      wrong: { label: 'Assumed fresh iterator', code: 'it = iter([1, 2, 3])\nit2 = iter(it)\nit is it2', output: 'True  # NOT a fresh iterator' },
      fix:   { label: 'Fresh from source',       code: 'src = [1, 2, 3]\niter(src) is iter(src)', output: 'False  # each call is fresh' },
    },
    {
      name: 'Two-arg form: sentinel is EXCLUDED',
      desc: 'The sentinel value marks the end — it is NOT yielded. `iter(f, "STOP")` yields values from f() until one equals "STOP", then stops without yielding that value.',
      wrong: { label: 'Assumed inclusive', code: 'r = iter(iter([1,2,3]).__next__, 3)\nlist(r)   # excludes 3', output: '[1, 2]' },
      fix:   { label: 'Sentinel is exclusive by design', code: '# to include the sentinel, take one more with next(it, None) after', output: '' },
    },
    {
      name: 'Two-arg callable must take NO arguments',
      desc: 'The two-arg form calls callable() with no args. If your callable needs args, wrap it in a lambda or partial.',
      wrong: { label: 'Wrong arity', code: 'iter(f.read, "")   # if f.read takes an int arg', output: 'depends — may raise, may work' },
      fix:   { label: 'Bind the arg', code: 'iter(lambda: f.read(4096), "")', output: 'chunks until EOF' },
    },
  ],

  when: {
    use: [
      'Manual consumption via repeated next() calls',
      'Reading a stream until an EOF sentinel — the two-arg form',
      'Skipping some items before starting a for-loop',
      'Detecting empty iterables with next(it, sentinel)',
    ],
    avoid: [
      'A simple for-loop already calls iter() implicitly — do not wrap unnecessarily',
      'Re-iteration is needed → keep the SOURCE, not the iterator',
      'Peeking ahead → itertools.tee makes independent copies',
      'Complex stream logic → generators are usually clearer',
    ],
  },

  notes: {
    complexity: 'O(1) to construct; per-item cost depends on the source',
    return:     'An iterator object — stateful',
    cpython:    'Python/bltinmodule.c :: builtin_iter — calls PyObject_GetIter or wraps callable+sentinel',
    memory:     'O(1) — a small cursor object',
    threadSafe: 'Not safe under concurrent advancement',
  },

  related: [
    { name: 'next',      slug: 'next',      when: 'Advance the iterator returned by iter()' },
    { name: 'enumerate', slug: 'enumerate', when: 'Iterate with index and value pairs' },
    { name: 'zip',       slug: 'zip',       when: 'Walk multiple iterables in parallel' },
    { name: 'reversed',  slug: 'reversed',  when: 'Iterate a reversible sequence backwards' },
  ],

  faq: [
    {
      q: 'What is the difference between an iterable and an iterator?',
      a: 'An ITERABLE is any object you can loop over (list, dict, string, set). An ITERATOR is a stateful cursor produced from an iterable, which you advance with next(). Iterables are typically re-iterable; iterators are one-shot.',
    },
    {
      q: 'Why do I get an empty result the second time I iterate?',
      a: 'Because you stored an ITERATOR (from iter, map, filter, zip, generator) and iterated it once — it is now exhausted. Store the SOURCE (a list or generator function) if you need to iterate multiple times.',
    },
    {
      q: 'What is the two-arg iter form useful for?',
      a: 'Reading a stream in chunks until EOF, polling a queue until it returns a sentinel, or any &quot;call this until it says stop&quot; loop. It converts imperative call-with-check code into a lazy iterator you can pass around.',
    },
  ],

  history: [
    { version: '1.5', note: 'iter() and the iterator protocol formalized.' },
    { version: '2.2', note: 'Two-arg (callable, sentinel) form added.' },
    { version: '3.0', note: 'Iterators became the return type for map, filter, zip, and range.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#iter',
    meta:  'iter',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect iterator output' },
  ],
};