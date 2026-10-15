// content/reference/python/stdlib/argparse/set_defaults.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'set_defaults',
  name:        'ArgumentParser.set_defaults',
  signature:   'ArgumentParser.set_defaults(**kwargs) / ArgumentParser.get_default(dest)',
  blurb:       'Parser-level defaults: attributes that appear in the Namespace without any option setting them, and replacements for the defaults of existing arguments. get_default() reads them back.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse set_defaults get_default ArgumentParser.set_defaults ArgumentParser.get_default parser defaults default values config file defaults func handler subcommand dispatch namespace attribute without option override default',
};

export const method = {
  slug:      'set_defaults',
  name:      'ArgumentParser.set_defaults',
  signature: 'ArgumentParser.set_defaults(**kwargs) / ArgumentParser.get_default(dest)',
  returns:   { type: 'None | object', desc: 'set_defaults returns None; get_default returns the default for dest (from the argument or set_defaults), or None when there is none.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "set_defaults(name=value) puts name=value in every Namespace this parser returns, unless an argument writes that attribute. If an argument already has that dest, its default is replaced. That makes it the place for computed defaults (from a config file) and for per-subcommand data such as the function to run.",

  // set_defaults and get_default are defined on argparse's private
  // _ActionsContainer base class, so they are not names of ArgumentParser
  covers: [],

  cheat: {
    commonCall: "parser.set_defaults(**config)  # or sub.set_defaults(func=handler)",
    returns:    "None — later, args.<name> exists with that value",
    replaces:   'post-processing the Namespace with "if not hasattr(args, ...)"',
    watchOut:   'It adds no option: --name on the command line is still unrecognized',
  },

  parameters: [
    { name: '**kwargs', type: 'object', required: false, default: null, desc: 'set_defaults: dest=value pairs. An existing argument with that dest gets the value as its default; other names are added to the Namespace as they are.' },
    { name: 'dest',     type: 'str',    required: true,  default: null, desc: 'get_default: the attribute name. Returns the argument\'s default, else the set_defaults value, else None.' },
  ],

  modes: [
    {
      id: 'precedence',
      label: 'which default wins',
      blurb: "--level has default='info', --port has none, retries is not an option at all. set_defaults gives all three a value. Type a command line.",
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--level', default='info')\nparser.add_argument('--port', type=int)\nparser.set_defaults(level='warning', port='8080', retries=3)\n" + TAIL,
      cases: [
        { id: 'none',    label: 'nothing',         values: { cmdline: '' } },
        { id: 'level',   label: '--level debug',   values: { cmdline: '--level debug' } },
        { id: 'port',    label: '--port 9000',     values: { cmdline: '--port 9000' } },
        { id: 'retries', label: '--retries 5',     values: { cmdline: '--retries 5' } },
        { id: 'badport', label: '--port http',     values: { cmdline: '--port http' } },
      ],
    },
    {
      id: 'dispatch',
      label: 'per-command defaults',
      blurb: 'The main parser and each subcommand set handler= (strings here; usually functions). Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='tool')\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.set_defaults(handler='show_usage')\ncommands = parser.add_subparsers(dest='command')\nbuild = commands.add_parser('build')\nbuild.add_argument('--release', action='store_true')\nbuild.set_defaults(handler='run_build')\nclean = commands.add_parser('clean')\nclean.set_defaults(handler='run_clean', release=False)\n" + TAIL,
      cases: [
        { id: 'none',    label: 'no command',       values: { cmdline: '' } },
        { id: 'build',   label: 'build',            values: { cmdline: 'build' } },
        { id: 'release', label: 'build --release',  values: { cmdline: 'build --release' } },
        { id: 'clean',   label: '-v clean',         values: { cmdline: '-v clean' } },
        { id: 'bad',     label: 'clean --release',  values: { cmdline: 'clean --release' } },
      ],
    },
  ],
  demoExplainer: "In the first tab level comes out as 'warning': set_defaults replaced the add_argument default. port's default is the string '8080', and argparse runs a string default through type= when the option is absent, so the Namespace holds the int 8080. retries is in the Namespace although no option sets it, which is also why --retries 5 is an unrecognized argument. In the second tab handler comes from whichever parser ran last: the main parser's 'show_usage' when no command is given, otherwise the subcommand's value. clean also sets release=False so code can read args.release for every command, but clean has no --release option.",

  patterns: [
    {
      name: 'Defaults from a config file, command line wins',
      desc: 'Load the file first, then let set_defaults replace the built-in defaults.',
      code: "import argparse, tomllib\nparser = argparse.ArgumentParser()\nparser.add_argument('--host', default='localhost')\nparser.add_argument('--port', type=int, default=80)\nwith open('app.toml', 'rb') as f:\n    parser.set_defaults(**tomllib.load(f))\nargs = parser.parse_args()",
    },
    {
      name: 'Subcommand dispatch',
      desc: 'Each subparser stores its handler; one call runs the right one.',
      code: "build = commands.add_parser('build')\nbuild.set_defaults(func=run_build)\nclean = commands.add_parser('clean')\nclean.set_defaults(func=run_clean)\nargs = parser.parse_args()\nargs.func(args)",
    },
    {
      name: 'Show defaults in a summary',
      desc: 'get_default reads the effective default of any dest.',
      code: "for name in ('host', 'port'):\n    print(f'{name}: default {parser.get_default(name)!r}')",
    },
  ],

  examples: [
    { title: 'Attributes no argument sets', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('foo', type=int)\nparser.set_defaults(bar=42, baz='badger')\nparser.parse_args(['736'])", returns: "Namespace(foo=736, bar=42, baz='badger')" },
    { title: 'set_defaults after add_argument replaces its default', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', default='bar')\nparser.set_defaults(foo='spam')\nparser.parse_args([])", returns: "Namespace(foo='spam')" },
    { title: 'Before add_argument, an explicit default= wins', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.set_defaults(foo='spam')\nparser.add_argument('--foo', default='bar')\nparser.parse_args([])", returns: "Namespace(foo='bar')" },
    { title: 'get_default', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', default='badger')\nparser.set_defaults(level=3)\n(parser.get_default('foo'), parser.get_default('level'), parser.get_default('nothing'))", returns: "('badger', 3, None)" },
    { title: 'String defaults go through type=, get_default does not', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int)\nparser.set_defaults(port='8080')\n(parser.parse_args([]), parser.get_default('port'))", returns: "(Namespace(port=8080), '8080')" },
    { title: 'Config values as defaults', code: "import argparse\nconfig = {'host': 'example.com', 'port': 8080}\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--host', default='localhost')\nparser.add_argument('--port', type=int, default=80)\nparser.set_defaults(**config)\n(parser.parse_args([]), parser.parse_args(['--port', '9000']))", returns: "(Namespace(host='example.com', port=8080), Namespace(host='example.com', port=9000))" },
    { title: 'Per-subcommand defaults', code: "import argparse\nparser = argparse.ArgumentParser(prog='tool')\nparser.set_defaults(handler='usage')\ncommands = parser.add_subparsers(dest='command')\ncommands.add_parser('build').set_defaults(handler='run_build')\ncommands.add_parser('clean').set_defaults(handler='run_clean')\n[parser.parse_args(argv).handler for argv in ([], ['build'], ['clean'])]", returns: "['usage', 'run_build', 'run_clean']" },
    { title: 'An existing namespace attribute beats every default', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--level', default='info')\nns = argparse.Namespace(level='debug')\nparser.parse_args([], namespace=ns)", returns: "Namespace(level='debug')" },
  ],

  pitfalls: [
    {
      name: 'Expecting set_defaults to create an option',
      desc: 'It only provides a value. Without add_argument there is nothing on the command line that can change it.',
      wrong: { label: 'set_defaults only', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.set_defaults(retries=3)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--retries', '5'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: unrecognized arguments: --retries 5' },
      fix:   { label: 'add_argument', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--retries', type=int, default=3)\nparser.parse_args(['--retries', '5'])", output: 'Namespace(retries=5)' },
    },
    {
      name: 'A mutable default is shared between parses',
      desc: 'The Namespace gets the very object you passed, not a copy. Mutating it changes the default for the next parse_args call.',
      wrong: { label: 'seen=[]', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.set_defaults(seen=[])\nfirst = parser.parse_args([])\nfirst.seen.append('a.txt')\n(first.seen, parser.parse_args([]).seen)", output: "(['a.txt'], ['a.txt'])" },
      fix:   { label: 'seen=None', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.set_defaults(seen=None)\nfirst = parser.parse_args([])\nfirst.seen = (first.seen or []) + ['a.txt']\n(first.seen, parser.parse_args([]).seen)", output: "(['a.txt'], None)" },
    },
    {
      name: 'get_default returns the raw default',
      desc: 'type= converts string defaults during parsing only. get_default hands back exactly what was passed.',
      wrong: { label: "default='8080'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int, default='8080')\nparser.get_default('port') + 1", output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'default=8080', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int, default=8080)\nparser.get_default('port') + 1", output: '8081' },
    },
  ],

  when: {
    use: [
      'Values that come from somewhere else than the command line (config file, environment)',
      'Per-subcommand data: the handler function, a mode name',
      'Overriding the default of an argument defined in a parent parser',
    ],
    avoid: [
      'Anything the user should be able to change → add_argument(..., default=...)',
      'One default for every argument → ArgumentParser(argument_default=...)',
    ],
  },

  notes: {
    cpython:       "set_defaults stores the pairs in parser._defaults and sets action.default on every existing action with that dest; add_argument without default= takes the value from _defaults. parse_known_args first sets each action's default, then the _defaults entries whose names are still missing",
    'Order':       "set_defaults after add_argument replaces default=; set_defaults before add_argument only fills in when add_argument has no default= of its own",
    'Conversion':  'string defaults of arguments with type= are converted at the end of parsing if the argument was not given; non-string defaults are used as they are',
    'Subparsers':  "a subparser's set_defaults values are copied into the Namespace when that command runs, overwriting the main parser's values for the same names",
  },

  related: [
    { name: 'add_subparsers()', slug: 'add_subparsers', when: 'set_defaults(func=...) on each subcommand' },
    { name: 'add_argument()', slug: 'add_argument', when: 'default= for one argument' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'argument_default= and parents=' },
    { name: 'Namespace', slug: 'namespace', when: 'Where the defaults end up' },
    { name: 'SUPPRESS', slug: 'suppress', when: 'Leave an attribute out instead of defaulting it' },
  ],

  faq: [
    {
      q: 'How do I set default values for argparse arguments from a config file?',
      a: 'Read the file into a dict, then call parser.set_defaults(**config) before parse_args(). Values given on the command line still win, and defaults that are strings are converted by each argument\'s type=.',
    },
    {
      q: 'What is the difference between default= and set_defaults()?',
      a: 'default= belongs to one argument. set_defaults(name=value) works at parser level: it can change the default of an existing argument and add attributes that no argument sets, which is how subcommands store the function to run (set_defaults(func=handler)).',
    },
    {
      q: 'How do I get the default value of an argparse argument?',
      a: "parser.get_default('dest') returns the argument's default, or the set_defaults value, or None. It is the raw value: a string default like '8080' is not converted by type=.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.set_defaults',
    meta:  'ArgumentParser.set_defaults',
  },

};
