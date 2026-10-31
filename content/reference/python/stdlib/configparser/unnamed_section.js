// content/reference/python/stdlib/configparser/unnamed_section.js — UNNAMED_SECTION

export const meta = {
  slug:        'unnamed_section',
  name:        'configparser.UNNAMED_SECTION',
  signature:   'configparser.UNNAMED_SECTION · ConfigParser(allow_unnamed_section=True)',
  blurb:       'The special object that names the keys written before the first [section] header, when the parser is created with allow_unnamed_section=True (Python 3.13+).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.13+',
  searchTerms: 'configparser UNNAMED_SECTION allow_unnamed_section unnamed section top level keys without section header ini file no section python 3.13 key value file without sections file contains no section headers',
};

export const method = {
  slug:      'unnamed_section',
  name:      'configparser.UNNAMED_SECTION',
  signature: 'config[configparser.UNNAMED_SECTION][key]',
  returns:   { type: '_UnnamedSection', desc: 'A sentinel object (repr <UNNAMED_SECTION>) used as the section name; not a str.' },

  category:    'configparser constant',
  version:     'Python 3.13+',
  hasLiveDemo: true,

  subtitle: 'Without the option, keys before the first header raise MissingSectionHeaderError. With allow_unnamed_section=True they go into a section whose name is this object: look them up with config[configparser.UNNAMED_SECTION] or config.get(configparser.UNNAMED_SECTION, key). write() writes them first, without a header.',

  covers: ['UNNAMED_SECTION'],

  cheat: {
    commonCall: "config = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo')\nconfig.get(configparser.UNNAMED_SECTION, 'name')",
    returns:    "'demo'",
    replaces:   "prepending '[top]\\n' to the text before reading",
    watchOut:   'it is an object, not the string "UNNAMED_SECTION"',
  },

  parameters: [],

  modes: [
    {
      id: 'read',
      label: 'top-level keys',
      blurb: 'Lines before the first header land in the unnamed section.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'INI line 4', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}]))\n(config.sections(), dict(config[configparser.UNNAMED_SECTION]))",
      cases: [
        { id: 'top',     label: 'keys, then [db]', values: { line1: 'name = demo', line2: 'debug = no', line3: '[db]', line4: 'host = x' } },
        { id: 'only',    label: 'no headers',      values: { line1: 'PATH = /usr/bin', line2: 'LANG = C.UTF-8', line3: '', line4: '' } },
        { id: 'header',  label: 'header first',    values: { line1: '[db]', line2: 'host = x', line3: '', line4: '' } },
      ],
    },
    {
      id: 'write',
      label: 'write()',
      blurb: 'The unnamed section is written first, without a [header].',
      params: [
        { name: 'key',   type: 'str', hint: 'a top-level key', input: 'text' },
        { name: 'value', type: 'str', hint: 'its value',       input: 'text' },
      ],
      template: "import configparser, io\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string({$key} + ' = ' + {$value} + '\\n[db]\\nhost = x')\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue().splitlines()",
      cases: [
        { id: 'name', label: 'name = demo', values: { key: 'name', value: 'demo' } },
        { id: 'url',  label: 'url = …',     values: { key: 'url', value: 'https://example.com' } },
      ],
    },
  ],
  demoExplainer: "The keys before [db] are in the unnamed section, which sections() lists as <UNNAMED_SECTION> (the sentinel's repr) before the named ones. A file with no headers at all — like an env file — is read entirely into it. If the text starts with a header, Python 3.13 still creates the unnamed section, empty, because it is opened before the first non-blank line is examined. write() emits the unnamed keys first, followed by the usual blank line, then the named sections.",

  patterns: [
    {
      name: 'Read a header-less key = value file',
      desc: 'Python 3.13+: no need to fake a section header.',
      code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True, interpolation=None)\nconfig.read('settings.env', encoding='utf-8')\nsettings = dict(config[configparser.UNNAMED_SECTION])",
    },
    {
      name: 'Before Python 3.13',
      desc: 'Prepend a header yourself and read the result.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nwith open('settings.env', encoding='utf-8') as f:\n    config.read_string('[top]\\n' + f.read())\nsettings = dict(config['top'])",
    },
  ],

  examples: [
    { title: 'Its repr',                       code: 'import configparser\nconfigparser.UNNAMED_SECTION', returns: '<UNNAMED_SECTION>' },
    { title: 'Read top-level keys',            code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo\\n[db]\\nhost = x')\nconfig.get(configparser.UNNAMED_SECTION, 'name')", returns: "'demo'" },
    { title: 'It shows up in sections()',      code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo\\n[db]')\nconfig.sections()", returns: "[<UNNAMED_SECTION>, 'db']" },
    { title: 'Its proxy',                      code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo')\nconfig[configparser.UNNAMED_SECTION]", returns: '<Section: <UNNAMED_SECTION>>' },
    { title: 'Written without a header',       code: "import configparser, io\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo\\n[db]\\nhost = x')\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'name = demo\\n\\n[db]\\nhost = x\\n\\n'" },
    { title: 'Without the option',             code: "import configparser\nconfigparser.ConfigParser().read_string('name = demo')", returns: "configparser.MissingSectionHeaderError: File contains no section headers.\nfile: '<string>', line: 1\n'name = demo'" },
  ],

  pitfalls: [
    {
      name: 'Using a string as the section name',
      desc: 'The unnamed section is keyed by the sentinel object; no string reaches it.',
      wrong: { label: "config['UNNAMED_SECTION']", code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo')\nconfig['UNNAMED_SECTION']['name']", output: "KeyError: 'UNNAMED_SECTION'" },
      fix:   { label: 'config[configparser.UNNAMED_SECTION]', code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('name = demo')\nconfig[configparser.UNNAMED_SECTION]['name']", output: "'demo'" },
    },
    {
      name: 'add_section(UNNAMED_SECTION) on a ConfigParser',
      desc: 'In Python 3.13 ConfigParser.add_section accepts only strings, so the sentinel is refused; let reading create the section. (Python 3.14 adds explicit support for UNNAMED_SECTION in the API.)',
      wrong: { label: 'add_section(UNNAMED_SECTION)', code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.add_section(configparser.UNNAMED_SECTION)", output: 'TypeError: section names must be strings' },
      fix:   { label: 'read it',                       code: "import configparser\nconfig = configparser.ConfigParser(allow_unnamed_section=True)\nconfig.read_string('version = 1')\nconfig.has_section(configparser.UNNAMED_SECTION)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Files with top-level key = value lines before (or instead of) sections, on Python 3.13+',
      'Simple settings files without any headers',
    ],
    avoid: [
      'Code that must run on 3.12 or older → prepend a "[top]" header yourself',
      'Shell-style .env files with quoting and export → a dedicated parser',
    ],
  },

  notes: {
    cpython:      'class _UnnamedSection with __repr__ returning "<UNNAMED_SECTION>"; UNNAMED_SECTION = _UnnamedSection(). _handle_rest opens it for the first non-blank line when allow_unnamed_section is true and no section is open yet',
    'Python 3.13': 'Added together with the allow_unnamed_section parameter (gh-66449)',
    'Python 3.14': 'UnnamedSectionDisabledError is raised when UNNAMED_SECTION is used with a parser that does not allow it; the docs mark UNNAMED_SECTION support as changed in 3.14',
  },

  related: [
    { name: 'MissingSectionHeaderError', slug: 'missingsectionheadererror', when: 'What you get without the option' },
    { name: 'ConfigParser', slug: 'configparser', when: 'The allow_unnamed_section argument' },
    { name: 'DEFAULTSECT',  slug: 'defaultsect',  when: 'The other special section' },
    { name: 'write',        slug: 'write',        when: 'How it is written back' },
    { name: 'os.environ',   slug: 'environ',      when: 'Settings from environment variables instead of a file', category: 'stdlib/os' },
  ],

  faq: [
    {
      q: 'How do I read an INI file without section headers in Python?',
      a: "On Python 3.13+: ConfigParser(allow_unnamed_section=True), then read the file and use config[configparser.UNNAMED_SECTION]. On older versions read the text yourself and pass '[top]\\n' + text to read_string().",
    },
    {
      q: 'What is configparser.UNNAMED_SECTION?',
      a: 'A sentinel object, new in Python 3.13, that serves as the name of the section holding keys found before the first header. Its repr is <UNNAMED_SECTION>; it is not a string.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.UNNAMED_SECTION',
    meta:  'configparser.UNNAMED_SECTION',
  },

};
