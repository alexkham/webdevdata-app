// content/reference/python/stdlib/argparse/add_subparsers.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

export const meta = {
  slug:        'add_subparsers',
  name:        'ArgumentParser.add_subparsers',
  signature:   'ArgumentParser.add_subparsers(*, title, description, prog, parser_class, action, dest, required=False, help, metavar)',
  blurb:       'Give a program git-style subcommands: each add_parser() call creates a complete ArgumentParser for one command, chosen by the first positional word.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.2+ (required= 3.7, deprecated= 3.13)',
  searchTerms: 'argparse add_subparsers ArgumentParser.add_subparsers add_parser subcommands sub-commands subparsers git style commands aliases dest required set_defaults func dispatch command name which subcommand was used _SubParsersAction choices invalid choice',
};

export const method = {
  slug:      'add_subparsers',
  name:      'ArgumentParser.add_subparsers',
  signature: 'ArgumentParser.add_subparsers(*, title, description, prog, parser_class, action, dest, required=False, help, metavar)',
  returns:   { type: '_SubParsersAction', desc: 'A special action object; call its add_parser(name, help=..., aliases=[...], **parser_kwargs) once per command to get that command\'s ArgumentParser.' },

  category:    'ArgumentParser method',
  version:     'Python 3.2+ (required= 3.7, deprecated= 3.13)',
  hasLiveDemo: true,

  subtitle: "A subcommand is a positional argument whose value picks another parser. The main parser reads its own options up to the command word, then hands every remaining word to that command's parser and copies the result into the same Namespace. Set dest= to learn which command ran, and required=True to insist on one.",

  covers: ['ArgumentParser.add_subparsers'],

  cheat: {
    commonCall: "commands = parser.add_subparsers(dest='command', required=True)\nadd = commands.add_parser('add', help='stage files')",
    returns:    'a _SubParsersAction; add_parser() returns an ArgumentParser',
    replaces:   'if sys.argv[1] == "add": ... chains',
    watchOut:   'Without dest= the chosen command is not stored anywhere',
  },

  parameters: [
    { name: 'dest',         type: 'str',  required: false, default: 'None', desc: 'Attribute that receives the command word as typed (an alias stays an alias). None stores nothing.' },
    { name: 'required',     type: 'bool', required: false, default: 'False', desc: 'Exit with "the following arguments are required" when no command is given (3.7+). With False the attribute is None.' },
    { name: 'title',        type: 'str',  required: false, default: 'None', desc: 'Puts the command list in its own help section with this heading instead of under "positional arguments".' },
    { name: 'description',  type: 'str',  required: false, default: 'None', desc: 'Text under the title; giving only a description uses the title "subcommands".' },
    { name: 'help',         type: 'str',  required: false, default: 'None', desc: 'Help text for the command argument as a whole.' },
    { name: 'metavar',      type: 'str',  required: false, default: 'None', desc: 'Name shown in usage and help instead of {cmd1,cmd2,...}.' },
    { name: 'prog',         type: 'str',  required: false, default: 'None', desc: 'Prefix of every subparser\'s prog; None means the main prog plus any positionals before the command (e.g. "tool config").' },
    { name: 'parser_class', type: 'type', required: false, default: 'None', desc: 'Class used by add_parser(); None means the class of the main parser.' },
    { name: 'action',       type: 'type', required: false, default: 'None', desc: 'A replacement for the _SubParsersAction class (rarely needed).' },
  ],

  modes: [
    {
      id: 'pkg',
      label: 'a package manager',
      blurb: 'install and remove, each with an alias and options of its own; -q belongs to the main parser. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='pkg')\nparser.add_argument('-q', '--quiet', action='store_true')\ncommands = parser.add_subparsers(title='commands', dest='command', metavar='COMMAND')\ninstall = commands.add_parser('install', aliases=['i'], help='install packages')\ninstall.add_argument('names', nargs='+')\ninstall.add_argument('-U', '--upgrade', action='store_true')\nremove = commands.add_parser('remove', aliases=['rm'], help='remove packages')\nremove.add_argument('names', nargs='+')\nremove.add_argument('-y', '--yes', action='store_true')\n" + TAIL,
      cases: [
        { id: 'install', label: 'install requests',      values: { cmdline: 'install requests' } },
        { id: 'alias',   label: 'i -U requests httpx',   values: { cmdline: 'i -U requests httpx' } },
        { id: 'quiet',   label: '-q rm -y old',          values: { cmdline: '-q rm -y old' } },
        { id: 'late',    label: '-q after the command',  values: { cmdline: 'install requests -q' } },
        { id: 'none',    label: 'no command',            values: { cmdline: '' } },
        { id: 'typo',    label: 'instal requests',       values: { cmdline: 'instal requests' } },
        { id: 'help',    label: '-h',                    values: { cmdline: '-h' } },
        { id: 'subhelp', label: 'remove -h',             values: { cmdline: 'remove -h' } },
      ],
    },
    {
      id: 'shared',
      label: 'same dest twice',
      blurb: 'Both the main parser and the run command define --user. Try giving it before and after the command.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--user', default='me')\ncommands = parser.add_subparsers(dest='command')\nrun = commands.add_parser('run')\nrun.add_argument('--user', default='root')\n" + TAIL,
      cases: [
        { id: 'before', label: '--user ada run',  values: { cmdline: '--user ada run' } },
        { id: 'after',  label: 'run --user bob',  values: { cmdline: 'run --user bob' } },
        { id: 'bare',   label: 'run',             values: { cmdline: 'run' } },
        { id: 'nocmd',  label: '--user ada',      values: { cmdline: '--user ada' } },
      ],
    },
  ],
  demoExplainer: "The command word ends the main parser's turn: -q works before it, but after it -q is offered to the install parser, which does not know it, so the result is \"unrecognized arguments: -q\". The alias i is stored as typed (command='i'). With no command the attribute is None, because required defaults to False. A typo is an invalid choice, listed without quotes in 3.13 (3.12 printed 'install', 'i', ...). remove -h prints the subparser's own help, whose prog is \"pkg remove\". In the second tab the run parser starts from a fresh Namespace and copies everything it has, its default included, over the main parser's values, so --user ada before run is lost.",

  patterns: [
    {
      name: 'Dispatch with set_defaults(func=...)',
      desc: 'Each subparser stores its handler; after parsing, one call runs the right one.',
      code: "commands = parser.add_subparsers(dest='command', required=True)\np = commands.add_parser('add', help='stage files')\np.add_argument('paths', nargs='+')\np.set_defaults(func=cmd_add)\np = commands.add_parser('commit', help='record changes')\np.add_argument('-m', '--message', required=True)\np.set_defaults(func=cmd_commit)\nargs = parser.parse_args()\nargs.func(args)",
    },
    {
      name: 'Options every command accepts',
      desc: 'A parent parser (add_help=False) passed to each add_parser, so -v works after the command too.',
      code: "common = argparse.ArgumentParser(add_help=False)\ncommon.add_argument('-v', '--verbose', action='store_true')\nfor name in ('build', 'test', 'deploy'):\n    commands.add_parser(name, parents=[common])",
    },
    {
      name: 'Nested subcommands',
      desc: 'A subparser can have subparsers of its own: app remote add NAME URL.',
      code: "remote = commands.add_parser('remote')\nremote_cmds = remote.add_subparsers(dest='remote_command', required=True)\nadd = remote_cmds.add_parser('add')\nadd.add_argument('name')\nadd.add_argument('url')",
    },
  ],

  examples: [
    { title: 'dest= stores the command name', code: "import argparse\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command')\nadd = commands.add_parser('add')\nadd.add_argument('paths', nargs='+')\ncommit = commands.add_parser('commit')\ncommit.add_argument('-m', '--message')\n(parser.parse_args(['add', 'a.txt', 'b.txt']), parser.parse_args(['commit', '-m', 'fix']))", returns: "(Namespace(command='add', paths=['a.txt', 'b.txt']), Namespace(command='commit', message='fix'))" },
    { title: 'Without dest the name is not stored', code: "import argparse\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers()\nadd = commands.add_parser('add')\nadd.add_argument('paths', nargs='+')\nparser.parse_args(['add', 'a.txt'])", returns: "Namespace(paths=['a.txt'])" },
    { title: 'Aliases are stored as typed', code: "import argparse\nparser = argparse.ArgumentParser(prog='pkg')\ncommands = parser.add_subparsers(dest='command')\nremove = commands.add_parser('remove', aliases=['rm', 'uninstall'])\nremove.add_argument('name')\nparser.parse_args(['rm', 'requests'])", returns: "Namespace(command='rm', name='requests')" },
    { title: 'Dispatch with set_defaults(func=...)', code: "import argparse\ndef add(args):\n    print('adding', args.paths)\ndef commit(args):\n    print('committing:', args.message)\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(required=True)\np = commands.add_parser('add')\np.add_argument('paths', nargs='+')\np.set_defaults(func=add)\np = commands.add_parser('commit')\np.add_argument('-m', '--message', default='wip')\np.set_defaults(func=commit)\nfor argv in (['add', 'a.txt'], ['commit', '-m', 'first']):\n    args = parser.parse_args(argv)\n    args.func(args)", returns: "adding ['a.txt']\ncommitting: first" },
    { title: 'No command: None, unless required=True', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command')\ncommands.add_parser('status')\nprint(parser.parse_args([]))\ncommands.required = True\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args([])\nexcept SystemExit as e:\n    print(e.code, err.getvalue().splitlines()[-1])", returns: "Namespace(command=None)\n2 git: error: the following arguments are required: command" },
    { title: 'Unknown commands are invalid choices', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command')\ncommands.add_parser('add')\ncommands.add_parser('commit')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['push'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", returns: "git: error: argument command: invalid choice: 'push' (choose from add, commit)" },
    { title: 'The command list in -h (width fixed at 60)', code: "import argparse, os\nparser = argparse.ArgumentParser(prog='pkg', description='A tiny package manager.')\ncommands = parser.add_subparsers(title='commands', dest='command', metavar='COMMAND')\ncommands.add_parser('install', aliases=['i'], help='install packages')\ncommands.add_parser('remove', aliases=['rm'], help='remove packages')\ncommands.add_parser('list', help='show what is installed')\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    parser.print_help()\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved", returns: "usage: pkg [-h] COMMAND ...\n\nA tiny package manager.\n\noptions:\n  -h, --help     show this help message and exit\n\ncommands:\n  COMMAND\n    install (i)  install packages\n    remove (rm)  remove packages\n    list         show what is installed" },
    { title: 'Each subparser has its own prog and errors', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command')\ncommit = commands.add_parser('commit', help='record changes')\ncommit.add_argument('-m', '--message', required=True)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['commit'])\nexcept SystemExit:\n    print(err.getvalue(), end='')", returns: "usage: git commit [-h] -m MESSAGE\ngit commit: error: the following arguments are required: -m/--message" },
  ],

  pitfalls: [
    {
      name: 'Main-parser options after the command',
      desc: 'Once the command word is seen, every later word belongs to the subparser. An option only the main parser knows is then unrecognized.',
      wrong: { label: 'option on the main parser', code: "import argparse, contextlib, io\nparser = argparse.ArgumentParser(prog='pkg')\nparser.add_argument('-q', '--quiet', action='store_true')\ncommands = parser.add_subparsers(dest='command')\ninstall = commands.add_parser('install')\ninstall.add_argument('name')\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        parser.parse_args(['install', 'requests', '-q'])\nexcept SystemExit:\n    print(err.getvalue().splitlines()[-1])", output: 'pkg: error: unrecognized arguments: -q' },
      fix:   { label: 'parents=[common]', code: "import argparse\ncommon = argparse.ArgumentParser(add_help=False)\ncommon.add_argument('-q', '--quiet', action='store_true')\nparser = argparse.ArgumentParser(prog='pkg')\ncommands = parser.add_subparsers(dest='command')\ninstall = commands.add_parser('install', parents=[common])\ninstall.add_argument('name')\nparser.parse_args(['install', 'requests', '-q'])", output: "Namespace(command='install', quiet=True, name='requests')" },
    },
    {
      name: 'The same dest in the main parser and a subparser',
      desc: "The subparser parses into a fresh Namespace and copies every attribute back, defaults included, so it overwrites the main parser's value even when the user typed one.",
      wrong: { label: 'both use --user', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--user', default='me')\ncommands = parser.add_subparsers(dest='command')\nrun = commands.add_parser('run')\nrun.add_argument('--user', default='root')\nparser.parse_args(['--user', 'ada', 'run'])", output: "Namespace(user='root', command='run')" },
      fix:   { label: 'distinct dests', code: "import argparse\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--user', default='me')\ncommands = parser.add_subparsers(dest='command')\nrun = commands.add_parser('run')\nrun.add_argument('--run-as', default='root')\nparser.parse_args(['--user', 'ada', 'run'])", output: "Namespace(user='ada', command='run', run_as='root')" },
    },
    {
      name: 'Dispatching when no command was given',
      desc: 'Subcommands are optional by default. With no command, no subparser runs, so its set_defaults(func=...) never happens.',
      wrong: { label: 'required=False', code: "import argparse\ndef status(args):\n    print('all clean')\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers()\ncommands.add_parser('status').set_defaults(func=status)\nargs = parser.parse_args([])\nargs.func(args)", output: "AttributeError: 'Namespace' object has no attribute 'func'" },
      fix:   { label: 'required=True', code: "import argparse, contextlib, io\ndef status(args):\n    print('all clean')\nparser = argparse.ArgumentParser(prog='git')\ncommands = parser.add_subparsers(dest='command', required=True)\ncommands.add_parser('status').set_defaults(func=status)\nerr = io.StringIO()\ntry:\n    with contextlib.redirect_stderr(err):\n        args = parser.parse_args([])\nexcept SystemExit as e:\n    print(e.code, err.getvalue().splitlines()[-1])", output: '2 git: error: the following arguments are required: command' },
    },
  ],

  when: {
    use: [
      'Tools that do several different jobs with different arguments (git add / git commit)',
      'Grouping a family of scripts under one entry point',
    ],
    avoid: [
      'A handful of mutually exclusive modes with the same arguments → choices= or add_mutually_exclusive_group()',
      'Options that must work anywhere on the line → add them to every subparser via parents=',
    ],
  },

  notes: {
    cpython:       '_SubParsersAction is a positional with nargs=PARSER (A...): it takes the command word plus every word after it, runs the chosen parser\'s parse_known_args on the rest in a new Namespace, and setattr()s each result on the main one; unknown words are handed back up to the main parser',
    'add_parser':  'add_parser(name, *, deprecated=False, **kwargs): help= and aliases= are taken out of kwargs, the rest go to the parser class; prog defaults to "<main prog> <name>"; a command without help= appears in {...} but gets no line of its own in -h; deprecated=True (3.13) prints "<prog>: warning: command \'<name>\' is deprecated" when used',
    'Errors':      "invalid choice lists the commands without quotes in 3.13 and with quotes in 3.12. A second add_subparsers() call raises argparse.ArgumentError('cannot have multiple subparser arguments') in 3.13; 3.12 printed it as a usage error and exited with status 2",
    'Prefixes':    'command words must be typed in full: inst is an invalid choice even when install is the only command; prefix matching (allow_abbrev) applies to option strings only',
  },

  related: [
    { name: 'set_defaults()', slug: 'set_defaults', when: 'Attach a handler or extra values to each subcommand' },
    { name: 'ArgumentParser', slug: 'argumentparser', when: 'parents= for options shared by every command' },
    { name: 'nargs', slug: 'nargs', when: 'PARSER (A...): the nargs of the subcommand argument' },
    { name: 'parse_known_args()', slug: 'parse_known_args', when: 'What each subparser runs on its words' },
    { name: 'parse_intermixed_args()', slug: 'parse_intermixed_args', when: 'Not available with subparsers' },
  ],

  faq: [
    {
      q: 'How do I add subcommands to a Python command-line tool?',
      a: "Call commands = parser.add_subparsers(dest='command', required=True), then commands.add_parser('name', help='...') once per command. Each add_parser returns a normal ArgumentParser: add that command's arguments to it. parse_args() then returns one Namespace with the main options, the command name and the chosen command's arguments.",
    },
    {
      q: 'How do I find out which subcommand was used?',
      a: "Pass dest= to add_subparsers: args.command is then the word the user typed (an alias stays an alias). The more common design is p.set_defaults(func=handler) on each subparser and args.func(args) after parsing, which needs no if/elif chain.",
    },
    {
      q: 'Why does argparse say "unrecognized arguments" for an option I defined?',
      a: 'With subcommands, an option defined on the main parser must come before the command word. Everything after the command is parsed by the subparser. Add shared options to every subparser through a parent parser (parents=[common]) if they should work anywhere.',
    },
    {
      q: 'How do I make the subcommand required?',
      a: "add_subparsers(required=True), available since Python 3.7. Give dest= as well: the error then says \"the following arguments are required: command\"; without dest it shows the choices, such as {add,commit}.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_subparsers',
    meta:  'ArgumentParser.add_subparsers',
  },

};
