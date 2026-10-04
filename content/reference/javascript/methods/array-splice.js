// content/reference/javascript/methods/array-splice.js

export const meta = {
  slug:        'array-splice',
  name:        'Array.prototype.splice',
  signature:   'array.splice(start[, deleteCount[, ...items]])',
  blurb:       'Remove and insert IN PLACE — and it returns what it REMOVED, not what is left.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array splice remove insert delete in place mutate removed elements toSpliced javascript',
};

export const method = {
  slug:      'array-splice',
  name:      'Array.prototype.splice',
  signature: 'array.splice(start[, deleteCount[, ...items]])',
  returns:   { type: 'Array', desc: 'An array of the REMOVED elements — not the modified array. Empty when nothing was removed. The original array is modified in place.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The one Array method that both mutates and returns something surprising. The demo below shows the return value: the elements taken OUT, not the array left behind.',

  cheat: {
    commonCall: 'items.splice(i, 1)',
    returns:    'the REMOVED elements, as an array',
    replaces:   'nothing; toSpliced() is the non-mutating version',
    watchOut:   'the return value is not the array — read the original to see the result',
  },

  parameters: [
    { name: 'start',       type: 'number', required: true,  default: null, desc: 'Index to begin changing at. Negative counts from the end. Beyond the length appends.' },
    { name: 'deleteCount', type: 'number', required: false, default: 'to the end', desc: 'How many elements to remove. Zero removes nothing, which is how you insert without deleting. Omitted entirely, everything from start onward is removed.' },
    { name: '...items',    type: 'any',    required: false, default: 'none', desc: 'Elements to insert at start, after the removal. Any number of them.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'start', type: 'number',   hint: 'start index',              input: 'number' },
    { name: 'count', type: 'number',   hint: 'how many to remove',       input: 'number' },
  ],
  demoTemplate: '{items}.splice({start}, {count})',
  cases: [
    { id: 'two',      label: 'remove two',       values: { items: '1,2,3,4,5', start: 1, count: 2 } },
    { id: 'none',     label: 'remove none',      values: { items: '1,2,3',     start: 0, count: 0 } },
    { id: 'overrun',  label: 'count past the end',values: { items: '1,2,3',    start: 1, count: 99 } },
    { id: 'negative', label: 'negative start',   values: { items: '1,2,3',     start: -2, count: 1 } },
  ],
  demoExplainer: 'Every output here is the list of elements REMOVED — that is what splice returns. Removing two from index 1 of [1,2,3,4,5] gives [2, 3] back, and leaves the original as [1, 4, 5], which the demo cannot show because the return value is all you get. A count of 0 removes nothing and returns an empty array, which is how you insert without deleting. A count past the end simply stops rather than erroring.',

  patterns: [
    {
      name: 'Remove one element by index',
      desc: 'The most common use by far.',
      code: 'items.splice(index, 1);',
    },
    {
      name: 'Insert without removing',
      desc: 'A deleteCount of 0 makes splice a pure insert.',
      code: "items.splice(2, 0, 'new');",
    },
    {
      name: 'Replace in place',
      desc: 'Remove and insert in a single call.',
      code: "items.splice(1, 2, 'a', 'b');",
    },
  ],

  examples: [
    { title: 'Returns the removed',  code: '[1, 2, 3, 4, 5].splice(1, 2)', returns: '[2, 3]' },
    { title: 'The array after',      code: 'const a = [1, 2, 3, 4];\na.splice(1, 2);\na', returns: '[1, 4]' },
    { title: 'Remove nothing',       code: '[1, 2, 3].splice(0, 0)',       returns: '[]' },
    { title: 'Count past the end',   code: '[1, 2, 3].splice(1, 99)',      returns: '[2, 3]' },
    { title: 'Negative start',       code: '[1, 2, 3].splice(-2, 1)',      returns: '[2]' },
    { title: 'Non-mutating version', code: '[1, 2, 3, 4].toSpliced(1, 2)', returns: '[1, 4]  // ES2023' },
  ],

  pitfalls: [
    {
      name: 'It returns the removed elements, not the array',
      desc: 'The defining confusion. Assigning the result gives you the discarded elements, and the array you actually wanted is the original — which has already been modified underneath you.',
      wrong: { label: 'Got the wrong thing', code: 'const a = [1, 2, 3, 4];\nconst result = a.splice(1, 2);\nresult', output: '[2, 3]  // the removed ones' },
      fix:   { label: 'Read the original',   code: 'a.splice(1, 2);\na', output: '[1, 4]' },
    },
    {
      name: 'It mutates — including shared arrays',
      desc: 'splice edits the array in place, so props, cached values and anything else holding a reference all see the change. This is what makes it dangerous in React state and similar.',
      wrong: { label: 'Mutates the prop', code: 'props.items.splice(0, 1);', output: 'the parent\'s array changed' },
      fix:   { label: 'Copy or filter',   code: 'const next = props.items.filter((_, i) => i !== 0);', output: 'the original is untouched' },
    },
    {
      name: 'Splicing inside a loop skips elements',
      desc: 'Removing an element shifts everything after it down one, while the loop index still moves up — so the element immediately after each removal is never visited.',
      wrong: { label: 'Skips neighbours', code: 'for (let i = 0; i < a.length; i++)\n  if (bad(a[i])) a.splice(i, 1);', output: 'consecutive bad items survive' },
      fix:   { label: 'Filter instead',   code: 'a = a.filter(x => !bad(x));', output: 'all removed' },
    },
    {
      name: 'Omitting deleteCount removes everything after start',
      desc: 'splice(1) is not "remove one at index 1" — it is "remove from index 1 to the end". The missing second argument changes the meaning completely.',
      wrong: { label: 'Removes the tail', code: '[1, 2, 3, 4].splice(1)', output: '[2, 3, 4]' },
      fix:   { label: 'Say how many',     code: '[1, 2, 3, 4].splice(1, 1)', output: '[2]' },
    },
  ],

  when: {
    use: [
      'Removing an element by index from an array you own',
      'Inserting at a position with deleteCount 0',
      'Replacing a run of elements in one call',
    ],
    avoid: [
      'The array is shared or a prop → filter, or toSpliced',
      'You only want a copy of a range → slice',
      'You are removing inside a loop → filter',
      'You need the resulting array as the return value → toSpliced',
    ],
  },

  notes: {
    complexity: 'O(n) — elements after the splice point shift',
    return:     'A new array of the removed elements; the source is modified in place',
    cpython:    'V8: Builtins-array-splice.tq',
    memory:     'Allocates the removed-elements array; the source is resized in place',
    threadSafe: 'Single-threaded; mutating a shared array is the usual hazard here',
  },

  related: [
    { name: 'Array.prototype.slice',  slug: 'array-slice',  when: 'Copy a range instead of cutting one out' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Non-mutating removal by a test' },
    { name: 'Array.prototype.sort',   slug: 'array-sort',   when: 'The other method that mutates in place' },
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'Transform without changing membership' },
  ],

  faq: [
    {
      q: 'Why does splice return the wrong array?',
      a: 'It returns what it REMOVED, which is by design — that is how you capture the elements you just cut out. The modified array is the original; splice has already changed it in place, so just read the variable you called it on.',
      code: 'const a = [1, 2, 3, 4];\nconst removed = a.splice(1, 2);\nremoved;  // [2, 3]\na;        // [1, 4]',
    },
    {
      q: 'How do I splice without mutating?',
      a: 'Use toSpliced, which returns a new array and leaves the source alone. It is ES2023, so check your runtime — otherwise copy first with a spread, or express the removal as a filter.',
      code: 'const next = items.toSpliced(1, 2);',
    },
    {
      q: 'Why does removing in a loop miss elements?',
      a: 'Because every removal shifts the remaining elements down by one while your index goes up by one, so the element that moved into the removed slot is skipped. Iterate backwards, or just use filter.',
      code: 'for (let i = a.length - 1; i >= 0; i--)\n  if (bad(a[i])) a.splice(i, 1);',
    },
  ],

  history: [
    { version: 'ES3', note: 'splice standardised in 1999 with the remove-and-insert signature.' },
    { version: 'ES2023', note: 'toSpliced added — the non-mutating counterpart that returns the resulting array.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice',
    meta:  'Array.prototype.splice',
  },

};
