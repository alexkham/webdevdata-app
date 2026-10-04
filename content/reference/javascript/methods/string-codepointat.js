// content/reference/javascript/methods/string-codepointat.js

export const meta = {
  slug:        'string-codepointat',
  name:        'String.prototype.codePointAt',
  signature:   'string.codePointAt(index)',
  blurb:       'The real code point at an index — emoji included, where charCodeAt gives you half.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string codePointAt charCodeAt unicode code point astral emoji surrogate pair BMP undefined es2015 javascript',
};

export const method = {
  slug:      'string-codepointat',
  name:      'String.prototype.codePointAt',
  signature: 'string.codePointAt(index)',
  returns:   { type: 'number | undefined', desc: 'The full Unicode code point starting at that index, up to 0x10FFFF. undefined when the index is out of range — not NaN.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The Unicode-aware replacement for charCodeAt. It reads a surrogate pair as one character, and returns undefined rather than NaN for a bad index.',

  cheat: {
    commonCall: 's.codePointAt(0)',
    returns:    'a number up to 0x10FFFF, or undefined',
    replaces:   'charCodeAt, for real text',
    watchOut:   'the INDEX is still in code units — astral characters take two',
  },

  parameters: [
    { name: 'index', type: 'number', required: false, default: '0', desc: 'Position in UTF-16 code units. If a high surrogate sits there, the pair is read as one code point; landing on the LOW half instead gives just that half.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the source string', input: 'text' },
    { name: 'index', type: 'number', hint: 'index',             input: 'number' },
  ],
  demoTemplate: '{s}.codePointAt({index})',
  cases: [
    { id: 'ascii',   label: 'capital A',          values: { s: 'ABC', index: 0 } },
    { id: 'accent',  label: 'an accented letter', values: { s: 'é', index: 0 } },
    { id: 'emoji',   label: 'an emoji (whole!)',  values: { s: '😀', index: 0 } },
    { id: 'lowhalf', label: 'the LOW half (!)',   values: { s: '😀', index: 1 } },
    { id: 'beyond',  label: 'out of range',       values: { s: 'abc', index: 99 } },
  ],
  demoExplainer: "For ordinary characters this matches charCodeAt exactly. The emoji is the reason the method exists: at index 0 it reads both code units and returns 128512, the real code point, where charCodeAt would return 55357 — a meaningless surrogate half. The fourth case shows the catch: the index is still measured in code units, so index 1 lands on the LOW half of the pair and returns that half alone. Out of range gives undefined rather than NaN, which is the other improvement over charCodeAt.",

  patterns: [
    {
      name: 'Iterate real characters',
      desc: 'for...of iterates by code point, so no index arithmetic.',
      code: 'for (const ch of s) console.log(ch.codePointAt(0));',
    },
    {
      name: 'Detect an astral character',
      desc: 'Anything above 0xFFFF takes two code units.',
      code: 'const isAstral = s.codePointAt(0) > 0xffff;',
    },
    {
      name: 'Count real characters',
      desc: 'length counts code units; spread counts code points.',
      code: 'const realLength = [...s].length;',
    },
  ],

  examples: [
    { title: 'Capital A',        code: "'A'.codePointAt(0)",          returns: '65' },
    { title: 'Whole emoji',      code: "'\\u{1F600}'.codePointAt(0)", returns: '128512' },
    { title: 'charCodeAt halves it', code: "'\\u{1F600}'.charCodeAt(0)", returns: '55357' },
    { title: 'The low half',     code: "'\\u{1F600}'.codePointAt(1)", returns: '56832' },
    { title: 'Out of range',     code: "'abc'.codePointAt(99)",       returns: 'undefined' },
    { title: 'charCodeAt gives NaN', code: "'abc'.charCodeAt(99)",    returns: 'NaN' },
  ],

  pitfalls: [
    {
      name: 'The index is still in code units',
      desc: 'This is the part people miss. codePointAt reads a whole character but is addressed by code unit, so walking a string with i++ lands on the low half of every astral character. Iterate with for...of or spread instead of indexing.',
      wrong: { label: 'Hits the low half', code: "'\\u{1F600}'.codePointAt(1)", output: '56832' },
      fix:   { label: 'Iterate by character', code: "[...'\\u{1F600}'].map(c => c.codePointAt(0))", output: '[128512]' },
    },
    {
      name: 'length is not the number of characters',
      desc: 'It counts UTF-16 code units, so a single emoji has length 2 and a flag emoji can have length 4 or more. Any limit enforced against length — a tweet counter, a database column — will cut real text short.',
      wrong: { label: 'Counts units', code: "'\\u{1F600}'.length", output: '2' },
      fix:   { label: 'Counts characters', code: "[...'\\u{1F600}'].length", output: '1' },
    },
    {
      name: 'Even code points are not user-perceived characters',
      desc: 'A family emoji or a flag is several code points joined by zero-width joiners, and an accented letter may be a base plus a combining mark. For "what the user sees as one character", Intl.Segmenter is the correct tool.',
      wrong: { label: 'Three code points', code: "[...'\\u{1F1EE}\\u{1F1F1}'].length", output: '2   // one flag' },
      fix:   { label: 'Segment it',        code: "[...new Intl.Segmenter().segment(s)].length", output: '1' },
    },
    {
      name: 'Pairing it with String.fromCharCode',
      desc: 'codePointAt returns values above 0xFFFF, and fromCharCode truncates to 16 bits — so the round trip silently destroys the character. Use String.fromCodePoint, its proper inverse.',
      wrong: { label: 'Truncated', code: 'String.fromCharCode(128512).codePointAt(0)', output: '62976   // the low 16 bits' },
      fix:   { label: 'Correct inverse', code: 'String.fromCodePoint(128512).codePointAt(0)', output: '128512' },
    },
  ],

  when: {
    use: [
      'Any code-point work on text that may contain emoji or non-Latin scripts',
      'Detecting whether a character is outside the BMP',
      'Encoding and escaping routines that must be Unicode-correct',
    ],
    avoid: [
      'You want the character itself → at, or for...of',
      'You want user-perceived characters → Intl.Segmenter',
      'Pure ASCII hashing where speed matters → charCodeAt is marginally simpler',
      'Comparing or sorting text → localeCompare',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A number or undefined; nothing is allocated',
    cpython:    'V8: Builtins-string-codepointat',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.charCodeAt',  slug: 'string-charcodeat',    when: 'UTF-16 code units, the 16-bit view' },
    { name: 'String.fromCodePoint',         slug: 'string-fromcodepoint', when: 'The inverse — code point back to string' },
    { name: 'String.prototype.normalize',   slug: 'string-normalize',     when: 'Composed versus decomposed accented forms' },
    { name: 'String.prototype.isWellFormed',slug: 'string-wellformed',    when: 'Detecting lone surrogates in a string' },
  ],

  faq: [
    {
      q: 'Why is the index in code units if the result is a code point?',
      a: 'Because JavaScript strings ARE sequences of UTF-16 code units — that is the underlying representation, and changing the indexing would break the language. codePointAt reads a pair when it finds one but cannot change how positions are counted. Iterating with for...of sidesteps the issue entirely.',
      code: 'for (const ch of s) { /* ch is a whole character */ }',
    },
    {
      q: 'How do I count characters properly?',
      a: 'Spread or Array.from gives code points, which is right for emoji and most scripts. For what a user would call a character — where a flag or a family emoji counts as one — use Intl.Segmenter with granularity "grapheme".',
      code: "[...s].length;\n[...new Intl.Segmenter(undefined, {granularity: 'grapheme'}).segment(s)].length;",
    },
    {
      q: 'What is a surrogate pair?',
      a: 'UTF-16 encodes code points above 0xFFFF as two units: a high surrogate in 0xD800–0xDBFF followed by a low surrogate in 0xDC00–0xDFFF. Neither half is a valid character alone, which is why splitting a string between them produces a replacement glyph.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'codePointAt, String.fromCodePoint and code-point iteration added together to make the language Unicode-correct.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt',
    meta:  'String.prototype.codePointAt',
  },

};
