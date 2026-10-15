// content/reference/python/stdlib/argparse/argumentparser.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'argumentparser',
  name:        'argparse.ArgumentParser',
  signature:   "argparse.ArgumentParser(prog=None, usage=None, description=None, epilog=None, parents=[], formatter_class=HelpFormatter, prefix_chars='-', fromfile_prefix_chars=None, argument_default=None, conflict_handler='error', add_help=True, allow_abbrev=True, exit_on_error=True)",
  blurb:       'The parser object: holds every argument you declare, turns a command line into a Namespace, and writes the usage, help and error messages.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+ (allow_abbrev 3.5, exit_on_error 3.9)',
  searchTerms: 'argparse ArgumentParser python create parser prog usage description epilog parents formatter_class prefix_chars fromfile_prefix_chars argument_default conflict_handler resolve add_help allow_abbrev abbreviation exit_on_error parser options constructor',
};

export const method = {
  slug:      'argumentparser',
  name:      'argparse.ArgumentParser',
  signature: "argparse.ArgumentParser(prog=None, usage=None, description=None, epilog=None, parents=[], formatter_class=HelpFormatter, prefix_chars='-', fromfile_prefix_chars=None, argument_default=None, conflict_handler='error', add_help=True, allow_abbrev=True, exit_on_error=True)",
  returns:   { type: 'ArgumentParser', desc: 'A parser with only -h/--help defined (unless add_help=False). Add arguments with add_argument(), then call parse_args().' },

  category:    'argparse class',
  version:     'Python 3.2+ (allow_abbrev 3.5, exit_on_error 3.9)',
  hasLiveDemo: true,

  subtitle: 'Thirteen keyword arguments, and most programs need two of them: prog (the name in messages) and description (the text under the usage line). The rest decide how strict the parser is — option prefixes, abbreviations, conflicts, and whether a bad command line exits or raises.',

  covers: ['ArgumentParser'],

  cheat: {
    commonCall: "parser = argparse.ArgumentParser(description='Resize images.')",
    returns:    'a parser with -h/--help; add arguments next',
    replaces:   'hand-written sys.argv loops and usage strings',
    watchOut:   'Pass everything by keyword: the second positional parameter is usage, not description',
  },

  parameters: [
    { name: 'prog',                  type: 'str',  required: false, default: 'None', desc: 'Program name used in usage, help and error messages and as %(prog)s. None means os.path.basename(sys.argv[0]).' },
    { name: 'usage',                 type: 'str',  required: false, default: 'None', desc: 'Replaces the generated usage line; %(prog)s is filled in. argparse.SUPPRESS hides the usage line.' },
    { name: 'description',           type: 'str',  required: false, default: 'None', desc: 'Text printed between the usage line and the argument list, re-wrapped to the terminal width.' },
    { name: 'epilog',                type: 'str',  required: false, default: 'None', desc: 'Text printed after the argument list, re-wrapped like description.' },
    { name: 'parents',               type: 'list[ArgumentParser]', required: false, default: '[]', desc: 'Parsers whose arguments (and set_defaults values) are copied into this one. Parents normally use add_help=False.' },
    { name: 'formatter_class',       type: 'type', required: false, default: 'HelpFormatter', desc: 'Class used to lay out help: RawDescriptionHelpFormatter, RawTextHelpFormatter, ArgumentDefaultsHelpFormatter, MetavarTypeHelpFormatter, or your own subclass.' },
    { name: 'prefix_chars',          type: 'str',  required: false, default: "'-'", desc: "Characters that start an option. '-+' allows both -f and +f." },
    { name: 'fromfile_prefix_chars', type: 'str',  required: false, default: 'None', desc: "Characters that mark an argument file: with '@', @args.txt is replaced by the lines of args.txt." },
    { name: 'argument_default',      type: 'object', required: false, default: 'None', desc: 'Default for every argument that does not set its own; argparse.SUPPRESS leaves absent arguments out of the Namespace.' },
    { name: 'conflict_handler',      type: 'str',  required: false, default: "'error'", desc: "'error' raises ArgumentError when an option string is added twice; 'resolve' lets the newer argument take the option string over." },
    { name: 'add_help',              type: 'bool', required: false, default: 'True', desc: "Add -h/--help. When prefix_chars has no '-', the first prefix character is used instead: prefix_chars='+/' gives +h/++help." },
    { name: 'allow_abbrev',          type: 'bool', required: false, default: 'True', desc: 'Accept unambiguous prefixes of long options: --verb for --verbose. Since 3.8 False does not disable grouped short flags like -vv.' },
    { name: 'exit_on_error',         type: 'bool', required: false, default: 'True', desc: 'False makes parse errors raise argparse.ArgumentError instead of printing usage and exiting with status 2. -h and --version still exit.' },
  ],

  modes: [
    {
      id: 'abbrev',
      label: 'allow_abbrev',
      blurb: 'Long options may be shortened to any unambiguous prefix. Type a command line and watch which option a prefix lands on.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', choices=['auto', 'never', 'always'], default='auto')\nparser.add_argument('--columns', type=int, default=80)\nparser.add_argument('--verbose', action='store_true')\n" + TAIL,
      cases: [
        { id: 'verb',  label: '--verb',            values: { cmdline: '--verb' } },
        { id: 'colo',  label: '--colo never',      values: { cmdline: '--colo never' } },
        { id: 'colu',  label: '--colu=100',        values: { cmdline: '--colu=100' } },
        { id: 'col',   label: '--col never',       values: { cmdline: '--col never' } },
        { id: 'bad',   label: '--color sometimes', values: { cmdline: '--color sometimes' } },
      ],
    },
    {
      id: 'prefix',
      label: 'prefix_chars',
      blurb: "prefix_chars='-+' allows options that start with +. Here +w and -w write the same attribute, so the last one on the command line wins.",
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app', prefix_chars='-+')\nparser.add_argument('+w', dest='warnings', action='store_true', help='turn warnings on')\nparser.add_argument('-w', dest='warnings', action='store_false', help='turn warnings off')\nparser.add_argument('-o', '--output')\n" + TAIL,
      cases: [
        { id: 'on',    label: '+w',        values: { cmdline: '+w -o out.txt' } },
        { id: 'both',  label: '+w -w',     values: { cmdline: '+w -w' } },
        { id: 'none',  label: 'nothing',   values: { cmdline: '' } },
        { id: 'help',  label: '-h',        values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'noexit',
      label: 'exit_on_error=False',
      blurb: 'With exit_on_error=False a bad command line raises argparse.ArgumentError (shown as an uncaught exception) instead of printing usage and exiting.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('host')\nparser.add_argument('--port', type=int, default=8080)\n" + TAIL,
      cases: [
        { id: 'ok',      label: 'valid',          values: { cmdline: 'example.com --port 80' } },
        { id: 'badint',  label: 'not a number',   values: { cmdline: 'example.com --port http' } },
        { id: 'missing', label: 'no host',        values: { cmdline: '--port 80' } },
        { id: 'extra',   label: 'extra argument', values: { cmdline: 'a.com b.com' } },
        { id: 'help',    label: '-h still exits', values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: 'Abbreviation works only while the prefix is unique: --colo can only be --color, but --col could be --color or --columns, so parse_args refuses it ("ambiguous option: --col could match --color, --columns"). The match is against the option strings that exist today, so adding an option later can break a prefix that used to work. In the prefix_chars tab -h/--help keeps the - prefix because - is still in prefix_chars. With exit_on_error=False the errors arrive as ArgumentError — in Python 3.13 that includes missing required arguments and unrecognized arguments; Python 3.12.3 still printed and exited for those two.',

  patterns: [
    {
      name: 'A parser with a description and an epilog',
      desc: 'description goes under the usage line, epilog at the very end of -h.',
      code: "import argparse\nparser = argparse.ArgumentParser(\n    prog='backup',\n    description='Copy files to the archive.',\n    epilog='Exit status is 0 on success.',\n)",
    },
    {
      name: 'Share options between tools with parents=',
      desc: 'Declare common options once in a parser without -h, then list it in parents=.',
      code: "import argparse\ncommon = argparse.ArgumentParser(add_help=False)\ncommon.add_argument('--config', default='app.toml')\ncommon.add_argument('-v', '--verbose', action='store_true')\n\nbuild = argparse.ArgumentParser(prog='build', parents=[common])\ndeploy = argparse.ArgumentParser(prog='deploy', parents=[common])",
    },
    {
      name: 'Handle errors yourself',
      desc: 'exit_on_error=False (3.9+) turns parse errors into exceptions — useful in a REPL, a web handler or a test.',
      code: "import argparse\nparser = argparse.ArgumentParser(exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    args = parser.parse_args(argv)\nexcept argparse.ArgumentError as e:\n    log.warning('bad arguments: %s', e)",
    },
    {
      name: 'Strict option names',
      desc: 'allow_abbrev=False rejects --verb for --verbose, so adding options never breaks existing command lines.',
      code: "import argparse\nparser = argparse.ArgumentParser(allow_abbrev=False)",
    },
  ],

  examples: [
    { title: 'prog, description and epilog in -h (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='backup', description='Copy files to the archive.', epilog='Exit status is 0 on success.')\nparser.add_argument('files', nargs='+', help='files to copy')\n" + HELP_TAIL, returns: 'usage: backup [-h] files [files ...]\n\nCopy files to the archive.\n\npositional arguments:\n  files       files to copy\n\noptions:\n  -h, --help  show this help message and exit\n\nExit status is 0 on success.' },
    { title: 'The repr shows six of the settings', code: "import argparse\nargparse.ArgumentParser(prog='app')", returns: "ArgumentParser(prog='app', usage=None, description=None, formatter_class=<class 'argparse.HelpFormatter'>, conflict_handler='error', add_help=True)" },
    { title: 'Unambiguous prefixes of long options are accepted', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--verbose', action='store_true')\nparser.add_argument('--output')\nparser.parse_args(['--verb', '--out', 'log.txt'])", returns: "Namespace(verbose=True, output='log.txt')" },
    { title: "prefix_chars='-+' for +options", code: "import argparse\nparser = argparse.ArgumentParser(prog='app', prefix_chars='-+')\nparser.add_argument('+v', '++verbose', action='store_true')\nparser.add_argument('-q', '--quiet', action='store_true')\nparser.parse_args(['+v', '-q'])", returns: 'Namespace(verbose=True, quiet=True)' },
    { title: 'parents= copies arguments and their defaults', code: "import argparse\ncommon = argparse.ArgumentParser(add_help=False)\ncommon.add_argument('--config', default='app.toml')\nparser = argparse.ArgumentParser(prog='app', parents=[common])\nparser.add_argument('target')\nparser.parse_args(['build'])", returns: "Namespace(config='app.toml', target='build')" },
    { title: 'add_help=False frees -h for your own option', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', add_help=False)\nparser.add_argument('-h', '--height', type=int)\nparser.parse_args(['-h', '20'])", returns: 'Namespace(height=20)' },
    { title: "conflict_handler='resolve': the newer argument takes --output", code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', conflict_handler='resolve')\nparser.add_argument('-o', '--output', help='old: write here')\nparser.add_argument('--output', help='new: write here')\n" + HELP_TAIL, returns: 'usage: app [-h] [-o OUTPUT] [--output OUTPUT]\n\noptions:\n  -h, --help       show this help message and exit\n  -o OUTPUT        old: write here\n  --output OUTPUT  new: write here' },
    { title: 'exit_on_error=False raises ArgumentError', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    parser.parse_args(['--port', 'http'])\nexcept argparse.ArgumentError as e:\n    print('caught:', e)", returns: "caught: argument --port: invalid int value: 'http'" },
  ],

  pitfalls: [
    {
      name: 'A parent parser that keeps its -h',
      desc: 'Every ArgumentParser adds -h/--help unless told not to. Copying a parent that has it into a child that also has it is a conflict, raised while the child is being built.',
      wrong: { label: 'default add_help', code: "import argparse\ncommon = argparse.ArgumentParser()\ncommon.add_argument('--config')\nparser = argparse.ArgumentParser(prog='app', parents=[common])", output: 'argparse.ArgumentError: argument -h/--help: conflicting option strings: -h, --help' },
      fix:   { label: 'add_help=False', code: "import argparse\ncommon = argparse.ArgumentParser(add_help=False)\ncommon.add_argument('--config')\nparser = argparse.ArgumentParser(prog='app', parents=[common])\nparser.parse_args(['--config', 'dev.toml'])", output: "Namespace(config='dev.toml')" },
    },
    {
      name: 'Relying on abbreviations in scripts',
      desc: 'A prefix that is unique today stops working the day another option with the same start is added. allow_abbrev=False makes the parser accept full names only — then a prefix is simply an unknown option.',
      wrong: { label: '--col with two --col… options', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color')\nparser.add_argument('--columns', type=int)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--col', 'red'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: ambiguous option: --col could match --color, --columns' },
      fix:   { label: 'allow_abbrev=False', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', allow_abbrev=False)\nparser.add_argument('--color')\nparser.add_argument('--columns', type=int)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--colo', 'red'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: unrecognized arguments: --colo red' },
    },
    {
      name: 'Passing description as the second positional argument',
      desc: 'The parameter order is prog, usage, description. A second positional string silently becomes the usage line.',
      wrong: { label: 'positional', code: "import argparse\nparser = argparse.ArgumentParser('app', '--name NAME')\nparser.usage", output: "'--name NAME'" },
      fix:   { label: 'keywords', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', description='Rename files.')\n(parser.prog, parser.usage, parser.description)", output: "('app', None, 'Rename files.')" },
    },
  ],

  when: {
    use: [
      'Once per program (or once per subcommand via add_subparsers)',
      'Any time you want generated -h output and consistent error messages',
    ],
    avoid: [
      'Parsing a config file or a query string → configparser, tomllib, urllib.parse',
      'A strictly POSIX getopt-style command line → getopt',
    ],
  },

  notes: {
    cpython:        'Lib/argparse.py — ArgumentParser subclasses the private _ActionsContainer (add_argument, groups, defaults) and _AttributeHolder (the repr)',
    'Exit status':  'errors call parser.error(): usage + "prog: error: ..." on stderr, then sys.exit(2). -h and --version exit with 0',
    'prog default': 'os.path.basename(sys.argv[0]) in 3.13; 3.14 shows how __main__ was really run (for example python -m pkg). Pass prog= for stable messages and tests',
    'Python 3.14':  'adds suggest_on_error= (suggest close matches for mistyped choices and subcommands) and color= (colored help where the terminal supports it)',
  },

  related: [
    { name: 'add_argument()', slug: 'add_argument', when: 'Declare each option and positional' },
    { name: 'parse_args()', slug: 'parse_args', when: 'Run the parser' },
    { name: 'HelpFormatter', slug: 'helpformatter', when: 'formatter_class= choices' },
    { name: 'convert_arg_line_to_args()', slug: 'convert_arg_line_to_args', when: 'fromfile_prefix_chars and argument files' },
    { name: 'ArgumentError', slug: 'argumenterror', when: 'What exit_on_error=False raises' },
    { name: 'argparse module', slug: 'argparse', when: 'Overview and the full workflow', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I change the program name shown in the usage line?',
      a: "Pass prog='name' to ArgumentParser. By default it is the file name of the running script (os.path.basename(sys.argv[0])), which is why tests and interactive sessions show odd names. Inside help strings %(prog)s refers to it.",
    },
    {
      q: 'How do I stop argparse from calling sys.exit on bad input?',
      a: 'Create the parser with exit_on_error=False (Python 3.9+) and catch argparse.ArgumentError. -h and --version still exit; for those, catch SystemExit. Alternatively subclass ArgumentParser and override error().',
    },
    {
      q: 'How do I disable option abbreviations like --verb for --verbose?',
      a: 'ArgumentParser(allow_abbrev=False). Prefixes then count as unknown options. Grouped single-letter flags such as -vv keep working (that changed in 3.8).',
    },
    {
      q: 'Why do I get "conflicting option strings: -h, --help"?',
      a: "Two -h/--help options met in one parser — usually a parent parser created without add_help=False. Pass add_help=False to the parent, or conflict_handler='resolve' to the child.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser',
    meta:  'argparse.ArgumentParser',
  },

};
