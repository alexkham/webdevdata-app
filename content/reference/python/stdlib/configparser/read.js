// content/reference/python/stdlib/configparser/read.js — read / read_file / read_string / read_dict

export const meta = {
  slug:        'read',
  name:        'ConfigParser.read',
  signature:   "config.read(filenames, encoding=None) · config.read_file(f, source=None) · config.read_string(string, source='<string>') · config.read_dict(dictionary, source='<dict>')",
  blurb:       'Load configuration into a parser from file names (missing files are skipped), an open file, a string, or a dict. Each call merges into what is already there; later values win.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'read_file / read_string / read_dict 3.2+',
  searchTerms: 'configparser read read_file read_string read_dict RawConfigParser.read RawConfigParser.read_file RawConfigParser.read_string RawConfigParser.read_dict read ini file python config read multiple files override encoding utf-8 missing file ignored readfp source parsingerror',
};

export const method = {
  slug:      'read',
  name:      'ConfigParser.read',
  signature: 'config.read(filenames, encoding=None)',
  returns:   { type: 'list[str] | None', desc: 'read: the names of the files that were opened and parsed. read_file / read_string / read_dict return None.' },

  category:    'ConfigParser method',
  version:     'read_file / read_string / read_dict 3.2+',
  hasLiveDemo: true,

  subtitle: 'All four feed the same parser state. read() takes a name or a list of names and silently skips any file it cannot open — handy for "defaults, then optional overrides". read_file() takes any iterable of lines, read_string() a str, read_dict() a mapping of mappings whose keys and values are converted with str(). source= only changes the name shown in error messages.',

  covers: ['RawConfigParser.read', 'RawConfigParser.read_file', 'RawConfigParser.read_string', 'RawConfigParser.read_dict'],

  cheat: {
    commonCall: "config.read(['defaults.ini', 'local.ini'], encoding='utf-8')",
    returns:    "['defaults.ini', 'local.ini'] — the files that existed",
    replaces:   'readfp() (removed in 3.12) and manual "if os.path.exists" checks',
    watchOut:   'a missing file is not an error — check the result',
  },

  parameters: [
    { name: 'filenames',  type: 'str | bytes | PathLike | iterable', required: true,  default: null,         desc: 'read: one file name or an iterable of names, read in order. Files that raise OSError on open are skipped.' },
    { name: 'encoding',   type: 'str | None',   required: false, default: 'None',        desc: 'read: text encoding. None means the locale encoding (machine-dependent) — pass "utf-8".' },
    { name: 'f',          type: 'iterable of str', required: true, default: null,        desc: 'read_file: a text file or any iterable yielding lines.' },
    { name: 'string',     type: 'str',          required: true,  default: null,          desc: 'read_string: the INI text.' },
    { name: 'dictionary', type: 'mapping',      required: true,  default: null,          desc: 'read_dict: {section: {key: value}}; keys and values go through str() (None values stay None).' },
    { name: 'source',     type: 'str',          required: false, default: "f.name / '<???>' / '<string>' / '<dict>'", desc: 'Name used in error messages.' },
  ],

  modes: [
    {
      id: 'files',
      label: 'read() with overrides',
      blurb: 'base.ini sets port and host. Type one line for local.ini; missing.ini does not exist.',
      params: [{ name: 'override', type: 'str', hint: 'a line for local.ini', input: 'text' }],
      template: "import configparser\nfrom pathlib import Path\nPath('base.ini').write_text('[server]\\nport = 80\\nhost = example.com\\n', encoding='utf-8')\nPath('local.ini').write_text('[server]\\n' + {$override} + '\\n', encoding='utf-8')\nconfig = configparser.ConfigParser()\nfound = config.read(['base.ini', 'missing.ini', 'local.ini'], encoding='utf-8')\n(found, dict(config['server']))",
      cases: [
        { id: 'port',  label: 'port = 8080',  values: { override: 'port = 8080' } },
        { id: 'new',   label: 'debug = yes',  values: { override: 'debug = yes' } },
        { id: 'blank', label: '(nothing)',    values: { override: '' } },
        { id: 'bad',   label: 'a broken line', values: { override: 'oops' } },
      ],
    },
    {
      id: 'string',
      label: 'read_string(source=)',
      blurb: 'source= names the text in error messages.',
      params: [
        { name: 'line1',  type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2',  type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3',  type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'source', type: 'str', hint: 'a name for the text', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}]), source={$source})\n{name: dict(config[name]) for name in config.sections()}",
      cases: [
        { id: 'ok',     label: 'valid',          values: { line1: '[app]', line2: 'name = demo', line3: 'debug = no', source: 'app.ini' } },
        { id: 'dup',    label: 'key twice',      values: { line1: '[app]', line2: 'name = demo', line3: 'Name = other', source: 'app.ini' } },
        { id: 'nohead', label: 'no header',      values: { line1: 'name = demo', line2: '', line3: '', source: 'https://example.com/app.ini' } },
      ],
    },
    {
      id: 'dict',
      label: 'read_dict()',
      blurb: 'Keys and values of the dict are converted with str(); keys are lowercased.',
      params: [
        { name: 'port',  type: 'int | str', hint: 'a value',   input: 'auto' },
        { name: 'key',   type: 'str',       hint: 'second key', input: 'text' },
        { name: 'value', type: 'int | str', hint: 'its value', input: 'auto' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'server': {'port': {$port}, {$key}: {$value}}})\ndict(config['server'])",
      cases: [
        { id: 'ints',  label: 'ints',            values: { port: '8080', key: 'workers', value: '4' } },
        { id: 'upper', label: 'Debug = yes',     values: { port: '8080', key: 'Debug', value: 'yes' } },
        { id: 'clash', label: 'PORT again',      values: { port: '8080', key: 'PORT', value: '9090' } },
        { id: 'pct',   label: 'a % value',       values: { port: '8080', key: 'load', value: '90%' } },
      ],
    },
  ],
  demoExplainer: "read() returns ['base.ini', 'local.ini'] — missing.ini is skipped without an error — and values from local.ini override base.ini while the rest is kept. A broken line in local.ini raises ParsingError naming 'local.ini' and line 2; everything before it, including base.ini, is already loaded. In read_string, source='app.ini' appears in the DuplicateOptionError text instead of '<string>'. read_dict converts the int 8080 to '8080' and lowercases Debug; 'port' and 'PORT' in the same dict collide (DuplicateOptionError: While reading from '<dict>' …), and a bare % fails the interpolation check with ValueError.",

  patterns: [
    {
      name: 'Defaults, then optional overrides',
      desc: 'Later files win; files that do not exist are skipped.',
      code: "import configparser, os\nconfig = configparser.ConfigParser()\nconfig.read_file(open('defaults.ini', encoding='utf-8'))  # must exist\nconfig.read(['/etc/app.ini', os.path.expanduser('~/.app.ini')], encoding='utf-8')",
    },
    {
      name: 'Fail when the file is missing',
      desc: 'read() never raises for a missing file; open it yourself to get FileNotFoundError.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nwith open('app.ini', encoding='utf-8') as f:\n    config.read_file(f)",
    },
    {
      name: 'Defaults from a dict, overrides from a file',
      desc: 'read_dict first, then read — the file values win.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'server': {'host': 'localhost', 'port': '8000'}})\nconfig.read('app.ini', encoding='utf-8')",
    },
    {
      name: 'Copy one parser into another',
      desc: 'A parser is a mapping of sections, so read_dict can copy it (values are interpolated on the way).',
      code: "import configparser\ncopy = configparser.ConfigParser()\ncopy.read_dict(config)",
    },
  ],

  examples: [
    { title: 'read() returns what it found', code: "import configparser\nfrom pathlib import Path\nPath('app.ini').write_text('[app]\\nname = demo\\n', encoding='utf-8')\nconfig = configparser.ConfigParser()\n(config.read(['app.ini', 'nope.ini'], encoding='utf-8'), config['app']['name'])", returns: "(['app.ini'], 'demo')" },
    { title: 'A single name works too',     code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('nope.ini', encoding='utf-8')", returns: '[]' },
    { title: 'read_file with an open file', code: "import configparser\nfrom pathlib import Path\nPath('app.ini').write_text('[app]\\nworkers = 4\\n', encoding='utf-8')\nconfig = configparser.ConfigParser()\nwith open('app.ini', encoding='utf-8') as f:\n    config.read_file(f)\nconfig.getint('app', 'workers')", returns: '4' },
    { title: 'read_file takes any lines',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_file(['[app]', 'name = demo'])\nconfig['app']['name']", returns: "'demo'" },
    { title: "Unnamed streams are '<???>'", code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.read_file(io.StringIO('[a]\\nx = 1\\nx = 2'))", returns: "configparser.DuplicateOptionError: While reading from '<???>' [line  3]: option 'x' in section 'a' already exists" },
    { title: 'read_dict converts with str()', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_dict({'s': {'n': 1, 'ratio': 2.5, 'on': True}})\ndict(config['s'])", returns: "{'n': '1', 'ratio': '2.5', 'on': 'True'}" },
    { title: 'Reading again merges',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[s]\\na = 1\\nb = 2')\nconfig.read_string('[s]\\nb = 3\\nc = 4')\ndict(config['s'])", returns: "{'a': '1', 'b': '3', 'c': '4'}" },
  ],

  pitfalls: [
    {
      name: 'Relying on the default encoding',
      desc: 'Without encoding=, read() decodes with the locale encoding, which differs between machines (a UTF-8 file can come out garbled or fail). Always pass encoding="utf-8".',
      wrong: { label: 'a non-UTF-8 encoding', code: "import configparser\nfrom pathlib import Path\nPath('app.ini').write_bytes('[app]\\nname = Zoë\\n'.encode('utf-8'))\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='latin-1')\nconfig['app']['name']", output: "'ZoÃ«'" },
      fix:   { label: "encoding='utf-8'",  code: "import configparser\nfrom pathlib import Path\nPath('app.ini').write_bytes('[app]\\nname = Zoë\\n'.encode('utf-8'))\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\nconfig['app']['name']", output: "'Zoë'" },
    },
    {
      name: 'Passing file content to read()',
      desc: 'read() expects file names. A str of INI text is treated as one (odd) file name, which does not exist, so nothing is read and nothing is raised.',
      wrong: { label: 'read(text)',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('[app]\\nname = demo')\nconfig.sections()", output: '[]' },
      fix:   { label: 'read_string(text)', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[app]\\nname = demo')\nconfig.sections()", output: "['app']" },
    },
    {
      name: 'readfp in old code',
      desc: 'readfp() was deprecated in 3.2 and removed in Python 3.12. read_file() is the same call.',
      wrong: { label: 'readfp(f)',   code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.readfp(io.StringIO('[a]'))", output: "AttributeError: 'ConfigParser' object has no attribute 'readfp'. Did you mean: 'read'?" },
      fix:   { label: 'read_file(f)', code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.read_file(io.StringIO('[a]'))\nconfig.sections()", output: "['a']" },
    },
  ],

  when: {
    use: [
      'read: config files on disk, especially a chain of optional locations',
      'read_file: a file you opened yourself (must exist), or any line source',
      'read_string: INI text from a database, an HTTP response, a test',
      'read_dict: defaults built in code, or copying another parser',
    ],
    avoid: [
      'Required files → read_file(open(...)), so a missing file raises',
      'Very large or untrusted inputs without limits — the whole file is parsed into memory',
    ],
  },

  notes: {
    cpython:      'read() opens each file with open(name, encoding=io.text_encoding(encoding)), catches OSError and calls _read(); read_string wraps the text in io.StringIO; read_dict calls add_section and set for every entry',
    'Errors':     'ParsingError is raised after the whole source was read (it lists every bad line); MissingSectionHeaderError, DuplicateSectionError and DuplicateOptionError stop at once. Lines read before the error stay in the parser',
    'strict':     'Duplicates are checked per source: the same section in two files merges, the same section twice in one file raises (with strict=True)',
  },

  related: [
    { name: 'write',         slug: 'write',          when: 'The reverse: save the parser' },
    { name: 'ParsingError',  slug: 'parsingerror', when: 'Lines that are neither header nor key' },
    { name: 'MissingSectionHeaderError', slug: 'missingsectionheadererror', when: 'Text without a [section] first' },
    { name: 'DuplicateOptionError', slug: 'duplicateoptionerror', when: 'A key twice in one source' },
    { name: 'open()',        slug: 'open',           when: 'Open a file for read_file', category: 'functions' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why does ConfigParser.read() not raise an error for a missing file?',
      a: 'By design: it accepts a list of possible locations and reads those that exist. It returns the list of files it parsed — check it, or open the file yourself and use read_file() when the file is required.',
    },
    {
      q: 'How do I read multiple config files with configparser?',
      a: "config.read(['base.ini', 'local.ini'], encoding='utf-8'). Files are read in order into the same parser; a key defined in a later file replaces the earlier value, everything else is kept.",
    },
    {
      q: 'What replaced readfp()?',
      a: 'read_file(f, source=None), added in Python 3.2. readfp() was removed in Python 3.12.',
    },
    {
      q: 'How do I parse an INI string?',
      a: "config.read_string(text). Pass source='name' to have that name in error messages instead of '<string>'.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.read',
    meta:  'ConfigParser.read',
  },

};
