// content/reference/python/exceptions/isadirectoryerror.js

export const meta = {
  slug:        'isadirectoryerror',
  name:        'IsADirectoryError',
  signature:   'IsADirectoryError(errno, strerror[, filename])',
  blurb:       'Raised when a file operation is used on a directory (errno EISDIR).',
  category:    'os',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'isadirectoryerror is a directory error errno 21 eisdir open folder os.remove directory read directory as file listdir walk',
};

export const method = {
  slug:      'isadirectoryerror',
  name:      'IsADirectoryError',
  signature: 'IsADirectoryError(errno, strerror[, filename])',

  category:    'OS exception',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: '[Errno 21] Is a directory — you handed a folder to something that wants a file. On Windows the same mistake usually surfaces as PermissionError instead.',

  chain: ['BaseException', 'Exception', 'OSError', 'IsADirectoryError'],

  cheat: {
    raisedBy: 'open(folder), os.remove(folder) on Linux, os.rename(file, folder)',
    message:  "[Errno 21] Is a directory: 'path'",
    quickFix: 'filter with Path.is_file(); remove folders with shutil.rmtree',
    watchOut: 'Windows raises PermissionError for open(folder)',
  },

  parameters: [
    { name: 'errno',    type: 'int', required: false, default: null, desc: 'errno.EISDIR (21 on Linux, macOS and Windows).' },
    { name: 'strerror', type: 'str', required: false, default: null, desc: "'Is a directory'." },
    { name: 'filename', type: 'str | bytes | None', required: false, default: null, desc: 'The directory path that was used as a file.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'What Linux and macOS raise for open() on a folder: OSError with errno EISDIR — the constructor turns it into IsADirectoryError.',
      params: [{ name: 'path', type: 'str | None', hint: 'empty → None', input: 'text-or-none' }],
      template: "import errno\nraise OSError(errno.EISDIR, 'Is a directory', {$path})",
      cases: [
        { id: 'folder', label: 'a folder',     values: { path: 'logs' } },
        { id: 'slash',  label: 'trailing /',   values: { path: 'data/' } },
        { id: 'nopath', label: 'no path',      values: { path: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'The one-argument form for your own code: just a message, errno stays None.',
      params: [{ name: 'message', type: 'str', hint: 'message', input: 'text' }],
      template: 'e = IsADirectoryError({$message})\n(e.errno, e.strerror, str(e))',
      cases: [
        { id: 'msg',   label: 'message',       values: { message: 'expected a file, got the folder uploads/' } },
        { id: 'empty', label: 'empty message', values: { message: '' } },
      ],
    },
  ],
  demoExplainer: "The Trigger snippet raises OSError but the traceback names IsADirectoryError: errno.EISDIR selected the subclass. That is also why the demo builds the error explicitly — a real open() on a folder only produces this on Linux/macOS; Windows reports PermissionError: [Errno 13] for the same call.",

  attributes: [
    { name: 'errno',    type: 'int | None', meaning: 'errno.EISDIR when raised by the OS; None for the one-argument form.' },
    { name: 'strerror', type: 'str | None', meaning: "'Is a directory'." },
    { name: 'filename', type: 'str | bytes | None', meaning: 'The folder that was passed where a file was expected.' },
  ],

  patterns: [
    {
      name: 'Read only the files in a folder',
      desc: 'listdir()/iterdir() return folders too. Filter before opening.',
      code: "from pathlib import Path\nfor p in Path('data').iterdir():\n    if p.is_file():\n        process(p.read_text())",
    },
    {
      name: 'Delete a file or a folder',
      desc: 'os.remove is for files; folders need os.rmdir (empty) or shutil.rmtree (with contents).',
      code: "import shutil\nfrom pathlib import Path\np = Path(target)\nif p.is_dir():\n    shutil.rmtree(p)\nelse:\n    p.unlink(missing_ok=True)",
    },
    {
      name: 'Catch the Linux and the Windows variant',
      desc: 'The same mistake is IsADirectoryError on POSIX and PermissionError on Windows.',
      code: "try:\n    text = open(path).read()\nexcept (IsADirectoryError, PermissionError):\n    text = None",
    },
  ],

  examples: [
    { title: 'errno EISDIR maps to it',         code: "import errno\nOSError(errno.EISDIR, 'Is a directory', 'logs')", returns: "IsADirectoryError(21, 'Is a directory')" },
    { title: 'Raised with a path',              code: "import errno\nraise IsADirectoryError(errno.EISDIR, 'Is a directory', 'logs')", returns: "IsADirectoryError: [Errno 21] Is a directory: 'logs'" },
    { title: 'open() on a folder, portably',    code: "import os\nos.mkdir('uploads')\ntry:\n    open('uploads')\nexcept (IsADirectoryError, PermissionError) as e:\n    r = f'{e.filename} is a folder'\nr", returns: "'uploads is a folder'" },
    { title: 'Filter with is_file()',           code: "from pathlib import Path\nPath('data').mkdir()\nPath('data/a.txt').write_text('A')\nPath('data/archive').mkdir()\nsorted(p.name for p in Path('data').iterdir() if p.is_file())", returns: "['a.txt']" },
    { title: 'rglob() yields folders too',      code: "from pathlib import Path\nPath('data/sub').mkdir(parents=True)\nPath('data/a.txt').write_text('A')\nPath('data/sub/b.txt').write_text('B')\nsorted(p.as_posix() for p in Path('data').rglob('*'))", returns: "['data/a.txt', 'data/sub', 'data/sub/b.txt']" },
    { title: 'shutil.rmtree removes a folder',  code: "import os, shutil\nos.mkdir('build')\nopen('build/app.o', 'w').close()\nshutil.rmtree('build')\nos.path.exists('build')", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Opening every entry of listdir()',
      desc: 'os.listdir() returns sub-folder names as well as files. The first folder breaks the loop (IsADirectoryError on Linux/macOS, PermissionError on Windows).',
      wrong: { label: 'All entries', code: "import os\nfrom pathlib import Path\nos.mkdir('data')\nPath('data/a.txt').write_text('A')\nos.mkdir('data/old')\ntry:\n    texts = [open(f'data/{n}').read() for n in sorted(os.listdir('data'))]\nexcept (IsADirectoryError, PermissionError) as e:\n    texts = f'failed on {e.filename}'\ntexts", output: "'failed on data/old'" },
      fix:   { label: 'Files only',  code: "import os\nfrom pathlib import Path\nos.mkdir('data')\nPath('data/a.txt').write_text('A')\nos.mkdir('data/old')\ntexts = [p.read_text() for p in sorted(Path('data').iterdir()) if p.is_file()]\ntexts", output: "['A']" },
    },
    {
      name: 'os.remove() on a folder',
      desc: 'os.remove/os.unlink delete files only. On a folder Linux raises IsADirectoryError, macOS and Windows raise PermissionError. Use shutil.rmtree (or os.rmdir for an empty folder).',
      wrong: { label: 'os.remove', code: "import os\nos.mkdir('cache')\ntry:\n    os.remove('cache')\nexcept (IsADirectoryError, PermissionError):\n    r = 'not removed'\nr", output: "'not removed'" },
      fix:   { label: 'shutil.rmtree', code: "import os, shutil\nos.mkdir('cache')\nshutil.rmtree('cache')\nos.path.exists('cache')", output: 'False' },
    },
  ],

  when: {
    use: [
      'Catching a folder passed where a file path was expected (together with PermissionError for Windows)',
      'Raising it from your own API when given a directory instead of a file',
    ],
    avoid: [
      'Walking a tree → filter with Path.is_file() / os.walk() files lists',
      'Deleting folders → shutil.rmtree() or os.rmdir()',
      'Relying on it on Windows → the same mistake is PermissionError there',
    ],
  },

  notes: {
    cpython:     'Objects/exceptions.c — OSError(EISDIR, …) returns IsADirectoryError',
    'Catch via': 'except OSError, or (IsADirectoryError, PermissionError) for portable code',
    'Platforms': 'open(folder): Linux/macOS IsADirectoryError, Windows PermissionError. os.remove(folder): Linux IsADirectoryError, macOS/Windows PermissionError',
  },

  related: [
    { name: 'NotADirectoryError', slug: 'notadirectoryerror', when: 'The reverse: a file used as a folder' },
    { name: 'PermissionError',    slug: 'permissionerror',    when: 'What Windows raises for the same mistake' },
    { name: 'OSError',            slug: 'oserror',            when: 'Base class' },
    { name: 'FileNotFoundError',  slug: 'filenotfounderror',  when: 'Another path problem with the same attributes' },
    { name: 'open()',             slug: 'open',               when: 'The usual trigger', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does IsADirectoryError: [Errno 21] Is a directory mean?',
      a: 'The path you gave to open(), os.remove() or similar is a folder, not a file. Common causes: a loop over os.listdir() that also returns sub-folders, a path variable missing its file name (data/ instead of data/file.csv), or a save path that points at an existing folder.',
    },
    {
      q: 'Why do I get PermissionError instead of IsADirectoryError on Windows?',
      a: 'Windows refuses to open a directory as a file with an access error (EACCES), so Python raises PermissionError: [Errno 13] Permission denied. Linux and macOS return EISDIR. Catch both classes if your code must run everywhere.',
    },
    {
      q: 'How do I delete a directory in Python?',
      a: 'os.rmdir(path) or Path.rmdir() for an empty folder; shutil.rmtree(path) for a folder with contents. os.remove and Path.unlink are for files only.',
    },
    {
      q: 'How do I read only the files in a folder?',
      a: 'Filter with Path.is_file(): [p for p in Path(folder).iterdir() if p.is_file()], or use the file list that os.walk() yields for each directory.',
    },
  ],

  history: [
    { version: '3.3', note: 'Added, together with the other OSError subclasses (PEP 3151).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#IsADirectoryError',
    meta:  'Built-in exceptions',
  },
};
