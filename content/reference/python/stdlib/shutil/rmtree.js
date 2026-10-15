// content/reference/python/stdlib/shutil/rmtree.js

export const meta = {
  slug:        'rmtree',
  name:        'shutil.rmtree',
  signature:   'shutil.rmtree(path, ignore_errors=False, onerror=None, *, onexc=None, dir_fd=None)',
  blurb:       'Delete a folder and everything inside it. Errors raise, are ignored (ignore_errors=True), or go to your handler (onexc, 3.12+).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (onexc 3.12+)',
  searchTerms: 'shutil rmtree delete folder remove directory recursively python delete non empty directory rm -rf ignore_errors onexc onerror deprecated read-only files windows permissionerror avoids_symlink_attacks dir_fd',
};

export const method = {
  slug:      'rmtree',
  name:      'shutil.rmtree',
  signature: 'shutil.rmtree(path, ignore_errors=False, onerror=None, *, onexc=None, dir_fd=None)',
  returns:   { type: 'None', desc: 'Nothing; the tree is gone (or as much of it as could be removed).' },

  category:    'shutil function',
  version:     'Python 3.0+ (onexc 3.12+)',
  hasLiveDemo: true,

  subtitle: 'rm -rf for Python: files are unlinked, folders removed bottom-up, then path itself. Where the OS has fd-based calls (Linux) it walks with file descriptors, immune to symlink swaps; on Windows it uses os.walk. Nothing goes to a recycle bin.',

  covers: ['rmtree'],

  cheat: {
    commonCall: "shutil.rmtree('build')",
    returns:    'None',
    replaces:   'rm -rf build',
    watchOut:   'path must be a folder — a file raises NotADirectoryError',
  },

  parameters: [
    { name: 'path',          type: 'str | PathLike', required: true,  default: null,    desc: 'The folder to delete (not a symlink to one).' },
    { name: 'ignore_errors', type: 'bool',     required: false, default: 'False', desc: 'True: swallow every error and delete what can be deleted.' },
    { name: 'onerror',       type: 'callable', required: false, default: 'None',  desc: 'Deprecated (3.12): like onexc, but the third argument is a sys.exc_info() tuple. Ignored when onexc is given.' },
    { name: 'onexc',         type: 'callable', required: false, default: 'None',  desc: 'Called as onexc(function, path, exception) for each failure; may fix the problem and retry (3.12+).' },
    { name: 'dir_fd',        type: 'int',      required: false, default: 'None',  desc: 'path is relative to this open folder descriptor (3.11+; NotImplementedError where unsupported).' },
  ],

  modes: [
    {
      id: 'remove',
      label: 'delete a tree',
      blurb: 'Create some files, delete one path with rmtree and list everything that is left — or see which OSError you get.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'target', type: 'str',       hint: 'path to delete',                   input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    shutil.rmtree({$target})\n    result = sorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in ds + fs)\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'tree',  label: 'a folder tree', values: { files: 'build/lib/app.py, build/lib/util.py, src/app.py', target: 'build' } },
        { id: 'sub',   label: 'a sub-folder',  values: { files: 'build/lib/app.py, build/temp/x.o', target: 'build/temp' } },
        { id: 'miss',  label: 'missing',       values: { files: 'src/app.py', target: 'build' } },
        { id: 'file',  label: 'a file',        values: { files: 'notes.txt', target: 'notes.txt' } },
      ],
    },
    {
      id: 'onexc',
      label: 'onexc handler',
      blurb: 'Record every failure instead of raising: (function name, path, exception class). An empty list means everything was deleted.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'target', type: 'str',       hint: 'path to delete',                   input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\nerrors = []\nshutil.rmtree({$target}, onexc=lambda func, path, exc: errors.append((func.__name__, path, type(exc).__name__)))\n(errors, os.path.exists({$target}))",
      cases: [
        { id: 'ok',   label: 'works',   values: { files: 'cache/a.bin, cache/b.bin', target: 'cache' } },
        { id: 'miss', label: 'missing', values: { files: 'cache/a.bin', target: 'tmp' } },
        { id: 'file', label: 'a file',  values: { files: 'notes.txt', target: 'notes.txt' } },
      ],
    },
  ],
  demoExplainer: "rmtree removes the folder itself, not just its contents — build/ is gone from the listing, and deleting build/temp leaves build/lib alone. A missing path is FileNotFoundError and a file is NotADirectoryError (rmtree never deletes single files). With onexc nothing is raised: a missing path reports one failure from lstat, a file two — scandir cannot list it and rmdir cannot remove it — and the file stays.",

  patterns: [
    {
      name: 'Delete a folder if it exists',
      desc: 'Explicit check; other errors (permissions) still raise.',
      code: "import os, shutil\nif os.path.isdir('build'):\n    shutil.rmtree('build')",
    },
    {
      name: 'Read-only files on Windows',
      desc: 'Windows refuses to delete read-only files; clear the bit and retry (the documentation’s recipe).',
      code: "import os, shutil, stat\ndef remove_readonly(func, path, exc):\n    os.chmod(path, stat.S_IWRITE)\n    func(path)\nshutil.rmtree('repo-clone', onexc=remove_readonly)",
    },
    {
      name: 'Best-effort cleanup of a temp folder',
      desc: 'ignore_errors=True hides everything — fine for caches, risky elsewhere.',
      code: "import shutil\nshutil.rmtree(cache_dir, ignore_errors=True)",
    },
    {
      name: 'Support Python 3.11 and 3.12+',
      desc: 'onexc is new in 3.12; older versions only have onerror.',
      code: "import shutil, sys\nif sys.version_info >= (3, 12):\n    shutil.rmtree(path, onexc=handler)\nelse:\n    shutil.rmtree(path, onerror=lambda f, p, ei: handler(f, p, ei[1]))",
    },
  ],

  examples: [
    { title: 'Delete a non-empty folder', code: "import os, shutil\nos.makedirs('build/lib')\nopen('build/lib/a.o', 'w').close()\nshutil.rmtree('build')\nos.path.exists('build')", returns: 'False' },
    { title: 'It returns None', code: "import os, shutil\nos.makedirs('tmp')\nshutil.rmtree('tmp') is None", returns: 'True' },
    { title: 'Read-only files: clear the bit and retry', code: "import os, shutil, stat\nos.makedirs('d')\nopen('d/ro.txt', 'w').close()\nos.chmod('d/ro.txt', stat.S_IREAD)\ndef retry(func, path, exc):\n    os.chmod(path, stat.S_IWRITE)\n    func(path)\nshutil.rmtree('d', onexc=retry)\nos.path.exists('d')", returns: 'False' },
    { title: 'ignore_errors swallows a missing path', code: "import shutil\nshutil.rmtree('does-not-exist', ignore_errors=True) is None", returns: 'True' },
    { title: 'A missing path raises', code: "import shutil\ntry:\n    shutil.rmtree('does-not-exist')\nexcept FileNotFoundError as e:\n    result = e.filename\nresult", returns: "'does-not-exist'" },
    { title: 'onerror gets an exc_info tuple', code: "import shutil\nseen = []\nshutil.rmtree('nope', onerror=lambda func, path, exc_info: seen.append(exc_info[0].__name__))\nseen", returns: "['FileNotFoundError']" },
    { title: 'Symlink-attack resistance is a flag', code: "import shutil\ntype(shutil.rmtree.avoids_symlink_attacks).__name__", returns: "'bool'" },
  ],

  pitfalls: [
    {
      name: 'Deleting a single file with rmtree',
      desc: 'rmtree only handles folders. Use os.remove (os.unlink) or Path.unlink for a file.',
      wrong: { label: 'rmtree(file)', code: "import shutil\nopen('app.log', 'w').close()\ntry:\n    shutil.rmtree('app.log')\nexcept NotADirectoryError:\n    result = 'NotADirectoryError'\nresult", output: "'NotADirectoryError'" },
      fix:   { label: 'os.remove', code: "import os\nopen('app.log', 'w').close()\nos.remove('app.log')\nos.path.exists('app.log')", output: 'False' },
    },
    {
      name: 'ignore_errors=True hiding real problems',
      desc: 'It also hides a typo in the path: nothing is deleted and nothing is reported. Check the result, or handle errors with onexc.',
      wrong: { label: 'silent typo', code: "import os, shutil\nos.makedirs('build')\nshutil.rmtree('biuld', ignore_errors=True)\nos.path.exists('build')", output: 'True' },
      fix:   { label: 'let it raise', code: "import os, shutil\nos.makedirs('build')\ntry:\n    shutil.rmtree('biuld')\nexcept FileNotFoundError as e:\n    result = f'no such folder: {e.filename}'\nresult", output: "'no such folder: biuld'" },
    },
    {
      name: 'Passing both onerror and onexc',
      desc: 'When both are given, onerror is silently ignored and only onexc runs.',
      wrong: { label: 'both handlers', code: "import shutil\ncalls = []\nshutil.rmtree('nope', onerror=lambda *a: calls.append('onerror'), onexc=lambda *a: calls.append('onexc'))\ncalls", output: "['onexc']" },
      fix:   { label: 'onexc only', code: "import shutil\ncalls = []\nshutil.rmtree('nope', onexc=lambda func, path, exc: calls.append(type(exc).__name__))\ncalls", output: "['FileNotFoundError']" },
    },
  ],

  when: {
    use: [
      'Deleting build output, caches, temp folders, test fixtures',
      'Any folder that is not empty',
    ],
    avoid: [
      'A single file → os.remove / Path.unlink',
      'An empty folder → os.rmdir / Path.rmdir (it refuses to delete content by accident)',
      'Anything a user might want back → move it to a trash folder instead',
    ],
  },

  notes: {
    cpython:       'Lib/shutil.py: _rmtree_safe_fd (an explicit stack of os.open / os.scandir / os.unlink / os.rmdir with dir_fd) where the OS supports fd-based calls, else _rmtree_unsafe on os.walk(topdown=False)',
    'Platforms':   'rmtree.avoids_symlink_attacks tells which version you get: True on Linux, False on Windows',
    '3.13':        'FileNotFoundError is now ignored for everything but the top-level path — a file deleted by someone else halfway through is no longer an error',
    'onexc vs onerror': 'onerror receives (type, value, traceback); onexc receives the exception itself. onerror is deprecated since 3.12 (documentation only — no warning is emitted in 3.13)',
  },

  related: [
    { name: 'os.remove / os.rmdir', slug: 'remove',   when: 'One file / one empty folder', category: 'stdlib/os' },
    { name: 'os.walk',              slug: 'walk',     when: 'What the portable version walks with', category: 'stdlib/os' },
    { name: 'shutil.copytree',      slug: 'copytree', when: 'The opposite: copy a tree' },
    { name: 'shutil.move',          slug: 'move',     when: 'Uses rmtree after copying a folder across file systems' },
    { name: 'PermissionError',      slug: 'permissionerror', when: 'Read-only or locked files', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I delete a non-empty folder in Python?',
      a: "shutil.rmtree('folder'). os.rmdir and Path.rmdir only remove empty folders and raise OSError: Directory not empty otherwise.",
    },
    {
      q: 'Why does shutil.rmtree fail with PermissionError on Windows?',
      a: "Usually a read-only file (common in .git folders) or a file still open in some program. For read-only files, pass onexc= a function that calls os.chmod(path, stat.S_IWRITE) and then retries func(path). Open files must be closed first.",
    },
    {
      q: 'What is the difference between onerror and onexc?',
      a: 'Both are called as handler(function, path, error). onexc (Python 3.12+) gets the exception object; the older onerror gets a sys.exc_info() tuple (type, value, traceback). onerror is deprecated, and if you pass both only onexc is used.',
    },
    {
      q: 'Does shutil.rmtree follow symlinks?',
      a: 'No. Calling it on a symlink to a folder raises OSError: Cannot call rmtree on a symbolic link, and symlinks inside the tree are removed as links — their targets are left alone.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.rmtree',
    meta:  'shutil.rmtree',
  },

};
