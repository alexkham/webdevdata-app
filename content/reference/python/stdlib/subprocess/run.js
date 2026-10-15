// content/reference/python/stdlib/subprocess/run.js

export const meta = {
  slug:        'run',
  name:        'subprocess.run',
  signature:   'subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None, capture_output=False, shell=False, cwd=None, timeout=None, check=False, encoding=None, errors=None, text=None, env=None, universal_newlines=None, **other_popen_kwargs)',
  blurb:       'Run a command, wait for it to finish and get back a CompletedProcess with the exit code and (if captured) its output.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+ (capture_output, text 3.7+)',
  searchTerms: 'subprocess.run run command python capture_output text=True check=True returncode stdout stderr input timeout cwd env get output of command run shell command wait for process completedprocess calledprocesserror',
};

export const method = {
  slug:      'run',
  name:      'subprocess.run',
  signature: 'subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None, capture_output=False, shell=False, cwd=None, timeout=None, check=False, encoding=None, errors=None, text=None, env=None, universal_newlines=None, **other_popen_kwargs)',
  returns:   { type: 'CompletedProcess', desc: 'args, returncode, and stdout / stderr (None unless captured).' },

  category:    'subprocess function',
  version:     'Python 3.5+ (capture_output, text 3.7+)',
  hasLiveDemo: true,

  subtitle: 'The recommended way to run a program. It starts the child, feeds it input, collects what you asked it to capture and waits — and it raises only when you ask: check=True for a non-zero exit code, timeout= for a deadline.',

  covers: ['run'],

  cheat: {
    commonCall: "subprocess.run(['git', 'status'], capture_output=True, text=True, check=True)",
    returns:    'CompletedProcess(args=..., returncode=0, stdout=..., stderr=...)',
    replaces:   'os.system, call / check_call / check_output',
    watchOut:   'No exception for a failing command unless check=True',
  },

  parameters: [
    { name: 'args',           type: 'list[str] | str | path-like', required: true,  default: null,    desc: 'The program and its arguments as a list (recommended). A single string must be the program alone — or a full command line with shell=True.' },
    { name: 'stdin',          type: 'None | PIPE | DEVNULL | int | file', required: false, default: 'None', desc: 'Where the child reads from. None inherits yours. Cannot be combined with input=.' },
    { name: 'input',          type: 'bytes | str', required: false, default: 'None',  desc: 'Data written to the child\'s stdin, which is then closed. str needs text mode (text=True, encoding= or errors=).' },
    { name: 'stdout',         type: 'None | PIPE | DEVNULL | int | file', required: false, default: 'None', desc: 'PIPE to capture, DEVNULL to discard, a file to redirect. None: the child writes to your stdout.' },
    { name: 'stderr',         type: 'None | PIPE | STDOUT | DEVNULL | int | file', required: false, default: 'None', desc: 'Like stdout; STDOUT merges it into the stdout stream.' },
    { name: 'capture_output', type: 'bool', required: false, default: 'False', desc: 'Shortcut for stdout=PIPE and stderr=PIPE. Cannot be combined with stdout= or stderr=.' },
    { name: 'shell',          type: 'bool', required: false, default: 'False', desc: 'Run args (a string) through /bin/sh or cmd.exe. Needed only for shell features; never with untrusted text.' },
    { name: 'cwd',            type: 'str | bytes | path-like', required: false, default: 'None', desc: 'Working directory of the child.' },
    { name: 'timeout',        type: 'float', required: false, default: 'None', desc: 'Seconds to wait. On expiry the child is killed, waited for, and TimeoutExpired is raised.' },
    { name: 'check',          type: 'bool', required: false, default: 'False', desc: 'Raise CalledProcessError when the exit code is not 0.' },
    { name: 'encoding',       type: 'str', required: false, default: 'None', desc: 'Decode output (and encode input) with this codec; implies text mode.' },
    { name: 'errors',         type: 'str', required: false, default: 'None', desc: "Codec error handler, e.g. 'replace'; implies text mode." },
    { name: 'text',           type: 'bool', required: false, default: 'None', desc: 'Text mode: str in and out, decoded with the locale encoding (UTF-8 in UTF-8 mode), all line endings turned into \\n.' },
    { name: 'env',            type: 'mapping', required: false, default: 'None', desc: 'The child\'s complete environment, replacing yours. Start from os.environ to keep PATH and friends.' },
    { name: 'universal_newlines', type: 'bool', required: false, default: 'None', desc: 'Old name of text.' },
    { name: '**other_popen_kwargs', type: 'any', required: false, default: null, desc: 'Everything else is passed to Popen: executable, close_fds, start_new_session, creationflags, …' },
  ],

  modes: [
    {
      id: 'check',
      label: 'check=True',
      blurb: 'How run(..., check=True) finishes once the child has exited: an exception for a non-zero code, otherwise the CompletedProcess. No process is started — the exit code and output are yours.',
      params: [
        { name: 'args', type: 'list[str]', hint: 'the command, comma-separated', input: 'csv' },
        { name: 'code', type: 'int',       hint: 'exit code',                    input: 'number' },
        { name: 'out',  type: 'str',       hint: 'captured stdout',              input: 'text' },
      ],
      template: 'import subprocess\n# the last lines of run(..., check=True), stderr left out\nargs, returncode, stdout = {$args}, {$code}, {$out}\nif returncode:\n    raise subprocess.CalledProcessError(returncode, args, output=stdout)\nsubprocess.CompletedProcess(args, returncode, stdout)',
      cases: [
        { id: 'ok',      label: 'exit 0',       values: { args: 'pytest,-q', code: '0', out: '5 passed' } },
        { id: 'fail',    label: 'exit 1',       values: { args: 'pytest,-q', code: '1', out: '1 failed, 4 passed' } },
        { id: 'usage',   label: 'exit 2',       values: { args: 'grep,--bogus', code: '2', out: '' } },
        { id: 'segv',    label: 'crashed (-11)', values: { args: './crashy', code: '-11', out: '' } },
      ],
    },
    {
      id: 'streams',
      label: 'stdout / stderr',
      blurb: 'The child is fixed: it prints out on stdout, then err on stderr. Choose PIPE, STDOUT, DEVNULL or None for each stream and see what run() hands back.',
      params: [
        { name: 'stdout', type: 'str', hint: 'PIPE, DEVNULL, STDOUT or None', input: 'text' },
        { name: 'stderr', type: 'str', hint: 'PIPE, DEVNULL, STDOUT or None', input: 'text' },
      ],
      template: "import subprocess, sys\nchild = \"import sys; print('out', flush=True); print('err', file=sys.stderr)\"\nstreams = {'PIPE': subprocess.PIPE, 'STDOUT': subprocess.STDOUT, 'DEVNULL': subprocess.DEVNULL, 'None': None}\nr = subprocess.run([sys.executable, '-c', child], stdout=streams[{$stdout}], stderr=streams[{$stderr}], text=True)\n(r.returncode, r.stdout, r.stderr)",
      cases: [
        { id: 'both',    label: 'capture both',    values: { stdout: 'PIPE', stderr: 'PIPE' } },
        { id: 'merge',   label: 'merge stderr',    values: { stdout: 'PIPE', stderr: 'STDOUT' } },
        { id: 'quiet',   label: 'discard stderr',  values: { stdout: 'PIPE', stderr: 'DEVNULL' } },
        { id: 'wrong',   label: 'stdout=STDOUT',   values: { stdout: 'STDOUT', stderr: 'PIPE' } },
      ],
    },
  ],
  demoExplainer: 'In check=True, any non-zero code raises — and the message shows args exactly as you passed them (a list stays a list). A negative code -N means the child was killed by signal N, which happens only on POSIX; the name comes from the Linux signal table. In stdout / stderr, only the routing is computed in your browser: PIPE captures, DEVNULL throws the text away, None leaves the stream on your terminal (so nothing is captured), and stderr=STDOUT sends err into the same pipe after out. stdout=STDOUT is rejected with ValueError in Python 3.13; 3.12 failed later with an OSError instead (on Linux: [Errno 9] Bad file descriptor).',

  patterns: [
    {
      name: 'Output as text, exception on failure',
      desc: 'The combination most scripts want.',
      code: "import subprocess\nout = subprocess.run(['git', 'log', '-1', '--format=%H'], capture_output=True, text=True, check=True).stdout.strip()",
    },
    {
      name: 'Run in a folder with extra environment variables',
      desc: 'env replaces the whole environment, so start from a copy of os.environ.',
      code: "import os, subprocess\nsubprocess.run(['npm', 'run', 'build'], cwd='frontend', env={**os.environ, 'NODE_ENV': 'production'}, check=True)",
    },
    {
      name: 'Merge stderr into stdout',
      desc: 'One combined log in the order the child wrote it (capture_output cannot do this).',
      code: "import subprocess\nlog = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout",
    },
    {
      name: 'Silence a noisy command',
      desc: 'DEVNULL discards the output instead of filling a buffer you never read.',
      code: "import subprocess\nsubprocess.run(['apt-get', 'update'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)",
    },
  ],

  examples: [
    { title: 'Capture stdout as text',       code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'print(\"hello\")'], capture_output=True, text=True)\n(r.returncode, r.stdout)", returns: "(0, 'hello\\n')" },
    { title: 'Read what the child wrote to stderr', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.exit(\"bad config\")'], capture_output=True, text=True)\n(r.returncode, r.stderr)", returns: "(1, 'bad config\\n')" },
    { title: 'Pass input on stdin',          code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sys.stdin.read().upper())'], input='abc', capture_output=True, text=True)\nr.stdout", returns: "'ABC\\n'" },
    { title: 'Give up after a timeout',      code: "import subprocess, sys\ntry:\n    subprocess.run([sys.executable, '-c', 'import time; time.sleep(10)'], capture_output=True, timeout=0.5)\nexcept subprocess.TimeoutExpired as e:\n    result = f'gave up after {e.timeout} s'\nresult", returns: "'gave up after 0.5 s'" },
    { title: 'Run inside another folder',    code: "import os, subprocess, sys\nos.mkdir('data')\nopen('data/a.txt', 'w').close()\nr = subprocess.run([sys.executable, '-c', 'import os; print(os.listdir())'], cwd='data', capture_output=True, text=True)\nr.stdout", returns: "\"['a.txt']\\n\"" },
    { title: 'Add an environment variable',  code: "import os, subprocess, sys\nenv = {**os.environ, 'GREETING': 'hi'}\nr = subprocess.run([sys.executable, '-c', 'import os; print(os.environ[\"GREETING\"])'], env=env, capture_output=True, text=True)\nr.stdout", returns: "'hi\\n'" },
    { title: 'Text mode normalises line endings', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; sys.stdout.buffer.write(b\"a\\\\r\\\\nb\\\\rc\\\\n\")'], capture_output=True, text=True)\nr.stdout", returns: "'a\\nb\\nc\\n'" },
    { title: 'args is kept as you passed it', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'pass'])\n(r.args[1:], r.returncode, r.stdout, r.stderr)", returns: "(['-c', 'pass'], 0, None, None)" },
  ],

  pitfalls: [
    {
      name: 'capture_output plus stderr=STDOUT',
      desc: 'capture_output already sets both streams, so it refuses stdout= and stderr=. To merge the streams, spell out stdout=PIPE.',
      wrong: { label: 'capture_output + stderr', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'pass'], capture_output=True, stderr=subprocess.STDOUT)", output: 'ValueError: stdout and stderr arguments may not be used with capture_output.' },
      fix:   { label: 'stdout=PIPE, stderr=STDOUT', code: "import subprocess, sys\nchild = 'import sys; print(\"out\", flush=True); print(\"err\", file=sys.stderr)'\nr = subprocess.run([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)\n(r.stdout, r.stderr)", output: "('out\\nerr\\n', None)" },
    },
    {
      name: 'Passing both input= and stdin=',
      desc: 'input= creates the stdin pipe itself, so an explicit stdin is an error even if it is PIPE.',
      wrong: { label: 'input + stdin', code: "import subprocess, sys\nsubprocess.run([sys.executable, '-c', 'pass'], input='b\\na\\n', stdin=subprocess.PIPE)", output: 'ValueError: stdin and input arguments may not both be used.' },
      fix:   { label: 'input only', code: "import subprocess, sys\nr = subprocess.run([sys.executable, '-c', 'import sys; print(sorted(sys.stdin.read().split()))'], input='b\\na\\n', capture_output=True, text=True)\nr.stdout", output: "\"['a', 'b']\\n\"" },
    },
    {
      name: 'Merged output in a surprising order',
      desc: 'A Python child buffers stdout when it is a pipe but writes stderr line by line, so with stderr=STDOUT the error can arrive first. flush=True (or python -u) keeps the order.',
      wrong: { label: 'buffered stdout', code: "import subprocess, sys\nchild = 'import sys; print(\"out\"); print(\"err\", file=sys.stderr)'\nsubprocess.run([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout", output: "'err\\nout\\n'" },
      fix:   { label: 'flush=True', code: "import subprocess, sys\nchild = 'import sys; print(\"out\", flush=True); print(\"err\", file=sys.stderr)'\nsubprocess.run([sys.executable, '-c', child], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout", output: "'out\\nerr\\n'" },
    },
  ],

  when: {
    use: [
      'Any command you want to run to completion: build tools, git, converters',
      'Capturing output for parsing (with text=True)',
      'Scripts that must stop when a step fails (check=True)',
    ],
    avoid: [
      'Reading output while the program is still running, or long-lived children → Popen',
      'Gigabytes of output: run() keeps it all in memory → Popen with stdout=PIPE and read in chunks, or redirect to a file',
      'Concurrency inside asyncio code → asyncio.create_subprocess_exec',
    ],
  },

  notes: {
    cpython:      'Lib/subprocess.py: run() is a Popen inside a with block plus communicate(input, timeout); then CompletedProcess(process.args, retcode, stdout, stderr)',
    'Timeout':    'On expiry the child is killed and waited for before TimeoutExpired is re-raised; process creation itself cannot be interrupted',
    'Text mode':  'Without encoding=, text=True decodes with UTF-8 in UTF-8 mode and with locale.getencoding() otherwise (UTF-8 only where the locale is UTF-8), so pass encoding="utf-8" for tools that always write UTF-8',
    'Windows':    'Since 3.12, shell=True looks for %COMSPEC% and then %SystemRoot%\\System32\\cmd.exe instead of searching the current directory and PATH',
  },

  related: [
    { name: 'CompletedProcess', slug: 'completedprocess', when: 'What run() returns' },
    { name: 'CalledProcessError', slug: 'calledprocesserror', when: 'Raised by check=True' },
    { name: 'TimeoutExpired', slug: 'timeoutexpired', when: 'Raised by timeout=' },
    { name: 'PIPE / STDOUT / DEVNULL', slug: 'pipe', when: 'Values for stdin, stdout, stderr' },
    { name: 'Popen', slug: 'popen', when: 'Streaming output, pipelines' },
    { name: 'shell=True', slug: 'shell', when: 'Before you reach for a command string' },
    { name: 'os.system', slug: 'system', when: 'What run() replaces', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I get the output of subprocess.run as a string?',
      a: 'Pass capture_output=True and text=True, then read result.stdout. Without text=True you get bytes; without capture_output the output goes to the terminal and result.stdout is None.',
    },
    {
      q: 'Does subprocess.run wait for the command to finish?',
      a: 'Yes. It returns only after the child has exited (or raises TimeoutExpired after killing it). To start a program and keep working while it runs, use Popen.',
    },
    {
      q: 'How do I run a command in a specific directory or with extra environment variables?',
      a: 'cwd="path" sets the working directory. env= replaces the whole environment, so pass {**os.environ, "NAME": "value"} to add a variable without losing PATH.',
    },
    {
      q: 'Why does subprocess.run not raise an error when my command fails?',
      a: 'A non-zero exit code is reported in returncode, not raised. Add check=True (or call result.check_returncode()) to get CalledProcessError. A program that cannot be started at all always raises — FileNotFoundError for a missing executable.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/subprocess.html#subprocess.run',
    meta:  'subprocess.run',
  },

};
