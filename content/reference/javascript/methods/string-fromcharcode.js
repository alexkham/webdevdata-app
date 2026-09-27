// content/reference/javascript/methods/string-fromcharcode.js

export const meta = {
  slug:        'string-fromcharcode',
  name:        'String.fromCharCode',
  signature:   'String.fromCharCode(...codes)',
  blurb:       'Code units back to text — and it truncates anything above 0xFFFF to nonsense.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'String.fromCharCode fromCodePoint char code unit ascii utf-16 decode static truncate apply spread javascript',
};

export const method = {
  slug:      'string-fromcharcode',
  name:      'String.fromCharCode',
  signature: 'String.fromCharCode(...codes)',
  returns:   { type: 'string', desc: 'A string built from the given UTF-16 code units. Values above 0xFFFF are TRUNCATED to their low 16 bits rather than rejected.' },

  category:    'String static method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The inverse of charCodeAt, and 16-bit like its partner. For any code point above 0xFFFF it silently produces the wrong character — use fromCodePoint instead.',

  cheat: {
    commonCall: 'String.fromCharCode(65)',
    returns:    'a string of one character per code unit',
    replaces:   'nothing; it is the inverse of charCodeAt',
    watchOut:   'values above 0xFFFF are truncated, not rejected',
  },

  parameters: [
    { name: '...codes', type: 'number', required: false, default: 'none', desc: 'Any number of UTF-16 code units. Each is taken modulo 65536 — no error is raised for a larger value. With no arguments you get an empty string.' },
  ],

  demoParams: [
    { name: 'codes', type: 'number[]', hint: 'codes, comma separated', input: 'csv-num' },
  ],
  demoTemplate: 'String.fromCharCode(...{codes})',
  cases: [
    { id: 'hi',      label: 'spells Hi',         values: { codes: '72,105' } },
    { id: 'abc',     label: 'spells abc',        values: { codes: '97,98,99' } },
    { id: 'accent',  label: 'an accented letter',values: { codes: '233' } },
    { id: 'surrogate',label: 'a surrogate PAIR', values: { codes: '55357,56832' } },
    { id: 'empty',   label: 'no arguments',      values: { codes: '' } },
  ],
  demoExplainer: "Each number becomes one UTF-16 code unit, so 72 and 105 spell 'Hi'. The fourth case is how you build an emoji with this method — by supplying both halves of the surrogate pair yourself, which is exactly the arithmetic fromCodePoint does for you. Passing the single code point 128512 instead would NOT work: it is above 0xFFFF, so it gets truncated to its low 16 bits and yields an unrelated character with no warning at all.",

  patterns: [
    {
      name: 'Prefer fromCodePoint',
      desc: 'Handles any code point, and rejects invalid ones.',
      code: 'String.fromCodePoint(0x1f600);',
    },
    {
      name: 'Decode a byte array',
      desc: 'Fine for ASCII or Latin-1 data.',
      code: 'const text = String.fromCharCode(...bytes);',
    },
    {
      name: 'Large arrays need chunking',
      desc: 'Spreading a huge array overflows the call stack.',
      code: 'let out = "";\nfor (let i = 0; i < b.length; i += 8192)\n  out += String.fromCharCode(...b.subarray(i, i + 8192));',
    },
  ],

  examples: [
    { title: 'Spells Hi',        code: 'String.fromCharCode(72, 105)',       returns: "'Hi'" },
    { title: 'A surrogate pair', code: 'String.fromCharCode(55357, 56832)',  returns: "'\\u{1F600}'" },
    { title: 'Truncated, silently', code: 'String.fromCharCode(128512).codePointAt(0)', returns: '62976' },
    { title: 'fromCodePoint works',  code: 'String.fromCodePoint(128512).codePointAt(0)', returns: '128512' },
    { title: 'No arguments',     code: 'String.fromCharCode()',              returns: "''" },
    { title: 'Round trip',       code: "String.fromCharCode('A'.charCodeAt(0))", returns: "'A'" },
  ],

  pitfalls: [
    {
      name: 'Values above 0xFFFF are truncated without warning',
      desc: 'The worst kind of failure — no error, just a different character. Passing a real code point from codePointAt straight into fromCharCode mangles every emoji and every non-BMP script, and the corruption is only visible when someone looks at the output.',
      wrong: { label: 'Wrong character', code: 'String.fromCharCode(128512).codePointAt(0)', output: '62976' },
      fix:   { label: 'Use fromCodePoint', code: 'String.fromCodePoint(128512).codePointAt(0)', output: '128512' },
    },
    {
      name: 'Spreading a large array overflows the stack',
      desc: 'Every element becomes a function argument, and engines cap that at roughly 65 000 to 125 000. Decoding a megabyte buffer in one call throws RangeError, so chunk it or use TextDecoder.',
      wrong: { label: 'Too many arguments', code: 'String.fromCharCode(...hugeArray)', output: 'RangeError: Maximum call stack size exceeded' },
      fix:   { label: 'Use TextDecoder',    code: 'new TextDecoder().decode(bytes)', output: 'handles any size, and UTF-8' },
    },
    {
      name: 'It is a static, not an instance method',
      desc: 'String.fromCharCode(...), never s.fromCharCode(...). The same slip as with Array.from and Array.of.',
      wrong: { label: 'Not on instances', code: "'a'.fromCharCode(65)", output: 'TypeError: "a".fromCharCode is not a function' },
      fix:   { label: 'Call on String',   code: 'String.fromCharCode(65)', output: "'A'" },
    },
    {
      name: 'It is not a UTF-8 decoder',
      desc: 'Feeding it raw UTF-8 bytes produces mojibake, because each byte becomes its own character instead of combining into multi-byte sequences. TextDecoder is the correct tool for byte data of unknown encoding.',
      wrong: { label: 'Mojibake', code: 'String.fromCharCode(195, 169)', output: "'Ã©'   // meant to be 'é'" },
      fix:   { label: 'Decode properly', code: 'new TextDecoder().decode(new Uint8Array([195, 169]))', output: "'é'" },
    },
  ],

  when: {
    use: [
      'Building a string from UTF-16 code units you already have',
      'ASCII or Latin-1 byte data, where one byte is one character',
      'Round-tripping with charCodeAt',
    ],
    avoid: [
      'Any code point above 0xFFFF → fromCodePoint',
      'Decoding UTF-8 or unknown byte encodings → TextDecoder',
      'Very large arrays → chunk it, or TextDecoder',
      'You have characters, not numbers → concat or a template literal',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of arguments',
    return:     'A new string',
    cpython:    'V8: Builtins-string-fromcharcode',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'String.fromCodePoint',        slug: 'string-fromcodepoint', when: 'The version that handles every code point' },
    { name: 'String.prototype.charCodeAt', slug: 'string-charcodeat',    when: 'The inverse — string to code unit' },
    { name: 'String.prototype.codePointAt',slug: 'string-codepointat',   when: 'Reading full code points' },
    { name: 'String.raw',                  slug: 'string-raw',           when: 'The other String static' },
  ],

  faq: [
    {
      q: 'fromCharCode or fromCodePoint?',
      a: 'fromCodePoint, unless you specifically hold UTF-16 code units. It accepts the full Unicode range, builds surrogate pairs for you, and throws RangeError on an invalid value instead of silently truncating.',
      code: 'String.fromCodePoint(0x1f600);   // an emoji\nString.fromCharCode(0x1f600);    // a different character entirely',
    },
    {
      q: 'Why does my decoded text look like Ã© instead of é?',
      a: 'Because you decoded UTF-8 bytes one at a time. In UTF-8 é is two bytes, 195 and 169, and fromCharCode turns each into its own Latin-1 character. TextDecoder understands multi-byte sequences.',
      code: 'new TextDecoder().decode(bytes);',
    },
    {
      q: 'How do I build a string from a big byte array?',
      a: 'Use TextDecoder — it is faster, handles encodings properly, and has no argument limit. If you must use fromCharCode, spread in chunks of a few thousand and concatenate.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'fromCharCode present from the first version, when strings were assumed to be UCS-2.' },
    { version: 'ES2015', note: 'fromCodePoint added to build characters beyond the BMP correctly.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode',
    meta:  'String.fromCharCode',
  },

  tryInTool: [],
};
