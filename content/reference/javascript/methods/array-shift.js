// content/reference/javascript/methods/array-shift.js

export const meta = {
  slug:        'array-shift',
  name:        'Array.prototype.shift',
  signature:   'array.shift()',
  blurb:       'Remove and return the FIRST element — O(n), because everything else moves down.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array shift remove first element queue fifo mutate in place performance javascript',
};

export const method = {
  slug:      'array-shift',
  name:      'Array.prototype.shift',
  signature: 'array.shift()',
  returns:   { type: 'any', desc: 'The removed first element, or undefined when the array was already empty. The array is modified in place.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'pop from the other end — but with a cost pop does not have. Every remaining element shifts down one index, which makes a drain loop quadratic.',

  cheat: {
    commonCall: 'const first = queue.shift()',
    returns:    'the removed element, or undefined',
    replaces:   'reading items[0] then removing it',
    watchOut:   'O(n) per call — a shift-drain over a big array is O(n²)',
  },

  parameters: [],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.shift()',
  cases: [
    { id: 'three', label: 'three elements',    values: { items: '1,2,3' } },
    { id: 'one',   label: 'single element',    values: { items: '7' } },
    { id: 'empty', label: 'empty → undefined', values: { items: '' } },
  ],
  demoExplainer: 'The FIRST element is removed and returned — the mirror of pop. The array is modified in place and is not what comes back. An empty array gives undefined rather than an error. What the demo cannot show is the cost: unlike pop, every surviving element has to move down one index, so each call is proportional to the array length.',

  patterns: [
    {
      name: 'FIFO queue',
      desc: 'push and shift together, fine for small queues.',
      code: 'queue.push(job);\nconst next = queue.shift();',
    },
    {
      name: 'Drain from the front',
      desc: 'Guard with length; watch the cost on large arrays.',
      code: 'while (queue.length) handle(queue.shift());',
    },
    {
      name: 'Destructure instead',
      desc: 'Non-mutating, and often what you actually meant.',
      code: 'const [first, ...rest] = items;',
    },
  ],

  examples: [
    { title: 'Returns the first',  code: '[1, 2, 3].shift()',               returns: '1' },
    { title: 'The array after',    code: 'const a = [1, 2, 3];\na.shift();\na', returns: '[2, 3]' },
    { title: 'Empty is undefined', code: '[].shift()',                      returns: 'undefined' },
    { title: 'pop is the other end',code: '[1, 2, 3].pop()',                returns: '3' },
    { title: 'Non-mutating',       code: 'const [first, ...rest] = [1, 2, 3];\nrest', returns: '[2, 3]' },
    { title: 'Peek instead',       code: '[1, 2, 3][0]',                    returns: '1  // not removed' },
  ],

  pitfalls: [
    {
      name: 'It is O(n), and draining is O(n²)',
      desc: 'Every call re-indexes the whole array. A while loop shifting a hundred thousand items does billions of moves — the single most common accidental quadratic in JavaScript queue code.',
      wrong: { label: 'Quadratic drain', code: 'while (queue.length) handle(queue.shift());', output: 'O(n²) on a large queue' },
      fix:   { label: 'Walk with an index', code: 'for (let i = 0; i < queue.length; i++) handle(queue[i]);', output: 'O(n)' },
    },
    {
      name: 'Empty gives undefined, not an error',
      desc: 'Exactly like pop. Shifting without checking the length yields a phantom undefined rather than failing, which turns a bug into silently processed garbage.',
      wrong: { label: 'Phantom element', code: 'while (true) handle(queue.shift());', output: 'handles undefined forever' },
      fix:   { label: 'Check the length', code: 'while (queue.length) handle(queue.shift());', output: 'stops cleanly' },
    },
    {
      name: 'It mutates a shared array',
      desc: 'Same hazard as every in-place method: props, state and cached arrays all change for everyone, with the reference unchanged so identity checks see nothing.',
      wrong: { label: 'Mutates state', code: 'state.queue.shift();', output: 'same reference, no re-render' },
      fix:   { label: 'Slice instead', code: 'setQueue(state.queue.slice(1));', output: 'new array' },
    },
  ],

  when: {
    use: [
      'Small FIFO queues where the cost does not matter',
      'Removing the first element of an array you own',
      'Consuming a short argument list front to back',
    ],
    avoid: [
      'Large or hot queues → index forward, or use a real deque',
      'The array is shared or state → slice(1)',
      'You only want to READ the first element → items[0]',
      'You want the rest without mutating → destructuring',
    ],
  },

  notes: {
    complexity: 'O(n) — every remaining element moves down one index',
    return:     'The removed element or undefined; the array is modified in place',
    cpython:    'V8: Builtins-array-shift.tq — has a fast path for small packed arrays',
    memory:     'No allocation, but the whole backing store is re-indexed',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.prototype.unshift', slug: 'array-unshift', when: 'Add to the front — the other half' },
    { name: 'Array.prototype.pop',     slug: 'array-pop',     when: 'Remove from the END, in O(1)' },
    { name: 'Array.prototype.slice',   slug: 'array-slice',   when: 'Non-mutating removal of the first element' },
    { name: 'Array.prototype.at',      slug: 'array-at',      when: 'Read an element without removing it' },
  ],

  faq: [
    {
      q: 'Why is shift slower than pop?',
      a: 'Because array indices are positional. Removing the last element leaves every other index correct; removing the first means element 1 becomes element 0, 2 becomes 1, and so on for the whole array. pop is O(1), shift is O(n).',
    },
    {
      q: 'How do I build a fast queue?',
      a: 'Keep a read index and walk forward instead of shifting, or use a linked structure. For most application code an index pointer over an array is simplest and removes the quadratic behaviour entirely.',
      code: 'let head = 0;\nwhile (head < queue.length) handle(queue[head++]);',
    },
    {
      q: 'How do I take the first element without mutating?',
      a: 'Destructure: const [first, ...rest] = items. You get both halves and the original is untouched — though the rest spread does allocate a new array.',
      code: 'const [first, ...rest] = items;',
    },
  ],

  history: [
    { version: 'ES3', note: 'shift standardised in 1999 alongside push, pop and unshift.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift',
    meta:  'Array.prototype.shift',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
