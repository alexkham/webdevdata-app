// content/reference/python/stdlib/dataclasses/is_dataclass.js

export const meta = {
  slug:        'is_dataclass',
  name:        'dataclasses.is_dataclass',
  signature:   'dataclasses.is_dataclass(obj)',
  blurb:       'True for a dataclass, a subclass of one, or an instance of either — so check isinstance(obj, type) as well when you need an instance.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.7+',
  searchTerms: 'is_dataclass python dataclasses.is_dataclass check if object is dataclass instance or class is dataclass instance isinstance type generic alias asdict should be called on dataclass instances',
};

export const method = {
  slug:      'is_dataclass',
  name:      'dataclasses.is_dataclass',
  signature: 'dataclasses.is_dataclass(obj)',
  returns:   { type: 'bool', desc: 'Whether obj, or type(obj), has dataclass fields.' },

  category:    'dataclasses function',
  version:     'Python 3.7+',
  hasLiveDemo: false,

  subtitle: 'The guard for generic code that accepts anything. It answers True for the class and for its instances alike, and for subclasses even when they were not decorated themselves.',

  covers: ['is_dataclass'],

  cheat: {
    commonCall: 'is_dataclass(obj) and not isinstance(obj, type)',
    returns:    'True / False',
    replaces:   "hasattr(obj, '__dataclass_fields__')",
    watchOut:   'True for the class too — asdict(cls) still fails',
  },

  parameters: [
    { name: 'obj', type: 'object', required: true, default: null, desc: 'Any object: a class, an instance, None …' },
  ],

  patterns: [
    {
      name: 'Instance check',
      desc: 'The helper the documentation suggests.',
      code: 'from dataclasses import is_dataclass\n\ndef is_dataclass_instance(obj):\n    return is_dataclass(obj) and not isinstance(obj, type)',
    },
    {
      name: 'json default= for dataclasses',
      desc: 'Serialize dataclasses anywhere inside a structure; everything else unknown as str.',
      code: 'import json\nfrom dataclasses import asdict, is_dataclass\n\ndef default(o):\n    if is_dataclass(o) and not isinstance(o, type):\n        return asdict(o)\n    return str(o)\n\ntext = json.dumps(payload, default=default)',
    },
  ],

  examples: [
    { title: 'Class, instance, other', code: 'from dataclasses import dataclass, is_dataclass\n\n@dataclass\nclass Point:\n    x: int\n\nis_dataclass(Point), is_dataclass(Point(1)), is_dataclass(int), is_dataclass(1)', returns: '(True, True, False, False)' },
    { title: 'Instances only', code: 'from dataclasses import dataclass, is_dataclass\n\n@dataclass\nclass Point:\n    x: int\n\ndef is_dataclass_instance(obj):\n    return is_dataclass(obj) and not isinstance(obj, type)\n\nis_dataclass_instance(Point), is_dataclass_instance(Point(1))', returns: '(False, True)' },
    { title: 'Undecorated subclasses count', code: 'from dataclasses import dataclass, is_dataclass\n\n@dataclass\nclass Point:\n    x: int\n\nclass Sub(Point):\n    pass\n\nis_dataclass(Sub), is_dataclass(Sub(1)), Sub(1)', returns: '(True, True, Sub(x=1))' },
    { title: 'Generic aliases do not (3.12 syntax)', code: 'from dataclasses import dataclass, is_dataclass\n\n@dataclass\nclass Box[T]:\n    item: T\n\nis_dataclass(Box[int]), is_dataclass(Box)', returns: '(False, True)' },
    { title: 'namedtuples are not dataclasses', code: "from dataclasses import dataclass, is_dataclass\nfrom collections import namedtuple\n\nP = namedtuple('P', 'x')\nis_dataclass(P(1)), is_dataclass(None), is_dataclass(dataclass)", returns: '(False, False, False)' },
    { title: 'Serialize nested dataclasses with json', code: "import json\nfrom dataclasses import dataclass, asdict, is_dataclass\nfrom datetime import date\n\n@dataclass\nclass Event:\n    name: str\n    day: date\n\ndef default(o):\n    if is_dataclass(o) and not isinstance(o, type):\n        return asdict(o)\n    return str(o)\n\njson.dumps([Event('launch', date(2026, 10, 7))], default=default)", returns: '\'[{"name": "launch", "day": "2026-10-07"}]\'' },
  ],

  pitfalls: [
    {
      name: 'Treating every True as an instance',
      desc: 'A dataclass type passes the check too, and asdict / astuple / replace then fail on it.',
      wrong: { label: 'is_dataclass only', code: 'from dataclasses import dataclass, asdict, is_dataclass\n\n@dataclass\nclass Point:\n    x: int\n\ndef to_data(obj):\n    if is_dataclass(obj):\n        return asdict(obj)\n    return obj\n\nto_data(Point)', output: 'TypeError: asdict() should be called on dataclass instances' },
      fix:   { label: 'and not isinstance(obj, type)', code: 'from dataclasses import dataclass, asdict, is_dataclass\n\n@dataclass\nclass Point:\n    x: int\n\ndef to_data(obj):\n    if is_dataclass(obj) and not isinstance(obj, type):\n        return asdict(obj)\n    return obj\n\nto_data(Point), to_data(Point(1))', output: "(<class '__main__.Point'>, {'x': 1})" },
    },
    {
      name: 'A subclass without @dataclass',
      desc: 'is_dataclass says True because the fields are inherited, but the new annotations of an undecorated subclass are not fields: no z in __init__, the repr or fields().',
      wrong: { label: 'undecorated', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Point:\n    x: int\n\nclass Point3D(Point):\n    z: int = 0\n\nPoint3D(1), [f.name for f in fields(Point3D)]', output: "(Point3D(x=1), ['x'])" },
      fix:   { label: '@dataclass again', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Point:\n    x: int\n\n@dataclass\nclass Point3D(Point):\n    z: int = 0\n\nPoint3D(1), [f.name for f in fields(Point3D)]', output: "(Point3D(x=1, z=0), ['x', 'z'])" },
    },
  ],

  when: {
    use: [
      'Generic serializers, loggers and validators that accept arbitrary objects',
      'A guard before fields(), asdict(), astuple() or replace()',
    ],
    avoid: [
      'Checking for one specific class → isinstance(obj, Point)',
      'Telling a class from an instance — it cannot; add isinstance(obj, type)',
    ],
  },

  notes: {
    cpython:   'Lib/dataclasses.py — cls = obj if isinstance(obj, type) else type(obj); return hasattr(cls, "__dataclass_fields__")',
    'Aliases': 'Box[int] is not a class, so the check looks at type(Box[int]) — typing._GenericAlias, which has no dataclass fields: False',
  },

  related: [
    { name: 'fields()', slug: 'fields', when: 'What to call once the check passes' },
    { name: 'asdict()', slug: 'asdict', when: 'Needs an instance, not the class' },
    { name: '@dataclass', slug: 'dataclass', when: 'Decorate subclasses too' },
    { name: 'isinstance()', slug: 'isinstance', when: 'isinstance(obj, type) tells a class from an instance', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'A demo box can only send text and numbers, while is_dataclass is about what kind of object it receives: a dataclass, an instance, a subclass, a generic alias, None. Each of those has to be written as code, so the examples below show every case with fixed, verified output.',
    },
    {
      q: 'How do I check if an object is a dataclass instance?',
      a: 'dataclasses.is_dataclass(obj) and not isinstance(obj, type). is_dataclass alone is also True for the dataclass itself.',
    },
    {
      q: 'Is a subclass of a dataclass also a dataclass?',
      a: 'For is_dataclass, yes — it inherits __dataclass_fields__. But annotations added in an undecorated subclass do not become fields; decorate the subclass with @dataclass as well.',
    },
    {
      q: 'Does is_dataclass work on generic dataclasses like Box[int]?',
      a: 'No: Box[int] is a generic alias and is_dataclass returns False for it. Use typing.get_origin(alias) to get Box first.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.is_dataclass',
    meta:  'dataclasses.is_dataclass',
  },

};
