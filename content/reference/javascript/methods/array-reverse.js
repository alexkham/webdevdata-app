// content/reference/javascript/methods/array-reverse.js

export const meta = {
  slug:        'array-reverse',
  name:        'Array.prototype.reverse',
  signature:   'array.reverse()',
  blurb:       'Reverses IN PLACE — the original array is changed, not copied.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'array reverse flip order backwards mutate in place toReversed javascript',
};

export const method = {
  slug:      'array-reverse',
  name:      'Array.prototype.reverse',
  signature: 'array.reverse()',
  returns:   { type: 'Array', desc: 'The SAME array, reversed in place. The return value is a reference to the original, not a copy.' },

  category:    'Array method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'One of the three mutating Array methods people forget about, alongside sort and splice. It looks functional because it returns the array — but that array is the one you passed in.',

  cheat: {
    commonCall: 'items.reverse()',
    returns:    'the same array, mutated — not a copy',
    replaces:   'nothing; toReversed() is the non-mutating version',
    watchOut:   'chaining after slice() is the usual way to stay safe',
  },

  parameters: [],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.reverse()',
  cases: [
    { id: 'basic',      label: 'three items',  values: { items: '1,2,3' } },
    { id: 'longer',     label: 'five items',   values: { items: '1,2,3,4,5' } },
    { id: 'palindrome', label: 'palindrome',   values: { items: '1,2,1' } },
    { id: 'single',     label: 'single item',  values: { items: '7' } },
    { id: 'empty',      label: 'empty array',  values: { items: '' } },
  ],
  demoExplainer: 'The elements come back in the opposite order, which is all there is to the operation itself. What the demo cannot show is the important part: the array you called it on has ALSO been reversed, because reverse edits in place and hands back the same reference. A palindrome makes that invisible, and a single element or an empty array makes it a no-op.',

  patterns: [
    {
      name: 'Reverse a copy',
      desc: 'The safe form when the array is shared.',
      code: 'const backwards = [...items].reverse();',
    },
    {
      name: 'Non-mutating on modern runtimes',
      desc: 'toReversed returns a new array.',
      code: 'const backwards = items.toReversed();  // ES2023',
    },
    {
      name: 'Sort descending',
      desc: 'Usually better expressed as a comparator.',
      code: 'items.sort((a, b) => b - a);  // not sort().reverse()',
    },
  ],

  examples: [
    { title: 'Reversed',        code: '[1, 2, 3].reverse()',        returns: '[3, 2, 1]' },
    { title: 'It mutates',      code: 'const a = [1, 2, 3];\na.reverse();\na', returns: '[3, 2, 1]' },
    { title: 'Same reference',  code: 'const a = [1, 2];\na.reverse() === a', returns: 'true' },
    { title: 'Copy first',      code: 'const a = [1, 2, 3];\n[...a].reverse();\na', returns: '[1, 2, 3]' },
    { title: 'Non-mutating',    code: '[1, 2, 3].toReversed()',     returns: '[3, 2, 1]  // ES2023' },
    { title: 'Empty',           code: '[].reverse()',               returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'It mutates the original',
      desc: 'Because it returns the array, reverse looks like it produced a new one. Assigning the result gives you two names for the SAME reversed array, and the original order is gone.',
      wrong: { label: 'Both reversed', code: 'const a = [1, 2, 3];\nconst b = a.reverse();\na', output: '[3, 2, 1]  // a changed too' },
      fix:   { label: 'Copy first',    code: 'const b = [...a].reverse();', output: 'a keeps its order' },
    },
    {
      name: 'Reversing a prop or shared array',
      desc: 'The same hazard as sort. Reversing something you did not create changes it for every other holder, which in React and similar is a silent state bug.',
      wrong: { label: 'Mutates upstream', code: 'props.items.reverse()', output: "the parent's array is reversed" },
      fix:   { label: 'Copy or toReversed', code: 'const shown = props.items.toReversed();', output: 'the prop is untouched' },
    },
    {
      name: 'sort().reverse() for descending order',
      desc: 'It works, but it sorts and then walks the array again — and it mutates twice. A descending comparator does it in one pass and says what it means.',
      wrong: { label: 'Two passes', code: 'items.sort((a, b) => a - b).reverse()', output: 'descending, via two mutations' },
      fix:   { label: 'One comparator', code: 'items.sort((a, b) => b - a)', output: 'descending directly' },
    },
  ],

  when: {
    use: [
      'Reversing an array you own and are happy to mutate',
      'In-place reversal where allocation matters',
    ],
    avoid: [
      'The array is shared or a prop → toReversed, or copy first',
      'You want descending order → a sort comparator',
      'You only need to iterate backwards → a reverse for loop',
    ],
  },

  notes: {
    complexity: 'O(n) — swaps elements from both ends inward',
    return:     'The same array object, reordered — not a copy',
    cpython:    'V8: Builtins-array-reverse.tq',
    memory:     'In place; no allocation',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.prototype.sort',   slug: 'array-sort',   when: 'The other in-place reorder, with the same mutation trap' },
    { name: 'Array.prototype.slice',  slug: 'array-slice',  when: 'Copy first to avoid mutating' },
    { name: 'Array.prototype.splice', slug: 'array-splice', when: 'The third mutating method' },
    { name: 'Array.prototype.at',     slug: 'array-at',     when: 'Read from the end without reversing at all' },
  ],

  faq: [
    {
      q: 'How do I reverse without changing the original?',
      a: 'Copy first with a spread or slice, or use toReversed on ES2023 runtimes. Both give you a new array and leave the source in its original order.',
      code: 'const backwards = [...items].reverse();\nconst backwards2 = items.toReversed();',
    },
    {
      q: 'Is sort().reverse() a good way to sort descending?',
      a: 'It produces the right answer but does more work and mutates twice. A comparator of (a, b) => b - a sorts descending in a single pass and states the intent directly.',
    },
    {
      q: 'Do I need reverse just to loop backwards?',
      a: 'No — and you should not, since it changes the array. A counting-down for loop, or at() with negative indices, reads the elements in reverse without touching the data.',
      code: 'for (let i = items.length - 1; i >= 0; i--) { ... }',
    },
  ],

  history: [
    { version: 'ES1', note: 'reverse has been present since the first standard in 1997.' },
    { version: 'ES2023', note: 'toReversed added, alongside toSorted and toSpliced, giving non-mutating counterparts.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse',
    meta:  'Array.prototype.reverse',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
