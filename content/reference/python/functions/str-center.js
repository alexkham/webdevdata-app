// content/reference/python/functions/str-center.js
//
// Slug is type-prefixed: `center` is a str method (also on bytes).

export const meta = {
  slug:        'str-center',
  name:        'str.center',
  signature:   'str.center(width, fillchar=" ")',
  blurb:       'Center within a given width, padding both sides.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'center pad both sides width align middle format string spaces fill',
};

export const method = {
  slug:      'str-center',
  name:      'str.center',
  signature: 'str.center(width, fillchar=" ")',
  returns:   { type: 'str', desc: 'A copy of the string centered in a field of at least `width` characters, padded on both sides with `fillchar`. If odd padding is needed, the extra character goes on the LEFT.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Center a string in a fixed-width field — a copy is returned; the original is unchanged. Never truncates.',

  cheat: {
    commonCall: '"hi".center(10)',
    returns:    'new str, length ≥ width',
    replaces:   'sprintf("%*s") style formatting',
    watchOut:   'odd padding leans LEFT; width ≤ len returns the original untouched',
  },

  parameters: [
    { name: 'width',    type: 'int', required: true,  default: null, desc: 'Target minimum length. Shorter strings are padded; longer or equal ones are returned unchanged.' },
    { name: 'fillchar', type: 'str', required: false, default: '" "', desc: 'Single-character string used for padding. Multi-char or empty raises TypeError.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source', input: 'text' },
    { name: 'width',    type: 'int', hint: 'target width', input: 'number' },
    { name: 'fillchar', type: 'str', hint: 'empty = space', input: 'text-or-none' },
  ],
  cases: [
    { id: 'even',        label: 'even padding',  values: { string: 'hi',    width: 8,  fillchar: '' } },
    { id: 'odd-left',    label: 'odd → left',    values: { string: 'hi',    width: 7,  fillchar: '' } },
    { id: 'fill-char',   label: 'fill char',     values: { string: 'title', width: 15, fillchar: '-' } },
    { id: 'no-pad',      label: 'width = len',   values: { string: 'exact', width: 5,  fillchar: '' } },
    { id: 'too-narrow',  label: 'too narrow',    values: { string: 'long text', width: 3, fillchar: '' } },
    { id: 'empty-src',   label: 'empty string',  values: { string: '',      width: 5,  fillchar: '*' } },
  ],
  demoExplainer: 'center pads the original on BOTH sides until the total length equals `width`. When the padding is odd, the extra character goes on the LEFT (e.g. "hi".center(5) → "  hi "). If the string is already at or past `width`, the original is returned unchanged — center never truncates. fillchar must be exactly one character; empty falls back to the default space.',

  patterns: [
    {
      name: 'Section headers',
      desc: 'Bracket a title with fill characters — great for text-mode banners.',
      code: 'print(" README ".center(60, "="))',
    },
    {
      name: 'Tabular labels',
      desc: 'Fixed-width centered column labels.',
      code: 'header = "".join(col.center(12) for col in columns)',
    },
    {
      name: 'Aligned CLI output',
      desc: 'Use center alongside ljust/rjust to lay out mixed-alignment rows.',
      code: 'print(name.ljust(20) + status.center(10) + count.rjust(6))',
    },
  ],

  examples: [
    { title: 'Even padding',     code: '"hi".center(8)',        returns: '"   hi   "' },
    { title: 'Odd → left',       code: '"hi".center(7)',        returns: '"   hi  "  # extra space on the left' },
    { title: 'With fill char',   code: '"title".center(15, "-")',returns: '"-----title-----"' },
    { title: 'No padding needed',code: '"exact".center(5)',      returns: '"exact"' },
    { title: 'Never truncates',  code: '"long text".center(3)',  returns: '"long text"  # returned unchanged' },
    { title: 'Empty source',     code: '"".center(5, "*")',      returns: '"*****"' },
  ],

  pitfalls: [
    {
      name: 'Odd padding leans LEFT, not right',
      desc: 'When (width - len) is odd, the extra padding character goes on the LEFT side. Consistent, but surprising if you expected symmetric-visual bias toward right.',
      wrong: { label: 'Not centered visually', code: '"hi".center(5)', output: '"  hi "  # left has one more space than right' },
      fix:   { label: 'Read as: ceil left, floor right', code: 'right = (width - len(s)) // 2\nleft  = width - len(s) - right', output: 'left &gt;= right' },
    },
    {
      name: 'Never truncates',
      desc: 'width ≤ len returns the original unchanged, not a shortened version. Great as a &quot;pad only if needed&quot; primitive; wrong when you actually want a fixed length.',
      wrong: { label: 'Overflow', code: '"long text".center(3)', output: '"long text"  # 9 chars, not 3' },
      fix:   { label: 'Slice first', code: 's[:width].center(width)', output: 'true fixed width' },
    },
    {
      name: 'fillchar must be exactly one character',
      desc: 'Empty or multi-character fillchar raises TypeError. Emoji that are single codepoints work; grapheme clusters (emoji + modifier) do not.',
      wrong: { label: 'Multi-char fill', code: '"hi".center(10, "-=")', output: 'TypeError: The fill character must be exactly one character long' },
      fix:   { label: 'One character',   code: '"hi".center(10, "-")', output: '"----hi----"' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, center returns a new string. Assigning it back is required for the padded value to persist.',
      wrong: { label: 'Lost result', code: 's = "hi"\ns.center(10)\nprint(s)', output: '"hi"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.center(10)\nprint(s)', output: '"    hi    "' },
    },
  ],

  when: {
    use: [
      'Centered labels in text UIs and CLI banners',
      'Tabular output where visual center matters',
      'Padding-only-if-needed workflows',
      'Rendering fixed-width report columns',
    ],
    avoid: [
      'Numeric columns → rjust reads better for right-aligned numbers',
      'Left-aligned columns → ljust',
      'You need to truncate too → slice first, then center',
      'You need padding on one side only → ljust or rjust',
    ],
  },

  notes: {
    complexity: 'O(width)',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: pad — with computed left/right halves',
    memory:     'Allocates one new string of length max(len, width)',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'zfill', slug: 'zfill', when: 'Zero-pad on the left for numeric strings' },
    { name: 'strip', slug: 'strip', when: 'The opposite — remove whitespace from both sides' },
    { name: 'join',  slug: 'join',  when: 'Compose lines of centered fields' },
  ],

  faq: [
    {
      q: 'Why does the extra padding go on the left?',
      a: 'CPython uses floor(padding / 2) on the right and ceil(padding / 2) on the left. This makes center() deterministic — Python has consistently biased extra padding toward the left since the method was introduced.',
    },
    {
      q: 'What is the difference between center and format &quot;^&quot;?',
      a: 'The `^` alignment in format() and f-strings does the same thing. `f"{s:^10}"` centers in a field of 10, with space fill by default. Use format when you compose with other spec fields (fill, sign, precision).',
    },
    {
      q: 'Can I pad with multiple characters?',
      a: 'Not with center() itself — fillchar must be exactly one character. For repeating patterns, build the padded string manually.',
      code: 'left  = (width - len(s)) // 2\npad   = ("-=" * ((left // 2) + 1))[:left]\ncentered = pad + s + pad[::-1]',
    },
  ],

  history: [
    { version: '1.0', note: 'center() has been part of str since Python 1.0.' },
    { version: '2.4', note: 'fillchar parameter added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.center',
    meta:  'str.center',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};