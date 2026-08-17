// content/reference/python/functions/set-remove.js
//
// Slug is type-prefixed: `remove` is a set method (also on list, differently).

export const meta = {
  slug:        'set-remove',
  name:        'set.remove',
  signature:   'set.remove(elem)',
  blurb:       'Remove an element — raises KeyError if it&apos;s not there.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'remove set delete mutate keyerror strict missing element required',
};

export const method = {
  slug:      'set-remove',
  name:      'set.remove',
  signature: 'set.remove(elem)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the set state after removing (or the error when the element is missing).' },

  category:    'Set method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Remove an element from the set — raise KeyError if it is not there. The strict counterpart to set.discard().',

  cheat: {
    commonCall: 'seen.remove(item)',
    returns:    'None — the set loses one element (or raises)',
    replaces:   'discard() when the caller is CERTAIN the element is present',
    watchOut:   'missing element raises KeyError — use discard() for silent removal',
  },

  parameters: [
    { name: 'elem', type: 'hashable', required: true, default: null, desc: 'The element to remove. Must be present — missing raises KeyError. Must be hashable — lists, dicts, sets raise TypeError.' },
  ],

  demoParams: [
    { name: 'set',  type: 'set', hint: 'starting set (comma-separated)', input: 'csv-set' },
    { name: 'elem', type: 'Any', hint: 'element to remove',              input: 'text' },
  ],
  cases: [
    { id: 'present',   label: 'present',      values: { set: 'a,b,c',   elem: 'b' } },
    { id: 'missing',   label: 'not there',    values: { set: 'a,b,c',   elem: 'z' } },
    { id: 'from-empty',label: 'from empty',   values: { set: '',        elem: 'x' } },
    { id: 'numbers',   label: 'numbers',      values: { set: '1,2,3',   elem: '2' } },
    { id: 'last-one',  label: 'last element', values: { set: 'only',    elem: 'only' } },
  ],
  demoExplainer: 'The demo shows the SET STATE after removing. Python actually returns None; the meaningful effect is mutation. remove() raises KeyError when the element is missing — exactly the behavior discard() was designed to avoid. Pick remove when absence is a bug worth catching; pick discard when absence is expected.',

  patterns: [
    {
      name: 'Assertion-style removal',
      desc: 'Use remove when the element MUST be there. A missing one signals a bug and the KeyError is the right response.',
      code: 'active.remove(session_id)   # raises if the session was never active',
    },
    {
      name: 'Guarded remove',
      desc: 'When you want to handle the missing case explicitly rather than silently.',
      code: 'try:\n    s.remove(x)\nexcept KeyError:\n    log.warning("expected %s in set", x)',
    },
    {
      name: 'Prefer discard for &quot;maybe present&quot;',
      desc: 'The whole point of choosing set.remove over set.discard is the exception on missing.',
      code: 'if x is required_to_be_present:\n    s.remove(x)\nelse:\n    s.discard(x)',
    },
  ],

  examples: [
    { title: 'Element present',    code: 's = {"a", "b", "c"}\ns.remove("b")\ns',    returns: '{"a", "c"}' },
    { title: 'Missing raises',     code: 's = {"a", "b"}\ns.remove("z")',             returns: "KeyError: 'z'" },
    { title: 'From empty raises',  code: 'set().remove("x")',                          returns: "KeyError: 'x'" },
    { title: 'Returns None',       code: '{"a", "b"}.remove("a")',                     returns: 'None' },
    { title: 'Last element ok',    code: 's = {"only"}\ns.remove("only")\ns',          returns: 'set()' },
  ],

  pitfalls: [
    {
      name: 'KeyError on missing — pick discard() if that is not what you want',
      desc: 'The whole difference between remove and discard is this one behavior. If your code cannot guarantee the element is present, discard is the safer default.',
      wrong: { label: 'Blows up',   code: 's = {"a", "b"}\ns.remove("z")', output: "KeyError: 'z'" },
      fix:   { label: 'Silent',     code: 's.discard("z")', output: 'no error, no change' },
    },
    {
      name: 'The `s = s.remove(...)` bug',
      desc: 'remove() returns None. Assigning its result back sets your variable to None — the same class of bug as add, sort, and discard.',
      wrong: { label: 'Now s is None', code: 's = {"a", "b"}\ns = s.remove("a")\nprint(s)', output: 'None' },
      fix:   { label: 'Just remove',   code: 's.remove("a")   # mutate, keep name', output: '{"b"}' },
    },
    {
      name: 'Unhashable elements raise TypeError, not KeyError',
      desc: 'remove needs to hash the element to look it up. Passing a list or dict raises BEFORE the missing-check would fire — a different error class from what you might expect.',
      wrong: { label: 'Wrong error type', code: 's = {1, 2, 3}\ns.remove([1])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Hashable form',    code: 's.remove(1)', output: 'no error' },
    },
    {
      name: 'Removing while iterating',
      desc: 'Mutating a set you are iterating over raises RuntimeError. Iterate a snapshot instead.',
      wrong: { label: 'Runtime error', code: 'for x in s:\n    if predicate(x):\n        s.remove(x)', output: 'RuntimeError: set changed size during iteration' },
      fix:   { label: 'Iterate a copy', code: 'for x in list(s):\n    if predicate(x):\n        s.remove(x)', output: 'safe' },
    },
  ],

  when: {
    use: [
      'Elements you KNOW should be present — a missing one is a bug',
      'Assertion-style pruning where the exception is the point',
      'Wrapping in try/except to detect and log unexpected absences',
    ],
    avoid: [
      '&quot;Remove if present&quot; workflows → set.discard is idempotent',
      'You want to remove ANY element (not a specific one) → set.pop',
      'Removing many at once → set.difference_update or `-=`',
      'Iterating and removing from the same set → iterate a snapshot',
    ],
  },

  notes: {
    complexity: 'O(1) amortized — hash table lookup and removal',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_remove',
    memory:     'In-place; no allocation',
    threadSafe: 'Not safe under concurrent mutation of the same set',
  },

  related: [
    { name: 'set.discard',      slug: 'set-discard',      when: 'Silent no-op on missing — the safe counterpart' },
    { name: 'set.add',          slug: 'set-add',          when: 'The mirror — insertion' },
    { name: 'set.difference',   slug: 'set-difference',   when: 'Remove many via a pure operation' },
    { name: 'list.remove',      slug: 'list-remove',      when: 'Analogous first-occurrence removal on lists' },
  ],

  faq: [
    {
      q: 'What is the difference between remove() and discard()?',
      a: 'remove raises KeyError when the element is missing; discard silently does nothing. Pick remove when absence signals a bug; pick discard when absence is expected and cheap to ignore.',
    },
    {
      q: 'Why remove() over discard()?',
      a: 'The exception. When your code invariant says &quot;this element MUST be here&quot;, remove tripping is the loud signal that something upstream broke — better than the silent skip discard would give you.',
    },
    {
      q: 'Is remove() faster than discard()?',
      a: 'Effectively identical — both do a hash-table lookup. The only difference is what happens when the lookup misses.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; remove has been the strict-delete method from the start.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.remove',
    meta:  'set.remove',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};