// content/reference/python/stdlib/textwrap/indent.js

export const meta = {
  slug:        'indent',
  name:        'textwrap.indent',
  signature:   'textwrap.indent(text, prefix, predicate=None)',
  blurb:       'Add a prefix to the start of lines — by default every line that is not empty or whitespace only — keeping the original line endings.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'textwrap indent python add prefix to each line indent multiline string quote lines with > comment out lines prefix every line predicate blank lines',
};

export const method = {
  slug:      'indent',
  name:      'textwrap.indent',
  signature: 'textwrap.indent(text, prefix, predicate=None)',
  returns:   { type: 'str', desc: 'The text with prefix inserted before each selected line; nothing else changes.' },

  category:    'textwrap function',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'The reverse of dedent: prefix lines with spaces, "> " or "# ". Blank and whitespace-only lines are skipped unless you pass a predicate, and \\r\\n endings are kept as they are.',

  covers: ['indent'],

  cheat: {
    commonCall: "textwrap.indent(text, '    ')",
    returns:    "'    line one\\n    line two'",
    replaces:   "'\\n'.join(prefix + line for line in text.split('\\n'))",
    watchOut:   'whitespace-only lines get no prefix unless predicate says so',
  },

  parameters: [
    { name: 'text',      type: 'str', required: true,  default: null,   desc: 'The text; lines are found with text.splitlines(True), so every line ending (\\n, \\r\\n, \\r, \\v, \\f, \\x1c-\\x1e, \\x85, \\u2028, \\u2029) counts.' },
    { name: 'prefix',    type: 'str', required: true,  default: null,   desc: 'Inserted at the start of each selected line.' },
    { name: 'predicate', type: 'callable | None', required: false, default: 'None', desc: 'Called with each line (ending included); a true result adds the prefix. None means: lines that are not whitespace only.' },
  ],

  modes: [
    {
      id: 'indent',
      label: 'indent',
      blurb: 'Type | for each line break. Empty and whitespace-only lines keep no prefix.',
      params: [
        { name: 'text',   type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'prefix', type: 'str', hint: 'prefix to add', input: 'text' },
      ],
      template: "import textwrap\ntextwrap.indent({$text}.replace('|', '\\n'), {$prefix})",
      cases: [
        { id: 'code',  label: 'indent code', values: { text: 'def f():|    return 1', prefix: '    ' } },
        { id: 'quote', label: 'quote',       values: { text: 'Hi Ada,||thanks!', prefix: '> ' } },
        { id: 'blank', label: 'blank lines', values: { text: 'hello|| |world', prefix: '  ' } },
      ],
    },
    {
      id: 'all',
      label: 'every line',
      blurb: 'predicate=lambda line: True prefixes every line, blank ones included.',
      params: [
        { name: 'text',   type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'prefix', type: 'str', hint: 'prefix to add', input: 'text' },
      ],
      template: "import textwrap\ntextwrap.indent({$text}.replace('|', '\\n'), {$prefix}, lambda line: True)",
      cases: [
        { id: 'quote',   label: 'quote',       values: { text: 'Hi Ada,||thanks!', prefix: '> ' } },
        { id: 'comment', label: 'comment out', values: { text: 'x = 1||y = 2', prefix: '# ' } },
      ],
    },
  ],
  demoExplainer: "With the default predicate the empty line between 'Hi Ada,' and 'thanks!' stays empty, and in 'hello|| |world' the line holding a single space is left alone too. A trailing | gives a final empty line, which never gets a prefix: splitlines(True) does not produce an empty last line. With lambda line: True every line that exists is prefixed, so the e-mail quote gets a '> ' line in the middle.",

  patterns: [
    {
      name: 'Quote a message for a reply',
      desc: 'Prefix every line, blank ones included.',
      code: "import textwrap\nquoted = textwrap.indent(original, '> ', lambda line: True)",
    },
    {
      name: 'Nest generated code',
      desc: 'Indent a block one level deeper.',
      code: "import textwrap\nsource = 'def wrapper():\\n' + textwrap.indent(body, '    ')",
    },
    {
      name: 'Comment out a block',
      desc: 'Prefix only non-blank lines (the default) to keep blank lines clean.',
      code: "import textwrap\ncommented = textwrap.indent(block, '# ')",
    },
  ],

  examples: [
    { title: 'Blank lines are skipped',     code: "import textwrap\ntextwrap.indent('hello\\n\\n \\nworld', '  ')", returns: "'  hello\\n\\n \\n  world'" },
    { title: 'Every line with a predicate', code: "import textwrap\nprint(textwrap.indent('hello\\n\\n \\nworld', '+ ', lambda line: True))", returns: '+ hello\n+ \n+  \n+ world' },
    { title: 'Line endings are kept',       code: "import textwrap\ntextwrap.indent('a\\r\\nb\\rc', '> ')", returns: "'> a\\r\\n> b\\r> c'" },
    { title: 'Indent a code block',         code: "import textwrap\ntextwrap.indent('def f():\\n    return 1', '    ')", returns: "'    def f():\\n        return 1'" },
    { title: 'Only selected lines',         code: "import textwrap\ntextwrap.indent('x = 1\\ny = 2', '>>> ', lambda line: line.startswith('x'))", returns: "'>>> x = 1\\ny = 2'" },
    { title: 'Empty text, empty result',    code: "import textwrap\ntextwrap.indent('', '> '), textwrap.indent('\\n', '> ')", returns: "('', '\\n')" },
  ],

  pitfalls: [
    {
      name: 'Prefixing with split and join',
      desc: "A loop over text.split('\\n') prefixes blank lines too, leaving trailing spaces. indent skips whitespace-only lines and keeps every line ending as it was.",
      wrong: { label: 'split/join', code: "'\\n'.join('> ' + line for line in 'a\\n\\nb'.split('\\n'))", output: "'> a\\n> \\n> b'" },
      fix:   { label: 'indent', code: "import textwrap\ntextwrap.indent('a\\n\\nb', '> ')", output: "'> a\\n\\n> b'" },
    },
    {
      name: 'Expecting a prefix on blank lines',
      desc: 'For e-mail quoting every line needs the marker. The default skips blank lines; pass a predicate that is always true.',
      wrong: { label: 'default', code: "import textwrap\ntextwrap.indent('a\\n\\nb', '> ')", output: "'> a\\n\\n> b'" },
      fix:   { label: 'lambda line: True', code: "import textwrap\ntextwrap.indent('a\\n\\nb', '> ', lambda line: True)", output: "'> a\\n> \\n> b'" },
    },
    {
      name: 'Using indent to change indentation',
      desc: 'indent only adds. To replace existing indentation, dedent first.',
      wrong: { label: 'indent only', code: "import textwrap\ntextwrap.indent('    x', '  ')", output: "'      x'" },
      fix:   { label: 'dedent, then indent', code: "import textwrap\ntextwrap.indent(textwrap.dedent('    x'), '  ')", output: "'  x'" },
    },
  ],

  when: {
    use: [
      'Indenting generated code, nested output or log blocks',
      'Quoting text with "> " or commenting it out with "# "',
    ],
    avoid: [
      'Wrapping text with an indent → textwrap.fill(initial_indent=..., subsequent_indent=...)',
      'Removing indentation → textwrap.dedent',
    ],
  },

  notes: {
    cpython:     'Lib/textwrap.py: for line in text.splitlines(True): if predicate(line): add prefix — the default predicate is lambda s: not s.isspace()',
    'Line ends': 'The line passed to predicate still has its line ending, so a test like line.strip() or line.isspace() is the reliable way to check for blank lines',
  },

  related: [
    { name: 'textwrap.dedent',  slug: 'dedent', when: 'Remove indentation' },
    { name: 'textwrap.fill',    slug: 'fill',   when: 'Wrap with initial and subsequent indents' },
    { name: 'str.splitlines()', slug: 'str-splitlines', when: 'The line splitting indent uses', category: 'functions' },
    { name: 'str.isspace()',    slug: 'str-isspace', when: 'The default test for blank lines', category: 'functions' },
    { name: 'textwrap module',  slug: 'textwrap', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I add a prefix to every line of a string in Python?',
      a: "textwrap.indent(text, '> ') prefixes every line that is not empty or whitespace only. To include those lines as well, pass lambda line: True as the predicate.",
    },
    {
      q: 'Why does textwrap.indent skip empty lines?',
      a: 'The default predicate is "not line.isspace()", so lines made only of whitespace (including the bare newline of an empty line) are left alone — that avoids trailing whitespace. Pass your own predicate to change it.',
    },
    {
      q: 'Does textwrap.indent work with Windows line endings?',
      a: "Yes. It splits with splitlines(True), which recognizes \\r\\n, \\r, \\n and the other Unicode line boundaries and keeps them, so the endings come out exactly as they went in.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.indent',
    meta:  'textwrap.indent',
  },
};
