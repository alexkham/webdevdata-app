// content/reference/python/stdlib/configparser/items.js — items

export const meta = {
  slug:        'items',
  name:        'ConfigParser.items',
  signature:   'config.items(section, raw=False, vars=None) · config.items()',
  blurb:       'With a section: a list of (key, value) pairs, DEFAULT keys first, values interpolated. Without arguments: the (name, SectionProxy) pairs of every section, DEFAULT included.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions (vars no longer listed since 3.8)',
  searchTerms: 'configparser items RawConfigParser.items ConfigParser.items list of key value pairs section to dict all values in section raw vars itemsview python iterate config section',
};

export const method = {
  slug:      'items',
  name:      'ConfigParser.items',
  signature: 'config.items(section, raw=False, vars=None)',
  returns:   { type: 'list[tuple[str, str]] | ItemsView', desc: 'items(section): a new list of (key, value) tuples. items(): an ItemsView of (section_name, SectionProxy) pairs.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions (vars no longer listed since 3.8)',
  hasLiveDemo: true,

  subtitle: 'Two methods share one name. items(section) copies DEFAULT, updates it with the section, then interpolates each value (raw=True skips that) — so inherited keys come first, in DEFAULT order. vars= feeds interpolation but, since Python 3.8, its keys are not added to the list. items() with no section is the mapping-protocol view of the whole parser.',

  covers: ['RawConfigParser.items'],

  cheat: {
    commonCall: "dict(config.items('server'))",
    returns:    "{'timeout': '30', 'host': 'example.com'}",
    replaces:   'a loop over options() calling get() for each',
    watchOut:   'DEFAULT keys are included (and listed first)',
  },

  parameters: [
    { name: 'section', type: 'str',         required: false, default: '<unset>', desc: 'Section name, or the default section name. Omit it to get the (name, proxy) pairs of all sections.' },
    { name: 'raw',     type: 'bool',        required: false, default: 'False',   desc: 'True returns the values without interpolation. Positional or keyword (unlike get()).' },
    { name: 'vars',    type: 'dict | None', required: false, default: 'None',    desc: 'Extra values used for interpolation and for keys that exist in the section. Not converted to str here.' },
  ],

  modes: [
    {
      id: 'section',
      label: 'items(section)',
      blurb: 'List one section as (key, value) pairs.',
      params: [
        { name: 'line1',   type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',   type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',   type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4',   type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'section', type: 'str', hint: 'section name', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}]))\nconfig.items({$section})",
      cases: [
        { id: 'order',   label: 'DEFAULT first',  values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'server' } },
        { id: 'interp',  label: 'interpolated',   values: { line1: '[paths]', line2: 'base = /srv/app', line3: 'logs = %(base)s/logs', line4: '', section: 'paths' } },
        { id: 'default', label: 'DEFAULT itself', values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'DEFAULT' } },
        { id: 'missing', label: 'missing',        values: { line1: '[DEFAULT]', line2: 'timeout = 30', line3: '[server]', line4: 'host = example.com', section: 'client' } },
      ],
    },
    {
      id: 'rawvars',
      label: 'raw and vars',
      blurb: 'The same section raw, and with vars= changing what %(base)s means.',
      params: [{ name: 'base', type: 'str', hint: 'vars value for base', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[paths]\\nbase = /srv/app\\nlogs = %(base)s/logs')\n(config.items('paths', raw=True), config.items('paths', vars={'base': {$base}, 'extra': 'x'}))",
      cases: [
        { id: 'tmp',  label: "'/tmp'",   values: { base: '/tmp' } },
        { id: 'home', label: "'~/app'",  values: { base: '~/app' } },
      ],
    },
    {
      id: 'all',
      label: 'items()',
      blurb: 'Without a section: every (name, proxy) pair, DEFAULT first.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}]))\nlist(config.items())",
      cases: [
        { id: 'two',  label: 'two sections', values: { line1: '[web]', line2: '[db]' } },
        { id: 'none', label: 'no sections',  values: { line1: '', line2: '' } },
      ],
    },
  ],
  demoExplainer: "items('server') starts with timeout from DEFAULT, then the section own keys; values are interpolated (logs becomes /srv/app/logs). items('DEFAULT') works even though DEFAULT is not a section, and a missing section raises NoSectionError. With vars=, base is replaced for interpolation (so logs follows it), the base pair itself shows the vars value, and extra is not listed at all — only keys that exist in the section or DEFAULT appear. items() without a section returns proxies, always beginning with DEFAULT.",

  patterns: [
    {
      name: 'A section as a dict',
      desc: 'dict(items(...)) is a snapshot with DEFAULT values and interpolation applied.',
      code: "settings = dict(config.items('server'))",
    },
    {
      name: 'Everything, nested',
      desc: 'One dict per section; DEFAULT folded into each.',
      code: "data = {name: dict(config.items(name)) for name in config.sections()}",
    },
    {
      name: 'Values exactly as written',
      desc: 'raw=True keeps %(name)s references, e.g. to copy them into another file.',
      code: "templates = config.items('paths', raw=True)",
    },
  ],

  examples: [
    { title: 'Pairs, DEFAULT first',            code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nb = 2\\n[s]\\na = 1\\nb = 3')\nconfig.items('s')", returns: "[('b', '3'), ('a', '1')]" },
    { title: 'raw is positional here',          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[p]\\nbase = /srv\\nlogs = %(base)s/logs')\nconfig.items('p', True)", returns: "[('base', '/srv'), ('logs', '%(base)s/logs')]" },
    { title: 'vars feeds interpolation only',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[p]\\nlogs = %(base)s/logs')\nconfig.items('p', vars={'base': '/tmp'})", returns: "[('logs', '/tmp/logs')]" },
    { title: 'items() is the mapping view',     code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[web]')\nlist(config.items())", returns: "[('DEFAULT', <Section: DEFAULT>), ('web', <Section: web>)]" },
    { title: 'Valueless keys become empty strings', code: "import configparser\nconfig = configparser.ConfigParser(allow_no_value=True)\nconfig.read_string('[mysqld]\\nskip-bdb')\n(config.items('mysqld'), config.get('mysqld', 'skip-bdb'))", returns: "([('skip-bdb', '')], None)" },
    { title: 'Missing section',                 code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.items('server')", returns: "configparser.NoSectionError: No section: 'server'" },
  ],

  pitfalls: [
    {
      name: 'Non-str values in vars',
      desc: 'get() converts vars values with str(); items() does not, so an int breaks interpolation.',
      wrong: { label: "vars={'n': 5}",   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[p]\\nworkers = %(n)s')\nconfig.items('p', vars={'n': 5})", output: "TypeError: argument of type 'int' is not iterable" },
      fix:   { label: "vars={'n': '5'}", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[p]\\nworkers = %(n)s')\nconfig.items('p', vars={'n': '5'})", output: "[('workers', '5')]" },
    },
    {
      name: 'Expecting only the section own keys',
      desc: 'items(section) includes everything inherited from DEFAULT. Compare with defaults() to see what came from where.',
      wrong: { label: "items('empty')",   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nretries = 3\\n[empty]')\nconfig.items('empty')", output: "[('retries', '3')]" },
      fix:   { label: 'defaults() too', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nretries = 3\\n[empty]')\n(config.items('empty'), config.defaults())", output: "([('retries', '3')], {'retries': '3'})" },
    },
  ],

  when: {
    use: [
      'Iterating over every key/value pair of a section',
      'Converting a section (or the whole file) into plain dicts',
    ],
    avoid: [
      'One value → get() or config[section][key]',
      'Typed values → the getters; items() returns strings',
    ],
  },

  notes: {
    cpython:      'd = self._defaults.copy(); d.update(self._sections[section]); orig_keys = list(d.keys()); vars are added to d afterwards, so they influence interpolation but are not in orig_keys',
    'Python 3.8': 'Before 3.8 the keys of vars= were listed too; now only real options are',
    'Valueless keys': 'With BasicInterpolation a None value becomes "" in items() (get() returns None); RawConfigParser keeps None',
  },

  related: [
    { name: 'options',       slug: 'options',      when: 'Only the keys' },
    { name: 'get',           slug: 'get',          when: 'One value' },
    { name: 'SectionProxy',  slug: 'sectionproxy', when: 'dict(config[section]) does the same' },
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'How %(name)s is expanded' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I convert a configparser section to a dictionary?',
      a: "dict(config.items('section')) or dict(config['section']). Both include DEFAULT values and apply interpolation; add raw=True to items() to get the values as written.",
    },
    {
      q: 'Why does items() return keys that are not in my section?',
      a: 'They come from the DEFAULT section, which every section inherits. items(section) lists DEFAULT keys first, then the section own keys.',
    },
    {
      q: 'What does config.items() return without arguments?',
      a: 'An ItemsView of (section_name, SectionProxy) pairs for every section, starting with DEFAULT — the mapping-protocol view of the parser. Wrap it in list() to see it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.items',
    meta:  'ConfigParser.items',
  },

};
