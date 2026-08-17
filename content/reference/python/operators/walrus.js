// content/reference/python/operators/walrus.js
//
// Doc-only page: assignment cannot be demonstrated with a pure emulator,
// so hasLiveDemo is false.

export const meta = {
  slug:        'walrus',
  name:        ':=',
  signature:   '(name := expression)',
  blurb:       'Assignment expression — assign and use a value in one place.',
  category:    'assignment',
  type:        'operator',
  hasLiveDemo: false,
  version:     'Python 3.8+',
  searchTerms: 'walrus assignment expression colon equals named operator',
};

export const method = {
  slug:      'walrus',
  name:      ':=',
  signature: '(name := expression)',
  returns:   { type: 'Any', desc: 'The value of the expression — which is also bound to name in the enclosing scope. Assignment that IS an expression.' },

  category:    'Assignment expression',
  version:     'Python 3.8+',
  hasLiveDemo: false,

  subtitle: 'The walrus: bind a name inside an expression — compute once, test, and reuse.',

  cheat: {
    commonCall: 'if (n := len(data)) > 10:',
    returns:    'the assigned value, usable immediately',
    replaces:   'compute-then-test without a setup line',
    watchOut:   'as a statement, plain = is correct — the walrus needs an expression context',
  },

  parameters: [
    { name: 'name',       type: 'identifier', required: true, default: null, desc: 'The variable to bind — a plain name only, no attributes or subscripts.' },
    { name: 'expression', type: 'Any',        required: true, default: null, desc: 'Evaluated once; its value is both bound and returned.' },
  ],

  patterns: [
    {
      name: 'Test and reuse',
      desc: 'The motivating case — no duplicate call, no throwaway line.',
      code: 'if (match := pattern.search(line)) is not None:\n    print(match.group(1))',
    },
    {
      name: 'Read-until loops',
      desc: 'Replaces the while-True-read-break dance.',
      code: 'while (chunk := file.read(8192)):\n    process(chunk)',
    },
    {
      name: 'Reuse inside a comprehension',
      desc: 'Compute an expensive value once per item.',
      code: 'results = [y for x in data if (y := f(x)) > 0]',
    },
  ],

  examples: [
    { title: 'Assign and test',        code: 'if (n := 11) > 10:\n    print(n)', returns: '11 printed — n is bound' },
    { title: 'Loop condition',         code: 'while (line := input()) != "quit":\n    handle(line)', returns: 'reads until "quit"' },
  ],

  pitfalls: [
    {
      name: 'Not a statement replacement',
      desc: 'Where a plain assignment works, the walrus is noise (and sometimes a SyntaxError without parens).',
      wrong: { label: 'Noise', code: '(x := 5)   # as a whole statement', output: 'legal but pointless — use x = 5' },
      fix:   { label: 'Fix', code: 'x = 5', output: 'plain assignment' },
    },
    {
      name: 'Scope leaks out of comprehensions',
      desc: 'Unlike the loop variable, a walrus-bound name escapes to the enclosing scope.',
      wrong: { label: 'Leaks', code: '[y for x in data if (y := f(x)) > 0]\nprint(y)   # last value — defined!', output: 'y exists after the comprehension' },
      fix:   { label: 'Be aware', code: 'avoid reusing the name outside, or del it', output: 'explicit hygiene' },
    },
    {
      name: 'Readability cuts both ways',
      desc: 'Nesting walruses or using them where nothing is reused hurts more than it helps.',
      wrong: { label: 'Dense', code: 'if (a := f()) and (b := g(a)) and (c := h(b)):', output: 'three assignments hidden in a condition' },
      fix:   { label: 'Spread it out', code: 'a = f()\nif a:\n    b = g(a)\n    ...', output: 'boring and clear' },
    },
  ],

  when: {
    use: [
      'Test-and-use: regex matches, reads, computed lengths',
      'Loop conditions that produce the loop value',
      'Avoiding double computation in comprehensions',
    ],
    avoid: [
      'Plain assignments → =',
      'Anything that gets harder to read — the walrus is optional sugar',
    ],
  },

  notes: {
    complexity: 'O(1) — an assignment',
    return:     'the assigned value',
    cpython:    'NAMED_EXPR in the grammar; compiles to a store + load',
    memory:     'No allocation',
    threadSafe: 'Same as any assignment',
  },

  related: [
    { name: '==', slug: 'eq',  when: 'The comparison it must not be confused with' },
    { name: 'and', slug: 'and', when: 'Chaining guarded computations' },
    { name: 'len', slug: 'len', when: 'The classic walrus operand', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is it called the walrus operator?',
      a: 'Tilt your head: := looks like a walrus’s eyes and tusks. The official name is "assignment expression" (PEP 572).',
    },
    {
      q: 'Why does Python distinguish = and := at all?',
      a: 'Keeping = a statement prevents the classic C bug of assigning inside a condition by typo. The walrus makes assignment-in-expression possible but always visibly deliberate.',
    },
  ],

  history: [
    { version: '3.8', note: 'Introduced by PEP 572 — famously the controversy that preceded Guido’s retirement as BDFL.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#assignment-expressions',
    meta:  'assignment expressions',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};
