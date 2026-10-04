// content/reference/python/stdlib/string/formatter-check_unused_args.js

export const meta = {
  slug:        'formatter-check_unused_args',
  name:        'Formatter.check_unused_args',
  signature:   'Formatter.check_unused_args(used_args, args, kwargs)',
  blurb:       'Hook called once at the end of vformat with the set of argument keys the format string actually used — override it to reject unused arguments.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'formatter check_unused_args python Formatter.check_unused_args strict format unused arguments extra keyword arguments ignored str.format ignores extra arguments used_args',
};

export const method = {
  slug:      'formatter-check_unused_args',
  name:      'Formatter.check_unused_args',
  signature: 'Formatter.check_unused_args(used_args, args, kwargs)',
  returns:   { type: 'None', desc: 'The return value is ignored; raise an exception to reject the call.' },

  category:    'Formatter method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'str.format silently ignores arguments the format string never mentions. Formatter calls check_unused_args(used_args, args, kwargs) after formatting — the default does nothing, so a subclass can turn "unused" into an error.',

  covers: ['Formatter.check_unused_args'],

  cheat: {
    commonCall: 'def check_unused_args(self, used_args, args, kwargs): ...',
    returns:    'None — raise to fail',
    replaces:   'manual comparisons of parse() output against the arguments',
    watchOut:   'used_args holds ints for positional and strs for named arguments',
  },

  parameters: [
    { name: 'used_args', type: 'set[int | str]', required: true, default: null, desc: 'The key of every field that was formatted: ints for positional arguments (including automatic {}), strs for keywords. Only the first part of a compound field counts — {user.name} adds \'user\'.' },
    { name: 'args',      type: 'sequence',       required: true, default: null, desc: 'The positional arguments given to vformat.' },
    { name: 'kwargs',    type: 'mapping',        required: true, default: null, desc: 'The keyword arguments given to vformat.' },
  ],

  modes: [
    {
      id: 'strict',
      label: 'strict keywords',
      blurb: 'Reject keyword arguments the format string does not use.',
      params: [
        { name: 'fmt', type: 'str', hint: 'format string using {a} and/or {b}', input: 'text' },
        { name: 'a',   type: 'str', hint: 'value for a', input: 'text' },
        { name: 'b',   type: 'str', hint: 'value for b', input: 'text' },
      ],
      template: "import string\nclass Strict(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        unused = set(kwargs) - used_args\n        if unused:\n            raise ValueError(f'unused: {sorted(unused)}')\nStrict().format({$fmt}, a={$a}, b={$b})",
      cases: [
        { id: 'both',  label: 'both used',   values: { fmt: '{a} and {b}', a: 'tea', b: 'cake' } },
        { id: 'one',   label: 'b unused',    values: { fmt: 'just {a}', a: 'tea', b: 'cake' } },
        { id: 'none',  label: 'none used',   values: { fmt: 'no fields', a: 'tea', b: 'cake' } },
        { id: 'attr',  label: "{a[0]} only", values: { fmt: '{a[0]}', a: 'tea', b: 'cake' } },
      ],
    },
    {
      id: 'used',
      label: 'used_args',
      blurb: "See what the hook receives, with positional 'p0', 'p1' and keywords a, b.",
      params: [{ name: 'fmt', type: 'str', hint: 'format string', input: 'text' }],
      template: "import string\nclass Spy(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        self.used = used_args\ns = Spy()\ns.format({$fmt}, 'p0', 'p1', a='x', b='y')\nsorted(s.used, key=str)",
      cases: [
        { id: 'mixed', label: 'mixed',       values: { fmt: '{} {a} {}' } },
        { id: 'manual', label: 'manual',     values: { fmt: '{1}{1}{b}' } },
        { id: 'nested', label: 'nested spec', values: { fmt: '{a:{b}}' } },
        { id: 'empty', label: 'no fields',   values: { fmt: 'plain' } },
      ],
    },
  ],
  demoExplainer: "used_args is a set, so a field used twice appears once. Fields inside a format spec ({a:{b}}) count too. For {a[0]} only the key a is recorded — the [0] step does not matter. The check runs after all the formatting, so a strict formatter still does the whole job before it raises.",

  patterns: [
    {
      name: 'Strict positional and keyword arguments',
      desc: 'Fail on any argument the string does not use.',
      code: "import string\n\nclass Strict(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        extra = [i for i in range(len(args)) if i not in used_args]\n        extra += [k for k in kwargs if k not in used_args]\n        if extra:\n            raise ValueError(f'unused arguments: {extra}')",
    },
    {
      name: 'Warn instead of fail',
      desc: 'Useful while migrating message catalogs.',
      code: "import string, warnings\n\nclass Warn(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        for k in set(kwargs) - used_args:\n            warnings.warn(f'unused format argument {k!r}')",
    },
  ],

  examples: [
    { title: 'The default does nothing',      code: "import string\nstring.Formatter().format('{x}', x=1, extra=2)", returns: "'1'" },
    { title: 'It returns None',               code: "import string\nprint(string.Formatter().check_unused_args({'x'}, (), {'x': 1, 'y': 2}))", returns: 'None' },
    { title: 'str.format ignores extras too', code: "'{x}'.format(x=1, extra=2)", returns: "'1'" },
    { title: 'A strict subclass',             code: "import string\nclass Strict(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        if set(kwargs) - used_args:\n            raise ValueError('unused keyword arguments')\nStrict().format('{x}', x=1, extra=2)", returns: 'ValueError: unused keyword arguments' },
    { title: 'Positional keys are ints',      code: "import string\nclass Spy(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        self.used = used_args\ns = Spy()\ns.format('{}{}{x}', 1, 2, x=3)\nsorted(s.used, key=str)", returns: "[0, 1, 'x']" },
  ],

  pitfalls: [
    {
      name: 'Comparing used_args with field names',
      desc: "used_args contains keys, not field names: {user.name} records 'user'. Comparing against parse() names gives false alarms.",
      wrong: { label: 'field names', code: "import string\nfmt = '{user.name}'\nnames = {n for _, n, _, _ in string.Formatter().parse(fmt) if n}\nnames - {'user'}", output: "{'user.name'}" },
      fix:   { label: 'keys from used_args', code: "import string\nclass Spy(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        self.used = used_args\ns = Spy()\nclass U:\n    name = 'Ada'\ns.format('{user.name}', user=U())\ns.used", output: "{'user'}" },
    },
    {
      name: 'Forgetting positional arguments',
      desc: 'set(kwargs) - used_args only checks keywords; unused positional values pass silently.',
      wrong: { label: 'keywords only', code: "import string\nclass Strict(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        if set(kwargs) - used_args:\n            raise ValueError('unused')\nStrict().format('{0}', 'a', 'b')", output: "'a'" },
      fix:   { label: 'check indexes too', code: "import string\nclass Strict(string.Formatter):\n    def check_unused_args(self, used_args, args, kwargs):\n        if set(range(len(args))) - used_args or set(kwargs) - used_args:\n            raise ValueError('unused')\nStrict().format('{0}', 'a', 'b')", output: 'ValueError: unused' },
    },
  ],

  when: {
    use: [
      'Catching typos in message catalogs: a value passed but never shown usually means a misspelt field',
      'APIs where every supplied argument must be used',
    ],
    avoid: [
      'Formatting with large shared context dicts — most keys are unused by design',
    ],
  },

  notes: {
    cpython:      'vformat: used_args = set(); result = self._vformat(..., used_args, 2); self.check_unused_args(used_args, args, kwargs) — the default body is pass',
    'Timing':     'Called after the whole string has been formatted, and only if formatting succeeded',
    'Keys':       'get_field returns (obj, first); vformat adds first to used_args — an int index or a keyword name',
  },

  related: [
    { name: 'string.Formatter',    slug: 'formatter',           when: 'vformat calls this hook' },
    { name: 'Formatter.get_value', slug: 'formatter-get_value', when: 'Produces the keys collected in used_args' },
    { name: 'Formatter.parse',     slug: 'formatter-parse',     when: 'List the fields before formatting' },
    { name: 'set',                 slug: 'set',                 when: 'used_args is a set — use set difference', category: 'functions' },
  ],

  faq: [
    {
      q: 'Does str.format complain about unused arguments?',
      a: "No. '{x}'.format(x=1, y=2) returns '1' and y is ignored. string.Formatter calls check_unused_args at the end of vformat so that a subclass can raise instead.",
    },
    {
      q: 'What is in used_args?',
      a: "The key of every replacement field that was formatted: 0, 1 … for positional arguments (automatic {} fields included) and the keyword name for named ones. For compound fields only the first part is recorded — {user.name} adds 'user'. Fields nested in a format spec are included.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Formatter.check_unused_args',
    meta:  'Formatter.check_unused_args',
  },
};
