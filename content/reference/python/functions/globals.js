// content/reference/python/functions/globals.js

export const meta = {
  slug:        'globals',
  name:        'globals',
  signature:   'globals()',
  blurb:       'The module-level namespace dict — the same dict every top-level assignment writes to.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'globals namespace module scope dict variables reflection top-level names',
};

export const method = {
  slug:      'globals',
  name:      'globals',
  signature: 'globals()',
  returns:   { type: 'dict', desc: 'A LIVE dict of the module-level namespace of the calling module. Every top-level `x = ...` writes to this dict; every top-level read looks it up. Mutating the dict changes the module.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Direct access to the module\'s namespace dict — the layer just below the language.',

  cheat: {
    commonCall: 'globals()',
    returns:    'the live module namespace dict',
    replaces:   'importing your own module and inspecting its __dict__',
    watchOut:   'writing to globals() modifies the module in place — powerful and dangerous',
  },

  parameters: [
    // No parameters
  ],

  demoParams: [
    { name: 'context', type: 'str', hint: 'module / function / class', input: 'text' },
  ],
  cases: [
    { id: 'module',   label: 'module level',    values: { context: 'module' } },
    { id: 'function', label: 'inside function',  values: { context: 'function' } },
    { id: 'class',    label: 'inside class',    values: { context: 'class' } },
  ],
  demoExplainer: 'The demo shows what globals() would return in three contexts. AT MODULE LEVEL, globals() returns the dict containing every top-level name (including __name__, __builtins__, and everything you defined). INSIDE A FUNCTION, globals() returns the SAME module-level dict — NOT the local variables. INSIDE A CLASS BODY, again the module dict — a common source of confusion since the class body has its own locals.',

  patterns: [
    {
      name: 'Dispatch by name',
      desc: 'Look up a top-level function by its string name.',
      code: 'def dispatch(cmd, *args):\n    fn = globals().get(cmd)\n    if callable(fn):\n        return fn(*args)',
    },
    {
      name: 'Guard imports for optional dependencies',
      desc: 'Set the name in globals only if the import succeeded.',
      code: 'try:\n    import numpy\n    globals()["np"] = numpy\nexcept ImportError:\n    pass',
    },
    {
      name: 'List everything defined at module level',
      desc: 'Filter to non-dunder, non-imported names for a \"public\" summary.',
      code: '[n for n in globals() if not n.startswith("_")]',
    },
    {
      name: 'Prefer explicit dispatch tables',
      desc: 'globals()-based dispatch is powerful but obscure. A dict of callables is usually clearer.',
      code: 'HANDLERS = {"add": handle_add, "remove": handle_remove}',
    },
  ],

  examples: [
    { title: 'Module level',       code: 'x = 1\nglobals()["x"]',         returns: '1' },
    { title: 'Same as x',           code: 'x = 1\nglobals()["x"] is x',    returns: 'True' },
    { title: 'Write through',      code: 'globals()["y"] = 42\ny',         returns: '42  # module-level y created' },
    { title: 'From function',      code: 'def f():\n    return globals()["x"]', returns: '1  # sees module-level x' },
    { title: 'List public names',   code: '[n for n in globals() if not n.startswith("_")]', returns: "['x', 'y', 'f', ...]" },
  ],

  pitfalls: [
    {
      name: 'globals() is the MODULE dict, even inside a function',
      desc: 'A common surprise. Inside a function, globals() does NOT give you the function\'s local variables — for that, use locals(). globals() always gives the enclosing module\'s namespace.',
      wrong: { label: 'Not local vars', code: 'def f():\n    x = 1\n    return globals()', output: 'module dict — no x' },
      fix:   { label: 'Use locals()',    code: 'def f():\n    x = 1\n    return locals()', output: "{'x': 1}" },
    },
    {
      name: 'Writes are permanent — you are modifying the module',
      desc: 'Assigning through globals() creates or overwrites module-level names. In library code, this is often the wrong thing to do — direct assignment is clearer and grep-able.',
      wrong: { label: 'Hidden creation', code: 'globals()["x"] = 42   # invisible to greppers', output: 'x created' },
      fix:   { label: 'Direct',           code: 'x = 42', output: 'clearer' },
    },
    {
      name: 'globals() at REPL vs module — same idea, different content',
      desc: 'At the interactive REPL, globals() returns the __main__ module\'s namespace. In a module file, it returns that module\'s namespace. Both are \"the module dict\" but their contents differ dramatically.',
      wrong: { label: 'Confused expectation', code: 'globals() at REPL vs in a script', output: 'different keys, both \"module dicts\"' },
      fix:   { label: 'Same concept — different modules', code: '# each module has its own globals()', output: '' },
    },
    {
      name: 'Not the same as __builtins__',
      desc: 'globals() gives you the module\'s namespace, which is separate from the builtins namespace (print, len, etc.). __builtins__ appears IN globals() as a reference — do not confuse the two.',
      wrong: { label: 'Assumed same', code: '"print" in globals()', output: 'False  # print is in __builtins__' },
      fix:   { label: 'Look in builtins', code: 'import builtins\n"print" in dir(builtins)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Dispatch by name in dynamic code (parsers, plugins)',
      'Introspection of module-level definitions',
      'Rare: guard-and-set for optional imports',
      'Debugging \"why can\'t Python find this name?\"',
    ],
    avoid: [
      'Local variables in a function → locals()',
      'Assigning module names dynamically → explicit assignment is clearer',
      'Dispatch tables → an explicit dict is more maintainable',
      'Working around scope issues → refactor instead',
    ],
  },

  notes: {
    complexity: 'O(1) — direct reference to the module\'s dict',
    return:     'A LIVE dict — same object each call from the same module',
    cpython:    'Python/bltinmodule.c :: builtin_globals — reads the current frame\'s globals',
    memory:     'No allocation',
    threadSafe: 'Depends on whether the module dict is safe from concurrent mutation',
  },

  related: [
    { name: 'locals',    slug: 'locals',    when: 'Function or class local namespace' },
    { name: 'vars',      slug: 'vars',      when: 'An object\'s __dict__' },
    { name: 'dir',       slug: 'dir',       when: 'All names accessible from a scope' },
    { name: 'getattr',   slug: 'getattr',   when: 'Read a specific name by string' },
  ],

  faq: [
    {
      q: 'What is the difference between globals() and locals()?',
      a: 'globals() always returns the enclosing module\'s namespace dict. locals() returns the current LOCAL scope — the same as globals() at module level, but function locals inside a function, and class attributes inside a class body.',
    },
    {
      q: 'Can I write to globals()?',
      a: 'Yes — assigning through globals() creates or overwrites module-level names. It is usually clearer to use plain assignment; globals()-based writes are hard to find with grep.',
    },
    {
      q: 'What are __name__, __builtins__, __doc__ doing in globals()?',
      a: 'They are the module\'s dunder attributes — automatically populated by the import machinery. __name__ is the module\'s import name; __builtins__ is a reference to the builtins module; __doc__ is the module docstring.',
    },
  ],

  history: [
    { version: '1.0', note: 'globals() has been a builtin since Python 1.0.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#globals',
    meta:  'globals',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect namespace data' },
  ],
};