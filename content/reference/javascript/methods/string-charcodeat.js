// content/reference/javascript/methods/string-charcodeat.js

export const meta = {
  slug:        'string-charcodeat',
  name:        'String.prototype.charCodeAt',
  signature:   'string.charCodeAt(index)',
  blurb:       'The UTF-16 code unit at an index — which is half an emoji, and NaN when out of range.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'string charCodeAt codePointAt character code ascii utf-16 code unit surrogate NaN ordinal javascript',
};

export const method = {
  slug:      'string-charcodeat',
  name:      'String.prototype.charCodeAt',
  signature: 'string.charCodeAt(index)',
  returns:   { type: 'number', desc: 'An integer from 0 to 65535 — the UTF-16 code unit at that index. NaN if the index is out of range, which is the trap.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The original character-code method, and a 16-bit one. For anything outside the Basic Multilingual Plane it returns half a character, which is why codePointAt was added.',

  cheat: {
    commonCall: 's.charCodeAt(0)',
    returns:    'a number 0–65535, or NaN',
    replaces:   'nothing; the inverse is String.fromCharCode',
    watchOut:   'out of range is NaN, and NaN !== NaN',
  },

  parameters: [
    { name: 'index', type: 'number', required: false, default: '0', desc: 'Position of the code unit. Negative or beyond the end gives NaN rather than throwing. It does NOT count from the end.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the source string', input: 'text' },
    { name: 'index', type: 'number', hint: 'index',             input: 'number' },
  ],
  demoTemplate: '{s}.charCodeAt({index})',
  cases: [
    { id: 'upperA',  label: 'capital A',        values: { s: 'ABC', index: 0 } },
    { id: 'lowerA',  label: 'lowercase a',      values: { s: 'abc', index: 0 } },
    { id: 'digit',   label: 'the digit 0',      values: { s: '0', index: 0 } },
    { id: 'accent',  label: 'an accented letter',values: { s: 'é', index: 0 } },
    { id: 'beyond',  label: 'out of range → NaN (!)', values: { s: 'abc', index: 99 } },
  ],
  demoExplainer: "Capital A is 65 and lowercase a is 97, a difference of 32 — the bit that old case-conversion tricks flipped. The digit 0 is 48, which is why subtracting 48 converts a digit character to its value. The out-of-range case returns NaN, not undefined and not an error, and NaN is not equal to itself — so a check like charCodeAt(i) === NaN is always false. Use Number.isNaN, or use codePointAt, which returns undefined instead.",

  patterns: [
    {
      name: 'Digit character to value',
      desc: 'The classic offset trick.',
      code: "const value = ch.charCodeAt(0) - '0'.charCodeAt(0);",
    },
    {
      name: 'Simple hash over a string',
      desc: 'Where the code unit is just a number to mix.',
      code: 'let h = 0;\nfor (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;',
    },
    {
      name: 'Prefer codePointAt for real characters',
      desc: 'Handles astral characters correctly.',
      code: 'const cp = s.codePointAt(0);',
    },
  ],

  examples: [
    { title: 'Capital A',       code: "'A'.charCodeAt(0)",        returns: '65' },
    { title: 'Out of range',    code: "'abc'.charCodeAt(99)",     returns: 'NaN' },
    { title: 'codePointAt differs', code: "'abc'.codePointAt(99)", returns: 'undefined' },
    { title: 'Half an emoji',   code: "'\\u{1F600}'.charCodeAt(0)", returns: '55357' },
    { title: 'The whole one',   code: "'\\u{1F600}'.codePointAt(0)", returns: '128512' },
    { title: 'Emoji length',    code: "'\\u{1F600}'.length",      returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Out of range is NaN, and NaN breaks comparisons',
      desc: 'Every comparison against NaN is false, including equality with itself, so an out-of-range read propagates silently through arithmetic rather than failing loudly. A hash loop that runs one index too far quietly produces NaN for every subsequent step.',
      wrong: { label: 'Never true', code: "'abc'.charCodeAt(99) === NaN", output: 'false' },
      fix:   { label: 'Test properly', code: "Number.isNaN('abc'.charCodeAt(99))", output: 'true' },
    },
    {
      name: 'It returns half an astral character',
      desc: 'An emoji occupies two code units, and charCodeAt gives you one of them — a lone surrogate in the 0xD800–0xDFFF range that means nothing on its own. codePointAt reads the pair and returns the real code point.',
      wrong: { label: 'A surrogate half', code: "'\\u{1F600}'.charCodeAt(0)", output: '55357' },
      fix:   { label: 'The code point',   code: "'\\u{1F600}'.codePointAt(0)", output: '128512' },
    },
    {
      name: 'Negative indices do not count from the end',
      desc: 'Unlike at and slice, a negative index here is simply out of range and gives NaN. There is no negative-index form of this method.',
      wrong: { label: 'NaN', code: "'abc'.charCodeAt(-1)", output: 'NaN' },
      fix:   { label: 'Use at first', code: "'abc'.at(-1).charCodeAt(0)", output: '99' },
    },
    {
      name: 'Case conversion by arithmetic only works for ASCII',
      desc: 'Adding or subtracting 32 flips case for the 26 unaccented Latin letters and corrupts everything else. toLowerCase and toUpperCase know the Unicode rules; arithmetic does not.',
      wrong: { label: 'Wrong for accents', code: "String.fromCharCode('É'.charCodeAt(0) + 32)", output: "'é' only by luck — fails for most scripts" },
      fix:   { label: 'Use the method',    code: "'É'.toLowerCase()", output: "'é'" },
    },
  ],

  when: {
    use: [
      'Hashing or checksums, where a 16-bit unit is all you need',
      'ASCII arithmetic — digit values, simple ranges',
      'Interoperating with APIs that work in UTF-16 code units',
    ],
    avoid: [
      'Text that may contain emoji or other astral characters → codePointAt',
      'You want the character, not its number → at or charAt',
      'Case conversion → toLowerCase and toUpperCase',
      'Comparing strings → localeCompare',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A number, or NaN; nothing is allocated',
    cpython:    'V8: Builtins-string-charcodeat',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.codePointAt', slug: 'string-codepointat',  when: 'The full code point, emoji included' },
    { name: 'String.fromCharCode',          slug: 'string-fromcharcode', when: 'The inverse — number back to string' },
    { name: 'String.prototype.at',          slug: 'string-at',           when: 'The character itself rather than its code' },
    { name: 'String.prototype.normalize',   slug: 'string-normalize',    when: 'Accented text, where code units differ by form' },
  ],

  faq: [
    {
      q: 'charCodeAt or codePointAt?',
      a: 'codePointAt for anything involving real text — it handles surrogate pairs and returns undefined rather than NaN when out of range. charCodeAt when you genuinely want UTF-16 code units, which is mostly hashing and low-level encoding work.',
      code: "'\\u{1F600}'.charCodeAt(0);   // 55357 — half\n'\\u{1F600}'.codePointAt(0);  // 128512 — whole",
    },
    {
      q: 'Why NaN rather than undefined?',
      a: 'Because the method is specified to return a number, and NaN is the numeric "no value". It is an unfortunate choice — NaN propagates silently through arithmetic — and codePointAt, added in ES2015, returns undefined instead.',
    },
    {
      q: 'How do I get the character back from a code?',
      a: 'String.fromCharCode for a code unit, String.fromCodePoint for a full code point. They pair with charCodeAt and codePointAt respectively, and mixing them across the pair is how astral characters get mangled.',
      code: "String.fromCharCode(65);        // 'A'\nString.fromCodePoint(128512);   // an emoji",
    },
  ],

  history: [
    { version: 'ES1',    note: 'charCodeAt present from the first version, when strings were assumed to be UCS-2.' },
    { version: 'ES2015', note: 'codePointAt and String.fromCodePoint added to handle characters beyond the BMP.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt',
    meta:  'String.prototype.charCodeAt',
  },

};
