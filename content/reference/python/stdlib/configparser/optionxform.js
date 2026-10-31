// content/reference/python/stdlib/configparser/optionxform.js — optionxform

export const meta = {
  slug:        'optionxform',
  name:        'ConfigParser.optionxform',
  signature:   'config.optionxform(option) · config.optionxform = str',
  blurb:       'The function every option name passes through on read, get and set. The default lowercases, which makes keys case-insensitive; assign str to keep their case.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser optionxform RawConfigParser.optionxform case sensitive keys preserve case configparser lowercase keys optionxform = str keep key case python ini uppercase keys',
};

export const method = {
  slug:      'optionxform',
  name:      'ConfigParser.optionxform',
  signature: 'config.optionxform(option)',
  returns:   { type: 'str', desc: 'The canonical form of the option name: option.lower() by default.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'optionxform is applied to the key of every line read, every key you look up, every key you set and every %(name)s reference. Replacing it — on the instance (config.optionxform = str) or in a subclass — changes all of these at once. Section names never go through it; they are always case-sensitive.',

  covers: ['RawConfigParser.optionxform'],

  cheat: {
    commonCall: 'config.optionxform = str',
    returns:    'keys keep the case they had in the file',
    replaces:   'post-processing keys after reading',
    watchOut:   'set it before reading anything',
  },

  parameters: [
    { name: 'option', type: 'str', required: true, default: null, desc: 'An option name as found in the file (already stripped of surrounding whitespace) or as passed by your code.' },
  ],

  modes: [
    {
      id: 'transform',
      label: 'choose a transform',
      blurb: 'Read the same lines with the default, with str (keep case) and with str.upper.',
      params: [
        { name: 'transform', type: 'str', hint: "'default', 'str' or 'upper'", input: 'text' },
        { name: 'line1',     type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',     type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',     type: 'str', hint: 'INI line 3', input: 'text' },
      ],
      template: "import configparser\ntransforms = {'default': None, 'str': str, 'upper': str.upper}\nconfig = configparser.ConfigParser()\nif transforms[{$transform}] is not None:\n    config.optionxform = transforms[{$transform}]\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}]))\n{name: dict(config[name]) for name in config.sections()}",
      cases: [
        { id: 'default', label: 'default',        values: { transform: 'default', line1: '[App]', line2: 'DebugMode = on', line3: 'LogLevel = INFO' } },
        { id: 'str',     label: 'str',            values: { transform: 'str',     line1: '[App]', line2: 'DebugMode = on', line3: 'LogLevel = INFO' } },
        { id: 'upper',   label: 'str.upper',      values: { transform: 'upper',   line1: '[App]', line2: 'DebugMode = on', line3: 'LogLevel = INFO' } },
        { id: 'dup',     label: 'Path vs PATH',   values: { transform: 'default', line1: '[env]', line2: 'Path = /usr/bin', line3: 'PATH = /bin' } },
        { id: 'dupstr',  label: 'Path vs PATH, str', values: { transform: 'str',  line1: '[env]', line2: 'Path = /usr/bin', line3: 'PATH = /bin' } },
      ],
    },
    {
      id: 'lookup',
      label: 'lookups follow it',
      blurb: 'With optionxform = str, lookups are case-sensitive too.',
      params: [{ name: 'key', type: 'str', hint: 'key to look up', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.optionxform = str\nconfig.read_string('[App]\\nDebugMode = on')\n(config.has_option('App', {$key}), config['App'].get({$key}, 'not found'))",
      cases: [
        { id: 'exact', label: 'DebugMode', values: { key: 'DebugMode' } },
        { id: 'lower', label: 'debugmode', values: { key: 'debugmode' } },
      ],
    },
  ],
  demoExplainer: 'By default DebugMode and LogLevel are stored as debugmode and loglevel; with str they keep their case; with str.upper they become DEBUGMODE and LOGLEVEL. Because the default folds case, Path and PATH are the same key and the strict parser raises DuplicateOptionError naming line 3 — with str they are two different keys. Once optionxform is str, has_option and get are case-sensitive as well: debugmode is not found.',

  patterns: [
    {
      name: 'Keep key case',
      desc: 'Assign before the first read.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.optionxform = str\nconfig.read('app.ini', encoding='utf-8')",
    },
    {
      name: 'In a subclass',
      desc: 'Override the method when you create many parsers.',
      code: "import configparser\n\nclass CaseConfigParser(configparser.ConfigParser):\n    def optionxform(self, optionstr):\n        return optionstr",
    },
    {
      name: 'Normalize spellings',
      desc: 'Any idempotent function works: here max-size, MAX_SIZE and max_size are one key.',
      code: "config.optionxform = lambda name: name.lower().replace('-', '_')",
    },
  ],

  examples: [
    { title: 'The default lowercases',        code: "import configparser\nconfigparser.ConfigParser().optionxform('MaxSize')", returns: "'maxsize'" },
    { title: 'Keys keep their case with str', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.optionxform = str\nconfig.read_string('[App]\\nDebugMode = on')\nlist(config['App'])", returns: "['DebugMode']" },
    { title: 'Lookups are transformed too',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nKey = 1')\n(config['s']['KEY'], config.get('s', 'kEy'))", returns: "('1', '1')" },
    { title: 'A subclass override',           code: "import configparser\nclass CaseConfigParser(configparser.ConfigParser):\n    def optionxform(self, optionstr):\n        return optionstr\nconfig = CaseConfigParser()\nconfig.read_string('[s]\\nKey = 1')\nconfig.options('s')", returns: "['Key']" },
    { title: 'Normalize - and _',             code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.optionxform = lambda name: name.lower().replace('-', '_')\nconfig.read_string('[s]\\nMax-Size = 10')\nconfig.get('s', 'max_size')", returns: "'10'" },
    { title: 'Section names are untouched',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[Server]\\nHost = x')\n(config.sections(), config.options('Server'))", returns: "(['Server'], ['host'])" },
  ],

  pitfalls: [
    {
      name: 'Setting optionxform after reading',
      desc: 'Keys already read were stored lowercase; a later optionxform = str only changes how new lookups are transformed, so the mixed-case lookup misses.',
      wrong: { label: 'read, then str', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nKey = 1')\nconfig.optionxform = str\n(config.options('s'), config.has_option('s', 'Key'))", output: "(['key'], False)" },
      fix:   { label: 'str, then read', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.optionxform = str\nconfig.read_string('[s]\\nKey = 1')\n(config.options('s'), config.has_option('s', 'Key'))", output: "(['Key'], True)" },
    },
    {
      name: 'Expecting case-insensitive section names',
      desc: 'optionxform never touches section names. Normalize them yourself if users type [server] and [Server].',
      wrong: { label: "config['server']", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[Server]\\nhost = x')\nconfig['server']['host']", output: "KeyError: 'server'" },
      fix:   { label: 'match the case',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[Server]\\nhost = x')\nname = next(s for s in config.sections() if s.lower() == 'server')\nconfig[name]['host']", output: "'x'" },
    },
  ],

  when: {
    use: [
      'Keys whose case matters: environment variables, class names, URLs used as keys',
      'Normalizing different spellings of the same key',
    ],
    avoid: [
      'Changing it after data was read — set it first',
      'Section-name normalization — sections do not use it',
    ],
  },

  notes: {
    cpython:      'RawConfigParser.optionxform(self, optionstr): return optionstr.lower(). It is called in _handle_option, get, set, has_option, remove_option, items(vars=…), read_dict and by both interpolation classes',
    'Idempotent': 'The docs ask for an idempotent function: applying it to an already canonical name must return it unchanged',
    'Whitespace': 'Keys read from a file are stripped before optionxform is called',
  },

  related: [
    { name: 'options / has_option', slug: 'options', when: 'Where transformed names show up' },
    { name: 'get',            slug: 'get',            when: 'Lookups are transformed' },
    { name: 'DuplicateOptionError', slug: 'duplicateoptionerror', when: 'Keys equal after transformation' },
    { name: 'SECTCRE',        slug: 'sectcre', when: 'Customize how sections are recognized' },
    { name: 'str.lower',      slug: 'str',            when: 'The default transformation', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I make configparser keys case-sensitive?',
      a: 'Set config.optionxform = str right after creating the parser, before reading any file. Keys then keep their original case, and lookups must use the same case.',
    },
    {
      q: 'Why does configparser convert keys to lowercase?',
      a: 'The default optionxform() returns option.lower(), so keys are case-insensitive like in Windows INI files. Section names are not affected.',
    },
    {
      q: 'Why do I get DuplicateOptionError for keys that differ only in case?',
      a: 'After optionxform they are the same key (Path and PATH both become path), and a strict parser refuses duplicates in one source. Use optionxform = str to keep them apart, or strict=False to let the last one win.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.optionxform',
    meta:  'ConfigParser.optionxform',
  },

};
