// content/reference/javascript/methods/map-size.js

export const meta = {
  slug:        'map-size',
  name:        'Map.prototype.size',
  signature:   'map.size',
  blurb:       'A real count, read in O(1) — the thing objects never had.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Map size length count entries getter accessor Object.keys length empty check es2015 javascript',
};

export const method = {
  slug:      'map-size',
  name:      'Map.prototype.size',
  signature: 'map.size',
  returns:   { type: 'number', desc: 'The number of entries. A getter, not a method — no parentheses — and read-only.' },

  category:    'Map accessor',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Counting an object means building an array of its keys first. A Map just knows, which is one of the quieter reasons to prefer it for collections that change.',

  cheat: {
    commonCall: 'map.size',
    returns:    'the entry count',
    replaces:   'Object.keys(obj).length',
    watchOut:   'no parentheses, and not writable',
  },

  parameters: [],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON pairs, e.g. [["a",1]]', input: 'text' },
  ],
  demoTemplate: 'new Map(JSON.parse({json})).size',
  cases: [
    { id: 'two',    label: 'two entries',              values: { json: '[["a",1],["b",2]]' } },
    { id: 'dupe',   label: 'duplicate key COLLAPSES (!)', values: { json: '[["a",1],["a",2]]' } },
    { id: 'one',    label: 'one entry',                values: { json: '[["a",1]]' } },
    { id: 'empty',  label: 'empty Map',                values: { json: '[]' } },
    { id: 'mixed',  label: 'mixed key types',          values: { json: '[["a",1],[2,2],[true,3]]' } },
  ],
  demoExplainer: "The count is of ENTRIES, and the second case shows why that matters when building from pairs: a repeated key does not add a second entry, it overwrites the first, so three input pairs can yield fewer entries than you passed. The last case confirms keys of different types coexist happily — a string, a number and a boolean are three distinct keys. Note there are no parentheses: size is a getter.",

  patterns: [
    {
      name: 'Emptiness check',
      desc: 'Reads directly, with no allocation.',
      code: 'if (map.size === 0) return;',
    },
    {
      name: 'Deduplicate and count',
      desc: 'Set is the usual tool, Map when you need values too.',
      code: 'const unique = new Map(pairs).size;',
    },
    {
      name: 'The object equivalent',
      desc: 'Builds an array purely to count it.',
      code: 'Object.keys(obj).length;',
    },
  ],

  examples: [
    { title: 'Two entries',     code: 'new Map([["a", 1], ["b", 2]]).size', returns: '2' },
    { title: 'Duplicates collapse', code: 'new Map([["a", 1], ["a", 2]]).size', returns: '1' },
    { title: 'Empty',           code: 'new Map().size',                  returns: '0' },
    { title: 'It is a getter',  code: 'typeof new Map().size',            returns: "'number'" },
    { title: 'Not writable',    code: 'const m = new Map();\nm.size = 5;\nm.size', returns: '0' },
    { title: 'Objects have no size', code: '({a: 1}).size',              returns: 'undefined' },
  ],

  pitfalls: [
    {
      name: 'It is a property, not a method',
      desc: 'map.size() throws, because the number you just read is not callable. The mirror-image mistake of array.length, and easy to make when switching between Map and the DOM APIs that do use methods.',
      wrong: { label: 'Not callable', code: 'const m = new Map();\nm.size()', output: 'TypeError: m.size is not a function' },
      fix:   { label: 'No parentheses', code: 'new Map().size', output: '0' },
    },
    {
      name: 'Assigning to it silently does nothing',
      desc: 'There is no setter, so in sloppy mode the assignment is ignored and in strict mode it throws. Either way you cannot truncate a Map by setting size — unlike an array, where setting length does remove elements.',
      wrong: { label: 'Ignored', code: 'const m = new Map([["a", 1]]);\nm.size = 0;\nm.size', output: '1' },
      fix:   { label: 'Use clear', code: 'm.clear();\nm.size', output: '0' },
    },
    {
      name: 'Duplicate pairs in the constructor collapse',
      desc: 'Building from an array of pairs applies each in order, so a repeated key overwrites rather than adding. Code that checks the size against the input length to detect duplicates works, but only if you expected the collapse.',
      wrong: { label: 'Fewer than passed', code: 'new Map([["a", 1], ["a", 2]]).size', output: '1' },
      fix:   { label: 'Detect it',         code: 'const pairs = [["a", 1], ["a", 2]];\npairs.length !== new Map(pairs).size', output: 'true — duplicates present' },
    },
    {
      name: 'Objects have no equivalent',
      desc: 'There is no size or length on a plain object, and reaching for one returns undefined rather than failing. Counting requires Object.keys, which allocates an array to throw away.',
      wrong: { label: 'undefined', code: '({a: 1}).length', output: 'undefined' },
      fix:   { label: 'Count the keys', code: 'Object.keys({a: 1}).length', output: '1' },
    },
  ],

  when: {
    use: [
      'Counting entries, or testing for emptiness',
      'Anywhere Object.keys(obj).length appears in a loop',
      'Detecting duplicate keys when building from pairs',
    ],
    avoid: [
      'Counting values that satisfy a predicate → filter a spread',
      'You want to truncate → clear, or rebuild',
      'The collection is a WeakMap → it has no size, by design',
    ],
  },

  notes: {
    complexity: 'O(1) — the count is maintained as entries change',
    return:     'A number; nothing is allocated',
    cpython:    'V8: the Map size accessor',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Map.prototype.set',    slug: 'map-set',    when: 'Adding entries, which updates the count' },
    { name: 'Map.prototype.delete', slug: 'map-delete', when: 'Removing entries, and clear' },
    { name: 'Map.prototype.has',    slug: 'map-has',    when: 'Asking about one key rather than counting' },
    { name: 'Object.keys',          slug: 'object-keys', when: 'The object equivalent, which allocates' },
  ],

  faq: [
    {
      q: 'Why size and not length?',
      a: 'length belongs to ordered, indexable things — arrays and strings. Map and Set are unordered collections in the indexing sense, so the specification uses size, as it does for the other ES2015 collections. It also keeps the two from being confused.',
    },
    {
      q: 'Is it cheaper than Object.keys(obj).length?',
      a: 'Yes, meaningfully. The count is maintained internally and read in constant time, whereas Object.keys builds a whole array of key strings and then reads its length. In a loop over many objects that difference is easy to measure.',
    },
    {
      q: 'Why does WeakMap not have size?',
      a: 'Because its entries can disappear at any time when keys are garbage collected, so any count would be unreliable and would expose collection timing. For the same reason a WeakMap cannot be iterated.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Map, Set and their size accessors added.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size',
    meta:  'Map.prototype.size',
  },

  tryInTool: [],
};
