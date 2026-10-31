// content/reference/python/stdlib/glob/iglob.js — glob.iglob

export const meta = {
  slug:        'iglob',
  name:        'glob.iglob',
  signature:   'glob.iglob(pathname, *, root_dir=None, dir_fd=None, recursive=False, include_hidden=False)',
  blurb:       'Like glob.glob, but returns an iterator that yields the matching paths one by one instead of building a list — for big trees, early exits and streaming.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (root_dir / dir_fd 3.10+, include_hidden 3.11+)',
  searchTerms: 'glob.iglob python iterator generator lazy glob large directory first match exists any file matching pattern count files recursive memory',
};

export const method = {
  slug:      'iglob',
  name:      'glob.iglob',
  signature: 'glob.iglob(pathname, *, root_dir=None, dir_fd=None, recursive=False, include_hidden=False)',
  returns:   { type: 'Iterator[str]', desc: 'An iterator over the same paths glob() would return, in the same order. Usable once.' },

  category:    'glob function',
  version:     'All Python 3 versions (root_dir / dir_fd 3.10+, include_hidden 3.11+)',
  hasLiveDemo: true,

  subtitle: 'glob.glob(...) is literally list(glob.iglob(...)). iglob walks the folders as you iterate, so you can stop at the first hit, count without a list, or start processing before a large ** search has finished.',

  covers: ['iglob'],

  cheat: {
    commonCall: "next(glob.iglob('*.csv'), None)",
    returns:    'a path, or None when nothing matches',
    replaces:   'glob.glob(...)[0] (IndexError when empty) and building big lists',
    watchOut:   'one pass only; no len(); results still unsorted',
  },

  parameters: [
    { name: 'pathname',       type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'The pattern, exactly as for glob.glob.' },
    { name: 'root_dir',       type: 'str | PathLike | None', required: false, default: 'None',  desc: 'Search relative to this folder (3.10+); yielded paths are relative to it.' },
    { name: 'dir_fd',         type: 'int | None', required: false, default: 'None',  desc: 'Folder file descriptor to search relative to (3.10+, Unix in practice).' },
    { name: 'recursive',      type: 'bool', required: false, default: 'False', desc: '** matches zero or more folders (3.5+).' },
    { name: 'include_hidden', type: 'bool', required: false, default: 'False', desc: 'Wildcards may match names starting with a dot (3.11+).' },
  ],

  modes: [
    {
      id: 'first',
      label: 'any match?',
      blurb: 'Stop at the first hit — next() with a default never raises.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nnext(glob.iglob({$pattern}, recursive=True), None) is not None",
      cases: [
        { id: 'yes', label: 'has a test',  values: { files: 'app.py, tests/test_app.py', pattern: '**/test_*.py' } },
        { id: 'no',  label: 'no .lock',    values: { files: 'app.py, setup.cfg', pattern: '*.lock' } },
      ],
    },
    {
      id: 'count',
      label: 'count',
      blurb: 'Count matches without keeping a list.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsum(1 for _ in glob.iglob({$pattern}, recursive=True))",
      cases: [
        { id: 'py',   label: '**/*.py', values: { files: 'a.py, src/b.py, src/c/d.py, notes.txt', pattern: '**/*.py' } },
        { id: 'all',  label: '**',      values: { files: 'a.py, src/b.py, src/c/d.py, notes.txt', pattern: '**' } },
      ],
    },
    {
      id: 'sorted',
      label: 'sorted',
      blurb: 'sorted() accepts the iterator directly.',
      params: [
        { name: 'files',   type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'glob pattern', input: 'text' },
      ],
      template: "import glob, os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w', encoding='utf-8').close()\nsorted(p.replace(os.sep, '/') for p in glob.iglob({$pattern}, recursive=True))",
      cases: [
        { id: 'logs', label: 'logs/**/*.log', values: { files: 'logs/a.log, logs/2024/b.log, logs/2024/c.txt, d.log', pattern: 'logs/**/*.log' } },
      ],
    },
  ],
  demoExplainer: "next(iterator, None) returns the first match or None, so the any-match test reads at most as far as the first hit. ** counts every file and folder below the current folder — src and src/c are counted too — while **/*.py counts only the .py files, including a.py at the top. logs/**/*.log finds logs/a.log because ** may be empty.",

  patterns: [
    {
      name: 'First match or a fallback',
      desc: 'No IndexError when nothing matches.',
      code: "import glob\nconfig = next(glob.iglob('config/*.toml'), 'defaults.toml')",
    },
    {
      name: 'Stream a big tree',
      desc: 'Process each path as it is found instead of waiting for the full list.',
      code: "import glob\nfor path in glob.iglob('/data/**/*.json', recursive=True):\n    handle(path)",
    },
    {
      name: 'At most N results',
      desc: 'itertools.islice stops the search early (which N you get depends on directory order).',
      code: "import glob, itertools\nsample = list(itertools.islice(glob.iglob('images/*.jpg'), 10))",
    },
  ],

  examples: [
    { title: 'Same results as glob, lazily', code: "import glob\nfor name in ['a.txt', 'b.txt']:\n    open(name, 'w', encoding='utf-8').close()\nsorted(glob.iglob('*.txt'))", returns: "['a.txt', 'b.txt']" },
    { title: 'It is an iterator',             code: "import glob\ntype(glob.iglob('*.txt')).__name__", returns: "'generator'" },
    { title: 'First match or a default',      code: "import glob\nnext(glob.iglob('*.missing'), 'none found')", returns: "'none found'" },
    { title: 'Count without a list',          code: "import glob\nfor name in ['a.txt', 'b.txt', 'c.md']:\n    open(name, 'w', encoding='utf-8').close()\nsum(1 for _ in glob.iglob('*.txt'))", returns: '2' },
    { title: 'Single use',                    code: "import glob\nfor name in ['a.txt', 'b.txt']:\n    open(name, 'w', encoding='utf-8').close()\nit = glob.iglob('*.txt')\nlen(list(it)), len(list(it))", returns: '(2, 0)' },
  ],

  pitfalls: [
    {
      name: 'Calling len() on the iterator',
      desc: 'iglob has no length — count it, or use glob.glob when you need the list anyway.',
      wrong: { label: 'len(iglob)', code: "import glob\nopen('a.txt', 'w', encoding='utf-8').close()\nlen(glob.iglob('*.txt'))", output: "TypeError: object of type 'generator' has no len()" },
      fix:   { label: 'sum(1 for ...)', code: "import glob\nopen('a.txt', 'w', encoding='utf-8').close()\nsum(1 for _ in glob.iglob('*.txt'))", output: '1' },
    },
    {
      name: 'Iterating the same iterator twice',
      desc: 'The second pass is empty. Keep a list (glob.glob) if you need the paths more than once.',
      wrong: { label: 'reuse', code: "import glob\nopen('a.txt', 'w', encoding='utf-8').close()\nfound = glob.iglob('*.txt')\nprint(list(found))\nlist(found)", output: "['a.txt']\n[]" },
      fix:   { label: 'glob.glob', code: "import glob\nopen('a.txt', 'w', encoding='utf-8').close()\nfound = glob.glob('*.txt')\nprint(list(found))\nlist(found)", output: "['a.txt']\n['a.txt']" },
    },
    {
      name: 'glob(...)[0] on an empty result',
      desc: 'Indexing an empty list raises; next() with a default does not.',
      wrong: { label: '[0]', code: "import glob\nglob.glob('*.missing')[0]", output: 'IndexError: list index out of range' },
      fix:   { label: 'next(..., None)', code: "import glob\nnext(glob.iglob('*.missing'), None) is None", output: 'True' },
    },
  ],

  when: {
    use: [
      'Large recursive searches you want to process as they are found',
      'Existence checks and first-match lookups',
      'Counting matches',
    ],
    avoid: [
      'You need the paths more than once, sorted, or counted with len() → glob.glob',
      'Path objects → pathlib.Path.glob (also lazy)',
    ],
  },

  notes: {
    cpython:      "glob.glob is list(iglob(...)). iglob returns the generator from _iglob; for an empty pattern, or a recursive pattern starting with **, it first takes one item and drops it if it is '' (the ** walk yields '' for the starting folder) — when that first item is a real path, the result is an itertools.chain instead (type(glob.iglob('**/*.txt', recursive=True)).__name__ is 'chain' when something matched)",
    'Snapshot':   'Folders are listed when the iterator reaches them. The docs leave it unspecified whether files created or removed during the search are included',
    'Order':      'Directory order, exactly like glob.glob — sort when it matters',
  },

  related: [
    { name: 'glob.glob',      slug: 'glob',    when: 'The same, as a list' },
    { name: 'next()',         slug: 'next',    when: 'First item with a default', category: 'functions' },
    { name: 'sorted()',       slug: 'sorted',  when: 'Order the paths', category: 'functions' },
    { name: 'StopIteration',  slug: 'stopiteration', when: 'What next() without a default raises', category: 'exceptions' },
    { name: 'glob module',    slug: 'glob',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between glob.glob and glob.iglob?',
      a: 'They find the same paths in the same order. glob returns a list (all at once, reusable, has len()); iglob returns an iterator that lists folders as you consume it — better for large trees and early exits, but usable only once.',
    },
    {
      q: 'How do I check if any file matches a pattern?',
      a: "next(glob.iglob(pattern), None) is not None stops at the first match. bool(glob.glob(pattern)) works too but lists everything first.",
    },
    {
      q: 'Is glob.iglob faster than glob.glob?',
      a: 'The total work is the same; iglob just does it on demand. It saves memory and lets you stop early, so it is faster when you do not need every result.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/glob.html#glob.iglob',
    meta:  'glob.iglob',
  },
};
