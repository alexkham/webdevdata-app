// content/reference/python/stdlib/os/getcwd.js

export const meta = {
  slug:        'getcwd',
  name:        'os.getcwd',
  signature:   'os.getcwd() / os.getcwdb() / os.chdir(path) / os.fchdir(fd) / os.chroot(path)',
  blurb:       'Read the current working directory (as str or bytes) and change it - by path, by open directory descriptor, or change the root directory itself.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all)',
  searchTerms: 'os.getcwd getcwd os.getcwdb getcwdb os.chdir chdir os.fchdir fchdir os.chroot chroot current working directory python cwd change directory cd pwd contextlib.chdir restore working directory relative path',
};

export const method = {
  slug:      'getcwd',
  name:      'os.getcwd',
  signature: 'os.getcwd() / os.getcwdb() / os.chdir(path) / os.fchdir(fd) / os.chroot(path)',
  returns:   { type: 'str | bytes | None', desc: 'getcwd returns an absolute str path, getcwdb the same as bytes; chdir, fchdir and chroot return None.' },

  category:    'os function',
  version:     'Python 3 (all)',
  hasLiveDemo: false,

  subtitle: 'The working directory is process-wide state: every relative path, in every thread, is resolved against it. getcwd, getcwdb and chdir work everywhere; fchdir is Unix only and chroot is Unix only (not WASI, not Android). Prefer contextlib.chdir (Python 3.11+), which restores the old directory when the block ends.',

  covers: ['getcwd', 'getcwdb', 'chdir', 'fchdir', 'chroot'],

  cheat: {
    commonCall: 'with contextlib.chdir(path): ...',
    returns:    'getcwd() → absolute str path',
    replaces:   'Shelling out to pwd / cd',
    watchOut:   'chdir affects the whole process and all threads',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike | int', required: true, default: null, desc: 'chdir / chroot: the new directory. chdir also accepts an open directory file descriptor where os.supports_fd contains it (Unix).' },
    { name: 'fd',   type: 'int', required: true, default: null, desc: 'fchdir: a file descriptor of an open directory (not a regular file). Equivalent to os.chdir(fd).' },
  ],

  patterns: [
    {
      name: 'Temporarily work in another directory',
      desc: 'contextlib.chdir (3.11+) restores the previous directory even when the block raises.',
      code: "import contextlib\nimport subprocess\nwith contextlib.chdir('frontend'):\n    subprocess.run(['npm', 'run', 'build'], check=True)",
    },
    {
      name: 'Run relative to the script, not the caller',
      desc: 'Better than chdir: build absolute paths from the script location.',
      code: "import os\nhere = os.path.dirname(os.path.abspath(__file__))\nconfig = os.path.join(here, 'config.toml')",
    },
    {
      name: 'Before Python 3.11',
      desc: 'The same restore logic by hand.',
      code: "import os\nprev = os.getcwd()\nos.chdir('build')\ntry:\n    run_build()\nfinally:\n    os.chdir(prev)",
    },
    {
      name: 'Come back via a directory descriptor (Unix)',
      desc: 'fchdir returns to a directory even if it was renamed meanwhile.',
      code: "import os\nhome_fd = os.open('.', os.O_RDONLY)\ntry:\n    os.chdir('/tmp')\n    ...\nfinally:\n    os.fchdir(home_fd)\n    os.close(home_fd)",
    },
  ],

  examples: [
    { title: 'Inside contextlib.chdir',          code: "import contextlib\nimport os\nos.mkdir('sub')\nwith contextlib.chdir('sub'):\n    inside = os.path.basename(os.getcwd())\ninside", returns: "'sub'" },
    { title: 'Restored afterwards',              code: "import contextlib\nimport os\nstart = os.getcwd()\nos.mkdir('sub')\nwith contextlib.chdir('sub'):\n    pass\nos.getcwd() == start", returns: 'True' },
    { title: 'getcwd is always absolute',        code: "import os\n(os.path.isabs(os.getcwd()), os.path.abspath('x') == os.path.join(os.getcwd(), 'x'))", returns: '(True, True)' },
    { title: 'getcwdb returns bytes',            code: "import os\n(type(os.getcwdb()).__name__, os.fsdecode(os.getcwdb()) == os.getcwd())", returns: "('bytes', True)" },
    { title: 'chdir to a missing directory',     code: "import os\ntry:\n    os.chdir('missing')\nexcept OSError as e:\n    result = (type(e).__name__, e.errno)\nresult", returns: "('FileNotFoundError', 2)" },
    { title: 'chdir to a file',                  code: "import os\nopen('notes.txt', 'w').close()\ntry:\n    os.chdir('notes.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'NotADirectoryError'" },
  ],

  pitfalls: [
    {
      name: 'chdir without restoring it',
      desc: 'If the code after chdir raises, the process stays in the other directory and every later relative path is wrong.',
      wrong: { label: 'bare chdir',        code: "import os\nstart = os.getcwd()\nos.mkdir('build')\ndef build():\n    os.chdir('build')\n    raise RuntimeError('compile failed')\ntry:\n    build()\nexcept RuntimeError:\n    pass\nmoved = os.getcwd() != start\nos.chdir(start)\nmoved", output: 'True' },
      fix:   { label: 'contextlib.chdir',  code: "import contextlib\nimport os\nstart = os.getcwd()\nos.mkdir('build')\ndef build():\n    with contextlib.chdir('build'):\n        raise RuntimeError('compile failed')\ntry:\n    build()\nexcept RuntimeError:\n    pass\nos.getcwd() != start", output: 'False' },
    },
    {
      name: 'Relative paths change meaning after chdir',
      desc: 'A relative path is resolved at the moment it is used. Make it absolute before changing directory.',
      wrong: { label: 'relative', code: "import contextlib\nimport os\nopen('data.txt', 'w').close()\nos.mkdir('sub')\np = 'data.txt'\nwith contextlib.chdir('sub'):\n    found = os.path.exists(p)\nfound", output: 'False' },
      fix:   { label: 'abspath first', code: "import contextlib\nimport os\nopen('data.txt', 'w').close()\nos.mkdir('sub')\np = os.path.abspath('data.txt')\nwith contextlib.chdir('sub'):\n    found = os.path.exists(p)\nfound", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reporting where the program runs, resolving user-supplied relative paths',
      'Running a tool that must be started inside a given folder (or pass cwd= to subprocess.run instead)',
    ],
    avoid: [
      'Threaded or async code → pass absolute paths; chdir is global',
      'Starting a child in another folder → subprocess.run(..., cwd=folder)',
      'Sandboxing → chroot is not a security boundary on its own and needs root',
    ],
  },

  notes: {
    cpython:       'Thin wrappers over getcwd() / chdir() / fchdir() / chroot() in Modules/posixmodule.c. contextlib.chdir (Lib/contextlib.py) stores os.getcwd() on enter and calls os.chdir back on exit',
    'Availability': 'getcwd, getcwdb, chdir: Unix and Windows. fchdir: Unix. chroot: Unix, not WASI, not Android. chdir(fd) works only where os.chdir is in os.supports_fd (true on Linux, false on Windows)',
    'chroot':      'Changes the root directory of the process; an unprivileged call fails with PermissionError (EPERM, verified on Linux)',
    'getcwdb':     'Since 3.8 it uses UTF-8 on Windows instead of the ANSI code page and is no longer deprecated there',
    'Errors':      'chdir raises FileNotFoundError, NotADirectoryError or PermissionError (all OSError)',
  },

  related: [
    { name: 'os.path.abspath', slug: 'abspath', when: 'Turn a relative path absolute against the cwd', category: 'stdlib/os-path' },
    { name: 'os.listdir / scandir', slug: 'listdir', when: 'List the cwd (the default path is ".")' },
    { name: 'os.path constants', slug: 'sep', when: 'curdir is "."' },
    { name: 'Path.resolve', slug: 'resolve', when: 'pathlib: absolute path, Path.cwd()', category: 'stdlib/pathlib' },
    { name: 'NotADirectoryError', slug: 'notadirectoryerror', when: 'chdir into a file', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: "Why does this page have no live demo?",
      a: "The current directory is different on every machine and every run, so its value is never shown. The examples change into folders they create (with contextlib.chdir, which changes back) and compare names and paths relative to them.",
    },
    {
      q: 'How do I get the current directory in Python?',
      a: 'os.getcwd() returns it as an absolute str; pathlib.Path.cwd() returns it as a Path. It is the directory the process was started from unless something called os.chdir.',
    },
    {
      q: 'How do I change directory temporarily?',
      a: 'with contextlib.chdir(path): ... (Python 3.11+). The old directory comes back when the block ends, even after an exception. Before 3.11 use os.getcwd() plus os.chdir in try/finally.',
    },
    {
      q: 'Why is getcwd() not the folder of my script?',
      a: 'The working directory is where the process was started (the shell directory), not where the .py file lives. Use os.path.dirname(os.path.abspath(__file__)) for the script folder.',
    },
    {
      q: 'Is os.chdir thread-safe?',
      a: 'It does not crash, but the working directory belongs to the whole process, so changing it in one thread changes how every other thread resolves relative paths. Use absolute paths in threaded code.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.getcwd',
    meta:  'os.getcwd / chdir',
  },
};
