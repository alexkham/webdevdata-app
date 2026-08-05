// content/reference/python/functions/str-lstrip.js
//
// Slug is type-prefixed: `lstrip` is a str method (also on bytes).

export const meta = {
  slug:        'str-lstrip',
  name:        'str.lstrip',
  signature:   'str.lstrip(chars=None)',
  blurb:       'Strip leading whitespace — or leading characters from a given set.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'lstrip left strip trim leading whitespace remove chars set start front',
};

export const method = {
  slug:      'str-lstrip',
  name:      'str.lstrip',
  signature: 'str.lstrip(chars=None)',
  returns:   { type: 'str', desc: 'A copy of the string with LEADING characters removed. Default strips whitespace; with an argument, strips any characters in the given SET (not a substring).' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Trim from the LEFT — whitespace by default, or any character in the given set. Not a prefix stripper.',

  cheat: {
    commonCall: 'line.lstrip()',
    returns:    'new str — the original is unchanged',
    replaces:   'a manual `while s and s[0] in chars: s = s[1:]` loop',
    watchOut:   'chars is a SET of characters, not a substring — see pitfalls',
  },

  parameters: [
    { name: 'chars', type: 'str | None', required: false, default: 'None', desc: 'A string of characters to strip. Every character in this string is treated as an individual character to remove, in any order. None (default) strips Unicode whitespace.' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',            input: 'text' },
    { name: 'chars',  type: 'str', hint: 'empty = whitespace',    input: 'text-or-none' },
  ],
  cases: [
    { id: 'whitespace', label: 'whitespace',       values: { string: '   hello world', chars: '' } },
    { id: 'tabs',       label: 'tabs + newlines',  values: { string: '\t\n hello',      chars: '' } },
    { id: 'zeros',      label: 'leading zeros',    values: { string: '00042',           chars: '0' } },
    { id: 'char-set',   label: 'char set',         values: { string: 'xxyyaabc',        chars: 'xy' } },
    { id: 'char-order', label: 'order irrelevant', values: { string: 'xxyyaabc',        chars: 'yx' } },
    { id: 'no-match',   label: 'nothing to strip', values: { string: 'hello',           chars: 'xy' } },
    { id: 'all-strip',  label: 'all matches',      values: { string: 'aaaa',            chars: 'a' } },
    { id: 'no-effect',  label: 'right side kept',  values: { string: '   x   ',         chars: '' } },
  ],
  demoExplainer: 'lstrip removes leading characters. With no argument, it strips Unicode whitespace. With a string argument, it strips ANY character in that set — order does not matter, "xy" and "yx" behave identically. The right side is left alone. If the first character does not match, nothing is stripped and the original is returned unchanged.',

  patterns: [
    {
      name: 'Strip leading whitespace',
      desc: 'The default no-arg form — matches every Unicode whitespace character.',
      code: 'text = raw_line.lstrip()',
    },
    {
      name: 'Strip leading zeros',
      desc: 'A common numeric-normalization step.',
      code: 'digits = "00042".lstrip("0")     # "42"',
    },
    {
      name: 'Chain both sides',
      desc: 'When you want left trimming only sometimes.',
      code: 'if line.startswith("#"):\n    line = line.lstrip("#").rstrip()',
    },
  ],

  examples: [
    { title: 'Whitespace default',     code: '"   hello".lstrip()',      returns: '"hello"' },
    { title: 'Tabs and newlines',      code: '"\\t\\n hi".lstrip()',     returns: '"hi"' },
    { title: 'Leading zeros',          code: '"00042".lstrip("0")',      returns: '"42"' },
    { title: 'Char set (order agnostic)', code: '"xxyyaabc".lstrip("xy")', returns: '"aabc"' },
    { title: 'Nothing to strip',       code: '"hello".lstrip("xy")',     returns: '"hello"' },
    { title: 'Right side untouched',   code: '"   x   ".lstrip()',       returns: '"x   "' },
  ],

  pitfalls: [
    {
      name: 'chars is a SET of characters, NOT a prefix',
      desc: 'The single most common lstrip bug. Passing "https://" strips any leading &quot;h&quot;, &quot;t&quot;, &quot;p&quot;, &quot;s&quot;, &quot;:&quot;, or &quot;/&quot; — in any order and any quantity — until it hits something else. It does NOT strip the string &quot;https://&quot; specifically.',
      wrong: { label: 'Ate too much', code: '"https://python.org".lstrip("https://")', output: '"python.org"  # or worse — chars matched greedily' },
      fix:   { label: 'Use removeprefix', code: '"https://python.org".removeprefix("https://")', output: '"python.org"  # exact prefix, no character-set surprise' },
    },
    {
      name: 'chars order does not matter',
      desc: 'The argument is treated as a set. "abc", "cba", and "aabbc" all behave identically. Trying to encode a specific sequence via order fails.',
      wrong: { label: 'Order-sensitive attempt', code: '"aabbccxx".lstrip("cba")', output: '"xx"  # same as .lstrip("abc")' },
      fix:   { label: 'Do not encode order in chars', code: '# to strip a specific sequence, use removeprefix or slicing', output: '' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, lstrip returns a new string. Assigning it back is required for the stripped value to persist.',
      wrong: { label: 'Lost result', code: 's = "  hi"\ns.lstrip()\nprint(s)', output: '"  hi"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.lstrip()\nprint(s)', output: '"hi"' },
    },
  ],

  when: {
    use: [
      'Trimming leading whitespace (the default no-arg form)',
      'Stripping leading zeros, hashes, dashes, or any character SET',
      'Cleaning up left-side padding characters',
      'When both left- and right-side stripping would be too much',
    ],
    avoid: [
      'Removing a SPECIFIC prefix string → str.removeprefix (3.9+)',
      'Both sides → str.strip',
      'Right side only → str.rstrip',
      'Regex-based cleanup → re.sub',
    ],
  },

  notes: {
    complexity: 'O(n) worst case — scans until the first non-matching character',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_lstrip',
    memory:     'Allocates one new string (the trimmed portion)',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'strip',            slug: 'strip',            when: 'Both sides at once' },
    { name: 'rstrip',           slug: 'rstrip',           when: 'Right side only' },
    { name: 'startswith',       slug: 'startswith',       when: 'Just checking a prefix, not removing' },
  ],

  faq: [
    {
      q: 'Why does lstrip("https://") not just strip that prefix?',
      a: 'Because the argument is a character SET, not a substring. Every character in "https://" — h, t, p, s, colon, slash — is treated as a candidate to strip. It removes any leading occurrence of any of those characters. Since Python 3.9, use str.removeprefix() when you want exact-prefix removal.',
    },
    {
      q: 'What is the difference between lstrip() and removeprefix()?',
      a: 'lstrip strips a character SET from the left. removeprefix strips a specific SUBSTRING once (if present) from the left. Two very different operations that look similar in code.',
    },
    {
      q: 'What counts as whitespace when I call lstrip() with no argument?',
      a: 'Any character Unicode classifies with the White_Space property — spaces, tabs, newlines, non-breaking space, and various exotic Unicode whitespace. Same set as str.isspace() recognizes.',
    },
  ],

  history: [
    { version: '1.0', note: 'lstrip() has been part of str since Python 1.0.' },
    { version: '2.2.1', note: 'chars parameter added.' },
    { version: '3.9', note: 'removeprefix() introduced as the intent-preserving alternative for exact-prefix removal.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.lstrip',
    meta:  'str.lstrip',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};