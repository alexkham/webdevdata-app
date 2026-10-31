// content/reference/python/stdlib/configparser/basicinterpolation.js — BasicInterpolation

export const meta = {
  slug:        'basicinterpolation',
  name:        'configparser.BasicInterpolation',
  signature:   'configparser.BasicInterpolation()',
  blurb:       'The default interpolation of ConfigParser: %(name)s in a value is replaced by another key of the same section (or DEFAULT) when the value is read, and %% stands for a literal %.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'configparser BasicInterpolation %(name)s interpolation percent reference other key %% escape percent sign configparser variables in values python ini substitution invalid interpolation syntax',
};

export const method = {
  slug:      'basicinterpolation',
  name:      'configparser.BasicInterpolation',
  signature: 'configparser.BasicInterpolation()',
  returns:   { type: 'BasicInterpolation', desc: 'A handler to pass as interpolation= (ConfigParser already uses one by default).' },

  category:    'configparser class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'References are resolved late, on every get: %(home_dir)s looks home_dir up in vars, the same section and DEFAULT — through optionxform, so %(HOME_DIR)s works too — and the result is expanded again if it contains %, up to MAX_INTERPOLATION_DEPTH levels. Any other use of % is an error: set() raises ValueError, get() raises InterpolationSyntaxError.',

  covers: ['BasicInterpolation'],

  cheat: {
    commonCall: "logs = %(base)s/logs    # in the .ini file",
    returns:    "config['paths']['logs'] → '/srv/app/logs'",
    replaces:   'string formatting after every get()',
    watchOut:   'a literal % must be written %%',
  },

  parameters: [],

  modes: [
    {
      id: 'expand',
      label: '%(name)s',
      blurb: 'The docs example: chained references in [Paths]. Get any key.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'key',   type: 'str', hint: 'key to get', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join(['[Paths]', {$line1}, {$line2}, {$line3}]))\n(config.get('Paths', {$key}), config.get('Paths', {$key}, raw=True))",
      cases: [
        { id: 'chain',   label: 'chained',         values: { line1: 'home_dir: /Users', line2: 'my_dir: %(home_dir)s/lumberjack', line3: 'my_pictures: %(my_dir)s/Pictures', key: 'my_pictures' } },
        { id: 'escape',  label: '%%',              values: { line1: 'gain: 80%%', line2: '', line3: '', key: 'gain' } },
        { id: 'upper',   label: '%(HOME_DIR)s',    values: { line1: 'home_dir: /Users', line2: 'my_dir: %(HOME_DIR)s/me', line3: '', key: 'my_dir' } },
        { id: 'missing', label: 'missing name',    values: { line1: 'my_dir: %(home)s/lumberjack', line2: '', line3: '', key: 'my_dir' } },
        { id: 'bare',    label: 'a bare %',        values: { line1: 'pattern: %Y-%m-%d', line2: '', line3: '', key: 'pattern' } },
      ],
    },
    {
      id: 'setcheck',
      label: 'syntax check on set',
      blurb: 'set() validates the value before storing it. The position counts in the value after %% and valid references are removed.',
      params: [{ name: 'value', type: 'str', hint: 'a value with %', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('s')\nconfig.set('s', 'k', {$value})\nconfig.get('s', 'k', raw=True)",
      cases: [
        { id: 'ok',      label: '%(a)s and %%',  values: { value: '%(a)s is 100%%' } },
        { id: 'bad',     label: '50%',           values: { value: 'up to 50%' } },
        { id: 'shifted', label: '%(a)s 50%',     values: { value: '%(a)s 50%' } },
        { id: 'unclosed', label: '%(a',          values: { value: 'x %(a' } },
      ],
    },
  ],
  demoExplainer: "my_pictures expands through my_dir to /Users/lumberjack/Pictures, while raw=True shows the text as written. %% reads back as a single %, and %(HOME_DIR)s finds home_dir because reference names go through optionxform. A reference to a key that does not exist raises InterpolationMissingOptionError, and a % not followed by % or ( raises InterpolationSyntaxError — at get time, since read_string does not check values. set() checks immediately: '%(a)s 50%' is reported at position 3, because the position is counted after the valid %(a)s was removed, not in the original value.",

  patterns: [
    {
      name: 'Shared base paths',
      desc: 'Define a root once (often in DEFAULT) and build on it.',
      code: "# [DEFAULT]\n# root = /srv/app\n# [paths]\n# logs = %(root)s/logs\n# data = %(root)s/data",
    },
    {
      name: 'Per-call substitutions',
      desc: 'vars= takes priority when references are resolved.',
      code: "config.get('paths', 'logs', vars={'root': '/tmp/test'})",
    },
    {
      name: 'Escape user input before storing',
      desc: 'Double every % so arbitrary text survives.',
      code: "config.set('db', 'password', password.replace('%', '%%'))",
    },
  ],

  examples: [
    { title: 'References are expanded on get',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[paths]\\nbase = /srv/app\\nlogs = %(base)s/logs')\nconfig['paths']['logs']", returns: "'/srv/app/logs'" },
    { title: 'DEFAULT keys can be referenced',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nroot = /srv\\n[web]\\nstatic = %(root)s/static')\nconfig['web']['static']", returns: "'/srv/static'" },
    { title: 'Late binding: change base, logs follows', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[paths]\\nbase = /srv/app\\nlogs = %(base)s/logs')\nconfig['paths']['base'] = '/tmp'\nconfig['paths']['logs']", returns: "'/tmp/logs'" },
    { title: '%% is a literal %',               code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\ngain = 80%%')\n(config['s']['gain'], config.get('s', 'gain', raw=True))", returns: "('80%', '80%%')" },
    { title: 'Explicitly, same as the default', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.BasicInterpolation())\nconfig.read_string('[s]\\na = 1\\nb = %(a)s%(a)s')\nconfig['s']['b']", returns: "'11'" },
    { title: 'Only the same section and DEFAULT', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[a]\\nx = 1\\n[b]\\ny = %(x)s')\nconfig['b']['y']", returns: "configparser.InterpolationMissingOptionError: Bad value substitution: option 'y' in section 'b' contains an interpolation key 'x' which is not a valid option name. Raw value: '%(x)s'" },
    { title: 'set() rejects a bare %',          code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('s')\nconfig.set('s', 'rate', '5%')", returns: "ValueError: invalid interpolation syntax in '5%' at position 1" },
  ],

  pitfalls: [
    {
      name: 'Date formats and other % strings',
      desc: 'Logging formats, strftime patterns and URL-encoded text are full of %. Escape them as %% or turn interpolation off for that parser.',
      wrong: { label: 'BasicInterpolation', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[log]\\ndatefmt = %Y-%m-%d')\nconfig['log']['datefmt']", output: "configparser.InterpolationSyntaxError: '%' must be followed by '%' or '(', found: '%Y-%m-%d'" },
      fix:   { label: 'interpolation=None', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=None)\nconfig.read_string('[log]\\ndatefmt = %Y-%m-%d')\nconfig['log']['datefmt']", output: "'%Y-%m-%d'" },
    },
    {
      name: 'Referencing another section',
      desc: 'BasicInterpolation only looks in the current section and DEFAULT. ExtendedInterpolation supports ${section:key}.',
      wrong: { label: '%(x)s from [a]',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[a]\\nx = 1\\n[b]\\ny = %(x)s')\nconfig.get('b', 'y')", output: "configparser.InterpolationMissingOptionError: Bad value substitution: option 'y' in section 'b' contains an interpolation key 'x' which is not a valid option name. Raw value: '%(x)s'" },
      fix:   { label: '${a:x}',          code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[a]\\nx = 1\\n[b]\\ny = ${a:x}')\nconfig.get('b', 'y')", output: "'1'" },
    },
  ],

  when: {
    use: [
      'Values built from other values of the same section or DEFAULT',
      'Classic INI files written for ConfigParser (setup.cfg-style %(here)s references)',
    ],
    avoid: [
      'Values containing % for other reasons → interpolation=None, or escape as %%',
      'References across sections → ExtendedInterpolation',
    ],
  },

  notes: {
    cpython:      '_KEYCRE = re.compile(r"%\\(([^)]+)\\)s"); _interpolate_some walks the value: %% → %, %(name)s → map[optionxform(name)], recursing (depth + 1) when the substituted value contains %',
    'before_set': "Removes %% and every valid %(name)s, then raises ValueError('invalid interpolation syntax in %r at position %d') if a % is left — the position is in that reduced string",
    'Lookup map': 'The map is the ChainMap(vars, section, DEFAULT) built by get(), so vars= entries can be referenced and override file values',
  },

  related: [
    { name: 'ExtendedInterpolation', slug: 'extendedinterpolation', when: '${section:key} syntax' },
    { name: 'Interpolation',         slug: 'interpolation',         when: 'The base class and its hooks' },
    { name: 'InterpolationSyntaxError', slug: 'interpolationsyntaxerror', when: 'A bad % in a value' },
    { name: 'InterpolationMissingOptionError', slug: 'interpolationmissingoptionerror', when: 'A reference to a missing key' },
    { name: 'InterpolationDepthError', slug: 'interpolationdeptherror', when: 'References that never end' },
  ],

  faq: [
    {
      q: 'What does %(name)s mean in a configparser file?',
      a: 'It is a reference to another key: with the default BasicInterpolation, %(name)s is replaced by the value of name from the same section or DEFAULT when the value is read. Write %% for a literal percent sign.',
    },
    {
      q: 'How do I turn off interpolation in configparser?',
      a: 'ConfigParser(interpolation=None), or use RawConfigParser. For a single lookup, pass raw=True to get() or items().',
    },
    {
      q: 'Can BasicInterpolation reference keys from another section?',
      a: 'No — only the current section, DEFAULT and vars=. Use ExtendedInterpolation, where ${other_section:key} works.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.BasicInterpolation',
    meta:  'configparser.BasicInterpolation',
  },

};
