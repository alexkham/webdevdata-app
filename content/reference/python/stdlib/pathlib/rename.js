// content/reference/python/stdlib/pathlib/rename.js

export const meta = {
  slug:        'rename',
  name:        'Path.rename',
  signature:   'Path.rename(target) / Path.replace(target)',
  blurb:       'Move or rename a file or folder and get the new Path back. replace() overwrites an existing target on every OS; rename() does so only on POSIX.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (return value 3.8+)',
  searchTerms: 'Path.rename rename replace Path.replace move file python pathlib rename file overwrite existing file FileExistsError windows atomic replace os.rename os.replace',
};

export const method = {
  slug:      'rename',
  name:      'Path.rename',
  signature: 'Path.rename(target) / Path.replace(target)',
  returns:   { type: 'Path', desc: 'A new Path for target (3.8+). The original Path object still names the old location.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (return value 3.8+)',
  hasLiveDemo: true,

  subtitle: 'Both call the OS rename. The difference is an existing target: replace() always overwrites it (os.replace); rename() raises FileExistsError on Windows but silently overwrites on Linux and macOS (os.rename). A relative target is relative to the current directory, not to the file.',

  covers: ['Path.rename', 'Path.replace'],

  cheat: {
    commonCall: "p.replace(p.with_suffix('.bak'))",
    returns:    'the new Path',
    replaces:   'os.rename / os.replace',
    watchOut:   "Path('dir/a.txt').rename('b.txt') moves the file OUT of dir",
  },

  parameters: [
    { name: 'target', type: 'str | os.PathLike', required: true, default: null, desc: 'New location. Relative targets are resolved against the current working directory.' },
  ],

  modes: [
    {
      id: 'rename',
      label: 'rename',
      blurb: "draft.txt is created with the text 'v1', then renamed.",
      params: [{ name: 'target', type: 'str', hint: 'new name', input: 'text' }],
      template: "from pathlib import Path\nPath('draft.txt').write_text('v1', encoding='utf-8')\nnew = Path('draft.txt').rename({$target})\n(new.as_posix(), Path('draft.txt').exists(), new.read_text(encoding='utf-8'))",
      cases: [
        { id: 'name', label: 'new name',      values: { target: 'final.txt' } },
        { id: 'ext',  label: 'new extension', values: { target: 'draft.md' } },
        { id: 'same', label: 'same name',     values: { target: 'draft.txt' } },
      ],
    },
  ],
  demoExplainer: "rename() returns a Path for the target; the old name no longer exists. Renaming a file to its own name is allowed and changes nothing. Moving into a folder that does not exist raises FileNotFoundError (its message is OS-specific, so it is not shown here).",

  patterns: [
    {
      name: 'Rename within the same folder',
      desc: 'Build the target from the original so it stays next to it.',
      code: "from pathlib import Path\np = Path('photos/IMG_0042.jpg')\np.rename(p.with_name('cat.jpg'))",
    },
    {
      name: 'Atomic file update',
      desc: 'Write a temp file, then replace() the real one — readers see old or new, never half.',
      code: "from pathlib import Path\ntarget = Path('state.json')\ntmp = target.with_name(target.name + '.tmp')\ntmp.write_text(data, encoding='utf-8')\ntmp.replace(target)",
    },
    {
      name: 'Move a file into another folder',
      desc: 'Join the folder with the file name.',
      code: "from pathlib import Path\nsrc = Path('inbox/invoice.pdf')\nsrc.replace(Path('archive') / src.name)",
    },
  ],

  examples: [
    { title: 'Rename and get the new path',  code: "from pathlib import Path\nPath('old.txt').touch()\nPath('old.txt').rename('new.txt').name", returns: "'new.txt'" },
    { title: 'The old name is gone',         code: "from pathlib import Path\nPath('old.txt').touch()\nPath('old.txt').rename('new.txt')\n(Path('old.txt').exists(), Path('new.txt').exists())", returns: '(False, True)' },
    { title: 'replace() overwrites',         code: "from pathlib import Path\nPath('a.txt').write_text('A', encoding='utf-8')\nPath('b.txt').write_text('B', encoding='utf-8')\nPath('a.txt').replace('b.txt')\nPath('b.txt').read_text(encoding='utf-8')", returns: "'A'" },
    { title: 'Move into a folder',           code: "from pathlib import Path\nPath('archive').mkdir()\nPath('report.pdf').touch()\nPath('report.pdf').replace(Path('archive') / 'report.pdf').as_posix()", returns: "'archive/report.pdf'" },
    { title: 'Folders can be renamed too',   code: "from pathlib import Path\nPath('build').mkdir()\nPath('build').rename('dist').is_dir()", returns: 'True' },
    { title: 'Missing source',               code: "from pathlib import Path\ntry:\n    Path('ghost.txt').rename('x.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Relative targets are relative to the cwd',
      desc: "The target is not interpreted relative to the file's folder, so a bare name moves the file up to the current directory.",
      wrong: { label: "rename('b.txt')", code: "from pathlib import Path\nPath('docs').mkdir()\nPath('docs/a.txt').touch()\nPath('docs/a.txt').rename('b.txt').as_posix()", output: "'b.txt'" },
      fix:   { label: 'with_name()', code: "from pathlib import Path\nPath('docs').mkdir()\nPath('docs/a.txt').touch()\np = Path('docs/a.txt')\np.rename(p.with_name('b.txt')).as_posix()", output: "'docs/b.txt'" },
    },
    {
      name: 'Using rename() to overwrite portably',
      desc: 'On Windows rename() refuses an existing target, on POSIX it overwrites — replace() behaves the same everywhere.',
      wrong: { label: 'rename (OS-dependent)', code: "import os\nfrom pathlib import Path\nPath('a').touch()\nPath('b').touch()\ntry:\n    Path('a').rename('b')\n    result = 'overwritten'\nexcept FileExistsError:\n    result = 'FileExistsError'\nresult == ('FileExistsError' if os.name == 'nt' else 'overwritten')", output: 'True' },
      fix:   { label: 'replace (same everywhere)', code: "from pathlib import Path\nPath('a').write_text('new', encoding='utf-8')\nPath('b').write_text('old', encoding='utf-8')\nPath('a').replace('b')\nPath('b').read_text(encoding='utf-8')", output: "'new'" },
    },
    {
      name: 'Still using the old Path object',
      desc: 'Path objects are just names. After rename, the original object points at a location that is now empty — use the return value.',
      wrong: { label: 'old object', code: "from pathlib import Path\np = Path('v1.txt')\np.touch()\np.rename('v2.txt')\np.exists()", output: 'False' },
      fix:   { label: 'returned object', code: "from pathlib import Path\np = Path('v1.txt')\np.touch()\np = p.rename('v2.txt')\np.exists()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Renaming or moving within one file system',
      'Atomic updates: write a temp file, then replace()',
    ],
    avoid: [
      'Moving across drives / file systems → shutil.move (rename fails with OSError there)',
      'Copying → shutil.copy2 (Path.copy arrives in 3.14)',
    ],
  },

  notes: {
    cpython:         'Lib/pathlib/_local.py: os.rename(self, target) / os.replace(self, target), then return self.with_segments(target)',
    'Overwrite':     'replace: always. rename: POSIX yes (for files), Windows no — FileExistsError',
    'Across devices': 'Both fail when source and target are on different file systems; shutil.move copies and deletes instead',
    'Changed in 3.8': 'Both return the new Path instead of None',
  },

  related: [
    { name: 'with_suffix / with_name', slug: 'with_suffix', when: 'Build the new name' },
    { name: 'mkdir / unlink',          slug: 'mkdir',       when: 'Create the target folder, delete instead' },
    { name: 'exists',                  slug: 'exists',      when: 'Check the result' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'rename() onto an existing file on Windows', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I rename a file with pathlib?',
      a: "p.rename(p.with_name('new-name.txt')) — building the target from p keeps the file in the same folder. The method returns the new Path.",
    },
    {
      q: 'What is the difference between rename and replace?',
      a: 'Both move the file. replace() overwrites an existing target on every OS. rename() overwrites on Linux/macOS but raises FileExistsError on Windows.',
    },
    {
      q: 'How do I move a file to another folder?',
      a: "p.replace(folder / p.name) on the same file system; shutil.move(p, folder) when the folders may be on different drives.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.Path.rename',
    meta:  'Path.rename / replace',
  },
};
