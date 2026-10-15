// content/reference/python/stdlib/shutil/get_terminal_size.js

export const meta = {
  slug:        'get_terminal_size',
  name:        'shutil.get_terminal_size',
  signature:   'shutil.get_terminal_size(fallback=(80, 24))',
  blurb:       'The size of the terminal as os.terminal_size(columns, lines): the COLUMNS and LINES environment variables if set, else the terminal on standard output, else the fallback.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'shutil get_terminal_size terminal width console width columns lines python terminal size COLUMNS LINES environment fallback 80 24 os.terminal_size progress bar text wrap width',
};

export const method = {
  slug:      'get_terminal_size',
  name:      'shutil.get_terminal_size',
  signature: 'shutil.get_terminal_size(fallback=(80, 24))',
  returns:   { type: 'os.terminal_size', desc: 'A (columns, lines) named tuple.' },

  category:    'shutil function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'The high-level version of os.get_terminal_size: no terminal is not an error. Positive integers in COLUMNS / LINES win; otherwise sys.__stdout__ is asked, and if that is not a terminal (a pipe, a file, an IDE) or answers 0, the fallback is used. The real answer depends on where your program runs, so this page has no live demo.',

  covers: ['get_terminal_size'],

  cheat: {
    commonCall: 'shutil.get_terminal_size().columns',
    returns:    'os.terminal_size(columns=…, lines=…)',
    replaces:   'os.get_terminal_size() wrapped in try/except OSError',
    watchOut:   'Piped or redirected output gets the fallback, not the real window size',
  },

  parameters: [
    { name: 'fallback', type: 'tuple[int, int]', required: false, default: '(80, 24)', desc: '(columns, lines) to use when neither the environment nor the terminal gives a size.' },
  ],

  patterns: [
    {
      name: 'Wrap text to the terminal width',
      desc: 'textwrap with the current width.',
      code: "import shutil, textwrap\nwidth = shutil.get_terminal_size().columns\nprint(textwrap.fill(long_text, width=width))",
    },
    {
      name: 'A full-width separator line',
      desc: 'Works in pipes too, thanks to the fallback.',
      code: "import shutil\nprint('-' * shutil.get_terminal_size().columns)",
    },
    {
      name: 'Force a width in tests',
      desc: 'Set both variables so the terminal is never asked.',
      code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '100', 'LINES': '30'}):\n    run_cli()",
    },
  ],

  examples: [
    { title: 'Environment variables win', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '120', 'LINES': '40'}):\n    size = shutil.get_terminal_size()\nsize", returns: 'os.terminal_size(columns=120, lines=40)' },
    { title: 'It is a named tuple', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '120', 'LINES': '40'}):\n    columns, lines = shutil.get_terminal_size()\n(columns, lines)", returns: '(120, 40)' },
    { title: 'Values go through int()', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': ' 100 ', 'LINES': '1_000'}):\n    size = tuple(shutil.get_terminal_size())\nsize", returns: '(100, 1000)' },
    { title: 'COLUMNS alone fixes the width', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '72'}):\n    width = shutil.get_terminal_size().columns\nwidth", returns: '72' },
    { title: 'The result type comes from os', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '80', 'LINES': '24'}):\n    result = type(shutil.get_terminal_size()) is os.terminal_size\nresult", returns: 'True' },
    { title: 'Not a terminal: the fallback', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True), mock.patch('os.get_terminal_size', side_effect=OSError):\n    sizes = (shutil.get_terminal_size(), shutil.get_terminal_size(fallback=(100, 40)))\nsizes", returns: '(os.terminal_size(columns=80, lines=24), os.terminal_size(columns=100, lines=40))' },
    { title: 'A terminal reporting 0 x 0 also falls back (3.11+)', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True), mock.patch('os.get_terminal_size', return_value=os.terminal_size((0, 0))):\n    size = shutil.get_terminal_size()\nsize", returns: 'os.terminal_size(columns=80, lines=24)' },
  ],

  pitfalls: [
    {
      name: 'Using os.get_terminal_size directly',
      desc: 'os.get_terminal_size raises OSError when the descriptor is not a terminal — under cron, in CI, or with output redirected to a file. shutil’s version falls back instead.',
      wrong: { label: 'os.get_terminal_size(fd)', code: "import os\nwith open('out.txt', 'w') as f:\n    try:\n        os.get_terminal_size(f.fileno())\n    except OSError as e:\n        result = type(e).__name__\nresult", output: "'OSError'" },
      fix:   { label: 'shutil.get_terminal_size', code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, clear=True), mock.patch('os.get_terminal_size', side_effect=OSError):\n    size = shutil.get_terminal_size()\nsize.columns", output: '80' },
    },
    {
      name: 'A width of 0 or a non-number in COLUMNS',
      desc: "Only positive integers count. COLUMNS='wide' (or '0') is ignored and the terminal — or, as here without one, the fallback — decides instead, so a typo silently changes your layout.",
      wrong: { label: "COLUMNS='wide'", code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': 'wide', 'LINES': '24'}, clear=True), mock.patch('os.get_terminal_size', side_effect=OSError):\n    width = shutil.get_terminal_size().columns\nwidth", output: '80' },
      fix:   { label: "COLUMNS='100'", code: "import os, shutil\nfrom unittest import mock\nwith mock.patch.dict(os.environ, {'COLUMNS': '100', 'LINES': '24'}, clear=True), mock.patch('os.get_terminal_size', side_effect=OSError):\n    width = shutil.get_terminal_size().columns\nwidth", output: '100' },
    },
  ],

  when: {
    use: [
      'Sizing progress bars, tables and wrapped text in command-line tools',
      'Any code that may run with redirected output',
    ],
    avoid: [
      'Asking about a specific file descriptor → os.get_terminal_size(fd)',
      'Full-screen terminal apps → curses (it tracks resizes)',
    ],
  },

  notes: {
    cpython:      "Lib/shutil.py: int(os.environ['COLUMNS']) / ['LINES'] (KeyError or ValueError → 0); if either is <= 0, os.get_terminal_size(sys.__stdout__.fileno()), with the fallback on AttributeError, ValueError or OSError",
    '3.11':       'The fallback values are also used when os.get_terminal_size() returns zeroes',
    'stdout':     'It asks sys.__stdout__ (the original stdout), so redirecting sys.stdout inside Python does not change the answer',
  },

  related: [
    { name: 'os.get_terminal_size', slug: 'get_terminal_size', when: 'The low-level call that can raise', category: 'stdlib/os' },
    { name: 'os.environ',           slug: 'environ',           when: 'COLUMNS and LINES live there', category: 'stdlib/os' },
    { name: 'shutil module',        slug: 'shutil',            when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the terminal width in Python?',
      a: 'shutil.get_terminal_size().columns. It reads the COLUMNS variable or asks the terminal, and returns the fallback (80 by default) when output is not a terminal. This page has no live demo because the real answer depends on the window your program runs in; the examples set COLUMNS / LINES or replace os.get_terminal_size so their output is fixed.',
    },
    {
      q: 'Why does get_terminal_size always return 80 x 24?',
      a: 'Your output is not a terminal — it is piped, redirected, or captured by an IDE or CI runner — so the fallback is used. Set COLUMNS and LINES, or pass a different fallback.',
    },
    {
      q: 'What is the difference between shutil.get_terminal_size and os.get_terminal_size?',
      a: 'os.get_terminal_size(fd) asks one file descriptor and raises OSError if it is not a terminal. shutil.get_terminal_size first honours COLUMNS/LINES, then asks standard output, and falls back instead of raising.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.get_terminal_size',
    meta:  'shutil.get_terminal_size',
  },

};
