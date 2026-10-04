// content/reference/python/stdlib/os-path/splitext.js

export const meta = {
  slug:        'splitext',
  name:        'os.path.splitext',
  signature:   'os.path.splitext(path) → (root, ext)',
  blurb:       'Split off the file extension: (root, ext) where ext is the last dot and what follows, and root + ext is the original path. Leading dots (dotfiles) are not extensions.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'os.path.splitext splitext file extension python get extension change extension remove extension tar.gz double extension dotfile root ext posixpath.splitext',
};

export const method = {
  slug:      'splitext',
  name:      'os.path.splitext',
  signature: 'os.path.splitext(path) → (root, ext)',
  returns:   { type: 'tuple[str, str]', desc: "(root, ext): ext is '' or starts with '.', and root + ext == path." },

  category:    'os.path function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "splitext cuts at the last dot of the last path component: 'archive.tar.gz' gives '.gz', a dot in a folder name is ignored, and a name made only of a leading dot (.bashrc) has no extension. The extension keeps its dot and its case.",

  covers: ['splitext'],

  cheat: {
    commonCall: 'root, ext = os.path.splitext(filename)',
    returns:    "('report', '.pdf')",
    replaces:   "filename.split('.')[-1] — wrong for names without a dot and for dotfiles",
    watchOut:   "Only the last extension: '.tar.gz' needs a loop (or Path.suffixes)",
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike', required: true, default: null, desc: 'A file name or full path; only its last component is examined.' },
  ],

  modes: [
    {
      id: 'split',
      label: 'splitext',
      blurb: 'Type a file name or path.',
      params: [{ name: 'path', type: 'str', hint: 'a file name or path', input: 'text' }],
      template: 'import posixpath\nposixpath.splitext({$path})',
      cases: [
        { id: 'pdf',    label: 'one extension', values: { path: 'reports/2026/summary.pdf' } },
        { id: 'targz',  label: '.tar.gz',       values: { path: 'backup.tar.gz' } },
        { id: 'dot',    label: 'dotfile',       values: { path: '/home/ada/.bashrc' } },
        { id: 'folder', label: 'dot in folder', values: { path: '/etc/conf.d/nginx' } },
      ],
    },
    {
      id: 'change',
      label: 'change the extension',
      blurb: 'Keep the root, attach a new extension.',
      params: [
        { name: 'path', type: 'str', hint: 'a file name or path', input: 'text' },
        { name: 'ext',  type: 'str', hint: 'new extension',       input: 'text' },
      ],
      template: 'import posixpath\nroot, ext = posixpath.splitext({$path})\nroot + {$ext}',
      cases: [
        { id: 'csv',  label: 'csv → json',     values: { path: 'data/export.csv', ext: '.json' } },
        { id: 'none', label: 'no extension',   values: { path: 'Makefile', ext: '.bak' } },
        { id: 'gz',   label: 'only last goes', values: { path: 'site.tar.gz', ext: '.zip' } },
      ],
    },
  ],
  demoExplainer: "The extension is everything from the last dot of the file name: backup.tar.gz gives '.gz', so replacing it gives site.tar.zip, not site.zip. The leading dot of .bashrc does not count, and the dot in conf.d is in a folder, not in the file name — both give an empty extension. With no extension the new one is simply appended.",

  patterns: [
    {
      name: 'Filter by extension, case-insensitively',
      desc: 'Compare a lowercased ext against a set.',
      code: "import os\nIMAGES = {'.png', '.jpg', '.jpeg', '.gif'}\nimages = [n for n in os.listdir(folder) if os.path.splitext(n)[1].lower() in IMAGES]",
    },
    {
      name: 'Output file next to the input',
      desc: 'Same folder and stem, new extension.',
      code: "import os\nout_path = os.path.splitext(in_path)[0] + '.json'",
    },
    {
      name: 'All extensions',
      desc: 'Peel them off one by one.',
      code: "import os\ndef suffixes(name):\n    exts = []\n    while True:\n        name, ext = os.path.splitext(name)\n        if not ext:\n            return exts\n        exts.insert(0, ext)",
    },
  ],

  examples: [
    { title: 'The last dot wins',           code: "import posixpath\nposixpath.splitext('report.final.pdf')", returns: "('report.final', '.pdf')" },
    { title: 'Dotfiles have no extension',  code: "import posixpath\nposixpath.splitext('.bashrc')", returns: "('.bashrc', '')" },
    { title: 'Dots in folder names are ignored', code: "import posixpath\nposixpath.splitext('/home/ada.d/README')", returns: "('/home/ada.d/README', '')" },
    { title: 'Compare in lower case',       code: "import posixpath\nposixpath.splitext('photo.JPG')[1].lower()", returns: "'.jpg'" },
    { title: 'Change the extension',        code: "import posixpath\nroot, ext = posixpath.splitext('data.csv')\nroot + '.json'", returns: "'data.json'" },
    { title: 'A trailing dot is an extension', code: "import posixpath\nposixpath.splitext('file.')", returns: "('file', '.')" },
    { title: 'Every extension, with a loop', code: "import posixpath\nname = 'archive.tar.gz'\nsuffixes = []\nwhile True:\n    name, ext = posixpath.splitext(name)\n    if not ext:\n        break\n    suffixes.insert(0, ext)\nsuffixes", returns: "['.tar', '.gz']" },
  ],

  pitfalls: [
    {
      name: "Splitting on '.' yourself",
      desc: "split('.') breaks on dots in folder names and on names without an extension.",
      wrong: { label: "split('.')[-1]", code: "[p.split('.')[-1] for p in ['/etc/conf.d/nginx', 'Makefile']]", output: "['d/nginx', 'Makefile']" },
      fix:   { label: 'splitext', code: "import posixpath\n[posixpath.splitext(p)[1] for p in ['/etc/conf.d/nginx', 'Makefile']]", output: "['', '']" },
    },
    {
      name: 'Expecting .tar.gz as one extension',
      desc: 'splitext removes only the last one.',
      wrong: { label: 'one call', code: "import posixpath\nposixpath.splitext('backup.tar.gz')[0]", output: "'backup.tar'" },
      fix:   { label: 'split at the first dot of the name', code: "import posixpath\nname = posixpath.basename('backup.tar.gz')\nname.split('.', 1)[0]", output: "'backup'" },
    },
  ],

  when: {
    use: [
      'Checking or changing a file extension of a str path',
    ],
    avoid: [
      "pathlib code → p.suffix, p.suffixes, p.stem, p.with_suffix('.json')",
      'Detecting the real file type → mimetypes.guess_type (by name) or reading the file header',
    ],
  },

  notes: {
    cpython:   "genericpath._splitext: find the last '.', and accept it only if it comes after the last separator and is not part of the run of leading dots of the file name",
    'Invariant': 'root + ext == path, always',
    'ntpath':  "Same rule, with \\ and / both counting as separators",
  },

  related: [
    { name: 'os.path.basename', slug: 'basename', when: 'The file name with its extension' },
    { name: 'os.path.split', slug: 'split', when: 'Folder and name' },
    { name: 'PurePath.with_suffix', slug: 'with_suffix', when: 'Change the extension with pathlib', category: 'stdlib/pathlib' },
    { name: 'PurePath.name / stem / suffix', slug: 'name', when: 'suffix and suffixes in pathlib', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'How do I get the file extension in Python?',
      a: "os.path.splitext(path)[1] — it includes the dot ('.pdf'), or is '' when there is none. With pathlib: Path(path).suffix.",
    },
    {
      q: 'How do I remove the extension from a file name?',
      a: 'os.path.splitext(name)[0]. For the name without folder and extension: os.path.splitext(os.path.basename(path))[0], or Path(path).stem.',
    },
    {
      q: 'Why does splitext return an empty extension for .bashrc?',
      a: "A name that starts with a dot is a hidden file on POSIX, not an extension. splitext skips leading dots, so '.bashrc' has no extension while '.bashrc.bak' has '.bak'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.splitext',
    meta:  'os.path.splitext',
  },
};
