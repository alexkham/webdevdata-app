// content/reference/javascript/methods/array-indexof.js
//
// Slug is lowercased (`array-indexof`, not `array-indexOf`) so URLs stay
// case-insensitive and match the rest of the slugs.

export const meta = {
  slug:        'array-indexof',
  name:        'Array.prototype.indexOf',
  signature:   'array.indexOf(searchElement[, fromIndex])',
  blurb:       'Position of the first match, or -1 — and it can never find NaN.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'array indexOf position find search first minus one strict equality NaN javascript',
};

export const method = {
  slug:      'array-indexof',
  name:      'Array.prototype.indexOf',
  signature: 'array.indexOf(searchElement[, fromIndex])',
  returns:   { type: 'number', desc: 'Index of the first strictly-equal element, or -1 if there is none. NaN is never found, because NaN !== NaN.' },

  category:    'Array method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'Strict equality throughout, which has one famous consequence: an array containing NaN still reports -1 when you search for NaN.',

  cheat: {
    commonCall: 'items.indexOf(value)',
    returns:    'number — the index, or -1 when absent',
    replaces:   'a manual loop comparing each element',
    watchOut:   '-1 is truthy, so `if (indexOf(x))` is almost always a bug',
  },

  parameters: [
    { name: 'searchElement', type: 'any',    required: true,  default: null, desc: 'Value to locate, compared with strict equality (===).' },
    { name: 'fromIndex',     type: 'number', required: false, default: '0',  desc: 'Index to start from. Negative counts from the end. Past the length returns -1 immediately.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to locate',          input: 'number' },
  ],
  demoTemplate: '{items}.indexOf({value})',
  cases: [
    { id: 'found',   label: 'found',        values: { items: '1,2,3',   value: 2 } },
    { id: 'first',   label: 'first of two', values: { items: '1,2,1,2', value: 2 } },
    { id: 'missing', label: 'absent → -1',  values: { items: '1,2,3',   value: 99 } },
    { id: 'start',   label: 'at index 0',   values: { items: '1,2,3',   value: 1 } },
    { id: 'empty',   label: 'empty array',  values: { items: '',        value: 1 } },
  ],
  demoExplainer: 'The first matching index comes back, or -1 when there is no match. With duplicates you always get the earliest. The -1 is the part to be careful with: it is a perfectly ordinary number and it is TRUTHY, so testing the result without comparing it explicitly gives the opposite of what you meant for an element at index 0.',

  patterns: [
    {
      name: 'Find then remove',
      desc: 'The usual pairing with splice.',
      code: 'const i = items.indexOf(value);\nif (i !== -1) items.splice(i, 1);',
    },
    {
      name: 'Prefer includes for presence',
      desc: 'When you do not need the position.',
      code: 'if (items.includes(value)) { ... }',
    },
    {
      name: 'Find every occurrence',
      desc: 'fromIndex advances past each hit.',
      code: 'let i = items.indexOf(v);\nwhile (i !== -1) {\n  found.push(i);\n  i = items.indexOf(v, i + 1);\n}',
    },
  ],

  examples: [
    { title: 'Found',            code: '[1, 2, 3].indexOf(2)',    returns: '1' },
    { title: 'Absent',           code: '[1, 2, 3].indexOf(99)',   returns: '-1' },
    { title: 'First of two',     code: '[1, 2, 1].indexOf(1)',    returns: '0' },
    { title: 'NaN never found',  code: '[NaN].indexOf(NaN)',      returns: '-1' },
    { title: 'includes can',     code: '[NaN].includes(NaN)',     returns: 'true' },
    { title: 'Holes not found',  code: '[1, , 3].indexOf(undefined)', returns: '-1' },
  ],

  pitfalls: [
    {
      name: '-1 is truthy',
      desc: 'The classic. Testing the result directly is backwards: a missing element gives -1 which is truthy, and an element at index 0 gives 0 which is falsy. Both cases come out exactly wrong.',
      wrong: { label: 'Backwards', code: 'if (items.indexOf(x)) { /* "found" */ }', output: 'true when ABSENT, false at index 0' },
      fix:   { label: 'Compare explicitly', code: 'if (items.indexOf(x) !== -1) { ... }', output: 'correct' },
    },
    {
      name: 'It can never find NaN',
      desc: 'indexOf compares with ===, and NaN is not equal to itself by definition. An array visibly containing NaN still reports -1 — which is precisely why includes was added.',
      wrong: { label: 'Not found', code: '[NaN].indexOf(NaN)', output: '-1' },
      fix:   { label: 'Use includes', code: '[NaN].includes(NaN)', output: 'true' },
    },
    {
      name: 'No type coercion',
      desc: 'Strict equality means a numeric string never matches a number. Values from forms, query strings and JSON are the usual culprits.',
      wrong: { label: 'String vs number', code: "[1, 2, 3].indexOf('2')", output: '-1' },
      fix:   { label: 'Convert first',    code: '[1, 2, 3].indexOf(Number("2"))', output: '1' },
    },
    {
      name: 'Objects match by identity',
      desc: 'A structurally identical object is a different value, so indexOf returns -1. Use findIndex with a predicate when you need to match on contents.',
      wrong: { label: 'Different object', code: '[{id: 1}].indexOf({id: 1})', output: '-1' },
      fix:   { label: 'Use findIndex',    code: '[{id: 1}].findIndex(o => o.id === 1)', output: '0' },
    },
  ],

  when: {
    use: [
      'You need the POSITION of a value',
      'Find-then-splice removal by value',
      'Walking every occurrence with fromIndex',
    ],
    avoid: [
      'You only need presence → includes, which reads better',
      'The value might be NaN → includes',
      'Matching objects by contents → findIndex',
    ],
  },

  notes: {
    complexity: 'O(n) — a linear scan, stopping at the first match',
    return:     'A number; -1 means absent, and -1 is truthy',
    cpython:    'V8: Builtins-array-indexof.tq',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.includes', slug: 'array-includes', when: 'A boolean answer, and it finds NaN' },
    { name: 'Array.prototype.find',     slug: 'array-find',     when: 'You want the element rather than its index' },
    { name: 'Array.prototype.splice',   slug: 'array-splice',   when: 'Remove the element once you have the index' },
    { name: 'Array.prototype.at',       slug: 'array-at',       when: 'Read the element at a position' },
  ],

  faq: [
    {
      q: 'Why does indexOf not find NaN?',
      a: 'Because it compares with strict equality, and NaN === NaN is false by IEEE-754 definition. No strict-equality search can ever match NaN. includes uses SameValueZero instead, which treats NaN as equal to itself.',
      code: '[NaN].indexOf(NaN)    // -1\n[NaN].includes(NaN)   // true',
    },
    {
      q: 'Why is my "found" check inverted?',
      a: 'Because -1 is truthy and 0 is falsy. An absent element gives -1 and passes an if, while an element at index 0 gives 0 and fails one. Always compare against -1 explicitly, or use includes.',
      code: 'if (items.indexOf(x) !== -1) { ... }',
    },
    {
      q: 'indexOf or findIndex?',
      a: 'indexOf compares a VALUE with strict equality. findIndex runs a predicate, so it can match on contents, ranges, or anything else. For objects you almost always want findIndex.',
    },
  ],

  history: [
    { version: 'ES5', note: 'indexOf standardised in 2009, alongside lastIndexOf.' },
    { version: 'ES2016', note: 'includes added, giving a membership test that handles NaN.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf',
    meta:  'Array.prototype.indexOf',
  },

};
