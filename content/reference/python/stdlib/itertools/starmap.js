// content/reference/python/stdlib/itertools/starmap.js

export const meta = {
  slug:        'starmap',
  name:        'itertools.starmap',
  signature:   'itertools.starmap(function, iterable)',
  blurb:       'map() for argument tuples: calls function(*args) for every tuple, so pairs and records unpack straight into parameters.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'itertools starmap map with multiple arguments unpack tuples apply function to list of tuples star map python starmap vs map',
};

export const method = {
  slug:      'starmap',
  name:      'itertools.starmap',
  signature: 'itertools.starmap(function, iterable)',
  returns:   { type: 'iterator', desc: 'function(*args) for each args in iterable.' },

  category:    'itertools function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'map(f, xs, ys) zips separate argument lists; starmap(f, pairs) takes arguments that are already grouped. The difference is f(a, b) versus f((a, b)).',

  covers: ['starmap'],

  cheat: {
    commonCall: 'starmap(pow, [(2, 5), (3, 2)])',
    returns:    '32, 9 (lazily)',
    replaces:   '[f(*args) for args in rows]',
    watchOut:   'every item must itself be iterable',
  },

  parameters: [
    { name: 'function', type: 'callable', required: true, default: null, desc: 'Called with each item unpacked as positional arguments.' },
    { name: 'iterable', type: 'iterable of iterables', required: true, default: null, desc: 'Each item is an argument tuple (any iterable works).' },
  ],

  modes: [
    {
      id: 'mul',
      label: 'multiply pairs',
      blurb: 'zip builds (a, b) pairs; starmap unpacks each pair into mul(a, b).',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'first numbers',  input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'second numbers', input: 'csv-num' },
      ],
      template: 'from itertools import starmap\nfrom operator import mul\nlist(starmap(mul, zip({$a}, {$b})))',
      cases: [
        { id: 'prices', label: 'price × qty',  values: { a: '2.5, 10, 4', b: '4, 3, 2' } },
        { id: 'short',  label: 'uneven lists', values: { a: '1, 2, 3', b: '10' } },
      ],
    },
    {
      id: 'format',
      label: 'format pairs',
      blurb: 'A bound method works as the function too: each pair fills both {} fields.',
      params: [
        { name: 'keys',   type: 'list[str]', hint: 'names',  input: 'csv' },
        { name: 'values', type: 'list[str]', hint: 'values', input: 'csv' },
      ],
      template: "from itertools import starmap\nlist(starmap('{}={}'.format, zip({$keys}, {$values})))",
      cases: [
        { id: 'query', label: 'query string', values: { keys: 'page, sort', values: '2, asc' } },
      ],
    },
  ],
  demoExplainer: 'zip stops at the shorter list, so uneven inputs simply give fewer results. 2.5 × 4 is the float 10.0, while int × int stays an int. starmap itself never pads or checks lengths — it unpacks whatever each item holds.',

  patterns: [
    {
      name: 'Apply a function to rows',
      desc: 'Records as tuples go straight into a function\'s parameters.',
      code: 'from itertools import starmap\nusers = list(starmap(User, rows))  # rows: [(name, email), ...]',
    },
    {
      name: 'Dict items',
      desc: 'items() yields (key, value) pairs ready to unpack.',
      code: "from itertools import starmap\nlines = list(starmap('{}: {}'.format, settings.items()))",
    },
  ],

  examples: [
    { title: 'Powers from pairs',        code: 'from itertools import starmap\nlist(starmap(pow, [(2, 5), (3, 2), (10, 3)]))', returns: '[32, 9, 1000]' },
    { title: 'Same as a comprehension',  code: 'from itertools import starmap\npairs = [(1, 2), (3, 4)]\nlist(starmap(max, pairs)) == [max(*p) for p in pairs]', returns: 'True' },
    { title: 'map takes separate lists', code: 'list(map(pow, [2, 3], [5, 2]))',                                       returns: '[32, 9]' },
    { title: 'Any iterable as arguments', code: "from itertools import starmap\nlist(starmap(min, ['bca', 'zy']))",     returns: "['a', 'y']" },
    { title: 'Items must be iterable',   code: 'from itertools import starmap\nlist(starmap(abs, [-1]))',                returns: "TypeError: 'int' object is not iterable" },
  ],

  pitfalls: [
    {
      name: 'Using map with argument tuples',
      desc: 'map passes each tuple as ONE argument.',
      wrong: { label: 'map',     code: 'list(map(pow, [(2, 5), (3, 2)]))',                              output: 'TypeError: pow() missing required argument \'exp\' (pos 2)' },
      fix:   { label: 'starmap', code: 'from itertools import starmap\nlist(starmap(pow, [(2, 5), (3, 2)]))', output: '[32, 9]' },
    },
  ],

  when: {
    use: [
      'The arguments already come grouped (pairs, rows, dict items)',
      'Lazy application of a function over a stream of argument tuples',
    ],
    avoid: [
      'Arguments in separate lists → map(f, xs, ys)',
      'Readability matters more → [f(*args) for args in rows]',
    ],
  },

  notes: {
    cpython:    'starmap_next converts each item that is not already a tuple with PySequence_Tuple, then calls the function with it as *args',
    'vs map':   'starmap(f, zip(xs, ys)) is map(f, xs, ys)',
  },

  related: [
    { name: 'map()',            slug: 'map',       when: 'Arguments in separate iterables', category: 'functions' },
    { name: 'zip()',            slug: 'zip',       when: 'Group separate lists into argument tuples', category: 'functions' },
    { name: 'functools.partial', slug: 'partial',  when: 'Fix some arguments instead', category: 'stdlib/functools' },
    { name: 'itertools module', slug: 'itertools', when: 'All the iterator tools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between map and itertools.starmap?',
      a: 'map(f, a, b) calls f(a[i], b[i]) over parallel iterables. starmap(f, pairs) calls f(*pair) for each pair. Use starmap when the arguments are already grouped in tuples.',
    },
    {
      q: 'How do I map a function with multiple arguments over a list of tuples?',
      a: 'list(itertools.starmap(func, list_of_tuples)), or the comprehension [func(*t) for t in list_of_tuples].',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/itertools.html#itertools.starmap',
    meta:  'itertools.starmap',
  },
};
