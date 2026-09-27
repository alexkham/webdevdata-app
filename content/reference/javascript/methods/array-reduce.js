// content/reference/javascript/methods/array-reduce.js

export const meta = {
  slug:        'array-reduce',
  name:        'Array.prototype.reduce',
  signature:   'array.reduce(callback[, initialValue])',
  blurb:       'Collapse an array to a single value — and the reason to always pass an initial value.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array reduce fold accumulate sum aggregate accumulator initial value es5 javascript',
};

export const method = {
  slug:      'array-reduce',
  name:      'Array.prototype.reduce',
  signature: 'array.reduce(callback[, initialValue])',
  returns:   { type: 'any', desc: 'Whatever the callback returned on the final iteration. With an initialValue and an empty array, that value is returned untouched.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The general-purpose one: map, filter and join can all be written with it. Omitting the initial value is what turns it from useful into a source of runtime errors.',

  cheat: {
    commonCall: 'items.reduce((acc, x) => acc + x, 0)',
    returns:    'a single value of whatever type the accumulator is',
    replaces:   'a for loop that builds up a running total',
    watchOut:   'no initialValue on an empty array is a TypeError',
  },

  parameters: [
    { name: 'callback',     type: 'Function', required: true,  default: null, desc: 'Called as callback(accumulator, element, index, array). Its return value becomes the accumulator for the next element.' },
    { name: 'initialValue', type: 'any',      required: false, default: 'first element', desc: 'Starting accumulator. Omitted, the first element is used and iteration starts at the second — which is why an empty array then throws.' },
  ],

  demoParams: [
    { name: 'items',   type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'initial', type: 'number',   hint: 'initial accumulator',      input: 'number' },
  ],
  demoTemplate: '{items}.reduce((a, b) => a + b, {initial})',
  cases: [
    { id: 'sum',     label: 'sum from 0',      values: { items: '1,2,3', initial: 0 } },
    { id: 'offset',  label: 'sum from 10',     values: { items: '1,2,3', initial: 10 } },
    { id: 'single',  label: 'single element',  values: { items: '5',     initial: 0 } },
    { id: 'empty',   label: 'empty + initial', values: { items: '',      initial: 0 } },
  ],
  demoExplainer: 'The callback receives the running accumulator and the next element, and whatever it returns becomes the accumulator for the next round. Starting from 10 rather than 0 simply shifts the result by 10. The empty case is the one that matters: because an initial value is supplied, it comes straight back rather than throwing — which is exactly what happens without one.',

  patterns: [
    {
      name: 'Sum or total',
      desc: 'The canonical use, and the one always worth an explicit 0.',
      code: 'const total = prices.reduce((acc, p) => acc + p, 0);',
    },
    {
      name: 'Group into an object',
      desc: 'The accumulator does not have to be a number.',
      code: 'const byType = items.reduce((acc, i) => {\n  (acc[i.type] ??= []).push(i);\n  return acc;\n}, {});',
    },
    {
      name: 'Count occurrences',
      desc: 'A tally object built in one pass.',
      code: 'const counts = words.reduce((acc, w) => {\n  acc[w] = (acc[w] ?? 0) + 1;\n  return acc;\n}, {});',
    },
  ],

  examples: [
    { title: 'Sum',             code: '[1, 2, 3].reduce((a, b) => a + b, 0)', returns: '6' },
    { title: 'From 10',         code: '[1, 2, 3].reduce((a, b) => a + b, 10)',returns: '16' },
    { title: 'No initial works',code: '[1, 2, 3].reduce((a, b) => a + b)',    returns: '6' },
    { title: 'Empty + initial', code: '[].reduce((a, b) => a + b, 0)',        returns: '0' },
    { title: 'Empty, no initial',code: '[].reduce((a, b) => a + b)',          returns: 'TypeError: Reduce of empty array with no initial value' },
    { title: 'Build an object', code: "['a','b'].reduce((o, k) => ({...o, [k]: true}), {})", returns: '{ a: true, b: true }' },
  ],

  pitfalls: [
    {
      name: 'No initial value on an empty array throws',
      desc: 'The single reason to always pass one. Without it reduce uses the first element as the seed, and an empty array has none — so it is a TypeError rather than a sensible zero. The bug hides until the data happens to be empty.',
      wrong: { label: 'Throws on empty', code: '[].reduce((a, b) => a + b)', output: 'TypeError: Reduce of empty array with no initial value' },
      fix:   { label: 'Always seed it',  code: '[].reduce((a, b) => a + b, 0)', output: '0' },
    },
    {
      name: 'Forgetting to return the accumulator',
      desc: 'A braced callback must return the accumulator every time. Miss it on any path and the accumulator becomes undefined for the rest of the run, which usually surfaces as NaN or a crash on the next property access.',
      wrong: { label: 'Nothing returned', code: '[1, 2].reduce((acc, x) => { acc.total = x; }, {})', output: 'TypeError on the second element' },
      fix:   { label: 'Return it',        code: '[1, 2].reduce((acc, x) => { acc.total = x; return acc; }, {})', output: '{ total: 2 }' },
    },
    {
      name: 'Spreading into the accumulator is quadratic',
      desc: 'A tidy-looking one-liner that copies the whole accumulator on every element. Fine for ten items, a real problem for ten thousand — mutate the accumulator instead, since you own it.',
      wrong: { label: 'Copies each time', code: 'items.reduce((o, k) => ({...o, [k]: true}), {})', output: 'O(n²)' },
      fix:   { label: 'Mutate and return', code: 'items.reduce((o, k) => { o[k] = true; return o; }, {})', output: 'O(n)' },
    },
    {
      name: 'Using reduce where a simpler method fits',
      desc: 'reduce can express map, filter and join, but it reads far worse than any of them. Reach for it when you genuinely collapse to one value that is not just a transformed list.',
      wrong: { label: 'Reduce as map', code: 'items.reduce((acc, x) => [...acc, x * 2], [])', output: 'works, but obscure and quadratic' },
      fix:   { label: 'Just map',      code: 'items.map(x => x * 2)', output: 'clear and linear' },
    },
  ],

  when: {
    use: [
      'Summing or otherwise aggregating to a single value',
      'Building an object or Map from an array in one pass',
      'Counting or grouping',
      'Any fold where the accumulator type differs from the element type',
    ],
    avoid: [
      'One-to-one transformation → map',
      'Selecting a subset → filter',
      'Joining into a string → join',
      'The accumulator is just a growing array → map or flatMap',
    ],
  },

  notes: {
    complexity: 'O(n) for the iteration, plus whatever the callback costs — spreading the accumulator makes it O(n²)',
    return:     'The final accumulator; the original array is never modified',
    cpython:    'V8: Builtins-array-reduce.tq',
    memory:     'Only the accumulator, unless the callback allocates per element',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'One value out per value in' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Select a subset rather than aggregate' },
    { name: 'Array.prototype.flat',   slug: 'array-flat',   when: 'Flattening, which reduce is often misused for' },
    { name: 'Array.prototype.reduceRight', slug: 'array-reduceright', when: 'The same fold, running right to left' },
  ],

  faq: [
    {
      q: 'Should I always pass an initial value?',
      a: 'Yes, unless you have already proved the array is non-empty. It costs nothing, it removes the empty-array TypeError entirely, and it makes the accumulator type obvious to the next reader.',
      code: 'items.reduce((a, b) => a + b, 0)',
    },
    {
      q: 'What happens without an initial value?',
      a: 'The first element becomes the accumulator and iteration starts at the second. That is fine for a non-empty array of the right type, and a TypeError the moment the array is empty.',
      code: '[1, 2, 3].reduce((a, b) => a + b)   // 6\n[].reduce((a, b) => a + b)          // TypeError',
    },
    {
      q: 'Why is my object-building reduce slow?',
      a: 'Because spreading the accumulator copies everything built so far on every element, making it quadratic. The accumulator is yours alone — mutate it and return it.',
      code: 'items.reduce((o, k) => { o[k] = true; return o; }, {})',
    },
  ],

  history: [
    { version: 'ES5', note: 'Array.prototype.reduce standardised in 2009, alongside reduceRight.' },
    { version: 'ES2019', note: 'flat and flatMap arrived, removing the most common reduce misuse.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
    meta:  'Array.prototype.reduce',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are aggregating' },
  ],
};
