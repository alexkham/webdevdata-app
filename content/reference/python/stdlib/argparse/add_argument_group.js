// content/reference/python/stdlib/argparse/add_argument_group.js

const PARSER = "parser = argparse.ArgumentParser(prog='upload', description='Upload files to a server.')\nparser.add_argument('files', nargs='+', help='files to upload')\nnet = parser.add_argument_group('network', 'Where and how to connect.')\nnet.add_argument('--host', default='localhost', help='server name (default: %(default)s)')\nnet.add_argument('--port', type=int, default=8080, help='server port')\nout = parser.add_argument_group('output')\nout.add_argument('-q', '--quiet', action='store_true', help='print nothing')\n";

// Demo tail of the parse tab: parse the reader's command line with COLUMNS
// fixed at 60, capture what the program prints, turn SystemExit into
// (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'add_argument_group',
  name:        'ArgumentParser.add_argument_group',
  signature:   'ArgumentParser.add_argument_group(title=None, description=None, *, argument_default, conflict_handler)',
  blurb:       'Create a titled section of the -h output. Arguments added to the group are parsed exactly like the others; only the help layout changes.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse add_argument_group ArgumentParser.add_argument_group argument group help sections group options in help title description required arguments section organize help output _ArgumentGroup nested groups deprecated',
};

export const method = {
  slug:      'add_argument_group',
  name:      'ArgumentParser.add_argument_group',
  signature: 'ArgumentParser.add_argument_group(title=None, description=None, *, argument_default, conflict_handler)',
  returns:   { type: '_ArgumentGroup', desc: 'A group with its own add_argument() (and add_mutually_exclusive_group()); .title and .description hold what you passed.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "By default -h lists \"positional arguments\" and \"options\". Each argument group adds another section with its own title and an optional description, in the order the groups were created. The Namespace stays flat: a group does not nest attributes, make options exclusive or give them their own option strings.",

  // defined on argparse's private _ActionsContainer base class, so not a
  // name of ArgumentParser itself
  covers: [],

  cheat: {
    commonCall: "net = parser.add_argument_group('network', 'Where to connect.')\nnet.add_argument('--host')",
    returns:    'an _ArgumentGroup; use its add_argument like the parser\'s',
    replaces:   'one long undifferentiated "options" list',
    watchOut:   'Help layout only: args.network.host does not exist',
  },

  parameters: [
    { name: 'title',            type: 'str',    required: false, default: 'None',   desc: 'Section heading, printed as "title:".' },
    { name: 'description',      type: 'str',    required: false, default: 'None',   desc: 'Text under the heading, re-wrapped to the terminal width like the parser description.' },
    { name: 'argument_default', type: 'object', required: false, default: 'parser\'s', desc: 'Default for arguments of this group that set none; argparse.SUPPRESS leaves them out of the Namespace when absent.' },
    { name: 'conflict_handler', type: 'str',    required: false, default: 'parser\'s', desc: "'resolve' lets a later add_argument in this group take over an option string." },
  ],

  modes: [
    {
      id: 'help',
      label: 'help with groups',
      blurb: 'The upload parser has a "network" group with a description and an "output" group. Pick the terminal width (COLUMNS, kept between 1 and 300).',
      params: [{ name: 'columns', type: 'int', hint: 'terminal width in columns', input: 'number' }],
      template: "import argparse, os\n" + PARSER + "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = str(min(max({$columns}, 1), 300))  # read first by shutil.get_terminal_size()\ntry:\n    result = parser.format_help().splitlines()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult",
      cases: [
        { id: 'w80', label: '80 columns', values: { columns: '80' } },
        { id: 'w50', label: '50 columns', values: { columns: '50' } },
        { id: 'w30', label: '30 columns', values: { columns: '30' } },
      ],
    },
    {
      id: 'parse',
      label: 'parsing ignores groups',
      blurb: 'The same parser on a command line: every argument lands directly in the Namespace.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\n" + PARSER + TAIL,
      cases: [
        { id: 'plain',  label: 'one file',           values: { cmdline: 'notes.txt' } },
        { id: 'net',    label: '--host and --port',  values: { cmdline: 'a.txt b.txt --host example.com --port 21 -q' } },
        { id: 'badport', label: '--port ftp',        values: { cmdline: 'a.txt --port ftp' } },
        { id: 'help',   label: '-h',                 values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "Groups are printed after the two built-in sections, in creation order, each with its title, then its description, then its arguments. All sections share one help column, so --host HOST and -q, --quiet line up. A built-in section with nothing in it is left out, and so is a group with neither arguments nor a description. Parsing does not see the groups at all: host, port and quiet sit next to files in the Namespace, and an error message names the option, not the group.",

  patterns: [
    {
      name: 'A "required arguments" section',
      desc: 'Required options are listed under "options" by default; a group gives them their own heading.',
      code: "required = parser.add_argument_group('required arguments')\nrequired.add_argument('--token', required=True, help='API token')",
    },
    {
      name: 'Collect one group\'s values',
      desc: 'add_argument returns the Action; keep the ones of a group to pick their values out of the flat Namespace.',
      code: "net = parser.add_argument_group('network')\nnet_actions = [net.add_argument('--host'), net.add_argument('--port', type=int)]\nargs = parser.parse_args()\nnetwork = {a.dest: getattr(args, a.dest) for a in net_actions}",
    },
    {
      name: 'Exclusive choices with a heading',
      desc: 'A mutually exclusive group has no title of its own, but it can live inside an argument group.',
      code: "fmt = parser.add_argument_group('output format').add_mutually_exclusive_group()\nfmt.add_argument('--json', action='store_true')\nfmt.add_argument('--csv', action='store_true')",
    },
  ],

  examples: [
    { title: 'A titled section in -h (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('src', help='file to read')\nnet = parser.add_argument_group('network', 'Settings for the upload step.')\nnet.add_argument('--host', default='localhost', help='server name')\nnet.add_argument('--port', type=int, default=8080, help='server port')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: "usage: app [-h] [--host HOST] [--port PORT] src\n\npositional arguments:\n  src          file to read\n\noptions:\n  -h, --help   show this help message and exit\n\nnetwork:\n  Settings for the upload step.\n\n  --host HOST  server name\n  --port PORT  server port" },
    { title: 'The Namespace stays flat', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nnet = parser.add_argument_group('network')\nnet.add_argument('--host', default='localhost')\nparser.add_argument('--verbose', action='store_true')\nparser.parse_args(['--host', 'example.com'])", returns: "Namespace(host='example.com', verbose=False)" },
    { title: 'The group object', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_argument_group('network', 'Where to connect.')\n(type(group).__name__, group.title, group.description)", returns: "('_ArgumentGroup', 'network', 'Where to connect.')" },
    { title: 'A "required arguments" section', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\nrequired = parser.add_argument_group('required arguments')\nrequired.add_argument('--token', required=True, help='API token')\nparser.add_argument('--retries', type=int, default=3, help='attempts before giving up')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: "usage: app [-h] --token TOKEN [--retries RETRIES]\n\noptions:\n  -h, --help         show this help message and exit\n  --retries RETRIES  attempts before giving up\n\nrequired arguments:\n  --token TOKEN      API token" },
    { title: 'argument_default=SUPPRESS for one group', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_argument_group('legacy', argument_default=argparse.SUPPRESS)\ngroup.add_argument('--old-name')\nparser.add_argument('--new-name')\n(parser.parse_args([]), parser.parse_args(['--old-name', 'x']))", returns: "(Namespace(new_name=None), Namespace(new_name=None, old_name='x'))" },
    { title: 'An exclusive group inside a titled group', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='app')\noutput = parser.add_argument_group('output format', 'Pick at most one.')\nfmt = output.add_mutually_exclusive_group()\nfmt.add_argument('--json', action='store_true', help='write JSON')\nfmt.add_argument('--csv', action='store_true', help='write CSV')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: "usage: app [-h] [--json | --csv]\n\noptions:\n  -h, --help  show this help message and exit\n\noutput format:\n  Pick at most one.\n\n  --json      write JSON\n  --csv       write CSV" },
    { title: 'Nesting groups is deprecated (3.11+)', code: "import argparse, warnings\nparser = argparse.ArgumentParser(prog='app')\nouter = parser.add_argument_group('outer')\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    inner = outer.add_argument_group('inner')\n(caught[0].category.__name__, str(caught[0].message))", returns: "('DeprecationWarning', 'Nesting argument groups is deprecated.')" },
  ],

  pitfalls: [
    {
      name: 'Expecting nested attributes',
      desc: 'The group title is only a heading. Values are stored on the Namespace by dest, exactly as without the group.',
      wrong: { label: 'args.network.host', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nnet = parser.add_argument_group('network')\nnet.add_argument('--host', default='localhost')\nargs = parser.parse_args([])\nargs.network.host", output: "AttributeError: 'Namespace' object has no attribute 'network'" },
      fix:   { label: 'keep the actions', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nnet = parser.add_argument_group('network')\nnetwork_args = [net.add_argument('--host', default='localhost'), net.add_argument('--port', type=int, default=80)]\nargs = parser.parse_args(['--port', '8080'])\n{a.dest: getattr(args, a.dest) for a in network_args}", output: "{'host': 'localhost', 'port': 8080}" },
    },
    {
      name: 'Using a group to make options exclusive',
      desc: 'An argument group allows any combination of its arguments. For "at most one of these" use add_mutually_exclusive_group().',
      wrong: { label: 'add_argument_group', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nmode = parser.add_argument_group('mode')\nmode.add_argument('--fast', action='store_true')\nmode.add_argument('--safe', action='store_true')\nparser.parse_args(['--fast', '--safe'])", output: 'Namespace(fast=True, safe=True)' },
      fix:   { label: 'add_mutually_exclusive_group', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nmode = parser.add_mutually_exclusive_group()\nmode.add_argument('--fast', action='store_true')\nmode.add_argument('--safe', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--fast', '--safe'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: argument --safe: not allowed with argument --fast' },
    },
    {
      name: 'The same option string in two groups',
      desc: 'All groups share the parser\'s option strings, so a group cannot reuse a name another group or the parser already has.',
      wrong: { label: '--port twice', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_argument_group('network')\ngroup.add_argument('--port', type=int)\nparser.add_argument('--port')", output: 'argparse.ArgumentError: argument --port: conflicting option string: --port' },
      fix:   { label: 'distinct names', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_argument_group('network')\ngroup.add_argument('--port', type=int)\nparser.add_argument('--admin-port', type=int)\nparser.parse_args(['--port', '80', '--admin-port', '81'])", output: 'Namespace(port=80, admin_port=81)' },
    },
  ],

  when: {
    use: [
      'Parsers with many options: group them by topic in -h',
      'Separating required options from optional ones in the help',
      'Giving a mutually exclusive group a heading and description',
    ],
    avoid: [
      '"Only one of these" → add_mutually_exclusive_group()',
      'Separate option sets per command → add_subparsers()',
      'Nested Namespaces → build them yourself after parsing',
    ],
  },

  notes: {
    cpython:       "_ArgumentGroup shares the parser's _actions list, option-string table, registries and defaults; it only keeps its own _group_actions for the help. The parser's \"positional arguments\" and \"options\" sections are argument groups too (parser._positionals, parser._optionals)",
    'Headings':    'the second built-in heading was "optional arguments" until 3.9 and is "options" since 3.10',
    'Deprecation': 'calling add_argument_group() on a group, or add_argument_group() / add_mutually_exclusive_group() on a mutually exclusive group, has been deprecated since 3.11 (a DeprecationWarning in 3.13) and raises an exception since 3.14',
    'Empty groups': 'a group with no arguments is printed only when it has a description',
  },

  related: [
    { name: 'add_mutually_exclusive_group()', slug: 'add_mutually_exclusive_group', when: 'Arguments that cannot be combined' },
    { name: 'format_help()', slug: 'format_help', when: 'The full help text and its width rules' },
    { name: 'HelpFormatter', slug: 'helpformatter', when: 'Change how each section is laid out' },
    { name: 'add_argument()', slug: 'add_argument', when: 'What you call on the group' },
    { name: 'add_subparsers()', slug: 'add_subparsers', when: 'title= puts the commands in their own group' },
  ],

  faq: [
    {
      q: 'How do I group options in the argparse help output?',
      a: "group = parser.add_argument_group('title', 'optional description'), then group.add_argument(...) for each option that belongs there. The group becomes its own section in -h; parsing is unchanged.",
    },
    {
      q: 'How do I show required options in their own section?',
      a: "Required options appear under \"options\" by default. Create required = parser.add_argument_group('required arguments') and add them with required.add_argument('--token', required=True).",
    },
    {
      q: 'Can I get the arguments of one group as a separate Namespace?',
      a: 'Not directly: groups only affect help, and parse_args returns one flat Namespace. Keep the Action objects that group.add_argument returns and collect {a.dest: getattr(args, a.dest) for a in actions}.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_argument_group',
    meta:  'ArgumentParser.add_argument_group',
  },

};
