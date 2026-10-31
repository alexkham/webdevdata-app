// content/reference/python/stdlib/glob/translate.js — glob.translate

export const meta = {
  slug:        'translate',
  name:        'glob.translate',
  signature:   'glob.translate(pathname, *, recursive=False, include_hidden=False, seps=None)',
  blurb:       'Convert a path pattern into a regular expression with glob semantics — * stays inside one segment, ** spans folders, dot names are excluded — to match path strings without touching the disk.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'glob.translate python 3.13 glob pattern to regex path pattern regular expression match path string without filesystem ** recursive include_hidden seps separator fnmatch translate difference gitignore-like matching',
};

export const method = {
  slug:      'translate',
  name:      'glob.translate',
  signature: 'glob.translate(pathname, *, recursive=False, include_hidden=False, seps=None)',
  returns:   { type: 'str', desc: 'A regular expression string (?s:...)\\Z for use with re.match. Not compiled.' },

  category:    'glob function',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'The path-aware sibling of fnmatch.translate: wildcards do not match separators, a * segment is exactly one path segment, ** (with recursive=True) any number of them, and hidden segments are excluded unless include_hidden=True. Pass seps explicitly — the default comes from the OS.',

  covers: ['translate'],

  cheat: {
    commonCall: "re.compile(glob.translate('src/**/*.py', recursive=True, seps='/'))",
    returns:    "'(?s:src/(?:[^/.][^/]*/)*(?!\\\\.)[^/]*\\\\.py)\\\\Z'",
    replaces:   'fnmatch.translate for path patterns (its * crosses /)',
    watchOut:   'without seps the regex depends on the OS: Windows accepts \\ and /, Linux only /',
  },

  parameters: [
    { name: 'pathname',       type: 'str', required: true,  default: null,    desc: 'Path pattern with * ? [seq] and ** segments.' },
    { name: 'recursive',      type: 'bool', required: false, default: 'False', desc: 'A ** segment matches any number of path segments. Without it ** inside a segment is just *.' },
    { name: 'include_hidden', type: 'bool', required: false, default: 'False', desc: 'Let wildcards match segments that start with a dot.' },
    { name: 'seps',           type: 'str | sequence of str | None', required: false, default: 'None', desc: "Separator characters, e.g. '/' or ('/', '\\\\'). None (or empty) means os.sep plus os.altsep: '/' on Linux and macOS, both \\ and / on Windows." },
  ],

  modes: [
    {
      id: 'regex',
      label: 'regex',
      blurb: 'The regex CPython 3.13 returns for recursive=True, seps="/".',
      params: [{ name: 'pattern', type: 'str', hint: 'path pattern', input: 'text' }],
      template: "import glob\nglob.translate({$pattern}, recursive=True, seps='/')",
      cases: [
        { id: 'txt',   label: '*.txt',         values: { pattern: '*.txt' } },
        { id: 'star',  label: '*',             values: { pattern: '*' } },
        { id: 'deep',  label: '**/*.py',       values: { pattern: '**/*.py' } },
        { id: 'under', label: 'src/**',        values: { pattern: 'src/**' } },
        { id: 'set',   label: 'data[0-9]/*.csv', values: { pattern: 'data[0-9]/*.csv' } },
      ],
    },
    {
      id: 'match',
      label: 'match paths',
      blurb: 'Which of these path strings the pattern accepts (recursive=True, seps="/").',
      params: [
        { name: 'pattern', type: 'str', hint: 'path pattern', input: 'text' },
        { name: 'paths',   type: 'list[str]', hint: 'paths, comma-separated', input: 'csv' },
      ],
      template: "import glob, re\nregex = glob.translate({$pattern}, recursive=True, seps='/')\n[p for p in {$paths} if re.match(regex, p)]",
      cases: [
        { id: 'deep', label: '**/*.py',      values: { pattern: '**/*.py', paths: 'a.py, src/a.py, src/x/a.py, .venv/a.py, src/a.pyc' } },
        { id: 'one',  label: '*/*.py',       values: { pattern: '*/*.py', paths: 'a.py, src/a.py, src/x/a.py' } },
        { id: 'tests', label: 'tests/**/test_*.py', values: { pattern: 'tests/**/test_*.py', paths: 'tests/test_a.py, tests/unit/test_b.py, tests/unit/helper.py, src/test_c.py' } },
        { id: 'dirs', label: 'build/**',     values: { pattern: 'build/**', paths: 'build, build/, build/a.o, build/x/y.o, build/.cache/z' } },
      ],
    },
    {
      id: 'hidden',
      label: 'include_hidden',
      blurb: 'Same paths with include_hidden=True: wildcards may match dot names.',
      params: [
        { name: 'pattern', type: 'str', hint: 'path pattern', input: 'text' },
        { name: 'paths',   type: 'list[str]', hint: 'paths, comma-separated', input: 'csv' },
      ],
      template: "import glob, re\nregex = glob.translate({$pattern}, recursive=True, include_hidden=True, seps='/')\n[p for p in {$paths} if re.match(regex, p)]",
      cases: [
        { id: 'deep', label: '**/*.py', values: { pattern: '**/*.py', paths: 'a.py, src/a.py, .venv/a.py, .hidden.py' } },
        { id: 'any',  label: '*',       values: { pattern: '*', paths: 'a, .env, dir/a' } },
      ],
    },
  ],
  demoExplainer: "[^/]* is one segment's worth of characters, so */*.py needs exactly one folder. (?!\\.) and [^/.] are the hidden-file rule: a segment matched by a wildcard may not start with a dot, which is why .venv/a.py is rejected until include_hidden=True. ** becomes (?:[^/.][^/]*/)* — zero or more non-hidden folders — and a final ** also accepts the folder itself with a trailing slash. The [0-9] set and literal text come from fnmatch's translation.",

  patterns: [
    {
      name: 'Match paths from a list, a zip or an API',
      desc: 'Glob semantics without a file system — e.g. the names inside an archive.',
      code: "import glob, re, zipfile\nis_source = re.compile(glob.translate('**/*.py', recursive=True, seps='/')).match\nwith zipfile.ZipFile('bundle.zip') as z:\n    sources = [n for n in z.namelist() if is_source(n)]",
    },
    {
      name: 'Several patterns, one regex',
      desc: 'Each translation is a self-contained (?s:...)\\Z group.',
      code: "import glob, re\npatterns = ['*.md', 'docs/**/*.rst']\nregex = re.compile('|'.join(glob.translate(p, recursive=True, seps='/') for p in patterns))",
    },
    {
      name: 'Case-insensitive',
      desc: 'Compile with re.IGNORECASE (this is what pathlib does for case-insensitive matching).',
      code: "import glob, re\nmatch = re.compile(glob.translate('**/*.jpg', recursive=True, seps='/'), re.IGNORECASE).match",
    },
  ],

  examples: [
    { title: 'The docs example (with seps)', code: "import glob\nglob.translate('**/*.txt', recursive=True, include_hidden=True, seps='/')", returns: "'(?s:(?:.+/)?[^/]*\\\\.txt)\\\\Z'" },
    { title: '* stays in one segment',       code: "import glob\nglob.translate('*.txt', seps='/')", returns: "'(?s:(?!\\\\.)[^/]*\\\\.txt)\\\\Z'" },
    { title: 'A whole-segment *',            code: "import glob\nglob.translate('*', seps='/')", returns: "'(?s:[^/.][^/]*)\\\\Z'" },
    { title: 'Without recursive, ** is *',   code: "import glob\nglob.translate('**/*.py', seps='/')", returns: "'(?s:(?!\\\\.)[^/]*/(?!\\\\.)[^/]*\\\\.py)\\\\Z'" },
    { title: 'Filter path strings',          code: "import glob, re\nregex = glob.translate('**/*.py', recursive=True, seps='/')\n[p for p in ['a.py', 'src/a.py', 'src/x/a.py', '.venv/a.py'] if re.match(regex, p)]", returns: "['a.py', 'src/a.py', 'src/x/a.py']" },
    { title: 'Both separators',              code: "import glob\nglob.translate('*.txt', seps='/\\\\')", returns: "'(?s:(?!\\\\.)[^/\\\\\\\\]*\\\\.txt)\\\\Z'" },
    { title: 'fnmatch vs glob on a path',    code: "import fnmatch, glob, re\nbool(re.match(fnmatch.translate('*.txt'), 'a/b.txt')), bool(re.match(glob.translate('*.txt', seps='/'), 'a/b.txt'))", returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'Forgetting recursive=True for **',
      desc: 'Without it ** is an ordinary * inside one segment, so **/*.py needs exactly one folder and a top-level file is rejected.',
      wrong: { label: 'default', code: "import glob, re\nbool(re.match(glob.translate('**/*.py', seps='/'), 'a.py'))", output: 'False' },
      fix:   { label: 'recursive=True', code: "import glob, re\nbool(re.match(glob.translate('**/*.py', recursive=True, seps='/'), 'a.py'))", output: 'True' },
    },
    {
      name: 'Hidden folders are excluded by default',
      desc: "A wildcard never matches a segment that starts with a dot — paths inside .venv or .git are rejected. include_hidden=True lifts the rule.",
      wrong: { label: 'default', code: "import glob, re\nbool(re.match(glob.translate('**/*.py', recursive=True, seps='/'), '.venv/a.py'))", output: 'False' },
      fix:   { label: 'include_hidden=True', code: "import glob, re\nbool(re.match(glob.translate('**/*.py', recursive=True, include_hidden=True, seps='/'), '.venv/a.py'))", output: 'True' },
    },
  ],

  when: {
    use: [
      'Glob-style matching of path strings that are not on disk: archive members, URLs, cloud keys, git paths',
      'One compiled regex for many path checks',
    ],
    avoid: [
      'Finding real files → glob.glob or pathlib.Path.glob',
      'Single names without folders → fnmatch',
      'Code that must run on Python 3.12 or older — translate is new in 3.13',
    ],
  },

  notes: {
    cpython:        "Lib/glob.py: splits the pattern on the separators, emits one regex piece per segment (a lone * becomes one_segment, ** any_segments) and reuses fnmatch._translate with [^/]* and [^/] for * and ? inside a segment. pathlib's full_match() and Path.glob() call it",
    'Default seps': "os.sep and os.altsep: on Windows glob.translate('*.txt') gives '(?s:(?!\\\\.)[^\\\\\\\\/]*\\\\.txt)\\\\Z' (both separators), on Linux the [^/] form — pass seps for portable output",
    'Version':      'Added in 3.13. The text shown is CPython 3.13; the current documentation shows the regex ending in \\z instead of \\Z',
  },

  related: [
    { name: 'fnmatch.translate', slug: 'translate',  when: 'Name-only wildcards (no separators)', category: 'stdlib/fnmatch' },
    { name: 'glob.glob',         slug: 'glob',       when: 'Match against the real file system' },
    { name: 'PurePath.match',    slug: 'match',      when: 'Path objects matching a pattern', category: 'stdlib/pathlib' },
    { name: 're.compile',        slug: 'compile',    when: 'Compile the regex once', category: 'stdlib/re' },
    { name: 're.match',          slug: 'match',      when: 'Apply it to a path string', category: 'stdlib/re' },
  ],

  faq: [
    {
      q: 'How do I match a path string against a glob pattern without the file system?',
      a: "In Python 3.13+: re.match(glob.translate(pattern, recursive=True, seps='/'), path). pathlib.PurePath.full_match(pattern) (also 3.13+) does the same for path objects. On older versions fnmatch works but its * also matches /.",
    },
    {
      q: 'What is the difference between glob.translate and fnmatch.translate?',
      a: "fnmatch.translate treats the pattern as one flat string: * becomes .* and crosses separators, and dots are not special. glob.translate understands segments: * and ? stop at a separator, ** spans folders (recursive=True), and wildcards do not match a leading dot unless include_hidden=True.",
    },
    {
      q: 'Why does glob.translate give a different regex on Windows?',
      a: "Because seps defaults to os.sep and os.altsep — both \\ and / on Windows, only / on Linux and macOS. Pass seps='/' (or the separators your paths use) to get the same regex everywhere.",
    },
  ],

  history: [
    { version: '3.13', note: 'glob.translate added; pathlib uses it for full_match() and glob()' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/glob.html#glob.translate',
    meta:  'glob.translate',
  },
};
