// content/reference/python/functions/str-rjust.js
//
// Slug is type-prefixed: `rjust` is a str method (also on bytes).

export const meta = {
  slug:        'str-rjust',
  name:        'str.rjust',
  signature:   'str.rjust(width, fillchar=" ")',
  blurb:       'Right-align within a given width — pad on the left.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'rjust right justify align pad left width format string spaces fill numeric column',
};

export const method = {
  slug:      'str-rjust',
  name:      'str.rjust',
  signature: 'str.rjust(width, fillchar=" ")',
  returns:   { type: 'str', desc: 'A copy of the string right-aligned in a field of at least `width` characters, padded on the LEFT with `fillchar`.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Right-align a string in a fixed-width field. Padding goes on the left — a copy is returned; the original is unchanged. Never truncates.',

  cheat: {
    commonCall: 'str(n).rjust(6)',
    returns:    'new str, length ≥ width',
    replaces:   'sprintf("%*s") style right-alignment',
    watchOut:   'width ≤ len returns the original untouched; fillchar must be exactly one character',
  },

  parameters: [
    { name: 'width',    type: 'int', required: true,  default: null, desc: 'Target minimum length. Shorter strings are padded on the left; longer or equal ones are returned unchanged.' },
    { name: 'fillchar', type: 'str', required: false, default: '" "', desc: 'Single-character string used for left-side padding. Multi-char or empty raises TypeError.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source', input: 'text' },
    { name: 'width',    type: 'int', hint: 'target width', input: 'number' },
    { name: 'fillchar', type: 'str', hint: 'empty = space', input: 'text-or-none' },
  ],
  cases: [
    { id: 'basic',       label: 'basic',         values: { string: '42',       width: 6,  fillchar: '' } },
    { id: 'zero-pad',    label: 'zero-pad',      values: { string: '42',       width: 6,  fillchar: '0' } },
    { id: 'currency',    label: 'currency pad',  values: { string: '$5.00',    width: 12, fillchar: '.' } },
    { id: 'no-pad',      label: 'width = len',   values: { string: 'exact',    width: 5,  fillchar: '' } },
    { id: 'too-narrow',  label: 'too narrow',    values: { string: 'long text', width: 3, fillchar: '' } },
    { id: 'empty-src',   label: 'empty string',  values: { string: '',         width: 5,  fillchar: '-' } },
  ],
  demoExplainer: 'rjust pads the original on the LEFT until the total length equals `width`. If the string is already at or past `width`, the original is returned unchanged — rjust never truncates. fillchar must be exactly one character; empty falls back to the default space.',

  patterns: [
    {
      name: 'Right-aligned numeric column',
      desc: 'Numbers align cleanly on the ones column when right-justified.',
      code: 'for n in totals:\n    print(str(n).rjust(8))',
    },
    {
      name: 'Line numbers in printouts',
      desc: 'Fixed-width line numbers keep code listings visually aligned.',
      code: 'for i, line in enumerate(lines, 1):\n    print(f"{str(i).rjust(4)} {line}")',
    },
    {
      name: 'Two-column CLI output',
      desc: 'ljust on the label, rjust on the count — no manual counting.',
      code: 'print(name.ljust(20) + str(count).rjust(6))',
    },
  ],

  examples: [
    { title: 'Basic',                code: '"42".rjust(6)',        returns: '"    42"' },
    { title: 'Zero-pad',             code: '"42".rjust(6, "0")',   returns: '"000042"' },
    { title: 'With dot fill',        code: '"$5.00".rjust(12, ".")',returns: '".......$5.00"' },
    { title: 'No padding needed',    code: '"exact".rjust(5)',      returns: '"exact"' },
    { title: 'Never truncates',      code: '"long text".rjust(3)',  returns: '"long text"  # returned unchanged' },
    { title: 'Empty string padding', code: '"".rjust(5, "-")',      returns: '"-----"' },
  ],

  pitfalls: [
    {
      name: 'Never truncates',
      desc: 'width ≤ len returns the original unchanged, not a shortened version. Great as a &quot;pad only if needed&quot; primitive; wrong when you actually want a fixed length.',
      wrong: { label: 'Overflow', code: '"long text".rjust(3)', output: '"long text"  # 9 chars, not 3' },
      fix:   { label: 'Slice first', code: 's[:width].rjust(width)', output: 'true fixed width' },
    },
    {
      name: 'rjust with "0" is NOT sign-aware — use zfill',
      desc: 'Zero-padding negative numbers with rjust puts the zeros before the sign — probably not what you want.',
      wrong: { label: 'Sign hidden', code: '"-42".rjust(6, "0")', output: '"000-42"  # sign lost in the middle' },
      fix:   { label: 'zfill is sign-aware', code: '"-42".zfill(6)', output: '"-00042"  # sign stays in front' },
    },
    {
      name: 'fillchar must be exactly one character',
      desc: 'Empty or multi-character fillchar raises TypeError. Emoji that are single codepoints work; grapheme clusters (emoji + modifier) do not.',
      wrong: { label: 'Multi-char fill', code: '"hi".rjust(10, "-=")', output: 'TypeError: The fill character must be exactly one character long' },
      fix:   { label: 'One character',   code: '"hi".rjust(10, "-")', output: '"--------hi"' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, rjust returns a new string. Assigning it back is required for the padded value to persist.',
      wrong: { label: 'Lost result', code: 's = "hi"\ns.rjust(10)\nprint(s)', output: '"hi"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.rjust(10)\nprint(s)', output: '"        hi"' },
    },
  ],

  when: {
    use: [
      'Right-aligned numeric columns in text output',
      'Line numbers and index labels in printouts',
      'Money and quantity columns where the ones digit should align',
      '&quot;Pad only if needed&quot; workflows where truncation would be wrong',
    ],
    avoid: [
      'Zero-padding numbers with a possible sign → zfill (sign-aware)',
      'Left-aligned text columns → ljust',
      'Centered content → str.center',
      'You also need to truncate → slice first, then rjust',
    ],
  },

  notes: {
    complexity: 'O(width)',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: pad — with left-side padding only',
    memory:     'Allocates one new string of length max(len, width)',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.ljust',  slug: 'str-ljust',  when: 'Left-align — padding on the right' },
    { name: 'str.center', slug: 'str-center', when: 'Pad on both sides — center the content' },
    { name: 'zfill',      slug: 'zfill',      when: 'Sign-aware zero-padding for numeric strings' },
    { name: 'join',       slug: 'join',       when: 'Compose rows of right-aligned fields' },
  ],

  faq: [
    {
      q: 'What is the difference between rjust and format &quot;&gt;&quot;?',
      a: 'The `&gt;` alignment in format() and f-strings does the same thing. `f"{s:&gt;10}"` right-aligns in a field of 10, with space fill by default. Use format when you compose with other spec fields (fill, sign, precision).',
    },
    {
      q: 'What is the difference between rjust(width, "0") and zfill(width)?',
      a: 'rjust(width, "0") pads with zeros on the left, always. zfill(width) is sign-aware: for "-42" it produces "-00042", keeping the sign in front. Use zfill for signed numbers.',
    },
    {
      q: 'Can I pad with multiple characters?',
      a: 'Not with rjust() itself — fillchar must be exactly one character. Build the padded prefix manually for repeating patterns.',
      code: 'pad = ("-=" * ((width - len(s)) // 2 + 1))[:width - len(s)]\nout = pad + s',
    },
  ],

  history: [
    { version: '1.0', note: 'rjust() has been part of str since Python 1.0.' },
    { version: '2.4', note: 'fillchar parameter added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.rjust',
    meta:  'str.rjust',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};