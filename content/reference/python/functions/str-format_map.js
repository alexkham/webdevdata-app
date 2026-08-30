// content/reference/python/functions/str-format_map.js
//
// Slug is type-prefixed to sit alongside str-format.

export const meta = {
  slug:        'str-format_map',
  name:        'str.format_map',
  signature:   'str.format_map(mapping)',
  blurb:       'Like format(**mapping), but without copying the mapping first.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'format map mapping template substitute placeholder dict defaultdict missing key str',
};

export const method = {
  slug:      'str-format_map',
  name:      'str.format_map',
  signature: 'str.format_map(mapping)',
  returns:   { type: 'str', desc: 'A new string with each {key} replaced by mapping[key]. Raises KeyError for a placeholder the mapping cannot supply.' },

  category:    'String method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'The reason it exists: format(**m) copies m into a new dict, so a custom mapping loses its behaviour. format_map passes the object through untouched.',

  cheat: {
    commonCall: 's.format_map(mapping)',
    returns:    'str — the filled-in template',
    replaces:   'format(**mapping), which flattens the mapping into a plain dict',
    watchOut:   'a missing key raises KeyError unless your mapping handles it',
  },

  parameters: [
    { name: 'mapping', type: 'mapping', required: true, default: null, desc: 'Any object supporting __getitem__ — a dict, a defaultdict, or a custom class. It is used directly, never copied.' },
  ],

  demoParams: [
    { name: 'template', type: 'str',     hint: 'template with {placeholders}', input: 'text' },
    { name: 'mapping',  type: 'mapping', hint: 'key:value pairs, comma separated', input: 'kv' },
  ],
  cases: [
    { id: 'basic',   label: 'two fields',      values: { template: '{name} is {age}', mapping: 'name:Ada,age:36' } },
    { id: 'repeat',  label: 'repeated key',    values: { template: '{x} and {x}',     mapping: 'x:hi' } },
    { id: 'extra',   label: 'unused keys ok',  values: { template: '{a}',             mapping: 'a:1,b:2' } },
    { id: 'plain',   label: 'no placeholders', values: { template: 'plain text',      mapping: 'a:1' } },
    { id: 'missing', label: 'missing key',     values: { template: '{a}',             mapping: 'b:1' } },
  ],
  demoExplainer: 'Each {key} is looked up in the mapping and replaced by the value. Keys the template never mentions are simply unused, and a key the template needs but the mapping lacks raises KeyError naming it. Everything here is also true of format(**mapping) — the difference only shows once the mapping is not a plain dict, because format copies it and format_map does not.',

  patterns: [
    {
      name: 'Tolerate missing keys',
      desc: 'A defaultdict survives the copy that format(**m) would make — this is the headline use.',
      code: 'from collections import defaultdict\ns.format_map(defaultdict(str, name="Ada"))',
    },
    {
      name: 'Leave unknown placeholders alone',
      desc: 'A mapping that returns the placeholder itself makes substitution partial and repeatable.',
      code: 'class Keep(dict):\n    def __missing__(self, key):\n        return "{" + key + "}"\n\ns.format_map(Keep(name="Ada"))',
    },
    {
      name: 'Format straight from an object',
      desc: 'Any __getitem__ works, so a live view of state needs no dict built first.',
      code: 'template.format_map(config)   # config[key] on demand',
    },
  ],

  examples: [
    { title: 'Two fields',      code: "'{name} is {age}'.format_map({'name': 'Ada', 'age': 36})", returns: "'Ada is 36'" },
    { title: 'Repeated key',    code: "'{x} and {x}'.format_map({'x': 'hi'})",  returns: "'hi and hi'" },
    { title: 'Unused keys fine',code: "'{a}'.format_map({'a': 1, 'b': 2})",     returns: "'1'" },
    { title: 'Missing raises',  code: "'{a}'.format_map({'b': 1})",             returns: "KeyError: 'a'" },
    { title: 'defaultdict fills',code: "'{a}'.format_map(defaultdict(str))",    returns: "''" },
    { title: 'format would copy',code: "'{a}'.format(**defaultdict(str))",      returns: "KeyError: 'a'  # the copy lost it" },
  ],

  pitfalls: [
    {
      name: 'format(**mapping) silently loses custom behaviour',
      desc: 'This is the whole point of the method. ** unpacks the mapping into a plain dict, so __missing__ and any laziness are gone before formatting starts — and the failure looks like the mapping did not work.',
      wrong: { label: 'defaultdict defeated', code: "from collections import defaultdict\n'{a}'.format(**defaultdict(str))", output: "KeyError: 'a'" },
      fix:   { label: 'Pass it through',      code: "'{a}'.format_map(defaultdict(str))", output: "''" },
    },
    {
      name: 'Never call it on untrusted templates',
      desc: 'Format strings can reach attributes and items, so a hostile template can walk from a harmless value into internals. This is the same class of bug as untrusted format() strings.',
      wrong: { label: 'Template injection', code: 'user_template.format_map(ctx)', output: 'a crafted template can read ctx internals' },
      fix:   { label: 'Fixed template',     code: 'FIXED_TEMPLATE.format_map(user_values)', output: 'only the values come from outside' },
    },
    {
      name: 'Literal braces still need doubling',
      desc: 'format_map uses the same grammar as format, so a lone brace is a syntax error in the template rather than a literal character.',
      wrong: { label: 'Unbalanced', code: "'{a} }'.format_map({'a': 1})", output: "ValueError: Single '}' encountered in format string" },
      fix:   { label: 'Double it',  code: "'{a} }}'.format_map({'a': 1})", output: "'1 }'" },
    },
    {
      name: 'It takes one positional argument, not keywords',
      desc: 'format_map(name="Ada") is a TypeError. The mapping goes in as a single object — that is the difference from format, and an easy slip when converting between the two.',
      wrong: { label: 'Keywords rejected', code: "'{name}'.format_map(name='Ada')", output: 'TypeError: format_map() takes no keyword arguments' },
      fix:   { label: 'Pass a mapping',    code: "'{name}'.format_map({'name': 'Ada'})", output: "'Ada'" },
    },
  ],

  when: {
    use: [
      'The mapping is a defaultdict or defines __missing__',
      'The mapping is large and copying it would be wasteful',
      'Keys are computed lazily by a custom __getitem__',
      'Keys are not valid Python identifiers, so ** cannot express them',
    ],
    avoid: [
      'A plain dict with all keys present → format(**d) reads more familiarly',
      'Templates from users → string.Template is far safer',
      'Simple interpolation of local variables → an f-string',
    ],
  },

  notes: {
    complexity: 'O(len(template)) plus one mapping lookup per placeholder',
    return:     'A new str; the template and the mapping are unchanged',
    cpython:    'Objects/unicodeobject.c :: unicode_format_map',
    memory:     'Allocates the result only — unlike format(**m), no dict copy is made',
    threadSafe: 'Depends on the mapping; the string side is immutable and safe',
  },

  related: [
    { name: 'str.format', slug: 'str-format', when: 'Positional and keyword arguments instead of one mapping' },
    { name: 'format',     slug: 'format',     when: 'Apply a format spec to a single value' },
    { name: 'dict',       slug: 'dict-update', when: 'Build up the mapping before formatting' },
    { name: 'str',        slug: 'str',        when: 'Convert values to text without a template' },
  ],

  faq: [
    {
      q: 'How is this different from format(**mapping)?',
      a: 'Only in how the mapping arrives. ** unpacks it into a fresh plain dict, so anything special about the original — __missing__, laziness, non-identifier keys — is gone. format_map hands the object straight to the formatter, so all of that still works.',
      code: "'{a}'.format_map(defaultdict(str))   # ''\n'{a}'.format(**defaultdict(str))     # KeyError",
    },
    {
      q: 'How do I leave unknown placeholders untouched?',
      a: 'Give the mapping a __missing__ that returns the placeholder text. format_map then rebuilds "{key}" for anything absent, which makes partial formatting safe to run more than once.',
      code: 'class Keep(dict):\n    def __missing__(self, key):\n        return "{" + key + "}"',
    },
    {
      q: 'Is it safe for user-supplied templates?',
      a: 'No. Format strings can follow attribute and item access, so a crafted template can reach into whatever you pass. Use string.Template with safe_substitute when the template itself comes from outside your code.',
    },
  ],

  history: [
    { version: '3.2', note: 'str.format_map added, giving format access to a mapping without copying it.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.format_map',
    meta:  'str.format_map',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Shape the mapping before formatting' },
  ],
};
