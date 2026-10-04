// content/reference/python/stdlib/os/uname.js

export const meta = {
  slug:        'uname',
  name:        'os.uname',
  signature:   'os.uname()',
  blurb:       'Identify the operating system kernel: sysname, nodename, release, version and machine, as an os.uname_result. Unix only; platform.uname() is the portable alternative.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.3+ (named fields)',
  searchTerms: 'os.uname uname os.uname_result uname_result sysname nodename release version machine kernel version hostname architecture python which os am i on platform.uname platform.system sys.platform linux darwin x86_64 arm64',
};

export const method = {
  slug:      'uname',
  name:      'os.uname',
  signature: 'os.uname()',
  returns:   { type: 'os.uname_result', desc: 'A tuple-like struct sequence (sysname, nodename, release, version, machine).' },

  category:    'os function',
  version:     'Python 3.3+ (named fields)',
  hasLiveDemo: false,

  subtitle: 'The kernel view of the system, straight from uname(2): sysname ("Linux", "Darwin"), the host name, the kernel release and build string, and the hardware name. Unix only: os.uname does not exist on Windows (os.uname_result does). For portable code use platform.uname() or platform.system().',

  covers: ['uname', 'uname_result'],

  cheat: {
    commonCall: 'os.uname().release',
    returns:    "uname_result(sysname='Linux', nodename=..., release=..., version=..., machine=...)",
    replaces:   'running the uname -a shell command',
    watchOut:   'Missing on Windows: use platform.uname() for portable code',
  },

  parameters: [],

  patterns: [
    {
      name: 'Portable system name',
      desc: 'platform works on every OS and returns "Windows", "Linux" or "Darwin".',
      code: "import platform\nif platform.system() == 'Darwin':\n    ...",
    },
    {
      name: 'Kernel version as a comparable tuple',
      desc: 'The release string has a numeric prefix and a free-form suffix.',
      code: "import os, re\nmajor, minor = map(int, re.match(r'(\\d+)\\.(\\d+)', os.uname().release).groups())\nhas_feature = (major, minor) >= (5, 8)",
    },
    {
      name: 'Architecture check',
      desc: 'machine is the hardware name, e.g. x86_64 or arm64 / aarch64.',
      code: "import os\nis_arm = os.uname().machine in ('arm64', 'aarch64')",
    },
  ],

  examples: [
    { title: 'Five named fields',           code: "import os\nu = os.uname_result(('Linux', 'web1', '6.8.0-45-generic', '#45-Ubuntu SMP', 'x86_64'))\n(u.sysname, u.release, u.machine)", returns: "('Linux', '6.8.0-45-generic', 'x86_64')" },
    { title: 'Also a tuple',                code: "import os\nu = os.uname_result(('Linux', 'web1', '6.8.0', '#1', 'x86_64'))\n(u[0], len(u))", returns: "('Linux', 5)" },
    { title: 'Field count',                 code: 'import os\nos.uname_result.n_fields', returns: '5' },
    { title: 'os.uname exists only on POSIX', code: "import os\nhasattr(os, 'uname') == (os.name == 'posix')", returns: 'True' },
    { title: 'platform.uname has a sixth field', code: 'import platform\nplatform.uname()._fields', returns: "('system', 'node', 'release', 'version', 'machine', 'processor')" },
    { title: 'platform.system agrees with platform.uname', code: 'import platform\nplatform.uname().system == platform.system()', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Comparing kernel releases as strings',
      desc: 'release is text, and text compares character by character: "6.10" sorts before "6.9". Parse the numbers first.',
      wrong: { label: 'string compare', code: "release = '6.10.0-18-amd64'\nrelease >= '6.9'", output: 'False' },
      fix:   { label: 'tuple of ints', code: "import re\nrelease = '6.10.0-18-amd64'\ntuple(map(int, re.match(r'(\\d+)\\.(\\d+)', release).groups())) >= (6, 9)", output: 'True' },
    },
    {
      name: 'Feature-testing the result type instead of the function',
      desc: 'os.uname_result is defined on Windows too, but os.uname is not. Test for the function (or check os.name) before calling it.',
      wrong: { label: "hasattr(os, 'uname_result')", code: "import os\nhasattr(os, 'uname_result')  # True even on Windows", output: 'True' },
      fix:   { label: "hasattr(os, 'uname')", code: "import os, platform\ninfo = os.uname() if hasattr(os, 'uname') else platform.uname()\nlen(info) >= 5", output: 'True' },
    },
  ],

  when: {
    use: [
      'Logging the kernel release and machine of a Unix server',
      'Kernel-version checks before using a Linux-specific feature',
    ],
    avoid: [
      'Code that must run on Windows → platform.uname() / platform.system()',
      'Choosing code paths by OS → sys.platform (finer granularity, no call needed)',
      'The host name only → socket.gethostname()',
      'Distribution name and version (Ubuntu 24.04 ...) → platform.freedesktop_os_release()',
    ],
  },

  notes: {
    cpython:        'Wraps the uname(2) system call; the fields are the members of struct utsname',
    'Availability': 'os.uname: Unix only. os.uname_result exists on every platform',
    'macOS, iOS, Android': 'os.uname reports the kernel: "Darwin" on macOS and iOS, "Linux" on Android. platform.uname() gives the user-facing OS name and release on iOS and Android',
    'Return type':  'A plain tuple before 3.3; a named struct sequence since',
  },

  related: [
    { name: 'os.sysconf', slug: 'sysconf', when: 'Numeric system limits and configuration' },
    { name: 'os.cpu_count', slug: 'cpu_count', when: 'How many CPUs the machine has' },
    { name: 'os.getuid', slug: 'getuid', when: 'Who the process runs as' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why does os.uname fail on Windows?',
      a: 'os.uname is Unix only (docs: Availability: Unix), so on Windows it raises AttributeError, and on Unix its values describe the machine running it. The examples build uname_result values by hand and use platform for the portable parts.',
    },
    {
      q: 'What is the difference between os.uname() and platform.uname()?',
      a: 'os.uname() is the raw uname(2) system call with five fields and exists only on Unix. platform.uname() works everywhere and adds a sixth field, processor; its system field is "Windows", "Linux" or "Darwin".',
    },
    {
      q: 'How do I get the Linux kernel version in Python?',
      a: 'os.uname().release, e.g. a string like 6.8.0-45-generic. Parse the leading numbers with a regex before comparing versions.',
    },
    {
      q: 'Why does os.uname().sysname say Darwin on a Mac?',
      a: 'uname reports the kernel, and the macOS kernel is Darwin. Use platform.mac_ver() for the macOS version.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.uname',
    meta:  'os.uname / uname_result',
  },
};
