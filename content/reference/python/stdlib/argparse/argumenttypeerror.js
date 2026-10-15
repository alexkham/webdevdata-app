// content/reference/python/stdlib/argparse/argumenttypeerror.js

// Shared tail of the demo templates: parse the reader's command line with
// COLUMNS fixed at 60, capture what the program prints, turn SystemExit
// into (exit status, printed lines).
const TAIL = "out = io.StringIO()\nsaved = os.environ.get('COLUMNS')\nos.environ['COLUMNS'] = '60'  # help text wraps at the terminal width\ntry:\n    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):\n        result = parser.parse_args(shlex.split({$cmdline}))\nexcept SystemExit as e:\n    result = (e.code, out.getvalue().splitlines())\nfinally:\n    if saved is None:\n        del os.environ['COLUMNS']\n    else:\n        os.environ['COLUMNS'] = saved\nresult";

const PORT = "def port(text):\n    number = int(text)\n    if not 1 <= number <= 65535:\n        raise argparse.ArgumentTypeError(f'{number} is not between 1 and 65535')\n    return number\n\n";

export const meta = {
  slug:        'argumenttypeerror',
  name:        'argparse.ArgumentTypeError',
  signature:   'argparse.ArgumentTypeError(message)',
  blurb:       'Raise it from a type= function to reject a command-line value with your own message; argparse turns it into a normal "argument --x: message" usage error.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'argparse ArgumentTypeError type= function validate argument value custom error message argparse validation range check invalid value raise ArgumentTypeError type function error invalid int value',
};

export const method = {
  slug:      'argumenttypeerror',
  name:      'argparse.ArgumentTypeError',
  signature: 'argparse.ArgumentTypeError(message)',

  category:    'argparse exception',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'A type= function can fail in two ways. Raise ValueError or TypeError and argparse prints a generic "invalid <function name> value: \'...\'"; raise ArgumentTypeError and your message is printed as is. Either way the program exits with status 2 — or, with exit_on_error=False, you get an ArgumentError.',

  covers: ['ArgumentTypeError'],

  chain: ['BaseException', 'Exception', 'ArgumentTypeError'],

  cheat: {
    raisedBy: 'your own type= functions (argparse.FileType raises it for files it cannot open)',
    message:  'argument --port: 70000 is not between 1 and 65535',
    quickFix: "raise argparse.ArgumentTypeError(f'{value} is not ...') inside the type function",
    watchOut: 'Other exceptions (OSError, KeyError …) are not translated — they crash',
  },

  parameters: [
    { name: 'message', type: 'str', required: false, default: null, desc: 'Shown after "argument NAME: ". It is str(exception), so pass exactly one string.' },
  ],

  modes: [
    {
      id: 'port',
      label: 'validate a port',
      blurb: 'port() converts with int() and rejects numbers outside 1–65535 with ArgumentTypeError. Type a command line.',
      params: [{ name: 'cmdline', type: 'str', hint: 'arguments after the program name', input: 'text' }],
      template: "import argparse, contextlib, io, os, shlex\n\n" + PORT + "parser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--port', type=port, default=8080)\n" + TAIL,
      cases: [
        { id: 'ok',     label: '443',          values: { cmdline: '--port 443' } },
        { id: 'range',  label: '70000',        values: { cmdline: '--port 70000' } },
        { id: 'zero',   label: '0',            values: { cmdline: '--port 0' } },
        { id: 'word',   label: 'http',         values: { cmdline: '--port http' } },
        { id: 'spaces', label: '" 22 "',       values: { cmdline: '--port " 22 "' } },
        { id: 'digits', label: 'Arabic-Indic', values: { cmdline: '--port ٨٠' } },
        { id: 'none',   label: 'nothing',      values: { cmdline: '' } },
      ],
    },
  ],
  demoExplainer: "The range check produces your message: \"argument --port: 70000 is not between 1 and 65535\". For http it is int() that fails with ValueError, and argparse replaces that message with its own, built from the function's __name__: \"invalid port value: 'http'\". int() itself is generous — surrounding spaces and non-ASCII decimal digits such as ٨٠ are accepted, giving 22 and 80. The default 8080 is an int, so it is stored without calling port(); only str defaults pass through type=.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The constructor arguments; str(e) — what argparse prints — is args[0] when there is exactly one' },
  ],

  patterns: [
    {
      name: 'A range-checked number',
      desc: 'Convert first, then validate, then return the converted value.',
      code: "import argparse\n\ndef percent(text):\n    value = float(text)\n    if not 0 <= value <= 100:\n        raise argparse.ArgumentTypeError(f'{value} is not between 0 and 100')\n    return value\n\nparser.add_argument('--quality', type=percent, default=90.0)",
    },
    {
      name: 'Keep the original error message',
      desc: 'Re-raise a ValueError as ArgumentTypeError so its text reaches the user.',
      code: "import argparse, ipaddress\n\ndef address(text):\n    try:\n        return ipaddress.ip_address(text)\n    except ValueError as e:\n        raise argparse.ArgumentTypeError(str(e)) from None",
    },
    {
      name: 'Parse a structured value',
      desc: 'One type function can split, convert and validate.',
      code: "import argparse\n\ndef size(text):\n    w, sep, h = text.partition('x')\n    if not sep or not (w.isdigit() and h.isdigit()):\n        raise argparse.ArgumentTypeError(f'expected WIDTHxHEIGHT, got {text!r}')\n    return int(w), int(h)",
    },
  ],

  examples: [
    { title: 'Your message, versus the generic one', code: "import argparse\n\n" + PORT + "parser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--port', type=port)\nresults = []\nfor value in ['8080', '70000', 'http']:\n    try:\n        results.append(parser.parse_args(['--port', value]).port)\n    except argparse.ArgumentError as e:\n        results.append(str(e))\nresults", returns: "[8080, 'argument --port: 70000 is not between 1 and 65535', \"argument --port: invalid port value: 'http'\"]" },
    { title: 'A ValueError message is replaced', code: "import argparse\n\ndef even(text):\n    n = int(text)\n    if n % 2:\n        raise ValueError(f'{n} is odd')\n    return n\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('n', type=even)\nparser.parse_args(['3'])", returns: "argparse.ArgumentError: argument n: invalid even value: '3'" },
    { title: 'A lambda is called <lambda> in messages', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--ratio', type=lambda s: float(s) / 100)\nparser.parse_args(['--ratio', 'half'])", returns: "argparse.ArgumentError: argument --ratio: invalid <lambda> value: 'half'" },
    { title: 'str defaults go through the type function too', code: "import argparse\n\ndef wh(text):\n    w, _, h = text.partition('x')\n    try:\n        return int(w), int(h)\n    except ValueError:\n        raise argparse.ArgumentTypeError(f'expected WIDTHxHEIGHT, got {text!r}') from None\n\nparser = argparse.ArgumentParser(prog='app')\nparser.add_argument('--size', type=wh, default='800x600')\n(parser.parse_args([]).size, parser.parse_args(['--size', '1024x768']).size)", returns: '((800, 600), (1024, 768))' },
    { title: 'Not a ValueError subclass', code: 'import argparse\nissubclass(argparse.ArgumentTypeError, ValueError)', returns: 'False' },
    { title: 'Two arguments print as a tuple', code: "import argparse\n\ndef size(text):\n    raise argparse.ArgumentTypeError('sizes look like 800x600', 'extra')\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--size', type=size)\nparser.parse_args(['--size', 'big'])", returns: "argparse.ArgumentError: argument --size: ('sizes look like 800x600', 'extra')" },
    { title: 'Raised outside a parser, it is an ordinary exception', code: "import argparse\nraise argparse.ArgumentTypeError('not a valid date')", returns: 'argparse.ArgumentTypeError: not a valid date' },
  ],

  pitfalls: [
    {
      name: 'Losing a useful ValueError message',
      desc: "Library functions often explain what is wrong, but argparse throws a ValueError's text away and prints \"invalid <name> value\". Wrap the call and re-raise as ArgumentTypeError.",
      wrong: { label: 'type=ipaddress.ip_address', code: "import argparse, ipaddress\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--host', type=ipaddress.ip_address)\nparser.parse_args(['--host', '300.1.1.1'])", output: "argparse.ArgumentError: argument --host: invalid ip_address value: '300.1.1.1'" },
      fix:   { label: 'ArgumentTypeError(str(e))', code: "import argparse, ipaddress\n\ndef address(text):\n    try:\n        return ipaddress.ip_address(text)\n    except ValueError as e:\n        raise argparse.ArgumentTypeError(str(e)) from None\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--host', type=address)\nparser.parse_args(['--host', '300.1.1.1'])", output: "argparse.ArgumentError: argument --host: '300.1.1.1' does not appear to be an IPv4 or IPv6 address" },
    },
    {
      name: 'A type function that raises something else',
      desc: 'Only ArgumentTypeError, ValueError and TypeError become usage errors. type=open on a missing file escapes as FileNotFoundError with a traceback. Take a path and open it after parsing (or catch OSError and raise ArgumentTypeError).',
      wrong: { label: 'type=open', code: "import argparse\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--config', type=open)\nparser.parse_args(['--config', 'missing.json'])", output: "FileNotFoundError: [Errno 2] No such file or directory: 'missing.json'" },
      fix:   { label: 'type=pathlib.Path', code: "import argparse, pathlib\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--config', type=pathlib.Path)\nargs = parser.parse_args(['--config', 'missing.json'])\nargs.config.exists()", output: 'False' },
    },
    {
      name: 'Raising it without a message',
      desc: 'str() of an argument-less exception is empty, so the user sees only the argument name.',
      wrong: { label: 'raise ArgumentTypeError', code: "import argparse\n\ndef level(text):\n    if text not in ('low', 'high'):\n        raise argparse.ArgumentTypeError\n    return text\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--level', type=level)\nparser.parse_args(['--level', 'mid'])", output: 'argparse.ArgumentError: argument --level: ' },
      fix:   { label: 'with a message', code: "import argparse\n\ndef level(text):\n    if text not in ('low', 'high'):\n        raise argparse.ArgumentTypeError(f'{text!r} is not low or high')\n    return text\n\nparser = argparse.ArgumentParser(prog='app', exit_on_error=False)\nparser.add_argument('--level', type=level)\nparser.parse_args(['--level', 'mid'])", output: "argparse.ArgumentError: argument --level: 'mid' is not low or high" },
    },
  ],

  when: {
    use: [
      'Range and format checks on a single value, with a message that says what is allowed',
      'Turning a library ValueError into a readable usage error',
    ],
    avoid: [
      'A fixed set of allowed values → choices=',
      'Checks involving several arguments → validate after parse_args and call parser.error()',
    ],
  },

  notes: {
    cpython:          'class ArgumentTypeError(Exception) in Lib/argparse.py. ArgumentParser._get_value catches it and raises ArgumentError(action, str(err)); ValueError/TypeError become ArgumentError(action, "invalid %(type)s value: %(value)r") with the function\'s __name__',
    'Where it runs':  'type= is applied to each command-line word and to str defaults of absent arguments (after parsing), never to non-str defaults',
  },

  related: [
    { name: 'ArgumentError', slug: 'argumenterror', when: 'What it is converted into' },
    { name: 'add_argument()', slug: 'add_argument', when: 'type= and choices=' },
    { name: 'FileType', slug: 'filetype', when: 'Raises it for files it cannot open' },
    { name: 'parser.error()', slug: 'error', when: 'Errors that involve several arguments' },
    { name: 'ValueError', slug: 'valueerror', when: 'Also accepted from type functions', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I validate an argparse argument with a custom message?',
      a: 'Write a type function that converts the text, checks it, and raises argparse.ArgumentTypeError("your message") when it is invalid; pass it as type=. argparse prints "prog: error: argument --x: your message" and exits with status 2.',
    },
    {
      q: 'ArgumentTypeError or ValueError in a type function?',
      a: 'Both are reported as usage errors. ValueError (and TypeError) produce a generic "invalid NAME value: \'text\'" message; ArgumentTypeError shows your own text. Use ArgumentTypeError when the reason matters to the user.',
    },
    {
      q: 'Why does my type function get called for the default value?',
      a: 'argparse converts str defaults with type= when the argument is absent, so default="8080" with type=int ends up as 8080. Non-str defaults are stored as they are.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/argparse.html#argparse.ArgumentTypeError',
    meta:  'argparse.ArgumentTypeError',
  },

};
