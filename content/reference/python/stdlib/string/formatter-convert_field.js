// content/reference/python/stdlib/string/formatter-convert_field.js — Formatter.convert_field / format_field

export const meta = {
  slug:        'formatter-convert_field',
  name:        'Formatter.convert_field / format_field',
  signature:   'Formatter.convert_field(value, conversion) · Formatter.format_field(value, format_spec)',
  blurb:       'The last two steps for every field: convert_field applies !r / !s / !a, then format_field applies the :spec by calling the built-in format().',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'formatter convert_field format_field python Formatter.convert_field Formatter.format_field custom conversion !u !r !s !a unknown conversion specifier format spec custom format string formatter subclass',
};

export const method = {
  slug:      'formatter-convert_field',
  name:      'Formatter.convert_field / format_field',
  signature: 'Formatter.convert_field(value, conversion) · Formatter.format_field(value, format_spec)',
  returns:   { type: 'object · str', desc: 'convert_field: the converted value (unchanged when conversion is None). format_field: the formatted text.' },

  category:    'Formatter method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: "For '{x!r:>10}' vformat calls convert_field(x, 'r') and then format_field(result, '>10'). The defaults are repr/str/ascii and format(); overriding them adds conversions like !u or changes how specs are read.",

  covers: ['Formatter.convert_field', 'Formatter.format_field'],

  cheat: {
    commonCall: "def convert_field(self, value, conversion):\n    if conversion == 'u': return str(value).upper()\n    return super().convert_field(value, conversion)",
    returns:    'the value that format_field will format',
    replaces:   'pre-processing every value before calling str.format',
    watchOut:   'unknown conversions raise ValueError — always fall back to super()',
  },

  parameters: [
    { name: 'value',       type: 'object',     required: true, default: null, desc: 'convert_field: the object get_field found. format_field: the (converted) object to format.' },
    { name: 'conversion',  type: 'str | None', required: true, default: null, desc: "The character after ! — 'r', 's', 'a' by default — or None when the field has no conversion." },
    { name: 'format_spec', type: 'str',        required: true, default: null, desc: "The text after : with any nested {fields} already filled in; '' when there is none." },
  ],

  modes: [
    {
      id: 'steps',
      label: 'convert, then format',
      blurb: 'Run the two steps by hand on a str value. Leave conversion empty for None.',
      params: [
        { name: 'value', type: 'str',        hint: 'a str value',          input: 'text' },
        { name: 'conv',  type: 'str | None', hint: "'r', 's', 'a' or empty", input: 'text-or-none' },
        { name: 'spec',  type: 'str',        hint: "format spec, e.g. >12", input: 'text' },
      ],
      template: 'import string\nf = string.Formatter()\nf.format_field(f.convert_field({$value}, {$conv}), {$spec})',
      cases: [
        { id: 'none',  label: 'no conversion', values: { value: 'café', conv: '', spec: '*^10' } },
        { id: 'repr',  label: '!r',            values: { value: 'café', conv: 'r', spec: '>10' } },
        { id: 'ascii', label: '!a',            values: { value: 'café', conv: 'a', spec: '' } },
        { id: 'trunc', label: 'precision',     values: { value: 'Ada Lovelace', conv: '', spec: '.3' } },
        { id: 'bad',   label: '!x',            values: { value: 'café', conv: 'x', spec: '' } },
        { id: 'num',   label: ':d on a str',   values: { value: '42', conv: '', spec: 'd' } },
      ],
    },
    {
      id: 'custom',
      label: 'custom !u',
      blurb: 'A subclass that adds an uppercase conversion and keeps the standard ones.',
      params: [
        { name: 'fmt',  type: 'str', hint: 'format string using {name}', input: 'text' },
        { name: 'name', type: 'str', hint: 'value for {name}',           input: 'text' },
      ],
      template: "import string\nclass Upper(string.Formatter):\n    def convert_field(self, value, conversion):\n        if conversion == 'u':\n            return str(value).upper()\n        return super().convert_field(value, conversion)\nUpper().format({$fmt}, name={$name})",
      cases: [
        { id: 'u',    label: '!u',          values: { fmt: 'Hello {name!u}!', name: 'ada' } },
        { id: 'both', label: '!u with spec', values: { fmt: '[{name!u:^9}] [{name!r}]', name: 'ada' } },
        { id: 'bad',  label: '!z',          values: { fmt: '{name!z}', name: 'ada' } },
      ],
    },
  ],
  demoExplainer: "!r and !a run before the spec, so the quotes (and the \\xe9 escape that ascii() writes for é) are part of the text that gets padded. A str value has only the s presentation type, so :d fails even when the text is '42'. An unknown conversion reaches the base class and raises \"Unknown conversion specifier x\".",

  patterns: [
    {
      name: 'Format your own types without touching them',
      desc: 'Intercept format_field for one type and delegate everything else.',
      code: "import string\nfrom decimal import Decimal\n\nclass Money(string.Formatter):\n    def format_field(self, value, format_spec):\n        if isinstance(value, Decimal) and format_spec == 'money':\n            return f'${value:,.2f}'\n        return super().format_field(value, format_spec)\n\nMoney().format('{0:money}', Decimal('1234.5'))",
    },
    {
      name: 'Escape every value for HTML',
      desc: 'format_field runs for every field — the right place for output escaping.',
      code: 'import html, string\n\nclass HTMLFormatter(string.Formatter):\n    def format_field(self, value, format_spec):\n        return html.escape(super().format_field(value, format_spec))\n\nHTMLFormatter().format("<p>{}</p>", "<script>")',
    },
    {
      name: 'None as an empty field',
      desc: "format(None, '>5') raises TypeError; map None to '' first.",
      code: "import string\n\nclass Blank(string.Formatter):\n    def format_field(self, value, format_spec):\n        return super().format_field('' if value is None else value, format_spec)",
    },
  ],

  examples: [
    { title: 'convert_field with !r',        code: "import string\nstring.Formatter().convert_field('hé', 'r')",  returns: `"'hé'"` },
    { title: '!a escapes non-ASCII',         code: "import string\nstring.Formatter().convert_field('hé', 'a')",  returns: `"'h\\\\xe9'"` },
    { title: 'No conversion: unchanged',     code: "import string\nstring.Formatter().convert_field(3, None)",    returns: '3' },
    { title: 'format_field is format()',     code: "import string\nstring.Formatter().format_field(3.14159, '.2f')", returns: "'3.14'" },
    { title: 'Spec for an int',              code: "import string\nstring.Formatter().format_field(42, '08b')",   returns: "'00101010'" },
    { title: 'Dates use their own spec',     code: "import string\nfrom datetime import date\nstring.Formatter().format_field(date(2026, 10, 4), '%d %b %Y')", returns: "'04 Oct 2026'" },
    { title: 'Spec on None fails',           code: "import string\nstring.Formatter().format_field(None, '>5')",  returns: 'TypeError: unsupported format string passed to NoneType.__format__' },
  ],

  pitfalls: [
    {
      name: 'Not falling back to super()',
      desc: 'An override that only handles its own conversion breaks !r, !s and !a.',
      wrong: { label: 'own conversion only', code: "import string\nclass U(string.Formatter):\n    def convert_field(self, value, conversion):\n        return str(value).upper() if conversion == 'u' else value\nU().format('{0!r}', 'x')", output: "'x'" },
      fix:   { label: 'delegate the rest', code: "import string\nclass U(string.Formatter):\n    def convert_field(self, value, conversion):\n        if conversion == 'u':\n            return str(value).upper()\n        return super().convert_field(value, conversion)\nU().format('{0!r}', 'x')", output: `"'x'"` },
    },
    {
      name: 'Expecting the same error text as str.format',
      desc: 'Formatter.convert_field builds its message with str(), so a non-ASCII conversion character is shown as is; str.format (in C) shows it escaped.',
      wrong: { label: 'str.format', code: "'{0!é}'.format('a')", output: 'ValueError: Unknown conversion specifier \\xe9' },
      fix:   { label: 'Formatter', code: "import string\nstring.Formatter().format('{0!é}', 'a')", output: 'ValueError: Unknown conversion specifier é' },
    },
  ],

  when: {
    use: [
      'New conversion flags (!u, !l, !j for JSON …) — convert_field',
      'Custom spec mini-languages, per-type formatting or escaping every value — format_field',
    ],
    avoid: [
      'Formatting one class of your own → give that class a __format__ method; str.format and f-strings will use it',
    ],
  },

  notes: {
    cpython:        "convert_field: None → value, 's' → str(value), 'r' → repr(value), 'a' → ascii(value), else ValueError('Unknown conversion specifier ' + conversion). format_field: return format(value, format_spec)",
    'Order':        'get_field → convert_field → the spec is expanded (nested fields) → format_field',
    'Conversions':  'The parser accepts any single character after !; only convert_field decides whether it is valid',
  },

  related: [
    { name: 'string.Formatter',    slug: 'formatter',           when: 'Where these hooks are called' },
    { name: 'Formatter.get_value', slug: 'formatter-get_value', when: 'The lookup step before them' },
    { name: 'format()',            slug: 'format',              when: 'What format_field calls', category: 'functions' },
    { name: 'repr()',              slug: 'repr',                when: 'What !r calls', category: 'functions' },
    { name: 'ascii()',             slug: 'ascii',               when: 'What !a calls', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I add a custom conversion like !u to str.format?',
      a: "str.format cannot be extended, but string.Formatter can: subclass it, override convert_field, handle your character ('u') and return super().convert_field(value, conversion) for everything else. Then call YourFormatter().format(...).",
    },
    {
      q: "What does \"Unknown conversion specifier\" mean?",
      a: "The character after ! in a field is not r, s or a — a typo such as {x!z}, or a custom conversion that only a Formatter subclass understands. (Writing ! instead of : before a spec, as in {x!>10}, gives a different error: expected ':' after conversion specifier.)",
    },
    {
      q: 'What is the difference between !s and no conversion?',
      a: "!s calls str() first, then the spec is applied to a str; without a conversion the spec goes to the object's own __format__. For a float, '{:.2f}' works but '{!s:.2f}' fails, because .2f is not valid for a str.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Formatter.convert_field',
    meta:  'Formatter.convert_field',
  },
};
