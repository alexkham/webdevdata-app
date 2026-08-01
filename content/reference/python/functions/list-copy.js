// content/reference/python/functions/list-copy.js
//
// Slug is type-prefixed: `copy` exists on list, dict and set.

export const meta = {
  slug:        'list-copy',
  name:        'list.copy',
  signature:   'list.copy()',
  blurb:       'Return a shallow copy of the list.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'copy shallow duplicate clone list alias',
};

export const method = {
  slug:      'list-copy',
  name:      'list.copy',
  signature: 'list.copy()',
  returns:   { type: 'list', desc: 'A NEW list containing the same items. Shallow: nested objects are shared, not duplicated.' },

  category:    'List method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'A new list, same items — the cure for accidental aliasing, with a shallow-copy caveat.',

  cheat: {
    commonCall: 'snapshot = items.copy()',
    returns:    'new list — mutating it leaves the original alone',
    replaces:   'b = a does NOT copy — both names point at one list',
    watchOut:   'shallow: nested lists/dicts are still shared',
  },

  parameters: [],

  demoParams: [
    { name: 'list', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'default', label: 'default', values: { list: 'a,b,c' } },
    { id: 'empty',   label: 'empty',   values: { list: '' } },
  ],
  demoExplainer: 'The result looks identical — the point is that it is a DIFFERENT list object: appending to the copy leaves the original untouched. Nested objects inside are shared though (shallow copy).',

  patterns: [
    {
      name: 'Snapshot before mutating',
      desc: 'Iterate the copy while mutating the original (or vice versa).',
      code: 'for item in items.copy():\n    if bad(item):\n        items.remove(item)',
    },
    {
      name: 'Defensive copies at boundaries',
      desc: 'Return a copy so callers cannot mutate your internal state.',
      code: 'def get_items(self):\n    return self._items.copy()',
    },
    {
      name: 'The equivalent spellings',
      desc: 'copy(), slicing and the constructor produce the same shallow copy.',
      code: 'b = a.copy()\nb = a[:]\nb = list(a)',
    },
  ],

  examples: [
    { title: 'Independent top level', code: 'a = [1, 2]\nb = a.copy()\nb.append(3)\na', returns: '[1, 2]' },
    { title: 'Assignment is NOT a copy', code: 'a = [1, 2]\nb = a\nb.append(3)\na', returns: '[1, 2, 3]' },
    { title: 'Nested objects are shared', code: 'a = [[1], [2]]\nb = a.copy()\nb[0].append(9)\na', returns: '[[1, 9], [2]]' },
  ],

  pitfalls: [
    {
      name: 'b = a is aliasing, not copying',
      desc: 'Both names refer to one list; mutations show up under both.',
      wrong: { label: 'Alias', code: 'b = a\nb.append(x)  # a changed too!', output: 'one list, two names' },
      fix:   { label: 'Fix', code: 'b = a.copy()\nb.append(x)', output: 'independent lists' },
    },
    {
      name: 'Shallow means nested objects are shared',
      desc: 'copy duplicates the list, not what the items point at.',
      wrong: { label: 'Shared inner', code: 'b = a.copy()\nb[0].append(9)\n# a[0] changed too', output: 'inner lists are the same objects' },
      fix:   { label: 'Deep copy', code: 'import copy\nb = copy.deepcopy(a)', output: 'fully independent' },
    },
  ],

  when: {
    use: [
      'Snapshot a flat list before mutating',
      'Defensive copies across API boundaries',
      'Iterate-while-removing safely',
    ],
    avoid: [
      'Nested structures needing independence → copy.deepcopy',
      'Just iterating without mutation → no copy needed',
      'Copy with transformation → a comprehension does both',
    ],
  },

  notes: {
    complexity: 'O(n) — copies n references',
    return:     'new list; items shared',
    cpython:    'Objects/listobject.c :: list_copy_impl',
    memory:     'One new array of n pointers',
    threadSafe: 'The copy itself is atomic in CPython',
  },

  related: [
    { name: 'list.append', slug: 'append',   when: 'Mutate the copy safely' },
    { name: 'list.pop',    slug: 'list-pop', when: 'Destructive consumption — copy first to keep the original' },
    { name: 'sorted',      slug: 'sorted',   when: 'A sorted copy in one step' },
  ],

  faq: [
    {
      q: 'copy() vs [:] vs list() — any difference?',
      a: 'No — all three produce the same shallow copy. copy() is the most readable; [:] predates it; list(a) also converts other iterables.',
    },
    {
      q: 'When do I need deepcopy?',
      a: 'When items are mutable (lists, dicts, objects) and the copy must be fully independent. Deep copying recurses into every nested object.',
    },
    {
      q: 'How do I copy with a filter or transform?',
      a: 'A comprehension copies and transforms in one pass.',
      code: 'b = [x for x in a if keep(x)]',
    },
  ],

  history: [
    { version: '3.3', note: 'list.copy() added — before that, a[:] and list(a) were the only spellings.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.copy',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested data' },
  ],
};
