// content/reference/python/functions/str-translate.js
//
// Slug is type-prefixed: `translate` is a str method (also on bytes).

export const meta = {
  slug:        'str-translate',
  name:        'str.translate',
  signature:   'str.translate(table)',
  blurb:       'Apply a character-mapping table — replace, delete, or transform in one pass.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.6+',
  searchTerms: 'translate replace map characters delete ordinals table chr encode transform',
};

export const method = {
  slug:      'str-translate',
  name:      'str.translate',
  signature: 'str.translate(table)',
  returns:   { type: 'str', desc: 'A copy of the string in which each character has been mapped through the given table. Keys are ORDINALS (integers, not characters); values may be integers, strings, or None (which deletes the character).' },

  category:    'String method',
  version:     'Python 1.6+',
  hasLiveDemo: true,

  subtitle: 'Character-level transformation with a lookup table — build the table with str.maketrans, then apply in one linear pass.',

  cheat: {
    commonCall: 's.translate(str.maketrans("abc", "xyz"))',
    returns:    'new str — the original is unchanged',
    replaces:   'a chain of `.replace()` calls when every character is a single-character swap',
    watchOut:   'table keys are ORDINALS (integers), not characters — use str.maketrans to avoid the confusion',
  },

  parameters: [
    { name: 'table', type: 'dict', required: true, default: null, desc: 'A mapping from Unicode ordinal (integer) to Unicode ordinal, string, or None. Characters not in the table are passed through unchanged. Almost always built via str.maketrans().' },
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source',                    input: 'text' },
    { name: 'frm',    type: 'str', hint: 'characters to replace',         input: 'text' },
    { name: 'to',     type: 'str', hint: 'replacements, same length',     input: 'text' },
  ],
  demoTemplate: '{string}.translate(str.maketrans({frm}, {to}))',
  cases: [
    { id: 'basic',   label: 'default',    values: { string: 'hello',          frm: 'l',          to: 'L' } },
    { id: 'digits',  label: 'digit swap', values: { string: 'phone 555-1234', frm: '0123456789', to: '9876543210' } },
    { id: 'nomatch', label: 'no matches', values: { string: 'hello',          frm: 'xyz',        to: 'XYZ' } },
    { id: 'empty',   label: 'empty maps', values: { string: 'hello',          frm: '',           to: '' } },
  ],
  demoExplainer: 'The demo builds a table from your \"from\" and \"to\" strings (like str.maketrans("abc", "xyz")) — each character in \"from\" maps to the same-position character in \"to\". Characters not in \"from\" are passed through. Both strings must be the same length. Real code usually builds tables with str.maketrans, which also accepts a dict form and a \"delete these chars\" third argument.',

  patterns: [
    {
      name: 'Batch character swap',
      desc: 'One pass, no repeated string allocations.',
      code: 'table = str.maketrans("abc", "xyz")\nresult = text.translate(table)',
    },
    {
      name: 'Delete specific characters',
      desc: 'Third argument to maketrans is the chars to delete.',
      code: 'clean = text.translate(str.maketrans("", "", "aeiou"))\n# remove vowels',
    },
    {
      name: 'Strip accents',
      desc: 'Combine translate with a Unicode normalization pass.',
      code: 'import unicodedata\ndef strip_accents(s):\n    d = unicodedata.normalize("NFKD", s)\n    return "".join(c for c in d if not unicodedata.combining(c))',
    },
    {
      name: 'Replace a character with multiple characters',
      desc: 'Table values can be strings, not just single characters.',
      code: 'text.translate({ord("&"): "and"})',
    },
  ],

  examples: [
    { title: 'Basic swap',         code: '"hello".translate(str.maketrans("l", "L"))',    returns: '"heLLo"' },
    { title: 'Multi-char swap',    code: '"abc".translate(str.maketrans("abc", "xyz"))',  returns: '"xyz"' },
    { title: 'Delete chars',       code: '"hello".translate(str.maketrans("", "", "l"))', returns: '"heo"' },
    { title: 'Table with strings', code: '"a&b".translate({ord("&"): "and"})',    returns: '"aandb"' },
    { title: 'None deletes',       code: '"hello".translate({ord("l"): None})',            returns: '"heo"' },
    { title: 'No matches',         code: '"hello".translate(str.maketrans("xyz", "abc"))', returns: '"hello"' },
  ],

  pitfalls: [
    {
      name: 'Table keys are ORDINALS, not characters',
      desc: 'The most common translate confusion. A dict with string keys does not work — you need integer ordinals. str.maketrans handles this for you.',
      wrong: { label: 'String keys silent no-op', code: '"hello".translate({"l": "L"})', output: '"hello"  # nothing matched' },
      fix:   { label: 'Use maketrans',            code: '"hello".translate(str.maketrans("l", "L"))', output: '"heLLo"' },
    },
    {
      name: 'None deletes; empty string does not exist',
      desc: 'A value of None removes the character from the output. The empty string as a value would leave an empty string (which happens to look the same). Some people expect "" to be the \"delete\" sentinel — it is not; None is.',
      wrong: { label: 'Empty string keeps position', code: '"abc".translate({ord("b"): ""})', output: '"ac"  # actually works — empty string joins fine' },
      fix:   { label: 'None is canonical',           code: '"abc".translate({ord("b"): None})', output: '"ac"' },
    },
    {
      name: 'maketrans two-string form: lengths MUST match',
      desc: 'When called with two strings, str.maketrans requires them to be the same length. Different lengths raise ValueError.',
      wrong: { label: 'Length mismatch', code: 'str.maketrans("abc", "xy")', output: 'ValueError: the first two maketrans arguments must have equal length' },
      fix:   { label: 'Same length',      code: 'str.maketrans("abc", "xyz")', output: 'valid table' },
    },
    {
      name: 'translate is a pure operation — the original is unchanged',
      desc: 'Like all string methods, translate returns a new string. Assigning it back is required.',
      wrong: { label: 'Lost result', code: 's = "hello"\ns.translate(str.maketrans("l", "L"))\nprint(s)', output: '"hello"  # unchanged' },
      fix:   { label: 'Capture it',  code: 's = s.translate(str.maketrans("l", "L"))', output: '"heLLo"' },
    },
  ],

  when: {
    use: [
      'Batch single-character substitutions in one linear pass',
      'Character deletion via the maketrans third argument',
      'Building a stripping / escaping / obfuscation table once and applying many times',
      'Any transformation that would otherwise chain many .replace() calls',
    ],
    avoid: [
      'Multi-character substrings → str.replace or re.sub',
      'Case-insensitive replacement → normalize with casefold, then translate',
      'Regex-based transforms → re.sub with a callable',
      'Accent stripping via character mapping alone — combine with unicodedata',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan of the string',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_translate',
    memory:     'Allocates one new string',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'str.maketrans',    slug: 'str-maketrans',    when: 'Build the translation table used here' },
    { name: 'replace',          slug: 'replace',          when: 'Multi-character or single-character substring substitution' },
    { name: 'str.casefold',     slug: 'str-casefold',     when: 'Normalize case before translating' },
  ],

  faq: [
    {
      q: 'Why does translate need ordinals instead of characters?',
      a: 'For efficiency — internally CPython indexes the table by codepoint. Using integers keeps the lookup a plain integer indexing operation. In practice you never touch the ordinals directly; str.maketrans converts strings for you.',
    },
    {
      q: 'What is the difference between translate and replace?',
      a: 'replace handles multi-character substrings — one call, one substring. translate handles many single-character substitutions in one pass. Chain of ten .replace() calls with single characters? One translate call is faster.',
    },
    {
      q: 'Can I delete characters with translate?',
      a: 'Yes — map them to None. Or use the third argument to str.maketrans, which builds a table with None values for those characters.',
      code: '"hello".translate(str.maketrans("", "", "aeiou"))\n# "hll"',
    },
  ],

  history: [
    { version: '1.6', note: 'translate() introduced along with the string-table concept.' },
    { version: '3.0', note: 'Table keys became ordinals (integers); the older bytes-based translate remains for bytes objects.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.translate',
    meta:  'str.translate',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};