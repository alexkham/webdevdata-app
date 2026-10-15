// content/reference/python/stdlib/enum/pickle-by-name.js

export const meta = {
  slug:        'pickle-by-name',
  name:        'enum.pickle_by_enum_name / enum.pickle_by_global_name',
  signature:   '__reduce_ex__ = enum.pickle_by_enum_name · __reduce_ex__ = enum.pickle_by_global_name',
  blurb:       'Two ready-made __reduce_ex__ methods that make pickle store a member by its NAME instead of its value — useful when values are large, unpicklable or may change between versions.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.12+ (also 3.11.5+)',
  searchTerms: 'pickle_by_enum_name pickle_by_global_name enum pickle by name __reduce_ex__ pickle enum member unpickle enum value changed pickle flag combination copy deepcopy enum',
};

export const method = {
  slug:      'pickle-by-name',
  name:      'enum.pickle_by_enum_name / enum.pickle_by_global_name',
  signature: '__reduce_ex__ = enum.pickle_by_enum_name · __reduce_ex__ = enum.pickle_by_global_name',
  returns:   { type: 'tuple | str', desc: 'pickle_by_enum_name: (getattr, (EnumClass, name)). pickle_by_global_name: the member name, looked up as a global of the defining module.' },

  category:    'enum pickling',
  version:     'Python 3.12+ (also 3.11.5+)',
  hasLiveDemo: true,

  subtitle: `By default pickle saves Color.RED as "call Color(1)" — the value. Assign __reduce_ex__ = pickle_by_enum_name in the class to save "getattr(Color, 'RED')" instead, or pickle_by_global_name to save just the name for members exported to the module (global_enum). Neither suits Flag combinations.`,

  covers: ['pickle_by_enum_name', 'pickle_by_global_name'],

  cheat: {
    commonCall: 'class Color(Enum):\n    RED = 1\n    __reduce_ex__ = pickle_by_enum_name',
    returns:    "Color.RED.__reduce_ex__(4) → (getattr, (Color, 'RED'))",
    replaces:   'writing __reduce_ex__ by hand',
    watchOut:   "Flag combinations have names like 'R|W' that getattr cannot find",
  },

  parameters: [
    { name: 'self',  type: 'Enum member', required: true, default: null, desc: 'The member being pickled (these are methods; assign them as __reduce_ex__ in the class body).' },
    { name: 'proto', type: 'int',         required: true, default: null, desc: 'The pickle protocol; both functions ignore it.' },
  ],

  modes: [
    {
      id: 'byvalue',
      label: 'default: by value',
      blurb: 'Type a member name: what pickle stores by default.',
      params: [{ name: 'name', type: 'str', hint: 'a member name', input: 'text' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\nColor[{$name}].__reduce_ex__(4)',
      cases: [
        { id: 'red',   label: 'RED',   values: { name: 'RED' } },
        { id: 'green', label: 'GREEN', values: { name: 'GREEN' } },
      ],
    },
    {
      id: 'byname',
      label: 'pickle_by_enum_name',
      blurb: 'The same class, pickled by name.',
      params: [{ name: 'name', type: 'str', hint: 'a member name', input: 'text' }],
      template: 'from enum import Enum, pickle_by_enum_name\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    __reduce_ex__ = pickle_by_enum_name\nColor[{$name}].__reduce_ex__(4)',
      cases: [
        { id: 'red',   label: 'RED',   values: { name: 'RED' } },
        { id: 'green', label: 'GREEN', values: { name: 'GREEN' } },
        { id: 'bad',   label: 'BLUE',  values: { name: 'BLUE' } },
      ],
    },
    {
      id: 'flag',
      label: 'Flag by name',
      blurb: 'Type an integer. A combination is stored under a name that is not an attribute.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag, pickle_by_enum_name\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n    __reduce_ex__ = pickle_by_enum_name\nPerm({$value}).__reduce_ex__(4)',
      cases: [
        { id: 'r',    label: '4', values: { value: '4' } },
        { id: 'rw',   label: '6', values: { value: '6' } },
        { id: 'zero', label: '0', values: { value: '0' } },
      ],
    },
  ],
  demoExplainer: "__reduce_ex__ returns what pickle saves: a callable and its arguments, called again on load. By value that is Color(1); by name it is getattr(Color, 'RED'), which keeps working if RED's value changes later. For a Flag combination the name is 'R|W' — getattr(Perm, 'R|W') fails when loading — and the empty flag has no name at all (None).",

  patterns: [
    {
      name: 'Pickle by name',
      desc: 'Members survive a change of value between program versions.',
      code: 'import enum\nclass Status(enum.Enum):\n    ACTIVE = "a"\n    ARCHIVED = "x"\n    __reduce_ex__ = enum.pickle_by_enum_name',
    },
    {
      name: 'Pickle as a module global',
      desc: 'For global_enum classes whose members are module attributes anyway.',
      code: 'import enum\n@enum.global_enum\nclass Mode(enum.IntEnum):\n    FAST = 1\n    SAFE = 2\n    __reduce_ex__ = enum.pickle_by_global_name',
    },
  ],

  examples: [
    { title: 'Default: the class and the value', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED.__reduce_ex__(4)', returns: "(<enum 'Color'>, (1,))" },
    { title: 'pickle_by_enum_name',             code: 'from enum import Enum, pickle_by_enum_name\nclass Color(Enum):\n    RED = 1\n    __reduce_ex__ = pickle_by_enum_name\nColor.RED.__reduce_ex__(4)', returns: "(<built-in function getattr>, (<enum 'Color'>, 'RED'))" },
    { title: 'pickle_by_global_name',           code: 'from enum import Enum, pickle_by_global_name\nclass Color(Enum):\n    RED = 1\n    __reduce_ex__ = pickle_by_global_name\nColor.RED.__reduce_ex__(4)', returns: "'RED'" },
    { title: 'Loading calls the pair',          code: 'from enum import Enum, pickle_by_enum_name\nclass Color(Enum):\n    RED = 1\n    __reduce_ex__ = pickle_by_enum_name\nfunc, args = Color.RED.__reduce_ex__(4)\nfunc(*args) is Color.RED', returns: 'True' },
    { title: 'A real round trip (stdlib enums)', code: 'import pickle, re\nfrom http import HTTPStatus\n(pickle.loads(pickle.dumps(re.I | re.M)), pickle.loads(pickle.dumps(HTTPStatus.NOT_FOUND)) is HTTPStatus.NOT_FOUND)', returns: '(re.IGNORECASE|re.MULTILINE, True)' },
    { title: 'copy keeps the identity',         code: 'import copy\nfrom enum import Enum\nclass Color(Enum):\n    RED = 1\n(copy.copy(Color.RED) is Color.RED, copy.deepcopy(Color.RED) is Color.RED)', returns: '(True, True)' },
  ],

  pitfalls: [
    {
      name: 'By-name pickling of Flag combinations',
      desc: "A combination's name joins member names with |, and that is not an attribute of the class, so loading fails. Keep the default by-value pickling for flags.",
      wrong: { label: 'pickle_by_enum_name', code: 'from enum import Flag, pickle_by_enum_name\nclass Perm(Flag):\n    R = 4\n    W = 2\n    __reduce_ex__ = pickle_by_enum_name\nfunc, args = (Perm.R | Perm.W).__reduce_ex__(4)\nfunc(*args)', output: "AttributeError: type object 'Perm' has no attribute 'R|W'" },
      fix:   { label: 'default (by value)',  code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\nfunc, args = (Perm.R | Perm.W).__reduce_ex__(4)\nfunc(*args)', output: '<Perm.R|W: 6>' },
    },
    {
      name: 'By-value pickles after a value changes',
      desc: 'Data pickled as Color(1) cannot be loaded once RED is renumbered. By-name pickling avoids that (and by-value survives a rename instead — pick the one that matches how your enum evolves).',
      wrong: { label: 'by value', code: "from enum import Enum\nclass Color(Enum):\n    RED = 'r'\ncls, args = Color.RED.__reduce_ex__(4)\n# a later version of the program changes the value\nclass Color(Enum):\n    RED = 'red'\nColor(*args)", output: "ValueError: 'r' is not a valid Color" },
      fix:   { label: 'by name',  code: "from enum import Enum, pickle_by_enum_name\nclass Color(Enum):\n    RED = 'r'\n    __reduce_ex__ = pickle_by_enum_name\nfunc, (cls, name) = Color.RED.__reduce_ex__(4)\n# a later version of the program changes the value\nclass Color(Enum):\n    RED = 'red'\n    __reduce_ex__ = pickle_by_enum_name\nfunc(Color, name)", output: "<Color.RED: 'red'>" },
    },
  ],

  when: {
    use: [
      'Long-lived pickles of enums whose values may change (pickle_by_enum_name)',
      'Values that cannot be pickled themselves',
      'global_enum classes whose members are module attributes (pickle_by_global_name)',
    ],
    avoid: [
      'Flag and IntFlag classes — combinations have no attribute name',
      'Enums whose member names may be renamed → keep the default by-value pickling',
    ],
  },

  notes: {
    cpython:     "Lib/enum.py: pickle_by_enum_name(self, proto) returns (getattr, (self.__class__, self._name_)); pickle_by_global_name(self, proto) returns self.name. The default Enum.__reduce_ex__ returns (self.__class__, (self._value_,))",
    'Versions':  'Public since 3.12.0 and 3.11.5. 3.11.0–3.11.4 had only the private _reduce_ex_by_global_name (still an alias of pickle_by_global_name); 3.10 called it _reduce_ex_by_name',
    'Importable': 'Every pickle needs the class (or, for pickle_by_global_name, the member) to be importable from its module under the same name',
  },

  related: [
    { name: 'Enum',        slug: 'enum',        when: 'The default by-value __reduce_ex__' },
    { name: 'global_enum', slug: 'global-enum', when: 'Members as module globals' },
    { name: 'Flag',        slug: 'flag',        when: 'Why combinations need by-value pickling' },
    { name: 'getattr()',   slug: 'getattr',     when: 'What by-name loading calls', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I pickle an enum member by name instead of value?',
      a: 'Add __reduce_ex__ = enum.pickle_by_enum_name to the enum class. pickle then stores getattr(EnumClass, member_name) and looks the member up by name when loading.',
    },
    {
      q: 'Are enum members preserved by pickle and copy?',
      a: 'Yes: loading returns the existing member (Color(1) or getattr(Color, "RED")), so identity holds. copy.copy and copy.deepcopy return the member itself.',
    },
    {
      q: `Why does unpickling my Flag value fail with "has no attribute 'A|B'"?`,
      a: 'The class pickles by name (pickle_by_enum_name) and the value was a combination, whose name is not an attribute. Remove the by-name __reduce_ex__ from Flag classes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/howto/enum.html#pickling',
    meta:  'Enum HOWTO — Pickling',
  },

};
