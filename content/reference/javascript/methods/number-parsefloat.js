// content/reference/javascript/methods/number-parsefloat.js

export const meta = {
  slug:        'number-parsefloat',
  name:        'Number.parseFloat',
  signature:   'Number.parseFloat(string)',
  blurb:       'Lenient decimal parsing — it understands exponents, ignores trailing junk, and has no radix.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES2015 (global since ES1)',
  searchTerms: 'parseFloat Number.parseFloat decimal parse float exponent trailing junk NaN Number difference javascript',
};

export const method = {
  slug:      'number-parsefloat',
  name:      'Number.parseFloat',
  signature: 'Number.parseFloat(string)',
  returns:   { type: 'number', desc: 'A number parsed from the start of the string, stopping at the first character that cannot continue a decimal literal. NaN if nothing valid was found.' },

  category:    'Number static method',
  version:     'ES2015 (global since ES1)',
  hasLiveDemo: true,

  subtitle: 'The same function as the global parseFloat. Unlike parseInt it understands exponent notation and takes no radix — and unlike Number it tolerates trailing rubbish.',

  cheat: {
    commonCall: 'parseFloat(s)',
    returns:    'a number, or NaN',
    replaces:   'nothing; Number(s) is the strict alternative',
    watchOut:   "parseFloat('') is NaN but Number('') is 0",
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'The text to parse. Leading whitespace is skipped, parsing stops at the first character that cannot extend the number, and Infinity is recognised by name.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to parse', input: 'text' },
  ],
  demoTemplate: 'parseFloat({s})',
  cases: [
    { id: 'units',  label: 'stops at the letters',  values: { s: '3.14abc' } },
    { id: 'lead',   label: 'leading dot works',     values: { s: '.5' } },
    { id: 'expo',   label: 'exponent understood',   values: { s: '1e3' } },
    { id: 'hex',    label: '0x10 → 0 (!)',          values: { s: '0x10' } },
    { id: 'empty',  label: 'empty → NaN (!)',       values: { s: '' } },
  ],
  demoExplainer: "Parsing runs from the left and stops at the first character that cannot continue a decimal number, so '3.14abc' gives 3.14 — a CSS length parses neatly. Exponent notation IS understood, which is the main difference from parseInt: '1e3' gives 1000 here and 1 there. The hex case shows there is no radix support at all — parsing stops at the x, leaving 0. The empty string is the detail most worth remembering: parseFloat('') is NaN, while Number('') is 0, so the two disagree on exactly the input a blank form field produces.",

  patterns: [
    {
      name: 'Read a CSS length',
      desc: 'The unit is ignored automatically.',
      code: "const px = parseFloat(getComputedStyle(el).width);",
    },
    {
      name: 'Strict parsing instead',
      desc: 'Number rejects trailing junk.',
      code: 'const n = Number(input);   // NaN for "3.14abc"',
    },
    {
      name: 'Validate the result',
      desc: 'Both forms can produce NaN.',
      code: 'const n = parseFloat(s);\nif (Number.isNaN(n)) reject();',
    },
  ],

  examples: [
    { title: 'Trailing junk ignored', code: "parseFloat('3.14abc')", returns: '3.14' },
    { title: 'Leading dot',           code: "parseFloat('.5')",      returns: '0.5' },
    { title: 'Exponent works',        code: "parseFloat('1e3')",     returns: '1000' },
    { title: 'parseInt does not',     code: "parseInt('1e3', 10)",   returns: '1' },
    { title: 'No hex support',        code: "parseFloat('0x10')",    returns: '0' },
    { title: 'Empty disagrees with Number', code: "[parseFloat(''), Number('')]", returns: '[NaN, 0]' },
  ],

  pitfalls: [
    {
      name: "parseFloat('') is NaN while Number('') is 0",
      desc: 'The two standard conversions disagree on the single most common invalid input — a blank field. Whichever you use, handle the empty case explicitly rather than relying on the difference.',
      wrong: { label: 'Silently zero', code: "Number('')", output: '0' },
      fix:   { label: 'Guard blank',   code: "const s = '';\ns.trim() === '' ? null : Number(s)", output: 'null' },
    },
    {
      name: 'Trailing garbage is accepted',
      desc: 'By design — that is what makes it useful for "3.14abc". It also makes it useless for validation, since a field containing 3.14 followed by anything at all passes. Number is the strict counterpart.',
      wrong: { label: 'Accepts junk', code: "parseFloat('3.14abc')", output: '3.14' },
      fix:   { label: 'Strict',       code: "Number('3.14abc')", output: 'NaN' },
    },
    {
      name: 'No radix, and no hex',
      desc: 'Unlike parseInt there is no second argument, and a 0x prefix is not recognised. Parsing stops at the x and you get 0 — a plausible-looking wrong answer rather than NaN.',
      wrong: { label: 'Stops at x', code: "parseFloat('0x10')", output: '0' },
      fix:   { label: 'parseInt for hex', code: "parseInt('0x10', 16)", output: '16' },
    },
    {
      name: 'It is locale-blind',
      desc: 'Only a dot is a decimal separator. A number typed by a European user as 1,5 parses as 1, losing the fraction entirely — and a grouped value like 1,234.5 parses as just 1.',
      wrong: { label: 'Comma stops it', code: "parseFloat('1,5')", output: '1' },
      fix:   { label: 'Normalise first', code: "parseFloat('1,5'.replace(',', '.'))", output: '1.5' },
    },
  ],

  when: {
    use: [
      'Extracting a number from text with a unit — CSS lengths, "3.5kg"',
      'Values that may be in exponent notation',
      'Lenient parsing where trailing content is expected',
    ],
    avoid: [
      'Validating user input → Number, which is strict',
      'Hexadecimal or another base → parseInt with a radix',
      'Locale-formatted numbers → normalise the separators first',
      'You want a whole number → parseInt, or Math.trunc',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the parsed prefix',
    return:     'A number, or NaN; nothing is modified',
    cpython:    'V8: Builtins-number-parsefloat',
    memory:     'May allocate when converting a non-string argument',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.parseInt',    slug: 'number-parseint',    when: 'Whole numbers, and non-decimal bases' },
    { name: 'Number.isNaN',       slug: 'number-isnan',       when: 'Testing whether the parse failed' },
    { name: 'Number.isFinite',    slug: 'number-isfinite',    when: 'Checking the result is usable' },
    { name: 'Number.prototype.toFixed', slug: 'number-tofixed', when: 'Formatting the parsed value back out' },
  ],

  faq: [
    {
      q: 'parseFloat or Number?',
      a: 'Number for validation — it rejects anything not entirely numeric and treats an empty string as 0, which you should guard anyway. parseFloat when the string legitimately has trailing content you want ignored, such as a CSS unit.',
      code: "Number('3.14px');       // NaN\nparseFloat('3.14px');   // 3.14",
    },
    {
      q: 'Why does parseFloat("0x10") give 0?',
      a: 'Because it parses a decimal literal and stops at the x, having already consumed the 0. There is no hexadecimal support and no radix argument — that is parseInt territory.',
      code: "parseInt('0x10', 16);   // 16",
    },
    {
      q: 'How do I parse a number typed in another locale?',
      a: 'Normalise the separators before parsing. There is no built-in locale-aware parser — Intl.NumberFormat formats but does not parse — so you have to strip group separators and convert the decimal mark yourself.',
      code: "parseFloat('1.234,5'.replace(/\\./g, '').replace(',', '.'));   // 1234.5",
    },
    {
      q: 'Is Number.parseFloat different from the global?',
      a: 'No — the same function object, exposed on Number in ES2015 so the parsing functions could be reached through a namespace.',
      code: 'Number.parseFloat === parseFloat;   // true',
    },
  ],

  history: [
    { version: 'ES1',    note: 'parseFloat present as a global from the first version.' },
    { version: 'ES2015', note: 'Exposed as Number.parseFloat, the identical function under a namespace.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat',
    meta:  'Number.parseFloat',
  },

  tryInTool: [],
};
