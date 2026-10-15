// content/reference/python/stdlib/argparse/argumenterror.js

// Demo tail for an exit_on_error=False parser: ArgumentError becomes
// (argument_name, message); -h still prints help and exits, so stdout is
// captured with COLUMNS fixed at 60.
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept argparse.ArgumentError as e:\n    result = (e.argument_name, e.message)\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'argumenterror',
  name:        'argparse.ArgumentError',
  signature:   'argparse.ArgumentError(argument, message)',
  blurb:       'The exception behind every argparse error message: a bad value, a missing or unknown argument, a conflicting option string. You see it directly with exit_on_error=False.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse ArgumentError argparse.ArgumentError exit_on_error=False catch argparse error argument_name message invalid int value conflicting option string unrecognized arguments the following arguments are required expected one argument',
};

export const method = {
  slug:      'argumenterror',
  name:      'argparse.ArgumentError',
  signature: 'argparse.ArgumentError(argument, message)',

  category:    'argparse exception',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Normally you never see it: parse_args catches it, prints usage plus "prog: error: <the exception text>" and exits with status 2. Create the parser with exit_on_error=False (3.9+) and parse errors reach your code as ArgumentError instead. Mistakes in add_argument calls, such as a duplicate option string, raise it too.',

  covers: ['ArgumentError'],

  chain: ['BaseException', 'Exception', 'ArgumentError'],

  cheat: {
    raisedBy: 'parse_args / parse_known_args with exit_on_error=False; add_argument with a conflicting option string; your own Action.__call__',
    message:  "argument -p/--port: invalid int value: 'http'",
    quickFix: 'except argparse.ArgumentError as e: report str(e) or e.message',
    watchOut: 'Not a ValueError; -h and --version still raise SystemExit',
  },

  parameters: [
    { name: 'argument', type: 'Action | None', required: true, default: null, desc: 'The action the error is about, or None for errors about the whole command line. Only its name is kept (argument_name).' },
    { name: 'message',  type: 'str',          required: true, default: null, desc: 'The text after "argument NAME: ".' },
  ],

  modes: [
    {
      id: 'catch',
      label: 'catch it',
      blurb: 'An exit_on_error=False parser: errors come back as (e.argument_name, e.message) instead of exiting. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('host')\nparser.add_argument('-p', '--port', type=int, default=8080)\nparser.add_argument('--mode', choices=['fast', 'safe'], default='safe')\n" + TAIL,
      cases: [
        { id: 'ok',      label: 'valid',           values: { cmdline: 'example.com -p 80' } },
        { id: 'badint',  label: 'not a number',    values: { cmdline: 'example.com -p http' } },
        { id: 'choice',  label: 'bad choice',      values: { cmdline: 'example.com --mode quick' } },
        { id: 'missing', label: 'no host',         values: { cmdline: '' } },
        { id: 'extra',   label: 'extra argument',  values: { cmdline: 'a.com b.com' } },
        { id: 'novalue', label: '-p without value', values: { cmdline: 'example.com -p' } },
        { id: 'help',    label: '-h',              values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "argument_name is the name argparse uses in messages: all option strings joined with / (-p/--port), the metavar or dest of a positional — or None when the error is about the command line as a whole: the following arguments are required, unrecognized arguments. message is the text without the \"argument NAME: \" prefix; str(e) adds it back. -h is not an error: it prints the help and raises SystemExit(0) even with exit_on_error=False. These are Python 3.13 results — 3.12.3 still printed and exited for the missing and unrecognized arguments.",

  attributes: [
    { name: 'argument_name', type: 'str | None', meaning: "'-p/--port' for options, the metavar or dest for positionals, None for whole-command-line errors" },
    { name: 'message',       type: 'str',        meaning: 'The error text without the argument name' },
    { name: 'args',          type: 'tuple',      meaning: '(argument, message) as passed to the constructor — the Action object itself, not its name' },
    { name: 'str(e)',        type: 'str',        meaning: "'argument NAME: message', or just message when argument_name is None — what parse_args prints after \"prog: error: \"" },
  ],

  patterns: [
    {
      name: 'Turn parse errors into your own error handling',
      desc: 'exit_on_error=False keeps the program running — useful in a REPL, a chat bot or a web handler that parses user commands.',
      code: "import argparse\nparser = argparse.ArgumentParser(prog='bot', exit_on_error=False)\nparser.add_argument('command', choices=['start', 'stop'])\ntry:\n    args = parser.parse_args(words)\nexcept argparse.ArgumentError as e:\n    reply(f'Sorry: {e}')",
    },
    {
      name: 'Also handle help and version',
      desc: '-h and --version exit with SystemExit(0) regardless of exit_on_error.',
      code: "try:\n    args = parser.parse_args(words)\nexcept argparse.ArgumentError as e:\n    reply(str(e))\nexcept SystemExit:\n    pass  # help or version text was printed",
    },
    {
      name: 'Raise it from a custom action',
      desc: 'The message is then reported like a built-in parse error.',
      code: "raise argparse.ArgumentError(self, f'{values!r} is not allowed here')",
    },
  ],

  examples: [
    { title: 'argument_name, message and str()', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('-p', '--port', type=int)\ntry:\n    parser.parse_args(['--port', 'http'])\nexcept argparse.ArgumentError as e:\n    info = (e.argument_name, e.message, str(e))\ninfo", returns: "('-p/--port', \"invalid int value: 'http'\", \"argument -p/--port: invalid int value: 'http'\")" },
    { title: 'Whole-command-line errors have no argument', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    parser.parse_args(['--port', '80', 'extra'])\nexcept argparse.ArgumentError as e:\n    info = (e.argument_name, str(e))\ninfo", returns: "(None, 'unrecognized arguments: extra')" },
    { title: 'Positionals are named by metavar or dest', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('mode', choices=['fast', 'safe'])\ntry:\n    parser.parse_args(['quick'])\nexcept argparse.ArgumentError as e:\n    info = (e.argument_name, e.message)\ninfo", returns: "('mode', \"invalid choice: 'quick' (choose from fast, safe)\")" },
    { title: 'Uncaught, the traceback shows argparse.ArgumentError', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\nparser.parse_args(['--port'])", returns: 'argparse.ArgumentError: argument --port: expected one argument' },
    { title: 'A duplicate option string raises it at once', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.add_argument('-v', '--version', action='version', version='1.0')", returns: 'argparse.ArgumentError: argument -v/--version: conflicting option string: -v' },
    { title: 'Raise one yourself for an action', code: "import argparse\naction = argparse.ArgumentParser(prog='app').add_argument('--size', type=int)\nraise argparse.ArgumentError(action, 'must be a power of two')", returns: 'argparse.ArgumentError: argument --size: must be a power of two' },
    { title: 'A plain Exception subclass', code: 'import argparse\nissubclass(argparse.ArgumentError, Exception), issubclass(argparse.ArgumentError, ValueError)', returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'Catching ArgumentError with the default exit_on_error',
      desc: 'With exit_on_error=True (the default) parse_args handles the ArgumentError itself and raises SystemExit(2); your except clause never runs.',
      wrong: { label: 'default parser', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        args = parser.parse_args(['--port', 'http'])\n    except argparse.ArgumentError:\n        args = None\nargs", output: 'SystemExit: 2' },
      fix:   { label: 'exit_on_error=False', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    args = parser.parse_args(['--port', 'http'])\nexcept argparse.ArgumentError as e:\n    args = f'bad arguments: {e}'\nargs", output: "\"bad arguments: argument --port: invalid int value: 'http'\"" },
    },
    {
      name: 'Subparsers do not inherit exit_on_error',
      desc: 'Each subparser is its own ArgumentParser with exit_on_error=True by default, so an error inside a subcommand still exits.',
      wrong: { label: 'only the main parser', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='pkg', exit_on_error=False)\ncommands = parser.add_subparsers(dest='command')\ninstall = commands.add_parser('install')\ninstall.add_argument('--jobs', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        parser.parse_args(['install', '--jobs', 'many'])\n    except argparse.ArgumentError as e:\n        print('caught:', e)", output: 'SystemExit: 2' },
      fix:   { label: 'pass it to add_parser too', code: "import argparse\nparser = argparse.ArgumentParser(prog='pkg', exit_on_error=False)\ncommands = parser.add_subparsers(dest='command')\ninstall = commands.add_parser('install', exit_on_error=False)\ninstall.add_argument('--jobs', type=int)\ntry:\n    parser.parse_args(['install', '--jobs', 'many'])\nexcept argparse.ArgumentError as e:\n    print('caught:', e)", output: "caught: argument --jobs: invalid int value: 'many'" },
    },
    {
      name: 'Reading e.args for the message',
      desc: 'ArgumentError keeps the Action object in args[0]; the readable text is str(e) (or e.message without the argument name).',
      wrong: { label: 'e.args', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    parser.parse_args(['--port', 'http'])\nexcept argparse.ArgumentError as e:\n    err = e\n(type(err.args[0]).__name__, err.args[1])", output: "('_StoreAction', \"invalid int value: 'http'\")" },
      fix:   { label: 'str(e)', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=int)\ntry:\n    parser.parse_args(['--port', 'http'])\nexcept argparse.ArgumentError as e:\n    message = str(e)\nmessage", output: "\"argument --port: invalid int value: 'http'\"" },
    },
  ],

  when: {
    use: [
      'Parsing commands typed into a long-running program (REPL, bot, server)',
      'Tests that assert on the exact error message',
      'Custom actions that reject a value',
    ],
    avoid: [
      'Normal command-line scripts → let argparse print the usage and exit',
      'Validation after parsing → parser.error(message)',
    ],
  },

  notes: {
    cpython:        'class ArgumentError(Exception) in Lib/argparse.py; __init__ stores argument_name (via _get_action_name) and message, __str__ joins them',
    'Version':      'exit_on_error= is 3.9+. In 3.13 missing required arguments and unrecognized arguments also raise ArgumentError; in 3.12.3 those two still printed usage and exited',
    'Not caught':   'exceptions from type= other than ValueError, TypeError and ArgumentTypeError (FileNotFoundError, decimal.InvalidOperation …) are not wrapped and propagate unchanged',
  },

  related: [
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'exit_on_error= is set here' },
    { name: 'ArgumentTypeError', slug: 'argumenttypeerror', when: 'What type= functions raise' },
    { name: 'parser.error()', slug: 'error', when: 'Report your own errors argparse-style' },
    { name: 'Action', slug: 'action', when: 'Raise it from __call__' },
    { name: 'SystemExit', slug: 'systemexit', when: 'What you get with the default exit_on_error=True', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I catch argparse errors instead of exiting?',
      a: 'Create the parser with ArgumentParser(exit_on_error=False) (Python 3.9+) and wrap parse_args in try/except argparse.ArgumentError. Do the same for each subparser via add_parser(..., exit_on_error=False). -h and --version still raise SystemExit.',
    },
    {
      q: 'Why does "except argparse.ArgumentError" not catch anything?',
      a: 'With the default exit_on_error=True, parse_args catches the ArgumentError itself, prints the usage and the message, and calls sys.exit(2). Either pass exit_on_error=False or catch SystemExit.',
    },
    {
      q: 'What does "argparse.ArgumentError: argument -v/--version: conflicting option string: -v" mean?',
      a: "Two add_argument calls used the same option string. Rename one, or create the parser with conflict_handler='resolve' to let the later argument take the string over.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentError',
    meta:  'argparse.ArgumentError',
  },

};
