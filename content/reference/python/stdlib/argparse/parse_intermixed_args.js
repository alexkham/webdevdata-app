// content/reference/python/stdlib/argparse/parse_intermixed_args.js

export const meta = {
  slug:        'parse_intermixed_args',
  name:        'ArgumentParser.parse_intermixed_args',
  signature:   'ArgumentParser.parse_intermixed_args(args=None, namespace=None) / parse_known_intermixed_args(args=None, namespace=None)',
  blurb:       'Parse a command line where options and positional values are freely mixed: all the positional words are collected first-come first-served, whatever options sit between them.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.7+',
  searchTerms: 'argparse parse_intermixed_args parse_known_intermixed_args ArgumentParser.parse_intermixed_args ArgumentParser.parse_known_intermixed_args intermixed options and positionals options between positional arguments unrecognized arguments nargs * + split by option gnu style mixed arguments',
};

export const method = {
  slug:      'parse_intermixed_args',
  name:      'ArgumentParser.parse_intermixed_args',
  signature: 'ArgumentParser.parse_intermixed_args(args=None, namespace=None) / parse_known_intermixed_args(args=None, namespace=None)',
  returns:   { type: 'Namespace | tuple[Namespace, list[str]]', desc: 'parse_intermixed_args returns the Namespace like parse_args; parse_known_intermixed_args returns (namespace, extras) like parse_known_args.' },

  category:    'ArgumentParser method',
  version:     'Python 3.7+',
  hasLiveDemo: true,

  subtitle: "parse_args fills a positional from one run of words, so 'a.txt -v b.txt' leaves b.txt over for files=nargs='+'. The intermixed variants first handle the options, then give every remaining positional word to the positionals in order, the way many Unix tools accept files and flags in any order.",

  covers: ['ArgumentParser.parse_intermixed_args', 'ArgumentParser.parse_known_intermixed_args'],

  cheat: {
    commonCall: 'args = parser.parse_intermixed_args()',
    returns:    'Namespace(...) — the same shape parse_args returns',
    replaces:   "parse_args failing with \"unrecognized arguments\" when options split a nargs='*' / '+' positional",
    watchOut:   'TypeError with subparsers or nargs=REMAINDER positionals',
  },

  parameters: [
    { name: 'args',      type: 'list[str] | None', required: false, default: 'None', desc: 'The words to parse; None means sys.argv[1:].' },
    { name: 'namespace', type: 'object | None',    required: false, default: 'None', desc: 'Object to set the attributes on; None creates a new Namespace.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'parse_args vs intermixed',
      blurb: "files takes one or more names; -o and -v can go anywhere. Type a command line: the result is (parse_args, parse_intermixed_args), each a Namespace or (exit status, last line printed).",
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+')\nparser.add_argument('-o', '--output')\nparser.add_argument('-v', '--verbose', action='store_true')\nargv = shlex.split({$cmdline})\n\ndef attempt(parse):\n    out = io.StringIO()\n    try:\n        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n            return parse(argv)\n    except SystemExit as e:\n        return (e.code, out.getvalue().splitlines()[-1])\n\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    result = (attempt(parser.parse_args), attempt(parser.parse_intermixed_args))\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult",
      cases: [
        { id: 'split',   label: 'a.txt -o out b.txt',  values: { cmdline: 'a.txt -o out b.txt' } },
        { id: 'flags',   label: '-v a.txt -v b.txt',   values: { cmdline: '-v a.txt -v b.txt' } },
        { id: 'end',     label: 'options at the end',  values: { cmdline: 'a.txt b.txt -o out' } },
        { id: 'unknown', label: 'a.txt --zip b.txt',   values: { cmdline: 'a.txt --zip b.txt' } },
        { id: 'dashes',  label: 'a.txt -- -o b.txt',   values: { cmdline: 'a.txt -- -o b.txt' } },
        { id: 'missing', label: '-o out only',         values: { cmdline: '-o out' } },
      ],
    },
  ],
  demoExplainer: "With 'a.txt -o out b.txt', parse_args gives files the first run of words (a.txt), then -o out, and b.txt is left over: \"unrecognized arguments: b.txt\". The intermixed parser takes the options first and then gives files both names. When the options come last, both methods agree. An unknown option is still an error; in 3.13.3 the intermixed parser reports only --zip, because b.txt went to files. After -- every word is positional for both. These outputs are from CPython 3.13.3; 3.12.3 lists the attributes in a different order (options first) and reports '--zip b.txt'.",

  patterns: [
    {
      name: 'A Unix-style tool',
      desc: 'Files and flags in any order: tool a.txt -v b.txt -o out.',
      code: "parser = argparse.ArgumentParser()\nparser.add_argument('files', nargs='+')\nparser.add_argument('-o', '--output')\nparser.add_argument('-v', '--verbose', action='store_true')\nargs = parser.parse_intermixed_args()",
    },
    {
      name: 'Collect unknown options instead of failing',
      desc: 'parse_known_intermixed_args returns them, like parse_known_args.',
      code: "args, unknown = parser.parse_known_intermixed_args()\nif unknown:\n    print('ignoring', ' '.join(unknown))",
    },
  ],

  examples: [
    { title: 'The difference in one call', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--foo')\nparser.add_argument('cmd')\nparser.add_argument('rest', nargs='*', type=int)\nargv = 'doit 1 --foo bar 2 3'.split()\n(parser.parse_known_args(argv), parser.parse_intermixed_args(argv))", returns: "((Namespace(foo='bar', cmd='doit', rest=[1]), ['2', '3']), Namespace(foo='bar', cmd='doit', rest=[1, 2, 3]))" },
    { title: 'A flag between two file names', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+')\nparser.add_argument('-v', '--verbose', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['a.txt', '-v', 'b.txt'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])\nparser.parse_intermixed_args(['a.txt', '-v', 'b.txt'])", returns: "app: error: unrecognized arguments: b.txt\nNamespace(files=['a.txt', 'b.txt'], verbose=True)" },
    { title: 'parse_known_intermixed_args returns the extras', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-o', '--output')\nparser.add_argument('files', nargs='+')\nparser.parse_known_intermixed_args(['a.txt', '--zip', 'b.txt', '-o', 'out.txt', 'c.txt'])", returns: "(Namespace(output='out.txt', files=['a.txt', 'b.txt', 'c.txt']), ['--zip'])" },
    { title: 'Fixed positionals were already fine', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('src')\nparser.add_argument('dst')\nparser.add_argument('-r', '--recursive', action='store_true')\n(parser.parse_args(['a', '-r', 'b']), parser.parse_intermixed_args(['a', '-r', 'b']))", returns: "(Namespace(src='a', dst='b', recursive=True), Namespace(src='a', dst='b', recursive=True))" },
    { title: 'Unknown options are still errors', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('files', nargs='*')\nparser.parse_intermixed_args(['a.txt', '--zip', 'b.txt'])", returns: 'argparse.ArgumentError: unrecognized arguments: --zip' },
    { title: 'Subparsers are not supported', code: "import argparse\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command')\ncommands.add_parser('add')\nparser.parse_intermixed_args(['add'])", returns: 'TypeError: parse_intermixed_args: positional arg with nargs=A...' },
    { title: 'A mutually exclusive group with a positional (3.13.3)', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument('--file')\ngroup.add_argument('text', nargs='?')\n(parser.parse_intermixed_args(['hello']), parser.parse_intermixed_args(['--file', 'notes.txt']))", returns: "(Namespace(file=None, text='hello'), Namespace(file='notes.txt', text=None))" },
  ],

  pitfalls: [
    {
      name: "An option with nargs='*' still takes every word after it",
      desc: 'Intermixing only changes how positional words are shared out. An option that accepts any number of values consumes the words that follow it before the positionals are considered.',
      wrong: { label: "-x with nargs='*'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+')\nparser.add_argument('-x', '--exclude', nargs='*')\nparser.parse_intermixed_args(['a.txt', '-x', 'tmp', 'b.txt'])", output: "Namespace(files=['a.txt'], exclude=['tmp', 'b.txt'])" },
      fix:   { label: "action='append'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='+')\nparser.add_argument('-x', '--exclude', action='append')\nparser.parse_intermixed_args(['a.txt', '-x', 'tmp', 'b.txt'])", output: "Namespace(files=['a.txt', 'b.txt'], exclude=['tmp'])" },
    },
    {
      name: 'REMAINDER positionals raise TypeError',
      desc: 'nargs=argparse.REMAINDER (and subparsers, nargs=PARSER) cannot be intermixed. The check runs before any parsing, so even a valid command line fails.',
      wrong: { label: 'parse_intermixed_args', code: "import argparse\nparser = argparse.ArgumentParser(prog='run')\nparser.add_argument('-v', action='store_true')\nparser.add_argument('command', nargs=argparse.REMAINDER)\nparser.parse_intermixed_args(['-v', 'ls', '-l'])", output: 'TypeError: parse_intermixed_args: positional arg with nargs=...' },
      fix:   { label: 'parse_args', code: "import argparse\nparser = argparse.ArgumentParser(prog='run')\nparser.add_argument('-v', action='store_true')\nparser.add_argument('command', nargs=argparse.REMAINDER)\nparser.parse_args(['-v', 'ls', '-l'])", output: "Namespace(v=True, command=['ls', '-l'])" },
    },
    {
      name: 'parse_known_args puts later positionals in the extras',
      desc: "When an option splits a nargs='*' positional, parse_known_args does not complain: it quietly returns the second part as unknown words.",
      wrong: { label: 'parse_known_args', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='*')\nparser.add_argument('-x', '--exclude')\nparser.parse_known_args(['a.txt', '-x', 'tmp', 'b.txt'])", output: "(Namespace(files=['a.txt'], exclude='tmp'), ['b.txt'])" },
      fix:   { label: 'parse_known_intermixed_args', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('files', nargs='*')\nparser.add_argument('-x', '--exclude')\nparser.parse_known_intermixed_args(['a.txt', '-x', 'tmp', 'b.txt'])", output: "(Namespace(files=['a.txt', 'b.txt'], exclude='tmp'), [])" },
    },
  ],

  when: {
    use: [
      "A positional with nargs='*' or '+' that users may interrupt with options (files and flags in any order)",
      'Porting a tool from optparse or getopt with GNU-style argument permutation',
    ],
    avoid: [
      'Parsers with subcommands or nargs=REMAINDER → parse_args (TypeError otherwise)',
      'Only fixed-count positionals → parse_args already handles options between them',
    ],
  },

  notes: {
    cpython:      '_parse_known_args2(args, namespace, intermixed=True): options are consumed in one pass, the remaining positional words are then given to the positionals in one call of consume_positionals; parse_intermixed_args adds the "unrecognized arguments" error like parse_args does',
    'Versions':   'the intermixed parser behaves differently in older releases: CPython 3.12.3 raises TypeError("parse_intermixed_args: positional in mutuallyExclusiveGroup") for the group example above, lists options first in the Namespace, and leaves the word after an unknown option in the extras; 3.13.3 (the outputs on this page) does none of these',
    'Errors':     'with exit_on_error=False the unrecognized-arguments error is raised as argparse.ArgumentError instead of printed',
  },

  related: [
    { name: 'parse_args()', slug: 'parse_args', when: 'The standard parser' },
    { name: 'parse_known_args()', slug: 'parse_known_args', when: 'Keep unknown words instead of failing' },
    { name: 'nargs', slug: 'nargs', when: "'*' and '+' positionals; REMAINDER is not supported here" },
    { name: 'add_subparsers()', slug: 'add_subparsers', when: 'Not supported by the intermixed parsers' },
  ],

  faq: [
    {
      q: 'Why does argparse say "unrecognized arguments" for my second file name?',
      a: "Because an option came between the file names: with parse_args a positional with nargs='+' or '*' takes one consecutive run of words, so 'a.txt -v b.txt' leaves b.txt over. Use parser.parse_intermixed_args() (3.7+) to collect every positional word wherever it is.",
    },
    {
      q: 'What is the difference between parse_intermixed_args and parse_known_intermixed_args?',
      a: 'The same as between parse_args and parse_known_args: the first exits with "unrecognized arguments" when words are left over, the second returns (namespace, leftover_words).',
    },
    {
      q: 'Can I use parse_intermixed_args with subcommands?',
      a: 'No. A parser with add_subparsers() or a positional with nargs=argparse.REMAINDER makes it raise TypeError ("parse_intermixed_args: positional arg with nargs=A..." or "nargs=..."). Use parse_args there.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.parse_intermixed_args',
    meta:  'ArgumentParser.parse_intermixed_args',
  },

};
