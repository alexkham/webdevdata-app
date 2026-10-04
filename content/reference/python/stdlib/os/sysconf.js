// content/reference/python/stdlib/os/sysconf.js

export const meta = {
  slug:        'sysconf',
  name:        'os.sysconf',
  signature:   'os.sysconf(name, /) / os.confstr(name, /) / os.pathconf(path, name) / os.fpathconf(fd, name, /)',
  blurb:       'Query POSIX system configuration: integer limits with sysconf (page size, clock ticks, CPUs), string values with confstr, per-file limits with pathconf / fpathconf. The *_names dicts list the names the system knows. Unix only.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.0+ (pathconf path-like 3.6+)',
  searchTerms: 'os.sysconf sysconf os.sysconf_names sysconf_names os.confstr confstr os.confstr_names confstr_names os.pathconf pathconf os.pathconf_names pathconf_names os.fpathconf fpathconf SC_PAGE_SIZE SC_PAGESIZE SC_CLK_TCK SC_NPROCESSORS_ONLN SC_PHYS_PAGES SC_OPEN_MAX CS_PATH CS_GNU_LIBC_VERSION PC_NAME_MAX PC_PATH_MAX getconf posix limits page size total memory max filename length',
};

export const method = {
  slug:      'sysconf',
  name:      'os.sysconf',
  signature: 'os.sysconf(name, /) / os.confstr(name, /) / os.pathconf(path, name) / os.fpathconf(fd, name, /)',
  returns:   { type: 'int | str | None', desc: 'sysconf / pathconf / fpathconf: an int (-1 when the value is not defined). confstr: a str, or None when not defined.' },

  category:    'os function',
  version:     'Python 3.0+ (pathconf path-like 3.6+)',
  hasLiveDemo: false,

  subtitle: 'The Python side of the getconf command. Names are strings such as "SC_PAGE_SIZE", "CS_PATH" or "PC_NAME_MAX" (or the raw int values from the *_names dicts). An unknown string name raises ValueError; a known but unsupported one raises OSError with errno EINVAL. Unix only: none of these exist on Windows.',

  covers: ['sysconf', 'sysconf_names', 'confstr', 'confstr_names', 'pathconf', 'pathconf_names', 'fpathconf'],

  cheat: {
    commonCall: "os.sysconf('SC_PAGE_SIZE')",
    returns:    'int (or -1 if undefined)',
    replaces:   'subprocess.run(["getconf", "PAGE_SIZE"])',
    watchOut:   'Unix only, and -1 means "no value", not an error',
  },

  parameters: [
    { name: 'name', type: 'str | int', required: true, default: null, desc: 'A name from sysconf_names / confstr_names / pathconf_names (e.g. "SC_CLK_TCK"), or its integer value.' },
    { name: 'path', type: 'str | path-like | int', required: true, default: null, desc: 'pathconf only: the file or directory to ask about (an open fd works too).' },
    { name: 'fd',   type: 'int', required: true, default: null, desc: 'fpathconf only: an open file descriptor; the same as pathconf(fd, name).' },
  ],

  patterns: [
    {
      name: 'Total physical memory (Linux)',
      desc: 'Number of pages times the page size.',
      code: "import os\ntotal_bytes = os.sysconf('SC_PHYS_PAGES') * os.sysconf('SC_PAGE_SIZE')",
    },
    {
      name: 'Convert clock ticks to seconds',
      desc: 'Fields in /proc/<pid>/stat are counted in SC_CLK_TCK ticks.',
      code: "import os\nseconds = utime_ticks / os.sysconf('SC_CLK_TCK')",
    },
    {
      name: 'Longest file name a directory allows',
      desc: 'pathconf asks the file system that holds the path.',
      code: "import os\nmax_name = os.pathconf('.', 'PC_NAME_MAX')",
    },
    {
      name: 'List what this system supports',
      desc: 'The dicts map names to the integer values of this OS.',
      code: "import os\nsorted(n for n in os.sysconf_names if n.startswith('SC_NPROC'))",
    },
  ],

  examples: [
    { title: 'Unix only',                         code: "import os\nhasattr(os, 'sysconf') == (os.name == 'posix')", returns: 'True' },
    { title: 'Same family, same availability',    code: "import os\nlen({hasattr(os, n) for n in ('sysconf', 'confstr', 'pathconf', 'fpathconf', 'sysconf_names')})", returns: '1' },
    { title: 'The page size is a power of two (portable via mmap)', code: 'import mmap\np = mmap.PAGESIZE\np > 0 and p & (p - 1) == 0', returns: 'True' },
    { title: 'Pages times page size in GiB',      code: 'pages, page_size = 2_000_000, 4096\npages * page_size / 2**30', returns: '7.62939453125' },
    { title: 'EINVAL: the errno for an unsupported name', code: 'import errno\n(errno.EINVAL, errno.errorcode[errno.EINVAL])', returns: "(22, 'EINVAL')" },
  ],

  pitfalls: [
    {
      name: 'Treating -1 as a real value',
      desc: 'sysconf and pathconf return -1 for a limit the system does not define (there is no limit) instead of raising. Check before you compute with it.',
      wrong: { label: 'use it directly', code: 'limit = -1  # what os.sysconf returns for an undefined limit\nbuffers = limit // 4096\nbuffers', output: '-1' },
      fix:   { label: 'check for -1', code: 'limit = -1\nbuffers = None if limit < 0 else limit // 4096\nbuffers is None', output: 'True' },
    },
    {
      name: 'Calling sysconf in cross-platform code',
      desc: 'On Windows the functions do not exist at all. Guard with hasattr, or use a portable source such as mmap.PAGESIZE or os.cpu_count().',
      wrong: { label: 'assume it exists', code: "import os\nos.name != 'posix' and hasattr(os, 'sysconf')  # never True: on Windows os.sysconf(...) raises AttributeError", output: 'False' },
      fix:   { label: 'portable page size', code: "import mmap, os\npage = os.sysconf('SC_PAGE_SIZE') if hasattr(os, 'sysconf') else mmap.PAGESIZE\npage == mmap.PAGESIZE", output: 'True' },
    },
  ],

  when: {
    use: [
      'Reading POSIX limits and configuration (page size, clock ticks, open-file limit, name length) on Unix',
      'Translating /proc tick counts into seconds',
    ],
    avoid: [
      'Page size in portable code → mmap.PAGESIZE',
      'CPU count → os.cpu_count() / os.process_cpu_count()',
      'Changing limits → resource.setrlimit (sysconf only reads)',
    ],
  },

  notes: {
    cpython:        'Thin wrappers over the C functions sysconf(3), confstr(3), pathconf(3) and fpathconf(3); the *_names dicts are filled at build time from the constants the platform headers define',
    'Availability': 'Unix only (sysconf, sysconf_names, confstr, confstr_names, pathconf, pathconf_names, fpathconf). Not available on Windows',
    'Errors':       'Unknown string name: ValueError ("unrecognized configuration name" on Linux). Known name the system does not support: OSError with errno.EINVAL. Undefined value: -1 (sysconf / pathconf) or None (confstr)',
    'Linux values': 'On our Linux test system (x86-64, glibc), SC_PAGE_SIZE equals mmap.PAGESIZE, SC_NPROCESSORS_ONLN equals os.cpu_count(), and SC_CLK_TCK is 100; check your own system',
    'fpathconf':    'Since Python 3.3 fpathconf(fd, name) is the same as pathconf(fd, name); pathconf accepts path-like objects since 3.6',
  },

  related: [
    { name: 'os.cpu_count', slug: 'cpu_count', when: 'Portable CPU count' },
    { name: 'os.statvfs', slug: 'statvfs', when: 'File-system sizes and limits per mount' },
    { name: 'os.uname', slug: 'uname', when: 'Kernel name and release' },
    { name: 'os module', slug: 'os', when: 'Overview of the os module', category: 'stdlib' },
    { name: 'ValueError', slug: 'valueerror', when: 'What an unknown name raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does this page have no live demo, and why do the examples avoid calling sysconf?',
      a: 'sysconf, confstr, pathconf and fpathconf are Unix only (docs: Availability: Unix), and their results describe the machine running them. The examples show availability, the arithmetic you do with the results, and portable equivalents such as mmap.PAGESIZE.',
    },
    {
      q: 'How do I get the page size in Python?',
      a: "os.sysconf('SC_PAGE_SIZE') on Unix (SC_PAGESIZE is the same value on Linux), or mmap.PAGESIZE, which works on Windows too.",
    },
    {
      q: 'What names can I pass to os.sysconf?',
      a: 'The keys of os.sysconf_names, which depend on the platform. confstr and pathconf/fpathconf have their own dicts: os.confstr_names and os.pathconf_names. An integer value from those dicts is accepted too.',
    },
    {
      q: 'How do I get total RAM without psutil on Linux?',
      a: "os.sysconf('SC_PHYS_PAGES') * os.sysconf('SC_PAGE_SIZE') gives the physical memory in bytes. If you target other Unix systems, check that 'SC_PHYS_PAGES' is in os.sysconf_names first.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/os.html#os.sysconf',
    meta:  'os.sysconf / confstr / pathconf / fpathconf',
  },
};
