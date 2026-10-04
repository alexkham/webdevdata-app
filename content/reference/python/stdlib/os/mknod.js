// content/reference/python/stdlib/os/mknod.js

export const meta = {
  slug:        'mknod',
  name:        'os.mknod',
  signature:   'os.mknod(path, mode=0o600, device=0, *, dir_fd=None) / os.mkfifo(path, mode=0o666) / os.major / os.minor / os.makedev',
  blurb:       'Create special filesystem nodes - named pipes (mkfifo), device files and plain files (mknod) - and split or build raw device numbers (major, minor, makedev).',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3 (all) (dir_fd 3.3+)',
  searchTerms: 'os.mknod mknod os.mkfifo mkfifo os.major major os.minor minor os.makedev makedev named pipe fifo python create device file st_rdev st_dev device number S_IFIFO S_IFCHR S_IFBLK',
};

export const method = {
  slug:      'mknod',
  name:      'os.mknod',
  signature: 'os.mknod(path, mode=0o600, device=0, *, dir_fd=None) / os.mkfifo(path, mode=0o666) / os.major / os.minor / os.makedev',
  returns:   { type: 'None | int', desc: 'mknod and mkfifo return None; major and minor return an int part, makedev the combined raw device number.' },

  category:    'os function',
  version:     'Python 3 (all) (dir_fd 3.3+)',
  hasLiveDemo: false,

  subtitle: 'mkfifo creates a named pipe that two processes open like a file; mknod creates a node whose type comes from the stat.S_IF* bits in mode. mknod and mkfifo are Unix only (not WASI); major, minor and makedev are Unix only too - none of them exist on Windows, so the examples use stat, os.pipe and the Linux device-number formula instead.',

  covers: ['mknod', 'mkfifo', 'major', 'minor', 'makedev'],

  cheat: {
    commonCall: "os.mkfifo('jobs.fifo')",
    returns:    'None',
    replaces:   'mkfifo / mknod shell commands',
    watchOut:   'Opening a FIFO blocks until the other end is opened',
  },

  parameters: [
    { name: 'path',   type: 'str | bytes | PathLike', required: true,  default: null,    desc: 'The node to create; it must not exist yet (FileExistsError).' },
    { name: 'mode',   type: 'int', required: false, default: '0o600 (mknod) / 0o666 (mkfifo)', desc: 'Permission bits, reduced by the umask. For mknod OR in the node type: stat.S_IFREG, S_IFCHR, S_IFBLK or S_IFIFO.' },
    { name: 'device', type: 'int', required: false, default: '0',     desc: 'mknod with S_IFCHR / S_IFBLK: the device number, usually os.makedev(major, minor). Ignored otherwise.' },
    { name: 'dir_fd', type: 'int', required: false, default: 'None',  desc: 'Resolve a relative path against this open directory.' },
  ],

  patterns: [
    {
      name: 'A named pipe between two processes (Unix)',
      desc: 'The reader blocks in open() until a writer opens the FIFO, and vice versa.',
      code: "import os\nos.mkfifo('jobs.fifo')\n# process A\nwith open('jobs.fifo') as fifo:\n    for line in fifo:\n        handle(line)\n# process B\nwith open('jobs.fifo', 'w') as fifo:\n    fifo.write('build\\n')",
    },
    {
      name: 'Which device holds this file? (Unix)',
      desc: 'st_dev is the device of the filesystem; split it into major and minor.',
      code: "import os\nst = os.stat(path)\nprint(os.major(st.st_dev), os.minor(st.st_dev))",
    },
    {
      name: 'Create a character device (Unix, root only)',
      desc: 'Same numbers as /dev/null (1, 3) on Linux.',
      code: "import os\nimport stat\nos.mknod('null', 0o666 | stat.S_IFCHR, os.makedev(1, 3))",
    },
  ],

  examples: [
    { title: 'What a FIFO looks like',            code: "import stat\nstat.filemode(stat.S_IFIFO | 0o644)", returns: "'prw-r--r--'" },
    { title: 'Device node types',                 code: "import stat\n(stat.filemode(stat.S_IFCHR | 0o666), stat.filemode(stat.S_IFBLK | 0o660))", returns: "('crw-rw-rw-', 'brw-rw----')" },
    { title: 'Testing the node type',             code: "import stat\nmode = stat.S_IFIFO | 0o600\n(stat.S_ISFIFO(mode), stat.S_ISREG(mode))", returns: '(True, False)' },
    { title: 'Linux (glibc) makedev by hand',     code: "def makedev(major, minor):\n    return ((major & 0xfff) << 8) | ((major & 0xfffff000) << 32) | (minor & 0xff) | ((minor & 0xffffff00) << 12)\n(makedev(1, 3), makedev(8, 300))", returns: '(259, 1050668)' },
    { title: 'And major / minor back',            code: "def major(dev):\n    return ((dev >> 8) & 0xfff) | ((dev >> 32) & 0xfffff000)\ndef minor(dev):\n    return (dev & 0xff) | ((dev >> 12) & 0xffffff00)\n(major(1050668), minor(1050668))", returns: '(8, 300)' },
    { title: 'Default mkfifo mode after umask 022', code: "oct(0o666 & ~0o022)", returns: "'0o644'" },
    { title: 'Portable alternative: os.pipe',     code: "import os\nr, w = os.pipe()\ntry:\n    os.write(w, b'hi')\n    data = os.read(r, 2)\nfinally:\n    os.close(r)\n    os.close(w)\ndata", returns: "b'hi'" },
  ],

  pitfalls: [
    {
      name: 'Leaving the node type out of mknod mode',
      desc: 'mode=0o600 has no S_IF* bits, so mknod creates a regular file. Add the type to get a FIFO or device.',
      wrong: { label: '0o600',            code: "import stat\nstat.S_IFMT(0o600) == stat.S_IFIFO",                 output: 'False' },
      fix:   { label: 'S_IFIFO | 0o600',  code: "import stat\nstat.S_IFMT(stat.S_IFIFO | 0o600) == stat.S_IFIFO", output: 'True' },
    },
    {
      name: 'Packing device numbers with a simple shift',
      desc: '(major << 8) | minor only works for minor < 256. Larger minors collide with the major bits; use os.makedev, which on Linux implements the full encoding shown here.',
      wrong: { label: 'shift only',   code: "dev = (8 << 8) | 300\n(dev >> 8, dev & 0xff)", output: '(9, 44)' },
      fix:   { label: 'full encoding', code: "dev = ((8 & 0xfff) << 8) | (300 & 0xff) | ((300 & 0xffffff00) << 12)\n(((dev >> 8) & 0xfff) | ((dev >> 32) & 0xfffff000), (dev & 0xff) | ((dev >> 12) & 0xffffff00))", output: '(8, 300)' },
    },
  ],

  when: {
    use: [
      'Simple one-way IPC between unrelated processes on one Unix machine (mkfifo)',
      'Container, chroot or initramfs tooling that must create device nodes (mknod, as root)',
      'Reporting which disk a file lives on (major/minor of st_dev)',
    ],
    avoid: [
      'Parent/child communication → os.pipe or subprocess pipes',
      'Cross-platform or networked IPC → multiprocessing, sockets, queues',
      'Regular files → open(path, "x") instead of mknod',
    ],
  },

  notes: {
    cpython:        'mknod(2) / mkfifo(3) (mknodat / mkfifoat with dir_fd) and the major / minor / makedev macros, in Modules/posixmodule.c',
    'Availability': 'mknod, mkfifo: Unix, not WASI. major, minor, makedev: Unix (not present on Windows)',
    'Encoding':     'The device-number formula on this page is the glibc one; it matched os.makedev / os.major / os.minor on 100000 random inputs on Linux. Other systems may encode differently - always call the os functions in real code',
    'Linux checks': 'mkfifo with the default 0o666 and umask 022 gave 0o644; mknod(path) with no type gave a regular 0o600 file; creating a character device as a normal user raised PermissionError; /dev/null is device (1, 3)',
  },

  related: [
    { name: 'os.pipe', slug: 'pipe', when: 'Anonymous pipe, works on Windows' },
    { name: 'os.stat', slug: 'stat', when: 'st_dev, st_rdev and the file type bits' },
    { name: 'os.chmod / umask', slug: 'chmod', when: 'What the umask removes from mode' },
    { name: 'FileExistsError', slug: 'fileexistserror', when: 'The node already exists', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does os.mkfifo not exist on Windows?',
      a: 'Named pipes on Windows are a different mechanism (\\\\.\\pipe\\ names), not filesystem nodes, so mkfifo, mknod, major, minor and makedev are Unix only. That is why this page has no live demo and its examples avoid calling them; use os.pipe or multiprocessing for portable pipes.',
    },
    {
      q: 'How do I create a named pipe in Python?',
      a: "os.mkfifo('name.fifo') on Linux or macOS. Then one process opens it for reading and another for writing; each open() blocks until the other side arrives.",
    },
    {
      q: 'What do os.major and os.minor return?',
      a: 'The two halves of a raw device number such as st_dev or st_rdev from os.stat: major identifies the driver, minor the device instance. os.makedev(major, minor) packs them back.',
    },
    {
      q: 'Do I need root for os.mknod?',
      a: 'For character and block devices, yes (an unprivileged call raises PermissionError on Linux). FIFOs and regular files can be created by any user with write access to the directory.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.mknod',
    meta:  'os.mknod / mkfifo / makedev',
  },
};
