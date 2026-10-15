// content/reference/python/stdlib/textwrap/index.js — the textwrap module hub

export const meta = {
  slug:        'index',
  name:        'textwrap',
  signature:   'import textwrap',
  blurb:       'Plain-text layout: wrap or fill a paragraph to a line width, shorten it to one line with a placeholder, and remove or add indentation with dedent and indent.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap module python wrap text to width fill paragraph word wrap line length shorten truncate text ellipsis dedent remove common indentation triple quoted string indent add prefix to lines TextWrapper max_lines placeholder hanging indent',
};

export const method = {
  slug: 'index',
  name: 'textwrap',

  category:    'Text',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Five functions for monospaced text: wrap and fill break one paragraph into lines, shorten cuts it to one line on a word boundary, dedent removes the indentation a triple-quoted string picked up, and indent adds a prefix to lines. TextWrapper holds the options when you reuse them.',

  // every public name TextWrapper defines itself must have a member page
  coverClasses: ['TextWrapper'],

  imports: ['import textwrap', 'from textwrap import wrap, fill, shorten, dedent, indent, TextWrapper'],
  facts: [
    { label: 'Public API', value: 'wrap, fill, shorten, dedent, indent, TextWrapper' },
    { label: 'Width',      value: 'Counted with len(): one per code point, so a wide CJK character counts as 1 column and a combining accent as one more' },
    { label: 'Break points', value: "The ASCII whitespace '\\t\\n\\x0b\\x0c\\r ', hyphens inside words and -- dashes; a word longer than the width is cut anywhere. A no-break space (U+00A0) keeps words together" },
    { label: 'Source',     value: 'Lib/textwrap.py — pure Python; words are split by the regular expressions TextWrapper.wordsep_re and wordsep_simple_re' },
  ],

  modes: [
    {
      id: 'wrap',
      label: 'wrap',
      blurb: 'Break a paragraph into a list of lines no longer than width.',
      params: [
        { name: 'text',  type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
      ],
      template: 'import textwrap\ntextwrap.wrap({$text}, width={$width})',
      cases: [
        { id: 'sentence', label: 'a sentence',   values: { text: 'The quick brown fox jumps over the lazy dog', width: '15' } },
        { id: 'hyphens',  label: 'hyphens',      values: { text: 'Hello there -- you goof-ball, use the -b option!', width: '12' } },
        { id: 'long',     label: 'long word',    values: { text: 'supercalifragilistic', width: '8' } },
        { id: 'zero',     label: 'width=0',      values: { text: 'abc', width: '0' } },
      ],
    },
    {
      id: 'shorten',
      label: 'shorten',
      blurb: 'Collapse the whitespace, then drop words from the end until the rest plus " [...]" fits.',
      params: [
        { name: 'text',  type: 'str', hint: 'any text', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum length', input: 'number' },
      ],
      template: 'import textwrap\ntextwrap.shorten({$text}, width={$width})',
      cases: [
        { id: 'fits',  label: 'fits after collapsing', values: { text: 'Hello  world!', width: '12' } },
        { id: 'cut',   label: 'one short',             values: { text: 'Hello  world!', width: '11' } },
        { id: 'long',  label: 'a sentence',            values: { text: 'The quick brown fox jumps over the lazy dog', width: '25' } },
        { id: 'word',  label: 'one long word',         values: { text: 'Supercalifragilistic', width: '10' } },
      ],
    },
    {
      id: 'dedent',
      label: 'dedent',
      blurb: 'Remove the indentation every line shares. Type | for a line break.',
      params: [{ name: 'text', type: 'str', hint: 'lines separated by |', input: 'text' }],
      template: "import textwrap\ntextwrap.dedent({$text}.replace('|', '\\n'))",
      cases: [
        { id: 'code',   label: 'indented code', values: { text: '    def f():|        return 1' } },
        { id: 'uneven', label: 'uneven',        values: { text: '  a|    b|  c' } },
        { id: 'none',   label: 'nothing common', values: { text: 'no indent|    x' } },
      ],
    },
  ],
  demoExplainer: "wrap breaks at spaces and right after the hyphen of goof-ball; the free-standing -- and -b stay whole. A word longer than width is cut into width-sized pieces, and width=0 raises ValueError: invalid width 0 (must be > 0). shorten first turns 'Hello  world!' into the 12-character 'Hello world!', so width=12 keeps it and width=11 leaves 'Hello [...]'. dedent removes only what every line shares: with a line that starts at column 0 nothing is removed.",

  patterns: [
    {
      name: 'Print a paragraph at terminal width',
      desc: 'shutil.get_terminal_size() gives the current width (80 when it cannot be found).',
      code: 'import shutil, textwrap\nwidth = shutil.get_terminal_size().columns\nprint(textwrap.fill(message, width=width))',
    },
    {
      name: 'Wrap several paragraphs',
      desc: 'wrap and fill treat the whole text as one paragraph: split on blank lines first.',
      code: "import textwrap\nparagraphs = text.split('\\n\\n')\nprint('\\n\\n'.join(textwrap.fill(p, width=72) for p in paragraphs))",
    },
    {
      name: 'Multi-line strings without the indentation',
      desc: 'Write the text indented with your code; dedent removes it. The backslash avoids a leading empty line.',
      code: "import textwrap\nHELP = textwrap.dedent('''\\\n    Usage: app [options]\n      -h  show this help\n''')",
    },
    {
      name: 'One-line preview of long text',
      desc: 'shorten breaks only between words (or after a hyphen), never in the middle of one.',
      code: "import textwrap\npreview = textwrap.shorten(article.body, width=120, placeholder='…')",
    },
  ],

  examples: [
    { title: 'wrap returns a list of lines', code: "import textwrap\ntextwrap.wrap('The quick brown fox jumps over the lazy dog', width=15)", returns: "['The quick brown', 'fox jumps over', 'the lazy dog']" },
    { title: 'fill returns one string',     code: "import textwrap\ntextwrap.fill('The quick brown fox jumps over the lazy dog', width=15)", returns: "'The quick brown\\nfox jumps over\\nthe lazy dog'" },
    { title: 'shorten with a placeholder',  code: "import textwrap\ntextwrap.shorten('Hello  world!', width=11)", returns: "'Hello [...]'" },
    { title: 'dedent',                      code: "import textwrap\ntextwrap.dedent('    def f():\\n        return 1\\n')", returns: "'def f():\\n    return 1\\n'" },
    { title: 'indent',                      code: "import textwrap\ntextwrap.indent('line one\\nline two\\n', '> ')", returns: "'> line one\\n> line two\\n'" },
    { title: 'Reuse options with TextWrapper', code: "from textwrap import TextWrapper\nw = TextWrapper(width=20, initial_indent='* ', subsequent_indent='  ')\n[w.fill(p) for p in ['First point to make here', 'Second point']]", returns: "['* First point to\\n  make here', '* Second point']" },
    { title: 'Width counts characters, not columns', code: "import textwrap\ntextwrap.wrap('日本語のテキストは空白がない', width=5)", returns: "['日本語のテ', 'キストは空', '白がない']" },
  ],

  pitfalls: [
    {
      name: 'Filling text that has several paragraphs',
      desc: 'Newlines are just whitespace to wrap and fill, so the blank line between paragraphs disappears. Wrap each paragraph separately.',
      wrong: { label: 'fill(all)', code: "import textwrap\ntext = 'First paragraph is here.\\n\\nSecond one follows.'\ntextwrap.fill(text, width=60)", output: "'First paragraph is here.  Second one follows.'" },
      fix:   { label: 'per paragraph', code: "import textwrap\ntext = 'First paragraph is here.\\n\\nSecond one follows.'\n'\\n\\n'.join(textwrap.fill(p, width=60) for p in text.split('\\n\\n'))", output: "'First paragraph is here.\\n\\nSecond one follows.'" },
    },
    {
      name: 'An indent longer than the width',
      desc: 'The indent counts toward width. When it leaves no room, every line still gets at least one character, so lines run past width and words are cut.',
      wrong: { label: 'width=8', code: "import textwrap\ntextwrap.wrap('Pay attention', width=8, initial_indent='Warning: ')", output: "['Warning: P', 'ay atten', 'tion']" },
      fix:   { label: 'room for text', code: "import textwrap\ntextwrap.wrap('Pay attention', width=20, initial_indent='Warning: ')", output: "['Warning: Pay', 'attention']" },
    },
  ],

  when: {
    use: [
      'Help texts, CLI output, e-mails and logs in a monospaced font',
      'Truncating titles or previews on a word boundary — shorten',
      'Cleaning up triple-quoted strings in code — dedent',
      'Quoting or nesting text blocks — indent',
    ],
    avoid: [
      'Proportional fonts and HTML — let CSS wrap the text',
      'Exact terminal columns for CJK or emoji — measure with unicodedata.east_asian_width or a library such as wcwidth',
      'Hyphenation by syllables — textwrap only breaks at existing hyphens',
    ],
  },

  notes: {
    cpython:        'Lib/textwrap.py — pure Python. wrap, fill and shorten create a TextWrapper and call one method; dedent and indent are standalone functions',
    'One paragraph': 'wrap and fill first expand tabs (expand_tabs) and turn every other \\n\\v\\f\\r into a space (replace_whitespace), so the input is treated as one paragraph',
    'Lengths':      'All widths are len() values — code points. A combining accent counts as one more character, a full-width character as one',
  },

  related: [
    { name: 'str.splitlines()', slug: 'str-splitlines', when: 'Split text into lines (what indent uses)', category: 'functions' },
    { name: 'str.expandtabs()', slug: 'str-expandtabs', when: 'Tab expansion that wrap applies first', category: 'functions' },
    { name: 'str.ljust()',      slug: 'str-ljust',      when: 'Pad lines to a fixed width for columns', category: 'functions' },
    { name: 'string module',    slug: 'string',         when: 'Templates and character sets', category: 'stdlib' },
    { name: 're module',        slug: 're',             when: 'The regex engine behind the word splitting', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I wrap a long string to a fixed width in Python?',
      a: "textwrap.fill(text, width=40) returns the text with line breaks inserted; textwrap.wrap(text, width=40) returns the lines as a list. Both break at whitespace and after hyphens, and cut a word only when it is longer than the width (break_long_words=False keeps it whole).",
    },
    {
      q: 'What is the difference between textwrap.wrap and textwrap.fill?',
      a: "wrap returns a list of lines without newline characters; fill returns one string — exactly '\\n'.join(wrap(text, ...)). They accept the same keyword arguments.",
    },
    {
      q: 'How do I truncate a string to a length without cutting a word?',
      a: "textwrap.shorten(text, width=50, placeholder='...') collapses the whitespace, keeps as many whole words as fit and appends the placeholder (' [...]' by default). If the text already fits it is returned unchanged, apart from the collapsed whitespace.",
    },
    {
      q: 'How do I remove the indentation from a triple-quoted string?',
      a: "Pass it to textwrap.dedent, which removes the leading whitespace common to all lines. Start the string with a backslash right after the opening quotes ('''\\) so it does not begin with an empty line, or call .strip() on the result.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html',
    meta:  'textwrap — Text wrapping and filling',
  },
};
