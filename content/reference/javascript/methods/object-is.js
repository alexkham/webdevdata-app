// content/reference/javascript/methods/object-is.js

export const meta = {
  slug:        'object-is',
  name:        'Object.is',
  signature:   'Object.is(a, b)',
  blurb:       'Equality that admits NaN equals NaN and that 0 is not -0 — the two cases === gets wrong.',
  category:    'object',
  type:        'object',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Object.is same value equality NaN negative zero strict equals triple equals comparison es2015 javascript',
};

export const method = {
  slug:      'object-is',
  name:      'Object.is',
  signature: 'Object.is(a, b)',
  returns:   { type: 'boolean', desc: 'True if the two values are the SameValue. Identical to === except for NaN, which equals itself here, and 0 versus -0, which do not.' },

  category:    'Object static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Not a deep-equality helper, despite the name. It compares exactly what === compares, differing on precisely two pairs of values.',

  cheat: {
    commonCall: 'Object.is(a, b)',
    returns:    'boolean',
    replaces:   'Number.isNaN checks, and 1/x sign tests for -0',
    watchOut:   'it does NOT compare objects structurally',
  },

  parameters: [
    { name: 'a', type: 'any', required: true, default: null, desc: 'First value. Objects are compared by reference, exactly as with ===.' },
    { name: 'b', type: 'any', required: true, default: null, desc: 'Second value.' },
  ],

  demoParams: [
    { name: 'a', type: 'any', hint: 'first value',  input: 'auto' },
    { name: 'b', type: 'any', hint: 'second value', input: 'auto' },
  ],
  demoTemplate: 'Object.is({a}, {b})',
  cases: [
    { id: 'same',     label: 'same number',         values: { a: '1', b: '1' } },
    { id: 'diff',     label: 'different numbers',   values: { a: '1', b: '2' } },
    { id: 'strings',  label: 'same string',         values: { a: 'abc', b: 'abc' } },
    { id: 'numstr',   label: 'number vs string (!)',values: { a: '1', b: 'one' } },
    { id: 'floats',   label: 'a float',             values: { a: '1.5', b: '1.5' } },
  ],
  demoExplainer: "Every case here behaves exactly as === would, which is the honest headline: for ordinary values the two are identical, and === is shorter. The two differences that justify this method cannot be entered through a text box at all. Object.is(NaN, NaN) is TRUE where NaN === NaN is false, and Object.is(0, -0) is FALSE where 0 === -0 is true — but neither NaN nor negative zero survives being typed and parsed as text. Both are shown in the examples below, run against a real runtime.",

  patterns: [
    {
      name: 'Detect NaN in a comparison',
      desc: 'Where === always fails.',
      code: 'if (Object.is(value, NaN)) { }',
    },
    {
      name: 'Distinguish -0 from 0',
      desc: 'The only concise way.',
      code: 'const isNegZero = Object.is(x, -0);',
    },
    {
      name: 'Use === for everything else',
      desc: 'Shorter, and identical in every other case.',
      code: 'if (a === b) { }',
    },
  ],

  examples: [
    { title: 'NaN equals itself',  code: 'Object.is(NaN, NaN)', returns: 'true' },
    { title: '=== disagrees',      code: 'NaN === NaN',          returns: 'false' },
    { title: '0 is not -0',        code: 'Object.is(0, -0)',     returns: 'false' },
    { title: '=== disagrees again',code: '0 === -0',             returns: 'true' },
    { title: 'Objects by reference',code: 'Object.is({}, {})',   returns: 'false' },
    { title: 'Same reference',     code: 'const o = {};\nObject.is(o, o)', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'It does not compare objects structurally',
      desc: 'The name suggests a deep "is this the same thing", and it is nothing of the sort. Two objects with identical contents are different values, so this returns false — exactly like ===.',
      wrong: { label: 'Not structural', code: 'Object.is({a: 1}, {a: 1})', output: 'false' },
      fix:   { label: 'Compare contents', code: 'JSON.stringify(a) === JSON.stringify(b)', output: 'true, with caveats' },
    },
    {
      name: 'The -0 difference can surprise a memo comparison',
      desc: 'React and similar libraries use Object.is for their equality checks. A value that flips between 0 and -0 — easy to produce with multiplication or rounding — therefore counts as CHANGED and triggers a re-render, where === would have seen no change.',
      wrong: { label: 'Counts as different', code: 'Object.is(0, -1 * 0)', output: 'false' },
      fix:   { label: 'Normalise it',        code: 'Object.is(0, (-1 * 0) + 0)', output: 'true' },
    },
    {
      name: 'It is not the loose == either',
      desc: 'No type coercion happens at all. A string and a number that == would call equal are simply different values here, which is the correct behaviour and worth stating because the method name says nothing about types.',
      wrong: { label: 'No coercion', code: "Object.is(1, '1')", output: 'false' },
      fix:   { label: 'Convert first', code: "Object.is(1, Number('1'))", output: 'true' },
    },
    {
      name: 'Number.isNaN is clearer for the NaN case',
      desc: 'If you are testing one value for NaN rather than comparing two, the dedicated predicate says so directly. Object.is earns its place when you need one comparison that handles every value uniformly.',
      wrong: { label: 'Roundabout', code: 'Object.is(x, NaN)', output: 'works' },
      fix:   { label: 'Direct',     code: 'Number.isNaN(x)', output: 'clearer' },
    },
  ],

  when: {
    use: [
      'A comparison that must treat NaN as equal to NaN',
      'Distinguishing -0 from 0',
      'Implementing a general-purpose equality check over values of any type',
      'Matching the semantics libraries use for change detection',
    ],
    avoid: [
      'Ordinary comparison → ===, which is shorter and identical here',
      'Testing a single value for NaN → Number.isNaN',
      'Comparing object contents → a deep-equality function',
      'You want type coercion → == , though generally do not',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-object-is / SameValue',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; values are only read',
  },

  related: [
    { name: 'Object.freeze',  slug: 'object-freeze',  when: 'Protecting values rather than comparing them' },
    { name: 'Object.hasOwn',  slug: 'object-hasown',  when: 'Testing for a property instead of a value' },
    { name: 'Object.entries', slug: 'object-entries', when: 'Building a structural comparison yourself' },
    { name: 'Object.keys',    slug: 'object-keys',    when: 'Comparing two objects key by key' },
  ],

  faq: [
    {
      q: 'When does Object.is actually differ from ===?',
      a: 'In exactly two cases, and no others. NaN is equal to itself here and not under ===; 0 and -0 are different here and equal under ===. For every other pair of values the two agree, which is why === remains the right default.',
      code: 'Object.is(NaN, NaN);   // true,  NaN === NaN is false\nObject.is(0, -0);      // false, 0 === -0 is true',
    },
    {
      q: 'Does it do deep comparison?',
      a: 'No. The name is misleading — it is the SameValue algorithm from the specification, and objects are compared by identity. Two structurally identical objects are different values.',
      code: 'Object.is({a: 1}, {a: 1});   // false',
    },
    {
      q: 'Where does -0 come from?',
      a: 'From arithmetic that underflows toward zero from the negative side — multiplying by a negative, rounding a small negative number, or dividing. It prints as 0 and compares equal to 0 with ===, so Object.is is effectively the only convenient way to notice it.',
      code: 'Math.round(-0.2);   // -0\n-1 * 0;             // -0',
    },
    {
      q: 'Why do React hooks use it?',
      a: 'Because it gives a total, sensible equality over every value type — including NaN, which under === would make a state value containing NaN look permanently changed and re-render forever. The -0 case is the price paid for that.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Object.is added, exposing the internal SameValue algorithm the specification already used.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is',
    meta:  'Object.is',
  },

};
