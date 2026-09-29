// content/reference/python/exceptions/modulenotfounderror.js

export const meta = {
  slug:        'modulenotfounderror',
  name:        'ModuleNotFoundError',
  signature:   'ModuleNotFoundError(*args, name=None, path=None)',
  blurb:       'Raised when import cannot find a module at all: "No module named x" — not installed, installed into a different Python, misspelled, or not on sys.path.',
  category:    'import-syntax',
  type:        'exception',
  hasLiveDemo: false,
  version:     'Python 3.6+',
  searchTerms: 'modulenotfounderror module not found error no module named pip install wrong interpreter virtualenv venv sys.path is not a package import package missing dependency requirements jupyter vscode',
};

export const method = {
  slug:      'modulenotfounderror',
  name:      'ModuleNotFoundError',
  signature: 'ModuleNotFoundError(*args, name=None, path=None)',

  category:    'Import / syntax exception',
  version:     'Python 3.6+',
  hasLiveDemo: false,

  subtitle: "\"No module named x\" is about the interpreter that ran the code: the package is missing from that Python's environment, or its folder is not on that Python's sys.path — installing it \"somewhere\" is not enough.",

  chain: ['BaseException', 'Exception', 'ImportError', 'ModuleNotFoundError'],

  cheat: {
    raisedBy: 'import x, from x import y, importlib.import_module(), __import__()',
    message:  "No module named 'x' · No module named 'a.b'; 'a' is not a package",
    quickFix: 'python -m pip install <package> — with the same python that runs the code',
    watchOut: 'the pip name is not always the import name (pip install pyyaml → import yaml)',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string, "No module named \'x\'".' },
    { name: 'name',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. The module that could not be found.' },
    { name: 'path',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. Inherited from ImportError; normally None here.' },
  ],

  attributes: [
    { name: 'name', type: 'str | None', meaning: "The first module in the dotted path that is missing: for import pkg.sub with no pkg it is 'pkg'; with pkg present but no sub it is 'pkg.sub'." },
    { name: 'msg',  type: 'str',        meaning: "The message, \"No module named 'x'\" (plus \"; 'a' is not a package\" when a parent is a plain module)." },
    { name: 'path', type: 'str | None', meaning: 'Inherited from ImportError; None for a module that was not found.' },
  ],

  patterns: [
    {
      name: 'Install into the interpreter you run',
      desc: 'Run pip through the same python. In a notebook, %pip install installs into the kernel\'s environment.',
      code: "import sys, subprocess\n# which python is this? install into exactly that one\nprint(sys.executable)\nsubprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests'])",
    },
    {
      name: 'Optional dependency with a clear message',
      desc: 'Catch ModuleNotFoundError (not every ImportError) and say what to install.',
      code: "try:\n    import yaml\nexcept ModuleNotFoundError as e:\n    raise SystemExit(f'{e.name} is missing: pip install pyyaml') from None",
    },
    {
      name: 'Check without importing',
      desc: 'find_spec returns None instead of raising for a missing top-level module.',
      code: "import importlib.util\nHAS_NUMPY = importlib.util.find_spec('numpy') is not None",
    },
  ],

  examples: [
    { title: 'Module that is not installed',        code: 'import requests_not_installed_xyz', returns: "ModuleNotFoundError: No module named 'requests_not_installed_xyz'" },
    { title: 'e.name is the first missing piece',   code: "try:\n    import nosuch_pkg_mnf.sub\nexcept ModuleNotFoundError as e:\n    r = (e.name, e.msg)\nr", returns: "('nosuch_pkg_mnf', \"No module named 'nosuch_pkg_mnf'\")" },
    { title: 'Parent is a module, not a package',   code: 'import os.path.nope', returns: "ModuleNotFoundError: No module named 'os.path.nope'; 'os.path' is not a package" },
    { title: 'Removed from the standard library',   code: 'import imp', returns: "ModuleNotFoundError: No module named 'imp'" },
    { title: 'None in sys.modules blocks an import', code: "import sys\nsys.modules['mnf_blocked'] = None\ntry:\n    import mnf_blocked\nexcept ModuleNotFoundError as e:\n    r = str(e)\nfinally:\n    del sys.modules['mnf_blocked']\nr", returns: "'import of mnf_blocked halted; None in sys.modules'" },
    { title: 'find_spec() checks without raising',  code: "import importlib.util\nimportlib.util.find_spec('mnf_missing_xyz') is None", returns: 'True' },
    { title: 'It is an ImportError',                code: "e = ModuleNotFoundError(\"No module named 'yaml'\", name='yaml')\n(str(e), e.name, isinstance(e, ImportError))", returns: "(\"No module named 'yaml'\", 'yaml', True)" },
  ],

  pitfalls: [
    {
      name: 'Not checking which module is missing',
      desc: "A package that IS installed can raise ModuleNotFoundError for one of its own dependencies. A bare except then takes the \"not installed\" path and hides the real problem. Compare e.name with the module you tried to import and re-raise anything else.",
      wrong: { label: 'Any missing module', code: "import os, sys\nwith open('mnf_wrap_a.py', 'w') as f:\n    f.write('import mnf_dep_a\\n')\nsys.path.insert(0, os.getcwd())\ntry:\n    import mnf_wrap_a\nexcept ModuleNotFoundError:\n    mnf_wrap_a = None\nfinally:\n    sys.path.remove(os.getcwd())\nmnf_wrap_a is None", output: 'True' },
      fix:   { label: 'Check e.name', code: "import os, sys\nwith open('mnf_wrap_b.py', 'w') as f:\n    f.write('import mnf_dep_b\\n')\nsys.path.insert(0, os.getcwd())\ntry:\n    import mnf_wrap_b\nexcept ModuleNotFoundError as e:\n    if e.name != 'mnf_wrap_b':\n        raise\n    mnf_wrap_b = None\nfinally:\n    sys.path.remove(os.getcwd())", output: "ModuleNotFoundError: No module named 'mnf_dep_b'" },
    },
    {
      name: 'Using the pip name as the import name',
      desc: 'Distribution names on PyPI and module names often differ: pyyaml → yaml, beautifulsoup4 → bs4, scikit-learn → sklearn, opencv-python → cv2, pillow → PIL. Importing the distribution name fails even after a successful install.',
      wrong: { label: 'import pyyaml', code: 'import pyyaml_mnf_example', output: "ModuleNotFoundError: No module named 'pyyaml_mnf_example'" },
      fix:   { label: 'Check the docs for the import name', code: "import importlib.util\nimportlib.util.find_spec('json') is not None", output: 'True' },
    },
  ],

  when: {
    use: [
      'Optional dependencies: catch it, check e.name, fall back or explain what to install',
      'Plugin systems that import modules by name from configuration',
    ],
    avoid: [
      'Catching it to hide a missing required dependency → fail loudly with the install command',
      'Checking the Python version for stdlib modules → catch it, or check sys.version_info',
    ],
  },

  notes: {
    cpython:          'Lib/importlib/_bootstrap.py _find_and_load_unlocked() — "No module named …"; "; \'x\' is not a package" when the parent has no __path__',
    'Catch via':      'except ImportError catches it too (it is a subclass)',
    'Shadowing (3.13)': 'A local file named like the module is imported first; 3.13 appends "(consider renaming …)" to the resulting AttributeError/ImportError',
    'sys.path[0]':    'The script\'s own directory (or the current directory for -m, -c and the REPL) is searched first',
  },

  related: [
    { name: 'ImportError',    slug: 'importerror',    when: 'Module found, but the name is not in it' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a shadowing local file usually causes' },
    { name: 'SyntaxError',    slug: 'syntaxerror',    when: 'Module found, but it does not compile' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Whether an import succeeds depends entirely on the environment of the interpreter that runs it — which packages are installed, which virtual environment is active, the operating system, and sys.path. A browser demo cannot reproduce your environment honestly, so the examples use module names that cannot exist anywhere, plus stdlib behavior that is the same on every platform.',
    },
    {
      q: 'I installed the package with pip — why do I still get "No module named"?',
      a: 'pip installed it into a different Python than the one running your code. Print sys.executable in the failing program, then install with that exact interpreter: /path/to/python -m pip install package. Typical mismatches: a virtual environment that is not activated, an IDE (VS Code, PyCharm) or Jupyter kernel pointing at another interpreter, several Python versions installed side by side, or sudo pip vs. user pip.',
    },
    {
      q: 'Why do I get ModuleNotFoundError for my own module?',
      a: 'Imports are resolved from sys.path, not from the current file\'s folder in general. When you run python src/app.py, only src/ is on sys.path — a sibling package one level up is invisible. Run from the project root with python -m src.app, install the project in editable mode (pip install -e .), or fix the package layout. Also check the folder name matches the import exactly (case matters on Linux and macOS).',
    },
    {
      q: "What does \"No module named 'a.b'; 'a' is not a package\" mean?",
      a: "Python found a, but it is a single-file module, not a package (a directory), so it cannot contain b. Very often a is your own file shadowing a real package of the same name — e.g. a local json.py, random.py or requests.py. Rename your file (and delete any stale __pycache__). When the shadowing file is imported successfully and you then use a missing attribute, Python 3.13 adds \"consider renaming …\" to that AttributeError or ImportError; this is-not-a-package message gets no such hint.",
    },
    {
      q: 'What is the difference between ModuleNotFoundError and ImportError?',
      a: 'ModuleNotFoundError (added in 3.6) is the ImportError subclass for "the module could not be found". Plain ImportError is used when the module was found but something else failed — a missing name (cannot import name), a relative import outside a package, or a circular import. Catch ModuleNotFoundError when you only want to handle "not installed".',
    },
  ],

  history: [
    { version: '3.6', note: 'Added as a subclass of ImportError.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ModuleNotFoundError',
    meta:  'Built-in exceptions',
  },
};
