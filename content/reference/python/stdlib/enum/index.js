// content/reference/python/stdlib/enum/index.js — the enum module hub

export const meta = {
  slug:        'index',
  name:        'enum',
  signature:   'import enum',
  blurb:       'Named constants that are their own type — Enum, IntEnum, StrEnum, Flag and IntFlag, plus auto(), unique and verify.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'enum module python enumeration enum class constants Enum IntEnum StrEnum Flag IntFlag ReprEnum auto unique verify member value name lookup by value lookup by name bit flags EnumType EnumMeta',
};

export const method = {
  slug: 'index',
  name: 'enum',

  category:    'Data types',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'An enumeration is a class whose attributes are its only instances: Color.RED is a Color, compares by identity, has a name and a value, and can be looked up by either. Flag adds bitwise combinations; IntEnum and StrEnum make members drop-in replacements for int and str constants.',

  // every public name these classes define themselves must have a member page
  coverClasses: ['Enum', 'EnumDict'],

  imports: ['from enum import Enum, auto', 'from enum import IntEnum, StrEnum, Flag, IntFlag', 'import enum'],
  facts: [
    { label: 'Base classes', value: 'Enum, IntEnum, StrEnum, Flag, IntFlag, ReprEnum — subclass one and list the members as class attributes' },
    { label: 'Helpers',      value: 'auto, unique, verify (with EnumCheck), member, nonmember, property, global_enum, FlagBoundary' },
    { label: 'Metaclass',    value: 'EnumType (EnumMeta is the old name) — it builds the members and gives the class len(), iteration, in, [] and ()' },
    { label: 'History',      value: '3.4 Enum, IntEnum, unique · 3.6 Flag, IntFlag, auto · 3.11 StrEnum, ReprEnum, verify, FlagBoundary, member, nonmember, global_enum · 3.13 EnumDict' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'by value',
      blurb: 'Calling the class looks a member up by its VALUE. Type a value — a number, or text.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value to look up', input: 'auto' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\nColor({$value})',
      cases: [
        { id: 'two',   label: '2',        values: { value: '2' } },
        { id: 'four',  label: '4',        values: { value: '4' } },
        { id: 'name',  label: "'GREEN'",  values: { value: 'GREEN' } },
        { id: 'neg',   label: '-1',       values: { value: '-1' } },
      ],
    },
    {
      id: 'name',
      label: 'by name',
      blurb: 'Square brackets look a member up by its NAME — exact, case-sensitive.',
      params: [{ name: 'name', type: 'str', hint: 'a member name', input: 'text' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\nColor[{$name}]',
      cases: [
        { id: 'blue',  label: 'BLUE', values: { name: 'BLUE' } },
        { id: 'lower', label: 'blue', values: { name: 'blue' } },
        { id: 'empty', label: 'empty', values: { name: '' } },
      ],
    },
    {
      id: 'flags',
      label: 'Flag',
      blurb: 'A Flag value can be any combination of its members — type an integer and see which bits it names.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\nPerm({$value})',
      cases: [
        { id: 'rw',   label: '6',  values: { value: '6' } },
        { id: 'all',  label: '7',  values: { value: '7' } },
        { id: 'none', label: '0',  values: { value: '0' } },
        { id: 'bad',  label: '8',  values: { value: '8' } },
      ],
    },
  ],
  demoExplainer: "Color(...) never matches a member by name: 'GREEN' is a value lookup that fails with ValueError, while Color['GREEN'] works — and a wrong name raises KeyError instead. In the Flag tab, 6 is R|W because 4 + 2 = 6, and 0 is the empty flag <Perm: 0>. 8 has a bit that no member owns; Flag's default boundary (STRICT) rejects it and the error shows the bits given against the bits allowed.",

  patterns: [
    {
      name: 'Define a set of constants',
      desc: 'auto() picks the values when they do not matter.',
      code: 'from enum import Enum, auto\nclass Status(Enum):\n    PENDING = auto()\n    ACTIVE = auto()\n    CLOSED = auto()',
    },
    {
      name: 'Parse outside input into a member',
      desc: 'By value with Status(raw), by name with Status[raw]; both raise on unknown input.',
      code: 'try:\n    status = Status[raw.upper()]\nexcept KeyError:\n    raise ValueError(f"unknown status: {raw!r}") from None',
    },
    {
      name: 'Branch on a member',
      desc: 'Dotted names are value patterns in match statements.',
      code: 'match status:\n    case Status.PENDING:\n        queue(job)\n    case Status.ACTIVE | Status.CLOSED:\n        log(job)',
    },
    {
      name: 'Store and send the value, not the member',
      desc: 'json and databases understand member.value; rebuild with the class on the way back in.',
      code: 'payload = {"status": job.status.value}\njob.status = Status(payload["status"])',
    },
  ],

  examples: [
    { title: 'Members have a name and a value', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n(Color.RED.name, Color.RED.value)', returns: "('RED', 1)" },
    { title: 'Iterate in definition order',     code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\n[m.name for m in Color]', returns: "['RED', 'GREEN', 'BLUE']" },
    { title: 'Lookups return the same object',  code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor['RED'] is Color(1) is Color.RED", returns: 'True' },
    { title: 'A plain Enum is not its value',   code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED == 1', returns: 'False' },
    { title: 'IntEnum members are ints',        code: 'from enum import IntEnum\nclass Priority(IntEnum):\n    LOW = 1\n    HIGH = 3\n(Priority.HIGH + 1, Priority.HIGH == 3)', returns: '(4, True)' },
    { title: 'Flags combine with |',            code: 'from enum import Flag, auto\nclass Perm(Flag):\n    R = auto()\n    W = auto()\n    X = auto()\nPerm.R | Perm.W', returns: '<Perm.R|W: 3>' },
    { title: 'The functional API',              code: "from enum import Enum\nAnimal = Enum('Animal', 'ANT BEE CAT')\nlist(Animal)", returns: '[<Animal.ANT: 1>, <Animal.BEE: 2>, <Animal.CAT: 3>]' },
  ],

  pitfalls: [
    {
      name: 'Comparing a member with its value',
      desc: 'A plain Enum member never equals its raw value. Compare members with members, or convert the raw value with the class first.',
      wrong: { label: 'member == 1', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nraw = 1\n'red' if raw == Color.RED else 'other'", output: "'other'" },
      fix:   { label: 'Color(raw)',  code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nraw = 1\n'red' if Color(raw) is Color.RED else 'other'", output: "'red'" },
    },
    {
      name: 'Serializing members with json',
      desc: 'json does not know Enum. Send .value (or use IntEnum / StrEnum, which json writes as the plain int or str).',
      wrong: { label: 'json.dumps(member)', code: 'import json\nfrom enum import Enum\nclass Color(Enum):\n    RED = 1\njson.dumps({"color": Color.RED})', output: 'TypeError: Object of type Color is not JSON serializable' },
      fix:   { label: '.value',              code: 'import json\nfrom enum import Enum\nclass Color(Enum):\n    RED = 1\njson.dumps({"color": Color.RED.value})', output: '\'{"color": 1}\'' },
    },
    {
      name: 'Adding members by subclassing',
      desc: 'An enum with members is final. Build a new enum (or list all members in one class) instead.',
      wrong: { label: 'subclass', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nclass MoreColor(Color):\n    PINK = 2', output: "TypeError: <enum 'MoreColor'> cannot extend <enum 'Color'>" },
      fix:   { label: 'new enum', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nMoreColor = Enum('MoreColor', [(m.name, m.value) for m in Color] + [('PINK', 2)])\nlist(MoreColor)", output: '[<MoreColor.RED: 1>, <MoreColor.PINK: 2>]' },
    },
  ],

  when: {
    use: [
      'A fixed set of choices: states, modes, categories, error codes',
      'Replacing magic numbers and strings with names that show up in reprs and tracebacks',
      'Bit flags that combine (Flag / IntFlag) instead of raw int masks',
    ],
    avoid: [
      'Values that change at run time or come from configuration → a dict or a dataclass',
      'Plain groups of unrelated constants → module-level names',
      'Records with several fields per item → namedtuple or a dataclass (an Enum can carry tuples, but every value is fixed)',
    ],
  },

  notes: {
    cpython:     'Lib/enum.py — pure Python. EnumType (the metaclass) turns the class body into members; the stdlib itself uses it for re.RegexFlag, http.HTTPStatus, signal.Signals and more',
    'Identity':  'Each member is created once, when the class is created; every lookup returns that same object, so `is` is the right comparison',
    'Since 3.12': '`value in EnumClass` checks values as well as members (before 3.12 a non-member raised TypeError)',
  },

  related: [
    { name: 'Enum',      slug: 'enum',      when: 'The base class and its lookup rules' },
    { name: 'Flag',      slug: 'flag',      when: 'Members that combine with | & ^ ~' },
    { name: 'IntEnum',   slug: 'intenum',   when: 'Members that are also ints' },
    { name: 'StrEnum',   slug: 'strenum',   when: 'Members that are also strs' },
    { name: 'IntFlag',   slug: 'intflag',   when: 'Bit flags that are also ints' },
    { name: 'auto',      slug: 'auto',      when: 'Let Python pick the values' },
    { name: 'verify',    slug: 'verify',    when: 'Check for aliases, gaps and unnamed bits' },
    { name: 'match',     slug: 'match',     when: 'Branch on members', category: 'keywords' },
    { name: 'json module', slug: 'json',    when: 'Serialize .value, not the member', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get an enum member from a string in Python?',
      a: "By name use square brackets: Color['RED'] (KeyError if there is no such name). By value call the class: Color('red') when the values are strings (ValueError if no member has that value). Calling Color('RED') with a name does not work unless some member's value is 'RED'.",
    },
    {
      q: 'What is the difference between Enum and IntEnum?',
      a: 'IntEnum members are also ints: they compare equal to numbers, sort, do arithmetic and serialize to JSON as numbers. Plain Enum members are not equal to anything except themselves, which catches accidental mixing of unrelated constants. Since 3.11 str() of an IntEnum member is the number ("3"), not "Priority.HIGH"; format() and f-strings already used the number before.',
    },
    {
      q: 'How do I list all the values of an enum?',
      a: '[m.value for m in Color] — iteration gives the members in definition order, without aliases. Color.__members__ is a read-only mapping of every name (aliases included) to its member.',
    },
    {
      q: 'Should I compare enum members with == or is?',
      a: 'Either works for members of the same enum, because every lookup returns the one object created for that member. `is` states the intent; == is what IntEnum and StrEnum need when you compare with a raw int or str.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html',
    meta:  'enum — Support for enumerations',
  },

};
