// content/reference/python/stdlib/sys/maxsize.js — sys.maxsize and sys.maxunicode

export const meta = {
  slug:        'maxsize',
  name:        'sys.maxsize / sys.maxunicode',
  signature:   'sys.maxsize: int  (2**63 - 1 on 64-bit) · sys.maxunicode: int  (1114111)',
  blurb:       'maxsize is the largest Py_ssize_t — the cap on lengths and indexes, not on int values. maxunicode is the largest code point, 0x10FFFF.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 2.6+ (maxunicode always 0x10FFFF since 3.3)',
  searchTerms: 'sys.maxsize maxsize sys.maxunicode maxunicode sys.maxint maxint largest integer python max int value 64-bit or 32-bit python Py_ssize_t max length 0x10ffff largest unicode code point chr arg not in range',
};

export const method = {
  slug:      'maxsize',
  name:      'sys.maxsize / sys.maxunicode',
  signature: 'sys.maxsize: int  (2**63 - 1 on 64-bit) · sys.maxunicode: int  (1114111)',
  returns:   { type: 'int · int', desc: 'maxsize: 2**63 - 1 on 64-bit builds, 2**31 - 1 on 32-bit. maxunicode: 1114111.' },

  category:    'sys attribute',
  version:     'Python 2.6+ (maxunicode always 0x10FFFF since 3.3)',
  hasLiveDemo: false,

  subtitle: 'Python ints have no maximum — sys.maxint was removed in Python 3. maxsize is the limit for sizes: len(), indexes, slice bounds and range lengths. Its value depends on the build (64-bit almost everywhere today), so the examples compare instead of printing it.',

  covers: ['maxsize', 'maxunicode'],

  cheat: {
    commonCall: 'is_64bit = sys.maxsize > 2**32',
    returns:    'True on a 64-bit Python',
    replaces:   'sys.maxint (Python 2) and platform.architecture() for the bitness check',
    watchOut:   'It is not the largest int — ints are unbounded',
  },

  parameters: [],

  patterns: [
    {
      name: '32-bit or 64-bit Python?',
      desc: 'The documented, reliable check (platform.architecture() can be wrong on macOS universal binaries).',
      code: 'import sys\nis_64bit = sys.maxsize > 2**32',
    },
    {
      name: 'A start value for a minimum search',
      desc: 'Use infinity or None, not maxsize — real data can be larger.',
      code: "import math\nbest = math.inf\nfor cost in costs:\n    best = min(best, cost)",
    },
    {
      name: 'Validate a code point',
      desc: 'chr() accepts 0 … sys.maxunicode.',
      code: "import sys\nif not 0 <= cp <= sys.maxunicode:\n    raise ValueError(f'not a code point: {cp:#x}')",
    },
  ],

  examples: [
    { title: 'The largest code point',      code: 'import sys\n(sys.maxunicode, hex(sys.maxunicode))', returns: "(1114111, '0x10ffff')" },
    { title: 'One past it',                 code: 'import sys\nchr(sys.maxunicode + 1)', returns: 'ValueError: chr() arg not in range(0x110000)' },
    { title: 'Ints go past maxsize',        code: 'import sys\nsys.maxsize + 1 > sys.maxsize', returns: 'True' },
    { title: 'Lengths do not',              code: 'import sys\nlen(range(sys.maxsize + 1))', returns: 'OverflowError: Python int too large to convert to C ssize_t' },
    { title: 'The biggest possible length', code: 'import sys\nlen(range(sys.maxsize)) == sys.maxsize', returns: 'True' },
    { title: 'A 32- or 64-bit value',       code: 'import sys\nsys.maxsize in (2**31 - 1, 2**63 - 1)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Using maxsize as "infinity"',
      desc: 'An int larger than maxsize is perfectly valid, so a search seeded with maxsize can return the seed instead of the data.',
      wrong: { label: 'seed = maxsize', code: 'import sys\ncosts = [10**20, 10**21]\nbest = sys.maxsize\nfor c in costs:\n    best = min(best, c)\nbest == sys.maxsize', output: 'True' },
      fix:   { label: 'seed = math.inf', code: 'import math\ncosts = [10**20, 10**21]\nbest = math.inf\nfor c in costs:\n    best = min(best, c)\nbest', output: '100000000000000000000' },
    },
    {
      name: 'Porting sys.maxint',
      desc: 'Python 3 has no maxint because int is unbounded. Use maxsize only where a size limit is meant.',
      wrong: { label: 'sys.maxint', code: 'import sys\nsys.maxint', output: "AttributeError: module 'sys' has no attribute 'maxint'" },
      fix:   { label: 'sys.maxsize', code: 'import sys\nsys.maxsize > 2**30', output: 'True' },
    },
  ],

  when: {
    use: [
      'Detecting a 32-bit vs 64-bit build',
      'Upper bounds for sizes and indexes (e.g. "until the end" in APIs that need an int)',
      'Validating code points (maxunicode)',
    ],
    avoid: [
      'A sentinel for "larger than anything" → math.inf or None',
      'The largest float → sys.float_info.max',
    ],
  },

  notes: {
    cpython:        'maxsize is PY_SSIZE_T_MAX; maxunicode is 0x10FFFF (Python/sysmodule.c)',
    'maxunicode':   'Before 3.3 (PEP 393) narrow builds reported 0xFFFF; since then every build stores the full range',
    'Lists':        'Real containers hit memory limits long before maxsize items',
  },

  related: [
    { name: 'sys.float_info', slug: 'float_info', when: 'Limits of float' },
    { name: 'sys.platform',   slug: 'platform',   when: 'Which OS the build is for' },
    { name: 'chr()',          slug: 'chr',        when: 'Uses the 0..maxunicode range', category: 'functions' },
    { name: 'OverflowError',  slug: 'overflowerror', when: 'What too-large sizes raise', category: 'exceptions' },
    { name: 'sys module',     slug: 'sys',        when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the maximum integer in Python?',
      a: 'There is none: Python 3 ints grow as needed. sys.maxsize (2**63 - 1 on 64-bit builds) is the limit for container sizes and indexes, not for int values.',
    },
    {
      q: 'What replaced sys.maxint in Python 3?',
      a: 'Nothing directly — ints are unbounded. For "largest index or size" use sys.maxsize; for "bigger than everything" use math.inf or float("inf").',
    },
    {
      q: 'How do I tell if Python is 32-bit or 64-bit?',
      a: 'sys.maxsize > 2**32 is True on a 64-bit build. struct.calcsize("P") * 8 gives the pointer size in bits as well.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.maxsize',
    meta:  'sys.maxsize',
  },
};
