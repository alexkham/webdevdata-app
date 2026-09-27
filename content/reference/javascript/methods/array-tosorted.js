// content/reference/javascript/methods/array-tosorted.js

export const meta = {
  slug:        'array-tosorted',
  name:        'Array.prototype.toSorted',
  signature:   'array.toSorted([compareFn])',
  blurb:       'sort without mutating — but it keeps the default STRING comparison.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2023',
  searchTerms: 'array toSorted non-mutating sort copy immutable change by copy react state es2023 javascript',
};

export const method = {
  slug:      'array-tosorted',
  name:      'Array.prototype.toSorted',
  signature: 'array.toSorted([compareFn])',
  returns:   { type: 'Array', desc: 'A NEW sorted array. The original is left exactly as it was — the only difference from sort.' },

  category:    'Array method',
  version:     'ES2023',
  hasLiveDemo: true,

  subtitle: 'One of four "change by copy" methods added in ES2023. It fixes sort\'s mutation problem and nothing else — the string-comparison trap comes along unchanged.',

  cheat: {
    commonCall: 'items.toSorted((a, b) => a - b)',
    returns:    'a new sorted array; the original is untouched',
    replaces:   '[...items].sort(...)',
    watchOut:   'still sorts as STRINGS without a comparator',
  },

  parameters: [
    { name: 'compareFn', type: 'Function', required: false, default: 'string comparison', desc: 'Same contract as sort: return negative, zero or positive. Omitted, elements are compared as strings — exactly as sort does.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.toSorted()',
  cases: [
    { id: 'trap',   label: 'string trap survives', values: { items: '10,9,1' } },
    { id: 'single', label: 'single digits ok',     values: { items: '3,1,2' } },
    { id: 'strings',label: 'unchanged',            values: { items: '1,10,2' } },
    { id: 'empty',  label: 'empty array',          values: { items: '' } },
  ],
  demoExplainer: 'Compare this with sort and you will see identical output — [10, 9, 1] still becomes [1, 10, 9], because toSorted inherits the default string comparator wholesale. The ONLY thing it changes is that the source array is untouched, which the demo cannot show. If you were hoping the newer method also fixed the number sorting, it does not: you still need (a, b) => a - b.',

  patterns: [
    {
      name: 'Sort React state safely',
      desc: 'A new array means a new reference, which is what re-render logic needs.',
      code: 'setItems(items.toSorted((a, b) => a - b));',
    },
    {
      name: 'Sort a prop without side effects',
      desc: 'The parent\'s array is untouched.',
      code: 'const shown = props.rows.toSorted(byName);',
    },
    {
      name: 'The pre-2023 equivalent',
      desc: 'Copy, then sort the copy.',
      code: 'const sorted = [...items].sort(cmp);',
    },
  ],

  examples: [
    { title: 'String trap survives', code: '[10, 9, 1].toSorted()',                returns: '[1, 10, 9]' },
    { title: 'With a comparator',    code: '[10, 9, 1].toSorted((a, b) => a - b)', returns: '[1, 9, 10]' },
    { title: 'Original untouched',   code: 'const a = [3, 1];\na.toSorted();\na',  returns: '[3, 1]' },
    { title: 'sort would mutate',    code: 'const a = [3, 1];\na.sort();\na',      returns: '[1, 3]' },
    { title: 'A different array',    code: 'const a = [1];\na.toSorted() === a',   returns: 'false' },
    { title: 'Empty array',          code: '[].toSorted()',                        returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'It does not fix the string-sorting trap',
      desc: 'The most misleading thing about the newer method. It solves mutation, not comparison — numbers are still converted to strings without a comparator, so [10, 9, 1] still comes out as [1, 10, 9].',
      wrong: { label: 'Still string order', code: '[10, 9, 1].toSorted()', output: '[1, 10, 9]' },
      fix:   { label: 'Comparator still needed', code: '[10, 9, 1].toSorted((a, b) => a - b)', output: '[1, 9, 10]' },
    },
    {
      name: 'The copy is shallow',
      desc: 'A new outer array holding the SAME objects. Sorting does not clone the elements, so mutating one through the sorted array changes it in the original too.',
      wrong: { label: 'Shared objects', code: 'const a = [{n: 1}];\nconst b = a.toSorted();\nb[0].n = 9;\na[0].n', output: '9' },
      fix:   { label: 'Deep copy',      code: 'const b = structuredClone(a).toSorted(cmp);', output: 'independent' },
    },
    {
      name: 'ES2023 and newer only',
      desc: 'Node 20+, and reasonably recent browsers. Older targets need the copy-then-sort idiom, which behaves identically.',
      wrong: { label: 'Missing method', code: 'items.toSorted(cmp)', output: 'TypeError: items.toSorted is not a function' },
      fix:   { label: 'Copy first',     code: '[...items].sort(cmp)', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Sorting state, props or any array you must not mutate',
      'Chaining a sort into an expression without a separate copy step',
      'Anywhere [...items].sort(...) appears today',
    ],
    avoid: [
      'You own the array and want to sort in place → sort is cheaper',
      'Runtimes older than ES2023 → [...items].sort()',
      'You need the nested objects independent too → deep copy first',
    ],
  },

  notes: {
    complexity: 'O(n log n), plus O(n) for the copy',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-tosorted.tq',
    memory:     'Allocates a full copy before sorting',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.sort',       slug: 'array-sort',       when: 'The mutating original' },
    { name: 'Array.prototype.toReversed', slug: 'array-toreversed', when: 'The same idea for reverse' },
    { name: 'Array.prototype.toSpliced',  slug: 'array-tospliced',  when: 'The same idea for splice' },
    { name: 'Array.prototype.with',       slug: 'array-with',       when: 'The same idea for index assignment' },
  ],

  faq: [
    {
      q: 'Does toSorted sort numbers correctly?',
      a: 'No — it has exactly the same default as sort, comparing elements as strings. The ES2023 methods addressed mutation, not comparison. Pass (a, b) => a - b for numbers, just as you always did.',
      code: '[10, 9, 1].toSorted()               // [1, 10, 9]\n[10, 9, 1].toSorted((a, b) => a - b) // [1, 9, 10]',
    },
    {
      q: 'toSorted or [...items].sort()?',
      a: 'They produce the same result. toSorted states the intent in one call and avoids the easy mistake of forgetting the spread. Use the spread form when you need to support pre-2023 runtimes.',
    },
    {
      q: 'Is the copy deep?',
      a: 'No. It is a shallow copy — a new array holding the same element references. Objects inside are shared with the original, so mutating one is visible through both.',
    },
  ],

  history: [
    { version: 'ES2023', note: 'Added by the change-array-by-copy proposal, alongside toReversed, toSpliced and with.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted',
    meta:  'Array.prototype.toSorted',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data before sorting' },
  ],
};
