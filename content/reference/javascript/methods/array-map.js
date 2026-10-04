// content/reference/javascript/methods/array-map.js
//
// Slug is type-prefixed: `map` collides with Map and with String.replace's
// callback forms, so Array methods carry an `array-` prefix.

export const meta = {
  slug:        'array-map',
  name:        'Array.prototype.map',
  signature:   'array.map(callback[, thisArg])',
  blurb:       'Build a NEW array by transforming every element — same length, always.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array map transform each element new array callback iterate es5 javascript',
};

export const method = {
  slug:      'array-map',
  name:      'Array.prototype.map',
  signature: 'array.map(callback[, thisArg])',
  returns:   { type: 'Array', desc: 'A NEW array of the same length, holding whatever the callback returned for each element. The original array is never modified.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'One in, one out — the result always has the same length as the input. If you are dropping elements you want filter; if you are returning nothing you want forEach.',

  cheat: {
    commonCall: 'items.map(x => x * 2)',
    returns:    'a new array, same length, original untouched',
    replaces:   'a for loop that pushes into a result array',
    watchOut:   'forgetting to return from the callback gives an array of undefined',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array) for every element. Its return value becomes the corresponding element of the new array.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions, which take `this` from the enclosing scope.' },
  ],

  demoParams: [
    { name: 'items',  type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'factor', type: 'number',   hint: 'multiplier',               input: 'number' },
  ],
  demoTemplate: '{items}.map(x => x * {factor})',
  cases: [
    { id: 'double',  label: 'double each',   values: { items: '1,2,3',  factor: 2 } },
    { id: 'triple',  label: 'triple each',   values: { items: '1,2,3',  factor: 3 } },
    { id: 'zero',    label: 'multiply by 0', values: { items: '1,2,3',  factor: 0 } },
    { id: 'negative',label: 'negate',        values: { items: '1,2,3',  factor: -1 } },
    { id: 'empty',   label: 'empty array',   values: { items: '',       factor: 2 } },
  ],
  demoExplainer: 'Every element goes through the callback and the results form a new array of exactly the same length — three in, three out, always. The empty case returns an empty array rather than an error. Note that the original array is untouched: map is one of the non-mutating Array methods, which is the dividing line that causes most Array confusion.',

  patterns: [
    {
      name: 'Extract one field from each object',
      desc: 'The single most common use.',
      code: 'const names = users.map(u => u.name);',
    },
    {
      name: 'Convert types across an array',
      desc: 'Parsing a row of strings into numbers.',
      code: "const nums = ['1', '2', '3'].map(Number);",
    },
    {
      name: 'Use the index',
      desc: 'The callback receives (element, index, array).',
      code: 'const numbered = items.map((x, i) => `${i + 1}. ${x}`);',
    },
  ],

  examples: [
    { title: 'Double each',      code: '[1, 2, 3].map(x => x * 2)',           returns: '[2, 4, 6]' },
    { title: 'Extract a field',  code: '[{n: 1}, {n: 2}].map(o => o.n)',      returns: '[1, 2]' },
    { title: 'Empty stays empty',code: '[].map(x => x * 2)',                  returns: '[]' },
    { title: 'Original untouched', code: 'const a = [1, 2];\na.map(x => x * 2);\na', returns: '[1, 2]' },
    { title: 'Missing return',   code: '[1, 2].map(x => { x * 2 })',          returns: '[undefined, undefined]' },
    { title: 'parseInt trap',    code: "['1', '2', '3'].map(parseInt)",       returns: '[1, NaN, NaN]' },
  ],

  pitfalls: [
    {
      name: 'A braced callback with no return gives undefined',
      desc: 'An arrow function with braces needs an explicit return. Without it every element becomes undefined — and because the array is still the right length, the mistake often survives until something downstream breaks.',
      wrong: { label: 'No return', code: '[1, 2].map(x => { x * 2 })', output: '[undefined, undefined]' },
      fix:   { label: 'Return it', code: '[1, 2].map(x => x * 2)', output: '[2, 4]' },
    },
    {
      name: 'map(parseInt) passes the index as the radix',
      desc: 'The classic. map calls the callback with three arguments, and parseInt takes (string, radix) — so the index becomes the radix. Index 1 is an invalid radix and index 2 parses "3" in base 2.',
      wrong: { label: 'Index becomes radix', code: "['1', '2', '3'].map(parseInt)", output: '[1, NaN, NaN]' },
      fix:   { label: 'Wrap it',             code: "['1', '2', '3'].map(x => parseInt(x, 10))", output: '[1, 2, 3]' },
    },
    {
      name: 'Using map when you meant forEach',
      desc: 'If the callback returns nothing, map builds a whole array of undefined and throws it away. It is not wrong so much as wasteful and misleading to a reader — forEach states the intent.',
      wrong: { label: 'Array discarded', code: 'items.map(x => console.log(x));', output: 'builds [undefined, ...] for nothing' },
      fix:   { label: 'Use forEach',     code: 'items.forEach(x => console.log(x));', output: 'no array built' },
    },
    {
      name: 'map cannot drop elements',
      desc: 'The output length always equals the input length. Returning undefined for unwanted elements leaves holes rather than removing them — filter is the tool that changes the length.',
      wrong: { label: 'Leaves undefined', code: '[1, 2, 3].map(x => x > 1 ? x : undefined)', output: '[undefined, 2, 3]' },
      fix:   { label: 'Filter first',     code: '[1, 2, 3].filter(x => x > 1)', output: '[2, 3]' },
    },
  ],

  when: {
    use: [
      'Transforming every element into something else',
      'Extracting one field from an array of objects',
      'Converting types across a whole array',
      'Anywhere a for loop would just push into a result array',
    ],
    avoid: [
      'You need fewer elements out than in → filter',
      'The callback returns nothing → forEach',
      'You are reducing to a single value → reduce',
      'You need to stop early → a for...of loop with break',
    ],
  },

  notes: {
    complexity: 'O(n) — the callback runs once per element',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-map.tq — the fast path requires a packed array',
    memory:     'Allocates a second array the same length as the input',
    threadSafe: 'Single-threaded; a callback that mutates the source array sees undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Select a subset instead of transforming each element' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'Collapse to a single value rather than a new array' },
    { name: 'Array.prototype.flat',   slug: 'array-flat',   when: 'flatMap combines map with one level of flattening' },
    { name: 'Array.prototype.sort',   slug: 'array-sort',   when: 'Reorder without changing the elements' },
  ],

  faq: [
    {
      q: 'Why does map(parseInt) return NaN?',
      a: 'Because map calls the callback with (element, index, array) and parseInt takes (string, radix). The index arrives as the radix: index 0 means "auto", index 1 is an invalid radix giving NaN, index 2 parses in binary. Wrap the call so only the element is passed.',
      code: "['1', '2', '3'].map(x => parseInt(x, 10))\n// [1, 2, 3]",
    },
    {
      q: 'Does map modify the original array?',
      a: 'No. It returns a new array and leaves the source untouched. That puts it on the non-mutating side of the Array API, alongside filter, slice and concat — as opposed to sort, splice, reverse and push, which mutate in place.',
      code: 'const a = [1, 2];\nconst b = a.map(x => x * 2);\na;  // [1, 2]\nb;  // [2, 4]',
    },
    {
      q: 'map or forEach?',
      a: 'map when you want the resulting array; forEach when you only want the side effect. Using map and discarding the result builds an array of undefined for no reason, and tells the next reader you expected a value.',
    },
  ],

  history: [
    { version: 'ES5', note: 'Array.prototype.map standardised in 2009, having shipped in JavaScript 1.6 (2005).' },
    { version: 'ES2015', note: 'Arrow functions made the common one-line callback dramatically shorter.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
    meta:  'Array.prototype.map',
  },

};
