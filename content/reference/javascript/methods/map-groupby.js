// content/reference/javascript/methods/map-groupby.js

export const meta = {
  slug:        'map-groupby',
  name:        'Map.groupBy',
  signature:   'Map.groupBy(items, callback)',
  blurb:       'Group into a Map, so the group keys keep their type — dates, objects, numbers.',
  category:    'map',
  type:        'map',
  hasLiveDemo: true,
  version:     'ES2024',
  searchTerms: 'Map.groupBy Object.groupBy group buckets categorise reduce object key date key es2024 javascript',
};

export const method = {
  slug:      'map-groupby',
  name:      'Map.groupBy',
  signature: 'Map.groupBy(items, callback)',
  returns:   { type: 'Map', desc: 'A Map from each key the callback returned to an array of the items that produced it. Keys keep their original type — nothing is stringified.' },

  category:    'Map static method',
  version:     'ES2024',
  hasLiveDemo: true,

  subtitle: 'The same grouping as Object.groupBy, into a Map instead. That one difference matters whenever the grouping key is not naturally a string.',

  cheat: {
    commonCall: 'Map.groupBy(items, x => x.date)',
    returns:    'a Map of key → array',
    replaces:   'a reduce that pushes into a Map',
    watchOut:   'object keys group by REFERENCE, not by contents',
  },

  parameters: [
    { name: 'items',    type: 'iterable', required: true, default: null, desc: 'Any iterable — an array, a Set, a generator.' },
    { name: 'callback', type: 'Function', required: true, default: null, desc: 'Called as callback(element, index). Its return value becomes the group key, used as-is with no coercion — matched by SameValueZero.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: "[...Map.groupBy({items}, n => n % 2 ? 'odd' : 'even')]",
  cases: [
    { id: 'mixed',  label: 'odds and evens',   values: { items: '1,2,3,4' } },
    { id: 'allodd', label: 'only odds',        values: { items: '1,3,5' } },
    { id: 'one',    label: 'a single item',    values: { items: '2' } },
    { id: 'empty',  label: 'empty list',       values: { items: '' } },
  ],
  demoExplainer: "The result is spread to pairs so the grouping is visible. Order within each bucket follows the input, and a group appears only if something landed in it — the second case has no 'even' entry at all, so map.get('even') is undefined rather than an empty array. The real advantage over Object.groupBy is invisible with string keys like these: return a Date or an object from the callback and it stays a Date or an object here, where Object.groupBy would stringify it.",

  patterns: [
    {
      name: 'Group by a non-string key',
      desc: 'The reason this exists alongside Object.groupBy.',
      code: 'const byDate = Map.groupBy(events, e => e.date.getTime());',
    },
    {
      name: 'Group by an object reference',
      desc: 'Impossible with a plain object.',
      code: 'const byOwner = Map.groupBy(tasks, t => t.owner);',
    },
    {
      name: 'Default for an empty bucket',
      desc: 'Missing keys are undefined.',
      code: 'const odds = groups.get("odd") ?? [];',
    },
  ],

  examples: [
    { title: 'Grouped',          code: '[...Map.groupBy([1, 2, 3], n => n % 2 ? "odd" : "even")]', returns: "[['odd', [1, 3]], ['even', [2]]]" },
    { title: 'It is a Map',      code: 'Map.groupBy([1], () => "a") instanceof Map', returns: 'true' },
    { title: 'Keys keep their type', code: 'const k = {id: 1};\nMap.groupBy([1], () => k).get(k)', returns: '[1]' },
    { title: 'Object.groupBy stringifies', code: 'Object.keys(Object.groupBy([1], () => ({id: 1})))', returns: "['[object Object]']" },
    { title: 'Missing bucket',   code: 'Map.groupBy([1], () => "odd").get("even")', returns: 'undefined' },
    { title: 'Empty input',      code: 'Map.groupBy([], x => x).size', returns: '0' },
  ],

  pitfalls: [
    {
      name: 'Object keys group by reference',
      desc: 'Returning a fresh object from the callback creates a NEW group for every item, because no two are the same key. Grouping by a derived object rather than by an existing reference gives one bucket per element.',
      wrong: { label: 'One group each', code: 'Map.groupBy([1, 2], x => ({v: x % 2})).size', output: '2' },
      fix:   { label: 'A primitive key', code: 'Map.groupBy([1, 2], x => x % 2).size', output: '2   // but by value, correctly' },
    },
    {
      name: 'Absent groups are undefined, not empty arrays',
      desc: 'Same as Object.groupBy. Iterating a known list of categories and reading each from the Map gives undefined for the empty ones, which then throws on .length or .map.',
      wrong: { label: 'Throws', code: 'Map.groupBy([1], () => "odd").get("even").length', output: "TypeError: Cannot read properties of undefined" },
      fix:   { label: 'Default it', code: '(Map.groupBy([1], () => "odd").get("even") ?? []).length', output: '0' },
    },
    {
      name: 'Dates need a primitive key',
      desc: 'Two Date objects for the same instant are different references, so grouping by the Date itself splits them. Group by getTime or an ISO string, then convert back if you need a Date.',
      wrong: { label: 'Separate groups', code: 'Map.groupBy([a, b], x => new Date(x.day)).size', output: 'one group per item' },
      fix:   { label: 'Group by the value', code: 'Map.groupBy([a, b], x => new Date(x.day).getTime()).size', output: 'grouped correctly' },
    },
    {
      name: 'ES2024 — check your runtime',
      desc: 'Node 21+ and 2024-era browsers. The reduce it replaces works everywhere and is only three lines, which is still the right fallback for older targets.',
      wrong: { label: 'Missing', code: 'Map.groupBy(xs, f)', output: 'TypeError: Map.groupBy is not a function' },
      fix:   { label: 'Reduce',  code: 'xs.reduce((m, x) => {\n  const k = f(x);\n  m.set(k, [...(m.get(k) ?? []), x]);\n  return m;\n}, new Map())', output: 'same shape' },
    },
  ],

  when: {
    use: [
      'Grouping by a key that is not a string — a number, a Date value, an object reference',
      'Preserving the insertion order of first appearance for numeric keys',
      'Grouping where a key might collide with an object property name',
    ],
    avoid: [
      'String keys you will serialise → Object.groupBy',
      'You want counts rather than items → map over the groups afterwards',
      'Keys are freshly created objects → every item gets its own group',
      'Targeting runtimes older than 2024 → a reduce',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass, one callback per item',
    return:     'A new Map whose values are new arrays',
    cpython:    'V8: Builtins-map-groupby',
    memory:     'Allocates the Map plus one array per group',
    threadSafe: 'Single-threaded; the iterable is consumed once',
  },

  related: [
    { name: 'Object.groupBy',     slug: 'object-groupby', when: 'String keys, and a plain-object result' },
    { name: 'Map.prototype.get',  slug: 'map-get',        when: 'Reading a bucket back' },
    { name: 'Map.prototype.keys', slug: 'map-iterators',  when: 'Iterating the groups' },
    { name: 'Map.size',           slug: 'map-size',       when: 'Counting how many groups there are' },
  ],

  faq: [
    {
      q: 'Map.groupBy or Object.groupBy?',
      a: 'Map.groupBy when the key is not a string — it stays a number, a Date, an object. Object.groupBy when string keys are natural and you want a plain object you can serialise. Object.groupBy also gives a null-prototype result, which has its own quirks.',
      code: 'Map.groupBy(xs, x => x.id);        // number keys kept\nObject.groupBy(xs, x => x.status);  // string keys, plain object',
    },
    {
      q: 'How do I group by date?',
      a: 'By a primitive derived from it — getTime, or an ISO date string. Two Date objects for the same moment are different references and would not group together.',
      code: 'Map.groupBy(events, e => e.at.toISOString().slice(0, 10));',
    },
    {
      q: 'How do I get counts per group?',
      a: 'Group first, then map the buckets to their lengths. Building a new Map from the pairs is the tidiest form.',
      code: 'new Map([...Map.groupBy(xs, f)].map(([k, v]) => [k, v.length]));',
    },
  ],

  history: [
    { version: 'ES2024', note: 'Map.groupBy and Object.groupBy added together, after an earlier Array.prototype.group proposal was withdrawn.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy',
    meta:  'Map.groupBy',
  },

  tryInTool: [],
};
