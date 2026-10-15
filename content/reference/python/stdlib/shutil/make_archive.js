// content/reference/python/stdlib/shutil/make_archive.js

export const meta = {
  slug:        'make_archive',
  name:        'shutil.make_archive',
  signature:   'shutil.make_archive(base_name, format, root_dir=None, base_dir=None, verbose=0, dry_run=0, owner=None, group=None, logger=None)',
  blurb:       'Create a zip or tar archive of a folder in one call and return its file name. root_dir sets what the paths inside are relative to; base_dir picks the part of it to include.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'shutil make_archive zip folder python create zip file of directory tar.gz gztar bztar xztar tar archive root_dir base_dir compress folder backup archive name extension',
};

export const method = {
  slug:      'make_archive',
  name:      'shutil.make_archive',
  signature: 'shutil.make_archive(base_name, format, root_dir=None, base_dir=None, verbose=0, dry_run=0, owner=None, group=None, logger=None)',
  returns:   { type: 'str', desc: 'The archive file name: base_name plus .zip / .tar / .tar.gz / .tar.bz2 / .tar.xz — made absolute when root_dir is given.' },

  category:    'shutil function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'A thin layer over zipfile and tarfile. You give the name without extension and a format; shutil adds the extension, walks the folder and returns the file name. All the subtlety is in root_dir (the folder the names are relative to) and base_dir (what inside it goes in).',

  covers: ['make_archive'],

  cheat: {
    commonCall: "shutil.make_archive('site-backup', 'zip', root_dir='site')",
    returns:    "'/abs/path/site-backup.zip'",
    replaces:   'zip -r / tar czf, or a hand-written zipfile loop',
    watchOut:   'base_name has no extension; with no root_dir and base_dir the archive can contain itself',
  },

  parameters: [
    { name: 'base_name', type: 'str | PathLike', required: true,  default: null,   desc: 'Archive path without extension; missing folders are created.' },
    { name: 'format',    type: 'str',            required: true,  default: null,   desc: "'zip', 'tar', 'gztar', 'bztar', 'xztar' (3.14: 'zstdtar') or a registered format." },
    { name: 'root_dir',  type: 'str | PathLike', required: false, default: 'None', desc: 'The folder that names in the archive are relative to (default: the current folder).' },
    { name: 'base_dir',  type: 'str | PathLike', required: false, default: 'None', desc: 'What to archive, relative to root_dir — it becomes the common prefix of every name (default: everything).' },
    { name: 'dry_run',   type: 'bool',           required: false, default: '0',    desc: 'Only log what would be done (to logger).' },
    { name: 'owner, group', type: 'str',         required: false, default: 'None', desc: 'Owner and group names stored in tar archives.' },
    { name: 'logger',    type: 'logging.Logger', required: false, default: 'None', desc: 'Receives info/debug messages.' },
    { name: 'verbose',   type: 'int',            required: false, default: '0',    desc: 'Unused and deprecated.' },
  ],

  modes: [
    {
      id: 'dirs',
      label: 'root_dir and base_dir',
      blurb: 'site/ holds index.html and css/main.css. Zip it with different root_dir / base_dir values (empty = None) and list the names inside.',
      params: [
        { name: 'root', type: 'str | None', hint: 'root_dir (empty = None)', input: 'text-or-none' },
        { name: 'base', type: 'str | None', hint: 'base_dir (empty = None)', input: 'text-or-none' },
      ],
      template: "import os, shutil, zipfile\nos.makedirs('site/css')\nopen('site/index.html', 'w').close()\nopen('site/css/main.css', 'w').close()\nname = shutil.make_archive('out', 'zip', root_dir={$root}, base_dir={$base})\nwith zipfile.ZipFile(name) as z:\n    members = sorted(z.namelist())\nmembers",
      cases: [
        { id: 'root', label: "root_dir='site'",      values: { root: 'site', base: '' } },
        { id: 'base', label: "base_dir='site'",      values: { root: '', base: 'site' } },
        { id: 'both', label: "root 'site', base 'css'", values: { root: 'site', base: 'css' } },
        { id: 'none', label: 'neither',             values: { root: '', base: '' } },
      ],
    },
    {
      id: 'formats',
      label: 'formats',
      blurb: 'Archive project/ in the format you type and list the member names the way zipfile / tarfile report them.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'fmt',   type: 'str',       hint: 'zip, tar, gztar, bztar, xztar',    input: 'text' },
      ],
      template: "import os, shutil, tarfile, zipfile\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nname = shutil.make_archive('dist/app', {$fmt}, base_dir='project')\nif name.endswith('.zip'):\n    with zipfile.ZipFile(name) as z:\n        members = sorted(z.namelist())\nelse:\n    with tarfile.open(name) as t:\n        members = t.getnames()\n(name, members)",
      cases: [
        { id: 'zip',   label: 'zip',   values: { files: 'project/app.py, project/lib/util.py', fmt: 'zip' } },
        { id: 'gztar', label: 'gztar', values: { files: 'project/app.py, project/lib/util.py', fmt: 'gztar' } },
        { id: 'xztar', label: 'xztar', values: { files: 'project/app.py', fmt: 'xztar' } },
        { id: 'bad',   label: '7z',    values: { files: 'project/app.py', fmt: '7z' } },
      ],
    },
  ],
  demoExplainer: "root_dir='site' gives names relative to site/ (index.html, css/…); base_dir='site' keeps the site/ prefix; both together archive only css/ under site/. With neither, the zip is written into the very folder it archives — and contains out.zip itself, because zipfile has no check for that (tarfile skips its own archive). Zip lists folders with a trailing slash; tar names come back without one. A missing format extension is added for you: dist/app becomes dist/app.tar.gz, and the dist folder is created.",

  patterns: [
    {
      name: 'Zip a folder with names relative to it',
      desc: 'The most common call: everything inside the folder, no prefix.',
      code: "import shutil\narchive = shutil.make_archive('backups/site-2026-10-06', 'zip', root_dir='site')",
    },
    {
      name: 'Keep the top folder in the archive',
      desc: 'root_dir is the parent, base_dir the folder: every name starts with project/.',
      code: "import shutil\nshutil.make_archive('project-src', 'gztar', root_dir='/home/ada/code', base_dir='project')",
    },
    {
      name: 'Archive into a different folder',
      desc: 'Keep the archive out of the tree you archive.',
      code: "import shutil, tempfile, os\nout = os.path.join(tempfile.gettempdir(), 'logs')\nshutil.make_archive(out, 'xztar', root_dir='/var/log/myapp')",
    },
  ],

  examples: [
    { title: 'Extension added, name returned', code: "import os, shutil\nos.makedirs('site')\nopen('site/index.html', 'w').close()\nshutil.make_archive('backup', 'zip', base_dir='site')", returns: "'backup.zip'" },
    { title: 'With root_dir the name is absolute', code: "import os, shutil\nos.makedirs('site')\nname = shutil.make_archive('backup', 'gztar', root_dir='site')\n(os.path.isabs(name), os.path.basename(name))", returns: "(True, 'backup.tar.gz')" },
    { title: 'Names relative to root_dir', code: "import os, shutil, zipfile\nos.makedirs('site/css')\nopen('site/css/a.css', 'w').close()\nwith zipfile.ZipFile(shutil.make_archive('out', 'zip', root_dir='site')) as z:\n    names = sorted(z.namelist())\nnames", returns: "['css/', 'css/a.css']" },
    { title: 'tar names start at "."', code: "import os, shutil, tarfile\nos.makedirs('site')\nopen('site/a.txt', 'w').close()\nwith tarfile.open(shutil.make_archive('out', 'tar', root_dir='site')) as t:\n    names = t.getnames()\nnames", returns: "['.', './a.txt']" },
    { title: 'Unknown format', code: "import shutil\nshutil.make_archive('out', 'rar')", returns: "ValueError: unknown archive format 'rar'" },
    { title: 'root_dir must be a folder', code: "import shutil\nopen('notes.txt', 'w').close()\nshutil.make_archive('out', 'zip', root_dir='notes.txt')", returns: "NotADirectoryError: [Errno 20] Not a directory: 'notes.txt'" },
  ],

  pitfalls: [
    {
      name: 'Archiving the current folder into itself',
      desc: 'Without root_dir/base_dir everything under the current folder goes in — including the zip being written. Put the archive elsewhere or archive a sub-folder.',
      wrong: { label: 'archive in the tree', code: "import shutil, zipfile\nopen('data.csv', 'w').close()\nwith zipfile.ZipFile(shutil.make_archive('backup', 'zip')) as z:\n    names = sorted(z.namelist())\nnames", output: "['backup.zip', 'data.csv']" },
      fix:   { label: 'archive a sub-folder', code: "import os, shutil, zipfile\nos.makedirs('data')\nopen('data/data.csv', 'w').close()\nwith zipfile.ZipFile(shutil.make_archive('backup', 'zip', root_dir='data')) as z:\n    names = sorted(z.namelist())\nnames", output: "['data.csv']" },
    },
    {
      name: 'Putting the extension in base_name',
      desc: 'make_archive always appends the extension itself.',
      wrong: { label: "'backup.zip'", code: "import os, shutil\nos.makedirs('site')\nshutil.make_archive('backup.zip', 'zip', base_dir='site')", output: "'backup.zip.zip'" },
      fix:   { label: "'backup'", code: "import os, shutil\nos.makedirs('site')\nshutil.make_archive('backup', 'zip', base_dir='site')", output: "'backup.zip'" },
    },
    {
      name: 'A base_dir that is not relative to root_dir',
      desc: 'base_dir is joined onto root_dir. Passing the same folder to both looks for site/site.',
      wrong: { label: "root 'site', base 'site'", code: "import os, shutil\nos.makedirs('site')\ntry:\n    shutil.make_archive('out', 'zip', root_dir='site', base_dir='site')\nexcept FileNotFoundError as e:\n    result = e.filename.replace(os.sep, '/')\nresult", output: "'site/site'" },
      fix:   { label: "root '.', base 'site'", code: "import os, shutil, zipfile\nos.makedirs('site')\nopen('site/a.txt', 'w').close()\nwith zipfile.ZipFile(shutil.make_archive('out', 'zip', root_dir='.', base_dir='site')) as z:\n    names = sorted(z.namelist())\nnames", output: "['site/', 'site/a.txt']" },
    },
  ],

  when: {
    use: [
      'Zipping or tarring a whole folder for a backup, release or download',
      'Scripts that should not care which archive format is used',
    ],
    avoid: [
      'Choosing files individually, adding data from memory, setting compression levels → zipfile / tarfile directly',
      'Reading or listing an archive → zipfile.ZipFile / tarfile.open',
    ],
  },

  notes: {
    cpython:        'Lib/shutil.py: _make_zipfile (ZIP_DEFLATED, os.walk, folders sorted, an entry per folder) and _make_tarball (tarfile.open(name, "w|gz") etc., TarFile.add recursing in sorted order)',
    'Formats':      'zip and gztar need zlib, bztar needs bz2, xztar needs lzma — standard builds have all three; zstdtar arrives in 3.14',
    'root_dir':     'Since 3.10.6 the built-in formats no longer chdir into root_dir, so they are thread-safe; custom archivers without supports_root_dir still cause a chdir',
    'tar':          'format="tar" writes PAX (POSIX.1-2001) archives since 3.8',
  },

  related: [
    { name: 'shutil.unpack_archive', slug: 'unpack_archive',      when: 'The reverse' },
    { name: 'get_archive_formats',   slug: 'get_archive_formats', when: 'List or register formats' },
    { name: 'shutil.copytree',       slug: 'copytree',            when: 'Copy a folder instead of archiving it' },
    { name: 'shutil module',         slug: 'shutil',              when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I zip a folder in Python?',
      a: "shutil.make_archive('name', 'zip', root_dir='folder') creates name.zip containing the folder's contents with paths relative to it. To keep the folder itself as the top level, use root_dir=parent and base_dir='folder'.",
    },
    {
      q: 'What is the difference between root_dir and base_dir?',
      a: 'root_dir is the folder the archive paths are relative to — as if you chdir there first. base_dir is the path, relative to root_dir, of what gets archived, so it becomes the prefix of every name. Both default to the current folder.',
    },
    {
      q: 'Why does my zip contain itself?',
      a: 'The archive is created inside the folder being archived (typically make_archive(name, "zip") with no root_dir/base_dir). zipfile writes the partly written archive into itself; tar formats skip their own file. Write the archive to another folder.',
    },
    {
      q: 'How do I create a .tar.gz file?',
      a: "shutil.make_archive('name', 'gztar', root_dir='folder') returns '…/name.tar.gz'. Use 'bztar' for .tar.bz2 and 'xztar' for .tar.xz.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.make_archive',
    meta:  'shutil.make_archive',
  },

};
