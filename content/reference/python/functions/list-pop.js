// content/reference/python/functions/list-pop.js
//
// Slug is type-prefixed: `pop` exists on list, dict and set.

export const meta = {
  slug:        'list-pop',
  name:        'list.pop',
  signature:   'list.pop(index=-1)',
  blurb:       'Remove and return an item — the last one by default.',
  category:    'list',
  type:        'list',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'pop remove last item stack lifo delete return',
};

export const method = {
  slug:      'list-pop',
  name:      'list.pop',
  signature: 'list.pop(index=-1)',
  returns:   { type: 'Any', desc: 'The removed item. The list itself shrinks by one — pop both mutates and returns.' },

  category:    'List method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Remove and return an item by index — the last one by default. Mutates the list in place.',

  cheat: {
    commonCall: 'stack.pop()',
    returns:    'the removed item; the list shrinks',
    replaces:   'negative indexes count from the end (-1 = last)',
    watchOut:   'IndexError on an empty list or out-of-range index',
  },

  parameters: [
    { name: 'index', type: 'int', required: false, default: '-1', desc: 'Position of the item to remove. Negative counts from the end. Out of range raises IndexError.' },
  ],

  demoParams: [
    { name: 'list',  type: 'list', hint: 'comma-separated items', input: 'csv' },
    { name: 'index', type: 'int',  hint: '-1 = last',             input: 'number' },
  ],
  cases: [
    { id: 'default', label: 'default',    values: { list: 'a,b,c', index: -1 } },
    { id: 'first',   label: 'index=0',    values: { list: 'a,b,c', index: 0 } },
    { id: 'range',   label: 'out of range', values: { list: 'a,b,c', index: 5 } },
    { id: 'empty',   label: 'empty list', values: { list: '',      index: -1 } },
  ],
  demoExplainer: 'The demo shows the RETURN value — the removed item. In real code the list also shrinks: after ["a","b","c"].pop() the list is ["a","b"]. Errors shown are exactly what Python raises.',

  patterns: [
    {
      name: 'Stack (LIFO)',
      desc: 'append + pop from the end is the idiomatic Python stack — both O(1).',
      code: 'stack.append(job)\njob = stack.pop()',
    },
    {
      name: 'Consume a list backwards',
      desc: 'Popping from the end avoids the O(n) shifting of pop(0).',
      code: 'while items:\n    process(items.pop())',
    },
    {
      name: 'Safe pop with a default',
      desc: 'list.pop has no default argument — guard the empty case yourself.',
      code: 'item = items.pop() if items else None',
    },
  ],

  examples: [
    { title: 'Pop the last item',       code: '["a", "b", "c"].pop()',  returns: "'c'" },
    { title: 'Pop by index',            code: '["a", "b", "c"].pop(0)', returns: "'a'" },
    { title: 'Negative index',          code: '[1, 2, 3].pop(-2)',      returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Popping from an empty list raises',
      desc: 'Unlike dict.get there is no default — check first.',
      wrong: { label: 'Raises', code: '[].pop()', output: 'IndexError: pop from empty list' },
      fix:   { label: 'Guard', code: 'item = lst.pop() if lst else None', output: 'None (guarded)' },
    },
    {
      name: 'pop(0) is O(n)',
      desc: 'Every remaining element shifts left. Queues want collections.deque.',
      wrong: { label: 'Slow queue', code: 'first = lst.pop(0)', output: 'O(n) shift on every call' },
      fix:   { label: 'Fix', code: 'from collections import deque\nq = deque(lst)\nfirst = q.popleft()', output: 'O(1)' },
    },
    {
      name: 'pop both mutates and returns',
      desc: 'Calling it just for the value still shrinks the list.',
      wrong: { label: 'Item lost', code: 'last = lst.pop()\n# lst no longer contains last', output: 'list is shorter now' },
      fix:   { label: 'Peek without removing', code: 'last = lst[-1]', output: 'list unchanged' },
    },
  ],

  when: {
    use: [
      'Stack behavior — take back what you last appended',
      'Destructively consuming items one by one',
      'Remove by position AND need the removed value',
    ],
    avoid: [
      'Front-of-list queue → collections.deque.popleft',
      'Remove by value, not position → list.remove',
      'Just reading the last item → lst[-1]',
    ],
  },

  notes: {
    complexity: 'O(1) for the end; O(n) elsewhere (elements shift)',
    return:     'the removed item; the list mutates',
    cpython:    'Objects/listobject.c :: list_pop_impl',
    memory:     'May shrink the internal array when usage drops',
    threadSafe: 'No — mutating shared lists needs a lock',
  },

  related: [
    { name: 'list.count', slug: 'list-count', when: 'Count without removing' },
    { name: 'dict.get',   slug: 'get',        when: 'Read a dict value with a default' },
    { name: 'sorted',     slug: 'sorted',     when: 'Order items without mutating' },
  ],

  faq: [
    {
      q: 'What is the difference between pop, remove and del?',
      a: 'pop takes an index and returns the item; remove takes a value and returns None; del removes by index or slice and returns nothing.',
      code: 'lst.pop(0)      # by index, returns item\nlst.remove("a") # by value\ndel lst[0]      # by index, no return',
    },
    {
      q: 'Is there a pop with a default, like dict.pop?',
      a: 'No — list.pop always raises on a bad index. Guard with a truthiness or length check.',
    },
    {
      q: 'Why is pop() fast but pop(0) slow?',
      a: 'Lists are arrays. Removing the last element just decrements the length; removing the first shifts every remaining element one slot left.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core list method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    meta:  'list.pop',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect list data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
