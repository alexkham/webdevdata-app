// content/reference/python/exceptions/syntaxerror.js

export const meta = {
  slug:        'syntaxerror',
  name:        'SyntaxError',
  signature:   'SyntaxError(message, details)',
  blurb:       'Raised when the parser cannot read the source code — before a single line of it runs.',
  category:    'import-syntax',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'syntaxerror syntax error invalid syntax was never closed unmatched parenthesis bracket does not match perhaps you forgot a comma expected colon unterminated string literal compile eval exec parser lineno offset',
};

export const method = {
  slug:      'syntaxerror',
  name:      'SyntaxError',
  signature: 'SyntaxError(message, details)',

  category:    'Import / syntax exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The parser rejected the code before it ran — so no try/except inside that file can catch it, and the reported line is where the parser gave up, not always where the mistake is.',

  chain: ['BaseException', 'Exception', 'SyntaxError'],

  cheat: {
    raisedBy: 'running/importing a .py file, compile(), exec(), eval(), ast.parse()',
    message:  "'(' was never closed · unmatched ')' · invalid syntax · expected ':'",
    quickFix: 'look at the caret line AND the line above it',
    watchOut: 'a bracket left open on line 10 can be reported far below',
  },

  parameters: [
    { name: 'message', type: 'str', required: false, default: null, desc: 'The error text, stored as e.msg. str(e) adds " (filename, line N)" when details are given.' },
    { name: 'details', type: 'tuple', required: false, default: null, desc: '(filename, lineno, offset, text) or, since 3.10, (filename, lineno, offset, text, end_lineno, end_offset). Each item becomes an attribute.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Type any line of code. The demo keeps only its brackets ()[]{} and compiles that — the same checks the parser runs on your real code, narrowed to bracket matching.',
      params: [{ name: 'code', type: 'str', hint: 'only brackets are kept', input: 'text' }],
      template: "# brackets only: everything else is stripped\nsrc = ''.join(c for c in {$code} if c in '()[]{}')\ncompile(src, '<demo>', 'eval')\n'compiles'",
      cases: [
        { id: 'unclosed',  label: 'print((1, 2)',        values: { code: 'print((1, 2)' } },
        { id: 'mismatch',  label: 'x = [1, 2)',          values: { code: 'x = [1, 2)' } },
        { id: 'unmatched', label: 'f(x))',               values: { code: 'f(x))' } },
        { id: 'comma',     label: '[(1, 2) {3}]',        values: { code: '[(1, 2) {3}]' } },
        { id: 'ok',        label: '{"a": [1, (2, 3)]}',  values: { code: '{"a": [1, (2, 3)]}' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch it around compile() and read the pieces: e.msg is the text, e.offset the 1-based column the caret points at.',
      params: [{ name: 'code', type: 'str', hint: 'only brackets are kept', input: 'text' }],
      template: "src = ''.join(c for c in {$code} if c in '()[]{}')\ntry:\n    compile(src, '<demo>', 'eval')\n    r = 'compiles'\nexcept SyntaxError as e:\n    r = (e.msg, e.offset)\nr",
      cases: [
        { id: 'unclosed', label: 'call((1, 2)',  values: { code: 'call((1, 2)' } },
        { id: 'late',     label: 'a[0]) + b',    values: { code: 'a[0]) + b' } },
        { id: 'adjacent', label: '([] {})',      values: { code: '([] {})' } },
      ],
    },
  ],
  demoExplainer: "Watch which bracket gets blamed. For print((1, 2) the error names the innermost '(' that is still open — the one right after print — and in Handle mode e.offset is the column of that opener, not the end of the line. A stray closer is reported at the closer itself; two complete expressions side by side inside brackets get the comma hint. Balanced brackets can still fail: () [] at top level is just invalid syntax.",

  attributes: [
    { name: 'msg',        type: 'str',        meaning: "The bare message, e.g. \"'(' was never closed\". str(e) is msg plus \" (filename, line N)\"." },
    { name: 'filename',   type: 'str | None', meaning: "File name given to compile() or the path of the module being imported; '<string>' for exec()/eval() text." },
    { name: 'lineno',     type: 'int | None', meaning: '1-based line of the error.' },
    { name: 'offset',     type: 'int | None', meaning: '1-based column the caret points at.' },
    { name: 'text',       type: 'str | None', meaning: 'The source line involved, usually with its newline.' },
    { name: 'end_lineno', type: 'int | None', meaning: 'Line where the highlighted range ends (3.10+).' },
    { name: 'end_offset', type: 'int | None', meaning: 'Column where the highlighted range ends (3.10+); 0 when there is no range.' },
  ],

  patterns: [
    {
      name: 'Validate user-supplied expressions',
      desc: 'Parse first, report the position, never eval what you have not parsed.',
      code: "import ast\ndef check(expr):\n    try:\n        ast.parse(expr, mode='eval')\n    except SyntaxError as e:\n        return f'{e.msg} at column {e.offset}'\n    return None",
    },
    {
      name: 'Syntax-check files without running them',
      desc: 'python -m py_compile file.py does the same from the shell; compile() never executes the code.',
      code: "def syntax_ok(path):\n    with open(path, encoding='utf-8') as f:\n        source = f.read()\n    try:\n        compile(source, path, 'exec')\n    except SyntaxError as e:\n        print(f'{e.filename}:{e.lineno}:{e.offset}: {e.msg}')\n        return False\n    return True",
    },
    {
      name: 'Optional newer syntax in a separate module',
      desc: 'A SyntaxError happens while a module is compiled, so a try/except around the import is the only place it can be caught.',
      code: "try:\n    from ._fast_path import run  # uses syntax newer Pythons understand\nexcept SyntaxError:\n    from ._compat import run",
    },
  ],

  examples: [
    { title: 'An open bracket at the end',      code: "compile('print((1, 2)', '<demo>', 'exec')",                   returns: "SyntaxError: '(' was never closed" },
    { title: 'Wrong closing bracket',           code: "try:\n    compile('x = [1, 2)', 'app.py', 'exec')\nexcept SyntaxError as e:\n    r = (e.msg, e.filename, e.lineno, e.offset, e.text)\nr", returns: "(\"closing parenthesis ')' does not match opening parenthesis '['\", 'app.py', 1, 10, 'x = [1, 2)')" },
    { title: 'Python 2 print',                  code: "compile('print \"hello\"', '<demo>', 'exec')",                returns: "SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?" },
    { title: '= where == was meant',            code: "compile('if x = 1:\\n    pass', '<demo>', 'exec')",          returns: "SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?" },
    { title: 'Missing colon',                   code: "compile('def f()\\n    return 1', '<demo>', 'exec')",       returns: "SyntaxError: expected ':'" },
    { title: 'Missing comma in a dict',         code: "compile(\"d = {'a': 1 'b': 2}\", '<demo>', 'exec')",         returns: 'SyntaxError: invalid syntax. Perhaps you forgot a comma?' },
    { title: 'Unterminated string',             code: "compile(\"s = 'abc\", '<demo>', 'exec')",                     returns: 'SyntaxError: unterminated string literal (detected at line 1)' },
    { title: 'str(e) adds file and line',       code: "e = SyntaxError('bad token', ('conf.txt', 3, 5, 'x = = 1\\n'))\n(str(e), e.msg, e.lineno, e.offset)", returns: "('bad token (conf.txt, line 3)', 'bad token', 3, 5)" },
  ],

  pitfalls: [
    {
      name: 'try/except cannot catch a SyntaxError in its own file',
      desc: 'The whole file is compiled before any line runs, so the try statement never starts. Code that must survive bad syntax has to compile it separately — compile(), exec(), or an import.',
      wrong: { label: 'Same source', code: "try:\n    x = (1, 2\nexcept SyntaxError:\n    x = None", output: "SyntaxError: '(' was never closed" },
      fix:   { label: 'Compile separately', code: "src = 'x = (1, 2'\ntry:\n    compile(src, '<config>', 'exec')\n    ok = True\nexcept SyntaxError:\n    ok = False\nok", output: 'False' },
    },
    {
      name: 'The reported line is where the parser gave up',
      desc: "A bracket opened earlier makes every following line part of the same expression. The message names the real culprit — here the '(' on line 1 — even though the parse ran on to line 3.",
      wrong: { label: 'Look only at the last line', code: "src = 'total = sum(prices\\nprint(total)\\ncount = 3'\ntry:\n    compile(src, 'app.py', 'exec')\nexcept SyntaxError as e:\n    r = (e.msg, e.lineno)\nr", output: "(\"'(' was never closed\", 1)" },
      fix:   { label: 'Close it where it opens', code: "src = 'total = sum(prices)\\nprint(total)\\ncount = 3'\ncompile(src, 'app.py', 'exec') is not None", output: 'True' },
    },
    {
      name: 'Catching Exception catches SyntaxError from eval()',
      desc: "When you eval() user text, a broad except hides whether the input was malformed or the code failed at run time. Catch SyntaxError first and report it as bad input.",
      wrong: { label: 'except Exception', code: "def calc(expr):\n    try:\n        return eval(expr)\n    except Exception:\n        return 'error'\ncalc('2 +* 3')", output: "'error'" },
      fix:   { label: 'SyntaxError first', code: "def calc(expr):\n    try:\n        return eval(expr)\n    except SyntaxError as e:\n        return f'bad input: {e.msg}'\n    except Exception as e:\n        return f'failed: {type(e).__name__}'\ncalc('2 +* 3')", output: "'bad input: invalid syntax'" },
    },
  ],

  when: {
    use: [
      'Raising it from your own parser or DSL, with (filename, lineno, offset, text) so tools can point at the spot',
      'Catching it around compile()/exec()/eval()/ast.parse() of text you did not write',
      'Catching it around an import of optional code that needs a newer Python',
    ],
    avoid: [
      'Wrapping your own module in try/except SyntaxError → it can never run; fix the file',
      'Validating JSON or config with eval() → json.loads / ast.literal_eval',
      'Checking the Python version for new syntax → keep that code in a separate module',
    ],
  },

  notes: {
    cpython:        'Parser/pegen_errors.c — tokenizer errors (unmatched, mismatched, never closed) and parser errors; a second parse pass runs extra invalid_* rules to produce the friendly hints',
    'Catch via':    'except SyntaxError also catches IndentationError and TabError (subclasses)',
    'Warnings too': 'SyntaxWarning turned into an error with -W error is re-raised as SyntaxError',
  },

  related: [
    { name: 'IndentationError', slug: 'indentationerror', when: 'The indentation-specific subclass (and TabError)' },
    { name: 'Warning',          slug: 'warning',          when: 'SyntaxWarning: dubious but legal code' },
    { name: 'compile()',        slug: 'compile',          when: 'Parse text without running it', category: 'functions' },
    { name: 'eval()',           slug: 'eval',             when: 'Raises SyntaxError for malformed input', category: 'functions' },
    { name: 'exec()',           slug: 'exec',             when: 'Same, for statements', category: 'functions' },
    { name: 'ImportError',      slug: 'importerror',      when: 'The other error you meet while importing' },
  ],

  faq: [
    {
      q: 'How do I fix "SyntaxError: invalid syntax" in Python?',
      a: "Look at the line with the caret and the line before it. The most common causes are a missing colon after if/for/def/class, a missing comma between items, an unclosed bracket or quote on an earlier line, = instead of ==, and Python 2 code such as print \"x\". Python 3.10+ often replaces the generic message with a specific hint (expected ':', Perhaps you forgot a comma?, Missing parentheses in call to 'print').",
    },
    {
      q: "What does \"'(' was never closed\" mean?",
      a: "A bracket was opened and the file (or the string passed to compile/eval) ended before it was closed. The error points at the innermost bracket still open, so in print((1, 2) it is the '(' right after print. Earlier Pythons reported this as unexpected EOF while parsing, usually on the wrong line.",
    },
    {
      q: 'Why does the error point to a line that looks fine?',
      a: 'Inside an open bracket, newlines do not end the statement, so the parser keeps reading following lines as part of the same expression and fails later. Scan upwards for an unclosed (, [, { or quote. The message often names the opener and its position, which is the line to fix.',
    },
    {
      q: 'Can I catch a SyntaxError with try/except?',
      a: 'Only when the bad code is compiled separately from the try statement: text passed to compile(), exec(), eval() or ast.parse(), or a module you import inside the try. A syntax error in the same file stops the whole file from compiling, so nothing in it runs.',
    },
    {
      q: 'What is the difference between SyntaxError and IndentationError?',
      a: 'IndentationError is a subclass of SyntaxError for indentation problems (expected an indented block, unexpected indent, unindent does not match any outer indentation level); TabError is a further subclass for mixed tabs and spaces. except SyntaxError catches all three.',
    },
  ],

  history: [
    { version: '3.10', note: 'Added the end_lineno and end_offset attributes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#SyntaxError',
    meta:  'Built-in exceptions',
  },
};
