// content/reference/python/keywords/break.js

export const meta = {
  slug:        'break',
  name:        'break',
  signature:   'break',
  blurb:       'Leave the innermost for or while loop immediately — skipping the rest of the body, the remaining items, and the loop’s else.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'break statement exit loop stop loop early break out of loop nested loops break outer loop for else while true keyword',
};

export const method = {
  slug:      'break',
  name:      'break',
  signature: 'break',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'break ends the loop it is directly inside — only that one. Code after it in the body, the remaining iterations and the loop’s else block are all skipped.',

  covers: ['break'],

  syntax: [
    { label: 'break in a loop', code: 'for x in items:\n    if found(x):\n        break' },
    { label: 'break skips else', code: 'for x in items:\n    if found(x):\n        break\nelse:\n    not_found()' },
    { label: 'nested loops', code: 'for row in grid:\n    for cell in row:\n        if cell:\n            break  # inner only' },
  ],

  cheat: {
    useFor:    'stop a search at the first hit; leave while True',
    result:    'a statement — exits the innermost enclosing loop',
    pairsWith: 'for, while, else, continue',
    watchOut:  'only exits ONE loop; outside a loop it is a SyntaxError',
  },

  parameters: [
    { name: '(none)', type: 'statement', required: false, default: null, desc: 'break takes no operand and no label. It must be inside the body of a for or while loop (not in a nested def or class).' },
  ],

  modes: [
    {
      id: 'break',
      label: 'break',
      blurb: 'Walk the numbers and stop at the first negative. The trace shows exactly which iterations ran.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'seen = []\nfor n in {$numbers}:\n    if n < 0:\n        break\n    seen.append(n)\nseen',
      cases: [
        { id: 'mid',   label: 'negative in the middle', values: { numbers: '3, 5, -1, 8' } },
        { id: 'first', label: 'negative first',         values: { numbers: '-2, 4' } },
        { id: 'none',  label: 'no negatives',           values: { numbers: '1, 2, 3' } },
      ],
    },
    {
      id: 'else',
      label: 'break skips else',
      blurb: 'The same search with a log. When break fires, the loop’s else never runs.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'log = []\nfor n in {$numbers}:\n    log.append(n)\n    if n < 0:\n        log.append("break")\n        break\nelse:\n    log.append("else")\nlog',
      cases: [
        { id: 'hit',   label: 'has a negative', values: { numbers: '4, -2, 7' } },
        { id: 'miss',  label: 'all positive',   values: { numbers: '4, 2, 7' } },
        { id: 'empty', label: 'empty list',     values: { numbers: '' } },
      ],
    },
    {
      id: 'nested',
      label: 'nested loops',
      blurb: 'break inside the inner loop ends only the inner loop — the outer loop still runs all three rows.',
      params: [{ name: 'stop_at', type: 'int', hint: 'inner j that breaks', input: 'number' }],
      template: 'pairs = []\nfor i in range(3):\n    for j in range(3):\n        if j == {$stop_at}:\n            break\n        pairs.append((i, j))\npairs',
      cases: [
        { id: 'one',   label: 'j == 1', values: { stop_at: '1' } },
        { id: 'two',   label: 'j == 2', values: { stop_at: '2' } },
        { id: 'zero',  label: 'j == 0', values: { stop_at: '0' } },
        { id: 'never', label: 'never',  values: { stop_at: '5' } },
      ],
    },
  ],
  demoExplainer: 'In the break tab, everything from the first negative on is missing — the negative itself too, because break comes before append. In the break skips else tab, "else" appears only when no break happened, which includes the empty list. In the nested loops tab, every row i = 0, 1, 2 shows up: break stopped the inner j loop each time, never the outer one.',

  patterns: [
    {
      name: 'First match with a not-found branch',
      desc: 'for / else replaces a found flag.',
      code: 'def find_admin(users):\n    for user in users:\n        if user.is_admin:\n            break\n    else:\n        return None\n    return user',
    },
    {
      name: 'Loop and a half',
      desc: 'while True with the exit test in the middle.',
      code: 'def ask_number(prompt):\n    while True:\n        text = input(prompt)\n        if text.isdigit():\n            break\n        print("digits only")\n    return int(text)',
    },
    {
      name: 'Leave nested loops with return',
      desc: 'Put the loops in a function — return exits all of them at once.',
      code: 'def find(grid, target):\n    for r, row in enumerate(grid):\n        for c, cell in enumerate(row):\n            if cell == target:\n                return r, c\n    return None',
    },
    {
      name: 'First match without a loop',
      desc: 'next() with a generator and a default does the search-and-stop in one expression.',
      code: 'def first_negative(nums):\n    return next((n for n in nums if n < 0), None)',
    },
  ],

  examples: [
    { title: 'Stop at the first match',            code: "for w in ['a', 'bb', 'ccc']:\n    if len(w) > 1:\n        print('found', w)\n        break", returns: 'found bb' },
    { title: 'Code after break never runs',        code: "for i in range(3):\n    break\n    print('unreachable')\ni", returns: '0' },
    { title: 'Leaving while True',                 code: 'n = 0\nwhile True:\n    n += 1\n    if n == 3:\n        break\nn',         returns: '3' },
    { title: 'break skips the else block',         code: "for x in [1, 2, 3]:\n    if x == 2:\n        break\nelse:\n    print('no break')\nx", returns: '2' },
    { title: 'Only the innermost loop ends',       code: "for i in range(2):\n    for j in range(5):\n        break\n    print('outer', i)", returns: 'outer 0\nouter 1' },
    { title: 'finally still runs on break',        code: "for i in range(3):\n    try:\n        break\n    finally:\n        print('cleanup', i)", returns: 'cleanup 0' },
    { title: 'break outside a loop',               code: "compile('break', '<demo>', 'exec')", returns: "SyntaxError: 'break' outside loop" },
  ],

  pitfalls: [
    {
      name: 'Expecting break to leave both loops',
      desc: 'Python has no labelled break. The inner break ends the inner loop and the outer one carries on. Move the loops into a function and return, or use a flag.',
      wrong: { label: 'inner break', code: 'hits = []\nfor i in range(3):\n    for j in range(3):\n        if i + j == 1:\n            hits.append((i, j))\n            break\nhits', output: '[(0, 1), (1, 0)]' },
      fix:   { label: 'return from a function', code: 'def first_hit():\n    for i in range(3):\n        for j in range(3):\n            if i + j == 1:\n                return (i, j)\nfirst_hit()', output: '(0, 1)' },
    },
    {
      name: 'break inside a nested function',
      desc: 'A def starts a new body; a loop outside it does not count. The code is rejected at compile time.',
      wrong: { label: 'break in a callback', code: "compile('for x in y:\\n    def cb():\\n        break', '<demo>', 'exec')", output: "SyntaxError: 'break' outside loop" },
      fix:   { label: 'return a signal', code: 'def cb(x):\n    return x > 1\nfor x in [1, 2, 3]:\n    if cb(x):\n        break\nx', output: '2' },
    },
    {
      name: 'Ending a case with break out of C / JavaScript habit',
      desc: 'match / case (and if / elif) never fall through, so they need no break. Inside a loop, that break leaves the whole loop.',
      wrong: { label: 'break after each case', code: "log = []\nfor cmd in ['go', 'stop', 'go']:\n    match cmd:\n        case 'go':\n            log.append('moving')\n            break\n        case 'stop':\n            log.append('halt')\nlog", output: "['moving']" },
      fix:   { label: 'no break needed', code: "log = []\nfor cmd in ['go', 'stop', 'go']:\n    match cmd:\n        case 'go':\n            log.append('moving')\n        case 'stop':\n            log.append('halt')\nlog", output: "['moving', 'halt', 'moving']" },
    },
  ],

  when: {
    use: [
      'Stopping a search at the first match',
      'Leaving a while True loop when its work is done',
      'Bailing out of a loop on an error condition you handle right after it',
    ],
    avoid: [
      'Leaving several nested loops → return from a function',
      'Skipping one item and carrying on → continue',
      'A search that just returns the match → next(generator, default) or any()',
    ],
  },

  notes: {
    cpython:      'Compiled to a jump past the loop’s end; any enclosing try / finally or with blocks inside the loop are unwound first',
    'Labels':     'There is no break label / break 2. PEP 3136 (labelled break and continue) was rejected',
    'finally':    'break inside try runs the finally block before leaving the loop',
  },

  related: [
    { name: 'continue', slug: 'continue', when: 'Skip to the next iteration instead of leaving' },
    { name: 'for',      slug: 'for',      when: 'for / else — else runs when no break happened' },
    { name: 'while',    slug: 'while',    when: 'while True loops that need a break' },
    { name: 'return',   slug: 'return',   when: 'Leave all loops at once from inside a function' },
    { name: 'next()',   slug: 'next',     when: 'First match without an explicit loop', category: 'functions' },
    { name: 'SyntaxError', slug: 'syntaxerror', when: "'break' outside loop", category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I break out of two nested loops in Python?',
      a: 'There is no labelled break. The cleanest way is to move the loops into a function and return. Alternatives: set a flag and check it after the inner loop, use for / else on the inner loop with continue / break, or flatten the loops with itertools.product so a single break is enough.',
    },
    {
      q: 'Does break exit an if statement?',
      a: 'No — if is not a loop. break always exits the nearest enclosing for or while; the if around it is just how you decide when. A break in an if that is not inside any loop is a SyntaxError.',
    },
    {
      q: 'Does the else block run after break?',
      a: 'No. A loop’s else runs only when the loop ended without break — the for ran out of items or the while condition became false.',
    },
    {
      q: 'What is the difference between break, continue and pass?',
      a: 'break leaves the loop; continue skips the rest of the current iteration and moves to the next one; pass does nothing at all and only fills a spot where a statement is required.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-break-statement',
    meta:  'The break statement',
  },
};
