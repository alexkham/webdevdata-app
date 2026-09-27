// content/reference/javascript/methods/string-wellformed.js
//
// toWellFormed is consolidated here: the two were added together in the same
// proposal and only make sense as a pair — one detects, the other repairs.
//
// The demo builds its input from a CODE UNIT, because a text box cannot
// carry a lone surrogate intact.

export const meta = {
  slug:        'string-wellformed',
  name:        'String.prototype.isWellFormed',
  signature:   'string.isWellFormed()',
  blurb:       'Detect lone surrogates before they crash your encoder — and toWellFormed repairs them.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2024',
  searchTerms: 'string isWellFormed toWellFormed lone surrogate unpaired unicode replacement character encodeURI TextEncoder es2024 javascript',
};

export const method = {
  slug:      'string-wellformed',
  name:      'String.prototype.isWellFormed',
  signature: 'string.isWellFormed()',
  returns:   { type: 'boolean', desc: 'True if the string contains no unpaired surrogates. toWellFormed returns a copy with each lone surrogate replaced by U+FFFD.' },

  category:    'String method',
  version:     'ES2024',
  hasLiveDemo: true,

  subtitle: 'JavaScript strings can hold sequences that are not valid Unicode. These two methods let you find out before handing such a string to something that will throw.',

  cheat: {
    commonCall: 'if (!s.isWellFormed()) s = s.toWellFormed();',
    returns:    'boolean — and toWellFormed returns a repaired string',
    replaces:   'a hand-rolled surrogate-range regex',
    watchOut:   'repair is LOSSY — the broken character becomes U+FFFD',
  },

  parameters: [],

  demoParams: [
    { name: 'code', type: 'number', hint: 'a UTF-16 code unit', input: 'number' },
  ],
  demoTemplate: 'String.fromCharCode({code}).isWellFormed()',
  cases: [
    { id: 'letterA',  label: 'A (65) — fine',        values: { code: 65 } },
    { id: 'accent',   label: 'é (233) — fine',       values: { code: 233 } },
    { id: 'high',     label: 'lone HIGH surrogate (!)', values: { code: 55357 } },
    { id: 'low',      label: 'lone LOW surrogate (!)',  values: { code: 56832 } },
    { id: 'bmpmax',   label: '0xFFFF — fine',        values: { code: 65535 } },
  ],
  demoExplainer: "The demo builds a one-code-unit string, because a lone surrogate cannot survive being typed into a text box. Ordinary characters are well-formed. The two surrogate cases are not: 55357 and 56832 are the two halves of an emoji, and either one alone is an incomplete character that no valid Unicode encoding can represent. A string containing one is perfectly usable inside JavaScript — it has a length, you can slice it — and it will throw the moment you try to encode it as UTF-8.",

  patterns: [
    {
      name: 'Sanitise before encoding',
      desc: 'The main use — avoid a throw from encodeURIComponent.',
      code: 'const safe = s.isWellFormed() ? s : s.toWellFormed();',
    },
    {
      name: 'Repair unconditionally',
      desc: 'toWellFormed on a good string returns it unchanged.',
      code: 'const safe = s.toWellFormed();',
    },
    {
      name: 'Avoid creating them',
      desc: 'Slice by code point, not code unit.',
      code: "const head = [...s].slice(0, n).join('');",
    },
  ],

  examples: [
    { title: 'Ordinary text',     code: "'abc'.isWellFormed()",              returns: 'true' },
    { title: 'A whole emoji',     code: "'\\u{1F600}'.isWellFormed()",       returns: 'true' },
    { title: 'Half of one',       code: "'\\ud83d'.isWellFormed()",          returns: 'false' },
    { title: 'Repaired',          code: "'\\ud83d'.toWellFormed()",          returns: "'\\ufffd'" },
    { title: 'The replacement char', code: "'\\ud83d'.toWellFormed().charCodeAt(0).toString(16)", returns: "'fffd'" },
    { title: 'Created by slicing',code: "'\\u{1F600}'.slice(0, 1).isWellFormed()", returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'Slicing by code unit creates them',
      desc: 'This is where lone surrogates come from in practice. Truncating user text to a fixed length with slice, substring or a database column limit cuts an emoji in half, and the damaged string then breaks something downstream rather than at the point of the cut.',
      wrong: { label: 'Broken half', code: "'\\u{1F600}ab'.slice(0, 1).isWellFormed()", output: 'false' },
      fix:   { label: 'Slice code points', code: "[...'\\u{1F600}ab'].slice(0, 1).join('').isWellFormed()", output: 'true' },
    },
    {
      name: 'Repair is lossy and irreversible',
      desc: 'toWellFormed replaces each lone surrogate with U+FFFD, the replacement character. The original code unit is gone, so repairing is a last resort at a boundary — better to avoid creating the damage at all.',
      wrong: { label: 'Original lost', code: "'\\ud83d'.toWellFormed().charCodeAt(0).toString(16)", output: "'fffd'" },
      fix:   { label: 'Do not split pairs', code: "[...s].slice(0, n).join('')", output: 'nothing to repair' },
    },
    {
      name: 'The failure surfaces far from its cause',
      desc: 'A malformed string moves through your program without complaint until it reaches something that must encode it — encodeURIComponent, TextEncoder, JSON sent over the wire. The stack trace points at the encoder, not at the slice that caused it.',
      wrong: { label: 'Throws later', code: "encodeURIComponent('\\ud83d')", output: 'URIError: URI malformed' },
      fix:   { label: 'Check at the boundary', code: "encodeURIComponent('\\ud83d'.toWellFormed())", output: "'%EF%BF%BD'" },
    },
    {
      name: 'ES2024 — check your runtime',
      desc: 'Node 20+ and 2023-era browsers. Before that, detection meant a regex over the surrogate ranges, which is easy to get subtly wrong.',
      wrong: { label: 'Missing', code: 's.isWellFormed()', output: 'TypeError: s.isWellFormed is not a function' },
      fix:   { label: 'Regex fallback', code: '!/[\\ud800-\\udbff](?![\\udc00-\\udfff])|(?:[^\\ud800-\\udbff]|^)[\\udc00-\\udfff]/.test(s)', output: 'equivalent, fiddly' },
    },
  ],

  when: {
    use: [
      'Validating text before encoding it as UTF-8 or a URI',
      'Sanitising strings that were truncated by length elsewhere',
      'Guarding data that will be stored or transmitted',
      'Diagnosing a URIError that appears to come from nowhere',
    ],
    avoid: [
      'You control the slicing → iterate by code point and the problem cannot arise',
      'You want to count characters → spread, or Intl.Segmenter',
      'Checking for a specific character → includes or a regex',
      'Targeting runtimes older than 2023 → the surrogate-range regex',
    ],
  },

  notes: {
    complexity: 'O(n) — a single scan for unpaired surrogates',
    return:     'A boolean; toWellFormed returns a new string, or the original when already valid',
    cpython:    'V8: Builtins-string-iswellformed',
    memory:     'isWellFormed allocates nothing',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.codePointAt', slug: 'string-codepointat',   when: 'Inspecting the code points involved' },
    { name: 'String.prototype.slice',       slug: 'string-slice',         when: 'The operation that usually creates the damage' },
    { name: 'String.fromCodePoint',         slug: 'string-fromcodepoint', when: 'Building characters without breaking pairs' },
    { name: 'String.prototype.normalize',   slug: 'string-normalize',     when: 'The other Unicode-correctness concern' },
  ],

  faq: [
    {
      q: 'How does a string become malformed in the first place?',
      a: 'Almost always by cutting between the halves of a surrogate pair — slice, substring, a fixed-width column, or a length-limited input. It can also come from decoding corrupted data, or from fromCharCode with a surrogate value.',
      code: "'\\u{1F600}'.slice(0, 1);   // half an emoji",
    },
    {
      q: 'Why does encodeURIComponent throw on these?',
      a: 'Because it must produce UTF-8, and there is no UTF-8 encoding for an unpaired surrogate — it is not a valid character. The same applies to TextEncoder and to anything writing the string to a byte stream.',
      code: "encodeURIComponent(s.toWellFormed());   // safe",
    },
    {
      q: 'Should I just call toWellFormed everywhere?',
      a: 'It is cheap and returns the original string untouched when nothing is wrong, so at an output boundary that is reasonable. It is not a substitute for slicing correctly — repairing turns a broken emoji into a replacement character, which the user still sees as damage.',
    },
  ],

  history: [
    { version: 'ES2024', note: 'isWellFormed and toWellFormed added together to make surrogate validation a one-line check.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/isWellFormed',
    meta:  'String.prototype.isWellFormed',
  },

  tryInTool: [],
};
