// content/reference/python/stdlib/shlex/shlex-get_token.js — shlex.get_token / push_token / read_token

export const meta = {
  slug:        'shlex-get_token',
  name:        'shlex.get_token / push_token / read_token',
  signature:   'shlex.get_token() · shlex.push_token(str) · shlex.read_token()',
  blurb:       'Read tokens from a shlex lexer one at a time, push tokens back for lookahead, or read a raw token that bypasses the pushback stack and source inclusion.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'shlex.get_token shlex.push_token shlex.read_token python shlex lexer next token lookahead peek push back token stack pushback eof None empty string parser loop debug',
};

export const method = {
  slug:      'shlex-get_token',
  name:      'shlex.get_token / push_token / read_token',
  signature: 'shlex.get_token() · shlex.push_token(str) · shlex.read_token()',
  returns:   { type: 'str | None', desc: 'get_token / read_token: the next token, or lex.eof at the end (None in POSIX mode, "" otherwise). push_token returns None.' },

  category:    'shlex methods',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'get_token is what iteration calls: it pops a pushed-back token if there is one, otherwise reads from the input (following source requests) and returns eof at the end — again and again. push_token is how you put a token back after peeking. read_token is the raw reader underneath; the docs call it not ordinarily useful.',

  covers: ['shlex.get_token', 'shlex.push_token', 'shlex.read_token'],

  cheat: {
    commonCall: "tok = lex.get_token()\nif tok != 'else':\n    lex.push_token(tok)",
    returns:    'a token, or lex.eof (None in POSIX mode)',
    replaces:   'list(lex) when you need lookahead',
    watchOut:   "end test: 'is None' in POSIX mode, == '' in compatibility mode — or compare with lex.eof",
  },

  parameters: [
    { name: 'str', type: 'str', required: true, default: null, desc: 'push_token only: the token to put on the pushback stack. The most recently pushed token comes out first.' },
  ],

  modes: [
    {
      id: 'loop',
      label: 'get_token loop',
      blurb: 'Read until eof. In POSIX mode eof is None, so an empty token "" does not end the loop.',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\ntokens = []\nwhile (tok := lex.get_token()) is not None:\n    tokens.append(tok)\ntokens',
      cases: [
        { id: 'cmd',   label: 'set x = "a b"', values: { text: 'set x = "a b"' } },
        { id: 'empty', label: 'empty token',   values: { text: 'a "" b' } },
      ],
    },
    {
      id: 'peek',
      label: 'peek with push_token',
      blurb: 'Read two tokens, push the second back: iteration sees it again.',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nfirst = lex.get_token()\nnext_tok = lex.get_token()\nlex.push_token(next_tok)\n(first, next_tok, list(lex))',
      cases: [
        { id: 'if',  label: 'if x then y', values: { text: 'if x then y' } },
        { id: 'one', label: 'one token',   values: { text: 'alone' } },
      ],
    },
    {
      id: 'push',
      label: 'push_token',
      blurb: 'A pushed token is returned before anything from the input.',
      params: [
        { name: 'text',  type: 'str', hint: 'text to tokenize', input: 'text' },
        { name: 'token', type: 'str', hint: 'token to push', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nlex.push_token({$token})\nlist(lex)',
      cases: [
        { id: 'sudo', label: 'prepend sudo', values: { text: 'apt install x', token: 'sudo' } },
        { id: 'raw',  label: 'not re-parsed', values: { text: 'a b', token: 'x "y" z' } },
      ],
    },
    {
      id: 'read',
      label: 'read_token',
      blurb: 'read_token ignores the pushback stack; get_token uses it.',
      params: [{ name: 'text', type: 'str', hint: 'text to tokenize', input: 'text' }],
      template: "import shlex\nlex = shlex.shlex({$text})\nlex.push_token('pushed')\n(lex.read_token(), lex.get_token(), lex.get_token())",
      cases: [
        { id: 'two',  label: 'first second', values: { text: 'first second' } },
        { id: 'semi', label: 'a;b',          values: { text: 'a;b' } },
      ],
    },
  ],
  demoExplainer: "The loop stops on None, so the empty token from \"\" is kept. With a one-token input the second get_token already returns eof (None); pushing that back makes list(lex) end immediately. A pushed token is returned exactly as pushed, even if it contains spaces or quotes. In the read_token tab the raw reader skips 'pushed' and reads from the input. In compatibility mode the ; that ends the word a is itself put on the pushback stack, in front of 'pushed' — so after read_token returns a, get_token returns ; and then 'pushed'.",

  patterns: [
    {
      name: 'A loop that works in both modes',
      desc: 'Compare with lex.eof instead of hard-coding None or "".',
      code: "import shlex\nlex = shlex.shlex(text)\nwhile (tok := lex.get_token()) != lex.eof:\n    handle(tok)",
    },
    {
      name: 'Optional keyword with one token of lookahead',
      desc: 'Peek, and push back what you do not consume.',
      code: "def parse_if(lex):\n    cond = lex.get_token()\n    body = lex.get_token()\n    tok = lex.get_token()\n    if tok == 'else':\n        return cond, body, lex.get_token()\n    lex.push_token(tok)\n    return cond, body, None",
    },
    {
      name: 'Expect a specific token',
      desc: 'Combine with error_leader for a file:line message.',
      code: "def expect(lex, wanted):\n    tok = lex.get_token()\n    if tok != wanted:\n        raise SyntaxError(lex.error_leader() + f'expected {wanted!r}, got {tok!r}')",
    },
  ],

  examples: [
    { title: 'eof again and again', code: "import shlex\nlex = shlex.shlex('a b', posix=True)\nlex.get_token(), lex.get_token(), lex.get_token(), lex.get_token()", returns: "('a', 'b', None, None)" },
    { title: 'Compatibility mode ends with ""', code: "import shlex\nlex = shlex.shlex('a b')\nlex.get_token(), lex.get_token(), lex.get_token()", returns: "('a', 'b', '')" },
    { title: 'The pushback stack is last-in, first-out', code: "import shlex\nlex = shlex.shlex('a b', posix=True)\nlex.push_token('x')\nlex.push_token('y')\nlist(lex)", returns: "['y', 'x', 'a', 'b']" },
    { title: 'read_token bypasses the stack', code: "import shlex\nlex = shlex.shlex('first second')\nlex.push_token('pushed')\nlex.read_token(), lex.get_token(), lex.get_token(), lex.get_token()", returns: "('first', 'pushed', 'second', '')" },
    { title: 'next() works too', code: "import shlex\nlex = shlex.shlex('a', posix=True)\nnext(lex), next(lex, 'done')", returns: "('a', 'done')" },
    { title: 'debug = 1 prints every token', code: "import shlex\nlex = shlex.shlex('ls -l', posix=True)\nlex.debug = 1\nlist(lex)", returns: "shlex: token='ls'\nshlex: token='-'\nshlex: token='l'\n['ls', '-', 'l']" },
  ],

  pitfalls: [
    {
      name: 'Testing the token for truth',
      desc: 'In POSIX mode "" is a legitimate token (an empty quoted argument). A while tok := ... loop stops there; test against None (or lex.eof).',
      wrong: { label: 'while tok', code: "import shlex\nlex = shlex.shlex('a \"\" b', posix=True)\ntokens = []\nwhile tok := lex.get_token():\n    tokens.append(tok)\ntokens", output: "['a']" },
      fix:   { label: 'is not None', code: "import shlex\nlex = shlex.shlex('a \"\" b', posix=True)\ntokens = []\nwhile (tok := lex.get_token()) is not None:\n    tokens.append(tok)\ntokens", output: "['a', '', 'b']" },
    },
    {
      name: 'Pushing several tokens in reading order',
      desc: 'push_token puts the token in front, so the last one pushed is read first. Push in reverse to keep the order.',
      wrong: { label: 'in order', code: "import shlex\nlex = shlex.shlex('c', posix=True)\nfor t in ['a', 'b']:\n    lex.push_token(t)\nlist(lex)", output: "['b', 'a', 'c']" },
      fix:   { label: 'reversed', code: "import shlex\nlex = shlex.shlex('c', posix=True)\nfor t in reversed(['a', 'b']):\n    lex.push_token(t)\nlist(lex)", output: "['a', 'b', 'c']" },
    },
  ],

  when: {
    use: [
      'Hand-written recursive-descent parsers on top of shlex tokens',
      'One token of lookahead (peek and push back)',
    ],
    avoid: [
      'Just collecting all tokens → list(lex)',
      'read_token in normal code — it skips pushed tokens and source requests',
    ],
  },

  notes: {
    cpython:      'get_token: return pushback.popleft() if any; else raw = read_token(), follow source requests, pop finished include files at eof, return raw. push_token: pushback.appendleft(tok). read_token: the character state machine',
    'Debug':      'With lex.debug >= 1 get_token prints "shlex: token=..." lines (and push/pop messages); 2 and 3 add the raw tokens and every character state',
    'Both modes': 'In compatibility mode eof is "", so a loop testing "is not None" never ends there — compare with lex.eof to be safe',
  },

  related: [
    { name: 'shlex.shlex',     slug: 'shlex',              when: 'Create the lexer' },
    { name: 'error_leader',    slug: 'shlex-error_leader', when: 'Messages that point at the line' },
    { name: 'push_source / pop_source / sourcehook', slug: 'shlex-push_source', when: 'What get_token does on a source request' },
    { name: 'shlex attributes', slug: 'shlex-attributes',  when: 'eof, token, debug and the character sets' },
    { name: 'next()',          slug: 'next', when: 'One token with a default', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I peek at the next token with shlex?',
      a: 'Call get_token() and, if you do not want it yet, push_token() it back. The next get_token() (or iteration) returns it first.',
    },
    {
      q: 'What does get_token return at the end of input?',
      a: 'lex.eof — None in POSIX mode, the empty string in compatibility mode — and it keeps returning it on every further call.',
    },
    {
      q: 'What is the difference between get_token and read_token?',
      a: 'get_token checks the pushback stack first and handles source inclusion and the end of included files; read_token only runs the tokenizer on the current input stream. The documentation says read_token is not ordinarily a useful entry point.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.shlex.get_token',
    meta:  'shlex.get_token',
  },
};
