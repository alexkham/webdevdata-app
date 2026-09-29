// content/reference/python/stdlib/pathlib/name.js

export const meta = {
  slug:        'name',
  name:        'PurePath.name',
  signature:   'PurePath.name / .stem / .suffix / .suffixes',
  blurb:       'The last path component (name), without its extension (stem), the extension itself (suffix) and every extension (suffixes).',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'PurePath.name name stem suffix suffixes PurePath.stem PurePath.suffix PurePath.suffixes file name without extension get file extension python basename splitext tar.gz double extension dotfile',
};

export const method = {
  slug:      'name',
  name:      'PurePath.name',
  signature: 'PurePath.name / .stem / .suffix / .suffixes',
  returns:   { type: 'str | list[str]', desc: 'name, stem and suffix are str (possibly empty); suffixes is a list.' },

  category:    'pathlib attribute',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Four read-only properties on every path. They look only at the final component and only split at the LAST dot — so archive.tar.gz has the suffix .gz and the stem archive.tar.',

  covers: ['PurePath.name'],

  cheat: {
    commonCall: "p.stem, p.suffix  # 'report', '.pdf'",
    returns:    "strings — '' when there is nothing to return",
    replaces:   'os.path.basename and os.path.splitext',
    watchOut:   "'.bashrc' has no suffix; 'a.tar.gz' has stem 'a.tar'",
  },

  parameters: [],

  modes: [
    {
      id: 'parts',
      label: 'name / stem / suffix',
      blurb: 'Try names with several dots, a leading dot, a trailing dot, or no name at all.',
      params: [{ name: 'path', type: 'str', hint: 'a path', input: 'text' }],
      template: 'from pathlib import PurePosixPath\np = PurePosixPath({$path})\n(p.name, p.stem, p.suffix, p.suffixes)',
      cases: [
        { id: 'pdf',    label: 'report.pdf',     values: { path: 'docs/report.pdf' } },
        { id: 'targz',  label: '.tar.gz',        values: { path: 'backup/site.tar.gz' } },
        { id: 'dot',    label: 'dotfile',        values: { path: '/home/ada/.bashrc' } },
        { id: 'noext',  label: 'no extension',   values: { path: 'Makefile' } },
        { id: 'trail',  label: 'trailing dot',   values: { path: 'notes.' } },
        { id: 'root',   label: 'root',           values: { path: '/' } },
      ],
    },
  ],
  demoExplainer: 'suffix is the text from the last dot, but only when that dot is neither the first nor the last character of the name: ".bashrc" and "notes." have no suffix. suffixes first strips leading dots, then lists every ".part" — and returns [] for a name ending in a dot. The root "/" has an empty name, so every value is empty.',

  patterns: [
    {
      name: 'Group files by extension',
      desc: 'Normalise the case of suffix before comparing.',
      code: "from collections import Counter\nfrom pathlib import Path\nCounter(p.suffix.lower() for p in Path('.').iterdir() if p.is_file())",
    },
    {
      name: 'Strip every extension',
      desc: 'stem only removes the last one; loop or use suffixes.',
      code: "from pathlib import PurePosixPath\np = PurePosixPath('site.tar.gz')\nbase = p.name.removesuffix(''.join(p.suffixes))  # 'site'",
    },
    {
      name: 'Output file next to the input',
      desc: 'Combine parent and stem to name a derived file.',
      code: "from pathlib import Path\nsrc = Path('photos/cat.jpeg')\nthumb = src.parent / f'{src.stem}-thumb.webp'",
    },
  ],

  examples: [
    { title: 'Name of a file',                code: "from pathlib import PurePosixPath\nPurePosixPath('/var/log/syslog.1').name", returns: "'syslog.1'" },
    { title: 'Stem and suffix',               code: "from pathlib import PurePosixPath\np = PurePosixPath('photos/cat.jpeg')\n(p.stem, p.suffix)", returns: "('cat', '.jpeg')" },
    { title: 'Double extensions',             code: "from pathlib import PurePosixPath\np = PurePosixPath('site.tar.gz')\n(p.stem, p.suffix, p.suffixes)", returns: "('site.tar', '.gz', ['.tar', '.gz'])" },
    { title: 'A dotfile has no suffix',       code: "from pathlib import PurePosixPath\np = PurePosixPath('.bashrc')\n(p.stem, p.suffix)", returns: "('.bashrc', '')" },
    { title: 'Folders have names too',        code: "from pathlib import PurePosixPath\nPurePosixPath('/usr/local/').name", returns: "'local'" },
    { title: '".." is a name',                code: "from pathlib import PurePosixPath\nPurePosixPath('a/..').name", returns: "'..'" },
    { title: 'Suffix keeps its case',         code: "from pathlib import PurePosixPath\nPurePosixPath('IMG_0042.JPG').suffix", returns: "'.JPG'" },
  ],

  pitfalls: [
    {
      name: 'Comparing suffixes case-sensitively',
      desc: 'suffix is returned exactly as written, so ".JPG" != ".jpg". Lower-case it before comparing.',
      wrong: { label: 'exact compare', code: "from pathlib import PurePosixPath\nPurePosixPath('IMG_0042.JPG').suffix == '.jpg'", output: 'False' },
      fix:   { label: '.lower()', code: "from pathlib import PurePosixPath\nPurePosixPath('IMG_0042.JPG').suffix.lower() == '.jpg'", output: 'True' },
    },
    {
      name: 'Using stem to remove all extensions',
      desc: 'stem removes only the final suffix.',
      wrong: { label: 'stem', code: "from pathlib import PurePosixPath\nPurePosixPath('data.tar.gz').stem", output: "'data.tar'" },
      fix:   { label: 'split on the first dot', code: "from pathlib import PurePosixPath\nPurePosixPath('data.tar.gz').name.split('.', 1)[0]", output: "'data'" },
    },
    {
      name: 'Expecting a version number to be kept in the stem',
      desc: 'Every dot counts: "app-1.2" has the suffix ".2".',
      wrong: { label: 'version in name', code: "from pathlib import PurePosixPath\nPurePosixPath('app-1.2').suffix", output: "'.2'" },
      fix:   { label: 'check against known suffixes', code: "from pathlib import PurePosixPath\np = PurePosixPath('app-1.2')\np.suffix if p.suffix in {'.zip', '.tar', '.gz'} else ''", output: "''" },
    },
  ],

  when: {
    use: [
      'Getting the file name or extension of any path',
      'Filtering files by type (p.suffix == ".csv")',
      'Naming derived files (stem + new suffix)',
    ],
    avoid: [
      'Changing the extension → with_suffix()',
      'Detecting the real file type → read the content (e.g. mimetypes.guess_type is still name-based)',
    ],
  },

  notes: {
    cpython:     'name is PurePath.name (the last parsed part); stem, suffix and suffixes are inherited from PurePathBase in Lib/pathlib/_abc.py',
    'Rule':      'suffix = name[i:] where i = name.rfind("."), only if 0 < i < len(name) - 1',
    'Changed in 3.14': 'A single trailing dot counts as a suffix from 3.14 on; in 3.13 and earlier "notes." has no suffix',
    'Empty path': "PurePosixPath('') and PurePosixPath('/') have name ''",
  },

  related: [
    { name: 'with_suffix / with_stem / with_name', slug: 'with_suffix', when: 'Change these parts' },
    { name: 'parts / parent',  slug: 'parts',  when: 'The rest of the path' },
    { name: 'str.rpartition',  slug: 'str-rpartition', when: 'The same split on a plain string', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the file name without extension in Python?',
      a: "Path(p).stem. It removes only the last extension: Path('a.tar.gz').stem is 'a.tar'.",
    },
    {
      q: 'How do I get the file extension with pathlib?',
      a: "Path(p).suffix — including the dot, e.g. '.csv'. For multi-part extensions use suffixes, which gives ['.tar', '.gz'].",
    },
    {
      q: 'What is the pathlib equivalent of os.path.basename?',
      a: "PurePath.name. One difference: os.path.basename('dir/') is '' while Path('dir/').name is 'dir', because pathlib drops the trailing slash.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.name',
    meta:  'PurePath.name / stem / suffix / suffixes',
  },
};
