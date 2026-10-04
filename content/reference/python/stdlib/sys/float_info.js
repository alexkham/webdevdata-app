// content/reference/python/stdlib/sys/float_info.js — numeric and thread implementation info

export const meta = {
  slug:        'float_info',
  name:        'sys.float_info / int_info / hash_info / thread_info',
  signature:   'sys.float_info · sys.float_repr_style · sys.int_info · sys.hash_info · sys.thread_info',
  blurb:       'Named tuples describing how this interpreter implements numbers and threads: float limits and precision (float_info), int digit layout and string limit (int_info), the numeric hash scheme (hash_info), the thread library (thread_info).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 2.6+ (int_info 3.1, hash_info 3.2, thread_info 3.3)',
  searchTerms: 'sys.float_info float_info sys.float_repr_style float_repr_style sys.int_info int_info sys.hash_info hash_info sys.thread_info thread_info epsilon max float min float dig mant_dig largest float python machine epsilon bits_per_digit default_max_str_digits hash modulus',
};

export const method = {
  slug:      'float_info',
  name:      'sys.float_info / int_info / hash_info / thread_info',
  signature: 'sys.float_info · sys.float_repr_style · sys.int_info · sys.hash_info · sys.thread_info',
  returns:   { type: 'named tuples · str', desc: "float_info: max, min, epsilon, dig, mant_dig … float_repr_style: 'short'. int_info, hash_info, thread_info: implementation details." },

  category:    'sys attribute',
  version:     'Python 2.6+ (int_info 3.1, hash_info 3.2, thread_info 3.3)',
  hasLiveDemo: false,

  subtitle: "float_info is the C header float.h as a named tuple: CPython floats are IEEE-754 doubles on every platform it supports, so max, epsilon and dig are the same everywhere. int_info, hash_info and thread_info describe build choices — word size, hash algorithm, thread library — and vary between machines.",

  covers: ['float_info', 'float_repr_style', 'int_info', 'hash_info', 'thread_info'],

  cheat: {
    commonCall: 'sys.float_info.epsilon',
    returns:    '2.220446049250313e-16 — the gap between 1.0 and the next float',
    replaces:   'Hard-coded 1.7976931348623157e+308 / 2.220446049250313e-16',
    watchOut:   'float_info.min is the smallest normal float, not the smallest positive one',
  },

  parameters: [],

  patterns: [
    {
      name: 'Relative tolerance from epsilon',
      desc: 'Usually math.isclose is the better tool; epsilon is the building block.',
      code: 'import sys\ndef nearly_equal(a, b, ulps=4):\n    return abs(a - b) <= ulps * sys.float_info.epsilon * max(abs(a), abs(b))',
    },
    {
      name: 'Clamp to the finite float range',
      desc: 'Avoid producing inf from huge inputs.',
      code: 'import sys\nx = max(-sys.float_info.max, min(x, sys.float_info.max))',
    },
    {
      name: 'Log the build details in a bug report',
      desc: 'thread_info and hash_info differ between platforms and builds.',
      code: "import sys\nprint(sys.thread_info, sys.hash_info.algorithm, sys.int_info.bits_per_digit)",
    },
  ],

  examples: [
    { title: 'The largest finite float',   code: 'import sys\nsys.float_info.max', returns: '1.7976931348623157e+308' },
    { title: 'Twice that is infinity',     code: 'import sys\nsys.float_info.max * 2', returns: 'inf' },
    { title: 'Machine epsilon',            code: 'import sys\neps = sys.float_info.epsilon\n(eps, 1.0 + eps > 1.0, 1.0 + eps / 2 == 1.0)', returns: '(2.220446049250313e-16, True, True)' },
    { title: '15 safe decimal digits, 53 bits', code: 'import sys\n(sys.float_info.dig, sys.float_info.mant_dig)', returns: '(15, 53)' },
    { title: 'repr() gives the shortest round-trip form', code: "import sys\n(sys.float_repr_style, repr(0.1 + 0.2))", returns: "('short', '0.30000000000000004')" },
    { title: 'The int string limit lives here too', code: 'import sys\n(sys.int_info.default_max_str_digits, sys.int_info.str_digits_check_threshold)', returns: '(4300, 640)' },
    { title: 'hash(inf) is a documented constant', code: "import sys\nhash(float('inf')) == sys.hash_info.inf == 314159", returns: 'True' },
    { title: 'The modulus hashes to 0',    code: 'import sys\nhash(sys.hash_info.modulus)', returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Taking float_info.min as the smallest positive float',
      desc: 'min is the smallest normalized float. Subnormals go much lower; math.ulp(0.0) is the true minimum.',
      wrong: { label: 'float_info.min', code: 'import sys\nsys.float_info.min / 2 > 0', output: 'True' },
      fix:   { label: 'math.ulp(0.0)', code: 'import math\n(math.ulp(0.0), math.ulp(0.0) / 2)', output: '(5e-324, 0.0)' },
    },
    {
      name: 'Trusting more than dig significant digits',
      desc: 'A float holds 15 decimal digits faithfully (float_info.dig); a 16-digit number may come back changed.',
      wrong: { label: '16 digits', code: "s = '9876543211234567'\nformat(float(s), '.16g')", output: "'9876543211234568'" },
      fix:   { label: 'Decimal', code: "from decimal import Decimal\ns = '9876543211234567'\nstr(Decimal(s))", output: "'9876543211234567'" },
    },
  ],

  when: {
    use: [
      'Numeric code that needs the float range or precision (tolerances, clamping, test bounds)',
      'Diagnostics: logging how the interpreter was built',
    ],
    avoid: [
      'Comparing floats → math.isclose',
      'Neighbouring floats and ulps → math.nextafter / math.ulp (3.9+)',
      'Exact decimals → decimal.Decimal',
    ],
  },

  notes: {
    cpython:         'float_info mirrors DBL_* from float.h (Objects/floatobject.c); int_info and hash_info come from Objects/longobject.c and Python/sysmodule.c',
    'int_info':      'bits_per_digit is 30 on typical builds (15 if CPython was configured with 15-bit digits); default_max_str_digits 4300 and str_digits_check_threshold 640 everywhere (3.11+)',
    'hash_info':     'width 64 and modulus 2**61 - 1 on 64-bit builds; algorithm is siphash13 by default since 3.11 (siphash24 before)',
    'thread_info':   "name is 'nt' on Windows, 'pthread' on Linux and macOS; lock and version are None when unknown",
  },

  related: [
    { name: 'sys.maxsize',  slug: 'maxsize',  when: 'The limit for sizes and indexes' },
    { name: 'sys.set_int_max_str_digits', slug: 'set_int_max_str_digits', when: 'Change the int string limit' },
    { name: 'float',        slug: 'float',    when: 'The type float_info describes', category: 'functions' },
    { name: 'hash()',       slug: 'hash',     when: 'Uses the hash_info scheme', category: 'functions' },
    { name: 'OverflowError', slug: 'overflowerror', when: 'Some float operations past max raise it', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the largest float in Python?',
      a: 'sys.float_info.max, 1.7976931348623157e+308. Anything larger becomes inf in arithmetic (or raises OverflowError in some functions such as math.exp).',
    },
    {
      q: 'What is machine epsilon in Python?',
      a: 'sys.float_info.epsilon, 2.220446049250313e-16: the difference between 1.0 and the next representable float. It equals math.ulp(1.0).',
    },
    {
      q: 'What is the smallest positive float?',
      a: 'sys.float_info.min (2.2250738585072014e-308) is the smallest normal float; the smallest subnormal is math.ulp(0.0), 5e-324.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.float_info',
    meta:  'sys.float_info',
  },
};
