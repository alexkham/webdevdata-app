// content/reference/python/stdlib/io/open.js — io.open

export const meta = {
  slug:        'open',
  name:        'io.open',
  signature:   "io.open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)",
  blurb:       'The built-in open() under its io name — the same function object. The mode and buffering decide which io class you get back.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'io.open open python io open vs open which class does open return textiowrapper bufferedreader bufferedwriter bufferedrandom fileio buffering=0 mode string rb+ unbuffered text invalid mode must have exactly one of create/read/write/append mode',
};

export const method = {
  slug:      'open',
  name:      'io.open',
  signature: "io.open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)",
  returns:   { type: 'TextIOWrapper | BufferedReader | BufferedWriter | BufferedRandom | FileIO', desc: 'A text stream for text modes; a buffered or raw binary stream for binary modes.' },

  category:    'io function',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: "io.open is open: the docs call it an alias, and `io.open is open` is True. What it returns is a stack of io objects — a FileIO for the OS file, a buffered layer chosen by the mode, and for text a TextIOWrapper on top. buffering=0 stops at the FileIO and only works in binary mode.",

  covers: ['open'],

  cheat: {
    commonCall: "open(path, encoding='utf-8')",
    returns:    'TextIOWrapper (text) · Buffered* (binary) · FileIO (buffering=0)',
    replaces:   'nothing — prefer the built-in name open',
    watchOut:   'without encoding=, text mode uses the locale encoding',
  },

  parameters: [
    { name: 'file',      type: 'path | int',  required: true,  default: null,   desc: 'A path (str, bytes, os.PathLike) or an existing file descriptor.' },
    { name: 'mode',      type: 'str',         required: false, default: "'r'",  desc: "Exactly one of r, w, a, x, optionally + (read and write) and b or t. Each letter at most once." },
    { name: 'buffering', type: 'int',         required: false, default: '-1',   desc: '0: no buffer (binary only, returns FileIO) · 1: line buffering (text) · >1: buffer size · negative: the default.' },
    { name: 'encoding',  type: 'str | None',  required: false, default: 'None', desc: 'Text mode only. None means the locale encoding (locale.getencoding()); pass "utf-8" for portable files.' },
    { name: 'errors',    type: 'str | None',  required: false, default: 'None', desc: "Text mode only: 'strict', 'ignore', 'replace', 'backslashreplace' …" },
    { name: 'newline',   type: 'str | None',  required: false, default: 'None', desc: "Text mode only: None, '', '\\n', '\\r' or '\\r\\n' (see TextIOWrapper)." },
    { name: 'closefd',   type: 'bool',        required: false, default: 'True', desc: 'With a file descriptor: False keeps it open when the file object closes.' },
    { name: 'opener',    type: 'callable',    required: false, default: 'None', desc: 'Called as opener(file, flags) to get the file descriptor.' },
  ],

  modes: [
    {
      id: 'stack',
      label: 'what you get',
      blurb: "Open an existing file with any mode and buffering; see the class and its .mode. Try 'rb', 'w+b', 'a', 'rw', or buffering 0.",
      params: [
        { name: 'mode',      type: 'str', hint: 'mode',                 input: 'text' },
        { name: 'buffering', type: 'int', hint: '-1, 0, 1 or a size',   input: 'number' },
      ],
      template: "import io\nopen('demo.txt', 'w').close()\nwith io.open('demo.txt', {$mode}, buffering={$buffering}) as f:\n    info = (type(f).__name__, f.mode)\ninfo",
      cases: [
        { id: 'r',     label: "'r'",                values: { mode: 'r', buffering: '-1' } },
        { id: 'rpb',   label: "'r+b'",              values: { mode: 'r+b', buffering: '-1' } },
        { id: 'raw',   label: "'wb', buffering=0",  values: { mode: 'wb', buffering: '0' } },
        { id: 'text0', label: "'w', buffering=0",   values: { mode: 'w', buffering: '0' } },
        { id: 'rw',    label: "'rw'",               values: { mode: 'rw', buffering: '-1' } },
        { id: 'x',     label: "'x' (file exists)",  values: { mode: 'x', buffering: '-1' } },
      ],
    },
  ],
  demoExplainer: "Text modes give a TextIOWrapper whose .mode is your string as typed; binary modes report the FileIO's normalised mode, so 'r+b' and 'w+b' both show 'rb+'. buffering=0 returns the raw FileIO itself; in text mode it raises ValueError: can't have unbuffered text I/O. 'rw' fails the mode check (must have exactly one of create/read/write/append mode), and 'x' refuses the existing file with FileExistsError: [Errno 17] File exists: 'demo.txt'.",

  patterns: [
    {
      name: 'Read a text file portably',
      desc: 'Always pass the encoding; the default depends on the machine.',
      code: "with open('data.txt', encoding='utf-8') as f:\n    for line in f:\n        handle(line)",
    },
    {
      name: 'Create a file only if it does not exist',
      desc: "'x' is atomic: no race between checking and creating.",
      code: "try:\n    with open('lock', 'x') as f:\n        f.write(str(pid))\nexcept FileExistsError:\n    print('already running')",
    },
    {
      name: 'Update a binary file in place',
      desc: "'r+b' reads and writes without truncating.",
      code: "with open('image.bin', 'r+b') as f:\n    f.seek(8)\n    f.write(b'\\x00\\x01')",
    },
  ],

  examples: [
    { title: 'The same function',              code: 'import io\nio.open is open', returns: 'True' },
    { title: 'Text mode: TextIOWrapper',       code: "import io\nwith io.open('a.txt', 'w', encoding='utf-8') as f:\n    name = type(f).__name__\nname", returns: "'TextIOWrapper'" },
    { title: 'Binary: buffer over FileIO',     code: "with open('a.txt', 'wb') as f:\n    layers = (type(f).__name__, type(f.raw).__name__)\nlayers", returns: "('BufferedWriter', 'FileIO')" },
    { title: 'buffering=0: the raw FileIO',    code: "with open('a.txt', 'wb', buffering=0) as f:\n    name = type(f).__name__\nname", returns: "'FileIO'" },
    { title: "'w+b' reports as 'rb+'",         code: "with open('a.txt', 'w+b') as f:\n    mode = f.mode\nmode", returns: "'rb+'" },
    { title: 'No unbuffered text',             code: "open('a.txt', 'w', buffering=0)", returns: "ValueError: can't have unbuffered text I/O" },
    { title: 'One of r / w / a / x',           code: "open('a.txt', 'rw')", returns: 'ValueError: must have exactly one of create/read/write/append mode' },
    { title: 'Binary takes no encoding',       code: "open('a.txt', 'rb', encoding='utf-8')", returns: "ValueError: binary mode doesn't take an encoding argument" },
  ],

  pitfalls: [
    {
      name: 'Writing str to a binary file',
      desc: "'b' in the mode means bytes in, bytes out. Use a text mode with an encoding, or encode yourself.",
      wrong: { label: "'wb' + str",        code: "with open('a.txt', 'wb') as f:\n    f.write('text')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "'w' + encoding",    code: "with open('a.txt', 'w', encoding='utf-8') as f:\n    n = f.write('text')\nn", output: '4' },
    },
    {
      name: "'w' when you meant 'a'",
      desc: "'w' truncates the file the moment it opens, even if you never write.",
      wrong: { label: "'w'", code: "with open('log.txt', 'w', encoding='utf-8') as f:\n    f.write('first\\n')\nwith open('log.txt', 'w', encoding='utf-8') as f:\n    f.write('second\\n')\nwith open('log.txt', encoding='utf-8') as f:\n    text = f.read()\ntext", output: "'second\\n'" },
      fix:   { label: "'a'", code: "with open('log.txt', 'w', encoding='utf-8') as f:\n    f.write('first\\n')\nwith open('log.txt', 'a', encoding='utf-8') as f:\n    f.write('second\\n')\nwith open('log.txt', encoding='utf-8') as f:\n    text = f.read()\ntext", output: "'first\\nsecond\\n'" },
    },
    {
      name: "'x' on a file that exists",
      desc: "'x' exists to fail when the file is already there — catch FileExistsError.",
      wrong: { label: "open('x')",            code: "open('a.txt', 'w').close()\nopen('a.txt', 'x')", output: "FileExistsError: [Errno 17] File exists: 'a.txt'" },
      fix:   { label: 'except FileExistsError', code: "open('a.txt', 'w').close()\ntry:\n    open('a.txt', 'x')\nexcept FileExistsError:\n    result = 'already there'\nresult", output: "'already there'" },
    },
  ],

  when: {
    use: [
      'Code that imports io anyway and wants to make the io origin explicit',
      'Reading this page: to learn which io class each mode produces',
    ],
    avoid: [
      'Everyday code → the built-in open(), which is the same function',
      'Whole-file reads and writes → pathlib.Path.read_text / write_text',
    ],
  },

  notes: {
    cpython:          'Modules/_io/_iomodule.c: _io.open checks the mode letters, builds FileIO, then BufferedRandom ("+" in the mode), BufferedWriter (w / a / x) or BufferedReader (r), then a TextIOWrapper for text modes',
    'Buffer size':    'buffering=-1 uses the file\'s st_blksize when the OS reports one above 1, otherwise io.DEFAULT_BUFFER_SIZE (8192); interactive files get line buffering',
    'Auditing':       'Raises the auditing event open with path, mode and flags (docs)',
    'Mode strings':   'Text streams keep the mode you passed; FileIO normalises: xb / xb+, ab / ab+, rb / rb+, wb',
  },

  related: [
    { name: 'open() (built-in)',     slug: 'open',                 when: 'The full guide to the same function', category: 'functions' },
    { name: 'TextIOWrapper',         slug: 'textiowrapper',        when: 'What text modes return' },
    { name: 'BufferedReader',        slug: 'bufferedreader',       when: "What 'rb' returns" },
    { name: 'FileIO',                slug: 'fileio',               when: 'What buffering=0 returns' },
    { name: 'open_code',             slug: 'open_code',            when: "open(path, 'rb') for files that will be executed" },
    { name: 'with',                  slug: 'with',                 when: 'Close the file automatically', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What is the difference between io.open and open in Python 3?',
      a: 'None — io.open is the built-in open (io.open is open evaluates to True). In Python 2 they were different functions, which is why older code imports io.open.',
    },
    {
      q: 'What type does open() return?',
      a: "Text modes return io.TextIOWrapper. Binary modes return io.BufferedReader ('rb'), io.BufferedWriter ('wb', 'ab', 'xb') or io.BufferedRandom (any mode with '+'). With buffering=0 in binary mode you get the raw io.FileIO.",
    },
    {
      q: "What does \"can't have unbuffered text I/O\" mean?",
      a: 'buffering=0 was combined with a text mode. Text needs a buffer for decoding; use buffering=1 for line buffering, or open in binary mode for unbuffered I/O.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/io.html#io.open',
    meta:  'io.open',
  },

};
