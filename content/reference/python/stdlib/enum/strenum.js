// content/reference/python/stdlib/enum/strenum.js

export const meta = {
  slug:        'strenum',
  name:        'enum.StrEnum',
  signature:   'class Name(enum.StrEnum)',
  blurb:       'An Enum whose members are also strs: they equal their values, take every str method, and str(), format() and json give the plain text.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'strenum python enum.StrEnum string enum str enum enum of strings compare enum with string auto lowercase name json serialize enum string value f-string enum value (str, Enum) mixin 3.11',
};

export const method = {
  slug:      'strenum',
  name:      'enum.StrEnum',
  signature: 'class Name(enum.StrEnum)',
  returns:   { type: 'EnumType', desc: 'An enum class whose members are str instances.' },

  category:    'enum class',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: "Use it for string constants that leave the program — HTTP methods, config keys, JSON fields. The repr still says <Method.GET: 'get'>, but the member == 'get', str() and f-strings give 'get', and auto() picks the lower-cased member name as the value.",

  covers: ['StrEnum'],

  cheat: {
    commonCall: 'class Method(StrEnum):\n    GET = auto()',
    returns:    "Method.GET == 'get' → True, f'{Method.GET}' → 'get'",
    replaces:   "class Method(str, Enum), whose str() is 'Method.GET'",
    watchOut:   'every value must already be a str — 1 raises TypeError',
  },

  parameters: [
    { name: 'Name', type: 'identifier', required: true, default: null, desc: 'Your enum class. Each NAME = value in the body becomes a member; the value must be a str (or the two or three arguments of str(bytes, encoding, errors)). auto() gives the lower-cased name.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'by value',
      blurb: 'auto() made the values the lower-cased names. Type a value to look up.',
      params: [{ name: 'value', type: 'str', hint: 'a value', input: 'text' }],
      template: 'from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n    POST = auto()\n    DELETE = auto()\nm = Method({$value})\n(m, str(m), m.upper())',
      cases: [
        { id: 'get',   label: 'get',   values: { value: 'get' } },
        { id: 'post',  label: 'post',  values: { value: 'post' } },
        { id: 'upper', label: 'GET',   values: { value: 'GET' } },
        { id: 'empty', label: 'empty', values: { value: '' } },
      ],
    },
    {
      id: 'format',
      label: 'format',
      blurb: 'Type a format spec: a StrEnum member formats like the str it is.',
      params: [{ name: 'spec', type: 'str', hint: 'a format spec', input: 'text' }],
      template: 'from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n    POST = auto()\nformat(Method.POST, {$spec})',
      cases: [
        { id: 'empty', label: "''",   values: { spec: '' } },
        { id: 'right', label: '>8',   values: { spec: '>8' } },
        { id: 'cut',   label: '.2',   values: { spec: '.2' } },
        { id: 's',     label: 's',    values: { spec: 's' } },
        { id: 'd',     label: 'd',    values: { spec: 'd' } },
      ],
    },
    {
      id: 'names',
      label: 'functional API',
      blurb: 'Type member names (spaces or commas): each value is the lower-cased name.',
      params: [{ name: 'names', type: 'str', hint: 'member names', input: 'text' }],
      template: "from enum import StrEnum\nMethod = StrEnum('Method', {$names})\nlist(Method)",
      cases: [
        { id: 'http',  label: 'GET POST DELETE', values: { names: 'GET POST DELETE' } },
        { id: 'mixed', label: 'Get, Post',       values: { names: 'Get, Post' } },
        { id: 'dupe',  label: 'A A',             values: { names: 'A A' } },
      ],
    },
  ],
  demoExplainer: "Calling the class matches values, and the values are 'get', 'post' and 'delete' — so 'GET' raises ValueError. m.upper() is a normal str method returning a plain str. In the format tab width, fill and precision work as on any string; when the spec changes nothing (s, or a width no larger than the text) str.__format__ hands back the object it was given, so the result is the member itself and prints as <Method.POST: 'post'>. Number codes such as d fail and name the member type, Method. In the last tab a repeated name is an error, reported with the value auto() had already given it.",

  patterns: [
    {
      name: 'String constants with auto()',
      desc: 'The value is the lower-cased member name — no typing it twice.',
      code: 'from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n    POST = auto()\n    DELETE = auto()',
    },
    {
      name: 'Parse case-insensitive input',
      desc: 'Normalise first, then look up by value.',
      code: 'method = Method(raw.strip().lower())',
    },
    {
      name: 'Compare with plain strings',
      desc: 'Members are strs, so == against request data just works.',
      code: 'if request.method == Method.POST:\n    handle_post(request)',
    },
    {
      name: 'The pre-3.11 spelling',
      desc: 'A str mixin plus str.__str__ gives the same str() and f-string text on older versions.',
      code: "from enum import Enum\nclass Method(str, Enum):\n    GET = 'get'\n    POST = 'post'\n    __str__ = str.__str__",
    },
  ],

  examples: [
    { title: 'Members are strs',              code: "from enum import StrEnum\nclass Color(StrEnum):\n    RED = 'red'\n(Color.RED == 'red', isinstance(Color.RED, str), Color.RED.upper())", returns: "(True, True, 'RED')" },
    { title: 'auto() lower-cases the name',   code: 'from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n    POST = auto()\nlist(Method)', returns: "[<Method.GET: 'get'>, <Method.POST: 'post'>]" },
    { title: 'str(), f-strings and repr',     code: "from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n(str(Method.GET), f'{Method.GET}', repr(Method.GET))", returns: "('get', 'get', \"<Method.GET: 'get'>\")" },
    { title: 'json writes the value',         code: "import json\nfrom enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\njson.dumps({'method': Method.GET})", returns: '\'{"method": "get"}\'' },
    { title: 'str operations give plain strs', code: "from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n(Method.GET + '/v1', type(Method.GET + '/v1'))", returns: "('get/v1', <class 'str'>)" },
    { title: 'in checks values',              code: "from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\n('get' in Method, 'GET' in Method)", returns: '(True, False)' },
    { title: 'Values must be strings',        code: 'from enum import StrEnum\nclass Level(StrEnum):\n    LOW = 1', returns: 'TypeError: 1 is not a string' },
  ],

  pitfalls: [
    {
      name: 'A (str, Enum) mixin in an f-string',
      desc: "Mixing str into a plain Enum makes members strs, but str() and format() still come from Enum: you get 'Color.RED' (Python 3.10 printed the value here; 3.11 and later print the name). StrEnum keeps the str behaviour.",
      wrong: { label: '(str, Enum)', code: "from enum import Enum\nclass Color(str, Enum):\n    RED = 'red'\nf'color={Color.RED}'", output: "'color=Color.RED'" },
      fix:   { label: 'StrEnum',     code: "from enum import StrEnum\nclass Color(StrEnum):\n    RED = 'red'\nf'color={Color.RED}'", output: "'color=red'" },
    },
    {
      name: 'Looking up upper-case input',
      desc: 'With auto() the values are lower-case. Normalise the input — or look up by name with [] if the input is a name.',
      wrong: { label: "Method('GET')",         code: "from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\nMethod('GET')", output: "ValueError: 'GET' is not a valid Method" },
      fix:   { label: "Method('GET'.lower())", code: "from enum import StrEnum, auto\nclass Method(StrEnum):\n    GET = auto()\nMethod('GET'.lower())", output: "<Method.GET: 'get'>" },
    },
    {
      name: 'Non-string values',
      desc: 'StrEnum does not convert values with str(); a number is rejected while the class is created.',
      wrong: { label: 'LOW = 1',   code: 'from enum import StrEnum\nclass Level(StrEnum):\n    LOW = 1\n    HIGH = 2', output: 'TypeError: 1 is not a string' },
      fix:   { label: "LOW = '1'", code: "from enum import StrEnum\nclass Level(StrEnum):\n    LOW = '1'\n    HIGH = '2'\nlist(Level)", output: "[<Level.LOW: '1'>, <Level.HIGH: '2'>]" },
    },
  ],

  when: {
    use: [
      'String values that go to JSON, HTTP, databases or config files unchanged',
      'Replacing existing string constants without changing comparisons or output',
    ],
    avoid: [
      'Constants that must not equal plain strings by accident → Enum',
      'Python 3.10 and older → class Name(str, Enum) with __str__ = str.__str__',
    ],
  },

  notes: {
    cpython:   'Lib/enum.py: class StrEnum(str, ReprEnum) with its own __new__ (a str, or the arguments of str(bytes, encoding, errors)) and _generate_next_value_ returning name.lower()',
    'Format':  'str.__format__: a spec that changes nothing returns the member object itself; an empty spec returns str(member), a plain str',
    'Hash and ==': "From str, so Method.GET and 'get' are the same dict key and set element",
  },

  related: [
    { name: 'Enum',     slug: 'enum',     when: 'Members that are NOT their value' },
    { name: 'IntEnum',  slug: 'intenum',  when: 'The same idea for ints' },
    { name: 'ReprEnum', slug: 'reprenum', when: 'The base that keeps str() and format()' },
    { name: 'auto',     slug: 'auto',     when: 'How the lower-cased values are made' },
    { name: 'str',      slug: 'str',      when: 'What every member is', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between StrEnum and (str, Enum)?',
      a: "Both make members strs. With class X(str, Enum) str() gives 'X.NAME', and since 3.11 format() and f-strings do too; StrEnum gives the value everywhere. StrEnum also checks that values are strs and makes auto() produce the lower-cased name.",
    },
    {
      q: 'How do I get the string value of a StrEnum member?',
      a: `The member already is the string: Method.GET == 'get', str(Method.GET) == 'get', and json.dumps writes "get". .value gives the same text as a plain str.`,
    },
    {
      q: 'Why does auto() give lowercase values in StrEnum?',
      a: "StrEnum defines _generate_next_value_ to return name.lower(). Assign explicit strings, or define your own _generate_next_value_ before the members, if you want something else.",
    },
    {
      q: 'Is StrEnum available in Python 3.10?',
      a: 'No, it was added in 3.11. On older versions use class Name(str, Enum) and set __str__ = str.__str__ if str() should give the value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.StrEnum',
    meta:  'enum.StrEnum',
  },

};
