// content/reference/python/stdlib/operator/sequences.js — concat, contains, countOf, indexOf, getitem, setitem, delitem, length_hint

export const meta = {
  slug:        'sequences',
  name:        'operator.contains / countOf / indexOf / getitem / setitem / delitem / concat / length_hint',
  signature:   'operator.contains(a, b) · countOf(a, b) · indexOf(a, b) · getitem(a, b) · setitem(a, b, c) · delitem(a, b) · concat(a, b) · length_hint(obj, default=0)',
  blurb:       'Membership, counting, indexing and concatenation as functions: b in a, a[b], a[b] = c, del a[b], a + b for sequences, and a length estimate for iterators.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (length_hint: 3.4+)',
  searchTerms: 'operator.contains operator.countOf operator.indexOf operator.getitem operator.setitem operator.delitem operator.concat operator.length_hint contains countOf indexOf getitem setitem delitem concat length_hint python in operator function index of element count occurrences sequence.index(x): x not in sequence length hint iterator getitem slice',
};

export const method = {
  slug:      'sequences',
  name:      'operator.contains / countOf / indexOf / getitem / setitem / delitem / concat / length_hint',
  signature: 'operator.contains(a, b, /) · countOf(a, b, /) · indexOf(a, b, /) · getitem(a, b, /) · setitem(a, b, c, /) · delitem(a, b, /) · concat(a, b, /) · length_hint(obj, default=0, /)',
  returns:   { type: 'bool | int | any', desc: 'contains → bool; countOf, indexOf, length_hint → int; getitem → the item; concat → a new sequence; setitem and delitem → None.' },

  category:    'operator function',
  version:     'All Python 3 versions (length_hint: 3.4+)',
  hasLiveDemo: true,

  subtitle: 'contains(a, b) is b in a — note the reversed order. countOf and indexOf walk the items one by one, so on a str they see single characters: countOf("banana", "an") is 0. getitem / setitem / delitem are a[b], a[b] = c and del a[b], slices included.',

  covers: ['concat', 'contains', 'countOf', 'indexOf', 'getitem', 'setitem', 'delitem', 'length_hint'],

  cheat: {
    commonCall: 'operator.contains(seq, x)',
    returns:    'x in seq',
    replaces:   'lambda s: x in s, lambda s, i: s[i]',
    watchOut:   'contains takes the container FIRST; countOf on a str counts characters',
  },

  parameters: [
    { name: 'a',       type: 'sequence | mapping | iterable', required: true,  default: null, desc: 'The container (contains, countOf, indexOf, getitem, setitem, delitem) or the left sequence (concat).' },
    { name: 'b',       type: 'any',                           required: true,  default: null, desc: 'The value to find or count, the index / key / slice, or the right sequence (concat).' },
    { name: 'c',       type: 'any',                           required: true,  default: null, desc: 'setitem only: the value to store.' },
    { name: 'obj',     type: 'any',                           required: true,  default: null, desc: 'length_hint: any object — its len() if it has one, else its __length_hint__(), else default.' },
    { name: 'default', type: 'int',                           required: false, default: '0',  desc: 'length_hint: returned when no length is known.' },
  ],

  modes: [
    {
      id: 'search',
      label: 'find in a list',
      blurb: 'contains, countOf and indexOf on a list of strings.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'x',     type: 'str',       hint: 'value to find',   input: 'text' },
      ],
      template: 'import operator\nseq = {$items}\nx = {$x}\n(operator.contains(seq, x), operator.countOf(seq, x), operator.indexOf(seq, x))',
      cases: [
        { id: 'found',   label: "'red'",  values: { items: 'red, green, red', x: 'red' } },
        { id: 'second',  label: "'green'", values: { items: 'red, green, red', x: 'green' } },
        { id: 'missing', label: "'blue'", values: { items: 'red, green, red', x: 'blue' } },
      ],
    },
    {
      id: 'string',
      label: 'find in a str',
      blurb: "On a str, contains looks for a substring but countOf compares single characters — str.count counts substrings.",
      params: [
        { name: 's', type: 'str', hint: 'the text',      input: 'text' },
        { name: 'x', type: 'str', hint: 'what to find',  input: 'text' },
      ],
      template: 'import operator\ns, x = {$s}, {$x}\n(operator.contains(s, x), operator.countOf(s, x), s.count(x))',
      cases: [
        { id: 'sub',  label: "'an'",  values: { s: 'banana', x: 'an' } },
        { id: 'char', label: "'a'",   values: { s: 'banana', x: 'a' } },
        { id: 'none', label: "'x'",   values: { s: 'banana', x: 'x' } },
      ],
    },
    {
      id: 'items',
      label: 'getitem / delitem',
      blurb: 'Read an item, then delete it — like list.pop(i), in two steps.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'i',     type: 'int',       hint: 'index',           input: 'number' },
      ],
      template: 'import operator\nseq = {$items}\nfirst = operator.getitem(seq, {$i})\noperator.delitem(seq, {$i})\n(first, seq)',
      cases: [
        { id: 'zero', label: '0',  values: { items: 'a, b, c', i: '0' } },
        { id: 'last', label: '-1', values: { items: 'a, b, c', i: '-1' } },
        { id: 'out',  label: '5',  values: { items: 'a, b, c', i: '5' } },
      ],
    },
    {
      id: 'concat',
      label: 'concat',
      blurb: 'concat is + for sequences only. 7 and 2.5 become numbers; anything else is a str.',
      params: [
        { name: 'a', type: 'str | int | float', hint: 'left',  input: 'auto' },
        { name: 'b', type: 'str | int | float', hint: 'right', input: 'auto' },
      ],
      template: 'import operator\noperator.concat({$a}, {$b})',
      cases: [
        { id: 'strs',  label: "'ab', 'cd'", values: { a: 'ab', b: 'cd' } },
        { id: 'nums',  label: '1, 2',       values: { a: '1', b: '2' } },
        { id: 'mixed', label: "'ab', 3",    values: { a: 'ab', b: '3' } },
      ],
    },
    {
      id: 'hint',
      label: 'length_hint',
      blurb: 'A list iterator knows how many items are left; a map object does not, so the default comes back.',
      params: [
        { name: 'items',   type: 'list[str]', hint: 'comma-separated',  input: 'csv' },
        { name: 'default', type: 'int',       hint: 'fallback length',  input: 'number' },
      ],
      template: 'import operator\nit = iter({$items})\nnext(it, None)\n(operator.length_hint(it), operator.length_hint(map(str, it), {$default}))',
      cases: [
        { id: 'four',  label: '4 items',  values: { items: 'a, b, c, d', default: '0' } },
        { id: 'empty', label: 'empty',    values: { items: '', default: '-1' } },
      ],
    },
  ],
  demoExplainer: "indexOf raises ValueError: sequence.index(x): x not in sequence when nothing matches — the same message for every container, unlike list.index. On a str, countOf and indexOf iterate characters, so a two-character x is never found by them while contains and str.count still see the substring. A negative index counts from the end in getitem and delitem; an index past the end is IndexError: list index out of range. concat refuses numbers outright ('int' object can't be concatenated) where add would add them. length_hint never consumes anything: it asks the object for len() or __length_hint__() and falls back to the default.",

  patterns: [
    {
      name: 'Membership test as a predicate',
      desc: 'contains takes the container first, so partial fixes the container.',
      code: "import operator\nfrom functools import partial\nis_vowel = partial(operator.contains, 'aeiou')\nvowels = list(filter(is_vowel, word))",
    },
    {
      name: 'Pull one column out of rows',
      desc: 'map getitem with a repeated index — or simply map(itemgetter(i), rows).',
      code: 'import operator\nfrom itertools import repeat\nnames = list(map(operator.getitem, rows, repeat(0)))',
    },
    {
      name: 'Preallocate from an iterator',
      desc: 'length_hint is an estimate only — never rely on it for correctness.',
      code: 'import operator\nbuffer = [None] * operator.length_hint(iterator, 16)',
    },
    {
      name: 'Slice assignment as a call',
      desc: 'setitem and delitem accept slice objects, like seq[i:j] = values.',
      code: 'import operator\noperator.setitem(seq, slice(0, 2), replacement)\noperator.delitem(seq, slice(-2, None))',
    },
  ],

  examples: [
    { title: 'contains is b in a',        code: "import operator\noperator.contains([1, 2, 3], 2), operator.contains('hello', 'ell'), operator.contains({'a': 1}, 'a')", returns: '(True, True, True)' },
    { title: 'countOf and indexOf',       code: "import operator\noperator.countOf([1, 2, 1, 1], 1), operator.indexOf(['a', 'b', 'c'], 'c')", returns: '(3, 2)' },
    { title: 'countOf sees characters',   code: "import operator\noperator.countOf('banana', 'an'), 'banana'.count('an')", returns: '(0, 2)' },
    { title: 'setitem and delitem on a dict', code: "import operator\nd = {'a': 1}\noperator.setitem(d, 'b', 2)\noperator.delitem(d, 'a')\nd", returns: "{'b': 2}" },
    { title: 'Slices are just keys',      code: 'import operator\nseq = [0, 1, 2, 3, 4, 5]\noperator.getitem(seq, slice(1, 4)), operator.getitem(seq, -1)', returns: '([1, 2, 3], 5)' },
    { title: 'Slice assignment and deletion', code: "import operator\nseq = [0, 1, 2, 3, 4, 5]\noperator.setitem(seq, slice(0, 2), ['a'])\noperator.delitem(seq, slice(-2, None))\nseq", returns: "['a', 2, 3]" },
    { title: 'concat joins sequences',    code: "import operator\noperator.concat([1], [2, 3]), operator.concat('ab', 'cd')", returns: "([1, 2, 3], 'abcd')" },
    { title: 'length_hint three ways',    code: "import operator\nit = iter([10, 20, 30])\nnext(it)\noperator.length_hint(it), operator.length_hint(x for x in 'abc'), operator.length_hint(5, -1)", returns: '(2, 0, -1)' },
  ],

  pitfalls: [
    {
      name: 'Swapping the arguments of contains',
      desc: 'contains(a, b) is b in a — container first. With the arguments swapped you test whether the container is inside the item.',
      wrong: { label: "contains('e', 'hello')", code: "import operator\noperator.contains('e', 'hello')", output: 'False' },
      fix:   { label: "contains('hello', 'e')", code: "import operator\noperator.contains('hello', 'e')", output: 'True' },
    },
    {
      name: 'indexOf for a substring',
      desc: 'indexOf compares items, and the items of a str are characters. Use str.find or str.index for substrings.',
      wrong: { label: "indexOf('banana', 'an')", code: "import operator\noperator.indexOf('banana', 'an')", output: 'ValueError: sequence.index(x): x not in sequence' },
      fix:   { label: "'banana'.find('an')",     code: "'banana'.find('an')", output: '1' },
    },
    {
      name: 'concat with mixed sequence types',
      desc: 'concat is +, which does not mix list and tuple. Convert one side, or use itertools.chain for any iterables.',
      wrong: { label: 'concat([1], (2,))', code: 'import operator\noperator.concat([1], (2,))', output: 'TypeError: can only concatenate list (not "tuple") to list' },
      fix:   { label: 'list(chain(...))',  code: 'from itertools import chain\nlist(chain([1], (2,)))', output: '[1, 2]' },
    },
  ],

  when: {
    use: [
      'Passing indexing or membership to map / filter / partial',
      'Code that receives the key or index as data (setitem / getitem with computed keys or slices)',
    ],
    avoid: [
      'Extracting fields for sort keys → itemgetter is shorter and faster',
      'Substring search → str methods (find, index, count)',
    ],
  },

  notes: {
    cpython:      'contains → PySequence_Contains (__contains__, else iteration); countOf / indexOf → PySequence_Count / PySequence_Index, which iterate and compare each item with == (identity counts as equal); getitem / setitem / delitem → PyObject_GetItem / SetItem / DelItem',
    'Dunders':    'concat, contains, getitem, setitem and delitem have dunder aliases (__concat__ …); countOf, indexOf and length_hint do not',
    'length_hint': 'PEP 424: len() if available, else __length_hint__(), else default — used by list() and friends to preallocate; the value may be wrong for objects that only estimate',
  },

  related: [
    { name: 'in operator',  slug: 'in',     when: 'What contains does',              category: 'operators' },
    { name: 'not in',       slug: 'not-in', when: 'The negated membership test',      category: 'operators' },
    { name: 'len()',        slug: 'len',    when: 'The exact length length_hint tries first', category: 'functions' },
    { name: 'list.index()', slug: 'list-index', when: 'Index of an item, with start/stop', category: 'functions' },
    { name: 'list.count()', slug: 'list-count', when: 'Count items in a list',          category: 'functions' },
    { name: 'itemgetter',   slug: 'itemgetter', when: 'getitem as a ready-made key function' },
  ],

  faq: [
    {
      q: 'What does operator.contains do?',
      a: 'operator.contains(a, b) returns b in a — the container comes first, the reverse of the in expression. It uses __contains__ when the container has one (dict keys, set members, substrings of a str) and falls back to iterating.',
    },
    {
      q: 'What does "sequence.index(x): x not in sequence" mean?',
      a: 'It is the ValueError operator.indexOf raises when no item equals x. list.index raises a different message (e.g. "3 is not in list"), and str.index says "substring not found".',
    },
    {
      q: 'What is the difference between operator.countOf and str.count?',
      a: 'countOf iterates the object and counts items equal to b; for a str the items are single characters, so countOf("banana", "an") is 0. str.count counts non-overlapping substrings: "banana".count("an") is 2.',
    },
    {
      q: 'When is operator.length_hint useful?',
      a: 'When you want to size a buffer for an iterator without consuming it. It returns len(obj) if the object has a length, otherwise the iterator\'s own estimate, otherwise the default — so treat it as a hint, never as a guarantee.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#operator.contains',
    meta:  'operator — sequence operations',
  },
};
