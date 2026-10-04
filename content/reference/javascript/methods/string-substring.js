// content/reference/javascript/methods/string-substring.js
//
// substr is consolidated here rather than given its own page: it is
// deprecated Annex B, and its only distinguishing feature — a LENGTH second
// argument — is best explained next to the two methods it gets confused with.

export const meta = {
  slug:        'string-substring',
  name:        'String.prototype.substring',
  signature:   'string.substring(start[, end])',
  blurb:       'Like slice, except it silently SWAPS a backwards range and ignores negative indices.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'string substring substr slice difference swap negative index extract range deprecated length javascript',
};

export const method = {
  slug:      'string-substring',
  name:      'String.prototype.substring',
  signature: 'string.substring(start[, end])',
  returns:   { type: 'string', desc: 'The characters between the two indices, end exclusive. Negative and NaN arguments are treated as 0, and the pair is reordered if start is greater than end.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The older sibling of slice, kept for compatibility. Its two differences are both forms of silent correction, which is why slice is the better default.',

  cheat: {
    commonCall: 's.substring(0, 10)',
    returns:    'a new string; end is exclusive',
    replaces:   'nothing — slice replaces IT',
    watchOut:   'negatives become 0, and a backwards range is swapped',
  },

  parameters: [
    { name: 'start', type: 'number', required: true,  default: null,     desc: 'Index to start at. Anything negative, or NaN, is treated as 0.' },
    { name: 'end',   type: 'number', required: false, default: 'length', desc: 'Index to stop BEFORE, also clamped to 0 at the bottom. If start is greater than end the two are swapped.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the source string', input: 'text' },
    { name: 'start', type: 'number', hint: 'start index',       input: 'number' },
    { name: 'end',   type: 'number', hint: 'end index (exclusive)', input: 'number' },
  ],
  demoTemplate: '{s}.substring({start}, {end})',
  cases: [
    { id: 'normal',    label: 'a normal range',      values: { s: 'abcdef', start: 1, end: 3 } },
    { id: 'swapped',   label: 'backwards → SWAPPED', values: { s: 'abcdef', start: 3, end: 1 } },
    { id: 'negative',  label: 'negative → zero (!)', values: { s: 'abcdef', start: -3, end: 6 } },
    { id: 'negend',    label: 'negative end → zero', values: { s: 'abcdef', start: 0, end: -1 } },
    { id: 'beyond',    label: 'past the end',        values: { s: 'abcdef', start: 2, end: 99 } },
  ],
  demoExplainer: "The first case behaves exactly like slice, which is why the two get confused — on well-formed input they are identical. The differences appear at the edges. Given (3, 1) substring quietly reorders the arguments and returns 'bc', where slice would return an empty string. And a negative index is not counted from the end; it is clamped to 0, so substring(-3) returns the WHOLE string while slice(-3) returns the last three characters. The fourth case is the trap in practice: substring(0, -1) means substring(0, 0), an empty string, where the same call on slice drops the final character.",

  patterns: [
    {
      name: 'Prefer slice',
      desc: 'Identical on valid input, predictable on invalid.',
      code: 'const part = s.slice(start, end);',
    },
    {
      name: 'When the swap is genuinely useful',
      desc: 'Two positions from a text selection, in unknown order.',
      code: 'const selected = text.substring(anchorOffset, focusOffset);',
    },
    {
      name: 'Extract by length instead',
      desc: 'What substr did, written with slice.',
      code: 'const chunk = s.slice(i, i + n);',
    },
  ],

  examples: [
    { title: 'Same as slice here',  code: "'abcdef'.substring(1, 3)", returns: "'bc'" },
    { title: 'Backwards is swapped',code: "'abcdef'.substring(3, 1)", returns: "'bc'" },
    { title: 'slice is empty',      code: "'abcdef'.slice(3, 1)",     returns: "''" },
    { title: 'Negative means 0',    code: "'abcdef'.substring(-3)",   returns: "'abcdef'" },
    { title: 'slice counts back',   code: "'abcdef'.slice(-3)",       returns: "'def'" },
    { title: 'substr takes a length',code: "'abcdef'.substr(1, 3)",   returns: "'bcd'" },
  ],

  pitfalls: [
    {
      name: 'substring(0, -1) does not drop the last character',
      desc: 'The single most costly difference. The -1 is clamped to 0, making the call substring(0, 0) — an empty string. The identical-looking slice(0, -1) does what was intended, so code ported between the two breaks silently.',
      wrong: { label: 'Empty', code: "'abcdef'.substring(0, -1)", output: "''" },
      fix:   { label: 'Use slice', code: "'abcdef'.slice(0, -1)", output: "'abcde'" },
    },
    {
      name: 'The argument swap hides bugs',
      desc: 'When start and end come from a calculation, a start that has drifted past the end is a logic error. substring quietly reorders and returns a plausible-looking string, so the mistake survives to production instead of surfacing as an obviously empty result.',
      wrong: { label: 'Looks fine', code: "'abcdef'.substring(3, 1)", output: "'bc'   // silently reordered" },
      fix:   { label: 'slice exposes it', code: "'abcdef'.slice(3, 1)", output: "''     // clearly wrong" },
    },
    {
      name: 'substr is a different method, and deprecated',
      desc: 'Its second argument is a LENGTH, not an end index, so substr(1, 3) returns three characters where substring(1, 3) returns two. It lives in Annex B — normatively optional, kept only because the web depends on it — and should not appear in new code.',
      wrong: { label: 'Length, not end', code: "'abcdef'.substr(1, 3)", output: "'bcd'   // three characters" },
      fix:   { label: 'slice with arithmetic', code: "'abcdef'.slice(1, 1 + 3)", output: "'bcd'" },
    },
    {
      name: 'NaN becomes 0, so a bad index is invisible',
      desc: 'An index that came out as NaN — from a failed parseInt, say — is coerced to 0 rather than throwing, so the result is a substring starting at the beginning. slice does the same, which is why neither method will tell you your arithmetic failed.',
      wrong: { label: 'Silently from 0', code: "'abcdef'.substring(NaN, 3)", output: "'abc'" },
      fix:   { label: 'Validate first',  code: 'if (Number.isInteger(i)) s.substring(i, 3);', output: 'explicit' },
    },
  ],

  when: {
    use: [
      'Two offsets whose order is genuinely unknown — a text selection',
      'Maintaining existing code that already uses it',
    ],
    avoid: [
      'New code → slice, which handles negatives and does not hide bugs',
      'Counting from the end → slice, since negatives are clamped here',
      'You have a start and a length → slice(i, i + n)',
      'substr specifically → deprecated Annex B, use slice',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the result',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-substring',
    memory:     'Like slice, engines may share the original buffer',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.slice',   slug: 'string-slice',   when: 'The better default — negatives work as expected' },
    { name: 'String.prototype.at',      slug: 'string-at',      when: 'A single character, including from the end' },
    { name: 'String.prototype.indexOf', slug: 'string-indexof', when: 'Find the offsets to extract between' },
    { name: 'String.prototype.split',   slug: 'string-split',   when: 'Cut on a delimiter instead of a position' },
  ],

  faq: [
    {
      q: 'What exactly is the difference between substring and slice?',
      a: 'Two things, both at the edges. First, if start is greater than end, substring swaps them while slice returns an empty string. Second, substring clamps negative indices to 0 while slice counts them from the end. On any call with sensible ascending non-negative indices the two are identical.',
      code: "'abcdef'.substring(3, 1);   // 'bc'   — swapped\n'abcdef'.slice(3, 1);       // ''     — empty\n'abcdef'.substring(-3);     // 'abcdef'\n'abcdef'.slice(-3);         // 'def'",
    },
    {
      q: 'Is substr safe to use?',
      a: 'It works in every browser and in Node, but it is specified in Annex B — the section for legacy features the web cannot shed. It will not be removed, yet linters flag it and its length-based second argument reads as a bug next to the other two methods. Prefer slice(i, i + n).',
    },
    {
      q: 'Why does JavaScript have three of these?',
      a: 'History. substring came from the first version of the language, substr arrived as a Microsoft extension and was later documented in Annex B, and slice was added in ES3 to mirror the array method. None could be removed without breaking the web.',
    },
    {
      q: 'Which should I use for truncating text?',
      a: 'slice. Out-of-range values are clamped by both, so neither throws, but slice also lets you trim from the end with a negative index — and if a length calculation goes negative, slice gives an obviously empty result rather than a silently reordered one.',
      code: 'const preview = text.slice(0, 100);',
    },
  ],

  history: [
    { version: 'ES1',     note: 'substring present from the first version of the language.' },
    { version: 'ES3',     note: 'slice added with negative-index support, superseding it for most uses.' },
    { version: 'ES5',     note: 'substr documented in Annex B as a legacy feature required for web compatibility.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring',
    meta:  'String.prototype.substring',
  },

};
