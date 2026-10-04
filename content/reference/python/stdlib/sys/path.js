// content/reference/python/stdlib/sys/path.js — the import search path and its machinery

export const meta = {
  slug:        'path',
  name:        'sys.path / meta_path / path_hooks',
  signature:   'sys.path: list[str] · sys.meta_path · sys.path_hooks · sys.path_importer_cache',
  blurb:       'Where import looks: sys.path is the list of directories (and zip files) searched in order; meta_path, path_hooks and path_importer_cache are the finder machinery behind it.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'All versions (meta_path / path_hooks 2.3+, PEP 302)',
  searchTerms: 'sys.path path sys.meta_path meta_path sys.path_hooks path_hooks sys.path_importer_cache path_importer_cache import search path python add directory to path modulenotfounderror no module named pythonpath sys.path.append sys.path.insert finder importer',
};

export const method = {
  slug:      'path',
  name:      'sys.path / meta_path / path_hooks',
  signature: 'sys.path: list[str] · sys.meta_path · sys.path_hooks · sys.path_importer_cache',
  returns:   { type: 'list · list · list · dict', desc: 'path: directories searched by import. meta_path: finder objects. path_hooks: callables that make finders. path_importer_cache: path → finder.' },

  category:    'sys attribute',
  version:     'All versions (meta_path / path_hooks 2.3+, PEP 302)',
  hasLiveDemo: false,

  subtitle: "import json walks sys.meta_path; the PathFinder in it walks sys.path, asking path_hooks for a finder per entry and caching it in path_importer_cache. The first entry of sys.path is the script's own folder (or the current directory for -c, -m and the REPL) — which is why a local json.py can hide the standard library. The actual paths differ on every machine.",

  covers: ['path', 'meta_path', 'path_hooks', 'path_importer_cache'],

  cheat: {
    commonCall: "sys.path.insert(0, 'plugins')",
    returns:    'list of str, searched front to back',
    replaces:   'PYTHONPATH set from inside the program',
    watchOut:   'A file named like a stdlib module (json.py, random.py) in the first entry shadows it',
  },

  parameters: [],

  patterns: [
    {
      name: 'Load modules from an extra folder',
      desc: 'Insert at the front to win over installed packages; append to lose to them.',
      code: "import sys\nfrom pathlib import Path\nsys.path.insert(0, str(Path(__file__).parent / 'plugins'))\nimport my_plugin",
    },
    {
      name: 'Better: make the project installable',
      desc: 'An editable install puts the package on sys.path for every script and test.',
      code: '# shell, in the project folder with a pyproject.toml:\n# python -m pip install -e .',
    },
    {
      name: 'See where an import came from',
      desc: "When the wrong module loads, print its file and the search path.",
      code: "import sys, json\nprint(json.__file__)\nprint(*sys.path, sep='\\n')",
    },
    {
      name: 'Do not put the script folder first (3.11+)',
      desc: '-P or PYTHONSAFEPATH=1 skips prepending the potentially unsafe script/current directory.',
      code: '# shell:\n# python -P app.py',
    },
  ],

  examples: [
    { title: 'A list of strings',        code: 'import sys\n(type(sys.path).__name__, all(isinstance(p, str) for p in sys.path))', returns: "('list', True)" },
    { title: 'Importing from a folder you add', code: "import sys\nfrom pathlib import Path\nPath('plugins').mkdir()\nPath('plugins/hello_plugin.py').write_text('GREETING = \"hi\"\\n')\nsys.path.insert(0, 'plugins')\ntry:\n    import hello_plugin\n    result = hello_plugin.GREETING\nfinally:\n    sys.path.remove('plugins')\n    sys.path_importer_cache.pop('plugins', None)\n    sys.modules.pop('hello_plugin', None)\nresult", returns: "'hi'" },
    { title: 'With -c, the first entry is the current folder', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'import sys; print(repr(sys.path[0]))'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"''\"" },
    { title: 'The standard finders on meta_path', code: "import sys\nnames = [getattr(f, '__name__', type(f).__name__) for f in sys.meta_path]\n{'BuiltinImporter', 'FrozenImporter', 'PathFinder'} <= set(names)", returns: 'True' },
    { title: 'path_hooks can open zip files', code: "import sys\nany('zipimporter' in repr(h) for h in sys.path_hooks)", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Naming your file like a standard module',
      desc: "The script's folder (or the current folder) comes first on sys.path, so a local json.py is imported instead of the real json.",
      wrong: { label: 'json.py next to the script', code: "import subprocess, sys\nfrom pathlib import Path\nPath('json.py').write_text('x = 1\\n')\np = subprocess.run([sys.executable, '-c', 'import json; print(hasattr(json, \"dumps\"))'], capture_output=True, text=True)\np.stdout.strip()", output: "'False'" },
      fix:   { label: 'rename it', code: "import subprocess, sys\nfrom pathlib import Path\nPath('my_json_tools.py').write_text('x = 1\\n')\np = subprocess.run([sys.executable, '-c', 'import json; print(hasattr(json, \"dumps\"))'], capture_output=True, text=True)\np.stdout.strip()", output: "'True'" },
    },
    {
      name: 'Adding a Path object to sys.path',
      desc: 'Import only uses str entries; anything else is silently skipped. Convert with str().',
      wrong: { label: 'Path entry', code: "import sys\nfrom pathlib import Path\nPath('lib').mkdir()\nPath('lib/path_obj_demo.py').write_text('OK = True\\n')\nentry = Path('lib')\nsys.path.insert(0, entry)\ntry:\n    import path_obj_demo\n    result = 'imported'\nexcept ModuleNotFoundError as e:\n    result = str(e)\nfinally:\n    sys.path.remove(entry)\nresult", output: "\"No module named 'path_obj_demo'\"" },
      fix:   { label: 'str(Path)', code: "import sys\nfrom pathlib import Path\nPath('lib').mkdir()\nPath('lib/path_str_demo.py').write_text('OK = True\\n')\nsys.path.insert(0, str(Path('lib')))\ntry:\n    import path_str_demo\n    result = path_str_demo.OK\nfinally:\n    sys.path.remove('lib')\n    sys.path_importer_cache.pop('lib', None)\n    sys.modules.pop('path_str_demo', None)\nresult", output: 'True' },
    },
  ],

  when: {
    use: [
      'Plugin folders and one-off scripts that import from a sibling directory',
      'Debugging "No module named …" and "wrong module imported" problems',
      'Custom import machinery (meta_path finders, path hooks)',
    ],
    avoid: [
      'Making your own package importable → pip install -e .',
      'Per-run configuration → PYTHONPATH or a .pth file in site-packages',
      'Loading one file by path → importlib.util.spec_from_file_location',
    ],
  },

  notes: {
    cpython:         'Initialized at startup (Modules/getpath.py, PyConfig.module_search_paths), then extended by the site module (.pth files, user site-packages); the finders live in importlib._bootstrap / _bootstrap_external',
    'First entry':   "python script.py: the script's directory. python -m mod: the current directory. python -c and the REPL: '' (the current directory). -P / PYTHONSAFEPATH: none of these (3.11+)",
    'Caching':       'path_importer_cache maps each sys.path entry to its finder (None when no finder applies); remove an entry when you remove the folder',
    'meta_path':     'By default BuiltinImporter, FrozenImporter and PathFinder; tools such as editable installs may add their own finders',
  },

  related: [
    { name: 'sys.modules',   slug: 'modules', when: 'What has already been imported' },
    { name: 'sys.prefix',    slug: 'prefix',  when: 'Where the installation (and venv) lives' },
    { name: 'import',        slug: 'import',  when: 'The statement that uses all of this', category: 'keywords' },
    { name: 'ModuleNotFoundError', slug: 'modulenotfounderror', when: 'What a miss raises', category: 'exceptions' },
    { name: 'pathlib module', slug: 'pathlib', when: 'Build the folder path to add', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I add a directory to the Python path?',
      a: 'sys.path.insert(0, "/path/to/dir") (or append) before the import, inside the program. From outside, set PYTHONPATH, or add a .pth file to site-packages. For your own project, an editable install (pip install -e .) is cleaner.',
    },
    {
      q: 'Why does import pick up the wrong module?',
      a: "Probably a file or folder with the same name earlier on sys.path — often a json.py, random.py or test.py next to your script. print(module.__file__) shows which file was loaded; rename yours.",
    },
    {
      q: 'What are sys.meta_path and sys.path_hooks?',
      a: 'The import system: import asks each finder in sys.meta_path in turn. One of them, PathFinder, searches sys.path, using sys.path_hooks to create a finder for each entry (a folder, a zip file) and remembering it in sys.path_importer_cache.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.path',
    meta:  'sys.path',
  },
};
