// content/reference/python/functions/str-ljust.js
//
// Slug is type-prefixed: `ljust` is a str method (also on bytes).

export const meta = {
  slug:        'str-ljust',
  name:        'str.ljust',
  signature:   'str.ljust(width, fillchar=" ")',
  blurb:       'Left-align within a given width — pad on the right.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'ljust left justify align pad right width format string spaces fill',
};

export const method = {
  slug:      'str-ljust',
  name:      'str.ljust',
  signature: 'str.ljust(width, fillchar=" ")',
  returns:   { type: 'str', desc: 'A copy of the string left-aligned in a field of at least `width` characters, padded on the RIGHT with `fillchar`.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Left-align a string in a fixed-width field. Padding goes on the right — a copy is returned; the original is unchanged. Never truncates.',

  cheat: {
    commonCall: '"name".ljust(10)',
    returns:    'new str, length ≥ width',
    replaces:   'sprintf("%-*s") style formatting',
    watchOut:   'width ≤ len returns the original untouched; fillchar must be exactly one character',
  },

  parameters: [
    { name: 'width',    type: 'int', required: true,  default: null, desc: 'Target minimum length. Shorter strings are padded on the right; longer or equal ones are returned unchanged.' },
    { name: 'fillchar', type: 'str', required: false, default: '" "', desc: 'Single-character string used for right-side padding. Multi-char or empty raises TypeError.' },
  ],

  demoParams: [
    { name: 'string',   type: 'str', hint: 'the source', input: 'text' },
    { name: 'width',    type: 'int', hint: 'target width', input: 'number' },
    { name: 'fillchar', type: 'str', hint: 'empty = space', input: 'text-or-none' },
  ],
  cases: [
    { id: 'basic',       label: 'basic',         values: { string: 'name',    width: 10, fillchar: '' } },
    { id: 'fill-char',   label: 'dots fill',     values: { string: 'chapter', width: 20, fillchar: '.' } },
    { id: 'no-pad',      label: 'width = len',   values: { string: 'exact',   width: 5,  fillchar: '' } },
    { id: 'too-narrow',  label: 'too narrow',    values: { string: 'long text', width: 3, fillchar: '' } },
    { id: 'empty-src',   label: 'empty string',  values: { string: '',        width: 5,  fillchar: '-' } },
  ],
  demoExplainer: 'ljust pads the original on the RIGHT until the total length equals `width`. If the string is already at or past `width`, the original is returned unchanged — ljust never truncates. fillchar must be exactly one character; empty falls back to the default space.',

  patterns: [
    {
      name: 'Fixed-width labels',
      desc: 'Left-align a column of names or IDs.',
      code: 'for name, count in rows:\n    print(name.ljust(20) + str(count))',
    },
    {
      name: 'Dotted table of contents',
      desc: 'Fill characters make classic dotted layouts.',
      code: 'line = title.ljust(60, ".") + str(page)',
    },
    {
      name: 'CLI two-column output',
      desc: 'ljust on the left, rjust on the right, no manual counting.',
      code: 'print(name.ljust(20) + str(count).rjust(6))',
    },
  ],

  examples: [
    { title: 'Basic',                code: '"name".ljust(10)',        returns: '"name      "' },
    { title: 'With fill char',       code: '"chapter".ljust(15, ".")', returns: '"chapter........"' },
    { title: 'No padding needed',    code: '"exact".ljust(5)',         returns: '"exact"' },
    { title: 'Never truncates',      code: '"long text".ljust(3)',     returns: '"long text"  # returned unchanged' },
    { title: 'Empty string padding', code: '"".ljust(5, "-")',         returns: '"-----"' },
  ],

  pitfalls: [
    {
      name: 'Never truncates',
      desc: 'width ≤ len returns the original unchanged, not a shortened version. Great as a &quot;pad only if needed&quot; primitive; wrong when you actually want a fixed length.',
      wrong: { label: 'Overflow', code: '"long text".ljust(3)', output: '"long text"  # 9 chars, not 3' },
      fix:   { label: 'Slice first', code: 's[:width].ljust(width)', output: 'true fixed width' },
    },
    {
      name: 'fillchar must be exactly one character',
      desc: 'Empty or multi-character fillchar raises TypeError. Emoji that are single codepoints work; grapheme clusters (emoji + modifier) do not.',
      wrong: { label: 'Multi-char fill', code: '"hi".ljust(10, "-=")', output: 'TypeError: The fill character must be exactly one character long' },
      fix:   { label: 'One character',   code: '"hi".ljust(10, "-")', output: '"hi--------"' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, ljust returns a new string. Assigning it back is required for the padded value to persist.',
      wrong: { label: 'Lost result', code: 's = "hi"\ns.ljust(10)\nprint(s)', output: '"hi"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.ljust(10)\nprint(s)', output: '"hi        "' },
    },
    {
      name: 'Padding for numbers reads better as rjust',
      desc: 'Left-aligning numeric strings puts the ones column at inconsistent horizontal positions — hard to eyeball columns of totals.',
      wrong: { label: 'Ragged right', code: 'for n in [3, 42, 500]:\n    print(str(n).ljust(6))', output: '"3     "\n"42    "\n"500   "  # decimals misaligned' },
      fix:   { label: 'Use rjust',    code: 'for n in [3, 42, 500]:\n    print(str(n).rjust(6))', output: '"     3"\n"    42"\n"   500"  # aligned on the right' },
    },
  ],

  when: {
    use: [
      'Left-aligned labels in text UIs and CLI output',
      'Dotted / dashed table-of-contents layouts',
      'Fixed-width name or ID columns',
      '&quot;Pad only if needed&quot; workflows where truncation would be wrong',
    ],
    avoid: [
      'Numeric columns → rjust reads better for right-aligned numbers',
      'Centered content → str.center',
      'You also need to truncate → slice first, then ljust',
      'Padding on the left → rjust',
    ],
  },

  notes: {
    complexity: 'O(width)',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: pad — with right-side padding only',
    memory:     'Allocates one new string of length max(len, width)',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.center', slug: 'str-center', when: 'Pad on both sides — center the content' },
    { name: 'zfill',      slug: 'zfill',      when: 'Zero-pad on the left for numeric strings' },
    { name: 'join',       slug: 'join',       when: 'Compose rows of left-aligned fields' },
  ],

  faq: [
    {
      q: 'What is the difference between ljust and format &quot;&lt;&quot;?',
      a: 'The `&lt;` alignment in format() and f-strings does the same thing. `f"{s:&lt;10}"` left-aligns in a field of 10, with space fill by default. Use format when you compose with other spec fields (fill, sign, precision).',
    },
    {
      q: 'How do I pad on both sides but keep left-aligned overall?',
      a: 'ljust does not; center does the both-sides case (leaning left on odd padding). If you truly want asymmetric two-side padding, build the string manually.',
    },
    {
      q: 'Can I pad with multiple characters?',
      a: 'Not with ljust() itself — fillchar must be exactly one character. Build the padded suffix manually for repeating patterns.',
      code: 'pad = ("-=" * ((width - len(s)) // 2 + 1))[:width - len(s)]\nout = s + pad',
    },
  ],

  history: [
    { version: '1.0', note: 'ljust() has been part of str since Python 1.0.' },
    { version: '2.4', note: 'fillchar parameter added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.ljust',
    meta:  'str.ljust',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};