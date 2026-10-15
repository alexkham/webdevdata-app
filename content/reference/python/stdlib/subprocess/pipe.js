// content/reference/python/stdlib/subprocess/pipe.js

export const meta = {
  slug:        'pipe',
  name:        'subprocess.PIPE',
  signature:   'subprocess.PIPE = -1 · subprocess.STDOUT = -2 · subprocess.DEVNULL = -3',
  blurb:       'The three special values for stdin / stdout / stderr: PIPE captures (or feeds) a stream, STDOUT merges stderr into stdout, DEVNULL throws the stream away.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3 (DEVNULL 3.3+)',
  searchTerms: 'subprocess.PIPE PIPE subprocess.STDOUT STDOUT subprocess.DEVNULL DEVNULL stdout stderr stdin redirect capture merge stderr into stdout discard output suppress output os.devnull 2>&1 >/dev/null',
};

export const method = {
  slug:      'pipe',
  name:      'subprocess.PIPE',
  signature: 'subprocess.PIPE = -1 · subprocess.STDOUT = -2 · subprocess.DEVNULL = -3',
  returns:   { type: 'int', desc: 'Plain negative ints that Popen recognises in the stdin, stdout and stderr arguments.' },

  category:    'subprocess constant',
  version:     'Python 3 (DEVNULL 3.3+)',
  hasLiveDemo: true,

  subtitle: 'Each stream argument of run() and Popen takes None (inherit yours), PIPE, DEVNULL, a file object or a file descriptor — and stderr also takes STDOUT. These three constants are just -1, -2 and -3.',

  covers: ['PIPE', 'STDOUT', 'DEVNULL'],

  cheat: {
    commonCall: 'subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)',
    returns:    'PIPE = -1, STDOUT = -2, DEVNULL = -3',
    replaces:   'Shell redirections: 2>&1, >/dev/null, >NUL',
    watchOut:   'STDOUT is only valid for stderr',
  },

  parameters: [
    { name: 'PIPE',    type: 'int', required: false, default: '-1', desc: 'Create a new pipe: you read the child\'s stdout/stderr from it, or write its stdin. Captured data lands in .stdout / .stderr / communicate().' },
    { name: 'STDOUT',  type: 'int', required: false, default: '-2', desc: 'stderr only: write errors into the same place as stdout (the pipe, file or terminal stdout uses).' },
    { name: 'DEVNULL', type: 'int', required: false, default: '-3', desc: 'Connect the stream to os.devnull: output is discarded, input reads as empty.' },
  ],

  modes: [
    {
      id: 'streams',
      label: 'stdout / stderr',
      blurb: 'The child is fixed: it prints out on stdout, then err on stderr. Pick a value for each stream and see what ends up in r.stdout and r.stderr.',
      params: [
        { name: 'stdout', type: 'str', hint: 'PIPE, DEVNULL, STDOUT or None', input: 'text' },
        { name: 'stderr', type: 'str', hint: 'PIPE, DEVNULL, STDOUT or None', input: 'text' },
      ],
      template: "import subprocess, sys\nchild = \"import sys; print('out', flush=True); print('err', file=sys.stderr)\"\nstreams = {'PIPE': subprocess.PIPE, 'STDOUT': subprocess.STDOUT, 'DEVNULL': subprocess.DEVNULL, 'None': None}\nr = subprocess.run([sys.executable, '-c', child], stdout=streams[{$stdout}], stderr=streams[{$stderr}], text=True)\n(r.stdout, r.stderr)",
      cases: [
        { id: 'merge',  label: 'merge (2>&1)',      values: { stdout: 'PIPE', stderr: 'STDOUT' } },
        { id: 'both',   label: 'two pipes',         values: { stdout: 'PIPE', stderr: 'PIPE' } },
        { id: 'errs',   label: 'only the errors',   values: { stdout: 'DEVNULL', stderr: 'PIPE' } },
        { id: 'silent', label: 'discard all',       values: { stdout: 'DEVNULL', stderr: 'STDOUT' } },
        { id: 'bad',    label: 'stdout=STDOUT',     values: { stdout: 'STDOUT', stderr: 'PIPE' } },
      ],
    },
  ],
  demoExplainer: 'Your browser only works out the routing; the child and its two lines are fixed. Only PIPE produces data in the result — DEVNULL and None both give None (None means the text went to your terminal). stderr=STDOUT follows wherever stdout goes: into the pipe after out, or into DEVNULL with it. stdout=STDOUT makes no sense and Python 3.13 rejects it with ValueError; 3.12 failed later with an OSError (on Linux: [Errno 9] Bad file descriptor). A name that is not in the dict is a KeyError before anything runs.',

  patterns: [
    {
      name: 'Capture everything as one log',
      desc: 'The equivalent of 2>&1 in a shell.',
      code: "import subprocess\nlog = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout",
    },
    {
      name: 'Silence a command completely',
      desc: 'Like >/dev/null 2>&1 (or >NUL 2>&1 on Windows).',
      code: "import subprocess\nsubprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)",
    },
    {
      name: 'Never wait for keyboard input',
      desc: 'stdin=DEVNULL: a child that asks a question reads end-of-file instead of hanging.',
      code: "import subprocess\nsubprocess.run(cmd, stdin=subprocess.DEVNULL, check=True)",
    },
    {
      name: 'Write output to a file',
      desc: 'Any open file (with a real file descriptor) works as a stream target.',
      code: "import subprocess\nwith open('build.log', 'w') as log:\n    subprocess.run(cmd, stdout=log, stderr=subprocess.STDOUT)",
    },
  ],

  examples: [
    { title: 'The values',                 code: 'import subprocess\n(subprocess.PIPE, subprocess.STDOUT, subprocess.DEVNULL)', returns: '(-1, -2, -3)' },
    { title: 'PIPE for both = capture_output', code: "import subprocess, sys\nchild = 'import sys; print(\"out\"); print(\"err\", file=sys.stderr)'\na = subprocess.run([sys.executable, '-c', child], capture_output=True, text=True)\nb = subprocess.run([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)\n(a.stdout, a.stderr) == (b.stdout, b.stderr)", returns: 'True' },
    { title: 'STDOUT merges stderr into stdout', code: "import subprocess, sys\nchild = 'import sys; print(\"out\", flush=True); print(\"err\", file=sys.stderr)'\nr = subprocess.run([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)\n(r.stdout, r.stderr)", returns: "('out\\nerr\\n', None)" },
    { title: 'DEVNULL discards output',     code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(\"noise\")'], stdout=subprocess.DEVNULL)\n(r.returncode, r.stdout)", returns: '(0, None)' },
    { title: 'stdin=DEVNULL reads as empty', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; print(repr(sys.stdin.read()))'], stdin=subprocess.DEVNULL, capture_output=True, text=True)\nr.stdout", returns: "\"''\\n\"" },
    { title: 'A file object works too',     code: "import subprocess, sys\nwith open('log.txt', 'w') as f:\n    subprocess.run([sys.executable, '-c', 'print(\"to the file\")'], stdout=f)\nopen('log.txt').read()", returns: "'to the file\\n'" },
    { title: 'STDOUT is not valid for stdout (3.13)', code: "import subprocess\nsubprocess.Popen(['ls'], stdout=subprocess.STDOUT)", returns: 'ValueError: STDOUT can only be used for stderr' },
  ],

  pitfalls: [
    {
      name: 'stdout=PIPE with nobody reading it',
      desc: 'call() and check_call() never read their pipes. A child that writes more than the pipe buffer holds blocks forever — here the timeout is the only way out. To capture, use run(); to throw output away, use DEVNULL.',
      wrong: { label: 'PIPE, unread', code: "import subprocess, sys\ntry:\n    subprocess.call([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.PIPE, timeout=1)\n    result = 'finished'\nexcept subprocess.TimeoutExpired:\n    result = 'stuck: nobody reads the full pipe'\nresult", output: "'stuck: nobody reads the full pipe'" },
      fix:   { label: 'DEVNULL', code: "import subprocess, sys\nsubprocess.call([sys.executable, '-c', 'print(\"x\" * 1_000_000)'], stdout=subprocess.DEVNULL, timeout=1)", output: '0' },
    },
    {
      name: 'Expecting output from DEVNULL',
      desc: 'DEVNULL is a sink, not a capture: nothing comes back. Use PIPE when you want the text.',
      wrong: { label: 'DEVNULL', code: "import subprocess, sys\nprint(subprocess.run([sys.executable, '-c', 'print(42)'], stdout=subprocess.DEVNULL, text=True).stdout)", output: 'None' },
      fix:   { label: 'PIPE', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'print(42)'], stdout=subprocess.PIPE, text=True).stdout", output: "'42\\n'" },
    },
  ],

  when: {
    use: [
      'PIPE: capture output, or write input yourself (Popen.communicate)',
      'STDOUT: one combined log in the order the child wrote it',
      'DEVNULL: silence a chatty tool, or make sure it never waits for input',
    ],
    avoid: [
      'PIPE with call() / check_call() or with Popen when you never read the pipe — the child can block',
      'Capturing both streams with capture_output when you need them merged → stdout=PIPE, stderr=STDOUT',
    ],
  },

  notes: {
    cpython:       'PIPE = -1, STDOUT = -2, DEVNULL = -3 at the top of Lib/subprocess.py; Popen._get_handles compares the arguments with them',
    'DEVNULL':     'Opens os.devnull ("/dev/null" or "nul") once per Popen and closes it after the child has started',
    'Python 3.13': 'stdout=STDOUT raises ValueError("STDOUT can only be used for stderr") (gh-98966, new in 3.13.0); older versions failed with an OSError ([Errno 9] Bad file descriptor on Linux 3.12)',
  },

  related: [
    { name: 'subprocess.run', slug: 'run', when: 'Where these values usually go' },
    { name: 'Popen.communicate', slug: 'communicate', when: 'Read and write PIPEs without deadlocks' },
    { name: 'Popen', slug: 'popen', when: 'stdin/stdout/stderr attributes for PIPE' },
    { name: 'os.pipe', slug: 'pipe', when: 'The raw OS pipe underneath', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I redirect stderr to stdout in subprocess?',
      a: 'Pass stdout=subprocess.PIPE and stderr=subprocess.STDOUT; the combined text is in result.stdout and result.stderr is None. It is the equivalent of 2>&1.',
    },
    {
      q: 'How do I hide the output of a subprocess?',
      a: 'stdout=subprocess.DEVNULL (and stderr=subprocess.DEVNULL for errors). The output is discarded by the operating system, so nothing piles up in memory.',
    },
    {
      q: 'What is the difference between PIPE and DEVNULL?',
      a: 'PIPE connects the stream to your program so you can read it (result.stdout) or write to it; DEVNULL connects it to the null device, so output vanishes and input is empty.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.PIPE',
    meta:  'subprocess.PIPE / STDOUT / DEVNULL',
  },

};
