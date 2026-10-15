// content/reference/python/stdlib/subprocess/shell.js

export const meta = {
  slug:        'shell',
  name:        'subprocess shell=True',
  signature:   'subprocess.run(command_string, shell=True, ...)',
  blurb:       'shell=True runs a command string through /bin/sh or cmd.exe — pipes, wildcards and variables work, and so does shell injection when any part of the string comes from outside.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (Windows shell lookup changed in 3.12)',
  searchTerms: 'subprocess shell=True shell injection security run shell command string shlex.quote shlex.split shlex.join /bin/sh -c cmd.exe /c COMSPEC pipes wildcards command injection python subprocess list vs string',
};

export const method = {
  slug:      'shell',
  name:      'subprocess shell=True',
  signature: 'subprocess.run(command_string, shell=True, ...)',
  returns:   { type: 'CompletedProcess', desc: 'Same as without the shell — but returncode and output are now those of the shell process.' },

  category:    'subprocess parameter',
  version:     'Python 3 (Windows shell lookup changed in 3.12)',
  hasLiveDemo: true,

  subtitle: "With a list and no shell, every argument reaches the program exactly as written. With shell=True you hand one string to a shell, which splits it, expands $VARS and *, and runs anything after ; & or |. Never build that string from user input — or quote each piece with shlex.quote.",

  // shell is a parameter of Popen / run, not a public name of the module
  covers: [],

  cheat: {
    commonCall: "subprocess.run('ls *.py | wc -l', shell=True, capture_output=True, text=True)",
    returns:    'CompletedProcess of the shell',
    replaces:   'os.system(command)',
    watchOut:   "'cat ' + filename runs whatever the file name says",
  },

  parameters: [
    { name: 'args',  type: 'str', required: true,  default: null,    desc: 'The command line, written exactly as you would type it at the shell prompt (quoting included).' },
    { name: 'shell', type: 'bool', required: false, default: 'False', desc: "POSIX: run ['/bin/sh', '-c', args]. Windows: run '%COMSPEC% /c \"args\"' (cmd.exe)." },
    { name: 'executable', type: 'str', required: false, default: 'None', desc: 'POSIX: a different shell instead of /bin/sh, e.g. /bin/bash.' },
  ],

  modes: [
    {
      id: 'quote',
      label: 'build a command',
      blurb: 'A file name from somewhere else goes into a shell command. Compare plain concatenation with shlex.quote. Nothing is run — this only builds the strings.',
      params: [{ name: 'name', type: 'str', hint: 'a file name (maybe hostile)', input: 'text' }],
      template: "import shlex\nfilename = {$name}\n{'unsafe': 'cat ' + filename, 'safe': 'cat ' + shlex.quote(filename)}",
      cases: [
        { id: 'plain',  label: 'plain name',    values: { name: 'report.txt' } },
        { id: 'space',  label: 'space',         values: { name: 'my notes.txt' } },
        { id: 'inject', label: 'injection',     values: { name: 'x; rm -rf ~' } },
        { id: 'subst',  label: '$(command)',    values: { name: '$(whoami).txt' } },
        { id: 'apos',   label: 'apostrophe',    values: { name: "it's.txt" } },
      ],
    },
    {
      id: 'join',
      label: 'shlex.join',
      blurb: 'Turn a whole argument list into one safely quoted POSIX command line.',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import shlex\nshlex.join({$args})',
      cases: [
        { id: 'cp',   label: 'cp with spaces', values: { args: 'cp,my file.txt,backup/' } },
        { id: 'vars', label: '$HOME and *',    values: { args: 'echo,$HOME,*.py' } },
        { id: 'safe', label: 'nothing to quote', values: { args: 'git,log,-1,--format=%H' } },
      ],
    },
  ],
  demoExplainer: "shlex.quote returns '' for an empty string and leaves any other string alone when it consists only of ASCII letters, digits and @ % + = : , . / - _; anything else is wrapped in single quotes, inside which a POSIX shell treats every character literally. A single quote itself cannot appear inside single quotes, so it becomes '\"'\"' — close, a double-quoted ', reopen. These rules are for POSIX shells: cmd.exe does not treat single quotes as quoting (on Windows, echo 'a b' printed the quotes too).",

  patterns: [
    {
      name: 'No shell: a list',
      desc: 'The safe default — each element is one argument, nothing is interpreted.',
      code: "import subprocess\nsubprocess.run(['grep', '-r', pattern, 'src/'], check=True)",
    },
    {
      name: 'Shell features with quoted values',
      desc: 'Keep the pipe, quote the untrusted part.',
      code: "import shlex, subprocess\nsubprocess.run(f'grep -r {shlex.quote(pattern)} src/ | wc -l', shell=True, check=True)",
    },
    {
      name: 'A pipeline without a shell',
      desc: 'Connect two Popen objects; close the first stdout in the parent so it gets SIGPIPE if the second exits.',
      code: "import subprocess\np1 = subprocess.Popen(['dmesg'], stdout=subprocess.PIPE)\np2 = subprocess.Popen(['grep', 'hda'], stdin=p1.stdout, stdout=subprocess.PIPE)\np1.stdout.close()\noutput = p2.communicate()[0]",
    },
    {
      name: 'Shell-like features in Python',
      desc: 'Most reasons for shell=True have a safer Python equivalent.',
      code: "import glob, os, shutil\nfiles = glob.glob('*.py')            # instead of *.py\nhome = os.path.expanduser('~')       # instead of ~\nshutil.copy('a.txt', 'backup/')      # instead of cp",
    },
  ],

  examples: [
    { title: 'A shell built-in',                code: "import subprocess\nsubprocess.run('echo hello', shell=True, capture_output=True, text=True).stdout", returns: "'hello\\n'" },
    { title: 'The returncode is the shell\'s',  code: "import subprocess\nsubprocess.run('exit 7', shell=True).returncode", returns: '7' },
    { title: 'A quoted command string',         code: "import subprocess, sys\nsubprocess.run(f'\"{sys.executable}\" -c \"print(1 + 1)\"', shell=True, capture_output=True, text=True).stdout", returns: "'2\\n'" },
    { title: 'A list needs no quoting at all',  code: "import subprocess, sys\narg = 'a; rm -rf ~'\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv[1])', arg], capture_output=True, text=True)\nr.stdout", returns: "'a; rm -rf ~\\n'" },
    { title: 'shlex.quote',                     code: "import shlex\n[shlex.quote(s) for s in ['report.txt', 'my file.txt', '', '$HOME']]", returns: "['report.txt', \"'my file.txt'\", \"''\", \"'$HOME'\"]" },
    { title: 'An apostrophe in a quoted name',  code: "import shlex\nshlex.quote(\"it's\")", returns: "'\\'it\\'\"\\'\"\\'s\\''" },
    { title: 'shlex.split: a command line → list', code: "import shlex\nshlex.split('cp \"my file.txt\" backup/')", returns: "['cp', 'my file.txt', 'backup/']" },
    { title: 'shlex.join: list → command line', code: "import shlex\nshlex.join(['cp', 'my file.txt', 'backup/'])", returns: "\"cp 'my file.txt' backup/\"" },
  ],

  pitfalls: [
    {
      name: 'Pasting outside text into a command string',
      desc: 'Whatever the string says, the shell runs. As a list element the same text is just one argument.',
      wrong: { label: 'concatenation', code: "filename = 'notes.txt; rm -rf ~'\n'cat ' + filename", output: "'cat notes.txt; rm -rf ~'" },
      fix:   { label: 'list', code: "filename = 'notes.txt; rm -rf ~'\n['cat', filename]", output: "['cat', 'notes.txt; rm -rf ~']" },
    },
    {
      name: 'Expecting FileNotFoundError through the shell',
      desc: 'With shell=True the shell starts fine and reports "not found" itself, through a non-zero exit code and a message on stderr.',
      wrong: { label: 'shell=True', code: "import subprocess\ntry:\n    r = subprocess.run('no-such-program-xyz', shell=True, capture_output=True)\n    result = f'no exception; returncode != 0: {r.returncode != 0}'\nexcept FileNotFoundError:\n    result = 'FileNotFoundError'\nresult", output: "'no exception; returncode != 0: True'" },
      fix:   { label: 'list, no shell', code: "import subprocess\ntry:\n    r = subprocess.run(['no-such-program-xyz'], capture_output=True)\n    result = f'no exception; returncode != 0: {r.returncode != 0}'\nexcept FileNotFoundError:\n    result = 'FileNotFoundError'\nresult", output: "'FileNotFoundError'" },
    },
  ],

  when: {
    use: [
      'Your own fixed command strings that need pipes, redirection or wildcards',
      'Windows built-in commands (dir, copy) that are not programs',
    ],
    avoid: [
      'Any command that contains user input, file names or data → pass a list',
      'Running a program with arguments → a list (works the same on every OS)',
      'Wildcards, ~ and $VARS → glob, os.path.expanduser, os.environ',
    ],
  },

  notes: {
    cpython:       "POSIX: args becomes ['/bin/sh', '-c', args, ...] (the first list item is the command, further items become $0, $1 ...). Windows: '{comspec} /c \"{args}\"' with the window hidden (SW_HIDE)",
    'List + shell': "On POSIX a list with shell=True passes only its first item as the command: ['echo', 'hi'] printed an empty line on Linux, while Windows joined the list and printed hi",
    'Exit codes':  'A command the shell cannot find gave returncode 127 with /bin/sh on Linux and 1 with cmd.exe on Windows',
    'Windows':     'Since 3.12 the shell is %COMSPEC% or %SystemRoot%\\System32\\cmd.exe — never a cmd.exe from the current directory. Batch files (.bat, .cmd) may be run through cmd.exe even without shell=True',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'Pass a list instead' },
    { name: 'list2cmdline', slug: 'list2cmdline', when: 'How a list is quoted on Windows' },
    { name: 'getoutput', slug: 'getoutput', when: 'Always uses the shell' },
    { name: 'Popen', slug: 'popen', when: 'Pipelines without a shell' },
    { name: 'os.system', slug: 'system', when: 'Also runs a shell', category: 'stdlib/os' },
    { name: 'os.path.expanduser', slug: 'expanduser', when: '~ without a shell', category: 'stdlib/os-path' },
  ],

  faq: [
    {
      q: 'What does shell=True do in subprocess?',
      a: 'It runs the command through a shell — /bin/sh -c on POSIX, cmd.exe /c on Windows — so the string can use pipes, redirection, wildcards and variables. Without it, subprocess starts the program directly and passes each list element as one argument.',
    },
    {
      q: 'Why is shell=True a security risk?',
      a: 'The shell interprets the whole string. If a value inside it comes from a user, a file name or a web request, characters like ; | & $( ) can start other commands (shell injection). The docs make quoting your responsibility; a list of arguments avoids the problem entirely.',
    },
    {
      q: 'When do I need shell=True on Windows?',
      a: 'Only for commands built into cmd.exe, such as dir or copy. Console programs and batch files run without it.',
    },
    {
      q: 'How do I convert a shell command string into a list?',
      a: 'shlex.split("cp \\"my file.txt\\" backup/") gives ["cp", "my file.txt", "backup/"] using POSIX shell rules. Write the list directly in new code; shlex.split is for strings you already have.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#security-considerations',
    meta:  'subprocess — Security Considerations',
  },

};
