// content/reference/python/functions/int-as_integer_ratio.js
//
// Slug is type-prefixed: `as_integer_ratio` is an int method.

export const meta = {
  slug:        'int-as_integer_ratio',
  name:        'int.as_integer_ratio',
  signature:   'int.as_integer_ratio()',
  blurb:       'The number as a (numerator, denominator) pair — always with denominator 1.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'as integer ratio fraction numerator denominator rational int float duck typing',
};

export const method = {
  slug:      'int-as_integer_ratio',
  name:      'int.as_integer_ratio',
  signature: 'int.as_integer_ratio()',
  returns:   { type: 'tuple', desc: 'A (numerator, denominator) tuple. For an int the denominator is always 1 and the numerator is the value itself.' },

  category:    'Int method',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Trivial on its own — it exists so int and float share an interface, letting one code path handle both without type checks.',

  cheat: {
    commonCall: 'n.as_integer_ratio()',
    returns:    '(n, 1) — always, for every int',
    replaces:   'isinstance checks before calling the float version',
    watchOut:   'the point is the shared interface, not the value; on int alone it tells you nothing new',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'int', hint: 'integer', input: 'number' },
  ],
  demoTemplate: '({n}).as_integer_ratio()',
  cases: [
    { id: 'small',    label: 'small (5)',      values: { n: 5 } },
    { id: 'zero',     label: 'zero',           values: { n: 0 } },
    { id: 'negative', label: 'negative (-7)',  values: { n: -7 } },
    { id: 'one',      label: 'one',            values: { n: 1 } },
    { id: 'large',    label: 'large (123456)', values: { n: 123456 } },
  ],
  demoExplainer: 'For an int the answer is always (n, 1) — an integer is already a whole number over one. That looks pointless until you remember float has the same method and returns a genuine fraction: (0.5).as_integer_ratio() is (1, 2). Because both types answer the same question, numeric code can call it on either without an isinstance check. The sign stays on the numerator; the denominator is always positive.',

  patterns: [
    {
      name: 'Type-agnostic exact arithmetic',
      desc: 'Works for int and float alike — no branching on the type.',
      code: 'num, den = value.as_integer_ratio()\nexact = Fraction(num, den)',
    },
    {
      name: 'Sum a mix of ints and floats exactly',
      desc: 'Avoids float rounding by staying in integer arithmetic throughout.',
      code: 'from fractions import Fraction\ntotal = sum(Fraction(*v.as_integer_ratio()) for v in values)',
    },
    {
      name: 'Compare a float to an int without loss',
      desc: 'Cross-multiplying the ratios is exact where float comparison is not.',
      code: 'an, ad = a.as_integer_ratio()\nbn, bd = b.as_integer_ratio()\nequal = an * bd == bn * ad',
    },
  ],

  examples: [
    { title: 'Always over one',   code: '(5).as_integer_ratio()',      returns: '(5, 1)' },
    { title: 'Zero',              code: '(0).as_integer_ratio()',      returns: '(0, 1)' },
    { title: 'Sign on numerator', code: '(-7).as_integer_ratio()',     returns: '(-7, 1)' },
    { title: 'Large values fine', code: '(123456).as_integer_ratio()', returns: '(123456, 1)' },
    { title: 'Contrast with float', code: '(0.5).as_integer_ratio()',  returns: '(1, 2)' },
    { title: 'Float surprise',    code: '(0.1).as_integer_ratio()',    returns: '(3602879701896397, 36028797018963968)' },
  ],

  pitfalls: [
    {
      name: 'On int alone it looks useless',
      desc: 'Reading it in isolation, (5, 1) seems like a wasted call. The value is entirely in the shared interface with float — writing it off means reaching for isinstance branches you did not need.',
      wrong: { label: 'Needless branching', code: 'if isinstance(v, int):\n    num, den = v, 1\nelse:\n    num, den = v.as_integer_ratio()', output: 'two paths doing one job' },
      fix:   { label: 'One path',           code: 'num, den = v.as_integer_ratio()', output: 'works for int and float' },
    },
    {
      name: 'The float version is exact, not tidy',
      desc: 'Because binary floats cannot hold 0.1 exactly, the ratio you get back is the huge fraction the float actually stores. That is correct, and usually surprising.',
      wrong: { label: 'Expected (1, 10)', code: '(0.1).as_integer_ratio()', output: '(3602879701896397, 36028797018963968)' },
      fix:   { label: 'Start from a string', code: "from fractions import Fraction\nFraction('0.1')", output: 'Fraction(1, 10)' },
    },
    {
      name: 'Not available before Python 3.8',
      desc: 'float has had it for much longer, but int only gained it in 3.8. Code relying on the shared interface breaks on 3.7 with an AttributeError from the int side.',
      wrong: { label: 'Fails on 3.7', code: '(5).as_integer_ratio()', output: "AttributeError: 'int' object has no attribute 'as_integer_ratio'" },
      fix:   { label: 'Fallback',     code: 'num, den = (v.as_integer_ratio() if hasattr(v, "as_integer_ratio") else (v, 1))', output: 'portable' },
    },
  ],

  when: {
    use: [
      'Numeric code that must accept int and float interchangeably',
      'Converting any real number to fractions.Fraction without type checks',
      'Exact comparison or summation where float rounding is unacceptable',
    ],
    avoid: [
      'You already know the value is an int — the answer is (n, 1)',
      'You want a readable fraction from a decimal → Fraction(str) or decimal.Decimal',
      'Supporting Python 3.7 or older without a fallback',
    ],
  },

  notes: {
    complexity: 'O(1) — builds a two-item tuple',
    return:     'A new tuple (n, 1); the denominator is always exactly 1',
    cpython:    'Objects/longobject.c :: int_as_integer_ratio',
    memory:     'Allocates one small tuple',
    threadSafe: 'Yes — ints and tuples are immutable',
  },

  related: [
    { name: 'int.is_integer', slug: 'int-is_integer', when: 'The same shared-interface idea, for whole-number checks' },
    { name: 'float',          slug: 'float',          when: 'The type whose version returns a real fraction' },
    { name: 'divmod',         slug: 'divmod',         when: 'Quotient and remainder rather than a ratio' },
    { name: 'round',          slug: 'round',          when: 'Approximate rather than represent exactly' },
  ],

  faq: [
    {
      q: 'Why would I call this on an int at all?',
      a: 'You would not, if you knew it was an int. It exists so that code accepting "any real number" can call one method on either type. int gained it in 3.8 specifically to close that gap with float.',
      code: 'num, den = value.as_integer_ratio()   # value may be int or float',
    },
    {
      q: 'Can the denominator ever be something other than 1?',
      a: 'Not for an int — by definition an integer is itself over one. float and Fraction return genuine denominators, which is the whole point of the shared method name.',
      code: '(5).as_integer_ratio()    # (5, 1)\n(0.5).as_integer_ratio()  # (1, 2)',
    },
    {
      q: 'Is the denominator always positive?',
      a: 'Yes. The sign lives on the numerator, so (-7).as_integer_ratio() is (-7, 1) and never (7, -1). float follows the same rule, which keeps comparisons by cross-multiplication straightforward.',
    },
  ],

  history: [
    { version: '3.8', note: 'int.as_integer_ratio added, matching the float method of the same name.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.as_integer_ratio',
    meta:  'int.as_integer_ratio',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
