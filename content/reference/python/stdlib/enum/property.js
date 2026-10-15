// content/reference/python/stdlib/enum/property.js

export const meta = {
  slug:        'property',
  name:        'enum.property',
  signature:   '@enum.property',
  blurb:       'The property for enums: on a member it works like the built-in property, on the class it returns the member of the same name — which is how members called name or value can exist.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'enum.property python enum property member named name member named value DynamicClassAttribute enum attribute same name as member computed attribute enum has no attribute cannot set attribute',
};

export const method = {
  slug:      'property',
  name:      'enum.property',
  signature: '@enum.property',
  returns:   { type: 'enum.property', desc: 'A descriptor: member.attr calls the getter; Cls.attr returns the member called attr, or raises AttributeError.' },

  category:    'enum helper',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: "Enum's own name and value are enum.property objects. Because class access looks for a member instead of returning the descriptor, an enum may have members called name and value without breaking member.name and member.value. Use it for your own computed member attributes too.",

  covers: ['property'],

  cheat: {
    commonCall: '@property\ndef label(self):\n    return self.name.title()',
    returns:    "Color.RED.label → 'Red'",
    replaces:   'builtins.property inside enums',
    watchOut:   'Color.label (on the class) raises AttributeError unless a member is called label',
  },

  parameters: [
    { name: 'fget', type: 'callable', required: false, default: 'None', desc: 'Getter, called with the member (the decorated function).' },
    { name: 'fset', type: 'callable', required: false, default: 'None', desc: `Setter; without one, assignment raises AttributeError("<enum 'Cls'> cannot set attribute ...").` },
  ],

  modes: [
    {
      id: 'names',
      label: 'members called name / value',
      blurb: 'This enum has members called name and value. Type a member name.',
      params: [{ name: 'member', type: 'str', hint: 'a member name', input: 'text' }],
      template: "from enum import Enum\nclass Field(Enum):\n    name = 'n'\n    value = 'v'\n    size = 's'\nm = Field[{$member}]\n(m, m.name, m.value)",
      cases: [
        { id: 'name',  label: 'name',  values: { member: 'name' } },
        { id: 'value', label: 'value', values: { member: 'value' } },
        { id: 'size',  label: 'size',  values: { member: 'size' } },
        { id: 'upper', label: 'NAME',  values: { member: 'NAME' } },
      ],
    },
    {
      id: 'label',
      label: 'your own property',
      blurb: 'A computed attribute with @enum.property. Type a member name.',
      params: [{ name: 'name', type: 'str', hint: 'a member name', input: 'text' }],
      template: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    DARK_BLUE = 2\n    @property\n    def label(self):\n        return self.name.replace('_', ' ').title()\nColor[{$name}].label",
      cases: [
        { id: 'blue', label: 'DARK_BLUE', values: { name: 'DARK_BLUE' } },
        { id: 'red',  label: 'RED',       values: { name: 'RED' } },
        { id: 'bad',  label: 'BLUE',      values: { name: 'BLUE' } },
      ],
    },
  ],
  demoExplainer: "Field.name on the class is the member called name, but m.name on any member is still its name, because Enum.name is an enum.property: instance access runs the getter, class access finds the member. In the second tab label is computed from the member's name; Color['BLUE'] fails before label is reached.",

  patterns: [
    {
      name: 'Computed member attributes',
      desc: 'Derive display text or flags from name and value.',
      code: "from enum import Enum, property\nclass Status(Enum):\n    IN_PROGRESS = 1\n    DONE = 2\n\n    @property\n    def label(self):\n        return self.name.replace('_', ' ').title()\n\n    @property\n    def is_final(self):\n        return self is Status.DONE",
    },
    {
      name: 'Fields named after enum attributes',
      desc: 'Model data whose natural names clash with name or value.',
      code: "from enum import Enum\nclass Column(Enum):\n    name = 'name'\n    value = 'value'\n    created = 'created_at'",
    },
  ],

  examples: [
    { title: 'Members called name and value',   code: "from enum import Enum\nclass Field(Enum):\n    name = 'n'\n    value = 'v'\n(Field.name, Field.name.name, Field.name.value)", returns: "(<Field.name: 'n'>, 'name', 'n')" },
    { title: 'Enum.name is an enum.property',   code: 'from enum import Enum\ntype(Enum.__dict__["name"])', returns: "<class 'enum.property'>" },
    { title: 'A computed attribute',            code: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    DARK_BLUE = 2\n    @property\n    def label(self):\n        return self.name.replace('_', ' ').title()\nColor.DARK_BLUE.label", returns: "'Dark Blue'" },
    { title: 'Class access looks for a member', code: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    @property\n    def label(self):\n        return self.name.title()\nColor.label", returns: "AttributeError: <enum 'Color'> has no attribute 'label'" },
    { title: 'The built-in property returns itself instead', code: 'import builtins\nfrom enum import Enum\nclass Color(Enum):\n    RED = 1\n    @builtins.property\n    def label(self):\n        return self.name.title()\ntype(Color.label).__name__', returns: "'property'" },
    { title: 'Read-only without a setter',      code: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    @property\n    def label(self):\n        return self.name.title()\nColor.RED.label = 'x'", returns: "AttributeError: <enum 'Color'> cannot set attribute 'label'" },
    { title: 'Built on DynamicClassAttribute',  code: 'import enum, types\nissubclass(enum.property, types.DynamicClassAttribute)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'A member and a property with the same name in one body',
      desc: 'Each name in an enum body can be set once; a property cannot replace a member (or the other way round). Give the property another name.',
      wrong: { label: 'size twice', code: 'from enum import Enum, property\nclass Box(Enum):\n    size = 1\n    @property\n    def size(self):\n        return 2', output: "TypeError: 'size' already defined as 1" },
      fix:   { label: 'two names',  code: 'from enum import Enum, property\nclass Box(Enum):\n    size = 1\n    @property\n    def doubled(self):\n        return self.value * 2\nBox.size.doubled', output: '2' },
    },
    {
      name: 'Reading a property from the class',
      desc: 'Unlike builtins.property, enum.property has nothing to return on the class (unless a member has that name). Read it from a member.',
      wrong: { label: 'Color.label',     code: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    @property\n    def label(self):\n        return self.name.title()\nColor.label", output: "AttributeError: <enum 'Color'> has no attribute 'label'" },
      fix:   { label: 'Color.RED.label', code: "from enum import Enum, property\nclass Color(Enum):\n    RED = 1\n    @property\n    def label(self):\n        return self.name.title()\nColor.RED.label", output: "'Red'" },
    },
  ],

  when: {
    use: [
      'Computed attributes on enum members (labels, groupings, derived numbers)',
      'Enums that need members named name, value or after other attributes',
    ],
    avoid: [
      'Attributes that should be readable on the class itself → a classmethod or nonmember()',
      'Data that changes at run time → keep it outside the enum',
    ],
  },

  notes: {
    cpython:      'Lib/enum.py: class property(types.DynamicClassAttribute). __get__ with no instance returns the member stored for that name or raises AttributeError; with an instance it calls fget',
    'Shadowing':  'When a member name collides with an attribute inherited from a base (such as Enum.name), EnumType._add_member_ installs an enum.property that remembers the member, so both kinds of access keep working',
    'Name clash': 'enum.property shadows the built-in property after from enum import property; import enum and write @enum.property to keep both',
  },

  related: [
    { name: 'Enum.name / Enum.value', slug: 'name-value', when: 'The two built-in enum properties' },
    { name: 'member / nonmember',     slug: 'member-nonmember', when: 'What becomes a member' },
    { name: 'Enum',     slug: 'enum',     when: 'Methods and properties on members' },
    { name: 'property()', slug: 'property', when: 'The built-in property', category: 'functions' },
  ],

  faq: [
    {
      q: 'Can an enum have a member called name or value?',
      a: "Yes. Enum.name and Enum.value are enum.property descriptors: Field.name returns the member called name, while Field.name.name is still 'name'.",
    },
    {
      q: 'Should I use enum.property or the built-in property in an enum?',
      a: 'Both work for reading an attribute from a member. enum.property also lets a member share the name and raises AttributeError on class access; the built-in property returns the property object on the class.',
    },
    {
      q: 'Why does MyEnum.my_property raise AttributeError?',
      a: 'With enum.property, class access looks for a member with that name. Read the property from a member instead: MyEnum.SOME_MEMBER.my_property.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/enum.html#enum.property',
    meta:  'enum.property',
  },

};
