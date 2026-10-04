// content/reference/javascript/methods/string-repeat.js

export const meta = {
  slug:        'string-repeat',
  name:        'String.prototype.repeat',
  signature:   'string.repeat(count)',
  blurb:       'Repeat a string n times — and the only common string method that throws on bad input.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string repeat times duplicate separator line divider indent RangeError negative count es2015 javascript',
};

export const method = {
  slug:      'string-repeat',
  name:      'String.prototype.repeat',
  signature: 'string.repeat(count)',
  returns:   { type: 'string', desc: 'The string concatenated with itself count times. Zero gives an empty string; a negative count throws RangeError.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Small and predictable, with one sharp edge: most string methods clamp or ignore bad arguments, and this one throws.',

  cheat: {
    commonCall: "'-'.repeat(40)",
    returns:    'a new string, count copies long',
    replaces:   "new Array(n + 1).join(s)",
    watchOut:   'a negative or infinite count is a RangeError',
  },

  parameters: [
    { name: 'count', type: 'number', required: true, default: null, desc: 'How many copies. Truncated toward zero, so 2.9 means 2. Must be zero or more and finite — anything else throws RangeError.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the string to repeat', input: 'text' },
    { name: 'count', type: 'number', hint: 'how many times',       input: 'number' },
  ],
  demoTemplate: '{s}.repeat({count})',
  cases: [
    { id: 'three',    label: 'three copies',     values: { s: 'ab', count: 3 } },
    { id: 'divider',  label: 'a divider line',   values: { s: '-', count: 20 } },
    { id: 'zero',     label: 'zero copies',      values: { s: 'ab', count: 0 } },
    { id: 'fraction', label: 'fraction truncated',values: { s: 'ab', count: 2 } },
    { id: 'negative', label: 'negative THROWS (!)',values: { s: 'ab', count: -1 } },
  ],
  demoExplainer: "Straightforward until the last case. Zero copies give an empty string, which is the sensible answer and the one most code relies on. A negative count, though, is a RangeError rather than an empty string — unusual for a string method, since slice, padStart and the rest all clamp silently. If the count comes from arithmetic that could go negative, guard it with Math.max(0, n) or you will get an exception instead of a harmless empty string.",

  patterns: [
    {
      name: 'Draw a divider',
      desc: 'The most common use in console output.',
      code: "console.log('-'.repeat(60));",
    },
    {
      name: 'Indent by depth',
      desc: 'Guard the count if depth could be negative.',
      code: "const indent = '  '.repeat(Math.max(0, depth));",
    },
    {
      name: 'Pad to a width',
      desc: 'padStart and padEnd do this without the arithmetic.',
      code: "const padded = s + ' '.repeat(Math.max(0, width - s.length));",
    },
  ],

  examples: [
    { title: 'Three copies',    code: "'ab'.repeat(3)",        returns: "'ababab'" },
    { title: 'Zero copies',     code: "'ab'.repeat(0)",        returns: "''" },
    { title: 'Truncated',       code: "'ab'.repeat(2.9)",      returns: "'abab'" },
    { title: 'Negative throws', code: "'ab'.repeat(-1)",       returns: 'RangeError: Invalid count value: -1' },
    { title: 'Infinity throws', code: "'ab'.repeat(Infinity)", returns: 'RangeError: Invalid count value: Infinity' },
    { title: 'Empty source',    code: "''.repeat(99)",         returns: "''" },
  ],

  pitfalls: [
    {
      name: 'A negative count throws instead of clamping',
      desc: 'Almost every other string method treats an out-of-range number as a no-op. repeat does not. Code computing a count by subtraction — width minus length, depth minus one — will throw on the first input that makes it negative.',
      wrong: { label: 'Throws', code: "' '.repeat(10 - 'a very long string'.length)", output: 'RangeError: Invalid count value: -8' },
      fix:   { label: 'Clamp first', code: "' '.repeat(Math.max(0, 10 - s.length))", output: "''" },
    },
    {
      name: 'It returns a new string and changes nothing',
      desc: 'The usual immutability rule. Worth restating because repeat is often used inside a loop that builds output, where a discarded result is easy to miss.',
      wrong: { label: 'Discarded', code: "let s = 'ab';\ns.repeat(3);\ns", output: "'ab'" },
      fix:   { label: 'Assign it', code: "let s = 'ab';\ns = s.repeat(3);\ns", output: "'ababab'" },
    },
    {
      name: 'A huge count is a memory problem, not an error',
      desc: 'Counts within range but very large allocate exactly what you asked for. A count derived from user input can allocate hundreds of megabytes before the engine finally refuses, which is a denial-of-service vector in server code.',
      wrong: { label: 'Allocates it all', code: "'x'.repeat(userSuppliedCount)", output: 'RangeError only at the engine limit' },
      fix:   { label: 'Bound it',         code: "'x'.repeat(Math.min(1000, n))", output: 'safe' },
    },
    {
      name: 'padStart is usually what you meant',
      desc: 'Repeating a character to fill a width requires computing the difference, guarding the negative case, and concatenating. The pad methods do all of that, and they never throw.',
      wrong: { label: 'Manual and fragile', code: "' '.repeat(w - s.length) + s", output: 'throws when s is too long' },
      fix:   { label: 'padStart',           code: 's.padStart(w)', output: 'returns s unchanged' },
    },
  ],

  when: {
    use: [
      'Dividers and separator lines in console or log output',
      'Indentation by nesting depth',
      'Building a repeated pattern of known length',
    ],
    avoid: [
      'Padding to a width → padStart or padEnd, which cannot throw',
      'The count may be negative → clamp, or use a pad method',
      'The count comes from user input → bound it first',
      'Joining a list with a separator → join',
    ],
  },

  notes: {
    complexity: 'O(n × count) in the length of the result',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-repeat',
    memory:     'Allocates the full result — proportional to count',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.padStart', slug: 'string-padstart', when: 'Filling to a width, without the arithmetic' },
    { name: 'String.prototype.padEnd',   slug: 'string-padend',   when: 'The same on the right' },
    { name: 'String.prototype.concat',   slug: 'string-concat',   when: 'Joining different strings rather than copies' },
    { name: 'Array.prototype.join',      slug: 'array-join',      when: 'A separator BETWEEN items rather than repeated' },
  ],

  faq: [
    {
      q: 'Why does a negative count throw?',
      a: 'Because there is no sensible answer — unlike a slice index, where "past the end" naturally clamps, a negative number of copies is simply meaningless. The specification chose an error over silently treating it as zero, which does catch genuine arithmetic bugs.',
      code: "'x'.repeat(Math.max(0, n));   // the usual guard",
    },
    {
      q: 'What happened to new Array(n + 1).join(s)?',
      a: 'That was the pre-2015 idiom, and the off-by-one in it — n + 1 elements produce n separators — is exactly why repeat was added. It also silently accepted values that repeat rejects.',
      code: "new Array(4).join('ab');   // 'ababab' — three copies from four\n'ab'.repeat(3);            // 'ababab' — says what it means",
    },
    {
      q: 'Does a fractional count round or truncate?',
      a: 'Truncates toward zero, like most integer conversions in the language. 2.9 gives two copies, and 0.9 gives none at all.',
      code: "'ab'.repeat(2.9);   // 'abab'\n'ab'.repeat(0.9);   // ''",
    },
  ],

  history: [
    { version: 'ES2015', note: 'repeat added, replacing the Array-join idiom.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat',
    meta:  'String.prototype.repeat',
  },

};
