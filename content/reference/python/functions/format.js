// content/reference/python/functions/format.js

export const meta = {
  slug:        'format',
  name:        'format',
  signature:   'format(value, format_spec=&apos;&apos;)',
  blurb:       'Apply a format spec to a value — the engine behind f-strings and str.format.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'format spec pad width precision hex binary decimal align f-string engine number',
};

export const method = {
  slug:      'format',
  name:      'format',
  signature: 'format(value, format_spec=&apos;&apos;)',
  returns:   { type: 'str', desc: 'The value formatted per the format spec. The same spec syntax used in f-strings and str.format braces — `format(x, spec)` is equivalent to `f"{x:{spec}}"`.' },

  category:    'Built-in function',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The bare-function form of Python&apos;s format spec — useful when the spec itself is a variable, or when you want one-shot formatting without an f-string.',

  cheat: {
    commonCall: 'format(3.14159, ".2f")',
    returns:    'always a str',
    replaces:   'inline `f"{value:{spec}}"` when the spec is a variable',
    watchOut:   'format spec is a mini-language of its own — mistakes give unhelpful ValueError messages',
  },

  parameters: [
    { name: 'value',       type: 'Any', required: true,  default: null, desc: 'Any value. Python calls __format__(value, spec) on it. Built-in types define specs for common cases; user types can define their own.' },
    { name: 'format_spec', type: 'str', required: false, default: '""', desc: 'A format spec string. Empty (default) calls __format__ with an empty spec, which for most types is equivalent to str(value). Non-empty follows the Format Specification Mini-Language.' },
  ],

  demoParams: [
    { name: 'value', type: 'Any', hint: 'any value', input: 'text' },
    { name: 'spec',  type: 'str', hint: 'format spec (e.g. "&gt;10", ".2f", "08b")', input: 'text' },
  ],
  cases: [
    { id: 'pad-right', label: 'right-align',     values: { value: '42',      spec: '>10' } },
    { id: 'zero-pad',  label: 'zero-pad',        values: { value: '42',      spec: '08d' } },
    { id: 'decimals',  label: 'decimals',        values: { value: '3.14159', spec: '.2f' } },
    { id: 'hex',       label: 'hex uppercase',   values: { value: '255',     spec: 'X' } },
    { id: 'binary',    label: 'binary padded',   values: { value: '5',       spec: '08b' } },
    { id: 'thousands', label: 'thousands sep',   values: { value: '1000000', spec: ',' } },
    { id: 'percent',   label: 'percentage',      values: { value: '0.75',    spec: '.1%' } },
    { id: 'center',    label: 'center with fill', values: { value: 'hi',      spec: '*^10' } },
    { id: 'no-spec',   label: 'no spec = str()', values: { value: 'hello',   spec: '' } },
  ],
  demoExplainer: 'format applies the Format Specification Mini-Language to a value. The general shape is [[fill]align][sign][#][0][width][,_][.precision][type]. Common atoms: &quot;.2f&quot; keeps 2 decimals; &quot;08d&quot; zero-pads to width 8; &quot;X&quot; is uppercase hex; &quot;,&quot; adds thousands separators; &quot;%&quot; multiplies by 100 and appends &quot;%&quot;. Empty spec is the same as str(value). The whole spec is what appears after the colon in f-strings.',

  patterns: [
    {
      name: 'When the spec is a variable',
      desc: 'The main reason to reach for format() instead of an f-string.',
      code: 'spec = ".2f" if precise else "d"\ndisplay = format(value, spec)',
    },
    {
      name: 'Fixed-width numeric display',
      desc: 'Right-aligned, zero-padded — the classic loop counter.',
      code: 'for i in range(1000):\n    print(format(i, "04d"), end="\\r")',
    },
    {
      name: 'Percentage with precision',
      desc: 'The &quot;%&quot; spec multiplies by 100 and appends a percent sign.',
      code: 'label = format(rate, ".1%")   # 0.756 → "75.6%"',
    },
    {
      name: 'Thousands separators',
      desc: 'Use &quot;,&quot; for commas, &quot;_&quot; for underscores.',
      code: 'format(1_000_000, ",")     # "1,000,000"\nformat(1_000_000, "_")      # "1_000_000"',
    },
  ],

  examples: [
    { title: 'Empty spec = str()',    code: 'format("hello", "")',      returns: '"hello"' },
    { title: 'Two decimals',          code: 'format(3.14159, ".2f")',   returns: '"3.14"' },
    { title: 'Zero-pad integer',       code: 'format(42, "08d")',        returns: '"00000042"' },
    { title: 'Uppercase hex',          code: 'format(255, "X")',         returns: '"FF"' },
    { title: 'Padded binary',          code: 'format(5, "08b")',         returns: '"00000101"' },
    { title: 'Thousands separator',    code: 'format(1000000, ",")',     returns: '"1,000,000"' },
    { title: 'Percentage',             code: 'format(0.75, ".1%")',      returns: '"75.0%"' },
    { title: 'Center with fill',       code: 'format("hi", "*^10")',     returns: '"****hi****"' },
    { title: 'Right-align',            code: 'format("hi", ">10")',      returns: '"        hi"' },
  ],

  pitfalls: [
    {
      name: 'The format spec is its own mini-language',
      desc: 'Small typos give unhelpful ValueErrors. The order of atoms matters: fill and align come first, sign next, width, precision, then type.',
      wrong: { label: 'Bad order', code: 'format(3.14, "f.2")', output: 'ValueError: Invalid format specifier' },
      fix:   { label: 'Right order', code: 'format(3.14, ".2f")', output: '"3.14"' },
    },
    {
      name: 'When the spec is a literal, an f-string reads better',
      desc: 'format() is only clearer when the spec is a variable. For literal specs, f-strings are more Pythonic.',
      wrong: { label: 'Literal via format()', code: 'format(value, ".2f")', output: 'works, but stiff' },
      fix:   { label: 'f-string idiom',       code: 'f"{value:.2f}"', output: 'idiomatic' },
    },
    {
      name: 'Percent (%) multiplies by 100',
      desc: 'The &quot;%&quot; type converts the value to a percentage — it multiplies by 100 and appends a &quot;%&quot; sign. Passing a value already in percent form gives you 100x the number you wanted.',
      wrong: { label: 'Assumed literal %', code: 'format(75, ".1%")   # meant 75%', output: '"7500.0%"' },
      fix:   { label: 'Divide by 100',      code: 'format(75 / 100, ".1%")', output: '"75.0%"' },
    },
    {
      name: 'Precision (.N) means different things for different types',
      desc: 'For float f-spec: digits after the decimal point. For &quot;g&quot; spec: total significant digits. For strings: MAXIMUM length — the string is TRUNCATED.',
      wrong: { label: 'String truncated', code: 'format("Hello world", ".5")', output: '"Hello"  # truncated!' },
      fix:   { label: 'Read the spec docs — precision changes meaning by type', code: '', output: '' },
    },
  ],

  when: {
    use: [
      'When the format spec itself is a variable (built at runtime)',
      'One-shot formatting where an f-string wrapping would be awkward',
      'Programmatically choosing between multiple specs',
      'Custom __format__ methods on your own classes',
    ],
    avoid: [
      'The spec is a literal → f-string is more idiomatic',
      'Multi-value formatting → f-string or str.format',
      'Simple string conversion → str() is enough',
      'Locale-aware currency / numbers → locale module or a formatting library',
    ],
  },

  notes: {
    complexity: 'O(n) in the output length',
    return:     'str — always',
    cpython:    'Python/bltinmodule.c :: builtin_format — dispatches to type&apos;s __format__',
    memory:     'Allocates one string',
    threadSafe: 'Yes for immutable inputs',
  },

  related: [
    { name: 'str',    slug: 'str',    when: 'Simple stringification with no spec' },
    { name: 'repr',   slug: 'repr',   when: 'Unambiguous debug representation' },
    { name: 'round',  slug: 'round',  when: 'Numeric rounding before formatting' },
    { name: 'hex',    slug: 'hex',    when: 'Base 16 with the "0x" prefix' },
    { name: 'bin',    slug: 'bin',    when: 'Base 2 with the "0b" prefix' },
    { name: 'oct',    slug: 'oct',    when: 'Base 8 with the "0o" prefix' },
  ],

  faq: [
    {
      q: 'What is the difference between format() and f-strings?',
      a: 'f-strings are the compile-time syntax — the format spec has to be literal (or a nested expression). format() is the runtime function — you can build the spec dynamically. Same underlying engine.',
    },
    {
      q: 'What is the difference between format() and str()?',
      a: 'str() calls __str__(); format() calls __format__() with a spec. For an empty spec, most types make __format__ return the same as __str__. Non-empty specs give format() its power — padding, precision, alignment, base conversion, etc.',
    },
    {
      q: 'How do I read the format spec syntax?',
      a: 'Left to right: [[fill]align][sign][#][0][width][,_][.precision][type]. Every atom is optional. Study the mini-language docs (linked below) — the DSL is small but dense.',
    },
  ],

  history: [
    { version: '2.6', note: 'format() built-in and the Format Specification Mini-Language introduced (PEP 3101).' },
    { version: '3.6', note: 'f-strings added (PEP 498) — same spec syntax, compile-time evaluation.' },
    { version: '3.8', note: 'f-string `=` self-documenting expressions.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#format',
    meta:  'format',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the formatted output' },
  ],
};