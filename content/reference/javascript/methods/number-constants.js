// content/reference/javascript/methods/number-constants.js
//
// One page for the Number constants — MAX_SAFE_INTEGER, EPSILON, MAX_VALUE,
// MIN_VALUE and the infinities. They are properties rather than methods, so
// the demo exercises the boundary they describe instead of printing them.

export const meta = {
  slug:        'number-constants',
  name:        'Number constants (MAX_SAFE_INTEGER, EPSILON…)',
  signature:   'Number.MAX_SAFE_INTEGER, Number.EPSILON, Number.MAX_VALUE…',
  blurb:       'Where integers stop being exact, and why 0.1 + 0.2 is not 0.3.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES1 / ES2015',
  searchTerms: 'MAX_SAFE_INTEGER MIN_SAFE_INTEGER EPSILON MAX_VALUE MIN_VALUE POSITIVE_INFINITY NEGATIVE_INFINITY Infinity overflow precision float double BigInt javascript',
};

export const method = {
  slug:      'number-constants',
  name:      'Number constants (MAX_SAFE_INTEGER, EPSILON…)',
  signature: 'Number.MAX_SAFE_INTEGER, Number.EPSILON, Number.MAX_VALUE…',
  returns:   { type: 'number', desc: 'Each is a fixed numeric property describing a limit of the IEEE-754 double that every JavaScript number is.' },

  category:    'Number constants',
  version:     'ES1 / ES2015',
  hasLiveDemo: true,

  subtitle: 'Every JavaScript number is a 64-bit float, including the ones that look like integers. These constants mark where that representation starts to lose information.',

  cheat: {
    commonCall: 'Number.MAX_SAFE_INTEGER',
    returns:    '9007199254740991 — 2⁵³ − 1',
    replaces:   'hard-coded magic numbers',
    watchOut:   'past it, n === n + 1 becomes TRUE',
  },

  parameters: [
    { name: 'MAX_SAFE_INTEGER', type: 'number', required: false, default: '9007199254740991', desc: '2⁵³ − 1. The largest integer for which every integer up to it is exactly representable. MIN_SAFE_INTEGER is its negative.' },
    { name: 'EPSILON',          type: 'number', required: false, default: '2.22e-16',         desc: 'The gap between 1 and the next representable number — the standard tolerance for comparing floats near 1.' },
    { name: 'MAX_VALUE',        type: 'number', required: false, default: '1.79e+308',        desc: 'The largest finite number. Anything above it is Infinity. MIN_VALUE is the smallest positive, about 5e-324.' },
  ],

  demoParams: [
    { name: 'n', type: 'number', hint: 'a large integer', input: 'number' },
  ],
  demoTemplate: '[Number.isSafeInteger({n}), {n} === {n} + 1]',
  cases: [
    { id: 'safe',    label: 'MAX_SAFE_INTEGER — still fine', values: { n: 9007199254740991 } },
    { id: 'unsafe',  label: 'one more → BREAKS (!)',         values: { n: 9007199254740992 } },
    { id: 'small',   label: 'an ordinary number',            values: { n: 42 } },
    { id: 'big',     label: 'far past the limit',            values: { n: 9007199254741000 } },
  ],
  demoExplainer: "The pair is [is this a safe integer, does it equal itself plus one]. At MAX_SAFE_INTEGER the answer is [true, false] — everything behaves. Add one and it becomes [false, true]: the number is no longer exactly representable, so adding 1 produces the same value back. That is not a rounding display issue; the addition genuinely has no effect. Any id, timestamp in nanoseconds, or accumulated counter that crosses this line starts silently merging distinct values, which is why large integers from a backend should arrive as strings or be handled as BigInt.",

  patterns: [
    {
      name: 'Compare floats with a tolerance',
      desc: 'EPSILON is the right scale near 1.',
      code: 'const equal = Math.abs(a - b) < Number.EPSILON;',
    },
    {
      name: 'Use BigInt past the safe range',
      desc: 'Arbitrary precision, at the cost of interop.',
      code: 'const big = 9007199254740993n;',
    },
    {
      name: 'Keep large ids as strings',
      desc: 'They are identifiers, not quantities.',
      code: 'const id = "9007199254740993";   // never parse it',
    },
  ],

  examples: [
    { title: 'The safe limit',     code: 'Number.MAX_SAFE_INTEGER',          returns: '9007199254740991' },
    { title: 'Past it, addition stops', code: '2 ** 53 === 2 ** 53 + 1',     returns: 'true' },
    { title: 'Epsilon',            code: 'Number.EPSILON',                   returns: '2.220446049250313e-16' },
    { title: 'The classic',        code: '0.1 + 0.2',                        returns: '0.30000000000000004' },
    { title: 'Compared properly',  code: 'Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON', returns: 'true' },
    { title: 'Overflow is Infinity', code: 'Number.MAX_VALUE * 2',           returns: 'Infinity' },
  ],

  pitfalls: [
    {
      name: 'Large integers silently lose precision',
      desc: 'No error, no warning — arithmetic simply stops having an effect. Database ids, Twitter-style snowflake ids and nanosecond timestamps all exceed 2⁵³, and JSON.parse will happily produce a number that is already wrong by the time you see it.',
      wrong: { label: 'Already corrupted', code: "JSON.parse('{\"id\": 9007199254740993}').id", output: '9007199254740992' },
      fix:   { label: 'Keep it a string',  code: "JSON.parse('{\"id\": \"9007199254740993\"}').id", output: "'9007199254740993'" },
    },
    {
      name: 'EPSILON is not a universal tolerance',
      desc: 'It is the gap between 1 and the next double, so it is the right scale for values near 1 and far too small for large ones. Comparing two numbers around a million with EPSILON is the same as comparing them exactly.',
      wrong: { label: 'Too strict up there', code: 'Math.abs(1e9 - (1e9 + 1)) < Number.EPSILON', output: 'false' },
      fix:   { label: 'Scale the tolerance', code: 'Math.abs(a - b) < Number.EPSILON * Math.max(Math.abs(a), Math.abs(b))', output: 'relative comparison' },
    },
    {
      name: 'MIN_VALUE is not the most negative number',
      desc: 'The name misleads. MIN_VALUE is the smallest POSITIVE number, about 5e-324 — a tiny fraction, not a large negative. The most negative finite number is -Number.MAX_VALUE.',
      wrong: { label: 'Not negative at all', code: 'Number.MIN_VALUE',   output: '5e-324' },
      fix:   { label: 'The real minimum',    code: '-Number.MAX_VALUE',  output: '-1.7976931348623157e+308' },
    },
    {
      name: 'Overflow gives Infinity rather than an error',
      desc: 'Exceeding MAX_VALUE produces Infinity silently, and Infinity then propagates through every later calculation much as NaN does. Subtracting two infinities gives NaN, at which point the original cause is long gone.',
      wrong: { label: 'Silent overflow', code: 'Number.MAX_VALUE * 2', output: 'Infinity' },
      fix:   { label: 'Check for it',    code: 'Number.isFinite(result)', output: 'false' },
    },
  ],

  when: {
    use: [
      'Bounds-checking integers before they lose precision',
      'Tolerance-based float comparison, scaled appropriately',
      'Detecting overflow after a large computation',
      'Documenting why a value is handled as a string or BigInt',
    ],
    avoid: [
      'Integers beyond the safe range → BigInt, or strings',
      'Money → integer minor units',
      'Exact decimal arithmetic → a decimal library',
      'Comparing large floats → a relative tolerance, not EPSILON alone',
    ],
  },

  notes: {
    complexity: 'O(1) — these are plain properties',
    return:     'Fixed numbers; all are non-writable and non-configurable',
    cpython:    'V8: number constants in the Number object setup',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the values never change',
  },

  related: [
    { name: 'Number.isInteger',           slug: 'number-isinteger',   when: 'isSafeInteger, the predicate for this boundary' },
    { name: 'Number.isFinite',            slug: 'number-isfinite',    when: 'Detecting the Infinity that overflow produces' },
    { name: 'Number.prototype.toFixed',   slug: 'number-tofixed',     when: 'Where float imprecision shows up in formatting' },
    { name: 'Number.isNaN',               slug: 'number-isnan',       when: 'The other way arithmetic goes wrong' },
  ],

  faq: [
    {
      q: 'Why is 0.1 + 0.2 not 0.3?',
      a: 'Because neither 0.1 nor 0.2 can be written exactly in binary, any more than a third can be written exactly in decimal. Each is stored as the nearest double, and the two errors do not cancel. The result is 0.30000000000000004 — correct for the values that actually exist.',
      code: '0.1 + 0.2;                                  // 0.30000000000000004\nMath.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;   // true',
    },
    {
      q: 'What exactly is unsafe about an unsafe integer?',
      a: 'That it may not be the only integer mapping to that double. Past 2⁵³ the representable values are spaced more than 1 apart, so two different integers can round to the same stored number — and n + 1 can equal n. Equality and arithmetic both stop meaning what you expect.',
      code: '2 ** 53 === 2 ** 53 + 1;   // true',
    },
    {
      q: 'When should I use BigInt?',
      a: 'When you need exact integers beyond the safe range and you are doing arithmetic on them. BigInt cannot be mixed with Number in an expression and does not serialise to JSON, so for ids you are only passing through, a string is simpler.',
      code: 'const a = 9007199254740993n;\na + 1n;   // exact',
    },
    {
      q: 'How should I compare two floats?',
      a: 'With a tolerance scaled to their magnitude. EPSILON alone works near 1; for larger values multiply it by the bigger of the two operands to get a relative comparison.',
      code: 'const close = (a, b) =>\n  Math.abs(a - b) <= Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b));',
    },
  ],

  history: [
    { version: 'ES1',    note: 'MAX_VALUE, MIN_VALUE, NaN and the infinities present from the first version.' },
    { version: 'ES2015', note: 'MAX_SAFE_INTEGER, MIN_SAFE_INTEGER and EPSILON added, naming limits developers had been hard-coding.' },
    { version: 'ES2020', note: 'BigInt arrived, giving exact integers beyond the safe range.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER',
    meta:  'Number.MAX_SAFE_INTEGER',
  },

};
