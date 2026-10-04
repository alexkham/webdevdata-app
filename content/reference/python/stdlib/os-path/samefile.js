// content/reference/python/stdlib/os-path/samefile.js — samefile, sameopenfile, samestat

export const meta = {
  slug:        'samefile',
  name:        'os.path.samefile',
  signature:   'os.path.samefile(path1, path2, /) / os.path.sameopenfile(fp1, fp2) / os.path.samestat(stat1, stat2, /)',
  blurb:       'Do two paths, two open file descriptors or two stat results point at the same file on disk? Decided by device and inode number, not by comparing names or contents.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (Windows support 3.2 / 3.4, path-like 3.6+)',
  searchTerms: 'os.path.samefile samefile os.path.sameopenfile sameopenfile os.path.samestat samestat same file python check two paths same file hard link inode st_ino st_dev compare paths file identity',
};

export const method = {
  slug:      'samefile',
  name:      'os.path.samefile',
  signature: 'os.path.samefile(path1, path2, /) / os.path.sameopenfile(fp1, fp2) / os.path.samestat(stat1, stat2, /)',
  returns:   { type: 'bool', desc: 'True when both refer to the same file or directory (same st_dev and st_ino).' },

  category:    'os.path function',
  version:     'Python 3 (Windows support 3.2 / 3.4, path-like 3.6+)',
  hasLiveDemo: false,

  subtitle: "'a.txt', './a.txt', an absolute path and a hard link are four different strings but one file. samefile() stats both paths and compares device and inode; sameopenfile() does the same for file descriptors, samestat() for stat results you already have. Works on Linux, macOS and Windows.",

  covers: ['samefile', 'sameopenfile', 'samestat'],

  cheat: {
    commonCall: "os.path.samefile('a.txt', '/abs/path/to/a.txt')",
    returns:    'True or False — raises if either path does not exist',
    replaces:   'Comparing abspath()/realpath() strings',
    watchOut:   'Missing path → FileNotFoundError, not False',
  },

  parameters: [
    { name: 'path1, path2', type: 'str | bytes | os.PathLike', required: true, default: null, desc: 'samefile: two paths; both are passed to os.stat(), so symlinks are followed and both must exist.' },
    { name: 'fp1, fp2',     type: 'int', required: true, default: null, desc: 'sameopenfile: two open file descriptors, e.g. f.fileno().' },
    { name: 'stat1, stat2', type: 'os.stat_result', required: true, default: null, desc: 'samestat: results of os.stat(), os.lstat() or os.fstat(). Only st_ino and st_dev are compared.' },
  ],

  patterns: [
    {
      name: 'Refuse to copy a file onto itself',
      desc: 'shutil.copyfile does a similar check and raises SameFileError.',
      code: "import os, shutil\n\ndef safe_copy(src, dst):\n    if os.path.exists(dst) and os.path.samefile(src, dst):\n        raise ValueError(f'{src} and {dst} are the same file')\n    shutil.copyfile(src, dst)",
    },
    {
      name: 'Did someone replace the file I opened?',
      desc: 'Compare the open handle with what the path points to now (log rotation, atomic replace).',
      code: "import os\n\ndef was_replaced(f, path):\n    try:\n        return not os.path.samestat(os.fstat(f.fileno()), os.stat(path))\n    except FileNotFoundError:\n        return True",
    },
    {
      name: 'Avoid visiting a directory twice',
      desc: 'Track (st_dev, st_ino) pairs, the same key samestat compares.',
      code: "import os\nseen = set()\nfor entry in os.scandir('.'):\n    st = entry.stat()\n    key = (st.st_dev, st.st_ino)\n    if key in seen:\n        continue\n    seen.add(key)",
    },
  ],

  examples: [
    {
      title: 'Different spellings, one file',
      code: "import os\nopen('a.txt', 'w').close()\nos.mkdir('sub')\nos.path.samefile('a.txt', os.path.join('sub', '..', 'a.txt'))",
      returns: 'True',
    },
    {
      title: 'Relative vs absolute',
      code: "import os\nopen('a.txt', 'w').close()\nos.path.samefile('a.txt', os.path.abspath('a.txt'))",
      returns: 'True',
    },
    {
      title: 'Same contents is not the same file',
      code: "import os\nfor name in ('a.txt', 'b.txt'):\n    with open(name, 'w') as f:\n        f.write('same text')\nos.path.samefile('a.txt', 'b.txt')",
      returns: 'False',
    },
    {
      title: 'A hard link is the same file',
      code: "import os\nopen('a.txt', 'w').close()\nos.link('a.txt', 'hard.txt')\nos.path.samefile('a.txt', 'hard.txt')",
      returns: 'True',
    },
    {
      title: 'sameopenfile: two handles on one file',
      code: "import os\nopen('a.txt', 'w').close()\nwith open('a.txt') as f1, open('a.txt', 'rb') as f2:\n    result = os.path.sameopenfile(f1.fileno(), f2.fileno())\nresult",
      returns: 'True',
    },
    {
      title: 'sameopenfile: two different files',
      code: "import os\nopen('a.txt', 'w').close()\nopen('b.txt', 'w').close()\nwith open('a.txt') as f1, open('b.txt') as f2:\n    result = os.path.sameopenfile(f1.fileno(), f2.fileno())\nresult",
      returns: 'False',
    },
    {
      title: 'samestat: fstat of a handle vs stat of a path',
      code: "import os\nopen('a.txt', 'w').close()\nwith open('a.txt') as f:\n    result = os.path.samestat(os.fstat(f.fileno()), os.stat('a.txt'))\nresult",
      returns: 'True',
    },
    {
      title: 'samestat: a file and a directory',
      code: "import os\nopen('a.txt', 'w').close()\nos.path.samestat(os.stat('a.txt'), os.stat('.'))",
      returns: 'False',
    },
  ],

  pitfalls: [
    {
      name: 'Comparing path strings',
      desc: "String comparison only sees spelling. './a.txt' and 'a.txt' are different strings for the same file.",
      wrong: { label: '==', code: "open('a.txt', 'w').close()\n'a.txt' == './a.txt'", output: 'False' },
      fix:   { label: 'samefile', code: "import os\nopen('a.txt', 'w').close()\nos.path.samefile('a.txt', './a.txt')", output: 'True' },
    },
    {
      name: 'A missing path raises instead of returning False',
      desc: 'samefile calls os.stat() on both paths. Check existence first (or catch the error) when one side may not exist yet.',
      wrong: { label: 'samefile on a missing path', code: "import os\nopen('a.txt', 'w').close()\ntry:\n    os.path.samefile('a.txt', 'missing.txt')\nexcept OSError as e:\n    result = type(e).__name__\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'exists() first', code: "import os\nopen('a.txt', 'w').close()\nos.path.exists('missing.txt') and os.path.samefile('a.txt', 'missing.txt')", output: 'False' },
    },
    {
      name: 'Using samefile to compare contents',
      desc: 'Two copies with identical bytes are still two files. Compare contents with filecmp.',
      wrong: { label: 'samefile', code: "import os\nfor name in ('a.txt', 'b.txt'):\n    with open(name, 'w') as f:\n        f.write('same text')\nos.path.samefile('a.txt', 'b.txt')", output: 'False' },
      fix:   { label: 'filecmp.cmp', code: "import filecmp\nfor name in ('a.txt', 'b.txt'):\n    with open(name, 'w') as f:\n        f.write('same text')\nfilecmp.cmp('a.txt', 'b.txt', shallow=False)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Refusing to copy, move or overwrite a file onto itself',
      'Detecting hard links and different spellings of the same path',
      'Checking whether an open file is still the one at its path (sameopenfile / samestat)',
    ],
    avoid: [
      'Comparing contents → filecmp.cmp(a, b, shallow=False)',
      'Paths that may not exist → compare os.path.realpath() strings instead',
      'pathlib code → Path.samefile(other)',
    ],
  },

  notes: {
    cpython:     'genericpath.samefile = samestat(os.stat(f1), os.stat(f2)); sameopenfile uses os.fstat; samestat compares st_ino and st_dev only',
    'Windows':   'Supported since 3.2 (samefile, sameopenfile) and 3.4 (samestat); since 3.4 Windows uses the same st_dev / st_ino implementation as other platforms',
    symlinks:    'samefile follows symlinks (os.stat). To ask whether a link itself is the same entry, compare os.lstat results with samestat',
  },

  related: [
    { name: 'os.stat', slug: 'stat', category: 'stdlib/os', when: 'Where st_dev and st_ino come from' },
    { name: 'Path.stat / samefile', slug: 'stat', category: 'stdlib/pathlib', when: 'Path.samefile(other)' },
    { name: 'os.path.exists', slug: 'exists', when: 'Check first: samefile raises on missing paths' },
    { name: 'os.path.abspath / realpath', slug: 'abspath', when: 'String-based normalisation' },
    { name: 'os.path module', slug: 'os-path', category: 'stdlib', when: 'All os.path functions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo?',
      a: 'The answer comes from the file system of the machine running the code, which a browser demo does not have. The examples create their own files and show only True/False, which is the same on Linux, macOS and Windows.',
    },
    {
      q: 'How do I check if two paths point to the same file in Python?',
      a: 'os.path.samefile(p1, p2) (or Path(p1).samefile(p2)). It compares device and inode numbers, so different spellings, relative vs absolute paths and hard links all give True. Both paths must exist.',
    },
    {
      q: 'Does samefile compare file contents?',
      a: 'No. Two files with identical bytes are different files, so samefile returns False. Use filecmp.cmp(a, b, shallow=False) to compare contents.',
    },
    {
      q: 'What is the difference between samefile, sameopenfile and samestat?',
      a: 'They are one check with three kinds of input: samefile takes two paths, sameopenfile two file descriptors, samestat two os.stat_result objects. The other two are built on samestat.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.samefile',
    meta:  'os.path.samefile / sameopenfile / samestat',
  },
};
