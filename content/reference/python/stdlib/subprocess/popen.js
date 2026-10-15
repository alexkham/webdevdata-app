// content/reference/python/stdlib/subprocess/popen.js

export const meta = {
  slug:        'popen',
  name:        'subprocess.Popen',
  signature:   'subprocess.Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=True, shell=False, cwd=None, env=None, universal_newlines=None, startupinfo=None, creationflags=0, restore_signals=True, start_new_session=False, pass_fds=(), *, group=None, extra_groups=None, user=None, umask=-1, encoding=None, errors=None, text=None, pipesize=-1, process_group=None)',
  blurb:       'Start a program and get a handle to the running process right away: pipes to its stdin/stdout/stderr, its pid, and methods to wait, poll, communicate or kill.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3 (context manager 3.2+, text 3.7+)',
  searchTerms: 'subprocess.Popen popen Popen.universal_newlines universal_newlines text_mode start process in background non-blocking stream output line by line pipeline pid stdin stdout stderr with Popen context manager python run in background',
};

export const method = {
  slug:      'popen',
  name:      'subprocess.Popen',
  signature: 'subprocess.Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=True, shell=False, cwd=None, env=None, universal_newlines=None, startupinfo=None, creationflags=0, restore_signals=True, start_new_session=False, pass_fds=(), *, group=None, extra_groups=None, user=None, umask=-1, encoding=None, errors=None, text=None, pipesize=-1, process_group=None)',
  returns:   { type: 'Popen', desc: 'The running process: args, pid, returncode (None while running), stdin / stdout / stderr streams for each PIPE.' },

  category:    'subprocess class',
  version:     'Python 3 (context manager 3.2+, text 3.7+)',
  hasLiveDemo: false,

  subtitle: 'run() is built on Popen. Use Popen directly when you need the process while it runs: read output line by line, feed input step by step, connect two programs, or do other work and check back later. Use it in a with block so the pipes are closed and the process is waited for.',

  covers: ['Popen', 'Popen.universal_newlines'],

  cheat: {
    commonCall: 'with subprocess.Popen(cmd, stdout=subprocess.PIPE, text=True) as p: for line in p.stdout: ...',
    returns:    'A Popen object — the constructor does not wait',
    replaces:   'os.popen, os.spawn*, os.fork + os.exec*',
    watchOut:   'returncode is None until poll(), wait() or communicate()',
  },

  parameters: [
    { name: 'args',       type: 'list | str | path-like', required: true, default: null, desc: 'Program and arguments (a list is recommended). On Windows a list is joined with list2cmdline.' },
    { name: 'bufsize',    type: 'int', required: false, default: '-1', desc: 'Buffering of the pipe file objects: -1 default, 0 unbuffered, 1 line-buffered (text mode only). Must be an int.' },
    { name: 'executable', type: 'str', required: false, default: 'None', desc: 'Run this program instead of args[0] (args[0] is still passed as the program name). With shell=True on POSIX: the shell to use.' },
    { name: 'stdin / stdout / stderr', type: 'None | PIPE | DEVNULL | int | file', required: false, default: 'None', desc: 'Redirection of each stream; stderr also accepts STDOUT. None inherits the parent\'s stream.' },
    { name: 'close_fds',  type: 'bool', required: false, default: 'True', desc: 'Close inherited file descriptors (handles on Windows) except the standard ones.' },
    { name: 'shell',      type: 'bool', required: false, default: 'False', desc: 'Run args through /bin/sh or cmd.exe — see the shell=True page.' },
    { name: 'cwd',        type: 'str | bytes | path-like', required: false, default: 'None', desc: 'Working directory of the child.' },
    { name: 'env',        type: 'mapping', required: false, default: 'None', desc: 'Complete environment of the child (replaces, does not extend, yours).' },
    { name: 'text / universal_newlines', type: 'bool', required: false, default: 'None', desc: 'Open the pipes in text mode; universal_newlines is the old name. Giving both with different values raises SubprocessError.' },
    { name: 'encoding / errors', type: 'str', required: false, default: 'None', desc: 'Text-mode codec and error handler; either one switches text mode on.' },
    { name: 'startupinfo / creationflags', type: 'STARTUPINFO / int', required: false, default: 'None / 0', desc: 'Windows only: window and console settings for CreateProcess.' },
    { name: 'preexec_fn', type: 'callable', required: false, default: 'None', desc: 'POSIX only: called in the child before exec. Not safe with threads; prefer start_new_session / process_group.' },
    { name: 'start_new_session / process_group', type: 'bool / int', required: false, default: 'False / None', desc: 'POSIX only: setsid() or setpgid(0, value) in the child (process_group 3.11+).' },
    { name: 'pass_fds / restore_signals', type: 'sequence / bool', required: false, default: '() / True', desc: 'POSIX only: extra descriptors to keep open; restore SIGPIPE, SIGXFZ, SIGXFSZ to default.' },
    { name: 'user / group / extra_groups / umask', type: 'str | int', required: false, default: 'None / -1', desc: 'POSIX only (3.9+): setreuid, setregid, setgroups, umask in the child.' },
    { name: 'pipesize',   type: 'int', required: false, default: '-1', desc: 'Pipe buffer size for PIPE streams; only changed where supported (Linux). 3.10+.' },
  ],

  attributes: [
    { name: 'args',       type: 'list | str', meaning: 'The args argument as passed.' },
    { name: 'pid',        type: 'int',        meaning: 'Process ID of the child (of the shell, with shell=True).' },
    { name: 'returncode', type: 'int | None', meaning: 'None until poll(), wait() or communicate() sees the exit; -N = killed by signal N (POSIX).' },
    { name: 'stdin',      type: 'writable stream | None', meaning: 'Set only for stdin=PIPE.' },
    { name: 'stdout',     type: 'readable stream | None', meaning: 'Set only for stdout=PIPE.' },
    { name: 'stderr',     type: 'readable stream | None', meaning: 'Set only for stderr=PIPE.' },
    { name: 'universal_newlines', type: 'property', meaning: 'Alias of the internal text_mode: None when no text option was given, the encoding string if only encoding= was. Assigning sets text_mode to bool(value).' },
  ],

  patterns: [
    {
      name: 'Stream output line by line',
      desc: 'Process each line as the program prints it, not at the end.',
      code: "import subprocess\nwith subprocess.Popen(['ping', '-c', '4', 'example.com'], stdout=subprocess.PIPE, text=True) as p:\n    for line in p.stdout:\n        print('>', line.rstrip())\nprint('exit code', p.returncode)",
    },
    {
      name: 'Connect two programs (a | b)',
      desc: 'The docs\' recipe for a shell pipeline without a shell.',
      code: "import subprocess\np1 = subprocess.Popen(['dmesg'], stdout=subprocess.PIPE)\np2 = subprocess.Popen(['grep', 'hda'], stdin=p1.stdout, stdout=subprocess.PIPE)\np1.stdout.close()  # p1 gets SIGPIPE if p2 exits early\noutput = p2.communicate()[0]",
    },
    {
      name: 'Start in the background, check later',
      desc: 'The constructor returns immediately; poll() tells you whether it finished.',
      code: "import subprocess\nserver = subprocess.Popen(['python', '-m', 'http.server', '8000'])\n...\nif server.poll() is None:\n    server.terminate()\n    server.wait()",
    },
    {
      name: 'Run independent of the parent\'s terminal (POSIX)',
      desc: 'A new session: Ctrl+C in your terminal no longer reaches the child.',
      code: "import subprocess\nsubprocess.Popen(['long_job.sh'], start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)",
    },
  ],

  examples: [
    { title: 'with: read, then the exit code',  code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'print(6 * 7)'], stdout=subprocess.PIPE, text=True) as p:\n    out = p.stdout.read()\n(out, p.returncode)", returns: "('42\\n', 0)" },
    { title: 'Lines as they arrive',             code: "import subprocess, sys\nchild = 'for i in range(3): print(f\"line {i}\", flush=True)'\nlines = []\nwith subprocess.Popen([sys.executable, '-c', child], stdout=subprocess.PIPE, text=True) as p:\n    for line in p.stdout:\n        lines.append(line.rstrip())\n(lines, p.returncode)", returns: "(['line 0', 'line 1', 'line 2'], 0)" },
    { title: 'Write to stdin step by step',      code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'import sys; print(sum(int(x) for x in sys.stdin))'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True) as p:\n    for n in (1, 2, 3):\n        p.stdin.write(f'{n}\\n')\n    p.stdin.close()\n    total = p.stdout.read()\ntotal", returns: "'6\\n'" },
    { title: 'A pipeline of two processes',      code: "import subprocess, sys\nproducer = subprocess.Popen([sys.executable, '-c', 'print(\"b\"); print(\"a\"); print(\"c\")'], stdout=subprocess.PIPE)\nconsumer = subprocess.Popen([sys.executable, '-c', 'import sys; print(sorted(sys.stdin.read().split()))'], stdin=producer.stdout, stdout=subprocess.PIPE, text=True)\nproducer.stdout.close()\nout, _ = consumer.communicate()\nproducer.wait()\nout", returns: "\"['a', 'b', 'c']\\n\"" },
    { title: 'pid is the child\'s process ID',   code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'import os; print(os.getpid())'], stdout=subprocess.PIPE, text=True) as p:\n    child_pid = int(p.stdout.read())\nchild_pid == p.pid", returns: 'True' },
    { title: 'Only PIPE streams get an object',  code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'pass'], stdout=subprocess.PIPE) as p:\n    kinds = (p.stdin, type(p.stdout).__name__, p.stderr)\nkinds", returns: "(None, 'BufferedReader', None)" },
    { title: 'universal_newlines reflects the text options', code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'pass']) as a, subprocess.Popen([sys.executable, '-c', 'pass'], text=True) as b, subprocess.Popen([sys.executable, '-c', 'pass'], encoding='utf-8') as c:\n    pass\n(a.universal_newlines, b.universal_newlines, c.universal_newlines)", returns: "(None, True, 'utf-8')" },
    { title: 'Arguments are checked before anything starts', code: "import subprocess\nsubprocess.Popen(['ls'], bufsize='1')", returns: 'TypeError: bufsize must be an integer' },
  ],

  pitfalls: [
    {
      name: 'Reading a stream you did not pipe',
      desc: 'p.stdout is None unless stdout=PIPE; without it the output goes to your terminal.',
      wrong: { label: 'no PIPE', code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'pass']) as p:\n    data = p.stdout.read()\ndata", output: "AttributeError: 'NoneType' object has no attribute 'read'" },
      fix:   { label: 'stdout=PIPE', code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'print(1)'], stdout=subprocess.PIPE, text=True) as p:\n    data = p.stdout.read()\ndata", output: "'1\\n'" },
    },
    {
      name: 'Passing both text= and universal_newlines=',
      desc: 'They are the same option. Different values are rejected before the process starts.',
      wrong: { label: 'both', code: "import subprocess\nsubprocess.Popen(['git', 'status'], text=True, universal_newlines=False)", output: 'subprocess.SubprocessError: Cannot disambiguate when both text and universal_newlines are supplied but different. Pass one or the other.' },
      fix:   { label: 'text only', code: "import subprocess, sys\nwith subprocess.Popen([sys.executable, '-c', 'pass'], text=True) as p:\n    pass\np.universal_newlines", output: 'True' },
    },
    {
      name: 'Expecting returncode to update by itself',
      desc: 'Popen never watches the child in the background. returncode stays None — even after the child has finished — until poll(), wait() or communicate() collects the exit status.',
      wrong: { label: 'just read it', code: "import subprocess, sys, time\np = subprocess.Popen([sys.executable, '-c', 'pass'])\ntime.sleep(1)\nprint(p.returncode)\np.wait()", output: 'None\n0' },
      fix:   { label: 'poll()', code: "import subprocess, sys, time\np = subprocess.Popen([sys.executable, '-c', 'pass'])\ntime.sleep(1)\np.poll()", output: '0' },
    },
  ],

  when: {
    use: [
      'Reading output while the program runs (progress, logs, servers)',
      'Pipelines between programs without a shell',
      'Starting a background process and checking on it later',
    ],
    avoid: [
      'Run-to-completion commands → subprocess.run (it handles pipes and waiting for you)',
      'Interleaved reads and writes on several pipes yourself → communicate(), or deadlocks',
      'Many concurrent children in async code → asyncio.create_subprocess_exec',
    ],
  },

  notes: {
    cpython:          'Lib/subprocess.py — POSIX: _posixsubprocess.fork_exec (vfork when safe) or os.posix_spawn; Windows: _winapi.CreateProcess. Argument errors (bufsize, STDOUT for stdout, text vs universal_newlines) are raised before anything starts',
    'Context manager': '__exit__ closes stdout, stderr and stdin, then wait()s for the child (3.2+)',
    'ResourceWarning': 'A Popen that is garbage-collected while its child still runs emits ResourceWarning "subprocess <pid> is still running" (3.6+)',
    'Generic':        'Popen[bytes] / Popen[str] for type hints (__class_getitem__)',
  },

  related: [
    { name: 'Popen.communicate', slug: 'communicate', when: 'Send input, read all output, wait' },
    { name: 'Popen.wait / poll', slug: 'wait', when: 'Wait for or check the exit' },
    { name: 'Popen.kill / terminate', slug: 'kill', when: 'Stop the child' },
    { name: 'subprocess.run', slug: 'run', when: 'The simple wrapper' },
    { name: 'PIPE / STDOUT / DEVNULL', slug: 'pipe', when: 'Stream arguments' },
    { name: 'STARTUPINFO', slug: 'startupinfo', when: 'Windows startupinfo=' },
    { name: 'os.kill', slug: 'kill', when: 'Signal any process by pid', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'Popen starts a real process, and a browser cannot. The examples below run a child Python (sys.executable -c ...) that prints fixed text, so their results are the same on every system; the pid itself varies, so it is only compared, never printed.',
    },
    {
      q: 'What is the difference between subprocess.run and subprocess.Popen?',
      a: 'run() starts the process, waits for it and returns a CompletedProcess with everything collected. Popen() returns immediately with a handle to the running process; you read its streams, wait or kill it yourself. run() is implemented with Popen.',
    },
    {
      q: 'How do I read subprocess output line by line in real time?',
      a: 'Popen(cmd, stdout=subprocess.PIPE, text=True) and iterate over p.stdout. The child has to flush, though: a Python child buffers stdout when it is a pipe, so its lines arrive in bursts unless it prints with flush=True or runs unbuffered (python -u).',
    },
    {
      q: 'How do I run a process in the background in Python?',
      a: 'Create a Popen and do not wait for it. Keep the object, and eventually call poll() or wait() so the exit status is collected; on POSIX an unreaped child stays a zombie until then.',
    },
    {
      q: 'Why should I use Popen in a with block?',
      a: 'On leaving the block the pipes are closed and the process is waited for, even if an exception happened — no leaked file descriptors and no zombie processes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.Popen',
    meta:  'subprocess.Popen',
  },

};
