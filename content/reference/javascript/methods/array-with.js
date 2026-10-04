// content/reference/javascript/methods/array-with.js

export const meta = {
  slug:        'array-with',
  name:        'Array.prototype.with',
  signature:   'array.with(index, value)',
  blurb:       'A copy with one index replaced — and it THROWS on an out-of-range index.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2023',
  searchTerms: 'array with replace index non-mutating copy immutable change by copy react state es2023 javascript',
};

export const method = {
  slug:      'array-with',
  name:      'Array.prototype.with',
  signature: 'array.with(index, value)',
  returns:   { type: 'Array', desc: 'A NEW array identical to the original except at one index. Throws RangeError if the index is out of bounds.' },

  category:    'Array method',
  version:     'ES2023',
  hasLiveDemo: true,

  subtitle: 'The non-mutating form of arr[i] = value. Unlike bracket assignment it refuses an out-of-range index instead of quietly creating a hole or a stray property.',

  cheat: {
    commonCall: 'items.with(i, value)',
    returns:    'a new array with one element changed',
    replaces:   'items.map((x, j) => j === i ? value : x)',
    watchOut:   'an out-of-range index is a RangeError, not a silent no-op',
  },

  parameters: [
    { name: 'index', type: 'number', required: true, default: null, desc: 'Position to replace. Negative counts from the end. Anything outside the array throws RangeError.' },
    { name: 'value', type: 'any',    required: true, default: null, desc: 'The replacement value for that position.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'index', type: 'number',   hint: 'index to replace',         input: 'number' },
    { name: 'value', type: 'number',   hint: 'new value',                input: 'number' },
  ],
  demoTemplate: '{items}.with({index}, {value})',
  cases: [
    { id: 'middle',   label: 'replace the middle', values: { items: '1,2,3', index: 1, value: 9 } },
    { id: 'first',    label: 'replace the first',  values: { items: '1,2,3', index: 0, value: 9 } },
    { id: 'negative', label: 'negative index',     values: { items: '1,2,3', index: -1, value: 9 } },
    { id: 'outside',  label: 'out of range (!)',   values: { items: '1,2,3', index: 99, value: 9 } },
  ],
  demoExplainer: 'One element is replaced and everything else is copied through, leaving the source untouched. Negative indices count from the end, exactly like at(). The last case is what distinguishes this from bracket assignment: an index outside the array throws a RangeError rather than silently extending the array with a hole — which is what arr[99] = 9 would have done.',

  patterns: [
    {
      name: 'Update one item in state',
      desc: 'The cleanest non-mutating single-element update.',
      code: 'setItems(items.with(index, updated));',
    },
    {
      name: 'Replace the last element',
      desc: 'A negative index avoids the length arithmetic.',
      code: 'const next = items.with(-1, replacement);',
    },
    {
      name: 'The pre-2023 equivalent',
      desc: 'A map comparing indices, or a spread with splice.',
      code: 'const next = items.map((x, j) => j === i ? value : x);',
    },
  ],

  examples: [
    { title: 'Replace the middle', code: '[1, 2, 3].with(1, 9)',              returns: '[1, 9, 3]' },
    { title: 'Negative index',     code: '[1, 2, 3].with(-1, 9)',             returns: '[1, 2, 9]' },
    { title: 'Original untouched', code: 'const a = [1, 2, 3];\na.with(0, 9);\na', returns: '[1, 2, 3]' },
    { title: 'Out of range throws',code: '[1, 2, 3].with(99, 0)',             returns: 'RangeError: Invalid index : 99' },
    { title: 'Brackets do not',    code: 'const a = [1];\na[99] = 0;\na.length', returns: '100' },
    { title: 'A different array',  code: 'const a = [1];\na.with(0, 1) === a', returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'An out-of-range index throws',
      desc: 'Unlike almost every other array operation, this one is strict. Bracket assignment at index 99 on a short array silently extends it with holes; with() refuses. That is a feature, but it is a behaviour change when converting existing code.',
      wrong: { label: 'Throws', code: '[1, 2, 3].with(99, 0)', output: 'RangeError: Invalid index : 99' },
      fix:   { label: 'Bounds-check first', code: 'if (i >= 0 && i < items.length) items.with(i, v);', output: 'safe' },
    },
    {
      name: 'It replaces, it does not insert',
      desc: 'The length never changes. To add an element at a position you want toSpliced with a skipCount of 0 — with() only overwrites what is already there.',
      wrong: { label: 'Overwrites', code: '[1, 2, 3].with(1, 9)', output: '[1, 9, 3]  // the 2 is gone' },
      fix:   { label: 'Insert instead', code: '[1, 2, 3].toSpliced(1, 0, 9)', output: '[1, 9, 2, 3]' },
    },
    {
      name: 'ES2023 and newer only',
      desc: 'Node 20+, and reasonably recent browsers. Note that `with` was also a legacy statement keyword, which is why the method reads oddly — it is only valid in method position.',
      wrong: { label: 'Missing method', code: 'items.with(0, 1)', output: 'TypeError: items.with is not a function' },
      fix:   { label: 'Map instead',    code: 'items.map((x, j) => j === 0 ? 1 : x)', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Replacing a single element in state or props',
      'Updating by index inside an expression',
      'Anywhere a map comparing indices is used just to swap one value',
    ],
    avoid: [
      'Adding or removing elements → toSpliced',
      'You own the array and want it changed in place → arr[i] = value',
      'The index may be out of range → bounds-check, or it throws',
      'Runtimes older than ES2023 → map with an index comparison',
    ],
  },

  notes: {
    complexity: 'O(n) — the whole array is copied',
    return:     'A new array of the same length; the original is never modified',
    cpython:    'V8: Builtins-array-with.tq',
    memory:     'Allocates a full copy',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.toSpliced',  slug: 'array-tospliced',  when: 'Insert or remove rather than replace' },
    { name: 'Array.prototype.at',         slug: 'array-at',         when: 'READ by index, including negatives' },
    { name: 'Array.prototype.map',        slug: 'array-map',        when: 'The pre-2023 way to replace one element' },
    { name: 'Array.prototype.toSorted',   slug: 'array-tosorted',   when: 'Another of the change-by-copy four' },
  ],

  faq: [
    {
      q: 'Why does with() throw when arr[i] = v does not?',
      a: 'Because bracket assignment on an array is really property assignment — arr[99] = 0 on a three-element array just sets a property and stretches the length to 100, leaving holes. with() is specified to reject an index outside the current bounds, which catches the mistake instead of producing a sparse array.',
      code: 'const a = [1];\na[99] = 0;\na.length;      // 100, with holes\na.with(99, 0);   // RangeError',
    },
    {
      q: 'Can with() add an element?',
      a: 'No — the length is fixed. It only overwrites an existing position. Use toSpliced with a skipCount of 0 to insert, or a spread to append.',
      code: 'items.toSpliced(i, 0, value);',
    },
    {
      q: 'Why is a method called "with"?',
      a: 'It reads as "this array, with index i set to value". The name was available because `with` as a statement is banned in strict mode and modules, and a method name never collides with a keyword.',
    },
  ],

  history: [
    { version: 'ES2023', note: 'Added by the change-array-by-copy proposal, alongside toSorted, toReversed and toSpliced.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with',
    meta:  'Array.prototype.with',
  },

};
