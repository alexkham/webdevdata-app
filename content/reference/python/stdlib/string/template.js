// content/reference/python/stdlib/string/template.js — string.Template

export const meta = {
  slug:        'template',
  name:        'string.Template',
  signature:   'string.Template(template)',
  blurb:       'Simple $name substitution for text written by people, not programmers: $name or ${name} placeholders, $$ for a literal dollar, and nothing else — no expressions, no attribute access.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'string template python string.Template dollar placeholder $name ${name} template substitution user supplied template safe templating i18n translations template string vs f-string vs format',
};

export const method = {
  slug:      'template',
  name:      'string.Template',
  signature: 'string.Template(template)',
  returns:   { type: 'Template', desc: 'A template object. The text is kept in its .template attribute; nothing is parsed until you substitute.' },

  category:    'string class',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Three rules: $identifier and ${identifier} are placeholders, $$ is a $, and any other $ is an error. That small surface is the point — a template written by a user or translator can only fill in names you provide.',

  covers: ['Template'],

  cheat: {
    commonCall: "Template('$who likes $what').substitute(who='Ada', what='tea')",
    returns:    "'Ada likes tea'",
    replaces:   'str.format / f-strings for templates that come from config files or users',
    watchOut:   'identifiers are ASCII only: $naïve is the placeholder $na followed by ïve',
  },

  parameters: [
    { name: 'template', type: 'str', required: true, default: null, desc: 'The template text. Stored unchanged as the instance attribute .template.' },
  ],

  modes: [
    {
      id: 'fill',
      label: 'substitute',
      blurb: 'Fill $name and $item. Try ${...} to glue a placeholder to letters, and $$ for a literal dollar.',
      params: [
        { name: 'text', type: 'str', hint: 'template using $name and $item', input: 'text' },
        { name: 'name', type: 'str', hint: 'value for name', input: 'text' },
        { name: 'item', type: 'str', hint: 'value for item', input: 'text' },
      ],
      template: 'from string import Template\nTemplate({$text}).substitute(name={$name}, item={$item})',
      cases: [
        { id: 'basic',  label: 'basic',         values: { text: 'Dear $name, your $item has shipped.', name: 'Ada', item: 'book' } },
        { id: 'braced', label: '${item}s',      values: { text: '$name ordered two ${item}s', name: 'Bo', item: 'lamp' } },
        { id: 'dollar', label: '$$',            values: { text: '$item costs $$12', name: 'Ada', item: 'tea' } },
        { id: 'glued',  label: '$items (no braces)', values: { text: 'two $items', name: 'Ada', item: 'lamp' } },
        { id: 'stray',  label: 'bare $',        values: { text: 'costs 12 $ total', name: 'Ada', item: 'tea' } },
        { id: 'unicode', label: '$naïve',       values: { text: '$naïve', name: 'Ada', item: 'tea' } },
      ],
    },
    {
      id: 'safe',
      label: 'safe_substitute',
      blurb: 'The same template with safe_substitute: unknown names and stray $ are left in the text.',
      params: [
        { name: 'text', type: 'str', hint: 'template using $name and anything else', input: 'text' },
        { name: 'name', type: 'str', hint: 'value for name', input: 'text' },
      ],
      template: 'from string import Template\nTemplate({$text}).safe_substitute(name={$name})',
      cases: [
        { id: 'missing', label: 'unknown $city', values: { text: '$name lives in $city', name: 'Ada' } },
        { id: 'stray',   label: 'bare $',        values: { text: '$name paid $ 5', name: 'Ada' } },
      ],
    },
  ],
  demoExplainer: "A placeholder name is the longest run of ASCII letters, digits and underscores after the $, so '$items' asks for items, which is missing (KeyError) — '${item}s' is the fix. A $ followed by a space raises \"Invalid placeholder in string: line 1, col 10\" in the bare-$ case: the line and column (counted from 1) of that $. In '$naïve' the name stops before ï, so only na is looked up.",

  patterns: [
    {
      name: 'Templates from a config file',
      desc: 'Load the text, substitute known names, keep anything unknown visible.',
      code: "from string import Template\nwith open('welcome.txt', encoding='utf-8') as f:\n    tpl = Template(f.read())\nmessage = tpl.safe_substitute(name=user.name, plan=user.plan)",
    },
    {
      name: 'Values from a dict',
      desc: 'Pass a mapping positionally; keyword arguments override it.',
      code: "from string import Template\nTemplate('$host:$port').substitute(config, port=8080)",
    },
    {
      name: 'Check a template before saving it',
      desc: 'is_valid and get_identifiers (3.11+) let an editor reject bad templates.',
      code: "from string import Template\ntpl = Template(user_text)\nif not tpl.is_valid():\n    raise ValueError('stray $ in template')\nunknown = set(tpl.get_identifiers()) - {'name', 'plan'}",
    },
  ],

  examples: [
    { title: 'Keywords',                 code: "from string import Template\nTemplate('$who likes $what').substitute(who='tim', what='kung pao')", returns: "'tim likes kung pao'" },
    { title: 'A dict, overridden by a keyword', code: "from string import Template\nTemplate('$a $b').substitute({'a': 1, 'b': 2}, b=3)", returns: "'1 3'" },
    { title: 'Braces separate the name', code: "from string import Template\nTemplate('${noun}ification').substitute(noun='simpl')", returns: "'simplification'" },
    { title: '$$ is a dollar sign',      code: "from string import Template\nTemplate('Give $$5').substitute()",                 returns: "'Give $5'" },
    { title: 'Values go through str()',  code: "from string import Template\nTemplate('$n items').substitute(n=3)",              returns: "'3 items'" },
    { title: 'Missing name',             code: "from string import Template\nTemplate('$who likes $what').substitute(who='tim')", returns: "KeyError: 'what'" },
    { title: 'The text is kept as .template', code: "from string import Template\nTemplate('$a').template",                     returns: "'$a'" },
  ],

  pitfalls: [
    {
      name: 'Gluing a placeholder to letters',
      desc: 'The name runs as far as identifier characters go, so text right after a placeholder becomes part of its name.',
      wrong: { label: '$noun + text', code: "from string import Template\nTemplate('$nounification').substitute(noun='simpl')", output: "KeyError: 'nounification'" },
      fix:   { label: '${noun}', code: "from string import Template\nTemplate('${noun}ification').substitute(noun='simpl')", output: "'simplification'" },
    },
    {
      name: 'Prices and other literal dollars',
      desc: 'A $ that does not start a valid placeholder is an error in substitute. Double it.',
      wrong: { label: '$5', code: "from string import Template\nTemplate('Cost: $5').substitute()", output: 'ValueError: Invalid placeholder in string: line 1, col 7' },
      fix:   { label: '$$5', code: "from string import Template\nTemplate('Cost: $$5').substitute()", output: "'Cost: $5'" },
    },
    {
      name: 'Expecting attribute or index access',
      desc: '$user.name is the placeholder $user followed by the text ".name". Flatten the values first.',
      wrong: { label: '$user.name', code: "from string import Template\nTemplate('$user.name').substitute(user='ada')", output: "'ada.name'" },
      fix:   { label: 'flat names', code: "from string import Template\nuser = {'name': 'Ada'}\nTemplate('$user_name').substitute(user_name=user['name'])", output: "'Ada'" },
    },
  ],

  when: {
    use: [
      'Message templates edited by users, admins or translators',
      'Config files with ${VAR}-style placeholders',
      'Any template whose author you do not fully trust',
    ],
    avoid: [
      'Formatting numbers, dates, alignment → f-strings / str.format (Template has no format specs)',
      'Loops, conditionals, HTML → a template engine (Jinja2)',
    ],
  },

  notes: {
    cpython:         'Lib/string.py — one regular expression (Template.pattern) with the groups escaped, named, braced and invalid, applied with pattern.sub()',
    'Identifiers':   'Default idpattern (?a:[_a-z][_a-z0-9]*) with re.IGNORECASE: ASCII letters of either case, digits, underscore, not starting with a digit',
    'Subclassing':   'delimiter, idpattern, braceidpattern, flags or the whole pattern can be overridden in a subclass — see Template class attributes',
    'Safety':        'Substitution only calls str() on the values you pass; the template cannot reach attributes, items or code',
  },

  related: [
    { name: 'Template.substitute', slug: 'template-substitute', when: 'substitute vs safe_substitute in detail' },
    { name: 'Template.get_identifiers', slug: 'template-get_identifiers', when: 'List placeholders, validate templates (3.11+)' },
    { name: 'Template.delimiter / idpattern', slug: 'template-attributes', when: 'Change the $ or the name rules' },
    { name: 'string.Formatter', slug: 'formatter',  when: 'The {field} syntax with format specs' },
    { name: 'str.format()',     slug: 'str-format', when: 'Formatting in your own code', category: 'functions' },
  ],

  faq: [
    {
      q: 'When should I use string.Template instead of f-strings?',
      a: 'f-strings are for code you write: they are evaluated where they appear. Template is for text that arrives at runtime — config, translations, user settings. It only replaces $names with the values you pass, so it cannot run code or read attributes.',
    },
    {
      q: 'How do I write a literal dollar sign in a Template?',
      a: "Double it: Template('Price: $$5').substitute() returns 'Price: $5'. A single $ that is not followed by a valid name or {name} raises ValueError in substitute (safe_substitute leaves it alone).",
    },
    {
      q: 'Can a Template placeholder contain dots or non-ASCII letters?',
      a: "Not by default: names are ASCII identifiers, so $user.name is $user plus '.name' and $naïve is $na plus 'ïve'. Subclass Template and set idpattern (or braceidpattern) to allow other characters.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Template',
    meta:  'string.Template',
  },
};
