// content/reference/python/stdlib/sys/prefix.js — installation paths and the interpreter binary

export const meta = {
  slug:        'prefix',
  name:        'sys.prefix / base_prefix / executable',
  signature:   'sys.prefix · sys.exec_prefix · sys.base_prefix · sys.base_exec_prefix · sys.executable · sys.platlibdir',
  blurb:       'Where this Python lives: executable is the interpreter binary, prefix/exec_prefix the installation (or the active virtual environment), base_prefix/base_exec_prefix the installation a venv was created from.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'All versions (base_* 3.3+, platlibdir 3.9+)',
  searchTerms: 'sys.prefix prefix sys.exec_prefix exec_prefix sys.base_prefix base_prefix sys.base_exec_prefix base_exec_prefix sys.executable executable sys.platlibdir platlibdir am i in a virtual environment detect venv python path to python interpreter subprocess same python real_prefix site-packages',
};

export const method = {
  slug:      'prefix',
  name:      'sys.prefix / base_prefix / executable',
  signature: 'sys.prefix · sys.exec_prefix · sys.base_prefix · sys.base_exec_prefix · sys.executable · sys.platlibdir',
  returns:   { type: 'str', desc: 'Absolute directory paths, the interpreter path, and the library directory name ("lib", "lib64", or "DLLs" on Windows).' },

  category:    'sys attribute',
  version:     'All versions (base_* 3.3+, platlibdir 3.9+)',
  hasLiveDemo: false,

  subtitle: 'Inside a virtual environment prefix points at the venv and base_prefix at the Python it came from — comparing the two is the standard "am I in a venv?" test. sys.executable is the right program to start for a child Python. All of these are paths on the reader\'s machine, so the examples create a venv or start a child process to get portable answers.',

  covers: ['prefix', 'exec_prefix', 'base_prefix', 'base_exec_prefix', 'executable', 'platlibdir'],

  cheat: {
    commonCall: 'in_venv = sys.prefix != sys.base_prefix',
    returns:    'True inside a venv',
    replaces:   "hasattr(sys, 'real_prefix') (legacy virtualenv only)",
    watchOut:   "Start child Pythons with sys.executable, not 'python'",
  },

  parameters: [],

  patterns: [
    {
      name: 'Am I in a virtual environment?',
      desc: 'Works for venv and modern virtualenv.',
      code: 'import sys\nin_venv = sys.prefix != sys.base_prefix',
    },
    {
      name: 'Run pip or a module with this same interpreter',
      desc: "'python' on PATH may be a different installation.",
      code: "import subprocess, sys\nsubprocess.run([sys.executable, '-m', 'pip', 'install', 'requests'], check=True)",
    },
    {
      name: 'Installation directories, the portable way',
      desc: 'sysconfig knows the layout of every platform and scheme.',
      code: "import sysconfig\nsysconfig.get_path('purelib')   # site-packages of this environment\nsysconfig.get_path('stdlib')    # the standard library",
    },
  ],

  examples: [
    { title: 'The interpreter can start itself', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'print(6 * 7)'], capture_output=True, text=True)\np.stdout", returns: "'42\\n'" },
    { title: 'Inside a fresh venv',             code: "import os, subprocess, sys, venv\nvenv.create('env', with_pip=False)\npy = os.path.join('env', 'Scripts' if os.name == 'nt' else 'bin', 'python')\ncheck = 'import sys; print(sys.prefix != sys.base_prefix)'\nsubprocess.run([py, '-c', check], capture_output=True, text=True).stdout.strip()", returns: "'True'" },
    { title: 'All of them are strings',         code: 'import sys\nall(isinstance(p, str) for p in (sys.prefix, sys.exec_prefix, sys.base_prefix, sys.base_exec_prefix, sys.platlibdir))', returns: 'True' },
    { title: 'An absolute path to the binary',  code: 'import os, sys\nos.path.isabs(sys.executable)', returns: 'True' },
    { title: 'platlibdir is a directory name',  code: "import sys\nsys.platlibdir in ('lib', 'lib64', 'DLLs')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: "Detecting a venv with sys.real_prefix",
      desc: 'Only legacy releases of the third-party virtualenv tool set sys.real_prefix. The standard venv module never does; compare prefix with base_prefix.',
      wrong: { label: 'real_prefix', code: "import os, subprocess, sys, venv\nvenv.create('env', with_pip=False)\npy = os.path.join('env', 'Scripts' if os.name == 'nt' else 'bin', 'python')\ncheck = 'import sys; print(hasattr(sys, \"real_prefix\"))'\nsubprocess.run([py, '-c', check], capture_output=True, text=True).stdout.strip()", output: "'False'" },
      fix:   { label: 'prefix != base_prefix', code: "import os, subprocess, sys, venv\nvenv.create('env', with_pip=False)\npy = os.path.join('env', 'Scripts' if os.name == 'nt' else 'bin', 'python')\ncheck = 'import sys; print(sys.prefix != sys.base_prefix)'\nsubprocess.run([py, '-c', check], capture_output=True, text=True).stdout.strip()", output: "'True'" },
    },
    {
      name: 'Looking for the standard library under sys.prefix',
      desc: 'In a venv, prefix is the venv; the standard library stays in the base installation. Ask sysconfig instead of building paths.',
      wrong: { label: 'under prefix', code: "import os, subprocess, sys, venv\nvenv.create('env', with_pip=False)\npy = os.path.join('env', 'Scripts' if os.name == 'nt' else 'bin', 'python')\ncheck = 'import sys, sysconfig; print(sysconfig.get_path(\"stdlib\").startswith(sys.prefix))'\nsubprocess.run([py, '-c', check], capture_output=True, text=True).stdout.strip()", output: "'False'" },
      fix:   { label: 'under base_prefix', code: "import os, subprocess, sys, venv\nvenv.create('env', with_pip=False)\npy = os.path.join('env', 'Scripts' if os.name == 'nt' else 'bin', 'python')\ncheck = 'import sys, sysconfig; print(sysconfig.get_path(\"stdlib\").startswith(sys.base_prefix))'\nsubprocess.run([py, '-c', check], capture_output=True, text=True).stdout.strip()", output: "'True'" },
    },
  ],

  when: {
    use: [
      'Starting a child Python or "python -m tool" with the same interpreter (executable)',
      'Detecting a virtual environment (prefix vs base_prefix)',
      'Diagnostics: which installation is running',
    ],
    avoid: [
      'Building install paths by hand → sysconfig.get_path / get_paths',
      'Finding a package\'s files → importlib.resources or module.__file__',
    ],
  },

  notes: {
    cpython:          'Computed at startup by Modules/getpath.py (PyConfig.prefix, exec_prefix, base_prefix …); in a venv, pyvenv.cfg next to the venv\'s python tells it where the base installation is',
    'exec_prefix':    'Differs from prefix only when platform-dependent files are installed separately (configure --exec-prefix); usually the two are equal',
    'executable':     'Can be an empty string or None when Python cannot determine its own path (e.g. some embedded interpreters)',
    'platlibdir':     '"lib" on most Unix systems, "lib64" on Fedora/SuSE 64-bit, "DLLs" on Windows',
  },

  related: [
    { name: 'sys.path',     slug: 'path',    when: 'The import search path derived from these directories' },
    { name: 'sys.flags',    slug: 'flags',   when: 'How the interpreter was started' },
    { name: 'sys.version_info', slug: 'version', when: 'Which version this installation is' },
    { name: 'sys module',   slug: 'sys',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if Python is running in a virtual environment?',
      a: 'sys.prefix != sys.base_prefix is True inside a venv (Python 3.3+). The VIRTUAL_ENV environment variable is only set when the venv was activated in a shell, so it misses venvs run directly by path.',
    },
    {
      q: 'How do I get the path of the Python interpreter?',
      a: 'sys.executable — the absolute path of the binary running your code. Use it to start subprocesses that must use the same Python and packages.',
    },
    {
      q: 'What is the difference between sys.prefix and sys.base_prefix?',
      a: 'Outside a virtual environment they are the same. Inside one, sys.prefix is the venv directory and sys.base_prefix is the Python installation the venv was created from.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.prefix',
    meta:  'sys.prefix',
  },
};
