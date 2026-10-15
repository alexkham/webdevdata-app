// content/reference/python/stdlib/secrets/choice.js

export const meta = {
  slug:        'choice',
  name:        'secrets.choice',
  signature:   'secrets.choice(seq)',
  blurb:       'Pick one element of a non-empty sequence with the operating system\'s secure randomness — the building block for random passwords, PINs and passphrases.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.choice python random password generator secure random choice random character from string passphrase generator diceware secrets.choice vs random.choice cannot choose from an empty sequence set object is not subscriptable',
};

export const method = {
  slug:      'choice',
  name:      'secrets.choice',
  signature: 'secrets.choice(seq)',
  returns:   { type: 'object', desc: 'One element of seq — a one-character str when seq is a str.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'random.Random.choice running on a SystemRandom: every position of the sequence is equally likely, and the pick cannot be predicted or replayed. It indexes the sequence, so str, list, tuple and range work, while sets and dicts must be turned into a list first.',

  covers: ['choice'],

  cheat: {
    commonCall: 'secrets.choice(string.ascii_letters + string.digits)',
    returns:    'one element; a 1-character str for a str',
    replaces:   'random.choice for passwords, PINs and anything an attacker must not guess',
    watchOut:   'Empty sequence → IndexError; a set → TypeError',
  },

  parameters: [
    { name: 'seq', type: 'sequence', required: true, default: null, desc: 'A non-empty sequence with len() and integer indexing: str, list, tuple, range, bytes. An empty one raises IndexError: Cannot choose from an empty sequence.' },
  ],

  modes: [
    {
      id: 'password',
      label: 'random password',
      blurb: 'One choice per character. The password changes every run; its length, and that every character comes from the alphabet, do not.',
      params: [
        { name: 'alphabet', type: 'str', hint: 'allowed characters', input: 'text' },
        { name: 'length',   type: 'int', hint: 'characters',         input: 'number' },
      ],
      template: "import secrets\nalphabet = {$alphabet}\npassword = ''.join(secrets.choice(alphabet) for _ in range({$length}))\n(len(password), set(password) <= set(alphabet))",
      cases: [
        { id: 'alnum', label: 'letters + digits', values: { alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: '16' } },
        { id: 'pin',   label: 'digits only',      values: { alphabet: '0123456789', length: '6' } },
        { id: 'dna',   label: 'ACGT',             values: { alphabet: 'ACGT', length: '20' } },
        { id: 'empty', label: 'empty alphabet',   values: { alphabet: '', length: '8' } },
        { id: 'none',  label: 'length 0',         values: { alphabet: '', length: '0' } },
      ],
    },
    {
      id: 'passphrase',
      label: 'passphrase',
      blurb: 'Diceware-style: pick whole words from a list. Each word is chosen independently, so repeats are possible.',
      params: [
        { name: 'words', type: 'list[str]', hint: 'comma-separated words', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'words to pick',         input: 'number' },
      ],
      template: 'import secrets\nwords = {$words}\nphrase = [secrets.choice(words) for _ in range({$n})]\n(len(phrase), all(w in words for w in phrase))',
      cases: [
        { id: 'xkcd',  label: '4 of 4 words', values: { words: 'correct, horse, battery, staple', n: '4' } },
        { id: 'more',  label: '6 words',      values: { words: 'apple, river, stone, cloud, lamp, violin, tiger, maple', n: '6' } },
        { id: 'empty', label: 'empty list',   values: { words: '', n: '3' } },
      ],
    },
  ],
  demoExplainer: 'The characters change every run; what never changes is the length and that every character comes from the alphabet. An empty alphabet raises IndexError: Cannot choose from an empty sequence — but only if at least one character is requested: with length 0, choice is never called and the result is (0, True). In the passphrase tab the four words may repeat, because each pick is independent.',

  patterns: [
    {
      name: 'Random password',
      desc: 'Letters, digits and punctuation; 16 characters is about 105 bits with this alphabet.',
      code: "import secrets, string\nalphabet = string.ascii_letters + string.digits + string.punctuation\npassword = ''.join(secrets.choice(alphabet) for _ in range(16))",
    },
    {
      name: 'Password that must contain every character class',
      desc: 'Draw again until the rules are met (the approach of the docs\' recipes) instead of forcing characters into fixed positions.',
      code: "import secrets, string\nalphabet = string.ascii_letters + string.digits\nwhile True:\n    pw = ''.join(secrets.choice(alphabet) for _ in range(12))\n    if any(c.islower() for c in pw) and any(c.isupper() for c in pw) and any(c.isdigit() for c in pw):\n        break",
    },
    {
      name: 'Passphrase from a word list',
      desc: 'Four or more words from a large list (on Linux, /usr/share/dict/words often exists).',
      code: "import secrets\nwith open('words.txt', encoding='utf-8') as f:\n    words = [w.strip() for w in f if w.strip()]\nphrase = ' '.join(secrets.choice(words) for _ in range(5))",
    },
    {
      name: 'Pick from a set',
      desc: 'Sort it (or list() it) first: choice needs indexing.',
      code: 'import secrets\nwinner = secrets.choice(sorted(entrants))',
    },
  ],

  examples: [
    { title: 'One character of a string',  code: "import secrets\nsecrets.choice('abc') in 'abc'", returns: 'True' },
    { title: 'A 12-character password',    code: "import secrets, string\npw = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))\n(len(pw), pw.isascii(), pw.isalnum())", returns: '(12, True, True)' },
    { title: 'Any sequence works',         code: 'import secrets\nsecrets.choice(range(1, 7)) in range(1, 7)', returns: 'True' },
    { title: 'A one-element sequence',     code: "import secrets\nsecrets.choice(['only'])", returns: "'only'" },
    { title: 'Empty sequence',             code: 'import secrets\nsecrets.choice([])', returns: 'IndexError: Cannot choose from an empty sequence' },
    { title: 'A set is not a sequence',    code: "import secrets\nsecrets.choice({'a', 'b'})", returns: "TypeError: 'set' object is not subscriptable" },
    { title: 'Bound to a SystemRandom',    code: 'import secrets\ntype(secrets.choice.__self__).__name__', returns: "'SystemRandom'" },
  ],

  pitfalls: [
    {
      name: 'Choosing from a set or dict',
      desc: 'choice indexes the sequence with a random position. A set has no positions; a dict would be indexed by keys 0, 1, … Sort or list it first.',
      wrong: { label: 'choice(set)',         code: "import secrets\nsecrets.choice({'red', 'green', 'blue'})", output: "TypeError: 'set' object is not subscriptable" },
      fix:   { label: 'choice(sorted(set))', code: "import secrets\ncolours = {'red', 'green', 'blue'}\nsecrets.choice(sorted(colours)) in colours", output: 'True' },
    },
    {
      name: 'Generating passwords with random.choice',
      desc: 'random is a seeded Mersenne Twister: with the same seed, the "random" password comes out again. secrets.choice reads the operating system\'s source and cannot be replayed.',
      wrong: { label: 'random.Random(2024)', code: "import random, string\ndef make(rng):\n    return ''.join(rng.choice(string.ascii_letters) for _ in range(10))\nmake(random.Random(2024)) == make(random.Random(2024))", output: 'True' },
      fix:   { label: 'secrets.choice',      code: "import secrets, string\ndef make():\n    return ''.join(secrets.choice(string.ascii_letters) for _ in range(10))\nmake() == make()", output: 'False' },
    },
  ],

  when: {
    use: [
      'Random passwords, PINs, recovery codes and passphrases',
      'Picking a winner, a server or a question an attacker must not predict',
    ],
    avoid: [
      'Several distinct picks → secrets.SystemRandom().sample(population, k)',
      'Weighted picks → secrets.SystemRandom().choices(population, weights=…)',
      'A random number in a range → randbelow',
      'Reproducible picks for tests and games → random.Random(seed).choice',
    ],
  },

  notes: {
    cpython:      'choice = _sysrand.choice — random.Random.choice on a module-level SystemRandom: if not len(seq): raise IndexError(...); return seq[self._randbelow(len(seq))]',
    'Uniformity': '_randbelow draws len(seq).bit_length() random bits and draws again while the value is too large, so every position is equally likely — no modulo bias',
    'Exceptions': 'IndexError: Cannot choose from an empty sequence; TypeError for objects without len() or indexing (sets, ints, generators)',
  },

  related: [
    { name: 'secrets.randbelow',    slug: 'randbelow',    when: 'A random index or number instead of an element' },
    { name: 'secrets.SystemRandom', slug: 'systemrandom', when: 'sample, shuffle and choices with the same source' },
    { name: 'secrets.token_urlsafe', slug: 'token_urlsafe', when: 'A random token instead of a password' },
    { name: 'random.choice',        slug: 'choice',       when: 'The same method on the predictable generator', category: 'stdlib/random' },
    { name: 'string module',        slug: 'string',       when: 'ascii_letters, digits, punctuation alphabets', category: 'stdlib' },
    { name: 'IndexError',           slug: 'indexerror',   when: 'What an empty sequence raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I generate a random password in Python?',
      a: "alphabet = string.ascii_letters + string.digits + string.punctuation, then ''.join(secrets.choice(alphabet) for _ in range(16)). If the password must contain certain character classes, generate again until it does rather than placing them at fixed positions.",
    },
    {
      q: 'What is the difference between secrets.choice and random.choice?',
      a: 'The algorithm is the same (random.Random.choice); the source differs. random.choice uses the seeded Mersenne Twister, whose output can be reconstructed. secrets.choice is bound to a SystemRandom that reads os.urandom and cannot be seeded.',
    },
    {
      q: 'Why does secrets.choice raise "TypeError: \'set\' object is not subscriptable"?',
      a: 'choice picks a random index and reads seq[index]. Sets have no order or indexes. Pass sorted(the_set) or list(the_set).',
    },
    {
      q: 'How long should a random password be?',
      a: 'Each character from a 62-character alphabet (letters and digits) adds log2(62) ≈ 5.95 bits, so 16 characters give about 95 bits and 20 give about 119 — far beyond guessing. Longer is cheap when a password manager stores it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.choice',
    meta:  'secrets.choice',
  },

};
