// content/reference/python/functions/set-pop.js
//
// Slug is type-prefixed: `pop` is a set method — distinct from list.pop.

export const meta = {
  slug:        'set-pop',
  name:        'set.pop',
  signature:   'set.pop()',
  blurb:       'Remove and return an arbitrary element — raises KeyError if empty.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'pop set remove arbitrary any element keyerror empty drain iterate destroy',
};

export const method = {
  slug:      'set-pop',
  name:      'set.pop',
  signature: 'set.pop()',
  returns:   { type: 'Any', desc: 'The removed element. Which element is removed is IMPLEMENTATION-DEFINED — Python does not guarantee any particular order. Empty set raises KeyError.' },

  category:    'Set method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Remove and return an arbitrary element from the set. The element choice is not defined — treat pop as random for portability.',

  cheat: {
    commonCall: 'while s: process(s.pop())',
    returns:    'the removed element — not None',
    replaces:   'the manual `next(iter(s))` + discard pattern',
    watchOut:   'element choice is UNDEFINED — do not rely on any particular order',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'set', type: 'set', hint: 'starting set (comma-separated)', input: 'csv-set' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',         values: { set: 'a,b,c' } },
    { id: 'numbers',    label: 'numbers',       values: { set: '1,2,3,4' } },
    { id: 'single',     label: 'single element',values: { set: 'only' } },
    { id: 'empty',      label: 'empty (raises)',values: { set: '' } },
    { id: 'dup-input',  label: 'dupes in input',values: { set: 'a,a,b,b,c' } },
  ],
  demoExplainer: 'pop removes and returns ONE element — but the demo shows only the REMAINING set state so you can see the mutation. In real code the returned element is what you work with. WHICH element gets popped is implementation-defined; treat it as arbitrary. Empty set raises KeyError.',

  patterns: [
    {
      name: 'Drain a set for processing',
      desc: 'Process every element exactly once without holding an iterator.',
      code: 'while pending:\n    item = pending.pop()\n    process(item)',
    },
    {
      name: 'Get and remove any element',
      desc: 'When you need one and do not care which.',
      code: 'representative = candidates.pop()   # any of them works',
    },
    {
      name: 'Guard the empty case',
      desc: 'Empty set raises KeyError.',
      code: 'item = s.pop() if s else default',
    },
  ],

  examples: [
    { title: 'Basic',              code: 's = {1, 2, 3}\ns.pop()',                returns: 'some element — say 1' },
    { title: 'State after pop',    code: 's = {1, 2, 3}\ns.pop()\ns',              returns: 'set with 2 elements — which one depends on impl' },
    { title: 'Empty raises',       code: 'set().pop()',                             returns: "KeyError: 'pop from an empty set'" },
    { title: 'Drain in a loop',    code: 's = {"a", "b", "c"}\nout = []\nwhile s: out.append(s.pop())\nout', returns: 'all three elements in some order' },
    { title: 'One element case',   code: 's = {42}\ns.pop()',                       returns: '42  # the only choice' },
  ],

  pitfalls: [
    {
      name: 'The popped element is UNDEFINED — do not rely on order',
      desc: 'Sets are unordered. Python does not guarantee which element pop returns. It may look consistent for small sets in one Python version and change in the next. Code that assumes an order will break.',
      wrong: { label: 'Assumed order', code: 's = {1, 2, 3}\nfirst = s.pop()\nassert first == 1  # NOT guaranteed', output: 'may pass today, fail tomorrow' },
      fix:   { label: 'Sort first',     code: 'first = min(s)\ns.discard(first)', output: 'deterministic' },
    },
    {
      name: 'Empty set raises KeyError',
      desc: 'Not None, not a sentinel — a KeyError with the message &quot;pop from an empty set&quot;. Guard with truthiness or catch.',
      wrong: { label: 'Blows up', code: 'while True:\n    x = s.pop()\n    ...', output: "KeyError: 'pop from an empty set' at end" },
      fix:   { label: 'Truthy guard', code: 'while s:\n    x = s.pop()\n    ...', output: 'stops cleanly' },
    },
    {
      name: 'pop() has NO index argument — unlike list.pop',
      desc: 'list.pop(0) removes the first item; list.pop() removes the last. set.pop() takes NO arguments — the concept of &quot;position&quot; does not apply to sets.',
      wrong: { label: 'Wrong shape', code: 's.pop(0)', output: 'TypeError: pop() takes no arguments (1 given)' },
      fix:   { label: 'Right shape', code: 's.pop()', output: 'some element' },
    },
    {
      name: 'set.pop is not a queue or stack',
      desc: 'Because element choice is undefined, you cannot use set.pop as FIFO or LIFO. If order matters, use a list (as a stack) or collections.deque (as a queue).',
      wrong: { label: 'Assumed LIFO',   code: 's = {"first", "second", "third"}\nassert s.pop() == "third"', output: 'may fail — order not guaranteed' },
      fix:   { label: 'Use a stack/queue', code: 'stack = ["first", "second", "third"]\nassert stack.pop() == "third"', output: 'guaranteed' },
    },
  ],

  when: {
    use: [
      'Draining a set for one-shot processing (drain-and-empty loops)',
      'Getting any single element when the choice does not matter',
      'Building a worklist algorithm on top of a set',
      'Convert set to worklist when order does not matter',
    ],
    avoid: [
      'You need a SPECIFIC element → set.remove or set.discard',
      'Order matters (FIFO / LIFO / sorted) → list, deque, or heapq',
      'You want to keep the element in the set → iterate instead',
      'You do not want an exception on empty → guard first, or use set.discard on a chosen element',
    ],
  },

  notes: {
    complexity: 'O(1) amortized — Python removes an arbitrary bucket entry',
    return:     'The removed element; set is mutated in place',
    cpython:    'Objects/setobject.c :: set_pop',
    memory:     'In-place; no allocation',
    threadSafe: 'Not safe under concurrent mutation of the same set',
  },

  related: [
    { name: 'set.remove',    slug: 'set-remove',    when: 'Remove a specific element — raises KeyError on missing' },
    { name: 'set.discard',   slug: 'set-discard',   when: 'Silent removal of a specific element' },
    { name: 'set.add',       slug: 'set-add',       when: 'The insertion mirror' },
    { name: 'list.pop',      slug: 'list-pop',      when: 'Analogous but with an index argument and defined order' },
  ],

  faq: [
    {
      q: 'Which element does set.pop remove?',
      a: 'Undefined — Python does not guarantee any particular element. In CPython it happens to be the first bucket found in the hash table, which is neither insertion nor sort order. If order matters, sort or index a list instead.',
    },
    {
      q: 'Why does set.pop raise KeyError on empty?',
      a: 'Consistency with the rest of the set removal methods. remove and discard both operate on named elements; when there is nothing to pop, there is no valid element to return, and KeyError is the family&apos;s error class.',
    },
    {
      q: 'What is the difference between set.pop and list.pop?',
      a: 'set.pop takes no arguments and removes an ARBITRARY element. list.pop takes an optional index (default -1, the last) and removes an element at a defined position. Order guarantees differ because sets are unordered.',
    },
  ],

  history: [
    { version: '2.3', note: 'set type added; pop has been the arbitrary-remove method from the start.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#frozenset.pop',
    meta:  'set.pop',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect set/list data' },
  ],
};