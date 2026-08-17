// content/reference/python/operators/invert.js

export const meta = {
  slug:        'invert',
  name:        '~',
  signature:   '~a',
  blurb:       'Bitwise NOT — always equals -a - 1.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'tilde invert bitwise not complement negate bits operator',
};

export const method = {
  slug:      'invert',
  name:      '~',
  signature: '~a',
  returns:   { type: 'int', desc: 'The two’s-complement inversion: every bit flipped, which for Python’s unbounded ints is exactly -a - 1.' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Flip every bit — with unbounded ints that means ~a == -a - 1, always.',

  cheat: {
    commonCall: '~n',
    returns:    'int: -a - 1',
    replaces:   '~0 is -1, ~5 is -6, ~-1 is 0',
    watchOut:   '~ is not logical negation — that is `not`',
  },

  parameters: [
    { name: 'a', type: 'int', required: true, default: null, desc: 'The int to invert. Floats raise TypeError.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'the int', input: 'number' },
  ],
  demoTemplate: '~{a}',
  cases: [
    { id: 'default', label: 'default', values: { a: 5 } },
    { id: 'zero',    label: 'zero',    values: { a: 0 } },
    { id: 'minus1',  label: '-1',      values: { a: -1 } },
  ],
  demoExplainer: 'Python ints have no fixed width, so "flip all bits" is defined arithmetically: ~a is exactly -a - 1. Hence ~0 → -1 and ~-1 → 0.',

  patterns: [
    {
      name: 'Building masks',
      desc: 'Clear specific bits by AND-ing with an inverted mask.',
      code: 'flags &= ~DIRTY_BIT   # clear one flag',
    },
    {
      name: 'Index-from-end trick',
      desc: '~i equals -(i+1), pairing first↔last in one expression.',
      code: 'for i in range(len(s) // 2):\n    if s[i] != s[~i]:   # palindrome check\n        return False',
    },
  ],

  examples: [
    { title: 'Positive int', code: '~5',  returns: '-6' },
    { title: 'Zero',         code: '~0',  returns: '-1' },
    { title: 'Negative int', code: '~-1', returns: '0' },
  ],

  pitfalls: [
    {
      name: '~ on a bool is an int trap',
      desc: '~True is -2 — historically legal, deprecated in 3.12+ precisely because it confuses.',
      wrong: { label: 'Surprising', code: '~True', output: '-2 (DeprecationWarning in 3.12+)' },
      fix:   { label: 'Fix', code: 'not flag', output: 'logical negation' },
    },
    {
      name: 'Expecting an unsigned flip',
      desc: 'There is no fixed width — mask explicitly for N-bit behavior.',
      wrong: { label: 'Negative result', code: '~0b1010', output: '-11, not 0b0101' },
      fix:   { label: '4-bit flip', code: '~0b1010 & 0b1111', output: '5 (0b0101)' },
    },
  ],

  when: {
    use: [
      'Clearing flag bits with & ~mask',
      'The ~i index-from-end idiom',
    ],
    avoid: [
      'Logical negation → not',
      'Fixed-width complement → mask with & ((1 << n) - 1)',
    ],
  },

  notes: {
    complexity: 'O(bits)',
    return:     'int',
    cpython:    'Objects/longobject.c :: long_invert → __invert__',
    memory:     'No allocation for small ints',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '&',   slug: 'bitwise-and', when: 'Apply the inverted mask' },
    { name: '^',   slug: 'bitwise-xor', when: 'Flip selected bits only' },
    { name: 'not', slug: 'not',         when: 'Truth negation' },
  ],

  faq: [
    {
      q: 'Why is ~5 equal to -6 and not 2?',
      a: 'Two’s complement with unlimited bits: flipping every bit of a is arithmetically -a - 1. A fixed-width language shows you the masked version of the same number.',
    },
  ],

  history: [
    { version: '3.12', note: '~ on bool deprecated.' },
    { version: '1.0',  note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#unary-arithmetic-and-bitwise-operations',
    meta:  'unary operations',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Byte-level encoding' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};
