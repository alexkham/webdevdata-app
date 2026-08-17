// content/reference/python/functions/exec.js

export const meta = {
  slug:        'exec',
  name:        'exec',
  signature:   'exec(source, globals=None, locals=None)',
  blurb:       'Execute Python STATEMENTS from a string — even more dangerous than eval, almost never the right tool.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 3.0+',
  searchTerms: 'exec execute dynamic statements security danger untrusted code injection',
};

export const method = {
  slug:      'exec',
  name:      'exec',
  signature: 'exec(source, globals=None, locals=None)',
  returns:   { type: 'None', desc: 'Always returns None. exec RUNS Python statements — assignment, def, class, import, control flow — with side effects in the given namespace. If globals / locals are omitted, uses the caller&apos;s scope.' },

  category:    'Built-in function',
  version:     'Python 3.0+',
  hasLiveDemo: false,

  subtitle: 'Execute arbitrary Python STATEMENTS from a string. Never on untrusted input. Rarely the right tool.',

  cheat: {
    commonCall: 'exec("x = 1")',
    returns:    'None — side effects only',
    replaces:   'nothing — usually you should NOT reach for exec',
    watchOut:   'runs ARBITRARY Python; side effects on the caller&apos;s scope; no return value',
  },

  parameters: [
    { name: 'source',  type: 'str | code', required: true,  default: null,   desc: 'A string containing Python statements (or a compiled code object). Can be a multi-line block — assignments, def, class, import, control flow.' },
    { name: 'globals', type: 'dict',       required: false, default: 'None', desc: 'Optional globals dict for execution. If None, uses the caller&apos;s globals.' },
    { name: 'locals',  type: 'dict',       required: false, default: 'None', desc: 'Optional locals dict. Defaults to the globals dict.' },
  ],

  demoParams: [
    { name: 'code', type: 'str', hint: 'Python statements', input: 'text' },
  ],
  cases: [
    { id: 'assign',   label: 'assignment',      values: { code: 'x = 1' } },
    { id: 'multi',    label: 'multi-statement',  values: { code: 'a = 1; b = 2; c = a + b' } },
    { id: 'def',      label: 'def a function',   values: { code: 'def add(a, b):\n    return a + b' } },
    { id: 'loop',     label: 'a for loop',       values: { code: 'total = 0\nfor i in range(5):\n    total += i' } },
    { id: 'import',   label: 'an import',         values: { code: 'import math' } },
    { id: 'print',    label: 'print (side effect)',values: { code: 'print("hello")' } },
  ],
  demoExplainer: 'exec runs Python STATEMENTS. Unlike eval, it can do anything — assign, define, import, loop, print. It ALWAYS returns None; the effect is on the namespace passed in (or on the caller&apos;s scope by default). The demo describes what each snippet would do. Do NOT call exec on untrusted input — this is arbitrary code execution by design.',

  patterns: [
    {
      name: 'Dynamic class or function generation (framework code)',
      desc: 'Occasionally used by ORMs and dataclass-like frameworks.',
      code: 'body = f"def __init__(self, {args}):\\n    " + inits\nexec(body, ns)',
    },
    {
      name: 'Trusted config that includes Python',
      desc: 'Some tools (Django settings, IPython config) are Python files exec&apos;d as a config.',
      code: 'with open("settings.py") as f:\n    exec(f.read(), config_globals)',
    },
    {
      name: 'For DATA, do not exec',
      desc: 'Use JSON, YAML, TOML, or a real config format — never exec a data string.',
      code: 'import json\nconfig = json.loads(text)',
    },
    {
      name: 'For dispatch, use a dict of callables',
      desc: 'exec is almost never needed for dynamic function selection.',
      code: 'HANDLERS = {"add": handle_add}\nHANDLERS[cmd](*args)',
    },
  ],

  examples: [
    { title: 'Assignment',        code: 'exec("x = 1")\nx',                returns: '1' },
    { title: 'Custom namespace',   code: 'ns = {}\nexec("x = 42", ns)\nns["x"]', returns: '42' },
    { title: 'Multi-line',         code: 'exec("a = 1\\nb = 2\\nprint(a + b)")', returns: '3   # printed' },
    { title: 'Returns None',       code: 'result = exec("x = 1")',           returns: 'None  # always' },
    { title: 'Function def',       code: 'exec("def f(): return 42")\nf()',   returns: '42' },
    { title: 'Untrusted RCE',      code: 'exec(user_input)',                  returns: 'DANGER: arbitrary code execution' },
  ],

  pitfalls: [
    {
      name: 'exec is ARBITRARY CODE EXECUTION — never on untrusted input',
      desc: 'Everything eval&apos;s warning says goes double for exec. eval at least tries to be an expression evaluator; exec runs anything. On user input, you have handed the attacker a Python interpreter.',
      wrong: { label: 'Attacker&apos;s dream', code: 'exec(request.form["config"])', output: 'the attacker owns your process' },
      fix:   { label: 'Never do this',       code: 'use a real config format', output: '' },
    },
    {
      name: 'exec ALWAYS returns None',
      desc: 'A common expectation from other languages: &quot;the last expression is the return&quot;. Not in Python. exec returns None; get results by reading the namespace it wrote into.',
      wrong: { label: 'Assumed return', code: 'x = exec("42")', output: 'x is None' },
      fix:   { label: 'Read the namespace', code: 'ns = {}\nexec("result = 42", ns)\nx = ns["result"]', output: '42' },
    },
    {
      name: 'Inside a function, exec cannot modify local variables directly',
      desc: 'Python compiles function locals into a fixed slot layout. exec writes into a namespace dict; the compiler does not know about it, so the function&apos;s named locals are unaffected.',
      wrong: { label: 'Locals unchanged', code: 'def f():\n    exec("x = 1")\n    return x', output: 'NameError: name x is not defined' },
      fix:   { label: 'Use a namespace',    code: 'def f():\n    ns = {}\n    exec("x = 1", ns)\n    return ns["x"]', output: '1' },
    },
    {
      name: 'Rarely the right tool — reach for it last',
      desc: 'If you find yourself wanting exec, first check: can I use a dict of callables? An ast walk? A real parser? importlib for dynamic imports? These are almost always safer and clearer.',
      wrong: { label: 'Reflex reach for exec', code: 'exec(dynamic_code)', output: 'usually avoidable' },
      fix:   { label: 'Structured alternative', code: 'HANDLERS[key](args)', output: 'safer' },
    },
  ],

  when: {
    use: [
      'Framework code that generates classes or functions from templates (dataclasses, ORMs)',
      'Trusted config files that ARE Python (Django settings, IPython)',
      'REPL implementations where you WANT arbitrary Python',
      'Almost nothing else',
    ],
    avoid: [
      'Any input from users, network, or files → do NOT exec',
      'Data serialization → JSON / pickle / dataclasses',
      'Dynamic dispatch → dict of callables',
      'Dynamic imports → importlib.import_module',
    ],
  },

  notes: {
    complexity: 'Compile + execution — variable',
    return:     'None',
    cpython:    'Python/bltinmodule.c :: builtin_exec',
    memory:     'Allocates code objects; side effects on namespace',
    threadSafe: 'Depends entirely on the executed code',
  },

  related: [
    { name: 'eval',    slug: 'eval',    when: 'Evaluate an EXPRESSION (returns a value)' },
    { name: 'compile', slug: 'compile', when: 'Pre-compile source to a code object' },
    { name: 'globals', slug: 'globals', when: 'Default namespace when locals not given' },
  ],

  faq: [
    {
      q: 'How is exec different from eval?',
      a: 'eval takes an EXPRESSION and returns its value. exec takes STATEMENTS (arbitrary Python code) and returns None. Use eval when you need a value; use exec when you need side effects on a namespace.',
    },
    {
      q: 'Why does exec inside a function not create local variables?',
      a: 'Python compiles function locals into fixed slots at compile time. exec writes into a dict; the compiler does not know about the new name, so accessing it after exec raises NameError. Pass an explicit namespace and read from it.',
    },
    {
      q: 'What is a safe alternative to exec for parsing config?',
      a: 'For data configs: JSON, YAML, TOML. For dispatch: a dict of callables. For dynamic classes: dataclasses, attrs, or the type() constructor. Almost every use of exec has a structured alternative.',
    },
  ],

  history: [
    { version: '3.0', note: 'exec became a function (was a statement in Python 2).' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#exec',
    meta:  'exec',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Use JSON instead of exec for data' },
  ],
};