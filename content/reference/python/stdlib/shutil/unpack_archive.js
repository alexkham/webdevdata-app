// content/reference/python/stdlib/shutil/unpack_archive.js

export const meta = {
  slug:        'unpack_archive',
  name:        'shutil.unpack_archive',
  signature:   'shutil.unpack_archive(filename, extract_dir=None, format=None, *, filter=None)',
  blurb:       'Extract a zip or tar archive into a folder; the format is picked from the file extension unless you name it. filter= (3.12+) makes tar extraction safe.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+ (filter 3.12+)',
  searchTerms: 'shutil unpack_archive extract zip python unzip file extract tar.gz untar extract_dir filter data readerror unknown archive format is not a zip file deprecationwarning python 3.14 extraction filter',
};

export const method = {
  slug:      'unpack_archive',
  name:      'shutil.unpack_archive',
  signature: 'shutil.unpack_archive(filename, extract_dir=None, format=None, *, filter=None)',
  returns:   { type: 'None', desc: 'Nothing; the files are written below extract_dir.' },

  category:    'shutil function',
  version:     'Python 3.2+ (filter 3.12+)',
  hasLiveDemo: true,

  subtitle: 'One call for every archive type: .zip, .tar, .tar.gz/.tgz, .tar.bz2/.tbz2, .tar.xz/.txz. Zip members with absolute paths or ".." are skipped; tar archives are only made safe by filter="data" — the default from Python 3.14, an explicit opt-in before.',

  covers: ['unpack_archive'],

  cheat: {
    commonCall: "shutil.unpack_archive('backup.tar.gz', 'restore', filter='data')",
    returns:    'None',
    replaces:   'unzip / tar xzf, or zipfile / tarfile boilerplate',
    watchOut:   'filter= raises TypeError for zip files',
  },

  parameters: [
    { name: 'filename',    type: 'str | PathLike', required: true,  default: null,   desc: 'The archive. Its extension selects the format unless format is given.' },
    { name: 'extract_dir', type: 'str | PathLike', required: false, default: 'None', desc: 'Target folder (created if needed); default: the current folder.' },
    { name: 'format',      type: 'str',            required: false, default: 'None', desc: "'zip', 'tar', 'gztar', 'bztar', 'xztar' or a registered format — skips the extension lookup." },
    { name: 'filter',      type: 'str | callable', required: false, default: 'None', desc: "Tar extraction filter: 'data' (safe for untrusted archives), 'tar' or 'fully_trusted'. Not accepted for zip files (3.12+)." },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'pack and unpack',
      blurb: 'Archive project/ in a format of your choice, unpack it into restored/ and list what came out.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'fmt',   type: 'str',       hint: 'zip, tar, gztar, bztar, xztar',    input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nname = shutil.make_archive('backup', {$fmt}, root_dir='project')\nkw = {} if name.endswith('.zip') else {'filter': 'data'}\nshutil.unpack_archive(name, 'restored', **kw)\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('restored') for n in ds + fs)",
      cases: [
        { id: 'zip',   label: 'zip',   values: { files: 'project/app.py, project/lib/util.py, project/README.md', fmt: 'zip' } },
        { id: 'gztar', label: 'gztar', values: { files: 'project/app.py, project/lib/util.py, project/README.md', fmt: 'gztar' } },
        { id: 'bztar', label: 'bztar', values: { files: 'project/app.py', fmt: 'bztar' } },
      ],
    },
    {
      id: 'detect',
      label: 'format detection',
      blurb: 'No file is created here: see how the name alone decides what happens (and which error you get).',
      params: [{ name: 'filename', type: 'str', hint: 'archive name', input: 'text' }],
      template: "import shutil\ntry:\n    shutil.unpack_archive({$filename}, 'out')\n    result = 'unpacked'\nexcept OSError as e:\n    result = f'{type(e).__name__}: {e}'\nresult",
      cases: [
        { id: 'rar',  label: '.rar',     values: { filename: 'photos.rar' } },
        { id: 'zip',  label: '.zip',     values: { filename: 'photos.zip' } },
        { id: 'tgz',  label: '.tgz',     values: { filename: 'photos.tgz' } },
        { id: 'none', label: 'no extension', values: { filename: 'photos' } },
      ],
    },
  ],
  demoExplainer: "The round trip restores the same tree for every format (folders included). In the detection tab, an unknown extension is a ReadError before any file is opened. A known one hands over to the unpacker: the zip unpacker checks zipfile.is_zipfile first and reports 'photos.zip is not a zip file' even when the file is simply missing, while tarfile opens the file and raises FileNotFoundError.",

  patterns: [
    {
      name: 'Extract a downloaded release safely',
      desc: "filter='data' strips leading slashes, refuses members whose '..' would land outside the target, and rejects device files and dangerous links in tar archives.",
      code: "import shutil\nshutil.unpack_archive('release.tar.gz', 'vendor', filter='data')",
    },
    {
      name: 'One call for zip and tar',
      desc: 'zip rejects filter=, so pass it only for tar formats.',
      code: "import shutil\nkw = {} if path.endswith('.zip') else {'filter': 'data'}\nshutil.unpack_archive(path, target, **kw)",
    },
    {
      name: 'Force the format for odd names',
      desc: 'An extension-less upload, or .jar / .whl (which are zips).',
      code: "import shutil\nshutil.unpack_archive('upload.bin', 'out', format='zip')",
    },
  ],

  examples: [
    { title: 'Round trip through zip', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nshutil.unpack_archive(shutil.make_archive('pkg', 'zip', root_dir='src'), 'out')\nos.listdir('out')", returns: "['a.txt']" },
    { title: 'tar with the data filter', code: "import os, shutil\nos.makedirs('src/sub')\nopen('src/sub/b.txt', 'w').close()\nshutil.unpack_archive(shutil.make_archive('pkg', 'gztar', root_dir='src'), 'out', filter='data')\nos.listdir('out/sub')", returns: "['b.txt']" },
    { title: 'The extension decides', code: "import shutil\nshutil.unpack_archive('notes.7z', 'out')", returns: "shutil.ReadError: Unknown archive format 'notes.7z'" },
    { title: 'Name the format to skip detection', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nos.rename(shutil.make_archive('pkg', 'zip', root_dir='src'), 'pkg.bin')\nshutil.unpack_archive('pkg.bin', 'out', format='zip')\nos.listdir('out')", returns: "['a.txt']" },
    { title: 'Not actually a zip', code: "import shutil\nwith open('fake.zip', 'w') as f:\n    f.write('hello')\nshutil.unpack_archive('fake.zip', 'out')", returns: 'shutil.ReadError: fake.zip is not a zip file' },
    { title: 'An unknown format name', code: "import shutil\nshutil.unpack_archive('a.zip', 'out', format='rar')", returns: "ValueError: Unknown unpack format 'rar'" },
  ],

  pitfalls: [
    {
      name: 'Passing filter= for a zip file',
      desc: 'The zip unpacker has no filter parameter, so filter="data" breaks zip extraction — check the format first.',
      wrong: { label: "filter='data' on a zip", code: "import os, shutil\nos.makedirs('src')\nshutil.make_archive('pkg', 'zip', root_dir='src')\nshutil.unpack_archive('pkg.zip', 'out', filter='data')", output: "TypeError: _unpack_zipfile() got an unexpected keyword argument 'filter'" },
      fix:   { label: 'no filter for zip', code: "import os, shutil\nos.makedirs('src')\nopen('src/a.txt', 'w').close()\nshutil.make_archive('pkg', 'zip', root_dir='src')\nshutil.unpack_archive('pkg.zip', 'out')\nos.listdir('out')", output: "['a.txt']" },
    },
    {
      name: 'Extracting untrusted tar files without a filter',
      desc: "In 3.12 and 3.13 the default is to trust the archive completely (with a DeprecationWarning): a member named ../../etc/x or /etc/x is written there. filter='data' raises instead; it becomes the default in 3.14.",
      wrong: { label: 'no filter', code: "import io, os, shutil, tarfile, warnings\nos.makedirs('out/inner')\ninfo = tarfile.TarInfo('../escaped.txt')\ninfo.size = 2\nwith tarfile.open('evil.tar', 'w') as t:\n    t.addfile(info, io.BytesIO(b'hi'))\nwith warnings.catch_warnings():\n    warnings.simplefilter('ignore')\n    shutil.unpack_archive('evil.tar', 'out/inner')\nos.path.exists('out/escaped.txt')", output: 'True' },
      fix:   { label: "filter='data'", code: "import io, os, shutil, tarfile\nos.makedirs('out/inner')\ninfo = tarfile.TarInfo('../escaped.txt')\ninfo.size = 2\nwith tarfile.open('evil.tar', 'w') as t:\n    t.addfile(info, io.BytesIO(b'hi'))\ntry:\n    shutil.unpack_archive('evil.tar', 'out/inner', filter='data')\nexcept tarfile.OutsideDestinationError:\n    result = 'refused'\nresult", output: "'refused'" },
    },
  ],

  when: {
    use: [
      'Extracting a whole archive whose format you know only from its name',
      'Restoring a backup made with make_archive',
    ],
    avoid: [
      'Extracting single members, listing contents, reading into memory → zipfile / tarfile',
      'Untrusted tar archives on 3.12/3.13 without filter="data"',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: find the format by extension (ReadError if none), then _unpack_zipfile (skips names starting with / or containing "..", creates parent folders, copies each member) or _unpack_tarfile (tarfile.open + extractall(filter=…))',
    'Errors':     'ReadError (an OSError) for an unknown extension or an unreadable archive; ValueError for an unknown format= name; TypeError for filter= with zip',
    'Zip names':  "'..' is tested as a substring, so a harmless member like 'v1..2.txt' is skipped too",
  },

  related: [
    { name: 'shutil.make_archive', slug: 'make_archive',       when: 'The reverse' },
    { name: 'get_unpack_formats',  slug: 'get_unpack_formats', when: 'Extensions per format, custom unpackers' },
    { name: 'shutil.ReadError',    slug: 'readerror',          when: 'Unknown or broken archives' },
    { name: 'shutil module',       slug: 'shutil',             when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I unzip a file in Python?',
      a: "shutil.unpack_archive('file.zip', 'target_folder'). For more control (single members, passwords, listing) use zipfile.ZipFile('file.zip').extractall('target_folder').",
    },
    {
      q: 'What does the filter argument do?',
      a: "It is passed to tarfile's extraction: 'data' strips leading slashes, refuses members that would land outside extract_dir, rejects device files and dangerous links, and sanitizes permissions. Zip files do not accept it. In Python 3.14 'data' is the default for tar files.",
    },
    {
      q: 'Why do I get "DeprecationWarning: Python 3.14 will, by default, filter extracted tar archives"?',
      a: "You unpacked a tar archive on 3.12 or 3.13 without filter=. Pass filter='data' (or 'fully_trusted' for archives you trust and that need special files) to silence it and choose the behaviour explicitly.",
    },
    {
      q: 'What does "shutil.ReadError: Unknown archive format" mean?',
      a: 'The file name does not end with a registered extension (.zip, .tar, .tar.gz, .tgz, .tar.bz2, .tbz2, .tar.xz, .txz). Pass format= explicitly, or register an unpacker with register_unpack_format.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.unpack_archive',
    meta:  'shutil.unpack_archive',
  },

};
