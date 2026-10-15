// content/reference/python/stdlib/subprocess/getoutput.js

export const meta = {
  slug:        'getoutput',
  name:        'subprocess.getoutput',
  signature:   'subprocess.getoutput(cmd, *, encoding=None, errors=None) · subprocess.getstatusoutput(cmd, *, encoding=None, errors=None)',
  blurb:       'Run a command string through the shell and get its output (stdout and stderr together, one trailing newline removed) — getstatusoutput also returns the exit code. Never raises for a failing command.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (Windows 3.3.4+, encoding/errors 3.11+)',
  searchTerms: 'subprocess.getoutput getoutput subprocess.getstatusoutput getstatusoutput commands.getoutput shell command output string exit code tuple python 2 commands module quick shell command',
};

export const method = {
  slug:      'getoutput',
  name:      'subprocess.getoutput',
  signature: 'subprocess.getoutput(cmd, *, encoding=None, errors=None) · subprocess.getstatusoutput(cmd, *, encoding=None, errors=None)',
  returns:   { type: 'str · tuple[int, str]', desc: 'getoutput: the combined output. getstatusoutput: (exitcode, output).' },

  category:    'subprocess function',
  version:     'Python 3 (Windows 3.3.4+, encoding/errors 3.11+)',
  hasLiveDemo: false,

  subtitle: 'Legacy helpers from Python 2\'s commands module: always shell=True, always text, stderr merged into the output, exit code returned instead of raised. Handy for a quick one-off with a fixed command; for anything else use run().',

  covers: ['getoutput', 'getstatusoutput'],

  cheat: {
    commonCall: "code, out = subprocess.getstatusoutput('git status --short')",
    returns:    "(0, ' M README.md')",
    replaces:   'commands.getoutput / commands.getstatusoutput (Python 2)',
    watchOut:   'Always runs a shell — never put outside text in cmd',
  },

  parameters: [
    { name: 'cmd',      type: 'str', required: true,  default: null,   desc: 'A command line for the shell (/bin/sh or cmd.exe). It is run with shell=True, so quoting is up to you.' },
    { name: 'encoding', type: 'str', required: false, default: 'None', desc: 'Codec for decoding the output (locale encoding by default). 3.11+.' },
    { name: 'errors',   type: 'str', required: false, default: 'None', desc: 'Codec error handler, e.g. "replace". 3.11+.' },
  ],

  patterns: [
    {
      name: 'Quick shell one-liner with status',
      desc: 'Fixed command, no user input in it.',
      code: "import subprocess\ncode, out = subprocess.getstatusoutput('df -h /')\nif code != 0:\n    print('df failed:', out)",
    },
    {
      name: 'The run() equivalent',
      desc: 'Same result, without the legacy helper.',
      code: "import subprocess\nr = subprocess.run(cmd, shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)\ncode, out = r.returncode, r.stdout.removesuffix('\\n')",
    },
    {
      name: 'Decode output that is not in the locale encoding',
      desc: 'encoding= and errors= (3.11+).',
      code: "import subprocess\nout = subprocess.getoutput('cat notes.txt', encoding='utf-8', errors='replace')",
    },
  ],

  examples: [
    { title: 'Output and exit code',          code: "import subprocess, sys\nsubprocess.getstatusoutput(f'\"{sys.executable}\" -c \"print(42)\"')", returns: "(0, '42')" },
    { title: 'Failure is a code, not an exception', code: "import subprocess, sys\ncode, out = subprocess.getstatusoutput(f'\"{sys.executable}\" -c \"import sys; print(\\'half\\'); sys.exit(2)\"')\n(code, out)", returns: "(2, 'half')" },
    { title: 'stderr is part of the output',  code: "import subprocess, sys\nsubprocess.getstatusoutput(f'\"{sys.executable}\" -c \"import sys; sys.stderr.write(\\'oops\\')\"')", returns: "(0, 'oops')" },
    { title: 'getoutput: just the text',      code: "import subprocess, sys\nsubprocess.getoutput(f'\"{sys.executable}\" -c \"print(6 * 7)\"')", returns: "'42'" },
    { title: 'A shell built-in works',        code: "import subprocess\nsubprocess.getstatusoutput('echo hello')", returns: "(0, 'hello')" },
    { title: 'The shell\'s own exit',          code: "import subprocess\nsubprocess.getstatusoutput('exit 3')", returns: "(3, '')" },
    { title: 'A missing command',             code: "import subprocess\nsubprocess.getstatusoutput('no-such-program-xyz')[0] != 0", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Building cmd from outside text',
      desc: 'The string goes to a shell, so && (and ; | $( ) on POSIX) in a value start new commands. Pass the value as a list element to run() instead.',
      wrong: { label: 'getoutput', code: "import subprocess\nname = 'notes&&echo INJECTED'\nsubprocess.getoutput('echo ' + name)", output: "'notes\\nINJECTED'" },
      fix:   { label: 'run() with a list', code: "import subprocess, sys\nname = 'notes&&echo INJECTED'\nsubprocess.run([sys.executable, '-c', 'import sys; print(sys.argv[1])', name], capture_output=True, text=True).stdout.strip()", output: "'notes&&echo INJECTED'" },
    },
    {
      name: 'Expecting all trailing newlines to go',
      desc: 'Exactly one trailing newline is removed. Blank lines at the end stay.',
      wrong: { label: 'getoutput', code: "import subprocess, sys\nsubprocess.getoutput(f'\"{sys.executable}\" -c \"print(\\'a\\'); print()\"')", output: "'a\\n'" },
      fix:   { label: ".rstrip('\\n')", code: "import subprocess, sys\nsubprocess.getoutput(f'\"{sys.executable}\" -c \"print(\\'a\\'); print()\"').rstrip('\\n')", output: "'a'" },
    },
  ],

  when: {
    use: [
      'Quick scripts with a fixed shell command',
      'Porting Python 2 code that used the commands module',
    ],
    avoid: [
      'Commands containing any outside input → run() with a list',
      'Separating stdout from stderr → run(capture_output=True)',
      'Failing loudly on errors → run(check=True)',
    ],
  },

  notes: {
    cpython:       'getstatusoutput: check_output(cmd, shell=True, text=True, stderr=STDOUT, encoding=encoding, errors=errors), catching CalledProcessError for the code; strips one trailing \\n. getoutput returns its [1]',
    'Exit code':   'Since 3.3.4 the first item is the same value as Popen.returncode (it was a raw wait status in 3.3.3 and earlier)',
    'Platforms':   'A missing command gave (127, "/bin/sh: 1: no-such-program-xyz: not found") with /bin/sh on Linux and exit code 1 plus cmd.exe\'s "is not recognized" message on Windows',
    'List cmd':    "cmd should be a str. A list ['echo', 'hi'] gave '' on Linux (sh -c runs only 'echo') but 'hi' on Windows",
  },

  related: [
    { name: 'shell=True', slug: 'shell', when: 'What these always use — and its risks' },
    { name: 'subprocess.run', slug: 'run', when: 'The general replacement' },
    { name: 'check_output', slug: 'check_output', when: 'What getstatusoutput calls' },
    { name: 'os.system', slug: 'system', when: 'Shell command, status only', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'Both functions start a real shell (/bin/sh or cmd.exe), which a browser cannot do, and shells word their error messages differently. The examples stick to commands whose output is the same with both shells.',
    },
    {
      q: 'What is the difference between getoutput and getstatusoutput?',
      a: 'getstatusoutput returns (exitcode, output); getoutput returns only the output and discards the code. Both run the string through the shell and merge stderr into the output.',
    },
    {
      q: 'Does subprocess.getoutput raise an exception if the command fails?',
      a: 'No. A failing command still returns its output; getstatusoutput tells you the exit code. Only a failure to start the shell itself would raise.',
    },
    {
      q: 'Is subprocess.getoutput deprecated?',
      a: 'No, but the docs call these "legacy shell invocation functions" and note that none of the module\'s security and exception-handling guarantees apply to them. run() is the recommended interface.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.getoutput',
    meta:  'subprocess.getoutput / getstatusoutput',
  },

};
