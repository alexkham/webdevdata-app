// content/reference/python/functions/setattr.js

export const meta = {
  slug:        'setattr',
  name:        'setattr',
  signature:   'setattr(object, name, value)',
  blurb:       'Set an attribute by name — the runtime-string equivalent of `object.name = value`.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'setattr attribute set write assign dynamic reflection immutable type object',
};

export const method = {
  slug:      'setattr',
  name:      'setattr',
  signature: 'setattr(object, name, value)',
  returns:   { type: 'None', desc: 'Returns None. Sets the attribute `name` on `object` to `value` — equivalent to `object.name = value` when the name is known at runtime. Raises TypeError when the target is an immutable built-in type; raises AttributeError when the object cannot accept the attribute (e.g. __slots__ classes).' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Dot assignment when the attribute name is a string — useful for dynamic dispatch and configuration.',

  cheat: {
    commonCall: 'setattr(obj, name, value)',
    returns:    'None — the attribute is set on the object',
    replaces:   'the getattr with try/except pattern when writing rather than reading',
    watchOut:   'built-in types (str, int, list) are IMMUTABLE — assignment raises TypeError',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'The object to modify. Instances of user classes accept setattr; built-in types like int, str, list reject it.' },
    { name: 'name',   type: 'str', required: true, default: null, desc: 'The attribute name as a STRING. Not the identifier — a runtime value.' },
    { name: 'value',  type: 'Any', required: true, default: null, desc: 'The value to assign. Any type. Overwrites any existing attribute with the same name.' },
  ],

  demoParams: [
    { name: 'type',  type: 'str', hint: 'type: str / list / user',  input: 'text' },
    { name: 'attr',  type: 'str', hint: 'attribute name',           input: 'text' },
    { name: 'value', type: 'str', hint: 'value to assign',           input: 'text' },
  ],
  cases: [
    { id: 'user-ok',   label: 'user class OK',        values: { type: 'user',  attr: 'name',      value: 'Alice' } },
    { id: 'user-num',  label: 'user class number',    values: { type: 'user',  attr: 'age',       value: '30' } },
    { id: 'user-new',  label: 'add new attribute',    values: { type: 'user',  attr: 'timestamp', value: 'now' } },
    { id: 'str-immut', label: 'str type rejects',     values: { type: 'str',   attr: 'x',         value: '1' } },
    { id: 'list-immut',label: 'list type rejects',    values: { type: 'list',  attr: 'x',         value: '1' } },
    { id: 'int-immut', label: 'int type rejects',     values: { type: 'int',   attr: 'x',         value: '1' } },
  ],
  demoExplainer: 'The demo picks a target — a user class or a built-in type — and tries to set an attribute. USER CLASSES accept setattr and store the value in the instance __dict__. BUILT-IN TYPES (str, int, list, ...) reject setattr with TypeError because they are immutable. This is the same distinction you would see writing `str.x = 1` in real Python.',

  patterns: [
    {
      name: 'Dynamic attribute assignment',
      desc: 'When the attribute name comes from data — config, user input, deserialization.',
      code: 'for key, value in config.items():\n    setattr(obj, key, value)',
    },
    {
      name: 'Populate a namespace from a dict',
      desc: 'Common in constructors that accept **kwargs.',
      code: 'def __init__(self, **kwargs):\n    for k, v in kwargs.items():\n        setattr(self, k, v)',
    },
    {
      name: 'Method injection (patching)',
      desc: 'Add a method to an existing class at runtime.',
      code: 'def new_method(self):\n    return 42\nsetattr(MyClass, "answer", new_method)',
    },
    {
      name: 'Prefer dot access for literal names',
      desc: 'When the name is known at compile time, plain assignment is clearer.',
      code: 'obj.name = "Alice"          # clearer\nsetattr(obj, "name", "Alice") # only if "name" is a variable',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'class C: pass\nc = C()\nsetattr(c, "x", 1)\nc.x', returns: '1' },
    { title: 'Overwrite existing', code: 'c.x = 1\nsetattr(c, "x", 99)\nc.x',                returns: '99' },
    { title: 'Method injection',   code: 'setattr(C, "greet", lambda self: "hi")\nC().greet()', returns: '"hi"' },
    { title: 'Built-in rejects',   code: 'setattr(str, "foo", 1)',                            returns: "TypeError: cannot set 'foo' attribute of immutable type 'str'" },
    { title: 'Non-string name',    code: 'setattr(obj, 42, "x")',                             returns: "TypeError: attribute name must be string, not 'int'" },
    { title: '__slots__ rejects',  code: 'class P:\n    __slots__ = ("x",)\np = P()\nsetattr(p, "y", 1)', returns: "AttributeError: 'P' object has no attribute 'y'" },
  ],

  pitfalls: [
    {
      name: 'Built-in immutable types REJECT setattr',
      desc: 'You cannot add attributes to str, int, list, dict, tuple, or any other built-in type. Attempting it raises TypeError with a clear message. Only user-defined classes (and their instances) accept setattr.',
      wrong: { label: 'Built-in refused', code: 'setattr(str, "foo", 1)', output: "TypeError: cannot set 'foo' attribute of immutable type 'str'" },
      fix:   { label: 'Subclass first',   code: 'class MyStr(str): pass\nsetattr(MyStr, "foo", 1)', output: 'works' },
    },
    {
      name: '__slots__ classes only accept declared attributes',
      desc: 'A __slots__ class has no __dict__ and rejects setattr for undeclared names. Attempts raise AttributeError, not TypeError.',
      wrong: { label: '__slots__ refused', code: 'class P:\n    __slots__ = ("x",)\nsetattr(P(), "y", 1)', output: "AttributeError: 'P' object has no attribute 'y'" },
      fix:   { label: 'Declare in slots',  code: 'class P:\n    __slots__ = ("x", "y")\nsetattr(P(), "y", 1)', output: 'works' },
    },
    {
      name: 'Name must be a string',
      desc: 'A common typo — passing a non-string as the attribute name. Python rejects it up front.',
      wrong: { label: 'Non-string name', code: 'setattr(obj, 42, "x")', output: "TypeError: attribute name must be string, not 'int'" },
      fix:   { label: 'Quote the name',   code: 'setattr(obj, "42", "x")', output: 'works — sets attr &quot;42&quot;' },
    },
    {
      name: 'Silently overwrites — no warning',
      desc: 'setattr replaces existing attributes without any check. Combined with the dynamic-string form, this makes it easy to accidentally clobber. Guard with hasattr if you care.',
      wrong: { label: 'Silent clobber', code: 'setattr(obj, name, new)   # even if obj.name already exists', output: 'old value gone' },
      fix:   { label: 'Guard first',     code: 'if not hasattr(obj, name):\n    setattr(obj, name, new)', output: 'explicit intent' },
    },
  ],

  when: {
    use: [
      'Dynamic attribute assignment with a runtime name',
      'Configuring an object from a dict or kwargs',
      'Method injection (monkey-patching) — rare in modern code but occasionally useful',
      'Any place `obj.name = value` is needed but `name` is a variable',
    ],
    avoid: [
      'You have a literal attribute name → use dot access',
      'The target is a built-in type → cannot be modified',
      'You want deletion → delattr',
      'You want to check first → hasattr + setattr, or just try/except',
    ],
  },

  notes: {
    complexity: 'O(1) for a __dict__ assignment; O(mro) if descriptors are involved',
    return:     'None',
    cpython:    'Python/bltinmodule.c :: builtin_setattr — calls PyObject_SetAttr',
    memory:     'May allocate slots in __dict__',
    threadSafe: 'Depends on whether the underlying attribute access is safe',
  },

  related: [
    { name: 'hasattr',   slug: 'hasattr',   when: 'Check whether an attribute exists first' },
    { name: 'getattr',   slug: 'getattr',   when: 'The read side of the attribute triad' },
    { name: 'delattr',   slug: 'delattr',   when: 'Delete an attribute' },
    { name: 'vars',      slug: 'vars',      when: 'Inspect the __dict__ directly' },
  ],

  faq: [
    {
      q: 'Why does setattr fail on built-in types?',
      a: 'Because built-in types (int, str, list, ...) are implemented in C and their layouts are fixed — no Python-level __dict__ exists. Attempting to add an attribute raises TypeError. Subclass the type if you need to attach attributes.',
    },
    {
      q: 'What is the difference between setattr(obj, name, val) and obj.name = val?',
      a: 'Identical semantics — the operator form compiles to the same C call. Use dot access for literal names; use setattr when the name is a runtime string.',
    },
    {
      q: 'Can I use setattr to add methods?',
      a: 'Yes — assign a function to the class (not an instance) and it becomes a method. `setattr(C, "greet", lambda self: "hi")` adds greet as a method. Rare in modern code but occasionally useful for framework code.',
    },
  ],

  history: [
    { version: '1.0', note: 'setattr() has been a builtin since Python 1.0.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#setattr',
    meta:  'setattr',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};