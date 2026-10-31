// content/reference/python/stdlib/configparser/configparser.js — the ConfigParser class

export const meta = {
  slug:        'configparser',
  name:        'configparser.ConfigParser',
  signature:   "configparser.ConfigParser(defaults=None, dict_type=dict, allow_no_value=False, *, delimiters=('=', ':'), comment_prefixes=('#', ';'), inline_comment_prefixes=None, strict=True, empty_lines_in_values=True, default_section='DEFAULT', interpolation=BasicInterpolation(), converters={}, allow_unnamed_section=False)",
  blurb:       'The main INI parser: reads sections of key = value lines, expands %(name)s references, converts values on request and checks that everything you store is a str. Its constructor options adapt it to most INI dialects.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python 3 versions (allow_unnamed_section 3.13+)',
  searchTerms: 'configparser ConfigParser class constructor allow_no_value delimiters comment_prefixes inline_comment_prefixes strict empty_lines_in_values default_section interpolation converters allow_unnamed_section dict_type defaults python ini parser options inline comments safeconfigparser',
};

export const method = {
  slug:      'configparser',
  name:      'configparser.ConfigParser',
  signature: "configparser.ConfigParser(defaults=None, dict_type=dict, allow_no_value=False, *, delimiters=('=', ':'), comment_prefixes=('#', ';'), inline_comment_prefixes=None, strict=True, empty_lines_in_values=True, default_section='DEFAULT', interpolation=BasicInterpolation(), converters={}, allow_unnamed_section=False)",
  returns:   { type: 'ConfigParser', desc: 'An empty parser. Fill it with read(), read_file(), read_string(), read_dict() or dict-style assignment.' },

  category:    'configparser class',
  version:     'All Python 3 versions (allow_unnamed_section 3.13+)',
  hasLiveDemo: true,

  subtitle: 'Subclass of RawConfigParser with two additions: BasicInterpolation by default, and type checks so that set() and add_section() accept only strings. Everything else — the reading rules, getters, mapping protocol and write() — is inherited and shaped by the constructor options.',

  covers: ['ConfigParser'],

  cheat: {
    commonCall: "config = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')",
    returns:    'a dict-like parser: config["section"]["key"]',
    replaces:   'SafeConfigParser (removed in 3.12) and hand-written INI parsing',
    watchOut:   'interpolation= wants an instance: ExtendedInterpolation(), not the class',
  },

  parameters: [
    { name: 'defaults',                type: 'dict | None',     required: false, default: 'None',      desc: 'Initial contents of the DEFAULT section. Read with read_dict(), so keys and values are converted to str.' },
    { name: 'dict_type',               type: 'type',            required: false, default: 'dict',      desc: 'Mapping type used for the section list and each section (dict keeps insertion order).' },
    { name: 'allow_no_value',          type: 'bool',            required: false, default: 'False',     desc: 'Accept keys without a value ("skip-bdb"); their value is None and write() omits the delimiter.' },
    { name: 'delimiters',              type: 'tuple[str, ...]', required: false, default: "('=', ':')", desc: 'Substrings that separate key from value. The first one found on a line wins, so values may contain delimiters but keys may not.' },
    { name: 'comment_prefixes',        type: 'tuple[str, ...]', required: false, default: "('#', ';')", desc: 'Prefixes of whole-line comments (the line may be indented).' },
    { name: 'inline_comment_prefixes', type: 'tuple[str, ...] | None', required: false, default: 'None', desc: 'Prefixes that start a comment after a value; they must follow whitespace. Off by default because values could not contain them otherwise.' },
    { name: 'strict',                  type: 'bool',            required: false, default: 'True',      desc: 'Raise DuplicateSectionError / DuplicateOptionError for repeats within one source. False lets later values win.' },
    { name: 'empty_lines_in_values',   type: 'bool',            required: false, default: 'True',      desc: 'Whether blank lines may be part of a multi-line value. False makes every blank line end the value.' },
    { name: 'default_section',         type: 'str',             required: false, default: "'DEFAULT'", desc: 'Name of the special section whose values every section inherits.' },
    { name: 'interpolation',           type: 'Interpolation | None', required: false, default: 'BasicInterpolation()', desc: 'Value preprocessing on get: BasicInterpolation() for %(name)s, ExtendedInterpolation() for ${section:name}, None for none.' },
    { name: 'converters',              type: 'dict[str, callable]', required: false, default: '{}',    desc: 'Extra getters: {"list": f} adds getlist() to the parser and every section proxy (3.5+).' },
    { name: 'allow_unnamed_section',   type: 'bool',            required: false, default: 'False',     desc: 'Accept keys before the first header, in the section configparser.UNNAMED_SECTION (3.13+).' },
  ],

  modes: [
    {
      id: 'options',
      label: 'constructor options',
      blurb: 'The same few INI lines read by parsers built with different options. Pick a preset by name.',
      params: [
        { name: 'preset', type: 'str', hint: 'a key of presets', input: 'text' },
        { name: 'line1',  type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',  type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',  type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4',  type: 'str', hint: 'INI line 4', input: 'text' },
      ],
      template: "import configparser\npresets = {\n    'default': {},\n    'allow_no_value': {'allow_no_value': True},\n    'inline comments': {'inline_comment_prefixes': ('#', ';')},\n    'strict=False': {'strict': False},\n    'interpolation=None': {'interpolation': None},\n    'empty_lines_in_values=False': {'empty_lines_in_values': False},\n    'delimiters=(\"=\",)': {'delimiters': ('=',)},\n}\nconfig = configparser.ConfigParser(**presets[{$preset}])\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}]))\n{name: dict(config[name]) for name in config.sections()}",
      cases: [
        { id: 'flag-default', label: 'bare key: default',        values: { preset: 'default',        line1: '[mysqld]', line2: 'user = mysql', line3: 'skip-bdb', line4: '' } },
        { id: 'flag-allow',   label: 'bare key: allow_no_value', values: { preset: 'allow_no_value', line1: '[mysqld]', line2: 'user = mysql', line3: 'skip-bdb', line4: '' } },
        { id: 'inline-off',   label: '; note: default',          values: { preset: 'default',         line1: '[server]', line2: 'port = 8080  ; production', line3: '', line4: '' } },
        { id: 'inline-on',    label: '; note: inline comments',  values: { preset: 'inline comments', line1: '[server]', line2: 'port = 8080  ; production', line3: '', line4: '' } },
        { id: 'strict',       label: 'repeat: strict=False',     values: { preset: 'strict=False',    line1: '[a]', line2: 'x = 1', line3: '[a]', line4: 'x = 2' } },
        { id: 'raw',          label: '%: interpolation=None',    values: { preset: 'interpolation=None', line1: '[db]', line2: 'password = 50%off', line3: '', line4: '' } },
        { id: 'blank',        label: 'blank line ends value',    values: { preset: 'empty_lines_in_values=False', line1: '[s]', line2: 'key = first', line3: '', line4: '  this = second' } },
        { id: 'delim',        label: 'only = delimits',          values: { preset: 'delimiters=("=",)', line1: '[urls]', line2: 'https://example.com = home', line3: 'api = https://api.example.com', line4: '' } },
      ],
    },
    {
      id: 'mapping',
      label: 'parser as a mapping',
      blurb: 'The parser is a MutableMapping of sections. DEFAULT is a key but not a section.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}]))\n(config.sections(), list(config), len(config), 'DEFAULT' in config)",
      cases: [
        { id: 'two',     label: 'two sections', values: { line1: '[web]', line2: '[db]', line3: '' } },
        { id: 'default', label: 'with DEFAULT', values: { line1: '[DEFAULT]', line2: 'debug = no', line3: '[web]' } },
        { id: 'empty',   label: 'empty',        values: { line1: '', line2: '', line3: '' } },
      ],
    },
  ],
  demoExplainer: 'A key without = or : is a ParsingError by default (the error lists every bad line); with allow_no_value=True it is kept with the value None. Inline comments are off by default, so "; production" stays part of the value until you pass inline_comment_prefixes. strict=False lets a repeated section or key overwrite the earlier one instead of raising. With empty_lines_in_values=False the blank line ends key, and the indented line becomes a key of its own. With delimiters=("=",) the colon in a URL is no longer a delimiter, so https://example.com can be a key. In the mapping view, DEFAULT is always a key (len counts it) but sections() never lists it.',

  patterns: [
    {
      name: 'An INI dialect with inline comments',
      desc: 'Strip "; comment" after values; the prefix must follow whitespace.',
      code: "import configparser\nconfig = configparser.ConfigParser(inline_comment_prefixes=(';', '#'))\nconfig.read('php.ini', encoding='utf-8')",
    },
    {
      name: 'Lenient reading of hand-edited files',
      desc: 'Accept bare flags and repeated keys (the last one wins).',
      code: "import configparser\nconfig = configparser.ConfigParser(allow_no_value=True, strict=False)\nconfig.read('my.cnf', encoding='utf-8')",
    },
    {
      name: 'Built-in defaults',
      desc: 'defaults= fills DEFAULT before anything is read; values are converted to str.',
      code: "import configparser\nconfig = configparser.ConfigParser(defaults={'timeout': 30, 'retries': 3})\nconfig.read('app.ini', encoding='utf-8')",
    },
    {
      name: 'No interpolation at all',
      desc: 'For files full of % signs (URLs, printf formats, passwords).',
      code: "import configparser\nconfig = configparser.ConfigParser(interpolation=None)",
    },
  ],

  examples: [
    { title: 'Start empty, fill with a dict',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['server'] = {'host': 'example.com', 'port': 8080}\nconfig['server']['port']", returns: "'8080'" },
    { title: 'defaults= becomes DEFAULT',       code: "import configparser\nconfig = configparser.ConfigParser(defaults={'Retries': 3})\n(config.defaults(), config.sections())", returns: "({'retries': '3'}, [])" },
    { title: 'allow_no_value keeps bare keys',  code: "import configparser\nconfig = configparser.ConfigParser(allow_no_value=True)\nconfig.read_string('[mysqld]\\nskip-bdb\\nuser = mysql')\ndict(config['mysqld'])", returns: "{'skip-bdb': None, 'user': 'mysql'}" },
    { title: 'Inline comments when enabled',    code: "import configparser\nconfig = configparser.ConfigParser(inline_comment_prefixes=(';',))\nconfig.read_string('[s]\\nport = 8080 ; dev only\\nurl = a;b')\ndict(config['s'])", returns: "{'port': '8080', 'url': 'a;b'}" },
    { title: 'set() only takes strings',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('s')\nconfig.set('s', 'port', 8080)", returns: 'TypeError: option values must be strings' },
    { title: 'Section names must be strings',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section(2026)", returns: 'TypeError: section names must be strings' },
    { title: 'converters= adds getters',        code: "import configparser\nconfig = configparser.ConfigParser(converters={'list': lambda v: [x.strip() for x in v.split(',')]})\nconfig.read_string('[app]\\nhosts = a.example, b.example')\nconfig['app'].getlist('hosts')", returns: "['a.example', 'b.example']" },
  ],

  pitfalls: [
    {
      name: 'Passing the interpolation class',
      desc: 'interpolation= needs an instance. The class itself is rejected when the parser is created.',
      wrong: { label: 'ExtendedInterpolation',   code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation)", output: "TypeError: interpolation= must be None or an instance of Interpolation; got an object of type <class 'type'>" },
      fix:   { label: 'ExtendedInterpolation()', code: "import configparser\nconfig = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())\nconfig.read_string('[a]\\nx = 1\\n[b]\\ny = ${a:x}')\nconfig['b']['y']", output: "'1'" },
    },
    {
      name: 'Old tutorials: SafeConfigParser',
      desc: 'SafeConfigParser was an alias of ConfigParser, deprecated since Python 3.2 and removed in 3.12 (as was readfp — use read_file).',
      wrong: { label: 'SafeConfigParser()', code: "import configparser\nconfig = configparser.SafeConfigParser()", output: "AttributeError: module 'configparser' has no attribute 'SafeConfigParser'. Did you mean: 'RawConfigParser'?" },
      fix:   { label: 'ConfigParser()',     code: "import configparser\nconfig = configparser.ConfigParser()\ntype(config).__name__", output: "'ConfigParser'" },
    },
    {
      name: 'None in defaults',
      desc: 'defaults= goes through set(), which accepts None only when allow_no_value=True.',
      wrong: { label: "defaults={'proxy': None}", code: "import configparser\nconfig = configparser.ConfigParser(defaults={'proxy': None})", output: 'TypeError: option values must be strings' },
      fix:   { label: 'allow_no_value=True',      code: "import configparser\nconfig = configparser.ConfigParser(defaults={'proxy': None}, allow_no_value=True)\nconfig.defaults()", output: "{'proxy': None}" },
    },
  ],

  when: {
    use: [
      'Any INI-style file: application settings, setup.cfg, tox.ini, my.cnf',
      'When values refer to each other (%(base)s/logs) — BasicInterpolation does it',
      'When code may store values: ConfigParser checks they are strings, so write() always works',
    ],
    avoid: [
      'You need non-str values stored as-is → RawConfigParser (legacy), or better a dict',
      'Typed or nested data → tomllib or json',
      'Preserving comments and layout on rewrite — not supported',
    ],
  },

  notes: {
    cpython:      'Lib/configparser.py — class ConfigParser(RawConfigParser) overrides only set(), add_section() (type checks) and _read_defaults(); _DEFAULT_INTERPOLATION = BasicInterpolation()',
    'Removed':    'SafeConfigParser and readfp() (3.12), LegacyInterpolation (3.13)',
    'Python 3.13': 'allow_unnamed_section=True; MultilineContinuationError for a bare key followed by an indented line (3.12 raised AttributeError there)',
    'Python 3.14': 'write() raises InvalidWriteError when a key could not be read back (a key containing a delimiter, or looking like a section header); add_section accepts UNNAMED_SECTION and its TypeError reads "section names must be strings or UNNAMED_SECTION"',
  },

  related: [
    { name: 'RawConfigParser', slug: 'rawconfigparser', when: 'Same API without interpolation or type checks' },
    { name: 'read_string / read_dict', slug: 'read',    when: 'Fill the parser' },
    { name: 'get / getint / getboolean', slug: 'get',   when: 'Read values with conversion' },
    { name: 'SectionProxy',    slug: 'sectionproxy',    when: 'config["section"]' },
    { name: 'BasicInterpolation', slug: 'basicinterpolation', when: 'The default %(name)s syntax' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the difference between ConfigParser and RawConfigParser?',
      a: 'ConfigParser uses BasicInterpolation by default and checks that section names, keys and values you set are strings. RawConfigParser has no interpolation and lets set() store any object, which then breaks write() and interpolation. The docs recommend ConfigParser, with interpolation=None if you do not want interpolation.',
    },
    {
      q: 'How do I allow inline comments in configparser?',
      a: "Pass inline_comment_prefixes=(';', '#') (or just one of them). The prefix must follow whitespace, so url = a;b keeps its value. Inline comments are off by default because there is no way to escape the prefix inside a value.",
    },
    {
      q: 'What happened to SafeConfigParser?',
      a: 'It was renamed ConfigParser in Python 3.2 and the old name was removed in Python 3.12, together with readfp() (use read_file()).',
    },
    {
      q: 'How do I read keys without values, like skip-bdb in my.cnf?',
      a: 'Create the parser with allow_no_value=True. Such keys get the value None, and write() writes them back without a delimiter.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser',
    meta:  'configparser.ConfigParser',
  },

};
