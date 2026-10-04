// content/reference/python/stdlib/os/makedirs.js

export const meta = {
  slug:        'makedirs',
  name:        'os.makedirs',
  signature:   'os.makedirs(name, mode=0o777, exist_ok=False) / os.mkdir(path, mode=0o777, *, dir_fd=None) / os.rmdir(path) / os.removedirs(name)',
  blurb:       'Create folders: mkdir makes one level, makedirs makes every missing parent too (exist_ok=True: no error if it is already there). rmdir and removedirs delete empty folders.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (exist_ok 3.2+)',
  searchTerms: 'os.makedirs makedirs os.mkdir mkdir os.rmdir rmdir os.removedirs removedirs create directory python create folder if not exists exist_ok mkdir -p nested directories delete empty directory fileexistserror',
};

export const method = {
  slug:      'makedirs',
  name:      'os.makedirs',
  signature: 'os.makedirs(name, mode=0o777, exist_ok=False) / os.mkdir(path, mode=0o777, *, dir_fd=None) / os.rmdir(path) / os.removedirs(name)',
  returns:   { type: 'None', desc: 'All four change the file system and return None, or raise an OSError subclass.' },

  category:    'os function',
  version:     'Python 3.0+ (exist_ok 3.2+)',
  hasLiveDemo: true,

  subtitle: "os.makedirs(path, exist_ok=True) is 'mkdir -p': it creates every missing level and is happy if the folder already exists. os.mkdir creates exactly one level and fails if the parent is missing or the name is taken. To delete, rmdir removes one empty folder and removedirs also prunes the parents that become empty.",

  covers: ['makedirs', 'mkdir', 'removedirs', 'rmdir'],

  cheat: {
    commonCall: "os.makedirs('build/reports', exist_ok=True)",
    returns:    'None',
    replaces:   'if not os.path.exists(p): os.mkdir(p) — and recursive mkdir code',
    watchOut:   'exist_ok=True still raises if the name exists as a file',
  },

  parameters: [
    { name: 'name',     type: 'str | PathLike', required: true,  default: null,    desc: 'The folder to create (makedirs: with all its parents).' },
    { name: 'mode',     type: 'int',  required: false, default: '0o777', desc: 'Permission bits, reduced by the umask. Since 3.7 makedirs applies it only to the last folder; parents get the default.' },
    { name: 'exist_ok', type: 'bool', required: false, default: 'False', desc: 'makedirs only: True means "no error if the folder already exists" — but a file of that name still raises FileExistsError.' },
  ],

  modes: [
    {
      id: 'mkdir',
      label: 'mkdir',
      blurb: 'Create some folders first, then try os.mkdir on one path.',
      params: [
        { name: 'existing', type: 'list[str]', hint: 'folders that already exist', input: 'csv' },
        { name: 'path',     type: 'str',       hint: 'folder to create',           input: 'text' },
      ],
      template: "import os\nfor d in {$existing}:\n    os.makedirs(d)\ntry:\n    os.mkdir({$path})\n    result = 'created'\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'new',    label: 'new level',      values: { existing: 'logs', path: 'logs/2026' } },
        { id: 'taken',  label: 'already exists', values: { existing: 'logs', path: 'logs' } },
        { id: 'nested', label: 'missing parent', values: { existing: 'logs', path: 'data/raw' } },
      ],
    },
    {
      id: 'makedirs',
      label: 'makedirs',
      blurb: 'The same path through makedirs, first without and then with exist_ok=True.',
      params: [
        { name: 'existing', type: 'list[str]', hint: 'folders that already exist', input: 'csv' },
        { name: 'path',     type: 'str',       hint: 'folder to create',           input: 'text' },
      ],
      template: "import os\nfor d in {$existing}:\n    os.makedirs(d)\ntry:\n    os.makedirs({$path})\n    plain = 'created'\nexcept OSError as e:\n    plain = type(e).__name__\nos.makedirs({$path}, exist_ok=True)\n(plain, os.path.isdir({$path}))",
      cases: [
        { id: 'nested', label: 'nested, new',    values: { existing: 'logs', path: 'data/raw/2026' } },
        { id: 'taken',  label: 'already exists', values: { existing: 'data/raw', path: 'data/raw' } },
      ],
    },
    {
      id: 'removedirs',
      label: 'removedirs',
      blurb: 'Create a folder chain and some files, then removedirs the deepest folder: it climbs up while folders become empty.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'path',  type: 'str',       hint: 'folder chain to create and remove', input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nos.makedirs({$path}, exist_ok=True)\nos.removedirs({$path})\nsorted(os.listdir('.'))",
      cases: [
        { id: 'all',  label: 'all empty',        values: { files: 'README.md', path: 'a/b/c' } },
        { id: 'stop', label: 'stops at a file',  values: { files: 'README.md, a/keep.txt', path: 'a/b/c' } },
      ],
    },
  ],
  demoExplainer: "mkdir fails with FileExistsError when the name is taken and FileNotFoundError when a parent is missing — makedirs creates the parents. Without exist_ok, makedirs also raises FileExistsError for an existing folder; with exist_ok=True the second call is silent. removedirs deletes a/b/c, then tries b, then a, and stops quietly at the first folder that is not empty (a still holds keep.txt). The class names are the same on every OS; the error messages differ (\"[Errno 17] File exists\" on Linux, \"[WinError 183] …\" on Windows).",

  patterns: [
    {
      name: 'Ensure an output folder',
      desc: 'Idempotent, no race between check and create.',
      code: "import os\nos.makedirs(os.path.join('out', 'reports'), exist_ok=True)",
    },
    {
      name: 'Ensure the folder for a file',
      desc: "dirname is '' for a bare file name — guard it.",
      code: "import os\nfolder = os.path.dirname(target)\nif folder:\n    os.makedirs(folder, exist_ok=True)",
    },
    {
      name: 'Create only if new (claim a name)',
      desc: 'mkdir is atomic: exactly one process wins.',
      code: "import os\ntry:\n    os.mkdir('lockdir')\nexcept FileExistsError:\n    print('someone else is running')",
    },
    {
      name: 'Remove a folder with contents',
      desc: 'rmdir and removedirs refuse non-empty folders; shutil does the whole tree.',
      code: "import shutil\nshutil.rmtree('build', ignore_errors=True)",
    },
  ],

  examples: [
    { title: 'makedirs creates the whole chain', code: "import os\nos.makedirs('a/b/c')\nos.path.isdir('a/b/c')", returns: 'True' },
    { title: 'exist_ok=True: a second call is fine', code: "import os\nos.makedirs('logs', exist_ok=True)\nos.makedirs('logs', exist_ok=True)\nos.listdir('.')", returns: "['logs']" },
    { title: 'mkdir needs the parent',        code: "import os\ntry:\n    os.mkdir('x/y')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
    { title: 'Existing folder without exist_ok', code: "import os\nos.mkdir('data')\ntry:\n    os.makedirs('data')\nexcept FileExistsError as e:\n    result = (type(e).__name__, e.errno)\nresult", returns: "('FileExistsError', 17)" },
    { title: 'rmdir only removes empty folders', code: "import os\nos.makedirs('d/sub')\ntry:\n    os.rmdir('d')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'OSError'" },
    { title: 'removedirs prunes empty parents', code: "import os\nos.makedirs('a/b/c')\nos.removedirs('a/b/c')\nos.listdir('.')", returns: '[]' },
    { title: 'A trailing slash is fine',      code: "import os\nos.makedirs('out/reports/', exist_ok=True)\nos.path.isdir('out/reports')", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'exist_ok does not cover a file with that name',
      desc: 'exist_ok only forgives an existing folder. If a file has the name, makedirs still raises FileExistsError.',
      wrong: { label: 'name taken by a file', code: "import os\nopen('output', 'w').close()\ntry:\n    os.makedirs('output', exist_ok=True)\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileExistsError'" },
      fix:   { label: 'check what is there', code: "import os\nopen('output', 'w').close()\nif os.path.isfile('output'):\n    os.replace('output', 'output.old')\nos.makedirs('output', exist_ok=True)\nos.path.isdir('output')", output: 'True' },
    },
    {
      name: 'Using mkdir for nested folders',
      desc: 'mkdir creates one level only.',
      wrong: { label: "mkdir('a/b/c')", code: "import os\ntry:\n    os.mkdir('a/b/c')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: "makedirs('a/b/c')", code: "import os\nos.makedirs('a/b/c')\nos.path.isdir('a/b/c')", output: 'True' },
    },
    {
      name: 'Calling makedirs on a bare file name\'s folder',
      desc: "os.path.dirname('report.txt') is '', and makedirs('') raises FileNotFoundError. Use 'or \".\"' or skip the call.",
      wrong: { label: "makedirs('')", code: "import os\ntry:\n    os.makedirs(os.path.dirname('report.txt'), exist_ok=True)\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: "or '.'", code: "import os\nos.makedirs(os.path.dirname('report.txt') or '.', exist_ok=True)\nos.path.isdir('.')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Making sure a folder exists before writing into it (makedirs, exist_ok=True)',
      'Atomically claiming a name (mkdir raises if it exists)',
      'Removing empty folders (rmdir, removedirs)',
    ],
    avoid: [
      'Deleting non-empty folders → shutil.rmtree',
      'Temporary folders → tempfile.TemporaryDirectory / mkdtemp',
      'Object paths → Path.mkdir(parents=True, exist_ok=True)',
    ],
  },

  notes: {
    cpython:      'mkdir and rmdir are C calls (Modules/posixmodule.c); makedirs and removedirs are short pure-Python functions in Lib/os.py built on split, exists, mkdir and rmdir',
    'mode':       'Ignored on Windows, apart from mode 0o700, which since 3.13 limits access to the current user and administrators. On POSIX the umask is masked out first',
    'exist_ok':   'Added in 3.2; since 3.4.1 makedirs no longer raises when mode differs from the existing folder',
    'removedirs': 'Errors while pruning parents are ignored — they simply mean the parent was not empty',
  },

  related: [
    { name: 'os.remove / rename / replace', slug: 'remove', when: 'Delete and move files' },
    { name: 'os.listdir', slug: 'listdir', when: 'See what a folder holds' },
    { name: 'Path.mkdir', slug: 'mkdir', when: 'parents=True, exist_ok=True in pathlib', category: 'stdlib/pathlib' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'What mkdir raises for a taken name', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I create a directory only if it does not exist?',
      a: "os.makedirs(path, exist_ok=True). It creates any missing parents too, and it avoids the race of checking os.path.exists first.",
    },
    {
      q: 'What is the difference between os.mkdir and os.makedirs?',
      a: 'mkdir creates exactly one folder and needs its parent to exist. makedirs creates every missing folder along the path, like mkdir -p, and has exist_ok.',
    },
    {
      q: 'How do I delete a non-empty folder?',
      a: "os.rmdir and os.removedirs only delete empty folders (they raise OSError otherwise). Use shutil.rmtree(path).",
    },
    {
      q: 'Why does makedirs raise FileExistsError even with exist_ok=True?',
      a: 'Because something that is not a folder — usually a file — already has that name. exist_ok only accepts an existing directory.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.makedirs',
    meta:  'os.makedirs / mkdir / rmdir / removedirs',
  },
};
