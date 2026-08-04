// content/reference/python/functions/delattr.js

export const meta = {
  slug:        'delattr',
  name:        'delattr',
  signature:   'delattr(object, name)',
  blurb:       'Delete an attribute by name — the runtime-string equivalent of `del object.name`.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'delattr attribute delete remove dynamic reflection immutable type object',
};

export const method = {
  slug:      'delattr',
  name:      'delattr',
  signature: 'delattr(object, name)',
  returns:   { type: 'None', desc: 'Returns None. Deletes the attribute `name` from `object` — equivalent to `del object.name` when the name is known at runtime. Raises AttributeError if the attribute does not exist; raises TypeError when the target is an immutable built-in type.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: '`del` when the attribute name is a string — used for dynamic cleanup and namespace management.',

  cheat: {
    commonCall: 'delattr(obj, name)',
    returns:    'None — the attribute is removed from the object',
    replaces:   '`del object.name` when name is a runtime string',
    watchOut:   'raises AttributeError if missing; built-in types (str, int, list) reject with TypeError',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'The object to modify. Instances of user classes accept delattr; built-in types like int, str, list reject it.' },
    { name: 'name',   type: 'str', required: true, default: null, desc: 'The attribute name as a STRING. Raises AttributeError if the attribute does not exist on the object.' },
  ],

  demoParams: [
    { name: 'type', type: 'str', hint: 'type: str / list / user',   input: 'text' },
    { name: 'attr', type: 'str', hint: 'attribute name to delete',   input: 'text' },
  ],
  cases: [
    { id: 'user-ok',   label: 'user class OK',      values: { type: 'user',  attr: 'name' } },
    { id: 'user-num',  label: 'user delete age',    values: { type: 'user',  attr: 'age' } },
    { id: 'user-miss', label: 'missing attribute',  values: { type: 'user',  attr: 'nonexistent' } },
    { id: 'str-immut', label: 'str type rejects',   values: { type: 'str',   attr: 'upper' } },
    { id: 'list-immut',label: 'list type rejects',  values: { type: 'list',  attr: 'append' } },
    { id: 'int-immut', label: 'int type rejects',   values: { type: 'int',   attr: 'bit_length' } },
  ],
  demoExplainer: 'The demo picks a target — a user class or a built-in type — and tries to delete an attribute. USER CLASSES accept delattr if the attribute exists (AttributeError otherwise). BUILT-IN TYPES (str, int, list, ...) reject delattr with TypeError, regardless of whether the attribute exists. This mirrors what would happen with `del str.upper` in real Python.',

  patterns: [
    {
      name: 'Dynamic attribute cleanup',
      desc: 'Remove attributes named at runtime — plugin cleanup, namespace scrubbing.',
      code: 'for attr in obsolete_names:\n    if hasattr(obj, attr):\n        delattr(obj, attr)',
    },
    {
      name: 'Guard for existence',
      desc: 'delattr on a missing name raises — guard with hasattr or try/except.',
      code: 'if hasattr(obj, "cached_value"):\n    delattr(obj, "cached_value")',
    },
    {
      name: 'Reset an instance to class defaults',
      desc: 'Remove instance-level shadowing so class attributes show through.',
      code: 'class C:\n    color = "red"\n\nc = C()\nc.color = "blue"   # instance shadow\ndelattr(c, "color")\nc.color   # "red"  (class attr again)',
    },
    {
      name: 'Prefer del for literal names',
      desc: 'When the name is known at compile time, plain del is clearer.',
      code: 'del obj.name              # clearer\ndelattr(obj, "name")       # only if "name" is a variable',
    },
  ],

  examples: [
    { title: 'Basic',                code: 'class C: pass\nc = C()\nc.x = 1\ndelattr(c, "x")\nhasattr(c, "x")', returns: 'False' },
    { title: 'Missing raises',       code: 'delattr(obj, "missing")',                       returns: "AttributeError: 'C' object has no attribute 'missing'" },
    { title: 'Built-in rejects',     code: 'delattr(str, "upper")',                         returns: "TypeError: cannot delete 'upper' attribute of immutable type 'str'" },
    { title: 'Removes shadow',       code: 'class C:\n    x = "class"\nc = C()\nc.x = "instance"\ndelattr(c, "x")\nc.x', returns: '"class"  # class attr visible again' },
    { title: 'Non-string name',      code: 'delattr(obj, 42)',                              returns: "TypeError: attribute name must be string, not 'int'" },
  ],

  pitfalls: [
    {
      name: 'Missing attribute raises AttributeError',
      desc: 'Unlike `del d[key]` on a dict (which raises KeyError), delattr raises AttributeError for missing attributes. Different exception type — catch the right one.',
      wrong: { label: 'Uncaught AttributeError', code: 'delattr(obj, "nonexistent")', output: "AttributeError: 'C' object has no attribute 'nonexistent'" },
      fix:   { label: 'Guard with hasattr',       code: 'if hasattr(obj, name):\n    delattr(obj, name)', output: 'safe' },
    },
    {
      name: 'Built-in immutable types REJECT delattr',
      desc: 'Same restriction as setattr. You cannot delete attributes from str, int, list, ... — Python raises TypeError. Subclass if you need this level of control.',
      wrong: { label: 'Built-in refused', code: 'delattr(str, "upper")', output: "TypeError: cannot delete 'upper' attribute of immutable type 'str'" },
      fix:   { label: 'Not deletable — do not try', code: '# built-in methods are permanent', output: '' },
    },
    {
      name: 'Deleting an instance attr may EXPOSE a class attr',
      desc: 'If both the instance and the class have the same-named attribute, delattr(instance, name) removes the instance one, leaving the class one visible. Sometimes desired, sometimes surprising.',
      wrong: { label: 'Expected gone', code: 'class C:\n    x = "class"\nc = C()\nc.x = "instance"\ndelattr(c, "x")\nc.x', output: '"class"  # not gone — class attr shows' },
      fix:   { label: 'Delete from class too', code: 'delattr(C, "x")   # if you want it fully gone', output: 'AttributeError on access' },
    },
    {
      name: '__slots__ classes CANNOT delete slot attributes',
      desc: 'A slotted attribute holds its slot — you can set the slot to None but delattr raises AttributeError.',
      wrong: { label: 'Slot delete rejected', code: 'class P:\n    __slots__ = ("x",)\np = P()\np.x = 1\ndelattr(p, "x")', output: "AttributeError: 'P' object has no attribute 'x'  # or similar" },
      fix:   { label: 'Set to sentinel',       code: 'p.x = None', output: 'occupied but nullified' },
    },
  ],

  when: {
    use: [
      'Dynamic attribute deletion with a runtime name',
      'Cleaning up a namespace before serialization',
      'Removing instance-level shadows to expose class defaults',
      'Any place `del obj.name` is needed but `name` is a variable',
    ],
    avoid: [
      'You have a literal attribute name → use `del obj.name`',
      'The target is a built-in type → cannot be modified',
      'You want to overwrite → setattr with a new value',
      'You might be deleting a nonexistent attribute → guard with hasattr',
    ],
  },

  notes: {
    complexity: 'O(1) for a __dict__ deletion',
    return:     'None',
    cpython:    'Python/bltinmodule.c :: builtin_delattr — calls PyObject_DelAttr',
    memory:     'May free the slot in __dict__',
    threadSafe: 'Depends on whether the underlying attribute access is safe',
  },

  related: [
    { name: 'setattr',   slug: 'setattr',   when: 'Write side — the natural counterpart' },
    { name: 'hasattr',   slug: 'hasattr',   when: 'Check whether an attribute exists first' },
    { name: 'getattr',   slug: 'getattr',   when: 'Read side of the attribute triad' },
    { name: 'vars',      slug: 'vars',      when: 'Inspect the __dict__ directly' },
  ],

  faq: [
    {
      q: 'What is the difference between delattr(obj, name) and del obj.name?',
      a: 'Identical semantics — the operator form compiles to the same C call. Use `del` for literal names; use delattr when the name is a runtime string.',
    },
    {
      q: 'Why does delattr fail on built-in types?',
      a: 'Same reason as setattr — built-in types are immutable at the class level. Their methods and attributes are baked into the C implementation and cannot be removed at runtime.',
    },
    {
      q: 'What is the difference between delattr and setattr(obj, name, None)?',
      a: 'delattr REMOVES the attribute — hasattr afterwards returns False. Setting to None leaves the attribute present with value None. Different intents; the None form still has an entry in __dict__.',
    },
  ],

  history: [
    { version: '1.0', note: 'delattr() has been a builtin since Python 1.0.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#delattr',
    meta:  'delattr',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};