// content/reference/python/stdlib/configparser/boolean_states.js — BOOLEAN_STATES

export const meta = {
  slug:        'boolean_states',
  name:        'ConfigParser.BOOLEAN_STATES',
  signature:   "ConfigParser.BOOLEAN_STATES = {'1': True, 'yes': True, 'true': True, 'on': True, '0': False, 'no': False, 'false': False, 'off': False}",
  blurb:       'The class attribute getboolean() looks values up in, after lowercasing them. Replace it on an instance to accept other words, such as enabled / disabled.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser BOOLEAN_STATES RawConfigParser.BOOLEAN_STATES getboolean accepted values yes no on off true false 1 0 custom boolean values enabled disabled not a boolean python ini boolean',
};

export const method = {
  slug:      'boolean_states',
  name:      'ConfigParser.BOOLEAN_STATES',
  signature: 'config.BOOLEAN_STATES',
  returns:   { type: 'dict[str, bool]', desc: 'Lowercase words mapped to True or False.' },

  category:    'ConfigParser attribute',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'getboolean() does exactly one thing with this dict: BOOLEAN_STATES[value.lower()], raising ValueError("Not a boolean: …") if the key is missing. So the default accepts 1/yes/true/on and 0/no/false/off in any letter case, nothing else — and a custom mapping needs lowercase keys.',

  covers: ['RawConfigParser.BOOLEAN_STATES'],

  cheat: {
    commonCall: "config.BOOLEAN_STATES = {'enabled': True, 'disabled': False}",
    returns:    'getboolean now accepts only those words',
    replaces:   'value.lower() in ("yes", "true", ...) checks in your code',
    watchOut:   'keys must be lowercase; the dict replaces the defaults',
  },

  parameters: [],

  modes: [
    {
      id: 'default',
      label: 'default words',
      blurb: 'Store a value and read it with getboolean().',
      params: [{ name: 'value', type: 'str', hint: 'yes, Off, 1, true, y …', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'features': {'cache': {$value}}})\nconfig.getboolean('features', 'cache')",
      cases: [
        { id: 'yes',   label: 'yes',   values: { value: 'yes' } },
        { id: 'OFF',   label: 'OFF',   values: { value: 'OFF' } },
        { id: 'one',   label: '1',     values: { value: '1' } },
        { id: 'y',     label: 'y',     values: { value: 'y' } },
        { id: 'en',    label: 'enabled', values: { value: 'enabled' } },
      ],
    },
    {
      id: 'custom',
      label: 'custom mapping',
      blurb: 'Replace BOOLEAN_STATES on this parser only.',
      params: [{ name: 'value', type: 'str', hint: 'enabled, Disabled, yes …', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {'enabled': True, 'disabled': False}\nconfig.read_dict({'features': {'cache': {$value}}})\nconfig.getboolean('features', 'cache')",
      cases: [
        { id: 'enabled',  label: 'enabled',  values: { value: 'enabled' } },
        { id: 'Disabled', label: 'Disabled', values: { value: 'Disabled' } },
        { id: 'yes',      label: 'yes',      values: { value: 'yes' } },
      ],
    },
  ],
  demoExplainer: "yes, OFF and 1 match after lowercasing; y and enabled are not in the dict, so getboolean raises ValueError: Not a boolean: y (the message repeats the value as stored). The custom mapping replaces the defaults instead of extending them: enabled and Disabled work, but yes is now rejected.",

  patterns: [
    {
      name: 'Accept extra words',
      desc: 'Copy the defaults and add to them, so yes/no keep working.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {**configparser.ConfigParser.BOOLEAN_STATES, 'enabled': True, 'disabled': False}",
    },
    {
      name: 'In a subclass',
      desc: 'A class attribute for every parser of your own type — without changing the stdlib class.',
      code: "import configparser\n\nclass AppConfig(configparser.ConfigParser):\n    BOOLEAN_STATES = {'enabled': True, 'disabled': False}",
    },
  ],

  examples: [
    { title: 'The default mapping',           code: 'import configparser\nconfigparser.ConfigParser.BOOLEAN_STATES', returns: "{'1': True, 'yes': True, 'true': True, 'on': True, '0': False, 'no': False, 'false': False, 'off': False}" },
    { title: 'Case does not matter',          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[f]\\na = YES\\nb = False')\n(config.getboolean('f', 'a'), config.getboolean('f', 'b'))", returns: '(True, False)' },
    { title: 'An empty value is not a boolean', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[f]\\nflag =')\nconfig.getboolean('f', 'flag')", returns: 'ValueError: Not a boolean: ' },
    { title: 'Custom words on one parser',    code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {'sure': True, 'nope': False}\nconfig.read_string('[f]\\na = Nope')\nconfig.getboolean('f', 'a')", returns: 'False' },
    { title: 'Section proxies use it too',    code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {'enabled': True, 'disabled': False}\nconfig['f'] = {'cache': 'enabled'}\nconfig['f'].getboolean('cache')", returns: 'True' },
    { title: 'Shared by both classes',        code: 'import configparser\nconfigparser.ConfigParser.BOOLEAN_STATES is configparser.RawConfigParser.BOOLEAN_STATES', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Uppercase keys in a custom mapping',
      desc: 'The value is lowercased before the lookup, so a key with capitals can never match.',
      wrong: { label: "{'Enabled': True}", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {'Enabled': True}\nconfig.read_string('[f]\\ncache = Enabled')\nconfig.getboolean('f', 'cache')", output: 'ValueError: Not a boolean: Enabled' },
      fix:   { label: "{'enabled': True}", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.BOOLEAN_STATES = {'enabled': True}\nconfig.read_string('[f]\\ncache = Enabled')\nconfig.getboolean('f', 'cache')", output: 'True' },
    },
    {
      name: 'Values with spaces from read_dict',
      desc: 'Values read from a file are stripped, but read_dict and set store them as given; getboolean does not strip.',
      wrong: { label: "' yes'",          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'f': {'cache': ' yes'}})\nconfig.getboolean('f', 'cache')", output: 'ValueError: Not a boolean:  yes' },
      fix:   { label: "' yes'.strip()",  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'f': {'cache': ' yes'.strip()}})\nconfig.getboolean('f', 'cache')", output: 'True' },
    },
  ],

  when: {
    use: [
      'Config files that spell booleans differently (enabled/disabled, accept/reject)',
      'Restricting getboolean to a smaller vocabulary',
    ],
    avoid: [
      'Assigning configparser.ConfigParser.BOOLEAN_STATES itself — that changes every parser in the program; set it on an instance or a subclass',
      'Mixed-case keys in your mapping — they never match',
    ],
  },

  notes: {
    cpython:      "_convert_to_boolean(value): if value.lower() not in self.BOOLEAN_STATES: raise ValueError('Not a boolean: %s' % value); return self.BOOLEAN_STATES[value.lower()]",
    'Lookup':     'self.BOOLEAN_STATES — an instance attribute wins over the class attribute, so per-parser customization is just an assignment',
    'Docs':       'The documentation suggests other pairs such as accept/reject or enabled/disabled',
  },

  related: [
    { name: 'getboolean',    slug: 'get',          when: 'The getter that uses it' },
    { name: 'converters',    slug: 'converters',   when: 'Other custom conversions' },
    { name: 'SectionProxy',  slug: 'sectionproxy', when: "config['s'].getboolean('k')" },
    { name: 'bool()',        slug: 'bool',         when: 'Why bool("no") is True', category: 'functions' },
  ],

  faq: [
    {
      q: 'Which values does configparser getboolean accept?',
      a: "'1', 'yes', 'true', 'on' for True and '0', 'no', 'false', 'off' for False, in any letter case. Anything else raises ValueError: Not a boolean: <value>.",
    },
    {
      q: 'How do I make getboolean accept enabled and disabled?',
      a: "Set config.BOOLEAN_STATES = {'enabled': True, 'disabled': False} on your parser (keys in lowercase). To keep the standard words too, merge with configparser.ConfigParser.BOOLEAN_STATES.",
    },
    {
      q: 'Why does getboolean raise "Not a boolean" for an empty value?',
      a: 'An empty string is not a key of BOOLEAN_STATES. fallback=False does not help here — it is used only for missing keys — so give the key a real value, remove it, or catch ValueError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.BOOLEAN_STATES',
    meta:  'ConfigParser.BOOLEAN_STATES',
  },

};
