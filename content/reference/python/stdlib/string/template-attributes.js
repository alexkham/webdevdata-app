// content/reference/python/stdlib/string/template-attributes.js — Template.delimiter / idpattern / braceidpattern / flags / pattern

export const meta = {
  slug:        'template-attributes',
  name:        'Template.delimiter / idpattern / braceidpattern / flags / pattern',
  signature:   'class T(Template): delimiter = … · idpattern = … · braceidpattern = … · flags = … · pattern = …',
  blurb:       'The class attributes a Template subclass overrides to change the syntax: the $ itself, what counts as a name, the flags of the regex — or the whole regex.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.4+ (flags 3.2+, braceidpattern 3.7+)',
  searchTerms: 'template delimiter idpattern braceidpattern flags pattern python Template.delimiter Template.idpattern Template.braceidpattern Template.flags Template.pattern custom delimiter percent sign template subclass dotted placeholder names __init_subclass__',
};

export const method = {
  slug:      'template-attributes',
  name:      'Template.delimiter / idpattern / braceidpattern / flags / pattern',
  signature: 'class T(Template): delimiter = … · idpattern = … · braceidpattern = … · flags = … · pattern = …',
  returns:   { type: 'str · str · str | None · re.RegexFlag · re.Pattern', desc: "Defaults: '$', '(?a:[_a-z][_a-z0-9]*)', None, re.IGNORECASE, and the compiled pattern built from them." },

  category:    'Template attributes',
  version:     'Python 2.4+ (flags 3.2+, braceidpattern 3.7+)',
  hasLiveDemo: true,

  subtitle: 'Set them in the body of a subclass. When the class is created, __init_subclass__ compiles delimiter, idpattern, braceidpattern and flags into the class attribute pattern — so changing them later on the class has no effect.',

  covers: ['Template.delimiter', 'Template.idpattern', 'Template.braceidpattern', 'Template.flags', 'Template.pattern'],

  cheat: {
    commonCall: "class Percent(Template):\n    delimiter = '%'",
    returns:    "Percent('%name').substitute(name='x') → 'x'",
    replaces:   'search-and-replace with a home-made regex',
    watchOut:   'set them in the class body; assigning T.delimiter afterwards is ignored',
  },

  parameters: [],

  attributes: [
    { name: 'delimiter',      type: 'str',            meaning: "The literal text that starts a placeholder; default '$'. Escaped with re.escape, so it is not a regex. Doubling it gives a literal." },
    { name: 'idpattern',      type: 'str',            meaning: "Regex for names after the delimiter; default '(?a:[_a-z][_a-z0-9]*)'. Also used inside braces unless braceidpattern is set." },
    { name: 'braceidpattern', type: 'str | None',     meaning: 'Regex for names inside {braces}; default None = use idpattern (3.7+).' },
    { name: 'flags',          type: 're.RegexFlag',   meaning: 'Flags for compiling; default re.IGNORECASE. re.VERBOSE is always added, so whitespace in your patterns is ignored (3.2+).' },
    { name: 'pattern',        type: 're.Pattern',     meaning: 'The compiled regex with groups escaped, named, braced and invalid. Override it to replace the syntax completely.' },
  ],

  modes: [
    {
      id: 'percent',
      label: "delimiter = '%'",
      blurb: 'A subclass that uses % instead of $. %% is now the literal, and $ is ordinary text.',
      params: [
        { name: 'text', type: 'str', hint: 'template using %name', input: 'text' },
        { name: 'name', type: 'str', hint: 'value for name', input: 'text' },
      ],
      template: "from string import Template\nclass Percent(Template):\n    delimiter = '%'\nPercent({$text}).safe_substitute(name={$name})",
      cases: [
        { id: 'basic',  label: '%name',       values: { text: 'Hi %name, 100%% sure', name: 'Ada' } },
        { id: 'dollar', label: '$ is text',   values: { text: '$5 for %{name}s', name: 'Ada' } },
        { id: 'stray',  label: 'stray %',     values: { text: '50% off for %name', name: 'Ada' } },
      ],
    },
    {
      id: 'dotted',
      label: 'idpattern with dots',
      blurb: "Allow dots in names, so $user.name is one placeholder. Values: 'user.name' and 'user'.",
      params: [
        { name: 'text', type: 'str', hint: 'template using $user.name', input: 'text' },
        { name: 'name', type: 'str', hint: "value for 'user.name'", input: 'text' },
      ],
      template: "from string import Template\nclass Dotted(Template):\n    idpattern = r'(?a:[_a-z][_a-z0-9.]*)'\nDotted({$text}).safe_substitute({'user.name': {$name}, 'user': 'U'})",
      cases: [
        { id: 'dot',    label: '$user.name',  values: { text: 'Hello $user.name!', name: 'Ada' } },
        { id: 'braced', label: '${user.name}', values: { text: '${user.name} / $user', name: 'Ada' } },
        { id: 'trail',  label: 'trailing dot', values: { text: 'Bye $user.name.', name: 'Ada' } },
      ],
    },
  ],
  demoExplainer: "With delimiter '%', '%%' is the escaped literal and a '%' before a space is an invalid placeholder, which safe_substitute leaves alone. Allowing '.' in idpattern has a cost: the name now swallows a sentence-ending dot, so 'Bye $user.name.' looks up 'user.name.', which does not exist — use ${user.name} at the end of a sentence.",

  patterns: [
    {
      name: 'Different delimiter',
      desc: 'Handy when the text is full of dollar signs (prices, shell snippets).',
      code: "from string import Template\n\nclass AtTemplate(Template):\n    delimiter = '@'\n\nAtTemplate('Total: $5 for @name').substitute(name='Ada')",
    },
    {
      name: 'Case-sensitive upper-case names',
      desc: 'Only $UPPER names are placeholders; drop IGNORECASE so lower-case text is left alone.',
      code: "from string import Template\n\nclass EnvTemplate(Template):\n    idpattern = r'[A-Z_][A-Z0-9_]*'\n    flags = 0\n\nEnvTemplate('$HOME is not $home').safe_substitute(HOME='/root')",
    },
    {
      name: 'A completely different syntax',
      desc: 'Override pattern with the four named groups — here {{name}} placeholders.',
      code: "from string import Template\n\nclass Mustache(Template):\n    pattern = r'''\\{\\{(?:\n        (?P<escaped>\\{\\{) |\n        (?P<named>[a-z]+)\\}\\} |\n        (?P<braced>[a-z]+)\\}\\} |\n        (?P<invalid>)\n    )'''\n\nMustache('Hi {{name}}!').substitute(name='Ada')",
    },
  ],

  examples: [
    { title: 'The defaults',              code: 'from string import Template\nTemplate.delimiter, Template.idpattern, Template.braceidpattern', returns: "('$', '(?a:[_a-z][_a-z0-9]*)', None)" },
    { title: 'Default flags',             code: 'from string import Template\nTemplate.flags',  returns: 're.IGNORECASE' },
    { title: 'pattern is compiled',       code: 'from string import Template\ntype(Template.pattern).__name__', returns: "'Pattern'" },
    { title: 'IGNORECASE: lower case matches too', code: "from string import Template\nclass Upper(Template):\n    idpattern = r'[A-Z]+'\nUpper('$NAME $name').safe_substitute(NAME='Ada', name='x')", returns: "'Ada x'" },
    { title: 'flags = 0 makes it strict', code: "from string import Template\nclass Upper(Template):\n    idpattern = r'[A-Z]+'\n    flags = 0\nUpper('$NAME $name').safe_substitute(NAME='Ada', name='x')", returns: "'Ada $name'" },
    { title: 'braceidpattern only inside braces', code: "from string import Template\nclass Spaced(Template):\n    braceidpattern = r'(?a:[_a-z][_a-z0-9 ]*)'\nSpaced('${first name} $first').substitute({'first name': 'Ada', 'first': 'A'})", returns: "'Ada A'" },
    { title: 'A custom pattern',          code: "from string import Template\nclass Mustache(Template):\n    pattern = r'''\\{\\{(?:\n        (?P<escaped>\\{\\{) |\n        (?P<named>[a-z]+)\\}\\} |\n        (?P<braced>[a-z]+)\\}\\} |\n        (?P<invalid>)\n    )'''\nMustache('Hi {{name}}!').substitute(name='Ada')", returns: "'Hi Ada!'" },
  ],

  pitfalls: [
    {
      name: 'Changing the delimiter after the class exists',
      desc: 'pattern is compiled once, when the class is created. Assigning the attribute later changes nothing.',
      wrong: { label: 'assign later', code: "from string import Template\nclass Late(Template):\n    pass\nLate.delimiter = '%'\nLate('%x $x').safe_substitute(x=1)", output: "'%x 1'" },
      fix:   { label: 'class body', code: "from string import Template\nclass Early(Template):\n    delimiter = '%'\nEarly('%x $x').safe_substitute(x=1)", output: "'1 $x'" },
    },
    {
      name: 'Dropping the (?a:) ASCII scope',
      desc: 'With IGNORECASE but without the ASCII flag, [a-z] also matches a few non-ASCII letters — such as the Kelvin sign (U+212A) and the long s ſ — which then become part of names.',
      wrong: { label: 'no (?a:)', code: "from string import Template\nclass Loose(Template):\n    idpattern = r'[_a-z][_a-z0-9]*'\nLoose('$\\u212a').get_identifiers()", output: "['K']" },
      fix:   { label: 'keep (?a:)', code: "from string import Template\nTemplate('$\\u212a').get_identifiers()", output: '[]' },
    },
  ],

  when: {
    use: [
      'Text that naturally contains $ (prices, shell code) — another delimiter',
      'Names with dots, dashes or upper-case conventions — idpattern / braceidpattern / flags',
      'A different placeholder syntax altogether — pattern',
    ],
    avoid: [
      'Logic in templates (conditions, loops) → a template engine',
    ],
  },

  notes: {
    cpython:        "Template.__init_subclass__ builds pattern = delimiter (re.escape'd) + (?: (?P<escaped>delim) | (?P<named>idpattern) | {(?P<braced>braceidpattern or idpattern)} | (?P<invalid>) ) and compiles it with flags | re.VERBOSE",
    'VERBOSE':      'Because re.VERBOSE is always added, a literal space in idpattern must be escaped or put in a character class',
    'pattern':      'A pattern you set yourself may be a str or an already compiled re.Pattern; it must define the groups escaped, named, braced and invalid',
    'Instance attribute': 'template — the text passed to the constructor; documented, but not meant to be changed',
  },

  related: [
    { name: 'string.Template',     slug: 'template',            when: 'The default syntax' },
    { name: 'Template.substitute', slug: 'template-substitute', when: 'Uses pattern to fill the template' },
    { name: 're.compile',          slug: 'compile', when: 'How pattern is built', category: 'stdlib/re' },
    { name: 're flags',            slug: 'flags',   when: 'IGNORECASE, VERBOSE, ASCII', category: 'stdlib/re' },
  ],

  faq: [
    {
      q: 'How do I use a different placeholder character than $ in string.Template?',
      a: "Subclass it and set delimiter in the class body: class P(Template): delimiter = '%'. Doubling the new delimiter (%%) gives a literal one, and $ becomes ordinary text.",
    },
    {
      q: 'Why does changing Template.delimiter not work?',
      a: 'The regular expression is compiled once when the class is created (in __init_subclass__). Set delimiter, idpattern, braceidpattern and flags in the subclass body, not by assignment afterwards.',
    },
    {
      q: 'How do I allow dots in Template placeholder names?',
      a: "Override idpattern, e.g. r'(?a:[_a-z][_a-z0-9.]*)', and pass the values with dotted keys in a dict. A name then also absorbs a dot at the end of a sentence, so prefer the ${user.name} form there.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#template-strings',
    meta:  'Template strings — advanced usage',
  },
};
