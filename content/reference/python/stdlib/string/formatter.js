// content/reference/python/stdlib/string/formatter.js — string.Formatter, format(), vformat()

export const meta = {
  slug:        'formatter',
  name:        'string.Formatter',
  signature:   'string.Formatter()',
  blurb:       'str.format() as a class: format() and vformat() run the same {field!conversion:spec} syntax, and every step — parsing, lookup, conversion, formatting — is a method you can override.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.6+ (format string positional-only since 3.7)',
  searchTerms: 'string formatter python string.Formatter custom formatter subclass str.format Formatter.format Formatter.vformat vformat format with dict of values pep 3101 custom format string syntax',
};

export const method = {
  slug:      'formatter',
  name:      'string.Formatter',
  signature: 'string.Formatter()',
  returns:   { type: 'Formatter', desc: 'A formatter object; call .format(format_string, *args, **kwargs) or .vformat(format_string, args, kwargs).' },

  category:    'string class',
  version:     'Python 2.6+ (format string positional-only since 3.7)',
  hasLiveDemo: true,

  subtitle: 'On its own, Formatter().format(s, ...) gives the same result as s.format(...). Its point is subclassing: get_value, get_field, convert_field, format_field, parse and check_unused_args are hooks you replace to change one part of the pipeline.',

  covers: ['Formatter', 'Formatter.format', 'Formatter.vformat'],

  cheat: {
    commonCall: "string.Formatter().format('{0} {name}', 'hi', name='Ada')",
    returns:    "'hi Ada' — a str",
    replaces:   'regex-based mini template engines that re-implement {field} lookup',
    watchOut:   'vformat takes args and kwargs as two objects, not * and ** unpacked',
  },

  parameters: [
    { name: 'format_string', type: 'str',      required: true,  default: null, desc: 'Text with {} replacement fields — the str.format syntax. Positional-only (3.7+), so a field may be called format_string.' },
    { name: '*args',         type: 'any',      required: false, default: null, desc: 'format(): positional values for {0}, {1} and {}.' },
    { name: '**kwargs',      type: 'any',      required: false, default: null, desc: 'format(): named values for {name}.' },
    { name: 'args, kwargs',  type: 'sequence, mapping', required: false, default: null, desc: 'vformat(format_string, args, kwargs): the same values as one sequence and one mapping — pass a dict you already have without ** unpacking.' },
  ],

  modes: [
    {
      id: 'format',
      label: 'format()',
      blurb: 'Positional values from a comma-separated list, plus one keyword, name.',
      params: [
        { name: 'fmt',  type: 'str',       hint: 'format string',              input: 'text' },
        { name: 'args', type: 'list[str]', hint: 'positional values, a,b,c',   input: 'csv' },
        { name: 'name', type: 'str',       hint: 'value for {name}',           input: 'text' },
      ],
      template: 'import string\nstring.Formatter().format({$fmt}, *{$args}, name={$name})',
      cases: [
        { id: 'basic', label: 'mixed fields',   values: { fmt: '{} and {} by {name}', args: 'tea,cake', name: 'Ada' } },
        { id: 'spec',  label: 'format spec',    values: { fmt: '[{0:>8}] [{name!r:^9}]', args: 'right', name: 'mid' } },
        { id: 'index', label: 'indexing',       values: { fmt: '{0[0]}{1[0]}{name[-1]}', args: 'Grace,Hopper', name: 'x' } },
        { id: 'nested', label: 'nested width',  values: { fmt: '{0:*^{1}}', args: 'hi,10', name: 'x' } },
        { id: 'switch', label: '{} then {0}',   values: { fmt: '{} {0}', args: 'a', name: 'x' } },
        { id: 'typo',  label: 'attribute typo', values: { fmt: '{name.uper}', args: '', name: 'ada' } },
      ],
    },
    {
      id: 'vformat',
      label: 'vformat()',
      blurb: 'The values come in as a ready-made dict — no ** needed.',
      params: [
        { name: 'fmt',  type: 'str', hint: 'format string using {city} and {temp}', input: 'text' },
        { name: 'city', type: 'str', hint: 'value for city', input: 'text' },
        { name: 'temp', type: 'str', hint: 'value for temp', input: 'text' },
      ],
      template: "import string\nvalues = {'city': {$city}, 'temp': {$temp}}\nstring.Formatter().vformat({$fmt}, (), values)",
      cases: [
        { id: 'ok',      label: 'both fields', values: { fmt: '{city}: {temp} °C', city: 'Oslo', temp: '-3' } },
        { id: 'missing', label: 'unknown key', values: { fmt: '{city} {wind}', city: 'Oslo', temp: '-3' } },
        { id: 'pos',     label: 'positional',  values: { fmt: '{0}', city: 'Oslo', temp: '-3' } },
      ],
    },
  ],
  demoExplainer: "The values here are all str, so numeric specs such as :d fail. '{name[-1]}' does not mean the last character: -1 is not a number in field syntax, so it is a string key and str indexing raises TypeError. '{} {0}' raises with the message \"cannot switch from manual field specification to automatic field numbering\" — str.format reports the same mistake the other way round (\"automatic … to manual\"), because Formatter re-implements the numbering in Python. A misspelt attribute gets the usual \"Did you mean\" hint.",

  patterns: [
    {
      name: 'Default for missing keys',
      desc: 'Override get_value; positional keys still go to the base class.',
      code: 'import string\n\nclass Default(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        if isinstance(key, str):\n            return kwargs.get(key, "?")\n        return super().get_value(key, args, kwargs)\n\nDefault().format("{a}-{b}", a=1)   # \'1-?\'',
    },
    {
      name: 'Format from a dict without **',
      desc: 'vformat takes the mapping directly — any Mapping works, including ChainMap.',
      code: 'import string\nfrom collections import ChainMap\nf = string.Formatter()\nf.vformat("{user} at {host}", (), ChainMap(overrides, defaults))',
    },
    {
      name: 'Custom conversion flag',
      desc: 'convert_field receives the character after !; add your own.',
      code: 'import string\n\nclass Upper(string.Formatter):\n    def convert_field(self, value, conversion):\n        if conversion == "u":\n            return str(value).upper()\n        return super().convert_field(value, conversion)\n\nUpper().format("{0!u}", "shout")',
    },
  ],

  examples: [
    { title: 'Same result as str.format',   code: "import string\nstring.Formatter().format('{} + {} = {total}', 2, 3, total=5)", returns: "'2 + 3 = 5'" },
    { title: 'vformat with a dict',         code: "import string\nstring.Formatter().vformat('{greeting}, {0}!', ('World',), {'greeting': 'Hello'})", returns: "'Hello, World!'" },
    { title: 'Format spec and conversion',  code: "import string\nstring.Formatter().format('{0:>6}|{0!r}', 'ab')", returns: `"    ab|'ab'"` },
    { title: 'Index and attribute access',  code: "import string\nstring.Formatter().format('{0[1]} {1.imag}', 'xyz', 3j)", returns: "'y 3.0'" },
    { title: 'Missing keyword',             code: "import string\nstring.Formatter().format('{x}', y=1)", returns: "KeyError: 'x'" },
    { title: 'Missing position',            code: "import string\nstring.Formatter().format('{2}', 'a')", returns: 'IndexError: tuple index out of range' },
    { title: 'Only one nested level',       code: "import string\nstring.Formatter().format('{0:{1:{2}}}', 'a', '5', 'c')", returns: 'ValueError: Max string recursion exceeded' },
  ],

  pitfalls: [
    {
      name: 'Unpacking into vformat',
      desc: 'vformat takes exactly three arguments: the string, a sequence and a mapping.',
      wrong: { label: 'vformat(s, **d)', code: "import string\nd = {'a': 1}\nstring.Formatter().vformat('{a}', **d)", output: "TypeError: Formatter.vformat() got an unexpected keyword argument 'a'" },
      fix:   { label: 'vformat(s, (), d)', code: "import string\nd = {'a': 1}\nstring.Formatter().vformat('{a}', (), d)", output: "'1'" },
    },
    {
      name: 'Assuming str.format and Formatter agree on every edge',
      desc: 'Formatter re-implements automatic numbering in Python and only treats an all-digit field as manual. "{}{0.real}" is an error for str.format but accepted by Formatter.',
      wrong: { label: 'str.format', code: "'{}{0.real}'.format(5)", output: 'ValueError: cannot switch from automatic field numbering to manual field specification' },
      fix:   { label: 'pick one style', code: "'{0}{0.real}'.format(5)", output: "'55'" },
    },
    {
      name: 'Formatting untrusted format strings',
      desc: 'Field names can walk attributes and indexes of the values you pass, so a user-supplied format string can read data you did not mean to expose.',
      wrong: { label: 'attribute walk', code: "import string\nclass User:\n    def __init__(self):\n        self.name = 'ada'\n        self._password = 'hunter2'\nstring.Formatter().format('{u.name} {u._password}', u=User())", output: "'ada hunter2'" },
      fix:   { label: 'string.Template', code: "from string import Template\nTemplate('$name').safe_substitute(name='ada', password='hunter2')", output: "'ada'" },
    },
  ],

  when: {
    use: [
      'Changing how field names are resolved (defaults, dotted lookups in your own data, case-insensitive keys)',
      'Adding conversions (!u) or format-spec handling for your types without touching the types',
      'Validating format strings: forbid unused arguments, restrict field names',
    ],
    avoid: [
      'Plain formatting → f-strings or str.format (faster, same result)',
      'Templates written by users → string.Template',
    ],
  },

  notes: {
    cpython:       'Lib/string.py, pure Python: vformat → _vformat loops over self.parse(), resolves with get_field, then convert_field and format_field; parsing itself is the C parser of str.format (_string.formatter_parser)',
    'Recursion':   'Every format spec is formatted again with recursion_depth - 1, starting from 2 — so one level of nested fields such as {0:{1}} works and a second level raises ValueError',
    'used_args':   'vformat collects the keys actually used and passes them to check_unused_args (which does nothing by default)',
  },

  related: [
    { name: 'Formatter.parse',      slug: 'formatter-parse',      when: 'Split a format string into its pieces' },
    { name: 'Formatter.get_value',  slug: 'formatter-get_value',  when: 'Hook: how {name} and {0} are looked up' },
    { name: 'Formatter.convert_field', slug: 'formatter-convert_field', when: 'Hooks: !r/!s/!a and the format spec' },
    { name: 'Formatter.check_unused_args', slug: 'formatter-check_unused_args', when: 'Hook: reject unused arguments' },
    { name: 'str.format()',         slug: 'str-format', when: 'The built-in this class mirrors', category: 'functions' },
    { name: 'string.Template',      slug: 'template',   when: 'Simpler, safer $-substitution' },
  ],

  faq: [
    {
      q: 'What is string.Formatter used for?',
      a: 'Building your own variant of str.format. You subclass it and override one hook — get_value to supply defaults, convert_field to add conversions, format_field to format values your way, check_unused_args to be strict — and keep the rest of the standard parsing and formatting.',
    },
    {
      q: 'What is the difference between Formatter.format and Formatter.vformat?',
      a: 'format(format_string, *args, **kwargs) is a thin wrapper that calls vformat(format_string, args, kwargs). Call vformat directly when the values are already in a tuple and a dict (or any mapping).',
    },
    {
      q: 'How do I make str.format ignore missing keys?',
      a: 'Either str.format_map with a dict subclass that defines __missing__, or a Formatter subclass whose get_value returns a default when the key is not in kwargs. string.Template.safe_substitute does it built in for $-templates.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Formatter',
    meta:  'string.Formatter',
  },
};
