// content/reference/python/functions/ord.js

export const meta = {
  slug:        'ord',
  name:        'ord',
  signature:   'ord(c)',
  blurb:       'Single character to its Unicode codepoint.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'ord ordinal character unicode codepoint code point convert to integer chr inverse',
};

export const method = {
  slug:      'ord',
  name:      'ord',
  signature: 'ord(c)',
  returns:   { type: 'int', desc: 'The Unicode codepoint of the single character c, as an integer in 0..0x10FFFF.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Turn a single character into its Unicode codepoint — the inverse of chr.',

  cheat: {
    commonCall: 'ord("A")  # 65',
    returns:    'an int',
    replaces:   'the &quot;what codepoint is this character?&quot; lookup',
    watchOut:   'input must be exactly one character — not empty, not multiple',
  },

  parameters: [
    { name: 'c', type: 'str', required: true, default: null, desc: 'A string of length exactly 1 (one Unicode character). Empty strings and multi-character strings both raise TypeError.' },
  ],

  demoParams: [
    { name: 'c', type: 'str', hint: 'one character', input: 'text' },
  ],
  cases: [
    { id: 'A',       label: 'A',       values: { c: 'A' } },
    { id: 'a',       label: 'a',       values: { c: 'a' } },
    { id: 'digit',   label: 'digit',   values: { c: '0' } },
    { id: 'space',   label: 'space',   values: { c: ' ' } },
    { id: 'greek',   label: 'Ω',       values: { c: 'Ω' } },
    { id: 'emoji',   label: '😀',      values: { c: '😀' } },
    { id: 'empty',   label: 'empty',   values: { c: '' } },
    { id: 'two',     label: 'two chars', values: { c: 'AB' } },
  ],
  demoExplainer: 'ord takes a string of length exactly 1 and returns its Unicode codepoint as an integer. Empty strings and multi-character strings both raise TypeError. chr is the inverse operation.',

  patterns: [
    {
      name: 'Letter to index (a=0)',
      desc: 'Subtract from ord("a") for a zero-based letter index.',
      code: 'idx = ord(ch.lower()) - ord("a")',
    },
    {
      name: 'Digit character to int',
      desc: 'Fast alternative to int(ch) for single-digit characters.',
      code: 'digit = ord(ch) - ord("0")',
    },
    {
      name: 'Case-only comparison',
      desc: 'ord() gives you the numeric distance between letters, useful in cipher math.',
      code: 'shift = ord("A") - ord("a")   # -32',
    },
  ],

  examples: [
    { title: 'Uppercase',       code: 'ord("A")',       returns: '65' },
    { title: 'Lowercase',       code: 'ord("a")',       returns: '97' },
    { title: 'Digit',           code: 'ord("0")',       returns: '48' },
    { title: 'Greek letter',    code: 'ord("Ω")',       returns: '937' },
    { title: 'Emoji',           code: 'ord("😀")',      returns: '128512' },
    { title: 'Empty raises',    code: 'ord("")',        returns: 'TypeError: ord() expected a character, but string of length 0 found' },
    { title: 'Two chars raise', code: 'ord("AB")',      returns: 'TypeError: ord() expected a character, but string of length 2 found' },
  ],

  pitfalls: [
    {
      name: 'Input must be EXACTLY one character',
      desc: 'Empty strings and multi-character strings both raise TypeError. There is no default and no silent truncation.',
      wrong: { label: 'Wrong length', code: 'ord("")\nord("AB")', output: "TypeError: ord() expected a character, but string of length 0/2 found" },
      fix:   { label: 'One at a time', code: 'for ch in "AB":\n    print(ord(ch))', output: '65 66' },
    },
    {
      name: 'Grapheme clusters can be more than one &quot;character&quot;',
      desc: 'A visible glyph may consist of multiple codepoints (e.g., emoji + skin-tone modifier, or a letter + combining accent). Python counts codepoints, not graphemes — such strings have len &gt; 1 and ord() rejects them.',
      wrong: { label: 'Length &gt; 1', code: 'ord("👨🏽")   # emoji + skin tone', output: "TypeError: ord() expected a character, but string of length 2 found" },
      fix:   { label: 'Iterate codepoints', code: '[ord(c) for c in "👨🏽"]', output: '[128104, 127997]' },
    },
    {
      name: 'Bytes and str give different codepoints? No — bytes give byte VALUES',
      desc: 'ord() on a bytes object of length 1 returns the byte value (0..255), not a Unicode codepoint. Same range as str for ASCII; different for anything higher.',
      wrong: { label: 'Confusing',  code: 'ord(b"A")     # bytes\nord("A")      # str', output: '65\n65  # match here — but only for ASCII' },
      fix:   { label: 'Know the input type', code: 'ord("Ω")      # 937 — str codepoint\nord(b"\\xce"[0:1])  # 206 — one raw byte', output: 'different worlds' },
    },
  ],

  when: {
    use: [
      'Turning letters into indexes or offsets',
      'Case and cipher math without table lookups',
      'Building parsers where character codepoints matter',
      'Debugging Unicode issues by inspecting exact codepoints',
    ],
    avoid: [
      'Strings with more than one character → iterate first',
      'Grapheme-aware handling of emoji + modifiers → use a Unicode library',
      'Bytes when you want codepoints (or vice versa) → know your input',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'int in 0..0x10FFFF for str input; 0..255 for bytes/bytearray input',
    cpython:    'Python/bltinmodule.c :: builtin_ord',
    memory:     'No allocation',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'chr',    slug: 'chr',    when: 'The inverse — codepoint to character' },
    { name: 'hex',    slug: 'hex',    when: 'Show the codepoint as a hex literal' },
    { name: 'len',    slug: 'len',    when: 'Check length before calling ord' },
    { name: 'int',    slug: 'int',    when: 'Parse a digit string to a number' },
  ],

  faq: [
    {
      q: 'Why does ord("AB") raise?',
      a: 'ord expects one character, not a string. To get all codepoints of a string, use a list comprehension: `[ord(c) for c in s]`.',
    },
    {
      q: 'Is ord(&quot;A&quot;) always 65?',
      a: 'Yes. Python 3 strings are Unicode; codepoint 65 is fixed by the Unicode standard as U+0041 LATIN CAPITAL LETTER A. ASCII is a subset of Unicode.',
    },
    {
      q: 'How do I convert a whole string to codepoints?',
      a: 'A list comprehension gives you the sequence.',
      code: '[ord(c) for c in "hi"]\n# [104, 105]',
    },
    {
      q: 'What is ord for on bytes?',
      a: 'For a bytes object of length 1, ord returns the byte VALUE (0..255). Convenient when you have a single-byte slice from binary data.',
    },
  ],

  history: [
    { version: '1.0', note: 'ord() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — returns codepoints up to 0x10FFFF for str input.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#ord',
    meta:  'ord',
  },

  tryInTool: [
    { name: 'Base64', href: '/tools/base64', meta: 'Adjacent character-encoding work' },
  ],
};