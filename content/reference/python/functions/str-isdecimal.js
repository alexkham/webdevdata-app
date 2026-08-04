// content/reference/python/functions/str-isdecimal.js
//
// Slug is type-prefixed: `isdecimal` is a str method.

export const meta = {
  slug:        'str-isdecimal',
  name:        'str.isdecimal',
  signature:   'str.isdecimal()',
  blurb:       'The narrowest numeric check — decimal digits only, no superscripts, no fractions.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'isdecimal decimal digit check narrow ascii unicode strict number position',
};

export const method = {
  slug:      'str-isdecimal',
  name:      'str.isdecimal',
  signature: 'str.isdecimal()',
  returns:   { type: 'bool', desc: 'True if every character is a decimal digit (Unicode category Nd) AND the string is non-empty. Narrower than isdigit (which also accepts superscripts) and much narrower than isnumeric (which accepts Roman numerals, fractions, etc.).' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'The strictest &quot;is this a base-10 integer literal&quot; check — the narrowest of the numeric-check trio.',

  cheat: {
    commonCall: 'if s.isdecimal():',
    returns:    'True or False',
    replaces:   'the manual `all(c in "0123456789" for c in s)` — but also accepts non-ASCII decimal digits',
    watchOut:   '"3.14".isdecimal() is False (the dot!); "-42".isdecimal() is False (the minus!)',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'string', type: 'str', hint: 'the string to test', input: 'text' },
  ],
  cases: [
    { id: 'ascii-digits', label: 'ASCII digits',      values: { string: '12345' } },
    { id: 'arabic',       label: 'Arabic-Indic',       values: { string: '٥٦٧' } },
    { id: 'devanagari',   label: 'Devanagari',         values: { string: '१२३' } },
    { id: 'superscript',  label: 'superscript',        values: { string: '²' } },
    { id: 'roman',        label: 'Roman numeral',      values: { string: 'Ⅳ' } },
    { id: 'fraction',     label: 'fraction ½',         values: { string: '½' } },
    { id: 'decimal-point',label: 'has decimal point',  values: { string: '3.14' } },
    { id: 'negative',     label: 'negative',           values: { string: '-42' } },
    { id: 'mixed',        label: 'digits + letter',    values: { string: '123a' } },
    { id: 'empty',        label: 'empty',              values: { string: '' } },
  ],
  demoExplainer: 'isdecimal() is the STRICTEST of the numeric-check trio. It accepts ONLY characters Unicode categorizes as decimal digits (category Nd) — that includes ASCII 0-9 AND non-Latin decimal digit systems (Arabic-Indic ٥٦٧, Devanagari १२३). Everything else fails: superscripts, Roman numerals, fractions, decimal points, signs, whitespace, letters. Same rule as isdigit and isnumeric for the empty case: returns False.',

  patterns: [
    {
      name: 'Strict integer-literal check',
      desc: 'Reject anything that is not a base-10 integer.',
      code: 'if s.isdecimal():\n    value = int(s)',
    },
    {
      name: 'The three widths',
      desc: 'isdecimal is narrowest, isdigit is middle, isnumeric is widest.',
      code: '"²".isdecimal()      # False (superscript)\n"²".isdigit()        # True\n"²".isnumeric()      # True',
    },
    {
      name: '&quot;Can I safely call int() on this?&quot;',
      desc: 'isdecimal is a necessary but not sufficient condition — int() also accepts leading whitespace and a sign.',
      code: '# safe int() if isdecimal is True (no whitespace or sign)\nif s.isdecimal():\n    value = int(s)   # will not raise',
    },
  ],

  examples: [
    { title: 'ASCII digits',       code: '"12345".isdecimal()',     returns: 'True' },
    { title: 'Arabic-Indic',       code: '"٥٦٧".isdecimal()',        returns: 'True' },
    { title: 'Devanagari',         code: '"१२३".isdecimal()',        returns: 'True' },
    { title: 'Superscript',        code: '"²".isdecimal()',          returns: 'False  # not a decimal digit' },
    { title: 'Roman numeral',      code: '"Ⅳ".isdecimal()',          returns: 'False' },
    { title: 'Fraction',           code: '"½".isdecimal()',          returns: 'False' },
    { title: 'Decimal point',      code: '"3.14".isdecimal()',       returns: 'False  # the dot' },
    { title: 'Negative',           code: '"-42".isdecimal()',        returns: 'False  # the minus' },
    { title: 'Empty is False',     code: '"".isdecimal()',           returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'isdecimal, isdigit, isnumeric — three widths of &quot;numeric&quot;',
      desc: 'The three checks nest. isdecimal is narrowest (Unicode category Nd only). isdigit adds a few more (like superscripts). isnumeric is widest (Roman numerals, fractions, everything numeric).',
      wrong: { label: 'Wrong tool for the job', code: '"²".isdecimal()   # want True?', output: 'False — need isdigit or isnumeric' },
      fix:   { label: 'Match the tool to the input', code: '"²".isdigit()\n"½".isnumeric()', output: 'True' },
    },
    {
      name: 'Decimal points fail this check',
      desc: 'The decimal point itself is not a decimal DIGIT — it is punctuation. Same with the minus sign, plus sign, comma, and any other non-digit character.',
      wrong: { label: 'Punctuation rejected', code: '"3.14".isdecimal()', output: 'False' },
      fix:   { label: 'Parse instead',        code: 'try:\n    float(s)\n    is_number = True\nexcept ValueError:\n    is_number = False', output: 'True on "3.14"' },
    },
    {
      name: 'Empty string returns False',
      desc: 'Same rule across the numeric-check trio — empty is always False. Unlike isascii and isprintable, which return True on empty.',
      wrong: { label: 'Wrong expectation', code: '"".isdecimal()', output: 'False' },
      fix:   { label: 'Guard first',        code: 's and s.isdecimal()', output: 'covers the empty case' },
    },
    {
      name: 'Non-ASCII decimal digits still pass',
      desc: 'isdecimal accepts ANY Unicode decimal digit — not just ASCII 0-9. This is usually fine for validation but might be surprising if you strictly meant &quot;ASCII digits only&quot;.',
      wrong: { label: 'Non-Latin passes',   code: '"٥٦٧".isdecimal()', output: 'True' },
      fix:   { label: 'ASCII-only',          code: 's.isascii() and s.isdecimal()', output: 'False on "٥٦٧"' },
    },
  ],

  when: {
    use: [
      'Strict base-10 integer literal validation',
      'When you want to call int() safely without a try/except',
      'Filtering tokens to just decimal-digit sequences',
      '&quot;Is this a simple number?&quot; questions where signs and decimals are separate',
    ],
    avoid: [
      'Signed or decimal-pointed numbers → use float() with try/except',
      'Superscripts must pass → isdigit',
      'Roman numerals / fractions must pass → isnumeric',
      'ASCII-only digits → combine with isascii',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'bool — True or False',
    cpython:    'Objects/unicodeobject.c :: unicode_isdecimal',
    memory:     'No allocation',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'isdigit',        slug: 'isdigit',        when: 'Accepts superscripts too — middle width' },
    { name: 'str.isnumeric',  slug: 'str-isnumeric',  when: 'Accepts Roman numerals and fractions — widest' },
    { name: 'int',            slug: 'int',            when: 'Actually parse to an integer' },
    { name: 'str.isalnum',    slug: 'str-isalnum',    when: 'Letters or digits (widest possible &quot;alphanumeric&quot;)' },
  ],

  faq: [
    {
      q: 'What is the difference between isdecimal, isdigit, and isnumeric?',
      a: 'Three widths of numeric character. isdecimal is narrowest — only Unicode category Nd (decimal digits). isdigit adds superscripts and a few compatibility characters. isnumeric is widest — fractions, Roman numerals, every Unicode-classified numeric character.',
    },
    {
      q: 'If isdecimal is True, can I safely call int()?',
      a: 'Yes — for non-empty strings that pass isdecimal, int() will always succeed. isdecimal rejects the whitespace and sign that would otherwise be needed as a stronger check.',
    },
    {
      q: 'Are non-ASCII digits considered decimal?',
      a: 'Yes. Arabic-Indic (٠١٢...), Devanagari (०१२...), Bengali, and many other scripts have decimal digit blocks that pass isdecimal. If you want ASCII-only, combine with .isascii().',
    },
  ],

  history: [
    { version: '1.0', note: 'isdecimal() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support — accepts every character in Unicode category Nd.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.isdecimal',
    meta:  'str.isdecimal',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};