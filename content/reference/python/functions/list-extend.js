// content/reference/python/functions/list-extend.js
//
// Slug is type-prefixed: `extend` is a list method.

export const meta = {
  slug:        'list-extend',
  name:        'list.extend',
  signature:   'list.extend(iterable)',
  blurb:       'Append every item from an iterable to the end.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 1.5+',
  searchTerms: 'extend concat append iterable items add multiple end merge combine',
};

export const method = {
  slug:      'list-extend',
  name:      'list.extend',
  signature: 'list.extend(iterable)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after extending.' },

  category:    'List method',
  version:     'Python 1.5+',
  hasLiveDemo: true,

  subtitle: 'Add every item from any iterable to the end of the list. Not the iterable itself — its items, one by one.',

  cheat: {
    commonCall: 'items.extend(more_items)',
    returns:    'None — the list itself grows',
    replaces:   'a for-loop of append() calls',
    watchOut:   'extending with a string adds each CHARACTER',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Any iterable — list, tuple, set, generator, string, dict (keys), file. Items are appended one at a time to the end.' },
  ],

  demoParams: [
    { name: 'list',  type: 'list', hint: 'starting list',      input: 'csv' },
    { name: 'items', type: 'list', hint: 'items to add',       input: 'csv' },
  ],
  cases: [
    { id: 'basic',     label: 'basic',           values: { list: 'a,b,c',   items: 'd,e' } },
    { id: 'empty-add', label: 'add nothing',     values: { list: 'a,b,c',   items: '' } },
    { id: 'empty-src', label: 'to empty list',   values: { list: '',        items: 'a,b,c' } },
    { id: 'numbers',   label: 'numbers',         values: { list: '1,2,3',   items: '4,5,6' } },
    { id: 'both-empty',label: 'both empty',      values: { list: '',        items: '' } },
  ],
  demoExplainer: 'The demo shows the LIST STATE after extending. Python actually returns None; the meaningful effect is mutation. extend unpacks the iterable and appends each item — very different from append, which would add the whole iterable as a single nested item. See the pitfalls for the classic string trap.',

  patterns: [
    {
      name: 'Merge two lists',
      desc: 'Extend the destination — one call, no allocation of a merged copy.',
      code: 'combined = list_a.copy()\ncombined.extend(list_b)',
    },
    {
      name: 'Accumulate from a generator',
      desc: 'Extend eats any iterable, including lazy generators — one call, no intermediate list.',
      code: 'results.extend(process(chunk) for chunk in stream)',
    },
    {
      name: 'Flatten one level',
      desc: 'Extend each sub-list into a flat accumulator.',
      code: 'flat = []\nfor row in rows:\n    flat.extend(row)',
    },
  ],

  examples: [
    { title: 'Extend with a list',      code: 'xs = [1, 2]\nxs.extend([3, 4])\nxs',    returns: '[1, 2, 3, 4]' },
    { title: 'Extend with a tuple',     code: 'xs = [1]\nxs.extend((2, 3))\nxs',       returns: '[1, 2, 3]' },
    { title: 'Extend with an empty iter', code: 'xs = [1, 2]\nxs.extend([])\nxs',      returns: '[1, 2]' },
    { title: 'Returns None (surprise)', code: '[1, 2].extend([3, 4])',                   returns: 'None' },
    { title: 'Extend with a string',    code: 'xs = ["a"]\nxs.extend("bc")\nxs',        returns: '["a", "b", "c"]  # each char!' },
  ],

  pitfalls: [
    {
      name: 'Extending with a string appends each character',
      desc: 'A string IS an iterable — of single characters. extend(&quot;abc&quot;) adds "a", "b", "c", not the string as a whole. Probably the most-copied bug in the language after the `xs = xs.sort()` one.',
      wrong: { label: 'Char explosion', code: 'names = ["Ann", "Bob"]\nnames.extend("Cara")\nnames', output: '["Ann", "Bob", "C", "a", "r", "a"]' },
      fix:   { label: 'Wrap it',        code: 'names.append("Cara")\n# or\nnames.extend(["Cara"])', output: '["Ann", "Bob", "Cara"]' },
    },
    {
      name: 'The `xs = xs.extend(...)` bug',
      desc: 'extend returns None. Assigning its result back sets your variable to None — the same class of bug as sort. Python mutates in place on purpose.',
      wrong: { label: 'Now xs is None', code: 'xs = [1, 2]\nxs = xs.extend([3, 4])\nprint(xs)', output: 'None' },
      fix:   { label: 'Two options',    code: 'xs.extend([3, 4])   # mutate, keep name\n# or\nxs = xs + [3, 4]      # new list, replace name', output: '[1, 2, 3, 4]' },
    },
    {
      name: 'extend vs append confusion',
      desc: 'append adds ONE item (the whole argument). extend unpacks and adds items. Reaching for the wrong one silently produces a wrong-shaped list.',
      wrong: { label: 'Nested list',   code: 'xs = [1, 2]\nxs.append([3, 4])\nxs', output: '[1, 2, [3, 4]]' },
      fix:   { label: 'Flat list',     code: 'xs = [1, 2]\nxs.extend([3, 4])\nxs', output: '[1, 2, 3, 4]' },
    },
    {
      name: 'Not iterable → TypeError',
      desc: 'extend takes an iterable — passing a plain non-iterable (int, None, etc.) raises TypeError.',
      wrong: { label: 'Type error', code: 'xs = [1, 2]\nxs.extend(3)', output: "TypeError: 'int' object is not iterable" },
      fix:   { label: 'Wrap or append', code: 'xs.append(3)\n# or\nxs.extend([3])', output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Adding multiple items at once from any iterable',
      'Merging into an existing list without allocating a new one',
      'Accumulating from generators lazily',
      'Flattening one level of nested sequences',
    ],
    avoid: [
      'Adding a single item that IS a sequence → append',
      'Building a new list without mutating → xs + more or [*xs, *more]',
      'In one-liners / chains — extend returns None',
      'When the input might be a string but you meant to add it as one item',
    ],
  },

  notes: {
    complexity: 'O(k) where k is the length of the iterable',
    return:     'None; the list is mutated in place',
    cpython:    'Objects/listobject.c :: list_extend — grows the internal array as needed',
    memory:     'May reallocate the underlying array; amortized O(1) per item',
    threadSafe: 'Not safe under concurrent mutation of the same list',
  },

  related: [
    { name: 'append',      slug: 'append',      when: 'Add ONE item as a single element' },
    { name: 'list.pop',    slug: 'list-pop',    when: 'Remove from the end' },
    { name: 'list.sort',   slug: 'list-sort',   when: 'Reorder in place' },
    { name: 'list.copy',   slug: 'list-copy',   when: 'Take a snapshot before extending' },
    { name: 'sum',         slug: 'sum',         when: 'Flatten with sum(lists, []) — but O(n²), avoid' },
  ],

  faq: [
    {
      q: 'What is the difference between extend and +=?',
      a: 'For lists they are equivalent — both mutate in place and accept any iterable. `xs += other` is a syntactic shortcut for `xs.extend(other)`.',
    },
    {
      q: 'What is the difference between extend and +?',
      a: 'The `+` operator returns a NEW list without touching either input; extend mutates the left one and returns None. Also, extend accepts any iterable — `+` requires both sides to be lists.',
    },
    {
      q: 'Can I extend from a dict?',
      a: 'Yes — a dict iterates its keys, so `xs.extend(d)` appends the keys. Use d.values() or d.items() to get values or pairs instead.',
    },
    {
      q: 'Is extend faster than a for-loop of appends?',
      a: 'Yes. extend can grow the array once for the whole batch, while append reallocates as needed — the difference matters on large adds.',
    },
  ],

  history: [
    { version: '1.5', note: 'extend() introduced.' },
    { version: '2.0', note: 'Accepts any iterable, not just sequences.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.extend',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
  ],
};