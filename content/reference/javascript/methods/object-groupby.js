// content/reference/javascript/methods/object-groupby.js

export const meta = {
  slug:        'object-groupby',
  name:        'Object.groupBy',
  signature:   'Object.groupBy(items, callback)',
  blurb:       'Group a list into buckets — and the result has a NULL prototype on purpose.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2024',
  searchTerms: 'Object.groupBy Map.groupBy group buckets categorise reduce null prototype partition es2024 javascript',
};

export const method = {
  slug:      'object-groupby',
  name:      'Object.groupBy',
  signature: 'Object.groupBy(items, callback)',
  returns:   { type: 'object', desc: 'An object with a NULL prototype, mapping each key the callback returned to an array of the items that produced it. Insertion order follows first appearance, subject to the usual integer-key rule.' },

  category:    'Object static method',
  version:     'ES2024',
  hasLiveDemo: true,

  subtitle: 'The built-in version of the reduce everyone wrote by hand. Its null prototype is a deliberate safety feature, and the thing most likely to catch you out.',

  cheat: {
    commonCall: 'Object.groupBy(items, x => x.type)',
    returns:    'a null-prototype object of arrays',
    replaces:   'a reduce that pushes into an accumulator',
    watchOut:   'no prototype — hasOwnProperty and toString are absent',
  },

  parameters: [
    { name: 'items',    type: 'iterable', required: true, default: null, desc: 'Any iterable — an array, a Set, a generator.' },
    { name: 'callback', type: 'Function', required: true, default: null, desc: 'Called as callback(element, index). Its return value becomes the group key, coerced to a string — so returning an object gives you one bucket named "[object Object]".' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: "Object.groupBy({items}, n => n % 2 ? 'odd' : 'even')",
  cases: [
    { id: 'mixed',  label: 'odds and evens',     values: { items: '1,2,3,4' } },
    { id: 'allodd', label: 'only odds',          values: { items: '1,3,5' } },
    { id: 'one',    label: 'a single item',      values: { items: '2' } },
    { id: 'empty',  label: 'empty list → {}',    values: { items: '' } },
  ],
  demoExplainer: "Each item is passed to the callback and filed under whatever string comes back, preserving the original order within each bucket. A key only appears if something landed in it — the second case has no 'even' property at all, rather than an empty array, so code that reads result.even must handle undefined. An empty input gives an empty object. What the output cannot show is that this object has a null prototype: it has no toString, no hasOwnProperty, and does not inherit anything from Object.prototype.",

  patterns: [
    {
      name: 'Group records by a field',
      desc: 'The everyday use.',
      code: 'const byStatus = Object.groupBy(orders, o => o.status);',
    },
    {
      name: 'Group with a Map for non-string keys',
      desc: 'Map.groupBy keeps the key as given.',
      code: 'const byDate = Map.groupBy(events, e => e.date);',
    },
    {
      name: 'Default for a missing bucket',
      desc: 'Absent keys are undefined, not empty arrays.',
      code: 'const pending = byStatus.pending ?? [];',
    },
  ],

  examples: [
    { title: 'Odds and evens',    code: 'Object.groupBy([1, 2, 3], n => n % 2 ? "odd" : "even")', returns: "{odd: [1, 3], even: [2]}" },
    { title: 'Null prototype',    code: 'Object.getPrototypeOf(Object.groupBy([1], () => "a"))', returns: 'null' },
    { title: 'No toString',       code: 'String(Object.groupBy([1], () => "a"))', returns: 'TypeError: Cannot convert object to primitive value' },
    { title: 'Missing bucket',    code: 'Object.groupBy([1], () => "odd").even', returns: 'undefined' },
    { title: 'Empty input',       code: 'Object.groupBy([], x => x)', returns: '{}' },
    { title: 'Keys are stringified', code: 'Object.groupBy([1], () => 1)', returns: "{'1': [1]}" },
  ],

  pitfalls: [
    {
      name: 'The result has a null prototype',
      desc: 'Deliberate — it means a group key of __proto__ or toString cannot interfere with anything. The cost is that the result has no inherited methods at all, so String(), template literals and hasOwnProperty all fail on it.',
      wrong: { label: 'No toString', code: 'String(Object.groupBy([1], () => "a"))', output: 'TypeError: Cannot convert object to primitive value' },
      fix:   { label: 'Give it one', code: 'Object.assign({}, Object.groupBy([1], () => "a"))', output: 'a normal object' },
    },
    {
      name: 'Absent groups are undefined, not empty arrays',
      desc: 'A bucket exists only if at least one item landed in it. Code that iterates a known set of categories and reads each one directly gets undefined for the empty ones, and then throws on .length or .map.',
      wrong: { label: 'Throws', code: 'Object.groupBy([1], () => "odd").even.length', output: "TypeError: Cannot read properties of undefined (reading 'length')" },
      fix:   { label: 'Default it', code: '(Object.groupBy([1], () => "odd").even ?? []).length', output: '0' },
    },
    {
      name: 'Keys are coerced to strings',
      desc: 'Returning a number gives a string key — and the usual integer-key ordering then applies. Returning an object gives a single bucket called "[object Object]", which silently merges everything into one group.',
      wrong: { label: 'One bucket', code: 'Object.groupBy([1, 2], x => ({id: x}))', output: "{'[object Object]': [1, 2]}" },
      fix:   { label: 'Use Map.groupBy', code: 'Map.groupBy([1, 2], x => ({id: x}))', output: 'two entries, object keys' },
    },
    {
      name: 'ES2024 — check your runtime',
      desc: 'Node 21+ and 2024-era browsers. The reduce it replaces is three lines and works everywhere, which is still the right fallback for older targets.',
      wrong: { label: 'Missing', code: 'Object.groupBy(xs, f)', output: 'TypeError: Object.groupBy is not a function' },
      fix:   { label: 'Reduce', code: 'xs.reduce((acc, x) => {\n  (acc[f(x)] ??= []).push(x);\n  return acc;\n}, {})', output: 'same shape, normal prototype' },
    },
  ],

  when: {
    use: [
      'Bucketing records by a string field',
      'Partitioning a list into named categories',
      'Replacing a hand-written grouping reduce',
    ],
    avoid: [
      'Keys are not strings → Map.groupBy, which preserves them',
      'You need the result to behave like a normal object → spread it into one',
      'You want counts rather than the items → reduce, or map over the groups',
      'Targeting runtimes older than 2024 → the reduce form',
    ],
  },

  notes: {
    complexity: 'O(n) — one pass, one callback per item',
    return:     'A new null-prototype object whose values are new arrays',
    cpython:    'V8: Builtins-object-groupby',
    memory:     'Allocates the result object plus one array per group',
    threadSafe: 'Single-threaded; the iterable is consumed once',
  },

  related: [
    { name: 'Object.fromEntries', slug: 'object-fromentries', when: 'Building a keyed object from pairs instead' },
    { name: 'Object.entries',     slug: 'object-entries',     when: 'Iterating the groups you just built' },
    { name: 'Object.values',      slug: 'object-values',      when: 'The buckets without their names' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce',   when: 'The idiom this replaces' },
  ],

  faq: [
    {
      q: 'Why does the result have a null prototype?',
      a: 'So that a group key can never collide with something inherited. If the callback returns "toString" or "__proto__", a normal object would either shadow a method or — historically — corrupt the prototype. A null-prototype object has nothing to collide with.',
      code: 'Object.getPrototypeOf(Object.groupBy([1], () => "a"));   // null',
    },
    {
      q: 'Object.groupBy or Map.groupBy?',
      a: 'Map.groupBy when the key is not a string — a date, an object, a number you want kept numeric. Object.groupBy when string keys are natural and you want a plain object shape, for example to serialise it.',
      code: 'Map.groupBy(events, e => e.date);        // Date keys preserved\nObject.groupBy(orders, o => o.status);   // string keys',
    },
    {
      q: 'Why does my template literal throw on the result?',
      a: 'Because string conversion needs toString, and a null-prototype object does not have one. Spread it into a normal object first, or serialise it with JSON.stringify, which does not rely on the prototype.',
      code: 'JSON.stringify(groups);\n{...groups};',
    },
    {
      q: 'How do I get counts instead of the items?',
      a: 'Group first, then map the buckets to their lengths. There is no built-in counting variant.',
      code: 'Object.fromEntries(\n  Object.entries(Object.groupBy(xs, f)).map(([k, v]) => [k, v.length])\n);',
    },
  ],

  history: [
    { version: 'ES2024', note: 'Object.groupBy and Map.groupBy added together, after an earlier Array.prototype.group proposal was withdrawn over naming and web-compatibility concerns.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy',
    meta:  'Object.groupBy',
  },

};
