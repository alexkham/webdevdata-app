// content/reference/python/keywords/pass.js

export const meta = {
  slug:        'pass',
  name:        'pass',
  signature:   'pass',
  blurb:       'The statement that does nothing — a placeholder where Python’s grammar needs a statement but you have no code yet.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'pass statement do nothing placeholder empty function empty class empty block stub todo ellipsis ... pass vs continue keyword',
};

export const method = {
  slug:      'pass',
  name:      'pass',
  signature: 'pass',

  category:    'Control flow',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'Every def, class, if, loop and except needs an indented body. pass is a body that does nothing — execution just carries on to the next line.',

  covers: ['pass'],

  syntax: [
    { label: 'empty function', code: 'def todo():\n    pass' },
    { label: 'empty class', code: 'class MyError(Exception):\n    pass' },
    { label: 'empty branch', code: 'if ready:\n    pass  # TODO\nelse:\n    wait()' },
  ],

  cheat: {
    useFor:    'stub functions / classes, empty except, a branch you will fill later',
    result:    'a statement — does nothing, has no value',
    pairsWith: 'def, class, if, except, ... (Ellipsis)',
    watchOut:  'pass is not continue: the code after it still runs',
  },

  parameters: [
    { name: '(none)', type: 'statement', required: false, default: null, desc: 'pass takes nothing. It is a complete statement and can appear anywhere a statement can.' },
  ],

  modes: [
    {
      id: 'pass',
      label: 'pass',
      blurb: 'Negative numbers hit the pass branch — which does nothing, so they are appended like every other number.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'out = []\nfor n in {$numbers}:\n    if n < 0:\n        pass\n    out.append(n)\nout',
      cases: [
        { id: 'mixed', label: 'with negatives', values: { numbers: '3, -1, 4, -5' } },
        { id: 'pos',   label: 'all positive',   values: { numbers: '1, 2' } },
        { id: 'empty', label: 'empty list',     values: { numbers: '' } },
      ],
    },
    {
      id: 'continue',
      label: 'same loop with continue',
      blurb: 'The identical loop with continue in place of pass. Now the negatives are skipped — the difference people mix up.',
      params: [{ name: 'numbers', type: 'list', hint: 'comma-separated', input: 'csv-num' }],
      template: 'out = []\nfor n in {$numbers}:\n    if n < 0:\n        continue\n    out.append(n)\nout',
      cases: [
        { id: 'mixed', label: 'with negatives', values: { numbers: '3, -1, 4, -5' } },
        { id: 'pos',   label: 'all positive',   values: { numbers: '1, 2' } },
        { id: 'empty', label: 'empty list',     values: { numbers: '' } },
      ],
    },
  ],
  demoExplainer: 'pass has no behaviour of its own, so the demo shows the one question where it matters: what happens after it. With pass, the result is always the input list unchanged — the if branch exists but does nothing. Switch to the second tab and the same input loses its negatives, because continue skips the append. That difference is the whole reason to know which one you wrote.',

  patterns: [
    {
      name: 'Custom exception class',
      desc: 'The class body only needs to exist; everything is inherited. A docstring works as the body too.',
      code: 'class ConfigError(Exception):\n    pass',
    },
    {
      name: 'Stub to fill in later',
      desc: 'Lets the module import and run while the function is unwritten. It returns None.',
      code: 'def export_report(data):\n    pass  # TODO',
    },
    {
      name: 'Ignore one specific exception',
      desc: 'Only for an error you really expect; contextlib.suppress says the same thing more explicitly.',
      code: 'import os\n\ndef remove_if_exists(path):\n    try:\n        os.remove(path)\n    except FileNotFoundError:\n        pass',
    },
    {
      name: 'Ellipsis in type stubs and protocols',
      desc: 'By convention ... marks "body intentionally left out" in .pyi stubs and abstract / Protocol methods.',
      code: 'from typing import Protocol\n\nclass Closer(Protocol):\n    def close(self) -> None: ...',
    },
  ],

  examples: [
    { title: 'A stub function returns None',     code: 'def todo():\n    pass\nprint(todo())',                               returns: 'None' },
    { title: 'An empty class',                   code: 'class Empty:\n    pass\nEmpty.__name__',                              returns: "'Empty'" },
    { title: 'Execution carries on after pass',  code: "for n in [1, 2]:\n    pass\n    print('after pass', n)",              returns: 'after pass 1\nafter pass 2' },
    { title: 'A body with nothing in it is an error', code: "compile('def f():\\n', '<demo>', 'exec')",                  returns: 'IndentationError: expected an indented block after function definition on line 1' },
    { title: 'A comment is not a statement',     code: "compile('if True:\\n    # later\\n', '<demo>', 'exec')",            returns: "IndentationError: expected an indented block after 'if' statement on line 1" },
    { title: '... is the Ellipsis object',       code: '... is Ellipsis',                                                 returns: 'True' },
    { title: '... works as a body too',          code: 'def later(): ...\nprint(later())',                                returns: 'None' },
    { title: 'pass is not an expression',        code: "compile('x = pass', '<demo>', 'exec')",                           returns: 'SyntaxError: invalid syntax' },
  ],

  pitfalls: [
    {
      name: 'pass where continue was meant',
      desc: 'pass does not skip anything — the rest of the loop body still runs for that item.',
      wrong: { label: 'pass', code: "words = ['ok', '', 'fine']\nout = []\nfor w in words:\n    if not w:\n        pass\n    out.append(w.upper())\nout", output: "['OK', '', 'FINE']" },
      fix:   { label: 'continue', code: "words = ['ok', '', 'fine']\nout = []\nfor w in words:\n    if not w:\n        continue\n    out.append(w.upper())\nout", output: "['OK', 'FINE']" },
    },
    {
      name: 'except Exception: pass hides real bugs',
      desc: 'Swallowing everything also swallows typos and wrong types. Catch only the exception you expect — then the real bug (an int passed in) surfaces instead of turning into None.',
      wrong: { label: 'swallow everything', code: "def parse(s):\n    try:\n        return int(s.strip())\n    except Exception:\n        pass\nprint(parse(42))", output: 'None' },
      fix:   { label: 'catch what you expect', code: "def parse(s):\n    try:\n        return int(s.strip())\n    except ValueError:\n        return None\nparse(42)", output: "AttributeError: 'int' object has no attribute 'strip'" },
    },
    {
      name: 'A forgotten pass stub that silently returns None',
      desc: 'The program runs, but the stub returns None and the failure shows up far away. raise NotImplementedError fails at the call instead.',
      wrong: { label: 'pass stub', code: "def tax(amount):\n    pass\ntotal = 100 + (tax(100) or 0)\ntotal", output: '100' },
      fix:   { label: 'loud stub', code: "def tax(amount):\n    raise NotImplementedError('tax')\ntax(100)", output: 'NotImplementedError: tax' },
    },
  ],

  when: {
    use: [
      'Stub functions, classes and branches while sketching code',
      'Exception subclasses that need no body',
      'Ignoring one specific, expected exception',
    ],
    avoid: [
      'Skipping the rest of a loop pass → continue',
      'Placeholders that must not be forgotten → raise NotImplementedError',
      'Silencing broad exceptions → handle or log them',
    ],
  },

  notes: {
    cpython:      'pass does no work: at most it compiles to a NOP that keeps its line visible to line tracing (debuggers, coverage)',
    'Ellipsis':   '... is an expression (the Ellipsis constant) used as a statement; as a body it behaves like pass. Convention: pass in real code, ... in stubs and protocols',
    'Docstring':  'A docstring alone is a valid body, so a documented function or class needs no pass',
  },

  related: [
    { name: 'continue', slug: 'continue', when: 'Skip the rest of the loop body' },
    { name: 'def',      slug: 'def',      when: 'Stub functions' },
    { name: 'class',    slug: 'class',    when: 'Empty classes and exception subclasses' },
    { name: 'try',      slug: 'try',      when: 'except ...: pass' },
    { name: 'NotImplementedError', slug: 'notimplementederror', when: 'A stub that fails loudly', category: 'exceptions' },
    { name: 'IndentationError', slug: 'indentationerror', when: 'What an empty block raises', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does pass do in Python?',
      a: 'Nothing. It is a statement you write where the syntax requires one — an empty function, class, if branch, loop or except block — so the code parses. Execution continues with the next line.',
    },
    {
      q: 'What is the difference between pass and continue?',
      a: 'In a loop, pass lets the rest of the body run; continue skips the rest of the body and starts the next iteration. The live demo above runs the same loop with each.',
    },
    {
      q: 'Should I use pass or ... (Ellipsis)?',
      a: 'Both work as an empty body. pass is a keyword made for exactly that; ... is an expression statement that evaluates the Ellipsis constant and discards it. Common convention: pass in normal code, ... in type stubs, Protocol classes and abstract method signatures.',
    },
    {
      q: 'Why do I get "expected an indented block"?',
      a: 'A def, class, if, for, while, with or try line ends in a colon and needs at least one indented statement after it. A comment does not count. Add pass (or a docstring) as the body.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/simple_stmts.html#the-pass-statement',
    meta:  'The pass statement',
  },
};
