// content/reference/python/stdlib/collections/counter.js

export const meta = {
  slug:        'counter',
  name:        'collections.Counter',
  signature:   'collections.Counter(iterable=None, /, **kwds)',
  blurb:       'A dict subclass that counts hashable things: element → count, missing elements count as 0, and counters add, subtract and compare like multisets.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.1+',
  searchTerms: 'counter python collections.Counter count occurrences frequency word count letter count histogram multiset bag tally Counter.copy Counter.fromkeys counter arithmetic add subtract intersection union',
};

export const method = {
  slug:      'counter',
  name:      'collections.Counter',
  signature: 'collections.Counter(iterable=None, /, **kwds)',
  returns:   { type: 'Counter', desc: 'A new counter: each distinct element maps to how many times it was seen.' },

  category:    'collections class',
  version:     'Python 3.1+',
  hasLiveDemo: true,

  subtitle: 'Hand it an iterable and it counts; hand it a mapping and it takes the counts as given. Reading a missing element gives 0 instead of KeyError, and + - & | work on whole counters.',

  covers: ['Counter', 'Counter.copy', 'Counter.fromkeys'],

  cheat: {
    commonCall: "Counter('mississippi')",
    returns:    "Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})",
    replaces:   'the "if key in d: d[key] += 1 else: d[key] = 1" loop',
    watchOut:   'a str is counted letter by letter — split it for words',
  },

  parameters: [
    { name: 'iterable', type: 'iterable | mapping', required: false, default: 'None', desc: 'Elements to count, or a mapping of element → count (taken as-is, zero and negative counts included).' },
    { name: '**kwds',   type: 'int',                required: false, default: null,   desc: 'Counts given as keyword arguments: Counter(a=2, b=1).' },
  ],

  modes: [
    {
      id: 'count',
      label: 'count',
      blurb: 'Count the characters of any text. The repr lists elements from most to least common.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'from collections import Counter\nCounter({$text})',
      cases: [
        { id: 'miss',  label: 'mississippi', values: { text: 'mississippi' } },
        { id: 'space', label: 'with spaces', values: { text: 'a b a' } },
        { id: 'empty', label: 'empty',       values: { text: '' } },
      ],
    },
    {
      id: 'arith',
      label: '+ - & |',
      blurb: 'Counter arithmetic: add, subtract (never below zero), intersection (min) and union (max).',
      params: [
        { name: 'a', type: 'str', hint: 'letters for a', input: 'text' },
        { name: 'b', type: 'str', hint: 'letters for b', input: 'text' },
      ],
      template: 'from collections import Counter\na = Counter({$a})\nb = Counter({$b})\n[a + b, a - b, a & b, a | b]',
      cases: [
        { id: 'overlap', label: 'overlap',  values: { a: 'aaab', b: 'abcc' } },
        { id: 'same',    label: 'same',     values: { a: 'xy', b: 'xy' } },
        { id: 'none',    label: 'disjoint', values: { a: 'aa', b: 'b' } },
      ],
    },
    {
      id: 'missing',
      label: 'missing key',
      blurb: 'Indexing a missing element returns 0 and does not add it.',
      params: [
        { name: 'text', type: 'str', hint: 'text to count', input: 'text' },
        { name: 'key',  type: 'str', hint: 'element to look up', input: 'text' },
      ],
      template: 'from collections import Counter\nc = Counter({$text})\n(c[{$key}], {$key} in c, len(c))',
      cases: [
        { id: 'present', label: 'present', values: { text: 'banana', key: 'a' } },
        { id: 'absent',  label: 'absent',  values: { text: 'banana', key: 'z' } },
      ],
    },
  ],
  demoExplainer: 'In the repr, equal counts keep first-seen order: for "mississippi", i and s both appear 4 times and i comes first because it is met first. Subtraction and intersection drop anything that ends at zero or below, which is why a - b for "same" is an empty Counter(). A missing key reads as 0 but "key in c" stays False and len(c) does not grow.',

  patterns: [
    {
      name: 'Word frequencies',
      desc: 'Split first — a Counter over a str counts characters.',
      code: 'from collections import Counter\nfreq = Counter(text.lower().split())\nfreq.most_common(5)',
    },
    {
      name: 'Count by a derived key',
      desc: 'Feed a generator expression.',
      code: 'from collections import Counter\nby_ext = Counter(name.rsplit(".", 1)[-1] for name in filenames)',
    },
    {
      name: 'Is one multiset inside another?',
      desc: 'Rich comparisons (3.10+) treat missing elements as zero.',
      code: 'from collections import Counter\ncan_build = Counter(word) <= Counter(letters)',
    },
    {
      name: 'Merge counts from several sources',
      desc: 'sum() with a Counter start value, or update() in a loop.',
      code: 'from collections import Counter\ntotal = sum((Counter(batch) for batch in batches), Counter())',
    },
  ],

  examples: [
    { title: 'Count words',                    code: "from collections import Counter\nCounter('to be or not to be'.split())", returns: "Counter({'to': 2, 'be': 2, 'or': 1, 'not': 1})" },
    { title: 'Counts from keyword arguments',  code: 'from collections import Counter\nCounter(apples=3, pears=1)', returns: "Counter({'apples': 3, 'pears': 1})" },
    { title: 'A mapping is taken as-is',       code: "from collections import Counter\nCounter({'a': 0, 'b': -2})", returns: "Counter({'a': 0, 'b': -2})" },
    { title: 'Add two counters',               code: "from collections import Counter\nCounter('aab') + Counter('abc')", returns: "Counter({'a': 3, 'b': 2, 'c': 1})" },
    { title: 'Anagram check',                  code: "from collections import Counter\nCounter('listen') == Counter('silent')", returns: 'True' },
    { title: 'Unary + drops zero and negative counts', code: "from collections import Counter\n+Counter({'a': 2, 'b': 0, 'c': -1})", returns: "Counter({'a': 2})" },
    { title: 'del never raises',               code: "from collections import Counter\nc = Counter('ab')\ndel c['zzz']\nc", returns: "Counter({'a': 1, 'b': 1})" },
    { title: 'fromkeys is deliberately disabled', code: "from collections import Counter\nCounter.fromkeys('abc')", returns: 'NotImplementedError: Counter.fromkeys() is undefined.  Use Counter(iterable) instead.' },
  ],

  pitfalls: [
    {
      name: 'Counting a string when you meant words',
      desc: 'A str is an iterable of characters.',
      wrong: { label: 'Counter(text)',         code: "from collections import Counter\nCounter('hi hi').most_common(1)", output: "[('h', 2)]" },
      fix:   { label: 'Counter(text.split())', code: "from collections import Counter\nCounter('hi hi'.split()).most_common(1)", output: "[('hi', 2)]" },
    },
    {
      name: 'Expecting subtraction to go negative',
      desc: 'The - operator keeps only positive counts. subtract() keeps zero and negative results.',
      wrong: { label: 'a - b',        code: "from collections import Counter\nCounter(a=1) - Counter(a=3)", output: 'Counter()' },
      fix:   { label: 'a.subtract(b)', code: "from collections import Counter\nc = Counter(a=1)\nc.subtract(Counter(a=3))\nc", output: "Counter({'a': -2})" },
    },
    {
      name: 'Adding a plain dict',
      desc: 'Counter arithmetic needs Counter on both sides; update() accepts any mapping.',
      wrong: { label: 'c + dict',     code: "from collections import Counter\nCounter(a=1) + {'a': 1}", output: "TypeError: unsupported operand type(s) for +: 'Counter' and 'dict'" },
      fix:   { label: 'c.update(dict)', code: "from collections import Counter\nc = Counter(a=1)\nc.update({'a': 1})\nc", output: "Counter({'a': 2})" },
    },
  ],

  when: {
    use: [
      'Counting occurrences of anything hashable',
      'Top-N rankings with most_common()',
      'Multiset maths: combining, differencing, subset tests',
    ],
    avoid: [
      'Counting a single value in a list → list.count(x)',
      'Weighted or fractional tallies with negative values you want kept through + and - → a plain dict',
    ],
  },

  notes: {
    cpython:      'Lib/collections/__init__.py; counting an iterable uses the C helper _count_elements from Modules/_collectionsmodule.c',
    'repr order': 'repr() lists items in most_common() order — highest count first, ties in insertion order',
    'Missing keys': '__missing__ returns 0 without inserting; del of a missing key is silently ignored',
    'copy()':     'Returns a new Counter with the same counts (a shallow copy); fromkeys() raises NotImplementedError',
  },

  related: [
    { name: 'Counter.most_common', slug: 'counter-most_common', when: 'Rank elements by count' },
    { name: 'Counter.update / subtract', slug: 'counter-update', when: 'Add or remove counts in place' },
    { name: 'Counter.elements', slug: 'counter-elements', when: 'Expand counts back into elements' },
    { name: 'Counter.total',    slug: 'counter-total',    when: 'Sum of all counts' },
    { name: 'defaultdict',      slug: 'defaultdict',      when: 'defaultdict(int) is the manual version' },
    { name: 'list.count',       slug: 'list-count',       when: 'Count one value in a list', category: 'functions' },
    { name: 'dict',             slug: 'dict',             when: 'Counter is a dict subclass', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I count occurrences of items in a list in Python?',
      a: 'collections.Counter(my_list) returns a dict-like object mapping each item to its count; counter.most_common(n) gives the n most frequent. For a single item, my_list.count(item) is enough.',
    },
    {
      q: 'Why does my Counter not raise KeyError?',
      a: 'Counter defines __missing__ to return 0, so c["absent"] is 0. The lookup does not insert the key, so "absent" in c stays False.',
    },
    {
      q: 'Why do zero counts disappear after + or -?',
      a: 'The binary operators and unary +/- keep only elements with a positive result. Use update() or subtract() when you want every count kept, including zero and negative ones.',
    },
    {
      q: 'Does Counter count in pure Python?',
      a: 'No. Counter(iterable) and update(iterable) hand the counting loop to _count_elements, a C function in the _collections module, instead of running a Python-level for loop.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.Counter',
    meta:  'collections.Counter',
  },
};
