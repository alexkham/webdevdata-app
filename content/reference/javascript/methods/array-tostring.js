// content/reference/javascript/methods/array-tostring.js
//
// toLocaleString is consolidated here rather than given its own page: it is
// the same join-with-commas algorithm with per-element locale formatting,
// and its one genuinely interesting behaviour (the separator collision) is
// covered in the pitfalls and FAQ below.

export const meta = {
  slug:        'array-tostring',
  name:        'Array.prototype.toString',
  signature:   'array.toString()',
  blurb:       'The comma-joined string every array silently becomes — and it flattens nesting completely.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'array toString toLocaleString string conversion coercion join comma implicit template literal concatenation locale javascript',
};

export const method = {
  slug:      'array-tostring',
  name:      'Array.prototype.toString',
  signature: 'array.toString()',
  returns:   { type: 'string', desc: 'The elements joined with commas. null and undefined become empty strings, and nested arrays are flattened all the way down.' },

  category:    'Array method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'You rarely call it, and you invoke it constantly — every template literal, every string concatenation and every loose comparison against a string goes through here.',

  cheat: {
    commonCall: 'String(array)',
    returns:    "the elements joined with ',' — no brackets, no quotes",
    replaces:   "array.join(',')",
    watchOut:   'nesting is flattened and null becomes empty — data is lost',
  },

  parameters: [],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON array, e.g. [1,[2,3]]', input: 'text' },
  ],
  demoTemplate: 'JSON.parse({json}).toString()',
  cases: [
    { id: 'flat',    label: 'a flat array',      values: { json: '[1,2,3]' } },
    { id: 'nested',  label: 'nested (flattened!)',values: { json: '[1,[2,[3,4]]]' } },
    { id: 'nulls',   label: 'nulls vanish',      values: { json: '[null,null]' } },
    { id: 'objects', label: 'objects',           values: { json: '[{"a":1}]' } },
    { id: 'empty',   label: 'empty array',       values: { json: '[]' } },
  ],
  demoExplainer: 'The output has no brackets and no quotes, which is the first surprise — an array does not stringify to anything resembling its literal form. The nested case is the important one: [1,[2,[3,4]]] becomes "1,2,3,4", because each element is itself converted to a string and nested arrays recurse all the way down. Nothing in the result tells you where one array ended and another began. null and undefined become empty strings, so two nulls produce a lone comma, and an object becomes the useless "[object Object]". If you want a representation you can read or parse back, you want JSON.stringify.',

  patterns: [
    {
      name: 'Be explicit instead',
      desc: 'If you meant to join, say so — the separator becomes visible.',
      code: "const csv = items.join(',');",
    },
    {
      name: 'Serialise properly',
      desc: 'The only form that survives a round trip.',
      code: 'const text = JSON.stringify(items);',
    },
    {
      name: 'Readable output for humans',
      desc: 'Comma-space, and holes made explicit.',
      code: "const label = items.map(x => x ?? '-').join(', ');",
    },
  ],

  examples: [
    { title: 'Commas, no brackets',  code: '[1, 2, 3].toString()',        returns: "'1,2,3'" },
    { title: 'Nesting is flattened', code: '[1, [2, [3, 4]]].toString()', returns: "'1,2,3,4'" },
    { title: 'Nulls become empty',   code: '[null, undefined].toString()',returns: "','" },
    { title: 'Objects are useless',  code: '[{a: 1}].toString()',         returns: "'[object Object]'" },
    { title: 'Implicit on concat',   code: "'x' + [1, 2]",                returns: "'x1,2'" },
    { title: 'JSON keeps the shape', code: 'JSON.stringify([1, [2]])',    returns: "'[1,[2]]'" },
  ],

  pitfalls: [
    {
      name: 'Nested arrays flatten irreversibly',
      desc: 'Every element is converted to a string in turn, and an array element converts by this same method — so nesting recurses away entirely. The result cannot tell you the original shape, which makes it worthless for anything you intend to read back.',
      wrong: { label: 'Shape is gone', code: '[1, [2, [3, 4]]].toString()', output: "'1,2,3,4'" },
      fix:   { label: 'Keep the shape', code: 'JSON.stringify([1, [2, [3, 4]]])', output: "'[1,[2,[3,4]]]'" },
    },
    {
      name: 'It fires implicitly, where you did not ask for it',
      desc: 'Template literals, string concatenation, alert, and object keys all coerce via toString. An array used where a string was expected does not throw — it quietly becomes a comma-joined string, so the bug shows up somewhere far away.',
      wrong: { label: 'Silent coercion', code: "const key = 'user:' + [1, 2];", output: "'user:1,2'" },
      fix:   { label: 'Say what you mean', code: "const key = 'user:' + items.join('-');", output: "'user:1-2'" },
    },
    {
      name: 'null, undefined and holes all become empty strings',
      desc: 'They are not written out as "null" — they contribute nothing at all, leaving bare separators. Two adjacent nulls are indistinguishable from two adjacent empty strings, and from a hole in a sparse array.',
      wrong: { label: 'Ambiguous', code: '[null, undefined].toString()', output: "','   // same as ['',''].toString()" },
      fix:   { label: 'Make them visible', code: "[null, undefined].map(x => x ?? 'null').join(',')", output: "'null,null'" },
    },
    {
      name: 'It powers a loose-equality surprise',
      desc: 'Comparing an array to a string with == coerces the array via toString first, so a one-element array can equal its own element. Another reason to use === everywhere.',
      wrong: { label: 'Loosely equal', code: "[1, 2] == '1,2'", output: 'true' },
      fix:   { label: 'Strict is false', code: "[1, 2] === '1,2'", output: 'false' },
    },
    {
      name: 'A Symbol element throws',
      desc: 'Almost everything coerces silently, but Symbols refuse. One Symbol anywhere in the array turns an innocent template literal into a TypeError at runtime.',
      wrong: { label: 'Throws', code: "[Symbol('x')].toString()", output: 'TypeError: Cannot convert a Symbol value to a string' },
      fix:   { label: 'Convert explicitly', code: "[Symbol('x')].map(String).join(',')", output: "'Symbol(x)'" },
    },
  ],

  when: {
    use: [
      'Almost never directly — it runs implicitly on coercion',
      'A throwaway debug string for a flat array of primitives',
      'Understanding why an array appeared inside a string you built',
    ],
    avoid: [
      'You want a specific separator → join',
      'You want to parse it back → JSON.stringify',
      'The array is nested → the structure is destroyed',
      'Elements may be null, undefined or objects → map them first',
    ],
  },

  notes: {
    complexity: 'O(n) over all elements, recursing into nested arrays',
    return:     'A new string; the array is not modified',
    cpython:    'V8: Builtins-array-tostring.tq',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded; the array is only read',
  },

  related: [
    { name: 'Array.prototype.join', slug: 'array-join', when: 'The same thing, with a separator you choose' },
    { name: 'Array.prototype.flat', slug: 'array-flat', when: 'Flatten deliberately, keeping the values as values' },
    { name: 'Array.prototype.concat', slug: 'array-concat', when: 'Combining arrays rather than stringifying them' },
    { name: 'Array.prototype.map',  slug: 'array-map',  when: 'Format each element before joining' },
  ],

  faq: [
    {
      q: 'What is the difference between toString and join?',
      a: "None, except that join lets you pick the separator and toString is locked to a comma. toString is what runs when an array is coerced to a string, and calling join(',') explicitly produces exactly the same output — with the advantage that the next reader can see the separator.",
      code: "[1, 2].toString();   // '1,2'\n[1, 2].join(',');    // '1,2'\n[1, 2].join(' | ');  // '1 | 2'",
    },
    {
      q: 'Why does my array print without brackets?',
      a: 'Because string coercion goes through this method, which produces only the comma-joined elements. Console output looks bracketed because devtools inspect the object rather than stringify it — the moment the array lands in a template literal, the brackets are gone.',
      code: 'const a = [1, 2];\nconsole.log(a);       // [1, 2]  — inspected\nconsole.log(`${a}`);  // 1,2     — stringified',
    },
    {
      q: 'What does toLocaleString do differently?',
      a: 'It follows the identical algorithm — join every element with a comma — but calls toLocaleString on each element instead of toString, so numbers and dates are formatted for the locale. The separator between elements stays a comma regardless of locale, which is where it goes wrong.',
      code: "[1234.5].toLocaleString('de-DE');   // '1.234,5'",
    },
    {
      q: 'Why is toLocaleString almost unusable for numbers?',
      a: 'Because many locales use a comma as the thousands or decimal separator, and the separator BETWEEN elements is also a comma. The two collide and the result is ambiguous garbage that no parser can recover.',
      code: "[1234.5, 2].toLocaleString('en-US');   // '1,234.5,2'\n// Better:\n[1234.5, 2].map(n => n.toLocaleString('en-US')).join(' | ');",
    },
  ],

  history: [
    { version: 'ES1',    note: 'Present from the first version of the language as the array string-coercion hook.' },
    { version: 'ES3',    note: 'toLocaleString added alongside it, applying locale formatting per element.' },
    { version: 'ES5',    note: 'Specified to delegate to join when join is callable, formalising the long-standing behaviour.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString',
    meta:  'Array.prototype.toString',
  },

};
