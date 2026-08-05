// content/reference/python/functions/eval.js

export const meta = {
  slug:        'eval',
  name:        'eval',
  signature:   'eval(source, globals=None, locals=None)',
  blurb:       'Evaluate a Python EXPRESSION from a string — powerful, dangerous, usually the wrong tool.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'eval evaluate expression dynamic security danger literal untrusted parse ast',
};

export const method = {
  slug:      'eval',
  name:      'eval',
  signature: 'eval(source, globals=None, locals=None)',
  returns:   { type: 'Any', desc: 'The result of evaluating the given Python EXPRESSION string. Only an expression — not a statement (no assignment, no def, no import at top level). Uses the caller&apos;s globals and locals unless explicit dicts are passed.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Evaluate a Python expression from a string. Only use on TRUSTED input — never on user data.',

  cheat: {
    commonCall: 'eval("1 + 2")',
    returns:    'the value of the expression',
    replaces:   'nothing — usually you should NOT reach for eval',
    watchOut:   'evaluates ARBITRARY Python — never call on untrusted input; prefer ast.literal_eval',
  },

  parameters: [
    { name: 'source',  type: 'str | code', required: true,  default: null,   desc: 'A string containing a Python EXPRESSION. Not a statement — no assignment, no def / class / import at top level. A compiled code object is also accepted.' },
    { name: 'globals', type: 'dict',       required: false, default: 'None', desc: 'Optional globals dict for the evaluation. If None, uses the caller&apos;s globals. If provided without __builtins__, Python inserts one automatically.' },
    { name: 'locals',  type: 'dict',       required: false, default: 'None', desc: 'Optional locals dict. Defaults to the globals dict.' },
  ],

  demoParams: [
    { name: 'expr', type: 'str', hint: 'Python expression', input: 'text' },
  ],
  cases: [
    { id: 'arith',    label: 'arithmetic',      values: { expr: '1 + 2 * 3' } },
    { id: 'string',   label: 'string method',    values: { expr: '"hello".upper()' } },
    { id: 'list',     label: 'list literal',     values: { expr: '[x * 2 for x in range(3)]' } },
    { id: 'dict',     label: 'dict literal',     values: { expr: '{"a": 1, "b": 2}' } },
    { id: 'compare',  label: 'comparison',       values: { expr: '10 > 5' } },
    { id: 'stmt',     label: 'statement (fails)', values: { expr: 'x = 1' } },
  ],
  demoExplainer: 'eval takes a string containing a Python EXPRESSION and returns its value. It CANNOT run statements — no assignment (x = 1), no def / class / import at top level. For statements, use exec. Do NOT call eval on untrusted input — the expression can access anything in scope, including __builtins__ (import, open, os.system, ...). For SAFE parsing of literal data, use ast.literal_eval — it only accepts strings, numbers, tuples, lists, dicts, booleans, None, and set literals.',

  patterns: [
    {
      name: 'For LITERAL data — use ast.literal_eval, not eval',
      desc: 'When you need to parse a Python-shaped literal from a string.',
      code: 'import ast\ndata = ast.literal_eval("[1, 2, 3]")   # safe',
    },
    {
      name: 'For JSON data — use json.loads',
      desc: 'JSON is a standard format with a dedicated parser.',
      code: 'import json\ndata = json.loads(\'{"a": 1}\')',
    },
    {
      name: 'For math expressions from users',
      desc: 'Use a real math parser (sympy, or a small pratt parser). Never eval.',
      code: 'import sympy\nsympy.sympify("1 + 2 * x")   # safe symbolic eval',
    },
    {
      name: 'Trusted expression at runtime',
      desc: 'If the source is definitely trusted (your own code), eval is OK — but consider a lambda instead.',
      code: 'formula = "x + y"\nresult = eval(formula, {"x": 3, "y": 4})',
    },
  ],

  examples: [
    { title: 'Arithmetic',        code: 'eval("1 + 2 * 3")',           returns: '7' },
    { title: 'String call',       code: 'eval("\'hi\'.upper()")',      returns: '"HI"' },
    { title: 'Comprehension',      code: 'eval("[x * 2 for x in range(3)]")', returns: '[0, 2, 4]' },
    { title: 'Uses caller scope',  code: 'x = 10\neval("x + 1")',       returns: '11' },
    { title: 'Custom scope',       code: 'eval("a + b", {"a": 3, "b": 4})', returns: '7' },
    { title: 'Statements fail',    code: 'eval("x = 1")',                returns: "SyntaxError: invalid syntax" },
  ],

  pitfalls: [
    {
      name: 'DANGEROUS on untrusted input — arbitrary code execution',
      desc: 'The single most important warning. eval on user input is a remote code execution vulnerability. Even if you restrict globals, __builtins__ leaks give access to import, os, and the filesystem.',
      wrong: { label: 'Untrusted eval', code: 'eval(request.form["math"])', output: 'attacker can run ANY Python' },
      fix:   { label: 'ast.literal_eval', code: 'import ast\nast.literal_eval(request.form["math"])', output: 'only literal data allowed' },
    },
    {
      name: 'Restricting globals is NOT sufficient sandboxing',
      desc: 'Passing an empty globals={} does not prevent access to __builtins__ tricks. A determined attacker can reach the class hierarchy via `().__class__.__bases__[0].__subclasses__()` and find dangerous classes. There is no reliable way to sandbox eval in pure Python.',
      wrong: { label: 'False security', code: 'eval(untrusted, {})', output: 'still exploitable' },
      fix:   { label: 'Do not eval untrusted', code: 'use a real parser', output: '' },
    },
    {
      name: 'STATEMENTS fail — use exec for those',
      desc: 'eval takes an expression. `x = 1` is a statement, not an expression. Assignment expressions (walrus) work as they are expressions: `eval("(x := 1)")`.',
      wrong: { label: 'Statement', code: 'eval("x = 1")', output: 'SyntaxError' },
      fix:   { label: 'exec for statements', code: 'exec("x = 1")', output: 'x is now 1' },
    },
    {
      name: 'Silent scope pollution',
      desc: 'Without explicit globals / locals, eval reads and writes the CALLER&apos;S scope. Even if you did not intend to mutate anything, an eval&apos;d expression can call methods with side effects on your variables.',
      wrong: { label: 'Reads caller scope', code: 'secret = "hunter2"\neval("open(secret)")', output: 'reads secret' },
      fix:   { label: 'Explicit scope',      code: 'eval(source, {"__builtins__": None}, {})', output: 'still risky, but bounded' },
    },
  ],

  when: {
    use: [
      'Never with untrusted input',
      'Trusted expressions from your own code (rare — a lambda is usually cleaner)',
      'REPL-like tools where you WANT arbitrary Python (Jupyter, ipython)',
      'Extension of a config format that intentionally embeds Python',
    ],
    avoid: [
      'Any input from a user, a network, or a file → ast.literal_eval / json / a real parser',
      'Math from user input → sympy or a pratt parser',
      'Serialization → json / pickle / dataclasses',
      'Dynamic dispatch → a dict of functions',
    ],
  },

  notes: {
    complexity: 'Compile + execution — variable',
    return:     'The expression&apos;s value',
    cpython:    'Python/bltinmodule.c :: builtin_eval — compiles and runs',
    memory:     'Allocates code objects and result',
    threadSafe: 'Depends entirely on the evaluated expression',
  },

  related: [
    { name: 'exec',    slug: 'exec',    when: 'Execute STATEMENTS from a string' },
    { name: 'compile', slug: 'compile', when: 'Pre-compile source to a code object' },
    { name: 'input',   slug: 'input',   when: 'Read a line of user input (do NOT eval it)' },
  ],

  faq: [
    {
      q: 'Is eval always unsafe?',
      a: 'Unsafe on any input you did not fully control. For your own code, it works — but a lambda, a dispatch dict, or a compiled function is almost always clearer and safer. The rule of thumb: if you can avoid eval, you should.',
    },
    {
      q: 'What is ast.literal_eval and why is it safer?',
      a: 'ast.literal_eval parses the string as an AST but only allows LITERAL nodes: strings, numbers, tuples, lists, dicts, booleans, None, and set literals. It cannot call functions, access attributes, or execute code. Perfect for parsing configuration-shaped data.',
    },
    {
      q: 'How is eval different from exec?',
      a: 'eval takes an EXPRESSION and RETURNS its value. exec takes STATEMENTS (any Python code) and returns None; its effect is on the enclosing namespace.',
    },
  ],

  history: [
    { version: '1.0', note: 'eval() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Python 2 input() removed — it used to call eval on the typed line (security disaster).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#eval',
    meta:  'eval',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Parse JSON safely instead' },
  ],
};