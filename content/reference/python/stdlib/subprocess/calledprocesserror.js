// content/reference/python/stdlib/subprocess/calledprocesserror.js

export const meta = {
  slug:        'calledprocesserror',
  name:        'subprocess.CalledProcessError',
  signature:   'subprocess.CalledProcessError(returncode, cmd, output=None, stderr=None)',
  blurb:       'Raised when a command run with check=True (or by check_call / check_output) exits with a non-zero status. Carries the exit code, the command and any captured output.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (stdout, stderr attributes 3.5+)',
  searchTerms: 'subprocess.CalledProcessError CalledProcessError calledprocesserror CalledProcessError.stdout returned non-zero exit status 1 died with signal Signals.SIGKILL SIGTERM returncode cmd output stderr check=True check_output check_call command failed python',
};

export const method = {
  slug:      'calledprocesserror',
  name:      'subprocess.CalledProcessError',
  signature: 'subprocess.CalledProcessError(returncode, cmd, output=None, stderr=None)',

  category:    'subprocess exception',
  version:     'Python 3 (stdout, stderr attributes 3.5+)',
  hasLiveDemo: true,

  subtitle: 'The "your command failed" exception. Its message only says which command and which exit code — the useful part, what the program printed, is in e.stderr and e.stdout, and only if you captured them.',

  covers: ['CalledProcessError', 'CalledProcessError.stdout'],

  chain: ['BaseException', 'Exception', 'SubprocessError', 'CalledProcessError'],

  cheat: {
    raisedBy: 'run(..., check=True), check_call(), check_output(), CompletedProcess.check_returncode()',
    message:  "Command '['make', 'test']' returned non-zero exit status 2.",
    quickFix: 'capture_output=True, text=True — then show e.stderr',
    watchOut: 'A missing program raises FileNotFoundError, not this',
  },

  parameters: [
    { name: 'returncode', type: 'int', required: true,  default: null,   desc: 'The exit status. Negative values mean the child was killed by that signal (POSIX).' },
    { name: 'cmd',        type: 'list | str', required: true, default: null, desc: 'The command as it was passed to run() — it appears verbatim in the message.' },
    { name: 'output',     type: 'bytes | str | None', required: false, default: 'None', desc: 'Captured stdout (also readable as .stdout).' },
    { name: 'stderr',     type: 'bytes | str | None', required: false, default: 'None', desc: 'Captured stderr.' },
  ],

  modes: [
    {
      id: 'message',
      label: 'Message',
      blurb: 'Raise it with an exit code and a command, uncaught: the last traceback line is what you see in the console.',
      params: [
        { name: 'code', type: 'int',       hint: 'exit code (negative: signal)', input: 'number' },
        { name: 'cmd',  type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
      ],
      template: 'import subprocess\nraise subprocess.CalledProcessError({$code}, {$cmd})',
      cases: [
        { id: 'one',     label: 'exit 1',          values: { code: '1',   cmd: 'git,push' } },
        { id: 'two',     label: 'exit 2',          values: { code: '2',   cmd: 'make,test' } },
        { id: 'term',    label: 'killed: -15',     values: { code: '-15', cmd: 'server,--port,8000' } },
        { id: 'segv',    label: 'crashed: -11',    values: { code: '-11', cmd: './crashy' } },
        { id: 'unknown', label: 'unknown signal',  values: { code: '-99', cmd: 'job' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'What you can read from the exception object. stdout is the same value as output.',
      params: [
        { name: 'code', type: 'int',       hint: 'exit code',                    input: 'number' },
        { name: 'cmd',  type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'out',  type: 'str | None', hint: 'captured output (empty: None)', input: 'text-or-none' },
      ],
      template: 'import subprocess\ne = subprocess.CalledProcessError({$code}, {$cmd}, output={$out})\n(e.returncode, e.cmd, e.stdout, str(e))',
      cases: [
        { id: 'out',   label: 'with output', values: { code: '1', cmd: 'pytest,-x', out: '1 failed' } },
        { id: 'none',  label: 'not captured', values: { code: '3', cmd: 'backup.sh', out: '' } },
        { id: 'zero',  label: 'code 0',      values: { code: '0', cmd: 'true', out: '' } },
      ],
    },
  ],
  demoExplainer: 'For a code of 0 or more the message is "returned non-zero exit status N." — even for 0, since the class itself never checks. A negative code -N reads "died with <Signals.NAME: N>." when the signal module knows N, otherwise "died with unknown signal N.". Signal names differ by platform; this demo uses Linux\'s. Windows CPython only knows CTRL_C_EVENT 0, CTRL_BREAK_EVENT 1, SIGINT 2, SIGILL 4, SIGFPE 8, SIGSEGV 11, SIGTERM 15, SIGBREAK 21 and SIGABRT 22, so there -9 prints "unknown signal 9" and -22 is SIGABRT where Linux says SIGTTOU.',

  attributes: [
    { name: 'returncode', type: 'int',  meaning: 'Exit status of the child; -N for "killed by signal N" (POSIX).' },
    { name: 'cmd',        type: 'list | str', meaning: 'The command, exactly as passed.' },
    { name: 'output',     type: 'bytes | str | None', meaning: 'Captured stdout, or None.' },
    { name: 'stdout',     type: 'bytes | str | None', meaning: 'Alias of output (a property; setting it sets output).' },
    { name: 'stderr',     type: 'bytes | str | None', meaning: 'Captured stderr, or None.' },
    { name: 'args',       type: 'tuple', meaning: 'The positional constructor arguments — (returncode, cmd) when raised by run().' },
  ],

  patterns: [
    {
      name: 'Show the tool\'s own error message',
      desc: 'Capture stderr so the exception has something useful to report.',
      code: "import subprocess, sys\ntry:\n    subprocess.run(cmd, capture_output=True, text=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    sys.exit(f'{e.cmd[0]} failed ({e.returncode}): {e.stderr.strip()}')",
    },
    {
      name: 'Translate into your own exception',
      desc: 'raise ... from e keeps the original as __cause__ for the traceback.',
      code: "import subprocess\nclass DeployError(Exception):\n    pass\ntry:\n    subprocess.run(['./deploy.sh'], check=True)\nexcept subprocess.CalledProcessError as e:\n    raise DeployError(f'deploy failed with exit code {e.returncode}') from e",
    },
    {
      name: 'Treat some exit codes as answers',
      desc: 'grep exits 1 for "no match"; only higher codes are real errors.',
      code: "import subprocess\ntry:\n    out = subprocess.check_output(['grep', 'TODO', 'notes.txt'], text=True)\nexcept subprocess.CalledProcessError as e:\n    if e.returncode != 1:\n        raise\n    out = ''",
    },
  ],

  examples: [
    { title: 'Catch it and read the details', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; print(\"half done\"); sys.exit(3)'], capture_output=True, text=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.stdout, e.stderr, e.output is e.stdout)\nresult", returns: "(3, 'half done\\n', '', True)" },
    { title: 'The error text is in e.stderr', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(\"disk full\")'], capture_output=True, text=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    result = e.stderr\nresult", returns: "'disk full\\n'" },
    { title: 'Message for a list command',    code: "import subprocess\nstr(subprocess.CalledProcessError(2, ['make', 'test']))", returns: "\"Command '['make', 'test']' returned non-zero exit status 2.\"" },
    { title: 'Message for a shell string',    code: "import subprocess\nstr(subprocess.CalledProcessError(127, 'deploy.sh --prod'))", returns: "\"Command 'deploy.sh --prod' returned non-zero exit status 127.\"" },
    { title: 'Killed by a signal',            code: "import subprocess\nstr(subprocess.CalledProcessError(-11, ['./crashy']))", returns: "\"Command '['./crashy']' died with <Signals.SIGSEGV: 11>.\"" },
    { title: 'check_output keeps bytes in e.output', code: "import subprocess, sys\ntry:\n    subprocess.check_output([sys.executable, '-c', 'import sys; sys.stdout.write(\"oops\"); sys.exit(1)'])\nexcept subprocess.CalledProcessError as e:\n    result = e.output\nresult", returns: "b'oops'" },
    { title: 'args holds returncode and cmd', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(3)'], capture_output=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    result = (len(e.args), e.args[0], e.args[1][1:])\nresult", returns: "(2, 3, ['-c', 'import sys; sys.exit(3)'])" },
    { title: 'Wrap it in your own exception', code: "import subprocess, sys\nclass DeployError(Exception):\n    pass\ntry:\n    try:\n        subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'], check=True)\n    except subprocess.CalledProcessError as e:\n        raise DeployError(f'step failed (exit {e.returncode})') from e\nexcept DeployError as err:\n    result = (str(err), type(err.__cause__).__name__)\nresult", returns: "('step failed (exit 1)', 'CalledProcessError')" },
  ],

  pitfalls: [
    {
      name: 'Catching OSError for a failed command',
      desc: 'CalledProcessError is not an OSError — OSError (FileNotFoundError, PermissionError) is for a program that could not be started at all.',
      wrong: { label: 'except OSError', code: "import subprocess\ntry:\n    raise subprocess.CalledProcessError(1, ['git', 'push'])\nexcept OSError:\n    result = 'handled'\nresult", output: "subprocess.CalledProcessError: Command '['git', 'push']' returned non-zero exit status 1." },
      fix:   { label: 'except CalledProcessError', code: "import subprocess\ntry:\n    raise subprocess.CalledProcessError(1, ['git', 'push'])\nexcept subprocess.CalledProcessError as e:\n    result = f'handled exit {e.returncode}'\nresult", output: "'handled exit 1'" },
    },
    {
      name: 'No output captured, nothing to report',
      desc: 'check=True alone raises with stdout and stderr set to None; the error text went to the terminal. Capture it to keep it.',
      wrong: { label: 'check=True only', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(1)'], check=True)\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.stdout, e.stderr)\nresult", output: '(1, None, None)' },
      fix:   { label: 'capture_output=True', code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import sys; sys.exit(\"disk full\")'], capture_output=True, text=True, check=True)\nexcept subprocess.CalledProcessError as e:\n    result = (e.returncode, e.stderr)\nresult", output: "(1, 'disk full\\n')" },
    },
  ],

  when: {
    use: [
      'Stopping a script when a step fails (run(..., check=True))',
      'Reporting the exit code and error output of the failed command',
      'Raising it from a fake in tests of code that calls run()',
    ],
    avoid: [
      'Commands where non-zero codes are normal answers (grep, diff) → check returncode yourself',
      'Catching a missing executable → except FileNotFoundError / OSError',
      'Parsing str(e) — read e.returncode and e.cmd',
    ],
  },

  notes: {
    cpython:          'Lib/subprocess.py — class CalledProcessError(SubprocessError); __str__ formats "Command \'%s\' ..." with %d for the code; stdout is a property over output',
    'Signal names':   '__str__ calls signal.Signals(-returncode), so the names (and which numbers have one) follow the platform\'s signal module',
    'Exit status 0':  'Nothing stops you constructing it with 0; run(), check_call() and check_returncode() raise it only for non-zero codes',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'check=True raises it' },
    { name: 'check_output / check_call', slug: 'check_output', when: 'Always check' },
    { name: 'CompletedProcess', slug: 'completedprocess', when: 'check_returncode() raises it' },
    { name: 'SubprocessError', slug: 'subprocesserror', when: 'Its base class' },
    { name: 'TimeoutExpired', slug: 'timeoutexpired', when: 'The other subprocess exception' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Raised instead when the program does not exist', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "returned non-zero exit status 1" mean?',
      a: 'The command ran and finished, but reported failure: by convention 0 means success and anything else an error. The exception is raised because you used check=True, check_call or check_output. What went wrong is in the program\'s own output — capture it (capture_output=True, text=True) and read e.stderr.',
    },
    {
      q: 'What does "died with <Signals.SIGKILL: 9>" mean?',
      a: 'The child did not exit by itself: it was killed by signal 9 (SIGKILL) — by kill -9, by Popen.kill() elsewhere in your program, or by the operating system. Negative return codes only appear on POSIX; returncode is then -9.',
    },
    {
      q: 'How do I get the output of a command that failed?',
      a: 'From the exception: e.stdout (same as e.output) and e.stderr hold whatever was captured before the exit. check_output captures only stdout by default: add stderr=subprocess.PIPE to get e.stderr too, or stderr=subprocess.STDOUT to merge the errors into e.stdout.',
    },
    {
      q: 'Is CalledProcessError raised when the command does not exist?',
      a: 'No. A program that cannot be started raises FileNotFoundError (or PermissionError) from Popen. With shell=True the shell itself starts fine and reports "not found" through a non-zero exit code instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.CalledProcessError',
    meta:  'subprocess.CalledProcessError',
  },

};
