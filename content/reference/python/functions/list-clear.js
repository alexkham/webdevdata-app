// content/reference/python/functions/list-clear.js
//
// Slug is type-prefixed: `clear` collides with dict.clear and set.clear.

export const meta = {
  slug:        'list-clear',
  name:        'list.clear',
  signature:   'list.clear()',
  blurb:       'Empty the list in place, keeping every existing reference to it valid.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'clear empty remove all delete reset list mutate in place truncate',
};

export const method = {
  slug:      'list-clear',
  name:      'list.clear',
  signature: 'list.clear()',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after clearing.' },

  category:    'List method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'Empties the list itself rather than rebinding the name. Everyone else holding the same list sees it empty too — which is the point, and the trap.',

  cheat: {
    commonCall: 'items.clear()',
    returns:    'None — the list is emptied in place',
    replaces:   'del items[:] and items[:] = []',
    watchOut:   'every reference to the list sees the change; items = [] does not do this',
  },

  parameters: [],

  demoParams: [
    { name: 'list', type: 'list', hint: 'starting list', input: 'csv' },
  ],
  cases: [
    { id: 'several', label: 'several items', values: { list: 'a,b,c' } },
    { id: 'one',     label: 'single item',   values: { list: 'x' } },
    { id: 'empty',   label: 'already empty', values: { list: '' } },
    { id: 'numbers', label: 'numeric-ish',   values: { list: '1,2,3' } },
  ],
  demoExplainer: 'The demo output is None, and that is the real return value — clear mutates the list and gives nothing back. The effect you care about is invisible in the result: every element is removed from the EXISTING list object rather than a new empty one being made, so the list keeps its identity and every other reference to it sees the change. Clearing an already-empty list is a no-op and never raises.',

  patterns: [
    {
      name: 'Reuse a buffer between batches',
      desc: 'Keeps one list object alive instead of allocating a fresh one each round.',
      code: 'for batch in batches:\n    buffer.clear()\n    buffer.extend(process(batch))',
    },
    {
      name: 'Empty a shared list everyone can see',
      desc: 'The whole reason to prefer clear over rebinding — other holders observe it.',
      code: 'self.pending.clear()   # every reader of self.pending sees empty',
    },
    {
      name: 'Reset without touching the binding',
      desc: 'Useful when the list is an attribute or lives in a closure.',
      code: 'state.errors.clear()',
    },
  ],

  examples: [
    { title: 'Empties it',        code: "xs = [1, 2, 3]\nxs.clear()\nxs",    returns: '[]' },
    { title: 'Returns None',      code: '[1, 2, 3].clear()',                 returns: 'None' },
    { title: 'Already empty ok',  code: 'xs = []\nxs.clear()\nxs',           returns: '[]' },
    { title: 'Identity survives', code: 'xs = [1]\nbefore = id(xs)\nxs.clear()\nid(xs) == before', returns: 'True' },
    { title: 'Aliases see it',    code: 'a = [1, 2]\nb = a\na.clear()\nb',   returns: '[]' },
    { title: 'Rebinding does not',code: 'a = [1, 2]\nb = a\na = []\nb',      returns: '[1, 2]' },
  ],

  pitfalls: [
    {
      name: 'clear() and = [] are not the same thing',
      desc: 'The single most useful distinction here. clear empties the object everyone shares; assigning a new empty list only moves your own name, leaving other references pointing at the old, still-full list.',
      wrong: { label: 'Others still see data', code: 'a = [1, 2]\nb = a\na = []\nb', output: '[1, 2]' },
      fix:   { label: 'Everyone sees empty',   code: 'a = [1, 2]\nb = a\na.clear()\nb', output: '[]' },
    },
    {
      name: 'The `xs = xs.clear()` bug',
      desc: 'clear returns None, so assigning its result back replaces your list with None. The same family of mistake as sort, extend and insert.',
      wrong: { label: 'Now xs is None', code: 'xs = [1, 2]\nxs = xs.clear()\nprint(xs)', output: 'None' },
      fix:   { label: 'Just clear',     code: 'xs.clear()', output: '[]' },
    },
    {
      name: 'Clearing a list you are iterating',
      desc: 'Emptying the list mid-loop ends the iteration early, because the iterator is walking positions in a list that just lost them. It fails quietly rather than raising.',
      wrong: { label: 'Loop stops short', code: 'xs = [1, 2, 3]\nfor x in xs:\n    xs.clear()\n    print(x)', output: '1  # loop ends immediately' },
      fix:   { label: 'Clear afterwards', code: 'for x in xs:\n    print(x)\nxs.clear()', output: '1 2 3' },
    },
    {
      name: 'Not available before Python 3.3',
      desc: 'list.clear arrived long after dict.clear, so older code uses del xs[:] instead. Both still work, and you will meet the old form in the wild.',
      wrong: { label: 'AttributeError on 3.2', code: 'xs.clear()', output: "AttributeError: 'list' object has no attribute 'clear'" },
      fix:   { label: 'Portable form',         code: 'del xs[:]', output: 'works on every version' },
    },
  ],

  when: {
    use: [
      'Emptying a list other code also holds a reference to',
      'Reusing one buffer across iterations instead of reallocating',
      'Resetting a list attribute without rebinding it',
    ],
    avoid: [
      'You want a fresh, independent list → xs = []',
      'Removing only some items → a comprehension or filter',
      'Removing one item → remove or pop',
    ],
  },

  notes: {
    complexity: 'O(n) — every element must have its reference dropped',
    return:     'None; the list is mutated in place and keeps its identity',
    cpython:    'Objects/listobject.c :: list_clear',
    memory:     'Releases the elements; the internal array may be shrunk',
    threadSafe: 'Not safe under concurrent mutation of the same list',
  },

  related: [
    { name: 'dict.clear',    slug: 'dict-clear',    when: 'The same operation on a dict' },
    { name: 'set.clear',     slug: 'set-clear',     when: 'The same operation on a set' },
    { name: 'list.pop',      slug: 'list-pop',      when: 'Remove one item rather than all' },
    { name: 'list.remove',   slug: 'list-remove',   when: 'Remove one item by value' },
  ],

  faq: [
    {
      q: 'What is the difference between xs.clear() and xs = []?',
      a: 'clear empties the existing list object; xs = [] points the name xs at a brand new one. If anything else refers to the original — another variable, an attribute, a list of lists — clear affects it and rebinding does not.',
      code: 'a = [1, 2]\nb = a\na.clear()\nb      # []\n\na = [1, 2]\nb = a\na = []\nb      # [1, 2]',
    },
    {
      q: 'How did people do this before 3.3?',
      a: 'del xs[:] was the standard idiom, and xs[:] = [] also works. Both mutate in place exactly like clear, so you can treat them as equivalent when reading older code.',
      code: 'del xs[:]',
    },
    {
      q: 'Does clearing free the memory?',
      a: 'It drops the list\'s references to the elements, so those objects can be collected if nothing else holds them. The list\'s own internal array is a separate matter — CPython may keep some capacity for reuse rather than returning it immediately.',
    },
  ],

  history: [
    { version: '3.3', note: 'list.clear added, matching dict.clear and set.clear which already existed.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.clear',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data before and after' },
  ],
};
