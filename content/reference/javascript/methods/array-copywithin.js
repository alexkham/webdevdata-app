// content/reference/javascript/methods/array-copywithin.js

export const meta = {
  slug:        'array-copywithin',
  name:        'Array.prototype.copyWithin',
  signature:   'array.copyWithin(target[, start[, end]])',
  blurb:       'Shuffle a block of elements to another position in the same array — length never changes.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'array copyWithin copy shift block in place memmove typed array mutate overwrite es2015 javascript',
};

export const method = {
  slug:      'array-copywithin',
  name:      'Array.prototype.copyWithin',
  signature: 'array.copyWithin(target[, start[, end]])',
  returns:   { type: 'Array', desc: 'The SAME array, modified in place. The length is never changed — elements are overwritten, never inserted or removed.' },

  category:    'Array method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A low-level memmove for arrays, borrowed from the typed-array world. It exists for performance on numeric buffers, and it is almost never the right tool for ordinary application code.',

  cheat: {
    commonCall: 'buf.copyWithin(0, 3)',
    returns:    'the same array, mutated',
    replaces:   'a manual index-copying loop, or splice plus a slice',
    watchOut:   'the length is fixed — copying past the end just stops',
  },

  parameters: [
    { name: 'target', type: 'number', required: true,  default: null,     desc: 'Where to start writing. Negative counts from the end. Copying stops when the end of the array is reached.' },
    { name: 'start',  type: 'number', required: false, default: '0',      desc: 'Where to start reading. Negative counts from the end.' },
    { name: 'end',    type: 'number', required: false, default: 'length', desc: 'Where to stop reading, exclusive. Negative counts from the end.' },
  ],

  demoParams: [
    { name: 'items',  type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'target', type: 'number',   hint: 'write position',           input: 'number' },
    { name: 'start',  type: 'number',   hint: 'read position',            input: 'number' },
  ],
  demoTemplate: '{items}.copyWithin({target}, {start})',
  cases: [
    { id: 'tofront',  label: 'tail to the front', values: { items: '1,2,3,4,5', target: 0, start: 3 } },
    { id: 'shiftup',  label: 'shift right by one',values: { items: '1,2,3,4,5', target: 1, start: 0 } },
    { id: 'shortpull',label: 'pull up by one',    values: { items: '1,2,3',     target: 0, start: 1 } },
    { id: 'noop',     label: 'target === start',  values: { items: '1,2,3',     target: 0, start: 0 } },
  ],
  demoExplainer: 'Watch the LENGTH across every case: it never moves. The first case reads from index 3 to the end and writes that block at index 0, giving [4, 5, 3, 4, 5] — the tail is now duplicated, because the elements it overwrote are simply gone while the ones past the write are left alone. The third case pulls everything up by one and leaves a duplicate of the last element hanging off the end, which is the single most surprising thing about this method: it does not shrink the array the way shift would.',

  patterns: [
    {
      name: 'Slide a ring buffer down',
      desc: 'The kind of code this method was added for.',
      code: 'buf.copyWithin(0, consumed);\nwritePos -= consumed;',
    },
    {
      name: 'Duplicate a block in place',
      desc: 'No allocation, no intermediate array.',
      code: 'frame.copyWithin(half, 0, half);',
    },
    {
      name: 'What you probably want instead',
      desc: 'For ordinary arrays, splice or a spread says what you mean.',
      code: 'const moved = [...items.slice(3), ...items.slice(0, 3)];',
    },
  ],

  examples: [
    { title: 'Tail to the front',  code: '[1, 2, 3, 4, 5].copyWithin(0, 3)',    returns: '[4, 5, 3, 4, 5]' },
    { title: 'Bounded by end',     code: '[1, 2, 3, 4, 5].copyWithin(0, 3, 4)', returns: '[4, 2, 3, 4, 5]' },
    { title: 'Shift right by one', code: '[1, 2, 3, 4, 5].copyWithin(1, 0)',    returns: '[1, 1, 2, 3, 4]' },
    { title: 'Pull up by one',     code: '[1, 2, 3].copyWithin(0, 1)',          returns: '[2, 3, 3]' },
    { title: 'Length is unchanged',code: '[1, 2, 3].copyWithin(0, 1).length',   returns: '3' },
    { title: 'It returns the same array', code: 'const a = [1, 2];\na.copyWithin(0, 1) === a', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'It does not remove anything',
      desc: 'The most common misreading. Pulling elements toward the front looks like a shift, but the array keeps its length and the surplus elements stay at the tail as duplicates. If you wanted a shorter array you wanted splice or slice.',
      wrong: { label: 'Duplicate left behind', code: '[1, 2, 3].copyWithin(0, 1)', output: '[2, 3, 3]  // still length 3' },
      fix:   { label: 'Actually shorten it',   code: '[1, 2, 3].slice(1)',         output: '[2, 3]     // length 2' },
    },
    {
      name: 'It mutates the array it is called on',
      desc: 'Not a copy, despite the name. The return value is the very same array, so assigning the result to a new variable gives you two names for one object — and the original is already changed.',
      wrong: { label: 'Both names, one array', code: 'const next = items.copyWithin(0, 1);\nnext === items', output: 'true' },
      fix:   { label: 'Copy first',            code: 'const next = [...items].copyWithin(0, 1);', output: 'items untouched' },
    },
    {
      name: 'Copying past the end silently stops',
      desc: 'There is no error and no growth. A target near the end simply copies fewer elements than you asked for, so an off-by-one shows up as a partial result rather than an exception.',
      wrong: { label: 'Fewer than expected', code: '[1, 2, 3].copyWithin(2, 0)', output: '[1, 2, 1]  // only one element moved' },
      fix:   { label: 'Check the room first', code: 'const n = Math.min(count, arr.length - target);', output: 'explicit' },
    },
    {
      name: 'Reaching for it in ordinary code',
      desc: 'This exists for typed arrays and performance-critical buffers, where avoiding an allocation matters. In application code it is obscure enough that a reviewer will have to look it up, and slice or splice will be clearer and fast enough.',
      wrong: { label: 'Obscure', code: 'items.copyWithin(0, 1)', output: 'needs a trip to the docs' },
      fix:   { label: 'Obvious', code: 'items.splice(0, 1)',     output: 'removes the first element' },
    },
  ],

  when: {
    use: [
      'Sliding data down a fixed-size buffer without allocating',
      'Typed arrays, where this is the idiomatic block move',
      'Duplicating a range inside a large array in a hot loop',
    ],
    avoid: [
      'You want to REMOVE elements → splice, or slice for a copy',
      'You want a reordered copy → toSpliced, or a spread of two slices',
      'You want to fill a range with one value → fill',
      'Ordinary application code → almost anything else reads better',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of elements copied',
    return:     'The same array object, mutated in place; the length never changes',
    cpython:    'V8: Builtins-array-copywithin.tq',
    memory:     'No allocation at all — that is the entire point of the method',
    threadSafe: 'Single-threaded; overlapping ranges are handled correctly, like memmove',
  },

  related: [
    { name: 'Array.prototype.fill',      slug: 'array-fill',      when: 'Overwrite a range with one value instead of copying one' },
    { name: 'Array.prototype.splice',    slug: 'array-splice',    when: 'Actually insert or remove, changing the length' },
    { name: 'Array.prototype.slice',     slug: 'array-slice',     when: 'Extract a range into a new array' },
    { name: 'Array.prototype.toSpliced', slug: 'array-tospliced', when: 'The non-mutating way to rearrange' },
  ],

  faq: [
    {
      q: 'Why is the array not shorter afterwards?',
      a: 'Because copyWithin only overwrites. It reads a block and writes it somewhere else in the same array, and every position it did not write keeps whatever it already held. The length is fixed by definition, which is what makes it safe to use on typed arrays.',
      code: '[1, 2, 3].copyWithin(0, 1);   // [2, 3, 3] — the trailing 3 is the old one',
    },
    {
      q: 'Does it handle overlapping ranges correctly?',
      a: 'Yes. It behaves like memmove rather than memcpy, so shifting a block by one position does not smear the first element across the array. The specification requires the source to be read as if it had been buffered first.',
      code: '[1, 2, 3, 4, 5].copyWithin(1, 0);   // [1, 1, 2, 3, 4], not [1, 1, 1, 1, 1]',
    },
    {
      q: 'When would I ever use this?',
      a: 'Realistically: typed arrays, audio and image buffers, and ring buffers where an allocation per frame would matter. It was added in ES2015 to give plain arrays the same method typed arrays have. For normal code, splice and slice express the intent far better.',
    },
    {
      q: 'Does it work on holes?',
      a: 'Yes, and it propagates them — copying a hole over a real value DELETES that value rather than setting it to undefined. Another reason to keep it away from sparse arrays.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Added to Array.prototype to mirror the TypedArray method of the same name.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin',
    meta:  'Array.prototype.copyWithin',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
