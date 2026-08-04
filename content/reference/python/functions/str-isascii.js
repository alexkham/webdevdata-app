// content/reference/python/functions/str-isascii.js
//
// Slug is type-prefixed: `isascii` is a str method (also on bytes).

export const meta = {
  slug:        'str-isascii',
  name:        'str.isascii',
  signature:   'str.isascii()',
  blurb:       'True if every character is in the ASCII range (0..127) — empty string also True.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'isascii ascii check unicode empty range codepoint 128 validate range',
};

export const method = {
  slug:      'str-isascii',
  name:      'str.isascii',
  signature: 'str.isascii()',
  returns:   { type: 'bool', desc: 'True if every character has a Unicode codepoint less than 128 (i.e. lies in the ASCII range). Empty string also returns True — the ONLY member of the is* family that does not treat empty as False.' },

  category:    'String method',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: 'Check that a string contains only ASCII characters — the odd one out of the is* family, since it returns True on empty.',

  cheat: {
    commonCall: 'if user_input.isascii():',
    returns:    'True or False',
    replaces:   'a manual `all(ord(c) < 128 for c in s)` loop',
    watchOut:   'EMPTY STRING RETURNS TRUE — the entire is* family says False on empty EXCEPT this one',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'basic-ascii',label: 'plain ASCII',    values: { string: 'hello world' } },
    { id: 'digits',     label: 'digits',          values: { string: '12345' } },
    { id: 'punct',      label: 'punctuation',     values: { string: 'a-b_c.d' } },
    { id: 'accented',   label: 'accented letter', values: { string: 'café' } },
    { id: 'emoji',      label: 'emoji',           values: { string: 'hi 😀' } },
    { id: 'cyrillic',   label: 'cyrillic',        values: { string: 'Привет' } },
    { id: 'empty',      label: 'empty (True!)',    values: { string: '' } },
  ],
  demoExplainer: 'isascii() returns True only when every character has a Unicode codepoint below 128 — the ASCII range (0..127). Digits, letters A-Z / a-z, and standard punctuation all pass. Accented letters (é, ñ), Cyrillic (П), CJK (漢), and emoji all fail. THE EXCEPTION worth remembering: empty string returns True. Every other is* method returns False on empty.',

  patterns: [
    {
      name: 'Validate ASCII-only input',
      desc: 'Use before writing to an ASCII-only field (some legacy databases, some protocols).',
      code: 'if not username.isascii():\n    raise ValueError("username must be ASCII")',
    },
    {
      name: 'Combine with isalnum for &quot;ASCII alphanumeric&quot;',
      desc: 'A stricter version of isalnum that excludes non-Latin letters and digits.',
      code: 'if s.isascii() and s.isalnum():\n    ...   # ASCII letters and digits only',
    },
    {
      name: 'Detect non-ASCII content for encoding decisions',
      desc: 'Fast path: skip charset detection or encoding conversion if the whole string is ASCII.',
      code: 'if payload.isascii():\n    write_plain(payload)\nelse:\n    write_utf8(payload)',
    },
  ],

  examples: [
    { title: 'Plain ASCII',        code: '"hello".isascii()',       returns: 'True' },
    { title: 'Digits and punct',   code: '"a-b_c.d".isascii()',      returns: 'True' },
    { title: 'Accented letter',    code: '"café".isascii()',         returns: 'False' },
    { title: 'Emoji',              code: '"hi 😀".isascii()',         returns: 'False' },
    { title: 'Cyrillic',           code: '"Привет".isascii()',       returns: 'False' },
    { title: 'Empty is TRUE',      code: '"".isascii()',             returns: 'True  # the odd one out' },
  ],

  pitfalls: [
    {
      name: 'Empty string returns TRUE — the exception to the family',
      desc: 'Every other is* method (isalpha, isdigit, isalnum, isspace, isupper, islower, ...) returns False on empty. isascii is the exception: it returns True. The reason is that all zero characters trivially satisfy &quot;every character is ASCII&quot;.',
      wrong: { label: 'Assumed False',   code: '"".isascii()', output: 'True  # UNLIKE the rest of is*' },
      fix:   { label: 'Guard if you need non-empty', code: 's and s.isascii()', output: 'True only for non-empty ASCII' },
    },
    {
      name: 'ASCII includes control characters',
      desc: 'Codepoints 0..31 (control chars like NUL, TAB, LF, ESC) and 127 (DEL) are all ASCII. isascii returns True on strings that contain these — legitimate but unlikely to be what a validator wants.',
      wrong: { label: 'Contains control char', code: '"hello\\x00world".isascii()', output: 'True  # NUL is ASCII' },
      fix:   { label: 'Combine with isprintable', code: 's.isascii() and s.isprintable()', output: 'False on NUL' },
    },
    {
      name: 'NOT the same as &quot;in the Latin alphabet&quot;',
      desc: 'isascii tests the CODEPOINT range, not whether characters are Latin letters. Punctuation, digits, spaces, and control characters all pass; anything above U+007F fails.',
      wrong: { label: 'Assumed alphabet', code: '"12345".isascii()', output: 'True  # digits are ASCII' },
      fix:   { label: 'Combine with isalpha', code: 's.isascii() and s.isalpha()', output: 'True only for ASCII letters' },
    },
    {
      name: 'Some visually similar characters are NOT ASCII',
      desc: 'The look-alike attack surface: fancy quotes (&ldquo;&rdquo;), en/em dashes (– —), non-breaking space (U+00A0), fullwidth digits (１２３). None are ASCII. Input that looks ASCII may not be.',
      wrong: { label: 'Fancy quote fails', code: '"hello &ldquo;world&rdquo;".isascii()', output: 'False  # curly quotes are not ASCII' },
      fix:   { label: 'Normalize first', code: 's = s.replace("\\u201c", chr(0x22)).replace("\\u201d", chr(0x22))\ns.isascii()', output: 'True after normalization' },
    },
  ],

  when: {
    use: [
      'Fast pre-check before ASCII-only encoding or storage',
      'Detecting non-ASCII content to trigger UTF-8 handling',
      'Validating usernames or IDs in ASCII-only contexts',
      'Combining with isprintable / isalnum for stricter checks',
    ],
    avoid: [
      'Case where empty must NOT count → guard with `s and`',
      'Excluding control characters → combine with isprintable',
      'ASCII letters only → combine with isalpha',
      'Rich internationalization support — ASCII-only is usually the wrong call in 2024+',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False (True on empty)',
    cpython:    'Objects/unicodeobject.c :: unicode_isascii',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.isalpha',  slug: 'str-isalpha',  when: 'Letters only (any script)' },
    { name: 'str.isalnum',  slug: 'str-isalnum',  when: 'Letters or digits (any script)' },
    { name: 'chr',          slug: 'chr',          when: 'Convert codepoint to character' },
    { name: 'ord',          slug: 'ord',          when: 'Check codepoint value directly' },
  ],

  faq: [
    {
      q: 'Why does &quot;&quot;.isascii() return True but &quot;&quot;.isalpha() returns False?',
      a: 'isascii tests &quot;every character has codepoint &lt; 128&quot;. For the empty string, this is vacuously true — no character can violate the rule. The rest of the is* family also requires &quot;at least one character&quot;, but isascii does not.',
    },
    {
      q: 'Is isascii available in Python 3.6?',
      a: 'No — it was added in 3.7. On 3.6 use `s == s.encode("ascii", "ignore").decode()` or `all(ord(c) &lt; 128 for c in s)`.',
    },
    {
      q: 'Does isascii cover ALL of the ASCII range including control chars?',
      a: 'Yes. Codepoints 0..127 all pass — including NUL (0), TAB (9), LF (10), and DEL (127). Combine with isprintable to exclude control characters.',
    },
  ],

  history: [
    { version: '3.7', note: 'isascii() introduced — added to str, bytes, and bytearray at the same time.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isascii',
    meta:  'str.isascii',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};