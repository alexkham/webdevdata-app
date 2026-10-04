// content/reference/python/stdlib/random/uniform.js

export const meta = {
  slug:        'uniform',
  name:        'random.uniform',
  signature:   'random.uniform(a, b)',
  blurb:       'A random float between a and b, computed as a + (b - a) * random(); a and b may come in either order.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random.uniform uniform python random float between two numbers random decimal in range random float range a b Random.uniform',
};

export const method = {
  slug:      'uniform',
  name:      'random.uniform',
  signature: 'random.uniform(a, b)',
  returns:   { type: 'float', desc: 'N with a <= N <= b (or b <= N <= a when b < a). b itself may or may not occur, depending on rounding.' },

  category:    'random function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'One line of Python: a + (b - a) * random(). So the result is always a float (even for int bounds), reversed bounds just work, and equal bounds return that value.',

  covers: ['uniform', 'Random.uniform'],

  cheat: {
    commonCall: 'random.uniform(1.5, 4.5)',
    returns:    'float between a and b',
    replaces:   'a + (b - a) * random.random()',
    watchOut:   'int(uniform(1, 6)) never gives 6: use randint for ints',
  },

  parameters: [
    { name: 'a', type: 'float | int', required: true, default: null, desc: 'One end of the range: the value returned when random() gives 0.0.' },
    { name: 'b', type: 'float | int', required: true, default: null, desc: 'The other end. It may be smaller than a.' },
  ],

  modes: [
    {
      id: 'three',
      label: 'three floats',
      blurb: 'Three draws between a and b from a seeded generator. Try swapping a and b, or making them equal.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'a',    type: 'float',     hint: 'one end',            input: 'float' },
        { name: 'b',    type: 'float',     hint: 'the other end',      input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.uniform({$a}, {$b}) for _ in range(3)]',
      cases: [
        { id: 'oneten',  label: '1 to 10',   values: { seed: '3', a: '1', b: '10' } },
        { id: 'swapped', label: '10 to 1',   values: { seed: '3', a: '10', b: '1' } },
        { id: 'signed',  label: '-1 to 1',   values: { seed: '42', a: '-1', b: '1' } },
        { id: 'equal',   label: 'a == b',    values: { seed: '42', a: '5', b: '5' } },
      ],
    },
    {
      id: 'rounded',
      label: 'rounded',
      blurb: 'A random price: round the float to two decimals for display.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'a',    type: 'float',     hint: 'lowest price',       input: 'float' },
        { name: 'b',    type: 'float',     hint: 'highest price',      input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\nround(random.uniform({$a}, {$b}), 2)',
      cases: [
        { id: 'price', label: '20 to 25', values: { seed: '3', a: '20', b: '25' } },
        { id: 'pct',   label: '0 to 100', values: { seed: '42', a: '0', b: '100' } },
      ],
    },
  ],
  demoExplainer: 'With seed 3, uniform(1.0, 10.0) and uniform(10.0, 1.0) use the same random() values: 3.141681643827022 and 7.858318356172978 add up to exactly 11, because swapping a and b mirrors the result inside the range. With a == b the width is 0, so every draw is a itself.',

  patterns: [
    {
      name: 'Random price or measurement',
      desc: 'Round for display only; keep the full float for calculations.',
      code: 'import random\nprice = round(random.uniform(9.99, 49.99), 2)',
    },
    {
      name: 'A random point in a rectangle',
      desc: 'One uniform per axis.',
      code: 'import random\npoint = (random.uniform(0, width), random.uniform(0, height))',
    },
    {
      name: 'Noise around a value',
      desc: 'Symmetric jitter of up to plus or minus 5 percent.',
      code: 'import random\nnoisy = value * random.uniform(0.95, 1.05)',
    },
  ],

  examples: [
    { title: 'Three floats from 1 to 10',      code: 'import random\nrandom.seed(3)\n[random.uniform(1, 10) for _ in range(3)]',  returns: '[3.141681643827022, 5.898063027663567, 4.329596498932713]' },
    { title: 'Reversed bounds work too',       code: 'import random\nrandom.seed(3)\n[random.uniform(10, 1) for _ in range(3)]',  returns: '[7.858318356172978, 5.101936972336433, 6.670403501067287]' },
    { title: 'Exactly a + (b - a) * random()', code: 'import random\nrandom.seed(42)\nrandom.uniform(5.0, 10.0)',                    returns: '8.19713399228942' },
    { title: 'Int bounds still give a float',  code: 'import random\nrandom.seed(42)\nrandom.uniform(5, 5)',                         returns: '5.0' },
    { title: 'Between -1 and 1',               code: 'import random\nrandom.seed(42)\n[random.uniform(-1, 1) for _ in range(3)]', returns: '[0.2788535969157675, -0.9499784895546661, -0.4499413632617615]' },
    { title: 'A price with two decimals',      code: 'import random\nrandom.seed(3)\nround(random.uniform(20.0, 25.0), 2)',        returns: '21.19' },
    { title: 'Bounds must be numbers',         code: "import random\nrandom.uniform('1', 5)",                                       returns: "TypeError: unsupported operand type(s) for -: 'int' and 'str'" },
  ],

  pitfalls: [
    {
      name: 'int(uniform(1, 6)) as a die',
      desc: 'uniform(1, 6) is a float below 6 (practically never 6.0), so int() gives 1 to 5. Use randint(1, 6) for whole numbers.',
      wrong: { label: 'int(uniform(1, 6))', code: 'import random\nrandom.seed(42)\n[int(random.uniform(1, 6)) for _ in range(10)]', output: '[4, 1, 2, 2, 4, 4, 5, 1, 3, 1]' },
      fix:   { label: 'randint(1, 6)',      code: 'import random\nrandom.seed(42)\n[random.randint(1, 6) for _ in range(10)]',      output: '[6, 1, 1, 6, 3, 2, 2, 2, 6, 1]' },
    },
    {
      name: 'Printing all 17 digits',
      desc: 'A random float shows its full repr. Round when you display it, not before you compute with it.',
      wrong: { label: 'raw float',  code: 'import random\nrandom.seed(42)\nrandom.uniform(0, 100)',           output: '63.942679845788376' },
      fix:   { label: 'round(x, 2)', code: 'import random\nrandom.seed(42)\nround(random.uniform(0, 100), 2)', output: '63.94' },
    },
  ],

  when: {
    use: [
      'A continuous value in a range: prices, coordinates, durations, noise',
      'Either order of bounds, e.g. from user input',
    ],
    avoid: [
      'Whole numbers → randint / randrange',
      'Values clustered around a mean → gauss / normalvariate or triangular',
      'Exact decimal amounts (money) → randint on cents, then divide',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: return a + (b - a) * self.random() — plain float arithmetic, so the result is identical on every platform',
    'End point': 'b can be returned only through rounding of a + (b - a) * random(); the docs say it "may or may not be included"',
    'Types':     'int arguments are fine (converted by the arithmetic); the result is always a float',
  },

  related: [
    { name: 'random.random',  slug: 'random',            when: 'The [0, 1) float uniform scales' },
    { name: 'randint / randrange', slug: 'randint-randrange', when: 'Random integers instead of floats' },
    { name: 'triangular and other distributions', slug: 'distributions', when: 'Floats with a peak instead of flat' },
    { name: 'round()',        slug: 'round',             when: 'Limit the digits shown', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I generate a random float between two numbers in Python?',
      a: 'random.uniform(a, b). It returns a float between a and b in either order of arguments; seed the generator first if you need repeatable values.',
    },
    {
      q: 'Does random.uniform include the upper bound?',
      a: 'Mathematically it covers [a, b); because of float rounding in a + (b - a) * random() the value b can occur, so the docs describe the range as a <= N <= b.',
    },
    {
      q: 'What is the difference between uniform and randint?',
      a: 'uniform returns floats such as 3.141681643827022; randint returns ints and includes both ends, so randint(1, 6) can return 6.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.uniform',
    meta:  'random.uniform',
  },
};
