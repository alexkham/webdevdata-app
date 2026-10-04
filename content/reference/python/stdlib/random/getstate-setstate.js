// content/reference/python/stdlib/random/getstate-setstate.js
// random.getstate and random.setstate

export const meta = {
  slug:        'getstate-setstate',
  name:        'random.getstate / setstate',
  signature:   'random.getstate() / random.setstate(state)',
  blurb:       'Snapshot the generator and restore it later: getstate() returns (3, 625-int tuple, gauss cache), setstate() rewinds to exactly that point.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random.getstate random.setstate getstate setstate python save random state restore random state rewind random generator checkpoint state vector is the wrong size Random.getstate Random.setstate',
};

export const method = {
  slug:      'getstate-setstate',
  name:      'random.getstate / setstate',
  signature: 'random.getstate() / random.setstate(state)',
  returns:   { type: 'tuple | None', desc: 'getstate: (3, tuple of 625 ints, gauss_next). setstate: None.' },

  category:    'random function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'seed() can only restart a sequence from the beginning; getstate()/setstate() rewind to any point. The state is the 624-word Mersenne Twister array, the position in it, and the value gauss() has cached.',

  covers: ['getstate', 'setstate', 'Random.getstate', 'Random.setstate'],

  cheat: {
    commonCall: 'state = random.getstate(); ...; random.setstate(state)',
    returns:    '(3, (625 ints), gauss_next) / None',
    replaces:   'Re-seeding and re-drawing to get back to a point',
    watchOut:   'Only valid between Random-compatible generators; SystemRandom raises',
  },

  parameters: [
    { name: 'state', type: 'tuple', required: true, default: null, desc: 'setstate: an object returned by getstate() (version 3; version 2 tuples from old Pythons are converted).' },
  ],

  modes: [
    {
      id: 'replay',
      label: 'replay',
      blurb: 'Save the state, draw five numbers, restore, draw again: the same five.',
      params: [{ name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' }],
      template: 'import random\nrandom.seed({$seed})\nstate = random.getstate()\nfirst = [random.randint(1, 9) for _ in range(5)]\nrandom.setstate(state)\nagain = [random.randint(1, 9) for _ in range(5)]\n(first, again)',
      cases: [
        { id: 'fortytwo', label: 'seed 42',      values: { seed: '42' } },
        { id: 'text',     label: "seed 'hello'", values: { seed: 'hello' } },
      ],
    },
    {
      id: 'shape',
      label: 'inside the state',
      blurb: 'Version, tuple length, the position counter (last element) and the gauss cache after n calls to random().',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'n',    type: 'int',       hint: 'random() calls',     input: 'number' },
      ],
      template: 'import random\nrandom.seed({$seed})\nfor _ in range({$n}):\n    random.random()\nstate = random.getstate()\n(state[0], len(state[1]), state[1][-1], state[2])',
      cases: [
        { id: 'fresh', label: 'just seeded', values: { seed: '42', n: '0' } },
        { id: 'one',   label: '1 call',      values: { seed: '42', n: '1' } },
        { id: 'many',  label: '313 calls',   values: { seed: '42', n: '313' } },
      ],
    },
  ],
  demoExplainer: 'Right after seeding the position is 624: the array is "used up", so the first draw regenerates all 624 words and resets the position to 0. Each random() consumes two 32-bit words, so after one call the position is 2, and after 313 calls (626 words) it has wrapped around once and is 2 again. state[2] is None because no gauss() value is cached.',

  patterns: [
    {
      name: 'Checkpoint a simulation',
      desc: 'Save the state with your results; resume later with identical randomness.',
      code: "import pickle\nimport random\nwith open('checkpoint.pkl', 'wb') as f:\n    pickle.dump({'step': step, 'rng': random.getstate()}, f)",
    },
    {
      name: 'Try something, then undo the draws',
      desc: 'Peek at the next values without consuming them.',
      code: 'import random\nsaved = random.getstate()\npreview = [random.random() for _ in range(3)]\nrandom.setstate(saved)',
    },
    {
      name: 'Clone a generator',
      desc: 'Copy one Random instance into another.',
      code: 'import random\nclone = random.Random()\nclone.setstate(rng.getstate())',
    },
  ],

  examples: [
    { title: 'Replay the same draws',        code: 'import random\nrandom.seed(42)\nstate = random.getstate()\nfirst = [random.randint(1, 9) for _ in range(5)]\nrandom.setstate(state)\nagain = [random.randint(1, 9) for _ in range(5)]\n(first, again)', returns: '([2, 1, 5, 4, 4], [2, 1, 5, 4, 4])' },
    { title: 'What the state contains',      code: 'import random\nrandom.seed(42)\nstate = random.getstate()\n(state[0], len(state[1]), state[1][-1], state[2])', returns: '(3, 625, 624, None)' },
    { title: 'The first word after seeding', code: 'import random\nrandom.seed(42)\nrandom.getstate()[1][0]',                         returns: '2147483648' },
    { title: 'Rewind from the middle',       code: 'import random\nrandom.seed(42)\nrandom.random()\nsaved = random.getstate()\nx = random.random()\nrandom.setstate(saved)\nrandom.random() == x', returns: 'True' },
    { title: 'The gauss() cache travels too', code: 'import random\nr = random.Random(42)\nr.gauss()\nr2 = random.Random()\nr2.setstate(r.getstate())\nr.gauss() == r2.gauss()', returns: 'True' },
    { title: 'A wrong-size state',           code: 'import random\nrandom.setstate((3, (1, 2, 3), None))',                            returns: 'ValueError: state vector is the wrong size' },
    { title: 'A wrong version',              code: 'import random\nrandom.setstate((4, (), None))',                                     returns: 'ValueError: state with version 4 passed to Random.setstate() of version 3' },
  ],

  pitfalls: [
    {
      name: 'Re-seeding to rewind',
      desc: 'seed() goes back to the START of the sequence. To repeat a value from the middle you need the state from just before it.',
      wrong: { label: 'seed again', code: 'import random\nrandom.seed(42)\nrandom.random()\nx = random.random()\nrandom.seed(42)\nrandom.random() == x', output: 'False' },
      fix:   { label: 'getstate / setstate', code: 'import random\nrandom.seed(42)\nrandom.random()\nsaved = random.getstate()\nx = random.random()\nrandom.setstate(saved)\nrandom.random() == x', output: 'True' },
    },
    {
      name: 'SystemRandom has no state',
      desc: 'SystemRandom reads os.urandom(); there is nothing to save, so both methods raise.',
      wrong: { label: 'SystemRandom', code: 'import random\nrandom.SystemRandom().getstate()', output: 'NotImplementedError: System entropy source does not have state.' },
      fix:   { label: 'Random(seed)', code: 'import random\nrandom.Random(42).getstate()[0]', output: '3' },
    },
  ],

  when: {
    use: [
      'Checkpointing long simulations',
      'Peeking at upcoming values, or replaying a section exactly',
      'Copying the state of one Random into another',
    ],
    avoid: [
      'Starting a repeatable run → seed()',
      'Independent streams → separate random.Random(seed) instances',
      'Exchanging states between different generator classes',
    ],
  },

  notes: {
    cpython: 'Random.getstate returns (self.VERSION, super().getstate(), self.gauss_next); the C getstate returns the 624 state words plus the position index (0 to 624) as a 625-tuple of ints. setstate checks for a tuple of exactly 625 items and an index between 0 and 624 ("invalid state" otherwise)',
    'Platforms': 'The C code reads each word as an unsigned long: 32 bits on Windows, 64 on Linux. Values that do not fit 32 bits raise OverflowError on Windows but are truncated on Linux — only hand-made states are affected',
    'Pickling': 'Random instances pickle via getstate(), so pickle.dumps(rng) also captures the exact position',
  },

  related: [
    { name: 'random.seed',   slug: 'seed',         when: 'Restart from a known beginning' },
    { name: 'random.Random', slug: 'random-class', when: 'Instances have their own state' },
    { name: 'SystemRandom',  slug: 'systemrandom', when: 'Why it has no state' },
    { name: 'gauss / normalvariate', slug: 'gauss-normalvariate', when: 'The cached value in state[2]' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'What SystemRandom raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I save and restore the random state in Python?',
      a: 'state = random.getstate() saves it, random.setstate(state) restores it. The state is a plain tuple, so it can be pickled with your other data.',
    },
    {
      q: 'What is in the tuple returned by random.getstate()?',
      a: 'Three items: the version 3, a tuple of 625 ints (the 624 32-bit Mersenne Twister words plus the current position) and the value gauss() has cached for its next call, or None.',
    },
    {
      q: 'What is the difference between seed() and setstate()?',
      a: 'seed(x) builds a fresh state from x, always at the start of a sequence. setstate(s) restores a complete earlier snapshot, which can be anywhere in a sequence and includes the gauss() cache.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.getstate',
    meta:  'random.getstate and random.setstate',
  },
};
