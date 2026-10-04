// content/reference/javascript/methods/number-tofixed.js

export const meta = {
  slug:        'number-tofixed',
  name:        'Number.prototype.toFixed',
  signature:   'number.toFixed([digits])',
  blurb:       'Fixed decimal places as a STRING — and (1.005).toFixed(2) is "1.00", not "1.01".',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'toFixed decimal places rounding money currency precision floating point string format javascript',
};

export const method = {
  slug:      'number-tofixed',
  name:      'Number.prototype.toFixed',
  signature: 'number.toFixed([digits])',
  returns:   { type: 'string', desc: 'A STRING with exactly the requested number of decimal places. Not a number — arithmetic on the result concatenates instead of adding.' },

  category:    'Number method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The standard way to format a number for display, and a reliable source of confusion: it returns a string, and its rounding follows the binary value rather than the decimal one you wrote.',

  cheat: {
    commonCall: 'price.toFixed(2)',
    returns:    'a string with that many decimals',
    replaces:   'manual Math.round(n * 100) / 100 arithmetic',
    watchOut:   'a STRING, and 1.005 rounds DOWN',
  },

  parameters: [
    { name: 'digits', type: 'number', required: false, default: '0', desc: 'Decimal places to show, 0 to 100. Anything outside that range throws RangeError. Trailing zeros are added to reach the count.' },
  ],

  demoParams: [
    { name: 'n', type: 'number', hint: 'a number',        input: 'float' },
    { name: 'd', type: 'number', hint: 'decimal places',  input: 'number' },
  ],
  demoTemplate: '({n}).toFixed({d})',
  cases: [
    { id: 'money',   label: 'ordinary money value',   values: { n: 3.14159, d: 2 } },
    { id: 'half',    label: '1.005 → "1.00" (!)',     values: { n: 1.005, d: 2 } },
    { id: 'other',   label: '1.045 → "1.04" (!)',     values: { n: 1.045, d: 2 } },
    { id: 'pad',     label: 'zeros padded on',        values: { n: 1.5, d: 4 } },
    { id: 'round',   label: '2.5 → "3"',              values: { n: 2.5, d: 0 } },
  ],
  demoExplainer: "The first case is the everyday use. The second and third are the ones that generate bug reports: 1.005 formatted to two places gives '1.00', not '1.01'. Nothing is broken — the literal 1.005 cannot be represented exactly in binary floating point, and the value actually stored is very slightly BELOW 1.005, so rounding down is correct for the number that exists. The same applies to 1.045. Note also that the output is padded with zeros to reach the requested width, and that every result here is a string.",

  patterns: [
    {
      name: 'Format for display',
      desc: 'The result is text, so use it as text.',
      code: 'el.textContent = `$${price.toFixed(2)}`;',
    },
    {
      name: 'Store money as integers',
      desc: 'Cents, not dollars — no floating point at all.',
      code: 'const cents = 1005;\nconst shown = (cents / 100).toFixed(2);',
    },
    {
      name: 'Format with Intl instead',
      desc: 'Handles currency, grouping and locale.',
      code: "new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price);",
    },
  ],

  examples: [
    { title: 'Two decimals',     code: '(3.14159).toFixed(2)',  returns: "'3.14'" },
    { title: 'Rounds DOWN',      code: '(1.005).toFixed(2)',    returns: "'1.00'" },
    { title: 'Padded',           code: '(1.5).toFixed(4)',      returns: "'1.5000'" },
    { title: 'It is a string',   code: 'typeof (1).toFixed(2)', returns: "'string'" },
    { title: 'Huge numbers bail',code: '(1e21).toFixed(2)',     returns: "'1e+21'" },
    { title: 'Out of range',     code: '(1).toFixed(101)',      returns: 'RangeError: toFixed() digits argument must be between 0 and 100' },
  ],

  pitfalls: [
    {
      name: 'It returns a string, not a number',
      desc: 'The most common mistake. Adding the result to another value concatenates, and comparisons against numbers do the wrong thing. If you need a number back you have to convert it, which usually means you wanted a different tool entirely.',
      wrong: { label: 'Concatenation', code: '(1).toFixed(2) + 1', output: "'1.001'" },
      fix:   { label: 'Convert back',  code: 'Number((1).toFixed(2)) + 1', output: '2' },
    },
    {
      name: '1.005 does not round up',
      desc: 'Not a bug in toFixed. The double closest to 1.005 is slightly less than 1.005, so rounding to two places correctly gives 1.00. Any decimal that cannot be written exactly in binary can behave this way, which is why money should not be held in floating point at all.',
      wrong: { label: 'Surprising', code: '(1.005).toFixed(2)', output: "'1.00'" },
      fix:   { label: 'Integer cents', code: '(Math.round(1.005 * 1000) / 10).toFixed(0)', output: "'101'   // work in smaller units" },
    },
    {
      name: 'Very large numbers fall back to exponential',
      desc: 'At 1e21 and above the method abandons fixed notation and returns the exponential form instead, so output you expected to be digit-for-digit predictable suddenly is not.',
      wrong: { label: 'Not fixed at all', code: '(1e21).toFixed(2)', output: "'1e+21'" },
      fix:   { label: 'Use Intl',        code: 'new Intl.NumberFormat().format(1e21)', output: 'grouped digits' },
    },
    {
      name: 'It is not locale-aware',
      desc: 'The decimal separator is always a dot and there is no digit grouping, so output shown to users in most of Europe is wrong. toLocaleString or Intl.NumberFormat handle both.',
      wrong: { label: 'Always a dot', code: '(1234.5).toFixed(2)', output: "'1234.50'" },
      fix:   { label: 'Locale-aware', code: "(1234.5).toLocaleString('de-DE', {minimumFractionDigits: 2})", output: "'1.234,50'" },
    },
  ],

  when: {
    use: [
      'Formatting a number for display with a fixed number of decimals',
      'Producing a consistent string for a log or a fixed-width report',
      'Quick output where locale does not matter',
    ],
    avoid: [
      'Money arithmetic → integer minor units, or a decimal library',
      'User-facing numbers → toLocaleString or Intl.NumberFormat',
      'You need a number back → you probably wanted Math.round',
      'Significant digits rather than decimal places → toPrecision',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string; the number is unchanged',
    cpython:    'V8: Builtins-number-tofixed',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.prototype.toPrecision',    slug: 'number-toprecision',    when: 'Significant digits instead of decimal places' },
    { name: 'Number.prototype.toLocaleString', slug: 'number-tolocalestring', when: 'Grouping, currency and locale' },
    { name: 'Number.constants',                slug: 'number-constants',      when: 'Why 0.1 + 0.2 is not 0.3' },
    { name: 'Number.parseFloat',               slug: 'number-parsefloat',     when: 'Turning the string back into a number' },
  ],

  faq: [
    {
      q: 'Why does (1.005).toFixed(2) give 1.00?',
      a: 'Because 1.005 is not the number you think it is. Written as a double it is approximately 1.00499999999999989, which correctly rounds to 1.00. Multiply it by 1000 and you get 1004.9999999999999 — the shortfall is visible.',
      code: '1.005 * 1000;   // 1004.9999999999999',
    },
    {
      q: 'How should I handle money then?',
      a: 'Store integer minor units — cents, pence — and divide only when displaying. Floating point cannot represent most decimal fractions exactly, so any accumulation of dollars-as-doubles drifts. For heavy financial work use a decimal library.',
      code: 'const totalCents = items.reduce((a, i) => a + i.cents, 0);\nconst shown = (totalCents / 100).toFixed(2);',
    },
    {
      q: 'How do I get a number instead of a string?',
      a: 'Wrap it in Number, but ask why first — if you are rounding for computation you want Math.round with a scale factor, and if you are rounding for display the string is what you needed all along.',
      code: 'Math.round(n * 100) / 100;   // a number\nn.toFixed(2);                // a string',
    },
    {
      q: 'toFixed or Intl.NumberFormat?',
      a: 'Intl for anything a user reads — it handles the decimal separator, digit grouping, currency symbols and negative formats for their locale. toFixed is fine for logs, ids and fixed-width output where those things must not vary.',
    },
  ],

  history: [
    { version: 'ES3',    note: 'toFixed, toPrecision and toExponential added together.' },
    { version: 'ES2012', note: 'ECMA-402 brought Intl.NumberFormat, the correct tool for user-facing numbers.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed',
    meta:  'Number.prototype.toFixed',
  },

};
