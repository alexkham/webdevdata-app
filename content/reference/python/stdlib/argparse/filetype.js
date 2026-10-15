// content/reference/python/stdlib/argparse/filetype.js

const READ_TEMPLATE = "import argparse, contextlib, io, os, shlex, sys\nfor name, text in [('notes.txt', 'milk\\neggs\\n'), ('todo.txt', 'call Ada\\n')]:\n    with open(name, 'w', encoding='utf-8') as f:\n        f.write(text)\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+', type=argparse.FileType('r', encoding='utf-8'), help='files to read, - for standard input')\nout = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        args = parser.parse_args(shlex.split({$cmdline}))\n    result = []\n    for f in args.files:\n        if f is sys.stdin:\n            result.append((f.name, 'standard input: not read here'))\n        else:\n            with f:\n                result.append((f.name, f.read().splitlines()))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const MODE_TEMPLATE = "import argparse, contextlib, io\nwith open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('milk\\neggs\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('file', type=argparse.FileType({$mode}))\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        args = parser.parse_args(['notes.txt'])\n    with args.file as f:\n        result = (type(f).__name__, f.mode)\nexcept SystemExit as e:\n    result = (e.code, err.getvalue().splitlines()[-1])\nresult";

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'filetype',
  name:        'argparse.FileType',
  signature:   "argparse.FileType(mode='r', bufsize=-1, encoding=None, errors=None)",
  blurb:       'A type= that opens the command-line word as a file, so args.infile is already an open file object; "-" stands for standard input or output. Deprecated in Python 3.14: take a path and open it after parsing instead.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse FileType type=argparse.FileType open file argument input file output file read file from command line stdin stdout dash - standard input file object mode rb wb encoding cant open No such file or directory deprecated 3.14 pathlib.Path file path argument infile outfile',
};

export const method = {
  slug:      'filetype',
  name:      'argparse.FileType',
  signature: "argparse.FileType(mode='r', bufsize=-1, encoding=None, errors=None)",
  returns:   { type: 'FileType', desc: 'A callable to pass as type=. Called with a command-line word it returns open(word, mode, bufsize, encoding, errors), or sys.stdin / sys.stdout (their .buffer in binary modes) for "-".' },

  category:    'argparse class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "FileType('r', encoding='utf-8') is a factory: argparse calls it with the word from the command line and stores whatever open() returns. A file that cannot be opened becomes a normal usage error: \"argument infile: can't open 'x.txt': [Errno 2] No such file or directory: 'x.txt'\". The catch is timing: files are opened while parsing, so they stay open if you forget them, and an output file is truncated even when a later argument is rejected. Python 3.14 deprecates it: resource management belongs after parsing.",

  covers: ['FileType'],

  cheat: {
    commonCall: "parser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))",
    returns:    'an open file object in args.infile (sys.stdin for -)',
    replaces:   'type=pathlib.Path, then open(args.path) after parsing',
    watchOut:   "Opened during parsing and never closed for you; mode 'w' truncates the file even if parsing then fails",
  },

  parameters: [
    { name: 'mode',     type: 'str',      required: false, default: "'r'",  desc: "Passed to open(): 'r', 'w', 'a', 'x', with 'b' for bytes and '+' for update. For '-', any mode containing r means sys.stdin; otherwise w, a or x means sys.stdout." },
    { name: 'bufsize',  type: 'int',      required: false, default: '-1',   desc: "open()'s buffering. 0 (binary modes only) gives an unbuffered FileIO." },
    { name: 'encoding', type: 'str|None', required: false, default: 'None', desc: "Text encoding. None means the locale's encoding, which differs between machines, so pass 'utf-8' for text files." },
    { name: 'errors',   type: 'str|None', required: false, default: 'None', desc: "How decoding errors are handled ('strict', 'replace', …), as for open()." },
  ],

  modes: [
    {
      id: 'read',
      label: 'read files',
      blurb: 'The program takes one or more files; notes.txt and todo.txt exist, nothing else does. Type a command line: each opened file is read and closed, a file that cannot be opened ends the program with exit status 2.',
      params: [{ name: 'cmdline', type: 'str', hint: 'file names after the program name', input: 'text' }],
      template: READ_TEMPLATE,
      cases: [
        { id: 'one',     label: 'notes.txt',             values: { cmdline: 'notes.txt' } },
        { id: 'two',     label: 'two files',             values: { cmdline: 'notes.txt todo.txt' } },
        { id: 'dot',     label: './todo.txt',            values: { cmdline: './todo.txt' } },
        { id: 'stdin',   label: 'with -',                values: { cmdline: 'notes.txt -' } },
        { id: 'missing', label: 'a missing file',        values: { cmdline: 'notes.txt missing.txt' } },
        { id: 'folder',  label: 'in a missing folder',   values: { cmdline: 'reports/june.txt' } },
        { id: 'spaces',  label: '"my notes.txt"',        values: { cmdline: '"my notes.txt"' } },
        { id: 'none',    label: 'nothing',               values: { cmdline: '' } },
        { id: 'help',    label: '-h',                    values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'mode',
      label: 'open modes',
      blurb: "Type a mode for FileType(mode); the program opens the existing notes.txt with it. You get the class of the file object and its .mode, or the error line.",
      params: [{ name: 'mode', type: 'str', hint: "an open() mode such as 'r' or 'rb'", input: 'text' }],
      template: MODE_TEMPLATE,
      cases: [
        { id: 'r',     label: "'r'",   values: { mode: 'r' } },
        { id: 'rb',    label: "'rb'",  values: { mode: 'rb' } },
        { id: 'w',     label: "'w'",   values: { mode: 'w' } },
        { id: 'ab',    label: "'ab'",  values: { mode: 'ab' } },
        { id: 'wplusb', label: "'w+b'", values: { mode: 'w+b' } },
        { id: 'x',     label: "'x'",   values: { mode: 'x' } },
        { id: 'rw',    label: "'rw'",  values: { mode: 'rw' } },
        { id: 'tr',    label: "'tr'",  values: { mode: 'tr' } },
      ],
    },
  ],
  demoExplainer: "The demo folder holds only notes.txt and todo.txt. Each word is passed to open() as it is, so f.name is exactly what was typed (./todo.txt stays ./todo.txt). '-' is not a file name: FileType returns sys.stdin itself, which this demo does not read. A missing file or folder is reported as \"argument files: can't open 'missing.txt': [Errno 2] No such file or directory: 'missing.txt'\" with exit status 2; in a real terminal notes.txt would already be open at that point and simply left for the garbage collector. In the second tab, text modes give a TextIOWrapper whose .mode is the string you typed ('tr' stays 'tr'), binary modes a BufferedReader, BufferedWriter or BufferedRandom whose .mode is normalised ('w+b' becomes 'rb+'). 'x' refuses an existing file ([Errno 17] File exists), and a mode open() rejects (such as 'rw') comes out as \"invalid FileType('rw') value\", because open() raised ValueError. Where operating systems disagree, the browser demo answers as Linux does: '.' is [Errno 21] Is a directory (Windows says [Errno 13] Permission denied), and names Windows rejects or rewrites (a trailing dot or space, a backslash, a quote) are simply missing files. Absolute paths, files above the demo folder, Notes.txt in another case and names over 255 bytes are not emulated in the browser.",

  patterns: [
    {
      name: 'An input file that defaults to standard input',
      desc: "nargs='?' with default='-': cat-style programs that read a file or a pipe. A str default goes through type= too.",
      code: "import argparse, sys\nparser = argparse.ArgumentParser()\nparser.add_argument('infile', nargs='?', type=argparse.FileType('r', encoding='utf-8'), default='-')\nargs = parser.parse_args()\nfor line in args.infile:\n    sys.stdout.write(line.upper())",
    },
    {
      name: 'The replacement: take a path, open it after parsing',
      desc: 'What the 3.14 deprecation points to: parsing cannot fail halfway with files open, and with closes them.',
      code: "import argparse, pathlib\nparser = argparse.ArgumentParser()\nparser.add_argument('infile', type=pathlib.Path)\nparser.add_argument('-o', '--output', type=pathlib.Path)\nargs = parser.parse_args()\nif not args.infile.is_file():\n    parser.error(f\"can't open '{args.infile}': no such file\")\nwith open(args.infile, encoding='utf-8') as src:\n    text = src.read()",
    },
    {
      name: 'Keep "-" support without FileType',
      desc: 'Map "-" to the standard stream yourself.',
      code: "import sys\n\ndef open_input(name):\n    if name == '-':\n        return sys.stdin\n    return open(name, encoding='utf-8')",
    },
  ],

  examples: [
    { title: 'The attribute is an open file', code: "import argparse\nwith open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('milk\\neggs\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))\nargs = parser.parse_args(['notes.txt'])\nwith args.infile as f:\n    text = f.read()\ntext", returns: "'milk\\neggs\\n'" },
    { title: '"-" means standard input or output', code: "import argparse, sys\n(argparse.FileType('r')('-') is sys.stdin,\n argparse.FileType('w')('-') is sys.stdout,\n argparse.FileType('rb')('-') is sys.stdin.buffer)", returns: '(True, True, True)' },
    { title: 'A file that cannot be opened is a usage error', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['missing.txt'])\nexcept SystemExit as e:\n    print('exit status', e.code)\n    print(err.getvalue().splitlines()[-1])", returns: "exit status 2\napp: error: argument infile: can't open 'missing.txt': [Errno 2] No such file or directory: 'missing.txt'" },
    { title: 'Binary mode gives bytes', code: "import argparse\nwith open('logo.png', 'wb') as f:\n    f.write(b'\\x89PNG\\r\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('image', type=argparse.FileType('rb'))\nargs = parser.parse_args(['logo.png'])\nwith args.image as f:\n    result = (type(f).__name__, f.mode, f.read())\nresult", returns: "('BufferedReader', 'rb', b'\\x89PNG\\r\\n')" },
    { title: 'A str default is opened too', code: "import argparse, sys\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-o', '--output', type=argparse.FileType('w', encoding='utf-8'), default='-')\nargs = parser.parse_args([])\nargs.output is sys.stdout", returns: 'True' },
    { title: 'With nargs, a list of open files', code: "import argparse\nfor name in ['a.txt', 'b.txt']:\n    with open(name, 'w', encoding='utf-8') as f:\n        f.write(name.upper())\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+', type=argparse.FileType('r', encoding='utf-8'))\nargs = parser.parse_args(['a.txt', 'b.txt'])\ncontents = []\nfor f in args.files:\n    with f:\n        contents.append((f.name, f.read()))\ncontents", returns: "[('a.txt', 'A.TXT'), ('b.txt', 'B.TXT')]" },
    { title: 'repr() shows the settings', code: "import argparse\n[argparse.FileType(), argparse.FileType('wb', 0), argparse.FileType('w', encoding='utf-8', errors='replace')]", returns: "[FileType('r'), FileType('wb', 0), FileType('w', encoding='utf-8', errors='replace')]" },
    { title: 'In -h it looks like any other argument (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'), help='file to read (- for stdin)')\nparser.add_argument('-o', '--output', type=argparse.FileType('w', encoding='utf-8'), default='-', help='where to write (default: stdout)')\n" + HELP_TAIL, returns: 'usage: app [-h] [-o OUTPUT] infile\n\npositional arguments:\n  infile               file to read (- for stdin)\n\noptions:\n  -h, --help           show this help message and exit\n  -o, --output OUTPUT  where to write (default: stdout)' },
  ],

  pitfalls: [
    {
      name: 'Truncating an output file, then failing',
      desc: "FileType('w') opens — and empties — the file as soon as -o report.txt is parsed. If a later argument is rejected the program exits, and report.txt has already lost its contents.",
      wrong: { label: "FileType('w')", code: "import argparse, contextlib, io\nwith open('report.txt', 'w', encoding='utf-8') as f:\n    f.write('42 visits\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-o', '--output', type=argparse.FileType('w', encoding='utf-8'))\nparser.add_argument('days', type=int)\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        parser.parse_args(['-o', 'report.txt', 'seven'])\nexcept SystemExit:\n    pass\nwith open('report.txt', encoding='utf-8') as f:\n    print(repr(f.read()))", output: "''" },
      fix:   { label: 'type=pathlib.Path', code: "import argparse, contextlib, io, pathlib\nwith open('report.txt', 'w', encoding='utf-8') as f:\n    f.write('42 visits\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-o', '--output', type=pathlib.Path)\nparser.add_argument('days', type=int)\ntry:\n    with contextlib.redirect_stderr(io.StringIO()):\n        parser.parse_args(['-o', 'report.txt', 'seven'])\nexcept SystemExit:\n    pass\nwith open('report.txt', encoding='utf-8') as f:\n    print(repr(f.read()))", output: "'42 visits\\n'" },
    },
    {
      name: 'Passing the class instead of an instance',
      desc: 'type=argparse.FileType would call FileType(word) and build a factory instead of opening anything; add_argument rejects it up front.',
      wrong: { label: 'type=argparse.FileType', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType)", output: "ValueError: <class 'argparse.FileType'> is a FileType class object, instance of it must be passed" },
      fix:   { label: "FileType('r', ...)", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\naction = parser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))\naction.type", output: "FileType('r', encoding='utf-8')" },
    },
    {
      name: 'Never closing the file',
      desc: 'argparse opens the file but does not close it. Use the attribute in a with block (or call close()).',
      wrong: { label: 'read and forget', code: "import argparse\nwith open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('milk\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))\nargs = parser.parse_args(['notes.txt'])\nfirst = args.infile.readline()\n(first, args.infile.closed)", output: "('milk\\n', False)" },
      fix:   { label: 'with args.infile', code: "import argparse\nwith open('notes.txt', 'w', encoding='utf-8') as f:\n    f.write('milk\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8'))\nargs = parser.parse_args(['notes.txt'])\nwith args.infile as f:\n    first = f.readline()\n(first, args.infile.closed)", output: "('milk\\n', True)" },
    },
  ],

  when: {
    use: [
      'Small scripts that read a file or standard input ("-") and want argparse to report unopenable files',
      'Existing code on Python 3.13 or older that already uses it',
    ],
    avoid: [
      'Output files: they are truncated before parsing has finished → type=pathlib.Path, open after parse_args()',
      'New code for 3.14+: FileType is deprecated → take a path and open it with with',
      'Help with MetavarTypeHelpFormatter: a FileType object has no __name__, so formatting fails with AttributeError',
    ],
  },

  notes: {
    cpython:       "class FileType(object) in Lib/argparse.py: __call__(string) returns sys.stdin / sys.stdout (or .buffer when 'b' is in the mode) for '-', else open(string, mode, bufsize, encoding, errors). An OSError becomes ArgumentTypeError(\"can't open '%(filename)s': %(error)s\"); a ValueError from open() (bad mode, unbuffered text) becomes \"invalid FileType('rw') value: 'x'\"; a LookupError for an unknown encoding is not caught and escapes parse_args with a traceback",
    'Deprecated':  'Deprecated since Python 3.14 (gh-58032): "Anything relating to resource management should be handled downstream, after the arguments have been parsed." No removal date is scheduled. The documentation also warns that if a later argument fails, files already opened are not closed and output files can be clobbered',
    'Platforms':   'The open() errors are the operating system\'s: opening a folder gives [Errno 21] Is a directory on Linux and macOS but [Errno 13] Permission denied on Windows, and Windows and macOS match names case-insensitively. Without encoding=, text is decoded with the locale encoding (often UTF-8 on Linux and macOS, a code page such as cp1252 on Windows)',
    'Versions':    'encoding and errors were added in 3.4. Help output differs between 3.12 ("-o OUTPUT, --output OUTPUT") and 3.13 ("-o, --output OUTPUT")',
  },

  related: [
    { name: 'ArgumentTypeError', slug: 'argumenttypeerror', when: 'What FileType raises for a file it cannot open' },
    { name: 'add_argument()', slug: 'add_argument', when: 'Where type= goes' },
    { name: 'nargs', slug: 'nargs', when: "nargs='?' with default='-' for optional input files" },
    { name: 'open()', slug: 'open', when: 'What FileType calls with your mode, bufsize, encoding and errors', category: 'functions' },
    { name: 'Path', slug: 'path', when: 'type=pathlib.Path: the deprecation-proof alternative', category: 'stdlib/pathlib' },
    { name: 'sys.stdin / stdout / stderr', slug: 'stdout', when: 'What "-" maps to', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'How do I take a file name argument with argparse?',
      a: "Either parser.add_argument('infile', type=argparse.FileType('r', encoding='utf-8')), which gives you an open file object in args.infile, or type=pathlib.Path, which gives you a path to open yourself after parse_args(). The second is what Python 3.14 recommends, since FileType is deprecated there.",
    },
    {
      q: 'How do I read from a file or from stdin in argparse?',
      a: "parser.add_argument('infile', nargs='?', type=argparse.FileType('r'), default='-'). A missing argument uses the default '-', and FileType turns '-' into sys.stdin, so the program reads from a pipe when no file is given.",
    },
    {
      q: 'Why is argparse.FileType deprecated?',
      a: 'It opens files while the command line is still being parsed. If a later argument is invalid, the program exits with those files still open, and a file opened with mode "w" has already been truncated. Python 3.14 deprecated it, saying resource management should happen after the arguments have been parsed: take a path (type=pathlib.Path) and open the file yourself. It still works, and no removal date has been set.',
    },
    {
      q: 'Does argparse close files opened by FileType?',
      a: 'No. The file object is stored in the Namespace and stays open until you close it or it is garbage collected. Use it in a with block: with args.infile as f: ...',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.FileType',
    meta:  'argparse.FileType',
  },

};
