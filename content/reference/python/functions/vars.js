// content/reference/python/functions/vars.js

export const meta = {
  slug:        'vars',
  name:        'vars',
  signature:   'vars([object])',
  blurb:       'Return an object&apos;s __dict__ — instance-only attributes, in declaration order.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'vars dict attribute instance __dict__ introspection namespace object module',
};

export const method = {
  slug:      'vars',
  name:      'vars',
  signature: 'vars([object])',
  returns:   { type: 'dict', desc: 'The __dict__ attribute of the given object. Without an argument, returns the local scope (like locals()). With an object: returns its __dict__ — the instance-specific writable attribute namespace. Not all objects have __dict__ (e.g. built-in types like int, list, str).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The direct pointer to __dict__ — instance-only attributes, declaration order, live view.',

  cheat: {
    commonCall: 'attrs = vars(obj)',
    returns:    'a dict — LIVE view of __dict__',
    replaces:   '`obj.__dict__` — the same result, just less punctuation',
    watchOut:   'the result is LIVE — mutating it mutates the object; not all objects have __dict__',
  },

  parameters: [
    { name: 'object', type: 'Any', required: false, default: null, desc: 'An object with a __dict__ attribute (most user classes, modules, and instances). Without an argument, returns locals(). Built-in types (int, list, str, ...) do NOT have __dict__ and raise TypeError.' },
  ],

  demoParams: [
    { name: 'kind', type: 'str', hint: 'module / class / instance', input: 'text' },
  ],
  cases: [
    { id: 'module',   label: 'module',       values: { kind: 'module' } },
    { id: 'class',    label: 'class',        values: { kind: 'class' } },
    { id: 'instance', label: 'instance',     values: { kind: 'instance' } },
    { id: 'empty',    label: 'empty class',  values: { kind: 'empty-class' } },
    { id: 'builtin',  label: 'built-in type',values: { kind: 'str' } },
  ],
  demoExplainer: 'The demo picks a category (module / class / instance) and shows what vars() would return for a representative object. Modules have __dict__ containing their names. User classes have __dict__ containing methods and class attributes. Instances have __dict__ containing per-instance attributes. Built-in types like str do NOT have __dict__ and raise TypeError.',

  patterns: [
    {
      name: 'Inspect an instance&apos;s data',
      desc: 'Quick way to see all instance attributes without printing methods.',
      code: 'print(vars(user))\n# {"name": "Alice", "age": 30}',
    },
    {
      name: 'Serialize a simple dataclass',
      desc: 'vars gives you the field dict directly.',
      code: 'import json\njson.dumps(vars(obj))',
    },
    {
      name: 'Compare instance state',
      desc: 'Two instances have equal state when their vars are equal.',
      code: 'vars(a) == vars(b)',
    },
    {
      name: 'Mutate through vars',
      desc: 'The returned dict is LIVE — assigning through it changes the object.',
      code: 'vars(obj)["new_attr"] = value\n# same as: obj.new_attr = value',
    },
  ],

  examples: [
    { title: 'Instance',           code: 'class C: pass\nc = C()\nc.x = 1\nvars(c)', returns: "{'x': 1}" },
    { title: 'Class',              code: 'class C:\n    x = 1\n    def m(self): pass\n\nvars(C)', returns: "{'x': 1, 'm': <function C.m>, ...}" },
    { title: 'Empty instance',     code: 'class C: pass\nvars(C())',                returns: '{}' },
    { title: 'No argument',        code: 'vars()',                                    returns: 'same as locals()' },
    { title: 'Built-in raises',    code: 'vars(42)',                                  returns: "TypeError: vars() argument must have __dict__ attribute" },
    { title: 'Live mutation',       code: 'vars(obj)["y"] = 5\nobj.y',                 returns: '5  # dict is LIVE' },
  ],

  pitfalls: [
    {
      name: 'Built-in immutable types have NO __dict__',
      desc: 'int, float, str, tuple, and most other built-in types are implemented in C and lack the Python-level __dict__. Calling vars() on them raises TypeError.',
      wrong: { label: 'Rejected', code: 'vars(42)', output: 'TypeError: vars() argument must have __dict__ attribute' },
      fix:   { label: 'Use dir instead', code: 'dir(42)', output: 'list of names on int' },
    },
    {
      name: 'vars() vs dir() — very different',
      desc: 'vars returns just the __dict__ (instance-only, writable attributes). dir walks the whole MRO (all attributes accessible via getattr, including inherited methods). They return different things almost always.',
      wrong: { label: 'Assumed same', code: 'set(vars(obj)) == set(dir(obj))', output: 'False for almost any object' },
      fix:   { label: 'Different tools', code: 'vars(obj)   # just instance attrs\ndir(obj)   # all accessible names', output: '' },
    },
    {
      name: 'The returned dict is LIVE — mutations affect the object',
      desc: 'vars does not copy — it returns the actual __dict__. Assigning through it modifies the object. Sometimes useful, sometimes surprising.',
      wrong: { label: 'Snapshot lost', code: 'snapshot = vars(obj)\nobj.x = 99\nsnapshot["x"]', output: '99  # the snapshot updated too' },
      fix:   { label: 'Copy for a snapshot', code: 'snapshot = dict(vars(obj))', output: 'independent copy' },
    },
    {
      name: 'Classes with __slots__ have no __dict__',
      desc: '__slots__ classes intentionally lack __dict__ for memory efficiency. Instances of such classes cannot be inspected with vars().',
      wrong: { label: 'Slotted rejected', code: 'class Point:\n    __slots__ = ("x", "y")\n\nvars(Point())', output: "TypeError: vars() argument must have __dict__ attribute" },
      fix:   { label: 'Use dir + getattr', code: '{s: getattr(obj, s) for s in obj.__slots__}', output: 'equivalent dict' },
    },
  ],

  when: {
    use: [
      'Inspecting instance state during debugging',
      'Serializing simple &quot;data bag&quot; objects to JSON or repr',
      'Iterating over an object&apos;s writable attributes',
      'Building an equality check based on instance state',
    ],
    avoid: [
      'Object might not have __dict__ → guard with hasattr(obj, "__dict__")',
      'You want inherited methods too → dir(obj)',
      'You want a snapshot → wrap in dict() to copy',
      '__slots__ classes → attribute-by-attribute access',
    ],
  },

  notes: {
    complexity: 'O(1) — direct attribute access',
    return:     'The live __dict__ mapping — same object each call',
    cpython:    'Python/bltinmodule.c :: builtin_vars — returns tp_dict or object.__dict__',
    memory:     'No allocation — returns the existing dict',
    threadSafe: 'Depends on whether the underlying dict is safe from concurrent mutation',
  },

  related: [
    { name: 'dir',    slug: 'dir',    when: 'All accessible names (including inherited) — sorted' },
    { name: 'hasattr',slug: 'hasattr',when: 'Check whether a specific attribute exists' },
    { name: 'getattr',slug: 'getattr',when: 'Read a specific attribute by name' },
    { name: 'type',   slug: 'type',   when: 'Get the class of the object' },
  ],

  faq: [
    {
      q: 'What is the difference between vars() and dir()?',
      a: 'vars gives you the __dict__ — just the instance-specific writable attributes, in declaration order (Python 3.7+). dir walks the whole MRO to return every accessible name (including inherited methods), sorted alphabetically. Both are useful; they answer different questions.',
    },
    {
      q: 'Why does vars(42) fail?',
      a: 'Because int is a C-level type without a Python-level __dict__ — the same reason you cannot do `(42).new_attr = 1`. This applies to most built-in types (str, list, tuple, ...).',
    },
    {
      q: 'Is the returned dict a copy or a view?',
      a: 'A LIVE view — the same dict as obj.__dict__. Mutations through it affect the object. Wrap in dict() to get a snapshot.',
    },
  ],

  history: [
    { version: '1.0', note: 'vars() has been a builtin since Python 1.0.' },
    { version: '3.7', note: 'Class __dict__ preserves declaration order (as an ordered dict was already since 3.6, guaranteed in 3.7).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#vars',
    meta:  'vars',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the __dict__' },
  ],
};