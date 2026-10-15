// content/reference/python/stdlib/enum/name-value.js

export const meta = {
  slug:        'name-value',
  name:        'Enum.name / Enum.value',
  signature:   'member.name · member.value',
  blurb:       'The two attributes every enum member has: name is the identifier it was defined with (a str), value is what was assigned to it.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'enum name value Enum.name Enum.value get enum name as string get enum value python member.name member.value _name_ _value_ enum to string enum to int alias name flag name None',
};

export const method = {
  slug:      'name-value',
  name:      'Enum.name / Enum.value',
  signature: 'member.name · member.value',
  returns:   { type: 'str | None · object', desc: 'name: the canonical member name (None for an unnamed Flag value); value: the member value, exactly as defined.' },

  category:    'Enum attributes',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Read-only, and always about the canonical member: an alias returns the first name defined for that value, and a Flag combination gets a name like "R|W" — or None when no member is set.',

  covers: ['Enum.name', 'Enum.value'],

  cheat: {
    commonCall: 'Color.RED.name, Color.RED.value',
    returns:    "('RED', 1)",
    replaces:   'parsing str(member), which is "Color.RED" — or "1" for IntEnum',
    watchOut:   'an alias reports the canonical name, not the one you used',
  },

  parameters: [
    { name: 'member', type: 'Enum member', required: true, default: null, desc: 'Any member (or Flag pseudo-member) of an enum class.' },
    { name: 'name',   type: 'str | None',  required: false, default: null, desc: 'The canonical name. Flag combinations join member names with "|"; unnamed values give None.' },
    { name: 'value',  type: 'object',      required: false, default: null, desc: 'The value; for IntEnum / IntFlag the int, for StrEnum the str.' },
  ],

  modes: [
    {
      id: 'value',
      label: 'by value',
      blurb: 'Look a member up by value and read both attributes.',
      params: [{ name: 'value', type: 'int | str', hint: 'a value', input: 'auto' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\nm = Color({$value})\n(m.name, m.value)',
      cases: [
        { id: 'two',  label: '2', values: { value: '2' } },
        { id: 'bad',  label: '9', values: { value: '9' } },
      ],
    },
    {
      id: 'alias',
      label: 'aliases',
      blurb: 'CRIMSON is an alias of RED. Look up either name.',
      params: [{ name: 'name', type: 'str', hint: 'a name', input: 'text' }],
      template: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\n    GREEN = 2\nm = Color[{$name}]\n(m.name, m.value)',
      cases: [
        { id: 'crimson', label: 'CRIMSON', values: { name: 'CRIMSON' } },
        { id: 'green',   label: 'GREEN',   values: { name: 'GREEN' } },
      ],
    },
    {
      id: 'flag',
      label: 'Flag',
      blurb: 'Type an integer: a Flag value names every member bit it contains.',
      params: [{ name: 'value', type: 'int', hint: 'an integer', input: 'number' }],
      template: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\np = Perm({$value})\n(p.name, p.value)',
      cases: [
        { id: 'rw',   label: '6', values: { value: '6' } },
        { id: 'rx',   label: '5', values: { value: '5' } },
        { id: 'zero', label: '0', values: { value: '0' } },
      ],
    },
  ],
  demoExplainer: 'Looking up CRIMSON returns the RED member, so its name is "RED". For a Flag, name lists the member bits in definition order (R before W before X here), and the empty value 0 has no name at all: name is None while value is 0.',

  patterns: [
    {
      name: 'Name ↔ value tables',
      desc: 'Build plain dicts for templates, APIs or config files.',
      code: 'by_name = {m.name: m.value for m in Color}\nby_value = {m.value: m.name for m in Color}',
    },
    {
      name: 'Readable labels',
      desc: 'Derive display text from the name.',
      code: 'label = member.name.replace("_", " ").title()',
    },
    {
      name: 'Round trip through storage',
      desc: 'Store .name (stable when values change) or .value; rebuild with [] or ().',
      code: 'saved = member.name\nrestored = Color[saved]',
    },
  ],

  examples: [
    { title: 'name and value',                code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n{m.name: m.value for m in Color}', returns: "{'RED': 1, 'GREEN': 2}" },
    { title: 'An alias reports the canonical name', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\n    CRIMSON = 1\nColor.CRIMSON.name', returns: "'RED'" },
    { title: 'IntEnum: str() is the value, .name is the name', code: "from enum import IntEnum\nclass Priority(IntEnum):\n    HIGH = 3\n(str(Priority.HIGH), Priority.HIGH.name)", returns: "('3', 'HIGH')" },
    { title: 'Flag combinations and the empty flag', code: 'from enum import Flag\nclass Perm(Flag):\n    R = 4\n    W = 2\n    X = 1\n(Perm(6).name, Perm(0).name)', returns: "('R|W', None)" },
    { title: 'IntFlag keeps unknown bits in the name', code: 'from enum import IntFlag\nclass Perm(IntFlag):\n    R = 4\n    W = 2\n    X = 1\nPerm(12).name', returns: "'R|8'" },
    { title: 'Members may be called name and value', code: 'from enum import Enum\nclass Field(Enum):\n    name = 1\n    value = 2\n(Field.name, Field.name.name, Field.value.value)', returns: "(<Field.name: 1>, 'name', 2)" },
    { title: 'On the class they are not attributes', code: 'from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.name', returns: "AttributeError: <enum 'Color'> has no attribute 'name'" },
  ],

  pitfalls: [
    {
      name: 'Getting the name from str()',
      desc: 'str() of a plain Enum member includes the class, and str() of an IntEnum / StrEnum member is its value. .name is always just the name.',
      wrong: { label: 'str(member)', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nstr(Color.RED)", output: "'Color.RED'" },
      fix:   { label: 'member.name', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED.name", output: "'RED'" },
    },
    {
      name: 'Renaming a member',
      desc: 'name is read-only; the error comes from the property defined on Enum.',
      wrong: { label: 'member.name = …', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nColor.RED.name = 'SCARLET'", output: "AttributeError: <enum 'Enum'> cannot set attribute 'name'" },
      fix:   { label: 'a display mapping', code: "from enum import Enum\nclass Color(Enum):\n    RED = 1\nlabels = {Color.RED: 'Scarlet'}\nlabels[Color.RED]", output: "'Scarlet'" },
    },
  ],

  when: {
    use: [
      'Serializing: write .value (or .name) to JSON, CSV or a database column',
      'Display text and logging without the "Color." prefix',
      'Checking which bits a Flag value carries by name',
    ],
    avoid: [
      'Turning names or values back into members → Color[name], Color(value)',
      'The underscore forms _name_ / _value_ in normal code — they exist for __new__ and _missing_ implementations',
    ],
  },

  notes: {
    cpython:   'Lib/enum.py: name and value are enum.property descriptors defined on Enum that return _name_ and _value_; on the class they look up a member with that name instead',
    'Flags':   'Flag._missing_ builds the name of a combination from the member names in definition order, plus the leftover bits for IntFlag (e.g. "R|8"); 0 gets None',
    'Aliases': 'An alias is the same object as the first member with that value, so it carries that member\'s name',
  },

  related: [
    { name: 'Enum',     slug: 'enum',     when: 'Look members up by value and by name' },
    { name: 'Flag',     slug: 'flag',     when: 'Combination names like R|W' },
    { name: 'property', slug: 'property', when: 'Why a member can be called name or value' },
    { name: 'IntEnum',  slug: 'intenum',  when: 'str() is the value there' },
  ],

  faq: [
    {
      q: 'How do I get the name of an enum member as a string?',
      a: "member.name — e.g. Color.RED.name is 'RED'. To go from a value to the name: Color(1).name.",
    },
    {
      q: 'How do I get the value of an enum member?',
      a: 'member.value. For all values of an enum: [m.value for m in Color] (aliases are skipped because iteration skips them).',
    },
    {
      q: 'Why is the name None?',
      a: 'Only Flag values can be unnamed: the empty flag (value 0, unless a member is defined as 0) and, in flags with the KEEP boundary such as IntFlag, values made only of bits no member owns. Their repr shows just the class and the number, e.g. <Perm: 0>.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.Enum.name',
    meta:  'enum.Enum.name / enum.Enum.value',
  },

};
