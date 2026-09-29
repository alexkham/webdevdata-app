// content/reference/python/keywords/global.js

export const meta = {
  slug:        'global',
  name:        'global',
  signature:   'global name',
  blurb:       'Let a function assign to a module-level variable instead of creating a local one.',
  category:    'functions',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'global global variable global statement module variable scope unboundlocalerror assigned to before global declaration change global variable in function keyword',
};

export const method = {
  slug:      'global',
  name:      'global',
  signature: 'global name',

  category:    'Functions',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Any assignment inside a function makes that name local to the whole function. global name switches that off for one name: reads and writes go to the module namespace.',

  covers: ['global'],

  syntax: [
    { label: 'global', code: 'def f():\n    global name\n    name = value' },
    { label: 'several names', code: 'global a, b, c' },
  ],

  cheat: {
    useFor:    'Rebinding a module-level variable from inside a function',
    result:    'a declaration — no value; affects how the compiler treats the name',
    pairsWith: 'nonlocal, def, module-level constants',
    watchOut:  'not needed to READ a global or to mutate it (append, item assignment) — only to rebind it',
  },

  parameters: [
    { name: 'name', type: 'name', required: true, default: null, desc: 'One or more identifiers. Must come before any use of the name in the same block; cannot be a parameter.' },
  ],

  modes: [
    {
      id: 'counter',
      label: 'global',
      blurb: 'bump rebinds the module-level count, so each call sees the previous total.',
      params: [{ name: 'steps', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'count = 0\ndef bump(step):\n    global count\n    count += step\n    return count\ntotals = [bump(s) for s in {$steps}]\n(totals, count)',
      cases: [
        { id: 'ones',  label: 'ones',       values: { steps: '1, 1, 1' } },
        { id: 'mixed', label: 'mixed',      values: { steps: '5, -2, 0.5' } },
        { id: 'empty', label: 'empty list', values: { steps: '' } },
      ],
    },
    {
      id: 'local',
      label: 'without global',
      blurb: 'The assignment makes total local to the WHOLE function — even when the if does not run.',
      params: [{ name: 'n', type: 'int', hint: 'try 3 and 8', input: 'number' }],
      template: 'total = 10\ndef f(n):\n    if n > 5:\n        total = 0\n    return total\nf({$n})',
      cases: [
        { id: 'big',   label: 'n > 5',  values: { n: '8' } },
        { id: 'small', label: 'n <= 5', values: { n: '3' } },
      ],
    },
  ],
  demoExplainer: 'The without global tab is the classic surprise: Python decides at compile time that total is local to f because it is assigned somewhere in f. When the assignment is skipped, return total reads a local that was never set — UnboundLocalError, not the module value 10.',

  patterns: [
    {
      name: 'Module-level cache or config',
      desc: 'Set once on first use.',
      code: '_config = None\n\ndef get_config():\n    global _config\n    if _config is None:\n        _config = load_config()\n    return _config',
    },
    {
      name: 'Return instead of global',
      desc: 'Usually cleaner: pass values in, return results out.',
      code: 'def bump(count, step):\n    return count + step\n\ncount = bump(count, 1)',
    },
    {
      name: 'Mutation needs no global',
      desc: 'Changing an object the global name refers to is not a rebinding.',
      code: 'registry = {}\n\ndef register(name, func):\n    registry[name] = func',
    },
  ],

  examples: [
    { title: 'Reading a global needs no declaration', code: 'x = 5\ndef show():\n    return x\nshow()', returns: '5' },
    { title: 'Rebinding needs global',       code: 'x = 5\ndef reset():\n    global x\n    x = 0\nreset()\nx', returns: '0' },
    { title: 'Creating a global from a function', code: "def setup():\n    global config\n    config = {'debug': True}\nsetup()\nconfig", returns: "{'debug': True}" },
    { title: 'Mutating is not rebinding',    code: 'items = []\ndef add(v):\n    items.append(v)\nadd(1)\nitems', returns: '[1]' },
    { title: 'global skips enclosing functions', code: "x = 'module'\ndef outer():\n    x = 'outer'\n    def inner():\n        global x\n        return x\n    return inner()\nouter()", returns: "'module'" },
    { title: 'Declared too late',            code: "compile('def f():\\n    x = 1\\n    global x', '<demo>', 'exec')", returns: "SyntaxError: name 'x' is assigned to before global declaration" },
    { title: 'Used before the declaration',  code: "compile('def f():\\n    print(x)\\n    global x', '<demo>', 'exec')", returns: "SyntaxError: name 'x' is used prior to global declaration" },
    { title: 'A parameter cannot be global', code: "compile('def f(x):\\n    global x', '<demo>', 'exec')", returns: "SyntaxError: name 'x' is parameter and global" },
  ],

  pitfalls: [
    {
      name: 'Updating a module variable with +=',
      desc: 'count += 1 assigns, so count is local — and it is read before it has a value.',
      wrong: { label: 'no declaration', code: 'count = 0\ndef bump():\n    count += 1\nbump()', output: "UnboundLocalError: cannot access local variable 'count' where it is not associated with a value" },
      fix:   { label: 'global count',   code: 'count = 0\ndef bump():\n    global count\n    count += 1\nbump()\ncount', output: '1' },
    },
    {
      name: 'Using global for a variable of the enclosing function',
      desc: 'global always means the module namespace. For a variable of an outer function, use nonlocal.',
      wrong: { label: 'global', code: 'def outer():\n    n = 0\n    def inner():\n        global n\n        n = 1\n    inner()\n    return n\nouter()', output: '0' },
      fix:   { label: 'nonlocal', code: 'def outer():\n    n = 0\n    def inner():\n        nonlocal n\n        n = 1\n    inner()\n    return n\nouter()', output: '1' },
    },
  ],

  when: {
    use: [
      'A small script’s module-level state (a counter, a lazily created resource)',
      'Setting a module-level cache or configuration on first use',
    ],
    avoid: [
      'Passing data between functions → parameters and return values',
      'Shared state for a group of functions → a class instance',
      'A variable of an outer function → nonlocal',
    ],
  },

  notes: {
    cpython:   'Declared names compile to LOAD_GLOBAL / STORE_GLOBAL instead of LOAD_FAST / STORE_FAST',
    'Scope':   '"Global" means the current module’s namespace — there is no cross-module global; other modules see it as module.name',
    'Rule':    'Whether a name is local is decided per function at compile time: any assignment, for target, import, def or class binding it makes it local',
  },

  related: [
    { name: 'nonlocal', slug: 'nonlocal', when: 'Rebind a variable of the enclosing function' },
    { name: 'def',      slug: 'def',      when: 'Functions create the local scope' },
    { name: 'UnboundLocalError', slug: 'unboundlocalerror', when: 'The error a missing global causes', category: 'exceptions' },
    { name: 'NameError', slug: 'nameerror', when: 'The name is not bound anywhere', category: 'exceptions' },
    { name: 'globals()', slug: 'globals', when: 'The module namespace as a dict', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I change a global variable inside a function in Python?',
      a: 'Declare it at the top of the function with global name, then assign to it. Without the declaration, the assignment creates a new local variable and the module-level one is unchanged.',
    },
    {
      q: 'Why do I get UnboundLocalError when the variable is defined globally?',
      a: 'Because the function assigns to that name somewhere (x = …, x += …, a for loop target), which makes it local for the entire function. Reading it before that assignment runs raises UnboundLocalError. Add global x if you meant the module variable.',
    },
    {
      q: 'Do I need global to modify a global list or dict?',
      a: 'No. items.append(v) or config["k"] = v change the object the name refers to; they do not rebind the name. You need global only for name = … (or +=, del name, and other rebinding).',
    },
    {
      q: 'What does "name is assigned to before global declaration" mean?',
      a: 'The global statement must come before every use of the name in that function. Move global name to the top of the function body.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-global-statement',
    meta:  'The global statement',
  },
};
