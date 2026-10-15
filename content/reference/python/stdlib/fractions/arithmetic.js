// content/reference/python/stdlib/fractions/arithmetic.js — Fraction operators and comparisons

export const meta = {
  slug:        'arithmetic',
  name:        'Fraction arithmetic and comparisons',
  signature:   'a + b, a - b, a * b, a / b, a // b, a % b, divmod(a, b), a ** n, a < b, a == b',
  blurb:       'What every operator returns when a Fraction meets an int, a float or another Fraction — exact Fractions, floats, ints or complex numbers.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'Fraction arithmetic fraction add subtract multiply divide floor division modulo divmod power exponent compare fraction with float Fraction + float returns float fraction equality hash Fraction.__add__ Fraction.__truediv__ Fraction.__pow__ Fraction.__lt__ Fraction.__eq__',
};

export const method = {
  slug:      'arithmetic',
  name:      'Fraction arithmetic and comparisons',
  signature: 'a + b, a - b, a * b, a / b, a // b, a % b, divmod(a, b), a ** n, a < b, a == b',
  returns:   { type: 'Fraction | int | float | complex | bool', desc: 'Fraction for Fraction-or-int operands (int for //), float once a float is involved or for a fractional power.' },

  category:    'Fraction operators',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The rule of thumb: Fraction with int or Fraction stays exact; anything with a float becomes a float; ** with a non-integer exponent leaves the rationals. Comparisons are always exact, even against floats.',

  covers: [],

  cheat: {
    commonCall: 'Fraction(1, 3) + Fraction(1, 6)',
    returns:    'Fraction(1, 2)',
    replaces:   'Common-denominator bookkeeping by hand',
    watchOut:   'Fraction(1, 3) == 1/3 is False — the float is not one third',
  },

  parameters: [
    { name: 'a, b', type: 'Fraction | int | float', required: true, default: null, desc: 'At least one operand is a Fraction. bool counts as int; complex works for + - * / and ** (complex result).' },
    { name: 'n',    type: 'int | Fraction | float', required: true, default: null, desc: 'For **: an int (or a Fraction with denominator 1) keeps the result exact; any other exponent, even the float 2.0, gives a float — or a complex number when a negative base meets a fractional exponent.' },
  ],

  modes: [
    {
      id: 'basic',
      label: '+ - * /',
      blurb: 'Two fractions as text.',
      params: [
        { name: 'a', type: 'str', hint: "e.g. '3/4'", input: 'text' },
        { name: 'b', type: 'str', hint: "e.g. '5/6'", input: 'text' },
      ],
      template: 'from fractions import Fraction\na = Fraction({$a})\nb = Fraction({$b})\n(a + b, a - b, a * b, a / b)',
      cases: [
        { id: 'quarters', label: '3/4 and 5/6',  values: { a: '3/4', b: '5/6' } },
        { id: 'neg',      label: '-1/2 and 1/3', values: { a: '-1/2', b: '1/3' } },
        { id: 'whole',    label: '1.5 and 0.5',  values: { a: '1.5', b: '0.5' } },
      ],
    },
    {
      id: 'floor',
      label: '// and %',
      blurb: 'Floor division gives an int; the remainder is a Fraction with the sign of the divisor.',
      params: [
        { name: 'a', type: 'str', hint: "e.g. '7/2'", input: 'text' },
        { name: 'b', type: 'str', hint: "e.g. '2/3'", input: 'text' },
      ],
      template: 'from fractions import Fraction\na = Fraction({$a})\nb = Fraction({$b})\n(a // b, a % b)',
      cases: [
        { id: 'pos',   label: '7/2, 2/3',  values: { a: '7/2', b: '2/3' } },
        { id: 'neg',   label: '-7/2, 2/3', values: { a: '-7/2', b: '2/3' } },
        { id: 'exact', label: '5, 1/3',    values: { a: '5', b: '1/3' } },
        { id: 'zero',  label: '1/2, 0',    values: { a: '1/2', b: '0' } },
      ],
    },
    {
      id: 'power',
      label: '**',
      blurb: 'An int exponent keeps the result an exact Fraction, negative exponents included. (Float exponents go through the C library pow() — see the examples.)',
      params: [
        { name: 'base', type: 'str', hint: "e.g. '2/3'", input: 'text' },
        { name: 'n',    type: 'int', hint: '2, -2, 10',  input: 'number' },
      ],
      template: 'from fractions import Fraction\nFraction({$base}) ** {$n}',
      cases: [
        { id: 'sq',   label: '(2/3) ** 2',   values: { base: '2/3', n: '2' } },
        { id: 'neg',  label: '(2/3) ** -2',  values: { base: '2/3', n: '-2' } },
        { id: 'big',  label: '(1/2) ** 10',  values: { base: '1/2', n: '10' } },
        { id: 'zero', label: '0 ** -1',      values: { base: '0', n: '-1' } },
      ],
    },
    {
      id: 'mixed',
      label: 'with a float',
      blurb: 'Adding a float gives a float; comparing with a float is exact.',
      params: [
        { name: 'a', type: 'str',   hint: "e.g. '1/10'", input: 'text' },
        { name: 'x', type: 'float', hint: 'a float',     input: 'float' },
      ],
      template: 'from fractions import Fraction\nf = Fraction({$a})\n(f + {$x}, f == {$x}, f < {$x})',
      cases: [
        { id: 'half',  label: "'1/2' and 0.5", values: { a: '1/2', x: '0.5' } },
        { id: 'tenth', label: "'1/10' and 0.1", values: { a: '1/10', x: '0.1' } },
        { id: 'third', label: "'1/3' and 0.3333333333333333", values: { a: '1/3', x: '0.3333333333333333' } },
      ],
    },
  ],
  demoExplainer: "Floor division always rounds toward minus infinity: -7/2 // 2/3 is -6 and the remainder 1/2 keeps the divisor's sign. A zero divisor raises ZeroDivisionError from the int floor division inside (integer division or modulo by zero), while a / b and 0 ** -1 report Fraction(1, 0). Int powers stay exact: (1/2) ** 10 is Fraction(1, 1024). Against floats, 1/2 equals 0.5 exactly, but the float 0.1 is slightly more than one tenth, so Fraction(1, 10) < 0.1 is True; f + x is computed in floating point.",

  patterns: [
    {
      name: 'Keep a running total exact',
      desc: 'Start from Fraction(0) (or an int) and add Fractions — never floats.',
      code: "from fractions import Fraction\ntotal = Fraction(0)\nfor amount in ['0.10', '0.20', '0.30']:\n    total += Fraction(amount)",
    },
    {
      name: 'Exact probability products',
      desc: 'Multiply probabilities without rounding error.',
      code: 'from fractions import Fraction\np = Fraction(1, 6) ** 3 * 4   # Fraction(1, 54)',
    },
    {
      name: 'Mixed with floats on purpose',
      desc: 'Convert the float explicitly if you want an exact (if ugly) result.',
      code: 'from fractions import Fraction\nexact = Fraction(1, 3) + Fraction(0.5)',
    },
  ],

  examples: [
    { title: 'int on either side stays exact', code: 'from fractions import Fraction\n(Fraction(1, 2) + 1, 1 - Fraction(1, 3))', returns: '(Fraction(3, 2), Fraction(2, 3))' },
    { title: 'A float makes a float',     code: 'from fractions import Fraction\nFraction(1, 2) + 0.5',            returns: '1.0' },
    { title: 'int ** Fraction',           code: 'from fractions import Fraction\n(2 ** Fraction(3), 2 ** Fraction(1, 2))', returns: '(8, 1.4142135623730951)' },
    { title: 'divmod',                    code: 'from fractions import Fraction\ndivmod(Fraction(7, 2), 1)',       returns: '(3, Fraction(1, 2))' },
    { title: 'Sorting mixed numbers',     code: 'from fractions import Fraction\nsorted([Fraction(1, 2), 0.25, 1, Fraction(-1, 3)])', returns: '[Fraction(-1, 3), 0.25, Fraction(1, 2), 1]' },
    { title: 'Equal values hash equal',   code: 'from fractions import Fraction\n{Fraction(1, 2), 0.5}',             returns: '{Fraction(1, 2)}' },
    { title: 'A negative base, fractional power', code: 'from fractions import Fraction\nFraction(-8) ** Fraction(1, 3)', returns: '(1.0000000000000002+1.7320508075688772j)' },
    { title: 'Too big for a float',       code: 'from fractions import Fraction\nFraction(10 ** 400) * 1.0',      returns: 'OverflowError: integer division result too large for a float' },
  ],

  pitfalls: [
    {
      name: 'Testing a Fraction against a float literal',
      desc: 'The comparison is exact, and the float 1/3 is not one third. Compare with a Fraction, or round the Fraction to a float first.',
      wrong: { label: '== 1/3', code: 'from fractions import Fraction\nFraction(1, 3) == 1/3', output: 'False' },
      fix:   { label: 'float(f) == 1/3', code: 'from fractions import Fraction\nfloat(Fraction(1, 3)) == 1/3', output: 'True' },
    },
    {
      name: 'One float silently ends the exactness',
      desc: 'A single float in the expression turns the result into a float. Wrap float inputs in Fraction (from text where possible).',
      wrong: { label: '+ 0.1', code: 'from fractions import Fraction\nFraction(1, 5) + 0.1', output: '0.30000000000000004' },
      fix:   { label: "+ Fraction('0.1')", code: "from fractions import Fraction\nFraction(1, 5) + Fraction('0.1')", output: 'Fraction(3, 10)' },
    },
    {
      name: 'Expecting // to return a Fraction',
      desc: 'Floor division of Fractions returns an int (like int // int); % returns a Fraction.',
      wrong: { label: 'type of //', code: 'from fractions import Fraction\ntype(Fraction(7, 2) // Fraction(1, 2)).__name__', output: "'int'" },
      fix:   { label: 'wrap if needed', code: 'from fractions import Fraction\nFraction(Fraction(7, 2) // Fraction(1, 2))', output: 'Fraction(7, 1)' },
    },
  ],

  when: {
    use: [
      'Exact arithmetic on ratios, probabilities and rational coordinates',
      'Mixed int / Fraction code — ints are promoted automatically',
    ],
    avoid: [
      'Expressions that also involve floats → decide on one representation',
      'Square roots and other irrational results → math and floats',
    ],
  },

  notes: {
    cpython:      'Lib/fractions.py: _operator_fallbacks() builds the __op__/__rop__ pairs of + - * / // % and divmod — Fraction or int operands use the exact rational algorithm (Knuth, TAOCP 4.5.1, with gcd shortcuts), float operands use float(fraction) and the float operator, complex likewise for + - * / only; __pow__ and __rpow__ are written separately and also accept float and complex',
    'Results':    '+ - * / and % give Fraction; // gives int; divmod gives (int, Fraction); ** with an integral Rational exponent gives Fraction, otherwise float (complex when a negative base meets a fractional exponent)',
    'Comparisons': '<, <=, >, >= and == with a float convert the float exactly (Fraction.from_float); NaN compares False and infinities compare as if the Fraction were 0',
    'Platform':   'Exact operations are identical everywhere; float ** float and complex results use the C library pow / cos / sin and can differ in the last digit between platforms',
  },

  related: [
    { name: 'Fraction()', slug: 'fraction', when: 'Make the operands' },
    { name: 'round / floor / ceil', slug: 'round-floor-ceil', when: 'Back to ints' },
    { name: '/ operator', slug: 'truediv', when: 'True division in general', category: 'operators' },
    { name: '// operator', slug: 'floordiv', when: 'Floor division in general', category: 'operators' },
    { name: '** operator', slug: 'pow', when: 'Powers in general', category: 'operators' },
    { name: 'ZeroDivisionError', slug: 'zerodivisionerror', when: 'Dividing by a zero Fraction', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What type does Fraction + float return?',
      a: 'A float. The Fraction is converted with float() and the addition happens in floating point. Fraction with int or Fraction returns a Fraction.',
    },
    {
      q: 'Can you compare a Fraction with a float in Python?',
      a: 'Yes, and the comparison is exact: the float is converted to its exact rational value first. That is why Fraction(1, 2) == 0.5 is True but Fraction(1, 3) == 1/3 is False.',
    },
    {
      q: 'Why does Fraction(1, 2) // 0 say "integer division or modulo by zero"?',
      a: 'Floor division of Fractions is computed as an int floor division of cross-multiplied numerators and denominators, so the error comes from int //. True division (/) checks first and raises ZeroDivisionError: Fraction(1, 0).',
    },
    {
      q: 'Does Fraction ** Fraction return a Fraction?',
      a: 'Only when the exponent is a whole number (denominator 1): Fraction(2, 3) ** Fraction(2) is Fraction(4, 9). A fractional exponent such as Fraction(1, 2) returns a float, because roots are usually irrational.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction',
    meta:  'fractions.Fraction',
  },
};
