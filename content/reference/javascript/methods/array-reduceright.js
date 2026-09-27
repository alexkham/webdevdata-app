// content/reference/javascript/methods/array-reduceright.js

export const meta = {
  slug:        'array-reduceright',
  name:        'Array.prototype.reduceRight',
  signature:   'array.reduceRight(callback[, initialValue])',
  blurb:       'reduce running backwards — which only matters when the operation is not commutative.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array reduceRight fold right foldr reverse backwards accumulate compose pipe es5 javascript',
};

export const method = {
  slug:      'array-reduceright',
  name:      'Array.prototype.reduceRight',
  signature: 'array.reduceRight(callback[, initialValue])',
  returns:   { type: 'any', desc: 'Whatever the callback returned on the final iteration — which here is the one at index 0. With an initialValue and an empty array, that value comes straight back.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Identical to reduce in every respect except direction: it starts at the last element and works towards the first. For a sum that changes nothing, and for anything order-dependent it changes everything.',

  cheat: {
    commonCall: 'items.reduceRight((acc, x) => acc.concat(x), [])',
    returns:    'a single value, folded from the right',
    replaces:   'items.slice().reverse().reduce(...) — one fewer copy',
    watchOut:   'for a sum or a product it is just reduce with extra confusion',
  },

  parameters: [
    { name: 'callback',     type: 'Function', required: true,  default: null, desc: 'Called as callback(accumulator, element, index, array). The index still reports the real position, so it counts DOWN.' },
    { name: 'initialValue', type: 'any',      required: false, default: 'last element', desc: 'Starting accumulator. Omitted, the LAST element is used and iteration starts at the second-to-last — so an empty array throws.' },
  ],

  demoParams: [
    { name: 'items', type: 'string[]', hint: 'strings, comma separated', input: 'csv' },
  ],
  demoTemplate: '{items}.reduceRight((a, b) => a + b)',
  cases: [
    { id: 'letters', label: 'three letters',    values: { items: 'a,b,c' } },
    { id: 'two',     label: 'two letters',      values: { items: 'x,y' } },
    { id: 'single',  label: 'one element',      values: { items: 'a' } },
    { id: 'empty',   label: 'empty, no initial (!)', values: { items: '' } },
  ],
  demoExplainer: "String concatenation makes the direction visible: ['a','b','c'] folds to 'cba', where plain reduce gives 'abc'. That is the whole difference. The single-element case returns that element without ever calling the callback, because with no initial value the last element IS the seed and there is nothing left to fold into it. The empty case throws the same TypeError reduce does, for the same reason — no seed, and no element to borrow one from.",

  patterns: [
    {
      name: 'Compose functions',
      desc: 'The classic use. compose(f, g, h)(x) is f(g(h(x))) — the LAST function listed runs first.',
      code: 'const compose = (...fns) => x =>\n  fns.reduceRight((acc, f) => f(acc), x);',
    },
    {
      name: 'Flatten one level, back to front',
      desc: 'Order is reversed as a side effect of the direction.',
      code: 'const flat = nested.reduceRight((acc, x) => acc.concat(x), []);',
    },
    {
      name: 'Build a nested structure from the inside out',
      desc: 'Wrapping layers where the last element ends up innermost.',
      code: 'const wrapped = layers.reduceRight((inner, L) => L(inner), core);',
    },
  ],

  examples: [
    { title: 'Concatenation reverses', code: "['a','b','c'].reduceRight((a, b) => a + b)", returns: "'cba'" },
    { title: 'reduce for contrast',    code: "['a','b','c'].reduce((a, b) => a + b)",      returns: "'abc'" },
    { title: 'Subtraction differs',    code: '[1, 2, 3].reduceRight((a, b) => a - b)',     returns: '0' },
    { title: 'reduce again',           code: '[1, 2, 3].reduce((a, b) => a - b)',          returns: '-4' },
    { title: 'A sum is identical',     code: '[1, 2, 3].reduceRight((a, b) => a + b, 0)',  returns: '6' },
    { title: 'Empty, no initial',      code: '[].reduceRight((a, b) => a + b)',            returns: 'TypeError: Reduce of empty array with no initial value' },
  ],

  pitfalls: [
    {
      name: 'Reaching for it when the operation is commutative',
      desc: 'Summing, multiplying, counting, taking a maximum — none of these care about direction, so reduceRight produces exactly what reduce would while making the reader stop and work out whether it matters. Use it only when the order genuinely changes the answer.',
      wrong: { label: 'No difference, more thought', code: '[1, 2, 3].reduceRight((a, b) => a + b, 0)', output: '6' },
      fix:   { label: 'Just reduce',                 code: '[1, 2, 3].reduce((a, b) => a + b, 0)',      output: '6' },
    },
    {
      name: 'The accumulator is still the FIRST parameter',
      desc: 'Direction changes, parameter order does not. The callback is always (accumulator, element) — not (element, accumulator) — so a subtraction reads as acc - element even though the elements arrive backwards.',
      wrong: { label: 'Read as element - acc', code: '[1, 2, 3].reduceRight((a, b) => a - b)', output: '0  // 3 - 2 = 1, then 1 - 1 = 0' },
      fix:   { label: 'acc is a, element is b', code: '[1, 2, 3].reduceRight((acc, el) => acc - el)', output: '0' },
    },
    {
      name: 'Same empty-array TypeError as reduce',
      desc: 'Omitting the initial value carries identical risk. reduceRight seeds from the LAST element instead of the first, but an empty array has neither, and the message is word-for-word the same.',
      wrong: { label: 'Throws on empty', code: '[].reduceRight((a, b) => a + b)',    output: 'TypeError: Reduce of empty array with no initial value' },
      fix:   { label: 'Always seed it',  code: '[].reduceRight((a, b) => a + b, 0)', output: '0' },
    },
    {
      name: 'reverse() before reduce mutates',
      desc: 'The obvious substitute is a trap. reverse reorders the array IN PLACE, so writing items.reverse().reduce(...) silently rearranges the array the caller handed you. reduceRight needs no copy and no mutation.',
      wrong: { label: 'Mutates the source', code: 'items.reverse().reduce(f)',      output: 'items is now backwards' },
      fix:   { label: 'Or copy first',      code: 'items.reduceRight(f)',           output: 'items untouched' },
    },
  ],

  when: {
    use: [
      'Function composition, where the rightmost function should apply first',
      'Folding a non-commutative operation from the end — concatenation, subtraction, division',
      'Building nested structures from the innermost layer outwards',
      'Anywhere you would otherwise reverse a copy just to reduce it',
    ],
    avoid: [
      'The operation is commutative → reduce, which reads more plainly',
      'You want the array reversed as a value → toReversed',
      'One value out per value in → map',
      'You only need the last element → at(-1)',
    ],
  },

  notes: {
    complexity: 'O(n) for the iteration, plus whatever the callback costs',
    return:     'The final accumulator; the original array is never modified',
    cpython:    'V8: Builtins-array-reduce.tq (shared with reduce)',
    memory:     'Only the accumulator — no reversed copy is made',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.reduce',     slug: 'array-reduce',     when: 'The same fold, left to right' },
    { name: 'Array.prototype.toReversed', slug: 'array-toreversed', when: 'You want a reversed array, not a folded value' },
    { name: 'Array.prototype.reverse',    slug: 'array-reverse',    when: 'Reversing in place — and why not to chain it into reduce' },
    { name: 'Array.prototype.flat',       slug: 'array-flat',       when: 'Flattening, which reduceRight is sometimes misused for' },
  ],

  faq: [
    {
      q: 'When does reduceRight actually differ from reduce?',
      a: 'Only when the callback is not commutative — when f(a, b) and f(b, a) disagree. Addition, multiplication and Math.max give identical results either way. Concatenation, subtraction, division and anything that builds an ordered structure do not.',
      code: "['a','b','c'].reduce((a, b) => a + b);       // 'abc'\n['a','b','c'].reduceRight((a, b) => a + b);  // 'cba'",
    },
    {
      q: 'Why not reverse the array and use reduce?',
      a: 'reverse mutates the array in place, so that version quietly corrupts the source unless you copy first. reduceRight walks backwards without touching the array or allocating anything, so it is both safer and cheaper.',
      code: 'items.reduceRight(f);              // no copy, no mutation\nitems.slice().reverse().reduce(f); // same result, one wasted copy',
    },
    {
      q: 'Is this how compose is implemented?',
      a: 'Yes — it is the canonical use. compose(f, g, h)(x) should evaluate h first, so folding from the right feeds x into the last function and works outwards. Writing the same thing with reduce gives you pipe, where the first function runs first.',
      code: 'const compose = (...fns) => x => fns.reduceRight((acc, f) => f(acc), x);\nconst pipe    = (...fns) => x => fns.reduce((acc, f) => f(acc), x);',
    },
    {
      q: 'Does the index argument count down?',
      a: 'Yes. The callback still receives each element at its real position, so for a three-element array the indices arrive as 2, then 1, then 0. Code that assumes an ascending index will be wrong.',
    },
  ],

  history: [
    { version: 'ES5', note: 'Array.prototype.reduceRight standardised in 2009 alongside reduce.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight',
    meta:  'Array.prototype.reduceRight',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are folding' },
  ],
};
