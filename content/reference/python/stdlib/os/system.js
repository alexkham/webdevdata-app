// content/reference/python/stdlib/os/system.js

export const meta = {
  slug:        'system',
  name:        'os.system',
  signature:   "os.system(command) / os.popen(cmd, mode='r', buffering=-1) / os.startfile(path[, operation][, arguments][, cwd][, show_cmd])",
  blurb:       'Run a shell command: system() returns only a status, popen() gives you a file to read its output from, startfile() opens a file with its Windows-associated app. subprocess replaces all three.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all versions); startfile arguments, cwd, show_cmd 3.10+',
  searchTerms: 'os.system system os.popen popen os.startfile startfile run shell command python execute command get output of command exit status return value 768 wait status subprocess.run shell=True open file default application',
};

export const method = {
  slug:      'system',
  name:      'os.system',
  signature: "os.system(command) / os.popen(cmd, mode='r', buffering=-1) / os.startfile(path[, operation][, arguments][, cwd][, show_cmd])",
  returns:   { type: 'int | file object | None', desc: 'system(): an exit status (wait status on Unix, exit code on Windows). popen(): a text file object connected to the command. startfile(): None, it returns as soon as the application is launched.' },

  category:    'os function',
  version:     'Python 3 (all versions); startfile arguments, cwd, show_cmd 3.10+',
  hasLiveDemo: false,

  subtitle: 'The old one-liners for running a shell command. os.system (Unix, Windows) cannot capture output and returns a platform-dependent status; os.popen (Unix, Windows) is a thin wrapper around subprocess.Popen with shell=True; os.startfile is Windows only. New code should use subprocess.run.',

  covers: ['system', 'popen', 'startfile'],

  cheat: {
    commonCall: "os.popen('git rev-parse HEAD').read()",
    returns:    'system: status int; popen: text file; startfile: None',
    replaces:   'subprocess.run(cmd, shell=True, capture_output=True, text=True) is the modern form',
    watchOut:   'system output goes straight to the console, not to a variable',
  },

  parameters: [
    { name: 'command',   type: 'str', required: true,  default: null,  desc: 'system(): the command line, run by the shell (/bin/sh on Unix, COMSPEC - usually cmd.exe - on Windows).' },
    { name: 'cmd',       type: 'str', required: true,  default: null,  desc: 'popen(): the command line, also run through the shell.' },
    { name: 'mode',      type: 'str', required: false, default: "'r'", desc: "popen(): 'r' to read the command's stdout, 'w' to write to its stdin. Anything else raises ValueError." },
    { name: 'buffering', type: 'int', required: false, default: '-1',  desc: 'popen(): same meaning as for open(); 0 (unbuffered) is rejected with ValueError.' },
    { name: 'path',      type: 'str | PathLike', required: true, default: null, desc: 'startfile(): the file or folder to open with its associated application (Windows only).' },
    { name: 'operation', type: 'str', required: false, default: null,  desc: "startfile(): a shell verb such as 'open', 'print', 'edit', 'explore' or 'find'." },
  ],

  patterns: [
    {
      name: 'Capture a command (modern form)',
      desc: 'subprocess.run with a list of arguments: no shell, output captured, exit code checked.',
      code: "import subprocess\nresult = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True, check=True)\ncommit = result.stdout.strip()",
    },
    {
      name: 'Read output the old way',
      desc: 'os.popen returns a text file; close() (or leaving the with block) waits for the command.',
      code: "import os\nwith os.popen('ls -l') as p:\n    listing = p.read()",
    },
    {
      name: 'Exit code from os.system on any OS',
      desc: 'On Unix the result is a wait status; waitstatus_to_exitcode decodes it. On Windows it already is the exit code.',
      code: "import os\nstatus = os.system('make build')\ncode = status if os.name == 'nt' else os.waitstatus_to_exitcode(status)",
    },
    {
      name: 'Open a file with its default app',
      desc: 'startfile is Windows only; macOS has the open command and most Linux desktops xdg-open.',
      code: "import os, subprocess, sys\nif sys.platform == 'win32':\n    os.startfile('report.pdf')\nelif sys.platform == 'darwin':\n    subprocess.run(['open', 'report.pdf'])\nelse:\n    subprocess.run(['xdg-open', 'report.pdf'])",
    },
  ],

  examples: [
    { title: "Read a command's output with popen", code: "import os, sys\nwith os.popen(f'\"{sys.executable}\" -c \"print(6*7)\"') as p:\n    out = p.read()\nout", returns: "'42\\n'" },
    { title: 'close() returns None on success',     code: "import os, sys\np = os.popen(f'\"{sys.executable}\" -c \"print(1)\"')\nout = p.read()\n(out, p.close())", returns: "('1\\n', None)" },
    { title: 'close() returns a status on failure', code: "import os, sys\np = os.popen(f'\"{sys.executable}\" -c \"raise SystemExit(3)\"')\np.read()\nstatus = p.close()\n(status is None, bool(status))", returns: '(False, True)' },
    { title: 'Turn that status into the exit code on any OS', code: "import os, sys\np = os.popen(f'\"{sys.executable}\" -c \"raise SystemExit(3)\"')\np.read()\nstatus = p.close()\nstatus if os.name == 'nt' else os.waitstatus_to_exitcode(status)", returns: '3' },
    { title: 'Output line by line',                 code: "import os, sys\nwith os.popen(f'\"{sys.executable}\" -c \"print(1); print(2)\"') as p:\n    lines = p.read().splitlines()\nlines", returns: "['1', '2']" },
    { title: 'The replacement: subprocess.run',     code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(6*7)'], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(0, '42\\n')" },
    { title: 'shell=True gives a plain exit code',  code: "import subprocess, sys\nr = subprocess.run(f'\"{sys.executable}\" -c \"raise SystemExit(3)\"', shell=True)\nr.returncode", returns: '3' },
  ],

  pitfalls: [
    {
      name: 'Testing close() against 0',
      desc: 'A successful popen command makes close() return None, not 0, so == 0 is False exactly when everything worked.',
      wrong: { label: '== 0', code: "import os, sys\np = os.popen(f'\"{sys.executable}\" -c \"print(1)\"')\np.read()\np.close() == 0", output: 'False' },
      fix:   { label: 'is None', code: "import os, sys\np = os.popen(f'\"{sys.executable}\" -c \"print(1)\"')\np.read()\np.close() is None", output: 'True' },
    },
    {
      name: 'Pasting user input into a shell command',
      desc: 'system() and popen() hand the whole string to the shell, so ; && | and quotes in the input become shell syntax. Pass a list to subprocess.run instead - each item reaches the program as one argument, untouched.',
      wrong: { label: 'string for the shell', code: "name = 'report.txt; echo hacked'\nf'cat {name}'", output: "'cat report.txt; echo hacked'" },
      fix:   { label: 'list, no shell', code: "import subprocess, sys\nname = 'report.txt; echo hacked'\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv[1:])', name], capture_output=True, text=True)\nr.stdout", output: "\"['report.txt; echo hacked']\\n\"" },
    },
  ],

  when: {
    use: [
      'Quick scripts where a shell one-liner is the point (pipes, globbing) and the input is trusted',
      'os.startfile: opening a document or folder the way a double click in Explorer would (Windows)',
    ],
    avoid: [
      'Capturing output, checking errors, timeouts → subprocess.run(..., capture_output=True, text=True, check=True)',
      'Anything containing user input → subprocess.run with a list of arguments, no shell',
      'Long-running or interactive children → subprocess.Popen',
    ],
  },

  notes: {
    cpython:        'os.system calls the C library system() (Modules/posixmodule.c). os.popen is Python code in Lib/os.py: subprocess.Popen(cmd, shell=True, text=True, ...) wrapped in os._wrap_close, whose close() waits for the process.',
    'Availability': 'system and popen: Unix, Windows (not WASI, Android or iOS). startfile: Windows only, so it does not exist on Linux or macOS.',
    'Return value': 'os.system on Unix returns the wait status, so exit code 3 comes back as 768 (3 << 8); on Windows it returns the exit code itself, 3. popen().close() follows the same rule and returns None for exit code 0.',
    'Output':       'os.system does not capture anything - the command writes to the same console as Python. That is also why the examples on this page never call it.',
    'startfile':    'Returns as soon as the application starts; there is no way to wait for it or read its exit status.',
  },

  related: [
    { name: 'os.spawnv',       slug: 'spawnv',  when: 'Start a program without a shell' },
    { name: 'os.waitpid / waitstatus_to_exitcode', slug: 'waitpid', when: 'Decode the Unix status that system() returns' },
    { name: 'os.execv',        slug: 'execv',   when: 'Replace the current process with a program' },
    { name: 'os.kill',         slug: 'kill',    when: 'Stop a process you started' },
    { name: 'os module',       slug: 'os',      when: 'Overview of the module', category: 'stdlib' },
    { name: 'OSError',         slug: 'oserror', when: 'What a failed process call raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples never call os.system?',
      a: 'os.system and os.popen exist on Unix and Windows (not WASI, Android or iOS), and os.startfile is Windows only. os.system lets the command write straight to the console, bypassing Python, so its output cannot be shown or captured; the examples use os.popen and subprocess with a Python child process instead, which behave the same on every OS.',
    },
    {
      q: 'Why does os.system return 768 instead of 3?',
      a: 'On Unix os.system returns a wait status: the exit code sits in the high byte, so exit code 3 becomes 3 << 8 = 768. os.waitstatus_to_exitcode(768) gives 3. On Windows os.system returns the exit code directly (3).',
    },
    {
      q: 'How do I get the output of os.system into a variable?',
      a: "You can't - os.system only returns the status. Use subprocess.run(cmd, capture_output=True, text=True).stdout, or os.popen(cmd).read() for a quick script.",
    },
    {
      q: 'os.system or subprocess - which should I use?',
      a: 'subprocess. The os docs themselves recommend it: subprocess.run captures output, raises on failure with check=True, supports timeouts and takes a list of arguments so no shell quoting is needed.',
    },
    {
      q: 'How do I open a file with its default program in Python?',
      a: "On Windows os.startfile(path). It does not exist on macOS or Linux, where you run the system opener instead: subprocess.run(['open', path]) on macOS, subprocess.run(['xdg-open', path]) on most Linux desktops.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.system',
    meta:  'os.system / popen / startfile',
  },
};
