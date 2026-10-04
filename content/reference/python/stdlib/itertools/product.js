// content/reference/python/stdlib/itertools/product.js

export const meta = {
  slug:        'product',
  name:        'itertools.product',
  signature:   'itertools.product(*iterables, repeat=1)',
  blurb:       'The Cartesian product: every tuple that takes one item from each input — nested for-loops in a single call.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'itertools product cartesian product nested loops all combinations of lists repeat every combination of two lists grid coordinates brute force python repeat argument cannot be negative',
};

export const method = {
  slug:      'product',
  name:      'itertools.product',
  signature: 'itertools.product(*iterables, repeat=1)',
  returns:   { type: 'iterator of tuple', desc: 'One tuple per combination, the rightmost input advancing fastest — like an odometer.' },

  category:    'itertools function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'product(A, B) is the same as ((a, b) for a in A for b in B). repeat=n multiplies the inputs with themselves, so product("01", repeat=3) counts in binary.',

  covers: ['product'],

  cheat: {
    commonCall: 'product(sizes, colors)',
    returns:    '(size, color) tuples, last input fastest',
    replaces:   'nested for-loops of fixed depth',
    watchOut:   'repeat must be passed by keyword',
  },

  parameters: [
    { name: '*iterables', type: 'iterable', required: false, default: null, desc: 'Each input is read completely into a tuple when product() is called — so infinite iterators hang.' },
    { name: 'repeat',     type: 'int',      required: false, default: '1',  desc: 'Keyword-only. Use the inputs this many times: product(A, repeat=2) is product(A, A). Must be >= 0.' },
  ],

  modes: [
    {
      id: 'pairs',
      label: 'two inputs',
      blurb: 'Every (a, b) pair. The second input changes fastest.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'first list',  input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'second list', input: 'csv' },
      ],
      template: 'from itertools import product\nlist(product({$a}, {$b}))',
      cases: [
        { id: 'shirts', label: 'sizes × colours', values: { a: 'S, M', b: 'red, blue, black' } },
        { id: 'empty',  label: 'one empty',       values: { a: 'S, M', b: '' } },
      ],
    },
    {
      id: 'repeat',
      label: 'repeat=',
      blurb: 'All strings of length n over an alphabet — the input used n times.',
      params: [
        { name: 'alphabet', type: 'str', hint: 'characters to use', input: 'text' },
        { name: 'n',        type: 'int', hint: 'length',            input: 'number' },
      ],
      template: "from itertools import product\n[''.join(p) for p in product({$alphabet}, repeat={$n})]",
      cases: [
        { id: 'bin',  label: 'binary, 3 bits', values: { alphabet: '01', n: '3' } },
        { id: 'zero', label: 'repeat=0',       values: { alphabet: 'ab', n: '0' } },
        { id: 'neg',  label: 'repeat=-1',      values: { alphabet: 'ab', n: '-1' } },
      ],
    },
    {
      id: 'grid',
      label: 'grid',
      blurb: 'Coordinates of a width × height grid, row by row.',
      params: [
        { name: 'w', type: 'int', hint: 'width',  input: 'number' },
        { name: 'h', type: 'int', hint: 'height', input: 'number' },
      ],
      template: 'from itertools import product\nlist(product(range({$h}), range({$w})))',
      cases: [
        { id: 'g32', label: '3 × 2', values: { w: '3', h: '2' } },
        { id: 'g0',  label: 'width 0', values: { w: '0', h: '4' } },
      ],
    },
  ],
  demoExplainer: 'The rightmost input cycles fastest, exactly like the innermost loop of nested for statements. If ANY input is empty there are no results at all. repeat=0 multiplies nothing, which leaves one empty product — the single result \'\' — while a negative repeat raises "repeat argument cannot be negative". (The browser demo stops at 100,000 results.)',

  patterns: [
    {
      name: 'Flatten nested loops',
      desc: 'One loop, one level of indentation.',
      code: 'from itertools import product\nfor lr, batch, depth in product([0.1, 0.01], [32, 64], [2, 4, 8]):\n    train(lr, batch, depth)',
    },
    {
      name: 'Every combination of options (dict of lists)',
      desc: 'Turn a parameter grid into a list of dicts.',
      code: 'from itertools import product\ngrid = {"size": ["S", "M"], "color": ["red", "blue"]}\nvariants = [dict(zip(grid, values)) for values in product(*grid.values())]',
    },
    {
      name: 'Brute-force a short code',
      desc: 'repeat= gives all fixed-length strings over an alphabet.',
      code: 'from itertools import product\nimport string\nfor chars in product(string.digits, repeat=4):\n    if check("".join(chars)):\n        break',
    },
  ],

  examples: [
    { title: 'Two lists',                 code: "from itertools import product\nlist(product([1, 2], 'ab'))",                    returns: "[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]" },
    { title: 'repeat= counts like an odometer', code: "from itertools import product\n[''.join(p) for p in product('01', repeat=2)]", returns: "['00', '01', '10', '11']" },
    { title: 'Same as a nested comprehension', code: "from itertools import product\nlist(product('ab', 'xy')) == [(a, b) for a in 'ab' for b in 'xy']", returns: 'True' },
    { title: 'No inputs: one empty tuple', code: 'from itertools import product\nlist(product())',                               returns: '[()]' },
    { title: 'Any empty input: nothing',  code: "from itertools import product\nlist(product('ab', []))",                         returns: '[]' },
    { title: 'Result count',              code: "from itertools import product\nlen(list(product('abc', repeat=3)))",              returns: '27' },
    { title: 'Negative repeat',           code: "from itertools import product\nproduct('ab', repeat=-1)",                       returns: 'ValueError: repeat argument cannot be negative' },
  ],

  pitfalls: [
    {
      name: 'Passing repeat positionally',
      desc: 'A bare number is taken as another iterable — and an int is not iterable.',
      wrong: { label: 'product(xs, 2)',        code: "from itertools import product\nproduct('ab', 2)",              output: "TypeError: 'int' object is not iterable" },
      fix:   { label: 'product(xs, repeat=2)', code: "from itertools import product\nlen(list(product('ab', repeat=2)))", output: '4' },
    },
    {
      name: 'Passing a list of lists as one argument',
      desc: 'product(groups) sees ONE input, so every tuple has a single element. Unpack with *.',
      wrong: { label: 'product(groups)',  code: "from itertools import product\ngroups = [[1, 2], ['a', 'b']]\nlist(product(groups))",  output: "[([1, 2],), (['a', 'b'],)]" },
      fix:   { label: 'product(*groups)', code: "from itertools import product\ngroups = [[1, 2], ['a', 'b']]\nlist(product(*groups))", output: "[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]" },
    },
  ],

  when: {
    use: [
      'Replacing nested loops over independent inputs',
      'Parameter grids, test matrices, all variants of a product',
      'All fixed-length strings over an alphabet (repeat=)',
    ],
    avoid: [
      'No repeats and order does not matter → combinations',
      'No repeats and order matters → permutations',
      'Inner loop depends on the outer value → write the loops',
    ],
  },

  notes: {
    cpython:    'product_new in Modules/itertoolsmodule.c turns every input into a tuple first; product_next advances an index array from the right',
    'Count':    'len(A) × len(B) × … , raised to the power repeat',
    'Infinite': 'Because inputs are fully read first, product(count(), ...) never returns',
  },

  related: [
    { name: 'itertools.combinations', slug: 'combinations', when: 'Unordered selections without repeats' },
    { name: 'itertools.permutations', slug: 'permutations', when: 'Orderings without repeats' },
    { name: 'zip()',                  slug: 'zip',          when: 'Pair items by position instead of all-with-all', category: 'functions' },
    { name: 'for',                    slug: 'for',          when: 'The nested loops product replaces', category: 'keywords' },
    { name: 'itertools module',       slug: 'itertools',    when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get every combination of two lists in Python?',
      a: 'list(itertools.product(list1, list2)) gives every (a, b) pair. For a list of lists of unknown length, unpack it: product(*lists).',
    },
    {
      q: 'What does repeat do in itertools.product?',
      a: 'It reuses the inputs: product(A, repeat=3) equals product(A, A, A). It must be given as a keyword; product(A, 3) treats 3 as another iterable and fails.',
    },
    {
      q: 'Is itertools.product faster than nested loops?',
      a: 'The loop overhead is moved into C, which helps a little; the main benefits are flat code and a depth that can be decided at run time with product(*lists).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.product',
    meta:  'itertools.product',
  },
};
