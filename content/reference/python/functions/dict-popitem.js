// content/reference/python/functions/dict-popitem.js
//
// Slug is type-prefixed to sit alongside dict-pop and the other dict methods.

export const meta = {
  slug:        'dict-popitem',
  name:        'dict.popitem',
  signature:   'dict.popitem()',
  blurb:       'Remove and return the LAST inserted (key, value) pair — LIFO since 3.7.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'popitem pop last item remove pair lifo stack drain dict keyerror empty',
};

export const method = {
  slug:      'dict-popitem',
  name:      'dict.popitem',
  signature: 'dict.popitem()',
  returns:   { type: 'tuple', desc: 'A (key, value) tuple, removed from the dict. Raises KeyError if the dict is empty.' },

  category:    'Dict method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Since 3.7 it is strictly last-in-first-out, which turned an old "arbitrary item" method into a usable stack pop.',

  cheat: {
    commonCall: 'key, value = d.popitem()',
    returns:    'tuple — the most recently inserted pair',
    replaces:   'next(reversed(d)) followed by del',
    watchOut:   'KeyError on an empty dict — there is no default argument to soften it',
  },

  parameters: [],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key:value pairs, comma separated', input: 'kv' },
  ],
  cases: [
    { id: 'two',    label: 'two pairs',     values: { dict: 'a:1,b:2' } },
    { id: 'three',  label: 'three pairs',   values: { dict: 'x:one,y:two,z:three' } },
    { id: 'single', label: 'single pair',   values: { dict: 'only:1' } },
    { id: 'empty',  label: 'empty raises',  values: { dict: '' } },
  ],
  demoExplainer: 'popitem takes the pair that was inserted most recently and removes it, returning it as a (key, value) tuple. With {"a": 1, "b": 2} that is ("b", 2). Because dicts have kept insertion order since 3.7, this is genuinely LIFO and repeated calls walk backwards through the dict. On an empty dict it raises KeyError, and unlike dict.pop there is no default argument to return instead.',

  patterns: [
    {
      name: 'Drain a dict completely',
      desc: 'Each call removes one pair, so the loop ends when the dict is empty.',
      code: 'while d:\n    key, value = d.popitem()\n    handle(key, value)',
    },
    {
      name: 'Use a dict as an ordered stack',
      desc: 'Insertion order plus LIFO removal gives stack behaviour with key lookup.',
      code: 'pending[task_id] = payload\n...\ntask_id, payload = pending.popitem()',
    },
    {
      name: 'Take the most recent entry',
      desc: 'Reads clearly when the newest item is the one you want.',
      code: 'latest_key, latest_value = cache.popitem()',
    },
  ],

  examples: [
    { title: 'Last pair',        code: "{'a': 1, 'b': 2}.popitem()", returns: "('b', 2)" },
    { title: 'Single pair',      code: "{'only': 1}.popitem()",      returns: "('only', 1)" },
    { title: 'Empty raises',     code: '{}.popitem()',               returns: "KeyError: 'popitem(): dictionary is empty'" },
    { title: 'It mutates',       code: "d = {'a': 1, 'b': 2}\nd.popitem()\nd", returns: "{'a': 1}" },
    { title: 'Walks backwards',  code: "d = {'a': 1, 'b': 2}\nd.popitem(), d.popitem()", returns: "(('b', 2), ('a', 1))" },
    { title: 'Unpacks directly', code: "k, v = {'a': 1}.popitem()\nk", returns: "'a'" },
  ],

  pitfalls: [
    {
      name: 'KeyError on an empty dict, with no default',
      desc: 'dict.pop lets you pass a fallback; popitem does not. Draining a dict without checking it is non-empty is the usual way this bites.',
      wrong: { label: 'Unguarded', code: 'd = {}\nd.popitem()', output: "KeyError: 'popitem(): dictionary is empty'" },
      fix:   { label: 'Guard the loop', code: 'while d:\n    k, v = d.popitem()', output: 'stops cleanly' },
    },
    {
      name: 'LIFO order is only guaranteed from 3.7',
      desc: 'Before 3.7 the docs described the item as arbitrary, and it genuinely varied. Code that relies on getting the newest pair is correct on modern Python and silently wrong on old interpreters.',
      wrong: { label: 'Pre-3.7 assumption', code: 'd.popitem()   # "the last one"', output: 'arbitrary pair on 3.6 and earlier' },
      fix:   { label: 'Be explicit',        code: 'k = next(reversed(d))\nv = d.pop(k)', output: 'newest pair, stated plainly' },
    },
    {
      name: 'Confused with dict.pop',
      desc: 'pop takes a key and returns the VALUE; popitem takes nothing and returns a PAIR. Swapping them produces a TypeError or a tuple where a value was expected.',
      wrong: { label: 'Wrong shape', code: "value = {'a': 1}.popitem()", output: "('a', 1)  # a tuple, not 1" },
      fix:   { label: 'Unpack it',   code: "key, value = {'a': 1}.popitem()", output: 'value is 1' },
    },
    {
      name: 'Calling it while iterating',
      desc: 'Removing entries during a for loop over the dict raises RuntimeError, because the dict changed size mid-iteration. Drain with a while loop instead.',
      wrong: { label: 'Mutating mid-loop', code: 'for k in d:\n    d.popitem()', output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'while instead',     code: 'while d:\n    d.popitem()', output: 'drains safely' },
    },
  ],

  when: {
    use: [
      'Draining a dict pair by pair',
      'Treating a dict as a LIFO stack that also supports key lookup',
      'Taking the most recently added entry',
    ],
    avoid: [
      'Removing a SPECIFIC key → dict.pop(key)',
      'Reading without removing → the newest key via next(reversed(d))',
      'Supporting Python 3.6 or older where the order is arbitrary',
    ],
  },

  notes: {
    complexity: 'O(1) amortised — removes from the end of the insertion order',
    return:     'A new two-item tuple; the pair is gone from the dict afterwards',
    cpython:    'Objects/dictobject.c :: dict_popitem_impl',
    memory:     'Allocates one small tuple; may shrink the dict internally',
    threadSafe: 'Not safe under concurrent mutation of the same dict',
  },

  related: [
    { name: 'dict.pop',    slug: 'dict-pop',    when: 'Remove a specific key and get its value' },
    { name: 'dict.clear',  slug: 'dict-clear',  when: 'Remove everything at once instead of pair by pair' },
    { name: 'dict.items',  slug: 'dict-items',  when: 'Read the pairs without removing any' },
    { name: 'list.pop',    slug: 'list-pop',    when: 'The same LIFO idea on a list' },
  ],

  faq: [
    {
      q: 'Which item does popitem actually return?',
      a: 'Since Python 3.7 it is always the most recently inserted pair, because dicts preserve insertion order. Before 3.7 the language only promised "an arbitrary item", and in practice it was the first in internal hash order.',
      code: "d = {'a': 1, 'b': 2}\nd.popitem()   # ('b', 2)",
    },
    {
      q: 'Why is there no default argument like dict.pop has?',
      a: 'pop needs a default because a key you name may legitimately be absent. popitem takes no key — the only failure is an empty dict, which is easy to test for with a plain "if d" or "while d".',
      code: 'while d:\n    k, v = d.popitem()',
    },
    {
      q: 'Does updating an existing key move it to the end?',
      a: 'No. Assigning to a key that already exists updates the value but keeps its original position, so popitem will not return it any sooner. Delete the key and reinsert it if you need it moved to the end.',
      code: "d = {'a': 1, 'b': 2}\nd['a'] = 99\nd.popitem()   # still ('b', 2)",
    },
  ],

  history: [
    { version: '1.0', note: 'popitem present since early Python, documented as returning an arbitrary pair.' },
    { version: '3.7', note: 'Insertion order became a language guarantee, making popitem reliably LIFO.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.popitem',
    meta:  'dict.popitem',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data before and after' },
  ],
};
