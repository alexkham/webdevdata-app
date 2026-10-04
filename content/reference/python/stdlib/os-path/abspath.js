// content/reference/python/stdlib/os-path/abspath.js

export const meta = {
  slug:        'abspath',
  name:        'os.path.abspath',
  signature:   'os.path.abspath(path) / os.path.realpath(path, *, strict=False)',
  blurb:       'Make a path absolute: abspath joins it to the current working directory and normalizes the text; realpath also resolves symlinks on the way.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (realpath strict 3.10+)',
  searchTerms: 'os.path.abspath abspath os.path.realpath realpath absolute path python full path of file resolve symlinks canonical path current working directory getcwd __file__ strict',
};

export const method = {
  slug:      'abspath',
  name:      'os.path.abspath',
  signature: 'os.path.abspath(path) / os.path.realpath(path, *, strict=False)',
  returns:   { type: 'str | bytes', desc: 'An absolute, normalized path. realpath additionally has no symlinks in it.' },

  category:    'os.path function',
  version:     'Python 3.0+ (realpath strict 3.10+)',
  hasLiveDemo: true,

  subtitle: "abspath(p) is normpath(join(os.getcwd(), p)) — the result depends on the folder you run from, and the file does not have to exist. realpath asks the file system and follows symlinks, so it gives the true location; with strict=True (3.10+) it raises if a component is missing.",

  covers: ['abspath', 'realpath'],

  cheat: {
    commonCall: 'os.path.abspath(__file__)',
    returns:    "'/home/ada/project/app.py'",
    replaces:   'os.getcwd() + "/" + path',
    watchOut:   "Relative input depends on the current directory, which may not be the script's folder",
  },

  parameters: [
    { name: 'path',   type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'Relative paths are resolved against os.getcwd().' },
    { name: 'strict', type: 'bool', required: false, default: 'False', desc: 'realpath only (3.10+): True raises OSError when a path component does not exist or a symlink loop is found.' },
  ],

  modes: [
    {
      id: 'abs',
      label: 'abspath',
      blurb: "abspath needs the current directory; here a fixed one stands in for os.getcwd(), so the output is the same everywhere.",
      params: [{ name: 'path', type: 'str', hint: 'relative or absolute POSIX path', input: 'text' }],
      template: "import posixpath\ncwd = '/home/ada/project'          # stands in for os.getcwd()\nposixpath.abspath(posixpath.join(cwd, {$path}))",
      cases: [
        { id: 'rel',  label: 'relative',       values: { path: 'data/raw.csv' } },
        { id: 'up',   label: 'with ..',        values: { path: '../shared/./lib' } },
        { id: 'abs',  label: 'already absolute', values: { path: '/usr/local/../bin' } },
        { id: 'dot',  label: "'.'",            values: { path: '.' } },
      ],
    },
  ],
  demoExplainer: "A relative path is glued onto the current directory and normalized: '../shared/./lib' from /home/ada/project is /home/ada/shared/lib. An absolute path ignores the current directory (join discards it) and is only normalized. On your machine os.path.abspath uses your real current directory — and on Windows ntpath.abspath asks Windows for the full path, drive letter included.",

  patterns: [
    {
      name: 'Files next to the script, from any working directory',
      desc: 'Anchor on __file__, never on the cwd.',
      code: "import os\nBASE = os.path.dirname(os.path.abspath(__file__))\ntemplates = os.path.join(BASE, 'templates')",
    },
    {
      name: 'Canonical path for comparisons and caches',
      desc: 'realpath resolves symlinks so two spellings of one file compare equal.',
      code: "import os\nkey = os.path.normcase(os.path.realpath(path))",
    },
    {
      name: 'Fail on missing components',
      desc: 'strict=True raises instead of guessing.',
      code: "import os\nresolved = os.path.realpath(path, strict=True)",
    },
  ],

  examples: [
    { title: 'Absolute input: just normalized', code: "import posixpath\nposixpath.abspath('/usr/local/../bin')", returns: "'/usr/bin'" },
    { title: 'Relative input uses the cwd',     code: "import os\nos.path.abspath('data.txt') == os.path.join(os.getcwd(), 'data.txt')", returns: 'True' },
    { title: "abspath('.') is the cwd",         code: "import os\nos.path.abspath('.') == os.getcwd()", returns: 'True' },
    { title: 'The result is always absolute',   code: "import os\nos.path.isabs(os.path.abspath('x'))", returns: 'True' },
    { title: 'The file need not exist',         code: "import os\nos.path.exists(os.path.abspath('nope.txt'))", returns: 'False' },
    { title: 'Without symlinks, realpath = abspath', code: "import os\nos.makedirs('real')\nos.path.realpath('real') == os.path.abspath('real')", returns: 'True' },
    { title: 'strict=True raises for missing paths', code: "import os\ntry:\n    os.path.realpath('nope.txt', strict=True)\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Resolving data files against the current directory',
      desc: "Relative paths follow os.getcwd(), which is wherever the program was started — not where the script lives.",
      wrong: { label: "abspath('config.toml')", code: "import os, contextlib\nos.mkdir('elsewhere')\nwith contextlib.chdir('elsewhere'):\n    p = os.path.abspath('config.toml')\nos.path.basename(os.path.dirname(p))", output: "'elsewhere'" },
      fix:   { label: 'anchor on a fixed folder', code: "import os, contextlib\nos.mkdir('elsewhere')\nbase = os.path.abspath('.')\nwith contextlib.chdir('elsewhere'):\n    p = os.path.join(base, 'config.toml')\nos.path.dirname(p) == base", output: 'True' },
    },
    {
      name: 'Expecting abspath to check the file',
      desc: 'abspath and (non-strict) realpath are happy with paths that do not exist.',
      wrong: { label: 'abspath', code: "import os\nos.path.isabs(os.path.abspath('typo.txt'))", output: 'True' },
      fix:   { label: 'realpath(strict=True)', code: "import os\ntry:\n    os.path.realpath('typo.txt', strict=True)\n    found = True\nexcept FileNotFoundError:\n    found = False\nfound", output: 'False' },
    },
  ],

  when: {
    use: [
      'Turning user input or __file__ into a full path (abspath)',
      'Finding the real location behind symlinks (realpath)',
    ],
    avoid: [
      'pathlib code → Path.absolute() / Path.resolve()',
      'Just cleaning text → normpath',
    ],
  },

  notes: {
    cpython:     "posixpath.abspath: if not isabs(path): path = join(os.getcwd(), path); return normpath(path). ntpath.abspath asks Windows for the full path (nt._getfullpathname)",
    'realpath':  'POSIX: walks the path component by component with lstat/readlink, detecting loops. Windows: also turns 8.3 short names such as C:\\PROGRA~1 into long ones, and returns the case the OS reports (drive letter capitalized)',
    'strict':    'Added in 3.10. Without it, the path is resolved up to the first missing or failing component and the rest is appended unchanged. 3.13.4 added a third choice, strict=os.path.ALLOW_MISSING: only FileNotFoundError is tolerated',
  },

  related: [
    { name: 'os.path.normpath', slug: 'normpath', when: 'Normalization without the cwd' },
    { name: 'os.path.relpath', slug: 'relpath', when: 'The reverse: absolute to relative' },
    { name: 'os.path.isabs', slug: 'isabs', when: 'Is it absolute already?' },
    { name: 'Path.resolve / absolute', slug: 'resolve', when: 'The pathlib versions', category: 'stdlib/pathlib' },
    { name: 'os.getcwd', slug: 'getcwd', when: 'The directory abspath starts from', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I get the absolute path of a file in Python?',
      a: "os.path.abspath(path), or Path(path).resolve() with pathlib (which also follows symlinks, like realpath).",
    },
    {
      q: 'What is the difference between abspath and realpath?',
      a: 'abspath only does text work on top of the current directory. realpath also asks the file system and replaces every symlink with its target, giving the canonical location.',
    },
    {
      q: 'How do I get the directory of the current script?',
      a: "os.path.dirname(os.path.abspath(__file__)) — or os.path.realpath(__file__) if the script may be reached through a symlink.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.abspath',
    meta:  'os.path.abspath / realpath',
  },
};
