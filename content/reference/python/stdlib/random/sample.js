// content/reference/python/stdlib/random/sample.js

export const meta = {
  slug:        'sample',
  name:        'random.sample',
  signature:   'random.sample(population, k, *, counts=None)',
  blurb:       'k distinct picks from a sequence, without replacement: lottery numbers, raffle winners, a random subset. Returns a new list in selection order.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (counts= 3.9+, sets rejected since 3.11)',
  searchTerms: 'random.sample sample python random sample without replacement unique random numbers lottery raffle random subset sample larger than population population must be a sequence counts Random.sample',
};

export const method = {
  slug:      'sample',
  name:      'random.sample',
  signature: 'random.sample(population, k, *, counts=None)',
  returns:   { type: 'list', desc: 'A new list of k elements; the population is left unchanged.' },

  category:    'random function',
  version:     'All Python 3 versions (counts= 3.9+, sets rejected since 3.11)',
  hasLiveDemo: true,

  subtitle: 'No position is picked twice, so k can be at most len(population). It works on any sequence including huge ranges (sample(range(10**12), 3) is instant), but sets and dicts must be converted first since Python 3.11.',

  covers: ['sample', 'Random.sample'],

  cheat: {
    commonCall: 'random.sample(range(1, 50), 6)',
    returns:    'list of k distinct positions of the population',
    replaces:   'shuffle a copy and slice it',
    watchOut:   'sample(a_set, k) → TypeError since 3.11: use sorted(a_set)',
  },

  parameters: [
    { name: 'population', type: 'Sequence', required: true, default: null, desc: 'list, tuple, str or range (a range is never expanded). Not a set or dict.' },
    { name: 'k', type: 'int', required: true, default: null, desc: 'Sample size, 0 <= k <= len(population); otherwise ValueError.' },
    { name: 'counts', type: 'Sequence[int]', required: false, default: 'None', desc: 'Keyword-only (3.9+). Repeat counts per element: sample(["red", "blue"], counts=[4, 2], k=5) samples from four reds and two blues.' },
  ],

  modes: [
    {
      id: 'sample',
      label: 'from a list',
      blurb: 'k distinct picks. With k equal to the length you get a shuffled copy; one more is an error.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string',    input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
        { name: 'k',     type: 'int',       hint: 'sample size',           input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.sample({$items}, {$k})',
      cases: [
        { id: 'three', label: 'k=3',          values: { seed: '42', items: 'a, b, c, d, e', k: '3' } },
        { id: 'all',   label: 'k = len',      values: { seed: '42', items: 'a, b, c, d, e', k: '5' } },
        { id: 'big',   label: 'k too large',  values: { seed: '42', items: 'a, b, c, d, e', k: '6' } },
        { id: 'neg',   label: 'k negative',   values: { seed: '42', items: 'a, b, c', k: '-1' } },
      ],
    },
    {
      id: 'counts',
      label: 'counts=',
      blurb: 'Each item stands for count copies of itself, without building the long list.',
      params: [
        { name: 'seed',   type: 'int | str', hint: 'an int or a string',        input: 'auto' },
        { name: 'items',  type: 'list[str]', hint: 'comma-separated items',     input: 'csv' },
        { name: 'counts', type: 'list[int]', hint: 'comma-separated counts',    input: 'csv-num' },
        { name: 'k',      type: 'int',       hint: 'sample size',               input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.sample({$items}, counts={$counts}, k={$k})',
      cases: [
        { id: 'balls',  label: '4 red, 2 blue', values: { seed: '42', items: 'red, blue', counts: '4, 2', k: '5' } },
        { id: 'prizes', label: 'raffle',        values: { seed: '42', items: 'gold, silver, none', counts: '1, 2, 7', k: '3' } },
        { id: 'over',   label: 'k too large',   values: { seed: '42', items: 'red, blue', counts: '4, 2', k: '7' } },
        { id: 'float',  label: 'float count',   values: { seed: '42', items: 'red, blue', counts: '1.5, 2', k: '1' } },
      ],
    },
    {
      id: 'range',
      label: 'from a range',
      blurb: 'Distinct integers from range(n) without materializing the range.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'range size',         input: 'number' },
        { name: 'k',    type: 'int',       hint: 'sample size',        input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.sample(range({$n}), {$k})',
      cases: [
        { id: 'hundred', label: 'range(100)',     values: { seed: '42', n: '100', k: '5' } },
        { id: 'million', label: 'range(1000000)', values: { seed: '42', n: '1000000', k: '5' } },
        { id: 'small',   label: 'range(10)',      values: { seed: '7', n: '10', k: '3' } },
      ],
    },
  ],
  demoExplainer: 'For a small population sample() copies it into a pool and swaps each pick out; for a large one (here range(1000000)) it keeps a set of chosen indexes and redraws on a collision, so memory stays proportional to k. counts=[4, 2] behaves like the list red, red, red, red, blue, blue: k=7 is too large for those six, and the counts must add up to an int.',

  patterns: [
    {
      name: 'Lottery numbers',
      desc: 'Distinct numbers, sorted for display.',
      code: 'import random\nticket = sorted(random.sample(range(1, 50), 6))',
    },
    {
      name: 'Train / test split',
      desc: 'Pick test indexes without repeats, the rest is training data.',
      code: 'import random\ntest_idx = set(random.sample(range(len(rows)), k=len(rows) // 5))\ntest = [r for i, r in enumerate(rows) if i in test_idx]\ntrain = [r for i, r in enumerate(rows) if i not in test_idx]',
    },
    {
      name: 'Shuffled copy of an immutable sequence',
      desc: 'The docs recommend this instead of shuffle() for tuples and strings.',
      code: "import random\nscrambled = ''.join(random.sample(word, k=len(word)))",
    },
    {
      name: 'Sample from a set or dict',
      desc: 'Sort first so the result is repeatable under a seed.',
      code: 'import random\nwinners = random.sample(sorted(entrants), 3)',
    },
  ],

  examples: [
    { title: 'Three distinct letters',          code: "import random\nrandom.seed(42)\nrandom.sample(['a', 'b', 'c', 'd', 'e'], 3)",          returns: "['a', 'e', 'c']" },
    { title: 'Six lottery numbers',             code: 'import random\nrandom.seed(42)\nrandom.sample(range(1, 50), 6)',                       returns: '[41, 8, 2, 18, 16, 15]' },
    { title: 'counts= stands for repeats',      code: "import random\nrandom.seed(42)\nrandom.sample(['red', 'blue'], counts=[4, 2], k=5)",   returns: "['blue', 'red', 'blue', 'red', 'red']" },
    { title: 'Huge ranges are fine',            code: 'import random\nrandom.seed(42)\nrandom.sample(range(10 ** 12), 3)',                    returns: '[123005401501, 811856239313, 267469214295]' },
    { title: 'Winners in selection order',      code: "import random\nrandom.seed(42)\nwinners = random.sample(['ann', 'bob', 'cy', 'dee', 'eve'], 3)\n(winners[0], winners[1:])", returns: "('ann', ['eve', 'cy'])" },
    { title: 'Repeated values can repeat',      code: 'import random\nrandom.seed(42)\nrandom.sample([1, 1, 2], 3)',                          returns: '[2, 1, 1]' },
    { title: 'k larger than the population',    code: 'import random\nrandom.sample([1, 2, 3], 5)',                                              returns: 'ValueError: Sample larger than population or is negative' },
  ],

  pitfalls: [
    {
      name: 'Sampling a set (3.11+)',
      desc: 'Automatic conversion of sets was removed in 3.11. Convert explicitly; sorted() also makes the result reproducible, because set iteration order can change between runs.',
      wrong: { label: 'sample(set, 2)',         code: "import random\nrandom.seed(42)\nrandom.sample({'a', 'b', 'c'}, 2)",         output: 'TypeError: Population must be a sequence.  For dicts or sets, use sorted(d).' },
      fix:   { label: 'sample(sorted(set), 2)', code: "import random\nrandom.seed(42)\nrandom.sample(sorted({'a', 'b', 'c'}), 2)", output: "['c', 'a']" },
    },
    {
      name: 'Forgetting k',
      desc: 'Unlike choices(), k has no default: sample() always needs the size.',
      wrong: { label: 'sample(seq)',      code: "import random\nrandom.seed(42)\nrandom.sample(['a', 'b', 'c', 'd'])",      output: "TypeError: Random.sample() missing 1 required positional argument: 'k'" },
      fix:   { label: 'sample(seq, k=2)', code: "import random\nrandom.seed(42)\nrandom.sample(['a', 'b', 'c', 'd'], k=2)", output: "['a', 'd']" },
    },
  ],

  when: {
    use: [
      'Picks without repeats: lottery, raffle, random subset, test split',
      'Sampling from a huge range without building it',
      'A shuffled copy of an immutable sequence: sample(seq, k=len(seq))',
    ],
    avoid: [
      'Picks with repeats or weights → choices()',
      'Shuffling a list in place → shuffle()',
      'Security-relevant selection → secrets.SystemRandom().sample()',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: setsize = 21, plus 4 ** ceil(log(k * 3, 4)) for k > 5; if n <= setsize it copies the population into a pool and moves each pick out, otherwise it tracks chosen indexes in a set and redraws collisions. Picks come from _randbelow (exact integers), so results are identical on every platform',
    'counts=': 'Implemented as sample(range(total), k) followed by bisect into the running totals; in 3.12 all-zero counts raised "Total of counts must be greater than zero", 3.13 allows them (and k=0 then returns [])',
    'Order':   'The result is in selection order, so any slice of it is itself a random sample',
  },

  related: [
    { name: 'random.choices', slug: 'choices', when: 'With replacement, optionally weighted' },
    { name: 'random.shuffle', slug: 'shuffle', when: 'Reorder a list in place' },
    { name: 'random.choice',  slug: 'choice',  when: 'Exactly one item' },
    { name: 'sorted()',       slug: 'sorted',  when: 'Turn a set into a sequence first', category: 'functions' },
    { name: 'range',          slug: 'range',   when: 'A lazy population of integers', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I generate unique random numbers in Python?',
      a: 'random.sample(range(start, stop), k) returns k different integers from start to stop - 1, e.g. random.sample(range(1, 50), 6) for six lottery numbers.',
    },
    {
      q: 'What does "Sample larger than population or is negative" mean?',
      a: 'k is bigger than the number of items (or below 0). sample() never repeats a position, so it cannot draw more items than there are; use choices(population, k=k) if repeats are fine.',
    },
    {
      q: 'Why does random.sample on a set raise TypeError?',
      a: 'Since Python 3.11 the population must be a sequence. Before 3.11 a set was converted to a tuple automatically. Pass sorted(the_set), or list(the_set) if a repeatable result does not matter.',
    },
    {
      q: 'What is the difference between random.sample and random.choices?',
      a: 'sample() picks without replacement (each position at most once, k <= len). choices() picks with replacement (k can be anything) and supports weights.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.sample',
    meta:  'random.sample',
  },
};
