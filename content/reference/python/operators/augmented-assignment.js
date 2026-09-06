// content/reference/python/operators/augmented-assignment.js
//
// Doc-only page: augmented assignment is a STATEMENT, not an expression, so
// the demo harness (which evaluates a single expression) cannot run it.
//
// Covers all fifteen forms in one entry: they differ only in which operator
// is applied, and share every semantic that is actually worth documenting.

export const meta = {
  slug:        'augmented-assignment',
  name:        '+= -= *= /=',
  signature:   'a op= b',
  blurb:       'In-place assignment — and the reason lists and tuples behave so strangely under it.',
  category:    'assignment',
  type:        'operator',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'augmented assignment plus equals in place iadd increment decrement mutate rebind operator',
};

export const method = {
  slug:      'augmented-assignment',
  name:      '+= -= *= /=',
  signature: 'a op= b',
  returns:   { type: 'None', desc: 'A statement, not an expression — it produces no value and cannot appear inside a larger expression.' },

  category:    'Assignment operator',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'All fifteen forms follow one rule: try to mutate in place via __iop__, and fall back to rebinding. Whether you get mutation or rebinding depends on the TYPE, and that is where every surprise comes from.',

  cheat: {
    commonCall: 'count += 1',
    returns:    'nothing — it is a statement',
    replaces:   'a = a + b, but not always equivalently',
    watchOut:   'on a list it mutates in place, so every alias sees the change',
  },

  parameters: [
    { name: 'a',  type: 'Any', required: true, default: null, desc: 'Target. Must already be bound — augmented assignment reads before it writes.' },
    { name: 'op', type: 'str', required: true, default: null, desc: 'One of + - * / // % ** >> << & | ^ @, giving the fifteen forms.' },
    { name: 'b',  type: 'Any', required: true, default: null, desc: 'Right operand, passed to __iop__ or the plain binary operator.' },
  ],

  examples: [
    { title: 'Increment',          code: 'n = 1\nn += 1\nn',                       returns: '2' },
    { title: 'List mutates',       code: 'a = [1]\nb = a\na += [2]\nb',            returns: '[1, 2]  # b changed too' },
    { title: 'Concat rebinds',     code: 'a = [1]\nb = a\na = a + [2]\nb',         returns: '[1]  # b unchanged' },
    { title: 'Strings rebind',     code: "s = 'a'\ns += 'b'\ns",                   returns: "'ab'  # a new object" },
    { title: 'Undefined name',     code: 'del q\nq += 1',                          returns: "NameError: name 'q' is not defined" },
    { title: 'Not an expression',  code: 'print(n += 1)',                          returns: 'SyntaxError: invalid syntax' },
  ],

  pitfalls: [
    {
      name: 'x += y and x = x + y are NOT the same',
      desc: 'The most important thing on this page. For a list, += calls __iadd__ and mutates in place, so every other reference sees the change. Plain concatenation builds a new list and rebinds only your name.',
      wrong: { label: 'Alias sees it', code: 'a = [1]\nb = a\na += [2]\nb', output: '[1, 2]' },
      fix:   { label: 'Rebind instead', code: 'a = [1]\nb = a\na = a + [2]\nb', output: '[1]' },
    },
    {
      name: 'The tuple trap — it raises AND mutates',
      desc: 'The most notorious corner in the language. t[0] += [9] first mutates the inner list through __iadd__, then fails trying to store the result back into the immutable tuple. You get a TypeError and the mutation, which looks impossible until you know the order.',
      wrong: { label: 'Both happen', code: "t = ([1], 2)\nt[0] += [9]\n# TypeError raised\nt", output: '([1, 9], 2)  # changed anyway' },
      fix:   { label: 'Mutate explicitly', code: 't = ([1], 2)\nt[0].extend([9])\nt', output: '([1, 9], 2), no error' },
    },
    {
      name: 'It reads the target first',
      desc: 'Augmented assignment is not a definition. The name must already be bound, otherwise you get a NameError — and inside a function, assigning to a global this way needs a global declaration.',
      wrong: { label: 'Not yet bound', code: 'total += 1', output: "NameError: name 'total' is not defined" },
      fix:   { label: 'Initialise first', code: 'total = 0\ntotal += 1', output: '1' },
    },
    {
      name: 'It is a statement, so it has no value',
      desc: 'Unlike C, you cannot use it inside an expression. Where you want assignment as part of a larger expression, the walrus operator is the tool Python provides.',
      wrong: { label: 'No value', code: 'print(n += 1)', output: 'SyntaxError: invalid syntax' },
      fix:   { label: 'Walrus for expressions', code: 'print(n := n + 1)', output: 'the new value' },
    },
    {
      name: 'Immutable types always rebind',
      desc: 'Numbers, strings and tuples have no in-place form, so += silently builds a new object. Repeated string += in a loop is therefore quadratic, which is why join exists.',
      wrong: { label: 'Quadratic', code: 's = ""\nfor x in items:\n    s += x', output: 'a new string every iteration' },
      fix:   { label: 'Join once', code: 's = "".join(items)', output: 'linear' },
    },
  ],

  when: {
    use: [
      'Counters and accumulators',
      'Extending a list in place when aliases SHOULD see the change',
      'Bitmask updates with |= and &=',
      'Anywhere a = a + b would repeat a long target expression',
    ],
    avoid: [
      'Building a string in a loop → join',
      'When aliases must NOT see the change → rebind with a = a + b',
      'Items inside a tuple → mutate the inner object explicitly',
      'Inside an expression → the walrus operator',
    ],
  },

  notes: {
    complexity: 'Mutation is usually O(len(b)); rebinding is O(len(a) + len(b))',
    return:     'Nothing — it is a statement',
    cpython:    'Compiled to INPLACE_* opcodes, dispatching to __iadd__ and friends with a fallback to __add__',
    memory:     'In-place forms avoid allocating; rebinding forms allocate a new object',
    threadSafe: 'No — read-modify-write is not atomic, so counters need a lock',
  },

  related: [
    { name: '+',   slug: 'add',    when: 'The binary form that always rebinds' },
    { name: ':=',  slug: 'walrus', when: 'Assignment that IS an expression' },
    { name: '-',   slug: 'sub',    when: 'The binary counterpart of -=' },
    { name: '@',   slug: 'matmul', when: 'The newest operator, with its own @= form' },
  ],

  faq: [
    {
      q: 'Why does a += [2] change my other variable?',
      a: 'Because lists implement __iadd__, which extends the existing list rather than creating a new one. Both names still point at that same list, so both see the new item. a = a + [2] creates a new list instead and leaves the original alone.',
      code: 'a = [1]\nb = a\na += [2]\nb   # [1, 2]',
    },
    {
      q: 'How can t[0] += [9] raise an error and still work?',
      a: 'Because it happens in two steps. Python evaluates t[0] += [9] as: mutate t[0] in place, then assign the result back to t[0]. The mutation succeeds; the assignment fails because tuples reject item assignment. The error is real and so is the change.',
      code: "t = ([1], 2)\nt[0] += [9]   # TypeError\nt             # ([1, 9], 2)",
    },
    {
      q: 'Is += atomic for a shared counter?',
      a: 'No. It reads, adds and writes as separate steps, so two threads can interleave and lose an update. Use a lock, or itertools.count, or reach for atomic primitives from another library.',
      code: 'with lock:\n    counter += 1',
    },
    {
      q: 'Which operators have an augmented form?',
      a: 'All fifteen binary ones: += -= *= /= //= %= **= >>= <<= &= |= ^= and @=. Each maps to a matching dunder — __iadd__, __isub__ and so on — with a fallback to the plain binary version when the in-place one is absent.',
    },
  ],

  history: [
    { version: '2.0', note: 'Augmented assignment added by PEP 203, with the __iop__ protocol.' },
    { version: '3.5', note: '@= added alongside the matrix multiplication operator.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#augmented-assignment-statements',
    meta:  'Augmented assignment statements',
  },

  tryInTool: [],
};
