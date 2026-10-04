// content/reference/javascript/methods/array-isarray.js
//
// The demo dispatches over a fixed set of named values, because a text box
// cannot supply a real object, a typed array or null.

export const meta = {
  slug:        'array-isarray',
  name:        'Array.isArray',
  signature:   'Array.isArray(value)',
  blurb:       'The only reliable array check — typeof says "object" for arrays and everything else.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Array.isArray check test type typeof instanceof array-like iframe realm static javascript',
};

export const method = {
  slug:      'array-isarray',
  name:      'Array.isArray',
  signature: 'Array.isArray(value)',
  returns:   { type: 'boolean', desc: 'True only for real arrays. False for array-like objects, typed arrays, strings and everything else. Works across realms, unlike instanceof.' },

  category:    'Array static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Exists because typeof is useless here — it reports "object" for arrays, null, dates and plain objects alike. This is the check that actually answers the question.',

  cheat: {
    commonCall: 'Array.isArray(value)',
    returns:    'boolean — true only for genuine arrays',
    replaces:   'typeof checks, and instanceof Array',
    watchOut:   'a typed array is NOT an array; nor is anything merely array-like',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Only a genuine Array — including one from another frame or realm — returns true.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON value, e.g. [1,2] or {"length":2}', input: 'text' },
  ],
  demoTemplate: 'Array.isArray(JSON.parse({json}))',
  cases: [
    { id: 'array',  label: 'a real array',      values: { json: '[1,2]' } },
    { id: 'object', label: 'array-LIKE object', values: { json: '{"length":2}' } },
    { id: 'string', label: 'a string',          values: { json: '"abc"' } },
    { id: 'null',   label: 'null',              values: { json: 'null' } },
    { id: 'number', label: 'a number',          values: { json: '42' } },
  ],
  demoExplainer: 'The demo parses a JSON literal so you can try real shapes. Only the genuine array answers true. The array-LIKE object — a plain object with a length property — is false, which is the case that matters most, since such objects behave like arrays in some code and break in the rest. null is false rather than throwing, unlike a property access would be. JSON cannot express a typed array, but those are false too: Int8Array and friends are a separate family, not Arrays.',

  patterns: [
    {
      name: 'Guard a polymorphic argument',
      desc: 'Accept one item or many.',
      code: 'const list = Array.isArray(input) ? input : [input];',
    },
    {
      name: 'Validate parsed JSON',
      desc: 'JSON.parse can return any shape.',
      code: 'if (!Array.isArray(data)) throw new Error("expected an array");',
    },
    {
      name: 'Recurse into nested structures',
      desc: 'The standard test when walking a tree.',
      code: 'function walk(node) {\n  if (Array.isArray(node)) node.forEach(walk);\n}',
    },
  ],

  examples: [
    { title: 'A real array',    code: 'Array.isArray([1, 2])',            returns: 'true' },
    { title: 'typeof is useless',code: 'typeof []',                       returns: "'object'" },
    { title: 'Array-like is false',code: 'Array.isArray({length: 1})',    returns: 'false' },
    { title: 'Typed array is false',code: 'Array.isArray(new Int8Array(2))', returns: 'false' },
    { title: 'null is false',   code: 'Array.isArray(null)',              returns: 'false' },
    { title: 'instanceof mostly works', code: '[] instanceof Array',      returns: 'true  // but not across realms' },
  ],

  pitfalls: [
    {
      name: 'typeof cannot do this job',
      desc: 'typeof returns "object" for arrays, plain objects, dates and null alike. It is the wrong tool entirely, which is exactly why this static exists.',
      wrong: { label: 'Indistinguishable', code: 'typeof [] === typeof {}', output: 'true' },
      fix:   { label: 'Use isArray',       code: 'Array.isArray([])', output: 'true' },
    },
    {
      name: 'instanceof breaks across realms',
      desc: 'An array from an iframe, a worker or a Node vm has a DIFFERENT Array constructor, so instanceof Array is false even though it is a genuine array. Array.isArray is specified to work regardless of realm.',
      wrong: { label: 'Cross-realm fails', code: 'iframeArray instanceof Array', output: 'false' },
      fix:   { label: 'isArray works',     code: 'Array.isArray(iframeArray)', output: 'true' },
    },
    {
      name: 'Array-like is not an array',
      desc: 'A NodeList, the arguments object, or any object with a length are all false. That is correct — they lack the array methods — but it surprises people whose code has been indexing them happily.',
      wrong: { label: 'Not an array', code: 'Array.isArray(document.querySelectorAll("li"))', output: 'false' },
      fix:   { label: 'Convert first', code: 'Array.isArray(Array.from(nodeList))', output: 'true' },
    },
  ],

  when: {
    use: [
      'Any check of whether a value is genuinely an array',
      'Validating parsed JSON or untrusted input',
      'Walking nested structures where arrays need different handling',
      'Anywhere instanceof Array might cross a realm boundary',
    ],
    avoid: [
      'You want to accept array-likes too → check for a numeric length instead',
      'You want typed arrays too → ArrayBuffer.isView, or check both',
    ],
  },

  notes: {
    complexity: 'O(1) — an internal slot check, not a prototype walk',
    return:     'A boolean; nothing is modified',
    cpython:    'V8: Builtins-array-isarray.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the value is only inspected',
  },

  related: [
    { name: 'Array.from',           slug: 'array-from',    when: 'Convert an array-like into a real array' },
    { name: 'Array.of',             slug: 'array-of',      when: 'Build an array from explicit values' },
    { name: 'Array.prototype.flat', slug: 'array-flat',    when: 'Walking nested arrays once you have identified them' },
    { name: 'Array.prototype.includes', slug: 'array-includes', when: 'Testing membership rather than type' },
  ],

  faq: [
    {
      q: 'Why not use instanceof Array?',
      a: 'It works within one realm but fails across them. An array created in an iframe, a web worker or a Node vm context has a different Array constructor, so instanceof returns false for a perfectly real array. Array.isArray checks an internal slot and is realm-independent.',
      code: 'Array.isArray(fromIframe);   // true\nfromIframe instanceof Array;  // false',
    },
    {
      q: 'Is a typed array an array?',
      a: 'No. Int8Array, Float64Array and the rest are a separate family — they share some method names but do not inherit from Array. Use ArrayBuffer.isView if you want to detect those instead.',
      code: 'Array.isArray(new Int8Array(2));   // false\nArrayBuffer.isView(new Int8Array(2)); // true',
    },
    {
      q: 'How do I check for array-like as well?',
      a: 'There is no built-in for it. Test for a numeric length yourself, or just convert with Array.from and work with a real array afterwards.',
      code: "const isArrayLike = v => v != null && typeof v.length === 'number';",
    },
  ],

  history: [
    { version: 'ES5', note: 'Array.isArray added in 2009, replacing the Object.prototype.toString.call(x) === "[object Array]" idiom.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray',
    meta:  'Array.isArray',
  },

};
