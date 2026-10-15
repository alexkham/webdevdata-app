// content/reference/python/stdlib/argparse/nargs.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'nargs',
  name:        'argparse.OPTIONAL / ZERO_OR_MORE / ONE_OR_MORE / REMAINDER / PARSER',
  signature:   "OPTIONAL = '?' · ZERO_OR_MORE = '*' · ONE_OR_MORE = '+' · REMAINDER = '...' · PARSER = 'A...'",
  blurb:       "The nargs= values as named constants: how many command-line words an argument consumes — zero or one, any number, at least one, everything that is left, or a subcommand.",
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: "argparse nargs OPTIONAL ZERO_OR_MORE ONE_OR_MORE REMAINDER PARSER nargs='?' nargs='*' nargs='+' nargs=2 nargs=1 multiple values list of arguments variable number of arguments optional positional argparse remainder rest of arguments -- double dash",
};

export const method = {
  slug:      'nargs',
  name:      'argparse.OPTIONAL / ZERO_OR_MORE / ONE_OR_MORE / REMAINDER / PARSER',
  signature: "OPTIONAL = '?' · ZERO_OR_MORE = '*' · ONE_OR_MORE = '+' · REMAINDER = '...' · PARSER = 'A...'",

  category:    'argparse constants',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "nargs= decides how many words of the command line belong to one argument. The constants are just the strings '?', '*', '+', '...' and 'A...' — most code writes the strings. An int N takes exactly N words; anything but the default gives you a list (except '?').",

  covers: ['OPTIONAL', 'ZERO_OR_MORE', 'ONE_OR_MORE', 'REMAINDER', 'PARSER'],

  attributes: [
    { name: 'None (default)', type: 'one word',      meaning: 'Exactly one value, stored as is (not in a list)' },
    { name: 'N (an int)',     type: 'N words',       meaning: 'Exactly N values, as a list — nargs=1 gives a one-item list' },
    { name: 'OPTIONAL',       type: "'?'",           meaning: 'Zero or one value. Absent → default; option given without a value → const' },
    { name: 'ZERO_OR_MORE',   type: "'*'",           meaning: 'Any number of values, as a list; an absent positional gives []' },
    { name: 'ONE_OR_MORE',    type: "'+'",           meaning: 'At least one value, as a list; none is an error' },
    { name: 'REMAINDER',      type: "'...'",         meaning: 'Everything that is left, options included (still in __all__, but no longer described in the documentation)' },
    { name: 'PARSER',         type: "'A...'",        meaning: 'One word plus everything after it — what add_subparsers uses for the subcommand' },
  ],

  modes: [
    {
      id: 'counts',
      label: "? * + and N",
      blurb: "src takes one or more words and dst exactly one, --exclude any number, --log zero or one (with a const), --size exactly two. Type a command line.",
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('src', nargs='+')\nparser.add_argument('dst')\nparser.add_argument('--exclude', nargs='*', default=[])\nparser.add_argument('--log', nargs='?', const='app.log')\nparser.add_argument('--size', nargs=2, type=int, metavar=('W', 'H'))\n" + TAIL,
      cases: [
        { id: 'basic',    label: 'a b backup/',          values: { cmdline: 'a.txt b.txt backup/' } },
        { id: 'const',    label: '--log without value',  values: { cmdline: 'a.txt backup/ --log' } },
        { id: 'logval',   label: '--log with value',     values: { cmdline: '--log run.log a.txt backup/' } },
        { id: 'dashdash', label: '-- ends --exclude',    values: { cmdline: '--exclude x y -- a.txt backup/' } },
        { id: 'size',     label: '--size 800',           values: { cmdline: 'a.txt backup/ --size 800' } },
        { id: 'onlyone',  label: 'one word',             values: { cmdline: 'a.txt' } },
        { id: 'help',     label: '-h',                   values: { cmdline: '-h' } },
      ],
    },
    {
      id: 'remainder',
      label: 'REMAINDER',
      blurb: 'A wrapper that runs another command: everything after the command name is passed through untouched, even things that look like options.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='run')\nparser.add_argument('--verbose', action='store_true')\nparser.add_argument('command')\nparser.add_argument('args', nargs=argparse.REMAINDER)\n" + TAIL,
      cases: [
        { id: 'ls',      label: 'ls -l --color',   values: { cmdline: 'ls -l --color' } },
        { id: 'verbose', label: '--verbose first', values: { cmdline: '--verbose python -c "print(1)"' } },
        { id: 'after',   label: '--verbose after', values: { cmdline: 'ls --verbose' } },
        { id: 'none',    label: 'nothing',         values: { cmdline: '' } },
      ],
    },
  ],
  demoExplainer: "Positionals are matched together with a regular expression over the command line, so src (+) leaves the last word for dst. An option with nargs='*' takes every following word that is not an option, which is why -- is needed to end --exclude. Without a value --log gets its const, absent it gets its default (None). Wrong counts are reported per argument: \"argument --size: expected 2 arguments\". In the REMAINDER tab, --verbose counts only before the command; after it, it belongs to args.",

  patterns: [
    {
      name: 'One or more input files',
      desc: "nargs='+' rejects an empty command line with a usage error.",
      code: "parser.add_argument('files', nargs='+', help='files to process')",
    },
    {
      name: 'An optional positional with a fallback',
      desc: "'-' as the default is the usual way to say stdin.",
      code: "parser.add_argument('infile', nargs='?', default='-')",
    },
    {
      name: 'An option with an optional value',
      desc: '--log → const, --log FILE → FILE, absent → default.',
      code: "parser.add_argument('--log', nargs='?', const='app.log', default=None)",
    },
    {
      name: 'Pass the rest to another program',
      desc: 'REMAINDER (or a -- on the command line) keeps argparse from interpreting the rest.',
      code: "parser.add_argument('command')\nparser.add_argument('args', nargs=argparse.REMAINDER)\nargs = parser.parse_args()\nsubprocess.run([args.command, *args.args])",
    },
  ],

  examples: [
    { title: 'The constants are plain strings', code: 'import argparse\n(argparse.OPTIONAL, argparse.ZERO_OR_MORE, argparse.ONE_OR_MORE, argparse.REMAINDER, argparse.PARSER)', returns: "('?', '*', '+', '...', 'A...')" },
    { title: 'nargs=N gives a list, even for N=1', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo', nargs=2)\nparser.add_argument('bar', nargs=1)\nparser.parse_args(['c', '--foo', 'a', 'b'])", returns: "Namespace(foo=['a', 'b'], bar=['c'])" },
    { title: 'OPTIONAL: default, const, value', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--log', nargs=argparse.OPTIONAL, const='app.log', default=None)\n[parser.parse_args(argv).log for argv in ([], ['--log'], ['--log', 'debug.log'])]", returns: "[None, 'app.log', 'debug.log']" },
    { title: 'ZERO_OR_MORE positional: [] when absent', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs=argparse.ZERO_OR_MORE)\nparser.parse_args([])", returns: 'Namespace(files=[])' },
    { title: 'ONE_OR_MORE leaves room for the next positional', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('src', nargs=argparse.ONE_OR_MORE)\nparser.add_argument('dst')\nparser.parse_args(['a.txt', 'b.txt', 'backup/'])", returns: "Namespace(src=['a.txt', 'b.txt'], dst='backup/')" },
    { title: 'REMAINDER keeps options for another program', code: "import argparse\nparser = argparse.ArgumentParser(prog='run')\nparser.add_argument('--verbose', action='store_true')\nparser.add_argument('command')\nparser.add_argument('args', nargs=argparse.REMAINDER)\nparser.parse_args(['--verbose', 'ls', '-l', '--color'])", returns: "Namespace(verbose=True, command='ls', args=['-l', '--color'])" },
    { title: 'PARSER is the nargs of a subparsers action', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ncommands = parser.add_subparsers()\ncommands.nargs == argparse.PARSER", returns: 'True' },
  ],

  pitfalls: [
    {
      name: "An option with nargs='*' swallows the positional",
      desc: "'*' and '+' on an option take every following word that is not an option. End the list with -- (or put positionals first).",
      wrong: { label: 'positional last', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--exclude', nargs='*')\nparser.add_argument('out')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--exclude', 'a', 'b', 'out.txt'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: the following arguments are required: out' },
      fix:   { label: 'end with --', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--exclude', nargs='*')\nparser.add_argument('out')\nparser.parse_args(['--exclude', 'a', 'b', '--', 'out.txt'])", output: "Namespace(exclude=['a', 'b'], out='out.txt')" },
    },
    {
      name: 'nargs=1 when you want one value',
      desc: 'nargs=1 wraps the value in a list. Leave nargs out for a single plain value.',
      wrong: { label: 'nargs=1', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name', nargs=1)\nargs = parser.parse_args(['--name', 'ada'])\nargs.name.upper()", output: "AttributeError: 'list' object has no attribute 'upper'" },
      fix:   { label: 'no nargs', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nargs = parser.parse_args(['--name', 'ada'])\nargs.name.upper()", output: "'ADA'" },
    },
    {
      name: 'A metavar tuple of the wrong length',
      desc: 'A tuple metavar needs one name per value. add_argument test-formats it immediately and refuses a mismatch.',
      wrong: { label: 'nargs=2, one name', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--size', nargs=2, metavar=('W',))", output: 'ValueError: length of metavar tuple does not match nargs' },
      fix:   { label: 'two names', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--size', nargs=2, type=int, metavar=('W', 'H'))\nparser.parse_args(['--size', '800', '600'])", output: 'Namespace(size=[800, 600])' },
    },
  ],

  when: {
    use: [
      "'+' for 'one or more files', '*' for 'any number', '?' for an optional positional",
      'An int when the count is fixed (a pair of coordinates)',
      'REMAINDER for wrapper commands that pass arguments on',
    ],
    avoid: [
      "nargs='*' on options followed by positionals → users must remember --",
      "nargs=1 for a single value → leave nargs out",
      'REMAINDER in new code where -- on the command line is enough — the current documentation no longer describes REMAINDER',
    ],
  },

  notes: {
    cpython:      "Lib/argparse.py turns each nargs into a regex fragment over a pattern of 'O' (option) and 'A' (argument) letters — e.g. '+' on a positional is (-*A[A-]*) — and matches all positionals at once",
    'Errors':     "\"expected one argument\" (None), \"expected at most one argument\" ('?'), \"expected at least one argument\" ('+'), \"expected N arguments\" (int); nargs=0 on a store action and nargs='x' are ValueError at add_argument time",
    'Intermixed': 'parse_intermixed_args rejects REMAINDER and PARSER positionals with TypeError',
  },

  related: [
    { name: 'add_argument()', slug: 'add_argument', when: 'Where nargs= is passed' },
    { name: 'actions', slug: 'actions', when: 'extend and append combine with nargs' },
    { name: 'add_subparsers()', slug: 'add_subparsers', when: 'The PARSER nargs in practice' },
    { name: 'parse_intermixed_args()', slug: 'parse_intermixed_args', when: 'Options between positionals' },
    { name: 'argparse.SUPPRESS', slug: 'suppress', when: 'The other special string constant' },
  ],

  faq: [
    {
      q: 'How do I accept a list of values with argparse?',
      a: "nargs='+' (at least one) or nargs='*' (any number) gives a list: --ids 1 2 3 → ['1', '2', '3']; add type=int for ints. For a repeatable option (--id 1 --id 2) use action='append' instead.",
    },
    {
      q: 'How do I make a positional argument optional?',
      a: "nargs='?' with a default: add_argument('outfile', nargs='?', default='out.txt'). Positionals ignore default otherwise, because they are required.",
    },
    {
      q: 'What is the difference between nargs=1 and the default?',
      a: 'Both consume one word, but nargs=1 stores a one-item list (["x"]) while the default stores the value itself ("x").',
    },
    {
      q: 'What does -- do on an argparse command line?',
      a: 'It ends option processing: everything after it is treated as positional values, even words that start with -. The -- itself is removed before the values are stored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#nargs',
    meta:  'add_argument nargs',
  },

};
