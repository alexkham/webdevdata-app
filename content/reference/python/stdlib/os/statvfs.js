// content/reference/python/stdlib/os/statvfs.js

export const meta = {
  slug:        'statvfs',
  name:        'os.statvfs',
  signature:   'os.statvfs(path) / os.fstatvfs(fd) → os.statvfs_result',
  blurb:       'Filesystem statistics for the filesystem holding a path or open file: block size, total/free/available blocks, inodes, mount flags (ST_*) and the maximum file name length.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all) (ST_RDONLY/ST_NOSUID 3.2+, other ST_* 3.4+, f_fsid 3.7+)',
  searchTerms: 'os.statvfs statvfs os.fstatvfs fstatvfs os.statvfs_result statvfs_result ST_APPEND ST_MANDLOCK ST_NOATIME ST_NODEV ST_NODIRATIME ST_NOEXEC ST_NOSUID ST_RDONLY ST_RELATIME ST_SYNCHRONOUS ST_WRITE os.ST_RDONLY free disk space python f_bavail f_frsize f_blocks f_namemax read-only filesystem mount flags shutil.disk_usage',
};

export const method = {
  slug:      'statvfs',
  name:      'os.statvfs',
  signature: 'os.statvfs(path) / os.fstatvfs(fd) → os.statvfs_result',
  returns:   { type: 'os.statvfs_result', desc: 'A 10-item named tuple: f_bsize, f_frsize, f_blocks, f_bfree, f_bavail, f_files, f_ffree, f_favail, f_flag, f_namemax, plus the attribute-only f_fsid.' },

  category:    'os function',
  version:     'Python 3 (all) (ST_RDONLY/ST_NOSUID 3.2+, other ST_* 3.4+, f_fsid 3.7+)',
  hasLiveDemo: false,

  subtitle: 'statvfs and fstatvfs are Unix only; the ST_* flags for f_flag are Unix (ST_RDONLY, ST_NOSUID) or Linux only (the rest). Windows has the statvfs_result type but no function returning it, so the examples build a result by hand or use shutil.disk_usage, which works everywhere.',

  covers: ['statvfs', 'fstatvfs', 'statvfs_result', 'ST_APPEND', 'ST_MANDLOCK', 'ST_NOATIME', 'ST_NODEV', 'ST_NODIRATIME', 'ST_NOEXEC', 'ST_NOSUID', 'ST_RDONLY', 'ST_RELATIME', 'ST_SYNCHRONOUS', 'ST_WRITE'],

  cheat: {
    commonCall: 'st = os.statvfs("/"); st.f_bavail * st.f_frsize',
    returns:    'statvfs_result (block counts, not bytes)',
    replaces:   'Parsing df output',
    watchOut:   'Multiply counts by f_frsize; use f_bavail, not f_bfree, for "free to me"',
  },

  parameters: [
    { name: 'path', type: 'str | bytes | PathLike | int', required: true, default: null, desc: 'statvfs: any path on the filesystem (or an open file descriptor, 3.3+).' },
    { name: 'fd',   type: 'int', required: true, default: null, desc: 'fstatvfs: an open file descriptor. Same as os.statvfs(fd).' },
  ],

  patterns: [
    {
      name: 'Free space for the current user (Unix)',
      desc: 'f_bavail excludes the blocks reserved for root.',
      code: "import os\nst = os.statvfs('/var/data')\nfree_bytes = st.f_bavail * st.f_frsize\ntotal_bytes = st.f_blocks * st.f_frsize",
    },
    {
      name: 'Is the filesystem mounted read-only?',
      desc: 'Test the ST_RDONLY bit of f_flag before trying to write.',
      code: "import os\nread_only = bool(os.statvfs(path).f_flag & os.ST_RDONLY)",
    },
    {
      name: 'Portable disk usage',
      desc: 'shutil.disk_usage works on Windows too and returns bytes directly.',
      code: "import shutil\ntotal, used, free = shutil.disk_usage('.')\nprint(f'{free / 2**30:.1f} GiB free')",
    },
    {
      name: 'Longest allowed file name',
      desc: 'f_namemax is the per-component limit of that filesystem.',
      code: "import os\nmax_name = os.statvfs('.').f_namemax",
    },
  ],

  examples: [
    { title: 'A result built by hand',           code: "import os\nst = os.statvfs_result((4096, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\n(st.f_bavail * st.f_frsize, st.f_namemax)", returns: '(1638400, 255)' },
    { title: 'A tuple with 10 items',            code: "import os\nst = os.statvfs_result((4096, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\n(len(st), issubclass(os.statvfs_result, tuple), st.f_fsid)", returns: '(10, True, None)' },
    { title: 'Percent available',                code: "import os\nst = os.statvfs_result((4096, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\nround(100 * st.f_bavail / st.f_blocks, 1)", returns: '40.0' },
    { title: 'Decode f_flag (Linux bit values)', code: "LINUX_ST = {'ST_RDONLY': 1, 'ST_NOSUID': 2, 'ST_NODEV': 4, 'ST_NOEXEC': 8, 'ST_RELATIME': 4096}\nf_flag = 4096 | 2 | 1\n[name for name, bit in LINUX_ST.items() if f_flag & bit]", returns: "['ST_RDONLY', 'ST_NOSUID', 'ST_RELATIME']" },
    { title: 'Portable: shutil.disk_usage',      code: "import shutil\nu = shutil.disk_usage('.')\n(u._fields, u.used + u.free <= u.total)", returns: "(('total', 'used', 'free'), True)" },
  ],

  pitfalls: [
    {
      name: 'Using f_bfree for "free space"',
      desc: 'f_bfree includes blocks reserved for root. What a normal user can still write is f_bavail.',
      wrong: { label: 'f_bfree',  code: "import os\nst = os.statvfs_result((4096, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\nst.f_bfree * st.f_frsize",  output: '2048000' },
      fix:   { label: 'f_bavail', code: "import os\nst = os.statvfs_result((4096, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\nst.f_bavail * st.f_frsize", output: '1638400' },
    },
    {
      name: 'Multiplying by f_bsize',
      desc: 'The block counts are in units of f_frsize (the fragment size). f_bsize is the preferred I/O size and can differ.',
      wrong: { label: 'f_bsize',  code: "import os\nst = os.statvfs_result((65536, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\nst.f_blocks * st.f_bsize",  output: '65536000' },
      fix:   { label: 'f_frsize', code: "import os\nst = os.statvfs_result((65536, 4096, 1000, 500, 400, 100, 50, 40, 0, 255))\nst.f_blocks * st.f_frsize", output: '4096000' },
    },
  ],

  when: {
    use: [
      'Free-space checks before large writes on Linux/macOS servers',
      'Detecting read-only or noexec mounts (f_flag with ST_RDONLY, ST_NOEXEC)',
      'Inode exhaustion checks (f_files, f_ffree, f_favail)',
    ],
    avoid: [
      'Cross-platform free space → shutil.disk_usage',
      'Size of one file → os.stat(path).st_size',
    ],
  },

  notes: {
    cpython:       'statvfs(3) / fstatvfs(3) in Modules/posixmodule.c. statvfs_result is a struct sequence: 10 tuple fields (n_sequence_fields 10, n_fields 11) - f_fsid is attribute-only and None when the result is built from a 10-tuple',
    'Availability': 'statvfs, fstatvfs: Unix. ST_RDONLY, ST_NOSUID: Unix (3.2+). ST_NODEV, ST_NOEXEC, ST_SYNCHRONOUS, ST_MANDLOCK, ST_WRITE, ST_APPEND, ST_NOATIME, ST_NODIRATIME, ST_RELATIME: Linux (3.4+). The statvfs_result type itself also exists on Windows',
    'Linux flag values': 'ST_RDONLY 1, ST_NOSUID 2, ST_NODEV 4, ST_NOEXEC 8, ST_SYNCHRONOUS 16, ST_MANDLOCK 64, ST_WRITE 128, ST_APPEND 256, ST_NOATIME 1024, ST_NODIRATIME 2048, ST_RELATIME 4096 (CPython 3.12 on Linux)',
    'Fields':      'f_bsize block size; f_frsize fragment size; f_blocks total in f_frsize units; f_bfree free; f_bavail free for unprivileged users; f_files / f_ffree / f_favail the same for inodes; f_flag mount flags; f_namemax max file name length; f_fsid filesystem id (3.7+)',
  },

  related: [
    { name: 'os.stat', slug: 'stat', when: 'Metadata of one file instead of the filesystem' },
    { name: 'os.path.ismount', slug: 'ismount', when: 'Is this directory a mount point?', category: 'stdlib/os-path' },
    { name: 'os.access', slug: 'access', when: 'Can I write here at all?' },
    { name: 'os.path.getsize', slug: 'getsize', when: 'Size of a single file', category: 'stdlib/os-path' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is os.statvfs missing on Windows?',
      a: 'It wraps the POSIX statvfs() call, which Windows does not have - it is Unix only (the result type exists, the functions do not). That is also why this page builds statvfs_result objects by hand. Use shutil.disk_usage(path) for free space on every OS.',
    },
    {
      q: 'How do I get free disk space in Python?',
      a: 'shutil.disk_usage(path).free works everywhere. On Unix, os.statvfs(path).f_bavail * f_frsize gives the same number for an unprivileged user.',
    },
    {
      q: 'What is the difference between f_bfree and f_bavail?',
      a: 'f_bfree counts all free blocks; f_bavail only those available to unprivileged users (the difference is space reserved for root). Use f_bavail for "how much can I write".',
    },
    {
      q: 'How do I check if a filesystem is read-only?',
      a: 'bool(os.statvfs(path).f_flag & os.ST_RDONLY) on Unix. On Linux the other ST_* constants decode the remaining mount options (noexec, nodev, noatime ...).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.statvfs',
    meta:  'os.statvfs / statvfs_result',
  },
};
