// content/reference/python/stdlib/argparse/index.js — the argparse module hub

const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'index',
  name:        'argparse',
  signature:   'import argparse',
  blurb:       'Turn sys.argv into a Namespace of typed values: declare options and positionals once, get parsing, -h help, usage lines and precise error messages for free.',
  category:    'system',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse module python command line arguments parse argv ArgumentParser add_argument parse_args namespace options flags positional arguments help message usage cli script sys.argv subcommands subparsers store_true nargs choices type required default argparse tutorial',
};

export const method = {
  slug: 'index',
  name: 'argparse',

  category:    'System',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Three calls do almost everything: ArgumentParser() creates the parser, add_argument() declares each option or positional, parse_args() turns the command line into a Namespace. Bad input never reaches your code: argparse prints the usage and an error message to stderr and exits with status 2.',

  // ArgumentParser's own methods (parse_args, add_subparsers, format_help,
  // error, ...) and Action.format_usage count toward coverage.
  // add_argument, add_argument_group, add_mutually_exclusive_group,
  // set_defaults, get_default and register are defined on the private base
  // class _ActionsContainer; they have pages that claim no public name.
  coverClasses: ['ArgumentParser', 'Action'],

  // argparse is pure Python and the same on every platform: WSL CPython
  // 3.12 lists the same 18 names in __all__ as Windows CPython 3.13.
  platformNames: [],

  imports: ['import argparse', 'from argparse import ArgumentParser'],
  facts: [
    { label: 'Main API',      value: 'ArgumentParser, add_argument, parse_args, Namespace' },
    { label: 'Errors',        value: 'usage + "prog: error: ..." on stderr, then SystemExit(2); -h and --version exit with 0' },
    { label: 'Help width',    value: 'terminal width minus 2, read with shutil.get_terminal_size(): the COLUMNS environment variable wins' },
    { label: 'Version notes', value: 'deprecated= 3.13; suggest_on_error= and color= 3.14; FileType deprecated in 3.14' },
  ],

  modes: [
    {
      id: 'cli',
      label: 'parse a command line',
      blurb: 'A small greeting program. Type a command line the way you would in a shell: success gives the Namespace, anything else gives (exit status, what the program printed).',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app', description='Say hello to people.')\nparser.add_argument('names', nargs='+', help='who to greet')\nparser.add_argument('-n', '--times', type=int, default=1, help='repeat each greeting N times (default: %(default)s)')\nparser.add_argument('-v', '--verbose', action='store_true', help='explain what is happening')\nparser.add_argument('--version', action='version', version='%(prog)s 1.0')\n" + TAIL,
      cases: [
        { id: 'one',      label: 'one name',        values: { cmdline: 'Ada' } },
        { id: 'options',  label: 'with options',    values: { cmdline: 'Ada Grace -n 3 -v' } },
        { id: 'equals',   label: '--opt=value',     values: { cmdline: '--times=2 "Ada Lovelace"' } },
        { id: 'grouped',  label: '-vn2',            values: { cmdline: 'Ada -vn2' } },
        { id: 'missing',  label: 'nothing',         values: { cmdline: '' } },
        { id: 'badint',   label: 'not a number',    values: { cmdline: 'Ada -n three' } },
        { id: 'unknown',  label: 'unknown option',  values: { cmdline: 'Ada --loud' } },
        { id: 'help',     label: '-h',              values: { cmdline: '-h' } },
        { id: 'version',  label: '--version',       values: { cmdline: '--version' } },
      ],
    },
    {
      id: 'sub',
      label: 'subcommands',
      blurb: 'A git-style tool with two subcommands, each with its own arguments and its own -h.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\ncommands = parser.add_subparsers(dest='command', required=True)\nadd = commands.add_parser('add', help='stage files')\nadd.add_argument('paths', nargs='+')\ncommit = commands.add_parser('commit', help='record the staged files')\ncommit.add_argument('-m', '--message', required=True)\ncommit.add_argument('--amend', action='store_true')\n" + TAIL,
      cases: [
        { id: 'add',     label: 'add a.txt b.txt',  values: { cmdline: 'add a.txt b.txt' } },
        { id: 'commit',  label: 'commit -m',        values: { cmdline: 'commit -m "first draft"' } },
        { id: 'nomsg',   label: 'commit without -m', values: { cmdline: 'commit --amend' } },
        { id: 'unknown', label: 'unknown command',  values: { cmdline: 'push' } },
        { id: 'none',    label: 'no command',       values: { cmdline: '' } },
        { id: 'subhelp', label: 'commit -h',        values: { cmdline: 'commit -h' } },
      ],
    },
  ],
  demoExplainer: 'The command line is split with shlex.split, the same rules a POSIX shell uses for quotes. On success you get the Namespace, attributes in the order the arguments were added. On failure parse_args prints the usage line plus "app: error: ..." to stderr and raises SystemExit(2); -h and --version print to stdout and raise SystemExit(0). The usage line wraps because COLUMNS is fixed at 60 here: argparse wraps help at the terminal width minus 2, so the same program prints differently in a narrow and a wide terminal. Note -vn2: short flags can be grouped, and the last one may take its value attached. With subcommands, errors and help come from the subparser, whose prog is "app commit". The outputs are from CPython 3.13.3; 3.12 prints "-n TIMES, --times TIMES" in the help instead of "-n, --times TIMES".',

  patterns: [
    {
      name: 'The standard script skeleton',
      desc: 'Build the parser in a function, parse in main(), and keep the logic separate so it can be tested without a command line.',
      code: "import argparse\n\ndef build_parser():\n    parser = argparse.ArgumentParser(description='Resize images.')\n    parser.add_argument('files', nargs='+', help='images to resize')\n    parser.add_argument('-w', '--width', type=int, default=800)\n    parser.add_argument('-v', '--verbose', action='store_true')\n    return parser\n\ndef main(argv=None):\n    args = build_parser().parse_args(argv)\n    for name in args.files:\n        print(f'resizing {name} to {args.width}px')\n\nif __name__ == '__main__':\n    main()",
    },
    {
      name: 'Test a parser without a shell',
      desc: 'parse_args takes a list. shlex.split turns a shell-style string into that list.',
      code: "import shlex\nargs = build_parser().parse_args(shlex.split('photo.jpg --width 640'))\nassert args.width == 640",
    },
    {
      name: 'Turn the Namespace into keyword arguments',
      desc: 'vars() gives the attribute dict; pass it straight to a function whose parameters have the same names.',
      code: "args = parser.parse_args()\nrun(**vars(args))",
    },
    {
      name: 'Report a problem found after parsing',
      desc: 'parser.error() prints the usage and your message in argparse style and exits with status 2.',
      code: "args = parser.parse_args()\nif args.start > args.end:\n    parser.error('--start must not be after --end')",
    },
  ],

  examples: [
    { title: 'Parse a list instead of sys.argv', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('filename')\nparser.add_argument('-c', '--count', type=int, default=1)\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.parse_args(['notes.txt', '-c', '3'])", returns: "Namespace(filename='notes.txt', count=3, verbose=False)" },
    { title: 'Values are attributes', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('filename')\nparser.add_argument('-c', '--count', type=int, default=1)\nargs = parser.parse_args(['notes.txt'])\n(args.filename, args.count)", returns: "('notes.txt', 1)" },
    { title: 'vars() gives a dict', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.add_argument('--tags', nargs='*', default=[])\nvars(parser.parse_args(['--name', 'Ada', '--tags', 'math', 'code']))", returns: "{'name': 'Ada', 'tags': ['math', 'code']}" },
    { title: 'Bad input: message on stderr, exit status 2', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-c', '--count', type=int)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['-c', 'three'])\nexcept SystemExit as e:\n    print('exit status', e.code)\n    print(err.getvalue().splitlines()[-1])", returns: "exit status 2\napp: error: argument -c/--count: invalid int value: 'three'" },
    { title: 'The generated help (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', description='Count the lines of a file.')\nparser.add_argument('filename', help='the file to read')\nparser.add_argument('-v', '--verbose', action='store_true', help='print progress')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: "usage: app [-h] [-v] filename\n\nCount the lines of a file.\n\npositional arguments:\n  filename       the file to read\n\noptions:\n  -h, --help     show this help message and exit\n  -v, --verbose  print progress" },
    { title: 'Shell-style strings with shlex.split', code: "import argparse, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.add_argument('--greeting', default='Hello')\nparser.parse_args(shlex.split('--name \"Ada Lovelace\"'))", returns: "Namespace(name='Ada Lovelace', greeting='Hello')" },
    { title: 'exit_on_error=False raises instead of exiting', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\nparser.parse_args(['--port', 'http'])", returns: "argparse.ArgumentError: argument --port: invalid int value: 'http'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting that every value is a str',
      desc: 'Without type=, argparse stores exactly the text from the command line, so arithmetic silently becomes string repetition.',
      wrong: { label: 'no type=', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--count')\nargs = parser.parse_args(['--count', '3'])\nargs.count * 2", output: "'33'" },
      fix:   { label: 'type=int', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--count', type=int)\nargs = parser.parse_args(['--count', '3'])\nargs.count * 2", output: '6' },
    },
    {
      name: 'Passing a string to parse_args',
      desc: 'parse_args expects a list of arguments. A str is iterated character by character, so every character becomes its own argument.',
      wrong: { label: 'a str', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--count', type=int)\nparser.parse_args('--count 3')", output: 'argparse.ArgumentError: unrecognized arguments: - - c o u n t   3' },
      fix:   { label: 'shlex.split', code: "import argparse, shlex\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--count', type=int)\nparser.parse_args(shlex.split('--count 3'))", output: 'Namespace(count=3)' },
    },
    {
      name: 'Catching parse errors with except Exception',
      desc: 'parse_args reports errors by raising SystemExit, which derives from BaseException, not Exception. A bare except Exception lets it through and the program exits.',
      wrong: { label: 'except Exception', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        parser.parse_args(['--port', 'http'])\n    except Exception:\n        print('bad port, using 8080')", output: 'SystemExit: 2' },
      fix:   { label: 'except SystemExit', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        parser.parse_args(['--port', 'http'])\n    except SystemExit:\n        print('bad port, using 8080')", output: 'bad port, using 8080' },
    },
  ],

  when: {
    use: [
      'Any script that takes options, flags or file names on the command line',
      'Tools with subcommands (git-style): add_subparsers',
      'When you want -h help, usage lines and error messages without writing them',
    ],
    avoid: [
      'Reading one or two raw arguments in a throwaway script → sys.argv',
      'Strict POSIX getopt behaviour (no option/positional intermixing) → getopt or optparse',
      'Configuration files → configparser, tomllib or json, then let argparse override',
    ],
  },

  notes: {
    cpython:       'Lib/argparse.py, pure Python (about 2,650 lines in 3.13); help wrapping uses textwrap, the width comes from shutil.get_terminal_size()',
    'Exit codes':  'parse errors and parser.error(): status 2; -h, --help, --version and parser.exit(): status 0 unless you pass another',
    'Versions':    'argparse 3.13 shows "-n, --count COUNT" in help where 3.12 showed "-n COUNT, --count COUNT" (gh-101599). 3.14 adds suggest_on_error= and color=: help is colored when the terminal supports it',
    'Determinism': 'help and usage wrap at the terminal width, so the examples on these pages fix COLUMNS inside try/finally to print the same thing everywhere',
  },

  related: [
    { name: 'sys.argv',   slug: 'argv',       when: 'The raw list that parse_args() reads by default', category: 'stdlib/sys' },
    { name: 'sys.exit',   slug: 'exit',       when: 'What argparse calls on errors and after -h', category: 'stdlib/sys' },
    { name: 'SystemExit', slug: 'systemexit', when: 'The exception parse errors raise', category: 'exceptions' },
    { name: 'vars()',     slug: 'vars',       when: 'Namespace → dict', category: 'functions' },
    { name: 'subprocess module', slug: 'subprocess', when: 'Running other command-line programs', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I read command-line arguments in Python?',
      a: 'For anything beyond one or two values, use argparse: create argparse.ArgumentParser(), call add_argument() for each option or positional, then args = parser.parse_args(). Each argument becomes an attribute (args.filename, args.count). The raw list is sys.argv, where sys.argv[0] is the script name.',
    },
    {
      q: 'Why does my script exit with code 2?',
      a: 'That is argparse rejecting the command line: a required argument is missing, an option is unknown, or a value failed type= or choices=. It prints the usage and "prog: error: ..." to stderr and calls sys.exit(2). Pass exit_on_error=False (3.9+) to get an argparse.ArgumentError you can catch instead.',
    },
    {
      q: 'How do I test code that uses argparse?',
      a: 'Pass the arguments explicitly: parser.parse_args(["--count", "3"]) instead of relying on sys.argv. shlex.split("--name \\"Ada Lovelace\\"") builds that list from a shell-style string. To test error paths, catch SystemExit (its code is 2) and redirect stderr with contextlib.redirect_stderr.',
    },
    {
      q: 'Should I use argparse, optparse or getopt?',
      a: 'argparse is the recommended standard-library choice: it handles positionals, subcommands, types and help generation. getopt mimics the C function and leaves everything else to you; optparse is the older options-only parser, which the 3.13 documentation no longer calls deprecated and suggests as a lower-level foundation when argparse\'s conventions do not fit.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html',
    meta:  'argparse — Parser for command-line options, arguments and subcommands',
  },

};
