// content/reference/python/functions/sum.js

export const meta = {
  slug:        'sum',
  name:        'sum',
  signature:   'sum(iterable, start=0)',
  blurb:       'Add the items of an iterable of numbers.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'sum total add accumulate numbers aggregate',
};

export const method = {
  slug:      'sum',
  name:      'sum',
  signature: 'sum(iterable, start=0)',
  returns:   { type: 'int | float', desc: 'start plus every item, left to right. Empty iterable returns start (0 by default).' },

  category:    'Built-in function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Total up a sequence of numbers — and only numbers; strings are refused on purpose.',

  cheat: {
    commonCall: 'sum(prices)',
    returns:    'int or float; empty input → start (0)',
    replaces:   'sum of an empty list is 0, never an error',
    watchOut:   'strings are rejected — join them instead',
  },

  parameters: [
    { name: 'iterable', type: 'iterable[number]', required: true,  default: null, desc: 'Numbers to add. Any iterable: list, tuple, generator, range.' },
    { name: 'start',    type: 'number',           required: false, default: '0',  desc: 'Added to the total; also the result for an empty iterable.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
    { name: 'start', type: 'int',  hint: 'added to total',          input: 'number-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default', values: { items: '1,2,3,4', start: '' } },
    { id: 'floats',  label: 'floats',  values: { items: '0.1,0.2', start: '' } },
    { id: 'start',   label: 'start=10', values: { items: '1,2,3',  start: 10 } },
    { id: 'empty',   label: 'empty',   values: { items: '',        start: '' } },
  ],
  demoExplainer: 'Adds left to right, starting from start. The floats case shows binary float reality: 0.1 + 0.2 is 0.30000000000000004 — exactly what Python prints. An empty iterable is not an error; it returns start.',

  patterns: [
    {
      name: 'Sum of transformed values',
      desc: 'A generator expression feeds sum without building a list.',
      code: 'total = sum(item.price for item in cart)',
    },
    {
      name: 'Counting matches',
      desc: 'True is 1 — summing booleans counts them.',
      code: 'n_even = sum(x % 2 == 0 for x in nums)',
    },
    {
      name: 'Precise money totals',
      desc: 'Floats drift; Decimal or integer cents do not.',
      code: 'total_cents = sum(item.cents for item in cart)',
    },
  ],

  examples: [
    { title: 'Sum a list',            code: 'sum([1, 2, 3, 4])',   returns: '10' },
    { title: 'Float drift',           code: 'sum([0.1, 0.2])',     returns: '0.30000000000000004' },
    { title: 'With a start value',    code: 'sum([1, 2, 3], 10)',  returns: '16' },
    { title: 'Empty is zero',         code: 'sum([])',             returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Strings are rejected on purpose',
      desc: 'Python blocks sum for strings because repeated + is quadratic — the error even names the fix.',
      wrong: { label: 'Raises', code: 'sum(["a", "b"], "")', output: "TypeError: sum() can't sum strings [use ''.join(seq) instead]" },
      fix:   { label: 'Fix', code: '"".join(["a", "b"])', output: "'ab'" },
    },
    {
      name: 'Float accumulation drifts',
      desc: 'Binary floats cannot represent most decimals; errors accumulate.',
      wrong: { label: 'Drift', code: 'sum([0.1] * 10)', output: '0.9999999999999999' },
      fix:   { label: 'Precise', code: 'import math\nmath.fsum([0.1] * 10)', output: '1.0' },
    },
    {
      name: 'Summing lists with start=[] is quadratic',
      desc: 'It works, but copies grow on every step — flatten differently.',
      wrong: { label: 'Slow', code: 'flat = sum(lists, [])', output: 'O(n²) copying' },
      fix:   { label: 'Fix', code: 'from itertools import chain\nflat = list(chain.from_iterable(lists))', output: 'O(n)' },
    },
  ],

  when: {
    use: [
      'Totals of numeric data',
      'Counting matches via boolean sums',
      'Generator-fed aggregation without temp lists',
    ],
    avoid: [
      'Strings → str.join',
      'Precise float totals → math.fsum',
      'Flattening lists → itertools.chain',
      'Products → math.prod',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'int stays int; any float makes it float',
    cpython:    'Python/bltinmodule.c :: builtin_sum (fast paths for int/float)',
    memory:     'No allocation with a generator input',
    threadSafe: 'Yes for the scan; the source should not mutate concurrently',
  },

  related: [
    { name: 'len',    slug: 'len',    when: 'Count instead of total: sum/len = mean' },
    { name: 'max',    slug: 'max',    when: 'The largest instead of the total' },
    { name: 'min',    slug: 'min',    when: 'The smallest instead of the total' },
    { name: 'round',  slug: 'round',  when: 'Round the drifted total' },
  ],

  faq: [
    {
      q: 'Why does sum refuse strings?',
      a: 'Repeated string + is O(n²); join is linear. The TypeError message literally tells you to use join — a deliberate guard rail.',
    },
    {
      q: 'How do I compute an average?',
      a: 'sum divided by len — or statistics.mean for more care.',
      code: 'avg = sum(xs) / len(xs)',
    },
    {
      q: 'Why is my float sum slightly off?',
      a: 'Binary floats cannot represent most decimal fractions exactly, and errors accumulate over additions. Use math.fsum for correctly-rounded float sums or Decimal for money.',
    },
  ],

  history: [
    { version: '2.3', note: 'sum() introduced, with the string rejection in place from day one.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#sum',
    meta:  'sum',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
