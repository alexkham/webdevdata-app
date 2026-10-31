// content/reference/python/stdlib/configparser/get.js — get / getint / getfloat / getboolean

export const meta = {
  slug:        'get',
  name:        'ConfigParser.get',
  signature:   'config.get(section, option, *, raw=False, vars=None[, fallback]) · config.getint(…) · config.getfloat(…) · config.getboolean(…)',
  blurb:       'Read one value from a section: get returns the str (interpolated), getint / getfloat / getboolean convert it. fallback= is returned when the section or key is missing.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions (keyword-only raw, vars, fallback 3.2+)',
  searchTerms: 'configparser get getint getfloat getboolean RawConfigParser.get RawConfigParser.getint RawConfigParser.getfloat RawConfigParser.getboolean ConfigParser.get fallback raw vars config get int bool float python read value from ini not a boolean invalid literal for int nooptionerror',
};

export const method = {
  slug:      'get',
  name:      'ConfigParser.get',
  signature: 'config.get(section, option, *, raw=False, vars=None, fallback=<unset>)',
  returns:   { type: 'str | int | float | bool | None', desc: 'get: the value as stored (a str, None for valueless keys). getint / getfloat / getboolean: the converted value. fallback when the section or key does not exist.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions (keyword-only raw, vars, fallback 3.2+)',
  hasLiveDemo: true,

  subtitle: 'Lookup order is vars, then the section, then DEFAULT. The getters are get() followed by a conversion: int(), float(), or a case-insensitive match against BOOLEAN_STATES. fallback covers only a missing section or key — a value that does not convert still raises ValueError.',

  covers: ['RawConfigParser.get', 'RawConfigParser.getint', 'RawConfigParser.getfloat', 'RawConfigParser.getboolean'],

  cheat: {
    commonCall: "config.getint('server', 'port', fallback=8080)",
    returns:    '8080 as an int',
    replaces:   "int(config['server']['port']) with try/except",
    watchOut:   'fallback does not catch a bad value',
  },

  parameters: [
    { name: 'section',  type: 'str',         required: true,  default: null,    desc: 'Section name (case-sensitive). The DEFAULT section name is allowed.' },
    { name: 'option',   type: 'str',         required: true,  default: null,    desc: 'Key; passed through optionxform, so lowercased by default.' },
    { name: 'raw',      type: 'bool',        required: false, default: 'False', desc: 'Keyword-only. True returns the value without interpolation.' },
    { name: 'vars',     type: 'dict | None', required: false, default: 'None',  desc: 'Keyword-only. Values looked up before the section — they also feed interpolation. Converted to str.' },
    { name: 'fallback', type: 'any',         required: false, default: '<unset>', desc: 'Keyword-only. Returned instead of raising NoSectionError / NoOptionError. None is a valid fallback.' },
  ],

  modes: [
    {
      id: 'convert',
      label: 'conversion',
      blurb: 'Store one value, read it back with the getter you name.',
      params: [
        { name: 'value',  type: 'str', hint: 'the stored text', input: 'text' },
        { name: 'getter', type: 'str', hint: 'get, getint, getfloat or getboolean', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'app': {'value': {$value}}})\ngetattr(config, {$getter})('app', 'value')",
      cases: [
        { id: 'int',    label: "getint('42')",       values: { value: '42',      getter: 'getint' } },
        { id: 'intsp',  label: "getint(' -7 ')",     values: { value: ' -7 ',    getter: 'getint' } },
        { id: 'intbad', label: "getint('4.5')",      values: { value: '4.5',     getter: 'getint' } },
        { id: 'float',  label: "getfloat('1e3')",    values: { value: '1e3',     getter: 'getfloat' } },
        { id: 'bool',   label: "getboolean('Yes')",  values: { value: 'Yes',     getter: 'getboolean' } },
        { id: 'boolbad', label: "getboolean('y')",   values: { value: 'y',       getter: 'getboolean' } },
        { id: 'get',    label: "get('42')",          values: { value: '42',      getter: 'get' } },
      ],
    },
    {
      id: 'fallback',
      label: 'fallback',
      blurb: 'getint with fallback=: used for a missing key, ignored for a value that is not an int.',
      params: [
        { name: 'key',      type: 'str',       hint: 'workers, timeout or another key', input: 'text' },
        { name: 'fallback', type: 'int | str', hint: 'the fallback',                     input: 'auto' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\nworkers = 4\\ntimeout = soon')\nconfig.getint('app', {$key}, fallback={$fallback})",
      cases: [
        { id: 'present', label: 'workers',      values: { key: 'workers', fallback: '1' } },
        { id: 'missing', label: 'retries',      values: { key: 'retries', fallback: '3' } },
        { id: 'bad',     label: 'timeout',      values: { key: 'timeout', fallback: '30' } },
        { id: 'upper',   label: 'WORKERS',      values: { key: 'WORKERS', fallback: '1' } },
      ],
    },
    {
      id: 'rawvars',
      label: 'raw and vars',
      blurb: 'The same key three ways: interpolated, raw=True, and with vars= overriding what it refers to.',
      params: [{ name: 'base', type: 'str', hint: 'vars value for base', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[paths]\\nbase = /srv/app\\nlogs = %(base)s/logs')\n(config.get('paths', 'logs'), config.get('paths', 'logs', raw=True), config.get('paths', 'logs', vars={'base': {$base}}))",
      cases: [
        { id: 'tmp',     label: "'/tmp'",   values: { base: '/tmp' } },
        { id: 'percent', label: "'50%'",    values: { base: '50%' } },
      ],
    },
  ],
  demoExplainer: "getint strips the spaces around ' -7 ' (int() does) but refuses '4.5'; getfloat accepts '1e3' and returns 1000.0. getboolean matches case-insensitively against 1/yes/true/on and 0/no/false/off, so 'Yes' is True and 'y' raises ValueError: Not a boolean: y. Plain get always returns the str. With fallback=, a missing retries gives 3, but timeout = soon still raises ValueError — the fallback is only for missing keys. vars= wins over the section, so logs becomes /tmp/logs; a vars value is interpolated too, so a bare % in it raises InterpolationSyntaxError.",

  patterns: [
    {
      name: 'Typed settings with defaults',
      desc: 'One line per setting; missing keys fall back, invalid ones fail loudly.',
      code: "port = config.getint('server', 'port', fallback=8080)\ndebug = config.getboolean('server', 'debug', fallback=False)\nratio = config.getfloat('server', 'ratio', fallback=1.0)",
    },
    {
      name: 'Optional value that may be absent',
      desc: 'None as fallback distinguishes "not set" from any real value.',
      code: "proxy = config.get('network', 'proxy', fallback=None)\nif proxy is not None:\n    use_proxy(proxy)",
    },
    {
      name: 'Tolerate invalid values too',
      desc: 'fallback does not help with ValueError — catch it when bad input should mean "use the default".',
      code: "try:\n    workers = config.getint('app', 'workers', fallback=4)\nexcept ValueError:\n    workers = 4",
    },
    {
      name: 'Command-line overrides',
      desc: 'vars= takes priority over the file, for one lookup.',
      code: "overrides = {'host': args.host} if args.host else None\nhost = config.get('server', 'host', vars=overrides)",
    },
  ],

  examples: [
    { title: 'get returns a str',            code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nport = 8080')\nconfig.get('server', 'port')", returns: "'8080'" },
    { title: 'getint and getfloat',          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\nworkers = 4\\nratio = 0.25')\n(config.getint('app', 'workers'), config.getfloat('app', 'ratio'))", returns: '(4, 0.25)' },
    { title: 'getboolean words',             code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[f]\\na = yes\\nb = Off\\nc = 1\\nd = TRUE')\n[config.getboolean('f', k) for k in 'abcd']", returns: '[True, False, True, True]' },
    { title: 'fallback for a missing key',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig.getint('server', 'port', fallback=8080)", returns: '8080' },
    { title: 'fallback for a missing section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.get('nowhere', 'key', fallback='default')", returns: "'default'" },
    { title: 'raw=True skips interpolation', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[p]\\nbase = /srv\\nlogs = %(base)s/logs')\nconfig.get('p', 'logs', raw=True)", returns: "'%(base)s/logs'" },
    { title: 'vars= comes first',            code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = example.com')\nconfig.get('server', 'host', vars={'host': 'localhost'})", returns: "'localhost'" },
    { title: 'Missing key without fallback', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig.getint('server', 'Port')", returns: "configparser.NoOptionError: No option 'port' in section: 'server'" },
  ],

  pitfalls: [
    {
      name: 'Expecting fallback to cover bad values',
      desc: 'getint catches only NoSectionError and NoOptionError. A value that int() rejects raises ValueError even with a fallback.',
      wrong: { label: 'fallback=4',          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\nworkers = four')\nconfig.getint('app', 'workers', fallback=4)", output: "ValueError: invalid literal for int() with base 10: 'four'" },
      fix:   { label: 'except ValueError',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\nworkers = four')\ntry:\n    workers = config.getint('app', 'workers', fallback=4)\nexcept ValueError:\n    workers = 4\nworkers", output: '4' },
    },
    {
      name: 'bool() instead of getboolean()',
      desc: 'Every non-empty string is truthy, including "no" and "false".',
      wrong: { label: 'bool(get(...))',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\ndebug = no')\nbool(config.get('app', 'debug'))", output: 'True' },
      fix:   { label: 'getboolean(...)', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\ndebug = no')\nconfig.getboolean('app', 'debug')", output: 'False' },
    },
    {
      name: 'fallback as a positional argument',
      desc: 'raw, vars and fallback are keyword-only on the parser (only SectionProxy.get takes a positional fallback).',
      wrong: { label: "get(s, k, 'x')",          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.getint('app', 'workers', 4)", output: 'TypeError: RawConfigParser.getint() takes 3 positional arguments but 4 were given' },
      fix:   { label: "get(s, k, fallback='x')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.getint('app', 'workers', fallback=4)", output: '4' },
    },
  ],

  when: {
    use: [
      'Reading typed settings: ports, counts, flags, ratios',
      'Optional settings with a default via fallback=',
      'One-off overrides of what a value refers to via vars=',
    ],
    avoid: [
      'Dict-style code → config["section"].getint("key", fallback) on the section proxy',
      'Other types (lists, paths, Decimal) → converters= or a get<name>() method in a subclass',
      'Validating input — check ranges and formats yourself after conversion',
    ],
  },

  notes: {
    cpython:      'RawConfigParser.get → _unify_values (a ChainMap of vars, the section and DEFAULT) → interpolation.before_get unless raw; getint/getfloat/getboolean → _get_conv(section, option, conv)',
    'Conversion': 'getint uses int(value), getfloat float(value), getboolean BOOLEAN_STATES[value.lower()] — the error messages are those of int(), float() and "Not a boolean: <value>"',
    'Valueless keys': 'With allow_no_value=True, get returns None for a key without a value; getint then raises TypeError from int(None)',
  },

  related: [
    { name: 'SectionProxy.get', slug: 'sectionproxy',   when: 'The dict-style equivalent' },
    { name: 'BOOLEAN_STATES',   slug: 'boolean_states', when: 'Words getboolean accepts' },
    { name: 'converters',       slug: 'converters',     when: 'Add getlist(), getpath() …' },
    { name: 'NoOptionError',    slug: 'nooptionerror',  when: 'What a missing key raises' },
    { name: 'int()',            slug: 'int',            when: 'What getint calls', category: 'functions' },
    { name: 'float()',          slug: 'float',          when: 'What getfloat calls', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I read an integer or boolean from a config file in Python?',
      a: "config.getint('section', 'key') and config.getboolean('section', 'key') — or config['section'].getint('key'). getboolean accepts 1, yes, true, on and 0, no, false, off in any case.",
    },
    {
      q: 'How do I give configparser a default value?',
      a: "Pass fallback= by keyword: config.get('section', 'key', fallback='x'). It is returned when the section or the key is missing — but a DEFAULT section value takes priority, and an unconvertible value still raises ValueError.",
    },
    {
      q: 'What does "ValueError: Not a boolean" mean?',
      a: 'getboolean found a value that is not one of the BOOLEAN_STATES words (1/yes/true/on, 0/no/false/off). Fix the file or set config.BOOLEAN_STATES to your own mapping.',
    },
    {
      q: 'What is the vars argument of ConfigParser.get?',
      a: 'A dict whose entries are looked up before the section and DEFAULT — both for the option itself and for %(name)s references inside it. Useful for command-line overrides.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.get',
    meta:  'ConfigParser.get',
  },

};
