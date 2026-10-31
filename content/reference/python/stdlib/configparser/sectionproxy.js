// content/reference/python/stdlib/configparser/sectionproxy.js — SectionProxy, .name, .parser, .get

export const meta = {
  slug:        'sectionproxy',
  name:        'configparser.SectionProxy',
  signature:   'config[section] → SectionProxy · proxy[key] · proxy.get(option, fallback=None, *, raw=False, vars=None) · proxy.name · proxy.parser',
  blurb:       'What config["section"] returns: a live, dict-like view of one section. Reads go through the parser (DEFAULT values and interpolation included), writes change the parser, and get() returns None instead of raising.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'configparser SectionProxy SectionProxy.get SectionProxy.name SectionProxy.parser section proxy config["section"]["key"] mapping protocol access dict-like section get fallback none getint fallback python configparser section as dict keyerror',
};

export const method = {
  slug:      'sectionproxy',
  name:      'configparser.SectionProxy',
  signature: 'proxy.get(option, fallback=None, *, raw=False, vars=None)',
  returns:   { type: 'str | None', desc: 'proxy.get returns the (interpolated) value, or fallback — None unless given — when the key is missing.' },

  category:    'configparser class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'A SectionProxy stores nothing itself: proxy[key] calls parser.get(name, key), proxy[key] = value calls parser.set(name, key, value), and iteration lists the section keys followed by the DEFAULT keys. It is a full MutableMapping, so dict(proxy), keys(), items(), in and del work, plus getint / getfloat / getboolean and any registered converter.',

  covers: ['SectionProxy', 'SectionProxy.parser', 'SectionProxy.name', 'SectionProxy.get'],

  cheat: {
    commonCall: "config['server'].get('port', '8080')",
    returns:    "'8080' — or the stored value",
    replaces:   'config.get(section, key, fallback=...) everywhere',
    watchOut:   'a DEFAULT value beats the fallback',
  },

  parameters: [
    { name: 'option',   type: 'str',        required: true,  default: null,    desc: 'Key to look up; passed through optionxform (lowercased by default).' },
    { name: 'fallback', type: 'any',        required: false, default: 'None',  desc: 'Returned when neither the section nor DEFAULT has the key. Second positional argument, like dict.get.' },
    { name: 'raw',      type: 'bool',       required: false, default: 'False', desc: 'Keyword-only. True skips interpolation.' },
    { name: 'vars',     type: 'dict | None', required: false, default: 'None', desc: 'Keyword-only. Extra values that take priority over the section, for this lookup.' },
  ],

  attributes: [
    { name: 'name',   type: 'str',          meaning: 'The section name (read-only property).' },
    { name: 'parser', type: 'ConfigParser', meaning: 'The parser the proxy belongs to (read-only property).' },
  ],

  modes: [
    {
      id: 'access',
      label: 'proxy[key]',
      blurb: 'config[section][key]: a missing section or key raises KeyError, like a dict.',
      params: [
        { name: 'line1',   type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',   type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',   type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4',   type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'section', type: 'str', hint: 'section name', input: 'text' },
        { name: 'key',     type: 'str', hint: 'key',          input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}]))\nconfig[{$section}][{$key}]",
      cases: [
        { id: 'found',   label: 'found',           values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'server', key: 'host' } },
        { id: 'default', label: 'from DEFAULT',    values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'server', key: 'timeout' } },
        { id: 'case',    label: 'HOST',            values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'server', key: 'HOST' } },
        { id: 'nokey',   label: 'missing key',     values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'server', key: 'port' } },
        { id: 'nosect',  label: 'missing section', values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'Server', key: 'host' } },
      ],
    },
    {
      id: 'get',
      label: 'proxy.get',
      blurb: 'get(option, fallback) never raises for a missing key — but DEFAULT values win over the fallback.',
      params: [
        { name: 'key',      type: 'str', hint: 'key in [server]', input: 'text' },
        { name: 'fallback', type: 'str', hint: 'fallback value',  input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\n[server]\\nhost = example.com')\nserver = config['server']\n(server.get({$key}), server.get({$key}, {$fallback}))",
      cases: [
        { id: 'present', label: 'present',      values: { key: 'host',    fallback: 'localhost' } },
        { id: 'missing', label: 'missing',      values: { key: 'port',    fallback: '8080' } },
        { id: 'default', label: 'in DEFAULT',   values: { key: 'timeout', fallback: '5' } },
      ],
    },
    {
      id: 'view',
      label: 'a live view',
      blurb: 'Assigning through the proxy changes the parser. Values must be strings.',
      params: [{ name: 'value', type: 'str | int', hint: 'new port value', input: 'auto' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = example.com')\nserver = config['server']\nserver['port'] = {$value}\n(config.get('server', 'port'), server.name, server.parser is config, dict(server))",
      cases: [
        { id: 'str', label: "'80/tcp'", values: { value: '80/tcp' } },
        { id: 'int', label: '8080',    values: { value: '8080' } },
      ],
    },
  ],
  demoExplainer: "config['server']['timeout'] finds the DEFAULT value, and HOST works because keys are lowercased before lookup. A missing key raises KeyError: 'port' and a missing section KeyError: 'Server' (section names are case-sensitive) — the mapping protocol raises KeyError, not NoOptionError or NoSectionError. In proxy.get, a missing key gives None or the fallback, but timeout still returns '30' from DEFAULT even with a fallback of '5'. In the live view, server['port'] = 8080 (an int) is refused with TypeError: option values must be strings.",

  patterns: [
    {
      name: 'Pass one section around',
      desc: 'Functions can take the proxy instead of the whole parser and a section name.',
      code: "import configparser\n\ndef connect(db):\n    return db['host'], db.getint('port', fallback=5432)\n\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\nconnect(config['database'])",
    },
    {
      name: 'Section to a plain dict',
      desc: 'dict(proxy) resolves every key, including DEFAULT values and interpolation.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\nsettings = {name: dict(config[name]) for name in config.sections()}",
    },
    {
      name: 'Optional values',
      desc: 'get() with a fallback, or the typed getters with fallback=.',
      code: "server = config['server']\nhost = server.get('host', 'localhost')\ndebug = server.getboolean('debug', fallback=False)",
    },
  ],

  examples: [
    { title: 'repr, name and parser',       code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nserver = config['server']\n(server, server.name, server.parser is config)", returns: "(<Section: server>, 'server', True)" },
    { title: 'Iteration includes DEFAULT keys', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\n[server]\\nhost = x\\nport = 80')\n(list(config['server']), len(config['server']))", returns: "(['host', 'port', 'timeout'], 3)" },
    { title: 'get() returns None by default', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig['server'].get('port') is None", returns: 'True' },
    { title: 'Typed getters on the proxy',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nport = 8080')\nserver = config['server']\n(server.getint('port'), server.getint('workers', 4), server.getint('workers'))", returns: '(8080, 4, None)' },
    { title: 'Writes go to the parser',     code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['server'] = {}\nconfig['server']['port'] = '8080'\nconfig.get('server', 'port')", returns: "'8080'" },
    { title: 'DEFAULT keys cannot be deleted from a section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\n[server]')\ndel config['server']['timeout']", returns: "KeyError: 'timeout'" },
    { title: 'name is read-only',           code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['server'] = {}\nconfig['server'].name = 'web'", returns: "AttributeError: property 'name' of 'SectionProxy' object has no setter" },
  ],

  pitfalls: [
    {
      name: 'A positional fallback on the parser',
      desc: 'Only the proxy takes the fallback as second positional argument. parser.get(section, option, ...) needs fallback= by keyword.',
      wrong: { label: "config.get(s, k, '8080')",  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig.get('server', 'port', '8080')", output: 'TypeError: RawConfigParser.get() takes 3 positional arguments but 4 were given' },
      fix:   { label: "config[s].get(k, '8080')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\n(config['server'].get('port', '8080'), config.get('server', 'port', fallback='8080'))", output: "('8080', '8080')" },
    },
    {
      name: 'Catching NoOptionError around proxy[key]',
      desc: 'The mapping protocol raises KeyError for a missing key; NoOptionError comes only from parser.get().',
      wrong: { label: 'except NoOptionError', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\ntry:\n    port = config['server']['port']\nexcept configparser.NoOptionError:\n    port = '80'", output: "KeyError: 'port'" },
      fix:   { label: 'proxy.get(key, default)', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig['server'].get('port', '80')", output: "'80'" },
    },
  ],

  when: {
    use: [
      'Everyday reading and writing: config["section"]["key"]',
      'Optional values with get(key, fallback) or getint(key, fallback=…)',
      'Turning a section into a dict, or passing one section to a function',
    ],
    avoid: [
      'Overriding a DEFAULT value with a fallback — the DEFAULT value always wins; keep such keys out of DEFAULT',
      'Keeping a proxy after remove_section() — proxy[key] then raises KeyError, get() quietly returns None and iterating raises NoSectionError',
    ],
  },

  notes: {
    cpython:      'Lib/configparser.py — class SectionProxy(MutableMapping); __getitem__ checks has_option then calls parser.get, __setitem__ validates the types then calls parser.set',
    'Getters':    'SectionProxy.__init__ creates getint / getfloat / getboolean (and get<name> for each converter) as functools.partial(self.get, _impl=parser.get<name>)',
    'Created by': 'The parser makes one proxy per section (and one for DEFAULT) and returns the same object every time: config["s"] is config["s"]',
  },

  related: [
    { name: 'get / getint / getboolean', slug: 'get', when: 'The parser-level getters it calls' },
    { name: 'ConfigParser',  slug: 'configparser', when: 'The parser behind the proxy' },
    { name: 'converters',    slug: 'converters',   when: 'Add get<name>() to every proxy' },
    { name: 'DEFAULTSECT',   slug: 'defaultsect',  when: 'Why DEFAULT keys show up in every section' },
    { name: 'KeyError',      slug: 'keyerror',     when: 'What proxy[key] raises', category: 'exceptions' },
    { name: 'dict',          slug: 'dict',         when: 'dict(proxy) for a plain copy', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is a SectionProxy in configparser?',
      a: 'The object config["section"] returns. It behaves like a dict of that section — keys, values, items, in, del — but every read and write is forwarded to the parser, so it always shows the current state, DEFAULT values and interpolation included.',
    },
    {
      q: 'How do I get a value with a default in configparser?',
      a: "config['section'].get('key', 'default') — or the typed form config['section'].getint('key', fallback=0). With the parser API the default must be passed by keyword: config.get('section', 'key', fallback='default').",
    },
    {
      q: 'Why does config["section"]["key"] raise KeyError instead of NoOptionError?',
      a: 'The section proxy follows the mapping protocol, where missing keys raise KeyError. parser.get(section, key) is the legacy API and raises NoOptionError / NoSectionError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#mapping-protocol-access',
    meta:  'configparser — Mapping Protocol Access',
  },

};
