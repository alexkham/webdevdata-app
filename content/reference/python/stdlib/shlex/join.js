// content/reference/python/stdlib/shlex/join.js — shlex.join

export const meta = {
  slug:        'join',
  name:        'shlex.join',
  signature:   'shlex.join(split_command)',
  blurb:       'Join a list of arguments into one shell-escaped command line — the inverse of shlex.split (3.8+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'shlex.join python join list of arguments into command string quote arguments print command line for shell copy paste log subprocess command inverse of shlex.split',
};

export const method = {
  slug:      'join',
  name:      'shlex.join',
  signature: 'shlex.join(split_command)',
  returns:   { type: 'str', desc: "' '.join(quote(arg) for arg in split_command)." },

  category:    'shlex function',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Every argument goes through shlex.quote and the results are joined with single spaces, so a POSIX shell — or shlex.split — turns the string back into exactly the same list.',

  covers: ['join'],

  cheat: {
    commonCall: "shlex.join(['ls', '-l', 'My Documents'])",
    returns:    "\"ls -l 'My Documents'\"",
    replaces:   "' '.join(args), which breaks on spaces and quotes",
    watchOut:   'POSIX shells only; every item must be a str',
  },

  parameters: [
    { name: 'split_command', type: 'iterable of str', required: true, default: null, desc: 'The arguments. Each one is passed to quote(), which requires a str.' },
  ],

  modes: [
    {
      id: 'join',
      label: 'join',
      blurb: 'Arguments in, command line out.',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import shlex\nshlex.join({$args})',
      cases: [
        { id: 'plain',  label: 'nothing to quote', values: { args: 'git, commit, -m, wip' } },
        { id: 'spaces', label: 'spaces',           values: { args: 'echo, -n, Multiple words' } },
        { id: 'apos',   label: 'apostrophe',       values: { args: "printf, it's done" } },
        { id: 'pipe',   label: 'shell syntax',     values: { args: 'grep, -e, a|b, x.log' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'split(join(args)) gives the list back.',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import shlex\nshlex.split(shlex.join({$args}))',
      cases: [
        { id: 'tricky', label: 'tricky values', values: { args: "a b, it's, $HOME, *.txt" } },
        { id: 'quotes', label: 'quotes',        values: { args: 'say, "hi", \'there\'' } },
      ],
    },
  ],
  demoExplainer: "Arguments made only of letters, digits and @%+=:,./-_ are left bare; anything else is wrapped in single quotes, so $HOME, * and | lose their meaning. A single quote inside an argument cannot be written within single quotes, so it is emitted as '\"'\"' — close the quote, a double-quoted ', reopen. split undoes all of it exactly.",

  patterns: [
    {
      name: 'Log the exact command you run',
      desc: 'The printed line can be pasted into a terminal to reproduce the call.',
      code: "import shlex, subprocess\nargs = ['ffmpeg', '-i', src, '-vf', 'scale=1280:-2', dst]\nprint('$', shlex.join(args))\nsubprocess.run(args, check=True)",
    },
    {
      name: 'Run a command remotely over ssh',
      desc: 'ssh hands the remote part to a shell: join it into one safely quoted string.',
      code: "import shlex, subprocess\nremote = shlex.join(['tar', '-czf', 'backup 2024.tgz', 'data/'])\nsubprocess.run(['ssh', 'server', remote], check=True)",
    },
    {
      name: 'Before 3.8',
      desc: 'join is just quote applied to every item.',
      code: "import shlex\ncmdline = ' '.join(shlex.quote(a) for a in args)",
    },
  ],

  examples: [
    { title: 'From the docs',        code: "import shlex\nshlex.join(['echo', '-n', 'Multiple words'])", returns: "\"echo -n 'Multiple words'\"" },
    { title: 'Empty argument',       code: "import shlex\nshlex.join(['cmd', '', 'x'])", returns: "\"cmd '' x\"" },
    { title: 'Apostrophe',           code: "import shlex\nprint(shlex.join(['echo', \"it's\"]))", returns: "echo 'it'\"'\"'s'" },
    { title: 'Round trip',           code: "import shlex\nargs = ['a b', \"it's\", '', '$x']\nshlex.split(shlex.join(args))", returns: "['a b', \"it's\", '', '$x']" },
    { title: 'Any iterable of str',  code: "import shlex\nshlex.join(('tar', '-xf', 'my archive.tar'))", returns: "\"tar -xf 'my archive.tar'\"" },
    { title: 'A string is an iterable too', code: "import shlex\nshlex.join('abc')", returns: "'a b c'" },
  ],

  pitfalls: [
    {
      name: 'Numbers and paths in the list',
      desc: 'quote() needs str. Convert ints and Path objects first (str() or os.fspath).',
      wrong: { label: 'an int', code: "import shlex\nshlex.join(['head', '-n', 5])", output: "TypeError: expected string or bytes-like object, got 'int'" },
      fix:   { label: 'map(str, ...)', code: "import shlex\nshlex.join(map(str, ['head', '-n', 5]))", output: "'head -n 5'" },
    },
    {
      name: "Using ' '.join for a command line",
      desc: 'A plain join loses the argument boundaries: the shell sees four words.',
      wrong: { label: "' '.join", code: "import shlex\nshlex.split(' '.join(['cp', 'my file.txt', 'dest']))", output: "['cp', 'my', 'file.txt', 'dest']" },
      fix:   { label: 'shlex.join', code: "import shlex\nshlex.split(shlex.join(['cp', 'my file.txt', 'dest']))", output: "['cp', 'my file.txt', 'dest']" },
    },
  ],

  when: {
    use: [
      'Showing or logging commands in copy-paste form',
      'Building the command string for ssh, sh -c, docker exec, crontab lines',
    ],
    avoid: [
      'Running a local command → subprocess.run(list) needs no joining',
      'Windows command lines → subprocess.list2cmdline (different rules)',
    ],
  },

  notes: {
    cpython:   "def join(split_command): return ' '.join(quote(arg) for arg in split_command)",
    'Safety':  'The documentation notes that the result is shell-escaped to protect against injection vulnerabilities (see quote) — for POSIX shells',
    'Added':   'Python 3.8',
  },

  related: [
    { name: 'shlex.quote', slug: 'quote', when: 'What join applies to each argument' },
    { name: 'shlex.split', slug: 'split', when: 'The inverse' },
    { name: 'subprocess.list2cmdline', slug: 'list2cmdline', when: 'Windows-style joining', category: 'stdlib/subprocess' },
    { name: 'shlex module', slug: 'shlex', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a list of arguments into a command string in Python?',
      a: "shlex.join(args) (Python 3.8+) quotes each argument as needed and joins them with spaces. On older versions: ' '.join(shlex.quote(a) for a in args).",
    },
    {
      q: 'What is the difference between shlex.join and subprocess.list2cmdline?',
      a: 'shlex.join quotes for POSIX shells with single quotes. subprocess.list2cmdline follows the Microsoft C runtime rules (double quotes, backslash handling) that Windows programs use to parse their command line.',
    },
    {
      q: 'Why does shlex.join produce such strange quoting for apostrophes?',
      a: "POSIX single quotes cannot contain a single quote at all, so it closes the quote, adds the apostrophe in double quotes and reopens: it's becomes 'it'\"'\"'s'. POSIX shells such as bash and dash read that back as it's, and so does shlex.split.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.join',
    meta:  'shlex.join',
  },
};
