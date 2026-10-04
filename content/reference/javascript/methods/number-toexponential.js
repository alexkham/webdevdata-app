// content/reference/javascript/methods/number-toexponential.js

export const meta = {
  slug:        'number-toexponential',
  name:        'Number.prototype.toExponential',
  signature:   'number.toExponential([digits])',
  blurb:       'Always scientific notation — one digit before the point, however big the number.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'toExponential scientific notation mantissa exponent e+ precision significant digits format javascript',
};

export const method = {
  slug:      'number-toexponential',
  name:      'Number.prototype.toExponential',
  signature: 'number.toExponential([digits])',
  returns:   { type: 'string', desc: 'A string in exponential form — exactly one digit before the decimal point, then the requested digits after it, then e and a signed exponent.' },

  category:    'Number method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The predictable member of the formatting trio. Unlike toPrecision it never switches representation, which makes it the right choice when consistent output shape matters more than readability.',

  cheat: {
    commonCall: 'n.toExponential(2)',
    returns:    "a string like '1.23e+4'",
    replaces:   'toPrecision when you always want exponential',
    watchOut:   'the digits argument counts places AFTER the point',
  },

  parameters: [
    { name: 'digits', type: 'number', required: false, default: 'as many as needed', desc: 'Digits after the decimal point, 0 to 100. Omitted, as many as are needed to represent the value uniquely.' },
  ],

  demoParams: [
    { name: 'n', type: 'number', hint: 'a number',            input: 'float' },
    { name: 'd', type: 'number', hint: 'digits after the point', input: 'number' },
  ],
  demoTemplate: '({n}).toExponential({d})',
  cases: [
    { id: 'large',  label: 'a large number',    values: { n: 12345, d: 2 } },
    { id: 'small',  label: 'a small fraction',  values: { n: 0.0001, d: 2 } },
    { id: 'one',    label: 'the number 1',      values: { n: 1, d: 3 } },
    { id: 'zerod',  label: 'no digits after',   values: { n: 12345, d: 0 } },
    { id: 'neg',    label: 'a negative number', values: { n: -12345, d: 2 } },
  ],
  demoExplainer: "There is always exactly one digit before the point, and the exponent carries the magnitude — 12345 with two digits becomes '1.23e+4'. Small numbers get a negative exponent rather than a string of leading zeros, which is the main reason to reach for this over toFixed when values span many orders of magnitude. Unlike toPrecision, the output shape never changes: a consumer can always split it on 'e' and get a mantissa and an exponent.",

  patterns: [
    {
      name: 'Consistent output across magnitudes',
      desc: 'Every value formats to the same shape.',
      code: 'readings.map(r => r.toExponential(3));',
    },
    {
      name: 'Split into mantissa and exponent',
      desc: 'The format is reliably parseable.',
      code: "const [m, e] = n.toExponential(2).split('e');",
    },
    {
      name: 'Readable output instead',
      desc: 'Exponential notation is rarely what a user wants.',
      code: 'new Intl.NumberFormat().format(n);',
    },
  ],

  examples: [
    { title: 'Large number',    code: '(12345).toExponential(2)',  returns: "'1.23e+4'" },
    { title: 'Small fraction',  code: '(0.0001).toExponential()',  returns: "'1e-4'" },
    { title: 'Zero digits',     code: '(12345).toExponential(0)',  returns: "'1e+4'" },
    { title: 'Negative',        code: '(-12345).toExponential(2)', returns: "'-1.23e+4'" },
    { title: 'toFixed differs', code: '(0.0001).toFixed(2)',       returns: "'0.00'" },
    { title: 'It is a string',  code: 'typeof (1).toExponential(2)', returns: "'string'" },
  ],

  pitfalls: [
    {
      name: 'The argument is digits AFTER the point, not total',
      desc: 'toExponential(2) gives three significant digits — one before the point and two after. toPrecision(2) gives two in total. Swapping the two methods without adjusting the argument changes the precision by one digit.',
      wrong: { label: 'Three significant', code: '(12345).toExponential(2)', output: "'1.23e+4'" },
      fix:   { label: 'Two significant',   code: '(12345).toPrecision(2)',   output: "'1.2e+4'" },
    },
    {
      name: 'It is unreadable for ordinary values',
      desc: 'Formatting a price or a count this way produces output no user wants to see. It belongs in scientific contexts and in logs where consistent width matters, not in a UI.',
      wrong: { label: 'Not for humans', code: '(1234.5).toExponential(2)', output: "'1.23e+3'" },
      fix:   { label: 'Readable',       code: "(1234.5).toLocaleString('en-US')", output: "'1,234.5'" },
    },
    {
      name: 'It returns a string, like its siblings',
      desc: 'All three formatting methods do. Arithmetic on the result concatenates, and the exponential form does not even parse back cleanly with parseInt — though Number and parseFloat both handle it.',
      wrong: { label: 'parseInt stops at e', code: "parseInt('1.23e+4')", output: '1' },
      fix:   { label: 'Number understands', code: "Number('1.23e+4')", output: '12300' },
    },
    {
      name: 'Omitting the argument gives variable width',
      desc: 'With no digits argument the method uses as many as needed to round-trip the value, so different numbers produce different widths. If you are aligning columns, always pass a count.',
      wrong: { label: 'Varies', code: '(0.0001).toExponential()', output: "'1e-4'" },
      fix:   { label: 'Fixed width', code: '(0.0001).toExponential(3)', output: "'1.000e-4'" },
    },
  ],

  when: {
    use: [
      'Scientific output where exponential notation is the convention',
      'Values spanning many orders of magnitude, formatted consistently',
      'Logs and fixed-width reports',
      'Producing a mantissa and exponent you intend to parse apart',
    ],
    avoid: [
      'Anything a user reads → toLocaleString or Intl.NumberFormat',
      'Fixed decimal places → toFixed',
      'Significant digits with automatic notation → toPrecision',
      'You need a number back → this returns a string',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string; the number is unchanged',
    cpython:    'V8: Builtins-number-toexponential',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.prototype.toPrecision',    slug: 'number-toprecision',    when: 'Significant digits, notation chosen automatically' },
    { name: 'Number.prototype.toFixed',        slug: 'number-tofixed',        when: 'Fixed decimal places' },
    { name: 'Number.prototype.toLocaleString', slug: 'number-tolocalestring', when: 'Readable output for people' },
    { name: 'Number.parseFloat',               slug: 'number-parsefloat',     when: 'Parsing exponential notation back' },
  ],

  faq: [
    {
      q: 'How does it differ from toPrecision?',
      a: 'toExponential always uses exponential form and counts digits AFTER the point. toPrecision counts total significant digits and picks fixed or exponential notation depending on magnitude. If you always want the same shape, this is the one.',
      code: "(12345).toExponential(2);   // '1.23e+4' — 3 significant\n(12345).toPrecision(2);     // '1.2e+4'  — 2 significant",
    },
    {
      q: 'Can I parse the result back?',
      a: 'With Number or parseFloat, yes — both understand exponent notation. parseInt does not: it stops at the e and returns just the leading digit.',
      code: "Number('1.23e+4');       // 12300\nparseFloat('1.23e+4');   // 12300\nparseInt('1.23e+4');     // 1",
    },
    {
      q: 'Why is the exponent signed even when positive?',
      a: 'Because the format is specified that way — e+4 rather than e4. It makes the output uniform and unambiguous to split, which is useful when you are parsing the two halves apart.',
    },
  ],

  history: [
    { version: 'ES3', note: 'toExponential added with toFixed and toPrecision.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential',
    meta:  'Number.prototype.toExponential',
  },

};
