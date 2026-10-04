// content/reference/python/stdlib/os-path/split.js

export const meta = {
  slug:        'split',
  name:        'os.path.split',
  signature:   'os.path.split(path) → (head, tail)',
  blurb:       'Split a path at its last separator into (head, tail): the folder part and the final component. Trailing separators leave an empty tail.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.split split path python head tail folder and file name separate directory from filename posixpath.split ntpath.split trailing slash',
};

export const method = {
  slug:      'split',
  name:      'os.path.split',
  signature: 'os.path.split(path) → (head, tail)',
  returns:   { type: 'tuple[str, str]', desc: '(head, tail): tail never contains a separator; head is the rest without trailing separators (unless it is the root).' },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'split(p) is (dirname(p), basename(p)) in one call. The cut is at the last separator, so a path ending in / has an empty tail. join(head, tail) gives back an equivalent path.',

  covers: ['split'],

  cheat: {
    commonCall: 'folder, name = os.path.split(path)',
    returns:    "('/home/ada', 'notes.txt')",
    replaces:   "path.rsplit('/', 1) — which mishandles '/', 'name' and Windows paths",
    watchOut:   "'/var/log/' splits into ('/var/log', '') — strip trailing slashes first if you want 'log'",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'Any path. Nothing is checked on disk.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'split',
      blurb: 'POSIX rules via posixpath — the same output on every machine.',
      params: [{ name: 'path', type: 'str', hint: 'a POSIX path', input: 'text' }],
      template: 'import posixpath\nposixpath.split({$path})',
      cases: [
        { id: 'file',  label: 'file',        values: { path: '/home/ada/notes.txt' } },
        { id: 'slash', label: 'trailing /',  values: { path: '/var/log/' } },
        { id: 'bare',  label: 'bare name',   values: { path: 'notes.txt' } },
        { id: 'root',  label: 'root',        values: { path: '/' } },
      ],
    },
    {
      id: 'both',
      label: 'POSIX vs Windows',
      blurb: 'posixpath only splits at /; ntpath splits at \\ or / and never splits the drive.',
      params: [{ name: 'path', type: 'str', hint: 'any path', input: 'text' }],
      template: 'import posixpath, ntpath\n(posixpath.split({$path}), ntpath.split({$path}))',
      cases: [
        { id: 'win',   label: 'Windows path', values: { path: 'C:\\Users\\ada\\notes.txt' } },
        { id: 'mixed', label: 'mixed slashes', values: { path: 'C:/Users/ada\\notes.txt' } },
        { id: 'drive', label: 'drive root',   values: { path: 'C:\\notes.txt' } },
      ],
    },
  ],
  demoExplainer: "The head loses its trailing slashes, except when it is the root itself: split('/') is ('/', ''). A bare name has an empty head. posixpath treats a backslash as an ordinary character, so a Windows path is one long file name to it; ntpath splits at either slash and keeps 'C:\\' together as the head.",

  patterns: [
    {
      name: 'Folder and name in one call',
      desc: 'Tuple unpacking.',
      code: "import os\nfolder, name = os.path.split(path)",
    },
    {
      name: 'Last folder name of a directory path',
      desc: 'Strip the trailing separator first.',
      code: "import os\nlast = os.path.split(path.rstrip(os.sep))[1]",
    },
    {
      name: 'All components',
      desc: 'Loop until the head stops changing — or use pathlib: PurePath(p).parts.',
      code: "import os\ndef components(p):\n    parts = []\n    while True:\n        head, tail = os.path.split(p)\n        if tail:\n            parts.insert(0, tail)\n        if head == p:\n            if head:\n                parts.insert(0, head)\n            return parts\n        p = head",
    },
  ],

  examples: [
    { title: 'Folder and file',           code: "import posixpath\nposixpath.split('/home/ada/notes.txt')", returns: "('/home/ada', 'notes.txt')" },
    { title: 'Trailing slash: empty tail', code: "import posixpath\nposixpath.split('/var/log/')", returns: "('/var/log', '')" },
    { title: 'No folder',                 code: "import posixpath\nposixpath.split('notes.txt')", returns: "('', 'notes.txt')" },
    { title: 'The root stays the root',   code: "import posixpath\nposixpath.split('/')", returns: "('/', '')" },
    { title: 'join undoes split',         code: "import posixpath\nhead, tail = posixpath.split('a/b/c.txt')\nposixpath.join(head, tail)", returns: "'a/b/c.txt'" },
    { title: 'Windows path with ntpath',  code: "import ntpath\nntpath.split(r'C:\\Users\\ada\\notes.txt')", returns: "('C:\\\\Users\\\\ada', 'notes.txt')" },
    { title: 'The drive root is kept',    code: "import ntpath\nntpath.split(r'C:\\notes.txt')", returns: "('C:\\\\', 'notes.txt')" },
  ],

  pitfalls: [
    {
      name: 'Expecting the last folder name from a path with a trailing slash',
      desc: 'The tail is what follows the last separator — nothing, here.',
      wrong: { label: "split('/var/log/')", code: "import posixpath\nposixpath.split('/var/log/')[1]", output: "''" },
      fix:   { label: 'strip first', code: "import posixpath\nposixpath.split('/var/log/'.rstrip('/'))[1]", output: "'log'" },
    },
    {
      name: 'Splitting by hand with rsplit',
      desc: "rsplit('/', 1) returns one item when there is no slash, and turns '/' into two empty strings.",
      wrong: { label: "rsplit('/', 1)", code: "('notes.txt'.rsplit('/', 1), '/'.rsplit('/', 1))", output: "(['notes.txt'], ['', ''])" },
      fix:   { label: 'posixpath.split', code: "import posixpath\n(posixpath.split('notes.txt'), posixpath.split('/'))", output: "(('', 'notes.txt'), ('/', ''))" },
    },
  ],

  when: {
    use: [
      'Getting folder and name of a str path together',
    ],
    avoid: [
      'Only one of the two → dirname / basename',
      'All components → PurePath(p).parts',
      'Extension → splitext',
    ],
  },

  notes: {
    cpython:   "posixpath.split: i = p.rfind('/') + 1; head, tail = p[:i], p[i:]; trailing slashes are stripped from head unless it is all slashes. ntpath.split first takes off the drive and root with splitroot",
    'Invariant': 'join(head, tail) refers to the same location as the original path (it may differ textually, e.g. doubled slashes)',
  },

  related: [
    { name: 'os.path.basename / dirname', slug: 'basename', when: 'The two halves separately' },
    { name: 'os.path.splitext', slug: 'splitext', when: 'Split off the extension' },
    { name: 'os.path.join', slug: 'join', when: 'Put them back together' },
    { name: 'PurePath.parts / parent', slug: 'parts', when: 'The pathlib versions', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I split a path into directory and file name in Python?',
      a: "folder, name = os.path.split(path). With pathlib: p.parent and p.name.",
    },
    {
      q: 'Why is the second part empty?',
      a: "The path ends with a separator, so nothing follows the last one. Strip trailing separators first (path.rstrip('/')) or use pathlib, whose .name ignores a trailing slash.",
    },
    {
      q: 'What is the difference between os.path.split and str.split?',
      a: "str.split('/') cuts at every slash and knows nothing about roots or drives. os.path.split cuts once, at the last separator, and keeps '/' or 'C:\\' intact.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.split',
    meta:  'os.path.split',
  },
};
