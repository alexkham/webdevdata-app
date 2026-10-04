// content/reference/python/stdlib/copy/copy.js

export const meta = {
  slug:        'copy',
  name:        'copy.copy',
  signature:   'copy.copy(obj)',
  blurb:       'Shallow copy: a new object of the same type whose contents are the SAME objects as the original’s.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'copy.copy shallow copy python copy object clone list copy dict copy __copy__ copy instance shared nested list cannot pickle',
};

export const method = {
  slug:      'copy',
  name:      'copy.copy',
  signature: 'copy.copy(obj)',
  returns:   { type: 'same type as obj', desc: 'A new outer object sharing its items/attributes with obj — or obj itself for immutable types.' },

  category:    'copy function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'One level deep. The outer list, dict or instance is new, so adding, removing or rebinding items is independent — but a nested list inside is the same list in both.',

  covers: ['copy'],

  cheat: {
    commonCall: 'clone = copy.copy(obj)',
    returns:    'new outer object, shared contents',
    replaces:   'obj.copy(), list(obj), obj[:] — for any type',
    watchOut:   'Nested mutable objects are shared',
  },

  parameters: [
    { name: 'obj', type: 'object', required: true, default: null, desc: 'Anything copyable. Lists, dicts, sets and bytearrays use their own .copy(); immutable types are returned as is; other objects use __copy__ or the pickle protocol. Positional only.' },
  ],

  modes: [
    {
      id: 'nested',
      label: 'list of lists',
      blurb: 'Copy a list of two lists, then change the copy: append to an inner list, and append to the copy itself.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'first inner list',  input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'second inner list', input: 'csv-num' },
      ],
      template: 'import copy\noriginal = [{$a}, {$b}]\nc = copy.copy(original)\nc[0].append(0)      # mutates a shared inner list\nc.append([])        # only changes the copy\n(original, c)',
      cases: [
        { id: 'basic', label: 'two lists', values: { a: '1, 2', b: '3' } },
        { id: 'empty', label: 'empty',     values: { a: '', b: '' } },
      ],
    },
    {
      id: 'dict',
      label: 'dict',
      blurb: 'A shallow copy of a config dict: rebinding a key is private to the copy, appending to a list value is not.',
      params: [
        { name: 'ports', type: 'list[int]', hint: 'port numbers',    input: 'csv-num' },
        { name: 'x',     type: 'int',       hint: 'port to append', input: 'number' },
      ],
      template: "import copy\nconfig = {'name': 'app', 'ports': {$ports}}\nc = copy.copy(config)\nc['name'] = 'test'\nc['ports'].append({$x})\n(config, c)",
      cases: [
        { id: 'basic', label: 'two ports', values: { ports: '80, 443', x: '8080' } },
      ],
    },
  ],
  demoExplainer: 'In the list demo the original ends up as [[1, 2, 0], [3]] — the 0 appended through the copy is visible, because c[0] and original[0] are one list — but the extra [] appended to c is not. In the dict demo the original keeps the name "app" (c["name"] = ... rebinds a key in the new dict) yet gains port 8080, because both dicts hold the same ports list.',

  patterns: [
    {
      name: 'Copy before mutating an argument',
      desc: 'Do not modify the caller’s list; shallow is enough for a flat list.',
      code: 'import copy\ndef normalized(items):\n    items = copy.copy(items)\n    items.sort()\n    return items',
    },
    {
      name: 'Custom shallow copy',
      desc: '__copy__ decides what a copy of your class means.',
      code: 'class Doc:\n    def __copy__(self):\n        new = Doc.__new__(Doc)\n        new.__dict__.update(self.__dict__)\n        new.history = []  # fresh history for the copy\n        return new',
    },
    {
      name: 'Copy keeps the subclass',
      desc: 'Unlike slicing or list(), copy.copy returns the same type.',
      code: 'import copy\nclone = copy.copy(my_ordered_set)',
    },
  ],

  examples: [
    { title: 'New outer list, same items', code: 'import copy\nx = [1, [2]]\ny = copy.copy(x)\n(y is x, y[1] is x[1])', returns: '(False, True)' },
    { title: 'Instances share attributes', code: "import copy\nclass Player:\n    def __init__(self):\n        self.items = []\np = Player()\nq = copy.copy(p)\nq.items.append('sword')\np.items", returns: "['sword']" },
    { title: 'Subclass type is kept',      code: 'import copy\nclass Bag(list):\n    pass\ntype(copy.copy(Bag([1]))).__name__', returns: "'Bag'" },
    { title: 'Slicing loses the subclass', code: 'class Bag(list):\n    pass\ntype(Bag([1])[:]).__name__', returns: "'list'" },
    { title: 'Immutable: same object back', code: "import copy\ns = 'text'\ncopy.copy(s) is s", returns: 'True' },
    { title: 'Functions are not copied',   code: 'import copy\nf = lambda: 0\ncopy.copy(f) is f', returns: 'True' },
    { title: '__copy__ is used when defined', code: "import copy\nclass C:\n    def __copy__(self):\n        return 'custom'\ncopy.copy(C())", returns: "'custom'" },
  ],

  pitfalls: [
    {
      name: 'Expecting nested lists to be copied',
      desc: 'copy.copy copies one level. The inner lists are shared, so changing them through the copy changes the original.',
      wrong: { label: 'copy.copy', code: 'import copy\nboard = [[0, 0], [0, 0]]\ntrial = copy.copy(board)\ntrial[0][0] = 1\nboard', output: '[[1, 0], [0, 0]]' },
      fix:   { label: 'copy.deepcopy', code: 'import copy\nboard = [[0, 0], [0, 0]]\ntrial = copy.deepcopy(board)\ntrial[0][0] = 1\nboard', output: '[[0, 0], [0, 0]]' },
    },
    {
      name: 'Copying objects that hold OS resources',
      desc: 'Files, sockets, locks and generators cannot be copied; copy falls back to pickling and fails.',
      wrong: { label: 'a generator', code: 'import copy\ngen = (n * n for n in range(3))\ncopy.copy(gen)', output: "TypeError: cannot pickle 'generator' object" },
      fix:   { label: 'materialize first', code: 'import copy\ngen = (n * n for n in range(3))\ncopy.copy(list(gen))', output: '[0, 1, 4]' },
    },
  ],

  when: {
    use: [
      'Copying an object whose type you do not know in advance',
      'Flat containers and simple instances',
      'Keeping the exact subclass of a container',
    ],
    avoid: [
      'Nested mutable data → copy.deepcopy',
      'A list/dict you know → .copy() reads more clearly',
      'Immutable values (str, tuple, int) → no copy needed at all',
    ],
  },

  notes: {
    cpython:      'copy.copy in Lib/copy.py: _copy_dispatch (list.copy, dict.copy, set.copy, bytearray.copy, immutables returned as is) → __copy__ → copyreg.dispatch_table → __reduce_ex__(4)',
    'Immutables': 'int, float, str, bytes, tuple, frozenset, range, functions, classes and None are returned unchanged',
  },

  related: [
    { name: 'copy.deepcopy', slug: 'deepcopy', when: 'Copy nested objects too' },
    { name: 'copy.replace',  slug: 'replace',  when: 'Copy with some fields changed (3.13+)' },
    { name: 'list.copy()',   slug: 'list-copy', when: 'Shallow copy of a list', category: 'functions' },
    { name: 'copy module',   slug: 'copy',     when: 'Shallow vs deep overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is copy.copy the same as list.copy()?',
      a: 'For a plain list, yes — copy.copy calls list.copy. The difference is that copy.copy works for any type and keeps subclasses (a list subclass stays that subclass).',
    },
    {
      q: 'How do I copy a class instance in Python?',
      a: 'copy.copy(obj) makes a new instance with the same attribute values (shared, not copied); copy.deepcopy(obj) also copies the attribute values. Define __copy__ / __deepcopy__ to customize.',
    },
    {
      q: 'Why does copy.copy return the same object for a tuple or string?',
      a: 'They are immutable, so a copy could never behave differently from the original; returning the same object is cheaper and safe.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/copy.html#copy.copy',
    meta:  'copy.copy',
  },
};
