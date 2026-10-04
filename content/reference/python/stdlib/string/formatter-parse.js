// content/reference/python/stdlib/string/formatter-parse.js

export const meta = {
  slug:        'formatter-parse',
  name:        'Formatter.parse',
  signature:   'Formatter.parse(format_string)',
  blurb:       'Split a str.format-style string into (literal_text, field_name, format_spec, conversion) tuples — the way to find out which fields a format string uses.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'formatter parse python string.Formatter.parse Formatter.parse get field names from format string list placeholders in format string literal_text field_name format_spec conversion single } encountered in format string',
};

export const method = {
  slug:      'formatter-parse',
  name:      'Formatter.parse',
  signature: 'Formatter.parse(format_string)',
  returns:   { type: 'iterator of tuple[str, str | None, str | None, str | None]', desc: 'One tuple per piece: the literal text before a field, then the field (or None, None, None when there is no field).' },

  category:    'Formatter method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The parser behind str.format, exposed. Each tuple is "some literal text, then maybe one field"; {{ and }} come out as literal braces, and a malformed string raises ValueError when the iterator reaches the bad spot.',

  covers: ['Formatter.parse'],

  cheat: {
    commonCall: "list(string.Formatter().parse('Hi {name}!'))",
    returns:    "[('Hi ', 'name', '', None), ('!', None, None, None)]",
    replaces:   "re.findall(r'{(\\w+)}', s), which breaks on {{ }}, specs and indexes",
    watchOut:   "it is lazy: errors appear only when you iterate",
  },

  parameters: [
    { name: 'format_string', type: 'str', required: true, default: null, desc: 'A format string in str.format syntax. Anything else raises TypeError.' },
  ],

  modes: [
    {
      id: 'parse',
      label: 'parse',
      blurb: 'Every tuple the parser yields.',
      params: [{ name: 'fmt', type: 'str', hint: 'a format string', input: 'text' }],
      template: 'import string\nlist(string.Formatter().parse({$fmt}))',
      cases: [
        { id: 'basic',  label: 'fields',         values: { fmt: 'Hi {name!r:>10}, you owe {0:.2f}' } },
        { id: 'braces', label: '{{ and }}',      values: { fmt: 'set {{x}} = {x}' } },
        { id: 'empty',  label: '{}',             values: { fmt: '{}{}' } },
        { id: 'nested', label: 'nested spec',    values: { fmt: '{value:{width}.{prec}}' } },
        { id: 'single', label: "a lone '}'",     values: { fmt: 'oops }' } },
        { id: 'open',   label: "unclosed '{'",   values: { fmt: 'Hi {name' } },
      ],
    },
    {
      id: 'names',
      label: 'field names',
      blurb: 'Collect the field names a string will need.',
      params: [{ name: 'fmt', type: 'str', hint: 'a format string', input: 'text' }],
      template: 'import string\n[name for _, name, _, _ in string.Formatter().parse({$fmt}) if name is not None]',
      cases: [
        { id: 'mail',  label: 'mail merge',       values: { fmt: 'Dear {title} {last}, your order {order[id]} ships {date:%d %b}.' } },
        { id: 'auto',  label: 'automatic {}',      values: { fmt: '{} + {} = {}' } },
        { id: 'inner', label: 'fields in a spec', values: { fmt: '{x:{w}}' } },
      ],
    },
  ],
  demoExplainer: "A field with no spec gives '' for format_spec, while a piece with no field gives None — that is how you tell them apart. '{{' is returned as literal text ending in '{' (the parser splits there). parse() does not look inside a format spec: in '{x:{w}}' it reports one field x with the spec '{w}', so a fields-in-spec name like w only shows up if you parse the spec again. Empty {} fields come back with field_name '' — the numbering happens later, in vformat.",

  patterns: [
    {
      name: 'Which keys does a template need?',
      desc: 'The first part of each field name (before . or [) is the argument key.',
      code: 'import string, re\nkeys = {re.split(r"[.\\[]", name, 1)[0] for _, name, _, _ in string.Formatter().parse(fmt) if name}',
    },
    {
      name: 'Validate a user-supplied format string',
      desc: 'Iterate it fully inside try: errors only appear during iteration.',
      code: 'import string\ntry:\n    parts = list(string.Formatter().parse(fmt))\nexcept ValueError as e:\n    print(f"bad format string: {e}")',
    },
    {
      name: 'Rebuild the string',
      desc: 'Reassemble pieces, e.g. after renaming fields.',
      code: 'import string\nout = []\nfor lit, name, spec, conv in string.Formatter().parse(fmt):\n    out.append(lit.replace("{", "{{").replace("}", "}}"))\n    if name is not None:\n        out.append("{" + name + ("!" + conv if conv else "") + (":" + spec if spec else "") + "}")\n"".join(out)',
    },
  ],

  examples: [
    { title: 'Literal text only',              code: "import string\nlist(string.Formatter().parse('plain'))",                returns: "[('plain', None, None, None)]" },
    { title: 'A field with spec and conversion', code: "import string\nlist(string.Formatter().parse('Hi {name!r:>10}'))", returns: "[('Hi ', 'name', '>10', 'r')]" },
    { title: 'Empty string, empty list',       code: "import string\nlist(string.Formatter().parse(''))",                     returns: '[]' },
    { title: 'Compound field names stay whole', code: "import string\nlist(string.Formatter().parse('{0[1].y}'))",            returns: "[('', '0[1].y', '', None)]" },
    { title: 'Doubled braces',                 code: "import string\nlist(string.Formatter().parse('{{}}'))",                 returns: "[('{', None, None, None), ('}', None, None, None)]" },
    { title: 'Lazy: the error waits its turn', code: "import string\nit = string.Formatter().parse('ok {x} } bad')\nnext(it)",   returns: "('ok ', 'x', '', None)" },
    { title: '…until iteration reaches it',   code: "import string\nlist(string.Formatter().parse('ok {x} } bad'))",     returns: "ValueError: Single '}' encountered in format string" },
    { title: 'Unclosed field',                 code: "import string\nlist(string.Formatter().parse('{a'))",                   returns: "ValueError: expected '}' before end of string" },
  ],

  pitfalls: [
    {
      name: 'Treating every tuple as a field',
      desc: 'Trailing literal text, and the pieces split at {{ and }}, come with field_name None. Filter on "is not None" — not on truthiness, because {} gives the empty name \'\'.',
      wrong: { label: 'if name', code: "import string\n[name for _, name, _, _ in string.Formatter().parse('{}-{x}') if name]", output: "['x']" },
      fix:   { label: 'if name is not None', code: "import string\n[name for _, name, _, _ in string.Formatter().parse('{}-{x}') if name is not None]", output: "['', 'x']" },
    },
    {
      name: 'Finding fields with a regular expression',
      desc: 'A regex does not know that {{ is an escaped brace.',
      wrong: { label: 're.findall', code: "import re\nre.findall(r'{(\\w+)}', 'use {{name}} for {name}')", output: "['name', 'name']" },
      fix:   { label: 'Formatter.parse', code: "import string\n[n for _, n, _, _ in string.Formatter().parse('use {{name}} for {name}') if n is not None]", output: "['name']" },
    },
  ],

  when: {
    use: [
      'Listing the placeholders of a format string (mail merge, i18n checks)',
      'Validating or rewriting format strings before using them',
      'Overriding it in a subclass to support a different field syntax',
    ],
    avoid: [
      'Formatting → just call format()/vformat()',
      '$-templates → Template.get_identifiers()',
    ],
  },

  notes: {
    cpython:    'return _string.formatter_parser(format_string) — the MarkupIterator from Objects/stringlib/unicode_format.h that str.format uses',
    'Errors':   "Single '}' / Single '{' encountered in format string, expected '}' before end of string, unmatched '{' in format spec, expected ':' after conversion specifier, unexpected '{' in field name",
    'Tuples':   'conversion is a one-character str or None; format_spec is \'\' when a field has none, None when there is no field',
  },

  related: [
    { name: 'string.Formatter',  slug: 'formatter',            when: 'format() and vformat() consume these tuples' },
    { name: 'Formatter.get_value', slug: 'formatter-get_value', when: 'What happens to field_name next' },
    { name: 'Template.get_identifiers', slug: 'template-get_identifiers', when: 'The same question for $-templates' },
    { name: 'str.format()',      slug: 'str-format',           when: 'The syntax being parsed', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get the placeholder names from a format string in Python?',
      a: "[name for _, name, _, _ in string.Formatter().parse(s) if name is not None]. It handles {{ }}, conversions and specs correctly. Automatic fields {} appear as '' because they are numbered later.",
    },
    {
      q: "What does \"Single '}' encountered in format string\" mean?",
      a: 'A } appears that does not close a field. Write }} for a literal brace. The same message comes from str.format and from Formatter.parse.',
    },
    {
      q: 'Why is format_spec sometimes None and sometimes an empty string?',
      a: "None means there is no field in that tuple at all (only literal text). '' means there is a field without a :spec.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Formatter.parse',
    meta:  'Formatter.parse',
  },
};
