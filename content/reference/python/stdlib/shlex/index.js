// content/reference/python/stdlib/shlex/index.js — the shlex module hub

export const meta = {
  slug:        'index',
  name:        'shlex',
  signature:   'import shlex',
  blurb:       'Split command lines the way a POSIX shell does (shlex.split), build them safely (shlex.quote, shlex.join), and tokenize shell-like mini-languages with the shlex lexer class.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python 3 versions (quote 3.3+, join 3.8+)',
  searchTerms: 'shlex module python split command line string into arguments respecting quotes shell split shlex.split shlex.quote shlex.join escape shell argument command injection no closing quotation no escaped character lexer tokenizer posix mode punctuation_chars',
};

export const method = {
  slug: 'index',
  name: 'shlex',

  category:    'Text',
  version:     'All Python 3 versions (quote 3.3+, join 3.8+)',
  hasLiveDemo: true,

  subtitle: "split turns 'cp \"My File.txt\" backup/' into ['cp', 'My File.txt', 'backup/']; quote and join go the other way, producing text a POSIX shell reads back as exactly those arguments. The shlex class underneath is a configurable lexer for shell-like syntaxes.",

  // every public name the shlex class defines itself must have a member page
  coverClasses: ['shlex'],

  imports: ['import shlex', 'from shlex import split, quote, join'],
  facts: [
    { label: 'Public API', value: 'split, join, quote, and the class shlex (get_token, push_token, read_token, sourcehook, push_source, pop_source, error_leader, punctuation_chars)' },
    { label: 'Shell',      value: 'POSIX shells (sh, bash, dash). The docs warn that quote() is not guaranteed to be correct on non-POSIX shells such as those of Windows' },
    { label: 'Errors',     value: "ValueError('No closing quotation') for an unbalanced quote, ValueError('No escaped character') for a trailing backslash" },
    { label: 'Not a shell', value: 'No variable, ~ or glob expansion, no command substitution: $HOME and *.txt come back as literal text' },
  ],

  modes: [
    {
      id: 'split',
      label: 'split',
      blurb: 'A command line in, the argument list a POSIX shell would build out.',
      params: [{ name: 'cmd', type: 'str', hint: 'a command line', input: 'text' }],
      template: 'import shlex\nshlex.split({$cmd})',
      cases: [
        { id: 'quoted',  label: 'quoted argument',  values: { cmd: 'git commit -m "fix: handle spaces"' } },
        { id: 'escaped', label: 'escaped space',    values: { cmd: 'cp My\\ File.txt backup/' } },
        { id: 'mixed',   label: 'quotes inside',    values: { cmd: '--name="Ada Lovelace" --tag=\'v1\'' } },
        { id: 'vars',    label: '$HOME and *',      values: { cmd: 'echo $HOME ~ *.txt' } },
        { id: 'open',    label: 'unclosed quote',   values: { cmd: 'echo "unterminated' } },
      ],
    },
    {
      id: 'join',
      label: 'join',
      blurb: 'An argument list in, one safely quoted command line out (3.8+).',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import shlex\nshlex.join({$args})',
      cases: [
        { id: 'space', label: 'a space',       values: { args: 'ls, -l, My Documents' } },
        { id: 'apos',  label: 'an apostrophe', values: { args: "echo, it's" } },
        { id: 'semi',  label: 'injection',     values: { args: 'ls, -l, somefile; rm -rf ~' } },
      ],
    },
    {
      id: 'quote',
      label: 'quote',
      blurb: 'One argument, quoted only if needed.',
      params: [{ name: 'arg', type: 'str', hint: 'one argument', input: 'text' }],
      template: 'import shlex\nshlex.quote({$arg})',
      cases: [
        { id: 'safe',  label: 'safe',       values: { arg: 'report-2024.txt' } },
        { id: 'space', label: 'space',      values: { arg: 'My File.txt' } },
        { id: 'dollar', label: '$ variable', values: { arg: '$HOME' } },
        { id: 'empty', label: 'empty',      values: { arg: '' } },
      ],
    },
  ],
  demoExplainer: "split removes the quotes and backslashes the shell would remove: \"fix: handle spaces\" is one argument, My\\ File.txt keeps its space, and --name=\"Ada Lovelace\" becomes --name=Ada Lovelace because quotes inside a word only protect what they enclose. Nothing is expanded — $HOME, ~ and *.txt stay literal. join and quote add single quotes only where a character outside [A-Za-z0-9_@%+=:,./-] appears; an apostrophe is written as '\"'\"' (close, a double-quoted ', reopen). An empty argument becomes ''.",

  patterns: [
    {
      name: 'Split a command for subprocess',
      desc: 'A list argument means no shell is involved, so nothing is re-interpreted.',
      code: "import shlex, subprocess\nargs = shlex.split('grep -n \"hello world\" notes.txt')\nsubprocess.run(args)",
    },
    {
      name: 'Log a command so it can be pasted into a shell',
      desc: 'join quotes every argument that needs it.',
      code: "import shlex\nprint('running:', shlex.join(args))",
    },
    {
      name: 'Insert untrusted text into a shell command',
      desc: 'Only when a shell string is unavoidable (ssh, docker exec ... sh -c).',
      code: "import shlex, subprocess\nremote = 'ls -l ' + shlex.quote(filename)\nsubprocess.run(['ssh', 'host', remote])",
    },
    {
      name: 'Parse a config line with comments',
      desc: 'comments=True drops everything after an unquoted #.',
      code: "import shlex\nfor line in open('settings.conf', encoding='utf-8'):\n    parts = shlex.split(line, comments=True)\n    if parts:\n        key, *values = parts",
    },
  ],

  examples: [
    { title: 'Split respecting quotes',     code: "import shlex\nshlex.split('ls -l \"My Documents\"')", returns: "['ls', '-l', 'My Documents']" },
    { title: 'Comments are kept unless asked', code: "import shlex\nshlex.split('grep foo # find foo'), shlex.split('grep foo # find foo', comments=True)", returns: "(['grep', 'foo', '#', 'find', 'foo'], ['grep', 'foo'])" },
    { title: 'join is the inverse of split', code: "import shlex\nshlex.join(['echo', '-n', 'Multiple words'])", returns: "\"echo -n 'Multiple words'\"" },
    { title: 'quote defuses shell syntax',  code: "import shlex\nshlex.quote('somefile; rm -rf ~')", returns: "\"'somefile; rm -rf ~'\"" },
    { title: 'Round trip',                  code: "import shlex\nargs = ['a b', \"it's\", '', '$x']\nshlex.split(shlex.join(args)) == args", returns: 'True' },
    { title: 'Shell operators as tokens',   code: "import shlex\nlist(shlex.shlex('a && b; c', posix=True, punctuation_chars=True))", returns: "['a', '&&', 'b', ';', 'c']" },
    { title: 'Unbalanced quote',            code: "import shlex\nshlex.split(\"it's\")", returns: 'ValueError: No closing quotation' },
  ],

  pitfalls: [
    {
      name: 'Splitting a command line with str.split',
      desc: 'str.split knows nothing about quotes, so a quoted argument with a space falls apart.',
      wrong: { label: 'str.split', code: "'ls -l \"My Documents\"'.split()", output: "['ls', '-l', '\"My', 'Documents\"']" },
      fix:   { label: 'shlex.split', code: "import shlex\nshlex.split('ls -l \"My Documents\"')", output: "['ls', '-l', 'My Documents']" },
    },
    {
      name: 'Pasting a value into a shell command',
      desc: 'A value containing ; or $( ) becomes shell syntax. quote it — or better, pass a list to subprocess and skip the shell.',
      wrong: { label: 'plain format', code: "filename = 'somefile; rm -rf ~'\n'ls -l {}'.format(filename)", output: "'ls -l somefile; rm -rf ~'" },
      fix:   { label: 'shlex.quote', code: "import shlex\nfilename = 'somefile; rm -rf ~'\n'ls -l {}'.format(shlex.quote(filename))", output: "\"ls -l 'somefile; rm -rf ~'\"" },
    },
    {
      name: 'Windows paths in POSIX mode',
      desc: 'In POSIX mode a backslash escapes the next character, so it disappears. Use posix=False for such strings, or better, build the argument list directly.',
      wrong: { label: 'default (posix=True)', code: "import shlex\nshlex.split('copy C:\\\\Users\\\\me\\\\a.txt D:\\\\')", output: 'ValueError: No escaped character' },
      fix:   { label: 'posix=False', code: "import shlex\nshlex.split('copy C:\\\\Users\\\\me\\\\a.txt D:\\\\', posix=False)", output: "['copy', 'C:\\\\Users\\\\me\\\\a.txt', 'D:\\\\']" },
    },
  ],

  when: {
    use: [
      'Turning a user-typed or configured command line into a subprocess argument list',
      'Printing or logging commands in a form a POSIX shell accepts',
      'Quoting one value for a shell string you cannot avoid (ssh, sh -c)',
      'Tokenizing simple shell-like config or command languages',
    ],
    avoid: [
      'Running commands you build yourself → subprocess.run([...]) with a list, no quoting needed',
      'Windows command lines → pass a list to subprocess (it uses list2cmdline, the MS C runtime quoting rules)',
      'Full shell syntax (pipes, redirections, expansions) → run the real shell, or a parser library',
    ],
  },

  notes: {
    cpython:      'Lib/shlex.py — pure Python. split builds shlex(s, posix=True) with whitespace_split=True and, unless comments=True, commenters set to the empty string, then returns list(lexer)',
    'POSIX mode': 'Quotes are removed, backslash escapes the next character, inside "..." it only escapes " and \\ (and is kept otherwise), inside \'...\' it is literal',
    'Not expanded': 'Variables, ~, globs, command substitution and arithmetic are all left as text — shlex only splits and quotes',
    'Since 3.12': 'shlex.split(None) raises ValueError("s argument must not be None") instead of reading standard input',
  },

  related: [
    { name: 'subprocess module', slug: 'subprocess', when: 'Run the argument list split produces', category: 'stdlib' },
    { name: 'subprocess.list2cmdline', slug: 'list2cmdline', when: 'Quoting for Windows command lines', category: 'stdlib/subprocess' },
    { name: 'argparse module', slug: 'argparse', when: 'Parse the split arguments', category: 'stdlib' },
    { name: 're module',       slug: 're',       when: 'Tokenizing anything that is not shell-like', category: 'stdlib' },
    { name: 'ValueError',      slug: 'valueerror', when: 'What unbalanced quotes raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I split a string into arguments like the shell does?',
      a: "shlex.split('cmd \"quoted arg\" other') returns ['cmd', 'quoted arg', 'other']. It honours single quotes, double quotes and backslash escapes like a POSIX shell, but performs no expansion of variables, ~ or wildcards.",
    },
    {
      q: 'What does "ValueError: No closing quotation" mean?',
      a: "The string has an opening ' or \" without a matching closing quote — often an apostrophe in text such as it's. Escape it (it\\'s), quote the whole word (\"it's\"), or build the argument list without shlex.",
    },
    {
      q: 'Is shlex.quote safe on Windows?',
      a: 'No. The documentation warns that shlex is only designed for Unix shells and that quote() is not guaranteed to be correct on non-POSIX shells such as Windows cmd.exe — using it there can open a command injection hole. Pass a list to subprocess.run instead.',
    },
    {
      q: 'What is the difference between shlex.split and str.split?',
      a: 'str.split cuts at every run of whitespace. shlex.split keeps quoted text together, removes the quotes, and processes backslash escapes — so "My Documents" stays one argument.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html',
    meta:  'shlex — Simple lexical analysis',
  },
};
