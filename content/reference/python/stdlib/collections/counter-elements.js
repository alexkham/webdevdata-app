// content/reference/python/stdlib/collections/counter-elements.js

export const meta = {
  slug:        'counter-elements',
  name:        'Counter.elements',
  signature:   'Counter.elements()',
  blurb:       'An iterator that repeats each element as many times as its count — zero and negative counts are skipped.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'counter elements expand counts repeat element multiset to list iterator Counter.elements python collections',
};

export const method = {
  slug:      'counter-elements',
  name:      'Counter.elements',
  signature: 'Counter.elements()',
  returns:   { type: 'iterator', desc: 'Each element repeated count times, grouped, in insertion order.' },

  category:    'Counter method',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'The inverse of counting: turn {element: count} back into a stream of elements. Elements come out grouped in the order they were first inserted, not sorted and not in the original sequence order.',

  covers: ['Counter.elements'],

  cheat: {
    commonCall: "list(Counter(a=2, b=1).elements())",
    returns:    "['a', 'a', 'b'] — via an iterator",
    replaces:   '[k for k, n in d.items() for _ in range(n)]',
    watchOut:   'counts must be ints; a float count raises TypeError',
  },

  parameters: [],

  modes: [
    {
      id: 'expand',
      label: 'round trip',
      blurb: 'Count a text, then expand it again: same letters, grouped.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from collections import Counter\nlist(Counter({$text}).elements())',
      cases: [
        { id: 'banana', label: 'banana', values: { text: 'banana' } },
        { id: 'abcab',  label: 'abcab',  values: { text: 'abcab' } },
      ],
    },
    {
      id: 'counts',
      label: 'explicit counts',
      blurb: 'Pair keys with counts. Zero and negative counts produce nothing; a float count is an error.',
      params: [
        { name: 'keys',   type: 'list[str]',   hint: 'comma-separated keys',   input: 'csv' },
        { name: 'counts', type: 'list[number]', hint: 'comma-separated counts', input: 'csv-num' },
      ],
      template: 'from collections import Counter\nc = Counter(dict(zip({$keys}, {$counts})))\nlist(c.elements())',
      cases: [
        { id: 'pos',   label: 'positive',   values: { keys: 'x, y', counts: '3, 1' } },
        { id: 'neg',   label: 'zero & negative', values: { keys: 'x, y, z', counts: '2, 0, -4' } },
        { id: 'float', label: 'float count', values: { keys: 'x', counts: '1.5' } },
      ],
    },
  ],
  demoExplainer: '"banana" expands to b, a, a, a, n, n: all copies of an element sit together, in the order each element was first counted. elements() uses itertools.repeat under the hood, which is why a count of 1.5 fails with "\'float\' object cannot be interpreted as an integer".',

  patterns: [
    {
      name: 'Rebuild a sorted multiset',
      desc: 'sorted() gives a canonical order.',
      code: 'from collections import Counter\nsorted(Counter(tiles).elements())',
    },
    {
      name: 'Draw from weighted counts',
      desc: 'Materialise the population once, then sample from it.',
      code: 'import random\nfrom collections import Counter\npool = list(Counter(red=3, blue=1).elements())\nrandom.choice(pool)',
    },
    {
      name: 'What is left after removing another multiset',
      desc: 'Subtract with -, then expand.',
      code: 'from collections import Counter\nremaining = list((Counter(hand) - Counter(played)).elements())',
    },
  ],

  examples: [
    { title: 'Expand counts',                  code: "from collections import Counter\nlist(Counter(a=2, b=1).elements())", returns: "['a', 'a', 'b']" },
    { title: 'Grouped, not original order',    code: "from collections import Counter\n''.join(Counter('abab').elements())", returns: "'aabb'" },
    { title: 'Zero and negative counts skipped', code: "from collections import Counter\nlist(Counter(a=0, b=-1, c=2).elements())", returns: "['c', 'c']" },
    { title: 'It is an iterator',              code: "from collections import Counter\ntype(Counter('ab').elements()).__name__", returns: "'chain'" },
    { title: 'Sorted multiset',                code: "from collections import Counter\nsorted(Counter('banana').elements())", returns: "['a', 'a', 'a', 'b', 'n', 'n']" },
    { title: 'Float counts fail',              code: "from collections import Counter\nlist(Counter(a=1.5).elements())", returns: "TypeError: 'float' object cannot be interpreted as an integer" },
  ],

  pitfalls: [
    {
      name: 'Expecting the original sequence back',
      desc: 'A Counter only remembers how many, not where. elements() groups equal items.',
      wrong: { label: 'expects abab',  code: "from collections import Counter\n''.join(Counter('abab').elements()) == 'abab'", output: 'False' },
      fix:   { label: 'compare counts', code: "from collections import Counter\nCounter(Counter('abab').elements()) == Counter('abab')", output: 'True' },
    },
    {
      name: 'Printing the iterator',
      desc: 'elements() returns a lazy itertools.chain object; wrap it in list() to see the items.',
      wrong: { label: 'len(iterator)', code: "from collections import Counter\nlen(Counter('ab').elements())", output: "TypeError: object of type 'itertools.chain' has no len()" },
      fix:   { label: 'len(list(...))', code: "from collections import Counter\nlen(list(Counter('ab').elements()))", output: '2' },
    },
  ],

  when: {
    use: [
      'Turning counts back into items (for sorting, sampling, joining)',
      'Checking a multiset result element by element',
    ],
    avoid: [
      'Just the number of items → c.total()',
      'Huge counts → iterate c.items() instead of materialising millions of copies',
    ],
  },

  notes: {
    cpython:   'chain.from_iterable(starmap(repeat, self.items())) — itertools.repeat is why non-int counts raise TypeError and non-positive counts yield nothing',
    'Order':   'Elements are returned in the order first encountered (insertion order), each repeated its count',
  },

  related: [
    { name: 'Counter',        slug: 'counter',        when: 'Build the counts' },
    { name: 'Counter.total',  slug: 'counter-total',  when: 'How many elements() would yield (for positive counts)' },
    { name: 'sorted()',       slug: 'sorted',         when: 'Put the elements in order', category: 'functions' },
    { name: 'TypeError',      slug: 'typeerror',      when: 'Raised for non-integer counts', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I convert a Counter back to a list?',
      a: 'list(counter.elements()) repeats each element count times. list(counter) gives only the distinct elements (the keys).',
    },
    {
      q: 'Why does elements() skip some keys?',
      a: 'Elements with a count of zero or less are skipped — itertools.repeat(x, n) yields nothing when n <= 0.',
    },
    {
      q: 'Does elements() preserve the original order?',
      a: 'No. It yields all copies of the first-inserted element, then all copies of the next, and so on. The original interleaving is not stored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.Counter.elements',
    meta:  'Counter.elements',
  },
};
