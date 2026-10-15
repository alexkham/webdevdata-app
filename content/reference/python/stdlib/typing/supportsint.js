// content/reference/python/stdlib/typing/supportsint.js — the Supports* protocols

export const meta = {
  slug:        'supportsint',
  name:        'typing.SupportsInt / SupportsFloat / SupportsIndex …',
  signature:   'SupportsInt · SupportsFloat · SupportsComplex · SupportsBytes · SupportsIndex · SupportsAbs[T] · SupportsRound[T]',
  blurb:       'Ready-made runtime-checkable protocols, each requiring one special method: __int__, __float__, __complex__, __bytes__, __index__, __abs__ or __round__. Use them to accept "anything number-like" instead of listing classes.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5+ (SupportsIndex 3.8+)',
  searchTerms: 'typing.SupportsInt SupportsInt SupportsFloat SupportsComplex SupportsBytes SupportsIndex SupportsAbs SupportsRound protocol __int__ __float__ __index__ __abs__ __round__ __bytes__ __complex__ number like duck typing numeric protocol',
};

export const method = {
  slug:      'supportsint',
  name:      'typing.SupportsInt / SupportsFloat / SupportsIndex …',
  signature: 'SupportsInt · SupportsFloat · SupportsComplex · SupportsBytes · SupportsIndex · SupportsAbs[T] · SupportsRound[T]',
  returns:   { type: 'type', desc: 'Protocol classes (metaclass _ProtocolMeta), all decorated with @runtime_checkable. SupportsAbs and SupportsRound are generic in their result type.' },

  category:    'typing protocols',
  version:     'Python 3.5+ (SupportsIndex 3.8+)',
  hasLiveDemo: true,

  subtitle: 'Each protocol asks for exactly one method, so isinstance(x, SupportsIndex) means "x has __index__". That is narrower than it sounds: a str has no __int__, so it is not SupportsInt even though int("42") works — int() parses strings by other means.',

  covers: ['SupportsInt', 'SupportsFloat', 'SupportsComplex', 'SupportsBytes', 'SupportsIndex', 'SupportsAbs', 'SupportsRound'],

  cheat: {
    commonCall: 'def to_float(x: SupportsFloat) -> float: return float(x)',
    returns:    'isinstance(3, SupportsIndex) → True; isinstance(3.0, SupportsIndex) → False',
    replaces:   'int | float | Decimal | Fraction unions for "converts to float"',
    watchOut:   'Slicing and range() need __index__ — SupportsIndex, not SupportsInt',
  },

  parameters: [
    { name: 'T', type: 'type', required: false, default: null, desc: 'SupportsAbs[T] / SupportsRound[T]: the type abs() / round() returns.' },
  ],

  modes: [
    {
      id: 'check',
      label: 'which protocols?',
      blurb: 'Type a number or text. The demo lists every Supports* protocol the value matches with isinstance().',
      params: [{ name: 'value', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: 'import typing\nvalue = {$value}\nprotocols = [typing.SupportsInt, typing.SupportsFloat, typing.SupportsComplex, typing.SupportsBytes, typing.SupportsIndex, typing.SupportsAbs, typing.SupportsRound]\n[p.__name__ for p in protocols if isinstance(value, p)]',
      cases: [
        { id: 'int',   label: 'an int',   values: { value: '42' } },
        { id: 'float', label: 'a float',  values: { value: '2.5' } },
        { id: 'text',  label: 'a str',    values: { value: '42 apples' } },
      ],
    },
  ],
  demoExplainer: 'An int matches five protocols: it has __int__, __float__, __index__, __abs__ and __round__, but no __complex__ and no __bytes__ in CPython 3.13. A float matches four — the same as int minus __index__, which is exactly why 2.5 cannot be a list index (like int, it has no __complex__ or __bytes__). A str matches none: int("42") and float("2.5") parse text, they do not call __int__ or __float__ on the string.',

  patterns: [
    {
      name: 'Accept anything convertible to float',
      desc: 'int, float, Decimal, Fraction and your own classes with __float__.',
      code: 'from typing import SupportsFloat\n\ndef celsius(f: SupportsFloat) -> float:\n    return (float(f) - 32) * 5 / 9',
    },
    {
      name: 'Integer-like index arguments',
      desc: 'SupportsIndex admits int, bool and any class with __index__, but not float.',
      code: 'import operator\nfrom typing import SupportsIndex\n\ndef nth(items: list[str], i: SupportsIndex) -> str:\n    return items[operator.index(i)]',
    },
    {
      name: 'Generic result type',
      desc: 'SupportsAbs[T]: abs() returns T.',
      code: 'from typing import SupportsAbs\n\ndef distance[T](x: SupportsAbs[T]) -> T:\n    return abs(x)',
    },
  ],

  examples: [
    { title: 'SupportsIndex separates int from float', code: 'from typing import SupportsIndex\n(isinstance(3, SupportsIndex), isinstance(3.0, SupportsIndex))', returns: '(True, False)' },
    { title: 'A str is not SupportsInt', code: "from typing import SupportsInt\n(isinstance('42', SupportsInt), int('42'))", returns: '(False, 42)' },
    { title: 'Your own class matches by its method', code: 'from typing import SupportsFloat\nclass Money:\n    def __float__(self) -> float:\n        return 1.5\nisinstance(Money(), SupportsFloat)', returns: 'True' },
    { title: 'bytes has __bytes__', code: "from typing import SupportsBytes\nisinstance(b'x', SupportsBytes)", returns: 'True' },
    { title: 'complex supports abs() but not round()', code: 'from typing import SupportsAbs, SupportsRound\n(isinstance(1j, SupportsAbs), isinstance(1j, SupportsRound))', returns: '(True, False)' },
    { title: 'SupportsAbs and SupportsRound are generic', code: 'from typing import SupportsAbs\nSupportsAbs[int]', returns: 'typing.SupportsAbs[int]' },
    { title: 'The others are not', code: 'from typing import SupportsInt\nSupportsInt[int]', returns: "TypeError: <class 'typing.SupportsInt'> is not a generic class" },
  ],

  pitfalls: [
    {
      name: 'SupportsInt for "can be passed to int()"',
      desc: 'int() also parses strings, which have no __int__. To accept text too, try the conversion instead of checking a protocol.',
      wrong: { label: 'isinstance check', code: "from typing import SupportsInt\ndef as_int(x):\n    return int(x) if isinstance(x, SupportsInt) else None\n[as_int('42'), as_int(7.9)]", output: '[None, 7]' },
      fix:   { label: 'try int()', code: "def as_int(x):\n    try:\n        return int(x)\n    except (TypeError, ValueError):\n        return None\n[as_int('42'), as_int(7.9)]", output: '[42, 7]' },
    },
    {
      name: 'SupportsInt for an index',
      desc: 'Floats have __int__, so they pass a SupportsInt check — and then fail as an index. Indexing and slicing need __index__.',
      wrong: { label: 'SupportsInt', code: 'from typing import SupportsInt\ndef take(items: list, n: SupportsInt) -> list:\n    if not isinstance(n, SupportsInt):\n        raise TypeError(f"n must be an integer, not {type(n).__name__}")\n    return items[:n]\ntake([1, 2, 3], 2.5)', output: 'TypeError: slice indices must be integers or None or have an __index__ method' },
      fix:   { label: 'SupportsIndex', code: 'from typing import SupportsIndex\ndef take(items: list, n: SupportsIndex) -> list:\n    if not isinstance(n, SupportsIndex):\n        raise TypeError(f"n must be an integer, not {type(n).__name__}")\n    return items[:n]\ntake([1, 2, 3], 2.5)', output: 'TypeError: n must be an integer, not float' },
    },
  ],

  when: {
    use: [
      'Parameters that only need a conversion: float(x), int(x), complex(x), bytes(x)',
      'Index-like parameters: SupportsIndex',
      'Generic numeric helpers built on abs() or round()',
    ],
    avoid: [
      'Accepting numeric strings → convert with int()/float() and catch ValueError',
      'Checks that must also verify the result type → the protocols check presence only',
    ],
  },

  notes: {
    cpython:      'Lib/typing.py: seven small @runtime_checkable Protocol classes, each with one abstract method',
    'Runtime':    'isinstance() checks only that the method exists on the type (since 3.12 via inspect.getattr_static)',
    'Builtins':   'In CPython 3.13 int lacks __complex__ and __bytes__, float lacks __complex__, __index__ and __bytes__; bytes has __bytes__ and complex has __complex__ (both added in 3.11)',
  },

  related: [
    { name: 'Protocol / runtime_checkable', slug: 'protocol', when: 'Write your own protocol' },
    { name: 'int()', slug: 'int', when: 'Calls __int__ — or parses a string', category: 'functions' },
    { name: 'float()', slug: 'float', when: 'Calls __float__', category: 'functions' },
    { name: 'abs()', slug: 'abs', when: 'Calls __abs__', category: 'functions' },
    { name: 'round()', slug: 'round', when: 'Calls __round__', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is typing.SupportsIndex?',
      a: 'A protocol matching any object with __index__ — the method Python uses when an object must act as an exact integer (list indices, slices, range(), bin()). int and bool have it, float does not.',
    },
    {
      q: 'Why is a string not SupportsInt or SupportsFloat?',
      a: 'Because str has no __int__ or __float__ method. int("42") and float("2.5") work because those constructors parse strings themselves, which these protocols do not describe.',
    },
    {
      q: 'Can I use the Supports* protocols with isinstance?',
      a: 'Yes, all seven are runtime-checkable. The check only confirms the special method is present.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.SupportsInt',
    meta:  'typing.SupportsInt',
  },

};
