// content/reference/python/stdlib/shutil/ignore_patterns.js

export const meta = {
  slug:        'ignore_patterns',
  name:        'shutil.ignore_patterns',
  signature:   'shutil.ignore_patterns(*patterns)',
  blurb:       'Build an ignore callable for copytree: it returns the set of names in a folder that match any of the glob-style patterns.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil ignore_patterns copytree ignore exclude files pattern glob fnmatch skip pycache git node_modules exclude extension wildcard python copy folder exclude',
};

export const method = {
  slug:      'ignore_patterns',
  name:      'shutil.ignore_patterns',
  signature: 'shutil.ignore_patterns(*patterns)',
  returns:   { type: 'callable(path, names) -> set[str]', desc: 'A function that returns the names to skip; pass it as copytree(..., ignore=...).' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'A tiny factory: the function it returns runs fnmatch.filter(names, pattern) for every pattern and returns the union as a set. Patterns see bare names — never paths — in every folder copytree visits.',

  covers: ['ignore_patterns'],

  cheat: {
    commonCall: "shutil.ignore_patterns('*.pyc', '__pycache__', '.git')",
    returns:    'a callable(path, names) → set of names to skip',
    replaces:   'A hand-written ignore function with fnmatch',
    watchOut:   'Patterns match names, not paths; on Windows matching is case-insensitive',
  },

  parameters: [
    { name: '*patterns', type: 'str', required: false, default: null, desc: 'fnmatch patterns: * any characters, ? one character, [seq] / [!seq] a character from (not from) seq. A name matching any pattern is skipped.' },
  ],

  modes: [
    {
      id: 'filter',
      label: 'which names match',
      blurb: 'Call the returned function directly with a folder path and a list of names — exactly what copytree does for each folder.',
      params: [
        { name: 'names',    type: 'list[str]', hint: 'names in one folder', input: 'csv' },
        { name: 'patterns', type: 'list[str]', hint: 'glob patterns',       input: 'csv' },
      ],
      template: "import shutil\nignore = shutil.ignore_patterns(*{$patterns})\nsorted(ignore('src', {$names}))",
      cases: [
        { id: 'py',     label: 'Python junk', values: { names: 'app.py, app.pyc, __pycache__, .git, README.md', patterns: '*.pyc, __pycache__, .git' } },
        { id: 'hidden', label: 'hidden',      values: { names: '.env, .git, .gitignore, main.py', patterns: '.*' } },
        { id: 'class',  label: '[!…] class',  values: { names: 'log1.txt, log2.txt, logA.txt, log.txt', patterns: 'log[!0-9].txt' } },
        { id: 'none',   label: 'no patterns', values: { names: 'a.txt, b.txt', patterns: '' } },
      ],
    },
    {
      id: 'tree',
      label: 'in copytree',
      blurb: 'Create files under src/, copy it with your patterns and list what arrived. Every folder level is filtered on its own.',
      params: [
        { name: 'files',    type: 'list[str]', hint: 'files under src/', input: 'csv' },
        { name: 'patterns', type: 'list[str]', hint: 'glob patterns',    input: 'csv' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nshutil.copytree('src', 'dst', ignore=shutil.ignore_patterns(*{$patterns}))\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('dst') for n in fs)",
      cases: [
        { id: 'deep',  label: 'any depth',     values: { files: 'src/a.log, src/lib/b.log, src/lib/deep/c.log, src/lib/deep/c.py', patterns: '*.log' } },
        { id: 'path',  label: 'a path pattern', values: { files: 'src/build/out.o, src/main.c', patterns: 'src/build' } },
        { id: 'dir',   label: 'a folder name', values: { files: 'src/build/out.o, src/main.c', patterns: 'build' } },
      ],
    },
  ],
  demoExplainer: "The result is a set — sorted here — of the names to skip. '.*' matches every name that starts with a dot, because fnmatch gives a leading dot no special meaning. [!0-9] means one character that is not a digit, so only logA.txt matches. In copytree the pattern *.log removes log files at every depth, while 'src/build' matches nothing: copytree passes bare names like 'build', never paths.",

  patterns: [
    {
      name: 'The usual Python project exclusions',
      desc: 'Caches, bytecode, VCS and virtualenv folders.',
      code: "import shutil\nIGNORE = shutil.ignore_patterns('__pycache__', '*.pyc', '.git', '.venv', '*.egg-info')\nshutil.copytree('project', 'release', ignore=IGNORE)",
    },
    {
      name: 'Patterns plus your own rule',
      desc: 'Combine the returned set with names you compute yourself.',
      code: "import os, shutil\nby_pattern = shutil.ignore_patterns('*.tmp')\ndef ignore(path, names):\n    big = {n for n in names if os.path.isfile(os.path.join(path, n)) and os.path.getsize(os.path.join(path, n)) > 10_000_000}\n    return by_pattern(path, names) | big\nshutil.copytree('data', 'data-small', ignore=ignore)",
    },
    {
      name: 'Skip one folder only at a specific path',
      desc: 'Check the path argument yourself — patterns cannot.',
      code: "import os, shutil\ndef ignore(path, names):\n    return {'build'} if os.path.basename(path) == 'src' else set()\nshutil.copytree('repo', 'copy', ignore=ignore)",
    },
  ],

  examples: [
    { title: 'It returns a function', code: "import shutil\ncallable(shutil.ignore_patterns('*.pyc'))", returns: 'True' },
    { title: 'Call it like copytree does', code: "import shutil\nignore = shutil.ignore_patterns('*.pyc', 'tmp*')\nsorted(ignore('src', ['a.py', 'a.pyc', 'tmp', 'tmp2', 'b.txt']))", returns: "['a.pyc', 'tmp', 'tmp2']" },
    { title: 'The result is a set', code: "import shutil\ntype(shutil.ignore_patterns('*')('src', ['a'])).__name__", returns: "'set'" },
    { title: 'Character classes', code: "import shutil\nsorted(shutil.ignore_patterns('[ab]*')('.', ['apple', 'banana', 'cherry']))", returns: "['apple', 'banana']" },
    { title: 'No patterns ignore nothing', code: "import shutil\nshutil.ignore_patterns()('src', ['a', 'b'])", returns: 'set()' },
    { title: 'Used with copytree', code: "import os, shutil\nos.makedirs('src/__pycache__')\nopen('src/app.py', 'w').close()\nshutil.copytree('src', 'dst', ignore=shutil.ignore_patterns('__pycache__'))\nos.listdir('dst')", returns: "['app.py']" },
  ],

  pitfalls: [
    {
      name: 'Writing a path into a pattern',
      desc: 'copytree calls the ignore function with bare names of one folder, so slashes in a pattern can never match.',
      wrong: { label: "'docs/drafts'", code: "import shutil\nsorted(shutil.ignore_patterns('docs/drafts')('docs', ['drafts', 'guide.md']))", output: '[]' },
      fix:   { label: "'drafts'", code: "import shutil\nsorted(shutil.ignore_patterns('drafts')('docs', ['drafts', 'guide.md']))", output: "['drafts']" },
    },
    {
      name: 'Expecting ** to mean "any folders"',
      desc: "fnmatch has no recursive **; it is just two stars, i.e. one *. And because every folder level is filtered on its own, '*.log' already covers all depths.",
      wrong: { label: "'**/*.log'", code: "import shutil\nsorted(shutil.ignore_patterns('**/*.log')('logs', ['app.log', 'db.log']))", output: '[]' },
      fix:   { label: "'*.log'", code: "import shutil\nsorted(shutil.ignore_patterns('*.log')('logs', ['app.log', 'db.log']))", output: "['app.log', 'db.log']" },
    },
  ],

  when: {
    use: [
      'Excluding files or folders by name or extension in copytree',
      'Building a reusable exclusion list once and passing it around',
    ],
    avoid: [
      'Rules that depend on the path, size or age of a file → write your own ignore(path, names)',
      'Recursive glob matching outside copytree → pathlib.Path.glob / rglob',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: def _ignore_patterns(path, names): ignored = []; for pattern in patterns: ignored.extend(fnmatch.filter(names, pattern)); return set(ignored)',
    'Case':       'fnmatch.filter normalizes case on Windows (os.path.normcase), so *.TXT also skips notes.txt there — but not on Linux or macOS',
    'Syntax':     "Only *, ?, [seq] and [!seq]; there is no escaping, no ** and no brace expansion — '[*]' matches a literal star",
  },

  related: [
    { name: 'shutil.copytree', slug: 'copytree', when: 'Where the callable is used' },
    { name: 'pathlib match / glob', slug: 'glob', when: 'Glob patterns with ** for paths', category: 'stdlib/pathlib' },
    { name: 'shutil module',   slug: 'shutil',   when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I exclude a folder from shutil.copytree?',
      a: "Pass ignore=shutil.ignore_patterns('folder_name'). The name is skipped in every folder at every depth. To exclude it only at one location, write your own function(path, names) that checks path and returns {'folder_name'} only there.",
    },
    {
      q: 'Is ignore_patterns case-sensitive?',
      a: 'It uses fnmatch.filter, which is case-sensitive on Linux and macOS and case-insensitive on Windows (both names and patterns are lower-cased there).',
    },
    {
      q: 'Can I use ignore_patterns outside copytree?',
      a: "Yes — it is just a function of (path, names): shutil.ignore_patterns('*.pyc')('any', names) returns the matching names as a set. For simple filtering, fnmatch.filter(names, pattern) is the more direct tool.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.ignore_patterns',
    meta:  'shutil.ignore_patterns',
  },

};
