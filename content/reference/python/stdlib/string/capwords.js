// content/reference/python/stdlib/string/capwords.js

export const meta = {
  slug:        'capwords',
  name:        'string.capwords',
  signature:   'string.capwords(s, sep=None)',
  blurb:       'Capitalize every word: split the string, call str.capitalize() on each piece, join the pieces back together.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: "string capwords python capitalize each word capitalize first letter of every word title case without apostrophe problem capwords vs title they're sep separator",
};

export const method = {
  slug:      'capwords',
  name:      'string.capwords',
  signature: 'string.capwords(s, sep=None)',
  returns:   { type: 'str', desc: 'The capitalized words joined by sep (by a single space when sep is None).' },

  category:    'string function',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "One line of Python: (sep or ' ').join(map(str.capitalize, s.split(sep))). That explains everything it does — including lowercasing the rest of each word and squeezing whitespace.",

  covers: ['capwords'],

  cheat: {
    commonCall: "string.capwords(\"they're bill's friends\")",
    returns:    "\"They're Bill's Friends\"",
    replaces:   'str.title(), which capitalizes after apostrophes and digits',
    watchOut:   'the rest of every word is lowercased: iPhone → Iphone',
  },

  parameters: [
    { name: 's',   type: 'str',        required: true,  default: null,   desc: 'The text.' },
    { name: 'sep', type: 'str | None', required: false, default: 'None', desc: "None: split on runs of any whitespace, drop leading/trailing whitespace, join with ' '. A string: split on exactly that separator and join with it again. '' raises ValueError." },
  ],

  modes: [
    {
      id: 'words',
      label: 'capwords vs title',
      blurb: 'The same text through capwords and str.title().',
      params: [{ name: 'text', type: 'str', hint: 'some words', input: 'text' }],
      template: 'import string\n(string.capwords({$text}), {$text}.title())',
      cases: [
        { id: 'apos',  label: "they're",     values: { text: "they're bill's friends" } },
        { id: 'num',   label: 'digits',      values: { text: '1st place, 3rd row' } },
        { id: 'mixed', label: 'mixed case',  values: { text: 'iPhone and eBay' } },
        { id: 'space', label: 'whitespace',  values: { text: '  many   spaces\tand\nlines ' } },
        { id: 'greek', label: 'Greek sigma', values: { text: 'ΟΔΟΣ ΑΣ' } },
      ],
    },
    {
      id: 'sep',
      label: 'sep',
      blurb: 'With sep, only that exact separator splits words — and it is put back unchanged.',
      params: [
        { name: 'text', type: 'str', hint: 'some words',    input: 'text' },
        { name: 'sep',  type: 'str', hint: 'the separator', input: 'text' },
      ],
      template: 'import string\nstring.capwords({$text}, {$sep})',
      cases: [
        { id: 'dash',  label: "sep='-'",  values: { text: 'jean-luc picard', sep: '-' } },
        { id: 'comma', label: "sep=','",  values: { text: 'red,green, blue', sep: ',' } },
        { id: 'space', label: "sep=' '",  values: { text: '  two  spaces', sep: ' ' } },
        { id: 'empty', label: "sep=''",   values: { text: 'abc', sep: '' } },
      ],
    },
  ],
  demoExplainer: "title() treats every non-letter as a word boundary, so it gives \"They'Re\" and \"1St\"; capwords only splits on whitespace. Both lowercase the rest of each word. With sep=' ' the empty strings between doubled spaces are kept, so the spacing survives; with sep=None it collapses. In 'ΟΔΟΣ' the final capital sigma lowercases to ς, as in str.lower().",

  patterns: [
    {
      name: 'Names and headings',
      desc: 'Good default for user-entered names; check exceptions (McDonald, van Gogh) separately.',
      code: 'import string\ndisplay = string.capwords(raw_name.strip())',
    },
    {
      name: 'Capitalize hyphenated parts too',
      desc: 'Run it per separator.',
      code: 'import string\nname = "-".join(string.capwords(part) for part in raw.split("-"))',
    },
    {
      name: 'Capitalize only the first letter, keep the rest',
      desc: 'capwords lowercases the rest; slice instead if you must keep inner capitals.',
      code: 'fixed = " ".join(w[:1].upper() + w[1:] for w in text.split())',
    },
  ],

  examples: [
    { title: 'Apostrophes are not word breaks', code: "import string\nstring.capwords(\"they're bill's friends\")", returns: "\"They're Bill's Friends\"" },
    { title: 'Whitespace is normalized',     code: "import string\nstring.capwords('  hello   world\\n')",          returns: "'Hello World'" },
    { title: 'Rest of the word lowercased',  code: "import string\nstring.capwords('HELLO wORLD')",                returns: "'Hello World'" },
    { title: 'sep splits and joins',         code: "import string\nstring.capwords('a-b c-d', '-')",              returns: "'A-B c-D'" },
    { title: "sep=' ' keeps the spacing",    code: "import string\nstring.capwords('  a  b  ', ' ')",             returns: "'  A  B  '" },
    { title: 'Digits do not start a word',   code: "import string\nstring.capwords('1st place')",                 returns: "'1st Place'" },
    { title: 'Empty separator',              code: "import string\nstring.capwords('abc', '')",                   returns: 'ValueError: empty separator' },
  ],

  pitfalls: [
    {
      name: 'Losing inner capitals',
      desc: 'str.capitalize lowercases everything after the first character, so brand names and acronyms are flattened.',
      wrong: { label: 'capwords', code: "import string\nstring.capwords('NASA and iPhone')", output: "'Nasa And Iphone'" },
      fix:   { label: 'first letter only', code: "' '.join(w[:1].upper() + w[1:] for w in 'NASA and iPhone'.split())", output: "'NASA And IPhone'" },
    },
    {
      name: 'Expecting sep to split on more than one character type',
      desc: 'sep is one exact string. Words separated by spaces are not split when sep is "-".',
      wrong: { label: "sep='-'", code: "import string\nstring.capwords('jean-luc picard', '-')", output: "'Jean-Luc picard'" },
      fix:   { label: 'both separators', code: "import string\n' '.join(string.capwords(w, '-') for w in 'jean-luc picard'.split())", output: "'Jean-Luc Picard'" },
    },
  ],

  when: {
    use: [
      "Title-casing names, headings and labels where title() would produce \"Don'T\"",
      'Cleaning up messy spacing and capitalization in one call',
    ],
    avoid: [
      'Text with acronyms or brand names that must keep their capitals',
      'Real headline style (small words lowercase) → write your own rule',
    ],
  },

  notes: {
    cpython:      "Lib/string.py: return (sep or ' ').join(map(str.capitalize, s.split(sep)))",
    'Unicode':    'str.capitalize titlecases the first character (ǆ → ǅ, ﬁ → Fi) and lowercases the rest, with the Greek final-sigma rule',
    'sep falsy':  "sep='' reaches s.split('') and raises ValueError: empty separator",
  },

  related: [
    { name: 'str.title()',      slug: 'title',      when: 'Capitalizes after every non-letter', category: 'functions' },
    { name: 'str.capitalize()', slug: 'capitalize', when: 'What capwords applies to each word', category: 'functions' },
    { name: 'str.split()',      slug: 'split',      when: 'How the words are found', category: 'functions' },
    { name: 'str.join()',       slug: 'join',       when: 'How they are put back', category: 'functions' },
    { name: 'string module',    slug: 'string',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I capitalize the first letter of each word in Python?',
      a: "string.capwords(s) — or s.title() if the text has no apostrophes or digits. capwords(\"don't stop\") gives \"Don't Stop\"; \"don't stop\".title() gives \"Don'T Stop\".",
    },
    {
      q: 'Why does capwords change "iPhone" to "Iphone"?',
      a: 'Each word goes through str.capitalize(), which uppercases the first character and lowercases all the others. To keep the rest of the word, use w[:1].upper() + w[1:] per word.',
    },
    {
      q: 'Does capwords keep my spacing?',
      a: "Not by default: with sep=None it splits on any run of whitespace and joins with one space, so tabs, newlines and double spaces become single spaces and the ends are stripped. Pass sep=' ' to keep runs of spaces.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/string.html#string.capwords',
    meta:  'string.capwords',
  },
};
