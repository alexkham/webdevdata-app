// content/reference/python/functions/int-is_integer.js
//
// Slug is type-prefixed: `is_integer` is an int method.

export const meta = {
  slug:        'int-is_integer',
  name:        'int.is_integer',
  signature:   'int.is_integer()',
  blurb:       'Always True — it exists so int and float answer the same question.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'is integer whole number check int float duck typing always true',
};

export const method = {
  slug:      'int-is_integer',
  name:      'int.is_integer',
  signature: 'int.is_integer()',
  returns:   { type: 'bool', desc: 'Always True. Every int is a whole number, so there is no input that returns False.' },

  category:    'Int method',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'Constant True by definition. Like as_integer_ratio, its value is the shared interface with float — not the answer.',

  cheat: {
    commonCall: 'value.is_integer()',
    returns:    'True for every int; on a float, True only when it has no fractional part',
    replaces:   'isinstance(v, int) or v == int(v) branching',
    watchOut:   'Python 3.12+ only — float has had it since 2.6, int is the late arrival',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'int', hint: 'integer', input: 'number' },
  ],
  demoTemplate: '({n}).is_integer()',
  cases: [
    { id: 'positive', label: 'positive (5)',     values: { n: 5 } },
    { id: 'zero',     label: 'zero',             values: { n: 0 } },
    { id: 'negative', label: 'negative (-7)',    values: { n: -7 } },
    { id: 'large',    label: 'large (999999)',   values: { n: 999999 } },
  ],
  demoExplainer: 'Every case returns True, and that is the whole behaviour — an int is a whole number by construction, so there is no input that could say otherwise. The method is worth knowing because float has the same name: (4.0).is_integer() is True and (4.5).is_integer() is False. Since 3.12 you can ask either type without checking which one you hold.',

  patterns: [
    {
      name: 'Accept a whole number of either type',
      desc: 'One call covers int and float, with no isinstance branch.',
      code: 'if value.is_integer():\n    use_as_index(int(value))',
    },
    {
      name: 'Validate parsed numeric input',
      desc: 'JSON gives you ints and floats interchangeably; this normalises the check.',
      code: 'if not qty.is_integer():\n    raise ValueError("quantity must be whole")',
    },
    {
      name: 'Filter a mixed numeric sequence',
      desc: 'Keeps whole values regardless of how each one was written.',
      code: 'wholes = [v for v in values if v.is_integer()]',
    },
  ],

  examples: [
    { title: 'Always True',       code: '(5).is_integer()',    returns: 'True' },
    { title: 'Zero too',          code: '(0).is_integer()',    returns: 'True' },
    { title: 'Negatives too',     code: '(-7).is_integer()',   returns: 'True' },
    { title: 'Float that is whole', code: '(4.0).is_integer()', returns: 'True' },
    { title: 'Float that is not',   code: '(4.5).is_integer()', returns: 'False' },
    { title: 'The useful contrast', code: '[v.is_integer() for v in (4, 4.0, 4.5)]', returns: '[True, True, False]' },
  ],

  pitfalls: [
    {
      name: 'It does not test the type',
      desc: 'The name reads like an isinstance check, but it asks whether the VALUE is whole. A float returns True when it has no fractional part, so is_integer() being True tells you nothing about whether you hold an int.',
      wrong: { label: 'Not a type check', code: 'v = 4.0\nv.is_integer()', output: 'True  # still a float' },
      fix:   { label: 'Check the type',   code: 'isinstance(v, int)', output: 'False' },
    },
    {
      name: 'Python 3.12 or newer only',
      desc: 'float has had is_integer since 2.6, so the call looks portable until an int reaches it on an older interpreter. That is exactly the mixed-type case the method was added to serve, which makes the failure easy to miss in testing.',
      wrong: { label: 'Fails on 3.11', code: '(5).is_integer()', output: "AttributeError: 'int' object has no attribute 'is_integer'" },
      fix:   { label: 'Portable form',  code: 'float(v).is_integer()', output: 'True  # works everywhere' },
    },
    {
      name: 'bool is an int, so it answers too',
      desc: 'True and False are ints in Python, so they inherit the method and report True. Harmless until a stray boolean slips through a numeric validation path unnoticed.',
      wrong: { label: 'Booleans pass', code: 'True.is_integer()', output: 'True' },
      fix:   { label: 'Exclude bool',  code: 'not isinstance(v, bool) and v.is_integer()', output: 'False for booleans' },
    },
  ],

  when: {
    use: [
      'Numeric code that accepts int and float interchangeably',
      'Validating that a parsed number is whole before using it as a count or index',
      'Replacing v == int(v) checks, which fail on inf and nan',
    ],
    avoid: [
      'You already know the value is an int — the answer is always True',
      'You actually want a type check → isinstance',
      'Supporting Python 3.11 or older → call float(v).is_integer() instead',
    ],
  },

  notes: {
    complexity: 'O(1) — returns a constant',
    return:     'The singleton True; never False for any int',
    cpython:    'Objects/longobject.c :: int_is_integer',
    memory:     'No allocation — True is a singleton',
    threadSafe: 'Yes — ints are immutable',
  },

  related: [
    { name: 'int.as_integer_ratio', slug: 'int-as_integer_ratio', when: 'The same shared-interface idea, for exact fractions' },
    { name: 'float',                slug: 'float',                when: 'The type where the answer can actually be False' },
    { name: 'isinstance',           slug: 'isinstance',           when: 'You want a real type check instead' },
    { name: 'round',                slug: 'round',                when: 'Make a value whole rather than testing it' },
  ],

  faq: [
    {
      q: 'Why does a method that is always True exist?',
      a: 'So int and float present the same interface. Before 3.12 you had to write isinstance(v, int) or v == int(v) to handle both; now one call covers either. The constant answer on int is the price of that symmetry.',
      code: '[v.is_integer() for v in (4, 4.0, 4.5)]\n# [True, True, False]',
    },
    {
      q: 'How is this different from isinstance(v, int)?',
      a: 'is_integer asks about the value, isinstance asks about the type. 4.0 is a whole number but not an int, so is_integer says True and isinstance says False. Pick based on which question you actually mean.',
      code: '(4.0).is_integer()      # True\nisinstance(4.0, int)    # False',
    },
    {
      q: 'What should I use on Python 3.11 and earlier?',
      a: 'float(v).is_integer() works on every version and gives the same answer, because float has had the method since 2.6. It costs one conversion, and loses precision on ints above 2 ** 53, so guard the very large cases if they matter.',
      code: 'float(v).is_integer()',
    },
  ],

  history: [
    { version: '3.12', note: 'int.is_integer added, matching the float method that has existed since 2.6.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#int.is_integer',
    meta:  'int.is_integer',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
