// content/reference/python/stdlib/itertools/zip_longest.js

export const meta = {
  slug:        'zip_longest',
  name:        'itertools.zip_longest',
  signature:   'itertools.zip_longest(*iterables, fillvalue=None)',
  blurb:       'zip() that runs until the LONGEST input is exhausted, padding the shorter ones with fillvalue (None by default).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'itertools zip_longest izip_longest zip lists of different lengths pad fillvalue none zip without losing items python zip longest',
};

export const method = {
  slug:      'zip_longest',
  name:      'itertools.zip_longest',
  signature: 'itertools.zip_longest(*iterables, fillvalue=None)',
  returns:   { type: 'iterator of tuple', desc: 'One tuple per position up to the longest input; missing values are fillvalue.' },

  category:    'itertools function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'zip() silently drops the tail of the longer input. zip_longest keeps it and fills the gaps — choose a fillvalue that cannot be confused with real data.',

  covers: ['zip_longest'],

  cheat: {
    commonCall: "zip_longest(a, b, fillvalue='')",
    returns:    'tuples up to the longest input',
    replaces:   'manual padding of the shorter list',
    watchOut:   'an infinite input never ends — zip_longest(count(), …) runs forever',
  },

  parameters: [
    { name: '*iterables', type: 'iterable', required: false, default: null,   desc: 'The inputs, walked in parallel.' },
    { name: 'fillvalue',  type: 'object',   required: false, default: 'None', desc: 'Keyword-only. Used for every missing value (the same object each time).' },
  ],

  modes: [
    {
      id: 'pad',
      label: 'fillvalue',
      blurb: 'Pair two lists of different lengths, padding with your fill value.',
      params: [
        { name: 'a',    type: 'list[str]', hint: 'first list',  input: 'csv' },
        { name: 'b',    type: 'list[str]', hint: 'second list', input: 'csv' },
        { name: 'fill', type: 'str',       hint: 'fillvalue',   input: 'text' },
      ],
      template: 'from itertools import zip_longest\nlist(zip_longest({$a}, {$b}, fillvalue={$fill}))',
      cases: [
        { id: 'names', label: 'names + scores', values: { a: 'Ana, Ben, Cy', b: '90, 85', fill: '-' } },
        { id: 'equal', label: 'same length',    values: { a: 'x, y', b: '1, 2', fill: '?' } },
      ],
    },
    {
      id: 'compare',
      label: 'zip vs zip_longest',
      blurb: 'The same inputs through both. Note the default fill: None.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'first list',  input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'second list', input: 'csv' },
      ],
      template: 'from itertools import zip_longest\nlist(zip({$a}, {$b})), list(zip_longest({$a}, {$b}))',
      cases: [
        { id: 'uneven', label: 'uneven', values: { a: 'a, b, c', b: '1' } },
        { id: 'empty',  label: 'one empty', values: { a: 'a', b: '' } },
      ],
    },
    {
      id: 'columns',
      label: 'columns',
      blurb: 'Merge two text columns line by line.',
      params: [
        { name: 'left',  type: 'list[str]', hint: 'left column',  input: 'csv' },
        { name: 'right', type: 'list[str]', hint: 'right column', input: 'csv' },
      ],
      template: "from itertools import zip_longest\n[f'{l:<6}|{r}' for l, r in zip_longest({$left}, {$right}, fillvalue='')]",
      cases: [
        { id: 'menu', label: 'menu', values: { left: 'tea, coffee, juice', right: '2.50, 3.00' } },
      ],
    },
  ],
  demoExplainer: 'zip stops as soon as one input runs out; zip_longest stops only when every input has run out. With the default fillvalue the gaps are None — fine for display, risky when None is also a legitimate value in your data.',

  patterns: [
    {
      name: 'Compare two sequences position by position',
      desc: 'A missing item shows up as fillvalue instead of being skipped.',
      code: 'from itertools import zip_longest\nMISSING = object()\ndiffs = [i for i, (x, y) in enumerate(zip_longest(old, new, fillvalue=MISSING)) if x != y]',
    },
    {
      name: 'Chunk with padding',
      desc: 'The grouper recipe: fixed-size chunks, last one padded.',
      code: "from itertools import zip_longest\ndef grouper(iterable, n, fillvalue=None):\n    args = [iter(iterable)] * n\n    return zip_longest(*args, fillvalue=fillvalue)",
    },
  ],

  examples: [
    { title: 'Pad the shorter input',  code: "from itertools import zip_longest\nlist(zip_longest('abc', [1]))",                 returns: "[('a', 1), ('b', None), ('c', None)]" },
    { title: 'Custom fillvalue',       code: "from itertools import zip_longest\nlist(zip_longest('ab', 'xyz', fillvalue='-'))",  returns: "[('a', 'x'), ('b', 'y'), ('-', 'z')]" },
    { title: 'Three inputs',           code: 'from itertools import zip_longest\nlist(zip_longest([1, 2], [3], [4, 5, 6], fillvalue=0))', returns: '[(1, 3, 4), (2, 0, 5), (0, 0, 6)]' },
    { title: 'zip drops the tail',     code: "list(zip('abc', [1]))",                                                     returns: "[('a', 1)]" },
    { title: 'Padded chunks',          code: "from itertools import zip_longest\nit = iter('abcde')\nlist(zip_longest(it, it, fillvalue='_'))", returns: "[('a', 'b'), ('c', 'd'), ('e', '_')]" },
    { title: 'No inputs',              code: 'from itertools import zip_longest\nlist(zip_longest())',                           returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Passing fillvalue positionally',
      desc: 'A third positional argument is another iterable — a string fill value gets zipped character by character.',
      wrong: { label: 'positional', code: "from itertools import zip_longest\nlist(zip_longest('ab', 'x', '-'))", output: "[('a', 'x', '-'), ('b', None, None)]" },
      fix:   { label: 'keyword',    code: "from itertools import zip_longest\nlist(zip_longest('ab', 'x', fillvalue='-'))", output: "[('a', 'x'), ('b', '-')]" },
    },
    {
      name: 'A mutable fillvalue is shared',
      desc: 'The same object fills every gap.',
      wrong: { label: 'fillvalue=[]', code: 'from itertools import zip_longest\nrows = list(zip_longest([1, 2, 3], [9], fillvalue=[]))\nrows[1][1].append(0)\nrows[2][1]', output: '[0]' },
      fix:   { label: 'fill afterwards', code: 'from itertools import zip_longest\nrows = [(a, [] if b is None else b) for a, b in zip_longest([1, 2, 3], [9])]\nrows[1][1].append(0)\nrows[2][1]', output: '[]' },
    },
  ],

  when: {
    use: [
      'Parallel lists of possibly different lengths where nothing may be lost',
      'Side-by-side output and diffs',
    ],
    avoid: [
      'Equal lengths required → zip(a, b, strict=True) (3.10+) raises on a mismatch',
      'Truncation is fine → zip()',
    ],
  },

  notes: {
    cpython:    'zip_longest_next tracks how many inputs are still active and substitutes fillvalue for finished ones',
    'Versions': 'named izip_longest in Python 2.6/2.7; zip_longest since 3.0',
  },

  related: [
    { name: 'zip()',             slug: 'zip',       when: 'Stops at the shortest; strict=True checks lengths', category: 'functions' },
    { name: 'itertools.chain',   slug: 'chain',     when: 'One after another instead of side by side' },
    { name: 'itertools.batched', slug: 'batched',   when: 'Chunks without padding' },
    { name: 'itertools module',  slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I zip lists of different lengths in Python?',
      a: 'itertools.zip_longest(a, b, fillvalue=...) keeps going until the longest list is done, filling the gaps. Plain zip stops at the shortest list.',
    },
    {
      q: 'Why does zip_longest give None values?',
      a: 'None is the default fillvalue for positions where an input has run out. Pass fillvalue= to use something else.',
    },
    {
      q: 'What happened to izip_longest?',
      a: 'It was the Python 2 name. In Python 3 it is itertools.zip_longest (and izip became the built-in zip).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.zip_longest',
    meta:  'itertools.zip_longest',
  },
};
