// content/reference/javascript/methods/array-pop.js

export const meta = {
  slug:        'array-pop',
  name:        'Array.prototype.pop',
  signature:   'array.pop()',
  blurb:       'Remove and return the LAST element — undefined on an empty array, never an error.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array pop remove last element stack lifo mutate in place undefined javascript',
};

export const method = {
  slug:      'array-pop',
  name:      'Array.prototype.pop',
  signature: 'array.pop()',
  returns:   { type: 'any', desc: 'The removed last element, or undefined when the array was already empty. The array is modified in place.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The natural partner to push. Unlike most removals it is O(1), because nothing after it needs to shift.',

  cheat: {
    commonCall: 'const last = items.pop()',
    returns:    'the removed element, or undefined',
    replaces:   'reading items[items.length - 1] then shortening the array',
    watchOut:   'an empty array gives undefined, indistinguishable from a real undefined element',
  },

  parameters: [],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.pop()',
  cases: [
    { id: 'three', label: 'three elements', values: { items: '1,2,3' } },
    { id: 'one',   label: 'single element', values: { items: '7' } },
    { id: 'empty', label: 'empty → undefined', values: { items: '' } },
  ],
  demoExplainer: 'The output is the element that was REMOVED, not the shortened array — the array itself is modified in place and is not what comes back. On an empty array you get undefined rather than an error, which is convenient in a while loop but means you cannot tell "the array was empty" from "the last element happened to be undefined".',

  patterns: [
    {
      name: 'Stack behaviour',
      desc: 'push and pop together give LIFO.',
      code: 'stack.push(x);\nconst top = stack.pop();',
    },
    {
      name: 'Drain an array',
      desc: 'The truthiness check guards the empty case.',
      code: 'while (items.length) {\n  handle(items.pop());\n}',
    },
    {
      name: 'Peek without removing',
      desc: 'at(-1) reads the last element and leaves it alone.',
      code: 'const last = items.at(-1);',
    },
  ],

  examples: [
    { title: 'Returns the element', code: '[1, 2, 3].pop()',            returns: '3' },
    { title: 'The array after',     code: 'const a = [1, 2];\na.pop();\na', returns: '[1]' },
    { title: 'Empty is undefined',  code: '[].pop()',                   returns: 'undefined' },
    { title: 'Length drops',        code: 'const a = [1, 2];\na.pop();\na.length', returns: '1' },
    { title: 'Peek instead',        code: '[1, 2, 3].at(-1)',           returns: '3  // not removed' },
    { title: 'Not the array',       code: 'const a = [1, 2];\nconst r = a.pop();\nr', returns: '2  // not [1]' },
  ],

  pitfalls: [
    {
      name: 'Empty gives undefined, not an error',
      desc: 'Popping an empty array is silent. A loop that pops without checking the length runs forever on the undefined, or processes a phantom element, rather than failing loudly.',
      wrong: { label: 'Phantom element', code: 'while (true) handle(items.pop());', output: 'handles undefined forever' },
      fix:   { label: 'Check the length', code: 'while (items.length) handle(items.pop());', output: 'stops cleanly' },
    },
    {
      name: 'It returns the element, not the array',
      desc: 'Same shape of mistake as push. Assigning the result gives the removed value; the shortened array is the original variable.',
      wrong: { label: 'Got the element', code: 'const rest = items.pop();', output: 'the last element' },
      fix:   { label: 'The array is the original', code: 'items.pop();\nconst rest = items;', output: 'the shortened array' },
    },
    {
      name: 'It mutates a shared array',
      desc: 'Popping a prop or a piece of state removes the element for every holder, and leaves the reference unchanged so identity comparisons see nothing.',
      wrong: { label: 'Mutates state', code: 'state.items.pop();', output: 'same reference, no re-render' },
      fix:   { label: 'Copy instead',  code: 'setItems(state.items.slice(0, -1));', output: 'new array' },
    },
  ],

  when: {
    use: [
      'Stack behaviour with push',
      'Draining an array from the end',
      'Removing the last element in place',
    ],
    avoid: [
      'You only want to READ the last element → at(-1)',
      'The array is shared or state → slice(0, -1)',
      'You need FIFO order → shift, or a proper queue',
    ],
  },

  notes: {
    complexity: 'O(1) — nothing after the last element needs to move',
    return:     'The removed element or undefined; the array is modified in place',
    cpython:    'V8: Builtins-array-pop.tq',
    memory:     'May shrink the backing store',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.prototype.push',    slug: 'array-push',    when: 'Add to the end — the other half of a stack' },
    { name: 'Array.prototype.shift',   slug: 'array-shift',   when: 'Remove from the FRONT instead' },
    { name: 'Array.prototype.at',      slug: 'array-at',      when: 'Read the last element without removing it' },
    { name: 'Array.prototype.slice',   slug: 'array-slice',   when: 'Non-mutating removal of the last element' },
  ],

  faq: [
    {
      q: 'How do I read the last element without removing it?',
      a: 'at(-1) on modern runtimes, or arr[arr.length - 1] anywhere. Both leave the array alone, which pop never does.',
      code: 'const last = items.at(-1);',
    },
    {
      q: 'Why is pop faster than shift?',
      a: 'Because removing from the end moves nothing. shift removes the first element, so every remaining element has to slide down one index — that is O(n) per call and quadratic in a drain loop.',
    },
    {
      q: 'How do I remove the last element without mutating?',
      a: 'slice(0, -1) returns a new array without the last element and leaves the original untouched. You lose the removed value, so grab it with at(-1) first if you need it.',
      code: 'const rest = items.slice(0, -1);',
    },
  ],

  history: [
    { version: 'ES3', note: 'pop standardised in 1999 alongside push, shift and unshift.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop',
    meta:  'Array.prototype.pop',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
