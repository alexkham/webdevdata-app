// content/reference/python/functions/int.js

export const meta = {
  slug:        'int',
  name:        'int',
  signature:   'int(x, base=10)',
  blurb:       'Convert a string or number to an integer, with an optional base.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'int integer convert parse cast base hex binary string to number',
};

export const method = {
  slug:      'int',
  name:      'int',
  signature: 'int(x, base=10)',
  returns:   { type: 'int', desc: 'The parsed integer. Invalid strings raise ValueError; base applies to string inputs only.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Parse strings into integers — any base from 2 to 36, strict about what counts as a number.',

  cheat: {
    commonCall: 'int("42")',
    returns:    'int — arbitrary precision, no overflow',
    replaces:   'int("ff", 16) → 255; prefixes like 0x are accepted when they match',
    watchOut:   'int("12.5") raises — parse via float() first if decimals may appear',
  },

  parameters: [
    { name: 'x',    type: 'str | number', required: true,  default: null, desc: 'The value to convert. Strings may have surrounding whitespace, a sign, and underscores between digits. Floats truncate toward zero.' },
    { name: 'base', type: 'int',          required: false, default: '10', desc: '2–36, or 0 to infer from a 0x/0o/0b prefix. Only valid for string inputs.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to parse', input: 'text' },
    { name: 'base',   type: 'int', hint: '2-36, empty = 10',    input: 'number-or-none' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: '42',     base: '' } },
    { id: 'hex',     label: 'hex',       values: { string: 'ff',     base: 16 } },
    { id: 'prefix',  label: '0x prefix', values: { string: '0xff',   base: 16 } },
    { id: 'binary',  label: 'binary',    values: { string: '1010',   base: 2 } },
    { id: 'sign',    label: 'signed',    values: { string: '  -42 ', base: '' } },
    { id: 'decimal', label: 'decimal fails', values: { string: '12.5', base: '' } },
  ],
  demoExplainer: 'Whitespace and a sign are fine; underscores between digits too. Everything else must be a digit valid in the base — which is why ’12.5’ raises exactly Python’s ValueError. With base 16, letters a–f become digits, with or without the 0x prefix.',

  patterns: [
    {
      name: 'Safe user-input parsing',
      desc: 'try/except beats pre-validation — it handles every edge at once.',
      code: 'try:\n    n = int(raw)\nexcept ValueError:\n    n = DEFAULT',
    },
    {
      name: 'Hex / binary conversions',
      desc: 'The base argument reads what f-strings and bin()/hex() write.',
      code: 'color = int("ff8800", 16)    # 16746496\nflags = int("1011", 2)       # 11',
    },
    {
      name: 'Truncate a float toward zero',
      desc: 'int() drops the fraction — it does not round.',
      code: 'int(3.99)   # 3\nint(-3.99)  # -3',
    },
  ],

  examples: [
    { title: 'Parse decimal',            code: 'int("42")',        returns: '42' },
    { title: 'Parse hex',                code: 'int("ff", 16)',    returns: '255' },
    { title: 'Whitespace and sign OK',   code: 'int("  -42 ")',    returns: '-42' },
    { title: 'Underscores allowed',      code: 'int("1_000_000")', returns: '1000000' },
  ],

  pitfalls: [
    {
      name: 'Decimal strings raise',
      desc: 'int() parses integers only — "12.5" is not one.',
      wrong: { label: 'Raises', code: 'int("12.5")', output: "ValueError: invalid literal for int() with base 10: '12.5'" },
      fix:   { label: 'Fix', code: 'int(float("12.5"))', output: '12' },
    },
    {
      name: 'int() truncates, round() rounds',
      desc: 'Converting floats with int() always chops toward zero.',
      wrong: { label: 'Not rounding', code: 'int(3.99)', output: '3' },
      fix:   { label: 'When rounding is meant', code: 'round(3.99)', output: '4' },
    },
    {
      name: 'Leading zeros are fine — base 0 is the strict one',
      desc: 'int("010") is 10, but base 0 mimics literal rules and rejects it.',
      wrong: { label: 'Raises', code: 'int("010", 0)', output: "ValueError: invalid literal for int() with base 0: '010'" },
      fix:   { label: 'Plain base 10', code: 'int("010")', output: '10' },
    },
  ],

  when: {
    use: [
      'Parsing integer input (with try/except)',
      'Hex/octal/binary string conversion',
      'Truncating floats toward zero',
    ],
    avoid: [
      'Decimal strings possible → float() first',
      'Rounding semantics wanted → round()',
      'Validating without converting → str.isdecimal',
    ],
  },

  notes: {
    complexity: 'O(n) in the digit count; Python ints are arbitrary precision',
    return:     'int — never overflows',
    cpython:    'Objects/longobject.c :: PyLong_FromString',
    memory:     'Grows with magnitude — big ints are fine',
    threadSafe: 'Yes — pure construction',
  },

  related: [
    { name: 'str.isdigit', slug: 'isdigit', when: 'Pre-validate simple cases' },
    { name: 'round',       slug: 'round',   when: 'Round instead of truncate' },
    { name: 'str.zfill',   slug: 'zfill',   when: 'Format parsed ints back out' },
    { name: 'abs',         slug: 'abs',     when: 'Magnitude of the result' },
  ],

  faq: [
    {
      q: 'What does base=0 do?',
      a: 'Parses like a Python literal: 0x → hex, 0o → octal, 0b → binary, no prefix → decimal — and rejects leading zeros like 010, exactly as source code would.',
    },
    {
      q: 'How large can a Python int be?',
      a: 'Limited only by memory — int is arbitrary precision, so int("9" * 1000) is a perfectly valid 1000-digit number.',
    },
    {
      q: 'Why are underscores allowed?',
      a: 'Readability, mirroring numeric literals (PEP 515): 1_000_000 in code, so int("1_000_000") parses too. Only single underscores between digits count.',
    },
  ],

  history: [
    { version: '3.6', note: 'Underscores in numeric strings accepted (PEP 515).' },
    { version: '3.0', note: 'int and long unified into one arbitrary-precision type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#int',
    meta:  'int',
  },

  tryInTool: [
    { name: 'Base64',         href: '/tools/base64',         meta: 'Other base conversions' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};
