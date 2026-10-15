// content/reference/python/stdlib/argparse/parse_args.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'parse_args',
  name:        'ArgumentParser.parse_args',
  signature:   'ArgumentParser.parse_args(args=None, namespace=None)',
  blurb:       'Parse a list of command-line strings (sys.argv[1:] by default) into a Namespace — or print a usage error and exit with status 2.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse parse_args ArgumentParser.parse_args sys.argv args list namespace= option value syntax -x3 --name=value negative numbers -- double dash grouped short options -abc unrecognized arguments expected one argument parse command line python',
};

export const method = {
  slug:      'parse_args',
  name:      'ArgumentParser.parse_args',
  signature: 'ArgumentParser.parse_args(args=None, namespace=None)',
  returns:   { type: 'Namespace', desc: 'The namespace with one attribute per argument (the object you passed as namespace=, if any).' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Call it once, after every add_argument. It classifies each word as an option or a value, matches values to arguments, converts them with type=, checks choices=, fills in defaults and returns the Namespace. Anything it cannot use — an unknown option, a leftover word, a missing required argument — becomes a usage error on stderr and SystemExit(2).",

  covers: ['ArgumentParser.parse_args'],

  cheat: {
    commonCall: 'args = parser.parse_args()',
    returns:    'Namespace(...) — reads sys.argv[1:] when args is None',
    replaces:   'looping over sys.argv by hand',
    watchOut:   'Pass a list (not a str) when calling it yourself; extra words are an error',
  },

  parameters: [
    { name: 'args',      type: 'list[str] | None', required: false, default: 'None', desc: 'The words to parse. None means sys.argv[1:]. Any iterable of str works (it is copied into a list).' },
    { name: 'namespace', type: 'object | None',    required: false, default: 'None', desc: 'Object to set the attributes on. None creates a new Namespace. Attributes it already has are kept, and defaults do not overwrite them.' },
  ],

  modes: [
    {
      id: 'syntax',
      label: 'command-line syntax',
      blurb: '-x takes an int, --name a string, and values collects the rest. Type a command line to see how each word is classified.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-x', type=int)\nparser.add_argument('--name')\nparser.add_argument('values', nargs='*')\n" + TAIL,
      cases: [
        { id: 'attached', label: '-x3 --name=Ada',     values: { cmdline: '-x3 --name=Ada a b' } },
        { id: 'negative', label: 'negative numbers',   values: { cmdline: '-x -2 -1.5 -.5' } },
        { id: 'dashdash', label: '-- then options',    values: { cmdline: '-- -x --name' } },
        { id: 'split',    label: 'values on both sides', values: { cmdline: 'a -x 2 b' } },
        { id: 'dashval',  label: '--name -v',          values: { cmdline: '--name -v' } },
        { id: 'abbrev',   label: '--nam Ada',          values: { cmdline: '--nam Ada' } },
        { id: 'help',     label: '-h',                 values: { cmdline: '-h' } },
      ],
    },
  ],
  demoExplainer: "A value can follow its option as the next word, be attached to a short option (-x3) or follow = (--name=Ada). Words that look like negative numbers (-2, -1.5, -.5) count as values because this parser has no option that looks like a number. After -- every word is a value, even -x. 'a -x 2 b' fails with \"unrecognized arguments: b\": values is filled once, from the words before the first option, and the leftover b has nowhere to go — parse_intermixed_args handles that layout. '--name -v' fails because -v looks like an option, so --name gets no value; --name=-v works. Long options can be abbreviated while the prefix is unique.",

  patterns: [
    {
      name: 'The usual entry point',
      desc: 'parse_args() with no arguments reads sys.argv[1:].',
      code: "def main(argv=None):\n    args = build_parser().parse_args(argv)\n    ...\n\nif __name__ == '__main__':\n    main()",
    },
    {
      name: 'Parse an explicit list in tests',
      desc: 'Any list of strings works; nothing is read from the real command line.',
      code: "args = parser.parse_args(['--count', '3', 'input.txt'])\nassert args.count == 3",
    },
    {
      name: 'Parse into an existing object',
      desc: 'namespace= lets the parser fill a settings object you already have.',
      code: "settings = Settings()\nparser.parse_args(namespace=settings)",
    },
  ],

  examples: [
    { title: 'Ways to give an option its value', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-x', type=int)\nparser.add_argument('--name')\n[vars(parser.parse_args(argv)) for argv in (['-x', '3'], ['-x3'], ['-x=3'], ['--name', 'Ada'], ['--name=Ada'])]", returns: "[{'x': 3, 'name': None}, {'x': 3, 'name': None}, {'x': 3, 'name': None}, {'x': None, 'name': 'Ada'}, {'x': None, 'name': 'Ada'}]" },
    { title: 'Grouped short options, the last one with a value', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-a', action='store_true')\nparser.add_argument('-b', action='store_true')\nparser.add_argument('-c')\nparser.parse_args(['-abcvalue'])", returns: "Namespace(a=True, b=True, c='value')" },
    { title: 'Negative numbers are values', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-x', type=int)\nparser.add_argument('values', nargs='*', type=float)\nparser.parse_args(['-x', '2', '-5', '-2.5'])", returns: 'Namespace(x=2, values=[-5.0, -2.5])' },
    { title: '… unless an option looks like a negative number', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-1', dest='one', action='store_true')\nparser.add_argument('value', nargs='?')\nparser.parse_args(['-1'])", returns: 'Namespace(one=True, value=None)' },
    { title: '-- ends option processing', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.add_argument('file')\nparser.parse_args(['--name', 'x', '--', '-weird-name.txt'])", returns: "Namespace(name='x', file='-weird-name.txt')" },
    { title: 'Any sequence of strings works', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.parse_args(('--name', 'Ada'))", returns: "Namespace(name='Ada')" },
    { title: 'namespace=: existing attributes beat defaults', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nargs = argparse.Namespace(name='default')\nparser.parse_args([], namespace=args)", returns: "Namespace(name='default')" },
    { title: 'One parser, many parses', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\n(parser.parse_args(['--name', 'Ada']), parser.parse_args([]))", returns: "(Namespace(name='Ada'), Namespace(name=None))" },
  ],

  pitfalls: [
    {
      name: 'An option value that starts with -',
      desc: 'A word that looks like an option is never taken as a value, so --pattern -v leaves --pattern empty. Attach the value with =.',
      wrong: { label: '--pattern -v', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--pattern')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--pattern', '-v'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: argument --pattern: expected one argument' },
      fix:   { label: '--pattern=-v', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--pattern')\nparser.parse_args(['--pattern=-v'])", output: "Namespace(pattern='-v')" },
    },
    {
      name: 'Negative numbers next to a numeric-looking option',
      desc: 'Once the parser has an option such as -1, every word like -5 is treated as an option too.',
      wrong: { label: '--offset -5', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-1', '--one', action='store_true')\nparser.add_argument('--offset', type=int)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['--offset', '-5'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: argument --offset: expected one argument' },
      fix:   { label: '--offset=-5', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('-1', '--one', action='store_true')\nparser.add_argument('--offset', type=int)\nparser.parse_args(['--offset=-5'])", output: 'Namespace(one=False, offset=-5)' },
    },
    {
      name: 'Values before and after an option',
      desc: 'A * or + positional is filled from one run of values. Words after an option that interrupts the run are left over.',
      wrong: { label: 'parse_args', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('values', nargs='*')\nparser.add_argument('-x')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['1', '-x', 'a', '2'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'app: error: unrecognized arguments: 2' },
      fix:   { label: 'parse_intermixed_args', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('values', nargs='*')\nparser.add_argument('-x')\nparser.parse_intermixed_args(['1', '-x', 'a', '2'])", output: "Namespace(values=['1', '2'], x='a')" },
    },
  ],

  when: {
    use: [
      'Once at program start, with no arguments, to read sys.argv',
      'With an explicit list in tests and when parsing commands from another source',
    ],
    avoid: [
      'Command lines that carry options for another program → parse_known_args',
      'Positionals interleaved with options → parse_intermixed_args',
      'Inside library code — it exits the process on errors',
    ],
  },

  notes: {
    cpython:          'parse_args calls parse_known_args and turns leftovers into "unrecognized arguments: ..." via error(). The work happens in _parse_known_args: each word becomes O (option), A (argument) or - (the -- marker) and nargs patterns are matched as regular expressions over that string',
    'Negative numbers': "a word matching ^-\\d+$ or ^-\\d*\\.\\d+$ is a value unless the parser has an option string of that shape. Python 3.14 widens this to scientific notation (-2.5e-6), underscores and complex numbers",
    'Defaults':       'defaults are set on the namespace first, only for attributes it does not already have; str defaults of arguments that were not given are converted with type= at the end',
  },

  related: [
    { name: 'parse_known_args()', slug: 'parse_known_args', when: 'Keep unknown arguments instead of failing' },
    { name: 'parse_intermixed_args()', slug: 'parse_intermixed_args', when: 'Positionals between options' },
    { name: 'Namespace', slug: 'namespace', when: 'What it returns' },
    { name: 'parser.error()', slug: 'error', when: 'How errors are reported' },
    { name: 'sys.argv', slug: 'argv', when: 'The default input', category: 'stdlib/sys' },
  ],

  faq: [
    {
      q: 'How do I pass a value that starts with a dash?',
      a: 'Attach it with =: --pattern=-v (or -p-v for a short option). Negative numbers such as -5 work as separate words unless the parser defines an option that looks like a negative number. For positionals, put -- before them.',
    },
    {
      q: 'Why does parse_args read my test runner\'s arguments?',
      a: 'With no arguments it parses sys.argv[1:], which inside pytest or a notebook belongs to that tool. Pass the list explicitly: parser.parse_args([]) or parser.parse_args(["--x", "1"]).',
    },
    {
      q: 'What does "error: unrecognized arguments" mean?',
      a: 'parse_args found words no argument accepted: an unknown option, a typo, or an extra value. If those words are meant for something else, use parse_known_args, which returns them instead of failing.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.parse_args',
    meta:  'ArgumentParser.parse_args',
  },

};
