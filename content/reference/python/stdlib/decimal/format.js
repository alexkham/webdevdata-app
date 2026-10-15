// content/reference/python/stdlib/decimal/format.js — str, repr, to_eng_string, to_sci_string, format()

export const meta = {
  slug:        'format',
  name:        'Decimal.to_eng_string',
  signature:   "str(d) · repr(d) · d.to_eng_string(context=None) · ctx.to_sci_string(d) · ctx.to_eng_string(d) · format(d, spec) / f'{d:spec}'",
  blurb:       'Turning Decimals into text: scientific str(), the Decimal(...) repr, engineering notation with exponents in multiples of 3, and format specs (.2f, ,, %, e, g) computed in decimal — no float rounding.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'decimal format f-string format spec .2f thousands separator percent to_eng_string to_sci_string Decimal.to_eng_string Context.to_eng_string Context.to_sci_string str repr scientific notation engineering notation print decimal without exponent decimal to string',
};

export const method = {
  slug:      'format',
  name:      'Decimal.to_eng_string',
  signature: "str(d) · repr(d) · d.to_eng_string(context=None) · ctx.to_sci_string(d) · ctx.to_eng_string(d) · format(d, spec) / f'{d:spec}'",
  returns:   { type: 'str', desc: 'The text form. str() and to_sci_string() are identical; to_eng_string() uses exponents that are multiples of 3; format() follows the spec.' },

  category:    'Decimal method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: "str() shows every stored digit and switches to exponent notation only when it must: 0.000001 stays as is, 0.0000001 becomes 1E-7, and 1.23E+5 keeps its exponent. format() rounds in decimal with the context's rounding mode, so f'{Decimal(\"2.675\"):.2f}' really is 2.68.",

  covers: ['Decimal.to_eng_string', 'Context.to_eng_string', 'Context.to_sci_string'],

  cheat: {
    commonCall: "f'{amount:,.2f}'",
    returns:    "'1,234.57' for Decimal('1234.5678')",
    replaces:   'formatting a float, which rounds the binary value',
    watchOut:   "the '_' grouping option is not supported for Decimal — ValueError: invalid format string",
  },

  parameters: [
    { name: 'spec',    type: 'str',     required: false, default: "''", desc: "[[fill]align][sign][z][#][0][width][,][.precision][type] with type e E f F g G n % (or none). Precision rounds with the current context's rounding." },
    { name: 'context', type: 'Context', required: false, default: 'None', desc: 'to_eng_string: only its capitals setting (E or e) matters. str() and repr() use the current context\'s capitals.' },
  ],

  modes: [
    {
      id: 'format',
      label: 'format spec',
      blurb: 'format(Decimal, spec) with any spec — what an f-string does with {x:spec}.',
      params: [
        { name: 'x',    type: 'str', hint: 'a number',        input: 'text' },
        { name: 'spec', type: 'str', hint: "e.g. ',.2f'",      input: 'text' },
      ],
      template: 'from decimal import Decimal\nformat(Decimal({$x}), {$spec})',
      cases: [
        { id: 'money', label: "1234.5678, ',.2f'", values: { x: '1234.5678', spec: ',.2f' } },
        { id: 'half',  label: "2.675, '.2f'",      values: { x: '2.675', spec: '.2f' } },
        { id: 'pct',   label: "0.5, '.1%'",        values: { x: '0.5', spec: '.1%' } },
        { id: 'fixed', label: "1E+5, 'f'",         values: { x: '1E+5', spec: 'f' } },
        { id: 'sci',   label: "123.456, '.2e'",    values: { x: '123.456', spec: '.2e' } },
        { id: 'z',     label: "-0.0001, 'z.2f'",   values: { x: '-0.0001', spec: 'z.2f' } },
        { id: 'fill',  label: "3.14159, '*>10.3'", values: { x: '3.14159', spec: '*>10.3' } },
        { id: 'under', label: "1234.5, '_'",       values: { x: '1234.5', spec: '_' } },
      ],
    },
    {
      id: 'str',
      label: 'str / repr / eng',
      blurb: 'The default text forms side by side, plus the fixed-point format.',
      params: [{ name: 'x', type: 'str', hint: 'a number', input: 'text' }],
      template: "from decimal import Decimal\nx = Decimal({$x})\n(str(x), repr(x), x.to_eng_string(), f'{x:f}')",
      cases: [
        { id: 'k',     label: '123E+3',    values: { x: '123E+3' } },
        { id: 'small', label: '0.0000001', values: { x: '0.0000001' } },
        { id: 'micro', label: '1.5E-10',   values: { x: '1.5E-10' } },
        { id: 'big',   label: '12345E+5',  values: { x: '12345E+5' } },
        { id: 'nz',    label: '-0',        values: { x: '-0' } },
        { id: 'nan',   label: 'NaN',       values: { x: 'NaN' } },
      ],
    },
    {
      id: 'capitals',
      label: 'capitals',
      blurb: 'A context with capitals=0 writes a lowercase e.',
      params: [
        { name: 'x',        type: 'str', hint: 'a number', input: 'text' },
        { name: 'capitals', type: 'int', hint: '0 or 1',   input: 'number' },
      ],
      template: 'from decimal import Context, Decimal\nctx = Context(capitals={$capitals})\n(ctx.to_sci_string(Decimal({$x})), ctx.to_eng_string(Decimal({$x})))',
      cases: [
        { id: 'lower', label: '123E+8, 0', values: { x: '123E+8', capitals: '0' } },
        { id: 'upper', label: '123E+8, 1', values: { x: '123E+8', capitals: '1' } },
        { id: 'tiny',  label: '5E-8, 0',   values: { x: '5E-8', capitals: '0' } },
        { id: 'bad',   label: 'capitals 2', values: { x: '1', capitals: '2' } },
      ],
    },
  ],
  demoExplainer: "',.2f' groups thousands and rounds to cents; 2.675 at two places is 2.68 because the Decimal really is 2.675 (half even keeps the 8 here as the tie rounds to the even digit 8). '%' multiplies by 100. 'f' writes all digits without an exponent, '.2e' keeps three significant digits, and 'z' turns a negative zero result into 0.00. The '_' grouping option is not available for Decimal. In the second tab str() shows 123E+3 as 1.23E+5 — the same number of significant digits — while to_eng_string() keeps an exponent that is a multiple of 3; small numbers switch to exponent form once the exponent of the first digit drops below -6. capitals=0 gives a lowercase e, and capitals must be 0 or 1.",

  patterns: [
    {
      name: 'Money with separators',
      desc: 'Format rounds with the current context — set ROUND_HALF_UP or quantize first if the rule matters.',
      code: "print(f'{total:,.2f}')",
    },
    {
      name: 'Never show an exponent',
      desc: "'f' with no precision writes every digit in positional form.",
      code: "text = format(value, 'f')   # Decimal('1E+5') -> '100000'",
    },
    {
      name: 'Engineering units',
      desc: 'Exponents in multiples of three map onto k, M, G… and m, µ, n.',
      code: "from decimal import Decimal\nDecimal('4.7E-5').to_eng_string()   # '47E-6'",
    },
  ],

  examples: [
    { title: 'Thousands and cents',      code: "from decimal import Decimal\nformat(Decimal('1234.5678'), ',.2f')", returns: "'1,234.57'" },
    { title: 'Decimal formats exactly',  code: "from decimal import Decimal\nf\"{Decimal('2.675'):.2f}\"", returns: "'2.68'" },
    { title: 'Width, alignment, grouping', code: "from decimal import Decimal\nf\"{Decimal('12345.678'):>12,.1f}|\"", returns: "'    12,345.7|'" },
    { title: 'Engineering notation',     code: "from decimal import Decimal\nDecimal('123E+1').to_eng_string()", returns: "'1.23E+3'" },
    { title: 'Positional output with f', code: "from decimal import Decimal\nf\"{Decimal('1E+5'):f}\"", returns: "'100000'" },
    { title: 'format() rounds with the context', code: "from decimal import Decimal, localcontext, ROUND_DOWN\nwith localcontext(rounding=ROUND_DOWN):\n    s = f\"{Decimal('2.679'):.2f}\"\ns", returns: "'2.67'" },
    { title: 'No negative zero with z',  code: "from decimal import Decimal\nformat(Decimal('-0.0001'), 'z.2f')", returns: "'0.00'" },
    { title: 'Specials',                 code: "from decimal import Decimal\nformat(Decimal('Infinity'), '.2f'), format(Decimal('NaN'), '%')", returns: "('Infinity', 'NaN%')" },
  ],

  pitfalls: [
    {
      name: "Old-style % formatting",
      desc: "'%.2f' % x converts the Decimal to a float first, so the binary rounding error comes back. format() and f-strings stay in decimal.",
      wrong: { label: "'%.2f' % x", code: "from decimal import Decimal\n'%.2f' % Decimal('2.675')", output: "'2.67'" },
      fix:   { label: "f'{x:.2f}'", code: "from decimal import Decimal\nf\"{Decimal('2.675'):.2f}\"", output: "'2.68'" },
    },
    {
      name: "Grouping with '_'",
      desc: "Decimal's formatter supports ',' grouping but not '_'. Replace the commas if you need underscores.",
      wrong: { label: "'_'", code: "from decimal import Decimal\nformat(Decimal('1234567'), '_')", output: 'ValueError: invalid format string' },
      fix:   { label: "',' then replace", code: "from decimal import Decimal\nformat(Decimal('1234567'), ',').replace(',', '_')", output: "'1_234_567'" },
    },
    {
      name: 'Expecting str() to stay positional',
      desc: 'Below 0.000001, str() uses exponent notation. Format with f to get all the zeros.',
      wrong: { label: 'str(x)', code: "from decimal import Decimal\nstr(Decimal('0.0000001'))", output: "'1E-7'" },
      fix:   { label: "format(x, 'f')", code: "from decimal import Decimal\nformat(Decimal('0.0000001'), 'f')", output: "'0.0000001'" },
    },
  ],

  when: {
    use: [
      'f-strings and format() for any display of Decimals — they never go through float',
      "'f' without a precision to print the exact stored digits",
      'to_eng_string() for engineering and SI-prefix output',
    ],
    avoid: [
      "'%' string formatting and float(x) for display — both use binary floats",
      "The '_' grouping option — not supported for Decimal",
      'str() when a fixed number of places is required → quantize or a precision in the spec',
    ],
  },

  notes: {
    cpython:      "Decimal.__format__ in the C module formats with libmpdec; a spec libmpdec cannot parse — one with the '#' option, for instance — is handled by the pure-Python Lib/_pydecimal.py code, whose parser is stricter: '.03f' is accepted but '#.03f' is ValueError: invalid format string. Precision rounds with the current context's rounding mode, and a spec without a type behaves like 'g' with all digits",
    'str / repr': "str(d) is the to-scientific-string of the specification: exponent notation when the exponent is positive or the first digit is more than 6 places after the point; repr(d) wraps it as Decimal('…'); both use the current context's capitals",
    'Engineering': 'to_eng_string() makes the exponent a multiple of 3, which may add up to two zeros or move the point (123E+1 → 1.23E+3, 0E-7 → 0.0E-6)',
    'Locale':     "The 'n' type uses the locale's separators (in the default C locale it is like 'g')",
  },

  related: [
    { name: 'quantize()', slug: 'quantize', when: 'Round the value before formatting' },
    { name: 'normalize()', slug: 'normalize-adjusted', when: 'Drop trailing zeros' },
    { name: 'Context', slug: 'context', when: 'capitals and rounding' },
    { name: 'format()', slug: 'format', when: 'The built-in and its spec mini-language', category: 'functions' },
    { name: 'str()', slug: 'str', when: 'str() of objects', category: 'functions' },
    { name: 'Fraction formatting', slug: 'format', when: 'The same spec on Fractions (3.12+)', category: 'stdlib/fractions' },
  ],

  faq: [
    {
      q: 'How do I print a Decimal with 2 decimal places?',
      a: "f'{x:.2f}' (or format(x, '.2f')). Unlike a float, a Decimal rounds its decimal digits: Decimal('2.675') prints as 2.68. The rounding mode is the current context's — ROUND_HALF_EVEN by default.",
    },
    {
      q: 'How do I print a Decimal without scientific notation?',
      a: "Use format(x, 'f') (or f'{x:f}'): Decimal('1E+5') becomes '100000' and Decimal('1E-7') '0.0000001'. str() keeps exponent notation for those.",
    },
    {
      q: 'What is engineering notation in decimal?',
      a: "Exponents restricted to multiples of three: Decimal('123E+1').to_eng_string() is '1.23E+3' and Decimal('4.7E-5') becomes '47E-6'. Use it for SI-prefix display.",
    },
    {
      q: 'Why does format(Decimal, "_") raise ValueError?',
      a: "The C decimal module's formatter accepts ',' as thousands separator but not '_', and reports any spec it does not understand as ValueError: invalid format string.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/decimal.html#decimal.Decimal.to_eng_string',
    meta:  'decimal.Decimal.to_eng_string and formatting',
  },
};
