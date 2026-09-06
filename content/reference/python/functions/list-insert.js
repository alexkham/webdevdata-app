// content/reference/python/functions/list-insert.js
//
// Slug is type-prefixed: `insert` is a list method.

export const meta = {
  slug:        'list-insert',
  name:        'list.insert',
  signature:   'list.insert(i, item)',
  blurb:       'Insert an item at a given position — shifting the rest right.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'insert position index add prepend beginning list mutate before',
};

export const method = {
  slug:      'list-insert',
  name:      'list.insert',
  signature: 'list.insert(i, item)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after inserting.' },

  category:    'List method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Insert item BEFORE position i. Negative indexes work; out-of-range indexes clamp to the ends instead of raising.',

  cheat: {
    commonCall: 'items.insert(0, first)',
    returns:    'None — the list itself grows by one at position i',
    replaces:   'the \"shift everything and set\" index-manipulation pattern',
    watchOut:   'out-of-range i does NOT raise — it clamps to 0 or len(list)',
  },

  parameters: [
    { name: 'i',    type: 'int', required: true, default: null, desc: 'Position to insert BEFORE. Negative counts from the end. Out-of-range clamps to 0 (very negative) or len(list) (very positive) — no error.' },
    { name: 'item', type: 'Any', required: true, default: null, desc: 'Value to insert. Not unpacked — the whole item goes in as one element.' },
  ],

  demoParams: [
    { name: 'list',  type: 'list', hint: 'starting list',       input: 'csv' },
    { name: 'index', type: 'int',  hint: 'position to insert before', input: 'number' },
    { name: 'item',  type: 'Any',  hint: 'item to insert',      input: 'text' },
  ],
  cases: [
    { id: 'front',      label: 'prepend (0)',      values: { list: 'b,c,d',   index: 0,  item: 'a' } },
    { id: 'middle',     label: 'middle (2)',       values: { list: 'a,b,d,e', index: 2,  item: 'c' } },
    { id: 'end',        label: 'end (len)',        values: { list: 'a,b,c',   index: 3,  item: 'd' } },
    { id: 'past-end',   label: 'past end (99)',    values: { list: 'a,b,c',   index: 99, item: 'z' } },
    { id: 'negative',   label: 'negative (-1)',    values: { list: 'a,b,d',   index: -1, item: 'c' } },
    { id: 'very-neg',   label: 'very negative',    values: { list: 'a,b,c',   index: -99, item: 'z' } },
    { id: 'empty',      label: 'into empty',       values: { list: '',        index: 0,  item: 'x' } },
  ],
  demoExplainer: 'The demo output is None, and that is the real return value — insert mutates the list and gives nothing back. Insert places the item BEFORE index i. Out-of-range indexes clamp silently — insert(99, x) is the same as append(x); insert(-99, x) is the same as insert(0, x). Negative indexes count from the end, but insert(-1, x) goes BEFORE the last element, not after.',

  patterns: [
    {
      name: 'Prepend to a list',
      desc: 'The idiomatic way to add at the front — though costly on big lists (O(n) shift).',
      code: 'items.insert(0, first)',
    },
    {
      name: 'Keep a sorted list sorted',
      desc: 'bisect finds the position; insert places the item there in one call.',
      code: 'import bisect\nbisect.insort(items, new_value)  # uses insert internally',
    },
    {
      name: 'Guarded insert',
      desc: 'Bounds checking is up to you — insert never raises for a bad index.',
      code: 'if 0 <= i <= len(items):\n    items.insert(i, x)\nelse:\n    raise IndexError(i)',
    },
  ],

  examples: [
    { title: 'Prepend',            code: 'xs = [2, 3]\nxs.insert(0, 1)\nxs',      returns: '[1, 2, 3]' },
    { title: 'Middle',             code: 'xs = [1, 2, 4]\nxs.insert(2, 3)\nxs',   returns: '[1, 2, 3, 4]' },
    { title: 'At length = append', code: 'xs = [1, 2]\nxs.insert(2, 3)\nxs',      returns: '[1, 2, 3]' },
    { title: 'Past length clamps', code: 'xs = [1, 2]\nxs.insert(99, 3)\nxs',     returns: '[1, 2, 3]' },
    { title: 'Negative before last',code: 'xs = [1, 2, 4]\nxs.insert(-1, 3)\nxs', returns: '[1, 2, 3, 4]' },
    { title: 'Returns None',       code: '[1, 2, 3].insert(0, 0)',                  returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Out-of-range indexes DO NOT raise',
      desc: 'Unlike subscript access or delete, insert clamps silently — huge index means append, huge negative means prepend. Fine for expected behavior; a silent bug when you thought the index was validated.',
      wrong: { label: 'Silent clamp',  code: 'xs = [1, 2, 3]\nxs.insert(999, "X")\nxs', output: '[1, 2, 3, "X"]  # no error' },
      fix:   { label: 'Validate first', code: 'if 0 <= i <= len(xs):\n    xs.insert(i, "X")\nelse:\n    raise IndexError(i)', output: 'explicit error on bad index' },
    },
    {
      name: 'The `xs = xs.insert(...)` bug',
      desc: 'insert returns None. Assigning its result back sets your variable to None — the same class of bug as sort and extend.',
      wrong: { label: 'Now xs is None', code: 'xs = [1, 2, 3]\nxs = xs.insert(0, 0)\nprint(xs)', output: 'None' },
      fix:   { label: 'Just insert',    code: 'xs.insert(0, 0)   # mutate, keep name', output: '[0, 1, 2, 3]' },
    },
    {
      name: 'insert(0, x) is O(n)',
      desc: 'Prepending shifts every existing item right by one. Fine for small lists; a hot-loop killer for big ones. Use collections.deque when you prepend often.',
      wrong: { label: 'Slow at scale', code: 'for x in incoming:\n    items.insert(0, x)  # O(n) each call — O(n²) total', output: 'quadratic time' },
      fix:   { label: 'deque is O(1)', code: 'from collections import deque\nd = deque(items)\nfor x in incoming:\n    d.appendleft(x)', output: 'linear time' },
    },
    {
      name: 'Confused with subscript assignment',
      desc: 'xs[i] = v REPLACES the item at i. xs.insert(i, v) SHIFTS everything from i onward one step right. Different meanings; picking the wrong one silently changes the list length or overwrites data.',
      wrong: { label: 'Overwrites', code: 'xs = [1, 2, 3]\nxs[1] = 99\nxs', output: '[1, 99, 3]  # replaced, not inserted' },
      fix:   { label: 'Insert shifts', code: 'xs = [1, 2, 3]\nxs.insert(1, 99)\nxs', output: '[1, 99, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Inserting at a known position in a small list',
      'Prepending occasionally to a small list',
      'Keeping a sorted list sorted after a manual bisect.bisect find',
      'Injecting into a fixed-shape output being built up',
    ],
    avoid: [
      'Frequent prepending on big lists → collections.deque',
      'Adding at the end → append (clearer, same speed)',
      'Adding multiple items → extend (one call, one grow)',
      'When bad indexes should raise → validate before calling',
    ],
  },

  notes: {
    complexity: 'O(n) — every item from i to the end shifts right by one',
    return:     'None; the list is mutated in place',
    cpython:    'Objects/listobject.c :: ins1 — grows the internal array as needed, then memmove',
    memory:     'May reallocate the underlying array; the shift is in-place',
    threadSafe: 'Not safe under concurrent mutation of the same list',
  },

  related: [
    { name: 'append',      slug: 'append',      when: 'Add to the end — no shift, O(1)' },
    { name: 'list.extend', slug: 'list-extend', when: 'Add many items to the end' },
    { name: 'list.pop',    slug: 'list-pop',    when: 'Remove by index' },
    { name: 'list.index',  slug: 'list-index',  when: 'Find a value\'s position before inserting next to it' },
  ],

  faq: [
    {
      q: 'What does insert(-1, x) do?',
      a: 'It inserts BEFORE the last element, not after it. To insert AFTER the last (i.e., append), use insert(len(xs), x) or just append(x).',
      code: 'xs = [1, 2, 3]\nxs.insert(-1, 99)\n# [1, 2, 99, 3]',
    },
    {
      q: 'Why does insert(999, x) not raise?',
      a: 'By design — insert clamps to the ends rather than error. Convenient when the index comes from arithmetic that might overshoot; annoying when you wanted validation. The Python docs say: \"insert inserts before the item at that index.\"',
    },
    {
      q: 'What is the difference between insert(0, x) and [x] + xs?',
      a: 'insert mutates the list in place, returns None, O(n) via shift. `[x] + xs` returns a NEW list, leaves the original alone, also O(n) via copy. Pick based on whether the original identity matters.',
    },
  ],

  history: [
    { version: '1.0', note: 'list.insert has been part of the list type since Python 1.0.' },
    { version: '2.0', note: 'Negative indexes and out-of-range clamping behavior formalized.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.insert',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data before and after' },
  ],
};