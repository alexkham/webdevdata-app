// content/reference/python/stdlib/shutil/copy.js

export const meta = {
  slug:        'copy',
  name:        'shutil.copy',
  signature:   'shutil.copy(src, dst, *, follow_symlinks=True)',
  blurb:       'Copy a file to a file or into a folder, together with its permission bits, and return the path of the new file.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil copy copy file python copy file to folder directory cp command keep permissions mode bits copymode return new path follow_symlinks overwrite',
};

export const method = {
  slug:      'copy',
  name:      'shutil.copy',
  signature: 'shutil.copy(src, dst, *, follow_symlinks=True)',
  returns:   { type: 'str', desc: 'The path of the new file: dst, or os.path.join(dst, basename(src)) when dst is a folder.' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "Python's cp: if dst is an existing folder the file keeps its name inside it, the data is copied with copyfile and the permission bits with copymode. Timestamps are not copied — the copy looks freshly written.",

  covers: ['copy'],

  cheat: {
    commonCall: "shutil.copy('report.pdf', 'backup/')",
    returns:    "'backup/report.pdf' — the new file's path",
    replaces:   'cp src dst',
    watchOut:   'The modification time is not kept; use copy2 for that',
  },

  parameters: [
    { name: 'src',             type: 'str | PathLike', required: true,  default: null,   desc: 'The file to copy (not a folder — see copytree).' },
    { name: 'dst',             type: 'str | PathLike', required: true,  default: null,   desc: 'A file name (replaced if it exists) or an existing folder to copy into.' },
    { name: 'follow_symlinks', type: 'bool',           required: false, default: 'True', desc: 'False and src is a symlink: dst becomes a symlink too.' },
  ],

  modes: [
    {
      id: 'into',
      label: 'file or folder',
      blurb: 'Create some files, copy one, and see the returned path and every file afterwards.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'file to copy',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'file name or folder',              input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nnew = shutil.copy({$src}, {$dst})\n(new.replace(os.sep, '/'), sorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in fs))",
      cases: [
        { id: 'folder', label: 'into a folder', values: { files: 'report.pdf, backup/old.pdf', src: 'report.pdf', dst: 'backup' } },
        { id: 'file',   label: 'new name',      values: { files: 'report.pdf', src: 'report.pdf', dst: 'report-v2.pdf' } },
        { id: 'deep',   label: 'nested source', values: { files: 'docs/guide.md, site/index.html', src: 'docs/guide.md', dst: 'site' } },
      ],
    },
    {
      id: 'perms',
      label: 'permission bits',
      blurb: 'Make the source read-only, then copy it with copyfile and with copy. Each row: (new file, its content, still writable?).',
      params: [{ name: 'text', type: 'str', hint: 'content of config.ini', input: 'text' }],
      template: "import os, shutil, stat\nwith open('config.ini', 'w') as f:\n    f.write({$text})\nos.chmod('config.ini', stat.S_IREAD)\nrows = []\nfor fn in (shutil.copyfile, shutil.copy):\n    dst = fn('config.ini', fn.__name__ + '.ini')\n    with open(dst) as f:\n        rows.append((dst, f.read(), bool(os.stat(dst).st_mode & stat.S_IWRITE)))\nrows",
      cases: [
        { id: 'ini',   label: 'config', values: { text: 'debug = false' } },
        { id: 'empty', label: 'empty',  values: { text: '' } },
      ],
    },
  ],
  demoExplainer: "When dst is an existing folder, copy joins the source's file name onto it and returns that path (backup/report.pdf); any other dst is used as the file name. The source's folder part is dropped — docs/guide.md lands as site/guide.md. In the second tab both copies have the same content, but only copy carried over the read-only bit: copyfile's file is writable, copy's is not.",

  patterns: [
    {
      name: 'Copy into a folder',
      desc: 'Keep the file name, get the new path back.',
      code: "import shutil\nnew_path = shutil.copy('invoice.pdf', 'archive/')",
    },
    {
      name: 'Copy several files',
      desc: 'A glob plus copy; the destination folder must exist.',
      code: "import glob, os, shutil\nos.makedirs('out', exist_ok=True)\nfor path in glob.glob('*.csv'):\n    shutil.copy(path, 'out')",
    },
    {
      name: 'Copy an executable script and keep it executable',
      desc: 'On Linux and macOS, copy carries the x bits over (copyfile would not).',
      code: "import shutil\nshutil.copy('deploy.sh', '/usr/local/bin/deploy')",
    },
  ],

  examples: [
    { title: 'Copy to a new name', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copy('a.txt', 'b.txt')", returns: "'b.txt'" },
    { title: 'Copy into a folder', code: "import os, shutil\nos.mkdir('backup')\nopen('a.txt', 'w').close()\nshutil.copy('a.txt', 'backup').replace(os.sep, '/')", returns: "'backup/a.txt'" },
    { title: 'Permission bits come along', code: "import os, shutil, stat\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', stat.S_IREAD)\nshutil.copy('ro.txt', 'copy.txt')\nbool(os.stat('copy.txt').st_mode & stat.S_IWRITE)", returns: 'False' },
    { title: 'Timestamps do not', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copy('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == 1000000000", returns: 'False' },
    { title: 'A folder as src is an error', code: "import os, shutil\nos.mkdir('docs')\ntry:\n    shutil.copy('docs', 'docs-copy')\nexcept OSError as e:\n    result = isinstance(e, (IsADirectoryError, PermissionError))\nresult", returns: 'True' },
    { title: 'Copying onto itself', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copy('a.txt', 'a.txt')", returns: "shutil.SameFileError: 'a.txt' and 'a.txt' are the same file" },
  ],

  pitfalls: [
    {
      name: 'A destination folder that does not exist yet',
      desc: "copy only treats dst as a folder if it already is one. 'backup/' with no backup folder is a file name with a trailing slash, and the copy fails.",
      wrong: { label: "copy(f, 'backup/')", code: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.copy('a.txt', 'backup/')\nexcept OSError as e:\n    result = 'failed'\nresult", output: "'failed'" },
      fix:   { label: 'makedirs first', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.makedirs('backup', exist_ok=True)\nshutil.copy('a.txt', 'backup/').replace(os.sep, '/')", output: "'backup/a.txt'" },
    },
    {
      name: 'Losing the modification time',
      desc: 'Backups and sync tools compare mtimes; copy gives every copy a new one. copy2 keeps it.',
      wrong: { label: 'copy', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1500000000, 1500000000))\nshutil.copy('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == os.path.getmtime('a.txt')", output: 'False' },
      fix:   { label: 'copy2', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1500000000, 1500000000))\nshutil.copy2('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == os.path.getmtime('a.txt')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Copying a file into a folder, cp-style',
      'Keeping a script executable or a file read-only in the copy',
    ],
    avoid: [
      'You also need timestamps → copy2',
      'Copying a folder → copytree',
      'Overwriting a file but keeping the target’s own permissions → copyfile',
    ],
  },

  notes: {
    cpython:       'Lib/shutil.py: if os.path.isdir(dst): dst = os.path.join(dst, os.path.basename(src)); copyfile(src, dst); copymode(src, dst); return dst',
    'Windows':     'Only the read-only attribute is a "permission bit" there; copymode sets or clears it',
    'Not copied':  'Owner, group, ACLs, timestamps — and on macOS resource forks',
  },

  related: [
    { name: 'shutil.copy2',    slug: 'copy2',    when: 'Same, plus timestamps' },
    { name: 'shutil.copyfile', slug: 'copyfile', when: 'Data only, dst must be a file name' },
    { name: 'copymode / copystat', slug: 'copystat', when: 'Copy only the metadata' },
    { name: 'shutil.copytree', slug: 'copytree', when: 'Copy a folder' },
    { name: 'os.chmod',        slug: 'chmod',    when: 'What copymode calls', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I copy a file to another folder in Python?',
      a: "shutil.copy('file.txt', 'folder') — when the destination is an existing folder the file keeps its name inside it, and the new path ('folder/file.txt') is returned. The folder must already exist; create it with os.makedirs(folder, exist_ok=True).",
    },
    {
      q: 'Does shutil.copy overwrite existing files?',
      a: 'Yes, silently. If dst (or folder/name) exists it is replaced. Check with os.path.exists first if that matters.',
    },
    {
      q: 'Does shutil.copy preserve the modification date?',
      a: 'No. copy copies the data and the permission bits; the new file gets the current time. Use shutil.copy2 to copy the access and modification times as well.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copy',
    meta:  'shutil.copy',
  },

};
