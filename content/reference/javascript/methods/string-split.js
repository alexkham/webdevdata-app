// content/reference/javascript/methods/string-split.js
//
// NOTE: literals containing ${"\\"}u… are deliberate. Next 14.2.4's SWC
// compiles the TEXT "\\uD83D" into a real lone surrogate, which breaks
// hydration. Injecting the backslash through a template expression is the
// only form verified to survive both its transform and its minifier.

export const meta = {
  slug:        'string-split',
  name:        'String.prototype.split',
  signature:   'string.split([separator[, limit]])',
  blurb:       'Cut a string into an array — and the empty-string cases that trip everyone up.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string split separator delimiter tokenize csv parse array limit regex characters explode javascript',
};

export const method = {
  slug:      'string-split',
  name:      'String.prototype.split',
  signature: 'string.split([separator[, limit]])',
  returns:   { type: 'string[]', desc: 'An array of substrings. Always an array — for a string with no separator in it, an array of one element.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The inverse of join, with three special cases worth knowing: no separator at all, an empty-string separator, and an empty input string.',

  cheat: {
    commonCall: "text.split(',')",
    returns:    'an array of pieces, never a string',
    replaces:   'a manual indexOf-and-slice loop',
    watchOut:   "''.split(',') is [''], not [] — length 1",
  },

  parameters: [
    { name: 'separator', type: 'string | RegExp', required: false, default: 'undefined', desc: 'Where to cut. A string matches literally; a RegExp matches by pattern, and any capture groups are INCLUDED in the result. Omitted entirely, the whole string comes back as one element.' },
    { name: 'limit',     type: 'number',          required: false, default: 'unlimited', desc: 'Maximum number of pieces to return. Extra pieces are discarded, not joined onto the last one.' },
  ],

  demoParams: [
    { name: 's',   type: 'string', hint: 'the string to split', input: 'text' },
    { name: 'sep', type: 'string', hint: 'separator (may be empty)', input: 'text' },
  ],
  demoTemplate: '{s}.split({sep})',
  cases: [
    { id: 'csv',       label: 'comma separated',    values: { s: 'a,b,c', sep: ',' } },
    { id: 'chars',     label: 'empty separator',    values: { s: 'abc',   sep: '' } },
    { id: 'adjacent',  label: 'adjacent separators',values: { s: 'a,,b',  sep: ',' } },
    { id: 'emptystr',  label: 'empty string (!)',   values: { s: '',      sep: ',' } },
    { id: 'emptyboth', label: 'both empty (!)',     values: { s: '',      sep: '' } },
    { id: 'nomatch',   label: 'separator absent',   values: { s: 'abc',   sep: ',' } },
  ],
  demoExplainer: "An empty separator splits between every character. Adjacent separators produce an empty string between them — nothing is skipped, which is why a trailing comma gives you a trailing ''. The two empty-input cases are the ones that cause real bugs and they disagree with each other: ''.split(',') gives [''] — an array of LENGTH ONE holding an empty string — while ''.split('') gives a genuinely empty array. Code that checks .length to decide whether there was any input gets the wrong answer from the first one. Finally, when the separator is absent from the string you still get an array, just a one-element one.",

  patterns: [
    {
      name: 'Parse a delimited line',
      desc: 'The everyday use. Trim if the source may have spaces.',
      code: "const fields = line.split(',').map(f => f.trim());",
    },
    {
      name: 'Split on one of several things',
      desc: 'A RegExp separator handles alternatives and runs of whitespace.',
      code: 'const words = text.split(/\\s+/);',
    },
    {
      name: 'Split into characters, safely',
      desc: 'Spread respects code points; split("") does not.',
      code: "const chars = [...text];   // not text.split('')",
    },
  ],

  examples: [
    { title: 'Comma separated',   code: "'a,b,c'.split(',')",     returns: "['a', 'b', 'c']" },
    { title: 'Every character',   code: "'abc'.split('')",        returns: "['a', 'b', 'c']" },
    { title: 'No separator',      code: "'abc'.split()",          returns: "['abc']" },
    { title: 'Empty input',       code: "''.split(',')",          returns: "['']" },
    { title: 'Empty both',        code: "''.split('')",           returns: '[]' },
    { title: 'Capture group kept',code: "'a1b'.split(/(\\d)/)",   returns: "['a', '1', 'b']" },
  ],

  pitfalls: [
    {
      name: "''.split(',') is not empty",
      desc: "It returns [''] — one element, length 1. Splitting user input that happens to be blank therefore yields a single empty field rather than no fields, and a .length check reports 1. The inconsistency is real: ''.split('') DOES give [].",
      wrong: { label: 'Length is 1', code: "''.split(',').length", output: '1' },
      fix:   { label: 'Guard first',  code: "const parts = s ? s.split(',') : [];", output: 'length 0' },
    },
    {
      name: "split('') breaks emoji and other astral characters",
      desc: 'It splits by UTF-16 code unit, so anything outside the Basic Multilingual Plane is torn into two useless surrogate halves. Spread syntax and Array.from iterate by code point and keep them whole.',
      wrong: { label: 'Broken halves', code: "'\\u{1F600}x'.split('')", output: `['${"\\"}ud83d', '${"\\"}ude00', 'x']` },
      fix:   { label: 'Spread instead', code: "[...'\\u{1F600}x']", output: "['\\u{1F600}', 'x']" },
    },
    {
      name: 'A capture group changes the output',
      desc: 'With a RegExp separator, anything captured in parentheses is spliced INTO the result array alongside the pieces. Sometimes that is what you want; when it is not, use a non-capturing group.',
      wrong: { label: 'Separators included', code: "'a1b'.split(/(\\d)/)", output: "['a', '1', 'b']" },
      fix:   { label: 'Non-capturing',       code: "'a1b'.split(/(?:\\d)/)", output: "['a', 'b']" },
    },
    {
      name: 'limit truncates, it does not group',
      desc: 'Unlike the equivalent in Python or Java, the remainder is thrown away rather than returned as a final element. To keep the tail, split once and rejoin, or use indexOf and slice.',
      wrong: { label: 'Tail discarded', code: "'a,b,c'.split(',', 2)", output: "['a', 'b']   // the c is gone" },
      fix:   { label: 'Keep the tail',  code: "const i = s.indexOf(',');\n[s.slice(0, i), s.slice(i + 1)]", output: "['a', 'b,c']" },
    },
    {
      name: 'Splitting CSV with split is not parsing CSV',
      desc: 'Quoted fields containing commas, escaped quotes and embedded newlines all defeat it. It is fine for data you generated yourself, and wrong for anything from a spreadsheet.',
      wrong: { label: 'Quotes ignored', code: `'a,"b,c"'.split(',')`, output: `['a', '"b', 'c"']` },
      fix:   { label: 'Use a parser',   code: 'parseCsv(line)', output: "['a', 'b,c']" },
    },
  ],

  when: {
    use: [
      'Breaking a delimited line into fields',
      'Tokenising on whitespace or a simple pattern',
      'Turning a string into an array to use array methods on it',
      'Taking the part before or after a known delimiter',
    ],
    avoid: [
      'Splitting into characters → spread or Array.from, which handle emoji',
      'Real CSV with quoted fields → a parser',
      'You only want the first piece → slice with indexOf',
      'You want to rejoin unchanged → you probably want replace',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the string, plus regex cost if a pattern is used',
    return:     'A new array of new strings; the original is unchanged (strings are immutable)',
    cpython:    'V8: Builtins-string-split / runtime-strings.cc',
    memory:     'Allocates the array and every substring in it',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'Array.prototype.join',      slug: 'array-join',      when: 'The exact inverse — array back to string' },
    { name: 'String.prototype.slice',    slug: 'string-slice',    when: 'Take one piece by position instead' },
    { name: 'String.prototype.indexOf',  slug: 'string-indexof',  when: 'Find the delimiter yourself for full control' },
    { name: 'String.prototype.replace',  slug: 'string-replace',  when: 'Substitute rather than break apart' },
  ],

  faq: [
    {
      q: "Why does ''.split(',') return [''] instead of []?",
      a: "Because the algorithm looks for separators in the string, finds none, and returns the whole string as the single piece — and the whole string is ''. The empty-separator case is special-cased in the spec to return [] instead, which is why the two disagree. Guard blank input explicitly rather than trusting .length.",
      code: "''.split(',');   // ['']  — length 1\n''.split('');    // []    — length 0",
    },
    {
      q: 'How do I split into characters without breaking emoji?',
      a: "Spread the string or use Array.from. Both iterate by code point, so a surrogate pair stays a single element. split('') works on code UNITS and tears astral characters in half.",
      code: "[...text];\nArray.from(text);",
    },
    {
      q: 'How do I split on only the first occurrence?',
      a: 'Not with limit — that discards the rest. Find the index and take two slices, which also makes the intent obvious.',
      code: "const i = s.indexOf(':');\nconst [key, value] = [s.slice(0, i), s.slice(i + 1)];",
    },
    {
      q: 'Can I split on multiple different separators?',
      a: 'Yes — pass a RegExp with alternation. Wrap the alternatives in a non-capturing group so the separators themselves do not appear in the result.',
      code: "'a,b;c'.split(/[,;]/);     // ['a', 'b', 'c']\ntext.split(/\\s+/);         // on runs of whitespace",
    },
  ],

  history: [
    { version: 'ES3',     note: 'split added with both string and RegExp separator forms.' },
    { version: 'ES2015',  note: 'Symbol.split allowed custom objects to define their own splitting behaviour.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split',
    meta:  'String.prototype.split',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the array you get back' },
  ],
};
