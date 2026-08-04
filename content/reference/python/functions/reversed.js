// content/reference/python/functions/reversed.js

export const meta = {
  slug:        'reversed',
  name:        'reversed',
  signature:   'reversed(seq)',
  blurb:       'Walk any sequence back to front — lazily, without copying.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'reversed reverse iterator backward last first order lazy sequence',
};

export const method = {
  slug:      'reversed',
  name:      'reversed',
  signature: 'reversed(seq)',
  returns:   { type: 'reversed', desc: 'An iterator that yields the items of seq in reverse order. Lazy — nothing is copied.' },

  category:    'Built-in function',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Return a lazy reverse iterator over any sequence — list, tuple, string, range, or anything with __reversed__.',

  cheat: {
    commonCall: 'for x in reversed(items):',
    returns:    'iterator — wrap in list() to materialize',
    replaces:   'the [::-1] slice, which builds a full reversed copy',
    watchOut:   'does NOT work on sets, dicts, or generic iterables',
  },

  parameters: [
    { name: 'seq', type: 'sequence', required: true, default: null, desc: 'Anything supporting reverse iteration: list, tuple, string, range, bytes, or a type with __reversed__ (or __len__ + __getitem__). Sets and generic generators are refused.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated items', input: 'csv' },
  ],
  cases: [
    { id: 'basic',   label: 'basic',    values: { items: 'a,b,c,d' } },
    { id: 'numbers', label: 'numbers',  values: { items: '1,2,3,4,5' } },
    { id: 'one',     label: 'single',   values: { items: 'x' } },
    { id: 'two',     label: 'palindrome', values: { items: 'a,b,c,b,a' } },
    { id: 'empty',   label: 'empty',    values: { items: '' } },
  ],
  demoExplainer: 'reversed returns an iterator — the demo materializes it as a list so you can see the whole result. In real code you iterate directly: `for x in reversed(items):`. The source sequence is NOT copied — reversed just walks it back-to-front.',

  patterns: [
    {
      name: 'Iterate backwards',
      desc: 'The clean replacement for range(len(items) - 1, -1, -1) indexing gymnastics.',
      code: 'for item in reversed(items):\n    process(item)',
    },
    {
      name: 'Enumerate from the end',
      desc: 'Pair reversed with enumerate — but note: enumerate still counts forward.',
      code: 'for i, item in enumerate(reversed(items)):\n    ...',
    },
    {
      name: 'Reverse a string without copying twice',
      desc: 'reversed(s) is a lazy iterator; join materializes once at the end.',
      code: 'flipped = "".join(reversed(s))',
    },
    {
      name: 'Bottom-up processing',
      desc: 'Iterating a sorted list in reverse is common for &quot;largest first&quot; workflows.',
      code: 'for score, name in reversed(sorted(scores)):\n    print(name, score)',
    },
  ],

  examples: [
    { title: 'Basic list',        code: 'list(reversed([1, 2, 3]))',   returns: '[3, 2, 1]' },
    { title: 'String',            code: 'list(reversed("abc"))',        returns: '["c", "b", "a"]' },
    { title: 'Range',             code: 'list(reversed(range(3)))',     returns: '[2, 1, 0]' },
    { title: 'Empty is empty',    code: 'list(reversed([]))',           returns: '[]' },
    { title: 'Fluent join',       code: '"".join(reversed("hello"))',   returns: '"olleh"' },
  ],

  pitfalls: [
    {
      name: 'reversed() does NOT accept sets or general iterables',
      desc: 'Sets are unordered — there is nothing to reverse. Generic iterables (generators, map/filter objects) do not support __reversed__. Convert to a list first.',
      wrong: { label: 'Type error', code: 'list(reversed({1, 2, 3}))', output: "TypeError: argument to reversed() must be a sequence" },
      fix:   { label: 'Materialize first', code: 'list(reversed(list({1, 2, 3})))', output: 'reversed of the list snapshot' },
    },
    {
      name: 'Iterator exhausts after one pass',
      desc: 'reversed returns an iterator, not a list. Loop through it twice and the second loop sees nothing.',
      wrong: { label: 'Empty on reuse', code: 'r = reversed([1, 2, 3])\nlist(r)   # [3, 2, 1]\nlist(r)   # []', output: 'second list() is empty' },
      fix:   { label: 'Materialize once', code: 'r = list(reversed([1, 2, 3]))\n# reuse r freely', output: 'reusable list' },
    },
    {
      name: 'Confused with list.reverse',
      desc: 'reversed(xs) returns a NEW iterator and leaves xs alone. xs.reverse() MUTATES xs and returns None. Reaching for the wrong one silently changes (or fails to change) your list.',
      wrong: { label: 'No effect on source', code: 'xs = [1, 2, 3]\nreversed(xs)\nxs', output: '[1, 2, 3]  # reversed() alone does nothing' },
      fix:   { label: 'Pick your intent', code: 'xs.reverse()          # mutate\n# or\nys = list(reversed(xs)) # new list', output: 'explicit choice' },
    },
    {
      name: '[::-1] is often the right tool instead',
      desc: 'reversed is lazy but returns an iterator. `xs[::-1]` returns a fully-materialized reversed copy. Pick based on whether you need laziness or a real sequence.',
      wrong: { label: 'When you need a list', code: 'reversed(xs)  # object, not indexable', output: "&lt;list_reverseiterator object&gt;" },
      fix:   { label: 'Slice returns a list', code: 'xs[::-1]', output: '[..., 3, 2, 1]  # ordinary list' },
    },
  ],

  when: {
    use: [
      'Iterating backwards without allocating a copy',
      'Pipelines feeding another iterator (join, sum, next)',
      'Very large sequences where a copy would hurt',
      'Reading log lines from the end',
    ],
    avoid: [
      'Sets, dicts, generators → convert to list first, or reach for a different tool',
      'Indexing / slicing the result → use xs[::-1] which returns a real sequence',
      'Reordering in place → list.reverse',
    ],
  },

  notes: {
    complexity: 'O(1) to construct; O(n) to iterate',
    return:     'reversed iterator — one-shot',
    cpython:    'Objects/enumobject.c :: reversed_iterator — walks the source by index in reverse',
    memory:     'O(1) — no copy of the source',
    threadSafe: 'The iterator is safe; the source should not mutate during iteration',
  },

  related: [
    { name: 'sorted',       slug: 'sorted',       when: 'Change the order according to a comparison, not just flip it' },
    { name: 'list.sort',    slug: 'list-sort',    when: 'Reorder in place — also try reverse=True' },
    { name: 'enumerate',    slug: 'enumerate',    when: 'Index alongside items' },
    { name: 'zip',          slug: 'zip',          when: 'Walk in parallel across sequences' },
  ],

  faq: [
    {
      q: 'What is the difference between reversed and [::-1]?',
      a: 'reversed(xs) is lazy — an iterator that yields items on demand, no copy. xs[::-1] builds a fully-materialized reversed copy. Use reversed when you feed the result into another iterator; use the slice when you need to keep or index it.',
    },
    {
      q: 'Can I reverse a dict?',
      a: 'From Python 3.8, reversed() works on dicts and returns the keys in reverse insertion order. Before 3.8, dicts were not reversible.',
      code: 'list(reversed({"a": 1, "b": 2}))\n# ["b", "a"]',
    },
    {
      q: 'How do I make my class work with reversed()?',
      a: 'Implement __reversed__ (returns an iterator). If you already have __len__ and __getitem__ over integer indices, Python auto-generates a reverse walker for free.',
    },
  ],

  history: [
    { version: '2.4', note: 'reversed() introduced.' },
    { version: '3.8', note: 'dicts became reversible — reversed(d) yields keys in reverse insertion order.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#reversed',
    meta:  'reversed',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the sequence' },
  ],
};