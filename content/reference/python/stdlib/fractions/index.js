// content/reference/python/stdlib/fractions/index.js — the fractions module hub

export const meta = {
  slug:        'index',
  name:        'fractions',
  signature:   'from fractions import Fraction',
  blurb:       'Exact rational numbers: Fraction(1, 3) stays one third through every +, -, * and /. Build them from ints, strings, floats and Decimals.',
  category:    'numbers',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'fractions module python fraction rational numbers exact arithmetic numerator denominator 1/3 0.1 + 0.2 limit_denominator from_float from_decimal as_integer_ratio is_integer fraction to float float to fraction',
};

export const method = {
  slug: 'index',
  name: 'fractions',

  category:    'Numbers & math',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The module is one class, Fraction. Arithmetic between fractions and ints is exact and always reduced to lowest terms; the moment a float joins in, the result is a float again.',

  imports: ['from fractions import Fraction', 'import fractions'],
  facts: [
    { label: 'Public API', value: 'Fraction — with numerator, denominator, as_integer_ratio(), is_integer(), limit_denominator(), from_float(), from_decimal()' },
    { label: 'Invariant',  value: 'Always in lowest terms with a positive denominator: Fraction(16, -10) is Fraction(-8, 5)' },
    { label: 'Mixing',     value: 'Fraction with int or Fraction stays a Fraction; with float it becomes a float' },
    { label: 'Source',     value: 'Pure Python (Lib/fractions.py) on top of int and math.gcd' },
  ],

  coverClasses: ['Fraction'],

  modes: [
    {
      id: 'parse',
      label: 'from a string',
      blurb: 'Type a fraction or a decimal. Whitespace around the text and around the slash is allowed.',
      params: [{ name: 'text', type: 'str', hint: "'3/4', '0.1', '1e-3'", input: 'text' }],
      template: 'from fractions import Fraction\nFraction({$text})',
      cases: [
        { id: 'frac',   label: '3/4',     values: { text: '3/4' } },
        { id: 'reduce', label: ' -6/8 ',  values: { text: ' -6/8 ' } },
        { id: 'dec',    label: '0.1',     values: { text: '0.1' } },
        { id: 'exp',    label: '1e-3',    values: { text: '1e-3' } },
        { id: 'zero',   label: '1/0',     values: { text: '1/0' } },
        { id: 'bad',    label: '1.5/2',   values: { text: '1.5/2' } },
      ],
    },
    {
      id: 'float',
      label: 'float vs str',
      blurb: 'The same number three ways: from the float itself, from its text, and from the float with limit_denominator().',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from fractions import Fraction\n(Fraction({$x}), Fraction(str({$x})), Fraction({$x}).limit_denominator())',
      cases: [
        { id: 'tenth', label: '0.1',     values: { x: '0.1' } },
        { id: 'half',  label: '0.5',     values: { x: '0.5' } },
        { id: 'pi',    label: '3.14159', values: { x: '3.14159' } },
        { id: 'tiny',  label: '1e-07',   values: { x: '1e-7' } },
      ],
    },
    {
      id: 'arith',
      label: 'arithmetic',
      blurb: 'Two fractions (as text) through + - * /. Every result is exact and reduced.',
      params: [
        { name: 'a', type: 'str', hint: "e.g. '1/3'", input: 'text' },
        { name: 'b', type: 'str', hint: "e.g. '1/6'", input: 'text' },
      ],
      template: 'from fractions import Fraction\na = Fraction({$a})\nb = Fraction({$b})\n(a + b, a - b, a * b, a / b)',
      cases: [
        { id: 'thirds', label: '1/3 and 1/6', values: { a: '1/3', b: '1/6' } },
        { id: 'tenths', label: '0.1 and 0.2', values: { a: '0.1', b: '0.2' } },
        { id: 'zero',   label: 'divide by 0', values: { a: '2/3', b: '0' } },
      ],
    },
  ],
  demoExplainer: 'A string is read exactly: "0.1" is Fraction(1, 10). The float 0.1 is not one tenth — it is the nearest binary value, Fraction(3602879701896397, 36028797018963968) — and limit_denominator() finds the simplest fraction close to it, Fraction(1, 10). It can also go too far: 1e-07 needs a denominator of 10,000,000, above the default limit of 1,000,000, so limit_denominator() returns Fraction(0, 1). Dividing by a zero Fraction raises ZeroDivisionError with the message Fraction(1, 0).',

  patterns: [
    {
      name: 'Exact sums of decimal amounts',
      desc: 'Build the fractions from strings, not floats, and the arithmetic stays exact.',
      code: "from fractions import Fraction\nprices = ['0.10', '0.20', '0.30']\ntotal = sum(Fraction(p) for p in prices)  # Fraction(3, 5)",
    },
    {
      name: 'Recover a simple ratio from a float',
      desc: 'limit_denominator() turns the binary value back into the fraction you meant.',
      code: 'from fractions import Fraction\nratio = Fraction(aspect).limit_denominator(100)  # 1.7777777777777777 -> Fraction(16, 9)',
    },
    {
      name: 'Print a fraction as a decimal',
      desc: 'Float-style format specs work on Fraction (3.12+) without going through float.',
      code: "from fractions import Fraction\nprint(f'{Fraction(1, 3):.4f}')  # 0.3333",
    },
  ],

  examples: [
    { title: 'Reduced automatically',       code: 'from fractions import Fraction\nFraction(16, -10)',                          returns: 'Fraction(-8, 5)' },
    { title: 'Exact where floats round',    code: "from fractions import Fraction\nFraction('0.1') + Fraction('0.2') == Fraction('0.3')", returns: 'True' },
    { title: 'One third times three',       code: 'from fractions import Fraction\nFraction(1, 3) * 3',                         returns: 'Fraction(1, 1)' },
    { title: 'str() is the short form',     code: 'from fractions import Fraction\nprint(Fraction(1, 3) + Fraction(1, 6))',     returns: '1/2' },
    { title: 'A float joins in: float out', code: 'from fractions import Fraction\nFraction(1, 3) + 0.5',                        returns: '0.8333333333333333' },
    { title: 'Harmonic number H(10)',       code: 'from fractions import Fraction\nsum(Fraction(1, n) for n in range(1, 11))',  returns: 'Fraction(7381, 2520)' },
    { title: 'Decimal formatting',          code: "from fractions import Fraction\nformat(Fraction(1, 3), '.2%')",            returns: "'33.33%'" },
  ],

  pitfalls: [
    {
      name: 'Building a Fraction from a float literal',
      desc: 'The float 0.1 is already rounded before Fraction sees it, and Fraction converts it exactly — rounding error included.',
      wrong: { label: 'Fraction(0.1)', code: 'from fractions import Fraction\nFraction(0.1)', output: 'Fraction(3602879701896397, 36028797018963968)' },
      fix:   { label: "Fraction('0.1')", code: "from fractions import Fraction\nFraction('0.1')", output: 'Fraction(1, 10)' },
    },
    {
      name: 'Comparing a Fraction with a float',
      desc: 'Comparisons are exact, so one third is not equal to the float 1/3 — the float is slightly smaller.',
      wrong: { label: '== 1/3', code: 'from fractions import Fraction\nFraction(1, 3) == 1/3', output: 'False' },
      fix:   { label: 'compare Fractions', code: 'from fractions import Fraction\nFraction(1, 3) == Fraction(1, 3)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Exact ratios: probabilities, music intervals, unit conversions, scale factors',
      'Teaching and checking arithmetic — results print as 7381/2520, not 2.9289682539682538',
      'Accumulating many decimal amounts exactly, then rounding once at the end',
    ],
    avoid: [
      'Money with a fixed number of decimal places → decimal.Decimal',
      'Heavy numeric work → float; numerators and denominators can grow without bound',
      'Irrational results (square roots, logs) → they come back as floats anyway',
    ],
  },

  notes: {
    cpython:     'Lib/fractions.py, pure Python: every operation is a few int multiplications plus math.gcd to reduce',
    'Hashing':   'hash(Fraction(1, 2)) equals hash(0.5), so equal numbers work as the same dict key or set member',
    'Versions':  'Fraction(float) and Fraction(Decimal) since 3.2; as_integer_ratio 3.8; underscores in strings 3.11; is_integer, spaces around the slash and float-style formatting 3.12; fill/align/width formatting without a presentation type 3.13',
  },

  related: [
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'The exact ratio behind a float', category: 'functions' },
    { name: 'round()',                  slug: 'round',      when: 'Rounds Fractions half to even', category: 'functions' },
    { name: 'statistics module',        slug: 'statistics', when: 'Computes with Fractions internally; accepts Fraction data', category: 'stdlib' },
    { name: 'math module',              slug: 'math',       when: 'floor, ceil and gcd on rationals', category: 'stdlib' },
    { name: 'ZeroDivisionError',        slug: 'zerodivisionerror', when: 'A zero denominator', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I convert a float to a fraction in Python?',
      a: 'Fraction(x) gives the exact value of the float, which is usually an ugly power-of-two ratio. Fraction(x).limit_denominator() (or Fraction(str(x))) gives the simple fraction you probably meant, e.g. Fraction(1, 10) for 0.1.',
    },
    {
      q: 'How do I get the numerator and denominator?',
      a: 'Read f.numerator and f.denominator, or call f.as_integer_ratio() for both as a tuple. They are always in lowest terms and the denominator is always positive.',
    },
    {
      q: 'Why does Fraction + float return a float?',
      a: 'A float is already approximate, so there is no exact result to keep. Fraction converts itself to float and the operation is done in floating point. Convert the float first with Fraction(x) if you want an exact (if ugly) result.',
    },
    {
      q: 'Is Fraction slower than float?',
      a: 'Much slower: it is pure Python and numerators and denominators can grow large. Use it where exactness matters, not in tight numeric loops.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html',
    meta:  'fractions — Rational numbers',
  },

};
