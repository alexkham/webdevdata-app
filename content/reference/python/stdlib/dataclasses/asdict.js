// content/reference/python/stdlib/dataclasses/asdict.js

export const meta = {
  slug:        'asdict',
  name:        'dataclasses.asdict',
  signature:   'dataclasses.asdict(obj, *, dict_factory=dict)',
  blurb:       'Convert a dataclass instance to a dict of its fields — recursively: nested dataclasses become dicts, lists, tuples and dicts are rebuilt, everything else is deep-copied.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'dataclass asdict python dataclasses.asdict dataclass to dict convert dataclass to dictionary json serialize dataclass nested dataclass dict_factory deepcopy deep copy asdict should be called on dataclass instances object of type is not json serializable',
};

export const method = {
  slug:      'asdict',
  name:      'dataclasses.asdict',
  signature: 'dataclasses.asdict(obj, *, dict_factory=dict)',
  returns:   { type: 'dict', desc: "{field name: value} for every field, in field order — or whatever dict_factory builds from the (name, value) pairs." },

  category:    'dataclasses function',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'The bridge from dataclasses to json, YAML, databases and anything else that speaks dicts. It recurses through dataclasses, lists, tuples and dicts and deep-copies every other value, so the result shares no mutable objects with the instance.',

  covers: ['asdict'],

  cheat: {
    commonCall: 'json.dumps(asdict(obj))',
    returns:    "{'x': 1, 'y': 2}",
    replaces:   'hand-written to_dict() methods',
    watchOut:   'needs an instance — asdict(MyClass) raises TypeError',
  },

  parameters: [
    { name: 'obj',          type: 'dataclass instance', required: true,  default: null,   desc: 'The instance to convert. A class, or anything that is not a dataclass instance, raises TypeError.' },
    { name: 'dict_factory', type: 'callable',           required: false, default: 'dict', desc: 'Called with a list of (name, value) tuples for every dataclass converted, at every level. Use it to filter fields or build another mapping type.' },
  ],

  modes: [
    {
      id: 'nested',
      label: 'nested',
      blurb: 'A Line holds two Points. Both levels become plain dicts.',
      params: [
        { name: 'x1',    type: 'int', hint: 'start x', input: 'number' },
        { name: 'y1',    type: 'int', hint: 'start y', input: 'number' },
        { name: 'x2',    type: 'int', hint: 'end x',   input: 'number' },
        { name: 'y2',    type: 'int', hint: 'end y',   input: 'number' },
        { name: 'label', type: 'str', hint: 'label',   input: 'text' },
      ],
      template: "from dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\n@dataclass\nclass Line:\n    start: Point\n    end: Point\n    label: str = ''\n\nasdict(Line(Point({$x1}, {$y1}), Point({$x2}, {$y2}), {$label}))",
      cases: [
        { id: 'diag', label: 'diagonal', values: { x1: '0', y1: '0', x2: '3', y2: '4', label: 'diagonal' } },
        { id: 'neg',  label: 'negative', values: { x1: '-5', y1: '2', x2: '5', y2: '-2', label: '' } },
      ],
    },
    {
      id: 'copy',
      label: 'deep copy',
      blurb: 'Change the list in the dict and look at the instance: it keeps its own list.',
      params: [
        { name: 'name', type: 'str',       hint: 'user name',            input: 'text' },
        { name: 'tags', type: 'list[str]', hint: 'comma-separated tags', input: 'csv' },
      ],
      template: "from dataclasses import dataclass, asdict\n\n@dataclass\nclass User:\n    name: str\n    tags: list[str]\n\nu = User({$name}, {$tags})\nd = asdict(u)\nd['tags'].append('new')\n(u.tags, d['tags'], d['tags'] is u.tags)",
      cases: [
        { id: 'two',  label: 'two tags', values: { name: 'ann', tags: 'admin, dev' } },
        { id: 'none', label: 'no tags',  values: { name: 'bob', tags: '' } },
      ],
    },
    {
      id: 'factory',
      label: 'dict_factory',
      blurb: 'dict_factory receives the (name, value) pairs. This one drops the fields that are None — leave an input empty for None.',
      params: [
        { name: 'name',  type: 'str',        hint: 'name',                 input: 'text' },
        { name: 'email', type: 'str | None', hint: 'empty → None',         input: 'text-or-none' },
        { name: 'phone', type: 'str | None', hint: 'empty → None',         input: 'text-or-none' },
      ],
      template: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Contact:\n    name: str\n    email: str | None = None\n    phone: str | None = None\n\nc = Contact({$name}, {$email}, {$phone})\nasdict(c, dict_factory=lambda pairs: {k: v for k, v in pairs if v is not None})',
      cases: [
        { id: 'email', label: 'email only', values: { name: 'ann', email: 'ann@example.com', phone: '' } },
        { id: 'both',  label: 'both',       values: { name: 'bob', email: 'bob@example.com', phone: '555-0100' } },
        { id: 'none',  label: 'neither',    values: { name: 'eve', email: '', phone: '' } },
      ],
    },
  ],
  demoExplainer: 'In nested, every Point inside the Line became a dict of its own. In deep copy, the instance still holds the original tags after the append, and d["tags"] is u.tags is False: asdict rebuilt the list. In dict_factory, the lambda is called once with [("name", ...), ("email", ...), ("phone", ...)] and keeps only the pairs whose value is not None.',

  patterns: [
    {
      name: 'To JSON',
      desc: 'json cannot serialize dataclass instances; their asdict() it can.',
      code: 'import json\nfrom dataclasses import asdict\ntext = json.dumps(asdict(order), indent=2)',
    },
    {
      name: 'Back from a dict',
      desc: 'Flat dataclasses unpack straight into the constructor.',
      code: 'data = asdict(point)\npoint2 = Point(**data)',
    },
    {
      name: 'Skip None values',
      desc: 'dict_factory filters at every level of nesting.',
      code: 'from dataclasses import asdict\nclean = asdict(obj, dict_factory=lambda pairs: {k: v for k, v in pairs if v is not None})',
    },
    {
      name: 'Shallow instead of deep',
      desc: 'Keeps the original objects (and is much cheaper) when you do not need copies.',
      code: 'from dataclasses import fields\nrow = {f.name: getattr(obj, f.name) for f in fields(obj)}',
    },
  ],

  examples: [
    { title: 'List of nested dataclasses', code: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\n@dataclass\nclass C:\n    mylist: list[Point]\n\nasdict(C([Point(0, 0), Point(10, 4)]))', returns: "{'mylist': [{'x': 0, 'y': 0}, {'x': 10, 'y': 4}]}" },
    { title: 'Recursive structures', code: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Node:\n    value: int\n    children: list\n\nn = Node(1, [Node(2, []), Node(3, [Node(4, [])])])\nasdict(n)', returns: "{'value': 1, 'children': [{'value': 2, 'children': []}, {'value': 3, 'children': [{'value': 4, 'children': []}]}]}" },
    { title: 'dict_factory=list gives the pairs', code: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass P:\n    x: int\n    y: int\n\nasdict(P(1, 2), dict_factory=list)', returns: "[('x', 1), ('y', 2)]" },
    { title: 'Other objects are copied as they are', code: "from dataclasses import dataclass, asdict\nfrom datetime import date\n\n@dataclass\nclass Event:\n    name: str\n    day: date\n\nasdict(Event('launch', date(2026, 10, 7)))", returns: "{'name': 'launch', 'day': datetime.date(2026, 10, 7)}" },
    { title: 'A namedtuple stays a namedtuple', code: "from collections import namedtuple\nfrom dataclasses import dataclass, asdict\n\nPair = namedtuple('Pair', 'a b')\n\n@dataclass\nclass P:\n    pair: Pair\n\nasdict(P(Pair(1, 2)))", returns: "{'pair': Pair(a=1, b=2)}" },
    { title: 'Edit and rebuild', code: "from dataclasses import dataclass, asdict\n\n@dataclass\nclass P:\n    x: int\n    y: int\n\nd = asdict(P(1, 2))\nd['x'] = 10\nP(**d)", returns: 'P(x=10, y=2)' },
    { title: 'A shared list is copied twice', code: "from dataclasses import dataclass, asdict\n\n@dataclass\nclass P:\n    x: int\n    inner: list\n\nv = [1]\nd = asdict(P(1, [v, v]))\nd['inner'][0] is d['inner'][1]", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Passing the dataclass to json.dumps',
      desc: 'json only knows dicts, lists, strings, numbers, booleans and None.',
      wrong: { label: 'json.dumps(obj)', code: 'import json\nfrom dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\njson.dumps(Point(1, 2))', output: 'TypeError: Object of type Point is not JSON serializable' },
      fix:   { label: 'asdict first', code: 'import json\nfrom dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\njson.dumps(asdict(Point(1, 2)))', output: '\'{"x": 1, "y": 2}\'' },
    },
    {
      name: 'Calling it on the class',
      desc: 'asdict converts instances; the class has no field values.',
      wrong: { label: 'asdict(Point)', code: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n\nasdict(Point)', output: 'TypeError: asdict() should be called on dataclass instances' },
      fix:   { label: 'asdict(Point(1))', code: 'from dataclasses import dataclass, asdict\n\n@dataclass\nclass Point:\n    x: int\n\nasdict(Point(1))', output: "{'x': 1}" },
    },
    {
      name: 'Fields that cannot be deep-copied',
      desc: 'Locks, open files, sockets and similar objects refuse copy.deepcopy, and so asdict fails on them. Build the dict yourself and leave them out.',
      wrong: { label: 'asdict', code: "import threading\nfrom dataclasses import dataclass, asdict\n\n@dataclass\nclass Worker:\n    name: str\n    lock: threading.Lock\n\nasdict(Worker('w1', threading.Lock()))", output: "TypeError: cannot pickle '_thread.lock' object" },
      fix:   { label: 'fields() + getattr', code: "import threading\nfrom dataclasses import dataclass, fields\n\n@dataclass\nclass Worker:\n    name: str\n    lock: threading.Lock\n\nw = Worker('w1', threading.Lock())\n{f.name: getattr(w, f.name) for f in fields(w) if f.name != 'lock'}", output: "{'name': 'w1'}" },
    },
  ],

  when: {
    use: [
      'Serializing to JSON, YAML, MessagePack or a database row',
      'Comparing or logging a nested structure as plain data',
      'Getting an independent copy of all field values',
    ],
    avoid: [
      'Hot paths — the deep copy walks every nested value; a shallow comprehension over fields() is much cheaper',
      'Fields holding locks, files or connections — deepcopy fails',
      'Turning dicts back into nested dataclasses — asdict has no inverse; Cls(**d) only rebuilds the top level',
    ],
  },

  notes: {
    cpython:      'Lib/dataclasses.py _asdict_inner — dataclass instances, lists, tuples (namedtuples rebuilt with their own type) and dicts are recursed into; int, float, str, bool, None, bytes and a few other atomic types are returned as they are; everything else goes through copy.deepcopy',
    'Identity':   'Each value is copied separately: two references to one object become two independent copies',
    'Order':      'Keys follow field order, inherited fields first',
  },

  related: [
    { name: 'astuple()', slug: 'astuple', when: 'The same recursion, producing tuples' },
    { name: 'fields()', slug: 'fields', when: 'Build a shallow dict yourself' },
    { name: 'replace()', slug: 'replace', when: 'Change fields without leaving the dataclass' },
    { name: 'json.dumps', slug: 'dumps', when: 'Serialize the dict', category: 'stdlib/json' },
    { name: 'copy.deepcopy', slug: 'deepcopy', when: 'What non-container values go through', category: 'stdlib/copy' },
  ],

  faq: [
    {
      q: 'How do I convert a dataclass to a dict?',
      a: 'dataclasses.asdict(instance). Nested dataclasses, lists, tuples and dicts are converted recursively; other values are deep-copied. For a shallow dict that keeps the original objects use {f.name: getattr(obj, f.name) for f in fields(obj)}.',
    },
    {
      q: 'How do I serialize a dataclass to JSON?',
      a: 'json.dumps(asdict(obj)). Fields holding dates, Decimals or other non-JSON types still need default=str (or a custom encoder) — asdict copies them but does not convert them.',
    },
    {
      q: 'Does asdict copy the values?',
      a: 'Yes. Lists, tuples and dicts are rebuilt and every other non-atomic value goes through copy.deepcopy, so mutating the result never changes the instance.',
    },
    {
      q: 'How do I turn the dict back into a dataclass?',
      a: 'For a flat dataclass, Cls(**d). Nested dataclasses come back as dicts, so they have to be rebuilt level by level (or with a library such as dacite or pydantic).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.asdict',
    meta:  'dataclasses.asdict',
  },

};
