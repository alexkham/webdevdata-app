// content/reference/python/functions/hasattr.js

export const meta = {
  slug:        'hasattr',
  name:        'hasattr',
  signature:   'hasattr(object, name)',
  blurb:       'True if the object has the named attribute — equivalent to getattr-with-try-except.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'hasattr attribute check exists reflection duck typing getattr method property',
};

export const method = {
  slug:      'hasattr',
  name:      'hasattr',
  signature: 'hasattr(object, name)',
  returns:   { type: 'bool', desc: 'True if getattr(object, name) would succeed. Implemented as a getattr call wrapped in try/except AttributeError. Any OTHER exception raised during attribute access propagates.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Check whether an object has an attribute — often the wrong tool. Prefer try/except or duck typing when the attribute might be a property with side effects.',

  cheat: {
    commonCall: 'if hasattr(obj, "close"):',
    returns:    'True or False',
    replaces:   'try: getattr(obj, name) except AttributeError: ...',
    watchOut:   'a property that raises DURING access returns True if it raises AttributeError, False otherwise — subtle',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'Any object. hasattr walks its class hierarchy to find the attribute.' },
    { name: 'name',   type: 'str', required: true, default: null, desc: 'The attribute name as a string. Not the name as a Python identifier — a runtime string.' },
  ],

  demoParams: [
    { name: 'type', type: 'str', hint: 'type: str / list / dict / int', input: 'text' },
    { name: 'attr', type: 'str', hint: 'attribute or method name',       input: 'text' },
  ],
  cases: [
    { id: 'str-upper',    label: 'str has upper',      values: { type: 'str',  attr: 'upper' } },
    { id: 'str-append',   label: 'str no append',      values: { type: 'str',  attr: 'append' } },
    { id: 'list-append',  label: 'list has append',    values: { type: 'list', attr: 'append' } },
    { id: 'list-upper',   label: 'list no upper',      values: { type: 'list', attr: 'upper' } },
    { id: 'dict-keys',    label: 'dict has keys',      values: { type: 'dict', attr: 'keys' } },
    { id: 'dict-append',  label: 'dict no append',     values: { type: 'dict', attr: 'append' } },
    { id: 'int-bit-length', label: 'int has bit_length', values: { type: 'int', attr: 'bit_length' } },
    { id: 'int-nope',     label: 'int no fake',        values: { type: 'int',  attr: 'fake_attr' } },
  ],
  demoExplainer: 'The demo picks a Python built-in type by name (str, list, dict, int) and checks whether it has the given attribute — that is, whether a call like getattr(str, "upper") would succeed. In real code you pass any object: hasattr(user, "email") checks whether the user object has that attribute defined by its class or __dict__. Duck-typing style code often uses hasattr before calling a method, though try/except is usually cleaner.',

  patterns: [
    {
      name: 'Optional-method dispatch',
      desc: 'Call an optional method only if it exists.',
      code: 'if hasattr(handler, "on_close"):\n    handler.on_close()',
    },
    {
      name: 'Feature detection',
      desc: 'Check whether a module or class supports a newer API.',
      code: 'if hasattr(concurrent.futures, "InterpreterPoolExecutor"):\n    ...   # 3.14+',
    },
    {
      name: 'Guard before setattr',
      desc: 'Refuse to overwrite an existing attribute unless expected.',
      code: 'if hasattr(obj, name) and not force:\n    raise ValueError(f"{name} already exists")',
    },
    {
      name: 'Prefer try/except for \"probably has it\" cases',
      desc: 'When you expect the attribute to exist, EAFP style is cleaner and faster.',
      code: 'try:\n    result = obj.method()\nexcept AttributeError:\n    result = fallback',
    },
  ],

  examples: [
    { title: 'str has upper',           code: 'hasattr(str, "upper")',           returns: 'True' },
    { title: 'str no append',           code: 'hasattr(str, "append")',           returns: 'False' },
    { title: 'list has append',         code: 'hasattr(list, "append")',          returns: 'True' },
    { title: 'dict has keys',           code: 'hasattr(dict, "keys")',            returns: 'True' },
    { title: 'Instance check',          code: 'hasattr("hello", "upper")',        returns: 'True  # instances see class attrs' },
    { title: 'Missing returns False',   code: 'hasattr({}, "does_not_exist")',    returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'A property that RAISES AttributeError silently returns False',
      desc: 'The classic hasattr gotcha. If a property (or __getattr__) internally raises AttributeError — for any reason, even a bug — hasattr returns False rather than letting you see the real error.',
      wrong: { label: 'Bug hidden', code: '@property\ndef expensive(self):\n    return self.does_not_exist   # AttributeError\n\nhasattr(obj, "expensive")', output: 'False  # bug looks like \"attribute missing\"' },
      fix:   { label: 'Try/except with logging', code: 'try:\n    val = obj.expensive\nexcept AttributeError as e:\n    log.warning("no expensive: %s", e)', output: 'error visible' },
    },
    {
      name: 'hasattr triggers property access',
      desc: 'Properties have side effects. hasattr calls the property to see whether it raises — expensive properties are computed just to check existence. Use `hasattr(type(obj), name)` for cheap class-level checks.',
      wrong: { label: 'Property triggered', code: 'hasattr(user, "expensive_computed_field")', output: 'True — but computed the value' },
      fix:   { label: 'Check the class',     code: 'hasattr(type(user), "expensive_computed_field")', output: 'True — no computation' },
    },
    {
      name: 'Instance attributes vs class attributes',
      desc: 'hasattr(obj, name) is True whether the attribute is on the instance or on any class in the MRO. If you specifically want an instance attribute, check obj.__dict__ or use vars().',
      wrong: { label: 'Class attr counts', code: 'class C: shared = 1\nhasattr(C(), "shared")', output: 'True — from the class' },
      fix:   { label: 'Instance-only check', code: '"shared" in vars(C())', output: 'False' },
    },
    {
      name: 'Only AttributeError is caught — other exceptions propagate',
      desc: 'Since Python 3.2, hasattr only swallows AttributeError. Any other exception (TypeError, KeyError, ...) raised during attribute access propagates, which is usually the correct behavior.',
      wrong: { label: 'Old assumption',     code: 'hasattr(obj, name)   # in Python 2, ate all exceptions', output: 'True/False even on bugs' },
      fix:   { label: '3.x is more honest', code: '# TypeError from a broken property will now raise', output: 'exposes real errors' },
    },
  ],

  when: {
    use: [
      'Optional-method dispatch — call it if it exists',
      'Feature detection across Python versions or libraries',
      'Guarding setattr against accidental overwrite',
      'Duck-typing checks against structural protocols (though isinstance with collections.abc is often better)',
    ],
    avoid: [
      'Expected attribute → try/except is cleaner and cheaper',
      'Property that might raise → try/except with logging exposes real bugs',
      'Instance-only attribute check → use vars() or obj.__dict__',
      'Expensive properties → check the class instead of the instance',
    ],
  },

  notes: {
    complexity: 'O(mro depth) — walks the class hierarchy',
    return:     'bool — True or False',
    cpython:    'Python/bltinmodule.c :: builtin_hasattr — wraps PyObject_GetAttr',
    memory:     'No allocation beyond the attribute lookup',
    threadSafe: 'Depends on whether attribute access is safe for the object',
  },

  related: [
    { name: 'getattr',   slug: 'getattr',   when: 'Actually retrieve the attribute — with an optional default' },
    { name: 'isinstance',slug: 'isinstance',when: 'Type-based check rather than attribute-based' },
    { name: 'type',      slug: 'type',      when: 'Inspect the class rather than probe attributes' },
  ],

  faq: [
    {
      q: 'What is the difference between hasattr and getattr with a default?',
      a: 'hasattr returns True or False. getattr with a default returns the value or the default. If you need the value, use getattr — do not check with hasattr and then fetch with getattr.',
    },
    {
      q: 'Is hasattr faster than try/except?',
      a: 'Usually slower, because hasattr internally does a getattr and catches AttributeError. Direct try/except around the actual call is cleaner and sometimes faster when the attribute exists.',
    },
    {
      q: 'Does hasattr work for private (name-mangled) attributes?',
      a: 'Yes — but you need to pass the mangled name. `hasattr(obj, "_ClassName__private")` — not `hasattr(obj, "__private")`. Name mangling happens at compile time.',
    },
  ],

  history: [
    { version: '1.0', note: 'hasattr() has been a builtin since Python 1.0.' },
    { version: '3.2', note: 'Only AttributeError is swallowed; other exceptions propagate. Previously (Python 2 / early 3), all exceptions returned False.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#hasattr',
    meta:  'hasattr',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};