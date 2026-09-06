// content/reference/python/operators/matmul.js
//
// Doc-only page: NO built-in type implements @, so every demo case would
// raise TypeError. The operator only does anything with numpy or a custom
// class, neither of which the sandboxed demo can provide.

export const meta = {
  slug:        'matmul',
  name:        '@',
  signature:   'a @ b',
  blurb:       'Matrix multiplication — an operator with no built-in implementation at all.',
  category:    'arithmetic',
  type:        'operator',
  hasLiveDemo: false,
  version:     'Python 3.5+',
  searchTerms: 'matmul matrix multiply at operator numpy dot product linear algebra pep 465',
};

export const method = {
  slug:      'matmul',
  name:      '@',
  signature: 'a @ b',
  returns:   { type: 'Any', desc: 'Whatever __matmul__ returns. No built-in type defines it, so on plain Python values this always raises TypeError.' },

  category:    'Arithmetic operator',
  version:     'Python 3.5+',
  hasLiveDemo: false,

  subtitle: 'Python added an operator with nothing to use it on. It exists purely so numeric libraries can spell matrix multiplication without stealing * from element-wise maths.',

  cheat: {
    commonCall: 'a @ b',
    returns:    'a matrix product, if the operands implement __matmul__',
    replaces:   'numpy.dot(a, b) and the old a.dot(b) chains',
    watchOut:   'int, float, list and str do NOT support it — TypeError every time',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand. Must implement __matmul__ — in practice a numpy array or a custom matrix class.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand. Falls back to its __rmatmul__ if the left operand returns NotImplemented.' },
  ],

  examples: [
    { title: 'Built-ins reject it', code: '3 @ 4', returns: "TypeError: unsupported operand type(s) for @: 'int' and 'int'" },
    { title: 'Lists too',           code: '[1, 2] @ [3, 4]', returns: "TypeError: unsupported operand type(s) for @: 'list' and 'list'" },
    { title: 'numpy matrices',      code: 'import numpy as np\nnp.array([[1,2],[3,4]]) @ np.array([[1,0],[0,1]])', returns: 'array([[1, 2],\n       [3, 4]])' },
    { title: 'Element-wise is *',   code: 'np.array([1,2]) * np.array([3,4])', returns: 'array([3, 8])' },
    { title: 'Matrix product is @', code: 'np.array([1,2]) @ np.array([3,4])', returns: '11  # 1*3 + 2*4' },
    { title: 'Custom class hook',   code: 'class M:\n    def __matmul__(self, other):\n        return "product"', returns: 'M() @ M() gives "product"' },
  ],

  pitfalls: [
    {
      name: 'Nothing built in supports it',
      desc: 'The operator is part of the language but no standard type implements it. Reaching for @ on ints, floats or lists is always a TypeError — this is the single most surprising thing about it.',
      wrong: { label: 'No implementation', code: '3 @ 4', output: "TypeError: unsupported operand type(s) for @: 'int' and 'int'" },
      fix:   { label: 'Ordinary multiply', code: '3 * 4', output: '12' },
    },
    {
      name: '@ and * mean different things in numpy',
      desc: 'For arrays, * is element-wise and @ is the matrix product. Swapping them produces an array of the wrong shape rather than an error, so the bug survives until something downstream complains.',
      wrong: { label: 'Element-wise', code: 'np.array([1,2]) * np.array([3,4])', output: 'array([3, 8])' },
      fix:   { label: 'Matrix product', code: 'np.array([1,2]) @ np.array([3,4])', output: '11' },
    },
    {
      name: 'It is also a decorator symbol',
      desc: 'The same character introduces decorators, but they are unrelated — one is a prefix on a def, the other an infix operator. Searching for "@ in Python" mostly returns decorator results.',
      wrong: { label: 'Different feature', code: '@decorator\ndef f(): ...', output: 'a decorator, not matmul' },
      fix:   { label: 'Infix is matmul',   code: 'result = a @ b', output: 'the operator' },
    },
    {
      name: 'Python 3.5 and newer only',
      desc: 'Older interpreters treat it as a syntax error at parse time, so the whole module fails to load rather than failing where the operator is used.',
      wrong: { label: 'Fails on 3.4', code: 'a @ b', output: 'SyntaxError: invalid syntax' },
      fix:   { label: 'Call dot',     code: 'a.dot(b)', output: 'works on older versions' },
    },
  ],

  when: {
    use: [
      'Matrix products with numpy, where it reads far better than nested dot calls',
      'Custom linear-algebra classes that need multiplication to mean two things',
      'Any domain where element-wise and composed products both exist',
    ],
    avoid: [
      'Ordinary numeric multiplication → *',
      'Any built-in type — none implement it',
      'Code that must run on Python 3.4 or older',
    ],
  },

  notes: {
    complexity: 'Entirely determined by the implementation; a numpy matrix product is roughly O(n**3)',
    return:     'Whatever __matmul__ produces; no built-in fallback exists',
    cpython:    'Objects/abstract.c :: PyNumber_MatrixMultiply, dispatching to __matmul__ / __rmatmul__',
    memory:     'Implementation-defined',
    threadSafe: 'Depends on the operand types',
  },

  related: [
    { name: '*',  slug: 'mul',    when: 'Ordinary multiplication, and element-wise for arrays' },
    { name: '@=', slug: 'augmented-assignment', when: 'The in-place form, via __imatmul__' },
    { name: '**', slug: 'pow',    when: 'Exponentiation, including matrix powers in numpy' },
    { name: 'sum',slug: 'sum',    when: 'The reduction a dot product performs', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why add an operator that nothing implements?',
      a: 'PEP 465 argued that matrix multiplication is common enough in scientific Python to deserve its own spelling. Without it, libraries had to choose between * meaning element-wise or matrix multiplication — and both conventions already existed, causing constant confusion.',
      code: 'result = (a @ b) @ c      # vs a.dot(b).dot(c)',
    },
    {
      q: 'How do I support it in my own class?',
      a: 'Define __matmul__ for the left-hand side, __rmatmul__ for the reflected case, and __imatmul__ if @= should mutate in place. The protocol mirrors every other arithmetic operator.',
      code: 'def __matmul__(self, other):\n    return MyMatrix(...)',
    },
    {
      q: 'Is a @ b the same as numpy.dot?',
      a: 'For two-dimensional arrays, yes. They diverge for higher dimensions: @ broadcasts as a stack of matrices, while dot forms a sum-product over the last and second-to-last axes. For 2-D work they agree.',
    },
  ],

  history: [
    { version: '3.5', note: 'The @ operator added by PEP 465, with no built-in implementation by design.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations',
    meta:  'Binary arithmetic operations',
  },

  tryInTool: [],
};
