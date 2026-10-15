// content/reference/python/stdlib/argparse/error.js

export const meta = {
  slug:        'error',
  name:        'ArgumentParser.error',
  signature:   'ArgumentParser.error(message) / ArgumentParser.exit(status=0, message=None)',
  blurb:       'error() prints the usage and "prog: error: message" to stderr and exits with status 2; exit() optionally prints a message to stderr and exits with the status you give.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse parser.error parser.exit ArgumentParser.error ArgumentParser.exit custom error message validate arguments after parsing exit status 2 usage error sys.exit stderr override error raise exception instead of exit',
};

export const method = {
  slug:      'error',
  name:      'ArgumentParser.error',
  signature: 'ArgumentParser.error(message) / ArgumentParser.exit(status=0, message=None)',
  returns:   { type: 'NoReturn', desc: 'Both end with sys.exit(), i.e. raise SystemExit; they never return normally.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Every built-in parse error ends in parser.error(), and you can call it too: after parse_args, check what argparse cannot (one value against another, a file that must exist) and report it in exactly the same format. exit() is the lower-level half — print an optional message to stderr, then sys.exit(status).",

  covers: ['ArgumentParser.error', 'ArgumentParser.exit'],

  cheat: {
    commonCall: "parser.error('--start must not be greater than --end')",
    returns:    'never — raises SystemExit(2) after printing usage + "prog: error: ..."',
    replaces:   "print(..., file=sys.stderr); sys.exit(2)",
    watchOut:   'exit_on_error=False does not affect it; exit() adds no newline',
  },

  parameters: [
    { name: 'message', type: 'str',  required: true,  default: null,   desc: 'error(): the text after "prog: error: " — a newline is added. exit(): printed to stderr exactly as given (no newline added); None or "" prints nothing.' },
    { name: 'status',  type: 'int',  required: false, default: '0',    desc: 'exit() only: the exit status passed to sys.exit().' },
  ],

  modes: [
    {
      id: 'validate',
      label: 'check after parsing',
      blurb: 'parse_args checks each value on its own; the program then checks --start against --end with error(), and the size of the range with exit(1, ...). Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--start', type=int, default=0)\nparser.add_argument('--end', type=int, default=10)\nout = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        args = parser.parse_args(shlex.split({$cmdline}))\n        if args.start > args.end:\n            parser.error(f'--start ({args.start}) must not be greater than --end ({args.end})')\n        if args.end - args.start > 100:\n            parser.exit(1, f'app: range too large: {args.end - args.start} items\\n')\n    result = args\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult",
      cases: [
        { id: 'ok',      label: 'valid range',     values: { cmdline: '--start 2 --end 5' } },
        { id: 'order',   label: 'start > end',     values: { cmdline: '--start 8 --end 3' } },
        { id: 'big',     label: 'too large',       values: { cmdline: '--end 500' } },
        { id: 'parse',   label: 'not a number',    values: { cmdline: '--start x' } },
        { id: 'neg',     label: 'negative start',  values: { cmdline: '--start=-5 --end 5' } },
        { id: 'help',    label: '-h',              values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "A bad number is caught inside parse_args, your range checks run after it — and both look the same to the user: usage line, then \"app: error: ...\", exit status 2. exit(1, ...) prints only the message you give (with the newline you put in) and uses your status. Note --start=-5: written as --start -5 the -5 would be fine too, because the parser has no option that looks like a negative number.",

  patterns: [
    {
      name: 'Cross-argument validation',
      desc: 'Check combinations after parsing and report them like built-in errors.',
      code: "args = parser.parse_args()\nif args.output and args.dry_run:\n    parser.error('--output cannot be used with --dry-run')",
    },
    {
      name: 'Validate a path after parsing',
      desc: 'Checking existence in a type function would also run for defaults; doing it here is explicit.',
      code: "args = parser.parse_args()\nif not args.config.exists():\n    parser.error(f'config file not found: {args.config}')",
    },
    {
      name: 'Raise instead of exiting',
      desc: 'Override error() for embedding argparse in a larger program. It must not return.',
      code: "import argparse\n\nclass CliError(Exception):\n    pass\n\nclass RaisingParser(argparse.ArgumentParser):\n    def error(self, message):\n        raise CliError(message)",
    },
    {
      name: 'Successful early exit',
      desc: 'exit() with the default status 0, after printing something useful.',
      code: "if args.list_formats:\n    print('\\n'.join(FORMATS))\n    parser.exit()",
    },
  ],

  examples: [
    { title: 'error(): usage, message, status 2', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('--start', type=int, default=0)\nparser.add_argument('--end', type=int, default=10)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        args = parser.parse_args(['--start', '5', '--end', '3'])\n        if args.start > args.end:\n            parser.error('--start must not be greater than --end')\nexcept SystemExit as e:\n    print('exit status', e.code)\n    print(err.getvalue(), end='')", returns: 'exit status 2\nusage: app [-h] [--start START] [--end END]\napp: error: --start must not be greater than --end' },
    { title: 'exit(status, message)', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.exit(3, 'app: nothing to do\\n')\nexcept SystemExit as e:\n    result = (e.code, err.getvalue())\nresult", returns: "(3, 'app: nothing to do\\n')" },
    { title: 'exit() with no arguments: status 0, silent', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ntry:\n    parser.exit()\nexcept SystemExit as e:\n    result = e.code\nresult", returns: '0' },
    { title: 'error() exits even with exit_on_error=False', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False, formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.error('checked by hand')\nexcept SystemExit as e:\n    result = (e.code, err.getvalue().splitlines()[-1])\nresult", returns: "(2, 'app: error: checked by hand')" },
    { title: 'usage=SUPPRESS: just the error line', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', usage=argparse.SUPPRESS)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.error('no input files')\nexcept SystemExit:\n    pass\nerr.getvalue()", returns: "'app: error: no input files\\n'" },
    { title: 'Override error() to raise your own exception', code: "import argparse\n\nclass RaisingParser(argparse.ArgumentParser):\n    def error(self, message):\n        raise ValueError(message)\n\nparser = RaisingParser(prog='app')\nparser.add_argument('--count', type=int)\nparser.parse_args(['--count', 'many'])", returns: "ValueError: argument --count: invalid int value: 'many'" },
  ],

  pitfalls: [
    {
      name: 'A message without a trailing newline',
      desc: 'exit() writes the message unchanged, so whatever is printed next continues on the same line. error() adds the newline itself.',
      wrong: { label: "'something went wrong'", code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.exit(1, 'something went wrong')\nexcept SystemExit:\n    pass\nerr.getvalue() + 'next output'", output: "'something went wrongnext output'" },
      fix:   { label: "'...\\n'", code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.exit(1, 'something went wrong\\n')\nexcept SystemExit:\n    pass\nerr.getvalue() + 'next output'", output: "'something went wrong\\nnext output'" },
    },
    {
      name: 'An error() override that returns',
      desc: 'argparse assumes error() never returns. If it does, parsing carries on with whatever it had: here the bad value is reported twice and parse_args returns the defaults as if nothing happened.',
      wrong: { label: 'print and return', code: "import argparse\n\nclass Lenient(argparse.ArgumentParser):\n    def error(self, message):\n        print('error:', message)\n\nparser = Lenient(prog='app')\nparser.add_argument('--count', type=int, default=1)\nparser.parse_args(['--count', 'many'])", output: "error: argument --count: invalid int value: 'many'\nerror: unrecognized arguments: --count many\nNamespace(count=1)" },
      fix:   { label: 'raise', code: "import argparse\n\nclass CliError(Exception):\n    pass\n\nclass RaisingParser(argparse.ArgumentParser):\n    def error(self, message):\n        raise CliError(message)\n\nparser = RaisingParser(prog='app')\nparser.add_argument('--count', type=int, default=1)\ntry:\n    parser.parse_args(['--count', 'many'])\nexcept CliError as e:\n    print('error:', e)", output: "error: argument --count: invalid int value: 'many'" },
    },
    {
      name: 'Catching Exception around error()',
      desc: 'SystemExit is a BaseException, so except Exception lets it through and the program ends.',
      wrong: { label: 'except Exception', code: "import argparse, contextlib, io\n\ndef check(args, parser):\n    if args.count < 0:\n        parser.error('--count must be positive')\n    return 'checked'\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--count', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        status = check(parser.parse_args(['--count', '-1']), parser)\n    except Exception:\n        status = 'handled'\nstatus", output: 'SystemExit: 2' },
      fix:   { label: 'except SystemExit', code: "import argparse, contextlib, io\n\ndef check(args, parser):\n    if args.count < 0:\n        parser.error('--count must be positive')\n    return 'checked'\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--count', type=int)\nwith contextlib.redirect_stderr(io.StringIO()):\n    try:\n        status = check(parser.parse_args(['--count', '-1']), parser)\n    except SystemExit as e:\n        status = f'exited with {e.code}'\nstatus", output: "'exited with 2'" },
    },
  ],

  when: {
    use: [
      'Errors found after parsing that should look like argparse errors',
      'Ending the program early from inside a custom action or after printing a listing (exit())',
    ],
    avoid: [
      'Errors that are not about the command line (network, data) → raise or log them normally',
      'Library code → raise an exception; only the program entry point should exit',
    ],
  },

  notes: {
    cpython:        "Lib/argparse.py: error() calls self.print_usage(sys.stderr) then self.exit(2, '%(prog)s: error: %(message)s\\n'); exit() calls _print_message(message, sys.stderr) if message is truthy, then sys.exit(status)",
    'Streams':      'both write to sys.stderr as it is at call time, so contextlib.redirect_stderr captures them; help and --version go to stdout instead',
    'Overriding':   'the docstring of error() says an override "should not return -- it should either exit or raise an exception"',
  },

  related: [
    { name: 'parse_args()', slug: 'parse_args', when: 'Calls error() for every parse problem' },
    { name: 'ArgumentError', slug: 'argumenterror', when: 'Errors as exceptions (exit_on_error=False)' },
    { name: 'format_help()', slug: 'format_help', when: 'print_usage / print_help' },
    { name: 'sys.exit', slug: 'exit', when: 'What exit() calls', category: 'stdlib/sys' },
    { name: 'SystemExit', slug: 'systemexit', when: 'The exception both raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I show a custom argparse error message?',
      a: "After parse_args, call parser.error('your message'). It prints the usage line and \"prog: error: your message\" to stderr and exits with status 2 — the same format as argparse's own errors.",
    },
    {
      q: 'What exit code does argparse use?',
      a: '2 for every usage error (parser.error), 0 after -h/--help and --version. parser.exit(status) uses whatever status you pass, 0 by default.',
    },
    {
      q: 'How do I make argparse raise an exception instead of exiting?',
      a: 'Use ArgumentParser(exit_on_error=False) (3.9+) to get ArgumentError for parse errors, or subclass ArgumentParser and override error() to raise. exit_on_error does not change error() itself: calling parser.error() still exits.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.error',
    meta:  'ArgumentParser.error',
  },

};
