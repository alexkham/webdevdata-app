// content/reference/python/stdlib/xml-etree-elementtree/dump.js — dump

export const meta = {
  slug:        'dump',
  name:        'xml.etree.ElementTree.dump',
  signature:   'xml.etree.ElementTree.dump(elem)',
  blurb:       'Print an element (or a whole ElementTree) as XML to standard output — a debugging helper, the quickest way to see what a tree looks like.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.dump ET.dump dump print xml element python print elementtree debug show xml tree stdout print element as string',
};

export const method = {
  slug:      'dump',
  name:      'xml.etree.ElementTree.dump',
  signature: 'xml.etree.ElementTree.dump(elem)',
  returns:   { type: 'None', desc: 'Writes to sys.stdout and returns None.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'dump() writes the element with ElementTree.write(sys.stdout, encoding="unicode") and adds a newline unless the element\'s tail already ends with one. The docs call it a debugging function whose exact output format is implementation dependent — use tostring() or write() for real output.',

  covers: ['dump'],

  cheat: {
    commonCall: 'ET.dump(root)',
    returns:    'None — the XML goes to standard output',
    replaces:   'print(ET.tostring(root, encoding="unicode"))',
    watchOut:   'Debugging only: it returns nothing, and its format is not guaranteed',
  },

  parameters: [
    { name: 'elem', type: 'Element | ElementTree', required: true, default: null, desc: 'What to print. XML text is not accepted — parse it first.' },
  ],

  modes: [
    {
      id: 'dump',
      label: 'dump()',
      blurb: 'Parse your XML and dump the root. The demo captures standard output with contextlib.redirect_stdout so you can see exactly what was printed, newline included.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import contextlib, io\nimport xml.etree.ElementTree as ET\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    ET.dump(ET.fromstring({$xml}))\nbuf.getvalue()',
      cases: [
        { id: 'plain', label: 'plain',          values: { xml: '<user id="7"><name>Ada</name><email/></user>' } },
        { id: 'ns',    label: 'namespaces',     values: { xml: '<x:doc xmlns:x="urn:x"><x:p>é</x:p></x:doc>' } },
        { id: 'space', label: 'whitespace',     values: { xml: '<a>\n  <b/>\n</a>' } },
      ],
    },
    {
      id: 'pretty',
      label: 'indent() + dump()',
      blurb: 'Pretty-print first, then dump: the usual way to eyeball a tree while debugging.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import contextlib, io\nimport xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\nET.indent(root)\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    ET.dump(root)\nbuf.getvalue()',
      cases: [
        { id: 'nested', label: 'nested', values: { xml: '<config><db><host>localhost</host><port>5432</port></db></config>' } },
        { id: 'flat',   label: 'flat',   values: { xml: '<list><i>1</i><i>2</i></list>' } },
      ],
    },
  ],
  demoExplainer: 'dump() writes text (encoding="unicode"), so é stays é instead of becoming a character reference as in tostring()\'s default bytes. Namespace prefixes are re-generated (ns0) just as in tostring(). The final \\n is added by dump() itself because the root has no tail. Whitespace in the parsed text is printed exactly as it was.',

  patterns: [
    {
      name: 'Look at a tree while debugging',
      desc: 'indent() first for readable output.',
      code: 'import xml.etree.ElementTree as ET\nET.indent(root)\nET.dump(root)',
    },
    {
      name: 'The same as a string',
      desc: 'For logging or tests, use tostring() and keep the value.',
      code: "import xml.etree.ElementTree as ET\nlogger.debug('tree: %s', ET.tostring(root, encoding='unicode'))",
    },
  ],

  examples: [
    { title: 'Printing an element', code: "import xml.etree.ElementTree as ET\nET.dump(ET.fromstring('<a x=\"1\"><b>t</b></a>'))", returns: '<a x="1"><b>t</b></a>' },
    { title: 'It returns None', code: "import xml.etree.ElementTree as ET\nprint(ET.dump(ET.Element('a')))", returns: '<a />\nNone' },
    { title: 'An ElementTree works too', code: "import xml.etree.ElementTree as ET\ntree = ET.ElementTree(ET.fromstring('<a>é</a>'))\nET.dump(tree)", returns: '<a>é</a>' },
    { title: 'Pretty output with indent()', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/></a>')\nET.indent(root)\nET.dump(root)", returns: '<a>\n  <b />\n</a>' },
    { title: 'Capturing what dump() prints', code: "import contextlib, io\nimport xml.etree.ElementTree as ET\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    ET.dump(ET.fromstring('<a><b/></a>'))\nbuf.getvalue()", returns: "'<a><b /></a>\\n'" },
    { title: 'A tail ending in a newline replaces the extra one', code: "import xml.etree.ElementTree as ET\ne = ET.Element('a')\ne.tail = 'tail\\n'\nET.dump(e)\nprint('next line')", returns: '<a />tail\nnext line' },
  ],

  pitfalls: [
    {
      name: 'Passing XML text',
      desc: 'dump() serializes elements; a str is not one.',
      wrong: { label: "dump('<a/>')", code: "import xml.etree.ElementTree as ET\nET.dump('<a/>')", output: "AttributeError: 'str' object has no attribute 'iter'" },
      fix:   { label: 'parse first', code: "import xml.etree.ElementTree as ET\nET.dump(ET.fromstring('<a/>'))", output: '<a />' },
    },
    {
      name: 'Using dump() to produce output',
      desc: 'dump() returns None, so its result cannot be stored or written to a file.',
      wrong: { label: 'xml = dump(root)', code: "import xml.etree.ElementTree as ET\nxml = ET.dump(ET.Element('a'))\nxml is None", output: '<a />\nTrue' },
      fix:   { label: 'tostring()', code: "import xml.etree.ElementTree as ET\nxml = ET.tostring(ET.Element('a'), encoding='unicode')\nxml", output: "'<a />'" },
    },
  ],

  when: {
    use: [
      'Quick looks at a tree in the REPL or while debugging',
    ],
    avoid: [
      'Program output, files, logs or tests → tostring() or ElementTree.write()',
      'Output whose exact format matters — the docs call the format implementation dependent',
    ],
  },

  notes: {
    cpython:     'dump(elem) wraps an Element in ElementTree(elem), calls write(sys.stdout, encoding="unicode") and then writes "\\n" unless the root\'s tail ends with a newline',
    'Order':     'Since 3.8 dump() keeps the attribute order of the element (it used to sort attributes)',
  },

  related: [
    { name: 'tostring', slug: 'tostring', when: 'The XML as a str or bytes value' },
    { name: 'indent',   slug: 'indent',   when: 'Pretty-print before dumping' },
    { name: 'ElementTree.write', slug: 'elementtree-write', when: 'What dump() calls' },
    { name: 'print()',  slug: 'print',    when: 'Where the output goes: sys.stdout', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I print an XML element in Python?',
      a: 'For a quick look: ET.dump(elem). For a value you can print, log or compare: ET.tostring(elem, encoding="unicode"). Call ET.indent(elem) first for line breaks and indentation.',
    },
    {
      q: 'Why does ET.dump() return None?',
      a: 'It writes to standard output instead of returning a string. Use ET.tostring(elem, encoding="unicode") when you need the XML as a value.',
    },
    {
      q: 'Can I dump an ElementTree?',
      a: 'Yes — dump() accepts an ElementTree or an Element. It prints the root element (with its tail) and a final newline.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.dump',
    meta:  'xml.etree.ElementTree.dump',
  },
};
