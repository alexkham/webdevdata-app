// content/reference/python/stdlib/fnmatch/fnmatch.js — fnmatch.fnmatch

export const meta = {
  slug:        'fnmatch',
  name:        'fnmatch.fnmatch',
  signature:   'fnmatch.fnmatch(name, pat)',
  blurb:       'Test one file name against a shell-style pattern (* ? [seq] [!seq]); case-insensitive on Windows, case-sensitive on Linux and macOS.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'fnmatch fnmatch.fnmatch python wildcard match file name pattern *.txt check if filename matches pattern shell pattern case insensitive windows normcase',
};

export const method = {
  slug:      'fnmatch',
  name:      'fnmatch.fnmatch',
  signature: 'fnmatch.fnmatch(name, pat)',
  returns:   { type: 'bool', desc: 'True if the whole name matches the pattern after both went through os.path.normcase.' },

  category:    'fnmatch function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: "The pattern must match the entire name, not just part of it. Both arguments go through os.path.normcase first — that is the only difference from fnmatchcase(), and the reason the same call can give True on Windows and False on Linux.",

  covers: ['fnmatch'],

  cheat: {
    commonCall: "fnmatch.fnmatch(name, '*.txt')",
    returns:    'True or False',
    replaces:   'name.endswith(...) chains and hand-written regexes for simple wildcards',
    watchOut:   'case-insensitive only on Windows; * also matches / and leading dots',
  },

  parameters: [
    { name: 'name', type: 'str | bytes', required: true, default: null, desc: 'The file name (or any string) to test. Passed through os.path.normcase.' },
    { name: 'pat',  type: 'str | bytes', required: true, default: null, desc: 'Shell-style pattern: * any run of characters, ? one character, [seq] / [!seq] one character in / not in seq. Must be the same type as name.' },
  ],

  modes: [
    {
      id: 'match',
      label: 'match',
      blurb: 'One name against one pattern. The demo applies the Linux rule (normcase changes nothing); these cases give the same answer on Windows.',
      params: [
        { name: 'name',    type: 'str', hint: 'a file name', input: 'text' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\nfnmatch.fnmatch({$name}, {$pattern})',
      cases: [
        { id: 'ext',   label: '*.txt',         values: { name: 'report.txt', pattern: '*.txt' } },
        { id: 'gz',    label: 'only the end',  values: { name: 'backup.tar.gz', pattern: '*.tar' } },
        { id: 'range', label: 'data[0-9].csv', values: { name: 'data7.csv', pattern: 'data[0-9].csv' } },
        { id: 'dot',   label: '.bashrc vs *',  values: { name: '.bashrc', pattern: '*' } },
        { id: 'one',   label: '? is one char', values: { name: 'img_12.png', pattern: 'img_?.png' } },
      ],
    },
    {
      id: 'many',
      label: 'list comprehension',
      blurb: 'The usual loop: keep the names that match.',
      params: [
        { name: 'names',   type: 'list[str]', hint: 'file names, comma-separated', input: 'csv' },
        { name: 'pattern', type: 'str', hint: 'shell-style pattern', input: 'text' },
      ],
      template: 'import fnmatch\n[n for n in {$names} if fnmatch.fnmatch(n, {$pattern})]',
      cases: [
        { id: 'logs', label: '*.log',       values: { names: 'app.log, app.log.1, error.log, readme.md', pattern: '*.log' } },
        { id: 'rot',  label: '*.log.[0-9]', values: { names: 'app.log, app.log.1, app.log.12, error.log.2', pattern: '*.log.[0-9]' } },
      ],
    },
  ],
  demoExplainer: "The pattern is anchored at both ends: '*.tar' does not match backup.tar.gz because the name goes on after .tar. A leading dot is an ordinary character for fnmatch, so '*' matches .bashrc (glob would skip it). ? stands for exactly one character, so img_?.png rejects img_12.png.",

  patterns: [
    {
      name: 'Filter a directory listing',
      desc: 'The example from the documentation: print every .txt name in the current folder.',
      code: "import fnmatch, os\nfor file in os.listdir('.'):\n    if fnmatch.fnmatch(file, '*.txt'):\n        print(file)",
    },
    {
      name: 'Exclude list',
      desc: 'Skip a name when it matches any ignore pattern.',
      code: "import fnmatch\nIGNORE = ['*.pyc', '*.tmp', '.DS_Store']\ndef ignored(name):\n    return any(fnmatch.fnmatch(name, p) for p in IGNORE)",
    },
    {
      name: 'Same behaviour on every OS',
      desc: 'fnmatchcase plus explicit lower() — no dependence on os.path.normcase.',
      code: "import fnmatch\nfnmatch.fnmatchcase(name.lower(), '*.jpg')",
    },
  ],

  examples: [
    { title: 'Extension check',             code: "import fnmatch\nfnmatch.fnmatch('report.txt', '*.txt')", returns: 'True' },
    { title: 'The whole name must match',   code: "import fnmatch\nfnmatch.fnmatch('backup.tar.gz', '*.tar')", returns: 'False' },
    { title: 'One digit',                   code: "import fnmatch\nfnmatch.fnmatch('data7.csv', 'data[0-9].csv')", returns: 'True' },
    { title: 'Anything but a digit',        code: "import fnmatch\nfnmatch.fnmatch('dataX.csv', 'data[!0-9].csv')", returns: 'True' },
    { title: 'The empty name matches *',    code: "import fnmatch\nfnmatch.fnmatch('', '*')", returns: 'True' },
    { title: 'bytes with bytes',            code: "import fnmatch\nfnmatch.fnmatch(b'a.txt', b'*.txt')", returns: 'True' },
    { title: 'Windows normcase, shown with ntpath', code: "import ntpath\nntpath.normcase('Docs/A.TXT'), ntpath.normcase('*.txt')", returns: "('docs\\\\a.txt', '*.txt')" },
  ],

  pitfalls: [
    {
      name: 'Mixing str and bytes',
      desc: 'name and pat must both be str or both be bytes — os.listdir(b".") gives bytes names.',
      wrong: { label: 'bytes name, str pattern', code: "import fnmatch\nfnmatch.fnmatch(b'a.txt', '*.txt')", output: 'TypeError: cannot use a string pattern on a bytes-like object' },
      fix:   { label: 'same type', code: "import fnmatch\nfnmatch.fnmatch(b'a.txt'.decode(), '*.txt')", output: 'True' },
    },
    {
      name: 'Assuming the result is the same on every OS',
      desc: "On Windows fnmatch('A.TXT', '*.txt') is True (normcase lower-cases both), on Linux it is False. When the answer must not depend on the platform, decide the case rule yourself.",
      wrong: { label: 'case-sensitive', code: "import fnmatch\nfnmatch.fnmatchcase('A.TXT', '*.txt')", output: 'False' },
      fix:   { label: 'explicit lower()', code: "import fnmatch\nfnmatch.fnmatchcase('A.TXT'.lower(), '*.txt')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Checking names you already have against a user-supplied wildcard',
      'Matching that should follow the local file system case rule',
    ],
    avoid: [
      'The same answer on every OS → fnmatchcase',
      'Many names, one pattern → filter (normalises the pattern once)',
      'Paths where * must not cross a folder → glob.translate or pathlib',
    ],
  },

  notes: {
    cpython:      'def fnmatch(name, pat): name = os.path.normcase(name); pat = os.path.normcase(pat); return fnmatchcase(name, pat)',
    'normcase':   "Windows (ntpath): lower-case and / → \\. Linux and macOS (posixpath): unchanged, so matching there is case-sensitive whatever the file system does",
    'Errors':     'A non-path type such as None raises TypeError from normcase: expected str, bytes or os.PathLike object, not NoneType',
  },

  related: [
    { name: 'fnmatch.fnmatchcase', slug: 'fnmatchcase', when: 'Always case-sensitive' },
    { name: 'fnmatch.filter',      slug: 'filter',      when: 'Many names at once' },
    { name: 'fnmatch.translate',   slug: 'translate',   when: 'The regex behind the pattern' },
    { name: 'glob.glob',           slug: 'glob',        when: 'Match files that exist on disk', category: 'stdlib/glob' },
    { name: 'fnmatch module',      slug: 'fnmatch',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check if a filename matches a wildcard pattern in Python?',
      a: "fnmatch.fnmatch(name, '*.txt') returns True or False. The pattern must match the whole name; * matches any run of characters, ? exactly one, [abc] one of a set.",
    },
    {
      q: 'Why does fnmatch give different results on Windows and Linux?',
      a: 'Because it calls os.path.normcase on both arguments. On Windows that lower-cases them and turns / into \\, so matching ignores case; on Linux and macOS normcase returns the strings unchanged. Use fnmatchcase() for identical results everywhere.',
    },
    {
      q: 'Does fnmatch match hidden files?',
      a: "Yes. A leading dot is not special: fnmatch('.bashrc', '*') is True. Hiding dot files is a glob rule, not an fnmatch rule.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/fnmatch.html#fnmatch.fnmatch',
    meta:  'fnmatch.fnmatch',
  },
};
