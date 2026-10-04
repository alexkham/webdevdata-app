// content/reference/python/stdlib/string/template-substitute.js — Template.substitute / safe_substitute

export const meta = {
  slug:        'template-substitute',
  name:        'Template.substitute / safe_substitute',
  signature:   'Template.substitute(mapping={}, /, **kwds) · Template.safe_substitute(mapping={}, /, **kwds)',
  blurb:       'Fill a Template: substitute raises KeyError for a missing name and ValueError for a stray $, safe_substitute leaves both in the text.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.4+',
  searchTerms: 'template substitute safe_substitute python Template.substitute Template.safe_substitute keyerror missing placeholder invalid placeholder in string line col valueerror template mapping kwargs leave unknown placeholders',
};

export const method = {
  slug:      'template-substitute',
  name:      'Template.substitute / safe_substitute',
  signature: 'Template.substitute(mapping={}, /, **kwds) · Template.safe_substitute(mapping={}, /, **kwds)',
  returns:   { type: 'str', desc: 'The template text with every placeholder replaced by str(value) and every $$ by $.' },

  category:    'Template method',
  version:     'Python 2.4+',
  hasLiveDemo: true,

  subtitle: 'Same substitution, two error policies. substitute is strict: every placeholder needs a value and every $ must be valid. safe_substitute never raises for those — it returns the unknown placeholders and stray $ unchanged.',

  covers: ['Template.substitute', 'Template.safe_substitute'],

  cheat: {
    commonCall: "Template('$a $b').safe_substitute(a=1)",
    returns:    "'1 $b'",
    replaces:   'try/except KeyError around formatting',
    watchOut:   'safe_substitute hides typos: $nmae simply stays in the output',
  },

  parameters: [
    { name: 'mapping', type: 'mapping', required: false, default: '{}', desc: 'Values by placeholder name (any object with __getitem__ that raises KeyError). Positional-only.' },
    { name: '**kwds',  type: 'any',     required: false, default: null, desc: 'Values as keyword arguments. They take precedence over mapping when both have the same name.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'strict vs safe',
      blurb: 'One template, one value for name — both methods side by side (substitute errors are caught and shown).',
      params: [
        { name: 'text', type: 'str', hint: 'template text', input: 'text' },
        { name: 'name', type: 'str', hint: 'value for $name', input: 'text' },
      ],
      template: "from string import Template\nt = Template({$text})\nvalues = {'name': {$name}}\ntry:\n    strict = t.substitute(values)\nexcept (KeyError, ValueError) as e:\n    strict = f'{type(e).__name__}: {e}'\n(t.safe_substitute(values), strict)",
      cases: [
        { id: 'ok',      label: 'all known',      values: { text: 'Hello $name!', name: 'Ada' } },
        { id: 'missing', label: 'unknown $city',  values: { text: '$name from $city', name: 'Ada' } },
        { id: 'stray',   label: 'stray $',        values: { text: 'Hi $name,\nyou owe $ 5', name: 'Ada' } },
        { id: 'brace',   label: '${ name }',      values: { text: '${ name } and ${name}', name: 'Ada' } },
        { id: 'escape',  label: '$$name',         values: { text: '$$name is literal, $name is not', name: 'Ada' } },
      ],
    },
    {
      id: 'merge',
      label: 'mapping + keywords',
      blurb: "A dict {'a': ..., 'b': 'from dict'} plus the keyword b=... — keywords win.",
      params: [
        { name: 'text', type: 'str', hint: 'template using $a and $b', input: 'text' },
        { name: 'a',    type: 'str', hint: 'dict value for a', input: 'text' },
        { name: 'b',    type: 'str', hint: 'keyword value for b', input: 'text' },
      ],
      template: "from string import Template\nTemplate({$text}).substitute({'a': {$a}, 'b': 'from dict'}, b={$b})",
      cases: [
        { id: 'both',  label: '$a $b',  values: { text: '$a / $b', a: 'one', b: 'from keyword' } },
        { id: 'extra', label: 'unused values', values: { text: 'only $a', a: 'one', b: 'two' } },
      ],
    },
  ],
  demoExplainer: "The ValueError message gives the line and the column, both counted from 1, of the $ that does not start a placeholder — in the stray-$ case that is line 2, col 9. '${ name }' is not a placeholder (no spaces allowed inside the braces), so it is invalid too. $$ always becomes a single $ and is never read as the start of a name. Values that are not used are simply ignored by both methods.",

  patterns: [
    {
      name: 'Strict where you control the template',
      desc: 'Fail loudly on a missing value instead of sending "Dear $name".',
      code: "from string import Template\nbody = Template(EMAIL_BODY).substitute(name=user.name, link=reset_url)",
    },
    {
      name: 'Two-stage filling',
      desc: 'safe_substitute fills what is known now and keeps the rest for later.',
      code: "from string import Template\nstage1 = Template(text).safe_substitute(site='example.org')\nfinal = Template(stage1).substitute(user='ada')",
    },
    {
      name: 'Report all missing names at once',
      desc: 'Compare get_identifiers() with your values before substituting (3.11+).',
      code: "from string import Template\nt = Template(text)\nmissing = [n for n in t.get_identifiers() if n not in values]\nif missing:\n    raise KeyError(f'missing values: {missing}')\nt.substitute(values)",
    },
  ],

  examples: [
    { title: 'safe_substitute keeps unknowns',  code: "from string import Template\nTemplate('$who likes $what').safe_substitute(who='tim')", returns: "'tim likes $what'" },
    { title: 'substitute raises KeyError',      code: "from string import Template\nTemplate('$who likes $what').substitute(who='tim')",      returns: "KeyError: 'what'" },
    { title: 'Stray $: ValueError with position', code: "from string import Template\nTemplate('ab\\ncd $').substitute()",                 returns: 'ValueError: Invalid placeholder in string: line 2, col 4' },
    { title: 'Stray $ kept by safe_substitute', code: "from string import Template\nTemplate('Cost: $5').safe_substitute()",              returns: "'Cost: $5'" },
    { title: 'Keywords override the mapping',   code: "from string import Template\nTemplate('$x').substitute({'x': 1}, x=2)",           returns: "'2'" },
    { title: 'Any mapping works',               code: "from string import Template\nfrom collections import ChainMap\nTemplate('$a $b').substitute(ChainMap({'a': 1}, {'a': 9, 'b': 2}))", returns: "'1 2'" },
    { title: 'Names like self and mapping are fine', code: "from string import Template\nTemplate('$self $mapping').substitute(self=1, mapping=2)", returns: "'1 2'" },
  ],

  pitfalls: [
    {
      name: 'safe_substitute hiding typos',
      desc: 'A misspelt placeholder is not an error — it ends up in the output.',
      wrong: { label: 'safe_substitute', code: "from string import Template\nTemplate('Dear $nmae').safe_substitute(name='Ada')", output: "'Dear $nmae'" },
      fix:   { label: 'substitute', code: "from string import Template\nTemplate('Dear $nmae').substitute(name='Ada')", output: "KeyError: 'nmae'" },
    },
    {
      name: 'Catching only KeyError',
      desc: 'substitute raises ValueError, not KeyError, for a malformed $. Catch both, or check is_valid() first.',
      wrong: { label: 'except KeyError', code: "from string import Template\ntry:\n    out = Template('100$').substitute()\nexcept KeyError:\n    out = 'missing value'\nout", output: 'ValueError: Invalid placeholder in string: line 1, col 4' },
      fix:   { label: 'except (KeyError, ValueError)', code: "from string import Template\ntry:\n    out = Template('100$').substitute()\nexcept (KeyError, ValueError) as e:\n    out = f'bad template: {e}'\nout", output: "'bad template: Invalid placeholder in string: line 1, col 4'" },
    },
  ],

  when: {
    use: [
      'substitute — templates you control, where a missing value is a bug',
      'safe_substitute — user-edited templates, partial filling, previews',
    ],
    avoid: [
      'Production output from user templates with safe_substitute alone → validate with is_valid()/get_identifiers() first',
    ],
  },

  notes: {
    cpython:       'Both run self.pattern.sub(convert, self.template); convert returns str(mapping[named]) for a placeholder, the delimiter for $$, and for an invalid $ either raises (substitute) or returns the match unchanged (safe_substitute)',
    'Mapping':     'With both a mapping and keywords, a ChainMap(kwds, mapping) is used — keywords first',
    'Position':    'The ValueError column is the 1-based column of the offending $ on its line; lines are split with str.splitlines() rules',
  },

  related: [
    { name: 'string.Template',  slug: 'template',  when: 'Placeholder syntax and the class' },
    { name: 'Template.get_identifiers', slug: 'template-get_identifiers', when: 'Validate before substituting' },
    { name: 'KeyError',   slug: 'keyerror',   when: 'Raised by substitute for a missing name', category: 'exceptions' },
    { name: 'ValueError', slug: 'valueerror', when: 'Raised by substitute for a stray $',     category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is the difference between substitute and safe_substitute?',
      a: 'substitute raises KeyError when a placeholder has no value and ValueError when a $ is not followed by a valid name; safe_substitute does neither and leaves those parts of the text unchanged. Both replace $$ with $.',
    },
    {
      q: 'What does "Invalid placeholder in string: line 1, col N" mean?',
      a: 'There is a $ that is not $$, $name or ${name} — for example a price like $5, a trailing $, or ${ name } with spaces. N is the column of that $, counted from 1. Write $$ for a literal dollar sign.',
    },
    {
      q: 'Can I pass a dict to Template.substitute?',
      a: "Yes, as the first positional argument: t.substitute(values). Keyword arguments can be added and override the dict's entries.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.Template.substitute',
    meta:  'Template.substitute',
  },
};
