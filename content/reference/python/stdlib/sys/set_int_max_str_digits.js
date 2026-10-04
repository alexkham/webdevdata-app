// content/reference/python/stdlib/sys/set_int_max_str_digits.js

export const meta = {
  slug:        'set_int_max_str_digits',
  name:        'sys.set_int_max_str_digits / get_int_max_str_digits',
  signature:   'sys.set_int_max_str_digits(maxdigits) · sys.get_int_max_str_digits()',
  blurb:       'The integer string conversion limit: int(str) and str(int) refuse decimal numbers longer than 4300 digits by default. Raise it, or set 0 to switch it off.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+ (backported to 3.10.7, 3.9.14, 3.8.14, 3.7.14)',
  searchTerms: 'sys.set_int_max_str_digits set_int_max_str_digits get_int_max_str_digits sys.get_int_max_str_digits exceeds the limit 4300 digits for integer string conversion valueerror big int to string python large number str int max str digits PYTHONINTMAXSTRDIGITS',
};

export const method = {
  slug:      'set_int_max_str_digits',
  name:      'sys.set_int_max_str_digits / get_int_max_str_digits',
  signature: 'sys.set_int_max_str_digits(maxdigits) · sys.get_int_max_str_digits()',
  returns:   { type: 'None · int', desc: 'set_… returns None; get_… returns the current limit (4300 by default, 0 = unlimited).' },

  category:    'sys function',
  version:     'Python 3.11+ (backported to 3.10.7, 3.9.14, 3.8.14, 3.7.14)',
  hasLiveDemo: true,

  subtitle: 'Converting a huge int to or from decimal text takes time that grows faster than the number of digits, so CPython caps it at 4300 digits by default — enough for any ordinary number, and a guard against denial-of-service with giant numeric strings.',

  covers: ['set_int_max_str_digits', 'get_int_max_str_digits'],

  cheat: {
    commonCall: 'sys.set_int_max_str_digits(0)  # no limit',
    returns:    'None — the limit applies to the whole interpreter',
    replaces:   'Nothing: before 3.11 there was no limit',
    watchOut:   'Values 1–639 are rejected; hex/oct/bin are never limited',
  },

  parameters: [
    { name: 'maxdigits', type: 'int', required: true, default: null, desc: '0 for no limit, otherwise at least 640 (sys.int_info.str_digits_check_threshold).' },
  ],

  modes: [
    {
      id: 'convert',
      label: 'default limit',
      blurb: 'Build an n-digit number from text and turn it back into text, under the default limit of 4300 digits.',
      params: [{ name: 'digits', type: 'int', hint: 'number of digits', input: 'number' }],
      template: "import sys\nn = int('9' * {$digits})\nlen(str(n))",
      cases: [
        { id: 'small', label: '20 digits',   values: { digits: '20' } },
        { id: 'edge',  label: '4300 digits', values: { digits: '4300' } },
        { id: 'over',  label: '4301 digits', values: { digits: '4301' } },
      ],
    },
    {
      id: 'raise',
      label: 'set the limit',
      blurb: 'Change the limit for one conversion and restore it in finally — the limit is global to the interpreter.',
      params: [
        { name: 'limit',  type: 'int', hint: 'maxdigits (0 = no limit)', input: 'number' },
        { name: 'digits', type: 'int', hint: 'number of digits',         input: 'number' },
      ],
      template: "import sys\nold = sys.get_int_max_str_digits()\ntry:\n    sys.set_int_max_str_digits({$limit})\n    result = len(str(int('9' * {$digits})))\nfinally:\n    sys.set_int_max_str_digits(old)\nresult",
      cases: [
        { id: 'higher', label: 'limit 10000', values: { limit: '10000', digits: '5000' } },
        { id: 'off',    label: '0 = no limit', values: { limit: '0', digits: '6000' } },
        { id: 'lower',  label: 'limit 640',   values: { limit: '640', digits: '641' } },
        { id: 'toolow', label: 'limit 100',   values: { limit: '100', digits: '50' } },
      ],
    },
  ],
  demoExplainer: 'int() counts only the digits — not a sign, whitespace or underscores — and refuses more than the limit with "value has N digits" in the message. A limit below 640 is rejected outright ("maxdigits must be 0 or larger than 640"), so the call fails before any conversion runs. The finally block puts the old limit back either way.',

  patterns: [
    {
      name: 'Lift the limit for one block',
      desc: 'The setting is interpreter-wide; restore it.',
      code: 'import sys\nold = sys.get_int_max_str_digits()\nsys.set_int_max_str_digits(0)\ntry:\n    text = str(huge_number)\nfinally:\n    sys.set_int_max_str_digits(old)',
    },
    {
      name: 'Configure it from outside',
      desc: 'Environment variable or -X option, read at startup.',
      code: '# shell:\n# PYTHONINTMAXSTRDIGITS=0 python app.py\n# python -X int_max_str_digits=100000 app.py',
    },
    {
      name: 'Print big numbers without a limit',
      desc: 'Power-of-two bases are linear time and never limited.',
      code: 'hex(huge_number)\nf"{huge_number:x}"',
    },
  ],

  examples: [
    { title: 'The default limit',        code: 'import sys\nsys.get_int_max_str_digits()', returns: '4300' },
    { title: '4300 digits are fine',      code: 'len(str(10 ** 4299))', returns: '4300' },
    { title: 'str() of a longer int',     code: 'str(10 ** 4300)', returns: 'ValueError: Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit' },
    { title: 'int() of a longer string',  code: "int('1' * 4301)", returns: 'ValueError: Exceeds the limit (4300 digits) for integer string conversion: value has 4301 digits; use sys.set_int_max_str_digits() to increase the limit' },
    { title: 'The sign does not count',   code: 'len(str(-10 ** 4299))', returns: '4301' },
    { title: 'hex() is never limited',    code: 'len(hex(10 ** 5000))', returns: '4155' },
    { title: 'Raise it temporarily',      code: 'import sys\nold = sys.get_int_max_str_digits()\nsys.set_int_max_str_digits(10_000)\ntry:\n    result = len(str(10 ** 5000))\nfinally:\n    sys.set_int_max_str_digits(old)\nresult', returns: '5001' },
    { title: 'The related constants',     code: 'import sys\n(sys.int_info.default_max_str_digits, sys.int_info.str_digits_check_threshold)', returns: '(4300, 640)' },
  ],

  pitfalls: [
    {
      name: 'Setting a small limit',
      desc: 'Any value from 1 to 639 is rejected. 0 means "no limit"; otherwise use 640 or more.',
      wrong: { label: 'limit 100', code: 'import sys\nsys.set_int_max_str_digits(100)', output: 'ValueError: maxdigits must be 0 or larger than 640' },
      fix:   { label: 'limit 640', code: 'import sys\nold = sys.get_int_max_str_digits()\ntry:\n    sys.set_int_max_str_digits(640)\n    result = sys.get_int_max_str_digits()\nfinally:\n    sys.set_int_max_str_digits(old)\nresult', output: '640' },
    },
    {
      name: 'Leaving the limit off for the whole program',
      desc: 'The limit protects every int() in the process — including parsing of untrusted JSON numbers and form fields. Lift it only around the code that needs it.',
      wrong: { label: 'parse untrusted text', code: "import json\njson.loads('1' * 5000)", output: 'ValueError: Exceeds the limit (4300 digits) for integer string conversion: value has 5000 digits; use sys.set_int_max_str_digits() to increase the limit' },
      fix:   { label: 'scoped', code: "import json, sys\nold = sys.get_int_max_str_digits()\nsys.set_int_max_str_digits(0)\ntry:\n    n = json.loads('1' * 5000)\nfinally:\n    sys.set_int_max_str_digits(old)\nn.bit_length()", output: '16607' },
    },
  ],

  when: {
    use: [
      'Math, cryptography or puzzle code that prints or parses numbers with thousands of digits',
      'Checking the current limit before converting a known-large value',
    ],
    avoid: [
      'Servers that parse untrusted input → keep the default',
      'Displaying huge numbers → hex() or an abbreviated form (bit_length, leading digits via math)',
    ],
  },

  notes: {
    cpython:        'The check lives in Objects/longobject.c (long_to_decimal_string_internal and the str → int parser); only bases that are not powers of two are limited',
    'What counts':  'Decimal digits only: a sign, surrounding whitespace and underscores are not counted, leading zeros are',
    'Also limited': "int(s), str(n), repr(n), f'{n}', '%d' % n — and anything built on them, such as json.loads",
    'Configure':    'PYTHONINTMAXSTRDIGITS, -X int_max_str_digits=N, or sys.set_int_max_str_digits(N) at runtime; sys.flags.int_max_str_digits shows the startup value',
  },

  related: [
    { name: 'ValueError', slug: 'valueerror', when: 'What exceeding the limit raises', category: 'exceptions' },
    { name: 'int()',      slug: 'int',        when: 'Parsing text into an int', category: 'functions' },
    { name: 'str()',      slug: 'str',        when: 'Turning an int into text', category: 'functions' },
    { name: 'hex()',      slug: 'hex',        when: 'Never limited', category: 'functions' },
    { name: 'sys.float_info / int_info', slug: 'float_info', when: 'default_max_str_digits and the threshold' },
  ],

  faq: [
    {
      q: 'How do I fix "Exceeds the limit (4300 digits) for integer string conversion"?',
      a: 'Call sys.set_int_max_str_digits(0) (no limit) or a larger value before converting, ideally restoring the old value afterwards; or start Python with PYTHONINTMAXSTRDIGITS=0. If you only need to display the number, hex() is not limited.',
    },
    {
      q: 'Why does Python limit int to str conversion?',
      a: 'No known algorithm converts between decimal text and a binary int in linear time, so very long numeric strings cost far more than their length suggests — the docs note that int("1" * 500_000) can take over a second. The limit mitigates that denial-of-service risk (CVE 2020-10735). Bases that are powers of two (hex, octal, binary) convert in linear time and are not limited.',
    },
    {
      q: 'Does the limit affect arithmetic on big ints?',
      a: 'No. Python ints are still unbounded: 10 ** 100000 computes fine. Only conversion to and from decimal text is limited.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.set_int_max_str_digits',
    meta:  'sys.set_int_max_str_digits',
  },
};
