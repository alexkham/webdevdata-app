// content/reference/python/stdlib/os/remove.js

export const meta = {
  slug:        'remove',
  name:        'os.remove',
  signature:   'os.remove(path) / os.unlink(path) / os.rename(src, dst) / os.replace(src, dst) / os.renames(old, new)',
  blurb:       'Delete a file (remove / unlink) and rename or move one (rename, replace, renames). replace overwrites an existing target on every OS; rename does not on Windows.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+ (replace 3.3+)',
  searchTerms: 'os.remove remove os.unlink unlink os.rename rename os.replace replace os.renames renames delete file python rename file move file overwrite atomic replace fileexistserror filenotfounderror missing_ok',
};

export const method = {
  slug:      'remove',
  name:      'os.remove',
  signature: 'os.remove(path) / os.unlink(path) / os.rename(src, dst) / os.replace(src, dst) / os.renames(old, new)',
  returns:   { type: 'None', desc: 'They change the file system and return None, or raise an OSError subclass.' },

  category:    'os function',
  version:     'Python 3.0+ (replace 3.3+)',
  hasLiveDemo: true,

  subtitle: 'remove and unlink are the same operation: delete one file (never a folder). For renaming, prefer os.replace: it overwrites an existing destination on Linux, macOS and Windows alike, and is atomic on POSIX when both paths are on the same file system. os.rename overwrites on POSIX but raises FileExistsError on Windows.',

  covers: ['remove', 'unlink', 'rename', 'renames', 'replace'],

  cheat: {
    commonCall: "os.replace('data.json.tmp', 'data.json')",
    returns:    'None',
    replaces:   'Copy-then-delete, and remove-then-rename (which is not atomic)',
    watchOut:   'os.rename over an existing file fails on Windows; remove() never deletes folders',
  },

  parameters: [
    { name: 'path / src', type: 'str | PathLike', required: true, default: null, desc: 'The file to delete, or the file or folder to rename.' },
    { name: 'dst',        type: 'str | PathLike', required: true, default: null, desc: 'The new name. Its folder must exist (except with renames, which creates it). Moving across file systems fails — use shutil.move.' },
  ],

  modes: [
    {
      id: 'remove',
      label: 'remove',
      blurb: 'Create some files, delete one, list what is left.',
      params: [
        { name: 'files',  type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'target', type: 'str',       hint: 'file to delete',                   input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    os.remove({$target})\n    result = sorted(os.listdir('.'))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'file',    label: 'a file',       values: { files: 'a.log, b.log, keep.txt', target: 'a.log' } },
        { id: 'missing', label: 'missing file', values: { files: 'a.log', target: 'c.log' } },
        { id: 'nested',  label: 'in a folder',  values: { files: 'cache/x.bin, notes.txt', target: 'cache/x.bin' } },
      ],
    },
    {
      id: 'replace',
      label: 'replace',
      blurb: 'Each file is created with its own name as content. Replace src by dst, then list the folder and read dst.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'source',                           input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'destination',                      input: 'text' },
      ],
      template: "import os\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    with open(f, 'w') as fh:\n        fh.write(f)\nos.replace({$src}, {$dst})\nwith open({$dst}) as fh:\n    content = fh.read()\n(sorted(os.listdir('.')), content)",
      cases: [
        { id: 'rename',    label: 'new name',        values: { files: 'draft.txt', src: 'draft.txt', dst: 'final.txt' } },
        { id: 'overwrite', label: 'overwrite',       values: { files: 'new.json, data.json', src: 'new.json', dst: 'data.json' } },
        { id: 'move',      label: 'into a folder',   values: { files: 'log.txt, archive/old.txt', src: 'log.txt', dst: 'archive/log.txt' } },
      ],
    },
    {
      id: 'renames',
      label: 'renames',
      blurb: 'renames creates the folders the new name needs and removes the old folders that end up empty.',
      params: [
        { name: 'old', type: 'str', hint: 'existing file (created first)', input: 'text' },
        { name: 'new', type: 'str', hint: 'new path',                      input: 'text' },
      ],
      template: "import os\nos.makedirs(os.path.dirname({$old}) or '.', exist_ok=True)\nopen({$old}, 'w').close()\nos.renames({$old}, {$new})\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in ds + fs)",
      cases: [
        { id: 'deep', label: 'tmp → final', values: { old: 'tmp/a/report.txt', new: 'final/2026/report.txt' } },
        { id: 'flat', label: 'up a level',  values: { old: 'inbox/mail.eml', new: 'mail.eml' } },
      ],
    },
  ],
  demoExplainer: "A missing file raises FileNotFoundError on every OS. replace overwrote data.json — the listing shows one file whose content is now 'new.json'. Moving into archive/ works because the folder exists. renames made final/2026, moved the file, and removed tmp/a and tmp because they became empty. Not shown, because the result depends on the OS: os.remove on a folder raises IsADirectoryError on Linux and PermissionError on Windows, and os.rename onto an existing file replaces it on POSIX but raises FileExistsError on Windows.",

  patterns: [
    {
      name: 'Atomic save',
      desc: 'Readers see the old file or the new one, never a half-written one.',
      code: "import os\ntmp = path + '.tmp'\nwith open(tmp, 'w', encoding='utf-8') as f:\n    f.write(text)\n    f.flush()\n    os.fsync(f.fileno())\nos.replace(tmp, path)",
    },
    {
      name: 'Delete if present',
      desc: 'The os equivalent of Path.unlink(missing_ok=True).',
      code: "import contextlib, os\nwith contextlib.suppress(FileNotFoundError):\n    os.remove('cache.db')",
    },
    {
      name: 'Rename by pattern',
      desc: 'Combine listdir, splitext and replace.',
      code: "import os\nfor name in os.listdir('.'):\n    root, ext = os.path.splitext(name)\n    if ext == '.jpeg':\n        os.replace(name, root + '.jpg')",
    },
    {
      name: 'Move across drives or file systems',
      desc: 'rename/replace cannot; shutil.move falls back to copy + delete.',
      code: "import shutil\nshutil.move('/tmp/upload.bin', '/data/upload.bin')",
    },
  ],

  examples: [
    { title: 'Delete a file',                 code: "import os\nopen('a.tmp', 'w').close()\nos.remove('a.tmp')\nos.listdir('.')", returns: '[]' },
    { title: 'A missing file',                code: "import os\ntry:\n    os.remove('ghost.txt')\nexcept FileNotFoundError as e:\n    info = (type(e).__name__, e.errno)\ninfo", returns: "('FileNotFoundError', 2)" },
    { title: 'replace overwrites everywhere', code: "import os\nfor n in ['new.txt', 'old.txt']:\n    with open(n, 'w') as f:\n        f.write(n)\nos.replace('new.txt', 'old.txt')\nwith open('old.txt') as f:\n    text = f.read()\n(sorted(os.listdir('.')), text)", returns: "(['old.txt'], 'new.txt')" },
    { title: 'Move into another folder',      code: "import os\nos.mkdir('archive')\nopen('log.txt', 'w').close()\nos.rename('log.txt', 'archive/log.txt')\n(os.listdir('.'), os.listdir('archive'))", returns: "(['archive'], ['log.txt'])" },
    { title: 'renames builds and prunes folders', code: "import os\nos.makedirs('tmp/a')\nopen('tmp/a/report.txt', 'w').close()\nos.renames('tmp/a/report.txt', 'final/2026/report.txt')\nsorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in ds + fs)", returns: "['./final', './final/2026', './final/2026/report.txt']" },
    { title: 'Errors name both paths',        code: "import os\ntry:\n    os.rename('ghost.txt', 'b.txt')\nexcept FileNotFoundError as e:\n    names = (e.filename, e.filename2)\nnames", returns: "('ghost.txt', 'b.txt')" },
    { title: 'Ignore a missing file',         code: "import contextlib, os\nwith contextlib.suppress(FileNotFoundError):\n    os.remove('maybe.tmp')\n'done'", returns: "'done'" },
  ],

  pitfalls: [
    {
      name: 'os.rename onto an existing file',
      desc: 'POSIX replaces the target silently; Windows raises FileExistsError. Code that works on your Mac breaks on a Windows server.',
      wrong: { label: 'rename: OS-dependent', code: "import os\nfor n in ['new.txt', 'old.txt']:\n    with open(n, 'w') as f:\n        f.write(n)\ntry:\n    os.rename('new.txt', 'old.txt')\n    outcome = 'replaced'\nexcept FileExistsError:\n    outcome = 'FileExistsError'\noutcome == ('FileExistsError' if os.name == 'nt' else 'replaced')", output: 'True' },
      fix:   { label: 'replace: same everywhere', code: "import os\nfor n in ['new.txt', 'old.txt']:\n    with open(n, 'w') as f:\n        f.write(n)\nos.replace('new.txt', 'old.txt')\nsorted(os.listdir('.'))", output: "['old.txt']" },
    },
    {
      name: 'Deleting a folder with os.remove',
      desc: 'remove/unlink only delete files. Use rmdir for an empty folder, shutil.rmtree for a full one.',
      wrong: { label: 'os.remove(folder)', code: "import os\nos.mkdir('d')\ntry:\n    os.remove('d')\n    failed = False\nexcept OSError:\n    failed = True\nfailed", output: 'True' },
      fix:   { label: 'os.rmdir(folder)', code: "import os\nos.mkdir('d')\nos.rmdir('d')\nos.listdir('.')", output: '[]' },
    },
    {
      name: 'Delete-then-rename to update a file',
      desc: 'Between the two calls the file does not exist at all, and a crash leaves it missing. replace does it in one step.',
      wrong: { label: 'remove + rename', code: "import os\nfor n in ['cfg.new', 'cfg']:\n    open(n, 'w').close()\nos.remove('cfg')\nos.rename('cfg.new', 'cfg')\nos.listdir('.')", output: "['cfg']" },
      fix:   { label: 'replace', code: "import os\nfor n in ['cfg.new', 'cfg']:\n    open(n, 'w').close()\nos.replace('cfg.new', 'cfg')\nos.listdir('.')", output: "['cfg']" },
    },
  ],

  when: {
    use: [
      'Deleting single files (remove)',
      'Renaming or moving within one file system (replace — or rename when the target never exists)',
      'Publishing a finished file atomically (write a temp file, then replace)',
    ],
    avoid: [
      'Folders → os.rmdir (empty) or shutil.rmtree (full)',
      'Moving between disks → shutil.move',
      'Copying → shutil.copy2 / copyfile',
    ],
  },

  notes: {
    cpython:      'remove/unlink, rename and replace are C functions in Modules/posixmodule.c (unlink(2) and rename(2) on POSIX); renames is pure Python in Lib/os.py (makedirs + rename + removedirs)',
    'unlink':     'remove and unlink are two separate built-in function objects with identical behaviour; unlink is the traditional Unix name',
    'Windows':    'A file that is still open (even in your own process) cannot be removed: PermissionError, [WinError 32]',
    'Atomicity':  'The docs: if successful, replace on POSIX is an atomic operation (a POSIX requirement); the same applies to rename',
  },

  related: [
    { name: 'os.makedirs / rmdir', slug: 'makedirs', when: 'Create and delete folders' },
    { name: 'Path.rename / replace', slug: 'rename', when: 'The pathlib versions', category: 'stdlib/pathlib' },
    { name: 'Path.unlink', slug: 'mkdir', when: 'unlink(missing_ok=True)', category: 'stdlib/pathlib' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'Deleting a missing file', category: 'exceptions' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'os.rename onto a file on Windows', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I delete a file in Python?',
      a: "os.remove('file.txt') (or Path('file.txt').unlink()). It raises FileNotFoundError if the file is missing — wrap it in contextlib.suppress(FileNotFoundError) to ignore that.",
    },
    {
      q: 'What is the difference between os.rename and os.replace?',
      a: 'They are the same on Linux and macOS. On Windows, rename raises FileExistsError when the destination exists, while replace overwrites it. Use replace when you mean "overwrite".',
    },
    {
      q: 'What is the difference between os.remove and os.unlink?',
      a: 'None: two names for deleting a file, kept for Unix tradition. Neither deletes folders.',
    },
    {
      q: 'Can os.rename move a file to another folder?',
      a: 'Yes, as long as the destination folder exists and is on the same file system (same drive on Windows). Otherwise use shutil.move, which copies and deletes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.remove',
    meta:  'os.remove / unlink / rename / replace / renames',
  },
};
