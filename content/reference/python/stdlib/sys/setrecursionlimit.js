// content/reference/python/stdlib/sys/setrecursionlimit.js

export const meta = {
  slug:        'setrecursionlimit',
  name:        'sys.setrecursionlimit / getrecursionlimit',
  signature:   'sys.setrecursionlimit(limit) · sys.getrecursionlimit()',
  blurb:       'The maximum depth of the Python call stack — 1000 by default. Deeper recursion raises RecursionError instead of crashing the process.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All versions',
  searchTerms: 'sys.setrecursionlimit setrecursionlimit sys.getrecursionlimit getrecursionlimit recursion limit python maximum recursion depth exceeded recursionerror increase recursion limit default 1000 deep recursion',
};

export const method = {
  slug:      'setrecursionlimit',
  name:      'sys.setrecursionlimit / getrecursionlimit',
  signature: 'sys.setrecursionlimit(limit) · sys.getrecursionlimit()',
  returns:   { type: 'None · int', desc: 'setrecursionlimit returns None; getrecursionlimit returns the current limit.' },

  category:    'sys function',
  version:     'All versions',
  hasLiveDemo: true,

  subtitle: 'A safety net, not a tuning knob: the limit turns runaway recursion into a catchable RecursionError. Raise it for a known-deep algorithm, restore it afterwards — or better, rewrite the recursion as a loop.',

  covers: ['setrecursionlimit', 'getrecursionlimit'],

  cheat: {
    commonCall: 'sys.setrecursionlimit(10_000)',
    returns:    'None — the new limit applies to the whole interpreter',
    replaces:   'Nothing; there is no per-function limit',
    watchOut:   'Too high can crash the process instead of raising RecursionError',
  },

  parameters: [
    { name: 'limit', type: 'int', required: true, default: null, desc: 'New maximum depth, at least 1 and above the current depth. Fits in a C int (at most 2147483647).' },
  ],

  modes: [
    {
      id: 'set',
      label: 'set and read back',
      blurb: 'Set a limit, read it back, and restore the old one in finally. Invalid values raise before anything changes.',
      params: [{ name: 'limit', type: 'int', hint: 'new recursion limit', input: 'number' }],
      template: 'import sys\nold = sys.getrecursionlimit()\ntry:\n    sys.setrecursionlimit({$limit})\n    result = sys.getrecursionlimit()\nfinally:\n    sys.setrecursionlimit(old)\nresult',
      cases: [
        { id: 'raise', label: '5000',  values: { limit: '5000' } },
        { id: 'zero',  label: '0',     values: { limit: '0' } },
        { id: 'neg',   label: '-10',   values: { limit: '-10' } },
        { id: 'huge',  label: '2**31', values: { limit: '2147483648' } },
      ],
    },
  ],
  demoExplainer: 'Zero and negative limits raise ValueError ("recursion limit must be greater or equal than 1"); values beyond a C int raise OverflowError. A limit at or below the depth the call is made from raises RecursionError ("cannot set the recursion limit to N at the recursion depth D: the limit is too low") — D depends on how deep the calling code already is, and the demo models a call from the top level of a script (depth 1).',

  patterns: [
    {
      name: 'Raise the limit around one deep computation',
      desc: 'Restore it so the rest of the program keeps the safety net.',
      code: 'import sys\nold = sys.getrecursionlimit()\nsys.setrecursionlimit(10_000)\ntry:\n    result = deep_recursive(tree)\nfinally:\n    sys.setrecursionlimit(old)',
    },
    {
      name: 'Replace recursion with an explicit stack',
      desc: 'No limit to worry about, and no C-stack crash.',
      code: 'def walk(root):\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        yield node\n        stack.extend(reversed(node.children))',
    },
    {
      name: 'Recover from runaway recursion',
      desc: 'RecursionError is a RuntimeError subclass and can be caught.',
      code: "try:\n    result = parse(expression)\nexcept RecursionError:\n    result = None  # input nested too deeply",
    },
  ],

  examples: [
    { title: 'The default',                 code: 'import sys\nsys.getrecursionlimit()', returns: '1000' },
    { title: 'Runaway recursion',           code: 'def f(n):\n    return f(n + 1)\nf(0)', returns: 'RecursionError: maximum recursion depth exceeded' },
    { title: 'Deep, but finite: too deep for 1000', code: 'def depth(n):\n    return 0 if n == 0 else 1 + depth(n - 1)\ndepth(3000)', returns: 'RecursionError: maximum recursion depth exceeded' },
    { title: 'Raised temporarily, it works', code: 'import sys\ndef depth(n):\n    return 0 if n == 0 else 1 + depth(n - 1)\nold = sys.getrecursionlimit()\nsys.setrecursionlimit(5000)\ntry:\n    result = depth(3000)\nfinally:\n    sys.setrecursionlimit(old)\nresult', returns: '3000' },
    { title: 'The limit must be positive',  code: 'import sys\nsys.setrecursionlimit(0)', returns: 'ValueError: recursion limit must be greater or equal than 1' },
    { title: 'RecursionError is a RuntimeError', code: 'issubclass(RecursionError, RuntimeError)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Raising the limit instead of fixing the algorithm',
      desc: 'Linear recursion over a long list needs a frame per item. A loop needs none.',
      wrong: { label: 'recursive sum', code: 'def total(xs):\n    return 0 if not xs else xs[0] + total(xs[1:])\ntotal(list(range(5000)))', output: 'RecursionError: maximum recursion depth exceeded' },
      fix:   { label: 'loop', code: 'def total(xs):\n    s = 0\n    for x in xs:\n        s += x\n    return s\ntotal(list(range(5000)))', output: '12497500' },
    },
    {
      name: 'Passing a float',
      desc: 'The limit must be an int; 1e4 is a float literal.',
      wrong: { label: '1e4', code: 'import sys\nsys.setrecursionlimit(1e4)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: '10_000', code: 'import sys\nold = sys.getrecursionlimit()\ntry:\n    sys.setrecursionlimit(10_000)\n    result = sys.getrecursionlimit()\nfinally:\n    sys.setrecursionlimit(old)\nresult', output: '10000' },
    },
  ],

  when: {
    use: [
      'A known-deep recursive algorithm (tree or parser on trusted input) that needs a few thousand frames',
      'Lowering the limit in tests to catch accidental deep recursion early',
    ],
    avoid: [
      'Linear recursion over sequences → a loop',
      'Unbounded depth from untrusted input → an explicit stack',
    ],
  },

  notes: {
    cpython:        'Python/sysmodule.c sys_setrecursionlimit_impl → Py_SetRecursionLimit; since 3.12 the limit counts Python frames only, and C code has its own separate protection',
    'Crash risk':   'The highest safe value depends on the platform and thread stack size; a limit far above it can end in a segmentation fault instead of RecursionError',
    'Threads':      'The limit is interpreter-wide; threads with small stacks (threading.stack_size) hit the C stack sooner',
    'Depth error':  'setrecursionlimit raises RecursionError if the new limit is not above the current depth (3.5.1+)',
  },

  related: [
    { name: 'RecursionError', slug: 'recursionerror', when: 'What exceeding the limit raises', category: 'exceptions' },
    { name: 'RuntimeError',   slug: 'runtimeerror',   when: 'Its base class',                category: 'exceptions' },
    { name: 'def',            slug: 'def',            when: 'Recursive functions',           category: 'keywords' },
    { name: 'sys.settrace',   slug: 'settrace',       when: 'Watch every call as it happens' },
    { name: 'sys module',     slug: 'sys',            when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the default recursion limit in Python?',
      a: '1000, as returned by sys.getrecursionlimit(). The usable depth is a little lower, because the frames already on the stack (your script, the REPL, a framework) count too.',
    },
    {
      q: 'How do I fix "RecursionError: maximum recursion depth exceeded"?',
      a: 'First check for a missing or unreachable base case — that is the usual cause. If the depth is genuine, rewrite the recursion as a loop with an explicit stack, or raise the limit with sys.setrecursionlimit() around that computation.',
    },
    {
      q: 'Is it safe to set a very high recursion limit?',
      a: 'Not always. The limit only protects you if it is reached before the real stack runs out; a huge limit can let deep recursion crash the interpreter with a segmentation fault. Raise it moderately and only where needed.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.setrecursionlimit',
    meta:  'sys.setrecursionlimit',
  },
};
