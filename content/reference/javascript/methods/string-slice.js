// content/reference/javascript/methods/string-slice.js

export const meta = {
  slug:        'string-slice',
  name:        'String.prototype.slice',
  signature:   'string.slice(start[, end])',
  blurb:       'Extract a substring — the one of the three that understands negative indices.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string slice substring substr extract cut negative index end last characters range javascript',
};

export const method = {
  slug:      'string-slice',
  name:      'String.prototype.slice',
  signature: 'string.slice(start[, end])',
  returns:   { type: 'string', desc: 'The characters from start up to but NOT including end. An empty string when the range is backwards or out of bounds — it never throws.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The one to reach for by default. JavaScript has three substring methods; this is the only one that handles negative indices, and the only one whose name matches the array method that behaves the same way.',

  cheat: {
    commonCall: 's.slice(0, 10)',
    returns:    'a new string; end is exclusive',
    replaces:   'substring and the deprecated substr',
    watchOut:   'a backwards range gives "", it does not swap the arguments',
  },

  parameters: [
    { name: 'start', type: 'number', required: true,  default: null,     desc: 'Index to start at. Negative counts back from the end, so -3 is the third character from the right.' },
    { name: 'end',   type: 'number', required: false, default: 'length', desc: 'Index to stop BEFORE. Also accepts negatives. Omitted, the slice runs to the end of the string.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the source string', input: 'text' },
    { name: 'start', type: 'number', hint: 'start index',       input: 'number' },
    { name: 'end',   type: 'number', hint: 'end index (exclusive)', input: 'number' },
  ],
  demoTemplate: '{s}.slice({start}, {end})',
  cases: [
    { id: 'middle',   label: 'a middle range',     values: { s: 'abcdef', start: 1, end: 3 } },
    { id: 'negative', label: 'negative start',     values: { s: 'abcdef', start: -3, end: 6 } },
    { id: 'negend',   label: 'negative end',       values: { s: 'abcdef', start: 0, end: -1 } },
    { id: 'backwards',label: 'backwards range (!)',values: { s: 'abcdef', start: 3, end: 1 } },
    { id: 'beyond',   label: 'past the end',       values: { s: 'abcdef', start: 2, end: 99 } },
  ],
  demoExplainer: "The end index is exclusive, so slice(1, 3) gives two characters, not three — the same convention as every other range in the language. Negative indices count from the right, which is what makes slice(0, -1) the idiomatic way to drop the last character. The backwards case is the important contrast with substring: given a start after the end, slice returns an empty string, while substring silently swaps the two arguments and returns a result. Indices past the end are clamped rather than throwing.",

  patterns: [
    {
      name: 'Truncate to a maximum length',
      desc: 'Out-of-range is clamped, so no length check is needed.',
      code: "const short = title.slice(0, 80);",
    },
    {
      name: 'Drop the last character',
      desc: 'The classic negative-end use.',
      code: 'const withoutComma = line.slice(0, -1);',
    },
    {
      name: 'Take the file extension',
      desc: 'Negative start, counted from the right.',
      code: "const ext = name.slice(name.lastIndexOf('.') + 1);",
    },
  ],

  examples: [
    { title: 'A middle range',    code: "'abcdef'.slice(1, 3)",   returns: "'bc'" },
    { title: 'To the end',        code: "'abcdef'.slice(2)",      returns: "'cdef'" },
    { title: 'Last three',        code: "'abcdef'.slice(-3)",     returns: "'def'" },
    { title: 'Drop the last',     code: "'abcdef'.slice(0, -1)",  returns: "'abcde'" },
    { title: 'Backwards is empty',code: "'abcdef'.slice(3, 1)",   returns: "''" },
    { title: 'substring swaps',   code: "'abcdef'.substring(3, 1)", returns: "'bc'" },
  ],

  pitfalls: [
    {
      name: 'A backwards range returns an empty string',
      desc: 'No error, no swap — just "". When the indices come from a computation this shows up as a mysteriously blank value rather than an exception, so a start that has drifted past the end is easy to miss.',
      wrong: { label: 'Silently empty', code: "'abcdef'.slice(3, 1)", output: "''" },
      fix:   { label: 'Order them',     code: "'abcdef'.slice(Math.min(a, b), Math.max(a, b))", output: "'bc'" },
    },
    {
      name: 'Confusing it with substring',
      desc: 'They differ on exactly two things: substring swaps a backwards range instead of returning empty, and substring treats every negative index as 0. Mixing them up produces results that look plausible on well-formed input and wrong on edge cases.',
      wrong: { label: 'Negative ignored', code: "'abcdef'.substring(-3)", output: "'abcdef'   // the whole string" },
      fix:   { label: 'slice counts back', code: "'abcdef'.slice(-3)",    output: "'def'" },
    },
    {
      name: 'It cuts by code unit, not character',
      desc: 'Slicing through an emoji or other astral character leaves a lone surrogate — a broken half-character that renders as a replacement glyph. Truncating user text to a fixed length is exactly where this bites.',
      wrong: { label: 'Splits a pair', code: "'\\u{1F600}ab'.slice(0, 1).length", output: '1   // half an emoji' },
      fix:   { label: 'Slice code points', code: "[...'\\u{1F600}ab'].slice(0, 1).join('')", output: "'\\u{1F600}'" },
    },
    {
      name: 'It returns a new string and changes nothing',
      desc: 'As with every string method. Strings are immutable, so a bare slice call is a no-op — the result has to be assigned.',
      wrong: { label: 'Discarded', code: "let s = 'abc';\ns.slice(1);\ns", output: "'abc'" },
      fix:   { label: 'Assign it', code: "let s = 'abc';\ns = s.slice(1);\ns", output: "'bc'" },
    },
  ],

  when: {
    use: [
      'Any substring extraction — this is the sensible default',
      'Taking characters from the end with a negative index',
      'Truncating to a maximum length without a bounds check',
      'Matching the behaviour of Array.prototype.slice',
    ],
    avoid: [
      'You want the arguments auto-ordered → substring, though that is rarely a feature',
      'You want a length rather than an end index → the deprecated substr, or slice(i, i + n)',
      'The text may contain emoji and you are truncating → spread to an array first',
      'You want to split on a delimiter → split',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the slice',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-slice',
    memory:     'Engines often use a sliced-string representation that shares the original buffer',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.substring', slug: 'string-substring', when: 'The variant that swaps a backwards range' },
    { name: 'String.prototype.at',        slug: 'string-at',        when: 'One character, including from the end' },
    { name: 'String.prototype.indexOf',   slug: 'string-indexof',   when: 'Find the index to slice around' },
    { name: 'String.prototype.split',     slug: 'string-split',     when: 'Cut on a delimiter rather than a position' },
  ],

  faq: [
    {
      q: 'slice, substring or substr?',
      a: 'slice, almost always. substring differs only in swapping backwards ranges and clamping negatives to zero, neither of which is usually wanted. substr takes a LENGTH rather than an end index and is deprecated Annex B — it still works everywhere but should not appear in new code.',
      code: "'abcdef'.slice(1, 3);       // 'bc'\n'abcdef'.substring(1, 3);   // 'bc'  — same here\n'abcdef'.substr(1, 3);      // 'bcd' — length, not end",
    },
    {
      q: 'How do I take the last n characters?',
      a: 'A negative start. Note the special case: slice(-0) is slice(0), so a computed count of zero returns the whole string rather than an empty one.',
      code: "s.slice(-3);            // last three\ns.slice(-n || s.length); // careful when n may be 0",
    },
    {
      q: 'Why did my emoji turn into a question mark?',
      a: 'Because slice works on UTF-16 code units and an emoji occupies two of them. Cutting between the halves leaves an unpaired surrogate, which renders as a replacement character. Spread the string into an array of code points before slicing.',
      code: "[...text].slice(0, n).join('');",
    },
    {
      q: 'Does slice copy the string?',
      a: 'Conceptually yes, but engines are smarter — V8 represents a slice as a view onto the original buffer where it can. That makes slicing cheap, and it also means holding a short slice of a huge string can keep the whole original alive in memory.',
    },
  ],

  history: [
    { version: 'ES3', note: 'slice added alongside substring, adopting the negative-index behaviour of the array method.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice',
    meta:  'String.prototype.slice',
  },

};
