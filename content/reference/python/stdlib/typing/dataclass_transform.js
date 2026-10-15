// content/reference/python/stdlib/typing/dataclass_transform.js

export const meta = {
  slug:        'dataclass_transform',
  name:        'typing.dataclass_transform',
  signature:   '@dataclass_transform(*, eq_default=True, order_default=False, kw_only_default=False, frozen_default=False, field_specifiers=(), **kwargs)',
  blurb:       'Tell type checkers that your decorator, base class or metaclass builds dataclass-like classes, so they synthesize __init__ from the annotations. At runtime it only records its arguments in __dataclass_transform__.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: false,
  version:     'Python 3.11+',
  searchTerms: 'typing.dataclass_transform dataclass_transform orm model decorator base class metaclass synthesized __init__ field_specifiers kw_only_default frozen_default __dataclass_transform__ pep 681 pydantic sqlalchemy attrs',
};

export const method = {
  slug:      'dataclass_transform',
  name:      'typing.dataclass_transform',
  signature: '@dataclass_transform(*, eq_default=True, order_default=False, kw_only_default=False, frozen_default=False, field_specifiers=(), **kwargs)',
  returns:   { type: 'decorator', desc: 'A decorator that sets __dataclass_transform__ (a dict of the arguments) on the decorated function, class or metaclass and returns it unchanged.' },

  category:    'typing decorator',
  version:     'Python 3.11+',
  hasLiveDemo: false,

  subtitle: 'Libraries such as ORMs and validation frameworks generate __init__, __eq__ and friends much like @dataclasses.dataclass. dataclass_transform describes that behaviour to the type checker. It generates nothing itself — your decorator, base class or metaclass still has to do the work.',

  covers: ['dataclass_transform'],

  cheat: {
    commonCall: '@dataclass_transform()\ndef model(cls): return dataclasses.dataclass(cls)',
    returns:    "model.__dataclass_transform__ → {'eq_default': True, ...}",
    replaces:   'Hand-written __init__ stubs or plugins for each type checker',
    watchOut:   'Needs parentheses: @dataclass_transform(), not @dataclass_transform',
  },

  parameters: [
    { name: 'eq_default',       type: 'bool', required: false, default: 'True',  desc: 'Whether eq is assumed True when a decorated class does not pass it.' },
    { name: 'order_default',    type: 'bool', required: false, default: 'False', desc: 'Default for order.' },
    { name: 'kw_only_default',  type: 'bool', required: false, default: 'False', desc: 'Default for kw_only: fields are keyword-only.' },
    { name: 'frozen_default',   type: 'bool', required: false, default: 'False', desc: 'Default for frozen (3.12+).' },
    { name: 'field_specifiers', type: 'tuple', required: false, default: '()',   desc: 'Functions or classes that describe fields, like dataclasses.field.' },
    { name: '**kwargs',         type: 'Any',  required: false, default: null,    desc: 'Accepted for future extensions; stored under "kwargs".' },
  ],

  patterns: [
    {
      name: 'A decorator that builds models',
      desc: 'The runtime work is done by dataclasses; the annotation tells checkers what it means.',
      code: 'import dataclasses\nfrom typing import dataclass_transform\n\n@dataclass_transform(kw_only_default=True)\ndef model[T](cls: type[T]) -> type[T]:\n    return dataclasses.dataclass(kw_only=True)(cls)\n\n@model\nclass Customer:\n    id: int\n    name: str',
    },
    {
      name: 'On a base class',
      desc: 'Subclasses of ModelBase are treated as dataclass-like; __init_subclass__ does the runtime part.',
      code: 'import dataclasses\nfrom typing import dataclass_transform\n\n@dataclass_transform()\nclass ModelBase:\n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        dataclasses.dataclass(cls)',
    },
    {
      name: 'With a field specifier',
      desc: 'Lets checkers understand field(default=...) calls in the class body.',
      code: 'import dataclasses\nfrom typing import dataclass_transform\n\n@dataclass_transform(field_specifiers=(dataclasses.field,))\ndef model(cls):\n    return dataclasses.dataclass(cls)',
    },
  ],

  examples: [
    { title: 'It records its arguments', code: 'from typing import dataclass_transform\n@dataclass_transform()\ndef model(cls):\n    return cls\nmodel.__dataclass_transform__', returns: "{'eq_default': True, 'order_default': False, 'kw_only_default': False, 'frozen_default': False, 'field_specifiers': (), 'kwargs': {}}" },
    { title: 'Extra keyword arguments are kept', code: 'from typing import dataclass_transform\n@dataclass_transform(kw_only_default=True, custom=1)\nclass ModelBase:\n    pass\n(ModelBase.__dataclass_transform__["kw_only_default"], ModelBase.__dataclass_transform__["kwargs"])', returns: "(True, {'custom': 1})" },
    { title: 'It does not create __init__', code: 'from typing import dataclass_transform\n@dataclass_transform()\ndef model(cls):\n    return cls\n@model\nclass Customer:\n    id: int\n    name: str\nCustomer(id=1, name="Ada")', returns: 'TypeError: Customer() takes no arguments' },
    { title: 'A decorator that does the work', code: 'import dataclasses\nfrom typing import dataclass_transform\n@dataclass_transform(kw_only_default=True)\ndef model(cls):\n    return dataclasses.dataclass(kw_only=True)(cls)\n@model\nclass Customer:\n    id: int\n    name: str\nCustomer(id=1, name="Ada")', returns: "Customer(id=1, name='Ada')" },
    { title: 'Keyword-only fields, as declared', code: 'import dataclasses\nfrom typing import dataclass_transform\n@dataclass_transform(kw_only_default=True)\ndef model(cls):\n    return dataclasses.dataclass(kw_only=True)(cls)\n@model\nclass Customer:\n    id: int\n    name: str\nCustomer(1, "Ada")', returns: 'TypeError: Customer.__init__() takes 1 positional argument but 3 were given' },
    { title: 'Works on metaclasses too', code: 'from typing import dataclass_transform\n@dataclass_transform()\nclass ModelMeta(type):\n    pass\nModelMeta.__dataclass_transform__["eq_default"]', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Forgetting the parentheses',
      desc: 'dataclass_transform is a decorator factory with keyword-only arguments; applied directly to a function it raises.',
      wrong: { label: '@dataclass_transform', code: 'from typing import dataclass_transform\n@dataclass_transform\ndef model(cls):\n    return cls', output: 'TypeError: dataclass_transform() takes 0 positional arguments but 1 was given' },
      fix:   { label: '@dataclass_transform()', code: 'from typing import dataclass_transform\n@dataclass_transform()\ndef model(cls):\n    return cls\nhasattr(model, "__dataclass_transform__")', output: 'True' },
    },
    {
      name: 'Declaring behaviour the code does not have',
      desc: 'The checker believes the declaration; if the decorator returns the class unchanged, the calls it approved fail at runtime.',
      wrong: { label: 'declaration only', code: 'from typing import dataclass_transform\n@dataclass_transform()\ndef model(cls):\n    return cls\n@model\nclass Point:\n    x: int\n    y: int\nPoint(1, 2)', output: 'TypeError: Point() takes no arguments' },
      fix:   { label: 'implement it', code: 'import dataclasses\nfrom typing import dataclass_transform\n@dataclass_transform()\ndef model(cls):\n    return dataclasses.dataclass(cls)\n@model\nclass Point:\n    x: int\n    y: int\nPoint(1, 2)', output: 'Point(x=1, y=2)' },
    },
  ],

  when: {
    use: [
      'Writing an ORM, serializer or validation library whose classes get generated __init__ methods',
      'Wrapping dataclasses.dataclass in your own decorator with different defaults',
    ],
    avoid: [
      'Ordinary application classes → use @dataclasses.dataclass directly',
      'Expecting runtime behaviour → it only stores __dataclass_transform__',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: dataclass_transform(...) returns a decorator that sets cls_or_fn.__dataclass_transform__ to a dict of its arguments ("kwargs" holds the extras) and returns the object unchanged',
    'Targets':   'A decorator function, a base class (its subclasses are transformed) or a metaclass (classes using it are transformed)',
    'Versions':  'Added in 3.11 (PEP 681); frozen_default added in 3.12',
  },

  related: [
    { name: 'dataclasses module', slug: 'dataclasses', when: 'The behaviour being described', category: 'stdlib' },
    { name: 'NamedTuple', slug: 'namedtuple', when: 'Another class-from-annotations helper' },
    { name: 'TypedDict', slug: 'typeddict', when: 'Annotated dict shapes' },
    { name: 'class', slug: 'class', when: 'Decorators, base classes and metaclasses', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'What dataclass_transform changes happens inside a type checker, which the page cannot run, and its runtime part needs a decorator, base class or metaclass written as code — a demo box can only send text and numbers. The examples below show the runtime behaviour (the __dataclass_transform__ dict, the missing __init__) with fixed, verified output.',
    },
    {
      q: 'What is dataclass_transform used for?',
      a: 'For libraries whose classes behave like dataclasses without using @dataclass syntax — ORM models, validation models, attrs-style decorators. It tells type checkers to synthesize __init__ (and eq, order, frozen behaviour) from the class annotations.',
    },
    {
      q: 'Does dataclass_transform create __init__ at runtime?',
      a: 'No. It only stores its arguments in __dataclass_transform__. The decorated decorator, base class or metaclass must generate the methods itself — for example by calling dataclasses.dataclass.',
    },
    {
      q: 'Where can @dataclass_transform() be applied?',
      a: 'To a decorator function, to a base class (affecting its subclasses) or to a metaclass (affecting classes created with it).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.dataclass_transform',
    meta:  'typing.dataclass_transform',
  },

};
