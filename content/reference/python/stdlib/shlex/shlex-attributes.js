// content/reference/python/stdlib/shlex/shlex-attributes.js — the public instance attributes of a shlex lexer

export const meta = {
  slug:        'shlex-attributes',
  name:        'shlex attributes (commenters, wordchars, whitespace, quotes, escape, …)',
  signature:   'lex.commenters · lex.wordchars · lex.whitespace · lex.whitespace_split · lex.quotes · lex.escape · lex.escapedquotes · lex.infile · lex.instream · lex.source · lex.debug · lex.lineno · lex.token · lex.eof',
  blurb:       'The instance attributes that define a shlex lexer\'s rules — comment, word, whitespace, quote and escape characters — plus its state: infile, instream, source, debug, lineno, token and eof.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'shlex attributes shlex.commenters shlex.wordchars shlex.whitespace shlex.whitespace_split shlex.quotes shlex.escape shlex.escapedquotes shlex.infile shlex.instream shlex.source shlex.debug shlex.lineno shlex.token shlex.eof python customize shlex comment character word characters custom quotes separator',
};

export const method = {
  slug:      'shlex-attributes',
  name:      'shlex attributes (commenters, wordchars, whitespace, quotes, escape, …)',
  signature: 'lex.commenters · lex.wordchars · lex.whitespace · lex.whitespace_split · lex.quotes · lex.escape · lex.escapedquotes · lex.infile · lex.instream · lex.source · lex.debug · lex.lineno · lex.token · lex.eof',
  returns:   { type: 'str | bool | int | None', desc: 'Plain instance attributes, set by __init__ — assign new values before you read tokens.' },

  category:    'shlex attributes',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Every rule of the lexer is a string of characters you can replace: commenters, wordchars, whitespace, quotes, escape, escapedquotes. whitespace_split switches from character classes to whitespace-only splitting. The rest report state — the current file and line, the token buffer, the end-of-input value.',

  covers: [],

  cheat: {
    commonCall: "lex = shlex.shlex(text, posix=True)\nlex.commenters = ';'\nlex.wordchars += '-.'",
    returns:    'the same lexer, now with your rules',
    replaces:   'subclassing just to change character sets',
    watchOut:   'escape and escapedquotes only work in POSIX mode',
  },

  parameters: [],

  attributes: [
    { name: 'commenters',       type: 'str',  meaning: "Characters that start a comment running to the end of the line. Default '#'. shlex.split sets it to '' unless comments=True." },
    { name: 'wordchars',        type: 'str',  meaning: 'Characters that build multi-character tokens: ASCII letters, digits and _ (POSIX mode adds Latin-1 letters such as é; punctuation_chars adds ~-./*?=). No effect when whitespace_split is True.' },
    { name: 'whitespace',       type: 'str',  meaning: "Characters that separate tokens and are skipped. Default ' \\t\\r\\n'." },
    { name: 'whitespace_split', type: 'bool', meaning: 'True: split only at whitespace (and punctuation_chars). Default False — characters outside wordchars become single-character tokens.' },
    { name: 'quotes',           type: 'str',  meaning: 'Quote characters: the ASCII single and double quote by default. A quoted part runs to the same quote again, so the two kinds protect each other.' },
    { name: 'escape',           type: 'str',  meaning: "Escape characters, POSIX mode only. Default '\\\\' (one backslash)." },
    { name: 'escapedquotes',    type: 'str',  meaning: "Quotes inside which escape works (POSIX mode). Default '\"' — inside single quotes a backslash is literal." },
    { name: 'infile',           type: 'str | None', meaning: 'Name of the current input (constructor argument, or the file of an active source request). Used by error_leader and sourcehook.' },
    { name: 'instream',         type: 'file-like',  meaning: 'The stream being read: an io.StringIO for string input.' },
    { name: 'source',           type: 'str | None', meaning: 'None by default. Set to a keyword to enable inclusion: "keyword filename" reads that file in place.' },
    { name: 'debug',            type: 'int',  meaning: '0 by default. 1 or more prints progress lines prefixed "shlex: " (3 shows every character).' },
    { name: 'lineno',           type: 'int',  meaning: 'Starts at 1; the docs call it the count of newlines seen so far plus one. A skipped comment also adds 1, even at the end of input without a newline (after shlex.shlex("a # c", posix=True) is read, lineno is 2).' },
    { name: 'token',            type: 'str',  meaning: 'The token buffer — the partial token when an exception is raised.' },
    { name: 'eof',              type: "str | None", meaning: "End-of-input value: '' in compatibility mode, None in POSIX mode." },
  ],

  modes: [
    {
      id: 'commenters',
      label: 'commenters',
      blurb: 'Choose the comment characters ("" turns comments off).',
      params: [
        { name: 'text',       type: 'str', hint: 'text', input: 'text' },
        { name: 'commenters', type: 'str', hint: 'comment characters', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace_split = True\nlex.commenters = {$commenters}\nlist(lex)',
      cases: [
        { id: 'semi', label: "';' comments", values: { text: 'color #fff ; the default', commenters: ';' } },
        { id: 'off',  label: 'comments off',  values: { text: 'tag #1 done', commenters: '' } },
      ],
    },
    {
      id: 'wordchars',
      label: 'wordchars',
      blurb: 'Add characters that may appear inside words (whitespace_split stays False).',
      params: [
        { name: 'text',  type: 'str', hint: 'text', input: 'text' },
        { name: 'extra', type: 'str', hint: 'characters to add', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.wordchars += {$extra}\nlist(lex)',
      cases: [
        { id: 'eq',      label: 'key=value',    values: { text: 'key=value other=1 # note', extra: '=' } },
        { id: 'version', label: 'v1.2-rc',      values: { text: 'release v1.2-rc now', extra: '.-' } },
        { id: 'none',    label: 'nothing added', values: { text: 'release v1.2-rc now', extra: '' } },
      ],
    },
    {
      id: 'quotes',
      label: 'quotes',
      blurb: 'Choose the quote characters.',
      params: [
        { name: 'text',   type: 'str', hint: 'text', input: 'text' },
        { name: 'quotes', type: 'str', hint: 'quote characters', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace_split = True\nlex.quotes = {$quotes}\nlist(lex)',
      cases: [
        { id: 'tick', label: 'add backtick',     values: { text: "say 'hi there' `x y`", quotes: "'\"`" } },
        { id: 'dq',   label: 'double quote only', values: { text: 'it\'s "a b"', quotes: '"' } },
      ],
    },
    {
      id: 'whitespace',
      label: 'whitespace',
      blurb: 'Split on other characters, e.g. commas, while quotes still group.',
      params: [
        { name: 'text', type: 'str', hint: 'text', input: 'text' },
        { name: 'ws',   type: 'str', hint: 'whitespace characters', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace = {$ws}\nlex.whitespace_split = True\nlist(lex)',
      cases: [
        { id: 'comma', label: 'commas',  values: { text: 'a,b, "c,d"', ws: ', ' } },
        { id: 'colon', label: 'colons',  values: { text: '/usr/bin:/opt/my tools/bin', ws: ':' } },
      ],
    },
    {
      id: 'escape',
      label: 'escape',
      blurb: 'Use another escape character (POSIX mode).',
      params: [
        { name: 'text',   type: 'str', hint: 'text', input: 'text' },
        { name: 'escape', type: 'str', hint: 'escape characters', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace_split = True\nlex.escape = {$escape}\nlist(lex)',
      cases: [
        { id: 'caret', label: '^ like cmd.exe', values: { text: 'a^ b C:\\dir', escape: '^' } },
        { id: 'none',  label: 'no escape',      values: { text: 'C:\\dir\\file a\\ b', escape: '' } },
      ],
    },
  ],
  demoExplainer: "With commenters ';' everything after the ; is dropped while # becomes an ordinary character; with commenters '' even #1 survives. Adding = to wordchars keeps key=value together, but the default # comment still removes # note. Removing ' from quotes makes it's an ordinary word. A custom whitespace set turns the lexer into a separator-based splitter: commas split while the quoted \"c,d\" stays whole, and once whitespace is only ':' the space in /opt/my tools/bin is no separator any more. An escape character of ^ keeps backslashes literal; an empty escape disables escaping.",

  patterns: [
    {
      name: 'INI-style comments',
      desc: 'Accept both ; and # as comment starters.',
      code: "import shlex\nlex = shlex.shlex(line, posix=True)\nlex.whitespace_split = True\nlex.commenters = '#;'\nparts = list(lex)",
    },
    {
      name: 'Comma-separated values with quotes',
      desc: 'whitespace = "," plus whitespace_split gives a tiny quoted-list parser.',
      code: "import shlex\ndef parse_list(s):\n    lex = shlex.shlex(s, posix=True)\n    lex.whitespace = ', '\n    lex.whitespace_split = True\n    return list(lex)",
    },
    {
      name: 'Identifiers with dashes and dots',
      desc: 'Extend wordchars instead of turning on whitespace_split, so other punctuation still splits.',
      code: "import shlex\nlex = shlex.shlex(text, posix=True)\nlex.wordchars += '-.'\ntokens = list(lex)",
    },
  ],

  examples: [
    { title: 'Defaults of the character sets', code: "import shlex\nlex = shlex.shlex('')\nlex.commenters, lex.whitespace, lex.quotes, lex.escape, lex.escapedquotes", returns: "('#', ' \\t\\r\\n', '\\'\"', '\\\\', '\"')" },
    { title: 'Defaults of the state',  code: "import shlex\nlex = shlex.shlex('')\nlex.whitespace_split, lex.lineno, lex.debug, lex.source, lex.token, lex.infile", returns: "(False, 1, 0, None, '', None)" },
    { title: 'POSIX mode: Latin-1 letters are word characters', code: "import shlex\n'é' in shlex.shlex('').wordchars, 'é' in shlex.shlex('', posix=True).wordchars", returns: '(False, True)' },
    { title: 'Backslash in "..." vs \'...\'', code: "import shlex\nshlex.split('\"a \\\\$x\" \\'a \\\\$x\\'')", returns: "['a \\\\$x', 'a \\\\$x']" },
    { title: 'token holds the partial token', code: "import shlex\nlex = shlex.shlex('a \"b c', posix=True)\ntry:\n    list(lex)\nexcept ValueError as e:\n    result = (str(e), lex.token)\nresult", returns: "('No closing quotation', 'b c')" },
    { title: 'debug = 3 shows every character', code: "import shlex\nlex = shlex.shlex('ab', posix=True)\nlex.debug = 3\nlist(lex)", returns: "shlex: in state ' ' I see character: 'a'\nshlex: in state 'a' I see character: 'b'\nshlex: in state 'a' I see character: ''\nshlex: raw token='ab'\nshlex: token='ab'\nshlex: in state None I see character: ''\nshlex: raw token=EOF\n['ab']" },
  ],

  pitfalls: [
    {
      name: 'The class strips # words by default',
      desc: 'shlex.split ignores comments unless asked, but a shlex object starts with commenters = "#". Clear it when # is data.',
      wrong: { label: 'default commenters', code: "import shlex\nlex = shlex.shlex('tag #1 done', posix=True)\nlex.whitespace_split = True\nlist(lex)", output: "['tag']" },
      fix:   { label: "commenters = ''", code: "import shlex\nlex = shlex.shlex('tag #1 done', posix=True)\nlex.whitespace_split = True\nlex.commenters = ''\nlist(lex)", output: "['tag', '#1', 'done']" },
    },
    {
      name: 'escape in compatibility mode',
      desc: 'escape and escapedquotes are ignored unless posix=True — the backslash is just another non-word character.',
      wrong: { label: 'posix=False', code: "import shlex\nlex = shlex.shlex('a\\\\ b')\nlex.whitespace_split = True\nlist(lex)", output: "['a\\\\', 'b']" },
      fix:   { label: 'posix=True', code: "import shlex\nlex = shlex.shlex('a\\\\ b', posix=True)\nlex.whitespace_split = True\nlist(lex)", output: "['a b']" },
    },
  ],

  when: {
    use: [
      'Adapting the lexer to a config or command language: other comment characters, extra word characters, other quotes',
      'Simple separator-based splitting that honours quotes (whitespace = ",")',
      'Debugging a tokenizer (debug = 1 … 3)',
    ],
    avoid: [
      'Complex grammars — write a real parser or use the tokenize module',
    ],
  },

  notes: {
    cpython:          'All of them are plain instance attributes created in __init__ (they are not in vars(shlex.shlex), so dir() on the class does not show them); punctuation_chars is the only property, and it is read-only',
    'Membership':     'Every check is "character in string", so the order of characters does not matter and duplicates are harmless',
    'When to set':    'Change them before reading tokens; characters already pushed back or partly read keep the old rules',
  },

  related: [
    { name: 'shlex.shlex',       slug: 'shlex',                   when: 'Create the lexer' },
    { name: 'punctuation_chars', slug: 'shlex-punctuation_chars', when: 'The read-only property' },
    { name: 'error_leader',      slug: 'shlex-error_leader',      when: 'Uses infile and lineno' },
    { name: 'push_source / pop_source / sourcehook', slug: 'shlex-push_source', when: 'What source does' },
    { name: 'get_token / push_token / read_token', slug: 'shlex-get_token', when: 'Read tokens; eof marks the end' },
  ],

  faq: [
    {
      q: 'How do I change the comment character in shlex?',
      a: "Assign a string of characters: lex.commenters = ';' (or '#;' for both, '' for none). shlex.split only offers comments=True/False, which keeps or clears the default '#'.",
    },
    {
      q: 'How do I keep characters like - and . inside tokens?',
      a: "Either lex.wordchars += '-.' (other punctuation still splits) or lex.whitespace_split = True (only whitespace splits). punctuation_chars also adds ~-./*?= to wordchars.",
    },
    {
      q: 'Can shlex split on commas?',
      a: "Yes: set lex.whitespace = ',' (plus ' ' if spaces should also separate) and lex.whitespace_split = True. Quoted values keep their commas. For real CSV use the csv module.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex-objects',
    meta:  'shlex objects',
  },
};
