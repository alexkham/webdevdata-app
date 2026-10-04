// content/reference/javascript/methods/number-toprecision.js

export const meta = {
  slug:        'number-toprecision',
  name:        'Number.prototype.toPrecision',
  signature:   'number.toPrecision([digits])',
  blurb:       'Significant digits, not decimal places — and it switches to exponential without warning.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'toPrecision significant digits figures scientific exponential rounding toFixed difference string javascript',
};

export const method = {
  slug:      'number-toprecision',
  name:      'Number.prototype.toPrecision',
  signature: 'number.toPrecision([digits])',
  returns:   { type: 'string', desc: 'A string with the given number of SIGNIFICANT digits — counted from the first non-zero digit, not from the decimal point. Falls back to exponential notation when fixed notation would need more digits than requested.' },

  category:    'Number method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The one people reach for when they wanted toFixed. It counts digits from the left of the number, so the same argument produces wildly different output depending on magnitude.',

  cheat: {
    commonCall: 'n.toPrecision(3)',
    returns:    'a string with that many significant digits',
    replaces:   'manual scientific rounding',
    watchOut:   'large numbers come back in exponential form',
  },

  parameters: [
    { name: 'digits', type: 'number', required: false, default: 'as many as needed', desc: 'Significant digits, 1 to 100. Omitted entirely, the method behaves exactly like toString. Outside the range it throws RangeError.' },
  ],

  demoParams: [
    { name: 'n', type: 'number', hint: 'a number',           input: 'float' },
    { name: 'p', type: 'number', hint: 'significant digits', input: 'number' },
  ],
  demoTemplate: '({n}).toPrecision({p})',
  cases: [
    { id: 'normal',  label: 'four significant digits', values: { n: 123.456, p: 4 } },
    { id: 'expo',    label: 'goes EXPONENTIAL (!)',    values: { n: 123456, p: 2 } },
    { id: 'small',   label: 'a small fraction',        values: { n: 0.000123, p: 2 } },
    { id: 'pad',     label: 'padded with zeros',       values: { n: 1, p: 5 } },
    { id: 'more',    label: 'more digits than needed', values: { n: 1.5, p: 6 } },
  ],
  demoExplainer: "Significant digits are counted from the first non-zero digit, so 123.456 to four gives '123.5' — three before the point and one after. The second case is the surprise: asking for two significant digits from 123456 cannot be written in fixed notation without implying six digits of precision, so the method switches to '1.2e+5'. Formatting code that expected plain digits gets exponential notation instead. The small-fraction case shows the leading zeros are not counted as significant, and the fourth shows zeros are padded on to reach the requested count.",

  patterns: [
    {
      name: 'Scientific or measurement output',
      desc: 'Where significant figures are the convention.',
      code: 'const shown = measurement.toPrecision(3);',
    },
    {
      name: 'Decimal places instead',
      desc: 'Almost always what UI code actually wants.',
      code: 'const shown = price.toFixed(2);',
    },
    {
      name: 'Guard against exponential output',
      desc: 'Check before showing it to a user.',
      code: 'const s = n.toPrecision(3);\nconst safe = s.includes("e") ? n.toFixed(2) : s;',
    },
  ],

  examples: [
    { title: 'Four significant', code: '(123.456).toPrecision(4)',  returns: "'123.5'" },
    { title: 'Goes exponential', code: '(123456).toPrecision(2)',   returns: "'1.2e+5'" },
    { title: 'Small fraction',   code: '(0.000123).toPrecision(2)', returns: "'0.00012'" },
    { title: 'Zeros padded',     code: '(1).toPrecision(5)',        returns: "'1.0000'" },
    { title: 'toFixed differs',  code: '(123456).toFixed(2)',       returns: "'123456.00'" },
    { title: 'It is a string',   code: 'typeof (1).toPrecision(2)', returns: "'string'" },
  ],

  pitfalls: [
    {
      name: 'It counts significant digits, not decimals',
      desc: 'The most common mix-up with toFixed. toPrecision(2) on 123456 keeps two digits of the whole number; toFixed(2) keeps two digits after the point. They agree only by coincidence, and only for numbers of one particular magnitude.',
      wrong: { label: 'Not two decimals', code: '(123456).toPrecision(2)', output: "'1.2e+5'" },
      fix:   { label: 'toFixed for decimals', code: '(123456).toFixed(2)', output: "'123456.00'" },
    },
    {
      name: 'It switches to exponential silently',
      desc: 'When the requested precision is fewer digits than the integer part needs, fixed notation would be misleading, so the method uses exponential form. Output you expected to be plain digits arrives as 1.2e+5 in the middle of a sentence.',
      wrong: { label: 'Unexpected form', code: '(123456).toPrecision(2)', output: "'1.2e+5'" },
      fix:   { label: 'Detect and fall back', code: 'const s = n.toPrecision(2);\ns.includes("e") ? n.toFixed(0) : s', output: 'plain digits' },
    },
    {
      name: 'It returns a string',
      desc: 'Same as toFixed and toExponential. Arithmetic on the result concatenates, and a comparison against a number coerces in ways that are rarely what you want.',
      wrong: { label: 'Concatenation', code: '(1).toPrecision(2) + 1', output: "'1.01'" },
      fix:   { label: 'Convert back',  code: 'Number((1).toPrecision(2)) + 1', output: '2' },
    },
    {
      name: 'Omitting the argument changes the method entirely',
      desc: 'With no argument it does not pick a sensible default precision — it behaves exactly like toString and returns the full representation. A variable that is sometimes undefined therefore produces inconsistent output.',
      wrong: { label: 'Full precision', code: '(123.456).toPrecision()', output: "'123.456'" },
      fix:   { label: 'Always pass one', code: '(123.456).toPrecision(4)', output: "'123.5'" },
    },
  ],

  when: {
    use: [
      'Scientific and engineering output, where significant figures are standard',
      'Normalising numbers of wildly different magnitudes to the same information content',
      'Deliberately producing exponential notation for very large or small values',
    ],
    avoid: [
      'Money and UI numbers → toFixed, or Intl.NumberFormat',
      'You need exponential always → toExponential',
      'You need a number back → this returns a string',
      'Locale-aware output → toLocaleString',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A new string; the number is unchanged',
    cpython:    'V8: Builtins-number-toprecision',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.prototype.toFixed',        slug: 'number-tofixed',        when: 'Decimal places — usually what you wanted' },
    { name: 'Number.prototype.toExponential',  slug: 'number-toexponential',  when: 'Exponential form, always' },
    { name: 'Number.prototype.toLocaleString', slug: 'number-tolocalestring', when: 'Formatting for a reader' },
    { name: 'Number.constants',                slug: 'number-constants',      when: 'Why the digits are approximate anyway' },
  ],

  faq: [
    {
      q: 'toPrecision or toFixed?',
      a: 'toFixed for anything with a fixed unit — money, percentages, measurements shown to a set number of decimals. toPrecision when the significant information content matters regardless of magnitude, which is mostly scientific work.',
      code: "(0.001234).toFixed(2);       // '0.00'  — all detail lost\n(0.001234).toPrecision(2);   // '0.0012' — two significant digits",
    },
    {
      q: 'How do I stop it returning exponential notation?',
      a: 'You cannot configure it away — the switch is part of the specification. Either request enough digits to cover the integer part, or detect the e in the output and fall back to toFixed.',
      code: 'const s = n.toPrecision(3);\nconst plain = s.includes("e") ? n.toFixed(0) : s;',
    },
    {
      q: 'Does it round correctly?',
      a: 'It rounds the double that actually exists, which means the same surprises as toFixed — a literal like 1.005 is stored slightly below its written value and rounds down. That is floating point, not a flaw in the method.',
    },
  ],

  history: [
    { version: 'ES3', note: 'toPrecision added with toFixed and toExponential.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision',
    meta:  'Number.prototype.toPrecision',
  },

};
