// content/reference/python/functions/dict-copy.js
//
// Slug is type-prefixed: `copy` is a dict method.

export const meta = {
  slug:        'dict-copy',
  name:        'dict.copy',
  signature:   'dict.copy()',
  blurb:       'Shallow copy — new dict, same nested references.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'copy dict shallow duplicate clone deep new independent nested references',
};

export const method = {
  slug:      'dict-copy',
  name:      'dict.copy',
  signature: 'dict.copy()',
  returns:   { type: 'dict', desc: 'A NEW dict with the same key-value pairs. The dict itself is independent — but the VALUES are shared references. Modifying a nested dict/list in the copy also modifies the original.' },

  category:    'Dict method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Return a shallow copy of the dict. New container, same nested references — the classic shallow-vs-deep-copy trap.',

  cheat: {
    commonCall: 'backup = state.copy()',
    returns:    'a new dict — top-level key/value pairs are independent',
    replaces:   '`dict(d)` and `{**d}` — all three are equivalent shallow copies',
    watchOut:   'shallow only — nested lists/dicts remain shared references',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key: value pairs', input: 'kv' },
  ],
  cases: [
    { id: 'basic',   label: 'basic',           values: { dict: 'a: 1, b: 2, c: 3' } },
    { id: 'strings', label: 'string values',   values: { dict: 'name: alice, role: admin' } },
    { id: 'one',     label: 'single pair',     values: { dict: 'only: 42' } },
    { id: 'empty',   label: 'empty dict',      values: { dict: '' } },
    { id: 'ordered', label: 'insertion order', values: { dict: 'z: 1, a: 2, m: 3' } },
  ],
  demoExplainer: 'The demo shows the copied dict — for the simple values passed here (strings and numbers), the copy is effectively independent because those values are immutable. The interesting behavior lives in nested MUTABLE values (lists, dicts, sets) — mutating them in the copy also mutates the original. See pitfalls.',

  patterns: [
    {
      name: 'Snapshot before mutating',
      desc: 'Keep the original for comparison or rollback.',
      code: 'before = state.copy()\nstate.update(overrides)\nchanged = {k: state[k] for k in state if state[k] != before.get(k)}',
    },
    {
      name: 'Independent per-caller copies',
      desc: 'Give each recipient its own dict so they can mutate freely.',
      code: 'defaults = {"timeout": 30, "retries": 3}\ndef make_config():\n    return defaults.copy()',
    },
    {
      name: 'Deep copy for nested mutables',
      desc: 'When the values themselves need to be independent, use copy.deepcopy.',
      code: 'from copy import deepcopy\nindependent = deepcopy(state)',
    },
  ],

  examples: [
    { title: 'Basic',             code: 'd = {"a": 1}\ne = d.copy()\ne["b"] = 2\nd',    returns: '{"a": 1}  # original untouched' },
    { title: 'Empty',             code: '{}.copy()',                                     returns: '{}' },
    { title: 'Equivalent forms',  code: 'd.copy() == dict(d) == {**d}',                  returns: 'True  # all three are shallow copies' },
    { title: 'Shared nested',     code: 'd = {"n": [1, 2]}\ne = d.copy()\ne["n"].append(3)\nd["n"]', returns: '[1, 2, 3]  # nested list is shared!' },
    { title: 'Independent top level', code: 'd = {"a": 1}\ne = d.copy()\ne["a"] = 99\nd["a"]', returns: '1  # top-level key rebound only in the copy' },
  ],

  pitfalls: [
    {
      name: 'Shallow only — nested mutables are SHARED',
      desc: 'The most-copied confusion around copy(). A nested list or dict lives at one memory address; both the original and the copy point to it. Mutating that nested object shows up on both sides.',
      wrong: { label: 'Nested change leaks', code: 'orig = {"tags": ["a", "b"]}\nbackup = orig.copy()\nbackup["tags"].append("c")\norig["tags"]', output: '["a", "b", "c"]  # original also has "c"' },
      fix:   { label: 'Use deepcopy',        code: 'from copy import deepcopy\nbackup = deepcopy(orig)\nbackup["tags"].append("c")\norig["tags"]', output: '["a", "b"]  # original safe' },
    },
    {
      name: 'copy() vs the `=` assignment',
      desc: 'Assignment does NOT copy — it makes another name for the same dict. Mutating either name mutates the same object. A common bug when passing dicts between functions.',
      wrong: { label: 'Alias, not copy', code: 'd = {"a": 1}\ne = d\ne["b"] = 2\nd', output: '{"a": 1, "b": 2}  # d changed too' },
      fix:   { label: 'Explicit copy',   code: 'd = {"a": 1}\ne = d.copy()\ne["b"] = 2\nd', output: '{"a": 1}  # d untouched' },
    },
    {
      name: 'Three ways to shallow-copy — pick one for consistency',
      desc: '`d.copy()`, `dict(d)`, and `{**d}` all produce shallow copies. They differ in the reader&apos;s intent and in some subclass edge cases: dict(d) always returns a plain dict; d.copy() and {**d} may preserve subclass type in most cases.',
      wrong: { label: 'Random mix', code: 'a = d.copy()\nb = dict(d)\nc = {**d}\n# same result, three styles', output: 'inconsistent house style' },
      fix:   { label: 'Pick one',   code: 'copy_of_d = d.copy()   # or {**d}, whichever your style guide picks', output: 'consistent' },
    },
    {
      name: 'Shared references also affect view objects',
      desc: 'A shallow copy shares the values but has its own view objects. Iterating the ORIGINAL&apos;s items sees updates the copy makes to nested mutables — not because the views are shared, but because the values are.',
      wrong: { label: 'Not the views', code: 'd = {"n": []}\ne = d.copy()\ne["n"].append(1)\nlist(d.values())', output: '[[1]]  # d&apos;s value list saw the change' },
      fix:   { label: 'Deep for independence', code: 'e = deepcopy(d)', output: 'no leakage' },
    },
  ],

  when: {
    use: [
      'Snapshotting a dict before mutating for rollback or diff',
      'Giving each caller its own dict to mutate freely',
      'Any &quot;same shape, different object&quot; workflow with immutable values',
      'Composing with update() to layer overrides without touching the source',
    ],
    avoid: [
      'Nested mutable values need to be independent → copy.deepcopy',
      'Rebinding is enough — you never mutate → `=` assignment is cheaper',
      'Duplicating for read-only iteration only → no copy needed at all',
      'Large dicts where the shallow copy is a hot-path allocation',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass over the key-value pairs',
    return:     'A new dict of the same type; values are the same object references',
    cpython:    'Objects/dictobject.c :: dict_copy',
    memory:     'Allocates a new dict; values are not deep-copied',
    threadSafe: 'The copy operation is safe against concurrent reads; not safe under concurrent writes',
  },

  related: [
    { name: 'dict.update',     slug: 'dict-update', when: 'Layer overrides onto a copy without touching the original' },
    { name: 'dict.items',      slug: 'dict-items',  when: 'Snapshot the pairs directly for iteration' },
    { name: 'list.copy',       slug: 'list-copy',   when: 'Same shallow-copy pattern for lists' },
    { name: 'setdefault',      slug: 'setdefault',  when: 'Compose with a copy for &quot;read-or-store&quot; on the duplicate' },
  ],

  faq: [
    {
      q: 'What is the difference between copy() and deepcopy()?',
      a: 'copy() duplicates the dict itself but keeps the same VALUE references. Nested lists / dicts / sets are shared. deepcopy() (from the copy module) recursively duplicates every level — the copy is fully independent, at the cost of more time and memory.',
    },
    {
      q: 'Is d.copy() the same as dict(d)?',
      a: 'Effectively yes for a plain dict — both are shallow copies. dict(d) always returns a plain dict; d.copy() and {**d} may preserve the subclass. Pick one style and stay consistent.',
    },
    {
      q: 'Is dict.copy() thread-safe?',
      a: 'The copy operation itself is safe against concurrent reads. Under concurrent writes, no guarantee — like most Python container operations. If threads share a dict, protect it with a lock.',
    },
  ],

  history: [
    { version: '1.0', note: 'copy() has been part of dict since Python 1.0.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.copy',
    meta:  'dict.copy',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};