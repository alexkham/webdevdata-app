
// content/reference/python/functions/staticmethod.js

export const meta = {
  slug:        'staticmethod',
  name:        'staticmethod',
  signature:   'staticmethod(function)',
  blurb:       'Attach a plain function to a class — no `self`, no `cls`, no magic.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'staticmethod decorator no self no cls utility class function nested class scope namespace',
};

export const method = {
  slug:      'staticmethod',
  name:      'staticmethod',
  signature: 'staticmethod(function)',
  returns:   { type: 'staticmethod', desc: 'A descriptor that, when accessed on the class or an instance, returns the wrapped function UNBOUND. No implicit first argument is passed. Useful for utility functions that logically belong to the class&apos;s namespace but do not need the class or instance.' },

  category:    'Built-in function / decorator',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'A plain function that lives inside a class. The compiler drops the auto-self / auto-cls behavior.',

  cheat: {
    commonCall: '@staticmethod\ndef helper(x): ...',
    returns:    'a function — no cls, no self',
    replaces:   'a module-level function when the logical home is inside a class',
    watchOut:   'cannot access class or instance state; if you need cls, use classmethod',
  },

  parameters: [
    { name: 'function', type: 'callable', required: true, default: null, desc: 'The function to wrap. When called via the class or an instance, no automatic first argument is prepended. Used as @staticmethod decorator syntax.' },
  ],

  demoParams: [
    { name: 'pattern', type: 'str', hint: 'pattern: utility / namespace / vs-classmethod', input: 'text' },
  ],
  cases: [
    { id: 'utility',       label: 'utility function',    values: { pattern: 'utility' } },
    { id: 'namespace',     label: 'namespace grouping',   values: { pattern: 'namespace' } },
    { id: 'vs-classmethod',label: 'vs. classmethod',      values: { pattern: 'vs-classmethod' } },
    { id: 'no-magic',      label: 'no auto self/cls',      values: { pattern: 'no-magic' } },
  ],
  demoExplainer: 'The demo shows common staticmethod patterns. UTILITY: a helper function that logically belongs to the class but does not need class or instance state. NAMESPACE: grouping related helpers under a class for discoverability. VS-CLASSMETHOD: shows the concrete difference — staticmethod gets NO auto-argument. NO-MAGIC: emphasizes that a staticmethod is just a function that happens to live inside a class.',

  patterns: [
    {
      name: 'Utility inside a class',
      desc: 'When the function is related to the class but does not need self or cls.',
      code: 'class ImagePath:\n    def __init__(self, path):\n        self.path = path\n\n    @staticmethod\n    def valid_extension(name):\n        return name.lower().endswith((".png", ".jpg"))',
    },
    {
      name: 'Namespace grouping',
      desc: 'Discoverability — related helpers live under one class.',
      code: 'class TextUtils:\n    @staticmethod\n    def slugify(s): ...\n    @staticmethod\n    def word_count(s): ...',
    },
    {
      name: 'When you don&apos;t need the class',
      desc: 'If cls is unused, staticmethod is more honest about it than classmethod.',
      code: '# BAD:  @classmethod\n#         def add(cls, a, b): return a + b   # cls unused\n# GOOD: @staticmethod\n#         def add(a, b): return a + b',
    },
    {
      name: 'Prefer a module-level function when possible',
      desc: 'If the function has no relationship to the class beyond namespacing, module scope is often cleaner.',
      code: '# module.py\ndef slugify(s): ...\n\n# vs. class TextUtils with @staticmethod slugify',
    },
  ],

  examples: [
    { title: 'Basic use',           code: 'ImagePath.valid_extension("photo.jpg")',           returns: 'True' },
    { title: 'Via instance',        code: 'p = ImagePath("x")\np.valid_extension("y.png")',   returns: 'True  # no self passed' },
    { title: 'No auto-argument',    code: '@staticmethod\ndef greet(name): ...\ngreet("Alice")', returns: '"hi Alice"  # name is Alice, not the class' },
    { title: 'Access from class',   code: 'type(ImagePath.valid_extension)',                    returns: "<class 'function'>" },
    { title: 'Cannot access cls',    code: '# @staticmethod cannot see cls or self\n# use @classmethod if you need cls', returns: '' },
  ],

  pitfalls: [
    {
      name: 'staticmethod cannot access the class or instance',
      desc: 'This is the whole point — but new users sometimes want cls and reach for staticmethod anyway. If you need cls, use classmethod. If you need self, use a regular method.',
      wrong: { label: 'No access', code: 'class C:\n    x = 1\n    @staticmethod\n    def f(): return x   # NameError', output: "NameError: name 'x' is not defined" },
      fix:   { label: 'Use classmethod', code: '    @classmethod\n    def f(cls): return cls.x', output: 'works' },
    },
    {
      name: 'Redundant when the function does not need the class namespace',
      desc: 'If the function is not conceptually tied to the class, a module-level function is clearer. `class Utils: @staticmethod def add(a, b): ...` is a code smell — just define `def add(a, b): ...` at module level.',
      wrong: { label: 'Over-scoping', code: 'class Utils:\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nUtils.add(1, 2)', output: '3, but why the class?' },
      fix:   { label: 'Module-level',    code: 'def add(a, b):\n    return a + b\n\nadd(1, 2)', output: '3, cleaner' },
    },
    {
      name: 'Not the same as a regular def in a class body',
      desc: '`def f(x): ...` inside a class becomes an unbound function on the class. Calling `C.f(1)` works, but `C().f()` passes the instance as x. staticmethod removes that instance binding.',
      wrong: { label: 'Auto-self surprise', code: 'class C:\n    def f(x): return x\n\nC().f()', output: 'the instance passed as x' },
      fix:   { label: 'staticmethod',        code: 'class C:\n    @staticmethod\n    def f(x): return x\n\nC.f(1)', output: '1' },
    },
    {
      name: 'Called on an instance loses no information — no self anyway',
      desc: 'A staticmethod called via `instance.method(...)` works exactly the same as `Class.method(...)`. There is no implicit first argument. Prefer calling on the class for clarity.',
      wrong: { label: 'Confusing via instance', code: 'obj.static_helper(x)', output: 'works, but reads like a method' },
      fix:   { label: 'Call on class',           code: 'Class.static_helper(x)', output: 'clearer' },
    },
  ],

  when: {
    use: [
      'Utility functions logically tied to a class&apos;s namespace',
      'Helpers used inside class methods that need no state',
      'Namespacing related helpers for discoverability',
      'When you would say &quot;this belongs to the class, but not the instance&quot;',
    ],
    avoid: [
      'You need cls → classmethod',
      'You need self → regular method',
      'The function has no class relationship → module-level def',
      'You want an alternative constructor → classmethod',
    ],
  },

  notes: {
    complexity: 'O(1) descriptor invocation',
    return:     'The wrapped function, unbound',
    cpython:    'Objects/funcobject.c :: staticmethod_descr_get',
    memory:     'Small descriptor object',
    threadSafe: 'Yes for the wrapper; depends on the function',
  },

  related: [
    { name: 'classmethod', slug: 'classmethod', when: 'When you need the class as first argument' },
    { name: 'callable',    slug: 'callable',    when: 'Check whether the resulting attribute is callable' },
    { name: 'super',       slug: 'super',       when: 'Related method lookup — different mechanism' },
  ],

  faq: [
    {
      q: 'What is the difference between staticmethod and classmethod?',
      a: 'classmethod passes the CLASS as the first argument (cls). staticmethod passes NOTHING implicit. Use classmethod when you need the class (alternative constructors, subclass-aware factories). Use staticmethod when you just want a function that lives in the class namespace.',
    },
    {
      q: 'Should I use a staticmethod or a module-level function?',
      a: 'If the function has no meaningful relationship to the class, prefer module-level. If it is a helper used exclusively by that class, staticmethod is fine and improves discoverability. Do not use staticmethod just to nest things.',
    },
    {
      q: 'Can a staticmethod call other methods on the class?',
      a: 'It can, by referring to the class by name (`ImagePath.valid_extension(...)`), but that hard-codes the class and defeats subclass polymorphism. If you need the class, use classmethod.',
    },
  ],

  history: [
    { version: '2.2', note: 'staticmethod introduced with new-style classes.' },
    { version: '3.10', note: 'staticmethod became callable directly (no longer requires attribute access first).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#staticmethod',
    meta:  'staticmethod',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect utility output' },
  ],
};