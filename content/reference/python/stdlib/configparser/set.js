// content/reference/python/stdlib/configparser/set.js — set

export const meta = {
  slug:        'set',
  name:        'ConfigParser.set',
  signature:   'config.set(section, option, value=None)',
  blurb:       'Store one value in an existing section (or in DEFAULT). ConfigParser requires str keys and values and checks the interpolation syntax of the value before storing it.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser set RawConfigParser.set ConfigParser.set set value in section add key update config value python option values must be strings invalid interpolation syntax nosectionerror set default section',
};

export const method = {
  slug:      'set',
  name:      'ConfigParser.set',
  signature: 'config.set(section, option, value=None)',
  returns:   { type: 'None', desc: 'The value is stored under optionxform(option); nothing is returned.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'set never creates a section: the section must exist (add_section first) or be DEFAULT — None and "" also mean DEFAULT. On a ConfigParser the key and value must be strings (None only with allow_no_value=True), and a non-empty value is run through the interpolation check, so "50%" is rejected right here, not later when read.',

  covers: ['RawConfigParser.set'],

  cheat: {
    commonCall: "config.set('server', 'port', '8080')",
    returns:    'None — config.get("server", "port") is now "8080"',
    replaces:   "config['server']['port'] = '8080' (same checks)",
    watchOut:   'values must be str: str(8080), not 8080',
  },

  parameters: [
    { name: 'section', type: 'str',        required: true,  default: null,   desc: 'An existing section, or DEFAULT. None, "" and the default section name all store into DEFAULT.' },
    { name: 'option',  type: 'str',        required: true,  default: null,   desc: 'The key; stored as optionxform(option), lowercase by default.' },
    { name: 'value',   type: 'str | None', required: false, default: 'None', desc: 'The value. ConfigParser: a str, or None if allow_no_value=True. RawConfigParser: anything.' },
  ],

  modes: [
    {
      id: 'where',
      label: 'where it lands',
      blurb: 'A parser with one [server] section. Set a key and see every section afterwards.',
      params: [
        { name: 'section', type: 'str', hint: 'server, DEFAULT, "" …', input: 'text' },
        { name: 'key',     type: 'str', hint: 'option name',           input: 'text' },
        { name: 'value',   type: 'str', hint: 'value',                 input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[server]\\nhost = example.com')\nconfig.set({$section}, {$key}, {$value})\n{name: dict(config[name]) for name in config}",
      cases: [
        { id: 'new',     label: 'new key',          values: { section: 'server',  key: 'Port',  value: '8080' } },
        { id: 'replace', label: 'replace',          values: { section: 'server',  key: 'host',  value: 'localhost' } },
        { id: 'default', label: 'into DEFAULT',     values: { section: 'DEFAULT', key: 'timeout', value: '30' } },
        { id: 'empty',   label: "section ''",       values: { section: '',        key: 'debug', value: 'no' } },
        { id: 'nosect',  label: 'missing section',  values: { section: 'client',  key: 'port',  value: '1' } },
      ],
    },
    {
      id: 'checks',
      label: 'value checks',
      blurb: 'What ConfigParser.set accepts. Type a number to pass an int, text for a str.',
      params: [{ name: 'value', type: 'str | int', hint: 'a value for port', input: 'auto' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('server')\nconfig.set('server', 'port', {$value})\nconfig.get('server', 'port', raw=True)",
      cases: [
        { id: 'str',     label: "'8080/tcp'",   values: { value: '8080/tcp' } },
        { id: 'int',     label: '8080',         values: { value: '8080' } },
        { id: 'percent', label: "'50%'",        values: { value: '50%' } },
        { id: 'escaped', label: "'50%%'",       values: { value: '50%%' } },
        { id: 'ref',     label: "'%(host)s'",   values: { value: '%(host)s:80' } },
      ],
    },
  ],
  demoExplainer: "Port is stored as port; setting host again replaces the value. DEFAULT, '' (and None) all write into the default section, which every section then shows. A section that does not exist raises NoSectionError: No section: 'client' — set never creates one. In value checks, the int 8080 is refused (TypeError: option values must be strings), '50%' fails BasicInterpolation's syntax check with ValueError: invalid interpolation syntax in '50%' at position 2, while '50%%' and a %(host)s reference are accepted — references are only resolved later, when the value is read.",

  patterns: [
    {
      name: 'Create the section first',
      desc: 'set needs an existing section.',
      code: "if not config.has_section('cache'):\n    config.add_section('cache')\nconfig.set('cache', 'ttl', str(ttl_seconds))",
    },
    {
      name: 'Store numbers and booleans',
      desc: 'Convert to str on the way in; getint/getboolean convert back.',
      code: "config.set('app', 'workers', str(4))\nconfig.set('app', 'debug', 'yes' if debug else 'no')",
    },
    {
      name: 'Store text that contains %',
      desc: 'Double the % for BasicInterpolation, or use a parser with interpolation=None.',
      code: "config.set('db', 'password', password.replace('%', '%%'))",
    },
  ],

  examples: [
    { title: 'set then get',                  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('server')\nconfig.set('server', 'Port', '8080')\n(config.get('server', 'port'), config.options('server'))", returns: "('8080', ['port'])" },
    { title: 'None and "" mean DEFAULT',      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.set(None, 'a', '1')\nconfig.set('', 'b', '2')\nconfig.defaults()", returns: "{'a': '1', 'b': '2'}" },
    { title: 'A missing section',             code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.set('server', 'port', '8080')", returns: "configparser.NoSectionError: No section: 'server'" },
    { title: 'Keys must be strings too',      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('s')\nconfig.set('s', 5, 'x')", returns: 'TypeError: option keys must be strings' },
    { title: 'None needs allow_no_value',     code: "import configparser\nconfig = configparser.ConfigParser(allow_no_value=True)\nconfig.add_section('mysqld')\nconfig.set('mysqld', 'skip-bdb')\nconfig.get('mysqld', 'skip-bdb') is None", returns: 'True' },
    { title: 'Multi-line values are written indented', code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.add_section('s')\nconfig.set('s', 'motd', 'line one\\nline two')\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[s]\\nmotd = line one\\n\\tline two\\n\\n'" },
    { title: 'ExtendedInterpolation checks $', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.add_section('s')\nconfig.set('s', 'price', 'cost $5')", returns: "ValueError: invalid interpolation syntax in 'cost $5' at position 5" },
  ],

  pitfalls: [
    {
      name: 'Storing an int',
      desc: 'ConfigParser stores text only. Convert with str() (RawConfigParser would accept the int, then fail later).',
      wrong: { label: "set(..., 8080)",      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('server')\nconfig.set('server', 'port', 8080)", output: 'TypeError: option values must be strings' },
      fix:   { label: "set(..., str(8080))", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('server')\nconfig.set('server', 'port', str(8080))\nconfig.getint('server', 'port')", output: '8080' },
    },
    {
      name: 'A literal % in the value',
      desc: 'The interpolation check runs at set time. Double the % (it reads back as one %).',
      wrong: { label: "'50%'",  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('sale')\nconfig.set('sale', 'discount', '50%')", output: "ValueError: invalid interpolation syntax in '50%' at position 2" },
      fix:   { label: "'50%%'", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('sale')\nconfig.set('sale', 'discount', '50%%')\nconfig.get('sale', 'discount')", output: "'50%'" },
    },
  ],

  when: {
    use: [
      'Changing or adding single values before write()',
      'Building a config programmatically, value by value',
    ],
    avoid: [
      'Several values at once → config[section] = {...} or config[section].update({...})',
      'Missing sections → add_section first (set never creates one)',
    ],
  },

  notes: {
    cpython:      'RawConfigParser.set: if value is truthy, run interpolation.before_set; pick self._defaults for a falsy or default section name, else self._sections[section] (NoSectionError); store under optionxform(option)',
    'ConfigParser': 'ConfigParser.set first calls _validate_value_types(option=option, value=value): TypeError for a non-str key, or a non-str value unless it is None with allow_no_value=True',
    'Empty string': "'' is falsy, so it skips the interpolation check and is stored as ''",
  },

  related: [
    { name: 'add_section',  slug: 'sections',     when: 'Create the section first' },
    { name: 'get',          slug: 'get',          when: 'Read it back' },
    { name: 'write',        slug: 'write',        when: 'Save the result' },
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'Why % is checked' },
    { name: 'NoSectionError', slug: 'nosectionerror', when: 'Setting into a missing section' },
  ],

  faq: [
    {
      q: 'How do I change a value in a configparser file?',
      a: "Read the file, call config.set('section', 'key', 'new value') (or config['section']['key'] = 'new value'), then write the parser back with config.write(f) on a file opened in 'w' mode. Comments in the original file are lost.",
    },
    {
      q: 'Why does configparser say "option values must be strings"?',
      a: "ConfigParser only stores str values (None too, if allow_no_value=True). Convert numbers and booleans yourself: config.set('app', 'workers', str(4)).",
    },
    {
      q: 'Why do I get "invalid interpolation syntax" when setting a value?',
      a: "With the default BasicInterpolation, % must start %(name)s or be doubled as %%. Store '50%%', or create the parser with interpolation=None.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.set',
    meta:  'ConfigParser.set',
  },

};
