// content/reference/javascript/methods/string-at.js
//
// NOTE: literals containing ${"\\"}u… are deliberate. Next 14.2.4's SWC
// compiles the TEXT "\\uD83D" into a real lone surrogate, which breaks
// hydration. Injecting the backslash through a template expression is the
// only form verified to survive both its transform and its minifier.
//
// charAt is consolidated here: same job, two differences (no negatives, and
// '' instead of undefined when out of range), best shown side by side.

export const meta = {
  slug:        'string-at',
  name:        'String.prototype.at',
  signature:   'string.at(index)',
  blurb:       'One character by index, negatives included — s.at(-1) instead of s[s.length - 1].',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2022',
  searchTerms: 'string at charAt last character negative index bracket notation undefined es2022 javascript',
};

export const method = {
  slug:      'string-at',
  name:      'String.prototype.at',
  signature: 'string.at(index)',
  returns:   { type: 'string | undefined', desc: 'A one-character string, or undefined when the index is out of range. charAt returns an empty string in that case instead.' },

  category:    'String method',
  version:     'ES2022',
  hasLiveDemo: true,

  subtitle: 'Added so that reading the last character stops requiring arithmetic. Bracket notation cannot take a negative index, and charAt will not either.',

  cheat: {
    commonCall: 's.at(-1)',
    returns:    'one character, or undefined',
    replaces:   's[s.length - 1] and s.charAt(s.length - 1)',
    watchOut:   'out of range is undefined, while charAt gives ""',
  },

  parameters: [
    { name: 'index', type: 'number', required: true, default: null, desc: 'Position to read. Negative counts back from the end, so -1 is the last character. Out of range gives undefined rather than throwing.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'the source string', input: 'text' },
    { name: 'index', type: 'number', hint: 'index (may be negative)', input: 'number' },
  ],
  demoTemplate: '{s}.at({index})',
  cases: [
    { id: 'first',  label: 'first character',   values: { s: 'abcdef', index: 0 } },
    { id: 'last',   label: 'last (negative)',   values: { s: 'abcdef', index: -1 } },
    { id: 'second', label: 'second from end',   values: { s: 'abcdef', index: -2 } },
    { id: 'middle', label: 'a middle index',    values: { s: 'abcdef', index: 2 } },
    { id: 'beyond', label: 'out of range (!)',  values: { s: 'abcdef', index: 99 } },
  ],
  demoExplainer: "Negative indices are the entire reason this method exists: at(-1) is the last character, with no reference to length anywhere. The out-of-range case returns undefined, which is the meaningful difference from charAt — charAt(99) returns an empty string, so a truthiness check treats a missing character and a real one very differently depending on which method you used. Neither one throws.",

  patterns: [
    {
      name: 'Read the last character',
      desc: 'The reason the method was added.',
      code: 'const last = s.at(-1);',
    },
    {
      name: 'Test a trailing character',
      desc: 'Clearer than a length calculation.',
      code: "if (path.at(-1) !== '/') path += '/';",
    },
    {
      name: 'Capitalise the first letter',
      desc: 'at reads it; slice takes the rest.',
      code: 'const title = s.at(0).toUpperCase() + s.slice(1);',
    },
  ],

  examples: [
    { title: 'First character',  code: "'abcdef'.at(0)",       returns: "'a'" },
    { title: 'Last character',   code: "'abcdef'.at(-1)",      returns: "'f'" },
    { title: 'Out of range',     code: "'abcdef'.at(99)",      returns: 'undefined' },
    { title: 'charAt differs',   code: "'abcdef'.charAt(99)",  returns: "''" },
    { title: 'Brackets differ',  code: "'abcdef'[99]",         returns: 'undefined' },
    { title: 'Negative brackets',code: "'abcdef'[-1]",         returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'Bracket notation does not accept negatives',
      desc: 's[-1] is not an error and not the last character — it looks up a property literally named "-1", which does not exist, so you get undefined. This is why the method was added at all.',
      wrong: { label: 'Property lookup', code: "'abc'[-1]", output: 'undefined' },
      fix:   { label: 'Use at',          code: "'abc'.at(-1)", output: "'c'" },
    },
    {
      name: 'at and charAt disagree when out of range',
      desc: 'at gives undefined, charAt gives an empty string. Both are falsy, so a simple if behaves the same — but concatenation does not, and "undefined" appearing in output is usually traced back to exactly this.',
      wrong: { label: 'Stringifies badly', code: "'x' + 'abc'.at(99)", output: "'xundefined'" },
      fix:   { label: 'charAt, or default', code: "'x' + ('abc'.at(99) ?? '')", output: "'x'" },
    },
    {
      name: 'It reads a code unit, not a character',
      desc: 'Like every index-based string operation, at works in UTF-16. The first "character" of a string starting with an emoji is half a surrogate pair, which renders as a replacement glyph.',
      wrong: { label: 'Half an emoji', code: "'\\u{1F600}a'.at(0)", output: `'${"\\"}ud83d'` },
      fix:   { label: 'Spread first',  code: "[...'\\u{1F600}a'].at(0)", output: "'\\u{1F600}'" },
    },
    {
      name: 'ES2022 — check your runtime',
      desc: 'Node 16.6+ and 2021-era browsers. Older targets need the length arithmetic, or slice(-1) which has worked since ES3 and returns an empty string rather than undefined.',
      wrong: { label: 'Missing', code: "s.at(-1)", output: 'TypeError: s.at is not a function' },
      fix:   { label: 'slice(-1)', code: "s.slice(-1)", output: 'last character, or ""' },
    },
  ],

  when: {
    use: [
      'Reading the last character, or the nth from the end',
      'Any single-character read where the index may be negative',
      'Replacing s[s.length - 1] for readability',
    ],
    avoid: [
      'You want a substring, not one character → slice',
      'You need an empty string rather than undefined → charAt',
      'The text contains emoji → spread into an array of code points',
      'Targeting runtimes older than 2021 → slice(-1)',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new one-character string, or undefined',
    cpython:    'V8: Builtins-string-at',
    memory:     'Allocates a one-character string',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.slice',    slug: 'string-slice',    when: 'More than one character, also with negatives' },
    { name: 'Array.prototype.at',        slug: 'array-at',        when: 'The identical method on arrays' },
    { name: 'String.prototype.indexOf',  slug: 'string-indexof',  when: 'Find a position rather than read one' },
    { name: 'String.prototype.endsWith', slug: 'string-endswith', when: 'Testing the end without extracting it' },
  ],

  faq: [
    {
      q: 'at, charAt or brackets?',
      a: 'at for anything involving the end of the string, since it is the only one that takes a negative index. Brackets are fine and fastest for a known non-negative index. charAt is worth knowing mainly because it returns an empty string rather than undefined when out of range.',
      code: "s.at(-1);      // last character\ns[0];          // first, terse\ns.charAt(99);  // '' rather than undefined",
    },
    {
      q: 'Why does s[-1] not work?',
      a: 'Because bracket access on a string is property access, and "-1" is just a property name that no string has. There is no index arithmetic involved, so nothing throws — you simply get undefined, which is exactly the silent failure at was introduced to fix.',
    },
    {
      q: 'How do I get the last character of a string with emoji?',
      a: 'Spread into an array first so the iteration happens by code point, then take the last element. Any code-unit method — at, charAt, slice, brackets — can land in the middle of a surrogate pair.',
      code: "[...text].at(-1);",
    },
  ],

  history: [
    { version: 'ES1',    note: 'charAt present from the first version of the language.' },
    { version: 'ES2022', note: 'at added to String, Array and the typed arrays together, bringing negative indexing to all of them.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/at',
    meta:  'String.prototype.at',
  },

};
