// content/reference/python/stdlib/argparse/namespace.js

export const meta = {
  slug:        'namespace',
  name:        'argparse.Namespace',
  signature:   'argparse.Namespace(**kwargs)',
  blurb:       'The plain object parse_args() returns: one attribute per argument, a readable repr, == by attributes, "in" for presence, and vars() for a dict.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse Namespace parse_args result args object vars(args) namespace to dict attribute access args.name check if argument exists in namespace namespace= parse into existing object namespace equality json serialize args',
};

export const method = {
  slug:      'namespace',
  name:      'argparse.Namespace',
  signature: 'argparse.Namespace(**kwargs)',
  returns:   { type: 'Namespace', desc: 'An object with one attribute per keyword argument.' },

  category:    'argparse class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Deliberately simple: an object whose attributes are the parsed values, in the order they were set. It is not a dict — use args.name, getattr(args, name), or vars(args) when you need a mapping. 'name' in args tells you whether an attribute exists at all, which matters with default=argparse.SUPPRESS.",

  covers: ['Namespace'],

  cheat: {
    commonCall: 'args = parser.parse_args(); args.count; vars(args)',
    returns:    'attribute access; vars(args) is a dict of the same values',
    replaces:   'a dict of options, or getopt tuples',
    watchOut:   'args["x"] is a TypeError; dests with dashes need getattr()',
  },

  parameters: [
    { name: '**kwargs', type: 'any', required: false, default: null, desc: 'Initial attributes, set in the order given. Any str key works, even ones that are not identifiers.' },
  ],

  modes: [
    {
      id: 'inspect',
      label: 'inspect the result',
      blurb: '--name has default=SUPPRESS, --log-file stores under a dest with a dash. The result is (args, vars(args), \'name\' in args). Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name', default=argparse.SUPPRESS)\nparser.add_argument('--count', type=int, default=1)\nparser.add_argument('--log-file', dest='log-file')\nout = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        args = parser.parse_args(shlex.split({$cmdline}))\n    result = (args, vars(args), 'name' in args)\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult",
      cases: [
        { id: 'none',  label: 'nothing',            values: { cmdline: '' } },
        { id: 'name',  label: '--name Ada',         values: { cmdline: '--name Ada --count 3' } },
        { id: 'log',   label: '--log-file run.log', values: { cmdline: '--log-file run.log' } },
        { id: 'bad',   label: '--count x',          values: { cmdline: '--count x' } },
      ],
    },
  ],
  demoExplainer: "The repr lists attributes in the order they were set: defaults first (in add_argument order), then attributes that only appear when given, like name here. A dest that is not a valid identifier (log-file) is shown in a **{...} tail because it can only be read with getattr(args, 'log-file') or vars(args)['log-file']. vars(args) is the object's __dict__ — the same values as a real dict. 'name' in args is False until --name is passed, because default=SUPPRESS leaves the attribute out.",

  patterns: [
    {
      name: 'Pass the options to a function',
      desc: 'vars() turns the Namespace into keyword arguments.',
      code: "args = parser.parse_args()\nmain(**vars(args))",
    },
    {
      name: 'Merge with a config dict',
      desc: 'Command-line values win; with argument_default=SUPPRESS only typed options are present.',
      code: "settings = {**config, **vars(parser.parse_args())}",
    },
    {
      name: 'Parse into your own object',
      desc: 'namespace= fills any object with setattr, e.g. a settings instance.',
      code: "settings = Settings()\nparser.parse_args(namespace=settings)",
    },
    {
      name: 'Build one by hand in a test',
      desc: 'Code that takes args can be tested without a parser.',
      code: "import argparse\nargs = argparse.Namespace(verbose=True, count=3)\nassert run(args) == 'ok'",
    },
  ],

  examples: [
    { title: 'Create one directly', code: "import argparse\nargparse.Namespace(name='Ada', count=3)", returns: "Namespace(name='Ada', count=3)" },
    { title: 'Attributes, vars() and in', code: "import argparse\nargs = argparse.Namespace(name='Ada', count=3)\n(args.name, vars(args), 'count' in args, 'debug' in args)", returns: "('Ada', {'name': 'Ada', 'count': 3}, True, False)" },
    { title: '== compares the attributes, not the order', code: "import argparse\nargparse.Namespace(a=1, b=2) == argparse.Namespace(b=2, a=1)", returns: 'True' },
    { title: 'vars() is the live __dict__', code: "import argparse\nargs = argparse.Namespace(name='Ada')\nvars(args)['name'] = 'Grace'\nargs.debug = True\nargs", returns: "Namespace(name='Grace', debug=True)" },
    { title: 'Non-identifier dests need getattr', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--log-file', dest='log-file')\nargs = parser.parse_args(['--log-file', 'run.log'])\n(args, getattr(args, 'log-file'))", returns: "(Namespace(**{'log-file': 'run.log'}), 'run.log')" },
    { title: 'namespace= keeps existing attributes', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.add_argument('--count', type=int, default=1)\nargs = argparse.Namespace(count=10, extra='kept')\nparser.parse_args(['--name', 'Ada'], namespace=args)", returns: "Namespace(count=10, extra='kept', name='Ada')" },
    { title: 'Any object can receive the values', code: "import argparse\n\nclass Settings:\n    pass\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nsettings = Settings()\nresult = parser.parse_args(['--name', 'Ada'], namespace=settings)\n(result is settings, settings.name)", returns: "(True, 'Ada')" },
    { title: 'getattr with a fallback', code: "import argparse\nargs = argparse.Namespace(name='Ada')\ngetattr(args, 'nickname', 'none given')", returns: "'none given'" },
  ],

  pitfalls: [
    {
      name: 'Indexing it like a dict',
      desc: 'Namespace has attributes, not items.',
      wrong: { label: "args['name']", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nargs = parser.parse_args(['--name', 'Ada'])\nargs['name']", output: "TypeError: 'Namespace' object is not subscriptable" },
      fix:   { label: 'args.name / vars(args)', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nargs = parser.parse_args(['--name', 'Ada'])\n(args.name, vars(args)['name'])", output: "('Ada', 'Ada')" },
    },
    {
      name: 'Comparing it with a dict',
      desc: 'Namespace == only compares with another Namespace; against a dict it is simply False.',
      wrong: { label: 'args == dict', code: "import argparse\nargs = argparse.Namespace(name='Ada')\nargs == {'name': 'Ada'}", output: 'False' },
      fix:   { label: 'vars(args) == dict', code: "import argparse\nargs = argparse.Namespace(name='Ada')\nvars(args) == {'name': 'Ada'}", output: 'True' },
    },
    {
      name: 'Serializing it directly',
      desc: 'json and similar libraries do not know the class. Convert with vars() first.',
      wrong: { label: 'json.dumps(args)', code: "import argparse, json\nargs = argparse.Namespace(name='Ada', count=3)\njson.dumps(args)", output: 'TypeError: Object of type Namespace is not JSON serializable' },
      fix:   { label: 'json.dumps(vars(args))', code: "import argparse, json\nargs = argparse.Namespace(name='Ada', count=3)\njson.dumps(vars(args))", output: '\'{"name": "Ada", "count": 3}\'' },
    },
  ],

  when: {
    use: [
      'Reading parsed options: args.name',
      'Faking parse results in tests: Namespace(verbose=True)',
      "Presence checks with 'x' in args when defaults are SUPPRESS",
    ],
    avoid: [
      'Typed configuration objects → convert to a dataclass after parsing',
      'Hashing or using it as a dict key → it defines __eq__, so it is unhashable',
    ],
  },

  notes: {
    cpython:      'class Namespace(_AttributeHolder) in Lib/argparse.py: __init__ setattr()s each keyword, __eq__ compares vars(), __contains__ checks __dict__; the repr comes from _AttributeHolder',
    'Repr order': 'the order the attributes were set in — not alphabetical',
    'Hashing':    'defining __eq__ sets __hash__ to None: {args} raises TypeError: unhashable type: \'Namespace\'',
  },

  related: [
    { name: 'parse_args()', slug: 'parse_args', when: 'Returns a Namespace' },
    { name: 'argparse.SUPPRESS', slug: 'suppress', when: "Absent attributes and 'x' in args" },
    { name: 'set_defaults()', slug: 'set_defaults', when: 'Attributes that no argument sets' },
    { name: 'vars()', slug: 'vars', when: 'Namespace → dict', category: 'functions' },
    { name: 'getattr()', slug: 'getattr', when: 'Read a dest that is not an identifier', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I convert argparse args to a dict?',
      a: 'vars(args). It returns the Namespace\'s __dict__ — a real dict with one key per dest — so vars(args)["name"], json.dumps(vars(args)) and f(**vars(args)) all work.',
    },
    {
      q: 'How do I check whether an argument was given?',
      a: "Give it default=argparse.SUPPRESS; then the attribute exists only when the user passed it, and 'name' in args (or hasattr) answers the question. With a normal default you cannot tell \"given the default value\" from \"not given\".",
    },
    {
      q: 'Why does print(args) show Namespace(**{...})?',
      a: "Attributes whose names are not valid identifiers (for example dest='log-file') cannot be written as name=value, so the repr collects them in a **{...} dict. Read them with getattr(args, 'log-file').",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.Namespace',
    meta:  'argparse.Namespace',
  },

};
