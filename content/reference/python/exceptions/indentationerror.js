// content/reference/python/exceptions/indentationerror.js

export const meta = {
  slug:        'indentationerror',
  name:        'IndentationError',
  signature:   'IndentationError(message, details)',
  blurb:       'Raised when the indentation of a block is wrong: a missing body, an unexpected indent, a dedent to a level that never existed, or (TabError) tabs mixed with spaces.',
  category:    'import-syntax',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'indentationerror taberror indentation error tab error expected an indented block unexpected indent unindent does not match any outer indentation level inconsistent use of tabs and spaces in indentation whitespace',
};

export const method = {
  slug:      'indentationerror',
  name:      'IndentationError',
  signature: 'IndentationError(message, details)',

  category:    'Import / syntax exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'In Python the indentation is the block structure, so a wrong indent is a syntax error — raised at compile time, with TabError as the special case for tabs and spaces that only line up at some tab widths.',

  chain: ['BaseException', 'Exception', 'SyntaxError', 'IndentationError'],

  cheat: {
    raisedBy: 'compiling a file, exec(), compile() — never while code runs',
    message:  'expected an indented block after … · unexpected indent · unindent does not match any outer indentation level',
    quickFix: 'indent with 4 spaces everywhere; an empty body needs pass',
    watchOut: 'TabError: a tab and 8 spaces look identical but are rejected',
  },

  parameters: [
    { name: 'message', type: 'str', required: false, default: null, desc: 'The error text (e.msg).' },
    { name: 'details', type: 'tuple', required: false, default: null, desc: 'Same as SyntaxError: (filename, lineno, offset, text[, end_lineno, end_offset]).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'A three-line loop. Choose how many spaces indent line 2 and line 3 — the numbers decide whether line 3 is inside the loop, after it, or an error.',
      params: [
        { name: 'first',  type: 'int', hint: 'spaces before line 2', input: 'number' },
        { name: 'second', type: 'int', hint: 'spaces before line 3', input: 'number' },
      ],
      template: "src = 'for i in range(3):\\n' + ' ' * {$first} + 'n += 1\\n' + ' ' * {$second} + 'n += 10\\n'\nn = 0\nexec(src)\nn",
      cases: [
        { id: 'inside',   label: '4 / 4', values: { first: '4', second: '4' } },
        { id: 'after',    label: '4 / 0', values: { first: '4', second: '0' } },
        { id: 'nobody',   label: '0 / 4', values: { first: '0', second: '4' } },
        { id: 'deeper',   label: '4 / 8', values: { first: '4', second: '8' } },
        { id: 'between',  label: '4 / 2', values: { first: '4', second: '2' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Line 2 is indented with tabs, line 3 with spaces. except IndentationError also catches TabError — the tuple shows which one you got.',
      params: [
        { name: 'tabs',   type: 'int', hint: 'tabs before line 2',   input: 'number' },
        { name: 'spaces', type: 'int', hint: 'spaces before line 3', input: 'number' },
      ],
      template: "src = 'for i in range(3):\\n' + '\\t' * {$tabs} + 'n += 1\\n' + ' ' * {$spaces} + 'n += 10\\n'\ntry:\n    compile(src, '<demo>', 'exec')\n    r = 'compiles'\nexcept IndentationError as e:\n    r = (type(e).__name__, e.msg, e.lineno)\nr",
      cases: [
        { id: 'tab8',   label: '1 tab / 8 spaces', values: { tabs: '1', spaces: '8' } },
        { id: 'tab4',   label: '1 tab / 4 spaces', values: { tabs: '1', spaces: '4' } },
        { id: 'tab0',   label: '1 tab / 0 spaces', values: { tabs: '1', spaces: '0' } },
        { id: 'tab9',   label: '1 tab / 9 spaces', values: { tabs: '1', spaces: '9' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, 4 / 4 gives 33 (line 3 runs three times inside the loop) and 4 / 0 gives 13 (once, after it) — same code, different meaning. 4 / 2 dedents to a column no enclosing block uses. In Handle, a tab and 8 spaces reach the same column, yet Python raises TabError: it also measures every line with a tab counted as 1 column, and the two measurements must agree about which lines line up.",

  attributes: [
    { name: 'msg',    type: 'str',        meaning: "The message, e.g. \"expected an indented block after 'if' statement on line 1\" — note it names the statement and line that needed the block." },
    { name: 'lineno', type: 'int | None', meaning: 'The line with the bad indentation (for a missing block, the line that should have been indented).' },
    { name: 'text',   type: 'str | None', meaning: 'That source line.' },
    { name: 'offset / filename / end_lineno / end_offset', type: 'int | str | None', meaning: 'Inherited from SyntaxError.' },
  ],

  patterns: [
    {
      name: 'An empty block needs a statement',
      desc: 'pass, ... or a docstring all count as a body. A comment does not.',
      code: "def not_ready_yet():\n    pass\n\nclass Placeholder:\n    \"\"\"Filled in later.\"\"\"",
    },
    {
      name: 'Dedent code stored in strings',
      desc: 'Source kept in an indented triple-quoted string starts with spaces — dedent it before compile()/exec().',
      code: "import textwrap\nsnippet = '''\n    def f():\n        return 1\n'''\nexec(textwrap.dedent(snippet))",
    },
    {
      name: 'Normalize tabs in legacy files',
      desc: 'Convert tabs to spaces once (editor "convert indentation", or expandtabs), then keep a single style.',
      code: "with open('legacy.py', encoding='utf-8') as f:\n    fixed = f.read().expandtabs(4)",
    },
  ],

  examples: [
    { title: 'Block without a body',           code: "src = 'if ok:\\nreturn 1'\ntry:\n    compile(src, 'app.py', 'exec')\nexcept IndentationError as e:\n    r = (e.msg, e.lineno, e.text)\nr", returns: "(\"expected an indented block after 'if' statement on line 1\", 2, 'return 1\\n')" },
    { title: 'One space too many',             code: "src = 'def f():\\n    x = 1\\n     return x'\ncompile(src, 'app.py', 'exec')", returns: 'IndentationError: unexpected indent' },
    { title: 'Dedent to a level that never existed', code: "src = 'def f():\\n    if x:\\n        pass\\n  return x'\ncompile(src, 'app.py', 'exec')", returns: 'IndentationError: unindent does not match any outer indentation level' },
    { title: 'TabError: 4 spaces then a tab',  code: "src = 'def f():\\n    x = 1\\n\\treturn x'\ncompile(src, 'app.py', 'exec')", returns: 'TabError: inconsistent use of tabs and spaces in indentation' },
    { title: 'Tabs only are fine',             code: "src = 'def f():\\n\\tx = 1\\n\\treturn x'\ncompile(src, 'app.py', 'exec') is not None", returns: 'True' },
    { title: 'TabError is an IndentationError is a SyntaxError', code: "try:\n    compile('if x:\\n    a = 1\\n\\tb = 2', 'app.py', 'exec')\nexcept SyntaxError as e:\n    r = type(e).__mro__[:3]\n[c.__name__ for c in r]", returns: "['TabError', 'IndentationError', 'SyntaxError']" },
    { title: 'Leading spaces in exec()',       code: "exec('  x = 1')", returns: 'IndentationError: unexpected indent' },
  ],

  pitfalls: [
    {
      name: 'A comment is not a block body',
      desc: 'Comments are dropped by the tokenizer, so a block containing only a comment is empty.',
      wrong: { label: 'Comment only', code: "src = 'def todo():\\n    # later\\n'\ncompile(src, 'app.py', 'exec')", output: 'IndentationError: expected an indented block after function definition on line 1' },
      fix:   { label: 'Add pass', code: "src = 'def todo():\\n    # later\\n    pass\\n'\ncompile(src, 'app.py', 'exec') is not None", output: 'True' },
    },
    {
      name: 'Indented code in a triple-quoted string',
      desc: 'The string keeps the indentation of the surrounding source, so its first statement is "unexpectedly" indented.',
      wrong: { label: 'As written', code: "code = '''\n    def f():\n        return 1\n'''\ncompile(code, 'app.py', 'exec')", output: 'IndentationError: unexpected indent' },
      fix:   { label: 'textwrap.dedent', code: "import textwrap\ncode = '''\n    def f():\n        return 1\n'''\ncompile(textwrap.dedent(code), 'app.py', 'exec') is not None", output: 'True' },
    },
    {
      name: 'Pasted code that mixes tabs and spaces',
      desc: 'Lines that look aligned in the editor can be a tab on one line and spaces on the next. Convert the file to spaces instead of adjusting single lines.',
      wrong: { label: 'Mixed', code: "src = 'def f():\\n    x = 1\\n\\treturn x'\ncompile(src, 'app.py', 'exec')", output: 'TabError: inconsistent use of tabs and spaces in indentation' },
      fix:   { label: 'expandtabs(4)', code: "src = 'def f():\\n    x = 1\\n\\treturn x'\ncompile(src.expandtabs(4), 'app.py', 'exec') is not None", output: 'True' },
    },
  ],

  when: {
    use: [
      'Catching it (or SyntaxError) around compile()/exec() of generated or user-supplied code',
      'Raising it from a tool that parses an indentation-based format',
    ],
    avoid: [
      'Catching it in your own module → it is compiled before any try runs; fix the file',
      'Fixing TabError line by line → convert the whole file to spaces',
    ],
  },

  notes: {
    cpython:      'Parser/lexer/lexer.c — each line gets col (tab = next multiple of 8) and altcol (tab = 1); if the two disagree about indent/dedent/same level, TabError. "unexpected indent" and "expected an indented block" come from the parser',
    'Catch via':  'except SyntaxError catches IndentationError and TabError',
    TabError:     'Subclass of IndentationError: "inconsistent use of tabs and spaces in indentation"',
    PEP8:         '4 spaces per level; never mix tabs and spaces',
  },

  related: [
    { name: 'SyntaxError', slug: 'syntaxerror', when: 'The parent class — every other parse error' },
    { name: 'compile()',   slug: 'compile',     when: 'Check source without running it', category: 'functions' },
    { name: 'exec()',      slug: 'exec',        when: 'Runs strings of code — indentation included', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I fix "IndentationError: expected an indented block"?',
      a: "The line after a statement ending in a colon (if, for, while, def, class, with, try, except, match …) must be indented deeper. The message names that statement and its line number. If the block is intentionally empty, write pass (or ...) — a comment alone is not a body.",
    },
    {
      q: 'What does "unindent does not match any outer indentation level" mean?',
      a: 'A line was dedented to a column that no enclosing block uses — for example a block at 8 spaces followed by a line at 2 spaces when the outer levels are 0 and 4. Dedent exactly to one of the enclosing levels. Invisible tabs are a common cause; turn on whitespace rendering in your editor.',
    },
    {
      q: 'What is TabError and how do I fix it?',
      a: 'TabError (a subclass of IndentationError) is raised when tabs and spaces are mixed so that whether two lines line up depends on the tab width. Python checks indentation twice — tabs as 8 columns and tabs as 1 column — and both must agree. Fix it by converting the file to spaces (most editors have "convert indentation to spaces", or use str.expandtabs).',
    },
    {
      q: 'Why do I get "unexpected indent" in exec() or the REPL?',
      a: 'The first statement of a string passed to exec()/compile() must start at column 0. Code copied from inside a function or a triple-quoted string keeps its leading spaces; remove them with textwrap.dedent().',
    },
    {
      q: 'Is IndentationError a SyntaxError?',
      a: 'Yes: TabError → IndentationError → SyntaxError → Exception. It is detected while compiling, so it has the same msg, filename, lineno, offset and text attributes and the same rule: a try/except in the same file cannot catch it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#IndentationError',
    meta:  'Built-in exceptions',
  },
};
