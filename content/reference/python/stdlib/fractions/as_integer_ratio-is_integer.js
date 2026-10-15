// content/reference/python/stdlib/fractions/as_integer_ratio-is_integer.js — Fraction.as_integer_ratio / Fraction.is_integer

export const meta = {
  slug:        'as_integer_ratio-is_integer',
  name:        'Fraction.as_integer_ratio / Fraction.is_integer',
  signature:   'f.as_integer_ratio()  /  f.is_integer()',
  blurb:       'as_integer_ratio() returns (numerator, denominator) as a tuple; is_integer() says whether the denominator is 1 — as_integer_ratio() also exists on int, float and Decimal, is_integer() on int and float (not Decimal).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'as_integer_ratio 3.8+, is_integer 3.12+',
  searchTerms: 'Fraction.as_integer_ratio Fraction.is_integer as_integer_ratio is_integer fraction to tuple numerator denominator pair is whole number python fraction integer check',
};

export const method = {
  slug:      'as_integer_ratio-is_integer',
  name:      'Fraction.as_integer_ratio / Fraction.is_integer',
  signature: 'f.as_integer_ratio()  /  f.is_integer()',
  returns:   { type: 'tuple[int, int] / bool', desc: 'The reduced (numerator, denominator) pair; True when the value is a whole number.' },

  category:    'Fraction methods',
  version:     'as_integer_ratio 3.8+, is_integer 3.12+',
  hasLiveDemo: true,

  subtitle: 'Two small methods that make Fraction interchangeable with the other number types: every built-in real number has as_integer_ratio() (int and float), and is_integer() exists on float, and on int and Fraction since 3.12.',

  covers: ['Fraction.as_integer_ratio', 'Fraction.is_integer'],

  cheat: {
    commonCall: 'n, d = f.as_integer_ratio()',
    returns:    '(5, 2) for Fraction(10, 4); is_integer() → False',
    replaces:   '(f.numerator, f.denominator) and f.denominator == 1',
    watchOut:   'is_integer() needs Python 3.12+ on Fraction',
  },

  parameters: [],

  modes: [
    {
      id: 'methods',
      label: 'both methods',
      blurb: 'Type a fraction or decimal.',
      params: [{ name: 'text', type: 'str', hint: "'10/4', '1e3'", input: 'text' }],
      template: 'from fractions import Fraction\nf = Fraction({$text})\n(f.as_integer_ratio(), f.is_integer())',
      cases: [
        { id: 'half',  label: '10/4', values: { text: '10/4' } },
        { id: 'whole', label: '8/4',  values: { text: '8/4' } },
        { id: 'neg',   label: '-0.5', values: { text: '-0.5' } },
        { id: 'exp',   label: '1e3',  values: { text: '1e3' } },
      ],
    },
    {
      id: 'float',
      label: 'same as float',
      blurb: 'A float and the Fraction made from it report the same ratio.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from fractions import Fraction\nx = {$x}\n(x.as_integer_ratio(), Fraction(x).as_integer_ratio())',
      cases: [
        { id: 'quarter', label: '0.75', values: { x: '0.75' } },
        { id: 'tenth',   label: '0.1',  values: { x: '0.1' } },
        { id: 'neg',     label: '-2.0', values: { x: '-2' } },
      ],
    },
  ],
  demoExplainer: 'The ratio is the stored, reduced pair: "10/4" gives (5, 2), "8/4" gives (2, 1) and is_integer() is True for it. The sign stays with the numerator: (-1, 2). For floats the ratio is the exact binary value, which is why 0.1 shows a 2**55 denominator on both sides.',

  patterns: [
    {
      name: 'Unpack in one line',
      desc: 'Works the same for int, float, Decimal and Fraction.',
      code: 'n, d = value.as_integer_ratio()',
    },
    {
      name: 'Keep only whole results',
      desc: 'is_integer() reads better than f.denominator == 1.',
      code: 'from fractions import Fraction\nwhole = [f for f in results if f.is_integer()]',
    },
  ],

  examples: [
    { title: 'A tuple of ints',          code: 'from fractions import Fraction\nFraction(10, 4).as_integer_ratio()', returns: '(5, 2)' },
    { title: 'Unpacking',                code: 'from fractions import Fraction\nn, d = Fraction(10, 4).as_integer_ratio()\nprint(n, d)', returns: '5 2' },
    { title: 'Zero',                     code: "from fractions import Fraction\nFraction('0').as_integer_ratio()", returns: '(0, 1)' },
    { title: 'A sum that comes out whole', code: 'from fractions import Fraction\n(Fraction(1, 3) + Fraction(2, 3)).is_integer()', returns: 'True' },
    { title: 'Filter whole values',      code: 'from fractions import Fraction\n[f for f in [Fraction(4, 2), Fraction(5, 2), Fraction(6, 2)] if f.is_integer()]', returns: '[Fraction(2, 1), Fraction(3, 1)]' },
    { title: 'The other number types',  code: 'from decimal import Decimal\n((7).as_integer_ratio(), (2.5).is_integer(), Decimal("2.50").as_integer_ratio())', returns: '((7, 1), False, (5, 2))' },
  ],

  pitfalls: [
    {
      name: 'A whole Fraction is still a Fraction',
      desc: 'is_integer() tells you the value is whole; it does not change the type. Convert with int() when you need an int.',
      wrong: { label: 'expecting an int', code: 'from fractions import Fraction\nf = Fraction(14, 2)\n(f.is_integer(), type(f).__name__)', output: "(True, 'Fraction')" },
      fix:   { label: 'int(f)', code: 'from fractions import Fraction\nf = Fraction(14, 2)\nint(f) if f.is_integer() else f', output: '7' },
    },
    {
      name: 'Expecting the ratio you typed',
      desc: 'The pair is reduced; the original numerator and denominator are gone. Compare Fractions (values), not tuples (spellings).',
      wrong: { label: 'expect (10, 4)', code: 'from fractions import Fraction\nFraction(10, 4).as_integer_ratio() == (10, 4)', output: 'False' },
      fix:   { label: 'compare values', code: 'from fractions import Fraction\nFraction(10, 4) == Fraction(5, 2)', output: 'True' },
    },
  ],

  when: {
    use: ['Code that accepts any real number and needs an exact ratio', 'Checking whether an exact result is whole'],
    avoid: ['Reading one part → .numerator / .denominator'],
  },

  notes: {
    cpython:   'Both are one-liners in Lib/fractions.py: return (self._numerator, self._denominator) and return self._denominator == 1',
    'Versions': 'as_integer_ratio() was added in 3.8, is_integer() in 3.12 (int.is_integer() also arrived in 3.12)',
  },

  related: [
    { name: 'numerator / denominator', slug: 'numerator-denominator', when: 'Each part on its own' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'The same method on float', category: 'functions' },
    { name: 'float.is_integer()', slug: 'float-is_integer', when: 'The same check on float', category: 'functions' },
    { name: 'int.is_integer()', slug: 'int-is_integer', when: 'Always True for ints', category: 'functions' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a Fraction is a whole number?',
      a: 'f.is_integer() on Python 3.12+, or f.denominator == 1 on any version. Both are True exactly when the reduced denominator is 1.',
    },
    {
      q: 'What is the difference between as_integer_ratio() and (numerator, denominator)?',
      a: 'None in value — both give the reduced pair. as_integer_ratio() is the cross-type spelling: int, float, Decimal and Fraction all have it, while float and Decimal have no numerator attribute.',
    },
    {
      q: 'Is the denominator from as_integer_ratio() ever negative?',
      a: 'No. The pair is in lowest terms and the denominator is always positive; the sign is carried by the numerator.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.as_integer_ratio',
    meta:  'Fraction.as_integer_ratio',
  },
};
