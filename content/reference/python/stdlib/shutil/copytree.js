// content/reference/python/stdlib/shutil/copytree.js

export const meta = {
  slug:        'copytree',
  name:        'shutil.copytree',
  signature:   'shutil.copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False, dirs_exist_ok=False)',
  blurb:       'Recursively copy a whole folder to a new location (or merge it into an existing one with dirs_exist_ok=True), optionally skipping names, and return the destination.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (dirs_exist_ok 3.8+)',
  searchTerms: 'shutil copytree copy folder copy directory recursively python copy directory tree dirs_exist_ok merge folders fileexistserror ignore ignore_patterns copy_function symlinks shutil.error cp -r',
};

export const method = {
  slug:      'copytree',
  name:      'shutil.copytree',
  signature: 'shutil.copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False, dirs_exist_ok=False)',
  returns:   { type: 'str | PathLike', desc: 'dst, as passed.' },

  category:    'shutil function',
  version:     'Python 3.0+ (dirs_exist_ok 3.8+)',
  hasLiveDemo: true,

  subtitle: 'cp -r in one call: scandir src, create dst with os.makedirs, copy every file with copy2 and every sub-folder recursively, then copy the folder metadata. Per-file failures are collected and raised together as one shutil.Error at the end.',

  covers: ['copytree'],

  cheat: {
    commonCall: "shutil.copytree('src', 'backup', dirs_exist_ok=True)",
    returns:    "'backup' — dst as given",
    replaces:   'os.walk + makedirs + copy2 by hand',
    watchOut:   'dst must not exist unless dirs_exist_ok=True',
  },

  parameters: [
    { name: 'src',                      type: 'str | PathLike', required: true,  default: null,    desc: 'The folder to copy.' },
    { name: 'dst',                      type: 'str | PathLike', required: true,  default: null,    desc: 'The new folder. Missing parent folders are created too.' },
    { name: 'symlinks',                 type: 'bool',     required: false, default: 'False', desc: 'True: copy symlinks as symlinks. False: copy what they point to.' },
    { name: 'ignore',                   type: 'callable', required: false, default: 'None',  desc: 'Called as ignore(folder, names) for every folder; returns the names to skip. ignore_patterns() builds one.' },
    { name: 'copy_function',            type: 'callable', required: false, default: 'copy2', desc: 'Copies each file: copy2 (data + metadata), copy, copyfile, or your own (src, dst) function.' },
    { name: 'ignore_dangling_symlinks', type: 'bool',     required: false, default: 'False', desc: 'With symlinks=False, skip links whose target is missing instead of reporting an error.' },
    { name: 'dirs_exist_ok',            type: 'bool',     required: false, default: 'False', desc: 'True: merge into an existing dst, overwriting files with the same name (3.8+).' },
  ],

  modes: [
    {
      id: 'tree',
      label: 'copy a folder',
      blurb: 'Create some files, copy one folder and list the files of the copy — or see which OSError you get.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'folder to copy',                   input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'new folder',                       input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    shutil.copytree({$src}, {$dst})\n    result = sorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk({$dst}) for n in fs)\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'copy',   label: 'copy',             values: { files: 'site/index.html, site/css/main.css, site/img/logo.png', src: 'site', dst: 'site-backup' } },
        { id: 'nested', label: 'new parent folders', values: { files: 'site/index.html, site/css/main.css', src: 'site', dst: 'backups/2026/site' } },
        { id: 'exists', label: 'dst exists',       values: { files: 'site/index.html, backup/old.html', src: 'site', dst: 'backup' } },
        { id: 'file',   label: 'src is a file',    values: { files: 'notes.txt', src: 'notes.txt', dst: 'copy' } },
      ],
    },
    {
      id: 'merge',
      label: 'merge (dirs_exist_ok)',
      blurb: 'Every file holds its own path as content. Merge new/ into site/ and read every file of site/ afterwards.',
      params: [{ name: 'files', type: 'list[str]', hint: 'files under new/ and site/', input: 'csv' }],
      template: "import os, shutil\nfrom pathlib import Path\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    with open(f, 'w') as fh:\n        fh.write(f)\nshutil.copytree('new', 'site', dirs_exist_ok=True)\nsorted((p.as_posix(), p.read_text()) for p in Path('site').rglob('*') if p.is_file())",
      cases: [
        { id: 'overlap', label: 'overlapping names', values: { files: 'site/index.html, site/about.html, new/index.html, new/blog/post.html' } },
        { id: 'fresh',   label: 'site missing',      values: { files: 'new/index.html' } },
      ],
    },
    {
      id: 'ignore',
      label: 'what ignore sees',
      blurb: 'An ignore callable that records each call before delegating to ignore_patterns. Skipped folders are never visited.',
      params: [
        { name: 'files',    type: 'list[str]', hint: 'files under src/', input: 'csv' },
        { name: 'patterns', type: 'list[str]', hint: 'names to skip',    input: 'csv' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ncalls = []\ndef spy(path, names):\n    calls.append((path.replace(os.sep, '/'), sorted(names)))\n    return shutil.ignore_patterns(*{$patterns})(path, names)\nshutil.copytree('src', 'dst', ignore=spy)\nsorted(calls)",
      cases: [
        { id: 'cache', label: 'skip __pycache__', values: { files: 'src/app.py, src/__pycache__/app.cpython-313.pyc, src/lib/util.py', patterns: '__pycache__' } },
        { id: 'none',  label: 'skip nothing',     values: { files: 'src/app.py, src/lib/util.py', patterns: '' } },
      ],
    },
  ],
  demoExplainer: "Missing parents of dst are created (backups/2026/…), but an existing dst is a FileExistsError, and a file as src a NotADirectoryError. With dirs_exist_ok=True, new/index.html replaced site/index.html (its content is now 'new/index.html'), site/about.html stayed, and blog/ was created. The ignore callable is called once per copied folder with the folder path and the bare names in it — __pycache__ is skipped, so it never gets a call of its own.",

  patterns: [
    {
      name: 'Back up a project without junk',
      desc: 'Patterns are matched against bare names in every folder.',
      code: "import shutil\nshutil.copytree('project', 'project-backup', ignore=shutil.ignore_patterns('.git', '__pycache__', '*.pyc', 'node_modules'))",
    },
    {
      name: 'Sync into an existing folder',
      desc: 'Overwrites files with the same name; files only in dst are kept.',
      code: "import shutil\nshutil.copytree('build', '/var/www/site', dirs_exist_ok=True)",
    },
    {
      name: 'Copy without metadata',
      desc: 'Some network or FAT file systems refuse timestamps or modes.',
      code: "import shutil\nshutil.copytree('src', 'mnt/usb/src', copy_function=shutil.copyfile)",
    },
    {
      name: 'Report what failed',
      desc: 'shutil.Error carries a list of (src, dst, reason) for every file that could not be copied.',
      code: "import shutil\ntry:\n    shutil.copytree(src, dst, dirs_exist_ok=True)\nexcept shutil.Error as e:\n    for s, d, why in e.args[0]:\n        print(f'{s} -> {d}: {why}')",
    },
  ],

  examples: [
    { title: 'Copy a tree, get dst back', code: "import os, shutil\nos.makedirs('src/sub')\nopen('src/sub/a.txt', 'w').close()\nshutil.copytree('src', 'dst')", returns: "'dst'" },
    { title: 'Missing parents are created', code: "import os, shutil\nos.makedirs('src')\nshutil.copytree('src', 'a/b/c')\nos.path.isdir('a/b/c')", returns: 'True' },
    { title: 'Empty folders are copied too', code: "import os, shutil\nos.makedirs('src/empty')\nshutil.copytree('src', 'dst')\nos.listdir('dst')", returns: "['empty']" },
    { title: 'Merge with dirs_exist_ok', code: "import os, shutil\nos.makedirs('src')\nos.makedirs('dst')\nopen('src/new.txt', 'w').close()\nopen('dst/old.txt', 'w').close()\nshutil.copytree('src', 'dst', dirs_exist_ok=True)\nsorted(os.listdir('dst'))", returns: "['new.txt', 'old.txt']" },
    { title: 'Skip names with ignore_patterns', code: "import os, shutil\nos.makedirs('src/__pycache__')\nopen('src/app.py', 'w').close()\nopen('src/app.pyc', 'w').close()\nshutil.copytree('src', 'dst', ignore=shutil.ignore_patterns('*.pyc', '__pycache__'))\nos.listdir('dst')", returns: "['app.py']" },
    { title: 'Timestamps survive (copy2)', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nos.utime('src/a.txt', (1000000000, 1000000000))\nshutil.copytree('src', 'dst')\nos.path.getmtime('dst/a.txt')", returns: '1000000000.0' },
    { title: 'A missing source', code: "import shutil\ntry:\n    shutil.copytree('nope', 'dst')\nexcept FileNotFoundError as e:\n    result = e.filename\nresult", returns: "'nope'" },
  ],

  pitfalls: [
    {
      name: 'Copying into a folder that already exists',
      desc: 'Unlike cp -r, copytree does not copy src inside an existing dst — it refuses. Either merge (dirs_exist_ok=True) or name the new folder inside it yourself.',
      wrong: { label: 'existing dst', code: "import os, shutil\nos.makedirs('src')\nos.makedirs('backup')\ntry:\n    shutil.copytree('src', 'backup')\nexcept FileExistsError:\n    result = 'FileExistsError'\nresult", output: "'FileExistsError'" },
      fix:   { label: 'name the target', code: "import os, shutil\nos.makedirs('src')\nos.makedirs('backup')\nshutil.copytree('src', os.path.join('backup', 'src'))\nos.listdir('backup')", output: "['src']" },
    },
    {
      name: 'Ignoring by path instead of by name',
      desc: 'ignore patterns are compared with bare names inside each folder, never with paths, so a pattern containing a slash matches nothing.',
      wrong: { label: "'src/build'", code: "import os, shutil\nos.makedirs('src/build')\nopen('src/main.c', 'w').close()\nshutil.copytree('src', 'dst', ignore=shutil.ignore_patterns('src/build'))\nsorted(os.listdir('dst'))", output: "['build', 'main.c']" },
      fix:   { label: "'build'", code: "import os, shutil\nos.makedirs('src/build')\nopen('src/main.c', 'w').close()\nshutil.copytree('src', 'dst', ignore=shutil.ignore_patterns('build'))\nsorted(os.listdir('dst'))", output: "['main.c']" },
    },
    {
      name: 'A destination inside the source',
      desc: 'copytree lists src before it creates dst, so the first run looks fine. Run it again with dirs_exist_ok=True and the old backup is part of src: every run nests one level deeper. Keep dst outside src.',
      wrong: { label: 'dst inside src, run twice', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nfor run in range(2):\n    shutil.copytree('src', 'src/backup', dirs_exist_ok=True)\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('src') for n in fs)", output: "['src/a.txt', 'src/backup/a.txt', 'src/backup/backup/a.txt']" },
      fix:   { label: 'dst next to src', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nfor run in range(2):\n    shutil.copytree('src', 'src-backup', dirs_exist_ok=True)\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('src-backup') for n in fs)", output: "['src-backup/a.txt']" },
    },
  ],

  when: {
    use: [
      'Copying a folder with everything in it',
      'Merging a build output into a deployment folder (dirs_exist_ok=True)',
      'Backups that skip caches and VCS folders (ignore=)',
    ],
    avoid: [
      'Copying one file → copy / copy2',
      'Moving a folder → move (a rename when possible, no copy at all)',
      'Large incremental syncs → a tool like rsync; copytree always copies every file',
    ],
  },

  notes: {
    cpython:          'Lib/shutil.py: entries = list(os.scandir(src)); os.makedirs(dst, exist_ok=dirs_exist_ok); copy each entry; copystat(src, dst); raise Error(errors) if any',
    'Errors':         'Failures of single files or sub-folders are collected as (srcname, dstname, str(exception)) and raised together as shutil.Error after everything else was copied',
    'copy_function':  'With copy2 or copy, each file is passed as an os.DirEntry, not a str — a custom function receives plain path strings',
  },

  related: [
    { name: 'ignore_patterns', slug: 'ignore_patterns', when: 'Build the ignore callable' },
    { name: 'shutil.copy2',    slug: 'copy2',    when: 'What copies each file by default' },
    { name: 'shutil.rmtree',   slug: 'rmtree',   when: 'The opposite: delete a tree' },
    { name: 'shutil.Error',    slug: 'error',    when: 'What collected failures raise' },
    { name: 'os.walk',         slug: 'walk',     when: 'Walk a tree yourself', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I fix "FileExistsError" from shutil.copytree?',
      a: 'The destination folder already exists. Pass dirs_exist_ok=True (Python 3.8+) to merge into it, delete it first with shutil.rmtree, or copy into a new sub-folder: copytree(src, os.path.join(dst, os.path.basename(src))).',
    },
    {
      q: 'How do I copy a folder but skip some files?',
      a: "Pass ignore=shutil.ignore_patterns('*.pyc', '__pycache__', '.git'). The patterns are glob-style and are matched against bare file and folder names in every folder. For other rules, pass your own function(path, names) returning the names to skip.",
    },
    {
      q: 'Does copytree overwrite existing files?',
      a: 'Only with dirs_exist_ok=True: then files in dst with the same relative path are overwritten by the ones from src, and files that exist only in dst are left alone. Without it, copytree refuses to start if dst exists.',
    },
    {
      q: 'Does shutil.copytree preserve timestamps?',
      a: 'Yes by default: files are copied with copy2 and every folder gets copystat after its contents are copied. Pass copy_function=shutil.copy or shutil.copyfile to skip file metadata.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copytree',
    meta:  'shutil.copytree',
  },

};
