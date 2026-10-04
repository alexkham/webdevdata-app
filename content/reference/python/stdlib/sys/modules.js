// content/reference/python/stdlib/sys/modules.js — sys.modules and the module name lists

export const meta = {
  slug:        'modules',
  name:        'sys.modules / stdlib_module_names / builtin_module_names',
  signature:   'sys.modules: dict[str, module] · sys.stdlib_module_names: frozenset[str] · sys.builtin_module_names: tuple[str, ...]',
  blurb:       'sys.modules is the cache of every imported module — import checks it first. stdlib_module_names (3.10+) lists the standard library; builtin_module_names the modules compiled into the interpreter.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'All versions (stdlib_module_names 3.10+)',
  searchTerms: 'sys.modules modules sys.stdlib_module_names stdlib_module_names sys.builtin_module_names builtin_module_names module cache loaded modules is module imported list standard library modules reload module dictionary changed size during iteration',
};

export const method = {
  slug:      'modules',
  name:      'sys.modules / stdlib_module_names / builtin_module_names',
  signature: 'sys.modules: dict[str, module] · sys.stdlib_module_names: frozenset[str] · sys.builtin_module_names: tuple[str, ...]',
  returns:   { type: 'dict · frozenset · tuple', desc: 'modules: name → module for everything imported so far. stdlib_module_names: top-level stdlib names. builtin_module_names: modules built into the binary.' },

  category:    'sys attribute',
  version:     'All versions (stdlib_module_names 3.10+)',
  hasLiveDemo: false,

  subtitle: 'A module body runs once: the first import stores the module in sys.modules and every later import returns that same object. The two name lists answer "is this part of Python itself?" — stdlib_module_names is the same on every platform, builtin_module_names depends on how the interpreter was built.',

  covers: ['modules', 'stdlib_module_names', 'builtin_module_names'],

  cheat: {
    commonCall: "'numpy' in sys.modules",
    returns:    'True if it has been imported in this process',
    replaces:   'try: import x except ImportError (when you only want to know if it is loaded)',
    watchOut:   'Iterate over a copy: imports change the dict',
  },

  parameters: [],

  patterns: [
    {
      name: 'Only use a library if the program already loaded it',
      desc: 'Common in libraries that support optional integrations without importing them.',
      code: "import sys\nnp = sys.modules.get('numpy')\nif np is not None and isinstance(value, np.ndarray):\n    value = value.tolist()",
    },
    {
      name: 'Separate stdlib from third-party imports',
      desc: 'Top-level name only: email.mime is listed as email.',
      code: "import sys\ndef is_stdlib(module_name):\n    return module_name.partition('.')[0] in sys.stdlib_module_names",
    },
    {
      name: 'Re-import a module you edited',
      desc: 'importlib.reload re-runs the module body in the same module object.',
      code: 'import importlib\nimport mymodule\nimportlib.reload(mymodule)',
    },
  ],

  examples: [
    { title: 'import returns the cached module', code: "import sys, json\nsys.modules['json'] is json", returns: 'True' },
    { title: 'A module body runs only once', code: "import sys\nfrom pathlib import Path\nPath('noisy_mod.py').write_text('print(\"module body runs\")\\n')\nsys.path.insert(0, '.')\ntry:\n    import noisy_mod\n    import noisy_mod\nfinally:\n    sys.path.remove('.')\n    sys.path_importer_cache.pop('.', None)\n    sys.modules.pop('noisy_mod', None)", returns: 'module body runs' },
    { title: 'Standard library or not?',   code: "import sys\n[name in sys.stdlib_module_names for name in ('json', 'asyncio', 'requests', 'numpy')]", returns: '[True, True, False, False]' },
    { title: 'Only top-level packages are listed', code: "import sys\n('email' in sys.stdlib_module_names, 'email.mime' in sys.stdlib_module_names)", returns: '(True, False)' },
    { title: 'sys itself is compiled in',   code: "import sys\n('sys' in sys.builtin_module_names, 'json' in sys.builtin_module_names)", returns: '(True, False)' },
    { title: 'The types',                  code: 'import sys\n(type(sys.modules).__name__, type(sys.stdlib_module_names).__name__, type(sys.builtin_module_names).__name__)', returns: "('dict', 'frozenset', 'tuple')" },
  ],

  pitfalls: [
    {
      name: 'Iterating sys.modules while something imports',
      desc: 'Any import during the loop adds an entry and breaks the iteration. Loop over a snapshot: list(sys.modules) or sys.modules.copy().',
      wrong: { label: 'live dict', code: "import sys, types\ntry:\n    for name in sys.modules:\n        sys.modules.setdefault('demo_plugin', types.ModuleType('demo_plugin'))\nfinally:\n    sys.modules.pop('demo_plugin', None)", output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'snapshot', code: "import sys, types\ntry:\n    for name in list(sys.modules):\n        sys.modules.setdefault('demo_plugin', types.ModuleType('demo_plugin'))\n    result = 'demo_plugin' in sys.modules\nfinally:\n    sys.modules.pop('demo_plugin', None)\nresult", output: 'True' },
    },
    {
      name: 'Using builtin_module_names as "the standard library"',
      desc: 'Only a few modules are compiled into the binary; most of the stdlib (json, pathlib, …) are .py files. Use stdlib_module_names.',
      wrong: { label: 'builtin_module_names', code: "import sys\n'json' in sys.builtin_module_names", output: 'False' },
      fix:   { label: 'stdlib_module_names', code: "import sys\n'json' in sys.stdlib_module_names", output: 'True' },
    },
  ],

  when: {
    use: [
      'Checking whether a module is already loaded, without importing it',
      'Tooling: dependency scanners, import linters, test isolation',
      'Telling standard-library imports from third-party ones',
    ],
    avoid: [
      'Reloading code → importlib.reload',
      'Checking whether a module can be imported → importlib.util.find_spec(name)',
    ],
  },

  notes: {
    cpython:         'sys.modules is the interpreter\'s module dict that importlib._bootstrap consults first; stdlib_module_names is generated at build time (Python/stdlib_module_names.h)',
    'Partial modules': 'A module is placed in sys.modules before its body runs, which is how circular imports see a half-initialized module',
    'stdlib list':   'Includes modules unavailable on the current platform (e.g. winreg on Linux) and excludes test modules; sub-modules are not listed',
    'Replacing it':  'Mutate the dict, do not replace it — the import system keeps its own reference',
  },

  related: [
    { name: 'sys.path',  slug: 'path',   when: 'Where a module not yet in sys.modules is searched' },
    { name: 'import',    slug: 'import', when: 'The statement that fills sys.modules', category: 'keywords' },
    { name: 'ImportError', slug: 'importerror', when: 'What a failed import raises', category: 'exceptions' },
    { name: 'sys module', slug: 'sys',   when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a module is imported?',
      a: "'name' in sys.modules — True once anything in the process imported it. To check whether it could be imported without importing it, use importlib.util.find_spec('name') is not None.",
    },
    {
      q: 'How do I get a list of all standard library modules?',
      a: 'sys.stdlib_module_names (Python 3.10+), a frozenset of top-level module and package names. It is the same on every platform and includes modules that are not available on yours.',
    },
    {
      q: 'Why does my module run only once even if I import it twice?',
      a: 'The first import stores the module object in sys.modules; later imports find it there and return it without re-running the file. Use importlib.reload() to run it again.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.modules',
    meta:  'sys.modules',
  },
};
