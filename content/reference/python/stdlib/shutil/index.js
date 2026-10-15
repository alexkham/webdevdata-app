// content/reference/python/stdlib/shutil/index.js — the shutil module hub

export const meta = {
  slug:        'index',
  name:        'shutil',
  signature:   'import shutil',
  blurb:       'High-level file operations: copy files and whole folders, move them, delete trees, and build or unpack zip and tar archives.',
  category:    'files',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil module python copy file copy folder copytree rmtree delete folder move file make_archive zip folder unpack_archive extract which disk_usage high-level file operations',
};

export const method = {
  slug: 'index',
  name: 'shutil',

  category:    'Files and directories',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'os works on one file or one folder at a time; shutil does the jobs that take many steps: copy a file with its metadata, copy or delete a whole tree, move across file systems, zip a folder. Each function is a short, readable piece of Lib/shutil.py built on os.',

  imports: ['import shutil', 'from shutil import copy2, copytree, rmtree, move'],
  facts: [
    { label: 'Copying',    value: 'copyfile (data), copy (data + permission bits), copy2 (data + permissions + timestamps), copytree (whole folders)' },
    { label: 'Deleting',   value: 'rmtree removes a folder and everything in it; there is no undo and no recycle bin' },
    { label: 'Archives',   value: 'make_archive / unpack_archive for zip, tar, gztar, bztar and xztar (zstdtar too in 3.14), via zipfile and tarfile' },
    { label: 'Exceptions', value: 'Error (an OSError) and its subclass SameFileError, plus SpecialFileError, ReadError, RegistryError and the unused ExecError' },
  ],

  modes: [
    {
      id: 'backup',
      label: 'back up a folder',
      blurb: 'Create some files under project/, then copy the folder to backup/ while skipping the names that match your patterns.',
      params: [
        { name: 'files',    type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'patterns', type: 'list[str]', hint: 'glob patterns to skip',            input: 'csv' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nshutil.copytree('project', 'backup', ignore=shutil.ignore_patterns(*{$patterns}))\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('backup') for n in fs)",
      cases: [
        { id: 'py',   label: 'Python project', values: { files: 'project/app.py, project/lib/util.py, project/__pycache__/app.cpython-313.pyc, project/lib/__pycache__/util.cpython-313.pyc, project/.git/HEAD', patterns: '__pycache__, .git' } },
        { id: 'ext',  label: 'by extension',   values: { files: 'project/main.py, project/main.pyc, project/notes.tmp, project/data/raw.csv', patterns: '*.pyc, *.tmp' } },
        { id: 'all',  label: 'skip nothing',   values: { files: 'project/main.py, project/data/raw.csv', patterns: '' } },
      ],
    },
    {
      id: 'archive',
      label: 'zip a folder',
      blurb: 'Archive project/ with make_archive and list what went in. root_dir makes the names relative to project/.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'fmt',   type: 'str',       hint: 'zip, tar, gztar, bztar or xztar',  input: 'text' },
      ],
      template: "import os, shutil, tarfile, zipfile\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nname = shutil.make_archive('release', {$fmt}, root_dir='project')\nif name.endswith('.zip'):\n    with zipfile.ZipFile(name) as z:\n        members = sorted(z.namelist())\nelse:\n    with tarfile.open(name) as t:\n        members = t.getnames()\n(os.path.basename(name), members)",
      cases: [
        { id: 'zip',   label: 'zip',   values: { files: 'project/index.html, project/css/site.css, project/js/app.js', fmt: 'zip' } },
        { id: 'gztar', label: 'gztar', values: { files: 'project/index.html, project/css/site.css, project/js/app.js', fmt: 'gztar' } },
        { id: 'rar',   label: 'rar',   values: { files: 'project/index.html', fmt: 'rar' } },
      ],
    },
    {
      id: 'move',
      label: 'move',
      blurb: 'Rename a file, move it into a folder, or rename a folder — then list every file that is left.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'what to move',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'where to',                         input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nshutil.move({$src}, {$dst})\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in fs)",
      cases: [
        { id: 'rename', label: 'rename a file',   values: { files: 'draft.txt, notes.txt', src: 'draft.txt', dst: 'final.txt' } },
        { id: 'into',   label: 'into a folder',   values: { files: 'report.pdf, archive/2025.pdf', src: 'report.pdf', dst: 'archive' } },
        { id: 'dir',    label: 'rename a folder', values: { files: 'build/app.js, build/app.css', src: 'build', dst: 'dist' } },
      ],
    },
  ],
  demoExplainer: "ignore_patterns compares each pattern with bare names in every folder, so __pycache__ is skipped at any depth. The archive names show what root_dir does: zip lists folders with a trailing slash (css/), tar formats start every name at '.' and list folders without one. An unknown format raises ValueError: unknown archive format 'rar'. move into an existing folder keeps the file name (archive/report.pdf). The demos run on an emulated Linux file system; real os.walk order varies, so every listing is sorted.",

  patterns: [
    {
      name: 'Copy a file with its timestamps',
      desc: 'copy2 accepts a folder as the destination and returns the new path.',
      code: "import shutil\nnew_path = shutil.copy2('report.xlsx', 'backup/')",
    },
    {
      name: 'Mirror a folder, skipping junk',
      desc: 'dirs_exist_ok=True merges into an existing destination.',
      code: "import shutil\nshutil.copytree('src', 'dist', ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '.git'), dirs_exist_ok=True)",
    },
    {
      name: 'Delete a folder if it exists',
      desc: 'ignore_errors=True also hides every other failure, so prefer a check or an onexc handler.',
      code: "import os, shutil\nif os.path.isdir('build'):\n    shutil.rmtree('build')",
    },
    {
      name: 'Zip a folder and unpack it elsewhere',
      desc: 'make_archive returns the archive name; unpack_archive picks the format from the extension.',
      code: "import shutil\narchive = shutil.make_archive('site-backup', 'zip', root_dir='site')\nshutil.unpack_archive(archive, 'restore')",
    },
  ],

  examples: [
    { title: 'Copy a file, get the new path', code: "import shutil\nwith open('a.txt', 'w') as f:\n    f.write('hi')\nshutil.copy('a.txt', 'b.txt')", returns: "'b.txt'" },
    { title: 'A folder as destination keeps the name', code: "import os, shutil\nos.mkdir('backup')\nopen('a.txt', 'w').close()\nshutil.copy('a.txt', 'backup').replace(os.sep, '/')", returns: "'backup/a.txt'" },
    { title: 'Copy a whole tree', code: "import os, shutil\nos.makedirs('src/sub')\nopen('src/sub/x.txt', 'w').close()\nshutil.copytree('src', 'dst')\nos.listdir('dst/sub')", returns: "['x.txt']" },
    { title: 'Delete a tree', code: "import os, shutil\nos.makedirs('build/lib/pkg')\nopen('build/lib/pkg/mod.py', 'w').close()\nshutil.rmtree('build')\nos.path.exists('build')", returns: 'False' },
    { title: 'move renames', code: "import shutil\nopen('draft.txt', 'w').close()\nshutil.move('draft.txt', 'final.txt')", returns: "'final.txt'" },
    { title: 'Archive formats out of the box', code: 'import shutil\n[name for name, description in shutil.get_archive_formats()]', returns: "['bztar', 'gztar', 'tar', 'xztar', 'zip']" },
    { title: 'Copying a file onto itself is refused', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copyfile('a.txt', 'a.txt')", returns: "shutil.SameFileError: 'a.txt' and 'a.txt' are the same file" },
  ],

  pitfalls: [
    {
      name: 'Expecting copy() to keep the modification time',
      desc: 'copy copies the data and the permission bits; the copy gets a fresh timestamp. copy2 also copies the access and modification times.',
      wrong: { label: 'shutil.copy', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copy('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == 1000000000", output: 'False' },
      fix:   { label: 'shutil.copy2', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.utime('a.txt', (1000000000, 1000000000))\nshutil.copy2('a.txt', 'b.txt')\nos.path.getmtime('b.txt') == 1000000000", output: 'True' },
    },
    {
      name: 'copytree into a folder that already exists',
      desc: 'By default the destination must not exist. Pass dirs_exist_ok=True (3.8+) to merge into it.',
      wrong: { label: 'plain copytree', code: "import os, shutil\nos.makedirs('src')\nos.makedirs('dst')\ntry:\n    shutil.copytree('src', 'dst')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileExistsError'" },
      fix:   { label: 'dirs_exist_ok=True', code: "import os, shutil\nos.makedirs('src')\nos.makedirs('dst')\nshutil.copytree('src', 'dst', dirs_exist_ok=True)", output: "'dst'" },
    },
    {
      name: 'Using rmtree to delete a single file',
      desc: 'rmtree only removes folders. For one file use os.remove (or Path.unlink).',
      wrong: { label: 'rmtree(file)', code: "import shutil\nopen('old.log', 'w').close()\ntry:\n    shutil.rmtree('old.log')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'NotADirectoryError'" },
      fix:   { label: 'os.remove', code: "import os\nopen('old.log', 'w').close()\nos.remove('old.log')\nos.path.exists('old.log')", output: 'False' },
    },
  ],

  when: {
    use: [
      'Copying files with their permissions or timestamps (copy, copy2)',
      'Copying, merging or deleting whole folder trees',
      'Moving files or folders, also between disks',
      'Zipping a folder or unpacking an archive in one call',
    ],
    avoid: [
      'Deleting one file or one empty folder → os.remove / os.rmdir (or Path.unlink / Path.rmdir)',
      'Renaming within one folder when you need atomic replace → os.replace',
      'Reading archive members without extracting → zipfile / tarfile directly',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py — pure Python over os, stat, fnmatch, zipfile and tarfile',
    'Fast copies': 'Since 3.8 file copies use os.sendfile on Linux (3.14: os.copy_file_range first) and fcopyfile on macOS; on Windows copyfile reads in chunks of up to 1 MiB (copyfileobj’s default is 64 KiB elsewhere). Since 3.12, copy2 on Windows hands the whole job to the CopyFile2 API',
    'Metadata':   'No copy function copies owner, group or ACLs; copy2 / copystat copy permission bits, timestamps and, on Linux, extended attributes where possible',
  },

  related: [
    { name: 'os module',      slug: 'os',      when: 'One-file operations: remove, rename, makedirs, walk', category: 'stdlib' },
    { name: 'pathlib',        slug: 'pathlib', when: 'Path objects work with every shutil function', category: 'stdlib' },
    { name: 'os.path',        slug: 'os-path', when: 'exists, isdir and join for the paths you pass', category: 'stdlib' },
    { name: 'OSError',        slug: 'oserror', when: 'shutil.Error and the file errors all derive from it', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between shutil.copy, copy2 and copyfile?',
      a: 'copyfile copies only the data and needs a full destination file name. copy also accepts a folder as destination and copies the permission bits. copy2 does what copy does and also copies the access and modification times (copystat). All three return the destination path.',
    },
    {
      q: 'How do I copy a folder in Python?',
      a: "shutil.copytree('src', 'dst'). The destination must not exist unless you pass dirs_exist_ok=True (Python 3.8+), which merges into it and overwrites files with the same name. Use ignore=shutil.ignore_patterns('*.pyc', '__pycache__') to skip files.",
    },
    {
      q: 'How do I delete a folder that is not empty?',
      a: "shutil.rmtree('folder') removes it with everything inside. os.rmdir only removes empty folders. rmtree deletes permanently; pass onexc= (3.12+) to handle files that cannot be removed, for example read-only files on Windows.",
    },
    {
      q: 'How do I zip a folder with Python?',
      a: "shutil.make_archive('backup', 'zip', root_dir='folder') creates backup.zip with paths relative to folder and returns the archive's path. Use 'gztar' for .tar.gz. shutil.unpack_archive('backup.zip', 'target') extracts it.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html',
    meta:  'shutil — High-level file operations',
  },

};
