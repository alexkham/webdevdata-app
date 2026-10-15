// content/reference/python/stdlib/subprocess/index.js — the subprocess module hub

export const meta = {
  slug:        'index',
  name:        'subprocess',
  signature:   'import subprocess',
  blurb:       'Start other programs from Python, feed them input, capture their output and exit code: run() for almost everything, Popen for streaming and pipelines.',
  category:    'system',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3 (run() 3.5+)',
  searchTerms: 'subprocess module python run command execute shell command get output of command capture_output text check returncode popen check_output call check_call getoutput pipe stdout stderr devnull timeout shell=True external program child process exit code',
};

export const method = {
  slug: 'index',
  name: 'subprocess',

  category:    'System',
  version:     'Python 3 (run() 3.5+)',
  hasLiveDemo: true,

  subtitle: 'subprocess.run([program, arg, ...], capture_output=True, text=True, check=True) covers most needs: it waits, captures, decodes and raises on failure. Pass the command as a list and no shell is involved, so spaces and shell metacharacters in arguments are harmless.',

  // Popen, CompletedProcess and the two exceptions with attributes: every
  // name they define themselves counts toward coverage ('Popen.wait', ...).
  coverClasses: ['Popen', 'CompletedProcess', 'CalledProcessError', 'TimeoutExpired'],

  // Linux CPython (3.12, WSL) has 14 names in subprocess.__all__, all of
  // them also in the Windows list; the 3.13 Lib/subprocess.py adds nothing
  // to __all__ on POSIX. So no Linux-only public names exist.
  platformNames: [],

  imports: ['import subprocess', 'from subprocess import run, PIPE, CalledProcessError'],
  facts: [
    { label: 'Main API',     value: 'run, Popen, CompletedProcess, PIPE, STDOUT, DEVNULL, SubprocessError, CalledProcessError, TimeoutExpired' },
    { label: 'Older API',    value: 'call, check_call, check_output, getoutput, getstatusoutput' },
    { label: 'Windows only', value: 'STARTUPINFO and 20 constants (creation flags, priority classes, STARTF_*, SW_HIDE, STD_*_HANDLE)' },
    { label: 'Under the hood', value: 'CreateProcess on Windows; fork/exec, vfork or posix_spawn on POSIX' },
  ],

  modes: [
    {
      id: 'result',
      label: 'run() result',
      blurb: 'run() returns a CompletedProcess; with check=True a non-zero code raises the same CalledProcessError message that check_returncode() gives here. No process is started: the object is built from your values.',
      params: [
        { name: 'args', type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'code', type: 'int',       hint: 'exit code',                    input: 'number' },
        { name: 'out',  type: 'str | None', hint: 'captured stdout (empty: None)', input: 'text-or-none' },
      ],
      template: 'import subprocess\ndone = subprocess.CompletedProcess({$args}, {$code}, stdout={$out})\ndone.check_returncode()  # what check=True does\ndone',
      cases: [
        { id: 'ok',     label: 'success',          values: { args: 'git,status', code: '0', out: 'On branch main' } },
        { id: 'nocap',  label: 'not captured',     values: { args: 'ls,-l', code: '0', out: '' } },
        { id: 'failed', label: 'exit code 1',      values: { args: 'git,push', code: '1', out: '' } },
        { id: 'signal', label: 'killed (SIGTERM)', values: { args: 'server', code: '-15', out: '' } },
      ],
    },
    {
      id: 'cmdline',
      label: 'Windows command line',
      blurb: 'On Windows a list of arguments is joined into one command-line string with list2cmdline before CreateProcess sees it.',
      params: [{ name: 'args', type: 'list[str]', hint: 'arguments, comma-separated', input: 'csv' }],
      template: 'import subprocess\nsubprocess.list2cmdline({$args})',
      cases: [
        { id: 'space',  label: 'space in an argument', values: { args: 'git,commit,-m,fix the bug' } },
        { id: 'quote',  label: 'double quotes',        values: { args: 'echo,say "hi"' } },
        { id: 'slash',  label: 'trailing backslash',   values: { args: 'copy,C:\\My Files\\,D:\\backup' } },
        { id: 'empty',  label: 'empty argument',       values: { args: 'prog,,x' } },
      ],
    },
  ],
  demoExplainer: 'stdout and stderr appear in the repr only when they are not None, and None means the stream was not captured. A non-zero code raises CalledProcessError; a negative code -N means the child was killed by signal N (POSIX only), and the signal name is looked up in the Linux table here. In the command line, an argument that contains a space or tab, or is empty, gets double quotes; a literal double quote becomes \\" and backslashes are doubled only where a quote follows them — so the trailing backslash of C:\\My Files\\ is doubled in front of the closing quote.',

  patterns: [
    {
      name: 'Run, capture, fail loudly',
      desc: 'The everyday call: list of arguments, output as str, exception on a non-zero exit.',
      code: "import subprocess\nresult = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True, check=True)\ncommit = result.stdout.strip()",
    },
    {
      name: 'Start another Python reliably',
      desc: 'sys.executable is the interpreter running this code; -m runs an installed module.',
      code: "import subprocess, sys\nsubprocess.run([sys.executable, '-m', 'pip', 'install', 'requests'], check=True)",
    },
    {
      name: 'Give up after a timeout',
      desc: 'run() kills the child, waits for it, then re-raises TimeoutExpired.',
      code: "import subprocess\ntry:\n    subprocess.run(['ping', 'example.com'], timeout=10, capture_output=True)\nexcept subprocess.TimeoutExpired:\n    print('no answer within 10 s')",
    },
    {
      name: 'Report failures with the error output',
      desc: 'CalledProcessError carries stdout and stderr when they were captured.',
      code: "import subprocess\ntry:\n    subprocess.run(cmd, capture_output=True, text=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    print(f'exit {e.returncode}: {e.stderr.strip()}')",
    },
  ],

  examples: [
    { title: 'Run and capture the output',  code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(\"hello\")'], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(0, 'hello\\n')" },
    { title: 'A failing exit code is just a number', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(3)'])\nr.returncode", returns: '3' },
    { title: 'check=True turns it into an exception', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(2)'], check=True)\nexcept subprocess.CalledProcessError as e:\n    result = f'failed with exit code {e.returncode}'\nresult", returns: "'failed with exit code 2'" },
    { title: 'Send text to stdin with input=', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.stdin.read().upper())'], input='abc', capture_output=True, text=True)\nr.stdout", returns: "'ABC\\n'" },
    { title: 'List arguments reach the child unchanged', code: "import subprocess, sys\narg = 'a; rm -rf ~'\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv[1])', arg], capture_output=True, text=True)\nr.stdout", returns: "'a; rm -rf ~\\n'" },
    { title: 'The three stream constants', code: 'import subprocess\n(subprocess.PIPE, subprocess.STDOUT, subprocess.DEVNULL)', returns: '(-1, -2, -3)' },
    { title: 'What check=True raises',     code: "import subprocess\nstr(subprocess.CalledProcessError(2, ['make', 'test']))", returns: "\"Command '['make', 'test']' returned non-zero exit status 2.\"" },
  ],

  pitfalls: [
    {
      name: 'Expecting a str without text=True',
      desc: 'Captured output is bytes by default, so comparing it with a str is always False.',
      wrong: { label: 'bytes', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.stdout.write(\"hi\")'], capture_output=True)\n(r.stdout, r.stdout == 'hi')", output: "(b'hi', False)" },
      fix:   { label: 'text=True', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.stdout.write(\"hi\")'], capture_output=True, text=True)\n(r.stdout, r.stdout == 'hi')", output: "('hi', True)" },
    },
    {
      name: 'Ignoring the exit code',
      desc: 'run() does not raise for a failing command unless you ask it to.',
      wrong: { label: 'no check', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'])\n'deployed!'", output: "'deployed!'" },
      fix:   { label: 'check=True', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'], check=True)\n    result = 'deployed!'\nexcept subprocess.CalledProcessError as e:\n    result = f'deploy failed with exit code {e.returncode}'\nresult", output: "'deploy failed with exit code 1'" },
    },
    {
      name: 'Reading stdout without capturing it',
      desc: 'Without capture_output (or stdout=PIPE) the child writes straight to your terminal and r.stdout stays None.',
      wrong: { label: 'not captured', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'pass'])\nprint(r.stdout)", output: 'None' },
      fix:   { label: 'capture_output=True', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'pass'], capture_output=True, text=True)\nrepr(r.stdout)", output: "\"''\"" },
    },
  ],

  when: {
    use: [
      'Running command-line tools (git, ffmpeg, compilers) and reading their output',
      'Starting another Python interpreter: [sys.executable, "-m", module]',
      'Pipelines and long-running children you stream from → Popen',
    ],
    avoid: [
      'Things Python does itself: file copies (shutil), listing (os.listdir, pathlib), globbing (glob)',
      'Running Python functions in parallel → multiprocessing or concurrent.futures',
      'Many concurrent children inside async code → asyncio.create_subprocess_exec',
    ],
  },

  notes: {
    cpython:          'Lib/subprocess.py in pure Python; children are created by _winapi.CreateProcess on Windows and by _posixsubprocess.fork_exec (vfork when safe) or os.posix_spawn on POSIX',
    'No shell':       'Without shell=True no shell is started, so every character of an argument, shell metacharacters included, reaches the child literally. The documented exception: Windows may run .bat / .cmd files through cmd.exe anyway',
    'Availability':   'docs.python.org: not Android, not iOS, not WASI. On Emscripten, WASI, iOS, tvOS and watchOS the 3.13 Popen raises OSError ("<platform> does not support processes.")',
    'Windows names':  'STARTUPINFO and 20 constants exist only on Windows; Windows CPython 3.13 lists 35 names in __all__, Linux lists 14',
  },

  related: [
    { name: 'os module',     slug: 'os',         when: 'os.system, os.kill, environment variables', category: 'stdlib' },
    { name: 'os.system',     slug: 'system',     when: 'The old way: status only, no output', category: 'stdlib/os' },
    { name: 'sys module',    slug: 'sys',        when: 'sys.executable, sys.argv in the child', category: 'stdlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'What a missing program raises', category: 'exceptions' },
    { name: 'TimeoutError',  slug: 'timeouterror', when: 'Not what timeout= raises (TimeoutExpired is not a subclass)', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I run a command and get its output in Python?',
      a: 'subprocess.run(["git", "status"], capture_output=True, text=True).stdout gives the output as a str. Add check=True to get CalledProcessError when the command fails, and .strip() if you want to drop the trailing newline.',
    },
    {
      q: 'What is the difference between run, call, check_output and Popen?',
      a: 'run() (3.5+) is the general tool: it waits and returns a CompletedProcess with returncode, stdout and stderr. call returns just the exit code, check_call raises on failure, check_output returns stdout and raises on failure — all three are thin wrappers kept for older code. Popen starts the process and returns immediately, for streaming output, pipelines or talking to a running program.',
    },
    {
      q: 'Why is result.stdout None?',
      a: 'Output is only captured when you ask for it: capture_output=True, or stdout=subprocess.PIPE. Otherwise the child inherits your stdout and prints directly to the terminal, and run() has nothing to store.',
    },
    {
      q: 'Is shell=True dangerous?',
      a: 'Only when any part of the command string comes from outside: the shell interprets ; | & $ and quotes, so a crafted file name can run extra commands. Pass a list of arguments instead — no shell is involved and every argument arrives literally. If you need shell features with untrusted values, quote each value with shlex.quote (POSIX shells).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html',
    meta:  'subprocess — Subprocess management',
  },

};
