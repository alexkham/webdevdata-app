// content/reference/python/functions/str-isalnum.js
//
// Slug is type-prefixed: `isalnum` is a str method (also on bytes).

export const meta = {
  slug:        'str-isalnum',
  name:        'str.isalnum',
  signature:   'str.isalnum()',
  blurb:       'True if every character is a letter or digit and the string is non-empty.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isalnum alphanumeric letters digits check unicode empty validate identifier',
};

export const method = {
  slug:      'str-isalnum',
  name:      'str.isalnum',
  signature: 'str.isalnum()',
  returns:   { type: 'bool', desc: 'True if every character in the string is either a letter or a digit AND the string is non-empty. False otherwise — including for the empty string.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The letters-OR-digits check — the union of isalpha and (isdigit / isnumeric / isdecimal).',

  cheat: {
    commonCall: 'if token.isalnum():',
    returns:    'True or False',
    replaces:   'a manual loop of `if not (ch.isalpha() or ch.isdigit()): return False`',
    watchOut:   'empty string → False; underscores and spaces both break it',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'letters',   label: 'all letters',    values: { string: 'hello' } },
    { id: 'digits',    label: 'all digits',     values: { string: '12345' } },
    { id: 'mixed',     label: 'letters+digits', values: { string: 'hello123' } },
    { id: 'space',     label: 'with space',     values: { string: 'hello world' } },
    { id: 'unicode',   label: 'unicode',        values: { string: 'café1' } },
    { id: 'underscore',label: 'underscore',     values: { string: 'user_name' } },
    { id: 'empty',     label: 'empty',          values: { string: '' } },
    { id: 'punct',     label: 'punctuation',    values: { string: 'a.b' } },
  ],
  demoExplainer: 'isalnum() returns True when EVERY character is either a letter or a digit AND the string is non-empty. Spaces, underscores, hyphens, dots, and any other punctuation all break it. &quot;Letter&quot; and &quot;digit&quot; are Unicode-aware — accented letters and non-Latin scripts pass, but so do numeric characters from other systems. The empty string returns False by convention.',

  patterns: [
    {
      name: 'Loose identifier check',
      desc: 'Real identifiers also allow underscores; for a proper check use str.isidentifier().',
      code: 'if not token.isalnum():\n    raise ValueError("letters and digits only")',
    },
    {
      name: 'Reject punctuation and whitespace',
      desc: 'A quick sanity check on user-typed short codes.',
      code: 'if not code.isalnum():\n    return False',
    },
    {
      name: 'Combine with isdigit for &quot;has at least one letter&quot;',
      desc: 'A common validation shape.',
      code: 'if token.isalnum() and not token.isdigit():\n    ...    # has letters, may have digits',
    },
  ],

  examples: [
    { title: 'Letters only',       code: '"hello".isalnum()',       returns: 'True' },
    { title: 'Digits only',        code: '"12345".isalnum()',       returns: 'True' },
    { title: 'Mixed',              code: '"hello123".isalnum()',    returns: 'True' },
    { title: 'Space breaks it',    code: '"hello world".isalnum()', returns: 'False' },
    { title: 'Unicode passes',     code: '"café1".isalnum()',       returns: 'True' },
    { title: 'Underscore fails',   code: '"user_name".isalnum()',   returns: 'False' },
    { title: 'Empty is False',     code: '"".isalnum()',            returns: 'False' },
    { title: 'Punctuation fails',  code: '"a.b".isalnum()',         returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Empty string returns False, not True',
      desc: 'Same rule as isalpha and isdigit — the empty case is False by convention. isalnum requires at least one character.',
      wrong: { label: 'Wrong expectation', code: '"".isalnum()', output: 'False' },
      fix:   { label: 'Read the contract', code: '"".isalnum()   # always False\n"".isdigit()   # always False\n"".isspace()   # always False', output: 'documented behaviour' },
    },
    {
      name: 'Underscores are NOT alphanumeric',
      desc: 'Underscore is punctuation, not a letter or digit. Passwords, IDs, and identifiers that contain underscores fail isalnum. For proper identifier checking, use str.isidentifier().',
      wrong: { label: 'Fails on _', code: '"user_id".isalnum()', output: 'False' },
      fix:   { label: 'Identifier check', code: '"user_id".isidentifier()', output: 'True' },
    },
    {
      name: 'Spaces are NOT alphanumeric',
      desc: 'A single space breaks isalnum. Split first if multi-token input is legitimate.',
      wrong: { label: 'Multi-token fails', code: '"hello world 123".isalnum()', output: 'False  # spaces' },
      fix:   { label: 'Per token', code: 'all(t.isalnum() for t in text.split())', output: 'True' },
    },
    {
      name: 'Unicode &quot;digits&quot; include surprising code points',
      desc: 'Roman numerals, superscripts, and fractions pass isnumeric AND isalnum — a quirk if you expected ASCII digits only. Combine with .isascii() when that matters.',
      wrong: { label: 'Too permissive', code: '"Ⅳ".isalnum()', output: 'True  # Roman numeral' },
      fix:   { label: 'ASCII only',      code: 'name.isascii() and name.isalnum()', output: 'True only for ASCII letters/digits' },
    },
  ],

  when: {
    use: [
      'Quick validation that a token has no punctuation or whitespace',
      'Loose &quot;letters or digits, that&apos;s it&quot; check on short codes',
      'Combined with .split() for word-by-word validation',
      'Composing with isalpha / isdigit / isspace for finer checks',
    ],
    avoid: [
      'Proper identifier check — use str.isidentifier() (allows underscores, forbids leading digits)',
      'ASCII-only validation → combine with .isascii()',
      'Rich validation (length, format) → use a regex or validator library',
      'Values that legitimately contain spaces → split first',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isalnum',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.isalpha', slug: 'str-isalpha', when: 'Letters only, no digits' },
    { name: 'isdigit',     slug: 'isdigit',     when: 'Digits only, no letters' },
    { name: 'startswith',  slug: 'startswith',  when: 'Prefix test rather than whole-string' },
    { name: 'strip',       slug: 'strip',       when: 'Trim whitespace before validation' },
  ],

  faq: [
    {
      q: 'Why does &quot;user_name&quot;.isalnum() return False?',
      a: 'Underscore is punctuation, not a letter or digit. For identifier-shaped strings (which include underscores), use str.isidentifier() instead.',
    },
    {
      q: 'What is the difference between isalnum, isalpha, and isdigit?',
      a: 'isalpha requires every character to be a letter. isdigit requires every character to be a digit. isalnum accepts letters OR digits (or combinations). All three reject spaces, punctuation, and the empty string.',
    },
    {
      q: 'Does isalnum recognize non-Latin digits?',
      a: 'Yes. Any character Unicode classifies as numeric passes — Arabic-Indic digits, Devanagari digits, Roman numerals, superscripts. If you meant ASCII digits only, combine with .isascii().',
    },
  ],

  history: [
    { version: '1.0', note: 'isalnum() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — accepts letters and digits from any script per Unicode categorization.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isalnum',
    meta:  'str.isalnum',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};