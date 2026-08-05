// content/reference/python/functions/str-casefold.js
//
// Slug is type-prefixed: `casefold` is a str method.

export const meta = {
  slug:        'str-casefold',
  name:        'str.casefold',
  signature:   'str.casefold()',
  blurb:       'Aggressive lowercase for case-insensitive comparison — stronger than lower().',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'casefold lower unicode case insensitive compare german ß sharp s equal fold',
};

export const method = {
  slug:      'str-casefold',
  name:      'str.casefold',
  signature: 'str.casefold()',
  returns:   { type: 'str', desc: 'A casefolded copy of the string — Unicode&apos;s "fold" mapping, designed for locale-neutral case-insensitive comparison. Similar to lower() but handles special cases like German ß → "ss".' },

  category:    'String method',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'The correct tool for case-insensitive string comparison — where lower() falls short on non-Latin scripts.',

  cheat: {
    commonCall: 'a.casefold() == b.casefold()',
    returns:    'a new str — the original is unchanged',
    replaces:   'a.lower() == b.lower() when Unicode correctness matters',
    watchOut:   'result may be LONGER than input (ß → ss); does not normalize accents',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',           values: { string: 'HELLO' } },
    { id: 'mixed',      label: 'mixed case',      values: { string: 'HeLLo WoRLD' } },
    { id: 'german-ss',  label: 'German ß',        values: { string: 'straße' } },
    { id: 'greek-final',label: 'Greek final σ',   values: { string: 'ΟΔΥΣΣΕΥΣ' } },
    { id: 'accented',   label: 'accented',        values: { string: 'CAFÉ' } },
    { id: 'already',    label: 'already folded',  values: { string: 'hello' } },
    { id: 'empty',      label: 'empty',           values: { string: '' } },
  ],
  demoExplainer: 'casefold applies the Unicode "case-folding" mapping — an aggressive lowercase designed for comparison, not display. The German ß becomes "ss" (not ß) because case-insensitive Straße should match STRASSE. lower() would leave ß unchanged, breaking the match. For any user-input comparison across languages, casefold is the correct default.',

  patterns: [
    {
      name: 'Case-insensitive equality',
      desc: 'The idiomatic way — works across languages.',
      code: 'if a.casefold() == b.casefold():\n    ...',
    },
    {
      name: 'Case-insensitive set membership',
      desc: 'Fold both the item and the set contents.',
      code: 'allowed = {"gold", "silver", "bronze"}\nif user_input.casefold() in {x.casefold() for x in allowed}:\n    ...',
    },
    {
      name: 'Case-insensitive sort key',
      desc: 'casefold makes an excellent key for locale-neutral sorting.',
      code: 'names.sort(key=str.casefold)',
    },
  ],

  examples: [
    { title: 'Basic',              code: '"HELLO".casefold()',       returns: '"hello"' },
    { title: 'German ß expands',   code: '"straße".casefold()',      returns: '"strasse"' },
    { title: 'Straße == STRASSE',  code: '"Straße".casefold() == "STRASSE".casefold()', returns: 'True' },
    { title: 'lower() misses it',  code: '"Straße".lower() == "STRASSE".lower()',        returns: 'False  # ß != ss' },
    { title: 'Accents preserved',  code: '"CAFÉ".casefold()',        returns: '"café"' },
    { title: 'Empty is empty',     code: '"".casefold()',            returns: '""' },
  ],

  pitfalls: [
    {
      name: 'casefold is NOT the same as lower()',
      desc: 'lower() is a simple case mapping — one character in, one character out. casefold applies the Unicode case-folding table, which can EXPAND a character (ß → ss) or map to unusual lowercase forms.',
      wrong: { label: 'lower() misses ß',   code: '"Straße".lower() == "STRASSE".lower()', output: 'False  # ß stays ß' },
      fix:   { label: 'casefold gets it',   code: '"Straße".casefold() == "STRASSE".casefold()', output: 'True' },
    },
    {
      name: 'Length can change',
      desc: 'ß casefolds to two characters. A length check before and after may fail unexpectedly.',
      wrong: { label: 'Grew by one', code: 'len("Straße".casefold())', output: '7  # was 6' },
      fix:   { label: 'Do not assume length preservation', code: '# treat as arbitrary string transformation', output: '' },
    },
    {
      name: 'Does NOT normalize accents or diacritics',
      desc: 'casefold folds case, not diacritics. "café" and "cafe" still compare unequal. For accent-insensitive matching, use unicodedata.normalize.',
      wrong: { label: 'Still different', code: '"café".casefold() == "cafe".casefold()', output: 'False' },
      fix:   { label: 'Normalize NFKD + strip combining', code: 'import unicodedata\ndef strip_accents(s):\n    return "".join(c for c in unicodedata.normalize("NFKD", s)\n                   if not unicodedata.combining(c))', output: 'accent-insensitive after this' },
    },
    {
      name: 'Original string is NOT modified',
      desc: 'Like all string methods, casefold returns a new string. Assigning it back is required for the folded value to persist.',
      wrong: { label: 'Lost result', code: 's = "HELLO"\ns.casefold()\nprint(s)', output: '"HELLO"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.casefold()\nprint(s)', output: '"hello"' },
    },
  ],

  when: {
    use: [
      'Case-insensitive equality across any language',
      'Sort keys where case should not matter',
      'Building case-insensitive sets or lookups',
      'Any user-input comparison where locale-neutral behavior is required',
    ],
    avoid: [
      'Display formatting — lower() and upper() are for display, casefold is for comparison',
      'ASCII-only text where lower() is enough and reads more idiomatically',
      'Accent-insensitive matching → normalize with unicodedata first',
      'Length-sensitive operations after folding',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'A new string; length may exceed the original due to expansions like ß → ss',
    cpython:    'Objects/unicodeobject.c :: unicode_casefold — applies Unicode&apos;s CaseFolding table',
    memory:     'Allocates one new string',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'lower',      slug: 'lower',      when: 'Simple ASCII-friendly lowercase for display' },
    { name: 'upper',      slug: 'upper',      when: 'Uppercase counterpart — but not fold-safe for comparison' },
    { name: 'strip',      slug: 'strip',      when: 'Trim whitespace before folding' },
  ],

  faq: [
    {
      q: 'What is the difference between casefold and lower?',
      a: 'lower() applies Unicode&apos;s simple lowercase mapping — one code point in, one out. casefold applies the Unicode case-folding mapping, which is designed for caseless comparison and handles special cases like ß → ss and Greek final sigma. Use lower for display; use casefold for equality.',
    },
    {
      q: 'When does casefold actually differ from lower?',
      a: 'For most Latin text, they produce the same result. The differences show up on German ß, Greek sigma variants, some Cherokee letters, and a handful of other special cases. Reach for casefold whenever inputs might not be ASCII.',
    },
    {
      q: 'Does casefold handle accents?',
      a: 'No. casefold folds CASE, not diacritics. For accent-insensitive comparison you also need to normalize with unicodedata (NFKD form and strip combining characters).',
    },
  ],

  history: [
    { version: '3.3', note: 'casefold() introduced — replacing hand-rolled Unicode-aware lowercase workarounds.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.casefold',
    meta:  'str.casefold',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};