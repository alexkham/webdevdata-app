// content/reference/python/functions/print.js

export const meta = {
  slug:        'print',
  name:        'print',
  signature:   'print(*objects, sep=&apos; &apos;, end=&apos;\\n&apos;, file=sys.stdout, flush=False)',
  blurb:       'Write objects to stdout — customize the separator, the ending, the destination, and the flush.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'print output stdout write display sep end file flush newline space multiple arguments',
};

export const method = {
  slug:      'print',
  name:      'print',
  signature: 'print(*objects, sep=&apos; &apos;, end=&apos;\\n&apos;, file=sys.stdout, flush=False)',
  returns:   { type: 'None', desc: 'Returns None. The output is written to the file (default stdout). Objects are converted via str(); joined with sep between them; end is appended after the last one.' },

  category:    'Built-in function',
  version:     'Python 2.0+ (as statement) / 3.0+ (as function)',
  hasLiveDemo: true,

  subtitle: 'The everyday output tool — customize the separator, the ending, or the file. Not for formatted logging.',

  cheat: {
    commonCall: 'print("hello", name)',
    returns:    'None; text goes to stdout with a trailing newline',
    replaces:   'the Python 2 `print` statement',
    watchOut:   'sep is BETWEEN objects (default space); end is AFTER the last (default newline); pass end=&quot;&quot; to suppress the newline',
  },

  parameters: [
    { name: '*objects', type: 'Any',  required: false, default: '()',    desc: 'Zero or more values to print. Each is converted with str().' },
    { name: 'sep',      type: 'str',  required: false, default: '" "',   desc: 'String inserted between objects. Default is a single space.' },
    { name: 'end',      type: 'str',  required: false, default: '"\\n"', desc: 'String appended after the last object. Default is a newline. Pass "" to suppress the trailing newline.' },
    { name: 'file',     type: 'file', required: false, default: 'sys.stdout', desc: 'Destination file-like object. Use sys.stderr for error output.' },
    { name: 'flush',    type: 'bool', required: false, default: 'False', desc: 'If True, flush the file buffer after writing. Useful for real-time output in scripts.' },
  ],

  demoParams: [
    { name: 'objects', type: 'list', hint: 'comma-separated items to print', input: 'csv' },
    { name: 'sep',     type: 'str',  hint: 'separator (use " " for default)', input: 'text' },
    { name: 'end',     type: 'str',  hint: 'ending (use "\\n" for default)',   input: 'text' },
  ],
  cases: [
    { id: 'defaults',  label: 'defaults',        values: { objects: 'hello,world',       sep: ' ',    end: '\\n' } },
    { id: 'custom-sep',label: 'custom sep',      values: { objects: 'a,b,c',              sep: '-',    end: '\\n' } },
    { id: 'no-end',    label: 'no newline',      values: { objects: 'hello',              sep: ' ',    end: '' } },
    { id: 'end-space', label: 'end with space',  values: { objects: 'hi',                 sep: ' ',    end: ' ' } },
    { id: 'no-sep',    label: 'no separator',    values: { objects: 'a,b,c',              sep: '',     end: '\\n' } },
    { id: 'csv-line',  label: 'csv style',       values: { objects: '1,2,3,4',            sep: ',',    end: '\\n' } },
    { id: 'pipe-sep',  label: 'pipe separator',  values: { objects: '42,3.14,True,None',  sep: ' | ',  end: '\\n' } },
  ],
  demoExplainer: 'print writes each object separated by sep and terminates with end. In real code the DEFAULT sep is a single space and DEFAULT end is a newline (&quot;\\n&quot;). The demo makes both parameters explicit so you can see exactly what the output looks like. To print with no newline, set end=&quot;&quot;. Objects are stringified with str() before printing — non-strings (numbers, None, True/False) are converted automatically. Backslash escapes like \\n and \\t are interpreted.',

  patterns: [
    {
      name: 'Print without newline',
      desc: 'Progress bars, prompts, and inline output.',
      code: 'print("Loading...", end="")',
    },
    {
      name: 'Change the separator',
      desc: 'Comma, tab, or a custom joiner between multiple values.',
      code: 'print("a", "b", "c", sep=" | ")   # "a | b | c"',
    },
    {
      name: 'Print to stderr',
      desc: 'Errors and diagnostics should not pollute stdout.',
      code: 'import sys\nprint("error:", msg, file=sys.stderr)',
    },
    {
      name: 'Force flush for real-time output',
      desc: 'Buffered stdout may not appear immediately — flush ensures visibility.',
      code: 'print("tick", end="", flush=True)',
    },
    {
      name: 'Prefer logging for anything beyond scripts',
      desc: 'For applications, `logging` is the right tool — print is for one-off scripts and prototypes.',
      code: 'import logging\nlogging.info("something happened: %s", detail)',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'print("hello", "world")',       returns: '"hello world\\n"  # to stdout' },
    { title: 'Custom sep',         code: 'print("a", "b", "c", sep="-")',  returns: '"a-b-c\\n"' },
    { title: 'No newline',         code: 'print("hi", end="")',            returns: '"hi"  # no trailing \\n' },
    { title: 'No sep',             code: 'print("a", "b", sep="")',         returns: '"ab\\n"' },
    { title: 'Multiple types',     code: 'print(1, "two", 3.0, None)',      returns: '"1 two 3.0 None\\n"' },
    { title: 'To stderr',          code: 'print("err", file=sys.stderr)',   returns: '"err\\n"  # goes to stderr' },
    { title: 'Empty print',        code: 'print()',                         returns: '"\\n"  # just a blank line' },
  ],

  pitfalls: [
    {
      name: 'sep goes BETWEEN, end goes AFTER',
      desc: 'The most common print-parameter confusion. sep is what separates multiple objects; end is what terminates the whole call. `print("a", "b", sep=" - ", end="!")` produces &quot;a - b!&quot; with no newline.',
      wrong: { label: 'Confused roles', code: 'print("a", "b", sep="!")', output: '"a!b\\n"  # newline still added' },
      fix:   { label: 'end suppresses newline', code: 'print("a", "b", sep=" ", end="!")', output: '"a b!"  # no newline' },
    },
    {
      name: 'print returns None — do not use it in expressions',
      desc: 'A common beginner error, especially when translating from other languages. `x = print(y)` sets x to None.',
      wrong: { label: 'Captured None', code: 'result = print("hello")\ntype(result)', output: "<class 'NoneType'>" },
      fix:   { label: 'Just print',    code: 'print("hello")   # side effect only', output: '' },
    },
    {
      name: 'flush=False by default; output may buffer',
      desc: 'When writing to a pipe (or when Python decides to buffer), print output can lag behind. Progress indicators, prompts, and any &quot;show now&quot; use case need flush=True.',
      wrong: { label: 'Delayed output', code: 'for i in range(5):\n    print(".", end="")\n    time.sleep(1)   # may print nothing until end', output: '.....' },
      fix:   { label: 'Flush each dot', code: 'print(".", end="", flush=True)', output: 'appears immediately' },
    },
    {
      name: 'Python 2 vs Python 3',
      desc: 'Python 2 print was a STATEMENT (`print "hello"` — no parens). Python 3 print is a FUNCTION. In Python 2, `from __future__ import print_function` unlocks the modern syntax; in Python 3, the statement form is a SyntaxError.',
      wrong: { label: 'Py2 syntax', code: 'print "hello"   # in Python 3', output: 'SyntaxError' },
      fix:   { label: 'Function form', code: 'print("hello")', output: 'works everywhere modern' },
    },
  ],

  when: {
    use: [
      'One-off scripts and prototypes',
      'Interactive REPL sessions',
      'Debugging traces (with the understanding that you will remove them)',
      'CLI tools where the output is the point',
    ],
    avoid: [
      'Application logs → use the logging module',
      'Structured output → json.dumps or a serialization library',
      'Reactive UIs — print is a side-effect, not a data flow',
      'Anything you want to test — logging can be captured cleanly',
    ],
  },

  notes: {
    complexity: 'O(n) in the total output length',
    return:     'None',
    cpython:    'Python/bltinmodule.c :: builtin_print — writes via file.write()',
    memory:     'Allocates the joined string, then writes',
    threadSafe: 'Individual print calls are atomic per file, but interleaved output from multiple threads can mix',
  },

  related: [
    { name: 'input',   slug: 'input',   when: 'Read a line from stdin — the input side of the I/O pair' },
    { name: 'format',  slug: 'format',  when: 'Format a value before printing' },
    { name: 'str',     slug: 'str',     when: 'Convert to string before printing' },
    { name: 'repr',    slug: 'repr',    when: 'Print debug-friendly output' },
  ],

  faq: [
    {
      q: 'How do I print without a newline?',
      a: 'Pass end="". By default print adds a newline at the end; end lets you replace or suppress it.',
    },
    {
      q: 'How do I print to stderr?',
      a: 'Pass file=sys.stderr. `import sys` first. Useful for error messages, diagnostics, and progress that should not mix with the tool&apos;s real output.',
    },
    {
      q: 'What is the difference between print(x) and repr(x)?',
      a: 'print calls str(x) to convert; repr(x) returns a debug representation with quotes and escapes. Use `print(repr(x))` when you want unambiguous debug output for x.',
    },
  ],

  history: [
    { version: '2.0', note: 'print was a statement — no parentheses required.' },
    { version: '3.0', note: 'print became a function with keyword arguments (PEP 3105).' },
    { version: '3.3', note: 'flush keyword argument added.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#print',
    meta:  'print',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the printed output' },
  ],
};