// content/reference/python/functions/str-swapcase.js
//
// Slug is type-prefixed: `swapcase` is a str method (also on bytes).

export const meta = {
  slug:        'str-swapcase',
  name:        'str.swapcase',
  signature:   'str.swapcase()',
  blurb:       'Flip case per character — uppercase becomes lowercase and vice versa.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'swapcase invert flip case toggle uppercase lowercase reverse letter',
};

export const method = {
  slug:      'str-swapcase',
  name:      'str.swapcase',
  signature: 'str.swapcase()',
  returns:   { type: 'str', desc: 'A copy of the string with every uppercase character converted to lowercase and every lowercase character converted to uppercase. Non-letter characters are left unchanged. Not guaranteed to round-trip — s.swapcase().swapcase() may differ from s for some Unicode characters.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Toggle case per character — a display gimmick more than a comparison tool. Uses Unicode case mappings.',

  cheat: {
    commonCall: 'text.swapcase()',
    returns:    'new str — the original is unchanged',
    replaces:   'a manual `"".join(c.lower() if c.isupper() else c.upper() for c in s)`',
    watchOut:   'NOT round-trippable for some Unicode characters; use for display, not for parity checks',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'mixed',      label: 'mixed case',     values: { string: 'Hello World' } },
    { id: 'upper',      label: 'all upper',      values: { string: 'HELLO' } },
    { id: 'lower',      label: 'all lower',      values: { string: 'hello' } },
    { id: 'with-digits',label: 'letters+digits', values: { string: 'Hello123' } },
    { id: 'punct',      label: 'punctuation',    values: { string: "Don&apos;t Stop!" } },
    { id: 'unicode',    label: 'unicode',        values: { string: 'Café' } },
    { id: 'empty',      label: 'empty',          values: { string: '' } },
  ],
  demoExplainer: 'swapcase toggles the case of every letter — uppercase becomes lowercase, lowercase becomes uppercase. Non-letters (digits, punctuation, whitespace) pass through unchanged. It uses Unicode case mappings, so accented characters swap too. It is not guaranteed that s.swapcase().swapcase() equals s — some Unicode characters do not round-trip. Use swapcase for display effects, not for parity checks.',

  patterns: [
    {
      name: 'Fix typed-with-Caps-Lock text',
      desc: 'The classic use case — someone typed with Caps Lock on and Shift for capitals.',
      code: 'fixed = accidentally_capsed.swapcase()',
    },
    {
      name: 'Alternating-case demo effect',
      desc: 'Swap case per position in a loop — a stylistic touch.',
      code: 'stylized = "".join(c.swapcase() if i % 2 else c\n                    for i, c in enumerate(text))',
    },
    {
      name: 'Diagnostic reversal for tests',
      desc: 'Quick way to see whether a case-insensitive comparator is really case-insensitive.',
      code: 'assert compare_case_insensitive(s, s.swapcase())',
    },
  ],

  examples: [
    { title: 'Mixed case',          code: '"Hello World".swapcase()',    returns: '"hELLO wORLD"' },
    { title: 'All upper',           code: '"HELLO".swapcase()',           returns: '"hello"' },
    { title: 'All lower',           code: '"hello".swapcase()',           returns: '"HELLO"' },
    { title: 'Digits unchanged',    code: '"Abc123".swapcase()',          returns: '"aBC123"' },
    { title: 'Punctuation unchanged', code: '"Don\\&apos;t Stop!".swapcase()', returns: '"dON\\&apos;T sTOP!"' },
    { title: 'Unicode accents',     code: '"Café".swapcase()',            returns: '"cAFÉ"' },
    { title: 'Empty is empty',      code: '"".swapcase()',                returns: '""' },
  ],

  pitfalls: [
    {
      name: 'NOT round-trippable for some Unicode characters',
      desc: 'The Python docs say &quot;It is not necessarily true that s.swapcase().swapcase() == s&quot;. Special-case characters like German ß (lowercase) map to SS (uppercase), and SS swapcased maps to ss — you lost the ß.',
      wrong: { label: 'ß round-trip fails', code: '"Straße".swapcase().swapcase()', output: '"strasse"  # not "Straße"' },
      fix:   { label: 'Do not rely on parity', code: '# swapcase is for display effects — do NOT use it for identity round-trips', output: '' },
    },
    {
      name: 'Not the same as .lower() then .upper()',
      desc: 'swapcase flips per character. Chaining lower and upper collapses everything to one case. Different intent, different result.',
      wrong: { label: 'Chain destroys mix', code: '"Hello".lower().upper()', output: '"HELLO"' },
      fix:   { label: 'swapcase preserves mix', code: '"Hello".swapcase()', output: '"hELLO"' },
    },
    {
      name: 'Not case-insensitive comparison',
      desc: 'swapcase produces a different string, not a normalized one. Two strings that mean the same thing case-insensitively can swap to different results. Use casefold for comparison.',
      wrong: { label: 'Wrong tool', code: '"Hi".swapcase() == "hi".swapcase()', output: 'False  # "hI" != "HI"' },
      fix:   { label: 'Use casefold', code: '"Hi".casefold() == "hi".casefold()', output: 'True' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, swapcase returns a new string. Assigning it back is required for the swapped value to persist.',
      wrong: { label: 'Lost result', code: 's = "Hello"\ns.swapcase()\nprint(s)', output: '"Hello"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.swapcase()\nprint(s)', output: '"hELLO"' },
    },
  ],

  when: {
    use: [
      'Fixing text typed with Caps Lock stuck on',
      'Stylistic case flips for display or logging',
      'Demo / educational output showing case behavior',
      'Diagnostic reversals in tests of case-insensitive comparators',
    ],
    avoid: [
      'Case-insensitive equality comparison → str.casefold',
      'Normalizing to a specific case → str.lower or str.upper',
      'Round-tripping through swapcase — not guaranteed to be identity-safe',
      'Display formatting — usually lower / upper / title read more clearly',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_swapcase',
    memory:     'Allocates one new string',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'lower',        slug: 'lower',        when: 'Collapse all letters to lowercase' },
    { name: 'upper',        slug: 'upper',        when: 'Collapse all letters to uppercase' },
    { name: 'str.casefold', slug: 'str-casefold', when: 'Aggressive fold for case-insensitive comparison' },
    { name: 'title',        slug: 'title',        when: 'Title-case each word' },
  ],

  faq: [
    {
      q: 'Does swapcase always round-trip?',
      a: 'No. For most ASCII text it does, but some Unicode characters — like German ß — map to a multi-character uppercase (SS), so the reverse loses the original character. The docs explicitly say `s.swapcase().swapcase()` is not guaranteed to equal `s`.',
    },
    {
      q: 'What is the difference between swapcase and casefold?',
      a: 'swapcase flips per character — an interactive transformation. casefold normalizes to a lowercase form designed for comparison, expanding ß to ss and applying Unicode fold mappings. Use swapcase for display effects, casefold for comparison.',
    },
    {
      q: 'How does swapcase handle non-letters?',
      a: 'They pass through unchanged. Digits, punctuation, whitespace, symbols, and non-cased characters like CJK ideographs are all preserved.',
    },
  ],

  history: [
    { version: '1.0', note: 'swapcase() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — case mappings applied per the Unicode standard.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.swapcase',
    meta:  'str.swapcase',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};