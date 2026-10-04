// content/reference/python/stdlib/copy/error.js

export const meta = {
  slug:        'error',
  name:        'copy.Error',
  signature:   'copy.Error',
  blurb:       'The copy module’s own exception — raised only for objects that offer no way at all to be copied. Most uncopyable objects raise TypeError instead.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: false,
  version:     'All Python versions',
  searchTerms: 'copy.Error copy.error copy module exception un(shallow)copyable object un(deep)copyable object cannot copy object python copy error cannot pickle typeerror',
};

export const method = {
  slug:      'error',
  name:      'copy.Error',
  signature: 'copy.Error',

  category:    'copy exception',
  version:     'All Python versions',
  hasLiveDemo: false,

  subtitle: 'copy.copy and copy.deepcopy raise copy.Error only when an object has no __copy__/__deepcopy__, no copyreg entry, and both __reduce_ex__ and __reduce__ are missing or None. Everyday failures — modules, locks, files, generators — come from the pickle protocol as TypeError.',

  covers: ['Error'],

  chain: ['BaseException', 'Exception', 'Error'],

  cheat: {
    raisedBy: 'copy.copy(obj), copy.deepcopy(obj) when obj disables every copy hook',
    message:  "un(shallow)copyable object of type <class '...'>",
    quickFix: 'Give the class __copy__ / __deepcopy__, or stop setting __reduce_ex__ to None',
    watchOut: 'Catch TypeError too: that is what most uncopyable objects raise',
  },

  examples: [
    { title: 'Shallow copy of a class with no hooks', code: 'import copy\nclass Sealed:\n    __reduce_ex__ = None\n    __reduce__ = None\ncopy.copy(Sealed())', returns: "copy.Error: un(shallow)copyable object of type <class '__main__.Sealed'>" },
    { title: 'Deep copy says "deep"',               code: 'import copy\nclass Sealed:\n    __reduce_ex__ = None\n    __reduce__ = None\ncopy.deepcopy(Sealed())', returns: "copy.Error: un(deep)copyable object of type <class '__main__.Sealed'>" },
    { title: 'copy.error is the same class',        code: 'import copy\ncopy.error is copy.Error', returns: 'True' },
    { title: 'It is a plain Exception subclass',    code: 'import copy\ncopy.Error.__mro__', returns: "(<class 'copy.Error'>, <class 'Exception'>, <class 'BaseException'>, <class 'object'>)" },
    { title: 'Modules raise TypeError, not copy.Error', code: 'import copy, math\ncopy.deepcopy(math)', returns: "TypeError: cannot pickle 'module' object" },
  ],

  pitfalls: [
    {
      name: 'Catching only copy.Error',
      desc: 'Locks, files, generators and modules fail inside the pickle protocol with TypeError, which except copy.Error does not catch.',
      wrong: { label: 'except copy.Error', code: "import copy, threading\ntry:\n    copy.deepcopy(threading.Lock())\nexcept copy.Error:\n    result = 'not copyable'\nresult", output: "TypeError: cannot pickle '_thread.lock' object" },
      fix:   { label: 'except (copy.Error, TypeError)', code: "import copy, threading\ntry:\n    copy.deepcopy(threading.Lock())\nexcept (copy.Error, TypeError):\n    result = 'not copyable'\nresult", output: "'not copyable'" },
    },
  ],

  patterns: [
    {
      name: 'Copy if possible',
      desc: 'Fall back to sharing the object when it cannot be copied.',
      code: 'import copy\ntry:\n    value = copy.deepcopy(value)\nexcept (copy.Error, TypeError):\n    pass  # keep the shared reference',
    },
    {
      name: 'Forbid copying on purpose',
      desc: 'Raise a clear error from the hooks instead of relying on copy.Error.',
      code: 'class Connection:\n    def __copy__(self):\n        raise TypeError("Connection objects cannot be copied")\n    __deepcopy__ = lambda self, memo: self.__copy__()',
    },
  ],

  when: {
    use: [
      'Catching it together with TypeError around copy/deepcopy of arbitrary objects',
    ],
    avoid: [
      'Raising it from your own code → raise TypeError with a clear message',
    ],
  },

  notes: {
    cpython:    'class Error(Exception) in Lib/copy.py, with error = Error kept as a backward-compatible alias; raised at the end of the __reduce_ex__ / __reduce__ fallback chain',
    'Message':  '"un(shallow)copyable object of type %s" from copy(), "un(deep)copyable object of type %s" from deepcopy(), formatted with the class',
  },

  related: [
    { name: 'copy.copy',     slug: 'copy',     when: 'Shallow copy' },
    { name: 'copy.deepcopy', slug: 'deepcopy', when: 'Deep copy' },
    { name: 'TypeError',     slug: 'typeerror', when: 'What most uncopyable objects raise', category: 'exceptions' },
    { name: 'copy module',   slug: 'copy',     when: 'Shallow vs deep overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'When does Python raise copy.Error?',
      a: 'Only when copy() or deepcopy() finds no copy mechanism at all: no __copy__/__deepcopy__, no copyreg registration, and __reduce_ex__ and __reduce__ both missing or None. Normal classes always inherit __reduce_ex__ from object, so in practice this is rare.',
    },
    {
      q: 'Why does copying my object raise TypeError: cannot pickle?',
      a: 'copy falls back to the pickle protocol for types it does not know. Objects such as locks, open files, sockets, generators and modules refuse to be pickled, and that TypeError propagates. Define __copy__/__deepcopy__ to skip or recreate those attributes.',
    },
    {
      q: 'What is copy.error (lowercase)?',
      a: 'An old alias of copy.Error kept for backward compatibility — copy.error is copy.Error. It is not listed in copy.__all__.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/copy.html#copy.Error',
    meta:  'copy.Error',
  },
};
