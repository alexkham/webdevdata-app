// content/reference/python/stdlib/secrets/randbelow.js

export const meta = {
  slug:        'randbelow',
  name:        'secrets.randbelow',
  signature:   'secrets.randbelow(exclusive_upper_bound)',
  blurb:       'A secure random int from 0 up to, but not including, the bound — for one-time codes, PINs, dice and random indexes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'secrets.randbelow randbelow python secure random number in range random int cryptographically secure otp code 6 digit code generator pin generator dice upper bound must be positive exclusive upper bound',
};

export const method = {
  slug:      'randbelow',
  name:      'secrets.randbelow',
  signature: 'secrets.randbelow(exclusive_upper_bound)',
  returns:   { type: 'int', desc: 'A uniformly distributed int with 0 <= result < exclusive_upper_bound.' },

  category:    'secrets function',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'The bound is exclusive: randbelow(6) gives 0 to 5, never 6 — add 1 for a die. Behind a positivity check it is SystemRandom._randbelow, so every value is equally likely (no modulo bias) and nothing can be seeded or replayed.',

  covers: ['randbelow'],

  cheat: {
    commonCall: "f'{secrets.randbelow(10**6):06d}'",
    returns:    'int in range(exclusive_upper_bound)',
    replaces:   'random.randrange(n) and random.randint(0, n - 1) for anything secret',
    watchOut:   'The bound itself is never returned; 0 or less raises ValueError',
  },

  parameters: [
    { name: 'exclusive_upper_bound', type: 'int', required: true, default: null, desc: 'One more than the largest possible result; must be positive. Any size works (2**256 too). A positive float raises AttributeError (a float <= 0 fails the positivity check first).' },
  ],

  modes: [
    {
      id: 'die',
      label: 'roll a die',
      blurb: '1 + randbelow(sides), rolled 1000 times: the smallest and largest roll seen. Both ends show up; sides + 1 never does. The browser demo stops above 40 sides, where the two values would change from run to run.',
      params: [{ name: 'sides', type: 'int', hint: 'sides of the die', input: 'number' }],
      template: 'import secrets\nrolls = [1 + secrets.randbelow({$sides}) for _ in range(1000)]\n(min(rolls), max(rolls))',
      cases: [
        { id: 'd6',   label: '6 sides',  values: { sides: '6' } },
        { id: 'd20',  label: '20 sides', values: { sides: '20' } },
        { id: 'coin', label: '2 sides',  values: { sides: '2' } },
        { id: 'one',  label: '1 side',   values: { sides: '1' } },
        { id: 'zero', label: '0 sides',  values: { sides: '0' } },
      ],
    },
    {
      id: 'code',
      label: 'one-time code',
      blurb: 'A numeric code with a fixed number of digits: draw below 10 ** digits and pad with zeros.',
      params: [{ name: 'digits', type: 'int', hint: 'digits', input: 'number' }],
      template: "import secrets\ncode = f'{secrets.randbelow(10 ** {$digits}):0{$digits}d}'\n(len(code), code.isdigit())",
      cases: [
        { id: 'six',   label: '6 digits',  values: { digits: '6' } },
        { id: 'four',  label: '4 digits',  values: { digits: '4' } },
        { id: 'eight', label: '8 digits',  values: { digits: '8' } },
        { id: 'neg',   label: '-1 digits', values: { digits: '-1' } },
      ],
    },
  ],
  demoExplainer: 'randbelow(6) returns 0 to 5, so 1 + randbelow(6) is a fair die: in 1000 rolls both 1 and 6 appear. randbelow(1) can only return 0, and a bound of 0 raises ValueError: Upper bound must be positive. In the code tab the zero padding matters: a 6-digit code may legitimately be 004217. With -1 digits the bound 10 ** -1 is the float 0.1, which passes the positivity check and then fails with AttributeError: \'float\' object has no attribute \'bit_length\'.',

  patterns: [
    {
      name: 'Six-digit one-time code',
      desc: 'Keep leading zeros: 000000 to 999999 are all valid codes.',
      code: "import secrets\notp = f'{secrets.randbelow(10**6):06d}'",
    },
    {
      name: 'Secure number in an arbitrary range',
      desc: 'Shift the result for a range that does not start at 0 (here 100 to 199).',
      code: 'import secrets\nlow, high = 100, 200\nn = low + secrets.randbelow(high - low)',
    },
    {
      name: 'Random index into a list',
      desc: 'Guard the empty list: randbelow(0) raises.',
      code: 'import secrets\nif items:\n    item = items[secrets.randbelow(len(items))]',
    },
    {
      name: 'Random retry delay',
      desc: 'Jitter in whole milliseconds that clients cannot predict.',
      code: 'import secrets, time\ntime.sleep((500 + secrets.randbelow(1000)) / 1000)',
    },
  ],

  examples: [
    { title: 'Always below the bound',      code: 'import secrets\nall(0 <= secrets.randbelow(10) < 10 for _ in range(1000))', returns: 'True' },
    { title: 'randbelow(1) is always 0',    code: 'import secrets\nsecrets.randbelow(1)', returns: '0' },
    { title: 'A fair die: 1 to 6',          code: 'import secrets\n{1 + secrets.randbelow(6) for _ in range(1000)} == {1, 2, 3, 4, 5, 6}', returns: 'True' },
    { title: 'Six-digit code',              code: "import secrets\ncode = f'{secrets.randbelow(10**6):06d}'\n(len(code), code.isdigit())", returns: '(6, True)' },
    { title: 'Huge bounds work',            code: 'import secrets\nsecrets.randbelow(2**256) < 2**256', returns: 'True' },
    { title: 'Zero is not a bound',         code: 'import secrets\nsecrets.randbelow(0)', returns: 'ValueError: Upper bound must be positive.' },
    { title: 'Floats are rejected',         code: 'import secrets\nsecrets.randbelow(10.0)', returns: "AttributeError: 'float' object has no attribute 'bit_length'" },
  ],

  pitfalls: [
    {
      name: 'Expecting the bound itself',
      desc: 'randbelow(n) stops at n - 1. For a die (1 to 6) add 1 to randbelow(6) instead of calling randbelow(7).',
      wrong: { label: 'randbelow(6) for 1-6', code: 'import secrets\nsorted({secrets.randbelow(6) for _ in range(1000)})', output: '[0, 1, 2, 3, 4, 5]' },
      fix:   { label: '1 + randbelow(6)',     code: 'import secrets\nsorted({1 + secrets.randbelow(6) for _ in range(1000)})', output: '[1, 2, 3, 4, 5, 6]' },
    },
    {
      name: 'Reducing random bytes with %',
      desc: '256 byte values do not split evenly into 6: with token_bytes(1)[0] % 6 the results 0 to 3 have 43 chances in 256 and 4 and 5 only 42. randbelow draws 3 bits (0 to 7) and simply draws again on 6 or 7, so each result keeps exactly one chance in six.',
      wrong: { label: 'byte % 6',              code: 'from collections import Counter\nCounter(b % 6 for b in range(256))', output: 'Counter({0: 43, 1: 43, 2: 43, 3: 43, 4: 42, 5: 42})' },
      fix:   { label: 'rejection (randbelow)', code: 'from collections import Counter\nCounter(b for b in range(8) if b < 6)', output: 'Counter({0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1})' },
    },
    {
      name: 'An empty list as the bound',
      desc: 'len() of an empty list is 0, and randbelow(0) raises. Check first.',
      wrong: { label: 'randbelow(len([]))', code: 'import secrets\nitems = []\nsecrets.randbelow(len(items))', output: 'ValueError: Upper bound must be positive.' },
      fix:   { label: 'guard',              code: "import secrets\nitems = []\nitems[secrets.randbelow(len(items))] if items else 'nothing to pick'", output: "'nothing to pick'" },
    },
  ],

  when: {
    use: [
      'One-time codes, PINs and verification numbers',
      'Dice, random indexes and jitter where fairness and unpredictability matter',
    ],
    avoid: [
      'A range not starting at 0 → low + randbelow(high - low), or SystemRandom().randint(a, b)',
      'k random bits → randbits(k)',
      'Reproducible numbers → random.Random(seed).randrange(n)',
    ],
  },

  notes: {
    cpython:        'if exclusive_upper_bound <= 0: raise ValueError("Upper bound must be positive."); return _sysrand._randbelow(exclusive_upper_bound) — Lib/secrets.py',
    'No modulo bias': '_randbelow takes k = n.bit_length() random bits and draws again while the value is >= n — at most 2 draws on average (exactly 2 when n is a power of two)',
    'Floats':       'The <= 0 check accepts a positive float; .bit_length() then fails with AttributeError',
  },

  related: [
    { name: 'secrets.randbits',     slug: 'randbits',          when: 'A random int of k bits' },
    { name: 'secrets.choice',       slug: 'choice',            when: 'A random element instead of an index' },
    { name: 'secrets.SystemRandom', slug: 'systemrandom',      when: 'randint / randrange with both bounds' },
    { name: 'random.randint / randrange', slug: 'randint-randrange', when: 'The predictable equivalents', category: 'stdlib/random' },
    { name: 'ValueError',           slug: 'valueerror',        when: 'What a bound of 0 or less raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I generate a secure random number in a range in Python?',
      a: 'secrets.randbelow(n) for 0 to n - 1; low + secrets.randbelow(high - low) for low to high - 1; or secrets.SystemRandom().randint(a, b) when both ends should be included.',
    },
    {
      q: 'How do I generate a 6-digit OTP code in Python?',
      a: "f'{secrets.randbelow(10**6):06d}' — a uniform number below one million, padded to six digits, so codes starting with 0 are possible like all the others.",
    },
    {
      q: 'Is the upper bound of secrets.randbelow included?',
      a: 'No. randbelow(n) returns 0 to n - 1, like range(n). randbelow(1) is always 0.',
    },
    {
      q: 'What does "ValueError: Upper bound must be positive." mean?',
      a: 'The bound was 0 or negative — often len() of an empty list. There is no number in range(0) to return.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/secrets.html#secrets.randbelow',
    meta:  'secrets.randbelow',
  },

};
