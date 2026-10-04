// content/reference/python/stdlib/string/formatter-get_value.js — Formatter.get_value / get_field

export const meta = {
  slug:        'formatter-get_value',
  name:        'Formatter.get_value / get_field',
  signature:   'Formatter.get_value(key, args, kwargs) · Formatter.get_field(field_name, args, kwargs)',
  blurb:       'The lookup hooks of string.Formatter: get_field resolves a whole field name like "0[1].y", get_value fetches its first part from args or kwargs.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'formatter get_value get_field python Formatter.get_value Formatter.get_field string.Formatter default value missing key format KeyError dotted field names nested dict format custom lookup',
};

export const method = {
  slug:      'formatter-get_value',
  name:      'Formatter.get_value / get_field',
  signature: 'Formatter.get_value(key, args, kwargs) · Formatter.get_field(field_name, args, kwargs)',
  returns:   { type: 'object · tuple[object, int | str]', desc: 'get_value: the argument. get_field: (the resolved object, the key that was used — what vformat records as "used").' },

  category:    'Formatter method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'get_field splits "0[1].y" into the key 0 and the steps [1] and .y; get_value(0, args, kwargs) returns args[0]; the steps are applied with normal indexing and getattr. Override get_value to change where values come from, get_field to change what a field name means.',

  covers: ['Formatter.get_value', 'Formatter.get_field'],

  cheat: {
    commonCall: 'class D(string.Formatter):\n    def get_value(self, key, args, kwargs): ...',
    returns:    'whatever you return is formatted in place of the field',
    replaces:   "try/except KeyError around str.format, or format_map with a __missing__ dict",
    watchOut:   'key is an int for {0} and {} but a str for {name} — handle both',
  },

  parameters: [
    { name: 'key',        type: 'int | str', required: true, default: null, desc: 'get_value: the first part of the field name — an int when it is all digits (or an automatic {} field), else a str.' },
    { name: 'field_name', type: 'str',       required: true, default: null, desc: "get_field: the whole field name as parse() returned it, e.g. '0[1].y' or 'user.name'." },
    { name: 'args',       type: 'sequence',  required: true, default: null, desc: 'The positional values given to vformat (the *args of format).' },
    { name: 'kwargs',     type: 'mapping',   required: true, default: null, desc: 'The keyword values given to vformat (the **kwargs of format).' },
  ],

  modes: [
    {
      id: 'default',
      label: 'default for missing',
      blurb: 'A subclass whose get_value fills in missing names instead of raising KeyError.',
      params: [
        { name: 'fmt',  type: 'str', hint: 'format string',    input: 'text' },
        { name: 'name', type: 'str', hint: 'value for {name}', input: 'text' },
      ],
      template: "import string\nclass Default(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        if isinstance(key, str):\n            return kwargs.get(key, '<' + key + '?>')\n        return super().get_value(key, args, kwargs)\nDefault().format({$fmt}, 'first', name={$name})",
      cases: [
        { id: 'missing', label: 'missing name',   values: { fmt: '{name} owes {amount}', name: 'Ada' } },
        { id: 'pos',     label: 'positional',     values: { fmt: '{0} / {1}', name: 'Ada' } },
        { id: 'chain',   label: 'missing.attr',   values: { fmt: '{user.name}', name: 'Ada' } },
        { id: 'spec',    label: 'with a spec',    values: { fmt: '[{name:>6}] [{city:>9}]', name: 'Ada' } },
      ],
    },
    {
      id: 'field',
      label: 'get_field',
      blurb: "Resolve a field name against args ('xyz',) and kwargs {'name': ...}.",
      params: [
        { name: 'field', type: 'str', hint: "e.g. 0[1], name[0], name.upper", input: 'text' },
        { name: 'name',  type: 'str', hint: "value for name", input: 'text' },
      ],
      template: "import string\nstring.Formatter().get_field({$field}, ('xyz',), {'name': {$name}})",
      cases: [
        { id: 'zero',  label: '0',          values: { field: '0', name: 'Ada' } },
        { id: 'index', label: '0[1]',       values: { field: '0[1]', name: 'Ada' } },
        { id: 'named', label: 'name[0]',    values: { field: 'name[0]', name: 'Ada' } },
        { id: 'typo',  label: 'name.uper',  values: { field: 'name.uper', name: 'Ada' } },
        { id: 'out',   label: '0[5]',       values: { field: '0[5]', name: 'Ada' } },
        { id: 'empty', label: '0.',         values: { field: '0.', name: 'Ada' } },
      ],
    },
  ],
  demoExplainer: "get_field returns the object and the key it started from — 0 or 'name' — which is what vformat passes on to check_unused_args. get_value is only asked for the first part: in '{user.name}' the default for user is the string '<user?>', and .name is then looked up on that string, which fails. Positional keys are ints and go to the base class, so '{1}' still raises IndexError with only one positional value.",

  patterns: [
    {
      name: 'Dotted lookups into nested dicts',
      desc: 'Override get_field to treat a.b.c as dictionary keys instead of attributes.',
      code: "import string\n\nclass Dotted(string.Formatter):\n    def get_field(self, field_name, args, kwargs):\n        obj = kwargs\n        for part in field_name.split('.'):\n            obj = obj[part]\n        return obj, field_name\n\nDotted().format('{user.name} ({user.role})', user={'name': 'Ada', 'role': 'admin'})",
    },
    {
      name: 'Values from several sources',
      desc: 'Look in kwargs first, then in a fallback mapping such as settings or os.environ.',
      code: 'import string\n\nclass Layered(string.Formatter):\n    def __init__(self, fallback):\n        self.fallback = fallback\n    def get_value(self, key, args, kwargs):\n        if isinstance(key, str) and key not in kwargs:\n            return self.fallback[key]\n        return super().get_value(key, args, kwargs)',
    },
    {
      name: 'Forbid attribute and index access',
      desc: 'Only plain names — safer for format strings you did not write.',
      code: 'import string\n\nclass Plain(string.Formatter):\n    def get_field(self, field_name, args, kwargs):\n        if not field_name.isidentifier():\n            raise ValueError(f"field not allowed: {field_name!r}")\n        return self.get_value(field_name, args, kwargs), field_name',
    },
  ],

  examples: [
    { title: 'get_value with an int key',   code: "import string\nstring.Formatter().get_value(0, ('a', 'b'), {})",      returns: "'a'" },
    { title: 'get_value with a str key',    code: "import string\nstring.Formatter().get_value('x', (), {'x': 1})",       returns: '1' },
    { title: 'A digit string is a str key', code: "import string\nstring.Formatter().get_value('0', ('a',), {})",          returns: "KeyError: '0'" },
    { title: 'get_field walks the steps',   code: "import string\nstring.Formatter().get_field('0[1]', ('xy',), {})",      returns: "('y', 0)" },
    { title: 'Attribute step',              code: "import string\nstring.Formatter().get_field('n.real', (), {'n': 3})",    returns: "(3, 'n')" },
    { title: 'Missing keyword',             code: "import string\nstring.Formatter().get_field('a', (), {})",               returns: "KeyError: 'a'" },
    { title: 'Empty attribute',             code: "import string\nstring.Formatter().get_field('0.', ('a',), {})",          returns: 'ValueError: Empty attribute in format string' },
  ],

  pitfalls: [
    {
      name: 'Handling only str keys',
      desc: 'An override that always looks in kwargs breaks {} and {0}: their key is an int.',
      wrong: { label: 'kwargs only', code: "import string\nclass D(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        return kwargs.get(key, '?')\nD().format('{} {x}', 'a', x='b')", output: "'? b'" },
      fix:   { label: 'delegate ints', code: "import string\nclass D(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        if isinstance(key, int):\n            return super().get_value(key, args, kwargs)\n        return kwargs.get(key, '?')\nD().format('{} {x}', 'a', x='b')", output: "'a b'" },
    },
    {
      name: 'Expecting get_value to see the whole field name',
      desc: "For '{user.name}' get_value receives only 'user'. To supply defaults for the full path, override get_field.",
      wrong: { label: 'get_value default', code: "import string\nclass D(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        return kwargs.get(key, '')\nD().format('{user.name}')", output: "AttributeError: 'str' object has no attribute 'name'" },
      fix:   { label: 'get_field default', code: "import string\nclass D(string.Formatter):\n    def get_field(self, field_name, args, kwargs):\n        try:\n            return super().get_field(field_name, args, kwargs)\n        except (KeyError, IndexError, AttributeError):\n            return '', field_name\nD().format('{user.name}')", output: "''" },
    },
  ],

  when: {
    use: [
      'Defaults for missing fields, layered value sources, case-insensitive keys — get_value',
      'A different meaning for dots and brackets, or forbidding them — get_field',
    ],
    avoid: [
      'One-off defaults → str.format_map with a dict subclass that defines __missing__',
      '$-templates with missing names → Template.safe_substitute',
    ],
  },

  notes: {
    cpython:      "get_field: first, rest = _string.formatter_field_name_split(field_name); obj = self.get_value(first, args, kwargs); then getattr(obj, i) or obj[i] for each step; return obj, first",
    'Index keys': "Inside [ ] an all-digit key becomes an int, anything else stays a str: {0[1]} indexes with 1, {d[key]} with 'key', {0[-1]} with the string '-1'",
    'get_value':  'if isinstance(key, int): return args[key] — else return kwargs[key]; raising IndexError/KeyError is the documented contract',
  },

  related: [
    { name: 'string.Formatter',  slug: 'formatter',       when: 'format() and vformat() call these hooks' },
    { name: 'Formatter.parse',   slug: 'formatter-parse', when: 'Where field_name comes from' },
    { name: 'Formatter.check_unused_args', slug: 'formatter-check_unused_args', when: 'Receives the keys get_field reported' },
    { name: 'str.format_map()',  slug: 'str-format_map',  when: 'Defaults via a __missing__ mapping', category: 'functions' },
    { name: 'getattr()',         slug: 'getattr',         when: 'What .name steps call', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I give str.format a default for missing keys?',
      a: "Subclass string.Formatter and override get_value: return kwargs.get(key, default) for str keys and call super() for int keys. Alternatively use '...'.format_map(d) with a dict subclass that defines __missing__.",
    },
    {
      q: 'What is the difference between get_value and get_field?',
      a: "get_field receives the whole field name ('0[1].y', 'user.name') and returns (object, key). It calls get_value only for the first part (0, 'user'); the rest is applied with indexing and getattr.",
    },
    {
      q: 'Why is the key sometimes an int?',
      a: "A field name that starts with decimal digits — {0}, {1[2]} — and the automatic {} fields refer to positional arguments, so the key is an int index into args. Names like {x} give a str key for kwargs.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Formatter.get_value',
    meta:  'Formatter.get_value',
  },
};
