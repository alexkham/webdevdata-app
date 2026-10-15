// content/reference/python/stdlib/shutil/move.js

export const meta = {
  slug:        'move',
  name:        'shutil.move',
  signature:   'shutil.move(src, dst, copy_function=copy2)',
  blurb:       'Move a file or folder: into dst if dst is an existing folder, otherwise to the name dst. A rename when possible, copy-then-delete across file systems. Returns the new path.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'shutil move move file python move folder rename file across drives mv command destination path already exists shutil.error cannot move a directory into itself copy_function os.rename invalid cross-device link',
};

export const method = {
  slug:      'move',
  name:      'shutil.move',
  signature: 'shutil.move(src, dst, copy_function=copy2)',
  returns:   { type: 'str', desc: 'The final path (dst, or dst joined with the source name when dst is a folder).' },

  category:    'shutil function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Python’s mv. First os.rename; if that fails (another disk, a cross-device link), copy with copy_function — copytree for folders — and delete the source. A dst that is an existing folder receives src inside it, and the name there must be free.',

  covers: ['move'],

  cheat: {
    commonCall: "shutil.move('report.pdf', 'archive/')",
    returns:    "'archive/report.pdf' — the final path",
    replaces:   'mv src dst; os.rename that fails across drives',
    watchOut:   'If dst/name already exists you get shutil.Error, not an overwrite',
  },

  parameters: [
    { name: 'src',           type: 'str | PathLike', required: true,  default: null,    desc: 'The file or folder to move.' },
    { name: 'dst',           type: 'str | PathLike', required: true,  default: null,    desc: 'An existing folder to move into, or the new path. An existing file at that path may be replaced.' },
    { name: 'copy_function', type: 'callable',       required: false, default: 'copy2', desc: 'Used only when a rename is impossible: copies a file (or, through copytree, every file of a folder).' },
  ],

  modes: [
    {
      id: 'move',
      label: 'move',
      blurb: 'Create some files, move a file or folder and see the returned path and every file afterwards — or the OSError you get.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'what to move',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'folder or new path',               input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    moved = shutil.move({$src}, {$dst})\n    result = (moved.replace(os.sep, '/'), sorted(os.path.join(r, n).replace(os.sep, '/') for r, ds, fs in os.walk('.') for n in fs))\nexcept OSError as e:\n    result = type(e).__name__\nresult",
      cases: [
        { id: 'rename', label: 'rename',            values: { files: 'draft.txt', src: 'draft.txt', dst: 'final.txt' } },
        { id: 'into',   label: 'into a folder',     values: { files: 'report.pdf, archive/2025.pdf', src: 'report.pdf', dst: 'archive' } },
        { id: 'folder', label: 'folder into folder', values: { files: 'drafts/a.md, archive/old.md', src: 'drafts', dst: 'archive' } },
        { id: 'taken',  label: 'name taken',        values: { files: 'report.pdf, archive/report.pdf', src: 'report.pdf', dst: 'archive' } },
        { id: 'over',   label: 'replace a file',    values: { files: 'new.cfg, app.cfg', src: 'new.cfg', dst: 'app.cfg' } },
      ],
    },
    {
      id: 'message',
      label: 'shutil.Error text',
      blurb: 'The two messages move raises itself, with the path separator normalized.',
      params: [
        { name: 'files', type: 'list[str]', hint: 'files to create, comma-separated', input: 'csv' },
        { name: 'src',   type: 'str',       hint: 'what to move',                     input: 'text' },
        { name: 'dst',   type: 'str',       hint: 'folder or new path',               input: 'text' },
      ],
      template: "import os, shutil\nfor f in {$files}:\n    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)\n    open(f, 'w').close()\ntry:\n    result = shutil.move({$src}, {$dst}).replace(os.sep, '/')\nexcept shutil.Error as e:\n    result = str(e).replace(os.sep, '/')\nresult",
      cases: [
        { id: 'taken',  label: 'name taken',      values: { files: 'report.pdf, archive/report.pdf', src: 'report.pdf', dst: 'archive' } },
        { id: 'itself', label: 'into itself',     values: { files: 'docs/guide.md', src: 'docs', dst: 'docs/old' } },
        { id: 'ok',     label: 'works',           values: { files: 'docs/guide.md', src: 'docs', dst: 'manual' } },
      ],
    },
  ],
  demoExplainer: "Moving into an existing folder keeps the name (archive/report.pdf) and moves folders whole (archive/drafts/a.md). If that name is taken, move refuses with shutil.Error — but a plain file path as dst is simply replaced (new.cfg became app.cfg). A folder cannot go inside itself: the rename fails, and move reports Cannot move a directory 'docs' into itself 'docs/old'. instead of starting an endless copy.",

  patterns: [
    {
      name: 'Move into a folder, creating it first',
      desc: 'move does not create missing folders for files.',
      code: "import os, shutil\nos.makedirs('processed', exist_ok=True)\nshutil.move('inbox/order-17.json', 'processed')",
    },
    {
      name: 'Overwrite an existing file in the target folder',
      desc: 'Give the full target path; a file there is replaced — by the rename on Linux and macOS, by copy_function plus deleting the source on Windows, where os.rename refuses to overwrite.',
      code: "import os, shutil\nshutil.move(src, os.path.join('archive', os.path.basename(src)))",
    },
    {
      name: 'Move across disks without copying metadata',
      desc: 'copy_function is only used when the rename fails.',
      code: "import shutil\nshutil.move('/data/big.iso', '/mnt/usb/', copy_function=shutil.copy)",
    },
  ],

  examples: [
    { title: 'Rename a file', code: "import shutil\nopen('draft.txt', 'w').close()\nshutil.move('draft.txt', 'final.txt')", returns: "'final.txt'" },
    { title: 'Into a folder', code: "import os, shutil\nos.mkdir('archive')\nopen('a.txt', 'w').close()\nshutil.move('a.txt', 'archive').replace(os.sep, '/')", returns: "'archive/a.txt'" },
    { title: 'Folders move whole', code: "import os, shutil\nos.makedirs('a/b')\nshutil.move('a', 'z')\nos.listdir('z')", returns: "['b']" },
    { title: 'An existing file is replaced', code: "import shutil\nfrom pathlib import Path\nPath('new.txt').write_text('new')\nPath('old.txt').write_text('old content')\nshutil.move('new.txt', 'old.txt')\nPath('old.txt').read_text()", returns: "'new'" },
    { title: 'A folder onto itself returns None', code: "import os, shutil\nos.mkdir('docs')\nshutil.move('docs', 'docs') is None", returns: 'True' },
    { title: 'For folders, missing parents appear', code: "import os, shutil\nos.makedirs('dir/sub')\nshutil.move('dir', 'new/place')\nos.listdir('new/place')", returns: "['sub']" },
  ],

  pitfalls: [
    {
      name: 'Moving into a folder that already has that name',
      desc: 'With a folder as dst, move refuses to replace dst/name. Pass the full target path if replacing is what you want.',
      wrong: { label: 'folder as dst', code: "import os, shutil\nos.mkdir('archive')\nopen('archive/report.txt', 'w').close()\nopen('report.txt', 'w').close()\ntry:\n    shutil.move('report.txt', 'archive')\nexcept shutil.Error as e:\n    result = str(e).replace(os.sep, '/')\nresult", output: "\"Destination path 'archive/report.txt' already exists\"" },
      fix:   { label: 'full target path', code: "import os, shutil\nos.mkdir('archive')\nopen('archive/report.txt', 'w').close()\nopen('report.txt', 'w').close()\nshutil.move('report.txt', 'archive/report.txt')\n(os.listdir('archive'), os.path.exists('report.txt'))", output: "(['report.txt'], False)" },
    },
    {
      name: 'Expecting the target folder to be created for a file',
      desc: 'A file’s destination folder must exist (folders, oddly, get missing parents through the copytree fallback). Create it first.',
      wrong: { label: 'no folder', code: "import shutil\nopen('a.txt', 'w').close()\ntry:\n    shutil.move('a.txt', 'out/a.txt')\nexcept FileNotFoundError:\n    result = 'FileNotFoundError'\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'makedirs first', code: "import os, shutil\nopen('a.txt', 'w').close()\nos.makedirs('out', exist_ok=True)\nshutil.move('a.txt', 'out/a.txt')", output: "'out/a.txt'" },
    },
  ],

  when: {
    use: [
      'Moving or renaming files and folders, also between disks',
      'Organizing files into existing folders (mv-style)',
    ],
    avoid: [
      'Atomically replacing a file on the same disk → os.replace',
      'You need to know whether data was copied or just renamed → os.rename and handle OSError yourself',
    ],
  },

  notes: {
    cpython:        'Lib/shutil.py: if isdir(dst): real_dst = join(dst, _basename(src)) (an existing one raises Error); try os.rename(src, real_dst); on OSError: symlink → recreate it, folder → copytree(symlinks=True) + rmtree, file → copy_function + os.unlink',
    'Same folder':  'If dst is a folder and the same one as src (e.g. move(d, d)), move only calls os.rename(src, dst) and returns None — useful for case-only renames on case-insensitive file systems',
    'Platforms':    'On Linux a dst with a trailing slash that is not an existing folder fails (FileNotFoundError: Directory does not exist: newdir/); on Windows the same call created a file named newdir',
  },

  related: [
    { name: 'os.rename / os.replace', slug: 'remove',   when: 'Same-disk renames, atomic replace', category: 'stdlib/os' },
    { name: 'shutil.copytree',        slug: 'copytree', when: 'What moves a folder across disks' },
    { name: 'shutil.Error',           slug: 'error',    when: 'Name taken / folder into itself' },
    { name: 'Path.rename / replace',  slug: 'rename',   when: 'The pathlib equivalents (same disk only)', category: 'stdlib/pathlib' },
  ],

  faq: [
    {
      q: 'What is the difference between shutil.move and os.rename?',
      a: 'os.rename only works within one file system and fails with OSError (Invalid cross-device link on Linux) otherwise. shutil.move tries os.rename first and falls back to copying and deleting, so it also works across disks. move also moves into an existing folder; os.rename does not.',
    },
    {
      q: 'How do I fix "shutil.Error: Destination path ... already exists"?',
      a: 'dst is a folder that already contains an item with the source name. Either delete or rename that item first, or pass the full target path (folder/name) — then an existing file is replaced.',
    },
    {
      q: 'Does shutil.move overwrite files?',
      a: 'When dst is a file path: yes. On Linux and macOS the rename replaces it, like os.replace; on Windows os.rename refuses to overwrite (FileExistsError), so move falls back to copy_function and then deletes the source — as it does across disks everywhere. When dst is a folder that already contains the same name: no — it raises shutil.Error.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.move',
    meta:  'shutil.move',
  },

};
