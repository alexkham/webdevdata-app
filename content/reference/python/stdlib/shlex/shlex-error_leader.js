// content/reference/python/stdlib/shlex/shlex-error_leader.js — shlex.error_leader

export const meta = {
  slug:        'shlex-error_leader',
  name:        'shlex.error_leader',
  signature:   'shlex.error_leader(infile=None, lineno=None)',
  blurb:       'Build a compiler-style message prefix, "file", line N: , from the lexer\'s current infile and lineno — for error messages editors and tools can parse.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'shlex.error_leader python shlex error message file name line number lineno infile parse error location emacs compiler style message "file", line',
};

export const method = {
  slug:      'shlex-error_leader',
  name:      'shlex.error_leader',
  signature: 'shlex.error_leader(infile=None, lineno=None)',
  returns:   { type: 'str', desc: '\'"%s", line %d: \' % (infile, lineno) — with the lexer\'s own values for the arguments left as None.' },

  category:    'shlex method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'A one-line helper: it formats the current file name and line number in the "file", line N: style of Unix C compilers. lineno counts the newlines read so far plus one — and because the lexer reads one character past a token, it may already point at the next line.',

  covers: ['shlex.error_leader'],

  cheat: {
    commonCall: "raise ValueError(lex.error_leader() + f'unexpected {tok!r}')",
    returns:    '\'"config.txt", line 2: unexpected ...\'',
    replaces:   'formatting file:line prefixes by hand',
    watchOut:   'infile is None unless you pass it (prints "None")',
  },

  parameters: [
    { name: 'infile', type: 'str | None', required: false, default: 'None', desc: 'File name to show; None uses lex.infile (itself None unless set).' },
    { name: 'lineno', type: 'int | None', required: false, default: 'None', desc: 'Line number to show; None uses lex.lineno. Formatted with %d, so it must be a number.' },
  ],

  modes: [
    {
      id: 'leader',
      label: 'error message',
      blurb: 'Tokenize until a bad token, then build the message. Type | for a line break.',
      params: [
        { name: 'text', type: 'str', hint: 'config text, | = newline', input: 'text' },
        { name: 'bad',  type: 'str', hint: 'the token to complain about', input: 'text' },
      ],
      template: "import shlex\nlex = shlex.shlex({$text}.replace('|', '\\n'), infile='config.txt', posix=True)\nfor tok in lex:\n    if tok == {$bad}:\n        break\nlex.error_leader() + f'unexpected {tok!r}'",
      cases: [
        { id: 'mid',  label: 'space after it',    values: { text: 'x = 1|y = oops 2|z = 3', bad: 'oops' } },
        { id: 'end',  label: 'newline after it',  values: { text: 'x = 1|y = oops|z = 3', bad: 'oops' } },
        { id: 'none', label: 'not found',         values: { text: 'x = 1', bad: 'oops' } },
      ],
    },
    {
      id: 'lineno',
      label: 'lineno per token',
      blurb: 'The value of lex.lineno right after each token was read. Type | for a line break.',
      params: [{ name: 'text', type: 'str', hint: 'text, | = newline', input: 'text' }],
      template: "import shlex\nlex = shlex.shlex({$text}.replace('|', '\\n'), posix=True)\n[(tok, lex.lineno) for tok in lex]",
      cases: [
        { id: 'lines',   label: 'a b|c d||e',  values: { text: 'a b|c d||e' } },
        { id: 'comment', label: 'comment',     values: { text: 'a # note|b' } },
      ],
    },
    {
      id: 'explicit',
      label: 'explicit arguments',
      blurb: 'Pass your own file name and line.',
      params: [
        { name: 'name', type: 'str', hint: 'infile', input: 'text' },
        { name: 'line', type: 'int', hint: 'lineno', input: 'number' },
      ],
      template: "import shlex\nshlex.shlex('').error_leader({$name}, {$line})",
      cases: [
        { id: 'conf', label: 'x.conf, 7', values: { name: 'x.conf', line: '7' } },
      ],
    },
  ],
  demoExplainer: "A token is finished only when the lexer reads the character after it. If that character is the newline, lineno has already moved on: oops followed by a space is reported on line 2, oops at the end of line 2 on line 3. The same shows in the lineno tab, where b is reported with 2 and the comment line counts as read once the comment is skipped. When the bad token never appears, the loop runs to the end and tok is simply the last token.",

  patterns: [
    {
      name: 'A parse error with location',
      desc: 'Raise with the leader as prefix; editors can jump to "file", line N.',
      code: "def expect(lex, wanted):\n    tok = lex.get_token()\n    if tok != wanted:\n        raise SyntaxError(lex.error_leader() + f'expected {wanted!r}, got {tok!r}')",
    },
    {
      name: 'Report shlex errors with their location',
      desc: 'ValueError from the lexer has no position; add one.',
      code: "import shlex\nlex = shlex.shlex(f, infile=path, posix=True)\ntry:\n    tokens = list(lex)\nexcept ValueError as e:\n    raise SystemExit(lex.error_leader() + str(e))",
    },
  ],

  examples: [
    { title: 'Defaults: no file name', code: "import shlex\nshlex.shlex('a').error_leader()", returns: '\'"None", line 1: \'' },
    { title: 'With infile',            code: "import shlex\nshlex.shlex('a', infile='cfg.txt').error_leader()", returns: '\'"cfg.txt", line 1: \'' },
    { title: 'Explicit arguments',     code: "import shlex\nshlex.shlex('a').error_leader('x.conf', 7)", returns: '\'"x.conf", line 7: \'' },
    { title: 'lineno after each token', code: "import shlex\nlex = shlex.shlex('a b\\nc d\\n\\ne', posix=True)\n[(t, lex.lineno) for t in lex]", returns: "[('a', 1), ('b', 2), ('c', 2), ('d', 3), ('e', 4)]" },
    { title: 'Locate an unclosed quote', code: "import shlex\nlex = shlex.shlex('a \"b c', infile='cmd.txt', posix=True)\ntry:\n    list(lex)\nexcept ValueError as e:\n    msg = lex.error_leader() + str(e)\nmsg", returns: '\'"cmd.txt", line 1: No closing quotation\'' },
  ],

  pitfalls: [
    {
      name: 'Forgetting infile',
      desc: 'Without a name the leader literally says "None". Pass infile when you create the lexer.',
      wrong: { label: 'no infile', code: "import shlex\nshlex.shlex('a').error_leader()", output: '\'"None", line 1: \'' },
      fix:   { label: 'infile=', code: "import shlex\nshlex.shlex('a', infile='cmd.txt').error_leader()", output: '\'"cmd.txt", line 1: \'' },
    },
    {
      name: 'A line number as a string',
      desc: 'The format is %d, so lineno must be a number.',
      wrong: { label: "'3'", code: "import shlex\nshlex.shlex('a').error_leader('f', '3')", output: 'TypeError: %d format: a real number is required, not str' },
      fix:   { label: 'int', code: "import shlex\nshlex.shlex('a').error_leader('f', int('3'))", output: '\'"f", line 3: \'' },
    },
  ],

  when: {
    use: [
      'Error and warning messages from a shlex-based parser',
      'Messages that IDEs, Emacs or grep-style tools should recognise as file positions',
    ],
    avoid: [
      'Exact column positions — shlex tracks lines only',
    ],
  },

  notes: {
    cpython:     "def error_leader(self, infile=None, lineno=None): ... return '\"%s\", line %d: ' % (infile, lineno)",
    'lineno':    'Incremented when the lexer reads a newline character and once more when it skips a comment (the comment\'s newline is consumed by readline). It starts at 1 and is reset to 1 for a pushed source',
    'Sources':   'While an included file is read, infile and lineno refer to it; they are restored when the lexer returns to the outer input',
  },

  related: [
    { name: 'shlex attributes', slug: 'shlex-attributes', when: 'infile, lineno and the other attributes' },
    { name: 'get_token / push_token / read_token', slug: 'shlex-get_token', when: 'Reading tokens' },
    { name: 'push_source / pop_source / sourcehook', slug: 'shlex-push_source', when: 'How infile changes for includes' },
    { name: 'SyntaxError', slug: 'syntaxerror', when: 'A natural exception for parse errors', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I get the line number of a token with shlex?',
      a: 'Read lex.lineno right after get_token(). It counts the newlines read so far plus one, so when the token was ended by a newline it already shows the next line. For exact positions, keep track of the line yourself before reading, or use a tokenizer that reports positions.',
    },
    {
      q: 'What format does error_leader produce?',
      a: '"file", line N:  followed by a space — the format of Unix C compilers, which Emacs and many tools parse. For example \'"config.txt", line 2: \'.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.shlex.error_leader',
    meta:  'shlex.error_leader',
  },
};
