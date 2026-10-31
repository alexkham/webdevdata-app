// content/reference/python/stdlib/configparser/options.js — options / has_option / remove_option

export const meta = {
  slug:        'options',
  name:        'ConfigParser.options',
  signature:   'config.options(section) · config.has_option(section, option) · config.remove_option(section, option)',
  blurb:       'List the keys of a section (DEFAULT keys included), test for one key, and delete one. Keys go through optionxform, so all three are case-insensitive by default.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser options has_option remove_option RawConfigParser.options RawConfigParser.has_option RawConfigParser.remove_option list keys in section check option exists delete key python ini default keys case insensitive nosectionerror',
};

export const method = {
  slug:      'options',
  name:      'ConfigParser.options',
  signature: 'config.options(section)',
  returns:   { type: 'list[str]', desc: 'options: the section keys, then DEFAULT keys the section does not override. has_option / remove_option: bool.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'options() merges the section with DEFAULT, so it lists inherited keys too; has_option() is True for an inherited key; remove_option() only deletes from the section you name, so a DEFAULT value with the same key shows through afterwards. A missing section raises NoSectionError in options() and remove_option(), but has_option() just returns False.',

  covers: ['RawConfigParser.options', 'RawConfigParser.has_option', 'RawConfigParser.remove_option'],

  cheat: {
    commonCall: "config.has_option('server', 'port')",
    returns:    'True or False',
    replaces:   "try: config.get(...) except NoOptionError",
    watchOut:   'inherited DEFAULT keys count as present',
  },

  parameters: [
    { name: 'section', type: 'str', required: true, default: null, desc: 'Section name. has_option and remove_option treat None, "" and the default section name as DEFAULT; options() raises NoSectionError for DEFAULT.' },
    { name: 'option',  type: 'str', required: true, default: null, desc: 'Key, passed through optionxform (lowercased by default).' },
  ],

  modes: [
    {
      id: 'list',
      label: 'options() / has_option()',
      blurb: 'A [DEFAULT] with timeout and host, a [server] with host and port. List one section and test a key.',
      params: [
        { name: 'section', type: 'str', hint: 'server or DEFAULT …', input: 'text' },
        { name: 'key',     type: 'str', hint: 'key to test',        input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\nhost = default\\n[server]\\nhost = example.com\\nport = 8080')\n(config.has_option({$section}, {$key}), config.options({$section}))",
      cases: [
        { id: 'own',     label: 'server / port',     values: { section: 'server',  key: 'port' } },
        { id: 'inherit', label: 'server / TIMEOUT',  values: { section: 'server',  key: 'TIMEOUT' } },
        { id: 'missing', label: 'server / user',     values: { section: 'server',  key: 'user' } },
        { id: 'default', label: 'DEFAULT / timeout', values: { section: 'DEFAULT', key: 'timeout' } },
        { id: 'nosect',  label: 'web / port',        values: { section: 'web',     key: 'port' } },
      ],
    },
    {
      id: 'remove',
      label: 'remove_option()',
      blurb: 'Remove a key from [server], then look at what is left — DEFAULT values reappear.',
      params: [{ name: 'key', type: 'str', hint: 'key to remove', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\nhost = default\\n[server]\\nhost = example.com\\nport = 8080')\nremoved = config.remove_option('server', {$key})\n(removed, dict(config['server']))",
      cases: [
        { id: 'host',    label: 'host',    values: { key: 'host' } },
        { id: 'port',    label: 'PORT',    values: { key: 'PORT' } },
        { id: 'timeout', label: 'timeout', values: { key: 'timeout' } },
        { id: 'none',    label: 'user',    values: { key: 'user' } },
      ],
    },
  ],
  demoExplainer: "options('server') lists host and port, then timeout from DEFAULT; has_option('server', 'TIMEOUT') is True because the key is lowercased and DEFAULT counts. options('DEFAULT') raises NoSectionError: No section: 'DEFAULT' — DEFAULT is not a section — while has_option('DEFAULT', 'timeout') looks in the defaults and says True. For a missing section, has_option returns False but options raises. remove_option('server', 'host') returns True and the DEFAULT host ('default') becomes visible; removing timeout from [server] returns False because it lives in DEFAULT and stays.",

  patterns: [
    {
      name: 'Require keys',
      desc: 'Report every missing key at once.',
      code: "required = ['host', 'port', 'user']\nmissing = [k for k in required if not config.has_option('database', k)]\nif missing:\n    raise SystemExit(f'[database] is missing: {\", \".join(missing)}')",
    },
    {
      name: 'Warn about unknown keys',
      desc: 'Compare what a section provides with what your program understands (DEFAULT keys included).',
      code: "known = {'host', 'port', 'timeout'}\nunknown = set(config.options('server')) - known\nif unknown:\n    print('ignoring unknown keys:', sorted(unknown))",
    },
    {
      name: 'Delete a key everywhere',
      desc: 'remove_option works per section; DEFAULT needs its own call.',
      code: "for name in [config.default_section, *config.sections()]:\n    config.remove_option(name, 'obsolete')",
    },
  ],

  examples: [
    { title: 'Section keys first, then DEFAULT keys', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1\\nb = 2\\n[s]\\nc = 3\\nb = 4')\nconfig.options('s')", returns: "['c', 'b', 'a']" },
    { title: 'has_option is case-insensitive', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nPort = 80')\n(config.has_option('s', 'PORT'), config.options('s'))", returns: "(True, ['port'])" },
    { title: 'A missing section is just False', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.has_option('nowhere', 'key')", returns: 'False' },
    { title: 'None or "" means DEFAULT',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ndebug = no')\n(config.has_option(None, 'debug'), config.has_option('', 'debug'))", returns: '(True, True)' },
    { title: 'remove_option returns a bool', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\nx = 1')\n(config.remove_option('s', 'x'), config.remove_option('s', 'x'))", returns: '(True, False)' },
    { title: 'options() of a missing section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.options('server')", returns: "configparser.NoSectionError: No section: 'server'" },
    { title: 'remove_option in a missing section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.remove_option('server', 'port')", returns: "configparser.NoSectionError: No section: 'server'" },
  ],

  pitfalls: [
    {
      name: 'options() is not "keys defined in this section"',
      desc: 'Inherited DEFAULT keys are included, so counting or validating keys with options() also counts defaults.',
      wrong: { label: 'len(options())', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nretries = 3\\n[empty]')\nlen(config.options('empty'))", output: '1' },
      fix:   { label: 'items(raw=True) minus defaults', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nretries = 3\\n[empty]')\nown = dict(config.items('empty', raw=True)).items() - config.defaults().items()\nlen(own)", output: '0' },
    },
    {
      name: 'Removing a key that DEFAULT also has',
      desc: 'After remove_option the section inherits the DEFAULT value again — the key does not disappear.',
      wrong: { label: 'remove, expect gone', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nhost = default\\n[server]\\nhost = example.com')\nconfig.remove_option('server', 'host')\nconfig['server']['host']", output: "'default'" },
      fix:   { label: 'remove from DEFAULT too', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nhost = default\\n[server]\\nhost = example.com')\nconfig.remove_option('server', 'host')\nconfig.remove_option('DEFAULT', 'host')\nconfig.has_option('server', 'host')", output: 'False' },
    },
  ],

  when: {
    use: [
      'Checking for optional keys before reading them',
      'Listing what a section provides, defaults included',
      'Deleting keys before write()',
    ],
    avoid: [
      'Reading with a default → get(..., fallback=…) is one call instead of two',
      'Iterating key/value pairs → items(section) or dict(config[section])',
    ],
  },

  notes: {
    cpython:      "options(): self._sections[section].copy(), then .update(self._defaults) — so section keys keep their order and DEFAULT-only keys are appended",
    'has_option': 'not section or section == default_section → look in defaults; unknown section → False; else section or defaults',
    'remove_option': 'Deletes from one dict only (the section, or the defaults for DEFAULT / "" / None) and returns whether the key existed there',
  },

  related: [
    { name: 'sections / has_section', slug: 'sections', when: 'The same for sections' },
    { name: 'items',        slug: 'items',        when: 'Keys with their values' },
    { name: 'optionxform',  slug: 'optionxform',  when: 'Why keys are lowercased' },
    { name: 'DEFAULTSECT',  slug: 'defaultsect',  when: 'Where inherited keys come from' },
    { name: 'NoSectionError', slug: 'nosectionerror', when: 'What options() raises for a missing section' },
  ],

  faq: [
    {
      q: 'How do I get all keys of a section in configparser?',
      a: "config.options('section') or list(config['section']). Both include keys inherited from the DEFAULT section, after the section own keys.",
    },
    {
      q: 'How do I check if a key exists in a configparser section?',
      a: "config.has_option('section', 'key') or 'key' in config['section']. Both are case-insensitive and both count DEFAULT keys; has_option returns False for a missing section instead of raising.",
    },
    {
      q: 'Why does a key still exist after remove_option?',
      a: 'The DEFAULT section has the same key, and every section inherits DEFAULT values. remove_option only deletes from the section you name; remove it from DEFAULT too if it should vanish everywhere.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.options',
    meta:  'ConfigParser.options',
  },

};
