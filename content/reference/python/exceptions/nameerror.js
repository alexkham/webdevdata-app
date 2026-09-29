// content/reference/python/exceptions/nameerror.js

export const meta = {
  slug:        'nameerror',
  name:        'NameError',
  signature:   'NameError(*args, name=None)',
  blurb:       'Raised when a bare name is used that is not defined in any enclosing scope.',
  category:    'lookup',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'nameerror name error is not defined undefined variable name not defined did you forget to import typo scope misspelled function',
};

export const method = {
  slug:      'nameerror',
  name:      'NameError',
  signature: 'NameError(*args, name=None)',

  category:    'Lookup exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "A bare name that Python cannot find in the local, enclosing, global or builtin scope — at the moment the line runs, not when the file is read.",

  chain: ['BaseException', 'Exception', 'NameError'],

  cheat: {
    raisedBy: 'reading an unassigned, misspelled, deleted or not-imported name',
    message:  "name 'x' is not defined",
    quickFix: 'fix the spelling, import it, or assign it on every path',
    watchOut: 'defined only inside an if/try/for body that did not run',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. str(e) is that message.' },
    { name: 'name',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. The name that was not found; set automatically by the interpreter (3.10+).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'kind is only assigned when the if body runs. Names are looked up when the line executes, so the error depends on the value.',
      params: [{ name: 'n', type: 'int', hint: 'try 0 or a negative', input: 'number' }],
      template: "if {$n} > 0:\n    kind = 'positive'\nkind",
      cases: [
        { id: 'pos',  label: 'positive', values: { n: '5' } },
        { id: 'zero', label: 'zero',     values: { n: '0' } },
        { id: 'neg',  label: 'negative', values: { n: '-3' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch it and read e.name — the missing name, without parsing the message.',
      params: [{ name: 'n', type: 'int', hint: 'try 0 or a negative', input: 'number' }],
      template: "if {$n} > 0:\n    kind = 'positive'\ntry:\n    kind\nexcept NameError as e:\n    kind = f'undefined: {e.name}'\nkind",
      cases: [
        { id: 'pos',  label: 'positive', values: { n: '5' } },
        { id: 'zero', label: 'zero',     values: { n: '0' } },
      ],
    },
  ],
  demoExplainer: "The file is valid either way — Python only notices the missing name when the line kind actually runs. With 0 or a negative number the if body is skipped, so kind was never bound. Catching NameError works (Handle), but the real fix is to give the name a value before the if: kind = 'non-positive'.",

  attributes: [
    { name: 'name', type: 'str | None', meaning: 'The name that was not found (3.10+). None for a NameError you construct without name=, and for UnboundLocalError.' },
    { name: 'args', type: 'tuple',      meaning: "The constructor arguments; args[0] is the message, e.g. \"name 'x' is not defined\"." },
  ],

  patterns: [
    {
      name: 'Assign before branching',
      desc: 'Give the name a value that covers the path where no branch runs.',
      code: "kind = 'unknown'\nif n > 0:\n    kind = 'positive'\nelif n < 0:\n    kind = 'negative'",
    },
    {
      name: 'Optional dependency',
      desc: 'Bind the name either way, so later code can test it instead of hitting NameError.',
      code: "try:\n    import numpy as np\nexcept ImportError:\n    np = None",
    },
    {
      name: 'Define before calling at module level',
      desc: 'Functions can refer to names defined later in the file, but module-level code runs top to bottom — call main() last.',
      code: "def main():\n    return helper()\n\ndef helper():\n    return 'ok'\n\nif __name__ == '__main__':\n    main()",
    },
  ],

  examples: [
    { title: 'Typo in a builtin',        code: "prnt('hi')",                           returns: "NameError: name 'prnt' is not defined. Did you mean: 'print'?" },
    { title: 'Module used but not imported', code: "math.sqrt(4)",                     returns: "NameError: name 'math' is not defined. Did you forget to import 'math'?" },
    { title: 'JSON / JavaScript literal', code: "true",                                returns: "NameError: name 'true' is not defined. Did you mean: 'True'?" },
    { title: 'Assigned only on one path', code: "try:\n    x = int('oops')\nexcept ValueError:\n    pass\nx", returns: "NameError: name 'x' is not defined" },
    { title: 'Loop that never ran',       code: "for i in range(0):\n    last = i\nlast", returns: "NameError: name 'last' is not defined. Did you mean: 'list'?" },
    { title: 'Local to a function',       code: "def f():\n    total = 0\n    return total\nf()\ntotal", returns: "NameError: name 'total' is not defined" },
    { title: 'After del',                 code: "x = 1\ndel x\nx",                     returns: "NameError: name 'x' is not defined" },
    { title: 'e.name holds the missing name', code: "try:\n    undefined_thing\nexcept NameError as e:\n    r = e.name\nr", returns: "'undefined_thing'" },
  ],

  pitfalls: [
    {
      name: 'Calling a function before its def runs',
      desc: 'def is an executable statement. At module level, a call placed above the def fails because the name is not bound yet.',
      wrong: { label: 'Call above def', code: "result = helper()\ndef helper():\n    return 'ok'", output: "NameError: name 'helper' is not defined. Did you mean: 'help'?" },
      fix:   { label: 'Call after def', code: "def helper():\n    return 'ok'\nresult = helper()\nresult", output: "'ok'" },
    },
    {
      name: 'Class attributes are not in scope inside methods',
      desc: 'The class body is not an enclosing scope for its methods. Reach class attributes through self or the class.',
      wrong: { label: 'bare x', code: "class A:\n    x = 1\n    def get(self):\n        return x\nA().get()", output: "NameError: name 'x' is not defined. Did you mean: 'self.x'?" },
      fix:   { label: 'self.x', code: "class A:\n    x = 1\n    def get(self):\n        return self.x\nA().get()", output: '1' },
    },
    {
      name: 'Class attributes in a comprehension',
      desc: 'Same rule inside a class body: a comprehension there cannot see the class-level names (except the first iterable).',
      wrong: { label: 'x in the expression', code: "class A:\n    x = 2\n    y = [x * i for i in range(3)]\nA.y", output: "NameError: name 'x' is not defined" },
      fix:   { label: 'Loop over x instead', code: "class A:\n    x = 2\n    y = [x * i for x in [x] for i in range(3)]\nA.y", output: '[0, 2, 4]' },
    },
  ],

  when: {
    use: [
      'Catching it is rare — it almost always signals a bug to fix, not handle',
      'Probing for an optional name in generated or exec() code',
      'Tests asserting that a name is deliberately not exported',
    ],
    avoid: [
      'Optional imports → bind the name to None in except ImportError',
      'Maybe-assigned variables → initialise before the if/try/for',
      'Dynamic variable names → use a dict instead of globals()',
    ],
  },

  notes: {
    'Did you mean': "3.10+: the traceback printer searches the failing frame's locals, globals and builtins (and self's attributes inside a method, 3.12+) for a close match. The output boxes on this page show that traceback line, so they include it; str(e) and e.args never do.",
    'Forgot to import': "3.12+: for a standard-library module name (sys.stdlib_module_names) the traceback adds . Did you forget to import 'math'? — it needs no frame, so format_exception_only shows it too; str(e) never does",
    Subclass:  'UnboundLocalError is a NameError subclass for locals read before assignment',
    'Scope order': 'Local → enclosing function → global (module) → builtins (LEGB)',
  },

  related: [
    { name: 'UnboundLocalError', slug: 'unboundlocalerror', when: 'The name is local but has no value yet' },
    { name: 'AttributeError',    slug: 'attributeerror',    when: 'obj.name fails — a dotted lookup' },
    { name: 'ImportError',       slug: 'importerror',       when: 'The import itself fails' },
    { name: 'SyntaxError',       slug: 'syntaxerror',       when: 'Caught before running; NameError only at run time' },
    { name: 'globals',           slug: 'globals',           when: 'Inspect the module namespace', category: 'functions' },
    { name: 'locals',            slug: 'locals',            when: 'Inspect the local namespace', category: 'functions' },
  ],

  faq: [
    {
      q: 'What does "name is not defined" mean in Python?',
      a: "Python looked for that bare name in the local, enclosing, global and builtin scopes and found nothing at the moment the line ran. The usual causes: a typo (prnt), a missing import (math.sqrt without import math), a variable assigned only inside an if, try or for body that did not run, a name local to another function, or a JavaScript/JSON literal (true, null instead of True, None).",
    },
    {
      q: 'Why does str(e) not contain the "Did you mean" suggestion?',
      a: "The suggestion is not part of the exception. When a traceback is printed, Python 3.10+ searches the failing frame's locals, globals and builtins for a close match to e.name and appends . Did you mean: 'print'? to the displayed line (the boxes on this page show that line). str(e), e.args, logging with %s, and traceback.format_exception_only(e) without the traceback object show only name 'prnt' is not defined. The \"Did you forget to import 'math'?\" hint (3.12+) needs only the name, so it appears whenever the exception is formatted by the traceback module.",
    },
    {
      q: 'Why is true not defined in Python?',
      a: 'Python spells the boolean and null constants True, False and None, capitalised. true, false and null come from JSON and JavaScript. When loading JSON text, use json.loads, which converts them for you.',
    },
    {
      q: 'NameError vs UnboundLocalError?',
      a: 'Both mean the name has no value. UnboundLocalError (a NameError subclass) is raised when the name is local to the function — it is assigned somewhere in that function — but is read before the assignment ran. Plain NameError means the name is not bound in any scope.',
    },
    {
      q: 'NameError vs AttributeError?',
      a: 'NameError is for bare names (x, prnt). AttributeError is for dotted access where the object exists but lacks the attribute (math.sqr, None.upper).',
    },
  ],

  history: [
    { version: '3.10', note: 'Added the name attribute.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#NameError',
    meta:  'Built-in exceptions',
  },
};
