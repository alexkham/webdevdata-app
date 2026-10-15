// content/reference/python/stdlib/textwrap/textwrapper.js — textwrap.TextWrapper

export const meta = {
  slug:        'textwrapper',
  name:        'textwrap.TextWrapper',
  signature:   "textwrap.TextWrapper(width=70, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, *, max_lines=None, placeholder=' [...]')",
  blurb:       'The class behind wrap, fill and shorten: every option is an instance attribute, so one configured wrapper can format many texts and be adjusted between uses.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap TextWrapper python class TextWrapper.wrap TextWrapper.fill wrapper options width initial_indent subsequent_indent expand_tabs tabsize replace_whitespace fix_sentence_endings break_long_words drop_whitespace break_on_hyphens max_lines placeholder reuse wrapper',
};

export const method = {
  slug:      'textwrapper',
  name:      'textwrap.TextWrapper',
  signature: "textwrap.TextWrapper(width=70, initial_indent='', subsequent_indent='', expand_tabs=True, replace_whitespace=True, fix_sentence_endings=False, break_long_words=True, drop_whitespace=True, break_on_hyphens=True, tabsize=8, *, max_lines=None, placeholder=' [...]')",
  returns:   { type: 'TextWrapper', desc: 'A wrapper whose options are plain attributes; call .wrap(text) for a list of lines or .fill(text) for one string.' },

  category:    'textwrap class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Set the options once, then call wrap() or fill() as often as you like. The constructor only stores the arguments — nothing is checked until you wrap, so width=0 fails at the first call, not at construction.',

  covers: ['TextWrapper', 'TextWrapper.wrap', 'TextWrapper.fill'],

  cheat: {
    commonCall: "w = TextWrapper(width=60, subsequent_indent='  ')\nw.fill(text)",
    returns:    "w.wrap(text) → list[str]; w.fill(text) → str",
    replaces:   'repeating the same keyword arguments in every wrap/fill call',
    watchOut:   'a misspelled option is a TypeError; a wrong value only fails when wrapping',
  },

  parameters: [
    { name: 'width',                type: 'int',  required: false, default: '70',    desc: 'Maximum line length, indent included. Words longer than this are cut unless break_long_words is False. Must be > 0 when wrapping.' },
    { name: 'initial_indent',       type: 'str',  required: false, default: "''",    desc: 'Prefix of the first line of output; counts toward its width. Not added to empty output.' },
    { name: 'subsequent_indent',    type: 'str',  required: false, default: "''",    desc: 'Prefix of every other line; counts toward their width.' },
    { name: 'expand_tabs',          type: 'bool', required: false, default: 'True',  desc: 'Expand tabs with text.expandtabs(tabsize) before anything else.' },
    { name: 'replace_whitespace',   type: 'bool', required: false, default: 'True',  desc: "After tab expansion, replace each of '\\t\\n\\v\\f\\r' with a single space. With expand_tabs=False a tab becomes one space." },
    { name: 'fix_sentence_endings', type: 'bool', required: false, default: 'False', desc: "Two spaces after a chunk ending in an ASCII lowercase letter + . ! or ? (and an optional quote). Cannot tell 'Dr.' from a sentence end." },
    { name: 'break_long_words',     type: 'bool', required: false, default: 'True',  desc: 'Cut words longer than the line width. False puts such a word on its own line, longer than width.' },
    { name: 'drop_whitespace',      type: 'bool', required: false, default: 'True',  desc: 'Drop whitespace at the start and end of every line (after wrapping, before indenting). Leading whitespace of the paragraph stays if text follows it.' },
    { name: 'break_on_hyphens',     type: 'bool', required: false, default: 'True',  desc: 'Prefer breaks after the hyphens of compound words. Only the value True selects that splitting (the code tests "is True").' },
    { name: 'tabsize',              type: 'int',  required: false, default: '8',     desc: 'Tab stops for expand_tabs: a tab moves to the next multiple of tabsize; 0 or less removes tabs (3.3+).' },
    { name: 'max_lines',            type: 'int | None', required: false, default: 'None', desc: 'Keyword only. Output at most this many lines, the last ending with placeholder (3.4+).' },
    { name: 'placeholder',          type: 'str',  required: false, default: "' [...]'", desc: 'Keyword only. Marks truncated output. The indent plus the placeholder without leading whitespace must fit in width, else ValueError (3.4+).' },
  ],

  modes: [
    {
      id: 'reuse',
      label: 'reuse',
      blurb: 'One wrapper, several paragraphs (separate them with |).',
      params: [
        { name: 'text',  type: 'str', hint: 'paragraphs separated by |', input: 'text' },
        { name: 'width', type: 'int', hint: 'width', input: 'number' },
        { name: 'first', type: 'str', hint: 'initial_indent', input: 'text' },
        { name: 'rest',  type: 'str', hint: 'subsequent_indent', input: 'text' },
      ],
      template: "from textwrap import TextWrapper\nw = TextWrapper(width={$width}, initial_indent={$first}, subsequent_indent={$rest})\n[w.fill(p) for p in {$text}.split('|')]",
      cases: [
        { id: 'bullets', label: 'bullets',  values: { text: 'First point to make here|Second point', width: '20', first: '* ', rest: '  ' } },
        { id: 'numbers', label: 'numbered', values: { text: 'Install the package|Restart the server when asked', width: '18', first: '#  ', rest: '   ' } },
        { id: 'zero',    label: 'width=0',  values: { text: 'abc', width: '0', first: '', rest: '' } },
      ],
    },
    {
      id: 'max_lines',
      label: 'max_lines',
      blurb: 'Truncate after max_lines lines (empty = None, no limit) and mark the cut with placeholder.',
      params: [
        { name: 'text',        type: 'str', hint: 'a paragraph', input: 'text' },
        { name: 'width',       type: 'int', hint: 'width', input: 'number' },
        { name: 'max',         type: 'int | None', hint: 'max_lines', input: 'number-or-none' },
        { name: 'placeholder', type: 'str', hint: 'placeholder', input: 'text' },
      ],
      template: 'from textwrap import TextWrapper\nTextWrapper(width={$width}, max_lines={$max}, placeholder={$placeholder}).wrap({$text})',
      cases: [
        { id: 'two',   label: 'max_lines=2', values: { text: 'one two three four five six', width: '12', max: '2', placeholder: ' …' } },
        { id: 'none',  label: 'None',        values: { text: 'one two three four five six', width: '12', max: '', placeholder: ' …' } },
        { id: 'back',  label: 'backs off',   values: { text: 'one two three four five six', width: '9', max: '2', placeholder: ' [...]' } },
        { id: 'small', label: 'too small',   values: { text: 'one two three', width: '4', max: '1', placeholder: ' [...]' } },
      ],
    },
    {
      id: 'sentences',
      label: 'fix_sentence_endings',
      blurb: 'Two spaces after every detected sentence end.',
      params: [
        { name: 'text',  type: 'str', hint: 'a few sentences', input: 'text' },
        { name: 'width', type: 'int', hint: 'width', input: 'number' },
      ],
      template: 'from textwrap import TextWrapper\nTextWrapper(width={$width}, fix_sentence_endings=True).fill({$text})',
      cases: [
        { id: 'ok',  label: 'three sentences', values: { text: 'It works. Really. Try it!', width: '30' } },
        { id: 'dr',  label: 'Dr.',             values: { text: 'See Dr. Smith. He is in.', width: '40' } },
        { id: 'cap', label: 'capital before .', values: { text: 'Made in the USA. Shipped today.', width: '40' } },
      ],
    },
    {
      id: 'whitespace',
      label: 'drop_whitespace',
      blurb: 'Default first, then drop_whitespace=False: spaces at line starts and ends are kept.',
      params: [
        { name: 'text',  type: 'str', hint: 'text with runs of spaces', input: 'text' },
        { name: 'width', type: 'int', hint: 'width', input: 'number' },
      ],
      template: 'from textwrap import TextWrapper\n(TextWrapper(width={$width}).wrap({$text}),\n TextWrapper(width={$width}, drop_whitespace=False).wrap({$text}))',
      cases: [
        { id: 'runs',  label: 'runs of spaces', values: { text: 'one   two   three', width: '10' } },
        { id: 'lead',  label: 'leading spaces', values: { text: '   indented start of text', width: '12' } },
      ],
    },
    {
      id: 'tabs',
      label: 'tabsize',
      blurb: "The cells are joined with tabs; each tab moves to the next multiple of tabsize.",
      params: [
        { name: 'cells',   type: 'list[str]', hint: 'comma-separated cells', input: 'csv' },
        { name: 'tabsize', type: 'int', hint: 'tab stop distance', input: 'number' },
      ],
      template: "from textwrap import TextWrapper\nTextWrapper(width=60, tabsize={$tabsize}).wrap('\\t'.join({$cells}))",
      cases: [
        { id: 'four',  label: 'tabsize=4', values: { cells: 'name, age, city', tabsize: '4' } },
        { id: 'eight', label: 'tabsize=8', values: { cells: 'name, age, city', tabsize: '8' } },
        { id: 'zero',  label: 'tabsize=0', values: { cells: 'name, age, city', tabsize: '0' } },
      ],
    },
  ],
  demoExplainer: "The constructor accepts width=0; the ValueError appears at the first fill(). With max_lines=2 and width=9 the second line cannot hold 'three [...]', so the placeholder ends up alone on that line as '[...]'. fix_sentence_endings only knows the pattern lowercase letter + . ! or ?: 'Dr.' gets two spaces, 'USA.' does not. With tabsize=4 'name' fills a whole tab stop, so its tab adds 4 spaces, while the tab after 'age' (column 11) adds 1.",

  patterns: [
    {
      name: 'A reusable formatter for help output',
      desc: 'Configure once at module level, call fill everywhere.',
      code: "from textwrap import TextWrapper\nHELP = TextWrapper(width=72, initial_indent='  ', subsequent_indent='  ')\nfor line in sections:\n    print(HELP.fill(line))",
    },
    {
      name: 'Change one option between calls',
      desc: 'Options are attributes: assign and wrap again.',
      code: 'from textwrap import TextWrapper\nw = TextWrapper(width=40)\nnarrow = w.wrap(text)\nw.width = 80\nwide = w.wrap(text)',
    },
    {
      name: 'Truncated preview with a link marker',
      desc: 'max_lines plus a placeholder of your own.',
      code: "from textwrap import TextWrapper\npreview = TextWrapper(width=60, max_lines=3, placeholder=' … (read more)').fill(body)",
    },
  ],

  examples: [
    { title: 'One wrapper, many texts',        code: "from textwrap import TextWrapper\nw = TextWrapper(width=20, initial_indent='* ', subsequent_indent='  ')\n[w.fill(p) for p in ['First point to make here', 'Second point']]", returns: "['* First point to\\n  make here', '* Second point']" },
    { title: 'Options are attributes',         code: "from textwrap import TextWrapper\nw = TextWrapper(width=12)\nw.width = 6\nw.wrap('one two three four')", returns: "['one', 'two', 'three', 'four']" },
    { title: 'wrap() and fill()',              code: "from textwrap import TextWrapper\nw = TextWrapper(width=12)\nw.wrap('one two three four'), w.fill('one two three four')", returns: "(['one two', 'three four'], 'one two\\nthree four')" },
    { title: 'The defaults',                   code: 'from textwrap import TextWrapper\nw = TextWrapper()\nw.width, w.initial_indent, w.tabsize, w.max_lines, w.placeholder', returns: "(70, '', 8, None, ' [...]')" },
    { title: 'Two spaces after sentences',     code: "from textwrap import TextWrapper\nTextWrapper(width=30, fix_sentence_endings=True).fill('It works. Really. Try it!')", returns: "'It works.  Really.  Try it!'" },
    { title: 'Whitespace kept at line edges',  code: "from textwrap import TextWrapper\nTextWrapper(width=10, drop_whitespace=False).wrap('one   two   three')", returns: "['one   two', '   three']" },
    { title: 'No tab expansion: one space',    code: "from textwrap import TextWrapper\nTextWrapper(width=20, expand_tabs=False).wrap('a\\tb')", returns: "['a b']" },
    { title: 'Positional arguments work too',  code: "from textwrap import TextWrapper\nTextWrapper(10, '> ').wrap('hello world again')", returns: "['> hello', 'world', 'again']" },
  ],

  pitfalls: [
    {
      name: 'A misspelled option',
      desc: 'Unknown keyword arguments raise TypeError — Python 3.13 even suggests the right name.',
      wrong: { label: 'wdith', code: 'from textwrap import TextWrapper\nTextWrapper(wdith=10)', output: "TypeError: TextWrapper.__init__() got an unexpected keyword argument 'wdith'. Did you mean 'width'?" },
      fix:   { label: 'width', code: 'from textwrap import TextWrapper\nTextWrapper(width=10).width', output: '10' },
    },
    {
      name: 'A placeholder that cannot fit',
      desc: "With max_lines set, the indent plus the placeholder (without its leading space) must fit in width. ' [...]' needs 5 characters.",
      wrong: { label: 'width=4', code: "from textwrap import TextWrapper\nTextWrapper(width=4, max_lines=1).wrap('one two three')", output: 'ValueError: placeholder too large for max width' },
      fix:   { label: "placeholder='…'", code: "from textwrap import TextWrapper\nTextWrapper(width=4, max_lines=1, placeholder='…').wrap('one two three')", output: "['one…']" },
    },
    {
      name: 'replace_whitespace=False with newlines in the text',
      desc: 'The newlines stay inside the lines and are not break points for the layout, so the result is not what it looks like. Wrap each line separately instead.',
      wrong: { label: 'keep \\n', code: "from textwrap import TextWrapper\nTextWrapper(width=20, replace_whitespace=False).wrap('line one\\nline two')", output: "['line one\\nline two']" },
      fix:   { label: 'per line', code: "from textwrap import TextWrapper\ntext = 'line one\\nline two'\n[TextWrapper(width=20).fill(line) for line in text.splitlines()]", output: "['line one', 'line two']" },
    },
  ],

  when: {
    use: [
      'Wrapping many texts with the same options (wrap and fill build a new TextWrapper on every call)',
      'Options that change between calls — assign the attribute',
      'Subclassing to change how text is split (see TextWrapper class attributes)',
    ],
    avoid: [
      'A single call → textwrap.wrap / textwrap.fill take the same keyword arguments',
      'One-line truncation → textwrap.shorten',
    ],
  },

  notes: {
    cpython:      'Lib/textwrap.py: wrap(text) = _split_chunks (expand tabs, replace whitespace, split with wordsep_re) → optional _fix_sentence_endings → _wrap_chunks; fill(text) is "\\n".join(self.wrap(text))',
    'Validation': "Only at wrap time: width <= 0 → ValueError('invalid width 0 (must be > 0)'), a placeholder that does not fit → ValueError('placeholder too large for max width')",
    'Edge case':  "An indent longer than width can make CPython 3.13 loop forever: TextWrapper(width=1, initial_indent='XX').wrap(' a') never returns",
    'Overridable': '_munge_whitespace, _split, _fix_sentence_endings, _handle_long_word and _wrap_chunks are documented in the source as hooks for subclasses',
  },

  related: [
    { name: 'TextWrapper class attributes', slug: 'textwrapper-attributes', when: 'The regexes that split text into chunks' },
    { name: 'textwrap.wrap',    slug: 'wrap',    when: 'One call, list of lines' },
    { name: 'textwrap.fill',    slug: 'fill',    when: 'One call, one string' },
    { name: 'textwrap.shorten', slug: 'shorten', when: 'TextWrapper with max_lines=1 on collapsed text' },
    { name: 'str.expandtabs()', slug: 'str-expandtabs', when: 'What expand_tabs and tabsize do', category: 'functions' },
  ],

  faq: [
    {
      q: 'When should I use TextWrapper instead of textwrap.wrap?',
      a: 'When you wrap many strings with the same options, or change options between calls. wrap() and fill() create a new TextWrapper for every call; an instance you keep avoids that and holds the settings in one place.',
    },
    {
      q: 'What does drop_whitespace do in TextWrapper?',
      a: "With the default True, spaces at the start and end of each line are removed after wrapping (a paragraph's leading whitespace is kept when text follows it). With False they stay, so lines can start or end with spaces.",
    },
    {
      q: 'How do I limit wrapped text to a number of lines?',
      a: "Set max_lines (and optionally placeholder): TextWrapper(width=40, max_lines=3, placeholder=' …').fill(text). The last kept line ends with the placeholder; if it does not fit there, words are dropped from that line first.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.TextWrapper',
    meta:  'textwrap.TextWrapper',
  },
};
