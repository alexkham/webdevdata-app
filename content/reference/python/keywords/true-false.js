// content/reference/python/keywords/true-false.js

export const meta = {
  slug:        'true-false',
  name:        'True / False',
  signature:   'True, False',
  blurb:       'The two bool constants. bool is a subclass of int, so True is 1 and False is 0 in arithmetic, sums and dict keys.',
  category:    'values',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'true false keyword boolean bool truthy falsy truthiness truth value == true is true bool subclass of int sum booleans count bool string',
};

export const method = {
  slug:      'true-false',
  name:      'True / False',
  signature: 'True, False',

  category:    'Values',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'True and False are the only two bool objects — and bool is a subclass of int, so they behave as 1 and 0 everywhere numbers are accepted.',

  covers: ['True', 'False'],

  syntax: [
    { label: 'constants', code: 'done = False\nif ready is True: ...' },
    { label: 'truth test', code: 'if items:        # truthiness\n    ...' },
    { label: 'convert', code: 'bool(value)      # True / False' },
  ],

  cheat: {
    useFor:    'flags, results of comparisons, counting with sum()',
    result:    'bool instances; True == 1 and False == 0',
    pairsWith: 'if / while, and / or / not, bool(), sum(), any(), all()',
    watchOut:  'bool("False") is True; x == True is False for 2; True and 1 are the same dict key',
  },

  parameters: [
    { name: 'True',  type: 'constant', required: true, default: null, desc: 'The true value of bool. Equal to 1 (and 1.0), hashes the same, so it collides with 1 as a dict key or set member.' },
    { name: 'False', type: 'constant', required: true, default: null, desc: 'The false value of bool. Equal to 0. One of the falsy values, alongside None, 0, 0.0, "" and empty containers.' },
  ],

  modes: [
    {
      id: 'truthy',
      label: 'truthiness',
      blurb: 'Type a number or text. bool(x) asks "is it non-empty / non-zero?"; x == True asks "is it equal to 1?" — different questions.',
      params: [{ name: 'value', type: 'any', hint: 'number or text', input: 'auto' }],
      template: 'x = {$value}\n(bool(x), x == True)',
      cases: [
        { id: 'two',   label: '2',        values: { value: '2' } },
        { id: 'one',   label: '1.0',      values: { value: '1.0' } },
        { id: 'false', label: "'False'",  values: { value: 'False' } },
        { id: 'zero',  label: '0',        values: { value: '0' } },
        { id: 'empty', label: 'empty',    values: { value: '' } },
      ],
    },
    {
      id: 'sum',
      label: 'sum of booleans',
      blurb: 'Comparisons give bools, and bools add like 1 and 0 — so sum() counts how many were True.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'flags = [n > 0 for n in {$numbers}]\n(flags, sum(flags))',
      cases: [
        { id: 'mixed', label: 'mixed signs', values: { numbers: '3, -1, 4, 0, 5' } },
        { id: 'neg',   label: 'all negative', values: { numbers: '-2, -0.5' } },
        { id: 'empty', label: 'empty list',  values: { numbers: '' } },
      ],
    },
    {
      id: 'keys',
      label: 'as dict keys',
      blurb: 'True and False are keys here. Any key equal to 1 or 0 — with the same hash — finds them.',
      params: [{ name: 'key', type: 'any', hint: 'number or text', input: 'auto' }],
      template: "d = {True: 'yes', False: 'no'}\nd[{$key}]",
      cases: [
        { id: 'one',   label: '1',       values: { key: '1' } },
        { id: 'zero',  label: '0.0',     values: { key: '0.0' } },
        { id: 'two',   label: '2',       values: { key: '2' } },
        { id: 'text',  label: "'True'",  values: { key: 'True' } },
      ],
    },
  ],
  demoExplainer: 'In truthiness, 2 is truthy yet 2 == True is False, because == compares with the number 1; the text False is a non-empty string, so it is truthy. In sum of booleans, the count is just True + True + ... . In as dict keys, 1 and 0.0 hit the True and False entries because equal numbers must hash equally — while the string True is a different key altogether.',

  patterns: [
    {
      name: 'Count matches',
      desc: 'A generator of comparisons summed is a count.',
      code: 'adults = sum(age >= 18 for age in ages)',
    },
    {
      name: 'Parse a boolean from text',
      desc: 'bool() only tests emptiness; compare the text instead.',
      code: "def parse_bool(text):\n    return text.strip().lower() in {'1', 'true', 'yes', 'on'}",
    },
    {
      name: 'Truthiness instead of == True',
      desc: 'Test the value directly; use is True only when the object must be exactly True.',
      code: 'if user.active:\n    ...\nif not errors:\n    ...',
    },
    {
      name: 'Reject bool where an int is required',
      desc: 'isinstance(True, int) is True, so exclude bool explicitly.',
      code: 'if isinstance(n, bool) or not isinstance(n, int):\n    raise TypeError("expected an int")',
    },
  ],

  examples: [
    { title: 'True + True',                     code: 'True + True',                                                      returns: '2' },
    { title: 'Counting with sum()',             code: 'sum([True, False, True, True])',                                    returns: '3' },
    { title: 'bool is a subclass of int',       code: '(isinstance(True, int), bool.__mro__)',                             returns: "(True, (<class 'bool'>, <class 'int'>, <class 'object'>))" },
    { title: 'Any non-empty string is truthy',  code: "bool('False')",                                                     returns: 'True' },
    { title: 'Falsy values',                    code: "[bool(v) for v in [0, 0.0, '', [], {}, None, 'a', [0]]]",          returns: '[False, False, False, False, False, False, True, True]' },
    { title: 'True and 1 are the same key',     code: "{1: 'one', True: 'true'}",                                           returns: "{1: 'true'}" },
    { title: 'A bool can index a sequence',     code: "['no', 'yes'][3 > 2]",                                              returns: "'yes'" },
    { title: 'You cannot assign to True',       code: "compile('True = 1', '<demo>', 'exec')",                             returns: 'SyntaxError: cannot assign to True' },
  ],

  pitfalls: [
    {
      name: 'bool() on a string does not parse it',
      desc: 'bool(text) is True for every non-empty string, including "False" and "0". Compare the text to decide.',
      wrong: { label: 'bool(text)',        code: "bool('False')",                                         output: 'True' },
      fix:   { label: 'compare the text',  code: "'False'.strip().lower() in {'1', 'true', 'yes'}",     output: 'False' },
    },
    {
      name: 'Comparing with == True',
      desc: 'x == True means x == 1. A truthy value like 2 or a non-empty list is not equal to True, so the check silently fails.',
      wrong: { label: '== True', code: "items = ['a', 'b']\nif len(items) == True:\n    print('has items')\nelse:\n    print('empty?')", output: 'empty?' },
      fix:   { label: 'truthiness', code: "items = ['a', 'b']\nif items:\n    print('has items')\nelse:\n    print('empty?')", output: 'has items' },
    },
    {
      name: 'isinstance(x, int) lets booleans through',
      desc: 'Because bool subclasses int, a validator for integers accepts True and False, and they quietly act as 1 and 0.',
      wrong: { label: 'int check only', code: "def double(n):\n    if not isinstance(n, int):\n        raise TypeError('need an int')\n    return n * 2\n\ndouble(True)", output: '2' },
      fix:   { label: 'exclude bool',   code: "def double(n):\n    if isinstance(n, bool) or not isinstance(n, int):\n        raise TypeError('need an int')\n    return n * 2\n\ndouble(True)", output: 'TypeError: need an int' },
    },
    {
      name: 'Mixing 1 and True as keys or set members',
      desc: 'Equal values with equal hashes are one key. The first key object is kept; the last value wins.',
      wrong: { label: 'expects two entries', code: "len({1: 'a', True: 'b', 1.0: 'c'})", output: '1' },
      fix:   { label: 'use distinct keys',   code: "len({'1': 'a', 'True': 'b', '1.0': 'c'})", output: '3' },
    },
  ],

  when: {
    use: [
      'Flags and switches: done = False, verbose=True',
      'Results of comparisons and predicates (isinstance(), str.isdigit(), in)',
      'Counting matches with sum() over booleans',
    ],
    avoid: [
      'if x == True / if x is True for ordinary truth tests → if x:',
      'Several related flags → an enum or a set of options',
      'Tri-state values (yes / no / unknown) → True / False / None, tested with is None first',
    ],
  },

  notes: {
    cpython:      'True and False are the only two bool instances; bool cannot be subclassed (type \'bool\' is not an acceptable base type)',
    'Truthiness': 'bool(x) calls x.__bool__(), falling back to len(x) != 0; objects with neither are always True',
    'Keywords':   'True and False are keywords, so assigning to them is a SyntaxError: cannot assign to True',
    '~True':      '~ on a bool acts on the int (~True is -2) and has been deprecated since 3.12 — use not',
  },

  related: [
    { name: 'None',   slug: 'none',   when: 'The third keyword constant — falsy, but not False' },
    { name: 'if',     slug: 'if',     when: 'Where truthiness is tested' },
    { name: 'bool()', slug: 'bool',   when: 'Convert any value to True / False', category: 'functions' },
    { name: 'sum()',  slug: 'sum',    when: 'Count True values', category: 'functions' },
    { name: 'not',    slug: 'not',    when: 'Negate a truth value', category: 'operators' },
    { name: 'and',    slug: 'and',    when: 'Short-circuit logic; returns an operand, not always a bool', category: 'operators' },
  ],

  faq: [
    {
      q: 'Why does True + True equal 2 in Python?',
      a: 'bool is a subclass of int: True is the integer 1 and False is 0 with a different repr. Arithmetic uses the int behaviour, so True + True is 2 and sum() of booleans counts the True values.',
    },
    {
      q: 'Why is bool("False") True?',
      a: 'bool() on a string only checks whether it is empty. Any non-empty string — "False", "0", " " — is truthy. To interpret text, compare it: text.strip().lower() in {"true", "1", "yes"}.',
    },
    {
      q: 'Should I write if x == True or if x is True?',
      a: 'Usually neither: write if x. == True is really == 1, so it fails for other truthy values. is True is correct only when you must distinguish the True object from other truthy values (for example a tri-state True / False / None).',
    },
    {
      q: 'Which values are falsy in Python?',
      a: 'None, False, zero of any numeric type (0, 0.0, 0j, Decimal(0)), empty sequences and collections ("", [], (), {}, set(), range(0)), and objects whose __bool__ returns False or whose __len__ returns 0. Everything else is truthy.',
    },
  ],

  history: [
    { version: '3.12', note: 'The bitwise inversion operator ~ on bool is deprecated.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/constants.html#True',
    meta:  'Built-in Constants — True / False',
  },
};
