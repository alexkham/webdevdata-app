// content/reference/python/stdlib/argparse/parse_known_args.js

// Demo tail: like the other pages, but calling parse_known_args.
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_known_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'parse_known_args',
  name:        'ArgumentParser.parse_known_args',
  signature:   'ArgumentParser.parse_known_args(args=None, namespace=None)',
  blurb:       'Like parse_args, but words the parser does not recognize are returned in a list instead of causing an error: (namespace, extras).',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse parse_known_args ArgumentParser.parse_known_args ignore unknown arguments pass through remaining arguments extras wrapper script forward arguments to another program partial parsing two-stage parsing unrecognized arguments',
};

export const method = {
  slug:      'parse_known_args',
  name:      'ArgumentParser.parse_known_args',
  signature: 'ArgumentParser.parse_known_args(args=None, namespace=None)',
  returns:   { type: 'tuple[Namespace, list[str]]', desc: 'The namespace and the list of words that no argument consumed, in command-line order.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "For wrappers and multi-stage parsing: take what you understand, hand the rest on. Unknown options and leftover values come back as the second item of the tuple. Everything else is unchanged — bad values, missing required arguments and -h still print and exit.",

  covers: ['ArgumentParser.parse_known_args'],

  cheat: {
    commonCall: 'args, rest = parser.parse_known_args()',
    returns:    "(Namespace(...), ['--unknown', 'value', ...])",
    replaces:   'filtering sys.argv by hand before parsing',
    watchOut:   'Prefix matching can swallow options meant for someone else',
  },

  parameters: [
    { name: 'args',      type: 'list[str] | None', required: false, default: 'None', desc: 'The words to parse; None means sys.argv[1:].' },
    { name: 'namespace', type: 'object | None',    required: false, default: 'None', desc: 'Object to set the attributes on; None creates a new Namespace.' },
  ],

  modes: [
    {
      id: 'known',
      label: 'a wrapper command',
      blurb: 'wrapper knows --timeout, -v and the command name; everything else is meant for the command. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='wrapper')\nparser.add_argument('--timeout', type=int, default=30)\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.add_argument('command')\n" + TAIL,
      cases: [
        { id: 'simple',  label: 'pytest -x -q',        values: { cmdline: 'pytest -x -q' } },
        { id: 'mixed',   label: 'with --timeout',      values: { cmdline: '--timeout 5 pytest -k slow' } },
        { id: 'abbrev',  label: 'pytest --verb',       values: { cmdline: 'pytest --verb' } },
        { id: 'value',   label: '--color red first',   values: { cmdline: '--color red pytest' } },
        { id: 'dash',    label: '-- pytest -v',        values: { cmdline: '-- pytest -v' } },
        { id: 'bad',     label: 'bad --timeout',       values: { cmdline: 'pytest --timeout x' } },
        { id: 'missing', label: 'nothing',             values: { cmdline: '' } },
      ],
    },
  ],
  demoExplainer: "Unknown options (-x, -q, -k) and the words after them go to the extras list. Two traps show up: --verb is a unique prefix of --verbose, so the wrapper takes it for itself; and the value of an unknown option is just a word, so in '--color red pytest' red becomes the command and pytest an extra. After -- nothing is an option, so -v is handed on. Errors about the wrapper's own arguments still exit with status 2.",

  patterns: [
    {
      name: 'Forward the rest to another program',
      desc: 'A wrapper that adds its own options in front of a command.',
      code: "import argparse, subprocess\nparser = argparse.ArgumentParser(allow_abbrev=False)\nparser.add_argument('--timeout', type=int, default=30)\nargs, rest = parser.parse_known_args()\nsubprocess.run(rest, timeout=args.timeout)",
    },
    {
      name: 'Two-stage parsing',
      desc: 'Read --config first, use it to set defaults, then parse everything.',
      code: "import argparse\npre = argparse.ArgumentParser(add_help=False)\npre.add_argument('--config')\nknown, remaining = pre.parse_known_args()\nparser = argparse.ArgumentParser(parents=[pre])\nparser.set_defaults(**load_config(known.config))\nparser.add_argument('--port', type=int)\nargs = parser.parse_args(remaining)",
    },
    {
      name: 'Collect unknown options for a plugin',
      desc: 'Let each component parse its own options from the same command line.',
      code: "args, rest = core_parser.parse_known_args(argv)\nplugin_args = plugin_parser.parse_args(rest)",
    },
  ],

  examples: [
    { title: 'Unknown words are returned, not rejected', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--verbose', action='store_true')\nparser.parse_known_args(['--verbose', '--color', 'red', 'file.txt'])", returns: "(Namespace(verbose=True), ['--color', 'red', 'file.txt'])" },
    { title: 'A wrapper keeps the command for later', code: "import argparse\nparser = argparse.ArgumentParser(prog='wrapper')\nparser.add_argument('--timeout', type=int, default=30)\nargs, rest = parser.parse_known_args(['--timeout', '5', 'pytest', '-x', '-q'])\n(args.timeout, rest)", returns: "(5, ['pytest', '-x', '-q'])" },
    { title: 'An unknown option\'s value can land in your positional', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('path')\nparser.parse_known_args(['--color', 'red', 'file.txt'])", returns: "(Namespace(path='red'), ['--color', 'file.txt'])" },
    { title: '--opt=value keeps the pair together', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('path')\nparser.parse_known_args(['--color=red', 'file.txt'])", returns: "(Namespace(path='file.txt'), ['--color=red'])" },
    { title: 'Bad values of known arguments still exit', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--count', type=int)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_known_args(['--count', 'x', '--other'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "app: error: argument --count: invalid int value: 'x'" },
    { title: 'Two-stage parsing', code: "import argparse\nfirst = argparse.ArgumentParser(add_help=False)\nfirst.add_argument('--config')\nconfig_args, remaining = first.parse_known_args(['--config', 'dev.toml', '--port', '80'])\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=int)\n(config_args.config, remaining, parser.parse_args(remaining))", returns: "('dev.toml', ['--port', '80'], Namespace(port=80))" },
  ],

  pitfalls: [
    {
      name: 'Abbreviations take options that were not yours',
      desc: 'With allow_abbrev=True (the default) an unknown --verb is matched to your --verbose instead of being passed on.',
      wrong: { label: 'allow_abbrev=True', code: "import argparse\nparser = argparse.ArgumentParser(prog='wrapper')\nparser.add_argument('--verbose', action='store_true')\nparser.parse_known_args(['--verb', 'pytest'])", output: "(Namespace(verbose=True), ['pytest'])" },
      fix:   { label: 'allow_abbrev=False', code: "import argparse\nparser = argparse.ArgumentParser(prog='wrapper', allow_abbrev=False)\nparser.add_argument('--verbose', action='store_true')\nparser.parse_known_args(['--verb', 'pytest'])", output: "(Namespace(verbose=False), ['--verb', 'pytest'])" },
    },
    {
      name: 'Unknown options with separate values',
      desc: 'argparse cannot know that an unknown option takes a value, so the value is treated as an ordinary word and may fill one of your positionals.',
      wrong: { label: '--color red', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('path')\nparser.parse_known_args(['--color', 'red', 'file.txt'])", output: "(Namespace(path='red'), ['--color', 'file.txt'])" },
      fix:   { label: '--color=red', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('path')\nparser.parse_known_args(['--color=red', 'file.txt'])", output: "(Namespace(path='file.txt'), ['--color=red'])" },
    },
  ],

  when: {
    use: [
      'Wrappers that pass most of the command line to another program',
      'Reading a few options early (config file, verbosity) before building the full parser',
      'Plugin systems where several parsers share one command line',
    ],
    avoid: [
      'Normal scripts → parse_args, so typos are reported',
      'Passing everything after a command verbatim → nargs=argparse.REMAINDER or -- on the command line',
    ],
  },

  notes: {
    cpython:       '_parse_known_args2 → _parse_known_args; parse_args is parse_known_args plus "unrecognized arguments" for a non-empty extras list. Subparsers use it internally and pass their extras back up',
    'Order':       'extras keep their command-line order, but positional values a parser consumed are taken out wherever they were',
    'Intermixed':  'parse_known_intermixed_args is the intermixed variant with the same return shape',
  },

  related: [
    { name: 'parse_args()', slug: 'parse_args', when: 'The strict version' },
    { name: 'parse_intermixed_args()', slug: 'parse_intermixed_args', when: 'parse_known_intermixed_args' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'allow_abbrev=False' },
    { name: 'nargs', slug: 'nargs', when: 'REMAINDER: keep everything after a word' },
    { name: 'subprocess module', slug: 'subprocess', when: 'Run the program you forward to', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I ignore unknown arguments in argparse?',
      a: 'Call args, unknown = parser.parse_known_args() instead of parse_args(). unknown is the list of words no argument used, so you can pass them on or warn about them.',
    },
    {
      q: 'Why did parse_known_args consume an option I wanted to keep?',
      a: 'Prefix matching: --verb matches --verbose. Create the parser with allow_abbrev=False when the leftovers belong to another program.',
    },
    {
      q: 'Does parse_known_args still exit on errors?',
      a: 'Yes, for problems with the arguments it knows: invalid values, missing required arguments, ambiguous prefixes. Only unrecognized words are returned instead of reported. -h also still prints help and exits.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.parse_known_args',
    meta:  'ArgumentParser.parse_known_args',
  },

};
