// content/reference/javascript/methods/array-concat.js

export const meta = {
  slug:        'array-concat',
  name:        'Array.prototype.concat',
  signature:   'array.concat(...values)',
  blurb:       'Join arrays into a NEW one — array arguments are spread, other values appended.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array concat merge combine join arrays spread append non-mutating javascript',
};

export const method = {
  slug:      'array-concat',
  name:      'Array.prototype.concat',
  signature: 'array.concat(...values)',
  returns:   { type: 'Array', desc: 'A NEW array holding this array\'s elements followed by each argument. Array arguments are flattened one level; everything else is appended as a single element.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'Non-mutating, unlike push — which is the main reason to still reach for it. Note the asymmetry: an array argument is spread, but only one level deep.',

  cheat: {
    commonCall: 'a.concat(b)',
    returns:    'a new array; neither input is modified',
    replaces:   '[...a, ...b] in modern code',
    watchOut:   'array arguments are SPREAD, so concat([1,2]) adds two elements, not one',
  },

  parameters: [
    { name: '...values', type: 'any', required: false, default: 'none', desc: 'Any number of values. Arrays are spread one level; non-arrays are appended whole. With no arguments you get a shallow copy.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'first array, comma separated',  input: 'csv-num' },
    { name: 'more',  type: 'number[]', hint: 'second array, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.concat({more})',
  cases: [
    { id: 'both',   label: 'two arrays',    values: { items: '1,2', more: '3,4' } },
    { id: 'first',  label: 'second empty',  values: { items: '1,2', more: '' } },
    { id: 'second', label: 'first empty',   values: { items: '',    more: '3,4' } },
    { id: 'empty',  label: 'both empty',    values: { items: '',    more: '' } },
  ],
  demoExplainer: 'The elements of the second array are appended to the first, producing a new array — neither input is touched. An empty argument simply contributes nothing. The behaviour the demo cannot show is what happens with a NON-array argument: concat(3) appends the number 3 as one element, while concat([3]) spreads the array and also appends 3. The two look different but give the same result, which is a frequent source of confusion.',

  patterns: [
    {
      name: 'Merge two arrays',
      desc: 'The classic use; spread syntax is the modern equivalent.',
      code: 'const all = a.concat(b);\nconst all2 = [...a, ...b];',
    },
    {
      name: 'Append without mutating',
      desc: 'Unlike push, the original is preserved — useful for state.',
      code: 'const next = items.concat(newItem);',
    },
    {
      name: 'Flatten one level',
      desc: 'The pre-ES2019 idiom, before flat existed.',
      code: 'const flat = [].concat(...arrays);',
    },
  ],

  examples: [
    { title: 'Two arrays',        code: '[1, 2].concat([3, 4])',    returns: '[1, 2, 3, 4]' },
    { title: 'A plain value',     code: '[1, 2].concat(3)',         returns: '[1, 2, 3]' },
    { title: 'Several arguments', code: '[1, 2].concat([3], [4])',  returns: '[1, 2, 3, 4]' },
    { title: 'Only one level',    code: '[1, 2].concat([3, [4]])',  returns: '[1, 2, 3, [4]]' },
    { title: 'No arguments copies', code: '[1].concat()',           returns: '[1]' },
    { title: 'Original untouched',code: 'const a = [1];\na.concat([2]);\na', returns: '[1]' },
  ],

  pitfalls: [
    {
      name: 'Array arguments are spread, not appended',
      desc: 'concat([1, 2]) adds TWO elements, not one array. When you genuinely want to append an array as a single element, push or a nested literal is what you need.',
      wrong: { label: 'Spread, not nested', code: '[1].concat([2, 3])', output: '[1, 2, 3]' },
      fix:   { label: 'Wrap to nest',       code: '[1].concat([[2, 3]])', output: '[1, [2, 3]]' },
    },
    {
      name: 'It only flattens one level',
      desc: 'Nested arrays inside an argument survive. This is exactly why [].concat(...arrays) was the old flatten idiom — and why it only ever flattened a single level.',
      wrong: { label: 'Still nested', code: '[1].concat([2, [3]])', output: '[1, 2, [3]]' },
      fix:   { label: 'Use flat',     code: '[1, [2, [3]]].flat(Infinity)', output: '[1, 2, 3]' },
    },
    {
      name: 'The copy is shallow',
      desc: 'Like slice and spread, the new array holds the SAME objects. Mutating a nested object through the result changes it in both arrays.',
      wrong: { label: 'Shared objects', code: 'const a = [{n: 1}];\nconst b = a.concat();\nb[0].n = 99;\na[0].n', output: '99' },
      fix:   { label: 'Deep copy',      code: 'const b = structuredClone(a);', output: 'fully independent' },
    },
  ],

  when: {
    use: [
      'Merging arrays without mutating either',
      'Appending to state you must not modify in place',
      'Flattening one level on runtimes older than ES2019',
    ],
    avoid: [
      'Modern code merging two arrays → [...a, ...b] reads better',
      'Appending in place → push, which is faster and clearer about intent',
      'Deep flattening → flat(Infinity)',
    ],
  },

  notes: {
    complexity: 'O(n + m) — every element is copied into the new array',
    return:     'A new array; no input is modified',
    cpython:    'V8: Builtins-array-concat.tq, with a fast path for packed arrays',
    memory:     'Allocates a new array holding references to the same elements',
    threadSafe: 'Single-threaded; the sources are only read',
  },

  related: [
    { name: 'Array.prototype.push',  slug: 'array-push',  when: 'Append in place instead of copying' },
    { name: 'Array.prototype.flat',  slug: 'array-flat',  when: 'Flatten more than one level' },
    { name: 'Array.prototype.slice', slug: 'array-slice', when: 'Copy a range rather than merge' },
    { name: 'Array.prototype.join',  slug: 'array-join',  when: 'Combine into a string rather than an array' },
  ],

  faq: [
    {
      q: 'concat or spread?',
      a: 'They do the same thing for merging arrays. Spread reads better in modern code and handles any iterable, not just arrays. concat is still useful when you want a shallow copy with no arguments, and it is marginally faster on very large arrays in some engines.',
      code: 'const all = [...a, ...b];',
    },
    {
      q: 'How do I append an array as a single element?',
      a: 'concat always spreads array arguments, so wrap it in another array — or use push, which appends whatever you give it without spreading.',
      code: 'a.concat([[1, 2]]);   // one nested element\na.push([1, 2]);       // same, in place',
    },
    {
      q: 'Why did [].concat(...arrays) used to be everywhere?',
      a: 'It was the standard way to flatten one level before flat arrived in ES2019. The spread turns the outer array into separate arguments, and concat spreads each of those once. It still works, and still only flattens one level.',
    },
  ],

  history: [
    { version: 'ES3', note: 'concat standardised in 1999.' },
    { version: 'ES2015', note: 'Spread syntax gave [...a, ...b] as a more readable merge.' },
    { version: 'ES2019', note: 'flat replaced the [].concat(...arrays) flattening idiom.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat',
    meta:  'Array.prototype.concat',
  },

};
