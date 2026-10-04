// content/reference/python/stdlib/copy/deepcopy.js

export const meta = {
  slug:        'deepcopy',
  name:        'copy.deepcopy',
  signature:   'copy.deepcopy(obj, memo=None)',
  blurb:       'Deep copy: copies the object and, recursively, everything inside it — nothing mutable is shared with the original.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'copy.deepcopy deep copy python nested list dict copy clone recursive copy memo circular reference __deepcopy__ independent copy list of lists cannot pickle',
};

export const method = {
  slug:      'deepcopy',
  name:      'copy.deepcopy',
  signature: 'copy.deepcopy(obj, memo=None)',
  returns:   { type: 'same type as obj', desc: 'A fully independent copy (immutable parts may be the same objects).' },

  category:    'copy function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Walks the whole object graph. A memo dict maps each original object to its copy, so an object referenced twice is copied once — and a structure that contains itself is copied without infinite recursion.',

  covers: ['deepcopy'],

  cheat: {
    commonCall: 'snapshot = copy.deepcopy(state)',
    returns:    'an independent copy, all levels deep',
    replaces:   'hand-written recursive copying',
    watchOut:   'Slow on big graphs; fails on files, locks, generators',
  },

  parameters: [
    { name: 'obj',  type: 'object', required: true,  default: null,   desc: 'Anything copyable.' },
    { name: 'memo', type: 'dict',   required: false, default: 'None', desc: 'id(original) → copy for objects already copied in this pass. Leave it out; pass it on only inside your own __deepcopy__(self, memo).' },
  ],

  modes: [
    {
      id: 'nested',
      label: 'list of lists',
      blurb: 'The same experiment as on the copy.copy page, with deepcopy: change the copy, check the original.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'first inner list',  input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'second inner list', input: 'csv-num' },
      ],
      template: 'import copy\noriginal = [{$a}, {$b}]\nd = copy.deepcopy(original)\nd[0].append(0)\nd.append([])\n(original, d)',
      cases: [
        { id: 'basic', label: 'two lists', values: { a: '1, 2', b: '3' } },
      ],
    },
    {
      id: 'cycle',
      label: 'self-reference',
      blurb: 'A list that contains itself. deepcopy reproduces the cycle — inside the copy, pointing at the copy.',
      params: [{ name: 'nums', type: 'list[int | float]', hint: 'numbers', input: 'csv-num' }],
      template: 'import copy\na = {$nums}\na.append(a)\nb = copy.deepcopy(a)\n(b, b[-1] is b, b[-1] is a)',
      cases: [
        { id: 'two',   label: 'two numbers', values: { nums: '1, 2' } },
        { id: 'empty', label: 'only itself', values: { nums: '' } },
      ],
    },
    {
      id: 'shared',
      label: 'shared reference',
      blurb: 'One inner list referenced twice. In the copy it is still ONE list referenced twice — a new one.',
      params: [
        { name: 'nums', type: 'list[int | float]', hint: 'inner list',      input: 'csv-num' },
        { name: 'x',    type: 'int',               hint: 'value to append', input: 'number' },
      ],
      template: 'import copy\ninner = {$nums}\nouter = [inner, inner]\nd = copy.deepcopy(outer)\nd[0].append({$x})\n(d, d[0] is d[1], outer)',
      cases: [
        { id: 'basic', label: 'append', values: { nums: '1, 2', x: '3' } },
      ],
    },
  ],
  demoExplainer: 'The original stays [[1, 2], [3]] whatever you do to the deep copy. The cycle demo prints [1, 2, [...]] — the [...] is how repr shows a list inside itself — and (True, False) confirms the copy points at itself, not at the original. In the shared demo appending 3 to d[0] shows up in d[1] as well, because the memo made both slots refer to the same new list, while outer is untouched.',

  patterns: [
    {
      name: 'Snapshot / undo',
      desc: 'Save a full independent state before an operation you may roll back.',
      code: 'import copy\nhistory.append(copy.deepcopy(board))\napply_move(board, move)',
    },
    {
      name: '__deepcopy__ that passes memo on',
      desc: 'Copy components with deepcopy(component, memo) so shared references and cycles still work.',
      code: 'import copy\nclass Node:\n    def __deepcopy__(self, memo):\n        new = Node.__new__(Node)\n        memo[id(self)] = new\n        new.children = copy.deepcopy(self.children, memo)\n        new.parent = copy.deepcopy(self.parent, memo)\n        return new',
    },
    {
      name: 'Faster alternative for flat rows',
      desc: 'A list of lists of numbers or strings only needs one level of copying.',
      code: 'rows_copy = [row.copy() for row in rows]',
    },
  ],

  examples: [
    { title: 'Nested lists are copied',   code: 'import copy\na = [[1], [2]]\nb = copy.deepcopy(a)\nb[0].append(99)\n(a, b)', returns: '([[1], [2]], [[1, 99], [2]])' },
    { title: 'Dicts of lists too',        code: "import copy\ncfg = {'tags': ['a']}\nnew = copy.deepcopy(cfg)\nnew['tags'].append('b')\ncfg", returns: "{'tags': ['a']}" },
    { title: 'Shared references stay shared', code: 'import copy\ninner = [1]\nd = copy.deepcopy([inner, inner])\nd[0] is d[1]', returns: 'True' },
    { title: 'Cycles are reproduced',     code: 'import copy\na = [1]\na.append(a)\nb = copy.deepcopy(a)\n(b, b[1] is b)', returns: '([1, [...]], True)' },
    { title: 'Tuples of immutables are not copied', code: 'import copy\nt = (1, 2)\ncopy.deepcopy(t) is t', returns: 'True' },
    { title: 'Tuples with lists are',     code: 'import copy\nt = (1, [2])\ncopy.deepcopy(t) is t', returns: 'False' },
    { title: 'Locks cannot be copied',    code: "import copy, threading\ncopy.deepcopy({'lock': threading.Lock()})", returns: "TypeError: cannot pickle '_thread.lock' object" },
  ],

  pitfalls: [
    {
      name: 'Using copy() for nested data',
      desc: 'The single most common copy bug: a shallow copy of a list of lists shares the rows.',
      wrong: { label: 'copy.copy', code: 'import copy\nmatrix = [[1, 2], [3, 4]]\nm2 = copy.copy(matrix)\nm2[1][1] = 0\nmatrix', output: '[[1, 2], [3, 0]]' },
      fix:   { label: 'copy.deepcopy', code: 'import copy\nmatrix = [[1, 2], [3, 4]]\nm2 = copy.deepcopy(matrix)\nm2[1][1] = 0\nmatrix', output: '[[1, 2], [3, 4]]' },
    },
    {
      name: 'Deep-copying something that holds a resource',
      desc: 'deepcopy follows every attribute. One lock, file or generator anywhere inside makes the whole copy fail — exclude it in __deepcopy__.',
      wrong: { label: 'plain deepcopy', code: "import copy, threading\nclass Service:\n    def __init__(self):\n        self.data = [1]\n        self.lock = threading.Lock()\ncopy.deepcopy(Service())", output: "TypeError: cannot pickle '_thread.lock' object" },
      fix:   { label: '__deepcopy__', code: "import copy, threading\nclass Service:\n    def __init__(self):\n        self.data = [1]\n        self.lock = threading.Lock()\n    def __deepcopy__(self, memo):\n        new = Service()\n        new.data = copy.deepcopy(self.data, memo)\n        return new\ncopy.deepcopy(Service()).data", output: '[1]' },
    },
  ],

  when: {
    use: [
      'Nested mutable data that must be fully independent',
      'Undo stacks, simulations, test fixtures built from a template',
      'Graphs with shared nodes or cycles',
    ],
    avoid: [
      'Flat containers → .copy() is enough and much faster',
      'JSON-like data on a hot path → a hand-written copy of the parts you change',
      'Objects with OS resources → write __deepcopy__ or copy the data only',
    ],
  },

  notes: {
    cpython:    'copy.deepcopy in Lib/copy.py: memo check → _deepcopy_dispatch (list, dict, tuple, atomics) → __deepcopy__ → __reduce_ex__(4) + _reconstruct',
    'Memo':     'memo maps id(original) → copy; lists and dicts are stored in it before their items are copied, which is what makes cycles work',
    'Recursion': 'It recurses once per nesting level: a list nested 2000 levels deep raises RecursionError with the default recursion limit',
  },

  related: [
    { name: 'copy.copy',    slug: 'copy',    when: 'One level only' },
    { name: 'copy.Error',   slug: 'error',   when: 'Raised for objects with no copy protocol at all' },
    { name: 'copy module',  slug: 'copy',    when: 'Shallow vs deep overview', category: 'stdlib' },
    { name: 'RecursionError', slug: 'recursionerror', when: 'Extremely deep nesting', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I make a deep copy of a dictionary in Python?',
      a: 'copy.deepcopy(d). dict.copy() and dict(d) are shallow: nested lists and dicts inside are still shared with the original.',
    },
    {
      q: 'Why is copy.deepcopy so slow?',
      a: 'It is pure Python and visits every object in the graph, recording each in the memo dict. For data with a known shape, a comprehension such as [row[:] for row in rows] is far faster.',
    },
    {
      q: 'What is the memo argument of deepcopy for?',
      a: 'It maps id(original) to the copy already made in this pass, so shared objects are copied once and cycles terminate. You only pass it along inside a __deepcopy__(self, memo) method.',
    },
    {
      q: 'Why does deepcopy raise "cannot pickle" errors?',
      a: 'For types it does not know, deepcopy uses the pickle protocol (__reduce_ex__). Objects such as locks, open files, sockets and generators refuse to be pickled, so they cannot be copied either.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/copy.html#copy.deepcopy',
    meta:  'copy.deepcopy',
  },
};
