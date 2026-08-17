// content/reference/python/operators/rshift.js

export const meta = {
  slug:        'rshift',
  name:        '>>',
  signature:   'a >> n',
  blurb:       'Right shift — floor-divide by 2ⁿ, sign preserved.',
  category:    'bitwise',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'right shift bits divide halve arithmetic shift operator',
};

export const method = {
  slug:      'rshift',
  name:      '>>',
  signature: 'a >> n',
  returns:   { type: 'int', desc: 'a with its bits moved n places right — exactly a // 2**n, flooring like // does. The sign is preserved (arithmetic shift).' },

  category:    'Bitwise operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Shift bits right — halving with a floor, so -7 >> 1 is -4, matching //.',

  cheat: {
    commonCall: 'x >> 8',
    returns:    'a // 2**n — floored, sign-preserving',
    replaces:   'extracting bytes: (rgb >> 16) & 0xFF',
    watchOut:   'negatives floor down: -7 >> 1 == -4',
  },

  parameters: [
    { name: 'a', type: 'int', required: true, default: null, desc: 'The value to shift.' },
    { name: 'n', type: 'int', required: true, default: null, desc: 'How many places — must be non-negative.' },
  ],

  demoParams: [
    { name: 'a', type: 'int', hint: 'value',  input: 'number' },
    { name: 'n', type: 'int', hint: 'places', input: 'number' },
  ],
  demoTemplate: '{a} >> {n}',
  cases: [
    { id: 'default',  label: 'default',  values: { a: 16, n: 2 } },
    { id: 'negative', label: 'negative', values: { a: -7, n: 1 } },
    { id: 'byte',     label: 'byte extract', values: { a: 16711680, n: 16 } },
  ],
  demoExplainer: 'Each place halves with a floor — note -7 >> 1 giving -4, exactly like -7 // 2. The byte-extract case shifts the red channel of 0xFF0000 down to 255.',

  patterns: [
    {
      name: 'Extracting bit fields',
      desc: 'Shift down, then mask.',
      code: 'red   = (rgb >> 16) & 0xFF\ngreen = (rgb >> 8)  & 0xFF\nblue  = rgb         & 0xFF',
    },
    {
      name: 'Halving in binary algorithms',
      desc: 'Binary search on ints, fast average without overflow risk elsewhere.',
      code: 'mid = (lo + hi) >> 1   # same as // 2',
    },
  ],

  examples: [
    { title: 'Basic shift',      code: '16 >> 2',           returns: '4' },
    { title: 'Floors negatives', code: '-7 >> 1',           returns: '-4' },
    { title: 'Byte extraction',  code: '(0xFF0000 >> 16) & 0xFF', returns: '255' },
  ],

  pitfalls: [
    {
      name: 'No unsigned (logical) shift',
      desc: 'Python has no >>> — negative numbers stay negative under >>.',
      wrong: { label: 'Stays negative', code: '-8 >> 1', output: '-4, never a huge positive' },
      fix:   { label: 'N-bit unsigned view', code: '(-8 & 0xFFFFFFFF) >> 1', output: 'mask first for 32-bit behavior' },
    },
    {
      name: 'Shifting everything away',
      desc: 'Shift counts past the bit length give 0 (or -1 for negatives) — silently.',
      wrong: { label: 'All gone', code: '5 >> 10', output: '0' },
      fix:   { label: 'Sanity-check counts', code: 'assert n < a.bit_length()', output: 'catch over-shifts' },
    },
  ],

  when: {
    use: [
      'Unpacking bit fields and bytes',
      'Floor-halving in bit-level algorithms',
    ],
    avoid: [
      'General division → // or /',
      'Unsigned semantics → mask with & first',
    ],
  },

  notes: {
    complexity: 'O(bits)',
    return:     'int',
    cpython:    'Objects/longobject.c :: long_rshift → __rshift__',
    memory:     'No allocation for small ints',
    threadSafe: 'Yes — pure computation',
  },

  related: [
    { name: '<<', slug: 'lshift',      when: 'The other direction' },
    { name: '&',  slug: 'bitwise-and', when: 'Mask after shifting' },
    { name: '//', slug: 'floordiv',    when: 'The arithmetic twin' },
  ],

  faq: [
    {
      q: 'Why is there no >>> like JavaScript?',
      a: 'Unsigned shift only makes sense with fixed-width integers. Python ints are unbounded, so there is no sign bit position to shift zeros into — mask to a width first if you need that behavior.',
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
