// content/reference/javascript/methods/object-tostring.js
//
// valueOf and toLocaleString are consolidated here: all three are the
// coercion hooks on Object.prototype, and only toString has any real use —
// as the classic type check.

export const meta = {
  slug:        'object-tostring',
  name:        'Object.prototype.toString',
  signature:   'Object.prototype.toString.call(value)',
  blurb:       'Where [object Object] comes from — and the type check that predates every alternative.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'Object.prototype.toString valueOf toLocaleString object Object type check tag typeof Symbol.toStringTag javascript',
};

export const method = {
  slug:      'object-tostring',
  name:      'Object.prototype.toString',
  signature: 'Object.prototype.toString.call(value)',
  returns:   { type: 'string', desc: 'A string of the form "[object Type]". Called on a plain object that is the notorious "[object Object]"; called on anything else via .call it reveals the internal type.' },

  category:    'Object method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Two jobs in one method. Directly it produces the least helpful string in JavaScript; borrowed with .call it is the most reliable type check the language has ever had.',

  cheat: {
    commonCall: 'Object.prototype.toString.call(v)',
    returns:    "'[object Array]', '[object Null]', …",
    replaces:   'typeof, which cannot distinguish arrays, dates or null',
    watchOut:   'Symbol.toStringTag lets any object lie about its type',
  },

  parameters: [],

  demoParams: [
    { name: 'json', type: 'string', hint: 'any JSON value', input: 'text' },
  ],
  demoTemplate: 'Object.prototype.toString.call(JSON.parse({json}))',
  cases: [
    { id: 'object', label: 'an object',        values: { json: '{"a":1}' } },
    { id: 'array',  label: 'an array (!)',     values: { json: '[1,2]' } },
    { id: 'null',   label: 'null (!)',         values: { json: 'null' } },
    { id: 'number', label: 'a number',         values: { json: '42' } },
    { id: 'string', label: 'a string',         values: { json: '"hi"' } },
  ],
  demoExplainer: "Each value reports its internal type, and the two marked cases are the ones typeof gets wrong. An array is '[object Array]' here while typeof says 'object'; null is '[object Null]' while typeof famously also says 'object'. That is why this borrowed call was the standard type check for two decades — it is the only mechanism that distinguishes arrays, dates, regexes and null from ordinary objects in a single expression. Note the demo has to use .call, because calling toString on the value directly would find that type own toString instead.",

  patterns: [
    {
      name: 'A general type tag',
      desc: 'The classic helper, still used by libraries.',
      code: 'const typeOf = v =>\n  Object.prototype.toString.call(v).slice(8, -1);',
    },
    {
      name: 'Prefer the specific check',
      desc: 'Clearer and faster where one exists.',
      code: 'Array.isArray(v);\nv instanceof Date;\nv === null;',
    },
    {
      name: 'Give your class a tag',
      desc: 'Symbol.toStringTag sets the reported name.',
      code: 'class Box { get [Symbol.toStringTag]() { return "Box"; } }',
    },
  ],

  examples: [
    { title: 'Plain object',   code: 'Object.prototype.toString.call({})',   returns: "'[object Object]'" },
    { title: 'Array',          code: 'Object.prototype.toString.call([])',   returns: "'[object Array]'" },
    { title: 'null',           code: 'Object.prototype.toString.call(null)', returns: "'[object Null]'" },
    { title: 'typeof is wrong',code: 'typeof null',                          returns: "'object'" },
    { title: 'Date',           code: 'Object.prototype.toString.call(new Date())', returns: "'[object Date]'" },
    { title: 'A custom tag',   code: 'Object.prototype.toString.call({[Symbol.toStringTag]: "X"})', returns: "'[object X]'" },
  ],

  pitfalls: [
    {
      name: 'Calling it directly gives [object Object] and nothing else',
      desc: 'This is where that string comes from: any plain object coerced to text produces it, because toString has no idea what your object contains. It appears in template literals, in string concatenation and as an alert body, and it always means the same thing — an object was converted to a string.',
      wrong: { label: 'Useless output', code: '`Value: ${{a: 1}}`', output: "'Value: [object Object]'" },
      fix:   { label: 'Serialise it',   code: '`Value: ${JSON.stringify({a: 1})}`', output: "'Value: {\"a\":1}'" },
    },
    {
      name: 'Symbol.toStringTag lets objects lie',
      desc: 'Since ES2015 any object can declare its own tag, so the result is no longer a trustworthy view of the internal type. It remains excellent for the built-ins, and is not a security check.',
      wrong: { label: 'Claims to be an Array', code: 'Object.prototype.toString.call({[Symbol.toStringTag]: "Array"})', output: "'[object Array]'" },
      fix:   { label: 'The real check',        code: 'Array.isArray({[Symbol.toStringTag]: "Array"})', output: 'false' },
    },
    {
      name: 'You must use .call',
      desc: 'Calling value.toString() finds the type own override — an array joins with commas, a date formats itself, a number prints digits. Only borrowing the Object.prototype version gives the type tag.',
      wrong: { label: 'Array override', code: '[1, 2].toString()', output: "'1,2'" },
      fix:   { label: 'Borrowed',       code: 'Object.prototype.toString.call([1, 2])', output: "'[object Array]'" },
    },
    {
      name: 'valueOf and toLocaleString are near-useless here',
      desc: 'Object.prototype.valueOf returns the object itself, so it does nothing during coercion and lets toString take over. toLocaleString simply calls toString. Both exist to be OVERRIDDEN by Date, Number and Array — on a plain object neither does anything interesting.',
      wrong: { label: 'Returns itself', code: 'const o = {};\no.valueOf() === o', output: 'true' },
      fix:   { label: 'Override it',    code: 'const money = {valueOf: () => 5};\nmoney * 2', output: '10' },
    },
  ],

  when: {
    use: [
      'A single expression that distinguishes every built-in type',
      'Writing a general-purpose type-tag helper',
      'Supporting very old runtimes where Array.isArray is absent',
      'Understanding where [object Object] came from',
    ],
    avoid: [
      'Checking for an array → Array.isArray',
      'Checking for null → v === null',
      'Checking a class instance → instanceof',
      'Anything security-relevant → the tag can be forged',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string each call',
    cpython:    'V8: Builtins-object-tostring',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded; the value is only inspected',
  },

  related: [
    { name: 'Array.prototype.toString', slug: 'array-tostring',  when: 'The array override, which joins with commas' },
    { name: 'Array.isArray',            slug: 'array-isarray',   when: 'The correct modern array check' },
    { name: 'Object.keys',              slug: 'object-keys',     when: 'Seeing what is actually in the object' },
    { name: 'Object.getPrototypeOf',    slug: 'object-getprototypeof', when: 'A different way to identify an object kind' },
  ],

  faq: [
    {
      q: 'Why does my object print as [object Object]?',
      a: 'Because string coercion calls toString, and the default implementation knows only the internal type — not your data. Use JSON.stringify for a readable form, or give the class a toString of its own.',
      code: 'JSON.stringify(obj);\nclass P { toString() { return `P(${this.x})`; } }',
    },
    {
      q: 'Is this still the right way to check types?',
      a: 'Not usually. Array.isArray, instanceof and === null are clearer and faster for the specific checks, and Symbol.toStringTag means the tag can be forged. It keeps a niche as a one-expression tag for any value, which is why utility libraries still contain it.',
      code: 'const typeOf = v => Object.prototype.toString.call(v).slice(8, -1);',
    },
    {
      q: 'What do valueOf and toLocaleString do?',
      a: 'On a plain object, essentially nothing. valueOf returns the object itself, which is why coercion falls through to toString; toLocaleString just delegates to toString. Both are hooks that Date, Number and Array override — valueOf is how a Date becomes a number in arithmetic.',
      code: 'const d = new Date();\nd.valueOf();   // a timestamp\n+d;            // the same number',
    },
    {
      q: 'Why does the demo use .call?',
      a: 'Because almost every built-in type overrides toString with something more useful — an array joins its elements, a date formats itself. Borrowing the Object.prototype version bypasses those overrides and gets the raw type tag.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'toString and valueOf present from the first version as the coercion hooks.' },
    { version: 'ES3',    note: 'toLocaleString added, delegating to toString on plain objects.' },
    { version: 'ES2015', note: 'Symbol.toStringTag made the reported tag customisable, ending its reliability as a type check.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString',
    meta:  'Object.prototype.toString',
  },

};
