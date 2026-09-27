// content/reference/javascript/methods/array-toreversed.js

export const meta = {
  slug:        'array-toreversed',
  name:        'Array.prototype.toReversed',
  signature:   'array.toReversed()',
  blurb:       'reverse without mutating — a new array, source untouched.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2023',
  searchTerms: 'array toReversed non-mutating reverse copy immutable change by copy react state es2023 javascript',
};

export const method = {
  slug:      'array-toreversed',
  name:      'Array.prototype.toReversed',
  signature: 'array.toReversed()',
  returns:   { type: 'Array', desc: 'A NEW array in reverse order. The original keeps its order — the only difference from reverse.' },

  category:    'Array method',
  version:     'ES2023',
  hasLiveDemo: true,

  subtitle: 'The simplest of the four change-by-copy methods: reverse, minus the mutation. No other behaviour differs.',

  cheat: {
    commonCall: 'items.toReversed()',
    returns:    'a new reversed array; the original is untouched',
    replaces:   '[...items].reverse()',
    watchOut:   'the copy is shallow — nested objects are still shared',
  },

  parameters: [],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.toReversed()',
  cases: [
    { id: 'three',      label: 'three items',  values: { items: '1,2,3' } },
    { id: 'five',       label: 'five items',   values: { items: '1,2,3,4,5' } },
    { id: 'palindrome', label: 'palindrome',   values: { items: '1,2,1' } },
    { id: 'empty',      label: 'empty array',  values: { items: '' } },
  ],
  demoExplainer: 'The output matches what reverse would produce — the difference is entirely in what happens to the source, which the demo cannot show. reverse would have left the original array reversed too; toReversed leaves it exactly as it was. That is the whole point, and the reason it exists for React state and shared props.',

  patterns: [
    {
      name: 'Display in reverse without touching state',
      desc: 'The canonical use.',
      code: 'const newestFirst = messages.toReversed();',
    },
    {
      name: 'Reverse a prop safely',
      desc: 'The parent keeps its order.',
      code: 'const shown = props.items.toReversed();',
    },
    {
      name: 'The pre-2023 equivalent',
      desc: 'The copy was mandatory, and easy to forget.',
      code: 'const backwards = [...items].reverse();',
    },
  ],

  examples: [
    { title: 'Reversed',           code: '[1, 2, 3].toReversed()',                 returns: '[3, 2, 1]' },
    { title: 'Original untouched', code: 'const a = [1, 2];\na.toReversed();\na',  returns: '[1, 2]' },
    { title: 'reverse would mutate', code: 'const a = [1, 2];\na.reverse();\na',   returns: '[2, 1]' },
    { title: 'A different array',  code: 'const a = [1];\na.toReversed() === a',   returns: 'false' },
    { title: 'Palindrome',         code: '[1, 2, 1].toReversed()',                 returns: '[1, 2, 1]' },
    { title: 'Empty array',        code: '[].toReversed()',                        returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'The copy is shallow',
      desc: 'Same caveat as every copying method here. The order is new; the elements are the same objects, so mutating one through the reversed array changes it in the original.',
      wrong: { label: 'Shared objects', code: 'const a = [{n: 1}];\nconst b = a.toReversed();\nb[0].n = 9;\na[0].n', output: '9' },
      fix:   { label: 'Deep copy',      code: 'const b = structuredClone(a).toReversed();', output: 'independent' },
    },
    {
      name: 'Do not reverse just to iterate backwards',
      desc: 'Allocating a whole array to walk it in reverse is wasteful. A counting-down loop, or at() with negative indices, reads the same order with no copy at all.',
      wrong: { label: 'Allocates a copy', code: 'for (const x of items.toReversed()) { ... }', output: 'a full array for one pass' },
      fix:   { label: 'Loop backwards',   code: 'for (let i = items.length - 1; i >= 0; i--) { ... }', output: 'no allocation' },
    },
    {
      name: 'ES2023 and newer only',
      desc: 'Node 20+, and reasonably recent browsers. Older targets need a spread and reverse, where forgetting the spread silently mutates.',
      wrong: { label: 'Missing method', code: 'items.toReversed()', output: 'TypeError: items.toReversed is not a function' },
      fix:   { label: 'Copy first',     code: '[...items].reverse()', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Reversing state, props or a shared array',
      'Displaying newest-first without changing the stored order',
      'Anywhere [...items].reverse() appears today',
    ],
    avoid: [
      'You own the array and want it reversed → reverse is cheaper',
      'You only want to ITERATE backwards → a counting-down loop',
      'Runtimes older than ES2023 → [...items].reverse()',
    ],
  },

  notes: {
    complexity: 'O(n) — copies while reversing',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-toreversed.tq',
    memory:     'Allocates a full copy',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.reverse',   slug: 'array-reverse',   when: 'The mutating original' },
    { name: 'Array.prototype.toSorted',  slug: 'array-tosorted',  when: 'The same idea for sort' },
    { name: 'Array.prototype.toSpliced', slug: 'array-tospliced', when: 'The same idea for splice' },
    { name: 'Array.prototype.at',        slug: 'array-at',        when: 'Read from the end without copying' },
  ],

  faq: [
    {
      q: 'toReversed or [...items].reverse()?',
      a: 'Identical results. toReversed is one call instead of two operations and removes the risk of forgetting the spread — which would silently reverse the original. Use the spread form for pre-2023 runtimes.',
    },
    {
      q: 'Should I use it to loop backwards?',
      a: 'No. It allocates a whole new array for a single pass. A for loop counting down, or repeated at(-n), iterates in reverse without copying anything.',
      code: 'for (let i = items.length - 1; i >= 0; i--) { ... }',
    },
    {
      q: 'Is the copy deep?',
      a: 'No — shallow, like every copying array method. The new array holds the same element references, so nested objects are shared with the original.',
    },
  ],

  history: [
    { version: 'ES2023', note: 'Added by the change-array-by-copy proposal, alongside toSorted, toSpliced and with.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed',
    meta:  'Array.prototype.toReversed',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
