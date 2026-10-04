// content/reference/python/stdlib/csv/register_dialect.js

export const meta = {
  slug:        'register_dialect',
  name:        'csv.register_dialect',
  signature:   'csv.register_dialect(name, dialect=None, **fmtparams)',
  blurb:       'Give a dialect a name so readers and writers can use dialect="name" — with get_dialect, list_dialects and unregister_dialect to look up, list and remove names.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv register_dialect get_dialect list_dialects unregister_dialect dialect registry named dialect python csv.register_dialect csv.get_dialect csv.list_dialects csv.unregister_dialect unknown dialect',
};

export const method = {
  slug:      'register_dialect',
  name:      'csv.register_dialect',
  signature: 'csv.register_dialect(name, dialect=None, **fmtparams)',
  returns:   { type: 'None', desc: 'register_dialect and unregister_dialect return None; get_dialect returns a _csv.Dialect; list_dialects a list of names.' },

  category:    'csv function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'A module-wide dict from names to validated dialects. register_dialect adds or replaces a name, get_dialect looks one up, list_dialects lists them in registration order, unregister_dialect removes one.',

  covers: ['register_dialect', 'get_dialect', 'list_dialects', 'unregister_dialect'],

  cheat: {
    commonCall: "csv.register_dialect('pipes', delimiter='|')",
    returns:    "None — then csv.reader(f, dialect='pipes')",
    replaces:   'passing the same keyword arguments everywhere',
    watchOut:   'the registry is global to the process; an unknown name is csv.Error',
  },

  parameters: [
    { name: 'name',      type: 'str',               required: true,  default: null,   desc: 'The name to register (must be a str).' },
    { name: 'dialect',   type: 'str | Dialect',     required: false, default: 'None', desc: 'A Dialect class/instance or another registered name to start from; None starts from the excel defaults.' },
    { name: 'fmtparams', type: 'keyword arguments', required: false, default: null,   desc: 'delimiter=, quotechar=, quoting= … applied on top. Validated immediately.' },
  ],

  modes: [
    {
      id: 'register',
      label: 'register',
      blurb: 'Register a name with a delimiter, list the names, read the delimiter back — then unregister it again.',
      params: [
        { name: 'name',      type: 'str', hint: 'dialect name',  input: 'text' },
        { name: 'delimiter', type: 'str', hint: 'one character', input: 'text' },
      ],
      template: "import csv\ncsv.register_dialect({$name}, delimiter={$delimiter})\ntry:\n    result = (csv.list_dialects(), csv.get_dialect({$name}).delimiter)\nfinally:\n    csv.unregister_dialect({$name})\nresult",
      cases: [
        { id: 'pipes', label: 'pipes',            values: { name: 'pipes', delimiter: '|' } },
        { id: 'semi',  label: 'semicolons',       values: { name: 'semi', delimiter: ';' } },
        { id: 'bad',   label: 'invalid delimiter', values: { name: 'broken', delimiter: '' } },
      ],
    },
    {
      id: 'lookup',
      label: 'get_dialect',
      blurb: "Look up a name: 'excel', 'excel-tab', 'unix', or one that does not exist.",
      params: [{ name: 'name', type: 'str', hint: 'dialect name', input: 'text' }],
      template: "import csv\nd = csv.get_dialect({$name})\n(d.delimiter, d.lineterminator, d.quoting)",
      cases: [
        { id: 'excel', label: 'excel',     values: { name: 'excel' } },
        { id: 'tab',   label: 'excel-tab', values: { name: 'excel-tab' } },
        { id: 'unix',  label: 'unix',      values: { name: 'unix' } },
        { id: 'none',  label: 'unknown',   values: { name: 'tsv' } },
      ],
    },
  ],
  demoExplainer: 'New names are added after the three built-in ones (registration order). The settings are validated when you register, so an empty delimiter fails right there with TypeError: "delimiter" must be a 1-character string — and nothing is registered. get_dialect returns the validated _csv.Dialect; an unknown name raises csv.Error: unknown dialect (shown as _csv.Error).',

  patterns: [
    {
      name: 'Register once, use by name',
      desc: 'Typically at import time of your module.',
      code: "import csv\ncsv.register_dialect('pipes', delimiter='|', quoting=csv.QUOTE_MINIMAL)\n\nwith open('data.psv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f, dialect='pipes'))",
    },
    {
      name: 'Register a dialect class',
      desc: 'Pass a csv.Dialect subclass as the second argument.',
      code: "import csv\n\nclass Pipes(csv.excel):\n    delimiter = '|'\n\ncsv.register_dialect('pipes', Pipes)",
    },
    {
      name: 'Register only if missing',
      desc: 'list_dialects() returns the current names.',
      code: "import csv\nif 'pipes' not in csv.list_dialects():\n    csv.register_dialect('pipes', delimiter='|')",
    },
  ],

  examples: [
    { title: 'The built-in names',      code: 'import csv\ncsv.list_dialects()', returns: "['excel', 'excel-tab', 'unix']" },
    { title: 'Register and use',        code: "import csv\ncsv.register_dialect('pipes', delimiter='|')\ntry:\n    row = next(csv.reader(['a|b'], dialect='pipes'))\nfinally:\n    csv.unregister_dialect('pipes')\nrow", returns: "['a', 'b']" },
    { title: 'Start from another dialect', code: "import csv\ncsv.register_dialect('tabq', 'excel-tab', quoting=csv.QUOTE_ALL)\ntry:\n    d = csv.get_dialect('tabq')\n    info = (d.delimiter, d.quoting)\nfinally:\n    csv.unregister_dialect('tabq')\ninfo", returns: "('\\t', 1)" },
    { title: 'get_dialect returns _csv.Dialect', code: "import csv\ntype(csv.get_dialect('excel'))", returns: "<class '_csv.Dialect'>" },
    { title: 'Unknown names',           code: "import csv\ncsv.get_dialect('tsv')", returns: '_csv.Error: unknown dialect' },
    { title: 'Unregister an unknown name', code: "import csv\ncsv.unregister_dialect('tsv')", returns: '_csv.Error: unknown dialect' },
    { title: 'Names must be strings',   code: "import csv\ncsv.register_dialect(1, delimiter=';')", returns: 'TypeError: dialect name must be a string' },
  ],

  pitfalls: [
    {
      name: 'Changing the class after registering',
      desc: 'register_dialect validates and copies the settings into a _csv.Dialect at that moment; later changes to the class are not seen.',
      wrong: { label: 'edit the class', code: "import csv\nclass Pipes(csv.excel):\n    delimiter = '|'\ncsv.register_dialect('pipes', Pipes)\ntry:\n    Pipes.delimiter = ';'\n    d = csv.get_dialect('pipes').delimiter\nfinally:\n    csv.unregister_dialect('pipes')\nd", output: "'|'" },
      fix:   { label: 'register again', code: "import csv\nclass Pipes(csv.excel):\n    delimiter = '|'\ncsv.register_dialect('pipes', Pipes)\ntry:\n    Pipes.delimiter = ';'\n    csv.register_dialect('pipes', Pipes)\n    d = csv.get_dialect('pipes').delimiter\nfinally:\n    csv.unregister_dialect('pipes')\nd", output: "';'" },
    },
    {
      name: 'Misspelling a name',
      desc: "The error only says unknown dialect — compare with list_dialects(). The tab dialect is 'excel-tab' with a hyphen.",
      wrong: { label: "'excel_tab'", code: "import csv\ncsv.reader([], dialect='excel_tab')", output: '_csv.Error: unknown dialect' },
      fix:   { label: "'excel-tab'", code: "import csv\ncsv.reader([], dialect='excel-tab').dialect.delimiter", output: "'\\t'" },
    },
  ],

  when: {
    use: [
      'A custom format used across a code base by name',
      'Configuration that names a format as a string',
    ],
    avoid: [
      'Library code: the registry is global — pass a Dialect class instead of registering names others might clash with',
    ],
  },

  notes: {
    cpython:      'Modules/_csv.c — the registry is a dict in the module state (also visible as _csv._dialects); register_dialect stores _csv.Dialect(dialect, **fmtparams); list_dialects returns list(dict.keys())',
    'Errors':     'get_dialect / unregister_dialect: csv.Error("unknown dialect"); register_dialect with a non-str name: TypeError',
    'Overwriting': 'Registering an existing name replaces it silently — even excel',
  },

  related: [
    { name: 'csv.Dialect', slug: 'dialect', when: 'What a dialect contains' },
    { name: 'excel, excel_tab, unix_dialect', slug: 'excel', when: 'The three registered at import' },
    { name: 'csv.Error',   slug: 'error',   when: 'Raised for unknown names' },
    { name: 'csv module',  slug: 'csv',     when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I see which CSV dialects are available?',
      a: "csv.list_dialects() — ['excel', 'excel-tab', 'unix'] plus any names registered in the running program.",
    },
    {
      q: 'What does "_csv.Error: unknown dialect" mean?',
      a: "A dialect= string (or get_dialect / unregister_dialect argument) is not registered. Check the spelling against csv.list_dialects(); the tab dialect is 'excel-tab'.",
    },
    {
      q: 'Do I need register_dialect to use a custom dialect?',
      a: 'No — pass the Dialect class directly as dialect=MyDialect. Registering only adds a string name for it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.register_dialect',
    meta:  'csv.register_dialect',
  },

};
