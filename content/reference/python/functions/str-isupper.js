// content/reference/python/functions/str-isupper.js
//
// Slug is type-prefixed: `isupper` is a str method (also on bytes).

export const meta = {
  slug:        'str-isupper',
  name:        'str.isupper',
  signature:   'str.isupper()',
  blurb:       'True if every cased character is uppercase and the string has at least one cased character.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isupper uppercase all caps check case letters test cased character',
};

export const method = {
  slug:      'str-isupper',
  name:      'str.isupper',
  signature: 'str.isupper()',
  returns:   { type: 'bool', desc: 'True if every cased character in the string is uppercase AND the string contains at least one cased character. Non-cased characters (digits, spaces, punctuation, symbols) are ignored — only cased characters need to be uppercase.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Check that a string is entirely uppercase — but only among characters that have a case.',

  cheat: {
    commonCall: 'if code.isupper():',
    returns:    'True or False',
    replaces:   '`s == s.upper()` — but isupper needs at least ONE cased character',
    watchOut:   'not isupper() != islower(); digits-only string returns False',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'upper',      label: 'all upper',      values: { string: 'HELLO' } },
    { id: 'mixed',      label: 'mixed case',     values: { string: 'Hello' } },
    { id: 'lower',      label: 'all lower',      values: { string: 'hello' } },
    { id: 'with-digits',label: 'upper + digits', values: { string: 'HELLO123' } },
    { id: 'digits-only',label: 'digits only',    values: { string: '12345' } },
    { id: 'with-space', label: 'upper + space',  values: { string: 'HELLO WORLD' } },
    { id: 'unicode',    label: 'unicode',        values: { string: 'CAFÉ' } },
    { id: 'empty',      label: 'empty',          values: { string: '' } },
  ],
  demoExplainer: 'isupper() returns True only when the string contains at least one CASED character AND every cased character is uppercase. Non-cased characters (digits, spaces, punctuation, non-cased scripts) are IGNORED — they neither pass nor fail the check. A string with ONLY digits or ONLY punctuation returns False because there is no cased character to check.',

  patterns: [
    {
      name: 'Validate an all-caps code',
      desc: 'Quick check that user input matches an all-caps convention.',
      code: 'if not code.isupper():\n    raise ValueError("code must be uppercase")',
    },
    {
      name: 'Not the same as `s == s.upper()`',
      desc: 'The upper() equality includes digits and symbols; isupper() requires a cased character.',
      code: 'has_upper_intent = s.isupper()          # False for "123"\nreads_as_upper   = s == s.upper()        # True  for "123"',
    },
    {
      name: 'Skip already-uppercase strings',
      desc: 'Avoid redundant work in transformation pipelines.',
      code: 'if not text.isupper():\n    text = text.upper()',
    },
  ],

  examples: [
    { title: 'All upper',           code: '"HELLO".isupper()',       returns: 'True' },
    { title: 'Mixed case',          code: '"Hello".isupper()',        returns: 'False' },
    { title: 'All lower',           code: '"hello".isupper()',        returns: 'False' },
    { title: 'Upper + digits',      code: '"HELLO123".isupper()',     returns: 'True  # digits are non-cased' },
    { title: 'Upper + spaces',      code: '"HELLO WORLD".isupper()',  returns: 'True' },
    { title: 'Digits only',         code: '"12345".isupper()',        returns: 'False  # no cased char' },
    { title: 'Unicode',             code: '"CAFÉ".isupper()',         returns: 'True' },
    { title: 'Empty is False',      code: '"".isupper()',             returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Requires at least one cased character',
      desc: 'A string with only digits or only punctuation returns False — there is no cased character to verify. Same rule as islower(); different rule than the is* family that just checks emptiness.',
      wrong: { label: 'Digits-only False', code: '"12345".isupper()', output: 'False' },
      fix:   { label: 'Combined test',      code: 's == s.upper() and any(c.isalpha() for c in s)', output: 'True on "12345"?  Depends on intent' },
    },
    {
      name: 'not isupper() is NOT islower()',
      desc: 'Because isupper() and islower() both require at least one cased character AND checking their case. A mixed-case string returns False from both. Do not treat them as complements.',
      wrong: { label: 'Assumed complement', code: '"Hello".isupper() or "Hello".islower()', output: 'False  # neither, not both' },
      fix:   { label: 'Explicit',           code: 'not any(c.islower() for c in s) # a subtly different check', output: '' },
    },
    {
      name: 'Empty string returns False, not True',
      desc: 'Same rule across the is* family — empty is always False. Ignoring the &quot;at least one&quot; requirement gives you a bug that manifests only on edge cases.',
      wrong: { label: 'Wrong expectation', code: '"".isupper()', output: 'False' },
      fix:   { label: 'Guard first',        code: 's and s.isupper()', output: 'covers the empty case' },
    },
    {
      name: 'Non-cased scripts confuse the intent',
      desc: 'CJK ideographs, digits, punctuation — none are cased. A string of only Chinese characters returns False from isupper(), which is often surprising.',
      wrong: { label: 'CJK is False', code: '"漢字".isupper()', output: 'False  # not cased' },
      fix:   { label: 'Check for cased first', code: 'any(c.isalpha() for c in s)', output: 'guards against non-cased scripts' },
    },
  ],

  when: {
    use: [
      'Validating an all-caps code, ID, or convention',
      'Skipping redundant .upper() calls in transformation pipelines',
      'Composing with islower / isalpha / isdigit for finer case checks',
      'Testing an environment variable or acronym for proper form',
    ],
    avoid: [
      '`s == s.upper()` is subtly different — chooses when digits should pass',
      'Case-insensitive comparison → str.casefold',
      'Titlecase check → str.istitle',
      'Value has non-Latin scripts and case matters → normalize first',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isupper',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'lower',       slug: 'lower',       when: 'Convert to lowercase' },
    { name: 'upper',       slug: 'upper',       when: 'Convert to uppercase (a natural complement)' },
    { name: 'str.casefold',slug: 'str-casefold',when: 'Case-insensitive comparison rather than case checking' },
    { name: 'str.isalpha', slug: 'str-isalpha', when: 'Letter check (any case)' },
  ],

  faq: [
    {
      q: 'Why does &quot;12345&quot;.isupper() return False?',
      a: 'Because digits are not cased characters. isupper() requires at least one cased character AND every cased character to be uppercase. With no cased characters, the &quot;at least one&quot; condition fails.',
    },
    {
      q: 'Is `s.isupper()` the same as `s == s.upper()`?',
      a: 'Almost — but `s == s.upper()` returns True for &quot;12345&quot; (no letters to change), while `s.isupper()` returns False. Pick based on whether digits-only should count.',
    },
    {
      q: 'What is the difference between isupper and istitle?',
      a: 'isupper: every cased character is uppercase. istitle: the string is in title case — first character of each &quot;word&quot; uppercase, rest lowercase. Very different intents.',
    },
  ],

  history: [
    { version: '1.0', note: 'isupper() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — checks per Unicode general category and case mapping.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isupper',
    meta:  'str.isupper',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};