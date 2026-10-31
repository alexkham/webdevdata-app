// content/reference/python/stdlib/configparser/write.js — write

export const meta = {
  slug:        'write',
  name:        'ConfigParser.write',
  signature:   'config.write(fileobject, space_around_delimiters=True)',
  blurb:       'Serialize the parser as INI text into a file opened in text mode: DEFAULT first, then every section, "key = value" lines and a blank line after each section. Comments are not preserved.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions (InvalidWriteError 3.14+)',
  searchTerms: 'configparser write RawConfigParser.write save ini file write config file python space_around_delimiters comments lost write to string io.StringIO update ini file key = value invalidwriteerror',
};

export const method = {
  slug:      'write',
  name:      'ConfigParser.write',
  signature: 'config.write(fileobject, space_around_delimiters=True)',
  returns:   { type: 'None', desc: 'Text is written to fileobject with its write() method; nothing is returned.' },

  category:    'ConfigParser method',
  version:     'All Python 3 versions (InvalidWriteError 3.14+)',
  hasLiveDemo: true,

  subtitle: 'The output is regenerated from the parser state, not copied from the file you read: comments vanish, keys appear as optionxform made them (lowercase), values are written raw (no interpolation), continuation lines of multi-line values are indented with a tab, and valueless keys are written bare when allow_no_value=True. The delimiter is the first of delimiters=, surrounded by spaces unless space_around_delimiters=False.',

  covers: ['RawConfigParser.write'],

  cheat: {
    commonCall: "with open('app.ini', 'w', encoding='utf-8') as f:\n    config.write(f)",
    returns:    'None; the file holds the INI text',
    replaces:   'building INI text by hand',
    watchOut:   'comments from the original file are lost',
  },

  parameters: [
    { name: 'fileobject',               type: 'text file', required: true,  default: null,   desc: 'Anything with a write(str) method: open(path, "w", encoding="utf-8"), io.StringIO, sys.stdout.' },
    { name: 'space_around_delimiters',  type: 'bool',      required: false, default: 'True', desc: 'True writes "key = value", False writes "key=value".' },
  ],

  modes: [
    {
      id: 'write',
      label: 'read, then write',
      blurb: 'Read your lines, write them back. Compare what comes out with what went in.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
        { name: 'line4', type: 'str', hint: 'INI line 4', input: 'text' },
        { name: 'line5', type: 'str', hint: 'INI line 5', input: 'text' },
      ],
      template: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.read_string('\\n'.join([{$line1}, {$line2}, {$line3}, {$line4}, {$line5}]))\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue().splitlines()",
      cases: [
        { id: 'comments', label: 'comments, case',  values: { line1: '# production settings', line2: '[Server]', line3: 'Host: example.com', line4: 'PORT=8080', line5: '; end' } },
        { id: 'default',  label: 'DEFAULT order',   values: { line1: '[web]', line2: 'port = 80', line3: '[DEFAULT]', line4: 'debug = no', line5: '' } },
        { id: 'multi',    label: 'multi-line value', values: { line1: '[app]', line2: 'hosts = a.example', line3: '    b.example', line4: '', line5: '    c.example' } },
        { id: 'interp',   label: 'stays raw',       values: { line1: '[paths]', line2: 'base = /srv', line3: 'logs = %(base)s/logs', line4: 'gain = 100%%', line5: '' } },
      ],
    },
    {
      id: 'compact',
      label: 'space_around_delimiters',
      blurb: 'The same section written with and without spaces around "=".',
      params: [
        { name: 'key',   type: 'str', hint: 'a key',   input: 'text' },
        { name: 'value', type: 'str', hint: 'a value', input: 'text' },
      ],
      template: "import configparser, io\nconfig = configparser.ConfigParser(interpolation=None)\nconfig['s'] = {{$key}: {$value}}\nspaced, compact = io.StringIO(), io.StringIO()\nconfig.write(spaced)\nconfig.write(compact, space_around_delimiters=False)\n(spaced.getvalue(), compact.getvalue())",
      cases: [
        { id: 'plain', label: 'name = demo',  values: { key: 'name', value: 'demo' } },
        { id: 'empty', label: 'empty value',  values: { key: 'password', value: '' } },
        { id: 'eq',    label: 'key with =',   values: { key: 'a=b', value: 'c' } },
      ],
    },
  ],
  demoExplainer: "Both comments disappear, [Server] keeps its case (section names are not transformed) while Host and PORT become host and port, and every delimiter is rewritten as \" = \". DEFAULT is always written first, whatever its position in the input, and each section is followed by an empty line. A multi-line value comes back with tab-indented continuation lines — the blank line inside it becomes a line holding just a tab. Values are written raw: %(base)s and %% stay as typed. In space_around_delimiters, a key containing = is written as-is (a=b = c), which reads back as the key a; Python 3.14 raises InvalidWriteError for such keys instead.",

  patterns: [
    {
      name: 'Update a value in a file',
      desc: 'Read, change, write back. Comments in the file will not survive.',
      code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read('app.ini', encoding='utf-8')\nconfig['server']['port'] = '9090'\nwith open('app.ini', 'w', encoding='utf-8') as f:\n    config.write(f)",
    },
    {
      name: 'INI text as a string',
      desc: 'Write into io.StringIO and take getvalue().',
      code: "import io\nbuf = io.StringIO()\nconfig.write(buf)\ntext = buf.getvalue()",
    },
    {
      name: 'Write safely',
      desc: 'Write to a temporary file, then replace the original in one step.',
      code: "import os\nwith open('app.ini.tmp', 'w', encoding='utf-8') as f:\n    config.write(f)\nos.replace('app.ini.tmp', 'app.ini')",
    },
  ],

  examples: [
    { title: 'The exact output',               code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig['server'] = {'host': 'example.com', 'port': '8080'}\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[server]\\nhost = example.com\\nport = 8080\\n\\n'" },
    { title: 'Write to a file',                code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['db'] = {'user': 'app'}\nwith open('app.ini', 'w', encoding='utf-8') as f:\n    config.write(f)\nwith open('app.ini', encoding='utf-8') as f:\n    lines = f.read().splitlines()\nlines", returns: "['[db]', 'user = app', '']" },
    { title: 'No spaces around =',             code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig['s'] = {'a': '1'}\nbuf = io.StringIO()\nconfig.write(buf, space_around_delimiters=False)\nbuf.getvalue()", returns: "'[s]\\na=1\\n\\n'" },
    { title: 'The first delimiter is used',    code: "import configparser, io\nconfig = configparser.ConfigParser(delimiters=(':', '='))\nconfig['s'] = {'a': '1'}\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[s]\\na : 1\\n\\n'" },
    { title: 'Valueless keys stay bare',       code: "import configparser, io\nconfig = configparser.ConfigParser(allow_no_value=True)\nconfig.read_string('[mysqld]\\nskip-bdb\\nuser = mysql')\nbuf = io.StringIO()\nconfig.write(buf)\nbuf.getvalue()", returns: "'[mysqld]\\nskip-bdb\\nuser = mysql\\n\\n'" },
    { title: 'An empty parser writes nothing', code: "import configparser, io\nbuf = io.StringIO()\nconfigparser.ConfigParser().write(buf)\nbuf.getvalue()", returns: "''" },
    { title: 'print the file to the console',  code: "import configparser, sys\nconfig = configparser.ConfigParser()\nconfig['web'] = {'port': '80'}\nconfig.write(sys.stdout)", returns: '[web]\nport = 80' },
  ],

  pitfalls: [
    {
      name: 'A file opened in binary mode',
      desc: 'write() writes str. Open the file in text mode ("w") with an encoding.',
      wrong: { label: "open(path, 'wb')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['s'] = {'a': '1'}\nwith open('app.ini', 'wb') as f:\n    config.write(f)", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: "open(path, 'w', encoding='utf-8')", code: "import configparser\nconfig = configparser.ConfigParser()\nconfig['s'] = {'a': '1'}\nwith open('app.ini', 'w', encoding='utf-8') as f:\n    config.write(f)\nconfig.sections()", output: "['s']" },
    },
    {
      name: 'Expecting comments to survive',
      desc: 'Comments are dropped while reading, so a read-modify-write cycle removes them. Keep documentation elsewhere or edit the text directly.',
      wrong: { label: 'read + write', code: "import configparser, io\nconfig = configparser.ConfigParser()\nconfig.read_string('# keep me\\n[s]\\na = 1  \\n')\nbuf = io.StringIO()\nconfig.write(buf)\n'# keep me' in buf.getvalue()", output: 'False' },
      fix:   { label: 'edit the text', code: "text = '# keep me\\n[s]\\na = 1\\n'\ntext = text.replace('a = 1', 'a = 2')\ntext.splitlines()", output: "['# keep me', '[s]', 'a = 2']" },
    },
  ],

  when: {
    use: [
      'Saving settings a program changed',
      'Generating INI files from code or from read_dict()',
    ],
    avoid: [
      'Files whose comments and layout must be kept → edit the text, or use a round-trip library',
      'Writing TOML → a TOML writer such as Tomli-W',
    ],
  },

  notes: {
    cpython:      'write(): DEFAULT (if not empty), then UNNAMED_SECTION without a header, then every section via _write_section — "[name]", then key + delimiter + str(value).replace("\\n", "\\n\\t"), then an empty line',
    'Raw values': 'interpolation.before_write is called, but all built-in interpolations return the value unchanged, so %(name)s is written as stored',
    'Python 3.13 patches': 'Later 3.13 releases also turn \\r\\n and \\r inside values into "\\n\\t" continuation lines (3.13.3 converts only \\n)',
    'Python 3.14': 'InvalidWriteError for keys containing a delimiter or starting like a section header, which could not be read back',
  },

  related: [
    { name: 'read / read_string', slug: 'read',     when: 'The reverse' },
    { name: 'set',                slug: 'set',      when: 'Change values before writing' },
    { name: 'optionxform',        slug: 'optionxform', when: 'Keep key case in the output' },
    { name: 'UNNAMED_SECTION',    slug: 'unnamed_section', when: 'Keys written before the first header' },
    { name: 'open()',             slug: 'open',     when: 'Open the target file in "w" mode', category: 'functions' },
    { name: 'configparser module', slug: 'configparser', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I save a ConfigParser to a file?',
      a: "with open('app.ini', 'w', encoding='utf-8') as f: config.write(f). For a string, write into io.StringIO() and call getvalue().",
    },
    {
      q: 'Why are my comments gone after config.write()?',
      a: 'configparser strips comments while reading and keeps only sections, keys and values, so write() has nothing to write back. The docs state that comments are not preserved.',
    },
    {
      q: 'Why are my keys lowercase in the written file?',
      a: 'Keys were lowercased by optionxform() when they were read or set. Set config.optionxform = str before reading to keep their case; section names keep their case anyway.',
    },
    {
      q: 'How do I write "key=value" without spaces?',
      a: 'config.write(f, space_around_delimiters=False).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.write',
    meta:  'ConfigParser.write',
  },

};
