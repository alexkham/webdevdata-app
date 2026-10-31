// content/reference/python/stdlib/configparser/converters.js — converters, ConverterMapping

export const meta = {
  slug:        'converters',
  name:        'ConfigParser.converters',
  signature:   "ConfigParser(converters={'name': callable}) · config.converters['name'] = callable · config.getname(section, option) · config[section].getname(option)",
  blurb:       'Register type conversions by name: each converter adds a get<name>() method to the parser and to every section proxy. config.converters is the ConverterMapping that holds them.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 3.5+',
  searchTerms: 'configparser converters ConverterMapping RawConfigParser.converters getlist getdecimal getpath custom getter configparser list value comma separated python ini decimal converter get<name> incompatible key',
};

export const method = {
  slug:      'converters',
  name:      'ConfigParser.converters',
  signature: "configparser.ConfigParser(converters={'list': lambda value: value.split(',')})",
  returns:   { type: 'ConverterMapping', desc: 'config.converters: a MutableMapping of name → callable (None for the built-in boolean, float and int).' },

  category:    'ConfigParser attribute',
  version:     'Python 3.5+',
  hasLiveDemo: true,

  subtitle: 'A converter is any callable taking the value string. Registering it under "list" creates config.getlist(section, option, *, raw, vars, fallback) and proxy.getlist(option, fallback=None), built from the same machinery as getint — so fallback= and raw= work, and only missing keys use the fallback.',

  covers: ['RawConfigParser.converters', 'ConverterMapping'],

  cheat: {
    commonCall: "configparser.ConfigParser(converters={'decimal': decimal.Decimal})",
    returns:    "a parser with getdecimal(); config['shop'].getdecimal('price')",
    replaces:   'Decimal(config.get(...)) at every call site',
    watchOut:   'proxies created before a converter was added still get it; the parser keeps getint even if "int" is deleted',
  },

  parameters: [
    { name: 'converters', type: 'dict[str, callable]', required: false, default: '{}', desc: 'Constructor argument: name → function(str) → value. The name must be a non-empty str; it becomes the suffix of get<name>.' },
  ],

  modes: [
    {
      id: 'getlist',
      label: 'a list converter',
      blurb: 'Split a comma-separated value into a list, from the parser and from the section proxy.',
      params: [{ name: 'hosts', type: 'str', hint: 'comma-separated text', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser(converters={'list': lambda value: [item.strip() for item in value.split(',')]})\nconfig.read_dict({'app': {'hosts': {$hosts}}})\n(config.getlist('app', 'hosts'), config['app'].getlist('hosts'), config['app'].getlist('missing'))",
      cases: [
        { id: 'three',  label: 'three hosts',  values: { hosts: 'a.example, b.example ,c.example' } },
        { id: 'one',    label: 'one',          values: { hosts: 'localhost' } },
        { id: 'empty',  label: 'empty',        values: { hosts: '' } },
        { id: 'commas', label: 'extra commas', values: { hosts: 'a,,b,' } },
      ],
    },
    {
      id: 'register',
      label: 'register at runtime',
      blurb: 'Add str.upper under a name of your choice, then call get<name> on a section.',
      params: [{ name: 'name', type: 'str', hint: 'converter name', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.converters[{$name}] = str.upper\nconfig.read_string('[s]\\nkey = value')\n(list(config.converters), getattr(config['s'], 'get' + {$name})('key'))",
      cases: [
        { id: 'upper', label: 'upper', values: { name: 'upper' } },
        { id: 'int',   label: 'int (replace)', values: { name: 'int' } },
        { id: 'empty', label: "''",    values: { name: '' } },
      ],
    },
  ],
  demoExplainer: "getlist splits on commas and strips each item; a missing key on the proxy returns the fallback, None. ''.split(',') is [''], so an empty value gives [''], and extra commas give empty items — validate if that matters. Registering 'upper' appends it to the mapping after boolean, float and int. Registering 'int' replaces the built-in conversion: getint now returns 'VALUE'. An empty name is refused with ValueError: Incompatible key: cannot use \"\" as a name.",

  patterns: [
    {
      name: 'Exact decimals',
      desc: 'Decimal accepts the value string directly.',
      code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nprice = config['shop'].getdecimal('price', decimal.Decimal('0'))",
    },
    {
      name: 'Paths',
      desc: 'Turn values into pathlib.Path objects.',
      code: "import configparser, pathlib\nconfig = configparser.ConfigParser(converters={'path': pathlib.Path})\nlog_dir = config.getpath('app', 'log_dir', fallback=pathlib.Path('logs'))",
    },
    {
      name: 'Converters that need the parser',
      desc: 'A get<name> method in a subclass is picked up as a converter too, and can use self.',
      code: "import configparser\n\nclass AppConfig(configparser.ConfigParser):\n    def getlines(self, section, option, **kwargs):\n        return self.get(section, option, **kwargs).splitlines()\n\nconfig = AppConfig()\n'lines' in config.converters  # True",
    },
  ],

  examples: [
    { title: 'The built-in entries',          code: 'import configparser\nconfig = configparser.ConfigParser()\n(type(config.converters).__name__, dict(config.converters))', returns: "('ConverterMapping', {'boolean': None, 'float': None, 'int': None})" },
    { title: 'getdecimal from a converter',   code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nconfig.read_string('[shop]\\nprice = 19.99')\n(config.getdecimal('shop', 'price'), config['shop'].getdecimal('price'))", returns: "(Decimal('19.99'), Decimal('19.99'))" },
    { title: 'fallback works as for getint',  code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nconfig.read_string('[shop]')\nconfig.getdecimal('shop', 'tax', fallback=decimal.Decimal('0'))", returns: "Decimal('0')" },
    { title: 'A subclass getter is a converter', code: "import configparser\nclass AppConfig(configparser.ConfigParser):\n    def getlines(self, section, option, **kwargs):\n        return self.get(section, option, **kwargs).splitlines()\nconfig = AppConfig()\nconfig.read_string('[s]\\nhosts = a\\n  b')\n(list(config.converters), config['s'].getlines('hosts'))", returns: "(['boolean', 'float', 'int', 'lines'], ['a', 'b'])" },
    { title: 'Keys must be non-empty strings', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.converters[5] = str", returns: "ValueError: Incompatible key: 5 (type: <class 'int'>)" },
    { title: 'Deleting a converter',          code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nconfig.read_string('[shop]')\ndel config.converters['decimal']\n(list(config.converters), hasattr(config, 'getdecimal'), hasattr(config['shop'], 'getdecimal'))", returns: "(['boolean', 'float', 'int'], False, False)" },
  ],

  pitfalls: [
    {
      name: 'Expecting fallback to cover conversion errors',
      desc: 'As with getint, the fallback is returned only for a missing section or key; an exception from your converter propagates.',
      wrong: { label: 'fallback=0', code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nconfig.read_string('[shop]\\nprice = free')\nconfig.getdecimal('shop', 'price', fallback=decimal.Decimal('0'))", output: "decimal.InvalidOperation: [<class 'decimal.ConversionSyntax'>]" },
      fix:   { label: 'except', code: "import configparser, decimal\nconfig = configparser.ConfigParser(converters={'decimal': decimal.Decimal})\nconfig.read_string('[shop]\\nprice = free')\ntry:\n    price = config.getdecimal('shop', 'price')\nexcept decimal.InvalidOperation:\n    price = decimal.Decimal('0')\nprice", output: "Decimal('0')" },
    },
    {
      name: 'Deleting a built-in converter',
      desc: "del config.converters['int'] removes getint from section proxies, but the parser method getint is defined on the class and stays.",
      wrong: { label: "del converters['int']", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nn = 1')\ndel config.converters['int']\n(config.getint('s', 'n'), config['s'].getint('n'))", output: "AttributeError: 'SectionProxy' object has no attribute 'getint'" },
      fix:   { label: 'leave it, or replace it', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nn = 1')\n(config.getint('s', 'n'), config['s'].getint('n'))", output: '(1, 1)' },
    },
  ],

  when: {
    use: [
      'Several values of the same non-built-in type: lists, Decimal, Path, timedelta',
      'Code that reads config through section proxies: proxy.getlist("hosts")',
    ],
    avoid: [
      'Converters that need parser state → a get<name>(self, section, option, **kwargs) method in a subclass',
      'One-off conversions → convert the value where you use it',
    ],
  },

  notes: {
    cpython:      'ConverterMapping.__setitem__ stores the callable and sets parser.get<name> = functools.partial(parser._get_conv, conv=callable), and get<name> on every existing SectionProxy; new proxies add them in __init__',
    'Built-ins':  'At construction ConverterMapping scans dir(parser) for callables named get<something>: getboolean, getfloat, getint (and subclass getters) appear with the value None',
    'Version':    'converters= and ConverterMapping were added in Python 3.5',
  },

  related: [
    { name: 'getint / getfloat / getboolean', slug: 'get', when: 'The built-in conversions' },
    { name: 'BOOLEAN_STATES', slug: 'boolean_states', when: 'Customize getboolean instead' },
    { name: 'SectionProxy',   slug: 'sectionproxy',   when: 'Proxies get every converter' },
    { name: 'ConfigParser',   slug: 'configparser',   when: 'The converters= argument' },
    { name: 'decimal',        slug: 'decimal',        when: 'Decimal as a converter', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I read a list from a configparser file?',
      a: "Register a converter: ConfigParser(converters={'list': lambda v: [x.strip() for x in v.split(',')]}). Then config.getlist('section', 'key') or config['section'].getlist('key') returns the list.",
    },
    {
      q: 'What is ConverterMapping in configparser?',
      a: 'The object behind config.converters: a mapping of converter names to callables. Adding an entry creates get<name>() on the parser and on all section proxies; deleting it removes them again (except class-defined methods such as getint).',
    },
    {
      q: 'Can a converter use other values from the config?',
      a: 'Not with a plain function — it only receives the value. Define a get<name>(self, section, option, **kwargs) method in a ConfigParser subclass instead; it is registered as a converter automatically and can call self.get.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#customizing-parser-behaviour',
    meta:  'configparser — Customizing Parser Behaviour (converters)',
  },

};
