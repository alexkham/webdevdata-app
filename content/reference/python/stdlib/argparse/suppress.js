// content/reference/python/stdlib/argparse/suppress.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'suppress',
  name:        'argparse.SUPPRESS',
  signature:   "argparse.SUPPRESS = '==SUPPRESS=='",
  blurb:       'A marker value: as help= it hides an argument from -h, as default= it keeps an absent argument out of the Namespace, as usage= it removes the usage line.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse SUPPRESS ==SUPPRESS== hide argument from help hidden option default=argparse.SUPPRESS help=argparse.SUPPRESS argument_default usage=SUPPRESS attribute not set in namespace check if argument was given',
};

export const method = {
  slug:      'suppress',
  name:      'argparse.SUPPRESS',
  signature: "argparse.SUPPRESS = '==SUPPRESS=='",

  category:    'argparse constant',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "One sentinel string, several meanings depending on where you pass it. help=SUPPRESS: the argument still works but is not listed. default=SUPPRESS: no attribute unless the user gave the argument — which is how you tell 'not given' from 'given the default value'.",

  covers: ['SUPPRESS'],

  attributes: [
    { name: 'help=SUPPRESS',             type: 'add_argument', meaning: 'Not listed in -h and left out of the usage line; still parsed' },
    { name: 'default=SUPPRESS',          type: 'add_argument', meaning: 'No attribute in the Namespace when the argument is absent' },
    { name: 'argument_default=SUPPRESS', type: 'ArgumentParser', meaning: 'default=SUPPRESS for every argument that sets no default of its own' },
    { name: 'usage=SUPPRESS',            type: 'ArgumentParser', meaning: 'No usage line in help and in error output' },
    { name: 'description / epilog / group title = SUPPRESS', type: 'text', meaning: 'That text (or section heading) is not printed' },
    { name: 'dest=SUPPRESS',             type: 'internal', meaning: 'The default dest of help, version and add_subparsers: nothing is stored' },
  ],

  modes: [
    {
      id: 'hidden',
      label: 'hidden and absent',
      blurb: '--name has default=SUPPRESS, --debug-dump has help=SUPPRESS. Compare the Namespace with and without them, and the -h output.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name', default=argparse.SUPPRESS, help='only set when given')\nparser.add_argument('--debug-dump', action='store_true', help=argparse.SUPPRESS)\nparser.add_argument('--level', type=int, default=1)\n" + TAIL,
      cases: [
        { id: 'none',   label: 'nothing',       values: { cmdline: '' } },
        { id: 'name',   label: '--name Ada',    values: { cmdline: '--name Ada' } },
        { id: 'hidden', label: 'hidden option', values: { cmdline: '--debug-dump --level 3' } },
        { id: 'help',   label: '-h',            values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'parserwide',
      label: 'argument_default=SUPPRESS',
      blurb: 'Every argument without its own default is left out when absent — even store_true, whose built-in default False is overridden.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app', argument_default=argparse.SUPPRESS)\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nparser.add_argument('--tls', action='store_true')\n" + TAIL,
      cases: [
        { id: 'none', label: 'nothing',          values: { cmdline: '' } },
        { id: 'some', label: '--port --tls',     values: { cmdline: '--port 8443 --tls' } },
        { id: 'all',  label: 'everything',       values: { cmdline: '--host example.com --port 80 --tls' } },
      ],
    },
  ],
  demoExplainer: "An empty command line gives Namespace(debug_dump=False, level=1): name is simply missing. With --name Ada it appears last — defaults are filled in before parsing, a suppressed attribute only when its option is processed. The hidden --debug-dump is accepted like any other option but does not appear in the usage line or the option list. With argument_default=SUPPRESS an empty command line gives an empty Namespace() — useful for merging command-line values over a config dict with vars(args), since only what the user typed is present.",

  patterns: [
    {
      name: 'Command line overrides config',
      desc: 'Only arguments the user typed appear in vars(args), so they override and nothing else does.',
      code: "parser = argparse.ArgumentParser(argument_default=argparse.SUPPRESS)\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nsettings = {**load_config(), **vars(parser.parse_args())}",
    },
    {
      name: 'Was the option given at all?',
      desc: "Namespace supports in: 'name' in args.",
      code: "parser.add_argument('--limit', type=int, default=argparse.SUPPRESS)\nargs = parser.parse_args()\nif 'limit' in args:\n    apply_limit(args.limit)",
    },
    {
      name: 'An undocumented option',
      desc: 'For debugging switches you do not want in -h.',
      code: "parser.add_argument('--trace', action='store_true', help=argparse.SUPPRESS)",
    },
  ],

  examples: [
    { title: "It's a plain string", code: 'import argparse\nargparse.SUPPRESS', returns: "'==SUPPRESS=='" },
    { title: 'default=SUPPRESS: no attribute unless given', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', default=argparse.SUPPRESS)\n(parser.parse_args([]), parser.parse_args(['--foo', '1']))", returns: "(Namespace(), Namespace(foo='1'))" },
    { title: 'Test presence with in or getattr', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', default=argparse.SUPPRESS)\nargs = parser.parse_args([])\n('foo' in args, getattr(args, 'foo', 'not given'))", returns: "(False, 'not given')" },
    { title: 'help=SUPPRESS: gone from -h (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name', help='who to greet')\nparser.add_argument('--trace', action='store_true', help=argparse.SUPPRESS)\n" + HELP_TAIL, returns: 'usage: app [-h] [--name NAME]\n\noptions:\n  -h, --help   show this help message and exit\n  --name NAME  who to greet' },
    { title: '… but still parsed', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name', help='who to greet')\nparser.add_argument('--trace', action='store_true', help=argparse.SUPPRESS)\nparser.parse_args(['--trace'])", returns: "Namespace(name=None, trace=True)" },
    { title: 'argument_default=SUPPRESS for the whole parser', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', argument_default=argparse.SUPPRESS)\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nparser.add_argument('--tls', action='store_true')\n(parser.parse_args([]), parser.parse_args(['--port', '8443', '--tls']))", returns: '(Namespace(), Namespace(port=8443, tls=True))' },
    { title: 'usage=SUPPRESS: errors without the usage line', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', usage=argparse.SUPPRESS)\nparser.add_argument('name')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args([])\nexcept SystemExit:\n    print(err.getvalue(), end='')", returns: 'app: error: the following arguments are required: name' },
  ],

  pitfalls: [
    {
      name: 'Reading a suppressed attribute directly',
      desc: 'With default=SUPPRESS the attribute does not exist until the user passes the option.',
      wrong: { label: 'args.config', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--config', default=argparse.SUPPRESS)\nargs = parser.parse_args([])\nargs.config", output: "AttributeError: 'Namespace' object has no attribute 'config'" },
      fix:   { label: "'config' in args", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--config', default=argparse.SUPPRESS)\nargs = parser.parse_args([])\nargs.config if 'config' in args else 'use the built-in settings'", output: "'use the built-in settings'" },
    },
    {
      name: 'Hidden options still match abbreviations',
      desc: 'help=SUPPRESS only hides the option from help. Prefix matching still sees it — and the ambiguity error prints its name.',
      wrong: { label: 'hidden --verbose-trace', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--verbose', action='store_true')\nparser.add_argument('--verbose-trace', action='store_true', help=argparse.SUPPRESS)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--verb'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: ambiguous option: --verb could match --verbose, --verbose-trace' },
      fix:   { label: 'allow_abbrev=False', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', allow_abbrev=False)\nparser.add_argument('--verbose', action='store_true')\nparser.add_argument('--verbose-trace', action='store_true', help=argparse.SUPPRESS)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--verb'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: unrecognized arguments: --verb' },
    },
  ],

  when: {
    use: [
      'Distinguishing "not given" from "given the default" → default=SUPPRESS',
      'Layering command-line values over a config file → argument_default=SUPPRESS',
      'Maintenance or debugging switches → help=SUPPRESS',
    ],
    avoid: [
      'Real secrets or access control → hidden options are only hidden from -h',
      'Code that reads args.x unconditionally → keep a normal default',
    ],
  },

  notes: {
    cpython:     "SUPPRESS = '==SUPPRESS==' in Lib/argparse.py; most checks are identity tests (default is SUPPRESS), a few are equality tests (nargs == SUPPRESS)",
    'In help':   "SUPPRESS-valued attributes are removed before % formatting, so help='... %(default)s' on an argument with default=SUPPRESS raises KeyError: 'default' when help is built; ArgumentDefaultsHelpFormatter simply adds no (default: ...) for it",
    'Subparsers': 'add_subparsers() without dest= uses dest=SUPPRESS, which is why the chosen command name is not stored unless you ask for it',
  },

  related: [
    { name: 'add_argument()', slug: 'add_argument', when: 'default= and help= parameters' },
    { name: 'Namespace', slug: 'namespace', when: 'in, getattr and vars() on the result' },
    { name: 'set_defaults()', slug: 'set_defaults', when: 'Defaults that come from the parser instead' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'argument_default= and usage=' },
    { name: 'nargs constants', slug: 'nargs', when: 'The other special strings' },
  ],

  faq: [
    {
      q: 'How do I hide an argument from argparse help?',
      a: 'Pass help=argparse.SUPPRESS to add_argument. The option is left out of the usage line and the option list but still works when typed.',
    },
    {
      q: 'How can I tell whether the user passed an option or it just has its default?',
      a: "Use default=argparse.SUPPRESS: the attribute exists only if the option was given, so 'name' in args (or hasattr) answers the question. For every argument at once, pass argument_default=argparse.SUPPRESS to ArgumentParser.",
    },
    {
      q: 'Why is there no attribute for my subcommand name?',
      a: "add_subparsers() stores nothing by default (its dest is SUPPRESS). Call add_subparsers(dest='command') to get args.command.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#default',
    meta:  'default=argparse.SUPPRESS',
  },

};
