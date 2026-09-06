// content/reference/python/functions/type-mro.js
//
// Doc-only page: the demo harness coerces inputs to strings and numbers, so
// a CLASS cannot be expressed as a demo argument honestly.

export const meta = {
  slug:        'type-mro',
  name:        'type.mro',
  signature:   'type.mro(cls)',
  blurb:       'The method resolution order — the exact chain Python searches for an attribute.',
  category:    'type',
  type:        'type',
  hasLiveDemo: false,
  version:     'Python 2.2+',
  searchTerms: 'mro method resolution order inheritance c3 linearization super diamond multiple bases',
};

export const method = {
  slug:      'type-mro',
  name:      'type.mro',
  signature: 'type.mro(cls)',
  returns:   { type: 'list', desc: 'A list of classes, starting with cls itself and ending with object, in the order Python searches them for attributes.' },

  category:    'Type method',
  version:     'Python 2.2+',
  hasLiveDemo: false,

  subtitle: 'The definitive answer to "which method actually runs?". Computed by the C3 linearization, and the thing to read first when multiple inheritance behaves strangely.',

  cheat: {
    commonCall: 'SomeClass.mro()',
    returns:    'list of classes, most-derived first, object last',
    replaces:   'guessing which base class wins an attribute lookup',
    watchOut:   'cls.mro() and cls.__mro__ differ — one is a fresh list, the other a cached tuple',
  },

  parameters: [
    { name: 'cls', type: 'type', required: true, default: null, desc: 'The class whose resolution order you want. Normally supplied implicitly by calling SomeClass.mro().' },
  ],

  examples: [
    { title: 'Simple type',      code: 'int.mro()',    returns: "[<class 'int'>, <class 'object'>]" },
    { title: 'bool inherits int',code: 'bool.mro()',   returns: "[<class 'bool'>, <class 'int'>, <class 'object'>]" },
    { title: 'The root',         code: 'object.mro()', returns: "[<class 'object'>]" },
    { title: 'Explicit form',    code: 'type.mro(bool)', returns: "[<class 'bool'>, <class 'int'>, <class 'object'>]" },
    { title: 'Cached tuple',     code: 'bool.__mro__', returns: "(<class 'bool'>, <class 'int'>, <class 'object'>)" },
    { title: 'Just the names',   code: '[c.__name__ for c in bool.mro()]', returns: "['bool', 'int', 'object']" },
  ],

  pitfalls: [
    {
      name: 'mro() is a method, __mro__ is an attribute',
      desc: 'They hold the same information in different containers: mro() builds a fresh LIST on each call, __mro__ is the cached TUPLE. Comparing one to the other with == always fails.',
      wrong: { label: 'Never equal', code: 'bool.mro() == bool.__mro__', output: 'False  # list vs tuple' },
      fix:   { label: 'Compare like with like', code: 'tuple(bool.mro()) == bool.__mro__', output: 'True' },
    },
    {
      name: 'Only classes have it',
      desc: 'mro lives on the metaclass, so it exists on a class but not on an instance. Calling it on an object is an AttributeError.',
      wrong: { label: 'Instance has none', code: 'True.mro()', output: "AttributeError: 'bool' object has no attribute 'mro'" },
      fix:   { label: 'Ask the type',      code: 'type(True).mro()', output: "[<class 'bool'>, <class 'int'>, <class 'object'>]" },
    },
    {
      name: 'Some inheritance orders are impossible',
      desc: 'C3 linearization cannot always produce a consistent order. When bases conflict, the class fails to be created at all — at definition time, not on first use.',
      wrong: { label: 'Cannot linearize', code: 'class A: pass\nclass B(A): pass\nclass C(A, B): pass', output: 'TypeError: Cannot create a consistent method resolution order (MRO) for bases A, B' },
      fix:   { label: 'Most derived first', code: 'class C(B, A): pass', output: 'fine' },
    },
    {
      name: 'super() follows the MRO, not the base list',
      desc: 'super() walks the MRO of the INSTANCE\'s type, which may include classes the current class never named. This is why cooperative multiple inheritance works, and why it surprises people.',
      wrong: { label: 'Assumed parent', code: 'super().method()   # "calls my base"', output: 'calls the next class in the instance MRO' },
      fix:   { label: 'Read the order',  code: 'type(self).mro()', output: 'shows exactly who is next' },
    },
  ],

  when: {
    use: [
      'Debugging which implementation an attribute lookup finds',
      'Understanding cooperative super() chains in multiple inheritance',
      'Diagnosing a "cannot create a consistent MRO" TypeError',
      'Introspection tools, plugin systems and framework internals',
    ],
    avoid: [
      'Single inheritance, where the answer is obvious',
      'You want the immediate parents only → cls.__bases__',
      'You want instance attributes → vars or dir',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of ancestors; the result is cached as __mro__',
    return:     'A new list on every call, so mutating it does nothing to the class',
    cpython:    'Objects/typeobject.c :: mro_implementation, implementing C3 linearization',
    memory:     'Allocates a fresh list each call; __mro__ is the shared tuple',
    threadSafe: 'Yes for reading — the MRO is fixed once the class is created',
  },

  related: [
    { name: 'type',       slug: 'type',       when: 'Get the class of an instance before asking for its MRO' },
    { name: 'super',      slug: 'super',      when: 'The mechanism that actually walks this order' },
    { name: 'isinstance', slug: 'isinstance', when: 'Ask whether a value is an instance, without the full chain' },
    { name: 'issubclass', slug: 'issubclass', when: 'Ask about a relationship between two classes' },
  ],

  faq: [
    {
      q: 'What is C3 linearization?',
      a: 'The algorithm Python uses to flatten an inheritance graph into one ordered list. It guarantees that a class always appears before its bases, and that the relative order of bases is preserved. When both rules cannot hold at once, the class definition fails with a TypeError.',
      code: 'bool.mro()\n# [bool, int, object]',
    },
    {
      q: 'Why does super() not call the class I named as a base?',
      a: 'Because super() advances to the next class in the MRO of the instance\'s actual type, which depends on the whole inheritance graph — not just the class you are writing. In a diamond, that may be a sibling branch rather than your direct parent.',
      code: 'type(self).mro()   # shows the real order',
    },
    {
      q: 'Should I use mro() or __mro__?',
      a: '__mro__ for reading, since it is the cached tuple and costs nothing. mro() is a method that rebuilds the list, and it exists mainly so metaclasses can override how the order is computed.',
      code: 'bool.__mro__\n# (bool, int, object)',
    },
  ],

  history: [
    { version: '2.2', note: 'New-style classes introduced the MRO, initially with a depth-first order.' },
    { version: '2.3', note: 'Switched to C3 linearization, giving the consistent order used today.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#class.mro',
    meta:  'type.mro',
  },

  tryInTool: [],
};
