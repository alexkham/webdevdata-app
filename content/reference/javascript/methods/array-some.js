// content/reference/javascript/methods/array-some.js

export const meta = {
  slug:        'array-some',
  name:        'Array.prototype.some',
  signature:   'array.some(callback[, thisArg])',
  blurb:       'Does ANY element pass the test? Short-circuits, and empty is always false.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array some any exists at least one predicate short circuit boolean every javascript',
};

export const method = {
  slug:      'array-some',
  name:      'Array.prototype.some',
  signature: 'array.some(callback[, thisArg])',
  returns:   { type: 'boolean', desc: 'True as soon as the callback returns truthy for any element. False for an empty array — there is nothing that could satisfy it.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The existential check, and the mirror of every. It stops at the first success, so it is the cheap way to ask a yes/no question of a large array.',

  cheat: {
    commonCall: 'items.some(x => x.isActive)',
    returns:    'boolean — stops at the first truthy result',
    replaces:   'filter(...).length > 0, which scans everything',
    watchOut:   'an empty array is FALSE, where every would be true',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). Iteration stops the moment it returns truthy.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'is any above this?',       input: 'number' },
  ],
  demoTemplate: '{items}.some(x => x > {threshold})',
  cases: [
    { id: 'yes',   label: 'one passes',   values: { items: '1,2,3', threshold: 2 } },
    { id: 'all',   label: 'all pass',     values: { items: '1,2,3', threshold: 0 } },
    { id: 'no',    label: 'none pass',    values: { items: '1,2,3', threshold: 99 } },
    { id: 'empty', label: 'empty → false',values: { items: '',      threshold: 0 } },
  ],
  demoExplainer: 'True as soon as one element passes — the rest are never tested, which makes this cheap on large arrays. The empty case is worth holding next to every: some on an empty array is FALSE, because no element exists that could pass. every on the same empty array is TRUE. The two methods disagree precisely when there is nothing to check.',

  patterns: [
    {
      name: 'Existence check',
      desc: 'Cheaper and clearer than counting matches.',
      code: 'if (errors.some(e => e.fatal)) { abort(); }',
    },
    {
      name: 'Match objects by contents',
      desc: 'What includes cannot do.',
      code: 'const has = items.some(o => o.id === targetId);',
    },
    {
      name: 'Validate that nothing is broken',
      desc: 'Often reads better than a negated every.',
      code: 'const invalid = fields.some(f => !f.valid);',
    },
  ],

  examples: [
    { title: 'One passes',     code: '[1, 2, 3].some(x => x > 2)',   returns: 'true' },
    { title: 'None pass',      code: '[1, 2, 3].some(x => x > 99)',  returns: 'false' },
    { title: 'Empty is false', code: '[].some(x => true)',           returns: 'false' },
    { title: 'every disagrees',code: '[].every(x => false)',         returns: 'true' },
    { title: 'Match by contents', code: '[{id: 1}].some(o => o.id === 1)', returns: 'true' },
    { title: 'Short-circuits', code: '[1, 2, 3].some(x => x === 1)', returns: 'true  // 2 and 3 never tested' },
  ],

  pitfalls: [
    {
      name: 'An empty array is false',
      desc: 'Correct, but worth stating: "is there any?" over nothing is no. It is the opposite of every, which returns true for an empty array — so swapping one for the other flips the empty case.',
      wrong: { label: 'Assumed true', code: '[].some(x => true)', output: 'false' },
      fix:   { label: 'Check length too', code: 'items.length > 0 && items.some(pred)', output: 'explicit' },
    },
    {
      name: 'A braced callback with no return always gives false',
      desc: 'Without an explicit return the callback yields undefined, which is falsy, so no element ever passes and some always answers false.',
      wrong: { label: 'No return', code: '[1, 2, 3].some(x => { x > 0 })', output: 'false' },
      fix:   { label: 'Return it', code: '[1, 2, 3].some(x => x > 0)', output: 'true' },
    },
    {
      name: 'Using some for side effects',
      desc: 'Because it short-circuits, some is occasionally abused as a breakable forEach. It works, but it reads as a question rather than a command and the next reader will misjudge the intent.',
      wrong: { label: 'Loop in disguise', code: 'items.some(x => { send(x); return done; })', output: 'works, but obscures intent' },
      fix:   { label: 'Use a for...of',   code: 'for (const x of items) { send(x); if (done) break; }', output: 'says what it does' },
    },
  ],

  when: {
    use: [
      'Asking whether at least one element qualifies',
      'Matching objects by their contents',
      'Short-circuiting a check over a large array',
    ],
    avoid: [
      'You need the matching element → find',
      'You need ALL elements to qualify → every',
      'Matching a plain value → includes',
      'You want the count → filter().length',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first truthy result',
    return:     'A boolean; the array is never modified',
    cpython:    'V8: Builtins-array-some.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.every',    slug: 'array-every',    when: 'ALL must pass rather than any' },
    { name: 'Array.prototype.find',     slug: 'array-find',     when: 'You want the matching element itself' },
    { name: 'Array.prototype.includes', slug: 'array-includes', when: 'Matching a value rather than a predicate' },
    { name: 'Array.prototype.filter',   slug: 'array-filter',   when: 'You want all the matches' },
  ],

  faq: [
    {
      q: 'Why is some on an empty array false?',
      a: 'Because it asks whether any element satisfies the test, and an empty array has no elements — so nothing can. It is the mirror of every, which is vacuously true on an empty array for the same structural reason.',
      code: '[].some(x => true)    // false\n[].every(x => false)  // true',
    },
    {
      q: 'some or find?',
      a: 'some when you only need the yes/no answer — it returns a boolean and allocates nothing. find when you need the element. Both short-circuit at the first match, so the cost is the same.',
    },
    {
      q: 'Can I break out of some?',
      a: 'Returning true ends the iteration, which is why it is sometimes used as a breakable loop. It works, but a for...of with a break says what you mean; some reads as a question, not an instruction.',
    },
  ],

  history: [
    { version: 'ES5', note: 'some and every standardised together in 2009.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some',
    meta:  'Array.prototype.some',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are testing' },
  ],
};
