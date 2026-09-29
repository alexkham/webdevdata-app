// content/reference/python/keywords/import.js

export const meta = {
  slug:        'import',
  name:        'import',
  signature:   'import module as name',
  blurb:       'Load a module once, cache it in sys.modules, and bind it — or names from it — in the current namespace.',
  category:    'definitions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'import from as keyword import module from import star __all__ alias relative import sys.modules circular import importerror modulenotfounderror package',
};

export const method = {
  slug:      'import',
  name:      'import',
  signature: 'import module as name',

  category:    'Definitions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'import finds a module, runs it the first time only, stores it in sys.modules and binds a name. from ... import copies names out of it; as renames.',

  covers: ['import', 'from', 'as'],

  syntax: [
    { label: 'import', code: 'import json\nimport os.path' },
    { label: 'import as', code: 'import numpy as np' },
    { label: 'from import', code: 'from math import sqrt, pi\nfrom os import path as p' },
    { label: 'from import *', code: 'from itertools import *' },
    { label: 'relative', code: 'from . import utils\nfrom ..models import User' },
  ],

  cheat: {
    useFor:    'import mod / import mod as m / from mod import name',
    result:    'a statement; binds a name (module or attribute) in the current scope',
    pairsWith: 'as, sys.modules, __all__, if __name__ == "__main__"',
    watchOut:  'from mod import x copies the current value; star imports can shadow builtins',
  },

  parameters: [
    { name: 'module',   type: 'dotted name', required: true,  default: null, desc: 'Module or package to load, e.g. json, os.path. With leading dots (from . / from ..) it is relative to the current package.' },
    { name: 'name',     type: 'identifier',  required: false, default: null, desc: 'from form only: an attribute of the module (or a submodule) to bind. * binds every public name.' },
    { name: 'as alias', type: 'identifier',  required: false, default: null, desc: 'Bind under this name instead. import a.b as x binds the submodule a.b itself as x.' },
  ],

  modes: [
    {
      id: 'star',
      label: 'from import *',
      blurb: 'Type a name. Is it in the module, and does a star import copy it? itertools has no __all__, so * takes every name that does not start with an underscore.',
      params: [{ name: 'name', type: 'str', hint: 'a name', input: 'text' }],
      template: "import itertools\n\nns = {}\nexec('from itertools import *', ns)\nname = {$name}\n(name in dir(itertools), name in ns)",
      cases: [
        { id: 'chain',  label: 'chain',    values: { name: 'chain' } },
        { id: 'tee',    label: '_tee',     values: { name: '_tee' } },
        { id: 'dunder', label: '__name__', values: { name: '__name__' } },
        { id: 'sqrt',   label: 'sqrt',     values: { name: 'sqrt' } },
      ],
    },
    {
      id: 'cache',
      label: 'import as (cached)',
      blurb: 'Run the same import statement several times. Every time you get the very object stored in sys.modules — the module ran only once.',
      params: [{ name: 'times', type: 'int', hint: 'how many imports', input: 'number' }],
      template: "import sys\n\nsame = 0\nfor _ in range({$times}):\n    import itertools as it\n    same += it is sys.modules['itertools']\n(same, it.__name__)",
      cases: [
        { id: 'three', label: '3 times', values: { times: '3' } },
        { id: 'once',  label: 'once',    values: { times: '1' } },
        { id: 'zero',  label: 'never',   values: { times: '0' } },
      ],
    },
  ],
  demoExplainer: 'In the star tab, _tee and __name__ exist in itertools but are not copied: without __all__, * skips every name starting with an underscore (and exec adds __builtins__ to the namespace itself, which is why that one shows up). A module that defines __all__ exports exactly that list instead. In the cache tab, the count equals the number of imports because each import statement returns the object already in sys.modules. With 0 the import never executed, so the name it was never bound: import is an assignment that happens when the line runs.',

  patterns: [
    {
      name: 'Script entry point',
      desc: 'Code under this guard runs when the file is executed, not when it is imported.',
      code: "def main():\n    ...\n\nif __name__ == '__main__':\n    main()",
    },
    {
      name: 'Optional dependency with a fallback',
      desc: 'Catch ImportError (ModuleNotFoundError is a subclass) to fall back to the standard library.',
      code: 'try:\n    import ujson as json\nexcept ImportError:\n    import json',
    },
    {
      name: 'Control what * exports',
      desc: '__all__ lists the public names; from module import * takes exactly these.',
      code: "__all__ = ['load', 'save']\n\ndef load(path): ...\ndef save(path, data): ...\ndef _helper(): ...",
    },
    {
      name: 'Relative imports inside a package',
      desc: 'One dot is the current package, two dots the parent. Only works in a module that is part of a package.',
      code: 'from . import utils\nfrom .models import User\nfrom ..config import settings',
    },
  ],

  examples: [
    { title: 'import binds the module name',    code: 'import math\nmath.sqrt(16)',                                    returns: '4.0' },
    { title: 'as gives it a shorter name',       code: "import itertools as it\nlist(it.islice('abcdef', 3))",       returns: "['a', 'b', 'c']" },
    { title: 'from copies names out',            code: "from collections import Counter\nCounter('banana').most_common(1)", returns: "[('a', 3)]" },
    { title: 'The module object is cached',      code: "import json\nimport sys\njson is sys.modules['json']",       returns: 'True' },
    { title: 'import a.b binds only a',          code: 'import xml.dom\n(xml.__name__, xml.dom.__name__)',          returns: "('xml', 'xml.dom')" },
    { title: 'A missing name in the module',     code: 'from itertools import izip',                                returns: "ImportError: cannot import name 'izip' from 'itertools' (unknown location)" },
    { title: 'A missing module',                 code: 'import nosuchmodule',                                       returns: "ModuleNotFoundError: No module named 'nosuchmodule'" },
    { title: 'Relative import outside a package', code: 'from . import helpers',                                    returns: 'ImportError: attempted relative import with no known parent package' },
  ],

  pitfalls: [
    {
      name: 'from module import name copies the value, not a live link',
      desc: 'from config import debug binds your own name to the object debug referred to at that moment. Rebinding config.debug later does not change your copy. Import the module and read the attribute when you need it.',
      wrong: { label: 'stale copy', code: "import sys, types\nconfig = types.ModuleType('config')\nconfig.debug = False\nsys.modules['config'] = config\ntry:\n    from config import debug\n    config.debug = True\n    result = debug\nfinally:\n    del sys.modules['config']\nresult", output: 'False' },
      fix:   { label: 'read it through the module', code: "import sys, types\nconfig = types.ModuleType('config')\nconfig.debug = False\nsys.modules['config'] = config\ntry:\n    import config\n    config.debug = True\n    result = config.debug\nfinally:\n    del sys.modules['config']\nresult", output: 'True' },
    },
    {
      name: 'A star import silently shadows a builtin',
      desc: 'os exports its own open(), a low-level function that wants integer flags. After from os import *, the builtin open is gone from your module.',
      wrong: { label: 'from os import *', code: "from os import *\nopen('notes.txt', 'w')", output: "TypeError: 'str' object cannot be interpreted as an integer" },
      fix:   { label: 'import the module',  code: "import os\nwith open('notes.txt', 'w') as f:\n    f.write('hi')\nos.path.getsize('notes.txt')", output: '2' },
    },
    {
      name: 'import a.b does not bind b',
      desc: 'The plain form binds the top-level package name only; the submodule is reached through it. Use from a import b (or import a.b as b) to get a short name.',
      wrong: { label: 'expects a name decoder', code: 'import json.decoder\ndecoder.JSONDecodeError', output: "NameError: name 'decoder' is not defined" },
      fix:   { label: 'from json import decoder', code: 'from json import decoder\ndecoder.JSONDecodeError.__name__', output: "'JSONDecodeError'" },
    },
  ],

  when: {
    use: [
      'import module — the default; call sites read module.name and stay clear',
      'import long.module.name as short — conventional aliases (np, pd) or long dotted paths',
      'from module import name — a few names you use often (from pathlib import Path)',
    ],
    avoid: [
      'from module import * in real code → explicit names (star imports are fine in the REPL)',
      'Importing to re-run a module’s code → call a function it defines (importlib.reload only in development)',
      'Modifying sys.path to reach your own code → install the project or run it as a package (python -m pkg.mod)',
    ],
  },

  notes: {
    cpython:    'import checks sys.modules first; only on a miss does it search sys.meta_path finders, create the module, put it in sys.modules and then run its code',
    'Scope':    'import is an assignment: inside a function it binds a local name, and the global/nonlocal declarations apply to it',
    'Circular imports': 'If a imports b and b imports a, b sees a partially initialised module. from a import x then fails with an ImportError that says "partially initialized module" and "most likely due to a circular import". In 3.13, when the module sits in the script’s own directory, the same failure is reported with a "consider renaming" hint instead — it can look like a name clash with the standard library',
    'from / as elsewhere': 'from also appears in yield from and raise ... from; as also appears in with ... as and except ... as — those are covered on their own pages',
    'Built-in modules': 'Modules compiled into the interpreter (sys, itertools, builtins) have no file, so their ImportError says (unknown location) where a file module shows its path',
  },

  related: [
    { name: 'with',   slug: 'with',   when: 'The other place as appears: with open(f) as fh' },
    { name: 'try',    slug: 'try',    when: 'except ... as e, and catching ImportError' },
    { name: 'raise',  slug: 'raise',  when: 'raise NewError() from err' },
    { name: 'yield',  slug: 'yield',  when: 'yield from delegates to a sub-generator' },
    { name: 'ImportError',         slug: 'importerror',         when: 'Name not found in the module, relative import problems', category: 'exceptions' },
    { name: 'ModuleNotFoundError', slug: 'modulenotfounderror', when: 'The module itself cannot be found', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between import x and from x import y?',
      a: 'import x binds the module; you write x.y each time and always see the module’s current value. from x import y binds y directly in your namespace — shorter to use, but it is a copy of the reference taken at import time. Both load and run the module the same way.',
    },
    {
      q: 'Does importing a module twice run it twice?',
      a: 'No. The first import runs the module and stores it in sys.modules; every later import — from any file — gets that same object back. importlib.reload(module) forces a re-run, which is mostly useful during development.',
    },
    {
      q: 'Why do I get "attempted relative import with no known parent package"?',
      a: 'from . import x only works inside a package. Running the file directly (python app/main.py) makes it __main__ with no package. Run it as a module from the project root instead: python -m app.main.',
    },
    {
      q: 'What does __all__ do?',
      a: 'It is a list of names a module declares as public. from module import * imports exactly those names. Without __all__, * imports every name that does not start with an underscore. It does not stop anyone importing other names explicitly.',
    },
    {
      q: 'How do I fix a circular import?',
      a: 'Move the shared code into a third module both can import, import the module (import a) instead of names from it (from a import x) so the lookup happens later, or move the import inside the function that needs it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-import-statement',
    meta:  'The import statement',
  },
};
