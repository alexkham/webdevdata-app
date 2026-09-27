// content/reference/javascript/methods/array-unshift.js

export const meta = {
  slug:        'array-unshift',
  name:        'Array.prototype.unshift',
  signature:   'array.unshift(...items)',
  blurb:       'Add to the FRONT in place — returns the new length, and costs O(n).',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array unshift prepend add front beginning mutate length performance javascript',
};

export const method = {
  slug:      'array-unshift',
  name:      'Array.prototype.unshift',
  signature: 'array.unshift(...items)',
  returns:   { type: 'number', desc: 'The NEW length of the array — like push, not the array itself. The array is modified in place.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'push at the other end, with the same surprising return value and shift\'s performance cost. Prepending in a loop is quadratic.',

  cheat: {
    commonCall: 'items.unshift(value)',
    returns:    'number — the new length',
    replaces:   'items.splice(0, 0, value)',
    watchOut:   'O(n) per call, and multiple arguments keep their order',
  },

  parameters: [
    { name: '...items', type: 'any', required: false, default: 'none', desc: 'Any number of values, inserted at the front IN THE ORDER GIVEN — unshift(1, 2) puts 1 first, not 2.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'starting array, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to prepend',                input: 'number' },
  ],
  demoTemplate: '{items}.unshift({value})',
  cases: [
    { id: 'three', label: 'three become four', values: { items: '2,3,4', value: 1 } },
    { id: 'one',   label: 'one becomes two',   values: { items: '2',     value: 1 } },
    { id: 'empty', label: 'onto empty',        values: { items: '',      value: 1 } },
  ],
  demoExplainer: 'The outputs are NUMBERS — the new length, exactly as with push. Prepending to a three-element array gives 4, not the array. The element goes to the front and every existing element moves up one index, which is why this costs O(n) where push costs O(1).',

  patterns: [
    {
      name: 'Prepend a single item',
      desc: 'Fine for small arrays.',
      code: 'items.unshift(newest);',
    },
    {
      name: 'Non-mutating prepend',
      desc: 'Usually preferable, and it returns the array.',
      code: 'const next = [value, ...items];',
    },
    {
      name: 'Build reversed, then reverse',
      desc: 'Avoids the quadratic cost of repeated prepending.',
      code: 'for (const x of input) out.push(x);\nout.reverse();',
    },
  ],

  examples: [
    { title: 'Returns the length', code: 'const a = [2, 3];\na.unshift(1)',    returns: '3' },
    { title: 'The array after',    code: 'const a = [2, 3];\na.unshift(1);\na', returns: '[1, 2, 3]' },
    { title: 'Order is preserved', code: 'const a = [3];\na.unshift(1, 2);\na', returns: '[1, 2, 3]' },
    { title: 'Onto empty',         code: 'const a = [];\na.unshift(1);\na',   returns: '[1]' },
    { title: 'Non-mutating',       code: 'const next = [1, ...[2, 3]];\nnext', returns: '[1, 2, 3]' },
    { title: 'Arrays nest',        code: 'const a = [2];\na.unshift([1]);\na', returns: '[[1], 2]' },
  ],

  pitfalls: [
    {
      name: 'It returns the new length, not the array',
      desc: 'Identical to push. Assigning the result leaves you with an integer, and the failure only appears when something later tries to treat it as an array.',
      wrong: { label: 'Got a number', code: 'const next = items.unshift(value);', output: '4' },
      fix:   { label: 'Spread instead', code: 'const next = [value, ...items];', output: 'the array' },
    },
    {
      name: 'Prepending in a loop is quadratic',
      desc: 'Every call re-indexes the whole array, so building an array front-to-back this way is O(n²). Push and reverse once instead, which is linear.',
      wrong: { label: 'Quadratic', code: 'for (const x of input) out.unshift(x);', output: 'O(n²)' },
      fix:   { label: 'Push then reverse', code: 'for (const x of input) out.push(x);\nout.reverse();', output: 'O(n)' },
    },
    {
      name: 'Unshifting in a loop reverses your data',
      desc: 'One call with several arguments keeps their order, but calling unshift once per element does not — each new element lands in front of the previous one. Switching between the two forms silently flips the result.',
      wrong: { label: 'Loop reverses', code: 'const a = [3];\nfor (const x of [1, 2]) a.unshift(x);\na', output: '[2, 1, 3]' },
      fix:   { label: 'One call keeps order', code: 'const a = [3];\na.unshift(1, 2);\na', output: '[1, 2, 3]' },
    },
  ],

  when: {
    use: [
      'Prepending once to a small array you own',
      'Inserting at the front where a spread would be wasteful',
    ],
    avoid: [
      'Prepending repeatedly → push then reverse',
      'The array is shared or state → [value, ...items]',
      'You want the array back → a spread returns it; unshift returns a number',
    ],
  },

  notes: {
    complexity: 'O(n) — every existing element moves up one index',
    return:     'A number — the new length; the array is modified in place',
    cpython:    'V8: Builtins-array-unshift.tq',
    memory:     'May reallocate; the whole backing store is re-indexed',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.prototype.shift',  slug: 'array-shift',  when: 'Remove from the front — the other half' },
    { name: 'Array.prototype.push',   slug: 'array-push',   when: 'Add to the END, in O(1)' },
    { name: 'Array.prototype.splice', slug: 'array-splice', when: 'Insert at an arbitrary position' },
    { name: 'Array.prototype.concat', slug: 'array-concat', when: 'Combine without mutating' },
  ],

  faq: [
    {
      q: 'Why is unshift slower than push?',
      a: 'Because it changes every index. Adding to the end leaves existing positions valid; adding to the front pushes element 0 to 1, 1 to 2, and so on through the whole array. push is O(1) amortised, unshift is O(n).',
    },
    {
      q: 'How do I prepend without mutating?',
      a: 'Spread into a new array: [value, ...items]. It returns the array rather than a length, and leaves the original alone — which is what state management needs.',
      code: 'const next = [value, ...items];',
    },
    {
      q: 'Does unshift(1, 2) reverse the arguments?',
      a: 'No — they go in as written, giving [1, 2, ...]. But unshifting one at a time in a loop DOES reverse them, because each element is placed in front of the last. The two forms are not interchangeable.',
      code: 'const a = [3];\na.unshift(1, 2);                      // [1, 2, 3]\nfor (const x of [1, 2]) a.unshift(x);  // [2, 1, 3]',
    },
  ],

  history: [
    { version: 'ES3', note: 'unshift standardised in 1999 alongside push, pop and shift.' },
    { version: 'ES2015', note: 'Spread syntax made [value, ...items] the idiomatic non-mutating prepend.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift',
    meta:  'Array.prototype.unshift',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
