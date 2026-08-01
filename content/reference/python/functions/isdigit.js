// content/reference/python/functions/isdigit.js

export const meta = {
  slug:        'isdigit',
  name:        'str.isdigit',
  signature:   'str.isdigit()',
  blurb:       'Test whether all characters are digits and the string is non-empty.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'isdigit numeric digits check validate number test',
};

export const method = {
  slug:      'isdigit',
  name:      'str.isdigit',
  signature: 'str.isdigit()',
  returns:   { type: 'bool', desc: 'True when the string is non-empty and every character is a digit. Empty string is False.' },

  category:    'String method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Are these all digits? The pre-flight check before int() — with edge cases worth knowing.',

  cheat: {
    commonCall: 'user_input.isdigit()',
    returns:    'bool — empty string is False',
    replaces:   'no sign, no decimal point: "-3" and "1.5" are False',
    watchOut:   'passing isdigit does not guarantee int() semantics you expect — "0010" passes',
  },

  parameters: [],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the source', input: 'text' },
  ],
  cases: [
    { id: 'default', label: 'digits',   values: { string: '12345' } },
    { id: 'float',   label: 'decimal',  values: { string: '1.5' } },
    { id: 'signed',  label: 'signed',   values: { string: '-3' } },
    { id: 'mixed',   label: 'mixed',    values: { string: '12a' } },
    { id: 'empty',   label: 'empty',    values: { string: '' } },
  ],
  demoExplainer: 'True only when every character is a digit and there is at least one. Signs, decimal points, spaces — anything non-digit — make it False. (Full Python also accepts some Unicode digit characters like ²; this demo covers the ASCII cases.)',

  patterns: [
    {
      name: 'Validate before converting',
      desc: 'The classic guard for user input destined for int().',
      code: 'if age.isdigit():\n    age = int(age)',
    },
    {
      name: 'Filter numeric tokens',
      desc: 'Keep only all-digit pieces of a split.',
      code: 'numbers = [t for t in tokens if t.isdigit()]',
    },
  ],

  examples: [
    { title: 'All digits',        code: '"12345".isdigit()', returns: 'True' },
    { title: 'Decimal point',     code: '"1.5".isdigit()',   returns: 'False' },
    { title: 'Negative sign',     code: '"-3".isdigit()',    returns: 'False' },
    { title: 'Empty string',      code: '"".isdigit()',      returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Signed and decimal numbers fail',
      desc: 'isdigit validates digits only — not "parseable as a number".',
      wrong: { label: 'Rejected', code: '"-3".isdigit() or "1.5".isdigit()', output: 'False' },
      fix:   { label: 'Parse-and-catch instead', code: 'try:\n    x = float(s)\nexcept ValueError:\n    ...', output: 'handles signs, decimals, exponents' },
    },
    {
      name: 'isdigit vs isnumeric vs isdecimal',
      desc: 'Three similar methods differ on Unicode: isdecimal ⊂ isdigit ⊂ isnumeric.',
      wrong: { label: 'Which one?', code: '"²".isdigit(), "½".isnumeric()', output: '(True, True) — but int("²") raises!' },
      fix:   { label: 'Strictest for int()', code: 's.isdecimal()  # only characters int() accepts', output: 'safe pre-check' },
    },
  ],

  when: {
    use: [
      'Quick guard on simple non-negative integer input',
      'Filtering all-digit tokens',
    ],
    avoid: [
      'Signs / decimals / exponents → try/except around int() or float()',
      'Exact int()-compatibility → str.isdecimal',
      'Any Unicode numeral counts → str.isnumeric',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'bool',
    cpython:    'Objects/unicodeobject.c :: unicode_isdigit',
    memory:     'No allocation',
    threadSafe: 'Yes — str is immutable',
  },

  related: [
    { name: 'int',       slug: 'int',      when: 'The conversion this guards' },
    { name: 'str.strip', slug: 'strip',    when: 'Trim before validating' },
    { name: 'str.zfill', slug: 'zfill',    when: 'Pad validated digits' },
  ],

  faq: [
    {
      q: 'Why is "".isdigit() False?',
      a: 'All the is* string methods require at least one character — an empty string has nothing to be "all digits".',
    },
    {
      q: 'Which method exactly matches what int() accepts?',
      a: 'isdecimal. isdigit also accepts characters like superscript ² that int() rejects.',
    },
    {
      q: 'How do I validate a signed integer?',
      a: 'Strip the sign first, or just attempt the conversion.',
      code: 's.lstrip("+-").isdigit() and s.count("-") + s.count("+") <= 1',
    },
  ],

  history: [
    { version: '2.0', note: 'Method available on the unified string type.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isdigit',
    meta:  'str.isdigit',
  },

  tryInTool: [
    { name: 'URL Encoder', href: '/tools/url-encoder', meta: 'String escaping tasks' },
    { name: 'Base64',      href: '/tools/base64',      meta: 'Encoding tasks' },
  ],
};
