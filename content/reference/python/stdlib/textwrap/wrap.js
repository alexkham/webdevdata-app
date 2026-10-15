// content/reference/python/stdlib/textwrap/wrap.js

export const meta = {
  slug:        'wrap',
  name:        'textwrap.wrap',
  signature:   "textwrap.wrap(text, width=70, *, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, max_lines=None, placeholder=' [...]')",
  blurb:       'Break one paragraph into a list of lines, each at most width characters long — at whitespace, after hyphens, and inside a word only when the word itself is too long.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap wrap python wrap text to list of lines word wrap line length width split long string into lines break_long_words break_on_hyphens initial_indent subsequent_indent max_lines keep newlines',
};

export const method = {
  slug:      'wrap',
  name:      'textwrap.wrap',
  signature: "textwrap.wrap(text, width=70, *, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, max_lines=None, placeholder=' [...]')",
  returns:   { type: 'list[str]', desc: 'The lines, without newline characters. Empty when the text is empty or only whitespace.' },

  category:    'textwrap function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'One paragraph in, a list of lines out. Every newline in the input becomes a space first, so wrap reflows text — it does not keep your line breaks.',

  covers: ['wrap'],

  cheat: {
    commonCall: "textwrap.wrap(text, width=40)",
    returns:    "['first line', 'second line', ...]",
    replaces:   'hand-written loops that count characters per line',
    watchOut:   'existing line breaks are not kept; wrap each paragraph separately',
  },

  parameters: [
    { name: 'text',                 type: 'str',  required: true,  default: null,     desc: 'One paragraph. Tabs are expanded and every other whitespace character becomes a space before wrapping.' },
    { name: 'width',                type: 'int',  required: false, default: '70',     desc: 'Maximum line length, indent included. 0 or less raises ValueError.' },
    { name: 'initial_indent',       type: 'str',  required: false, default: "''",     desc: 'Prepended to the first line; counts toward its width.' },
    { name: 'subsequent_indent',    type: 'str',  required: false, default: "''",     desc: 'Prepended to every line after the first; counts toward their width.' },
    { name: 'expand_tabs',          type: 'bool', required: false, default: 'True',   desc: 'Expand tabs with str.expandtabs(tabsize) first.' },
    { name: 'replace_whitespace',   type: 'bool', required: false, default: 'True',   desc: 'After tab expansion, replace each \\t \\n \\v \\f \\r with one space.' },
    { name: 'fix_sentence_endings', type: 'bool', required: false, default: 'False',  desc: 'Put two spaces after a word that ends in a lowercase letter plus . ! or ? (optionally a quote).' },
    { name: 'break_long_words',     type: 'bool', required: false, default: 'True',   desc: 'Cut words longer than the line width. False puts them on a line of their own, longer than width.' },
    { name: 'drop_whitespace',      type: 'bool', required: false, default: 'True',   desc: 'Drop whitespace at the start and end of each line (a paragraph\'s leading whitespace stays when text follows it).' },
    { name: 'break_on_hyphens',     type: 'bool', required: false, default: 'True',   desc: 'Allow breaks right after the hyphens of compound words. False breaks at whitespace only.' },
    { name: 'tabsize',              type: 'int',  required: false, default: '8',      desc: 'Tab stop distance for expand_tabs (3.3+).' },
    { name: 'max_lines',            type: 'int | None', required: false, default: 'None', desc: 'Keep at most this many lines; the last one ends with placeholder (3.4+).' },
    { name: 'placeholder',          type: 'str',  required: false, default: "' [...]'", desc: 'Appended when max_lines cut the text (3.4+).' },
  ],

  modes: [
    {
      id: 'wrap',
      label: 'wrap',
      blurb: 'Type a paragraph and a width. Every line in the result is at most width characters.',
      params: [
        { name: 'text',  type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
      ],
      template: 'import textwrap\ntextwrap.wrap({$text}, width={$width})',
      cases: [
        { id: 'fox',    label: 'a sentence',  values: { text: 'The quick brown fox jumps over the lazy dog', width: '15' } },
        { id: 'nbsp',   label: 'no-break space', values: { text: 'Pay 100\u00a0EUR today', width: '9' } },
        { id: 'blank',  label: 'only spaces', values: { text: '   ', width: '10' } },
        { id: 'zero',   label: 'width=-1',    values: { text: 'abc', width: '-1' } },
      ],
    },
    {
      id: 'hyphens',
      label: 'break_on_hyphens',
      blurb: 'The same text wrapped twice: default, then with break_on_hyphens=False.',
      params: [
        { name: 'text',  type: 'str', hint: 'text with hyphenated words', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
      ],
      template: 'import textwrap\n(textwrap.wrap({$text}, width={$width}),\n textwrap.wrap({$text}, width={$width}, break_on_hyphens=False))',
      cases: [
        { id: 'compound', label: 'state-of-the-art', values: { text: 'a well-known state-of-the-art method', width: '12' } },
        { id: 'dashes',   label: '-- and -b',        values: { text: 'Hello there -- you goof-ball, use the -b option!', width: '12' } },
      ],
    },
    {
      id: 'long',
      label: 'break_long_words',
      blurb: 'A word longer than width: cut (default) or kept whole with break_long_words=False.',
      params: [
        { name: 'text',  type: 'str', hint: 'text with a long word', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
      ],
      template: 'import textwrap\n(textwrap.wrap({$text}, width={$width}),\n textwrap.wrap({$text}, width={$width}, break_long_words=False))',
      cases: [
        { id: 'word', label: 'long word', values: { text: 'supercalifragilistic is long', width: '8' } },
        { id: 'url',  label: 'a URL',     values: { text: 'see https://example.com/a/very/long/path', width: '20' } },
      ],
    },
    {
      id: 'indent',
      label: 'indents',
      blurb: 'initial_indent starts the first line, subsequent_indent all the others; both count toward width.',
      params: [
        { name: 'text',  type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width', type: 'int', hint: 'maximum line length', input: 'number' },
        { name: 'first', type: 'str', hint: 'initial_indent', input: 'text' },
        { name: 'rest',  type: 'str', hint: 'subsequent_indent', input: 'text' },
      ],
      template: 'import textwrap\ntextwrap.wrap({$text}, width={$width}, initial_indent={$first}, subsequent_indent={$rest})',
      cases: [
        { id: 'bullet', label: 'bullet',     values: { text: 'Note: this sentence is long enough to wrap twice', width: '20', first: '* ', rest: '  ' } },
        { id: 'quote',  label: 'e-mail quote', values: { text: 'Thanks for the report, I will look at it tomorrow', width: '24', first: '> ', rest: '> ' } },
        { id: 'tight',  label: 'indent > width', values: { text: 'Pay attention', width: '8', first: 'Warning: ', rest: '' } },
      ],
    },
  ],
  demoExplainer: "The no-break space between 100 and EUR is not a break point, so '100\\xa0EUR' stays on one line. With break_on_hyphens=False the compound word is no longer split after its hyphens; because it is longer than 12 it is then cut at exactly 12 characters, giving 'state-of-the' and '-art method'. break_long_words=False leaves a long word or URL whole on its own line, even though that line is longer than width. When the indent is longer than width, each line still takes at least one character, so 'Warning: P' is 10 characters long.",

  patterns: [
    {
      name: 'Keep existing line breaks',
      desc: 'Wrap each line (or paragraph) on its own and flatten the result.',
      code: 'import textwrap\nlines = [out for line in text.splitlines() for out in textwrap.wrap(line, width=72) or [""]]',
    },
    {
      name: 'Never split URLs or identifiers',
      desc: 'Both switches off: breaks happen at whitespace only, even if a line gets too long.',
      code: 'import textwrap\ntextwrap.wrap(text, width=60, break_long_words=False, break_on_hyphens=False)',
    },
    {
      name: 'Two-column help output',
      desc: 'Wrap the description and indent the continuation lines to the column.',
      code: "import textwrap\nfor name, desc in options:\n    lines = textwrap.wrap(desc, width=50) or ['']\n    print(f'  {name:<16}{lines[0]}')\n    for line in lines[1:]:\n        print(' ' * 18 + line)",
    },
  ],

  examples: [
    { title: 'Basic wrap',                     code: "import textwrap\ntextwrap.wrap('The quick brown fox jumps over the lazy dog', width=15)", returns: "['The quick brown', 'fox jumps over', 'the lazy dog']" },
    { title: 'Input line breaks become spaces', code: "import textwrap\ntextwrap.wrap('first line\\nsecond line', width=40)", returns: "['first line second line']" },
    { title: 'Nothing to wrap: empty list',    code: "import textwrap\ntextwrap.wrap('   ', width=10)", returns: '[]' },
    { title: 'At most two lines',              code: "import textwrap\ntextwrap.wrap('one two three four five six', width=9, max_lines=2)", returns: "['one two', '[...]']" },
    { title: 'Your own placeholder',           code: "import textwrap\ntextwrap.wrap('one two three four five six', width=9, max_lines=2, placeholder='...')", returns: "['one two', 'three...']" },
    { title: 'Tabs are expanded first',        code: "import textwrap\ntextwrap.wrap('a\\tb', width=40), textwrap.wrap('a\\tb', width=40, tabsize=4)", returns: "(['a       b'], ['a   b'])" },
    { title: 'Width must be positive',         code: "import textwrap\ntextwrap.wrap('abc', width=0)", returns: 'ValueError: invalid width 0 (must be > 0)' },
  ],

  pitfalls: [
    {
      name: 'Expecting wrap to keep line breaks',
      desc: 'wrap treats the text as one paragraph and turns newlines into spaces. Wrap each line yourself.',
      wrong: { label: 'wrap(text)', code: "import textwrap\ntextwrap.wrap('first line\\nsecond line', width=40)", output: "['first line second line']" },
      fix:   { label: 'per line', code: "import textwrap\ntext = 'first line\\nsecond line'\n[line for para in text.splitlines() for line in textwrap.wrap(para, width=40)]", output: "['first line', 'second line']" },
    },
    {
      name: 'URLs cut in the middle',
      desc: 'A URL is one long word, so the default break_long_words=True cuts it at the width. Turn it off (and break_on_hyphens, for URLs with hyphens).',
      wrong: { label: 'default', code: "import textwrap\ntextwrap.wrap('see https://example.com/a/very/long/path', width=20)", output: "['see https://example.', 'com/a/very/long/path']" },
      fix:   { label: 'keep words whole', code: "import textwrap\ntextwrap.wrap('see https://example.com/a/very/long/path', width=20, break_long_words=False, break_on_hyphens=False)", output: "['see', 'https://example.com/a/very/long/path']" },
    },
    {
      name: 'Passing bytes',
      desc: 'textwrap works on str only. With bytes the error comes from deep inside (bytes.translate gets textwrap\'s dict table) — decode first.',
      wrong: { label: 'bytes', code: "import textwrap\ntextwrap.wrap(b'bytes text')", output: "TypeError: a bytes-like object is required, not 'dict'" },
      fix:   { label: 'decode', code: "import textwrap\ntextwrap.wrap(b'bytes text'.decode())", output: "['bytes text']" },
    },
  ],

  when: {
    use: [
      'You need the lines as a list — to number them, pad them or print them in columns',
      'Plain-text output in a monospaced font',
    ],
    avoid: [
      'You want one string with newlines → textwrap.fill',
      'One line with an ellipsis → textwrap.shorten',
      'Text with several paragraphs → split it first; wrap sees one paragraph',
    ],
  },

  notes: {
    cpython:      "Lib/textwrap.py: wrap(text, width=70, **kwargs) is TextWrapper(width=width, **kwargs).wrap(text)",
    'Chunks':     'The text is split into chunks (words, whitespace runs, hyphenated pieces) by TextWrapper.wordsep_re; a line break can fall between any two chunks',
    'Edge case':  "If an indent is longer than width, CPython 3.13 can loop forever: wrap(' a', width=1, initial_indent='XX') never returns. Keep indents shorter than width",
  },

  related: [
    { name: 'textwrap.fill',    slug: 'fill',        when: 'The same, joined into one string' },
    { name: 'textwrap.shorten', slug: 'shorten',     when: 'Truncate to one line instead' },
    { name: 'TextWrapper',      slug: 'textwrapper', when: 'Reuse one set of options; all options in detail' },
    { name: 'str.splitlines()', slug: 'str-splitlines', when: 'Split into lines before wrapping each', category: 'functions' },
    { name: 'textwrap module',  slug: 'textwrap',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I wrap text in Python but keep the existing line breaks?',
      a: 'wrap and fill treat their input as one paragraph and replace newlines with spaces. Split first: [out for line in text.splitlines() for out in textwrap.wrap(line, width=70)] — add "or [\'\']" after the inner wrap(...) if you want to keep empty lines.',
    },
    {
      q: 'How do I stop textwrap from splitting long words or URLs?',
      a: 'Pass break_long_words=False so words longer than width are never cut (their line is simply longer), and break_on_hyphens=False so hyphenated words are not split after a hyphen.',
    },
    {
      q: 'Why does textwrap.wrap return an empty list?',
      a: "The text is empty or contains only whitespace. Whitespace at the start and end of lines is dropped (drop_whitespace=True), so nothing is left to put on a line. fill returns '' in the same case.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.wrap',
    meta:  'textwrap.wrap',
  },
};
