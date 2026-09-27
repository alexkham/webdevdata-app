// content/reference/javascript/methods/string-padstart.js
//
// NOTE: literals containing ${"\\"}u… are deliberate. Next 14.2.4's SWC
// compiles the TEXT "\\uD83D" into a real lone surrogate, which breaks
// hydration. Injecting the backslash through a template expression is the
// only form verified to survive both its transform and its minifier.

export const meta = {
  slug:        'string-padstart',
  name:        'String.prototype.padStart',
  signature:   'string.padStart(targetLength[, padString])',
  blurb:       'Pad to a fixed width — zero-padded times and ids, without a while loop.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2017',
  searchTerms: 'string padStart padEnd pad zero leading zeros fixed width align format time id es2017 javascript',
};

export const method = {
  slug:      'string-padstart',
  name:      'String.prototype.padStart',
  signature: 'string.padStart(targetLength[, padString])',
  returns:   { type: 'string', desc: 'A new string of at least targetLength, padded on the LEFT. If the string is already that long it is returned unchanged — never truncated.' },

  category:    'String method',
  version:     'ES2017',
  hasLiveDemo: true,

  subtitle: 'The zero-padding method. Its two rules worth remembering: it never truncates, and a multi-character pad is cut off mid-way rather than overshooting.',

  cheat: {
    commonCall: "String(n).padStart(2, '0')",
    returns:    'a new string of at least the target length',
    replaces:   "('00' + n).slice(-2) and while loops",
    watchOut:   'it never shortens a string that is already too long',
  },

  parameters: [
    { name: 'targetLength', type: 'number', required: true,  default: null, desc: 'Desired final length. A value at or below the current length means no padding at all — the string comes back untouched.' },
    { name: 'padString',    type: 'string', required: false, default: "' '", desc: 'Text to pad with, repeated as needed and TRUNCATED to fit exactly. An empty pad string does nothing at all.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to pad',   input: 'text' },
    { name: 'length', type: 'number', hint: 'target length',       input: 'number' },
    { name: 'pad',    type: 'string', hint: 'pad text',            input: 'text' },
  ],
  demoTemplate: '{s}.padStart({length}, {pad})',
  cases: [
    { id: 'zeros',    label: 'zero padding',        values: { s: '5',   length: 3, pad: '0' } },
    { id: 'already',  label: 'already long enough', values: { s: 'abc', length: 2, pad: '0' } },
    { id: 'multi',    label: 'multi-char pad',      values: { s: 'x',   length: 5, pad: 'ab' } },
    { id: 'exact',    label: 'exactly the length',  values: { s: 'abc', length: 3, pad: '0' } },
    { id: 'emptypad', label: 'empty pad (!)',       values: { s: 'x',   length: 5, pad: '' } },
  ],
  demoExplainer: "Zero-padding a number is what this method is for, and the first case is the whole idiom. The second case is the rule that surprises people: a string already longer than the target is returned UNCHANGED — padStart never truncates, so it cannot be used to enforce a maximum width. The multi-character pad repeats and is then cut to fit exactly, which is why 'ab' padding to length 5 gives 'ababx' rather than overshooting. An empty pad string is a silent no-op.",

  patterns: [
    {
      name: 'Format a clock',
      desc: 'The canonical use.',
      code: "const hhmm = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;",
    },
    {
      name: 'Fixed-width identifiers',
      desc: 'Keeps ids sortable as text.',
      code: "const id = String(n).padStart(6, '0');   // '000042'",
    },
    {
      name: 'Enforce a maximum too',
      desc: 'padStart alone cannot shorten — slice does.',
      code: "const fixed = s.slice(0, 8).padStart(8);",
    },
  ],

  examples: [
    { title: 'Zero padding',      code: "'5'.padStart(3, '0')",    returns: "'005'" },
    { title: 'Already longer',    code: "'abc'.padStart(2, '0')",  returns: "'abc'" },
    { title: 'Default is a space',code: "'abc'.padStart(6)",       returns: "'   abc'" },
    { title: 'Multi-char, cut',   code: "'x'.padStart(5, 'ab')",   returns: "'ababx'" },
    { title: 'padEnd mirrors it', code: "'x'.padEnd(5, 'ab')",     returns: "'xabab'" },
    { title: 'Empty pad',         code: "'x'.padStart(5, '')",     returns: "'x'" },
  ],

  pitfalls: [
    {
      name: 'It never truncates',
      desc: 'The name says pad, and that is all it does. Code that formats a column assuming padStart guarantees a width breaks the moment a value is longer than expected — the row just gets wider. Combine with slice to bound both ends.',
      wrong: { label: 'Overflows', code: "'abcdef'.padStart(3, '0')", output: "'abcdef'   // length 6" },
      fix:   { label: 'Slice too', code: "'abcdef'.slice(0, 3).padStart(3, '0')", output: "'abc'" },
    },
    {
      name: 'It only works on strings',
      desc: 'Numbers have no padStart, so a numeric value must be converted first. Forgetting is a TypeError, and the fix — String(n) or a template literal — is easy to leave out when refactoring.',
      wrong: { label: 'Not a function', code: '(5).padStart(3, "0")', output: 'TypeError: 5.padStart is not a function' },
      fix:   { label: 'Convert first',  code: "String(5).padStart(3, '0')", output: "'005'" },
    },
    {
      name: 'A multi-character pad is cut mid-character',
      desc: 'Truncation happens by code unit, so padding with an emoji or other astral character can leave half a surrogate pair at the join. Stick to single-code-unit pad characters unless you have checked the arithmetic.',
      wrong: { label: 'Broken half', code: "'x'.padStart(4, '\\u{1F600}')", output: `'\\u{1F600}${"\\"}ud83dx'` },
      fix:   { label: 'Plain pad',   code: "'x'.padStart(4, '-')", output: "'---x'" },
    },
    {
      name: 'Padding is not alignment in a proportional font',
      desc: 'Spaces line things up only in a monospaced context. In HTML, runs of spaces also collapse unless white-space is preserved, so padded output usually needs CSS rather than string manipulation.',
      wrong: { label: 'Collapses in HTML', code: "el.textContent = '  x'", output: 'leading spaces collapse' },
      fix:   { label: 'Use CSS',           code: 'text-align: right', output: 'actually aligned' },
    },
  ],

  when: {
    use: [
      'Zero-padding numbers for times, dates and identifiers',
      'Fixed-width output in a monospaced context — logs, terminals',
      'Making numeric strings sort correctly as text',
      'Right-aligning short values in plain text',
    ],
    avoid: [
      'You need a maximum width too → slice first, then pad',
      'Padding on the right → padEnd',
      'Aligning in HTML → CSS, not spaces',
      'Formatting numbers for humans → toLocaleString or Intl.NumberFormat',
    ],
  },

  notes: {
    complexity: 'O(targetLength)',
    return:     'A new string, or the original when no padding is needed',
    cpython:    'V8: Builtins-string-pad',
    memory:     'Allocates the padded result',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.padEnd',  slug: 'string-padend',  when: 'Pad on the right instead' },
    { name: 'String.prototype.trim',    slug: 'string-trim',    when: 'Removing whitespace rather than adding it' },
    { name: 'String.prototype.slice',   slug: 'string-slice',   when: 'Enforcing a maximum width' },
    { name: 'String.prototype.at',      slug: 'string-at',      when: 'Reading a character from a fixed-width field' },
  ],

  faq: [
    {
      q: 'Why does padStart not shorten a long string?',
      a: 'Because padding and truncating are different operations, and conflating them would make the method lossy. If you need an exact width, slice first and then pad — the two together are explicit about discarding data.',
      code: "s.slice(0, n).padStart(n, '0');",
    },
    {
      q: 'How do I pad a number?',
      a: 'Convert it to a string first — padStart is a string method and numbers do not have it. A template literal is the shortest form.',
      code: "`${n}`.padStart(2, '0');\nString(n).padStart(2, '0');",
    },
    {
      q: 'What happened to the old ("00" + n).slice(-2) trick?',
      a: 'It still works and padStart replaces it. The old idiom silently truncates when the number is longer than the pad, which is sometimes what you wanted and usually a hidden bug — padStart makes the choice explicit.',
      code: "('00' + 123).slice(-2);        // '23' — data lost\nString(123).padStart(2, '0');  // '123' — kept",
    },
    {
      q: 'Is padStart the right way to format currency?',
      a: 'No. Intl.NumberFormat handles grouping, decimal places, currency symbols and locale conventions. padStart only makes a string a certain length.',
      code: "new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(5);",
    },
  ],

  history: [
    { version: 'ES2017', note: 'padStart and padEnd added together, replacing an assortment of slice and loop idioms.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart',
    meta:  'String.prototype.padStart',
  },

  tryInTool: [],
};
