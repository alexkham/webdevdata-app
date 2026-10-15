// content/reference/python/stdlib/enum/global-enum.js

export const meta = {
  slug:        'global-enum',
  name:        'enum.global_enum',
  signature:   '@enum.global_enum(cls, update_str=False)',
  blurb:       "A decorator that exports an enum's members into its module and makes repr() say module.NAME instead of <Class.NAME: value> — the reason re.I prints as re.IGNORECASE. Also: the three repr/str functions it installs.",
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'global_enum enum.global_enum global_enum_repr global_flag_repr global_str python enum module level constants export members to module repr re.IGNORECASE re.RegexFlag update_str calendar.MONDAY',
};

export const method = {
  slug:      'global-enum',
  name:      'enum.global_enum',
  signature: '@enum.global_enum(cls, update_str=False)',
  returns:   { type: 'EnumType', desc: 'The same class, with __repr__ (and maybe __str__) replaced; its members are now also attributes of the defining module.' },

  category:    'enum decorator',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: "For enums whose members are used as module constants (re.IGNORECASE, calendar.MONDAY): global_enum copies every member into the module's globals and installs global_enum_repr or global_flag_repr, so the repr names the module. global_str makes str() the bare member name. The three functions can also be assigned in a class body on their own.",

  covers: ['global_enum', 'global_enum_repr', 'global_flag_repr', 'global_str'],

  cheat: {
    commonCall: '@global_enum\nclass Color(IntEnum): ...',
    returns:    'repr(Color.RED) → mymodule.RED, and mymodule.RED exists',
    replaces:   'RED = Color.RED lines after the class',
    watchOut:   "the class's module must be in sys.modules when the decorator runs",
  },

  parameters: [
    { name: 'cls',        type: 'EnumType', required: true,  default: null,    desc: 'The enum class (the decorated class).' },
    { name: 'update_str', type: 'bool',     required: false, default: 'False', desc: 'Also replace __str__ with global_str for ReprEnum classes (IntEnum, StrEnum, IntFlag), whose str() otherwise stays the value. Other enums always get global_str.' },
    { name: 'global_enum_repr(self)', type: 'function', required: false, default: null, desc: "'module.NAME' — the __repr__ global_enum installs on non-flag enums." },
    { name: 'global_flag_repr(self)', type: 'function', required: false, default: null, desc: "'module.A|module.B' for combinations, 'module.Class(value)' when unnamed — for Flag classes." },
    { name: 'global_str(self)',       type: 'function', required: false, default: null, desc: "The bare member name, or 'Class(value)' when unnamed." },
  ],

  modes: [
    {
      id: 'regexflag',
      label: 're.RegexFlag',
      blurb: 'Type an integer and see how re shows it — a global_enum IntFlag with hex numbers for unknown bits.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'import re\nre.RegexFlag({$value})',
      cases: [
        { id: 'i',    label: '2',    values: { value: '2' } },
        { id: 'im',   label: '10',   values: { value: '10' } },
        { id: 'zero', label: '0',    values: { value: '0' } },
        { id: 'odd',  label: '1026', values: { value: '1026' } },
        { id: 'none', label: '1024', values: { value: '1024' } },
      ],
    },
    {
      id: 'enumrepr',
      label: 'global_enum_repr',
      blurb: 'The repr and str functions assigned in the class body (the module name is set to paint).',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: "from enum import Enum, global_enum_repr, global_str\nclass Color(Enum):\n    __module__ = 'paint'\n    RED = 1\n    GREEN = 2\n    __repr__ = global_enum_repr\n    __str__ = global_str\nm = Color({$value})\n(repr(m), str(m))",
      cases: [
        { id: 'one', label: '1', values: { value: '1' } },
        { id: 'two', label: '2', values: { value: '2' } },
        { id: 'bad', label: '3', values: { value: '3' } },
      ],
    },
    {
      id: 'flagrepr',
      label: 'global_flag_repr',
      blurb: 'The flag version: every member of a combination gets the module prefix.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: "from enum import Flag, global_flag_repr, global_str\nclass Perm(Flag):\n    __module__ = 'files'\n    R = 4\n    W = 2\n    X = 1\n    __repr__ = global_flag_repr\n    __str__ = global_str\np = Perm({$value})\n(repr(p), str(p))",
      cases: [
        { id: 'rw',   label: '6', values: { value: '6' } },
        { id: 'r',    label: '4', values: { value: '4' } },
        { id: 'zero', label: '0', values: { value: '0' } },
      ],
    },
  ],
  demoExplainer: "re.RegexFlag uses global_flag_repr, its own _numeric_repr_ = hex and KEEP: 1026 is IGNORECASE plus the unknown bit 0x400, and 1024 alone has no member at all, so it prints as re.RegexFlag(1024). With the functions in a class body, repr() uses the last part of __module__ and str() is just the member name; an unnamed flag value (0) falls back to Class(value).",

  patterns: [
    {
      name: 'Module constants backed by an enum',
      desc: 'Callers write mymodule.RED; reprs and tracebacks say mymodule.RED too.',
      code: '# mymodule.py\nfrom enum import IntEnum, global_enum\n\n@global_enum\nclass Color(IntEnum):\n    RED = 1\n    GREEN = 2\n\n# RED and GREEN are now module globals',
    },
    {
      name: 'Names in str() for an IntEnum',
      desc: 'update_str=True makes str() the member name for ReprEnum-based classes. global_enum is not a decorator factory, so call it after the class.',
      code: 'from enum import IntEnum, global_enum\n\nclass Signal(IntEnum):\n    HUP = 1\n    INT = 2\n\nglobal_enum(Signal, update_str=True)',
    },
    {
      name: 'Only the repr, no export',
      desc: 'Assign the functions yourself when the members should stay inside the class.',
      code: 'from enum import Enum, global_enum_repr\nclass Color(Enum):\n    RED = 1\n    __repr__ = global_enum_repr',
    },
  ],

  examples: [
    { title: 'How re prints its flags',        code: 'import re\n(re.I | re.M, str(re.I), re.I)', returns: "(re.IGNORECASE|re.MULTILINE, 're.IGNORECASE', re.IGNORECASE)" },
    { title: 'Members exported to the module', code: "import sys, types\nfrom enum import IntFlag, global_enum\npaint = types.ModuleType('paint')\nsys.modules['paint'] = paint\ntry:\n    @global_enum\n    class Shade(IntFlag):\n        __module__ = 'paint'\n        LIGHT = 1\n        DARK = 2\n    result = (Shade.LIGHT | Shade.DARK, paint.DARK is Shade.DARK, str(Shade.DARK))\nfinally:\n    del sys.modules['paint']\nresult", returns: "(paint.LIGHT|paint.DARK, True, '2')" },
    { title: 'update_str for IntEnum',         code: "import sys, types\nfrom enum import IntEnum, global_enum\nsys.modules['codes'] = types.ModuleType('codes')\ntry:\n    class Plain(IntEnum):\n        __module__ = 'codes'\n        OK = 200\n    class Named(IntEnum):\n        __module__ = 'codes'\n        OK = 200\n    global_enum(Plain)\n    global_enum(Named, update_str=True)\n    result = (repr(Plain.OK), str(Plain.OK), str(Named.OK))\nfinally:\n    del sys.modules['codes']\nresult", returns: "('codes.OK', '200', 'OK')" },
    { title: 'global_enum_repr and global_str by hand', code: "from enum import Enum, global_enum_repr, global_str\nclass Color(Enum):\n    __module__ = 'paint'\n    RED = 1\n    __repr__ = global_enum_repr\n    __str__ = global_str\n(repr(Color.RED), str(Color.RED), f'{Color.RED}')", returns: "('paint.RED', 'RED', 'RED')" },
    { title: 'global_flag_repr on a combination', code: "from enum import Flag, global_flag_repr\nclass Perm(Flag):\n    __module__ = 'files'\n    R = 4\n    W = 2\n    __repr__ = global_flag_repr\n(Perm.R | Perm.W, Perm(0))", returns: '(files.R|files.W, files.Perm(0))' },
  ],

  pitfalls: [
    {
      name: 'A module that is not imported',
      desc: 'global_enum writes into sys.modules[cls.__module__]. A class claiming a module that does not exist (common with the functional API and module=) fails with KeyError.',
      wrong: { label: '@global_enum',      code: "from enum import Enum, global_enum\n@global_enum\nclass Color(Enum):\n    __module__ = 'paint'\n    RED = 1", output: "KeyError: 'paint'" },
      fix:   { label: 'just the repr',     code: "from enum import Enum, global_enum_repr\nclass Color(Enum):\n    __module__ = 'paint'\n    RED = 1\n    __repr__ = global_enum_repr\nColor.RED", output: 'paint.RED' },
    },
    {
      name: 'Expecting names from str() of a global IntEnum',
      desc: 'For IntEnum, StrEnum and IntFlag global_enum only changes repr(); str() stays the value unless update_str=True.',
      wrong: { label: 'global_enum(Code)',                  code: "import sys, types\nfrom enum import IntEnum, global_enum\nsys.modules['codes'] = types.ModuleType('codes')\ntry:\n    class Code(IntEnum):\n        __module__ = 'codes'\n        OK = 200\n    result = str(global_enum(Code).OK)\nfinally:\n    del sys.modules['codes']\nresult", output: "'200'" },
      fix:   { label: 'global_enum(Code, update_str=True)', code: "import sys, types\nfrom enum import IntEnum, global_enum\nsys.modules['codes'] = types.ModuleType('codes')\ntry:\n    class Code(IntEnum):\n        __module__ = 'codes'\n        OK = 200\n    result = str(global_enum(Code, update_str=True).OK)\nfinally:\n    del sys.modules['codes']\nresult", output: "'OK'" },
    },
  ],

  when: {
    use: [
      'Library modules that expose enum members as module-level constants (like re and calendar)',
      'Replacing old module constants with an enum without changing how callers spell them',
    ],
    avoid: [
      'Ordinary application enums — module globals named after members are easy to shadow',
      'Classes defined in __main__ scripts: the members land in the script globals',
    ],
  },

  notes: {
    cpython:      "Lib/enum.py: global_enum sets __repr__ to global_flag_repr (Flag subclasses) or global_enum_repr, sets __str__ to global_str unless the class is a ReprEnum (or update_str=True), then runs sys.modules[cls.__module__].__dict__.update(cls.__members__)",
    'Module name': 'Only the last dotted part of __module__ is shown: a class from pkg.colors prints as colors.RED',
    'Unknown bits': "global_flag_repr leaves numeric parts of a KEEP flag's name unprefixed: re.IGNORECASE|0x400",
  },

  related: [
    { name: 're flags',  slug: 'flags',   when: 're.RegexFlag uses global_enum', category: 'stdlib/re' },
    { name: 'IntFlag',   slug: 'intflag', when: 'The usual base for global flags' },
    { name: 'ReprEnum',  slug: 'reprenum', when: 'Why update_str exists' },
    { name: 'global',    slug: 'global',  when: 'Module globals', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why does re.IGNORECASE print as re.IGNORECASE and not <RegexFlag.IGNORECASE: 2>?',
      a: 're.RegexFlag is decorated with @enum.global_enum, which replaces the repr with global_flag_repr: module name plus member name, joined with | for combinations.',
    },
    {
      q: 'How do I export enum members as module-level constants?',
      a: "Decorate the class with @enum.global_enum. It adds every member (aliases included) to the defining module's globals and changes repr() to module.NAME.",
    },
    {
      q: 'What is update_str in global_enum?',
      a: "For IntEnum, StrEnum and IntFlag, str() normally stays the plain value. global_enum(cls, update_str=True) switches str() to global_str, the member name.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.global_enum',
    meta:  'enum.global_enum',
  },

};
