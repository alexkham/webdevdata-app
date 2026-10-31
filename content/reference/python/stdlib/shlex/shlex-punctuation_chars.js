// content/reference/python/stdlib/shlex/shlex-punctuation_chars.js — shlex.punctuation_chars

export const meta = {
  slug:        'shlex-punctuation_chars',
  name:        'shlex.punctuation_chars',
  signature:   "shlex.shlex(text, posix=True, punctuation_chars=True) · lex.punctuation_chars → '();<>|&'",
  blurb:       'Make runs of shell operator characters — ( ) ; < > | & by default — come out as their own tokens, so a && b; c > out splits like a shell would. Read-only after construction (3.6+).',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.6+',
  searchTerms: 'shlex punctuation_chars python split shell operators && || ; | > < redirection pipe tokens shlex.punctuation_chars read-only property whitespace_split posix improved compatibility with shells',
};

export const method = {
  slug:      'shlex-punctuation_chars',
  name:      'shlex.punctuation_chars',
  signature: "shlex.shlex(text, posix=True, punctuation_chars=True) · lex.punctuation_chars → '();<>|&'",
  returns:   { type: 'str', desc: "The punctuation characters: '' (off), '();<>|&' for True, or the string you passed." },

  category:    'shlex attribute',
  version:     'Python 3.6+',
  hasLiveDemo: true,

  subtitle: 'Set it in the constructor: True for ();<>|&, or any string of characters. Each maximal run of those characters becomes one token (&&, ||, >>, even >>>), and ~-./*?= are added to wordchars so paths and --options stay whole. The docs recommend combining it with posix=True and whitespace_split=True.',

  covers: ['shlex.punctuation_chars'],

  cheat: {
    commonCall: "lex = shlex.shlex(cmd, posix=True, punctuation_chars=True)\nlex.whitespace_split = True\nlist(lex)",
    returns:    "['a', '&&', 'b', ';', 'c']",
    replaces:   'regex hacks to find ; | && in a command line',
    watchOut:   'no validation: >>> or ;; are returned as single tokens',
  },

  parameters: [
    { name: 'punctuation_chars', type: 'bool | str', required: false, default: 'False', desc: "Constructor argument. False/'' disables it, True means '();<>|&', a non-empty string lists the characters. Characters in it are removed from wordchars." },
  ],

  modes: [
    {
      id: 'shell',
      label: 'posix + whitespace_split',
      blurb: 'The recommended combination: shell operators split off, everything else split on whitespace.',
      params: [{ name: 'cmd', type: 'str', hint: 'a shell command', input: 'text' }],
      template: 'import shlex\nlex = shlex.shlex({$cmd}, posix=True, punctuation_chars=True)\nlex.whitespace_split = True\nlist(lex)',
      cases: [
        { id: 'docs',   label: 'docs example',   values: { cmd: 'a && b; c && d || e; f >\'abc\'; (def "ghi")' } },
        { id: 'pipe',   label: 'pipe + redirect', values: { cmd: 'grep -n "x y" *.log|sort>out.txt' } },
        { id: 'redir',  label: '2>&1',            values: { cmd: 'make all >> build.log 2>&1' } },
        { id: 'triple', label: '>>> is one token', values: { cmd: 'echo hi>>>x' } },
      ],
    },
    {
      id: 'without',
      label: 'without punctuation_chars',
      blurb: 'Same lexer settings minus punctuation_chars, for comparison.',
      params: [{ name: 'cmd', type: 'str', hint: 'a shell command', input: 'text' }],
      template: 'import shlex\nlex = shlex.shlex({$cmd}, posix=True)\nlex.whitespace_split = True\nlist(lex)',
      cases: [
        { id: 'docs', label: 'docs example', values: { cmd: 'a && b; c && d || e; f >\'abc\'; (def "ghi")' } },
        { id: 'pipe', label: 'pipe + redirect', values: { cmd: 'grep -n "x y" *.log|sort>out.txt' } },
      ],
    },
    {
      id: 'custom',
      label: 'custom characters',
      blurb: 'Only the characters you list are punctuation (compatibility mode, as in the docs).',
      params: [
        { name: 'cmd',   type: 'str', hint: 'a command', input: 'text' },
        { name: 'chars', type: 'str', hint: 'punctuation characters', input: 'text' },
      ],
      template: 'import shlex\nlist(shlex.shlex({$cmd}, punctuation_chars={$chars}))',
      cases: [
        { id: 'pipe', label: "only '|'",    values: { cmd: 'a && b || c', chars: '|' } },
        { id: 'eq',   label: "'=' as punctuation", values: { cmd: 'key=value; x==y', chars: '=;' } },
      ],
    },
  ],
  demoExplainer: "With punctuation_chars, ; and ( ) break words apart (b; becomes b and ;) and runs such as &&, || and >> stay together — but a run is just a run: >>> comes back whole, and 2>&1 becomes 2, >& and 1. Without it, whitespace_split only cuts at spaces, so b; and >abc; and (def are single words. A custom string makes only those characters special; in compatibility mode the other characters (here &) still come back one by one, since they are not word characters.",

  patterns: [
    {
      name: 'Split a command line at ; && ||',
      desc: 'Group tokens into commands between the separators.',
      code: "import shlex\nlex = shlex.shlex(line, posix=True, punctuation_chars=True)\nlex.whitespace_split = True\ncommands, current = [], []\nfor tok in lex:\n    if tok in (';', '&&', '||'):\n        commands.append(current)\n        current = []\n    else:\n        current.append(tok)\ncommands.append(current)",
    },
    {
      name: 'Reject shell syntax in user input',
      desc: 'Any punctuation token means the input tried to use operators.',
      code: "import shlex\nlex = shlex.shlex(user_input, posix=True, punctuation_chars=True)\nlex.whitespace_split = True\nif any(tok and set(tok) <= set('();<>|&') for tok in lex):\n    raise ValueError('shell operators are not allowed')",
    },
  ],

  examples: [
    { title: 'Operators become tokens',       code: "import shlex\nlist(shlex.shlex('a && b || c', punctuation_chars=True))", returns: "['a', '&&', 'b', '||', 'c']" },
    { title: 'Only the characters you choose', code: "import shlex\nlist(shlex.shlex('a && b || c', punctuation_chars='|'))", returns: "['a', '&', '&', 'b', '||', 'c']" },
    { title: 'Paths and options stay whole',  code: "import shlex\nlist(shlex.shlex('~/a && b-c --color=auto || d *.py?', punctuation_chars=True))", returns: "['~/a', '&&', 'b-c', '--color=auto', '||', 'd', '*.py?']" },
    { title: 'The property value',            code: "import shlex\nshlex.shlex('', punctuation_chars=True).punctuation_chars, shlex.shlex('').punctuation_chars", returns: "('();<>|&', '')" },
    { title: 'wordchars gains ~-./*?=',       code: "import shlex\nshlex.shlex('', punctuation_chars=True).wordchars", returns: "'abcdfeghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_~-./*?='" },
    { title: 'Read-only',                     code: "import shlex\nlex = shlex.shlex('a', punctuation_chars=True)\nlex.punctuation_chars = ';'", returns: "AttributeError: property 'punctuation_chars' of 'shlex' object has no setter" },
  ],

  pitfalls: [
    {
      name: 'Using punctuation_chars without whitespace_split',
      desc: 'Characters outside wordchars (a comma, $, :) still become one-character tokens. whitespace_split=True keeps them inside words.',
      wrong: { label: 'default', code: "import shlex\nlist(shlex.shlex('echo $HOME:x,y;ls', posix=True, punctuation_chars=True))", output: "['echo', '$', 'HOME', ':', 'x', ',', 'y', ';', 'ls']" },
      fix:   { label: 'whitespace_split', code: "import shlex\nlex = shlex.shlex('echo $HOME:x,y;ls', posix=True, punctuation_chars=True)\nlex.whitespace_split = True\nlist(lex)", output: "['echo', '$HOME:x,y', ';', 'ls']" },
    },
    {
      name: 'Trying to turn it on later',
      desc: 'punctuation_chars is a read-only property, and the wordchars adjustment happens only in __init__. Pass it to the constructor.',
      wrong: { label: 'assign', code: "import shlex\nlex = shlex.shlex('a;b', posix=True)\nlex.punctuation_chars = ';'", output: "AttributeError: property 'punctuation_chars' of 'shlex' object has no setter" },
      fix:   { label: 'constructor', code: "import shlex\nlist(shlex.shlex('a;b', posix=True, punctuation_chars=';'))", output: "['a', ';', 'b']" },
    },
  ],

  when: {
    use: [
      'Analysing shell command lines: finding pipes, redirections, command separators',
      'Mini-languages whose operators are runs of symbol characters',
    ],
    avoid: [
      'Validating shell syntax — tokens are not checked (>>> is accepted)',
      'Plain argument splitting → shlex.split',
    ],
  },

  notes: {
    cpython:        "__init__: punctuation_chars True → '();<>|&'; if set, wordchars += '~-./*?=' and every punctuation character is removed from wordchars. read_token's 'c' state collects a run and pushes the first other character back on _pushback_chars",
    'Version':      'Added in 3.6. Since 3.8 it works together with whitespace_split (tokens are split on whitespace and on punctuation)',
    'Docs advice':  'For the closest match to a shell, use posix=True and whitespace_split=True with it; whitespace_split makes wordchars irrelevant',
  },

  related: [
    { name: 'shlex.shlex', slug: 'shlex', when: 'Where punctuation_chars is passed' },
    { name: 'shlex attributes', slug: 'shlex-attributes', when: 'wordchars, whitespace_split and the rest' },
    { name: 'shlex.split', slug: 'split', when: 'Whitespace-only splitting' },
    { name: 'subprocess shell=True', slug: 'shell', when: 'What actually interprets these operators', category: 'stdlib/subprocess' },
  ],

  faq: [
    {
      q: 'How do I split a shell command on && and ; with Python?',
      a: "Create shlex.shlex(cmd, posix=True, punctuation_chars=True), set whitespace_split = True and iterate: separators come out as their own tokens ('&&', ';', '||'), which you can use to group the command words.",
    },
    {
      q: 'Can I change punctuation_chars after creating the lexer?',
      a: "No. It is a read-only property — assigning raises AttributeError — and the matching wordchars change is only made in the constructor. Create a new lexer with the characters you need.",
    },
    {
      q: 'Does punctuation_chars validate shell syntax?',
      a: "No. Any run of the characters is one token; the docs point out that '>>>' could be returned even though shells do not recognise it. Check the tokens yourself.",
    },
  ],

  history: [
    { version: '3.6', note: 'punctuation_chars constructor argument and property added' },
    { version: '3.8', note: 'made compatible with whitespace_split' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.shlex.punctuation_chars',
    meta:  'shlex.punctuation_chars',
  },
};
