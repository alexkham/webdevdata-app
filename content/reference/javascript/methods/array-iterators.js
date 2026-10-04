// content/reference/javascript/methods/array-iterators.js
//
// Combined entry for entries, keys and values. All three return an Array
// Iterator and differ only in what each step yields, so one page serves
// them better than three near-identical ones. The demo dispatches by name.

export const meta = {
  slug:        'array-iterators',
  name:        'Array.prototype.entries, keys and values',
  signature:   'array.entries() | array.keys() | array.values()',
  blurb:       'The three iterator methods — lazy, one-shot, and mostly useful with for...of.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'array entries keys values iterator for of destructure index lazy one-shot es2015 javascript',
};

export const method = {
  slug:      'array-iterators',
  name:      'Array.prototype.entries, keys and values',
  signature: 'array.entries() | array.keys() | array.values()',
  returns:   { type: 'Array Iterator', desc: 'A lazy iterator. entries yields [index, value] pairs, keys yields indices, values yields elements. Not an array — spread or loop it to see the contents.' },

  category:    'Array methods',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'All three return an iterator rather than an array, which is why logging one shows "Object [Array Iterator] {}" instead of your data. entries is the only one most code ever needs.',

  cheat: {
    commonCall: 'for (const [i, x] of items.entries())',
    returns:    'an Array Iterator — lazy and single-use',
    replaces:   'a manual index variable in a for...of loop',
    watchOut:   'an iterator is EXHAUSTED after one pass; it cannot be reused',
  },

  parameters: [],

  demoParams: [
    { name: 'items',  type: 'string[]', hint: 'items, comma separated',      input: 'csv' },
    { name: 'method', type: 'string',   hint: 'entries, keys or values',     input: 'text' },
  ],
  demoTemplate: '[...{items}[{method}]()]',
  cases: [
    { id: 'entries', label: 'entries → pairs',   values: { items: 'a,b,c', method: 'entries' } },
    { id: 'keys',    label: 'keys → indices',    values: { items: 'a,b,c', method: 'keys' } },
    { id: 'values',  label: 'values → elements', values: { items: 'a,b,c', method: 'values' } },
    { id: 'empty',   label: 'empty array',       values: { items: '',      method: 'entries' } },
  ],
  demoExplainer: 'The demo spreads the iterator into an array so you can see what it yields — without the spread you would just get "Object [Array Iterator] {}". entries gives [index, value] pairs, keys gives the indices alone, and values gives the elements, which is what a plain for...of already does. That is why entries is the one worth remembering: it is the clean way to get the index alongside the element.',

  patterns: [
    {
      name: 'Index and value together',
      desc: 'The main reason entries exists.',
      code: 'for (const [i, item] of items.entries()) {\n  console.log(i, item);\n}',
    },
    {
      name: 'Indices as an array',
      desc: 'keys spread gives 0..n-1 without a range helper.',
      code: 'const indices = [...items.keys()];',
    },
    {
      name: 'A range of numbers',
      desc: 'A common idiom for counting.',
      code: 'const range = [...Array(5).keys()];  // [0, 1, 2, 3, 4]',
    },
  ],

  examples: [
    { title: 'entries',            code: "[...['a', 'b'].entries()]", returns: "[[0, 'a'], [1, 'b']]" },
    { title: 'keys',               code: "[...['a', 'b'].keys()]",    returns: '[0, 1]' },
    { title: 'values',             code: "[...['a', 'b'].values()]",  returns: "['a', 'b']" },
    { title: 'Without spreading',  code: "['a'].entries()",           returns: 'Object [Array Iterator] {}' },
    { title: 'Stepping manually',  code: "['a'].entries().next()",    returns: "{ value: [0, 'a'], done: false }" },
    { title: 'A counting range',   code: '[...Array(3).keys()]',      returns: '[0, 1, 2]' },
  ],

  pitfalls: [
    {
      name: 'They return an iterator, not an array',
      desc: 'Logging one shows Object [Array Iterator] {} rather than the contents, and array methods like map or length are not available on it. Spread it or loop it.',
      wrong: { label: 'Not an array', code: "['a', 'b'].entries().length", output: 'undefined' },
      fix:   { label: 'Spread first', code: "[...['a', 'b'].entries()].length", output: '2' },
    },
    {
      name: 'An iterator is single-use',
      desc: 'Once consumed it is exhausted — a second loop over the same iterator runs zero times. Call the method again for a fresh one.',
      wrong: { label: 'Second pass empty', code: 'const it = items.entries();\n[...it];\n[...it]', output: '[]' },
      fix:   { label: 'Fresh iterator',    code: '[...items.entries()];\n[...items.entries()]', output: 'both populated' },
    },
    {
      name: 'values() is usually redundant',
      desc: 'for...of over an array already yields the elements, because values IS the default iterator. Writing it out adds noise without changing anything.',
      wrong: { label: 'Redundant', code: 'for (const x of items.values()) { ... }', output: 'identical behaviour' },
      fix:   { label: 'Just iterate', code: 'for (const x of items) { ... }', output: 'same result' },
    },
    {
      name: 'entries() is not Object.entries()',
      desc: 'Array entries yields [index, value] pairs lazily; Object.entries returns a real array of [key, value] pairs. Similar names, different shapes and different types.',
      wrong: { label: 'Different things', code: "Object.entries(['a'])", output: "[['0', 'a']]  // string keys, real array" },
      fix:   { label: 'Array version',    code: "[...['a'].entries()]", output: "[[0, 'a']]  // number indices" },
    },
  ],

  when: {
    use: [
      'Getting the index alongside the element in for...of — use entries',
      'Producing a numeric range with [...Array(n).keys()]',
      'Manual step-by-step iteration with .next()',
    ],
    avoid: [
      'Plain iteration over elements → for...of directly, not values()',
      'You want an array of pairs eagerly → Object.entries, or spread',
      'You need to iterate twice → call the method again, or store the spread',
    ],
  },

  notes: {
    complexity: 'O(1) to create; O(n) to consume fully',
    return:     'An Array Iterator; the array is never modified',
    cpython:    'V8: Builtins-array-iterator.tq',
    memory:     'Lazy — nothing is materialised until you spread or loop',
    threadSafe: 'Single-threaded; mutating the array mid-iteration gives undefined behaviour',
  },

  related: [
    { name: 'Array.prototype.forEach', slug: 'array-foreach', when: 'Its callback already receives the index' },
    { name: 'Array.prototype.map',     slug: 'array-map',     when: 'Its callback also receives the index' },
    { name: 'Array.from',              slug: 'array-from',    when: 'Turn any iterator into a real array' },
    { name: 'Array.prototype.at',      slug: 'array-at',      when: 'Read one position rather than iterate' },
  ],

  faq: [
    {
      q: 'Why does logging entries() show "Object [Array Iterator] {}"?',
      a: 'Because it is an iterator, not an array — a lazy object that produces values on demand and has nothing to display until consumed. Spread it into an array or loop over it to see the contents.',
      code: "console.log([...items.entries()]);",
    },
    {
      q: 'Do I need values()?',
      a: 'Almost never. values is the array\'s default iterator, so for...of already uses it. Writing items.values() explicitly behaves identically to writing items.',
    },
    {
      q: 'How do I make a range of numbers?',
      a: '[...Array(n).keys()] is the common idiom — keys works over the holes that Array(n) creates, unlike map or forEach which skip them. Array.from({length: n}, (_, i) => i) is the more explicit alternative.',
      code: '[...Array(5).keys()]   // [0, 1, 2, 3, 4]',
    },
  ],

  history: [
    { version: 'ES2015', note: 'entries, keys and values added with the iteration protocol and for...of.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries',
    meta:  'Array.prototype.entries',
  },

};
