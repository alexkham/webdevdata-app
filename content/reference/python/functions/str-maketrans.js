// content/reference/python/functions/str-maketrans.js
//
// Slug is type-prefixed: `maketrans` is a str classmethod.

export const meta = {
  slug:        'str-maketrans',
  name:        'str.maketrans',
  signature:   'str.maketrans(x[, y[, z]])',
  blurb:       'Build a translation table for str.translate — three call shapes.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'maketrans translation table translate build map dict ordinals delete',
};

export const method = {
  slug:      'str-maketrans',
  name:      'str.maketrans',
  signature: 'str.maketrans(x[, y[, z]])',
  returns:   { type: 'dict', desc: 'A dict mapping Unicode ordinals (integers) to replacement values (integers, strings, or None). Feed the result to str.translate(). Three input shapes are supported — see parameters.' },

  category:    'String classmethod',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'Build the translation table used by str.translate. Three shapes: dict form, two-string form, and two-string-plus-delete form.',

  cheat: {
    commonCall: 'str.maketrans("abc", "xyz")',
    returns:    'a dict — always with integer keys',
    replaces:   'hand-building `{ord("a"): ord("x"), ord("b"): ord("y")}` dicts',
    watchOut:   'two-string form requires EQUAL lengths — mismatch raises ValueError',
  },

  parameters: [
    { name: 'x', type: 'dict | str', required: true, default: null, desc: 'Dict form: {ord(char) → replacement} directly. Two-string form: characters to be mapped (must equal length of y). Three-string form: same as two-string plus a `z` string of characters to DELETE.' },
    { name: 'y', type: 'str',        required: false, default: 'None', desc: 'The replacement characters — must match the length of x. Only used when x is a string.' },
    { name: 'z', type: 'str',        required: false, default: 'None', desc: 'Characters to DELETE — mapped to None in the resulting table. Only used with the two-string form of x/y.' },
  ],

  demoParams: [
    { name: 'from', type: 'str', hint: 'characters to replace', input: 'text' },
    { name: 'to',   type: 'str', hint: 'replacements, same length', input: 'text' },
    { name: 'del',  type: 'str', hint: 'characters to delete (optional)', input: 'text-or-none' },
  ],
  cases: [
    { id: 'basic',    label: 'basic swap',    values: { from: 'abc',        to: 'xyz',        del: '' } },
    { id: 'digits',   label: 'digit shift',   values: { from: '0123456789', to: '9876543210', del: '' } },
    { id: 'quotes',   label: 'smart quotes',  values: { from: '&quot;',     to: '&apos;',     del: '' } },
    { id: 'del',      label: 'with delete',   values: { from: '',           to: '',           del: 'aeiou' } },
    { id: 'both',     label: 'swap + delete', values: { from: 'ab',         to: 'xy',         del: 'z' } },
    { id: 'no-op',    label: 'empty',         values: { from: '',           to: '',           del: '' } },
  ],
  demoExplainer: 'The demo shows the RESULTING TABLE as a dict from ordinal to replacement. Real code feeds it into str.translate. The two-string form (from + to) requires equal lengths — a mismatch raises ValueError. The optional third argument &quot;del&quot; is a set of characters to DELETE (mapped to None). Passing empty strings for from + to with a non-empty del is a valid &quot;delete only&quot; call.',

  patterns: [
    {
      name: 'Straightforward character swap',
      desc: 'Two strings of equal length — position-wise substitution.',
      code: 'table = str.maketrans("abc", "xyz")',
    },
    {
      name: 'Delete-only table',
      desc: 'Empty from/to plus a delete string.',
      code: 'no_vowels = str.maketrans("", "", "aeiou")',
    },
    {
      name: 'Explicit dict form for multi-char replacements',
      desc: 'The dict form allows string values (not just single characters).',
      code: 'table = str.maketrans({"&amp;": "and", "@": " at "})',
    },
    {
      name: 'Swap AND delete in one call',
      desc: 'All three arguments at once — substitute some chars, delete others.',
      code: 'table = str.maketrans("abc", "xyz", "!?")',
    },
  ],

  examples: [
    { title: 'Basic two-string',   code: 'str.maketrans("abc", "xyz")',    returns: '{97: 120, 98: 121, 99: 122}  # ordinals!' },
    { title: 'Delete-only',        code: 'str.maketrans("", "", "aeiou")', returns: '{97: None, 101: None, 105: None, ...}' },
    { title: 'Two-string + delete', code: 'str.maketrans("ab", "xy", "z")', returns: '{97: 120, 98: 121, 122: None}' },
    { title: 'Dict form',          code: 'str.maketrans({"&amp;": "and"})',  returns: '{38: "and"}' },
    { title: 'Feed to translate',  code: '"a&amp;b".translate(str.maketrans({"&amp;": "and"}))', returns: '"aandb"' },
  ],

  pitfalls: [
    {
      name: 'Two-string lengths MUST match',
      desc: 'A common source of ValueError. The two-string form is strict — a mismatch raises before any translation happens.',
      wrong: { label: 'Length mismatch', code: 'str.maketrans("abc", "xy")', output: 'ValueError: the first two maketrans arguments must have equal length' },
      fix:   { label: 'Same length',      code: 'str.maketrans("abc", "xyz")', output: 'valid table' },
    },
    {
      name: 'Returns a dict of ORDINALS, not characters',
      desc: 'The output looks weird when you inspect it — keys are integers, not characters. This is by design: str.translate wants ordinals. You almost never index into the result directly.',
      wrong: { label: 'Ordinal keys', code: 'str.maketrans("a", "x")["a"]', output: "KeyError: 'a'  # not the key" },
      fix:   { label: 'Use ord()',    code: 'str.maketrans("a", "x")[ord("a")]', output: '120  # ord("x")' },
    },
    {
      name: 'Dict form allows string values; two-string form does not',
      desc: 'When x is a dict, values may be strings (multi-character replacements). When x and y are strings, values are single characters. For multi-character replacements, use the dict form.',
      wrong: { label: 'Multi-char in two-string form', code: 'str.maketrans("a", "xyz")', output: 'ValueError: the first two maketrans arguments must have equal length' },
      fix:   { label: 'Dict form',                       code: 'str.maketrans({"a": "xyz"})', output: '{97: "xyz"}' },
    },
    {
      name: 'It is a CLASSMETHOD',
      desc: 'Called on the str class, not on a string instance. Works on instances too but reads confusingly — the receiver is ignored.',
      wrong: { label: 'Instance style', code: '"hi".maketrans("a", "x")   # receiver ignored', output: 'valid but confusing' },
      fix:   { label: 'Class form',     code: 'str.maketrans("a", "x")', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'Any time you would use str.translate — always build with maketrans',
      'Multi-character substitutions via the dict form',
      'Batch character deletion via the three-string form',
      'Building a reusable table once and applying to many strings',
    ],
    avoid: [
      'One-off substring replacement → str.replace is more direct',
      'Regex-based transformations → re.sub',
      'Case transformations → lower / upper / casefold / swapcase',
      'Multi-char keys — dict form allows multi-char VALUES only, not keys',
    ],
  },

  notes: {
    complexity: 'O(n) in the total size of the inputs — one pass to build the dict',
    return:     'dict — always with integer keys (Unicode ordinals)',
    cpython:    'Objects/unicodeobject.c :: unicode_maketrans_impl',
    memory:     'One dict allocated, sized to the input',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'str.translate', slug: 'str-translate', when: 'Apply the table built by maketrans' },
    { name: 'replace',       slug: 'replace',       when: 'One-off substring substitution instead of a table' },
    { name: 'chr',           slug: 'chr',           when: 'Convert an ordinal back to a character for debugging' },
    { name: 'ord',           slug: 'ord',           when: 'Convert a character to its ordinal — same integers maketrans uses' },
  ],

  faq: [
    {
      q: 'What is the difference between maketrans and translate?',
      a: 'maketrans BUILDS the table; translate APPLIES it. Two separate steps — you almost always chain them in one expression: `s.translate(str.maketrans(...))`.',
    },
    {
      q: 'Why does the returned dict have integer keys?',
      a: 'Because str.translate looks up by codepoint. Integer keys make the lookup a direct integer index, faster than character keys would be. You rarely inspect the dict directly — pass it straight to translate.',
    },
    {
      q: 'What is the difference between the dict form and the two-string form?',
      a: 'The dict form is more flexible — values can be strings (multi-character replacements), integers, or None. The two-string form is more compact but restricts values to single characters and requires equal input lengths.',
    },
  ],

  history: [
    { version: '2.6', note: 'string.maketrans available; used with str.translate.' },
    { version: '3.0', note: 'Became str.maketrans as a classmethod; supports Unicode ordinals; adds the dict form.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.maketrans',
    meta:  'str.maketrans',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the resulting table' },
  ],
};