// content/reference/python/stdlib/string/constants.js — the nine character-set constants

export const meta = {
  slug:        'constants',
  name:        'string.ascii_letters / digits / punctuation …',
  signature:   'string.ascii_letters · ascii_lowercase · ascii_uppercase · digits · hexdigits · octdigits · punctuation · printable · whitespace',
  blurb:       'Nine ready-made str constants listing ASCII character classes — letters, digits, hex and octal digits, punctuation, whitespace and everything printable.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'string constants python string.ascii_letters string.ascii_lowercase string.ascii_uppercase string.digits string.hexdigits string.octdigits string.punctuation string.printable string.whitespace ascii_letters ascii_lowercase ascii_uppercase digits hexdigits octdigits punctuation printable whitespace alphabet list of letters a-z remove punctuation',
};

export const method = {
  slug:      'constants',
  name:      'string.ascii_letters / digits / punctuation …',
  signature: 'string.ascii_letters · ascii_lowercase · ascii_uppercase · digits · hexdigits · octdigits · punctuation · printable · whitespace',
  returns:   { type: 'str', desc: 'Each constant is an ordinary, immutable str.' },

  category:    'string constants',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Plain strings you test membership against or build alphabets from. All nine are ASCII only and never depend on the locale — and because they are strings, "in" is a substring test, not a character test.',

  covers: ['ascii_letters', 'ascii_lowercase', 'ascii_uppercase', 'digits', 'hexdigits', 'octdigits', 'punctuation', 'printable', 'whitespace'],

  cheat: {
    commonCall: "c in string.punctuation",
    returns:    'bool — or the str itself, e.g. string.digits is \'0123456789\'',
    replaces:   "hand-typed 'abcdefghijklmnopqrstuvwxyz' and chr(ord('a') + i) loops",
    watchOut:   "'' and multi-character strings: '' in string.digits is True",
  },

  parameters: [],

  attributes: [
    { name: 'ascii_lowercase', type: 'str', meaning: "'abcdefghijklmnopqrstuvwxyz' (26)" },
    { name: 'ascii_uppercase', type: 'str', meaning: "'ABCDEFGHIJKLMNOPQRSTUVWXYZ' (26)" },
    { name: 'ascii_letters',   type: 'str', meaning: 'ascii_lowercase + ascii_uppercase (52), lowercase first' },
    { name: 'digits',          type: 'str', meaning: "'0123456789'" },
    { name: 'hexdigits',       type: 'str', meaning: "'0123456789abcdefABCDEF' (22)" },
    { name: 'octdigits',       type: 'str', meaning: "'01234567'" },
    { name: 'punctuation',     type: 'str', meaning: 'The 32 ASCII punctuation and symbol characters !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' },
    { name: 'whitespace',      type: 'str', meaning: "' \\t\\n\\r\\x0b\\x0c' — space, tab, newline, carriage return, vertical tab, form feed" },
    { name: 'printable',       type: 'str', meaning: 'digits + ascii_letters + punctuation + whitespace (100 characters)' },
  ],

  modes: [
    {
      id: 'which',
      label: 'which constants?',
      blurb: 'Which constants contain the text? Try one character, then two, then an empty string.',
      params: [{ name: 'ch', type: 'str', hint: 'a character', input: 'text' }],
      template: "import string\nnames = ['ascii_lowercase', 'ascii_uppercase', 'digits', 'hexdigits', 'octdigits', 'punctuation', 'whitespace']\n[n for n in names if {$ch} in getattr(string, n)]",
      cases: [
        { id: 'a',     label: "'a'",   values: { ch: 'a' } },
        { id: 'seven', label: "'7'",   values: { ch: '7' } },
        { id: 'under', label: "'_'",   values: { ch: '_' } },
        { id: 'e',     label: "'é'",   values: { ch: 'é' } },
        { id: 'ab',    label: "'ab'",  values: { ch: 'ab' } },
        { id: 'empty', label: "''",    values: { ch: '' } },
      ],
    },
    {
      id: 'check',
      label: 'validate',
      blurb: 'Is every character a hex digit? all() over the characters is the correct membership test.',
      params: [{ name: 'text', type: 'str', hint: 'e.g. a colour code', input: 'text' }],
      template: 'import string\nall(c in string.hexdigits for c in {$text})',
      cases: [
        { id: 'ok',     label: "'C0FFEE'", values: { text: 'C0FFEE' } },
        { id: 'prefix', label: "'0x1f'",   values: { text: '0x1f' } },
        { id: 'empty',  label: "''",       values: { text: '' } },
      ],
    },
    {
      id: 'value',
      label: 'look up',
      blurb: 'Read a constant by name.',
      params: [{ name: 'name', type: 'str', hint: 'a constant name', input: 'text' }],
      template: 'import string\ngetattr(string, {$name})',
      cases: [
        { id: 'punct', label: 'punctuation', values: { name: 'punctuation' } },
        { id: 'ws',    label: 'whitespace',  values: { name: 'whitespace' } },
        { id: 'hex',   label: 'hexdigits',   values: { name: 'hexdigits' } },
        { id: 'gone',  label: 'letters (Python 2)', values: { name: 'letters' } },
      ],
    },
  ],
  demoExplainer: "'7' is in digits, hexdigits and octdigits at once. 'ab' is found in ascii_lowercase because in tests for a substring, and the empty string is a substring of everything — so test characters one at a time, as the validate tab does. all() of nothing is True, so an empty string passes validation unless you check its length too. string.letters existed only in Python 2.",

  patterns: [
    {
      name: 'Remove punctuation',
      desc: 'A translate table deletes every listed character in one pass.',
      code: 'import string\ntable = str.maketrans("", "", string.punctuation)\nclean = text.translate(table)',
    },
    {
      name: 'Random token',
      desc: 'secrets.choice over a constant alphabet — never random for security.',
      code: 'import secrets, string\nalphabet = string.ascii_letters + string.digits\ntoken = "".join(secrets.choice(alphabet) for _ in range(20))',
    },
    {
      name: 'Fast membership with a set',
      desc: 'Turn a constant into a set when testing many characters.',
      code: 'import string\nallowed = set(string.ascii_lowercase + string.digits + "-")\nok = slug != "" and set(slug) <= allowed',
    },
    {
      name: 'Letter positions',
      desc: 'index() on ascii_lowercase gives 0-based alphabet positions.',
      code: 'import string\npos = string.ascii_lowercase.index(letter.lower()) + 1',
    },
  ],

  examples: [
    { title: 'ascii_letters: lowercase first', code: 'import string\nstring.ascii_letters',               returns: "'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'" },
    { title: 'hexdigits has both cases',     code: 'import string\nstring.hexdigits',                   returns: "'0123456789abcdefABCDEF'" },
    { title: 'punctuation',                  code: 'import string\nstring.punctuation',                 returns: "'!\"#$%&\\'()*+,-./:;<=>?@[\\\\]^_`{|}~'" },
    { title: 'whitespace',                   code: 'import string\nstring.whitespace',                  returns: "' \\t\\n\\r\\x0b\\x0c'" },
    { title: 'Sizes',                        code: 'import string\nlen(string.punctuation), len(string.printable)', returns: '(32, 100)' },
    { title: 'Alphabet positions',           code: "import string\n[string.ascii_lowercase.index(c) + 1 for c in 'abz']", returns: '[1, 2, 26]' },
    { title: 'ASCII only',                   code: "import string\n'é' in string.ascii_letters, '\\xa0' in string.whitespace", returns: '(False, False)' },
  ],

  pitfalls: [
    {
      name: '"in" tests substrings, not characters',
      desc: 'A multi-character or empty string passes the test as long as it appears somewhere in the constant.',
      wrong: { label: 'text in digits', code: "import string\n'' in string.digits, '123' in string.digits", output: '(True, True)' },
      fix:   { label: 'every character', code: "import string\ns = ''\nbool(s) and all(c in string.digits for c in s)", output: 'False' },
    },
    {
      name: 'Expecting Unicode letters, digits and spaces',
      desc: 'The constants are ASCII. Accented letters, Arabic-Indic digits and the no-break space are missing; the str methods know them.',
      wrong: { label: 'constants', code: "import string\n'é' in string.ascii_letters, '٣' in string.digits", output: '(False, False)' },
      fix:   { label: 'str methods', code: "'é'.isalpha(), '٣'.isdigit()", output: '(True, True)' },
    },
    {
      name: 'printable is not str.isprintable()',
      desc: "string.printable includes tab, newline and the other whitespace controls; str.isprintable() rejects them (only the space counts).",
      wrong: { label: 'assume equal', code: "import string\n'\\n' in string.printable, '\\n'.isprintable()", output: '(True, False)' },
      fix:   { label: 'pick the one you mean', code: "import string\nset(string.printable) - set(string.whitespace) == {c for c in map(chr, range(128)) if c.isprintable() and c != ' '}", output: 'True' },
    },
  ],

  when: {
    use: [
      'Building alphabets for tokens, IDs and puzzles',
      'Filtering or validating ASCII-only input (identifiers, hex codes, slugs)',
    ],
    avoid: [
      'Natural-language text → str.isalpha(), isdigit(), isspace() (Unicode-aware)',
      'Complex validation → re with a character class, e.g. re.fullmatch(r"[0-9a-f]+", s)',
    ],
  },

  notes: {
    cpython:     "Lib/string.py defines them as literals: whitespace = ' \\t\\n\\r\\v\\f', ascii_letters = ascii_lowercase + ascii_uppercase, printable = digits + ascii_letters + punctuation + whitespace",
    'Mutability': 'They are module attributes: rebinding string.digits is possible but affects every user of the module — never do it',
    'Python 2':  'letters, lowercase, uppercase (locale-dependent), maketrans and the function versions of str methods were removed in Python 3',
  },

  related: [
    { name: 'str.isalpha()',  slug: 'str-isalpha',  when: 'Unicode-aware letter test', category: 'functions' },
    { name: 'str.isdigit()',  slug: 'isdigit',      when: 'Unicode-aware digit test', category: 'functions' },
    { name: 'str.isspace()',  slug: 'str-isspace',  when: 'All Unicode whitespace, not just ASCII', category: 'functions' },
    { name: 'str.translate()', slug: 'str-translate', when: 'Delete punctuation in one pass', category: 'functions' },
    { name: 'string.capwords', slug: 'capwords',    when: 'The module function' },
    { name: 'string module',  slug: 'string',       when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get a list of the letters a to z in Python?',
      a: "import string, then string.ascii_lowercase is 'abcdefghijklmnopqrstuvwxyz'; list(string.ascii_lowercase) gives the list. ascii_uppercase has A-Z and ascii_letters both (lowercase first).",
    },
    {
      q: 'What characters are in string.punctuation?',
      a: 'The 32 ASCII characters that are neither letters, digits nor whitespace: !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~. Unicode punctuation such as curly quotes, dashes and the ellipsis is not included.',
    },
    {
      q: 'What is string.whitespace?',
      a: "' \\t\\n\\r\\x0b\\x0c' — space, tab, line feed, carriage return, vertical tab and form feed. str.split() and str.isspace() also treat Unicode spaces (no-break space, em space …) as whitespace; this constant does not.",
    },
    {
      q: 'What is the difference between string.digits and str.isdigit()?',
      a: "string.digits is just '0123456789'. isdigit() is true for any Unicode digit, including superscripts like ² and other scripts' digits, so use the constant when you need ASCII 0-9 only.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string-constants',
    meta:  'String constants',
  },
};
