// content/reference/python/stdlib/enum/intenum.js

export const meta = {
  slug:        'intenum',
  name:        'enum.IntEnum',
  signature:   'class Name(enum.IntEnum)',
  blurb:       'An Enum whose members are also ints: they compare with numbers, sort, index lists and serialize as plain integers.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+ (str() is the number since 3.11)',
  searchTerms: 'intenum python enum.IntEnum integer enum int enum compare enum with int sort enum enum json serialize http status codes HTTPStatus str returns number 3.11 change format int',
};

export const method = {
  slug:      'intenum',
  name:      'enum.IntEnum',
  signature: 'class Name(enum.IntEnum)',
  returns:   { type: 'EnumType', desc: 'An enum class whose members are int instances.' },

  category:    'enum class',
  version:     'Python 3.4+ (str() is the number since 3.11)',
  hasLiveDemo: true,

  subtitle: 'Use it where existing code expects ints — status codes, priorities, protocol numbers. The repr still says <Priority.HIGH: 3>, but str(), format() and f-strings give the number, and any arithmetic result is a plain int.',

  covers: ['IntEnum'],

  cheat: {
    commonCall: 'class Priority(IntEnum): LOW = 1; HIGH = 3',
    returns:    'Priority.HIGH == 3 → True, Priority.HIGH + 1 → 4',
    replaces:   'LOW, HIGH = 1, 3 module constants',
    watchOut:   'two unrelated IntEnums with the same number compare equal',
  },

  parameters: [
    { name: 'Name', type: 'identifier', required: true, default: null, desc: 'Your enum class. Each NAME = value in the body becomes a member; the value goes through int(), so it must be an int or something int() accepts.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'ints',
      blurb: 'Look a member up by value, then use it as the number it is.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    MEDIUM = 2\n    HIGH = 3\np = Priority({$value})\n(p, p + 1, p > Priority.LOW)',
      cases: [
        { id: 'two',   label: '2',   values: { value: '2' } },
        { id: 'one',   label: '1',   values: { value: '1' } },
        { id: 'name',  label: 'HIGH', values: { value: 'HIGH' } },
        { id: 'zero',  label: '0',   values: { value: '0' } },
      ],
    },
    {
      id: 'format',
      label: 'str · format',
      blurb: 'Type a format spec: IntEnum formats exactly like the int it is.',
      params: [{ name: 'spec', type: 'str', hint: 'a format spec', input: 'text' }],
      template: 'from enum import IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    HIGH = 3\n(str(Priority.HIGH), format(Priority.HIGH, {$spec}))',
      cases: [
        { id: 'empty', label: "''",   values: { spec: '' } },
        { id: 'pad',   label: '03d',  values: { spec: '03d' } },
        { id: 'bin',   label: '#b',   values: { spec: '#b' } },
        { id: 'pct',   label: '.1%',  values: { spec: '.1%' } },
        { id: 's',     label: 's',    values: { spec: 's' } },
      ],
    },
  ],
  demoExplainer: "p + 1 is a plain int and p > Priority.LOW compares numbers. Calling the class still looks members up by value: the text 'HIGH' is a name, not one of the values 1, 2, 3, so it raises ValueError (Priority['HIGH'] is the name lookup). In the format tab every int presentation type works (b, x, %, …), while s fails, and the error names the class: the member's own type is Priority.",

  patterns: [
    {
      name: 'Parse numeric input',
      desc: 'Convert the text, then look the member up.',
      code: 'level = Priority(int(raw))',
    },
    {
      name: 'Readable str() again',
      desc: 'Restore the Enum-style str() if you want names in output; format() keeps formatting the number.',
      code: 'from enum import Enum, IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    HIGH = 3\n    __str__ = Enum.__str__',
    },
    {
      name: 'Use the stdlib ones',
      desc: 'http.HTTPStatus, signal.Signals and socket.AddressFamily are IntEnums.',
      code: 'from http import HTTPStatus\nif response.status == HTTPStatus.NOT_FOUND:\n    ...',
    },
  ],

  examples: [
    { title: 'Members are ints',                  code: "from enum import IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    HIGH = 3\n(Priority.LOW < Priority.HIGH, Priority.HIGH * 2, ['a', 'b', 'c', 'd'][Priority.HIGH])", returns: "(True, 6, 'd')" },
    { title: 'Arithmetic gives plain ints',       code: 'from enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\ntype(Priority.HIGH + 1)', returns: "<class 'int'>" },
    { title: 'str(), f-strings and repr',          code: "from enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\n(str(Priority.HIGH), f'{Priority.HIGH}', repr(Priority.HIGH))", returns: "('3', '3', '<Priority.HIGH: 3>')" },
    { title: 'json writes the number',            code: "import json\nfrom enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\njson.dumps({'priority': Priority.HIGH})", returns: '\'{"priority": 3}\'' },
    { title: 'Values go through int()',           code: "from enum import IntEnum\nclass Level(IntEnum):\n    ONE = '1'\n    TWO = 2.9\nlist(Level)", returns: '[<Level.ONE: 1>, <Level.TWO: 2>]' },
    { title: 'An equal float finds the member',   code: 'from enum import IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    MEDIUM = 2\nPriority(2.0)', returns: '<Priority.MEDIUM: 2>' },
    { title: 'http.HTTPStatus is an IntEnum',     code: 'from http import HTTPStatus\n(HTTPStatus(404), HTTPStatus(404).phrase, HTTPStatus.OK == 200)', returns: "(<HTTPStatus.NOT_FOUND: 404>, 'Not Found', True)" },
    { title: 'Enum.__str__ brings names back to str()', code: "from enum import Enum, IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\n    __str__ = Enum.__str__\n(str(Priority.HIGH), f'{Priority.HIGH}', format(Priority.HIGH, '>4'))", returns: "('Priority.HIGH', 'Priority.HIGH', '   3')" },
  ],

  pitfalls: [
    {
      name: 'Unrelated IntEnums compare equal',
      desc: 'Members are ints, so two different enums that share a number are ==. A plain Enum keeps them apart.',
      wrong: { label: 'IntEnum', code: 'from enum import IntEnum\nclass Shape(IntEnum):\n    CIRCLE = 1\nclass Size(IntEnum):\n    SMALL = 1\nShape.CIRCLE == Size.SMALL', output: 'True' },
      fix:   { label: 'Enum',    code: 'from enum import Enum\nclass Shape(Enum):\n    CIRCLE = 1\nclass Size(Enum):\n    SMALL = 1\nShape.CIRCLE == Size.SMALL', output: 'False' },
    },
    {
      name: 'Expecting the name in an f-string',
      desc: 'Since 3.11 str() of an IntEnum member is the number, like format() already was. Ask for .name explicitly.',
      wrong: { label: "f'{member}'",      code: "from enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\nf'priority: {Priority.HIGH}'", output: "'priority: 3'" },
      fix:   { label: "f'{member.name}'", code: "from enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\nf'priority: {Priority.HIGH.name}'", output: "'priority: HIGH'" },
    },
    {
      name: 'Non-numeric values',
      desc: 'Every value is passed to int(), so text that is not a number fails while the class is being created. Use Enum (or StrEnum) for such values.',
      wrong: { label: 'IntEnum', code: "from enum import IntEnum\nclass Mode(IntEnum):\n    FAST = 'fast'", output: "ValueError: invalid literal for int() with base 10: 'fast'" },
      fix:   { label: 'Enum',    code: "from enum import Enum\nclass Mode(Enum):\n    FAST = 'fast'\nMode.FAST.value", output: "'fast'" },
    },
  ],

  when: {
    use: [
      'Replacing existing int constants without breaking code that compares, sorts or does math with them',
      'Numbers that leave the program: HTTP codes, exit codes, protocol fields, database columns',
    ],
    avoid: [
      'New code where the numbers are an implementation detail → Enum (mixing constants then becomes an error)',
      'Combinable bit options → IntFlag',
    ],
  },

  notes: {
    cpython:      'Lib/enum.py: class IntEnum(int, ReprEnum) whose body is only a docstring — ReprEnum keeps int.__str__ / int.__format__ and only the repr comes from Enum',
    '3.11 change': 'str() became int.__str__() (it was "Priority.HIGH" before); format() was already int.__format__()',
    'Hash and ==': 'From int, so members are interchangeable with their numbers as dict keys and in sets',
  },

  related: [
    { name: 'Enum',      slug: 'enum',      when: 'Members that are NOT their value' },
    { name: 'ReprEnum',  slug: 'reprenum',  when: 'The base that keeps int str() / format()' },
    { name: 'IntFlag',   slug: 'intflag',   when: 'Int members that combine with |' },
    { name: 'StrEnum',   slug: 'strenum',   when: 'The same idea for str' },
    { name: 'int',       slug: 'int',       when: 'What every member is', category: 'functions' },
  ],

  faq: [
    {
      q: 'When should I use IntEnum instead of Enum?',
      a: 'When the members must keep working as ints in code you do not control — comparisons with numbers, arithmetic, json, C APIs. If nothing needs the int behaviour, a plain Enum is stricter: Color.RED == 1 is False, so constants from different enums cannot be mixed up by accident.',
    },
    {
      q: 'Why does str() of my IntEnum print a number?',
      a: 'Python 3.11 changed IntEnum.__str__ to int.__str__ so that IntEnum can replace existing int constants without changing output. Use member.name, or put __str__ = Enum.__str__ in the class to get "Priority.HIGH" back.',
    },
    {
      q: 'How do I convert an int to an IntEnum member?',
      a: 'Call the class: Priority(3). An int that no member has raises ValueError ("5 is not a valid Priority").',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.IntEnum',
    meta:  'enum.IntEnum',
  },

};
