// content/reference/python/stdlib/string/index.js — the string module hub

export const meta = {
  slug:        'index',
  name:        'string',
  signature:   'import string',
  blurb:       'Character-class constants (ascii_letters, digits, punctuation …), capwords(), $-placeholder Template strings and the customizable Formatter behind str.format.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'string module python import string ascii_letters ascii_lowercase ascii_uppercase digits hexdigits octdigits punctuation printable whitespace capwords Template substitute safe_substitute Formatter custom format string constants',
};

export const method = {
  slug: 'index',
  name: 'string',

  category:    'Text',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  coverClasses: ['Formatter', 'Template'],

  subtitle: 'Not where the string methods live — those are on str itself. The string module adds ASCII character sets, capwords(), the $name Template for user-editable text, and Formatter, which lets you subclass str.format.',

  imports: ['import string', 'from string import Template, Formatter, capwords'],
  facts: [
    { label: 'Constants', value: 'ascii_letters, ascii_lowercase, ascii_uppercase, digits, hexdigits, octdigits, punctuation, printable, whitespace — all plain str, all ASCII' },
    { label: 'Function',  value: 'capwords(s, sep=None) — split, capitalize each word, join' },
    { label: 'Classes',   value: 'Template ($name placeholders, substitute / safe_substitute) and Formatter (str.format as overridable methods)' },
    { label: 'Not here',  value: 'upper, split, strip, replace … are str methods; the old string.upper()-style functions were removed in Python 3' },
  ],

  modes: [
    {
      id: 'template',
      label: 'Template',
      blurb: 'Fill $placeholders. A missing name raises KeyError; a $ that is not a placeholder raises ValueError.',
      params: [
        { name: 'text', type: 'str', hint: 'template with $who and $what', input: 'text' },
        { name: 'who',  type: 'str', hint: 'value for who',  input: 'text' },
        { name: 'what', type: 'str', hint: 'value for what', input: 'text' },
      ],
      template: 'from string import Template\nTemplate({$text}).substitute(who={$who}, what={$what})',
      cases: [
        { id: 'basic',  label: '$who likes $what', values: { text: '$who likes $what', who: 'Ada', what: 'tea' } },
        { id: 'braced', label: '${what}s',         values: { text: '$who bought three ${what}s for $$5', who: 'Bo', what: 'apple' } },
        { id: 'missing', label: 'unknown name',    values: { text: '$who met $whom', who: 'Ada', what: 'x' } },
        { id: 'bad',    label: 'stray $',          values: { text: 'Pay $who $10', who: 'Ada', what: 'x' } },
      ],
    },
    {
      id: 'capwords',
      label: 'capwords',
      blurb: 'Capitalize every word. Compare with str.title(), which also capitalizes after apostrophes and digits.',
      params: [{ name: 'text', type: 'str', hint: 'some words', input: 'text' }],
      template: 'import string\n(string.capwords({$text}), {$text}.title())',
      cases: [
        { id: 'apos',  label: 'apostrophes',  values: { text: "they're bill's friends" } },
        { id: 'space', label: 'extra spaces', values: { text: '  hello   WORLD  ' } },
        { id: 'num',   label: 'digits',       values: { text: '1st place, 2nd try' } },
      ],
    },
    {
      id: 'chars',
      label: 'constants',
      blurb: 'Use the constants as character sets: keep only the characters of one class.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: "import string\n''.join(c for c in {$text} if c not in string.punctuation)",
      cases: [
        { id: 'sentence', label: 'a sentence',  values: { text: 'Hello, world! (Is this "it"?)' } },
        { id: 'unicode',  label: 'curly quotes', values: { text: '“Smart” quotes — and é…' } },
      ],
    },
  ],
  demoExplainer: 'capwords splits on whitespace, so it only capitalizes the first letter of each space-separated word and collapses runs of spaces; title() starts a new word after every non-letter, giving "They\'Re". Template raises KeyError(\'whom\') for an unknown name and "Invalid placeholder in string: line 1, col 10" for the $ before 10 (the column of that $, counted from 1). string.punctuation is ASCII only: curly quotes, the dash and the ellipsis survive the filter.',

  patterns: [
    {
      name: 'User-editable message templates',
      desc: 'Template is safe for text written by non-programmers: no attribute access, no format specs, no code.',
      code: 'from string import Template\nmsg = Template(settings["welcome"]).safe_substitute(name=user.name)',
    },
    {
      name: 'Random password from character sets',
      desc: 'Combine the constants and draw with the secrets module.',
      code: 'import secrets, string\nalphabet = string.ascii_letters + string.digits\npassword = "".join(secrets.choice(alphabet) for _ in range(16))',
    },
    {
      name: 'Strip ASCII punctuation',
      desc: 'str.translate with a deletion table is the fast way.',
      code: 'import string\nclean = text.translate(str.maketrans("", "", string.punctuation))',
    },
    {
      name: 'A Formatter that tolerates missing keys',
      desc: 'Override get_value to supply a default.',
      code: 'import string\n\nclass Lenient(string.Formatter):\n    def get_value(self, key, args, kwargs):\n        if isinstance(key, str):\n            return kwargs.get(key, "{" + key + "}")\n        return super().get_value(key, args, kwargs)\n\nLenient().format("{a} {b}", a=1)',
    },
  ],

  examples: [
    { title: 'Letters and digits',          code: 'import string\nstring.ascii_letters + string.digits', returns: "'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'" },
    { title: 'Membership test',             code: "import string\nall(c in string.hexdigits for c in 'C0FFEE')", returns: 'True' },
    { title: 'capwords',                    code: "import string\nstring.capwords('hello   world')", returns: "'Hello World'" },
    { title: 'Template substitution',       code: "from string import Template\nTemplate('$who likes $what').substitute(who='Ada', what='tea')", returns: "'Ada likes tea'" },
    { title: 'safe_substitute keeps unknowns', code: "from string import Template\nTemplate('$who likes $what').safe_substitute(who='Ada')", returns: "'Ada likes $what'" },
    { title: 'Formatter works like str.format', code: "import string\nstring.Formatter().format('{0}-{x}', 'a', x='b')", returns: "'a-b'" },
    { title: 'The module has no upper()',   code: "import string\nstring.upper('x')", returns: "AttributeError: module 'string' has no attribute 'upper'" },
  ],

  pitfalls: [
    {
      name: 'Calling Python 2 string functions',
      desc: 'string.upper, string.split, string.join and friends were removed in Python 3. They are methods of str.',
      wrong: { label: 'string.join', code: "import string\nstring.join(['a', 'b'], '-')", output: "AttributeError: module 'string' has no attribute 'join'" },
      fix:   { label: 'str.join', code: "'-'.join(['a', 'b'])", output: "'a-b'" },
    },
    {
      name: 'Naming a variable string',
      desc: 'A variable called string shadows the module, and the next string.digits fails.',
      wrong: { label: 'shadowed', code: "import string\nstring = 'abc'\nstring.digits", output: "AttributeError: 'str' object has no attribute 'digits'" },
      fix:   { label: 'another name', code: "import string\ntext = 'abc'\nstring.digits", output: "'0123456789'" },
    },
    {
      name: 'Treating the constants as Unicode-aware',
      desc: 'Every constant is ASCII only. For any letter or digit use str.isalpha() / isdigit().',
      wrong: { label: 'ascii_letters', code: "import string\n'é' in string.ascii_letters", output: 'False' },
      fix:   { label: 'str.isalpha', code: "'é'.isalpha()", output: 'True' },
    },
  ],

  when: {
    use: [
      'Character sets for validation, filtering and password generation (ASCII)',
      'Templates whose text is written by users or translators — Template',
      'Changing how {fields} are looked up or formatted — subclass Formatter',
    ],
    avoid: [
      'Everyday formatting → f-strings or str.format',
      'Unicode-aware character tests → str.isalpha, isdigit, isspace',
      'HTML or large templates → a template engine (Jinja2, string.Template is deliberately minimal)',
    ],
  },

  notes: {
    cpython:      'Lib/string.py — pure Python; Formatter reuses the C parser behind str.format through _string.formatter_parser and _string.formatter_field_name_split',
    'Constants':  'Fixed ASCII strings, not locale-dependent (the Python 2 string.letters/lowercase/uppercase that followed the locale are gone)',
    'Template':   'Default placeholder pattern: $ followed by an ASCII identifier, or the same in braces; $$ is a literal $',
  },

  related: [
    { name: 'str.format()',  slug: 'str-format', when: 'The built-in formatter that Formatter mirrors', category: 'functions' },
    { name: 'str.title()',   slug: 'title',      when: 'The other way to capitalize words', category: 'functions' },
    { name: 'str.isalpha()', slug: 'str-isalpha', when: 'Unicode-aware alternative to ascii_letters', category: 'functions' },
    { name: 'html module',   slug: 'html',       when: 'Escape values before putting them in HTML', category: 'stdlib' },
    { name: 're module',     slug: 're',         when: 'Character classes in patterns instead of constants', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is in Python\'s string module?',
      a: 'Nine str constants (ascii_letters, ascii_lowercase, ascii_uppercase, digits, hexdigits, octdigits, punctuation, printable, whitespace), the function capwords, and two classes: Template for $-placeholder substitution and Formatter, an overridable version of str.format. The usual string methods (upper, split, replace …) are on str, not in this module.',
    },
    {
      q: 'When should I use string.Template instead of f-strings or str.format?',
      a: 'When the template text comes from outside your code — config files, translations, user settings. Template only substitutes names: it cannot read attributes, index or run format specs, so a hostile template cannot reach into your objects the way "{user.__class__}" can with str.format.',
    },
    {
      q: 'What is the difference between string.capwords and str.title?',
      a: "capwords splits on whitespace and capitalizes each word, so \"they're\" becomes \"They're\". title() starts a new word after every non-letter, giving \"They'Re\" and \"1St\". capwords also collapses runs of whitespace into single spaces.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html',
    meta:  'string — Common string operations',
  },
};
