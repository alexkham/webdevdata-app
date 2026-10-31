// content/reference/python/stdlib/configparser/sections.js — sections / has_section / add_section / remove_section / popitem

export const meta = {
  slug:        'sections',
  name:        'ConfigParser.sections',
  signature:   'config.sections() · config.has_section(section) · config.add_section(section) · config.remove_section(section) · config.popitem()',
  blurb:       'List, test, create and delete sections. The DEFAULT section is never listed, never "has", cannot be added and cannot be removed.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser sections has_section add_section remove_section popitem RawConfigParser.sections RawConfigParser.has_section RawConfigParser.add_section RawConfigParser.remove_section RawConfigParser.popitem list sections check section exists create section delete section python ini duplicatesectionerror invalid section name default',
};

export const method = {
  slug:      'sections',
  name:      'ConfigParser.sections',
  signature: 'config.sections()',
  returns:   { type: 'list[str]', desc: 'Section names in insertion order, without DEFAULT. has_section / remove_section return bool; popitem returns a (name, SectionProxy) tuple.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'Five small methods around the section list. sections() and has_section() ignore DEFAULT; add_section() raises DuplicateSectionError for an existing name and ValueError for the default section name; remove_section() returns whether anything was removed; popitem() removes and returns the first section.',

  covers: ['RawConfigParser.sections', 'RawConfigParser.has_section', 'RawConfigParser.add_section', 'RawConfigParser.remove_section', 'RawConfigParser.popitem'],

  cheat: {
    commonCall: "if not config.has_section('cache'):\n    config.add_section('cache')",
    returns:    'None; config.sections() now lists cache',
    replaces:   "'cache' in config (which is also True for DEFAULT)",
    watchOut:   'section names are case-sensitive',
  },

  parameters: [
    { name: 'section', type: 'str', required: true, default: null, desc: 'Section name, compared exactly (no case folding, no stripping). ConfigParser.add_section requires a str.' },
  ],

  modes: [
    {
      id: 'list',
      label: 'sections() / has_section()',
      blurb: 'Read a few lines, then list the sections and test one name.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'name',  type: 'str', hint: 'section to test', input: 'text' },
      ],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}]))\n(config.sections(), config.has_section({$name}), {$name} in config)",
      cases: [
        { id: 'basic',   label: 'web',         values: { line1: '[DEFAULT]', line2: '[web]', line3: '[db]', name: 'web' } },
        { id: 'default', label: 'DEFAULT',     values: { line1: '[DEFAULT]', line2: '[web]', line3: '[db]', name: 'DEFAULT' } },
        { id: 'case',    label: 'Web',         values: { line1: '[DEFAULT]', line2: '[web]', line3: '[db]', name: 'Web' } },
        { id: 'spaces',  label: '[ spaced ]',  values: { line1: '[ spaced ]', line2: '', line3: '', name: 'spaced' } },
      ],
    },
    {
      id: 'add',
      label: 'add_section()',
      blurb: 'Add a section to a parser that has [web] and [db].',
      params: [{ name: 'name', type: 'str', hint: 'new section name', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[web]\\n[db]')\nconfig.add_section({$name})\nconfig.sections()",
      cases: [
        { id: 'new',     label: 'cache',   values: { name: 'cache' } },
        { id: 'dup',     label: 'db',      values: { name: 'db' } },
        { id: 'default', label: 'DEFAULT', values: { name: 'DEFAULT' } },
        { id: 'DB',      label: 'DB',      values: { name: 'DB' } },
      ],
    },
    {
      id: 'remove',
      label: 'remove_section() / popitem()',
      blurb: 'Remove one section by name, then pop the first remaining one.',
      params: [{ name: 'name', type: 'str', hint: 'section to remove', input: 'text' }],
      template: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nx = 1\\n[web]\\n[db]\\n[cache]')\nremoved = config.remove_section({$name})\nfirst = config.popitem()\n(removed, first, config.sections())",
      cases: [
        { id: 'web',     label: 'web',     values: { name: 'web' } },
        { id: 'db',      label: 'db',      values: { name: 'db' } },
        { id: 'none',    label: 'nope',    values: { name: 'nope' } },
        { id: 'default', label: 'DEFAULT', values: { name: 'DEFAULT' } },
      ],
    },
  ],
  demoExplainer: "sections() leaves DEFAULT out and has_section('DEFAULT') is False, yet 'DEFAULT' in config is True — the mapping protocol counts the default section. Names are exact: Web is not web, and [ spaced ] creates a section whose name keeps its spaces (' spaced '). add_section('db') raises DuplicateSectionError: Section 'db' already exists, add_section('DEFAULT') raises ValueError: Invalid section name: 'DEFAULT', while DB is a new section. remove_section returns False for a missing name (including DEFAULT) instead of raising, and popitem() returns the first remaining section as (name, proxy).",

  patterns: [
    {
      name: 'Create a section only if needed',
      desc: 'add_section raises for an existing name, so check first (or use dict syntax).',
      code: "if not config.has_section('cache'):\n    config.add_section('cache')\nconfig.set('cache', 'ttl', '300')",
    },
    {
      name: 'Dict syntax creates or replaces',
      desc: 'config[name] = {...} creates the section — or clears and refills an existing one.',
      code: "config['cache'] = {'ttl': '300', 'backend': 'redis'}",
    },
    {
      name: 'Every section with its values',
      desc: 'sections() plus the proxy — DEFAULT values appear in each.',
      code: "for name in config.sections():\n    print(name, dict(config[name]))",
    },
    {
      name: 'Drop sections matching a rule',
      desc: 'Iterate over a copy of the list while removing.',
      code: "for name in list(config.sections()):\n    if name.startswith('tmp-'):\n        config.remove_section(name)",
    },
  ],

  examples: [
    { title: 'Insertion order, no DEFAULT',  code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\n[web]\\n[api]\\n[db]')\nconfig.sections()", returns: "['web', 'api', 'db']" },
    { title: 'has_section vs in',            code: "import configparser\nconfig = configparser.ConfigParser()\n(config.has_section('DEFAULT'), 'DEFAULT' in config)", returns: '(False, True)' },
    { title: 'add_section, then set',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('cache')\nconfig.set('cache', 'ttl', '300')\ndict(config['cache'])", returns: "{'ttl': '300'}" },
    { title: 'Adding an existing section',   code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('db')\nconfig.add_section('db')", returns: "configparser.DuplicateSectionError: Section 'db' already exists" },
    { title: 'DEFAULT cannot be added',      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.add_section('DEFAULT')", returns: "ValueError: Invalid section name: 'DEFAULT'" },
    { title: 'remove_section returns a bool', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[web]')\n(config.remove_section('web'), config.remove_section('web'))", returns: '(True, False)' },
    { title: 'popitem() until empty',        code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[a]\\n[b]')\n(config.popitem(), config.popitem())", returns: "(('a', <Section: a>), ('b', <Section: b>))" },
    { title: 'popitem() never returns DEFAULT', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.popitem()", returns: 'KeyError' },
  ],

  pitfalls: [
    {
      name: 'Testing with in for "has this section"',
      desc: "'DEFAULT' in config is always True. Use has_section() when DEFAULT should not count.",
      wrong: { label: "'DEFAULT' in config",          code: "import configparser\nconfig = configparser.ConfigParser()\n'DEFAULT' in config", output: 'True' },
      fix:   { label: "config.has_section('DEFAULT')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.has_section('DEFAULT')", output: 'False' },
    },
    {
      name: 'Deleting DEFAULT',
      desc: 'remove_section quietly returns False; del config["DEFAULT"] raises. To empty the defaults, clear its proxy.',
      wrong: { label: "del config['DEFAULT']", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nx = 1')\ndel config['DEFAULT']", output: 'ValueError: Cannot remove the default section.' },
      fix:   { label: "config['DEFAULT'].clear()", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[DEFAULT]\\nx = 1')\nconfig['DEFAULT'].clear()\nconfig.defaults()", output: '{}' },
    },
  ],

  when: {
    use: [
      'Iterating over the sections of a file',
      'Building a config in code: add_section, then set',
      'Removing obsolete sections before write()',
    ],
    avoid: [
      'Checking for DEFAULT values → defaults() or has_option(DEFAULTSECT, key)',
      'Creating and filling at once → config[name] = {...}',
    ],
  },

  notes: {
    cpython:      'sections() returns list(self._sections); DEFAULT lives separately in self._defaults, which is why it is never listed',
    'add_section': 'RawConfigParser.add_section accepts any hashable name; ConfigParser.add_section raises TypeError: section names must be strings',
    'popitem':    'Inherited behaviour of MutableMapping.popitem, overridden so DEFAULT is never returned; config.clear() calls it until KeyError, so DEFAULT survives clear()',
  },

  related: [
    { name: 'options / has_option', slug: 'options', when: 'Keys inside a section' },
    { name: 'DuplicateSectionError', slug: 'duplicatesectionerror', when: 'add_section on an existing name' },
    { name: 'DEFAULTSECT', slug: 'defaultsect', when: 'Why DEFAULT is special' },
    { name: 'SectionProxy', slug: 'sectionproxy', when: 'What config[name] returns' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I list all sections in a configparser file?',
      a: "config.sections() returns the names in file order, without DEFAULT. list(config) or config.keys() include DEFAULT as the first item.",
    },
    {
      q: 'How do I check whether a section exists?',
      a: "config.has_section('name'). 'name' in config works too, except that it is also True for the default section.",
    },
    {
      q: 'Why does add_section raise DuplicateSectionError?',
      a: "The section already exists (names are case-sensitive, so 'DB' and 'db' differ). Check with has_section() first, or use config['name'] = {...}, which creates or replaces the section.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.sections',
    meta:  'ConfigParser.sections',
  },

};
