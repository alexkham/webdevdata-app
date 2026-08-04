// content/reference/python/functions/list-reverse.js
//
// Slug is type-prefixed: `reverse` is a list method (contrast the reversed builtin).

export const meta = {
  slug:        'list-reverse',
  name:        'list.reverse',
  signature:   'list.reverse()',
  blurb:       'Flip the list end-to-end IN PLACE — returns None.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'reverse in-place mutate list backward order flip end to end',
};

export const method = {
  slug:      'list-reverse',
  name:      'list.reverse',
  signature: 'list.reverse()',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after reversing.' },

  category:    'List method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Reverse the list in place — mutates, returns None. The mirror of the reversed() builtin, which is pure.',

  cheat: {
    commonCall: 'items.reverse()',
    returns:    'None — the list itself is flipped',
    replaces:   'building a reversed copy when you own the list',
    watchOut:   'the classic bug: `xs = xs.reverse()` sets xs to None',
  },

  parameters: [
    // No parameters — parameters array intentionally empty
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'basic',   label: 'basic',       values: { items: 'a,b,c,d' } },
    { id: 'numbers', label: 'numbers',     values: { items: '1,2,3,4,5' } },
    { id: 'one',     label: 'single item', values: { items: 'x' } },
    { id: 'two',     label: 'two items',   values: { items: 'first,last' } },
    { id: 'palin',   label: 'palindrome',  values: { items: 'a,b,c,b,a' } },
    { id: 'empty',   label: 'empty',       values: { items: '' } },
  ],
  demoExplainer: 'The demo shows the LIST STATE after reversing. Python actually returns None; the meaningful effect is mutation. reverse() is destructive and O(n) in place — no copy. Compare with reversed(xs) which returns a lazy iterator without touching the source, and xs[::-1] which returns a materialized reversed copy.',

  patterns: [
    {
      name: 'Reverse a working buffer',
      desc: 'When you own the list and no other reference needs the original order.',
      code: 'buffer.reverse()',
    },
    {
      name: 'Bottom-up processing after collection',
      desc: 'Collect forward, process backward — one flip beats indexing tricks.',
      code: 'events.reverse()\nfor event in events:\n    replay(event)',
    },
    {
      name: 'Two-step round trip',
      desc: 'Applying reverse twice restores the original order — useful in tests.',
      code: 'xs.reverse()\n# ... do stuff ...\nxs.reverse()   # original order again',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'xs = [1, 2, 3]\nxs.reverse()\nxs',       returns: '[3, 2, 1]' },
    { title: 'Single item',        code: 'xs = ["a"]\nxs.reverse()\nxs',           returns: '["a"]' },
    { title: 'Empty',              code: 'xs = []\nxs.reverse()\nxs',              returns: '[]' },
    { title: 'Returns None (surprise)', code: '[1, 2, 3].reverse()',                    returns: 'None' },
    { title: 'Two calls restore',  code: 'xs = [1, 2, 3]\nxs.reverse()\nxs.reverse()\nxs', returns: '[1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'The `xs = xs.reverse()` bug',
      desc: 'reverse() returns None. Assigning its result back sets your variable to None — the original list is now unreachable through xs. Same class of bug as sort, extend, and insert.',
      wrong: { label: 'Now xs is None', code: 'xs = [1, 2, 3]\nxs = xs.reverse()\nprint(xs)', output: 'None' },
      fix:   { label: 'Two options',    code: 'xs.reverse()          # mutate, keep name\n# or\nxs = xs[::-1]          # new list, replace name', output: '[3, 2, 1]' },
    },
    {
      name: 'Only works on lists',
      desc: 'reverse is a list METHOD. Tuples, strings, ranges, sets, dicts, generators — none of them have it. Reach for reversed() when the source is not a mutable list.',
      wrong: { label: 'AttributeError', code: '(1, 2, 3).reverse()', output: "AttributeError: 'tuple' object has no attribute 'reverse'" },
      fix:   { label: 'reversed() works', code: 'list(reversed((1, 2, 3)))', output: '[3, 2, 1]' },
    },
    {
      name: 'Confused with reversed() and [::-1]',
      desc: 'Three different tools with three different shapes: reverse() mutates and returns None; reversed(xs) returns a lazy iterator and leaves xs alone; xs[::-1] returns a materialized reversed copy. Pick the one that matches the intent.',
      wrong: { label: 'Mutating when you meant a copy', code: 'ys = xs.reverse()\n# now ys is None and xs is flipped', output: 'both variables surprising' },
      fix:   { label: 'Pick your intent', code: 'ys = xs[::-1]           # copy, xs untouched\nys = list(reversed(xs))  # copy via iterator\nxs.reverse()             # mutate xs, no new list', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'You own the list and no one else needs the original order',
      'Working buffers where allocating a copy would hurt',
      'Two-pass algorithms that flip and iterate',
    ],
    avoid: [
      'You need to keep the original → xs[::-1] copy',
      'One-liners in a chain (reverse returns None, breaks the chain)',
      'Concurrent readers of the same list',
      'Non-list sources → reversed()',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'None; the list is mutated in place',
    cpython:    'Objects/listobject.c :: list_reverse_impl — in-place three-swap loop',
    memory:     'In-place; no new list allocated',
    threadSafe: 'Not safe under concurrent reads or writes of the same list',
  },

  related: [
    { name: 'reversed',    slug: 'reversed',    when: 'Return a lazy iterator without mutating' },
    { name: 'list.sort',   slug: 'list-sort',   when: 'Order in place — also has reverse=True' },
    { name: 'sorted',      slug: 'sorted',      when: 'Return a new ordered list' },
  ],

  faq: [
    {
      q: 'Why does reverse() return None?',
      a: 'Python returns None from mutating list methods on purpose — a signal that the operation modified the receiver. It also discourages the `xs = xs.reverse()` bug (mildly — it happens anyway).',
    },
    {
      q: 'Is reverse() faster than [::-1]?',
      a: 'reverse() runs in place with no allocation — O(1) memory. `xs[::-1]` allocates a full copy — O(n) memory. Both are O(n) time. On a hot loop with large lists, reverse() can be measurably better.',
    },
    {
      q: 'What is the difference between reverse and reversed?',
      a: 'reverse is a METHOD (xs.reverse()) that mutates in place and returns None. reversed is a BUILTIN (reversed(xs)) that returns a lazy iterator and leaves the source untouched. Different tools for different jobs.',
    },
  ],

  history: [
    { version: '1.0', note: 'list.reverse has been part of the list type since Python 1.0.' },
    { version: '2.4', note: 'reversed() builtin added — the pure counterpart.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.reverse',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data before and after' },
  ],
};