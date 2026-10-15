// content/reference/python/stdlib/fractions/format.js — str(), repr() and format() of a Fraction

export const meta = {
  slug:        'format',
  name:        'Fraction.__format__ (str, repr, format)',
  signature:   "format(f, spec)  /  f'{f:spec}'  /  str(f)  /  repr(f)",
  blurb:       'How a Fraction prints: repr Fraction(3, 4), str 3/4, and format specs — fill, align, sign, width and grouping (3.13+) or float-style e/f/g/% with exact rounding (3.12+).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'float-style specs 3.12+, general specs 3.13+',
  searchTerms: 'Fraction.__format__ format fraction as decimal f-string fraction python print fraction decimal places .2f percent fraction str repr Fraction(3, 4) 3/4 Invalid format specifier for object of type Fraction thousands separator',
};

export const method = {
  slug:      'format',
  name:      'Fraction.__format__ (str, repr, format)',
  signature: "format(f, spec)  /  f'{f:spec}'  /  str(f)  /  repr(f)",
  returns:   { type: 'str', desc: 'The formatted text.' },

  category:    'Fraction formatting',
  version:     'float-style specs 3.12+, general specs 3.13+',
  hasLiveDemo: true,

  subtitle: 'Float-style specs (e, E, f, F, g, G, %) round the exact rational value — half to even — so a Fraction prints the digits a float cannot hold. Without a presentation type the result stays "n/d", padded and grouped as asked.',

  covers: [],

  cheat: {
    commonCall: "f'{Fraction(1, 3):.4f}'",
    returns:    "'0.3333'",
    replaces:   "f'{float(f):.4f}' — which rounds twice",
    watchOut:   "The 0 zero-pad flag only works with a presentation type: format(f, '05') is a ValueError",
  },

  parameters: [
    { name: 'spec', type: 'str', required: false, default: "''", desc: '[[fill]align][sign][z][#][0][width][,|_][.precision][type]. With type e/E/f/F/g/G/%: float rules (z for no negative zero). Without a type: general rules; # forces "/1" on whole numbers; 0-padding is not allowed.' },
  ],

  modes: [
    {
      id: 'spec',
      label: 'format spec',
      blurb: 'A fraction (as text) and any format spec.',
      params: [
        { name: 'text', type: 'str', hint: "e.g. '355/113'", input: 'text' },
        { name: 'spec', type: 'str', hint: "e.g. '.4f', '_', '.^+10'", input: 'text' },
      ],
      template: 'from fractions import Fraction\nformat(Fraction({$text}), {$spec})',
      cases: [
        { id: 'f',     label: '.4f',     values: { text: '1/3', spec: '.4f' } },
        { id: 'e',     label: '*>20.6e', values: { text: '355/113', spec: '*>20.6e' } },
        { id: 'pct',   label: '%',       values: { text: '2/3', spec: '%' } },
        { id: 'group', label: '_',       values: { text: '103993/33102', spec: '_' } },
        { id: 'align', label: '.^+10',   values: { text: '1/7', spec: '.^+10' } },
        { id: 'zpad',  label: '05',      values: { text: '1/3', spec: '05' } },
      ],
    },
    {
      id: 'str',
      label: 'str / repr',
      blurb: 'The four everyday spellings side by side.',
      params: [{ name: 'text', type: 'str', hint: "e.g. '3/4'", input: 'text' }],
      template: "from fractions import Fraction\nf = Fraction({$text})\n(str(f), repr(f), f'{f}', f'{f:#}')",
      cases: [
        { id: 'frac',  label: '3/4',  values: { text: '3/4' } },
        { id: 'whole', label: '6',    values: { text: '6' } },
        { id: 'neg',   label: '-0.5', values: { text: '-0.5' } },
      ],
    },
    {
      id: 'digits',
      label: 'exact digits',
      blurb: 'Twenty decimals of the Fraction and of float(fraction).',
      params: [{ name: 'text', type: 'str', hint: "e.g. '1/3'", input: 'text' }],
      template: "from fractions import Fraction\nx = Fraction({$text})\n(f'{x:.20f}', f'{float(x):.20f}')",
      cases: [
        { id: 'third', label: '1/3', values: { text: '1/3' } },
        { id: 'tenth', label: '0.1', values: { text: '0.1' } },
        { id: 'seven', label: '1/7', values: { text: '1/7' } },
      ],
    },
  ],
  demoExplainer: 'f, e and % round the exact value: 1/3 to four places is 0.3333 and 2/3 as a percentage is 66.666667% (six decimals by default). Without a type the fraction stays a fraction: "_" groups both 103993 and 33102, and ".^+10" centres "+1/7" in dots. "05" is rejected because zero padding is only defined for float-style types. In the last tab the Fraction prints 0.33333333333333333333, while float(1/3) shows the binary value from the 17th decimal on.',

  patterns: [
    {
      name: 'Percentages without float rounding',
      desc: 'The rounding happens once, on the exact value.',
      code: "from fractions import Fraction\nprint(f'{Fraction(672, 499) - 1:.2%} price increase')  # 34.67% price increase",
    },
    {
      name: 'Money-style output',
      desc: 'Grouping and two decimals, half-even rounding of the exact amount.',
      code: "from fractions import Fraction\nprint(f'{Fraction(\"1234567.855\"):_.2f}')  # 1_234_567.86",
    },
    {
      name: 'Always show the denominator',
      desc: 'The # flag keeps "/1" on whole numbers (3.13+).',
      code: "from fractions import Fraction\nlabels = [f'{f:#}' for f in fractions]",
    },
  ],

  examples: [
    { title: 'repr and str',          code: 'from fractions import Fraction\nf = Fraction(3, 4)\n(repr(f), str(f))', returns: "('Fraction(3, 4)', '3/4')" },
    { title: 'Whole numbers print as ints', code: 'from fractions import Fraction\nprint(Fraction(5, 1))',             returns: '5' },
    { title: 'Forty significant digits', code: "from fractions import Fraction\nformat(Fraction(1, 7), '.40g')",      returns: "'0.1428571428571428571428571428571428571429'" },
    { title: 'Half to even on the exact value', code: "from fractions import Fraction\n(format(Fraction(5, 2), '.0f'), format(Fraction(7, 2), '.0f'))", returns: "('2', '4')" },
    { title: 'z drops the negative zero', code: "from fractions import Fraction\n(format(Fraction(-1, 1000), '.1f'), format(Fraction(-1, 1000), 'z.1f'))", returns: "('-0.0', '0.0')" },
    { title: 'Sign and alignment (3.13)', code: "from fractions import Fraction\n(format(Fraction(-1, 3), '<8'), format(Fraction(-1, 3), '=8'))", returns: "('-1/3    ', '-    1/3')" },
    { title: 'Not an integer type',     code: "from fractions import Fraction\nformat(Fraction(1, 3), 'd')",           returns: "ValueError: Invalid format specifier 'd' for object of type 'Fraction'" },
  ],

  pitfalls: [
    {
      name: 'Formatting through float',
      desc: 'float() rounds to binary first, then .2f rounds again. 2.675 as a float is a little below 2.675, so it prints 2.67; the exact Fraction is a true tie and rounds half to even, to 2.68.',
      wrong: { label: 'float first', code: "from fractions import Fraction\nformat(float(Fraction('2.675')), '.2f')", output: "'2.67'" },
      fix:   { label: 'format the Fraction', code: "from fractions import Fraction\nformat(Fraction('2.675'), '.2f')", output: "'2.68'" },
    },
    {
      name: 'Zero padding with an explicit alignment',
      desc: 'With a float-style type you can zero-pad or align, not both — CPython refuses to guess.',
      wrong: { label: "'<010.3f'", code: "from fractions import Fraction\nformat(Fraction(1, 3), '<010.3f')", output: "ValueError: Invalid format specifier '<010.3f' for object of type 'Fraction'" },
      fix:   { label: "'010.3f'", code: "from fractions import Fraction\nformat(Fraction(1, 3), '010.3f')", output: "'000000.333'" },
    },
  ],

  when: {
    use: [
      'Printing exact results as decimals with a fixed number of places',
      'Tables of fractions with aligned columns (3.13+)',
    ],
    avoid: [
      'Python 3.11 and older have no Fraction.__format__ → any non-empty spec raises TypeError (object.__format__); format float(f) there',
    ],
  },

  notes: {
    cpython:      'Fraction.__format__ in Lib/fractions.py tries the general pattern first, then the float-style pattern; rounding uses integer arithmetic (_round_to_exponent / _round_to_figures), never float',
    'Versions':   'e/E/f/F/g/G/% specs arrived in 3.12; fill, alignment, sign, width, grouping and # without a type in 3.13. On 3.12 a spec with no type other than "" raises ValueError',
    'Rounding':   'Ties round half to even on the exact value, like Decimal; a float would show its binary approximation instead',
  },

  related: [
    { name: 'format()', slug: 'format', when: 'The built-in that calls __format__', category: 'functions' },
    { name: 'str.format()', slug: 'str-format', when: 'Format specs inside templates', category: 'functions' },
    { name: 'round / floor / ceil', slug: 'round-floor-ceil', when: 'Round to a Fraction instead of text' },
    { name: 'numerator / denominator', slug: 'numerator-denominator', when: 'Build your own "n/d" text' },
    { name: 'fractions module', slug: 'fractions', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I print a Fraction as a decimal in Python?',
      a: "On 3.12+, use a float-style spec: f'{Fraction(1, 3):.4f}' gives '0.3333'. The rounding is done on the exact value. On older versions format float(f) instead (which rounds twice).",
    },
    {
      q: 'Why does format(Fraction(1, 3), "05") raise ValueError?',
      a: 'Zero padding is only supported together with a float-style presentation type (e, f, g, %…). Without a type the output is "n/d" text, for which "0" padding has no single obvious meaning, so CPython rejects it. Use ">5" with a fill character, or "05.2f".',
    },
    {
      q: 'What is the difference between str() and repr() of a Fraction?',
      a: 'repr gives the constructor form Fraction(3, 4); str gives 3/4, and just 5 for a whole number. print() and f-strings without a spec use str.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fractions.html#fractions.Fraction.__format__',
    meta:  'Fraction.__format__',
  },
};
