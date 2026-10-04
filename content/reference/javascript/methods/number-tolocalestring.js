// content/reference/javascript/methods/number-tolocalestring.js

export const meta = {
  slug:        'number-tolocalestring',
  name:        'Number.prototype.toLocaleString',
  signature:   'number.toLocaleString([locales[, options]])',
  blurb:       'The only correct way to show a number to a person — grouping, currency and all.',
  category:    'number',
  type:        'number',
  hasLiveDemo: true,
  version:     'ES3 (options since ES2012)',
  searchTerms: 'toLocaleString Intl NumberFormat currency percent thousands separator grouping locale format money javascript',
};

export const method = {
  slug:      'number-tolocalestring',
  name:      'Number.prototype.toLocaleString',
  signature: 'number.toLocaleString([locales[, options]])',
  returns:   { type: 'string', desc: 'The number formatted for the given locale — digit grouping, the right decimal separator, and optionally a currency symbol or percent sign.' },

  category:    'Number method',
  version:     'ES3 (options since ES2012)',
  hasLiveDemo: true,

  subtitle: 'A full Intl.NumberFormat behind a method call. If a number is going to be read by a human, this or Intl is the answer — toFixed is not.',

  cheat: {
    commonCall: "n.toLocaleString('en-US')",
    returns:    'a formatted string',
    replaces:   'manual comma insertion and toFixed',
    watchOut:   'defaults to max 3 decimal places — it ROUNDS',
  },

  parameters: [
    { name: 'locales', type: 'string | string[]', required: false, default: 'host default', desc: 'A BCP 47 tag such as "en-US" or "de-DE". Omitted, the runtime locale is used — which differs between your machine and your users.' },
    { name: 'options', type: 'object',            required: false, default: '{}',           desc: 'Intl.NumberFormat options — style (decimal, currency, percent, unit), currency, minimumFractionDigits, maximumFractionDigits, notation, useGrouping.' },
  ],

  demoParams: [
    { name: 'n',      type: 'number', hint: 'a number',          input: 'float' },
    { name: 'locale', type: 'string', hint: 'e.g. en-US, de-DE', input: 'text' },
  ],
  demoTemplate: '({n}).toLocaleString({locale})',
  cases: [
    { id: 'us',     label: 'en-US — comma groups',    values: { n: 1234.5, locale: 'en-US' } },
    { id: 'de',     label: 'de-DE — SWAPPED (!)',     values: { n: 1234.5, locale: 'de-DE' } },
    { id: 'fr',     label: 'fr-FR',                   values: { n: 1234.5, locale: 'fr-FR' } },
    { id: 'in',     label: 'en-IN — lakh grouping',   values: { n: 1234567, locale: 'en-IN' } },
    { id: 'round',  label: 'rounds to 3 places (!)',  values: { n: 1.23456789, locale: 'en-US' } },
  ],
  demoExplainer: "The first two cases are the reason this method exists: en-US writes 1,234.5 while de-DE writes 1.234,5 — the separators are exactly swapped. Hard-coding either one is wrong for most of the world. The en-IN case shows grouping is not always in threes; Indian numbering groups the leading digits in pairs. The last case is the default worth knowing: without options the maximum fraction digits is THREE, so a value with more decimals is silently rounded for display.",

  patterns: [
    {
      name: 'Currency',
      desc: 'Handles the symbol, its position and the decimals.',
      code: "price.toLocaleString('en-US', {style: 'currency', currency: 'USD'});",
    },
    {
      name: 'Percent',
      desc: 'Multiplies by 100 for you — pass the fraction.',
      code: "(0.25).toLocaleString('en-US', {style: 'percent'});",
    },
    {
      name: 'Reuse a formatter in a loop',
      desc: 'Intl.NumberFormat is much faster repeated.',
      code: "const f = new Intl.NumberFormat('en-US');\nrows.map(r => f.format(r.value));",
    },
  ],

  examples: [
    { title: 'US grouping',   code: "(1234.5).toLocaleString('en-US')", returns: "'1,234.5'" },
    { title: 'German swaps',  code: "(1234.5).toLocaleString('de-DE')", returns: "'1.234,5'" },
    { title: 'Currency',      code: "(5).toLocaleString('en-US', {style: 'currency', currency: 'USD'})", returns: "'$5.00'" },
    { title: 'Percent',       code: "(0.25).toLocaleString('en-US', {style: 'percent'})", returns: "'25%'" },
    { title: 'Rounds to 3',   code: "(1.23456789).toLocaleString('en-US')", returns: "'1.235'" },
    { title: 'toFixed ignores locale', code: '(1234.5).toFixed(2)', returns: "'1234.50'" },
  ],

  pitfalls: [
    {
      name: 'It rounds to three decimals by default',
      desc: 'Not a display-only truncation you can ignore — the extra digits are gone from the output. Any value needing more precision must say so with maximumFractionDigits, which is easy to miss because short numbers look fine.',
      wrong: { label: 'Digits lost', code: "(1.23456789).toLocaleString('en-US')", output: "'1.235'" },
      fix:   { label: 'Ask for more', code: "(1.23456789).toLocaleString('en-US', {maximumFractionDigits: 8})", output: "'1.23456789'" },
    },
    {
      name: 'The default locale is the runtime locale',
      desc: 'Omitting the argument uses whatever the machine is set to — your development machine, your CI server, or your user browser. Output then differs between environments, and snapshot tests fail in ways that look random.',
      wrong: { label: 'Environment-dependent', code: '(1234.5).toLocaleString()', output: 'depends on the host' },
      fix:   { label: 'Be explicit',           code: "(1234.5).toLocaleString('en-US')", output: "'1,234.5'" },
    },
    {
      name: 'The output is not machine-parseable',
      desc: 'A formatted string contains group separators, non-breaking spaces and currency symbols, and parseFloat will stop at the first one. Format only at the very edge of your system, and never round-trip through it.',
      wrong: { label: 'Parses wrongly', code: "parseFloat((1234.5).toLocaleString('en-US'))", output: '1' },
      fix:   { label: 'Keep the number',code: 'const n = 1234.5;   // format only for display', output: '1234.5' },
    },
    {
      name: 'It is slow in a loop',
      desc: 'Each call may construct a formatter from scratch. Rendering a table of thousands of numbers this way is noticeably slower than building one Intl.NumberFormat and reusing its format method — the same algorithm without the repeated setup.',
      wrong: { label: 'Rebuilds each time', code: 'rows.map(r => r.n.toLocaleString("en-US"))', output: 'fine for small lists' },
      fix:   { label: 'Reuse a formatter',  code: 'const f = new Intl.NumberFormat("en-US");\nrows.map(r => f.format(r.n));', output: 'much faster' },
    },
  ],

  when: {
    use: [
      'Any number a person will read',
      'Currency, percentages and units',
      'Digit grouping that follows the reader conventions',
      'Compact notation for large numbers, via the notation option',
    ],
    avoid: [
      'Machine-readable output → toFixed or toString',
      'Formatting many values → Intl.NumberFormat, reused',
      'Values you will parse back → never format first',
      'Exact decimal arithmetic → format at the end, compute in minor units',
    ],
  },

  notes: {
    complexity: 'O(1) per call, with substantial constant cost from locale setup',
    return:     'A new string; the number is unchanged',
    cpython:    'V8: Builtins-number-tolocalestring / ICU',
    memory:     'May allocate a formatter per call unless one is reused',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'Number.prototype.toFixed',       slug: 'number-tofixed',        when: 'Fixed decimals, no locale awareness' },
    { name: 'Number.prototype.toPrecision',   slug: 'number-toprecision',    when: 'Significant digits' },
    { name: 'String.prototype.localeCompare', slug: 'string-localecompare',  when: 'The same locale machinery, for sorting text' },
    { name: 'Number.constants',               slug: 'number-constants',      when: 'Why the underlying value may already be approximate' },
  ],

  faq: [
    {
      q: 'toLocaleString or Intl.NumberFormat?',
      a: 'They do the same work and take the same options. The method is convenient for a one-off; the constructor is much faster when formatting many values, because the locale data is prepared once instead of per call.',
      code: "const f = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});\nrows.map(r => f.format(r.price));",
    },
    {
      q: 'Why did my decimals disappear?',
      a: 'Because maximumFractionDigits defaults to 3 for plain numbers. Set it explicitly if you need more. For currency the default comes from the currency itself — two for USD, zero for JPY.',
      code: "n.toLocaleString('en-US', {maximumFractionDigits: 8});",
    },
    {
      q: 'How do I format a percentage?',
      a: 'Use style percent and pass the FRACTION, not the already-multiplied number. The formatter multiplies by 100 itself, so passing 25 gives 2,500%.',
      code: "(0.25).toLocaleString('en-US', {style: 'percent'});   // '25%'",
    },
    {
      q: 'Can I parse the formatted string back?',
      a: 'Not reliably. Group separators vary by locale, some locales use a non-breaking space, and currency symbols sit on either side. Keep the numeric value and format only at the point of display.',
    },
  ],

  history: [
    { version: 'ES3',    note: 'toLocaleString added with implementation-defined behaviour.' },
    { version: 'ES2012', note: 'ECMA-402 gave it the locales and options arguments, tying it to Intl.NumberFormat.' },
    { version: 'ES2020', note: 'The notation option added, enabling compact forms such as 1.2K.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString',
    meta:  'Number.prototype.toLocaleString',
  },

};
