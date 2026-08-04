// content/reference/python/functions/set-add.js
//
// Slug is type-prefixed: `add` is a set method.

export const meta = {
  slug:        'set-add',
  name:        'set.add',
  signature:   'set.add(elem)',
  blurb:       'Add an element — silently no-ops if it&apos;s already there.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'add insert set mutate append unique element hashable no-op duplicate',
};

export const method = {
  slug:      'set-add',
  name:      'set.add',
  signature: 'set.add(elem)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the set state after adding.' },

  category:    'Set method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Insert a single element into the set. Silently does nothing if the element is already present.',

  cheat: {
    commonCall: 'seen.add(item)',
    returns:    'None — the set itself gains at most one element',
    replaces:   'a manual `if x not in s: s.add(x)` check',
    watchOut:   'element must be hashable — lists and dicts raise TypeError',
  },

  parameters: [
    { name: 'elem', type: 'hashable', required: true, default: null, desc: 'The element to add. Must be hashable — ints, floats, strings, tuples of hashables, frozensets are all fine. Lists, dicts, sets raise TypeError.' },
  ],

  demoParams: [
    { name: 'set',  type: 'set', hint: 'starting set (comma-separated)', input: 'csv' },
    { name: 'elem', type: 'Any', hint: 'element to add',                 input: 'text' },
  ],
  cases: [
    { id: 'new',        label: 'add new',        values: { set: 'a,b,c',   elem: 'd' } },
    { id: 'duplicate',  label: 'add duplicate',  values: { set: 'a,b,c',   elem: 'b' } },
    { id: 'to-empty',   label: 'to empty',       values: { set: '',        elem: 'x' } },
    { id: 'numbers',    label: 'numbers',        values: { set: '1,2,3',   elem: '4' } },
    { id: 'dup-input',  label: 'dupes in input', values: { set: 'a,a,b,b', elem: 'c' } },
  ],
  demoExplainer: 'The demo shows the SET STATE after adding. Python actually returns None; the meaningful effect is mutation. add() silently ignores duplicates — that is the point of sets. In the demo, duplicates in the starting CSV collapse first, then the new element is added (or not, if it&apos;s already there). Order shown is not meaningful; Python sets are unordered.',

  patterns: [
    {
      name: 'Build a set incrementally',
      desc: 'The idiomatic way to accumulate unique items in a loop.',
      code: 'seen = set()\nfor item in items:\n    seen.add(item)',
    },
    {
      name: 'Track visited nodes',
      desc: 'Classic pattern in BFS / DFS graph traversal.',
      code: 'visited = set()\nqueue = [start]\nwhile queue:\n    node = queue.pop()\n    if node not in visited:\n        visited.add(node)\n        queue.extend(node.neighbors)',
    },
    {
      name: '&quot;Add if new&quot; no-branch',
      desc: 'add() is already idempotent — no `if not in` needed.',
      code: 'seen.add(x)   # no branch; safe to call whether x is there or not',
    },
  ],

  examples: [
    { title: 'Add a new element',    code: 's = {1, 2}\ns.add(3)\ns',           returns: '{1, 2, 3}' },
    { title: 'Duplicate is a no-op', code: 's = {1, 2}\ns.add(2)\ns',           returns: '{1, 2}  # unchanged' },
    { title: 'To an empty set',      code: 's = set()\ns.add("hello")\ns',      returns: '{"hello"}' },
    { title: 'Returns None',         code: '{1, 2}.add(3)',                       returns: 'None' },
    { title: 'Tuple element (hashable)', code: 's = set()\ns.add((1, 2))\ns',    returns: '{(1, 2)}' },
  ],

  pitfalls: [
    {
      name: 'Unhashable elements raise TypeError',
      desc: 'Lists, dicts, and sets are mutable and therefore unhashable — they cannot go into a set. Use a tuple, frozenset, or a hashable wrapper.',
      wrong: { label: 'Unhashable',  code: 's = set()\ns.add([1, 2])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Use tuple',   code: 's.add((1, 2))', output: '{(1, 2)}' },
    },
    {
      name: 'The `xs = xs.add(...)` bug',
      desc: 'add() returns None. Assigning its result back sets your variable to None — the same class of bug as sort, extend, and insert.',
      wrong: { label: 'Now s is None', code: 's = {1, 2}\ns = s.add(3)\nprint(s)', output: 'None' },
      fix:   { label: 'Just add',      code: 's.add(3)   # mutate, keep name', output: '{1, 2, 3}' },
    },
    {
      name: 'Silent no-op — not a signal of anything',
      desc: 'A duplicate add() gives NO indication that nothing happened. Fine (and useful) for accumulator patterns; misleading if you were counting distinct additions.',
      wrong: { label: 'Fake count', code: 'count = 0\nfor x in items:\n    s.add(x)\n    count += 1', output: 'count is len(items), not len(unique)' },
      fix:   { label: 'Check first', code: 'count = 0\nfor x in items:\n    if x not in s:\n        s.add(x)\n        count += 1', output: 'count of new additions only' },
    },
    {
      name: 'Confused with union() and update()',
      desc: 'add() takes ONE element and mutates. update() takes an iterable and adds all its items. Reaching for add() with a list adds the WHOLE list as one element — but lists are unhashable, so it raises.',
      wrong: { label: 'Wrong shape', code: 's = {1, 2}\ns.add([3, 4])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Multi-add', code: 's.update([3, 4])', output: '{1, 2, 3, 4}' },
    },
  ],

  when: {
    use: [
      'Building a set incrementally from a loop or stream',
      'Tracking visited / seen items in traversals',
      'De-duplicating items as you encounter them',
      '&quot;Add if new&quot; without branching — idempotent by design',
    ],
    avoid: [
      'Adding many items at once → update() or the `|=` operator',
      'Elements that are lists / dicts / sets → not hashable',
      'You need to know whether the element was actually new → check membership first',
      'Building a NEW set from an existing one → union() or the `|` operator',
    ],
  },

  notes: {
    complexity: 'O(1) amortized — hash table insertion',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_add',
    memory:     'May reallocate the underlying hash table when it grows past its load factor',
    threadSafe: 'Not safe under concurrent mutation of the same set',
  },

  related: [
    { name: 'set.union',        slug: 'set-union',        when: 'Add many items and get a new set back — pure' },
    { name: 'set.intersection', slug: 'set-intersection', when: 'Keep only common elements — pure' },
    { name: 'set.difference',   slug: 'set-difference',   when: 'Remove certain elements — pure' },
    { name: 'list.append',      slug: 'append',           when: 'Analogous single-item mutation for lists' },
  ],

  faq: [
    {
      q: 'What is the difference between add() and update()?',
      a: 'add() takes ONE element and inserts it into the set. update() takes an ITERABLE and inserts each of its items. Reaching for add() with a list will try to store the list itself — which fails because lists are unhashable.',
    },
    {
      q: 'How do I check if an element was actually added?',
      a: 'add() gives no signal — check membership BEFORE calling.',
      code: 'if x not in s:\n    s.add(x)\n    # do &quot;first sighting&quot; work here',
    },
    {
      q: 'Can I add an element to a frozenset?',
      a: 'No — frozenset is immutable and has no add() method. Build the new set with `frozenset(existing) | {new_elem}`.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; add() has been the fundamental insertion method from the start.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.add',
    meta:  'set.add',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};