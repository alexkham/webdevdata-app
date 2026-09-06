// content/reference/python/functions/complex-conjugate.js
//
// Slug is type-prefixed: `conjugate` exists on int, float and complex.

export const meta = {
  slug:        'complex-conjugate',
  name:        'complex.conjugate',
  signature:   'complex.conjugate()',
  blurb:       'Flip the sign of the imaginary part — the one type where conjugate does something.',
  category:    'complex',
  type:        'complex',
  hasLiveDemo: true,
  version:     'Python 1.4+',
  searchTerms: 'complex conjugate imaginary part negate magnitude modulus signal processing j',
};

export const method = {
  slug:      'complex-conjugate',
  name:      'complex.conjugate',
  signature: 'complex.conjugate()',
  returns:   { type: 'complex', desc: 'A new complex number with the same real part and the imaginary part negated.' },

  category:    'Complex method',
  version:     'Python 1.4+',
  hasLiveDemo: true,

  subtitle: 'On int and float this method is an identity. Here it is the real thing: (3+4j) becomes (3-4j), mirroring the point across the real axis.',

  cheat: {
    commonCall: 'z.conjugate()',
    returns:    'complex — same real part, opposite imaginary part',
    replaces:   'complex(z.real, -z.imag)',
    watchOut:   'z * z.conjugate() is real, but its type is still complex',
  },

  parameters: [],

  demoParams: [
    { name: 're', type: 'float', hint: 'real part',      input: 'float' },
    { name: 'im', type: 'float', hint: 'imaginary part', input: 'float' },
  ],
  demoTemplate: 'complex({re}, {im}).conjugate()',
  cases: [
    { id: 'basic',    label: '3 + 4j',        values: { re: 3, im: 4 } },
    { id: 'negative', label: '-2 - 5j',       values: { re: -2, im: -5 } },
    { id: 'pure-imag',label: 'no real part',  values: { re: 0, im: 4 } },
    { id: 'pure-real',label: 'no imaginary',  values: { re: 3, im: 0 } },
    { id: 'fraction', label: 'fractional',    values: { re: 1.5, im: 2.5 } },
  ],
  demoExplainer: 'Only the imaginary sign changes: 3+4j becomes 3-4j, and -2-5j becomes -2+5j. Watch the display rules, which surprise people more than the maths. When the real part is zero Python drops it entirely and prints -4j rather than (0-4j). When the real part is present you get parentheses. Whole numbers also lose their trailing .0, so you see 3 rather than 3.0 even though both parts are floats.',

  patterns: [
    {
      name: 'Squared magnitude',
      desc: 'z times its conjugate is always real — the classic use.',
      code: 'mag_sq = (z * z.conjugate()).real',
    },
    {
      name: 'Divide by a complex number',
      desc: 'Multiplying top and bottom by the conjugate makes the denominator real.',
      code: 'quotient = (a * b.conjugate()) / (b * b.conjugate()).real',
    },
    {
      name: 'Hermitian inner product',
      desc: 'The conjugate on one side is what makes the result well behaved.',
      code: 'dot = sum(a * b.conjugate() for a, b in zip(xs, ys))',
    },
  ],

  examples: [
    { title: 'Flips the sign',     code: '(3+4j).conjugate()',   returns: '(3-4j)' },
    { title: 'Both negative',      code: '(-2-5j).conjugate()',  returns: '(-2+5j)' },
    { title: 'Pure imaginary',     code: '(4j).conjugate()',     returns: '-4j' },
    { title: 'Product is real',    code: '(3+4j) * (3+4j).conjugate()', returns: '(25+0j)' },
    { title: 'Applied twice',      code: '(3+4j).conjugate().conjugate()', returns: '(3+4j)' },
    { title: 'Real numbers unchanged', code: '(2.5).conjugate()', returns: '2.5' },
  ],

  pitfalls: [
    {
      name: 'The product is real in value but complex in type',
      desc: 'z * z.conjugate() gives (25+0j), not 25. Feeding that into code expecting a float works until something calls math.sqrt or formats it, at which point the +0j surfaces.',
      wrong: { label: 'Still complex', code: 'import math\nmath.sqrt((3+4j) * (3+4j).conjugate())', output: "TypeError: can't convert complex to float" },
      fix:   { label: 'Take .real',    code: 'math.sqrt(((3+4j) * (3+4j).conjugate()).real)', output: '5.0' },
    },
    {
      name: 'abs(z) is simpler than conjugating',
      desc: 'For magnitude, abs already does the whole job and returns a float. Going via the conjugate is more code and leaves you with a complex to unwrap.',
      wrong: { label: 'The long way', code: '(((3+4j) * (3+4j).conjugate()).real) ** 0.5', output: '5.0' },
      fix:   { label: 'Just use abs',  code: 'abs(3+4j)', output: '5.0' },
    },
    {
      name: 'Both parts are floats, however they print',
      desc: 'complex stores two doubles. The repr hides whole values\' .0, so 3 looks like an int — but .real is 3.0, and float precision limits apply throughout.',
      wrong: { label: 'Looks like an int', code: '(3+4j).conjugate().real', output: '3.0' },
      fix:   { label: 'Convert if needed', code: 'int((3+4j).real)', output: '3' },
    },
    {
      name: 'j is the suffix, not a name',
      desc: 'Python writes the imaginary unit as a numeric suffix — 4j. A bare j is just an undefined variable, and 1j is needed where you might write i in maths.',
      wrong: { label: 'Not a literal', code: 'z = 3 + 4j\nw = 3 + j', output: "NameError: name 'j' is not defined" },
      fix:   { label: 'Suffix a number', code: 'w = 3 + 1j', output: '(3+1j)' },
    },
  ],

  when: {
    use: [
      'Magnitude-squared without a square root',
      'Complex division worked out by hand',
      'Hermitian inner products and signal processing',
      'Any formula from the maths literature that names the conjugate',
    ],
    avoid: [
      'You just want the magnitude → abs(z), which returns a float',
      'The value is real → the method is an identity there',
      'Heavy numeric work → numpy.conj over whole arrays',
    ],
  },

  notes: {
    complexity: 'O(1) — negates one double',
    return:     'A new complex; the original is unchanged',
    cpython:    'Objects/complexobject.c :: complex_conjugate',
    memory:     'Allocates one new complex object',
    threadSafe: 'Yes — complex numbers are immutable',
  },

  related: [
    { name: 'complex',         slug: 'complex',         when: 'Build the complex number in the first place' },
    { name: 'abs',             slug: 'abs',             when: 'Magnitude directly, as a float' },
    { name: 'float.conjugate', slug: 'float-conjugate', when: 'The identity version on real numbers' },
    { name: 'int.conjugate',   slug: 'int-conjugate',   when: 'The identity version on integers' },
  ],

  faq: [
    {
      q: 'Why does (4j).conjugate() print as -4j without parentheses?',
      a: 'Python omits a real part that is positive zero, so a pure imaginary number prints bare. Once the real part is anything else you get the parenthesised form, which is why (3-4j) and -4j look inconsistent.',
      code: '(4j).conjugate()      # -4j\n(3+4j).conjugate()    # (3-4j)',
    },
    {
      q: 'What is the conjugate for, geometrically?',
      a: 'It mirrors the point across the real axis — same distance from the origin, opposite angle. That is why multiplying a number by its conjugate cancels the angle and leaves a real magnitude squared.',
      code: 'abs(3+4j) == abs((3+4j).conjugate())\n# True',
    },
    {
      q: 'How do I divide complex numbers using it?',
      a: 'Multiply numerator and denominator by the denominator\'s conjugate, which makes the denominator real. Python\'s / operator already does this for you, so the manual form is mainly useful for understanding what happens.',
      code: '(1+2j) / (3+4j)\n# (0.44+0.08j)',
    },
  ],

  history: [
    { version: '1.4', note: 'Complex numbers and conjugate present since early Python.' },
    { version: '2.6', note: 'PEP 3141 made conjugate part of the shared numeric interface on int and float too.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex',
    meta:  'complex.conjugate',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
