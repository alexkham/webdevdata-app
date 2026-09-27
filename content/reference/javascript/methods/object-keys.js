// content/reference/javascript/methods/object-keys.js

export const meta = {
  slug:        'object-keys',
  name:        'Object.keys',
  signature:   'Object.keys(object)',
  blurb:       'An array of own enumerable keys — with integer-like keys reordered ahead of the rest.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'Object.keys properties own enumerable iterate loop order integer keys for-in prototype javascript',
};

export const method = {
  slug:      'object-keys',
  name:      'Object.keys',
  signature: 'Object.keys(object)',
  returns:   { type: 'string[]', desc: 'The object OWN enumerable string keys. Never inherited ones, never symbols, never non-enumerable ones. Always strings, even for numeric keys.' },

  category:    'Object static method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The safe replacement for for...in, which walks the prototype chain. Its one surprise is ordering: integer-like keys come first, in numeric order, regardless of how you wrote them.',

  cheat: {
    commonCall: 'Object.keys(obj)',
    returns:    'an array of own enumerable string keys',
    replaces:   'for...in with a hasOwnProperty guard',
    watchOut:   'integer-like keys are reordered ahead of string keys',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'Any object. Primitives are coerced — a string yields its indices, a number yields an empty array. null and undefined throw TypeError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object, e.g. {"a":1}', input: 'text' },
  ],
  demoTemplate: 'Object.keys(JSON.parse({json}))',
  cases: [
    { id: 'simple',  label: 'two properties',     values: { json: '{"a":1,"b":2}' } },
    { id: 'order',   label: 'numeric keys FIRST (!)', values: { json: '{"2":1,"b":1,"1":1,"a":1}' } },
    { id: 'array',   label: 'an array → indices', values: { json: '[10,20]' } },
    { id: 'nested',  label: 'nested not flattened', values: { json: '{"a":{"b":1}}' } },
    { id: 'empty',   label: 'empty object',       values: { json: '{}' } },
  ],
  demoExplainer: "The second case is the one worth remembering. The keys were written in the order 2, b, 1, a — and they come back as 1, 2, b, a. Integer-like keys are always listed first in ascending NUMERIC order, and only then do string keys appear in insertion order. This is specified behaviour, not an implementation quirk, and it bites whenever an object is keyed by id and the order is assumed to be the order of insertion. Note also that keys are always strings, even when the source had numbers, and that nesting is not explored — only the top level.",

  patterns: [
    {
      name: 'Iterate safely',
      desc: 'No prototype chain, no hasOwnProperty guard needed.',
      code: 'for (const key of Object.keys(obj)) { }',
    },
    {
      name: 'Count properties',
      desc: 'Objects have no length.',
      code: 'const size = Object.keys(obj).length;',
    },
    {
      name: 'Check for emptiness',
      desc: 'The idiomatic test.',
      code: 'const isEmpty = Object.keys(obj).length === 0;',
    },
  ],

  examples: [
    { title: 'Own keys',          code: "Object.keys({a: 1, b: 2})",     returns: "['a', 'b']" },
    { title: 'Numeric first',     code: "Object.keys({b: 1, 2: 1, 1: 1})", returns: "['1', '2', 'b']" },
    { title: 'A string',          code: "Object.keys('abc')",            returns: "['0', '1', '2']" },
    { title: 'A number',          code: 'Object.keys(42)',               returns: '[]' },
    { title: 'null throws',       code: 'Object.keys(null)',             returns: 'TypeError: Cannot convert undefined or null to object' },
    { title: 'Symbols excluded',  code: "Object.keys({[Symbol('s')]: 1, a: 2})", returns: "['a']" },
  ],

  pitfalls: [
    {
      name: 'Integer-like keys are reordered',
      desc: 'They sort numerically and come before every string key, whatever the insertion order. An object used as a map from numeric ids will iterate in id order rather than the order you built it — and a key like "01" is NOT integer-like, so it stays with the strings.',
      wrong: { label: 'Not insertion order', code: "Object.keys({b: 1, 2: 1, a: 1, 1: 1})", output: "['1', '2', 'b', 'a']" },
      fix:   { label: 'Use a Map',           code: 'new Map([["b", 1], [2, 1], ["a", 1]]).keys()', output: 'insertion order, guaranteed' },
    },
    {
      name: 'null and undefined throw',
      desc: 'Every other primitive is coerced quietly — a number gives an empty array, a string gives its indices — but these two throw. An object that might be missing needs a guard or a ?? {} fallback.',
      wrong: { label: 'Throws', code: 'Object.keys(maybeNull)', output: 'TypeError: Cannot convert undefined or null to object' },
      fix:   { label: 'Fallback', code: 'Object.keys(maybeNull ?? {})', output: '[]' },
    },
    {
      name: 'Non-enumerable and symbol keys are invisible',
      desc: 'Properties defined with defineProperty default to enumerable: false and simply do not appear, nor do symbol keys. Two objects can therefore have the same Object.keys result and completely different contents.',
      wrong: { label: 'Hidden', code: "const o = {};\nObject.defineProperty(o, 'h', {value: 1});\nObject.keys(o)", output: '[]' },
      fix:   { label: 'See everything', code: 'Object.getOwnPropertyNames(o)', output: "['h']" },
    },
    {
      name: 'Keys are always strings',
      desc: 'A numeric key comes back as its string form, so strict comparison against a number fails. Convert explicitly if the numeric value is what you need.',
      wrong: { label: 'String, not number', code: 'Object.keys({1: "a"})[0] === 1', output: 'false' },
      fix:   { label: 'Convert it',         code: 'Number(Object.keys({1: "a"})[0]) === 1', output: 'true' },
    },
  ],

  when: {
    use: [
      'Iterating an object own properties',
      'Counting properties, or testing for emptiness',
      'Converting an object to an array to use array methods',
      'Anywhere for...in appears with a hasOwnProperty guard',
    ],
    avoid: [
      'You want the values → Object.values',
      'You want both → Object.entries',
      'You need insertion order for numeric keys → a Map',
      'You need inherited or non-enumerable properties → getOwnPropertyNames, or for...in',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own properties',
    return:     'A new array of strings; the object is not modified',
    cpython:    'V8: Builtins-object-keys',
    memory:     'Allocates the key array',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.values',  slug: 'object-values',  when: 'The values instead of the keys' },
    { name: 'Object.entries', slug: 'object-entries', when: 'Both together, as pairs' },
    { name: 'Object.hasOwn',  slug: 'object-hasown',  when: 'Testing one key rather than listing all' },
    { name: 'Object.assign',  slug: 'object-assign',  when: 'Copying those properties somewhere' },
  ],

  faq: [
    {
      q: 'Why are my numeric keys out of order?',
      a: 'They are in order — numeric order. The specification requires integer-like keys to be listed first, ascending, before any string key. Only string keys follow insertion order. If insertion order matters for numeric keys, use a Map, whose ordering is guaranteed for every key type.',
      code: 'Object.keys({2: "b", 1: "a"});   // [\'1\', \'2\']',
    },
    {
      q: 'Object.keys or for...in?',
      a: 'Object.keys, essentially always. for...in walks the prototype chain, so it can pick up properties from a library that extended Object.prototype — which is why every for...in in older code carries a hasOwnProperty guard. Object.keys is own-properties-only by definition.',
      code: 'for (const k of Object.keys(o)) { }   // safe\nfor (const k in o) { if (Object.hasOwn(o, k)) { } }',
    },
    {
      q: 'How do I get the number of properties?',
      a: 'Object.keys(obj).length — objects have no size or length property. It allocates an array to count, so for a hot path where you only need the count, a Map with its size property is a better data structure.',
      code: 'Object.keys(obj).length;\nmap.size;   // no allocation',
    },
    {
      q: 'Why does Object.keys(42) not throw?',
      a: 'Because the argument is coerced to an object, and a boxed number has no own enumerable properties — so you get an empty array. Only null and undefined cannot be coerced, which is why those two are the only values that throw.',
    },
  ],

  history: [
    { version: 'ES5',    note: 'Object.keys added, giving a safe alternative to for...in.' },
    { version: 'ES2015', note: 'Property enumeration order specified, formalising the integer-keys-first rule.' },
    { version: 'ES2017', note: 'Object.values and Object.entries completed the trio.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys',
    meta:  'Object.keys',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the object you are iterating' },
  ],
};
