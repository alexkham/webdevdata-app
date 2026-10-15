// content/reference/python/stdlib/dataclasses/replace.js

export const meta = {
  slug:        'replace',
  name:        'dataclasses.replace',
  signature:   'dataclasses.replace(obj, /, **changes)',
  blurb:       'A new instance of the same dataclass with some fields changed — the way to "modify" a frozen dataclass. Goes through __init__, so __post_init__ validation runs again.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+ (copy.replace support 3.13)',
  searchTerms: 'dataclass replace python dataclasses.replace copy with changes update frozen dataclass modify immutable dataclass copy.replace __replace__ with_ evolve init=False InitVar must be specified with replace replace should be called on dataclass instances unexpected keyword argument',
};

export const method = {
  slug:      'replace',
  name:      'dataclasses.replace',
  signature: 'dataclasses.replace(obj, /, **changes)',
  returns:   { type: 'same class as obj', desc: 'A new instance built by calling the class with the old field values plus the changes.' },

  category:    'dataclasses function',
  version:     'Python 3.7+ (copy.replace support 3.13)',
  hasLiveDemo: true,

  subtitle: 'replace(obj, port=9000) collects every init field of obj, overrides the ones you name and calls the class again. The original is untouched, unknown names fail exactly like a bad constructor call, and the copy is shallow.',

  covers: ['replace'],

  cheat: {
    commonCall: 'cfg = replace(cfg, port=9000)',
    returns:    'a new instance; obj is unchanged',
    replaces:   'copy.copy(obj) followed by attribute assignment — impossible on frozen instances',
    watchOut:   'shallow: mutable field values are shared with the original',
  },

  parameters: [
    { name: 'obj',       type: 'dataclass instance', required: true,  default: null, desc: 'The instance to copy (positional-only, so a field may itself be called obj). Not a dataclass instance → TypeError.' },
    { name: '**changes', type: 'field=value',        required: false, default: null, desc: 'New values by field name. init=False fields are refused; InitVar fields without a default must be given.' },
  ],

  modes: [
    {
      id: 'change',
      label: 'change fields',
      blurb: 'A frozen config, copied with two fields changed. Both objects exist afterwards.',
      params: [
        { name: 'port', type: 'int', hint: 'new port', input: 'number' },
        { name: 'host', type: 'str', hint: 'new host', input: 'text' },
      ],
      template: "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n    debug: bool = False\n\nbase = Config()\ndev = replace(base, port={$port}, host={$host})\n(base, dev)",
      cases: [
        { id: 'dev',  label: 'dev server', values: { port: '9000', host: 'dev.local' } },
        { id: 'same', label: 'no change',  values: { port: '8000', host: 'localhost' } },
      ],
    },
    {
      id: 'name',
      label: 'by name',
      blurb: 'The field name is data here. A name that is not an __init__ parameter fails in the class call.',
      params: [
        { name: 'name',  type: 'str', hint: 'field to change', input: 'text' },
        { name: 'value', type: 'any', hint: 'new value',       input: 'auto' },
      ],
      template: "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\nreplace(Config(), **{{$name}: {$value}})",
      cases: [
        { id: 'port', label: 'port',      values: { name: 'port', value: '9000' } },
        { id: 'typo', label: 'typo',      values: { name: 'prot', value: '9000' } },
        { id: 'hst',  label: 'hst',       values: { name: 'hst', value: 'example.com' } },
        { id: 'self', label: 'self',      values: { name: 'self', value: '1' } },
      ],
    },
    {
      id: 'validate',
      label: '__post_init__ again',
      blurb: 'replace calls __init__, and __init__ calls __post_init__ — so the copy is validated like any new instance.',
      params: [{ name: 'stop', type: 'int', hint: 'new stop (start is 0)', input: 'number' }],
      template: "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Range:\n    start: int\n    stop: int\n\n    def __post_init__(self):\n        if self.stop < self.start:\n            raise ValueError(f'stop {self.stop} < start {self.start}')\n\nr = Range(0, 10)\nreplace(r, stop={$stop})",
      cases: [
        { id: 'ok',  label: 'stop=5',  values: { stop: '5' } },
        { id: 'bad', label: 'stop=-1', values: { stop: '-1' } },
      ],
    },
  ],
  demoExplainer: 'In change fields, base still has port 8000 after the call. In by name, "prot" gets no suggestion — swapping two letters costs too much for the "Did you mean" search — while "hst" gets "Did you mean \'host\'?"; "self" collides with the self parameter of __init__ ("got multiple values"). In __post_init__ again, stop=-1 raises the ValueError from __post_init__, just as Range(0, -1) would.',

  patterns: [
    {
      name: 'Update a frozen instance',
      desc: 'Rebind the name to the new object.',
      code: 'from dataclasses import replace\nsettings = replace(settings, debug=True)',
    },
    {
      name: 'A with_ method',
      desc: 'A readable wrapper for the most common change.',
      code: 'from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Money:\n    amount: int\n    currency: str\n\n    def with_amount(self, amount):\n        return replace(self, amount=amount)',
    },
    {
      name: 'Generic copy.replace (3.13)',
      desc: 'Works on dataclasses, namedtuples, datetime objects and anything with __replace__.',
      code: 'import copy\nnew = copy.replace(obj, field=value)',
    },
  ],

  examples: [
    { title: 'Copy with one change', code: "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\nbase = Config()\nreplace(base, port=9000), base", returns: "(Config(host='localhost', port=9000), Config(host='localhost', port=8000))" },
    { title: 'copy.replace does the same (3.13)', code: "import copy\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\ncopy.replace(Config(), host='example.com')", returns: "Config(host='example.com', port=8000)" },
    { title: 'InitVars must be passed again', code: 'from dataclasses import dataclass, replace, InitVar\n\n@dataclass\nclass A:\n    x: int\n    scale: InitVar[int]\n\n    def __post_init__(self, scale):\n        self.x *= scale\n\nreplace(A(1, 10))', returns: "TypeError: InitVar 'scale' must be specified with replace()" },
    { title: '... and __post_init__ sees them', code: 'from dataclasses import dataclass, replace, InitVar\n\n@dataclass\nclass A:\n    x: int\n    scale: InitVar[int]\n\n    def __post_init__(self, scale):\n        self.x *= scale\n\nreplace(A(1, 10), scale=2)', returns: 'A(x=20)' },
    { title: 'init=False fields cannot be changed', code: 'from dataclasses import dataclass, replace, field\n\n@dataclass\nclass A:\n    x: int\n    y: int = field(init=False, default=0)\n\nreplace(A(1), y=5)', returns: 'TypeError: field y is declared with init=False, it cannot be specified with replace()' },
    { title: 'A field may be called obj', code: 'from dataclasses import dataclass, replace\n\n@dataclass\nclass P:\n    obj: int\n\nreplace(P(1), obj=2)', returns: 'P(obj=2)' },
    { title: 'Changes are keywords only', code: 'from dataclasses import dataclass, replace\n\n@dataclass\nclass P:\n    x: int\n\nreplace(P(1), 2)', returns: 'TypeError: replace() takes 1 positional argument but 2 were given' },
    { title: 'Only dataclass instances', code: "from dataclasses import replace\nreplace({'a': 1}, a=2)", returns: 'TypeError: replace() should be called on dataclass instances' },
  ],

  pitfalls: [
    {
      name: 'Assigning to a frozen instance',
      desc: 'frozen=True blocks assignment; build a new object and rebind the name.',
      wrong: { label: 'c.port = 9000', code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\nc = Config()\nc.port = 9000", output: "dataclasses.FrozenInstanceError: cannot assign to field 'port'" },
      fix:   { label: 'replace', code: "from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Config:\n    host: str = 'localhost'\n    port: int = 8000\n\nc = Config()\nc = replace(c, port=9000)\nc", output: "Config(host='localhost', port=9000)" },
    },
    {
      name: 'Expecting a deep copy',
      desc: 'The new instance receives the very same field objects. Mutating a list through the copy changes the original too — pass a new list for the fields you will mutate.',
      wrong: { label: 'shared list', code: 'from dataclasses import dataclass, replace\n\n@dataclass\nclass Box:\n    items: list\n\na = Box([1])\nb = replace(a)\nb.items.append(2)\na, b is a, b.items is a.items', output: '(Box(items=[1, 2]), False, True)' },
      fix:   { label: 'new list', code: 'from dataclasses import dataclass, replace\n\n@dataclass\nclass Box:\n    items: list\n\na = Box([1])\nb = replace(a, items=list(a.items))\nb.items.append(2)\na, b', output: '(Box(items=[1]), Box(items=[1, 2]))' },
    },
    {
      name: 'init=False fields are not copied',
      desc: 'They are not __init__ parameters, so the copy gets their default (or whatever __post_init__ computes), not the value the original holds.',
      wrong: { label: 'value lost', code: 'from dataclasses import dataclass, replace, field\n\n@dataclass\nclass A:\n    x: int\n    y: int = field(init=False, default=0)\n\na = A(1)\na.y = 7\nreplace(a)', output: 'A(x=1, y=0)' },
      fix:   { label: 'copy it yourself', code: 'from dataclasses import dataclass, replace, field\n\n@dataclass\nclass A:\n    x: int\n    y: int = field(init=False, default=0)\n\na = A(1)\na.y = 7\nb = replace(a)\nb.y = a.y\nb', output: 'A(x=1, y=7)' },
    },
  ],

  when: {
    use: [
      'Changing a frozen dataclass: settings, value objects, immutable state',
      'Deriving variants from a base configuration',
      'Copies that must pass the same __post_init__ validation as new instances',
    ],
    avoid: [
      'Independent copies of mutable contents → copy.deepcopy',
      'Classes with init=False fields that must survive the copy — set them again afterwards',
    ],
  },

  notes: {
    cpython:        'Lib/dataclasses.py — replace() checks for a dataclass instance and calls _replace, which fills changes with getattr(obj, name) for every init field you did not name, then returns obj.__class__(**changes). 3.13 also installs _replace as __replace__ on every dataclass, which is what copy.replace calls',
    'init=False':   'Naming one raises TypeError ("field y is declared with init=False, it cannot be specified with replace()"); the documentation says ValueError, which is what 3.12 and earlier raise; 3.13 raises TypeError',
    'ClassVar':     'ClassVar names are not fields; passing one fails in __init__ as an unexpected keyword argument',
  },

  related: [
    { name: 'copy.replace', slug: 'replace', when: 'The generic version (3.13+)', category: 'stdlib/copy' },
    { name: 'FrozenInstanceError', slug: 'frozeninstanceerror', when: 'What assignment raises instead' },
    { name: '__post_init__', slug: 'post_init', when: 'Runs again for the copy' },
    { name: 'InitVar', slug: 'initvar', when: 'Must be passed to replace() unless it has a default' },
    { name: 'copy.deepcopy', slug: 'deepcopy', when: 'Independent mutable contents', category: 'stdlib/copy' },
  ],

  faq: [
    {
      q: 'How do I change a field of a frozen dataclass?',
      a: 'You do not change it — you make a new instance: obj = dataclasses.replace(obj, field=new_value). In Python 3.13+ copy.replace(obj, field=new_value) does the same. Inside __post_init__ you can still use object.__setattr__ for derived fields.',
    },
    {
      q: 'Does dataclasses.replace call __post_init__?',
      a: 'Yes. It builds the new object by calling the class, so the generated __init__ runs and calls __post_init__. Validation therefore applies to copies, and InitVar values must be passed again.',
    },
    {
      q: 'What is the difference between dataclasses.replace and copy.replace?',
      a: 'copy.replace (Python 3.13+) is a generic function that calls the object\'s __replace__ method. Dataclasses get __replace__ automatically, so both give the same result; copy.replace also works on namedtuples, datetime objects and other classes that define __replace__.',
    },
    {
      q: 'Is dataclasses.replace a deep copy?',
      a: 'No, shallow. Unchanged fields are passed to the new instance as the same objects; a list field is shared until you pass a new list.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.replace',
    meta:  'dataclasses.replace',
  },

};
