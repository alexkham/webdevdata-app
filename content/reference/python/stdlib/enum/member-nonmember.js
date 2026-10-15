// content/reference/python/stdlib/enum/member-nonmember.js

export const meta = {
  slug:        'member-nonmember',
  name:        'enum.member / enum.nonmember',
  signature:   'enum.member(value) · enum.nonmember(value)',
  blurb:       'Override the rule that decides what becomes a member: member() turns a function (or anything else) into a member, nonmember() keeps a value as a plain class attribute.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'member nonmember enum.member enum.nonmember python enum constant not a member class attribute in enum function as enum value lambda member enum methods nested class member 3.13 decorator',
};

export const method = {
  slug:      'member-nonmember',
  name:      'enum.member / enum.nonmember',
  signature: 'enum.member(value) · enum.nonmember(value)',
  returns:   { type: 'member | nonmember', desc: 'A wrapper; the class body unwraps it — into a member, or into an ordinary attribute.' },

  category:    'enum helper',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'In an enum body, plain values become members while functions, properties and nested classes do not. When you need the opposite — a constant that is not a choice, or a function that is — wrap it: DEFAULT = nonmember(1), ADD = member(lambda a, b: a + b).',

  covers: ['member', 'nonmember'],

  cheat: {
    commonCall: 'TIMEOUT = nonmember(30)',
    returns:    'Config.TIMEOUT → 30, not a member',
    replaces:   'keeping constants outside the enum class',
    watchOut:   "a nonmember with a member's value is not an alias — Color(1) still finds the member",
  },

  parameters: [
    { name: 'member(value)',    type: 'class', required: false, default: null, desc: 'value becomes a member even if it is a function or other descriptor. Usable as a decorator on a def.' },
    { name: 'nonmember(value)', type: 'class', required: false, default: null, desc: 'value is stored as a normal class attribute, never a member.' },
  ],

  modes: [
    {
      id: 'nonmember',
      label: 'nonmember()',
      blurb: 'Type a value for DEFAULT. It stays a plain attribute — even when it equals a member value.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum, nonmember\nclass Config(Enum):\n    DEBUG = 1\n    RELEASE = 2\n    DEFAULT = nonmember({$value})\n(list(Config), Config.DEFAULT)',
      cases: [
        { id: 'one',  label: '1',       values: { value: '1' } },
        { id: 'text', label: 'release', values: { value: 'release' } },
        { id: 'big',  label: '30',      values: { value: '30' } },
      ],
    },
    {
      id: 'member',
      label: 'member()',
      blurb: 'Three lambdas made members with member(). Type a member name; its value is the function.',
      params: [{ name: 'name', type: 'str', hint: 'a member name', input: 'text' }],
      template: 'from enum import Enum, member\nclass Op(Enum):\n    ADD = member(lambda a, b: a + b)\n    SUB = member(lambda a, b: a - b)\n    MUL = member(lambda a, b: a * b)\nOp[{$name}].value(6, 3)',
      cases: [
        { id: 'add', label: 'ADD', values: { name: 'ADD' } },
        { id: 'mul', label: 'MUL', values: { name: 'MUL' } },
        { id: 'div', label: 'DIV', values: { name: 'DIV' } },
      ],
    },
  ],
  demoExplainer: 'DEFAULT = nonmember(1) does not become an alias of DEBUG: the class keeps two members and Config.DEFAULT is just the int. In the second tab each lambda is a member value, so Op["MUL"].value is the function and calling it with 6 and 3 gives 18. Without member() the lambdas would be methods and Op would have no members at all.',

  patterns: [
    {
      name: 'Constants that belong with the enum',
      desc: 'Keep related settings in the class without turning them into choices.',
      code: 'from enum import Enum, nonmember\nclass Status(Enum):\n    OK = 0\n    ERROR = 1\n    MAX_RETRIES = nonmember(3)',
    },
    {
      name: 'Members that are functions',
      desc: 'member() also works as a decorator on a def.',
      code: 'from enum import Enum, member\nclass Op(Enum):\n    @member\n    def add(a, b):\n        return a + b\n\n    @member\n    def sub(a, b):\n        return a - b\n\nOp.add.value(2, 3)',
    },
    {
      name: 'A nested class as a member',
      desc: 'Since 3.13 nested classes are plain attributes; wrap one in member() to keep it a member.',
      code: 'from enum import Enum, member\nclass Shape(Enum):\n    @member\n    class Circle:\n        sides = 0',
    },
  ],

  examples: [
    { title: 'nonmember keeps a plain attribute', code: 'from enum import Enum, nonmember\nclass Status(Enum):\n    OK = 0\n    ERROR = 1\n    MAX_RETRIES = nonmember(3)\n(list(Status), Status.MAX_RETRIES)', returns: '([<Status.OK: 0>, <Status.ERROR: 1>], 3)' },
    { title: 'Not an alias, even with the same value', code: 'from enum import Enum, nonmember\nclass Color(Enum):\n    RED = 1\n    DEFAULT = nonmember(1)\n(Color.DEFAULT, Color(1))', returns: '(1, <Color.RED: 1>)' },
    { title: 'Functions are not members',     code: 'from enum import Enum\nclass Op(Enum):\n    ADD = 1\n    helper = lambda x: x * 2\n(list(Op), Op.helper(5))', returns: '([<Op.ADD: 1>], 10)' },
    { title: 'member() makes them members',   code: 'from enum import Enum, member\nclass Op(Enum):\n    ADD = member(lambda a, b: a + b)\n([m.name for m in Op], Op.ADD.value(2, 3))', returns: "(['ADD'], 5)" },
    { title: 'Nested classes are not members (3.13)', code: 'from enum import Enum\nclass Outer(Enum):\n    A = 1\n    class Inner:\n        pass\nlist(Outer)', returns: '[<Outer.A: 1>]' },
    { title: 'The wrappers themselves',       code: 'from enum import member, nonmember\n(member(1).value, nonmember(1).value)', returns: '(1, 1)' },
  ],

  pitfalls: [
    {
      name: 'A configuration constant inside the enum',
      desc: 'Every plain value in the body is a member, so MAX_RETRIES shows up in iteration, lookups and len(). Wrap it in nonmember().',
      wrong: { label: 'MAX_RETRIES = 3',            code: 'from enum import Enum\nclass Status(Enum):\n    OK = 0\n    ERROR = 1\n    MAX_RETRIES = 3\nlist(Status)', output: '[<Status.OK: 0>, <Status.ERROR: 1>, <Status.MAX_RETRIES: 3>]' },
      fix:   { label: 'MAX_RETRIES = nonmember(3)', code: 'from enum import Enum, nonmember\nclass Status(Enum):\n    OK = 0\n    ERROR = 1\n    MAX_RETRIES = nonmember(3)\nlist(Status)', output: '[<Status.OK: 0>, <Status.ERROR: 1>]' },
    },
    {
      name: 'Functions as values without member()',
      desc: 'A function in the body is a method, not a member — the enum ends up empty.',
      wrong: { label: 'ADD = lambda …',         code: 'from enum import Enum\nclass Op(Enum):\n    ADD = lambda a, b: a + b\n    SUB = lambda a, b: a - b\n[m.name for m in Op]', output: '[]' },
      fix:   { label: 'ADD = member(lambda …)', code: 'from enum import Enum, member\nclass Op(Enum):\n    ADD = member(lambda a, b: a + b)\n    SUB = member(lambda a, b: a - b)\n[m.name for m in Op]', output: "['ADD', 'SUB']" },
    },
  ],

  when: {
    use: [
      'nonmember(): constants, lookup tables or defaults that belong to the enum but are not choices',
      'member(): strategy-style enums whose values are functions or classes',
    ],
    avoid: [
      'Values that should be members anyway — plain assignment already does that',
      'Methods meant to be called on members → an ordinary def',
    ],
  },

  notes: {
    cpython:       'Lib/enum.py: member and nonmember are one-attribute wrapper classes (.value); EnumDict.__setitem__ unwraps them while the class body runs',
    'Default rule': 'Members: plain values. Not members: functions and other descriptors (property, staticmethod, …), _sunder_ / __dunder__ / private names, names in _ignore_, and nested classes',
    'Nested classes': 'Python 3.12 still made a nested class a member (with a DeprecationWarning); 3.13 makes it a plain attribute — member() restores the old behaviour',
  },

  related: [
    { name: 'EnumDict', slug: 'enumdict', when: 'Where the member rules live' },
    { name: 'Enum',     slug: 'enum',     when: 'Members, aliases and methods' },
    { name: 'property', slug: 'property', when: 'enum.property for member attributes' },
    { name: 'lambda',   slug: 'lambda',   when: 'Function values', category: 'keywords' },
  ],

  faq: [
    {
      q: 'How do I add a constant to an enum that is not a member?',
      a: 'Wrap it: MAX = nonmember(10). It is then an ordinary class attribute (Status.MAX == 10) and does not appear in iteration, len() or lookups.',
    },
    {
      q: 'Can an enum member value be a function?',
      a: 'Yes, with member(): ADD = member(lambda a, b: a + b), or @member on a def. Call it through .value: Op.ADD.value(2, 3).',
    },
    {
      q: 'Why did my nested class stop being an enum member?',
      a: 'Python 3.13 no longer makes classes defined inside an enum into members (3.12 warned about it). Decorate the nested class with @member if it should be one.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.member',
    meta:  'enum.member / enum.nonmember',
  },

};
