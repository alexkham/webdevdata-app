// content/reference/python/functions/bytes-swapcase.js

export const meta = {
  slug:        'bytes-swapcase',
  name:        'bytes.swapcase',
  signature:   'bytes.swapcase()',
  blurb:       'Flip the case of every ASCII letter — lowercase up, uppercase down.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes swapcase invert flip toggle case letters ascii binary bytearray bytearray.swapcase',
};

export const method = {
  slug:      'bytes-swapcase',
  name:      'bytes.swapcase',
  signature: 'bytes.swapcase()',
  returns:   { type: 'bytes', desc: 'A new bytes object with every ASCII letter flipped to the opposite case. Non-letters and non-ASCII bytes are unchanged.' },

  category:    'Bytes method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Rarely what you need, but occasionally exactly right. On ASCII it is a true involution — apply it twice and you are back where you started.',

  cheat: {
    commonCall: 'data.swapcase()',
    returns:    'a new bytes object; the original is unchanged',
    replaces:   'separate upper and lower passes with a per-byte test',
    watchOut:   'only ASCII letters flip; accented letters pass through',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
  ],
  demoTemplate: "bytes({s}, 'utf-8').swapcase()",
  cases: [
    { id: 'mixed',   label: 'mixed case',      values: { s: 'HeLLo' } },
    { id: 'lower',   label: 'all lowercase',   values: { s: 'hello' } },
    { id: 'upper',   label: 'all uppercase',   values: { s: 'HELLO' } },
    { id: 'digits',  label: 'digits untouched',values: { s: 'aB1cD2' } },
    { id: 'empty',   label: 'empty',           values: { s: '' } },
  ],
  demoExplainer: 'Every ASCII letter goes to the opposite case in one pass, so HeLLo becomes hEllO. All-lowercase becomes all-uppercase and vice versa. Digits and other non-letters are untouched. Applying it a second time restores the original exactly, which is not true of the str version once non-ASCII case mappings get involved.',

  patterns: [
    {
      name: 'Toggle a case-flag convention',
      desc: 'Some legacy formats encode a flag as letter case.',
      code: 'toggled = field.swapcase()',
    },
    {
      name: 'Round-trip test for case handling',
      desc: 'A cheap sanity check that a transform preserves case information.',
      code: 'assert data.swapcase().swapcase() == data',
    },
    {
      name: 'Swap case in real text',
      desc: 'Decode first so non-ASCII letters take part.',
      code: "data.decode('utf-8').swapcase().encode('utf-8')",
    },
  ],

  examples: [
    { title: 'Mixed',       code: "b'HeLLo'.swapcase()",  returns: "b'hEllO'" },
    { title: 'Lowercase',   code: "b'hello'.swapcase()",  returns: "b'HELLO'" },
    { title: 'Uppercase',   code: "b'HELLO'.swapcase()",  returns: "b'hello'" },
    { title: 'Digits stay', code: "b'aB1cD2'.swapcase()", returns: "b'Ab1Cd2'" },
    { title: 'Twice is identity', code: "b'HeLLo'.swapcase().swapcase()", returns: "b'HeLLo'" },
    { title: 'Empty',       code: "b''.swapcase()",       returns: "b''" },
  ],

  pitfalls: [
    {
      name: 'Non-ASCII letters do not flip',
      desc: 'Same limit as upper and lower — only 52 byte values are recognised. Accented letters keep their case, so the result is inconsistently flipped.',
      wrong: { label: 'Accent ignored', code: "'hÉllo'.encode().swapcase()", output: "b'H\\xc3\\x89LLO'" },
      fix:   { label: 'Work on text',   code: "'hÉllo'.swapcase().encode()", output: "b'H\\xc3\\xa9LLO'" },
    },
    {
      name: 'It returns a new object',
      desc: 'Bytes are immutable. The result must be assigned or it is lost.',
      wrong: { label: 'Result dropped', code: 'data.swapcase()\ndata', output: 'unchanged' },
      fix:   { label: 'Assign it',      code: 'data = data.swapcase()', output: 'flipped' },
    },
    {
      name: 'Not a case-insensitive comparison tool',
      desc: 'Flipping case does not normalise it. To compare regardless of case, lower both sides — swapcase just produces a different mixed-case value.',
      wrong: { label: 'Wrong tool', code: "b'ABC'.swapcase() == b'abc'.swapcase()", output: 'False' },
      fix:   { label: 'Normalise instead', code: "b'ABC'.lower() == b'abc'.lower()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Legacy formats that encode a flag in letter case',
      'Round-trip tests of case handling',
      'Deliberate case inversion of ASCII text',
    ],
    avoid: [
      'Case-insensitive comparison → lower both sides',
      'Real text with non-ASCII letters → decode first',
      'Binary data, where A-Z and a-z bytes would be corrupted',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the bytes',
    return:     'A new bytes object of the same length',
    cpython:    'Objects/bytesobject.c :: stringlib_swapcase',
    memory:     'Allocates a buffer the same size as the input',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'bytes.upper',  slug: 'bytes-upper',  when: 'Force everything to uppercase' },
    { name: 'bytes.lower',  slug: 'bytes-lower',  when: 'Force everything to lowercase' },
    { name: 'str.swapcase', slug: 'str-swapcase', when: 'The str version, which handles all of Unicode' },
    { name: 'bytes.title',  slug: 'bytes-title',  when: 'Capitalise the first letter of each word instead' },
  ],

  faq: [
    {
      q: 'When would anyone actually use this?',
      a: 'Rarely — mostly for legacy formats that encode a flag as letter case, and as a round-trip test. It exists on bytes mainly for parity with str.',
    },
    {
      q: 'Is swapcase always reversible?',
      a: 'On bytes, yes: only ASCII letters are involved and each maps back cleanly. On str it is not — some Unicode characters have case mappings that do not round-trip.',
      code: "b'HeLLo'.swapcase().swapcase() == b'HeLLo'\n# True",
    },
    {
      q: 'Does bytearray have swapcase?',
      a: 'Yes, with identical behaviour, returning a bytearray.',
      code: "bytearray(b'aB').swapcase()\n# bytearray(b'Ab')",
    },
  ],

  history: [
    { version: '3.0', note: 'bytes.swapcase arrived with the bytes type in the text/binary split.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.swapcase',
    meta:  'bytes.swapcase',
  },

};
