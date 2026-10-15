// content/reference/python/stdlib/subprocess/communicate.js

export const meta = {
  slug:        'communicate',
  name:        'Popen.communicate',
  signature:   'Popen.communicate(input=None, timeout=None)',
  blurb:       'Send input to a Popen child, read stdout and stderr to the end and wait for it to exit — all without the deadlocks of reading the pipes by hand.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3 (timeout 3.3+)',
  searchTerms: 'Popen.communicate communicate subprocess send input read output stdin stdout stderr deadlock pipe buffer full timeout TimeoutExpired kill then communicate Cannot send input after starting communication python',
};

export const method = {
  slug:      'communicate',
  name:      'Popen.communicate',
  signature: 'Popen.communicate(input=None, timeout=None)',
  returns:   { type: 'tuple[bytes | str | None, bytes | str | None]', desc: '(stdout_data, stderr_data) — None for each stream that was not a PIPE.' },

  category:    'Popen method',
  version:     'Python 3 (timeout 3.3+)',
  hasLiveDemo: false,

  subtitle: 'The safe way to talk to a Popen child once: write all of input, close stdin, read both output pipes concurrently until end-of-file, then wait. Everything is buffered in memory, so it suits ordinary amounts of output, not endless streams.',

  covers: ['Popen.communicate'],

  cheat: {
    commonCall: "out, err = proc.communicate(input='data', timeout=30)",
    returns:    '(stdout_data, stderr_data)',
    replaces:   'proc.stdin.write() + proc.stdout.read() + proc.wait()',
    watchOut:   'input is silently ignored unless stdin=PIPE',
  },

  parameters: [
    { name: 'input',   type: 'bytes | str | None', required: false, default: 'None', desc: 'Data for the child\'s stdin (str in text mode, bytes otherwise). Needs stdin=PIPE; stdin is closed afterwards either way.' },
    { name: 'timeout', type: 'float | None', required: false, default: 'None', desc: 'Seconds to wait. On expiry TimeoutExpired is raised and the child keeps running; call communicate() again to continue.' },
  ],

  patterns: [
    {
      name: 'Timeout, kill, collect',
      desc: 'The recipe from the docs: the second communicate() gathers the output and reaps the child.',
      code: "import subprocess\nproc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)\ntry:\n    outs, errs = proc.communicate(timeout=15)\nexcept subprocess.TimeoutExpired:\n    proc.kill()\n    outs, errs = proc.communicate()",
    },
    {
      name: 'Filter text through a program',
      desc: 'stdin and stdout both piped, one call.',
      code: "import subprocess\nproc = subprocess.Popen(['sort', '-u'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)\nunique, _ = proc.communicate('\\n'.join(words))",
    },
    {
      name: 'Check the exit code afterwards',
      desc: 'communicate() sets returncode; it does not raise for a failure.',
      code: "out, err = proc.communicate()\nif proc.returncode != 0:\n    raise RuntimeError(f'{proc.args[0]} failed: {err}')",
    },
  ],

  examples: [
    { title: 'Input in, output out',            code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; print(sys.stdin.read()[::-1])'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)\np.communicate('stressed')", returns: "('desserts\\n', None)" },
    { title: 'Both output streams, then the code', code: "import subprocess, sys\nchild = 'import sys; print(\"out\"); print(\"err\", file=sys.stderr)'\np = subprocess.Popen([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)\n(p.communicate(), p.returncode)", returns: "(('out\\n', 'err\\n'), 0)" },
    { title: 'No pipes: (None, None)',           code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'pass'])\np.communicate()", returns: '(None, None)' },
    { title: 'Large output is no problem',      code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE, text=True)\nout, _ = p.communicate()\nlen(out)", returns: '1000001' },
    { title: 'Timeout: kill, then collect',     code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'], stdout=subprocess.PIPE, text=True)\ntry:\n    p.communicate(timeout=0.5)\nexcept subprocess.TimeoutExpired:\n    p.kill()\n    out, err = p.communicate()\n(out, err, p.returncode != 0)", returns: "('', None, True)" },
    { title: 'No new input after a timeout',    code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)\ntry:\n    p.communicate(timeout=0.3)\nexcept subprocess.TimeoutExpired:\n    pass\ntry:\n    p.communicate(b'more')\nexcept ValueError as e:\n    result = str(e)\nfinally:\n    p.kill()\n    p.communicate()\nresult", returns: "'Cannot send input after starting communication'" },
  ],

  pitfalls: [
    {
      name: 'input without stdin=PIPE',
      desc: 'With no stdin pipe there is nowhere to write, and communicate() drops the input without a word.',
      wrong: { label: 'stdin=DEVNULL', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; print(repr(sys.stdin.read()))'], stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, text=True)\np.communicate('data')", output: "(\"''\\n\", None)" },
      fix:   { label: 'stdin=PIPE', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'import sys; print(repr(sys.stdin.read()))'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)\np.communicate('data')", output: "(\"'data'\\n\", None)" },
    },
    {
      name: 'wait() on a full pipe',
      desc: 'wait() does not read the pipes. A child that writes more than the pipe buffer blocks, and wait() waits forever (here: until the timeout). communicate() reads while it waits.',
      wrong: { label: 'wait()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE)\ntry:\n    p.wait(timeout=1)\n    result = 'finished'\nexcept subprocess.TimeoutExpired:\n    result = 'stuck: wait() does not read the pipe'\nfinally:\n    p.kill()\n    p.communicate()\nresult", output: "'stuck: wait() does not read the pipe'" },
      fix:   { label: 'communicate()', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE)\nout, _ = p.communicate(timeout=10)\n(len(out) > 1_000_000, p.returncode)", output: '(True, 0)' },
    },
    {
      name: 'Calling it twice',
      desc: 'The first call reads the pipes to the end and closes them. Keep its result instead of asking again.',
      wrong: { label: 'second call', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(1)'], stdout=subprocess.PIPE, text=True)\nfirst = p.communicate()\nsecond = p.communicate()\n(first, second)", output: 'ValueError: I/O operation on closed file.' },
      fix:   { label: 'keep the result', code: "import subprocess, sys\np = subprocess.Popen([sys.executable, '-c', 'print(1)'], stdout=subprocess.PIPE, text=True)\nout, err = p.communicate()\n(out, err, p.returncode)", output: "('1\\n', None, 0)" },
    },
  ],

  when: {
    use: [
      'One exchange with a Popen child: give it input, get all output',
      'Several pipes at once (stdout and stderr) without deadlocks',
      'After a timeout + kill(), to collect what is left',
    ],
    avoid: [
      'Unbounded or huge output — it is all kept in memory → read p.stdout in chunks or redirect to a file',
      'Conversations (write, read the answer, write again) → write/flush/readline on the pipes, carefully',
      'A plain run-to-completion command → subprocess.run',
    ],
  },

  notes: {
    cpython:     'Windows: one reader thread per output pipe; POSIX: a selector loop over the pipes. With at most one pipe and no timeout it simply reads that pipe and waits',
    'Text mode': 'In text mode the returned strings have universal newlines (\\r\\n → \\n); the streams\' newlines attribute is not updated',
    'After a timeout': 'Retrying communicate() loses no output, but passing input again raises ValueError ("Cannot send input after starting communication"); do not call wait() — call communicate() again',
  },

  related: [
    { name: 'Popen', slug: 'popen', when: 'Create the process with PIPEs' },
    { name: 'Popen.wait / poll', slug: 'wait', when: 'Wait without reading — only without PIPEs' },
    { name: 'Popen.kill', slug: 'kill', when: 'Before the second communicate() after a timeout' },
    { name: 'TimeoutExpired', slug: 'timeoutexpired', when: 'What timeout= raises' },
    { name: 'subprocess.run', slug: 'run', when: 'Popen + communicate in one call' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'communicate() talks to a running child process, and a browser cannot start one. The examples below use a child Python (sys.executable -c ...) with fixed output instead, so they give the same result on every system.',
    },
    {
      q: 'What does Popen.communicate do?',
      a: 'It writes input (if any) to stdin and closes it, reads stdout and stderr until the child closes them, waits for the process to exit and returns (stdout_data, stderr_data). It also sets returncode.',
    },
    {
      q: 'Why use communicate() instead of p.stdout.read()?',
      a: 'Reading one pipe while the child is blocked writing to another (or waiting for input you have not closed) deadlocks. communicate() feeds and drains every pipe at the same time, so the child never blocks on a full buffer.',
    },
    {
      q: 'Does communicate() kill the process when the timeout expires?',
      a: 'No. It raises TimeoutExpired and the child keeps running. Call proc.kill() and then proc.communicate() again to collect the remaining output and reap the process.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.Popen.communicate',
    meta:  'Popen.communicate',
  },

};
