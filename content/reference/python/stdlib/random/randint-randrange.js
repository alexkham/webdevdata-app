// content/reference/python/stdlib/random/randint-randrange.js
// random.randint and random.randrange

export const meta = {
  slug:        'randint-randrange',
  name:        'random.randint / randrange',
  signature:   'random.randint(a, b) / random.randrange(start, stop=None, step=1)',
  blurb:       'Random integers: randint(a, b) includes both ends, randrange(start, stop, step) picks from range(start, stop, step) and excludes stop.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (float arguments rejected since 3.12)',
  searchTerms: 'random.randint random.randrange randint randrange python random integer random int between two numbers dice roll random even number empty range for randrange Random.randint Random.randrange inclusive exclusive',
};

export const method = {
  slug:      'randint-randrange',
  name:      'random.randint / randrange',
  signature: 'random.randint(a, b) / random.randrange(start, stop=None, step=1)',
  returns:   { type: 'int', desc: 'randint: a <= N <= b. randrange: an element of range(start, stop, step).' },

  category:    'random function',
  version:     'All Python 3 versions (float arguments rejected since 3.12)',
  hasLiveDemo: true,

  subtitle: 'randint(a, b) is literally randrange(a, b + 1). Both draw exactly uniform integers with getrandbits() and rejection, work for arbitrarily large ranges, and refuse floats since Python 3.12.',

  covers: ['randint', 'randrange', 'Random.randint', 'Random.randrange'],

  cheat: {
    commonCall: 'random.randint(1, 6)',
    returns:    'int, both ends included (randrange: stop excluded)',
    replaces:   'int(random.random() * n) + 1',
    watchOut:   'randint(5, 1) fails with a message about randrange(5, 2)',
  },

  parameters: [
    { name: 'a, b',  type: 'int', required: true,  default: null, desc: 'randint: the lowest and highest possible result. b must be >= a.' },
    { name: 'start', type: 'int', required: true,  default: null, desc: 'randrange: with one argument this is stop and start is 0, like range(stop).' },
    { name: 'stop',  type: 'int', required: false, default: 'None', desc: 'randrange: excluded upper (or lower, for a negative step) bound.' },
    { name: 'step',  type: 'int', required: false, default: '1', desc: 'randrange: spacing of the candidates; may be negative, never 0. Needs an explicit stop.' },
  ],

  modes: [
    {
      id: 'randint',
      label: 'randint',
      blurb: 'Eight integers from a to b inclusive. Try a > b to see the error message.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'a',    type: 'int',       hint: 'lowest',             input: 'number' },
        { name: 'b',    type: 'int',       hint: 'highest',            input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.randint({$a}, {$b}) for _ in range(8)]',
      cases: [
        { id: 'tens',  label: '1 to 10',  values: { seed: '42', a: '1', b: '10' } },
        { id: 'signs', label: '-3 to 3',  values: { seed: '42', a: '-3', b: '3' } },
        { id: 'one',   label: '1 to 1',   values: { seed: '42', a: '1', b: '1' } },
        { id: 'bad',   label: '5 to 1',   values: { seed: '42', a: '5', b: '1' } },
      ],
    },
    {
      id: 'randrange',
      label: 'randrange',
      blurb: 'Six picks from range(start, stop, step): stop is excluded and the step can be negative.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'start', type: 'int',       hint: 'start',              input: 'number' },
        { name: 'stop',  type: 'int',       hint: 'stop (excluded)',    input: 'number' },
        { name: 'step',  type: 'int',       hint: 'step',               input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.randrange({$start}, {$stop}, {$step}) for _ in range(6)]',
      cases: [
        { id: 'fives', label: '0, 100, 5',  values: { seed: '42', start: '0', stop: '100', step: '5' } },
        { id: 'down',  label: '10, 0, -2',  values: { seed: '42', start: '10', stop: '0', step: '-2' } },
        { id: 'zero',  label: 'step 0',     values: { seed: '42', start: '0', stop: '10', step: '0' } },
        { id: 'empty', label: '10, 0, 2',   values: { seed: '42', start: '10', stop: '0', step: '2' } },
      ],
    },
  ],
  demoExplainer: 'randint(5, 1) calls randrange(5, 2), and that is the call the error names: "empty range in randrange(5, 2)". A negative step counts down from start, so randrange(10, 0, -2) picks from 10, 8, 6, 4, 2 and never 0. Step 0 and a step pointing away from stop are both ValueErrors.',

  patterns: [
    {
      name: 'Roll dice',
      desc: 'Both ends included.',
      code: 'import random\nroll = random.randint(1, 6)\nthree_d6 = sum(random.randint(1, 6) for _ in range(3))',
    },
    {
      name: 'A random index',
      desc: 'randrange(len(seq)) can never be out of range (but choice(seq) is simpler for the item).',
      code: 'import random\ni = random.randrange(len(items))',
    },
    {
      name: 'An even number from 0 to 100',
      desc: 'Step 2 with stop 101 includes 100.',
      code: 'import random\neven = random.randrange(0, 101, 2)',
    },
    {
      name: 'A random big id',
      desc: 'Arbitrarily large ranges work (getrandbits rejection sampling) — but use secrets for anything guessable.',
      code: 'import random\nrow_id = random.randrange(10 ** 30)',
    },
  ],

  examples: [
    { title: 'randint includes both ends',     code: 'import random\nrandom.seed(42)\n[random.randint(1, 10) for _ in range(8)]',        returns: '[2, 1, 5, 4, 4, 3, 2, 9]' },
    { title: 'randrange(n): 0 to n - 1',       code: 'import random\nrandom.seed(42)\n[random.randrange(10) for _ in range(8)]',         returns: '[1, 0, 4, 3, 3, 2, 1, 8]' },
    { title: 'randrange with a step',          code: 'import random\nrandom.seed(42)\n[random.randrange(0, 100, 5) for _ in range(6)]', returns: '[15, 0, 40, 35, 35, 20]' },
    { title: 'Same draws: randint(a, b) is randrange(a, b + 1)', code: 'import random\nrandom.seed(42)\n[random.randrange(1, 7) for _ in range(5)]', returns: '[6, 1, 1, 6, 3]' },
    { title: 'Huge ranges are exact',          code: 'import random\nrandom.seed(42)\nrandom.randint(10 ** 20, 10 ** 20 + 5)',         returns: '100000000000000000005' },
    { title: 'a > b',                          code: 'import random\nrandom.randint(5, 1)',                                               returns: 'ValueError: empty range in randrange(5, 2)' },
    { title: 'Floats are rejected (3.12+)',    code: 'import random\nrandom.randint(1, 6.0)',                                             returns: "TypeError: 'float' object cannot be interpreted as an integer" },
    { title: 'step needs an explicit stop',    code: 'import random\nrandom.randrange(10, step=2)',                                       returns: 'TypeError: Missing a non-None stop argument' },
  ],

  pitfalls: [
    {
      name: 'randrange(1, 6) for a die',
      desc: 'randrange excludes stop, like range(), so 6 never comes up. randint(1, 6), or randrange(1, 7), includes it.',
      wrong: { label: 'randrange(1, 6)', code: 'import random\nrandom.seed(42)\nrolls = [random.randrange(1, 6) for _ in range(6000)]\n(min(rolls), max(rolls))', output: '(1, 5)' },
      fix:   { label: 'randint(1, 6)',   code: 'import random\nrandom.seed(42)\nrolls = [random.randint(1, 6) for _ in range(6000)]\n(min(rolls), max(rolls))',   output: '(1, 6)' },
    },
    {
      name: 'Passing a float bound',
      desc: 'Since 3.12 there is no silent int() conversion: 6.0 from a division or float() input raises TypeError. Convert explicitly.',
      wrong: { label: 'n = 12 / 2', code: 'import random\nn = 12 / 2\nrandom.randint(1, n)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'n // 2',            code: 'import random\nrandom.seed(42)\nn = 12 // 2\nrandom.randint(1, n)', output: '6' },
    },
    {
      name: 'randrange(0) or an empty range',
      desc: 'There is nothing to pick from range(0) or range(5, 5); randrange raises instead of returning a default.',
      wrong: { label: 'randrange(0)',            code: 'import random\nrandom.randrange(0)',                                    output: 'ValueError: empty range for randrange()' },
      fix:   { label: 'guard the empty case',    code: "import random\nn = 0\nrandom.randrange(n) if n > 0 else 'nothing to pick'", output: "'nothing to pick'" },
    },
  ],

  when: {
    use: [
      'Dice, card indexes, random ids in a range',
      'Exactly uniform integers, including huge ranges like randrange(10 ** 30)',
      'Every k-th value: randrange(start, stop, k)',
    ],
    avoid: [
      'Picking an item → choice(seq)',
      'Several distinct ints → sample(range(a, b + 1), k)',
      'Security codes and PINs → secrets.randbelow(n)',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: randint returns self.randrange(a, b+1); randrange converts its arguments with operator.index() and draws _randbelow(n), which calls getrandbits(n.bit_length()) until the value is below n — exact integer arithmetic, identical on every platform',
    'Messages': 'The ValueError shows the arguments as you passed them: empty range in randrange(5, 5) / zero step for randrange() / empty range for randrange() for a single argument <= 0',
    'Keywords':  'The docs warn against keyword arguments: randrange(start=100) is interpreted as randrange(0, 100, 1)',
  },

  related: [
    { name: 'random.choice',  slug: 'choice',           when: 'Pick an item instead of an index' },
    { name: 'random.sample',  slug: 'sample',           when: 'Several distinct integers' },
    { name: 'getrandbits / randbytes', slug: 'getrandbits-randbytes', when: 'The bits randrange is built on' },
    { name: 'range',          slug: 'range',            when: 'The same start/stop/step rules', category: 'functions' },
    { name: 'ValueError',     slug: 'valueerror',       when: 'Raised for an empty range', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Is random.randint inclusive?',
      a: 'Yes, randint(a, b) can return both a and b. randrange(a, b) excludes b, like range(a, b).',
    },
    {
      q: 'What does "ValueError: empty range in randrange" mean?',
      a: 'The range you asked for has no numbers in it: randint(a, b) with a > b, randrange(a, b) with a >= b, or a step that points away from stop. Since randint(a, b) calls randrange(a, b + 1), the message shows b + 1.',
    },
    {
      q: 'Why does random.randint(1, 10.0) raise TypeError?',
      a: 'Since Python 3.12 randrange and randint accept only integers (anything with __index__). Earlier versions converted integral floats (3.10 and 3.11 with a DeprecationWarning). Use int(x) or // division.',
    },
    {
      q: 'How do I generate a random number between 1 and 100 in Python?',
      a: 'random.randint(1, 100) — both 1 and 100 are possible. random.randrange(1, 101) is equivalent.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.randint',
    meta:  'random.randint and random.randrange',
  },
};
