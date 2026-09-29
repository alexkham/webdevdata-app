// content/reference/python/exceptions/referenceerror.js

export const meta = {
  slug:        'referenceerror',
  name:        'ReferenceError',
  signature:   'ReferenceError(*args)',
  blurb:       'Raised when you use a weakref.proxy whose target object has already been garbage-collected.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'referenceerror reference error weakly-referenced object no longer exists weakref proxy weak reference garbage collected gc dead proxy',
};

export const method = {
  slug:      'referenceerror',
  name:      'ReferenceError',
  signature: 'ReferenceError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'A weak proxy does not keep its object alive — once the last strong reference goes, every use of the proxy raises. (Not JavaScript\'s ReferenceError: an undefined name in Python is NameError.)',

  chain: ['BaseException', 'Exception', 'ReferenceError'],

  cheat: {
    raisedBy: 'attribute access, str(), ==, calls … on a weakref.proxy whose referent is gone',
    message:  'weakly-referenced object no longer exists',
    quickFix: 'keep a strong reference, or use weakref.ref and check for None',
    watchOut: 'weakref.proxy(Temp()) is dead immediately',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message; the proxy passes one fixed string.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: "watch is a weak proxy to alice's session. The dict entry is the only strong reference. Pick an entry to delete.",
      params: [{ name: 'drop', type: 'str', hint: 'alice or bob', input: 'text' }],
      template: "import gc, weakref\nclass Session:\n    def __init__(self, user):\n        self.user = user\nsessions = {'alice': Session('alice'), 'bob': Session('bob')}\nwatch = weakref.proxy(sessions['alice'])\ndel sessions[{$drop}]\ngc.collect()\nwatch.user",
      cases: [
        { id: 'bob',   label: 'drop bob',   values: { drop: 'bob' } },
        { id: 'alice', label: 'drop alice', values: { drop: 'alice' } },
        { id: 'carol', label: 'no such key', values: { drop: 'carol' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Treat a dead proxy as "gone" and fall back.',
      params: [{ name: 'drop', type: 'str', hint: 'alice or bob', input: 'text' }],
      template: "import gc, weakref\nclass Session:\n    def __init__(self, user):\n        self.user = user\nsessions = {'alice': Session('alice'), 'bob': Session('bob')}\nwatch = weakref.proxy(sessions['alice'])\ndel sessions[{$drop}]\ngc.collect()\ntry:\n    user = watch.user\nexcept ReferenceError:\n    user = 'session expired'\nuser",
      cases: [
        { id: 'bob',   label: 'drop bob',   values: { drop: 'bob' } },
        { id: 'alice', label: 'drop alice', values: { drop: 'alice' } },
      ],
    },
  ],
  demoExplainer: "Dropping bob leaves alice's Session referenced by the dict, so the proxy still works. Dropping alice removes the last strong reference; CPython frees the object at once (gc.collect() makes it certain on other implementations too) and watch.user raises. The proxy object itself still exists — it is just empty.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "The message tuple: ('weakly-referenced object no longer exists',)." },
  ],

  patterns: [
    {
      name: 'weakref.ref + None check',
      desc: 'A ref is called to get the object, and returns None when it is gone — no exception to handle.',
      code: "ref = weakref.ref(session)\n...\nobj = ref()\nif obj is None:\n    reconnect()\nelse:\n    obj.ping()",
    },
    {
      name: 'Cache that does not keep things alive',
      desc: 'WeakValueDictionary drops entries automatically when the values die — no dead proxies to trip over.',
      code: "cache = weakref.WeakValueDictionary()\ncache[key] = obj\nhit = cache.get(key)  # None once obj is gone",
    },
    {
      name: 'Back-reference to a parent',
      desc: 'Children point to their parent weakly to avoid reference cycles; the parent owns the children strongly.',
      code: "class Node:\n    def __init__(self, parent=None):\n        self.parent = weakref.proxy(parent) if parent else None\n        self.children = []",
    },
  ],

  examples: [
    { title: 'Using a dead proxy',       code: "import gc, weakref\nclass Node:\n    pass\nn = Node()\np = weakref.proxy(n)\ndel n\ngc.collect()\np.name", returns: 'ReferenceError: weakly-referenced object no longer exists' },
    { title: 'Even str() fails',          code: "import gc, weakref\nclass Node:\n    pass\nn = Node()\np = weakref.proxy(n)\ndel n\ngc.collect()\nstr(p)", returns: 'ReferenceError: weakly-referenced object no longer exists' },
    { title: 'A live proxy behaves like the object', code: "import weakref\nclass Node:\n    def __init__(self):\n        self.name = 'root'\nn = Node()\np = weakref.proxy(n)\np.name", returns: "'root'" },
    { title: 'weakref.ref returns None instead', code: "import gc, weakref\nclass Node:\n    pass\nn = Node()\nr = weakref.ref(n)\ndel n\ngc.collect()\nr() is None", returns: 'True' },
    { title: 'Proxy to a temporary is dead at once', code: "import weakref\nclass Node:\n    pass\np = weakref.proxy(Node())\np.name", returns: 'ReferenceError: weakly-referenced object no longer exists' },
    { title: 'Lists and dicts cannot be weakly referenced', code: "import weakref\nweakref.proxy([1, 2])", returns: "TypeError: cannot create weak reference to 'list' object" },
  ],

  pitfalls: [
    {
      name: 'Proxy to an object nobody else holds',
      desc: 'The proxy is the only reference, and it does not count — the object is freed on the same line it was created.',
      wrong: { label: 'Only a proxy', code: "import weakref\nclass Logger:\n    level = 'INFO'\nlog = weakref.proxy(Logger())\nlog.level", output: 'ReferenceError: weakly-referenced object no longer exists' },
      fix:   { label: 'Keep a strong reference', code: "import weakref\nclass Logger:\n    level = 'INFO'\nlogger = Logger()\nlog = weakref.proxy(logger)\nlog.level", output: "'INFO'" },
    },
    {
      name: 'A proxy is not the object',
      desc: 'The proxy forwards attribute access and operators, but it is a separate object: identity checks fail and it cannot be a dict key. weakref.ref gives back the real object.',
      wrong: { label: 'p is obj', code: "import weakref\nclass Node:\n    pass\nn = Node()\np = weakref.proxy(n)\np is n", output: 'False' },
      fix:   { label: 'ref() is obj', code: "import weakref\nclass Node:\n    pass\nn = Node()\nr = weakref.ref(n)\nr() is n", output: 'True' },
    },
  ],

  when: {
    use: [
      'Handling a proxy that may outlive its target (observers, parent back-links, caches)',
      'Raising it from your own weak-handle type when the target is gone',
    ],
    avoid: [
      'weakref.proxy when you need to test for liveness → weakref.ref and check for None',
      'Weak references as the only reference to something you still need',
    ],
  },

  notes: {
    cpython:     'Objects/weakrefobject.c — every proxy operation first checks the referent and raises ReferenceError if it is gone',
    'NameError': "JavaScript's ReferenceError (undefined variable) is NameError in Python",
    'Weakrefable': 'Instances of normal classes, functions, sets — not int, str, tuple, list or dict (their subclasses can be)',
  },

  related: [
    { name: 'NameError',      slug: 'nameerror',      when: 'Python\'s equivalent of JavaScript\'s ReferenceError' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a live proxy raises for a missing attribute' },
    { name: 'id()',           slug: 'id',             when: 'Object identity — reused after an object dies', category: 'functions' },
    { name: 'is',             slug: 'is',             when: 'Compare r() is None for a weakref.ref', category: 'operators' },
  ],

  faq: [
    {
      q: 'What does "ReferenceError: weakly-referenced object no longer exists" mean?',
      a: 'You used a weakref.proxy after the object it pointed to was garbage-collected. A weak reference does not keep an object alive; when the last normal (strong) reference goes, the object is freed and the proxy becomes empty. Keep a strong reference for as long as you need the object, or switch to weakref.ref and check whether ref() returns None.',
    },
    {
      q: 'Is Python\'s ReferenceError the same as JavaScript\'s?',
      a: "No. JavaScript raises ReferenceError for an undefined variable; Python calls that NameError (name 'x' is not defined). Python's ReferenceError is only about weak reference proxies.",
    },
    {
      q: 'Why is the object gone even though a proxy still points to it?',
      a: 'That is the purpose of weak references: they let caches, observers and back-links point to an object without extending its lifetime. In CPython an object is freed as soon as its strong reference count reaches zero; objects in reference cycles are freed when the cycle collector runs (gc.collect() forces it).',
    },
    {
      q: 'What is the difference between weakref.ref and weakref.proxy?',
      a: 'A ref is called — r() — and returns the object or None, so you check explicitly. A proxy is used like the object itself (p.attr, p.method()) and raises ReferenceError when the object is gone. Refs are hashable and can be compared; proxies are more convenient but fail by exception.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#ReferenceError',
    meta:  'Built-in exceptions',
  },
};
