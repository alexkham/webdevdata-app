// content/reference/python/stdlib/sys/argv.js — sys.argv and sys.orig_argv

export const meta = {
  slug:        'argv',
  name:        'sys.argv / sys.orig_argv',
  signature:   'sys.argv: list[str] · sys.orig_argv: list[str]',
  blurb:       'The command line your program was started with: argv[0] is the script, argv[1:] are its arguments. orig_argv (3.10+) also keeps the options the interpreter consumed.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'All versions (orig_argv 3.10+)',
  searchTerms: 'sys.argv argv sys.orig_argv orig_argv command line arguments python script arguments argv[0] argv[1] list index out of range parse arguments argparse',
};

export const method = {
  slug:      'argv',
  name:      'sys.argv / sys.orig_argv',
  signature: 'sys.argv: list[str] · sys.orig_argv: list[str]',
  returns:   { type: 'list[str]', desc: 'argv: script name, then its arguments. orig_argv: the full command line, interpreter options included.' },

  category:    'sys attribute',
  version:     'All versions (orig_argv 3.10+)',
  hasLiveDemo: false,

  subtitle: 'Everything after the script name on the command line, as strings. argv[0] is the script (or "-c", or "" in the REPL); the interpreter\'s own options such as -X utf8 are only in orig_argv. The values depend on how each program was started, so the examples start a child Python to get the same output everywhere.',

  covers: ['argv', 'orig_argv'],

  cheat: {
    commonCall: 'args = sys.argv[1:]',
    returns:    "list of str — ['script.py', 'in.txt', '3']",
    replaces:   'Reading the command line by hand from the OS',
    watchOut:   'argv[0] is the script name, and every item is a str',
  },

  parameters: [],

  patterns: [
    {
      name: 'Minimal argument handling',
      desc: 'Check the count, show usage via sys.exit (exit status 1).',
      code: "import sys\nif len(sys.argv) != 3:\n    sys.exit(f'usage: {sys.argv[0]} SRC DST')\nsrc, dst = sys.argv[1:]",
    },
    {
      name: 'Anything more → argparse',
      desc: 'argparse reads sys.argv[1:] for you and adds --help, types and errors.',
      code: "import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument('path')\nparser.add_argument('--count', type=int, default=1)\nargs = parser.parse_args()  # parses sys.argv[1:]",
    },
    {
      name: 'Testable main()',
      desc: 'Pass argv in, so tests can call main([...]) without touching sys.argv.',
      code: "import sys\n\ndef main(argv=None):\n    argv = sys.argv[1:] if argv is None else argv\n    ...\n\nif __name__ == '__main__':\n    main()",
    },
    {
      name: 'Original bytes of an argument (POSIX)',
      desc: 'Arguments are decoded with the filesystem encoding and surrogateescape; os.fsencode gives the bytes back.',
      code: 'import os, sys\nraw = [os.fsencode(arg) for arg in sys.argv]',
    },
  ],

  examples: [
    { title: 'What a script receives',  code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'import sys; print(sys.argv)', 'in.txt', '3'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"['-c', 'in.txt', '3']\"" },
    { title: 'Quoted arguments stay together', code: "import subprocess, sys\np = subprocess.run([sys.executable, '-c', 'import sys; print(len(sys.argv))', 'two words', ''], capture_output=True, text=True)\nint(p.stdout)", returns: '3' },
    { title: 'Interpreter options are only in orig_argv', code: "import subprocess, sys\ncode = 'import sys; print(sys.argv, sys.orig_argv[1:])'\np = subprocess.run([sys.executable, '-X', 'utf8', '-c', code, 'x'], capture_output=True, text=True)\np.stdout.strip()", returns: "\"['-c', 'x'] ['-X', 'utf8', '-c', 'import sys; print(sys.argv, sys.orig_argv[1:])', 'x']\"" },
    { title: 'Always a list of str',    code: 'import sys\n(type(sys.argv).__name__, all(isinstance(a, str) for a in sys.argv))', returns: "('list', True)" },
    { title: 'Numbers arrive as text',  code: "argv = ['resize.py', '800', '600']  # what sys.argv would hold\nwidth, height = map(int, argv[1:])\nwidth * height", returns: '480000' },
    { title: 'A missing argument',      code: "argv = ['resize.py']\nargv[1]", returns: 'IndexError: list index out of range' },
  ],

  pitfalls: [
    {
      name: 'Forgetting that argv[0] is the script',
      desc: 'Processing all of sys.argv includes the script name. Slice from 1.',
      wrong: { label: 'all of argv', code: "argv = ['add.py', '2', '3']\nsum(int(a) for a in argv)", output: "ValueError: invalid literal for int() with base 10: 'add.py'" },
      fix:   { label: 'argv[1:]',    code: "argv = ['add.py', '2', '3']\nsum(int(a) for a in argv[1:])", output: '5' },
    },
    {
      name: 'Adding arguments without converting them',
      desc: 'Every argument is a str, so + concatenates.',
      wrong: { label: 'str + str', code: "argv = ['add.py', '2', '3']\nargv[1] + argv[2]", output: "'23'" },
      fix:   { label: 'int() first', code: "argv = ['add.py', '2', '3']\nint(argv[1]) + int(argv[2])", output: '5' },
    },
  ],

  when: {
    use: [
      'Tiny scripts with one or two positional arguments',
      'Forwarding the exact command line (orig_argv) when re-launching Python',
    ],
    avoid: [
      'Options, flags, help text, validation → argparse',
      'Reading many input files or stdin → fileinput',
    ],
  },

  notes: {
    cpython:      'Set during startup from the C argv (Python/initconfig.c, PyConfig.argv / orig_argv)',
    'argv[0]':    "The script path as given; '-c' with -c; the module's full path with -m; '' in the interactive interpreter",
    'Decoding':   'On Unix the OS passes bytes; Python decodes them with the filesystem encoding and surrogateescape. Windows passes Unicode directly',
    'Mutable':    'argv is a plain list you may change (argparse and tests sometimes do); orig_argv is informational',
  },

  related: [
    { name: 'sys.exit',     slug: 'exit',    when: 'Stop with a usage message' },
    { name: 'sys.executable', slug: 'prefix', when: 'Start another Python with the same interpreter' },
    { name: 'sys.flags',    slug: 'flags',   when: 'The interpreter options, parsed' },
    { name: 'IndexError',   slug: 'indexerror', when: 'What a missing argv[1] raises', category: 'exceptions' },
    { name: 'sys module',   slug: 'sys',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is sys.argv[0]?',
      a: "The name of the script as it was given on the command line (it may or may not be a full path). With python -c it is '-c', with python -m it is the full path of the module, and in the interactive interpreter it is ''.",
    },
    {
      q: 'Why do I get IndexError: list index out of range with sys.argv[1]?',
      a: 'The script was started without arguments — common when running from an IDE. Check len(sys.argv) first, or use argparse, which prints a proper usage error.',
    },
    {
      q: 'What is the difference between sys.argv and sys.orig_argv?',
      a: 'sys.argv holds the arguments for your program. sys.orig_argv (Python 3.10+) is the complete original command line, including the interpreter path and options such as -X utf8 or -O that Python consumed itself.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/sys.html#sys.argv',
    meta:  'sys.argv',
  },
};
