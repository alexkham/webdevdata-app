// content/reference/python/functions/input.js

export const meta = {
  slug:        'input',
  name:        'input',
  signature:   'input(prompt=&apos;&apos;)',
  blurb:       'Read a line from stdin — always returns str, trailing newline stripped.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'input read stdin prompt line user readline string always str raw_input',
};

export const method = {
  slug:      'input',
  name:      'input',
  signature: 'input(prompt=&apos;&apos;)',
  returns:   { type: 'str', desc: 'The user&apos;s input as a string. Reads until newline; the trailing newline is stripped. ALWAYS returns str — even if the user types a number. Cast with int() / float() if you need a number.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Read one line from stdin. Always str — cast if you need a number. Not for interactive apps.',

  cheat: {
    commonCall: 'name = input("Your name: ")',
    returns:    'str — always',
    replaces:   'the Python 2 `raw_input()` (Python 2 `input` evaluated the expression — a security hazard, now removed)',
    watchOut:   'always returns str; cast with int()/float() to get a number; raises EOFError at end-of-input',
  },

  parameters: [
    { name: 'prompt', type: 'str', required: false, default: '""', desc: 'Optional prompt written to stdout without a trailing newline before reading. Empty string (default) skips the prompt.' },
  ],

  demoParams: [
    { name: 'prompt', type: 'str', hint: 'prompt to show',           input: 'text' },
    { name: 'typed',  type: 'str', hint: 'what the user &quot;typed&quot;', input: 'text' },
  ],
  cases: [
    { id: 'name',   label: 'get a name',      values: { prompt: 'Your name: ',  typed: 'Alice' } },
    { id: 'age',    label: 'age as string',   values: { prompt: 'Your age: ',   typed: '42' } },
    { id: 'blank',  label: 'no prompt',       values: { prompt: '',              typed: 'hello' } },
    { id: 'yesno',  label: 'yes / no',        values: { prompt: 'Continue? ',    typed: 'yes' } },
    { id: 'empty',  label: 'blank input',     values: { prompt: 'Anything: ',    typed: '' } },
    { id: 'trail',  label: 'trailing space',  values: { prompt: 'Path: ',        typed: '/tmp/foo ' } },
  ],
  demoExplainer: 'input() writes the prompt (if any), then reads one line from stdin. The trailing newline is stripped; internal whitespace is preserved. The return type is ALWAYS str — the user typing 42 gives &quot;42&quot; (a string), NOT the integer 42. To get a number, cast with int() or float(). The demo simulates the &quot;typed&quot; input to show what would be returned.',

  patterns: [
    {
      name: 'Get a string with a prompt',
      desc: 'The everyday use.',
      code: 'name = input("Your name: ")',
    },
    {
      name: 'Get a number by casting',
      desc: 'input never returns a number — always cast.',
      code: 'age = int(input("Age: "))',
    },
    {
      name: 'Validate with try/except',
      desc: 'Casting can raise ValueError — handle gracefully.',
      code: 'try:\n    age = int(input("Age: "))\nexcept ValueError:\n    print("must be a number")',
    },
    {
      name: 'Case-insensitive yes/no check',
      desc: 'Casefold before comparing to avoid case bugs.',
      code: 'if input("Continue? ").strip().casefold() in ("y", "yes"):\n    ...',
    },
    {
      name: 'Prefer argparse for scripts',
      desc: 'CLI args are more testable than interactive prompts.',
      code: '# argparse for tools; input() is for interactive prototypes',
    },
  ],

  examples: [
    { title: 'Basic',              code: 'input("Name: ")',              returns: '"Alice"  # whatever the user typed' },
    { title: 'Always str',         code: 'x = input("Number: ")\ntype(x)', returns: "<class 'str'>  # even if they typed 42" },
    { title: 'Cast to int',        code: 'age = int(input("Age: "))',    returns: '42' },
    { title: 'Cast to float',      code: 'pi = float(input("π: "))',     returns: '3.14' },
    { title: 'Blank input',        code: 'input("Anything: ")',           returns: '""  # empty string' },
    { title: 'End of input',       code: 'input()   # at EOF',            returns: 'EOFError' },
  ],

  pitfalls: [
    {
      name: 'input() ALWAYS returns str',
      desc: 'The single most common input() bug. Even if the user types a number, you get the string form. Arithmetic on the result raises TypeError until you cast.',
      wrong: { label: 'String math', code: 'x = input("Age: ")\nx + 1', output: "TypeError: can only concatenate str (not \"int\") to str" },
      fix:   { label: 'Cast to int', code: 'x = int(input("Age: "))\nx + 1', output: '43' },
    },
    {
      name: 'The int() cast raises ValueError on non-numeric input',
      desc: 'A user typing &quot;forty-two&quot; instead of &quot;42&quot; will crash your program if int() is unguarded. Wrap in try/except or validate first.',
      wrong: { label: 'Uncaught error', code: 'int(input("Age: "))   # user types &quot;abc&quot;', output: "ValueError: invalid literal for int() with base 10: 'abc'" },
      fix:   { label: 'Guarded cast',   code: 'try:\n    age = int(input("Age: "))\nexcept ValueError:\n    ...', output: 'handled' },
    },
    {
      name: 'EOFError at end of input',
      desc: 'When stdin runs out (piped input finished, Ctrl+D pressed), input() raises EOFError. In loops that read until quit, catch it or check for a specific sentinel.',
      wrong: { label: 'Uncaught EOF', code: 'while True:\n    line = input()', output: 'EOFError after stdin closes' },
      fix:   { label: 'Try/except',    code: 'try:\n    while True:\n        line = input()\nexcept EOFError:\n    ...', output: 'clean exit' },
    },
    {
      name: 'Python 2 input() vs raw_input()',
      desc: 'Python 2 had TWO functions: input() (which called eval() — dangerous!) and raw_input() (which returned a string). Python 3 renamed raw_input to input and removed the eval-based version. If porting old Python 2 code, watch for input() calls that assumed evaluation.',
      wrong: { label: 'Assumed eval', code: 'x = input("expr: ")   # Python 2: evaluated', output: 'silently different in Python 3' },
      fix:   { label: 'Explicit eval', code: 'x = eval(input("expr: "))   # only if safe!', output: 'clear intent' },
    },
  ],

  when: {
    use: [
      'Interactive prompts in scripts and prototypes',
      'REPL-like tools where the user types responses',
      'Quick one-off &quot;ask the user&quot; questions',
      'Learning material — input is the canonical &quot;get user data&quot; teaching tool',
    ],
    avoid: [
      'Command-line arguments → argparse',
      'GUI applications → the GUI framework&apos;s dialogs',
      'Web apps → the HTTP request',
      'Batch processing → read from a file or stdin non-interactively',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the line',
    return:     'A string — always',
    cpython:    'Python/bltinmodule.c :: builtin_input — reads from stdin, strips trailing newline',
    memory:     'Allocates one string',
    threadSafe: 'Depends on the underlying stdin; not usually a concern in typical scripts',
  },

  related: [
    { name: 'print', slug: 'print', when: 'Write output — the natural companion to input' },
    { name: 'int',   slug: 'int',   when: 'Cast the string result to an integer' },
    { name: 'float', slug: 'float', when: 'Cast the string result to a float' },
    { name: 'str',   slug: 'str',   when: 'Reassure yourself that input already returns str' },
  ],

  faq: [
    {
      q: 'Why does the addition fail after input()?',
      a: 'Because input() returns a string. `"42" + 1` is a type error. Cast with `int(input(...))` or `float(input(...))` if you need a number.',
    },
    {
      q: 'How do I get multiple values on one line?',
      a: 'Read one line, then split it: `a, b = input().split()` — or use `map(int, input().split())` for numbers. Common in competitive programming.',
    },
    {
      q: 'What if the user presses enter without typing?',
      a: 'input() returns an empty string. Check for it if a blank response should be handled specially.',
    },
    {
      q: 'How do I mask a password?',
      a: 'Use `getpass.getpass()` from the getpass module — same semantics, hides input from the terminal.',
    },
  ],

  history: [
    { version: '1.0', note: 'input() and raw_input() both present in Python 1.0.' },
    { version: '3.0', note: 'raw_input renamed to input; the eval-based input removed for security.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#input',
    meta:  'input',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect input data' },
  ],
};