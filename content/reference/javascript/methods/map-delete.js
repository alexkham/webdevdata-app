// content/reference/javascript/methods/map-delete.js
//
// clear is consolidated here: the same removal operation for everything at
// once, and its differing return value is the one thing worth contrasting.

export const meta = {
  slug:        'map-delete',
  name:        'Map.prototype.delete',
  signature:   'map.delete(key)',
  blurb:       'Removes an entry and TELLS you whether it was there — unlike the delete operator.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map delete remove clear entry boolean return size operator memory leak es2015 javascript',
};

export const method = {
  slug:      'map-delete',
  name:      'Map.prototype.delete',
  signature: 'map.delete(key)',
  returns:   { type: 'boolean', desc: 'True if an entry was removed, false if the key was not there. clear() removes everything and returns undefined.' },

  category:    'Map method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A useful return value, which the delete operator on objects does not give you — that one reports whether deletion was ALLOWED, not whether anything was removed.',

  cheat: {
    commonCall: 'map.delete(key)',
    returns:    'boolean — was it actually there?',
    replaces:   'delete obj[key], which cannot tell you',
    watchOut:   'a Map holds keys strongly — use WeakMap for object keys',
  },

  parameters: [
    { name: 'key', type: 'any', required: true, default: null, desc: 'The key to remove, matched by SameValueZero. A missing key is not an error — it simply returns false.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs, e.g. [["a",1]]', input: 'text' },
    { name: 'k',    type: 'string', hint: 'key to delete',             input: 'text' },
  ],
  demoTemplate: '(m => [m.delete({k}), m.size])(new Map(JSON.parse({json})))',
  cases: [
    { id: 'hit',    label: 'key present → true',   values: { json: '[["a",1],["b",2]]', k: 'a' } },
    { id: 'miss',   label: 'key absent → false',   values: { json: '[["a",1]]', k: 'z' } },
    { id: 'last',   label: 'the only entry',       values: { json: '[["a",1]]', k: 'a' } },
    { id: 'empty',  label: 'from an empty Map',    values: { json: '[]', k: 'a' } },
  ],
  demoExplainer: "The pair is [did it delete, how many remain]. A present key gives true and the size drops; an absent key gives false and nothing changes. That boolean is genuinely useful — it lets you act on whether the entry existed without a separate has() call, which the delete operator on plain objects cannot do at all.",

  patterns: [
    {
      name: 'Delete and react',
      desc: 'The return value saves a has() call.',
      code: 'if (cache.delete(key)) log("evicted", key);',
    },
    {
      name: 'Empty the whole Map',
      desc: 'clear returns undefined, not a count.',
      code: 'cache.clear();',
    },
    {
      name: 'Let object keys be collected',
      desc: 'WeakMap does not hold its keys alive.',
      code: 'const meta = new WeakMap();\nmeta.set(node, data);',
    },
  ],

  examples: [
    { title: 'Present',      code: 'new Map([["a", 1]]).delete("a")', returns: 'true' },
    { title: 'Absent',       code: 'new Map().delete("a")',           returns: 'false' },
    { title: 'Twice',        code: 'const m = new Map([["a", 1]]);\n[m.delete("a"), m.delete("a")]', returns: '[true, false]' },
    { title: 'clear returns undefined', code: 'new Map([["a", 1]]).clear()', returns: 'undefined' },
    { title: 'Size after clear', code: 'const m = new Map([["a", 1]]);\nm.clear();\nm.size', returns: '0' },
    { title: 'The object operator differs', code: 'delete {}.missing', returns: 'true   // always, if configurable' },
  ],

  pitfalls: [
    {
      name: 'A Map holds its keys strongly',
      desc: 'Using DOM nodes or other objects as keys keeps them alive for as long as the Map exists, even after everything else has dropped its reference. A long-lived Map keyed by objects is a classic memory leak — WeakMap exists for exactly this.',
      wrong: { label: 'Never collected', code: 'const m = new Map();\nm.set(node, data);   // node stays alive', output: 'leak' },
      fix:   { label: 'WeakMap',         code: 'const m = new WeakMap();\nm.set(node, data);', output: 'collectable' },
    },
    {
      name: 'clear returns undefined, not a count',
      desc: 'Unlike delete, it tells you nothing. Read size before calling it if you need to know how much was discarded.',
      wrong: { label: 'No information', code: 'const removed = map.clear();', output: 'undefined' },
      fix:   { label: 'Count first',    code: 'const removed = map.size;\nmap.clear();', output: 'the old size' },
    },
    {
      name: 'Deleting during iteration is allowed but subtle',
      desc: 'A Map iterator visits entries in insertion order and honours changes made while iterating — deleting an entry you have not reached yet means it is never visited. Legal, and easy to reason about wrongly.',
      wrong: { label: 'Skips entries', code: 'for (const [k] of m) m.delete(otherKey);', output: 'otherKey never visited' },
      fix:   { label: 'Snapshot first', code: 'for (const [k] of [...m]) m.delete(k);', output: 'iterates a copy' },
    },
    {
      name: 'The delete operator does not work on entries',
      desc: 'delete map[key] removes a property from the Map object, not an entry. It returns true — because there was no such property to fail on — which makes it look as though it worked.',
      wrong: { label: 'Looks successful', code: 'const m = new Map([["a", 1]]);\ndelete m["a"];\nm.size', output: '1' },
      fix:   { label: 'Use the method',   code: 'm.delete("a");\nm.size', output: '0' },
    },
  ],

  when: {
    use: [
      'Removing one entry, especially when you want to know it existed',
      'Cache eviction',
      'clear() to reset a Map without reallocating it',
    ],
    avoid: [
      'Object keys that should be garbage collected → WeakMap',
      'Removing many entries by a predicate → rebuild from a filtered spread',
      'You want the removed value → get it first, delete returns only a boolean',
    ],
  },

  notes: {
    complexity: 'O(1) average for delete; O(n) for clear',
    return:     'A boolean from delete, undefined from clear',
    cpython:    'V8: Builtins-map-delete',
    memory:     'Frees the entry; the backing store may not shrink immediately',
    threadSafe: 'Single-threaded; deletion during iteration is defined but easy to misread',
  },

  related: [
    { name: 'Map.prototype.has',  slug: 'map-has',       when: 'Testing existence without removing' },
    { name: 'Map.prototype.set',  slug: 'map-set',       when: 'Adding entries back' },
    { name: 'Map.size',           slug: 'map-size',      when: 'Checking what is left' },
    { name: 'Map.prototype.keys', slug: 'map-iterators', when: 'Iterating while deleting, carefully' },
  ],

  faq: [
    {
      q: 'Why does Map.delete return a boolean when the operator does not?',
      a: 'Because they answer different questions. The delete operator reports whether the property COULD be deleted — it is true even for a property that never existed. Map.delete reports whether an entry was actually removed, which is the useful answer.',
      code: 'delete {}.nope;                 // true\nnew Map().delete("nope");       // false',
    },
    {
      q: 'When should I use WeakMap instead?',
      a: 'Whenever the keys are objects whose lifetime you do not control — DOM nodes, component instances, request objects. A WeakMap does not keep its keys alive, so entries disappear when the key is collected. The cost is that it is not iterable and has no size.',
    },
    {
      q: 'How do I remove everything matching a condition?',
      a: 'There is no filter. Either iterate a snapshot and delete, or rebuild the Map from a filtered list of pairs — the second is usually clearer.',
      code: 'const kept = new Map([...m].filter(([k, v]) => v > 0));',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map added with delete and clear, along with WeakMap for collectable object keys.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete',
    meta:  'Map.prototype.delete',
  },

};
