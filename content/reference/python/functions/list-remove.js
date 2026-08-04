// content/reference/python/functions/list-remove.js
//
// Slug is type-prefixed: `remove` exists on list, set, and (differently) file.

export const meta = {
  slug:        'list-remove',
  name:        'list.remove',
  signature:   'list.remove(value)',
  blurb:       'Remove the first occurrence of a value — raises if not found.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'remove delete first occurrence value list mutate valueerror missing',
};

export const method = {
  slug:      'list-remove',
  name:      'list.remove',
  signature: 'list.remove(value)',
  returns:   { type: 'None', desc: 'Returns None — the useful effect is mutation. The demo shows the list state after removal.' },

  category:    'List method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Delete the first item equal to value. Mutates in place; raises ValueError if no match.',

  cheat: {
    commonCall: 'colors.remove("red")',
    returns:    'None — the list itself changes',
    replaces:   'a manual index-find + del pattern',
    watchOut:   'ValueError if the value is not there; only the FIRST match is removed',
  },

  parameters: [
    { name: 'value', type: 'Any', required: true, default: null, desc: 'Item to remove. First occurrence — by equality (==), not identity — is deleted. If not present, ValueError.' },
  ],

  demoParams: [
    { name: 'list',  type: 'list', hint: 'comma-separated items', input: 'csv' },
    { name: 'value', type: 'Any',  hint: 'value to remove',       input: 'text' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',        values: { list: 'a,b,c',     value: 'b' } },
    { id: 'first',    label: 'first only',   values: { list: 'a,b,a,b',   value: 'a' } },
    { id: 'missing',  label: 'not there',    values: { list: 'a,b,c',     value: 'z' } },
    { id: 'empty',    label: 'empty list',   values: { list: '',          value: 'x' } },
    { id: 'numbers',  label: 'numbers',      values: { list: '1,2,3,2,1', value: '2' } },
  ],
  demoExplainer: 'The demo shows the LIST STATE after removal. Python actually returns None; the meaningful effect is mutation. Only the FIRST equal item is removed — later duplicates stay. A missing value raises ValueError, exactly what Python does.',

  patterns: [
    {
      name: 'Guarded remove',
      desc: 'Check membership first to avoid the ValueError.',
      code: 'if item in items:\n    items.remove(item)',
    },
    {
      name: 'Try / except for &quot;maybe present&quot;',
      desc: 'When absence is expected and cheap to swallow.',
      code: 'try:\n    items.remove(item)\nexcept ValueError:\n    pass',
    },
    {
      name: 'Remove all occurrences',
      desc: 'One remove call kills one item. To wipe them all, filter instead.',
      code: 'items = [x for x in items if x != target]',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'xs = ["a","b","c"]\nxs.remove("b")\nxs',       returns: '["a", "c"]' },
    { title: 'First only',         code: 'xs = ["a","b","a","b"]\nxs.remove("a")\nxs',   returns: '["b", "a", "b"]' },
    { title: 'Missing raises',     code: 'xs = ["a","b"]\nxs.remove("z")',                returns: 'ValueError: list.remove(x): x not in list' },
    { title: 'Empty raises too',   code: '[].remove("x")',                                returns: 'ValueError: list.remove(x): x not in list' },
  ],

  pitfalls: [
    {
      name: 'Only removes the first match',
      desc: 'A single call kills exactly one item. Callers who expect &quot;wipe all&quot; get surprised.',
      wrong: { label: 'Leaves duplicates', code: 'xs = [1, 2, 1, 3, 1]\nxs.remove(1)\nxs', output: '[2, 1, 3, 1]' },
      fix:   { label: 'Filter for all',    code: 'xs = [x for x in xs if x != 1]',        output: '[2, 3]' },
    },
    {
      name: 'ValueError on missing value',
      desc: 'remove is strict — absence is an error, not a no-op. If missing is expected, guard or catch.',
      wrong: { label: 'Blow-up', code: 'xs = ["a", "b"]\nxs.remove("z")', output: 'ValueError: list.remove(x): x not in list' },
      fix:   { label: 'Guarded', code: 'if "z" in xs:\n    xs.remove("z")', output: 'no error, no change' },
    },
    {
      name: 'Removing while iterating',
      desc: 'Mutating the list you are looping over shifts remaining items and skips one — a classic silent-bug.',
      wrong: { label: 'Skips items', code: 'xs = [1, 2, 2, 3]\nfor x in xs:\n    if x == 2:\n        xs.remove(x)\nxs', output: '[1, 2, 3]  # second 2 skipped' },
      fix:   { label: 'Iterate a copy or filter', code: 'xs = [x for x in xs if x != 2]', output: '[1, 3]' },
    },
  ],

  when: {
    use: [
      'Deleting a known-present single item',
      'Small lists where equality-scan is cheap',
      'When you already know the value, not the index',
    ],
    avoid: [
      'Removing by index → del xs[i] or list.pop(i)',
      'Removing all occurrences → list comprehension filter',
      'Large lists or hot loops — remove is O(n) per call',
      'Mutating while iterating the same list',
    ],
  },

  notes: {
    complexity: 'O(n) — scans until first match, then shifts trailing items down',
    return:     'None; the list is mutated in place',
    cpython:    'Objects/listobject.c :: list_remove',
    memory:     'In-place; no new list allocated',
    threadSafe: 'Not safe under concurrent mutation of the same list',
  },

  related: [
    { name: 'list.pop',   slug: 'list-pop',   when: 'Remove by index — and get the item back' },
    { name: 'list.index', slug: 'list-index', when: 'Find the position without removing' },
    { name: 'list.count', slug: 'list-count', when: 'Count how many are there before deciding' },
  ],

  faq: [
    {
      q: 'Why does remove raise instead of silently skipping?',
      a: 'Python favours explicit failure over silent success. If you truly do not care, wrap in try/except or check `in` first.',
    },
    {
      q: 'How do I remove all occurrences at once?',
      a: 'A list comprehension keeps only what you want — one pass, no repeated shifts.',
      code: 'xs = [x for x in xs if x != target]',
    },
    {
      q: 'Why is remove slow for big lists?',
      a: 'It scans linearly to find the match, then shifts every trailing item down by one. Both steps are O(n). For big lists with heavy remove use, consider a set or a deque.',
    },
  ],

  history: [
    { version: '1.0', note: 'list.remove has been part of the list type since the earliest days of Python.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.remove',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the list before and after' },
  ],
};