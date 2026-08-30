// content/reference/python/functions/breakpoint.js
//
// Doc-only page: breakpoint() drops into an interactive debugger, which a
// sandboxed demo cannot represent.

export const meta = {
  slug:        'breakpoint',
  name:        'breakpoint',
  signature:   'breakpoint(*args, **kwargs)',
  blurb:       'Drop into the debugger here — configurable through PYTHONBREAKPOINT.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 3.7+',
  searchTerms: 'breakpoint debugger pdb set_trace debug pause inspect PYTHONBREAKPOINT',
};

export const method = {
  slug:      'breakpoint',
  name:      'breakpoint',
  signature: 'breakpoint(*args, **kwargs)',
  returns:   { type: 'Any', desc: 'Whatever sys.breakpointhook returns — None for the default pdb hook, which enters the debugger before returning.' },

  category:    'Built-in function',
  version:     'Python 3.7+',
  hasLiveDemo: false,

  subtitle: 'Replaces the import pdb; pdb.set_trace() incantation, and unlike it can be switched off or redirected by an environment variable.',

  cheat: {
    commonCall: 'breakpoint()',
    returns:    'enters pdb by default; the return value is rarely used',
    replaces:   'import pdb; pdb.set_trace()',
    watchOut:   'PYTHONBREAKPOINT=0 disables it entirely — no debugger, no warning',
  },

  parameters: [
    { name: '*args',    type: 'Any', required: false, default: null, desc: 'Passed straight through to sys.breakpointhook. The default pdb hook ignores them.' },
    { name: '**kwargs', type: 'Any', required: false, default: null, desc: 'Also forwarded. Third-party debuggers use these; pdb does not.' },
  ],

  examples: [
    { title: 'Pause here',         code: 'def f(x):\n    breakpoint()\n    return x * 2', returns: 'enters pdb at that line' },
    { title: 'Disable everywhere', code: 'PYTHONBREAKPOINT=0 python app.py',              returns: 'every call becomes a no-op' },
    { title: 'Use another debugger',code: 'PYTHONBREAKPOINT=IPython.terminal.debugger.set_trace python app.py', returns: 'enters ipdb instead' },
    { title: 'Redirect in code',   code: 'import sys\nsys.breakpointhook = my_hook',      returns: 'all later calls go to my_hook' },
    { title: 'The old way',        code: 'import pdb; pdb.set_trace()',                   returns: 'equivalent, but not configurable' },
    { title: 'Conditional pause',  code: 'if value < 0:\n    breakpoint()',               returns: 'only stops when the condition holds' },
  ],

  pitfalls: [
    {
      name: 'PYTHONBREAKPOINT=0 silently disables it',
      desc: 'Set in a shell profile or a CI config, every breakpoint becomes a no-op. The debugger simply never opens, which reads like the line was not reached.',
      wrong: { label: 'Nothing happens', code: 'PYTHONBREAKPOINT=0 python app.py', output: 'runs straight through' },
      fix:   { label: 'Check the variable', code: 'import os\nprint(os.environ.get("PYTHONBREAKPOINT"))', output: "'0' explains the silence" },
    },
    {
      name: 'Left in committed code it hangs production',
      desc: 'A stray breakpoint in a server or batch job waits forever for input that never comes. With no TTY it may instead raise on read, which is just as bad and harder to trace.',
      wrong: { label: 'Hangs the job', code: 'def handler(req):\n    breakpoint()\n    ...', output: 'the request never returns' },
      fix:   { label: 'Lint for it',   code: 'ruff rule T100 / flake8-debugger', output: 'fails CI instead' },
    },
    {
      name: 'It stops the whole process, not one thread',
      desc: 'pdb reads from stdin, so in a threaded or async program the interaction competes with everything else. Output interleaves and the prompt can become unusable.',
      wrong: { label: 'Garbled prompt', code: 'breakpoint()   # inside a worker thread', output: 'pdb output tangled with other threads' },
      fix:   { label: 'Remote debugger', code: 'use debugpy or pdb-attach for threaded code', output: 'a dedicated channel' },
    },
    {
      name: 'Python 3.7 and newer only',
      desc: 'On older interpreters it is a NameError, since it is a builtin rather than an import. Code meant to run on 3.6 still needs the pdb form.',
      wrong: { label: 'Fails on 3.6', code: 'breakpoint()', output: "NameError: name 'breakpoint' is not defined" },
      fix:   { label: 'Old form',     code: 'import pdb; pdb.set_trace()', output: 'works everywhere' },
    },
  ],

  when: {
    use: [
      'Pausing to inspect local state during development',
      'Conditional debugging — call it only when a condition holds',
      'Projects standardising on a debugger via PYTHONBREAKPOINT',
    ],
    avoid: [
      'Anything that will be committed — lint it out',
      'Production, batch jobs and CI, where there is no interactive terminal',
      'Long-running loops → logging tells you more with less friction',
    ],
  },

  notes: {
    complexity: 'Not meaningful — hands control to sys.breakpointhook',
    return:     'Whatever the hook returns; the default pdb hook returns None',
    cpython:    'Python/bltinmodule.c :: builtin_breakpoint, dispatching to sys.breakpointhook',
    memory:     'Negligible; the debugger itself holds frame references while active',
    threadSafe: 'No — pdb competes for stdin and stdout across threads',
  },

  related: [
    { name: 'input',  slug: 'input',  when: 'Also reads stdin, and also hangs without a terminal' },
    { name: 'print',  slug: 'print',  when: 'The lower-tech debugging alternative' },
    { name: 'vars',   slug: 'vars',   when: 'Inspect an object\'s attributes without stopping' },
    { name: 'locals', slug: 'locals', when: 'Look at the current scope programmatically' },
  ],

  faq: [
    {
      q: 'How do I make breakpoint() use a different debugger?',
      a: 'Set PYTHONBREAKPOINT to the import path of any callable, or assign sys.breakpointhook at runtime. That indirection is the main reason breakpoint exists rather than calling pdb directly.',
      code: 'PYTHONBREAKPOINT=IPython.terminal.debugger.set_trace python app.py',
    },
    {
      q: 'How do I turn every breakpoint off without editing code?',
      a: 'Set PYTHONBREAKPOINT=0. Every call becomes a no-op, which is handy for running a test suite that still contains debugging calls — though the real fix is removing them.',
      code: 'PYTHONBREAKPOINT=0 pytest',
    },
    {
      q: 'What are the essential pdb commands?',
      a: 'n steps over the next line, s steps into a call, c continues, l lists source around the current line, p prints an expression, and q quits. Typing a bare variable name also evaluates it.',
      code: '(Pdb) l\n(Pdb) p value\n(Pdb) c',
    },
  ],

  history: [
    { version: '3.7', note: 'breakpoint and sys.breakpointhook added by PEP 553, replacing the pdb.set_trace idiom.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#breakpoint',
    meta:  'breakpoint',
  },

  tryInTool: [],
};
