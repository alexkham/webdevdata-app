// content/reference/python/functions/int-conjugate.js
//
// Slug is type-prefixed: `conjugate` is an int method.

export const meta = {
  slug:        'int-conjugate',
  name:        'int.conjugate',
  signature:   'int.conjugate()',
  blurb:       'Returns the number unchanged — the complex conjugate of a real number is itself.',
  category:    'integer',
  type:        'int',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'conjugate complex conjugate numeric tower real imaginary int identity bool bool.conjugate',
};

export const method = {
  slug:      'int-conjugate',
  name:      'int.conjugate',
  signature: 'int.conjugate()',
  returns:   { type: 'int', desc: 'The same value back. An int has no imaginary part to negate, so the conjugate is the number itself.' },

  category:    'Int method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'An identity function on int. It exists because int is registered as a Complex number, and every Complex must be able to answer conjugate().',

  cheat: {
    commonCall: 'n.conjugate()',
    returns:    'n — always, for every int',
    replaces:   'isinstance(v, complex) branching in numeric code',
    watchOut:   'on int it does nothing; the meaning only appears on complex',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'int', hint: 'integer', input: 'number' },
  ],
  demoTemplate: '({n}).conjugate()',
  cases: [
    { id: 'positive', label: 'positive (5)',     values: { n: 5 } },
    { id: 'zero',     label: 'zero',             values: { n: 0 } },
    { id: 'negative', label: 'negative (-7)',    values: { n: -7 } },
    { id: 'one',      label: 'one',              values: { n: 1 } },
    { id: 'large',    label: 'large (123456)',   values: { n: 123456 } },
  ],
  demoExplainer: 'Every case returns the input unchanged, and that is the correct answer rather than a missing implementation. The complex conjugate flips the sign of the imaginary part: (3+4j).conjugate() is (3-4j). An int has no imaginary part, so there is nothing to flip and the value comes back as it went in. The method exists at all because Python registers int in the numeric tower as a Complex number, and that contract requires conjugate().',

  patterns: [
    {
      name: 'Magnitude squared for any number type',
      desc: 'z * z.conjugate() is real for complex and just a square for int and float.',
      code: 'magnitude_sq = (z * z.conjugate()).real',
    },
    {
      name: 'Type-agnostic inner product',
      desc: 'The conjugate belongs in the formula; on real inputs it costs nothing.',
      code: 'dot = sum(a * b.conjugate() for a, b in zip(xs, ys))',
    },
    {
      name: 'Write the maths once',
      desc: 'The same expression stays correct whether the caller passes ints or complex.',
      code: 'def norm(z):\n    return (z * z.conjugate()).real ** 0.5',
    },
  ],

  examples: [
    { title: 'Returns itself',    code: '(5).conjugate()',      returns: '5' },
    { title: 'Zero',              code: '(0).conjugate()',      returns: '0' },
    { title: 'Sign is kept',      code: '(-7).conjugate()',     returns: '-7' },
    { title: 'Large values',      code: '(123456).conjugate()', returns: '123456' },
    { title: 'Where it matters',  code: '(3+4j).conjugate()',   returns: '(3-4j)' },
    { title: 'float too',         code: '(2.5).conjugate()',    returns: '2.5' },
  ],

  pitfalls: [
    {
      name: 'It is not negation',
      desc: 'Conjugation flips the sign of the IMAGINARY part only. Reaching for it to negate a real number gives the value straight back, silently, with no error to point at the mistake.',
      wrong: { label: 'Expected -5', code: '(5).conjugate()', output: '5' },
      fix:   { label: 'Negate instead', code: '-5', output: '-5' },
    },
    {
      name: 'On int alone it looks like dead code',
      desc: 'A call that always returns its input reads like a bug to anyone skimming. Worth a comment when it appears in numeric code, because deleting it quietly breaks the complex case the formula was written for.',
      wrong: { label: 'Tempting to delete', code: 'dot = sum(a * b for a, b in zip(xs, ys))', output: 'wrong once ys holds complex numbers' },
      fix:   { label: 'Keep it, note why',  code: 'dot = sum(a * b.conjugate() for a, b in zip(xs, ys))  # correct for complex too', output: 'correct for every numeric type' },
    },
    {
      name: 'bool inherits it and returns an int',
      desc: 'True is an int, so it has conjugate — but the result comes back as 1, not True. A surprise if the value flows into something that formats or compares booleans.',
      wrong: { label: 'Loses the bool', code: 'True.conjugate()', output: '1' },
      fix:   { label: 'Keep the type',  code: 'bool(True.conjugate())', output: 'True' },
    },
  ],

  when: {
    use: [
      'Numeric code that must accept int, float and complex through one path',
      'Inner products, norms and magnitude formulas written in their general form',
      'Implementing numbers.Complex on a custom numeric type',
    ],
    avoid: [
      'You know the value is an int — it returns the input unchanged',
      'You meant to negate → use -n',
      'You want the real or imaginary part → the .real and .imag attributes',
    ],
  },

  notes: {
    complexity: 'O(1) — returns the same object',
    return:     'The int itself; CPython returns the same object for small ints',
    cpython:    'Objects/longobject.c :: long_long (registered as int.conjugate)',
    memory:     'No allocation — the value is returned as-is',
    threadSafe: 'Yes — ints are immutable',
  },

  related: [
    { name: 'int.as_integer_ratio', slug: 'int-as_integer_ratio', when: 'The same shared-interface idea, for exact fractions' },
    { name: 'int.is_integer',       slug: 'int-is_integer',       when: 'The same shared-interface idea, for whole-number checks' },
    { name: 'complex',              slug: 'complex',              when: 'The type where conjugate actually changes the value' },
    { name: 'abs',                  slug: 'abs',                  when: 'Magnitude, which conjugation is usually a step toward' },
  ],

  faq: [
    {
      q: 'Why does int have a complex-number method at all?',
      a: 'Because PEP 3141 registers int in the numeric tower as a numbers.Complex, and that interface requires conjugate(), real and imag. int satisfies it in the only way a real number can: the conjugate is itself, imag is 0, and real is the value.',
      code: 'import numbers\nisinstance(5, numbers.Complex)\n# True',
    },
    {
      q: 'What does conjugate actually do on a complex number?',
      a: 'It negates the imaginary part, so (3+4j) becomes (3-4j). Geometrically that mirrors the point across the real axis. Multiplying a number by its own conjugate gives a real result — the squared magnitude — which is why it turns up in norms and inner products.',
      code: '(3+4j).conjugate()\n# (3-4j)\n(3+4j) * (3+4j).conjugate()\n# (25+0j)',
    },
    {
      q: 'Should I ever call it on an int deliberately?',
      a: 'Only inside a formula that must also work for complex inputs. Written that way the call is free on ints and correct on complex, which is the entire reason the numeric tower defines it everywhere.',
    },
  ],

  history: [
    { version: '2.6', note: 'Added with PEP 3141, which registered int in the numbers ABC tower and required the Complex interface.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex',
    meta:  'Numeric types',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data structures' },
  ],
};
