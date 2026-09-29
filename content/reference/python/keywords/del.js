// content/reference/python/keywords/del.js

export const meta = {
  slug:        'del',
  name:        'del',
  signature:   'del target',
  blurb:       'Unbind a name, or remove an item, slice or attribute from its container.',
  category:    'definitions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'del delete del statement delete variable delete list item del slice delete dict key delete attribute remove element unbind name nameerror keyword',
};

export const method = {
  slug:      'del',
  name:      'del',
  signature: 'del target',

  category:    'Definitions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'del removes a binding — a name from a namespace, an item or slice from a list or dict, an attribute from an object. It never destroys an object other references still point to.',

  covers: ['del'],

  syntax: [
    { label: 'name', code: 'del x' },
    { label: 'item / key', code: "del nums[0]\ndel d['key']" },
    { label: 'slice', code: 'del nums[1:3]\ndel nums[::2]' },
    { label: 'attribute', code: 'del obj.attr' },
    { label: 'several', code: 'del a, b[0], c.x' },
  ],

  cheat: {
    useFor:    'del d[key] / del items[i] / del items[a:b] / del obj.attr',
    result:    'a statement — no value; the name or item is gone afterwards',
    pairsWith: 'list.pop(), dict.pop(), list.remove(), delattr()',
    watchOut:  'del x unbinds a name, it does not free the object; deleting by index while looping skips items',
  },

  parameters: [
    { name: 'target', type: 'name / subscription / attribute', required: true, default: null, desc: 'Same forms as the left side of an assignment. A comma-separated list deletes each target left to right.' },
  ],

  modes: [
    {
      id: 'item',
      label: 'del list[i]',
      blurb: 'Remove one item by position. Negative indexes count from the end; a missing position raises.',
      params: [{ name: 'i', type: 'int', hint: '-4 … 3 are valid', input: 'number' }],
      template: 'nums = [10, 20, 30, 40]\ndel nums[{$i}]\nnums',
      cases: [
        { id: 'first', label: 'i = 0',  values: { i: '0' } },
        { id: 'last',  label: 'i = -1', values: { i: '-1' } },
        { id: 'out',   label: 'i = 4',  values: { i: '4' } },
      ],
    },
    {
      id: 'slice',
      label: 'del list[a:b]',
      blurb: 'Remove a range. Slices never raise for out-of-range bounds — they are clamped to the list.',
      params: [
        { name: 'start', type: 'int', hint: 'start', input: 'number' },
        { name: 'stop',  type: 'int', hint: 'stop',  input: 'number' },
      ],
      template: 'nums = [0, 1, 2, 3, 4, 5]\ndel nums[{$start}:{$stop}]\nnums',
      cases: [
        { id: 'mid',  label: '1:3',   values: { start: '1',  stop: '3' } },
        { id: 'tail', label: '-2:99', values: { start: '-2', stop: '99' } },
        { id: 'none', label: '4:2',   values: { start: '4',  stop: '2' } },
      ],
    },
    {
      id: 'name',
      label: 'del name',
      blurb: 'del a removes the name a — the list itself lives on, because b still refers to it.',
      params: [{ name: 'items', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: "a = {$items}\nb = a\ndel a\nb.append('still here')\n(b, 'a' in globals())",
      cases: [
        { id: 'list',  label: 'a list',     values: { items: '1, 2, 3' } },
        { id: 'empty', label: 'empty list', values: { items: '' } },
      ],
    },
  ],
  demoExplainer: 'Compare the first two tabs: del nums[4] raises IndexError: list assignment index out of range (deletion reports as an assignment), while the slice 4:2 or -2:99 never raises — out-of-range slice bounds are clamped, and an empty range deletes nothing. A float bound (type 1e21 or more) is a TypeError in both. In the del name tab, the object is untouched; only the name a is gone from the namespace.',

  patterns: [
    {
      name: 'Drop a dict key if present',
      desc: 'del raises KeyError for a missing key; pop with a default does not.',
      code: "if 'password' in user:\n    del user['password']\n# or: user.pop('password', None)",
    },
    {
      name: 'Truncate a list in place',
      desc: 'Keeps the same list object, so other references see the change.',
      code: 'del history[100:]',
    },
    {
      name: 'Clear a list in place',
      desc: 'Same as items.clear().',
      code: 'del items[:]',
    },
    {
      name: 'Free a big temporary early',
      desc: 'Drops this reference; the memory is reclaimed only if nothing else refers to the object.',
      code: 'frame = load_huge_frame()\nsummary = frame.describe()\ndel frame',
    },
  ],

  examples: [
    { title: 'A deleted name is gone',       code: 'x = 10\ndel x\nx',                                   returns: "NameError: name 'x' is not defined" },
    { title: 'Delete a list item',           code: 'nums = [1, 2, 3]\ndel nums[0]\nnums',               returns: '[2, 3]' },
    { title: 'Delete a dict key',            code: "d = {'a': 1, 'b': 2}\ndel d['a']\nd",               returns: "{'b': 2}" },
    { title: 'Delete every other item',      code: 'nums = list(range(10))\ndel nums[::2]\nnums',        returns: '[1, 3, 5, 7, 9]' },
    { title: 'Delete an attribute',          code: "class User:\n    pass\nu = User()\nu.token = 'abc'\ndel u.token\nhasattr(u, 'token')", returns: 'False' },
    { title: 'Several targets at once',      code: "a = b = c = 0\ndel a, c\n[n for n in ('a', 'b', 'c') if n in globals()]", returns: "['b']" },
    { title: 'A deleted local',              code: 'def f():\n    x = 1\n    del x\n    return x\nf()',     returns: "UnboundLocalError: cannot access local variable 'x' where it is not associated with a value" },
    { title: 'Tuples and strings are immutable', code: 't = (1, 2)\ndel t[0]',                             returns: "TypeError: 'tuple' object doesn't support item deletion" },
  ],

  pitfalls: [
    {
      name: 'Deleting by index while looping over the same list',
      desc: 'Each del shifts the rest left: the next item is skipped, and range(len(...)) — fixed before the loop — runs past the new end.',
      wrong: { label: 'del inside the loop', code: 'nums = [1, 2, 3, 4]\nfor i in range(len(nums)):\n    if nums[i] % 2 == 0:\n        del nums[i]', output: 'IndexError: list index out of range' },
      fix:   { label: 'build a new list',    code: 'nums = [1, 2, 3, 4]\nnums = [n for n in nums if n % 2 != 0]\nnums', output: '[1, 3]' },
    },
    {
      name: 'Expecting del to destroy the object',
      desc: 'del removes one name. Every other reference still sees the object; to empty it for everyone, mutate it.',
      wrong: { label: 'del the name', code: "data = [1, 2, 3]\ncache = {'data': data}\ndel data\ncache['data']", output: '[1, 2, 3]' },
      fix:   { label: 'clear the object', code: "data = [1, 2, 3]\ncache = {'data': data}\ndata.clear()\ncache['data']", output: '[]' },
    },
    {
      name: 'del by position when you meant by value',
      desc: 'del nums[2] removes whatever is at index 2. To remove the value 2, use remove().',
      wrong: { label: 'index 2', code: 'nums = [5, 2, 9]\ndel nums[2]\nnums', output: '[5, 2]' },
      fix:   { label: 'value 2', code: 'nums = [5, 2, 9]\nnums.remove(2)\nnums', output: '[5, 9]' },
    },
  ],

  when: {
    use: [
      'Removing a dict key or list item when you do not need the removed value',
      'Removing a range of a list in place (del items[a:b])',
      'Dropping a large temporary so its memory can be reclaimed sooner',
    ],
    avoid: [
      'You need the removed value → list.pop(i) / dict.pop(key)',
      'Removing by value → list.remove(x)',
      'Filtering many items → a comprehension builds the result in one pass',
      'Attribute name held in a string → delattr(obj, name)',
    ],
  },

  notes: {
    cpython:     'del x decrements the object’s reference count; CPython frees the object immediately only when that count reaches zero (and no reference cycle keeps it alive)',
    'Scope':     'del name inside a function makes name local to the whole function, just like an assignment — reading it afterwards is UnboundLocalError, not NameError',
    'Protocols': 'del obj[k] calls type(obj).__delitem__(obj, k); del obj.a calls __delattr__ (or a property deleter)',
  },

  related: [
    { name: 'global',     slug: 'global', when: 'del of a global name inside a function needs a global declaration' },
    { name: 'delattr()',  slug: 'delattr',  when: 'del obj.attr with the name in a variable', category: 'functions' },
    { name: 'list.pop()', slug: 'list-pop', when: 'Remove an item and get it back', category: 'functions' },
    { name: 'dict.pop()', slug: 'dict-pop', when: 'Remove a key without KeyError (with a default)', category: 'functions' },
    { name: 'list.remove()', slug: 'list-remove', when: 'Remove by value, not position', category: 'functions' },
    { name: 'NameError',  slug: 'nameerror', when: 'What reading a deleted name raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Does del delete the object in Python?',
      a: 'No — it deletes a reference (a name, an item slot, an attribute). The object is freed only when nothing refers to it any more. If another variable, list or dict still holds it, it stays alive.',
    },
    {
      q: 'What is the difference between del, pop() and remove() on a list?',
      a: 'del items[i] removes by position and returns nothing; items.pop(i) removes by position and returns the item; items.remove(x) removes the first item equal to x (ValueError if absent). del also handles slices: del items[2:5].',
    },
    {
      q: 'How do I delete a key from a dictionary?',
      a: "del d['key'] — raises KeyError if the key is missing. d.pop('key', None) removes it if present and never raises.",
    },
    {
      q: 'Why do I get NameError after del?',
      a: 'Because that is what del x does: the name no longer exists. Inside a function the same situation raises UnboundLocalError, since the name is still a local, just without a value.',
    },
  ],

  history: [
    { version: '3.2', note: 'Deleting a local name that a nested function uses as a free variable became legal.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-del-statement',
    meta:  'The del statement',
  },
};
