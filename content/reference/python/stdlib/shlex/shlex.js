// content/reference/python/stdlib/shlex/shlex.js — shlex.shlex

export const meta = {
  slug:        'shlex',
  name:        'shlex.shlex',
  signature:   'shlex.shlex(instream=None, infile=None, posix=False, punctuation_chars=False)',
  blurb:       'The configurable lexer behind shlex.split: iterate it to get tokens from a string or file, with your own word characters, quotes, comments and escapes.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions (punctuation_chars 3.6+)',
  searchTerms: 'shlex.shlex class python lexer tokenizer shell like syntax tokenize string posix mode compatibility mode whitespace_split iterate tokens instream infile mini language parser config file',
};

export const method = {
  slug:      'shlex',
  name:      'shlex.shlex',
  signature: 'shlex.shlex(instream=None, infile=None, posix=False, punctuation_chars=False)',
  returns:   { type: 'shlex', desc: 'A lexer object: an iterator over tokens, with get_token() and friends and public attributes that control the rules.' },

  category:    'shlex class',
  version:     'All Python 3 versions (punctuation_chars 3.6+)',
  hasLiveDemo: true,

  subtitle: "Careful with the defaults: unlike shlex.split, a fresh shlex is in compatibility mode (posix=False), splits at every non-word character, and treats # as a comment. Set posix=True and whitespace_split=True to get split()'s behaviour.",

  covers: ['shlex'],

  cheat: {
    commonCall: "lex = shlex.shlex(text, posix=True)\nlex.whitespace_split = True\nlist(lex)",
    returns:    'a list of tokens (iteration stops at lex.eof)',
    replaces:   'hand-written tokenizers for shell-like syntaxes',
    watchOut:   'posix=False and whitespace_split=False by default',
  },

  parameters: [
    { name: 'instream',          type: 'str | file-like | None', required: false, default: 'None',  desc: 'Text to tokenize: a str (wrapped in io.StringIO) or any object with read() and readline(). None reads sys.stdin.' },
    { name: 'infile',            type: 'str | None',  required: false, default: 'None',  desc: 'A file name for error messages (the infile attribute, used by error_leader and sourcehook).' },
    { name: 'posix',             type: 'bool',        required: false, default: 'False', desc: 'POSIX mode: quotes are removed, escapes work, eof is None. Compatibility mode keeps quotes and ignores escapes, eof is "".' },
    { name: 'punctuation_chars', type: 'bool | str',  required: false, default: 'False', desc: "True or a string: runs of these characters (True means ();<>|&) become their own tokens, and ~-./*?= join the word characters (3.6+)." },
  ],

  modes: [
    {
      id: 'compat',
      label: 'default (posix=False)',
      blurb: 'A fresh lexer: compatibility mode, # comments, non-word characters as single tokens.',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: 'import shlex\nlist(shlex.shlex({$text}))',
      cases: [
        { id: 'ls',     label: 'ls -l /tmp',       values: { text: 'ls -l /tmp' } },
        { id: 'quotes', label: 'quotes kept',      values: { text: 'say "hi there" now' } },
        { id: 'assign', label: 'x = 1 # comment',  values: { text: 'x = 1 # set x' } },
        { id: 'glued',  label: 'Do"Not"Separate',  values: { text: 'Do"Not"Separate "Do"Separate' } },
      ],
    },
    {
      id: 'posix',
      label: 'posix=True',
      blurb: 'POSIX mode: quotes removed, backslash escapes, Latin-1 letters are word characters.',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: 'import shlex\nlist(shlex.shlex({$text}, posix=True))',
      cases: [
        { id: 'glued',  label: 'Do"Not"Separate', values: { text: 'Do"Not"Separate "Do"Separate' } },
        { id: 'escape', label: 'escaped space',   values: { text: 'a\\ b c' } },
        { id: 'latin',  label: 'café + 中文',      values: { text: 'café 中文' } },
        { id: 'ls',     label: 'ls -l /tmp',      values: { text: 'ls -l /tmp' } },
      ],
    },
    {
      id: 'wsplit',
      label: '+ whitespace_split',
      blurb: 'posix=True and whitespace_split=True: shell-like words (# comments still on).',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace_split = True\nlist(lex)',
      cases: [
        { id: 'cp',      label: 'cp -r src/ dst/',  values: { text: 'cp -r src/ dst/  # copy' } },
        { id: 'quoted',  label: 'quoted path',      values: { text: 'open "C:/My Files/a.txt"' } },
      ],
    },
  ],
  demoExplainer: "- and / are not word characters, so each comes back as a single-character token and ls -l /tmp becomes five tokens (in both modes). In compatibility mode quotes stay in the token, and a quote inside a word does not split it (Do\"Not\"Separate) while a closing quote does (\"Do\" then Separate). POSIX mode removes the quotes (DoNotSeparate) and adds the Latin-1 letters such as é to the word characters — but 中文 are still not word characters, so each comes back as a single-character token. whitespace_split=True ends the character-class splitting; the # comment is still removed because commenters defaults to '#'.",

  patterns: [
    {
      name: 'split() with comments, step by step',
      desc: 'What shlex.split(s, comments=True) does internally.',
      code: "import shlex\nlex = shlex.shlex(s, posix=True)\nlex.whitespace_split = True\ntokens = list(lex)",
    },
    {
      name: 'Tokenize a file',
      desc: 'Pass the open file and its name; error messages can then point at the line.',
      code: "import shlex\nwith open('commands.txt', encoding='utf-8') as f:\n    lex = shlex.shlex(f, infile='commands.txt', posix=True)\n    for token in lex:\n        handle(token)",
    },
    {
      name: 'Key = value tokens',
      desc: 'Default (non-whitespace_split) mode returns = and other punctuation as separate tokens.',
      code: "import shlex\ntokens = list(shlex.shlex('name = \"Ada Lovelace\"  # who', posix=True))",
    },
  ],

  examples: [
    { title: 'Default mode splits at punctuation', code: "import shlex\nlist(shlex.shlex('ls -l /tmp'))", returns: "['ls', '-', 'l', '/', 'tmp']" },
    { title: 'Quotes kept vs removed', code: "import shlex\nlist(shlex.shlex('a \"b c\" d')), list(shlex.shlex('a \"b c\" d', posix=True))", returns: "(['a', '\"b c\"', 'd'], ['a', 'b c', 'd'])" },
    { title: '# comments are on by default', code: "import shlex\nlist(shlex.shlex('x = 1 # set x'))", returns: "['x', '=', '1']" },
    { title: 'eof differs by mode', code: "import shlex\nshlex.shlex('').eof, shlex.shlex('', posix=True).eof", returns: "('', None)" },
    { title: 'get_token after the end', code: "import shlex\nlex = shlex.shlex('a b', posix=True)\nlex.get_token(), lex.get_token(), lex.get_token()", returns: "('a', 'b', None)" },
    { title: 'Any file-like object', code: "import io, shlex\nlex = shlex.shlex(io.StringIO('a b'), 'f.txt')\nlex.infile, list(lex)", returns: "('f.txt', ['a', 'b'])" },
    { title: 'An unclosed quote', code: "import shlex\nlist(shlex.shlex('a \"b c', posix=True))", returns: 'ValueError: No closing quotation' },
  ],

  pitfalls: [
    {
      name: 'Forgetting posix=True',
      desc: 'The class defaults to compatibility mode, which keeps the quote characters in the tokens.',
      wrong: { label: 'default', code: "import shlex\nlist(shlex.shlex('say \"hi there\"'))", output: "['say', '\"hi there\"']" },
      fix:   { label: 'posix=True', code: "import shlex\nlist(shlex.shlex('say \"hi there\"', posix=True))", output: "['say', 'hi there']" },
    },
    {
      name: 'Options and paths cut into pieces',
      desc: 'Without whitespace_split, every character outside wordchars is a token of its own.',
      wrong: { label: 'whitespace_split=False', code: "import shlex\nlist(shlex.shlex('cp -r src/ dst/', posix=True))", output: "['cp', '-', 'r', 'src', '/', 'dst', '/']" },
      fix:   { label: 'whitespace_split=True', code: "import shlex\nlex = shlex.shlex('cp -r src/ dst/', posix=True)\nlex.whitespace_split = True\nlist(lex)", output: "['cp', '-r', 'src/', 'dst/']" },
    },
  ],

  when: {
    use: [
      'Small command or configuration languages with shell-like quoting',
      'Token streams where you need lookahead (push_token), line numbers or include files',
      'Splitting with custom quotes, comment characters or separators',
    ],
    avoid: [
      'Plain command-line splitting → shlex.split',
      'Programming-language tokenizing → tokenize module or a parser generator',
      'CSV and similar formats → csv',
    ],
  },

  notes: {
    cpython:        'Lib/shlex.py: a hand-written state machine in read_token (states " " whitespace, "a" word, "c" punctuation, a quote character, an escape character); get_token adds the pushback stack, source inclusion and EOF handling',
    'Iteration':    'The object is its own iterator: __next__ calls get_token and stops when the token equals eof',
    'Not a parser': 'No grammar, no expansion, no semantic checks — the docs point out that with punctuation_chars even >>> comes back as one token',
  },

  related: [
    { name: 'shlex.split',           slug: 'split',                   when: 'The one-call version' },
    { name: 'get_token / push_token / read_token', slug: 'shlex-get_token', when: 'Read tokens by hand' },
    { name: 'punctuation_chars',     slug: 'shlex-punctuation_chars', when: 'Shell operators as tokens' },
    { name: 'shlex attributes',      slug: 'shlex-attributes',        when: 'commenters, wordchars, quotes, escape …' },
    { name: 'error_leader',          slug: 'shlex-error_leader',      when: 'File/line prefixes for messages' },
    { name: 'push_source / pop_source / sourcehook', slug: 'shlex-push_source', when: 'Include other input' },
  ],

  faq: [
    {
      q: 'What is the difference between shlex.shlex and shlex.split?',
      a: 'split is a convenience wrapper: it creates shlex(s, posix=True), sets whitespace_split=True, disables comments unless comments=True, and returns list(lexer). Use the class when you need other rules, line numbers, lookahead or include files.',
    },
    {
      q: 'What does posix=True change in shlex?',
      a: 'POSIX mode removes quotes from tokens, lets a quote in the middle of a word continue the word, honours backslash escapes (in double quotes only before " and \\), allows empty quoted tokens, adds the Latin-1 letters to wordchars, and returns None instead of "" at the end of input.',
    },
    {
      q: 'Why does shlex split "-l" into two tokens?',
      a: "Because '-' is not in the default wordchars. Set whitespace_split = True, add the characters to wordchars (lex.wordchars += '-./'), or pass punctuation_chars=True, which adds ~-./*?= to wordchars.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.shlex',
    meta:  'shlex.shlex',
  },
};
