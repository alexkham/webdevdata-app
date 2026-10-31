// content/reference/python/stdlib/fnmatch/index.js — the fnmatch module hub

export const meta = {
  slug:        'index',
  name:        'fnmatch',
  signature:   'import fnmatch',
  blurb:       'Match file names against shell-style wildcards — *, ?, [seq] and [!seq] — one name at a time (fnmatch, fnmatchcase), a list at once (filter), or turned into a regular expression (translate).',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'fnmatch module python wildcard match filename pattern shell style glob pattern star question mark brackets fnmatch fnmatchcase filter translate case insensitive windows match file extension *.txt wildcard to regex',
};

export const method = {
  slug: 'index',
  name: 'fnmatch',

  category:    'File names',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Shell wildcards for strings: * matches anything, ? one character, [seq] one character from a set. Unlike glob it never touches the disk, and unlike a shell it treats / and a leading dot like any other character.',

  imports: ['import fnmatch', 'from fnmatch import fnmatch, fnmatchcase, filter, translate'],
  facts: [
    { label: 'Public API', value: 'fnmatch, fnmatchcase, filter, translate (3.13); filterfalse was added in 3.14' },
    { label: 'Wildcards',  value: '* any run of characters (also empty), ? exactly one character, [seq] one character in seq, [!seq] one character not in seq. No escape character: write [*] [?] [[] for the literal' },
    { label: 'Case',       value: 'fnmatch() and filter() pass both sides through os.path.normcase: case-insensitive on Windows, case-sensitive on Linux and macOS. fnmatchcase() is always case-sensitive' },
    { label: 'Engine',     value: 'Lib/fnmatch.py turns the pattern into a regular expression (translate) and caches the compiled pattern with functools.lru_cache(maxsize=32768)' },
  ],

  modes: [
    {
      id: 'filter',
      label: 'filter',
      blurb: 'Keep the names that match. The demo runs the Linux rules (case-sensitive); the cases give the same result on every OS.',
      params: [
        { name: 'names',   type: 'list[str]', hint: 'file names, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\nfnmatch.filter({$names}, {$pattern})',
      cases: [
        { id: 'ext',    label: '*.py',        values: { names: 'app.py, test_app.py, notes.txt, setup.cfg', pattern: '*.py' } },
        { id: 'prefix', label: 'test_*.py',   values: { names: 'app.py, test_app.py, test_db.py, tests.txt', pattern: 'test_*.py' } },
        { id: 'digit',  label: '[0-9] range', values: { names: 'log1.txt, log2.txt, logx.txt, log10.txt', pattern: 'log[0-9].txt' } },
        { id: 'dots',   label: 'dot files',   values: { names: '.bashrc, .env, notes.txt', pattern: '*' } },
      ],
    },
    {
      id: 'case',
      label: 'fnmatchcase',
      blurb: 'One name, one pattern, always case-sensitive.',
      params: [
        { name: 'name',    type: 'str', hint: 'a file name', input: 'text' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\nfnmatch.fnmatchcase({$name}, {$pattern})',
      cases: [
        { id: 'jpg',   label: 'Photo.JPG vs *.jpg', values: { name: 'Photo.JPG', pattern: '*.jpg' } },
        { id: 'upper', label: '[A-Z]*',             values: { name: 'Readme.md', pattern: '[A-Z]*' } },
        { id: 'qmark', label: 'literal ?',          values: { name: 'what?', pattern: 'what[?]' } },
        { id: 'slash', label: '* crosses /',        values: { name: 'src/app.py', pattern: '*.py' } },
      ],
    },
    {
      id: 'translate',
      label: 'translate',
      blurb: 'The regular expression fnmatch builds from your pattern (CPython 3.13 text).',
      params: [{ name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' }],
      template: 'import fnmatch\nfnmatch.translate({$pattern})',
      cases: [
        { id: 'ext',   label: '*.txt',       values: { pattern: '*.txt' } },
        { id: 'set',   label: '*.py[co]',    values: { pattern: '*.py[co]' } },
        { id: 'neg',   label: '[!a-c]?',     values: { pattern: '[!a-c]?' } },
        { id: 'stars', label: 'a*b*c',       values: { pattern: 'a*b*c' } },
      ],
    },
  ],
  demoExplainer: "filter keeps dot files for '*' — only glob hides names that start with a dot. In the translate tab, '.' becomes \\. and ? becomes . (any one character); the whole regex is wrapped in (?s:...)\\Z, so it must match the entire name, newlines included. A * between two fixed pieces becomes an atomic group (?>.*?b) — no backtracking, so patterns with many stars stay fast.",

  patterns: [
    {
      name: 'Files with one of several extensions',
      desc: 'Combine patterns with any(); fnmatch has no {a,b} brace syntax.',
      code: "import fnmatch, os\nwanted = ('*.jpg', '*.jpeg', '*.png')\nimages = [f for f in os.listdir('.') if any(fnmatch.fnmatch(f, p) for p in wanted)]",
    },
    {
      name: 'Skip names during os.walk',
      desc: 'Prune directories in place so walk does not descend into them.',
      code: "import fnmatch, os\nIGNORE = ['.git', 'node_modules', '__pycache__', '*.egg-info']\nfor root, dirs, files in os.walk('.'):\n    dirs[:] = [d for d in dirs if not any(fnmatch.fnmatch(d, p) for p in IGNORE)]\n    for name in fnmatch.filter(files, '*.py'):\n        print(os.path.join(root, name))",
    },
    {
      name: 'Case-insensitive on every OS',
      desc: 'Lower-case both sides and use fnmatchcase, so Linux and Windows agree.',
      code: "import fnmatch\ndef matches(name, pattern):\n    return fnmatch.fnmatchcase(name.lower(), pattern.lower())",
    },
    {
      name: 'One compiled regex for many patterns',
      desc: 'translate() results can be joined with |. Not in the docs, but a comment in Lib/fnmatch.py says people rely on it and the code keeps it working.',
      code: "import fnmatch, re\nregex = re.compile('|'.join(fnmatch.translate(p) for p in ['*.log', '*.tmp', 'core.*']))\njunk = [name for name in names if regex.match(name)]",
    },
  ],

  examples: [
    { title: 'Match a file extension',      code: "import fnmatch\nfnmatch.fnmatch('report.txt', '*.txt')", returns: 'True' },
    { title: 'Filter a list of names',      code: "import fnmatch\nfnmatch.filter(['app.py', 'test_app.py', 'notes.txt'], 'test_*.py')", returns: "['test_app.py']" },
    { title: 'Ranges and negation',         code: "import fnmatch\n[fnmatch.fnmatchcase(n, 'log[!0-9].txt') for n in ['log1.txt', 'logx.txt']]", returns: '[False, True]' },
    { title: 'A literal wildcard character', code: "import fnmatch\nfnmatch.fnmatchcase('what?', 'what[?]'), fnmatch.fnmatchcase('whatx', 'what[?]')", returns: '(True, False)' },
    { title: 'Dot files are not special',   code: "import fnmatch\nfnmatch.fnmatchcase('.bashrc', '*')", returns: 'True' },
    { title: 'The regex behind a pattern',  code: "import fnmatch\nfnmatch.translate('*.txt')", returns: "'(?s:.*\\\\.txt)\\\\Z'" },
    { title: 'What Windows does: normcase', code: "import fnmatch, ntpath\nfnmatch.fnmatchcase(ntpath.normcase('A.TXT'), ntpath.normcase('*.txt'))", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Expecting * to stop at a slash',
      desc: 'fnmatch treats / as an ordinary character, so *.py also matches a path in a sub-folder. For path-aware matching use glob.translate (3.13+) or pathlib.',
      wrong: { label: 'fnmatch', code: "import fnmatch\nfnmatch.fnmatchcase('src/app.py', '*.py')", output: 'True' },
      fix:   { label: 'glob.translate', code: "import glob, re\nbool(re.match(glob.translate('*.py', seps='/'), 'src/app.py'))", output: 'False' },
    },
    {
      name: 'Escaping a wildcard with a backslash',
      desc: 'There is no escape character: the backslash is a literal character (and a path separator on Windows). Put the wildcard in brackets instead.',
      wrong: { label: 'a\\*b', code: "import fnmatch\nfnmatch.fnmatchcase('a*b', 'a\\\\*b')", output: 'False' },
      fix:   { label: 'a[*]b', code: "import fnmatch\nfnmatch.fnmatchcase('a*b', 'a[*]b')", output: 'True' },
    },
    {
      name: 'Case rules that change with the OS',
      desc: 'fnmatch() ignores case on Windows only. For one behaviour everywhere, normalise case yourself and call fnmatchcase().',
      wrong: { label: 'fnmatchcase', code: "import fnmatch\nfnmatch.fnmatchcase('Photo.JPG', '*.jpg')", output: 'False' },
      fix:   { label: 'lower() first', code: "import fnmatch\nfnmatch.fnmatchcase('Photo.JPG'.lower(), '*.jpg')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Testing names you already have (from os.listdir, os.walk, a zip file, an S3 listing) against wildcards',
      'Include / exclude lists in configs: *.pyc, build*, .git',
      'Turning user-typed wildcards into a regex with translate',
    ],
    avoid: [
      'Finding files on disk → glob.glob or pathlib.Path.glob',
      'Wildcards that must respect / between folders → glob.translate (3.13+) or PurePath.full_match (3.13+)',
      'Anything a wildcard cannot express (alternatives, repetition) → re',
    ],
  },

  notes: {
    cpython:          'Lib/fnmatch.py — pure Python on top of re. translate() builds the regex, _compile_pattern caches re.compile(...).match per pattern (lru_cache, 32768 entries)',
    'Brackets':       "Inside [...] a ! at the start negates, ranges like a-z work, a ] right after [ or [! is literal, and an unclosed [ matches a literal '['. An empty range such as [z-a] never matches",
    'bytes':          'Patterns and names may both be bytes (handled as Latin-1); mixing bytes and str raises TypeError',
    'Version notes':  '3.14 adds filterfalse(names, pat). The current documentation shows translate() output ending in \\z instead of \\Z — copy regexes from the Python version you run',
  },

  related: [
    { name: 'glob module',    slug: 'glob',    when: 'Find matching files on disk', category: 'stdlib' },
    { name: 're module',      slug: 're',      when: 'Full regular expressions', category: 'stdlib' },
    { name: 'pathlib module', slug: 'pathlib', when: 'Path.glob and PurePath.match', category: 'stdlib' },
    { name: 'os module',      slug: 'os',      when: 'listdir and walk produce the names to match', category: 'stdlib' },
    { name: 'filter()',       slug: 'filter',  when: 'The built-in filter with any predicate', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between fnmatch and glob in Python?',
      a: 'fnmatch only compares strings you give it with a pattern; glob lists the file system and returns the paths that exist. glob uses fnmatch.filter for each path segment, but adds two rules: * and ? do not cross a / and do not match names starting with a dot (unless the pattern starts with a dot or include_hidden=True).',
    },
    {
      q: 'Is fnmatch case-sensitive?',
      a: 'fnmatch.fnmatch() and fnmatch.filter() follow the operating system: they run both strings through os.path.normcase, which lower-cases (and turns / into \\) on Windows and does nothing on Linux and macOS. fnmatch.fnmatchcase() is case-sensitive everywhere.',
    },
    {
      q: 'How do I match a literal * or ? with fnmatch?',
      a: "Wrap it in square brackets: 'file[*].txt' matches the name file*.txt and 'what[?]' matches what?. For a literal [ use [[]. A backslash does not escape anything.",
    },
    {
      q: 'How do I match several patterns at once?',
      a: "any(fnmatch.fnmatch(name, p) for p in patterns), or build one regex: re.compile('|'.join(fnmatch.translate(p) for p in patterns)). fnmatch has no brace expansion like *.{jpg,png}.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fnmatch.html',
    meta:  'fnmatch — Unix filename pattern matching',
  },
};
