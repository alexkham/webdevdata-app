// content/reference/javascript/methods/map-set.js

export const meta = {
  slug:        'map-set',
  name:        'Map.prototype.set',
  signature:   'map.set(key, value)',
  blurb:       'Store any value under ANY key — objects, NaN, numbers that stay numbers.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map set add key value chainable object key SameValueZero insertion order dictionary es2015 javascript',
};

export const method = {
  slug:      'map-set',
  name:      'Map.prototype.set',
  signature: 'map.set(key, value)',
  returns:   { type: 'Map', desc: 'The SAME Map, so calls chain. It mutates in place — there is no non-mutating variant.' },

  category:    'Map method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The reason to choose a Map over an object: keys keep their type and their order. A number stays a number, an object works as a key, and nothing is coerced to a string.',

  cheat: {
    commonCall: 'map.set(key, value)',
    returns:    'the same Map — chainable',
    replaces:   'obj[key] = value, when keys are not strings',
    watchOut:   'object keys match by REFERENCE, not by contents',
  },

  parameters: [
    { name: 'key',   type: 'any', required: true, default: null, desc: 'Any value at all — string, number, object, function, NaN, symbol. Matched by SameValueZero, so NaN works as a key and 0 and -0 are the same key.' },
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Setting an existing key overwrites it without changing its position in the insertion order.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs, e.g. [["a",1]]', input: 'text' },
    { name: 'k',    type: 'string', hint: 'key to set',   input: 'text' },
    { name: 'v',    type: 'number', hint: 'value to set', input: 'number' },
  ],
  demoTemplate: 'new Map(JSON.parse({json})).set({k}, {v})',
  cases: [
    { id: 'add',       label: 'a new key',            values: { json: '[["a",1]]', k: 'b', v: 2 } },
    { id: 'overwrite', label: 'overwrites in place',  values: { json: '[["a",1],["b",2]]', k: 'a', v: 9 } },
    { id: 'empty',     label: 'into an empty Map',    values: { json: '[]', k: 'a', v: 1 } },
    { id: 'numkey',    label: 'existing numeric keys',values: { json: '[[1,"x"],[2,"y"]]', k: 'z', v: 3 } },
  ],
  demoExplainer: "The output is the Map itself, which is what set returns — hence the chainable style. Overwriting an existing key replaces its value but leaves it where it was in the order, so 'a' stays first. The numeric-key case shows the headline difference from a plain object: the keys 1 and 2 remain NUMBERS here, where an object would have converted them to the strings '1' and '2'.",

  patterns: [
    {
      name: 'Chain several inserts',
      desc: 'set returns the Map, so calls compose.',
      code: 'const m = new Map().set("a", 1).set("b", 2);',
    },
    {
      name: 'Build from pairs instead',
      desc: 'The constructor takes any iterable of pairs.',
      code: 'const m = new Map([["a", 1], ["b", 2]]);',
    },
    {
      name: 'Use an object as a key',
      desc: 'Associate data without touching the object.',
      code: 'const meta = new Map();\nmeta.set(domNode, {clicks: 0});',
    },
  ],

  examples: [
    { title: 'Chainable',        code: 'new Map().set("a", 1).set("b", 2).size', returns: '2' },
    { title: 'Overwrites',       code: 'new Map([["a", 1]]).set("a", 9).get("a")', returns: '9' },
    { title: 'Numbers stay numbers', code: 'new Map().set(1, "x").get(1)', returns: "'x'" },
    { title: 'String 1 is different', code: 'new Map().set(1, "x").get("1")', returns: 'undefined' },
    { title: 'NaN works as a key', code: 'new Map().set(NaN, 1).get(NaN)', returns: '1' },
    { title: 'Objects by reference', code: 'new Map().set({}, 1).get({})', returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'Object keys match by reference, not contents',
      desc: 'Two objects with identical properties are different keys. Building a Map keyed by freshly-created objects, or by objects parsed from JSON on each request, means every lookup misses — you must hold the same reference you stored.',
      wrong: { label: 'A different object', code: 'const m = new Map();\nm.set({id: 1}, "x");\nm.get({id: 1})', output: 'undefined' },
      fix:   { label: 'Key by a primitive', code: 'm.set(1, "x");\nm.get(1)', output: "'x'" },
    },
    {
      name: 'It mutates — there is no non-mutating set',
      desc: 'Unlike the change-by-copy array methods, Map has no toSet or with. Sharing a Map across modules means any of them can change it, and React state holding a Map will not re-render unless you build a new one.',
      wrong: { label: 'Same reference', code: 'const next = m.set("a", 1);\nnext === m', output: 'true' },
      fix:   { label: 'Copy first',     code: 'const next = new Map(m).set("a", 1);', output: 'a new Map' },
    },
    {
      name: 'A Map does not serialise to JSON',
      desc: 'JSON.stringify sees no own enumerable properties and produces {} — the data vanishes silently. Convert with Object.fromEntries, or spread to pairs, before serialising.',
      wrong: { label: 'Data lost', code: 'JSON.stringify(new Map([["a", 1]]))', output: "'{}'" },
      fix:   { label: 'Convert first', code: 'JSON.stringify(Object.fromEntries(new Map([["a", 1]])))', output: "'{\"a\":1}'" },
    },
    {
      name: 'Keys are compared with SameValueZero',
      desc: 'Almost === , with two differences: NaN is equal to itself, so it works as a key, and 0 and -0 are the SAME key. That last one can merge two entries you expected to be distinct.',
      wrong: { label: 'Merged', code: 'new Map().set(0, "a").set(-0, "b").size', output: '1' },
      fix:   { label: 'Distinguish deliberately', code: 'new Map().set("0", "a").set("-0", "b").size', output: '2' },
    },
  ],

  when: {
    use: [
      'Keys that are not strings — numbers, objects, DOM nodes, functions',
      'Insertion order must be preserved for every key type',
      'Frequent additions and deletions, where Map is faster than an object',
      'Keys come from untrusted input, where __proto__ would be a hazard on an object',
    ],
    avoid: [
      'String keys you will serialise to JSON → a plain object',
      'A fixed, known set of fields → an object or a class',
      'You need spread and destructuring → objects support them directly',
      'Keys are objects you recreate each time → they will never match',
    ],
  },

  notes: {
    complexity: 'O(1) average',
    return:     'The same Map, mutated',
    cpython:    'V8: Builtins-map / OrderedHashMap',
    memory:     'Grows with the number of entries; keys are held strongly, so a Map can keep objects alive',
    threadSafe: 'Single-threaded; mutating during iteration affects what the iterator yields',
  },

  related: [
    { name: 'Map.prototype.get',    slug: 'map-get',    when: 'Reading a value back' },
    { name: 'Map.prototype.has',    slug: 'map-has',    when: 'Testing for a key without reading it' },
    { name: 'Map.prototype.delete', slug: 'map-delete', when: 'Removing an entry' },
    { name: 'Map.size',             slug: 'map-size',   when: 'Counting entries' },
  ],

  faq: [
    {
      q: 'Map or a plain object?',
      a: 'Map when keys are not strings, when insertion order matters for numeric-looking keys, or when keys come from untrusted input. An object when the data is a fixed record you will serialise, spread or destructure — Map supports none of those directly.',
      code: 'new Map([[1, "a"], ["b", 2]]);   // key types kept\n({1: "a", b: 2});                // keys become strings, reordered',
    },
    {
      q: 'Why does my object key not work?',
      a: 'Because keys are matched by identity, and a fresh object literal is a different value even with identical contents. Keep a reference to the exact object, or key by something primitive derived from it.',
      code: 'const k = {id: 1};\nm.set(k, "x");\nm.get(k);   // "x" — the same reference',
    },
    {
      q: 'How do I save a Map to JSON?',
      a: 'Convert to pairs or to a plain object first. JSON has no Map type, so the value must be reshaped on the way out and rebuilt on the way in.',
      code: 'JSON.stringify([...map]);        // as pairs\nnew Map(JSON.parse(text));       // back again',
    },
    {
      q: 'Is a Map faster than an object?',
      a: 'For frequent insertion and deletion of many keys, generally yes — objects are optimised for fixed shapes and repeated key changes force them out of that. For a small record read many times, an object is faster. Measure if it matters.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map added with guaranteed insertion order and arbitrary key types.' },
    { version: 'ES2024', note: 'Map.groupBy added as a static, complementing Object.groupBy.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set',
    meta:  'Map.prototype.set',
  },

  tryInTool: [],
};
