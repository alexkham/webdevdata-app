// content/reference/python/keywords/while.js

export const meta = {
  slug:        'while',
  name:        'while',
  signature:   'while condition:',
  blurb:       'Repeat a block for as long as a condition stays truthy — including while True loops that exit with break.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'while loop while true while else infinite loop condition loop until break do while repeat keyword',
};

export const method = {
  slug:      'while',
  name:      'while',
  signature: 'while condition:',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The condition is re-checked before every pass. Nothing changes it for you — if the body never makes it false (or breaks), the loop runs forever.',

  covers: ['while'],

  syntax: [
    { label: 'while', code: 'while condition:\n    body' },
    { label: 'while / else', code: 'while condition:\n    body      # may break\nelse:\n    no_break  # condition went false' },
    { label: 'while True + break', code: 'while True:\n    step\n    if done:\n        break' },
  ],

  cheat: {
    useFor:    'while n > 0: / while True: … break / while queue:',
    result:    'a statement — no value; runs 0 or more times',
    pairsWith: 'break, continue, else, if',
    watchOut:  'update the loop variable on every path; use for when you loop over items',
  },

  parameters: [
    { name: 'condition', type: 'expression', required: true,  default: null, desc: 'Evaluated before each iteration, truthiness rules as in if. False on the first check → the body never runs.' },
    { name: 'body',      type: 'block',      required: true,  default: null, desc: 'Must eventually make the condition false, or leave with break / return / an exception.' },
    { name: 'else',      type: 'block',      required: false, default: null, desc: 'Runs once when the condition turns false — skipped if the loop was left with break.' },
  ],

  modes: [
    {
      id: 'while',
      label: 'while',
      blurb: 'Halve a number until it reaches 0. The condition is checked before every pass — a start at 0 or below never enters the loop.',
      params: [{ name: 'n', type: 'int', hint: 'a whole number', input: 'number' }],
      template: 'n = {$n}\nsteps = []\nwhile n > 0:\n    steps.append(n)\n    n //= 2\nsteps',
      cases: [
        { id: 'hundred', label: '100',        values: { n: '100' } },
        { id: 'pow',     label: '64',         values: { n: '64' } },
        { id: 'one',     label: '1',          values: { n: '1' } },
        { id: 'zero',    label: '0',          values: { n: '0' } },
        { id: 'neg',     label: '-8',         values: { n: '-8' } },
      ],
    },
    {
      id: 'else',
      label: 'while / else',
      blurb: 'Up to three attempts. else runs only when the loop ran out of attempts — a break skips it.',
      params: [{ name: 'succeed_on', type: 'int', hint: 'attempt that succeeds', input: 'number' }],
      template: 'attempts = 0\nwhile attempts < 3:\n    attempts += 1\n    if attempts == {$succeed_on}:\n        result = f"ok on try {attempts}"\n        break\nelse:\n    result = "gave up after 3 tries"\nresult',
      cases: [
        { id: 'first', label: 'try 1',  values: { succeed_on: '1' } },
        { id: 'third', label: 'try 3',  values: { succeed_on: '3' } },
        { id: 'never', label: 'try 5',  values: { succeed_on: '5' } },
        { id: 'zero',  label: '0',      values: { succeed_on: '0' } },
      ],
    },
    {
      id: 'true',
      label: 'while True',
      blurb: 'Take items until "stop". while True has no exit of its own — without a stop item, pop() eventually fails on an empty list.',
      params: [{ name: 'queue', type: 'list', hint: 'comma-separated', input: 'csv' }],
      template: 'queue = {$queue}\ntaken = []\nwhile True:\n    item = queue.pop(0)\n    if item == "stop":\n        break\n    taken.append(item)\ntaken',
      cases: [
        { id: 'stop',   label: 'has "stop"',  values: { queue: 'a, b, stop, c' } },
        { id: 'first',  label: '"stop" first', values: { queue: 'stop, a' } },
        { id: 'nostop', label: 'no "stop"',   values: { queue: 'a, b' } },
        { id: 'empty',  label: 'empty',       values: { queue: '' } },
      ],
    },
  ],
  demoExplainer: 'In the while tab, 0 and negative numbers give an empty list: the test n > 0 is false before the first pass, so the body never runs. In the while / else tab, 0 and 5 never match an attempt, the condition attempts < 3 goes false, and else runs; any break jumps past it. In the while True tab, the loop only ends at "stop" — with no stop item, the loop keeps popping until the list is empty and pop raises IndexError, which is how an unguarded while True fails when the exit never comes.',

  patterns: [
    {
      name: 'Process until empty',
      desc: 'A non-empty list / deque is truthy, so while queue: stops when it is drained.',
      code: 'from collections import deque\n\ndef drain(queue: deque):\n    while queue:\n        item = queue.popleft()\n        print(item)',
    },
    {
      name: 'Loop and a half',
      desc: 'Python has no do-while; while True with a break in the middle runs the first step unconditionally.',
      code: 'def read_chunks(f, size=4096):\n    while True:\n        chunk = f.read(size)\n        if not chunk:\n            break\n        yield chunk',
    },
    {
      name: 'Walrus in the condition (3.8+)',
      desc: 'Assign and test in one step instead of repeating the call before and inside the loop.',
      code: 'def read_chunks(f, size=4096):\n    while (chunk := f.read(size)):\n        yield chunk',
    },
    {
      name: 'Bounded retry with while / else',
      desc: 'else handles "all attempts failed" without a flag variable.',
      code: 'def fetch(try_once, attempts=3):\n    while attempts > 0:\n        attempts -= 1\n        if (result := try_once()) is not None:\n            break\n    else:\n        raise TimeoutError("no result")\n    return result',
    },
  ],

  examples: [
    { title: 'Count down',                    code: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1',                                  returns: '3\n2\n1' },
    { title: 'False at the start → 0 passes', code: "n = 0\nwhile n > 0:\n    print('never')\nn",                                 returns: '0' },
    { title: 'Digits of a number',            code: 'n = 4096\ndigits = 0\nwhile n:\n    n //= 10\n    digits += 1\ndigits',       returns: '4' },
    { title: 'Drain a list (non-empty is truthy)', code: 'stack = [1, 2, 3]\nwhile stack:\n    print(stack.pop())',                  returns: '3\n2\n1' },
    { title: 'while True with break',         code: 'n = 1\nwhile True:\n    n *= 2\n    if n > 50:\n        break\nn',                 returns: '64' },
    { title: 'else runs when the condition goes false', code: "i = 0\nwhile i < 2:\n    i += 1\nelse:\n    print('done at', i)", returns: 'done at 2' },
    { title: 'break skips else',              code: "i = 0\nwhile i < 5:\n    i += 1\n    if i == 2:\n        break\nelse:\n    print('not printed')\ni", returns: '2' },
  ],

  pitfalls: [
    {
      name: 'Off-by-one with <= len()',
      desc: 'Valid indexes stop at len - 1. <= walks one step past the end.',
      wrong: { label: 'i <= len(items)', code: "items = ['a', 'b', 'c']\ni = 0\nwhile i <= len(items):\n    print(items[i])\n    i += 1", output: 'a\nb\nc\nIndexError: list index out of range' },
      fix:   { label: 'i < len(items)',  code: "items = ['a', 'b', 'c']\ni = 0\nwhile i < len(items):\n    print(items[i])\n    i += 1", output: 'a\nb\nc' },
    },
    {
      name: 'An exact float test that never becomes true',
      desc: '0.1 is not exact in binary, so adding it ten times gives 0.9999999999999999, and x != 1.0 stays true forever. (A safety cap is added here so the snippet ends.) Count with an integer instead.',
      wrong: { label: 'x != 1.0', code: 'x = 0.0\nsteps = 0\nwhile x != 1.0:\n    x += 0.1\n    steps += 1\n    if steps == 50:  # safety cap\n        break\n(steps, x)', output: '(50, 4.999999999999998)' },
      fix:   { label: 'integer counter', code: 'steps = 0\nwhile steps < 10:\n    steps += 1\n    x = steps / 10\n(steps, x)', output: '(10, 1.0)' },
    },
    {
      name: 'continue before the update',
      desc: 'continue jumps straight back to the condition, skipping everything below it — including the increment. (Capped here; without the cap it never ends.)',
      wrong: { label: 'increment at the bottom', code: 'i = 0\nseen = []\npasses = 0\nwhile i < 4:\n    passes += 1\n    if passes > 10:  # safety cap\n        break\n    if i == 2:\n        continue\n    seen.append(i)\n    i += 1\n(seen, i)', output: '([0, 1], 2)' },
      fix:   { label: 'increment first',         code: 'i = 0\nseen = []\nwhile i < 4:\n    i += 1\n    if i == 2:\n        continue\n    seen.append(i)\nseen', output: '[1, 3, 4]' },
    },
    {
      name: 'while over indexes instead of for',
      desc: 'A manual index is extra state to get wrong. When you walk a collection, for does the counting.',
      wrong: { label: 'manual index', code: "names = ['Ann', 'Bo']\ni = 0\nout = []\nwhile i < len(names):\n    out.append(names[i].upper())\n    i += 1\nout", output: "['ANN', 'BO']" },
      fix:   { label: 'for loop',     code: "names = ['Ann', 'Bo']\nout = []\nfor name in names:\n    out.append(name.upper())\nout", output: "['ANN', 'BO']" },
    },
  ],

  when: {
    use: [
      'Repeating until a condition changes — input is valid, a queue is empty, a value converges',
      'Loops where the number of passes is not known in advance',
      'Event / retry loops written as while True with break',
    ],
    avoid: [
      'Walking the items of a list, string, dict or file → for',
      'Counting a fixed number of times → for i in range(n)',
      'Waiting for time to pass in a busy loop → time.sleep or an event',
    ],
  },

  notes: {
    cpython:      'The condition is re-evaluated at the top of every pass; while True is compiled without any test at all',
    'do-while':   'Python has no do-while; while True: … if not cond: break runs the body at least once',
    'Interrupt':  'A runaway loop in a terminal is stopped with Ctrl+C, which raises KeyboardInterrupt inside it',
  },

  related: [
    { name: 'for',      slug: 'for',      when: 'Loop over the items of an iterable' },
    { name: 'break',    slug: 'break',    when: 'Leave the loop early (skips else)' },
    { name: 'continue', slug: 'continue', when: 'Jump back to the condition' },
    { name: 'if',       slug: 'if',       when: 'Same truthiness rules for the condition' },
    { name: ':=',       slug: 'walrus',   when: 'Assign inside the while condition', category: 'operators' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'What Ctrl+C raises in a runaway loop', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I stop an infinite while loop?',
      a: 'In code: give it an exit — a condition that the body eventually makes false, or a break. At the terminal: Ctrl+C raises KeyboardInterrupt and ends the program (unless the loop catches it with a bare except, which is one more reason not to write those).',
    },
    {
      q: 'Does Python have a do-while loop?',
      a: 'No. Write while True: with the body first and if not condition: break at the end — the body then always runs at least once.',
    },
    {
      q: 'What does else do on a while loop?',
      a: 'It runs once when the condition is found false — including when it was false from the start. It is skipped if the loop was left with break, return, or an exception. Typical use: a search or retry loop where else handles "not found" / "gave up".',
    },
    {
      q: 'Should I use for or while?',
      a: 'for when you walk over items or count a known number of times; while when you loop until something changes and cannot say in advance how many passes it takes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-while-statement',
    meta:  'The while statement',
  },
};
