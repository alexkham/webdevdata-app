// content/reference/python/stdlib/argparse/actions.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'actions',
  name:        "add_argument(action=...)",
  signature:   "parser.add_argument(..., action='store' | 'store_const' | 'store_true' | 'store_false' | 'append' | 'append_const' | 'extend' | 'count' | 'help' | 'version' | Action subclass)",
  blurb:       "What happens when an argument is seen: store its value, store a constant, flip a flag, collect into a list, count repetitions, or print help/version and exit.",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     "Python 3.2+ ('extend' 3.8)",
  searchTerms: "argparse action store_true store_false store_const append append_const extend count version help action= flag boolean option verbosity -vvv repeat option multiple times list of values argparse actions",
};

export const method = {
  slug:      'actions',
  name:      "add_argument(action=...)",
  signature: "parser.add_argument(..., action='store' | 'store_const' | 'store_true' | 'store_false' | 'append' | 'append_const' | 'extend' | 'count' | 'help' | 'version' | Action subclass)",
  returns:   { type: 'Action', desc: "add_argument returns an instance of the chosen action class: _StoreAction, _StoreTrueAction, _AppendAction, _CountAction …" },

  category:    'add_argument parameter',
  version:     "Python 3.2+ ('extend' 3.8)",
  hasLiveDemo: true,

  subtitle: "action= picks the class that handles an argument each time it appears. The default 'store' keeps one value; the others turn options into flags (store_true), counters (count), lists (append, extend) or exits (help, version).",

  // action names are strings registered on the parser, not public names
  covers: [],

  cheat: {
    commonCall: "parser.add_argument('-v', '--verbose', action='store_true')",
    returns:    'args.verbose is False, or True when -v is given',
    replaces:   'type=bool and hand-made flag handling',
    watchOut:   "count and append_const default to None, not 0 / [] — pass default=",
  },

  attributes: [
    { name: "'store'",        type: 'nargs=None', meaning: 'The default: keep the (converted) value; the last occurrence wins' },
    { name: "'store_const'",  type: 'nargs=0', meaning: 'Store const= (default None) when the option is present' },
    { name: "'store_true'",   type: 'nargs=0', meaning: 'Store True; default False' },
    { name: "'store_false'",  type: 'nargs=0', meaning: 'Store False; default True' },
    { name: "'append'",       type: 'nargs=None', meaning: 'Add each occurrence\'s value to a list (a copy of the default list, if any)' },
    { name: "'append_const'", type: 'nargs=0', meaning: 'Add const= to a list — several options can share one dest' },
    { name: "'extend'",       type: "use nargs='+'", meaning: 'Add every value of each occurrence to one flat list (3.8+)' },
    { name: "'count'",        type: 'nargs=0', meaning: 'Count occurrences: -vvv gives 3; default None unless default=0' },
    { name: "'help'",         type: 'nargs=0', meaning: 'Print the help to stdout and exit with status 0 (added as -h/--help automatically)' },
    { name: "'version'",      type: 'nargs=0', meaning: 'Print version= (with %(prog)s filled in) to stdout and exit with status 0' },
    { name: 'BooleanOptionalAction', type: 'nargs=0', meaning: 'A class, not a string: --x stores True and --no-x stores False (3.9+)' },
  ],

  modes: [
    {
      id: 'flags',
      label: 'flags and counters',
      blurb: 'count, store_true, store_false, store_const and version on one parser. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-v', '--verbose', action='count', default=0)\nparser.add_argument('--debug', action='store_true')\nparser.add_argument('--no-cache', dest='cache', action='store_false')\nparser.add_argument('--fast', dest='mode', action='store_const', const='fast', default='normal')\nparser.add_argument('--version', action='version', version='%(prog)s 2.1')\n" + TAIL,
      cases: [
        { id: 'none',    label: 'nothing',             values: { cmdline: '' } },
        { id: 'vvv',     label: '-vvv --debug',        values: { cmdline: '-vvv --debug' } },
        { id: 'mixed',   label: '-v --verbose -v',     values: { cmdline: '-v --verbose -v' } },
        { id: 'consts',  label: '--no-cache --fast',   values: { cmdline: '--no-cache --fast' } },
        { id: 'value',   label: '--debug=yes',         values: { cmdline: '--debug=yes' } },
        { id: 'version', label: '--version',           values: { cmdline: '--version' } },
      ],
    },
    {
      id: 'lists',
      label: 'lists',
      blurb: 'append keeps one value per occurrence, extend flattens several values per occurrence, append_const collects constants from different options into one list.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--tag', action='append')\nparser.add_argument('--include', action='extend', nargs='+')\nparser.add_argument('--csv', dest='formats', action='append_const', const='csv')\nparser.add_argument('--json', dest='formats', action='append_const', const='json')\n" + TAIL,
      cases: [
        { id: 'append',  label: '--tag twice',       values: { cmdline: '--tag a --tag b' } },
        { id: 'extend',  label: '--include x y',     values: { cmdline: '--include x y --include z' } },
        { id: 'consts',  label: '--json --csv',      values: { cmdline: '--json --csv --json' } },
        { id: 'none',    label: 'nothing',           values: { cmdline: '' } },
        { id: 'empty',   label: '--include alone',   values: { cmdline: '--include' } },
      ],
    },
  ],
  demoExplainer: "Flag-style actions consume no value (nargs=0), so -vvv is three -v flags and --debug=yes is an error (\"ignored explicit argument 'yes'\"). --version prints to stdout and exits with status 0, which is why the result is (0, ['app 2.1']). In the lists tab every list attribute is None until its option appears — append, extend and append_const start from the default, which is None unless you pass default=[...].",

  patterns: [
    {
      name: 'Verbosity levels',
      desc: 'count with default=0 gives 0, 1, 2, … for nothing, -v, -vv.',
      code: "parser.add_argument('-v', '--verbose', action='count', default=0)\nargs = parser.parse_args()\nlevel = ['WARNING', 'INFO', 'DEBUG'][min(args.verbose, 2)]",
    },
    {
      name: 'A repeatable option',
      desc: "append collects one value per occurrence: --header A --header B.",
      code: "parser.add_argument('-H', '--header', action='append', default=[], help='extra HTTP header (repeatable)')",
    },
    {
      name: 'Version string from the package',
      desc: "%(prog)s is replaced by the program name.",
      code: "from importlib.metadata import version\nparser.add_argument('--version', action='version', version=f\"%(prog)s {version('mytool')}\")",
    },
    {
      name: 'On/off pair for one setting',
      desc: 'Two options writing the same dest; the last one on the command line wins.',
      code: "parser.add_argument('--cache', dest='cache', action='store_true', default=True)\nparser.add_argument('--no-cache', dest='cache', action='store_false')",
    },
  ],

  examples: [
    { title: 'store_true / store_false defaults', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', action='store_true')\nparser.add_argument('--bar', action='store_false')\nparser.add_argument('--baz', action='store_false')\nparser.parse_args(['--foo', '--bar'])", returns: 'Namespace(foo=True, bar=False, baz=True)' },
    { title: 'store_const without and with the flag', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', action='store_const', const=42)\n(parser.parse_args([]), parser.parse_args(['--foo']))", returns: '(Namespace(foo=None), Namespace(foo=42))' },
    { title: 'count adds up every occurrence', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-v', '--verbose', action='count', default=0)\nparser.parse_args(['-vvv', '--verbose'])", returns: 'Namespace(verbose=4)' },
    { title: 'append_const: several options, one list', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--str', dest='types', action='append_const', const=str)\nparser.add_argument('--int', dest='types', action='append_const', const=int)\nparser.parse_args(['--str', '--int'])", returns: "Namespace(types=[<class 'str'>, <class 'int'>])" },
    { title: "extend with nargs='+' flattens", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--include', action='extend', nargs='+')\nparser.parse_args(['--include', 'a', 'b', '--include', 'c'])", returns: "Namespace(include=['a', 'b', 'c'])" },
    { title: 'version prints to stdout and exits with 0', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--version', action='version', version='%(prog)s 2.1')\nout = io.StringIO()\ntry:\n    with contextlib.redirect_stdout(out):\n        parser.parse_args(['--version'])\nexcept SystemExit as e:\n    print(repr(out.getvalue()), 'exit status', e.code)", returns: "'app 2.1\\n' exit status 0" },
    { title: 'Flags take no value', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--debug', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--debug=yes'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "app: error: argument --debug: ignored explicit argument 'yes'" },
  ],

  pitfalls: [
    {
      name: 'count without default=0',
      desc: 'An absent counter is None, and None cannot be compared with an int.',
      wrong: { label: "action='count'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-v', action='count')\nargs = parser.parse_args([])\nargs.v > 1", output: "TypeError: '>' not supported between instances of 'NoneType' and 'int'" },
      fix:   { label: 'default=0', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-v', action='count', default=0)\nargs = parser.parse_args([])\nargs.v > 1", output: 'False' },
    },
    {
      name: 'append onto a non-empty default',
      desc: 'append copies the default list and adds to it, so command-line values come after the default instead of replacing it.',
      wrong: { label: "default=['info']", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--level', action='append', default=['info'])\nparser.parse_args(['--level', 'debug'])", output: "Namespace(level=['info', 'debug'])" },
      fix:   { label: 'fall back after parsing', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--level', action='append')\nargs = parser.parse_args(['--level', 'debug'])\nargs.level or ['info']", output: "['debug']" },
    },
    {
      name: 'extend without nargs',
      desc: 'With the default nargs the value is one string, and extending a list with a string adds its characters.',
      wrong: { label: "action='extend'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--tag', action='extend')\nparser.parse_args(['--tag', 'abc'])", output: "Namespace(tag=['a', 'b', 'c'])" },
      fix:   { label: "nargs='+'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--tag', action='extend', nargs='+')\nparser.parse_args(['--tag', 'abc'])", output: "Namespace(tag=['abc'])" },
    },
  ],

  when: {
    use: [
      "Yes/no switches → 'store_true' (or BooleanOptionalAction for --x/--no-x)",
      "Repeatable options → 'append'; several values per option → 'extend' with nargs='+'",
      "-v, -vv, -vvv → 'count' with default=0",
    ],
    avoid: [
      'Anything with side effects beyond storing a value → a custom Action subclass, or do it after parsing',
      "type=bool for flags → it treats every non-empty string as True",
    ],
  },

  notes: {
    cpython:       "the strings are keys of the parser's 'action' registry (_StoreAction, _StoreConstAction, _StoreTrueAction, _StoreFalseAction, _AppendAction, _AppendConstAction, _ExtendAction, _CountAction, _HelpAction, _VersionAction in Lib/argparse.py); parser.register('action', name, cls) adds your own",
    'Keywords':    "each action class accepts only the keywords it uses: store_true rejects nargs= with TypeError (\"got an unexpected keyword argument 'nargs'\"); an unknown action string is ValueError: unknown action \"...\"",
    'const':       "since 3.11 const defaults to None for store_const and append_const as well",
  },

  related: [
    { name: 'BooleanOptionalAction', slug: 'booleanoptionalaction', when: '--x / --no-x pairs' },
    { name: 'Action', slug: 'action', when: 'Write your own action class' },
    { name: 'nargs', slug: 'nargs', when: 'How many values an action consumes' },
    { name: 'add_argument()', slug: 'add_argument', when: 'All the other keywords' },
    { name: 'set_defaults()', slug: 'set_defaults', when: 'Defaults that no option sets' },
  ],

  faq: [
    {
      q: 'How do I make a boolean flag with argparse?',
      a: "add_argument('--verbose', action='store_true'): False when absent, True when present. For an explicit on/off pair (--color / --no-color) use action=argparse.BooleanOptionalAction. Do not use type=bool.",
    },
    {
      q: 'How do I accept the same option several times?',
      a: "action='append' collects one value per occurrence into a list (--tag a --tag b → ['a', 'b']). If each occurrence takes several values, use action='extend' with nargs='+' to get one flat list.",
    },
    {
      q: 'How do I count -v, -vv, -vvv?',
      a: "action='count' with default=0. Grouped flags count individually, so -vvv adds 3. Without default=0 the attribute is None when no -v is given.",
    },
    {
      q: 'How do I add a --version option?',
      a: "add_argument('--version', action='version', version='%(prog)s 1.0'). It prints the text to stdout and exits with status 0 — no need to check for it after parse_args.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#action',
    meta:  'add_argument action',
  },

};
