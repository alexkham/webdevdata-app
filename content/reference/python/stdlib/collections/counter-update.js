// content/reference/python/stdlib/collections/counter-update.js

export const meta = {
  slug:        'counter-update',
  name:        'Counter.update / subtract',
  signature:   'Counter.update(iterable=None, /, **kwds)  ·  Counter.subtract(iterable=None, /, **kwds)',
  blurb:       'Add counts to a Counter in place (update) or take them away (subtract) — from an iterable, a mapping or keyword arguments.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.1+ (subtract 3.2+)',
  searchTerms: 'counter update subtract add counts in place merge counters decrement negative counts Counter.update Counter.subtract python collections',
};

export const method = {
  slug:      'counter-update',
  name:      'Counter.update / subtract',
  signature: 'Counter.update(iterable=None, /, **kwds)',
  returns:   { type: 'None', desc: 'Both methods change the Counter in place.' },

  category:    'Counter method',
  version:     'Python 3.1+ (subtract 3.2+)',
  hasLiveDemo: true,

  subtitle: 'Unlike dict.update, Counter.update ADDS counts instead of replacing them. subtract is the mirror image and — unlike the - operator — keeps zero and negative results.',

  covers: ['Counter.update', 'Counter.subtract'],

  cheat: {
    commonCall: "c.update(['a', 'b'])  ·  c.subtract('a')",
    returns:    'None — the Counter itself changes',
    replaces:   'a loop of c[x] += 1 / c[x] -= 1',
    watchOut:   'a str argument is counted per character',
  },

  parameters: [
    { name: 'iterable', type: 'iterable | mapping', required: false, default: 'None', desc: 'Elements to count once each, or a mapping whose values are added (update) or subtracted (subtract).' },
    { name: '**kwds',   type: 'int',                required: false, default: null,   desc: 'Counts as keyword arguments: c.update(a=2).' },
  ],

  modes: [
    {
      id: 'update',
      label: 'update',
      blurb: 'Counts from the second text are added to the first.',
      params: [
        { name: 'a', type: 'str', hint: 'initial letters', input: 'text' },
        { name: 'b', type: 'str', hint: 'letters to add',  input: 'text' },
      ],
      template: 'from collections import Counter\nc = Counter({$a})\nc.update({$b})\nc',
      cases: [
        { id: 'add',  label: 'add',     values: { a: 'aab', b: 'abc' } },
        { id: 'none', label: 'nothing', values: { a: 'aab', b: '' } },
      ],
    },
    {
      id: 'subtract',
      label: 'subtract',
      blurb: 'Counts from the second text are taken away — results can reach zero or go negative.',
      params: [
        { name: 'a', type: 'str', hint: 'initial letters',   input: 'text' },
        { name: 'b', type: 'str', hint: 'letters to remove', input: 'text' },
      ],
      template: 'from collections import Counter\nc = Counter({$a})\nc.subtract({$b})\nc',
      cases: [
        { id: 'neg',  label: 'goes negative', values: { a: 'aab', b: 'abbc' } },
        { id: 'zero', label: 'to zero',       values: { a: 'ab', b: 'ab' } },
      ],
    },
    {
      id: 'minus',
      label: 'the - operator',
      blurb: 'For contrast: a - b builds a new Counter and keeps only positive counts.',
      params: [
        { name: 'a', type: 'str', hint: 'letters',          input: 'text' },
        { name: 'b', type: 'str', hint: 'letters to remove', input: 'text' },
      ],
      template: 'from collections import Counter\nCounter({$a}) - Counter({$b})',
      cases: [
        { id: 'neg',  label: 'same inputs', values: { a: 'aab', b: 'abbc' } },
        { id: 'zero', label: 'to zero',     values: { a: 'ab', b: 'ab' } },
      ],
    },
  ],
  demoExplainer: 'With "aab" minus "abbc", subtract() leaves a: 1, b: -1, c: -1 — every element it touched stays in the Counter. The - operator on the same inputs returns only a: 1, and when everything cancels it returns an empty Counter().',

  patterns: [
    {
      name: 'Count a stream in batches',
      desc: 'update() keeps adding to the running totals.',
      code: 'from collections import Counter\ntotals = Counter()\nfor batch in batches:\n    totals.update(batch)',
    },
    {
      name: 'Merge count dicts',
      desc: 'A mapping argument adds its values.',
      code: 'from collections import Counter\ninventory = Counter(apples=3)\ninventory.update({"apples": 2, "pears": 4})',
    },
    {
      name: 'Stock left after orders',
      desc: 'subtract keeps negatives, so shortages stay visible.',
      code: 'from collections import Counter\nstock.subtract(order)\nshort = {item: -n for item, n in stock.items() if n < 0}',
    },
  ],

  examples: [
    { title: 'update adds, it does not replace', code: "from collections import Counter\nc = Counter(a=1)\nc.update({'a': 5})\nc", returns: "Counter({'a': 6})" },
    { title: 'dict.update would replace',  code: "d = {'a': 1}\nd.update({'a': 5})\nd", returns: "{'a': 5}" },
    { title: 'Keyword counts',             code: 'from collections import Counter\nc = Counter()\nc.update(x=2, y=1)\nc', returns: "Counter({'x': 2, 'y': 1})" },
    { title: 'An iterable counts once per element', code: "from collections import Counter\nc = Counter(['a'])\nc.update(['a', 'b', 'a'])\nc", returns: "Counter({'a': 3, 'b': 1})" },
    { title: 'subtract keeps negatives',   code: "from collections import Counter\nc = Counter(a=4, b=2)\nc.subtract(a=1, b=5)\nc", returns: "Counter({'a': 3, 'b': -3})" },
    { title: 'Both return None',           code: "from collections import Counter\nprint(Counter().update('abc'))", returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Passing one word as a string',
      desc: 'update iterates its argument, so a str adds one count per character. Wrap a single element in a list.',
      wrong: { label: "update('cat')",   code: "from collections import Counter\nc = Counter()\nc.update('cat')\nc", output: "Counter({'c': 1, 'a': 1, 't': 1})" },
      fix:   { label: "update(['cat'])", code: "from collections import Counter\nc = Counter()\nc.update(['cat'])\nc", output: "Counter({'cat': 1})" },
    },
    {
      name: 'Assigning the result',
      desc: 'update and subtract return None; the Counter you called them on is the result.',
      wrong: { label: 'c = c.update(...)', code: "from collections import Counter\nc = Counter('ab')\nc = c.update('b')\nc is None", output: 'True' },
      fix:   { label: 'call, then use c',   code: "from collections import Counter\nc = Counter('ab')\nc.update('b')\nc", output: "Counter({'b': 2, 'a': 1})" },
    },
  ],

  when: {
    use: [
      'Accumulating counts over several inputs',
      'Inventory or budget arithmetic where negative results matter (subtract)',
    ],
    avoid: [
      'Replacing counts → c[key] = value (or dict.update semantics)',
      'Combining without keeping zero/negative results → the + and - operators',
    ],
  },

  notes: {
    cpython:        'Lib/collections/__init__.py — iterables go through the C helper _count_elements; mappings are added item by item (an empty Counter updated with a mapping just copies it)',
    'Versions':     'update since 3.1, subtract added in 3.2 (docs.python.org)',
    'Counts':       'Values may be any numbers; update/subtract never drop an element, even at 0',
  },

  related: [
    { name: 'Counter',       slug: 'counter',       when: 'The + - & | operators' },
    { name: 'Counter.total', slug: 'counter-total', when: 'Sum after updating' },
    { name: 'dict.update',   slug: 'dict-update',   when: 'The replacing version', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between Counter.update and dict.update?',
      a: 'dict.update overwrites values for existing keys. Counter.update adds the new counts to the existing ones, and an iterable argument counts its elements instead of expecting key/value pairs.',
    },
    {
      q: 'What is the difference between subtract() and the - operator?',
      a: 'subtract() changes the Counter in place and keeps every result, including 0 and negatives. a - b returns a new Counter containing only elements whose result is positive.',
    },
    {
      q: 'How do I merge two Counters?',
      a: 'a + b returns a new Counter with positive totals; a.update(b) adds b into a in place and keeps whatever counts result.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.Counter.update',
    meta:  'Counter.update',
  },
};
