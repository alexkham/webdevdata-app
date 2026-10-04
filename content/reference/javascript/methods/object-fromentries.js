// content/reference/javascript/methods/object-fromentries.js

export const meta = {
  slug:        'object-fromentries',
  name:        'Object.fromEntries',
  signature:   'Object.fromEntries(iterable)',
  blurb:       'Pairs back into an object — the missing half of Object.entries, and the last key wins.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2019',
  searchTerms: 'Object.fromEntries entries pairs build object Map URLSearchParams FormData duplicate keys es2019 javascript',
};

export const method = {
  slug:      'object-fromentries',
  name:      'Object.fromEntries',
  signature: 'Object.fromEntries(iterable)',
  returns:   { type: 'object', desc: 'A new plain object built from [key, value] pairs. Any iterable of pairs works — an array, a Map, URLSearchParams, FormData.' },

  category:    'Object static method',
  version:     'ES2019',
  hasLiveDemo: true,

  subtitle: 'The inverse of Object.entries, added two years later. It also converts anything pair-shaped — a Map, a query string, a form — into a plain object in one call.',

  cheat: {
    commonCall: 'Object.fromEntries(pairs)',
    returns:    'a new plain object',
    replaces:   'a reduce that assigns into an accumulator',
    watchOut:   'duplicate keys silently keep the LAST value',
  },

  parameters: [
    { name: 'iterable', type: 'iterable', required: true, default: null, desc: 'Anything iterable that yields two-element entries — an array of pairs, a Map, URLSearchParams, FormData. Keys are coerced to strings.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array of pairs, e.g. [["a",1]]', input: 'text' },
  ],
  demoTemplate: 'Object.fromEntries(JSON.parse({json}))',
  cases: [
    { id: 'pairs',     label: 'two pairs',            values: { json: '[["a",1],["b",2]]' } },
    { id: 'duplicate', label: 'duplicate key (!)',    values: { json: '[["a",1],["a",2]]' } },
    { id: 'numeric',   label: 'numeric keys stringified', values: { json: '[[1,"x"],[2,"y"]]' } },
    { id: 'nested',    label: 'object as a value',    values: { json: '[["a",{"x":1}]]' } },
    { id: 'empty',     label: 'no pairs',             values: { json: '[]' } },
  ],
  demoExplainer: "Each pair becomes one property. The second case is the behaviour to know: a repeated key is not an error and does not merge — the later value simply overwrites the earlier one, so information is lost silently. That matters when building an object from a query string where a parameter legitimately appears more than once. Numeric keys become strings, because every plain-object key is a string, and values of any type are stored as-is.",

  patterns: [
    {
      name: 'Transform an object',
      desc: 'The round trip that gives objects a map.',
      code: 'Object.fromEntries(\n  Object.entries(obj).map(([k, v]) => [k, v * 2])\n);',
    },
    {
      name: 'Query string to object',
      desc: 'URLSearchParams is already pair-shaped.',
      code: 'const params = Object.fromEntries(new URLSearchParams(location.search));',
    },
    {
      name: 'Map to plain object',
      desc: 'For JSON serialisation, which ignores Maps.',
      code: 'const plain = Object.fromEntries(map);',
    },
  ],

  examples: [
    { title: 'From pairs',       code: "Object.fromEntries([['a', 1], ['b', 2]])", returns: '{a: 1, b: 2}' },
    { title: 'Last key wins',    code: "Object.fromEntries([['a', 1], ['a', 2]])", returns: '{a: 2}' },
    { title: 'From a Map',       code: "Object.fromEntries(new Map([['a', 1]]))",  returns: '{a: 1}' },
    { title: 'Round trip',       code: 'Object.fromEntries(Object.entries({a: 1}))', returns: '{a: 1}' },
    { title: 'Numeric keys',     code: "Object.fromEntries([[1, 'x']])",           returns: "{'1': 'x'}" },
    { title: 'Empty',            code: 'Object.fromEntries([])',                   returns: '{}' },
  ],

  pitfalls: [
    {
      name: 'Duplicate keys silently collapse',
      desc: 'The last pair wins and the rest vanish without warning. A query string like ?tag=a&tag=b becomes a single tag, which is the classic way this loses real data — URLSearchParams has getAll precisely because repeats are legitimate.',
      wrong: { label: 'One value survives', code: "Object.fromEntries(new URLSearchParams('t=a&t=b'))", output: "{t: 'b'}" },
      fix:   { label: 'Collect them',       code: "new URLSearchParams('t=a&t=b').getAll('t')", output: "['a', 'b']" },
    },
    {
      name: 'It builds a plain object, losing the source type',
      desc: 'A Map converted this way gives up insertion order for numeric-looking keys, non-string keys, and its size property. Convert for serialisation, not as a general-purpose replacement.',
      wrong: { label: 'Key coerced', code: 'Object.fromEntries(new Map([[1, "a"]]))', output: "{'1': 'a'}   // now a string key" },
      fix:   { label: 'Keep the Map', code: 'const m = new Map([[1, "a"]]);', output: 'numeric key preserved' },
    },
    {
      name: 'A prototype-polluting key is a real hazard',
      desc: 'Building an object from untrusted pairs lets an attacker supply __proto__ as a key. fromEntries defines an own property rather than assigning, so it does NOT pollute the prototype — but code that reduces into an accumulator with obj[k] = v does. Know which one you are using.',
      wrong: { label: 'Assignment pollutes', code: 'pairs.reduce((o, [k, v]) => { o[k] = v; return o; }, {})', output: '__proto__ reaches the prototype' },
      fix:   { label: 'fromEntries is safe',  code: 'Object.fromEntries(pairs)', output: 'own property named __proto__' },
    },
    {
      name: 'Entries must be pair-shaped',
      desc: 'A flat array of keys, or an iterable of anything that is not indexable, throws. Each item needs an element 0 and an element 1.',
      wrong: { label: 'Not pairs', code: "Object.fromEntries(['a', 'b'])", output: 'TypeError: Iterator value a is not an entry object' },
      fix:   { label: 'Make pairs', code: "Object.fromEntries(['a', 'b'].map(k => [k, true]))", output: '{a: true, b: true}' },
    },
  ],

  when: {
    use: [
      'Rebuilding an object after mapping or filtering its entries',
      'Converting URLSearchParams or FormData into a plain object',
      'Converting a Map for JSON serialisation',
      'Building an object from a list of computed pairs',
    ],
    avoid: [
      'Keys may repeat and all values matter → collect into arrays yourself',
      'You need non-string keys or guaranteed order → keep the Map',
      'You are merging objects → Object.assign or spread',
      'The source is already an object and unchanged → no conversion needed',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of entries',
    return:     'A new plain object with Object.prototype as its prototype',
    cpython:    'V8: Builtins-object-fromentries',
    memory:     'Allocates the resulting object',
    threadSafe: 'Single-threaded; the iterable is consumed once',
  },

  related: [
    { name: 'Object.entries', slug: 'object-entries', when: 'The inverse — object to pairs' },
    { name: 'Object.assign',  slug: 'object-assign',  when: 'Merging objects rather than building from pairs' },
    { name: 'Object.groupBy', slug: 'object-groupby', when: 'Building a keyed object from a list directly' },
    { name: 'Object.keys',    slug: 'object-keys',    when: 'Reading back what you built' },
  ],

  faq: [
    {
      q: 'How do I keep every value when keys repeat?',
      a: 'Not with fromEntries — it is specified to overwrite. Group first, so each key maps to an array, then build the object from those pairs.',
      code: "const grouped = Object.groupBy(pairs, ([k]) => k);",
    },
    {
      q: 'Is it safe against prototype pollution?',
      a: 'For the __proto__ key specifically, yes — it uses property DEFINITION rather than assignment, so a pair ["__proto__", x] creates a normal own property instead of replacing the prototype. The reduce-and-assign idiom it replaced does not have that protection, which is a good reason to prefer it for untrusted input.',
      code: 'Object.fromEntries([["__proto__", 1]]).__proto__;   // 1, an own property',
    },
    {
      q: 'Can I build a Map instead?',
      a: 'Yes, and often you should — the Map constructor takes the same pair iterable, keeps insertion order for all key types, and does not coerce keys to strings.',
      code: 'new Map(pairs);',
    },
  ],

  history: [
    { version: 'ES2019', note: 'Object.fromEntries added to complete the round trip with Object.entries.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries',
    meta:  'Object.fromEntries',
  },

};
