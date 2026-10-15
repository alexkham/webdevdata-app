// content/reference/python/stdlib/operator/in-place.js — iadd, iand, iconcat, ifloordiv, ilshift, imatmul, imod, imul, ior, ipow, irshift, isub, itruediv, ixor

export const meta = {
  slug:        'in-place',
  name:        'operator.iadd / isub / imul … (in-place operators)',
  signature:   'operator.iadd(a, b) · isub · imul · imatmul · itruediv · ifloordiv · imod · ipow · ilshift · irshift · iand · ior · ixor · iconcat',
  blurb:       'The augmented assignments += -= *= … as functions. They perform the in-place step only: a list is changed and returned, an immutable value gives back a new object.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (imatmul: 3.5+)',
  searchTerms: 'operator.iadd operator.isub operator.imul operator.imatmul operator.itruediv operator.ifloordiv operator.imod operator.ipow operator.ilshift operator.irshift operator.iand operator.ior operator.ixor operator.iconcat iadd isub imul imatmul itruediv ifloordiv imod ipow ilshift irshift iand ior ixor iconcat in-place operator augmented assignment += python iadd string immutable new object __iadd__ tuple += list',
};

export const method = {
  slug:      'in-place',
  name:      'operator.iadd / isub / imul … (in-place operators)',
  signature: 'operator.iadd(a, b, /) · isub · imul · imatmul · itruediv · ifloordiv · imod · ipow · ilshift · irshift · iand · ior · ixor · iconcat(a, b, /)',
  returns:   { type: 'any', desc: 'The result of the in-place operation: a itself for mutable objects that update in place (list, set, dict), otherwise a new object.' },

  category:    'operator function',
  version:     'All Python 3 versions (imatmul: 3.5+)',
  hasLiveDemo: true,

  subtitle: 'a += b is two steps: compute a.__iadd__(b) (or a + b), then assign the result to a. iadd does only the first step. A list has __iadd__ and extends itself; str, int and tuple have none, so Python falls back to + and you get a new object — which you must assign yourself.',

  covers: ['iadd', 'iand', 'iconcat', 'ifloordiv', 'ilshift', 'imatmul', 'imod', 'imul', 'ior', 'ipow', 'irshift', 'isub', 'itruediv', 'ixor'],

  cheat: {
    commonCall: 'x = operator.iadd(x, y)',
    returns:    'x itself (list, set, dict) or a new object (str, int, tuple)',
    replaces:   'x += y when the operator must be a function',
    watchOut:   'operator.iadd(x, 1) alone does not change an int x',
  },

  parameters: [
    { name: 'a', type: 'any', required: true, default: null, desc: 'The target. Mutable types with an in-place method (list, set, dict, bytearray) are updated and returned.' },
    { name: 'b', type: 'any', required: true, default: null, desc: 'The right-hand operand, as in a += b. iconcat requires a to be a sequence.' },
  ],

  modes: [
    {
      id: 'list',
      label: 'list',
      blurb: 'iadd on a list extends it in place and returns the same object — so the alias sees the change.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'more',  type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: 'import operator\na = {$items}\nalias = a\na = operator.iadd(a, {$more})\n(a, alias, a is alias)',
      cases: [
        { id: 'add',   label: "['a', 'b'] += ['c']", values: { items: 'a, b', more: 'c' } },
        { id: 'empty', label: '+= []',               values: { items: 'a, b', more: '' } },
      ],
    },
    {
      id: 'tuple',
      label: 'tuple',
      blurb: 'A tuple cannot change: iadd builds a new one and the alias keeps the old value.',
      params: [
        { name: 'items', type: 'list[str]', hint: 'comma-separated', input: 'csv' },
        { name: 'more',  type: 'list[str]', hint: 'comma-separated', input: 'csv' },
      ],
      template: 'import operator\na = tuple({$items})\nalias = a\na = operator.iadd(a, tuple({$more}))\n(a, alias, a is alias)',
      cases: [
        { id: 'add',   label: "('a', 'b') += ('c',)", values: { items: 'a, b', more: 'c' } },
        { id: 'empty', label: '+= ()',                values: { items: 'a, b', more: '' } },
      ],
    },
    {
      id: 'str',
      label: 'str',
      blurb: 'Same for strings: a new str comes back.',
      params: [
        { name: 'text', type: 'str', hint: 'start value', input: 'text' },
        { name: 'more', type: 'str', hint: 'appended',    input: 'text' },
      ],
      template: 'import operator\na = {$text}\nalias = a\na = operator.iadd(a, {$more})\n(a, alias, a is alias)',
      cases: [
        { id: 'add',   label: "'ab' += 'cd'", values: { text: 'ab', more: 'cd' } },
        { id: 'empty', label: "+= ''",        values: { text: 'ab', more: '' } },
      ],
    },
    {
      id: 'numbers',
      label: 'unassigned',
      blurb: 'Call iadd without assigning: x keeps its value, the result is only returned.',
      params: [
        { name: 'x', type: 'int | float | str', hint: 'start value', input: 'auto' },
        { name: 'y', type: 'int | float | str', hint: 'added',       input: 'auto' },
      ],
      template: 'import operator\nx = {$x}\ny = operator.iadd(x, {$y})\n(x, y)',
      cases: [
        { id: 'ints',  label: '5, 1',      values: { x: '5', y: '1' } },
        { id: 'strs',  label: "'ab', 'c'", values: { x: 'ab', y: 'c' } },
        { id: 'mixed', label: '1, \'a\'',  values: { x: '1', y: 'a' } },
      ],
    },
  ],
  demoExplainer: "The list comes back as the same object (a is alias is True), already extended. The tuple and the str come back as new objects and alias keeps the old value — except in the '+= empty' cases: CPython's concatenation returns the left operand itself when the right one is empty, so a is alias stays True. That is an implementation shortcut, not a guarantee. In the unassigned tab x never changes; only the assignment in x += y (or x = iadd(x, y)) rebinds the name. Mixing int and str fails with the in-place spelling of the operator in the message: unsupported operand type(s) for +=.",

  patterns: [
    {
      name: 'Accumulate into one list',
      desc: 'reduce with iadd extends the first list instead of building a new one at every step — give it a fresh list to own.',
      code: 'from functools import reduce\nimport operator\nflat = reduce(operator.iadd, list_of_lists, [])',
    },
    {
      name: 'Apply an augmented assignment chosen at run time',
      desc: 'Always assign the result back — it is the second half of x op= y.',
      code: "import operator\nIOPS = {'+=': operator.iadd, '-=': operator.isub, '*=': operator.imul}\ntotal = IOPS[op](total, amount)",
    },
    {
      name: 'Update a set or dict in place',
      desc: 'ior / iand / isub / ixor change the left set (or dict for ior) and return it.',
      code: 'import operator\noperator.ior(seen, new_items)      # seen |= new_items\noperator.ior(settings, overrides)  # dict |= (3.9+)',
    },
  ],

  examples: [
    { title: 'Immutable: computed, not assigned', code: "import operator\na = 'hello'\noperator.iadd(a, ' world'), a", returns: "('hello world', 'hello')" },
    { title: 'Mutable: changed in place',          code: "import operator\ns = ['h', 'i']\nr = operator.iadd(s, ['!'])\nr, s, r is s", returns: "(['h', 'i', '!'], ['h', 'i', '!'], True)" },
    { title: 'A tuple gets a new object',          code: 'import operator\nt = (1, 2)\nr = operator.iadd(t, (3,))\nr, t, r is t', returns: '((1, 2, 3), (1, 2), False)' },
    { title: 'iconcat on a list takes any iterable', code: 'import operator\ns = [1]\noperator.iconcat(s, (2, 3))\ns', returns: '[1, 2, 3]' },
    { title: 'Dict merge in place (3.9+)',         code: "import operator\nd = {'a': 1}\noperator.ior(d, {'b': 2})\nd", returns: "{'a': 1, 'b': 2}" },
    { title: 'Numbers: same as the plain operators', code: 'import operator\noperator.isub(10, 3), operator.itruediv(7, 2), operator.ifloordiv(7, 2), operator.imod(7, 2), operator.ipow(2, 5)', returns: '(7, 3.5, 3, 1, 32)' },
    { title: 'The tuple += puzzle explained',     code: 'import operator\nt = ([1],)\noperator.iadd(t[0], [2])\nt', returns: '([1, 2],)' },
    { title: 'imatmul names @= in the error',      code: 'import operator\noperator.imatmul(2, 3)', returns: "TypeError: unsupported operand type(s) for @=: 'int' and 'int'" },
  ],

  pitfalls: [
    {
      name: 'Calling iadd and forgetting the assignment',
      desc: 'For ints, strs and tuples the new value is only returned. Assign it — that is the half of x += y the function does not do.',
      wrong: { label: 'iadd(x, 1)',     code: 'import operator\nx = 5\noperator.iadd(x, 1)\nx', output: '5' },
      fix:   { label: 'x = iadd(x, 1)', code: 'import operator\nx = 5\nx = operator.iadd(x, 1)\nx', output: '6' },
    },
    {
      name: 'Mutating a list other names share',
      desc: 'iadd on a list changes it for every alias — the classic shared-default bug. Use add when you want a new list.',
      wrong: { label: 'iadd(mine, …)', code: "import operator\ndefault = []\nmine = default\noperator.iadd(mine, ['x'])\ndefault", output: "['x']" },
      fix:   { label: 'mine = add(mine, …)', code: "import operator\ndefault = []\nmine = default\nmine = operator.add(mine, ['x'])\ndefault, mine", output: "([], ['x'])" },
    },
    {
      name: 'The t[0] += [2] surprise',
      desc: 'With a list inside a tuple, += first extends the list (iadd succeeds), then fails to assign the result back into the tuple. The error is raised, but the list has already changed.',
      wrong: { label: 't[0] += [2]', code: 't = ([1],)\ntry:\n    t[0] += [2]\nexcept TypeError as e:\n    print(e)\nt', output: "'tuple' object does not support item assignment\n([1, 2],)" },
      fix:   { label: 't[0].extend([2])', code: 't = ([1],)\nt[0].extend([2])\nt', output: '([1, 2],)' },
    },
  ],

  when: {
    use: [
      'reduce / accumulate that should update one mutable accumulator',
      'Interpreters and rule engines that apply x op= y chosen at run time',
    ],
    avoid: [
      'Immutable targets when you forget to assign — use the plain function (add, sub …) to make the intent clear',
      'Ordinary code — x += y is clearer',
    ],
  },

  notes: {
    cpython:      'Modules/_operator.c → PyNumber_InPlaceAdd & co. (and PySequence_InPlaceConcat for iconcat): try the in-place slot (__iadd__), then fall back to the binary one (__add__ / __radd__)',
    'Which types update in place': 'list (+= and *=), set (|= &= -= ^=), dict (|=, 3.9+), bytearray, collections.Counter/deque and most mutable containers; str, bytes, int, float, tuple and frozenset never do',
    'Identity':   "For immutable values, whether a new object comes back is an implementation detail: CPython returns the left operand itself for 'ab' + '' and t + ()",
    'iconcat':    'Like iadd but requires a sequence on the left: iconcat(1, 2) raises TypeError: \'int\' object can\'t be concatenated',
  },

  related: [
    { name: 'Augmented assignment', slug: 'augmented-assignment', when: 'x += y and friends', category: 'operators' },
    { name: 'arithmetic functions', slug: 'arithmetic', when: 'add, sub … — the non-in-place versions' },
    { name: 'bitwise functions',    slug: 'bitwise',    when: 'and_, or_, xor — set and dict merge' },
    { name: 'sequence functions',   slug: 'sequences',  when: 'concat — the non-in-place iconcat' },
    { name: 'list.extend()',        slug: 'list-extend', when: 'What iadd on a list does', category: 'functions' },
    { name: 'functools.reduce',     slug: 'reduce',     when: 'Fold with iadd into one list', category: 'stdlib/functools' },
  ],

  faq: [
    {
      q: 'Why does operator.iadd on a string return a new object?',
      a: "str has no __iadd__ method — strings are immutable — so iadd falls back to __add__, which builds a new string. The variable is only updated by the assignment in a += b (or a = iadd(a, b)); iadd itself never rebinds names.",
    },
    {
      q: 'What is the difference between operator.add and operator.iadd?',
      a: 'For immutable values (int, str, tuple) none in the result: both return a new object. For mutable ones they differ: iadd(lst, other) extends lst and returns it, add(lst, other) returns a new list and leaves lst alone. iadd on a list also accepts any iterable; add requires another list.',
    },
    {
      q: 'Is x += y the same as x = x + y in Python?',
      a: 'Not for mutable objects. For a list, x += y extends the existing list (every alias sees it) while x = x + y builds a new list and rebinds only x. For ints, strs and tuples the two give the same value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/operator.html#in-place-operators',
    meta:  'operator — in-place operators',
  },
};
