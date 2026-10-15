// content/reference/python/stdlib/dataclasses/dataclass.js

export const meta = {
  slug:        'dataclass',
  name:        'dataclasses.dataclass',
  signature:   '@dataclasses.dataclass(*, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False)',
  blurb:       'The class decorator: reads the annotated fields and adds __init__, __repr__ and __eq__ — plus ordering, hashing, frozen attributes, keyword-only parameters and __slots__ when asked.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.7+ (match_args, kw_only, slots 3.10; weakref_slot 3.11)',
  searchTerms: 'dataclass decorator @dataclass python dataclasses.dataclass parameters init repr eq order unsafe_hash frozen match_args kw_only slots weakref_slot sortable dataclass hashable dataclass immutable dataclass frozen=True order=True slots=True kw_only=True __match_args__ __hash__ __slots__ cannot overwrite attribute total_ordering eq must be true if order is true',
};

export const method = {
  slug:      'dataclass',
  name:      'dataclasses.dataclass',
  signature: '@dataclasses.dataclass(*, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False)',
  returns:   { type: 'type', desc: 'The same class with the methods added — or, with slots=True, a new class that replaces it.' },

  category:    'dataclasses decorator',
  version:     'Python 3.7+ (match_args, kw_only, slots 3.10; weakref_slot 3.11)',
  hasLiveDemo: true,

  subtitle: 'Every class attribute with a type annotation becomes a field, in definition order. The decorator writes the methods those fields imply; each keyword switches one method family on or off. @dataclass, @dataclass() and @dataclass with every default spelled out are the same thing.',

  covers: ['dataclass'],

  cheat: {
    commonCall: '@dataclass(frozen=True, slots=True)',
    returns:    'the class, with __init__, __repr__, __eq__ (and more) generated',
    replaces:   'hand-written __init__ / __repr__ / __eq__ boilerplate',
    watchOut:   'a method you define yourself wins — except __lt__ & co. with order=True, __setattr__ / __delattr__ with frozen=True and __hash__ with unsafe_hash=True, which raise TypeError',
  },

  parameters: [
    { name: 'init',         type: 'bool', required: false, default: 'True',  desc: 'Generate __init__ with one parameter per field (init=True fields only). Ignored if the class defines __init__ itself.' },
    { name: 'repr',         type: 'bool', required: false, default: 'True',  desc: 'Generate __repr__: ClassName(field=repr(value), ...) for every field with repr=True. Ignored if the class defines __repr__.' },
    { name: 'eq',           type: 'bool', required: false, default: 'True',  desc: 'Generate __eq__ comparing the compare=True fields — only against an instance of exactly the same class, otherwise NotImplemented. Ignored if the class defines __eq__.' },
    { name: 'order',        type: 'bool', required: false, default: 'False', desc: 'Generate __lt__, __le__, __gt__, __ge__ comparing the fields as tuples. Needs eq=True (ValueError otherwise); TypeError if the class already defines any of the four.' },
    { name: 'unsafe_hash',  type: 'bool', required: false, default: 'False', desc: 'Force a field-based __hash__ even though instances are mutable. TypeError if the class defines __hash__ explicitly.' },
    { name: 'frozen',       type: 'bool', required: false, default: 'False', desc: 'Generate __setattr__ and __delattr__ that raise FrozenInstanceError. With eq=True this also generates __hash__. TypeError if the class defines either method.' },
    { name: 'match_args',   type: 'bool', required: false, default: 'True',  desc: 'Set __match_args__ to the names of the positional __init__ parameters, so case Point(x, y) works. Not set if the class already has __match_args__. (3.10+)' },
    { name: 'kw_only',      type: 'bool', required: false, default: 'False', desc: 'Make every field keyword-only in __init__ (and leave them out of __match_args__). (3.10+)' },
    { name: 'slots',        type: 'bool', required: false, default: 'False', desc: 'Add __slots__ for the fields and return a NEW class built with them: no per-instance __dict__, no new attributes. TypeError if the class defines __slots__ itself. (3.10+)' },
    { name: 'weakref_slot', type: 'bool', required: false, default: 'False', desc: 'With slots=True, also add a __weakref__ slot so instances can be weakly referenced. TypeError without slots=True. (3.11+)' },
  ],

  modes: [
    {
      id: 'generated',
      label: 'generated methods',
      blurb: 'Two fields, one with a default. The values go straight into the generated __init__ — annotations are not checked, so text works too.',
      params: [
        { name: 'x', type: 'int (any value)', hint: 'first field',  input: 'auto' },
        { name: 'y', type: 'int (any value)', hint: 'second field', input: 'auto' },
      ],
      template: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int = 0\n\np = Point({$x}, {$y})\n(p, p == Point(1, 2), Point({$x}))',
      cases: [
        { id: 'ints',  label: '1, 2',      values: { x: '1', y: '2' } },
        { id: 'float', label: '1.5, -3',   values: { x: '1.5', y: '-3' } },
        { id: 'text',  label: 'text',      values: { x: 'a', y: 'b' } },
      ],
    },
    {
      id: 'order',
      label: 'order=True',
      blurb: 'Comparison goes field by field like a tuple: priority first, the name only breaks ties.',
      params: [
        { name: 'a_priority', type: 'int', hint: 'task a: priority', input: 'number' },
        { name: 'a_name',     type: 'str', hint: 'task a: name',     input: 'text' },
        { name: 'b_priority', type: 'int', hint: 'task b: priority', input: 'number' },
        { name: 'b_name',     type: 'str', hint: 'task b: name',     input: 'text' },
      ],
      template: 'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Task:\n    priority: int\n    name: str\n\na = Task({$a_priority}, {$a_name})\nb = Task({$b_priority}, {$b_name})\n(a < b, sorted([b, a]))',
      cases: [
        { id: 'prio', label: 'by priority',  values: { a_priority: '1', a_name: 'write', b_priority: '2', b_name: 'deploy' } },
        { id: 'tie',  label: 'tie → name',   values: { a_priority: '3', a_name: 'test', b_priority: '3', b_name: 'build' } },
        { id: 'same', label: 'equal',        values: { a_priority: '0', a_name: 'x', b_priority: '0', b_name: 'x' } },
      ],
    },
    {
      id: 'frozen',
      label: 'frozen=True',
      blurb: 'frozen=True plus the default eq=True generates __hash__, so instances work as dict keys. Look up a point by value.',
      params: [
        { name: 'x', type: 'float', hint: 'x', input: 'float' },
        { name: 'y', type: 'float', hint: 'y', input: 'float' },
      ],
      template: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\nnames = {Point(0, 0): 'origin', Point(1, 2): 'home'}\nnames.get(Point({$x}, {$y}), 'unknown')",
      cases: [
        { id: 'home',   label: '1.0, 2.0',   values: { x: '1', y: '2' } },
        { id: 'negz',   label: '-0.0, 0.0',  values: { x: '-0', y: '0' } },
        { id: 'other',  label: '2.5, 2.0',   values: { x: '2.5', y: '2' } },
      ],
    },
    {
      id: 'slots',
      label: 'slots=True',
      blurb: 'With __slots__ there is no instance __dict__: assigning a field works, any other attribute name fails.',
      params: [
        { name: 'attr',  type: 'str', hint: 'attribute name', input: 'text' },
        { name: 'value', type: 'any', hint: 'value to assign', input: 'auto' },
      ],
      template: 'from dataclasses import dataclass\n\n@dataclass(slots=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nsetattr(p, {$attr}, {$value})\np',
      cases: [
        { id: 'field', label: 'a field',   values: { attr: 'y', value: '20' } },
        { id: 'new',   label: 'new name',  values: { attr: 'z', value: '3' } },
        { id: 'typo',  label: 'typo',      values: { attr: 'xx', value: '3' } },
      ],
    },
  ],
  demoExplainer: 'Point(1, 2) equals the reference point and Point(x) fills y from its default; with text the repr simply quotes it, because the int annotation is never enforced. In order=True the tie on priority 3 is decided by comparing "test" with "build", so b sorts first. In frozen=True the float 1.0 finds the key Point(1, 2): equal values have equal hashes across int and float, and -0.0 == 0. In slots=True a typo is reported with "Did you mean: \'x\'?" in the traceback, and a new name fails with "no __dict__ for setting new attributes".',

  patterns: [
    {
      name: 'Value object',
      desc: 'Immutable, hashable, compact. The usual choice for small records.',
      code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True, slots=True)\nclass Money:\n    amount: int\n    currency: str = "EUR"',
    },
    {
      name: 'Sortable records',
      desc: 'order=True compares fields in order; put the sort key first and exclude the rest with compare=False.',
      code: 'from dataclasses import dataclass, field\n\n@dataclass(order=True)\nclass Job:\n    priority: int\n    name: str = field(compare=False)\n\nqueue = sorted(jobs)',
    },
    {
      name: 'Options object with keyword-only fields',
      desc: 'kw_only=True forces readable calls and lets required fields follow optional ones.',
      code: 'from dataclasses import dataclass\n\n@dataclass(kw_only=True)\nclass Options:\n    verbose: bool = False\n    output: str\n\nopts = Options(output="out.txt")',
    },
    {
      name: 'Pattern matching on fields',
      desc: '__match_args__ makes positional class patterns work.',
      code: 'match shape:\n    case Point(0, 0):\n        print("origin")\n    case Point(x, 0):\n        print(f"on the x axis at {x}")',
    },
  ],

  examples: [
    { title: 'order=True sorts like tuples', code: 'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Version:\n    major: int\n    minor: int = 0\n\nsorted([Version(1, 10), Version(1, 9), Version(0, 99)])', returns: '[Version(major=0, minor=99), Version(major=1, minor=9), Version(major=1, minor=10)]' },
    { title: 'frozen=True: no assignment', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np.x = 5', returns: "dataclasses.FrozenInstanceError: cannot assign to field 'x'" },
    { title: 'frozen + eq: the hash of the field tuple', code: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\nhash(Point(1, 2)) == hash((1, 2))', returns: 'True' },
    { title: 'kw_only=True', code: "from dataclasses import dataclass\n\n@dataclass(kw_only=True)\nclass Config:\n    host: str\n    port: int = 8000\n\nConfig(host='db', port=5432), Config.__match_args__", returns: "(Config(host='db', port=5432), ())" },
    { title: 'slots=True: no __dict__', code: "from dataclasses import dataclass\n\n@dataclass(slots=True)\nclass Point:\n    x: int\n    y: int\n\nPoint.__slots__, hasattr(Point(1, 2), '__dict__')", returns: "(('x', 'y'), False)" },
    { title: 'match_args: positional patterns', code: "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\nmatch Point(0, 5):\n    case Point(0, y):\n        where = f'on the y axis at {y}'\n    case _:\n        where = 'elsewhere'\nwhere", returns: "'on the y axis at 5'" },
    { title: 'eq=False: identity, and the object hash', code: "from dataclasses import dataclass\n\n@dataclass(eq=False)\nclass Node:\n    name: str\n\na = Node('x')\na == Node('x'), {a: 1}[a]", returns: '(False, 1)' },
    { title: 'slots=True returns a new class', code: 'from dataclasses import dataclass\n\nclass C:\n    x: int\n\nD = dataclass(C)\nE = dataclass(slots=True)(C)\nD is C, E is C', returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'order=True next to your own __lt__',
      desc: 'The decorator refuses to overwrite comparison methods you wrote. To order by some fields only, keep order=True and exclude the others with field(compare=False) — which also removes them from ==.',
      wrong: { label: 'own __lt__', code: 'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Task:\n    priority: int\n    name: str\n\n    def __lt__(self, other):\n        return self.priority < other.priority', output: 'TypeError: Cannot overwrite attribute __lt__ in class Task Consider using functools.total_ordering' },
      fix:   { label: 'compare=False', code: "from dataclasses import dataclass, field\n\n@dataclass(order=True)\nclass Task:\n    priority: int\n    name: str = field(compare=False)\n\nsorted([Task(2, 'b'), Task(1, 'z')]), Task(1, 'a') == Task(1, 'b')", output: "([Task(priority=1, name='z'), Task(priority=2, name='b')], True)" },
    },
    {
      name: 'No-argument super() with slots=True',
      desc: 'slots=True builds a new class, but the methods still remember the original one, so super() without arguments fails at call time. Name the class explicitly.',
      wrong: { label: 'super()', code: "from dataclasses import dataclass\n\nclass Base:\n    def describe(self):\n        return 'base'\n\n@dataclass(slots=True)\nclass Point(Base):\n    x: int\n\n    def describe(self):\n        return super().describe() + ' point'\n\nPoint(1).describe()", output: 'TypeError: super(type, obj): obj (instance of Point) is not an instance or subtype of type (Point).' },
      fix:   { label: 'super(Point, self)', code: "from dataclasses import dataclass\n\nclass Base:\n    def describe(self):\n        return 'base'\n\n@dataclass(slots=True)\nclass Point(Base):\n    x: int\n\n    def describe(self):\n        return super(Point, self).describe() + ' point'\n\nPoint(1).describe()", output: "'base point'" },
    },
    {
      name: 'frozen=True is shallow',
      desc: 'Only rebinding the fields is blocked. A list stored in a field can still be changed in place — store a tuple when the contents must not change.',
      wrong: { label: 'list field', code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    tags: list\n\np = Point(1, [])\np.tags.append('ok')\np", output: "Point(x=1, tags=['ok'])" },
      fix:   { label: 'tuple field', code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    tags: tuple = ()\n\np = Point(1, ('a',))\np.tags.append('b')", output: "AttributeError: 'tuple' object has no attribute 'append'" },
    },
    {
      name: 'unsafe_hash=True and then mutating',
      desc: 'unsafe_hash gives mutable instances a field-based hash. Change a field and the hash changes with it — an object already stored in a set or dict cannot be found any more.',
      wrong: { label: 'unsafe_hash', code: 'from dataclasses import dataclass\n\n@dataclass(unsafe_hash=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nseen = {p}\np.x = 10\np in seen', output: 'False' },
      fix:   { label: 'frozen=True', code: 'from dataclasses import dataclass, replace\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\nseen = {p}\nmoved = replace(p, x=10)\np in seen, moved in seen', output: '(True, False)' },
    },
  ],

  when: {
    use: [
      'Any class whose job is to hold a few named values',
      'frozen=True for values used as dict keys or set members',
      'order=True when instances need sorting by their fields in order',
      'slots=True for many small instances, or to catch attribute typos',
    ],
    avoid: [
      'Classes with real behaviour and invariants that a generated __init__ would bypass',
      'Records that must also be tuples (unpacking, indexing) → typing.NamedTuple',
      'Validating or converting input data → a validation library; dataclasses never check types',
    ],
  },

  notes: {
    cpython:        'Lib/dataclasses.py — _process_class collects the fields (base classes first, in reverse MRO), then builds each method as source text and exec()s it once',
    'Hash rules':   'eq and frozen both true → field-based __hash__; eq true, frozen false → __hash__ = None (unhashable); eq false → the inherited __hash__ (object: identity). An explicit __hash__ in the class body is kept',
    'Overwriting':  'init, repr, eq, match_args: silently skipped when the class defines the method; order: TypeError for __lt__/__le__/__gt__/__ge__; frozen: TypeError for __setattr__/__delattr__; unsafe_hash: TypeError for an explicit __hash__',
    'Versions':     '3.7 dataclass; 3.10 match_args, kw_only, slots; 3.11 weakref_slot; 3.13 __eq__ compares field by field instead of building tuples (two instances holding the same NaN object are now unequal)',
  },

  related: [
    { name: 'dataclasses.field', slug: 'field', when: 'Per-field options: defaults, repr, compare, kw_only' },
    { name: 'FrozenInstanceError', slug: 'frozeninstanceerror', when: 'What frozen=True raises' },
    { name: 'KW_ONLY', slug: 'kw_only', when: 'Keyword-only from a point onwards' },
    { name: '__post_init__', slug: 'post_init', when: 'Validation after the generated __init__' },
    { name: 'functools.total_ordering', slug: 'total_ordering', when: 'Ordering from one hand-written method', category: 'stdlib/functools' },
    { name: 'hash()', slug: 'hash', when: 'What the generated __hash__ feeds', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I make a dataclass sortable?',
      a: 'Use @dataclass(order=True). It generates <, <=, > and >= that compare the fields as a tuple, in definition order, so put the main sort key first and mark fields that must not count with field(compare=False). order=True requires eq=True.',
    },
    {
      q: 'What is the difference between frozen=True and unsafe_hash=True?',
      a: 'frozen=True makes assignment raise FrozenInstanceError and, with eq=True, generates a hash from the fields — safe, because the fields cannot change. unsafe_hash=True generates the same hash but leaves the instance mutable, so a changed field changes the hash and breaks dict and set lookups.',
    },
    {
      q: 'What does slots=True do in a dataclass?',
      a: 'It creates the class with __slots__ listing the fields (Python 3.10+). Instances have no __dict__, use less memory and reject attributes that are not fields. The decorator returns a new class, which is why no-argument super() inside its methods fails.',
    },
    {
      q: 'Why is my dataclass unhashable?',
      a: 'With the defaults eq=True and frozen=False the decorator sets __hash__ to None: equal objects must have equal hashes, and a mutable object could change after being stored. Use frozen=True to get a field-based hash.',
    },
    {
      q: 'Is @dataclass the same as @dataclass()?',
      a: 'Yes. Without parentheses the decorator is applied with every parameter at its default, exactly like @dataclass().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass',
    meta:  'dataclasses.dataclass',
  },

};
