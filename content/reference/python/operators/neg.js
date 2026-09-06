// content/reference/python/operators/neg.js
//
// Unary minus. Slug is `neg` (after __neg__) because `sub` is the binary
// subtraction operator.

export const meta = {
  slug:        'neg',
  name:        '-x',
  signature:   '-a',
  blurb:       'Unary minus — negation, not subtraction.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'unary minus negate negation opposite sign flip neg operator prefix',
};

export const method = {
  slug:      'neg',
  name:      '-x',
  signature: '-a',
  returns:   { type: 'number', desc: 'The negation of a. Calls __neg__, so custom numeric types can define it.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The prefix form of the minus sign. Same character as subtraction, different operator entirely — and it binds tighter than ** does not.',

  cheat: {
    commonCall: '-x',
    returns:    'the opposite sign; type is preserved for int and float',
    replaces:   '0 - x, and x * -1',
    watchOut:   '-2 ** 2 is -4, because ** binds tighter than unary minus',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Operand to negate. Any type defining __neg__ works; str and list do not.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'value to negate', input: 'float' },
  ],
  demoTemplate: '-{a}',
  cases: [
    { id: 'positive', label: 'positive',      values: { a: 5 } },
    { id: 'negative', label: 'already negative', values: { a: -5 } },
    { id: 'zero',     label: 'zero',          values: { a: 0 } },
    { id: 'fraction', label: 'fractional',    values: { a: 2.5 } },
  ],
  demoExplainer: 'Unary minus flips the sign and preserves the type — negating an int gives an int, negating a float gives a float. Negating an already-negative value returns to positive. Zero is the case worth knowing about beyond the demo: negating the float 0.0 gives -0.0, a genuinely distinct value that still compares equal to 0.0.',

  patterns: [
    {
      name: 'Reverse a sort order',
      desc: 'Negating the key sorts descending without a reverse flag.',
      code: 'items.sort(key=lambda x: -x.score)',
    },
    {
      name: 'Index from the end',
      desc: 'The negative index that makes Python slicing so compact.',
      code: 'last = items[-1]',
    },
    {
      name: 'Flip a delta',
      desc: 'Reversing a direction or an offset.',
      code: 'undo = -delta',
    },
  ],

  examples: [
    { title: 'Negates',          code: '-5',        returns: '-5' },
    { title: 'Double negative',  code: '-(-5)',     returns: '5' },
    { title: 'Float',            code: '-2.5',      returns: '-2.5' },
    { title: 'Power binds first',code: '-2 ** 2',   returns: '-4' },
    { title: 'Parenthesised',    code: '(-2) ** 2', returns: '4' },
    { title: 'bool becomes int', code: '-True',     returns: '-1' },
  ],

  pitfalls: [
    {
      name: '-2 ** 2 is -4, not 4',
      desc: 'Exponentiation binds tighter than unary minus, so the power applies to 2 and the negation happens last. This silently flips the sign in formulas ported from a calculator or another language.',
      wrong: { label: 'Negation applied last', code: '-2 ** 2', output: '-4' },
      fix:   { label: 'Parenthesise',          code: '(-2) ** 2', output: '4' },
    },
    {
      name: '-0.0 is a real value',
      desc: 'Floats have a signed zero. It compares equal to 0.0, so tests pass, but it prints differently and changes the sign of the result when you divide by it.',
      wrong: { label: 'Looks equal', code: '-0.0 == 0.0, repr(-0.0)', output: "(True, '-0.0')" },
      fix:   { label: 'Normalise',   code: '-0.0 + 0.0', output: '0.0' },
    },
    {
      name: 'Not defined for str or list',
      desc: 'Unary minus needs __neg__, which sequences do not have. Reversing a string or list needs slicing or reversed, not a minus sign.',
      wrong: { label: 'No __neg__', code: "-'abc'", output: "TypeError: bad operand type for unary -: 'str'" },
      fix:   { label: 'Slice to reverse', code: "'abc'[::-1]", output: "'cba'" },
    },
    {
      name: 'bool is negated as an int',
      desc: 'True is 1, so -True is -1 rather than False. Using a minus sign to invert a flag gives a number, and the intended logical inversion is not.',
      wrong: { label: 'Arithmetic, not logic', code: '-True', output: '-1' },
      fix:   { label: 'Use not',              code: 'not True', output: 'False' },
    },
  ],

  when: {
    use: [
      'Flipping a sign or a direction',
      'Descending sort keys without a reverse flag',
      'Negative indexing from the end of a sequence',
    ],
    avoid: [
      'Inverting a boolean → not',
      'Reversing a sequence → [::-1] or reversed',
      'Subtracting two values → the binary - operator',
    ],
  },

  notes: {
    complexity: 'O(1) for machine ints and floats; O(digits) for very large ints',
    return:     'A new object; int and float preserve their type, bool becomes int',
    cpython:    'Objects/abstract.c :: PyNumber_Negative, dispatching to __neg__',
    memory:     'Allocates a new number object',
    threadSafe: 'Yes — numbers are immutable',
  },

  related: [
    { name: '-',   slug: 'sub',    when: 'Binary subtraction, the same character in infix position' },
    { name: '+x',  slug: 'pos',    when: 'The unary plus counterpart' },
    { name: 'abs', slug: 'abs',    when: 'Magnitude regardless of sign', category: 'functions' },
    { name: '**',  slug: 'pow',    when: 'The operator that outranks unary minus' },
  ],

  faq: [
    {
      q: 'Why is -2 ** 2 equal to -4?',
      a: 'Because ** has higher precedence than unary minus, so Python computes 2 ** 2 first and negates the result. This matches standard mathematical notation, where the exponent binds to the number rather than to the sign.',
      code: '-2 ** 2      # -4\n(-2) ** 2    # 4',
    },
    {
      q: 'Is -x the same as x * -1?',
      a: 'For built-in numbers, yes. For custom classes they can differ: -x calls __neg__ while x * -1 calls __mul__, and a type may implement one and not the other. -x is also marginally faster, since it avoids constructing the -1.',
    },
    {
      q: 'Why does -0.0 exist?',
      a: 'IEEE-754 floats carry a sign bit independent of the magnitude, so zero comes in two forms. They compare equal, but 1/0.0 is inf while 1/-0.0 is -inf — which is exactly when the distinction starts to matter.',
      code: '-0.0 == 0.0   # True\nrepr(-0.0)    # -0.0',
    },
  ],

  history: [
    { version: '1.0', note: 'Unary minus present since the earliest Python.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#unary-arithmetic-and-bitwise-operations',
    meta:  'Unary arithmetic operations',
  },

  tryInTool: [],
};
