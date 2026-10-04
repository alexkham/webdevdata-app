// content/reference/javascript/methods/number-parseint.js

export const meta = {
  slug:        'number-parseint',
  name:        'Number.parseInt',
  signature:   'Number.parseInt(string[, radix])',
  blurb:       'Reads digits until it cannot — which is why map(parseInt) returns nonsense.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES2015 (global since ES1)',
  searchTerms: 'parseInt Number.parseInt radix base 10 hex prefix map callback NaN parse integer truncate javascript',
};

export const method = {
  slug:      'number-parseint',
  name:      'Number.parseInt',
  signature: 'Number.parseInt(string[, radix])',
  returns:   { type: 'number', desc: 'An integer parsed from the START of the string, stopping at the first character that is not a valid digit. NaN if nothing valid was found at all.' },

  category:    'Number static method',
  version:     'ES2015 (global since ES1)',
  hasLiveDemo: true,

  subtitle: 'Identical to the global parseInt — the same function object, re-exposed on Number in ES2015. Its lenient parsing is useful for things like "42px" and disastrous everywhere else.',

  cheat: {
    commonCall: 'parseInt(s, 10)',
    returns:    'an integer, or NaN',
    replaces:   'nothing; Number(s) is the strict alternative',
    watchOut:   'never pass it directly to map — the index becomes the radix',
  },

  parameters: [
    { name: 'string', type: 'string', required: true,  default: null, desc: 'The text to parse. Leading whitespace is skipped; parsing stops at the first invalid character. A non-string argument is converted to a string FIRST, which is how tiny numbers parse wrongly.' },
    { name: 'radix',  type: 'number', required: false, default: '10', desc: 'The base, 2 to 36. Omitted it is 10, except that a 0x prefix forces 16. Always pass it explicitly.' },
  ],

  demoParams: [
    { name: 's',     type: 'string', hint: 'text to parse', input: 'text' },
    { name: 'radix', type: 'number', hint: 'base (10 for decimal)', input: 'number' },
  ],
  demoTemplate: 'parseInt({s}, {radix})',
  cases: [
    { id: 'px',      label: 'stops at the letters', values: { s: '42px', radix: 10 } },
    { id: 'lead',    label: 'letters first → NaN',  values: { s: 'px42', radix: 10 } },
    { id: 'hex',     label: 'base 16',              values: { s: 'ff', radix: 16 } },
    { id: 'exp',     label: '1e3 → 1 (!)',          values: { s: '1e3', radix: 10 } },
    { id: 'space',   label: 'whitespace skipped',   values: { s: '  42  ', radix: 10 } },
  ],
  demoExplainer: "Parsing runs from the left and stops at the first character that is not a digit in the given base, so '42px' gives 42 while 'px42' gives NaN — leading junk is fatal, trailing junk is ignored. The fourth case catches people out: '1e3' parses as 1, because 'e' is not a decimal digit and parsing halts there. Number('1e3') gives 1000, because it understands exponent notation. That difference alone decides which of the two you should be using.",

  patterns: [
    {
      name: 'Always pass the radix',
      desc: 'Removes the 0x special case entirely.',
      code: 'const n = parseInt(input, 10);',
    },
    {
      name: 'In a map, wrap it',
      desc: 'Otherwise the index arrives as the radix.',
      code: 'strings.map(s => parseInt(s, 10));',
    },
    {
      name: 'Use Number for strict parsing',
      desc: 'Rejects trailing junk instead of ignoring it.',
      code: 'const n = Number(input);   // NaN for "42px"',
    },
  ],

  examples: [
    { title: 'Trailing junk ignored', code: "parseInt('42px', 10)", returns: '42' },
    { title: 'Leading junk fatal',    code: "parseInt('px42', 10)", returns: 'NaN' },
    { title: 'Exponent not understood', code: "parseInt('1e3', 10)", returns: '1' },
    { title: 'Number understands it', code: "Number('1e3')",        returns: '1000' },
    { title: 'The map trap',          code: "['10', '10', '10'].map(parseInt)", returns: '[10, NaN, 2]' },
    { title: 'Tiny numbers break',    code: 'parseInt(0.0000005)',  returns: '5' },
  ],

  pitfalls: [
    {
      name: 'Passing it directly to map',
      desc: 'map calls its callback with (value, index, array), so the index becomes the radix. The first element parses in base 0 — treated as 10 — the second in base 1, which is invalid and gives NaN, and the third in base 2. The result looks random and is entirely deterministic.',
      wrong: { label: 'Index as radix', code: "['10', '10', '10'].map(parseInt)", output: '[10, NaN, 2]' },
      fix:   { label: 'Wrap it',        code: "['10', '10', '10'].map(s => parseInt(s, 10))", output: '[10, 10, 10]' },
    },
    {
      name: 'It converts non-strings to strings first',
      desc: 'Passing a number looks harmless until the number is small enough to stringify in exponential form. 0.0000005 becomes "5e-7", parsing stops at the e, and the answer is 5 — off by seven orders of magnitude, silently.',
      wrong: { label: 'Wildly wrong', code: 'parseInt(0.0000005)', output: '5' },
      fix:   { label: 'Truncate properly', code: 'Math.trunc(0.0000005)', output: '0' },
    },
    {
      name: 'Trailing garbage is accepted',
      desc: 'It is a lenient parser by design, which makes it unsuitable for validation — "42abc" and "42" both give 42, so a form field full of nonsense passes silently. Number is strict and returns NaN for anything not entirely numeric.',
      wrong: { label: 'Accepts junk', code: "parseInt('42abc', 10)", output: '42' },
      fix:   { label: 'Strict',       code: "Number('42abc')", output: 'NaN' },
    },
    {
      name: 'Omitting the radix still has one special case',
      desc: 'Modern engines no longer treat a leading zero as octal, so parseInt("08") is 8. But a 0x prefix is still read as hexadecimal, so a string of digits beginning 0x parses in base 16 when you expected base 10.',
      wrong: { label: 'Hex assumed', code: "parseInt('0x1f')", output: '31' },
      fix:   { label: 'Force base 10', code: "parseInt('0x1f', 10)", output: '0' },
    },
  ],

  when: {
    use: [
      'Pulling a number off the front of text — "42px", "3 items"',
      'Parsing in a non-decimal base, with an explicit radix',
      'Reading values from formats that append units',
    ],
    avoid: [
      'Validating user input → Number, which rejects trailing junk',
      'Values in exponent notation → Number',
      'Truncating a number you already have → Math.trunc',
      'Decimals matter → parseFloat',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the parsed prefix',
    return:     'A number, or NaN; nothing is modified',
    cpython:    'V8: Builtins-number-parseint',
    memory:     'May allocate when converting a non-string argument',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.parseFloat',          slug: 'number-parsefloat',   when: 'Decimals and exponent notation' },
    { name: 'Number.isNaN',               slug: 'number-isnan',        when: 'Testing whether the parse failed' },
    { name: 'Number.prototype.toString',  slug: 'number-tostring',     when: 'The inverse — number to a string in any base' },
    { name: 'Number.isInteger',           slug: 'number-isinteger',    when: 'Checking the result is a whole number' },
  ],

  faq: [
    {
      q: 'parseInt or Number?',
      a: 'Number for validation — it rejects anything not entirely numeric and understands exponent notation. parseInt when you deliberately want the leading digits of a string that has other characters after them, like a CSS length.',
      code: "Number('42px');        // NaN — strict\nparseInt('42px', 10);  // 42  — lenient",
    },
    {
      q: 'Do I still need the radix argument?',
      a: 'Yes. The octal-by-leading-zero behaviour is gone from modern engines, but 0x still forces base 16, and passing 10 explicitly documents the intent and makes the function safe to reference. Linters flag the omission for good reason.',
      code: "parseInt('0x1f');       // 31\nparseInt('0x1f', 10);   // 0",
    },
    {
      q: 'Why does map(parseInt) produce NaN?',
      a: 'Because map passes the index as the second argument and parseInt reads that as the radix. Element 1 is parsed in base 1, which does not exist. Any function you pass to map should take exactly the arguments you intend.',
      code: "['10', '10', '10'].map(s => parseInt(s, 10));",
    },
    {
      q: 'Is Number.parseInt different from the global?',
      a: 'No — they are literally the same function object. Number.parseInt was added in ES2015 purely so the parsing functions could be reached through the Number namespace rather than only as globals.',
      code: 'Number.parseInt === parseInt;   // true',
    },
  ],

  history: [
    { version: 'ES1',    note: 'parseInt present as a global from the first version, with octal-by-leading-zero behaviour.' },
    { version: 'ES5',    note: 'The implicit octal interpretation removed; only the 0x prefix remains special.' },
    { version: 'ES2015', note: 'Exposed as Number.parseInt, the identical function under a namespace.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt',
    meta:  'Number.parseInt',
  },

};
