// content/reference/python/stdlib/configparser/extendedinterpolation.js — ExtendedInterpolation

export const meta = {
  slug:        'extendedinterpolation',
  name:        'configparser.ExtendedInterpolation',
  signature:   'configparser.ExtendedInterpolation()',
  blurb:       'zc.buildout-style interpolation: ${key} refers to the same section (or DEFAULT), ${section:key} to any section, and $$ is a literal $. % has no special meaning.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'configparser ExtendedInterpolation ${section:option} ${option} cross section reference configparser variables other section dollar interpolation zc.buildout $$ escape python ini reference another section',
};

export const method = {
  slug:      'extendedinterpolation',
  name:      'configparser.ExtendedInterpolation',
  signature: 'configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())',
  returns:   { type: 'ExtendedInterpolation', desc: 'A handler for the interpolation= argument.' },

  category:    'configparser class',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Opt in with interpolation=ExtendedInterpolation() — an instance, not the class. ${key} is looked up like a %(key)s reference; ${section:key} reads that section raw and expands the result in the context of that section, so chains can cross sections. Section names are matched exactly, keys through optionxform. A $ not followed by $ or { is an InterpolationSyntaxError.',

  covers: ['ExtendedInterpolation'],

  cheat: {
    commonCall: "python_dir: ${Frameworks:path}/Python    # in the .ini file",
    returns:    'the value with the other section\'s path substituted',
    replaces:   'copying shared values into every section',
    watchOut:   'a literal $ must be written $$',
  },

  parameters: [],

  modes: [
    {
      id: 'expand',
      label: '${section:key}',
      blurb: 'Read the lines with ExtendedInterpolation and get one value.',
      params: [
        { name: 'line1',   type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',   type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',   type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4',   type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'line5',   type: 'str', hint: 'INI line 5', input: 'text' },
        { name: 'section', type: 'str', hint: 'section', input: 'text' },
        { name: 'key',     type: 'str', hint: 'key',     input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}, {$line5}]))\nconfig.get({$section}, {$key})",
      cases: [
        { id: 'docs',    label: 'docs example',     values: { line1: '[Common]', line2: 'home_dir: /Users', line3: '[Arthur]', line4: 'my_dir: ${Common:home_dir}/twosheds', line5: 'my_pictures: ${my_dir}/Pictures', section: 'Arthur', key: 'my_pictures' } },
        { id: 'dollar',  label: '$$ and %',         values: { line1: '[shop]', line2: 'price: $$80', line3: 'discount: 50%', line4: 'label: ${price} at ${discount} off', line5: '', section: 'shop', key: 'label' } },
        { id: 'case',    label: 'wrong section case', values: { line1: '[Common]', line2: 'home_dir: /Users', line3: '[Arthur]', line4: 'my_dir: ${common:home_dir}/twosheds', line5: '', section: 'Arthur', key: 'my_dir' } },
        { id: 'colons',  label: 'two colons',       values: { line1: '[a]', line2: 'x: ${b:c:d} tail', line3: '', line4: '', line5: '', section: 'a', key: 'x' } },
        { id: 'bare',    label: 'a bare $',         values: { line1: '[shop]', line2: 'price: $80', line3: '', line4: '', line5: '', section: 'shop', key: 'price' } },
      ],
    },
  ],
  demoExplainer: "${Common:home_dir} pulls a value from another section and ${my_dir} from the same one, giving /Users/twosheds/Pictures. $$80 reads back as $80 and 50% needs no escaping. Section names are case-sensitive, so ${common:home_dir} fails with InterpolationMissingOptionError, reporting the reference as 'common:home_dir'. More than one colon raises InterpolationSyntaxError — and its message shows the text after the reference (' tail'), not the reference itself. A $ followed by anything but $ or { is a syntax error too.",

  patterns: [
    {
      name: 'Shared values in one section',
      desc: 'Keep paths or hosts in [common] and refer to them from everywhere.',
      code: "# [common]\n# root = /srv/app\n# [web]\n# static = ${common:root}/static\n# [worker]\n# queue = ${common:root}/queue",
    },
    {
      name: 'Turn it on',
      desc: 'Pass an instance.',
      code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read('buildout.cfg', encoding='utf-8')",
    },
    {
      name: 'Comment characters at line start',
      desc: 'The docs trick: interpolate the prefix from DEFAULT so a multi-line value can start with #.',
      code: "# [DEFAULT]\n# hash = #\n# [hashes]\n# shebang =\n#   ${hash}!/usr/bin/env python",
    },
  ],

  examples: [
    { title: 'Across sections',               code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[db]\\nhost = db.example\\n[app]\\nurl = postgres://${db:host}/app')\nconfig['app']['url']", returns: "'postgres://db.example/app'" },
    { title: 'Same section and DEFAULT',      code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[DEFAULT]\\nroot = /srv\\n[a]\\nx = ${root}/x\\ny = ${DEFAULT:root}/y')\n(config['a']['x'], config['a']['y'])", returns: "('/srv/x', '/srv/y')" },
    { title: 'Chains across sections',        code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[a]\\nx = ${b:y}\\n[b]\\ny = ${z}\\nz = deep')\nconfig['a']['x']", returns: "'deep'" },
    { title: '% is plain text',               code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[log]\\ndatefmt = %Y-%m-%d')\nconfig['log']['datefmt']", returns: "'%Y-%m-%d'" },
    { title: '$$ is a literal $',             code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[shop]\\nprice = $$80')\nconfig['shop']['price']", returns: "'$80'" },
    { title: 'Errors name the inner reference', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[a]\\nx = ${b:y}\\n[b]\\ny = ${missing}')\nconfig['a']['x']", returns: "configparser.InterpolationMissingOptionError: Bad value substitution: option 'y' in section 'b' contains an interpolation key 'missing' which is not a valid option name. Raw value: '${missing}'" },
  ],

  pitfalls: [
    {
      name: 'Prices and shell variables with $',
      desc: 'Every $ starts a reference. Double it, or use a parser without interpolation for such files.',
      wrong: { label: 'price = $80',  code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[shop]\\nprice = $80')\nconfig['shop']['price']", output: "configparser.InterpolationSyntaxError: '$' must be followed by '$' or '{', found: '$80'" },
      fix:   { label: 'price = $$80', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[shop]\\nprice = $$80')\nconfig['shop']['price']", output: "'$80'" },
    },
    {
      name: 'Expecting environment variables',
      desc: '${HOME} is looked up as a key of the config, not in the environment.',
      wrong: { label: '${HOME}',            code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[paths]\\ndata = ${HOME}/data')\nconfig['paths']['data']", output: "configparser.InterpolationMissingOptionError: Bad value substitution: option 'data' in section 'paths' contains an interpolation key 'HOME' which is not a valid option name. Raw value: '${HOME}/data'" },
      fix:   { label: 'pass it in vars=',   code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[paths]\\ndata = ${HOME}/data')\nconfig.get('paths', 'data', vars={'HOME': '/home/ada'})", output: "'/home/ada/data'" },
    },
  ],

  when: {
    use: [
      'Values shared between sections — hosts, roots, versions',
      'Files with many % signs (logging formats, dates) that still need references',
      'buildout-style configuration files',
    ],
    avoid: [
      'Files with literal $ (prices, shell snippets) unless you escape them',
      'Environment variables → a custom Interpolation subclass',
    ],
  },

  notes: {
    cpython:      '_KEYCRE = re.compile(r"\\$\\{([^}]+)\\}"); ${key} → map[optionxform(key)]; ${sect:key} → parser.get(sect, optionxform(key), raw=True), and a value containing $ is expanded again with that section and dict(parser.items(sect, raw=True)) as context',
    'Errors':     'A missing section or key becomes InterpolationMissingOptionError with the reference text ("sect:key"); more than one ":" is InterpolationSyntaxError("More than one \':\' found: …") showing the rest of the value after the reference',
    'Valueless keys': 'A reference to a key whose value is None (allow_no_value) raises TypeError in 3.13.3; later 3.13 releases skip it',
  },

  related: [
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'The default %(name)s syntax' },
    { name: 'Interpolation',      slug: 'interpolation',      when: 'Write your own handler' },
    { name: 'InterpolationMissingOptionError', slug: 'interpolationmissingoptionerror', when: 'A reference that cannot be resolved' },
    { name: 'InterpolationSyntaxError', slug: 'interpolationsyntaxerror', when: 'A bad $ or a second colon' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I reference a value from another section in configparser?',
      a: "Create the parser with interpolation=configparser.ExtendedInterpolation() and write ${section:key} in the value, e.g. url = postgres://${db:host}/app. The default BasicInterpolation cannot do this.",
    },
    {
      q: 'Does ExtendedInterpolation read environment variables?',
      a: 'No. ${NAME} is looked up in vars=, the current section and DEFAULT. Pass os.environ values through vars= or write a custom Interpolation that expands them.',
    },
    {
      q: 'How do I write a literal $ with ExtendedInterpolation?',
      a: 'Double it: price = $$80 reads back as $80. set() also checks the syntax and raises ValueError for a lone $.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ExtendedInterpolation',
    meta:  'configparser.ExtendedInterpolation',
  },

};
