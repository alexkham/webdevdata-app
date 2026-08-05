// content/reference/python/functions/str-istitle.js
//
// Slug is type-prefixed: `istitle` is a str method (also on bytes).

export const meta = {
  slug:        'str-istitle',
  name:        'str.istitle',
  signature:   'str.istitle()',
  blurb:       'True if the string is in strict title case — first letter of each word uppercase, rest lowercase.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'istitle title case capitalize word start uppercase check first letter apostrophe',
};

export const method = {
  slug:      'str-istitle',
  name:      'str.istitle',
  signature: 'str.istitle()',
  returns:   { type: 'bool', desc: 'True if the string is in title case and contains at least one cased character. Title case: uppercase characters may only follow non-cased characters (spaces, punctuation, digits), and lowercase characters may only follow cased characters.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Check that a string matches str.title()&apos;s output — a very strict definition that trips even short apostrophes.',

  cheat: {
    commonCall: 'if headline.istitle():',
    returns:    'True or False',
    replaces:   '`s == s.title()` — but istitle is stricter about ambiguous cases',
    watchOut:   'Python&apos;s title case treats apostrophes as WORD BREAKS — "Don&apos;t" fails; "Don&apos;T" passes',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'basic',      label: 'basic title',       values: { string: 'Hello World' } },
    { id: 'lower',      label: 'all lower',         values: { string: 'hello world' } },
    { id: 'upper',      label: 'all upper',         values: { string: 'HELLO WORLD' } },
    { id: 'single',     label: 'single word',        values: { string: 'Hello' } },
    { id: 'apostrophe', label: 'apostrophe surprise',values: { string: "Don&apos;t" } },
    { id: 'quirk',      label: 'quirky title',       values: { string: "Don&apos;T" } },
    { id: 'digits',     label: 'title + digits',    values: { string: 'Chapter 1 Introduction' } },
    { id: 'empty',      label: 'empty',             values: { string: '' } },
  ],
  demoExplainer: 'istitle() applies Python&apos;s strict title-case definition: every uppercase character may ONLY follow a non-cased character (space, punctuation, digit, start of string). Every lowercase character may ONLY follow a cased character. The classic surprise: the apostrophe in "Don&apos;t" is non-cased, so the "t" after it should be uppercase — meaning "Don&apos;t" is NOT title case per Python, but "Don&apos;T" is. This matches str.title() but rarely matches human intuition.',

  patterns: [
    {
      name: 'Validate a formatted headline',
      desc: 'Confirm output of str.title() before serializing.',
      code: 'if not headline.istitle():\n    raise ValueError("headline must be title case")',
    },
    {
      name: 'Skip already-titlecased strings',
      desc: 'Avoid redundant work when already normalized.',
      code: 'if not text.istitle():\n    text = text.title()',
    },
    {
      name: 'Detect one-word title-case identifiers',
      desc: 'Class names in CamelCase almost always fail istitle — the pattern is subtly different.',
      code: '# "MyClass".istitle() is False\n# because "C" follows a cased "y"',
    },
  ],

  examples: [
    { title: 'Basic title',         code: '"Hello World".istitle()',  returns: 'True' },
    { title: 'All lower',           code: '"hello world".istitle()',   returns: 'False' },
    { title: 'All upper',           code: '"HELLO WORLD".istitle()',   returns: 'False' },
    { title: 'Single word',         code: '"Hello".istitle()',         returns: 'True' },
    { title: 'Apostrophe surprise', code: '"Don\\&apos;t".istitle()',  returns: "False  # 't' should be 'T' after apostrophe" },
    { title: 'Quirky title',        code: '"Don\\&apos;T".istitle()',  returns: 'True  # ...but this is title case!' },
    { title: 'Title + digits',      code: '"Chapter 1 Introduction".istitle()', returns: 'True' },
    { title: 'Empty is False',      code: '"".istitle()',             returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Apostrophes count as word breaks',
      desc: 'The single most surprising istitle result. Python treats the apostrophe as non-cased, so what looks like a normal contraction fails title-case: "Don&apos;t" is NOT title case, but "Don&apos;T" IS. Matches str.title() behavior — both are strict in the same way.',
      wrong: { label: 'Common contraction', code: '"Don\\&apos;t Stop".istitle()', output: 'False' },
      fix:   { label: 'Weird but true',     code: '"Don\\&apos;T Stop".istitle()', output: 'True' },
    },
    {
      name: 'CamelCase identifiers are NOT title case',
      desc: 'Adjacent letters within a word cannot switch case in title case. "MyClass" fails because the "C" immediately follows a cased "y" without an intervening non-cased character.',
      wrong: { label: 'CamelCase fails', code: '"MyClass".istitle()', output: 'False' },
      fix:   { label: 'Space it out',    code: '"My Class".istitle()', output: 'True' },
    },
    {
      name: 'Empty string returns False',
      desc: 'Same rule across the is* family — empty is always False. istitle also requires at least one cased character.',
      wrong: { label: 'Wrong expectation', code: '"".istitle()', output: 'False' },
      fix:   { label: 'Guard first',        code: 's and s.istitle()', output: 'covers the empty case' },
    },
    {
      name: 'Digits and punctuation are &quot;word separators&quot;',
      desc: 'Any non-cased character resets the case expectation. "Chapter1Intro" is NOT title case (the 1 acts as a word separator, so the "I" should be preceded by lowercase, but it is preceded by a digit which resets).',
      wrong: { label: 'Assumed pass', code: '"Chapter1Intro".istitle()', output: 'True  # actually True — digits reset the state' },
      fix:   { label: 'Read the docs — digits behave as non-cased', code: '', output: '' },
    },
  ],

  when: {
    use: [
      'Validating that a headline has been passed through str.title()',
      'Detecting non-normalized formatted text',
      'Composing with capitalize / title / isupper / islower for finer checks',
      'Confirming a string matches Python&apos;s specific title-case convention',
    ],
    avoid: [
      'Human-friendly title case (which allows apostrophes) → custom regex',
      'Detecting camelCase or PascalCase → different pattern entirely',
      'Locale-aware title case → third-party library',
      'You need &quot;is capitalized&quot; not &quot;is title case&quot; → check first char via s[0].isupper()',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_istitle',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'title',        slug: 'title',        when: 'Convert TO title case — pairs with the istitle check' },
    { name: 'capitalize',   slug: 'capitalize',   when: 'Only capitalize the first letter of the entire string' },
    { name: 'str.isupper',  slug: 'str-isupper',  when: 'Every cased character is uppercase' },
    { name: 'str.islower',  slug: 'str-islower',  when: 'Every cased character is lowercase' },
  ],

  faq: [
    {
      q: 'Why does &quot;Don&apos;t&quot;.istitle() return False?',
      a: 'Because Python treats the apostrophe as a word break. After a word break, the next cased character should be uppercase — but &quot;t&quot; is lowercase. This matches str.title() output, which produces &quot;Don&apos;T&quot;.',
    },
    {
      q: 'Is `s.istitle()` the same as `s == s.title()`?',
      a: 'Very close, but not always. Both apply the same title-case definition; some edge cases (specifically around characters with special Unicode case mapping) can differ. For ASCII text they always agree.',
    },
    {
      q: 'How do I check for &quot;human&quot; title case that allows contractions?',
      a: 'You cannot with istitle. Write a custom check: uppercase the first letter of each word (split on whitespace only) and compare, or use a regex like `^([A-Z][a-z\\&apos;]*\\s?)+$` for simple ASCII cases.',
    },
  ],

  history: [
    { version: '1.0', note: 'istitle() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — checks per Unicode general category and case mapping.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.istitle',
    meta:  'str.istitle',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};