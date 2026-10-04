// content/reference/javascript/methods/object-entries.js

export const meta = {
  slug:        'object-entries',
  name:        'Object.entries',
  signature:   'Object.entries(object)',
  blurb:       'Key-value pairs you can map, filter and sort — the workhorse of object transformation.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2017',
  searchTerms: 'Object.entries pairs key value iterate map filter transform fromEntries destructure Map es2017 javascript',
};

export const method = {
  slug:      'object-entries',
  name:      'Object.entries',
  signature: 'Object.entries(object)',
  returns:   { type: '[string, any][]', desc: 'An array of [key, value] pairs for the own enumerable properties, in Object.keys order. Each pair is a two-element array.' },

  category:    'Object static method',
  version:     'ES2017',
  hasLiveDemo: true,

  subtitle: 'The one to reach for when transforming an object. Paired with Object.fromEntries it gives objects the map and filter they never had.',

  cheat: {
    commonCall: 'Object.entries(obj)',
    returns:    'an array of [key, value] pairs',
    replaces:   'for...in with manual pair building',
    watchOut:   'the pairs are arrays, so destructure them in the callback',
  },

  parameters: [
    { name: 'object', type: 'object', required: true, default: null, desc: 'Any object. Primitives are coerced; null and undefined throw TypeError.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'a JSON object, e.g. {"a":1}', input: 'text' },
  ],
  demoTemplate: 'Object.entries(JSON.parse({json}))',
  cases: [
    { id: 'simple',  label: 'two properties',       values: { json: '{"a":1,"b":2}' } },
    { id: 'order',   label: 'numeric key first (!)',values: { json: '{"b":2,"1":1}' } },
    { id: 'mixed',   label: 'mixed value types',    values: { json: '{"a":"x","b":null}' } },
    { id: 'array',   label: 'an array → index pairs', values: { json: '[10,20]' } },
    { id: 'empty',   label: 'empty object',         values: { json: '{}' } },
  ],
  demoExplainer: "Each pair is a two-element array, which is what makes the map-filter-fromEntries pipeline possible — and why callbacks over entries almost always destructure with ([key, value]). The same integer-key reordering applies as with keys and values, but here it does no harm: each key travels with its own value, so nothing can be misaligned. An array yields index-value pairs, with the indices as strings.",

  patterns: [
    {
      name: 'Transform an object',
      desc: 'The canonical entries-map-fromEntries round trip.',
      code: 'const upper = Object.fromEntries(\n  Object.entries(obj).map(([k, v]) => [k, String(v).toUpperCase()])\n);',
    },
    {
      name: 'Filter properties out',
      desc: 'Objects have no filter of their own.',
      code: 'const clean = Object.fromEntries(\n  Object.entries(obj).filter(([, v]) => v != null)\n);',
    },
    {
      name: 'Iterate with both parts',
      desc: 'Destructure in the for...of head.',
      code: 'for (const [key, value] of Object.entries(obj)) { }',
    },
  ],

  examples: [
    { title: 'Pairs',            code: 'Object.entries({a: 1, b: 2})',   returns: "[['a', 1], ['b', 2]]" },
    { title: 'Key order applies',code: 'Object.entries({b: 2, 1: 1})',   returns: "[['1', 1], ['b', 2]]" },
    { title: 'An array',         code: 'Object.entries([10, 20])',       returns: "[['0', 10], ['1', 20]]" },
    { title: 'Round trip',       code: 'Object.fromEntries(Object.entries({a: 1}))', returns: '{a: 1}' },
    { title: 'Straight to a Map',code: 'new Map(Object.entries({a: 1}))', returns: "Map(1) {'a' => 1}" },
    { title: 'null throws',      code: 'Object.entries(null)',           returns: 'TypeError: Cannot convert undefined or null to object' },
  ],

  pitfalls: [
    {
      name: 'Forgetting to destructure the pair',
      desc: 'Each element is an ARRAY, not a key. A callback written as (k, v) receives the whole pair as k and the index as v, which produces baffling output rather than an error.',
      wrong: { label: 'Pair as first arg', code: 'Object.entries({a: 1}).map((k, v) => k)', output: "[['a', 1]]   // k is the pair" },
      fix:   { label: 'Destructure',       code: 'Object.entries({a: 1}).map(([k, v]) => k)', output: "['a']" },
    },
    {
      name: 'Keys are always strings, even from arrays',
      desc: 'Round-tripping an array through entries and fromEntries gives you an OBJECT with string keys, not an array. The structure changes shape silently.',
      wrong: { label: 'Now an object', code: 'Object.fromEntries(Object.entries([10, 20]))', output: "{'0': 10, '1': 20}" },
      fix:   { label: 'Keep it an array', code: '[10, 20].map(x => x)', output: '[10, 20]' },
    },
    {
      name: 'It allocates an array per property',
      desc: 'Every pair is a fresh two-element array on top of the outer array. For a handful of properties that is irrelevant; inside a hot loop over large objects, a plain for...of over Object.keys allocates far less.',
      wrong: { label: 'n + 1 arrays', code: 'for (const [k, v] of Object.entries(huge)) { }', output: 'allocates per property' },
      fix:   { label: 'Keys only',    code: 'for (const k of Object.keys(huge)) { const v = huge[k]; }', output: 'one array' },
    },
    {
      name: 'Only own enumerable properties, as ever',
      desc: 'Inherited, non-enumerable and symbol-keyed properties are all absent — so an entries round trip quietly drops them. Converting a class instance this way loses everything on its prototype, including its methods.',
      wrong: { label: 'Methods lost', code: 'Object.fromEntries(Object.entries(instance))', output: 'a plain object, no prototype' },
      fix:   { label: 'Copy with the prototype', code: 'Object.assign(Object.create(Object.getPrototypeOf(i)), i)', output: 'prototype kept' },
    },
  ],

  when: {
    use: [
      'Mapping or filtering an object property by property',
      'Iterating where you need both the key and the value',
      'Converting an object to a Map',
      'Sorting properties before rebuilding an object',
    ],
    avoid: [
      'You only need one side → Object.keys or Object.values',
      'Very large objects in a hot path → iterate keys and index in',
      'The source is an array → array methods directly',
      'You need inherited properties → getOwnPropertyDescriptors, or walk the chain',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of own enumerable properties',
    return:     'A new array of new two-element arrays; values are references',
    cpython:    'V8: Builtins-object-entries',
    memory:     'Allocates one array per property plus the outer array',
    threadSafe: 'Single-threaded; the object is only read',
  },

  related: [
    { name: 'Object.fromEntries', slug: 'object-fromentries', when: 'Turning the pairs back into an object' },
    { name: 'Object.keys',        slug: 'object-keys',        when: 'Keys alone, with less allocation' },
    { name: 'Object.values',      slug: 'object-values',      when: 'Values alone' },
    { name: 'Array.prototype.map',slug: 'array-map',          when: 'The transformation applied to the pairs' },
  ],

  faq: [
    {
      q: 'How do I map over an object?',
      a: 'There is no Object.map. The idiom is entries, then the array method you want, then fromEntries to rebuild. Destructure the pair in the callback and return a new pair.',
      code: 'Object.fromEntries(\n  Object.entries(obj).map(([k, v]) => [k, v * 2])\n);',
    },
    {
      q: 'Why does my callback get the whole pair?',
      a: 'Because the array elements ARE pairs — map passes each element as the first argument. Writing ([k, v]) => destructures that element; writing (k, v) => gives you the pair in k and the array index in v.',
      code: 'entries.map(([k, v]) => ...);   // right\nentries.map((k, v) => ...);     // v is the index',
    },
    {
      q: 'entries or a Map?',
      a: 'If you are converting an object to entries repeatedly, the data probably wants to be a Map already — it keeps insertion order for every key type, has a size property, and allows non-string keys. Object.entries is the bridge when the data arrives as an object.',
      code: 'const m = new Map(Object.entries(obj));',
    },
  ],

  history: [
    { version: 'ES2017', note: 'Object.entries added alongside Object.values.' },
    { version: 'ES2019', note: 'Object.fromEntries added, making the round trip practical.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries',
    meta:  'Object.entries',
  },

};
