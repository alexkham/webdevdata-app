// content/reference/python/stdlib/configparser/interpolation.js — Interpolation and its four hooks

export const meta = {
  slug:        'interpolation',
  name:        'configparser.Interpolation',
  signature:   'class configparser.Interpolation · before_get(parser, section, option, value, defaults) · before_set(parser, section, option, value) · before_read(parser, section, option, value) · before_write(parser, section, option, value)',
  blurb:       'The base class of all interpolation handlers: four hooks that see every value as it is read from a file, set, fetched and written. The base versions return the value unchanged — subclass it to transform values your own way.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'configparser Interpolation Interpolation.before_get Interpolation.before_set Interpolation.before_read Interpolation.before_write custom interpolation environment variables in config file expand $HOME configparser hooks subclass python ini',
};

export const method = {
  slug:      'interpolation',
  name:      'configparser.Interpolation',
  signature: 'before_get(self, parser, section, option, value, defaults)',
  returns:   { type: 'str', desc: 'Each hook returns the value to use instead of the one it received.' },

  category:    'configparser class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'A parser calls exactly one interpolation object: before_read once per value after a file is parsed, before_set when set() stores a non-empty value, before_get when get() returns a value (unless raw=True or the value is None), and before_write for every value write() outputs. Interpolation does nothing; BasicInterpolation and ExtendedInterpolation override before_get and before_set; interpolation=None means a plain Interpolation().',

  covers: ['Interpolation', 'Interpolation.before_get', 'Interpolation.before_set', 'Interpolation.before_read', 'Interpolation.before_write'],

  cheat: {
    commonCall: 'class Env(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return os.path.expandvars(value)',
    returns:    'a handler for ConfigParser(interpolation=Env())',
    replaces:   'post-processing every value after get()',
    watchOut:   'hooks must return the value; before_get takes defaults too',
  },

  parameters: [
    { name: 'parser',   type: 'RawConfigParser', required: true,  default: null, desc: 'The parser calling the hook.' },
    { name: 'section',  type: 'str',             required: true,  default: null, desc: 'Section of the value.' },
    { name: 'option',   type: 'str',             required: true,  default: null, desc: 'Key of the value (after optionxform).' },
    { name: 'value',    type: 'str',             required: true,  default: null, desc: 'The value as stored (before_get, before_write) or as about to be stored (before_set, before_read).' },
    { name: 'defaults', type: 'mapping',         required: true,  default: null, desc: 'before_get only: the lookup chain (vars, section, DEFAULT) to resolve references in.' },
  ],

  modes: [
    {
      id: 'env',
      label: 'a custom handler',
      blurb: 'Expand $NAME placeholders from a dict with string.Template. (Pass os.environ instead of ENV for real environment variables.)',
      params: [{ name: 'line', type: 'str', hint: 'a key = value line', input: 'text' }],
      template: "import configparser, string\nENV = {'HOME': '/home/ada', 'USER': 'ada'}\n\nclass EnvInterpolation(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return string.Template(value).safe_substitute(ENV)\n\nconfig = configparser.ConfigParser(interpolation=EnvInterpolation())\nconfig.read_string('[paths]\\n' + {$line})\ndict(config['paths'])",
      cases: [
        { id: 'home',    label: '$HOME',        values: { line: 'data = $HOME/data' } },
        { id: 'braced',  label: '${USER}',      values: { line: 'cache = /tmp/${USER}-cache' } },
        { id: 'unknown', label: 'unknown name', values: { line: 'shell = $SHELL' } },
        { id: 'dollar',  label: '$$ and %',     values: { line: 'price = $$5 (50% off)' } },
      ],
    },
    {
      id: 'hooks',
      label: 'when each hook runs',
      blurb: 'A handler that only records its calls. The snippet reads your lines, sets one value, gets one and writes everything.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
      ],
      template: "import configparser, io\ncalls = []\n\nclass Trace(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        calls.append(f'get {option}')\n        return value\n    def before_set(self, parser, section, option, value):\n        calls.append(f'set {option}')\n        return value\n    def before_read(self, parser, section, option, value):\n        calls.append(f'read {option}')\n        return value\n    def before_write(self, parser, section, option, value):\n        calls.append(f'write {option}')\n        return value\n\nconfig = configparser.ConfigParser(interpolation=Trace())\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}]))\nconfig['app']['added'] = 'yes'\nconfig.get('app', 'added')\nconfig.write(io.StringIO())\ncalls",
      cases: [
        { id: 'basic',   label: 'DEFAULT + app', values: { line1: '[DEFAULT]', line2: 'a = 1', line3: '[app]' } },
        { id: 'two',     label: 'two keys',      values: { line1: '[app]', line2: 'x = 1', line3: 'y = 2' } },
        { id: 'noapp',   label: 'no [app]',      values: { line1: '[web]', line2: 'x = 1', line3: '' } },
      ],
    },
  ],
  demoExplainer: "safe_substitute replaces $HOME and ${USER} and leaves names it does not know ($SHELL) as they are; $$ becomes $, and the % sign is harmless because this handler replaced BasicInterpolation completely. The trace shows the order: one read per value right after parsing (DEFAULT first), set when proxy['added'] = 'yes' stores a value, get for config.get, and one write per value — including DEFAULT values, which write() outputs in their own section. Without an [app] section the assignment fails with KeyError: 'app' after the read calls were recorded.",

  patterns: [
    {
      name: 'Environment variables in values',
      desc: 'Expand $VAR and ${VAR} from the real environment on every get. (os.path.expandvars also works, with its own rules.)',
      code: "import configparser, os, string\n\nclass EnvInterpolation(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return string.Template(value).safe_substitute(os.environ)\n\nconfig = configparser.ConfigParser(interpolation=EnvInterpolation())",
    },
    {
      name: 'Keep %(name)s and add more',
      desc: 'Subclass BasicInterpolation and post-process its result.',
      code: "import configparser, os\n\nclass ExpandUser(configparser.BasicInterpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        value = super().before_get(parser, section, option, value, defaults)\n        return os.path.expanduser(value)",
    },
    {
      name: 'Normalize on read',
      desc: 'before_read runs once per value after parsing — a place for clean-up such as stripping quotes.',
      code: "import configparser\n\nclass Unquote(configparser.Interpolation):\n    def before_read(self, parser, section, option, value):\n        if isinstance(value, str) and len(value) >= 2 and value[0] == value[-1] and value[0] in '\"\\'':\n            return value[1:-1]\n        return value",
    },
  ],

  examples: [
    { title: 'The four hooks',                code: "import configparser\n[name for name in vars(configparser.Interpolation) if not name.startswith('_')]", returns: "['before_get', 'before_set', 'before_read', 'before_write']" },
    { title: 'The base class changes nothing', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.Interpolation())\nconfig.read_string('[p]\\nlogs = %(base)s/logs')\nconfig['p']['logs']", returns: "'%(base)s/logs'" },
    { title: 'The built-in handlers are subclasses', code: "import configparser\n(issubclass(configparser.BasicInterpolation, configparser.Interpolation), issubclass(configparser.ExtendedInterpolation, configparser.Interpolation))", returns: '(True, True)' },
    { title: 'A before_get that uppercases',  code: "import configparser\nclass Upper(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return value.upper()\nconfig = configparser.ConfigParser(interpolation=Upper())\nconfig.read_string('[s]\\nk = value')\n(config['s']['k'], config.get('s', 'k', raw=True))", returns: "('VALUE', 'value')" },
    { title: 'Anything else is refused',      code: "import configparser\nconfigparser.ConfigParser(interpolation=str.upper)", returns: "TypeError: interpolation= must be None or an instance of Interpolation; got an object of type <class 'method_descriptor'>" },
  ],

  pitfalls: [
    {
      name: 'Forgetting defaults in before_get',
      desc: 'The parser always passes five arguments to before_get (the other hooks get four).',
      wrong: { label: 'before_get(self, parser, section, option, value)', code: "import configparser\nclass Upper(configparser.Interpolation):\n    def before_get(self, parser, section, option, value):\n        return value.upper()\nconfig = configparser.ConfigParser(interpolation=Upper())\nconfig.read_string('[s]\\nk = v')\nconfig.get('s', 'k')", output: 'TypeError: Upper.before_get() takes 5 positional arguments but 6 were given' },
      fix:   { label: '… value, defaults)', code: "import configparser\nclass Upper(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return value.upper()\nconfig = configparser.ConfigParser(interpolation=Upper())\nconfig.read_string('[s]\\nk = v')\nconfig.get('s', 'k')", output: "'V'" },
    },
    {
      name: 'A hook that does not return',
      desc: 'The return value replaces the value. Falling off the end returns None.',
      wrong: { label: 'no return', code: "import configparser\nclass Upper(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        value = value.upper()\nconfig = configparser.ConfigParser(interpolation=Upper())\nconfig.read_string('[s]\\nk = v')\nconfig.get('s', 'k') is None", output: 'True' },
      fix:   { label: 'return value', code: "import configparser\nclass Upper(configparser.Interpolation):\n    def before_get(self, parser, section, option, value, defaults):\n        return value.upper()\nconfig = configparser.ConfigParser(interpolation=Upper())\nconfig.read_string('[s]\\nk = v')\nconfig.get('s', 'k')", output: "'V'" },
    },
  ],

  when: {
    use: [
      'Your own placeholder syntax: $ENV variables, ~ expansion, secrets lookups',
      'Validating or normalizing values in one place (before_set, before_read)',
    ],
    avoid: [
      '%(name)s or ${section:name} references → BasicInterpolation / ExtendedInterpolation already do it',
      'Expensive work in before_get — it runs on every get, every time',
    ],
  },

  notes: {
    cpython:      'class Interpolation: four methods that return value. RawConfigParser.__init__ uses _DEFAULT_INTERPOLATION when interpolation is unset, Interpolation() when it is None, and raises TypeError for anything that is not an Interpolation instance',
    'Call sites': 'before_read: _join_multiline_values after every read; before_set: set() for truthy values; before_get: get() and items() unless raw; before_write: _write_section',
    'Raw access': 'get(..., raw=True) and items(..., raw=True) skip before_get entirely',
  },

  related: [
    { name: 'BasicInterpolation',    slug: 'basicinterpolation',    when: 'The default %(name)s handler' },
    { name: 'ExtendedInterpolation', slug: 'extendedinterpolation', when: '${section:name} references' },
    { name: 'ConfigParser',          slug: 'configparser',          when: 'The interpolation= argument' },
    { name: 'InterpolationError',    slug: 'interpolationerror',    when: 'Raise it from your own handler' },
    { name: 'os.environ',            slug: 'environ',               when: 'Expand environment variables', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I use environment variables in a configparser file?',
      a: 'Write a small Interpolation subclass whose before_get expands them, e.g. string.Template(value).safe_substitute(os.environ) or os.path.expandvars(value), and pass an instance as interpolation=. ExtendedInterpolation does not read the environment by itself.',
    },
    {
      q: 'What is the difference between interpolation=None and Interpolation()?',
      a: 'None. The parser replaces None with a plain Interpolation(), whose hooks return values unchanged, so both disable interpolation.',
    },
    {
      q: 'Which methods does a custom interpolation need?',
      a: 'Only the hooks you want to change; inherit the rest from configparser.Interpolation. Most handlers override before_get(self, parser, section, option, value, defaults), and before_set if they want to validate syntax when values are stored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#interpolation-of-values',
    meta:  'configparser — Interpolation of values',
  },

};
