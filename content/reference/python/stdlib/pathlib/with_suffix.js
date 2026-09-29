// content/reference/python/stdlib/pathlib/with_suffix.js

export const meta = {
  slug:        'with_suffix',
  name:        'PurePath.with_suffix',
  signature:   'PurePath.with_suffix(suffix) / .with_stem(stem) / .with_name(name)',
  blurb:       'Return a new path with the extension, the stem or the whole file name replaced. The original path is unchanged.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.4+ (with_stem 3.9+)',
  searchTerms: 'PurePath.with_suffix with_suffix with_stem with_name PurePath.with_name PurePath.with_stem change file extension python rename extension replace suffix remove extension invalid suffix has an empty name',
};

export const method = {
  slug:      'with_suffix',
  name:      'PurePath.with_suffix',
  signature: 'PurePath.with_suffix(suffix) / .with_stem(stem) / .with_name(name)',
  returns:   { type: 'PurePath', desc: 'A new path of the same class; only the last component differs.' },

  category:    'pathlib method',
  version:     'Python 3.4+ (with_stem 3.9+)',
  hasLiveDemo: true,

  subtitle: 'The three with_* methods rewrite the final component: with_suffix swaps (or adds, or removes) the extension, with_stem keeps the extension, with_name replaces everything after the last slash. They are pure — nothing is renamed on disk.',

  covers: ['PurePath.with_name'],

  cheat: {
    commonCall: "p.with_suffix('.webp')",
    returns:    'a new path — pass it to rename() to actually move a file',
    replaces:   'os.path.splitext(p)[0] + ".webp"',
    watchOut:   "the suffix needs its dot: with_suffix('gz') is a ValueError",
  },

  parameters: [
    { name: 'suffix', type: 'str', required: true, default: null, desc: "with_suffix: '' removes the last suffix; otherwise it must start with '.' and be longer than one character." },
    { name: 'stem',   type: 'str', required: true, default: null, desc: 'with_stem: the new stem; the current suffix is appended.' },
    { name: 'name',   type: 'str', required: true, default: null, desc: "with_name: the complete new last component; must not be empty, '.', or contain a separator." },
  ],

  modes: [
    {
      id: 'suffix',
      label: 'with_suffix',
      blurb: 'Replace the last suffix, add one, or remove it with an empty string.',
      params: [
        { name: 'path',   type: 'str', hint: 'a path',     input: 'text' },
        { name: 'suffix', type: 'str', hint: 'new suffix', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).with_suffix({$suffix})',
      cases: [
        { id: 'swap',   label: 'swap',          values: { path: 'photos/cat.jpeg', suffix: '.webp' } },
        { id: 'add',    label: 'add',           values: { path: 'README', suffix: '.md' } },
        { id: 'remove', label: 'remove',        values: { path: 'notes.txt', suffix: '' } },
        { id: 'targz',  label: 'last one only', values: { path: 'site.tar.gz', suffix: '.zip' } },
        { id: 'nodot',  label: 'missing dot',   values: { path: 'notes.txt', suffix: 'md' } },
        { id: 'root',   label: 'no name',       values: { path: '/', suffix: '.md' } },
      ],
    },
    {
      id: 'stem',
      label: 'with_stem',
      blurb: 'Change the stem and keep the extension.',
      params: [
        { name: 'path', type: 'str', hint: 'a path',   input: 'text' },
        { name: 'stem', type: 'str', hint: 'new stem', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).with_stem({$stem})',
      cases: [
        { id: 'plain', label: 'rename stem', values: { path: 'reports/q3.pdf', stem: 'q3-final' } },
        { id: 'empty', label: 'empty stem',  values: { path: 'reports/q3.pdf', stem: '' } },
      ],
    },
    {
      id: 'name',
      label: 'with_name',
      blurb: 'Replace the whole last component.',
      params: [
        { name: 'path', type: 'str', hint: 'a path',   input: 'text' },
        { name: 'name', type: 'str', hint: 'new name', input: 'text' },
      ],
      template: 'from pathlib import PurePosixPath\nPurePosixPath({$path}).with_name({$name})',
      cases: [
        { id: 'plain', label: 'new name',       values: { path: '/etc/nginx/nginx.conf', name: 'mime.types' } },
        { id: 'sep',   label: 'with a slash',   values: { path: '/etc/nginx/nginx.conf', name: 'conf.d/x.conf' } },
        { id: 'root',  label: 'no name',        values: { path: '/', name: 'x' } },
      ],
    },
  ],
  demoExplainer: "with_suffix works on the stem, so on site.tar.gz only .gz is replaced. A suffix without a leading dot is rejected, and so is any path with an empty name like '/'. with_stem('') on a file that has a suffix fails because the result would be just the extension. with_name refuses a name containing a slash — use / to add a sub-path instead.",

  patterns: [
    {
      name: 'Actually rename the file on disk',
      desc: 'with_suffix only builds the new path; rename() moves the file.',
      code: "from pathlib import Path\np = Path('draft.txt')\np.rename(p.with_suffix('.md'))",
    },
    {
      name: 'Write a converted copy next to the original',
      desc: 'Keep the name, change the extension.',
      code: "from pathlib import Path\nfor src in Path('images').glob('*.png'):\n    convert(src, src.with_suffix('.webp'))",
    },
    {
      name: 'Replace a double extension',
      desc: 'Strip the old suffixes first, then add the new one.',
      code: "from pathlib import PurePosixPath\np = PurePosixPath('backup.tar.gz')\np.with_suffix('').with_suffix('.zip')  # backup.zip",
    },
  ],

  examples: [
    { title: 'Change the extension',   code: "from pathlib import PurePosixPath\nPurePosixPath('data/report.csv').with_suffix('.xlsx')", returns: "PurePosixPath('data/report.xlsx')" },
    { title: 'Remove the extension',   code: "from pathlib import PurePosixPath\nPurePosixPath('data/report.csv').with_suffix('')", returns: "PurePosixPath('data/report')" },
    { title: 'Keep the extension, change the stem', code: "from pathlib import PurePosixPath\nPurePosixPath('img/cat.png').with_stem('cat@2x')", returns: "PurePosixPath('img/cat@2x.png')" },
    { title: 'Replace the whole name', code: "from pathlib import PurePosixPath\nPurePosixPath('/etc/hosts').with_name('hostname')", returns: "PurePosixPath('/etc/hostname')" },
    { title: 'Double extension: both steps', code: "from pathlib import PurePosixPath\nPurePosixPath('backup.tar.gz').with_suffix('').with_suffix('.zip')", returns: "PurePosixPath('backup.zip')" },
    { title: 'The original is untouched', code: "from pathlib import PurePosixPath\np = PurePosixPath('a.txt')\np.with_suffix('.md')\np", returns: "PurePosixPath('a.txt')" },
    { title: 'A dotfile gains a suffix', code: "from pathlib import PurePosixPath\nPurePosixPath('.env').with_suffix('.bak')", returns: "PurePosixPath('.env.bak')" },
  ],

  pitfalls: [
    {
      name: 'Forgetting the dot',
      desc: 'The suffix must include its leading dot.',
      wrong: { label: "'md'", code: "from pathlib import PurePosixPath\nPurePosixPath('notes.txt').with_suffix('md')", output: "ValueError: Invalid suffix 'md'" },
      fix:   { label: "'.md'", code: "from pathlib import PurePosixPath\nPurePosixPath('notes.txt').with_suffix('.md')", output: "PurePosixPath('notes.md')" },
    },
    {
      name: 'Calling with_* on a path without a name',
      desc: "'/', '.' and '' have an empty name, so there is nothing to replace.",
      wrong: { label: "Path('.')", code: "from pathlib import PurePosixPath\nPurePosixPath('.').with_name('out')", output: "ValueError: PurePosixPath('.') has an empty name" },
      fix:   { label: 'join instead', code: "from pathlib import PurePosixPath\nPurePosixPath('.') / 'out'", output: "PurePosixPath('out')" },
    },
    {
      name: 'Expecting the file to be renamed',
      desc: 'with_suffix returns a new path object. The file on disk keeps its name until you call rename() or replace().',
      wrong: { label: 'with_suffix only', code: "from pathlib import Path\np = Path('draft.txt')\np.touch()\np.with_suffix('.md')\nsorted(x.name for x in Path('.').iterdir())", output: "['draft.txt']" },
      fix:   { label: 'rename(with_suffix)', code: "from pathlib import Path\np = Path('draft.txt')\np.touch()\np.rename(p.with_suffix('.md'))\nsorted(x.name for x in Path('.').iterdir())", output: "['draft.md']" },
    },
  ],

  when: {
    use: [
      'Deriving output file names from input names',
      'Changing, adding or removing an extension',
    ],
    avoid: [
      'Renaming on disk → combine with rename() / replace()',
      'Adding a sub-path → the / operator',
    ],
  },

  notes: {
    cpython:          'with_name is defined on PurePath (Lib/pathlib/_local.py) and raises "Invalid name" / "has an empty name"; with_stem and with_suffix come from PurePathBase in _abc.py and call with_name',
    'ValueError texts': "Invalid suffix 'md' · Invalid name 'a/b' · PurePosixPath('/') has an empty name · … has a non-empty suffix (with_stem(''))",
    'Changed in 3.14': "with_suffix('.') becomes valid; in 3.13 it raises ValueError: Invalid suffix '.'",
  },

  related: [
    { name: 'name / stem / suffix', slug: 'name',   when: 'Read these parts' },
    { name: 'rename / replace',     slug: 'rename', when: 'Apply the new name on disk' },
    { name: 'The / operator',       slug: 'joinpath', when: 'Add segments instead' },
    { name: 'ValueError', slug: 'valueerror', when: 'What invalid names raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I change a file extension with pathlib?',
      a: "p.with_suffix('.new') gives the new path; p.rename(p.with_suffix('.new')) renames the file. Include the dot.",
    },
    {
      q: 'How do I remove the extension from a path?',
      a: "p.with_suffix('') removes the last suffix. For site.tar.gz call it twice, or build p.parent / p.name.split('.', 1)[0].",
    },
    {
      q: 'What is the difference between with_name and with_stem?',
      a: "with_name replaces the whole last component (name and extension); with_stem keeps the current extension: Path('a.txt').with_stem('b') is b.txt, with_name('b') is b.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.with_suffix',
    meta:  'PurePath.with_suffix / with_stem / with_name',
  },
};
