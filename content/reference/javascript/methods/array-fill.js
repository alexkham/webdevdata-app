// content/reference/javascript/methods/array-fill.js

export const meta = {
  slug:        'array-fill',
  name:        'Array.prototype.fill',
  signature:   'array.fill(value[, start[, end]])',
  blurb:       'Overwrite a range with one value IN PLACE — and every slot gets the SAME reference.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'array fill populate initialise default value shared reference new Array es2015 javascript',
};

export const method = {
  slug:      'array-fill',
  name:      'Array.prototype.fill',
  signature: 'array.fill(value[, start[, end]])',
  returns:   { type: 'Array', desc: 'The SAME array, with the range overwritten. Mutates in place — the return value is a reference to the original.' },

  category:    'Array method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Mostly used to make new Array(n) usable. Its one serious trap is that an object or array argument is stored once and shared by every slot.',

  cheat: {
    commonCall: 'new Array(3).fill(0)',
    returns:    'the same array, mutated',
    replaces:   'a loop assigning the same value to every index',
    watchOut:   'fill([]) puts the SAME array in every slot, not one each',
  },

  parameters: [
    { name: 'value', type: 'any',    required: true,  default: null,     desc: 'The value written to every slot in the range. Evaluated ONCE — objects and arrays are shared, not copied.' },
    { name: 'start', type: 'number', required: false, default: '0',      desc: 'Index to start filling at. Negative counts from the end.' },
    { name: 'end',   type: 'number', required: false, default: 'length', desc: 'Index to stop BEFORE. Negative counts from the end.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to fill with',       input: 'number' },
  ],
  demoTemplate: '{items}.fill({value})',
  cases: [
    { id: 'three', label: 'fill three',  values: { items: '1,2,3', value: 0 } },
    { id: 'ones',  label: 'fill with 1', values: { items: '5,6,7', value: 1 } },
    { id: 'single',label: 'single slot', values: { items: '9',     value: 0 } },
    { id: 'empty', label: 'empty array', values: { items: '',      value: 0 } },
  ],
  demoExplainer: 'Every slot in the range is overwritten with the same value, and the array is modified in place. With numbers that is all there is to it. The behaviour worth knowing sits outside what a number input can show: fill evaluates its argument ONCE, so filling with an object or array puts the very same reference in every slot — mutating one visibly mutates them all.',

  patterns: [
    {
      name: 'Make new Array(n) usable',
      desc: 'A bare new Array(n) is full of holes that most methods skip.',
      code: 'const zeros = new Array(5).fill(0);',
    },
    {
      name: 'Build a grid safely',
      desc: 'A mapped fill gives each row its own array.',
      code: 'const grid = Array.from({length: 3}, () => new Array(3).fill(0));',
    },
    {
      name: 'Reset an existing buffer',
      desc: 'In place, without reallocating.',
      code: 'buffer.fill(0);',
    },
  ],

  examples: [
    { title: 'Fill everything',  code: '[1, 2, 3].fill(0)',           returns: '[0, 0, 0]' },
    { title: 'From an index',    code: '[1, 2, 3].fill(0, 1)',        returns: '[1, 0, 0]' },
    { title: 'A range',          code: '[1, 2, 3].fill(0, 1, 2)',     returns: '[1, 0, 3]' },
    { title: 'Populate holes',   code: 'new Array(3).fill(0)',        returns: '[0, 0, 0]' },
    { title: 'It mutates',       code: 'const a = [1, 2];\na.fill(0);\na', returns: '[0, 0]' },
    { title: 'Shared reference', code: 'const a = new Array(2).fill([]);\na[0].push(1);\na', returns: '[[1], [1]]' },
  ],

  pitfalls: [
    {
      name: 'Filling with an object shares one reference',
      desc: 'The single real trap. fill evaluates the value once, so every slot points at the SAME object. Pushing to one row of a grid built this way appears to push to all of them.',
      wrong: { label: 'All slots share', code: 'const a = new Array(2).fill([]);\na[0].push(1);\na', output: '[[1], [1]]' },
      fix:   { label: 'One per slot',    code: 'const a = Array.from({length: 2}, () => []);\na[0].push(1);\na', output: '[[1], []]' },
    },
    {
      name: 'It mutates and returns the same array',
      desc: 'Like sort and reverse, fill looks functional because it returns the array — but that array is the one you passed in.',
      wrong: { label: 'Original overwritten', code: 'const a = [1, 2];\nconst b = a.fill(0);\na', output: '[0, 0]' },
      fix:   { label: 'Copy first',           code: 'const b = [...a].fill(0);', output: 'a is untouched' },
    },
    {
      name: 'end is exclusive',
      desc: 'Same convention as slice. fill(0, 1, 2) writes only index 1 — the slot at index 2 is untouched.',
      wrong: { label: 'One slot only', code: '[1, 2, 3].fill(0, 1, 2)', output: '[1, 0, 3]' },
      fix:   { label: 'Go one further', code: '[1, 2, 3].fill(0, 1, 3)', output: '[1, 0, 0]' },
    },
  ],

  when: {
    use: [
      'Turning new Array(n) into a dense, usable array',
      'Resetting an existing array in place',
      'Initialising a numeric buffer to a default',
    ],
    avoid: [
      'The value is an object or array → Array.from with a factory',
      'The array is shared or state → copy first',
      'Each slot needs a different value → Array.from with an index callback',
    ],
  },

  notes: {
    complexity: 'O(n) over the filled range',
    return:     'The same array object, mutated — not a copy',
    cpython:    'V8: Builtins-array-fill.tq',
    memory:     'No allocation; the value is stored by reference',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.from',             slug: 'array-from',    when: 'Build with a per-element factory instead of one shared value' },
    { name: 'Array.prototype.map',    slug: 'array-map',     when: 'Derive each element from the existing one' },
    { name: 'Array.prototype.slice',  slug: 'array-slice',   when: 'Copy before filling to avoid mutating' },
    { name: 'Array.prototype.splice', slug: 'array-splice',  when: 'Replace a range and change the length' },
  ],

  faq: [
    {
      q: 'Why do all my rows change together?',
      a: 'Because fill stores one reference in every slot. new Array(3).fill([]) creates a single array and points all three slots at it. Use Array.from with a factory function, which runs once per slot.',
      code: 'Array.from({length: 3}, () => []);',
    },
    {
      q: 'Why do I need fill after new Array(n)?',
      a: 'Because new Array(n) creates HOLES, not undefined values, and map, forEach and friends skip holes entirely. Filling makes the array dense so the iteration methods actually visit every slot.',
      code: 'new Array(3).map((_, i) => i);        // [ <3 empty items> ]\nnew Array(3).fill(0).map((_, i) => i);  // [0, 1, 2]',
    },
    {
      q: 'Does fill copy the value?',
      a: 'No. Primitives are copied by nature, but objects and arrays are stored by reference — one object, many slots pointing at it.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'fill added alongside find, findIndex and copyWithin.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill',
    meta:  'Array.prototype.fill',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
