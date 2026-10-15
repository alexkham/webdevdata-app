// content/reference/python/stdlib/xml-etree-elementtree/qname.js — QName

export const meta = {
  slug:        'qname',
  name:        'xml.etree.ElementTree.QName',
  signature:   'xml.etree.ElementTree.QName(text_or_uri, tag=None)',
  blurb:       'A wrapper for a qualified name in {uri}local form. Use it as an attribute value (xsi:type="xs:int") so the serializer declares the namespace and writes the prefix for you.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'xml.etree.ElementTree.QName ET.QName qname qualified name namespace prefix attribute value xsi:type xs:string {uri}local python xml namespace serialization ns0 prefix',
};

export const method = {
  slug:      'qname',
  name:      'xml.etree.ElementTree.QName',
  signature: 'xml.etree.ElementTree.QName(text_or_uri, tag=None)',
  returns:   { type: 'QName', desc: 'An object with one attribute, text ("{uri}local"). It compares, hashes and sorts like that string.' },

  category:    'xml.etree.ElementTree class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Tags and attribute names in {uri}local form are always namespace-aware on output. Attribute values are plain text — unless they are QName objects: then the serializer maps the URI to a prefix, adds the xmlns declaration and writes prefix:local.',

  covers: ['QName'],

  cheat: {
    commonCall: "elem.set(ET.QName(XSI, 'type'), ET.QName(XS, 'int'))",
    returns:    'a QName whose text is "{uri}local"',
    replaces:   'hard-coding prefixes like "xs:int" and their xmlns declarations',
    watchOut:   'The first argument is the namespace URI, not a prefix',
  },

  parameters: [
    { name: 'text_or_uri', type: 'str', required: true,  default: null,   desc: 'The whole name as "{uri}local" — or, when tag is given, just the URI.' },
    { name: 'tag',         type: 'str', required: false, default: 'None', desc: 'The local name. When it is given (and not empty) the text becomes "{text_or_uri}tag".' },
  ],

  modes: [
    {
      id: 'xsi',
      label: 'QName attribute value',
      blurb: 'The classic use: an xsi:type attribute whose value names an XML Schema type. Type a type name and a text.',
      params: [
        { name: 'type', type: 'str', hint: 'XML Schema type', input: 'text' },
        { name: 'text', type: 'str', hint: 'element text',    input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nXSI = 'http://www.w3.org/2001/XMLSchema-instance'\nXS = 'http://www.w3.org/2001/XMLSchema'\nvalue = ET.Element('value')\nvalue.set(ET.QName(XSI, 'type'), ET.QName(XS, {$type}))\nvalue.text = {$text}\nET.tostring(value, encoding='unicode')",
      cases: [
        { id: 'int',    label: 'xs:int',    values: { type: 'int', text: '42' } },
        { id: 'string', label: 'xs:string', values: { type: 'string', text: 'hello' } },
        { id: 'date',   label: 'xs:date',   values: { type: 'date', text: '2024-05-01' } },
      ],
    },
    {
      id: 'tag',
      label: 'QName as a tag',
      blurb: 'Build QName(uri, local), show it and use it as an element tag.',
      params: [
        { name: 'uri',   type: 'str', hint: 'namespace URI', input: 'text' },
        { name: 'local', type: 'str', hint: 'local name',    input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nq = ET.QName({$uri}, {$local})\n(q, ET.tostring(ET.Element(q), encoding='unicode'))",
      cases: [
        { id: 'urn',   label: 'any URI',          values: { uri: 'urn:shop', local: 'item' } },
        { id: 'xhtml', label: 'well-known URI',   values: { uri: 'http://www.w3.org/1999/xhtml', local: 'p' } },
        { id: 'empty', label: 'empty local name', values: { uri: 'urn:shop', local: '' } },
      ],
    },
  ],
  demoExplainer: 'The XML Schema and XML Schema instance namespaces are among ElementTree\'s well-known namespaces, so they get the prefixes xs and xsi; declarations are written in prefix order. Any other URI gets a generated ns0, ns1... prefix, and the XHTML namespace gets html. With an empty local name the tag argument is ignored and the first argument becomes the whole name — here the tag "urn:shop", written as is.',

  patterns: [
    {
      name: 'xsi:type on an element',
      desc: 'Both the attribute name and its value are qualified names.',
      code: "import xml.etree.ElementTree as ET\nXSI = 'http://www.w3.org/2001/XMLSchema-instance'\nXS = 'http://www.w3.org/2001/XMLSchema'\nelem.set(ET.QName(XSI, 'type'), ET.QName(XS, 'decimal'))",
    },
    {
      name: 'Readable namespaced tags',
      desc: 'Build tags from a namespace constant instead of formatting "{%s}%s" strings.',
      code: "import xml.etree.ElementTree as ET\nATOM = 'http://www.w3.org/2005/Atom'\nfeed = ET.Element(ET.QName(ATOM, 'feed'))\nET.SubElement(feed, ET.QName(ATOM, 'title')).text = 'News'",
    },
  ],

  examples: [
    { title: 'text, str() and repr()', code: "import xml.etree.ElementTree as ET\nq = ET.QName('urn:x', 'item')\n(q.text, str(q), repr(q))", returns: "('{urn:x}item', '{urn:x}item', \"<QName '{urn:x}item'>\")" },
    { title: 'Equal to its {uri}local string', code: "import xml.etree.ElementTree as ET\n(ET.QName('{urn:x}item') == ET.QName('urn:x', 'item'), ET.QName('{urn:x}item') == '{urn:x}item')", returns: '(True, True)' },
    { title: 'An xsi:type attribute', code: "import xml.etree.ElementTree as ET\nXSI = 'http://www.w3.org/2001/XMLSchema-instance'\nXS = 'http://www.w3.org/2001/XMLSchema'\nvalue = ET.Element('value')\nvalue.set(ET.QName(XSI, 'type'), ET.QName(XS, 'int'))\nvalue.text = '42'\nET.tostring(value, encoding='unicode')", returns: "'<value xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"xs:int\">42</value>'" },
    { title: 'Tag and value share the generated prefix', code: "import xml.etree.ElementTree as ET\nroot = ET.Element(ET.QName('urn:x', 'root'))\nroot.set('ref', ET.QName('urn:x', 'other'))\nET.tostring(root, encoding='unicode')", returns: "'<ns0:root xmlns:ns0=\"urn:x\" ref=\"ns0:other\" />'" },
    { title: 'A QName tag stays a QName', code: "import xml.etree.ElementTree as ET\ne = ET.Element(ET.QName('urn:x', 'a'))\n(type(e.tag).__name__, e.tag == '{urn:x}a')", returns: "('QName', True)" },
    { title: 'Searching still works with the string form', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('root')\nET.SubElement(root, ET.QName('urn:x', 'a'))\nroot.find('{urn:x}a') is not None", returns: 'True' },
    { title: 'Parsing gives prefixed values back as plain text', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a xmlns:x=\"urn:x\" ref=\"x:other\"/>').get('ref')", returns: "'x:other'" },
  ],

  pitfalls: [
    {
      name: 'A {uri}local string as an attribute value',
      desc: 'Only tags and attribute names are namespace-processed. A plain string value is written literally.',
      wrong: { label: "set('ref', '{urn:x}other')", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('root')\nroot.set('ref', '{urn:x}other')\nET.tostring(root, encoding='unicode')", output: "'<root ref=\"{urn:x}other\" />'" },
      fix:   { label: 'QName value', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('root')\nroot.set('ref', ET.QName('urn:x', 'other'))\nET.tostring(root, encoding='unicode')", output: "'<root xmlns:ns0=\"urn:x\" ref=\"ns0:other\" />'" },
    },
    {
      name: 'Passing a prefix instead of the URI',
      desc: 'QName knows nothing about prefixes: "xs" becomes the namespace URI itself, and the serializer invents a prefix for it.',
      wrong: { label: "QName('xs', 'string')", code: "import xml.etree.ElementTree as ET\nroot = ET.Element('value')\nroot.set('{http://www.w3.org/2001/XMLSchema-instance}type', ET.QName('xs', 'string'))\nET.tostring(root, encoding='unicode')", output: "'<value xmlns:ns1=\"xs\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ns1:string\" />'" },
      fix:   { label: 'the namespace URI', code: "import xml.etree.ElementTree as ET\nroot = ET.Element('value')\nroot.set('{http://www.w3.org/2001/XMLSchema-instance}type', ET.QName('http://www.w3.org/2001/XMLSchema', 'string'))\nET.tostring(root, encoding='unicode')", output: "'<value xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"xs:string\" />'" },
    },
    {
      name: 'A QName as element text',
      desc: 'Only attribute values may be QNames; text must be a str.',
      wrong: { label: 'text = QName', code: "import xml.etree.ElementTree as ET\nr = ET.Element('r')\nr.text = ET.QName('urn:x', 'a')\nET.tostring(r, encoding='unicode')", output: "TypeError: cannot serialize <QName '{urn:x}a'> (type QName)" },
      fix:   { label: 'use an attribute', code: "import xml.etree.ElementTree as ET\nr = ET.Element('r')\nr.set('ref', ET.QName('urn:x', 'a'))\nET.tostring(r, encoding='unicode')", output: "'<r xmlns:ns0=\"urn:x\" ref=\"ns0:a\" />'" },
    },
  ],

  when: {
    use: [
      'Attribute values that are qualified names: xsi:type, SOAP and WSDL references, XML Schema documents',
      'Building namespaced tags without string formatting',
    ],
    avoid: [
      'Choosing the prefix itself → register_namespace() (global) or default_namespace= on tostring()',
      'Reading documents — parsed attribute values stay plain "prefix:local" strings; resolve them yourself',
    ],
  },

  notes: {
    cpython:     'A small pure-Python class: text = "{%s}%s" % (text_or_uri, tag) if tag else text_or_uri; __str__ returns text, __repr__ is <QName \'...\'>, and __eq__, __hash__ and the total ordering compare text (with another QName or a plain string)',
    'Serialization': 'tostring() and write() collect QName tags, attribute names and attribute values while choosing prefixes: well-known URIs (xml, html, rdf, wsdl, xs, xsi, dc, plus anything registered) get their prefix; any other URI gets "ns" plus the number of namespaces collected so far (ns0, ns1, ...)',
    'Text':      'QName is not accepted as element text or tail: the serializer raises TypeError: cannot serialize ...',
  },

  related: [
    { name: 'register_namespace', slug: 'register_namespace', when: 'Pick the prefix a URI is written with' },
    { name: 'tostring',           slug: 'tostring',           when: 'default_namespace and the ns0 prefixes' },
    { name: 'Element.get / set',  slug: 'element-get',        when: 'Setting attributes' },
    { name: 'Element.tag',        slug: 'element-tag',        when: 'The {uri}local tag form' },
  ],

  faq: [
    {
      q: 'How do I write xsi:type with ElementTree?',
      a: "Use QName for both the attribute name and the value: elem.set(ET.QName(XSI, 'type'), ET.QName(XS, 'int')) with XSI and XS the two schema namespace URIs. The serializer then declares xmlns:xsi and xmlns:xs and writes xsi:type=\"xs:int\".",
    },
    {
      q: 'What does ET.QName do?',
      a: 'It wraps a name in {uri}local form. As a tag it behaves like the plain string; as an attribute value it tells the serializer to translate the URI into a prefix, declare it, and write prefix:local instead of the literal text.',
    },
    {
      q: 'Why do my namespaces come out as ns0, ns1?',
      a: 'The serializer invents ns0, ns1, ... for every namespace URI it has no prefix for. Register one with ET.register_namespace(prefix, uri), or pass default_namespace=uri to tostring() / write() for the main namespace.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.QName',
    meta:  'xml.etree.ElementTree.QName',
  },
};
