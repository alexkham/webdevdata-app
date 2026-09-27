// content/reference/javascript/methods/set-iterators.js
//
// values, keys, entries and forEach on one page. On a Set the "key" IS the
// value, which makes three of these near-duplicates that exist purely so a
// Set can stand in for a Map.

export const meta = {
  slug:        'set-iterators',
  name:        'Set.prototype.values, keys, entries and forEach',
  signature:   'set.values(), set.keys(), set.entries(), set.forEach(cb)',
  blurb:       'keys IS values — the same function — and entries gives you [v, v] pairs.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Set values keys entries forEach iterate for-of spread insertion order duplicate value pairs es2015 javascript',
};

export const method = {
  slug:      'set-iterators',
  name:      'Set.prototype.values, keys, entries and forEach',
  signature: 'set.values(), set.keys(), set.entries(), set.forEach(cb)',
  returns:   { type: 'Iterator', desc: 'values and keys return the SAME iterator of members — they are literally the same function. entries yields [value, value] pairs. forEach calls back with (value, value, set).' },

  category:    'Set methods',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A Set has no keys distinct from its values, so the Map-shaped methods are filled in with the value twice. That exists so code written against a Map interface can accept a Set unchanged.',

  cheat: {
    commonCall: 'for (const v of set)',
    returns:    'iterators; forEach returns undefined',
    replaces:   'nothing — the Set itself is iterable',
    watchOut:   'entries gives [v, v], and keys === values',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: false, default: 'none', desc: 'For forEach only. Called as callback(value, value, set) — the second argument is the value again, standing in for the key a Set does not have.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
  ],
  demoTemplate: '(s => [[...s.values()], [...s.entries()]])(new Set(JSON.parse({json})))',
  cases: [
    { id: 'plain',  label: 'values and entries',    values: { json: '[1,2]' } },
    { id: 'dupes',  label: 'source had duplicates', values: { json: '[1,1,2]' } },
    { id: 'order',  label: 'insertion order kept',  values: { json: '[3,1,2]' } },
    { id: 'one',    label: 'a single member',       values: { json: '[1]' } },
    { id: 'empty',  label: 'empty Set',             values: { json: '[]' } },
  ],
  demoExplainer: "The first array is the members; the second is entries, and each pair holds the same value twice. That duplication is deliberate — it lets a Set be passed to code that expects a Map-like iterable of pairs. The order case confirms insertion order is preserved: 3, 1, 2 come back in that order, not sorted. Duplicates in the source collapsed on construction, so they never reach the iterator.",

  patterns: [
    {
      name: 'Iterate members',
      desc: 'A Set is iterable — values() is implicit.',
      code: 'for (const value of set) { }',
    },
    {
      name: 'Spread to use array methods',
      desc: 'Iterators are not arrays.',
      code: 'const doubled = [...set].map(x => x * 2);',
    },
    {
      name: 'Sort the members',
      desc: 'A Set has no sort — spread first.',
      code: 'const sorted = [...set].sort((a, b) => a - b);',
    },
  ],

  examples: [
    { title: 'Members',            code: '[...new Set([1, 2]).values()]',  returns: '[1, 2]' },
    { title: 'keys is the same',   code: 'Set.prototype.keys === Set.prototype.values', returns: 'true' },
    { title: 'entries pairs a value with itself', code: '[...new Set([1]).entries()]', returns: '[[1, 1]]' },
    { title: 'Insertion order',    code: '[...new Set([3, 1, 2])]',        returns: '[3, 1, 2]' },
    { title: 'forEach args',       code: 'new Set([1]).forEach((a, b) => console.log(a, b))', returns: '1 1' },
    { title: 'No length',          code: 'new Set().values().length',      returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'A Set has no array methods',
      desc: 'No map, no filter, no sort, no reduce — those live on Array. Spread or Array.from first. The set operations added in ES2025 cover combining, but transformation still means converting.',
      wrong: { label: 'Not a function', code: 'new Set([1, 2]).map(x => x * 2)', output: 'TypeError: ...map is not a function' },
      fix:   { label: 'Spread first',   code: '[...new Set([1, 2])].map(x => x * 2)', output: '[2, 4]' },
    },
    {
      name: 'entries looks wrong until you know why',
      desc: 'Every pair is [value, value]. It is not a bug — a Set has no separate key, so the value fills both slots, letting a Set substitute for a Map in code that destructures pairs. Reading the second element expecting something different gives you the value again.',
      wrong: { label: 'Both the same', code: '[...new Set(["a"]).entries()]', output: "[['a', 'a']]" },
      fix:   { label: 'Just use values', code: '[...new Set(["a"]).values()]', output: "['a']" },
    },
    {
      name: 'forEach passes the value twice',
      desc: 'The signature is (value, value, set), mirroring Map forEach. A callback written as (value, index) gets the value in both — so what looks like an index is not one, and arithmetic on it silently misbehaves.',
      wrong: { label: 'Not an index', code: 'new Set([5]).forEach((v, i) => console.log(i))', output: '5' },
      fix:   { label: 'Use entries of an array', code: '[...new Set([5])].forEach((v, i) => console.log(i))', output: '0' },
    },
    {
      name: 'Adding during iteration can loop forever',
      desc: 'The iterator sees live changes, so a member added ahead of the cursor will be visited. Adding on every step never terminates. Iterate a snapshot when you intend to modify.',
      wrong: { label: 'Never ends', code: 'for (const x of s) s.add(x + 1);', output: 'infinite loop' },
      fix:   { label: 'Snapshot',   code: 'for (const x of [...s]) s.add(x + 1);', output: 'terminates' },
    },
  ],

  when: {
    use: [
      'Iterating members in insertion order',
      'Spreading into an array to map, filter or sort',
      'entries when passing a Set to code that expects pairs',
    ],
    avoid: [
      'You want array methods → spread, or keep an array',
      'You want an index → spread and use the array callback',
      'You need positional access → an array',
      'You want key-value pairs with distinct keys → a Map',
    ],
  },

  notes: {
    complexity: 'O(n) to traverse; O(1) to obtain an iterator',
    return:     'Iterators yielding in insertion order; forEach returns undefined',
    cpython:    'V8: Builtins-set-iterators / OrderedHashSet',
    memory:     'Iterators are lazy — spreading materialises an array',
    threadSafe: 'Single-threaded; iterators observe concurrent mutation',
  },

  related: [
    { name: 'Set.prototype.add',    slug: 'set-add',       when: 'Building the order you iterate' },
    { name: 'Set.size',             slug: 'set-size',      when: 'Counting without traversing' },
    { name: 'Map.prototype.keys',   slug: 'map-iterators', when: 'The Map equivalent, where keys differ from values' },
    { name: 'Array.prototype.map',  slug: 'array-map',     when: 'Transforming, after spreading' },
  ],

  faq: [
    {
      q: 'Why does a Set have keys() at all?',
      a: 'So it can be used interchangeably with a Map where only iteration matters. Set.prototype.keys and Set.prototype.values are the same function object — the specification aliases them deliberately.',
      code: 'Set.prototype.keys === Set.prototype.values;   // true',
    },
    {
      q: 'How do I map or filter a Set?',
      a: 'Spread to an array, transform, and build a new Set if you still want one. There are no transformation methods on Set itself — ES2025 added combining operations, not mapping.',
      code: 'const doubled = new Set([...s].map(x => x * 2));',
    },
    {
      q: 'Do I need values() to iterate?',
      a: 'No — a Set is iterable and its default iterator IS values, so for...of over the Set yields members directly. Writing values() is harmless and sometimes clearer alongside entries().',
    },
    {
      q: 'Can I sort a Set?',
      a: 'Not in place — a Set has no sort and its order is insertion order by definition. Spread, sort the array, and construct a new Set if you need one; the new Set will iterate in the sorted order.',
      code: 'const sorted = new Set([...s].sort((a, b) => a - b));',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set added with values, keys, entries and forEach, with keys aliased to values.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values',
    meta:  'Set.prototype.values',
  },

  tryInTool: [],
};
