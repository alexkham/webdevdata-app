// content/reference/python/functions/append.js

export const meta = {
  slug:        'append',
  name:        'list.append',
  signature:   'list.append(item)',
  blurb:       'Add one item to the end of the list, in place.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'append add push end list insert item',
};

export const method = {
  slug:      'append',
  name:      'list.append',
  signature: 'list.append(item)',
  returns:   { type: 'None', desc: 'None — always. The list grows in place; there is nothing useful to return.' },

  category:    'List method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Add one item to the end — in place, returning None. The most-used list method, and the most-misassigned one.',

  cheat: {
    commonCall: 'items.append(x)',
    returns:    'None — the list itself grows',
    replaces:   'appends ONE item; a list argument becomes a nested list',
    watchOut:   'x = lst.append(v) sets x to None — the classic bug',
  },

  parameters: [
    { name: 'item', type: 'Any', required: true, default: null, desc: 'The object to add. Added as ONE element — even if it is itself a list.' },
  ],

  demoParams: [
    { name: 'list', type: 'list', hint: 'comma-separated items', input: 'csv' },
    { name: 'item', type: 'Any',  hint: 'item to add',           input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',    values: { list: 'a,b,c', item: 'd' } },
    { id: 'empty',   label: 'empty list', values: { list: '',      item: 'first' } },
  ],
  demoExplainer: 'The output is None — really. That IS the lesson: append mutates the list in place (after ["a","b","c"].append("d") the list is ["a","b","c","d"]) and returns nothing. Assigning the result to a variable is the #1 append bug — see Pitfalls.',

  patterns: [
    {
      name: 'Build a list in a loop',
      desc: 'The bread-and-butter accumulation pattern.',
      code: 'results = []\nfor item in source:\n    results.append(transform(item))',
    },
    {
      name: 'Know when a comprehension is better',
      desc: 'Pure transform-and-collect loops read better as comprehensions.',
      code: 'results = [transform(x) for x in source]',
    },
    {
      name: 'Stack push',
      desc: 'append + pop() from the end = LIFO stack, both O(1).',
      code: 'stack.append(job)\njob = stack.pop()',
    },
  ],

  examples: [
    { title: 'Append one item',            code: 'lst = [1, 2]\nlst.append(3)\nlst',   returns: '[1, 2, 3]' },
    { title: 'Appending a list nests it',  code: 'lst = [1, 2]\nlst.append([3, 4])\nlst', returns: '[1, 2, [3, 4]]' },
    { title: 'The return value is None',   code: 'result = [1].append(2)\nprint(result)', returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Assigning the result loses the list',
      desc: 'append returns None by design — never assign it.',
      wrong: { label: 'Wrong', code: 'lst = lst.append(x)', output: 'lst is None' },
      fix:   { label: 'Fix', code: 'lst.append(x)  # no assignment', output: 'list grew in place' },
    },
    {
      name: 'append vs extend',
      desc: 'append adds its argument as ONE element; extend splices an iterable in.',
      wrong: { label: 'Nested', code: 'lst = [1, 2]\nlst.append([3, 4])', output: '[1, 2, [3, 4]]' },
      fix:   { label: 'Flat', code: 'lst = [1, 2]\nlst.extend([3, 4])', output: '[1, 2, 3, 4]' },
    },
    {
      name: 'Appending to a shared default argument',
      desc: 'The infamous mutable-default trap: one list shared across calls.',
      wrong: { label: 'Shared state', code: 'def add(x, items=[]):\n    items.append(x)\n    return items', output: 'grows across unrelated calls' },
      fix:   { label: 'Fix', code: 'def add(x, items=None):\n    items = items if items is not None else []\n    items.append(x)\n    return items', output: 'fresh list per call' },
    },
  ],

  when: {
    use: [
      'Accumulating results one at a time',
      'Stack push (with pop for the pop side)',
      'Appending in loops with logic a comprehension cannot express',
    ],
    avoid: [
      'Adding all items of an iterable → list.extend',
      'Pure transform loops → list comprehension',
      'Inserting elsewhere than the end → list.insert (O(n))',
      'Fast appends AND pops at both ends → collections.deque',
    ],
  },

  notes: {
    complexity: 'Amortized O(1) — the array over-allocates as it grows',
    return:     'None; the list mutates',
    cpython:    'Objects/listobject.c :: list_append',
    memory:     'Occasional reallocation with growth factor ~1.125',
    threadSafe: 'append itself is atomic in CPython, but do not rely on it for logic',
  },

  related: [
    { name: 'list.pop',   slug: 'list-pop',   when: 'The reverse — remove from the end' },
    { name: 'list.index', slug: 'list-index', when: 'Find what you appended' },
    { name: 'list.copy',  slug: 'list-copy',  when: 'Copy before mutating' },
  ],

  faq: [
    {
      q: 'Why does append return None instead of the list?',
      a: 'Python convention: methods that mutate in place return None, so you cannot mistake them for ones returning new objects. It rules out fluent chaining on purpose.',
    },
    {
      q: 'How do I add several items at once?',
      a: 'extend, or += which is equivalent for lists.',
      code: 'lst.extend([3, 4])\nlst += [5, 6]',
    },
    {
      q: 'Is append thread-safe?',
      a: 'The single operation is atomic in CPython thanks to the GIL, but any check-then-append sequence is not — use a lock or a queue.Queue for producer/consumer work.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core list method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.append',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
