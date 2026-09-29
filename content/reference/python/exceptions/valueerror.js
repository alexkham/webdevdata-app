// content/reference/python/exceptions/valueerror.js

export const meta = {
  slug:        'valueerror',
  name:        'ValueError',
  signature:   'ValueError(*args)',
  blurb:       'Raised when an argument has the right type but an unacceptable value.',
  category:    'type-value',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'valueerror value error invalid literal for int with base 10 could not convert string to float too many values to unpack not enough values to unpack expected 2 list remove x not in list math domain error bad value',
};

export const method = {
  slug:      'valueerror',
  name:      'ValueError',
  signature: 'ValueError(*args)',

  category:    'Type / value exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "The type is fine but this particular value is not — int('abc'), unpacking three items into two names, math.sqrt(-1).",

  chain: ['BaseException', 'Exception', 'ValueError'],

  cheat: {
    raisedBy: "int('abc'), a, b = [1, 2, 3], list.remove(x), math.sqrt(-1)",
    message:  "describes the value: invalid literal for int() with base 10: 'abc'",
    quickFix: 'validate first, or try/except ValueError around the conversion',
    watchOut: "int('3.5') fails — use int(float(s)) or round(float(s))",
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string describing the bad value. Stored in e.args.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Convert text with int(). Surrounding whitespace and _ between digits are allowed; a decimal point is not.',
      params: [{ name: 'text', type: 'str', hint: 'text to convert', input: 'text' }],
      template: 'int({$text})',
      cases: [
        { id: 'ok',      label: "'42'",     values: { text: '42' } },
        { id: 'spaces',  label: "' -7 '",   values: { text: ' -7 ' } },
        { id: 'under',   label: "'1_000'",  values: { text: '1_000' } },
        { id: 'decimal', label: "'3.5'",    values: { text: '3.5' } },
        { id: 'word',    label: "'ten'",    values: { text: 'ten' } },
        { id: 'empty',   label: "''",       values: { text: '' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Validate a number and raise ValueError when it is out of range. Pass a word to see the TypeError the comparison raises instead.',
      params: [{ name: 'p', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' }],
      template: "def set_percent(p):\n    if not 0 <= p <= 100:\n        raise ValueError(f'percent must be 0-100, got {p}')\n    return p / 100\n\nset_percent({$p})",
      cases: [
        { id: 'ok',   label: '42',     values: { p: '42' } },
        { id: 'high', label: '150',    values: { p: '150' } },
        { id: 'neg',  label: '-0.5',   values: { p: '-0.5' } },
        { id: 'str',  label: "'half'", values: { p: 'half' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Parse a "name,qty" line. Both the unpacking and int() raise ValueError, so one except covers every malformed line.',
      params: [{ name: 'line', type: 'str', hint: 'name,qty', input: 'text' }],
      template: "line = {$line}\ntry:\n    name, qty = line.split(',')\n    result = (name, int(qty))\nexcept ValueError as e:\n    result = f'skipped: {e}'\nresult",
      cases: [
        { id: 'ok',     label: 'apple,3',     values: { line: 'apple,3' } },
        { id: 'space',  label: 'apple, 3',    values: { line: 'apple, 3' } },
        { id: 'few',    label: 'apple',       values: { line: 'apple' } },
        { id: 'many',   label: 'apple,3,red', values: { line: 'apple,3,red' } },
        { id: 'word',   label: 'apple,three', values: { line: 'apple,three' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, ' -7 ' and '1_000' convert fine but '3.5' does not: int() of a str accepts only an integer literal. In Handle, note the two unpacking messages — too many values says what it expected, not enough values also says how many it got. In Raise, a str input never reaches your ValueError: 0 <= 'half' fails first with a TypeError.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'The constructor arguments — normally a 1-tuple holding the message.' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise ValueError(…) from e — keeps the original low-level error attached.' },
    { name: '__notes__',   type: 'list[str]', meaning: 'Extra context added with e.add_note() (Python 3.11+), e.g. the line number of the bad record.' },
  ],

  patterns: [
    {
      name: 'Parse or fall back',
      desc: 'Conversions of outside text are the classic EAFP case: try the conversion, handle the bad value.',
      code: "def parse_int(text, default=None):\n    try:\n        return int(text)\n    except ValueError:\n        return default",
    },
    {
      name: 'Validate arguments and say why',
      desc: 'Raise ValueError from your own functions when the value is outside what you accept. Put the offending value in the message.',
      code: "def set_port(port):\n    if not 0 < port < 65536:\n        raise ValueError(f'port must be 1-65535, got {port}')\n    return port",
    },
    {
      name: 'Report the bad record, keep the cause',
      desc: 'When parsing many lines, re-raise with context. from e keeps the original error as __cause__ in the traceback.',
      code: "def load(lines):\n    rows = []\n    for n, line in enumerate(lines, 1):\n        try:\n            name, qty = line.split(',')\n            rows.append((name, int(qty)))\n        except ValueError as e:\n            raise ValueError(f'line {n}: {line!r}') from e\n    return rows",
    },
    {
      name: 'Enum lookup for fixed choices',
      desc: 'Enum(value) raises ValueError for an unknown value — a ready-made validator for mode names and status codes.',
      code: "from enum import Enum\n\nclass Mode(Enum):\n    READ = 'r'\n    WRITE = 'w'\n\nmode = Mode('r')",
    },
  ],

  examples: [
    { title: "int() of a decimal string",   code: "int('3.5')",                          returns: "ValueError: invalid literal for int() with base 10: '3.5'" },
    { title: 'Fix: through float()',        code: "int(float('3.5'))",                   returns: '3' },
    { title: 'Empty input',                 code: "float('')",                           returns: "ValueError: could not convert string to float: ''" },
    { title: 'Too many values to unpack',   code: "a, b = [1, 2, 3]",                    returns: 'ValueError: too many values to unpack (expected 2)' },
    { title: 'Not enough values to unpack', code: "x, y, z = 'ab'",                      returns: 'ValueError: not enough values to unpack (expected 3, got 2)' },
    { title: 'Removing a missing item',     code: "[1, 2].remove(3)",                    returns: 'ValueError: list.remove(x): x not in list' },
    { title: 'math domain error',           code: "import math\nmath.sqrt(-1)",           returns: 'ValueError: math domain error' },
    { title: 'Impossible date',             code: "from datetime import date\ndate(2024, 2, 30)", returns: 'ValueError: day is out of range for month' },
  ],

  pitfalls: [
    {
      name: 'Looping over a dict with two names',
      desc: "Iterating a dict yields only keys. Unpacking a key like 'id' into k, v tries to split the string — too many or not enough values, depending on its length.",
      wrong: { label: 'for k, v in d', code: "d = {'a': 1, 'b': 2}\n[k + str(v) for k, v in d]", output: 'ValueError: not enough values to unpack (expected 2, got 1)' },
      fix:   { label: 'd.items()', code: "d = {'a': 1, 'b': 2}\n[k + str(v) for k, v in d.items()]", output: "['a1', 'b2']" },
    },
    {
      name: 'except ValueError misses None',
      desc: 'int(None) is a TypeError, not a ValueError. A parser that may receive None (missing field, empty cell) must catch both.',
      wrong: { label: 'except ValueError', code: "def parse(x):\n    try:\n        return int(x)\n    except ValueError:\n        return 0\n\nparse(None)", output: "TypeError: int() argument must be a string, a bytes-like object or a real number, not 'NoneType'" },
      fix:   { label: 'except (TypeError, ValueError)', code: "def parse(x):\n    try:\n        return int(x)\n    except (TypeError, ValueError):\n        return 0\n\nparse(None)", output: '0' },
    },
    {
      name: 'list.remove() of an item that may be absent',
      desc: 'remove() raises when the item is not there, unlike set.discard(). Check membership first, or catch the ValueError.',
      wrong: { label: 'remove blindly', code: "tags = ['new']\ntags.remove('sale')\ntags", output: 'ValueError: list.remove(x): x not in list' },
      fix:   { label: 'check first', code: "tags = ['new']\nif 'sale' in tags:\n    tags.remove('sale')\ntags", output: "['new']" },
    },
  ],

  when: {
    use: [
      'An argument has the right type but is out of range or malformed',
      'Parsing user input or file data that may not match the expected format',
      'Rejecting an unknown option name or mode string',
    ],
    avoid: [
      'The argument is the wrong type entirely → TypeError',
      'A key or index is missing from a container → KeyError / IndexError',
      'Validating many fields at once → collect the problems, then raise one error listing them all',
    ],
  },

  notes: {
    cpython:        'int() of a str: Objects/longobject.c PyLong_FromString — the message embeds repr() of the input, cut to 200 characters',
    'Subclasses':   'UnicodeError (and its encode/decode/translate subclasses), json.JSONDecodeError, io.UnsupportedOperation — except ValueError catches them all',
    'Digit limit':  'int() refuses decimal strings over 4300 digits with a ValueError (limit introduced in Python 3.11 and backported to older security releases; sys.set_int_max_str_digits() changes it)',
    'Rule of thumb': 'Wrong kind of object → TypeError. Right kind, unacceptable value → ValueError.',
  },

  related: [
    { name: 'TypeError',   slug: 'typeerror',          when: 'Wrong type rather than wrong value' },
    { name: 'UnicodeError', slug: 'unicodeerror',      when: 'Encoding/decoding failures — a ValueError subclass' },
    { name: 'int',         slug: 'int',                when: 'Parsing rules for integer strings', category: 'functions' },
    { name: 'float',       slug: 'float',              when: "Accepts '3.5', 'inf', '1e3'", category: 'functions' },
    { name: 'list.remove', slug: 'list-remove',        when: 'Raises ValueError for a missing item', category: 'functions' },
    { name: 'list.index',  slug: 'list-index',         when: 'Also raises ValueError: x is not in list', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between ValueError and TypeError?',
      a: "Ask whether any value of this type could work. If no — a list where a number is needed, None — it is a TypeError. If some values of the type work but this one does not — int('abc'), math.sqrt(-1), a negative size — it is a ValueError. int() shows both: int(None) raises TypeError, int('abc') raises ValueError.",
    },
    {
      q: 'How do I fix "ValueError: invalid literal for int() with base 10"?',
      a: "The string is not an integer literal. The quoted part of the message is the exact string, so look for hidden spaces inside it, a decimal point ('3.5' → int(float(s))), thousands separators ('1,000' → s.replace(',', '')), or an empty string from a blank line or empty form field. Leading and trailing whitespace and _ between digits are accepted.",
    },
    {
      q: 'What does "too many values to unpack (expected 2)" mean?',
      a: "The right side of a, b = … produced more items than there are names. The mirror message is not enough values to unpack (expected 2, got 1). Typical causes: split() finding more or fewer separators than you expected, and looping for k, v in some_dict instead of some_dict.items(). Use a, *rest = … to accept extra items.",
    },
    {
      q: 'Why does math.sqrt(-1) raise ValueError: math domain error?',
      a: 'The math module works with real floats only, so arguments outside the function domain (sqrt or log of a negative number, log(0), acos(2)) raise ValueError. Use cmath.sqrt(-1), which returns 1j, if you want complex results.',
    },
    {
      q: 'Does except ValueError catch UnicodeDecodeError and JSONDecodeError?',
      a: 'Yes. UnicodeError and its subclasses UnicodeDecodeError, UnicodeEncodeError and UnicodeTranslateError inherit from ValueError, and so does json.JSONDecodeError. Put the more specific except clause first if you need to handle them differently.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ValueError',
    meta:  'Built-in exceptions',
  },
};
