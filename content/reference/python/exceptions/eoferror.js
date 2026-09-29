// content/reference/python/exceptions/eoferror.js

export const meta = {
  slug:        'eoferror',
  name:        'EOFError',
  signature:   'EOFError(*args)',
  blurb:       'Raised when input() hits end-of-file before reading anything — and by pickle/marshal when the data runs out.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'eoferror eof error eof when reading a line input end of file stdin ctrl-d ctrl-z pickle ran out of input marshal eof read where object expected',
};

export const method = {
  slug:      'eoferror',
  name:      'EOFError',
  signature: 'EOFError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'input() asked for a line and stdin had nothing left — common when a script that expects a keyboard runs in CI, Docker, an online IDE or with piped input.',

  chain: ['BaseException', 'Exception', 'EOFError'],

  cheat: {
    raisedBy: 'input() at end of stdin; pickle.load()/loads() on empty or exhausted data; marshal.loads(b"")',
    message:  'EOF when reading a line · Ran out of input',
    quickFix: 'try/except EOFError around input(); check the data source is not empty',
    watchOut: 'file.read()/readline() return "" at EOF — they never raise it',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'The message; input() passes "EOF when reading a line", pickle "Ran out of input".' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Feed input() from a string instead of the keyboard, then ask for n lines. (sys.stdin is swapped for an io.StringIO and restored afterwards.)',
      params: [
        { name: 'lines', type: 'list[str]', hint: 'comma-separated lines on stdin', input: 'csv' },
        { name: 'n',     type: 'int',       hint: 'how many input() calls', input: 'number' },
      ],
      template: "import io, sys\nsys.stdin = io.StringIO('\\n'.join({$lines}))\ntry:\n    answers = [input() for _ in range({$n})]\nfinally:\n    sys.stdin = sys.__stdin__\nanswers",
      cases: [
        { id: 'enough', label: 'enough lines',  values: { lines: 'alice, 42', n: '2' } },
        { id: 'short',  label: 'one too many',  values: { lines: 'alice, 42', n: '3' } },
        { id: 'empty',  label: 'empty stdin',   values: { lines: '', n: '1' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Read until EOF: the usual loop for "read all lines" programs and competitive-programming input.',
      params: [{ name: 'lines', type: 'list[str]', hint: 'comma-separated lines on stdin', input: 'csv' }],
      template: "import io, sys\nsys.stdin = io.StringIO('\\n'.join({$lines}))\nanswers = []\ntry:\n    while True:\n        answers.append(input())\nexcept EOFError:\n    pass\nfinally:\n    sys.stdin = sys.__stdin__\nanswers",
      cases: [
        { id: 'three', label: 'three lines',       values: { lines: 'a, b, c' } },
        { id: 'blank', label: 'blank line inside', values: { lines: 'a, , c' } },
        { id: 'empty', label: 'empty stdin',       values: { lines: '' } },
      ],
    },
  ],
  demoExplainer: "An empty line is not EOF: input() returns '' for it and keeps going. EOFError comes only when stdin has nothing at all left — the third input() on two lines, or the first input() on empty stdin. That is exactly what happens when a script runs with no keyboard attached: stdin is empty (or closed) from the start.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: "The message tuple, e.g. ('EOF when reading a line',)." },
  ],

  patterns: [
    {
      name: 'Prompt that survives no-terminal runs',
      desc: 'Fall back to a default when stdin is empty or closed (CI, cron, Docker without -it).',
      code: "try:\n    name = input('Name: ')\nexcept EOFError:\n    name = 'anonymous'",
    },
    {
      name: 'Read all of stdin without EOFError',
      desc: 'Iterating sys.stdin (or sys.stdin.read()) just stops at EOF — no exception to handle.',
      code: "import sys\nfor line in sys.stdin:\n    process(line.rstrip('\\n'))",
    },
    {
      name: 'Load every pickled record in a file',
      desc: 'pickle.load raises EOFError after the last object — the standard end-of-stream signal.',
      code: "records = []\nwith open('data.pkl', 'rb') as f:\n    while True:\n        try:\n            records.append(pickle.load(f))\n        except EOFError:\n            break",
    },
  ],

  examples: [
    { title: 'input() on empty stdin', code: "import io, sys\nsys.stdin = io.StringIO('')\ntry:\n    input()\nfinally:\n    sys.stdin = sys.__stdin__", returns: 'EOFError: EOF when reading a line' },
    { title: 'An empty line is not EOF', code: "import io, sys\nsys.stdin = io.StringIO('\\n')\ntry:\n    line = input()\nfinally:\n    sys.stdin = sys.__stdin__\nline", returns: "''" },
    { title: 'readline() returns "" instead', code: "import io\nf = io.StringIO('only line')\nf.readline(), f.readline()", returns: "('only line', '')" },
    { title: 'pickle.loads on empty bytes', code: "import pickle\npickle.loads(b'')", returns: 'EOFError: Ran out of input' },
    { title: 'pickle.load on an empty file', code: "import pickle\nopen('cache.pkl', 'wb').close()\nwith open('cache.pkl', 'rb') as f:\n    data = pickle.load(f)", returns: 'EOFError: Ran out of input' },
    { title: 'One load too many', code: "import io, pickle\nbuf = io.BytesIO()\npickle.dump('first', buf)\nbuf.seek(0)\n[pickle.load(buf), pickle.load(buf)]", returns: 'EOFError: Ran out of input' },
    { title: 'marshal too', code: "import marshal\nmarshal.loads(b'')", returns: 'EOFError: EOF read where object expected' },
  ],

  pitfalls: [
    {
      name: 'Expecting input() to return "" at the end',
      desc: 'Files return "" at EOF, but input() raises. A while-loop that waits for "" never gets it.',
      wrong: { label: "while line != ''", code: "import io, sys\nsys.stdin = io.StringIO('a\\nb')\nlines = []\ntry:\n    line = input()\n    while line != '':\n        lines.append(line)\n        line = input()\nfinally:\n    sys.stdin = sys.__stdin__\nlines", output: 'EOFError: EOF when reading a line' },
      fix:   { label: 'except EOFError', code: "import io, sys\nsys.stdin = io.StringIO('a\\nb')\nlines = []\ntry:\n    while True:\n        lines.append(input())\nexcept EOFError:\n    pass\nfinally:\n    sys.stdin = sys.__stdin__\nlines", output: "['a', 'b']" },
    },
    {
      name: 'Truncated pickle is not EOFError',
      desc: 'Only completely empty data gives EOFError. Data cut off in the middle raises UnpicklingError — catch both when reading untrusted or partially written caches.',
      wrong: { label: 'except EOFError', code: "import pickle\ndata = pickle.dumps([1, 2, 3])[:5]\ntry:\n    obj = pickle.loads(data)\nexcept EOFError:\n    obj = []\nobj", output: '_pickle.UnpicklingError: pickle data was truncated' },
      fix:   { label: 'Both errors', code: "import pickle\ndata = pickle.dumps([1, 2, 3])[:5]\ntry:\n    obj = pickle.loads(data)\nexcept (EOFError, pickle.UnpicklingError):\n    obj = []\nobj", output: '[]' },
    },
  ],

  when: {
    use: [
      'Detecting the end of interactive or piped input to input()',
      'Ending a loop over consecutive pickle.load() calls',
      'Raising it from your own reader when a stream ends before a complete record',
    ],
    avoid: [
      'Reading files line by line → iterate the file; it stops at EOF by itself',
      'Scripts meant for automation → take arguments (argparse) or read sys.stdin instead of prompting',
    ],
  },

  notes: {
    'Keyboard EOF': 'Ctrl-D on Linux/macOS, Ctrl-Z then Enter on Windows — input() raises EOFError',
    'Not Ctrl-C':   'Ctrl-C raises KeyboardInterrupt, not EOFError',
    'Closed stdin': 'If sys.stdin is None, input() raises RuntimeError: lost sys.stdin instead',
  },

  related: [
    { name: 'input()',           slug: 'input',             when: 'The usual source of EOFError', category: 'functions' },
    { name: 'KeyboardInterrupt', slug: 'keyboardinterrupt', when: 'What Ctrl-C raises at the same prompt' },
    { name: 'StopIteration',     slug: 'stopiteration',     when: 'The iterator protocol\'s own "no more data" signal' },
    { name: 'open()',            slug: 'open',              when: 'File reads return "" at EOF instead of raising', category: 'functions' },
    { name: 'OSError',           slug: 'oserror',           when: 'Real I/O failures, as opposed to simply running out of data' },
  ],

  faq: [
    {
      q: 'Why do I get "EOFError: EOF when reading a line"?',
      a: "input() found stdin already at end-of-file. Common causes: the script runs where there is no keyboard (CI jobs, cron, Docker without -it, some online IDEs and editor 'Run' buttons that do not attach a console), input is piped from a file with fewer lines than the script asks for, or the user pressed Ctrl-D (Ctrl-Z Enter on Windows). Either provide the input (echo 'alice' | python script.py, docker run -it), or catch EOFError and use a default.",
    },
    {
      q: 'How do I read input until EOF in Python?',
      a: "Either loop on input() inside try/except EOFError, or skip input() altogether: for line in sys.stdin: … stops cleanly at EOF, and sys.stdin.read() returns everything at once.",
    },
    {
      q: 'What does "EOFError: Ran out of input" mean with pickle?',
      a: 'pickle.load() or pickle.loads() got no bytes at all: an empty file (often a cache file created but never written, or truncated by a crash), a file opened in "wb" mode which emptied it, or one load() call more than there were dump() calls. Data that is cut off partway raises pickle.UnpicklingError instead.',
    },
    {
      q: 'Does reading a file raise EOFError at the end?',
      a: "No. file.read() returns '' (or b'') and readline() returns '' at end-of-file, and iterating a file just stops. EOFError is raised by input(), by pickle and marshal loaders, and by some libraries that read fixed-size records.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#EOFError',
    meta:  'Built-in exceptions',
  },
};
