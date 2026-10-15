// content/reference/python/stdlib/operator/truth-identity.js — not_, truth, is_, is_not

export const meta = {
  slug:        'truth-identity',
  name:        'operator.not_ / truth / is_ / is_not',
  signature:   'operator.not_(a) · truth(a) · is_(a, b) · is_not(a, b)',
  blurb:       'The truth test (truth, not_) and the identity test (is_, is_not) as functions — for filter, map and partial.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'operator.not_ operator.truth operator.is_ operator.is_not not_ truth is_ is_not python not function truthy falsy filter none values is not none partial is_not identity vs equality bool function',
};

export const method = {
  slug:      'truth-identity',
  name:      'operator.not_ / truth / is_ / is_not',
  signature: 'operator.not_(a, /) · truth(a, /) · is_(a, b, /) · is_not(a, b, /)',
  returns:   { type: 'bool', desc: 'truth(a) is bool(a), not_(a) is not a; is_(a, b) is a is b, is_not(a, b) is a is not b.' },

  category:    'operator function',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'truth and not_ ask "is this value truthy?" — the question if and while ask. is_ and is_not ask "is this the very same object?" — the question to ask about None.',

  covers: ['not_', 'truth', 'is_', 'is_not'],

  cheat: {
    commonCall: 'filter(partial(operator.is_not, None), values)',
    returns:    'True or False',
    replaces:   'lambda x: x is not None, lambda x: not x',
    watchOut:   "'0' and 'False' are truthy strings",
  },

  parameters: [
    { name: 'a', type: 'any', required: true,  default: null, desc: 'The value to test (truth, not_), or the left object (is_, is_not). Positional only.' },
    { name: 'b', type: 'any', required: false, default: null, desc: 'The object to compare identity with (is_, is_not only).' },
  ],

  modes: [
    {
      id: 'truth',
      label: 'truth / not_',
      blurb: 'Numbers typed as 0 or 2.5 become int or float; anything else (including an empty box) is a str.',
      params: [{ name: 'x', type: 'int | float | str', hint: 'a value', input: 'auto' }],
      template: 'import operator\nx = {$x}\n(operator.truth(x), operator.not_(x))',
      cases: [
        { id: 'zero',  label: '0',       values: { x: '0' } },
        { id: 'empty', label: "''",      values: { x: '' } },
        { id: 'false', label: "'False'", values: { x: 'False' } },
        { id: 'fzero', label: '0.0',     values: { x: '0.0' } },
        { id: 'neg',   label: '-1',      values: { x: '-1' } },
      ],
    },
    {
      id: 'filter',
      label: 'filter',
      blurb: 'Keep the truthy items. The list holds strings, and only the empty string is falsy.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' }],
      template: 'import operator\nlist(filter(operator.truth, {$items}))',
      cases: [
        { id: 'gaps',  label: 'a,,b',            values: { items: 'a,,b' } },
        { id: 'zeros', label: "'0', 'False', ''", values: { items: '0, False, ' } },
      ],
    },
    {
      id: 'none',
      label: 'is_not None',
      blurb: "A '-' item becomes None. is_not(v, None) drops only the Nones; truth drops '' as well.",
      params: [{ name: 'items', type: 'list[str]', hint: "comma-separated, '-' = None", input: 'csv' }],
      template: "import operator\nvalues = [None if v == '-' else v for v in {$items}]\n([v for v in values if operator.is_not(v, None)], list(filter(operator.truth, values)))",
      cases: [
        { id: 'mixed', label: 'a,,-,b',  values: { items: 'a,,-,b' } },
        { id: 'nones', label: '-,-',     values: { items: '-,-' } },
      ],
    },
  ],
  demoExplainer: "Falsy values are None, False, zero of any numeric type (0, 0.0) and empty containers and strings; everything else is truthy — including the strings '0' and 'False', which is why form and CSV input needs converting before a truth test. The None tab shows the difference that matters in practice: is_not(v, None) keeps the empty string, truth drops it.",

  patterns: [
    {
      name: 'Drop the Nones, keep the zeros',
      desc: 'partial(operator.is_not, None) is the one-argument predicate "v is not None" (None is not v reads the same way).',
      code: 'import operator\nfrom functools import partial\npresent = list(filter(partial(operator.is_not, None), values))',
    },
    {
      name: 'Drop every falsy value',
      desc: 'filter(None, values) is the same as filter(operator.truth, values).',
      code: 'import operator\ncleaned = list(filter(operator.truth, values))',
    },
    {
      name: 'Invert a list of flags',
      desc: 'map with not_ — the boolean negation (not ~, which is bitwise).',
      code: 'import operator\ninverted = list(map(operator.not_, flags))',
    },
    {
      name: 'Count None values',
      desc: 'Sum the booleans of an identity test.',
      code: 'import operator\nmissing = sum(map(operator.is_, values, [None] * len(values)))',
    },
  ],

  examples: [
    { title: 'Truthiness of containers',  code: "import operator\noperator.truth([]), operator.truth([0]), operator.not_(''), operator.not_('0')", returns: '(False, True, True, False)' },
    { title: 'Same object vs equal value', code: 'import operator\na = [1, 2]\nb = a\nc = list(a)\noperator.is_(a, b), operator.is_(a, c), operator.eq(a, c), operator.is_not(a, c)', returns: '(True, False, True, True)' },
    { title: 'Keep 0 and \'\', drop None',   code: "import operator\nfrom functools import partial\nvalues = [0, None, '', 'x', None]\nlist(filter(partial(operator.is_not, None), values))", returns: "[0, '', 'x']" },
    { title: 'Keep only truthy values',     code: "import operator\nlist(filter(operator.truth, [0, None, '', 'x', 3]))", returns: "['x', 3]" },
    { title: 'NaN is truthy',               code: "import operator\noperator.truth(0.0), operator.truth(float('nan'))", returns: '(False, True)' },
    { title: '__len__ decides for objects', code: 'import operator\nclass Box:\n    def __len__(self):\n        return 0\noperator.truth(Box()), operator.not_(Box())', returns: '(False, True)' },
    { title: 'None is a singleton',         code: 'import operator\noperator.is_(None, None), operator.is_not(1, None)', returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'Using is_ to compare values',
      desc: 'is_ asks whether two names point to the same object. Two equal lists are different objects — compare values with eq (==).',
      wrong: { label: 'is_(x, [])', code: 'import operator\nx = []\noperator.is_(x, [])', output: 'False' },
      fix:   { label: 'eq(x, [])', code: 'import operator\nx = []\noperator.eq(x, [])', output: 'True' },
    },
    {
      name: 'Testing text input for truth',
      desc: "Every non-empty string is truthy, so the text 'False' or '0' passes truth. Convert first, then test.",
      wrong: { label: "truth('False')", code: "import operator\noperator.truth('False')", output: 'True' },
      fix:   { label: 'compare the text', code: "answer = 'False'\nanswer.strip().lower() in ('1', 'true', 'yes')", output: 'False' },
    },
  ],

  when: {
    use: [
      'filter / map with a truth or identity test',
      'partial(operator.is_not, None) as a "not None" predicate (3.14 adds operator.is_not_none)',
    ],
    avoid: [
      'Ordinary conditions — if x:, if x is None: read better',
      'Comparing numbers or strings by value → eq; identity of equal ints and strs is an implementation detail',
    ],
  },

  notes: {
    cpython:   'not_ and truth call PyObject_Not / PyObject_IsTrue (__bool__, else __len__, else True); is_ and is_not compare object pointers — no method is ever called',
    'Dunders': 'not_ has the dunder alias __not__ (there is no __not__ special method on objects); truth, is_ and is_not have none',
    'Python 3.14': 'adds operator.is_none(a) and operator.is_not_none(a) — in 3.13 and earlier use partial(operator.is_, None) / partial(operator.is_not, None)',
  },

  related: [
    { name: 'not operator', slug: 'not',    when: 'The keyword not_ mirrors',       category: 'operators' },
    { name: 'is operator',  slug: 'is',     when: 'Identity in depth',             category: 'operators' },
    { name: 'is not',       slug: 'is-not', when: 'The negated identity test',     category: 'operators' },
    { name: 'bool()',       slug: 'bool',   when: 'truth(x) is bool(x)',           category: 'functions' },
    { name: 'filter()',     slug: 'filter', when: 'Where these predicates go',     category: 'functions' },
    { name: 'comparisons',  slug: 'comparisons', when: 'eq / ne compare values' },
  ],

  faq: [
    {
      q: 'What is the difference between operator.truth and bool?',
      a: 'None in result: truth(x) returns the same True or False as bool(x). truth is a plain function rather than a type, so it reads as a predicate in filter or map — though filter(None, items) does the same job.',
    },
    {
      q: 'How do I filter out None values but keep 0 and empty strings?',
      a: 'filter(partial(operator.is_not, None), values) or [v for v in values if v is not None]. Do not use filter(None, ...) or operator.truth: they drop 0, 0.0, empty strings and empty containers too.',
    },
    {
      q: 'Why is there operator.not_ but no operator.and_ for the keyword and?',
      a: 'not takes one operand, so a function can do exactly what the keyword does. and / or short-circuit — the right side may never be evaluated — which a function call cannot reproduce, because its arguments are evaluated first. operator.and_ is the bitwise &.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.truth',
    meta:  'operator — logical operations',
  },
};
