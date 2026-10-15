// content/reference/python/stdlib/argparse/helpformatter.js

const HELP_TAIL = "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved";

export const meta = {
  slug:        'helpformatter',
  name:        'argparse.HelpFormatter',
  signature:   'ArgumentParser(formatter_class=HelpFormatter | RawDescriptionHelpFormatter | RawTextHelpFormatter | ArgumentDefaultsHelpFormatter | MetavarTypeHelpFormatter)',
  blurb:       'The five formatter classes you can pass as formatter_class=: the default re-wrapping layout, two that keep your line breaks, one that appends defaults, and one that names values by their type.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+ (MetavarTypeHelpFormatter 3.3)',
  searchTerms: 'argparse HelpFormatter RawDescriptionHelpFormatter RawTextHelpFormatter ArgumentDefaultsHelpFormatter MetavarTypeHelpFormatter formatter_class help formatting keep newlines in help argparse multiline description show default values in help max_help_position width help column argparse help format',
};

export const method = {
  slug:      'helpformatter',
  name:      'argparse.HelpFormatter',
  signature: 'ArgumentParser(formatter_class=HelpFormatter | RawDescriptionHelpFormatter | RawTextHelpFormatter | ArgumentDefaultsHelpFormatter | MetavarTypeHelpFormatter)',
  returns:   { type: 'type', desc: 'You pass the class (or a callable taking prog); the parser creates a fresh formatter every time it builds help or usage text.' },

  category:    'argparse classes',
  version:     'Python 3.2+ (MetavarTypeHelpFormatter 3.3)',
  hasLiveDemo: true,

  subtitle: "HelpFormatter collapses every run of whitespace in description, epilog and help strings and re-wraps the text to the terminal width. RawDescriptionHelpFormatter keeps the line breaks of description and epilog; RawTextHelpFormatter keeps them in argument help too; ArgumentDefaultsHelpFormatter adds \"(default: ...)\"; MetavarTypeHelpFormatter shows the type's name (int, str) as the value placeholder. Only the class names are public — their methods are implementation details.",

  covers: ['HelpFormatter', 'RawDescriptionHelpFormatter', 'RawTextHelpFormatter', 'ArgumentDefaultsHelpFormatter', 'MetavarTypeHelpFormatter'],

  cheat: {
    commonCall: 'argparse.ArgumentParser(formatter_class=argparse.RawDescriptionHelpFormatter)',
    returns:    'help text laid out by that class',
    replaces:   'hand-written usage strings with manual line breaks',
    watchOut:   'Pass the class, not an instance; every width depends on the terminal',
  },

  parameters: [
    { name: 'prog',              type: 'str', required: true,  default: null,   desc: 'Filled in by the parser: formatter_class(prog=parser.prog).' },
    { name: 'indent_increment',  type: 'int', required: false, default: '2',    desc: 'Spaces added per section level.' },
    { name: 'max_help_position', type: 'int', required: false, default: '24',   desc: 'Column where help text starts at most; longer invocations put their help on the next line.' },
    { name: 'width',             type: 'int', required: false, default: 'None', desc: 'Line width. None means shutil.get_terminal_size().columns - 2 — the COLUMNS environment variable, else the terminal, else 80.' },
  ],

  attributes: [
    { name: 'HelpFormatter',                 type: 'default', meaning: 'Re-wraps description, epilog and help text; collapses whitespace and newlines' },
    { name: 'RawDescriptionHelpFormatter',   type: 'subclass', meaning: 'description and epilog (and group descriptions) printed line by line as written' },
    { name: 'RawTextHelpFormatter',          type: 'subclass', meaning: 'Like RawDescription, and argument help keeps its line breaks too' },
    { name: 'ArgumentDefaultsHelpFormatter', type: 'subclass', meaning: 'Appends " (default: %(default)s)" to help of options and of ?/* positionals, unless the help already mentions %(default) or the default is SUPPRESS' },
    { name: 'MetavarTypeHelpFormatter',      type: 'subclass', meaning: 'Default metavar is type.__name__ (int, float, str); every value-taking argument needs a type=' },
  ],

  modes: [
    {
      id: 'style',
      label: 'compare formatters',
      blurb: "The same parser printed with each formatter class. Type one of: plain, raw description, raw text, defaults, metavar type.",
      params: [{ name: 'style', type: 'str', hint: 'a key of formatters', input: 'text' }],
      template: "import argparse, os\nformatters = {\n    'plain': argparse.HelpFormatter,\n    'raw description': argparse.RawDescriptionHelpFormatter,\n    'raw text': argparse.RawTextHelpFormatter,\n    'defaults': argparse.ArgumentDefaultsHelpFormatter,\n    'metavar type': argparse.MetavarTypeHelpFormatter,\n}\nparser = argparse.ArgumentParser(\n    prog='app',\n    formatter_class=formatters[{$style}],\n    description='Resize images.\\n\\nExamples:\\n  app photo.jpg --width 640\\n  app *.png --ratio 0.5',\n)\nparser.add_argument('files', nargs='+', type=str, help='images to resize')\nparser.add_argument('--width', type=int, default=800, help='target width in pixels;\\nthe height follows the aspect ratio')\nparser.add_argument('--ratio', type=float, help='scale factor instead of a width')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    result = parser.format_help().splitlines()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult",
      cases: [
        { id: 'plain',    label: 'plain',           values: { style: 'plain' } },
        { id: 'rawdesc',  label: 'raw description', values: { style: 'raw description' } },
        { id: 'rawtext',  label: 'raw text',        values: { style: 'raw text' } },
        { id: 'defaults', label: 'defaults',        values: { style: 'defaults' } },
        { id: 'metavar',  label: 'metavar type',    values: { style: 'metavar type' } },
        { id: 'unknown',  label: 'unknown key',     values: { style: 'fancy' } },
      ],
    },
  ],
  demoExplainer: "plain runs the whole description together (\"Resize images. Examples: app photo.jpg ...\") and joins the two lines of --width's help. raw description keeps the description exactly as written but still re-wraps argument help; raw text keeps both. defaults adds (default: 800) to --width and (default: None) to --ratio — but nothing to files, a + positional. metavar type replaces FILES/WIDTH/RATIO with str, int and float. The width is fixed at 60 columns here; with the real terminal width every layout changes.",

  patterns: [
    {
      name: 'Examples in the epilog',
      desc: 'RawDescriptionHelpFormatter keeps your indentation; argument help is still wrapped.',
      code: "import argparse\nparser = argparse.ArgumentParser(\n    formatter_class=argparse.RawDescriptionHelpFormatter,\n    epilog='examples:\\n  app build --release\\n  app test -k parser',\n)",
    },
    {
      name: 'Defaults and raw descriptions together',
      desc: 'The formatter classes are mixins: combine them by inheritance.',
      code: "import argparse\n\nclass Formatter(argparse.ArgumentDefaultsHelpFormatter, argparse.RawDescriptionHelpFormatter):\n    pass\n\nparser = argparse.ArgumentParser(formatter_class=Formatter)",
    },
    {
      name: 'A fixed width or a wider help column',
      desc: 'formatter_class only has to be a callable that takes prog.',
      code: "import argparse\nparser = argparse.ArgumentParser(\n    formatter_class=lambda prog: argparse.HelpFormatter(prog, max_help_position=40, width=100),\n)",
    },
  ],

  examples: [
    { title: 'RawDescriptionHelpFormatter: description kept, help re-wrapped', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.RawDescriptionHelpFormatter, description='Steps:\\n  1. read\\n  2. write')\nparser.add_argument('--mode', help='one of:\\n  fast\\n  safe')\n" + HELP_TAIL, returns: 'usage: app [-h] [--mode MODE]\n\nSteps:\n  1. read\n  2. write\n\noptions:\n  -h, --help   show this help message and exit\n  --mode MODE  one of: fast safe' },
    { title: 'RawTextHelpFormatter keeps help line breaks too', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.RawTextHelpFormatter, description='Steps:\\n  1. read\\n  2. write')\nparser.add_argument('--mode', help='one of:\\n  fast\\n  safe')\n" + HELP_TAIL, returns: 'usage: app [-h] [--mode MODE]\n\nSteps:\n  1. read\n  2. write\n\noptions:\n  -h, --help   show this help message and exit\n  --mode MODE  one of:\n                 fast\n                 safe' },
    { title: 'ArgumentDefaultsHelpFormatter: where defaults appear', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.ArgumentDefaultsHelpFormatter)\nparser.add_argument('src', help='input file')\nparser.add_argument('dst', nargs='?', default='out.txt', help='output file')\nparser.add_argument('--level', type=int, default=3, help='compression level')\nparser.add_argument('--name')\nparser.add_argument('--tag', default=argparse.SUPPRESS, help='optional tag')\n" + HELP_TAIL, returns: 'usage: app [-h] [--level LEVEL] [--name NAME] [--tag TAG]\n           src [dst]\n\npositional arguments:\n  src            input file\n  dst            output file (default: out.txt)\n\noptions:\n  -h, --help     show this help message and exit\n  --level LEVEL  compression level (default: 3)\n  --name NAME\n  --tag TAG      optional tag' },
    { title: 'MetavarTypeHelpFormatter names values by type', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.MetavarTypeHelpFormatter)\nparser.add_argument('count', type=int)\nparser.add_argument('--ratio', type=float, default=0.5)\nparser.add_argument('--name', type=str)\n" + HELP_TAIL, returns: 'usage: app [-h] [--ratio float] [--name str] int\n\npositional arguments:\n  int\n\noptions:\n  -h, --help     show this help message and exit\n  --ratio float\n  --name str' },
    { title: 'Combine two formatters by inheritance', code: "import argparse\n\nclass Formatter(argparse.ArgumentDefaultsHelpFormatter, argparse.RawDescriptionHelpFormatter):\n    pass\n\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: Formatter(prog, width=60), description='Usage notes:\\n  - one\\n  - two')\nparser.add_argument('--level', type=int, default=3, help='compression level')\nprint(parser.format_help())", returns: 'usage: app [-h] [--level LEVEL]\n\nUsage notes:\n  - one\n  - two\n\noptions:\n  -h, --help     show this help message and exit\n  --level LEVEL  compression level (default: 3)' },
    { title: 'A lambda sets width and max_help_position', code: "import argparse\nparser = argparse.ArgumentParser(\n    prog='app',\n    formatter_class=lambda prog: argparse.HelpFormatter(prog, max_help_position=40, width=70),\n)\nparser.add_argument('--output-directory', metavar='DIR', help='where results are written')\nparser.add_argument('-v', '--verbose', action='store_true', help='print every step')\nprint(parser.format_help())", returns: 'usage: app [-h] [--output-directory DIR] [-v]\n\noptions:\n  -h, --help              show this help message and exit\n  --output-directory DIR  where results are written\n  -v, --verbose           print every step' },
    { title: 'RawTextHelpFormatter is a RawDescriptionHelpFormatter', code: 'import argparse\nissubclass(argparse.RawTextHelpFormatter, argparse.RawDescriptionHelpFormatter), [c.__name__ for c in argparse.ArgumentDefaultsHelpFormatter.__mro__]', returns: "(True, ['ArgumentDefaultsHelpFormatter', 'HelpFormatter', 'object'])" },
  ],

  pitfalls: [
    {
      name: 'Expecting newlines in a description to survive',
      desc: 'The default formatter collapses all whitespace, newlines included, and re-wraps.',
      wrong: { label: 'HelpFormatter', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60), description='Steps:\\n  1. read\\n  2. write')\nprint(parser.format_help())", output: 'usage: app [-h]\n\nSteps: 1. read 2. write\n\noptions:\n  -h, --help  show this help message and exit' },
      fix:   { label: 'RawDescriptionHelpFormatter', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.RawDescriptionHelpFormatter(prog, width=60), description='Steps:\\n  1. read\\n  2. write')\nprint(parser.format_help())", output: 'usage: app [-h]\n\nSteps:\n  1. read\n  2. write\n\noptions:\n  -h, --help  show this help message and exit' },
    },
    {
      name: 'Passing a formatter instance',
      desc: 'formatter_class must be callable with prog=. An instance is not, and the TypeError surfaces as a misleading metavar error while ArgumentParser adds -h.',
      wrong: { label: 'HelpFormatter(prog=...)', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.HelpFormatter(prog='app'))", output: 'ValueError: length of metavar tuple does not match nargs' },
      fix:   { label: 'the class (or a lambda)', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.HelpFormatter)\nparser.format_usage()", output: "'usage: app [-h]\\n'" },
    },
    {
      name: 'MetavarTypeHelpFormatter with an argument that has no type',
      desc: 'The formatter reads type.__name__, and type=None has none. add_argument does not notice; the error appears when help or a usage error is printed.',
      wrong: { label: 'no type=', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.MetavarTypeHelpFormatter)\nparser.add_argument('--name')\nparser.format_help()", output: "AttributeError: 'NoneType' object has no attribute '__name__'. Did you mean: '__ne__'?" },
      fix:   { label: 'type=str', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=argparse.MetavarTypeHelpFormatter)\nparser.add_argument('--name', type=str)\nparser.format_usage()", output: "'usage: app [-h] [--name str]\\n'" },
    },
  ],

  when: {
    use: [
      'Multi-line descriptions and example sections → RawDescriptionHelpFormatter',
      'Help strings that are tables or lists → RawTextHelpFormatter',
      'Showing every default without writing %(default)s → ArgumentDefaultsHelpFormatter',
    ],
    avoid: [
      'RawTextHelpFormatter for normal prose — long lines are no longer wrapped',
      'Subclassing to change layout details — the methods are not public API and change between versions',
    ],
  },

  notes: {
    cpython:        'class HelpFormatter in Lib/argparse.py; the subclasses override one or two methods each: _fill_text (RawDescription), _split_lines (RawText), _get_help_string (ArgumentDefaults), _get_default_metavar_for_optional/_positional (MetavarType)',
    'Width':        'width=None means shutil.get_terminal_size().columns - 2: COLUMNS wins, then the terminal, then the 80-column fallback. Help printed into a pipe or a test therefore uses COLUMNS or 80',
    'Help column':  'help starts at min(longest invocation + 2, max_help_position), and max_help_position is capped at max(width - 20, 2 * indent_increment)',
    'Python 3.14':  'help output is colored when the terminal supports it (ArgumentParser(color=...))',
  },

  related: [
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'formatter_class= and description=' },
    { name: 'format_help()', slug: 'format_help', when: 'Print or get the help text' },
    { name: 'add_argument()', slug: 'add_argument', when: 'help= and %(default)s' },
    { name: 'add_argument_group()', slug: 'add_argument_group', when: 'Sections with their own description' },
    { name: 'textwrap module', slug: 'textwrap', when: 'What wraps the text', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I keep newlines in argparse help?',
      a: 'formatter_class=argparse.RawDescriptionHelpFormatter keeps line breaks in description and epilog; RawTextHelpFormatter keeps them in argument help as well. The default HelpFormatter collapses whitespace and re-wraps everything.',
    },
    {
      q: 'How do I show default values in argparse help?',
      a: 'Either write "(default: %(default)s)" in each help string, or use formatter_class=argparse.ArgumentDefaultsHelpFormatter, which appends it for every option that has help text and a default other than SUPPRESS.',
    },
    {
      q: 'How do I change the width of argparse help?',
      a: 'Pass a callable: formatter_class=lambda prog: argparse.HelpFormatter(prog, width=100, max_help_position=40). Without it the width follows the COLUMNS environment variable or the terminal size.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#formatter-class',
    meta:  'formatter_class',
  },

};
