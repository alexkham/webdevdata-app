// content/reference/javascript/methods/number-isinteger.js
//
// isSafeInteger is consolidated here: the same predicate with the extra
// precision requirement, and only meaningful next to its looser sibling.

export const meta = {
  slug:        'number-isinteger',
  name:        'Number.isInteger',
  signature:   'Number.isInteger(value)',
  blurb:       'A whole number with no coercion — and 5.0 counts, because there is no integer type.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Number.isInteger isSafeInteger whole number integer check coercion float modulo validate es2015 javascript',
};

export const method = {
  slug:      'number-isinteger',
  name:      'Number.isInteger',
  signature: 'Number.isInteger(value)',
  returns:   { type: 'boolean', desc: 'True if the value is a number with no fractional part. No coercion — a numeric STRING is false, because it is not a number at all.' },

  category:    'Number static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'JavaScript has no integer type, so this asks about the value rather than the type: is this double a whole number? Its companion isSafeInteger adds the requirement that the value be exactly representable.',

  cheat: {
    commonCall: 'Number.isInteger(x)',
    returns:    'boolean',
    replaces:   'x % 1 === 0, which coerces strings',
    watchOut:   'a numeric string is FALSE — convert first',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'Any value. Non-numbers return false without conversion. Infinity and NaN are false; 5.0 is true, because it is indistinguishable from 5.' },
  ],

  demoParams: [
    { name: 'v', type: 'any', hint: 'any value', input: 'auto' },
  ],
  demoTemplate: 'Number.isInteger({v})',
  cases: [
    { id: 'whole',   label: 'a whole number',        values: { v: '5' } },
    { id: 'float',   label: 'a fraction',            values: { v: '5.5' } },
    { id: 'text',    label: 'a word → false',        values: { v: 'abc' } },
    { id: 'zero',    label: 'zero',                  values: { v: '0' } },
    { id: 'neg',     label: 'a negative whole',      values: { v: '-7' } },
  ],
  demoExplainer: "Whole numbers are true, fractions false, and non-numeric text false. What the demo cannot easily show is the no-coercion rule that matters most: Number.isInteger('5') — the STRING five — is false, because a string is not a number no matter what it looks like. The auto input here converts numeric-looking text to a real number before the call, which is exactly the conversion your own code has to do first. Also worth knowing: 5.0 is true, since JavaScript stores it identically to 5.",

  patterns: [
    {
      name: 'Validate a parsed value',
      desc: 'Convert first, then test.',
      code: 'const n = Number(input);\nif (!Number.isInteger(n)) reject();',
    },
    {
      name: 'Guard an array index',
      desc: 'Whole, non-negative and in range.',
      code: 'const ok = Number.isInteger(i) && i >= 0 && i < arr.length;',
    },
    {
      name: 'Check precision as well',
      desc: 'isSafeInteger for ids and counters.',
      code: 'if (!Number.isSafeInteger(id)) throw new Error("id too large");',
    },
  ],

  examples: [
    { title: 'A whole number',   code: 'Number.isInteger(5)',       returns: 'true' },
    { title: '5.0 is the same',  code: 'Number.isInteger(5.0)',     returns: 'true' },
    { title: 'A fraction',       code: 'Number.isInteger(5.5)',     returns: 'false' },
    { title: 'A string is false',code: "Number.isInteger('5')",     returns: 'false' },
    { title: 'Past the safe limit', code: 'Number.isSafeInteger(2 ** 53)', returns: 'false' },
    { title: 'Just inside it',   code: 'Number.isSafeInteger(2 ** 53 - 1)', returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'A numeric string is false',
      desc: 'Deliberate — the method tests the value, and a string is not a number. Form input arrives as text, so validation must convert first. Forgetting gives a validator that rejects every legitimate entry.',
      wrong: { label: 'Rejects valid input', code: "Number.isInteger('5')", output: 'false' },
      fix:   { label: 'Convert first',       code: "Number.isInteger(Number('5'))", output: 'true' },
    },
    {
      name: '5.0 is an integer, and 5 is a float',
      desc: 'There is only one numeric type. A value that arrived as 5.0 from JSON is stored exactly as 5, so this returns true and there is no way to recover the distinction. Code that needs to know whether the source text had a decimal point must inspect the text.',
      wrong: { label: 'Indistinguishable', code: 'Number.isInteger(5.0)', output: 'true' },
      fix:   { label: 'Check the source',  code: "'5.0'.includes('.')", output: 'true' },
    },
    {
      name: 'Integer does not mean safe',
      desc: 'Past 2⁵³ values are still whole numbers, so isInteger stays true while arithmetic silently loses precision. For ids, counters and timestamps the stricter isSafeInteger is the right test.',
      wrong: { label: 'Still true', code: 'Number.isInteger(2 ** 53 + 2)', output: 'true' },
      fix:   { label: 'Stricter',   code: 'Number.isSafeInteger(2 ** 53 + 2)', output: 'false' },
    },
    {
      name: 'The old modulo trick coerces',
      desc: 'x % 1 === 0 was the pre-2015 idiom and it converts its operand, so it answers true for the string "5", for an empty array, and for null. This method does not convert anything.',
      wrong: { label: 'Coerces', code: "'5' % 1 === 0", output: 'true' },
      fix:   { label: 'Does not', code: "Number.isInteger('5')", output: 'false' },
    },
  ],

  when: {
    use: [
      'Validating that a converted value is whole',
      'Guarding array indices and counts',
      'Rejecting fractional input where only whole units make sense',
      'With isSafeInteger, checking ids have not lost precision',
    ],
    avoid: [
      'The value is a string → convert with Number first',
      'You need the whole part → Math.trunc or Math.floor',
      'Large exact integers → BigInt',
      'Checking for any number → Number.isFinite',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A boolean; nothing is allocated or coerced',
    cpython:    'V8: Builtins-number-isinteger',
    memory:     'No allocation',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.constants',   slug: 'number-constants',  when: 'MAX_SAFE_INTEGER, the boundary isSafeInteger tests' },
    { name: 'Number.isFinite',    slug: 'number-isfinite',   when: 'Any finite number, whole or not' },
    { name: 'Number.isNaN',       slug: 'number-isnan',      when: 'The other non-coercing predicate' },
    { name: 'Number.parseInt',    slug: 'number-parseint',   when: 'Producing an integer from text' },
  ],

  faq: [
    {
      q: 'Why is Number.isInteger("5") false?',
      a: 'Because the argument is a string, and the method performs no conversion — that is the whole design. The global-style predicates that DO convert, such as isNaN, are exactly the ones ES2015 added replacements for.',
      code: "Number.isInteger(Number('5'));   // true",
    },
    {
      q: 'What is the difference from isSafeInteger?',
      a: 'isSafeInteger adds the requirement that the value be within ±(2⁵³ − 1), where every integer is exactly representable. Beyond that, whole numbers still pass isInteger but arithmetic on them is no longer reliable.',
      code: 'Number.isInteger(2 ** 53);       // true\nNumber.isSafeInteger(2 ** 53);   // false',
    },
    {
      q: 'How do I tell 5 from 5.0?',
      a: 'You cannot, from the number. Both are the same double. If the distinction matters — a schema that cares about integer versus decimal types — you have to inspect the original text before it was parsed.',
    },
    {
      q: 'Is it faster than x % 1 === 0?',
      a: 'Speed is not the reason to prefer it. The modulo form coerces its operand, so it returns true for strings, empty arrays and null. Correctness is the argument.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Number.isInteger and Number.isSafeInteger added with the non-coercing predicates.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger',
    meta:  'Number.isInteger',
  },

};
