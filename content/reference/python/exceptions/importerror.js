// content/reference/python/exceptions/importerror.js

export const meta = {
  slug:        'importerror',
  name:        'ImportError',
  signature:   'ImportError(*args, name=None, path=None)',
  blurb:       'Raised when an import fails: most often "cannot import name X from Y" — the module was found but the name is not in it.',
  category:    'import-syntax',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'importerror import error cannot import name from partially initialized module circular import attempted relative import with no known parent package unknown location did you mean from import typo renamed removed',
};

export const method = {
  slug:      'importerror',
  name:      'ImportError',
  signature: 'ImportError(*args, name=None, path=None)',

  category:    'Import / syntax exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The import found the module but not what you asked for — a typo, a name that moved or was removed, a relative import outside a package, or a circular import that asked too early.',

  chain: ['BaseException', 'Exception', 'ImportError'],

  cheat: {
    raisedBy: 'from module import name, relative imports, a module that raises it on import',
    message:  "cannot import name 'x' from 'mod' (/path/to/mod.py)",
    quickFix: "check the spelling / the library's version; break circular imports",
    watchOut: 'ModuleNotFoundError is a subclass — except ImportError catches both',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string (also available as e.msg).' },
    { name: 'name',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. The module involved — for "cannot import name", the module that lacked the name.' },
    { name: 'path',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. The file that triggered the error, when there is one (None for built-in modules).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'from itertools import <name>, run through exec() so you can type the name. itertools is built into every CPython, so the message ends in (unknown location) instead of a file path.',
      params: [{ name: 'name', type: 'str', hint: 'a name to import', input: 'text' }],
      template: "import keyword\nname = {$name}\nif not name.isidentifier() or keyword.iskeyword(name):\n    raise ValueError('not a valid name')\nexec(f'from itertools import {name}')\n'imported ' + name",
      cases: [
        { id: 'ok',    label: 'chain',   values: { name: 'chain' } },
        { id: 'typo',  label: 'batchd',  values: { name: 'batchd' } },
        { id: 'py2',   label: 'izip',    values: { name: 'izip' } },
        { id: 'moved', label: 'izip_longest', values: { name: 'izip_longest' } },
        { id: 'case',  label: 'Chain',   values: { name: 'Chain' } },
        { id: 'upper', label: 'CHAIN',   values: { name: 'CHAIN' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The compatibility-import pattern: try the name, fall back if this Python does not have it. e.name is the module that lacked it.',
      params: [{ name: 'name', type: 'str', hint: 'a name to import', input: 'text' }],
      template: "import keyword\nname = {$name}\nif not name.isidentifier() or keyword.iskeyword(name):\n    raise ValueError('not a valid name')\ntry:\n    exec(f'from itertools import {name}')\n    source = 'itertools'\nexcept ImportError as e:\n    source = f'fallback (no {name!r} in {e.name})'\nsource",
      cases: [
        { id: 'have',    label: 'pairwise', values: { name: 'pairwise' } },
        { id: 'missing', label: 'imap',     values: { name: 'imap' } },
      ],
    },
  ],
  demoExplainer: "Try batchd and izip_longest: CPython compares the missing name with everything in the module and adds Did you mean: 'batched'? when one is close enough. izip has no close match — it was removed in Python 3 (use the built-in zip). Names are case-sensitive: Chain fails but gets the hint (one case flip is cheap), while CHAIN is five changes away and gets none.",

  attributes: [
    { name: 'name', type: 'str | None', meaning: "The module name. For \"cannot import name 'x' from 'mod'\" this is 'mod'." },
    { name: 'path', type: 'str | None', meaning: 'Path of the module file, or None (built-in modules, relative-import errors).' },
    { name: 'msg',  type: 'str',        meaning: 'The message text, same as str(e) when the exception was built with one argument.' },
    { name: 'args', type: 'tuple',      meaning: 'The constructor arguments; name and path are not included.' },
  ],

  patterns: [
    {
      name: 'Optional feature with a fallback',
      desc: 'Import the newer or faster implementation when available, otherwise a local one.',
      code: "try:\n    from itertools import batched          # Python 3.12+\nexcept ImportError:\n    def batched(iterable, n):\n        it = iter(iterable)\n        while chunk := tuple(islice(it, n)):\n            yield chunk",
    },
    {
      name: 'Break a circular import',
      desc: 'Import the module (not the name) at the top, or move the import into the function that needs it — by then both modules are fully loaded.',
      code: "# orders.py\nimport customers          # not: from customers import lookup\n\ndef total(order):\n    return customers.lookup(order.customer_id).discount",
    },
    {
      name: 'Run package code as a module',
      desc: 'Relative imports need a package context: run python -m package.module from the project root instead of python package/module.py.',
      code: "# app/cli.py\nfrom .config import load   # works with: python -m app.cli",
    },
  ],

  examples: [
    { title: 'Name removed in Python 3',      code: 'from itertools import izip',        returns: "ImportError: cannot import name 'izip' from 'itertools' (unknown location)" },
    { title: 'Typo gets a suggestion',        code: 'from itertools import pairwise, batchd', returns: "ImportError: cannot import name 'batchd' from 'itertools' (unknown location). Did you mean: 'batched'?" },
    { title: 'Renamed in Python 3',           code: 'from itertools import izip_longest', returns: "ImportError: cannot import name 'izip_longest' from 'itertools' (unknown location). Did you mean: 'zip_longest'?" },
    { title: 'e.name is the module',          code: "try:\n    from itertools import izip\nexcept ImportError as e:\n    r = (type(e).__name__, e.name, e.path)\nr", returns: "('ImportError', 'itertools', None)" },
    { title: 'Relative import in a script',   code: 'from . import helpers',             returns: 'ImportError: attempted relative import with no known parent package' },
    { title: 'Circular import',               code: "import os, sys\nwith open('ie_cyc_a.py', 'w') as f:\n    f.write('from ie_cyc_b import g\\ndef f():\\n    return 1\\n')\nwith open('ie_cyc_b.py', 'w') as f:\n    f.write('from ie_cyc_a import f\\ndef g():\\n    return 2\\n')\nsys.path.insert(0, os.getcwd())\ntry:\n    import ie_cyc_a\nexcept ImportError as e:\n    msg = e.msg\nfinally:\n    sys.path.remove(os.getcwd())\nmsg.split(' (most')[0]", returns: "\"cannot import name 'f' from partially initialized module 'ie_cyc_a'\"" },
    { title: 'except ImportError catches ModuleNotFoundError', code: "try:\n    import no_such_pkg_ie\nexcept ImportError as e:\n    r = type(e).__name__\nr", returns: "'ModuleNotFoundError'" },
    { title: 'Raising it with name and path', code: "e = ImportError('plugin failed to load', name='acme.plugin', path='plugins/acme.py')\n(str(e), e.name, e.path)", returns: "('plugin failed to load', 'acme.plugin', 'plugins/acme.py')" },
  ],

  pitfalls: [
    {
      name: 'from-imports make circular imports fail',
      desc: "In a cycle, the second module runs while the first is only half executed. from a import f needs f to exist already; import a only needs the module object, and a.f is looked up later, when it exists.",
      wrong: { label: 'from … import', code: "import os, sys\nwith open('ie_p1_a.py', 'w') as f:\n    f.write('from ie_p1_b import g\\ndef f():\\n    return 1\\n')\nwith open('ie_p1_b.py', 'w') as f:\n    f.write('from ie_p1_a import f\\ndef g():\\n    return f() + 1\\n')\nsys.path.insert(0, os.getcwd())\ntry:\n    import ie_p1_a\nexcept ImportError as e:\n    r = 'circular import' in str(e)\nfinally:\n    sys.path.remove(os.getcwd())\nr", output: 'True' },
      fix:   { label: 'import module', code: "import os, sys\nwith open('ie_p2_a.py', 'w') as f:\n    f.write('import ie_p2_b\\ndef f():\\n    return 1\\n')\nwith open('ie_p2_b.py', 'w') as f:\n    f.write('import ie_p2_a\\ndef g():\\n    return ie_p2_a.f() + 1\\n')\nsys.path.insert(0, os.getcwd())\ntry:\n    import ie_p2_a\n    r = ie_p2_a.ie_p2_b.g()\nfinally:\n    sys.path.remove(os.getcwd())\nr", output: '2' },
    },
    {
      name: 'Old Python 2 names',
      desc: 'Tutorials written for Python 2 import names that were removed or renamed. The fix is the Python 3 spelling, not installing anything.',
      wrong: { label: 'izip', code: "from itertools import izip\nlist(izip('ab', 'xy'))", output: "ImportError: cannot import name 'izip' from 'itertools' (unknown location)" },
      fix:   { label: 'built-in zip', code: "list(zip('ab', 'xy'))", output: "[('a', 'x'), ('b', 'y')]" },
    },
  ],

  when: {
    use: [
      'Catching it for optional dependencies and version-dependent names (compat shims)',
      'Raising it (with name=/path=) from a plugin loader when a plugin cannot be loaded',
    ],
    avoid: [
      'A bare except ImportError around a big block → it also hides import errors inside the modules you import',
      'Only the "module not installed" case → catch ModuleNotFoundError',
    ],
  },

  notes: {
    cpython:        'Python/ceval.c import_from() — builds "cannot import name …"; the path in parentheses is the module file, or "unknown location" for built-in modules',
    'Did you mean': 'Added by the traceback printer (3.12+), not part of str(e)',
    'Catch via':    'except ImportError also catches ModuleNotFoundError',
    'Shadowing':    '3.13 adds "(consider renaming …)" when your own file hides a standard-library module of the same name',
  },

  related: [
    { name: 'ModuleNotFoundError', slug: 'modulenotfounderror', when: 'The module itself could not be found' },
    { name: 'SyntaxError',         slug: 'syntaxerror',         when: 'The imported module does not compile' },
    { name: 'AttributeError',      slug: 'attributeerror',      when: 'mod.name instead of from mod import name' },
    { name: 'exec()',              slug: 'exec',                when: 'How the demo runs a from-import with a typed name', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix "ImportError: cannot import name X from Y"?',
      a: "The module Y was found, but has no attribute X. Check, in order: the spelling and case of X; whether X exists in the version of Y you have installed (it may be newer, renamed or removed — compare the library's changelog); whether the Y that was imported is the one you expect (print Y.__file__ — a local file can shadow a package); and whether Y and your module import each other (circular import — the message then says \"partially initialized module\").",
    },
    {
      q: 'What does "partially initialized module (most likely due to a circular import)" mean?',
      a: 'Module A imports B, and B imports A while A is still executing its top-level code, so names defined further down in A do not exist yet. Fix it by importing the module instead of names (import a, then a.f at call time), moving the import into the function that uses it, or moving the shared code into a third module both can import.',
    },
    {
      q: 'Why "attempted relative import with no known parent package"?',
      a: 'A relative import (from . import x) resolves against the package the current module belongs to. When a file is run directly (python pkg/mod.py) it is __main__ with no package. Run it as python -m pkg.mod from the directory above pkg, or use absolute imports.',
    },
    {
      q: 'What does "(unknown location)" at the end of the message mean?',
      a: 'The module has no source file: it is compiled into the interpreter (sys, itertools, builtins …). For ordinary modules the parentheses contain the file path instead, which is why the same error looks different on every machine.',
    },
    {
      q: 'What is the difference between ImportError and ModuleNotFoundError?',
      a: 'ModuleNotFoundError (3.6+) is the subclass raised when the module itself cannot be found: "No module named x". Plain ImportError covers the other failures: a missing name in a module that exists, relative imports without a package, circular imports, extension modules that fail to load. except ImportError catches both.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added the name and path attributes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ImportError',
    meta:  'Built-in exceptions',
  },
};
