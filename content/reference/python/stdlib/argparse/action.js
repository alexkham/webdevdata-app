// content/reference/python/stdlib/argparse/action.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const KEYVALUE = "class KeyValue(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        items = dict(getattr(namespace, self.dest) or {})\n        for value in values:\n            key, sep, val = value.partition('=')\n            if not sep:\n                raise argparse.ArgumentError(self, f'expected KEY=VALUE, got {value!r}')\n            items[key] = val\n        setattr(namespace, self.dest, items)\n\n";

const TOGGLE = "class Toggle(argparse.Action):\n    def __init__(self, option_strings, dest, **kwargs):\n        super().__init__(option_strings, dest, nargs=0, **kwargs)\n\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, option_string == '--on')\n\n    def format_usage(self):\n        return ' | '.join(self.option_strings)\n\n";

const USAGE_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # usage wraps at the terminal width\ntry:\n    parser.print_usage()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\n";

export const meta = {
  slug:        'action',
  name:        'argparse.Action',
  signature:   'argparse.Action(option_strings, dest, nargs=None, const=None, default=None, type=None, choices=None, required=False, help=None, metavar=None, deprecated=False)',
  blurb:       'The base class behind every action= value. Subclass it and override __call__ to decide what happens to an argument\'s values; format_usage controls how it appears in the usage line.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+ (deprecated= 3.13)',
  searchTerms: 'argparse Action custom action subclass __call__ parser namespace values option_string Action.format_usage format_usage custom argparse action key=value setattr namespace dest argparse action class register',
};

export const method = {
  slug:      'action',
  name:      'argparse.Action',
  signature: 'argparse.Action(option_strings, dest, nargs=None, const=None, default=None, type=None, choices=None, required=False, help=None, metavar=None, deprecated=False)',
  returns:   { type: 'Action', desc: 'add_argument() creates the instance for you; you pass the class as action=.' },

  category:    'argparse class',
  version:     'Python 3.2+ (deprecated= 3.13)',
  hasLiveDemo: true,

  subtitle: "When none of the built-in actions fits, pass your own Action subclass as action=. add_argument() instantiates it with the keyword arguments you gave; the parser calls it as action(parser, namespace, values, option_string) every time the argument appears, after type= conversion and choices= checking.",

  covers: ['Action', 'Action.format_usage'],

  cheat: {
    commonCall: 'class KeyValue(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None): ...',
    returns:    'nothing — __call__ stores its result with setattr(namespace, self.dest, ...)',
    replaces:   'post-processing values after parse_args',
    watchOut:   'Defaults never pass through __call__; flag-like actions need nargs=0',
  },

  parameters: [
    { name: 'option_strings', type: 'list[str]', required: true,  default: null,   desc: "The flags, e.g. ['-D', '--define']; [] for a positional. Filled in by add_argument()." },
    { name: 'dest',           type: 'str',       required: true,  default: null,   desc: 'Attribute name in the Namespace — what __call__ should setattr.' },
    { name: 'nargs',          type: "int | str", required: false, default: 'None', desc: "How many words the action consumes. Pass nargs=0 from your __init__ for a flag." },
    { name: 'const',          type: 'object',    required: false, default: 'None', desc: 'A fixed value for the action to use, like store_const.' },
    { name: 'default',        type: 'object',    required: false, default: 'None', desc: 'Put into the Namespace before parsing. __call__ is not called for it.' },
    { name: 'type',           type: 'callable',  required: false, default: 'None', desc: 'Applied to each word before __call__ sees it.' },
    { name: 'choices',        type: 'container', required: false, default: 'None', desc: 'Checked before __call__ is called.' },
    { name: 'required',       type: 'bool',      required: false, default: 'False', desc: 'Options only: the argument must appear.' },
    { name: 'help',           type: 'str',       required: false, default: 'None', desc: 'Help text; %(dest)s and the other attributes are substituted.' },
    { name: 'metavar',        type: 'str | tuple', required: false, default: 'None', desc: 'Name of the value in usage and help.' },
    { name: 'deprecated',     type: 'bool',      required: false, default: 'False', desc: '3.13+: warn on stderr when the argument is used.' },
  ],

  modes: [
    {
      id: 'keyvalue',
      label: 'KEY=VALUE action',
      blurb: '-D collects KEY=VALUE words into one dict across repeated options and rejects a word without =. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\n\n" + KEYVALUE + "parser = argparse.ArgumentParser(prog='app')\nparser.add_argument('target')\nparser.add_argument('-D', '--define', nargs='+', action=KeyValue, metavar='KEY=VALUE', help='set variables (repeatable)')\n" + TAIL,
      cases: [
        { id: 'two',     label: 'two variables',   values: { cmdline: 'build -D mode=fast debug=1' } },
        { id: 'repeat',  label: '-D twice',        values: { cmdline: 'build -D mode=fast -D mode=safe' } },
        { id: 'swallow', label: '-D before target', values: { cmdline: '-D mode=fast build' } },
        { id: 'bad',     label: 'no =',            values: { cmdline: 'build -D oops' } },
        { id: 'empty',   label: '-D alone',        values: { cmdline: 'build -D' } },
        { id: 'help',    label: '-h',              values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'toggle',
      label: 'format_usage',
      blurb: 'One action owns both --on and --off, uses option_string to tell them apart, and overrides format_usage so the usage line reads [--on | --off].',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\n\n" + TOGGLE + "parser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--on', '--off', dest='enabled', action=Toggle, default=False, help='switch the feature on or off')\n" + TAIL,
      cases: [
        { id: 'on',    label: '--on',        values: { cmdline: '--on' } },
        { id: 'last',  label: '--on --off',  values: { cmdline: '--on --off' } },
        { id: 'none',  label: 'nothing',     values: { cmdline: '' } },
        { id: 'abbr',  label: '--o',         values: { cmdline: '--o' } },
        { id: 'value', label: '--on=1',      values: { cmdline: '--on=1' } },
        { id: 'help',  label: '-h',          values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "values arrives as a list here because nargs='+', and every -D builds on the dict the previous one stored. '-D mode=fast build' fails because + takes every following word that is not an option, so build becomes a second KEY=VALUE word and the target is missing — put positionals first or end the list with --. An ArgumentError raised inside __call__ is reported like any parse error: \"app: error: argument -D/--define: expected KEY=VALUE, got 'oops'\". In the second tab the usage line shows [--on | --off] because the parser asks each optional's format_usage() for its text; the default would show only the first flag, [--on]. nargs=0 is what makes --on=1 an error (\"ignored explicit argument '1'\").",

  attributes: [
    { name: 'option_strings', type: 'list[str]', meaning: 'The flags this action answers to; empty for positionals' },
    { name: 'dest',           type: 'str',       meaning: 'Namespace attribute the action writes' },
    { name: 'nargs, const, default, type, choices, required, help, metavar, deprecated', type: 'as passed', meaning: 'Everything given to add_argument(), stored unchanged' },
    { name: 'container',      type: '_ArgumentGroup', meaning: 'Set when the action is added: the argument group that holds it' },
    { name: '__call__(parser, namespace, values, option_string=None)', type: 'method', meaning: 'Override it; the base version raises NotImplementedError' },
    { name: 'format_usage()', type: 'method', meaning: 'Text for the usage line of a flag that takes no value: option_strings[0] by default' },
  ],

  patterns: [
    {
      name: 'A minimal custom action',
      desc: 'Override __call__ and store the result yourself.',
      code: "import argparse\n\nclass Lower(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, values.lower())\n\nparser.add_argument('--env', action=Lower)",
    },
    {
      name: 'A flag that takes no value',
      desc: 'Force nargs=0 in __init__ so the action never consumes the next word.',
      code: "import argparse\n\nclass Enable(argparse.Action):\n    def __init__(self, option_strings, dest, **kwargs):\n        super().__init__(option_strings, dest, nargs=0, **kwargs)\n\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, True)",
    },
    {
      name: 'Report a bad value as a usage error',
      desc: 'Raise ArgumentError(self, message): argparse prints usage plus "argument -x: message" and exits with 2.',
      code: "import argparse\n\nclass Even(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        if values % 2:\n            raise argparse.ArgumentError(self, f'{values} is not even')\n        setattr(namespace, self.dest, values)\n\nparser.add_argument('--size', type=int, action=Even)",
    },
    {
      name: 'Register a short name for your action',
      desc: "register() maps a string to the class, so add_argument can say action='kv'.",
      code: "parser.register('action', 'kv', KeyValue)\nparser.add_argument('-D', action='kv', nargs='+')",
    },
  ],

  examples: [
    { title: 'A KEY=VALUE action that builds a dict', code: "import argparse\n\nclass KeyValue(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        items = dict(getattr(namespace, self.dest) or {})\n        for value in values:\n            key, _, val = value.partition('=')\n            items[key] = val\n        setattr(namespace, self.dest, items)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-D', '--define', nargs='+', action=KeyValue, metavar='KEY=VALUE')\nparser.parse_args(['-D', 'mode=fast', 'debug=1', '-D', 'mode=safe'])", returns: "Namespace(define={'mode': 'safe', 'debug': '1'})" },
    { title: 'What __call__ receives', code: "import argparse\n\nclass Show(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        print(f'{self.dest}: values={values!r}, option_string={option_string!r}')\n        setattr(namespace, self.dest, values)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--size', type=int, action=Show)\nparser.add_argument('files', nargs='*', action=Show)\nparser.parse_args(['a.txt', '--size', '3'])", returns: "files: values=['a.txt'], option_string=None\nsize: values=3, option_string='--size'\nNamespace(size=3, files=['a.txt'])" },
    { title: 'add_argument returns the Action instance', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\naction = parser.add_argument('-n', '--dry-run', action='store_true')\n(type(action).__name__, action.option_strings, action.dest, action.default)", returns: "('_StoreTrueAction', ['-n', '--dry-run'], 'dry_run', False)" },
    { title: 'format_usage(): how a flag appears in usage', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nflag = parser.add_argument('-v', '--verbose', action='store_true')\ncolor = parser.add_argument('--color', action=argparse.BooleanOptionalAction)\n(flag.format_usage(), color.format_usage())", returns: "('-v', '--color | --no-color')" },
    { title: 'Override format_usage (usage width fixed at 60)', code: "import argparse, os\n\n" + TOGGLE + "parser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--on', '--off', dest='enabled', action=Toggle, default=False)\n" + USAGE_TAIL + "parser.parse_args(['--off'])", returns: 'usage: app [-h] [--on | --off]\nNamespace(enabled=False)' },
    { title: 'Raising ArgumentError from __call__', code: "import argparse\n\nclass Once(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        if getattr(namespace, self.dest) is not None:\n            raise argparse.ArgumentError(self, 'may only be given once')\n        setattr(namespace, self.dest, values)\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--output', action=Once)\nparser.parse_args(['--output', 'a.txt', '--output', 'b.txt'])", returns: 'argparse.ArgumentError: argument --output: may only be given once' },
    { title: 'The base class cannot be used directly', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--x', action=argparse.Action)\nparser.parse_args(['--x', '1'])", returns: 'NotImplementedError: .__call__() not defined' },
  ],

  pitfalls: [
    {
      name: 'Appending to the default in place',
      desc: 'The default object is put into every new Namespace as is. Mutating it changes the default itself, so values leak from one parse_args call into the next.',
      wrong: { label: '.append() on the default', code: "import argparse\n\nclass Collect(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        getattr(namespace, self.dest).append(values)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--tag', action=Collect, default=[])\nparser.parse_args(['--tag', 'a'])\nparser.parse_args(['--tag', 'b'])", output: "Namespace(tag=['a', 'b'])" },
      fix:   { label: 'copy, then setattr', code: "import argparse\n\nclass Collect(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        items = list(getattr(namespace, self.dest) or [])\n        items.append(values)\n        setattr(namespace, self.dest, items)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--tag', action=Collect, default=[])\nparser.parse_args(['--tag', 'a'])\nparser.parse_args(['--tag', 'b'])", output: "Namespace(tag=['b'])" },
    },
    {
      name: 'A flag action without nargs=0',
      desc: 'A custom action consumes one word unless told otherwise, so --fast silently eats the next argument.',
      wrong: { label: 'default nargs', code: "import argparse, contextlib, io\n\nclass Enable(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, True)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--fast', action=Enable, default=False)\nparser.add_argument('input')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--fast', 'data.csv'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: the following arguments are required: input' },
      fix:   { label: 'nargs=0 in __init__', code: "import argparse\n\nclass Enable(argparse.Action):\n    def __init__(self, option_strings, dest, **kwargs):\n        super().__init__(option_strings, dest, nargs=0, **kwargs)\n\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, True)\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--fast', action=Enable, default=False)\nparser.add_argument('input')\nparser.parse_args(['--fast', 'data.csv'])", output: "Namespace(fast=True, input='data.csv')" },
    },
    {
      name: 'Expecting the action to process the default',
      desc: '__call__ runs only for arguments that appear on the command line. A conversion that must also apply to the default belongs in type=, which argparse applies to str defaults.',
      wrong: { label: 'action=Upper', code: "import argparse\n\nclass Upper(argparse.Action):\n    def __call__(self, parser, namespace, values, option_string=None):\n        setattr(namespace, self.dest, values.upper())\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--code', action=Upper, default='none')\nparser.parse_args([])", output: "Namespace(code='none')" },
      fix:   { label: 'type=str.upper', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--code', type=str.upper, default='none')\nparser.parse_args([])", output: "Namespace(code='NONE')" },
    },
  ],

  when: {
    use: [
      'Values that need structure while parsing: KEY=VALUE pairs, ranges, merged dicts',
      'One option object that owns several flags (--on / --off) and inspects option_string',
      'Rejecting a combination at the moment it appears, with a normal usage error',
    ],
    avoid: [
      'Plain conversions or validation of one value → type= (it also covers str defaults)',
      'Simple flags, counters and lists → the built-in action strings',
      'Checks that need every argument → validate after parse_args() and call parser.error()',
    ],
  },

  notes: {
    cpython:          'class Action(_AttributeHolder) in Lib/argparse.py; the built-in actions are private subclasses (_StoreAction, _AppendAction, …) and BooleanOptionalAction is the public one',
    'Call order':     'values are converted with type= and checked against choices= (in _get_values) before __call__ runs; the default is placed in the Namespace before parsing starts',
    'format_usage':   'used only for optionals with nargs=0 when the usage line is built; arguments that take values are shown as "flag METAVAR" without asking the action',
    'Constructor':    'add_argument() calls the class with keyword arguments only (option_strings=..., dest=..., plus your keywords), so an overridden __init__ must keep the parameter names option_strings and dest',
  },

  related: [
    { name: 'actions', slug: 'actions', when: 'The built-in action= strings' },
    { name: 'BooleanOptionalAction', slug: 'booleanoptionalaction', when: 'The public Action subclass' },
    { name: 'ArgumentError', slug: 'argumenterror', when: 'Raise it from __call__' },
    { name: 'add_argument()', slug: 'add_argument', when: 'Where action= is passed' },
    { name: 'Namespace', slug: 'namespace', when: 'What __call__ writes into' },
    { name: 'setattr()', slug: 'setattr', when: 'How actions store values', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I write a custom argparse action?',
      a: 'Subclass argparse.Action and override __call__(self, parser, namespace, values, option_string=None); store the result with setattr(namespace, self.dest, ...). Pass the class itself as action= in add_argument. For a flag, call super().__init__(option_strings, dest, nargs=0, **kwargs) in __init__.',
    },
    {
      q: 'Is the custom action called for the default value?',
      a: 'No. The default is put into the Namespace before parsing, and __call__ runs only when the argument appears on the command line. Use type= for conversions that must also apply to str defaults.',
    },
    {
      q: 'What is option_string in __call__?',
      a: 'The flag the user actually typed (for example --off rather than --on), or None for a positional. With abbreviations it is the full option string the prefix matched, not the prefix.',
    },
    {
      q: 'What does Action.format_usage do?',
      a: 'It returns the text a no-value option contributes to the usage line — option_strings[0] by default. BooleanOptionalAction overrides it to show --x | --no-x; your subclass can do the same.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.Action',
    meta:  'argparse.Action',
  },

};
