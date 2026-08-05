// content/reference/python/functions/str-islower.js
//
// Slug is type-prefixed: `islower` is a str method (also on bytes).

export const meta = {
  slug:        'str-islower',
  name:        'str.islower',
  signature:   'str.islower()',
  blurb:       'True if every cased character is lowercase and the string has at least one cased character.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'islower lowercase all lower check case letters test cased character',
};

export const method = {
  slug:      'str-islower',
  name:      'str.islower',
  signature: 'str.islower()',
  returns:   { type: 'bool', desc: 'True if every cased character in the string is lowercase AND the string contains at least one cased character. Non-cased characters (digits, spaces, punctuation, symbols) are ignored — only cased characters need to be lowercase.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Check that a string is entirely lowercase — but only among characters that have a case.',

  cheat: {
    commonCall: 'if name.islower():',
    returns:    'True or False',
    replaces:   '`s == s.lower()` — but islower needs at least ONE cased character',
    watchOut:   'not islower() != isupper(); digits-only string returns False',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'lower',      label: 'all lower',      values: { string: 'hello' } },
    { id: 'mixed',      label: 'mixed case',     values: { string: 'Hello' } },
    { id: 'upper',      label: 'all upper',      values: { string: 'HELLO' } },
    { id: 'with-digits',label: 'lower + digits', values: { string: 'hello123' } },
    { id: 'digits-only',label: 'digits only',    values: { string: '12345' } },
    { id: 'with-space', label: 'lower + space',  values: { string: 'hello world' } },
    { id: 'unicode',    label: 'unicode',        values: { string: 'café' } },
    { id: 'empty',      label: 'empty',          values: { string: '' } },
  ],
  demoExplainer: 'islower() returns True only when the string contains at least one CASED character AND every cased character is lowercase. Non-cased characters (digits, spaces, punctuation, non-cased scripts) are IGNORED — they neither pass nor fail the check. A string with ONLY digits or ONLY punctuation returns False because there is no cased character to check.',

  patterns: [
    {
      name: 'Validate an all-lowercase input',
      desc: 'Quick check that user input matches an all-lowercase convention.',
      code: 'if not username.islower():\n    raise ValueError("username must be lowercase")',
    },
    {
      name: 'Not the same as `s == s.lower()`',
      desc: 'The lower() equality includes digits and symbols; islower() requires a cased character.',
      code: 'has_lower_intent = s.islower()          # False for "123"\nreads_as_lower   = s == s.lower()        # True  for "123"',
    },
    {
      name: 'Skip already-lowercase strings',
      desc: 'Avoid redundant work in transformation pipelines.',
      code: 'if not text.islower():\n    text = text.lower()',
    },
  ],

  examples: [
    { title: 'All lower',           code: '"hello".islower()',       returns: 'True' },
    { title: 'Mixed case',          code: '"Hello".islower()',        returns: 'False' },
    { title: 'All upper',           code: '"HELLO".islower()',        returns: 'False' },
    { title: 'Lower + digits',      code: '"hello123".islower()',     returns: 'True  # digits are non-cased' },
    { title: 'Lower + spaces',      code: '"hello world".islower()',  returns: 'True' },
    { title: 'Digits only',         code: '"12345".islower()',        returns: 'False  # no cased char' },
    { title: 'Unicode',             code: '"café".islower()',         returns: 'True' },
    { title: 'Empty is False',      code: '"".islower()',             returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Requires at least one cased character',
      desc: 'A string with only digits or only punctuation returns False — there is no cased character to verify. Same rule as isupper(); different rule than isspace or isdigit that just checks emptiness.',
      wrong: { label: 'Digits-only False', code: '"12345".islower()', output: 'False' },
      fix:   { label: 'Combined test',      code: 's == s.lower() and any(c.isalpha() for c in s)', output: 'True on lowercase text' },
    },
    {
      name: 'not islower() is NOT isupper()',
      desc: 'Both islower() and isupper() require at least one cased character AND checking their case. A mixed-case string returns False from both. A digits-only string also returns False from both. Do not treat them as complements.',
      wrong: { label: 'Assumed complement', code: '"Hello".islower() or "Hello".isupper()', output: 'False  # neither, not both' },
      fix:   { label: 'Explicit check',     code: 'all(c.islower() or not c.isalpha() for c in s)', output: 'stricter intent' },
    },
    {
      name: 'Empty string returns False, not True',
      desc: 'Same rule across the is* family — empty is always False. Ignoring the &quot;at least one&quot; requirement gives you a bug that manifests only on edge cases.',
      wrong: { label: 'Wrong expectation', code: '"".islower()', output: 'False' },
      fix:   { label: 'Guard first',        code: 's and s.islower()', output: 'covers the empty case' },
    },
    {
      name: 'Non-cased scripts confuse the intent',
      desc: 'CJK ideographs, digits, punctuation — none are cased. A string of only Chinese characters returns False from islower(), which is often surprising.',
      wrong: { label: 'CJK is False', code: '"漢字".islower()', output: 'False  # not cased' },
      fix:   { label: 'Check for cased first', code: 'any(c.isalpha() for c in s)', output: 'guards against non-cased scripts' },
    },
  ],

  when: {
    use: [
      'Validating an all-lowercase username, ID, or convention',
      'Skipping redundant .lower() calls in transformation pipelines',
      'Composing with isupper / isalpha / isdigit for finer case checks',
      'Testing that a normalized value is in its canonical form',
    ],
    avoid: [
      '`s == s.lower()` is subtly different — chooses when digits should pass',
      'Case-insensitive comparison → str.casefold',
      'Titlecase check → str.istitle',
      'Value has non-Latin scripts and case matters → normalize first',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_islower',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.isupper', slug: 'str-isupper', when: 'The mirror check for uppercase' },
    { name: 'lower',       slug: 'lower',       when: 'Convert to lowercase' },
    { name: 'upper',       slug: 'upper',       when: 'Convert to uppercase' },
    { name: 'str.casefold',slug: 'str-casefold',when: 'Case-insensitive comparison rather than case checking' },
  ],

  faq: [
    {
      q: 'Why does &quot;12345&quot;.islower() return False?',
      a: 'Because digits are not cased characters. islower() requires at least one cased character AND every cased character to be lowercase. With no cased characters, the &quot;at least one&quot; condition fails.',
    },
    {
      q: 'Is `s.islower()` the same as `s == s.lower()`?',
      a: 'Almost — but `s == s.lower()` returns True for &quot;12345&quot; (no letters to change), while `s.islower()` returns False. Pick based on whether digits-only should count.',
    },
    {
      q: 'What is the difference between islower and isupper?',
      a: 'Direction. islower: every cased character is lowercase. isupper: every cased character is uppercase. Both require at least one cased character; both return False for empty, digits-only, or mixed strings.',
    },
  ],

  history: [
    { version: '1.0', note: 'islower() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — checks per Unicode general category and case mapping.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.islower',
    meta:  'str.islower',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};