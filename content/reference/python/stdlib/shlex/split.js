// content/reference/python/stdlib/shlex/split.js — shlex.split

export const meta = {
  slug:        'split',
  name:        'shlex.split',
  signature:   'shlex.split(s, comments=False, posix=True)',
  blurb:       'Split a string into a list of arguments with shell rules: quotes group words and are removed, backslashes escape, optional # comments — no expansion.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (None raises since 3.12)',
  searchTerms: 'shlex.split python split command line into list of arguments respecting quotes split string with quotes shell like split no closing quotation no escaped character comments posix=False windows paths backslash',
};

export const method = {
  slug:      'split',
  name:      'shlex.split',
  signature: 'shlex.split(s, comments=False, posix=True)',
  returns:   { type: 'list[str]', desc: 'The arguments, with quotes and escaping backslashes removed (in POSIX mode).' },

  category:    'shlex function',
  version:     'All Python 3 versions (None raises since 3.12)',
  hasLiveDemo: true,

  subtitle: 'Words are separated by unquoted whitespace only — a quote in the middle of a word does not start a new argument, it just protects what it encloses. A missing closing quote or a trailing backslash is a ValueError, not a guess.',

  covers: ['split'],

  cheat: {
    commonCall: "shlex.split('git commit -m \"first commit\"')",
    returns:    "['git', 'commit', '-m', 'first commit']",
    replaces:   'str.split() on command lines',
    watchOut:   "apostrophes (it's) and Windows backslashes raise or vanish",
  },

  parameters: [
    { name: 's',        type: 'str', required: true,  default: null,    desc: 'The command line. Since 3.12 None raises ValueError instead of reading sys.stdin.' },
    { name: 'comments', type: 'bool', required: false, default: 'False', desc: 'True: an unquoted # starts a comment that runs to the end of the line — even in the middle of a word, unlike a real shell.' },
    { name: 'posix',    type: 'bool', required: false, default: 'True',  desc: 'False: compatibility mode — quotes are kept in the tokens, backslash is an ordinary character, and an empty "" cannot produce an empty argument.' },
  ],

  modes: [
    {
      id: 'posix',
      label: 'split',
      blurb: 'The default: POSIX rules, comments not recognised.',
      params: [{ name: 'cmd', type: 'str', hint: 'a command line', input: 'text' }],
      template: 'import shlex\nshlex.split({$cmd})',
      cases: [
        { id: 'quotes',  label: '"..." and \'...\'',   values: { cmd: 'echo "double $x" \'single $x\'' } },
        { id: 'escapes', label: 'backslashes',         values: { cmd: 'a\\ b "c \\" d" \'e \\ f\'' } },
        { id: 'glued',   label: 'quotes inside a word', values: { cmd: 'pre"fix"ed --opt=\'a b\'' } },
        { id: 'empty',   label: 'empty argument',      values: { cmd: 'cmd "" end' } },
        { id: 'apos',    label: "it's",                values: { cmd: "echo it's fine" } },
        { id: 'tail',    label: 'trailing \\',         values: { cmd: 'echo oops\\' } },
      ],
    },
    {
      id: 'comments',
      label: 'comments=True',
      blurb: 'An unquoted # starts a comment that runs to the end of the line.',
      params: [{ name: 'cmd', type: 'str', hint: 'a line with #', input: 'text' }],
      template: 'import shlex\nshlex.split({$cmd}, comments=True)',
      cases: [
        { id: 'end',    label: 'trailing comment', values: { cmd: 'timeout = 30  # seconds' } },
        { id: 'quoted', label: '# in quotes',      values: { cmd: 'color "#ff0000" # red' } },
        { id: 'word',   label: '# inside a word',  values: { cmd: 'issue#42 is open' } },
      ],
    },
    {
      id: 'nonposix',
      label: 'posix=False',
      blurb: 'Compatibility mode: quotes stay, backslashes are ordinary characters.',
      params: [{ name: 'cmd', type: 'str', hint: 'a command line', input: 'text' }],
      template: 'import shlex\nshlex.split({$cmd}, posix=False)',
      cases: [
        { id: 'win',    label: 'Windows path', values: { cmd: 'type C:\\Users\\me\\notes.txt' } },
        { id: 'quotes', label: 'quotes kept',  values: { cmd: 'a "b c" d' } },
        { id: 'empty',  label: '"" is kept',   values: { cmd: 'cmd "" end' } },
      ],
    },
  ],
  demoExplainer: "In POSIX mode quotes are removed and do not split words: pre\"fix\"ed is one argument, prefixed. Inside double quotes a backslash only escapes \" and \\ (elsewhere it is kept), inside single quotes it is always literal, and an unquoted backslash makes the next character ordinary (a\\ b is one argument). \"\" produces an empty-string argument. With comments=True a quoted # is kept, but an unquoted one starts a comment anywhere — issue#42 is open comes back as just ['issue'] (the rest of the line is dropped), where a real shell would keep the word. With posix=False the quotes stay part of the token and C:\\Users\\me\\notes.txt is left intact.",

  patterns: [
    {
      name: 'Command line from a config file',
      desc: 'Store one string, run it without a shell.',
      code: "import shlex, subprocess\ncmd = config['build_command']\nsubprocess.run(shlex.split(cmd), check=True)",
    },
    {
      name: 'Report a parse error',
      desc: 'Both errors are ValueError with a fixed message.',
      code: "import shlex\ntry:\n    args = shlex.split(line)\nexcept ValueError as e:\n    print(f'cannot parse {line!r}: {e}')",
    },
    {
      name: 'A tiny command interpreter',
      desc: 'First word is the command, the rest its arguments.',
      code: "import shlex\nwhile line := input('> '):\n    cmd, *args = shlex.split(line, comments=True) or ['']\n    print(cmd, args)",
    },
  ],

  examples: [
    { title: 'Quoted argument',          code: "import shlex\nshlex.split('git commit -m \"fix: handle spaces\"')", returns: "['git', 'commit', '-m', 'fix: handle spaces']" },
    { title: 'Escaped space',            code: "import shlex\nshlex.split(r'cp My\\ File.txt backup/')", returns: "['cp', 'My File.txt', 'backup/']" },
    { title: 'Escaped quote inside "..."', code: "import shlex\nshlex.split(r'\"a \\\"quoted\\\" word\"')", returns: "['a \"quoted\" word']" },
    { title: 'Empty quotes give an empty argument', code: "import shlex\nshlex.split('a \"\" b')", returns: "['a', '', 'b']" },
    { title: 'Comments',                  code: "import shlex\nshlex.split('grep foo # find foo', comments=True)", returns: "['grep', 'foo']" },
    { title: 'Whitespace includes newlines', code: "import shlex\nshlex.split('a\\nb\\tc')", returns: "['a', 'b', 'c']" },
    { title: 'Trailing backslash',        code: "import shlex\nshlex.split('echo trailing\\\\')", returns: 'ValueError: No escaped character' },
    { title: 'None is rejected (3.12+)',  code: "import shlex\nshlex.split(None)", returns: 'ValueError: s argument must not be None' },
  ],

  pitfalls: [
    {
      name: 'An apostrophe in free text',
      desc: "A single ' opens a quote that is never closed. Escape it, put the word in double quotes, or do not run free text through shlex.",
      wrong: { label: "it's", code: "import shlex\nshlex.split(\"echo it's fine\")", output: 'ValueError: No closing quotation' },
      fix:   { label: '"it\'s"', code: "import shlex\nshlex.split('echo \"it\\'s\" fine')", output: "['echo', \"it's\", 'fine']" },
    },
    {
      name: 'Backslashes vanish from Windows paths',
      desc: 'In POSIX mode \\U, \\m and \\n are escapes for U, m and n. posix=False keeps them — or skip parsing and build the list.',
      wrong: { label: 'posix=True', code: "import shlex\nshlex.split('type C:\\\\Users\\\\me\\\\notes.txt')", output: "['type', 'C:Usersmenotes.txt']" },
      fix:   { label: 'posix=False', code: "import shlex\nshlex.split('type C:\\\\Users\\\\me\\\\notes.txt', posix=False)", output: "['type', 'C:\\\\Users\\\\me\\\\notes.txt']" },
    },
    {
      name: 'Expecting shell operators to be separate',
      desc: 'split only splits on whitespace: a;b stays one word. Use the shlex class with punctuation_chars=True to get ; | && as tokens.',
      wrong: { label: 'split', code: "import shlex\nshlex.split('make;make install')", output: "['make;make', 'install']" },
      fix:   { label: 'punctuation_chars', code: "import shlex\nlex = shlex.shlex('make;make install', posix=True, punctuation_chars=True)\nlex.whitespace_split = True\nlist(lex)", output: "['make', ';', 'make', 'install']" },
    },
  ],

  when: {
    use: [
      'Command lines stored as one string (config files, environment variables, user input)',
      'Simple space-separated formats where values may be quoted',
    ],
    avoid: [
      'Commands you construct yourself → write the list directly',
      'Windows command lines → posix=False only keeps the text; cmd.exe has its own quoting rules',
      'CSV → csv module (quotes are doubled there, not backslash-escaped)',
    ],
  },

  notes: {
    cpython:     "lex = shlex(s, posix=posix); lex.whitespace_split = True; if not comments: lex.commenters = ''; return list(lex)",
    'Errors':    "ValueError('No closing quotation') at end of input inside quotes; ValueError('No escaped character') when the input ends right after an escape backslash",
    'Non-POSIX': 'posix=False keeps quotes in the tokens, so "" comes back as the two-character token \'""\' — the docs note that compatibility mode cannot produce empty strings (its end-of-input value is "")',
  },

  related: [
    { name: 'shlex.join',    slug: 'join',  when: 'The inverse: list → command line' },
    { name: 'shlex.quote',   slug: 'quote', when: 'Quote one argument' },
    { name: 'shlex.shlex',   slug: 'shlex', when: 'The lexer behind split' },
    { name: 'punctuation_chars', slug: 'shlex-punctuation_chars', when: 'Shell operators as tokens' },
    { name: 'subprocess.run', slug: 'run',  when: 'Run the resulting list', category: 'stdlib/subprocess' },
  ],

  faq: [
    {
      q: 'How do I split a string by spaces but keep quoted text together?',
      a: "shlex.split('a \"b c\" d') returns ['a', 'b c', 'd']. Single quotes work the same way, and a backslash can escape a single space (b\\ c).",
    },
    {
      q: 'Why does shlex.split remove my backslashes?',
      a: 'POSIX mode treats an unquoted backslash as an escape: the backslash is dropped and the next character kept. Use single quotes around the text, double the backslashes, or pass posix=False to keep them.',
    },
    {
      q: 'How do I fix "ValueError: No closing quotation"?',
      a: "Some ' or \" has no partner — typically an apostrophe. Escape it with a backslash, wrap the word in the other kind of quote, or catch the ValueError and report the line to the user.",
    },
    {
      q: 'Does shlex.split expand environment variables or wildcards?',
      a: "No. $HOME, ~ and *.txt are returned unchanged. Expand them yourself with os.path.expandvars, os.path.expanduser and glob if needed.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.split',
    meta:  'shlex.split',
  },
};
