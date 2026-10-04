// content/reference/python/stdlib/random/choices.js

export const meta = {
  slug:        'choices',
  name:        'random.choices',
  signature:   'random.choices(population, weights=None, *, cum_weights=None, k=1)',
  blurb:       'k random picks from a population WITH replacement, optionally weighted by relative or cumulative weights. Always returns a list.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'random.choices choices python weighted random choice probability weights cum_weights cumulative weights k picks with replacement random selection with weights loot table Random.choices',
};

export const method = {
  slug:      'choices',
  name:      'random.choices',
  signature: 'random.choices(population, weights=None, *, cum_weights=None, k=1)',
  returns:   { type: 'list', desc: 'A new list of k elements of population; repeats are possible.' },

  category:    'random function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'The weighted pick: weights=[80, 15, 5] makes the first item 16 times as likely as the last. k must be passed by keyword, items can repeat, and the result is a list even for k=1.',

  covers: ['choices', 'Random.choices'],

  cheat: {
    commonCall: "random.choices(['a', 'b'], weights=[3, 1], k=10)",
    returns:    'list of k items (with replacement)',
    replaces:   'Hand-written cumulative-probability loops',
    watchOut:   'choices(pop, 3) treats 3 as weights → TypeError; write k=3',
  },

  parameters: [
    { name: 'population',  type: 'Sequence',         required: true,  default: null,   desc: 'What to pick from: list, tuple, str or range. Empty raises IndexError.' },
    { name: 'weights',     type: 'Sequence[number]', required: false, default: 'None', desc: 'Relative weights, one per element (int, float or Fraction; not Decimal). Same length as population; the total must be > 0 and finite.' },
    { name: 'cum_weights', type: 'Sequence[number]', required: false, default: 'None', desc: 'Keyword-only. Cumulative weights instead, e.g. [10, 15, 45, 50] for weights [10, 5, 30, 5]; saves the internal accumulate step. Not together with weights.' },
    { name: 'k',           type: 'int',              required: false, default: '1',    desc: 'Keyword-only. How many picks. 0 or negative gives [].' },
  ],

  modes: [
    {
      id: 'equal',
      label: 'equal chance',
      blurb: 'k picks where every item is equally likely. Repeats are normal.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string',    input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'k',     type: 'int',       hint: 'number of picks',       input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.choices({$items}, k={$k})',
      cases: [
        { id: 'colors', label: 'k=5',        values: { seed: '42', items: 'red, green, blue', k: '5' } },
        { id: 'coin',   label: 'coin, k=6',  values: { seed: '7', items: 'heads, tails', k: '6' } },
        { id: 'zero',   label: 'k=0',        values: { seed: '42', items: 'a, b, c', k: '0' } },
        { id: 'empty',  label: 'empty list', values: { seed: '42', items: '', k: '1' } },
      ],
    },
    {
      id: 'weighted',
      label: 'weighted',
      blurb: 'Relative weights, one per item: they do not have to add up to 1 or 100.',
      params: [
        { name: 'seed',    type: 'int | str',  hint: 'an int or a string',      input: 'auto' },
        { name: 'items',   type: 'list[str]',  hint: 'comma-separated items',   input: 'csv' },
        { name: 'weights', type: 'list[float]', hint: 'comma-separated weights', input: 'csv-num' },
        { name: 'k',       type: 'int',        hint: 'number of picks',         input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.choices({$items}, weights={$weights}, k={$k})',
      cases: [
        { id: 'loot',     label: 'loot table',     values: { seed: '42', items: 'common, rare, epic', weights: '80, 15, 5', k: '8' } },
        { id: 'roulette', label: 'roulette',       values: { seed: '42', items: 'red, black, green', weights: '18, 18, 2', k: '6' } },
        { id: 'zeros',    label: 'all zero',       values: { seed: '42', items: 'a, b', weights: '0, 0', k: '3' } },
        { id: 'short',    label: 'too few weights', values: { seed: '42', items: 'a, b, c', weights: '1, 2', k: '3' } },
      ],
    },
    {
      id: 'tally',
      label: '1000 picks',
      blurb: 'Draw 1000 times from a, b, c and count: the counts follow the weights.',
      params: [
        { name: 'seed',    type: 'int | str',   hint: 'an int or a string',               input: 'auto' },
        { name: 'weights', type: 'list[float]', hint: 'three comma-separated weights', input: 'csv-num' },
      ],
      template: "import random\nrandom.seed({$seed})\npicks = random.choices(['a', 'b', 'c'], weights={$weights}, k=1000)\n{x: picks.count(x) for x in 'abc'}",
      cases: [
        { id: 'fiveth', label: '5, 3, 2',          values: { seed: '42', weights: '5, 3, 2' } },
        { id: 'flat',   label: '1, 1, 1',          values: { seed: '42', weights: '1, 1, 1' } },
        { id: 'frac',   label: '0.5, 0.25, 0.25',  values: { seed: '42', weights: '0.5, 0.25, 0.25' } },
        { id: 'only',   label: '0, 0, 1',          values: { seed: '42', weights: '0, 0, 1' } },
      ],
    },
  ],
  demoExplainer: 'With weights 5, 3, 2 and seed 42 the 1000 picks split 480 / 308 / 212, close to the 500 / 300 / 200 the weights predict. Weights 0.5, 0.25, 0.25 have the same ratios as 2, 1, 1, and a weight of 0 means that item is never picked. If all weights are 0 there is nothing to choose: ValueError.',

  patterns: [
    {
      name: 'Loot table or A/B split',
      desc: 'Weights as percentages or any relative numbers.',
      code: "import random\nvariant = random.choices(['A', 'B'], weights=[90, 10])[0]",
    },
    {
      name: 'Bootstrap resampling',
      desc: 'Resample a dataset with replacement, same size as the original.',
      code: 'import random\nfrom statistics import fmean\nmeans = sorted(fmean(random.choices(data, k=len(data))) for _ in range(1000))',
    },
    {
      name: 'Reuse cumulative weights',
      desc: 'Accumulate once when you draw from the same weights many times.',
      code: 'import random\nfrom itertools import accumulate\ncum = list(accumulate(weights))\nbatch = random.choices(items, cum_weights=cum, k=10_000)',
    },
    {
      name: 'One weighted item',
      desc: 'choices always returns a list; take [0] for a single pick.',
      code: 'import random\nwinner = random.choices(names, weights=tickets)[0]',
    },
  ],

  examples: [
    { title: 'k picks, repeats allowed',      code: "import random\nrandom.seed(42)\nrandom.choices(['red', 'green', 'blue'], k=5)", returns: "['green', 'red', 'red', 'red', 'blue']" },
    { title: 'Weighted: 1 win in 10',          code: "import random\nrandom.seed(42)\nrandom.choices(['win', 'lose'], weights=[1, 9], k=10)", returns: "['lose', 'win', 'lose', 'lose', 'lose', 'lose', 'lose', 'win', 'lose', 'win']" },
    { title: 'cum_weights give the same picks', code: "import random\nrandom.seed(42)\nrandom.choices(['win', 'lose'], cum_weights=[1, 10], k=10)", returns: "['lose', 'win', 'lose', 'lose', 'lose', 'lose', 'lose', 'win', 'lose', 'win']" },
    { title: 'Six roulette spins',            code: "import random\nrandom.seed(42)\nrandom.choices(['red', 'black', 'green'], [18, 18, 2], k=6)", returns: "['black', 'red', 'red', 'red', 'black', 'black']" },
    { title: 'Counts follow the weights',     code: "import random\nrandom.seed(42)\npicks = random.choices(['a', 'b', 'c'], weights=[5, 3, 2], k=1000)\n{x: picks.count(x) for x in 'abc'}", returns: "{'a': 480, 'b': 308, 'c': 212}" },
    { title: 'k=1 still returns a list',      code: "import random\nrandom.seed(42)\nrandom.choices(['x', 'y'], weights=[0.25, 0.75])", returns: "['y']" },
    { title: 'All weights zero',              code: "import random\nrandom.choices(['a', 'b'], [0, 0])",                                      returns: 'ValueError: Total of weights must be greater than zero' },
  ],

  pitfalls: [
    {
      name: 'Passing k positionally',
      desc: 'The second positional parameter is weights, not k. CPython notices that an int was passed as weights and says so.',
      wrong: { label: 'choices(pop, 3)',   code: "import random\nrandom.seed(42)\nrandom.choices(['a', 'b'], 3)",   output: 'TypeError: The number of choices must be a keyword argument: k=3' },
      fix:   { label: 'choices(pop, k=3)', code: "import random\nrandom.seed(42)\nrandom.choices(['a', 'b'], k=3)", output: "['b', 'a', 'a']" },
    },
    {
      name: 'Expecting distinct items',
      desc: 'choices samples WITH replacement: 10 picks from 10 values are rarely all different. For a draw without repeats use sample().',
      wrong: { label: 'choices',  code: 'import random\nrandom.seed(42)\nlen(set(random.choices(range(10), k=10)))', output: '6' },
      fix:   { label: 'sample',   code: 'import random\nrandom.seed(42)\nlen(set(random.sample(range(10), k=10)))',  output: '10' },
    },
    {
      name: 'One weight per item',
      desc: 'weights must have exactly len(population) entries; missing weights are not treated as 0.',
      wrong: { label: '2 weights, 3 items', code: "import random\nrandom.seed(42)\nrandom.choices(['a', 'b', 'c'], weights=[1, 2])",    output: 'ValueError: The number of weights does not match the population' },
      fix:   { label: 'explicit 0',         code: "import random\nrandom.seed(42)\nrandom.choices(['a', 'b', 'c'], weights=[1, 2, 0], k=4)", output: "['b', 'a', 'a', 'a']" },
    },
  ],

  when: {
    use: [
      'Weighted random selection: loot tables, traffic splits, simulations',
      'Many picks with replacement in one call (k=...)',
      'Bootstrap resampling',
    ],
    avoid: [
      'Picks without repeats → sample()',
      'A single unweighted pick → choice() (exact integer method)',
      'Security-relevant choices → secrets.choice()',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: without weights each pick is population[floor(random() * n)]; with weights it accumulates them (itertools.accumulate), multiplies random() by the float total and bisects (bisect.bisect) into the cumulative list. Only float multiplication and comparisons: identical on every platform',
    'vs choice()': 'For the same seed, choices(seq) and choice(seq) pick different items: choices uses floor(random() * n), choice uses getrandbits-based _randbelow',
    'Errors': 'TypeError for both weights and cum_weights; ValueError when the number of weights differs, the total is <= 0 or not finite; IndexError for an empty population',
  },

  related: [
    { name: 'random.choice', slug: 'choice', when: 'A single unweighted pick' },
    { name: 'random.sample', slug: 'sample', when: 'k picks without replacement' },
    { name: 'binomialvariate', slug: 'binomialvariate', when: 'Count successes instead of listing picks' },
    { name: 'collections module', slug: 'collections', when: 'Counter tallies the picks', category: 'stdlib' },
    { name: 'list.count()', slug: 'list-count', when: 'Count one value in the result', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I make a weighted random choice in Python?',
      a: "random.choices(items, weights=[...], k=n). The weights are relative: [3, 1] means the first item is three times as likely. For a single item use random.choices(items, weights=w)[0].",
    },
    {
      q: 'What is the difference between random.choice and random.choices?',
      a: 'choice(seq) returns one element. choices(seq, k=n) returns a list of n elements, picked with replacement, and supports weights. For the same seed they produce different picks.',
    },
    {
      q: 'Do the weights need to add up to 1 or 100?',
      a: 'No. They are divided by their total internally; [0.5, 0.25, 0.25], [2, 1, 1] and [50, 25, 25] all give the same probabilities. They must be non-negative and the total must be positive and finite.',
    },
    {
      q: 'What is cum_weights in random.choices?',
      a: 'Cumulative weights: a running total of the weights, e.g. [10, 15, 45, 50] for [10, 5, 30, 5]. choices() converts weights to that form anyway, so passing cum_weights saves work when you call it repeatedly with the same weights.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.choices',
    meta:  'random.choices',
  },
};
