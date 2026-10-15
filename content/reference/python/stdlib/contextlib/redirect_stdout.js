// content/reference/python/stdlib/contextlib/redirect_stdout.js — redirect_stdout / redirect_stderr

export const meta = {
  slug:        'redirect_stdout',
  name:        'contextlib.redirect_stdout / redirect_stderr',
  signature:   'contextlib.redirect_stdout(new_target) · contextlib.redirect_stderr(new_target)',
  blurb:       'Temporarily point sys.stdout (or sys.stderr) at another file-like object, so print() and anything else writing there goes into it — typically an io.StringIO you read afterwards.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.4+ (redirect_stderr 3.5+)',
  searchTerms: 'contextlib redirect_stdout redirect_stderr python capture print output to string capture stdout StringIO redirect output to file silence print sys.stdout sys.stderr',
};

export const method = {
  slug:      'redirect_stdout',
  name:      'contextlib.redirect_stdout / redirect_stderr',
  signature: 'contextlib.redirect_stdout(new_target) · contextlib.redirect_stderr(new_target)',
  returns:   { type: 'redirect_stdout · redirect_stderr', desc: 'A re-entrant context manager; "as" binds new_target.' },

  category:    'contextlib class',
  version:     'Python 3.4+ (redirect_stderr 3.5+)',
  hasLiveDemo: true,

  subtitle: 'It simply assigns sys.stdout = new_target on entry and restores the old value on exit. That is global: every thread sees it, and output written straight to the file descriptor — subprocesses, C extensions — is not captured.',

  covers: ['redirect_stdout', 'redirect_stderr'],

  cheat: {
    commonCall: 'buf = io.StringIO()\nwith redirect_stdout(buf):\n    noisy()\ntext = buf.getvalue()',
    returns:    'everything noisy() printed, as one str',
    replaces:   'saving and restoring sys.stdout by hand',
    watchOut:   'not thread-safe; subprocess output is not captured',
  },

  parameters: [
    { name: 'new_target', type: 'file-like object', required: true, default: null, desc: 'Anything with write(): io.StringIO, an open text file, sys.stderr, … Returned by __enter__.' },
  ],

  modes: [
    {
      id: 'capture',
      label: 'redirect_stdout',
      blurb: 'Two prints inside go into buf; the one after the block appears on screen as usual.',
      params: [{ name: 'text', type: 'str', hint: 'what to print', input: 'text' }],
      template: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    print({$text})\n    print('second line')\nprint('back on screen')\nbuf.getvalue()",
      cases: [
        { id: 'hello', label: 'hello',     values: { text: 'hello' } },
        { id: 'empty', label: 'empty str', values: { text: '' } },
      ],
    },
    {
      id: 'stderr',
      label: 'redirect_stderr',
      blurb: 'print(..., file=sys.stderr) looks up sys.stderr when it is called, so it is captured too.',
      params: [{ name: 'text', type: 'str', hint: 'warning text', input: 'text' }],
      template: 'import io, sys\nfrom contextlib import redirect_stderr\nerr = io.StringIO()\nwith redirect_stderr(err):\n    print({$text}, file=sys.stderr)\nerr.getvalue()',
      cases: [
        { id: 'warn', label: 'a warning', values: { text: 'warning: disk almost full' } },
      ],
    },
  ],
  demoExplainer: "The result shows what reached the screen ('back on screen') followed by the captured string. Each print() adds its own '\\n', so printing an empty string still captures one newline.",

  patterns: [
    {
      name: 'Test what a function prints',
      desc: 'Capture and compare in a unit test.',
      code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    greet('Ada')\nassert buf.getvalue() == 'Hello, Ada!\\n'",
    },
    {
      name: 'Silence a chatty library call',
      desc: 'Send its output to os.devnull.',
      code: "import os\nfrom contextlib import redirect_stdout\nwith open(os.devnull, 'w') as devnull, redirect_stdout(devnull):\n    chatty_setup()",
    },
    {
      name: 'Write a report to a file with print()',
      desc: 'Reuse code that prints, without changing it.',
      code: "from contextlib import redirect_stdout\nwith open('report.txt', 'w') as fh, redirect_stdout(fh):\n    print_report()",
    },
  ],

  examples: [
    { title: 'Capture print() in a string',  code: "import io\nfrom contextlib import redirect_stdout\nf = io.StringIO()\nwith redirect_stdout(f):\n    print('hello')\n    print('world')\nf.getvalue().splitlines()", returns: "['hello', 'world']" },
    { title: 'Redirect to a file',           code: "from contextlib import redirect_stdout\nwith open('log.txt', 'w') as fh, redirect_stdout(fh):\n    print('to the file')\nopen('log.txt').read()", returns: "'to the file\\n'" },
    { title: 'sys.stdout is restored',       code: 'import io, sys\nfrom contextlib import redirect_stdout\nbefore = sys.stdout\nwith redirect_stdout(io.StringIO()):\n    inside = sys.stdout is before\ninside, sys.stdout is before', returns: '(False, True)' },
    { title: 'redirect_stderr',              code: "import io, sys\nfrom contextlib import redirect_stderr\nbuf = io.StringIO()\nwith redirect_stderr(buf):\n    print('warning!', file=sys.stderr)\nbuf.getvalue()", returns: "'warning!\\n'" },
    { title: 'A saved reference still writes to the old stream', code: "import io, sys\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nout = sys.stdout\nwith redirect_stdout(buf):\n    print('A', file=out)\n    print('B')\nbuf.getvalue()", returns: "A\n'B\\n'" },
    { title: 'Re-entrant',                   code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nr = redirect_stdout(buf)\nwith r:\n    print('one')\n    with r:\n        print('two')\n    print('three')\nbuf.getvalue()", returns: "'one\\ntwo\\nthree\\n'" },
  ],

  pitfalls: [
    {
      name: 'Code that saved sys.stdout earlier',
      desc: 'redirect_stdout replaces the attribute sys.stdout. A stream fetched before the block — here a default argument, evaluated when the function was defined — still points at the old one.',
      wrong: { label: 'stream=sys.stdout', code: "import io, sys\nfrom contextlib import redirect_stdout\ndef say(msg, stream=sys.stdout):\n    stream.write(msg + '\\n')\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    say('hello')\nbuf.getvalue()", output: "hello\n''" },
      fix:   { label: 'look it up per call', code: "import io, sys\nfrom contextlib import redirect_stdout\ndef say(msg, stream=None):\n    (stream or sys.stdout).write(msg + '\\n')\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    say('hello')\nbuf.getvalue()", output: "'hello\\n'" },
    },
    {
      name: 'Reading the buffer inside the block',
      desc: 'Text printed after getvalue() is not in the value you already read. Read the buffer after the with block ends.',
      wrong: { label: 'too early', code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    print('first')\n    snapshot = buf.getvalue()\n    print('second')\nsnapshot", output: "'first\\n'" },
      fix:   { label: 'after the block', code: "import io\nfrom contextlib import redirect_stdout\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    print('first')\n    print('second')\nbuf.getvalue()", output: "'first\\nsecond\\n'" },
    },
  ],

  when: {
    use: [
      'Scripts and tests that need the text a function prints',
      'Reusing print-based code to write into a file or a string',
    ],
    avoid: [
      'Library code and multi-threaded programs — the redirection is global to the process',
      'Output of subprocesses → subprocess.run(..., capture_output=True)',
      'Output from C code or os.write(1, ...) → it bypasses sys.stdout',
      'Logging → configure a logging handler instead',
    ],
  },

  notes: {
    cpython:      'Lib/contextlib.py: _RedirectStream.__enter__ appends getattr(sys, "stdout") to a list and sets sys.stdout = new_target; __exit__ pops and restores it — the list makes it re-entrant',
    'Thread safety': 'Not suitable for library code or most threaded programs (docs): sys.stdout is global, so other threads printing during the block write into new_target too',
    'print()':    'print() reads sys.stdout on every call, which is why it follows the redirection; a stream saved in a variable before the block does not',
  },

  related: [
    { name: 'print()', slug: 'print', when: 'What usually writes to sys.stdout', category: 'functions' },
    { name: 'sys.stdout', slug: 'stdout', when: 'The stream being replaced', category: 'stdlib/sys' },
    { name: 'subprocess module', slug: 'subprocess', when: 'Capture a child process\'s output', category: 'stdlib' },
    { name: 'contextlib.contextmanager', slug: 'contextmanager', when: 'Write your own temporary-change helper' },
    { name: 'logging module', slug: 'logging', when: 'Structured output instead of captured prints', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I capture the output of print() into a string in Python?',
      a: 'Create an io.StringIO, run the code inside "with contextlib.redirect_stdout(buf):", then read buf.getvalue() after the block. Everything printed in between is in that string, newlines included.',
    },
    {
      q: 'Why does redirect_stdout not capture my subprocess output?',
      a: 'The subprocess writes to the operating-system file descriptor, while redirect_stdout only replaces the Python object sys.stdout. Use subprocess.run(..., capture_output=True, text=True) and read .stdout.',
    },
    {
      q: 'Is contextlib.redirect_stdout thread-safe?',
      a: 'No. It replaces the global sys.stdout, so output from every thread goes to the new target while the block runs. The docs advise against it in library code and most threaded applications.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/contextlib.html#contextlib.redirect_stdout',
    meta:  'contextlib.redirect_stdout',
  },
};
