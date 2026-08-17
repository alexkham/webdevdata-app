// content/reference/python/operators/bitwise-and.js

export const meta = {
  slug:        'bitwise-and',
  name:        '&',
  signature:   'a & b',
  blurb:       'Bitwise AND — and set intersection.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'ampersand bitwise and mask bits flags intersection operator',
};

export const method = {
  slug:      'bitwise-and',
  name:      '&',
  signature: 'a & b',
  returns:   { type: 'int | set', desc: 'Ints: a bit is set only where BOTH operands have it. Sets: the intersection.' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Bit-level AND — masks, flags, and (with sets) intersection. Not the logical `and`.',

  cheat: {
    commonCall: 'flags & READ',
    returns:    'int with only the shared bits; set intersection',
    replaces:   '12 & 10 == 8 (0b1100 & 0b1010 = 0b1000)',
    watchOut:   'binds TIGHTER than ==: x & 1 == 0 parses as x & (1 == 0)',
  },

  parameters: [
    { name: 'a', type: 'int | set', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'int | set', required: true, default: null, desc: 'Right operand.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'left operand',  input: 'number' },
    { name: 'b', type: 'int', hint: 'right operand', input: 'number' },
  ],
  demoTemplate: '{a} & {b}',
  cases: [
    { id: 'default', label: 'default',   values: { a: 12, b: 10 } },
    { id: 'mask',    label: 'mask low bit', values: { a: 7, b: 1 } },
    { id: 'zero',    label: 'no overlap', values: { a: 8, b: 4 } },
  ],
  demoExplainer: '12 & 10: 0b1100 & 0b1010 keeps only the bit both share — 0b1000 = 8. Masking with 1 isolates the lowest bit (a fast odd/even test).',

  patterns: [
    {
      name: 'Flag testing',
      desc: 'The classic permissions check.',
      code: 'READ, WRITE = 0b01, 0b10\nif perms & WRITE:\n    save()',
    },
    {
      name: 'Even/odd via the low bit',
      desc: 'n & 1 is the branch-free parity check.',
      code: 'is_odd = n & 1',
    },
    {
      name: 'Set intersection',
      desc: 'Common elements of two sets.',
      code: 'both = tags_a & tags_b',
    },
  ],

  examples: [
    { title: 'Bit AND',          code: '12 & 10',         returns: '8' },
    { title: 'Low-bit mask',     code: '7 & 1',           returns: '1' },
    { title: 'Set intersection', code: '{1, 2} & {2, 3}', returns: '{2}' },
  ],

  pitfalls: [
    {
      name: 'Precedence vs ==',
      desc: '& binds tighter than comparisons — the C-programmer trap reversed.',
      wrong: { label: 'Wrong parse', code: 'x & 1 == 0', output: 'x & (1 == 0) → x & False → 0' },
      fix:   { label: 'Fix', code: '(x & 1) == 0', output: 'the intended parity test' },
    },
    {
      name: '& is not `and`',
      desc: 'No short-circuit, no truthiness — pure bit math.',
      wrong: { label: 'Wrong tool', code: 'if is_valid & save():   # both always run', output: 'bitwise on bools, no short-circuit' },
      fix:   { label: 'Fix', code: 'if is_valid and save():', output: 'logical, short-circuits' },
    },
  ],

  when: {
    use: [
      'Flag masks and permission bits',
      'Parity and low-bit tricks',
      'Set intersection',
    ],
    avoid: [
      'Logical conjunction → and',
      'Element-wise on arrays → numpy (where & IS the convention)',
    ],
  },

  notes: {
    complexity: 'O(bits); Python ints are arbitrary precision',
    return:     'int (or set); operands untouched',
    cpython:    'Objects/longobject.c :: long_and → __and__',
    memory:     'No allocation for small ints',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '|',   slug: 'bitwise-or',  when: 'Set bits instead of masking' },
    { name: '^',   slug: 'bitwise-xor', when: 'Toggle bits' },
    { name: 'and', slug: 'and',         when: 'Logical conjunction' },
  ],

  faq: [
    {
      q: 'Why do numpy and pandas use & for "and"?',
      a: 'They overload the BITWISE operators element-wise because and/or cannot be overloaded (they are control flow). Hence the mandatory parentheses in (df.a > 0) & (df.b < 5).',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations',
    meta:  'binary bitwise operations',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Byte-level encoding' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};
