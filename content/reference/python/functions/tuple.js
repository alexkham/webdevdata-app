// content/reference/python/functions/tuple.js

export const meta = {
  slug:        'tuple',
  name:        'tuple',
  signature:   'tuple([iterable])',
  blurb:       'Build an immutable, hashable sequence — usable as a dict key.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'tuple constructor immutable hashable dict key convert iterable fixed sequence freeze',
};

export const method = {
  slug:      'tuple',
  name:      'tuple',
  signature: 'tuple([iterable])',
  returns:   { type: 'tuple', desc: 'A new tuple holding the items of iterable in order. With no argument, the empty tuple.' },

  category:    'Built-in function / type',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'A list that cannot change, and is hashable because of it. That hashability is usually the reason to reach for one.',

  cheat: {
    commonCall: 'tuple(iterable)',
    returns:    'a new tuple — immutable and hashable if its items are',
    replaces:   'a list when the value must be a dict key or set member',
    watchOut:   'a one-item tuple needs the trailing comma: (x,) not (x)',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: false, default: '()', desc: 'Any iterable — string, list, set, dict, generator. Omitted gives the empty tuple.' },
  ],

  demoParams: [
    { name: 'iterable', type: 'str', hint: 'a string to split into characters', input: 'text' },
  ],
  cases: [
    { id: 'word',   label: 'a word',        values: { iterable: 'abc' } },
    { id: 'single', label: 'one character', values: { iterable: 'x' } },
    { id: 'longer', label: 'longer string', values: { iterable: 'hello' } },
    { id: 'empty',  label: 'empty string',  values: { iterable: '' } },
  ],
  demoExplainer: 'tuple copies the items of an iterable into a fixed sequence, exactly like list but without the ability to change afterwards. Watch the one-character case: the result prints as ("x",) with a trailing comma, which is how Python distinguishes a one-item tuple from a parenthesised expression. The empty case prints as () with no comma needed.',

  patterns: [
    {
      name: 'Use a sequence as a dict key',
      desc: 'The headline use — lists cannot be keys, tuples can.',
      code: 'cache[(x, y)] = compute(x, y)',
    },
    {
      name: 'Freeze a list before sharing it',
      desc: 'Callers cannot mutate what they are given.',
      code: 'return tuple(self._items)',
    },
    {
      name: 'Group rows for uniqueness',
      desc: 'Tuples hash, so a set of them deduplicates whole records.',
      code: 'unique_rows = {tuple(row) for row in rows}',
    },
  ],

  examples: [
    { title: 'From a string',    code: "tuple('abc')",          returns: "('a', 'b', 'c')" },
    { title: 'One item',         code: "tuple('x')",            returns: "('x',)  # trailing comma" },
    { title: 'From a list',      code: 'tuple([1, 2])',         returns: '(1, 2)' },
    { title: 'Empty',            code: 'tuple()',               returns: '()' },
    { title: 'Usable as a key',  code: 'd = {(1, 2): "point"}\nd[(1, 2)]', returns: "'point'" },
    { title: 'A list cannot be', code: 'd = {[1, 2]: "point"}', returns: "TypeError: unhashable type: 'list'" },
  ],

  pitfalls: [
    {
      name: 'A one-item tuple needs the trailing comma',
      desc: 'Parentheses do not make a tuple — the comma does. (x) is just x in brackets, which silently gives the wrong type rather than an error.',
      wrong: { label: 'Not a tuple', code: "t = ('a')\ntype(t)", output: "<class 'str'>" },
      fix:   { label: 'Add the comma', code: "t = ('a',)\ntype(t)", output: "<class 'tuple'>" },
    },
    {
      name: 'Immutable does not mean unchangeable all the way down',
      desc: 'The tuple fixes which objects it holds, not what those objects contain. A tuple with a list inside can still change, and it stops being hashable.',
      wrong: { label: 'Inner list mutates', code: 't = ([1], [2])\nt[0].append(99)\nt', output: '([1, 99], [2])' },
      fix:   { label: 'Freeze all the way', code: 't = ((1,), (2,))\nhash(t)', output: 'hashable and stable' },
    },
    {
      name: 'Hashable only if every item is',
      desc: 'Tuples get their hash from their contents, so one unhashable element makes the whole tuple unhashable — usually discovered at the moment you try to use it as a key.',
      wrong: { label: 'Contains a list', code: 'hash(([1], 2))', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'All hashable',    code: 'hash(((1,), 2))', output: 'an int' },
    },
    {
      name: 'A string still explodes into characters',
      desc: 'Same trap as list. tuple("abc") is three elements, not one.',
      wrong: { label: 'Per character', code: "tuple('abc')", output: "('a', 'b', 'c')" },
      fix:   { label: 'Wrap it',       code: "('abc',)", output: "('abc',)" },
    },
  ],

  when: {
    use: [
      'The value must be a dict key or a set member',
      'Returning a sequence callers should not mutate',
      'Fixed-shape records where the positions have meaning',
      'Deduplicating whole rows via a set',
    ],
    avoid: [
      'The contents will change → list',
      'Fields deserve names → collections.namedtuple or a dataclass',
      'You need uniqueness within the sequence → set or frozenset',
    ],
  },

  notes: {
    complexity: 'O(n) — every item is copied into the new tuple',
    return:     'A new tuple; note that tuple(t) may return t itself when t is already a tuple',
    cpython:    'Objects/tupleobject.c :: tuple_new_impl',
    memory:     'Allocates exactly n slots — no growth room, so slightly smaller than a list',
    threadSafe: 'Yes — tuples are immutable',
  },

  related: [
    { name: 'list',        slug: 'list',        when: 'You need to change the contents afterwards' },
    { name: 'frozenset',   slug: 'frozenset',   when: 'Immutable AND unique, with no ordering' },
    { name: 'tuple.count', slug: 'tuple-count', when: 'Tally occurrences inside the tuple' },
    { name: 'tuple.index', slug: 'tuple-index', when: 'Find a value\'s position inside the tuple' },
  ],

  faq: [
    {
      q: 'Why does tuple(x) sometimes return the same object?',
      a: 'Because tuples are immutable, copying one would be pointless — CPython returns the original when the argument is already a tuple. That is safe precisely because nothing can change it, and it is why tuple(t) is t may be True while list(l) is l never is.',
      code: 't = (1, 2)\ntuple(t) is t   # True',
    },
    {
      q: 'When should I use a tuple over a list?',
      a: 'When the value must be hashable — a dict key or set member — or when you want to signal that the contents are fixed. For fixed-shape records with meaningful positions, a namedtuple or dataclass communicates far more than a bare tuple.',
    },
    {
      q: 'Is a tuple faster than a list?',
      a: 'Slightly, and mostly in construction and memory rather than access. A tuple allocates exactly the slots it needs while a list keeps growth room, and constant tuples can be built once at compile time. Indexing speed is effectively identical, so pick on mutability, not performance.',
    },
  ],

  history: [
    { version: '1.0', note: 'tuple has been a core built-in type since the earliest Python.' },
    { version: '2.2', note: 'tuple became a true type usable as a base class, rather than a factory function.' },
    { version: '2.6', note: 'Gained the count and index methods, completing the Sequence interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#tuple',
    meta:  'tuple',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect sequence data structures' },
  ],
};
