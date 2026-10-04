// content/reference/python/stdlib/copy/index.js — the copy module hub

export const meta = {
  slug:        'index',
  name:        'copy',
  signature:   'import copy',
  blurb:       'Shallow and deep copies of any object — copy.copy, copy.deepcopy — plus copy.replace (3.13) for changing fields of immutable objects.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'copy module python shallow copy deep copy deepcopy copy.copy copy.deepcopy copy.replace nested list copy clone object duplicate list of lists __copy__ __deepcopy__ __replace__ memo',
};

export const method = {
  slug: 'index',
  name: 'copy',

  category:    'Data types',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Assignment never copies — it gives the same object a second name. copy.copy makes a new outer container that still shares the items inside; copy.deepcopy copies everything, all the way down.',

  imports: ['import copy', 'from copy import deepcopy'],
  facts: [
    { label: 'Public API', value: 'copy, deepcopy, replace (3.13+), Error' },
    { label: 'Shallow',    value: 'copy.copy(x): new container, same items — like list(x), x.copy(), x[:]' },
    { label: 'Deep',       value: 'copy.deepcopy(x): new container, recursively copied items; shared and self references are preserved via a memo dict' },
    { label: 'Hooks',      value: '__copy__(self), __deepcopy__(self, memo), __replace__(self, **changes); otherwise the pickle protocol (__reduce_ex__)' },
    { label: 'Source',     value: 'Lib/copy.py — pure Python' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'shallow vs deep',
      blurb: 'A list of two lists, copied both ways. Then the ORIGINAL inner list gets one more item — see which copies notice.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'first inner list',  input: 'csv-num' },
        { name: 'b', type: 'list[int | float]', hint: 'second inner list', input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value to append',   input: 'number' },
      ],
      template: 'import copy\noriginal = [{$a}, {$b}]\nshallow = copy.copy(original)\ndeep = copy.deepcopy(original)\noriginal[0].append({$x})\n(original, shallow, deep)',
      cases: [
        { id: 'basic', label: 'two lists',   values: { a: '1, 2', b: '3', x: '9' } },
        { id: 'empty', label: 'empty lists', values: { a: '', b: '', x: '0' } },
      ],
    },
    {
      id: 'alias',
      label: 'assignment vs copy',
      blurb: 'alias = a copies nothing: both names point at one list. copy.copy(a) is a separate list.',
      params: [
        { name: 'a', type: 'list[int | float]', hint: 'numbers',         input: 'csv-num' },
        { name: 'x', type: 'int',               hint: 'value to append', input: 'number' },
      ],
      template: 'import copy\na = {$a}\nalias = a\nclone = copy.copy(a)\na.append({$x})\n(alias, clone)',
      cases: [
        { id: 'basic', label: 'append', values: { a: '1, 2', x: '3' } },
      ],
    },
  ],
  demoExplainer: 'Appending 9 to original[0] changes the shallow copy too — ([[1, 2, 9], [3]], [[1, 2, 9], [3]], [[1, 2], [3]]) — because copy.copy built a new outer list holding the SAME inner lists. Only the deep copy has its own inner lists. With plain assignment even the outer list is shared: alias shows the appended 3, clone does not.',

  patterns: [
    {
      name: 'Independent copy of nested data',
      desc: 'Lists of lists, dicts of lists, JSON-like data: deepcopy before modifying.',
      code: 'import copy\nsnapshot = copy.deepcopy(state)',
    },
    {
      name: '2D grid copy without deepcopy',
      desc: 'For a list of flat lists, copying each row is enough (and faster).',
      code: 'grid_copy = [row[:] for row in grid]',
    },
    {
      name: 'Change one field of an immutable object (3.13+)',
      desc: 'copy.replace works on named tuples, dataclasses and other classes with __replace__.',
      code: 'import copy\nmoved = copy.replace(point, x=point.x + 1)',
    },
    {
      name: 'Custom copy behaviour',
      desc: 'Share a cache between copies but copy the data.',
      code: 'import copy\nclass Model:\n    def __deepcopy__(self, memo):\n        new = Model.__new__(Model)\n        new.data = copy.deepcopy(self.data, memo)\n        new.cache = self.cache  # shared on purpose\n        return new',
    },
  ],

  examples: [
    { title: 'Assignment is not a copy',      code: 'a = [1, 2]\nb = a\nb.append(3)\na', returns: '[1, 2, 3]' },
    { title: 'Shallow copy shares inner lists', code: 'import copy\na = [[1], [2]]\nb = copy.copy(a)\nb[0].append(99)\na', returns: '[[1, 99], [2]]' },
    { title: 'Deep copy does not',            code: 'import copy\na = [[1], [2]]\nb = copy.deepcopy(a)\nb[0].append(99)\na', returns: '[[1], [2]]' },
    { title: 'Immutable objects come back as is', code: 'import copy\nt = (1, 2)\ncopy.copy(t) is t', returns: 'True' },
    { title: 'replace() a named tuple field (3.13+)', code: "import copy\nfrom collections import namedtuple\nPoint = namedtuple('Point', 'x y')\ncopy.replace(Point(1, 2), x=5)", returns: 'Point(x=5, y=2)' },
    { title: 'Modules cannot be copied',      code: 'import copy, math\ncopy.copy(math)', returns: "TypeError: cannot pickle 'module' object" },
  ],

  pitfalls: [
    {
      name: 'Multiplying a list of lists',
      desc: '[[0] * 3] * 3 repeats ONE inner list three times — the classic shared-row bug. Build each row separately.',
      wrong: { label: '[[0] * 3] * 3', code: 'grid = [[0] * 3] * 3\ngrid[0][0] = 1\ngrid', output: '[[1, 0, 0], [1, 0, 0], [1, 0, 0]]' },
      fix:   { label: 'comprehension', code: 'grid = [[0] * 3 for _ in range(3)]\ngrid[0][0] = 1\ngrid', output: '[[1, 0, 0], [0, 0, 0], [0, 0, 0]]' },
    },
    {
      name: 'Shallow-copying nested data',
      desc: '.copy(), list(), [:] and copy.copy only copy the outer container. Nested lists and dicts are still shared.',
      wrong: { label: 'dict.copy()', code: "settings = {'tags': ['a']}\nbackup = settings.copy()\nsettings['tags'].append('b')\nbackup", output: "{'tags': ['a', 'b']}" },
      fix:   { label: 'deepcopy', code: "import copy\nsettings = {'tags': ['a']}\nbackup = copy.deepcopy(settings)\nsettings['tags'].append('b')\nbackup", output: "{'tags': ['a']}" },
    },
  ],

  when: {
    use: [
      'Snapshots of nested, mutable state before changing it',
      'Duplicating objects whose class you do not control',
      'copy.replace: "the same, but with this field changed" for immutable records',
    ],
    avoid: [
      'Flat lists and dicts → list.copy(), dict.copy() or a slice (same result, clearer)',
      'Huge object graphs in hot loops → deepcopy is slow; restructure or copy only what changes',
      'Objects holding files, sockets, locks → they cannot be copied',
    ],
  },

  notes: {
    cpython:      'Lib/copy.py; types it does not special-case go through copyreg.dispatch_table and __reduce_ex__(4), the pickle protocol',
    'Not copied': 'Functions, classes and other immutable atoms are returned unchanged; modules, generators, files and locks raise TypeError: cannot pickle ...',
    'Versions':   'copy.replace and __replace__ added in 3.13',
  },

  related: [
    { name: 'list.copy()', slug: 'list-copy', when: 'Shallow copy of a list', category: 'functions' },
    { name: 'dict',        slug: 'dict',      when: 'dict.copy() is shallow too', category: 'functions' },
    { name: 'collections.namedtuple', slug: 'namedtuple', when: 'Records that copy.replace works on', category: 'stdlib/collections' },
    { name: 'json module', slug: 'json',      when: 'Round trip as a deep copy of JSON-like data', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between a shallow copy and a deep copy in Python?',
      a: 'A shallow copy (copy.copy, list.copy, dict.copy, slicing) creates a new outer container but puts the same inner objects in it. A deep copy (copy.deepcopy) also copies those inner objects, recursively, so nothing mutable is shared with the original.',
    },
    {
      q: 'How do I copy a list of lists in Python?',
      a: 'copy.deepcopy(grid) for any nesting depth, or [row[:] for row in grid] when the rows contain only immutable values. grid.copy() and grid[:] still share the rows.',
    },
    {
      q: 'Why did changing my copy change the original?',
      a: 'Either you assigned instead of copying (b = a), or you made a shallow copy and changed a nested list or dict, which both copies share. Use copy.deepcopy for nested data.',
    },
    {
      q: 'Does deepcopy handle circular references?',
      a: 'Yes. deepcopy records every object it has copied in a memo dict keyed by id(); when it meets the same object again it reuses the copy, so cycles and shared references keep their shape.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/copy.html',
    meta:  'copy — Shallow and deep copy operations',
  },
};
