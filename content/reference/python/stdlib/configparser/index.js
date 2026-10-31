// content/reference/python/stdlib/configparser/index.js — the configparser module hub

export const meta = {
  slug:        'index',
  name:        'configparser',
  signature:   'import configparser',
  blurb:       'Read and write INI-style configuration files: [sections] of key = value lines, a DEFAULT section, %(name)s interpolation, typed getters and dict-style access.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python 3 versions (unnamed sections 3.13+)',
  searchTerms: 'configparser module python ini file read config file configparser.configparser sections options default section interpolation getint getboolean getfloat write ini file read_string read_dict settings.ini config.ini setup.cfg python config file parser',
};

export const method = {
  slug: 'index',
  name: 'configparser',

  category:    'Data formats',
  version:     'All Python 3 versions (unnamed sections 3.13+)',
  hasLiveDemo: true,

  subtitle: 'ConfigParser reads [section] headers and key = value lines into a dict-like object: config["server"]["port"]. Every value is a str until you convert it — getint, getfloat and getboolean do that — keys are case-insensitive, the DEFAULT section feeds every other section, and %(name)s references are expanded when you read a value.',

  // every public name these classes define themselves must have a member page
  coverClasses: ['RawConfigParser', 'SectionProxy', 'Interpolation'],

  imports: ['import configparser', 'from configparser import ConfigParser'],
  facts: [
    { label: 'Main class',  value: 'ConfigParser (BasicInterpolation); RawConfigParser has no interpolation and accepts non-str values' },
    { label: 'Values',      value: 'Always str. getint / getfloat / getboolean convert; register more with converters=' },
    { label: 'Comments',    value: 'Lines starting with # or ; (inline comments are off by default). write() does not preserve comments' },
    { label: 'Exceptions',  value: 'configparser.Error (not in __all__) and 11 subclasses: NoSectionError, NoOptionError, DuplicateSectionError, ParsingError, InterpolationError …' },
    { label: 'Recent changes', value: '3.12 removed SafeConfigParser and readfp(); 3.13 added UNNAMED_SECTION and MultilineContinuationError; 3.14 adds InvalidWriteError' },
  ],

  modes: [
    {
      id: 'read',
      label: 'INI → dict',
      blurb: 'One INI line per box (empty boxes are blank lines). The result shows every section as a plain dict — DEFAULT values included.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'line5', type: 'str', hint: 'INI line 5', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([\n    {$line1},\n    {$line2},\n    {$line3},\n    {$line4},\n    {$line5},\n]))\n{name: dict(config[name]) for name in config.sections()}",
      cases: [
        { id: 'defaults', label: 'DEFAULT section', values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', line5: 'Port = 8080' } },
        { id: 'multi',    label: 'comments, multi-line', values: { line1: '[paths]', line2: '# where things live', line3: 'data = /var/lib/app', line4: 'search = /usr/share', line5: '    /opt/share' } },
        { id: 'interp',   label: '%(name)s',        values: { line1: '[paths]', line2: 'home = /home/ada', line3: 'docs = %(home)s/docs', line4: 'gain = 100%%', line5: '' } },
        { id: 'nohead',   label: 'no [section]',    values: { line1: 'host = example.com', line2: 'port = 8080', line3: '', line4: '', line5: '' } },
        { id: 'dup',      label: 'key twice',       values: { line1: '[server]', line2: 'port = 8080', line3: 'PORT = 9090', line4: '', line5: '' } },
      ],
    },
    {
      id: 'getters',
      label: 'typed getters',
      blurb: 'Values are strings. The section proxy converts them on request.',
      params: [
        { name: 'workers', type: 'str', hint: 'an integer?',  input: 'text' },
        { name: 'debug',   type: 'str', hint: 'yes/no/on/off/true/false/1/0', input: 'text' },
        { name: 'ratio',   type: 'str', hint: 'a float?',    input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'app': {'workers': {$workers}, 'debug': {$debug}, 'ratio': {$ratio}}})\napp = config['app']\n(app['workers'], app.getint('workers'), app.getboolean('debug'), app.getfloat('ratio'))",
      cases: [
        { id: 'ok',    label: 'valid',          values: { workers: '4', debug: 'yes', ratio: '0.75' } },
        { id: 'case',  label: 'Off, 1e-3',      values: { workers: ' 8 ', debug: 'Off', ratio: '1e-3' } },
        { id: 'word',  label: 'four',           values: { workers: 'four', debug: 'no', ratio: '1' } },
        { id: 'bool',  label: 'enabled',        values: { workers: '2', debug: 'enabled', ratio: '1' } },
      ],
    },
    {
      id: 'write',
      label: 'write()',
      blurb: 'Build a section with dict syntax and write it out. Assigned values go through str() — and through the % check.',
      params: [
        { name: 'host', type: 'str',        hint: 'a string',            input: 'text' },
        { name: 'port', type: 'int | str',  hint: 'a number or text',    input: 'auto' },
        { name: 'note', type: 'str',        hint: 'any text (try a %)',  input: 'text' },
      ],
      template: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig['server'] = {'host': {$host}, 'port': {$port}}\nconfig['server']['note'] = {$note}\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue().splitlines()",
      cases: [
        { id: 'plain',   label: 'plain',          values: { host: 'example.com', port: '8080', note: 'primary' } },
        { id: 'escaped', label: '100%%',          values: { host: 'example.com', port: '8080', note: 'load 100%%' } },
        { id: 'percent', label: 'a bare %',       values: { host: 'example.com', port: '8080', note: 'discount 50%' } },
        { id: 'float',   label: 'port = 0.5',     values: { host: 'localhost', port: '0.5', note: '' } },
      ],
    },
  ],
  demoExplainer: "In INI → dict every value is a str ('30', not 30), Port is stored as port, and [server] shows timeout because DEFAULT values appear in every section. An indented line continues the previous value, so search holds two lines; %(home)s is expanded on read and %% gives a literal %. Without a section header the read fails with MissingSectionHeaderError, and port appearing twice (case-insensitively) is a DuplicateOptionError naming line 3. In write(), the int 8080 is written as the string '8080', a section ends with a blank line, and a lone % is rejected on assignment: ValueError: invalid interpolation syntax in 'discount 50%' at position 11.",

  patterns: [
    {
      name: 'Read a config file with defaults',
      desc: 'read() silently skips missing files and returns the list of files it did read.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nfound = config.read(['defaults.ini', 'local.ini'], encoding='utf-8')\nport = config.getint('server', 'port', fallback=8000)",
    },
    {
      name: 'Write a config file',
      desc: 'Assign dicts of strings, then write() to a text file.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['server'] = {'host': 'example.com', 'port': '8080'}\nwith open('app.ini', 'w', encoding='utf-8') as f:\n    config.write(f)",
    },
    {
      name: 'Typed access with fallbacks',
      desc: 'The section proxy getters return the fallback when the key is missing (but still raise for bad values).',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\nserver = config['server']\ndebug = server.getboolean('debug', fallback=False)\nworkers = server.getint('workers', fallback=4)",
    },
    {
      name: 'Values with % signs',
      desc: 'BasicInterpolation treats % as special. Turn interpolation off, or write %% in the file.',
      code: "import configparser\nconfig = configparser.ConfigParser(interpolation=None)\nconfig.read('app.ini', encoding='utf-8')\nconfig['db']['password']",
    },
  ],

  examples: [
    { title: 'Parse a string',              code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = example.com\\nport = 8080')\nconfig['server']['port']", returns: "'8080'" },
    { title: 'Convert while reading',       code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nport = 8080\\ndebug = on')\n(config.getint('server', 'port'), config.getboolean('server', 'debug'))", returns: '(8080, True)' },
    { title: 'Keys are case-insensitive',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[Server]\\nHostName = example.com')\n(config['Server']['hostname'], list(config['Server']))", returns: "('example.com', ['hostname'])" },
    { title: 'Section names are case-sensitive', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[Server]\\nhost = x')\n('Server' in config, 'server' in config)", returns: '(True, False)' },
    { title: 'DEFAULT feeds every section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nretries = 3\\n[a]\\n[b]\\nretries = 5')\n(config['a']['retries'], config['b']['retries'], config.sections())", returns: "('3', '5', ['a', 'b'])" },
    { title: 'Interpolation with %(name)s', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[paths]\\nbase = /srv/app\\nlogs = %(base)s/logs')\nconfig['paths']['logs']", returns: "'/srv/app/logs'" },
    { title: 'write() output',              code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig['db'] = {'host': 'localhost', 'port': 5432}\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[db]\\nhost = localhost\\nport = 5432\\n\\n'" },
    { title: 'A missing key raises',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = x')\nconfig.get('server', 'port')", returns: "configparser.NoOptionError: No option 'port' in section: 'server'" },
  ],

  pitfalls: [
    {
      name: 'Expecting numbers and booleans',
      desc: 'configparser never guesses types. bool() of any non-empty string is True — even "False".',
      wrong: { label: "bool(...), value * 2", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\ndebug = False\\nworkers = 4')\n(bool(config['app']['debug']), config['app']['workers'] * 2)", output: "(True, '44')" },
      fix:   { label: 'getboolean / getint',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\ndebug = False\\nworkers = 4')\n(config['app'].getboolean('debug'), config['app'].getint('workers') * 2)", output: '(False, 8)' },
    },
    {
      name: 'A % sign in a value',
      desc: 'ConfigParser interpolates %(name)s, so any other % is a syntax error when the value is read. Use %% or interpolation=None.',
      wrong: { label: 'ConfigParser()',               code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[db]\\npassword = p%ss')\nconfig['db']['password']", output: "configparser.InterpolationSyntaxError: '%' must be followed by '%' or '(', found: '%ss'" },
      fix:   { label: 'ConfigParser(interpolation=None)', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=None)\nconfig.read_string('[db]\\npassword = p%ss')\nconfig['db']['password']", output: "'p%ss'" },
    },
    {
      name: 'read() ignores missing files',
      desc: 'A typo in the file name gives an empty parser, and the error only shows up later as NoSectionError. Check the returned list, or use read_file(open(...)) for files that must exist.',
      wrong: { label: 'ignore the result', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('setings.ini', encoding='utf-8')\nconfig.get('server', 'host')", output: "configparser.NoSectionError: No section: 'server'" },
      fix:   { label: 'check what was read', code: "import configparser\nconfig = configparser.ConfigParser()\nfound = config.read('setings.ini', encoding='utf-8')\nfound or 'no config file found'", output: "'no config file found'" },
    },
  ],

  when: {
    use: [
      'INI files with [sections] — settings.ini, setup.cfg, tox.ini, .editorconfig-style files',
      'Configuration edited by people who know Windows INI syntax',
      'Layered config: defaults file, then a local override, then environment-specific values',
    ],
    avoid: [
      'Typed, nested configuration → tomllib (reading TOML, 3.11+)',
      'Data exchange or deep nesting → json',
      'Files whose comments must survive a rewrite — write() drops them',
    ],
  },

  notes: {
    cpython:      'Lib/configparser.py, pure Python. RawConfigParser implements parsing, the getters and the mapping protocol; ConfigParser adds type checks on set and BasicInterpolation',
    'Mapping API': 'parser[section] returns a SectionProxy; parser.items() lists (name, proxy) pairs including DEFAULT; len() counts DEFAULT too',
    'Encoding':   'read() without encoding= uses the locale encoding (machine-dependent); pass encoding="utf-8"',
    'Python 3.14': 'write() raises InvalidWriteError for keys it could not read back; UnnamedSectionDisabledError when UNNAMED_SECTION is used without allow_unnamed_section',
  },

  related: [
    { name: 'ConfigParser',     slug: 'configparser',  when: 'The class and its constructor options' },
    { name: 'SectionProxy',     slug: 'sectionproxy',  when: 'config["section"]["key"] access' },
    { name: 'getint / getboolean', slug: 'get',        when: 'Typed getters with fallbacks' },
    { name: 'tomllib',          slug: 'tomllib',       when: 'Typed config in TOML', category: 'stdlib' },
    { name: 'json',             slug: 'json',          when: 'Config as JSON', category: 'stdlib' },
    { name: 'os.environ',       slug: 'environ',       when: 'Settings from environment variables', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I read an INI file in Python?',
      a: "config = configparser.ConfigParser(); config.read('app.ini', encoding='utf-8'); then config['section']['key'] or config.get('section', 'key'). Values come back as strings; use getint, getfloat and getboolean for other types.",
    },
    {
      q: 'Why are my keys lowercase after reading?',
      a: 'ConfigParser passes every option name through optionxform(), which lowercases by default, so Port and PORT are the same key. Set config.optionxform = str before reading to keep the original case. Section names are always case-sensitive.',
    },
    {
      q: 'How do I keep a % sign in a configparser value?',
      a: 'Write %% in the file, or create the parser with ConfigParser(interpolation=None) (or use RawConfigParser). With the default BasicInterpolation a lone % raises InterpolationSyntaxError when the value is read, and ValueError when you set it.',
    },
    {
      q: 'Does configparser keep comments when writing?',
      a: 'No. Comments are stripped while reading, so write() produces only sections and key = value lines. To edit a file and keep comments, change the text yourself or use a third-party library.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html',
    meta:  'configparser — Configuration file parser',
  },

};
