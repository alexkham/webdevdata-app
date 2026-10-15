// content/reference/python/stdlib/typing/newtype.js

export const meta = {
  slug:        'newtype',
  name:        'typing.NewType',
  signature:   'NewType(name, tp)',
  blurb:       'Create a distinct type for the type checker at almost no runtime cost: UserId = NewType("UserId", int). The checker keeps UserId and int apart; at runtime UserId(5) simply returns 5.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.5.2+ (a class since 3.10)',
  searchTerms: 'typing.NewType NewType distinct type branded type user id type alias vs newtype semantic type __supertype__ cannot subclass an instance of NewType zero cost wrapper',
};

export const method = {
  slug:      'newtype',
  name:      'typing.NewType',
  signature: 'NewType(name, tp)',
  returns:   { type: 'typing.NewType', desc: 'A callable object; calling it returns its argument unchanged. __name__ and __supertype__ describe it.' },

  category:    'typing distinct types',
  version:     'Python 3.5.2+ (a class since 3.10)',
  hasLiveDemo: true,

  subtitle: 'The type checker treats UserId as a subclass of int: a UserId can go where an int is expected, but a plain int cannot go where a UserId is required. At runtime nothing of that exists — UserId(x) is x, unconverted and unchecked.',

  covers: ['NewType'],

  cheat: {
    commonCall: "UserId = NewType('UserId', int)\nuid = UserId(42)",
    returns:    'UserId(42) → 42 (the very same object)',
    replaces:   'A wrapper class just to keep two kinds of int apart',
    watchOut:   'No conversion: UserId("42") is the str "42"',
  },

  parameters: [
    { name: 'name', type: 'str',  required: true, default: null, desc: 'The new type\'s name; should match the variable it is assigned to.' },
    { name: 'tp',   type: 'type', required: true, default: null, desc: 'The base type. May itself be a NewType (ProUserId = NewType("ProUserId", UserId)).' },
  ],

  modes: [
    {
      id: 'call',
      label: 'call it',
      blurb: 'UserId is a NewType of int. Call it with anything and look at what comes back.',
      params: [{ name: 'value', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: "from typing import NewType\nUserId = NewType('UserId', int)\nUserId({$value})",
      cases: [
        { id: 'int',   label: 'an int',   values: { value: '42' } },
        { id: 'text',  label: 'a str',    values: { value: 'user-42' } },
        { id: 'float', label: 'a float',  values: { value: '4.2' } },
      ],
    },
  ],
  demoExplainer: 'Whatever goes in comes out: an int stays an int, the text "user-42" stays a str, a float stays a float. NewType performs no conversion and no validation — the distinction between UserId and int exists only for the type checker.',

  patterns: [
    {
      name: 'Keep IDs of different tables apart',
      desc: 'Passing an OrderId where a UserId is expected becomes a type error.',
      code: 'from typing import NewType\n\nUserId = NewType("UserId", int)\nOrderId = NewType("OrderId", int)\n\ndef load_user(uid: UserId) -> dict: ...\n\nload_user(UserId(7))',
    },
    {
      name: 'Validated values',
      desc: 'Create the NewType only in one checked place.',
      code: 'from typing import NewType\n\nEmail = NewType("Email", str)\n\ndef parse_email(text: str) -> Email:\n    if "@" not in text:\n        raise ValueError(f"not an email: {text!r}")\n    return Email(text.strip().lower())',
    },
    {
      name: 'A NewType of a NewType',
      desc: 'Subclassing is not allowed, but nesting is.',
      code: 'from typing import NewType\n\nUserId = NewType("UserId", int)\nAdminId = NewType("AdminId", UserId)',
    },
  ],

  examples: [
    { title: 'The argument comes back unchanged', code: "from typing import NewType\nUserId = NewType('UserId', int)\n(UserId(5), type(UserId(5)))", returns: "(5, <class 'int'>)" },
    { title: 'Not converted, not checked', code: "from typing import NewType\nUserId = NewType('UserId', int)\nUserId('abc')", returns: "'abc'" },
    { title: 'Name and base type', code: "from typing import NewType\nUserId = NewType('UserId', int)\n(UserId, UserId.__name__, UserId.__supertype__)", returns: "(__main__.UserId, 'UserId', <class 'int'>)" },
    { title: 'A NewType of a NewType', code: "from typing import NewType\nUserId = NewType('UserId', int)\nProUserId = NewType('ProUserId', UserId)\nProUserId.__supertype__", returns: '__main__.UserId' },
    { title: 'Subclassing is refused', code: "from typing import NewType\nUserId = NewType('UserId', int)\nclass AdminId(UserId):\n    pass", returns: "TypeError: Cannot subclass an instance of NewType. Perhaps you were looking for: `AdminId = NewType('AdminId', UserId)`" },
    { title: 'Usable in unions', code: "from typing import NewType\nUserId = NewType('UserId', int)\nUserId | None", returns: 'typing.Optional[__main__.UserId]' },
  ],

  pitfalls: [
    {
      name: 'Expecting NewType to convert',
      desc: 'UserId(x) is x. Convert (and validate) the value yourself before wrapping it.',
      wrong: { label: "UserId('42')", code: "from typing import NewType\nUserId = NewType('UserId', int)\nUserId('42')", output: "'42'" },
      fix:   { label: "UserId(int('42'))", code: "from typing import NewType\nUserId = NewType('UserId', int)\nUserId(int('42'))", output: '42' },
    },
    {
      name: 'isinstance with a NewType',
      desc: 'A NewType is not a class, so there are no UserId instances to detect. Check the base type.',
      wrong: { label: 'isinstance(x, UserId)', code: "from typing import NewType\nUserId = NewType('UserId', int)\nisinstance(5, UserId)", output: 'TypeError: isinstance() arg 2 must be a type, a tuple of types, or a union' },
      fix:   { label: '__supertype__', code: "from typing import NewType\nUserId = NewType('UserId', int)\nisinstance(5, UserId.__supertype__)", output: 'True' },
    },
  ],

  when: {
    use: [
      'IDs, units and validated strings that share a base type but must not be mixed up',
      'Marking values that went through a validation function',
    ],
    avoid: [
      'Runtime distinction or extra behaviour → a real class (or a dataclass wrapper)',
      'Just a shorter name for a type → a type alias (type UserIds = list[int])',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: class NewType with __call__ = _idfunc, an identity function implemented in C; a class since 3.10 (it was a function before), and 3.11 restored the call speed of 3.9',
    'Repr':      'module.Name, e.g. __main__.UserId',
    'Alias vs NewType': 'An alias is the same type under another name; a NewType is a distinct subtype for the checker',
  },

  related: [
    { name: 'TypeAlias / TypeAliasType', slug: 'typealias', when: 'Same type, new name' },
    { name: 'cast / assert_type', slug: 'cast', when: 'Other zero-cost hints for the checker' },
    { name: 'Annotated', slug: 'annotated', when: 'Attach metadata instead of making a new type' },
    { name: 'type statement', slug: 'type', when: 'Aliases since 3.12', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is the difference between NewType and a type alias?',
      a: 'An alias (type UserId = int, or UserId = int) is interchangeable with the original everywhere. A NewType is a distinct type for the checker: a UserId is accepted where an int is, but an int is rejected where a UserId is required.',
    },
    {
      q: 'Does NewType create a class?',
      a: 'No. UserId is a typing.NewType object; calling it returns the argument unchanged, so values are still plain ints at runtime. That is also why it cannot be subclassed or used with isinstance().',
    },
    {
      q: 'How do I subclass a NewType?',
      a: 'You cannot — the error message suggests the alternative: derive another NewType from it, e.g. AdminId = NewType("AdminId", UserId).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.NewType',
    meta:  'typing.NewType',
  },

};
