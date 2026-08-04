// content/reference/python/functions/set-discard.js
//
// Slug is type-prefixed: `discard` is a set method.

export const meta = {
  slug:        'set-discard',
  name:        'set.discard',
  signature:   'set.discard(elem)',
  blurb:       'Remove an element — silently no-ops if it&apos;s not there.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'discard remove set delete mutate silent no-op missing keyerror safe',
};

export const method = {
  slug:      'set-discard',
  name:      'set.discard',
  signature: 'set.discard(elem)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the set state after discarding.' },

  category:    'Set method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Remove an element from the set. Silently does nothing if it is not present — the safe counterpart to set.remove().',

  cheat: {
    commonCall: 'seen.discard(item)',
    returns:    'None — the set may lose an element',
    replaces:   'a manual `if x in s: s.remove(x)` check',
    watchOut:   'unlike list.remove or set.remove, missing element is NOT an error',
  },

  parameters: [
    { name: 'elem', type: 'hashable', required: true, default: null, desc: 'The element to remove. If not present, discard does nothing. Non-hashable arguments (list, dict, set) still raise TypeError — they cannot be searched for.' },
  ],

  demoParams: [
    { name: 'set',  type: 'set', hint: 'starting set (comma-separated)', input: 'csv' },
    { name: 'elem', type: 'Any', hint: 'element to remove',              input: 'text' },
  ],
  cases: [
    { id: 'present',   label: 'present',       values: { set: 'a,b,c',   elem: 'b' } },
    { id: 'missing',   label: 'not there',     values: { set: 'a,b,c',   elem: 'z' } },
    { id: 'from-empty',label: 'from empty',    values: { set: '',        elem: 'x' } },
    { id: 'numbers',   label: 'numbers',       values: { set: '1,2,3',   elem: '2' } },
    { id: 'last-one',  label: 'last element',  values: { set: 'only',    elem: 'only' } },
  ],
  demoExplainer: 'The demo shows the SET STATE after discarding. Python actually returns None; the meaningful effect is mutation. discard() silently ignores missing elements — that is the whole point of choosing it over remove(). Order shown is not meaningful; Python sets are unordered.',

  patterns: [
    {
      name: '&quot;Remove if present&quot; no-branch',
      desc: 'discard is already idempotent — no `if in` needed.',
      code: 'seen.discard(x)   # no branch; safe whether x is there or not',
    },
    {
      name: 'Reset a flag',
      desc: 'Turning a flag off is a single call, regardless of prior state.',
      code: 'flags.discard("debug")',
    },
    {
      name: 'Prune from a set of listeners',
      desc: 'Common in publish/subscribe patterns where the same subscriber may be removed multiple times.',
      code: 'subscribers.discard(callback)',
    },
  ],

  examples: [
    { title: 'Element present',    code: 's = {"a", "b", "c"}\ns.discard("b")\ns',   returns: '{"a", "c"}' },
    { title: 'Missing is a no-op', code: 's = {"a", "b"}\ns.discard("z")\ns',         returns: '{"a", "b"}  # unchanged, no error' },
    { title: 'From empty set',     code: 's = set()\ns.discard("x")\ns',              returns: 'set()  # no error' },
    { title: 'Returns None',       code: '{"a", "b"}.discard("a")',                    returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'discard vs remove — silence vs KeyError',
      desc: 'discard is silent on missing. remove raises KeyError. Reaching for remove when you meant discard causes a crash on the very case discard was designed for.',
      wrong: { label: 'Blows up',   code: 's = {"a", "b"}\ns.remove("z")', output: "KeyError: 'z'" },
      fix:   { label: 'Silent',     code: 's.discard("z")', output: 'no error, no change' },
    },
    {
      name: 'The `s = s.discard(...)` bug',
      desc: 'discard() returns None. Assigning its result back sets your variable to None — the same class of bug as add, sort, and extend.',
      wrong: { label: 'Now s is None', code: 's = {"a", "b"}\ns = s.discard("a")\nprint(s)', output: 'None' },
      fix:   { label: 'Just discard', code: 's.discard("a")   # mutate, keep name', output: '{"b"}' },
    },
    {
      name: 'Silent no-op — you cannot tell if anything happened',
      desc: 'discard gives no signal. If you need to know whether the element was actually removed, check membership before calling.',
      wrong: { label: 'Fake count', code: 'count = 0\nfor x in items:\n    s.discard(x)\n    count += 1', output: 'count is len(items), not len(actually_removed)' },
      fix:   { label: 'Check first', code: 'count = 0\nfor x in items:\n    if x in s:\n        s.discard(x)\n        count += 1', output: 'count of real removals' },
    },
    {
      name: 'Unhashable elements still raise TypeError',
      desc: 'discard needs to hash the element to look it up. Passing a list or dict raises before the missing-check runs.',
      wrong: { label: 'Unhashable', code: 's = {1, 2, 3}\ns.discard([1])', output: "TypeError: unhashable type: 'list'" },
      fix:   { label: 'Hashable',   code: 's.discard((1,))\ns.discard(1)', output: 'no error' },
    },
  ],

  when: {
    use: [
      'Removing an element that may or may not be there — the &quot;idempotent delete&quot; pattern',
      'Resetting flags in a flag set',
      'Cleanup where duplicate discards should not cause errors',
      'Any code where the caller cannot guarantee the element is present',
    ],
    avoid: [
      'You need to know whether the element was actually there → check membership first',
      'You want an exception on missing → set.remove instead',
      'You need to remove ANY element (not a specific one) → set.pop',
      'Removing many at once → set.difference_update or `-=`',
    ],
  },

  notes: {
    complexity: 'O(1) amortized — hash table lookup and removal',
    return:     'None; the set is mutated in place',
    cpython:    'Objects/setobject.c :: set_discard',
    memory:     'In-place; no allocation',
    threadSafe: 'Not safe under concurrent mutation of the same set',
  },

  related: [
    { name: 'set.add',          slug: 'set-add',          when: 'The mirror — silent add of a single element' },
    { name: 'set.union',        slug: 'set-union',        when: 'Merge two sets into a new one — pure' },
    { name: 'set.difference',   slug: 'set-difference',   when: 'Remove many via a pure operation' },
    { name: 'list.remove',      slug: 'list-remove',      when: 'Analogous first-occurrence removal on lists — but raises' },
  ],

  faq: [
    {
      q: 'What is the difference between discard() and remove()?',
      a: 'discard silently does nothing when the element is missing; remove raises KeyError. Pick discard for &quot;remove if present&quot; workflows and remove for &quot;this element MUST be there — raise if it is not&quot;.',
    },
    {
      q: 'What is the difference between discard() and pop()?',
      a: 'discard removes a SPECIFIC element you name. pop removes and returns an ARBITRARY element — Python does not guarantee which. Both mutate the set; discard returns None, pop returns the removed element.',
    },
    {
      q: 'How do I know if discard actually removed something?',
      a: 'Check membership before calling. discard itself gives no return signal.',
      code: 'existed = x in s\ns.discard(x)\nif existed:\n    ...',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; discard has been the safe-delete method from the start.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.discard',
    meta:  'set.discard',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};