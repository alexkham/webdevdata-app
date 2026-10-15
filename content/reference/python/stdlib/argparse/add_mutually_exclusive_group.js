// content/reference/python/stdlib/argparse/add_mutually_exclusive_group.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'add_mutually_exclusive_group',
  name:        'ArgumentParser.add_mutually_exclusive_group',
  signature:   'ArgumentParser.add_mutually_exclusive_group(*, required=False)',
  blurb:       'Declare arguments that cannot be used together: argparse rejects a command line that gives two of them, and with required=True one that gives none.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse add_mutually_exclusive_group ArgumentParser.add_mutually_exclusive_group mutually exclusive options not allowed with argument one of the arguments is required either or option conflicting options verbose quiet exclusive flags _MutuallyExclusiveGroup',
};

export const method = {
  slug:      'add_mutually_exclusive_group',
  name:      'ArgumentParser.add_mutually_exclusive_group',
  signature: 'ArgumentParser.add_mutually_exclusive_group(*, required=False)',
  returns:   { type: '_MutuallyExclusiveGroup', desc: 'A group with its own add_argument(); .required is the flag you passed.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Arguments added to the group are ordinary arguments with one extra rule: at most one of them may appear on the command line (exactly one with required=True). Breaking the rule is a normal usage error, \"argument --b: not allowed with argument --a\", and the usage line shows the group as [--a | --b], or (--a | --b) when required.",

  // defined on argparse's private _ActionsContainer base class, so not a
  // name of ArgumentParser itself
  covers: [],

  cheat: {
    commonCall: "group = parser.add_mutually_exclusive_group()\ngroup.add_argument('-v', '--verbose', action='store_true')\ngroup.add_argument('-q', '--quiet', action='store_true')",
    returns:    'a _MutuallyExclusiveGroup; add the competing arguments to it',
    replaces:   'if args.verbose and args.quiet: parser.error(...)',
    watchOut:   'Members must be optional: no required=True, positionals only with nargs=\'?\' or \'*\'',
  },

  parameters: [
    { name: 'required', type: 'bool', required: false, default: 'False', desc: 'Demand exactly one member: an empty command line fails with "one of the arguments ... is required". Keyword-only.' },
  ],

  modes: [
    {
      id: 'verbosity',
      label: '-v or -q',
      blurb: 'More output or none, never both. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('file')\nlevel = parser.add_mutually_exclusive_group()\nlevel.add_argument('-v', '--verbose', action='count', default=0, help='more output (repeatable)')\nlevel.add_argument('-q', '--quiet', action='store_true', help='no output')\n" + TAIL,
      cases: [
        { id: 'none',   label: 'data.csv',          values: { cmdline: 'data.csv' } },
        { id: 'vv',     label: 'data.csv -vv',      values: { cmdline: 'data.csv -vv' } },
        { id: 'quiet',  label: '-q data.csv',       values: { cmdline: '-q data.csv' } },
        { id: 'both',   label: '-v -q data.csv',    values: { cmdline: '-v -q data.csv' } },
        { id: 'packed', label: '-vq data.csv',      values: { cmdline: '-vq data.csv' } },
        { id: 'help',   label: '-h',                values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'required',
      label: 'required=True',
      blurb: 'Exactly one destination: a file, the terminal, or a URL given as an optional positional. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='export')\ntarget = parser.add_mutually_exclusive_group(required=True)\ntarget.add_argument('-o', '--output', metavar='PATH', help='write to a file')\ntarget.add_argument('--stdout', action='store_true', help='write to the terminal')\ntarget.add_argument('url', nargs='?', help='upload to this URL')\n" + TAIL,
      cases: [
        { id: 'none',    label: 'nothing',                    values: { cmdline: '' } },
        { id: 'stdout',  label: '--stdout',                   values: { cmdline: '--stdout' } },
        { id: 'file',    label: '-o out.json',                values: { cmdline: '-o out.json' } },
        { id: 'two',     label: '-o out.json --stdout',       values: { cmdline: '-o out.json --stdout' } },
        { id: 'url',     label: 'a URL',                      values: { cmdline: 'https://example.com/upload' } },
        { id: 'urlopt',  label: 'a URL and --stdout',         values: { cmdline: 'https://example.com/upload --stdout' } },
      ],
    },
  ],
  demoExplainer: "The second member seen is the one reported: -v -q gives \"argument -q/--quiet: not allowed with argument -v/--verbose\", and packing them as -vq changes nothing. Repeating the same member is fine, which is why -vv counts to 2. In the usage line the group is [-v | -q]. In the required tab an empty command line fails with \"one of the arguments -o/--output --stdout url is required\", and the usage shows (-o PATH | --stdout | url). The positional url can join the group only because nargs='?' makes it optional; when it gets no word it does not count as used.",

  patterns: [
    {
      name: 'Verbose or quiet',
      desc: 'The classic pair from the argparse tutorial.',
      code: "group = parser.add_mutually_exclusive_group()\ngroup.add_argument('-v', '--verbose', action='count', default=0)\ngroup.add_argument('-q', '--quiet', action='store_true')",
    },
    {
      name: 'One setting, several spellings',
      desc: 'Members writing the same dest with store_const give one attribute instead of a flag per choice.',
      code: "fmt = parser.add_mutually_exclusive_group()\nfmt.add_argument('--json', dest='format', action='store_const', const='json')\nfmt.add_argument('--csv', dest='format', action='store_const', const='csv')\nparser.set_defaults(format='table')",
    },
    {
      name: 'A titled exclusive section in -h',
      desc: 'The group itself has no title; put it inside an argument group.',
      code: "section = parser.add_argument_group('input', 'Read from a file or from standard input.')\nsource = section.add_mutually_exclusive_group(required=True)\nsource.add_argument('--file')\nsource.add_argument('--stdin', action='store_true')",
    },
  ],

  examples: [
    { title: 'Two members on one command line', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('--foo', action='store_true')\ngroup.add_argument('--bar', action='store_false')\nprint(parser.parse_args(['--foo']))\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--foo', '--bar'])\nexcept SystemExit:\n    print(err.getvalue(), end='')", returns: "Namespace(foo=True, bar=True)\nusage: app [-h] [--foo | --bar]\napp: error: argument --bar: not allowed with argument --foo" },
    { title: 'required=True: one of them must be given', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group(required=True)\ngroup.add_argument('--json', action='store_true')\ngroup.add_argument('--csv', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args([])\nexcept SystemExit:\n    print(err.getvalue(), end='')", returns: "usage: app [-h] (--json | --csv)\napp: error: one of the arguments --json --csv is required" },
    { title: 'Brackets and parentheses in the usage', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\na = parser.add_mutually_exclusive_group()\na.add_argument('--json', action='store_true')\na.add_argument('--csv', action='store_true')\nb = parser.add_mutually_exclusive_group(required=True)\nb.add_argument('--fast', action='store_true')\nb.add_argument('--safe', action='store_true')\nparser.format_usage()", returns: "'usage: app [-h] [--json | --csv] (--fast | --safe)\\n'" },
    { title: "A positional member needs nargs='?' or '*'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('--file')\ngroup.add_argument('text', nargs='?')\n(parser.parse_args(['hello']), parser.parse_args(['--file', 'a.txt']))", returns: "(Namespace(file=None, text='hello'), Namespace(file='a.txt', text=None))" },
    { title: 'A required positional cannot join', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('text')", returns: 'ValueError: mutually exclusive arguments must be optional' },
    { title: 'Repeating one member is allowed', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('-v', '--verbose', action='count', default=0)\ngroup.add_argument('-q', '--quiet', action='store_true')\nparser.parse_args(['-v', '-v', '--verbose'])", returns: 'Namespace(verbose=3, quiet=False)' },
    { title: 'A value equal to the default still counts (3.13)', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('--level', type=int, default=1)\ngroup.add_argument('--auto', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--level', '1', '--auto'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: 'app: error: argument --auto: not allowed with argument --level' },
  ],

  pitfalls: [
    {
      name: 'One flag per choice',
      desc: 'With a store_true flag for every choice, "neither given" is easy to misread as one of them. Let the members share one dest instead.',
      wrong: { label: '--json / --csv flags', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nfmt = parser.add_mutually_exclusive_group()\nfmt.add_argument('--json', action='store_true')\nfmt.add_argument('--csv', action='store_true')\nargs = parser.parse_args([])\n'json' if args.json else 'csv'", output: "'csv'" },
      fix:   { label: 'one dest, store_const', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nfmt = parser.add_mutually_exclusive_group()\nfmt.add_argument('--json', dest='format', action='store_const', const='json')\nfmt.add_argument('--csv', dest='format', action='store_const', const='csv')\nparser.set_defaults(format='table')\n(parser.parse_args([]), parser.parse_args(['--csv']))", output: "(Namespace(format='table'), Namespace(format='csv'))" },
    },
    {
      name: 'required=True on a member',
      desc: 'A member that is always required could never be left out for another one, so add_argument refuses it. Put required=True on the group.',
      wrong: { label: 'member required', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group(required=True)\ngroup.add_argument('--file', required=True)\ngroup.add_argument('--stdin', action='store_true')", output: 'ValueError: mutually exclusive arguments must be optional' },
      fix:   { label: 'group required', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group(required=True)\ngroup.add_argument('--file')\ngroup.add_argument('--stdin', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args([])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: one of the arguments --file --stdin is required' },
    },
    {
      name: 'Passing a title',
      desc: 'Unlike add_argument_group, this method takes no title or description, and required is keyword-only.',
      wrong: { label: "('output format')", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group('output format')", output: 'TypeError: _ActionsContainer.add_mutually_exclusive_group() takes 1 positional argument but 2 were given' },
      fix:   { label: 'inside an argument group', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nsection = parser.add_argument_group('output format')\ngroup = section.add_mutually_exclusive_group()\nsection.title", output: "'output format'" },
    },
  ],

  when: {
    use: [
      'Options that contradict each other: --verbose / --quiet, --json / --csv',
      'Several ways to give the same input: --file PATH, --stdin or a positional',
    ],
    avoid: [
      'One value from a fixed list → a single option with choices=',
      'Rules like "--b only together with --a" → check after parsing and call parser.error()',
      'Completely different argument sets → add_subparsers()',
    ],
  },

  notes: {
    cpython:      "_MutuallyExclusiveGroup is an _ArgumentGroup that adds its actions to the parser (not to a help section) and appears in parser._mutually_exclusive_groups; while parsing, every member that is used marks the others as conflicts, and required groups are checked after all words are consumed",
    'Counting':   'in 3.13 a member counts as used whenever its option appears, whatever the value; CPython 3.12.3 still skipped a value that was the default object itself, so --level 1 --auto above was accepted there. A positional member counts only when it consumes a word',
    'Help':       'a member shows up in the usage line inside [ | ] or ( | ); in the argument list it stays in its section (options, or the argument group the exclusive group was created in)',
    'Deprecation': 'nesting groups inside a mutually exclusive group (add_argument_group or add_mutually_exclusive_group on it) has been deprecated since 3.11 (a DeprecationWarning in 3.13) and raises an exception since 3.14',
  },

  related: [
    { name: 'add_argument_group()', slug: 'add_argument_group', when: 'A titled help section; can contain an exclusive group' },
    { name: 'add_argument(action=...)', slug: 'actions', when: 'store_const with a shared dest' },
    { name: 'error()', slug: 'error', when: 'Check other rules yourself after parsing' },
    { name: 'add_subparsers()', slug: 'add_subparsers', when: 'Different argument sets per command' },
    { name: 'parse_intermixed_args()', slug: 'parse_intermixed_args', when: 'Groups with positionals work there in 3.13.3' },
  ],

  faq: [
    {
      q: 'How do I make two argparse options mutually exclusive?',
      a: "group = parser.add_mutually_exclusive_group(), then group.add_argument(...) for each of them. Giving two members prints the usage plus \"argument --b: not allowed with argument --a\" and exits with status 2.",
    },
    {
      q: 'How do I require exactly one of several options?',
      a: 'add_mutually_exclusive_group(required=True). With none of them the parser exits with "one of the arguments --a --b is required"; with two it reports the conflict. The members themselves must not be required=True.',
    },
    {
      q: 'Can a positional argument be in a mutually exclusive group?',
      a: "Yes, if it is optional: nargs='?' or nargs='*'. A required positional raises ValueError: mutually exclusive arguments must be optional.",
    },
    {
      q: 'How do I give a mutually exclusive group a title in the help?',
      a: "Create an argument group with the title and description, then call add_mutually_exclusive_group() on that group. The exclusive group itself accepts only required=.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_mutually_exclusive_group',
    meta:  'ArgumentParser.add_mutually_exclusive_group',
  },

};
