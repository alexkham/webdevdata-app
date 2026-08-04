// content/reference/python/functions/pow.js

export const meta = {
  slug:        'pow',
  name:        'pow',
  signature:   'pow(base, exp[, mod])',
  blurb:       'base**exp, optionally modulo mod — with a fast path when both are given.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'pow power exponent modular exponentiation exp mod square multiply cryptography rsa',
};

export const method = {
  slug:      'pow',
  name:      'pow',
  signature: 'pow(base, exp[, mod])',
  returns:   { type: 'int | float', desc: 'base to the power of exp. If mod is given, the result is taken modulo mod — computed by fast modular exponentiation without materializing base**exp.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Raise to a power — with an optional third argument for efficient modular exponentiation used in cryptography and modular arithmetic.',

  cheat: {
    commonCall: 'pow(2, 10)          # 1024',
    returns:    'int for integer args (unless negative exp); float when floats involved',
    replaces:   'base**exp — but `pow(a, b, m)` is far faster than `a**b % m` for large exponents',
    watchOut:   '0**negative raises; negative exp on int returns float; 3-arg needs integers',
  },

  parameters: [
    { name: 'base', type: 'int | float', required: true, default: null, desc: 'The base.' },
    { name: 'exp',  type: 'int | float', required: true, default: null, desc: 'The exponent. Negative on integers returns a float unless mod is given.' },
    { name: 'mod',  type: 'int',         required: false, default: 'None', desc: 'When given, the result is base**exp mod mod, computed efficiently. All three must be integers; negative exp requires base coprime with mod (3.8+, gives modular inverse).' },
  ],

  demoParams: [
    { name: 'base', type: 'float', hint: 'the base', input: 'float' },
    { name: 'exp',  type: 'float', hint: 'the exponent', input: 'float' },
    { name: 'mod',  type: 'int',   hint: 'optional modulus', input: 'number-or-none' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',           values: { base: 2,  exp: 10, mod: '' } },
    { id: 'mod',      label: '3-arg (a**b % m)', values: { base: 5, exp: 55, mod: 13 } },
    { id: 'crypto',   label: 'crypto-scale',    values: { base: 3, exp: 200, mod: 97 } },
    { id: 'neg-exp',  label: 'negative exp',    values: { base: 2, exp: -3,  mod: '' } },
    { id: 'float',    label: 'float exp',       values: { base: 4, exp: 0.5, mod: '' } },
    { id: 'zero-zero',label: '0**0',            values: { base: 0, exp: 0,   mod: '' } },
    { id: 'zero-neg', label: '0**-1 raises',    values: { base: 0, exp: -1,  mod: '' } },
  ],
  demoExplainer: 'pow(a, b) is the same as a**b. The three-argument pow(a, b, m) computes a**b mod m without ever materializing the intermediate a**b — critical when the exponent is large (cryptography, hashing). Negative exponents on integers return floats in the two-arg form; the three-arg form supports negative exp too (3.8+), returning the modular inverse.',

  patterns: [
    {
      name: 'Modular exponentiation for crypto',
      desc: 'RSA and Diffie-Hellman both boil down to this call.',
      code: 'ciphertext = pow(plaintext, e, n)',
    },
    {
      name: 'Square root via fractional exponent',
      desc: 'x ** 0.5 is the same as sqrt(x) — pow is fine for non-negative x.',
      code: 'root = pow(x, 0.5)',
    },
    {
      name: 'Modular inverse',
      desc: 'Since 3.8, three-arg pow with negative exponent gives the modular inverse.',
      code: 'inv = pow(a, -1, m)   # a &times; inv &equiv; 1 (mod m)',
    },
    {
      name: 'Powers of two',
      desc: 'Common enough that 1 &lt;&lt; n or 2**n often reads as well as pow(2, n).',
      code: 'byte_max = pow(2, 8) - 1',
    },
  ],

  examples: [
    { title: 'Basic power',        code: 'pow(2, 10)',        returns: '1024' },
    { title: 'Modular (3-arg)',    code: 'pow(5, 55, 13)',    returns: '8' },
    { title: 'Big modular exp',    code: 'pow(3, 1000, 97)',  returns: '36' },
    { title: 'Negative exp → float', code: 'pow(2, -3)',        returns: '0.125' },
    { title: 'Float exp',          code: 'pow(4, 0.5)',       returns: '2.0' },
    { title: '0**0 is 1',          code: 'pow(0, 0)',         returns: '1' },
    { title: '0**-1 raises',       code: 'pow(0, -1)',        returns: 'ZeroDivisionError: 0.0 cannot be raised to a negative power' },
  ],

  pitfalls: [
    {
      name: '`pow(a, b, m)` vs `a**b % m` — same result, wildly different speed',
      desc: 'The two-arg + modulus form materializes a**b, which can be astronomically large. The three-arg form uses square-and-multiply and stays within bounds.',
      wrong: { label: 'Slow / OOM', code: 'pow(3, 10**6) % 97', output: 'materializes a giant integer first' },
      fix:   { label: 'Fast path',  code: 'pow(3, 10**6, 97)',  output: 'stays small; nearly instant' },
    },
    {
      name: 'Negative exp on ints returns a float (two-arg)',
      desc: 'Because the true result is a fraction. If you need modular inverse, use the three-arg form (3.8+).',
      wrong: { label: 'Float leak', code: 'pow(2, -3)', output: '0.125  # not an int' },
      fix:   { label: 'Modular inverse', code: 'pow(2, -1, 13)   # 7 — the inverse of 2 mod 13', output: '7' },
    },
    {
      name: 'Three-arg pow requires INTEGERS',
      desc: 'A float base, exp, or mod raises TypeError. Modular exponentiation is defined only on integers.',
      wrong: { label: 'Type error', code: 'pow(2.0, 10, 13)', output: 'TypeError: pow() 3rd argument not allowed unless all arguments are integers' },
      fix:   { label: 'Cast first',  code: 'pow(int(2.0), 10, 13)', output: '10' },
    },
    {
      name: '0**negative raises',
      desc: 'Zero to a negative power is 1/0 — undefined. Python raises ZeroDivisionError.',
      wrong: { label: 'Division by zero', code: 'pow(0, -1)', output: 'ZeroDivisionError: 0.0 cannot be raised to a negative power' },
      fix:   { label: 'Guard base',        code: 'pow(0, -1) if base != 0 else default', output: 'no crash' },
    },
  ],

  when: {
    use: [
      'Modular arithmetic in cryptography, hashing, algorithms',
      'Powers with a computed exponent (readability over **)',
      'Modular inverse via `pow(a, -1, m)` — Python 3.8+',
      'When you want an explicit function call in a math-heavy pipeline',
    ],
    avoid: [
      'Simple constant powers → the ** operator is clearer',
      'Powers of two → `1 &lt;&lt; n` is idiomatic',
      'Cases where operator overloading matters (e.g. numpy) → operator preserves broadcasting',
    ],
  },

  notes: {
    complexity: 'Two-arg: O(log exp) using square-and-multiply for ints. Three-arg: O(log exp) with values bounded by mod — dramatically cheaper for large inputs.',
    return:     'int when all args are ints and exp is non-negative (or three-arg); float otherwise',
    cpython:    'Python/bltinmodule.c :: builtin_pow — dispatches to type-specific implementations',
    memory:     'Two-arg on huge ints can allocate very large integers; three-arg stays within `mod`',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'divmod',  slug: 'divmod',  when: 'Quotient and remainder together — mod adjacent math' },
    { name: 'round',   slug: 'round',   when: 'Rounding a floating power' },
    { name: 'abs',     slug: 'abs',     when: 'Magnitude before/after exponentiation' },
  ],

  faq: [
    {
      q: 'Why is pow(0, 0) equal to 1?',
      a: 'Python follows the &quot;combinatorial&quot; convention: 0**0 = 1. This matches how empty products and Taylor series expansions are defined, and how most math libraries behave. It is a choice — some mathematicians prefer &quot;undefined&quot; — but Python commits to 1.',
    },
    {
      q: 'What is the difference between pow(a, b) and a**b?',
      a: 'For plain numbers they are equivalent. pow() is a function, so it composes with map/filter/functools; ** is an operator, so it participates in operator overloading (numpy, sympy, etc.). Three-arg pow(a, b, m) has no operator equivalent.',
    },
    {
      q: 'When would I use the third argument?',
      a: 'Anytime you need `a**b % m` on large exponents — RSA, Diffie-Hellman, hash chains, order-finding algorithms. The three-arg form uses fast modular exponentiation and stays within `mod`, avoiding the memory blowup of materializing `a**b`.',
    },
    {
      q: 'Can pow return a complex number?',
      a: 'Yes. pow(-1, 0.5) returns a float NaN with a warning-worthy result, but pow((-1+0j), 0.5) returns the complex square root. Feed a complex number in to get a complex answer.',
    },
  ],

  history: [
    { version: '1.0', note: 'pow() has been a builtin since Python 1.0, including the three-argument modular form.' },
    { version: '3.0', note: 'True division rules apply; negative-exponent ints return floats (unless three-arg).' },
    { version: '3.8', note: 'Three-arg pow accepts negative exponents — computes the modular inverse when base is coprime with mod.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#pow',
    meta:  'pow',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};