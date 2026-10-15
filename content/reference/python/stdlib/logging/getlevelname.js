// content/reference/python/stdlib/logging/getlevelname.js

export const meta = {
  slug:        'getlevelname',
  name:        'logging.getLevelName',
  signature:   'logging.getLevelName(level)  ·  logging.getLevelNamesMapping()',
  blurb:       'Translate between level numbers and level names — getLevelName works in both directions; getLevelNamesMapping (3.11+) returns the whole name → number table.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+ (getLevelNamesMapping 3.11+)',
  searchTerms: 'logging getLevelName getLevelNamesMapping python level name to number level number to name convert string to log level Level 25 levelname mapping dict',
};

export const method = {
  slug:      'getlevelname',
  name:      'logging.getLevelName',
  signature: 'logging.getLevelName(level)  ·  logging.getLevelNamesMapping()',
  returns:   { type: 'str | int', desc: "getLevelName: the name of a level number, the number of a level name, or the str 'Level %s' % level when neither is known. getLevelNamesMapping: a new dict of name → number." },

  category:    'logging function',
  version:     'Python 2.3+ (getLevelNamesMapping 3.11+)',
  hasLiveDemo: true,

  subtitle: "getLevelName(20) is 'INFO' and getLevelName('INFO') is 20 — but an unknown value never raises: getLevelName('info') quietly returns the str 'Level info'. To turn configuration text into a level, look it up in getLevelNamesMapping() (3.11+), which returns a fresh copy of the name table.",

  covers: ['getLevelName', 'getLevelNamesMapping'],

  cheat: {
    commonCall: 'logging.getLevelName(logging.WARNING)',
    returns:    "'WARNING' (and getLevelName('WARNING') → 30)",
    replaces:   'hand-written {10: "DEBUG", …} tables',
    watchOut:   "unknown input returns 'Level …' instead of raising",
  },

  parameters: [
    { name: 'level', type: 'int | str', required: true, default: null, desc: 'A level number (returns its name) or a registered name (returns its number). Anything else returns the str "Level %s" % level.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'getLevelName',
      blurb: 'A number gives a name, a name gives a number, anything else gives "Level …".',
      params: [{ name: 'value', type: 'int | str', hint: "20, 'INFO', 25 …", input: 'auto' }],
      template: 'import logging\nlogging.getLevelName({$value})',
      cases: [
        { id: 'num',    label: '20',       values: { value: '20' } },
        { id: 'name',   label: "'ERROR'",  values: { value: 'ERROR' } },
        { id: 'custom', label: '25',       values: { value: '25' } },
        { id: 'lower',  label: "'error'",  values: { value: 'error' } },
        { id: 'alias',  label: "'WARN'",   values: { value: 'WARN' } },
        { id: 'zero',   label: '0',        values: { value: '0' } },
      ],
    },
    {
      id: 'mapping',
      label: 'getLevelNamesMapping',
      blurb: 'Look a name up in the mapping, with a default for unknown names.',
      params: [{ name: 'name', type: 'str', hint: 'a level name', input: 'text' }],
      template: "import logging\nlevels = logging.getLevelNamesMapping()\nlevels.get({$name}.upper(), 'unknown level')",
      cases: [
        { id: 'debug',  label: "'debug'",   values: { name: 'debug' } },
        { id: 'fatal',  label: "'Fatal'",   values: { name: 'Fatal' } },
        { id: 'trace',  label: "'trace'",   values: { name: 'trace' } },
        { id: 'notset', label: "'notset'",  values: { name: 'notset' } },
      ],
    },
  ],
  demoExplainer: "The lookup goes number → name first, then name → number, then gives up with 'Level %s' % value — so 'error' (lowercase) is not an error but the string 'Level error'. 'WARN' is registered as a name and maps to 30, though 30 itself maps back to 'WARNING'. In the mapping tab the input is upper-cased first, the usual way to accept 'debug' from a config file; FATAL is in the table (50), TRACE is not.",

  patterns: [
    {
      name: 'Parse a level from configuration text',
      desc: 'Validate instead of silently getting "Level …" back.',
      code: "import logging\nname = config['log_level'].upper()\ntry:\n    level = logging.getLevelNamesMapping()[name]\nexcept KeyError:\n    raise SystemExit(f'unknown log level: {name}')",
    },
    {
      name: 'Choices for a command-line option',
      desc: 'The mapping keys are every name setLevel accepts.',
      code: "import argparse, logging\nparser = argparse.ArgumentParser()\nparser.add_argument('--log-level', choices=list(logging.getLevelNamesMapping()), default='WARNING')",
    },
  ],

  examples: [
    { title: 'Number → name',             code: 'import logging\nlogging.getLevelName(logging.WARNING)', returns: "'WARNING'" },
    { title: 'Name → number',             code: "import logging\nlogging.getLevelName('DEBUG')", returns: '10' },
    { title: 'Unknown number',            code: 'import logging\nlogging.getLevelName(25)', returns: "'Level 25'" },
    { title: 'The whole table',           code: 'import logging\nlogging.getLevelNamesMapping()', returns: "{'CRITICAL': 50, 'FATAL': 50, 'ERROR': 40, 'WARN': 30, 'WARNING': 30, 'INFO': 20, 'DEBUG': 10, 'NOTSET': 0}" },
    { title: 'It is a copy',              code: "import logging\nlevels = logging.getLevelNamesMapping()\nlevels['TRACE'] = 5\n'TRACE' in logging.getLevelNamesMapping()", returns: 'False' },
    { title: 'A float that equals a level', code: 'import logging\nlogging.getLevelName(40.0)', returns: "'ERROR'" },
  ],

  pitfalls: [
    {
      name: 'Converting configuration text with getLevelName',
      desc: "For an unknown or lowercase name getLevelName returns a str like 'Level info', not an int — and the error surfaces later, far from its cause. Use the mapping, which raises KeyError (or lets you pick a default).",
      wrong: { label: 'getLevelName', code: "import logging\nlevel = logging.getLevelName('info')\n(type(level).__name__, level)", output: "('str', 'Level info')" },
      fix:   { label: 'mapping',      code: "import logging\nlogging.getLevelNamesMapping()['info'.upper()]", output: '20' },
    },
    {
      name: 'Adding a level by editing the mapping',
      desc: 'getLevelNamesMapping returns a copy; changing it registers nothing. addLevelName is the registration call (the fix restores the private tables afterwards only because these snippets share one interpreter).',
      wrong: { label: 'edit the copy', code: "import logging\nlogging.getLevelNamesMapping()['TRACE'] = 5\nlogging.getLevelName(5)", output: "'Level 5'" },
      fix:   { label: 'addLevelName',  code: "import logging\nsaved = dict(logging._levelToName), dict(logging._nameToLevel)\ntry:\n    logging.addLevelName(5, 'TRACE')\n    result = logging.getLevelName(5)\nfinally:\n    logging._levelToName.clear(); logging._levelToName.update(saved[0])\n    logging._nameToLevel.clear(); logging._nameToLevel.update(saved[1])\nresult", output: "'TRACE'" },
    },
  ],

  when: {
    use: [
      'Showing a level number as text (reports, UI, debugging)',
      'getLevelNamesMapping: validating level names from config files or CLI options',
    ],
    avoid: [
      "Parsing user input with getLevelName → it never fails, it returns 'Level …'",
      'Passing names to setLevel yourself → setLevel already accepts the names',
    ],
  },

  notes: {
    cpython:   "getLevelName: _levelToName.get(level), then _nameToLevel.get(level), then 'Level %s' % level; getLevelNamesMapping: _nameToLevel.copy()",
    'History': 'The name → number direction was undocumented behaviour that 3.4 removed and 3.4.2 reinstated for backward compatibility (see docs). getLevelNamesMapping was added in 3.11.',
    'Dict lookup': "Lookups use dict semantics, so 40.0 finds the same entry as 40",
  },

  related: [
    { name: 'logging levels', slug: 'levels', when: 'The constants themselves' },
    { name: 'logging.addLevelName', slug: 'addlevelname', when: 'Register a new name' },
    { name: 'Logger.setLevel', slug: 'logger-setlevel', when: 'Accepts names directly' },
    { name: 'LogRecord', slug: 'logrecord', when: 'record.levelname is getLevelName(levelno)' },
  ],

  faq: [
    {
      q: 'How do I convert a string like "INFO" to a logging level?',
      a: "Use logging.getLevelNamesMapping()['INFO'] (Python 3.11+), which raises KeyError for unknown names. Most APIs — setLevel, basicConfig(level=…), handler.setLevel — also accept the name string directly.",
    },
    {
      q: 'Why does getLevelName return "Level 25"?',
      a: "25 is not a registered level, so getLevelName falls back to 'Level %s' % level. Register a name with logging.addLevelName(25, 'NOTICE') if you use such a level.",
    },
    {
      q: 'Is getLevelName deprecated?',
      a: 'No, it is a normal, documented function. Only its name → number direction had a wobble: Python 3.4 removed it and 3.4.2 put it back for backward compatibility. For name → number lookups, getLevelNamesMapping (3.11+) is the clearer tool.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.getLevelName',
    meta:  'logging.getLevelName',
  },

};
