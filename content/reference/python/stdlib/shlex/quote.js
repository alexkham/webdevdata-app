// content/reference/python/stdlib/shlex/quote.js — shlex.quote

export const meta = {
  slug:        'quote',
  name:        'shlex.quote',
  signature:   'shlex.quote(s)',
  blurb:       'Return a shell-escaped version of one string, safe to use as a single token in a POSIX shell command line — the defence against shell injection when a string command is unavoidable.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'shlex.quote python escape shell argument quote string for bash prevent shell injection command injection safe filename in shell command pipes.quote single quotes',
};

export const method = {
  slug:      'quote',
  name:      'shlex.quote',
  signature: 'shlex.quote(s)',
  returns:   { type: 'str', desc: "s unchanged if it only contains [A-Za-z0-9_@%+=:,./-]; '' for an empty string; otherwise s in single quotes with each ' written as '\"'\"'." },

  category:    'shlex function',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'The rule is simple and strict: anything beyond letters, digits and @%+=:,./-_ gets the whole value wrapped in single quotes, where a POSIX shell treats every character literally. It is meant for POSIX shells — the docs warn it is not correct for Windows shells.',

  covers: ['quote'],

  cheat: {
    commonCall: "'ls -l ' + shlex.quote(filename)",
    returns:    "\"ls -l 'my file.txt'\"",
    replaces:   'hand-written escaping, the old pipes.quote',
    watchOut:   'not for cmd.exe / PowerShell; prefer subprocess with a list',
  },

  parameters: [
    { name: 's', type: 'str', required: true, default: null, desc: "One argument, as a str. A non-empty bytes value or a non-zero int raises TypeError; falsy values (0, None, b'') pass the empty test and return \"''\"." },
  ],

  modes: [
    {
      id: 'quote',
      label: 'quote',
      blurb: 'What quote returns for one value.',
      params: [{ name: 'arg', type: 'str', hint: 'one argument', input: 'text' }],
      template: 'import shlex\nshlex.quote({$arg})',
      cases: [
        { id: 'safe',   label: 'safe characters', values: { arg: 'user@host:/data/file-1.txt' } },
        { id: 'space',  label: 'space',           values: { arg: 'My File.txt' } },
        { id: 'inject', label: 'injection',       values: { arg: 'x; rm -rf ~' } },
        { id: 'apos',   label: 'apostrophe',      values: { arg: "it's" } },
        { id: 'accent', label: 'non-ASCII',       values: { arg: 'café.txt' } },
        { id: 'empty',  label: 'empty',           values: { arg: '' } },
      ],
    },
    {
      id: 'command',
      label: 'into a command',
      blurb: 'The docs idiom: format the quoted value into a command, then check what a shell (here shlex.split) sees.',
      params: [{ name: 'name', type: 'str', hint: 'a file name', input: 'text' }],
      template: "import shlex\ncommand = 'ls -l {}'.format(shlex.quote({$name}))\nshlex.split(command)",
      cases: [
        { id: 'semi',  label: 'somefile; rm -rf ~', values: { name: 'somefile; rm -rf ~' } },
        { id: 'subst', label: '$(whoami)',          values: { name: '$(whoami).txt' } },
        { id: 'apos',  label: "it's",               values: { name: "it's.txt" } },
      ],
    },
  ],
  demoExplainer: "Only the 26 + 26 letters, ten digits and _@%+=:,./- count as safe — even an é triggers quoting (the test is ASCII-only). In the command tab the dangerous value always comes back as one argument: ; and $( ) inside single quotes are plain text to a POSIX shell.",

  patterns: [
    {
      name: 'Command for a remote shell',
      desc: 'From the docs: quote again when the whole command becomes one argument of another shell command.',
      code: "import shlex\ncommand = 'ls -l {}'.format(shlex.quote(filename))\nremote_command = 'ssh home {}'.format(shlex.quote(command))",
    },
    {
      name: 'Prefer a list when you run it yourself',
      desc: 'No shell, nothing to quote.',
      code: "import subprocess\nsubprocess.run(['ls', '-l', filename], check=True)",
    },
    {
      name: 'Environment variable assignment in a script',
      desc: 'Quote the value, never the variable name.',
      code: "import shlex\nline = f'export API_URL={shlex.quote(url)}'",
    },
  ],

  examples: [
    { title: 'Safe text is unchanged',   code: "import shlex\nshlex.quote('file.txt')", returns: "'file.txt'" },
    { title: 'Spaces get single quotes', code: "import shlex\nshlex.quote('My File.txt')", returns: "\"'My File.txt'\"" },
    { title: 'Apostrophe',               code: "import shlex\nprint(shlex.quote(\"it's\"))", returns: "'it'\"'\"'s'" },
    { title: 'Empty string',             code: "import shlex\nshlex.quote('')", returns: "\"''\"" },
    { title: 'Defusing a filename',      code: "import shlex\n'ls -l {}'.format(shlex.quote('somefile; rm -rf ~'))", returns: "\"ls -l 'somefile; rm -rf ~'\"" },
    { title: 'Quoting twice for ssh',    code: "import shlex\ncommand = 'ls -l {}'.format(shlex.quote('somefile; rm -rf ~'))\nprint('ssh home {}'.format(shlex.quote(command)))", returns: "ssh home 'ls -l '\"'\"'somefile; rm -rf ~'\"'\"''" },
    { title: 'Non-ASCII is quoted',      code: "import shlex\nshlex.quote('naïve')", returns: "\"'naïve'\"" },
  ],

  pitfalls: [
    {
      name: 'Quoting the whole command instead of each argument',
      desc: 'quote makes its input ONE token. Quote the pieces you insert, not the finished command line.',
      wrong: { label: 'quote(command)', code: "import shlex\nshlex.split(shlex.quote('ls -l /tmp'))", output: "['ls -l /tmp']" },
      fix:   { label: 'quote the value', code: "import shlex\nshlex.split('ls -l ' + shlex.quote('/tmp'))", output: "['ls', '-l', '/tmp']" },
    },
    {
      name: 'Passing a non-string',
      desc: 'quote runs a regex search on its argument, so ints and Path objects fail. Convert them with str() first.',
      wrong: { label: 'an int', code: "import shlex\nshlex.quote(42)", output: "TypeError: expected string or bytes-like object, got 'int'" },
      fix:   { label: 'str()', code: "import shlex\nshlex.quote(str(42))", output: "'42'" },
    },
  ],

  when: {
    use: [
      'A value must go into a string that a POSIX shell will parse (ssh, sh -c, generated scripts, Makefiles)',
      'Printing commands for users to copy',
    ],
    avoid: [
      'Running commands from Python → subprocess.run([...]) without shell=True',
      'Windows shells such as cmd.exe → the docs warn quote is not guaranteed correct on non-POSIX shells',
      'Several arguments at once → shlex.join',
    ],
  },

  notes: {
    cpython:     "_find_unsafe = re.compile(r'[^\\w@%+=:,./-]', re.ASCII).search; quote returns \"''\" for an empty string, s itself when nothing unsafe is found, else \"'\" + s.replace(\"'\", \"'\\\"'\\\"'\") + \"'\"",
    'History':   'Added to shlex in Python 3.3. It replaces the undocumented pipes.quote; the pipes module was removed in 3.13 (its 3.12 source simply did from shlex import quote)',
    'Leading -': "quote('-n') is '-n': a value that starts with - can still be read as an option by the program. Put -- before such arguments when the program supports it",
  },

  related: [
    { name: 'shlex.join',  slug: 'join',  when: 'Quote a whole argument list' },
    { name: 'shlex.split', slug: 'split', when: 'Check what a shell would see' },
    { name: 'subprocess.run', slug: 'run', when: 'Run without a shell — no quoting needed', category: 'stdlib/subprocess' },
    { name: 'shell=True',  slug: 'shell', when: 'Why string commands are risky', category: 'stdlib/subprocess' },
  ],

  faq: [
    {
      q: 'How do I escape a string for a shell command in Python?',
      a: "shlex.quote(value) returns the value wrapped in single quotes when it contains anything besides letters, digits and @%+=:,./-_ — e.g. 'ls -l ' + shlex.quote(filename). It targets POSIX shells (sh, bash, dash).",
    },
    {
      q: 'Does shlex.quote prevent shell injection?',
      a: "For POSIX shells, yes: the quoted value is a single literal token, so ;, |, $( ) and backticks inside it are not interpreted. The documentation warns it is not guaranteed for non-POSIX shells such as Windows cmd.exe. The safest option is still subprocess.run with a list and no shell.",
    },
    {
      q: 'What happened to pipes.quote?',
      a: 'pipes.quote was never documented; shlex.quote (Python 3.3+) is the public version, and later pipes versions just imported it from shlex. The pipes module was removed in Python 3.13 — the 3.13 release notes say to use shlex.quote() instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.quote',
    meta:  'shlex.quote',
  },
};
