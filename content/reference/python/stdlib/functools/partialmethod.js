// content/reference/python/stdlib/functools/partialmethod.js

export const meta = {
  slug:        'partialmethod',
  name:        'functools.partialmethod',
  signature:   'functools.partialmethod(func, /, *args, **keywords)',
  blurb:       'partial() for methods: defined in a class body, it binds self first and then the frozen arguments — set_on = partialmethod(set_state, True).',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.4+',
  searchTerms: 'functools partialmethod partial method class body preset method arguments descriptor self bound method set_alive set_dead python partial in class',
};

export const method = {
  slug:      'partialmethod',
  name:      'functools.partialmethod',
  signature: 'functools.partialmethod(func, /, *args, **keywords)',
  returns:   { type: 'functools.partialmethod', desc: 'A descriptor; accessed on an instance it gives a callable with self, then *args, already filled in.' },

  category:    'functools class',
  version:     'Python 3.4+',
  hasLiveDemo: false,

  subtitle: 'A plain partial stored on a class is not a descriptor, so it never receives self. partialmethod is the descriptor version: self goes first, before the frozen arguments.',

  covers: ['partialmethod'],

  cheat: {
    commonCall: 'set_alive = partialmethod(set_state, True)',
    returns:    'a method: c.set_alive() calls c.set_state(True)',
    replaces:   'one-line wrapper methods that only pass a constant',
    watchOut:   'use it in a class body; outside a class use partial',
  },

  parameters: [
    { name: 'func',       type: 'callable | descriptor', required: true,  default: null, desc: 'Usually a method defined above in the same class; classmethod, staticmethod and other descriptors work too.' },
    { name: '*args',      type: 'object', required: false, default: null, desc: 'Frozen positional arguments, placed after self.' },
    { name: '**keywords', type: 'object', required: false, default: null, desc: 'Frozen keyword arguments; call-time keywords override them.' },
  ],

  patterns: [
    {
      name: 'Named variants of one method',
      desc: 'The docs example: two state setters from one method.',
      code: 'from functools import partialmethod\nclass Cell:\n    def __init__(self):\n        self._alive = False\n    def set_state(self, state):\n        self._alive = bool(state)\n    set_alive = partialmethod(set_state, True)\n    set_dead = partialmethod(set_state, False)',
    },
    {
      name: 'Preset keyword for an HTTP helper',
      desc: 'One request method, several convenience methods.',
      code: 'from functools import partialmethod\nclass Client:\n    def request(self, method, url, **kw):\n        ...\n    get = partialmethod(request, "GET")\n    post = partialmethod(request, "POST")',
    },
  ],

  examples: [
    { title: 'The docs example',       code: "from functools import partialmethod\nclass Cell:\n    def __init__(self):\n        self._alive = False\n    def set_state(self, state):\n        self._alive = bool(state)\n    set_alive = partialmethod(set_state, True)\nc = Cell()\nc.set_alive()\nc._alive", returns: 'True' },
    { title: 'self comes first',       code: "from functools import partialmethod\nclass T:\n    def show(self, *args):\n        return (type(self).__name__, args)\n    first = partialmethod(show, 'a')\nT().first('b')", returns: "('T', ('a', 'b'))" },
    { title: 'Keywords can be overridden', code: "from functools import partialmethod\nclass T:\n    def say(self, text, end='!'):\n        return text + end\n    calm = partialmethod(say, end='.')\nT().calm('hi'), T().calm('hi', end='?')", returns: "('hi.', 'hi?')" },
    { title: 'Accessed on an instance it is a partial', code: "from functools import partialmethod\nclass T:\n    def f(self, x):\n        return x\n    g = partialmethod(f, 1)\ntype(T().g).__name__", returns: "'partial'" },
  ],

  pitfalls: [
    {
      name: 'Using partial in a class body',
      desc: 'partial objects are not descriptors (yet): the instance is never passed, so the frozen argument lands in the self slot. Python 3.13 also warns: "FutureWarning: functools.partial will be a method descriptor in future Python versions; wrap it in staticmethod() if you want to preserve the old behavior".',
      wrong: { label: 'partial', code: "from functools import partial\nclass Cell:\n    def set_state(self, state):\n        self.state = state\n    set_alive = partial(set_state, True)\nCell().set_alive()", output: "TypeError: Cell.set_state() missing 1 required positional argument: 'state'" },
      fix:   { label: 'partialmethod', code: "from functools import partialmethod\nclass Cell:\n    def set_state(self, state):\n        self.state = state\n    set_alive = partialmethod(set_state, True)\nc = Cell()\nc.set_alive()\nc.state", output: 'True' },
    },
  ],

  when: {
    use: [
      'Several methods that differ only in a constant argument',
      'Building convenience methods on top of one general method',
    ],
    avoid: [
      'Outside a class → partial',
      'When the variant needs its own docstring or logic → a regular def',
    ],
  },

  notes: {
    cpython:      'Pure Python in Lib/functools.py; __get__ returns a partial bound to the instance (or delegates to the wrapped descriptor\'s __get__)',
    'Descriptors': 'func may itself be a descriptor such as classmethod or staticmethod; binding is delegated to it',
  },

  related: [
    { name: 'functools.partial', slug: 'partial',      when: 'The same idea for plain functions' },
    { name: 'functools.singledispatch / singledispatchmethod', slug: 'singledispatch', when: 'Another method-aware functools tool' },
    { name: 'classmethod',       slug: 'classmethod',  when: 'A descriptor partialmethod can wrap', category: 'functions' },
    { name: 'functools module',  slug: 'functools',    when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does functools.partial not work as a method?',
      a: 'Functions become methods through the descriptor protocol (__get__), which inserts self. partial objects do not implement it, so the instance is never passed. Use partialmethod in class bodies.',
    },
    {
      q: 'Where does self go with partialmethod?',
      a: 'First: obj.m(*more) calls func(obj, *args, *more, **keywords). The frozen positional arguments come after self.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.partialmethod',
    meta:  'functools.partialmethod',
  },
};
