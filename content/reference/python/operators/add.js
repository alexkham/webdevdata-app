// content/reference/python/operators/add.js

export const meta = {
  slug:        'add',
  name:        '+',
  signature:   'a + b',
  blurb:       'Addition — and sequence concatenation.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'plus add addition sum concatenate operator',
};

export const method = {
  slug:      'add',
  name:      '+',
  signature: 'a + b',
  returns:   { type: 'number | sequence', desc: 'The sum of two numbers — or, for sequences of the same type (str, list, tuple), their concatenation.' },

  category:    'Arithmetic operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Addition for numbers, concatenation for sequences — same symbol, two jobs.',

  cheat: {
    commonCall: '2 + 3',
    returns:    'sum (numbers) or concatenation (sequences)',
    replaces:   '"a" + "b" works; "a" + 1 raises TypeError',
    watchOut:   'int + float promotes to float',
  },

  parameters: [
    { name: 'a', type: 'number | sequence', required: true, default: null, desc: 'Left operand.' },
    { name: 'b', type: 'number | sequence', required: true, default: null, desc: 'Right operand — must match a: number with number, sequence with same-type sequence.' },
  ],

  demoParams: [
    { name: 'a', type: 'float', hint: 'left operand',  input: 'float' },
    { name: 'b', type: 'float', hint: 'right operand', input: 'float' },
  ],
  demoTemplate: '{a} + {b}',
  cases: [
    { id: 'default', label: 'default',  values: { a: 2, b: 3 } },
    { id: 'floats',  label: 'floats',   values: { a: 0.1, b: 0.2 } },
    { id: 'negative', label: 'negative', values: { a: -5, b: 3 } },
  ],
  demoExplainer: 'Numeric addition, with the usual float caveat on display: 0.1 + 0.2 shows the stored binary result. In real Python the same symbol also concatenates strings and lists — see Examples.',

  patterns: [
    {
      name: 'Accumulate in place',
      desc: 'a += b is the augmented form (calls __iadd__ when available).',
      code: 'total += price',
    },
    {
      name: 'Concatenate sequences',
      desc: 'Same-type sequences join; mixing types raises.',
      code: '[1, 2] + [3]      # [1, 2, 3]\n"ab" + "cd"       # \'abcd\'',
    },
  ],

  examples: [
    { title: 'Numbers',            code: '2 + 3',           returns: '5' },
    { title: 'Float promotion',    code: '2 + 0.5',         returns: '2.5' },
    { title: 'String concatenation', code: '"ab" + "cd"',   returns: "'abcd'" },
    { title: 'List concatenation', code: '[1, 2] + [3]',    returns: '[1, 2, 3]' },
  ],

  pitfalls: [
    {
      name: 'str + int raises',
      desc: 'Python never implicitly converts between strings and numbers.',
      wrong: { label: 'Raises', code: '"age: " + 21', output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'Fix', code: 'f"age: {21}"  # or "age: " + str(21)', output: "'age: 21'" },
    },
    {
      name: 'Repeated string + in a loop is quadratic',
      desc: 'Each + copies the whole accumulated string.',
      wrong: { label: 'Slow', code: 'out = ""\nfor s in parts:\n    out = out + s', output: 'O(n²) copying' },
      fix:   { label: 'Fix', code: 'out = "".join(parts)', output: 'O(n)' },
    },
  ],

  when: {
    use: [
      'Numeric addition',
      'One-off concatenation of two sequences',
    ],
    avoid: [
      'Joining many strings → str.join',
      'Appending to a list → list.append / extend',
      'Summing an iterable → sum()',
    ],
  },

  notes: {
    complexity: 'O(1) numbers; O(len(a)+len(b)) sequences',
    return:     'new object; operands untouched',
    cpython:    'Objects/abstract.c :: PyNumber_Add → __add__ / __radd__',
    memory:     'Concatenation allocates the combined sequence',
    threadSafe: 'Yes — operands are not mutated',
  },

  related: [
    { name: '-',   slug: 'sub', when: 'The inverse' },
    { name: '*',   slug: 'mul', when: 'Repetition for sequences' },
    { name: 'sum', slug: 'sum', when: 'Add a whole iterable', category: 'functions' },
  ],

  faq: [
    {
      q: 'How does + know what to do for my class?',
      a: 'It calls a.__add__(b), falling back to b.__radd__(a). Implement those to overload it.',
    },
    {
      q: 'Why is 0.1 + 0.2 not 0.3?',
      a: 'Binary floats cannot represent 0.1 or 0.2 exactly; the stored values sum to 0.30000000000000004. Use decimal.Decimal when exactness matters.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations',
    meta:  'binary arithmetic',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect numeric data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
