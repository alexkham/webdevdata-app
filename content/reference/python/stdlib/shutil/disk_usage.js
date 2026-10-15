// content/reference/python/stdlib/shutil/disk_usage.js

export const meta = {
  slug:        'disk_usage',
  name:        'shutil.disk_usage',
  signature:   'shutil.disk_usage(path)',
  blurb:       'Total, used and free space in bytes of the disk (file system) that contains path, as a named tuple usage(total, used, free).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+',
  searchTerms: 'shutil disk_usage free disk space python check disk space total used free bytes gigabytes df statvfs drive space usage named tuple',
};

export const method = {
  slug:      'disk_usage',
  name:      'shutil.disk_usage',
  signature: 'shutil.disk_usage(path)',
  returns:   { type: 'usage(total, used, free)', desc: 'A named tuple of three ints, all in bytes.' },

  category:    'shutil function',
  version:     'Python 3.3+',
  hasLiveDemo: false,

  subtitle: 'Python’s df for one path. On Unix it is os.statvfs: total = f_blocks × f_frsize, used = (f_blocks − f_bfree) × f_frsize, free = f_bavail × f_frsize — what an unprivileged user may still write. On Windows it asks the OS for total and free and computes used = total − free. The numbers describe this machine at this moment, so this page has no live demo.',

  covers: ['disk_usage'],

  cheat: {
    commonCall: "shutil.disk_usage('/')",
    returns:    'usage(total=…, used=…, free=…) in bytes',
    replaces:   'Parsing the output of df / dir',
    watchOut:   'On Linux used + free is usually less than total (reserved blocks)',
  },

  parameters: [
    { name: 'path', type: 'str | PathLike', required: true, default: null, desc: 'Any existing file or folder on the disk you want to measure.' },
  ],

  patterns: [
    {
      name: 'Human-readable free space',
      desc: 'Bytes to GiB with one decimal.',
      code: "import shutil\nu = shutil.disk_usage('/')\nprint(f'{u.free / 2**30:.1f} GiB free of {u.total / 2**30:.1f} GiB')",
    },
    {
      name: 'Refuse to start a big download on a full disk',
      desc: 'Measure the disk the file will land on.',
      code: "import shutil\nif shutil.disk_usage(download_dir).free < expected_size * 1.1:\n    raise SystemExit('not enough disk space')",
    },
    {
      name: 'Percentage used',
      desc: 'Relative to what is usable, like df’s Use% column.',
      code: "import shutil\nu = shutil.disk_usage('/')\npercent = 100 * u.used / (u.used + u.free)",
    },
  ],

  examples: [
    { title: 'A named tuple called usage', code: "import shutil\nu = shutil.disk_usage('.')\n(type(u).__name__, u._fields)", returns: "('usage', ('total', 'used', 'free'))" },
    { title: 'Plain ints, in bytes', code: "import shutil\n[type(n).__name__ for n in shutil.disk_usage('.')]", returns: "['int', 'int', 'int']" },
    { title: 'Free never exceeds total', code: "import shutil\nu = shutil.disk_usage('.')\n(u.free <= u.total, u.used + u.free <= u.total)", returns: '(True, True)' },
    { title: 'Unpacks like a tuple', code: "import shutil\ntotal, used, free = shutil.disk_usage('.')\ntotal >= free", returns: 'True' },
    { title: 'A file path works (absolute)', code: "import os, shutil\nopen('a.txt', 'w').close()\nshutil.disk_usage(os.path.abspath('a.txt')).total > 0", returns: 'True' },
    { title: 'A missing path raises', code: "import shutil\ntry:\n    shutil.disk_usage('no/such/folder')\nexcept FileNotFoundError:\n    result = 'FileNotFoundError'\nresult", returns: "'FileNotFoundError'" },
  ],

  pitfalls: [
    {
      name: 'Expecting the size of a folder',
      desc: 'disk_usage describes the whole disk the path is on. The size of a folder’s contents is the sum of its file sizes.',
      wrong: { label: 'disk_usage(folder).used', code: "import os, shutil\nos.mkdir('data')\nwith open('data/a.bin', 'wb') as f:\n    f.write(bytes(1000))\nshutil.disk_usage('data').used == 1000", output: 'False' },
      fix:   { label: 'sum of file sizes', code: "import os\nos.mkdir('data')\nwith open('data/a.bin', 'wb') as f:\n    f.write(bytes(1000))\nsum(os.path.getsize(os.path.join(r, n)) for r, ds, fs in os.walk('data') for n in fs)", output: '1000' },
    },
    {
      name: 'Asking about a file that does not exist yet',
      desc: 'To check room for a download, measure the folder it will go to — the file itself is not there yet.',
      wrong: { label: 'the future file', code: "import os, shutil\nos.mkdir('downloads')\ntry:\n    shutil.disk_usage('downloads/new.iso')\nexcept FileNotFoundError:\n    result = 'FileNotFoundError'\nresult", output: "'FileNotFoundError'" },
      fix:   { label: 'its folder', code: "import os, shutil\nos.mkdir('downloads')\ntarget = 'downloads/new.iso'\nshutil.disk_usage(os.path.dirname(target)).free >= 0", output: 'True' },
    },
  ],

  when: {
    use: [
      'Checking free space before writing large files',
      'Monitoring scripts and health checks',
    ],
    avoid: [
      'Size of a folder’s contents → sum os.path.getsize over os.walk (disk_usage measures the whole disk)',
      'Inode counts or mount flags → os.statvfs (Unix)',
    ],
  },

  notes: {
    cpython:      'Lib/shutil.py: os.statvfs where available, nt._getdiskusage on Windows; the result is collections.namedtuple("usage", "total used free")',
    'Platforms':  'Availability: Unix, Windows. Since 3.8 Windows accepts a file as well as a folder — but checked on CPython 3.13.3 for Windows, a bare relative file name such as "a.txt" raised FileNotFoundError ([WinError 3]) although the file existed; folders and absolute paths worked',
    'Mounts':     'On Unix the path must be on a mounted file system; the answer is for that file system, whatever folder inside it you name',
  },

  related: [
    { name: 'os.statvfs',          slug: 'statvfs', when: 'The Unix call behind it', category: 'stdlib/os' },
    { name: 'os.path.getsize',     slug: 'getsize', when: 'Size of one file', category: 'stdlib/os-path' },
    { name: 'shutil module',       slug: 'shutil',  when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check free disk space in Python?',
      a: "shutil.disk_usage(path).free gives the bytes available on the disk containing path (on Linux: available to non-root users). Divide by 2**30 for GiB. This page has no live demo because the numbers describe the disk of the machine running the code at that moment; the examples only check facts that hold everywhere (types, field names, free <= total).",
    },
    {
      q: 'Why is used + free smaller than total?',
      a: 'On Linux file systems a share of blocks (often 5% on ext4) is reserved for root. free counts only what ordinary users can still use, so the reserve appears in neither used nor free. On Windows used is computed as total - free, so they add up.',
    },
    {
      q: 'Does disk_usage give the size of a folder?',
      a: 'No — it reports the whole file system the folder lives on. For the size of a folder’s contents, add up the file sizes with os.walk or Path.rglob.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shutil.html#shutil.disk_usage',
    meta:  'shutil.disk_usage',
  },

};
