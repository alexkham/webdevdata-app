// content/reference/python/stdlib/collections/userdict.js

export const meta = {
  slug:        'userdict',
  name:        'UserDict, UserList, UserString',
  signature:   'collections.UserDict([initialdata])  ·  collections.UserList([list])  ·  collections.UserString(seq)',
  blurb:       'Wrapper classes for building your own dict-, list- and str-like types: the real data lives in .data, and every method goes through your overrides.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'userdict userlist userstring collections.UserDict collections.UserList collections.UserString subclass dict subclass list custom dict data attribute override __setitem__',
};

export const method = {
  slug:      'userdict',
  name:      'UserDict, UserList, UserString',
  signature: 'collections.UserDict([initialdata])',
  returns:   { type: 'UserDict | UserList | UserString', desc: 'An object that stores its contents in the .data attribute (a dict, list or str).' },

  category:    'collections classes',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'Subclassing dict directly has a catch: its C methods (update, the constructor, get …) do not call your __setitem__ or __getitem__. UserDict is written in Python on top of .data, so overriding one method changes them all.',

  covers: ['UserDict', 'UserList', 'UserString'],

  cheat: {
    commonCall: 'class LowerDict(UserDict): …',
    returns:    'a dict-like object backed by self.data',
    replaces:   'subclassing dict / list / str when overrides must apply everywhere',
    watchOut:   'isinstance(UserDict(), dict) is False',
  },

  parameters: [
    { name: 'initialdata', type: 'mapping | iterable', required: false, default: null, desc: 'UserDict: initial contents (copied into a new dict in .data). Keyword arguments work too.' },
    { name: 'list',        type: 'iterable',           required: false, default: null, desc: 'UserList: initial items (copied into .data).' },
    { name: 'seq',         type: 'object',             required: true,  default: null, desc: 'UserString: converted with str() into .data.' },
  ],

  attributes: [
    { name: 'data', type: 'dict | list | str', meaning: 'The real contents. Methods read and write it; you can too.' },
  ],

  patterns: [
    {
      name: 'A dict that normalises keys',
      desc: 'Override __setitem__ once — update() and the constructor use it too.',
      code: 'from collections import UserDict\nclass LowerDict(UserDict):\n    def __setitem__(self, key, value):\n        super().__setitem__(key.lower(), value)',
    },
    {
      name: 'A list that validates items',
      desc: 'UserList methods such as append go through .data; override the ones you need.',
      code: 'from collections import UserList\nclass IntList(UserList):\n    def append(self, item):\n        if not isinstance(item, int):\n            raise TypeError("ints only")\n        super().append(item)',
    },
    {
      name: 'Reach the raw data',
      desc: '.data is a plain dict / list / str.',
      code: 'plain = my_user_dict.data',
    },
  ],

  examples: [
    { title: 'Overrides apply to update() too', code: "from collections import UserDict\nclass LowerDict(UserDict):\n    def __setitem__(self, key, value):\n        super().__setitem__(key.lower(), value)\nd = LowerDict({'A': 1})\nd.update(B=2)\nd.data", returns: "{'a': 1, 'b': 2}" },
    { title: 'A dict subclass skips them',     code: "class LowerDict(dict):\n    def __setitem__(self, key, value):\n        super().__setitem__(key.lower(), value)\nd = LowerDict({'A': 1})\nd.update(B=2)\nd", returns: "{'A': 1, 'B': 2}" },
    { title: 'Not a dict instance',             code: 'from collections import UserDict\nisinstance(UserDict(), dict)', returns: 'False' },
    { title: 'But a Mapping',                   code: 'from collections import UserDict\nfrom collections.abc import MutableMapping\nisinstance(UserDict(), MutableMapping)', returns: 'True' },
    { title: 'UserList keeps a list in .data',  code: 'from collections import UserList\nul = UserList([3, 1, 2])\nul.sort()\n(ul, type(ul.data).__name__)', returns: "([1, 2, 3], 'list')" },
    { title: 'UserString methods return UserString', code: "from collections import UserString\ntype(UserString('abc').upper()).__name__", returns: "'UserString'" },
  ],

  pitfalls: [
    {
      name: 'Subclassing dict and overriding __setitem__',
      desc: "dict's own constructor and update() bypass the override, so some keys slip through unnormalised.",
      wrong: { label: 'class X(dict)',     code: "class Upper(dict):\n    def __setitem__(self, k, v):\n        super().__setitem__(k.upper(), v)\nUpper(a=1)", output: "{'a': 1}" },
      fix:   { label: 'class X(UserDict)', code: "from collections import UserDict\nclass Upper(UserDict):\n    def __setitem__(self, k, v):\n        super().__setitem__(k.upper(), v)\nUpper(a=1).data", output: "{'A': 1}" },
    },
    {
      name: 'Code that checks isinstance(x, dict)',
      desc: 'A UserDict is not a dict. Check against collections.abc.Mapping instead, or pass .data.',
      wrong: { label: 'isinstance(dict)',    code: "from collections import UserDict\nisinstance(UserDict(a=1), dict)", output: 'False' },
      fix:   { label: 'isinstance(Mapping)', code: "from collections import UserDict\nfrom collections.abc import Mapping\nisinstance(UserDict(a=1), Mapping)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Custom containers whose overridden methods must be used consistently',
      'Wrapping a dict/list/str with extra behaviour (validation, normalisation, logging)',
    ],
    avoid: [
      'Only adding new methods (not overriding) → subclass dict/list/str directly and keep isinstance(x, dict)',
      'A full custom mapping from scratch → collections.abc.MutableMapping',
    ],
  },

  notes: {
    cpython:    'Lib/collections/__init__.py — pure Python; UserDict is a MutableMapping, UserList a MutableSequence, UserString a Sequence, each delegating to self.data',
    'No demo':  'The interesting part is subclassing — class bodies with overrides — which a form input cannot express; the examples show it instead',
  },

  related: [
    { name: 'dict',   slug: 'dict',   when: 'Subclass directly when you only add methods', category: 'functions' },
    { name: 'list',   slug: 'list',   when: 'The type UserList wraps', category: 'functions' },
    { name: 'str',    slug: 'str',    when: 'The type UserString wraps', category: 'functions' },
    { name: 'super()', slug: 'super', when: 'Calling the wrapped behaviour', category: 'functions' },
    { name: 'defaultdict', slug: 'defaultdict', when: 'Default values without subclassing' },
  ],

  faq: [
    {
      q: 'Should I subclass dict or UserDict?',
      a: 'UserDict when you override methods like __setitem__ or __getitem__ and need every other method (update, setdefault, the constructor) to respect them. dict when you only add new methods — you skip the Python-level delegation and pass isinstance(x, dict).',
    },
    {
      q: 'Why does my dict subclass ignore my __setitem__?',
      a: "dict's C implementation of __init__, update() and setdefault() stores items directly without calling your override. UserDict's methods are Python code that go through __setitem__.",
    },
    {
      q: 'What is the .data attribute of UserDict?',
      a: 'The real dict that holds the contents. UserList.data is a list and UserString.data a str. You may read or replace it directly.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.UserDict',
    meta:  'UserDict objects',
  },
};
