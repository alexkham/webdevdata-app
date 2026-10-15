// content/reference/python/stdlib/xml-etree-elementtree/element.js

export const meta = {
  slug:        'element',
  name:        'xml.etree.ElementTree.Element',
  signature:   'xml.etree.ElementTree.Element(tag, attrib={}, **extra)',
  blurb:       'One XML element: a tag, an attribute dict, text, tail, and a list of child elements. Everything you parse or build is made of Elements.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.Element ET.Element element class create xml element python new element attrib extra keyword attributes len children index slice element is list like truth value deprecationwarning compare elements deepcopy',
};

export const method = {
  slug:      'element',
  name:      'xml.etree.ElementTree.Element',
  signature: 'xml.etree.ElementTree.Element(tag, attrib={}, **extra)',
  returns:   { type: 'Element', desc: 'A new element with no children, text None and tail None.' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Element is a cross between a list and a dict: it is a sequence of its child elements (len, indexing, slicing, iteration) and carries a dict of attributes. The C accelerator provides the class; its methods find, iter, get, append and friends have their own pages.',

  covers: ['Element'],

  cheat: {
    commonCall: "ET.Element('item', id='7')",
    returns:    "an Element — repr <Element 'item' at 0x…>",
    replaces:   'building XML with string formatting',
    watchOut:   'attrib must be a dict; == compares identity, not content',
  },

  parameters: [
    { name: 'tag',     type: 'str',  required: true,  default: null, desc: 'Element name ({uri}local for a namespaced element). Not validated — anything is accepted until serialization.' },
    { name: 'attrib',  type: 'dict', required: false, default: '{}', desc: 'Attributes; the dict is copied. Anything but a dict raises TypeError.' },
    { name: '**extra', type: 'str',  required: false, default: null, desc: 'More attributes as keyword arguments; they override attrib entries with the same name.' },
  ],

  modes: [
    {
      id: 'create',
      label: 'Element()',
      blurb: 'Create an element from a tag, an attrib dict and a keyword attribute, then serialize it.',
      params: [
        { name: 'tag',   type: 'str', hint: 'tag',             input: 'text' },
        { name: 'key',   type: 'str', hint: 'attribute name',  input: 'text' },
        { name: 'value', type: 'str', hint: 'attribute value', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\ne = ET.Element({$tag}, {{$key}: {$value}}, version='1')\n(e.tag, e.attrib, len(e), ET.tostring(e, encoding='unicode'))",
      cases: [
        { id: 'plain', label: 'plain',           values: { tag: 'item', key: 'sku', value: 'A1' } },
        { id: 'clash', label: 'same key twice',  values: { tag: 'item', key: 'version', value: '0' } },
        { id: 'ns',    label: '{uri}tag',        values: { tag: '{urn:inv}item', key: 'sku', value: 'A1' } },
        { id: 'bad',   label: 'broken {uri',     values: { tag: '{urn:inv', key: 'sku', value: 'A1' } },
      ],
    },
    {
      id: 'sequence',
      label: 'as a list',
      blurb: 'len(), indexing and slicing work on the children.',
      params: [
        { name: 'xml',   type: 'str', hint: 'an XML document', input: 'text' },
        { name: 'index', type: 'int', hint: 'child index',     input: 'number' },
      ],
      template: 'import xml.etree.ElementTree as ET\nroot = ET.fromstring({$xml})\n(len(root), root[{$index}].tag, [c.tag for c in root[1:]])',
      cases: [
        { id: 'first', label: 'root[0]',  values: { xml: '<a><b/><c/><d/></a>', index: '0' } },
        { id: 'last',  label: 'root[-1]', values: { xml: '<a><b/><c/><d/></a>', index: '-1' } },
        { id: 'out',   label: 'root[5]',  values: { xml: '<a><b/><c/><d/></a>', index: '5' } },
      ],
    },
  ],
  demoExplainer: 'Keyword attributes are merged after the dict, so version=\'1\' replaces a "version" key from the dict (keeping its position). The tag is not checked when the element is created: a tag like {urn:inv without its closing brace only fails when tostring() tries to split it, with ValueError: not enough values to unpack (expected 2, got 1). Indexing past the last child raises IndexError: child index out of range.',

  patterns: [
    {
      name: 'Create with attributes',
      desc: 'Keyword arguments for plain names, a dict for names that are not identifiers.',
      code: "import xml.etree.ElementTree as ET\nlink = ET.Element('a', {'xml:lang': 'en', 'data-id': '7'}, href='/home')",
    },
    {
      name: 'Check for children',
      desc: 'Do not rely on truth value (deprecated); use len().',
      code: "import xml.etree.ElementTree as ET\nif len(elem) == 0:\n    print('leaf element')",
    },
    {
      name: 'Independent copy of a subtree',
      desc: 'copy.deepcopy copies children, attributes and text.',
      code: "import copy\nimport xml.etree.ElementTree as ET\ntemplate = ET.fromstring('<row><cell/></row>')\nrow = copy.deepcopy(template)",
    },
    {
      name: 'Compare two trees',
      desc: 'Elements compare by identity; compare a serialization instead.',
      code: "import xml.etree.ElementTree as ET\nsame = ET.canonicalize(ET.tostring(a)) == ET.canonicalize(ET.tostring(b))",
    },
  ],

  examples: [
    { title: 'attrib plus keyword attributes', code: "import xml.etree.ElementTree as ET\nET.Element('item', {'sku': 'A1'}, version='1').attrib", returns: "{'sku': 'A1', 'version': '1'}" },
    { title: 'The attrib dict is copied', code: "import xml.etree.ElementTree as ET\nd = {'x': '1'}\ne = ET.Element('a', d)\nd['x'] = '2'\ne.get('x')", returns: "'1'" },
    { title: 'A sequence of children', code: "import xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b/><c/><d/></a>')\n(len(root), root[0].tag, root[-1].tag, [c.tag for c in root[1:]])", returns: "(3, 'b', 'd', ['c', 'd'])" },
    { title: 'Parsed elements are Element instances', code: "import xml.etree.ElementTree as ET\nisinstance(ET.fromstring('<a/>'), ET.Element)", returns: 'True' },
    { title: 'deepcopy gives an independent tree', code: "import copy\nimport xml.etree.ElementTree as ET\nroot = ET.fromstring('<a><b>x</b></a>')\nc = copy.deepcopy(root)\nc[0].text = 'y'\n(root[0].text, c[0].text)", returns: "('x', 'y')" },
    { title: 'Index past the end', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a><b/></a>')[5]", returns: 'IndexError: child index out of range' },
  ],

  pitfalls: [
    {
      name: 'Passing attributes positionally',
      desc: 'The second positional argument is the attrib dict; a string there is a TypeError.',
      wrong: { label: "Element('item', 'sku')", code: "import xml.etree.ElementTree as ET\nET.Element('item', 'sku')", output: 'TypeError: Element() argument 2 must be dict, not str' },
      fix:   { label: "Element('item', sku='A1')", code: "import xml.etree.ElementTree as ET\nET.Element('item', sku='A1').attrib", output: "{'sku': 'A1'}" },
    },
    {
      name: 'Comparing elements with ==',
      desc: 'Element defines no equality: two identical-looking elements are different objects.',
      wrong: { label: 'a == b', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a x=\"1\"/>') == ET.fromstring('<a x=\"1\"/>')", output: 'False' },
      fix:   { label: 'compare tostring()', code: "import xml.etree.ElementTree as ET\nET.tostring(ET.fromstring('<a x=\"1\"/>')) == ET.tostring(ET.fromstring('<a x=\"1\"/>'))", output: 'True' },
    },
    {
      name: 'Non-str attribute values',
      desc: 'Element() accepts any value; the error only comes when serializing.',
      wrong: { label: "{'x': 1}", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a', {'x': 1}))", output: 'TypeError: cannot serialize 1 (type int)' },
      fix:   { label: "{'x': '1'}", code: "import xml.etree.ElementTree as ET\nET.tostring(ET.Element('a', {'x': '1'}))", output: "b'<a x=\"1\" />'" },
    },
  ],

  when: {
    use: [
      'A standalone root element you will fill and serialize',
      'Elements to append(), insert() or extend() somewhere',
      'Reading parsed trees — every node is an Element',
    ],
    avoid: [
      'Creating a child of an existing element → SubElement(parent, tag)',
      'File input/output → ElementTree (parse, write)',
      'Testing "does it have children" with if elem: → len(elem); "was it found" → elem is not None',
    ],
  },

  notes: {
    cpython:      'class Element in Lib/xml/etree/ElementTree.py is replaced at import time by the C type from Modules/_elementtree.c (the Python version stays available as ET._Element_Py)',
    'Truth value': 'Testing an Element in a boolean context emits DeprecationWarning since 3.12; the docs say all elements will test True in a future release',
    'Equality':   'No __eq__ or __hash__ override: == is identity, and elements can be dict keys by identity',
    'repr':       "<Element 'tag' at 0x…> — the address differs every run",
  },

  related: [
    { name: 'SubElement',     slug: 'subelement',     when: 'Create a child in one step' },
    { name: 'Element.find',   slug: 'element-find',   when: 'Search an element' },
    { name: 'Element.append', slug: 'element-append', when: 'Change the children' },
    { name: 'Element.get',    slug: 'element-get',    when: 'Attributes' },
    { name: 'Element.tag',    slug: 'element-tag',    when: 'tag, text and tail' },
    { name: 'ElementTree',    slug: 'elementtree',    when: 'Wraps a root Element for file I/O' },
  ],

  faq: [
    {
      q: 'How do I create an XML element in Python?',
      a: "ET.Element('tag', attr='value') creates a standalone element; ET.SubElement(parent, 'tag') creates one already appended to parent. Set .text for its content and serialize with ET.tostring(root, encoding='unicode').",
    },
    {
      q: 'Why does "if element:" behave strangely?',
      a: 'An Element is a sequence of its children, so one without children is falsy — even though it exists. Python 3.12+ emits a DeprecationWarning for this test. Use "elem is not None" after find() and len(elem) to count children.',
    },
    {
      q: 'How do I copy an Element?',
      a: 'copy.deepcopy(elem) for an independent subtree; copy.copy(elem) makes a new element that shares the same child objects.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element',
    meta:  'xml.etree.ElementTree.Element',
  },
};
