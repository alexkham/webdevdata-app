// content/reference/python/stdlib/operator/bitwise.js — and_, or_, xor, invert / inv, lshift, rshift

export const meta = {
  slug:        'bitwise',
  name:        'operator.and_ / or_ / xor / invert / lshift / rshift',
  signature:   'operator.and_(a, b) · or_ · xor · lshift · rshift · invert(a) · inv(a)',
  blurb:       'The bitwise operators & | ^ ~ << >> as functions — on ints, and (for & | ^) on sets, bools and dicts too.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.and_ operator.or_ operator.xor operator.invert operator.inv operator.lshift operator.rshift and_ or_ xor invert inv lshift rshift bitwise and or xor function python bit shift complement set intersection union symmetric difference flags reduce or_ negative shift count',
};

export const method = {
  slug:      'bitwise',
  name:      'operator.and_ / or_ / xor / invert / lshift / rshift',
  signature: 'operator.and_(a, b, /) · or_(a, b, /) · xor(a, b, /) · lshift(a, b, /) · rshift(a, b, /) · invert(a, /) · inv(a, /)',
  returns:   { type: 'int | bool | set | dict', desc: 'What the operator returns: an int for ints, a bool for two bools (& | ^), a new set for sets.' },

  category:    'operator function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'and_, or_ and xor are &, | and ^ — bitwise on ints, intersection / union / symmetric difference on sets. invert (alias inv) is ~, lshift and rshift are << and >>. None of them is the boolean and / or.',

  covers: ['and_', 'or_', 'xor', 'invert', 'inv', 'lshift', 'rshift'],

  cheat: {
    commonCall: 'reduce(operator.or_, flags, 0)',
    returns:    'int (or set, bool, dict — whatever & | ^ give)',
    replaces:   'lambda a, b: a | b',
    watchOut:   'and_ is &, not the keyword and — no short-circuit',
  },

  parameters: [
    { name: 'a', type: 'int | bool | set | dict', required: true, default: null, desc: 'Left operand (the only one for invert / inv). Floats are rejected: bitwise operators need integers.' },
    { name: 'b', type: 'int | bool | set | dict', required: true, default: null, desc: 'Right operand. For lshift / rshift: the shift count, a non-negative int.' },
  ],

  modes: [
    {
      id: 'logic',
      label: '& | ^',
      blurb: 'and_, or_ and xor of two numbers. Try a negative number: Python ints behave as infinite two\'s complement.',
      params: [
        { name: 'a', type: 'int | float', hint: 'an int', input: 'auto' },
        { name: 'b', type: 'int | float', hint: 'an int', input: 'auto' },
      ],
      template: 'import operator\na, b = {$a}, {$b}\n(operator.and_(a, b), operator.or_(a, b), operator.xor(a, b))',
      cases: [
        { id: 'basic', label: '12, 10',   values: { a: '12', b: '10' } },
        { id: 'neg',   label: '-1, 255',  values: { a: '-1', b: '255' } },
        { id: 'mask',  label: '-20, 15',  values: { a: '-20', b: '15' } },
        { id: 'float', label: '1.5, 1',   values: { a: '1.5', b: '1' } },
      ],
    },
    {
      id: 'shift',
      label: '<< >>',
      blurb: 'Shift left multiplies by 2 ** n, shift right floor-divides by 2 ** n.',
      params: [
        { name: 'x', type: 'int',      hint: 'value', input: 'auto' },
        { name: 'n', type: 'int',      hint: 'count', input: 'number' },
      ],
      template: 'import operator\nx, n = {$x}, {$n}\n(operator.lshift(x, n), operator.rshift(x, n))',
      cases: [
        { id: 'pos',   label: '5, 3',     values: { x: '5', n: '3' } },
        { id: 'neg',   label: '-20, 2',   values: { x: '-20', n: '2' } },
        { id: 'big',   label: '1, 70',    values: { x: '1', n: '70' } },
        { id: 'minus', label: '1, -1',    values: { x: '1', n: '-1' } },
      ],
    },
    {
      id: 'invert',
      label: '~',
      blurb: 'invert and inv both compute ~x, which equals -x - 1.',
      params: [{ name: 'x', type: 'int | float', hint: 'an int', input: 'auto' }],
      template: 'import operator\nx = {$x}\n(operator.invert(x), operator.inv(x), -x - 1)',
      cases: [
        { id: 'five',  label: '5',   values: { x: '5' } },
        { id: 'zero',  label: '0',   values: { x: '0' } },
        { id: 'neg',   label: '-1',  values: { x: '-1' } },
        { id: 'float', label: '2.5', values: { x: '2.5' } },
      ],
    },
    {
      id: 'sets',
      label: 'sets',
      blurb: '& | ^ on sets (and the set difference sub for comparison). Sets print in hash order, so each result is sorted.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: 'import operator\na, b = set({$a}), set({$b})\n[sorted(f(a, b)) for f in (operator.and_, operator.or_, operator.xor, operator.sub)]',
      cases: [
        { id: 'tags',  label: 'tags',      values: { a: 'python, web, api', b: 'api, python, cli' } },
        { id: 'empty', label: 'empty b',   values: { a: 'x, y', b: '' } },
      ],
    },
  ],
  demoExplainer: "Python ints have no fixed width: they behave as if the sign bit repeated forever, so -1 & 255 is 255 and -1 | 255 is -1. That is also why ~x is -x - 1 (~5 is -6, ~0 is -1), and why -20 >> 2 is -5 — a right shift floors, exactly like -20 // 4. A negative shift count is a ValueError, and floats are rejected by every bitwise function. On sets the same functions are intersection, union and symmetric difference.",

  patterns: [
    {
      name: 'Combine flags',
      desc: 'OR together a list of bit flags; reduce needs a start value for an empty list.',
      code: 'from functools import reduce\nimport operator\nmask = reduce(operator.or_, flags, 0)',
    },
    {
      name: 'Intersection of many sets',
      desc: 'and_ folds set intersection over a list (set.intersection(*sets) does the same).',
      code: 'from functools import reduce\nimport operator\ncommon = reduce(operator.and_, map(set, tag_lists))',
    },
    {
      name: 'Merge dicts left to right (3.9+)',
      desc: 'or_ on dicts is the | merge: later dicts win.',
      code: 'from functools import reduce\nimport operator\nconfig = reduce(operator.or_, [defaults, file_settings, cli_settings], {})',
    },
  ],

  examples: [
    { title: '& | ^ on ints',            code: 'import operator\noperator.and_(12, 10), operator.or_(12, 10), operator.xor(12, 10)', returns: '(8, 14, 6)' },
    { title: 'invert is ~x == -x - 1',   code: 'import operator\noperator.invert(5), operator.inv(5), operator.invert(-1)', returns: '(-6, -6, 0)' },
    { title: 'Shifts',                   code: 'import operator\noperator.lshift(1, 10), operator.rshift(1024, 3), operator.rshift(-20, 2)', returns: '(1024, 128, -5)' },
    { title: 'Set intersection',         code: 'import operator\noperator.and_({1, 2, 3}, {2, 3, 4}) == {2, 3}', returns: 'True' },
    { title: 'Dict merge (3.9+)',        code: "import operator\noperator.or_({'a': 1}, {'b': 2})", returns: "{'a': 1, 'b': 2}" },
    { title: 'Two bools stay bools',     code: 'import operator\noperator.and_(True, False), operator.xor(True, True)', returns: '(False, False)' },
    { title: 'OR a list of flags',       code: 'from functools import reduce\nimport operator\nreduce(operator.or_, [0b0001, 0b0100, 0b1000])', returns: '13' },
  ],

  pitfalls: [
    {
      name: 'Using and_ / or_ as the boolean keywords',
      desc: 'and_ is &: it evaluates both sides and works bit by bit, so 1 & 2 is 0 even though both are truthy. For "all true" / "any true" use all() and any().',
      wrong: { label: 'and_(1, 2)', code: 'import operator\noperator.and_(1, 2)', output: '0' },
      fix:   { label: 'all([1, 2])', code: 'all([1, 2])', output: 'True' },
    },
    {
      name: 'invert on a bool',
      desc: '~True is -2, not False: bool is an int subclass and ~ works on the integer 1. Since Python 3.12 it also emits a DeprecationWarning. Use not_ for boolean negation.',
      wrong: { label: 'invert(True)', code: 'import operator\nimport warnings\nwith warnings.catch_warnings():\n    warnings.simplefilter("ignore", DeprecationWarning)\n    result = operator.invert(True)\nresult', output: '-2' },
      fix:   { label: 'not_(True)', code: 'import operator\noperator.not_(True)', output: 'False' },
    },
    {
      name: 'A negative shift count',
      desc: 'Shifting by a negative amount does not shift the other way; it raises ValueError.',
      wrong: { label: 'lshift(1, -1)', code: 'import operator\noperator.lshift(1, -1)', output: 'ValueError: negative shift count' },
      fix:   { label: 'rshift(1, 1)',  code: 'import operator\noperator.rshift(1, 1)', output: '0' },
    },
  ],

  when: {
    use: [
      'Folding flags, masks or sets with reduce',
      'Passing & | ^ to map or a dispatch table',
    ],
    avoid: [
      'Boolean logic → and / or keywords, all(), any(); or not_ for negation',
      'Floats — bitwise operators accept only integers (and sets, bools, dicts for & | ^)',
    ],
  },

  notes: {
    cpython:     'Modules/_operator.c → PyNumber_And / Or / Xor / Invert / Lshift / Rshift',
    'inv':       'inv and invert behave identically but are two separate function objects (each with its own dunder alias, __inv__ and __invert__)',
    'Negative ints': 'Bitwise results treat ints as infinite two\'s complement: x >> n is x // 2 ** n (floor), ~x is -x - 1',
    'bool':      '& | ^ of two bools return a bool; ~ on a bool returns an int and is deprecated since 3.12',
  },

  related: [
    { name: '& operator',  slug: 'bitwise-and', when: 'The operator in depth', category: 'operators' },
    { name: '| operator',  slug: 'bitwise-or',  when: 'Union and merge',       category: 'operators' },
    { name: '^ operator',  slug: 'bitwise-xor', when: 'Exclusive or',          category: 'operators' },
    { name: '~ operator',  slug: 'invert',      when: 'Complement',            category: 'operators' },
    { name: '<< operator', slug: 'lshift',      when: 'Shift left',            category: 'operators' },
    { name: '>> operator', slug: 'rshift',      when: 'Shift right',           category: 'operators' },
    { name: 'truth and identity', slug: 'truth-identity', when: 'not_ — the boolean negation' },
    { name: 'functools.reduce', slug: 'reduce', when: 'Fold flags with or_', category: 'stdlib/functools' },
  ],

  faq: [
    {
      q: 'What is the difference between operator.and_ and the and keyword?',
      a: 'and_ is the bitwise & operator: it always evaluates both operands and combines them bit by bit (or intersects sets). The keyword and short-circuits and returns one of its operands. 1 and 2 is 2; operator.and_(1, 2) is 0.',
    },
    {
      q: 'Why is ~5 equal to -6 in Python?',
      a: 'Python ints behave like infinite two\'s-complement numbers, and in two\'s complement flipping every bit of x gives -x - 1. So operator.invert(5) is -6 and invert(-1) is 0.',
    },
    {
      q: 'Is there a difference between operator.inv and operator.invert?',
      a: 'Not in behaviour: both return ~a. They are separate function objects, though — operator.inv is operator.invert is False — so compare results, not the functions. invert matches the special method name __invert__.',
    },
    {
      q: 'Can operator.or_ merge dictionaries?',
      a: 'Yes, from Python 3.9: or_(d1, d2) is d1 | d2, a new dict where keys from d2 win. reduce(operator.or_, dicts, {}) merges a whole list.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.and_',
    meta:  'operator — bitwise operations',
  },
};
