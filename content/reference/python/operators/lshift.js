// content/reference/python/operators/lshift.js

export const meta = {
  slug:        'lshift',
  name:        '<<',
  signature:   'a << n',
  blurb:       'Left shift — multiply by 2ⁿ, no overflow ever.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'left shift bits multiply power two operator',
};

export const method = {
  slug:      'lshift',
  name:      '<<',
  signature: 'a << n',
  returns:   { type: 'int', desc: 'a with its bits moved n places left — exactly a * 2**n, at any size (Python ints never overflow).' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Shift bits left — arithmetic doubling per step, with no 32/64-bit ceiling.',

  cheat: {
    commonCall: '1 << n',
    returns:    'a * 2**n as an exact int',
    replaces:   '1 << 40 is 1099511627776 — no truncation, unlike JS/C',
    watchOut:   'negative shift counts raise ValueError',
  },

  parameters: [
    { name: 'a', type: 'int', required: true, default: null, desc: 'The value to shift.' },
    { name: 'n', type: 'int', required: true, default: null, desc: 'How many places — must be non-negative.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'value',  input: 'number' },
    { name: 'n', type: 'int', hint: 'places', input: 'number' },
  ],
  demoTemplate: '{a} << {n}',
  cases: [
    { id: 'default', label: 'default',    values: { a: 1, n: 4 } },
    { id: 'big',     label: 'beyond 32 bits', values: { a: 1, n: 40 } },
    { id: 'neg',     label: 'negative count', values: { a: 1, n: -1 } },
  ],
  demoExplainer: 'Each place doubles the value. The 40-place case matters: Python gives the exact 1099511627776 where fixed-width languages truncate or overflow. Negative counts raise Python’s exact ValueError.',

  patterns: [
    {
      name: 'Single-bit flags',
      desc: 'Enumerate powers of two readably.',
      code: 'READ    = 1 << 0\nWRITE   = 1 << 1\nEXECUTE = 1 << 2',
    },
    {
      name: 'Fast powers of two',
      desc: '1 << n beats 2 ** n in hot loops.',
      code: 'size = 1 << exponent',
    },
  ],

  examples: [
    { title: 'Basic shift',       code: '1 << 4',   returns: '16' },
    { title: 'Doubling',          code: '5 << 1',   returns: '10' },
    { title: 'No 32-bit ceiling', code: '1 << 40',  returns: '1099511627776' },
  ],

  pitfalls: [
    {
      name: 'Negative shift counts raise',
      desc: 'Shifting by a negative amount is not a right shift.',
      wrong: { label: 'Raises', code: '1 << -1', output: 'ValueError: negative shift count' },
      fix:   { label: 'Fix', code: '1 >> 1', output: 'use the other operator' },
    },
    {
      name: 'Precedence below + and -',
      desc: '1 << 2 + 3 is 1 << 5, not (1 << 2) + 3.',
      wrong: { label: 'Wrong parse', code: '1 << 2 + 3', output: '32' },
      fix:   { label: 'Parenthesize', code: '(1 << 2) + 3', output: '7' },
    },
  ],

  when: {
    use: [
      'Defining bit flags',
      'Exact powers of two',
      'Binary protocol / bit-packing work',
    ],
    avoid: [
      'General multiplication → *',
      'Readable powers in non-hot code → 2 ** n',
    ],
  },

  notes: {
    complexity: 'O(bits of result)',
    return:     'int — arbitrary precision',
    cpython:    'Objects/longobject.c :: long_lshift → __lshift__',
    memory:     'Grows with the result size',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '>>', slug: 'rshift',      when: 'The other direction' },
    { name: '|',  slug: 'bitwise-or',  when: 'Combine the shifted flags' },
    { name: '**', slug: 'pow',         when: 'General exponentiation' },
  ],

  faq: [
    {
      q: 'Is 1 << n faster than 2 ** n?',
      a: 'Yes, marginally — shifting is a single operation while ** goes through the general power path. It matters only in hot loops; prefer whichever reads better.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#shifting-operations',
    meta:  'shifting operations',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Byte-level encoding' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};
