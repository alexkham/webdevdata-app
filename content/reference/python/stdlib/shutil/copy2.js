// content/reference/python/stdlib/shutil/copy2.js

export const meta = {
  slug:        'copy2',
  name:        'shutil.copy2',
  signature:   'shutil.copy2(src, dst, *, follow_symlinks=True)',
  blurb:       'Copy a file to a file or into a folder with as much metadata as the platform allows: permission bits, access and modification times, flags and extended attributes.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil copy2 copy file preserve metadata python copy file keep modification time timestamp mtime cp -p copystat preserve permissions copy vs copy2 copytree default copy_function',
};

export const method = {
  slug:      'copy2',
  name:      'shutil.copy2',
  signature: 'shutil.copy2(src, dst, *, follow_symlinks=True)',
  returns:   { type: 'str', desc: 'The path of the new file: dst, or os.path.join(dst, basename(src)) when dst is a folder.' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'copy plus timestamps — the closest thing to cp -p. It is also what copytree and move use for every file unless you pass another copy_function. Owner, group and ACLs are still not copied.',

  covers: ['copy2'],

  cheat: {
    commonCall: "shutil.copy2('data.db', 'backup/')",
    returns:    "'backup/data.db' — the new file's path",
    replaces:   'cp -p src dst',
    watchOut:   'If setting the times or mode fails, it raises after the data is already copied',
  },

  parameters: [
    { name: 'src',             type: 'str | PathLike', required: true,  default: null,   desc: 'The file to copy.' },
    { name: 'dst',             type: 'str | PathLike', required: true,  default: null,   desc: 'A file name (replaced if it exists) or an existing folder to copy into.' },
    { name: 'follow_symlinks', type: 'bool',           required: false, default: 'True', desc: 'False and src is a symlink: create a symlink at dst and copy the link’s own metadata where the OS allows.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'copyfile vs copy vs copy2',
      blurb: 'Give report.txt a timestamp of your choice, make it read-only, and copy it three ways. Each row: (function, mtime kept?, still writable?).',
      params: [{ name: 'stamp', type: 'int', hint: 'a Unix timestamp', input: 'number' }],
      template: "import os, shutil, stat\nwith open('report.txt', 'w') as f:\n    f.write('Q3 numbers')\nos.utime('report.txt', ({$stamp}, {$stamp}))\nos.chmod('report.txt', stat.S_IREAD)\nrows = []\nfor fn in (shutil.copyfile, shutil.copy, shutil.copy2):\n    st = os.stat(fn('report.txt', fn.__name__ + '.txt'))\n    rows.append((fn.__name__, st.st_mtime == {$stamp}, bool(st.st_mode & stat.S_IWRITE)))\nrows",
      cases: [
        { id: 'y2k1', label: '2001-09-09', values: { stamp: '1000000000' } },
        { id: 'y2023', label: '2023-11-14', values: { stamp: '1700000000' } },
      ],
    },
    {
      id: 'into',
      label: 'into a folder',
      blurb: 'Copy a file with copy2 and compare the timestamps of source and copy.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'file to copy',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'file name or folder',              input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\n    os.utime(f, (1234567890, 1234567890))\nnew = shutil.copy2({$src}, {$dst})\n(new.replace(os.sep, '/'), os.path.getmtime(new) == os.path.getmtime({$src}))",
      cases: [
        { id: 'folder', label: 'into a folder', values: { files: 'db.sqlite, backup/old.sqlite', src: 'db.sqlite', dst: 'backup' } },
        { id: 'name',   label: 'new name',      values: { files: 'db.sqlite', src: 'db.sqlite', dst: 'db.bak' } },
      ],
    },
  ],
  demoExplainer: 'Only copy2 keeps the timestamp; copyfile and copy give the copy the current time. Both copy and copy2 carry over the read-only bit, copyfile does not. A stamp outside 1901–2446 is clamped by ext4, the usual Linux file system, so then not even copy2’s copy matches it; one beyond the 64-bit time_t range is an OverflowError. On Windows (3.12+) copy2 hands the whole job to the CopyFile2 API, but the visible result — data, read-only flag, times — is the same.',

  patterns: [
    {
      name: 'Back up a file next to the original',
      desc: 'The backup keeps the original modification time.',
      code: "import shutil\nshutil.copy2('settings.json', 'settings.json.bak')",
    },
    {
      name: 'Copy only files that changed',
      desc: 'Because copy2 keeps mtimes, comparing them later is meaningful.',
      code: "import os, shutil\nif not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst):\n    shutil.copy2(src, dst)",
    },
    {
      name: 'copytree without metadata',
      desc: 'copy2 is copytree’s default; pass copy (or copyfile) when the target file system rejects metadata.',
      code: "import shutil\nshutil.copytree('src', 'dst', copy_function=shutil.copy)",
    },
  ],

  examples: [
    { title: 'Modification time is kept', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copy2('a.txt', 'b.txt')\nos.path.getmtime('b.txt')", returns: '1000000000.0' },
    { title: 'Copy into a folder', code: "import os, shutil\nos.mkdir('backup')\nopen('a.txt', 'w').close()\nshutil.copy2('a.txt', 'backup').replace(os.sep, '/')", returns: "'backup/a.txt'" },
    { title: 'Permission bits are kept too', code: "import os, shutil, stat\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', stat.S_IREAD)\nshutil.copy2('ro.txt', 'copy.txt')\nbool(os.stat('copy.txt').st_mode & stat.S_IWRITE)", returns: 'False' },
    { title: 'copytree uses copy2 by default', code: 'import inspect, shutil\ninspect.signature(shutil.copytree).parameters["copy_function"].default is shutil.copy2', returns: 'True' },
    { title: 'A file name as dst comes back as given', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copy2('a.txt', 'a-backup.txt')", returns: "'a-backup.txt'" },
  ],

  pitfalls: [
    {
      name: 'An overwritten file that looks older than before',
      desc: 'copy2 gives dst the source’s modification time, even when it replaces a newer file. Build tools and sync scripts that compare mtimes may then skip it. Use copy when the copy should count as new.',
      wrong: { label: 'copy2 over a newer file', code: "import os, shutil\nopen('build.txt', 'w').close()\nos.utime('build.txt', (2000000000, 2000000000))\nopen('src.txt', 'w').close()\nos.utime('src.txt', (1000000000, 1000000000))\nshutil.copy2('src.txt', 'build.txt')\nos.path.getmtime('build.txt') > 1500000000", output: 'False' },
      fix:   { label: 'copy', code: "import os, shutil\nopen('build.txt', 'w').close()\nos.utime('build.txt', (2000000000, 2000000000))\nopen('src.txt', 'w').close()\nos.utime('src.txt', (1000000000, 1000000000))\nshutil.copy('src.txt', 'build.txt')\nos.path.getmtime('build.txt') > 1500000000", output: 'True' },
    },
    {
      name: 'Copying a folder with copy2',
      desc: 'copy2 copies one file. A folder needs copytree, which calls copy2 for each file inside.',
      wrong: { label: 'copy2(folder, …)', code: "import os, shutil\nos.makedirs('docs')\ntry:\n    shutil.copy2('docs', 'docs-copy')\nexcept OSError as e:\n    result = isinstance(e, (IsADirectoryError, PermissionError))\nresult", output: 'True' },
      fix:   { label: 'copytree', code: "import os, shutil\nos.makedirs('docs')\nopen('docs/a.md', 'w').close()\nshutil.copytree('docs', 'docs-copy')\nos.listdir('docs-copy')", output: "['a.md']" },
    },
  ],

  when: {
    use: [
      'Backups and mirrors where modification times matter',
      'The default choice for copying a single file',
    ],
    avoid: [
      'Target file systems that refuse metadata changes (some network shares) → copy or copyfile',
      'Folders → copytree (which calls copy2 per file)',
    ],
  },

  notes: {
    cpython:     'Lib/shutil.py: on Windows (3.12+) try _winapi.CopyFile2 first; otherwise copyfile(src, dst) then copystat(src, dst)',
    'Same file': 'Linux and macOS raise SameFileError for copy2(f, f). On Windows (3.12+) CopyFile2 runs before that check, and the call fails with PermissionError: [WinError 32] The process cannot access the file because it is being used by another process',
    'Times':     'copystat sets atime and mtime with os.utime(dst, ns=(st_atime_ns, st_mtime_ns)) — nanosecond precision where the file system has it',
    'Linux':     'Extended attributes (os.listxattr) are copied where possible; errors like ENOTSUP are ignored',
  },

  related: [
    { name: 'shutil.copy',         slug: 'copy',     when: 'Without timestamps' },
    { name: 'copymode / copystat', slug: 'copystat', when: 'Copy metadata onto an existing file' },
    { name: 'shutil.copytree',     slug: 'copytree', when: 'Calls copy2 for every file' },
    { name: 'os.utime',            slug: 'stat',     when: 'Set timestamps yourself', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'What is the difference between shutil.copy and shutil.copy2?',
      a: 'Both copy the data and the permission bits and accept a folder as destination. copy2 additionally copies the access and modification times (and on Linux extended attributes) with copystat.',
    },
    {
      q: 'Does shutil.copy2 preserve the creation time?',
      a: 'No. copystat only sets the access and modification times, and the copy is a new file with its own creation time — also on Windows, where os.stat(path).st_birthtime of the copy is the moment it was made.',
    },
    {
      q: 'Does copy2 raise when metadata cannot be copied?',
      a: 'Partly. The documentation promises that copy2 never raises because it cannot preserve a symlink’s own metadata (follow_symlinks=False) on platforms that lack the calls for it, and copystat skips extended attributes and file flags the file system does not support. But if os.utime or os.chmod on the copy fails, copy2 raises that OSError — after the data has already been copied, so the new file is left behind.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copy2',
    meta:  'shutil.copy2',
  },

};
