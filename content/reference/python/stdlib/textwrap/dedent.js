// content/reference/python/stdlib/textwrap/dedent.js

export const meta = {
  slug:        'dedent',
  name:        'textwrap.dedent',
  signature:   'textwrap.dedent(text)',
  blurb:       'Remove the leading whitespace that every line has in common — the indentation a triple-quoted string inherits from the code around it.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'textwrap dedent python remove common leading whitespace remove indentation from multiline string triple quoted string indentation strip indent docstring heredoc unindent',
};

export const method = {
  slug:      'dedent',
  name:      'textwrap.dedent',
  signature: 'textwrap.dedent(text)',
  returns:   { type: 'str', desc: 'The text with the common indentation removed and lines of only spaces and tabs emptied (3.14+: any whitespace-only line).' },

  category:    'textwrap function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Write a multi-line string indented along with your code and let dedent strip what all its lines share. Tabs and spaces are both whitespace but never equal, and one line at column 0 means nothing is removed.',

  covers: ['dedent'],

  cheat: {
    commonCall: "textwrap.dedent('''\\\n    line one\n      line two\n''')",
    returns:    "'line one\\n  line two\\n'",
    replaces:   'strings glued to the left margin of the source file',
    watchOut:   "start with '''\\ — a first line right after the quotes has no indentation",
  },

  parameters: [
    { name: 'text', type: 'str', required: true, default: null, desc: 'Lines separated by \\n. The common prefix of spaces and tabs is removed from each line; lines of only spaces and tabs become empty.' },
  ],

  modes: [
    {
      id: 'dedent',
      label: 'dedent',
      blurb: 'Type | for each line break. Only the whitespace all non-blank lines share is removed.',
      params: [{ name: 'text', type: 'str', hint: 'lines separated by |', input: 'text' }],
      template: "import textwrap\ntextwrap.dedent({$text}.replace('|', '\\n'))",
      cases: [
        { id: 'code',   label: 'indented code',  values: { text: '    def f():|        return 1' } },
        { id: 'uneven', label: 'deeper lines',   values: { text: '  a|    b|  c' } },
        { id: 'blank',  label: 'blank line',     values: { text: '    a|  |    b' } },
        { id: 'zero',   label: 'a line at col 0', values: { text: 'Usage: app|    -h  show help' } },
      ],
    },
    {
      id: 'reindent',
      label: 'dedent + indent',
      blurb: 'Replace the indentation: remove the common part, then add your own prefix.',
      params: [
        { name: 'text',   type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'prefix', type: 'str', hint: 'new indentation', input: 'text' },
      ],
      template: "import textwrap\ntextwrap.indent(textwrap.dedent({$text}.replace('|', '\\n')), {$prefix})",
      cases: [
        { id: 'code',  label: '8 → 2 spaces', values: { text: '        x = 1|        if x:|            y = 2', prefix: '  ' } },
        { id: 'quote', label: 'quote it',      values: { text: '   first|   second', prefix: '> ' } },
      ],
    },
  ],
  demoExplainer: "The margin is the longest run of spaces and tabs at the start of every line that has other characters, so '  a', '    b', '  c' lose two spaces each and b keeps its extra two. The blank line in '    a|  |    b' is emptied and ignored for the margin. When one line starts at column 0 the margin is empty and the text comes back unchanged.",

  patterns: [
    {
      name: 'Readable multi-line strings in code',
      desc: "The backslash after ''' keeps the string from starting with an empty line.",
      code: "import textwrap\n\ndef usage():\n    return textwrap.dedent('''\\\n        Usage: app [options]\n          -h  show this help\n        ''')",
    },
    {
      name: 'SQL or templates in a function',
      desc: 'dedent + strip removes both the indentation and the surrounding newlines.',
      code: "import textwrap\nQUERY = textwrap.dedent('''\n    SELECT id, name\n    FROM users\n    WHERE active\n''').strip()",
    },
    {
      name: 'Re-indent a block',
      desc: 'Normalize with dedent, then add the indentation you need.',
      code: "import textwrap\nnested = textwrap.indent(textwrap.dedent(block), ' ' * 8)",
    },
  ],

  examples: [
    { title: 'A help text written in a function', code: "import textwrap\ndef usage():\n    return textwrap.dedent('''\\\n        Usage: app [options]\n          -h  show help\n        ''')\nusage()", returns: "'Usage: app [options]\\n  -h  show help\\n'" },
    { title: 'Relative indentation is kept', code: "import textwrap\ntextwrap.dedent('  a\\n    b\\n  c')", returns: "'a\\n  b\\nc'" },
    { title: 'Whitespace-only lines are emptied', code: "import textwrap\ntextwrap.dedent('    a\\n  \\n    b')", returns: "'a\\n\\nb'" },
    { title: 'A leading newline stays', code: "import textwrap\ntextwrap.dedent('''\n    hello\n      world\n    ''')", returns: "'\\nhello\\n  world\\n'" },
    { title: 'Tabs and spaces never match', code: "import textwrap\ntextwrap.dedent('  hello\\n\\tworld')", returns: "'  hello\\n\\tworld'" },
    { title: 'Common tabs are removed', code: "import textwrap\ntextwrap.dedent('\\t\\tx\\n\\ty')", returns: "'\\tx\\ny'" },
    { title: 'Windows line endings survive', code: "import textwrap\ntextwrap.dedent('    x\\r\\n    y')", returns: "'x\\r\\ny'" },
  ],

  pitfalls: [
    {
      name: 'Text that starts right after the opening quotes',
      desc: "The first line has no indentation in the source, so the common margin is empty and nothing is removed. Put a backslash after ''' and start the text on the next line.",
      wrong: { label: "'''Usage", code: "import textwrap\ndef usage():\n    return textwrap.dedent('''Usage: app\n        -h  show help\n        ''')\nusage()", output: "'Usage: app\\n        -h  show help\\n'" },
      fix:   { label: "'''\\", code: "import textwrap\ndef usage():\n    return textwrap.dedent('''\\\n        Usage: app\n          -h  show help\n        ''')\nusage()", output: "'Usage: app\\n  -h  show help\\n'" },
    },
    {
      name: 'Mixing tabs and spaces',
      desc: 'A tab is not "four spaces" to dedent: one line indented with spaces and one with a tab share no margin. Expand the tabs first.',
      wrong: { label: 'mixed', code: "import textwrap\ntextwrap.dedent('    a\\n\\tb')", output: "'    a\\n\\tb'" },
      fix:   { label: 'expandtabs(4)', code: "import textwrap\ntextwrap.dedent('    a\\n\\tb'.expandtabs(4))", output: "'a\\nb'" },
    },
    {
      name: 'A blank-looking line with a no-break space (3.13)',
      desc: 'In Python 3.13 only lines of spaces and tabs count as blank. A line containing U+00A0 counts as text, and its single leading space becomes the margin. Python 3.14 treats any whitespace-only line as blank.',
      wrong: { label: 'U+00A0 line', code: "import textwrap\ntextwrap.dedent('    a\\n \\xa0\\n    b')", output: "'   a\\n\\xa0\\n   b'" },
      fix:   { label: 'empty them first', code: "import textwrap\ntext = '    a\\n \\xa0\\n    b'\ntextwrap.dedent('\\n'.join(line if line.strip() else '' for line in text.split('\\n')))", output: "'a\\n\\nb'" },
    },
  ],

  when: {
    use: [
      'Multi-line strings (help texts, SQL, templates, test fixtures) written indented inside functions',
      'Normalizing indented blocks before re-indenting them with textwrap.indent',
    ],
    avoid: [
      'Docstrings → Python 3.13 already strips their common indentation at compile time; use inspect.cleandoc for other strings with that rule',
      'Removing all leading whitespace → [line.lstrip() for line in text.splitlines()]',
    ],
  },

  notes: {
    cpython:      "Lib/textwrap.py (3.13): blank out lines matching '^[ \\t]+$', find each line's leading '[ \\t]*' with a regex, take the longest common prefix, remove it with re.sub",
    'Lines':      'Only \\n separates lines for dedent; \\r stays part of the line (so \\r\\n files work)',
    'Python 3.14': 'Lines containing only whitespace of any kind are normalized to empty lines too, not just lines of spaces and tabs (docs: "Changed in version 3.14")',
  },

  related: [
    { name: 'textwrap.indent', slug: 'indent',  when: 'The opposite: add a prefix to lines' },
    { name: 'textwrap.fill',   slug: 'fill',    when: 'Re-flow the dedented text' },
    { name: 'str.expandtabs()', slug: 'str-expandtabs', when: 'Turn tabs into spaces before dedenting', category: 'functions' },
    { name: 'str.strip()',      slug: 'strip',  when: 'Drop the leading and trailing newline too', category: 'functions' },
    { name: 'textwrap module',  slug: 'textwrap', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I remove the indentation from a multi-line string in Python?',
      a: "textwrap.dedent(s) removes the whitespace every line has in common and keeps relative indentation. Write the literal as '''\\ followed by the indented lines so the first line is indented like the rest.",
    },
    {
      q: 'Why does textwrap.dedent not remove anything?',
      a: 'Some line with text has no indentation (often the first line, right after the opening quotes), or the lines are indented with different characters — tabs on some, spaces on others. dedent only removes an identical prefix.',
    },
    {
      q: 'What is the difference between textwrap.dedent and inspect.cleandoc?',
      a: "cleandoc is the docstring rule: it ignores the first line when computing the margin, expands tabs, and strips leading and trailing blank lines. dedent treats all lines alike and keeps blank lines at the ends.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/textwrap.html#textwrap.dedent',
    meta:  'textwrap.dedent',
  },
};
