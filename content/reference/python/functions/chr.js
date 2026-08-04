// content/reference/python/functions/chr.js

export const meta = {
  slug:        'chr',
  name:        'chr',
  signature:   'chr(i)',
  blurb:       'Codepoint to single-character string.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'chr character unicode codepoint code point convert integer string ord inverse',
};

export const method = {
  slug:      'chr',
  name:      'chr',
  signature: 'chr(i)',
  returns:   { type: 'str', desc: 'A one-character string whose Unicode codepoint is i.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Turn a Unicode codepoint into the single character at that position — the inverse of ord.',

  cheat: {
    commonCall: 'chr(65)  # "A"',
    returns:    'a str of length 1',
    replaces:   'the &quot;what character is codepoint N?&quot; lookup',
    watchOut:   'range is 0..0x10FFFF; anything outside raises ValueError',
  },

  parameters: [
    { name: 'i', type: 'int', required: true, default: null, desc: 'A Unicode codepoint in the range 0..1_114_111 (0x10FFFF). Out-of-range raises ValueError.' },
  ],

  demoParams: [
    { name: 'i', type: 'int', hint: 'codepoint', input: 'number' },
  ],
  cases: [
    { id: 'A',       label: 'A (65)',        values: { i: 65 } },
    { id: 'a',       label: 'a (97)',        values: { i: 97 } },
    { id: 'digit',   label: 'digit 0 (48)',  values: { i: 48 } },
    { id: 'space',   label: 'space (32)',    values: { i: 32 } },
    { id: 'newline', label: 'newline (10)',  values: { i: 10 } },
    { id: 'omega',   label: 'Ω (937)',       values: { i: 937 } },
    { id: 'emoji',   label: '😀 (128512)',    values: { i: 128512 } },
    { id: 'overflow',label: 'out of range',   values: { i: 2000000 } },
  ],
  demoExplainer: 'chr looks up a single codepoint and returns the character at that position. The Unicode range is 0..0x10FFFF (about 1.1 million codepoints); anything outside — negative or too large — raises ValueError. ord is the inverse operation.',

  patterns: [
    {
      name: 'Build a small alphabet',
      desc: 'chr over a range gives you consecutive characters — cheap alphabet or digit table.',
      code: 'letters = [chr(i) for i in range(ord("a"), ord("z") + 1)]',
    },
    {
      name: 'Caesar cipher shift',
      desc: 'Round-trip through codepoint, add a shift, wrap with modulo.',
      code: 'def shift(ch, k):\n    base = ord("a")\n    return chr(base + (ord(ch) - base + k) % 26)',
    },
    {
      name: 'Numeric to letter index (A=1)',
      desc: 'One-based letter indexing — common in spreadsheet-column labels.',
      code: 'column_letter = chr(ord("A") + col - 1)',
    },
  ],

  examples: [
    { title: 'Basic letter',    code: 'chr(65)',       returns: '"A"' },
    { title: 'Lowercase',       code: 'chr(97)',       returns: '"a"' },
    { title: 'Digit character', code: 'chr(48)',       returns: '"0"' },
    { title: 'Greek letter',    code: 'chr(937)',      returns: '"Ω"' },
    { title: 'Emoji',           code: 'chr(128512)',   returns: '"😀"' },
    { title: 'Out of range',    code: 'chr(2000000)',  returns: 'ValueError: chr() arg not in range(0x110000)' },
  ],

  pitfalls: [
    {
      name: 'ValueError on out-of-range',
      desc: 'The valid range is 0..0x10FFFF (inclusive). Negatives or values larger than 0x10FFFF raise ValueError — not a silent truncation.',
      wrong: { label: 'Runtime error', code: 'chr(-1)\nchr(0x110000)', output: 'ValueError: chr() arg not in range(0x110000)' },
      fix:   { label: 'Guard the range', code: 'if 0 &lt;= i &lt;= 0x10FFFF:\n    ch = chr(i)', output: 'safe lookup' },
    },
    {
      name: 'Some codepoints are &quot;lone surrogates&quot;',
      desc: 'The range 0xD800..0xDFFF holds UTF-16 surrogate halves. chr() will happily return them, but they are not valid Unicode characters — encoding them to bytes usually errors.',
      wrong: { label: 'Encoding fails', code: 's = chr(0xD800)\ns.encode("utf-8")', output: 'UnicodeEncodeError: surrogates not allowed' },
      fix:   { label: 'Stay outside the surrogate range', code: 'if not 0xD800 &lt;= i &lt;= 0xDFFF:\n    ch = chr(i)', output: 'safe codepoint' },
    },
    {
      name: 'Not the same as int → digit character',
      desc: 'chr(5) is not "5" — codepoint 5 is a control character. To turn a digit 0..9 into its digit CHARACTER, use str(n) or chr(n + ord("0")).',
      wrong: { label: 'Wrong output', code: 'chr(5)', output: '"\\x05"  # a control character' },
      fix:   { label: 'Digit character', code: 'str(5)\n# or\nchr(ord("0") + 5)', output: '"5"' },
    },
  ],

  when: {
    use: [
      'Building alphabets or digit tables from ranges',
      'Cipher / shift operations that work in codepoint space',
      'Producing specific characters from tables (emoji, symbols, control chars)',
    ],
    avoid: [
      'Digit codepoint → character → use str(n) instead',
      'Multi-character strings → chr returns exactly one character',
      'Bytes → use bytes([n]) for a single byte value',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'str of length 1',
    cpython:    'Python/bltinmodule.c :: builtin_chr — thin wrapper around PyUnicode_FromOrdinal',
    memory:     'Allocates one small string',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'ord',    slug: 'ord',    when: 'The inverse — character to codepoint' },
    { name: 'hex',    slug: 'hex',    when: 'Show the codepoint as a hex literal' },
    { name: 'int',    slug: 'int',    when: 'Parse a decimal or hex codepoint from a string' },
  ],

  faq: [
    {
      q: 'What is the difference between chr(48) and str(48)?',
      a: 'chr(48) is the CHARACTER at codepoint 48 — the digit "0". str(48) is the decimal representation of the integer 48 — the string "48". They only coincide for 0..9 (and only when you add ord("0") to the digit).',
    },
    {
      q: 'Why is the top of the range 0x10FFFF?',
      a: 'That is the last codepoint defined by the Unicode standard. Unicode has 17 planes of 65,536 codepoints each — 0x10FFFF + 1 = 17 × 65,536.',
    },
    {
      q: 'How do I get the character for a hex codepoint like U+2764?',
      a: 'Pass the number after parsing the hex.',
      code: 'chr(0x2764)          # "❤"\nchr(int("2764", 16)) # same thing',
    },
  ],

  history: [
    { version: '1.0', note: 'chr() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Range expanded to full Unicode (0..0x10FFFF); no longer limited to 0..255.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#chr',
    meta:  'chr',
  },

  tryInTool: [
    { name: 'Base64', href: '/tools/base64', meta: 'Adjacent character-encoding work' },
  ],
};