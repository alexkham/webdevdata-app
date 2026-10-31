// content/reference/python/stdlib/fnmatch/filter.js — fnmatch.filter

export const meta = {
  slug:        'filter',
  name:        'fnmatch.filter',
  signature:   'fnmatch.filter(names, pat)',
  blurb:       'Return the list of names that match a shell-style pattern — [n for n in names if fnmatch(n, pat)], compiled once.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'fnmatch filter fnmatch.filter python filter list of filenames by pattern wildcard *.py select files matching pattern filterfalse exclude names',
};

export const method = {
  slug:      'filter',
  name:      'fnmatch.filter',
  signature: 'fnmatch.filter(names, pat)',
  returns:   { type: 'list', desc: 'A new list with the matching items of names, in their original order (the original objects, not normalised).' },

  category:    'fnmatch function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The bulk version of fnmatch(): the pattern is normalised and compiled once, then every name is tested. It always returns a list, keeps the input order, and — like fnmatch() — ignores case only on Windows.',

  covers: ['filter'],

  cheat: {
    commonCall: "fnmatch.filter(os.listdir('.'), '*.py')",
    returns:    "['app.py', 'test_app.py']",
    replaces:   '[n for n in names if fnmatch.fnmatch(n, pat)]',
    watchOut:   'shadows the built-in filter() if you write from fnmatch import filter',
  },

  parameters: [
    { name: 'names', type: 'iterable of str | bytes', required: true, default: null, desc: 'Any iterable of names — a list, os.listdir(), a generator. Consumed once.' },
    { name: 'pat',   type: 'str | bytes', required: true, default: null, desc: 'Shell-style pattern, normalised with os.path.normcase once.' },
  ],

  modes: [
    {
      id: 'filter',
      label: 'filter',
      blurb: 'The names that match, in input order (Linux rules; these cases agree on Windows).',
      params: [
        { name: 'names',   type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\nfnmatch.filter({$names}, {$pattern})',
      cases: [
        { id: 'py',    label: '*.py',          values: { names: 'setup.py, app.py, notes.txt, app.pyc', pattern: '*.py' } },
        { id: 'pyc',   label: '*.py[co]',      values: { names: 'app.py, app.pyc, app.pyo, app.pyd', pattern: '*.py[co]' } },
        { id: 'month', label: '2024-0[1-3]-*', values: { names: '2024-01-05.log, 2024-03-30.log, 2024-04-01.log, 2024-1-9.log', pattern: '2024-0[1-3]-*' } },
        { id: 'none',  label: 'no match',      values: { names: 'a.txt, b.txt', pattern: '*.md' } },
      ],
    },
    {
      id: 'exclude',
      label: 'exclude',
      blurb: 'The names that do NOT match (what filterfalse returns in 3.14+).',
      params: [
        { name: 'names',   type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'pattern to drop', input: 'text' },
      ],
      template: 'import fnmatch\n[n for n in {$names} if not fnmatch.fnmatch(n, {$pattern})]',
      cases: [
        { id: 'tmp',  label: 'drop *.tmp',  values: { names: 'a.txt, a.txt.tmp, b.tmp, c.md', pattern: '*.tmp' } },
        { id: 'dots', label: 'drop .*',     values: { names: '.git, .env, src, readme.md', pattern: '.*' } },
      ],
    },
    {
      id: 'any',
      label: 'several patterns',
      blurb: 'Keep a name when it matches any of the patterns.',
      params: [
        { name: 'names',    type: 'list[str]', hint: 'names, comma-separated', input: 'csv' },
        { name: 'patterns', type: 'list[str]', hint: 'patterns, comma-separated', input: 'csv' },
      ],
      template: 'import fnmatch\n[n for n in {$names} if any(fnmatch.fnmatch(n, p) for p in {$patterns})]',
      cases: [
        { id: 'img', label: 'images', values: { names: 'a.png, b.jpg, c.gif, d.jpeg, e.txt', patterns: '*.png, *.jp*g' } },
      ],
    },
  ],
  demoExplainer: "filter returns the original items in their original order. In the 2024-0[1-3]-* case the bracket matches one character, so 2024-1-9.log fails at the 0 and 2024-04-01.log fails at the 4. '*.jp*g' covers both .jpg and .jpeg because * may also match nothing.",

  patterns: [
    {
      name: 'Python files in the current folder',
      desc: 'Combine with os.listdir — no disk access beyond the listing.',
      code: "import fnmatch, os\nscripts = fnmatch.filter(os.listdir('.'), '*.py')",
    },
    {
      name: 'Inside os.walk',
      desc: 'Filter the file names of each folder.',
      code: "import fnmatch, os\nfor root, dirs, files in os.walk('src'):\n    for name in fnmatch.filter(files, '*.py'):\n        print(os.path.join(root, name))",
    },
    {
      name: 'Keep the built-in filter usable',
      desc: 'Import the module, not the name — from fnmatch import filter hides the built-in filter().',
      code: "import fnmatch\nlogs = fnmatch.filter(names, '*.log')\nnon_empty = list(filter(None, lines))",
    },
  ],

  examples: [
    { title: 'Select by extension',      code: "import fnmatch\nfnmatch.filter(['setup.py', 'app.py', 'notes.txt'], '*.py')", returns: "['setup.py', 'app.py']" },
    { title: 'Order is kept',            code: "import fnmatch\nfnmatch.filter(['b.py', 'a.py', 'c.py'], '*.py')", returns: "['b.py', 'a.py', 'c.py']" },
    { title: 'Dot files match *',        code: "import fnmatch\nfnmatch.filter(['.env', 'app.py'], '*')", returns: "['.env', 'app.py']" },
    { title: 'Any iterable works',       code: "import fnmatch\nfnmatch.filter((f'part{i}.bin' for i in range(12)), 'part1?.bin')", returns: "['part10.bin', 'part11.bin']" },
    { title: 'A string is an iterable of characters', code: "import fnmatch\nfnmatch.filter('abc', '[ab]')", returns: "['a', 'b']" },
    { title: 'Nothing matches → empty list', code: "import fnmatch\nfnmatch.filter(['a.txt'], '*.md')", returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'Passing one name instead of a list',
      desc: 'names is iterated, so a single string is split into characters and each character is tested.',
      wrong: { label: 'a str', code: "import fnmatch\nfnmatch.filter('report.txt', '*.txt')", output: '[]' },
      fix:   { label: 'a list', code: "import fnmatch\nfnmatch.filter(['report.txt'], '*.txt')", output: "['report.txt']" },
    },
    {
      name: 'Expecting a path pattern to stop at /',
      desc: "filter knows nothing about folders: '*.py' also selects nested paths. Use glob (or glob.translate) when the folder structure matters.",
      wrong: { label: 'filter', code: "import fnmatch\nfnmatch.filter(['app.py', 'tests/test_app.py'], '*.py')", output: "['app.py', 'tests/test_app.py']" },
      fix:   { label: 'glob.translate', code: "import glob, re\nregex = glob.translate('*.py', seps='/')\n[p for p in ['app.py', 'tests/test_app.py'] if re.match(regex, p)]", output: "['app.py']" },
    },
  ],

  when: {
    use: [
      'You already have the names: os.listdir, os.scandir, zip or tar member lists, cloud storage keys',
      'Same pattern against many names — it is compiled and normalised once',
    ],
    avoid: [
      'Searching the disk directly → glob.glob',
      'The non-matching names → a list comprehension with not fnmatch(...), or filterfalse in 3.14+',
    ],
  },

  notes: {
    cpython:       'pat = os.path.normcase(pat); match = _compile_pattern(pat); on POSIX the names are matched as they are, on Windows each one goes through normcase before matching — the appended item is always the original',
    'glob':        'glob uses fnmatch.filter for every wildcard path segment (Lib/glob.py _glob1)',
    'filterfalse': 'Added in Python 3.14: fnmatch.filterfalse(names, pat), the names that do not match',
  },

  related: [
    { name: 'fnmatch.fnmatch',     slug: 'fnmatch',     when: 'One name at a time' },
    { name: 'fnmatch.fnmatchcase', slug: 'fnmatchcase', when: 'Case-sensitive everywhere' },
    { name: 'filter()',            slug: 'filter',      when: 'The built-in with any predicate', category: 'functions' },
    { name: 'glob.glob',           slug: 'glob',        when: 'Filter the file system directly', category: 'stdlib/glob' },
    { name: 'os.listdir',          slug: 'listdir',     when: 'Where the names usually come from', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I filter a list of filenames by a wildcard pattern?',
      a: "fnmatch.filter(names, '*.csv') returns a new list with the matching names in their original order. For several patterns use [n for n in names if any(fnmatch.fnmatch(n, p) for p in patterns)].",
    },
    {
      q: 'Is fnmatch.filter faster than calling fnmatch in a loop?',
      a: 'It does the same matching but normalises and looks up the compiled pattern once instead of per name, and on Linux and macOS it does not call normcase on the names at all. fnmatch() also caches the compiled pattern, so a loop over it only adds those per-name calls.',
    },
    {
      q: 'How do I get the names that do not match?',
      a: 'In Python 3.14+ use fnmatch.filterfalse(names, pat). Before that: [n for n in names if not fnmatch.fnmatch(n, pat)].',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fnmatch.html#fnmatch.filter',
    meta:  'fnmatch.filter',
  },
};
