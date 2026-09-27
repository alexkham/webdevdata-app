// content/reference/javascript/methods/object-getownpropertynames.js
//
// getOwnPropertySymbols is consolidated here: the same job for the other
// half of the key space, and the two are only useful understood together.

export const meta = {
  slug:        'object-getownpropertynames',
  name:        'Object.getOwnPropertyNames',
  signature:   'Object.getOwnPropertyNames(object)',
  blurb:       'Every own string key, including the non-enumerable ones Object.keys hides.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.getOwnPropertyNames getOwnPropertySymbols non-enumerable hidden keys length prototype methods introspect javascript',
};

export const method = {
  slug:      'object-getownpropertynames',
  name:      'Object.getOwnPropertyNames',
  signature: 'Object.getOwnPropertyNames(object)',
  returns:   { type: 'string[]', desc: 'Every own STRING key, enumerable or not. Symbol keys are excluded — those need getOwnPropertySymbols.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Object.keys with the filter removed. It is an introspection tool rather than an iteration tool — the properties it reveals are usually hidden for a reason.',

  cheat: {
    commonCall: 'Object.getOwnPropertyNames(o)',
    returns:    'every own string key',
    replaces:   'Object.keys when non-enumerable properties matter',
    watchOut:   'still own-only, and still no symbols',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'The object to inspect. Primitives are coerced; null and undefined throw TypeError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object or array', input: 'text' },
  ],
  demoTemplate: 'Object.getOwnPropertyNames(JSON.parse({json}))',
  cases: [
    { id: 'array',   label: 'array → length appears (!)', values: { json: '[10,20]' } },
    { id: 'empty',   label: 'empty array → just length',  values: { json: '[]' } },
    { id: 'object',  label: 'plain object',               values: { json: '{"a":1,"b":2}' } },
    { id: 'nested',  label: 'nested not explored',        values: { json: '{"a":{"b":1}}' } },
    { id: 'emptyobj',label: 'empty object',               values: { json: '{}' } },
  ],
  demoExplainer: "The array cases are the demonstrable difference. Object.keys([10,20]) gives just the indices; this gives '0', '1' and 'length' — because length is a genuine own property of every array, merely a non-enumerable one. An empty array still has it, which is why the second case returns a one-element list rather than nothing. On a plain object parsed from JSON the two methods agree, since everything created by assignment or a literal is enumerable. What this demo cannot show is a property hidden with defineProperty, because JSON has no way to express one.",

  patterns: [
    {
      name: 'List a class instance methods',
      desc: 'Prototype methods are non-enumerable.',
      code: 'Object.getOwnPropertyNames(Object.getPrototypeOf(instance));',
    },
    {
      name: 'Every own key, symbols included',
      desc: 'Two calls, because neither covers both.',
      code: 'const all = [\n  ...Object.getOwnPropertyNames(o),\n  ...Object.getOwnPropertySymbols(o),\n];',
    },
    {
      name: 'Prefer keys for iteration',
      desc: 'Hidden properties are hidden deliberately.',
      code: 'for (const k of Object.keys(o)) { }',
    },
  ],

  examples: [
    { title: 'Array includes length', code: 'Object.getOwnPropertyNames([1, 2])', returns: "['0', '1', 'length']" },
    { title: 'keys does not',         code: 'Object.keys([1, 2])',                returns: "['0', '1']" },
    { title: 'Empty array',           code: 'Object.getOwnPropertyNames([])',     returns: "['length']" },
    { title: 'Hidden property shown', code: 'const o = {};\nObject.defineProperty(o, "h", {value: 1});\nObject.getOwnPropertyNames(o)', returns: "['h']" },
    { title: 'keys hides it',         code: 'Object.keys(o)',                     returns: '[]' },
    { title: 'Symbols excluded',      code: 'Object.getOwnPropertyNames({[Symbol("s")]: 1})', returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'It is still own-only',
      desc: 'The name says "own" and means it. Inherited properties — including every method a class defines — are absent, because those live on the prototype. Listing an instance shows its fields and none of its methods.',
      wrong: { label: 'No methods', code: 'class A { m() {} }\nObject.getOwnPropertyNames(new A())', output: '[]' },
      fix:   { label: 'Ask the prototype', code: 'Object.getOwnPropertyNames(A.prototype)', output: "['constructor', 'm']" },
    },
    {
      name: 'Symbol keys are never included',
      desc: 'Despite returning every string key regardless of enumerability, this method ignores symbols entirely. Anything keyed by Symbol.iterator or a library symbol is invisible, and needs the separate getOwnPropertySymbols call.',
      wrong: { label: 'Missing', code: 'Object.getOwnPropertyNames({[Symbol("s")]: 1})', output: '[]' },
      fix:   { label: 'The other half', code: 'Object.getOwnPropertySymbols({[Symbol("s")]: 1}).length', output: '1' },
    },
    {
      name: 'Using it to iterate data',
      desc: 'On an array it returns length alongside the indices, so a loop over the result processes a property that is not an element. Non-enumerable generally means "not part of the data" — Object.keys is the right tool for iteration.',
      wrong: { label: 'length included', code: 'Object.getOwnPropertyNames([1, 2]).map(k => k)', output: "['0', '1', 'length']" },
      fix:   { label: 'Just the data',   code: 'Object.keys([1, 2])', output: "['0', '1']" },
    },
    {
      name: 'It does not reveal private fields',
      desc: 'A class #field is not a property at all — it is a separate internal slot. No reflection method lists it, which is what makes it genuinely private, unlike a merely non-enumerable property.',
      wrong: { label: 'Invisible', code: 'class C { #s = 1; }\nObject.getOwnPropertyNames(new C())', output: '[]' },
      fix:   { label: 'Expose it deliberately', code: 'class C { #s = 1; get s() { return this.#s; } }', output: 'via a getter' },
    },
  ],

  when: {
    use: [
      'Introspection, debugging and tooling',
      'Listing the methods on a prototype',
      'Copying an object including non-enumerable properties',
      'Understanding why a property is missing from Object.keys',
    ],
    avoid: [
      'Iterating data → Object.keys',
      'You need symbol keys → getOwnPropertySymbols as well',
      'You need inherited properties → walk the prototype chain',
      'You want values or pairs → Object.values or Object.entries',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own string keys',
    return:     'A new array of strings; the object is not modified',
    cpython:    'V8: Builtins-object-getownpropertynames',
    memory:     'Allocates the key array',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.keys',                     slug: 'object-keys',                     when: 'Enumerable keys only — the usual choice' },
    { name: 'Object.getOwnPropertyDescriptor', slug: 'object-getownpropertydescriptor', when: 'Why a given key is non-enumerable' },
    { name: 'Object.getPrototypeOf',           slug: 'object-getprototypeof',           when: 'Reaching the prototype to list its methods' },
    { name: 'Object.defineProperty',           slug: 'object-defineproperty',           when: 'Creating the hidden properties this reveals' },
  ],

  faq: [
    {
      q: 'Why does an array have a length property here but not in Object.keys?',
      a: 'Because length is a real own property that happens to be non-enumerable. Object.keys filters on the enumerable flag; this method does not. The same applies to most built-in properties, which are non-enumerable so they stay out of for...in loops.',
      code: 'Object.getOwnPropertyDescriptor([1], "length");\n// {value: 1, writable: true, enumerable: false, configurable: false}',
    },
    {
      q: 'How do I get absolutely every own key?',
      a: 'Concatenate the two calls — one for strings, one for symbols. Reflect.ownKeys does it in a single call and is the cleaner form when you need both.',
      code: 'Reflect.ownKeys(o);   // strings and symbols together',
    },
    {
      q: 'Why can I not see a class method on the instance?',
      a: 'Because methods are defined on the prototype, not on each instance, and they are non-enumerable there. Pass Object.getPrototypeOf(instance) — or the class prototype directly — to list them.',
      code: 'Object.getOwnPropertyNames(Object.getPrototypeOf(instance));',
    },
  ],

  history: [
    { version: 'ES5',    note: 'getOwnPropertyNames added with the property-attribute model.' },
    { version: 'ES2015', note: 'Symbols introduced, along with getOwnPropertySymbols and Reflect.ownKeys.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames',
    meta:  'Object.getOwnPropertyNames',
  },

  tryInTool: [],
};
