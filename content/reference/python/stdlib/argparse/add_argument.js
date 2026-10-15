// content/reference/python/stdlib/argparse/add_argument.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'add_argument',
  name:        'ArgumentParser.add_argument',
  signature:   'ArgumentParser.add_argument(name or flags..., *, action, nargs, const, default, type, choices, required, help, metavar, dest, deprecated)',
  blurb:       'Declare one command-line argument: a positional name or option flags, plus how to convert, check, store and describe its value.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+ (deprecated= 3.13)',
  searchTerms: 'argparse add_argument python add argument option flag positional argument type=int default choices required help metavar dest deprecated name or flags -f --foo dest inference dashes underscores type=bool %(default)s help string default value conversion',
};

export const method = {
  slug:      'add_argument',
  name:      'ArgumentParser.add_argument',
  signature: 'ArgumentParser.add_argument(name or flags..., *, action, nargs, const, default, type, choices, required, help, metavar, dest, deprecated)',
  returns:   { type: 'Action', desc: 'The Action object that will handle this argument (a _StoreAction for the default action). Most code ignores it.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+ (deprecated= 3.13)',
  hasLiveDemo: true,

  subtitle: "One call per argument. A bare name ('filename') makes a positional, flags ('-c', '--count') make an option. Everything after that is keywords: type= converts the text, choices= restricts it, default= fills it in when absent, help= and metavar= shape the -h output.",

  // add_argument is defined on the private base class _ActionsContainer
  // (shared with argument groups), so it is not a public name of a
  // coverClasses class; this page claims no name of the coverage surface.
  covers: [],

  cheat: {
    commonCall: "parser.add_argument('-n', '--count', type=int, default=1, help='how many')",
    returns:    'an Action; the value lands in args.count',
    replaces:   'checking and converting sys.argv items by hand',
    watchOut:   'Values are str unless you pass type=; never use type=bool',
  },

  parameters: [
    { name: 'name or flags', type: 'str, ...', required: true, default: null, desc: "One name for a positional ('src'), or one or more option strings ('-s', '--source'). Anything starting with a prefix character (normally -) is an option." },
    { name: 'action',     type: 'str | type[Action]', required: false, default: "'store'", desc: "What to do when the argument is seen: 'store', 'store_const', 'store_true', 'store_false', 'append', 'append_const', 'extend', 'count', 'help', 'version', or an Action subclass such as BooleanOptionalAction." },
    { name: 'nargs',      type: "int | '?' | '*' | '+'", required: false, default: 'None', desc: 'How many command-line words to consume. None means exactly one, stored as is; an int N or * + produce a list; ? means zero or one.' },
    { name: 'const',      type: 'object', required: false, default: 'None', desc: "The value for store_const / append_const, and for an option with nargs='?' given without a value." },
    { name: 'default',    type: 'object', required: false, default: 'None', desc: 'Value when the argument is absent. A str default goes through type= like command-line text; other defaults are used as they are. argparse.SUPPRESS leaves the attribute out.' },
    { name: 'type',       type: 'callable', required: false, default: 'None', desc: 'Called with each command-line string: int, float, pathlib.Path, argparse.FileType(...), or your own function. A ValueError or TypeError becomes a clean "invalid int value: \'x\'" error; an ArgumentTypeError shows its own message.' },
    { name: 'choices',    type: 'container', required: false, default: 'None', desc: 'Allowed values, checked after type conversion with the in operator: a list, tuple, range, dict keys, a str (each character).' },
    { name: 'required',   type: 'bool', required: false, default: 'False', desc: 'Options only: make the option mandatory. Positionals are required unless nargs is ?, * or REMAINDER; passing required= to a positional is a TypeError.' },
    { name: 'help',       type: 'str', required: false, default: 'None', desc: 'One-line description for -h. %(default)s, %(type)s, %(choices)s, %(prog)s and the other keywords are substituted; write %% for a literal %. argparse.SUPPRESS hides the argument.' },
    { name: 'metavar',    type: 'str | tuple', required: false, default: 'None', desc: 'Name shown for the value in usage and help (default: dest, uppercased for options). A tuple names each value of an nargs=N argument.' },
    { name: 'dest',       type: 'str', required: false, default: 'None', desc: 'Attribute name in the Namespace. Positionals: the name itself. Options: the first long flag (else the first short one) without prefix, with - turned into _.' },
    { name: 'deprecated', type: 'bool', required: false, default: 'False', desc: "3.13+: print \"prog: warning: option '--x' is deprecated\" to stderr when the argument is used." },
  ],

  modes: [
    {
      id: 'values',
      label: 'type, choices, default',
      blurb: 'size must convert with int, --format must be one of three names, and --quality has a str default that goes through float. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('size', type=int, help='width in pixels')\nparser.add_argument('--format', choices=['png', 'jpeg', 'webp'], default='png')\nparser.add_argument('--quality', type=float, default='0.8', help='0 to 1 (default: %(default)s)')\n" + TAIL,
      cases: [
        { id: 'plain',   label: '640',            values: { cmdline: '640' } },
        { id: 'all',     label: 'all options',    values: { cmdline: '640 --format webp --quality .5' } },
        { id: 'badint',  label: 'not an int',     values: { cmdline: 'big' } },
        { id: 'choice',  label: 'bad choice',     values: { cmdline: '640 --format gif' } },
        { id: 'float',   label: 'bad float',      values: { cmdline: '640 --quality high' } },
        { id: 'help',    label: '-h',             values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'names',
      label: 'dest, metavar, required',
      blurb: '--output-file becomes args.output_file, -n is stored under dest="count", and FILE is only the name shown in help.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('input', help='file to read')\nparser.add_argument('-o', '--output-file', metavar='FILE', required=True, help='where to write')\nparser.add_argument('-n', dest='count', type=int, default=1, help='copies (default: %(default)s)')\n" + TAIL,
      cases: [
        { id: 'short',   label: '-o',              values: { cmdline: 'in.txt -o out.txt' } },
        { id: 'long',    label: '--output-file=',  values: { cmdline: 'in.txt --output-file=out.txt -n 3' } },
        { id: 'missing', label: 'no -o',           values: { cmdline: 'in.txt' } },
        { id: 'help',    label: '-h',              values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "The default '0.8' is a str, so argparse runs it through type=float just like command-line text and the Namespace holds 0.8 — a non-str default is stored untouched. Conversion errors name the type function (\"invalid int value: 'big'\"), choice errors list the allowed values. In the second tab the attribute is output_file (dashes become underscores) while help shows -o, --output-file FILE; the missing-option error names the argument by all its flags, -o/--output-file.",

  patterns: [
    {
      name: 'Positional plus options',
      desc: 'The common shape of a script: one or more inputs, then switches.',
      code: "parser.add_argument('files', nargs='+', help='files to process')\nparser.add_argument('-o', '--output', default='out.txt', help='where to write (default: %(default)s)')\nparser.add_argument('-v', '--verbose', action='store_true')",
    },
    {
      name: 'Validate with a type function',
      desc: 'Raise ArgumentTypeError (or ValueError) and argparse turns it into a usage error.',
      code: "import argparse\n\ndef port(text):\n    n = int(text)\n    if not 1 <= n <= 65535:\n        raise argparse.ArgumentTypeError(f'{n} is not a valid port')\n    return n\n\nparser.add_argument('--port', type=port, default=8080)",
    },
    {
      name: 'Paths as Path objects',
      desc: 'Any one-argument callable works as type=.',
      code: "import pathlib\nparser.add_argument('config', type=pathlib.Path)",
    },
    {
      name: 'A fixed set of values',
      desc: 'choices= checks after conversion and shows the set in usage and help.',
      code: "parser.add_argument('--log-level', choices=['debug', 'info', 'warning', 'error'], default='info')",
    },
  ],

  examples: [
    { title: 'A positional and an option', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('filename')\nparser.add_argument('-c', '--count', type=int, default=1)\nparser.parse_args(['data.csv', '--count', '3'])", returns: "Namespace(filename='data.csv', count=3)" },
    { title: 'It returns the Action', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-n', '--count', type=int, default=1)", returns: "_StoreAction(option_strings=['-n', '--count'], dest='count', nargs=None, const=None, default=1, type=<class 'int'>, choices=None, required=False, help=None, metavar=None, deprecated=False)" },
    { title: 'dest comes from the first long flag', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-f', '--foo-bar', '--foo')\nparser.add_argument('-x', '-y')\nparser.parse_args(['--foo', '1', '-y', '2'])", returns: "Namespace(foo_bar='1', x='2')" },
    { title: 'Only str defaults are converted', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--length', default='10', type=int)\nparser.add_argument('--width', default=10.5, type=int)\nparser.parse_args([])", returns: 'Namespace(length=10, width=10.5)' },
    { title: 'choices is checked after type=', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--level', type=int, choices=range(1, 6))\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--level', '7'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "app: error: argument --level: invalid choice: '7' (choose from 1, 2, 3, 4, 5)" },
    { title: '%(default)s, %(type)s and a metavar tuple in -h', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--retries', type=int, default=3, help='attempts before giving up (default: %(default)s, type: %(type)s)')\nparser.add_argument('--size', nargs=2, type=int, metavar=('WIDTH', 'HEIGHT'), help='image size in pixels')\n" + HELP_TAIL, returns: 'usage: app [-h] [--retries RETRIES] [--size WIDTH HEIGHT]\n\noptions:\n  -h, --help           show this help message and exit\n  --retries RETRIES    attempts before giving up (default:\n                       3, type: int)\n  --size WIDTH HEIGHT  image size in pixels' },
    { title: 'deprecated=True warns on use (3.13+)', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--legs', type=int, default=0, deprecated=True)\nerr = io.StringIO()\nwith contextlib.redirect_stderr(err):\n    args = parser.parse_args(['--legs', '4'])\nprint(err.getvalue().strip())\nargs", returns: "app: warning: option '--legs' is deprecated\nNamespace(legs=4)" },
  ],

  pitfalls: [
    {
      name: 'type=bool',
      desc: 'bool() of any non-empty string is True, so "False" parses as True. Use a flag instead: store_true, or BooleanOptionalAction for --x/--no-x.',
      wrong: { label: 'type=bool', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--verbose', type=bool)\nparser.parse_args(['--verbose', 'False'])", output: 'Namespace(verbose=True)' },
      fix:   { label: "action='store_true'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--verbose', action='store_true')\n(parser.parse_args([]), parser.parse_args(['--verbose']))", output: '(Namespace(verbose=False), Namespace(verbose=True))' },
    },
    {
      name: 'Reading a dashed option as args.dry-run',
      desc: 'dest replaces - with _, so --dry-run is args.dry_run. args.dry-run is the subtraction args.dry - run.',
      wrong: { label: 'args.dry-run', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--dry-run', action='store_true')\nargs = parser.parse_args(['--dry-run'])\nargs.dry-run", output: "AttributeError: 'Namespace' object has no attribute 'dry'" },
      fix:   { label: 'args.dry_run', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--dry-run', action='store_true')\nargs = parser.parse_args(['--dry-run'])\nargs.dry_run", output: 'True' },
    },
    {
      name: 'required=False on a positional',
      desc: "Positionals cannot take required=. An optional positional is spelled nargs='?' (with a default).",
      wrong: { label: 'required=False', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('filename', required=False)", output: "TypeError: 'required' is an invalid argument for positionals" },
      fix:   { label: "nargs='?'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('filename', nargs='?', default='-')\nparser.parse_args([])", output: "Namespace(filename='-')" },
    },
  ],

  when: {
    use: [
      'Every argument the program accepts: one call each',
      'On a group (add_argument_group / add_mutually_exclusive_group) — same method, same keywords',
    ],
    avoid: [
      'Complex validation that needs several arguments at once → check after parse_args and call parser.error()',
      'Conversions that can fail with other exceptions (JSON, files) → convert after parsing; type= only catches ValueError, TypeError and ArgumentTypeError',
    ],
  },

  notes: {
    cpython:       '_ActionsContainer.add_argument in Lib/argparse.py: splits positional/optional, infers dest, picks the action class from the registry, then test-formats the metavar so a bad metavar tuple fails here, not at -h time',
    'Errors here': 'mistakes in the declaration raise at once: ValueError (bad nargs/metavar, unknown action, invalid option string), TypeError (required on a positional), ArgumentError (duplicate option string)',
    'Defaults':    'a positional with nargs=None is required, so its default is ignored; give it nargs="?" to make the default reachable',
  },

  related: [
    { name: 'actions', slug: 'actions', when: 'Every action= value' },
    { name: 'nargs', slug: 'nargs', when: 'How many values an argument takes' },
    { name: 'ArgumentTypeError', slug: 'argumenttypeerror', when: 'Error messages from your type= functions' },
    { name: 'FileType', slug: 'filetype', when: 'type= that opens the file for you' },
    { name: 'argparse.SUPPRESS', slug: 'suppress', when: 'Hide an argument or leave it out of the Namespace' },
    { name: 'add_argument_group()', slug: 'add_argument_group', when: 'Same call, separate help section' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'The object you call it on' },
  ],

  faq: [
    {
      q: 'How do I make an argparse option required?',
      a: "Pass required=True to add_argument for an option (--name). Positionals are already required unless nargs is '?', '*' or REMAINDER. Missing ones produce \"error: the following arguments are required: --name\".",
    },
    {
      q: 'How do I give an argument a default value?',
      a: "default=... in add_argument. Absent options get it; a str default is converted with type= first. For positionals add nargs='?' or the default is never used. %(default)s in help= shows it in -h.",
    },
    {
      q: 'How do I accept only certain values?',
      a: 'choices=[...] (any container that supports in). The check runs after type= conversion, so with type=int the choices must be ints: choices=range(1, 6).',
    },
    {
      q: 'Why does my argument end up with an underscore name?',
      a: 'dest is derived from the first long option with the prefix removed and - replaced by _, so --dry-run is args.dry_run. Pass dest= to choose the attribute name yourself; metavar= only changes what help shows.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#the-add-argument-method',
    meta:  'The add_argument() method',
  },

};
