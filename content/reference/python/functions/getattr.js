// content/reference/python/functions/getattr.js

export const meta = {
  slug:        'getattr',
  name:        'getattr',
  signature:   'getattr(object, name[, default])',
  blurb:       'Get an attribute by name — with an optional default to avoid AttributeError.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'getattr attribute get default reflection dynamic access method property',
};

export const method = {
  slug:      'getattr',
  name:      'getattr',
  signature: 'getattr(object, name[, default])',
  returns:   { type: 'Any', desc: 'The attribute value. If missing: returns default when supplied, raises AttributeError otherwise. The equivalent of `object.name` when `name` is a runtime string.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Dot access when the attribute name is a string — with an optional default that replaces try/except AttributeError.',

  cheat: {
    commonCall: 'value = getattr(obj, name, None)',
    returns:    'the attribute, or default, or AttributeError',
    replaces:   'try: obj.name except AttributeError: default',
    watchOut:   'without a default, AttributeError propagates — catch it or provide one',
  },

  parameters: [
    { name: 'object',  type: 'Any', required: true,  default: null, desc: 'Any object. getattr walks its class hierarchy to find the attribute.' },
    { name: 'name',    type: 'str', required: true,  default: null, desc: 'The attribute name as a STRING. Not the identifier — a runtime value.' },
    { name: 'default', type: 'Any', required: false, default: null, desc: 'The fallback value returned when the attribute is missing. Any type; None is common but a sentinel object is safer if None could be a real value.' },
  ],

  demoParams: [
    { name: 'type', type: 'str', hint: 'type: str / list / dict / int', input: 'text' },
    { name: 'attr', type: 'str', hint: 'attribute or method name',       input: 'text' },
  ],
  cases: [
    { id: 'str-upper',    label: 'str.upper',           values: { type: 'str',  attr: 'upper' } },
    { id: 'list-append',  label: 'list.append',         values: { type: 'list', attr: 'append' } },
    { id: 'dict-keys',    label: 'dict.keys',           values: { type: 'dict', attr: 'keys' } },
    { id: 'int-bit-length',label: 'int.bit_length',     values: { type: 'int',  attr: 'bit_length' } },
    { id: 'set-add',      label: 'set.add',             values: { type: 'set',  attr: 'add' } },
    { id: 'missing',      label: 'missing (default)',   values: { type: 'str',  attr: 'append' } },
    { id: 'missing-int',  label: 'int has no upper',    values: { type: 'int',  attr: 'upper' } },
  ],
  demoExplainer: 'The demo picks a Python built-in type by name (str, list, dict, int, set) and returns the description of the attribute on that type. In real code the return is the ACTUAL attribute — usually a bound method — that you can call. For missing attributes, the demo returns a sentinel string; real Python raises AttributeError unless a default is provided.',

  patterns: [
    {
      name: 'Optional attribute with a default',
      desc: 'Replace try/except AttributeError with a one-line getattr.',
      code: 'timeout = getattr(config, "timeout", 30)',
    },
    {
      name: 'Dispatch by attribute name',
      desc: 'Common in CLI parsers and plugin registries.',
      code: 'handler = getattr(handlers, command, default_handler)\nhandler(*args)',
    },
    {
      name: 'Method call by runtime string',
      desc: 'When the method name comes from data — config, user input, etc.',
      code: 'method = getattr(obj, name)\nresult = method(*args, **kwargs)',
    },
    {
      name: 'Sentinel for the &quot;None is a real value&quot; case',
      desc: 'When None could be legitimate, an object() sentinel disambiguates.',
      code: '_missing = object()\nval = getattr(obj, name, _missing)\nif val is _missing:\n    ...   # truly absent',
    },
  ],

  examples: [
    { title: 'Method by name',      code: 'getattr(str, "upper")',                returns: '<method \'upper\' of \'str\' objects>' },
    { title: 'Instance method',     code: 'getattr("hi", "upper")()',              returns: '"HI"' },
    { title: 'With default',        code: 'getattr(obj, "missing", "fallback")',   returns: '"fallback"' },
    { title: 'Without default',     code: 'getattr({}, "missing")',                returns: 'AttributeError' },
    { title: 'None as default',     code: 'getattr(obj, "missing", None)',         returns: 'None' },
    { title: 'Call after getattr',  code: 'getattr(items, "sort")()',              returns: 'None  # list.sort mutates' },
  ],

  pitfalls: [
    {
      name: 'AttributeError without a default',
      desc: 'The single most common getattr surprise. Without a third argument, a missing attribute raises AttributeError. In modern code, always provide a default unless you truly want the exception.',
      wrong: { label: 'Uncaught raise', code: 'getattr(obj, "missing")', output: 'AttributeError: ...' },
      fix:   { label: 'Default it',     code: 'getattr(obj, "missing", None)', output: 'None' },
    },
    {
      name: 'A property that raises AttributeError looks &quot;missing&quot;',
      desc: 'If a @property internally raises AttributeError, getattr returns the DEFAULT — the bug looks like the attribute is absent. Use try/except and log the error for properties with side effects.',
      wrong: { label: 'Bug hidden', code: '@property\ndef x(self):\n    return self.does_not_exist\n\ngetattr(obj, "x", None)', output: 'None  # bug looks like &quot;missing&quot;' },
      fix:   { label: 'Try/except with logging', code: 'try:\n    val = obj.x\nexcept AttributeError as e:\n    log.warning("no x: %s", e)', output: 'error visible' },
    },
    {
      name: 'Class attributes AND instance attributes',
      desc: 'getattr walks the MRO. A method defined on the class is returned via an instance getattr. For instance-only attributes, check obj.__dict__ or vars().',
      wrong: { label: 'Assumed instance-only', code: 'class C: shared = 1\ngetattr(C(), "shared")', output: '1  # from the class' },
      fix:   { label: 'Instance-only',           code: 'vars(C()).get("shared")', output: 'None' },
    },
    {
      name: 'Name is a STRING, not an identifier',
      desc: 'A common typo — passing the attribute as if it were a variable. getattr wants the NAME as a string.',
      wrong: { label: 'Not a string', code: 'getattr(obj, upper)', output: 'NameError: name \'upper\' is not defined' },
      fix:   { label: 'Quote it',      code: 'getattr(obj, "upper")', output: 'bound method' },
    },
  ],

  when: {
    use: [
      'Attribute access when the name is a runtime STRING',
      'Optional attributes with a fallback default',
      'Dispatch tables keyed by name — CLI, plugins, factories',
      'Method calls via reflection when the method name comes from data',
    ],
    avoid: [
      'You have a literal attribute name — use dot access directly',
      'You want to check existence only → hasattr',
      'You want the FULL exception on missing → skip the default and let AttributeError propagate',
      'Setting a value → setattr',
    ],
  },

  notes: {
    complexity: 'O(mro depth) — walks the class hierarchy',
    return:     'The attribute value or default; may raise AttributeError',
    cpython:    'Python/bltinmodule.c :: builtin_getattr — calls PyObject_GetAttr',
    memory:     'No allocation beyond the returned value',
    threadSafe: 'Depends on whether attribute access is safe for the object',
  },

  related: [
    { name: 'hasattr',  slug: 'hasattr',  when: 'Check existence without retrieving the value' },
    { name: 'setattr',  slug: 'setattr',  when: 'Set an attribute by name (the write side)' },
    { name: 'type',     slug: 'type',     when: 'Inspect the class rather than probe attributes' },
    { name: 'isinstance', slug: 'isinstance', when: 'Type-based check rather than attribute-based' },
  ],

  faq: [
    {
      q: 'What is the difference between getattr and dot access?',
      a: 'For a literal attribute name, dot access (obj.name) is identical and clearer. getattr is for when the name is a runtime string — from config, from user input, from a computed value. Also useful for the third-arg default.',
    },
    {
      q: 'Should I use hasattr and then getattr?',
      a: 'No — that is two attribute lookups. Use getattr with a default: `val = getattr(obj, name, DEFAULT)`. One lookup, one branch.',
    },
    {
      q: 'How do I get a private (name-mangled) attribute?',
      a: 'Pass the mangled name: `getattr(obj, "_ClassName__private")`. Name mangling happens at compile time, so getattr with the plain double-underscore name will not find it from outside the class.',
    },
  ],

  history: [
    { version: '1.0', note: 'getattr() has been a builtin since Python 1.0.' },
    { version: '3.2', note: 'Only AttributeError is caught internally when computing whether to use the default; other exceptions propagate.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#getattr',
    meta:  'getattr',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};