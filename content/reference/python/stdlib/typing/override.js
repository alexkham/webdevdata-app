// content/reference/python/stdlib/typing/override.js

export const meta = {
  slug:        'override',
  name:        'typing.override',
  signature:   '@override',
  blurb:       'Mark a method as overriding one in a base class, so the type checker reports it when nothing is overridden — after a rename in the base class, or a typo. At runtime it only sets __override__ = True.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.12+',
  searchTerms: 'typing.override override decorator method overrides base class __override__ pep 698 renamed method typo subclass java @Override',
};

export const method = {
  slug:      'override',
  name:      'typing.override',
  signature: '@override',
  returns:   { type: 'the decorated object', desc: 'The same function, with __override__ = True set on it when the object accepts attributes.' },

  category:    'typing decorator',
  version:     'Python 3.12+',
  hasLiveDemo: false,

  subtitle: 'If the base class renames log_status() to log(), every subclass that still defines log_status() silently stops overriding anything. With @override on those methods, the type checker flags them. Python does not: a misnamed @override method runs like any other method.',

  covers: ['override'],

  cheat: {
    commonCall: 'class Sub(Base):\n    @override\n    def log_status(self) -> None: ...',
    returns:    'the method itself; Sub.log_status.__override__ is True',
    replaces:   'Comments like "# overrides Base.log_status"',
    watchOut:   'Put @override below @property / @classmethod, directly on the function',
  },

  parameters: [],

  patterns: [
    {
      name: 'Mark every overriding method',
      desc: 'Type checkers can then be told to require @override on all overrides (strict mode in some checkers).',
      code: 'from typing import override\n\nclass Base:\n    def save(self) -> None: ...\n\nclass Cached(Base):\n    @override\n    def save(self) -> None:\n        super().save()',
    },
    {
      name: 'With property and classmethod',
      desc: '@override goes closest to the def, so the function object gets the attribute.',
      code: 'from typing import override\n\nclass Base:\n    @property\n    def name(self) -> str:\n        return "base"\n\nclass Sub(Base):\n    @property\n    @override\n    def name(self) -> str:\n        return "sub"',
    },
    {
      name: 'Find overrides at runtime',
      desc: 'Linters and frameworks can read the marker.',
      code: 'def overrides(cls: type) -> list[str]:\n    return [n for n, v in vars(cls).items() if getattr(v, "__override__", False)]',
    },
  ],

  examples: [
    { title: 'Sets __override__', code: 'from typing import override\nclass Base:\n    def log(self):\n        return "base"\nclass Sub(Base):\n    @override\n    def log(self):\n        return "sub"\n(Sub().log(), Sub.log.__override__)', returns: "('sub', True)" },
    { title: 'Base methods are not marked', code: 'from typing import override\nclass Base:\n    def log(self):\n        return "base"\nclass Sub(Base):\n    @override\n    def log(self):\n        return "sub"\ngetattr(Base.log, "__override__", False)', returns: 'False' },
    { title: 'Nothing is checked at runtime', code: 'from typing import override\nclass Base:\n    pass\nclass Sub(Base):\n    @override\n    def done(self):\n        return "overrides nothing"\nSub().done()', returns: "'overrides nothing'" },
    { title: 'Below @property, the getter is marked', code: 'from typing import override\nclass Sub:\n    @property\n    @override\n    def x(self):\n        return 1\nSub.x.fget.__override__', returns: 'True' },
    { title: 'List the overrides of a class', code: 'from typing import override\nclass Base:\n    def a(self): ...\n    def b(self): ...\nclass Sub(Base):\n    @override\n    def a(self): ...\n    def c(self): ...\n[n for n, v in vars(Sub).items() if getattr(v, "__override__", False)]', returns: "['a']" },
  ],

  pitfalls: [
    {
      name: '@override above @property',
      desc: 'A property object does not accept new attributes, so override() leaves it unmarked — silently.',
      wrong: { label: '@override on top', code: 'from typing import override\nclass Sub:\n    @override\n    @property\n    def x(self):\n        return 1\ngetattr(Sub.x, "__override__", False), getattr(Sub.x.fget, "__override__", False)', output: '(False, False)' },
      fix:   { label: '@override on the def', code: 'from typing import override\nclass Sub:\n    @property\n    @override\n    def x(self):\n        return 1\nSub.x.fget.__override__', output: 'True' },
    },
    {
      name: 'A misspelled override runs the base method',
      desc: 'Python happily adds a new method; callers keep getting the base behaviour. Only the type checker, seeing @override, can tell you.',
      wrong: { label: 'typo', code: 'from typing import override\nclass Base:\n    def get_name(self):\n        return "base"\nclass Sub(Base):\n    @override\n    def get_nmae(self):\n        return "sub"\nSub().get_name()', output: "'base'" },
      fix:   { label: 'correct name', code: 'from typing import override\nclass Base:\n    def get_name(self):\n        return "base"\nclass Sub(Base):\n    @override\n    def get_name(self):\n        return "sub"\nSub().get_name()', output: "'sub'" },
    },
  ],

  when: {
    use: [
      'Every method meant to override a base-class method, especially in large hierarchies',
      'Framework hooks (setUp, save, dispatch …) whose names must match exactly',
    ],
    avoid: [
      'Expecting a runtime error for a non-overriding method → only type checkers report it',
      'Python 3.11 and older → typing_extensions.override',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: override() sets __override__ = True and returns the argument; objects that refuse attributes are returned unchanged without an error',
    'Checkers':  'The docs say type checkers should report an @override method that overrides nothing',
    'Versions':  'Added in 3.12 (PEP 698)',
  },

  related: [
    { name: 'Final / @final', slug: 'final', when: 'The opposite: must not be overridden' },
    { name: 'super()', slug: 'super', when: 'Call the overridden method', category: 'functions' },
    { name: 'class', slug: 'class', when: 'Inheritance basics', category: 'keywords' },
    { name: 'typing module', slug: 'typing', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: '@override decorates a method in a class you write; its only runtime effect is the __override__ attribute, and the error it enables comes from a type checker, which the page cannot run. A demo box can only send text and numbers, so the examples below define the classes in code and show the verified results.',
    },
    {
      q: 'What does @override do in Python?',
      a: 'It tells type checkers that the method is meant to override a base-class method, so they report an error if it overrides nothing. At runtime it only sets the attribute __override__ = True (Python 3.12+).',
    },
    {
      q: 'Does Python check @override at runtime?',
      a: 'No. A method decorated with @override that overrides nothing runs normally. Run a type checker to get the error.',
    },
    {
      q: 'How do I use @override with @property or @classmethod?',
      a: 'Put @override directly above the def, under @property or @classmethod. Above them, override() receives the property or classmethod object instead of the function: a property refuses the new attribute, so nothing is marked (silently), and on a classmethod the attribute lands on the wrapper object, where Sub.m.__override__ does not find it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.override',
    meta:  'typing.override',
  },

};
