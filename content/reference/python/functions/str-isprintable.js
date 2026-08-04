// content/reference/python/functions/str-isprintable.js
//
// Slug is type-prefixed: `isprintable` is a str method.

export const meta = {
  slug:        'str-isprintable',
  name:        'str.isprintable',
  signature:   'str.isprintable()',
  blurb:       'True if every character is printable and the string has no control characters — empty is True.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'isprintable printable control character check tab newline empty repr display',
};

export const method = {
  slug:      'str-isprintable',
  name:      'str.isprintable',
  signature: 'str.isprintable()',
  returns:   { type: 'bool', desc: 'True if every character in the string is printable, i.e. not in Unicode category Cc (control). Space (U+0020) counts as printable. Tab, newline, carriage return, and other control characters return False. Empty string returns TRUE — joining isascii as the &quot;empty is True&quot; exception.' },

  category:    'String method',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Distinguish content that survives print() intact from content that would move the cursor or damage the display.',

  cheat: {
    commonCall: 'if s.isprintable():',
    returns:    'True or False',
    replaces:   'a manual `all(unicodedata.category(c) != "Cc" for c in s)` loop',
    watchOut:   'EMPTY RETURNS TRUE (like isascii, unlike everything else); SPACE is printable but TAB and NEWLINE are not',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'basic',      label: 'basic text',       values: { string: 'hello world' } },
    { id: 'digits',     label: 'digits',            values: { string: '12345' } },
    { id: 'punct',      label: 'punctuation',       values: { string: 'a-b_c.d!' } },
    { id: 'unicode',    label: 'unicode',           values: { string: 'café 🎉' } },
    { id: 'tab',        label: 'has tab',           values: { string: 'a\tb' } },
    { id: 'newline',    label: 'has newline',       values: { string: 'line1\nline2' } },
    { id: 'null',       label: 'has NUL',           values: { string: 'a\x00b' } },
    { id: 'space-only', label: 'just space',        values: { string: '   ' } },
    { id: 'empty',      label: 'empty (True!)',     values: { string: '' } },
  ],
  demoExplainer: 'isprintable() returns True when the string contains no control characters and the empty string. SPACE (U+0020) counts as printable — this surprises people who assumed &quot;printable&quot; meant &quot;visible.&quot; TAB (U+0009), NEWLINE (U+000A), CARRIAGE RETURN (U+000D), and NUL (U+0000) are all control characters and return False. Emojis and accented letters pass. Empty string returns True — joining isascii as the &quot;empty is True&quot; exception to the is* family.',

  patterns: [
    {
      name: 'Filter loggable content',
      desc: 'Guard against log-line-breaking control characters.',
      code: 'if not user_input.isprintable():\n    raise ValueError("input contains control characters")',
    },
    {
      name: 'Detect binary or damaged data',
      desc: 'Quick check that a string is plausibly display-safe.',
      code: 'if raw.isprintable():\n    display(raw)\nelse:\n    display(repr(raw))',
    },
    {
      name: 'Combine with isascii for &quot;safe simple string&quot;',
      desc: 'Only ASCII, only printable — no non-Latin, no control, no exotic.',
      code: 'if s.isascii() and s.isprintable():\n    ...   # display-safe simple string',
    },
  ],

  examples: [
    { title: 'Basic text',          code: '"hello world".isprintable()', returns: 'True' },
    { title: 'With emoji',          code: '"café 🎉".isprintable()',       returns: 'True' },
    { title: 'Tab',                 code: '"a\\tb".isprintable()',        returns: 'False' },
    { title: 'Newline',             code: '"line1\\nline2".isprintable()',returns: 'False' },
    { title: 'NUL byte',            code: '"a\\x00b".isprintable()',      returns: 'False' },
    { title: 'Just space',          code: '"   ".isprintable()',          returns: 'True  # space IS printable' },
    { title: 'Empty is TRUE',       code: '"".isprintable()',             returns: 'True  # like isascii' },
  ],

  pitfalls: [
    {
      name: 'Empty string returns TRUE',
      desc: 'Only isascii and isprintable in the is* family return True on empty. All others return False. Vacuous truth: no character can violate the &quot;every character is printable&quot; rule.',
      wrong: { label: 'Assumed False',   code: '"".isprintable()', output: 'True' },
      fix:   { label: 'Guard for non-empty', code: 's and s.isprintable()', output: 'True only for non-empty printable' },
    },
    {
      name: 'Space is PRINTABLE but TAB and NEWLINE are NOT',
      desc: 'Python distinguishes &quot;printable&quot; from &quot;visible&quot;. Space (U+0020) is a printable character — you can print it and something (a gap) appears. Tab, newline, and carriage return are CONTROL characters — they change the cursor position and return False.',
      wrong: { label: 'Assumed all whitespace fails', code: '" ".isprintable()', output: 'True  # space is printable' },
      fix:   { label: 'Tab and newline fail',         code: '"\\t".isprintable()\n"\\n".isprintable()', output: 'False\nFalse' },
    },
    {
      name: 'Zero-width characters are printable in the technical sense',
      desc: 'Zero-width joiner (U+200D), zero-width space (U+200B), and BOM (U+FEFF) are NOT control characters — they are formatting characters (category Cf). Python classifies them as printable even though they are invisible. This is a security surface for lookalike attacks.',
      wrong: { label: 'Invisible passes', code: '"a\\u200bb".isprintable()', output: 'True  # ZWSP is not a control char' },
      fix:   { label: 'Strict visible check', code: 'import unicodedata\nall(unicodedata.category(c)[0] not in ("C", "Z") or c == " " for c in s)', output: '' },
    },
    {
      name: 'Not the same as isascii',
      desc: 'A common conflation. isprintable rejects control chars but accepts anything Unicode (emoji, accents, non-Latin). isascii rejects anything above U+007F but accepts ASCII control characters. Different filters entirely.',
      wrong: { label: 'Very different', code: '"café".isascii()      # False\n"café".isprintable() # True', output: 'different results' },
      fix:   { label: 'Combine for both', code: 's.isascii() and s.isprintable()', output: 'True only for ASCII printable' },
    },
  ],

  when: {
    use: [
      'Safety check before writing to a log line or terminal',
      'Detecting damaged binary data mixed into text',
      'Combining with isascii for &quot;simple safe display&quot; validation',
      'Filtering strings that would move the cursor or corrupt output',
    ],
    avoid: [
      'You need to REJECT space too → check explicitly',
      'You need to reject zero-width chars → use unicodedata',
      'You want ASCII-only → combine with str.isascii',
      'Testing whether the string LOOKS printable — display quality is beyond this method',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False (True on empty)',
    cpython:    'Objects/unicodeobject.c :: unicode_isprintable',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.isascii',    slug: 'str-isascii',    when: 'The other &quot;empty is True&quot; exception; different rule (ASCII range)' },
    { name: 'str.isspace',    slug: 'str-isspace',    when: 'All whitespace — includes control chars like TAB and NEWLINE' },
    { name: 'repr',           slug: 'repr',           when: 'Get a display-safe representation of arbitrary content' },
  ],

  faq: [
    {
      q: 'Why is space printable but tab is not?',
      a: 'Because Python follows the Unicode categorization: space (U+0020) is in category Zs (space separator), while tab (U+0009) is in category Cc (control). Space is a character that prints as a visible gap; tab moves the cursor. The distinction matters more than it looks.',
    },
    {
      q: 'Why does &quot;&quot;.isprintable() return True but &quot;&quot;.isalpha() returns False?',
      a: 'Two rules of thumb in the is* family. Most methods require &quot;at least one character&quot; on top of the per-character check. isascii and isprintable are the two exceptions — the per-character rule vacuously holds for the empty string.',
    },
    {
      q: 'Is repr() safe when isprintable() is False?',
      a: 'Yes — repr escapes control characters into visible form: &quot;\\t&quot;, &quot;\\n&quot;, &quot;\\x00&quot;. That is why repr is the go-to for showing arbitrary strings in logs and diagnostics.',
    },
  ],

  history: [
    { version: '3.0', note: 'isprintable() introduced along with the Unicode-first str type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isprintable',
    meta:  'str.isprintable',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};