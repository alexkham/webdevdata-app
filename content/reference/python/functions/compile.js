// content/reference/python/functions/compile.js

export const meta = {
  slug:        'compile',
  name:        'compile',
  signature:   'compile(source, filename, mode, flags=0, dont_inherit=False, optimize=-1)',
  blurb:       'Compile Python source into a reusable code object — the precursor to eval / exec.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'compile code object bytecode eval exec ast parse mode single expression',
};

export const method = {
  slug:      'compile',
  name:      'compile',
  signature: 'compile(source, filename, mode, flags=0, dont_inherit=False, optimize=-1)',
  returns:   { type: 'code', desc: 'A compiled code object usable by eval, exec, or exec via direct call. Precompiling once and running many times is faster than passing the source string to eval/exec each iteration.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Precompile source once; execute many times. Also the entry point for AST-based code transformation.',

  cheat: {
    commonCall: 'code = compile(src, "<str>", "exec")',
    returns:    'a code object',
    replaces:   'passing raw source to eval/exec every time',
    watchOut:   'the same security warnings as eval/exec — the code object still runs arbitrary Python',
  },

  parameters: [
    { name: 'source',       type: 'str | bytes | ast', required: true,  default: null,    desc: 'The source code. String, bytes, or an ast.AST object (for AST-based tools).' },
    { name: 'filename',     type: 'str',               required: true,  default: null,    desc: 'The filename used in error messages and tracebacks. Use "<str>" or "<stdin>" when the source is not from a file.' },
    { name: 'mode',         type: 'str',               required: true,  default: null,    desc: '"exec" for statements (any code), "eval" for a single expression, "single" for interactive single-statement mode.' },
    { name: 'flags',        type: 'int',               required: false, default: '0',     desc: 'Compilation flags. Rarely set directly; the ast module uses this for feature flags like PyCF_ONLY_AST.' },
    { name: 'dont_inherit', type: 'bool',              required: false, default: 'False', desc: 'Whether to inherit __future__ flags from the caller.' },
    { name: 'optimize',     type: 'int',               required: false, default: '-1',    desc: 'Optimization level. -1 = current interpreter setting; 0 = none; 1 = -O; 2 = -OO (drop docstrings).' },
  ],

  demoParams: [
    { name: 'source', type: 'str', hint: 'source code', input: 'text' },
    { name: 'mode',   type: 'str', hint: 'mode: exec / eval / single', input: 'text' },
  ],
  cases: [
    { id: 'expr',   label: 'expression',      values: { source: '1 + 2 * 3',           mode: 'eval' } },
    { id: 'stmt',   label: 'statement',       values: { source: 'x = 1',                mode: 'exec' } },
    { id: 'multi',  label: 'multi-line',      values: { source: 'a = 1\nb = 2\nc = a + b', mode: 'exec' } },
    { id: 'wrong-mode', label: 'wrong mode',   values: { source: 'x = 1',                mode: 'eval' } },
    { id: 'syntax-err', label: 'syntax error', values: { source: 'x =',                  mode: 'exec' } },
  ],
  demoExplainer: 'compile turns source code into a reusable code object. The MODE matters: "eval" for a single EXPRESSION (the result is a value); "exec" for STATEMENTS (side effects only). Compiling once and running many times is faster than re-parsing on each call. compile is also the gateway to AST-based tooling — passing an ast.AST parses it back to a code object.',

  patterns: [
    {
      name: 'Precompile a hot code path',
      desc: 'Same source run many times? Compile once.',
      code: 'code = compile(source, "<hot>", "exec")\nfor row in rows:\n    exec(code, {"row": row})',
    },
    {
      name: 'AST inspection',
      desc: 'compile the source to an AST node first; walk it before executing.',
      code: 'import ast\ntree = compile(src, "<file>", "exec", flags=ast.PyCF_ONLY_AST)\nast.walk(tree)',
    },
    {
      name: 'Explicit mode for eval',
      desc: 'compile with mode="eval" for expressions; use eval() on the result.',
      code: 'code = compile("1 + 2", "<expr>", "eval")\neval(code)   # 3',
    },
    {
      name: 'For untrusted input — do NOT reach for compile',
      desc: 'Precompiling untrusted source is still arbitrary code execution. compile is a performance tool for TRUSTED source, not a sandbox.',
      code: '# BAD: compile(user_input, ...) — still unsafe\n# GOOD: use ast.literal_eval for data',
    },
  ],

  examples: [
    { title: 'For eval',           code: 'c = compile("1 + 2", "<e>", "eval")\neval(c)', returns: '3' },
    { title: 'For exec',           code: 'c = compile("x = 1", "<e>", "exec")\nexec(c)', returns: 'None (x is now 1)' },
    { title: 'Type is code',       code: 'type(compile("1", "<e>", "eval"))',            returns: "<class 'code'>" },
    { title: 'Wrong mode fails',    code: 'compile("x = 1", "<e>", "eval")',              returns: 'SyntaxError: invalid syntax' },
    { title: 'AST from source',     code: 'compile(src, "<e>", "exec", ast.PyCF_ONLY_AST)', returns: 'an ast.Module' },
    { title: 'Syntax error',        code: 'compile("x =", "<e>", "exec")',                 returns: 'SyntaxError' },
  ],

  pitfalls: [
    {
      name: 'Mode "eval" requires an EXPRESSION, mode "exec" allows statements',
      desc: 'A common typo. eval-mode rejects `x = 1` with SyntaxError; exec-mode accepts anything. Pick the mode that matches the source.',
      wrong: { label: 'Wrong mode', code: 'compile("x = 1", "<e>", "eval")', output: 'SyntaxError: invalid syntax' },
      fix:   { label: 'Exec mode',   code: 'compile("x = 1", "<e>", "exec")', output: 'code object' },
    },
    {
      name: 'compile is NOT a sandbox',
      desc: 'Precompiling untrusted source is still arbitrary code execution once it runs. compile is a performance and tooling primitive, not a security boundary.',
      wrong: { label: 'False safety', code: 'code = compile(untrusted, ...)\nexec(code)', output: 'still executes user code' },
      fix:   { label: 'Use ast.literal_eval', code: 'import ast\nast.literal_eval(untrusted)', output: 'literals only' },
    },
    {
      name: 'The filename argument is for tracebacks, not the file system',
      desc: 'compile does NOT read from a file — the filename is only used to label the code object for error messages. Pass a descriptive placeholder when the source is not from disk.',
      wrong: { label: 'Assumed I/O', code: 'compile("data.txt", "data.txt", "exec")', output: 'compiles the literal string, not the file' },
      fix:   { label: 'Read first',   code: 'src = open("data.txt").read()\ncompile(src, "data.txt", "exec")', output: 'as intended' },
    },
    {
      name: 'Optimize=2 drops docstrings — check before using',
      desc: 'Optimize level 2 removes docstrings from the compiled code. Tools that read __doc__ (Sphinx, help(), doctest) will fail.',
      wrong: { label: 'Docstrings gone', code: 'compile(src, "<e>", "exec", optimize=2)', output: '__doc__ becomes None' },
      fix:   { label: 'Default optimize',  code: 'compile(src, "<e>", "exec")', output: 'docstrings preserved' },
    },
  ],

  when: {
    use: [
      'Precompiling a template that runs many times',
      'AST-based code inspection or transformation',
      'Frameworks that generate and cache code (dataclasses, ORMs)',
      'Interactive REPLs that want single-statement mode',
    ],
    avoid: [
      'Untrusted source → not a sandbox',
      'A single one-shot exec → the compile overhead is not worth it',
      'Reading a file → do the reading yourself, then compile',
      'Data parsing → json / ast.literal_eval',
    ],
  },

  notes: {
    complexity: 'O(size of source) — a real parser runs',
    return:     'A code object',
    cpython:    'Python/bltinmodule.c :: builtin_compile',
    memory:     'Allocates a code object; smaller than source',
    threadSafe: 'Yes for the compile step; execution depends on the code',
  },

  related: [
    { name: 'eval',    slug: 'eval',    when: 'Execute an expression code object' },
    { name: 'exec',    slug: 'exec',    when: 'Execute a statement code object' },
    { name: 'globals', slug: 'globals', when: 'Default namespace for exec of the code' },
  ],

  faq: [
    {
      q: 'Why precompile if I only run once?',
      a: 'You should NOT — the compile overhead is wasted. Just pass the source to eval/exec directly. Precompile only when the same source runs multiple times.',
    },
    {
      q: 'How is compile different from ast.parse?',
      a: 'ast.parse returns an AST tree only. compile can produce either an AST (with PyCF_ONLY_AST) or a runnable code object. For most AST work, ast.parse is more direct; compile is the way when you want to run it.',
    },
    {
      q: 'What is "single" mode for?',
      a: 'Interactive-style: compile ONE statement. Used by REPLs — it treats a lone expression at top level as \"print the value\", which is how the REPL echoes results.',
    },
  ],

  history: [
    { version: '1.0', note: 'compile() has been a builtin since Python 1.0.' },
    { version: '2.6', note: 'Accepts ast.AST objects as source.' },
    { version: '3.2', note: 'Added optimize parameter.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#compile',
    meta:  'compile',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect AST structure' },
  ],
};