// content/reference/python/functions/locals.js

export const meta = {
  slug:        'locals',
  name:        'locals',
  signature:   'locals()',
  blurb:       'The current local namespace dict — behavior differs by context (module / function / class).',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'locals namespace scope local variables function class dict reflection frame',
};

export const method = {
  slug:      'locals',
  name:      'locals',
  signature: 'locals()',
  returns:   { type: 'dict', desc: 'The current local scope&apos;s namespace as a dict. At MODULE level or REPL, same as globals(). Inside a FUNCTION, a snapshot of local variables (may not be live). Inside a CLASS body, the developing class attributes.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'The local scope&apos;s namespace — but the semantics change with context, and function locals are often a SNAPSHOT.',

  cheat: {
    commonCall: 'locals()',
    returns:    'the current local namespace — semantics depend on context',
    replaces:   'the CPython &quot;get the current frame&apos;s locals&quot; internal API',
    watchOut:   'in a function, mutating locals() does NOT change the actual locals — it is a snapshot',
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
  demoExplainer: 'The demo shows what locals() would return in three contexts. AT MODULE LEVEL, locals() is the same as globals() — the module dict. INSIDE A FUNCTION, locals() gives a SNAPSHOT of local variables (not live — modifying the returned dict does not change the locals). INSIDE A CLASS BODY, locals() gives the developing class attributes as they are being defined.',

  patterns: [
    {
      name: 'Format an f-string from a dict of local values',
      desc: 'Handy for logging when there are many locals to include.',
      code: 'def process(a, b, c):\n    ...\n    log.debug("state: %s", locals())',
    },
    {
      name: 'Build a dict from local variables',
      desc: 'A quick way to package up a set of related computed values.',
      code: 'def compute(x, y):\n    total = x + y\n    diff = x - y\n    return {k: v for k, v in locals().items() if not k.startswith("_")}',
    },
    {
      name: 'String template interpolation',
      desc: 'string.Template can substitute names from a dict of locals.',
      code: 'from string import Template\nt = Template("Hello $name, age $age")\nt.substitute(**locals())',
    },
    {
      name: 'Prefer explicit — locals() is not for writing',
      desc: 'Assigning to locals()[name] does NOT create a local variable in a function.',
      code: '# WRONG: locals()["x"] = 1\n# RIGHT: use exec() sparingly, or just do x = 1',
    },
  ],

  examples: [
    { title: 'Module level',      code: 'x = 1\nlocals() == globals()',    returns: 'True  # same dict at module level' },
    { title: 'Function locals',    code: 'def f():\n    a = 1\n    b = 2\n    return locals()',  returns: "{'a': 1, 'b': 2}" },
    { title: 'Not live',            code: 'def f():\n    x = 1\n    locals()["x"] = 99\n    return x',  returns: '1  # unchanged; snapshot' },
    { title: 'Class body',          code: 'class C:\n    x = 1\n    print(locals())',              returns: "{'__module__': '__main__', 'x': 1, ...}" },
    { title: 'Args + locals',       code: 'def f(a, b):\n    c = a + b\n    return locals()',      returns: "{'a': 1, 'b': 2, 'c': 3}" },
  ],

  pitfalls: [
    {
      name: 'In a function, locals() is a SNAPSHOT — not live',
      desc: 'The single most important locals() detail. Inside a function, locals() returns a dict that Python populated from the frame — but WRITING to it does not affect the frame&apos;s actual variables. Every call gives a fresh snapshot.',
      wrong: { label: 'Write not seen', code: 'def f():\n    x = 1\n    locals()["x"] = 99\n    return x', output: '1  # x still 1' },
      fix:   { label: 'Just assign',     code: 'def f():\n    x = 99\n    return x', output: '99' },
    },
    {
      name: 'At module level, locals() IS globals()',
      desc: 'They return the same dict object. `locals() is globals()` is True in a module or REPL — the difference only appears in functions and class bodies.',
      wrong: { label: 'Assumed different', code: '# at module level\nlocals() is globals()', output: 'True' },
      fix:   { label: 'Different in functions', code: 'def f(): return locals() is globals()', output: 'False' },
    },
    {
      name: 'Class body: developing attributes',
      desc: 'Inside a class body (during class creation), locals() gives the class attributes as they are being defined. After class creation, this dict becomes the class __dict__.',
      wrong: { label: 'Different times', code: 'class C:\n    x = 1\n    print(locals())   # x already there', output: "{'x': 1, '__module__': ..., ...}" },
      fix:   { label: 'Same as C.__dict__ post-creation', code: 'vars(C)', output: 'similar contents' },
    },
    {
      name: 'CPython optimizes function locals — do not rely on order',
      desc: 'The order of function locals in the returned dict is an implementation detail. Newer CPython versions may reorder or skip locals that were optimized away.',
      wrong: { label: 'Order assumption', code: 'list(locals())   # order matters?', output: 'implementation-dependent' },
      fix:   { label: 'Do not rely on order', code: 'sorted(locals())', output: 'stable' },
    },
  ],

  when: {
    use: [
      'Debug output: `log.debug("state: %s", locals())`',
      'String template substitution (`Template.substitute(**locals())`)',
      'Introspection during test setup or REPL exploration',
      'Class body introspection during metaclass work',
    ],
    avoid: [
      'Writing to function locals — snapshots, not live',
      'Dynamic name creation → use dict variables or explicit assignments',
      'Cross-function state — pass arguments, do not rummage in locals',
      'Anything requiring guaranteed live semantics in a function',
    ],
  },

  notes: {
    complexity: 'O(n) in the number of local variables — snapshot construction',
    return:     'A dict; at module level it IS globals(), inside a function it is a fresh snapshot',
    cpython:    'Python/bltinmodule.c :: builtin_locals — calls PyEval_GetLocals',
    memory:     'Allocates a snapshot dict in function contexts',
    threadSafe: 'Yes for the returned snapshot',
  },

  related: [
    { name: 'globals',    slug: 'globals',    when: 'Module-level namespace' },
    { name: 'vars',       slug: 'vars',       when: 'An object&apos;s __dict__' },
    { name: 'dir',        slug: 'dir',        when: 'All names accessible from a scope' },
  ],

  faq: [
    {
      q: 'What is the difference between locals() and globals()?',
      a: 'Inside a function, locals() is a snapshot of the function&apos;s local variables; globals() is the enclosing module&apos;s namespace. Inside a class body, locals() is the developing class attributes. At module level, they are the same dict.',
    },
    {
      q: 'Why does modifying locals() not change my variables?',
      a: 'CPython optimizes function locals by storing them in frame slots, not in a dict. locals() constructs a fresh dict from those slots — mutations do not flow back. This is a well-known but occasionally surprising implementation choice.',
    },
    {
      q: 'Is locals() safe to call in performance-critical code?',
      a: 'Inside a function, it allocates a fresh dict each call — cheap but not free. Avoid in tight loops.',
    },
  ],

  history: [
    { version: '1.0', note: 'locals() has been a builtin since Python 1.0.' },
    { version: '3.13', note: 'PEP 667 (draft/discussed) proposals to make function locals writable via locals(); not yet accepted.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#locals',
    meta:  'locals',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect namespace data' },
  ],
};