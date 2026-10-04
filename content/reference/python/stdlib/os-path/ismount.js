// content/reference/python/stdlib/os-path/ismount.js — ismount, isjunction, isdevdrive, isreserved

export const meta = {
  slug:        'ismount',
  name:        'os.path.ismount',
  signature:   'os.path.ismount(path) / isjunction(path) / isdevdrive(path) / isreserved(path)',
  blurb:       'Special-path tests: is this a mount point, an NTFS junction, on a Windows Dev Drive, or a name Windows reserves (NUL, CON, trailing dot)? They return False instead of raising for missing paths.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (isjunction, isdevdrive 3.12+; isreserved 3.13+, Windows only)',
  searchTerms: 'os.path.ismount ismount os.path.isjunction isjunction os.path.isdevdrive isdevdrive os.path.isreserved isreserved mount point python junction windows dev drive reserved file names NUL CON COM1 LPT1 trailing dot invalid windows filename',
};

export const method = {
  slug:      'ismount',
  name:      'os.path.ismount',
  signature: 'os.path.ismount(path) / isjunction(path) / isdevdrive(path) / isreserved(path)',
  returns:   { type: 'bool', desc: 'True when the path has the property; False otherwise, including when the path does not exist (ismount, isjunction).' },

  category:    'os.path function',
  version:     'Python 3 (isjunction, isdevdrive 3.12+; isreserved 3.13+, Windows only)',
  hasLiveDemo: false,

  subtitle: 'Four questions about a path that go beyond file or directory. ismount works everywhere; isjunction and isdevdrive (3.12+) exist on every platform in 3.13 but can only be True on Windows; isreserved (3.13+) exists only on Windows, where os.path is ntpath.',

  covers: ['ismount', 'isjunction', 'isdevdrive', 'isreserved'],

  cheat: {
    commonCall: "os.path.ismount('/mnt/usb')",
    returns:    'True or False — never raises for a missing path',
    replaces:   'Parsing /proc/mounts or the output of mount',
    watchOut:   'isreserved is missing outside Windows: AttributeError on Linux and macOS',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | os.PathLike', required: true, default: null, desc: 'The path to test. ismount, isjunction and isdevdrive look at the file system; isreserved only looks at the string.' },
  ],

  patterns: [
    {
      name: 'Find the mount point that contains a path',
      desc: 'Walk up until ismount says yes.',
      code: "import os\n\ndef mount_point(path):\n    path = os.path.abspath(path)\n    while not os.path.ismount(path):\n        path = os.path.dirname(path)\n    return path",
    },
    {
      name: 'Validate a file name for Windows on any OS',
      desc: 'isreserved is only on Windows (3.13+). Fall back to "not reserved" elsewhere, or call ntpath.isreserved directly on 3.13+ to check names meant for Windows users.',
      code: "import os\nisreserved = getattr(os.path, 'isreserved', lambda path: False)\nif isreserved('report.txt'):\n    raise ValueError('reserved file name on Windows')",
    },
    {
      name: 'Skip junctions while walking (Windows)',
      desc: 'Junctions are directory links that islink() does not report, so filter them explicitly.',
      code: "import os\nfor root, dirs, files in os.walk('.'):\n    dirs[:] = [d for d in dirs if not os.path.isjunction(os.path.join(root, d))]",
    },
    {
      name: 'Prefer a Dev Drive for a build cache (3.13+)',
      desc: 'isdevdrive is always False outside Windows.',
      code: "import os\ncache = r'D:\\cache' if os.path.isdevdrive('D:\\\\') else os.path.expanduser('~/.cache/build')",
    },
  ],

  examples: [
    {
      title: 'The file-system root is a mount point',
      code: "import os\nos.path.ismount(os.path.abspath(os.sep))",
      returns: 'True',
    },
    {
      title: 'An ordinary folder is not',
      code: "import os\nos.mkdir('d')\nos.path.ismount('d')",
      returns: 'False',
    },
    {
      title: 'A missing path gives False, not an error',
      code: "import os\n(os.path.ismount('missing'), os.path.isjunction('missing'))",
      returns: '(False, False)',
    },
    {
      title: 'A normal directory is not a junction',
      code: "import os\nos.mkdir('d')\nos.path.isjunction('d')",
      returns: 'False',
    },
    {
      title: 'A file is never a mount point',
      code: "import os\nopen('f.txt', 'w').close()\nos.path.ismount('f.txt')",
      returns: 'False',
    },
    {
      title: 'isreserved lives only in ntpath',
      code: "import posixpath\nhasattr(posixpath, 'isreserved')",
      returns: 'False',
    },
  ],

  pitfalls: [
    {
      name: 'Calling os.path.isreserved on Linux or macOS',
      desc: 'posixpath has no isreserved, so portable code that calls it crashes outside Windows. Guard it with getattr.',
      wrong: { label: 'posixpath.isreserved', code: "import posixpath\nposixpath.isreserved('NUL')", output: "AttributeError: module 'posixpath' has no attribute 'isreserved'" },
      fix:   { label: 'getattr with a fallback', code: "import os\nisreserved = getattr(os.path, 'isreserved', lambda path: False)\nisreserved('report.txt')", output: 'False' },
    },
    {
      name: 'Using ismount as an existence check',
      desc: 'ismount answers False for missing paths and for ordinary folders alike. Use exists()/isdir() to ask whether something is there.',
      wrong: { label: 'ismount', code: "import os\nos.mkdir('data')\nos.path.ismount('data')", output: 'False' },
      fix:   { label: 'isdir', code: "import os\nos.mkdir('data')\nos.path.isdir('data')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Stopping a directory walk at file-system boundaries (ismount)',
      'Not following NTFS junctions on Windows (isjunction)',
      'Checking a user-supplied file name before creating it on Windows (isreserved)',
    ],
    avoid: [
      'Existence checks → os.path.exists / isdir',
      'Symlinks → os.path.islink (junctions are not reported as links)',
      'Bind mounts on Linux → ismount cannot reliably detect them',
    ],
  },

  notes: {
    cpython:      'posixpath.ismount compares os.lstat(path) with os.lstat(path/..): a different st_dev, or the same inode (the root), means a mount point. A symlink is never a mount point',
    'Linux and macOS': 'ismount cannot reliably detect bind mounts on the same file system, and on Linux it always returns True for btrfs subvolumes',
    'Windows':    'ismount: drive roots and UNC share roots are always mount points; other paths use GetVolumePathName. isjunction is implemented in C there (nt._path_isjunction). isreserved (3.13+, Availability: Windows) flags names ending in a space or dot, names with : * ? " < > | or control characters, and DOS device names such as NUL, CON, AUX, PRN, COM1, LPT1, also with an extension (nul.txt)',
    versions:     'isjunction and isdevdrive were added in 3.12; isdevdrive was Windows-only in 3.12 and exists on all platforms (always False outside Windows) since 3.13. Outside Windows isjunction always returns False',
  },

  related: [
    { name: 'Path.is_mount / is_junction', slug: 'exists', category: 'stdlib/pathlib', when: 'pathlib versions of ismount and isjunction' },
    { name: 'PurePath.is_reserved', slug: 'is_absolute', category: 'stdlib/pathlib', when: 'pathlib version of isreserved' },
    { name: 'os.path.exists / isdir', slug: 'exists', when: 'Is something there at all' },
    { name: 'os.path.samefile', slug: 'samefile', when: 'Compare device and inode yourself' },
    { name: 'os.path module', slug: 'os-path', category: 'stdlib', when: 'All os.path functions' },
  ],

  faq: [
    {
      q: 'Which of these work on Linux and macOS?',
      a: 'ismount works everywhere. isjunction (3.12+) exists everywhere but is always False outside Windows. isdevdrive is on every platform from 3.13 (Windows-only in 3.12) and is always False outside Windows. isreserved (3.13+) has "Availability: Windows" in the docs: it is defined in ntpath only, so os.path.isreserved raises AttributeError on Linux and macOS. That is why the examples avoid calling isreserved and isdevdrive and the page has no live demo.',
    },
    {
      q: 'How do I check if a directory is a mount point in Python?',
      a: "os.path.ismount(path) or Path(path).is_mount(). The file-system root ('/', or a drive root like C:\\ on Windows) is always one.",
    },
    {
      q: 'Which file names are reserved on Windows?',
      a: 'Device names like NUL, CON, PRN, AUX, COM1 and LPT1 (even with an extension: nul.txt), names ending in a dot or space, and names containing : * ? " < > | or control characters. On Windows with Python 3.13, os.path.isreserved checks this; it returns True for "NUL", "nul.txt", "file." and "a*b" and False for "ok.txt".',
    },
    {
      q: 'What is the difference between a junction and a symlink?',
      a: 'A junction is a Windows-only kind of directory link (NTFS). For a junction, os.path.isjunction() and isdir() return True but os.path.islink() returns False, so code that skips symlinks needs isjunction() (3.12+) as well.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.path.html#os.path.ismount',
    meta:  'os.path.ismount / isjunction / isdevdrive / isreserved',
  },
};
