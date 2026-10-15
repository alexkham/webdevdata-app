// content/reference/python/stdlib/xml-etree-elementtree/element-get.js — Element.get, set, keys, items, attrib

export const meta = {
  slug:        'element-get',
  name:        'Element.get',
  signature:   'Element.get(key, default=None) / Element.set(key, value) / Element.keys() / Element.items() / Element.attrib',
  blurb:       'Read and write XML attributes: get() with a default, set(), keys() and items() as lists, and the attrib dict itself.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'Element.get Element.set Element.keys Element.items Element.attrib elementtree get attribute value python xml attribute set attribute attrib dict namespaced attribute xml:lang element attributes list',
};

export const method = {
  slug:      'element-get',
  name:      'Element.get',
  signature: 'Element.get(key, default=None) / Element.set(key, value) / Element.keys() / Element.items() / Element.attrib',
  returns:   { type: 'str | default, None, list, list, dict', desc: 'get: the value or default; set: None; keys: the names; items: (name, value) tuples; attrib: the attribute dict.' },

  category:    'xml.etree.ElementTree method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'An element\'s attributes are a dict in elem.attrib. get(), set(), keys() and items() are shortcuts for it — get() never raises for a missing attribute, and every parsed value is a str.',

  covers: ['Element.get', 'Element.set', 'Element.keys', 'Element.items', 'Element.attrib'],

  cheat: {
    commonCall: "elem.get('id', 'unknown')",
    returns:    "the value as str, or the default (None) when it is missing",
    replaces:   "elem.attrib['id'] wrapped in try/except KeyError",
    watchOut:   'set() accepts any object, but tostring() can only serialize str values',
  },

  parameters: [
    { name: 'key',     type: 'str', required: true,  default: null,   desc: 'Attribute name; namespaced attributes use {uri}local (xml:lang is {http://www.w3.org/XML/1998/namespace}lang).' },
    { name: 'default', type: 'any', required: false, default: 'None', desc: 'get only: returned when the attribute is missing.' },
    { name: 'value',   type: 'str', required: true,  default: null,   desc: 'set only: the new value. Keep it a str — the serializer rejects other types.' },
  ],

  modes: [
    {
      id: 'read',
      label: 'get()',
      blurb: 'get() with and without a default, next to the whole attrib dict.',
      params: [
        { name: 'xml', type: 'str', hint: 'one element', input: 'text' },
        { name: 'key', type: 'str', hint: 'attribute name', input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nelem = ET.fromstring({$xml})\n(elem.get({$key}), elem.get({$key}, 'n/a'), elem.attrib)",
      cases: [
        { id: 'there',   label: 'present',     values: { xml: '<user id="7" role="admin"/>', key: 'role' } },
        { id: 'missing', label: 'missing',     values: { xml: '<user id="7" role="admin"/>', key: 'email' } },
        { id: 'lang',    label: 'xml:lang',    values: { xml: '<p xml:lang="fr">Bonjour</p>', key: 'xml:lang' } },
        { id: 'languri', label: '{uri}lang',   values: { xml: '<p xml:lang="fr">Bonjour</p>', key: '{http://www.w3.org/XML/1998/namespace}lang' } },
        { id: 'refs',    label: 'references',  values: { xml: '<a title="Tom &amp; Jerry &#9733;" note="tab&#9;kept"/>', key: 'title' } },
      ],
    },
    {
      id: 'set',
      label: 'set()',
      blurb: 'Set an attribute on <user id="7"/> and serialize: values are escaped for an attribute context.',
      params: [
        { name: 'key',   type: 'str', hint: 'attribute name', input: 'text' },
        { name: 'value', type: 'str', hint: 'new value',      input: 'text' },
      ],
      template: "import xml.etree.ElementTree as ET\nelem = ET.Element('user', id='7')\nelem.set({$key}, {$value})\n(elem.items(), ET.tostring(elem, encoding='unicode'))",
      cases: [
        { id: 'new',      label: 'new attribute', values: { key: 'role', value: 'admin' } },
        { id: 'replace',  label: 'replace id',    values: { key: 'id', value: '8' } },
        { id: 'escape',   label: 'special chars', values: { key: 'note', value: 'say "hi" & <bye>' } },
        { id: 'ns',       label: '{uri}name',     values: { key: '{http://www.w3.org/1999/xlink}href', value: '#top' } },
      ],
    },
    {
      id: 'list',
      label: 'keys() / items()',
      blurb: 'Both return lists in document order; namespaced names come out as {uri}local.',
      params: [{ name: 'xml', type: 'str', hint: 'one element', input: 'text' }],
      template: 'import xml.etree.ElementTree as ET\nelem = ET.fromstring({$xml})\n(elem.keys(), elem.items())',
      cases: [
        { id: 'plain', label: 'plain',     values: { xml: '<img src="a.png" alt="Logo" width="40"/>' } },
        { id: 'ns',    label: 'namespaced', values: { xml: '<a xmlns:p="urn:p" p:x="1" x="2"/>' } },
        { id: 'none',  label: 'none',      values: { xml: '<br/>' } },
      ],
    },
  ],
  demoExplainer: 'Prefixes are resolved while parsing, so get(\'xml:lang\') finds nothing — the key is {http://www.w3.org/XML/1998/namespace}lang. References in values are expanded (the amp entity becomes &, &#9; a tab). On output a {uri}name key gets a generated prefix — the xlink namespace is not one of ElementTree\'s well-known ones, so it becomes ns0 with an xmlns:ns0 declaration on the element.',

  patterns: [
    {
      name: 'Attribute with a fallback',
      desc: 'get() never raises; convert types yourself.',
      code: "import xml.etree.ElementTree as ET\nwidth = int(img.get('width', '0'))",
    },
    {
      name: 'Attributes as a plain dict',
      desc: 'attrib is a real dict; copy it if you will change the element.',
      code: "import xml.etree.ElementTree as ET\nrecords = [dict(item.attrib) for item in root.iter('item')]",
    },
    {
      name: 'Set numbers safely',
      desc: 'Store strings — the serializer rejects other types.',
      code: "import xml.etree.ElementTree as ET\nelem.set('count', str(len(items)))",
    },
    {
      name: 'Delete an attribute',
      desc: 'There is no del method — use the dict.',
      code: "import xml.etree.ElementTree as ET\nelem.attrib.pop('style', None)",
    },
  ],

  examples: [
    { title: 'get() with a default', code: "import xml.etree.ElementTree as ET\nelem = ET.fromstring('<user id=\"7\"/>')\n(elem.get('id'), elem.get('email'), elem.get('email', 'n/a'))", returns: "('7', None, 'n/a')" },
    { title: 'attrib is a dict', code: "import xml.etree.ElementTree as ET\nET.fromstring('<user id=\"7\" role=\"admin\"/>').attrib", returns: "{'id': '7', 'role': 'admin'}" },
    { title: 'keys() and items() are lists', code: "import xml.etree.ElementTree as ET\nelem = ET.Element('img', src='a.png', alt='Logo')\n(elem.keys(), elem.items())", returns: "(['src', 'alt'], [('src', 'a.png'), ('alt', 'Logo')])" },
    { title: 'set() then serialize: a newline becomes &#10;', code: "import xml.etree.ElementTree as ET\nelem = ET.Element('a')\nelem.set('title', 'line 1\\nline 2')\nET.tostring(elem, encoding='unicode')", returns: "'<a title=\"line 1&#10;line 2\" />'" },
    { title: 'Order is kept (3.8+)', code: "import xml.etree.ElementTree as ET\nelem = ET.Element('b', z='1', a='2')\nelem.set('m', '3')\nET.tostring(elem, encoding='unicode')", returns: "'<b z=\"1\" a=\"2\" m=\"3\" />'" },
    { title: 'Tabs and newlines in values become spaces when parsed', code: "import xml.etree.ElementTree as ET\nET.fromstring('<a b=\" x\\ty \"/>').get('b')", returns: "' x y '" },
    { title: 'xml:lang has a namespace', code: "import xml.etree.ElementTree as ET\nET.fromstring('<p xml:lang=\"en\"/>').keys()", returns: "['{http://www.w3.org/XML/1998/namespace}lang']" },
  ],

  pitfalls: [
    {
      name: 'Setting a non-str value',
      desc: 'set() stores anything, but the serializer only handles str — the error appears later, in tostring() or write().',
      wrong: { label: "set('age', 3)", code: "import xml.etree.ElementTree as ET\nelem = ET.Element('user')\nelem.set('age', 3)\nET.tostring(elem)", output: 'TypeError: cannot serialize 3 (type int)' },
      fix:   { label: "set('age', str(3))", code: "import xml.etree.ElementTree as ET\nelem = ET.Element('user')\nelem.set('age', str(3))\nET.tostring(elem)", output: "b'<user age=\"3\" />'" },
    },
    {
      name: 'Indexing an element by attribute name',
      desc: 'elem[...] indexes children. Attributes go through get() or attrib.',
      wrong: { label: "elem['id']", code: "import xml.etree.ElementTree as ET\nET.fromstring('<user id=\"7\"/>')['id']", output: 'TypeError: element indices must be integers' },
      fix:   { label: "elem.get('id')", code: "import xml.etree.ElementTree as ET\nET.fromstring('<user id=\"7\"/>').get('id')", output: "'7'" },
    },
    {
      name: 'attrib[...] for an optional attribute',
      desc: 'The dict raises KeyError for a missing key; get() returns the default.',
      wrong: { label: "attrib['class']", code: "import xml.etree.ElementTree as ET\nET.fromstring('<div/>').attrib['class']", output: "KeyError: 'class'" },
      fix:   { label: "get('class', '')", code: "import xml.etree.ElementTree as ET\nET.fromstring('<div/>').get('class', '')", output: "''" },
    },
    {
      name: 'Looking up a prefixed attribute name',
      desc: 'Prefixes are gone after parsing; use the {uri}local key.',
      wrong: { label: "get('p:x')", code: "import xml.etree.ElementTree as ET\nprint(ET.fromstring('<a xmlns:p=\"urn:p\" p:x=\"1\"/>').get('p:x'))", output: 'None' },
      fix:   { label: "get('{urn:p}x')", code: "import xml.etree.ElementTree as ET\nET.fromstring('<a xmlns:p=\"urn:p\" p:x=\"1\"/>').get('{urn:p}x')", output: "'1'" },
    },
  ],

  when: {
    use: [
      'Reading optional attributes with a fallback (get)',
      'Adding or changing attributes before serializing (set)',
      'Converting all attributes to a dict or list (attrib, items)',
    ],
    avoid: [
      'Child elements → find(), findall() or iteration',
      'Element text → elem.text / findtext()',
      'Attribute selection inside a path ("item/@id" is not supported) → find the element, then get()',
    ],
  },

  notes: {
    cpython:      'The C Element stores attributes in a dict created on first use; keys() and items() return list(attrib.keys()) / list(attrib.items()) — real lists, in insertion order',
    'Parsing':    'Values are always str: references are expanded and each tab, newline or CR LF becomes one space (XML attribute-value normalization for CDATA attributes)',
    'Serializing': '_escape_attrib replaces & < > " and writes \\r, \\n, \\t as &#13; &#10; &#09; so they survive a round trip',
    'clear()':    'Element.clear() drops the attribute dict and starts an empty one — a reference to the old elem.attrib keeps its items',
  },

  related: [
    { name: 'Element.find',    slug: 'element-find',   when: "Find elements by attribute value: [@id='7']" },
    { name: 'Element.text',    slug: 'element-tag',    when: 'The other place data lives' },
    { name: 'Element',         slug: 'element',        when: 'Element(tag, attrib, **extra) sets attributes at creation' },
    { name: 'QName',           slug: 'qname',          when: 'Namespaced attribute names and values' },
    { name: 'dict.get',        slug: 'dict',           when: 'What Element.get mirrors', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I get an attribute value with ElementTree?',
      a: "elem.get('name') returns the value or None; elem.get('name', default) returns your default instead. elem.attrib['name'] works too but raises KeyError when the attribute is missing.",
    },
    {
      q: 'How do I get all attributes of an element as a dictionary?',
      a: 'elem.attrib is already a dict (dict(elem.attrib) for a copy). elem.items() gives the same pairs as a list of tuples and elem.keys() the names.',
    },
    {
      q: 'Why is get() returning None for an attribute that is in the XML?',
      a: 'The attribute is namespaced: p:x or xml:lang is stored as {uri}x — get(\'{http://www.w3.org/XML/1998/namespace}lang\') for xml:lang. Check elem.keys() to see the stored names.',
    },
    {
      q: 'How do I remove an attribute from an Element?',
      a: "Use the dict: del elem.attrib['name'] or elem.attrib.pop('name', None).",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element.get',
    meta:  'Element.get / set / keys / items / attrib',
  },
};
