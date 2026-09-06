// content/reference/python/operators/ternary.js
//
// The conditional expression. Slug is `ternary` — the name most people
// search for — though the docs call it a conditional expression.

export const meta = {
  slug:        'ternary',
  name:        'a if cond else b',
  signature:   'value_if_true if condition else value_if_false',
  blurb:       'The conditional expression — an if that produces a value instead of running statements.',
  category:    'conditional',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'ternary conditional expression inline if else one line shorthand value branch',
};

export const method = {
  slug:      'ternary',
  name:      'a if cond else b',
  signature: 'value_if_true if condition else value_if_false',
  returns:   { type: 'Any', desc: 'The first operand when the condition is truthy, otherwise the third. Only the branch that is chosen gets evaluated.' },

  category:    'Conditional operator',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Python puts the condition in the MIDDLE, unlike almost every other language. The else branch is mandatory — there is no one-sided form.',

  cheat: {
    commonCall: 'x if cond else y',
    returns:    'one of the two values; the other is never evaluated',
    replaces:   'a four-line if/else that only assigns a variable',
    watchOut:   'else is required, and the condition sits in the middle, not first',
  },

  parameters: [
    { name: 'value_if_true',  type: 'Any', required: true, default: null, desc: 'Result when the condition is truthy. Evaluated only in that case.' },
    { name: 'condition',      type: 'Any', required: true, default: null, desc: 'Tested for truthiness, not for equality to True. 0, empty containers and None are falsy.' },
    { name: 'value_if_false', type: 'Any', required: true, default: null, desc: 'Result when the condition is falsy. Mandatory — there is no if-without-else form.' },
  ],

  demoParams: [
    { name: 'a',    type: 'Any', hint: 'value when true',  input: 'text' },
    { name: 'cond', type: 'int', hint: 'condition (0 is falsy)', input: 'number' },
    { name: 'b',    type: 'Any', hint: 'value when false', input: 'text' },
  ],
  demoTemplate: '{a} if {cond} else {b}',
  cases: [
    { id: 'true',     label: 'truthy (1)',    values: { a: 'yes', cond: 1, b: 'no' } },
    { id: 'false',    label: 'falsy (0)',     values: { a: 'yes', cond: 0, b: 'no' } },
    { id: 'nonzero',  label: 'any non-zero',  values: { a: 'yes', cond: 42, b: 'no' } },
    { id: 'negative', label: 'negative is truthy', values: { a: 'yes', cond: -1, b: 'no' } },
  ],
  demoExplainer: 'The condition sits between the two results, which is what makes Python read like English — "yes if the flag else no". Note that it tests TRUTHINESS, not equality with True: 42 and -1 are both truthy, and only 0 selects the else branch. In real Python the branch that is not chosen is never evaluated at all, which matters when one side would raise or is expensive.',

  patterns: [
    {
      name: 'Conditional assignment',
      desc: 'The main use — collapses a four-line if/else that only sets a name.',
      code: 'label = "even" if n % 2 == 0 else "odd"',
    },
    {
      name: 'Guard against a bad value inline',
      desc: 'The unevaluated branch is what makes this safe.',
      code: 'ratio = total / count if count else 0',
    },
    {
      name: 'Inside a comprehension',
      desc: 'Transforms each item; note this is not the same as a filtering if.',
      code: '[x if x > 0 else 0 for x in values]',
    },
  ],

  examples: [
    { title: 'Truthy',           code: "'yes' if 1 else 'no'",  returns: "'yes'" },
    { title: 'Falsy',            code: "'yes' if 0 else 'no'",  returns: "'no'" },
    { title: 'Empty is falsy',   code: "'full' if [] else 'empty'", returns: "'empty'" },
    { title: 'Safe division',    code: '10 / 2 if 2 else 0',    returns: '5.0' },
    { title: 'Lazy — no error',  code: '1 / 0 if False else "safe"', returns: "'safe'" },
    { title: 'Chained',          code: "'neg' if -1 < 0 else 'zero' if -1 == 0 else 'pos'", returns: "'neg'" },
  ],

  pitfalls: [
    {
      name: 'else is mandatory',
      desc: 'There is no one-sided conditional expression. Omitting else is a SyntaxError, because an expression must always produce a value.',
      wrong: { label: 'No value for the false case', code: "x = 'yes' if cond", output: 'SyntaxError: expected \'else\' after \'if\' expression' },
      fix:   { label: 'Supply both',                 code: "x = 'yes' if cond else None", output: 'valid' },
    },
    {
      name: 'The filtering if in a comprehension is a different thing',
      desc: 'A trailing if FILTERS items out; a leading conditional expression TRANSFORMS every item. Their positions differ and so do their results, which makes this a persistent source of confusion.',
      wrong: { label: 'Transforms, keeps all', code: '[x if x > 2 else 0 for x in [1, 2, 3]]', output: '[0, 0, 3]' },
      fix:   { label: 'Filters, drops some',   code: '[x for x in [1, 2, 3] if x > 2]', output: '[3]' },
    },
    {
      name: 'Chaining gets unreadable fast',
      desc: 'Nested conditional expressions are legal and right-associative, but two levels is already hard to scan. A dict lookup or a plain if/elif chain communicates far better.',
      wrong: { label: 'Hard to follow', code: "s = 'a' if n == 1 else 'b' if n == 2 else 'c' if n == 3 else 'd'", output: 'legal, unreadable' },
      fix:   { label: 'Use a mapping',  code: "s = {1: 'a', 2: 'b', 3: 'c'}.get(n, 'd')", output: 'clearer' },
    },
    {
      name: 'It binds loosely — parenthesise in bigger expressions',
      desc: 'The conditional has very low precedence, so surrounding operators grab their operands first. Concatenation and arithmetic around an unparenthesised ternary rarely mean what they look like.',
      wrong: { label: 'Binds unexpectedly', code: "'a' + 'b' if False else 'c'", output: "'c'  # the + applies to the true branch" },
      fix:   { label: 'Parenthesise',       code: "'a' + ('b' if False else 'c')", output: "'ac'" },
    },
  ],

  when: {
    use: [
      'Choosing between two values in an assignment',
      'Supplying a default inline without a full if/else block',
      'Transforming items inside a comprehension',
      'Argument values that depend on one condition',
    ],
    avoid: [
      'More than one level of nesting → if/elif or a dict lookup',
      'Either branch needs statements → a real if block',
      'Only one branch matters → a plain if, or the or idiom for defaults',
    ],
  },

  notes: {
    complexity: 'O(1) plus whatever the chosen branch costs; the other branch is never evaluated',
    return:     'Whichever operand was selected — no conversion is applied',
    cpython:    'Compiled to a conditional jump; there is no __ternary__ hook to override',
    memory:     'No allocation of its own',
    threadSafe: 'Yes — evaluation order is well defined',
  },

  related: [
    { name: 'and',    slug: 'and',    when: 'Short-circuiting that also returns an operand' },
    { name: 'or',     slug: 'or',     when: 'The classic default-value idiom' },
    { name: 'not',    slug: 'not',    when: 'Invert the condition' },
    { name: 'bool',   slug: 'bool',   when: 'Make the truthiness test explicit', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is the condition in the middle?',
      a: 'PEP 308 chose the ordering to read as English — "the result, if the condition, otherwise the other". It puts the common case first, which is the opposite of the C-style cond ? a : b that most other languages use.',
      code: "status = 'on' if enabled else 'off'",
    },
    {
      q: 'Is the unused branch really not evaluated?',
      a: 'Correct — it is lazy, exactly like if/else. That is why "total / count if count else 0" is safe: when count is zero the division never runs.',
      code: '1 / 0 if False else "safe"\n# no ZeroDivisionError',
    },
    {
      q: 'When should I use "or" instead?',
      a: 'The or idiom is shorter for defaults, but it triggers on any falsy value — so 0 and empty string get replaced too. Use the conditional when you need to test specifically for None.',
      code: 'x = value if value is not None else default   # precise\nx = value or default                          # 0 becomes default',
    },
  ],

  history: [
    { version: '2.5', note: 'Conditional expressions added by PEP 308, after long debate over the syntax.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#conditional-expressions',
    meta:  'Conditional expressions',
  },

  tryInTool: [],
};
