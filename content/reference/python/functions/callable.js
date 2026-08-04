// content/reference/python/functions/callable.js

export const meta = {
  slug:        'callable',
  name:        'callable',
  signature:   'callable(object)',
  blurb:       'True if the object can be called — functions, methods, classes, and objects with __call__.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'callable check function method class lambda __call__ invokable reflection',
};

export const method = {
  slug:      'callable',
  name:      'callable',
  signature: 'callable(object)',
  returns:   { type: 'bool', desc: 'True if the object appears callable (has __call__ in its type). May return True for objects whose __call__ would raise when actually invoked — it is a surface-level check, not a guarantee that the call will succeed.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Reflection check for the &quot;can I put ()&quot; question — but not a guarantee the call will succeed.',

  cheat: {
    commonCall: 'if callable(handler):',
    returns:    'True or False',
    replaces:   '`hasattr(x, "__call__")` — but the builtin is faster and clearer',
    watchOut:   'Classes are ALWAYS callable (their constructor); instances only if they define __call__',
  },

  parameters: [
    { name: 'object', type: 'Any', required: true, default: null, desc: 'Any object. callable checks whether the type has a __call__ method — a surface-level check that does not actually try to invoke.' },
  ],

  demoParams: [
    { name: 'x', type: 'str', hint: 'a name (str/list/print/42/hello)', input: 'text' },
  ],
  cases: [
    { id: 'class-str',   label: 'str class',       values: { x: 'str' } },
    { id: 'class-list',  label: 'list class',      values: { x: 'list' } },
    { id: 'class-int',   label: 'int class',       values: { x: 'int' } },
    { id: 'builtin',     label: 'print function',  values: { x: 'print' } },
    { id: 'builtin-len', label: 'len function',    values: { x: 'len' } },
    { id: 'int-value',   label: 'integer value',   values: { x: '42' } },
    { id: 'text-value',  label: 'string value',    values: { x: 'hello' } },
    { id: 'float-value', label: 'float value',     values: { x: '3.14' } },
    { id: 'bool-value',  label: 'boolean',         values: { x: 'True' } },
    { id: 'none-value',  label: 'None',            values: { x: 'None' } },
  ],
  demoExplainer: 'The demo infers what your input REFERS to — a type/function/value — and checks whether it would be callable. Types (str, list, int) are callable because calling them constructs an instance: `str(42)` gives &quot;42&quot;. Built-in functions (print, len) are obviously callable. Instances of most built-in types (42, &quot;hello&quot;, True, None) are NOT callable — trying to call them raises TypeError.',

  patterns: [
    {
      name: 'Guard before invoking',
      desc: 'Defensive check when a callback might be missing or malformed.',
      code: 'if callable(callback):\n    callback(event)',
    },
    {
      name: 'Dispatch table validation',
      desc: 'Reject non-callable entries in a lookup table.',
      code: 'handlers = {name: h for name, h in registry.items()\n            if callable(h)}',
    },
    {
      name: 'Check for a decorator target',
      desc: 'Decorators should verify they got a callable.',
      code: 'def logged(func):\n    if not callable(func):\n        raise TypeError("must decorate a callable")\n    ...',
    },
    {
      name: 'Duck-type: has __call__ vs is callable',
      desc: 'callable is faster and more correct than the hasattr equivalent.',
      code: '# WORSE: hasattr(x, "__call__")\n# BETTER: callable(x)',
    },
  ],

  examples: [
    { title: 'Class',              code: 'callable(str)',           returns: 'True' },
    { title: 'Function',           code: 'callable(len)',           returns: 'True' },
    { title: 'Lambda',             code: 'callable(lambda x: x)',    returns: 'True' },
    { title: 'Built-in',           code: 'callable(print)',          returns: 'True' },
    { title: 'Integer value',      code: 'callable(42)',             returns: 'False' },
    { title: 'String value',       code: 'callable("hi")',           returns: 'False' },
    { title: 'None',               code: 'callable(None)',           returns: 'False' },
    { title: 'Method',             code: 'callable("hi".upper)',     returns: 'True' },
    { title: 'Custom __call__',    code: 'class C: __call__=lambda self: 1\ncallable(C())', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'callable(x) is True does NOT guarantee x() will succeed',
      desc: 'The check is surface-level — it says &quot;the type has a __call__&quot;. The actual call may still raise TypeError (wrong arity), NotImplementedError, or anything else the callable chooses.',
      wrong: { label: 'Assumed safety', code: 'if callable(func):\n    func()   # may still raise', output: 'TypeError: ... missing required arg' },
      fix:   { label: 'Try/except',      code: 'try:\n    result = func()\nexcept TypeError as e:\n    ...', output: 'catches wrong-arity' },
    },
    {
      name: 'Classes are ALWAYS callable — calling constructs an instance',
      desc: 'A class is a callable that returns a new instance. This surprises people who assume &quot;callable&quot; means &quot;function&quot;.',
      wrong: { label: 'Assumed False', code: 'callable(list)', output: 'True  # list() returns a new empty list' },
      fix:   { label: 'Read as &quot;constructor&quot;', code: 'x = list()   # calling the class constructs', output: '[]' },
    },
    {
      name: 'Instances of user classes ARE callable if the class defines __call__',
      desc: 'You can make an instance behave like a function by defining __call__. This is a common Python pattern for stateful callables — used by functools, decorators, dispatchers.',
      wrong: { label: 'Assumed uncallable',  code: 'class Counter:\n    def __call__(self):\n        return 1\n\ncallable(Counter())', output: 'True' },
      fix:   { label: 'That is the design',   code: 'c = Counter()\nc()   # 1', output: 'stateful callable' },
    },
    {
      name: 'callable was removed in Python 3.0, then reinstated in 3.2',
      desc: 'A footgun for anyone maintaining code that ran on Python 3.0 or 3.1 — the builtin was briefly removed. If your project supports those, use `hasattr(x, "__call__")`. Otherwise callable is fine.',
      wrong: { label: '3.0-3.1 issue', code: 'callable(x)   # NameError on 3.0/3.1', output: '' },
      fix:   { label: 'Portable',       code: 'hasattr(x, "__call__")', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Guarding before invoking a possibly-missing callback',
      'Filtering a registry to callable entries',
      'Validating decorator arguments',
      'Reflection code that dispatches based on &quot;is this a function?&quot;',
    ],
    avoid: [
      'You know it is callable → skip the check, catch TypeError if needed',
      'Type-based check → isinstance is more specific',
      'Surface guarantee — for actual correctness, try to call and catch errors',
      'Checking function signature → inspect.signature is the right tool',
    ],
  },

  notes: {
    complexity: 'O(1) — checks the type slot',
    return:     'bool — True or False',
    cpython:    'Python/bltinmodule.c :: builtin_callable — checks tp_call',
    memory:     'No allocation',
    threadSafe: 'Yes',
  },

  related: [
    { name: 'isinstance', slug: 'isinstance', when: 'Type-based check rather than callability check' },
    { name: 'hasattr',    slug: 'hasattr',    when: 'General attribute existence check' },
    { name: 'type',       slug: 'type',       when: 'Get the class itself' },
  ],

  faq: [
    {
      q: 'Why are classes callable?',
      a: 'Because calling a class INVOKES its constructor: `MyClass(...)` returns a new instance. Under the hood the class type has a __call__ method that runs __new__ + __init__. So classes are the ubiquitous case of &quot;callable&quot; that people forget.',
    },
    {
      q: 'Does callable check that the call would succeed?',
      a: 'No — only that the type has a __call__ method. Wrong-arity calls, calls that raise inside, or calls that check argument types will still fail. Wrap the actual call in try/except if failures are possible.',
    },
    {
      q: 'What is the difference between callable(x) and hasattr(x, &quot;__call__&quot;)?',
      a: 'Both check for __call__ on the type, but callable is a direct builtin — a few percent faster and clearer at the read site. Use callable in modern code (Python 3.2+); use hasattr for portability to 3.0 and 3.1.',
    },
  ],

  history: [
    { version: '1.0', note: 'callable() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'REMOVED in a &quot;cleanup&quot; that was widely disliked.' },
    { version: '3.2', note: 'REINSTATED — the removal was reversed by popular demand.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#callable',
    meta:  'callable',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect object data' },
  ],
};