// content/reference/python/functions/str-isnumeric.js
//
// Slug is type-prefixed: `isnumeric` is a str method (also on bytes).

export const meta = {
  slug:        'str-isnumeric',
  name:        'str.isnumeric',
  signature:   'str.isnumeric()',
  blurb:       'True if every character is numeric — including Roman numerals and fractions.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isnumeric numeric roman numeral fraction check unicode superscript vulgar',
};

export const method = {
  slug:      'str-isnumeric',
  name:      'str.isnumeric',
  signature: 'str.isnumeric()',
  returns:   { type: 'bool', desc: 'True if every character in the string has a Unicode numeric value AND the string is non-empty. Broader than isdigit — includes fractions (½), Roman numerals (Ⅳ), superscripts (²), and other numeric symbols.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The widest numeric check — a superset of isdigit that accepts any character Unicode considers numeric.',

  cheat: {
    commonCall: 'if s.isnumeric():',
    returns:    'True or False',
    replaces:   'isdigit when you also want Roman numerals, fractions, or superscripts',
    watchOut:   'does NOT mean \"can be converted with int() or float()\"; decimals ("3.14") return False',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'digits',      label: 'plain digits',      values: { string: '12345' } },
    { id: 'decimal',     label: 'decimal',           values: { string: '3.14' } },
    { id: 'negative',    label: 'negative',          values: { string: '-42' } },
    { id: 'fraction',    label: 'fraction ½',         values: { string: '½' } },
    { id: 'roman',       label: 'Roman numeral',     values: { string: 'Ⅳ' } },
    { id: 'superscript', label: 'superscript',       values: { string: '²' } },
    { id: 'arabic',      label: 'Arabic-Indic',      values: { string: '٥٦٧' } },
    { id: 'mixed',       label: 'digits + letter',   values: { string: '123a' } },
    { id: 'empty',       label: 'empty',             values: { string: '' } },
  ],
  demoExplainer: 'isnumeric() is the WIDEST of the numeric check family. It returns True for anything Unicode classifies as having a numeric value — digits, fractions like ½ and ¾, Roman numerals like Ⅳ and Ⅻ, superscript numbers like ² and ³, and Arabic-Indic or Devanagari digits. It does NOT accept decimal points, minus signs, or spaces. "3.14" returns False (the dot is not numeric); "-42" returns False (the minus is not numeric).',

  patterns: [
    {
      name: 'Detect any Unicode number-shaped input',
      desc: 'Widest net when you want to accept every notation.',
      code: 'if token.isnumeric():\n    ...    # digits, fractions, Roman, superscripts',
    },
    {
      name: 'Widest reject-on-non-number',
      desc: 'Combine with isalpha for a \"something meaningful\" check.',
      code: 'if not (s.isnumeric() or s.isalpha()):\n    reject(s)',
    },
    {
      name: 'Explicit ASCII-only check',
      desc: 'Restrict to ASCII digits by combining with .isascii().',
      code: 'if s.isascii() and s.isdigit():\n    ...    # ASCII 0-9 only',
    },
  ],

  examples: [
    { title: 'Plain digits',        code: '"12345".isnumeric()',   returns: 'True' },
    { title: 'Fraction',            code: '"½".isnumeric()',        returns: 'True' },
    { title: 'Roman numeral',       code: '"Ⅳ".isnumeric()',        returns: 'True' },
    { title: 'Superscript',         code: '"²".isnumeric()',        returns: 'True' },
    { title: 'Arabic-Indic',        code: '"٥٦٧".isnumeric()',      returns: 'True' },
    { title: 'Decimal fails',       code: '"3.14".isnumeric()',    returns: 'False  # the dot' },
    { title: 'Negative fails',      code: '"-42".isnumeric()',     returns: 'False  # the minus' },
    { title: 'Empty is False',      code: '"".isnumeric()',        returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'isnumeric does NOT mean \"can be converted to a number\"',
      desc: 'The most common misconception. isnumeric accepts fractions and Roman numerals but rejects decimals and signs. int("3.14") raises; float("½") also raises. isnumeric is about Unicode categorization, not parseability.',
      wrong: { label: 'Decimal misleadingly rejected', code: '"3.14".isnumeric()', output: 'False  # not "3" plus digit — the dot fails' },
      fix:   { label: 'Try/except to test parseability', code: 'def is_parseable_number(s):\n    try:\n        float(s)\n        return True\n    except ValueError:\n        return False', output: 'True on "3.14"' },
    },
    {
      name: 'isdigit vs isnumeric vs isdecimal — three widths',
      desc: 'isdecimal is narrowest (only decimal digits like 0-9). isdigit adds superscripts and a few more. isnumeric is widest — fractions, Roman numerals, and every Unicode numeric character.',
      wrong: { label: 'Wrong tool',   code: '"½".isdigit()', output: 'False' },
      fix:   { label: 'Right width',   code: '"½".isnumeric()', output: 'True' },
    },
    {
      name: 'Empty string returns False',
      desc: 'Same rule as the rest of the is* family — empty is False by convention.',
      wrong: { label: 'Wrong expectation', code: '"".isnumeric()', output: 'False' },
      fix:   { label: 'Guard first',       code: 's and s.isnumeric()', output: 'covers the empty case' },
    },
    {
      name: 'Signs and separators are NOT numeric characters',
      desc: 'The minus sign, plus sign, decimal point, thousands separator, and currency symbols all count as punctuation or symbols — not numeric. Even \"-42\", which looks numeric to a human, returns False.',
      wrong: { label: 'Sign rejected', code: '"-42".isnumeric()', output: 'False' },
      fix:   { label: 'Strip sign first', code: 's.lstrip("-+").isnumeric()', output: 'True on "-42"' },
    },
  ],

  when: {
    use: [
      'Accepting a wide range of Unicode number-shaped strings',
      'Filtering tokens that consist entirely of numeric characters',
      'Detecting non-ASCII numbers (Arabic-Indic, Devanagari, Roman)',
      'Combining with isalpha for \"is this a meaningful token?\" checks',
    ],
    avoid: [
      'You want to know if it PARSES to a number → try int()/float() with try/except',
      'You want ASCII digits only → isdecimal or isascii+isdigit',
      'Signs / decimals / thousands separators need to pass → parse instead of classify',
      'Rich validation (bounds, format) → use a regex or validator library',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isnumeric',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'isdigit',     slug: 'isdigit',     when: 'Narrower numeric check — digits and superscripts, no Roman or fractions' },
    { name: 'str.isalpha', slug: 'str-isalpha', when: 'The letter counterpart' },
    { name: 'str.isalnum', slug: 'str-isalnum', when: 'Letters OR digits — the union' },
    { name: 'int',         slug: 'int',         when: 'Actually parse to a number' },
    { name: 'float',       slug: 'float',       when: 'Parse decimals and scientific notation' },
  ],

  faq: [
    {
      q: 'What is the difference between isdigit, isnumeric, and isdecimal?',
      a: 'Three widths of \"numeric character\". isdecimal is narrowest — only characters that could be part of a base-10 integer literal. isdigit adds superscripts and a few decimal-like forms. isnumeric is widest — fractions, Roman numerals, and every Unicode-classified numeric character.',
    },
    {
      q: 'Why does \"3.14\".isnumeric() return False?',
      a: 'The decimal point is not a numeric character — it is punctuation. isnumeric checks per-character Unicode categorization, not whether the whole string parses. Use `float()` inside try/except for a \"parseable\" check.',
    },
    {
      q: 'Does isnumeric accept Roman numerals?',
      a: 'Yes — the Unicode Roman numeral characters (Ⅰ, Ⅱ, Ⅲ, Ⅳ, Ⅴ, ..., Ⅻ, Ⅼ, Ⅽ, Ⅾ, Ⅿ) all pass. Note this is the SINGLE-CHARACTER Roman numeral block, not letter combinations like "IV" (which are just letters and fail).',
    },
  ],

  history: [
    { version: '1.0', note: 'isnumeric() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — the widest numeric-character classifier in the is* family.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isnumeric',
    meta:  'str.isnumeric',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};