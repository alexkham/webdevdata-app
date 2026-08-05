// content/reference/python/functions/str-format.js
//
// Slug is type-prefixed: `format` is a str method — distinct from the
// bare builtin `format(value, spec)`.

export const meta = {
  slug:        'str-format',
  name:        'str.format',
  signature:   'str.format(*args, **kwargs)',
  blurb:       'Fill `{}` placeholders — positional, numbered, or named — with the format spec after the colon.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'format string template placeholder braces positional keyword f-string mini language spec',
};

export const method = {
  slug:      'str-format',
  name:      'str.format',
  signature: 'str.format(*args, **kwargs)',
  returns:   { type: 'str', desc: 'A copy of the string with every `{...}` placeholder replaced by the corresponding argument, formatted per the spec after the colon (if any). Literal braces are written `{{` and `}}`.' },

  category:    'String method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The template-driven formatting method — same spec syntax as f-strings, but the template lives in a variable.',

  cheat: {
    commonCall: '"{} is {}".format(name, age)',
    returns:    'a new str with placeholders filled',
    replaces:   'the older `%` formatting and manual concatenation',
    watchOut:   'literal braces need doubling (`{{`, `}}`); MISSING args raise IndexError or KeyError',
  },

  parameters: [
    { name: '*args',   type: 'positional', required: false, default: '()', desc: 'Positional values referenced by index — `{0}`, `{1}`, ... — or by order — `{}` auto-numbers left to right.' },
    { name: '**kwargs',type: 'keyword',    required: false, default: '{}', desc: 'Keyword values referenced by name — `{name}`, `{count}`. Missing names raise KeyError.' },
  ],

  demoParams: [
    { name: 'template', type: 'str', hint: 'string with {} placeholders', input: 'text' },
    { name: 'arg',      type: 'str', hint: 'a single value to fill in',   input: 'text' },
  ],
  cases: [
    { id: 'auto',     label: 'auto placeholder',   values: { template: 'Hello, {}!',              arg: 'world' } },
    { id: 'indexed',  label: 'indexed twice',      values: { template: '{0} and {0} again',       arg: 'echo' } },
    { id: 'padded',   label: 'right-aligned',      values: { template: '[{:>10}]',                arg: 'hi' } },
    { id: 'numeric',  label: 'decimal precision',  values: { template: 'pi &asymp; {:.4f}',       arg: '3.14159' } },
    { id: 'zero-pad', label: 'zero-pad integer',   values: { template: 'id: {:04d}',              arg: '42' } },
    { id: 'hex',      label: 'hex',                values: { template: 'byte: {:02X}',            arg: '255' } },
    { id: 'literal',  label: 'literal braces',     values: { template: 'set: {{ {} }}',           arg: 'items' } },
  ],
  demoExplainer: 'The demo fills a single template with one value — enough to explore placeholders and format specs. Real code uses many args and kwargs. Placeholders come in three flavors: `{}` (auto-numbered left to right), `{0}` (indexed), and `{name}` (keyword). The format spec — everything after the colon — is the same mini-language as bare format() and f-strings. Literal `{` and `}` need to be doubled: `{{` and `}}`.',

  patterns: [
    {
      name: 'Multiple positional args',
      desc: 'Auto-numbered — the most common shape.',
      code: '"{} is {} years old".format(name, age)',
    },
    {
      name: 'Keyword args for readability',
      desc: 'Named placeholders — safer for long templates.',
      code: '"host={host} port={port}".format(host=cfg.host, port=cfg.port)',
    },
    {
      name: 'Dict expansion',
      desc: 'Pass a dict with `**` to fill named placeholders.',
      code: 'params = {"host": "dev", "port": 8080}\n"{host}:{port}".format(**params)',
    },
    {
      name: 'Reuse the same arg',
      desc: 'Indexed placeholders can appear multiple times.',
      code: '"{0}, {0}, {0}!".format("go")',
    },
  ],

  examples: [
    { title: 'Auto placeholder',   code: '"Hello, {}!".format("world")',        returns: '"Hello, world!"' },
    { title: 'Indexed',            code: '"{0} and {0}".format("echo")',        returns: '"echo and echo"' },
    { title: 'Named',              code: '"{name}={value}".format(name="k", value="v")', returns: '"k=v"' },
    { title: 'Right-align spec',   code: '"[{:>10}]".format("hi")',              returns: '"[        hi]"' },
    { title: 'Decimal precision',  code: '"{:.4f}".format(3.14159)',             returns: '"3.1416"' },
    { title: 'Zero-pad integer',   code: '"{:04d}".format(42)',                  returns: '"0042"' },
    { title: 'Hex uppercase',      code: '"{:02X}".format(255)',                 returns: '"FF"' },
    { title: 'Literal braces',     code: '"{{ {} }}".format("x")',               returns: '"{ x }"' },
  ],

  pitfalls: [
    {
      name: 'Literal `{` and `}` need doubling',
      desc: 'A single brace is a placeholder marker. To output a literal brace, write `{{` or `}}`. A common bug in templates that mix real placeholders with JSON-like literal braces.',
      wrong: { label: 'Placeholder confusion', code: '"a set is {x, y}".format(x=1, y=2)', output: 'KeyError: &apos;x, y&apos;  # brace treated as placeholder' },
      fix:   { label: 'Doubled braces',        code: '"a set is {{{}, {}}}".format(1, 2)', output: '"a set is {1, 2}"' },
    },
    {
      name: 'Cannot MIX auto and manual numbering',
      desc: 'Once you use `{}`, all placeholders must be `{}`. Once you use `{0}`, all must be indexed. Mixing raises ValueError.',
      wrong: { label: 'Mixed styles', code: '"{} and {1}".format("a", "b")', output: 'ValueError: cannot switch from automatic field numbering to manual field specification' },
      fix:   { label: 'Pick one',     code: '"{0} and {1}".format("a", "b")', output: '"a and b"' },
    },
    {
      name: 'Missing positional → IndexError; missing keyword → KeyError',
      desc: 'Two different exception classes for two different kinds of miss. Catch broadly (or read the message) if you accept templates from users.',
      wrong: { label: 'Missing positional', code: '"{0} {1}".format("only-one")', output: 'IndexError: tuple index out of range' },
      fix:   { label: 'Provide enough args', code: '"{0} {1}".format("both", "here")', output: '"both here"' },
    },
    {
      name: 'When the template is a literal, use an f-string',
      desc: 'str.format is worth reaching for when the template is a VARIABLE. For literal templates, f-strings are more Pythonic and easier to read.',
      wrong: { label: 'Literal via format()', code: '"{}".format(x)', output: 'works, but stiff' },
      fix:   { label: 'f-string idiom',       code: 'f"{x}"', output: 'idiomatic' },
    },
  ],

  when: {
    use: [
      'The template lives in a variable, config file, or database',
      'Same value referenced multiple times via indexed placeholders',
      'Reusable templates with named placeholders',
      'Building a locale-aware or user-editable format string',
    ],
    avoid: [
      'Literal template → f-string is idiomatic',
      'Untrusted templates from users → risk of KeyError / attribute access; sanitize first',
      'Rich formatting where every placeholder is complex → f-strings compose better',
      'Locale-aware money / dates → locale module or dedicated library',
    ],
  },

  notes: {
    complexity: 'O(n) in the output length; parsing the template is O(m)',
    return:     'A new string; the original template is unchanged',
    cpython:    'Objects/unicodeobject.c :: unicode_format — dispatches to string.Formatter',
    memory:     'Allocates one string plus intermediate buffers per placeholder',
    threadSafe: 'Yes for immutable inputs',
  },

  related: [
    { name: 'format',    slug: 'format', when: 'Format a SINGLE value with a spec — no template' },
    { name: 'str.maketrans', slug: 'str-maketrans', when: 'Character-level transformations rather than value substitution' },
    { name: 'join',      slug: 'join',   when: 'Combine an iterable of strings — no per-item spec needed' },
  ],

  faq: [
    {
      q: 'What is the difference between str.format and f-strings?',
      a: 'Same spec syntax, different evaluation model. str.format takes the template as a value — the placeholders are filled at call time. f-strings are compile-time — the template must be literal. Use str.format when the template varies; use f-strings when it does not.',
    },
    {
      q: 'What is the difference between str.format and %-formatting?',
      a: '`%` is the older C-style formatting: `"%d items" % count`. str.format is the modern replacement with a richer spec, named arguments, and better readability. f-strings supersede both for literal templates.',
    },
    {
      q: 'How do I include a literal `{` in the output?',
      a: 'Double it: `{{`. Same for `}}`. Any single brace in the template is a placeholder marker.',
    },
    {
      q: 'Can I use attribute or item access in placeholders?',
      a: 'Yes — `{0.name}` accesses an attribute, `{0[0]}` accesses an item. Careful with untrusted templates — attribute access can leak internals.',
    },
  ],

  history: [
    { version: '2.6', note: 'str.format() introduced together with the Format Specification Mini-Language (PEP 3101).' },
    { version: '3.6', note: 'f-strings added (PEP 498) — same spec language, compile-time evaluation.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.format',
    meta:  'str.format',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the formatted output' },
  ],
};