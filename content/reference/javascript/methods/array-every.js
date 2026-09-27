// content/reference/javascript/methods/array-every.js

export const meta = {
  slug:        'array-every',
  name:        'Array.prototype.every',
  signature:   'array.every(callback[, thisArg])',
  blurb:       'Do ALL elements pass? An empty array answers TRUE — vacuous truth.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array every all validate predicate vacuous truth empty true short circuit some javascript',
};

export const method = {
  slug:      'array-every',
  name:      'Array.prototype.every',
  signature: 'array.every(callback[, thisArg])',
  returns:   { type: 'boolean', desc: 'True if the callback returns truthy for every element. TRUE for an empty array, because no element fails.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The universal check. Its one genuine trap is the empty array: every() on nothing is true, which turns "all items are valid" into "there were no items" without saying so.',

  cheat: {
    commonCall: 'items.every(x => x.valid)',
    returns:    'boolean — stops at the first failure',
    replaces:   'filter(...).length === items.length',
    watchOut:   'an empty array is TRUE — validate the length separately',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). Iteration stops the moment it returns falsy.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',     type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'threshold', type: 'number',   hint: 'are all above this?',      input: 'number' },
  ],
  demoTemplate: '{items}.every(x => x > {threshold})',
  cases: [
    { id: 'all',   label: 'all pass',      values: { items: '1,2,3', threshold: 0 } },
    { id: 'one',   label: 'one fails',     values: { items: '1,2,3', threshold: 2 } },
    { id: 'none',  label: 'none pass',     values: { items: '1,2,3', threshold: 99 } },
    { id: 'empty', label: 'empty → TRUE (!)',values: { items: '',    threshold: 99 } },
  ],
  demoExplainer: 'True only when every element passes, and iteration stops at the first failure. The last case is the one to remember: an EMPTY array returns true, even with a threshold nothing could satisfy. That is vacuous truth — there is no element that fails, so the claim holds. It means a validation like "every field is filled in" silently passes when there are no fields at all.',

  patterns: [
    {
      name: 'Validate a whole collection',
      desc: 'The canonical use — but guard the empty case.',
      code: 'const ok = fields.length > 0 && fields.every(f => f.valid);',
    },
    {
      name: 'Check a type invariant',
      desc: 'Confirming every element is what you expect.',
      code: "const allNumbers = values.every(v => typeof v === 'number');",
    },
    {
      name: 'Express "none match"',
      desc: 'A negated predicate, often clearer than !some.',
      code: 'const noneFailed = results.every(r => !r.error);',
    },
  ],

  examples: [
    { title: 'All pass',       code: '[1, 2, 3].every(x => x > 0)',  returns: 'true' },
    { title: 'One fails',      code: '[1, 2, 3].every(x => x > 2)',  returns: 'false' },
    { title: 'Empty is TRUE',  code: '[].every(x => false)',         returns: 'true' },
    { title: 'some disagrees', code: '[].some(x => true)',           returns: 'false' },
    { title: 'Missing return', code: '[1, 2, 3].every(x => { x > 0 })', returns: 'false' },
    { title: 'Short-circuits', code: '[0, 1, 2].every(x => x > 0)',  returns: 'false  // stops at 0' },
  ],

  pitfalls: [
    {
      name: 'An empty array returns true',
      desc: 'The trap worth knowing. "Are all of these valid?" over an empty list is true, so a validation that should have caught "nothing was submitted" passes instead. It is logically correct and practically dangerous.',
      wrong: { label: 'Empty passes validation', code: '[].every(f => f.valid)', output: 'true' },
      fix:   { label: 'Require content too',     code: 'fields.length > 0 && fields.every(f => f.valid)', output: 'false when empty' },
    },
    {
      name: 'A braced callback with no return always gives false',
      desc: 'The callback yields undefined, which is falsy, so the first element fails and every reports false immediately — the opposite of the missing-return failure in some.',
      wrong: { label: 'No return', code: '[1, 2, 3].every(x => { x > 0 })', output: 'false' },
      fix:   { label: 'Return it', code: '[1, 2, 3].every(x => x > 0)', output: 'true' },
    },
    {
      name: 'Confusing !every with some',
      desc: '!every(p) means "at least one FAILS p", not "at least one passes p". Negating the wrong side of the pair is a subtle logic bug that only shows on mixed data.',
      wrong: { label: 'Not the same', code: '![1, 2].every(x => x > 1)', output: 'true — one fails, not one passes' },
      fix:   { label: 'Say it directly', code: '[1, 2].some(x => x <= 1)', output: 'true — states the real question' },
    },
  ],

  when: {
    use: [
      'Validating that a whole collection satisfies a rule',
      'Checking a type or shape invariant across an array',
      'Expressing "none of them failed"',
    ],
    avoid: [
      'The array may be empty and that should fail → check the length too',
      'You need at least one match → some',
      'You want the failing element → find with a negated predicate',
    ],
  },

  notes: {
    complexity: 'O(n) worst case; stops at the first falsy result',
    return:     'A boolean; the array is never modified',
    cpython:    'V8: Builtins-array-every.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.some',   slug: 'array-some',   when: 'ANY rather than all — and false when empty' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'You want the elements that pass' },
    { name: 'Array.prototype.find',   slug: 'array-find',   when: 'You want the first one that fails' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'A more general fold over the array' },
  ],

  faq: [
    {
      q: 'Why does every return true for an empty array?',
      a: 'Vacuous truth: the claim "every element satisfies P" is only falsified by an element that does not, and an empty array has none. It is the standard convention in logic and in every language with an all() function — Python\'s all([]) is True for the same reason.',
      code: '[].every(x => false)   // true',
    },
    {
      q: 'How do I make an empty array fail validation?',
      a: 'Test the length as well. every alone cannot express "and there must be something", because that is a separate claim about the array rather than about its elements.',
      code: 'items.length > 0 && items.every(pred)',
    },
    {
      q: 'Is !every the same as some?',
      a: 'No. !every(p) means at least one element FAILS p; some(p) means at least one PASSES p. They are only equivalent if you also negate the predicate: !every(p) === some(not p).',
    },
  ],

  history: [
    { version: 'ES5', note: 'every and some standardised together in 2009.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every',
    meta:  'Array.prototype.every',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are validating' },
  ],
};
