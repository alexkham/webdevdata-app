// content/reference/python/functions/str-isalpha.js
//
// Slug is type-prefixed: `isalpha` is a str method (also on bytes).

export const meta = {
  slug:        'str-isalpha',
  name:        'str.isalpha',
  signature:   'str.isalpha()',
  blurb:       'True if every character is alphabetic and the string is non-empty.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isalpha alphabetic letter check unicode non empty validate name',
};

export const method = {
  slug:      'str-isalpha',
  name:      'str.isalpha',
  signature: 'str.isalpha()',
  returns:   { type: 'bool', desc: 'True if every character in the string is alphabetic AND the string is non-empty. False otherwise — including for the empty string.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Check that a string contains only letters — Unicode-aware, and False on empty.',

  cheat: {
    commonCall: 'if name.isalpha():',
    returns:    'True or False',
    replaces:   'a manual loop of `if not ch.isalpha(): return False`',
    watchOut:   'empty string → False; spaces and digits both break it',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'letters',    label: 'all letters',    values: { string: 'hello' } },
    { id: 'mixed',      label: 'letters+digits', values: { string: 'hello123' } },
    { id: 'digits',     label: 'only digits',    values: { string: '12345' } },
    { id: 'space',      label: 'with space',     values: { string: 'hello world' } },
    { id: 'unicode',    label: 'unicode',        values: { string: 'café' } },
    { id: 'cyrillic',   label: 'cyrillic',       values: { string: 'Привет' } },
    { id: 'empty',      label: 'empty',          values: { string: '' } },
    { id: 'punct',      label: 'punctuation',    values: { string: "don&apos;t" } },
  ],
  demoExplainer: 'isalpha() returns True only when EVERY character is alphabetic AND the string is not empty. Alphabetic means letters from any script — Latin, Cyrillic, Greek, CJK — as classified by the Unicode standard. Digits, spaces, punctuation, and emojis all break it. The empty string returns False by convention (same as isdigit).',

  patterns: [
    {
      name: 'Validate a name-shaped input',
      desc: 'Quick sanity check before deeper validation.',
      code: 'if not name.isalpha():\n    raise ValueError("letters only")',
    },
    {
      name: 'Composite check',
      desc: 'Combine with isdigit for &quot;letters or digits, but no punctuation&quot;.',
      code: 'if s.isalnum() and not s.isdigit():\n    ...    # has at least one letter',
    },
    {
      name: 'Strip and check',
      desc: 'Real names have spaces — strip first if you want to allow them.',
      code: 'if all(part.isalpha() for part in name.split()):\n    ...',
    },
  ],

  examples: [
    { title: 'All letters',         code: '"hello".isalpha()',      returns: 'True' },
    { title: 'Mixed with digits',   code: '"hello123".isalpha()',   returns: 'False' },
    { title: 'Space breaks it',     code: '"hello world".isalpha()',returns: 'False' },
    { title: 'Unicode accents',     code: '"café".isalpha()',       returns: 'True' },
    { title: 'Cyrillic',            code: '"Привет".isalpha()',     returns: 'True' },
    { title: 'Empty is False',      code: '"".isalpha()',           returns: 'False' },
    { title: 'Punctuation breaks',  code: '"don\\&apos;t".isalpha()', returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Empty string returns False, not True',
      desc: 'A common surprise — you might expect &quot;all zero characters are letters&quot; to be vacuously true. Python defines it the other way: isalpha requires at least one character AND every one must be a letter.',
      wrong: { label: 'Wrong expectation', code: '"".isalpha()', output: 'False' },
      fix:   { label: 'Read the contract', code: '"".isalpha()   # always False\n"".isdigit()   # always False\n"".isspace()   # always False', output: 'documented behaviour' },
    },
    {
      name: 'Spaces are NOT alphabetic',
      desc: 'A single space in a name breaks isalpha. Split first if multi-word input is legitimate.',
      wrong: { label: 'Multi-word fails', code: '"John Smith".isalpha()', output: 'False  # the space' },
      fix:   { label: 'Per word',         code: 'all(p.isalpha() for p in "John Smith".split())', output: 'True' },
    },
    {
      name: 'Digits are NOT alphabetic',
      desc: 'For &quot;letters or digits&quot; use isalnum instead. Numeric-looking letter forms (Roman numerals, superscripts) can be surprising — they may pass isnumeric but not isdigit.',
      wrong: { label: 'Mixed fails', code: '"user1".isalpha()', output: 'False' },
      fix:   { label: 'Use isalnum', code: '"user1".isalnum()', output: 'True' },
    },
    {
      name: 'Unicode "letters" include scripts you may not expect',
      desc: 'isalpha returns True for any character Unicode classifies as a letter — Chinese ideographs, Arabic, Devanagari, and even some symbols. If you meant ASCII letters only, filter explicitly.',
      wrong: { label: 'Too permissive', code: '"漢字".isalpha()', output: 'True  # CJK ideographs pass' },
      fix:   { label: 'ASCII only',      code: 'name.isascii() and name.isalpha()', output: 'True only for ASCII letters' },
    },
  ],

  when: {
    use: [
      'Sanity-checking that a token looks like a word',
      'Combined with .split() for word-by-word validation',
      'Composing with isalnum, isdigit, isspace for finer checks',
      'Filtering tokens in a lexer / tokenizer',
    ],
    avoid: [
      'Allowing spaces or punctuation → split first, or use a regex',
      'ASCII-only validation → combine with .isascii()',
      'Numeric content allowed → isalnum instead',
      'Rich validation (length, format) → use a validator library or regex',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isalpha',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'isdigit',    slug: 'isdigit',    when: 'Digits instead of letters — same contract shape' },
    { name: 'startswith', slug: 'startswith', when: 'Prefix test rather than whole-string' },
    { name: 'lower',      slug: 'lower',      when: 'Normalize before comparing letters' },
    { name: 'strip',      slug: 'strip',      when: 'Trim whitespace before validation' },
  ],

  faq: [
    {
      q: 'Why does &quot;&quot;.isalpha() return False?',
      a: 'Python defines the empty case as False: isalpha requires at least one character. It mirrors the isdigit / isspace / isalnum family — all False on the empty string.',
    },
    {
      q: 'How do I allow spaces in names?',
      a: 'Split on whitespace and check every part, or use a regex.',
      code: 'all(part.isalpha() for part in "John Smith".split())\n# True',
    },
    {
      q: 'How do I restrict to ASCII letters only?',
      a: 'Combine with .isascii() (Python 3.7+).',
      code: 's.isascii() and s.isalpha()   # True only for ASCII letters',
    },
    {
      q: 'What is the difference between isalpha and isalnum?',
      a: 'isalpha requires every character to be a letter. isalnum accepts letters OR digits (and combinations). Both reject spaces, punctuation, and the empty string.',
    },
  ],

  history: [
    { version: '1.0', note: 'isalpha() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — accepts letters from any script per Unicode categorization.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isalpha',
    meta:  'str.isalpha',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};