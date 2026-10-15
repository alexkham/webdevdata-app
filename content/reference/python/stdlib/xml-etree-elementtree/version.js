// content/reference/python/stdlib/xml-etree-elementtree/version.js — VERSION

export const meta = {
  slug:        'version',
  name:        'xml.etree.ElementTree.VERSION',
  signature:   'xml.etree.ElementTree.VERSION',
  blurb:       'The version string of the ElementTree API bundled with Python: "1.3.0". It describes the library\'s feature level, not your Python version.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'ElementTree 1.3 since Python 3.2',
  searchTerms: 'xml.etree.ElementTree.VERSION ET.VERSION elementtree version 1.3.0 which elementtree version python lxml compatibility feature check',
};

export const method = {
  slug:      'version',
  name:      'xml.etree.ElementTree.VERSION',
  signature: 'xml.etree.ElementTree.VERSION',
  returns:   { type: 'str', desc: '"1.3.0" in current Python 3 releases.' },

  category:    'xml.etree.ElementTree constant',
  version:     'ElementTree 1.3 since Python 3.2',
  hasLiveDemo: false,

  subtitle: 'VERSION is a plain string in the module (and in its __all__). Python 3.2 updated the bundled ElementTree to version 1.3, and Python 3.13 still reports "1.3.0" — features added in later Python releases (indent(), canonicalize(), XMLPullParser.flush()...) did not change it, so check the Python version or use hasattr() for those.',

  covers: ['VERSION'],

  cheat: {
    commonCall: 'ET.VERSION',
    returns:    "'1.3.0'",
    replaces:   'guessing which ElementTree API generation you have',
    watchOut:   'Not bumped for new features — test sys.version_info or hasattr() instead',
  },

  parameters: [],

  patterns: [
    {
      name: 'Feature checks that work',
      desc: 'Newer functions are detected by name, not by VERSION.',
      code: "import xml.etree.ElementTree as ET\nif hasattr(ET, 'indent'):\n    ET.indent(root)",
    },
    {
      name: 'Checking the Python version instead',
      desc: 'For features documented as "Added in version 3.x".',
      code: "import sys\nHAS_FLUSH = sys.version_info >= (3, 13)",
    },
  ],

  examples: [
    { title: 'The value and its type', code: "import xml.etree.ElementTree as ET\n(ET.VERSION, type(ET.VERSION).__name__)", returns: "('1.3.0', 'str')" },
    { title: 'Part of the public API', code: "import xml.etree.ElementTree as ET\n'VERSION' in ET.__all__", returns: 'True' },
    { title: 'As a tuple of ints', code: "import xml.etree.ElementTree as ET\ntuple(int(p) for p in ET.VERSION.split('.'))", returns: '(1, 3, 0)' },
    { title: 'Not the Python version', code: "import sys\nimport xml.etree.ElementTree as ET\nET.VERSION == '%d.%d.%d' % sys.version_info[:3]", returns: 'False' },
    { title: 'It lives on ElementTree, not on xml.etree', code: "import xml.etree\nimport xml.etree.ElementTree as ET\nhasattr(xml.etree, 'VERSION')", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Comparing version strings as strings',
      desc: 'String comparison goes character by character; "1.10.0" would sort before "1.3.0". Compare tuples of ints.',
      wrong: { label: "VERSION >= '1.10'", code: "import xml.etree.ElementTree as ET\nET.VERSION >= '1.10'", output: 'True' },
      fix:   { label: 'tuple of ints', code: "import xml.etree.ElementTree as ET\ntuple(int(p) for p in ET.VERSION.split('.')) >= (1, 10)", output: 'False' },
    },
    {
      name: 'Looking for __version__',
      desc: 'Many packages use __version__; this module only has VERSION.',
      wrong: { label: 'ET.__version__', code: "import xml.etree.ElementTree as ET\nET.__version__", output: "AttributeError: module 'xml.etree.ElementTree' has no attribute '__version__'" },
      fix:   { label: 'ET.VERSION', code: "import xml.etree.ElementTree as ET\nET.VERSION", output: "'1.3.0'" },
    },
  ],

  when: {
    use: [
      'Logging diagnostic information about the XML stack',
      'Code shared with old ElementTree releases that checks for the 1.3 API',
    ],
    avoid: [
      'Feature detection for anything added after Python 3.2 → hasattr() or sys.version_info',
    ],
  },

  notes: {
    cpython:   'VERSION = "1.3.0" at the top of Lib/xml/etree/ElementTree.py (same value in 3.12 and 3.13)',
    'History': 'What\'s New in Python 3.2 records the update of the bundled ElementTree (and cElementTree) to version 1.3. Later additions — iterparse comment/pi events, canonicalize() (3.8), indent() (3.9), XMLPullParser.flush() (3.13) — kept "1.3.0"',
    'Docs':    'The library reference does not describe VERSION; it is listed in the module\'s __all__',
  },

  related: [
    { name: 'xml.etree.ElementTree', slug: 'index',  when: 'The module overview' },
    { name: 'indent',                slug: 'indent', when: 'A 3.9 addition that VERSION does not reflect' },
    { name: 'hasattr()',             slug: 'hasattr', when: 'Feature detection by name', category: 'functions' },
  ],

  faq: [
    {
      q: 'Which ElementTree version does Python use?',
      a: 'ET.VERSION is "1.3.0": Python 3.2 updated the bundled library to ElementTree 1.3. Newer features arrived with Python releases without changing this string.',
    },
    {
      q: 'How do I check whether ET.indent() is available?',
      a: "Use hasattr(ET, 'indent') (or sys.version_info >= (3, 9)). VERSION is '1.3.0' with or without it.",
    },
    {
      q: 'Is there an ET.__version__?',
      a: 'No — the module has no __version__ attribute (accessing it raises AttributeError). The version string is ET.VERSION.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html',
    meta:  'xml.etree.ElementTree — The ElementTree XML API',
  },
};
