// content/reference/python/functions/divmod.js

export const meta = {
  slug:        'divmod',
  name:        'divmod',
  signature:   'divmod(a, b)',
  blurb:       'Quotient and remainder in one call — (a // b, a % b).',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'divmod division quotient remainder modulo floor tuple pair math',
};

export const method = {
  slug:      'divmod',
  name:      'divmod',
  signature: 'divmod(a, b)',
  returns:   { type: 'tuple[int, int] | tuple[float, float]', desc: 'A 2-tuple (quotient, remainder). Same values as (a // b, a % b) but computed in one step. Types follow the wider operand.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'One call for both quotient and remainder — with floor semantics that keep the sign of the divisor.',

  cheat: {
    commonCall: 'hours, minutes = divmod(total_min, 60)',
    returns:    '(quotient, remainder) — a 2-tuple',
    replaces:   'writing `a // b, a % b` twice',
    watchOut:   'floor-division sign: divmod(-7, 2) is (-4, 1), not (-3, -1)',
  },

  parameters: [
    { name: 'a', type: 'int | float', required: true, default: null, desc: 'The dividend.' },
    { name: 'b', type: 'int | float', required: true, default: null, desc: 'The divisor. Zero raises ZeroDivisionError.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'dividend',  input: 'float' },
    { name: 'b', type: 'float', hint: 'divisor',   input: 'float' },
  ],
  cases: [
    { id: 'basic',    label: 'basic',        values: { a: 17,   b: 5 } },
    { id: 'exact',    label: 'exact',        values: { a: 20,   b: 5 } },
    { id: 'neg-a',    label: 'negative a',   values: { a: -7,   b: 2 } },
    { id: 'neg-b',    label: 'negative b',   values: { a: 7,    b: -2 } },
    { id: 'floats',   label: 'floats',       values: { a: 3.5,  b: 1.2 } },
    { id: 'zero',     label: 'zero divisor', values: { a: 10,   b: 0 } },
  ],
  demoExplainer: 'divmod(a, b) is equivalent to (a // b, a % b) — one call, one pass. Python uses FLOOR division, so the remainder always has the same sign as the divisor: divmod(-7, 2) is (-4, 1), because -4 * 2 + 1 = -7. This differs from C-style truncation (which would give (-3, -1)). Zero divisor raises ZeroDivisionError exactly as / would.',

  patterns: [
    {
      name: 'Time unit breakdown',
      desc: 'Cascade divmod to split total seconds into hours / minutes / seconds.',
      code: 'h, rem = divmod(total_seconds, 3600)\nm, s   = divmod(rem, 60)',
    },
    {
      name: 'Base conversion',
      desc: 'Repeatedly divmod against the target base to extract digits (in reverse).',
      code: 'digits = []\nwhile n:\n    n, r = divmod(n, base)\n    digits.append(r)',
    },
    {
      name: 'Grid coordinates',
      desc: 'Flat index → (row, col) in one call.',
      code: 'row, col = divmod(idx, ncols)',
    },
  ],

  examples: [
    { title: 'Basic integer',        code: 'divmod(17, 5)',   returns: '(3, 2)' },
    { title: 'Exact division',       code: 'divmod(20, 5)',   returns: '(4, 0)' },
    { title: 'Negative dividend',    code: 'divmod(-7, 2)',   returns: '(-4, 1)' },
    { title: 'Negative divisor',     code: 'divmod(7, -2)',   returns: '(-4, -1)' },
    { title: 'Floats',               code: 'divmod(3.5, 1.2)',returns: '(2.0, 1.0999999999999996)' },
    { title: 'Zero raises',          code: 'divmod(10, 0)',   returns: 'ZeroDivisionError: integer division or modulo by zero' },
  ],

  pitfalls: [
    {
      name: 'Floor division, not truncation',
      desc: 'For negatives, Python rounds the quotient DOWN (toward negative infinity), not toward zero. The remainder follows the sign of the divisor. Programmers coming from C, Java, or JavaScript get bitten regularly.',
      wrong: { label: 'C-style guess', code: 'divmod(-7, 2)   # expected (-3, -1)?', output: '(-4, 1)' },
      fix:   { label: 'Verify identity', code: '-4 * 2 + 1  # == -7 ✓', output: '-7' },
    },
    {
      name: 'Floats drift',
      desc: 'Binary floats cannot represent most decimals exactly; the remainder of a float divmod inherits the drift.',
      wrong: { label: 'Not quite 0.1', code: 'divmod(3.5, 1.2)', output: '(2.0, 1.0999999999999996)' },
      fix:   { label: 'Decimal for exactness', code: 'from decimal import Decimal\ndivmod(Decimal("3.5"), Decimal("1.2"))', output: "(Decimal('2'), Decimal('1.1'))" },
    },
    {
      name: 'Zero divisor raises',
      desc: 'divmod(a, 0) is not (inf, nan) or (0, a) — it raises, exactly like a plain division.',
      wrong: { label: 'Runtime error', code: 'q, r = divmod(count, per_page)', output: 'ZeroDivisionError when per_page == 0' },
      fix:   { label: 'Guard',         code: 'q, r = divmod(count, per_page) if per_page else (0, count)', output: 'safe default' },
    },
  ],

  when: {
    use: [
      'Both quotient and remainder needed together',
      'Cascading unit breakdowns (time, base conversion, coordinates)',
      'Making the &quot;both at once&quot; intent explicit in the code',
    ],
    avoid: [
      'Only need one → use // or %',
      'Exact decimal remainders → Decimal or math.remainder',
      'Complex numbers → not supported',
    ],
  },

  notes: {
    complexity: 'O(1)',
    return:     'A 2-tuple; element types match the wider operand',
    cpython:    'Objects/longobject.c :: long_divmod / floatobject.c :: float_divmod',
    memory:     'Allocates one small tuple',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'round', slug: 'round', when: 'When you want the closer integer, not the floor' },
    { name: 'sum',   slug: 'sum',   when: 'Reduce quotients across many divisions' },
    { name: 'abs',   slug: 'abs',   when: 'Sign-independent magnitude' },
  ],

  faq: [
    {
      q: 'Why does divmod(-7, 2) return (-4, 1) instead of (-3, -1)?',
      a: 'Python uses floor division: the quotient is rounded toward negative infinity so the identity `q * b + r == a` holds with `0 &lt;= r &lt; b` (when b is positive). C-style truncation breaks that identity for negatives.',
    },
    {
      q: 'Is divmod faster than // and % separately?',
      a: 'Yes, marginally — one machine division instead of two. In tight numeric loops it matters; in ordinary code the win is readability.',
    },
    {
      q: 'Does divmod work on Decimal or Fraction?',
      a: 'Yes. Any type that implements __divmod__ works; Decimal and Fraction both do, and give exact answers where floats drift.',
    },
  ],

  history: [
    { version: '1.0', note: 'divmod() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Division of two ints returns a float (/), but divmod still returns int quotient + int remainder.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#divmod',
    meta:  'divmod',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
  ],
};