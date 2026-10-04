// content/reference/python/stdlib/functools/singledispatch.js

export const meta = {
  slug:        'singledispatch',
  name:        'functools.singledispatch / singledispatchmethod',
  signature:   '@functools.singledispatch  ·  @functools.singledispatchmethod',
  blurb:       'Generic functions: one name, a separate implementation per type of the first argument, chosen at call time — no isinstance() chains.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'functools singledispatch singledispatchmethod singledispatchmethod.register register dispatch on type overload function by type generic function python function overloading isinstance chain type annotations registry',
};

export const method = {
  slug:      'singledispatch',
  name:      'functools.singledispatch / singledispatchmethod',
  signature: '@functools.singledispatch',
  returns:   { type: 'generic function', desc: 'A function with .register(), .dispatch(cls) and .registry; calls go to the implementation registered for type(first_arg) — or the closest base class.' },

  category:    'functools decorator',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Decorate a fallback with @singledispatch, then register one implementation per type. Dispatch follows the class hierarchy (the MRO), so a bool goes to the int implementation unless bool has its own.',

  covers: ['singledispatch', 'singledispatchmethod', 'singledispatchmethod.register'],

  cheat: {
    commonCall: '@describe.register\ndef _(x: int): ...',
    returns:    'the implementation for the first argument\'s type',
    replaces:   'if isinstance(x, int): … elif isinstance(x, str): …',
    watchOut:   'only the FIRST argument is used to dispatch',
  },

  parameters: [
    { name: 'func', type: 'callable', required: true, default: null, desc: 'The default implementation, used when no registered type matches.' },
    { name: 'cls',  type: 'type',     required: false, default: null, desc: 'register(cls) / register(cls, func): the type to register for. Optional when the implementation annotates its first parameter (3.7+); unions such as int | float are accepted since 3.11.' },
  ],

  modes: [
    {
      id: 'value',
      label: 'dispatch on a value',
      blurb: 'Type a number or some text. The implementation is picked by the type of the value.',
      params: [{ name: 'value', type: 'int | float | str', hint: 'a number or text', input: 'auto' }],
      template: "from functools import singledispatch\n@singledispatch\ndef describe(x):\n    return f'something else: {x!r}'\n@describe.register\ndef _(x: int):\n    return f'int {x}'\n@describe.register\ndef _(x: float):\n    return f'float {x}'\n@describe.register\ndef _(x: str):\n    return f'str of length {len(x)}'\ndescribe({$value})",
      cases: [
        { id: 'int',   label: 'int',   values: { value: '42' } },
        { id: 'float', label: 'float', values: { value: '2.5' } },
        { id: 'str',   label: 'text',  values: { value: 'hello' } },
      ],
    },
    {
      id: 'fallback',
      label: 'fallback',
      blurb: 'A tuple has no registered implementation, so the default function runs.',
      params: [{ name: 'items', type: 'list[str]', hint: 'comma-separated items', input: 'csv' }],
      template: "from functools import singledispatch\n@singledispatch\ndef describe(x):\n    return f'something else: {x!r}'\n@describe.register\ndef _(x: list):\n    return f'list of {len(x)}'\ndescribe({$items}), describe(tuple({$items}))",
      cases: [
        { id: 'two',  label: 'two items', values: { items: 'a, b' } },
        { id: 'one',  label: 'one item',  values: { items: 'x' } },
      ],
    },
  ],
  demoExplainer: 'The registry is consulted with the class of the first argument: 42 → int, 2.5 → float, text → str. A list goes to the list implementation, but tuple(...) of the same items has no entry of its own (tuple is not a subclass of list), so the fallback runs and shows its repr — note the trailing comma of a one-item tuple.',

  patterns: [
    {
      name: 'Serialize many types',
      desc: 'A JSON default= hook without an isinstance ladder.',
      code: 'from functools import singledispatch\nfrom datetime import date\nfrom decimal import Decimal\n@singledispatch\ndef to_json(obj):\n    raise TypeError(f"cannot serialize {type(obj).__name__}")\n@to_json.register\ndef _(obj: date):\n    return obj.isoformat()\n@to_json.register\ndef _(obj: Decimal):\n    return str(obj)',
    },
    {
      name: 'Register several types at once (3.11+)',
      desc: 'A union annotation registers each member.',
      code: '@to_json.register\ndef _(obj: set | frozenset):\n    return sorted(obj)',
    },
    {
      name: 'Dispatch in a method',
      desc: 'singledispatchmethod dispatches on the first argument AFTER self.',
      code: 'from functools import singledispatchmethod\nclass Formatter:\n    @singledispatchmethod\n    def fmt(self, arg):\n        return str(arg)\n    @fmt.register\n    def _(self, arg: float):\n        return f"{arg:.2f}"',
    },
  ],

  examples: [
    { title: 'Register by annotation',     code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register\ndef _(x: int):\n    return 'int'\nshow(1), show('a')", returns: "('int', 'other')" },
    { title: 'bool dispatches to int',     code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register\ndef _(x: int):\n    return 'int'\nshow(True)", returns: "'int'" },
    { title: 'Register with an explicit type', code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register(list)\ndef _(x):\n    return f'list of {len(x)}'\nshow([1, 2])", returns: "'list of 2'" },
    { title: 'Union types (3.11+)',        code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register\ndef _(x: int | float):\n    return 'number'\nshow(1), show(1.5)", returns: "('number', 'number')" },
    { title: 'dispatch() shows the choice', code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register\ndef number(x: int):\n    return 'int'\nshow.dispatch(bool).__name__, show.dispatch(str).__name__", returns: "('number', 'show')" },
    { title: 'singledispatchmethod',       code: "from functools import singledispatchmethod\nclass Fmt:\n    @singledispatchmethod\n    def fmt(self, arg):\n        return str(arg)\n    @fmt.register\n    def _(self, arg: float):\n        return f'{arg:.2f}'\nFmt().fmt(3.14159), Fmt().fmt(7)", returns: "('3.14', '7')" },
  ],

  pitfalls: [
    {
      name: 'Plain @singledispatch on a method',
      desc: 'In a method the first argument is self, so every call dispatches on the instance type and the registered types are never reached.',
      wrong: { label: 'singledispatch', code: "from functools import singledispatch\nclass Fmt:\n    @singledispatch\n    def fmt(self, arg):\n        return 'default'\n    @fmt.register\n    def _(self, arg: int):\n        return 'int'\nFmt().fmt(1)", output: "'default'" },
      fix:   { label: 'singledispatchmethod', code: "from functools import singledispatchmethod\nclass Fmt:\n    @singledispatchmethod\n    def fmt(self, arg):\n        return 'default'\n    @fmt.register\n    def _(self, arg: int):\n        return 'int'\nFmt().fmt(1)", output: "'int'" },
    },
    {
      name: 'Registering without a type',
      desc: 'register() needs either an annotated first parameter or the type as an argument. The TypeError message starts with "Invalid first argument to `register()`" and suggests both forms.',
      wrong: { label: 'no annotation', code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\ntry:\n    @show.register\n    def _(x):\n        return 'int'\nexcept TypeError as e:\n    error = str(e)\nerror.split(':')[0]", output: "'Invalid first argument to `register()`'" },
      fix:   { label: 'register(int)', code: "from functools import singledispatch\n@singledispatch\ndef show(x):\n    return 'other'\n@show.register(int)\ndef _(x):\n    return 'int'\nshow(5)", output: "'int'" },
    },
  ],

  when: {
    use: [
      'One operation over many unrelated types (serializers, pretty-printers, visitors)',
      'Letting other modules add support for their own types via register()',
    ],
    avoid: [
      'Dispatch on several arguments — singledispatch looks at the first one only',
      'Two or three types in one place → a match statement or isinstance is simpler',
    ],
  },

  notes: {
    cpython:        'Pure Python in Lib/functools.py; dispatch() walks the class MRO (with ABC support) and caches results per type in a WeakKeyDictionary',
    'Registry':     'f.registry is a read-only mapping from type to implementation; object maps to the default function',
    'Versions':     'singledispatch 3.4; register() by annotation 3.7; singledispatchmethod 3.8; union types in register() 3.11',
  },

  related: [
    { name: 'isinstance()', slug: 'isinstance', when: 'What singledispatch replaces', category: 'functions' },
    { name: 'match',        slug: 'match',      when: 'Structural pattern matching on types', category: 'keywords' },
    { name: 'type.mro()',   slug: 'type-mro',   when: 'The order in which base classes are tried', category: 'functions' },
    { name: 'functools module', slug: 'functools', when: 'All of functools', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Does Python support function overloading?',
      a: 'Not by signature, but functools.singledispatch gives overloading by the type of the first argument: register one implementation per type and the right one is chosen at call time.',
    },
    {
      q: 'How do I use singledispatch inside a class?',
      a: 'Use functools.singledispatchmethod (3.8+). It dispatches on the first argument after self (or cls), and register works the same way.',
    },
    {
      q: 'Why is my registered implementation not called?',
      a: 'Dispatch uses the type of the FIRST positional argument only. Check that you call with the value first, that you did not use plain singledispatch on a method, and use f.dispatch(type(value)) to see which implementation is chosen.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functools.html#functools.singledispatch',
    meta:  'functools.singledispatch',
  },
};
