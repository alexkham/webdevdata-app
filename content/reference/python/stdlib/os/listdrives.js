// content/reference/python/stdlib/os/listdrives.js

export const meta = {
  slug:        'listdrives',
  name:        'os.listdrives',
  signature:   'os.listdrives() / os.listvolumes() / os.listmounts(volume)',
  blurb:       "Windows only: list drive roots ('C:\\\\'), volume GUID paths, and the mount points of a volume.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.12+',
  searchTerms: 'os.listdrives listdrives os.listmounts listmounts os.listvolumes listvolumes list drives python windows drive letters volumes mount points GUID path Volume{ get all drives',
};

export const method = {
  slug:      'listdrives',
  name:      'os.listdrives',
  signature: 'os.listdrives() / os.listvolumes() / os.listmounts(volume)',
  returns:   { type: 'list[str]', desc: "listdrives: drive roots like 'C:\\\\'; listvolumes: GUID paths like '\\\\\\\\?\\\\Volume{...}\\\\'; listmounts: the mount points of one volume (possibly empty)." },

  category:    'os function',
  version:     'Python 3.12+',
  hasLiveDemo: false,

  subtitle: 'All three are Windows only and new in Python 3.12 - they do not exist on Linux or macOS. listdrives does not test whether a drive is ready or accessible; listmounts needs a volume GUID path from listvolumes, not a drive letter.',

  covers: ['listdrives', 'listmounts', 'listvolumes'],

  cheat: {
    commonCall: 'os.listdrives()',
    returns:    "['C:\\\\', 'D:\\\\'] on a typical machine",
    replaces:   'Looping over A: to Z: with os.path.exists, wmic / PowerShell calls',
    watchOut:   'Windows only (3.12+): guard with hasattr in portable code',
  },

  parameters: [
    { name: 'volume', type: 'str', required: true, default: null, desc: "listmounts: a volume GUID path as returned by listvolumes(). Anything else, e.g. 'C:\\\\', raises OSError." },
  ],

  patterns: [
    {
      name: 'Drives that are actually usable',
      desc: 'listdrives includes empty card readers and disconnected network drives; test each one.',
      code: "import os\nready = [d for d in os.listdrives() if os.path.exists(d)]",
    },
    {
      name: 'Volumes and where they are mounted',
      desc: 'A volume can be mounted at several places or nowhere (empty list).',
      code: "import os\nfor vol in os.listvolumes():\n    print(vol, os.listmounts(vol))",
    },
    {
      name: 'Portable "roots" list',
      desc: 'On POSIX there is a single root.',
      code: "import os\nroots = os.listdrives() if hasattr(os, 'listdrives') else ['/']",
    },
  ],

  examples: [
    { title: 'Guarded call, same result type everywhere', code: "import os\ndrives = os.listdrives() if hasattr(os, 'listdrives') else []\nisinstance(drives, list)", returns: 'True' },
    { title: 'Split the drive off a Windows path',  code: "import ntpath\nntpath.splitdrive(r'C:\\Users\\ada')", returns: "('C:', '\\\\Users\\\\ada')" },
    { title: 'Drive, root and rest (3.12+)',        code: "import ntpath\nntpath.splitroot(r'C:\\Users')", returns: "('C:', '\\\\', 'Users')" },
    { title: 'pathlib sees the drive too',          code: "from pathlib import PureWindowsPath\np = PureWindowsPath(r'D:\\photos\\cat.jpg')\n(p.drive, p.anchor)", returns: "('D:', 'D:\\\\')" },
    { title: 'Recognise a volume GUID path',        code: "v = r'\\\\?\\Volume{0a1b2c3d-0000-0000-0000-100000000000}' + '\\\\'\n(v.startswith(r'\\\\?\\Volume{'), v.endswith('\\\\'))", returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Dropping the backslash from a drive root',
      desc: "listdrives returns 'C:\\\\' with the root backslash. 'C:' alone means the current directory ON drive C, so joining to it gives a drive-relative path.",
      wrong: { label: "'C:'",   code: "import ntpath\nntpath.join('C:', 'Users')",          output: "'C:Users'" },
      fix:   { label: "'C:\\\\'", code: "import ntpath\nntpath.join('C:' + '\\\\', 'Users')", output: "'C:\\\\Users'" },
    },
    {
      name: 'Looking up a drive without its root',
      desc: 'The list holds roots, so a bare letter with colon is not found.',
      wrong: { label: "'C:' in drives",   code: "drives = ['C:\\\\', 'D:\\\\']\n'C:' in drives",        output: 'False' },
      fix:   { label: "'C:\\\\' in drives", code: "drives = ['C:\\\\', 'D:\\\\']\n'C:' + '\\\\' in drives", output: 'True' },
    },
  ],

  when: {
    use: [
      'Drive pickers, backup and disk tools on Windows',
      'Finding volumes that have no drive letter (listvolumes + listmounts)',
    ],
    avoid: [
      'Linux / macOS mounts → read /proc/mounts or use psutil.disk_partitions (third party)',
      'Free space per drive → shutil.disk_usage(drive)',
    ],
  },

  notes: {
    cpython:        'Thin wrappers over the Win32 drive and volume enumeration APIs in Modules/posixmodule.c (compiled only on Windows)',
    'Availability': 'Windows only, added in 3.12 (all three). Each raises an auditing event (os.listdrives, os.listvolumes, os.listmounts)',
    'Observed':     "On a Windows 11 machine with Python 3.13: listdrives() gave ['C:\\\\', 'D:\\\\']; listvolumes() gave four '\\\\\\\\?\\\\Volume{...}\\\\' paths; listmounts of two of them gave ['C:\\\\'] and ['D:\\\\'], the other two []; listmounts('C:\\\\') raised OSError (WinError 87)",
  },

  related: [
    { name: 'os.path.splitroot', slug: 'splitroot', when: 'Split drive, root and tail', category: 'stdlib/os-path' },
    { name: 'os.path.ismount', slug: 'ismount', when: 'Is this folder a mount point?', category: 'stdlib/os-path' },
    { name: 'PureWindowsPath', slug: 'purewindowspath', when: '.drive and .anchor on any OS', category: 'stdlib/pathlib' },
    { name: 'os.statvfs', slug: 'statvfs', when: 'Filesystem stats on Unix' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does os.listdrives not exist on my machine (and why no live demo)?',
      a: 'listdrives, listvolumes and listmounts are Windows only and were added in Python 3.12, so they raise AttributeError on Linux, macOS and older Pythons. The examples on this page therefore guard with hasattr or work with ntpath / PureWindowsPath, which behave the same everywhere.',
    },
    {
      q: 'How do I list all drive letters in Python on Windows?',
      a: "os.listdrives() on 3.12+ returns roots like 'C:\\\\'. Before 3.12, test each letter: [f'{c}:\\\\' for c in string.ascii_uppercase if os.path.exists(f'{c}:\\\\')].",
    },
    {
      q: 'Why does os.listmounts("C:\\\\") fail?',
      a: "listmounts takes a volume GUID path ('\\\\\\\\?\\\\Volume{...}\\\\') from os.listvolumes(), not a drive root. With a drive letter it raises OSError.",
    },
    {
      q: 'Does listdrives include drives that are not ready?',
      a: 'Yes. It lists drive names without testing access, so empty card readers or disconnected network drives can appear. Filter with os.path.exists.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.listdrives',
    meta:  'os.listdrives / listvolumes / listmounts',
  },
};
