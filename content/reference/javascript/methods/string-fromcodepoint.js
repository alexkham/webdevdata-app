// content/reference/javascript/methods/string-fromcodepoint.js

export const meta = {
  slug:        'string-fromcodepoint',
  name:        'String.fromCodePoint',
  signature:   'String.fromCodePoint(...codePoints)',
  blurb:       'Build any character from its code point — emoji included, and it throws on nonsense.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'String.fromCodePoint fromCharCode code point unicode emoji astral surrogate RangeError static es2015 javascript',
};

export const method = {
  slug:      'string-fromcodepoint',
  name:      'String.fromCodePoint',
  signature: 'String.fromCodePoint(...codePoints)',
  returns:   { type: 'string', desc: 'A string built from the given code points, with surrogate pairs constructed automatically. Throws RangeError for anything outside 0 to 0x10FFFF.' },

  category:    'String static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The Unicode-correct counterpart to fromCharCode. It accepts the full code point range, encodes surrogate pairs for you, and refuses invalid input instead of truncating it.',

  cheat: {
    commonCall: 'String.fromCodePoint(0x1f600)',
    returns:    'a string — one character per code point',
    replaces:   'fromCharCode, for anything beyond ASCII',
    watchOut:   'an out-of-range value is a RangeError, unlike fromCharCode',
  },

  parameters: [
    { name: '...codePoints', type: 'number', required: false, default: 'none', desc: 'Any number of Unicode code points from 0 to 0x10FFFF. Non-integers and out-of-range values throw RangeError. With no arguments you get an empty string.' },
  ],

  demoParams: [
    { name: 'codes', type: 'number[]', hint: 'code points, comma separated', input: 'csv-num' },
  ],
  demoTemplate: 'String.fromCodePoint(...{codes})',
  cases: [
    { id: 'hi',      label: 'spells Hi',          values: { codes: '72,105' } },
    { id: 'emoji',   label: 'an emoji (works!)',  values: { codes: '128512' } },
    { id: 'accent',  label: 'an accented letter', values: { codes: '233' } },
    { id: 'mixed',   label: 'ASCII plus emoji',   values: { codes: '104,105,128512' } },
    { id: 'empty',   label: 'no arguments',       values: { codes: '' } },
  ],
  demoExplainer: "The second case is the whole difference: the single code point 128512 produces a complete emoji, where fromCharCode would truncate it to its low 16 bits and give an unrelated character. The surrogate pair is constructed internally, so the resulting string has length 2 even though it is one character — the encoding detail is handled, not hidden. ASCII values behave identically to fromCharCode, which is why the two are easy to confuse until non-BMP text appears.",

  patterns: [
    {
      name: 'Build a character from a hex code point',
      desc: 'The form you see in Unicode charts.',
      code: 'String.fromCodePoint(0x1f600);',
    },
    {
      name: 'Round-trip with codePointAt',
      desc: 'The two are proper inverses.',
      code: 'String.fromCodePoint(s.codePointAt(0)) === [...s][0];',
    },
    {
      name: 'An escape in a literal, when it is constant',
      desc: 'No function call needed for a known character.',
      code: "const grin = '\\u{1F600}';",
    },
  ],

  examples: [
    { title: 'An emoji',          code: 'String.fromCodePoint(128512)',            returns: "'\\u{1F600}'" },
    { title: 'Its length',        code: 'String.fromCodePoint(128512).length',     returns: '2' },
    { title: 'fromCharCode fails',code: 'String.fromCharCode(128512).codePointAt(0)', returns: '62976' },
    { title: 'Plain ASCII',       code: 'String.fromCodePoint(72, 105)',           returns: "'Hi'" },
    { title: 'Out of range throws',code: 'String.fromCodePoint(0x110000)',         returns: 'RangeError: Invalid code point 1114112' },
    { title: 'No arguments',      code: 'String.fromCodePoint()',                  returns: "''" },
  ],

  pitfalls: [
    {
      name: 'The result length is not the number of arguments',
      desc: 'Each astral code point becomes TWO code units, so one emoji gives a string of length 2. Code that assumes one argument means one unit of length — a fixed-width buffer, an index calculation — is wrong for exactly the characters this method was added to support.',
      wrong: { label: 'Length is 2', code: 'String.fromCodePoint(128512).length', output: '2' },
      fix:   { label: 'Count code points', code: '[...String.fromCodePoint(128512)].length', output: '1' },
    },
    {
      name: 'It throws where fromCharCode truncates',
      desc: 'A stricter contract, and a better one — but it means code migrated from fromCharCode can start throwing on input it previously mangled silently. That is the bug surfacing, not a new one.',
      wrong: { label: 'Throws', code: 'String.fromCodePoint(0x110000)', output: 'RangeError: Invalid code point 1114112' },
      fix:   { label: 'Validate first', code: 'if (cp >= 0 && cp <= 0x10ffff) String.fromCodePoint(cp);', output: 'guarded' },
    },
    {
      name: 'Non-integers throw too',
      desc: 'A code point computed by division or parsed loosely may arrive fractional, and this method rejects it rather than rounding. Round or truncate deliberately before calling.',
      wrong: { label: 'Rejected', code: 'String.fromCodePoint(65.5)', output: 'RangeError: Invalid code point 65.5' },
      fix:   { label: 'Truncate first', code: 'String.fromCodePoint(Math.trunc(65.5))', output: "'A'" },
    },
    {
      name: 'It is a static, not an instance method',
      desc: 'String.fromCodePoint(...), never s.fromCodePoint(...).',
      wrong: { label: 'Not on instances', code: "'a'.fromCodePoint(65)", output: 'TypeError: "a".fromCodePoint is not a function' },
      fix:   { label: 'Call on String',   code: 'String.fromCodePoint(65)', output: "'A'" },
    },
  ],

  when: {
    use: [
      'Building characters from code points of any value',
      'Anything involving emoji or non-Latin scripts',
      'Round-tripping with codePointAt',
      'Decoding escape sequences from data',
    ],
    avoid: [
      'The character is a known constant → a \\u{...} escape in a literal',
      'You hold UTF-16 code units already → fromCharCode is the matching inverse',
      'Decoding byte data → TextDecoder',
      'Very large arrays → chunk the spread, or TextDecoder',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of code points',
    return:     'A new string',
    cpython:    'V8: Builtins-string-fromcodepoint',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'String.fromCharCode',          slug: 'string-fromcharcode', when: 'UTF-16 code units, and its truncation trap' },
    { name: 'String.prototype.codePointAt', slug: 'string-codepointat',  when: 'The inverse — string to code point' },
    { name: 'String.prototype.normalize',   slug: 'string-normalize',    when: 'Composed versus decomposed forms' },
    { name: 'String.prototype.isWellFormed',slug: 'string-wellformed',   when: 'Checking for unpaired surrogates' },
  ],

  faq: [
    {
      q: 'When would I use this over a \\u{...} escape?',
      a: 'When the code point is computed or comes from data. For a constant character the escape is clearer and needs no function call — the method exists for the dynamic case.',
      code: "const ch = '\\u{1F600}';            // constant\nconst ch2 = String.fromCodePoint(cp); // computed",
    },
    {
      q: 'Why does one emoji give length 2?',
      a: 'Because length counts UTF-16 code units and an astral character needs two of them. The method builds the surrogate pair correctly; the length property simply reports the encoding rather than the character count.',
      code: '[...String.fromCodePoint(128512)].length;   // 1',
    },
    {
      q: 'Can I pass a lone surrogate?',
      a: 'Yes — values in 0xD800 to 0xDFFF are valid code points and are accepted, producing a string that is not well-formed. isWellFormed will tell you, and toWellFormed will replace it.',
      code: 'String.fromCodePoint(0xd83d).isWellFormed();   // false',
    },
  ],

  history: [
    { version: 'ES2015', note: 'fromCodePoint added alongside codePointAt to make character construction Unicode-correct.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint',
    meta:  'String.fromCodePoint',
  },

  tryInTool: [],
};
