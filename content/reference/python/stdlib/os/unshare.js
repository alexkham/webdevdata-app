// content/reference/python/stdlib/os/unshare.js

export const meta = {
  slug:        'unshare',
  name:        'os.unshare',
  signature:   'os.unshare(flags) / os.setns(fd, nstype=0)',
  blurb:       'Linux namespaces from Python: unshare() moves the process into new namespaces chosen by CLONE_* flags, setns() joins an existing one through a /proc/<pid>/ns file or pidfd. The building blocks of containers. Linux only, Python 3.12+.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.12+',
  searchTerms: 'os.unshare unshare os.setns setns linux namespaces python containers CLONE_NEWUSER CLONE_NEWNS CLONE_NEWNET CLONE_NEWPID CLONE_NEWUTS CLONE_NEWIPC CLONE_NEWCGROUP CLONE_NEWTIME CLONE_FILES CLONE_FS CLONE_SIGHAND CLONE_SYSVSEM CLONE_THREAD CLONE_VM os.CLONE_NEWUSER os.CLONE_NEWNS os.CLONE_NEWNET os.CLONE_NEWPID os.CLONE_NEWUTS os.CLONE_NEWIPC os.CLONE_NEWCGROUP os.CLONE_NEWTIME os.CLONE_FILES os.CLONE_FS os.CLONE_SIGHAND os.CLONE_SYSVSEM os.CLONE_THREAD os.CLONE_VM mount namespace network namespace user namespace pidfd_open /proc/self/ns',
};

export const method = {
  slug:      'unshare',
  name:      'os.unshare',
  signature: 'os.unshare(flags) / os.setns(fd, nstype=0)',
  returns:   { type: 'None', desc: 'Both change the namespaces of the calling process (setns: the calling thread).' },

  category:    'os function',
  version:     'Python 3.12+',
  hasLiveDemo: false,

  subtitle: 'flags is a bit mask of CLONE_* constants combined with |; 0 changes nothing. Most namespaces need CAP_SYS_ADMIN, so an ordinary user gets PermissionError, except CLONE_NEWUSER where the kernel allows unprivileged user namespaces. Availability: unshare Linux 2.6.16+, setns Linux 3.0+ with glibc 2.14+; neither exists on macOS or Windows.',

  covers: ['unshare', 'setns', 'CLONE_FILES', 'CLONE_FS', 'CLONE_NEWCGROUP', 'CLONE_NEWIPC', 'CLONE_NEWNET', 'CLONE_NEWNS', 'CLONE_NEWPID', 'CLONE_NEWTIME', 'CLONE_NEWUSER', 'CLONE_NEWUTS', 'CLONE_SIGHAND', 'CLONE_SYSVSEM', 'CLONE_THREAD', 'CLONE_VM'],

  cheat: {
    commonCall: 'os.unshare(os.CLONE_NEWUSER | os.CLONE_NEWNS)',
    returns:    'None',
    replaces:   'the unshare and nsenter commands, or ctypes calls into libc',
    watchOut:   'It changes the calling process itself: do it in a child, not your main program',
  },

  parameters: [
    { name: 'flags',  type: 'int', required: true,  default: null, desc: 'unshare: CLONE_* constants OR-ed together; 0 is a no-op.' },
    { name: 'fd',     type: 'int | object with fileno()', required: true, default: null, desc: 'setns: an open /proc/<pid>/ns/<type> file, or a pidfd from os.pidfd_open() (Linux 5.8+).' },
    { name: 'nstype', type: 'int', required: false, default: '0', desc: 'setns: CLONE_NEW* constant(s) the fd must match; 0 means no check.' },
  ],

  patterns: [
    {
      name: 'Private hostname in a child (unprivileged)',
      desc: 'A new user namespace first gives you the capabilities to create the others.',
      code: "import os, socket\nif os.fork() == 0:\n    os.unshare(os.CLONE_NEWUSER | os.CLONE_NEWUTS)\n    socket.sethostname('sandbox')\n    os._exit(0)",
    },
    {
      name: 'Join the network namespace of PID 1 (root)',
      desc: 'The example from the docs.',
      code: "import os\nfd = os.open('/proc/1/ns/net', os.O_RDONLY)\nos.setns(fd, os.CLONE_NEWNET)\nos.close(fd)",
    },
    {
      name: 'Join several namespaces of a process via pidfd',
      desc: 'Linux 5.8+: one call for all the listed namespace types.',
      code: 'import os\npidfd = os.pidfd_open(pid)\nos.setns(pidfd, os.CLONE_NEWUTS | os.CLONE_NEWPID)\nos.close(pidfd)',
    },
  ],

  examples: [
    { title: 'Linux only',                  code: "import os, sys\nhasattr(os, 'unshare') == hasattr(os, 'setns') == hasattr(os, 'CLONE_NEWNS') == (sys.platform == 'linux' and sys.version_info >= (3, 12))", returns: 'True' },
    { title: 'Combine flags with |',        code: 'CLONE_NEWNS, CLONE_NEWUTS = 0x00020000, 0x04000000  # Linux values\nhex(CLONE_NEWNS | CLONE_NEWUTS)', returns: "'0x4020000'" },
    { title: 'Remove one flag from a mask', code: 'CLONE_NEWNS, CLONE_NEWUSER = 0x00020000, 0x10000000\nflags = CLONE_NEWUSER | CLONE_NEWNS\nflags & ~CLONE_NEWNS == CLONE_NEWUSER', returns: 'True' },
    { title: 'Every flag is a single bit',  code: 'values = [0x400, 0x200, 0x2000000, 0x8000000, 0x40000000, 0x20000, 0x20000000, 0x80, 0x10000000, 0x4000000, 0x800, 0x40000, 0x10000, 0x100]  # the 14 CLONE_* on Linux\nall(v & (v - 1) == 0 for v in values) and len(set(values)) == 14', returns: 'True' },
    { title: 'EPERM: what an unprivileged unshare raises', code: 'import errno\n(errno.EPERM, errno.errorcode[errno.EPERM])', returns: "(1, 'EPERM')" },
  ],

  pitfalls: [
    {
      name: 'Adding flags with + instead of |',
      desc: 'With | a repeated flag is harmless; with + it doubles into a different bit and asks for the wrong namespace.',
      wrong: { label: '+', code: 'CLONE_NEWNS = 0x00020000\nhex(CLONE_NEWNS + CLONE_NEWNS)', output: "'0x40000'" },
      fix:   { label: '|', code: 'CLONE_NEWNS = 0x00020000\nhex(CLONE_NEWNS | CLONE_NEWNS)', output: "'0x20000'" },
    },
    {
      name: 'Testing a flag with == instead of &',
      desc: 'A mask usually holds several flags, so comparing the whole mask with one flag is False. Test the bit with &.',
      wrong: { label: '==', code: 'CLONE_NEWNS, CLONE_NEWUSER = 0x00020000, 0x10000000\nflags = CLONE_NEWUSER | CLONE_NEWNS\nflags == CLONE_NEWUSER', output: 'False' },
      fix:   { label: '&', code: 'CLONE_NEWNS, CLONE_NEWUSER = 0x00020000, 0x10000000\nflags = CLONE_NEWUSER | CLONE_NEWNS\nbool(flags & CLONE_NEWUSER)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Lightweight sandboxes and test isolation on Linux (private mounts, hostname, network)',
      'Entering the namespaces of a container with setns',
    ],
    avoid: [
      'Portable code → nothing comparable on macOS or Windows; use containers or subprocess sandboxes',
      'Full containers → podman / docker / bubblewrap do uid maps, mounts and cgroups for you',
    ],
  },

  notes: {
    cpython:        'Direct wrappers of unshare(2) and setns(2); errors are raised as OSError subclasses (PermissionError for EPERM, OSError errno 22 for invalid flags)',
    'Availability': 'unshare: Linux 2.6.16+; setns: Linux 3.0+ with glibc 2.14+; both added in Python 3.12. The CLONE_* constants exist only where the implementation supports them',
    'Linux values': 'CLONE_NEWTIME 0x80, CLONE_VM 0x100, CLONE_FS 0x200, CLONE_FILES 0x400, CLONE_SIGHAND 0x800, CLONE_THREAD 0x10000, CLONE_NEWNS 0x20000, CLONE_SYSVSEM 0x40000, CLONE_NEWCGROUP 0x2000000, CLONE_NEWUTS 0x4000000, CLONE_NEWIPC 0x8000000, CLONE_NEWUSER 0x10000000, CLONE_NEWPID 0x20000000, CLONE_NEWNET 0x40000000',
    'Process-wide': 'unshare changes the caller for the rest of its life, and a new PID namespace applies only to children created afterwards (the caller keeps its pid). Do it in a child process so the parent keeps its normal view',
    'Privileges':   'On our Linux check, unshare(CLONE_NEWNS) as a normal user raised PermissionError, while unshare(CLONE_NEWUSER) succeeded (uid became 65534) and a following unshare(CLONE_NEWUTS) then worked. Distributions can disable unprivileged user namespaces',
  },

  related: [
    { name: 'os.fork', slug: 'fork', when: 'Create the child that unshares' },
    { name: 'os.getuid', slug: 'getuid', when: 'Ids inside and outside a user namespace' },
    { name: 'os.open', slug: 'open', when: 'Open /proc/<pid>/ns/* for setns' },
    { name: 'PermissionError', slug: 'permissionerror', when: 'What missing CAP_SYS_ADMIN raises', category: 'exceptions' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo, and why do the examples use hard-coded flag values?',
      a: 'unshare, setns and the CLONE_* constants exist only on Linux (Python 3.12+), and they change the namespaces of the running process. The examples show the flag arithmetic with the Linux values, and run anything real in a child process.',
    },
    {
      q: 'Why does os.unshare raise PermissionError?',
      a: 'Most namespace types need CAP_SYS_ADMIN. Unshare CLONE_NEWUSER first (in the same call or earlier): inside a new user namespace you hold the capabilities needed for the others, if the kernel allows unprivileged user namespaces.',
    },
    {
      q: 'What is the difference between unshare and setns?',
      a: 'unshare creates new namespaces and moves the caller into them. setns joins namespaces that already exist, identified by a /proc/<pid>/ns file or a pidfd.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.unshare',
    meta:  'os.unshare / setns / CLONE_* flags',
  },
};
