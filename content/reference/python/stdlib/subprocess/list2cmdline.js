// content/reference/python/stdlib/subprocess/list2cmdline.js

export const meta = {
  slug:        'list2cmdline',
  name:        'subprocess.list2cmdline',
  signature:   'subprocess.list2cmdline(seq)',
  blurb:       'How Popen turns an argument list into one Windows command line: quotes around arguments with spaces, tabs or nothing in them, \\" for quotes, backslashes doubled only before a quote.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (internal helper, not in __all__)',
  searchTerms: 'subprocess.list2cmdline list2cmdline windows command line quoting escape arguments CreateProcess MS C runtime argv backslash double quote convert list to command string shlex.join windows',
};

export const method = {
  slug:      'list2cmdline',
  name:      'subprocess.list2cmdline',
  signature: 'subprocess.list2cmdline(seq)',
  returns:   { type: 'str', desc: 'One command-line string that the Microsoft C runtime splits back into exactly the arguments of seq.' },

  category:    'subprocess function',
  version:     'Python 3 (internal helper, not in __all__)',
  hasLiveDemo: true,

  subtitle: 'Windows has no argv: CreateProcess takes a single string, and each program splits it again (usually with the Microsoft C runtime rules). list2cmdline is the inverse of those rules. It is deliberately left out of __all__ — an implementation detail you can still call to see what Windows will receive.',

  // list2cmdline is excluded from subprocess.__all__ on purpose
  // (Lib/subprocess.py: "considered an internal implementation detail",
  // issue10838), so this page claims no public name.
  covers: [],

  cheat: {
    commonCall: "subprocess.list2cmdline(['git', 'commit', '-m', 'fix the bug'])",
    returns:    "'git commit -m \"fix the bug\"'",
    replaces:   'Hand-quoting Windows command lines',
    watchOut:   'Pass a list: a str is split into single characters',
  },

  parameters: [
    { name: 'seq', type: 'iterable of str | bytes | path-like', required: true, default: null, desc: 'The arguments. Each item goes through os.fsdecode, so bytes and paths work; anything else is a TypeError.' },
  ],

  modes: [
    {
      id: 'list',
      label: 'list',
      blurb: 'Type the arguments, comma-separated, and see the command line CreateProcess would get.',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import subprocess\nsubprocess.list2cmdline({$args})',
      cases: [
        { id: 'space',  label: 'space',              values: { args: 'git,commit,-m,fix the bug' } },
        { id: 'quote',  label: 'double quotes',      values: { args: 'echo,say "hi"' } },
        { id: 'trail',  label: 'folder\\ with space', values: { args: 'copy,C:\\My Files\\,D:\\backup' } },
        { id: 'bsq',    label: 'backslash + quote',  values: { args: 'prog,a\\"b,c\\\\"d' } },
        { id: 'empty',  label: 'empty argument',     values: { args: 'prog,,x' } },
        { id: 'meta',   label: 'cmd.exe symbols',    values: { args: 'echo,a&b,%PATH%' } },
      ],
    },
    {
      id: 'string',
      label: 'a str by mistake',
      blurb: 'A str is iterated like any sequence — one character per argument.',
      params: [{ name: 'text', type: 'str', hint: 'a whole command line', input: 'text' }],
      template: 'import subprocess\nsubprocess.list2cmdline({$text})',
      cases: [
        { id: 'dir',  label: 'dir /b',  values: { text: 'dir /b' } },
        { id: 'word', label: 'ping',    values: { text: 'ping' } },
      ],
    },
  ],
  demoExplainer: 'An argument is wrapped in double quotes only if it contains a space or a tab or is empty. A double quote inside becomes \\", and the backslashes right before it are doubled — so a\\"b becomes a\\\\\\"b. Backslashes anywhere else stay single, except the ones at the very end of a quoted argument, which are doubled so they do not escape the closing quote. cmd.exe symbols such as & and % pass through untouched: the rules are for the C runtime, not for the shell.',

  patterns: [
    {
      name: 'Log the exact Windows command line',
      desc: 'What Popen will hand to CreateProcess for a list (without shell=True).',
      code: "import subprocess\nlog.info('running %s', subprocess.list2cmdline(args))",
    },
    {
      name: 'Display a command portably',
      desc: 'shlex.join for POSIX shells, list2cmdline for Windows.',
      code: "import os, shlex, subprocess\nshown = subprocess.list2cmdline(args) if os.name == 'nt' else shlex.join(args)",
    },
  ],

  examples: [
    { title: 'Spaces get quotes',              code: "import subprocess\nsubprocess.list2cmdline(['git', 'commit', '-m', 'fix the bug'])", returns: "'git commit -m \"fix the bug\"'" },
    { title: 'Quotes get a backslash',         code: "import subprocess\nsubprocess.list2cmdline(['echo', 'say \"hi\"'])", returns: "'echo \"say \\\\\"hi\\\\\"\"'" },
    { title: 'Trailing backslash is doubled',  code: "import subprocess\nsubprocess.list2cmdline(['copy', 'C:\\\\My Files\\\\', 'D:\\\\backup'])", returns: "'copy \"C:\\\\My Files\\\\\\\\\" D:\\\\backup'" },
    { title: 'Empty arguments survive',        code: "import subprocess\nsubprocess.list2cmdline(['prog', '', 'x'])", returns: "'prog \"\" x'" },
    { title: 'bytes and paths are accepted',   code: "import subprocess\nfrom pathlib import PurePosixPath\nsubprocess.list2cmdline([b'bytes arg', PurePosixPath('my dir/run.py')])", returns: "'\"bytes arg\" \"my dir/run.py\"'" },
    { title: 'Other types are not',            code: "import subprocess\nsubprocess.list2cmdline(['python', 3])", returns: 'TypeError: expected str, bytes or os.PathLike object, not int' },
    { title: 'The child gets the list back',   code: "import subprocess, sys\nargs = ['a b', 'c\"d', 'e\\\\', 'f\\\\\"g', '']\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv[1:])', *args], capture_output=True, text=True)\nr.stdout.strip() == repr(args)", returns: 'True' },
    { title: 'Not part of __all__',            code: "import subprocess\n'list2cmdline' in subprocess.__all__", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Passing a whole command string',
      desc: 'list2cmdline iterates its argument, so a str becomes one argument per character.',
      wrong: { label: 'str', code: "import subprocess\nsubprocess.list2cmdline('dir /b')", output: "'d i r \" \" / b'" },
      fix:   { label: 'list', code: "import subprocess\nsubprocess.list2cmdline(['dir', '/b'])", output: "'dir /b'" },
    },
    {
      name: 'Using POSIX quoting for Windows',
      desc: "shlex.join quotes for /bin/sh with single quotes, which mean nothing to the Windows C runtime. Each side has its own rules.",
      wrong: { label: 'shlex.join', code: "import shlex\nshlex.join(['echo', \"it's here\"])", output: "'echo \\'it\\'\"\\'\"\\'s here\\''" },
      fix:   { label: 'list2cmdline', code: "import subprocess\nsubprocess.list2cmdline(['echo', \"it's here\"])", output: "'echo \"it\\'s here\"'" },
    },
  ],

  when: {
    use: [
      'Seeing (or logging) the command line a list becomes on Windows',
      'Building a command line for another Windows API that takes one string',
    ],
    avoid: [
      'Building commands for shell=True or cmd.exe — & | % ^ are not escaped',
      'POSIX shells → shlex.quote / shlex.join',
      'Splitting a command line → shlex.split (POSIX rules only)',
    ],
  },

  notes: {
    cpython:       'Lib/subprocess.py, called by the Windows Popen._execute_child for any args that is not a str; documented in "Converting an argument sequence to a string on Windows"',
    'Rules':       'Arguments are separated by spaces or tabs; quotes group; \\" is a literal quote; backslashes are literal unless they precede a quote, where each pair is one backslash',
    'Not public':  'Excluded from __all__ on purpose ("an internal implementation detail", issue10838) — it works, but is not a documented API',
    'Programs':    'Programs that split their command line with the Microsoft C runtime rules — python.exe among them — get the list back exactly; a program with its own parser may not',
  },

  related: [
    { name: 'shell=True', slug: 'shell', when: 'Quoting for the shell instead' },
    { name: 'Popen', slug: 'popen', when: 'Calls it for list args on Windows' },
    { name: 'subprocess.run', slug: 'run', when: 'Pass the list here' },
    { name: 'sys.argv', slug: 'argv', when: 'What the child sees', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'How does Python pass a list of arguments to a program on Windows?',
      a: 'Windows processes receive one command-line string, so Popen joins the list with list2cmdline: quotes around arguments with spaces, tabs or no characters, \\" for embedded quotes, and backslashes doubled only before a quote. A program using the Microsoft C runtime splits it back into the same list.',
    },
    {
      q: 'Is subprocess.list2cmdline public?',
      a: 'It is callable but deliberately not in subprocess.__all__ and has no entry of its own in the docs; the rules it implements are documented under "Converting an argument sequence to a string on Windows".',
    },
    {
      q: 'Does list2cmdline make a string safe for cmd.exe?',
      a: 'No. It quotes for the C runtime argument parser only and leaves & | < > ^ % alone. Run through cmd.exe (shell=True) on Windows, the line from list2cmdline(["echo", "x&echo", "injected"]) printed x and then injected: & started a second command. Avoid shell=True with untrusted values.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#converting-an-argument-sequence-to-a-string-on-windows',
    meta:  'Converting an argument sequence to a string on Windows',
  },

};
