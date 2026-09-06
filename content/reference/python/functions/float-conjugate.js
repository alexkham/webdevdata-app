// content/reference/python/functions/float-conjugate.js
//
// Slug is type-prefixed: `conjugate` exists on int, float and complex.

export const meta = {
  slug:        'float-conjugate',
  name:        'float.conjugate',
  signature:   'float.conjugate()',
  blurb:       'Returns the number unchanged — a real number is its own conjugate.',
  category:    'float',
  type:        'float',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'conjugate complex conjugate numeric tower real imaginary float identity',
};

export const method = {
  slug:      'float-conjugate',
  name:      'float.conjugate',
  signature: 'float.conjugate()',
  returns:   { type: 'float', desc: 'The same value back. A float has no imaginary part to negate, so the conjugate is the number itself.' },

  category:    'Float method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'An identity function, present for the same reason as int.conjugate — float is registered as a Complex number and must honour the interface.',

  cheat: {
    commonCall: 'x.conjugate()',
    returns:    'x — always, for every float',
    replaces:   'isinstance(v, complex) branching in numeric code',
    watchOut:   'on float it does nothing; the meaning only appears on complex',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'float', hint: 'a number, e.g. 2.5', input: 'float' },
  ],
  demoTemplate: 'float({n}).conjugate()',
  cases: [
    { id: 'fraction', label: 'fractional (2.5)', values: { n: 2.5 } },
    { id: 'negative', label: 'negative (-1.5)',  values: { n: -1.5 } },
    { id: 'zero',     label: 'zero',             values: { n: 0.0 } },
    { id: 'whole',    label: 'whole (4.0)',      values: { n: 4.0 } },
  ],
  demoExplainer: 'Every case returns its input. Conjugation negates the imaginary part of a complex number, and a float has none, so there is nothing to change. The method exists so that int, float and complex all answer the same call — which lets a formula written for complex numbers stay correct, and free, on real ones.',

  patterns: [
    {
      name: 'Magnitude squared for any numeric type',
      desc: 'z * z.conjugate() is real for complex and a plain square for float.',
      code: 'magnitude_sq = (z * z.conjugate()).real',
    },
    {
      name: 'Type-agnostic inner product',
      desc: 'The conjugate belongs in the formula and costs nothing on real inputs.',
      code: 'dot = sum(a * b.conjugate() for a, b in zip(xs, ys))',
    },
    {
      name: 'Write the maths once',
      desc: 'One implementation stays correct for float and complex callers alike.',
      code: 'def norm(z):\n    return abs(z * z.conjugate()) ** 0.5',
    },
  ],

  examples: [
    { title: 'Returns itself',   code: '(2.5).conjugate()',   returns: '2.5' },
    { title: 'Sign is kept',     code: '(-1.5).conjugate()',  returns: '-1.5' },
    { title: 'Zero',             code: '(0.0).conjugate()',   returns: '0.0' },
    { title: 'Where it matters', code: '(3+4j).conjugate()',  returns: '(3-4j)' },
    { title: 'int too',          code: '(5).conjugate()',     returns: '5' },
    { title: 'Real part is self',code: '(2.5).real',          returns: '2.5' },
  ],

  pitfalls: [
    {
      name: 'It is not negation',
      desc: 'Conjugation flips the sign of the IMAGINARY part only. Using it to negate a real number hands the value straight back, with no error to signal the mistake.',
      wrong: { label: 'Expected -2.5', code: '(2.5).conjugate()', output: '2.5' },
      fix:   { label: 'Negate instead', code: '-2.5', output: '-2.5' },
    },
    {
      name: 'It looks like dead code on floats',
      desc: 'A call that always returns its input invites deletion. Removing it quietly breaks the complex case the formula was written to handle.',
      wrong: { label: 'Tempting to remove', code: 'dot = sum(a * b for a, b in zip(xs, ys))', output: 'wrong once ys holds complex numbers' },
      fix:   { label: 'Keep it, note why',  code: 'dot = sum(a * b.conjugate() for a, b in zip(xs, ys))  # correct for complex too', output: 'correct for every numeric type' },
    },
    {
      name: 'Negative zero survives',
      desc: 'Conjugating -0.0 returns -0.0, not 0.0. The two compare equal, so the difference only shows in repr or when dividing, where the sign of zero changes the direction of infinity.',
      wrong: { label: 'Sign preserved', code: '(-0.0).conjugate()', output: '-0.0' },
      fix:   { label: 'Normalise if needed', code: '(-0.0).conjugate() + 0.0', output: '0.0' },
    },
  ],

  when: {
    use: [
      'Numeric code that must accept float and complex through one path',
      'Inner products, norms and magnitude formulas in their general form',
      'Implementing numbers.Complex on a custom numeric type',
    ],
    avoid: [
      'You know the value is a float — it returns the input unchanged',
      'You meant to negate → use -x',
      'You want the real or imaginary part → the .real and .imag attributes',
    ],
  },

  notes: {
    complexity: 'O(1) — returns the same value',
    return:     'The float itself, sign of zero included',
    cpython:    'Objects/floatobject.c :: float_conjugate',
    memory:     'No allocation',
    threadSafe: 'Yes — floats are immutable',
  },

  related: [
    { name: 'int.conjugate',          slug: 'int-conjugate',          when: 'The same identity on integers' },
    { name: 'complex',                slug: 'complex',                when: 'The type where conjugate changes the value' },
    { name: 'float.as_integer_ratio', slug: 'float-as_integer_ratio', when: 'Another method float shares with int' },
    { name: 'abs',                    slug: 'abs',                    when: 'Magnitude, which conjugation is a step toward' },
  ],

  faq: [
    {
      q: 'Why does float have a complex-number method?',
      a: 'PEP 3141 registers float in the numeric tower as a numbers.Complex, and that interface requires conjugate(), real and imag. float satisfies it the only way a real number can: the conjugate is itself and imag is 0.0.',
      code: 'import numbers\nisinstance(2.5, numbers.Complex)\n# True',
    },
    {
      q: 'What does conjugate do on an actual complex number?',
      a: 'It negates the imaginary part, so (3+4j) becomes (3-4j). Multiplying a number by its own conjugate produces a real result — the squared magnitude — which is why it appears throughout norms and inner products.',
      code: '(3+4j) * (3+4j).conjugate()\n# (25+0j)',
    },
    {
      q: 'Is there any reason to call it on a float deliberately?',
      a: 'Only inside a formula that must also accept complex values. Written that way it is free on floats and correct on complex, which is exactly what the shared numeric interface is for.',
    },
  ],

  history: [
    { version: '2.6', note: 'Added with PEP 3141, which registered float in the numbers ABC tower.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex',
    meta:  'Numeric types',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
