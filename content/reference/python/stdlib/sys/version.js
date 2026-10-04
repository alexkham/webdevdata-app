// content/reference/python/stdlib/sys/version.js — version, version_info and friends

export const meta = {
  slug:        'version',
  name:        'sys.version_info / version / hexversion',
  signature:   'sys.version_info · sys.version · sys.hexversion · sys.api_version · sys.implementation · sys.copyright',
  blurb:       'Which Python is running: version_info is a comparable tuple (3, 13, 3, \'final\', 0), version the human-readable banner string, hexversion one sortable int; implementation names the interpreter (cpython, pypy …).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'All versions (implementation 3.3+)',
  searchTerms: 'sys.version_info version_info sys.version version sys.hexversion hexversion sys.api_version api_version sys.implementation implementation cache_tag sys.copyright copyright check python version in code python version check major minor micro releaselevel',
};

export const method = {
  slug:      'version',
  name:      'sys.version_info / version / hexversion',
  signature: 'sys.version_info · sys.version · sys.hexversion · sys.api_version · sys.implementation · sys.copyright',
  returns:   { type: 'named tuple · str · int · namespace', desc: 'version_info: (major, minor, micro, releaselevel, serial). version: the banner string. hexversion: e.g. 0x030D03F0 for 3.13.3.' },

  category:    'sys attribute',
  version:     'All versions (implementation 3.3+)',
  hasLiveDemo: true,

  subtitle: 'Compare sys.version_info with a tuple and you have a correct version check. The strings (version, copyright) are for people; hexversion is for C-style >= tests; implementation tells CPython from PyPy. The actual values differ per installation — the demo models Python 3.13.',

  covers: ['version_info', 'version', 'hexversion', 'api_version', 'implementation', 'copyright'],

  cheat: {
    commonCall: 'sys.version_info >= (3, 11)',
    returns:    'True or False',
    replaces:   "Parsing sys.version or platform.python_version()",
    watchOut:   "Never compare version strings: '3.10' < '3.9'",
  },

  parameters: [],

  modes: [
    {
      id: 'atleast',
      label: 'at least',
      blurb: 'The usual feature check. Runs as Python 3.13 here; on your machine the answer depends on your Python.',
      params: [
        { name: 'major', type: 'int', hint: 'major version', input: 'number' },
        { name: 'minor', type: 'int', hint: 'minor version', input: 'number' },
      ],
      template: 'import sys\nsys.version_info >= ({$major}, {$minor})',
      cases: [
        { id: 'py311', label: '>= 3.11', values: { major: '3', minor: '11' } },
        { id: 'py313', label: '>= 3.13', values: { major: '3', minor: '13' } },
        { id: 'py2',   label: '>= 2.7',  values: { major: '2', minor: '7' } },
      ],
    },
    {
      id: 'strings',
      label: 'strings vs tuples',
      blurb: 'The same comparison done on strings and on tuples. Strings compare character by character.',
      params: [{ name: 'minor', type: 'int', hint: 'minor version of 3.x', input: 'number' }],
      template: "import sys\nminor = {$minor}\n(f'3.{minor}' >= '3.9', (3, minor) >= (3, 9))",
      cases: [
        { id: 'ten',   label: '3.10', values: { minor: '10' } },
        { id: 'eight', label: '3.8',  values: { minor: '8' } },
        { id: 'nine',  label: '3.9',  values: { minor: '9' } },
      ],
    },
  ],
  demoExplainer: 'A tuple comparison goes item by item, and a longer tuple that starts with the same items is greater — so (3, 13, 3, \'final\', 0) >= (3, 13) is True. With strings, "3.10" is compared character by character: "1" < "9", so "3.10" < "3.9" although 3.10 is newer. That is the bug the tuple form avoids.',

  patterns: [
    {
      name: 'Version-dependent import',
      desc: 'Type checkers understand this exact form and pick the right branch.',
      code: "import sys\nif sys.version_info >= (3, 11):\n    import tomllib\nelse:\n    import tomli as tomllib",
    },
    {
      name: 'Refuse to run on an old Python',
      desc: 'Put it at the very top of the entry script.',
      code: "import sys\nif sys.version_info < (3, 10):\n    sys.exit(f'Python 3.10+ required, this is {sys.version.split()[0]}')",
    },
    {
      name: 'Log the full environment',
      desc: 'version has the build info; implementation names the interpreter.',
      code: "import sys\nprint(sys.implementation.name, sys.version, sys.platform)",
    },
  ],

  examples: [
    { title: 'Feature check',                code: 'import sys\nsys.version_info >= (3, 8)', returns: 'True' },
    { title: 'Fields by name',               code: 'import sys\nsys.version_info.major', returns: '3' },
    { title: 'version_info is a tuple',      code: "import sys\n(isinstance(sys.version_info, tuple), len(sys.version_info))", returns: '(True, 5)' },
    { title: 'Decoding a hexversion',        code: 'v = 0x030D03F0  # 3.13.3 final\n(v >> 24, (v >> 16) & 0xFF, (v >> 8) & 0xFF, hex(v & 0xF0), v & 0x0F)', returns: "(3, 13, 3, '0xf0', 0)" },
    { title: 'hexversion agrees with version_info', code: 'import sys\nv = sys.version_info\nsys.hexversion >> 16 == (v.major << 8) | v.minor', returns: 'True' },
    { title: 'Which interpreter (on CPython)', code: 'import sys\nsys.implementation.name', returns: "'cpython'" },
    { title: 'cache_tag names the .pyc files', code: "import sys\nv = sys.version_info\nsys.implementation.cache_tag == f'cpython-{v.major}{v.minor}'", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Slicing the version string',
      desc: 'sys.version[:3] was a common idiom until 3.10 — it gives "3.1" for 3.10 and later. Use version_info.',
      wrong: { label: 'version[:3]', code: "version = '3.13.3 (tags/v3.13.3:6280bb5, Apr  8 2025, 14:47:33)'  # a sys.version\nversion[:3]", output: "'3.1'" },
      fix:   { label: 'version_info[:2]', code: "import sys\nsys.version_info[:2] >= (3, 10)", output: 'True' },
    },
    {
      name: 'Checking only the minor number',
      desc: 'version_info.minor >= 8 is False for a hypothetical 4.0. Compare the whole tuple prefix.',
      wrong: { label: 'minor only', code: 'major, minor = 4, 0  # some future Python\nminor >= 8', output: 'False' },
      fix:   { label: 'tuple', code: 'major, minor = 4, 0\n(major, minor) >= (3, 8)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Gating features or imports by version: sys.version_info >= (3, X)',
      'Logging exactly which interpreter and build ran (version, implementation)',
    ],
    avoid: [
      'Comparing third-party package versions → importlib.metadata.version() + packaging.version',
      'OS version → platform.platform() / platform.release()',
    ],
  },

  notes: {
    cpython:         'Set in Python/sysmodule.c: version, version_info and hexversion from the PY_*VERSION macros of Include/patchlevel.h, api_version from PYTHON_API_VERSION in Include/modsupport.h',
    'hexversion':    '0xMMmmppRS: major, minor, micro bytes, then release level nibble (A alpha, B beta, C candidate, F final) and serial — 3.13.3 final is 0x030D03F0',
    'api_version':   'The C API version for extension modules (1013 on 3.12 and 3.13); rarely needed outside C extension debugging',
    'implementation': 'name, version, hexversion and cache_tag are required in every implementation; extra attributes start with an underscore',
  },

  related: [
    { name: 'sys.platform', slug: 'platform', when: 'Which operating system' },
    { name: 'sys.flags',    slug: 'flags',    when: 'Which options the interpreter started with' },
    { name: 'sys.exit',     slug: 'exit',     when: 'Refuse to run on an old version' },
    { name: 'tuple',        slug: 'tuple',    when: 'Why the comparison works item by item', category: 'functions' },
    { name: 'sys module',   slug: 'sys',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I check the Python version in a script?',
      a: 'import sys, then sys.version_info >= (3, 11). version_info is a named tuple (major, minor, micro, releaselevel, serial) and compares element by element with any shorter tuple.',
    },
    {
      q: 'What is the difference between sys.version and sys.version_info?',
      a: 'sys.version is a display string with build date and compiler, e.g. "3.13.3 (tags/v3.13.3:…) [MSC v.1943 64 bit (AMD64)]" — for logs, not for code. sys.version_info is the structured, comparable form.',
    },
    {
      q: 'How do I print the Python version?',
      a: 'From a shell: python --version. In code: print(sys.version) for the full banner, or ".".join(map(str, sys.version_info[:3])) for just "3.13.3".',
    },
    {
      q: 'What does sys.implementation tell me?',
      a: 'Which Python implementation is running: name is "cpython", "pypy" and so on, version is that implementation\'s own version, and cache_tag is the tag used in .pyc file names (e.g. cpython-313).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.version_info',
    meta:  'sys.version_info',
  },
};
