// content/reference/python/stdlib/os/get_terminal_size.js

export const meta = {
  slug:        'get_terminal_size',
  name:        'os.get_terminal_size',
  signature:   'os.get_terminal_size(fd=STDOUT_FILENO, /)',
  blurb:       'Ask the terminal behind a file descriptor for its size, as an os.terminal_size(columns, lines) tuple. Raises OSError when the fd is not a terminal; shutil.get_terminal_size() is the forgiving high-level version.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'os.get_terminal_size get_terminal_size terminal size width columns lines rows python console width os.terminal_size terminal_size shutil.get_terminal_size COLUMNS LINES fallback OSError not a terminal piped output',
};

export const method = {
  slug:      'get_terminal_size',
  name:      'os.get_terminal_size',
  signature: 'os.get_terminal_size(fd=STDOUT_FILENO, /)',
  returns:   { type: 'os.terminal_size', desc: 'A tuple subclass (columns, lines).' },

  category:    'os function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'The low-level query: it asks the terminal attached to fd (standard output by default) and raises OSError when output is piped, redirected or running under an IDE. Available on Unix and Windows. Most code should call shutil.get_terminal_size(), which checks COLUMNS/LINES first and falls back to a default instead of raising.',

  covers: ['get_terminal_size', 'terminal_size'],

  cheat: {
    commonCall: 'shutil.get_terminal_size().columns',
    returns:    'os.terminal_size(columns=..., lines=...)',
    replaces:   'parsing the output of stty size or tput cols',
    watchOut:   'os.get_terminal_size() raises OSError when stdout is not a terminal',
  },

  parameters: [
    { name: 'fd', type: 'int', required: false, default: 'STDOUT_FILENO', desc: 'File descriptor to query, 1 (standard output) by default. Positional only.' },
  ],

  patterns: [
    {
      name: 'Wrap text to the terminal width',
      desc: 'shutil never raises: it uses COLUMNS, the real terminal, or the fallback.',
      code: "import shutil, textwrap\nwidth = shutil.get_terminal_size(fallback=(80, 24)).columns\nprint(textwrap.fill(text, width=width))",
    },
    {
      name: 'Low-level query with your own fallback',
      desc: 'Catch OSError when output may be piped.',
      code: 'import os\ntry:\n    cols, lines = os.get_terminal_size()\nexcept OSError:\n    cols, lines = 80, 24',
    },
    {
      name: 'Ask stderr when stdout is redirected',
      desc: 'A progress bar on stderr still has a terminal even when stdout goes to a file.',
      code: 'import os, sys\ncols = os.get_terminal_size(sys.stderr.fileno()).columns',
    },
  ],

  examples: [
    { title: 'terminal_size is a named 2-tuple',  code: 'import os\nos.terminal_size((80, 24))', returns: 'os.terminal_size(columns=80, lines=24)' },
    { title: 'Fields by name or position',        code: 'import os\ns = os.terminal_size((80, 24))\n(s.columns, s.lines, s[0])', returns: '(80, 24, 80)' },
    { title: 'It unpacks like a tuple',           code: 'import os\ncols, rows = os.terminal_size((80, 24))\ncols * rows', returns: '1920' },
    { title: 'A pipe is not a terminal',          code: 'import os\nr, w = os.pipe()\ntry:\n    os.get_terminal_size(w)\nexcept OSError as e:\n    result = type(e).__name__\nfinally:\n    os.close(r)\n    os.close(w)\nresult', returns: "'OSError'" },
    { title: 'shutil reads COLUMNS and LINES first', code: "import os, shutil\nsaved = {k: os.environ.get(k) for k in ('COLUMNS', 'LINES')}\nos.environ['COLUMNS'], os.environ['LINES'] = '120', '40'\ntry:\n    size = shutil.get_terminal_size()\nfinally:\n    for k, v in saved.items():\n        if v is None:\n            os.environ.pop(k, None)\n        else:\n            os.environ[k] = v\nsize", returns: 'os.terminal_size(columns=120, lines=40)' },
    { title: 'Exactly two values required',       code: 'import os\nos.terminal_size((80,))', returns: 'TypeError: os.terminal_size() takes a 2-sequence (1-sequence given)' },
  ],

  pitfalls: [
    {
      name: 'Calling os.get_terminal_size() when output may be piped',
      desc: 'Under cron, CI, an IDE console or "python app.py | less" there is no terminal on the fd, and the call raises OSError. Catch it, or use shutil.get_terminal_size().',
      wrong: { label: 'no fallback', code: 'import os\nr, w = os.pipe()\ntry:\n    size = os.get_terminal_size(w)\nexcept OSError as e:\n    size = type(e).__name__  # uncaught, the program would stop here\nfinally:\n    os.close(r)\n    os.close(w)\nsize', output: "'OSError'" },
      fix:   { label: 'catch OSError', code: 'import os\nr, w = os.pipe()\ntry:\n    size = os.get_terminal_size(w)\nexcept OSError:\n    size = os.terminal_size((80, 24))\nfinally:\n    os.close(r)\n    os.close(w)\nsize.columns', output: '80' },
    },
    {
      name: 'Expecting a width from a non-terminal stream',
      desc: 'Code that checks the stream first avoids the exception altogether: isatty() is False for files, pipes and the captured stdout of test runners.',
      wrong: { label: 'assume a terminal', code: 'import io\nio.StringIO().fileno()', output: 'io.UnsupportedOperation: fileno' },
      fix:   { label: 'check isatty()', code: 'import io\nstream = io.StringIO()\nwidth = 120 if stream.isatty() else 80\nwidth', output: '80' },
    },
  ],

  when: {
    use: [
      'Formatting tables, progress bars and wrapped text to the terminal width',
      'Asking a specific fd (e.g. stderr) when you know it is a terminal',
    ],
    avoid: [
      'General scripts → shutil.get_terminal_size(fallback=(80, 24)), which never raises',
      'Reacting to window resizes → handle SIGWINCH (Unix) and query again',
    ],
  },

  notes: {
    cpython:       'Unix: the TIOCGWINSZ ioctl on fd (a pipe fails with errno 25, ENOTTY); Windows: the console API on the handle behind fd (a pipe fails with WinError 6). Uncaught, the OSError message therefore differs per platform',
    'Availability': 'Unix, Windows',
    'shutil':      'shutil.get_terminal_size(fallback=(80, 24)) uses COLUMNS and LINES if set, then os.get_terminal_size(sys.__stdout__.fileno()), then the fallback; it returns the same os.terminal_size type',
  },

  related: [
    { name: 'os.isatty', slug: 'openpty', when: 'Check whether an fd is a terminal first' },
    { name: 'os.environ', slug: 'environ', when: 'COLUMNS and LINES live here' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
    { name: 'OSError', slug: 'oserror', when: 'What a non-terminal fd raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo, and why do the examples build terminal_size by hand?',
      a: 'The size depends on the reader terminal, and when output is captured (as in our checks, a test runner or an IDE) there is no terminal at all. The examples construct terminal_size values and use a pipe to show the OSError path deterministically.',
    },
    {
      q: 'Should I use os.get_terminal_size or shutil.get_terminal_size?',
      a: 'shutil.get_terminal_size. The docs call it the high-level function that should normally be used: it respects COLUMNS/LINES and returns a fallback instead of raising. os.get_terminal_size is the low-level implementation.',
    },
    {
      q: 'Why does os.get_terminal_size raise OSError?',
      a: 'The file descriptor (standard output by default) is not connected to a terminal: output is piped, redirected to a file, or captured by an IDE or CI runner.',
    },
    {
      q: 'How do I get the terminal width in Python?',
      a: 'shutil.get_terminal_size().columns. It is a terminal_size tuple, so cols, lines = shutil.get_terminal_size() works too.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.get_terminal_size',
    meta:  'os.get_terminal_size / terminal_size',
  },
};
