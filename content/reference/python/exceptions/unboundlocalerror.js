// content/reference/python/exceptions/unboundlocalerror.js

export const meta = {
  slug:        'unboundlocalerror',
  name:        'UnboundLocalError',
  signature:   'UnboundLocalError(*args)',
  blurb:       'Raised when a function reads a local variable before any value has been assigned to it.',
  category:    'lookup',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'unboundlocalerror unbound local error cannot access local variable where it is not associated with a value referenced before assignment global nonlocal counter += scope',
};

export const method = {
  slug:      'unboundlocalerror',
  name:      'UnboundLocalError',
  signature: 'UnboundLocalError(*args)',

  category:    'Lookup exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Any assignment to a name anywhere in a function makes it local for the whole function — so reading it before that assignment runs fails, even if a global of the same name exists.',

  chain: ['BaseException', 'Exception', 'NameError', 'UnboundLocalError'],

  cheat: {
    raisedBy: 'reading a local before assignment; x += 1 on a global',
    message:  "cannot access local variable 'x' where it is not associated with a value",
    quickFix: 'global x / nonlocal x, or pass it in and return it',
    watchOut: 'the assignment can be below the read — it still makes x local',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. Unlike NameError, e.name is not filled in (it stays None).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'kind is assigned only inside the if. When the branch is skipped, return kind reads a local that never got a value.',
      params: [{ name: 'n', type: 'int', hint: 'try 0 or a negative', input: 'number' }],
      template: "def label(n):\n    if n > 0:\n        kind = 'positive'\n    return kind\n\nlabel({$n})",
      cases: [
        { id: 'pos',  label: 'positive', values: { n: '5' } },
        { id: 'zero', label: 'zero',     values: { n: '0' } },
        { id: 'neg',  label: 'negative', values: { n: '-2' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The fix for the global-counter case: declare the name global so count += step updates the module variable instead of creating a local.',
      params: [{ name: 'step', type: 'int', hint: 'amount to add', input: 'number' }],
      template: "count = 10\n\ndef bump(step):\n    global count\n    count += step\n    return count\n\nbump({$step})",
      cases: [
        { id: 'one',  label: 'step 1',  values: { step: '1' } },
        { id: 'neg',  label: 'step -4', values: { step: '-4' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, a positive n works and 0 fails: kind is a local of label (it is assigned there), so Python never falls back to a global — it just finds the local empty. The message names the variable but not the reason; look for the paths where no assignment ran. Handle shows the other classic case fixed: without global count, count += step would raise the same error on every call.",

  attributes: [
    { name: 'args', type: 'tuple',  meaning: "args[0] is the message, e.g. \"cannot access local variable 'x' where it is not associated with a value\"." },
    { name: 'name', type: 'None',   meaning: 'Inherited from NameError but not set for UnboundLocalError — parse args[0] if you need the variable name.' },
  ],

  patterns: [
    {
      name: 'Initialise before branches',
      desc: 'Give the local a value that covers every path, including the one where no branch or loop body runs.',
      code: "def label(n):\n    kind = 'non-positive'\n    if n > 0:\n        kind = 'positive'\n    return kind",
    },
    {
      name: 'Closure counter with nonlocal',
      desc: 'nonlocal rebinds a variable of the enclosing function instead of creating a new local.',
      code: "def make_counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc",
    },
    {
      name: 'Pass in, return out',
      desc: 'Usually cleaner than global: the function gets the value as an argument and returns the new one.',
      code: "def bump(count, step):\n    return count + step\n\ncount = bump(count, 1)",
    },
  ],

  examples: [
    { title: 'Read before a later assignment', code: "x = 'global'\ndef show():\n    print(x)\n    x = 'local'\nshow()", returns: "UnboundLocalError: cannot access local variable 'x' where it is not associated with a value" },
    { title: 'Reading a global is fine',       code: "x = 'global'\ndef show():\n    return x\nshow()", returns: "'global'" },
    { title: 'Assignment only in try',          code: "def f():\n    try:\n        value = int('abc')\n    except ValueError:\n        pass\n    return value\nf()", returns: "UnboundLocalError: cannot access local variable 'value' where it is not associated with a value" },
    { title: 'Loop body never ran',             code: "def f():\n    for item in []:\n        last = item\n    return last\nf()", returns: "UnboundLocalError: cannot access local variable 'last' where it is not associated with a value" },
    { title: 'Mutating is not assigning',       code: "items = []\ndef add(v):\n    items.append(v)\n    return items\nadd(1)", returns: '[1]' },
    { title: 'But += is assigning',             code: "items = []\ndef add(v):\n    items += [v]\n    return items\nadd(1)", returns: "UnboundLocalError: cannot access local variable 'items' where it is not associated with a value" },
    { title: 'An import inside the function',   code: "import math\ndef area(r):\n    result = math.pi * r ** 2\n    import math\n    return result\narea(1)", returns: "UnboundLocalError: cannot access local variable 'math' where it is not associated with a value" },
    { title: 'Caught as NameError',             code: "try:\n    def f():\n        v += 1\n    f()\nexcept NameError as e:\n    r = (type(e).__name__, e.name)\nr", returns: "('UnboundLocalError', None)" },
  ],

  pitfalls: [
    {
      name: 'Incrementing a global counter',
      desc: 'count += 1 is count = count + 1: the assignment makes count local, and the read on the right-hand side happens first.',
      wrong: { label: 'count += step', code: "count = 10\ndef bump(step):\n    count += step\n    return count\nbump(1)", output: "UnboundLocalError: cannot access local variable 'count' where it is not associated with a value" },
      fix:   { label: 'global count',  code: "count = 10\ndef bump(step):\n    global count\n    count += step\n    return count\nbump(1)", output: '11' },
    },
    {
      name: 'Counter in a closure',
      desc: 'The same rule applies to enclosing functions. global would be wrong here — the variable lives in make_counter, so use nonlocal.',
      wrong: { label: 'n += 1',      code: "def make_counter():\n    n = 0\n    def inc():\n        n += 1\n        return n\n    return inc\nmake_counter()()", output: "UnboundLocalError: cannot access local variable 'n' where it is not associated with a value" },
      fix:   { label: 'nonlocal n',  code: "def make_counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc\nc = make_counter()\nc()\nc()", output: '2' },
    },
    {
      name: 'Shadowing a builtin inside a function',
      desc: 'Assigning to len anywhere in the function makes len local, so even the call on the right-hand side fails.',
      wrong: { label: 'len = len(...)', code: "def f():\n    len = len([1, 2])\n    return len\nf()", output: "UnboundLocalError: cannot access local variable 'len' where it is not associated with a value" },
      fix:   { label: 'Pick another name', code: "def f():\n    size = len([1, 2])\n    return size\nf()", output: '2' },
    },
  ],

  when: {
    use: [
      'You rarely catch it — it signals a scoping bug to fix',
      'except NameError already covers it when probing names dynamically',
    ],
    avoid: [
      'Updating module state → global x (or better, return the new value)',
      'Updating closure state → nonlocal x',
      'Maybe-assigned locals → initialise before the if/try/for',
    ],
  },

  notes: {
    'Compile time': "Whether a name is local is decided when the function is compiled: any assignment, augmented assignment, for target, import, del or with ... as in the body makes it local (see f.__code__.co_varnames)",
    'Older message': "Python 3.10 and earlier said local variable 'x' referenced before assignment",
    'Free variables': "If the enclosing function's variable is unbound, the error is NameError: cannot access free variable 'x' where it is not associated with a value in enclosing scope",
    'Catch via': 'except NameError catches it (it is a subclass)',
  },

  related: [
    { name: 'NameError',      slug: 'nameerror',      when: 'Base class — the name is not bound in any scope' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'The dotted-lookup counterpart' },
    { name: 'globals',        slug: 'globals',        when: 'The module namespace', category: 'functions' },
    { name: 'locals',         slug: 'locals',         when: 'The local namespace', category: 'functions' },
    { name: '+= and friends', slug: 'augmented-assignment', when: 'Augmented assignment makes the name local', category: 'operators' },
  ],

  faq: [
    {
      q: 'What does "cannot access local variable where it is not associated with a value" mean?',
      a: 'The function assigns to that name somewhere, which makes it a local variable for the whole function body. At the moment the read ran, no assignment had happened yet — either it comes later in the code, or it sits in an if, try or loop body that did not run. Python does not fall back to a global of the same name.',
    },
    {
      q: 'Is this the same as "local variable referenced before assignment"?',
      a: "Yes. Python 3.10 and earlier worded the same UnboundLocalError as local variable 'x' referenced before assignment; current versions say cannot access local variable 'x' where it is not associated with a value.",
    },
    {
      q: 'Why can I read a global inside a function but not do x += 1?',
      a: 'Reading only looks the name up, and finds the global. x += 1 also assigns to x, so the compiler makes x local to the function; the read part of += then finds the empty local. Declare global x (or nonlocal x for an enclosing function), or pass the value in and return the result.',
    },
    {
      q: 'Why does items.append() work on a global list but items += [...] fails?',
      a: 'append() mutates the existing list through a name lookup — no assignment. items += [...] is an assignment to items (it rebinds the name after the in-place add), which makes items local.',
    },
    {
      q: 'Should I use global to fix it?',
      a: 'It works, but module-level mutable state makes functions harder to test and reason about. Prefer passing the value in and returning the new one, a class attribute, or nonlocal for closures. Use global for genuinely module-wide settings.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#UnboundLocalError',
    meta:  'Built-in exceptions',
  },
};
