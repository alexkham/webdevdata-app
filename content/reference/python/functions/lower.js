// content/reference/python/functions/lower.js

export const meta = {
  slug:        'lower',
  name:        'str.lower',
  signature:   'str.lower()',
  blurb:       'Return a copy of the string with all cased characters lowercased.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'lower lowercase case insensitive normalize',
};

export const method = {
  slug:      'lower',
  name:      'str.lower',
  signature: 'str.lower()',
  returns:   { type: 'str', desc: 'A new string with every cased character converted to lowercase. Uncased characters are unchanged.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Lowercase every cased character — the standard first step for case-insensitive comparison.',

  cheat: {
    commonCall: '"Hello".lower()',
    returns:    'new str — original unchanged',
    replaces:   'digits and punctuation pass through untouched',
    watchOut:   'for caseless MATCHING of arbitrary Unicode, casefold() is stricter',
  },

  parameters: [],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'default',   values: { string: 'Hello World' } },
    { id: 'mixed',   label: 'mixed',     values: { string: 'PyThOn 3.12!' } },
    { id: 'unicode', label: 'unicode',   values: { string: 'CAFÉ' } },
    { id: 'nocase',  label: 'no cased',  values: { string: '123 !?' } },
  ],
  demoExplainer: 'Every character with a lowercase form is converted; everything else — digits, punctuation, already-lowercase letters — passes through unchanged.',

  patterns: [
    {
      name: 'Case-insensitive comparison',
      desc: 'Normalize both sides before comparing.',
      code: 'if answer.lower() == "yes":\n    proceed()',
    },
    {
      name: 'Normalize keys',
      desc: 'Store and look up dictionary keys in one canonical case.',
      code: 'index[word.lower()] = entry',
    },
    {
      name: 'Slug building',
      desc: 'Typically chained after replace.',
      code: 'slug = title.replace(" ", "-").lower()',
    },
  ],

  examples: [
    { title: 'Basic lowercasing',          code: '"Hello World".lower()', returns: "'hello world'" },
    { title: 'Digits and punctuation',     code: '"ABC-123!".lower()',    returns: "'abc-123!'" },
    { title: 'Unicode letters',            code: '"CAFÉ".lower()',        returns: "'café'" },
    { title: 'Already lowercase',          code: '"hello".lower()',       returns: "'hello'" },
  ],

  pitfalls: [
    {
      name: 'The result must be assigned',
      desc: 'Strings are immutable — lower returns a new string.',
      wrong: { label: 'Wrong', code: 's = "HI"\ns.lower()\nprint(s)', output: 'HI' },
      fix:   { label: 'Fix', code: 's = s.lower()\nprint(s)', output: 'hi' },
    },
    {
      name: 'Some Unicode needs casefold, not lower',
      desc: 'German ß lowercases to itself, but casefolds to "ss" — lower() misses such matches.',
      wrong: { label: 'Misses', code: '"straße".lower() == "STRASSE".lower()', output: 'False' },
      fix:   { label: 'Fix', code: '"straße".casefold() == "STRASSE".casefold()', output: 'True' },
    },
  ],

  when: {
    use: [
      'Case-insensitive equality between ASCII-ish strings',
      'Normalizing identifiers, emails, slugs for storage',
      'Display text that must be lowercase',
    ],
    avoid: [
      'Caseless matching of arbitrary Unicode → str.casefold',
      'Only the first letter → str.capitalize',
      'Swapping case → str.swapcase',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'new str — source untouched',
    cpython:    'Objects/unicodeobject.c :: do_lower',
    memory:     'One new string (may differ in byte size for some Unicode)',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'str.strip',   slug: 'strip',   when: 'Trim before normalizing' },
    { name: 'str.replace', slug: 'replace', when: 'Substitute after normalizing' },
    { name: 'str.split',   slug: 'split',   when: 'Tokenize normalized text' },
  ],

  faq: [
    {
      q: 'What is the difference between lower() and casefold()?',
      a: 'casefold is a more aggressive lowercasing designed for caseless matching — it also maps characters like ß to ss. For ASCII they behave the same; for comparing arbitrary Unicode, prefer casefold.',
    },
    {
      q: 'Does lower() change the string length?',
      a: 'In characters, almost never (rare Unicode exceptions exist); the original is never modified either way.',
    },
    {
      q: 'How do I lowercase only the first character?',
      a: 'Slice it yourself — there is no built-in for that direction.',
      code: 's[:1].lower() + s[1:]',
    },
  ],

  history: [
    { version: '3.3', note: 'Related: str.casefold added for caseless matching.' },
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.lower',
    meta:  'str.lower',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
