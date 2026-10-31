// content/reference/python/stdlib/configparser/rawconfigparser.js — the RawConfigParser class

export const meta = {
  slug:        'rawconfigparser',
  name:        'configparser.RawConfigParser',
  signature:   "configparser.RawConfigParser(defaults=None, dict_type=dict, allow_no_value=False, *, delimiters=('=', ':'), comment_prefixes=('#', ';'), inline_comment_prefixes=None, strict=True, empty_lines_in_values=True, default_section='DEFAULT', interpolation=None, converters={}, allow_unnamed_section=False)",
  blurb:       'The legacy base class of ConfigParser: the same reading, getters and mapping protocol, but no interpolation by default and no type checks — set() stores any object as-is.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser RawConfigParser raw config parser no interpolation percent sign non-string values set int legacy configparser difference rawconfigparser vs configparser interpolation none',
};

export const method = {
  slug:      'rawconfigparser',
  name:      'configparser.RawConfigParser',
  signature: "configparser.RawConfigParser(defaults=None, dict_type=dict, allow_no_value=False, *, delimiters=('=', ':'), comment_prefixes=('#', ';'), inline_comment_prefixes=None, strict=True, empty_lines_in_values=True, default_section='DEFAULT', interpolation=None, converters={}, allow_unnamed_section=False)",
  returns:   { type: 'RawConfigParser', desc: 'An empty parser whose values are returned exactly as read or stored.' },

  category:    'configparser class',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Every method of ConfigParser is defined here — RawConfigParser is where reading, get(), items(), write() and the mapping protocol live. What it lacks: interpolation (values with % come back untouched) and the str checks in set() and add_section(), so it can hold ints and other objects that a ConfigParser would refuse.',

  covers: ['RawConfigParser'],

  cheat: {
    commonCall: "config = configparser.RawConfigParser()\nconfig.read_string(text)",
    returns:    'a parser that never interpolates',
    replaces:   'ConfigParser when % signs are data, in older code',
    watchOut:   'the docs suggest ConfigParser(interpolation=None) instead',
  },

  parameters: [
    { name: 'defaults',      type: 'dict | None',          required: false, default: 'None', desc: 'Initial DEFAULT values, stored as given (option names pass through optionxform; values are NOT converted to str, unlike ConfigParser).' },
    { name: 'interpolation', type: 'Interpolation | None', required: false, default: 'None', desc: 'No interpolation unless you pass one; BasicInterpolation() or ExtendedInterpolation() work here too.' },
    { name: '…',             type: '',                     required: false, default: '',     desc: 'All other options are the same as ConfigParser: allow_no_value, delimiters, comment_prefixes, inline_comment_prefixes, strict, empty_lines_in_values, default_section, converters, allow_unnamed_section.' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'Raw vs ConfigParser',
      blurb: 'Read the same lines with both classes and get one value from each.',
      params: [
        { name: 'line1',   type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',   type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',   type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'key',     type: 'str', hint: 'key to get from [paths]', input: 'text' },
      ],
      template: "import configparser\ntext = '\\n'.join([{$line1}, {$line2}, {$line3}])\nraw = configparser.RawConfigParser()\ncooked = configparser.ConfigParser()\nraw.read_string(text)\ncooked.read_string(text)\n(raw.get('paths', {$key}), cooked.get('paths', {$key}))",
      cases: [
        { id: 'ref',     label: '%(home)s',       values: { line1: '[paths]', line2: 'home = /home/ada', line3: 'docs = %(home)s/docs', key: 'docs' } },
        { id: 'escape',  label: '%%',             values: { line1: '[paths]', line2: 'gain = 100%%', line3: '', key: 'gain' } },
        { id: 'percent', label: 'a bare %',       values: { line1: '[paths]', line2: 'pattern = %d.log', line3: '', key: 'pattern' } },
        { id: 'missing', label: 'missing name',   values: { line1: '[paths]', line2: 'docs = %(base)s/docs', line3: '', key: 'docs' } },
      ],
    },
    {
      id: 'store',
      label: 'non-str values',
      blurb: 'RawConfigParser.set stores whatever you give it; type a number or text.',
      params: [{ name: 'value', type: 'int | float | str', hint: 'a value to store', input: 'auto' }],
      template: "import configparser\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', {$value})\n(raw.get('app', 'workers'), raw.getint('app', 'workers'))",
      cases: [
        { id: 'int',   label: 'int 4',      values: { value: '4' } },
        { id: 'str',   label: "'four'",     values: { value: 'four' } },
        { id: 'float', label: 'float 2.5',  values: { value: '2.5' } },
        { id: 'text',  label: "'1_000'",    values: { value: '1_000' } },
      ],
    },
  ],
  demoExplainer: 'RawConfigParser returns %(home)s/docs and 100%% exactly as written, while ConfigParser expands the reference and turns %% into %. A bare % or a reference to a missing key is fine for the raw parser but raises InterpolationSyntaxError or InterpolationMissingOptionError in ConfigParser. In non-str values, the int 4 is stored and returned as an int — get() does not convert it — and getint() of the float 2.5 truncates to 2, because int(2.5) is 2. A ConfigParser would refuse all of these with TypeError: option values must be strings.',

  patterns: [
    {
      name: 'Read files full of % signs',
      desc: 'Either class works; ConfigParser(interpolation=None) keeps the type checks.',
      code: "import configparser\nconfig = configparser.ConfigParser(interpolation=None)  # preferred\n# config = configparser.RawConfigParser()            # legacy equivalent\nconfig.read('logging.ini', encoding='utf-8')",
    },
    {
      name: 'Get one value raw from a ConfigParser',
      desc: 'raw=True skips interpolation for a single call — no second parser needed.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\ntemplate = config.get('paths', 'logs', raw=True)",
    },
    {
      name: 'Legacy code storing ints',
      desc: 'Convert at the boundary so the parser only ever holds strings.',
      code: "import configparser\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', str(workers))",
    },
  ],

  examples: [
    { title: 'No interpolation',             code: "import configparser\nraw = configparser.RawConfigParser()\nraw.read_string('[log]\\nformat = %(asctime)s %(message)s')\nraw['log']['format']", returns: "'%(asctime)s %(message)s'" },
    { title: 'set() stores any object',      code: "import configparser\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', 4)\nraw.get('app', 'workers')", returns: '4' },
    { title: 'write() uses str()',           code: "import configparser, io\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', 4)\nbuf = io.StringIO()\nraw.write(buf)\nbuf.getvalue()", returns: "'[app]\\nworkers = 4\\n\\n'" },
    { title: 'defaults= keeps value types',  code: "import configparser\n(configparser.RawConfigParser(defaults={'Retries': 3}).defaults(), configparser.ConfigParser(defaults={'Retries': 3}).defaults())", returns: "({'retries': 3}, {'retries': '3'})" },
    { title: 'Any hashable section name',    code: "import configparser\nraw = configparser.RawConfigParser()\nraw.add_section(2026)\nraw.sections()", returns: '[2026]' },
    { title: 'The mapping protocol still checks', code: "import configparser\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw['app']['workers'] = 4", returns: 'TypeError: option values must be strings' },
    { title: 'ConfigParser is a subclass',   code: 'import configparser\nissubclass(configparser.ConfigParser, configparser.RawConfigParser)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Values change type after a round trip',
      desc: 'An int stored with set() is written as text and read back as a str. Store strings from the start.',
      wrong: { label: 'set an int',  code: "import configparser, io\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', 4)\nbuf = io.StringIO()\nraw.write(buf)\nagain = configparser.RawConfigParser()\nagain.read_string(buf.getvalue())\n(raw.get('app', 'workers'), again.get('app', 'workers'))", output: "(4, '4')" },
      fix:   { label: 'getint() everywhere', code: "import configparser, io\nraw = configparser.RawConfigParser()\nraw.add_section('app')\nraw.set('app', 'workers', '4')\nbuf = io.StringIO()\nraw.write(buf)\nagain = configparser.RawConfigParser()\nagain.read_string(buf.getvalue())\n(raw.getint('app', 'workers'), again.getint('app', 'workers'))", output: '(4, 4)' },
    },
    {
      name: 'Non-str values with interpolation switched on',
      desc: 'Given an interpolation, set() runs its syntax check, which calls str methods on the value.',
      wrong: { label: 'interpolation + int', code: "import configparser\nraw = configparser.RawConfigParser(interpolation=configparser.BasicInterpolation())\nraw.add_section('app')\nraw.set('app', 'workers', 4)", output: "AttributeError: 'int' object has no attribute 'replace'" },
      fix:   { label: 'store a str',         code: "import configparser\nraw = configparser.RawConfigParser(interpolation=configparser.BasicInterpolation())\nraw.add_section('app')\nraw.set('app', 'workers', '4')\nraw.getint('app', 'workers')", output: '4' },
    },
  ],

  when: {
    use: [
      'Maintaining code that already uses it',
      'Reading values that contain % without expanding them (ConfigParser(interpolation=None) does the same)',
    ],
    avoid: [
      'New code → ConfigParser, with interpolation=None if % signs are data',
      'Storing non-string objects → keep a dict; the parser is for text',
    ],
  },

  notes: {
    cpython:      'Lib/configparser.py — class RawConfigParser(MutableMapping) holds the whole implementation; _DEFAULT_INTERPOLATION = Interpolation(), a no-op',
    'Type checks': 'Only the mapping protocol (proxy[key] = value) calls _validate_value_types; set() and add_section() do not',
    'Defaults':   'RawConfigParser._read_defaults stores defaults= as given; ConfigParser reads them with read_dict(), converting to str',
  },

  related: [
    { name: 'ConfigParser',       slug: 'configparser',       when: 'The recommended class' },
    { name: 'Interpolation',      slug: 'interpolation',      when: 'The no-op handler RawConfigParser uses' },
    { name: 'set',                slug: 'set',                when: 'Storing values' },
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'What ConfigParser adds' },
    { name: 'configparser module', slug: 'configparser',      when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Should I use RawConfigParser or ConfigParser?',
      a: 'ConfigParser. The docs call RawConfigParser the legacy variant and suggest ConfigParser(interpolation=None) when you do not want interpolation — you get the same raw values plus the checks that keep write() working.',
    },
    {
      q: 'Why does RawConfigParser return my % signs unchanged?',
      a: 'It has no interpolation by default (its handler is a no-op Interpolation), so %(name)s and %% are plain text. ConfigParser uses BasicInterpolation, which expands them on every get.',
    },
    {
      q: 'Can RawConfigParser store integers?',
      a: 'Yes, set() stores any object and get() returns it unchanged, but the value becomes a str once written and read back, and interpolation would fail on it. The mapping protocol (raw["s"]["k"] = 4) refuses non-strings even on a RawConfigParser.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.RawConfigParser',
    meta:  'configparser.RawConfigParser',
  },

};
