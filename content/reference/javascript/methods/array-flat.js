// content/reference/javascript/methods/array-flat.js
//
// The demo uses a FIXED nested array with a variable depth, because a csv
// input can only produce a flat list — every depth would look identical.

export const meta = {
  slug:        'array-flat',
  name:        'Array.prototype.flat',
  signature:   'array.flat([depth])',
  blurb:       'Flatten nested arrays — ONE level by default, not all the way down.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2019',
  searchTerms: 'array flat flatten nested depth infinity holes flatMap es2019 javascript',
};

export const method = {
  slug:      'array-flat',
  name:      'Array.prototype.flat',
  signature: 'array.flat([depth])',
  returns:   { type: 'Array', desc: 'A NEW array with nested arrays spliced in up to the given depth. Empty slots (holes) are removed along the way.' },

  category:    'Array method',
  version:     'ES2019',
  hasLiveDemo: true,

  subtitle: 'The default depth is 1, not infinite — the mistake almost everyone makes on first use. Pass Infinity when you genuinely want it flat all the way down.',

  cheat: {
    commonCall: 'nested.flat()',
    returns:    'a new array, one level flatter',
    replaces:   'the old [].concat(...arrays) trick',
    watchOut:   'the default depth is 1; use flat(Infinity) for fully flat',
  },

  parameters: [
    { name: 'depth', type: 'number', required: false, default: '1', desc: 'How many levels to flatten. 0 returns a shallow copy unchanged. Infinity flattens completely however deep the nesting goes.' },
  ],

  demoParams: [
    { name: 'depth', type: 'number', hint: 'levels to flatten (try 1, 2, 3)', input: 'number' },
  ],
  demoTemplate: '[1, [2, [3, [4]]]].flat({depth})',
  cases: [
    { id: 'one',   label: 'depth 1 (the default)', values: { depth: 1 } },
    { id: 'two',   label: 'depth 2',               values: { depth: 2 } },
    { id: 'three', label: 'depth 3 — fully flat',  values: { depth: 3 } },
    { id: 'zero',  label: 'depth 0 — unchanged',   values: { depth: 0 } },
  ],
  demoExplainer: 'The input is nested three levels deep. Each increment of depth peels off exactly one layer, so depth 1 — the DEFAULT — leaves [3, [4]] still nested inside. That is the surprise: calling flat() with no argument on deeply nested data looks like it did almost nothing. Depth 0 returns the array unchanged, and only depth 3 (or Infinity) flattens this particular input completely.',

  patterns: [
    {
      name: 'Flatten completely',
      desc: 'Infinity when the nesting depth is unknown.',
      code: 'const allValues = nested.flat(Infinity);',
    },
    {
      name: 'Map then flatten',
      desc: 'flatMap does both in one pass and is the usual intent.',
      code: 'const words = lines.flatMap(l => l.split(" "));',
    },
    {
      name: 'Remove holes from a sparse array',
      desc: 'A side effect of flat that is occasionally exactly what you want.',
      code: 'const dense = sparse.flat();',
    },
  ],

  examples: [
    { title: 'Default depth is 1', code: '[1, [2, [3, [4]]]].flat()',        returns: '[1, 2, [3, [4]]]' },
    { title: 'Depth 2',            code: '[1, [2, [3, [4]]]].flat(2)',       returns: '[1, 2, 3, [4]]' },
    { title: 'Fully flat',         code: '[1, [2, [3, [4]]]].flat(Infinity)',returns: '[1, 2, 3, 4]' },
    { title: 'Depth 0 is a copy',  code: '[1, [2]].flat(0)',                 returns: '[1, [2]]' },
    { title: 'Simple case',        code: '[[1], [2]].flat()',                returns: '[1, 2]' },
    { title: 'Holes are removed',  code: '[1, , 3].flat()',                  returns: '[1, 3]' },
  ],

  pitfalls: [
    {
      name: 'The default depth is 1, not Infinity',
      desc: 'Calling flat() on data nested more than one level deep leaves the inner arrays intact. Because the outer layer DID flatten, it looks like the method half-worked rather than like a missing argument.',
      wrong: { label: 'Still nested', code: '[1, [2, [3]]].flat()', output: '[1, 2, [3]]' },
      fix:   { label: 'Say how deep', code: '[1, [2, [3]]].flat(Infinity)', output: '[1, 2, 3]' },
    },
    {
      name: 'It silently removes holes',
      desc: 'Empty slots in a sparse array disappear, so the length can shrink even with depth 0 on a sparse input. Handy when you want it, surprising when the length matters.',
      wrong: { label: 'Length changed', code: '[1, , 3].flat().length', output: '2  // was 3' },
      fix:   { label: 'Keep the slots', code: '[1, , 3].map(x => x)', output: 'holes preserved' },
    },
    {
      name: 'map().flat() when flatMap() was meant',
      desc: 'Chaining builds an intermediate array that is immediately thrown away. flatMap does it in one pass, and states the intent — though note flatMap only ever flattens ONE level.',
      wrong: { label: 'Two passes', code: 'lines.map(l => l.split(" ")).flat()', output: 'works, allocates twice' },
      fix:   { label: 'One pass',   code: 'lines.flatMap(l => l.split(" "))', output: 'same result' },
    },
    {
      name: 'ES2019 and newer only',
      desc: 'Not available in older runtimes or Internet Explorer. The pre-2019 idiom was concat with a spread, which flattens exactly one level.',
      wrong: { label: 'Missing method', code: 'nested.flat()', output: 'TypeError: nested.flat is not a function' },
      fix:   { label: 'Old idiom',      code: '[].concat(...nested)', output: 'one level flatter' },
    },
  ],

  when: {
    use: [
      'Flattening arrays of arrays into a single list',
      'Normalising deeply nested data with Infinity',
      'Removing holes from a sparse array',
    ],
    avoid: [
      'You are mapping then flattening → flatMap',
      'The nesting is deeper than one level and you called flat() → pass a depth',
      'Runtimes older than ES2019 → [].concat(...arrays)',
    ],
  },

  notes: {
    complexity: 'O(n) in the total number of elements across all flattened levels',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-flat.tq',
    memory:     'Allocates a new array; deep nesting recurses per level',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'flatMap combines it with one level of flattening' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'What flattening was written with before ES2019' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Narrow the array after flattening it' },
    { name: 'Array.prototype.slice',  slug: 'array-slice',  when: 'Copy a range rather than change the shape' },
  ],

  faq: [
    {
      q: 'Why did flat() not flatten everything?',
      a: 'Because the default depth is 1 — it removes exactly one level of nesting. Anything deeper stays as it is. Pass Infinity to flatten completely regardless of how deep the structure goes.',
      code: '[1, [2, [3]]].flat()          // [1, 2, [3]]\n[1, [2, [3]]].flat(Infinity)  // [1, 2, 3]',
    },
    {
      q: 'flat or flatMap?',
      a: 'flatMap when you are transforming each element into an array and want the results merged — it is one pass instead of two. Note flatMap always flattens exactly one level and takes no depth argument, so deeper nesting still needs flat afterwards.',
      code: 'lines.flatMap(l => l.split(" "))',
    },
    {
      q: 'Does flat remove empty slots?',
      a: 'Yes. Holes in a sparse array are dropped rather than preserved, so the result can be shorter than the input. That happens even at depth 0, which otherwise behaves like a plain copy.',
      code: '[1, , 3].flat()   // [1, 3]',
    },
  ],

  history: [
    { version: 'ES2019', note: 'flat and flatMap added. The proposal was briefly named flatten, renamed after it broke MooTools on the live web.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat',
    meta:  'Array.prototype.flat',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect nested array data' },
  ],
};
