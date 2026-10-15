// content/reference/python/stdlib/textwrap/fill.js

export const meta = {
  slug:        'fill',
  name:        'textwrap.fill',
  signature:   "textwrap.fill(text, width=70, *, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, max_lines=None, placeholder=' [...]')",
  blurb:       "Wrap one paragraph and return it as a single string with newlines between the lines — exactly '\\n'.join(textwrap.wrap(text, ...)).",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap fill python fill paragraph wrap text with newlines word wrap string to width hanging indent bullet list print wrapped text reflow paragraph',
};

export const method = {
  slug:      'fill',
  name:      'textwrap.fill',
  signature: "textwrap.fill(text, width=70, *, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, max_lines=None, placeholder=' [...]')",
  returns:   { type: 'str', desc: "The wrapped lines joined with '\\n' (no trailing newline); '' when there is nothing to wrap." },

  category:    'textwrap function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "The print-ready version of wrap: same options, same line breaking, but one string. In the REPL you see its repr with \\n escapes — print() it to see the lines.",

  covers: ['fill'],

  cheat: {
    commonCall: 'print(textwrap.fill(text, width=60))',
    returns:    "'line one\\nline two' — a str",
    replaces:   "'\\n'.join(textwrap.wrap(text, width))",
    watchOut:   'several paragraphs are merged into one; fill each paragraph',
  },

  parameters: [
    { name: 'text',              type: 'str', required: true,  default: null,  desc: 'One paragraph. Newlines in it become spaces.' },
    { name: 'width',             type: 'int', required: false, default: '70',  desc: 'Maximum line length, indent included. Must be greater than 0.' },
    { name: 'initial_indent',    type: 'str', required: false, default: "''",  desc: 'Prefix of the first line (a bullet, a label).' },
    { name: 'subsequent_indent', type: 'str', required: false, default: "''",  desc: 'Prefix of every other line — spaces as wide as the bullet give a hanging indent.' },
    { name: 'break_long_words',  type: 'bool', required: false, default: 'True', desc: 'Cut words longer than the line width.' },
    { name: 'break_on_hyphens',  type: 'bool', required: false, default: 'True', desc: 'Allow breaks after the hyphens of compound words.' },
    { name: 'max_lines',         type: 'int | None', required: false, default: 'None', desc: 'Truncate to this many lines, ending with placeholder (3.4+).' },
    { name: 'placeholder',       type: 'str', required: false, default: "' [...]'", desc: 'What marks the cut when max_lines truncates (3.4+).' },
    { name: 'expand_tabs',       type: 'bool', required: false, default: 'True', desc: 'Expand tabs first. This and the other options in the signature (replace_whitespace, fix_sentence_endings, drop_whitespace, tabsize) work exactly as in textwrap.wrap.' },
  ],

  modes: [
    {
      id: 'fill',
      label: 'fill',
      blurb: 'The result is one string: the \\n in it are the line breaks.',
      params: [
        { name: 'text',  type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
      ],
      template: 'import textwrap\ntextwrap.fill({$text}, width={$width})',
      cases: [
        { id: 'fox',   label: 'a sentence', values: { text: 'The quick brown fox jumps over the lazy dog', width: '15' } },
        { id: 'wide',  label: 'fits on one line', values: { text: 'Short text', width: '70' } },
        { id: 'empty', label: 'empty',      values: { text: '', width: '10' } },
      ],
    },
    {
      id: 'hanging',
      label: 'hanging indent',
      blurb: 'A bullet on the first line and spaces of the same width on the rest.',
      params: [
        { name: 'text',   type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width',  type: 'int', hint: 'maximum line length', input: 'number' },
        { name: 'bullet', type: 'str', hint: 'first-line prefix', input: 'text' },
      ],
      template: "import textwrap\ntextwrap.fill({$text}, width={$width}, initial_indent={$bullet}, subsequent_indent=' ' * len({$bullet}))",
      cases: [
        { id: 'num',   label: '1.',    values: { text: 'The quick brown fox jumps', width: '12', bullet: '1. ' } },
        { id: 'dash',  label: '-',     values: { text: 'Install the package and restart the server', width: '20', bullet: '- ' } },
        { id: 'label', label: 'Note:', values: { text: 'backups run every night at two', width: '22', bullet: 'Note: ' } },
      ],
    },
  ],
  demoExplainer: "fill returns the lines of wrap joined with '\\n' and no newline at the end, so an empty input gives ''. In the hanging-indent tab the continuation lines start with as many spaces as the bullet is long, so the text lines up under the first word.",

  patterns: [
    {
      name: 'Print a wrapped message',
      desc: 'fill + print is the usual pair.',
      code: 'import textwrap\nprint(textwrap.fill(message, width=72))',
    },
    {
      name: 'Re-flow every paragraph of a text',
      desc: 'Split on blank lines, fill each, join with a blank line.',
      code: "import textwrap\nprint('\\n\\n'.join(textwrap.fill(p, width=72) for p in text.split('\\n\\n')))",
    },
    {
      name: 'Bulleted list',
      desc: 'A hanging indent per item.',
      code: "import textwrap\nfor item in items:\n    print(textwrap.fill(item, width=60, initial_indent='- ', subsequent_indent='  '))",
    },
  ],

  examples: [
    { title: 'One string with newlines',   code: "import textwrap\ntextwrap.fill('The quick brown fox jumps over the lazy dog', width=15)", returns: "'The quick brown\\nfox jumps over\\nthe lazy dog'" },
    { title: 'print() shows the lines',    code: "import textwrap\nprint(textwrap.fill('The quick brown fox jumps over the lazy dog', width=15))", returns: 'The quick brown\nfox jumps over\nthe lazy dog' },
    { title: "Same as '\\n'.join(wrap(...))", code: "import textwrap\ntextwrap.fill('a b c', width=70) == '\\n'.join(textwrap.wrap('a b c', width=70))", returns: 'True' },
    { title: 'Hanging indent',             code: "import textwrap\nbullet = '1. '\ntextwrap.fill('The quick brown fox jumps', width=12, initial_indent=bullet, subsequent_indent=' ' * len(bullet))", returns: "'1. The quick\\n   brown fox\\n   jumps'" },
    { title: 'Indent only the continuation', code: "import textwrap\ntextwrap.fill('- item one is long enough to wrap', width=16, subsequent_indent='  ')", returns: "'- item one is\\n  long enough to\\n  wrap'" },
    { title: 'Truncated with max_lines',   code: "import textwrap\ntextwrap.fill('one two three four five six', width=9, max_lines=2)", returns: "'one two\\n[...]'" },
    { title: 'Empty text',                 code: "import textwrap\ntextwrap.fill('', width=10)", returns: "''" },
  ],

  pitfalls: [
    {
      name: 'Looking at the repr instead of printing',
      desc: 'Evaluated in a REPL, the string shows its \\n escapes on one line. print() it to see the layout.',
      wrong: { label: 'repr', code: "import textwrap\ntextwrap.fill('The quick brown fox jumps over the lazy dog', width=15)", output: "'The quick brown\\nfox jumps over\\nthe lazy dog'" },
      fix:   { label: 'print', code: "import textwrap\nprint(textwrap.fill('The quick brown fox jumps over the lazy dog', width=15))", output: 'The quick brown\nfox jumps over\nthe lazy dog' },
    },
    {
      name: 'Filling text that has its own line structure',
      desc: 'Lists, headings and code lose their line breaks: fill sees one paragraph. Fill line by line (or paragraph by paragraph).',
      wrong: { label: 'fill(all)', code: "import textwrap\ntextwrap.fill('Items:\\n- one\\n- two', width=40)", output: "'Items: - one - two'" },
      fix:   { label: 'line by line', code: "import textwrap\ntext = 'Items:\\n- one\\n- two'\n'\\n'.join(textwrap.fill(line, width=40) for line in text.splitlines())", output: "'Items:\\n- one\\n- two'" },
    },
  ],

  when: {
    use: [
      'Printing or writing a paragraph to a terminal, a log or a plain-text e-mail',
      'Help texts and docstrings rendered in a monospaced font',
    ],
    avoid: [
      'You need the individual lines → textwrap.wrap',
      'Text with its own line breaks → split it and fill each part',
    ],
  },

  notes: {
    cpython:   "Lib/textwrap.py: fill(text, width=70, **kwargs) is TextWrapper(width=width, **kwargs).fill(text), and TextWrapper.fill is '\\n'.join(self.wrap(text))",
    'Trailing newline': "Never added — print() adds one, file.write() does not",
  },

  related: [
    { name: 'textwrap.wrap',  slug: 'wrap',        when: 'The lines as a list' },
    { name: 'textwrap.indent', slug: 'indent',     when: 'Prefix lines after filling' },
    { name: 'TextWrapper',    slug: 'textwrapper', when: 'Fill many texts with the same options' },
    { name: 'print()',        slug: 'print',       when: 'Show the filled text', category: 'functions' },
    { name: 'textwrap module', slug: 'textwrap',   when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does textwrap.fill show \\n instead of new lines?',
      a: 'You are looking at the repr of the returned string, which the REPL prints when you evaluate an expression. The string does contain real newline characters; print(textwrap.fill(text)) displays them as line breaks.',
    },
    {
      q: 'How do I make a hanging indent for a bulleted or numbered list?',
      a: "Use initial_indent for the bullet and subsequent_indent for spaces of the same width: textwrap.fill(item, width=60, initial_indent='1. ', subsequent_indent='   '). Both count toward width.",
    },
    {
      q: 'Does textwrap.fill add a newline at the end?',
      a: "No. It joins the lines with '\\n' and returns them without a trailing newline (and returns '' for empty or whitespace-only text).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.fill',
    meta:  'textwrap.fill',
  },
};
