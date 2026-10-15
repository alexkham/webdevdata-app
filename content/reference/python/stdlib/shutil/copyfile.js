// content/reference/python/stdlib/shutil/copyfile.js

export const meta = {
  slug:        'copyfile',
  name:        'shutil.copyfile',
  signature:   'shutil.copyfile(src, dst, *, follow_symlinks=True)',
  blurb:       'Copy the contents of one file to a new or existing file — data only, no permissions or timestamps — and return the destination path.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil copyfile copy file contents python copy file data only overwrite destination samefileerror same file directory does not exist isadirectoryerror permission denied follow_symlinks fast copy sendfile',
};

export const method = {
  slug:      'copyfile',
  name:      'shutil.copyfile',
  signature: 'shutil.copyfile(src, dst, *, follow_symlinks=True)',
  returns:   { type: 'str | PathLike', desc: 'dst, exactly as you passed it.' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'The bare copy: open src, open dst for writing (creating or truncating it), move the bytes — with sendfile on Linux and fcopyfile on macOS. dst must be a file name, not a folder, and its parent folder must exist.',

  covers: ['copyfile'],

  cheat: {
    commonCall: "shutil.copyfile('a.txt', 'b.txt')",
    returns:    "'b.txt' — dst as given",
    replaces:   'Opening both files and looping over read()/write()',
    watchOut:   'A folder as dst fails; use copy() to copy into a folder',
  },

  parameters: [
    { name: 'src',             type: 'str | PathLike', required: true,  default: null,   desc: 'The file to read.' },
    { name: 'dst',             type: 'str | PathLike', required: true,  default: null,   desc: 'The complete target file name. Replaced if it exists; its folder must exist.' },
    { name: 'follow_symlinks', type: 'bool',           required: false, default: 'True', desc: 'False and src is a symlink: create a new symlink at dst instead of copying the target file.' },
  ],

  modes: [
    {
      id: 'copy',
      label: 'copy',
      blurb: 'Every file you list is created with its own name as content. Copy one, then read the destination back — or see which OSError you get.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'source file',                       input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'destination file',                  input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    with open(f, 'w') as fh:\n        fh.write(f)\ntry:\n    dst = shutil.copyfile({$src}, {$dst})\n    with open(dst) as fh:\n        result = (dst, fh.read())\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'new',       label: 'new file',       values: { files: 'notes.txt', src: 'notes.txt', dst: 'notes-copy.txt' } },
        { id: 'overwrite', label: 'overwrite',      values: { files: 'v2.txt, current.txt', src: 'v2.txt', dst: 'current.txt' } },
        { id: 'same',      label: 'same file',      values: { files: 'notes.txt', src: 'notes.txt', dst: './notes.txt' } },
        { id: 'nodir',     label: 'missing folder', values: { files: 'notes.txt', src: 'notes.txt', dst: 'backup/notes.txt' } },
        { id: 'nosrc',     label: 'missing source', values: { files: 'notes.txt', src: 'note.txt', dst: 'copy.txt' } },
      ],
    },
    {
      id: 'message',
      label: 'error message',
      blurb: 'The same call, showing the full exception text.',
      params: [
        { name: 'src', type: 'str', hint: 'source file (a.txt exists)', input: 'text' },
        { name: 'dst', type: 'str', hint: 'destination file',           input: 'text' },
      ],
      template: "import shutil\nwith open('a.txt', 'w') as f:\n    f.write('data')\ntry:\n    result = shutil.copyfile({$src}, {$dst})\nexcept OSError as e:\n    result = f'{type(e).__name__}: {e}'\nresult",
      cases: [
        { id: 'same',  label: 'same file',      values: { src: 'a.txt', dst: './a.txt' } },
        { id: 'nosrc', label: 'missing source', values: { src: 'b.txt', dst: 'c.txt' } },
        { id: 'nodir', label: 'missing folder', values: { src: 'a.txt', dst: 'out/a.txt' } },
        { id: 'ok',    label: 'works',          values: { src: 'a.txt', dst: 'c.txt' } },
      ],
    },
  ],
  demoExplainer: "copyfile returns dst untouched, so './notes.txt' stays './notes.txt' — and is recognised as the same file as notes.txt (it compares the files, not the strings), which raises SameFileError instead of truncating your only copy. A missing source or destination folder is a FileNotFoundError naming the path that failed. Not shown, because it differs by OS: a folder as dst raises IsADirectoryError on Linux and macOS but PermissionError on Windows.",

  patterns: [
    {
      name: 'Overwrite a file with a template',
      desc: 'copyfile replaces dst in place; permission bits of an existing dst stay as they were.',
      code: "import shutil\nshutil.copyfile('config.example.ini', 'config.ini')",
    },
    {
      name: 'Make sure the folder exists first',
      desc: 'copyfile never creates folders.',
      code: "import os, shutil\nos.makedirs('backup/2026', exist_ok=True)\nshutil.copyfile('db.sqlite', 'backup/2026/db.sqlite')",
    },
    {
      name: 'Copy a symlink as a symlink',
      desc: 'follow_symlinks=False recreates the link instead of copying the file it points to.',
      code: "import shutil\nshutil.copyfile('current', 'current.bak', follow_symlinks=False)",
    },
  ],

  examples: [
    { title: 'Copy and get dst back', code: "import shutil\nwith open('a.txt', 'w') as f:\n    f.write('data')\nshutil.copyfile('a.txt', 'b.txt')", returns: "'b.txt'" },
    { title: 'An existing dst is replaced', code: "import shutil\nfrom pathlib import Path\nPath('new.txt').write_text('new')\nPath('old.txt').write_text('old content')\nshutil.copyfile('new.txt', 'old.txt')\nPath('old.txt').read_text()", returns: "'new'" },
    { title: 'Path objects work and come back unchanged', code: "import shutil\nfrom pathlib import Path\nPath('a.txt').write_text('x')\ntype(shutil.copyfile(Path('a.txt'), Path('b.txt'))).__name__ in ('PosixPath', 'WindowsPath')", returns: 'True' },
    { title: 'Only data — the copy is writable', code: "import os, shutil, stat\nopen('ro.txt', 'w').close()\nos.chmod('ro.txt', stat.S_IREAD)\nshutil.copyfile('ro.txt', 'copy.txt')\nbool(os.stat('copy.txt').st_mode & stat.S_IWRITE)", returns: 'True' },
    { title: 'The same file under another name', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copyfile('a.txt', './a.txt')", returns: "shutil.SameFileError: 'a.txt' and './a.txt' are the same file" },
    { title: 'A missing source', code: "import shutil\nshutil.copyfile('missing.txt', 'b.txt')", returns: "FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'" },
  ],

  pitfalls: [
    {
      name: 'Passing a folder as the destination',
      desc: 'copyfile needs the full target file name. copy() and copy2() accept a folder and keep the file name.',
      wrong: { label: 'copyfile(f, folder)', code: "import os, shutil\nos.mkdir('backup')\nopen('a.txt', 'w').close()\ntry:\n    shutil.copyfile('a.txt', 'backup')\nexcept OSError as e:\n    result = isinstance(e, (IsADirectoryError, PermissionError))\nresult", output: 'True' },
      fix:   { label: 'copy(f, folder)', code: "import os, shutil\nos.mkdir('backup')\nopen('a.txt', 'w').close()\nshutil.copy('a.txt', 'backup').replace(os.sep, '/')", output: "'backup/a.txt'" },
    },
    {
      name: 'Expecting the destination folder to be created',
      desc: 'copyfile opens dst for writing; a missing parent folder is a FileNotFoundError naming dst.',
      wrong: { label: 'no folder', code: "import shutil\nopen('a.txt', 'w').close()\nshutil.copyfile('a.txt', 'out/a.txt')", output: "FileNotFoundError: [Errno 2] No such file or directory: 'out/a.txt'" },
      fix:   { label: 'makedirs first', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.makedirs('out', exist_ok=True)\nshutil.copyfile('a.txt', 'out/a.txt')", output: "'out/a.txt'" },
    },
  ],

  when: {
    use: [
      'You know the full destination file name and want only the bytes',
      'Overwriting an existing file while keeping its permissions',
    ],
    avoid: [
      'Destination is a folder → shutil.copy / copy2',
      'You also want permission bits → copy; and timestamps → copy2',
      'Already-open file objects → copyfileobj',
    ],
  },

  notes: {
    cpython:          'Lib/shutil.py: _samefile check, named-pipe check (SpecialFileError), then open(src, "rb") / open(dst, "wb") and a fast-copy helper or copyfileobj',
    'Fast copy':      'Linux: os.sendfile (3.14: os.copy_file_range or os.sendfile); macOS: fcopyfile; Windows: a readinto loop with a buffer up to 1 MiB (3.8+)',
    'Error rewrite':  'On Linux a dst like "missing/" (trailing slash) fails with IsADirectoryError, which copyfile turns into FileNotFoundError: Directory does not exist: missing/',
  },

  related: [
    { name: 'shutil.copy',       slug: 'copy',          when: 'Accepts a folder, also copies permission bits' },
    { name: 'shutil.copy2',      slug: 'copy2',         when: 'Also copies timestamps' },
    { name: 'SameFileError',     slug: 'samefileerror', when: 'What copying a file onto itself raises' },
    { name: 'shutil.copyfileobj', slug: 'copyfileobj',  when: 'Copy between open file objects' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Missing source or destination folder', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between shutil.copyfile and shutil.copy?',
      a: 'copyfile copies only the data and dst must be a file name. copy accepts a folder as dst (it appends the source file name) and also copies the permission bits with copymode.',
    },
    {
      q: 'Does shutil.copyfile overwrite the destination?',
      a: 'Yes. dst is opened with mode "wb", which truncates an existing file. Its permission bits are kept because the file is rewritten, not recreated. The exception is a dst that is the same file as src: that raises SameFileError instead of destroying the data.',
    },
    {
      q: 'Why do I get "IsADirectoryError" or "PermissionError: [Errno 13]" from copyfile?',
      a: 'dst names an existing folder. Linux and macOS report IsADirectoryError, Windows PermissionError. Pass the full target file name, or use shutil.copy, which copies into a folder.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.copyfile',
    meta:  'shutil.copyfile',
  },

};
