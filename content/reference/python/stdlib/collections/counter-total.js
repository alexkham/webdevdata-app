// content/reference/python/stdlib/collections/counter-total.js

export const meta = {
  slug:        'counter-total',
  name:        'Counter.total',
  signature:   'Counter.total()',
  blurb:       'The sum of all counts — negative counts included. New in Python 3.10.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'counter total sum of counts number of elements size of multiset Counter.total python collections 3.10',
};

export const method = {
  slug:      'counter-total',
  name:      'Counter.total',
  signature: 'Counter.total()',
  returns:   { type: 'int', desc: 'sum(self.values()) — every count, positive or not.' },

  category:    'Counter method',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'len(c) is the number of DISTINCT elements; c.total() is the number of elements counted. It is a plain sum, so negative counts pull it down.',

  covers: ['Counter.total'],

  cheat: {
    commonCall: "Counter('hello').total()",
    returns:    '5 — while len() is 4',
    replaces:   'sum(c.values())',
    watchOut:   'negative counts are summed too; +c drops them first',
  },

  parameters: [],

  modes: [
    {
      id: 'total',
      label: 'total vs len',
      blurb: 'Total counts every letter; len counts distinct letters.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from collections import Counter\nc = Counter({$text})\n(c.total(), len(c))',
      cases: [
        { id: 'hello', label: 'hello', values: { text: 'hello' } },
        { id: 'empty', label: 'empty', values: { text: '' } },
      ],
    },
    {
      id: 'signed',
      label: 'with negatives',
      blurb: 'After subtract() some counts can be negative. total() sums them; (+c).total() counts only what is left.',
      params: [
        { name: 'a', type: 'str', hint: 'letters',           input: 'text' },
        { name: 'b', type: 'str', hint: 'letters to remove', input: 'text' },
      ],
      template: 'from collections import Counter\nc = Counter({$a})\nc.subtract({$b})\n(c.total(), (+c).total())',
      cases: [
        { id: 'neg', label: 'overdrawn', values: { a: 'aab', b: 'bbbc' } },
        { id: 'ok',  label: 'partial',   values: { a: 'aabb', b: 'a' } },
      ],
    },
  ],
  demoExplainer: 'For "aab" minus "bbbc" the counts become a: 2, b: -2, c: -1, so total() is -1 while (+c).total() — only the positive counts — is 2.',

  patterns: [
    {
      name: 'Percentages',
      desc: 'Divide each count by the total.',
      code: 'from collections import Counter\nc = Counter(answers)\nshares = {k: n / c.total() for k, n in c.items()}',
    },
    {
      name: 'Ignore negative counts',
      desc: 'Unary + keeps only positive counts.',
      code: 'from collections import Counter\nin_stock = (+inventory).total()',
    },
  ],

  examples: [
    { title: 'Total vs distinct',          code: "from collections import Counter\nc = Counter('hello')\n(c.total(), len(c))", returns: '(5, 4)' },
    { title: 'Same as sum(values())',      code: 'from collections import Counter\nCounter(a=10, b=5, c=0).total()', returns: '15' },
    { title: 'Negative counts reduce it',  code: 'from collections import Counter\nCounter(a=3, b=-5).total()', returns: '-2' },
    { title: 'Empty counter',              code: 'from collections import Counter\nCounter().total()', returns: '0' },
    { title: 'Float counts give a float',  code: 'from collections import Counter\nCounter(a=0.5, b=2).total()', returns: '2.5' },
  ],

  pitfalls: [
    {
      name: 'Using len() for the number of items',
      desc: 'len() counts keys, not occurrences.',
      wrong: { label: 'len(c)',    code: "from collections import Counter\nlen(Counter(['x', 'x', 'x']))", output: '1' },
      fix:   { label: 'c.total()', code: "from collections import Counter\nCounter(['x', 'x', 'x']).total()", output: '3' },
    },
    {
      name: 'Counting shortages as stock',
      desc: 'After subtract(), total() nets negatives against positives.',
      wrong: { label: 'c.total()',    code: 'from collections import Counter\nc = Counter(apples=5)\nc.subtract(pears=2)\nc.total()', output: '3' },
      fix:   { label: '(+c).total()', code: 'from collections import Counter\nc = Counter(apples=5)\nc.subtract(pears=2)\n(+c).total()', output: '5' },
    },
  ],

  when: {
    use: [
      'Number of counted items (sample size)',
      'Normalising counts to proportions',
    ],
    avoid: [
      'Python before 3.10 → sum(c.values())',
      'Number of distinct elements → len(c)',
    ],
  },

  notes: {
    cpython:    'return sum(self.values()) — in Lib/collections/__init__.py',
    'Versions': 'Added in Python 3.10 (docs.python.org)',
  },

  related: [
    { name: 'Counter',         slug: 'counter',          when: 'Unary + to drop negative counts' },
    { name: 'Counter.elements', slug: 'counter-elements', when: 'The items themselves' },
    { name: 'sum()',           slug: 'sum',              when: 'What total() calls', category: 'functions' },
    { name: 'len()',           slug: 'len',              when: 'Distinct elements instead', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the total count of a Counter?',
      a: 'counter.total() on Python 3.10+, or sum(counter.values()) on any version. len(counter) is the number of distinct elements.',
    },
    {
      q: 'Does total() ignore negative counts?',
      a: 'No — it is a plain sum of the values. Use (+counter).total() to count only positive entries.',
    },
    {
      q: "Why do I get AttributeError: 'Counter' object has no attribute 'total'?",
      a: 'total() was added in Python 3.10. On older versions use sum(counter.values()).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.Counter.total',
    meta:  'Counter.total',
  },
};
