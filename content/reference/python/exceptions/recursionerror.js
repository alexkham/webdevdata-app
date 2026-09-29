// content/reference/python/exceptions/recursionerror.js

export const meta = {
  slug:        'recursionerror',
  name:        'RecursionError',
  signature:   'RecursionError(*args)',
  blurb:       'Raised when the call stack gets deeper than sys.getrecursionlimit() — almost always a recursive function that never reaches its base case.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'recursionerror recursion error maximum recursion depth exceeded while calling a python object getrecursionlimit setrecursionlimit base case infinite recursion stack overflow',
};

export const method = {
  slug:      'recursionerror',
  name:      'RecursionError',
  signature: 'RecursionError(*args)',

  category:    'Runtime exception',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'Python caps stack depth (1000 frames by default) instead of crashing; hitting the cap nearly always means a base case your input never reaches.',

  chain: ['BaseException', 'Exception', 'RuntimeError', 'RecursionError'],

  cheat: {
    raisedBy: 'recursion with no reachable base case; self-referencing __getattr__/property; very deep nested data',
    message:  'maximum recursion depth exceeded',
    quickFix: 'fix the base case, or rewrite as a loop',
    watchOut: 'raising the limit only moves the crash',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message. The interpreter passes one string; str(e) is that string.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Count digits by recursing on n // 10 until n == 0. Try a negative number.',
      params: [{ name: 'n', type: 'int', hint: 'number to measure', input: 'number' }],
      template: "def digits(n):\n    if n == 0:\n        return 0\n    return 1 + digits(n // 10)\ndigits({$n})",
      cases: [
        { id: 'pos',  label: 'positive', values: { n: '2024' } },
        { id: 'zero', label: 'zero',     values: { n: '0' } },
        { id: 'neg',  label: 'negative', values: { n: '-5' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catching it is possible — the stack is unwound by the time except runs — but it only reports the bug.',
      params: [{ name: 'n', type: 'int', hint: 'number to measure', input: 'number' }],
      template: "def digits(n):\n    if n == 0:\n        return 0\n    return 1 + digits(n // 10)\ntry:\n    r = digits({$n})\nexcept RecursionError:\n    r = 'never reached the base case'\nr",
      cases: [
        { id: 'pos', label: 'positive', values: { n: '12345' } },
        { id: 'neg', label: 'negative', values: { n: '-42' } },
      ],
    },
  ],
  demoExplainer: "Positive numbers shrink to 0 in a few steps. Negative ones never do: // rounds toward minus infinity, so -5 // 10 is -1 and -1 // 10 is -1 again — the function calls itself forever until the 1000-frame limit stops it. The base case exists; the input just cannot reach it. The fix is in the pitfalls below.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: "The message tuple — e.g. ('maximum recursion depth exceeded',)." },
    { name: '__traceback__', type: 'traceback', meaning: 'Very long: the same frame repeated. Python collapses it to "[Previous line repeated N more times]" when printing.' },
  ],

  patterns: [
    {
      name: 'Rewrite as a loop',
      desc: 'Tail-style recursion becomes a while loop with no depth limit at all.',
      code: "def digits(n):\n    n = abs(n)\n    count = 1\n    while n >= 10:\n        n //= 10\n        count += 1\n    return count",
    },
    {
      name: 'Explicit stack for tree walks',
      desc: 'Deep trees (nested JSON, file trees, linked structures) walked with your own list instead of the call stack.',
      code: "def walk(root):\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        yield node\n        stack.extend(node.children)",
    },
    {
      name: 'Raise the limit (with care)',
      desc: 'For legitimately deep but bounded recursion only. Too high a value can crash the process with a real C stack overflow instead of a clean exception.',
      code: "import sys\nsys.setrecursionlimit(5000)",
    },
  ],

  examples: [
    { title: 'No base case at all',   code: "def countdown(n):\n    return countdown(n - 1)\ncountdown(3)", returns: 'RecursionError: maximum recursion depth exceeded' },
    { title: 'The default limit',     code: "import sys\nsys.getrecursionlimit()", returns: '1000' },
    { title: 'Property that reads itself', code: "class User:\n    @property\n    def name(self):\n        return self.name  # should be self._name\nUser().name", returns: 'RecursionError: maximum recursion depth exceeded' },
    { title: 'Deeply nested data: repr', code: "data = []\nfor _ in range(100_000):\n    data = [data]\nrepr(data)", returns: 'RecursionError: maximum recursion depth exceeded while getting the repr of an object' },
    { title: 'Deeply nested data: json', code: "import json\ndata = []\nfor _ in range(100_000):\n    data = [data]\njson.dumps(data)", returns: 'RecursionError: maximum recursion depth exceeded while encoding a JSON object' },
    { title: 'It is a RuntimeError', code: 'issubclass(RecursionError, RuntimeError)', returns: 'True' },
    { title: 'Catch it and carry on', code: "def f():\n    return f()\ntry:\n    f()\nexcept RecursionError as e:\n    msg = str(e)\nmsg", returns: "'maximum recursion depth exceeded'" },
  ],

  pitfalls: [
    {
      name: 'A base case the input can skip',
      desc: 'n == 0 is never hit for negative n with floor division (or for odd n when stepping by 2). Make the base case cover everything the input can be.',
      wrong: { label: 'n == 0', code: "def digits(n):\n    if n == 0:\n        return 0\n    return 1 + digits(n // 10)\ndigits(-5)", output: 'RecursionError: maximum recursion depth exceeded' },
      fix:   { label: 'Normalize first', code: "def digits(n):\n    n = abs(n)\n    if n < 10:\n        return 1\n    return 1 + digits(n // 10)\ndigits(-5)", output: '1' },
    },
    {
      name: '__getattr__ that touches a missing attribute',
      desc: '__getattr__ runs for every failed lookup — including the ones it makes itself. Read from self.__dict__ directly inside it.',
      wrong: { label: 'self.data', code: "class Config:\n    def __getattr__(self, name):\n        return self.data[name]\nConfig().port", output: 'RecursionError: maximum recursion depth exceeded' },
      fix:   { label: 'self.__dict__', code: "class Config:\n    def __getattr__(self, name):\n        data = self.__dict__.get('data', {})\n        if name in data:\n            return data[name]\n        raise AttributeError(name)\nc = Config()\nc.data = {'port': 80}\nc.port", output: '80' },
    },
    {
      name: '__setattr__ that assigns through itself',
      desc: 'self.x = v inside __setattr__ calls __setattr__ again. Delegate to object.__setattr__ (or super()).',
      wrong: { label: 'setattr(self, …)', code: "class Point:\n    def __init__(self):\n        self.x = 0\n    def __setattr__(self, name, value):\n        setattr(self, name, value)\nPoint()", output: 'RecursionError: maximum recursion depth exceeded' },
      fix:   { label: 'super().__setattr__', code: "class Point:\n    def __init__(self):\n        self.x = 0\n    def __setattr__(self, name, value):\n        super().__setattr__(name, value)\nPoint().x", output: '0' },
    },
  ],

  when: {
    use: [
      'Catching it at a boundary to report "input too deeply nested" for untrusted data',
      'Recognising it in a traceback as "this recursion has no reachable end"',
    ],
    avoid: [
      'Using the exception as control flow for normal inputs',
      'Silencing it with sys.setrecursionlimit(10**6) — the process can segfault instead',
      'Recursion over unbounded input (linked lists, user-provided nesting) → loop with an explicit stack',
    ],
  },

  notes: {
    cpython:        'Since 3.12 sys.getrecursionlimit() applies only to Python code; C-level recursion (repr, json, comparisons of nested data) is guarded by a separate mechanism',
    'Catch via':    'except RuntimeError also catches it (RecursionError subclasses RuntimeError)',
    'No TCO':       'CPython does not eliminate tail calls, so return f(n - 1) still uses one frame per step',
  },

  related: [
    { name: 'RuntimeError',   slug: 'runtimeerror',   when: 'Its base class — what was raised before 3.5' },
    { name: 'MemoryError',    slug: 'memoryerror',    when: 'The other "resource ran out" error' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a correct __getattr__ should raise' },
    { name: 'repr()',         slug: 'repr',           when: 'Also recursive on nested containers', category: 'functions' },
    { name: 'floor division', slug: 'floordiv',       when: 'Rounds toward minus infinity — why -1 // 10 is -1', category: 'operators' },
  ],

  faq: [
    {
      q: 'How do I fix "RecursionError: maximum recursion depth exceeded"?',
      a: 'Find the frame that repeats in the traceback and ask why the base case is not reached for this input: a missing base case, a step that does not move toward it (negative numbers, odd numbers stepping by 2), or an attribute hook (__getattr__, __setattr__, a property) that calls itself. If the recursion is genuinely deep but finite — walking a big tree or deeply nested data — rewrite it as a loop with an explicit stack.',
    },
    {
      q: 'Why does my error say "while calling a Python object" or "while getting the repr of an object"?',
      a: 'The suffix names the C-level operation that noticed the limit. Python 3.13 prints plain "maximum recursion depth exceeded" for a recursive def; repr(), json.dumps() and comparisons of deeply nested data add "while getting the repr of an object", "while encoding a JSON object", "in comparison". "while calling a Python object" is what older versions (Python 3.10, for example) print when the limit is hit during a call that goes through C — instantiating a class inside its own __init__, a recursive __call__, an lru_cache-wrapped function; 3.13 prints the plain message for those. The fix is the same.',
    },
    {
      q: 'Should I just increase sys.setrecursionlimit()?',
      a: 'Only for recursion you know is bounded and only slightly deeper than 1000. The limit protects the real C stack: set it too high and deep recursion can crash the interpreter with a segmentation fault instead of a catchable exception. For infinite recursion, raising the limit only delays the same error.',
    },
    {
      q: 'Does Python do tail-call optimization?',
      a: 'No. CPython keeps a frame for every call, including return f(n - 1), so a recursion of depth 10 000 needs 10 000 frames regardless of style. Convert such functions to loops.',
    },
    {
      q: 'What is the default recursion limit?',
      a: '1000, returned by sys.getrecursionlimit(). The frames already on the stack (the REPL, your caller, a test runner) count too, so the depth your function reaches before the error is a little under 1000 and varies by context.',
    },
  ],

  history: [
    { version: '3.5', note: 'Added. Previously a plain RuntimeError was raised.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#RecursionError',
    meta:  'Built-in exceptions',
  },

  tryInTool: [
    { name: 'JSON Tree', href: '/tools/json-tree', meta: 'See how deeply a payload is nested' },
  ],
};
