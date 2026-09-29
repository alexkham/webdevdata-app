// content/reference/python/stdlib/pathlib/resolve.js

export const meta = {
  slug:        'resolve',
  name:        'Path.resolve',
  signature:   'Path.resolve(strict=False) / .absolute() / .expanduser() / Path.cwd() / Path.home()',
  blurb:       'Turn a path into an absolute one: resolve() also removes ".." and follows symlinks, absolute() only prefixes the current directory, expanduser() replaces "~". cwd() and home() give the two starting points.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: false,
  version:     'Python 3.4+ (home, expanduser 3.5+)',
  searchTerms: 'Path.resolve resolve absolute expanduser cwd home Path.absolute Path.expanduser Path.cwd Path.home absolute path python pathlib realpath abspath tilde home directory current directory resolve vs absolute strict symlink',
};

export const method = {
  slug:      'resolve',
  name:      'Path.resolve',
  signature: 'Path.resolve(strict=False) / .absolute() / .expanduser() / Path.cwd() / Path.home()',
  returns:   { type: 'Path', desc: 'A new absolute (resolve, absolute, cwd, home) or tilde-free (expanduser) path.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (home, expanduser 3.5+)',
  hasLiveDemo: false,

  subtitle: "resolve() = os.path.realpath: absolute, '..' collapsed, symlinks followed. absolute() = cwd / path, nothing else — '..' stays. expanduser() only touches a leading '~'. The results depend on the machine, so this page has no live demo; the examples compare paths instead of printing them.",

  covers: ['Path.resolve', 'Path.absolute', 'Path.expanduser'],

  cheat: {
    commonCall: 'Path(__file__).resolve().parent',
    returns:    'an absolute Path',
    replaces:   'os.path.realpath / abspath / expanduser, os.getcwd()',
    watchOut:   "absolute() keeps '..'; resolve() does not require the path to exist unless strict=True",
  },

  parameters: [
    { name: 'strict', type: 'bool', required: false, default: 'False', desc: 'resolve only: raise OSError (FileNotFoundError) if a component does not exist, instead of resolving as far as possible.' },
  ],

  patterns: [
    {
      name: 'The folder of the running script',
      desc: 'resolve() makes it absolute and follows a symlinked script.',
      code: 'from pathlib import Path\nHERE = Path(__file__).resolve().parent',
    },
    {
      name: 'User-configurable paths',
      desc: 'Expand ~ first, then make absolute.',
      code: "from pathlib import Path\ndata_dir = Path(config.get('data_dir', '~/.myapp')).expanduser().resolve()",
    },
    {
      name: 'Per-user config folder',
      desc: 'home() is the user profile / home directory.',
      code: "from pathlib import Path\nconfig = Path.home() / '.config' / 'myapp' / 'settings.toml'",
    },
  ],

  examples: [
    { title: 'resolve() is absolute',               code: "from pathlib import Path\nPath('data.csv').resolve().is_absolute()", returns: 'True' },
    { title: "resolve() removes '..'",              code: "from pathlib import Path\nPath('src').mkdir()\n'..' in Path('src/../data.csv').resolve().parts", returns: 'False' },
    { title: "absolute() keeps '..'",               code: "from pathlib import Path\n'..' in Path('src/../data.csv').absolute().parts", returns: 'True' },
    { title: 'absolute() is cwd / path',            code: "from pathlib import Path\nPath('a/b').absolute() == Path.cwd() / 'a' / 'b'", returns: 'True' },
    { title: 'expanduser() replaces a leading ~',   code: "from pathlib import Path\nPath('~/notes.txt').expanduser() == Path.home() / 'notes.txt'", returns: 'True' },
    { title: 'expanduser() leaves other paths alone', code: "from pathlib import Path\nPath('a/~/b').expanduser().as_posix()", returns: "'a/~/b'" },
    { title: 'strict=True needs an existing path',  code: "from pathlib import Path\ntry:\n    Path('missing.txt').resolve(strict=True)\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: "Expecting absolute() to clean up '..'",
      desc: "absolute() only prefixes the cwd; the '..' stays. Use resolve() when you need the canonical path (for comparisons or containment checks).",
      wrong: { label: 'absolute()', code: "from pathlib import Path\nPath('a').mkdir()\nPath('a/../b').absolute() == Path('b').absolute()", output: 'False' },
      fix:   { label: 'resolve()', code: "from pathlib import Path\nPath('a').mkdir()\nPath('a/../b').resolve() == Path('b').resolve()", output: 'True' },
    },
    {
      name: 'Opening "~/file" without expanduser()',
      desc: "The OS does not expand '~'; only shells do. Python looks for a folder literally named ~ in the current directory.",
      wrong: { label: "raw '~'", code: "from pathlib import Path\nPath('~/definitely-missing-file.txt').exists()", output: 'False' },
      fix:   { label: 'expanduser()', code: "from pathlib import Path\nPath('~/x').expanduser().is_absolute()", output: 'True' },
    },
  ],

  when: {
    use: [
      'resolve(): canonical paths for comparison, containment checks, anchoring to __file__',
      'absolute(): cheap absolute path without file-system access or symlink resolution',
      'expanduser(): paths from users and config files that may start with ~',
    ],
    avoid: [
      "Pure paths → none of these exist on PurePath; they need the machine's cwd and home",
      'Keeping symlinks as they are → absolute() rather than resolve()',
    ],
  },

  notes: {
    cpython:            'resolve: self.with_segments(os.path.realpath(self, strict=strict)); absolute: joins os.getcwd() with the parsed parts without normalising; expanduser: os.path.expanduser on the first part',
    'os.path table':    'os.path.realpath → resolve(); os.path.abspath → absolute() (but abspath DOES collapse "..", absolute() does not); os.path.expanduser → expanduser(); os.getcwd → Path.cwd()',
    'expanduser errors': 'RuntimeError("Could not determine home directory.") when the home directory cannot be found — os.path.expanduser returns the path unchanged instead',
    'Changed in 3.13':  'Symlink loops no longer raise RuntimeError: OSError in strict mode, no error otherwise',
    'Inherited':        'cwd() and home() are class methods inherited from PathBase; cwd() == Path().absolute()',
  },

  related: [
    { name: 'is_absolute',  slug: 'is_absolute', when: 'Is it absolute already?' },
    { name: 'relative_to',  slug: 'relative_to', when: 'Back to a relative path' },
    { name: 'parts / parent', slug: 'parts',     when: 'Walk up from __file__' },
    { name: 'symlink_to / readlink', slug: 'symlink_to', when: 'What resolve() follows' },
  ],

  faq: [
    {
      q: 'What is the difference between resolve() and absolute()?',
      a: "absolute() prefixes the current directory and does nothing else. resolve() also collapses '..' and follows symlinks, like os.path.realpath. Use resolve() for comparisons; absolute() when you must not follow links.",
    },
    {
      q: 'How do I get the absolute path of a file in Python?',
      a: "Path('file').resolve(). For the running script: Path(__file__).resolve().",
    },
    {
      q: 'How do I expand ~ in a path?',
      a: "Path('~/data').expanduser(). pathlib never expands ~ automatically, and neither does open().",
    },
    {
      q: 'Does resolve() require the file to exist?',
      a: 'No, by default it resolves as much as exists and appends the rest. With strict=True it raises FileNotFoundError for a missing component.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.resolve',
    meta:  'Path.resolve / absolute / expanduser / cwd / home',
  },
};
