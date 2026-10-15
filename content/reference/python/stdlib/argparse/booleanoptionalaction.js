// content/reference/python/stdlib/argparse/booleanoptionalaction.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'booleanoptionalaction',
  name:        'argparse.BooleanOptionalAction',
  signature:   'parser.add_argument(\'--flag\', action=argparse.BooleanOptionalAction, default=None, required=False, help=None, deprecated=False)',
  blurb:       'An action for on/off switches: one add_argument call creates both --flag (stores True) and --no-flag (stores False).',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.9+',
  searchTerms: 'argparse BooleanOptionalAction --no-flag --foo --no-foo boolean flag true false on off switch negative option argparse bool option enable disable color no-color store_true alternative',
};

export const method = {
  slug:      'booleanoptionalaction',
  name:      'argparse.BooleanOptionalAction',
  signature: 'parser.add_argument(\'--flag\', action=argparse.BooleanOptionalAction, default=None, required=False, help=None, deprecated=False)',
  returns:   { type: 'BooleanOptionalAction', desc: 'The action add_argument() creates; its option_strings contain the extra --no- forms.' },

  category:    'argparse class',
  version:     'Python 3.9+',
  hasLiveDemo: true,

  subtitle: "Pass the class (not a string) as action=. Every option string that starts with -- gets a twin with --no- in front; the positive form stores True, the negative form False, and the last one on the command line wins. With neither given the attribute is the default — None unless you say otherwise.",

  covers: ['BooleanOptionalAction'],

  cheat: {
    commonCall: "parser.add_argument('--color', action=argparse.BooleanOptionalAction, default=True)",
    returns:    'args.color: True for --color, False for --no-color, default otherwise',
    replaces:   "a store_true / store_false pair writing one dest",
    watchOut:   'The default is None, not False; short options get no --no- twin',
  },

  parameters: [
    { name: 'option_strings', type: 'list[str]', required: true,  default: null,    desc: "The flags you pass to add_argument. Each one starting with -- gets a --no- version added after it." },
    { name: 'dest',           type: 'str',       required: true,  default: null,    desc: 'Derived from the first long flag as usual (--dry-run → dry_run).' },
    { name: 'default',        type: 'object',    required: false, default: 'None',  desc: 'Value when neither form is given. Usually True or False.' },
    { name: 'required',       type: 'bool',      required: false, default: 'False', desc: 'Require one of the two forms.' },
    { name: 'help',           type: 'str',       required: false, default: 'None',  desc: 'Shown once for both forms: "--color, --no-color  help".' },
    { name: 'deprecated',     type: 'bool',      required: false, default: 'False', desc: '3.13+: warn when the option is used.' },
  ],

  modes: [
    {
      id: 'flags',
      label: '--x / --no-x',
      blurb: '--color has no default, --cache defaults to True. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction, help='colorize the output')\nparser.add_argument('--cache', action=argparse.BooleanOptionalAction, default=True, help='reuse earlier results (default: %(default)s)')\n" + TAIL,
      cases: [
        { id: 'none',   label: 'nothing',              values: { cmdline: '' } },
        { id: 'neg',    label: '--no-color --no-cache', values: { cmdline: '--no-color --no-cache' } },
        { id: 'last',   label: '--no-color --color',   values: { cmdline: '--no-color --color' } },
        { id: 'abbr',   label: '--no-col',             values: { cmdline: '--no-col' } },
        { id: 'ambig',  label: '--no-c',               values: { cmdline: '--no-c' } },
        { id: 'value',  label: '--color=yes',          values: { cmdline: '--color=yes' } },
        { id: 'help',   label: '-h',                   values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "An empty command line leaves color=None — BooleanOptionalAction has no False default of its own — while cache keeps its default True. The two forms write the same attribute, so the later one wins. Prefixes work as for any long option: --no-col can only be --no-color, but --no-c matches --no-color and --no-cache and is rejected as ambiguous. The action takes no value (nargs=0), so --color=yes is \"ignored explicit argument 'yes'\". In -h both forms share one line, and the usage line shows [--color | --no-color], which the action's format_usage() produces.",

  patterns: [
    {
      name: 'A switch that is on by default',
      desc: 'The user turns it off with --no-cache.',
      code: "parser.add_argument('--cache', action=argparse.BooleanOptionalAction, default=True, help='reuse earlier results')",
    },
    {
      name: 'Three states: on, off, decide later',
      desc: 'Keep the default None and treat it as "auto".',
      code: "parser.add_argument('--color', action=argparse.BooleanOptionalAction)\nargs = parser.parse_args()\nuse_color = sys.stdout.isatty() if args.color is None else args.color",
    },
    {
      name: 'Short and long names',
      desc: 'Only the long form gets a negative twin: -c, --color, --no-color.',
      code: "parser.add_argument('-c', '--color', action=argparse.BooleanOptionalAction, default=False)",
    },
  ],

  examples: [
    { title: 'Absent, positive, negative', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction)\n[parser.parse_args(argv).color for argv in ([], ['--color'], ['--no-color'])]", returns: '[None, True, False]' },
    { title: 'The --no- forms are added to option_strings', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\naction = parser.add_argument('-c', '--color', action=argparse.BooleanOptionalAction, default=True)\n(action.option_strings, action.nargs, action.default)", returns: "(['-c', '--color', '--no-color'], 0, True)" },
    { title: 'The last form on the command line wins', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction)\nparser.parse_args(['--no-color', '--color'])", returns: 'Namespace(color=True)' },
    { title: 'Prefixes work for the negative form too', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--dry-run', action=argparse.BooleanOptionalAction, default=False)\nparser.parse_args(['--no-dry'])", returns: 'Namespace(dry_run=False)' },
    { title: 'In -h: one line for both forms (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction, help='colorize the output')\nparser.add_argument('--cache', action=argparse.BooleanOptionalAction, default=True, help='reuse earlier results (default: %(default)s)')\n" + HELP_TAIL, returns: 'usage: app [-h] [--color | --no-color]\n           [--cache | --no-cache]\n\noptions:\n  -h, --help           show this help message and exit\n  --color, --no-color  colorize the output\n  --cache, --no-cache  reuse earlier results (default:\n                       True)' },
    { title: 'It takes no value', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--color=yes'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "app: error: argument --color/--no-color: ignored explicit argument 'yes'" },
    { title: 'A public Action subclass', code: 'import argparse\nissubclass(argparse.BooleanOptionalAction, argparse.Action)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Treating "not given" as False',
      desc: 'Without default= the attribute is None when neither form appears, so a test for False misses it.',
      wrong: { label: 'no default', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction)\nargs = parser.parse_args([])\nargs.color is False", output: 'False' },
      fix:   { label: 'default=False', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction, default=False)\nargs = parser.parse_args([])\nargs.color is False", output: 'True' },
    },
    {
      name: 'Expecting a --no- form for a short option',
      desc: 'Only option strings starting with -- get a negative twin (Python 3.15 adds single-dash support). -c alone has no off switch.',
      wrong: { label: "'-c' only", code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-c', action=argparse.BooleanOptionalAction)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--no-c'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: unrecognized arguments: --no-c' },
      fix:   { label: 'add a long name', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-c', '--color', action=argparse.BooleanOptionalAction)\nparser.parse_args(['--no-color'])", output: 'Namespace(color=False)' },
    },
    {
      name: 'Building the pair by hand with two dests',
      desc: 'store_true and store_false on --color and --no-color give two attributes (color and no_color) that can disagree. One BooleanOptionalAction gives one.',
      wrong: { label: 'two actions', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action='store_true')\nparser.add_argument('--no-color', action='store_false')\nparser.parse_args(['--no-color'])", output: 'Namespace(color=False, no_color=False)' },
      fix:   { label: 'BooleanOptionalAction', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--color', action=argparse.BooleanOptionalAction, default=True)\nparser.parse_args(['--no-color'])", output: 'Namespace(color=False)' },
    },
  ],

  when: {
    use: [
      'Settings that users need to switch both on and off explicitly (--cache / --no-cache)',
      'Overriding a default that came from a config file in either direction',
      'Tri-state options where "not given" (None) means "decide automatically"',
    ],
    avoid: [
      'A plain opt-in flag → action=\'store_true\' is shorter and defaults to False',
      'Options with values like --color=always → choices= instead',
    ],
  },

  notes: {
    cpython:        "class BooleanOptionalAction(Action) in Lib/argparse.py: __init__ appends '--no-' + option[2:] after each option starting with '--', sets nargs=0; __call__ stores not option_string.startswith('--no-')",
    'Deprecated':   "passing type=, choices= or metavar= raises a DeprecationWarning in 3.13: \"'type' is deprecated as of Python 3.12 and will be removed in Python 3.14.\"",
    'Python 3.15':  'adds --no- forms for single-dash long options (-foo → -nofoo) and for other prefix_chars',
  },

  related: [
    { name: 'actions', slug: 'actions', when: "store_true, store_false and the other built-in actions" },
    { name: 'Action', slug: 'action', when: 'The base class; format_usage' },
    { name: 'add_argument()', slug: 'add_argument', when: 'Where action= goes' },
    { name: 'add_mutually_exclusive_group()', slug: 'add_mutually_exclusive_group', when: 'Other either/or options' },
    { name: 'bool()', slug: 'bool', when: 'Why type=bool is not the answer', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I make a --flag / --no-flag pair in argparse?',
      a: "parser.add_argument('--flag', action=argparse.BooleanOptionalAction, default=False). It creates both options; --flag stores True and --no-flag stores False. Python 3.9 or newer.",
    },
    {
      q: 'Why is my BooleanOptionalAction attribute None?',
      a: 'Neither form was given and no default= was set. The action has no built-in default (unlike store_true, whose default is False); pass default=True or default=False.',
    },
    {
      q: 'Can I use BooleanOptionalAction with a short option like -v?',
      a: 'Yes, but in 3.9–3.14 only option strings starting with -- get a --no- twin, so add a long name as well: add_argument("-v", "--verbose", action=argparse.BooleanOptionalAction).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.BooleanOptionalAction',
    meta:  'argparse.BooleanOptionalAction',
  },

};
