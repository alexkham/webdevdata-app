// content/reference/python/keywords/continue.js

export const meta = {
  slug:        'continue',
  name:        'continue',
  signature:   'continue',
  blurb:       'Skip the rest of the current loop iteration and go straight to the next one.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'continue statement skip iteration next iteration skip item loop for while continue vs break continue vs pass keyword',
};

export const method = {
  slug:      'continue',
  name:      'continue',
  signature: 'continue',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'continue abandons the current pass through the loop body: for moves on to the next item, while goes back to re-test its condition. The loop itself keeps running.',

  covers: ['continue'],

  syntax: [
    { label: 'continue in for', code: 'for x in items:\n    if skip(x):\n        continue\n    use(x)' },
    { label: 'continue in while', code: 'while i < n:\n    i += 1  # update first!\n    if skip(i):\n        continue\n    use(i)' },
  ],

  cheat: {
    useFor:    'skip blanks / invalid rows / items you do not care about',
    result:    'a statement — jumps to the next iteration of the innermost loop',
    pairsWith: 'for, while, if, break',
    watchOut:  'in while, anything below continue is skipped — including your i += 1',
  },

  parameters: [
    { name: '(none)', type: 'statement', required: false, default: null, desc: 'continue takes no operand and no label. It must be inside a for or while body (not in a nested def or class); it affects only the innermost loop.' },
  ],

  modes: [
    {
      id: 'for',
      label: 'continue in for',
      blurb: 'Odd numbers are skipped with continue, even ones are used. The log shows every iteration and what happened in it.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'log = []\nfor n in {$numbers}:\n    if n % 2:\n        log.append(f"skip {n}")\n        continue\n    log.append(f"use {n}")\nlog',
      cases: [
        { id: 'mixed', label: '1 to 6',     values: { numbers: '1, 2, 3, 4, 5, 6' } },
        { id: 'neg',   label: 'negatives',  values: { numbers: '-3, -4' } },
        { id: 'float', label: 'with float', values: { numbers: '2.5, 4' } },
        { id: 'empty', label: 'empty list', values: { numbers: '' } },
      ],
    },
    {
      id: 'while',
      label: 'continue in while',
      blurb: 'Skip empty entries while walking by index. The index is advanced BEFORE the continue — otherwise the loop would stick on the first blank forever.',
      params: [{ name: 'items', type: 'list', hint: 'comma-separated, blanks allowed', input: 'csv' }],
      template: 'items = {$items}\ni = 0\nkept = []\nwhile i < len(items):\n    item = items[i]\n    i += 1\n    if not item:\n        continue\n    kept.append(item)\nkept',
      cases: [
        { id: 'blanks', label: 'with blanks', values: { items: 'a, , b, , c' } },
        { id: 'all',    label: 'no blanks',   values: { items: 'x, y' } },
        { id: 'only',   label: 'only blanks', values: { items: ', ,' } },
      ],
    },
  ],
  demoExplainer: 'In the for tab, every number appears exactly once — as "skip" or "use", never both, because continue jumps past the second append. Negative odd numbers are skipped too: -3 % 2 is 1 in Python, not -1. 2.5 % 2 is 0.5, which is truthy, so 2.5 counts as odd. In the while tab, blank entries vanish; the i += 1 sits above the continue, so every pass moves forward.',

  patterns: [
    {
      name: 'Skip blanks and comments',
      desc: 'Filter early with continue, keep the main work unindented.',
      code: 'def parse(lines):\n    for line in lines:\n        line = line.strip()\n        if not line or line.startswith("#"):\n            continue\n        yield line.split("=", 1)',
    },
    {
      name: 'Guard clauses inside a loop',
      desc: 'Several continue checks instead of one deeply nested if.',
      code: 'def active_emails(users):\n    for user in users:\n        if not user.active:\n            continue\n        if not user.email:\n            continue\n        yield user.email',
    },
    {
      name: 'Or just filter',
      desc: 'When the loop only collects, a comprehension with if replaces continue.',
      code: 'def non_empty(items):\n    return [x for x in items if x]',
    },
  ],

  examples: [
    { title: 'Skip one item',                code: 'for n in range(5):\n    if n == 2:\n        continue\n    print(n)',                         returns: '0\n1\n3\n4' },
    { title: 'Skip blanks',                  code: "for word in ['a', '', 'b']:\n    if not word:\n        continue\n    print(word)",           returns: 'a\nb' },
    { title: 'continue does not stop the loop', code: 'count = 0\nfor n in range(10):\n    count += 1\n    continue\ncount',                   returns: '10' },
    { title: 'continue in while re-tests the condition', code: 'i = 0\nwhile i < 5:\n    i += 1\n    if i % 2:\n        continue\n    print(i)', returns: '2\n4' },
    { title: 'Only the innermost loop',      code: "for i in range(2):\n    for j in range(3):\n        if j == 1:\n            continue\n        print(i, j)", returns: '0 0\n0 2\n1 0\n1 2' },
    { title: 'continue does not skip else',  code: "for n in [1, 2]:\n    continue\nelse:\n    print('else runs')",                              returns: 'else runs' },
    { title: 'finally runs on continue',     code: "for i in range(2):\n    try:\n        continue\n    finally:\n        print('finally', i)",         returns: 'finally 0\nfinally 1' },
    { title: 'continue outside a loop',      code: "compile('continue', '<demo>', 'exec')",                                             returns: "SyntaxError: 'continue' not properly in loop" },
  ],

  pitfalls: [
    {
      name: 'continue before the update in a while loop',
      desc: 'continue skips everything below it — here the i += 1 — so i stays at 2 and the loop never finishes. (A safety cap is added so the snippet ends.)',
      wrong: { label: 'increment at the bottom', code: 'i = 0\nseen = []\npasses = 0\nwhile i < 4:\n    passes += 1\n    if passes > 10:  # safety cap\n        break\n    if i == 2:\n        continue\n    seen.append(i)\n    i += 1\n(seen, i)', output: '([0, 1], 2)' },
      fix:   { label: 'or use for',             code: 'seen = []\nfor i in range(4):\n    if i == 2:\n        continue\n    seen.append(i)\nseen', output: '[0, 1, 3]' },
    },
    {
      name: 'Using continue where you meant pass',
      desc: 'pass does nothing and the code below still runs; continue skips it. They are not interchangeable placeholders.',
      wrong: { label: 'continue as "do nothing"', code: "out = []\nfor n in [1, -2, 3]:\n    if n < 0:\n        continue  # TODO handle negatives\n    out.append(n)\nout", output: '[1, 3]' },
      fix:   { label: 'pass keeps the rest',      code: "out = []\nfor n in [1, -2, 3]:\n    if n < 0:\n        pass  # TODO handle negatives\n    out.append(n)\nout", output: '[1, -2, 3]' },
    },
    {
      name: 'Expecting continue to move the outer loop',
      desc: 'continue restarts only the innermost loop. To skip to the next outer item, break out of the inner loop (and use for / else if needed).',
      wrong: { label: 'continue in the inner loop', code: "rows = [[1, -1, 2], [3, 4]]\ntotals = []\nfor row in rows:\n    total = 0\n    for x in row:\n        if x < 0:\n            continue  # meant: skip this row\n        total += x\n    totals.append(total)\ntotals", output: '[3, 7]' },
      fix:   { label: 'break + for / else',         code: "rows = [[1, -1, 2], [3, 4]]\ntotals = []\nfor row in rows:\n    total = 0\n    for x in row:\n        if x < 0:\n            break\n        total += x\n    else:\n        totals.append(total)\ntotals", output: '[7]' },
    },
  ],

  when: {
    use: [
      'Skipping items that fail a check while the loop does real work on the rest',
      'Flattening nested ifs in a long loop body into guard clauses',
    ],
    avoid: [
      'A loop that only filters and collects → a comprehension with if',
      'Stopping the loop entirely → break',
      'A placeholder that should do nothing → pass',
    ],
  },

  notes: {
    cpython:      'In a for loop, continue jumps back to FOR_ITER (fetch the next item); in a while loop, back to the condition test',
    'finally':    'continue inside try runs the finally block first; continue directly inside a finally clause is allowed since Python 3.8',
    'else':       'continue never cancels a loop’s else — only break does',
  },

  related: [
    { name: 'break', slug: 'break', when: 'Leave the loop instead of skipping one pass' },
    { name: 'pass',  slug: 'pass',  when: 'Do nothing and carry on' },
    { name: 'for',   slug: 'for',   when: 'The loop continue most often lives in' },
    { name: 'while', slug: 'while', when: 'Where continue can skip your increment' },
    { name: 'filter()', slug: 'filter', when: 'Keep matching items without a loop', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between break and continue?',
      a: 'break ends the whole loop; continue ends only the current iteration and the loop goes on with the next item (for) or the next condition check (while).',
    },
    {
      q: 'What is the difference between continue and pass?',
      a: 'pass is a no-op: execution simply goes on to the next line of the body. continue jumps to the next iteration, so the rest of the body is skipped. Swapping one for the other changes what the loop does.',
    },
    {
      q: 'Why does my while loop with continue never end?',
      a: 'The update of the loop variable is below the continue, so when continue fires the variable never changes and the condition stays true. Move the update above the continue, or rewrite the loop as a for over range().',
    },
    {
      q: 'Can I use continue in a list comprehension?',
      a: 'No — a comprehension holds an expression, not statements. Put the skip condition in its if clause instead: [x for x in items if keep(x)].',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-continue-statement',
    meta:  'The continue statement',
  },
};
