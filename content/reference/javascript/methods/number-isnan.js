// content/reference/javascript/methods/number-isnan.js

export const meta = {
  slug:        'number-isnan',
  name:        'Number.isNaN',
  signature:   'Number.isNaN(value)',
  blurb:       'Is this value actually NaN? The global isNaN answers a different, much worse question.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Number.isNaN isNaN global coercion NaN not a number check equality Object.is es2015 javascript',
};

export const method = {
  slug:      'number-isnan',
  name:      'Number.isNaN',
  signature: 'Number.isNaN(value)',
  returns:   { type: 'boolean', desc: 'True only if the value IS the NaN number. No coercion — a non-number argument is simply false, never converted first.' },

  category:    'Number static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Added because the global isNaN was misnamed. The global asks "would this become NaN if converted to a number", which is true for every non-numeric string.',

  cheat: {
    commonCall: 'Number.isNaN(x)',
    returns:    'boolean',
    replaces:   'the global isNaN, and the x !== x trick',
    watchOut:   'the global coerces; this one does not',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Only the actual NaN number returns true — strings, undefined and objects are all false regardless of what they would convert to.' },
  ],

  demoParams: [
    { name: 'v', type: 'any', hint: 'any value', input: 'auto' },
  ],
  demoTemplate: '[Number.isNaN({v}), isNaN({v})]',
  cases: [
    { id: 'text',    label: 'a word → they DISAGREE (!)', values: { v: 'abc' } },
    { id: 'number',  label: 'a number',                   values: { v: '42' } },
    { id: 'numstr',  label: 'a numeric string',           values: { v: '42' } },
    { id: 'empty',   label: 'empty string',               values: { v: '' } },
    { id: 'float',   label: 'a float',                    values: { v: '1.5' } },
  ],
  demoExplainer: "The pair is [Number.isNaN(v), isNaN(v)]. The first case is the whole reason this method exists: for the string 'abc' the two disagree — Number.isNaN says false, because a string is not the NaN number, while the global says TRUE, because converting 'abc' to a number would produce NaN. The global is really asking 'is this un-numeric', which is a different question and almost never the one you meant. For genuine numbers the two always agree.",

  patterns: [
    {
      name: 'Check a computation result',
      desc: 'The legitimate use — did the arithmetic fail?',
      code: 'const n = Number(input);\nif (Number.isNaN(n)) showError();',
    },
    {
      name: 'Validate that a string is numeric',
      desc: 'What the global isNaN gets misused for.',
      code: 'const isNumeric = s => s.trim() !== "" && !Number.isNaN(Number(s));',
    },
    {
      name: 'Object.is works too',
      desc: 'NaN equals itself under SameValue.',
      code: 'Object.is(x, NaN);',
    },
  ],

  examples: [
    { title: 'Actual NaN',      code: 'Number.isNaN(NaN)',     returns: 'true' },
    { title: 'A string is not', code: "Number.isNaN('abc')",   returns: 'false' },
    { title: 'The global says yes', code: "isNaN('abc')",      returns: 'true' },
    { title: 'undefined',       code: 'isNaN(undefined)',      returns: 'true' },
    { title: 'But it is not NaN', code: 'Number.isNaN(undefined)', returns: 'false' },
    { title: 'NaN is not itself', code: 'NaN === NaN',         returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'The global isNaN coerces first',
      desc: 'isNaN("abc") is true, isNaN(undefined) is true, isNaN({}) is true — none of those values IS NaN. The global is a numeric-validity test wearing the wrong name, and using it to check a computation result gives false positives for every non-number that passes through.',
      wrong: { label: 'Coerces', code: "isNaN('abc')", output: 'true' },
      fix:   { label: 'Does not', code: "Number.isNaN('abc')", output: 'false' },
    },
    {
      name: 'NaN is not equal to itself',
      desc: 'Every comparison involving NaN is false, including NaN === NaN. That is why a dedicated predicate is needed at all, and why a value that has become NaN silently fails every equality check downstream rather than throwing.',
      wrong: { label: 'Never true', code: 'const x = 0/0;\nx === NaN', output: 'false' },
      fix:   { label: 'Use the predicate', code: 'Number.isNaN(0/0)', output: 'true' },
    },
    {
      name: 'Using it to validate input',
      desc: 'It only answers whether a value already IS NaN. To check whether a string represents a number you must convert first — and handle the empty string, which converts to 0 rather than NaN.',
      wrong: { label: 'Always false for strings', code: "Number.isNaN('')", output: 'false' },
      fix:   { label: 'Convert, then check', code: "const s = '';\ns.trim() !== '' && !Number.isNaN(Number(s))", output: 'false' },
    },
    {
      name: 'NaN propagates silently through arithmetic',
      desc: 'Once one operand is NaN every subsequent result is NaN, with no error anywhere. A single bad parse at the start of a pipeline surfaces as NaN in the output, far from its cause.',
      wrong: { label: 'Spreads', code: "const t = Number('x') + 1 + 2", output: 'NaN' },
      fix:   { label: 'Check at the boundary', code: "const n = Number('x');\nif (Number.isNaN(n)) throw new Error('bad input');", output: 'fails early' },
    },
  ],

  when: {
    use: [
      'Testing whether a computation produced NaN',
      'Validating the result of Number() or parseFloat',
      'Any check where a non-number must NOT count as NaN',
    ],
    avoid: [
      'Checking whether a string is numeric → convert first, then test',
      'You want one predicate over all values → Object.is(x, NaN)',
      'Checking for finiteness → Number.isFinite',
      'The global isNaN → almost never the right question',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A boolean; nothing is allocated or coerced',
    cpython:    'V8: Builtins-number-isnan',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.isFinite',     slug: 'number-isfinite',   when: 'The same global-versus-static split' },
    { name: 'Number.isInteger',    slug: 'number-isinteger',  when: 'Another non-coercing numeric predicate' },
    { name: 'Object.is',           slug: 'object-is',         when: 'NaN equality as part of general comparison' },
    { name: 'Number.parseFloat',   slug: 'number-parsefloat', when: 'The parse whose failure you are testing' },
  ],

  faq: [
    {
      q: 'What is the difference from the global isNaN?',
      a: 'The global converts its argument to a number first, so it returns true for anything un-numeric — strings, undefined, objects. Number.isNaN performs no conversion and returns true only for the NaN value itself. The global is almost always the wrong question.',
      code: "isNaN('abc');          // true  — 'would this be NaN?'\nNumber.isNaN('abc');   // false — 'is this NaN?'",
    },
    {
      q: 'Why can I not just write x === NaN?',
      a: 'Because NaN is defined to be unequal to everything including itself, so that comparison is always false. It is the one value in the language that fails reflexive equality, which is exactly why a predicate is needed.',
      code: 'NaN === NaN;           // false\nNumber.isNaN(NaN);     // true\nObject.is(NaN, NaN);   // true',
    },
    {
      q: 'How do I check whether a string is a valid number?',
      a: 'Convert it and test the result, remembering that an empty or whitespace-only string converts to 0 rather than NaN. That last detail is what makes the naive version accept blank input.',
      code: "const isNumeric = s =>\n  s.trim() !== '' && !Number.isNaN(Number(s));",
    },
    {
      q: 'Where does NaN come from?',
      a: 'Any arithmetic that has no meaningful numeric answer — 0/0, Infinity minus Infinity, the square root of a negative, or any operation on a value that failed to parse. It then propagates through every subsequent calculation.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'The global isNaN present from the start, with its coercing behaviour.' },
    { version: 'ES2015', note: 'Number.isNaN added as the non-coercing version, alongside Number.isFinite and Number.isInteger.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN',
    meta:  'Number.isNaN',
  },

  tryInTool: [],
};
