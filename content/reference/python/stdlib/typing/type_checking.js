// content/reference/python/stdlib/typing/type_checking.js

export const meta = {
  slug:        'type_checking',
  name:        'typing.TYPE_CHECKING',
  signature:   'if TYPE_CHECKING: ...',
  blurb:       'A constant that is False when the program runs and assumed True by type checkers. Imports inside if TYPE_CHECKING: are seen by the checker but never executed — the standard fix for circular imports and import cost caused by type hints.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.5.2+',
  searchTerms: 'typing.TYPE_CHECKING TYPE_CHECKING if TYPE_CHECKING circular import type hints import only for type checking forward reference from __future__ import annotations NameError avoid import cycle',
};

export const method = {
  slug:      'type_checking',
  name:      'typing.TYPE_CHECKING',
  signature: 'if TYPE_CHECKING: ...',
  returns:   { type: 'bool', desc: 'Always False at runtime.' },

  category:    'typing constant',
  version:     'Python 3.5.2+',
  hasLiveDemo: false,

  subtitle: 'Names imported inside the block do not exist at runtime. Every annotation that uses them must therefore stay unevaluated: write it as a string, or put from __future__ import annotations at the top of the module. Code that evaluates those hints (get_type_hints) will hit NameError.',

  covers: ['TYPE_CHECKING'],

  cheat: {
    commonCall: 'if TYPE_CHECKING:\n    from .models import User\ndef save(user: "User") -> None: ...',
    returns:    'False when running; True for mypy, pyright …',
    replaces:   'Importing a module at runtime only to use its classes in hints',
    watchOut:   'Unquoted hints using those names raise NameError when the def runs',
  },

  parameters: [],

  patterns: [
    {
      name: 'Break a circular import',
      desc: 'models imports services at runtime; services needs models only for hints.',
      code: '# services.py\nfrom __future__ import annotations\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    from .models import Order\n\ndef total(order: Order) -> float:\n    return sum(line.price for line in order.lines)',
    },
    {
      name: 'Avoid an expensive import',
      desc: 'Heavy libraries used only in signatures stay unimported.',
      code: 'from typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    import pandas as pd\n\ndef summarize(df: "pd.DataFrame") -> dict:\n    ...',
    },
    {
      name: 'Runtime import inside the function',
      desc: 'When the code also needs the class at runtime, import it lazily where it is used.',
      code: 'from typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    from decimal import Decimal\n\ndef parse(text: str) -> "Decimal":\n    from decimal import Decimal\n    return Decimal(text)',
    },
  ],

  examples: [
    { title: 'False when the program runs', code: 'import typing\ntyping.TYPE_CHECKING', returns: 'False' },
    { title: 'The block never executes', code: "from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    import module_that_does_not_exist\n'ran fine'", returns: "'ran fine'" },
    { title: 'Quoted hints are just strings', code: "from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: 'Decimal') -> 'Decimal': ...\ntotal.__annotations__", returns: "{'x': 'Decimal', 'return': 'Decimal'}" },
    { title: 'from __future__ import annotations quotes them for you', code: 'from __future__ import annotations\nfrom typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: Decimal) -> Decimal: ...\ntotal.__annotations__', returns: "{'x': 'Decimal', 'return': 'Decimal'}" },
    { title: 'Evaluating them later fails', code: "from typing import TYPE_CHECKING, get_type_hints\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: 'Decimal'): ...\nget_type_hints(total)", returns: "NameError: name 'Decimal' is not defined" },
  ],

  pitfalls: [
    {
      name: 'Unquoted hints with a TYPE_CHECKING import',
      desc: 'A normal annotation is evaluated when the def statement runs — and the name does not exist then.',
      wrong: { label: 'x: Decimal', code: 'from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: Decimal) -> Decimal:\n    return x', output: "NameError: name 'Decimal' is not defined" },
      fix:   { label: "x: 'Decimal'", code: "from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef total(x: 'Decimal') -> 'Decimal':\n    return x\ntotal(5)", output: '5' },
    },
    {
      name: 'Using the name at runtime',
      desc: 'isinstance checks, default values and constructors need a real import. Import where it is needed (or at the top if there is no cycle).',
      wrong: { label: 'isinstance(x, Decimal)', code: "from typing import TYPE_CHECKING\nif TYPE_CHECKING:\n    from decimal import Decimal\ndef is_money(x: object) -> bool:\n    return isinstance(x, Decimal)\nis_money(5)", output: "NameError: name 'Decimal' is not defined" },
      fix:   { label: 'import inside', code: 'def is_money(x: object) -> bool:\n    from decimal import Decimal\n    return isinstance(x, Decimal)\nis_money(5)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Imports needed only for annotations, especially when they would create an import cycle',
      'Avoiding the import cost of heavy modules used only in signatures',
    ],
    avoid: [
      'Anything that runs: isinstance checks, defaults, base classes → need a real import',
      'Libraries that evaluate hints at runtime (dataclass-style validation, get_type_hints) → they will not find the names',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: TYPE_CHECKING = False — an ordinary module constant; type checkers special-case the name',
    'Annotations': 'Local variable annotations inside functions are never evaluated, so they need no quotes (as the docs point out)',
    'Future import': 'from __future__ import annotations (PEP 563) stores every annotation of the module as a string',
  },

  related: [
    { name: 'get_type_hints', slug: 'get_type_hints', when: 'Needs localns for TYPE_CHECKING names' },
    { name: 'import', slug: 'import', when: 'How imports and cycles work', category: 'keywords' },
    { name: 'if', slug: 'if', when: 'The block it guards', category: 'keywords' },
    { name: 'NameError', slug: 'nameerror', when: 'What a missing import causes', category: 'exceptions' },
    { name: 'typing module', slug: 'typing', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'TYPE_CHECKING is a constant that is always False at runtime, so there is no input to vary. Its effect — imports that only the type checker sees — shows up in the structure of a module, which the examples below demonstrate with fixed, verified output.',
    },
    {
      q: 'What does if TYPE_CHECKING do in Python?',
      a: 'typing.TYPE_CHECKING is False at runtime, so the block never runs; type checkers treat it as True and read the imports in it. You get the names for type hints without importing the modules when the program runs.',
    },
    {
      q: 'How do I fix a circular import caused by type hints?',
      a: 'Move the import into an if TYPE_CHECKING: block and make the annotations strings — either by quoting them or with from __future__ import annotations at the top of the file.',
    },
    {
      q: 'Why do I get NameError with TYPE_CHECKING imports?',
      a: 'Because something evaluates an annotation (or uses the name) at runtime: an unquoted annotation in a def, an isinstance() call, or get_type_hints(). The name was never imported when the program ran.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.TYPE_CHECKING',
    meta:  'typing.TYPE_CHECKING',
  },

};
