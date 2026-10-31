// content/reference/python/stdlib/configparser/sectcre.js — SECTCRE, OPTCRE, OPTCRE_NV, NONSPACECRE

export const meta = {
  slug:        'sectcre',
  name:        'ConfigParser.SECTCRE',
  signature:   'ConfigParser.SECTCRE · ConfigParser.OPTCRE · ConfigParser.OPTCRE_NV · ConfigParser.NONSPACECRE',
  blurb:       'The compiled regular expressions the parser uses: SECTCRE recognizes [section] headers, OPTCRE and OPTCRE_NV split key = value lines, NONSPACECRE measures indentation. SECTCRE is the one meant to be overridden.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'configparser SECTCRE OPTCRE OPTCRE_NV NONSPACECRE RawConfigParser.SECTCRE RawConfigParser.OPTCRE RawConfigParser.OPTCRE_NV RawConfigParser.NONSPACECRE section header regex strip spaces in section names custom section syntax option regex python ini regular expression',
};

export const method = {
  slug:      'sectcre',
  name:      'ConfigParser.SECTCRE',
  signature: 'config.SECTCRE = re.compile(pattern)',
  returns:   { type: 're.Pattern', desc: 'SECTCRE must define a group named header; the parser uses match(line).group("header") as the section name.' },

  category:    'ConfigParser attribute',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'The default SECTCRE is \\[(?P<header>.+)\\] — "very permissive", so spaces inside the brackets become part of the name. Assign your own compiled pattern to an instance (or subclass) to change that. OPTCRE (and OPTCRE_NV when allow_no_value=True) is read only once, in __init__, from the delimiters; the docs advise against overriding it.',

  covers: ['RawConfigParser.SECTCRE', 'RawConfigParser.OPTCRE', 'RawConfigParser.OPTCRE_NV', 'RawConfigParser.NONSPACECRE'],

  cheat: {
    commonCall: "config.SECTCRE = re.compile(r'\\[ *(?P<header>[^]]+?) *\\]')",
    returns:    "[  Section 2  ] is read as 'Section 2'",
    replaces:   'post-processing section names',
    watchOut:   'the pattern needs a group named header',
  },

  parameters: [],

  attributes: [
    { name: 'SECTCRE',     type: 're.Pattern', meaning: 'Section header pattern, matched against the comment-stripped line: \\[(?P<header>.+)\\] in verbose mode. Text after the last ] is ignored.' },
    { name: 'OPTCRE',      type: 're.Pattern', meaning: 'Key/value pattern for the default delimiters: groups option, vi (the delimiter) and value. The option part is lazy, so the first delimiter splits.' },
    { name: 'OPTCRE_NV',   type: 're.Pattern', meaning: 'Like OPTCRE, but the delimiter and value are optional (allow_no_value=True); vi and value are None for a bare key.' },
    { name: 'NONSPACECRE', type: 're.Pattern', meaning: '\\S — search() finds the first non-whitespace character; its position is the indentation used to detect continuation lines.' },
  ],

  modes: [
    {
      id: 'sectcre',
      label: 'custom SECTCRE',
      blurb: 'The documented example: strip spaces around section names. Both parsers read your lines.',
      params: [
        { name: 'line1', type: 'str', hint: 'INI line 1', input: 'text' },
        { name: 'line2', type: 'str', hint: 'INI line 2', input: 'text' },
        { name: 'line3', type: 'str', hint: 'INI line 3', input: 'text' },
      ],
      template: "import configparser, re\ntext = '\\n'.join([{$line1}, {$line2}, {$line3}])\ndefault = configparser.ConfigParser()\ncustom = configparser.ConfigParser()\ncustom.SECTCRE = re.compile(r\"\\[ *(?P<header>[^]]+?) *\\]\")\ndefault.read_string(text)\ncustom.read_string(text)\n(default.sections(), custom.sections())",
      cases: [
        { id: 'spaces', label: 'spaces',         values: { line1: '[Section 1]', line2: '[  Section 2  ]', line3: 'another = val' } },
        { id: 'trail',  label: 'text after ]',   values: { line1: '[web] production', line2: 'port = 80', line3: '' } },
        { id: 'nested', label: '[a]b]',          values: { line1: '[a]b]', line2: '', line3: '' } },
        { id: 'empty',  label: '[]',             values: { line1: '[]', line2: 'k = v', line3: '' } },
      ],
    },
    {
      id: 'optcre',
      label: 'OPTCRE vs OPTCRE_NV',
      blurb: 'How one (already stripped) line is split into option, delimiter and value.',
      params: [{ name: 'line', type: 'str', hint: 'a key = value line', input: 'text' }],
      template: "import configparser\nline = {$line}\nm1 = configparser.ConfigParser.OPTCRE.match(line)\nm2 = configparser.ConfigParser.OPTCRE_NV.match(line)\n(m1 and m1.group('option', 'vi', 'value'), m2.group('option', 'vi', 'value'))",
      cases: [
        { id: 'basic', label: 'key = value',    values: { line: 'key = value' } },
        { id: 'url',   label: 'url = http://x', values: { line: 'url = http://example.com:8080' } },
        { id: 'colon', label: 'a : b = c',      values: { line: 'a : b = c' } },
        { id: 'bare',  label: 'skip-bdb',       values: { line: 'skip-bdb' } },
        { id: 'empty', label: 'key =',          values: { line: 'key =' } },
      ],
    },
  ],
  demoExplainer: "With the default SECTCRE, [  Section 2  ] is a section called '  Section 2  ' (spaces included); the custom pattern trims them. Both patterns only have to match at the start of the line, so [web] production is the section web. The default .+ is greedy, so [a]b] becomes the section a]b, while the custom [^]]+? stops at the first ] and gives a. [] is not a header for either pattern (they need at least one character between the brackets), so the line is treated as a key before any section and the read fails with MissingSectionHeaderError. In OPTCRE the option group is lazy: the first = or : splits the line, so the URL keeps its colons and a : b = c gives the key a. A bare key does not match OPTCRE at all (None) but matches OPTCRE_NV with vi and value None.",

  patterns: [
    {
      name: 'Trim spaces in section names',
      desc: 'The example from the docs.',
      code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.SECTCRE = re.compile(r'\\[ *(?P<header>[^]]+?) *\\]')",
    },
    {
      name: 'A different header syntax',
      desc: 'Any pattern with a header group works, e.g. <section> instead of [section].',
      code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.SECTCRE = re.compile(r'<(?P<header>[^>]+)>')\nconfig.read_string('<db>\\nhost = x')",
    },
    {
      name: 'Other delimiters: use the constructor',
      desc: 'Instead of a custom OPTCRE, pass delimiters= (and allow_no_value=) — the parser builds the pattern.',
      code: "import configparser\nconfig = configparser.ConfigParser(delimiters=('=',), allow_no_value=True)",
    },
  ],

  examples: [
    { title: 'Spaces are part of the name by default', code: "import configparser\nconfig = configparser.ConfigParser()\nconfig.read_string('[  Section 2  ]\\nk = v')\nconfig.sections()", returns: "['  Section 2  ']" },
    { title: 'A custom SECTCRE trims them',     code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.SECTCRE = re.compile(r'\\[ *(?P<header>[^]]+?) *\\]')\nconfig.read_string('[  Section 2  ]\\nk = v')\nconfig.sections()", returns: "['Section 2']" },
    { title: 'SECTCRE matches only the start',  code: "import configparser\nconfigparser.ConfigParser.SECTCRE.match('[web] production').group('header')", returns: "'web'" },
    { title: 'OPTCRE groups',                   code: "import configparser\nconfigparser.ConfigParser.OPTCRE.match('url = http://x:80').group('option', 'vi', 'value')", returns: "('url', '=', 'http://x:80')" },
    { title: 'OPTCRE_NV for bare keys',         code: "import configparser\nconfigparser.ConfigParser.OPTCRE_NV.match('skip-bdb').group('option', 'vi', 'value')", returns: "('skip-bdb', None, None)" },
    { title: 'NONSPACECRE measures indentation', code: "import configparser\nconfigparser.ConfigParser.NONSPACECRE.search('    continued').start()", returns: '4' },
    { title: 'One pattern object for both classes', code: 'import configparser\nconfigparser.ConfigParser.SECTCRE is configparser.RawConfigParser.SECTCRE', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Assigning OPTCRE on an instance',
      desc: 'The option pattern is copied in __init__ (into a private attribute), so a later assignment has no effect. Use delimiters= / allow_no_value=, or a subclass with a class attribute.',
      wrong: { label: 'config.OPTCRE = …', code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.OPTCRE = re.compile(r'(?P<option>\\S+)\\s+(?P<vi>)(?P<value>.*)$')\nconfig.read_string('[s]\\nkey value')", output: "configparser.ParsingError: Source contains parsing errors: '<string>'\n\t[line  2]: 'key value'" },
      fix:   { label: 'a subclass attribute', code: "import configparser, re\nclass SpaceParser(configparser.ConfigParser):\n    OPTCRE = re.compile(r'(?P<option>\\S+)\\s+(?P<vi>)(?P<value>.*)$')\nconfig = SpaceParser()\nconfig.read_string('[s]\\nkey value')\nconfig['s']['key']", output: "'value'" },
    },
    {
      name: 'A SECTCRE without a header group',
      desc: 'The parser calls mo.group("header"); a pattern without that group fails on the first header.',
      wrong: { label: "r'\\[(.+)\\]'", code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.SECTCRE = re.compile(r'\\[(.+)\\]')\nconfig.read_string('[s]')", output: 'IndexError: no such group' },
      fix:   { label: "r'\\[(?P<header>.+)\\]'", code: "import configparser, re\nconfig = configparser.ConfigParser()\nconfig.SECTCRE = re.compile(r'\\[(?P<header>.+)\\]')\nconfig.read_string('[s]')\nconfig.sections()", output: "['s']" },
    },
  ],

  when: {
    use: [
      'Normalizing section names (trim spaces) or supporting a different header syntax',
      'Understanding exactly how a line is split — match OPTCRE yourself',
    ],
    avoid: [
      'Changing delimiters by editing OPTCRE → delimiters=(...) in the constructor',
      'Case-insensitive section names — SECTCRE cannot fold case; normalize the names after reading',
    ],
  },

  notes: {
    cpython:      'SECTCRE = re.compile(r"\\[(?P<header>.+)\\]", re.VERBOSE); OPTCRE and OPTCRE_NV are built from _OPT_TMPL / _OPT_NV_TMPL with delim="=|:"; NONSPACECRE = re.compile(r"\\S")',
    'When used':  'SECTCRE is looked up on every header line (self.SECTCRE), so an instance assignment works; the option pattern is chosen once in __init__ (self._optcre), from OPTCRE / OPTCRE_NV for the default delimiters or compiled from the given delimiters',
    'Clean line': 'Both patterns are applied to the line after whole-line and inline comments are removed and whitespace is stripped',
  },

  related: [
    { name: 'ConfigParser',  slug: 'configparser', when: 'delimiters= and allow_no_value= build OPTCRE for you' },
    { name: 'optionxform',   slug: 'optionxform',  when: 'Normalize key names instead' },
    { name: 'ParsingError',  slug: 'parsingerror', when: 'Lines OPTCRE does not match' },
    { name: 're module',     slug: 're',           when: 'Writing the pattern', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I strip spaces from section names in configparser?',
      a: "Assign a custom header pattern before reading: config.SECTCRE = re.compile(r'\\[ *(?P<header>[^]]+?) *\\]'). This is the example the docs give; [  Section 2  ] is then read as 'Section 2'.",
    },
    {
      q: 'Can I change how configparser splits keys and values?',
      a: 'Use the constructor: delimiters=("=",) or any other substrings, and allow_no_value=True for bare keys. The docs advise against overriding OPTCRE because it interferes with those options — and an instance assignment after construction is ignored.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/configparser.html#configparser.ConfigParser.SECTCRE',
    meta:  'ConfigParser.SECTCRE',
  },

};
