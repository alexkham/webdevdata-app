// content/reference/python/stdlib/fractions/numerator-denominator.js — Fraction.numerator / Fraction.denominator

export const meta = {
  slug:        'numerator-denominator',
  name:        'Fraction.numerator / Fraction.denominator',
  signature:   'f.numerator  /  f.denominator',
  blurb:       'The two ints of a Fraction, always in lowest terms, with the sign on the numerator and a denominator that is never zero or negative.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'Fraction.numerator Fraction.denominator numerator denominator fraction parts top bottom lowest terms python fraction get numerator read-only property has no setter',
};

export const method = {
  slug:      'numerator-denominator',
  name:      'Fraction.numerator / Fraction.denominator',
  signature: 'f.numerator  /  f.denominator',
  returns:   { type: 'int', desc: 'numerator carries the sign; denominator is a positive int.' },

  category:    'Fraction attributes',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Read-only properties. Because every Fraction is normalised when it is made, they are already reduced: Fraction(12, 18).numerator is 2, not 12.',

  covers: ['Fraction.numerator', 'Fraction.denominator'],

  cheat: {
    commonCall: 'f.numerator, f.denominator',
    returns:    '(-3, 4) for Fraction(-6, 8)',
    replaces:   'Reducing a ratio yourself with math.gcd',
    watchOut:   'They are properties — assigning raises AttributeError',
  },

  parameters: [],

  attributes: [
    { name: 'numerator',   type: 'int', meaning: 'The top of the reduced fraction; negative for negative values, 0 for zero.' },
    { name: 'denominator', type: 'int', meaning: 'The bottom of the reduced fraction; always >= 1 (1 for whole numbers).' },
  ],

  modes: [
    {
      id: 'parts',
      label: 'from text',
      blurb: 'Type a fraction or decimal; see the reduced parts.',
      params: [{ name: 'text', type: 'str', hint: "'-6/8', '0.75'", input: 'text' }],
      template: 'from fractions import Fraction\nf = Fraction({$text})\n(f.numerator, f.denominator)',
      cases: [
        { id: 'neg',   label: '-6/8',  values: { text: '-6/8' } },
        { id: 'dec',   label: '0.75',  values: { text: '0.75' } },
        { id: 'red',   label: '12/18', values: { text: '12/18' } },
        { id: 'exp',   label: '-1e-3', values: { text: '-1e-3' } },
        { id: 'whole', label: '5',     values: { text: '5' } },
      ],
    },
    {
      id: 'float',
      label: 'from a float',
      blurb: 'A float converts exactly, so its denominator is always a power of two.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from fractions import Fraction\nf = Fraction({$x})\n(f.numerator, f.denominator)',
      cases: [
        { id: 'half',  label: '0.375', values: { x: '0.375' } },
        { id: 'tenth', label: '0.1',   values: { x: '0.1' } },
        { id: 'big',   label: '1e+20', values: { x: '1e20' } },
      ],
    },
  ],
  demoExplainer: 'The sign always ends up on the numerator and the parts are divided by their greatest common divisor, so "-6/8" reads back as (-3, 4) and "12/18" as (2, 3); a whole number has denominator 1. 0.375 is 3/8 exactly in binary, but 0.1 is stored as 3602879701896397 / 36028797018963968 (2**55) — the float literal already rounded it. 1e+20 is a whole number, so its denominator is 1.',

  patterns: [
    {
      name: 'Show a fraction as "n/d"',
      desc: 'str() already does this (and drops "/1" for whole numbers).',
      code: "from fractions import Fraction\nf = Fraction(3, 4)\nlabel = f'{f.numerator}/{f.denominator}'",
    },
    {
      name: 'Check for a power-of-two denominator',
      desc: 'Every float is a fraction with a power-of-two denominator, so no other fraction can be an exact float.',
      code: 'from fractions import Fraction\nd = Fraction(text).denominator\nexact_in_binary = d & (d - 1) == 0',
    },
  ],

  examples: [
    { title: 'Sign on the numerator',     code: 'from fractions import Fraction\nf = Fraction(6, -8)\n(f.numerator, f.denominator)', returns: '(-3, 4)' },
    { title: 'Zero is 0/1',               code: "from fractions import Fraction\nf = Fraction('-0')\n(f.numerator, f.denominator)",  returns: '(0, 1)' },
    { title: 'int has them too',          code: '((7).numerator, (7).denominator)',                                                returns: '(7, 1)' },
    { title: 'float does not',            code: '(0.5).numerator',                                                                 returns: "AttributeError: 'float' object has no attribute 'numerator'" },
    { title: 'Read-only',                 code: 'from fractions import Fraction\nf = Fraction(3, 4)\nf.numerator = 5',                returns: "AttributeError: property 'numerator' of 'Fraction' object has no setter" },
    { title: 'real and imag (numbers ABC)', code: 'from fractions import Fraction\nf = Fraction(3, 4)\n(f.real, f.imag)',              returns: '(Fraction(3, 4), 0)' },
  ],

  pitfalls: [
    {
      name: 'Putting the minus sign on the denominator in a string',
      desc: 'Fraction(6, -8) is fine, but the string grammar only allows a sign in front. Move it, or use the two-int form.',
      wrong: { label: "'6/-8'", code: "from fractions import Fraction\nFraction('6/-8')", output: "ValueError: Invalid literal for Fraction: '6/-8'" },
      fix:   { label: "'-6/8'", code: "from fractions import Fraction\nFraction('-6/8').numerator", output: '-3' },
    },
    {
      name: 'Changing a part in place',
      desc: 'Fractions are immutable. Build a new one from the parts you want.',
      wrong: { label: 'f.denominator = 8', code: 'from fractions import Fraction\nf = Fraction(3, 4)\nf.denominator = 8', output: "AttributeError: property 'denominator' of 'Fraction' object has no setter" },
      fix:   { label: 'new Fraction', code: 'from fractions import Fraction\nf = Fraction(3, 4)\nFraction(f.numerator, 8)', output: 'Fraction(3, 8)' },
    },
  ],

  when: {
    use: ['Printing or serialising a fraction as two ints', 'Feeding exact ratios into int-only code'],
    avoid: ['Getting both at once → as_integer_ratio()', 'Turning it into a number → float(f) or int(f)'],
  },

  notes: {
    cpython:   'Properties returning the private _numerator and _denominator slots; __new__ fills them already reduced (dividing by math.gcd where the input was not in lowest terms yet)',
    'Numbers ABC': 'numerator and denominator are part of numbers.Rational: int and bool provide them too (denominator 1); float and Decimal do not — use as_integer_ratio() there',
  },

  related: [
    { name: 'as_integer_ratio / is_integer', slug: 'as_integer_ratio-is_integer', when: 'Both parts as a tuple; whole-number test' },
    { name: 'Fraction()', slug: 'fraction', when: 'How the parts get reduced' },
    { name: 'int.as_integer_ratio()', slug: 'int-as_integer_ratio', when: 'The same pair for ints', category: 'functions' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the numerator and denominator of a Fraction?',
      a: 'f.numerator and f.denominator. They are ints in lowest terms; the denominator is always positive and the sign is on the numerator.',
    },
    {
      q: 'Why did my Fraction(12, 18) lose its 12?',
      a: 'Fractions are reduced as soon as they are created, using math.gcd: 12/18 is stored as 2/3. Keep the original ints separately if you need them.',
    },
    {
      q: 'Can I change the numerator of a Fraction?',
      a: 'No. numerator and denominator are read-only properties and Fraction is immutable; assigning raises AttributeError. Create a new Fraction instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.numerator',
    meta:  'Fraction.numerator',
  },
};
