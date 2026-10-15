// content/reference/python/stdlib/fractions/limit_denominator.js — Fraction.limit_denominator

export const meta = {
  slug:        'limit_denominator',
  name:        'Fraction.limit_denominator',
  signature:   'f.limit_denominator(max_denominator=1000000)',
  blurb:       'The closest fraction whose denominator is at most max_denominator — turns 0.1 back into 1/10 and pi into 22/7 or 355/113.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'Fraction.limit_denominator limit_denominator best rational approximation closest fraction float to fraction simplify 22/7 355/113 continued fraction convergents max_denominator should be at least 1 python',
};

export const method = {
  slug:      'limit_denominator',
  name:      'Fraction.limit_denominator',
  signature: 'f.limit_denominator(max_denominator=1000000)',
  returns:   { type: 'Fraction', desc: 'The Fraction nearest to f among those with denominator <= max_denominator (f itself if it already qualifies).' },

  category:    'Fraction method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Walks the continued fraction of the value and returns the best approximation within the limit — the standard way to recover the "real" fraction behind a float.',

  covers: ['Fraction.limit_denominator'],

  cheat: {
    commonCall: 'Fraction(0.1).limit_denominator()',
    returns:    'Fraction(1, 10)',
    replaces:   'Guessing simple ratios from decimals by hand',
    watchOut:   'Values smaller than 1/(2 * limit) collapse to 0',
  },

  parameters: [
    { name: 'max_denominator', type: 'int', required: false, default: '1000000', desc: 'Largest allowed denominator; must be at least 1 (ValueError otherwise).' },
  ],

  modes: [
    {
      id: 'approx',
      label: 'approximate',
      blurb: 'A value (as text) and a denominator limit. Raise the limit to see the approximations improve.',
      params: [
        { name: 'text',            type: 'str', hint: 'a number as text', input: 'text' },
        { name: 'max_denominator', type: 'int', hint: 'largest denominator', input: 'number' },
      ],
      template: 'from fractions import Fraction\nFraction({$text}).limit_denominator({$max_denominator})',
      cases: [
        { id: 'pi10',   label: 'pi, 10',     values: { text: '3.141592653589793', max_denominator: '10' } },
        { id: 'pi100',  label: 'pi, 100',    values: { text: '3.141592653589793', max_denominator: '100' } },
        { id: 'pi1000', label: 'pi, 1000',   values: { text: '3.141592653589793', max_denominator: '1000' } },
        { id: 'third',  label: '0.333333, 100', values: { text: '0.333333', max_denominator: '100' } },
        { id: 'tie',    label: '7/2, 1',     values: { text: '7/2', max_denominator: '1' } },
        { id: 'zero',   label: 'limit 0',    values: { text: '2/3', max_denominator: '0' } },
      ],
    },
    {
      id: 'float',
      label: 'clean up a float',
      blurb: 'The default limit of 1,000,000 recovers the fraction most short decimals were typed as.',
      params: [{ name: 'x', type: 'float', hint: 'a float', input: 'float' }],
      template: 'from fractions import Fraction\n(Fraction({$x}), Fraction({$x}).limit_denominator())',
      cases: [
        { id: 'tenth', label: '0.1',                 values: { x: '0.1' } },
        { id: 'sum',   label: '0.30000000000000004', values: { x: '0.30000000000000004' } },
        { id: 'third', label: '0.3333333333333333',  values: { x: '0.3333333333333333' } },
        { id: 'tiny',  label: '1e-07',               values: { x: '1e-7' } },
      ],
    },
  ],
  demoExplainer: 'The successive answers for pi — 22/7, 311/99, 355/113 — are its best rational approximations. With a limit of 1, 7/2 lies exactly between 3 and 4 and the lower bound wins: Fraction(3, 1). 0.30000000000000004, the float result of 0.1 + 0.2, comes back as Fraction(3, 10). 1e-07 is closer to 0 than to 1/1000000, the smallest positive fraction allowed, so the result is Fraction(0, 1).',

  patterns: [
    {
      name: 'Float to "nice" fraction',
      desc: 'Pick a limit that matches the precision you trust.',
      code: 'from fractions import Fraction\nnice = Fraction(x).limit_denominator(1000)',
    },
    {
      name: 'Aspect ratios and gear ratios',
      desc: 'Small limits give the simple ratios people recognise.',
      code: "from fractions import Fraction\nr = Fraction(1920 / 1080).limit_denominator(50)\nprint(f'{r.numerator}:{r.denominator}')  # 16:9",
    },
  ],

  examples: [
    { title: 'Undo float rounding',          code: 'from fractions import Fraction\nFraction(1.1).limit_denominator()',            returns: 'Fraction(11, 10)' },
    { title: 'cos(pi/3) is really 1/2',      code: 'import math\nfrom fractions import Fraction\nFraction(math.cos(math.pi / 3)).limit_denominator()', returns: 'Fraction(1, 2)' },
    { title: 'Already small enough: unchanged', code: 'from fractions import Fraction\nFraction(4321, 8765).limit_denominator(10000)', returns: 'Fraction(4321, 8765)' },
    { title: 'Negative values',              code: "from fractions import Fraction\nFraction('-0.65').limit_denominator(10)",   returns: 'Fraction(-2, 3)' },
    { title: 'Halfway, limit 1: the floor',       code: 'from fractions import Fraction\n(Fraction(5, 2).limit_denominator(1), Fraction(-5, 2).limit_denominator(1))', returns: '(Fraction(2, 1), Fraction(-3, 1))' },
    { title: 'An irrational stays approximate', code: 'from fractions import Fraction\nFraction(2 ** 0.5).limit_denominator(100)',  returns: 'Fraction(140, 99)' },
    { title: 'Limit below 1',                code: 'from fractions import Fraction\nFraction(2, 3).limit_denominator(0)',         returns: 'ValueError: max_denominator should be at least 1' },
  ],

  pitfalls: [
    {
      name: 'Tiny values with the default limit',
      desc: 'The default limit is 1,000,000, so anything closer to 0 than to 1/1000000 becomes zero. Raise the limit (or use Fraction(str(x))).',
      wrong: { label: 'default limit', code: 'from fractions import Fraction\nFraction(1e-7).limit_denominator()', output: 'Fraction(0, 1)' },
      fix:   { label: 'bigger limit', code: 'from fractions import Fraction\nFraction(1e-7).limit_denominator(10**8)', output: 'Fraction(1, 10000000)' },
    },
    {
      name: 'Treating the result as the exact value',
      desc: 'limit_denominator() approximates. For a real measurement that happens to look like 0.333333, a small limit snaps it to 1/3 even though the data said otherwise.',
      wrong: { label: 'limit 100', code: "from fractions import Fraction\nFraction('0.333333').limit_denominator(100)", output: 'Fraction(1, 3)' },
      fix:   { label: 'exact value', code: "from fractions import Fraction\nFraction('0.333333')", output: 'Fraction(333333, 1000000)' },
    },
  ],

  when: {
    use: [
      'Recovering the intended fraction from a float result',
      'Displaying ratios with small denominators (16:9, 3/8 inch)',
      'Rational approximations of irrational constants',
    ],
    avoid: [
      'Exact conversion of text → Fraction(str) keeps every digit',
      'Rounding to a number of decimal places → round(f, n)',
    ],
  },

  notes: {
    cpython:      'Lib/fractions.py: computes continued-fraction convergents until the next denominator would exceed the limit, then compares the last convergent with the best semiconvergent and returns the closer one (the smaller denominator on a tie)',
    'Fast path':  'If the denominator is already <= max_denominator the method returns a copy of the fraction unchanged',
  },

  related: [
    { name: 'Fraction()', slug: 'fraction', when: 'Build the value to approximate' },
    { name: 'from_float / from_decimal', slug: 'from_float-from_decimal', when: 'Exact conversion before approximating' },
    { name: 'round()', slug: 'round-floor-ceil', when: 'Round to decimal places instead' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
    { name: 'float.as_integer_ratio()', slug: 'float-as_integer_ratio', when: 'The exact (unlimited) ratio', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I convert 0.1 to 1/10 in Python?',
      a: 'Fraction(0.1).limit_denominator() returns Fraction(1, 10). Fraction(0.1) alone returns the exact binary value 3602879701896397/36028797018963968.',
    },
    {
      q: 'What does max_denominator do?',
      a: 'It caps the denominator of the answer. The method returns the closest fraction to the value among all fractions whose denominator is at most that number — for pi: 22/7 with 10, 311/99 with 100, 355/113 with 1000.',
    },
    {
      q: 'Why did limit_denominator return 0?',
      a: 'The value is closer to 0 than to 1/max_denominator, the smallest positive fraction allowed. With the default limit of 1,000,000 that happens for anything below 0.0000005 in magnitude. Pass a larger max_denominator.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.limit_denominator',
    meta:  'Fraction.limit_denominator',
  },
};
