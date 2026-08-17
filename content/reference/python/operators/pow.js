// content/reference/python/operators/pow.js

export const meta = {
  slug:        'pow',
  name:        '**',
  signature:   'a ** b',
  blurb:       'Exponentiation — right-associative, and ^ is NOT this.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'power exponent exponentiation squared cube double star operator',
};

export const method = {
  slug:      'pow',
  name:      '**',
  signature: 'a ** b',
  returns:   { type: 'number', desc: 'a raised to the power b. Negative exponents produce floats; int ** positive-int stays exact int.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Real exponentiation — 2 ** 10 is 1024, and the ^ you might reach for is XOR.',

  cheat: {
    commonCall: '2 ** 10',
    returns:    'int for int ** non-negative int, float otherwise',
    replaces:   'right-associative: 2 ** 3 ** 2 is 2 ** 9 = 512',
    watchOut:   '2 ^ 10 is 8 — that is XOR, not power',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Base.' },
    { name: 'b', type: 'number', required: true, default: null, desc: 'Exponent — negative gives a float, fractional gives roots.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'base',     input: 'float' },
    { name: 'b', type: 'float', hint: 'exponent', input: 'float' },
  ],
  demoTemplate: '{a} ** {b}',
  cases: [
    { id: 'default',  label: 'default',       values: { a: 2, b: 10 } },
    { id: 'negexp',   label: 'negative exp',  values: { a: 2, b: -1 } },
    { id: 'root',     label: 'square root',   values: { a: 9, b: 0.5 } },
    { id: 'zeroneg',  label: '0 ** -1',       values: { a: 0, b: -1 } },
  ],
  demoExplainer: 'Negative exponents flip into fractions (2 ** -1 is 0.5) and fractional exponents take roots (9 ** 0.5 is 3.0). Zero to a negative power raises Python’s exact error.',

  patterns: [
    {
      name: 'Squares and roots',
      desc: '** 0.5 is the idiomatic quick square root.',
      code: 'dist = (dx**2 + dy**2) ** 0.5',
    },
    {
      name: 'Powers of two',
      desc: 'Sizes, limits, bit-work — exact big ints included.',
      code: 'max_int64 = 2 ** 63 - 1',
    },
    {
      name: 'Modular exponentiation',
      desc: 'The three-argument pow() built-in is far faster than ** then %.',
      code: 'pow(base, exp, modulus)   # crypto-sized numbers',
    },
  ],

  examples: [
    { title: 'Integer power',        code: '2 ** 10',      returns: '1024' },
    { title: 'Negative exponent',    code: '2 ** -1',      returns: '0.5' },
    { title: 'Square root',          code: '9 ** 0.5',     returns: '3.0' },
    { title: 'Right associativity',  code: '2 ** 3 ** 2',  returns: '512' },
  ],

  pitfalls: [
    {
      name: '^ is XOR, not power',
      desc: 'The single caret is bitwise exclusive-or — a silent, wildly different result.',
      wrong: { label: 'Silent wrong answer', code: '2 ^ 10', output: '8' },
      fix:   { label: 'Fix', code: '2 ** 10', output: '1024' },
    },
    {
      name: 'Right-associative chains',
      desc: '2 ** 3 ** 2 groups as 2 ** (3 ** 2) — unlike most operators.',
      wrong: { label: 'Expected 64?', code: '2 ** 3 ** 2', output: '512' },
      fix:   { label: 'Parenthesize intent', code: '(2 ** 3) ** 2', output: '64' },
    },
    {
      name: 'Unary minus binds looser',
      desc: '-2 ** 2 is -(2 ** 2), not (-2) ** 2.',
      wrong: { label: 'Surprising', code: '-2 ** 2', output: '-4' },
      fix:   { label: 'Fix', code: '(-2) ** 2', output: '4' },
    },
  ],

  when: {
    use: [
      'Exact integer powers (arbitrary precision)',
      'Quick roots via fractional exponents',
      'Readable squared/cubed math',
    ],
    avoid: [
      'Modular exponentiation → pow(a, b, m)',
      'Heavy float math → math.pow / math.sqrt (clearer intent)',
      'Bit flips → that IS ^ (bitwise XOR)',
    ],
  },

  notes: {
    complexity: 'O(log b) multiplications for int powers',
    return:     'int stays exact; negative/fractional exponents give float',
    cpython:    'Objects/abstract.c :: PyNumber_Power → __pow__',
    memory:     'Big int powers allocate as needed — 2**10000 is fine',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '^',   slug: 'bitwise-xor', when: 'What ^ actually does' },
    { name: '*',   slug: 'mul',         when: 'Plain multiplication' },
    { name: 'round', slug: 'round',     when: 'Trim float-power results', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is ** right-associative?',
      a: 'Convention from mathematics: a^(b^c) is the useful reading of stacked exponents, so Python groups from the right.',
    },
    {
      q: 'Is there a limit to integer powers?',
      a: 'Only memory — Python ints are arbitrary precision, so 2 ** 10000 is a real 3011-digit number.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#the-power-operator',
    meta:  'the power operator',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
