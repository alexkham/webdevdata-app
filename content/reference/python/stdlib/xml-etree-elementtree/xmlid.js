// content/reference/python/stdlib/xml-etree-elementtree/xmlid.js — XMLID

export const meta = {
  slug:        'xmlid',
  name:        'xml.etree.ElementTree.XMLID',
  signature:   'xml.etree.ElementTree.XMLID(text, parser=None)',
  blurb:       'Parse an XML string and also get a dict mapping every id attribute value to its element — fromstring() plus an id index in one call.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.XMLID ET.XMLID xmlid id attribute dictionary find element by id python xml getElementById lookup elements by id index',
};

export const method = {
  slug:      'xmlid',
  name:      'xml.etree.ElementTree.XMLID',
  signature: 'xml.etree.ElementTree.XMLID(text, parser=None)',
  returns:   { type: 'tuple[Element, dict]', desc: '(root, ids): the root element and a dict {id value: element}.' },

  category:    'xml.etree.ElementTree function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'XMLID() parses like fromstring(), then walks the tree and records each element whose id attribute is not empty. Lookups by id become dictionary lookups — ElementTree\'s answer to getElementById.',

  covers: ['XMLID'],

  cheat: {
    commonCall: "root, ids = ET.XMLID(text)",
    returns:    'a (root, {id: element}) tuple',
    replaces:   "root.find(\".//*[@id='x']\") for repeated lookups",
    watchOut:   'Only the attribute named exactly id counts — not xml:id, not ID',
  },

  parameters: [
    { name: 'text',   type: 'str | bytes', required: true,  default: null,   desc: 'The XML document.' },
    { name: 'parser', type: 'XMLParser',   required: false, default: 'None', desc: 'A parser to use instead of XMLParser(target=TreeBuilder()).' },
  ],

  modes: [
    {
      id: 'ids',
      label: 'XMLID()',
      blurb: 'Parse your XML and show the id index as {id: (tag, text)}.',
      params: [{ name: 'xml', type: 'str', hint: 'an XML document', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID({$xml})\n{key: (elem.tag, elem.text) for key, elem in ids.items()}',
      cases: [
        { id: 'sections', label: 'sections',        values: { xml: '<doc><sec id="intro">Hi</sec><sec id="end">Bye</sec></doc>' } },
        { id: 'nested',   label: 'any depth',       values: { xml: '<doc id="top"><list><item id="i1">A</item></list></doc>' } },
        { id: 'dup',      label: 'duplicate ids',   values: { xml: '<doc><a id="b">1</a><a id="a">2</a><a id="b">3</a></doc>' } },
        { id: 'ignored',  label: 'not counted',     values: { xml: '<doc><p id="">x</p><p xml:id="a">y</p><p ID="B">z</p></doc>' } },
      ],
    },
    {
      id: 'lookup',
      label: 'look up an id',
      blurb: 'Look up one id in the dict XMLID() returns.',
      params: [
        { name: 'xml', type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'key', type: 'str', hint: 'id to look up',   input: 'text' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID({$xml})\nelem = ids[{$key}]\n(elem.tag, elem.attrib)',
      cases: [
        { id: 'found',   label: 'found',   values: { xml: '<menu><item id="save" key="S"/><item id="quit" key="Q"/></menu>', key: 'quit' } },
        { id: 'missing', label: 'missing', values: { xml: '<menu><item id="save" key="S"/></menu>', key: 'open' } },
      ],
    },
  ],
  demoExplainer: 'Elements are visited in document order, so with duplicate ids the later element wins while the key keeps the place where it was first inserted (normal dict behaviour) — XMLID does not complain about duplicates. An empty id is skipped (the check is if id:), xml:id is the namespaced attribute {http://www.w3.org/XML/1998/namespace}id, and attribute names are case-sensitive, so none of the three in "not counted" is indexed. A missing key is an ordinary KeyError.',

  patterns: [
    {
      name: 'Resolve references by id',
      desc: 'Index once, then follow idref-style attributes.',
      code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID(xml_text)\nfor link in root.iter('link'):\n    target = ids.get(link.get('ref'))\n    if target is not None:\n        print(link.get('ref'), '->', target.tag)",
    },
    {
      name: 'Index another attribute',
      desc: 'The same idea for any attribute — a dict comprehension over iter().',
      code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring(xml_text)\nby_key = {e.get('key'): e for e in root.iter() if e.get('key')}",
    },
  ],

  examples: [
    { title: 'Root and id index', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><sec id=\"intro\">Hi</sec><sec id=\"end\">Bye</sec></doc>')\n(root.tag, {key: elem.text for key, elem in ids.items()})", returns: "('doc', {'intro': 'Hi', 'end': 'Bye'})" },
    { title: 'It returns a 2-tuple', code: "import xml.etree.ElementTree as ET\nresult = ET.XMLID('<a id=\"x\"/>')\n(type(result).__name__, len(result))", returns: "('tuple', 2)" },
    { title: 'The values are the tree\'s own elements', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><a id=\"1\"/></doc>')\nids['1'] is root[0]", returns: 'True' },
    { title: 'Ids at any depth, in document order', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><a id=\"1\"/><b><c id=\"2\"/></b></doc>')\nlist(ids)", returns: "['1', '2']" },
    { title: 'A later duplicate replaces the earlier one', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc id=\"d\"><p id=\"d\">x</p></doc>')\nids['d'].tag", returns: "'p'" },
    { title: 'Empty ids and xml:id are not indexed', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><p id=\"\">x</p><p xml:id=\"a\">y</p></doc>')\nids", returns: '{}' },
    { title: 'The same index by hand', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<doc><a id=\"1\"/><b><c id=\"2\"/></b></doc>')\n{e.get('id'): e.tag for e in root.iter() if e.get('id')}", returns: "{'1': 'a', '2': 'c'}" },
  ],

  pitfalls: [
    {
      name: 'Expecting xml:id to be indexed',
      desc: 'XMLID looks only at the plain id attribute. For xml:id, build the dict yourself with the namespaced key.',
      wrong: { label: 'XMLID with xml:id', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><p xml:id=\"a\">y</p></doc>')\nids", output: '{}' },
      fix:   { label: 'index {XML namespace}id', code: "import xml.etree.ElementTree as ET\nXML_ID = '{http://www.w3.org/XML/1998/namespace}id'\nroot = ET.fromstring('<doc><p xml:id=\"a\">y</p></doc>')\n{e.get(XML_ID): e.text for e in root.iter() if e.get(XML_ID)}", output: "{'a': 'y'}" },
    },
    {
      name: 'Unpacking the result as an element',
      desc: 'XMLID returns a tuple, not the root element.',
      wrong: { label: 'root = XMLID(...)', code: "import xml.etree.ElementTree as ET\nroot = ET.XMLID('<doc><a id=\"1\"/></doc>')\nroot.find('a')", output: "AttributeError: 'tuple' object has no attribute 'find'" },
      fix:   { label: 'root, ids = XMLID(...)', code: "import xml.etree.ElementTree as ET\nroot, ids = ET.XMLID('<doc><a id=\"1\"/></doc>')\nroot.find('a').get('id')", output: "'1'" },
    },
  ],

  when: {
    use: [
      'Documents that cross-reference elements by id (links, footnotes, SVG defs, idrefs)',
      'Many lookups by id in the same document',
    ],
    avoid: [
      'One-off lookups → root.find(".//*[@id=\'x\']")',
      'Files → parse() first, then build the dict from tree.iter()',
      'xml:id or other attribute names → a dict comprehension over iter()',
    ],
  },

  notes: {
    cpython:     'XMLID(text, parser=None): parser = parser or XMLParser(target=TreeBuilder()); parser.feed(text); tree = parser.close(); then for elem in tree.iter(): id = elem.get("id"); if id: ids[id] = elem; returns (tree, ids)',
    'Duplicates': 'No check for unique ids: the last element with a given id wins',
    'Errors':    'Malformed text raises ParseError, exactly as fromstring() would',
  },

  related: [
    { name: 'fromstring',   slug: 'fromstring',   when: 'The same parsing, without the index' },
    { name: 'Element.find', slug: 'element-find', when: "[@id='x'] predicates for single lookups" },
    { name: 'Element.iter', slug: 'element-iter', when: 'Build indexes on other attributes' },
    { name: 'Element.get',  slug: 'element-get',  when: 'Read the id and other attributes' },
  ],

  faq: [
    {
      q: 'How do I find an XML element by its id in Python?',
      a: "For many lookups: root, ids = ET.XMLID(text) and then ids['the-id']. For a single lookup: root.find(\".//*[@id='the-id']\"). Both look at the attribute named id.",
    },
    {
      q: 'Does XMLID check that ids are unique?',
      a: 'No. Elements are visited in document order and a later element with the same id replaces the earlier one in the dict.',
    },
    {
      q: 'Can XMLID read a file?',
      a: 'No — it takes the XML text. For a file, parse it (tree = ET.parse(path)) and build the dict with {e.get("id"): e for e in tree.iter() if e.get("id")}.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.XMLID',
    meta:  'xml.etree.ElementTree.XMLID',
  },
};
