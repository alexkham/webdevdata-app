// content/reference/javascript/methods/array-includes.js

export const meta = {
  slug:        'array-includes',
  name:        'Array.prototype.includes',
  signature:   'array.includes(searchElement[, fromIndex])',
  blurb:       'Is this value in the array? Unlike indexOf, it can find NaN.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2016',
  searchTerms: 'array includes contains membership has NaN SameValueZero indexOf es2016 javascript',
};

export const method = {
  slug:      'array-includes',
  name:      'Array.prototype.includes',
  signature: 'array.includes(searchElement[, fromIndex])',
  returns:   { type: 'boolean', desc: 'True if the array contains the value, compared with SameValueZero — which treats NaN as equal to itself.' },

  category:    'Array method',
  version:     'ES2016',
  hasLiveDemo: true,

  subtitle: 'The reason it exists: indexOf uses strict equality and therefore can never find NaN. includes uses SameValueZero and can.',

  cheat: {
    commonCall: 'items.includes(value)',
    returns:    'boolean — no index, no -1 check',
    replaces:   'indexOf(x) !== -1',
    watchOut:   'no type coercion — includes("2") is false for [2]',
  },

  parameters: [
    { name: 'searchElement', type: 'any',    required: true,  default: null, desc: 'Value to look for. Compared with SameValueZero: like ===, except NaN equals NaN.' },
    { name: 'fromIndex',     type: 'number', required: false, default: '0',  desc: 'Index to start from. Negative counts from the end.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to look for',        input: 'number' },
  ],
  demoTemplate: '{items}.includes({value})',
  cases: [
    { id: 'found',   label: 'present',      values: { items: '1,2,3', value: 2 } },
    { id: 'missing', label: 'absent',       values: { items: '1,2,3', value: 99 } },
    { id: 'first',   label: 'first element',values: { items: '1,2,3', value: 1 } },
    { id: 'empty',   label: 'empty array',  values: { items: '',      value: 1 } },
  ],
  demoExplainer: 'A plain boolean answer — no index to interpret and no -1 to remember. An empty array is always false. The interesting behaviour is not visible with numbers from a text box: includes compares with SameValueZero, which behaves exactly like === except that it considers NaN equal to itself. That one difference is the entire reason the method was added.',

  patterns: [
    {
      name: 'Membership test',
      desc: 'The readable replacement for an indexOf comparison.',
      code: "if (allowed.includes(role)) { ... }",
    },
    {
      name: 'Find NaN',
      desc: 'The one thing indexOf cannot do.',
      code: 'if (values.includes(NaN)) { ... }',
    },
    {
      name: 'Guard against a long or-chain',
      desc: 'Clearer than repeated equality checks.',
      code: "if (['a', 'b', 'c'].includes(key)) { ... }",
    },
  ],

  examples: [
    { title: 'Present',          code: '[1, 2, 3].includes(2)',     returns: 'true' },
    { title: 'Absent',           code: '[1, 2, 3].includes(99)',    returns: 'false' },
    { title: 'Finds NaN',        code: '[NaN].includes(NaN)',       returns: 'true' },
    { title: 'indexOf cannot',   code: '[NaN].indexOf(NaN)',        returns: '-1' },
    { title: 'No coercion',      code: "[1, 2, 3].includes('2')",   returns: 'false' },
    { title: 'Finds holes',      code: '[1, , 3].includes(undefined)', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'No type coercion',
      desc: 'Comparison is strict, so a numeric string never matches a number. Data arriving from a form or a query string routinely fails this way.',
      wrong: { label: 'String vs number', code: "[1, 2, 3].includes('2')", output: 'false' },
      fix:   { label: 'Convert first',    code: '[1, 2, 3].includes(Number("2"))', output: 'true' },
    },
    {
      name: 'Objects match by identity, not contents',
      desc: 'Two structurally identical objects are different values, so includes says false. Only the very same reference is found.',
      wrong: { label: 'Different objects', code: '[{id: 1}].includes({id: 1})', output: 'false' },
      fix:   { label: 'Use some',          code: '[{id: 1}].some(o => o.id === 1)', output: 'true' },
    },
    {
      name: 'ES2016 and newer only',
      desc: 'Missing in older runtimes and Internet Explorer entirely. The pre-2016 idiom is an indexOf comparison, which behaves identically apart from NaN.',
      wrong: { label: 'Missing method', code: 'items.includes(x)', output: 'TypeError: items.includes is not a function' },
      fix:   { label: 'Old idiom',      code: 'items.indexOf(x) !== -1', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'A plain yes/no membership test',
      'Checking a value against a fixed allow-list',
      'Any search where NaN might be the value',
    ],
    avoid: [
      'You need the POSITION → indexOf',
      'Matching objects by contents → some with a predicate',
      'Large arrays searched repeatedly → a Set, which is O(1)',
    ],
  },

  notes: {
    complexity: 'O(n) — a linear scan, stopping at the first match',
    return:     'A boolean; the array is never modified',
    cpython:    'V8: Builtins-array-includes.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.indexOf', slug: 'array-indexof', when: 'You need the position, not just presence' },
    { name: 'Array.prototype.some',    slug: 'array-some',    when: 'Matching by a predicate rather than a value' },
    { name: 'Array.prototype.find',    slug: 'array-find',    when: 'You want the matching element itself' },
    { name: 'Array.prototype.filter',  slug: 'array-filter',  when: 'You want every match' },
  ],

  faq: [
    {
      q: 'Why use includes over indexOf?',
      a: 'It reads as the question you are asking and returns a boolean, so there is no -1 to remember. It also finds NaN, which indexOf structurally cannot because it compares with strict equality and NaN !== NaN.',
      code: '[NaN].includes(NaN)   // true\n[NaN].indexOf(NaN)    // -1',
    },
    {
      q: 'Why does it not find my object?',
      a: 'Because objects compare by identity. Two objects with the same properties are still different values. Use some with a predicate that compares the fields you care about.',
      code: 'items.some(o => o.id === targetId)',
    },
    {
      q: 'Is includes fast on a large array?',
      a: 'It is a linear scan, so repeated lookups on a big array add up. If you are testing membership in a loop, build a Set once and use set.has, which is constant time.',
      code: 'const seen = new Set(items);\nseen.has(value);',
    },
  ],

  history: [
    { version: 'ES2016', note: 'Added specifically to provide a membership test that handles NaN correctly.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes',
    meta:  'Array.prototype.includes',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
