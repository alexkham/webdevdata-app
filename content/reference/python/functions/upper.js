// content/reference/python/functions/upper.js

export const meta = {
  slug:        'upper',
  name:        'str.upper',
  signature:   'str.upper()',
  blurb:       'Return a copy of the string with all cased characters uppercased.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'upper uppercase caps case convert',
};

export const method = {
  slug:      'upper',
  name:      'str.upper',
  signature: 'str.upper()',
  returns:   { type: 'str', desc: 'A new string with every cased character converted to uppercase. Uncased characters are unchanged.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Uppercase every cased character — the mirror of str.lower.',

  cheat: {
    commonCall: '"hello".upper()',
    returns:    'new str — original unchanged',
    replaces:   'digits and punctuation pass through untouched',
    watchOut:   'German ß uppercases to "SS" — length can change',
  },

  parameters: [],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',  values: { string: 'hello world' } },
    { id: 'mixed',   label: 'mixed',    values: { string: 'PyThOn 3.12!' } },
    { id: 'unicode', label: 'unicode',  values: { string: 'café' } },
    { id: 'eszett',  label: 'ß',        values: { string: 'straße' } },
  ],
  demoExplainer: 'Every character with an uppercase form is converted; digits and punctuation pass through. Note the ß case — it expands to SS, so the result can be longer than the input.',

  patterns: [
    {
      name: 'Constants and codes',
      desc: 'Normalize identifiers that are conventionally uppercase.',
      code: 'country = code.upper()  # \'us\' → \'US\'',
    },
    {
      name: 'Emphasis in terminal output',
      desc: 'Cheap visual weight without markup.',
      code: 'print(f"{level.upper()}: {message}")',
    },
    {
      name: 'Case-insensitive comparison',
      desc: 'Works like lower() — just pick one side convention and stick to it.',
      code: 'if answer.upper() == "Y":\n    proceed()',
    },
  ],

  examples: [
    { title: 'Basic uppercasing',      code: '"hello world".upper()', returns: "'HELLO WORLD'" },
    { title: 'Digits and punctuation', code: '"abc-123!".upper()',    returns: "'ABC-123!'" },
    { title: 'Unicode letters',        code: '"café".upper()',        returns: "'CAFÉ'" },
    { title: 'ß expands',              code: '"straße".upper()',      returns: "'STRASSE'" },
  ],

  pitfalls: [
    {
      name: 'The result must be assigned',
      desc: 'Strings are immutable — upper returns a new string.',
      wrong: { label: 'Wrong', code: 's = "hi"\ns.upper()\nprint(s)', output: 'hi' },
      fix:   { label: 'Fix', code: 's = s.upper()\nprint(s)', output: 'HI' },
    },
    {
      name: 'Length can change',
      desc: 'A few Unicode characters expand when uppercased — do not assume len is preserved.',
      wrong: { label: 'Surprising', code: 'len("straße") == len("straße".upper())', output: 'False — 6 vs 7' },
      fix:   { label: 'Measure after', code: 'padded = s.upper().ljust(width)', output: 'pad the converted string' },
    },
  ],

  when: {
    use: [
      'Display text that must be uppercase',
      'Normalizing conventional codes (ISO country, currency)',
      'Case-insensitive comparison (pick upper or lower, be consistent)',
    ],
    avoid: [
      'Caseless matching of arbitrary Unicode → str.casefold',
      'First letter only → str.capitalize',
      'Word-initial capitals → str.title',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_upper',
    memory:     'One new string (may grow for expanding characters)',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.lower',      slug: 'lower',      when: 'The mirror operation' },
    { name: 'str.capitalize', slug: 'capitalize', when: 'First character only' },
    { name: 'str.strip',      slug: 'strip',      when: 'Trim before normalizing' },
  ],

  faq: [
    {
      q: 'How do I check whether a string is already uppercase?',
      a: 'Use str.isupper — True when all cased characters are uppercase and at least one exists.',
      code: '"ABC".isupper()  # True',
    },
    {
      q: 'Why did my string get longer after upper()?',
      a: 'A few characters expand under case mapping — the classic is German ß → SS. Never assume upper() preserves length.',
    },
    {
      q: 'How do I uppercase only the first letter?',
      a: 'That is str.capitalize — but note it also LOWERCASES the rest.',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.upper',
    meta:  'str.upper',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
