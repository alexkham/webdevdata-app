// content/reference/python/stdlib/itertools/accumulate.js

export const meta = {
  slug:        'accumulate',
  name:        'itertools.accumulate',
  signature:   'itertools.accumulate(iterable[, function, *, initial=None])',
  blurb:       'Running totals — or running max, product, anything — yielding every intermediate result, not just the final one.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'itertools accumulate running total cumulative sum prefix sum running max running product scan python cumsum initial',
};

export const method = {
  slug:      'accumulate',
  name:      'itertools.accumulate',
  signature: 'itertools.accumulate(iterable, func=None, *, initial=None)',
  returns:   { type: 'iterator', desc: 'Yields the first item (or initial), then func(previous_result, next_item) for every following item.' },

  category:    'itertools function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'reduce() gives you only the end result; accumulate() gives you every step on the way there. The default operation is +, so the plain call is a running sum.',

  covers: ['accumulate'],

  cheat: {
    commonCall: 'list(accumulate([1, 2, 3]))',
    returns:    '[1, 3, 6] — one result per input item',
    replaces:   'a loop that appends total += x to a list',
    watchOut:   'initial= adds one extra item at the front',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true,  default: null,   desc: 'The items to combine, left to right.' },
    { name: 'func',     type: 'callable', required: false, default: 'None', desc: 'Two-argument function (running_result, item) → new result. None means addition. max, min and operator.mul are common choices. (Named function in the docs; positional use is normal.)' },
    { name: 'initial',  type: 'object',   required: false, default: 'None', desc: 'Keyword-only (3.8+). A starting value yielded first, so the output is one item longer than the input.' },
  ],

  modes: [
    {
      id: 'sum',
      label: 'running sum',
      blurb: 'The default operation is +. Each output is the sum of everything so far.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from itertools import accumulate\nlist(accumulate({$nums}))',
      cases: [
        { id: 'ints',   label: 'ints',        values: { nums: '3, 1, 4, 1, 5' } },
        { id: 'floats', label: 'float drift', values: { nums: '0.1, 0.2, 0.3' } },
        { id: 'empty',  label: 'empty',       values: { nums: '' } },
      ],
    },
    {
      id: 'max',
      label: 'running max',
      blurb: 'Pass max as the function: each output is the largest value seen so far.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' }],
      template: 'from itertools import accumulate\nlist(accumulate({$nums}, max))',
      cases: [
        { id: 'prices', label: 'record highs', values: { nums: '5, 3, 8, 6, 9, 2' } },
        { id: 'down',   label: 'falling',      values: { nums: '9, 7, 4' } },
      ],
    },
    {
      id: 'initial',
      label: 'initial=',
      blurb: 'initial is yielded first and used as the starting total — the output gets one extra item.',
      params: [
        { name: 'nums',  type: 'list[int | float]', hint: 'comma-separated numbers', input: 'csv-num' },
        { name: 'start', type: 'int',               hint: 'initial value',           input: 'number' },
      ],
      template: 'from itertools import accumulate\nlist(accumulate({$nums}, initial={$start}))',
      cases: [
        { id: 'balance', label: 'bank balance', values: { nums: '50, -20, 10', start: '100' } },
        { id: 'empty',   label: 'empty input',  values: { nums: '', start: '0' } },
      ],
    },
  ],
  demoExplainer: 'The float case shows that accumulate adds one step at a time, so binary rounding shows up in the running values: 0.1, then 0.30000000000000004, then 0.6000000000000001. With initial= an empty input still yields one item — the initial value itself; without it, an empty input yields nothing.',

  patterns: [
    {
      name: 'Prefix sums for range queries',
      desc: 'With initial=0, sum(nums[i:j]) is prefix[j] - prefix[i].',
      code: 'from itertools import accumulate\nprefix = list(accumulate(nums, initial=0))\ntotal = prefix[j] - prefix[i]',
    },
    {
      name: 'Running product',
      desc: 'operator.mul turns accumulate into factorials, compound growth and so on.',
      code: 'from itertools import accumulate\nimport operator\ngrowth = list(accumulate(rates, operator.mul))',
    },
    {
      name: 'Cumulative weights for bisect',
      desc: 'A running sum of weights, searched with bisect, picks items by weight.',
      code: 'from itertools import accumulate\nfrom bisect import bisect\ncum = list(accumulate(weights))\nitem = items[bisect(cum, x)]',
    },
  ],

  examples: [
    { title: 'Running sum',               code: 'from itertools import accumulate\nlist(accumulate([1, 2, 3, 4]))',                 returns: '[1, 3, 6, 10]' },
    { title: 'Running max',               code: 'from itertools import accumulate\nlist(accumulate([2, 7, 1, 8], max))',            returns: '[2, 7, 7, 8]' },
    { title: 'Running product',           code: 'from itertools import accumulate\nimport operator\nlist(accumulate([1, 2, 3, 4, 5], operator.mul))', returns: '[1, 2, 6, 24, 120]' },
    { title: 'initial= adds a first item', code: 'from itertools import accumulate\nlist(accumulate([1, 2, 3], initial=100))',     returns: '[100, 101, 103, 106]' },
    { title: 'Works on strings (+ is concatenation)', code: "from itertools import accumulate\nlist(accumulate('abc'))",          returns: "['a', 'ab', 'abc']" },
    { title: 'Mixed types fail on +',     code: "from itertools import accumulate\nlist(accumulate([1, 'a']))",                   returns: "TypeError: unsupported operand type(s) for +: 'int' and 'str'" },
  ],

  pitfalls: [
    {
      name: 'Using reduce when you need the steps',
      desc: 'functools.reduce returns only the final value. accumulate yields every intermediate one — its last item is what reduce would return.',
      wrong: { label: 'reduce',     code: 'from functools import reduce\nreduce(lambda a, b: a + b, [5, 10, 20])', output: '35' },
      fix:   { label: 'accumulate', code: 'from itertools import accumulate\nlist(accumulate([5, 10, 20]))', output: '[5, 15, 35]' },
    },
    {
      name: 'Passing initial positionally',
      desc: 'The second positional argument is the function, not the start value — an int there is called as a function on the first addition.',
      wrong: { label: 'positional', code: 'from itertools import accumulate\nlist(accumulate([1, 2, 3], 100))', output: "TypeError: 'int' object is not callable" },
      fix:   { label: 'keyword',    code: 'from itertools import accumulate\nlist(accumulate([1, 2, 3], initial=100))', output: '[100, 101, 103, 106]' },
    },
  ],

  when: {
    use: [
      'Running totals, balances, prefix sums',
      'Running max/min (record highs, best-so-far)',
      'Any fold where you want every intermediate state',
    ],
    avoid: [
      'Only the final value → sum(), max(), or functools.reduce',
      'Exact float sums → math.fsum on the whole list',
    ],
  },

  notes: {
    cpython:     'accumulate_next in Modules/itertoolsmodule.c; func=None uses PyNumber_Add (the + operator)',
    'Versions':  'Added in 3.2; the func argument in 3.3; initial= in 3.8',
    'Laziness':  'Each result is computed only when requested, so it works on infinite iterators',
  },

  related: [
    { name: 'functools.reduce', slug: 'reduce', when: 'Only the final value', category: 'stdlib/functools' },
    { name: 'sum()',            slug: 'sum',    when: 'The final total of a running sum', category: 'functions' },
    { name: 'max()',            slug: 'max',    when: 'A common func for running maxima', category: 'functions' },
    { name: 'itertools.pairwise', slug: 'pairwise', when: 'The reverse: differences between neighbours' },
    { name: 'itertools module', slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I compute a cumulative sum in Python without numpy?',
      a: 'list(itertools.accumulate(numbers)). Add initial=0 to get a prefix-sum list that starts with 0 and has one more item than the input.',
    },
    {
      q: 'What is the difference between accumulate and reduce?',
      a: 'Both fold a sequence with a two-argument function from left to right. reduce returns only the final value; accumulate is an iterator over every intermediate result, and its last item equals the reduce result.',
    },
    {
      q: 'Can accumulate do something other than addition?',
      a: 'Yes — pass any two-argument function as the second argument: max, min, operator.mul, or a lambda. The function receives (running_result, next_item).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.accumulate',
    meta:  'itertools.accumulate',
  },
};
