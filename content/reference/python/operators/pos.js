// content/reference/python/operators/pos.js
//
// Unary plus. Slug is `pos` (after __pos__) because `add` is the binary
// addition operator.

export const meta = {
  slug:        'pos',
  name:        '+x',
  signature:   '+a',
  blurb:       'Unary plus — a no-op on numbers, but not on everything.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'unary plus positive sign no-op pos operator prefix decimal counter identity',
};

export const method = {
  slug:      'pos',
  name:      '+x',
  signature: '+a',
  returns:   { type: 'number', desc: 'The operand, generally unchanged. Calls __pos__, which some types use to do real work.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Looks like dead code, and on int and float it is. It survives because __pos__ is a hook — Decimal and Counter both use it for something real.',

  cheat: {
    commonCall: '+x',
    returns:    'the same value for int and float',
    replaces:   'nothing, on ordinary numbers',
    watchOut:   'on Decimal it applies rounding; on Counter it drops non-positive counts',
  },

  parameters: [
    { name: 'a', type: 'number', required: true, default: null, desc: 'Operand. Any type defining __pos__ works; str and list do not.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'value', input: 'float' },
  ],
  demoTemplate: '+{a}',
  cases: [
    { id: 'positive', label: 'positive',   values: { a: 5 } },
    { id: 'negative', label: 'negative',   values: { a: -5 } },
    { id: 'zero',     label: 'zero',       values: { a: 0 } },
    { id: 'fraction', label: 'fractional', values: { a: 2.5 } },
  ],
  demoExplainer: 'On ordinary numbers unary plus does nothing at all — a negative stays negative, and the value comes back unchanged. That is the point worth internalising: it does NOT make a number positive. Its reason for existing is that it calls __pos__, and a few standard-library types use that hook to do genuinely useful work.',

  patterns: [
    {
      name: 'Drop non-positive counts from a Counter',
      desc: 'The best-known real use of unary plus in the standard library.',
      code: 'from collections import Counter\nc = Counter(a=3, b=-1, c=0)\npositive_only = +c   # Counter({"a": 3})',
    },
    {
      name: 'Apply Decimal context rounding',
      desc: 'Forces the current context precision onto a value.',
      code: 'from decimal import Decimal, localcontext\nwith localcontext() as ctx:\n    ctx.prec = 3\n    rounded = +Decimal("1.23456")',
    },
    {
      name: 'Symmetry in generated code',
      desc: 'Where a sign is inserted programmatically, + keeps the shape uniform.',
      code: 'expr = f"{sign}{value}"   # sign is "+" or "-"',
    },
  ],

  examples: [
    { title: 'Unchanged',        code: '+5',         returns: '5' },
    { title: 'Stays negative',   code: '+(-5)',      returns: '-5' },
    { title: 'Float',            code: '+2.5',       returns: '2.5' },
    { title: 'Not abs',          code: '+(-5) == abs(-5)', returns: 'False' },
    { title: 'bool becomes int', code: '+True',      returns: '1' },
    { title: 'Counter filters',  code: 'from collections import Counter\n+Counter(a=3, b=-1)', returns: "Counter({'a': 3})" },
  ],

  pitfalls: [
    {
      name: 'It does not make a number positive',
      desc: 'The single most common misreading. +x is not abs(x) — a negative operand comes back negative, silently, with no error to catch the mistake.',
      wrong: { label: 'Still negative', code: '+(-5)', output: '-5' },
      fix:   { label: 'Use abs',        code: 'abs(-5)', output: '5' },
    },
    {
      name: 'It is not always a no-op',
      desc: 'On int and float it does nothing, which teaches people to ignore it. On Decimal it applies context rounding, and on Counter it strips zero and negative counts — deleting it there changes behaviour.',
      wrong: { label: 'Assumed harmless', code: 'from collections import Counter\nc = Counter(a=3, b=-1)\nc   # without the +', output: "Counter({'a': 3, 'b': -1})" },
      fix:   { label: 'The + matters',    code: '+c', output: "Counter({'a': 3})" },
    },
    {
      name: 'Not defined for str or list',
      desc: 'Unary plus needs __pos__, which sequences lack. It is a TypeError rather than a harmless no-op, which surprises people who expect it to be ignorable.',
      wrong: { label: 'No __pos__', code: "+'abc'", output: "TypeError: bad operand type for unary +: 'str'" },
      fix:   { label: 'Drop it',    code: "'abc'", output: "'abc'" },
    },
    {
      name: 'It converts bool to int',
      desc: 'Like unary minus, it goes through the numeric protocol, so True comes back as 1 rather than True. An easy way to lose a boolean type by accident.',
      wrong: { label: 'Type changed', code: '+True', output: '1' },
      fix:   { label: 'Leave it alone', code: 'True', output: 'True' },
    },
  ],

  when: {
    use: [
      'Filtering a Counter down to positive counts',
      'Forcing Decimal context rounding onto a value',
      'Generated or templated code where a leading sign keeps the shape uniform',
    ],
    avoid: [
      'Making a number positive → abs',
      'Ordinary arithmetic on int and float — it does nothing',
      'Sequences, where it raises rather than being ignored',
    ],
  },

  notes: {
    complexity: 'O(1) for numbers; whatever __pos__ costs for custom types',
    return:     'For int and float, CPython may return the same object; bool becomes int',
    cpython:    'Objects/abstract.c :: PyNumber_Positive, dispatching to __pos__',
    memory:     'Usually no allocation for built-in numbers',
    threadSafe: 'Yes — numbers are immutable',
  },

  related: [
    { name: '-x',  slug: 'neg',  when: 'The unary minus counterpart, which actually changes the value' },
    { name: '+',   slug: 'add',  when: 'Binary addition, the same character in infix position' },
    { name: 'abs', slug: 'abs',  when: 'What people usually mean when they reach for +x', category: 'functions' },
    { name: 'int', slug: 'int',  when: 'Explicit numeric conversion', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is unary plus actually for?',
      a: 'It exists so types can hook __pos__. Counter uses it to drop non-positive counts, and Decimal uses it to apply the current context precision. On plain numbers it is genuinely a no-op — the operator is there for the types that need it.',
      code: '+Counter(a=3, b=-1)\n# Counter({"a": 3})',
    },
    {
      q: 'Is +x the same as abs(x)?',
      a: 'No, and confusing the two is the classic mistake. +(-5) is -5; abs(-5) is 5. Unary plus preserves the sign, it does not remove it.',
      code: '+(-5)      # -5\nabs(-5)    # 5',
    },
    {
      q: 'Can I safely delete a stray +?',
      a: 'On int and float, yes. On Decimal, Counter or any custom type, no — check what __pos__ does first, because there it is load-bearing rather than decorative.',
    },
  ],

  history: [
    { version: '1.0', note: 'Unary plus present since the earliest Python.' },
    { version: '3.3', note: 'Counter gained the unary + form for stripping non-positive counts.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#unary-arithmetic-and-bitwise-operations',
    meta:  'Unary arithmetic operations',
  },

  tryInTool: [],
};
