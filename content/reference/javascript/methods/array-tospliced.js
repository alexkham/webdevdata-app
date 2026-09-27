// content/reference/javascript/methods/array-tospliced.js

export const meta = {
  slug:        'array-tospliced',
  name:        'Array.prototype.toSpliced',
  signature:   'array.toSpliced(start[, skipCount[, ...items]])',
  blurb:       'splice without mutating — and it returns the RESULTING array, not the removed elements.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2023',
  searchTerms: 'array toSpliced non-mutating splice copy immutable remove insert change by copy es2023 javascript',
};

export const method = {
  slug:      'array-tospliced',
  name:      'Array.prototype.toSpliced',
  signature: 'array.toSpliced(start[, skipCount[, ...items]])',
  returns:   { type: 'Array', desc: 'A NEW array with the changes applied — the RESULT, not the removed elements. That return value is the opposite of splice.' },

  category:    'Array method',
  version:     'ES2023',
  hasLiveDemo: true,

  subtitle: 'Two differences from splice, not one: it copies instead of mutating, AND it returns the resulting array instead of the removed elements. The second catches people more than the first.',

  cheat: {
    commonCall: 'items.toSpliced(i, 1)',
    returns:    'the RESULTING array — not the removed elements',
    replaces:   'a copy followed by splice, plus reading the copy',
    watchOut:   'splice returns what was removed; toSpliced returns what is left',
  },

  parameters: [
    { name: 'start',     type: 'number', required: true,  default: null,      desc: 'Index to begin changing at. Negative counts from the end.' },
    { name: 'skipCount', type: 'number', required: false, default: 'to the end', desc: 'How many elements to omit from the result. Named skipCount rather than deleteCount, because nothing is deleted — the source is untouched.' },
    { name: '...items',  type: 'any',    required: false, default: 'none',    desc: 'Elements to insert at start in the new array.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'start', type: 'number',   hint: 'start index',              input: 'number' },
    { name: 'count', type: 'number',   hint: 'how many to skip',         input: 'number' },
  ],
  demoTemplate: '{items}.toSpliced({start}, {count})',
  cases: [
    { id: 'remove',   label: 'omit two',       values: { items: '1,2,3,4,5', start: 1, count: 2 } },
    { id: 'none',     label: 'omit none',      values: { items: '1,2,3',     start: 0, count: 0 } },
    { id: 'overrun',  label: 'count past end', values: { items: '1,2,3',     start: 1, count: 99 } },
    { id: 'negative', label: 'negative start', values: { items: '1,2,3',     start: -2, count: 1 } },
  ],
  demoExplainer: 'Compare the first case with splice: [1,2,3,4,5].splice(1, 2) returns [2, 3] — the removed elements — while toSpliced returns [1, 4, 5], the array you are left with. Same arguments, opposite return value. That is the difference to internalise, and it is why swapping one for the other is not a drop-in change even once mutation stops mattering.',

  patterns: [
    {
      name: 'Remove an item from state',
      desc: 'One call, no copy step, no mutation.',
      code: 'setItems(items.toSpliced(index, 1));',
    },
    {
      name: 'Insert without removing',
      desc: 'A skipCount of 0 makes it a pure insert.',
      code: 'const next = items.toSpliced(2, 0, newItem);',
    },
    {
      name: 'The pre-2023 equivalent',
      desc: 'Copy, splice the copy, then use the copy — three steps.',
      code: 'const next = [...items];\nnext.splice(index, 1);',
    },
  ],

  examples: [
    { title: 'Returns the result',  code: '[1, 2, 3, 4].toSpliced(1, 2)',  returns: '[1, 4]' },
    { title: 'splice returns removed', code: '[1, 2, 3, 4].splice(1, 2)', returns: '[2, 3]' },
    { title: 'Insert only',         code: '[1, 2, 3].toSpliced(1, 0, 9)', returns: '[1, 9, 2, 3]' },
    { title: 'Original untouched',  code: 'const a = [1, 2, 3];\na.toSpliced(0, 1);\na', returns: '[1, 2, 3]' },
    { title: 'Count past the end',  code: '[1, 2, 3].toSpliced(1, 99)',   returns: '[1]' },
    { title: 'Negative start',      code: '[1, 2, 3].toSpliced(-2, 1)',   returns: '[1, 3]' },
  ],

  pitfalls: [
    {
      name: 'The return value is the opposite of splice',
      desc: 'splice hands back the elements it removed; toSpliced hands back the array that remains. Converting splice code to toSpliced without noticing gives you the wrong data with no error at all.',
      wrong: { label: 'Expected the removed', code: 'const removed = items.toSpliced(1, 2);', output: 'the RESULTING array' },
      fix:   { label: 'Slice for the removed', code: 'const removed = items.slice(1, 3);', output: 'the removed elements' },
    },
    {
      name: 'The copy is shallow',
      desc: 'Same as the rest of the family. A new outer array, the same inner objects — mutating one through the result changes it in the original.',
      wrong: { label: 'Shared objects', code: 'const a = [{n: 1}, {n: 2}];\nconst b = a.toSpliced(1, 1);\nb[0].n = 9;\na[0].n', output: '9' },
      fix:   { label: 'Deep copy',      code: 'const b = structuredClone(a).toSpliced(1, 1);', output: 'independent' },
    },
    {
      name: 'ES2023 and newer only',
      desc: 'Node 20+, and reasonably recent browsers. Older targets need copy-then-splice, which is three lines and easy to get subtly wrong.',
      wrong: { label: 'Missing method', code: 'items.toSpliced(1, 1)', output: 'TypeError: items.toSpliced is not a function' },
      fix:   { label: 'Copy then splice', code: 'const next = [...items];\nnext.splice(1, 1);', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Removing or inserting in state without mutating',
      'Any place copy-then-splice appears today',
      'Expression contexts where a three-line copy would not fit',
    ],
    avoid: [
      'You want the REMOVED elements → splice, or slice the range first',
      'You own the array and want it changed in place → splice',
      'Runtimes older than ES2023 → copy then splice',
      'Removing by a test rather than an index → filter',
    ],
  },

  notes: {
    complexity: 'O(n) — the whole array is copied',
    return:     'A new array with the changes applied; the original is never modified',
    cpython:    'V8: Builtins-array-tospliced.tq',
    memory:     'Allocates a full copy',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.splice',     slug: 'array-splice',     when: 'The mutating original, returning the removed elements' },
    { name: 'Array.prototype.toSorted',   slug: 'array-tosorted',   when: 'The same idea for sort' },
    { name: 'Array.prototype.toReversed', slug: 'array-toreversed', when: 'The same idea for reverse' },
    { name: 'Array.prototype.filter',     slug: 'array-filter',     when: 'Non-mutating removal by a test' },
  ],

  faq: [
    {
      q: 'Why is the return value different from splice?',
      a: 'Because the two answer different questions. splice mutates, so the array is already updated and the useful thing left to hand back is what it removed. toSpliced does not mutate, so the only useful thing to return is the new array.',
      code: 'items.splice(1, 2);      // [2, 3]  — removed\nitems.toSpliced(1, 2);   // [1, 4]  — result',
    },
    {
      q: 'Why is the parameter called skipCount?',
      a: 'Because nothing is deleted. The source array is untouched; the count says how many elements to leave OUT of the copy. splice calls the same parameter deleteCount, which would be misleading here.',
    },
    {
      q: 'How do I get both the result and the removed elements?',
      a: 'Take the removed ones with slice and the result with toSpliced — two non-mutating calls, both reading the original.',
      code: 'const removed = items.slice(i, i + n);\nconst rest = items.toSpliced(i, n);',
    },
  ],

  history: [
    { version: 'ES2023', note: 'Added by the change-array-by-copy proposal, alongside toSorted, toReversed and with.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced',
    meta:  'Array.prototype.toSpliced',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
