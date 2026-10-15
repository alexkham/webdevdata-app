// content/reference/python/stdlib/argparse/convert_arg_line_to_args.js

export const meta = {
  slug:        'convert_arg_line_to_args',
  name:        'ArgumentParser.convert_arg_line_to_args',
  signature:   'ArgumentParser.convert_arg_line_to_args(arg_line)',
  blurb:       'Turns one line of an argument file (@file, enabled by fromfile_prefix_chars) into a list of arguments. The default keeps the whole line as one argument; override it to split lines into words.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse convert_arg_line_to_args ArgumentParser.convert_arg_line_to_args fromfile_prefix_chars argument file @file read arguments from file response file args.txt config file one argument per line arg_line.split shlex.split comments override subclass',
};

export const method = {
  slug:      'convert_arg_line_to_args',
  name:      'ArgumentParser.convert_arg_line_to_args',
  signature: 'ArgumentParser.convert_arg_line_to_args(arg_line)',
  returns:   { type: 'list[str]', desc: 'The arguments that this line stands for; the default returns [arg_line].' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "With ArgumentParser(fromfile_prefix_chars='@'), a word like @args.txt is replaced by the contents of args.txt, read line by line. Each line goes through convert_arg_line_to_args, which by default makes the whole line one argument: --name Ada on one line is a single word, not an option and its value. Subclass and override it to read files the way you want.",

  covers: ['ArgumentParser.convert_arg_line_to_args'],

  cheat: {
    commonCall: 'class MyParser(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return arg_line.split()',
    returns:    "['--name', 'Ada'] for the line '--name Ada'",
    replaces:   'reading a config file and splicing it into sys.argv by hand',
    watchOut:   'Only used when fromfile_prefix_chars is set; the default is one argument per line',
  },

  parameters: [
    { name: 'arg_line', type: 'str', required: true, default: null, desc: 'One line of the argument file, without its line ending (the file is read with str.splitlines()).' },
  ],

  modes: [
    {
      id: 'line',
      label: 'one line, three ways',
      blurb: 'Type a line as it would appear in an argument file. The result is (the default, arg_line.split(), shlex.split(arg_line, comments=True)).',
      params: [{ name: 'line', type: 'str', hint: 'one line of an argument file', input: 'text' }],
      template: "import argparse, shlex\n\nclass SplitArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return arg_line.split()\n\nclass ShellArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return shlex.split(arg_line, comments=True)\n\nline = {$line}\n(argparse.ArgumentParser(prog='app').convert_arg_line_to_args(line),\n SplitArgs(prog='app').convert_arg_line_to_args(line),\n ShellArgs(prog='app').convert_arg_line_to_args(line))",
      cases: [
        { id: 'quoted',  label: 'quotes and a comment', values: { line: '--name "Ada Lovelace" -v  # from the config' } },
        { id: 'pair',    label: '--count 3',            values: { line: '--count 3' } },
        { id: 'equals',  label: '--output=report.txt',  values: { line: '--output=report.txt' } },
        { id: 'comment', label: 'a comment line',       values: { line: '# defaults for the nightly run' } },
        { id: 'blank',   label: 'an empty line',        values: { line: '' } },
        { id: 'open',    label: 'unclosed quote',       values: { line: '--name "Ada' } },
      ],
    },
  ],
  demoExplainer: "The default returns the line unchanged in a one-item list, so an empty line becomes the argument '' and '--count 3' becomes one word that matches no option. str.split() splits on whitespace only: quotes stay in the words and # is just another word. shlex.split with comments=True follows shell rules: quotes group words and are removed, and everything from an unquoted # on is dropped. It raises ValueError: No closing quotation for an unbalanced quote; inside parse_args that ValueError is not turned into a usage error.",

  patterns: [
    {
      name: 'Shell-style argument files',
      desc: 'Several arguments per line, quotes for values with spaces, # comments.',
      code: "import argparse, shlex\n\nclass ArgFileParser(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return shlex.split(arg_line, comments=True)\n\nparser = ArgFileParser(fromfile_prefix_chars='@')",
    },
    {
      name: 'Defaults file plus overrides',
      desc: 'Later words win, so options typed after @defaults.txt override the file.',
      code: "# tool @defaults.txt --port 9000\nparser = argparse.ArgumentParser(fromfile_prefix_chars='@')\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nargs = parser.parse_args()",
    },
    {
      name: 'Skip blank lines, keep one argument per line',
      desc: 'The default turns an empty line into an empty-string argument.',
      code: "class ArgFileParser(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return [arg_line] if arg_line.strip() else []",
    },
  ],

  examples: [
    { title: 'The default: one argument per line', code: "import argparse\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name\\nAda Lovelace\\n-v\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.parse_args(['@args.txt'])", returns: "Namespace(name='Ada Lovelace', verbose=True)" },
    { title: 'An option and its value on one line', code: "import argparse, contextlib, io\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name Ada\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['@args.txt'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: 'app: error: unrecognized arguments: --name Ada' },
    { title: 'Override: split each line into words', code: "import argparse\nclass SplitArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return arg_line.split()\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name Ada\\n--count 3 -v\\n')\nparser = SplitArgs(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('--count', type=int)\nparser.add_argument('-v', '--verbose', action='store_true')\nparser.parse_args(['@args.txt'])", returns: "Namespace(name='Ada', count=3, verbose=True)" },
    { title: 'Override: shell quoting and comments', code: "import argparse, shlex\nclass ShellArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return shlex.split(arg_line, comments=True)\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('# defaults for the nightly run\\n--name \"Ada Lovelace\"  # quoted: one argument\\n\\n--count 3\\n')\nparser = ShellArgs(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('--count', type=int)\nparser.parse_args(['@args.txt'])", returns: "Namespace(name='Ada Lovelace', count=3)" },
    { title: 'Words after the file override it', code: "import argparse\nwith open('defaults.txt', 'w', encoding='utf-8') as f:\n    f.write('--host\\nexample.com\\n--port\\n8080\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nparser.parse_args(['@defaults.txt', '--port', '9000'])", returns: "Namespace(host='example.com', port=9000)" },
    { title: 'Files can include other files', code: "import argparse\nwith open('base.txt', 'w', encoding='utf-8') as f:\n    f.write('--host\\nexample.com\\n')\nwith open('dev.txt', 'w', encoding='utf-8') as f:\n    f.write('@base.txt\\n--port\\n8000\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--host')\nparser.add_argument('--port', type=int)\nparser.parse_args(['@dev.txt'])", returns: "Namespace(host='example.com', port=8000)" },
    { title: 'A missing file is a usage error', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--host')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['@missing.txt'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "app: error: [Errno 2] No such file or directory: 'missing.txt'" },
  ],

  pitfalls: [
    {
      name: 'Blank lines become empty arguments',
      desc: "With the default conversion an empty line is the argument '', which no option takes, so it ends up unrecognized (note the empty text after the colon).",
      wrong: { label: 'default', code: "import argparse, contextlib, io\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--verbose\\n\\n--name\\nAda\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('--verbose', action='store_true')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['@args.txt'])\nexcept SystemExit:\n    print(repr(err.getvalue().splitlines()[-1]))", output: "'app: error: unrecognized arguments: '" },
      fix:   { label: 'skip blank lines', code: "import argparse\nclass SkipBlank(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return [arg_line] if arg_line.strip() else []\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--verbose\\n\\n--name\\nAda\\n')\nparser = SkipBlank(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('--verbose', action='store_true')\nparser.parse_args(['@args.txt'])", output: "Namespace(name='Ada', verbose=True)" },
    },
    {
      name: 'str.split() does not understand quotes',
      desc: 'The recipe from the documentation splits on whitespace only, so a quoted value with a space is cut in two and the quotes stay.',
      wrong: { label: 'arg_line.split()', code: "import argparse\nclass SplitArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return arg_line.split()\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name \"Ada Lovelace\"\\n')\nparser = SplitArgs(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.parse_known_args(['@args.txt'])", output: "(Namespace(name='\"Ada'), ['Lovelace\"'])" },
      fix:   { label: 'shlex.split()', code: "import argparse, shlex\nclass ShellArgs(argparse.ArgumentParser):\n    def convert_arg_line_to_args(self, arg_line):\n        return shlex.split(arg_line, comments=True)\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name \"Ada Lovelace\"\\n')\nparser = ShellArgs(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.parse_known_args(['@args.txt'])", output: "(Namespace(name='Ada Lovelace'), [])" },
    },
    {
      name: 'Forgetting fromfile_prefix_chars',
      desc: 'Without it @args.txt is an ordinary word: no file is read and convert_arg_line_to_args is never called.',
      wrong: { label: 'no prefix', code: "import argparse\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name\\nAda\\n')\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--name')\nparser.add_argument('extra', nargs='*')\nparser.parse_args(['@args.txt'])", output: "Namespace(name=None, extra=['@args.txt'])" },
      fix:   { label: "fromfile_prefix_chars='@'", code: "import argparse\nwith open('args.txt', 'w', encoding='utf-8') as f:\n    f.write('--name\\nAda\\n')\nparser = argparse.ArgumentParser(prog='app', fromfile_prefix_chars='@')\nparser.add_argument('--name')\nparser.add_argument('extra', nargs='*')\nparser.parse_args(['@args.txt'])", output: "Namespace(name='Ada', extra=[])" },
    },
  ],

  when: {
    use: [
      'Long or repeated command lines: keep them in a file and pass @file (compilers call these response files)',
      'Argument files written by people: override with shlex.split for quotes and comments',
    ],
    avoid: [
      'Structured configuration with sections and types → tomllib, configparser or json, then set_defaults(**config)',
      'Values that may legitimately start with the prefix character (an @mention, an email handle) → pick another prefix or none',
    ],
  },

  notes: {
    cpython:      '_read_args_from_files opens each @file with sys.getfilesystemencoding() and its error handler, calls convert_arg_line_to_args for every line of read().splitlines(), then expands @references inside the result recursively; an OSError becomes ArgumentError(None, str(err))',
    'Encoding':   "the file is decoded with sys.getfilesystemencoding(): 'utf-8' on Windows and macOS, and on Linux whenever the locale is UTF-8 (or Python runs in UTF-8 mode)",
    'Platform':   'whether a name such as ARGS.TXT finds args.txt is up to the file system: case-insensitive on Windows and by default on macOS, case-sensitive on Linux',
  },

  related: [
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'fromfile_prefix_chars=' },
    { name: 'parse_args()', slug: 'parse_args', when: 'Where the @file words are expanded' },
    { name: 'set_defaults()', slug: 'set_defaults', when: 'Defaults from a real config file' },
    { name: 'str.split()', slug: 'split', when: 'The whitespace split of the documentation recipe', category: 'functions' },
    { name: 'FileNotFoundError', slug: 'filenotfounderror', when: 'The OSError behind "No such file or directory"', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I read command-line arguments from a file with argparse?',
      a: "Create the parser with fromfile_prefix_chars='@' and pass @filename on the command line. By default every line of the file is exactly one argument, so put an option and its value on separate lines, or override convert_arg_line_to_args to split lines into words.",
    },
    {
      q: 'Why is my "--name value" line in an argument file not recognized?',
      a: "Because the default convert_arg_line_to_args returns [arg_line]: the whole line is one argument containing a space, which matches no option. Override the method with return arg_line.split() (or shlex.split(arg_line, comments=True) to also support quotes and # comments).",
    },
    {
      q: 'Can an argument file contain comments?',
      a: 'Not with the default conversion: a line starting with # is just an argument. Return shlex.split(arg_line, comments=True) from convert_arg_line_to_args and both whole-line and trailing # comments are ignored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.convert_arg_line_to_args',
    meta:  'ArgumentParser.convert_arg_line_to_args',
  },

};
