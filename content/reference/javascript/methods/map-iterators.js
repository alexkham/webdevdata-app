// content/reference/javascript/methods/map-iterators.js
//
// keys, values, entries and forEach are one page: they are four views of the
// same ordered traversal, and the insertion-order guarantee they share is
// the single best argument for using a Map at all.

export const meta = {
  slug:        'map-iterators',
  name:        'Map.prototype.keys, values, entries and forEach',
  signature:   'map.keys(), map.values(), map.entries(), map.forEach(cb)',
  blurb:       'True insertion order for EVERY key type — where an object reorders numeric keys.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map keys values entries forEach iterate for-of insertion order spread iterator destructure es2015 javascript',
};

export const method = {
  slug:      'map-iterators',
  name:      'Map.prototype.keys, values, entries and forEach',
  signature: 'map.keys(), map.values(), map.entries(), map.forEach(cb)',
  returns:   { type: 'Iterator', desc: 'The first three return iterators, not arrays — spread them or loop them. forEach returns undefined and calls back with (value, key, map) — value FIRST.' },

  category:    'Map methods',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'All four traverse entries in insertion order, guaranteed, whatever the key types. That guarantee is what an object cannot give you: integer-like keys always jump to the front there.',

  cheat: {
    commonCall: 'for (const [k, v] of map)',
    returns:    'iterators; forEach returns undefined',
    replaces:   'Object.entries with its reordering',
    watchOut:   'forEach passes (value, key) — the reverse of what you expect',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: false, default: 'none', desc: 'For forEach only. Called as callback(value, key, map) — value first, which is the opposite order from Object.entries pairs.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs with mixed key types', input: 'text' },
  ],
  demoTemplate: '(m => [[...m.keys()], [...m.values()]])(new Map(JSON.parse({json})))',
  cases: [
    { id: 'mixed',   label: 'numeric key stays PUT (!)', values: { json: '[["b",1],[2,2],["a",3]]' } },
    { id: 'strings', label: 'plain string keys',         values: { json: '[["a",1],["b",2]]' } },
    { id: 'numbers', label: 'all numeric keys',          values: { json: '[[3,"c"],[1,"a"],[2,"b"]]' } },
    { id: 'empty',   label: 'empty Map',                 values: { json: '[]' } },
  ],
  demoExplainer: "The first case is the whole argument for Map. The keys were inserted as 'b', 2, 'a' and they come back in exactly that order. Build the same data as an object and Object.keys gives ['2', 'b', 'a'] — the integer-like key is moved to the front and converted to a string. The third case makes it starker: keys 3, 1, 2 stay in that order here, where an object would sort them to 1, 2, 3. If order carries meaning, an object is the wrong container.",

  patterns: [
    {
      name: 'Iterate entries',
      desc: 'A Map is directly iterable — entries() is implicit.',
      code: 'for (const [key, value] of map) { }',
    },
    {
      name: 'Values or keys alone',
      desc: 'Spread into an array to use array methods.',
      code: 'const total = [...map.values()].reduce((a, b) => a + b, 0);',
    },
    {
      name: 'forEach, watching the order',
      desc: 'Value first, key second.',
      code: 'map.forEach((value, key) => console.log(key, value));',
    },
  ],

  examples: [
    { title: 'Insertion order kept', code: '[...new Map([["b", 1], [2, 2], ["a", 3]]).keys()]', returns: "['b', 2, 'a']" },
    { title: 'An object reorders',   code: 'Object.keys({b: 1, 2: 2, a: 3})', returns: "['2', 'b', 'a']" },
    { title: 'Direct iteration',     code: '[...new Map([["a", 1]])]',        returns: "[['a', 1]]" },
    { title: 'entries is the default', code: 'new Map().entries === undefined', returns: 'false' },
    { title: 'forEach is value-first', code: 'new Map([["a", 1]]).forEach((v, k) => console.log(v, k))', returns: '1 a' },
    { title: 'No length on an iterator', code: 'new Map().keys().length',     returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'forEach passes value BEFORE key',
      desc: 'The signature is (value, key, map), which is the reverse of how a Map is written and the reverse of an Object.entries pair. Code that destructures the first parameter as a key gets the value, and usually still runs — producing wrong output rather than an error.',
      wrong: { label: 'Reversed', code: 'new Map([["a", 1]]).forEach((k, v) => `${k}=${v}`)', output: "'1=a'" },
      fix:   { label: 'Correct order', code: 'new Map([["a", 1]]).forEach((v, k) => `${k}=${v}`)', output: "'a=1'" },
    },
    {
      name: 'keys, values and entries return iterators, not arrays',
      desc: 'There is no length and no indexing. Modern runtimes DO give iterators map and filter via the ES2025 iterator helpers — but those return further iterators, not arrays, so you still need toArray or a spread to get one. Older runtimes have neither.',
      wrong: { label: 'Still an iterator', code: 'new Map([["a", 1]]).values().map(x => x)', output: 'Object [Iterator Helper] {}' },
      fix:   { label: 'Materialise it',    code: '[...new Map([["a", 1]]).values()].map(x => x)', output: '[1]' },
    },
    {
      name: 'Spreading into an object loses everything',
      desc: 'Object spread copies own enumerable PROPERTIES, and a Map keeps its entries internally — so {...map} is an empty object. Use Object.fromEntries, which consumes the iterator properly.',
      wrong: { label: 'Empty', code: '({...new Map([["a", 1]])})', output: '{}' },
      fix:   { label: 'fromEntries', code: 'Object.fromEntries(new Map([["a", 1]]))', output: '{a: 1}' },
    },
    {
      name: 'Mutating during iteration is visible',
      desc: 'The iterator reflects live changes — an entry added ahead of the cursor WILL be visited, which can loop forever if you add on every step. Iterate a spread snapshot when you intend to modify.',
      wrong: { label: 'Can loop forever', code: 'for (const [k] of m) m.set(k + "x", 1);', output: 'never terminates' },
      fix:   { label: 'Snapshot',         code: 'for (const [k] of [...m]) m.set(k + "x", 1);', output: 'terminates' },
    },
  ],

  when: {
    use: [
      'Iterating a collection where insertion order matters',
      'Keys that are numbers or objects, where an object would reorder or coerce',
      'Feeding keys or values into array methods, via spread',
      'Converting to pairs for serialisation',
    ],
    avoid: [
      'You want array methods directly → spread first, or keep an array',
      'Serialising → Object.fromEntries or spread to pairs',
      'Order does not matter and keys are strings → an object is simpler',
      'You need random access by index → an array',
    ],
  },

  notes: {
    complexity: 'O(n) to traverse; O(1) to obtain an iterator',
    return:     'Iterators that yield in insertion order; forEach returns undefined',
    cpython:    'V8: Builtins-map-iterators / OrderedHashMap',
    memory:     'Iterators are lazy — spreading materialises an array',
    threadSafe: 'Single-threaded; iterators observe concurrent mutation',
  },

  related: [
    { name: 'Map.prototype.set',      slug: 'map-set',          when: 'Building the order you are iterating' },
    { name: 'Map.size',               slug: 'map-size',         when: 'Counting without traversing' },
    { name: 'Object.entries',         slug: 'object-entries',   when: 'The object equivalent, which reorders' },
    { name: 'Object.fromEntries',     slug: 'object-fromentries', when: 'Converting a Map to a plain object' },
  ],

  faq: [
    {
      q: 'Do I need entries() to iterate?',
      a: 'No — a Map is iterable and its default iterator IS entries, so for...of over the Map itself yields [key, value] pairs. Writing entries() explicitly is harmless and occasionally clearer.',
      code: 'for (const [k, v] of map) { }\nfor (const [k, v] of map.entries()) { }   // identical',
    },
    {
      q: 'Why does forEach put the value first?',
      a: 'For consistency with Array.prototype.forEach, where the callback receives (element, index). A Map treats the value as the element and the key as its index-equivalent. It reads backwards, but it is deliberate.',
    },
    {
      q: 'How is the order different from an object?',
      a: 'A Map preserves insertion order for every key. An object lists integer-like keys first in ascending numeric order, then string keys in insertion order — and converts all keys to strings. If order is data, use a Map.',
      code: '[...new Map([[2, "a"], [1, "b"]]).keys()];   // [2, 1]\nObject.keys({2: "a", 1: "b"});               // [\'1\', \'2\']',
    },
    {
      q: 'Why is {...map} empty?',
      a: 'Because object spread copies own enumerable properties, and a Map has none — its entries live in internal slots. Array spread works, because it uses the iterator. Object.fromEntries is the right conversion.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map added with keys, values, entries, forEach and a guaranteed insertion order.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries',
    meta:  'Map.prototype.entries',
  },

  tryInTool: [],
};
