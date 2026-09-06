// content/reference/python/functions/float-as_integer_ratio.js
//
// Slug is type-prefixed: `as_integer_ratio` collides with int.as_integer_ratio.

export const meta = {
  slug:        'float-as_integer_ratio',
  name:        'float.as_integer_ratio',
  signature:   'float.as_integer_ratio()',
  blurb:       'The exact fraction the float actually stores — which is rarely the one you typed.',
  category:    'float',
  type:        'float',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'as integer ratio fraction numerator denominator exact float precision binary rounding',
};

export const method = {
  slug:      'float-as_integer_ratio',
  name:      'float.as_integer_ratio',
  signature: 'float.as_integer_ratio()',
  returns:   { type: 'tuple', desc: 'A (numerator, denominator) pair in lowest terms, with a positive denominator. Raises on inf and nan.' },

  category:    'Float method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The clearest demonstration of what binary floats really hold. The denominator is always a power of two, which is exactly why 0.1 cannot be a tenth.',

  cheat: {
    commonCall: 'x.as_integer_ratio()',
    returns:    'tuple — exact numerator and denominator, fully reduced',
    replaces:   'Fraction(x), which calls this internally',
    watchOut:   'exact does not mean tidy — 0.1 gives a 16-digit pair',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'float', hint: 'a number, e.g. 0.5 or 0.1', input: 'float' },
  ],
  demoTemplate: 'float({n}).as_integer_ratio()',
  cases: [
    { id: 'half',     label: 'a half',        values: { n: 0.5 } },
    { id: 'quarter',  label: 'a quarter',     values: { n: 0.25 } },
    { id: 'tenth',    label: 'a tenth (!)',   values: { n: 0.1 } },
    { id: 'whole',    label: 'whole number',  values: { n: 2.0 } },
    { id: 'negative', label: 'negative',      values: { n: -0.75 } },
    { id: 'zero',     label: 'zero',          values: { n: 0.0 } },
  ],
  demoExplainer: 'Halves, quarters and whole numbers give the small tidy fractions you would expect, because those values fit binary exactly. Then look at 0.1: the answer is 3602879701896397 over 36028797018963968. That enormous pair is not a bug — it is the closest a double can get to a tenth, and it is what every calculation using 0.1 is really working with. The denominator is always a power of two, which is the whole story of binary floating point.',

  patterns: [
    {
      name: 'Convert to an exact Fraction',
      desc: 'Fraction uses this internally, so the result carries the float\'s real value.',
      code: 'from fractions import Fraction\nexact = Fraction(*x.as_integer_ratio())',
    },
    {
      name: 'Compare floats without rounding error',
      desc: 'Cross-multiplying the ratios is exact where a direct == may not be.',
      code: 'an, ad = a.as_integer_ratio()\nbn, bd = b.as_integer_ratio()\nequal = an * bd == bn * ad',
    },
    {
      name: 'Explain a float discrepancy',
      desc: 'The fastest way to show why two "equal" numbers are not.',
      code: 'print(value.as_integer_ratio())',
    },
  ],

  examples: [
    { title: 'A half',        code: '(0.5).as_integer_ratio()',  returns: '(1, 2)' },
    { title: 'A quarter',     code: '(0.25).as_integer_ratio()', returns: '(1, 4)' },
    { title: 'A tenth is not',code: '(0.1).as_integer_ratio()',  returns: '(3602879701896397, 36028797018963968)' },
    { title: 'Whole number',  code: '(2.0).as_integer_ratio()',  returns: '(2, 1)' },
    { title: 'Negative',      code: '(-0.75).as_integer_ratio()',returns: '(-3, 4)' },
    { title: 'nan raises',    code: "float('nan').as_integer_ratio()", returns: 'ValueError: cannot convert NaN to integer ratio' },
  ],

  pitfalls: [
    {
      name: 'Exact is not the same as expected',
      desc: 'People reach for this hoping to recover the decimal they typed and get a 16-digit fraction instead. The method is right — the float never held a tenth in the first place.',
      wrong: { label: 'Expected (1, 10)', code: '(0.1).as_integer_ratio()', output: '(3602879701896397, 36028797018963968)' },
      fix:   { label: 'Start from text',  code: "from fractions import Fraction\nFraction('0.1')", output: 'Fraction(1, 10)' },
    },
    {
      name: 'inf and nan raise',
      desc: 'Neither has a finite fraction, so both are errors — and they raise DIFFERENT exception types, which matters if you are catching one specifically.',
      wrong: { label: 'Two exception types', code: "float('inf').as_integer_ratio()", output: 'OverflowError: cannot convert Infinity to integer ratio' },
      fix:   { label: 'Guard first',         code: 'import math\nif math.isfinite(x):\n    n, d = x.as_integer_ratio()', output: 'safe' },
    },
    {
      name: 'The denominator is always a power of two',
      desc: 'It can never be 10, 3 or 7. Any decimal that is not a sum of halves, quarters and eighths gets approximated, which is the root of nearly every float surprise.',
      wrong: { label: 'No thirds exist', code: '(1 / 3).as_integer_ratio()', output: '(6004799503160661, 18014398509481984)' },
      fix:   { label: 'Use Fraction',    code: 'from fractions import Fraction\nFraction(1, 3)', output: 'Fraction(1, 3)' },
    },
  ],

  when: {
    use: [
      'Converting a float to an exact Fraction',
      'Explaining or debugging floating-point discrepancies',
      'Exact comparison or summation without rounding error',
      'Teaching what binary floats actually store',
    ],
    avoid: [
      'You want the decimal you typed → Fraction(str) or decimal.Decimal',
      'You know the value is an int → int.as_integer_ratio always gives (n, 1)',
      'Values may be inf or nan → check with math.isfinite first',
    ],
  },

  notes: {
    complexity: 'O(1) — reads the mantissa and exponent, then reduces by powers of two',
    return:     'A new tuple in lowest terms; the denominator is always a positive power of two',
    cpython:    'Objects/floatobject.c :: float_as_integer_ratio',
    memory:     'Allocates a tuple and, for extreme exponents, very large ints',
    threadSafe: 'Yes — floats are immutable',
  },

  related: [
    { name: 'int.as_integer_ratio', slug: 'int-as_integer_ratio', when: 'The int version, always (n, 1)' },
    { name: 'float.hex',            slug: 'float-hex',            when: 'The same exactness as a hex string' },
    { name: 'round',                slug: 'round',                when: 'Approximate deliberately instead' },
    { name: 'float',                slug: 'float',                when: 'Build the float in the first place' },
  ],

  faq: [
    {
      q: 'Why is 0.1 not (1, 10)?',
      a: 'Because a tenth cannot be written as a finite sum of powers of two, any more than a third can be written as a finite decimal. The double stores the nearest value it can, and this method reports that value honestly.',
      code: '(0.1).as_integer_ratio()\n# (3602879701896397, 36028797018963968)',
    },
    {
      q: 'How do I get the fraction I actually meant?',
      a: 'Build it from text, so the decimal is never routed through a float. Fraction("0.1") gives 1/10 exactly, and Decimal("0.1") does the same for decimal arithmetic.',
      code: "from fractions import Fraction\nFraction('0.1')   # Fraction(1, 10)",
    },
    {
      q: 'Can the denominator ever be odd?',
      a: 'Only when it is 1, for a whole number. Every other denominator is a power of two, because that is the only kind of fraction a binary float can represent exactly.',
      code: '(2.0).as_integer_ratio()   # (2, 1)\n(0.75).as_integer_ratio()  # (3, 4)',
    },
  ],

  history: [
    { version: '2.6', note: 'float.as_integer_ratio added.' },
    { version: '3.8', note: 'int gained a matching as_integer_ratio, so both numeric types now answer.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#float.as_integer_ratio',
    meta:  'float.as_integer_ratio',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
