// content/reference/python/stdlib/configparser/defaultsect.js — DEFAULTSECT and defaults()

export const meta = {
  slug:        'defaultsect',
  name:        'configparser.DEFAULTSECT',
  signature:   "configparser.DEFAULTSECT = 'DEFAULT' · config.defaults() · ConfigParser(default_section=...)",
  blurb:       'The name of the special section whose keys every other section inherits — "DEFAULT" unless you pass default_section=. defaults() returns its contents as a dict.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser DEFAULTSECT DEFAULT section defaults RawConfigParser.defaults default_section default values for all sections inherit python ini [DEFAULT] general common section',
};

export const method = {
  slug:      'defaultsect',
  name:      'configparser.DEFAULTSECT',
  signature: 'config.defaults()',
  returns:   { type: 'dict', desc: 'defaults(): the DEFAULT section itself (the live dict, not a copy). DEFAULTSECT is the str "DEFAULT".' },

  category:    'configparser constant',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Keys in [DEFAULT] appear in every section that does not set them itself, and they are available to %(name)s interpolation everywhere. DEFAULT is stored apart from the sections: it is never in sections(), cannot be added or removed, and is written first by write(). default_section= renames it — then a literal [DEFAULT] is an ordinary section.',

  covers: ['DEFAULTSECT', 'RawConfigParser.defaults'],

  cheat: {
    commonCall: "config.defaults()",
    returns:    "{'timeout': '30'}",
    replaces:   'repeating the same key in every section',
    watchOut:   'defaults() returns the live dict — changes affect the parser',
  },

  parameters: [],

  modes: [
    {
      id: 'inherit',
      label: 'inheritance',
      blurb: 'Every section sees the DEFAULT keys it does not override.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'line5', type: 'str', hint: 'INI line 5', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}, {$line5}]))\n(config.defaults(), {name: dict(config[name]) for name in config.sections()})",
      cases: [
        { id: 'basic',    label: 'timeout for all', values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[web]', line4: '[db]', line5: 'timeout = 5' } },
        { id: 'interp',   label: 'interpolation',   values: { line1: '[DEFAULT]', line2: 'root = /srv', line3: '[web]', line4: 'logs = %(root)s/web', line5: '' } },
        { id: 'override', label: 'section %(root)s', values: { line1: '[DEFAULT]', line2: 'root = /srv', line3: 'logs = %(root)s/logs', line4: '[test]', line5: 'root = /tmp' } },
      ],
    },
    {
      id: 'rename',
      label: 'default_section=',
      blurb: 'Rename the special section; a literal [DEFAULT] then becomes an ordinary section.',
      params: [{ name: 'name', type: 'str', hint: 'default_section', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser(default_section={$name})\nconfig.read_string('[general]\\nroot = /srv\\n[DEFAULT]\\nmode = test\\n[web]\\nport = 80')\n(config.defaults(), config.sections())",
      cases: [
        { id: 'default', label: "'DEFAULT'", values: { name: 'DEFAULT' } },
        { id: 'general', label: "'general'", values: { name: 'general' } },
        { id: 'web',     label: "'web'",     values: { name: 'web' } },
      ],
    },
  ],
  demoExplainer: "[web] has no keys of its own but shows timeout = 30; [db] overrides it with 5. DEFAULT values can be used in %(name)s references from any section, and interpolation runs in the section that is read: in [test], logs (defined in DEFAULT) expands with the section own root, /tmp. With default_section='general', [general] supplies the defaults and [DEFAULT] is listed as an ordinary section; with 'web', the web section is the defaults and is no longer listed.",

  patterns: [
    {
      name: 'Shared settings in [DEFAULT]',
      desc: 'Define once, override per section where needed.',
      code: "# app.ini\n# [DEFAULT]\n# timeout = 30\n# [primary]\n# host = db1\n# [replica]\n# host = db2\n# timeout = 5",
    },
    {
      name: 'A friendlier name',
      desc: 'default_section= lets the file use [general] or [common] for the shared values.',
      code: "import configparser\nconfig = configparser.ConfigParser(default_section='general')\nconfig.read('app.ini', encoding='utf-8')",
    },
    {
      name: 'Defaults from code',
      desc: 'defaults= fills DEFAULT before any file is read.',
      code: "import configparser\nconfig = configparser.ConfigParser(defaults={'timeout': '30', 'retries': '3'})",
    },
  ],

  examples: [
    { title: 'The constant',                  code: 'import configparser\nconfigparser.DEFAULTSECT', returns: "'DEFAULT'" },
    { title: 'defaults() is the DEFAULT section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nTimeout = 30\\n[web]\\nport = 80')\nconfig.defaults()", returns: "{'timeout': '30'}" },
    { title: 'DEFAULT is not a section',      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1')\n(config.sections(), config.has_section('DEFAULT'), 'DEFAULT' in config)", returns: '([], False, True)' },
    { title: 'Two [DEFAULT] headers merge',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1\\n[DEFAULT]\\nb = 2')\nconfig.defaults()", returns: "{'a': '1', 'b': '2'}" },
    { title: 'defaults() is live',            code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[web]')\nconfig.defaults()['timeout'] = '30'\nconfig['web']['timeout']", returns: "'30'" },
    { title: 'write() puts DEFAULT first',    code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig['web'] = {'port': '80'}\nconfig['DEFAULT'] = {'debug': 'no'}\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue().splitlines()", returns: "['[DEFAULT]', 'debug = no', '', '[web]', 'port = 80', '']" },
    { title: 'default_section can change later', code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1')\nconfig.default_section = 'common'\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[common]\\na = 1\\n\\n'" },
  ],

  pitfalls: [
    {
      name: 'Expecting a fallback to beat DEFAULT',
      desc: 'Lookups check the section, then DEFAULT, and only then the fallback.',
      wrong: { label: "fallback='5'", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\n[db]')\nconfig.get('db', 'timeout', fallback='5')", output: "'30'" },
      fix:   { label: 'set it in the section', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\ntimeout = 30\\n[db]\\ntimeout = 5')\nconfig.get('db', 'timeout')", output: "'5'" },
    },
    {
      name: 'options() of DEFAULT',
      desc: 'Section methods do not accept DEFAULT. Use defaults() for its keys.',
      wrong: { label: "options('DEFAULT')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1')\nconfig.options('DEFAULT')", output: "configparser.NoSectionError: No section: 'DEFAULT'" },
      fix:   { label: 'list(defaults())',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\na = 1')\nlist(config.defaults())", output: "['a']" },
    },
  ],

  when: {
    use: [
      'Values shared by most sections: timeouts, paths, credentials',
      'Base values for %(name)s interpolation',
    ],
    avoid: [
      'Keys that only some sections should have — they show up in every section',
      'Section-specific fallbacks → read_dict({"section": {...}}) before reading the file',
    ],
  },

  notes: {
    cpython:      "DEFAULTSECT = 'DEFAULT'; the parser keeps DEFAULT in self._defaults (returned by defaults()) and every section in self._sections; lookups use ChainMap(vars, section, defaults)",
    'Strict mode': 'A repeated [DEFAULT] header is merged even with strict=True; a repeated key inside DEFAULT still raises DuplicateOptionError',
    'Renaming':   'default_section is a plain instance attribute: changing it later does not move existing data, but changes how the defaults are written and which name refers to them',
  },

  related: [
    { name: 'ConfigParser',  slug: 'configparser', when: 'defaults= and default_section=' },
    { name: 'items',         slug: 'items',        when: 'Lists DEFAULT keys first' },
    { name: 'options',       slug: 'options',      when: 'Includes inherited keys' },
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'DEFAULT values in %(name)s' },
    { name: 'UNNAMED_SECTION', slug: 'unnamed_section', when: 'The other special section name (3.13)' },
  ],

  faq: [
    {
      q: 'What is the DEFAULT section in configparser?',
      a: 'A special section whose keys are visible in every other section (unless overridden there) and usable in interpolation. Its name is configparser.DEFAULTSECT, "DEFAULT", unless the parser was created with default_section=.',
    },
    {
      q: 'Why is DEFAULT not in config.sections()?',
      a: 'It is stored separately from the real sections. Use config.defaults() for its contents; has_section("DEFAULT") is False, but "DEFAULT" in config is True.',
    },
    {
      q: 'How do I use a different name than [DEFAULT]?',
      a: "Create the parser with default_section='general' (or any name). That section then supplies the defaults, and a literal [DEFAULT] header is treated like any other section.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.defaults',
    meta:  'ConfigParser.defaults / DEFAULTSECT',
  },

};
