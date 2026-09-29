// content/reference/python/keywords/none.js

export const meta = {
  slug:        'none',
  name:        'None',
  signature:   'x is None',
  blurb:       'Python’s "no value" object: the single instance of NoneType, returned by functions that return nothing.',
  category:    'values',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'none keyword null nil nonetype is none == none not none default argument sentinel return none optional missing value falsy nonetype object is not subscriptable',
};

export const method = {
  slug:      'none',
  name:      'None',
  signature: 'x is None',

  category:    'Values',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'None means "no value here". There is exactly one None object, so you test for it with is — and you keep it apart from other falsy values like 0 and "".',

  covers: ['None'],

  syntax: [
    { label: 'test', code: 'if x is None:\n    ...\nif x is not None:\n    ...' },
    { label: 'default sentinel', code: 'def f(items=None):\n    if items is None:\n        items = []' },
    { label: 'optional hint', code: 'def find(k) -> int | None:' },
  ],

  cheat: {
    useFor:    'missing / not-yet-set values, "no result", optional arguments',
    result:    'the singleton object of type NoneType; falsy',
    pairsWith: 'is / is not, default arguments, int | None hints',
    watchOut:  'if not x is also true for 0, "", [] — use x is None when you mean None',
  },

  parameters: [
    { name: 'x',    type: 'expression', required: true, default: null, desc: 'Any object. x is None is True only for the None object itself; nothing can override it.' },
    { name: 'None', type: 'constant',   required: true, default: null, desc: 'A keyword constant: it cannot be assigned to, and there is only ever one NoneType instance.' },
  ],

  modes: [
    {
      id: 'is',
      label: 'is None vs not',
      blurb: 'Leave the box empty for None, or type a number. is None is True only for None; not x is also True for 0.',
      params: [{ name: 'value', type: 'int | None', hint: 'empty = None', input: 'number-or-none' }],
      template: 'x = {$value}\n(x is None, x == None, not x)',
      cases: [
        { id: 'none', label: 'None', values: { value: '' } },
        { id: 'zero', label: '0',    values: { value: '0' } },
        { id: 'num',  label: '7',    values: { value: '7' } },
      ],
    },
    {
      id: 'return',
      label: 'implicit return',
      blurb: 'find() returns an index only when it finds the target. Falling off the end of a function returns None.',
      params: [
        { name: 'items',  type: 'list', hint: 'comma-separated', input: 'csv' },
        { name: 'target', type: 'str',  hint: 'item to find',    input: 'text' },
      ],
      template: 'def find(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n\nfind({$items}, {$target})',
      cases: [
        { id: 'found',   label: 'found',     values: { items: 'red, green, blue', target: 'green' } },
        { id: 'missing', label: 'not found', values: { items: 'red, green, blue', target: 'pink' } },
        { id: 'first',   label: 'index 0',   values: { items: 'red, green', target: 'red' } },
      ],
    },
    {
      id: 'default',
      label: 'None default',
      blurb: 'bucket=None plus a check inside the function gives every call a fresh list.',
      params: [{ name: 'items', type: 'list', hint: 'comma-separated', input: 'csv' }],
      template: 'def add(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\n\n[add(x) for x in {$items}]',
      cases: [
        { id: 'three', label: 'three calls', values: { items: 'a, b, c' } },
        { id: 'empty', label: 'no calls',    values: { items: '' } },
      ],
    },
  ],
  demoExplainer: 'The is None tab shows the classic trap: 0 and None are both falsy, so not x cannot tell them apart, while x is None can. In implicit return, a found item at index 0 returns 0 — which is falsy too, so callers must test the result with is None, not with if result. In None default, each call gets its own list; with bucket=[] as the default, every call would share one list.',

  patterns: [
    {
      name: 'Sentinel default for a mutable argument',
      desc: 'Defaults are evaluated once; None plus a check builds a fresh object per call.',
      code: 'def append_to(item, target=None):\n    if target is None:\n        target = []\n    target.append(item)\n    return target',
    },
    {
      name: 'Optional result',
      desc: 'Return None for "not found" and annotate it; callers test with is None.',
      code: 'def find_user(uid: int) -> dict | None:\n    return users.get(uid)\n\nuser = find_user(42)\nif user is None:\n    raise LookupError(42)',
    },
    {
      name: 'When None is a valid value',
      desc: 'Use a private sentinel object to tell "not passed" apart from an explicit None.',
      code: '_MISSING = object()\n\ndef get(key, default=_MISSING):\n    if default is _MISSING:\n        ...',
    },
    {
      name: 'Fallback for None only',
      desc: 'x or default also replaces 0 and ""; a conditional expression replaces only None.',
      code: 'timeout = timeout if timeout is not None else 30',
    },
  ],

  examples: [
    { title: 'A function without return gives None', code: "result = print('hi')\nresult is None",                  returns: 'hi\nTrue' },
    { title: 'None is the only NoneType instance',   code: '(type(None), type(None)() is None)',                  returns: "(<class 'NoneType'>, True)" },
    { title: 'In-place methods return None',         code: 'nums = [3, 1, 2]\nresult = nums.sort()\n(result, nums)',  returns: '(None, [1, 2, 3])' },
    { title: 'dict.get returns None when missing',    code: "{'a': 1}.get('b') is None",                           returns: 'True' },
    { title: 'None is falsy',                        code: 'bool(None)',                                          returns: 'False' },
    { title: 'Indexing None',                        code: 'x = None\nx[0]',                                      returns: "TypeError: 'NoneType' object is not subscriptable" },
    { title: 'Calling a method on None',             code: 'name = None\nname.upper()',                           returns: "AttributeError: 'NoneType' object has no attribute 'upper'" },
    { title: 'None cannot be assigned to',           code: "compile('None = 1', '<demo>', 'exec')",               returns: 'SyntaxError: cannot assign to None' },
  ],

  pitfalls: [
    {
      name: 'if not x treats 0 and "" like None',
      desc: 'not x is True for every falsy value. When 0, "" or [] are legitimate values, test for None explicitly.',
      wrong: { label: 'truthiness test', code: "def describe(count=None):\n    if not count:\n        return 'unknown'\n    return f'{count} items'\n\ndescribe(0)", output: "'unknown'" },
      fix:   { label: 'is None',         code: "def describe(count=None):\n    if count is None:\n        return 'unknown'\n    return f'{count} items'\n\ndescribe(0)", output: "'0 items'" },
    },
    {
      name: 'A mutable default instead of None',
      desc: 'The default list is created once, when def runs, and shared by every call that omits the argument.',
      wrong: { label: 'bucket=[]',   code: "def add(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nadd('a')\nadd('b')", output: "['a', 'b']" },
      fix:   { label: 'bucket=None', code: "def add(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\n\nadd('a')\nadd('b')", output: "['b']" },
    },
    {
      name: 'Keeping the result of an in-place method',
      desc: 'list.sort(), list.append(), dict.update() and friends change the object and return None. Assigning their result replaces your data with None — the usual source of "NoneType object is not subscriptable".',
      wrong: { label: 'nums = nums.sort()', code: 'nums = [3, 1, 2]\nnums = nums.sort()\nnums[0]', output: "TypeError: 'NoneType' object is not subscriptable" },
      fix:   { label: 'sorted() returns a list', code: 'nums = [3, 1, 2]\nnums = sorted(nums)\nnums[0]', output: '1' },
    },
    {
      name: '== None can be fooled',
      desc: '== calls the left object’s __eq__, which can return anything. is compares identity and cannot be overridden.',
      wrong: { label: '== None', code: 'class Anything:\n    def __eq__(self, other):\n        return True\n\nAnything() == None', output: 'True' },
      fix:   { label: 'is None', code: 'class Anything:\n    def __eq__(self, other):\n        return True\n\nAnything() is None', output: 'False' },
    },
  ],

  when: {
    use: [
      'A value that is "not set yet" or "not found"',
      'The default of an optional argument, especially a mutable one',
      'A function whose job is a side effect — it returns None implicitly',
    ],
    avoid: [
      'Signalling an error → raise an exception instead of returning None',
      'Empty collections → return [] or {} so callers can loop without checks',
      'Cases where None is itself a meaningful value → a private sentinel object()',
    ],
  },

  notes: {
    cpython:      'None is a single statically allocated object in the interpreter, so x is None is a plain pointer comparison',
    'Keyword':    'None, True and False are keyword constants, so None = 1 is a SyntaxError rather than a rebinding',
    'NoneType':   'type(None) is NoneType; since 3.10 it is also available as types.NoneType',
    'REPL':       'The interactive prompt prints nothing for an expression whose value is None — use repr(x) or print(x) to see it',
  },

  related: [
    { name: 'is',          slug: 'is',       when: 'The identity test used with None', category: 'operators' },
    { name: '==',          slug: 'eq',       when: 'Equality — overridable, so not for None checks', category: 'operators' },
    { name: 'True / False', slug: 'true-false', when: 'The other keyword constants; truthiness rules' },
    { name: 'return',      slug: 'return',   when: 'A bare return (or none at all) gives None' },
    { name: 'TypeError',   slug: 'typeerror', when: "'NoneType' object is not subscriptable / iterable / callable", category: 'exceptions' },
    { name: 'AttributeError', slug: 'attributeerror', when: "'NoneType' object has no attribute ...", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Should I use is None or == None?',
      a: 'is None. There is only one None object, so identity is exact and fast, and unlike == it cannot be changed by a class’s __eq__. PEP 8 asks for is / is not when comparing with None.',
    },
    {
      q: 'What does "NoneType object is not subscriptable" mean?',
      a: 'You used [ ] on a variable that holds None. Usually the value came from a function that returned nothing — often an in-place method like list.sort(), or a lookup that found nothing (dict.get, re.match). Find where the variable was assigned None.',
    },
    {
      q: 'Is None the same as null, 0 or an empty string?',
      a: 'It plays the role of null in other languages. It is not equal to 0, False or "" — those are separate objects that just happen to be falsy as well. None == 0 is False.',
    },
    {
      q: 'Why use None as a default argument?',
      a: 'Default values are evaluated once, when the function is defined. A list or dict default would be shared between calls. None is immutable, so the usual idiom is param=None and creating the real object inside the function.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/constants.html#None',
    meta:  'Built-in Constants — None',
  },
};
