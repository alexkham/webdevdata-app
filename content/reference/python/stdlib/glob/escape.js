// content/reference/python/stdlib/glob/escape.js — glob.escape

export const meta = {
  slug:        'escape',
  name:        'glob.escape',
  signature:   'glob.escape(pathname)',
  blurb:       'Escape the glob special characters * ? [ in a path by wrapping each in brackets, so a name like data[1].txt is matched literally.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'glob.escape python escape special characters glob brackets literal match file name with square brackets question mark asterisk [[] [?] [*] glob filename containing brackets',
};

export const method = {
  slug:      'escape',
  name:      'glob.escape',
  signature: 'glob.escape(pathname)',
  returns:   { type: 'str | bytes', desc: 'The path with every * ? [ replaced by [*] [?] [[] — the drive / UNC part on Windows left alone.' },

  category:    'glob function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Glob has no backslash escapes; a special character is made literal by putting it alone in a character class. escape does that for the three magic characters and leaves everything else — including ] and your folder separators — untouched.',

  covers: ['escape'],

  cheat: {
    commonCall: "glob.glob(os.path.join(glob.escape(folder), '*.txt'))",
    returns:    "'reports [[]2024]/*.txt' — your wildcard stays active",
    replaces:   'hand-escaping user-supplied folder names',
    watchOut:   'escape only the literal part, not the whole pattern',
  },

  parameters: [
    { name: 'pathname', type: 'str | bytes', required: true, default: null, desc: "A literal path. Every '*', '?' and '[' outside the drive part becomes '[*]', '[?]', '[[]'." },
  ],

  modes: [
    {
      id: 'escape',
      label: 'escape',
      blurb: 'What escape returns.',
      params: [{ name: 'name', type: 'str', hint: 'a literal path', input: 'text' }],
      template: 'import glob\nglob.escape({$name})',
      cases: [
        { id: 'br',   label: 'data[1].txt',      values: { name: 'data[1].txt' } },
        { id: 'q',    label: 'Quo vadis?.txt',   values: { name: 'Quo vadis?.txt' } },
        { id: 'star', label: '*.py',             values: { name: '*.py' } },
        { id: 'path', label: 'a/b*/c',           values: { name: 'a/b*/c' } },
        { id: 'none', label: 'nothing special',  values: { name: 'notes (v2).txt' } },
      ],
    },
    {
      id: 'find',
      label: 'raw vs escaped',
      blurb: 'Create a file with that name, then glob for it with and without escape.',
      params: [{ name: 'name', type: 'str', hint: 'a file name', input: 'text' }],
      template: "import glob\nopen({$name}, 'w', encoding='utf-8').close()\nglob.glob({$name}), glob.glob(glob.escape({$name}))",
      cases: [
        { id: 'br',    label: 'data[1].txt',     values: { name: 'data[1].txt' } },
        { id: 'range', label: 'v[1-2].txt',      values: { name: 'v[1-2].txt' } },
        { id: 'plain', label: 'plain.txt',       values: { name: 'plain.txt' } },
      ],
    },
    {
      id: 'folder',
      label: 'escaped folder + wildcard',
      blurb: 'Escape the folder, keep your own *.pdf active.',
      params: [{ name: 'folder', type: 'str', hint: 'a folder name', input: 'text' }],
      template: "import glob, os\nos.makedirs({$folder})\nfor n in ['a.pdf', 'b.txt']:\n    open(os.path.join({$folder}, n), 'w', encoding='utf-8').close()\nsorted(os.path.basename(p) for p in glob.glob(os.path.join(glob.escape({$folder}), '*.pdf')))",
      cases: [
        { id: 'year', label: 'reports [2024]', values: { folder: 'reports [2024]' } },
        { id: 'flat', label: 'plain folder',   values: { folder: 'reports' } },
      ],
    },
  ],
  demoExplainer: "Unescaped, data[1].txt is the pattern data + one character from the set {1} + .txt, which matches data1.txt, not the real file — so the first list is empty. v[1-2].txt likewise looks for v1.txt or v2.txt. After escape the bracket is literal and the file is found. A name without * ? [ is returned unchanged, and ] is never escaped (a lone ] is not special).",

  patterns: [
    {
      name: 'User-supplied folder, your own wildcard',
      desc: 'Escape what came from outside, then append the pattern.',
      code: "import glob, os\ndef pdfs_in(folder):\n    return glob.glob(os.path.join(glob.escape(folder), '*.pdf'))",
    },
    {
      name: 'Check one literal path with glob semantics',
      desc: 'Equivalent to an existence test, safe for names with brackets.',
      code: "import glob\nfound = glob.glob(glob.escape(path))",
    },
    {
      name: 'Escape for fnmatch too',
      desc: 'The bracket trick is plain fnmatch syntax, so escaped names work with fnmatch.',
      code: "import fnmatch, glob\nfnmatch.fnmatchcase(name, glob.escape(name))",
    },
  ],

  examples: [
    { title: 'Brackets in a file name', code: "import glob\nglob.escape('data[1].txt')", returns: "'data[[]1].txt'" },
    { title: 'Question mark',           code: "import glob\nglob.escape('Quo vadis?.txt')", returns: "'Quo vadis[?].txt'" },
    { title: 'Star',                    code: "import glob\nglob.escape('*.py')", returns: "'[*].py'" },
    { title: 'Separators are untouched', code: "import glob\nglob.escape('a/b*/c')", returns: "'a/b[*]/c'" },
    { title: 'Finds the literal file',  code: "import glob\nopen('data[1].txt', 'w', encoding='utf-8').close()\nglob.glob('data[1].txt'), glob.glob(glob.escape('data[1].txt'))", returns: "([], ['data[1].txt'])" },
    { title: 'Works with fnmatch as well', code: "import fnmatch, glob\nfnmatch.fnmatchcase('data[1].txt', glob.escape('data[1].txt'))", returns: 'True' },
    { title: 'bytes too',               code: "import glob\nglob.escape(b'x?.bin')", returns: "b'x[?].bin'" },
  ],

  pitfalls: [
    {
      name: 'Escaping the whole pattern',
      desc: 'escape also neutralises the wildcards you meant to keep. Escape only the literal part and join the pattern on afterwards.',
      wrong: { label: 'escape(all)', code: "import glob, os\nos.makedirs('reports [2024]')\nopen('reports [2024]/a.pdf', 'w', encoding='utf-8').close()\nglob.glob(glob.escape('reports [2024]/*.pdf'))", output: '[]' },
      fix:   { label: 'escape(folder) + pattern', code: "import glob, os\nos.makedirs('reports [2024]')\nopen('reports [2024]/a.pdf', 'w', encoding='utf-8').close()\n[os.path.basename(p) for p in glob.glob(glob.escape('reports [2024]') + '/*.pdf')]", output: "['a.pdf']" },
    },
    {
      name: 'Not escaping names that come from data',
      desc: 'A folder name with brackets turns into a character class and silently matches nothing.',
      wrong: { label: 'raw folder', code: "import glob, os\nos.makedirs('v[2]')\nopen('v[2]/x.txt', 'w', encoding='utf-8').close()\nglob.glob('v[2]/*.txt')", output: '[]' },
      fix:   { label: 'escaped folder', code: "import glob, os\nos.makedirs('v[2]')\nopen('v[2]/x.txt', 'w', encoding='utf-8').close()\n[os.path.basename(p) for p in glob.glob(glob.escape('v[2]') + '/*.txt')]", output: "['x.txt']" },
    },
  ],

  when: {
    use: [
      'Any time part of a pattern comes from user input, a database or another file listing',
      'Searching inside folders whose names contain [ ] * or ?',
    ],
    avoid: [
      'Checking a single literal path → os.path.exists is simpler',
      'Escaping regex characters → re.escape (different syntax)',
    ],
  },

  notes: {
    cpython:    "drive, pathname = os.path.splitdrive(pathname); return drive + re.sub('([*?[])', r'[\\1]', pathname)",
    'Windows':  "The drive or UNC part is not escaped: on Windows escape('//?/c:/Quo vadis?.txt') returns '//?/c:/Quo vadis[?].txt'. On Linux there is no drive, so the ? in //?/ is escaped too",
    'Brackets': "']' needs no escaping: outside a set it is an ordinary character, so '[[]1]' reads as a set containing '[' followed by the text '1]'",
  },

  related: [
    { name: 'glob.glob',      slug: 'glob',     when: 'Use the escaped pattern' },
    { name: 'glob.translate', slug: 'translate', when: 'See what a pattern means as a regex' },
    { name: 're.escape',      slug: 'escape',   when: 'The regex equivalent', category: 'stdlib/re' },
    { name: 'fnmatch module', slug: 'fnmatch',  when: 'Same bracket rules', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I glob a file name that contains square brackets?',
      a: "Escape it: glob.glob(glob.escape('data[1].txt')). Unescaped, [1] is a character class that matches the single character 1, so Python looks for data1.txt instead.",
    },
    {
      q: 'Why does glob not use backslash escapes?',
      a: 'glob patterns have no escape character at all — and on Windows the backslash is a path separator anyway. Like fnmatch, glob makes a character literal by putting it alone in brackets: [*], [?], [[]. glob.escape does exactly that.',
    },
    {
      q: 'Does glob.escape escape ] or the folder separators?',
      a: "No. Only *, ? and [ are special to glob; escape leaves ] and / (and \\ on Windows) unchanged, and it never touches a Windows drive or UNC prefix.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/glob.html#glob.escape',
    meta:  'glob.escape',
  },
};
