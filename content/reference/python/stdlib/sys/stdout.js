// content/reference/python/stdlib/sys/stdout.js — the standard streams

export const meta = {
  slug:        'stdout',
  name:        'sys.stdin / stdout / stderr',
  signature:   'sys.stdin · sys.stdout · sys.stderr  (text file objects)',
  blurb:       'The three standard streams as text files: print() writes to stdout, error messages go to stderr, input() reads from stdin. Replace them to capture or redirect output.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'All versions',
  searchTerms: 'sys.stdin stdin sys.stdout stdout sys.stderr stderr sys.__stdout__ __stdout__ __stderr__ __stdin__ standard output standard error print to stderr redirect stdout capture output sys.stdout.write flush read from stdin pipe buffer binary',
};

export const method = {
  slug:      'stdout',
  name:      'sys.stdin / stdout / stderr',
  signature: 'sys.stdin · sys.stdout · sys.stderr  (text file objects)',
  returns:   { type: 'TextIO', desc: 'io.TextIOWrapper objects normally; any object with write() (or readline() for stdin) when replaced.' },

  category:    'sys attribute',
  version:     'All versions',
  hasLiveDemo: false,

  subtitle: 'They are ordinary module attributes, and print(), input() and tracebacks look them up each time — so assigning a new object (or using contextlib.redirect_stdout) redirects everything. The originals stay available as sys.__stdin__, sys.__stdout__ and sys.__stderr__.',

  covers: ['stdin', 'stdout', 'stderr'],

  cheat: {
    commonCall: "print('warning', file=sys.stderr)",
    returns:    'text file objects (str in, str out)',
    replaces:   'os.write(1, …) / os.write(2, …) on raw file descriptors',
    watchOut:   'Bind sys.stdout late — a saved reference ignores later redirection',
  },

  parameters: [],

  patterns: [
    {
      name: 'Errors and progress to stderr',
      desc: 'Keeps stdout clean for data that may be piped into another program.',
      code: "import sys\nprint(f'processed {n} rows', file=sys.stderr)",
    },
    {
      name: 'Read all lines from a pipe',
      desc: 'Iterating sys.stdin yields lines until end of input (Ctrl-D / Ctrl-Z Enter at a terminal).',
      code: 'import sys\nfor line in sys.stdin:\n    process(line.rstrip("\\n"))',
    },
    {
      name: 'Write raw bytes to stdout',
      desc: 'The underlying binary buffer — absent when stdout has been replaced by a StringIO.',
      code: "import sys\nsys.stdout.buffer.write(b'\\x89PNG...')\nsys.stdout.flush()",
    },
    {
      name: 'Change encoding or buffering at runtime',
      desc: 'TextIOWrapper.reconfigure (3.7+).',
      code: "import sys\nsys.stdout.reconfigure(encoding='utf-8', line_buffering=True)",
    },
  ],

  examples: [
    { title: 'write() returns the number of characters', code: "import sys\nsys.stdout.write('hello\\n')", returns: 'hello\n6' },
    { title: 'Capture print() output',     code: "import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    print('captured')\nbuf.getvalue()", returns: "'captured\\n'" },
    { title: 'Two separate streams',       code: "import io, sys, contextlib\nout, err = io.StringIO(), io.StringIO()\nwith contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):\n    print('data')\n    print('warning', file=sys.stderr)\n(out.getvalue(), err.getvalue())", returns: "('data\\n', 'warning\\n')" },
    { title: 'input() reads from sys.stdin', code: "import io, sys\nold = sys.stdin\nsys.stdin = io.StringIO('42\\nhello\\n')\ntry:\n    first = input()\n    second = sys.stdin.readline()\nfinally:\n    sys.stdin = old\n(first, second)", returns: "('42', 'hello\\n')" },
    { title: 'What a child process wrote where', code: "import subprocess, sys\ncode = 'import sys; print(\"out\"); print(\"err\", file=sys.stderr)'\np = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)\n(p.stdout, p.stderr)", returns: "('out\\n', 'err\\n')" },
  ],

  pitfalls: [
    {
      name: 'Binding sys.stdout too early',
      desc: 'A default argument is evaluated once, at def time, so the function keeps writing to whatever stdout was then — redirection is ignored. Look sys.stdout up at call time.',
      wrong: { label: 'stream=sys.stdout', code: "import io, sys, contextlib\ndef log(msg, stream=sys.stdout):\n    stream.write(msg + '\\n')\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    log('hello')\nbuf.getvalue()", output: "hello\n''" },
      fix:   { label: 'stream=None', code: "import io, sys, contextlib\ndef log(msg, stream=None):\n    (stream or sys.stdout).write(msg + '\\n')\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    log('hello')\nbuf.getvalue()", output: "'hello\\n'" },
    },
    {
      name: 'Assuming sys.stdout.buffer exists',
      desc: 'Replacement streams (StringIO in tests, some IDEs, Jupyter) have no binary buffer. Fall back to text.',
      wrong: { label: '.buffer', code: "import io, sys, contextlib\nwith contextlib.redirect_stdout(io.StringIO()):\n    sys.stdout.buffer.write(b'raw')", output: "AttributeError: '_io.StringIO' object has no attribute 'buffer'" },
      fix:   { label: 'check first', code: "import io, sys, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    out = getattr(sys.stdout, 'buffer', None)\n    if out is not None:\n        out.write(b'raw')\n    else:\n        sys.stdout.write(b'raw'.decode())\nbuf.getvalue()", output: "'raw'" },
    },
  ],

  when: {
    use: [
      'Command-line tools: data to stdout, diagnostics to stderr, input from stdin',
      'Capturing output in tests (contextlib.redirect_stdout / redirect_stderr)',
    ],
    avoid: [
      'Application logging → the logging module (it writes to stderr by default)',
      'Output of child processes → subprocess with capture_output=True',
    ],
  },

  notes: {
    cpython:          'Created at startup (Python/pylifecycle.c, create_stdio) as io.TextIOWrapper over buffered file descriptors 0, 1 and 2',
    'Buffering':      'stdout is line-buffered when interactive and block-buffered otherwise; stderr is line-buffered (3.9+). -u or PYTHONUNBUFFERED disables buffering',
    'Encoding':       'UTF-8 for the Windows console; pipes and files use the locale encoding unless PYTHONIOENCODING or UTF-8 mode (-X utf8) says otherwise',
    'None':           'With pythonw.exe or GUI apps without a console, stdin/stdout/stderr (and the __std*__ originals) can be None',
  },

  related: [
    { name: 'print()',  slug: 'print', when: 'Writes to sys.stdout (file= to choose)', category: 'functions' },
    { name: 'input()',  slug: 'input', when: 'Reads a line from sys.stdin',            category: 'functions' },
    { name: 'open()',   slug: 'open',  when: 'The same text-file interface',            category: 'functions' },
    { name: 'sys.excepthook', slug: 'excepthook', when: 'Writes tracebacks to sys.stderr' },
    { name: 'sys.getdefaultencoding', slug: 'getdefaultencoding', when: 'The other encodings Python uses' },
  ],

  faq: [
    {
      q: 'How do I print to stderr in Python?',
      a: "print('message', file=sys.stderr) — or sys.stderr.write('message\\n'). stderr is not captured by a shell redirect of stdout (>), so errors stay visible.",
    },
    {
      q: 'How do I capture what print() outputs?',
      a: 'with contextlib.redirect_stdout(io.StringIO()) as buf: … then buf.getvalue(). For output of another program use subprocess.run(..., capture_output=True, text=True).',
    },
    {
      q: 'Why does my output not appear immediately?',
      a: 'When stdout is not a terminal (a pipe, a file, some IDE consoles) it is block-buffered. Use print(..., flush=True), sys.stdout.flush(), or run python -u.',
    },
    {
      q: 'What are sys.__stdout__ and sys.__stderr__?',
      a: 'The original stream objects from interpreter startup. They let you restore or bypass a replaced sys.stdout, but saving the old value yourself before replacing it is the cleaner approach.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.stdout',
    meta:  'sys.stdin / stdout / stderr',
  },
};
