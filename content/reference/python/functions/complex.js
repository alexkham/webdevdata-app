// content/reference/python/functions/complex.js

export const meta = {
  slug:        'complex',
  name:        'complex',
  signature:   'complex(real=0, imag=0) / complex(string)',
  blurb:       'Construct a complex number — from two floats, or from a Python-style string like &quot;3+4j&quot;.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'complex number imaginary j real number type constructor math engineering',
};

export const method = {
  slug:      'complex',
  name:      'complex',
  signature: 'complex(real=0, imag=0) / complex(string)',
  returns:   { type: 'complex', desc: 'A complex number with real and imaginary parts. Two call forms: `complex(a, b)` for real=a and imag=b; `complex(&quot;3+4j&quot;)` to parse a string in Python&apos;s notation.' },

  category:    'Built-in function / type',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Python uses `j` for the imaginary unit (engineering convention), not `i`. Two call forms: numeric or string.',

  cheat: {
    commonCall: 'z = complex(3, 4)',
    returns:    'a complex number — (3+4j)',
    replaces:   'writing the literal `3+4j` when the components are variables',
    watchOut:   'Python uses `j` not `i`; the string form does NOT accept spaces around `+`',
  },

  parameters: [
    { name: 'real',   type: 'float | str', required: false, default: '0', desc: 'The real part. Also accepts a string; when a string is given, imag must be omitted. String form: Python-style like &quot;3+4j&quot; or &quot;-1.5j&quot;.' },
    { name: 'imag',   type: 'float',       required: false, default: '0', desc: 'The imaginary part. Only usable when real is a number. Default 0 gives a purely real complex.' },
  ],

  demoParams: [
    { name: 'real', type: 'str', hint: 'real part or full "a+bj"', input: 'text' },
    { name: 'imag', type: 'str', hint: 'imag (leave empty for string form)', input: 'text-or-none' },
  ],
  cases: [
    { id: 'both',      label: 'two-arg form',   values: { real: '3',      imag: '4' } },
    { id: 'real-only', label: 'real only',       values: { real: '5',      imag: '0' } },
    { id: 'imag-only', label: 'imag only',       values: { real: '0',      imag: '2' } },
    { id: 'negative',  label: 'negative imag',    values: { real: '3',      imag: '-4' } },
    { id: 'decimals',  label: 'decimals',         values: { real: '1.5',    imag: '2.5' } },
    { id: 'string',    label: 'string form',      values: { real: '3+4j',   imag: '' } },
    { id: 'neg-str',   label: 'negative string',  values: { real: '-1.5j',  imag: '' } },
    { id: 'zero',      label: 'zero',             values: { real: '0',      imag: '0' } },
  ],
  demoExplainer: 'complex has two call forms. NUMERIC form: complex(a, b) gives real=a and imaginary=b. STRING form: complex(&quot;3+4j&quot;) parses a Python-style literal — no spaces allowed around the `+`. Python uses `j` for the imaginary unit (engineering convention), not `i` (math convention). Displayed as `(a+bj)` for non-zero imaginary parts.',

  patterns: [
    {
      name: 'Construct from computed values',
      desc: 'When real and imaginary come from calculations.',
      code: 'z = complex(magnitude * math.cos(angle),\n            magnitude * math.sin(angle))',
    },
    {
      name: 'Parse a string literal',
      desc: 'Round-trip: `str(z)` then `complex(str(z))` gives back the same number.',
      code: 's = "3+4j"\nz = complex(s)   # (3+4j)',
    },
    {
      name: 'Extract real / imag',
      desc: 'Access parts as attributes.',
      code: 'z = complex(3, 4)\nz.real   # 3.0\nz.imag   # 4.0',
    },
    {
      name: 'Absolute value / magnitude',
      desc: 'abs() on a complex number returns the magnitude.',
      code: 'abs(complex(3, 4))   # 5.0  (Pythagorean)',
    },
  ],

  examples: [
    { title: 'Two-arg',            code: 'complex(3, 4)',           returns: '(3+4j)' },
    { title: 'Real only',          code: 'complex(5)',              returns: '(5+0j)' },
    { title: 'Imag only',          code: 'complex(0, 2)',            returns: '2j' },
    { title: 'Negative imag',      code: 'complex(3, -4)',           returns: '(3-4j)' },
    { title: 'String form',        code: 'complex("3+4j")',          returns: '(3+4j)' },
    { title: 'Purely imag string',  code: 'complex("-1.5j")',        returns: '-1.5j' },
    { title: 'Literal',            code: '3 + 4j',                   returns: '(3+4j)  # no constructor needed' },
    { title: 'Magnitude',          code: 'abs(complex(3, 4))',       returns: '5.0' },
  ],

  pitfalls: [
    {
      name: 'Python uses `j`, not `i`',
      desc: 'The math convention writes complex numbers with `i` (a+bi). Python (following the engineering convention) uses `j` (a+bj). Using `i` is a NameError unless you have a variable named `i`.',
      wrong: { label: 'Math convention', code: 'complex(3 + 4i)', output: "NameError: name 'i' is not defined" },
      fix:   { label: 'j is the unit',    code: 'complex(3, 4)\n# or literal: 3 + 4j', output: '(3+4j)' },
    },
    {
      name: 'String form REJECTS spaces around the operator',
      desc: 'complex(&quot;3+4j&quot;) works. complex(&quot;3 + 4j&quot;) fails. Python is strict about the string form — for numeric args, use the two-arg form instead.',
      wrong: { label: 'Space fails',   code: 'complex("3 + 4j")', output: 'ValueError: complex() arg is a malformed string' },
      fix:   { label: 'No spaces',      code: 'complex("3+4j")\n# or: complex(3, 4)', output: '(3+4j)' },
    },
    {
      name: 'Two-arg form does not take a string as first arg',
      desc: 'The string form is ONLY the one-arg form. Passing a string as real with an imag argument raises TypeError.',
      wrong: { label: 'Mixed forms', code: 'complex("3", 4)', output: 'TypeError: complex() can\'t take second arg if first is a string' },
      fix:   { label: 'Pick one',    code: 'complex("3+4j")\n# or: complex(3, 4)', output: '(3+4j)' },
    },
    {
      name: 'Imag part is always a float internally',
      desc: 'Passing ints gives you a complex whose real and imag are actually floats. Comparisons and hashing behave accordingly.',
      wrong: { label: 'Assumed int', code: 'complex(3, 4).real', output: '3.0  # not 3' },
      fix:   { label: 'Cast if needed', code: 'int(complex(3, 4).real)', output: '3' },
    },
  ],

  when: {
    use: [
      'Signal processing, DSP, and engineering computations',
      '2D geometry using complex arithmetic (rotation, translation)',
      'Fourier transforms and other math involving complex values',
      'Parsing complex literals from strings',
    ],
    avoid: [
      'You only need a 2D point → tuple or dataclass is often clearer',
      'You need precise decimal arithmetic → decimal.Decimal',
      'Vector math with three or more dimensions → numpy',
      'Simple integer arithmetic → int / float are enough',
    ],
  },

  notes: {
    complexity: 'O(1) construction',
    return:     'A complex object — immutable, hashable',
    cpython:    'Objects/complexobject.c :: complex_new',
    memory:     'Two doubles per complex — 16 bytes plus object overhead',
    threadSafe: 'Yes — complex objects are immutable',
  },

  related: [
    { name: 'int',    slug: 'int',    when: 'Real integer' },
    { name: 'float',  slug: 'float',  when: 'Real floating-point' },
    { name: 'abs',    slug: 'abs',    when: 'Magnitude of a complex number' },
    { name: 'pow',    slug: 'pow',    when: 'Complex exponentiation via pow() or the ** operator' },
  ],

  faq: [
    {
      q: 'Why does Python use `j` instead of `i`?',
      a: 'Historical — the engineering convention (electrical, signal processing) uses `j` because `i` is often reserved for electric current. Python inherited this from the electrical engineering community; the choice is baked into the language.',
    },
    {
      q: 'Can I use complex numbers in comparisons?',
      a: 'Only equality (==, !=). Ordering (&lt;, &gt;, ...) raises TypeError — there is no natural total ordering on complex numbers.',
    },
    {
      q: 'What is the difference between complex(3, 4) and 3+4j?',
      a: 'The literal form (3+4j) is compile-time — the number is a constant. complex(3, 4) is a runtime call — the components can be variables. Same result.',
    },
    {
      q: 'How do I get the conjugate?',
      a: 'Call .conjugate(): `complex(3, 4).conjugate()` gives `(3-4j)`.',
    },
  ],

  history: [
    { version: '1.0', note: 'complex numbers built into Python since the earliest versions.' },
    { version: '2.6', note: 'complex.__format__ added for use with format() and f-strings.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#complex',
    meta:  'complex',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect complex data' },
  ],
};