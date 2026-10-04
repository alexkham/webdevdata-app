// content/reference/python/stdlib/random/choice.js

export const meta = {
  slug:        'choice',
  name:        'random.choice',
  signature:   'random.choice(seq)',
  blurb:       'One random element of a non-empty sequence (list, tuple, str, range); IndexError when the sequence is empty.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'random.choice choice python pick random item from list random element random character random from list cannot choose from an empty sequence Random.choice',
};

export const method = {
  slug:      'choice',
  name:      'random.choice',
  signature: 'random.choice(seq)',
  returns:   { type: 'object', desc: 'seq[i] for a uniformly random index i.' },

  category:    'random function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'It computes seq[random index], so it needs len() and indexing: lists, tuples, strings and ranges work; sets fail with TypeError and dicts fail with a confusing KeyError.',

  covers: ['choice', 'Random.choice'],

  cheat: {
    commonCall: "random.choice(['rock', 'paper', 'scissors'])",
    returns:    'one element of the sequence',
    replaces:   'seq[random.randrange(len(seq))]',
    watchOut:   'Empty sequence → IndexError; dict → KeyError',
  },

  parameters: [
    { name: 'seq', type: 'Sequence', required: true, default: null, desc: 'Anything with len() and integer indexing. Must not be empty.' },
  ],

  modes: [
    {
      id: 'pick',
      label: 'from a list',
      blurb: 'Five independent picks: the same item can come up again.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string',    input: 'auto' },
        { name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[random.choice({$items}) for _ in range(5)]',
      cases: [
        { id: 'fruit', label: 'three fruits', values: { seed: '42', items: 'apple, banana, cherry' } },
        { id: 'one',   label: 'one item',     values: { seed: '42', items: 'only' } },
        { id: 'empty', label: 'empty list',   values: { seed: '42', items: '' } },
      ],
    },
    {
      id: 'text',
      label: 'from a string',
      blurb: 'A str is a sequence of characters, so choice returns one character.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'text', type: 'str',       hint: 'characters',         input: 'text' },
      ],
      template: 'import random\nrandom.seed({$seed})\nrandom.choice({$text})',
      cases: [
        { id: 'letters', label: 'abcdef',       values: { seed: '42', text: 'abcdef' } },
        { id: 'coin',    label: 'HT',           values: { seed: '7', text: 'HT' } },
        { id: 'empty',   label: 'empty string', values: { seed: '42', text: '' } },
      ],
    },
  ],
  demoExplainer: 'choice() checks len(seq) first, so an empty list or string raises IndexError: Cannot choose from an empty sequence before any random number is drawn. Otherwise it draws an index with _randbelow(len(seq)) (getrandbits plus rejection, exact for any length) and returns seq[index].',

  patterns: [
    {
      name: 'Random greeting or response',
      desc: 'Pick from a list of alternatives.',
      code: "import random\nreply = random.choice(['Hi!', 'Hello!', 'Hey there!'])",
    },
    {
      name: 'Random key of a dict',
      desc: 'Convert to a list first: choice needs indexing.',
      code: 'import random\nname = random.choice(list(scores))\nname, score = random.choice(list(scores.items()))',
    },
    {
      name: 'Random password character (secure)',
      desc: 'secrets.choice has the same interface but an unpredictable source.',
      code: "import secrets\nimport string\npassword = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))",
    },
  ],

  examples: [
    { title: 'Pick from a list',             code: "import random\nrandom.seed(42)\nrandom.choice(['rock', 'paper', 'scissors'])",       returns: "'scissors'" },
    { title: 'A character from a string',    code: "import random\nrandom.seed(42)\nrandom.choice('abcdef')",                           returns: "'f'" },
    { title: 'Coin flips',                   code: "import random\nrandom.seed(42)\n[random.choice('HT') for _ in range(10)]",            returns: "['H', 'H', 'T', 'H', 'H', 'H', 'H', 'H', 'T', 'H']" },
    { title: 'From a range',                 code: 'import random\nrandom.seed(42)\nrandom.choice(range(100, 200))',                    returns: '181' },
    { title: 'A random (key, value) pair',   code: "import random\nrandom.seed(42)\nusers = {'ann': 3, 'bob': 5, 'cy': 1}\nrandom.choice(list(users.items()))", returns: "('cy', 1)" },
    { title: 'Empty sequence',               code: 'import random\nrandom.choice([])',                                                  returns: 'IndexError: Cannot choose from an empty sequence' },
    { title: 'A set is not a sequence',      code: 'import random\nrandom.choice({1, 2, 3})',                                           returns: "TypeError: 'set' object is not subscriptable" },
  ],

  pitfalls: [
    {
      name: 'Choosing from a dict',
      desc: 'A dict has len(), so choice() picks an index and looks it up as a KEY: you get KeyError (or a value whose key happens to be that int). Convert to list(d) or list(d.items()).',
      wrong: { label: 'choice(dict)',       code: "import random\nrandom.seed(42)\nrandom.choice({'a': 1, 'b': 2})",       output: 'KeyError: 0' },
      fix:   { label: 'choice(list(dict))', code: "import random\nrandom.seed(42)\nrandom.choice(list({'a': 1, 'b': 2}))", output: "'a'" },
    },
    {
      name: 'Choosing from a set',
      desc: 'Sets are unordered and not indexable. Sort them (or list() them, if a repeatable result does not matter) first.',
      wrong: { label: 'choice(set)',         code: "import random\nrandom.seed(42)\nrandom.choice({'x', 'y', 'z'})",         output: "TypeError: 'set' object is not subscriptable" },
      fix:   { label: 'choice(sorted(set))', code: "import random\nrandom.seed(42)\nrandom.choice(sorted({'x', 'y', 'z'}))", output: "'z'" },
    },
  ],

  when: {
    use: [
      'One random element of a list, tuple, str or range',
      'Repeated independent picks (with repetition)',
    ],
    avoid: [
      'Several picks at once → choices(seq, k=n) (with repeats) or sample(seq, n) (without)',
      'Weighted picks → choices(seq, weights=...)',
      'Secrets → secrets.choice',
    ],
  },

  notes: {
    cpython: "Lib/random.py: if not len(seq): raise IndexError('Cannot choose from an empty sequence'); return seq[self._randbelow(len(seq))] — integer arithmetic only, so results are identical on every platform",
    'Why len()': 'It tests len(seq) instead of truthiness so that NumPy arrays work',
    'vs choices': 'choices() without weights uses floor(random() * n) instead, so for the same seed it picks different items than repeated choice() calls',
  },

  related: [
    { name: 'random.choices', slug: 'choices', when: 'k picks at once, optionally weighted' },
    { name: 'random.sample',  slug: 'sample',  when: 'k distinct picks' },
    { name: 'random.shuffle', slug: 'shuffle', when: 'Random order of all items' },
    { name: 'IndexError',     slug: 'indexerror', when: 'Raised for an empty sequence', category: 'exceptions' },
    { name: 'list()',         slug: 'list',    when: 'Turn dict keys or a set into a sequence', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I pick a random item from a list in Python?',
      a: 'random.choice(my_list). For several items use random.sample(my_list, k) (no repeats) or random.choices(my_list, k=k) (repeats allowed).',
    },
    {
      q: 'What does "IndexError: Cannot choose from an empty sequence" mean?',
      a: 'The list, string or tuple passed to random.choice() was empty. Check it first (if items: ...) or provide a default.',
    },
    {
      q: 'Why does random.choice on a dict raise KeyError: 0?',
      a: 'choice() picks a random index i and returns seq[i]; for a dict that is a key lookup of the int i. Use random.choice(list(d)) for a key or random.choice(list(d.items())) for a pair.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#random.choice',
    meta:  'random.choice',
  },
};
