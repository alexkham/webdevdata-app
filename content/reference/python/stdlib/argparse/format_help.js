// content/reference/python/stdlib/argparse/format_help.js

const PARSER = "parser = argparse.ArgumentParser(prog='convert', description='Convert images between formats, resizing them on the way if asked to.')\nparser.add_argument('files', nargs='+', help='images to convert')\nparser.add_argument('-f', '--format', choices=['png', 'jpeg', 'webp'], default='png', help='output format')\nparser.add_argument('-w', '--width', type=int, help='resize to this width, keeping the aspect ratio')\n";

const WIDTH = (call) => "saved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = str(min(max({$columns}, 1), 300))  # read first by shutil.get_terminal_size()\ntry:\n    result = parser." + call + "().splitlines()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'format_help',
  name:        'ArgumentParser.format_help',
  signature:   'ArgumentParser.format_help() / format_usage() / print_help(file=None) / print_usage(file=None)',
  blurb:       'Get the generated help or usage text as a string, or print it (to sys.stdout unless you pass file=). The layout wraps at the terminal width.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse format_help format_usage print_help print_usage ArgumentParser.format_help ArgumentParser.format_usage ArgumentParser.print_help ArgumentParser.print_usage get help text as string print usage show help programmatically help width COLUMNS terminal width wrap',
};

export const method = {
  slug:      'format_help',
  name:      'ArgumentParser.format_help',
  signature: 'ArgumentParser.format_help() / format_usage() / print_help(file=None) / print_usage(file=None)',
  returns:   { type: 'str | None', desc: 'format_help and format_usage return the text (ending with a newline); print_help and print_usage write it and return None.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: "Four ways to get the text -h prints. format_usage() is just the \"usage: ...\" line(s); format_help() adds description, argument sections and epilog. The print_ versions write the same strings to file (default sys.stdout). Every line is wrapped to the terminal width minus 2, which argparse reads through shutil.get_terminal_size() — the COLUMNS environment variable first — so the same parser prints differently in different terminals.",

  covers: ['ArgumentParser.format_help', 'ArgumentParser.format_usage', 'ArgumentParser.print_help', 'ArgumentParser.print_usage'],

  cheat: {
    commonCall: 'parser.print_help()  # or text = parser.format_help()',
    returns:    "'usage: prog [-h] ...\\n\\n...' — a str ending in a newline",
    replaces:   'hand-maintained usage strings',
    watchOut:   'Output depends on COLUMNS / terminal width; print_help returns None',
  },

  parameters: [
    { name: 'file', type: 'text file', required: false, default: 'None', desc: 'print_help / print_usage only: where to write. None means sys.stdout (looked up at call time, so contextlib.redirect_stdout works).' },
  ],

  modes: [
    {
      id: 'width',
      label: 'format_help at any width',
      blurb: 'Set the terminal width (COLUMNS, kept between 1 and 300) and see how the same help is laid out.',
      params: [{ name: 'columns', type: 'int', hint: 'terminal width in columns', input: 'number' }],
      template: "import argparse, os\n" + PARSER + WIDTH('format_help'),
      cases: [
        { id: 'w100', label: '100 columns', values: { columns: '100' } },
        { id: 'w80',  label: '80 columns',  values: { columns: '80' } },
        { id: 'w50',  label: '50 columns',  values: { columns: '50' } },
        { id: 'w30',  label: '30 columns',  values: { columns: '30' } },
        { id: 'w1',   label: '1 column',    values: { columns: '1' } },
      ],
    },
    {
      id: 'usage',
      label: 'format_usage',
      blurb: 'Only the usage part. Long usage lines are broken between arguments, never inside one.',
      params: [{ name: 'columns', type: 'int', hint: 'terminal width in columns', input: 'number' }],
      template: "import argparse, os\n" + PARSER + WIDTH('format_usage'),
      cases: [
        { id: 'w80', label: '80 columns', values: { columns: '80' } },
        { id: 'w50', label: '50 columns', values: { columns: '50' } },
        { id: 'w20', label: '20 columns', values: { columns: '20' } },
      ],
    },
  ],
  demoExplainer: "argparse formats for a width of COLUMNS - 2. At 80 columns the usage fits on one line and option help starts at column 24 (max_help_position); -f, --format {png,jpeg,webp} is too long for that column, so its help moves to the next line. At 50 the usage is split into three lines — once it wraps, the positionals always start a line of their own — and the description and help texts are re-wrapped. At 30 the help column shrinks to 8, so every help text moves under its argument. Very narrow widths never break an argument in the usage line, and text is still given at least 11 columns, so lines overflow instead. COLUMNS is the first thing shutil.get_terminal_size() reads; without it argparse uses the real terminal, or 80 when output is not a terminal.",

  patterns: [
    {
      name: 'Print help when no arguments are given',
      desc: 'A common convention for tools that do nothing useful without arguments.',
      code: "import sys\nif len(sys.argv) == 1:\n    parser.print_help()\n    sys.exit(1)\nargs = parser.parse_args()",
    },
    {
      name: 'Help as a string for a GUI or a test',
      desc: 'Fix the width so the text does not depend on the terminal.',
      code: "import argparse\nparser = argparse.ArgumentParser(formatter_class=lambda prog: argparse.HelpFormatter(prog, width=80))\nhelp_text = parser.format_help()",
    },
    {
      name: 'Usage to stderr with your own message',
      desc: 'parser.error() does this for you; print_usage(sys.stderr) is the manual version.',
      code: "import sys\nparser.print_usage(sys.stderr)\nprint('expected a file name', file=sys.stderr)",
    },
  ],

  examples: [
    { title: 'format_usage returns the usage line', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('src')\nparser.add_argument('-n', '--count', type=int)\nparser.format_usage()", returns: "'usage: app [-h] [-n COUNT] src\\n'" },
    { title: 'The same help at two widths', code: "import argparse, os\n" + PARSER + "saved = os.environ.get('COLUMNS')\ntry:\n    for columns in ('80', '50'):\n        os.environ['COLUMNS'] = columns\n        print(f'--- COLUMNS={columns}')\n        parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: '--- COLUMNS=80\nusage: convert [-h] [-f {png,jpeg,webp}] [-w WIDTH] files [files ...]\n\nConvert images between formats, resizing them on the way if asked to.\n\npositional arguments:\n  files                 images to convert\n\noptions:\n  -h, --help            show this help message and exit\n  -f, --format {png,jpeg,webp}\n                        output format\n  -w, --width WIDTH     resize to this width, keeping the aspect ratio\n--- COLUMNS=50\nusage: convert [-h] [-f {png,jpeg,webp}]\n               [-w WIDTH]\n               files [files ...]\n\nConvert images between formats, resizing them on\nthe way if asked to.\n\npositional arguments:\n  files                 images to convert\n\noptions:\n  -h, --help            show this help message\n                        and exit\n  -f, --format {png,jpeg,webp}\n                        output format\n  -w, --width WIDTH     resize to this width,\n                        keeping the aspect ratio' },
    { title: 'print_usage and print_help take a file', code: "import argparse, io\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('src')\nbuf = io.StringIO()\nparser.print_usage(buf)\nparser.print_help(file=buf)\nbuf.getvalue().splitlines()", returns: "['usage: app [-h] src', 'usage: app [-h] src', '', 'positional arguments:', '  src', '', 'options:', '  -h, --help  show this help message and exit']" },
    { title: 'A custom usage= with %(prog)s', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', usage='%(prog)s [options] FILE...')\nparser.add_argument('files', nargs='+')\nparser.format_usage()", returns: "'usage: app [options] FILE...\\n'" },
    { title: 'usage=SUPPRESS removes the usage part', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', usage=argparse.SUPPRESS, description='Does things.', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\n(parser.format_usage(), parser.format_help())", returns: "('', 'Does things.\\n\\noptions:\\n  -h, --help  show this help message and exit\\n')" },
    { title: 'A fixed width of 40 with a long option', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=40))\nparser.add_argument('-o', '--output', metavar='FILE', help='write the result to FILE instead of standard output')\nprint(parser.format_help())", returns: 'usage: app [-h] [-o FILE]\n\noptions:\n  -h, --help        show this help\n                    message and exit\n  -o, --output FILE\n                    write the result to\n                    FILE instead of\n                    standard output' },
  ],

  pitfalls: [
    {
      name: 'Using print_help() as if it returned the text',
      desc: 'print_help writes and returns None. format_help is the one that returns a string.',
      wrong: { label: 'text = print_help()', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('--name')\ntext = parser.print_help()\ntext is None", output: 'usage: app [-h] [--name NAME]\n\noptions:\n  -h, --help   show this help message and exit\n  --name NAME\nTrue' },
      fix:   { label: 'text = format_help()', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('--name')\ntext = parser.format_help()\ntext.splitlines()[0]", output: "'usage: app [-h] [--name NAME]'" },
    },
    {
      name: 'A bare % in help text',
      desc: 'Help strings are %-formatted (for %(default)s and friends), so "% o" in "% of" is read as a conversion. Write %% for a literal percent sign.',
      wrong: { label: "'% of the price'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--rate', help='discount in % of the price')\nparser.format_help()", output: 'TypeError: %o format: an integer is required, not dict' },
      fix:   { label: "'%% of the price'", code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.add_argument('--rate', help='discount in %% of the price')\nprint(parser.format_help())", output: 'usage: app [-h] [--rate RATE]\n\noptions:\n  -h, --help   show this help message and exit\n  --rate RATE  discount in % of the price' },
    },
    {
      name: 'Comparing format_usage() with the bare usage line',
      desc: 'The returned text keeps its "usage: " prefix and ends with a newline.',
      wrong: { label: '== without newline', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.format_usage() == 'usage: app [-h]'", output: 'False' },
      fix:   { label: ".rstrip('\\n')", code: "import argparse\nparser = argparse.ArgumentParser(prog='app', formatter_class=lambda prog: argparse.HelpFormatter(prog, width=60))\nparser.format_usage().rstrip('\\n') == 'usage: app [-h]'", output: 'True' },
    },
  ],

  when: {
    use: [
      'Showing help without exiting (a REPL command, an empty command line)',
      'Snapshot-testing your CLI — with a fixed width',
      'Embedding the usage in your own error or log messages',
    ],
    avoid: [
      'Reporting an error → parser.error(msg) prints the usage and exits with 2',
      'Printing help and exiting from an option → that is what action="help" (-h) already does',
    ],
  },

  notes: {
    cpython:       'Lib/argparse.py: format_usage/format_help create a formatter with _get_formatter() (formatter_class(prog=self.prog)) and feed it the actions and groups; print_usage/print_help call _print_message(text, file or sys.stdout)',
    'Width':       'HelpFormatter(width=None) uses shutil.get_terminal_size().columns - 2. get_terminal_size() reads the COLUMNS environment variable first, then the terminal of sys.__stdout__, then falls back to 80 — so pipes and CI logs get 78-character lines unless COLUMNS is set',
    'Python 3.14': 'help is colored with ANSI escape sequences when the terminal supports it; pass color=False to ArgumentParser for plain text',
  },

  related: [
    { name: 'HelpFormatter', slug: 'helpformatter', when: 'Change the layout' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'prog, usage, description, epilog' },
    { name: 'parser.error()', slug: 'error', when: 'Usage plus an error message, then exit' },
    { name: 'add_argument_group()', slug: 'add_argument_group', when: 'Sections in the help' },
    { name: 'shutil module', slug: 'shutil', when: 'get_terminal_size() and COLUMNS', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I print the argparse help without exiting?',
      a: 'Call parser.print_help() — it only prints. -h exits because its action calls print_help() and then parser.exit(). To get the text as a string use parser.format_help().',
    },
    {
      q: 'Why does argparse help wrap differently on another machine or in CI?',
      a: 'The width comes from shutil.get_terminal_size(): the COLUMNS environment variable, else the terminal width, else 80. Set COLUMNS or pass formatter_class=lambda prog: argparse.HelpFormatter(prog, width=...) for a fixed layout.',
    },
    {
      q: 'How do I print the help when no arguments are given?',
      a: 'Check len(sys.argv) == 1 before parsing and call parser.print_help() (then sys.exit). Or make a positional required so argparse reports the missing argument itself.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#printing-help',
    meta:  'Printing help',
  },

};
