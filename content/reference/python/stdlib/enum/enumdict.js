// content/reference/python/stdlib/enum/enumdict.js

export const meta = {
  slug:        'enumdict',
  name:        'enum.EnumDict',
  signature:   'enum.EnumDict(cls_name=None)',
  blurb:       'The dict an enum class body runs in: it decides which names become members, rejects reused names and reserved _sunder_ names, and resolves auto(). Public since 3.13, which also added member_names; update() already existed on the private _EnumDict.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.13+ (was the private _EnumDict)',
  searchTerms: 'EnumDict enum.EnumDict member_names update EnumDict.member_names EnumDict.update enum class namespace __prepare__ custom metaclass EnumType already defined as _sunder_ names reserved _ignore_ auto _generate_next_value_ 3.13',
};

export const method = {
  slug:      'enumdict',
  name:      'enum.EnumDict',
  signature: 'enum.EnumDict(cls_name=None)',
  returns:   { type: 'EnumDict', desc: 'A dict subclass; member_names lists the names that will become members, in order.' },

  category:    'enum class',
  version:     'Python 3.13+ (was the private _EnumDict)',
  hasLiveDemo: true,

  subtitle: 'EnumType.__prepare__ hands this dict to the class body, and every NAME = value goes through its __setitem__. That is where "already defined as" and "_sunder_ names are reserved" come from. You need it directly only when writing a custom EnumType or building enum namespaces by hand.',

  covers: ['EnumDict', 'EnumDict.member_names', 'EnumDict.update'],

  cheat: {
    commonCall: "d = EnumDict('Color'); d['RED'] = 1",
    returns:    "d.member_names → ['RED']",
    replaces:   'enum._EnumDict (private, before 3.13)',
    watchOut:   'auto() fails unless _generate_next_value_ was set — EnumType.__prepare__ does that for you',
  },

  parameters: [
    { name: 'cls_name',      type: 'str | None', required: false, default: 'None', desc: 'Name of the enum being built; needed to recognise private names (_Color__x) and nested classes, which are then not members.' },
    { name: 'member_names',  type: 'list[str]',  required: false, default: null,   desc: 'Property: a new list of the member names set so far, in order (not a live view).' },
    { name: 'update(members, **more_members)', type: 'method', required: false, default: null, desc: 'Sets each pair through __setitem__: members may be a mapping or an iterable of (name, value) pairs; keyword arguments come last.' },
  ],

  modes: [
    {
      id: 'setitem',
      label: 'which names are members',
      blurb: "RED = 1 is already set. Type another name to assign 2 to: a member, a special name, a private name, or an error?",
      params: [{ name: 'key', type: 'str', hint: 'a name', input: 'text' }],
      template: "from enum import EnumDict\nd = EnumDict('Color')\nd['RED'] = 1\nd[{$key}] = 2\n(d.member_names, dict(d))",
      cases: [
        { id: 'green',   label: 'GREEN',          values: { key: 'GREEN' } },
        { id: 'red',     label: 'RED',            values: { key: 'RED' } },
        { id: 'order',   label: '_order_',        values: { key: '_order_' } },
        { id: 'sunder',  label: '_sunder_',       values: { key: '_sunder_' } },
        { id: 'private', label: '_Color__secret', values: { key: '_Color__secret' } },
        { id: 'dunder',  label: '__doc__',        values: { key: '__doc__' } },
      ],
    },
    {
      id: 'update',
      label: 'update()',
      blurb: 'Type names separated by spaces; update() sets them in order, numbered from 1.',
      params: [{ name: 'names', type: 'str', hint: 'names', input: 'text' }],
      template: "from enum import EnumDict\nd = EnumDict('Color')\nd.update([(name, i) for i, name in enumerate({$names}.split(), 1)])\nd.member_names",
      cases: [
        { id: 'three',  label: 'RED GREEN BLUE', values: { names: 'RED GREEN BLUE' } },
        { id: 'dupe',   label: 'RED GREEN RED',  values: { names: 'RED GREEN RED' } },
        { id: 'sunder', label: 'A _b_ C',        values: { names: 'A _b_ C' } },
        { id: 'dunder', label: 'x __y__ z',      values: { names: 'x __y__ z' } },
      ],
    },
  ],
  demoExplainer: "Ordinary names become members. Reusing a member name raises TypeError with the value it already has. _order_ is one of the allowed _sunder_ names and __doc__ is a dunder: both are stored but are not members, while any other _sunder_ name is reserved (ValueError). _Color__secret is a private name of class Color — a normal attribute. update() goes through the same checks one pair at a time.",

  patterns: [
    {
      name: 'A custom metaclass that inspects the body',
      desc: 'The classdict EnumType.__new__ receives is the EnumDict from __prepare__; member_names is ready to read.',
      code: "from enum import EnumType\nclass LoggingEnumType(EnumType):\n    def __new__(metacls, cls, bases, classdict, **kwds):\n        print(cls, 'members:', classdict.member_names)\n        return super().__new__(metacls, cls, bases, classdict, **kwds)",
    },
    {
      name: 'Build a namespace by hand',
      desc: '__prepare__ gives a dict with the right _generate_next_value_, so auto() works.',
      code: "from enum import Enum, EnumType, auto\nns = EnumType.__prepare__('Color', (Enum,))\nns['RED'] = auto()\nns['GREEN'] = auto()\nColor = EnumType('Color', (Enum,), ns)",
    },
  ],

  examples: [
    { title: 'A dict that tracks member names', code: "from enum import EnumDict\nd = EnumDict('Color')\nd['RED'] = 1\nd['__doc__'] = 'Colors'\n(d.member_names, isinstance(d, dict))", returns: "(['RED'], True)" },
    { title: 'Reusing a member name',          code: "from enum import EnumDict\nd = EnumDict('Color')\nd['RED'] = 1\nd['RED'] = 2", returns: "TypeError: 'RED' already defined as 1" },
    { title: 'update(): mapping, pairs, keywords', code: "from enum import EnumDict\nd = EnumDict('Color')\nd.update({'RED': 1}, GREEN=2)\nd.update([('BLUE', 3)])\nd.member_names", returns: "['RED', 'GREEN', 'BLUE']" },
    { title: '_ignore_ names are skipped',     code: "from enum import EnumDict\nd = EnumDict('Color')\nd['_ignore_'] = 'tmp'\nd['tmp'] = 5\nd['RED'] = 1\nd.member_names", returns: "['RED']" },
    { title: 'What EnumType.__prepare__ returns', code: "from enum import Enum, EnumType, auto\nns = EnumType.__prepare__('Color', (Enum,))\nns['RED'] = auto()\nns['GREEN'] = auto()\n(type(ns).__name__, ns.member_names, ns['GREEN'])", returns: "('EnumDict', ['RED', 'GREEN'], 2)" },
    { title: 'The old private name still works', code: 'import enum\nenum._EnumDict is enum.EnumDict', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'auto() in a bare EnumDict',
      desc: 'EnumDict() does not know how to number auto() values; EnumType.__prepare__ copies _generate_next_value_ from the enum base into it.',
      wrong: { label: 'EnumDict()',           code: "from enum import EnumDict, auto\nd = EnumDict('Color')\nd['RED'] = auto()", output: "AttributeError: 'EnumDict' object has no attribute '_generate_next_value'" },
      fix:   { label: 'EnumType.__prepare__', code: "from enum import Enum, EnumType, auto\nd = EnumType.__prepare__('Color', (Enum,))\nd['RED'] = auto()\nd['RED']", output: '1' },
    },
    {
      name: 'Keeping member_names around',
      desc: 'member_names returns a new list each time, so a saved copy does not see later members.',
      wrong: { label: 'saved list', code: "from enum import EnumDict\nd = EnumDict('Color')\nd['RED'] = 1\nnames = d.member_names\nd['GREEN'] = 2\nnames", output: "['RED']" },
      fix:   { label: 'read it again', code: "from enum import EnumDict\nd = EnumDict('Color')\nd['RED'] = 1\nd['GREEN'] = 2\nd.member_names", output: "['RED', 'GREEN']" },
    },
  ],

  when: {
    use: [
      'Custom EnumType subclasses that look at or adjust the class body',
      'Creating enum classes programmatically with EnumType(name, bases, namespace)',
    ],
    avoid: [
      'Ordinary enums → a class body or the functional API',
      'Checking a finished class → Color.__members__',
    ],
  },

  notes: {
    cpython:   'Lib/enum.py: class EnumDict(dict) — __setitem__ classifies every name; _EnumDict remains as an alias',
    'Not members': 'private names (_Color__x), allowed _sunder_ names, __dunder__ names, names listed in _ignore_, nonmember() values, descriptors (functions, properties) and nested classes',
    'Checked later': `Some names pass EnumDict but fail in EnumType.__new__ — 'mro' and '' raise ValueError("invalid enum member name(s) ...") when the class is created`,
  },

  related: [
    { name: 'EnumType',  slug: 'enumtype',         when: '__prepare__ creates the EnumDict' },
    { name: 'auto',      slug: 'auto',             when: 'Resolved inside __setitem__' },
    { name: 'member / nonmember', slug: 'member-nonmember', when: 'Override the member rules' },
    { name: 'dict',      slug: 'dict',             when: 'The base class', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is enum.EnumDict?',
      a: 'The dict subclass that holds an enum class body while it runs. Its __setitem__ decides which names become members and raises the "already defined" and "_sunder_ names are reserved" errors. It became public in Python 3.13.',
    },
    {
      q: 'Why do I get TypeError: name already defined as ...?',
      a: 'A member name was assigned twice in an enum body (or a method or attribute reused a member name). Each member name may be set once; use a different name, or nonmember() for a plain attribute.',
    },
    {
      q: 'How do I get the member names before the class exists?',
      a: 'In a custom EnumType.__new__, classdict.member_names lists them in definition order. After creation use list(Color.__members__).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.EnumDict',
    meta:  'enum.EnumDict',
  },

};
