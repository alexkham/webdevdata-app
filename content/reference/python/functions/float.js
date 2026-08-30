// content/reference/python/functions/float.js

export const meta = {
  slug:        'float',
  name:        'float',
  signature:   'float(x=0.0)',
  blurb:       'Parse a string or convert a number to a float.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'float parse convert number decimal nan inf infinity string to float underscore scientific',
};

export const method = {
  slug:      'float',
  name:      'float',
  signature: 'float(x=0.0)',
  returns:   { type: 'float', desc: 'A double-precision floating-point number. Parses a string with optional sign, decimal point, scientific notation, or one of "inf" / "nan" (case-insensitive).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The float type constructor — parse strings into floats, or convert numeric types.',

  cheat: {
    commonCall: 'float(user_input)',
    returns:    'a float — always double precision',
    replaces:   'safer than eval() for numeric parsing',
    watchOut:   '"inf" and "nan" both parse silently; empty string raises ValueError',
  },

  parameters: [
    { name: 'x', type: 'str | number', required: false, default: '0.0', desc: 'A string to parse, or a number to convert. No argument returns 0.0. Objects implementing __float__ are also accepted.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'string or number', input: 'text' },
  ],
  cases: [
    { id: 'basic',       label: 'basic',           values: { x: '3.14' } },
    { id: 'integer',     label: 'integer literal', values: { x: '42' } },
    { id: 'scientific',  label: 'scientific',      values: { x: '2.5e10' } },
    { id: 'negative',    label: 'negative',        values: { x: '-1.5' } },
    { id: 'whitespace',  label: 'whitespace',      values: { x: '  3.14  ' } },
    { id: 'underscore',  label: 'underscores',     values: { x: '1_000_000.5' } },
    { id: 'infinity',    label: 'infinity',        values: { x: 'inf' } },
    { id: 'nan',         label: 'NaN',             values: { x: 'nan' } },
    { id: 'invalid',     label: 'invalid string',  values: { x: '3.14abc' } },
    { id: 'empty',       label: 'empty string',    values: { x: '' } },
  ],
  demoExplainer: 'float() parses a string into an IEEE 754 double. Leading and trailing whitespace is stripped. Sign, decimal point, and scientific notation are all supported. Underscore separators (like 1_000_000.5) are allowed since Python 3.6. The special strings "inf", "infinity", and "nan" are recognized case-insensitively — a silent gotcha when parsing untrusted input.',

  patterns: [
    {
      name: 'Parse user input safely',
      desc: 'Wrap in try/except — bad input raises ValueError.',
      code: 'try:\n    value = float(raw)\nexcept ValueError:\n    value = default',
    },
    {
      name: 'Int → float promotion',
      desc: 'Turn an int into a float without arithmetic.',
      code: 'ratio = float(counter) / total',
    },
    {
      name: 'Guard against inf/nan',
      desc: 'Special float values slip through parsing silently — filter them.',
      code: 'x = float(raw)\nif not math.isfinite(x):\n    raise ValueError("must be finite")',
    },
  ],

  examples: [
    { title: 'Simple number',      code: 'float("3.14")',        returns: '3.14' },
    { title: 'Integer string',     code: 'float("42")',          returns: '42.0' },
    { title: 'Scientific notation',code: 'float("2.5e10")',      returns: '25000000000.0' },
    { title: 'Whitespace stripped',code: 'float("  3.14  ")',    returns: '3.14' },
    { title: 'Underscores allowed',code: 'float("1_000_000.5")', returns: '1000000.5' },
    { title: 'Infinity',           code: 'float("inf")',         returns: 'inf' },
    { title: 'NaN',                code: 'float("nan")',         returns: 'nan' },
    { title: 'No argument',        code: 'float()',              returns: '0.0' },
    { title: 'Invalid raises',     code: 'float("abc")',         returns: "ValueError: could not convert string to float: \'abc\'" },
  ],

  pitfalls: [
    {
      name: '"inf" and "nan" parse silently',
      desc: 'Both are valid float strings in Python — case-insensitive. Reading a CSV or form field into float() with no validation can silently produce inf or nan, which then breaks downstream math in confusing ways.',
      wrong: { label: 'Silent inf', code: 'value = float(user_input)  # user typed "inf"\ntotal = value + 100\nprint(total)', output: 'inf  # arithmetic quietly poisoned' },
      fix:   { label: 'Reject non-finite', code: 'import math\nvalue = float(user_input)\nif not math.isfinite(value):\n    raise ValueError("finite value required")', output: 'safe' },
    },
    {
      name: 'Binary floats cannot represent most decimals exactly',
      desc: 'float("0.1") is not exactly 0.1 — it is the nearest IEEE 754 double. Accumulated arithmetic drifts. For exact decimals, use Decimal.',
      wrong: { label: 'Not equal', code: 'float("0.1") + float("0.2") == 0.3', output: 'False' },
      fix:   { label: 'Decimal for money', code: 'from decimal import Decimal\nDecimal("0.1") + Decimal("0.2") == Decimal("0.3")', output: 'True' },
    },
    {
      name: 'Empty string raises ValueError',
      desc: 'float() with no argument returns 0.0. float("") is a ValueError. Blank form fields need explicit handling.',
      wrong: { label: 'Blank field',  code: 'float("")', output: "ValueError: could not convert string to float: ''" },
      fix:   { label: 'Guard empty',  code: 'value = float(s) if s else 0.0', output: '0.0 on blank' },
    },
    {
      name: 'Trailing junk is a ValueError, not a partial parse',
      desc: 'float() is strict — "3.14abc" does not parse to 3.14 with a warning. It raises. Use a regex or a proper parser for \"pull the number out\" scenarios.',
      wrong: { label: 'Strict parse', code: 'float("3.14abc")', output: "ValueError: could not convert string to float: '3.14abc'" },
      fix:   { label: 'Extract first', code: 'import re\nm = re.search(r"[-+]?\\d+(\\.\\d+)?", raw)\nvalue = float(m.group()) if m else default', output: 'extract then parse' },
    },
  ],

  when: {
    use: [
      'Parsing user or file input as a floating-point number',
      'Converting int to float for division without integer truncation',
      'Reading numeric config values',
      'Building floats from string data with scientific notation',
    ],
    avoid: [
      'Untrusted input where inf/nan would break downstream → validate with math.isfinite',
      'Exact decimal arithmetic (money) → Decimal',
      'Extracting numbers from mixed text → regex first, then float',
      'You want an integer → int() (float() first is a round-trip you did not need)',
    ],
  },

  notes: {
    complexity: 'O(n) in the input string length',
    return:     'float — always double precision, regardless of input',
    cpython:    'Objects/floatobject.c :: float_new — dispatches to __float__ or string-parses',
    memory:     'Allocates one float object',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'int',    slug: 'int',    when: 'Parse an integer instead' },
    { name: 'round',  slug: 'round',  when: 'Round the resulting float' },
    { name: 'abs',    slug: 'abs',    when: 'Magnitude after conversion' },
    { name: 'sum',    slug: 'sum',    when: 'Total a list of floats' },
  ],

  faq: [
    {
      q: 'How do I check if a string is a valid float without try/except?',
      a: 'There is no builtin str.isfloat. Convention is try/except — Python code embraces \"easier to ask forgiveness than permission\".',
      code: 'def is_float(s):\n    try:\n        float(s)\n        return True\n    except ValueError:\n        return False',
    },
    {
      q: 'How do I keep a specific number of decimal places?',
      a: 'float itself is binary — precision is fixed. For display, use format spec or round; for exact decimals, use Decimal.',
      code: 'f"{float(raw):.2f}"    # display\nround(float(raw), 2)  # round',
    },
    {
      q: 'What is float("inf") for?',
      a: 'A sentinel \"larger than any real number\". Common in algorithms that seed a minimum with +inf and compare downward, or as an upper bound in comparisons. Beware — arithmetic with inf produces inf; float("nan") is even more contagious.',
    },
  ],

  history: [
    { version: '1.0', note: 'float() has been a builtin since Python 1.0.' },
    { version: '3.6', note: 'Underscore separators in numeric literals accepted by float() as well.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#float',
    meta:  'float',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};