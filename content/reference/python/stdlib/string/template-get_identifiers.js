// content/reference/python/stdlib/string/template-get_identifiers.js — Template.get_identifiers / is_valid

export const meta = {
  slug:        'template-get_identifiers',
  name:        'Template.get_identifiers / is_valid',
  signature:   'Template.get_identifiers() · Template.is_valid()',
  blurb:       'Inspect a Template without substituting: the placeholder names it uses, in first-seen order, and whether substitute() could run without a ValueError.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.11+',
  searchTerms: 'template get_identifiers is_valid python Template.get_identifiers Template.is_valid list placeholders in template validate template string 3.11 find variables in template',
};

export const method = {
  slug:      'template-get_identifiers',
  name:      'Template.get_identifiers / is_valid',
  signature: 'Template.get_identifiers() · Template.is_valid()',
  returns:   { type: 'list[str] · bool', desc: 'get_identifiers: each valid placeholder name once, in order of first appearance. is_valid: False if the template has an invalid placeholder.' },

  category:    'Template method',
  version:     'Python 3.11+',
  hasLiveDemo: true,

  subtitle: 'Two read-only checks added in 3.11. get_identifiers lists $name and ${name} placeholders (duplicates once) and skips invalid ones; is_valid is False exactly when substitute() would raise ValueError.',

  covers: ['Template.get_identifiers', 'Template.is_valid'],

  cheat: {
    commonCall: "Template('$a ${b} $a').get_identifiers()",
    returns:    "['a', 'b']",
    replaces:   "re.findall over the template text and try/except around substitute",
    watchOut:   'is_valid() says nothing about missing values — only about malformed $',
  },

  parameters: [],

  modes: [
    {
      id: 'inspect',
      label: 'inspect',
      blurb: 'The names a template needs, and whether it is well-formed.',
      params: [{ name: 'text', type: 'str', hint: 'template text', input: 'text' }],
      template: 'from string import Template\nt = Template({$text})\n(t.get_identifiers(), t.is_valid())',
      cases: [
        { id: 'ok',     label: 'valid',           values: { text: 'Dear $title $last, re: ${subject}' } },
        { id: 'dupes',  label: 'repeated names',  values: { text: '$b $a $b ${a}' } },
        { id: 'escape', label: '$$',              values: { text: 'Price: $$5 for $item' } },
        { id: 'bad',    label: 'invalid $',       values: { text: 'Cost $5 for $item' } },
        { id: 'braces', label: '${ x }',          values: { text: '${ x } ${y}' } },
      ],
    },
  ],
  demoExplainer: "Names come back in the order they first appear, each once, braced or not. $$ is an escaped dollar, not a placeholder, so it neither adds a name nor makes the template invalid. An invalid placeholder ($5, ${ x }) is skipped by get_identifiers and makes is_valid() False — the same templates on which substitute() raises ValueError.",

  patterns: [
    {
      name: 'Validate user templates on save',
      desc: 'Reject malformed text and unknown names before storing it.',
      code: "from string import Template\nALLOWED = {'name', 'plan', 'date'}\nt = Template(text)\nif not t.is_valid():\n    raise ValueError('use $$ for a literal dollar sign')\nunknown = set(t.get_identifiers()) - ALLOWED\nif unknown:\n    raise ValueError(f'unknown placeholders: {sorted(unknown)}')",
    },
    {
      name: 'Build the values lazily',
      desc: 'Compute only the values the template actually uses.',
      code: "from string import Template\nt = Template(text)\nvalues = {name: providers[name]() for name in t.get_identifiers()}\nt.substitute(values)",
    },
  ],

  examples: [
    { title: 'First-seen order, no duplicates', code: "from string import Template\nTemplate('$who $what $who').get_identifiers()", returns: "['who', 'what']" },
    { title: 'Braced and plain together',       code: "from string import Template\nTemplate('${a}x $b').get_identifiers()",       returns: "['a', 'b']" },
    { title: 'Invalid placeholders are skipped', code: "from string import Template\nTemplate('cost $5 $x ${y}').get_identifiers()", returns: "['x', 'y']" },
    { title: 'A valid template',                code: "from string import Template\nTemplate('$who likes $$5').is_valid()",       returns: 'True' },
    { title: 'A stray $',                       code: "from string import Template\nTemplate('100$').is_valid()",                returns: 'False' },
    { title: 'Missing values do not matter',    code: "from string import Template\nTemplate('$anything').is_valid()",           returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Treating is_valid() as "can be filled"',
      desc: 'A valid template can still raise KeyError. Check the names too.',
      wrong: { label: 'is_valid only', code: "from string import Template\nt = Template('$name')\nt.substitute() if t.is_valid() else None", output: "KeyError: 'name'" },
      fix:   { label: 'names as well', code: "from string import Template\nt = Template('$name')\nvalues = {}\nt.is_valid() and set(t.get_identifiers()) <= set(values)", output: 'False' },
    },
    {
      name: 'Expecting names the pattern does not allow',
      desc: 'A name with a space or a dot is not a placeholder, so get_identifiers silently leaves it out. Widen the pattern in a subclass if such names are intended.',
      wrong: { label: 'default pattern', code: "from string import Template\nTemplate('${first name} ${last}').get_identifiers()", output: "['last']" },
      fix:   { label: 'braceidpattern', code: "from string import Template\nclass Spaced(Template):\n    braceidpattern = r'(?a:[_a-z][_a-z0-9 ]*)'\nSpaced('${first name} ${last}').get_identifiers()", output: "['first name', 'last']" },
    },
  ],

  when: {
    use: [
      'Validating templates entered in an admin UI or config',
      'Finding which values a template needs before computing them',
    ],
    avoid: [
      'Format strings in {field} syntax → Formatter.parse',
    ],
  },

  notes: {
    cpython:   'Both iterate self.pattern.finditer(self.template): get_identifiers collects named or braced groups (each once), is_valid returns False at the first invalid group',
    'Version': 'Added in Python 3.11',
    'Custom patterns': 'With a custom pattern whose match has none of the four named groups set, both raise ValueError("Unrecognized named group in pattern", pattern)',
  },

  related: [
    { name: 'string.Template',     slug: 'template',            when: 'Placeholder syntax' },
    { name: 'Template.substitute', slug: 'template-substitute', when: 'Fill the placeholders' },
    { name: 'Formatter.parse',     slug: 'formatter-parse',     when: 'The same job for {field} format strings' },
  ],

  faq: [
    {
      q: 'How do I list the variables in a string.Template?',
      a: "Template(text).get_identifiers() on Python 3.11+ returns the placeholder names in the order they first appear, without duplicates. On older versions, iterate t.pattern.finditer(t.template) and read the 'named' and 'braced' groups.",
    },
    {
      q: 'What does Template.is_valid() check?',
      a: 'Only the syntax: it returns False if some $ is not $$, $name or ${name}, which is exactly when substitute() would raise ValueError. It does not check whether you have values for the names.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Template.get_identifiers',
    meta:  'Template.get_identifiers',
  },
};
